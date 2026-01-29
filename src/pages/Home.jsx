import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';

const Home = () => {
    const { squadScores } = useSquad();
    const { getMood } = usePocketBro();
    const { getLevelInfo, dailyState } = useGamification();

    const { level, progress, totalXP } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0, totalXP: 0 };
    const rank = level > 20 ? "LEGEND" : (level > 10 ? "VETERAN" : "ROOKIE");

    // Live Feed
    const [logs, setLogs] = useState([
        { id: 1, text: "System Online...", time: "Now" },
        { id: 2, text: "Market: +2.4% 📈", time: "2m" },
        { id: 3, text: "New High Score: SNAKE", time: "15m" },
    ]);

    useEffect(() => {
        if (dailyState) {
            const completed = dailyState.quests.filter(q => q.claimed).length;
            const status = completed === 3 ? "ALL COMPLETED ✅" : `${completed}/3 DONE`;
            setLogs(prev => [
                { id: 99, text: `Daily Protocols: ${status}`, time: "Live" },
                ...prev.filter(l => l.id !== 99)
            ]);
        }
    }, [dailyState]);

    return (
        <div className="home-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>

            {/* V3 DASHBOARD HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--neon-blue)', textShadow: '0 0 20px rgba(0, 243, 255, 0.4)' }}>
                        COMMAND CENTER
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', letterSpacing: '2px', fontSize: '0.8rem' }}>
                        SYSTEM V3.0 // ONLINE
                    </p>
                </div>
                <div className="glass-panel" style={{ padding: '5px 15px', fontSize: '0.9rem', color: 'var(--neon-green)' }}>
                    SIGNAL: STRONG 📶
                </div>
            </header>

            {/* DASHBOARD GRID */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                gridAutoRows: 'minmax(150px, auto)'
            }}>

                {/* 1. PROFILE WIDGET (Left Column) */}
                <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '60px', height: '60px',
                            borderRadius: '50%', background: '#333',
                            border: '2px solid var(--neon-pink)',
                            overflow: 'hidden'
                        }}>
                            <img src="/assets/merchboy_face.png" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>OPERATOR</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{rank}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--neon-green)', marginTop: '2px' }}>AUTO-SAVE: ACTIVE 💾</div>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                            <span>LVL {level}</span>
                            <span>{Math.floor(progress)}% XP</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-pink))' }}></div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                        <div className="glass-panel" style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
                            <div>MOOD</div>
                            <div style={{ fontSize: '1.5rem' }}>{getMood()}</div>
                        </div>
                        <div className="glass-panel" style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
                            <div>TEAM</div>
                            <div style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>NEON</div>
                        </div>
                    </div>
                </div>

                {/* 2. FEATURED GAME (Center/Large) */}
                <div className="bento-card" style={{
                    gridColumn: 'span 2', // Spans 2 cols if space permits
                    minHeight: '300px',
                    background: 'linear-gradient(135deg, #2a0845 0%, #6441a5 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: '40px', position: 'relative',
                    border: '1px solid var(--neon-gold)'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <span style={{ background: 'var(--neon-gold)', color: 'black', padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            HOT 🔥
                        </span>
                        <h2 style={{ fontSize: '3rem', margin: '10px 0', textShadow: '0 0 20px #ff00ff' }}>
                            COSMIC SLOTS
                        </h2>
                        <p style={{ color: '#e0c3fc', maxWidth: '60%', margin: '0 0 20px 0' }}>8-Lines. Wild Stars. Massive Multipliers.</p>
                        <Link to="/arcade/slots" className="squishy-btn" style={{
                            display: 'inline-block', background: 'var(--neon-gold)', color: 'black',
                            padding: '12px 30px', borderRadius: '50px', fontWeight: '900', textDecoration: 'none',
                            fontSize: '1.2rem'
                        }}>
                            SPIN NOW
                        </Link>
                    </div>
                    <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '12rem', opacity: 0.5 }}>🎰</div>
                </div>

                {/* 3. LIVE FEED (Right/Small) */}
                <div className="glass-panel" style={{ padding: '20px', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--neon-blue)' }}>SYSTEM LOGS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {logs.map(log => (
                            <div key={log.id} style={{ fontSize: '0.8rem', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ color: '#666', marginRight: '10px' }}>[{log.time}]</span>
                                {log.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROW 2: APPS */}

                {/* COLORING BOOK */}
                <Link to="/coloring" className="bento-card" style={{
                    textDecoration: 'none', color: 'white', padding: '25px',
                    background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
                    display: 'flex', justifyContent: 'space-between', flexDirection: 'column'
                }}>
                    <h3>COLORING BOOK</h3>
                    <div style={{ alignSelf: 'flex-end', fontSize: '3rem' }}>🎨</div>
                </Link>

                {/* BEAT LAB */}
                <Link to="/beatlab" className="bento-card" style={{
                    textDecoration: 'none', color: 'white', padding: '25px',
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    display: 'flex', justifyContent: 'space-between', flexDirection: 'column'
                }}>
                    <h3>BEAT LAB</h3>
                    <div style={{ alignSelf: 'flex-end', fontSize: '3rem' }}>🎹</div>
                </Link>

                {/* SHOP */}
                <a href="https://merchboy.shop" target="_blank" className="bento-card" style={{
                    textDecoration: 'none', color: 'black', padding: '25px',
                    background: 'white',
                    display: 'flex', justifyContent: 'space-between', flexDirection: 'column'
                }}>
                    <h3>THE SHOP</h3>
                    <div style={{ alignSelf: 'flex-end', fontSize: '3rem' }}>👕</div>
                </a>

            </div>
        </div>
    );
};

export default Home;
