import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import TiltCard from '../components/TiltCard';
import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';

// Helper for Staggered Animation
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const Home = () => {
    const { getMood } = usePocketBro();
    const { getLevelInfo, dailyState, userProfile, coins, followers, activeDrops } = useGamification();
    const { playBeep } = useRetroSound();

    const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    const rank = level > 20 ? "LEGEND" : (level > 10 ? "VETERAN" : "ROOKIE");

    // Revenue Calc
    const totalRevenue = activeDrops?.reduce((a, b) => a + (b.revenue || 0), 0) || 0;

    // Crypto Ticker State
    const [ticker, setTicker] = useState("MCH: $102.30 ▲ | DOG: $0.44 ▼ | VOD: $666.00 ▲ | GLT: $49.20 ▲");

    // Live Clock
    const [time, setTime] = useState(new Date());
    const { showToast } = useToast();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Announce Update
        setTimeout(() => {
            showToast("SYSTEM UPDATE: MBX EXCHANGE v2.0 INSTALLED", "info");
        }, 1000);
    }, []);

    return (
        <div className="home-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>

            {/* 1. TOP BAR: STATUS & TICKER */}
            <motion.div
                className="top-bar-container"
                initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            >
                {/* CLOCK */}
                <div className="glass-panel" style={{ padding: '0 15px', height: '100%', display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '1.2rem', color: '#00ffcc', fontWeight: 'bold' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* TICKER */}
                <div className="glass-panel" style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ whiteSpace: 'nowrap', animation: 'ticker 20s linear infinite', position: 'absolute', width: '100%', color: '#aaa', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        SYSTEM_STATUS: ONLINE // {ticker} // NEW MERCH DROPPED // ACTIVE USERS: {(followers || 0).toLocaleString()} // PASSIVE REVENUE: {totalRevenue} COINS //
                    </div>
                </div>

                {/* SHOP BTN */}
                <a href="https://merchboy.shop" target="_blank" className="squishy-btn" style={{
                    height: '100%', padding: '0 20px', background: '#FFD700', color: 'black',
                    display: 'flex', alignItems: 'center', fontWeight: '900', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '0.9rem'
                }}>
                    🛍️ SHOP
                </a>
            </motion.div>

            {/* DASHBOARD GRID */}
            <motion.div
                className="dashboard-grid"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* 1. OPERATOR ID CARD (Profile) */}
                <motion.div variants={item} onMouseEnter={playBeep}>
                    <TiltCard className="bento-card" style={{
                        background: 'linear-gradient(135deg, #111, #222)',
                        border: '1px solid #333', padding: '25px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ position: 'relative', width: '70px', height: '70px', transform: 'translateZ(10px)' }}>
                                {/* Avatar Ring */}
                                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: -5, width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
                                    <circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="5" fill="none" />
                                    <circle cx="50" cy="50" r="45" stroke="#00ffcc" strokeWidth="5" fill="none" strokeDasharray="283" strokeDashoffset={283 - (283 * progress / 100)} transition="stroke-dashoffset 1s" />
                                </svg>
                                <img src={userProfile?.avatar || "/assets/merchboy_face.png"} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #000' }} />
                            </div>
                            <div style={{ transform: 'translateZ(20px)' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '2px' }}>OPERATOR</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{userProfile?.name || "GUEST"}</div>
                                <div style={{ color: '#00ffcc', fontSize: '0.9rem', fontWeight: 'bold' }}>{rank} // LVL {level}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', textAlign: 'center', transform: 'translateZ(10px)' }}>
                                <div style={{ fontSize: '0.7rem', color: '#555' }}>BALANCE</div>
                                <div style={{ fontSize: '1.2rem', color: '#ffd700' }}>🪙 {coins}</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', textAlign: 'center', transform: 'translateZ(10px)' }}>
                                <div style={{ fontSize: '0.7rem', color: '#555' }}>MOOD</div>
                                <div style={{ fontSize: '1.2rem' }}>{getMood()}</div>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>

                {/* 2. MISSION CONTROL (Quests) */}
                <motion.div variants={item} onMouseEnter={playBeep}>
                    <TiltCard className="bento-card" style={{
                        background: '#0f0f1b', border: '1px solid #444', padding: '0', overflow: 'hidden'
                    }} glowColor="rgba(0,255,100,0.2)">
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
                            <span style={{ fontWeight: 'bold', color: '#fff' }}>DAILY MISSIONS</span>
                            <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>
                                {dailyState?.quests?.filter(q => q.claimed).length}/3
                            </span>
                        </div>
                        <div style={{ padding: '20px', transform: 'translateZ(10px)' }}>
                            {dailyState?.quests?.map(q => (
                                <div key={q.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px',
                                    opacity: q.claimed ? 0.5 : 1
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%', border: q.claimed ? 'none' : '2px solid #555',
                                        background: q.claimed ? '#00ff00' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {q.claimed && '✓'}
                                    </div>
                                    <div style={{ flex: 1, textDecoration: q.claimed ? 'line-through' : 'none', color: '#ddd' }}>
                                        {q.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TiltCard>
                </motion.div>

                {/* 3. FEATURED APP: LEADERBOARD */}
                <Link to="/leaderboard" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'black', padding: '20px'
                        }} glowColor="rgba(255, 215, 0, 0.4)">
                            <div style={{ textAlign: 'center', transform: 'translateZ(30px)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '5px' }}>🏆</div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>RANKINGS</h2>
                                <div style={{ opacity: 0.8, fontSize: '0.7rem', fontWeight: 'bold' }}>HALL OF LEGENDS</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                {/* 4. FEATURED APP: BRO FINDER */}
                <Link to="/bro-finder" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(135deg, #ff0055 0%, #7700ff 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', padding: '20px'
                        }} glowColor="rgba(255,0,255,0.4)">
                            <div style={{ textAlign: 'center', transform: 'translateZ(30px)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🔥</div>
                                <h2 style={{ margin: 0, fontSize: '2rem', fontStyle: 'italic' }}>BroFinder</h2>
                                <div style={{ opacity: 0.8, fontSize: '0.8rem' }}>RECRUIT SQUAD MEMBERS</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                {/* 4. FEATURED GAME: THE ARENA */}
                <Link to="/arena" style={{ textDecoration: 'none', color: 'inherit', gridColumn: 'span 2', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(to right, #9d00ff 0%, #ff0055 100%)',
                            display: 'flex', alignItems: 'center', padding: '40px', position: 'relative'
                        }} glowColor="rgba(255,0,0,0.5)">
                            <div style={{ zIndex: 10, maxWidth: '50%', transform: 'translateZ(30px)' }}>
                                <span style={{ background: 'white', color: '#ff0055', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>NEW RELEASE</span>
                                <h2 style={{ fontSize: '3rem', margin: '15px 0', textShadow: '0 5px 10px rgba(0,0,0,0.2)' }}>GLITCH ARENA</h2>
                                <p style={{ margin: 0, fontWeight: 'bold', opacity: 0.9 }}>IDLE SQUAD BATTLER</p>
                                <button style={{
                                    marginTop: '20px',
                                    background: 'white', color: '#333', padding: '15px 30px',
                                    border: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}>
                                    ENTER COMBAT ▶
                                </button>
                            </div>
                            <div style={{ position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%) translateZ(50px)' }}>
                                {/* 3D-ish Element */}
                                <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', transform: 'rotate(15deg)' }}>⚔️</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                {/* 5. APP ROW */}
                <Link to="/hustle" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{ background: '#222', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>⏱️</div>
                            <div style={{ transform: 'translateZ(10px)' }}>HUSTLE MODE <div style={{ fontSize: '0.7rem', color: '#888' }}>FOCUS TIMER</div></div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/merch-lab" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{ background: '#fff', color: '#333', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>🧢</div>
                            <div style={{ transform: 'translateZ(10px)' }}>MERCH LAB <div style={{ fontSize: '0.7rem', color: '#888' }}>DESIGN STUDIO</div></div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/exchange" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{ background: '#0a0a12', color: '#00ffcc', border: '1px solid #00ffcc', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>📉</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    MBX EXCHANGE
                                    <span style={{ fontSize: '0.6rem', background: '#00ffcc', color: 'black', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>v2.0</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>CRYPTO</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/terminal" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{ background: '#000', color: '#00ff00', border: '1px solid #00ff00', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>💻</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    TERMINAL
                                    <span style={{ fontSize: '0.6rem', background: '#00ff00', color: 'black', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>ROOT</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>ACCESS GRANTED</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/beatlab" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(135deg, #110022, #330066)',
                            border: '1px solid #5500aa',
                            color: '#e0c0ff',
                            padding: '20px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>🎹</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                BEAT LAB
                                <div style={{ fontSize: '0.7rem', color: '#aa88cc' }}>SONIC STUDIO</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/subslayer" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(135deg, #220000, #440000)',
                            border: '1px solid #ff3333',
                            color: '#ffaaaa',
                            padding: '20px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>⚔️</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                SUB SLAYER
                                <div style={{ fontSize: '0.7rem', color: '#cc5555' }}>EXPENSE TRACKER</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

            </motion.div>
        </div>
    );
};

export default Home;
