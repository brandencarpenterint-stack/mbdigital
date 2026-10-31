import React, { useState } from 'react';
import { generateDuelShareUrl } from '../utils/ghostDuelCodec';
import { getSkinAura } from '../config/SkinAuras';
import useRetroSound from '../hooks/useRetroSound';

/**
 * Share Duel Modal
 * Allows players to generate and copy challenge links to Discord / X / chat.
 */
export const ShareDuelModal = ({
    isOpen,
    onClose,
    gamePath,
    ghostData,
    unit = 'm'
}) => {
    const [copied, setCopied] = useState(false);
    const { playCoin, playClick } = useRetroSound();

    if (!isOpen || !ghostData) return null;

    const { aura, tier } = getSkinAura(ghostData.skinId || 'face_default');
    const duelUrl = generateDuelShareUrl(gamePath, ghostData);

    const handleCopy = () => {
        if (!duelUrl) return;
        navigator.clipboard.writeText(duelUrl).then(() => {
            setCopied(true);
            playCoin?.();
            setTimeout(() => setCopied(false), 3000);
        }).catch(() => {
            // Fallback for older browsers
            prompt('Copy your Duel Challenge Link:', duelUrl);
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(5, 8, 18, 0.85)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 12, 22, 0.98))',
                    border: `1.5px solid ${aura.primaryColor}`,
                    boxShadow: `0 0 35px ${aura.glowColor}`,
                    borderRadius: '24px',
                    padding: '28px',
                    textAlign: 'center',
                    position: 'relative',
                    fontFamily: '"Orbitron", sans-serif',
                    color: '#fff'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => { onClose(); playClick?.(); }}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#94a3b8',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>

                {/* Header Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `${aura.primaryColor}22`,
                    border: `1px solid ${aura.primaryColor}66`,
                    color: aura.primaryColor,
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    letterSpacing: '1px',
                    marginBottom: '16px'
                }}>
                    <span>👻 ASYNC GHOST DUEL</span>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
                    CHALLENGE A RIVAL
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif', margin: '0 0 24px 0', lineHeight: 1.4 }}>
                    Your run is saved into a phantom ghost link. Send it to a friend and they will race your exact replay in real-time!
                </p>

                {/* Ghost Card Preview */}
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
                    }}
                >
                    <div
                        style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${aura.glowColor} 0%, rgba(0,0,0,0.6) 80%)`,
                            border: `2px dashed ${aura.primaryColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 0 14px ${aura.glowColor}`,
                            flexShrink: 0
                        }}
                    >
                        <img
                            src={ghostData.skinId?.startsWith('/') ? ghostData.skinId : `/assets/skins/${ghostData.skinId}.png`}
                            alt="Skin"
                            onError={(e) => { e.target.src = '/assets/skins/face_default.png'; }}
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700' }}>CHALLENGER RECORD</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffd700' }}>
                            {(ghostData.finalScore || 0).toLocaleString()} {unit}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: aura.primaryColor, fontWeight: '800' }}>
                            AURA: {aura.name}
                        </div>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    style={{
                        width: '100%',
                        background: copied
                            ? 'linear-gradient(135deg, #00ff88, #00cc66)'
                            : `linear-gradient(135deg, ${aura.primaryColor}, #0072ff)`,
                        border: 'none',
                        color: copied ? '#000' : '#fff',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        fontSize: '0.95rem',
                        fontWeight: '900',
                        cursor: 'pointer',
                        fontFamily: '"Orbitron", sans-serif',
                        letterSpacing: '1px',
                        boxShadow: `0 4px 20px ${aura.glowColor}`,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {copied ? (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>CHALLENGE LINK COPIED!</span>
                        </>
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>COPY CHALLENGE LINK</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareDuelModal;
