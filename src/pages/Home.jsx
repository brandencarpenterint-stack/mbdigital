import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">

            {/* HERO SECTION */}
            <header className="hero-section">
                <div className="mascot-float">
                    <img src="/assets/boy_face.png" alt="Merchboy" style={{ width: '140px', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(0, 242, 255, 0.4))' }} />
                </div>
                <h1 className="hero-title">DIGITAL PLAYGROUND</h1>
                <p className="hero-subtitle">SHOP • CREATE • PLAY</p>
            </header>

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

                {/* 3. ARCADE ZONE CARD */}
                <Link to="/arcade" className="hub-card card-arcade">
                    <div className="arcade-bg"></div>
                    <div className="new-badge">NEW GAMES!</div>

                    <div className="card-content">
                        <span style={{ fontSize: '3rem', marginBottom: '20px', filter: 'drop-shadow(0 0 10px #00ffaa)' }}>🕹️</span>
                        <h2 className="card-title">ARCADE ZONE</h2>
                        <p>Play retro games, earn coins, and climb the global leaderboards.</p>
                        <span className="arcade-btn">INSERT COIN</span>

                        {/* Decorative Grid SVG or small details could act here */}
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
