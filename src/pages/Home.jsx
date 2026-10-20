import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import TiltCard from '../components/TiltCard';
import TheButton from '../components/TheButton';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { useRealBtc } from '../hooks/useRealBtc';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

const Home = () => {
    const { getLevelInfo, userProfile, coins } = useGamification();
    const { playBeep } = useRetroSound();
    const { btcPrice, priceChange24h, chartData, loading } = useRealBtc();

    const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    const rank = level > 20 ? "LEGEND" : (level > 10 ? "VETERAN" : "ROOKIE");

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isBtcUp = priceChange24h >= 0;
    const btcColor = isBtcUp ? '#00ffcc' : '#ff0055';

    // Mini Sparkline component
    const MiniSparkline = ({ data, color }) => {
        if (!data || data.length < 2) return null;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 40;
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '40px', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="homeBtcGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#homeBtcGrad)" stroke="none" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
            </svg>
        );
    };

    return (
        <div className="home-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>
            
            {/* TOP BAR */}
            <motion.div className="top-bar-container" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="glass-panel" style={{ padding: '0 15px', height: '100%', display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '1.2rem', color: '#00ffcc', fontWeight: 'bold' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ flex: 1 }}></div>
                <a href="https://merchboy.shop" target="_blank" rel="noreferrer" className="squishy-btn" style={{
                    height: '100%', padding: '0 20px', background: '#FFD700', color: 'black',
                    display: 'flex', alignItems: 'center', fontWeight: '900', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '0.9rem'
                }}>🛍️ SHOP</a>
            </motion.div>

            {/* LIVE PULSE TICKER: REAL BITCOIN + ARCADE DROPS */}
            <div style={{
                background: '#0a0a10', borderTop: '1px solid #222', borderBottom: '1px solid #222',
                marginBottom: '20px', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap',
                display: 'flex', fontFamily: 'monospace', fontSize: '0.85rem'
            }}>
                <motion.div
                    animate={{ x: [0, -1200] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                    style={{ display: 'flex', gap: '40px', color: '#aaa', alignItems: 'center' }}
                >
                    {[...Array(3)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f7931a', display: 'inline-block', boxShadow: '0 0 6px #f7931a' }}></span>
                                <strong style={{ color: '#fff' }}>₿ BTC/USD:</strong>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span style={{ color: btcColor, fontWeight: 'bold' }}>({isBtcUp ? '+' : ''}{priceChange24h.toFixed(2)}%)</span>
                            </span>
                            <span style={{ color: '#ff007f', fontWeight: 'bold' }}>
                                📦 NEW: HypeDrop Mystery Crates are Live! CS:GO Ticker Unboxings
                            </span>
                            <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>
                                🏰 NEW: Merch Defense TD • Deploy Branded Turrets Against Haters
                            </span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                🎰 Cosmic Slots: 100,000 CP High-Roller Vault
                            </span>
                            <span style={{ color: '#f107a3', fontWeight: 'bold' }}>
                                🔮 NEW: Cyber Plinko Pegged Gravity Drops • 100x Multipliers Live!
                            </span>
                            <span style={{ color: '#ff007f', fontWeight: 'bold' }}>
                                🏎️ NEW: Neon Drift 2088 • Outrun the Void at 240 MPH!
                            </span>
                            <span style={{ color: '#00ff66', fontWeight: 'bold' }}>
                                🏇 NEW: Cyber Derby: Bro Grand Prix • 8-Bro Racing & 100x Exactas!
                            </span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                🃏 NEW: Cyber 21 Blackjack • 3:2 Natural Payouts & Whale Stakes Live!
                            </span>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* HERO ARCADE BUTTON */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }} style={{ marginBottom: '20px' }}>
                <Link to="/arcade" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(255, 0, 255, 0.15))',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(0, 255, 204, 0.3)',
                        borderRadius: '30px',
                        padding: '70px 40px',
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
                        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', margin: 0, background: 'linear-gradient(to right, #00ffcc, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 30px rgba(0,255,204,0.4)', fontWeight: '900', letterSpacing: '4px' }}>
                            ENTER ARCADE
                        </h1>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginTop: '12px', letterSpacing: '3px', fontFamily: 'monospace' }}>
                            16 RETRO GAMES • DAILY QUESTS • HIGH SCORES
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* FEATURED DROP HIGHLIGHTS: HYPEDROP & MERCH DEFENSE */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <Link to="/arcade/unboxing" style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.2), rgba(121, 40, 202, 0.2))',
                        border: '2px solid rgba(255, 0, 127, 0.4)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 0, 127, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src="/assets/skins/face_star.png" style={{ width: '55px', height: '55px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px #ff007f)' }} alt="Crate" />
                        <div>
                            <div style={{ background: '#ff007f', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px', letterSpacing: '1px' }}>HOT DROP</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>HYPE DROP: MYSTERY CRATES</h3>
                            <div style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '2px' }}>Spin CS:GO style cases & equip rare custom skins!</div>
                        </div>
                    </div>
                </Link>

                <Link to="/arcade/plinko" style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(241, 7, 163, 0.2), rgba(123, 47, 247, 0.2))',
                        border: '2px solid rgba(241, 7, 163, 0.4)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(241, 7, 163, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src="/assets/skins/face_star.png" style={{ width: '55px', height: '55px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px #f107a3)' }} alt="Plinko" />
                        <div>
                            <div style={{ background: '#f107a3', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px', letterSpacing: '1px' }}>100X DROPS</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>CYBER PLINKO</h3>
                            <div style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '2px' }}>Pegged gravity physics & multi-ball cascades!</div>
                        </div>
                    </div>
                </Link>

                <Link to="/arcade/merch-defense" style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.2), rgba(0, 114, 255, 0.2))',
                        border: '2px solid rgba(0, 198, 255, 0.4)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 198, 255, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src="/assets/skins/face_astro.png" style={{ width: '55px', height: '55px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px #00c6ff)' }} alt="Defense" />
                        <div>
                            <div style={{ background: '#00c6ff', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px', letterSpacing: '1px' }}>TOWER DEFENSE</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>MERCH DEFENSE</h3>
                            <div style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '2px' }}>Astro, Bear & Dino turrets • Stop the haters!</div>
                        </div>
                    </div>
                </Link>

                <Link to="/arcade/derby" style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.2), rgba(0, 229, 255, 0.2))',
                        border: '2px solid rgba(0, 255, 102, 0.4)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 102, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src="/assets/skins/face_dino.png" style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #00ff66', filter: 'drop-shadow(0 0 10px #00ff66)' }} alt="Derby" />
                        <div>
                            <div style={{ background: '#00ff66', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px', letterSpacing: '1px' }}>8-BRO DERBY</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>CYBER DERBY</h3>
                            <div style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '2px' }}>Velodrome track racing, tactical nitro & exactas!</div>
                        </div>
                    </div>
                </Link>

                <Link to="/arcade/blackjack" style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{
                        background: 'linear-gradient(135deg, rgba(13, 40, 24, 0.5), rgba(0, 255, 102, 0.2))',
                        border: '2px solid rgba(0, 255, 102, 0.4)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 102, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src="/assets/skins/face_money.png" style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #ffd700', filter: 'drop-shadow(0 0 10px #ffd700)' }} alt="Blackjack" />
                        <div>
                            <div style={{ background: '#ffd700', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px', letterSpacing: '1px' }}>3:2 PAYOUTS</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '900' }}>CYBER 21</h3>
                            <div style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '2px' }}>High-Roller VIP Blackjack, Splits & Charlie Bonus!</div>
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
                    <Link to="/bunker" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🚨</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>THE BUNKER</h3>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px' }}>MULTIPLAYER LOBBY</div>
                            </div>
                        </TiltCard>
                    </Link>
                    
                    <Link to="/pocketbro" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #333 0%, #111 100%)', border: '1px solid #444', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
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

                {/* LIVE BITCOIN SATELLITE CARD */}
                <motion.div variants={item}>
                    <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #171724, #0c0c14)', border: '1px solid #2d2d42', padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #28283a', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffcc', display: 'inline-block', boxShadow: '0 0 8px #00ffcc' }}></span>
                                <div style={{ color: '#f7931a', fontSize: '0.95rem', fontWeight: 'bold', letterSpacing: '1px' }}>BITCOIN ORACLE ₿</div>
                            </div>
                            <Link to="/exchange" style={{ background: '#f7931a', color: '#000', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.7rem', fontWeight: '900' }}>LIVE FEED</Link>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '1px' }}>BTC / USD SPOT</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', letterSpacing: '1px', marginTop: '2px' }}>
                                ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ color: btcColor, fontSize: '0.85rem', fontWeight: 'bold', marginTop: '2px' }}>
                                {isBtcUp ? '▲' : '▼'} {Math.abs(priceChange24h).toFixed(2)}% (24H)
                            </div>
                        </div>

                        {/* Sparkline */}
                        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                            <MiniSparkline data={chartData} color={btcColor} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#555', fontSize: '0.65rem' }}>
                                <span>24H SATELLITE ORACLE</span>
                                <span>LIVE</span>
                            </div>
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
