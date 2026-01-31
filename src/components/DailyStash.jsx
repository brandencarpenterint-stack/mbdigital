import React, { useState, useEffect } from 'react';
import SquishyButton from './SquishyButton';
import { useGamification } from '../context/GamificationContext';
import { triggerConfetti } from '../utils/confetti';
import useRetroSound from '../hooks/useRetroSound';

const DailyStash = ({ onClose }) => {
    const { addCoins } = useGamification();
    const { playClick, playFanfare, playCoin } = useRetroSound();

    // Status: LOCKED -> OPENING -> OPENED -> CLAIMED
    const [status, setStatus] = useState('LOCKED');
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
        playClick(); // Click sound
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

        // Simple Tiered Rewards based on RNG
        const roll = Math.random();
        let baseAmount = 50;
        let isBigWin = false;

        if (roll > 0.95) { baseAmount = 500; isBigWin = true; } // Jackpot
        else if (roll > 0.85) { baseAmount = 250; isBigWin = true; }
        else if (roll > 0.60) baseAmount = 100;

        setTimeout(() => {
            // Apply Streak Bonus
            const bonus = Math.floor(baseAmount * (1 + (newStreak - 1) * 0.1));

            setReward({
                amount: bonus,
                label: `${bonus} COINS`,
                isBigWin
            });
            setStatus('OPENED');

            if (isBigWin) {
                playFanfare();
                triggerConfetti();
            } else {
                playCoin();
                triggerConfetti(); // Always confetti because why not
            }

            // Apply Reward
            addCoins(bonus);

            // Save Claim Time
            localStorage.setItem('dailyStashClaim', Date.now().toString());
        }, 2000); // 2s animation
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 6000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            <div className="glass-panel" style={{
                background: 'linear-gradient(135deg, #1a0b2e 0%, #2b003e 100%)',
                width: '90%', maxWidth: '450px',
                padding: '40px 20px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid var(--neon-pink)',
                boxShadow: '0 0 50px rgba(255, 0, 85, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ff0055', fontSize: '1.5rem', cursor: 'pointer', zIndex: 20 }}
                >
                    ✕
                </button>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{
                        color: 'white',
                        letterSpacing: '4px',
                        fontSize: '2rem',
                        textShadow: '0 0 10px var(--neon-pink)',
                        margin: '0 0 10px 0'
                    }}>
                        NEON STASH
                    </h1>

                    <div style={{
                        background: 'rgba(255, 0, 85, 0.1)',
                        color: 'var(--neon-pink)',
                        display: 'inline-block',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        border: '1px solid var(--neon-pink)',
                        marginBottom: '20px'
                    }}>
                        🔥 STREAK: {streak} DAY{streak !== 1 ? 'S' : ''} (+{Math.round((streak * 0.1) * 100)}%)
                    </div>

                    <div style={{ perspective: '800px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
                        {/* 3D CUBE - CYBERPUNK STYLE */}
                        <div className={`loot-box ${status === 'OPENING' ? 'shaking' : ''} ${status === 'OPENED' ? 'opened' : ''}`}>
                            <div className="face front">
                                <div className="lock-icon">{status === 'CLAIMED' ? '🚫' : '🔒'}</div>
                            </div>
                            <div className="face back"></div>
                            <div className="face right"></div>
                            <div className="face left"></div>
                            <div className="face top"></div>
                            <div className="face bottom"></div>

                            {/* REWARD POPUP */}
                            <div className={`reward-item ${status === 'OPENED' ? 'visible' : ''}`}>
                                <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 20px gold)', animation: 'spinCoin 3s infinite linear' }}>
                                    💰
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'gold', textShadow: '0 0 10px gold', marginTop: '10px' }}>
                                    {reward?.amount}
                                </div>
                                <div style={{ color: 'white', fontSize: '1rem', letterSpacing: '2px' }}>CREDITS</div>
                            </div>
                        </div>

                        {status === 'CLAIMED' && (
                            <div style={{
                                position: 'absolute',
                                background: 'rgba(0,0,0,0.9)',
                                padding: '30px',
                                border: '1px solid #333',
                                borderRadius: '15px',
                                boxShadow: '0 0 30px black'
                            }}>
                                <p style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', margin: 0 }}>Next Supply Drop</p>
                                <div style={{ fontSize: '2.5rem', color: 'var(--neon-blue)', fontWeight: 'bold', textShadow: '0 0 10px var(--neon-blue)', marginTop: '5px' }}>
                                    {timeLeft}
                                </div>
                            </div>
                        )}
                    </div>

                    <style>{`
                        .loot-box {
                            width: 150px; height: 150px;
                            position: relative;
                            transform-style: preserve-3d;
                            transform: rotateX(-20deg) rotateY(30deg);
                            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }
                        .loot-box.shaking { animation: shakeBox 0.5s infinite; }
                        .loot-box.opened { transform: rotateX(-20deg) rotateY(30deg) translateY(60px); }
                        .loot-box.opened .top { transform: rotateX(130deg) translateZ(75px); } 
                        
                        .face {
                            position: absolute;
                            width: 150px; height: 150px;
                            background: rgba(20, 10, 30, 0.95);
                            border: 2px solid var(--neon-pink);
                            display: flex; alignItems: center; justifyContent: center;
                            box-shadow: inset 0 0 30px rgba(255, 0, 85, 0.2);
                        }
                        .front { transform: translateZ(75px); }
                        .back  { transform: rotateY(180deg) translateZ(75px); }
                        .right { transform: rotateY(90deg) translateZ(75px); border-color: #aa0033; }
                        .left  { transform: rotateY(-90deg) translateZ(75px); border-color: #aa0033; }
                        .top   { transform: rotateX(90deg) translateZ(75px); background: var(--neon-pink); border-color: white; transform-origin: top; transition: transform 0.5s ease-out; }
                        .bottom { transform: rotateX(-90deg) translateZ(75px); background: #000; }

                        .lock-icon { font-size: 3rem; filter: drop-shadow(0 0 10px var(--neon-pink)); }

                        .reward-item {
                            position: absolute;
                            top: 50%; left: 50%;
                            transform: translate(-50%, 0) scale(0);
                            opacity: 0;
                            display: flex; flexDirection: column; alignItems: center; justify-content: center;
                            text-align: center;
                            width: 200px;
                            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                            pointer-events: none;
                        }
                        .reward-item.visible {
                            transform: translate(-50%, -200%) scale(1);
                            opacity: 1;
                        }

                        @keyframes shakeBox {
                            0% { transform: rotateX(-20deg) rotateY(25deg); }
                            50% { transform: rotateX(-20deg) rotateY(35deg); }
                            100% { transform: rotateX(-20deg) rotateY(25deg); }
                        }
                        @keyframes spinCoin {
                            0% { transform: rotateY(0deg); }
                            100% { transform: rotateY(360deg); }
                        }
                    `}</style>

                    {status === 'LOCKED' && (
                        <SquishyButton onClick={openChest} style={{ width: '100%', padding: '20px', background: 'var(--neon-pink)', color: 'white', fontSize: '1.2rem', textTransform: 'uppercase', boxShadow: '0 0 20px var(--neon-pink)' }}>
                            DECRYPT LOOT 🔓
                        </SquishyButton>
                    )}

                    {status === 'OPENED' && (
                        <SquishyButton onClick={onClose} style={{ width: '100%', padding: '20px', background: 'var(--neon-blue)', color: 'black', fontSize: '1.2rem', textTransform: 'uppercase', boxShadow: '0 0 20px var(--neon-blue)' }}>
                            COLLECT & CLOSE
                        </SquishyButton>
                    )}

                    {status === 'CLAIMED' && (
                        <SquishyButton onClick={onClose} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }}>
                            RETURN TO BASE
                        </SquishyButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyStash;
