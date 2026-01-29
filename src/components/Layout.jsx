import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import SquadSelector from './SquadSelector';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { usePocketBro } from '../context/PocketBroContext';
import DailyStash from './DailyStash';
import './Layout.css';

const Layout = () => {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);
    const [showDaily, setShowDaily] = useState(false);
    const [coins, setCoins] = useState(0);
    const { unlockedAchievements } = useGamification() || { unlockedAchievements: [] }; // Safety check
    const { soundEnabled, toggleSound } = useSettings();
    const { getMood, isCritical } = usePocketBro() || { getMood: () => '🥚', isCritical: false };



    // Glitch State
    const [clickCount, setClickCount] = useState(0);
    const [glitchMode, setGlitchMode] = useState(false);

    // Header Face Cycle
    const [faceIndex, setFaceIndex] = useState(0);
    const FACES = [
        '/assets/merchboy_money.png', // Money Eyes
        '/assets/merchboy_cat.png',   // Bear/Cat
        '/assets/merchboy_bunny.png', // Bunny
        '/assets/merchboy_face.png'   // Standard
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFaceIndex(prev => (prev + 1) % FACES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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

    // Handle Glitch Class
    useEffect(() => {
        if (glitchMode) {
            document.body.classList.add('glitch-active');
            if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 200]);
        } else {
            document.body.classList.remove('glitch-active');
        }
    }, [glitchMode]);

    const handleLogoClick = (e) => {
        setClickCount(prev => prev + 1);
        if (clickCount + 1 >= 5) {
            e.preventDefault(); // Don't nav home if activating
            setGlitchMode(prev => !prev);
            setClickCount(0);
        }
    };

    return (
        <div className="layout-container" style={{ paddingBottom: '90px' }}> {/* Add padding for bottom shelf */}
            {!isFishingGame && (
                <header className="main-header" style={{ justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(20, 20, 35, 0.9)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="logo-section">
                        <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Animated Faces */}
                            <div style={{
                                width: '35px', height: '35px',
                                animation: 'float 3s ease-in-out infinite',
                                position: 'relative'
                            }}>
                                <img
                                    src={FACES[faceIndex]}
                                    alt="Face"
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'contain',
                                        transition: 'transform 0.5s',
                                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '1px' }}>POWERED BY</span>
                                <span style={{ fontSize: '1rem', color: '#fff', fontWeight: '900', letterSpacing: '0.5px' }}>MBDIGITAL</span>
                            </div>
                        </a>
                        <style>{`
                            @keyframes float {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-5px); }
                            }
                            @keyframes spinFace {
                                0% { transform: rotate(0deg); }
                                25% { transform: rotate(10deg); }
                                75% { transform: rotate(-10deg); }
                                100% { transform: rotate(0deg); }
                            }
                        `}</style>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ background: '#333', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', color: 'gold', fontWeight: 'bold' }}>
                            🪙 {coins.toLocaleString()}
                        </div>
                        <button
                            onClick={() => setShowDaily(true)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', padding: '0',
                                animation: 'wiggle 2s infinite ease-in-out'
                            }}
                        >
                            🎁
                        </button>
                        <button
                            onClick={toggleSound}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                    </div>
                </header>
            )}

            <main className="main-content" style={{ paddingTop: '70px', minHeight: '100vh' }}>
                <Outlet />
            </main>

            {!isFishingGame && (
                <>
                    {/* THE UTILITY BELT (Bottom Dock) */}
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '90%',
                        maxWidth: '500px',
                        height: '70px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '35px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        padding: '0 10px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        zIndex: 999
                    }}>
                        {/* 1. HOME */}
                        <Link to="/" className="dock-icon" style={{ opacity: location.pathname === '/' ? 1 : 0.5 }}>
                            🏠
                        </Link>

                        {/* 2. ARCADE */}
                        <Link to="/arcade" className="dock-icon" style={{ opacity: location.pathname.includes('/arcade') ? 1 : 0.5 }}>
                            🕹️
                        </Link>

                        {/* 3. CREATE (FAB) */}
                        <div style={{ position: 'relative', top: '-25px' }}>
                            <Link to="/beatlab" style={{
                                width: '70px', height: '70px',
                                background: 'linear-gradient(135deg, #00f2ff, #00ccff)',
                                borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem',
                                color: 'white',
                                boxShadow: '0 5px 15px rgba(0, 242, 255, 0.4)',
                                border: '4px solid #fff',
                                transform: location.pathname === '/beatlab' ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>
                                🎹
                            </Link>
                        </div>

                        {/* 4. SHOP */}
                        <Link to="/shop" className="dock-icon" style={{ opacity: location.pathname === '/shop' ? 1 : 0.5 }}>
                            🛍️
                        </Link>

                        {/* 5. PROFILE (With PocketBro Status) */}
                        <button
                            onClick={() => setShowProfile(true)}
                            className="dock-icon"
                            style={{
                                opacity: showProfile ? 1 : 0.5,
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            👤
                            {/* Mood Indicator Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '-5px', right: '-5px',
                                background: isCritical ? '#ff0055' : '#eee',
                                borderRadius: '50%',
                                width: '24px', height: '24px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '0.8rem',
                                border: '2px solid white',
                                animation: isCritical ? 'shake 0.5s infinite' : 'none'
                            }}>
                                {getMood()}
                            </div>
                        </button>
                    </div>

                    <style>{`
                        .dock-icon {
                            font-size: 1.8rem;
                            color: #333; /* Dark icons for light theme */
                            text-decoration: none;
                            transition: transform 0.2s, opacity 0.2s;
                            width: 50px;
                            display: flex;
                            justify-content: center; /* fix alignment */
                        }
                        .dock-icon:active {
                            transform: scale(0.8);
                        }
                    `}</style>
                </>
            )}

            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
            {showDaily && <DailyStash onClose={() => setShowDaily(false)} />}
            <SquadSelector />
        </div>
    );
};

export default Layout;
