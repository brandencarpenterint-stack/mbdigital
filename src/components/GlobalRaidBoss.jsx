import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { feedService } from '../utils/feed';

const MAX_HP = 2500;
const BOSS_TIME = 90; // seconds

const COMMUNITY_STRIKERS = [
    'CyberSamurai', 'GhostOperator', 'NeonPilot', 'Satoshi99',
    'PixelValkyrie', 'ShadowDoge', 'ZeroCool', 'VaporBro'
];

const GlobalRaidBoss = () => {
    const { addCoins, userProfile } = useGamification() || {};
    const { playCrash, playWin, playClick, playBeep, playShoot, playExplosion } = useRetroSound();

    const [isActive, setIsActive] = useState(false);
    const [hp, setHp] = useState(MAX_HP);
    const [timeLeft, setTimeLeft] = useState(BOSS_TIME);
    const [damageFloats, setDamageFloats] = useState([]);
    const [combo, setCombo] = useState(0);
    const [shaking, setShaking] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const channelRef = useRef(null);
    const comboTimerRef = useRef(null);

    // Spawn event listener
    useEffect(() => {
        const handleSpawn = () => {
            setIsActive(true);
            setHp(MAX_HP);
            setTimeLeft(BOSS_TIME);
            setMinimized(false);
            try { playCrash(); } catch(e) {}
            feedService.publish({
                text: '🚨 WARNING: VOID TITAN BRO has invaded! Tap the boss to join the raid!',
                type: 'jackpot'
            });
        };

        window.addEventListener('spawn-raid-boss', handleSpawn);

        // Auto-spawn every 12 minutes if inactive
        const autoSpawnTimer = setInterval(() => {
            if (!isActive && Math.random() > 0.4) {
                handleSpawn();
            }
        }, 12 * 60 * 1000);

        return () => {
            window.removeEventListener('spawn-raid-boss', handleSpawn);
            clearInterval(autoSpawnTimer);
        };
    }, [isActive, playCrash]);

    // Timer countdown
    useEffect(() => {
        if (!isActive) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsActive(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isActive]);

    // Simulated community battle assistance
    useEffect(() => {
        if (!isActive || hp <= 0) return;

        const assistTimer = setInterval(() => {
            const ally = COMMUNITY_STRIKERS[Math.floor(Math.random() * COMMUNITY_STRIKERS.length)];
            const dmg = Math.floor(Math.random() * 20) + 10;

            setHp(prev => {
                const next = Math.max(0, prev - dmg);
                if (next === 0 && prev > 0) {
                    handleVictory();
                }
                return next;
            });

            // Community damage floater
            const newFloat = {
                id: Date.now() + Math.random(),
                text: ally + ' -' + dmg,
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 60,
                color: '#00ffcc',
                size: '0.8rem'
            };
            setDamageFloats(prev => [...prev.slice(-10), newFloat]);
        }, 1800);

        return () => clearInterval(assistTimer);
    }, [isActive, hp]);

    // Clean up floaters
    useEffect(() => {
        if (damageFloats.length === 0) return;
        const cleanup = setTimeout(() => {
            setDamageFloats(prev => prev.slice(1));
        }, 1000);
        return () => clearTimeout(cleanup);
    }, [damageFloats]);

    const handleVictory = () => {
        setIsActive(false);
        try {
            playWin();
            triggerConfetti();
        } catch(e) {}

        if (addCoins) addCoins(2500);

        feedService.publish({
            text: '🏆 ' + (userProfile?.name || 'Community') + ' defeated the VOID TITAN! 2,500 CP Bounty Distributed!',
            type: 'jackpot'
        });
    };

    const handlePlayerAttack = (e) => {
        if (!isActive || hp <= 0) return;

        // Sound & shake
        try { playShoot(); } catch(err) {}
        setShaking(true);
        setTimeout(() => setShaking(false), 80);

        // Combo counter
        setCombo(c => c + 1);
        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => setCombo(0), 1500);

        // Critical hit check
        const isCrit = Math.random() < 0.25;
        const multiplier = 1 + Math.min(3, Math.floor(combo / 5));
        const baseDmg = isCrit ? 35 : 12;
        const finalDmg = baseDmg * multiplier;

        // Coin reward per strike
        if (addCoins) addCoins(Math.min(5, multiplier));

        setHp(prev => {
            const next = Math.max(0, prev - finalDmg);
            if (next === 0 && prev > 0) {
                handleVictory();
            }
            return next;
        });

        // Floating damage indicator
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) - rect.width / 2;
        const clickY = (e.clientY - rect.top) - rect.height / 2;

        const newFloat = {
            id: Date.now() + Math.random(),
            text: isCrit ? '💥 CRIT! -' + finalDmg : '-' + finalDmg,
            x: clickX + (Math.random() - 0.5) * 30,
            y: clickY - 20,
            color: isCrit ? '#ff0055' : '#ffd700',
            size: isCrit ? '1.4rem' : '1.1rem',
            bold: true
        };
        setDamageFloats(prev => [...prev.slice(-12), newFloat]);
    };

    if (!isActive) return null;

    const hpPercent = (hp / MAX_HP) * 100;

    return (
        <div style={{
            position: 'fixed',
            top: '70px',
            right: minimized ? '20px' : 'calc(50% - 150px)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'right 0.3s ease, top 0.3s ease'
        }}>
            {/* FLOATING TOP BANNER */}
            {!minimized && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.95), rgba(0, 0, 0, 0.9))',
                        border: '2px solid #ff0055',
                        borderRadius: '25px',
                        padding: '6px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 0 25px rgba(255, 0, 85, 0.6)',
                        marginBottom: '10px',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <span style={{ fontSize: '1.2rem', animation: 'spin 2s linear infinite' }}>🚨</span>
                    <span style={{ color: '#fff', fontWeight: '900', fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '1px' }}>
                        VOID TITAN • {timeLeft}s LEFT
                    </span>
                    <button
                        onClick={() => setMinimized(true)}
                        style={{ background: 'none', border: 'none', color: '#ff88aa', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                        _
                    </button>
                </motion.div>
            )}

            {/* MINIMIZED PILL */}
            {minimized && (
                <button
                    onClick={() => setMinimized(false)}
                    style={{
                        background: '#ff0055',
                        color: 'white',
                        border: '2px solid #fff',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px #ff0055'
                    }}
                >
                    🚨 RAID BOSS ({Math.round(hpPercent)}%)
                </button>
            )}

            {/* EXPANDED BOSS TARGET */}
            {!minimized && (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* COMBO MULTIPLIER BADGE */}
                    {combo > 2 && (
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            background: '#ffd700',
                            color: '#000',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontWeight: '900',
                            fontSize: '0.75rem',
                            letterSpacing: '1px',
                            boxShadow: '0 0 10px #ffd700',
                            zIndex: 10
                        }}>
                            COMBO x{combo}!
                        </div>
                    )}

                    {/* BOSS AVATAR CONTAINER */}
                    <div
                        onClick={handlePlayerAttack}
                        style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            border: '4px solid #ff0055',
                            boxShadow: shaking ? '0 0 60px #ff0000, 0 0 100px #ff0055' : '0 0 35px rgba(255, 0, 85, 0.7)',
                            cursor: 'crosshair',
                            position: 'relative',
                            overflow: 'hidden',
                            transform: shaking ? 'scale(0.92) translate(4px, -4px)' : 'scale(1)',
                            transition: 'transform 0.05s',
                            userSelect: 'none'
                        }}
                    >
                        {/* Custom dark dino / void skin */}
                        <img
                            src="/assets/skins/face_dino_dark.jpg"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'contrast(1.3) hue-rotate(290deg)'
                            }}
                            alt="Void Titan"
                        />

                        {/* Menacing red overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle, transparent 40%, rgba(255,0,85,0.7) 100%)',
                            pointerEvents: 'none'
                        }} />

                        {/* Pulsing targeting crosshair */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40px',
                            height: '40px',
                            border: '2px dashed rgba(255, 255, 255, 0.6)',
                            borderRadius: '50%',
                            pointerEvents: 'none'
                        }} />
                    </div>

                    {/* FLOATING DAMAGE TEXTS */}
                    {damageFloats.map(f => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 1, y: f.y, x: f.x, scale: 0.8 }}
                            animate={{ opacity: 0, y: f.y - 70, scale: 1.2 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                color: f.color,
                                fontSize: f.size || '1.1rem',
                                fontWeight: '900',
                                fontFamily: 'monospace',
                                textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 5px ' + f.color,
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                zIndex: 20
                            }}
                        >
                            {f.text}
                        </motion.div>
                    ))}

                    {/* HEALTH BAR */}
                    <div style={{
                        marginTop: '12px',
                        width: '240px',
                        height: '16px',
                        background: '#111',
                        border: '2px solid #ff0055',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 0 15px rgba(255, 0, 85, 0.4)',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: hpPercent + '%',
                            height: '100%',
                            background: hpPercent > 30 ? 'linear-gradient(90deg, #ff0055, #ff5500)' : '#ff0000',
                            transition: 'width 0.15s ease-out'
                        }} />
                        <span style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            color: '#fff',
                            textShadow: '0 0 4px #000'
                        }}>
                            {hp} / {MAX_HP} HP ({Math.round(hpPercent)}%)
                        </span>
                    </div>

                    {/* INSTRUCTION PILL */}
                    <div style={{
                        marginTop: '6px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        letterSpacing: '1px'
                    }}>
                        TAP RAPIDLY • REWARDS 2,500 CP
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalRaidBoss;
