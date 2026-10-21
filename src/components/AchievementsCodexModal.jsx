import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS, getTotalGamerscore } from '../config/AchievementDefinitions';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const CATEGORIES = [
    'ALL',
    'Cyber Casino',
    'Action & Skill',
    'Retro Classics',
    'Pocket Bro',
    'Economy',
    'Social & Streaks',
    'Secret'
];

const AchievementsCodexModal = ({ isOpen, onClose }) => {
    const { unlockedAchievements = [] } = useGamification() || {};
    const { showToast } = useToast() || {};
    const { playClick, playBeep, playWin } = useRetroSound();

    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unlocked', 'locked'

    // Compute live Gamerscore metrics
    const { currentG, maxG, unlockedCount, totalCount, percentage } = useMemo(() => {
        return getTotalGamerscore(unlockedAchievements);
    }, [unlockedAchievements]);

    // Filter achievements
    const filteredAchievements = useMemo(() => {
        return ACHIEVEMENTS.filter(ach => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            const categoryMatch = selectedCategory === 'ALL' || ach.category === selectedCategory;

            let statusMatch = true;
            if (filterStatus === 'unlocked') statusMatch = isUnlocked;
            if (filterStatus === 'locked') statusMatch = !isUnlocked;

            const query = searchQuery.toLowerCase().trim();
            const textMatch = !query ||
                ach.title.toLowerCase().includes(query) ||
                ach.description.toLowerCase().includes(query) ||
                (ach.game && ach.game.toLowerCase().includes(query));

            return categoryMatch && statusMatch && textMatch;
        });
    }, [selectedCategory, filterStatus, searchQuery, unlockedAchievements]);

    if (!isOpen) return null;

    const handleShareGamerscore = async () => {
        playWin?.();
        triggerConfetti();
        const boastText = `🏆 I've unlocked ${currentG.toLocaleString()}G Gamerscore (${unlockedCount}/${totalCount} achievements) on MBDIGITAL Arcade! Can you beat my record? Play free now: https://brandencarpenterint-stack.github.io/mbdigital`;

        try {
            await navigator.clipboard.writeText(boastText);
            showToast?.('Gamerscore brag copied to clipboard! 🚀', 'success');
        } catch {
            showToast?.('Gamerscore ready to share! 🚀', 'success');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                    playBeep?.();
                    onClose();
                }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10500,
                    background: 'rgba(5, 8, 16, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.94, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.94, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: '100%',
                        maxWidth: '920px',
                        maxHeight: '90vh',
                        background: 'linear-gradient(175deg, rgba(14, 20, 32, 0.98) 0%, rgba(8, 12, 20, 0.99) 100%)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 136, 0.12)'
                    }}
                >
                    {/* GAMERSCORE HERO BANNER */}
                    <div style={{
                        padding: '24px 28px',
                        background: 'linear-gradient(135deg, rgba(16, 124, 16, 0.25) 0%, rgba(0, 255, 136, 0.1) 100%)',
                        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #107c10 0%, #00ff88 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    boxShadow: '0 0 25px rgba(0, 255, 136, 0.6)',
                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                    flexShrink: 0
                                }}>
                                    🏆
                                </div>

                                <div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: '#00ff88',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        letterSpacing: '2px'
                                    }}>
                                        XBOX GAMERSCORE HUB
                                    </div>

                                    <div style={{
                                        fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                                        fontWeight: '900',
                                        color: '#fff',
                                        fontFamily: '"Orbitron", sans-serif',
                                        letterSpacing: '1px',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '8px'
                                    }}>
                                        <span>{currentG.toLocaleString()} G</span>
                                        <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'bold' }}>
                                            / {maxG.toLocaleString()} G
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                                        {unlockedCount} of {totalCount} Achievements Unlocked • {percentage}% Completed
                                    </div>
                                </div>
                            </div>

                            {/* SHARE & CLOSE ACTIONS */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={handleShareGamerscore}
                                    style={{
                                        background: 'rgba(0, 255, 136, 0.15)',
                                        border: '1px solid #00ff88',
                                        color: '#00ff88',
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        letterSpacing: '0.5px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
                                    }}
                                >
                                    <span>📸</span> SHARE BRAG
                                </button>

                                <button
                                    onClick={() => {
                                        playBeep?.();
                                        onClose();
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        color: '#fff',
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div style={{
                            marginTop: '18px',
                            height: '8px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #107c10 0%, #00ff88 100%)',
                                    boxShadow: '0 0 10px #00ff88'
                                }}
                            />
                        </div>
                    </div>

                    {/* SEARCH & FILTERS DOCK */}
                    <div style={{
                        padding: '16px 28px',
                        background: 'rgba(10, 14, 22, 0.95)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {/* Search Input & Status Buttons */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="🔍 Search achievements or games..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRadius: '12px',
                                        padding: '10px 14px',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        fontFamily: 'system-ui, sans-serif',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'unlocked', label: '✓ Unlocked' },
                                    { id: 'locked', label: '🔒 Locked' }
                                ].map(status => (
                                    <button
                                        key={status.id}
                                        onClick={() => {
                                            playClick?.();
                                            setFilterStatus(status.id);
                                        }}
                                        style={{
                                            background: filterStatus === status.id ? 'rgba(0, 255, 136, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                                            border: filterStatus === status.id ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.1)',
                                            color: filterStatus === status.id ? '#00ff88' : '#94a3b8',
                                            padding: '8px 14px',
                                            borderRadius: '10px',
                                            fontSize: '0.78rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Pills (Horizontal Scroll) */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            overflowX: 'auto',
                            paddingBottom: '4px',
                            scrollbarWidth: 'none'
                        }}>
                            {CATEGORIES.map(cat => {
                                const count = cat === 'ALL'
                                    ? ACHIEVEMENTS.length
                                    : ACHIEVEMENTS.filter(a => a.category === cat).length;

                                const isActive = selectedCategory === cat;

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            playClick?.();
                                            setSelectedCategory(cat);
                                        }}
                                        style={{
                                            background: isActive ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(16, 124, 16, 0.2))' : 'rgba(255, 255, 255, 0.04)',
                                            border: isActive ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.08)',
                                            color: isActive ? '#00ff88' : '#94a3b8',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            fontFamily: 'monospace',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {cat} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ACHIEVEMENTS GRID */}
                    <div style={{
                        padding: '24px 28px',
                        overflowY: 'auto',
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '14px',
                        alignContent: 'start'
                    }}>
                        {filteredAchievements.length > 0 ? (
                            filteredAchievements.map(ach => {
                                const isUnlocked = unlockedAchievements.includes(ach.id);
                                const isSecret = ach.category === 'Secret' && !isUnlocked;

                                return (
                                    <div
                                        key={ach.id}
                                        style={{
                                            background: isUnlocked
                                                ? 'linear-gradient(165deg, rgba(16, 32, 22, 0.75) 0%, rgba(8, 16, 12, 0.85) 100%)'
                                                : 'rgba(255, 255, 255, 0.03)',
                                            border: isUnlocked
                                                ? '1px solid rgba(0, 255, 136, 0.45)'
                                                : '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            boxShadow: isUnlocked ? '0 4px 20px rgba(0, 255, 136, 0.1)' : 'none',
                                            opacity: isUnlocked ? 1 : 0.75,
                                            transition: 'border-color 0.2s, opacity 0.2s'
                                        }}
                                    >
                                        <div>
                                            {/* Card Top: Category & Gamerscore Pill */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    color: isUnlocked ? '#00ff88' : '#64748b',
                                                    fontFamily: 'monospace',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {ach.game || ach.category}
                                                </span>

                                                <span style={{
                                                    background: isUnlocked ? 'rgba(0, 255, 136, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                                                    border: isUnlocked ? '1px solid rgba(0, 255, 136, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                                                    color: isUnlocked ? '#00ff88' : '#94a3b8',
                                                    borderRadius: '6px',
                                                    padding: '2px 8px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '900',
                                                    fontFamily: '"Orbitron", monospace'
                                                }}>
                                                    +{ach.gamerscore || 25}G
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h4 style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '0.98rem',
                                                fontWeight: '800',
                                                color: isUnlocked ? '#fff' : '#cbd5e1',
                                                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
                                            }}>
                                                {isSecret ? '🔒 Secret Achievement' : ach.title}
                                            </h4>

                                            {/* Description */}
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.78rem',
                                                color: isUnlocked ? '#94a3b8' : '#64748b',
                                                lineHeight: '1.4'
                                            }}>
                                                {isSecret
                                                    ? 'Play games and explore the arcade to discover.'
                                                    : ach.description}
                                            </p>
                                        </div>

                                        {/* Card Footer: Status & Reward */}
                                        <div style={{
                                            paddingTop: '8px',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '0.72rem'
                                        }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontWeight: 'bold',
                                                color: isUnlocked ? '#00ff88' : '#64748b',
                                                fontFamily: 'monospace'
                                            }}>
                                                {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                                            </span>

                                            {ach.reward && !isSecret && (
                                                <span style={{
                                                    color: '#ffd700',
                                                    fontFamily: 'monospace',
                                                    fontWeight: 'bold'
                                                }}>
                                                    🎁 {ach.reward}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                padding: '60px 20px',
                                textAlign: 'center',
                                color: '#64748b',
                                fontFamily: 'monospace'
                            }}>
                                No achievements match your current filter.
                            </div>
                        )}
                    </div>

                    {/* MODAL FOOTER */}
                    <div style={{
                        padding: '12px 28px',
                        background: 'rgba(6, 10, 18, 0.96)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontFamily: 'monospace'
                    }}>
                        <span>TOTAL ACHIEVEMENTS: {totalCount}</span>
                        <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                            {currentG} G EARNED
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AchievementsCodexModal;
