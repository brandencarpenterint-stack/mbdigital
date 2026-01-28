import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container" style={{ paddingBottom: '100px' }}>

            {/* HERO SECTION */}
            <header className="hero-section">
                <div className="mascot-float">
                    <img src="/assets/boy_face.png" alt="Merchboy" style={{ width: '120px', height: 'auto', marginBottom: '20px', filter: 'drop-shadow(0 0 15px rgba(0,255,255,0.5))' }} />
                </div>
                <h1 className="hero-title">DIGITAL PLAYGROUND</h1>
                <p className="hero-subtitle">SHOP • CREATE • PLAY</p>
            </header>

            {/* MAIN HUB GRID */}
            <div className="hub-grid">

                {/* 1. SHOP CARD */}
                <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" className="hub-card card-shop">
                    <div className="bg-pattern shop-pattern"></div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <span className="card-icon">🛍️</span>
                        <h2 className="card-title">Merchboy Shop</h2>
                        <p className="card-desc">Cop the latest drops. Premium quality gear shipping worldwide.</p>
                        <span className="card-cta">VISIT STORE ↗</span>
                    </div>
                </a>

                {/* 2. COLORING STUDIO CARD */}
                <Link to="/coloring" className="hub-card card-studio">
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <span className="card-icon">🎨</span>
                        <h2 className="card-title">Coloring Studio</h2>
                        <p className="card-desc">Digital art therapy. 21+ interactive pages of characters and designs.</p>
                        <span className="card-cta">ENTER STUDIO</span>
                    </div>
                </Link>

                {/* 3. ARCADE ZONE CARD */}
                <Link to="/arcade" className="hub-card card-arcade">
                    <div className="bg-pattern arcade-pattern"></div>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff0055', color: 'white', padding: '5px 10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 5, animation: 'pulse 2s infinite' }}>
                        NEW GAMES!
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <span className="card-icon">🕹️</span>
                        <h2 className="card-title">Arcade Zone</h2>
                        <p className="card-desc">Play retro games, earn coins, and climb the global leaderboards.</p>
                        <span className="card-cta">INSERT COIN</span>
                    </div>
                </Link>

            </div>

            {/* FOOTER LOGO */}
            <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.5 }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '150px', filter: 'grayscale(100%)' }} />
            </div>

        </div>
    );
};

export default Home;
