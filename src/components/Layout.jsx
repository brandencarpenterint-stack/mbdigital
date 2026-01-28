import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    const [coins, setCoins] = useState(0);

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
            <header className="main-header">
                <div className="logo-section">
                    <Link to="/" className="home-link">
                        <img src="/assets/brokid-logo.png" alt="Brokid Logo" className="header-logo main-logo" />
                    </Link>
                </div>
                <nav className="main-nav">
                    <Link to="/coloring" className="nav-link">COLORING</Link>
                    <Link to="/arcade" className="nav-link arcade-link">
                        ARCADE ZONE <span style={{ fontSize: '0.6em', color: 'gold', marginLeft: '5px', verticalAlign: 'middle' }}>🪙 {coins}</span>
                    </Link>
                </nav>
                <div className="mascot-section">
                    <img src="/assets/boy-logo.png" alt="Mascot" className="mascot-logo" />
                </div>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="main-footer">
                <p>© 2026 MERCHBOY - Color & Play!</p>
            </footer>
        </div>
    );
};

export default Layout;
