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
            background: 'rgba(0,0,0,0.9)', zIndex: 6000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #FF9966, #FF5E62)', // Sunset Gradient
                width: '90%', maxWidth: '400px',
                padding: '40px 20px',
                borderRadius: '30px',
                textAlign: 'center',
                border: '4px solid white',
                boxShadow: '0 0 80px rgba(255, 94, 98, 0.6)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: '40px', height: '40px', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ✕
                </button>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ color: 'white', fontFamily: '"Arial Black", sans-serif', textTransform: 'uppercase', fontSize: '2.5rem', textShadow: '0 5px 0 rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.4)', margin: '0 0 10px 0' }}>THE STASH</h1>

                    <div style={{ background: 'white', color: '#FF5E62', display: 'inline-block', padding: '5px 20px', borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                        🔥 STREAK: {streak} DAY{streak !== 1 ? 'S' : ''}
                    </div>

                    <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
                        {status === 'LOCKED' && (
                            <div
                                onClick={openChest}
                                style={{ fontSize: '10rem', cursor: 'pointer', animation: 'float 3s infinite ease-in-out', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
                            >
                                🎁
                                <div style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold', marginTop: '-20px', opacity: 0.8 }}>TAP TO OPEN</div>
                            </div>
                        )}

                        {status === 'OPENING' && (
                            <div style={{ fontSize: '10rem', animation: 'shake 0.1s infinite', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
                                🎁
                            </div>
                        )}

                        {status === 'OPENED' && (
                            <div style={{ animation: 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                <div style={{ fontSize: '8rem', marginBottom: '10px', filter: 'drop-shadow(0 0 30px gold)' }}>✨</div>
                                <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: '900', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>{reward?.label}</div>
                                {reward?.code && <div style={{ background: 'white', color: 'black', padding: '10px', marginTop: '10px', fontFamily: 'monospace', borderRadius: '10px', fontWeight: 'bold' }}>CODE: {reward.code}</div>}
                            </div>
                        )}

                        {status === 'CLAIMED' && (
                            <div>
                                <div style={{ fontSize: '6rem', opacity: 0.5, filter: 'grayscale(1)' }}>🔒</div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', fontSize: '1.2rem' }}>Come back in:</p>
                                <div style={{ fontSize: '3rem', color: 'white', fontFamily: 'monospace', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{timeLeft}</div>
                            </div>
                        )}
                    </div>

                    {status === 'LOCKED' && (
                        <SquishyButton onClick={openChest} style={{ width: '100%', padding: '20px', background: 'white', color: '#FF5E62', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                            OPEN CHEST
                        </SquishyButton>
                    )}

                    {status === 'OPENED' && (
                        <SquishyButton onClick={onClose} style={{ width: '100%', padding: '20px', background: '#00ffaa', color: '#004400', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                            AWESOME!
                        </SquishyButton>
                    )}

                    {status === 'CLAIMED' && (
                        <SquishyButton onClick={onClose} style={{ width: '100%', padding: '20px', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem' }}>
                            CLOSE
                        </SquishyButton>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes shake { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                @keyframes pop { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default DailyStash;
