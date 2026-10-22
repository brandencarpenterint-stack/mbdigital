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

import useRetroSound from '../hooks/useRetroSound';
import AaaTopNav from './AaaTopNav';
import AaaMobileBottomNav from './AaaMobileBottomNav';
import SponsorStationModal from './SponsorStationModal';
import QuickResumeOverlay from './QuickResumeOverlay';
import AchievementsCodexModal from './AchievementsCodexModal';
import PentagonClearanceModal from './PentagonClearanceModal';
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
    const [showAchievements, setShowAchievements] = useState(false);
    const [showClearance, setShowClearance] = useState(false);

    useEffect(() => {
        const handleOpenAchievements = () => setShowAchievements(true);
        const handleOpenClearance = () => setShowClearance(true);
        window.addEventListener('open-clearance', handleOpenClearance);
        window.addEventListener('open-achievements', handleOpenAchievements);
        return () => {
            window.removeEventListener('open-achievements', handleOpenAchievements);
            window.removeEventListener('open-clearance', handleOpenClearance);
        };
    }, []);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
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
            <PirateRadioWidget />

            {!isFullScreenGame && (
                <AaaTopNav
                    onOpenStash={() => setShowDaily(true)}
                    onOpenQuests={() => setShowQuests(true)}
                    onOpenSponsor={() => setShowSponsorModal(true)}
                />
            )}

            {/* PAGE CONTENT */}
            <main
                className="main-content"
                style={{ paddingTop: isFullScreenGame ? 0 : '72px', minHeight: '100vh', paddingBottom: isFullScreenGame ? 0 : '80px' }}
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

                {!isFullScreenGame && (
                    <footer style={{
                        marginTop: '80px',
                        padding: '30px 20px 40px 20px',
                        textAlign: 'center',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#64748b',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>PRIVACY POLICY</Link>
                            <span>•</span>
                            <Link to="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>TERMS OF SERVICE</Link>
                            <span>•</span>
                            <a href="/ads.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>ADS.TXT</a>
                            <span>•</span>
                            <Link to="/settings" style={{ color: '#94a3b8', textDecoration: 'none' }}>SETTINGS</Link>
                        </div>
                        <div style={{ color: '#475569' }}>
                            MBDIGITAL WORLD © 2088 • ALL RIGHTS RESERVED • ENTERTAINMENT SYSTEM
                        </div>
                    </footer>
                )}
            </main>

            {!isFullScreenGame && <AaaMobileBottomNav />}

            <SponsorStationModal
                isOpen={showSponsorModal}
                onClose={() => setShowSponsorModal(false)}
            />

            <AchievementsCodexModal
                isOpen={showAchievements}
                onClose={() => setShowAchievements(false)}
            />

            <PentagonClearanceModal
                isOpen={showClearance}
                onClose={() => setShowClearance(false)}
            />

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

            {/* AAA QUICK RESUME & GAME OVERLAY (ESC Guide Menu) */}
            <QuickResumeOverlay />

            {/* SLEEK CORNER BACK BUTTON (For Full Screen Games) */}
            {isFullScreenGame && (
                <Link
                    to="/arcade"
                    onClick={() => playClick()}
                    style={{
                        position: 'fixed',
                        top: '16px',
                        left: '16px',
                        zIndex: 9999,
                        background: 'rgba(8, 12, 22, 0.82)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#00f0ff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                    title="Return to Arcade Hub"
                >
                    <span>‹</span> ARCADE HUB
                </Link>
            )}
        </div>
    );
};

export default Layout;
