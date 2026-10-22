import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useRetroSound from '../hooks/useRetroSound';

const TABS = [
    {
        to: '/',
        label: 'Home',
        renderIcon: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        )
    },
    {
        to: '/arcade',
        label: 'Games',
        renderIcon: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        renderIcon: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
        )
    },
    {
        to: '/leaderboard',
        label: 'Ranks',
        renderIcon: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        label: 'Vault',
        renderIcon: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        )
    }
];

const AaaMobileBottomNav = () => {
    const location = useLocation();
    const { playClick } = useRetroSound();

    return (
        <nav
            className="aaa-mobile-dock"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'rgba(8, 12, 20, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                zIndex: 1000,
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
            }}
        >
            {TABS.map(tab => {
                const isActive = tab.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(tab.to);

                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        onClick={() => playClick?.()}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            textDecoration: 'none',
                            color: isActive ? '#00f0ff' : '#64748b',
                            flex: 1,
                            height: '100%',
                            transition: 'color 0.15s ease'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '22px' }}>
                            {tab.renderIcon()}
                        </span>
                        <span style={{
                            fontSize: '0.62rem',
                            fontWeight: isActive ? '800' : '600',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                            {tab.label}
                        </span>
                    </Link>
                );
            })}

            <style>{`
                @media (min-width: 901px) {
                    .aaa-mobile-dock {
                        display: none !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default AaaMobileBottomNav;
