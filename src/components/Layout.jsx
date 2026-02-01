import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Lazy Load Modals to prevent circular dependencies & reduce bundle size
const ProfileModal = React.lazy(() => import('./ProfileModal'));
const DailyStash = React.lazy(() => import('./DailyStash'));
const DailyQuestModal = React.lazy(() => import('./DailyQuestModal'));
const OnboardingModal = React.lazy(() => import('./OnboardingModal'));
const SocialSidebar = React.lazy(() => import('./SocialSidebar'));

import SquadSelector from './SquadSelector';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from './NotificationList';
import PocketCompanion from './PocketCompanion';
import HypeTicker from './HypeTicker';
import PirateRadio from './PirateRadio';
import useRetroSound from '../hooks/useRetroSound';
import './Layout.css';

const Layout = () => {
    // ... (Hooks remain same, just rendering changes)
    const location = useLocation();
    // const [showProfile, setShowProfile] = useState(false); // REPLACED BY GLOBAL CONTEXT
    const [showDaily, setShowDaily] = useState(false);
    const [showQuests, setShowQuests] = useState(false);
    const [coins, setCoins] = useState(0);
    const [isDailyReady, setIsDailyReady] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Contexts
    const { dailyState, shopState, userProfile, viewedProfile, setViewedProfile } = useGamification() || { dailyState: null, shopState: null, userProfile: null };
    const { unreadCount } = useNotifications();
    const { soundEnabled, toggleSound } = useSettings();
    const { getMood, isCritical } = usePocketBro() || { getMood: () => '🥚', isCritical: false };
    const { setThemeId } = useTheme();

    // Glitch State
    const [clickCount, setClickCount] = useState(0);
    const [glitchMode, setGlitchMode] = useState(false);

    // Header Face Cycle
    const [faceIndex, setFaceIndex] = useState(0);
    const { playClick } = useRetroSound();

    const FACES = [
        '/assets/merchboy_money.png', // Money Eyes
        '/assets/merchboy_cat.png',   // Bear/Cat
        '/assets/merchboy_bunny.png', // Bunny
        '/assets/merchboy_face.png'   // Standard
    ];

    // Global Click Sound
    useEffect(() => {
        const handleClick = () => playClick();
        window.addEventListener('mousedown', handleClick); // mousedown feels snappier than click
        return () => window.removeEventListener('mousedown', handleClick);
    }, [playClick]);

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
        const checkDaily = () => {
            const lastClaim = localStorage.getItem('dailyStashClaim');
            if (!lastClaim) {
                setIsDailyReady(true);
            } else {
                const diff = Date.now() - parseInt(lastClaim);
                setIsDailyReady(diff > 24 * 60 * 60 * 1000);
            }
        };

        updateCoins();
        checkDaily();
        const interval = setInterval(() => {
            updateCoins();
            checkDaily();
        }, 1000);
        return () => clearInterval(interval);
    }, [showDaily]); // Re-check when modal closes

    // Handle Glitch Class
    useEffect(() => {
        if (glitchMode) {
            document.body.classList.add('glitch-active');
            if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 200]);
        } else {
            document.body.classList.remove('glitch-active');
        }
    }, [glitchMode]);

    // Theme Switcher - Sync from Shop State to Theme Context
    useEffect(() => {
        const equippedTheme = shopState?.equipped?.theme;
        if (equippedTheme) {
            setThemeId(equippedTheme);
        }
    }, [shopState?.equipped?.theme, setThemeId]);

    // Red Dot Logic
    const hasUnclaimedQuests = dailyState?.quests?.some(q => q.progress >= q.target && !q.claimed);
    const hasUncheckedDaily = dailyState?.lastCheckIn !== new Date().toISOString().split('T')[0];
    const showQuestDot = hasUnclaimedQuests || hasUncheckedDaily;

    return (
        <div className="layout-container" style={{ paddingBottom: isFullScreenGame ? 0 : '120px' }}>
            {!isFullScreenGame && <HypeTicker />}

            {!isFullScreenGame && (
                <header className="glass-panel main-header" style={{
                    position: 'fixed', top: '30px', left: 0, right: 0, zIndex: 1000,
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
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-5px); }
                            }
                            @keyframes bounce {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-10px); }
                            }
                        `}</style>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', position: 'relative' }}>
                        {/* NOTIFICATIONS */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', padding: '0', position: 'relative'
                            }}
                        >
                            🔔
                            {unreadCount > 0 && (
                                <div style={{
                                    position: 'absolute', top: -5, right: -5,
                                    width: '18px', height: '18px', background: '#ff0055', color: 'white',
                                    borderRadius: '50%', fontSize: '0.7rem', display: 'flex',
                                    justifyContent: 'center', alignItems: 'center', border: '2px solid black',
                                    animation: 'pulse 1s infinite'
                                }}>
                                    {unreadCount}
                                </div>
                            )}
                        </button>
                        {showNotifications && <NotificationList onClose={() => setShowNotifications(false)} />}

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
                                opacity: isDailyReady ? 1 : 0.6,
                                filter: isDailyReady ? 'drop-shadow(0 0 5px gold)' : 'grayscale(100%)',
                                animation: isDailyReady ? 'bounce 1s infinite' : 'none'
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

            {/* PAGE CONTENT */}
            <main
                className="main-content"
                style={{ paddingTop: '90px', minHeight: '100vh' }}
            >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ width: '100%' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {!isFullScreenGame && (
                <>
                    {/* PIRATE RADIO */}
                    <PirateRadio />

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

                        {/* 2. BEAT LAB (Demoted from Center) */}
                        <Link to="/beatlab" className="dock-icon" style={{ opacity: location.pathname === '/beatlab' ? 1 : 0.5 }}>
                            🎹
                        </Link>

                        {/* 3. ARCADE (Promoted to CENTER FAB) */}
                        <div style={{ position: 'relative', top: '-25px' }}>
                            <Link to="/arcade" style={{
                                width: '70px', height: '70px',
                                background: 'linear-gradient(135deg, var(--neon-blue), #00ccff)',
                                borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem',
                                color: 'black',
                                boxShadow: '0 0 20px var(--neon-blue)',
                                border: '4px solid #fff',
                                transform: location.pathname.includes('/arcade') ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>
                                🕹️
                            </Link>
                        </div>

                        {/* 4. SHOP */}
                        <Link to="/shop" className="dock-icon" style={{ opacity: location.pathname === '/shop' ? 1 : 0.5 }}>
                            🛍️
                        </Link>

                        {/* 5. PROFILE (With PocketBro Status) */}
                        <button
                            onClick={() => setViewedProfile(userProfile)}
                            className="dock-icon"
                            style={{
                                opacity: viewedProfile ? 1 : 0.5,
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 5px #d53f8c)' }}>👾</span>
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

            {/* GLOBAL PROFILE MODAL -> USES VIEWED PROFILE */}
            <React.Suspense fallback={null}>
                {viewedProfile && (
                    <ProfileModal
                        onClose={() => setViewedProfile(null)}
                        readOnlyProfile={viewedProfile.code === userProfile?.code ? null : viewedProfile}
                    />
                )}

                {showDaily && <DailyStash onClose={() => setShowDaily(false)} />}
                {showQuests && <DailyQuestModal onClose={() => setShowQuests(false)} />}
                <SquadSelector />
                <OnboardingModal />
                <SocialSidebar />
            </React.Suspense>

            {/* COMPANION MODE */}
            <PocketCompanion />
        </div>
    );
};

export default Layout;
