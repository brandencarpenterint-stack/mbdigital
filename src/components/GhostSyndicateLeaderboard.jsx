import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkinAura } from '../config/SkinAuras';
import { getPersonalBestGhost, generateDuelShareUrl } from '../utils/ghostDuelCodec';
import { getAllSyndicateGames, getSyndicateGameData } from '../config/SyndicateGhosts';
import useRetroSound from '../hooks/useRetroSound';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

const SQUAD_COLORS = {
    CYBER: { border: '#00f0ff', bg: 'rgba(0, 240, 255, 0.15)', text: '#00f0ff' },
    SOLAR: { border: '#ffb700', bg: 'rgba(255, 183, 0, 0.15)', text: '#ffb700' },
    VOID: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc' }
};

const RANK_BADGES = {
    1: {
        label: '👑 WORLD RECORD',
        color: '#ffd700',
        bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 136, 0, 0.15))',
        border: '#ffd700',
        glow: 'rgba(255, 215, 0, 0.45)'
    },
    2: {
        label: '🥈 GRANDMASTER',
        color: '#00f0ff',
        bg: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.1))',
        border: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.35)'
    },
    3: {
        label: '🥉 ELITE DUELIST',
        color: '#ff8844',
        bg: 'linear-gradient(135deg, rgba(255, 136, 68, 0.2), rgba(150, 50, 20, 0.1))',
        border: '#ff8844',
        glow: 'rgba(255, 136, 68, 0.3)'
    },
    4: {
        label: '⚔️ CONTENDER',
        color: '#a855f7',
        bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(80, 20, 150, 0.1))',
        border: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.25)'
    }
};

export const GhostSyndicateLeaderboard = ({ initialGame = 'bro_cannon' }) => {
    const navigate = useNavigate();
    const { playCoin, playClick, playBeep, playWin } = useRetroSound();
    const { showToast } = useToast() || {};
    const { userProfile } = useGamification() || {};

    const [selectedGameKey, setSelectedGameKey] = useState(initialGame);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedPb, setCopiedPb] = useState(false);
    const [personalBest, setPersonalBest] = useState(null);

    const gameData = getSyndicateGameData(selectedGameKey);
    const allGames = getAllSyndicateGames();

    // Load user's local personal best ghost for the active game
    useEffect(() => {
        const pb = getPersonalBestGhost(selectedGameKey);
        setPersonalBest(pb);
    }, [selectedGameKey]);

    const handleCopyDuel = (url, index, isPb = false) => {
        if (!url) return;
        navigator.clipboard.writeText(url).then(() => {
            if (isPb) {
                setCopiedPb(true);
                setTimeout(() => setCopiedPb(false), 2500);
            } else {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2500);
            }
            playCoin?.();
            if (showToast) {
                showToast('⚡ Duel challenge link copied to clipboard!', 'success');
            }
        }).catch(() => {
            prompt('Copy Duel Link:', url);
        });
    };

    const handleRaceGhost = (gamePath, encodedDuel) => {
        playWin?.();
        navigate(`${gamePath}?duel=${encodedDuel}`);
    };

    const pbShareUrl = personalBest ? generateDuelShareUrl(gameData.path, personalBest) : '';

    return (
        <div style={{
            width: '100%',
            maxWidth: '920px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            color: '#fff',
            textAlign: 'left'
        }}>
            {/* SYNDICATE HERO BANNER */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 12, 24, 0.98))',
                border: '1.5px solid rgba(0, 240, 255, 0.45)',
                borderRadius: '24px',
                padding: '28px 24px',
                boxShadow: '0 0 35px rgba(0, 240, 255, 0.18)',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background perspective grid lines */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    pointerEvents: 'none',
                    opacity: 0.6
                }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(10, 15, 30, 0.8) 80%)',
                            border: '1.5px solid #00f0ff',
                            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem'
                        }}>
                            👻
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{
                                    background: 'rgba(0, 240, 255, 0.15)',
                                    border: '1px solid #00f0ff',
                                    borderRadius: '30px',
                                    padding: '2px 8px',
                                    fontSize: '0.62rem',
                                    color: '#00f0ff',
                                    fontWeight: '900',
                                    letterSpacing: '1px'
                                }}>
                                    GLOBAL SYNDICATE
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#ffd700', fontWeight: '900' }}>
                                    ★ ASYNC WORLD RECORDS
                                </span>
                            </div>
                            <h2 style={{
                                margin: 0,
                                fontSize: 'clamp(1.3rem, 4vw, 1.9rem)',
                                letterSpacing: '1.5px',
                                textShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                            }}>
                                GHOST DUEL LEADERBOARD
                            </h2>
                            <p style={{
                                margin: '6px 0 0 0',
                                fontSize: '0.78rem',
                                color: '#94a3b8',
                                fontFamily: 'monospace',
                                lineHeight: '1.4'
                            }}>
                                1-Click head-to-head racing against verified 60 FPS flight telemetry. Zero server lag. Beat any world record to claim bounties!
                            </p>
                        </div>
                    </div>

                    {/* Quick Metric Pill */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '14px',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>TOP BOUNTY</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#ffd700' }}>+500 CP</div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>RUN ENGINE</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#00ff88' }}>P2P 60FPS</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GAME SELECTOR PILL TABS */}
            <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '20px',
                scrollbarWidth: 'none'
            }}>
                {allGames.map(game => {
                    const isSelected = selectedGameKey === game.gameKey;
                    const topRecord = game.legends[0];
                    return (
                        <button
                            key={game.gameKey}
                            onClick={() => {
                                setSelectedGameKey(game.gameKey);
                                playClick?.();
                            }}
                            style={{
                                flex: '1 0 180px',
                                minWidth: '180px',
                                background: isSelected
                                    ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(168, 85, 247, 0.2))'
                                    : 'rgba(15, 23, 42, 0.7)',
                                border: isSelected ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '12px 14px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 0 20px rgba(0, 240, 255, 0.35)' : 'none',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{
                                    fontSize: '0.82rem',
                                    fontWeight: '900',
                                    color: isSelected ? '#00f0ff' : '#e2e8f0',
                                    letterSpacing: '0.5px'
                                }}>
                                    {game.title}
                                </span>
                                <span style={{ fontSize: '0.7rem' }}>
                                    {game.gameKey === 'bro_cannon' ? '🚀' : (game.gameKey === 'merch_jump' ? '🦘' : (game.gameKey === 'flappy_mascot' ? '🐦' : '⚡'))}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#ffd700', fontFamily: 'monospace' }}>
                                WR: {topRecord.score.toLocaleString()}{game.unit}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* PLAYER'S PERSONAL BEST HUD CARD */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.85), rgba(10, 15, 26, 0.9))',
                border: personalBest ? '1.5px solid rgba(0, 255, 136, 0.45)' : '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '18px',
                padding: '16px 20px',
                marginBottom: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                boxShadow: personalBest ? '0 0 20px rgba(0, 255, 136, 0.15)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1.5px solid #00ff88',
                        boxShadow: '0 0 12px rgba(0, 255, 136, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={personalBest?.skinId ? (personalBest.skinId.startsWith('/') ? personalBest.skinId : `/assets/skins/${personalBest.skinId}.png`) : '/assets/skins/face_default.png'}
                            alt="Avatar"
                            onError={(e) => { e.target.src = '/assets/skins/face_default.png'; }}
                            style={{ width: '75%', height: '75%', objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>YOUR TELEMETRY RECORD</span>
                            {personalBest && (
                                <span style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', border: '1px solid #00ff88', borderRadius: '4px', fontSize: '0.55rem', padding: '1px 4px', fontWeight: 'bold' }}>
                                    SAVED
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: personalBest ? '#fff' : '#64748b' }}>
                            {personalBest ? `${personalBest.finalScore.toLocaleString()}${gameData.unit}` : 'NO GHOST TELEMETRY YET'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {personalBest ? (
                        <>
                            <button
                                type="button"
                                onClick={() => handleCopyDuel(pbShareUrl, null, true)}
                                style={{
                                    background: copiedPb ? 'rgba(0, 255, 136, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                    border: `1px solid ${copiedPb ? '#00ff88' : 'rgba(255, 255, 255, 0.2)'}`,
                                    color: copiedPb ? '#00ff88' : '#e2e8f0',
                                    borderRadius: '12px',
                                    padding: '8px 14px',
                                    fontSize: '0.72rem',
                                    fontWeight: '900',
                                    fontFamily: 'monospace',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                <span>{copiedPb ? 'COPIED!' : 'SHARE MY GHOST'}</span>
                            </button>

                            <Link
                                to={`${gameData.path}?duel=${encodeGhostRun(personalBest)}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <button
                                    type="button"
                                    onClick={() => playWin?.()}
                                    style={{
                                        background: 'linear-gradient(135deg, #00ff88, #00c476)',
                                        border: 'none',
                                        color: '#000',
                                        borderRadius: '12px',
                                        padding: '8px 16px',
                                        fontSize: '0.72rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        cursor: 'pointer',
                                        boxShadow: '0 0 14px rgba(0, 255, 136, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span>⚔️ RACE MYSELF</span>
                                </button>
                            </Link>
                        </>
                    ) : (
                        <Link to={gameData.path} style={{ textDecoration: 'none' }}>
                            <button
                                type="button"
                                style={{
                                    background: 'linear-gradient(135deg, #00f0ff, #0072ff)',
                                    border: 'none',
                                    color: '#000',
                                    borderRadius: '12px',
                                    padding: '8px 16px',
                                    fontSize: '0.72rem',
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 14px rgba(0, 240, 255, 0.4)'
                                }}
                            >
                                RECORD FIRST RUN
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* SYNDICATE LEGENDS ROSTER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {gameData.legends.map((legend, index) => {
                    const rankBadge = RANK_BADGES[legend.rank] || RANK_BADGES[4];
                    const squadBadge = SQUAD_COLORS[legend.squad] || SQUAD_COLORS.CYBER;
                    const { aura, tier } = getSkinAura(legend.skinId);
                    const isCopied = copiedIndex === index;

                    return (
                        <motion.div
                            key={legend.playerName}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(10, 14, 26, 0.95))',
                                border: `1.5px solid ${rankBadge.border}55`,
                                borderRadius: '20px',
                                padding: '18px 20px',
                                boxShadow: `0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px ${rankBadge.glow}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '16px',
                                position: 'relative'
                            }}
                        >
                            {/* Left Column: Rank + Avatar + Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                                {/* Rank Emblem */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '42px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        fontSize: legend.rank === 1 ? '1.6rem' : '1.3rem',
                                        fontWeight: '900',
                                        color: rankBadge.color,
                                        textShadow: `0 0 12px ${rankBadge.glow}`
                                    }}>
                                        #{legend.rank}
                                    </div>
                                    <div style={{
                                        fontSize: '0.52rem',
                                        color: rankBadge.color,
                                        fontWeight: '800',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {legend.rank === 1 ? 'RECORD' : 'TIER'}
                                    </div>
                                </div>

                                {/* Avatar with Procedural Aura Ring */}
                                <div style={{
                                    position: 'relative',
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${aura.glowColor} 0%, rgba(0,0,0,0.7) 80%)`,
                                    border: `1.5px dashed ${aura.primaryColor}`,
                                    boxShadow: `0 0 16px ${aura.glowColor}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img
                                        src={`/assets/skins/${legend.skinId}.png`}
                                        alt={legend.playerName}
                                        onError={(e) => { e.target.src = '/assets/skins/face_default.png'; }}
                                        style={{ width: '75%', height: '75%', objectFit: 'contain', filter: `drop-shadow(0 0 6px ${aura.primaryColor})` }}
                                    />
                                    {/* Mythic Star Pill */}
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        right: '-4px',
                                        background: tier === 'MYTHIC' ? '#ff0055' : (tier === 'LEGENDARY' ? '#ffd700' : '#a855f7'),
                                        color: '#000',
                                        fontSize: '0.45rem',
                                        fontWeight: '900',
                                        padding: '1px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        {tier === 'MYTHIC' ? '★ MYTH' : tier.slice(0, 4)}
                                    </span>
                                </div>

                                {/* Player Info */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>
                                            {legend.playerName}
                                        </span>
                                        <span style={{
                                            background: squadBadge.bg,
                                            border: `1px solid ${squadBadge.border}`,
                                            color: squadBadge.text,
                                            fontSize: '0.55rem',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            fontWeight: '900'
                                        }}>
                                            {legend.squad}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace', maxWidth: '320px', lineHeight: '1.3' }}>
                                        {legend.bio}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column: Score & Bounty */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontFamily: 'monospace' }}>VERIFIED SCORE</div>
                                    <div style={{
                                        fontSize: '1.35rem',
                                        fontWeight: '900',
                                        color: rankBadge.color,
                                        textShadow: `0 0 14px ${rankBadge.glow}`
                                    }}>
                                        {legend.score.toLocaleString()}{gameData.unit}
                                    </div>
                                    <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
                                        TIME: {legend.durationFormatted}
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(255, 215, 0, 0.1)',
                                    border: '1px solid rgba(255, 215, 0, 0.35)',
                                    borderRadius: '10px',
                                    padding: '6px 10px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '0.55rem', color: '#ffd700', fontWeight: '900' }}>BOUNTY</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ffd700' }}>
                                        +{legend.bounty} CP
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Copy Challenge Link */}
                                <button
                                    type="button"
                                    onClick={() => handleCopyDuel(legend.duelUrl, index)}
                                    title="Copy challenge link"
                                    style={{
                                        background: isCopied ? 'rgba(0, 255, 136, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                        border: `1px solid ${isCopied ? '#00ff88' : 'rgba(255, 255, 255, 0.15)'}`,
                                        color: isCopied ? '#00ff88' : '#cbd5e1',
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {isCopied ? '✓' : (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    )}
                                </button>

                                {/* Race Ghost CTA */}
                                <button
                                    type="button"
                                    onClick={() => handleRaceGhost(gameData.path, legend.encodedDuel)}
                                    style={{
                                        background: legend.rank === 1
                                            ? 'linear-gradient(135deg, #ffd700 0%, #ff6600 100%)'
                                            : 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
                                        border: 'none',
                                        color: '#000',
                                        borderRadius: '10px',
                                        padding: '10px 18px',
                                        fontSize: '0.78rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        letterSpacing: '0.5px',
                                        cursor: 'pointer',
                                        boxShadow: legend.rank === 1
                                            ? '0 0 20px rgba(255, 215, 0, 0.45)'
                                            : '0 0 20px rgba(0, 240, 255, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'transform 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    <span>⚡ RACE GHOST</span>
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default GhostSyndicateLeaderboard;
