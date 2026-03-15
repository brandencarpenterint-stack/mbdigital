import React, { useState, useEffect, useRef } from 'react';
import useRetroSound from '../hooks/useRetroSound';

const HackingMinigame = ({ target, difficulty = 1, onComplete, onClose }) => {
    const { playBeep, playCollect, playCrash, playWin } = useRetroSound();
    const canvasRef = useRef(null);

    // Game Constants
    const TARGET_ZONES = 3 + difficulty;
    const SPEED_BASE = 5 + (difficulty * 2);

    // State
    const [gameState, setGameState] = useState('START'); // START, PLAYING, WIN, FAIL
    const [hits, setHits] = useState(0);
    const [cursorPos, setCursorPos] = useState(0);
    const [targetPos, setTargetPos] = useState(Math.random() * 80 + 10);
    const [direction, setDirection] = useState(1);
    const [speed, setSpeed] = useState(SPEED_BASE);

    // Animation Refs
    const requestRef = useRef();
    const matrixRef = useRef();

    // MATRIX RAIN EFFECT
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 400;

        const cols = Math.floor(canvas.width / 20);
        const ypos = Array(cols).fill(0);

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(0, 10, 0, 0.1)'; // Fade trail
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = gameState === 'FAIL' ? '#f00' : '#0f0';
            ctx.font = '15px monospace';

            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);

                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });

            matrixRef.current = requestAnimationFrame(drawMatrix);
        };

        drawMatrix();
        return () => cancelAnimationFrame(matrixRef.current);
    }, [gameState]);

    // GAME LOOP
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

    // PARTICLES for HITS
    const [particles, setParticles] = useState([]);

    const spawnParticles = (x, color) => {
        const newParticles = Array.from({ length: 10 }).map(() => ({
            x,
            y: 0,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color
        }));
        setParticles(prev => [...prev, ...newParticles]);
    };

    // PARTICLE LOOP
    useEffect(() => {
        if (particles.length === 0) return;
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                life: p.life - 0.1
            })).filter(p => p.life > 0));
        }, 30);
        return () => clearInterval(interval);
    }, [particles]);

    // ACTIONS
    const handleAction = () => {
        if (gameState === 'START') {
            setGameState('PLAYING');
            playBeep();
            return;
        }

        if (gameState === 'PLAYING') {
            const diff = Math.abs(cursorPos - targetPos);
            const HIT_WINDOW = 12; // Slightly easier to allow comboing

            if (diff <= HIT_WINDOW) {
                // HIT!
                const newHits = hits + 1;
                setHits(newHits);
                playCollect();
                spawnParticles(cursorPos, '#0f0'); // SPAWN PARTICLES

                if (newHits >= TARGET_ZONES) {
                    setGameState('WIN');
                    playWin();
                    setTimeout(() => onComplete(true), 2000); // Longer bask in glory
                } else {
                    setTargetPos(Math.random() * 80 + 10);
                    setSpeed(s => s * 1.3); // FASTER
                }
            } else {
                // MISS
                setGameState('FAIL');
                playCrash();
                spawnParticles(cursorPos, '#f00');
                setTimeout(() => onComplete(false), 1500);
            }
        }
    };

    // ... (keep keyboard effect) ...

    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') handleAction();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameState, cursorPos, targetPos, hits]);

    // RENDER VARS
    const colorPrimary = gameState === 'FAIL' ? '#ff0055' : '#00ff41';

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
            fontFamily: '"Courier New", monospace'
        }}>
            {/* SCREEN SHAKE CONTAINER */}
            <div style={{
                position: 'relative',
                width: '650px', height: '450px',
                background: '#050505',
                border: `4px solid ${colorPrimary}`,
                boxShadow: `0 0 80px ${colorPrimary}60`,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                animation: gameState === 'FAIL' ? 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both' :
                    gameState === 'WIN' ? 'pulse 0.5s infinite' : 'none',
                transform: 'translate3d(0, 0, 0)'
            }}>
                {/* MATRIX BG */}
                <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />

                {/* CRT EFFECTS */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    pointerEvents: 'none',
                    zIndex: 20
                }} />
                {/* VIGNETTE */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle, transparent 50%, black 100%)',
                    zIndex: 21, pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 30, padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>

                    {/* STATUS HEADER */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', marginBottom: '30px',
                        color: colorPrimary, textShadow: `0 0 10px ${colorPrimary}`,
                        fontSize: '1.2rem', fontWeight: 'bold', borderBottom: `2px solid ${colorPrimary}40`, paddingBottom: '10px'
                    }}>
                        <div>TARGET: {target.toUpperCase()}</div>
                        <div>
                            {gameState === 'PLAYING' && <span style={{ animation: 'blink 0.5s infinite' }}>CONNECTING...</span>}
                            {gameState === 'WIN' && "ACCESS GRANTED"}
                            {gameState === 'FAIL' && "CONNECTION LOST"}
                            {gameState === 'START' && "STANDBY"}
                        </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div style={{ marginBottom: '50px', display: 'flex', gap: '8px', height: '16px' }}>
                        {Array(TARGET_ZONES).fill(0).map((_, i) => (
                            <div key={i} style={{
                                flex: 1,
                                background: i < hits ? colorPrimary : '#1a1a1a',
                                border: `1px solid ${colorPrimary}`,
                                boxShadow: i < hits ? `0 0 15px ${colorPrimary}` : 'none',
                                transition: 'all 0.1s',
                                transform: i < hits ? 'scaleY(1.2)' : 'scaleY(1)'
                            }} />
                        ))}
                    </div>

                    {/* GAMEPLAY ZONE */}
                    <div style={{
                        flex: 1, position: 'relative',
                        background: 'rgba(0,10,0,0.3)',
                        border: `2px solid ${colorPrimary}40`,
                        marginBottom: '30px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `inset 0 0 50px ${colorPrimary}10`
                    }}>
                        {/* HIT PARTICLES RENDERING */}
                        {particles.map((p, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                left: `${p.x}%`, top: '50%',
                                width: '8px', height: '8px',
                                background: p.color,
                                transform: `translate(${p.vx * 10}px, ${p.vy * 10}px)`,
                                opacity: p.life,
                                pointerEvents: 'none'
                            }} />
                        ))}

                        {gameState === 'START' && (
                            <div style={{
                                color: colorPrimary,
                                animation: 'glitch 1s infinite alternate',
                                textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px'
                            }}>
                                [ PRESS SPACE ]
                            </div>
                        )}

                        {gameState === 'WIN' && (
                            <div style={{
                                fontSize: '4rem', color: colorPrimary,
                                textShadow: `0 0 40px ${colorPrimary}, 0 0 80px white`,
                                fontWeight: '900', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>
                                UNLOCKED
                            </div>
                        )}

                        {(gameState === 'PLAYING' || gameState === 'START') && (
                            <div style={{
                                width: '100%', height: '80px',
                                background: '#0a0a0a', position: 'relative',
                                overflow: 'hidden',
                                borderTop: `2px solid ${colorPrimary}`,
                                borderBottom: `2px solid ${colorPrimary}`
                            }}>
                                {/* Target */}
                                <div style={{
                                    position: 'absolute',
                                    left: `${targetPos}%`, top: 0, bottom: 0,
                                    width: '14%',
                                    background: `${colorPrimary}30`,
                                    borderLeft: `3px solid ${colorPrimary}`,
                                    borderRight: `3px solid ${colorPrimary}`,
                                    transform: 'translateX(-50%)',
                                    boxShadow: `0 0 30px ${colorPrimary}40`
                                }} />

                                {/* Cursor */}
                                <div style={{
                                    position: 'absolute',
                                    left: `${cursorPos}%`, top: 0, bottom: 0,
                                    width: '6px', background: '#fff',
                                    boxShadow: '0 0 25px #fff, 0 0 10px ${colorPrimary}',
                                    transform: 'translateX(-50%)',
                                    zIndex: 5
                                }} />
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div style={{
                        fontSize: '0.9rem', color: colorPrimary, opacity: 0.8,
                        display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace',
                        borderTop: `1px solid ${colorPrimary}40`, paddingTop: '10px'
                    }}>
                        <div>Encryption: AES-4096-GCM</div>
                        <div>Tracing: {gameState === 'FAIL' ? 'DETECTED!' : '0%'}</div>
                    </div>
                </div>
            </div>

            <button onClick={() => onClose()} style={{
                position: 'absolute', top: 30, right: 30,
                background: 'rgba(0,0,0,0.8)', border: '1px solid #666', color: '#aaa',
                padding: '12px 24px', cursor: 'pointer', fontFamily: 'monospace',
                fontSize: '1rem', transition: 'all 0.2s', zIndex: 10001
            }}>
                [ ESC ] DISCONNECT
            </button>
            <style>{`
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default HackingMinigame;
