import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameDetails } from '../config/GameCatalog';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const QuickResumeOverlay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const { stats, coins } = useGamification() || {};
    const { soundEnabled, toggleSound } = useSettings() || {};
    const { showToast } = useToast() || {};
    const { playBeep, playBoop, playWin, playClick } = useRetroSound();

    const isGameRoute = location.pathname.startsWith('/arcade/') && location.pathname !== '/arcade';
    const game = isGameRoute ? getGameDetails(location.pathname) : null;

    // Toggle on ESC key press
    useEffect(() => {
        if (!isGameRoute) {
            setIsOpen(false);
            return;
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(prev => {
                    const next = !prev;
                    if (next) playBeep?.();
                    else playBoop?.();
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameRoute, playBeep, playBoop]);

    if (!isGameRoute || !game) return null;

    const handleResume = () => {
        playBoop?.();
        setIsOpen(false);
    };

    const handleRestart = () => {
        playClick?.();
        setIsOpen(false);
        window.location.reload();
    };

    const handleExit = () => {
        playClick?.();
        setIsOpen(false);
        navigate('/arcade');
    };

    const handleCopyBoast = async () => {
        playWin?.();
        triggerConfetti();
        const highScoreStr = game.getScore(stats);
        const boastText = `🎮 I'm playing ${game.title} on MBDIGITAL Arcade! Personal Best: ${highScoreStr}. Can you beat me? Play now: https://brandencarpenterint-stack.github.io/mbdigital`;
        
        try {
            await navigator.clipboard.writeText(boastText);
            if (showToast) {
                showToast("Score boast copied to clipboard! 🚀", "success");
            }
        } catch (err) {
            if (showToast) {
                showToast("High score ready to share! 🚀", "success");
            }
        }
    };

    return (
        <>
            {/* FLOATING HUD QUICK RESUME TRIGGER BUTTON */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playBeep?.();
                        setIsOpen(true);
                    }}
                    style={{
                        position: 'fixed',
                        top: '16px',
                        right: '16px',
                        zIndex: 9999,
                        background: 'rgba(8, 12, 22, 0.82)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(0, 240, 255, 0.35)',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        color: '#00f0ff',
                        fontFamily: '"Orbitron", monospace',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 240, 255, 0.15)',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    title="Press ESC or tap to open Quick Resume Overlay"
                >
                    <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #00f0ff' }}>
                        ESC
                    </span>
                    <span>🎮 PAUSE</span>
                </motion.button>
            )}

            {/* QUICK RESUME MODAL OVERLAY (Xbox / Steam Deck Guide Menu) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleResume}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 10000,
                            background: 'rgba(4, 6, 12, 0.78)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 15, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.92, y: 15, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '440px',
                                background: 'linear-gradient(165deg, rgba(16, 22, 36, 0.96) 0%, rgba(8, 12, 20, 0.98) 100%)',
                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.15)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* OVERLAY HEADER */}
                            <div style={{
                                padding: '22px 24px 16px 24px',
                                background: game.bannerGradient || 'linear-gradient(135deg, #00f0ff, #0072ff)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        backdropFilter: 'blur(8px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.8rem',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                                    }}>
                                        {game.icon}
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '900',
                                            letterSpacing: '1px',
                                            color: '#fff',
                                            opacity: 0.85,
                                            fontFamily: 'monospace'
                                        }}>
                                            {game.badge || 'GAME OVERLAY'}
                                        </div>
                                        <h2 style={{
                                            margin: 0,
                                            fontSize: '1.25rem',
                                            fontWeight: '900',
                                            color: '#fff',
                                            letterSpacing: '0.5px',
                                            fontFamily: '"Orbitron", sans-serif',
                                            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                                        }}>
                                            {game.title}
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    onClick={handleResume}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#fff',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* PLAYER TELEMETRY HUD BAR */}
                            <div style={{
                                padding: '12px 24px',
                                background: 'rgba(0, 0, 0, 0.4)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '8px',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>BEST SCORE</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#00ff88', fontFamily: '"Orbitron", monospace' }}>
                                        {game.getScore(stats)}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>WALLET</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#ffd700', fontFamily: 'monospace' }}>
                                        🪙 {coins?.toLocaleString() || 0}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>STATUS</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#00f0ff', fontFamily: 'monospace' }}>
                                        ● PAUSED
                                    </div>
                                </div>
                            </div>

                            {/* CONTROLS & RULES ACCORDION (OPTIONAL VIEW) */}
                            {showRules && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{
                                        padding: '16px 24px',
                                        background: 'rgba(0, 240, 255, 0.04)',
                                        borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
                                        fontSize: '0.8rem',
                                        color: '#cbd5e1'
                                    }}
                                >
                                    <div style={{ marginBottom: '8px' }}>
                                        <strong style={{ color: '#00f0ff', display: 'block', marginBottom: '2px', fontFamily: 'monospace' }}>🎮 CONTROLS:</strong>
                                        <div style={{ color: '#94a3b8', lineHeight: '1.4' }}>{game.controls}</div>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#ffd700', display: 'block', marginBottom: '2px', fontFamily: 'monospace' }}>💡 STRATEGY:</strong>
                                        <div style={{ color: '#94a3b8', lineHeight: '1.4' }}>{game.rules}</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ACTION BUTTON STACK */}
                            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {/* 1. RESUME */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleResume}
                                    style={{
                                        background: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '14px',
                                        padding: '14px',
                                        fontWeight: '900',
                                        fontSize: '0.95rem',
                                        fontFamily: '"Orbitron", sans-serif',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                                    }}
                                >
                                    <span>▶</span> RESUME GAME
                                </motion.button>

                                {/* 2. RESTART RUN */}
                                <button
                                    onClick={handleRestart}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        padding: '11px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span>🔄</span> RESTART RUN
                                </button>

                                {/* 3. TOGGLE RULES & CONTROLS */}
                                <button
                                    onClick={() => setShowRules(prev => !prev)}
                                    style={{
                                        background: showRules ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: showRules ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        color: showRules ? '#00f0ff' : '#cbd5e1',
                                        borderRadius: '12px',
                                        padding: '11px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>📖</span> {showRules ? 'HIDE HOW TO PLAY' : 'HOW TO PLAY & CONTROLS'}
                                </button>

                                {/* 4. AUDIO TOGGLE & BOAST ROW */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <button
                                        onClick={() => {
                                            toggleSound?.();
                                            playBeep?.();
                                        }}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: soundEnabled ? '#00ff88' : '#64748b',
                                            borderRadius: '12px',
                                            padding: '11px',
                                            fontWeight: '700',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>{soundEnabled ? '🔊' : '🔇'}</span> {soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}
                                    </button>

                                    <button
                                        onClick={handleCopyBoast}
                                        style={{
                                            background: 'rgba(255, 215, 0, 0.1)',
                                            border: '1px solid rgba(255, 215, 0, 0.3)',
                                            color: '#ffd700',
                                            borderRadius: '12px',
                                            padding: '11px',
                                            fontWeight: '700',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>📸</span> BOAST SCORE
                                    </button>
                                </div>

                                {/* 5. EXIT TO HUB */}
                                <button
                                    onClick={handleExit}
                                    style={{
                                        marginTop: '4px',
                                        background: 'rgba(255, 0, 85, 0.1)',
                                        border: '1px solid rgba(255, 0, 85, 0.3)',
                                        color: '#ff0055',
                                        borderRadius: '12px',
                                        padding: '11px',
                                        fontWeight: '800',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span>🏠</span> EXIT TO ARCADE HUB
                                </button>
                            </div>

                            {/* FOOTER HINT */}
                            <div style={{
                                padding: '10px',
                                textAlign: 'center',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: '#475569',
                                fontSize: '0.68rem',
                                fontFamily: 'monospace'
                            }}>
                                TIP: PRESS <strong style={{ color: '#00f0ff' }}>ESC</strong> ANYTIME TO TOGGLE THIS MENU
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickResumeOverlay;
