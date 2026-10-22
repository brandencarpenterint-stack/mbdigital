import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import TiltCard from '../components/TiltCard';
import TheButton from '../components/TheButton';
import CinematicGameCard from '../components/CinematicGameCard';
import SponsorStationModal from '../components/SponsorStationModal';
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

const FEATURED_GAMES = [
    {
        id: 'crash',
        title: 'CYBER CRASH 2088',
        desc: 'Rocket multiplier cashout action. Lock in profits before the crash.',
        icon: '🚀',
        category: 'casino',
        gradient: 'linear-gradient(135deg, #ff0055 0%, #ff5500 100%)',
        path: '/arcade/crash'
    },
    {
        id: 'dozer',
        title: 'COIN DOZER 3D',
        desc: 'Physics coin pusher with giant drops, quakes and rare figurines.',
        icon: '🪙',
        category: 'action',
        gradient: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
        path: '/arcade/dozer'
    },
    {
        id: 'mines',
        title: 'CYBER MINES',
        desc: '5x5 grid scout drone challenge. Uncover gems and cash out multipliers.',
        icon: '💣',
        category: 'casino',
        gradient: 'linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)',
        path: '/arcade/mines'
    },
    {
        id: 'blackjack',
        title: 'CYBER 21 VIP',
        desc: 'High-roller penthouse blackjack with 3:2 payouts and double down.',
        icon: '🃏',
        category: 'casino',
        gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
        path: '/arcade/blackjack'
    }
];

const Home = () => {
    const { getLevelInfo, userProfile, coins, stats } = useGamification() || {};
    const { playBeep } = useRetroSound();
    const { btcPrice, priceChange24h, chartData, loading } = useRealBtc();

    const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    const rank = level > 20 ? "LEGEND" : (level > 10 ? "VETERAN" : "ROOKIE");

    const [time, setTime] = useState(new Date());
    const [showSponsorModal, setShowSponsorModal] = useState(false);

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
            
            {/* AAA HERO SHOWCASE (Xbox / Steam Deck Style) */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.9) 0%, rgba(8, 12, 20, 0.98) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    padding: '36px 30px',
                    marginBottom: '28px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0, 240, 255, 0.05)'
                }}
            >
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0, 240, 255, 0.15)',
                        border: '1px solid #00f0ff',
                        color: '#00f0ff',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        marginBottom: '12px'
                    }}>
                        <span>●</span> FEATURED SPOTLIGHT • SEASON 1
                    </div>

                    <h1 style={{
                        margin: '0 0 8px 0',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: '900',
                        color: '#fff',
                        letterSpacing: '1px',
                        fontFamily: '"Orbitron", sans-serif'
                    }}>
                        CYBER CRASH 2088
                    </h1>

                    <p style={{
                        margin: '0 0 20px 0',
                        fontSize: '0.95rem',
                        color: '#94a3b8',
                        lineHeight: '1.5',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                        Watch the neon rocket surge up to 100x multipliers. Lock in your profits before the catastrophic network collapse. High-stakes multiplayer action.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link
                            to="/arcade/crash"
                            style={{
                                background: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
                                color: '#000',
                                padding: '12px 28px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: '900',
                                fontSize: '0.9rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>▶</span> PLAY NOW
                        </Link>

                        <Link
                            to="/arcade"
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>🕹️</span> ALL 26 GAMES
                        </Link>
                    </div>
                </div>

                {/* Subtle Ambient Mascot Art in Background */}
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    fontSize: '12rem',
                    opacity: 0.12,
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}>
                    🚀
                </div>
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
                    {[...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f7931a', display: 'inline-block', boxShadow: '0 0 6px #f7931a' }}></span>
                                <strong style={{ color: '#fff' }}>₿ BTC/USD:</strong>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span style={{ color: btcColor, fontWeight: 'bold' }}>({isBtcUp ? '+' : ''}{priceChange24h.toFixed(2)}%)</span>
                            </span>
                            <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>
                                26 ARCADE TITLES LIVE
                            </span>
                            <span style={{ color: '#00ff66', fontWeight: 'bold' }}>
                                1,480+ OPERATORS ONLINE
                            </span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                100,000 CP VAULT JACKPOT
                            </span>
                            <span style={{ color: '#ff007f', fontWeight: 'bold' }}>
                                THE BUNKER MULTIPLAYER OPEN
                            </span>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* PREMIER ARCADE SPOTLIGHT (16:9 Cinematic Game Cards) */}
            <div style={{ marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }}></span>
                        <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1.5px', fontFamily: '"Orbitron", monospace' }}>
                            FEATURED TITLES
                        </span>
                    </div>
                    <Link to="/arcade" style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'monospace' }}>
                        VIEW ALL 26 TITLES ➔
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px'
                }}>
                    {FEATURED_GAMES.map((game) => (
                        <Link
                            key={game.id}
                            to={game.path}
                            style={{ textDecoration: 'none', display: 'flex', width: '100%', WebkitTapHighlightColor: 'transparent' }}
                        >
                            <CinematicGameCard
                                game={game}
                                highScore={stats?.[`${game.id}HighScore`] || 0}
                            />
                        </Link>
                    ))}
                </div>
            </div>

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
                                <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v12M8 10h8" />
                                    </svg>
                                    {coins.toLocaleString()} CP
                                </span>
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

            <SponsorStationModal isOpen={showSponsorModal} onClose={() => setShowSponsorModal(false)} />
        </div>
    );
};

export default Home;
