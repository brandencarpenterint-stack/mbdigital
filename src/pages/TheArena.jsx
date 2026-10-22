import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

// ENEMY TYPES
const GLITCH_MOBS = [
    { name: 'Null Pointer', level: 1, hp: 100, dmg: 5, reward: 50 },
    { name: '404 Demon', level: 3, hp: 300, dmg: 10, reward: 100 },
    { name: 'Lag Spike', level: 5, hp: 800, dmg: 15, reward: 250 },
    { name: 'Blue Screen', level: 10, hp: 2000, dmg: 50, reward: 1000, boss: true }
];

const TheArena = () => {
    const { recruits, fireMember } = useSquad();
    const { stats: petStats } = usePocketBro();
    const { addCoins, updateStat, addFollowers, followers, hasUpgrade } = useGamification();
    const { playHit, playWin, playCrash, playCollect } = useRetroSound();

    const [combatLog, setCombatLog] = useState([]);
    const [gameState, setGameState] = useState('IDLE'); // IDLE, FIGHTING, VICTORY, DEFEAT
    const [currentMob, setCurrentMob] = useState(null);
    const [battleTimer, setBattleTimer] = useState(null);

    // Derived Party Power
    const leaderPower = petStats ? Math.floor((petStats.happy + petStats.energy) / 10) : 10;
    const squadPower = recruits.reduce((acc, m) => acc + (parseFloat(m.rating) * 10), 0); // Rating affects damage

    // HACK BONUS
    const hackActive = hasUpgrade('hack_arena');
    const hackMultiplier = hackActive ? 1.2 : 1.0;

    const totalDmg = Math.floor((leaderPower + squadPower) * hackMultiplier);

    const [mobHp, setMobHp] = useState(0);

    // Auto-Scroll Log
    const logRef = React.useRef(null);
    useEffect(() => {
        logRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [combatLog]);

    const log = (msg) => {
        setCombatLog(prev => [...prev.slice(-10), msg]); // Keep last 10
    };

    const startFight = (mobIndex) => {
        if (gameState === 'FIGHTING') return;

        const mob = GLITCH_MOBS[mobIndex || 0];
        setCurrentMob(mob);
        setMobHp(mob.hp);
        setGameState('FIGHTING');
        log(`>> ENGAGING ${mob.name} (Lvl ${mob.level})!`);
    };

    // COMBAT TICK - AUTOMATED
    useEffect(() => {
        let interval;
        if (gameState === 'FIGHTING' && currentMob) {
            interval = setInterval(() => {
                // Player Turn
                // Randomized Criticals
                const isCrit = Math.random() > 0.8;
                const hit = isCrit ? totalDmg * 2 : totalDmg;

                setMobHp(prev => {
                    const nextHp = prev - hit;

                    // Visuals
                    // playHit(); // Too noisy for idle? maybe every X seconds

                    if (nextHp <= 0) {
                        // VICTORY
                        clearInterval(interval);
                        handleVictory();
                        return 0;
                    }
                    return nextHp;
                });

            }, 500); // Fast ticks (0.5s)
        }
        return () => clearInterval(interval);
    }, [gameState, currentMob, totalDmg]);

    const handleVictory = () => {
        playWin();
        const gainedUsers = Math.floor(currentMob.reward / 10);
        log(`>> VICTORY! DEFEATED ${currentMob.name}.`);
        log(`+${currentMob.reward} CP | +${gainedUsers} Fans`);
        addCoins(currentMob.reward);
        addFollowers(gainedUsers);
        setGameState('VICTORY');
        setTimeout(() => setGameState('IDLE'), 2000); // Reset
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: 'url(/assets/backgrounds/grid_bg.png), #050505',
            backgroundSize: 'cover',
            color: 'white',
            fontFamily: '"Orbitron", monospace',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* HEADER */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255, 0, 85, 0.3)',
                background: 'rgba(10, 5, 15, 0.85)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.6)'
            }}>
                <Link
                    to="/"
                    style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#00f0ff',
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        letterSpacing: '1px'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    ARCADE HUB
                </Link>
                <div>
                    <span style={{ color: '#ff0055', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '3px', textShadow: '0 0 15px rgba(255, 0, 85, 0.8)' }}>GLITCH ARENA</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span>TOTAL FANS: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{(followers || 0).toLocaleString()}</span></span>
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: hackActive ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 255, 204, 0.15)',
                        border: `1px solid ${hackActive ? '#ff0000' : '#00ffcc'}`,
                        color: hackActive ? '#ff0000' : '#00ffcc',
                        fontWeight: '900'
                    }}>
                        {Math.floor(totalDmg)} DPS {hackActive && '(OVERCLOCKED)'}
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px', overflow: 'hidden' }}>

                {/* 1. SQUAD PANEL */}
                <div style={{ width: '250px', background: 'rgba(10,10,20,0.9)', border: '1px solid #333', borderRadius: '12px', padding: '15px', overflowY: 'auto' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>YOUR PARTY</h3>

                    {/* LEADER */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '10px', background: 'linear-gradient(90deg, #333, transparent)', borderRadius: '8px' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'rgba(0, 255, 204, 0.1)',
                            border: '1px solid #00ffcc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(0, 255, 204, 0.3)'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                                <circle cx="9" cy="11" r="1" fill="#00ffcc" />
                                <circle cx="15" cy="11" r="1" fill="#00ffcc" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>POCKET BRO</div>
                            <div style={{ fontSize: '0.7rem', color: '#00ffcc' }}>LEADER (Lvl {petStats?.level || 1})</div>
                        </div>
                    </div>

                    {/* RECRUITS */}
                    {recruits.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '0.8rem' }}>
                            <div>NO SQUAD MEMBERS</div>
                            <Link to="/bro-finder" style={{ color: '#ff0055' }}>GO RECRUITING</Link>
                        </div>
                    ) : (
                        recruits.map(r => (
                            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '5px' }}>
                                <div style={{ fontSize: '1.5rem' }}>{r.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{r.name.split('_')[0]}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>{r.job}</div>
                                </div>
                                <button
                                    onClick={() => fireMember(r.id)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '6px',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '4px 6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="Dismiss Member"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* 2. BATTLE VIEW (CENTER) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* VISUALIZER */}
                    <div style={{ flex: 1, background: '#000', border: '2px solid #222', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* AMBIENT GRID */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 0, 255, .3) 25%, rgba(255, 0, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, .3) 75%, rgba(255, 0, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 255, .3) 25%, rgba(255, 0, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, .3) 75%, rgba(255, 0, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px', transform: 'perspective(500px) rotateX(60deg) translateY(100px)' }}></div>

                        {gameState === 'IDLE' && (
                            <div style={{ textAlign: 'center', color: '#555' }}>
                                WAITING FOR TARGET...
                            </div>
                        )}

                        {gameState === 'FIGHTING' && currentMob && (
                            <div style={{ textAlign: 'center', zIndex: 10 }}>
                                <motion.div
                                    animate={{
                                        x: [0, -8, 8, -4, 4, 0],
                                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                                    }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    style={{
                                        marginBottom: '20px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        filter: 'drop-shadow(0 0 35px #ff0055)'
                                    }}
                                >
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ff0055" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        <circle cx="9" cy="11" r="1.5" fill="#ff0055" />
                                        <circle cx="15" cy="11" r="1.5" fill="#ff0055" />
                                        <path d="M8 16c1.5-1 3-1 4 0 1-1 2.5-1 4 0" />
                                        <path d="M2 12h2m16 0h2" />
                                    </svg>
                                </motion.div>
                                <h2 style={{ color: 'red', textShadow: '0 0 10px red' }}>{currentMob.name}</h2>

                                {/* HP BAR */}
                                <div style={{ width: '300px', height: '10px', background: '#333', borderRadius: '5px', margin: '10px auto', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(mobHp / currentMob.hp) * 100}%`, background: 'red', transition: 'width 0.2s' }}></div>
                                </div>
                                <div>{Math.floor(mobHp)} / {currentMob.hp}</div>
                            </div>
                        )}

                        {gameState === 'VICTORY' && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                style={{ fontSize: '4rem', color: '#ffd700', textShadow: '0 0 20px #ffd700', zIndex: 20 }}
                            >
                                VICTORY!
                            </motion.div>
                        )}
                    </div>

                    {/* CONTROLS */}
                    <div style={{ display: 'flex', gap: '10px', height: '100px' }}>
                        {GLITCH_MOBS.map((mob, i) => (
                            <button
                                key={i}
                                disabled={gameState === 'FIGHTING'}
                                onClick={() => startFight(i)}
                                style={{
                                    flex: 1, background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff',
                                    cursor: gameState === 'FIGHTING' ? 'not-allowed' : 'pointer',
                                    opacity: gameState === 'FIGHTING' ? 0.5 : 1
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: mob.boss ? 'red' : 'white' }}>{mob.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                                    <span style={{ color: '#888' }}>Lvl {mob.level}</span>
                                    <span style={{ color: '#555' }}>•</span>
                                    <span>{mob.reward} CP</span>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>

                {/* 3. LOG */}
                <div style={{ width: '250px', background: 'rgba(0,0,0,0.5)', borderLeft: '1px solid #333', padding: '15px', fontFamily: '"Courier New", monospace', fontSize: '0.8rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#888', marginBottom: '10px' }}>COMBAT LOG</div>
                    {combatLog.map((line, i) => (
                        <div key={i} style={{ marginBottom: '5px', color: line.includes('VICTORY') ? '#ffd700' : '#ddd' }}>
                            {line}
                        </div>
                    ))}
                    <div ref={logRef} />
                </div>

            </div>
        </div>
    );
};

export default TheArena;
