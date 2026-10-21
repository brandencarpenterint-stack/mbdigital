import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adService, SPONSOR_REWARD_CP, SPONSOR_REWARD_XP } from '../services/adService';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { triggerConfetti } from '../utils/confetti';
import { feedService } from '../utils/feed';
import useRetroSound from '../hooks/useRetroSound';
import { useToast } from '../context/ToastContext';

const DURATION_SECONDS = 8;

const SponsorStationModal = ({ isOpen, onClose }) => {
    const { addCoins, userProfile } = useGamification() || {};
    const { gainExp } = usePocketBro() || {};
    const { playWin, playCollect, playZap, playClick } = useRetroSound();
    const { showToast } = useToast() || { showToast: () => {} };

    const [quota, setQuota] = useState(adService.getDailyQuota());
    const [isPlaying, setIsPlaying] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [rewardReady, setRewardReady] = useState(false);
    const [claimedSuccess, setClaimedSuccess] = useState(false);

    const timerRef = useRef(null);

    // Refresh quota whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setQuota(adService.getDailyQuota());
            setIsPlaying(false);
            setRewardReady(false);
            setClaimedSuccess(false);
            setSecondsLeft(DURATION_SECONDS);
            setActiveCampaign(adService.getRandomCampaign());
        }
    }, [isOpen]);

    // Timer logic during ad playback
    useEffect(() => {
        if (isPlaying && secondsLeft > 0) {
            timerRef.current = setTimeout(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (isPlaying && secondsLeft === 0) {
            setIsPlaying(false);
            setRewardReady(true);
            try {
                playCollect?.();
            } catch {
                // ignore
            }
        }
        return () => clearTimeout(timerRef.current);
    }, [isPlaying, secondsLeft, playCollect]);

    if (!isOpen) return null;

    const handleStartWatch = () => {
        if (!quota.canClaim) return;
        playClick();
        setActiveCampaign(adService.getRandomCampaign());
        setSecondsLeft(DURATION_SECONDS);
        setRewardReady(false);
        setClaimedSuccess(false);
        setIsPlaying(true);
        try {
            playZap?.();
        } catch {
            // ignore
        }
    };

    const handleClaimReward = () => {
        if (!rewardReady) return;
        playWin();
        triggerConfetti();

        // 1. Add CP
        if (addCoins) {
            addCoins(SPONSOR_REWARD_CP);
        }

        // 2. Add PocketBro XP
        if (gainExp) {
            gainExp(SPONSOR_REWARD_XP);
        }

        // 3. Record ad claim in storage
        const updatedQuota = adService.recordClaim();
        setQuota(updatedQuota);
        setRewardReady(false);
        setClaimedSuccess(true);

        // 4. Global broadcast & Toast
        const operatorName = userProfile?.name || 'CYBER OPERATOR';
        feedService.publish(
            `⚡ OPERATOR ${operatorName.toUpperCase()} CASHED A ${SPONSOR_REWARD_CP.toLocaleString()} CP SPONSOR AIRDROP!`,
            'sponsor',
            operatorName
        );

        if (showToast) {
            showToast(`AIRDROP RECEIVED: +${SPONSOR_REWARD_CP.toLocaleString()} CP & +${SPONSOR_REWARD_XP} BRO XP!`, 'coin');
        }
    };

    const progressPct = ((DURATION_SECONDS - secondsLeft) / DURATION_SECONDS) * 100;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.88)',
                backdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '16px'
            }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                        background: 'linear-gradient(180deg, #0f172a 0%, #030712 100%)',
                        border: '2px solid rgba(0, 240, 255, 0.4)',
                        borderRadius: '24px',
                        boxShadow: '0 0 50px rgba(0, 240, 255, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.8)',
                        width: '100%',
                        maxWidth: '540px',
                        overflow: 'hidden',
                        position: 'relative',
                        color: '#fff',
                        fontFamily: '"Orbitron", sans-serif'
                    }}
                >
                    {/* Header Strip */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'rgba(0, 240, 255, 0.08)',
                        borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.4rem' }}>⚡</span>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px', color: '#00f0ff' }}>
                                    SPONSOR RELAY NODE
                                </h3>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    QUANTUM BANDWIDTH AIRDROP STATION
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#aaa',
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
                    </div>

                    {/* Modal Body */}
                    <div style={{ padding: '24px' }}>
                        {/* Daily Quota Counter */}
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', letterSpacing: '1px' }}>
                                DAILY AIRDROPS REMAINING:
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[...Array(quota.max)].map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '4px',
                                            background: i < quota.claimedCount ? '#334155' : '#00f0ff',
                                            boxShadow: i < quota.claimedCount ? 'none' : '0 0 8px #00f0ff',
                                            border: '1px solid rgba(255, 255, 255, 0.2)'
                                        }}
                                        title={i < quota.claimedCount ? 'Claimed' : 'Available'}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ad Transmission Screen */}
                        {isPlaying && activeCampaign && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: activeCampaign.bgGradient,
                                    border: `1px solid ${activeCampaign.accentColor}`,
                                    borderRadius: '18px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: `0 0 30px ${activeCampaign.accentColor}33`,
                                    marginBottom: '20px'
                                }}
                            >
                                {/* Scanline overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(0,0,0,0.7)',
                                    border: `1px solid ${activeCampaign.accentColor}`,
                                    color: activeCampaign.accentColor,
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 'bold'
                                }}>
                                    AIRDROP IN: {secondsLeft}s
                                </div>

                                <div style={{ fontSize: '3rem', marginBottom: '8px', filter: `drop-shadow(0 0 12px ${activeCampaign.accentColor})` }}>
                                    {activeCampaign.icon}
                                </div>

                                <div style={{
                                    fontSize: '0.7rem',
                                    letterSpacing: '2px',
                                    color: activeCampaign.accentColor,
                                    fontWeight: 'bold',
                                    marginBottom: '4px'
                                }}>
                                    FEATURED SPONSOR
                                </div>

                                <h2 style={{
                                    fontSize: '1.25rem',
                                    margin: '0 0 8px 0',
                                    color: '#fff',
                                    letterSpacing: '1px'
                                }}>
                                    {activeCampaign.brand}
                                </h2>

                                <div style={{
                                    fontSize: '0.8rem',
                                    color: '#94a3b8',
                                    marginBottom: '16px',
                                    fontFamily: 'monospace'
                                }}>
                                    {activeCampaign.tagline}
                                </div>

                                <p style={{
                                    fontSize: '0.85rem',
                                    lineHeight: '1.4',
                                    color: '#e2e8f0',
                                    margin: '0 0 16px 0',
                                    fontFamily: 'sans-serif'
                                }}>
                                    {activeCampaign.pitch}
                                </p>

                                {/* Progress Bar */}
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'rgba(0,0,0,0.5)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <motion.div
                                        style={{
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${activeCampaign.accentColor}, #ffffff)`,
                                            boxShadow: `0 0 10px ${activeCampaign.accentColor}`
                                        }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ ease: 'linear', duration: 1 }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Reward Ready State */}
                        {rewardReady && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    background: 'rgba(0, 240, 255, 0.1)',
                                    border: '1px solid #00f0ff',
                                    borderRadius: '18px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                                <h3 style={{ color: '#00f0ff', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
                                    VERIFICATION TRANSMITTED!
                                </h3>
                                <div style={{ color: '#e2e8f0', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    The sponsor relay confirmed your transmission. Claim your rewards now:
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    marginBottom: '20px',
                                    fontFamily: 'monospace'
                                }}>
                                    <div style={{
                                        background: 'rgba(255, 215, 0, 0.15)',
                                        border: '1px solid #ffd700',
                                        color: '#ffd700',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        +{SPONSOR_REWARD_CP.toLocaleString()} CP
                                    </div>
                                    <div style={{
                                        background: 'rgba(0, 240, 255, 0.15)',
                                        border: '1px solid #00f0ff',
                                        color: '#00f0ff',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        +{SPONSOR_REWARD_XP} BRO XP
                                    </div>
                                </div>

                                <button
                                    onClick={handleClaimReward}
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '14px',
                                        padding: '14px',
                                        fontSize: '1rem',
                                        fontWeight: '900',
                                        cursor: 'pointer',
                                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    ⚡ CLAIM AIRDROP (+{SPONSOR_REWARD_CP} CP)
                                </button>
                            </motion.div>
                        )}

                        {/* Claimed Success State */}
                        {claimedSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(0, 255, 102, 0.1)',
                                    border: '1px solid #00ff66',
                                    borderRadius: '18px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💎</div>
                                <h3 style={{ color: '#00ff66', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
                                    AIRDROP CREDITED!
                                </h3>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    +{SPONSOR_REWARD_CP.toLocaleString()} CP added to your balance. PocketBro gained +{SPONSOR_REWARD_XP} XP!
                                </div>

                                {quota.canClaim ? (
                                    <button
                                        onClick={handleStartWatch}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '12px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        CLAIM ANOTHER ({quota.remaining} REMAINING)
                                    </button>
                                ) : (
                                    <div style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                        ALL 5 DAILY AIRDROPS CLAIMED FOR TODAY!
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Idle / Ready to Watch State */}
                        {!isPlaying && !rewardReady && !claimedSuccess && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '18px',
                                    padding: '24px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛰️</div>
                                    <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
                                        INSTANT SPONSOR AIRDROP
                                    </h3>
                                    <p style={{
                                        color: '#94a3b8',
                                        fontSize: '0.85rem',
                                        lineHeight: '1.5',
                                        margin: '0 0 16px 0',
                                        fontFamily: 'sans-serif'
                                    }}>
                                        Watch a brief 8-second sponsor transmission to instantly reload your wallet with Cyber Points. 100% free, supporting the continuous development of MBDigital!
                                    </p>

                                    <div style={{
                                        display: 'inline-flex',
                                        gap: '12px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 240, 255, 0.3)',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem'
                                    }}>
                                        <span style={{ color: '#ffd700' }}>🎁 +{SPONSOR_REWARD_CP.toLocaleString()} CP</span>
                                        <span style={{ color: '#00f0ff' }}>⭐ +{SPONSOR_REWARD_XP} XP</span>
                                    </div>
                                </div>

                                {quota.canClaim ? (
                                    <button
                                        onClick={handleStartWatch}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            fontSize: '1.05rem',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        INITIALIZE SPONSOR AIRDROP ({quota.remaining}/{quota.max})
                                    </button>
                                ) : (
                                    <div style={{
                                        background: 'rgba(255, 8, 68, 0.1)',
                                        border: '1px solid #ff0844',
                                        color: '#ff88aa',
                                        borderRadius: '14px',
                                        padding: '14px',
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace'
                                    }}>
                                        DAILY AIRDROP LIMIT REACHED (5/5).<br />
                                        SATELLITE BANDWIDTH RESETS AT MIDNIGHT.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div style={{
                        padding: '12px 20px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        color: '#64748b',
                        fontFamily: 'monospace'
                    }}>
                        <span>VERIFIED AD NETWORK ADAPTER</span>
                        <span>MBDIGITAL WORLD 2088</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SponsorStationModal;
