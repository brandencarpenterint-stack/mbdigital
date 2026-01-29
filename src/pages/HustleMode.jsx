import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import SquishyButton from '../components/SquishyButton';

const HustleMode = () => {
    const { addCoins, incrementStat } = useGamification();
    const { showToast } = useToast();

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('WORK'); // 'WORK' or 'BREAK'
    const [completedSessions, setCompletedSessions] = useState(0);

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
    }, [isActive, timeLeft, mode]); // removed dependencies that don't change often

    const handleWorkComplete = () => {
        addCoins(300);
        incrementStat('hustleSessions', 1);
        setCompletedSessions(s => s + 1);

        // Play Sound
        const audio = new Audio('/assets/win.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('No audio'));

        showToast("HUSTLE COMPLETE! +300 COINS", "success");
        setMode('BREAK');
        setTimeLeft(5 * 60);
    };

    const handleBreakComplete = () => {
        const audio = new Audio('/assets/notification.mp3');
        audio.play().catch(e => console.log('No audio'));

        showToast("BREAK OVER! BACK TO WORK.", "info");
        setMode('WORK');
        setTimeLeft(25 * 60);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Dynamic Styles based on Mode
    const themeColor = mode === 'WORK' ? 'var(--neon-pink)' : 'var(--neon-green)';
    const bgColor = mode === 'WORK' ? '#1a0b2e' : '#002222';

    return (
        <div className="page-enter" style={{
            background: `linear-gradient(to bottom, ${bgColor}, #000)`,
            minHeight: '100vh',
            padding: '20px',
            color: 'white',
            fontFamily: '"Orbitron", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Header */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8 }}>⬅</Link>
            </div>

            {/* Background Ambience */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 50%, ${themeColor} 0%, transparent 60%)`,
                opacity: 0.1,
                pointerEvents: 'none'
            }} />

            <div className="glass-panel" style={{
                padding: '40px',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center',
                border: `1px solid ${themeColor}`,
                boxShadow: `0 0 50px ${themeColor}40`, // 40 is hex opacity
                marginTop: '-50px' // Optical center correction
            }}>

                {/* STATUS BADGE */}
                <div style={{
                    display: 'inline-block',
                    padding: '8px 20px',
                    borderRadius: '50px',
                    background: themeColor,
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '1rem',
                    marginBottom: '30px',
                    boxShadow: `0 0 20px ${themeColor}`
                }}>
                    {mode === 'WORK' ? '🔥 HUSTLE HARD' : '☕ RECHARGE'}
                </div>

                {/* ANIMATION ZONE */}
                <div style={{
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    position: 'relative'
                }}>
                    {/* Placeholder for Character Animation */}
                    <div style={{
                        fontSize: '6rem',
                        animation: isActive ? (mode === 'WORK' ? 'shake 0.5s infinite' : 'float 3s infinite ease-in-out') : 'none',
                        filter: `drop-shadow(0 0 20px ${themeColor})`
                    }}>
                        {mode === 'WORK' ? '👨‍💻' : '🧘'}
                    </div>
                </div>

                {/* TIMER */}
                <div style={{
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    fontFamily: 'monospace', // Orbitron looks good but monospace prevents jitter
                    color: themeColor,
                    textShadow: `0 0 20px ${themeColor}`,
                    marginBottom: '10px',
                    letterSpacing: '-2px'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* PROGRESS RING/BAR */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '40px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: themeColor,
                        boxShadow: `0 0 10px ${themeColor}`,
                        transition: 'width 1s linear'
                    }}></div>
                </div>

                {/* CONTROLS */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
                    <SquishyButton
                        onClick={toggleTimer}
                        style={{
                            fontSize: '1.2rem',
                            padding: '15px 50px',
                            background: isActive ? '#333' : themeColor,
                            color: isActive ? '#fff' : '#000',
                            fontWeight: 'bold',
                            border: isActive ? '1px solid #555' : 'none'
                        }}
                    >
                        {isActive ? 'PAUSE' : 'START'}
                    </SquishyButton>

                    <button
                        onClick={resetTimer}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    >
                        RESET
                    </button>
                </div>

                <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {mode === 'WORK'
                        ? "EARN 300 COINS PER SESSION."
                        : "TAKE A BREATH. YOU EARNED IT."}
                </p>

                {/* STATS */}
                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>TODAY</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedSessions}</div>
                    </div>
                    {/* Add Total logic later if needed */}
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
            `}</style>
        </div>
    );
};

export default HustleMode;
