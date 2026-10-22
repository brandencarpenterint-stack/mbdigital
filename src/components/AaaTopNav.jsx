import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import useRetroSound from '../hooks/useRetroSound';
import { getTotalGamerscore } from '../config/AchievementDefinitions';

const NAV_LINKS = [
    {
        to: '/',
        label: 'Discover',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
        )
    },
    {
        to: '/arcade',
        label: 'Games (27)',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="12" x2="10" y2="12" />
                <line x1="8" y1="10" x2="8" y2="14" />
                <line x1="15" y1="13" x2="15.01" y2="13" />
                <line x1="18" y1="11" x2="18.01" y2="11" />
                <rect x="2" y="6" width="20" height="12" rx="4" />
            </svg>
        )
    },
    {
        to: '/pocketbro',
        label: 'PocketBro',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
        )
    },
    {
        to: '/leaderboard',
        label: 'Rankings',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
        )
    },
    {
        to: '/vault',
        label: 'The Vault',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        )
    }
];

const AaaTopNav = ({ onOpenStash, onOpenQuests, onOpenSponsor }) => {
    const location = useLocation();
    const { coins, userProfile, dailyState, getLevelInfo, unlockedAchievements } = useGamification() || {};
    const { currentG } = getTotalGamerscore(unlockedAchievements);
    const { soundEnabled, toggleSound } = useSettings() || {};
    const { playClick } = useRetroSound();

    const { level } = getLevelInfo ? getLevelInfo() : { level: 1 };

    // Check if daily quests or login is ready
    const hasUnclaimedQuests = dailyState?.quests?.some(q => q.progress >= q.target && !q.claimed);
    const hasUncheckedDaily = dailyState?.lastCheckIn !== new Date().toISOString().split('T')[0];
    const showQuestDot = hasUnclaimedQuests || hasUncheckedDaily;

    const avatarUrl = userProfile?.avatar_url || '/assets/skins/face_default.png';

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            background: 'rgba(8, 11, 20, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 1000,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)'
        }}>
            {/* LEFT: Brand Logo & Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                    to="/"
                    onClick={() => playClick?.()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        color: '#fff'
                    }}
                >
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#00f0ff',
                        boxShadow: '0 0 10px #00f0ff'
                    }} />
                    <span style={{
                        fontSize: '1.05rem',
                        fontWeight: '900',
                        letterSpacing: '1.5px',
                        fontFamily: '"Orbitron", sans-serif'
                    }}>
                        MBDIGITAL
                    </span>
                    <span style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '0.62rem',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    }}>
                        PRO
                    </span>
                </Link>
            </div>

            {/* CENTER: Primary Navigation Tabs (Desktop) */}
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '4px'
            }} className="aaa-desktop-nav">
                {NAV_LINKS.map(link => {
                    const isActive = link.to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(link.to);

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => playClick?.()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontWeight: isActive ? '800' : '600',
                                color: isActive ? '#fff' : '#94a3b8',
                                background: isActive ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                                border: isActive ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid transparent',
                                boxShadow: isActive ? '0 0 14px rgba(0, 240, 255, 0.25)' : 'none',
                                transition: 'all 0.15s ease',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* RIGHT: Economy, Quests, Audio & Operator Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* 1. CP Wallet Pill */}
                <button
                    type="button"
                    onClick={() => { onOpenStash?.(); playClick?.(); }}
                    style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.35)',
                        color: '#ffd700',
                        borderRadius: '12px',
                        padding: '6px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        boxShadow: '0 0 12px rgba(255, 215, 0, 0.2)'
                    }}
                    title="Open Daily Stash / Bank"
                >
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ffd700',
                        boxShadow: '0 0 8px #ffd700'
                    }} />
                    <span>{(coins || 0).toLocaleString()} CP</span>
                </button>

                {/* 1.5 Xbox Gamerscore Pill */}
                <button
                    type="button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-achievements'));
                        playClick?.();
                    }}
                    style={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.35)',
                        color: '#00ff88',
                        borderRadius: '12px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        fontFamily: '"Orbitron", monospace',
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(0, 255, 136, 0.15)'
                    }}
                    title="Open Xbox Achievements & Gamerscore Codex"
                >
                    <span style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#00ff88',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '0.62rem'
                    }}>
                        G
                    </span>
                    <span>{currentG || 0}</span>
                </button>

                {/* 2. Free Sponsor Airdrop Pill */}
                {onOpenSponsor && (
                    <button
                        type="button"
                        onClick={() => { onOpenSponsor(); playClick?.(); }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.2))',
                            border: '1px solid #00f0ff',
                            color: '#00f0ff',
                            borderRadius: '12px',
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)'
                        }}
                        title="Claim +1,500 CP Sponsor Airdrop"
                        className="aaa-sponsor-btn"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>+1.5K AIRDROP</span>
                    </button>
                )}

                {/* 3. Daily Quests Button */}
                {onOpenQuests && (
                    <button
                        type="button"
                        onClick={() => { onOpenQuests(); playClick?.(); }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#e2e8f0',
                            borderRadius: '12px',
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                        title="Daily Quests"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                        {showQuestDot && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#ff0055',
                                boxShadow: '0 0 8px #ff0055'
                            }} />
                        )}
                    </button>
                )}

                {/* 4. Audio Sound Toggle */}
                <button
                    type="button"
                    onClick={toggleSound}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: soundEnabled ? '#00f0ff' : '#64748b',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '4px 6px'
                    }}
                    title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
                >
                    {soundEnabled ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    )}
                </button>

                {/* 4.5 Pentagon Clearance Pill */}
                <button
                    type="button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-clearance'));
                        playClick?.();
                    }}
                    style={{
                        background: 'rgba(0, 240, 255, 0.08)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        color: '#00f0ff',
                        borderRadius: '12px',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        fontFamily: '"Orbitron", monospace'
                    }}
                    title="Open Pentagon Defense Clearance Dossier"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span style={{ fontSize: '0.68rem' }}>{level >= 20 ? 'BLACK-OPS' : level >= 10 ? 'TOP-SECRET' : level >= 5 ? 'SECRET' : 'CONFIDENTIAL'}</span>
                </button>

                {/* 5. Operator Profile Pill */}
                <Link
                    to="/profile"
                    onClick={() => playClick?.()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '3px 10px 3px 4px',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}
                    title="Operator Profile"
                >
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid #00f0ff'
                    }}>
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <span style={{
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        fontFamily: 'monospace'
                    }}>
                        LVL {level}
                    </span>
                </Link>

                {/* 6. Settings Cog */}
                <Link
                    to="/settings"
                    onClick={() => playClick?.()}
                    style={{
                        textDecoration: 'none',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        transition: 'color 0.15s ease'
                    }}
                    title="Settings"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </Link>
            </div>

            {/* Responsive CSS for Mobile */}
            <style>{`
                @media (max-width: 900px) {
                    .aaa-desktop-nav {
                        display: none !important;
                    }
                    .aaa-sponsor-btn {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default AaaTopNav;
