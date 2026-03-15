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
import TheButton from '../components/TheButton';

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
    const [ticker, setTicker] = useState("MCH: $102 ▲ | GLT: $49 ▲");

    // Live Clock
    const [time, setTime] = useState(new Date());
    const { showToast } = useToast();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
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

                {/* SPACER */}
                <div style={{ flex: 1 }}></div>

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
                                    <div style={{ flex: 1 }}>
                                        <div style={{ textDecoration: q.claimed ? 'line-through' : 'none', color: '#ddd' }}>
                                            {q.desc || q.text} {/* Use desc if available */}
                                        </div>
                                        {!q.claimed && (
                                            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                                                Progress: {q.progress || 0} / {q.target}
                                                <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '2px', borderRadius: '2px' }}>
                                                    <div style={{
                                                        width: `${Math.min(100, ((q.progress || 0) / q.target) * 100)}%`,
                                                        height: '100%', background: 'var(--neon-green)', borderRadius: '2px'
                                                    }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {!q.claimed && (q.progress || 0) >= q.target && (
                                        <button style={{
                                            background: 'gold', color: 'black', border: 'none', borderRadius: '4px',
                                            padding: '5px 10px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                                        }}>
                                            CLAIM
                                        </button>
                                    )}
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




                <Link to="/merch-lab" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{ background: '#fff', color: '#333', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>🧢</div>
                            <div style={{ transform: 'translateZ(10px)' }}>MERCH LAB <div style={{ fontSize: '0.7rem', color: '#888' }}>DESIGN STUDIO</div></div>
                        </TiltCard>
                    </motion.div>
                </Link>

                <Link to="/coloring" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: '#fff', color: '#333',
                            padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            border: '2px solid #ff0055'
                        }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>🎨</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                COLORING BOOK
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>RELAX & CREATE</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </Link>

                {/* OFFICIAL STORE (External) */}
                <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div variants={item} onMouseEnter={playBeep} style={{ height: '100%' }}>
                        <TiltCard className="bento-card" style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)', // Gold
                            color: 'black',
                            padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            border: '1px solid #ffcc00'
                        }}>
                            <div style={{ fontSize: '2.5rem', transform: 'translateZ(20px)' }}>🛍️</div>
                            <div style={{ transform: 'translateZ(10px)' }}>
                                <div style={{ fontWeight: '900', letterSpacing: '-1px' }}>MERCHBOY.SHOP</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 'bold' }}>OFFICIAL STORE</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </a>

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

                {/* THE BUTTON (Viral Stunt) */}
                <motion.div variants={item} style={{ height: '100%' }}>
                    <TheButton />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Home;
