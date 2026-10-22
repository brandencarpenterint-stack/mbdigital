/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';

const CLEARANCE_TIERS = [
    {
        tier: 1,
        code: 'CONFIDENTIAL',
        defcon: 'DEFCON 4',
        minLevel: 1,
        color: '#00f0ff',
        rakebackRate: '5.0%',
        rakebackFactor: 0.05,
        deadDropReward: 750,
        privileges: ['Tactical Comms Access', 'Standard Loss Recovery', 'Daily Dead-Drop Alpha']
    },
    {
        tier: 2,
        code: 'SECRET',
        defcon: 'DEFCON 3',
        minLevel: 5,
        color: '#00ff88',
        rakebackRate: '7.5%',
        rakebackFactor: 0.075,
        deadDropReward: 1800,
        privileges: ['Frequency Decryptor Link', '7.5% Rakeback Matrix', 'Daily Dead-Drop Bravo']
    },
    {
        tier: 3,
        code: 'TOP SECRET // NOFORN',
        defcon: 'DEFCON 2',
        minLevel: 10,
        color: '#ffd700',
        rakebackRate: '10.0%',
        rakebackFactor: 0.10,
        deadDropReward: 4000,
        privileges: ['Black-Box Syndicate Vault', '10.0% Rakeback Matrix', 'Daily Dead-Drop Charlie']
    },
    {
        tier: 4,
        code: 'BLACK-OPS SYNDICATE',
        defcon: 'DEFCON 1',
        minLevel: 20,
        color: '#ff0055',
        rakebackRate: '15.0%',
        rakebackFactor: 0.15,
        deadDropReward: 10000,
        privileges: ['Ghost Whale Exemption', '15.0% Maximum Rakeback', 'Daily Dead-Drop Delta (+10,000 CP)']
    }
];

const PentagonClearanceModal = ({ isOpen, onClose }) => {
    const { coins, addCoins, getLevelInfo, userProfile, triggerConfetti } = useGamification() || {};
    const { showToast } = useToast() || { showToast: console.log };
    const { playWin, playBeep, playBoop } = useRetroSound();

    const { level = 1 } = getLevelInfo ? getLevelInfo() : { level: 1 };

    // Determine Player's Current Clearance Tier
    const currentTier = CLEARANCE_TIERS.slice().reverse().find(t => level >= t.minLevel) || CLEARANCE_TIERS[0];
    const nextTier = CLEARANCE_TIERS.find(t => t.minLevel > level) || null;

    // Biometric Scanner State
    const [isScanning, setIsScanning] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(() => {
        return sessionStorage.getItem('pentagon_biometric_auth') === 'true';
    });
    const scanTimeoutRef = useRef(null);

    // Tactical Rakeback Vault State
    const [rakebackBalance, setRakebackBalance] = useState(() => {
        const stored = localStorage.getItem('pentagon_rakeback_pool');
        if (stored !== null) return parseFloat(stored);
        // Default initial reserve for new enlistees
        return 1250;
    });

    // Daily Classified Dead-Drop State
    const [deadDropRemainingSec, setDeadDropRemainingSec] = useState(0);

    const checkDeadDropTimer = () => {
        const lastDrop = localStorage.getItem('pentagon_last_deaddrop');
        if (!lastDrop) {
            setDeadDropRemainingSec(0);
            return;
        }
        const diffSec = Math.floor((Date.now() - parseInt(lastDrop, 10)) / 1000);
        const cooldown = 24 * 3600;
        if (diffSec < cooldown) {
            setDeadDropRemainingSec(cooldown - diffSec);
        } else {
            setDeadDropRemainingSec(0);
        }
    };

    useEffect(() => {
        checkDeadDropTimer();
        const timer = setInterval(checkDeadDropTimer, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format remaining time
    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Biometric Scan Hold Logic
    const handleStartScan = () => {
        if (isAuthorized) return;
        setIsScanning(true);
        playBoop?.();

        scanTimeoutRef.current = setTimeout(() => {
            setIsScanning(false);
            setIsAuthorized(true);
            sessionStorage.setItem('pentagon_biometric_auth', 'true');
            playWin?.();
            showToast('BIOMETRIC MATCH CONFIRMED: PENTAGON DEFENSE ACCESS GRANTED', 'win');
        }, 1200);
    };

    const handleCancelScan = () => {
        if (!isAuthorized) {
            setIsScanning(false);
            if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        }
    };

    // Claim Rakeback
    const handleClaimRakeback = () => {
        if (rakebackBalance <= 0) {
            showToast('RAKEBACK POOL EMPTY. PLACE WAGERS TO ACCRUE LOSS RECOVERY', 'info');
            return;
        }
        const amount = Math.floor(rakebackBalance);
        if (addCoins) addCoins(amount);
        setRakebackBalance(0);
        localStorage.setItem('pentagon_rakeback_pool', '0');
        playWin?.();
        if (triggerConfetti) triggerConfetti();
        showToast(`RAKEBACK EXTRACTED: +${amount.toLocaleString()} CP INJECTED INTO WALLET`, 'win');
    };

    // Claim Daily Dead-Drop
    const handleClaimDeadDrop = () => {
        if (deadDropRemainingSec > 0) return;
        const reward = currentTier.deadDropReward;
        if (addCoins) addCoins(reward);
        localStorage.setItem('pentagon_last_deaddrop', Date.now().toString());
        setDeadDropRemainingSec(24 * 3600);
        playWin?.();
        if (triggerConfetti) triggerConfetti();
        showToast(`DEAD-DROP EXTRACTED: +${reward.toLocaleString()} CP ACQUIRED`, 'win');
    };

    if (!isOpen) return null;

    const avatarUrl = userProfile?.avatar_url || '/assets/skins/face_default.png';

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(2, 4, 10, 0.88)',
                backdropFilter: 'blur(16px)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: '"Orbitron", monospace'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        width: '100%',
                        maxWidth: '720px',
                        background: 'linear-gradient(145deg, #090e18, #03060c)',
                        border: `1.5px solid ${currentTier.color}`,
                        borderRadius: '24px',
                        boxShadow: `0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px ${currentTier.color}33`,
                        overflow: 'hidden',
                        position: 'relative',
                        color: '#fff'
                    }}
                >
                    {/* TOP CLASSIFIED BANNER */}
                    <div style={{
                        padding: '14px 20px',
                        background: 'rgba(0, 0, 0, 0.65)',
                        borderBottom: `1px solid ${currentTier.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: `${currentTier.color}20`,
                                border: `1px solid ${currentTier.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: currentTier.color
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.62rem', color: currentTier.color, letterSpacing: '2px', fontWeight: '900' }}>
                                    DEPARTMENT OF DEFENSE // CYBER COMMAND
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '900', letterSpacing: '1px' }}>
                                    CLASSIFIED DEFENSE DOSSIER
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#94a3b8',
                                borderRadius: '10px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* BIOMETRIC AUTHENTICATOR STRIP (if not yet authorized) */}
                    {!isAuthorized && (
                        <div style={{
                            padding: '24px 20px',
                            background: 'rgba(0, 0, 0, 0.75)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#00f0ff', letterSpacing: '2px', marginBottom: '6px', fontWeight: 'bold' }}>
                                BIOMETRIC CLEARANCE GATE
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '18px' }}>
                                Hold the biometric scanner pad below to verify operative identity.
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseDown={handleStartScan}
                                onMouseUp={handleCancelScan}
                                onTouchStart={handleStartScan}
                                onTouchEnd={handleCancelScan}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: isScanning ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `2px solid ${isScanning ? '#00f0ff' : 'rgba(0, 240, 255, 0.4)'}`,
                                    margin: '0 auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    boxShadow: isScanning ? '0 0 30px #00f0ff' : '0 0 15px rgba(0, 240, 255, 0.15)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Fingerprint SVG */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                                    <path d="M2 16h.01" />
                                    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                                    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                                    <path d="M4.5 13a8 8 0 0 1 15 0" />
                                </svg>

                                {/* Scanning Laser Bar */}
                                {isScanning && (
                                    <motion.div
                                        animate={{ y: [-40, 40, -40] }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                        style={{
                                            position: 'absolute',
                                            left: 0, right: 0,
                                            height: '3px',
                                            background: '#00f0ff',
                                            boxShadow: '0 0 12px #00f0ff'
                                        }}
                                    />
                                )}
                            </motion.button>

                            <div style={{ fontSize: '0.65rem', color: isScanning ? '#00f0ff' : '#64748b', marginTop: '12px', fontWeight: 'bold' }}>
                                {isScanning ? 'AUTHENTICATING BIOMETRIC TELEMETRY...' : 'PRESS & HOLD PAD TO SCAN'}
                            </div>
                        </div>
                    )}

                    {/* MAIN DOSSIER BODY (Accessible or Unlocked) */}
                    <div style={{
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px'
                    }}>
                        {/* LEFT: Operative Dossier Card */}
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.55)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    border: `2px solid ${currentTier.color}`,
                                    boxShadow: `0 0 15px ${currentTier.color}44`
                                }}>
                                    <img src={avatarUrl} alt="Operative" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '1px' }}>
                                        ACTIVE OPERATIVE
                                    </div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#fff' }}>
                                        {userProfile?.name || 'AGENT-CLASSIFIED'}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#ffd700', fontFamily: 'monospace' }}>
                                        ID CODE: {userProfile?.code || 'PNT-7749'}
                                    </div>
                                </div>
                            </div>

                            {/* Current Security Tier Badge */}
                            <div style={{
                                background: `${currentTier.color}15`,
                                border: `1px solid ${currentTier.color}66`,
                                borderRadius: '12px',
                                padding: '10px 14px'
                            }}>
                                <div style={{ fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '2px' }}>
                                    CURRENT SECURITY CLEARANCE
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: currentTier.color, letterSpacing: '1px' }}>
                                    {currentTier.defcon}: {currentTier.code}
                                </div>
                                <div style={{ fontSize: '0.62rem', color: '#cbd5e1', marginTop: '4px' }}>
                                    Level {level} Operative &bull; Rakeback: {currentTier.rakebackRate}
                                </div>
                            </div>

                            {/* Privileges Matrix */}
                            <div>
                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '6px' }}>
                                    ACTIVE SECURITY PRIVILEGES:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {currentTier.privileges.map((p, idx) => (
                                        <div key={idx} style={{
                                            fontSize: '0.68rem',
                                            color: '#cbd5e1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{ color: currentTier.color }}>&bull;</span> {p}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Clearance Progress */}
                            {nextTier && (
                                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#94a3b8', marginBottom: '4px' }}>
                                        <span>NEXT: {nextTier.code}</span>
                                        <span>LVL {nextTier.minLevel}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(100, Math.round((level / nextTier.minLevel) * 100))}%`,
                                            height: '100%',
                                            background: nextTier.color
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Tactical Black-Box Rakeback & Daily Dead-Drop */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Rakeback Vault Box */}
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.55)',
                                border: '1px solid rgba(255, 215, 0, 0.25)',
                                borderRadius: '16px',
                                padding: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.62rem', color: '#ffd700', letterSpacing: '1.5px', fontWeight: '900' }}>
                                        TACTICAL RAKEBACK VAULT
                                    </span>
                                    <span style={{ fontSize: '0.62rem', color: '#00ff88', fontWeight: 'bold' }}>
                                        {currentTier.rakebackRate} RATE
                                    </span>
                                </div>

                                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffd700', margin: '6px 0 2px 0' }}>
                                    {Math.floor(rakebackBalance).toLocaleString()} <span style={{ fontSize: '0.65rem' }}>CP</span>
                                </div>

                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginBottom: '12px' }}>
                                    Loss recovery accumulated across all wagered arcade & casino games.
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClaimRakeback}
                                    style={{
                                        width: '100%',
                                        background: rakebackBalance > 0 ? 'linear-gradient(135deg, #ffd700, #ff8800)' : 'rgba(255, 255, 255, 0.08)',
                                        color: rakebackBalance > 0 ? '#000' : '#666',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        fontWeight: '900',
                                        fontSize: '0.75rem',
                                        cursor: rakebackBalance > 0 ? 'pointer' : 'not-allowed',
                                        fontFamily: '"Orbitron", monospace',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {rakebackBalance > 0 ? `CLAIM RAKEBACK (+${Math.floor(rakebackBalance).toLocaleString()} CP)` : 'NO RAKEBACK ACCRUED'}
                                </motion.button>
                            </div>

                            {/* Daily Dead-Drop Cache */}
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.55)',
                                border: '1px solid rgba(0, 240, 255, 0.25)',
                                borderRadius: '16px',
                                padding: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.62rem', color: '#00f0ff', letterSpacing: '1.5px', fontWeight: '900' }}>
                                        DAILY CLASSIFIED DEAD-DROP
                                    </span>
                                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                                        24H EXTRACTION
                                    </span>
                                </div>

                                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#00f0ff', margin: '6px 0 2px 0' }}>
                                    +{currentTier.deadDropReward.toLocaleString()} <span style={{ fontSize: '0.65rem' }}>CP</span>
                                </div>

                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginBottom: '12px' }}>
                                    Daily classified military supply crate scaled to your clearance tier.
                                </div>

                                <motion.button
                                    whileHover={deadDropRemainingSec === 0 ? { scale: 1.02 } : {}}
                                    whileTap={deadDropRemainingSec === 0 ? { scale: 0.98 } : {}}
                                    onClick={handleClaimDeadDrop}
                                    disabled={deadDropRemainingSec > 0}
                                    style={{
                                        width: '100%',
                                        background: deadDropRemainingSec === 0 ? 'linear-gradient(135deg, #00f0ff, #0072ff)' : 'rgba(255, 255, 255, 0.08)',
                                        color: deadDropRemainingSec === 0 ? '#000' : '#64748b',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        fontWeight: '900',
                                        fontSize: '0.75rem',
                                        cursor: deadDropRemainingSec === 0 ? 'pointer' : 'not-allowed',
                                        fontFamily: '"Orbitron", monospace',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {deadDropRemainingSec === 0
                                        ? `EXECUTE EXTRACTION (+${currentTier.deadDropReward.toLocaleString()} CP)`
                                        : `EXTRACTION COOLDOWN: ${formatTime(deadDropRemainingSec)}`
                                    }
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER WATERMARK */}
                    <div style={{
                        padding: '10px 20px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.58rem',
                        color: '#64748b'
                    }}>
                        <span>PENTAGON CYBER DEFENSE DIRECTIVE // SECTION 408-A</span>
                        <span>EYES ONLY // NOFORN</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PentagonClearanceModal;
