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
        log(`⚠ ENGAGING ${mob.name} (Lvl ${mob.level})!`);
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
        log(`🏆 VICTORY! DEFEATED ${currentMob.name}.`);
        log(`+${currentMob.reward} Coins | +${gainedUsers} Fans`);
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
            <div style={{ padding: '20px', borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '1.5rem' }}>⬅ HUB</Link>
                <div>
                    <span style={{ color: '#ff0055', fontSize: '1.5rem', fontWeight: '900', textShadow: '0 0 10px #ff0055' }}>GLITCH ARENA</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', gap: '20px' }}>
                    <span>TOTAL FANS: <span style={{ color: '#ffd700' }}>{(followers || 0).toLocaleString()}</span></span>
                    <span>SQUAD POWER: <span style={{ color: hackActive ? '#ff0000' : '#00ffcc' }}>{Math.floor(totalDmg)} DPS {hackActive && '(HACKED)'}</span></span>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px', overflow: 'hidden' }}>

                {/* 1. SQUAD PANEL */}
                <div style={{ width: '250px', background: 'rgba(10,10,20,0.9)', border: '1px solid #333', borderRadius: '12px', padding: '15px', overflowY: 'auto' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>YOUR PARTY</h3>

                    {/* LEADER */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '10px', background: 'linear-gradient(90deg, #333, transparent)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem' }}>👾</div>
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
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }}
                                    title="Fire Member"
                                >
                                    ✖
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
                                        x: [0, -10, 10, -5, 5, 0],
                                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                                    }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    style={{ fontSize: '8rem', marginBottom: '20px', filter: 'drop-shadow(0 0 20px red)' }}
                                >
                                    👹
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
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>Lvl {mob.level} • {mob.reward} CP</div>
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
