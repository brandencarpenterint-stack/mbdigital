import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';

const Home = () => {
    const { squadScores } = useSquad();
    const { getMood } = usePocketBro();
    const { getLevelInfo, dailyState, userProfile } = useGamification();

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
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
                            <img src={userProfile?.avatar || "/assets/merchboy_face.png"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{userProfile?.name || 'OPERATOR'}</div>
                                <Link to="/settings" style={{ textDecoration: 'none', fontSize: '1.2rem', opacity: 0.8, filter: 'grayscale(100%) brightness(1.5)' }}>⚙️</Link>
                            </div>
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
                    background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: '40px', position: 'relative',
                    border: '1px solid white'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <span style={{ background: 'white', color: '#66a6ff', padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            NEW 🔥
                        </span>
                        <h2 style={{ fontSize: '3rem', margin: '10px 0', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                            MERCH JUMP
                        </h2>
                        <p style={{ color: 'white', maxWidth: '60%', margin: '0 0 20px 0', fontWeight: 'bold' }}>Sky High Streetwear. Jetpack Enabled.</p>
                        <Link to="/arcade/merch-jump" className="squishy-btn" style={{
                            display: 'inline-block', background: 'white', color: '#66a6ff',
                            padding: '12px 30px', borderRadius: '50px', fontWeight: '900', textDecoration: 'none',
                            fontSize: '1.2rem'
                        }}>
                            JUMP NOW
                        </Link>
                    </div>
                    <div style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '10rem', opacity: 0.5 }}>👟</div>
                </div>

                {/* 3. SUB SLAYER (Took System Logs Spot? No, let's just shift) */}

                {/* 3. LIVE FEED REMOVED - Replacing with Sub Slayer or shift layout? */}
                {/* Actually, grid auto-flow handles it. Just remove the div. */}

                {/* ROW 2: APPS moved up? */}

                {/* SUB SLAYER */}
                <Link to="/subslayer" className="bento-card" style={{
                    textDecoration: 'none', color: 'white', padding: '25px',
                    background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
                    display: 'flex', justifyContent: 'space-between', flexDirection: 'column'
                }}>
                    <h3>SUB SLAYER</h3>
                    <div style={{ alignSelf: 'flex-end', fontSize: '3rem' }}>⚓</div>
                </Link>

                {/* COLORING BOOK (Updated Icon) */}
                <Link to="/coloring" className="bento-card" style={{
                    textDecoration: 'none', color: 'white', padding: '25px',
                    background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
                    display: 'flex', justifyContent: 'space-between', flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <h3 style={{ zIndex: 1 }}>COLORING BOOK</h3>
                    <div style={{ alignSelf: 'flex-end', position: 'relative' }}>
                        {/* Paint Splat */}
                        <div style={{ fontSize: '4rem', position: 'absolute', top: -20, right: 30, opacity: 0.3, transform: 'rotate(-20deg)' }}>🎨</div>
                        {/* Cute Face */}
                        <img src="/assets/merchboy_bunny.png" alt="Bunny" style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))', transform: 'rotate(10deg)' }} />
                    </div>
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
