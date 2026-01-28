import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { useGamification } from '../context/GamificationContext';
import './Layout.css';

const Layout = () => {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);
    const [coins, setCoins] = useState(0);
    const { unlockedAchievements } = useGamification() || { unlockedAchievements: [] }; // Safety check

    const isFishingGame = location.pathname.includes('/crazy-fishing') ||
        location.pathname.includes('/neon-brick-breaker') ||
        location.pathname.includes('/galaxy-defender');

    useEffect(() => {
        const updateCoins = () => {
            setCoins(parseInt(localStorage.getItem('arcadeCoins')) || 0);
        };
        updateCoins();
        const interval = setInterval(updateCoins, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="layout-container">
            {!isFishingGame && (
                <header className="main-header">
                    <div className="logo-section">
                        <Link to="/" className="home-link">
                            <img src="/assets/brokid-logo.png" alt="Brokid Logo" className="header-logo main-logo" />
                        </Link>
                    </div>
                    <nav className="main-nav">
                        <Link to="/coloring" className="nav-link">COLORING</Link>
                        <Link to="/arcade" className="nav-link arcade-link">
                            ARCADE <span style={{ fontSize: '0.6em', color: 'gold', marginLeft: '5px', verticalAlign: 'middle' }}>🪙 {coins}</span>
                        </Link>
                        <Link to="/profile" className="nav-link" style={{ background: '#333', border: '1px solid #555', borderRadius: '15px' }}>
                            👤 ID
                        </Link>
                        <button
                            onClick={() => setShowProfile(true)}
                            className="nav-link"
                            style={{ background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            🏆 <span style={{ fontSize: '0.6em', background: 'red', borderRadius: '50%', padding: '2px 6px', marginLeft: '5px' }}>{unlockedAchievements.length}</span>
                        </button>
                    </nav>
                    <div className="mascot-section">
                        <img src="/assets/boy_face.png" alt="Mascot" className="mascot-logo" />
                    </div>
                </header>
            )}
            <main className="main-content" style={{ paddingTop: '80px', minHeight: '100vh' }}>
                <Outlet />
            </main>
            {!isFishingGame && (
                <footer className="main-footer" style={{ borderTop: 'none', padding: '40px', opacity: 0.5 }}>
                    <img src="/assets/brokid-logo.png" alt="BroKid" style={{ width: '80px', filter: 'grayscale(100%) invert(1)' }} />
                    <p style={{ marginTop: '10px' }}>© 2026 DIGITAL PLAYGROUND</p>
                </footer>
            )}

            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        </div>
    );
};

export default Layout;
