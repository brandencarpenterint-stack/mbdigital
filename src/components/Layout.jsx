import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
// Lazy Load Modals to prevent circular dependencies & reduce bundle size
const ProfileModal = React.lazy(() => import('./ProfileModal'));
const DailyStash = React.lazy(() => import('./DailyStash'));
const DailyQuestModal = React.lazy(() => import('./DailyQuestModal'));
const OnboardingModal = React.lazy(() => import('./OnboardingModal'));
const SocialSidebar = React.lazy(() => import('./SocialSidebar'));

import { triggerConfetti } from '../utils/confetti';
import SquadSelector from './SquadSelector';
import { useGamification } from '../context/GamificationContext';
import PirateRadioWidget from './PirateRadioWidget';
import { useSettings } from '../context/SettingsContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from './NotificationList';
import PocketCompanion from './PocketCompanion';
import GlobalRaidBoss from './GlobalRaidBoss';
import HypeTicker from './HypeTicker';

import useRetroSound from '../hooks/useRetroSound';
import CursorTrail from './CursorTrail';
import './Layout.css';

const FACES = [
    '/assets/merchboy_face.png',
    '/assets/boy_face.png',
    '/assets/hustle_boy.png'
];

const Layout = () => {
    const location = useLocation();
    // const [showProfile, setShowProfile] = useState(false); // REPLACED BY GLOBAL CONTEXT
    const [showDaily, setShowDaily] = useState(false);
    const [showQuests, setShowQuests] = useState(false);
    const [coins, setCoins] = useState(0);
    const [isDailyReady, setIsDailyReady] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBank, setShowBank] = useState(false);

    // Contexts
    // Consolidated useGamification call - extracting all needed values once
    const { dailyState, shopState, userProfile, viewedProfile, setViewedProfile, addCoins, unlockAchievement, setShopState, session } = useGamification() || { dailyState: null, shopState: null, userProfile: null, addCoins: () => { }, unlockAchievement: () => { }, setShopState: () => { }, viewedProfile: null, setViewedProfile: () => { } };

    const { unreadCount } = useNotifications();
    const { soundEnabled, toggleSound, tiktokMode, toggleTiktokMode } = useSettings();
    const { getMood, isCritical, unlockDecor } = usePocketBro() || { getMood: () => '🥚', isCritical: false, unlockDecor: () => { } };
    const { setThemeId } = useTheme();

    // Glitch State
    const [clickCount, setClickCount] = useState(0);
    const [glitchMode, setGlitchMode] = useState(false);

    // Header Face Cycle
    const [faceIndex, setFaceIndex] = useState(0);

    // AUDIO
    const { playClick, playWin, playPowerUp } = useRetroSound();

    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        const merchboyCode = ['m', 'e', 'r', 'c', 'h', 'b', 'o', 'y'];

        let konamiIndex = 0;
        let merchIndex = 0;

        const handleKeyDown = (e) => {
            // KONAMI
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    playWin();
                    alert("COMMANDO MODE! +1337 COINS & CONTROLLER UNLOCKED 🎮");
                    addCoins(1337);
                    if (setShopState && !shopState?.unlocked?.includes('furn_konami')) {
                        setShopState(prev => ({ ...prev, unlocked: [...prev.unlocked, 'furn_konami'] }));
                    }
                    if (unlockDecor) unlockDecor('furn_konami'); // Unlock in pocket bro

                    triggerConfetti();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }

            // MERCHBOY
            if (e.key.toLowerCase() === merchboyCode[merchIndex]) {
                merchIndex++;
                if (merchIndex === merchboyCode.length) {
                    playPowerUp();
                    alert("CREATOR MODE ACTIVATED. ⚡");
                    addCoins(5000);
                    // Could also max out Pocket Bro here if we exposed the setter
                    merchIndex = 0;
                }
            } else {
                merchIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [addCoins, playWin, playPowerUp, shopState?.unlocked, unlockDecor]);

    // PRESENCE HEARTBEAT
    useEffect(() => {
        if (!session?.user || !supabase) return;

        const heartbeat = async () => {
            await supabase
                .from('profiles')
                .update({ last_seen: new Date().toISOString() })
                .eq('id', session.user.id);
        };

        heartbeat(); // Immediate
        const interval = setInterval(heartbeat, 30000); // Every 30s
        return () => clearInterval(interval);
    }, [session]);

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
            <CursorTrail />
            <PirateRadioWidget />
            {!isFullScreenGame && <HypeTicker />}

            {!isFullScreenGame && (
                <>
{/* FLOATING TOP BAR (Clean & Minimal) */}
                <div style={{
                    position: 'fixed', top: '20px', left: '20px', right: '20px', zIndex: 1000,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    pointerEvents: 'none' // Let clicks pass through empty space
                }}>
                    {/* Left: Logo & Faction */}
                    <div style={{ pointerEvents: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ width: '25px', height: '25px', animation: 'float 3s ease-in-out infinite' }}>
                                <img src={FACES[faceIndex]} alt="Face" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>MBDIGITAL</span>
                        </a>
                        
                        {userProfile?.squad && (
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {userProfile.squad}
                            </div>
                        )}
                    </div>

                    {/* Right: Stats & Settings */}
                    <div style={{ pointerEvents: 'auto', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {/* Daily Quests Toggle */}
                        {session?.user && (
                            <button onClick={() => setShowQuests(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', position: 'relative' }}>
                                🎯
                                {showQuestDot && <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ff0055', borderRadius: '50%', boxShadow: '0 0 5px #ff0055' }} />}
                            </button>
                        )}

                        {/* Streak */}
                        {dailyState?.streak > 0 && (
                            <div style={{ fontSize: '0.9rem', color: dailyState.streak >= 15 ? '#00f260' : dailyState.streak >= 7 ? 'gold' : dailyState.streak >= 3 ? 'silver' : '#cd7f32', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                🔥 {dailyState.streak}
                            </div>
                        )}

                        {/* Coins */}
                        <div style={{ fontSize: '0.9rem', color: 'var(--neon-gold)', fontWeight: 'bold', marginLeft: '5px' }}>
                            🪙 {coins.toLocaleString()}
                        </div>

                        {/* Stash */}
                        <button onClick={() => setShowDaily(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', opacity: isDailyReady ? 1 : 0.6, filter: isDailyReady ? 'drop-shadow(0 0 5px gold)' : 'grayscale(100%)', animation: isDailyReady ? 'bounce 1s infinite' : 'none', marginLeft: '5px' }}>
                            🎁
                        </button>

                        {/* Sound */}
                        <button onClick={toggleSound} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', marginLeft: '5px' }}>
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                        
                        {/* Admin Void (Guest Mode) */}
                        {!session?.user && (
                            <Link to="/profile" style={{ background: '#ff0055', color: 'white', padding: '3px 10px', borderRadius: '15px', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '5px' }}>
                                GUEST
                            </Link>
                        )}
                    </div>
                </div>
</>
            )}

            {/* PAGE CONTENT */}
            <main
                className="main-content"
                style={{ paddingTop: '80px', minHeight: '100vh' }}
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

                        {/* 2. FACTIONS */}
                        <Link to="/factions" className="dock-icon" style={{ opacity: location.pathname === '/factions' ? 1 : 0.5 }}>
                            ⚔️
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
                        <Link
                            to="/profile"
                            className="dock-icon"
                            style={{
                                opacity: location.pathname === '/profile' ? 1 : 0.5,
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
                        </Link>
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
                {!isFullScreenGame && <SocialSidebar />}
            </React.Suspense>

            {/* COMPANION MODE - Show everywhere but smaller in games (handled by component) */}
            <PocketCompanion />
            <GlobalRaidBoss />

            {/* FLOATING EXIT BUTTON (For Full Screen Games) */}
            {isFullScreenGame && (
                <Link to="/arcade" style={{
                    position: 'fixed', top: '20px', left: '20px', zIndex: 9999,
                    background: 'rgba(0,0,0,0.5)', width: '50px', height: '50px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: '0 0 15px rgba(0,0,0,0.3)'
                }} onClick={() => playClick()}>
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 2px black)' }}>🏠</span>
                </Link>
            )}
        </div>
    );
};

export default Layout;
