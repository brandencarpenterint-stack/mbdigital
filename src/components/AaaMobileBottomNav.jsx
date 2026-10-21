import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useRetroSound from '../hooks/useRetroSound';

const TABS = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/arcade', label: 'Games', icon: '🕹️' },
    { to: '/pocketbro', label: 'PocketBro', icon: '👾' },
    { to: '/leaderboard', label: 'Ranks', icon: '🏆' },
    { to: '/vault', label: 'Vault', icon: '🎒' }
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
                        <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
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
