import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import useRetroSound from '../hooks/useRetroSound';

const NAV_LINKS = [
    { to: '/', label: 'Discover', icon: '🎯' },
    { to: '/arcade', label: 'Games (26)', icon: '🕹️' },
    { to: '/pocketbro', label: 'PocketBro', icon: '👾' },
    { to: '/leaderboard', label: 'Rankings', icon: '🏆' },
    { to: '/vault', label: 'The Vault', icon: '🎒' }
];

const AaaTopNav = ({ onOpenStash, onOpenQuests, onOpenSponsor }) => {
    const location = useLocation();
    const { coins, userProfile, dailyState, getLevelInfo } = useGamification() || {};
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
                        background: 'rgba(255, 215, 0, 0.12)',
                        border: '1px solid rgba(255, 215, 0, 0.35)',
                        color: '#ffd700',
                        borderRadius: '12px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)'
                    }}
                    title="Open Daily Stash / Bank"
                >
                    <span>🪙</span>
                    <span>{(coins || 0).toLocaleString()}</span>
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
                        <span>⚡</span>
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
                        🎯
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
                    {soundEnabled ? '🔊' : '🔇'}
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
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    title="Settings"
                >
                    ⚙️
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
