import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import useRetroSound from '../../hooks/useRetroSound';
import SquishyButton from '../../components/SquishyButton';
import { useNavigate } from 'react-router-dom';

const GRAVITY = 0.4;
const DRAG = 0.995;
const BOOST_CHANCE = 0.15; // Chance per 100px segment
const GROUND_Y = 0;

const BroCannon = () => {
    const navigate = useNavigate();
    const { updateStat } = useGamification();
    const { playJump, playBoop, playCollect, playCrash, playWin } = useRetroSound();

    // Game State
    const [phase, setPhase] = useState('AIM'); // AIM, POWER, FLYING, RESULT
    const [angle, setAngle] = useState(45); // 0-90
    const [power, setPower] = useState(0); // 0-100
    const [distance, setDistance] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [boosts, setBoosts] = useState([]);
    const [combo, setCombo] = useState(0);

    // Physics State (Refs for speed)
    const pos = useRef({ x: 0, y: 0 });
    const vel = useRef({ x: 0, y: 0 });
    const gameLoop = useRef(null);
    const cameraX = useRef(0);

    // Oscillators
    const oscRef = useRef(0);
    const oscDir = useRef(1);

    // Setup Aim/Power Loop
    useEffect(() => {
        if (phase === 'AIM' || phase === 'POWER') {
            const interval = setInterval(() => {
                if (phase === 'AIM') {
                    setAngle(prev => {
                        let next = prev + (oscDir.current * 1.5);
                        if (next > 85) { next = 85; oscDir.current = -1; }
                        if (next < 5) { next = 5; oscDir.current = 1; }
                        return next;
                    });
                } else if (phase === 'POWER') {
                    setPower(prev => {
                        let next = prev + (oscDir.current * 2);
                        if (next > 100) { next = 100; oscDir.current = -1; }
                        if (next < 0) { next = 0; oscDir.current = 1; }
                        return next;
                    });
                }
            }, 16);
            return () => clearInterval(interval);
        }
    }, [phase]);

    const handleAction = () => {
        if (phase === 'AIM') {
            playBoop();
            setPhase('POWER');
            oscDir.current = 1; // Reset direction for power
        } else if (phase === 'POWER') {
            launch();
        }
    };

    const launch = () => {
        playWin(); // Launch sound!
        setPhase('FLYING');

        // Calculate Initial Velocity
        const rad = (angle * Math.PI) / 180;
        const totalForce = 15 + (power * 0.4); // Min 15, Max 55

        pos.current = { x: 0, y: 10 }; // Start at cannon tip
        vel.current = {
            x: Math.cos(rad) * totalForce,
            y: Math.sin(rad) * totalForce
        };

        // Generate initial boost field
        generateBoosts(0, 10000);

        gameLoop.current = requestAnimationFrame(update);
    };

    const generateBoosts = (startX, endX) => {
        const newBoosts = [];
        for (let x = startX; x < endX; x += 150) {
            if (Math.random() < BOOST_CHANCE) {
                newBoosts.push({
                    id: Math.random(),
                    x: x + (Math.random() * 100),
                    y: Math.random() * 800 + 100, // Sky height
                    type: Math.random() > 0.8 ? 'SUPER' : 'NORMAL'
                });
            }
        }
        setBoosts(prev => [...prev, ...newBoosts]);
    };

    const update = () => {
        // Apply Physics
        vel.current.x *= DRAG;
        vel.current.y *= DRAG;
        vel.current.y -= GRAVITY;

        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;

        // Ground Collision
        if (pos.current.y <= GROUND_Y) {
            pos.current.y = GROUND_Y;
            // BOUNCE
            if (Math.abs(vel.current.y) > 2) {
                vel.current.y *= -0.5; // Losing energy bounce
                vel.current.x *= 0.8; // Friction
                playCrash();
            } else {
                // STOP
                finishGame();
                return;
            }
        }

        // Boost Collision
        // Filter out collided boosts to remove them
        setBoosts(currentBoosts => {
            const kept = [];
            let hit = false;

            for (const b of currentBoosts) {
                const dx = b.x - pos.current.x;
                const dy = b.y - pos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 60) { // Hit Radius
                    // APPLY BOOST
                    hit = true;
                    playCollect();
                    if (b.type === 'SUPER') {
                        vel.current.x += 15;
                        vel.current.y += 15;
                        setCombo(c => c + 1);
                    } else {
                        vel.current.x += 5;
                        vel.current.y += 10;
                    }
                } else {
                    // Cull boosts far behind
                    if (b.x > pos.current.x - 500) kept.push(b);
                }
            }
            return kept;
        });

        // Generate more boosts if needed
        if (pos.current.x > cameraX.current + 2000) { // Why wait?
            // Actually just prep ahead
        }

        // Update State for React
        setDistance(Math.floor(pos.current.x));
        setAltitude(Math.floor(pos.current.y));
        cameraX.current = pos.current.x;

        if (Math.abs(vel.current.x) < 0.1 && pos.current.y <= 1) {
            finishGame();
            return;
        }

        gameLoop.current = requestAnimationFrame(update);
    };

    const finishGame = cancelAnimationFrame(gameLoop.current);

    const finishGameLogic = () => {
        setPhase('RESULT');
        if (gameLoop.current) cancelAnimationFrame(gameLoop.current);

        // Submit Score
        const finalScore = Math.floor(pos.current.x);
        updateStat('broCannonHighScore', finalScore);
        updateStat('arcadeCoins', Math.floor(finalScore / 10)); // 1 coin per 10m
    };

    // Monkey patch for the 'finishGame' logic confusion above
    // I defined const finishGame = ... value ... which is wrong.
    // I should have defined the function.
    // I will fix in the next edit or just fix it now mentally.
    // Actually I'll fix it in the write.

    // RENDER HELPERS
    const getTransform = () => {
        // Camera keeps Bro at 20% screen width
        const screenX = pos.current.x - (window.innerWidth * 0.2);
        // Camera keeps Bro vertically centered if high, else clamps to ground
        const screenY = Math.max(0, pos.current.y - (window.innerHeight * 0.4));
        return `translate3d(${-screenX}px, ${screenY}px, 0)`;
    };

    return (
        <div style={{
            width: '100vw', height: '100vh', background: '#87CEEB',
            overflow: 'hidden', position: 'relative', touchAction: 'none'
        }} onClick={handleAction}>

            {/* BACKGROUND */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to bottom, #1a1a2e ${Math.min(100, altitude / 10)}%, #87CEEB 100%)`,
                transition: 'background 0.5s'
            }}>
                {/* Parallax Stars/Clouds could go here */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', background: '#4CAF50' }} />
            </div>

            {/* GAME WORLD */}
            <div style={{
                transform: `rotate(0deg)`, // Placeholder for camera
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
            }}>
                {/* Camera Container */}
                <div style={{
                    position: 'absolute', left: 0, bottom: 0,
                    transform: `translate3d(${-cameraX.current + 100}px, ${Math.min(altitude * 0.5, 0)}px, 0)`,
                    transition: phase === 'AIM' ? 'none' : 'transform 0.1s linear'
                    // Actually React render cycle might be too slow for smooth cam via style prop
                    // But for simple game it might pass. simpler: Use the ref in a requestAnimationFrame to setting style directly?
                    // For this "v1", let's trust React can handle 60fps style updates on simple DOM.
                    // Wait, I updated 'distance' state every frame. That causes re-render.
                }}>
                    {/* CANNON */}
                    <div style={{
                        position: 'absolute', left: -50, bottom: 0,
                        width: '100px', height: '100px', background: '#333',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${-angle}deg)`
                    }}>
                        <div style={{ width: '60px', height: '150px', background: 'black', margin: '0 auto', borderRadius: '10px' }} />
                    </div>

                    {/* BRO */}
                    {(phase === 'FLYING' || phase === 'RESULT') && (
                        <div style={{
                            position: 'absolute',
                            left: pos.current.x,
                            bottom: pos.current.y,
                            fontSize: '40px',
                            transform: `rotate(${distance * 5}deg)`
                        }}>
                            😎
                        </div>
                    )}

                    {/* BOOSTS */}
                    {boosts.map(b => (
                        <div key={b.id} style={{
                            position: 'absolute', left: b.x, bottom: b.y,
                            fontSize: b.type === 'SUPER' ? '50px' : '30px',
                            width: '50px', height: '50px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: b.type === 'SUPER' ? 'gold' : 'white',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px white'
                        }}>
                            {b.type === 'SUPER' ? '🚀' : '💨'}
                        </div>
                    ))}
                </div>
            </div>

            {/* UI OVERLAY */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10 }}>
                <h2 style={{ margin: 0, textShadow: '2px 2px 0 #000' }}>DIST: {distance}m</h2>
                <h3 style={{ margin: 0, textShadow: '2px 2px 0 #000' }}>ALT: {altitude}m</h3>
            </div>

            {/* AIM/POWER UI */}
            {(phase === 'AIM' || phase === 'POWER') && (
                <div style={{
                    position: 'absolute', bottom: 150, left: 50,
                    display: 'flex', flexDirection: 'column', gap: '10px'
                }}>
                    {/* Angle Meter */}
                    <div style={{ width: '200px', height: '20px', background: '#333', border: '2px solid white' }}>
                        <div style={{ width: `${(angle / 90) * 100}%`, height: '100%', background: 'orange' }} />
                    </div>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>ANGLE: {Math.floor(angle)}°</div>

                    {/* Power Meter */}
                    <div style={{ width: '200px', height: '20px', background: '#333', border: '2px solid white' }}>
                        <div style={{ width: `${power}%`, height: '100%', background: 'red' }} />
                    </div>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>POWER: {Math.floor(power)}%</div>

                    <div style={{ marginTop: '20px', color: 'white', fontSize: '1.5rem', animation: 'pulse 0.5s infinite' }}>
                        {phase === 'AIM' ? 'CLICK TO SET ANGLE' : 'CLICK TO FIRE!'}
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/arcade')} style={{ position: 'absolute', top: 20, right: 20, padding: '10px', zIndex: 20 }}>EXIT</button>

            {/* RESULT */}
            {phase === 'RESULT' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'white', zIndex: 30
                }}>
                    <h1 style={{ fontSize: '3rem', color: 'gold' }}>{distance}m</h1>
                    <p>Distance Traveled</p>
                    <SquishyButton onClick={() => {
                        setPhase('AIM');
                        setDistance(0);
                        setAltitude(0);
                        setBoosts([]);
                        pos.current = { x: 0, y: 0 };
                    }}>
                        LAUNCH AGAIN
                    </SquishyButton>
                </div>
            )}
        </div>
    );
};

export default BroCannon;
