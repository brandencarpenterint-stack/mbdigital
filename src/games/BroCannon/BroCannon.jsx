import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';

const GRAVITY = 0.28; // Reduced by ~45% from 0.5
const GROUND_LEVEL = 50;

const BroCannon = () => {
    const navigate = useNavigate();
    const { playJump, playBoop, playCollect, playCrash, playWin } = useRetroSound();
    const { stats, updateStat } = useGamification();

    // GAME STATE
    const [gameState, setGameState] = useState('MENU'); // MENU, AIM, POWER, FLYING, LANDED
    const gameStateRef = useRef('MENU');

    // Sync State to Ref for Loop
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(0);
    const [distance, setDistance] = useState(0);
    const [coinsEarned, setCoinsEarned] = useState(0);

    // VISUALS
    const particlesRef = useRef([]);
    const shakeRef = useRef(0);

    // SKINS
    const SKINS = [
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2' },
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png?t=v2' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2' },
    ];
    const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

    // UPGRADES
    const [upgrades, setUpgrades] = useState(stats.broCannonUpgrades || { power: 1, aero: 1, bounce: 1 });
    const PRICES = { power: 10, aero: 15, bounce: 20 };

    // PHYSICS REFS
    const physics = useRef({
        x: 0, y: GROUND_LEVEL, vx: 0, vy: 0, rot: 0
    });
    // Start camera at offset -100 to match tick logic (p.x - 100)
    const cameraRef = useRef({ x: -100, y: 0 });
    const raFrame = useRef();

    // ENTITIES (ITEMS)
    const itemsRef = useRef([]);
    const [itemsRender, setItemsRender] = useState([]);

    // Generate Items
    useEffect(() => {
        const newItems = [];
        for (let i = 300; i < 100000; i += Math.random() * 100 + 50) {
            const type = Math.random() > 0.7 ? 'BOOST' : (Math.random() > 0.8 ? 'SUPER' : 'COIN');
            newItems.push({
                id: i,
                x: i,
                y: Math.random() * 800 + 50,
                type,
                active: true
            });
        }
        itemsRef.current = newItems;
        setItemsRender(newItems.slice(0, 50));

        return () => cancelAnimationFrame(raFrame.current);
    }, []);

    // OSCILLATORS
    useEffect(() => {
        let oscDir = 1;
        const interval = setInterval(() => {
            if (gameState === 'AIM') {
                setAngle(prev => {
                    if (prev >= 85) oscDir = -1;
                    if (prev <= 5) oscDir = 1;
                    return prev + (oscDir * 4);
                });
            } else if (gameState === 'POWER') {
                setPower(prev => {
                    if (prev >= 100) oscDir = -1;
                    if (prev <= 0) oscDir = 1;
                    return prev + (oscDir * 5);
                });
            }
        }, 16);
        return () => clearInterval(interval);
    }, [gameState]);

    const spawnParticles = (x, y, count = 10, color = 'white') => {
        for (let i = 0; i < count; i++) {
            particlesRef.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            });
        }
    };

    // --- MAIN LOOP ---
    const tick = () => {
        if (gameStateRef.current !== 'FLYING') return;

        const p = physics.current;
        const drag = 0.99 + (upgrades.aero * 0.0005);

        p.vx *= drag;
        p.vy -= GRAVITY;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vx * 0.5;

        // ENTITY COLLISION
        itemsRef.current.forEach(item => {
            if (!item.active) return;
            if (Math.abs(item.x - p.x) < 50 && Math.abs(item.y - p.y) < 50) {
                item.active = false;
                if (item.type === 'BOOST') {
                    p.vx += 10; p.vy += 15; playBoop();
                    spawnParticles(item.x, item.y, 5, 'orange');
                } else if (item.type === 'SUPER') {
                    p.vx += 25; p.vy += 25; playCollect();
                    spawnParticles(item.x, item.y, 15, 'cyan');
                    shakeRef.current = 10;
                } else {
                    // Coin logic if needed
                }
            }
        });

        // GROUND
        if (p.y <= GROUND_LEVEL) {
            p.y = GROUND_LEVEL;
            if (Math.abs(p.vy) > 2 || Math.abs(p.vx) > 2) {
                const bounce = 0.6 + (upgrades.bounce * 0.05); // Bouncier!
                p.vy = Math.abs(p.vy) * bounce;
                p.vx *= 0.8;
                playCrash();
                spawnParticles(p.x, p.y, 5, '#4caf50'); // Grass particles
                if (Math.abs(p.vy) > 10) shakeRef.current = 5;
            } else {
                finishRun();
                return;
            }
        }

        // PARTICLES
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const pt = particlesRef.current[i];
            pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.05;
            if (pt.life <= 0) particlesRef.current.splice(i, 1);
        }

        // SHAKE DECAY
        if (shakeRef.current > 0) shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;

        setDistance(Math.floor(p.x / 10));

        // CAMERA
        cameraRef.current.x = p.x - 100;
        cameraRef.current.y = Math.max(0, p.y - 300);

        raFrame.current = requestAnimationFrame(tick);
    };

    const interact = () => {
        if (gameState === 'AIM') {
            playBoop();
            setGameState('POWER');
        } else if (gameState === 'POWER') {
            const rad = (angle * Math.PI) / 180;
            const force = (power * 0.5) + 15 + (upgrades.power * 2);

            physics.current = {
                x: 0,
                y: GROUND_LEVEL + 50,
                vx: Math.cos(rad) * force,
                vy: Math.sin(rad) * force,
                rot: 0
            };

            playJump();
            shakeRef.current = 20; // BIG SHAKE ON LAUNCH
            spawnParticles(0, GROUND_LEVEL + 50, 20, 'white');

            setGameState('FLYING');
            gameStateRef.current = 'FLYING';
            raFrame.current = requestAnimationFrame(tick);
        }
    };

    const finishRun = () => {
        setGameState('LANDED');
        gameStateRef.current = 'LANDED';
        cancelAnimationFrame(raFrame.current);

        const finalDist = Math.floor(physics.current.x / 10);
        const coins = Math.floor(finalDist / 10); // HARDER COINS

        setCoinsEarned(coins);
        updateStat('arcadeCoins', (stats.arcadeCoins || 0) + coins);
        if (finalDist > (stats.broCannonHighScore || 0)) {
            updateStat('broCannonHighScore', finalDist);
            playWin();
        }
    };

    const resetGame = () => {
        setAngle(45); setPower(0); setDistance(0);
        setGameState('AIM'); gameStateRef.current = 'AIM';
        physics.current.x = 0; physics.current.y = GROUND_LEVEL;
        cameraRef.current = { x: -100, y: 0 }; // Consistent start pos
        itemsRef.current.forEach(i => i.active = true);
        particlesRef.current = [];
    };

    const goToMenu = () => {
        setGameState('MENU');
        gameStateRef.current = 'MENU';
        resetGame();
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

    // Derived Logic for Rendering
    const skyColor = Math.min(255, Math.floor(physics.current.y / 20)); // Slower sky darken
    const skyGradient = `linear-gradient(to bottom, rgb(0, 0, ${50 - (skyColor / 5)}), rgb(135, 206, 235))`;

    // Render Window for Items
    const visibleItems = itemsRef.current.filter(i =>
        i.active &&
        i.x > cameraRef.current.x - 200 &&
        i.x < cameraRef.current.x + 800
    );

    return (
        <div style={{
            width: '100vw', height: '100vh', background: skyGradient,
            overflow: 'hidden', position: 'relative', touchAction: 'none',
            fontFamily: '"Orbitron", sans-serif', color: 'white'
        }} onClick={interact}>

            {/* UI LAYER */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, pointerEvents: 'none' }}>
                <div style={{ fontSize: '2rem', textShadow: '2px 2px 0 black' }}>{distance}m</div>
                <div style={{ fontSize: '1rem', opacity: 0.8 }}>ALT: {Math.floor(physics.current.y - GROUND_LEVEL)}m</div>
            </div>

            <SquishyButton onClick={(e) => { e.stopPropagation(); navigate('/arcade'); }}
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, background: '#ff4444' }}>
                EXIT
            </SquishyButton>

            {/* SHOP */}
            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div style={{
                    position: 'absolute', bottom: 20, right: 20, zIndex: 50,
                    background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '20px',
                    border: '2px solid gold'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 10px 0', color: 'gold' }}>SHOP (COINS: {stats.arcadeCoins || 0})</h3>
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

            {/* MENU */}
            {gameState === 'MENU' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
                    zIndex: 200, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }} onClick={e => e.stopPropagation()}>
                    <h1 style={{ fontSize: '3rem', color: 'gold', marginBottom: '20px' }}>BRO CANNON</h1>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                        {SKINS.map(skin => (
                            <div key={skin.id} onClick={() => { setSelectedSkin(skin); playBoop(); }}
                                style={{
                                    border: selectedSkin.id === skin.id ? '3px solid gold' : '1px solid #555',
                                    borderRadius: '15px', padding: '10px',
                                    background: selectedSkin.id === skin.id ? 'rgba(255, 215, 0, 0.2)' : '#222',
                                    cursor: 'pointer', transform: selectedSkin.id === skin.id ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                <img src={skin.src} width="60" height="60" style={{ display: 'block' }} />
                                <div style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '5px' }}>{skin.name}</div>
                            </div>
                        ))}
                    </div>
                    <SquishyButton onClick={resetGame} style={{ fontSize: '1.5rem', padding: '15px 50px', background: 'var(--neon-green)', color: 'black' }}>
                        PLAY
                    </SquishyButton>
                </div>
            )}

            {/* AIM/POWER UI */}
            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div style={{
                    position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                    zIndex: 50, textAlign: 'center', pointerEvents: 'none'
                }}>
                    <h1 style={{ fontSize: '3rem', textShadow: '0 0 20px black', margin: 0 }}>
                        {gameState === 'AIM' ? 'CLICK TO AIM' : 'CLICK TO FIRE'}
                    </h1>
                    <div style={{ width: '300px', height: '20px', background: '#333', border: '2px solid white', margin: '10px auto', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${gameState === 'AIM' ? angle : power}%`,
                            height: '100%',
                            background: gameState === 'AIM' ? 'orange' : 'red',
                        }} />
                    </div>
                </div>
            )}

            {/* RESULTS */}
            {gameState === 'LANDED' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
                    zIndex: 200, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }} onClick={e => e.stopPropagation()}>
                    <h1 style={{ fontSize: '4rem', color: 'gold', margin: 0 }}>{distance}m</h1>
                    <h2 style={{ color: 'white' }}>EARNED {coinsEarned} COINS</h2>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                        <SquishyButton onClick={resetGame} style={{ fontSize: '1.2rem', padding: '15px 30px', background: 'var(--neon-blue)' }}>
                            LAUNCH AGAIN
                        </SquishyButton>
                        <SquishyButton onClick={goToMenu} style={{ fontSize: '1.2rem', padding: '15px 30px', background: '#444' }}>
                            MENU
                        </SquishyButton>
                    </div>
                </div>
            )}

            {/* GAME WORLD */}
            <div style={{
                position: 'absolute', inset: 0, // Fill screen
                // IMPORTANT: transform moves the WORLD against the camera
                transform: `translate3d(${-cameraRef.current.x + 100}px, ${-cameraRef.current.y + 300}px, 0) translate(${Math.random() * shakeRef.current}px, ${Math.random() * shakeRef.current}px)`,
                pointerEvents: 'none',
                willChange: 'transform' // optimize
            }}>

                {/* ITEMS */}
                {visibleItems.map(item => (
                    <div key={item.id} style={{
                        position: 'absolute', left: item.x, bottom: item.y,
                        width: '40px', height: '40px',
                        transform: 'translate(-50%, 50%)',
                        fontSize: '30px', textAlign: 'center'
                    }}>
                        {item.type === 'BOOST' ? '🚀' : (item.type === 'SUPER' ? '⚡' : '🟡')}
                    </div>
                ))}

                {/* PARTICLES */}
                {particlesRef.current.map((pt, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: pt.x, bottom: pt.y,
                        width: '6px', height: '6px', background: pt.color,
                        borderRadius: '50%', opacity: pt.life,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 5px ${pt.color}`
                    }} />
                ))}

                {/* GROUND */}
                <div style={{
                    position: 'absolute', left: -1000, bottom: 0, width: '100000px', height: `${GROUND_LEVEL}px`,
                    background: 'linear-gradient(to bottom, #4caf50 0%, #2e7d32 100%)',
                    borderTop: '5px solid #81c784'
                }} />

                {/* CANNON */}
                <div style={{
                    position: 'absolute', left: -50, bottom: GROUND_LEVEL,
                    width: '60px', height: '40px', background: '#444', borderRadius: '10px'
                }} />
                <div style={{
                    position: 'absolute', left: -40, bottom: GROUND_LEVEL + 20,
                    width: '80px', height: '20px', background: '#222',
                    transformOrigin: 'left center', transform: `rotate(${-angle}deg)`,
                    borderRadius: '5px', border: '2px solid #555'
                }} />

                {/* PLAYER */}
                {(gameState === 'FLYING' || gameState === 'LANDED') && (
                    <div style={{
                        position: 'absolute', left: physics.current.x, bottom: physics.current.y,
                        width: '50px', height: '50px',
                        transform: `translate(-50%, 50%) rotate(${physics.current.rot}deg)`
                    }}>
                        <img src={selectedSkin.src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroCannon;
