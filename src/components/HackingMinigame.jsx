import React, { useState, useEffect, useRef } from 'react';
import useRetroSound from '../hooks/useRetroSound';

const HackingMinigame = ({ target, difficulty = 1, onComplete, onClose }) => {
    const { playBeep, playCollect, playCrash, playWin } = useRetroSound();

    // Game Constants
    const TARGET_ZONES = 3 + difficulty; // More zones for harder hacks
    const SPEED_BASE = 5 + (difficulty * 2);

    // State
    const [gameState, setGameState] = useState('START'); // START, PLAYING, WIN, FAIL
    const [hits, setHits] = useState(0);
    const [cursorPos, setCursorPos] = useState(0);
    const [targetPos, setTargetPos] = useState(Math.random() * 80 + 10); // 10-90%
    const [direction, setDirection] = useState(1);
    const [speed, setSpeed] = useState(SPEED_BASE);

    const requestRef = useRef();

    // Loop
    const animate = () => {
        if (gameState === 'PLAYING') {
            setCursorPos(prev => {
                let next = prev + (speed * direction * 0.5);
                if (next >= 100 || next <= 0) {
                    setDirection(d => d * -1);
                    next = next >= 100 ? 100 : 0;
                }
                return next;
            });
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, speed, direction]);

    // Input Handler
    const handleAction = () => {
        if (gameState === 'START') {
            setGameState('PLAYING');
            playBeep();
            return;
        }

        if (gameState === 'PLAYING') {
            // Check Hit
            const diff = Math.abs(cursorPos - targetPos);
            const HIT_WINDOW = 10; // 10% tolerance

            if (diff <= HIT_WINDOW) {
                // HIT!
                const newHits = hits + 1;
                setHits(newHits);
                playCollect();

                if (newHits >= TARGET_ZONES) {
                    // WIN
                    setGameState('WIN');
                    playWin();
                    setTimeout(() => onComplete(true), 1500);
                } else {
                    // NEXT LEVEL
                    setTargetPos(Math.random() * 80 + 10);
                    setSpeed(s => s * 1.2); // Faster!
                    // Visual feedback?
                }
            } else {
                // MISS
                setGameState('FAIL');
                playCrash();
                setTimeout(() => onComplete(false), 1500);
            }
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') handleAction();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameState, cursorPos, targetPos, hits]);

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(5px)',
            fontFamily: '"Courier New", monospace'
        }}>
            <div style={{
                position: 'relative',
                width: '600px', height: '400px',
                background: '#0a0a0a',
                border: `2px solid ${gameState === 'FAIL' ? 'red' : gameState === 'WIN' ? '#0f0' : '#0f0'}`,
                boxShadow: `0 0 50px ${gameState === 'FAIL' ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)'}`,
                padding: '30px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#0f0' }}>
                    <div>TARGET: {target.toUpperCase()}</div>
                    <div>SECURE LINK: {gameState === 'PLAYING' ? 'ESTABLISHED' : gameState}</div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '40px', display: 'flex', gap: '5px' }}>
                    {Array(TARGET_ZONES).fill(0).map((_, i) => (
                        <div key={i} style={{
                            flex: 1, height: '10px',
                            background: i < hits ? '#0f0' : '#333',
                            border: '1px solid #0f0'
                        }} />
                    ))}
                </div>

                {/* Game Area */}
                <div style={{
                    flex: 1, position: 'relative',
                    background: '#050505',
                    border: '1px dashed #333',
                    marginBottom: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {gameState === 'START' && (
                        <div style={{
                            position: 'absolute', color: '#0f0',
                            animation: 'pulse 1s infinite'
                        }}>
                            PRESS [SPACE] TO INITIATE
                        </div>
                    )}

                    {gameState === 'WIN' && (
                        <div style={{ fontSize: '3rem', color: '#0f0', textShadow: '0 0 20px #0f0' }}>
                            ACCESS GRANTED
                        </div>
                    )}

                    {gameState === 'FAIL' && (
                        <div style={{ fontSize: '3rem', color: 'red', textShadow: '0 0 20px red' }}>
                            ACCESS DENIED
                        </div>
                    )}

                    {(gameState === 'PLAYING' || gameState === 'START') && (
                        <div style={{
                            width: '100%', height: '40px',
                            background: '#111', position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Target Zone */}
                            <div style={{
                                position: 'absolute',
                                left: `${targetPos}%`, top: 0, bottom: 0,
                                width: '10%', // 10% hit window
                                background: 'rgba(0, 255, 0, 0.3)',
                                borderLeft: '1px solid #0f0',
                                borderRight: '1px solid #0f0',
                                transform: 'translateX(-50%)'
                            }} />

                            {/* Cursor */}
                            <div style={{
                                position: 'absolute',
                                left: `${cursorPos}%`, top: 0, bottom: 0,
                                width: '2px', background: '#fff',
                                boxShadow: '0 0 10px #fff',
                                transform: 'translateX(-50%)'
                            }} />
                        </div>
                    )}
                </div>

                {/* Tech Deco */}
                <div style={{ fontSize: '0.7rem', color: '#444', display: 'flex', justifyContent: 'space-between' }}>
                    <div>BAUD: 56K</div>
                    <div>ENCRYPTION: AES-256</div>
                    <div>PROTOCOL: TCP/IP</div>
                </div>

                {/* SCANLINES */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    opacity: 0.3
                }} />
            </div>

            <button onClick={() => onClose()} style={{
                position: 'absolute', top: 20, right: 20,
                background: 'transparent', border: '1px solid #333', color: '#666',
                padding: '10px 20px', cursor: 'pointer'
            }}>ABORT</button>
        </div>
    );
};

export default HackingMinigame;
