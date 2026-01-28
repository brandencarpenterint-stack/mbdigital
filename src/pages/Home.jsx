import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import DailyStash from '../components/DailyStash';

const Home = () => {
    const [showDaily, setShowDaily] = React.useState(false);

    return (
        <div className="home-container">
            {showDaily && <DailyStash onClose={() => setShowDaily(false)} />}

            {/* HERO SECTION */}
            <header className="hero-section">
                <div className="mascot-float">
                    <img src="/assets/boy_face.png" alt="Merchboy" style={{ width: '140px', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(0, 242, 255, 0.4))' }} />
                </div>
                <h1 className="hero-title">DIGITAL PLAYGROUND</h1>
                <p className="hero-subtitle">SHOP • CREATE • PLAY</p>

                {/* DAILY STASH BUTTON */}
                <button
                    onClick={() => setShowDaily(true)}
                    style={{
                        position: 'absolute',
                        top: '100px',
                        right: '20px',
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '10px 20px',
                        color: 'black',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                        animation: 'pulse 2s infinite',
                        zIndex: 100
                    }}
                >
                    🎁 DAILY GIFT
                </button>
            </header>

            {/* SQUAD WARS BAR */}
            <div style={{ padding: '0 20px', maxWidth: '800px', margin: '-30px auto 40px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <span style={{ color: '#00f2ff', textShadow: '0 0 10px #00f2ff' }}>TEAM NEON</span>
                    <span style={{ color: '#ff0055', textShadow: '0 0 10px #ff0055' }}>TEAM ZEN</span>
                </div>

                <div style={{ height: '30px', background: '#222', borderRadius: '15px', overflow: 'hidden', position: 'relative', border: '2px solid white', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, #00f2ff 50%, #ff0055 50%)',
                        position: 'absolute', top: 0, left: 0
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, bottom: 0,
                            left: '50%', width: '10px', background: 'white',
                            transform: 'skewX(-20deg) translateX(-50%)',
                            boxShadow: '0 0 10px white',
                            animation: 'warShift 5s infinite ease-in-out'
                        }}></div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5px', color: '#aaa', fontSize: '0.8rem' }}>
                    GLOBAL SQUAD WAR: LIVE
                </div>

                <style>{`
                    @keyframes warShift {
                        0% { left: 48%; }
                        50% { left: 52%; }
                        100% { left: 48%; }
                    }
                `}</style>
            </div>

            {/* MAIN HUB GRID */}
            <div className="hub-grid">

                {/* 1. SHOP CARD */}
                <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" className="hub-card card-shop">
                    <div className="card-content">
                        {/* Center Icon */}
                        <div style={{ background: 'black', borderRadius: '50%', padding: '20px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', marginBottom: '30px' }}>
                            <img src="/assets/boy_face.png" alt="Logo" style={{ width: '100%' }} />
                        </div>

                        <h2 className="card-title">MERCHBOY SHOP</h2>
                        <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Fresh drops • Quality gear • Free shipping</p>

                        <span className="shop-cta">VISIT STORE ↗</span>
                    </div>
                </a>

                {/* ARCADE ZONE CARD */}
                <Link to="/arcade" className="hub-card card-arcade" style={{ border: 'none', background: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
                    <div className="new-badge" style={{ right: '10%', top: '0' }}>NEW GAMES!</div>
                    <div className="card-content" style={{ padding: 0, justifyContent: 'flex-end', height: '100%' }}>
                        <img
                            src="/assets/arcade_cabinet.png"
                            alt="Arcade Cabinet"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '500px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 20px rgba(0, 255, 170, 0.4))',
                                transition: 'transform 0.3s ease, filter 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 170, 0.8))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(0, 255, 170, 0.4))';
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '12%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#00ffaa',
                            color: 'black',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            fontWeight: '900',
                            fontFamily: 'Courier New',
                            boxShadow: '0 0 20px #00ffaa',
                            opacity: 0.9,
                            zIndex: 10,
                            whiteSpace: 'nowrap'
                        }}>
                            PLAY NOW
                        </div>
                    </div>
                </Link>

                {/* 2. COLORING STUDIO CARD */}
                <Link to="/coloring" className="hub-card card-studio">
                    <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>🎨</span>
                            <h2 className="card-title" style={{ margin: 0 }}>Coloring Studio</h2>
                        </div>

                        <p>
                            Jump into our interactive digital coloring book featuring 21 pages of MERCHBOY characters, Valentine's scenes, and abstract designs. Perfect for all ages!
                        </p>

                        <span className="studio-btn">Start Coloring Now →</span>

                        <div className="studio-stats">
                            <div className="stat-item">
                                <span className="stat-icon">📱</span>
                                <span>Mobile Ready</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">🎨</span>
                                <span>48 Colors</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">⚡</span>
                                <span>Smart Fill</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 3. BEAT LAB CARD (New Feature) */}
                <Link to="/beatlab" className="hub-card card-beatlab" style={{ background: '#111', border: '1px solid #7000ff', textDecoration: 'none' }}>
                    <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>🎹</span>
                            <h2 className="card-title" style={{ margin: 0, color: '#aa00ff' }}>Beat Lab</h2>
                        </div>

                        <p style={{ color: '#aaa' }}>
                            Create your own lo-fi beats and rhythms with our in-browser sequencer.
                        </p>

                        <span style={{
                            background: 'linear-gradient(90deg, #7000ff 0%, #aa00ff 100%)',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            marginTop: '20px',
                            fontWeight: 'bold',
                            display: 'inline-block'
                        }}>
                            MAKE MUSIC →
                        </span>

                        {/* Visual EQ Bars Decoration */}
                        <div style={{ display: 'flex', gap: '5px', marginTop: '30px', height: '40px', alignItems: 'flex-end', justifyContent: 'center', opacity: 0.5 }}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{
                                    width: '10px',
                                    height: `${Math.random() * 100}%`,
                                    background: '#aa00ff',
                                    animation: `pulse 0.${i + 5}s infinite`
                                }}></div>
                            ))}
                        </div>
                    </div>
                </Link>

                {/* 4. POCKET BRO CARD (New Feature) */}
                <Link to="/pocketbro" className="hub-card card-pocketbro" style={{ background: '#E0F7FA', border: '4px solid #87CEEB', textDecoration: 'none' }}>
                    <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>🥚</span>
                            <h2 className="card-title" style={{ margin: 0, color: '#00838F' }}>Pocket Bro</h2>
                        </div>

                        <p style={{ color: '#006064' }}>
                            Adopt your own digital pet. Feed it, play games, and watch it grow (even when you're offline!)
                        </p>

                        <span style={{
                            background: '#00ACC1',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            marginTop: '20px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            boxShadow: '0 5px 0 #00838F'
                        }}>
                            ADOPT NOW
                        </span>
                    </div>
                </Link>

                {/* 5. SUB SLAYER CARD (New Service) */}
                <Link to="/subslayer" className="hub-card card-subslayer" style={{ background: '#0a0a0a', border: '1px solid #ff0055', textDecoration: 'none' }}>
                    <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>⚔️</span>
                            <h2 className="card-title" style={{ margin: 0, color: '#ff0055' }}>Sub Slayer</h2>
                        </div>

                        <p style={{ color: '#aaa' }}>
                            Audit your monthly bleed. One-click access to cancel unwanted subscriptions and save cash.
                        </p>

                        <span style={{
                            background: '#ff0055',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            marginTop: '20px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            boxShadow: '0 0 15px rgba(255, 0, 85, 0.4)'
                        }}>
                            SLAY BILLS
                        </span>
                    </div>
                </Link>

                {/* 6. HUSTLE MODE CARD (New Feature) */}
                <Link to="/hustle" className="hub-card card-hustle" style={{ background: '#1a0505', border: '1px solid #ff4400', textDecoration: 'none' }}>
                    <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>⏳</span>
                            <h2 className="card-title" style={{ margin: 0, color: '#ff4400' }}>Hustle Mode</h2>
                        </div>

                        <p style={{ color: '#aaa' }}>
                            Get paid to focus. Use our Pomodoro timer to crush your work and earn Arcade Coins for every session.
                        </p>

                        <span style={{
                            background: 'linear-gradient(45deg, #ff4400, #ff8800)',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            marginTop: '20px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            boxShadow: '0 0 15px rgba(255, 68, 0, 0.4)'
                        }}>
                            START TIMER
                        </span>
                    </div>
                </Link>



            </div>

            {/* FOOTER LOGO */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px', opacity: 0.3 }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '120px', filter: 'grayscale(100%) invert(1)' }} />
            </div>

        </div>
    );
};

export default Home;
