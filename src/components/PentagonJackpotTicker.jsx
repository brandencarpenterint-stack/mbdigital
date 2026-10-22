/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useRetroSound from '../hooks/useRetroSound';

const SIMULATED_SYNDICATE_FEEDS = [
    { agent: 'AGENT_VIPER-94', game: 'COSMIC SLOTS', win: '45,000 CP', trigger: '777 TRIPLE NEON' },
    { agent: 'OPERATOR_KAI-409', game: 'MOONSHOT CRASH', win: '84,200 CP', trigger: '42.8x HYPER BAILOUT' },
    { agent: 'GHOST_RUNNER-02', game: 'CYBER 21', win: '28,000 CP', trigger: 'ROYAL BLACKJACK' },
    { agent: 'BLACK-OPS_ORION', game: 'QUANTUM PLINKO', win: '100,000 CP', trigger: '100x MATRIX DROP' },
    { agent: 'DEFCON_WHALE-88', game: 'CYBER MINES', win: '56,400 CP', trigger: '15-NODE CLEAR' },
    { agent: 'SHADOW_SPECTER', game: 'CYBER DOZER', win: '35,000 CP', trigger: 'GOLD BULLION RUSH' }
];

const PentagonJackpotTicker = ({ onOpenClearance }) => {
    const { playBeep } = useRetroSound();

    // Progressive Jackpot Base (starts ~1.48M CP and ticks upward)
    const [jackpotPool, setJackpotPool] = useState(() => {
        const saved = localStorage.getItem('pentagon_jackpot_pool');
        return saved ? parseFloat(saved) : 1482950;
    });

    const [defconLevel, setDefconLevel] = useState(1);
    const [feedIndex, setFeedIndex] = useState(0);

    // Incremental Jackpot Accumulator Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const betSlice = Math.floor(Math.random() * 85) + 15;
            setJackpotPool(prev => {
                const next = prev + betSlice;
                localStorage.setItem('pentagon_jackpot_pool', next.toString());
                return next;
            });
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    // Syndicate Winner Feed Rotator
    useEffect(() => {
        const feedTimer = setInterval(() => {
            setFeedIndex(prev => (prev + 1) % SIMULATED_SYNDICATE_FEEDS.length);
        }, 4000);

        return () => clearInterval(feedTimer);
    }, []);

    // Random DEFCON fluctuations
    useEffect(() => {
        const defconTimer = setInterval(() => {
            const levels = [1, 1, 2, 1, 3];
            const pick = levels[Math.floor(Math.random() * levels.length)];
            setDefconLevel(pick);
        }, 12000);
        return () => clearInterval(defconTimer);
    }, []);

    const currentFeed = SIMULATED_SYNDICATE_FEEDS[feedIndex];

    const getDefconStyles = (lvl) => {
        if (lvl === 1) return { color: '#ff0055', label: 'DEFCON 1: CRITICAL STRIKE', bg: 'rgba(255, 0, 85, 0.15)', border: '#ff0055' };
        if (lvl === 2) return { color: '#ff8800', label: 'DEFCON 2: HIGH ROLLER VOLATILITY', bg: 'rgba(255, 136, 0, 0.15)', border: '#ff8800' };
        return { color: '#ffd700', label: 'DEFCON 3: ELEVATED SYNDICATE BETTING', bg: 'rgba(255, 215, 0, 0.15)', border: '#ffd700' };
    };

    const defconInfo = getDefconStyles(defconLevel);

    return (
        <div style={{
            maxWidth: '920px',
            margin: '0 auto 20px auto',
            background: 'linear-gradient(135deg, rgba(10, 16, 28, 0.95), rgba(4, 7, 14, 0.98))',
            border: `1.5px solid ${defconInfo.border}`,
            borderRadius: '20px',
            padding: '16px 20px',
            boxShadow: `0 10px 40px rgba(0, 0, 0, 0.7), 0 0 25px ${defconInfo.bg}`,
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '"Orbitron", monospace'
        }}>
            {/* Background Tactical Grid Wireframe */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                pointerEvents: 'none'
            }} />

            {/* TOP HEADER: DEFCON Alert & Pentagon Clearance Trigger */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '12px',
                position: 'relative',
                zIndex: 1
            }}>
                {/* DEFCON Status Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: defconInfo.bg,
                    border: `1px solid ${defconInfo.border}`,
                    borderRadius: '20px',
                    padding: '4px 12px'
                }}>
                    <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: defconInfo.color,
                            boxShadow: `0 0 10px ${defconInfo.color}`
                        }}
                    />
                    <span style={{
                        fontSize: '0.68rem',
                        fontWeight: '900',
                        color: defconInfo.color,
                        letterSpacing: '1px'
                    }}>
                        {defconInfo.label}
                    </span>
                </div>

                {/* Pentagon Clearance Dossier Button */}
                <button
                    onClick={() => {
                        playBeep?.();
                        if (onOpenClearance) onOpenClearance();
                        else window.dispatchEvent(new CustomEvent('open-clearance'));
                    }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.2))',
                        border: '1px solid #00f0ff',
                        color: '#00f0ff',
                        borderRadius: '14px',
                        padding: '6px 14px',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                        fontFamily: '"Orbitron", monospace'
                    }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>PENTAGON CLEARANCE DOSSIER</span>
                </button>
            </div>

            {/* MAIN PROGRESSIVE JACKPOT COUNTER */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '10px 0 16px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    fontSize: '0.72rem',
                    letterSpacing: '3px',
                    color: '#94a3b8',
                    fontWeight: '900',
                    marginBottom: '4px'
                }}>
                    DEFCON 1 MEGA PROGRESSIVE POOL
                </div>

                <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                    fontWeight: '900',
                    color: '#ffd700',
                    textShadow: '0 0 25px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.2)',
                    letterSpacing: '2px',
                    lineHeight: '1.1'
                }}>
                    {Math.floor(jackpotPool).toLocaleString()} <span style={{ fontSize: '0.45em', color: '#00f0ff', textShadow: '0 0 15px #00f0ff' }}>CP</span>
                </div>

                {/* Sub-label */}
                <div style={{
                    fontSize: '0.62rem',
                    color: '#64748b',
                    letterSpacing: '1px',
                    marginTop: '4px'
                }}>
                    ALL ARCADE & CASINO WAGERS CONTRIBUTE 1.5% DIRECTLY TO THE SYNDICATE POT
                </div>
            </div>

            {/* LIVE SYNDICATE WINNERS BROADCAST */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '0.58rem',
                        fontWeight: '900',
                        color: '#ff0055',
                        background: 'rgba(255, 0, 85, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        letterSpacing: '1px'
                    }}>
                        LIVE SYNDICATE FEED
                    </span>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={feedIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.72rem',
                                color: '#fff',
                                fontFamily: 'monospace'
                            }}
                        >
                            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>{currentFeed.agent}</span>
                            <span style={{ color: '#94a3b8' }}>extracted</span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{currentFeed.win}</span>
                            <span style={{ color: '#94a3b8' }}>on {currentFeed.game}</span>
                            <span style={{ color: '#00ff88', fontSize: '0.65rem' }}>({currentFeed.trigger})</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Quick Breach Links to Top Jackpot Games */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                        to="/slots"
                        style={{
                            textDecoration: 'none',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            color: '#ffd700',
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '8px',
                            padding: '4px 8px'
                        }}
                    >
                        SLOTS JACKPOT &rarr;
                    </Link>
                    <Link
                        to="/crash"
                        style={{
                            textDecoration: 'none',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            color: '#00f0ff',
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            borderRadius: '8px',
                            padding: '4px 8px'
                        }}
                    >
                        MOONSHOT &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PentagonJackpotTicker;
