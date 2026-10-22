/* eslint-disable react/prop-types */
import React from 'react';
import { motion } from 'framer-motion';

const GENRE_COLORS = {
    casino: { bg: 'rgba(255, 215, 0, 0.15)', text: '#ffd700', border: 'rgba(255, 215, 0, 0.35)' },
    action: { bg: 'rgba(0, 240, 255, 0.15)', text: '#00f0ff', border: 'rgba(0, 240, 255, 0.35)' },
    retro: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' },
    default: { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff', border: 'rgba(255, 255, 255, 0.2)' }
};

const CinematicGameCard = ({ game, highScore = 0, isHighlighted = false }) => {
    const isSpotlight = isHighlighted || game?.isHighlighted;
    const isOriginal = game?.isOriginal || false;
    const genreStyle = isOriginal
        ? { bg: 'rgba(255, 0, 85, 0.2)', text: '#ff0055', border: 'rgba(255, 0, 85, 0.5)' }
        : (GENRE_COLORS[game.category] || GENRE_COLORS.default);

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
                width: '100%',
                maxWidth: '340px',
                background: 'linear-gradient(180deg, rgba(16, 20, 32, 0.9) 0%, rgba(8, 10, 18, 0.98) 100%)',
                border: isSpotlight
                    ? '1.5px solid rgba(0, 240, 255, 0.55)'
                    : (isOriginal ? '1.5px solid rgba(255, 0, 85, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)'),
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                boxShadow: isSpotlight
                    ? '0 14px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(0, 240, 255, 0.28)'
                    : (isOriginal ? '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 0, 85, 0.18)' : '0 10px 30px rgba(0, 0, 0, 0.5)'),
                position: 'relative',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isOriginal ? '#ff0055' : 'rgba(0, 240, 255, 0.55)';
                e.currentTarget.style.boxShadow = isOriginal
                    ? '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 0, 85, 0.35)'
                    : '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 28px rgba(0, 240, 255, 0.35)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isSpotlight
                    ? 'rgba(0, 240, 255, 0.55)'
                    : (isOriginal ? 'rgba(255, 0, 85, 0.35)' : 'rgba(255, 255, 255, 0.08)');
                e.currentTarget.style.boxShadow = isSpotlight
                    ? '0 14px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(0, 240, 255, 0.28)'
                    : (isOriginal ? '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 0, 85, 0.18)' : '0 10px 30px rgba(0, 0, 0, 0.5)');
            }}
        >
            {/* Cyber Arcade Marquee Header - EXPANDS height when spotlighted with bigger icon */}
            <div style={{
                position: 'relative',
                height: isSpotlight ? '150px' : '120px',
                width: '100%',
                background: game.gradient || 'linear-gradient(135deg, #1e293b, #0f172a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'height 0.3s ease'
            }}>
                {/* Perspective Cyber Grid Floor */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }} />

                {/* Deep Ambient Vignette */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 7, 15, 0.75) 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Cyber Corner Brackets */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '8px', height: '8px', borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderTop: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '8px', height: '8px', borderBottom: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '8px', height: '8px', borderBottom: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />

                {/* Top-Left Category / Original Badge */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '12px',
                    background: genreStyle.bg,
                    color: genreStyle.text,
                    border: `1px solid ${genreStyle.border}`,
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.62rem',
                    fontWeight: '900',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    zIndex: 2,
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {isOriginal && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    )}
                    {isOriginal ? 'MERCH ORIGINAL' : (game.category || 'ARCADE')}
                </div>

                {/* Top-Right Badges (Spotlight or High Score) */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 2
                }}>
                    {isSpotlight && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(0, 114, 255, 0.9))',
                            color: '#000',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '0.62rem',
                            fontWeight: '900',
                            letterSpacing: '1px',
                            fontFamily: 'monospace',
                            boxShadow: '0 0 12px rgba(0, 240, 255, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            FEATURED
                        </div>
                    )}

                    {highScore > 0 && !isSpotlight && (
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.75)',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            color: '#00ff88',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '0.62rem',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            backdropFilter: 'blur(6px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {highScore.toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Central Studio Vector Emblem inside Frosted Cyber Pod - BIGGER ICON WHEN HIGHLIGHTED */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: isSpotlight ? '96px' : '68px',
                        height: isSpotlight ? '96px' : '68px',
                        borderRadius: isSpotlight ? '24px' : '18px',
                        background: isSpotlight
                            ? 'radial-gradient(circle at 30% 30%, rgba(20, 30, 60, 0.85), rgba(5, 8, 18, 0.95))'
                            : 'rgba(5, 8, 18, 0.65)',
                        backdropFilter: 'blur(12px)',
                        border: isSpotlight
                            ? '1.5px solid rgba(0, 240, 255, 0.6)'
                            : '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: isSpotlight
                            ? '0 0 35px rgba(0, 240, 255, 0.6), 0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.25)'
                            : '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isSpotlight ? '3.5rem' : '2.5rem',
                        transform: isSpotlight ? 'scale(1.15)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    {game.icon || (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="6" y1="12" x2="10" y2="12" />
                            <line x1="8" y1="10" x2="8" y2="14" />
                            <line x1="15" y1="13" x2="15.01" y2="13" />
                            <line x1="18" y1="11" x2="18.01" y2="11" />
                            <rect x="2" y="6" width="20" height="12" rx="6" />
                        </svg>
                    )}
                </motion.div>
            </div>

            {/* Content Body */}
            <div style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                background: 'rgba(8, 12, 20, 0.95)'
            }}>
                <div>
                    <h3 style={{
                        margin: '0 0 6px 0',
                        fontSize: '1rem',
                        fontWeight: '900',
                        color: '#f8fafc',
                        fontFamily: '"Orbitron", sans-serif',
                        letterSpacing: '1px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {game.title}
                    </h3>

                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                        {game.desc || 'Experience high-stakes cyberpunk arcade gameplay.'}
                    </p>
                </div>

                {/* Bottom Action Footer */}
                <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span style={{
                        fontSize: '0.65rem',
                        color: '#64748b',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        letterSpacing: '0.5px'
                    }}>
                        INSTANT PLAY
                    </span>

                    <span style={{
                        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 114, 255, 0.25))',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        color: '#00f0ff',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span>PLAY</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CinematicGameCard;
