import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import TiltCard from '../components/TiltCard';
import TheButton from '../components/TheButton';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

const Home = () => {
    const { getLevelInfo, userProfile, coins, cryptoMarket } = useGamification();
    const { playBeep } = useRetroSound();

    const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    const rank = level > 20 ? "LEGEND" : (level > 10 ? "VETERAN" : "ROOKIE");

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>
            
            {/* TOP BAR */}
            <motion.div className="top-bar-container" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="glass-panel" style={{ padding: '0 15px', height: '100%', display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '1.2rem', color: '#00ffcc', fontWeight: 'bold' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ flex: 1 }}></div>
                <a href="https://merchboy.shop" target="_blank" className="squishy-btn" style={{
                    height: '100%', padding: '0 20px', background: '#FFD700', color: 'black',
                    display: 'flex', alignItems: 'center', fontWeight: '900', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '0.9rem'
                }}>🛍️ SHOP</a>
            </motion.div>

            
            {/* LIVE CRYPTO TICKER */}
            <div style={{
                background: '#000', borderTop: '1px solid #333', borderBottom: '1px solid #333',
                marginBottom: '20px', padding: '5px 0', overflow: 'hidden', whiteSpace: 'nowrap',
                display: 'flex', fontFamily: 'monospace', fontSize: '0.9rem'
            }}>
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    style={{ display: 'flex', gap: '30px', color: '#888' }}
                >
                    {[...Array(3)].map((_, i) => (
                        <React.Fragment key={i}>
                            {cryptoMarket?.map(token => (
                                <span key={token.id} style={{ color: token.trend > 0 ? '#00ffcc' : token.trend < 0 ? '#ff0055' : '#888' }}>
                                    {token.emoji} {token.id} ${token.price.toFixed(2)} {token.trend > 0 ? '▲' : token.trend < 0 ? '▼' : '▬'}
                                </span>
                            ))}
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>
\n            {/* HERO ARCADE BUTTON */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }} style={{ marginBottom: '30px' }}>
                <Link to="/arcade" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(255, 0, 255, 0.15))',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(0, 255, 204, 0.3)',
                        borderRadius: '30px',
                        padding: '80px 40px',
                        textAlign: 'center',
                        boxShadow: '0 0 50px rgba(0, 255, 204, 0.1), inset 0 0 20px rgba(255, 0, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 60px rgba(0, 255, 204, 0.3)'; playBeep(); }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 204, 0.1)'; }}
                    >
                        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', margin: 0, background: 'linear-gradient(to right, #00ffcc, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 30px rgba(0,255,204,0.4)', fontWeight: '900', letterSpacing: '4px' }}>
                            ENTER ARCADE
                        </h1>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginTop: '15px', letterSpacing: '3px', fontFamily: 'monospace' }}>
                            PRESS START TO BEGIN
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* SLIM DASHBOARD GRID */}
            <motion.div className="dashboard-grid" variants={container} initial="hidden" animate="show" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                
                {/* OPERATOR ID CARD */}
                <motion.div variants={item}>
                    <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #111, #222)', border: '1px solid #333', padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ position: 'relative', width: '70px', height: '70px', transform: 'translateZ(10px)' }}>
                                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: -5, width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
                                    <circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="5" fill="none" />
                                    <circle cx="50" cy="50" r="45" stroke="#00ffcc" strokeWidth="5" fill="none" strokeDasharray="283" strokeDashoffset={283 - (283 * progress / 100)} style={{ transition: 'stroke-dashoffset 1s' }} />
                                </svg>
                                <img src={userProfile?.avatar || "/assets/skins/face_default.png"} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #000' }} alt="Avatar" />
                            </div>
                            <div style={{ transform: 'translateZ(20px)' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '2px' }}>OPERATOR</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{userProfile?.name || "GUEST"}</div>
                                <div style={{ color: '#00ffcc', fontSize: '0.9rem', fontWeight: 'bold' }}>{rank} // LVL {level}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: 'auto', transform: 'translateZ(10px)' }}>
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '1px' }}>FUNDS</span>
                                <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold' }}>🪙 {coins}</span>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>

                {/* CREATIVE STUDIO & RANKINGS */}
                <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <Link to="/pocketbro" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👾</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>POCKET BRO</h3>
                            </div>
                        </TiltCard>
                    </Link>
                    
                    <Link to="/leaderboard" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)', color: '#000', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🏆</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>GLOBAL RANKINGS</h3>
                            </div>
                        </TiltCard>
                    </Link>
                    
                    <Link to="/vault" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', color: '#000', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎒</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>THE VAULT</h3>
                            </div>
                        </TiltCard>
                    </Link>
                                </motion.div>


                {/* CRYPTO EXCHANGE WIDGET */}
                <motion.div variants={item}>
                    <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #1a1a24, #0d0d14)', border: '1px solid #333', padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <div style={{ color: '#00ffcc', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px' }}>THE EXCHANGE 📈</div>
                            <Link to="/exchange" style={{ background: '#00ffcc', color: '#000', padding: '5px 10px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 'bold' }}>TRADE</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {cryptoMarket?.slice(0,3).map(token => (
                                <div key={token.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{token.emoji}</span>
                                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{token.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <span style={{ color: '#fff', fontFamily: 'monospace' }}>${token.price.toFixed(2)}</span>
                                        <span style={{ color: token.trend > 0 ? '#00ffcc' : token.trend < 0 ? '#ff0055' : '#888', fontSize: '0.7rem' }}>
                                            {token.trend > 0 ? '+' : ''}{(token.trend * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TiltCard>
                </motion.div>

                {/* THE BUTTON (GLOBAL SOCIAL EXPERIMENT) */}
                <motion.div variants={item}>
                    <TheButton />
                </motion.div>


            </motion.div>
        </div>
    );
};

export default Home;
