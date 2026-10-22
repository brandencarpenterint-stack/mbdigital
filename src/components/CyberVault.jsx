import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { feedService } from '../utils/feed';
import SquishyButton from './SquishyButton';

const TUMBLER_SYMBOLS = [
    { id: 'gold', label: '👑 GOLD KEY', icon: '👑', color: '#ffd700', weight: 8 },
    { id: 'alpha', label: '⚡ ALPHA', icon: '⚡', color: '#00e5ff', weight: 15 },
    { id: 'omega', label: '🔮 OMEGA', icon: '🔮', color: '#d500f9', weight: 20 },
    { id: 'matrix', label: '💾 BYPASS', icon: '💾', color: '#00ff66', weight: 25 },
    { id: 'skull', label: '💀 VOID', icon: '💀', color: '#ff0055', weight: 32 }
];

const BASELINE_JACKPOT = 25000;
const CRACK_COST = 150;

const CyberVault = () => {
    const { coins, addCoins, spendCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playAirhorn, playWin, playCrash, playCollect } = useRetroSound();

    const audioCtxRef = useRef(null);

    // Vault Progressive Jackpot State
    const [jackpot, setJackpot] = useState(() => {
        const saved = localStorage.getItem('cyber_vault_jackpot');
        return saved ? Math.max(BASELINE_JACKPOT, parseInt(saved, 10)) : BASELINE_JACKPOT + 8420;
    });

    const [isCracking, setIsCracking] = useState(false);
    const [reels, setReels] = useState([TUMBLER_SYMBOLS[0], TUMBLER_SYMBOLS[1], TUMBLER_SYMBOLS[2]]);
    const [vaultBreached, setVaultBreached] = useState(false);
    const [lastReward, setLastReward] = useState(null);
    const [vaultDoorOpen, setVaultDoorOpen] = useState(false);

    // Progressive growth timer
    useEffect(() => {
        const interval = setInterval(() => {
            setJackpot(prev => {
                const inc = Math.floor(Math.random() * 8) + 2;
                const next = prev + inc;
                localStorage.setItem('cyber_vault_jackpot', next.toString());
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const playTumblerTick = () => {
        try {
            if (!audioCtxRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        } catch (e) {}
    };

    const playAlarmSiren = () => {
        try {
            if (!audioCtxRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(850, ctx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {}
    };

    const getRandomSymbol = () => {
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const s of TUMBLER_SYMBOLS) {
            cumulative += s.weight;
            if (rand <= cumulative) return s;
        }
        return TUMBLER_SYMBOLS[TUMBLER_SYMBOLS.length - 1];
    };

    const handleCrackVault = () => {
        if (isCracking) return;
        if ((coins || 0) < CRACK_COST) {
            playCrash();
            showToast('You need at least 150 CP to bypass the vault firewall!', 'error');
            return;
        }

        spendCoins(CRACK_COST);
        // Add 50 CP of the fee directly into the jackpot pot
        setJackpot(j => j + 50);

        setIsCracking(true);
        setVaultBreached(false);
        setLastReward(null);
        setVaultDoorOpen(false);

        // Pre-roll outcomes
        // Jackpot chance ~2.5%
        const isJackpotRoll = Math.random() < 0.025;
        let targetReels = [];

        if (isJackpotRoll) {
            const jackpotSymbol = TUMBLER_SYMBOLS[0]; // 3 Gold Keys
            targetReels = [jackpotSymbol, jackpotSymbol, jackpotSymbol];
        } else {
            const sym1 = getRandomSymbol();
            const sym2 = getRandomSymbol();
            const sym3 = getRandomSymbol();
            targetReels = [sym1, sym2, sym3];
        }

        let ticks = 0;
        const totalTicks = 24;
        const spinInterval = setInterval(() => {
            ticks++;
            playTumblerTick();
            setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);

            if (ticks >= totalTicks) {
                clearInterval(spinInterval);
                setReels(targetReels);
                finishCrack(targetReels);
            }
        }, 80);
    };

    const finishCrack = (finalReels) => {
        setIsCracking(false);

        const [r1, r2, r3] = finalReels;
        const allMatch = r1.id === r2.id && r2.id === r3.id;
        const twoMatch = r1.id === r2.id || r2.id === r3.id || r1.id === r3.id;

        if (allMatch) {
            // GRAND VAULT BREACH!
            const jackpotPrize = jackpot;
            setVaultBreached(true);
            setVaultDoorOpen(true);
            setLastReward({
                title: '🚨 VAULT CRACKED: GRAND HEIST!',
                coins: jackpotPrize,
                sub: 'ALL 3 CRYPTOGRAPHIC TUMBLERS MATCHED!'
            });

            addCoins(jackpotPrize);
            if (incrementStat) {
                incrementStat('vaultCracks', 1);
                incrementStat('gamesPlayedCount', 1);
            }
            if (updateStat && jackpotPrize > (stats?.vaultHighScore || 0)) {
                updateStat('vaultHighScore', jackpotPrize);
            }

            playAlarmSiren();
            playAirhorn();
            triggerConfetti();
            feedService.publish(
                'just CRACKED the Cyber Vault for ' + jackpotPrize.toLocaleString() + ' CP! 🚨💎👑',
                'win',
                userProfile?.name || 'Player'
            );

            // Reset Jackpot to baseline
            setTimeout(() => {
                setJackpot(BASELINE_JACKPOT);
                localStorage.setItem('cyber_vault_jackpot', BASELINE_JACKPOT.toString());
            }, 3000);

        } else if (twoMatch) {
            // Partial Breach
            const reward = 600;
            setLastReward({
                title: '⚡ PARTIAL FIREWALL BREACH',
                coins: reward,
                sub: '2 Tumblers matched! Recovered encrypted coin stash.'
            });
            addCoins(reward);
            playWin();
            if (incrementStat) incrementStat('gamesPlayedCount', 1);
        } else {
            // Breached Failed
            setLastReward({
                title: '🔒 ACCESS DENIED',
                coins: 0,
                sub: 'Firewall re-encrypted. Try another frequency bypass!'
            });
            playCrash();
            if (incrementStat) incrementStat('gamesPlayedCount', 1);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 25, 0.95), rgba(18, 12, 38, 0.98))',
            border: vaultBreached ? '3px solid #ffd700' : '2px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: vaultBreached ? '0 0 50px rgba(255, 215, 0, 0.4)' : '0 0 35px rgba(0, 229, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '"Orbitron", monospace',
            color: 'white',
            maxWidth: '850px',
            margin: '0 auto 40px auto'
        }}>
            {/* Top Vault Glow Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                paddingBottom: '16px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#00ff66',
                        boxShadow: '0 0 10px #00ff66',
                        animation: 'pulse 1.5s infinite'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: '#00e5ff', letterSpacing: '2px', fontWeight: 'bold' }}>
                        PROGRESSIVE COMMUNITY CASINO VAULT
                    </span>
                </div>

                <div style={{
                    background: 'rgba(255, 215, 0, 0.12)',
                    border: '1px solid #ffd700',
                    borderRadius: '20px',
                    padding: '4px 14px',
                    fontSize: '0.8rem',
                    color: '#ffd700',
                    fontWeight: 'bold'
                }}>
                    GLOBAL RECOVERY SYSTEM
                </div>
            </div>

            {/* PROGRESSIVE JACKPOT COUNTER */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{ fontSize: '0.9rem', color: '#a0a0c0', letterSpacing: '3px', marginBottom: '6px' }}>
                    CURRENT UNCLAIMED ACCUMULATION
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.5))'
                }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 12px #ffd700)' }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 6v2m0 8v2" />
                    </svg>
                    <span style={{
                        fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #ffd700, #ff8800, #ff007f)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '2px'
                    }}>
                        {jackpot.toLocaleString()} CP
                    </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#00ffcc', marginTop: '4px' }}>
                    ▲ Pot grows with every arcade bet across Plinko, Slots, Derby & Wheel
                </div>
            </div>

            {/* MECHANICAL VAULT INTERIOR & 3 REEL TUMBLER */}
            <div style={{
                background: 'rgba(5, 5, 12, 0.85)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                {/* Visual Vault Door Status */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    color: vaultDoorOpen ? '#00ff66' : '#ff0055'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        letterSpacing: '1px',
                        color: vaultDoorOpen ? '#00ff66' : '#ff0055'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: vaultDoorOpen ? '#00ff66' : '#ff0055',
                            boxShadow: `0 0 10px ${vaultDoorOpen ? '#00ff66' : '#ff0055'}`,
                            display: 'inline-block'
                        }} />
                        <span>{vaultDoorOpen ? 'STATUS: COMPROMISED / UNLOCKED' : 'STATUS: TITANIUM LOCKDOWN ACTIVE'}</span>
                    </div>
                </div>

                {/* Tumbler Reels Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    width: '100%',
                    maxWidth: '540px'
                }}>
                    {reels.map((sym, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'linear-gradient(180deg, #151528, #0a0a14)',
                                border: '2px solid ' + (sym.color || '#333'),
                                borderRadius: '14px',
                                padding: '18px 10px',
                                textAlign: 'center',
                                boxShadow: '0 0 20px ' + sym.color + '33',
                                transform: isCracking ? 'scale(0.98)' : 'scale(1)',
                                transition: 'all 0.1s ease'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                                {sym.icon}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: sym.color,
                                letterSpacing: '1px'
                            }}>
                                {sym.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outcome Banner */}
                {lastReward && (
                    <div style={{
                        width: '100%',
                        maxWidth: '540px',
                        background: lastReward.coins > 0 ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 0, 85, 0.15)',
                        border: lastReward.coins > 0 ? '1px solid #00ff66' : '1px solid #ff0055',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: lastReward.coins > 0 ? '#00ff66' : '#ff0055',
                            marginBottom: '4px'
                        }}>
                            {lastReward.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                            {lastReward.sub}
                        </div>
                        {lastReward.coins > 0 && (
                            <div style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold', marginTop: '6px' }}>
                                +{lastReward.coins.toLocaleString()} CP CREDITED!
                            </div>
                        )}
                    </div>
                )}

                {/* Crack Button CTA */}
                <SquishyButton
                    onClick={handleCrackVault}
                    disabled={isCracking}
                    style={{
                        background: isCracking 
                            ? '#333' 
                            : 'linear-gradient(135deg, #ffd700, #ff007f)',
                        color: isCracking ? '#888' : '#000',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        padding: '14px 45px',
                        borderRadius: '30px',
                        cursor: isCracking ? 'not-allowed' : 'pointer',
                        border: 'none',
                        boxShadow: isCracking ? 'none' : '0 0 25px rgba(255, 215, 0, 0.4)',
                        letterSpacing: '1px'
                    }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        {isCracking ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                                </svg>
                                DECRYPTING TUMBLERS...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                </svg>
                                ATTEMPT VAULT CRACK (150 CP)
                            </>
                        )}
                    </span>
                </SquishyButton>
            </div>

            {/* Payout Table Footer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '15px',
                marginTop: '20px',
                fontSize: '0.75rem',
                color: '#888'
            }}>
                <div>👑 3 Gold Keys = <b style={{ color: '#ffd700' }}>100% ENTIRE VAULT JACKPOT</b></div>
                <div>⚡ Any 3 Matches = <b style={{ color: '#00e5ff' }}>1,500 CP BONUS</b></div>
                <div>💾 Any 2 Matches = <b style={{ color: '#00ff66' }}>600 CP RECOVERY</b></div>
            </div>
        </div>
    );
};

export default CyberVault;
