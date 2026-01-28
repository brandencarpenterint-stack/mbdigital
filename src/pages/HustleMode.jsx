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
                addCoins(50);
                setCompletedSessions(s => s + 1);
                // Play Sound
                const audio = new Audio('/assets/win.mp3'); // Fallback or use Hook
                audio.play().catch(e => console.log('No audio'));

                alert("HUSTLE COMPLETE! +50 Coins earned. Take a break.");
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

                {/* ANIMATED CHARACTER */}
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    {/* Placeholder for animated sprite using css transform or swapping images */}
                    {isActive ? (
                        <div style={{ fontSize: '5rem', animation: 'bounce 0.5s infinite' }}>
                            {mode === 'WORK' ? (frame % 2 === 0 ? '👨‍💻' : '📠') : (frame % 2 === 0 ? '🧘' : '🍵')}
                        </div>
                    ) : (
                        <div style={{ fontSize: '5rem' }}>
                            {mode === 'WORK' ? '🛑' : '😌'}
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
                        ? "Stay focused. Do the work. Earn 50 Coins."
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
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                `}
            </style>
        </div>
    );
};

export default HustleMode;
