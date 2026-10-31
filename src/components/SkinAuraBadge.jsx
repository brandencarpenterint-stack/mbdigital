import React from 'react';
import { getSkinAura } from '../config/SkinAuras';

/**
 * Character Skin Aura Wrapper & Badge
 * Renders high-tier holographic auras, neon particle rings, and tier tags
 * around protected character skins without touching any image source files.
 */
export const SkinAuraBadge = ({
    skin,
    size = 54,
    showTier = false,
    showAuraName = false,
    pulse = true,
    style = {},
    children
}) => {
    const { aura, tier } = getSkinAura(skin);

    const tierColors = {
        MYTHIC: '#ff0055',
        LEGENDARY: '#ffd700',
        EPIC: '#a855f7',
        RARE: '#00f0ff'
    };

    const currentTierColor = tierColors[tier] || '#ffd700';

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
        >
            {/* Glowing Aura Outer Pod */}
            <div
                style={{
                    position: 'relative',
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `radial-gradient(circle, ${aura.glowColor} 0%, rgba(0,0,0,0.4) 75%)`,
                    border: `1.5px solid ${aura.primaryColor}88`,
                    boxShadow: pulse ? `0 0 16px ${aura.glowColor}, inset 0 0 10px ${aura.glowColor}` : 'none',
                    transition: 'all 0.25s ease'
                }}
            >
                {/* Orbiting energetic ring */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        border: `1px dashed ${aura.secondaryColor}66`,
                        animation: pulse ? 'spin 12s linear infinite' : 'none',
                        pointerEvents: 'none'
                    }}
                />

                {children ? children : (
                    skin?.src ? (
                        <img
                            src={skin.src}
                            alt={skin.name || 'Skin'}
                            style={{
                                width: '82%',
                                height: '82%',
                                objectFit: 'contain',
                                filter: `drop-shadow(0 0 6px ${aura.primaryColor}99)`
                            }}
                        />
                    ) : null
                )}

                {/* Tier Micro-Emblem Pill */}
                {showTier && (
                    <span
                        style={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-4px',
                            background: currentTierColor,
                            color: '#000',
                            fontSize: '0.55rem',
                            fontWeight: '900',
                            fontFamily: '"Orbitron", monospace',
                            padding: '1px 5px',
                            borderRadius: '6px',
                            boxShadow: `0 0 8px ${currentTierColor}`,
                            letterSpacing: '0.5px'
                        }}
                    >
                        {tier === 'MYTHIC' ? '★ MYTHIC' : tier}
                    </span>
                )}
            </div>

            {/* Aura Name Tag */}
            {showAuraName && (
                <div
                    style={{
                        marginTop: '6px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        fontFamily: '"Orbitron", sans-serif',
                        color: aura.primaryColor,
                        textShadow: `0 0 8px ${aura.glowColor}`,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase'
                    }}
                >
                    {aura.name}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SkinAuraBadge;
