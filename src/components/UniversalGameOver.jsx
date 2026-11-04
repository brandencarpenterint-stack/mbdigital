import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SquishyButton from './SquishyButton';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import RewardedSponsorModal from './RewardedSponsorModal';

const UniversalGameOver = ({ 
    gameName = "ARCADE", 
    score, 
    bestScore, 
    coinsEarned = 0, 
    xpEarned = 100, 
    onReplay, 
    onHome,
    onRevive,
    children
}) => {
    const { getLevelInfo, addCoins } = useGamification() || {};
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [hasClaimedSponsor, setHasClaimedSponsor] = useState(false);
    const { playCoin, playWin, playBeep } = useRetroSound();
    const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    
    const isNewRecord = score > (bestScore || 0);
    const finalCoins = Math.max(coinsEarned * 3, Math.floor(score * 1.5));

    // Animation States
    const [displayScore, setDisplayScore] = useState(0);
    const [displayCoins, setDisplayCoins] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        playBeep?.();
        
        let startTime = null;
        const duration = 1500; 

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const runtime = timestamp - startTime;
            const relativeProgress = Math.min(runtime / duration, 1);
            const ease = 1 - (1 - relativeProgress) * (1 - relativeProgress);

            setDisplayScore(Math.floor(ease * score));
            setDisplayCoins(Math.floor(ease * finalCoins));
            
            if (relativeProgress < 1) {
                requestAnimationFrame(animate);
                if (Math.random() > 0.8) playCoin?.();
            } else {
                setDisplayScore(score);
                setDisplayCoins(finalCoins);
                
                if (progress < 15 && xpEarned > 0) {
                    setShowLevelUp(true);
                    triggerConfetti();
                    playWin?.();
                } else if (isNewRecord) {
                    triggerConfetti();
                    playWin?.();
                }
            }
        };

        requestAnimationFrame(animate);
    }, [score, finalCoins]);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(15px)',
            zIndex: 1000, fontFamily: '"Press Start 2P", monospace',
            overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            padding: '16px 10px 24px'
        }}>
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        style={{
                            position: 'absolute', top: '10%',
                            fontSize: '2.5rem', color: '#00ffcc',
                            textShadow: '0 0 35px #00ffcc', zIndex: 1100,
                            textAlign: 'center'
                        }}
                    >
                        LEVEL UP!<br/>
                        <span style={{ fontSize: '1.2rem', color: 'white' }}>YOU ARE NOW RANK {level}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="glass-panel" 
                style={{
                    padding: '24px 18px', textAlign: 'center', width: '95%', maxWidth: '440px',
                    border: isNewRecord ? '2px solid gold' : '2px solid rgba(0, 255, 204, 0.5)',
                    background: isNewRecord ? 'linear-gradient(135deg, rgba(255,215,0,0.18), rgba(0,0,0,0.92))' : 'rgba(18,18,28,0.95)',
                    boxShadow: isNewRecord ? '0 0 60px rgba(255,215,0,0.35)' : '0 15px 40px rgba(0,255,204,0.2)',
                    borderRadius: '20px', position: 'relative', margin: 'auto 0'
                }}
            >
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.04) 2px, rgba(0,255,204,0.04) 4px)', pointerEvents: 'none' }}></div>

                <div style={{ fontSize: '0.72rem', color: '#888', letterSpacing: '3px', marginBottom: '6px' }}>
                    {gameName}
                </div>

                <h2 style={{
                    fontSize: '2rem', margin: '0 0 14px 0',
                    background: isNewRecord ? 'linear-gradient(to right, gold, #ffaa00)' : 'linear-gradient(to right, #00ffcc, #ff00ff)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase', textShadow: isNewRecord ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                    letterSpacing: '1px'
                }}>
                    {isNewRecord ? 'NEW RECORD' : 'GAME OVER'}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '12px 6px', borderRadius: '12px', border: '1px solid #333' }}>
                        <div style={{ fontSize: '0.62rem', color: '#888', marginBottom: '4px' }}>SCORE</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', letterSpacing: '-0.5px' }}>{displayScore}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '12px 6px', borderRadius: '12px', border: '1px solid #333' }}>
                        <div style={{ fontSize: '0.62rem', color: '#888', marginBottom: '4px' }}>BEST</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'gold', letterSpacing: '-0.5px' }}>{isNewRecord ? displayScore : bestScore}</div>
                    </div>
                </div>

                <div style={{ background: 'rgba(0,255,204,0.05)', padding: '12px 14px', borderRadius: '14px', marginBottom: '14px', border: '1px solid rgba(0,255,204,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                        <span style={{ color: '#00ffcc' }}>+ {xpEarned} XP</span>
                        <span style={{ color: '#ffd700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />+ {displayCoins.toLocaleString()} CP</span>
                    </div>

                    <div style={{ textAlign: 'left', fontSize: '0.62rem', color: '#888', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>LVL {level}</span>
                        <span>{Math.floor(progress)}% TO NEXT</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: progress + '%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #00ffcc, #ff00ff)', boxShadow: '0 0 10px #00ffcc' }}
                        />
                    </div>
                </div>

                {/* REWARDED SPONSOR REVIVE OR COIN BOOSTER */}
                {!hasClaimedSponsor && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ marginBottom: '12px', width: '100%' }}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                playBeep?.();
                                setShowSponsorModal(true);
                            }}
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                background: onRevive
                                    ? 'linear-gradient(135deg, rgba(255, 0, 85, 0.25) 0%, rgba(255, 119, 0, 0.25) 100%)'
                                    : 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 229, 255, 0.2) 100%)',
                                border: onRevive
                                    ? '1.5px solid #ff0055'
                                    : '1.5px solid #00ff88',
                                borderRadius: '12px',
                                color: '#fff',
                                fontFamily: '"Orbitron", monospace',
                                fontSize: '0.74rem',
                                fontWeight: '900',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: onRevive
                                    ? '0 0 16px rgba(255, 0, 85, 0.3)'
                                    : '0 0 16px rgba(0, 255, 136, 0.3)'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                                <polyline points="17 2 12 7 7 2" />
                            </svg>
                            <span>
                                {onRevive
                                    ? 'WATCH SPONSOR SPOT (1 FREE REVIVE)'
                                    : `WATCH SPONSOR SPOT (+${Math.max(1000, finalCoins).toLocaleString()} CP)`}
                            </span>
                        </button>
                    </motion.div>
                )}

                <RewardedSponsorModal
                    isOpen={showSponsorModal}
                    onClose={() => setShowSponsorModal(false)}
                    rewardTitle={onRevive ? '1 FREE REVIVE' : `+${Math.max(1000, finalCoins)} CP BONUS`}
                    rewardIcon={onRevive ? '❤️' : '🪙'}
                    rewardDescription={onRevive ? 'Complete the sponsor spot to revive and continue your run!' : 'Complete the sponsor spot to boost your coin payout!'}
                    onRewarded={() => {
                        setHasClaimedSponsor(true);
                        if (onRevive) {
                            onRevive();
                        } else {
                            const bonus = Math.max(1000, finalCoins);
                            addCoins?.(bonus);
                            setDisplayCoins(prev => prev + bonus);
                        }
                    }}
                />

                <div style={{ marginBottom: '12px', width: '100%' }}>{children}</div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', marginBottom: '10px' }}>
                    <SquishyButton onClick={onHome} style={{ flex: 1, background: '#222', color: '#aaa', padding: '12px 18px', fontSize: '0.85rem' }}>
                        HOME
                    </SquishyButton>
                    <SquishyButton onClick={onReplay} style={{ flex: 1.4, background: 'var(--neon-blue)', color: 'black', padding: '12px 22px', fontSize: '1rem', fontWeight: 'bold' }}>
                        REPLAY
                    </SquishyButton>
                </div>

                <button 
                    onClick={() => {
                        const text = encodeURIComponent(`I just scored ${score} on ${gameName} at MBDigital! Think you can beat me? #MBDigitalArcade`);
                        const url = encodeURIComponent(window.location.origin);
                        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                    }}
                    style={{
                        width: '100%', padding: '11px', background: '#000', color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800',
                        fontFamily: '"Orbitron", sans-serif',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)', marginTop: '8px',
                        letterSpacing: '1px'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    SHARE RECORD ON X
                </button>

            </motion.div>
        </div>
    );
};

export default UniversalGameOver;
