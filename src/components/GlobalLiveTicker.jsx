import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TICKER_ITEMS = [
    { id: 1, icon: '🏇', text: '@TurboDino won 2,850 CP on Bro Derby Exacta Box!', path: '/arcade/derby', color: '#00ff66' },
    { id: 2, icon: '🚀', text: '@AstroKev bailed out at 18.42x on Cyber Crash (+3,680 CP)!', path: '/arcade/crash', color: '#ff0055' },
    { id: 3, icon: '🎡', text: '@WhaleBro hit Lucky 7 on Cyber Roulette (+3,500 CP)!', path: '/arcade/roulette', color: '#ffd700' },
    { id: 4, icon: '🃏', text: '@CyberBunny hit Natural 21 Blackjack at Whale Penthouse!', path: '/arcade/blackjack', color: '#00e5ff' },
    { id: 5, icon: '⚡', text: '@MatrixBro spelled B-R-O for 3x Pinball Multiball!', path: '/arcade/pinball', color: '#d500f9' },
    { id: 6, icon: '🔓', text: 'Community Vault Pot reached 42,850 CP! 3 Keys crack it all!', path: '/underworld', color: '#ffd700' },
    { id: 7, icon: '🌊', text: '@FisherBro reeled in a Legendary Cyber Leviathan!', path: '/arcade', color: '#00e5ff' }
];

const GlobalLiveTicker = () => {
    const [onlineCount, setOnlineCount] = useState(1482);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Realistic small fluctuations in online users
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineCount(prev => {
                const delta = Math.floor(Math.random() * 7) - 3;
                return Math.max(1250, Math.min(1950, prev + delta));
            });
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Cycle ticker every 4.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % TICKER_ITEMS.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const currentItem = TICKER_ITEMS[currentIndex];

    return (
        <div className="w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 text-xs font-mono py-1.5 px-3 flex items-center justify-between z-[9999] relative select-none shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
            {/* Live Online Bros Badge */}
            <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-black text-emerald-400 tracking-wider">
                    {onlineCount.toLocaleString()} BROS LIVE
                </span>
            </div>

            {/* Cycling Marquee Event */}
            <div className="hidden sm:flex items-center justify-center flex-1 mx-4 overflow-hidden">
                <Link
                    to={currentItem.path}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    style={{ textDecoration: 'none' }}
                >
                    <span className="text-sm">{currentItem.icon}</span>
                    <span
                        className="font-bold tracking-wide transition-colors"
                        style={{ color: currentItem.color }}
                    >
                        {currentItem.text}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        PLAY NOW ◄
                    </span>
                </Link>
            </div>

            {/* Quick Casino & Lobby Hub Shortcuts */}
            <div className="flex items-center gap-2 text-[11px] font-bold">
                <Link
                    to="/bunker"
                    className="text-fuchsia-400 hover:text-fuchsia-300 px-2 py-0.5 rounded bg-fuchsia-950/40 border border-fuchsia-500/30 transition-all hover:scale-105"
                >
                    🍸 THE BUNKER
                </Link>
                <Link
                    to="/arcade"
                    className="text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 transition-all hover:scale-105"
                >
                    🕹️ ARCADE
                </Link>
            </div>
        </div>
    );
};

export default GlobalLiveTicker;
