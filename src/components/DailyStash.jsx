import React, { useState, useEffect } from 'react';
import SquishyButton from './SquishyButton';
import { useGamification } from '../context/GamificationContext';
import { triggerConfetti } from '../utils/confetti';

const REWARDS = [
    { type: 'coins', amount: 50, label: '50 COINS', rare: false },
    { type: 'coins', amount: 100, label: '100 COINS', rare: false },
    { type: 'coins', amount: 500, label: '💰 500 COINS!', rare: true },
    { type: 'item', label: '🧢 Cap Sticker', rare: false },
    { type: 'code', label: '🎟️ 10% OFF Merch Code', code: 'BRO10', rare: true },
];

const DailyStash = ({ onClose }) => {
    const { addCoins } = useGamification();
    const [status, setStatus] = useState('LOCKED'); // LOCKED, OPENING, OPENED, CLAIMED
    const [reward, setReward] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [streak, setStreak] = useState(parseInt(localStorage.getItem('dailyStreak')) || 0);


    useEffect(() => {
        checkAvailability();
        const interval = setInterval(checkAvailability, 60000);
        return () => clearInterval(interval);
    }, []);

    const checkAvailability = () => {
        const lastClaim = localStorage.getItem('dailyStashClaim');
        if (lastClaim) {
            const lastDate = new Date(parseInt(lastClaim));
            const now = new Date();
            // Check if 24 hours have passed
            const diff = now - lastDate;
            const hours = diff / (1000 * 60 * 60);

            if (hours < 24) {
                setStatus('CLAIMED');
                const remaining = 24 - hours;
                const h = Math.floor(remaining);
                const m = Math.floor((remaining - h) * 60);
                setTimeLeft(`${h}h ${m}m`);
                return;
            }
        }
        if (status === 'CLAIMED') setStatus('LOCKED');
    };

    const openChest = () => {
        setStatus('OPENING');

        // Streak Logic
        let currentStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
        const lastClaim = parseInt(localStorage.getItem('dailyStashClaim')) || 0;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        // If last claim was more than 48 hours ago, reset streak (allow 48h for leniency)
        if (now - lastClaim > oneDay * 2) {
            currentStreak = 0;
        }

        const newStreak = currentStreak + 1;
        localStorage.setItem('dailyStreak', newStreak);
        setStreak(newStreak);

        // Random Reward Logic
        const roll = Math.random();
        let selected;
        if (roll > 0.95) selected = REWARDS[2]; // 500 coins (5%)
        else if (roll > 0.90) selected = REWARDS[4]; // Code (5%)
        else if (roll > 0.60) selected = REWARDS[3]; // Sticker (30%)
        else if (roll > 0.30) selected = REWARDS[1]; // 100 coins (30%)
        else selected = REWARDS[0]; // 50 coins (30%)

        setTimeout(() => {
            const finalReward = { ...selected };

            // Apply Streak Bonus to Coins
            if (finalReward.type === 'coins') {
                const bonus = Math.floor(finalReward.amount * (1 + (newStreak - 1) * 0.1));
                finalReward.amount = bonus;
                finalReward.label = `${bonus} COINS`;
            }

            setReward(finalReward);
            setStatus('OPENED');
            triggerConfetti();

            // Apply Reward
            if (finalReward.type === 'coins') {
                addCoins(finalReward.amount);
            }
            // Save Claim Time
            localStorage.setItem('dailyStashClaim', Date.now().toString());
        }, 2000); // 2s animation
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 6000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'linear-gradient(180deg, #2b1d0e, #1a0b2e)',
                width: '90%', maxWidth: '400px',
                padding: '40px 20px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '4px solid #d4af37',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.4)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    ✕
                </button>

                <h1 style={{ color: '#d4af37', fontFamily: 'Kanit', textShadow: '0 2px 0 black', margin: '0 0 10px 0' }}>THE DAILY STASH</h1>
                <div style={{ background: '#d4af37', color: 'black', display: 'inline-block', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' }}>
                    🔥 STREAK: {streak} DAY{streak !== 1 ? 'S' : ''}
                </div>

                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
                    {status === 'LOCKED' && (
                        <div
                            onClick={openChest}
                            style={{ fontSize: '8rem', cursor: 'pointer', animation: 'bounce 1s infinite' }}
                        >
                            🎁
                        </div>
                    )}

                    {status === 'OPENING' && (
                        <div style={{ fontSize: '8rem', animation: 'shake 0.1s infinite' }}>
                            🎁
                        </div>
                    )}

                    {status === 'OPENED' && (
                        <div style={{ animation: 'pop 0.5s' }}>
                            <div style={{ fontSize: '6rem', marginBottom: '10px' }}>✨</div>
                            <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{reward?.label}</div>
                            {reward?.code && <div style={{ background: 'white', color: 'black', padding: '5px', marginTop: '10px', fontFamily: 'monospace' }}>CODE: {reward.code}</div>}
                        </div>
                    )}

                    {status === 'CLAIMED' && (
                        <div>
                            <div style={{ fontSize: '5rem', opacity: 0.5 }}>🔒</div>
                            <p style={{ color: '#aaa' }}>Come back in:</p>
                            <div style={{ fontSize: '2rem', color: 'white', fontFamily: 'monospace' }}>{timeLeft}</div>
                        </div>
                    )}
                </div>

                {status === 'LOCKED' && (
                    <SquishyButton onClick={openChest} style={{ width: '100%', background: '#d4af37', color: 'black' }}>
                        OPEN CHEST
                    </SquishyButton>
                )}

                {status === 'OPENED' && (
                    <SquishyButton onClick={onClose} style={{ width: '100%', background: '#00ffaa' }}>
                        AWESOME!
                    </SquishyButton>
                )}

                {status === 'CLAIMED' && (
                    <SquishyButton onClick={onClose} style={{ width: '100%', background: '#333' }}>
                        CLOSE
                    </SquishyButton>
                )}

            </div>
            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes shake { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
                @keyframes pop { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default DailyStash;
