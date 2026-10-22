import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';

const CANVAS_WIDTH = 580;
const CANVAS_HEIGHT = 650;
const ROWS = 9;
const PEG_RADIUS = 5;
const BALL_RADIUS = 13;

const RISK_MODES = {
    NORMAL: {
        label: 'NORMAL',
        color: '#00ffcc',
        multipliers: [25, 8, 3, 1.5, 0.8, 0.4, 0.8, 1.5, 3, 8, 25]
    },
    HIGH: {
        label: 'HIGH ROLLER',
        color: '#ffaa00',
        multipliers: [50, 15, 5, 2, 0.4, 0.2, 0.4, 2, 5, 15, 50]
    },
    DEGEN: {
        label: 'DEGEN 100X',
        color: '#ff0055',
        multipliers: [100, 25, 7, 1.5, 0.2, 0, 0.2, 1.5, 7, 25, 100]
    }
};

const AVATARS = [
    { id: 'pulsar', name: 'Cyan Pulsar', color: '#00e5ff', icon: '💠', glow: 'rgba(0, 229, 255, 0.8)' },
    { id: 'supernova', name: 'Solar Nova', color: '#ffd700', icon: '⚡', glow: 'rgba(255, 215, 0, 0.8)' },
    { id: 'plasma', name: 'Magenta Flux', color: '#ff007f', icon: '🔥', glow: 'rgba(255, 0, 127, 0.8)' },
    { id: 'singularity', name: 'Void Vortex', color: '#a855f7', icon: '🔮', glow: 'rgba(168, 85, 247, 0.8)' },
    { id: 'matrix', name: 'Hyper Matrix', color: '#00ff66', icon: '🧪', glow: 'rgba(0, 255, 102, 0.8)' }
];

const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

const CyberPlinko = () => {
    const { coins, addCoins, updateStat, incrementStat, userProfile, stats } = useGamification() || {};
    const { playBoop, playWin, playAirhorn, playCollect, playCrash } = useRetroSound();

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);

    const [risk, setRisk] = useState('NORMAL');
    const [bet, setBet] = useState(25);
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [history, setHistory] = useState([]);
    const [totalWon, setTotalWon] = useState(0);
    const [jackpotEffect, setJackpotEffect] = useState(false);

    // Audio chime synth
    const playPegChime = (row) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const freq = PENTATONIC[row % PENTATONIC.length] * (row > 4 ? 2 : 1);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    };

    // Images cache
    const avatarImagesRef = useRef({});
    useEffect(() => {
        AVATARS.forEach(a => {
            const img = new Image();
            img.src = a.src;
            avatarImagesRef.current[a.id] = img;
        });
    }, []);

    // Physics Engine State
    const engineRef = useRef({
        pegs: [],
        bins: [],
        balls: [],
        particles: [],
        animId: null
    });

    // Initialize Pegs and Bins
    useEffect(() => {
        const pegs = [];
        const topY = 90;
        const spacingY = 48;
        const spacingX = 46;

        for (let r = 0; r < ROWS; r++) {
            const count = r + 3;
            const startX = (CANVAS_WIDTH - (count - 1) * spacingX) / 2;
            const y = topY + r * spacingY;

            for (let c = 0; c < count; c++) {
                pegs.push({
                    x: startX + c * spacingX,
                    y: y,
                    row: r,
                    glow: 0
                });
            }
        }

        // Bins
        const binCount = RISK_MODES[risk].multipliers.length;
        const binWidth = CANVAS_WIDTH / binCount;
        const binY = topY + ROWS * spacingY + 20;

        const bins = RISK_MODES[risk].multipliers.map((mult, idx) => ({
            index: idx,
            mult: mult,
            x: idx * binWidth,
            width: binWidth,
            y: binY,
            height: 38,
            hitGlow: 0
        }));

        engineRef.current.pegs = pegs;
        engineRef.current.bins = bins;
    }, [risk]);

    // Handle Ball Landed in Bin
    const handleBallLanded = (bin, ballBet) => {
        const mult = bin.mult;
        const payout = Math.floor(ballBet * mult);

        bin.hitGlow = 1.0;

        if (payout > 0) {
            if (addCoins) addCoins(payout);
            setTotalWon(w => w + payout);

            if (mult >= 15) {
                try {
                    playAirhorn();
                    triggerConfetti();
                } catch(e) {}
                setJackpotEffect(true);
                setTimeout(() => setJackpotEffect(false), 2000);

                feedService.publish({
                    text: '🎰 ' + (userProfile?.name || 'HighRoller') + ' smashed ' + mult + 'x on Cyber Plinko! (+' + payout.toLocaleString() + ' CP)',
                    type: 'jackpot'
                });
            } else if (mult >= 2) {
                try { playWin(); } catch(e) {}
            } else {
                try { playCollect(); } catch(e) {}
            }
        } else {
            try { playCrash(); } catch(e) {}
        }

        // Update high score
        const currentHS = stats?.plinkoHighScore || 0;
        if (payout > currentHS && updateStat) {
            updateStat('plinkoHighScore', payout);
        }

        setHistory(h => [{ mult, payout, id: Date.now() + Math.random() }, ...h.slice(0, 8)]);
    };

    // Game Physics Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const loop = () => {
            const engine = engineRef.current;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 1. Draw Background Grid & Subtle Vignette
            ctx.fillStyle = '#0a0a14';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Subtle neon guidelines
            ctx.strokeStyle = 'rgba(0, 255, 204, 0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < CANVAS_WIDTH; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, CANVAS_HEIGHT);
                ctx.stroke();
            }

            // 2. Update and Draw Pegs
            engine.pegs.forEach(peg => {
                if (peg.glow > 0) {
                    peg.glow -= 0.03;
                    ctx.fillStyle = 'rgba(255, 0, 127, ' + peg.glow + ')';
                    ctx.beginPath();
                    ctx.arc(peg.x, peg.y, PEG_RADIUS + 8 * peg.glow, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = peg.glow > 0.1 ? '#ff007f' : '#ffffff';
                ctx.shadowColor = peg.glow > 0.1 ? '#ff007f' : '#00ffff';
                ctx.shadowBlur = peg.glow > 0.1 ? 15 : 6;
                ctx.beginPath();
                ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 3. Update and Draw Bins
            engine.bins.forEach(bin => {
                const isEdge = bin.mult >= 15;
                const isMid = bin.mult >= 3 && bin.mult < 15;

                let binColor = '#00c6ff';
                if (isEdge) binColor = '#ff0055';
                else if (isMid) binColor = '#ffaa00';

                if (bin.hitGlow > 0) {
                    bin.hitGlow -= 0.04;
                    ctx.fillStyle = binColor;
                    ctx.globalAlpha = bin.hitGlow * 0.4;
                    ctx.fillRect(bin.x + 2, bin.y - 10, bin.width - 4, bin.height + 10);
                    ctx.globalAlpha = 1.0;
                }

                // Bin background
                ctx.fillStyle = isEdge ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 255, 204, 0.12)';
                ctx.strokeStyle = binColor;
                ctx.lineWidth = bin.hitGlow > 0.1 ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.roundRect(bin.x + 2, bin.y, bin.width - 4, bin.height, 6);
                ctx.fill();
                ctx.stroke();

                // Multiplier Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px "Orbitron", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(bin.mult + 'x', bin.x + bin.width / 2, bin.y + bin.height / 2);
            });

            // 4. Update and Draw Particles
            for (let i = engine.particles.length - 1; i >= 0; i--) {
                const p = engine.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;

                if (p.life <= 0) {
                    engine.particles.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            // 5. Update and Draw Balls
            for (let i = engine.balls.length - 1; i >= 0; i--) {
                const b = engine.balls[i];

                // Gravity and air drag
                b.vy += 0.28;
                b.vx *= 0.995;
                b.x += b.vx;
                b.y += b.vy;
                b.rotation += b.vx * 0.1;

                // Wall bounces
                if (b.x < BALL_RADIUS + 10) {
                    b.x = BALL_RADIUS + 10;
                    b.vx = Math.abs(b.vx) * 0.7;
                } else if (b.x > CANVAS_WIDTH - BALL_RADIUS - 10) {
                    b.x = CANVAS_WIDTH - BALL_RADIUS - 10;
                    b.vx = -Math.abs(b.vx) * 0.7;
                }

                // Peg collisions
                engine.pegs.forEach(peg => {
                    const dx = b.x - peg.x;
                    const dy = b.y - peg.y;
                    const dist = Math.hypot(dx, dy);
                    const minDist = BALL_RADIUS + PEG_RADIUS;

                    if (dist < minDist) {
                        // Collision response
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const overlap = minDist - dist;

                        b.x += nx * overlap;
                        b.y += ny * overlap;

                        // Elastic velocity bounce with slight chaotic noise
                        const dot = b.vx * nx + b.vy * ny;
                        b.vx = (b.vx - 1.5 * dot * nx) + (Math.random() - 0.5) * 0.6;
                        b.vy = (b.vy - 1.5 * dot * ny) * 0.65;

                        // Minimum bounce speed
                        if (Math.abs(b.vx) < 0.4) b.vx = (Math.random() > 0.5 ? 1 : -1) * 0.8;

                        peg.glow = 1.0;
                        playPegChime(peg.row);

                        // Spawn spark particles
                        for (let k = 0; k < 3; k++) {
                            engine.particles.push({
                                x: peg.x,
                                y: peg.y,
                                vx: (Math.random() - 0.5) * 4,
                                vy: (Math.random() - 0.5) * 4,
                                size: Math.random() * 3 + 1,
                                color: '#00ffcc',
                                life: 1.0
                            });
                        }
                    }
                });

                // Check Bin Landing
                if (b.y >= engine.bins[0]?.y) {
                    const landedBin = engine.bins.find(bin => b.x >= bin.x && b.x <= bin.x + bin.width);
                    if (landedBin) {
                        handleBallLanded(landedBin, b.bet);
                    }
                    engine.balls.splice(i, 1);
                    continue;
                }

                // Draw Ball with Avatar Texture
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(b.rotation);

                const chipColor = b.chipColor || '#00e5ff';
                const ballGrad = ctx.createRadialGradient(-BALL_RADIUS * 0.3, -BALL_RADIUS * 0.3, 1, 0, 0, BALL_RADIUS);
                ballGrad.addColorStop(0, '#ffffff');
                ballGrad.addColorStop(0.4, chipColor);
                ballGrad.addColorStop(1, '#050510');

                ctx.fillStyle = ballGrad;
                ctx.beginPath();
                ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = chipColor;
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.restore();
            }

            engine.animId = requestAnimationFrame(loop);
        };

        engineRef.current.animId = requestAnimationFrame(loop);

        return () => {
            if (engineRef.current.animId) {
                cancelAnimationFrame(engineRef.current.animId);
            }
        };
    }, [risk]);

    // Drop Ball Action
    const dropBalls = (count = 1) => {
        const cost = bet * count;
        if (coins < cost) {
            try { playCrash(); } catch(e) {}
            return;
        }

        if (addCoins) addCoins(-cost);
        if (incrementStat) {
            incrementStat('plinkoDrops', count);
            incrementStat('gamesPlayedCount', 1);
        }

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const dropOffsetX = (Math.random() - 0.5) * 40;
                engineRef.current.balls.push({
                    x: CANVAS_WIDTH / 2 + dropOffsetX,
                    y: 35,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: 1.0,
                    rotation: 0,
                    avatarId: selectedAvatar.id, chipColor: selectedAvatar.color,
                    bet: bet
                });
                try { playBoop(); } catch(e) {}
            }, i * 180);
        }
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: '#07070e',
            color: 'white',
            fontFamily: '"Orbitron", monospace',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            paddingBottom: '100px'
        }}>
            {/* TOP NAVIGATION */}
            <div style={{
                width: '100%',
                maxWidth: '960px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '12px 20px',
                background: 'rgba(15, 15, 28, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 0, 127, 0.25)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
                <Link to="/arcade" style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 255, 204, 0.08)',
                    border: '1px solid rgba(0, 255, 204, 0.3)',
                    color: '#00ffcc',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    letterSpacing: '1px'
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    ARCADE
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#ff007f', textShadow: '0 0 20px rgba(255, 0, 127, 0.6)', letterSpacing: '3px', fontWeight: '900' }}>
                        CYBER PLINKO
                    </h1>
                    <div style={{ fontSize: '0.65rem', color: '#00ffcc', letterSpacing: '2px', opacity: 0.8, textTransform: 'uppercase' }}>
                        GRAVITATIONAL PEGGED MATRIX
                    </div>
                </div>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    background: 'rgba(255, 215, 0, 0.08)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '10px',
                    color: '#ffd700',
                    fontWeight: '800',
                    fontSize: '0.9rem'
                }}>
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ffd700',
                        boxShadow: '0 0 8px #ffd700'
                    }} />
                    {coins.toLocaleString()} CP
                </div>
            </div>

            {/* JACKPOT BANNER POP */}
            <AnimatePresence>
                {jackpotEffect && (
                    <motion.div
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1.1, y: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: '120px',
                            zIndex: 10000,
                            background: 'linear-gradient(135deg, #ffd700, #ff0055)',
                            padding: '15px 40px',
                            borderRadius: '25px',
                            color: '#000',
                            fontWeight: '900',
                            fontSize: '1.8rem',
                            boxShadow: '0 0 50px gold',
                            letterSpacing: '2px'
                        }}
                    >
                        🎉 MEGA JACKPOT MULTIPLIER! 🎉
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN PLAY AREA */}
            <div style={{
                display: 'flex',
                gap: '25px',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '960px',
                width: '100%'
            }}>
                {/* PLINKO CANVAS */}
                <div style={{
                    background: '#0a0a14',
                    border: '3px solid #222',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 0 40px rgba(0, 255, 204, 0.15)',
                    maxWidth: '100%'
                }}>
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                {/* CONTROLS & DASHBOARD */}
                <div style={{
                    flex: '1 1 300px',
                    maxWidth: '350px',
                    background: 'linear-gradient(145deg, #12121e, #0c0c16)',
                    border: '1px solid #28283c',
                    borderRadius: '20px',
                    padding: '25px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {/* RISK MODE */}
                    <div>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
                            RISK TIER
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {Object.keys(RISK_MODES).map(key => {
                                const mode = RISK_MODES[key];
                                const isSel = risk === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setRisk(key)}
                                        style={{
                                            background: isSel ? mode.color : 'rgba(255,255,255,0.05)',
                                            color: isSel ? '#000' : '#fff',
                                            border: isSel ? 'none' : '1px solid #333',
                                            borderRadius: '8px',
                                            padding: '8px 4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {mode.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* CHIP CORE SELECTOR */}
                    <div>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
                            SELECT QUANTUM CORE
                        </div>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                            {AVATARS.map(a => {
                                const isSel = selectedAvatar.id === a.id;
                                return (
                                    <div
                                        key={a.id}
                                        onClick={() => setSelectedAvatar(a)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            border: isSel ? '2px solid ' + a.color : '1px solid #333',
                                            background: isSel ? a.color + '22' : 'rgba(255,255,255,0.03)',
                                            boxShadow: isSel ? '0 0 12px ' + a.glow : 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            flexShrink: 0,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isSel ? '#fff' : '#888' }}>
                                            {a.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* BET AMOUNT */}
                    <div>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
                            BET PER DROP
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {[10, 25, 50, 100].map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setBet(amt)}
                                    style={{
                                        background: bet === amt ? '#ffd700' : 'rgba(255,255,255,0.05)',
                                        color: bet === amt ? '#000' : '#fff',
                                        border: bet === amt ? 'none' : '1px solid #333',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {amt} CP
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DROP BUTTONS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <SquishyButton
                            onClick={() => dropBalls(1)}
                            disabled={coins < bet}
                            style={{
                                background: 'linear-gradient(135deg, #ff007f, #7928ca)',
                                color: 'white',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '900',
                                letterSpacing: '1px',
                                boxShadow: '0 0 25px rgba(255, 0, 127, 0.4)'
                            }}
                        >
                            DROP CHIP ({bet} CP)
                        </SquishyButton>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <button
                                onClick={() => dropBalls(3)}
                                disabled={coins < bet * 3}
                                style={{
                                    background: 'rgba(0, 255, 204, 0.15)',
                                    color: '#00ffcc',
                                    border: '1px solid #00ffcc',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                TRIPLE (3x)
                            </button>

                            <button
                                onClick={() => dropBalls(5)}
                                disabled={coins < bet * 5}
                                style={{
                                    background: 'rgba(255, 215, 0, 0.15)',
                                    color: '#ffd700',
                                    border: '1px solid #ffd700',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                FRENZY (5x)
                            </button>
                        </div>
                    </div>

                    {/* RECENT DROPS HISTORY */}
                    <div>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
                            RECENT DROPS
                        </div>
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {history.length === 0 ? (
                                <div style={{ color: '#555', fontSize: '0.7rem' }}>No drops yet...</div>
                            ) : (
                                history.map(h => (
                                    <span
                                        key={h.id}
                                        style={{
                                            background: h.mult >= 5 ? '#ff0055' : (h.mult >= 1 ? '#00ffcc' : '#333'),
                                            color: h.mult >= 1 ? '#000' : '#888',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            flexShrink: 0
                                        }}
                                    >
                                        {h.mult}x
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberPlinko;
