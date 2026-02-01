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
    // const { updateStat } = useGamification(); // Removing duplicate
    const { playJump, playBoop, playCollect, playCrash, playWin } = useRetroSound();

    // Game State
    // CONFIG
    const ZONES = [
        { name: 'NOOB VALLEY', limit: 500, color: '#8BC34A' },
        { name: 'NEON CITY', limit: 1500, color: '#00BCD4' },
        { name: 'CYBER WASTELAND', limit: 3000, color: '#FF9800' },
        { name: 'COSMIC VOID', limit: 99999, color: '#9C27B0' },
    ];

    const PRICES = { power: 10, aero: 15, bounce: 20 };

    // Game State
    const [phase, setPhase] = useState('AIM'); // AIM, POWER, FLYING, RESULT
    const [angle, setAngle] = useState(45); // 0-90
    const [power, setPower] = useState(0); // 0-100
    const [distance, setDistance] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [boosts, setBoosts] = useState([]);

    // Upgrades
    const { stats, updateStat } = useGamification();
    const [upgrades, setUpgrades] = useState(stats.broCannonUpgrades || { power: 1, aero: 1, bounce: 1 });

    // Physics Refs
    const pos = useRef({ x: 0, y: 0 });
    const vel = useRef({ x: 0, y: 0 });
    const gameLoop = useRef(null);
    const cameraX = useRef(0);

    const buyUpgrade = (type) => {
        const cost = PRICES[type] * upgrades[type]; // Progressive cost? Or flat? Let's do Linear Scaling
        if (stats.arcadeCoins >= cost) {
            playCollect();
            updateStat('arcadeCoins', stats.arcadeCoins - cost); // Deduct
            const newUpgrades = { ...upgrades, [type]: upgrades[type] + 1 };
            setUpgrades(newUpgrades);
            updateStat('broCannonUpgrades', newUpgrades); // Persist
        } else {
            // Error sound
        }
    };

    // Calculate current zone
    const currentZone = ZONES.find(z => distance < z.limit) || ZONES[3];

    // ... (Oscillators/Effect unchanged)

    const launch = () => {
        playWin();
        setPhase('FLYING');

        // Calculate Initial Velocity with UPGRADES
        const rad = (angle * Math.PI) / 180;
        const baseForce = 15 + (power * 0.4);
        const upgradeMult = 1 + (upgrades.power * 0.1); // 10% per level
        const totalForce = baseForce * upgradeMult;

        pos.current = { x: 0, y: 10 };
        vel.current = {
            x: Math.cos(rad) * totalForce,
            y: Math.sin(rad) * totalForce
        };

        generateBoosts(0, 10000);
        gameLoop.current = requestAnimationFrame(update);
    };

    // ... (Generate Boosts unchanged)

    const update = () => {
        // Apply Physics
        // DRAG reduces based on AERO level
        const dragFactor = DRAG + (upgrades.aero * 0.0005); // Tiny boost to drag retention (closer to 1.0)
        // Cap drag at 0.999
        const effectiveDrag = Math.min(0.999, dragFactor);

        vel.current.x *= effectiveDrag;
        vel.current.y *= effectiveDrag;
        vel.current.y -= GRAVITY;

        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;

        // Ground Collision
        if (pos.current.y <= GROUND_Y) {
            pos.current.y = GROUND_Y;
            // BOUNCE with Upgrade
            const bounceEff = 0.5 + (upgrades.bounce * 0.05); // Start 0.5, add 0.05 per level

            if (Math.abs(vel.current.y) > 2) {
                vel.current.y *= -bounceEff;
                vel.current.x *= 0.8; // Friction
                playCrash();
            } else {
                finishGame();
                return;
            }
        }

        // ... (Collision Logic mostly same, maybe cleaner)
        // ... (Update State) 
        // We will copy the collision logic in full to ensure it matches

        // Boost Collision
        setBoosts(currentBoosts => {
            const kept = [];
            for (const b of currentBoosts) {
                const dx = b.x - pos.current.x;
                const dy = b.y - pos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 60) {
                    playCollect();
                    if (b.type === 'SUPER') {
                        vel.current.x += 15;
                        vel.current.y += 15;
                    } else {
                        vel.current.x += 5;
                        vel.current.y += 10;
                    }
                } else {
                    if (b.x > pos.current.x - 500) kept.push(b);
                }
            }
            return kept;
        });

        setDistance(Math.floor(pos.current.x));
        setAltitude(Math.floor(pos.current.y));
        cameraX.current = pos.current.x;

        if (Math.abs(vel.current.x) < 0.1 && pos.current.y <= 1) {
            finishGame();
            return;
        }

        gameLoop.current = requestAnimationFrame(update);
    };

    // ... 

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
                transform: `rotate(0deg)`,
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
            }}>
                {/* Camera Container */}
                <div style={{
                    position: 'absolute', left: 0, bottom: 0,
                    transform: `translate3d(${-cameraX.current + 100}px, ${Math.min(altitude * 0.5, 0)}px, 0)`,
                    transition: phase === 'AIM' ? 'none' : 'transform 0.1s linear'
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

            {/* ZONE INDICATOR */}
            {phase === 'FLYING' && (
                <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center' }}>
                    <h1 style={{ color: currentZone.color, textShadow: '0 0 20px black', fontSize: '3rem', margin: 0 }}>{currentZone.name}</h1>
                </div>
            )}

            {/* AIM/POWER UI & SHOP */}
            {(phase === 'AIM' || phase === 'POWER') && (
                <div style={{
                    position: 'absolute', bottom: 50, left: 50,
                    display: 'flex', gap: '40px', alignItems: 'flex-end'
                }}>
                    {/* CONTROLS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

                        <div style={{ marginTop: '20px', color: 'white', fontSize: '1.5rem', animation: 'pulse 0.5s infinite', textShadow: '0 0 10px black' }}>
                            {phase === 'AIM' ? 'CLICK TO SET ANGLE' : 'CLICK TO FIRE!'}
                        </div>
                    </div>

                    {/* UPGRADE SHOP */}
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
                        <h3 style={{ color: 'gold', margin: '0 0 10px 0' }}>CANNON SHOP (Coins: {stats.arcadeCoins || 0})</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* POWER */}
                            <div onClick={(e) => { e.stopPropagation(); buyUpgrade('power'); }} style={{ cursor: 'pointer', textAlign: 'center', background: '#333', padding: '10px', borderRadius: '5px' }}>
                                <div style={{ fontSize: '20px' }}>💥</div>
                                <div style={{ color: 'white', fontSize: '0.8rem' }}>LVL {upgrades.power}</div>
                                <div style={{ color: 'gold', fontSize: '0.8rem' }}>${PRICES.power * upgrades.power}</div>
                            </div>
                            {/* AERO */}
                            <div onClick={(e) => { e.stopPropagation(); buyUpgrade('aero'); }} style={{ cursor: 'pointer', textAlign: 'center', background: '#333', padding: '10px', borderRadius: '5px' }}>
                                <div style={{ fontSize: '20px' }}>💨</div>
                                <div style={{ color: 'white', fontSize: '0.8rem' }}>LVL {upgrades.aero}</div>
                                <div style={{ color: 'gold', fontSize: '0.8rem' }}>${PRICES.aero * upgrades.aero}</div>
                            </div>
                            {/* BOUNCE */}
                            <div onClick={(e) => { e.stopPropagation(); buyUpgrade('bounce'); }} style={{ cursor: 'pointer', textAlign: 'center', background: '#333', padding: '10px', borderRadius: '5px' }}>
                                <div style={{ fontSize: '20px' }}>🏀</div>
                                <div style={{ color: 'white', fontSize: '0.8rem' }}>LVL {upgrades.bounce}</div>
                                <div style={{ color: 'gold', fontSize: '0.8rem' }}>${PRICES.bounce * upgrades.bounce}</div>
                            </div>
                        </div>
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
                    <h2 style={{ color: currentZone.color }}>{currentZone.name}</h2>
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
