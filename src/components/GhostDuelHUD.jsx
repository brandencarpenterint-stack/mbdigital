import React from 'react';
import { getSkinAura } from '../config/SkinAuras';

/**
 * Ghost Duel Real-Time Telemetry HUD
 * Renders the rival's holographic avatar, target score, and live delta split
 */
export const GhostDuelHUD = ({
    ghost,
    currentScore = 0,
    ghostCurrentScore = 0,
    isGhostFinished = false,
    unit = 'm',
    style = {}
}) => {
    if (!ghost) return null;

    const { aura } = getSkinAura(ghost.skinId || 'face_default');
    const delta = Math.round(currentScore - (ghostCurrentScore || 0));
    const isAhead = delta >= 0;

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(10, 15, 30, 0.85)',
                border: `1.5px solid ${isAhead ? '#00ff88' : '#ff0055'}66`,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.6), 0 0 14px ${isAhead ? 'rgba(0, 255, 136, 0.25)' : 'rgba(255, 0, 85, 0.25)'}`,
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                padding: '4px 14px 4px 6px',
                fontFamily: '"Orbitron", sans-serif',
                pointerEvents: 'auto',
                ...style
            }}
        >
            {/* Ghost Avatar with Pulsing Aura Ring */}
            <div
                style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${aura.glowColor} 0%, rgba(0,0,0,0.5) 80%)`,
                    border: `1px dashed ${aura.primaryColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 10px ${aura.glowColor}`
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        top: '-4px',
                        left: '-4px',
                        fontSize: '0.65rem'
                    }}
                >
                    👻
                </span>
                <img
                    src={ghost.skinId?.startsWith('/') ? ghost.skinId : `/assets/skins/${ghost.skinId}.png`}
                    alt="Ghost"
                    onError={(e) => { e.target.src = '/assets/skins/face_default.png'; }}
                    style={{
                        width: '75%',
                        height: '75%',
                        objectFit: 'contain',
                        opacity: 0.85,
                        filter: `drop-shadow(0 0 4px ${aura.primaryColor})`
                    }}
                />
            </div>

            {/* Ghost Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>DUEL:</span>
                    <span style={{ color: '#fff' }}>{ghost.playerName || 'Rival'}</span>
                    <span style={{ color: '#ffd700', fontSize: '0.58rem' }}>({(ghost.finalScore || 0).toLocaleString()}{unit})</span>
                </div>

                {/* Live Delta Split Badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        color: isAhead ? '#00ff88' : '#ff3366',
                        textShadow: isAhead ? '0 0 8px rgba(0,255,136,0.6)' : '0 0 8px rgba(255,51,102,0.6)'
                    }}
                >
                    <span>{isAhead ? '▲ +' : '▼ '}{Math.abs(delta).toLocaleString()}{unit}</span>
                    <span style={{ fontSize: '0.55rem', opacity: 0.8, letterSpacing: '0.5px' }}>
                        {isAhead ? 'AHEAD' : 'BEHIND'}
                    </span>
                    {isGhostFinished && (
                        <span style={{ fontSize: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '4px', color: '#aaa' }}>
                            PB SET
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GhostDuelHUD;
