import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import useRetroSound from '../../hooks/useRetroSound';
import SquishyButton from '../../components/SquishyButton';
import { useNavigate } from 'react-router-dom';

const GRAVITY = 0.5;
const GROUND_LEVEL = 50; // Pixels from bottom
const WORLD_HEIGHT = 2000; // For sky gradient

const BroCannon = () => {
    const navigate = useNavigate();
    const { playJump, playBoop, playCollect, playCrash, playWin } = useRetroSound();
    const { stats, updateStat } = useGamification();

    // GAME STATE
    const [gameState, setGameState] = useState('AIM'); // AIM, POWER, FLYING, LANDED
    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(0);
    const [distance, setDistance] = useState(0);
    const [maxAltitude, setMaxAltitude] = useState(0);
    const [coinsEarned, setCoinsEarned] = useState(0);

    // UPGRADES (Hydrate from stats)
    const [upgrades, setUpgrades] = useState(stats.broCannonUpgrades || { power: 1, aero: 1, bounce: 1 });
    const PRICES = { power: 10, aero: 15, bounce: 20 };

    // PHYSICS REFS (Mutable for performance)
    const physics = useRef({
        x: 0,
        y: GROUND_LEVEL,
        vx: 0,
        vy: 0,
        rot: 0,
        vRot: 0,
        isBouncing: false
    });
    const cameraX = useRef(0);
    const rafRef = useRef();

    // ENTITIES (Generated once per run)
    const [entities, setEntities] = useState([]);

    // --- SETUP & LOOP ---

    useEffect(() => {
        // Generate World on Mount
        const newEntities = [];
        for (let i = 500; i < 50000; i += Math.random() * 300 + 200) {
            const type = Math.random() > 0.8 ? 'BOOST' : (Math.random() > 0.7 ? 'OBSTACLE' : 'COIN');
            newEntities.push({
                id: i,
                x: i,
                y: Math.random() * 500 + 100, // Sky items
                type: type,
                hit: false
            });
        }
        setEntities(newEntities);

        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // OSCILLATORS (Aim & Power)
    useEffect(() => {
        let oscDir = 1;
        const interval = setInterval(() => {
            if (gameState === 'AIM') {
                setAngle(prev => {
                    if (prev >= 80) oscDir = -1;
                    if (prev <= 10) oscDir = 1;
                    return prev + (oscDir * 1.5); // Speed of aim
                });
            } else if (gameState === 'POWER') {
                setPower(prev => {
                    if (prev >= 100) oscDir = -1;
                    if (prev <= 0) oscDir = 1;
                    return prev + (oscDir * 2); // Speed of power
                });
            }
        }, 16);
        return () => clearInterval(interval);
    }, [gameState]);


    // MAIN GAME LOOP
    const tick = () => {
        if (gameState !== 'FLYING') return;

        const p = physics.current;

        // 1. Gravity & Drag
        const drag = 0.99 + (upgrades.aero * 0.0005); // Improved Aero
        p.vx *= drag;
        p.vy *= drag;
        p.vy -= GRAVITY;

        // 2. Position
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vx * 0.5; // Rotation follows speed

        // 3. Ground Collision
        if (p.y <= GROUND_LEVEL) {
            p.y = GROUND_LEVEL;

            // Bounce Check
            if (Math.abs(p.vy) > 2 || Math.abs(p.vx) > 2) {
                const bounce = 0.5 + (upgrades.bounce * 0.05);
                p.vy *= -bounce;
                p.vx *= 0.8; // Friction
                playCrash();
            } else {
                // Stop
                finishRun();
                return; // Stop Loop
            }
        }

        // 4. Update React State for UI (throttled/batched by React, mostly fine)
        setDistance(Math.floor(p.x / 10)); // 10px = 1 unit
        if (p.y > maxAltitude) setMaxAltitude(Math.floor(p.y));

        cameraX.current = p.x;

        // 5. Continue
        rafRef.current = requestAnimationFrame(tick);
    };

    const interact = () => {
        if (gameState === 'AIM') {
            playBoop();
            setGameState('POWER');
        } else if (gameState === 'POWER') {
            // LAUNCH
            const rad = (angle * Math.PI) / 180;
            const force = (power * 0.5) + 15 + (upgrades.power * 2);

            physics.current = {
                x: 0,
                y: GROUND_LEVEL + 50, // Nozzle height
                vx: Math.cos(rad) * force,
                vy: Math.sin(rad) * force,
                rot: 0
            };

            playJump();
            setGameState('FLYING');
            rafRef.current = requestAnimationFrame(tick);
        }
    };

    const finishRun = () => {
        setGameState('LANDED');
        cancelAnimationFrame(rafRef.current);

        // Calculate Rewards
        const finalDist = Math.floor(physics.current.x / 10);
        const coins = Math.floor(finalDist / 5);

        setCoinsEarned(coins);
        updateStat('arcadeCoins', (stats.arcadeCoins || 0) + coins);

        if (finalDist > (stats.broCannonHighScore || 0)) {
            updateStat('broCannonHighScore', finalDist);
            playWin();
        }
    };

    const resetGame = () => {
        setAngle(45);
        setPower(0);
        setDistance(0);
        setGameState('AIM');
        physics.current.x = 0;
        cameraX.current = 0;
    };

    const buyUpgrade = (type) => {
        const cost = PRICES[type] * upgrades[type];
        if ((stats.arcadeCoins || 0) >= cost) {
            playCollect();
            const next = { ...upgrades, [type]: upgrades[type] + 1 };
            setUpgrades(next);
            updateStat('broCannonUpgrades', next);
            updateStat('arcadeCoins', stats.arcadeCoins - cost);
        }
    };

    // VISUALS
    const skyColor = Math.min(255, Math.floor(physics.current.y / 10));
    const skyGradient = `linear-gradient(to bottom, rgb(0, 0, ${50 - skyColor}), rgb(135, 206, 235))`;

    return (
        <div style={{
            width: '100vw', height: '100vh',
            background: skyGradient,
            overflow: 'hidden', position: 'relative', touchAction: 'none',
            fontFamily: '"Orbitron", sans-serif', color: 'white'
        }} onClick={interact}>

            {/* UI LAYER */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
                <div style={{ fontSize: '2rem', textShadow: '2px 2px 0 black' }}>{distance}m</div>
                <div style={{ fontSize: '1rem', opacity: 0.8 }}>ALT: {Math.floor(physics.current.y - GROUND_LEVEL)}m</div>
            </div>

            <SquishyButton onClick={(e) => { e.stopPropagation(); navigate('/arcade'); }}
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, background: '#ff4444' }}>
                EXIT
            </SquishyButton>

            {/* UPGRADE SHOP (Visible in AIM/POWER) */}
            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div style={{
                    position: 'absolute', bottom: 20, right: 20, zIndex: 50,
                    background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '20px',
                    border: '2px solid gold'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 10px 0', color: 'gold' }}>SHOP (${stats.arcadeCoins || 0})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        {Object.keys(PRICES).map(key => (
                            <div key={key} onClick={() => buyUpgrade(key)}
                                style={{
                                    background: '#333', padding: '10px', borderRadius: '10px',
                                    textAlign: 'center', cursor: 'pointer',
                                    border: (stats.arcadeCoins >= PRICES[key] * upgrades[key]) ? '1px solid green' : '1px solid #555'
                                }}>
                                <div style={{ fontSize: '1.5rem' }}>
                                    {key === 'power' ? '💥' : (key === 'aero' ? '💨' : '🏀')}
                                </div>
                                <div style={{ fontSize: '0.7rem' }}>LVL {upgrades[key]}</div>
                                <div style={{ color: 'gold', fontSize: '0.8rem' }}>${PRICES[key] * upgrades[key]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CENTER ACTION PROMPT */}
            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div style={{
                    position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                    zIndex: 50, textAlign: 'center', pointerEvents: 'none'
                }}>
                    <h1 style={{ fontSize: '3rem', textShadow: '0 0 20px black', margin: 0 }}>
                        {gameState === 'AIM' ? 'CLICK TO AIM' : 'CLICK TO FIRE'}
                    </h1>
                    {/* Meters */}
                    <div style={{ width: '300px', height: '20px', background: '#333', border: '2px solid white', margin: '10px auto', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${gameState === 'AIM' ? angle : power}%`,
                            height: '100%',
                            background: gameState === 'AIM' ? 'orange' : 'red',
                            transition: 'width 0.05s linear'
                        }} />
                    </div>
                </div>
            )}

            {/* RESULTS SCREEN */}
            {gameState === 'LANDED' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
                    zIndex: 200, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }} onClick={e => e.stopPropagation()}>
                    <h1 style={{ fontSize: '4rem', color: 'gold', margin: 0 }}>{distance}m</h1>
                    <h2 style={{ color: 'white' }}>EARNED {coinsEarned} COINS</h2>
                    <SquishyButton onClick={resetGame} style={{ fontSize: '1.5rem', padding: '20px 40px', background: 'var(--neon-blue)' }}>
                        LAUNCH AGAIN
                    </SquishyButton>
                </div>
            )}


            {/* GAME CANVAS (DOM-based Camera) */}
            <div style={{
                position: 'absolute', inset: 0,
                transform: `translateX(${-cameraX.current + 100}px) translateY(${Math.min(0, -physics.current.y + 300)}px)`,
                transition: 'transform 0s linear' // Instant update for rigid camera
            }}>
                {/* GROUND */}
                <div style={{
                    position: 'absolute', left: -1000, bottom: 0, width: '100000px', height: `${GROUND_LEVEL}px`,
                    background: 'linear-gradient(to bottom, #4caf50 0%, #2e7d32 100%)',
                    borderTop: '5px solid #81c784'
                }} />

                {/* CANNON BASE */}
                <div style={{
                    position: 'absolute', left: -50, bottom: GROUND_LEVEL,
                    width: '60px', height: '40px', background: '#444', borderRadius: '10px'
                }} />

                {/* CANNON BARREL */}
                <div style={{
                    position: 'absolute', left: -40, bottom: GROUND_LEVEL + 20,
                    width: '80px', height: '20px', background: '#222',
                    transformOrigin: 'left center',
                    transform: `rotate(${-angle}deg)`,
                    borderRadius: '5px',
                    border: '2px solid #555'
                }} />

                {/* PROJECTILE (BRO) */}
                {(gameState === 'FLYING' || gameState === 'LANDED') && (
                    <div style={{
                        position: 'absolute',
                        left: physics.current.x,
                        bottom: physics.current.y,
                        width: '40px', height: '40px',
                        transform: `translate(-50%, 50%) rotate(${physics.current.rot}deg)`,
                        fontSize: '30px',
                        // Emoji centered
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        😎
                    </div>
                )}

                {/* DECOR / MARKERS */}
                {[0, 100, 200, 500, 1000].map(d => (
                    <div key={d} style={{ position: 'absolute', left: d * 10, bottom: GROUND_LEVEL - 30, color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}>
                        {d}m
                    </div>
                ))}
            </div>

        </div>
    );
};

export default BroCannon;
