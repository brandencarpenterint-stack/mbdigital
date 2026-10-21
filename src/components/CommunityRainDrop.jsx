import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const RAIN_DONORS = [
    { name: 'Don Dino', skin: '/assets/skins/face_dino.png', quote: 'Making it rain on the syndicate!' },
    { name: 'Whale Bro', skin: '/assets/skins/face_money.png', quote: 'Drinks and chips on me tonight!' },
    { name: 'Cyber Bunny', skin: '/assets/skins/face_bunny.png', quote: 'Hit the jackpot, sharing the loot!' },
    { name: 'Astro Pilot', skin: '/assets/skins/face_star.png', quote: 'Cosmic bounty dropped from orbit!' }
];

const CommunityRainDrop = () => {
    const { addCoins, incrementStat } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playCollect, playAirhorn } = useRetroSound();

    const [activeDrop, setActiveDrop] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [floatingGains, setFloatingGains] = useState([]);

    // Schedule next rain drop every ~3-4 minutes
    useEffect(() => {
        const scheduleNextDrop = () => {
            const delay = 120000 + Math.random() * 90000; // 2 to 3.5 minutes
            return setTimeout(() => {
                const donor = RAIN_DONORS[Math.floor(Math.random() * RAIN_DONORS.length)];
                const totalPot = [1000, 2500, 5000][Math.floor(Math.random() * 3)];
                const dropX = Math.floor(15 + Math.random() * 70); // 15% to 85% width

                setActiveDrop({
                    id: Date.now(),
                    donor,
                    totalPot,
                    x: dropX
                });
                setTimeLeft(12); // 12 seconds to claim
            }, delay);
        };

        const timer = scheduleNextDrop();
        return () => clearTimeout(timer);
    }, []);

    // Countdown timer for active drop
    useEffect(() => {
        if (!activeDrop) return;
        if (timeLeft <= 0) {
            setActiveDrop(null);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [activeDrop, timeLeft]);

    // Handle Claiming the Drop
    const handleClaim = () => {
        if (!activeDrop) return;

        // Reward between 75 and 350 CP
        const reward = Math.floor(75 + Math.random() * 275);
        if (addCoins) addCoins(reward);
        if (incrementStat) incrementStat('rainDropsClaimed', 1);

        playCollect();
        playAirhorn();
        triggerConfetti();

        showToast(`🎉 Claimed +${reward} CP from ${activeDrop.donor.name}'s Rain Drop!`, 'success');

        // Floating gain effect
        setFloatingGains(prev => [
            ...prev,
            { id: Date.now(), text: `+${reward} CP`, x: activeDrop.x }
        ]);

        setActiveDrop(null);

        // Remove floating text after 1.8s
        setTimeout(() => {
            setFloatingGains(prev => prev.filter(g => Date.now() - g.id < 1800));
        }, 2000);
    };

    return (
        <>
            {/* Active Rain Drop Item */}
            {activeDrop && (
                <div
                    className="fixed top-12 z-[99999] flex flex-col items-center animate-bounce cursor-pointer select-none"
                    style={{ left: `${activeDrop.x}%`, transform: 'translateX(-50%)' }}
                    onClick={handleClaim}
                >
                    {/* Parachute / Dropping Loot Box */}
                    <div className="relative group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-200 border-2 border-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.8)] flex items-center justify-center p-1 hover:scale-110 active:scale-95 transition-all">
                            <span className="text-2xl animate-spin" style={{ animationDuration: '4s' }}>💰</span>
                        </div>

                        {/* Donor Skin Badge */}
                        <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md">
                            <img src={activeDrop.donor.skin} alt={activeDrop.donor.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Parachute Strings */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-xs">
                            🪂
                        </div>
                    </div>

                    {/* Banner Label */}
                    <div className="mt-1 bg-black/90 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-[10px] font-mono font-black shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <span>🌧️ TAP TO CLAIM! ({timeLeft}s)</span>
                    </div>
                </div>
            )}

            {/* Floating Reward Numbers */}
            {floatingGains.map(gain => (
                <div
                    key={gain.id}
                    className="fixed top-24 z-[99999] text-yellow-400 font-mono font-black text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] pointer-events-none animate-floatUp"
                    style={{ left: `${gain.x}%`, transform: 'translateX(-50%)' }}
                >
                    {gain.text}
                </div>
            ))}
        </>
    );
};

export default CommunityRainDrop;
