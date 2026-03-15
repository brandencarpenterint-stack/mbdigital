import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { Link } from 'react-router-dom';

const SPIN_COST = 100;

// The segments of the wheel
// 12 segments for a good spread
const SEGMENTS = [
    { label: 'BANKRUPT', type: 'loss', value: 0, color: '#ff0055', probability: 5 },
    { label: '50', type: 'win', value: 50, color: '#333333', probability: 15 },
    { label: 'SPIN AGAIN', type: 'special', value: 0, color: '#aa00ff', probability: 10 },
    { label: '100', type: 'win', value: 100, color: '#333333', probability: 20 },
    { label: '500', type: 'win', value: 500, color: '#00f2fe', probability: 5 },
    { label: '10', type: 'win', value: 10, color: '#333333', probability: 15 },
    { label: '10,000', type: 'jackpot', value: 10000, color: '#FFD700', probability: 0.1 },
    { label: '50', type: 'win', value: 50, color: '#333333', probability: 15 },
    { label: '250', type: 'win', value: 250, color: '#00f2fe', probability: 5 },
    { label: 'BANKRUPT', type: 'loss', value: 0, color: '#ff0055', probability: 5 },
    { label: '1000', type: 'big_win', value: 1000, color: '#00f2fe', probability: 0.9 },
    { label: '10', type: 'win', value: 10, color: '#333333', probability: 4 },
];

// Normalize probabilities
const totalProb = SEGMENTS.reduce((sum, seg) => sum + seg.probability, 0);
const NORMALIZED_SEGMENTS = SEGMENTS.map(seg => ({ ...seg, normProb: seg.probability / totalProb }));

const DopamineWheel = () => {
    const { coins, addCoins } = useGamification();
    const { showToast } = useToast();
    const { playClick, playCoin, playWin, playError, playFanfare, playBoop } = useRetroSound();
    
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [lastPrize, setLastPrize] = useState(null);
    const controls = useAnimation();
    
    // Audio Context for the ticking sound
    const audioCtxRef = useRef(null);
    useEffect(() => {
        // Initialize AudioContext on first user interaction or mount if allowed
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const playTick = () => {
        try {
            if (!audioCtxRef.current) return;
            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.05);
            
            osc.start();
            osc.stop(audioCtxRef.current.currentTime + 0.05);
        } catch (e) {
            // ignore
        }
    };

    const spin = async () => {
        if (isSpinning) return;
        
        if (coins < SPIN_COST) {
            playError();
            showToast('NOT ENOUGH CREDITS', 'error');
            return;
        }

        // Deduct cost
        addCoins(-SPIN_COST);
        setIsSpinning(true);
        setLastPrize(null);
        playBoop();

        // Determine winner based on weighted probability
        const randomVal = Math.random();
        let probSum = 0;
        let winningIndex = 0;
        
        for (let i = 0; i < NORMALIZED_SEGMENTS.length; i++) {
            probSum += NORMALIZED_SEGMENTS[i].normProb;
            if (randomVal <= probSum) {
                winningIndex = i;
                break;
            }
        }

        const degreesPerSegment = 360 / SEGMENTS.length;
        // The pointer is at the TOP (0 degrees or 270 depending on drawing).
        // Let's assume 0 degrees is the right side in SVG, but we rotate the whole SVG so top is 0.
        // Actually, let's just rotate randomly multiple times.
        const spins = 5; // Base spins
        const segmentOffset = winningIndex * degreesPerSegment;
        
        // Add a random offset WITHIN the segment to make it look organic
        const randomOffsetWithinSegment = (Math.random() * (degreesPerSegment * 0.8)) - (degreesPerSegment * 0.4);
        
        // Final rotation calculation
        // We subtract the segment offset because if we want segment N at the top, we rotate the wheel backwards by N.
        // The pointer is at the top (which corresponds to the segment drawn starting at -90deg if we shift it).
        // We'll calculate it so it always lands exactly.
        const targetRotation = rotation + (360 * spins) - segmentOffset + randomOffsetWithinSegment;

        // Simulate ticking
        let tickInterval = setInterval(playTick, 100);
        setTimeout(() => clearInterval(tickInterval), 1500);
        setTimeout(() => { tickInterval = setInterval(playTick, 300); }, 1500);
        setTimeout(() => clearInterval(tickInterval), 3000);

        await controls.start({
            rotate: targetRotation,
            transition: {
                duration: 4,
                ease: [0.15, 0.85, 0.15, 1], // Custom slow down
            }
        });

        clearInterval(tickInterval);
        
        // Spin finished
        setRotation(targetRotation % 360);
        const wonSegment = SEGMENTS[winningIndex];
        setLastPrize(wonSegment);
        
        handleWin(wonSegment);
        setIsSpinning(false);
    };

    const handleWin = (segment) => {
        if (segment.type === 'jackpot') {
            playFanfare();
            triggerConfetti();
            triggerConfetti();
            addCoins(segment.value);
            showToast(`JACKPOT! +${segment.value} COINS!`, 'win');
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
        } else if (segment.type === 'big_win') {
            playWin();
            triggerConfetti();
            addCoins(segment.value);
            showToast(`BIG WIN! +${segment.value} COINS!`, 'win');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else if (segment.type === 'win') {
            if (segment.value >= SPIN_COST) {
                playCoin();
                if (navigator.vibrate) navigator.vibrate(50);
            } else {
                // Sad win
                playClick();
            }
            addCoins(segment.value);
        } else if (segment.type === 'special') {
            playBoop();
            showToast('SPIN AGAIN!', 'info');
            addCoins(SPIN_COST); // give the cost back
        } else {
            // Loss
            playError();
            if (navigator.vibrate) navigator.vibrate(200);
            showToast('BANKRUPT', 'error');
        }
    };

    // Calculate SVG paths
    const radius = 200;
    const center = 210; // 200 + 10 padding
    const renderSegments = useMemo(() => {
        const segs = [];
        const numSegments = SEGMENTS.length;
        const angle = 360 / numSegments;
        
        for (let i = 0; i < numSegments; i++) {
            const startAngle = (i * angle - 90) * (Math.PI / 180); // -90 to start at top
            const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
            
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
            
            // Text positioning
            const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180);
            const textX = center + (radius * 0.65) * Math.cos(midAngle);
            const textY = center + (radius * 0.65) * Math.sin(midAngle);
            const textRotate = (i * angle + angle / 2);

            segs.push(
                <g key={i}>
                    <path
                        d={pathData}
                        fill={SEGMENTS[i].color}
                        stroke="#111"
                        strokeWidth="2"
                    />
                    <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontFamily='"Orbitron", sans-serif'
                        fontSize={SEGMENTS[i].type === 'jackpot' ? '18px' : '14px'}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotate}, ${textX}, ${textY})`}
                        style={{ textShadow: '1px 1px 2px black' }}
                    >
                        {SEGMENTS[i].label}
                    </text>
                </g>
            );
        }
        return segs;
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top, #2b003b 0%, #000 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: '60px',
            fontFamily: '"Rajdhani", sans-serif',
            overflow: 'hidden'
        }}>
            <Link to="/arcade" style={{ position: 'absolute', top: 20, left: 20, color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>
                ← BACK
            </Link>

            <h1 style={{ color: 'white', textShadow: '0 0 20px var(--neon-pink)', fontFamily: '"Orbitron", sans-serif', fontSize: '3rem', margin: '0 0 10px 0' }}>
                WHEEL OF <span style={{ color: 'var(--neon-pink)' }}>DEGEN</span>
            </h1>
            
            <div style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '10px 20px', borderRadius: '20px',
                border: '1px solid var(--neon-gold)',
                color: 'var(--neon-gold)', fontWeight: 'bold', fontSize: '1.5rem',
                marginBottom: '40px',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
            }}>
                BALANCE: 🪙 {coins.toLocaleString()}
            </div>

            {/* THE WHEEL CONTAINER */}
            <div style={{ position: 'relative', width: 420, height: 420, filter: 'drop-shadow(0 0 30px rgba(255,0,85,0.4))' }}>
                {/* POINTER */}
                <div style={{
                    position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '20px solid transparent',
                    borderRight: '20px solid transparent',
                    borderTop: '40px solid var(--neon-gold)',
                    zIndex: 10,
                    filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))'
                }} />

                {/* SVG WHEEL */}
                <motion.div
                    animate={controls}
                    style={{ width: 420, height: 420 }}
                >
                    <svg width="420" height="420" viewBox="0 0 420 420">
                        <circle cx="210" cy="210" r="205" fill="#111" stroke="#ff0055" strokeWidth="10" />
                        {renderSegments}
                        {/* Center Hub */}
                        <circle cx="210" cy="210" r="30" fill="#222" stroke="var(--neon-gold)" strokeWidth="5" />
                        <circle cx="210" cy="210" r="10" fill="var(--neon-gold)" />
                    </svg>
                </motion.div>
            </div>

            {/* LAST PRIZE DISPLAY */}
            <div style={{ height: '60px', marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lastPrize && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1.2, 1], opacity: 1 }}
                        style={{
                            fontSize: '2rem', fontWeight: '900',
                            color: lastPrize.type === 'loss' ? '#ff0055' : 'var(--neon-green)',
                            textShadow: `0 0 20px ${lastPrize.type === 'loss' ? '#ff0055' : 'var(--neon-green)'}`,
                            fontFamily: '"Orbitron", sans-serif'
                        }}
                    >
                        {lastPrize.type === 'loss' ? '💀 BANKRUPT 💀' : 
                         lastPrize.type === 'special' ? '🔄 FREE SPIN 🔄' : 
                         `+${lastPrize.value} COINS`}
                    </motion.div>
                )}
            </div>

            {/* BUTTON */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={spin}
                disabled={isSpinning}
                style={{
                    marginTop: '20px',
                    padding: '20px 60px',
                    fontSize: '2rem',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: '900',
                    color: 'white',
                    background: isSpinning ? '#555' : 'linear-gradient(135deg, #ff0055 0%, #aa00ff 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: isSpinning ? 'default' : 'pointer',
                    boxShadow: isSpinning ? 'none' : '0 10px 30px rgba(255, 0, 85, 0.5)',
                    opacity: isSpinning ? 0.7 : 1,
                    textTransform: 'uppercase'
                }}
            >
                {isSpinning ? 'SPINNING...' : `SPIN (-${SPIN_COST})`}
            </motion.button>
            <p style={{ color: '#888', marginTop: '15px', fontSize: '0.9rem' }}>
                WARNING: HIGHLY ADDICTIVE. HOUSE ALWAYS WINS. 
            </p>
        </div>
    );
};

export default DopamineWheel;
