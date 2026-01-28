import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import SquishyButton from '../components/SquishyButton';

const HustleMode = () => {
    const { addCoins } = useGamification();

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('WORK'); // 'WORK' or 'BREAK'
    const [completedSessions, setCompletedSessions] = useState(0);

    // Animation State
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
                setFrame(f => (f + 1) % 4); // Animate character
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer Finished
            setIsActive(false);
            if (mode === 'WORK') {
                // Reward logic
                addCoins(300);
                setCompletedSessions(s => s + 1);
                // Play Sound
                const audio = new Audio('/assets/win.mp3'); // Fallback or use Hook
                audio.play().catch(e => console.log('No audio'));

                alert("HUSTLE COMPLETE! +300 Coins earned. YOU ANIMAL!");
                setMode('BREAK');
                setTimeLeft(5 * 60);
            } else {
                alert("Break over! Back to the grind.");
                setMode('WORK');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, addCoins]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // calculate progress for bar
    const totalTime = mode === 'WORK' ? 25 * 60 : 5 * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div style={{
            background: mode === 'WORK' ? 'linear-gradient(135deg, #1a0b2e, #000000)' : 'linear-gradient(135deg, #004d40, #000000)',
            minHeight: '100vh',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>

            <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: '30px',
                border: `1px solid ${mode === 'WORK' ? '#ff0055' : '#00ffaa'}`,
                textAlign: 'center',
                boxShadow: `0 0 50px ${mode === 'WORK' ? 'rgba(255,0,85,0.2)' : 'rgba(0,255,170,0.2)'}`,
                width: '90%',
                maxWidth: '500px'
            }}>
                {/* STATUS BADGE */}
                <div style={{
                    display: 'inline-block',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    background: mode === 'WORK' ? '#ff0055' : '#00ffaa',
                    color: mode === 'WORK' ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '20px',
                    letterSpacing: '1px'
                }}>
                    {mode === 'WORK' ? '🔥 HUSTLE MODE' : '☕ CHILL MODE'}
                </div>

                {/* ANIMATED CHARACTER AREA */}
                <div style={{ height: '200px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>

                    {/* The Character (Head) */}
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        zIndex: 10,
                        transition: 'transform 0.2s',
                        animation: isActive && mode === 'WORK' ? 'hustleAction 4s infinite' : 'float 3s infinite ease-in-out'
                    }}>
                        <img
                            src="/assets/hustle_boy.png"
                            alt="Hustle Boy"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />

                        {/* CSS Body (Simple Stick Figure for hilarity) */}
                        {isActive && mode === 'WORK' && (
                            <div style={{ position: 'absolute', top: '90px', left: '25px', width: '50px', height: '60px', background: 'white', borderRadius: '10px', zIndex: -1 }}>
                                {/* Arms */}
                                <div style={{ position: 'absolute', top: '10px', left: '-20px', width: '20px', height: '10px', background: 'white', transform: 'rotate(20deg)', animation: 'typeLeft 0.2s infinite' }}></div>
                                <div style={{ position: 'absolute', top: '10px', right: '-20px', width: '20px', height: '10px', background: 'white', transform: 'rotate(-20deg)', animation: 'typeRight 0.2s infinite' }}></div>
                            </div>
                        )}
                    </div>

                    {/* The Desk (Only during work) */}
                    {mode === 'WORK' && (
                        <div style={{
                            width: '200px',
                            height: '10px',
                            background: '#444',
                            borderRadius: '5px',
                            marginBottom: '20px',
                            position: 'relative',
                            animation: isActive ? 'deskRage 10s infinite' : 'none'
                        }}>
                            {/* Laptop */}
                            <div style={{ position: 'absolute', bottom: '10px', left: '80px', width: '40px', height: '30px', background: '#ccc', transform: 'skewX(-10deg)' }}></div>
                        </div>
                    )}
                </div>

                {/* TIMER DISPLAY */}
                <div style={{
                    fontSize: '6rem',
                    fontWeight: '900',
                    fontFamily: 'monospace',
                    textShadow: `0 0 20px ${mode === 'WORK' ? '#ff0055' : '#00ffaa'}`,
                    marginBottom: '20px'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* PROGRESS BAR */}
                <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginBottom: '40px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: mode === 'WORK' ? '#ff0055' : '#00ffaa',
                        transition: 'width 1s linear'
                    }}></div>
                </div>

                {/* CONTROLS */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
                    <SquishyButton
                        onClick={toggleTimer}
                        style={{
                            fontSize: '1.2rem',
                            padding: '15px 40px',
                            background: isActive ? '#333' : (mode === 'WORK' ? '#ff0055' : '#00ffaa'),
                            color: isActive ? 'white' : (mode === 'WORK' ? 'white' : 'black')
                        }}
                    >
                        {isActive ? 'PAUSE' : 'START'}
                    </SquishyButton>

                    <button
                        onClick={resetTimer}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        RESET
                    </button>
                </div>

                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                    {mode === 'WORK'
                        ? "Stay focused. Do the work. Earn 300 Coins."
                        : "Relax. Scrolling allowed."}
                </p>

                {/* SESSIONS COUNT */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <span style={{ color: '#aaa' }}>Sessions Completed Today: </span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>{completedSessions}</span>
                </div>
            </div>

            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes hustleAction {
                    0%, 20% { transform: translateY(0); /* Typing */ }
                    25% { transform: translateY(20px) scale(1.1, 0.9); /* Squat Down */ }
                    30% { transform: translateY(-50px) scale(0.9, 1.1); /* Jump Squat */ }
                    35% { transform: translateY(0); }
                    40%, 60% { transform: rotate(360deg); /* Flip */ }
                    65% { transform: translateX(-20px); /* Pushup Pos */ }
                    70% { transform: translateX(20px); }
                    80% { transform: scale(1.2); /* Flex */ }
                    100% { transform: scale(1); }
                }
                @keyframes typeLeft { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(40deg); } }
                @keyframes typeRight { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(-40deg); } }
                @keyframes deskRage {
                    0%, 90% { transform: rotate(0); }
                    92% { transform: rotate(-10deg) translateY(-20px); }
                    94% { transform: rotate(10deg) translateY(-10px); }
                    95% { transform: rotate(180deg) translateY(100px); opacity: 0; }
                    100% { transform: rotate(0); opacity: 0; } /* Desk disappears */
                }
                `}
            </style>
        </div>
    );
};

export default HustleMode;
