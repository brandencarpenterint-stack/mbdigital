/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import TiltCard from '../components/TiltCard';
import TheButton from '../components/TheButton';
import CinematicGameCard from '../components/CinematicGameCard';
import { EmblemCrash, EmblemDozer, EmblemMines, EmblemBlackjack, EmblemSlots, EmblemMerchJump, EmblemDefense, EmblemBroCannon } from '../components/GameEmblems';
import SponsorStationModal from '../components/SponsorStationModal';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { useRealBtc } from '../hooks/useRealBtc';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

const HERO_SHOWCASE = [
    {
        id: 'merch-jump',
        tag: 'ORIGINAL FLAGSHIP',
        title: 'MERCH JUMP 2088',
        desc: 'The iconic MerchBoy platform leaper. Ascend through cyberspace on kinetic trampolines, jetpack boosters, and dodge neon gravity voids.',
        path: '/arcade/merch-jump',
        badge: 'MERCH ORIGINAL',
        badgeColor: '#ff0055',
        gradient: 'linear-gradient(135deg, rgba(255, 0, 85, 0.3), rgba(0, 240, 255, 0.2))',
        border: '#ff0055',
        accentColor: '#ff0055'
    },
    {
        id: 'crash',
        tag: 'FLAGSHIP MULTIPLAYER',
        title: 'CYBER CRASH 2088',
        desc: 'Watch the exponential starship surge up to 100x multipliers. Calculate your launch timing and bail out before catastrophic network collapse.',
        path: '/arcade/crash',
        badge: 'DEFCON 1 ACTIVE',
        badgeColor: '#ff0055',
        gradient: 'linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(255, 85, 0, 0.15))',
        border: '#ff0055',
        accentColor: '#ff0055'
    },
    {
        id: 'slots',
        tag: 'PROGRESSIVE JACKPOT',
        title: 'COSMIC SLOTS 777',
        desc: 'Classified 3-reel quantum slot matrix. Align pure vector 777s, gold bullion, and diamond prisms to trigger the multi-million CP syndicate pool.',
        path: '/arcade/slots',
        badge: '1.48M CP POOL',
        badgeColor: '#ffd700',
        gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 136, 0, 0.15))',
        border: '#ffd700',
        accentColor: '#ffd700'
    },
    {
        id: 'blackjack',
        tag: 'HIGH ROLLER SUITE',
        title: 'CYBER 21 VIP',
        desc: 'High-roller penthouse holographic croupier blackjack. Royal face visors, authentic 3:2 payouts, split hands, and double-down tactical wagers.',
        path: '/arcade/blackjack',
        badge: 'VIP PENTHOUSE',
        badgeColor: '#00f0ff',
        gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 114, 255, 0.15))',
        border: '#00f0ff',
        accentColor: '#00f0ff'
    },
    {
        id: 'dozer',
        tag: 'PHYSICS ARCADE',
        title: 'COIN DOZER 3D',
        desc: 'Precision physics pusher with giant solid bullion drops, prism gems, seismic table quakes, and tactical jackpot coin cascades.',
        path: '/arcade/dozer',
        badge: 'PHYSICS SIM',
        badgeColor: '#00ff88',
        gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.25), rgba(0, 180, 216, 0.15))',
        border: '#00ff88',
        accentColor: '#00ff88'
    }
];

const PREMIER_GAMES = [
    {
        id: 'merch-jump',
        title: 'MERCH JUMP',
        desc: 'The original iconic MerchBoy platform leaper & boost trampolines.',
        icon: <EmblemMerchJump />,
        category: 'retro',
        isOriginal: true,
        isHighlighted: true,
        gradient: 'linear-gradient(135deg, #00f0ff 0%, #ff0055 100%)',
        path: '/arcade/merch-jump'
    },
    {
        id: 'merch-defense',
        title: 'MERCH DEFENSE',
        desc: 'Our original cyber tower defense with multi-lane creeps & tactical turrets.',
        icon: <EmblemDefense />,
        category: 'action',
        isOriginal: true,
        gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
        path: '/arcade/merch-defense'
    },
    {
        id: 'bro-cannon',
        title: 'BRO CANNON',
        desc: 'Signature trajectory launch physics & maximum air distance scoring.',
        icon: <EmblemBroCannon />,
        category: 'action',
        isOriginal: true,
        isHighlighted: true,
        gradient: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        path: '/arcade/bro-cannon'
    },
    {
        id: 'crash',
        title: 'CYBER CRASH 2088',
        desc: 'Exponential starship trajectory with manual bail-out controls.',
        icon: <EmblemCrash />,
        category: 'casino',
        gradient: 'linear-gradient(135deg, #ff0055 0%, #ff5500 100%)',
        path: '/arcade/crash'
    },
    {
        id: 'slots',
        title: 'COSMIC SLOTS 777',
        desc: '3-reel progressive jackpot with vector neon 777s and gold bars.',
        icon: <EmblemSlots />,
        category: 'casino',
        gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
        path: '/arcade/slots'
    },
    {
        id: 'dozer',
        title: 'COIN DOZER 3D',
        desc: 'Real-time coin physics with seismic quakes and gold bullion.',
        icon: <EmblemDozer />,
        category: 'action',
        gradient: 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)',
        path: '/arcade/dozer'
    }
];

const Home = () => {
    const { getLevelInfo, userProfile, coins = 0, stats } = useGamification() || {};
    const { playBeep, playBoop } = useRetroSound();
    const { btcPrice = 0, priceChange24h = 0, chartData = [] } = useRealBtc();

    const { level = 1, progress = 0 } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
    const rank = level >= 20 ? "BLACK-OPS" : (level >= 10 ? "TOP-SECRET" : (level >= 5 ? "SECRET" : "CONFIDENTIAL"));

    const [heroIndex, setHeroIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);

    // Auto-advance hero carousel every 6 seconds unless paused
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % HERO_SHOWCASE.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered]);

    const activeHero = HERO_SHOWCASE[heroIndex];
    const isBtcUp = priceChange24h >= 0;
    const btcColor = isBtcUp ? '#00ffcc' : '#ff0055';

    // Mini Sparkline component
    const MiniSparkline = ({ data, color }) => {
        if (!data || data.length < 2) return null;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 40;
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '40px', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="homeBtcGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#homeBtcGrad)" stroke="none" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
            </svg>
        );
    };

    return (
        <div className="home-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>

            {/* CINEMATIC AAA HERO SHOWCASE SLIDER */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(12, 18, 30, 0.95), rgba(4, 7, 14, 0.98))',
                    border: `1.5px solid ${activeHero.border}`,
                    padding: '36px 32px',
                    marginBottom: '24px',
                    boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${activeHero.accentColor}25`,
                    transition: 'border 0.5s ease, box-shadow 0.5s ease'
                }}
            >
                {/* Background Cyber Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
                    {/* Top Tag & DEFCON Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: `${activeHero.accentColor}20`,
                            border: `1px solid ${activeHero.accentColor}`,
                            color: activeHero.accentColor,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.68rem',
                            fontWeight: '900',
                            fontFamily: 'monospace'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeHero.accentColor, boxShadow: `0 0 8px ${activeHero.accentColor}` }} />
                            {activeHero.tag}
                        </div>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: activeHero.badgeColor,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.68rem',
                            fontWeight: '900',
                            fontFamily: 'monospace'
                        }}>
                            {activeHero.badge}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeHero.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 style={{
                                margin: '0 0 10px 0',
                                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                                fontWeight: '900',
                                color: '#fff',
                                letterSpacing: '1.5px',
                                fontFamily: '"Orbitron", sans-serif',
                                textShadow: `0 0 25px ${activeHero.accentColor}55`
                            }}>
                                {activeHero.title}
                            </h1>

                            <p style={{
                                margin: '0 0 24px 0',
                                fontSize: '0.95rem',
                                color: '#94a3b8',
                                lineHeight: '1.6',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}>
                                {activeHero.desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Launch Buttons */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Link
                            to={activeHero.path}
                            onClick={() => playBeep?.()}
                            style={{
                                background: `linear-gradient(135deg, ${activeHero.accentColor}, #0072ff)`,
                                color: '#000',
                                padding: '12px 28px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: '900',
                                fontSize: '0.88rem',
                                letterSpacing: '0.5px',
                                boxShadow: `0 0 20px ${activeHero.accentColor}60`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: '"Orbitron", monospace'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span>PLAY NOW</span>
                        </Link>

                        <Link
                            to="/arcade"
                            onClick={() => playBoop?.()}
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '0.88rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: 'monospace'
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="4" />
                                <line x1="6" y1="12" x2="10" y2="12" />
                                <line x1="8" y1="10" x2="8" y2="14" />
                                <line x1="15" y1="13" x2="15.01" y2="13" />
                                <line x1="18" y1="11" x2="18.01" y2="11" />
                            </svg>
                            <span>ALL 27 GAMES</span>
                        </Link>
                    </div>
                </div>

                {/* Hero Slide Indicators & Prev/Next Arrow Controls */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 3
                }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {HERO_SHOWCASE.map((h, i) => (
                            <button
                                key={h.id}
                                onClick={() => { setHeroIndex(i); playBoop?.(); }}
                                style={{
                                    width: i === heroIndex ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: i === heroIndex ? activeHero.accentColor : '#475569',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: i === heroIndex ? `0 0 10px ${activeHero.accentColor}` : 'none'
                                }}
                                title={h.title}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => {
                                setHeroIndex((heroIndex - 1 + HERO_SHOWCASE.length) % HERO_SHOWCASE.length);
                                playBoop?.();
                            }}
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            title="Previous Showcase"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                setHeroIndex((heroIndex + 1) % HERO_SHOWCASE.length);
                                playBoop?.();
                            }}
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            title="Next Showcase"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* LIVE PULSE TICKER: REAL BITCOIN SPOT + DEFCON PROGRESSIVE JACKPOT */}
            <div style={{
                background: '#0a0d16',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                marginBottom: '28px',
                padding: '10px 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'flex',
                fontFamily: 'monospace',
                fontSize: '0.82rem'
            }}>
                <motion.div
                    animate={{ x: [0, -1200] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                    style={{ display: 'flex', gap: '40px', color: '#94a3b8', alignItems: 'center' }}
                >
                    {[...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f7931a', display: 'inline-block', boxShadow: '0 0 6px #f7931a' }}></span>
                                <strong style={{ color: '#fff' }}>BTC/USD ORACLE:</strong>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>${(btcPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span style={{ color: btcColor, fontWeight: 'bold' }}>({isBtcUp ? '+' : ''}{(priceChange24h || 0).toFixed(2)}%)</span>
                            </span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                DEFCON 1 JACKPOT: +1,482,900 CP
                            </span>
                            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>
                                27 ARCADE TITLES LIVE
                            </span>
                            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                                1,480+ OPERATORS ONLINE
                            </span>
                            <span style={{ color: '#ff007f', fontWeight: 'bold' }}>
                                THE BUNKER MULTIPLAYER OPEN
                            </span>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* PREMIER ARCADE SPOTLIGHT (16:9 Cinematic Game Cards) */}
            <div style={{ marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }}></span>
                        <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1.5px', fontFamily: '"Orbitron", monospace' }}>
                            PREMIER SPOTLIGHT
                        </span>
                    </div>
                    <Link to="/arcade" style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'monospace' }}>
                        VIEW ALL 27 TITLES &rarr;
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px'
                }}>
                    {PREMIER_GAMES.map((game) => (
                        <Link
                            key={game.id}
                            to={game.path}
                            style={{ textDecoration: 'none', display: 'flex', width: '100%', WebkitTapHighlightColor: 'transparent' }}
                        >
                            <CinematicGameCard
                                game={game}
                                highScore={stats?.[`${game.id}HighScore`] || 0}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            {/* HOLOGRAPHIC BENTO ACTION NEXUS */}
            <motion.div className="dashboard-grid" variants={container} initial="hidden" animate="show" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                {/* 1. OPERATOR CLASSIFIED DOSSIER CARD */}
                <motion.div variants={item}>
                    <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #0e1525, #070a12)', border: '1px solid rgba(0, 240, 255, 0.25)', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ position: 'relative', width: '68px', height: '68px', transform: 'translateZ(10px)' }}>
                                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: -5, width: '78px', height: '78px', transform: 'rotate(-90deg)' }}>
                                    <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="5" fill="none" />
                                    <circle cx="50" cy="50" r="45" stroke="#00f0ff" strokeWidth="5" fill="none" strokeDasharray="283" strokeDashoffset={283 - (283 * progress / 100)} style={{ transition: 'stroke-dashoffset 1s' }} />
                                </svg>
                                <img src={userProfile?.avatar || "/assets/skins/face_default.png"} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #000' }} alt="Avatar" />
                            </div>

                            <div style={{ transform: 'translateZ(20px)' }}>
                                <div style={{ color: '#64748b', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 'bold' }}>OPERATOR DOSSIER</div>
                                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#fff' }}>{userProfile?.name || "AGENT-770"}</div>
                                <div style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: '900', fontFamily: 'monospace' }}>
                                    {rank} &bull; LVL {level}
                                </div>
                            </div>
                        </div>

                        {/* Funds Readout & Clearance Action */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '16px', transform: 'translateZ(10px)' }}>
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px' }}>ACTIVE VAULT</span>
                                <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v12M8 10h8" />
                                    </svg>
                                    {(coins || 0).toLocaleString()} CP
                                </span>
                            </div>

                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-clearance'))}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 114, 255, 0.15))',
                                    border: '1px solid #00f0ff',
                                    color: '#00f0ff',
                                    borderRadius: '12px',
                                    padding: '8px 14px',
                                    fontSize: '0.75rem',
                                    fontWeight: '900',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '7px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)',
                                    fontFamily: '"Orbitron", monospace'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>PENTAGON CLEARANCE DOSSIER</span>
                            </button>
                        </div>
                    </TiltCard>
                </motion.div>

                {/* 2. TACTICAL DESTINATION PILLS */}
                <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <Link to="/bunker" style={{ textDecoration: 'none' }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.2), rgba(255, 0, 255, 0.2))', border: '1px solid #ff0055', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: '16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff0055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '6px' }}>
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>THE BUNKER</h3>
                            <div style={{ fontSize: '0.62rem', color: '#ff88aa', marginTop: '2px' }}>MULTIPLAYER LOBBY</div>
                        </TiltCard>
                    </Link>

                    <Link to="/pocketbro" style={{ textDecoration: 'none' }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(16, 24, 40, 0.9))', border: '1px solid #00f0ff', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: '16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '6px' }}>
                                <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
                                <circle cx="9" cy="10" r="1" fill="#00f0ff" />
                                <circle cx="15" cy="10" r="1" fill="#00f0ff" />
                            </svg>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>POCKET BRO</h3>
                            <div style={{ fontSize: '0.62rem', color: '#67e8f9', marginTop: '2px' }}>CYBER COMPANION</div>
                        </TiltCard>
                    </Link>

                    <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(16, 24, 40, 0.9))', border: '1px solid #ffd700', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: '16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '6px' }}>
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 22h16" />
                                <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                                <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                            </svg>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>RANKINGS</h3>
                            <div style={{ fontSize: '0.62rem', color: '#fde047', marginTop: '2px' }}>LEADERBOARD</div>
                        </TiltCard>
                    </Link>

                    <Link to="/vault" style={{ textDecoration: 'none' }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(16, 24, 40, 0.9))', border: '1px solid #00ff88', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: '16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '6px' }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>THE VAULT</h3>
                            <div style={{ fontSize: '0.62rem', color: '#86efac', marginTop: '2px' }}>SECURE INVENTORY</div>
                        </TiltCard>
                    </Link>
                </motion.div>

                {/* 3. LIVE BITCOIN ORACLE CARD */}
                <motion.div variants={item}>
                    <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #121928, #070b14)', border: '1px solid #2d2d42', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #28283a', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffcc', display: 'inline-block', boxShadow: '0 0 8px #00ffcc' }}></span>
                                <div style={{ color: '#f7931a', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>BITCOIN ORACLE</div>
                            </div>
                            <Link to="/exchange" style={{ background: '#f7931a', color: '#000', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.68rem', fontWeight: '900' }}>EXCHANGE</Link>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '1px' }}>BTC / USD SPOT</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fff', letterSpacing: '1px', marginTop: '2px', fontFamily: 'monospace' }}>
                                ${(btcPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ color: btcColor, fontSize: '0.8rem', fontWeight: 'bold', marginTop: '2px', fontFamily: 'monospace' }}>
                                {isBtcUp ? '▲' : '▼'} {Math.abs(priceChange24h || 0).toFixed(2)}% (24H)
                            </div>
                        </div>

                        {/* Sparkline */}
                        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                            <MiniSparkline data={chartData} color={btcColor} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: '#64748b', fontSize: '0.62rem' }}>
                                <span>24H SATELLITE ORACLE</span>
                                <span>LIVE</span>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>

                {/* 4. THE BUTTON (GLOBAL SOCIAL EXPERIMENT) */}
                <motion.div variants={item}>
                    <TheButton />
                </motion.div>

            </motion.div>

            <SponsorStationModal isOpen={showSponsorModal} onClose={() => setShowSponsorModal(false)} />
        </div>
    );
};

export default Home;
