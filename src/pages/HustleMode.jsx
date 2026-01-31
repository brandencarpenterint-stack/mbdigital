import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useToast } from '../context/ToastContext';
import SquishyButton from '../components/SquishyButton';
import PocketPet from '../components/pocket-pet/PocketPet';
import useRetroSound from '../hooks/useRetroSound';

const HustleMode = () => {
    const { addCoins, incrementStat, shopState } = useGamification();
    const { stats } = usePocketBro();
    const equippedSkin = shopState?.equipped?.pocketbro || null;
    const { showToast } = useToast();
    const { playWin, playCollect, playClick } = useRetroSound();

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('WORK'); // 'WORK' or 'BREAK'
    const [completedSessions, setCompletedSessions] = useState(0);
    const [deepFocus, setDeepFocus] = useState(false);

    const totalTime = mode === 'WORK' ? 25 * 60 : 5 * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer Finished
            setIsActive(false);
            if (mode === 'WORK') {
                handleWorkComplete();
            } else {
                handleBreakComplete();
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const handleWorkComplete = () => {
        addCoins(300);
        incrementStat('hustleSessions', 1);
        setCompletedSessions(s => s + 1);
        playWin();
        showToast("HUSTLE COMPLETE! +300 COINS", "success");
        setMode('BREAK');
        setTimeLeft(5 * 60);
        setDeepFocus(false); // Auto exit deep focus
    };

    const handleBreakComplete = () => {
        playCollect();
        showToast("BREAK OVER! BACK TO WORK.", "info");
        setMode('WORK');
        setTimeLeft(25 * 60);
    };

    const toggleTimer = () => {
        playClick();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
        setDeepFocus(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Dynamic Styles
    const themeColor = mode === 'WORK' ? 'var(--neon-pink)' : 'var(--neon-green)';
    const bgColor = mode === 'WORK' ? '#1a0b2e' : '#002222';

    return (
        <div className="page-enter" style={{
            background: deepFocus ? '#000' : `linear-gradient(to bottom, ${bgColor}, #000)`,
            minHeight: '100vh',
            padding: '20px',
            color: 'white',
            fontFamily: '"Orbitron", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 1s ease'
        }}>

            {/* Back Button (Hidden in Deep Focus) */}
            <AnimatePresence>
                {!deepFocus && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
                    >
                        <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8 }}>⬅</Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient Grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: deepFocus ? 0.05 : 0.2,
                transform: 'perspective(500px) rotateX(20deg)',
                transformOrigin: 'top',
                pointerEvents: 'none'
            }} />

            {/* MAIN PANEL */}
            <motion.div
                layout
                animate={{ scale: deepFocus ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    width: '100%',
                    maxWidth: '450px',
                    textAlign: 'center',
                    border: `2px solid ${themeColor}`,
                    background: deepFocus ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)',
                    boxShadow: isActive ? `0 0 50px ${themeColor}60` : `0 0 20px ${themeColor}20`,
                    marginTop: '-50px',
                    position: 'relative',
                    zIndex: 20
                }}
            >
                {/* STATUS BADGE */}
                <motion.div
                    animate={{ y: isActive ? [0, -5, 0] : 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        background: themeColor,
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '1rem',
                        marginBottom: '30px',
                        boxShadow: `0 0 20px ${themeColor}`,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}
                >
                    {mode === 'WORK' ? '🔥 NEON HUSTLE' : '☕ SYSTEM RECHARGE'}
                </motion.div>

                {/* ANIMATION ZONE */}
                <div style={{
                    height: '180px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                    position: 'relative'
                }}>
                    {isActive && (
                        <div style={{
                            position: 'absolute', width: '150px', height: '150px', borderRadius: '50%',
                            border: `2px dashed ${themeColor}`,
                            animation: 'spin 10s linear infinite',
                            opacity: 0.5
                        }} />
                    )}
                    <div style={{ width: '150px', height: '150px', filter: deepFocus ? 'drop-shadow(0 0 20px white)' : 'none' }}>
                        <PocketPet
                            stage={stats.stage}
                            type={stats.type || 'SOOT'}
                            mood={isActive ? 'happy' : 'neutral'}
                            isSleeping={mode === 'BREAK'}
                            skin={equippedSkin}
                        />
                    </div>
                </div>

                {/* TIMER */}
                <div style={{
                    fontSize: '5.5rem',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    color: themeColor,
                    textShadow: `0 0 30px ${themeColor}`,
                    marginBottom: '10px',
                    letterSpacing: '-4px',
                    lineHeight: 1
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* PROGRESS BAR */}
                <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginBottom: '40px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{
                            height: '100%',
                            background: themeColor,
                            boxShadow: `0 0 15px ${themeColor}`
                        }}
                    />
                </div>

                {/* CONTROLS */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
                    <SquishyButton
                        onClick={toggleTimer}
                        style={{
                            fontSize: '1.2rem',
                            padding: '15px 40px',
                            background: isActive ? 'transparent' : themeColor,
                            color: isActive ? themeColor : '#000',
                            fontWeight: 'bold',
                            border: `2px solid ${themeColor}`,
                            boxShadow: `0 0 20px ${themeColor}40`
                        }}
                    >
                        {isActive ? 'PAUSE' : 'INITIATE'}
                    </SquishyButton>

                    <button
                        onClick={resetTimer}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    >
                        RESET
                    </button>
                </div>

                {/* DEEP FOCUS TOGGLE */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', opacity: isActive ? 1 : 0.5 }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={deepFocus}
                            onChange={(e) => setDeepFocus(e.target.checked)}
                            style={{ accentColor: themeColor }}
                        />
                        DEEP FOCUS MODE
                    </label>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>SESSIONS</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>{completedSessions}</div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default HustleMode;
