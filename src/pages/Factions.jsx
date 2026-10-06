import React, { useState, useEffect } from 'react';
import { useSquad } from '../context/SquadContext';
import { useGamification } from '../context/GamificationContext';
import SquishyButton from '../components/SquishyButton';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { feedService } from '../utils/feed';

const Factions = () => {
    const { userSquad, squadScores, contribute, getSquadDetails, getLeadingSquad } = useSquad();
    const { coins, addCoins, userProfile } = useGamification();
    const { playCoin, playWin, playError } = useRetroSound();
    const [timeLeft, setTimeLeft] = useState({ d: 4, h: 12, m: 32, s: 0 });
    const [donateAmount, setDonateAmount] = useState(100);

    // Calculate total for progress bar percentages
    const totalScore = Object.values(squadScores).reduce((a, b) => a + b, 0);
    const cyberPct = ((squadScores.CYBER / totalScore) * 100).toFixed(1);
    const solarPct = ((squadScores.SOLAR / totalScore) * 100).toFixed(1);
    const voidPct = ((squadScores.VOID / totalScore) * 100).toFixed(1);

    // Mock Countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { d, h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; d--; }
                return { d, h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDonate = () => {
        if (!userSquad) {
            playError();
            alert("Join a faction first!");
            return;
        }

        if (coins < donateAmount) {
            playError();
            alert("Insufficient coins to donate!");
            return;
        }

        // Deduct coins (negative amount)
        addCoins(-donateAmount);
        
        // Contribute to faction
        contribute(donateAmount);
        playCoin();
        triggerConfetti();

        // Broadcast to feed occasionally for hype
        if (donateAmount >= 1000) {
            feedService.publish(`donated ${donateAmount} coins to the ${getSquadDetails(userSquad).name}! ⚔️`, 'win', userProfile?.name || 'A player');
        }
    };

    const leader = getLeadingSquad();

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: '"Orbitron", sans-serif' }}>
            <h1 style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 20px var(--neon-pink)', marginBottom: '10px' }}>FACTION WARS</h1>
            <p style={{ color: '#aaa', marginBottom: '40px' }}>Donate to the shrine to help your faction claim the title of <b>King Ding Dong</b> 👑.</p>

            {/* Countdown */}
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #333', padding: '20px', borderRadius: '15px', marginBottom: '40px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--neon-blue)' }}>SEASON 1 ENDS IN</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: '"Press Start 2P", monospace', letterSpacing: '2px', color: '#fff', textShadow: '0 0 10px #fff' }}>
                    {String(timeLeft.d).padStart(2, '0')}d {String(timeLeft.h).padStart(2, '0')}h {String(timeLeft.m).padStart(2, '0')}m {String(timeLeft.s).padStart(2, '0')}s
                </div>
            </div>

            {/* Tug of War Bar */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>GLOBAL DOMINATION</h2>
            <div style={{ width: '100%', height: '50px', display: 'flex', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 0 30px rgba(255,255,255,0.2)', marginBottom: '10px' }}>
                <div style={{ width: `${cyberPct}%`, background: 'linear-gradient(90deg, #0055ff, #00f3ff)', transition: 'width 1s ease-out' }}></div>
                <div style={{ width: `${solarPct}%`, background: 'linear-gradient(90deg, #ff6600, #ffaa00)', transition: 'width 1s ease-out' }}></div>
                <div style={{ width: `${voidPct}%`, background: 'linear-gradient(90deg, #6600ff, #9d00ff)', transition: 'width 1s ease-out' }}></div>
            </div>
            
            {/* Legend / Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <div style={{ color: '#00f3ff' }}>CYBER: {squadScores.CYBER.toLocaleString()} ({cyberPct}%) {leader === 'CYBER' && '👑'}</div>
                <div style={{ color: '#ffaa00' }}>SOLAR: {squadScores.SOLAR.toLocaleString()} ({solarPct}%) {leader === 'SOLAR' && '👑'}</div>
                <div style={{ color: '#9d00ff' }}>VOID: {squadScores.VOID.toLocaleString()} ({voidPct}%) {leader === 'VOID' && '👑'}</div>
            </div>

            {/* Faction Shrine (Donation) */}
            <div style={{ background: 'linear-gradient(180deg, #111, #000)', border: '2px solid #333', borderRadius: '20px', padding: '30px' }}>
                <h2 style={{ color: 'var(--neon-gold)', textShadow: '0 0 10px var(--neon-gold)' }}>THE COIN SHRINE</h2>
                
                {userSquad ? (
                    <>
                        <div style={{ fontSize: '4rem', filter: `drop-shadow(0 0 20px ${getSquadDetails(userSquad).color})`, margin: '20px 0' }}>
                            {getSquadDetails(userSquad).icon}
                        </div>
                        <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>You are fighting for the <b style={{ color: getSquadDetails(userSquad).color }}>{getSquadDetails(userSquad).name}</b>.</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                            {[100, 500, 1000, 5000].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => setDonateAmount(amt)}
                                    style={{
                                        background: donateAmount === amt ? 'var(--neon-gold)' : 'transparent',
                                        color: donateAmount === amt ? '#000' : 'var(--neon-gold)',
                                        border: '1px solid var(--neon-gold)',
                                        borderRadius: '10px',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: donateAmount === amt ? '0 0 10px var(--neon-gold)' : 'none'
                                    }}
                                >
                                    {amt} 🪙
                                </button>
                            ))}
                        </div>

                        <SquishyButton onClick={handleDonate} style={{
                            padding: '15px 40px', fontSize: '1.5rem',
                            background: getSquadDetails(userSquad).color,
                            color: '#000', border: 'none', borderRadius: '15px',
                            boxShadow: `0 0 20px ${getSquadDetails(userSquad).color}`
                        }}>
                            DONATE {donateAmount} FP
                        </SquishyButton>
                    </>
                ) : (
                    <div style={{ padding: '40px' }}>
                        <p style={{ color: '#ff0055', fontSize: '1.2rem' }}>You have not chosen a faction yet.</p>
                        <p style={{ color: '#888' }}>Head to the profile or refresh to join the fight.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Factions;
