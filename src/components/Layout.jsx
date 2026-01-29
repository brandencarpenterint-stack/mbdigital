import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileModal from './ProfileModal';
import SquadSelector from './SquadSelector';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { usePocketBro } from '../context/PocketBroContext';
import DailyStash from './DailyStash';
import DailyQuestModal from './DailyQuestModal';
import './Layout.css';

const Layout = () => {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);
    const [showDaily, setShowDaily] = useState(false);
    const [showQuests, setShowQuests] = useState(false);
    const [coins, setCoins] = useState(0);

    // Contexts
    const { dailyState, shopState } = useGamification() || { dailyState: null, shopState: null };
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



    const isFullScreenGame = location.pathname.startsWith('/arcade/') && location.pathname !== '/arcade';

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

    // Theme Switcher
    useEffect(() => {
        const equippedTheme = shopState?.equipped?.theme || 'default';
        const root = document.documentElement.style;
        const body = document.body.style;

        if (equippedTheme === 'theme_matrix') {
            root.setProperty('--bg-deep', '#000000');
            root.setProperty('--neon-blue', '#00ff00');
            root.setProperty('--neon-pink', '#003300'); // Low key matrix
            body.backgroundImage = 'linear-gradient(0deg, rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)';
            body.backgroundSize = '20px 20px';
        } else if (equippedTheme === 'theme_sunset') {
            root.setProperty('--bg-deep', '#2e003e');
            root.setProperty('--neon-blue', '#00d2ff');
            root.setProperty('--neon-pink', '#ff0055');
            root.setProperty('--glass-surface', 'rgba(255, 100, 200, 0.1)');
            body.backgroundImage = 'linear-gradient(to bottom, #2e003e 0%, #000 100%)';
            body.backgroundSize = 'cover';
        } else if (equippedTheme === 'theme_gold') {
            root.setProperty('--bg-deep', '#050505');
            root.setProperty('--neon-blue', '#ffd700');
            root.setProperty('--neon-pink', '#ffffff');
            root.setProperty('--glass-border', 'rgba(255, 215, 0, 0.3)');
            body.backgroundImage = 'radial-gradient(circle at center, #222 0%, #000 100%)';
            body.backgroundSize = 'cover';
        } else if (equippedTheme === 'theme_space') {
            root.setProperty('--bg-deep', '#000');
            root.setProperty('--neon-blue', '#ffffff');
            root.setProperty('--neon-pink', '#0044ff');
            body.backgroundImage = 'none'; // Allow CSS stars or just black
            body.backgroundColor = '#000';
        } else {
            // Reset to Default
            root.removeProperty('--bg-deep');
            root.removeProperty('--neon-blue');
            root.removeProperty('--neon-pink');
            root.removeProperty('--glass-surface');
            root.removeProperty('--glass-border');
            body.backgroundImage = '';
            body.backgroundSize = '';
            body.backgroundColor = '';
        }
    }, [shopState?.equipped?.theme]);

    // Red Dot Logic
    const hasUnclaimedQuests = dailyState?.quests?.some(q => q.progress >= q.target && !q.claimed);
    const hasUncheckedDaily = dailyState?.lastCheckIn !== new Date().toISOString().split('T')[0];
    const showQuestDot = hasUnclaimedQuests || hasUncheckedDaily;

    return (
        <div className="layout-container" style={{ paddingBottom: isFullScreenGame ? 0 : '120px' }}>
            {!isFullScreenGame && (
                <header className="glass-panel main-header" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 20px', height: '60px'
                }}>
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
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>POWERED BY</span>
                                <span style={{ fontSize: '1rem', color: '#fff', fontWeight: '900', letterSpacing: '0.5px' }}>MBDIGITAL</span>
                            </div>
                        </a>
                        <style>{`
                            @keyframes float {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-5px); }
                            }
                        `}</style>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* QUESTS BUTTON */}
                        <button
                            onClick={() => setShowQuests(true)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', padding: '0', position: 'relative'
                            }}
                        >
                            📜
                            {showQuestDot && (
                                <div style={{
                                    position: 'absolute', top: -2, right: -2,
                                    width: '10px', height: '10px', background: '#ff0055',
                                    borderRadius: '50%', boxShadow: '0 0 5px #ff0055',
                                    animation: 'pulse 1s infinite'
                                }} />
                            )}
                        </button>

                        <div style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid var(--neon-gold)',
                            padding: '5px 12px', borderRadius: '20px',
                            fontSize: '0.9rem', color: 'var(--neon-gold)', fontWeight: 'bold'
                        }}>
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

            {/* PAGE TRANSITIONS */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    className="main-content"
                    style={{ paddingTop: '90px', minHeight: '100vh' }}
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.main>
            </AnimatePresence>

            {!isFullScreenGame && (
                <>
                    {/* THE UTILITY BELT (Bottom Dock) */}
                    <div className="glass-panel" style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '90%',
                        maxWidth: '500px',
                        height: '70px',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        padding: '0 10px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        zIndex: 999,
                        border: '1px solid var(--glass-border)'
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
                                background: 'linear-gradient(135deg, var(--neon-blue), #00ccff)',
                                borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem',
                                color: 'black',
                                boxShadow: '0 0 20px var(--neon-blue)',
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
                                background: isCritical ? '#ff0055' : '#333',
                                borderRadius: '50%',
                                width: '24px', height: '24px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '0.8rem',
                                border: '2px solid var(--glass-border)',
                                animation: isCritical ? 'shake 0.5s infinite' : 'none',
                                boxShadow: isCritical ? '0 0 10px #ff0055' : 'none'
                            }}>
                                {getMood()}
                            </div>
                        </button>
                    </div>

                    <style>{`
                        .dock-icon {
                            font-size: 1.8rem;
                            color: #fff; /* White icons for Dark Glass theme */
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
            {showQuests && <DailyQuestModal onClose={() => setShowQuests(false)} />}
            <SquadSelector />

            {/* GLOBAL BRANDING FOOTER */}
            <div style={{
                position: 'fixed', bottom: '2px', left: 0, right: 0,
                textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)',
                zIndex: 2000, pointerEvents: 'none',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}>
                POWERED BY MERCHBOY
            </div>
        </div>
    );
};

export default Layout;
