/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LiveFeed from '../components/LiveFeed';
import LeaderboardTable from '../components/LeaderboardTable';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import PocketPet from '../components/pocket-pet/PocketPet';
import useRetroSound from '../hooks/useRetroSound';
import './Home.css'; // Shared styles for dashboard grid

const games = [
    {
        id: 'slots',
        title: 'COSMIC SLOTS',
        desc: 'Spin to WIN BIG!',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', // Gold
        icon: '🎰',
        colSpan: 2, // Highlight it!
        leaderboardId: 'cosmic_slots'
    },
    {
        id: 'face-runner',
        title: 'FACE WARP',
        desc: '3D Tunnel Chaos',
        gradient: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
        icon: '🌀',
        colSpan: 2,
        leaderboardId: 'face_runner'
    },
    {
        id: 'merch-jump',
        title: 'MERCH JUMP',
        desc: 'Sky High.',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        icon: '👟',
        colSpan: 1,
        leaderboardId: 'merch_jump'
    },
    {
        id: 'fishing',
        title: 'CRAZY FISHING',
        desc: 'Catch the Mer-Logo!',
        gradient: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
        icon: '🎣',
        colSpan: 1,
        leaderboardId: 'crazy_fishing'
    },
    {
        id: 'whack',
        title: 'WHACK-A-MOLE',
        desc: 'Bonk the moles!',
        gradient: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
        icon: '🔨',
        colSpan: 1,
        leaderboardId: 'whack_a_mole'
    },
    {
        id: 'snake',
        title: 'NEON SNAKE',
        desc: 'Classic vibes.',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        icon: '🐍',
        colSpan: 1,
        leaderboardId: 'neon_snake'
    },
    {
        id: 'galaxy',
        title: 'GALAXY DEFENDER',
        desc: 'Pew pew pew!',
        gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        icon: '🚀',
        colSpan: 1,
        leaderboardId: 'galaxy_defender'
    },
    {
        id: 'brick',
        title: 'NEON BRICKS',
        desc: 'Smash pixels.',
        gradient: 'linear-gradient(135deg, #da22ff 0%, #9733ee 100%)',
        icon: '🧱',
        colSpan: 1,
        leaderboardId: 'neon_bricks'
    },
    {
        id: 'memory',
        title: 'MEMORY MATCH',
        desc: 'Train your brain.',
        gradient: 'linear-gradient(135deg, #f79d00 0%, #64f38c 100%)',
        icon: '🧠',
        colSpan: 1,
        leaderboardId: 'memory_match'
    },
    {
        id: 'sub-hunter',
        title: 'VOID HUNTER',
        desc: 'Destroy the Subs!',
        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        icon: '⚓',
        colSpan: 1,
        leaderboardId: 'sub_hunter'
    },
    {
        id: 'flappy',
        title: 'FLAPPY MASCOT',
        desc: 'Don\'t crash.',
        gradient: 'linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)',
        icon: '🦅',
        colSpan: 1,
        leaderboardId: 'flappy_mascot'
    }
];

const getHighScore = (id, stats) => {
    if (!stats) return 0;
    if (id === 'snake') return stats.snakeHighScore || 0;
    if (id === 'whack') return stats.whackHighScore || 0;
    if (id === 'memory') return stats.memoryHighScore || 0;
    if (id === 'galaxy') return stats.galaxyHighScore || 0;
    if (id === 'brick') return stats.brickHighScore || 0;
    if (id === 'flappy') return stats.flappyHighScore || 0;
    if (id === 'fishing') return stats.crazyFishingHighScore || 0;
    if (id === 'face-runner') return stats.faceRunnerHighScore || 0;
    if (id === 'slots') return 'JACKPOT';
    if (id === 'merch-jump') return stats.merchJumpHighScore || 0;
    return 0;
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
};

const ArcadeHub = () => {
    const { stats, shopState, userProfile } = useGamification() || {};
    const { stats: broStats, getMood } = usePocketBro() || {};
    const { playBoop } = useRetroSound();

    const equippedSkin = shopState?.equipped?.pocketbro || null;
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('crazy_fishing');
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const displayName = userProfile?.name || 'OPERATOR';

    return (
        <div className="page-enter" style={{
            textAlign: 'center',
            padding: '20px',
            width: '100%',
            boxSizing: 'border-box',
            paddingBottom: '120px'
        }}>

            {/* HERO HEADER */}
            <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                <p style={{ color: 'var(--neon-blue)', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '5px' }}>
                    {greeting.toUpperCase()}, {displayName}
                </p>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                    textShadow: '0 0 20px var(--neon-pink)',
                    margin: '0',
                    fontFamily: '"Orbitron", sans-serif',
                }}>
                    ARCADE <span style={{ color: 'var(--neon-pink)' }}>ZONE</span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: '#aaa', marginTop: '10px' }}>
                    Ready to play? Select a game console below.
                </p>
            </div>

            {/* LIVE TICKER / FEED */}
            <div style={{ maxWidth: '800px', margin: '0 auto 40px auto' }}>
                <LiveFeed />
            </div>

            <div style={{ marginBottom: '40px' }}>
                <Link to="/shop" style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                    color: 'black', padding: '15px 40px',
                    borderRadius: '50px', textDecoration: 'none', fontWeight: '900',
                    fontSize: '1.2rem', boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)',
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    border: '2px solid white'
                }}>
                    <span>🛒</span> VISIT GLOBAL SHOP
                </Link>
            </div>

            {/* POCKET BRO BANNER */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    padding: '20px', marginBottom: '50px', maxWidth: '800px', margin: '0 auto 50px auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    border: '1px solid #555', position: 'relative', overflow: 'hidden'
                }}
            >
                <div style={{ position: 'relative', height: '100px', width: '100px', marginBottom: '10px' }}>
                    <PocketPet
                        stage={broStats?.stage || 'EGG'}
                        type={broStats?.type || 'SOOT'}
                        mood={getMood()}
                        isSleeping={broStats?.isSleeping}
                        skin={equippedSkin}
                    />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: 'white', zIndex: 2 }}>POCKET BRO LINKED</h2>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '0.8rem', color: '#aaa', marginBottom: '15px', zIndex: 2 }}>
                    <span>❤️ {Math.floor(broStats?.happy || 0)}% HAPPY</span>
                    <span>⚡ {Math.floor(broStats?.xp || 0)} XP</span>
                </div>
                <Link to="/pocketbro" style={{
                    background: 'var(--neon-blue)', color: 'black', padding: '10px 30px',
                    borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem',
                    boxShadow: '0 0 15px var(--neon-blue)', zIndex: 2
                }}>
                    ENTER ROOM 🚪
                </Link>
                {/* BG Effect */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at center, transparent 0%, #000 100%)',
                    zIndex: 1, opacity: 0.8
                }}></div>
            </motion.div>

            {/* STAGGERED GRID */}
            <motion.div
                className="dashboard-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{
                    padding: '10px',
                    maxWidth: '1200px', margin: '0 auto', width: '100%'
                }}
            >
                {games.map(game => (
                    <motion.div
                        key={game.id}
                        variants={itemVariants}
                        style={{ gridColumn: game.colSpan === 2 ? 'span 2' : 'span 1' }}
                    >
                        <Link
                            to={`/arcade/${game.id}`}
                            className="bento-card game-card-hover"
                            onMouseEnter={() => playBoop()}
                            style={{
                                background: game.gradient,
                                padding: '25px', textDecoration: 'none', color: 'white',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                minHeight: '220px', height: '100%',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* BADGES */}
                            {(game.id === 'slots') && (
                                <div style={{
                                    position: 'absolute', top: 15, right: 15,
                                    background: 'white', color: 'black',
                                    padding: '4px 10px', borderRadius: '20px',
                                    fontSize: '0.7rem', fontWeight: '900', zIndex: 5,
                                    boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                                }}>HOT 🔥</div>
                            )}
                            {(game.id === 'fishing') && (
                                <div style={{
                                    position: 'absolute', top: 15, right: 15,
                                    background: 'rgba(0,0,0,0.6)', color: '#00C6FF',
                                    padding: '4px 10px', borderRadius: '20px',
                                    fontSize: '0.7rem', fontWeight: '900', zIndex: 5,
                                    border: '1px solid #00C6FF'
                                }}>DAILY 🎣</div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <h2 style={{
                                        margin: 0, fontSize: '1.8rem', fontWeight: '900',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)', lineHeight: 1,
                                        fontFamily: '"Orbitron", sans-serif', letterSpacing: '1px'
                                    }}>
                                        {game.title}
                                    </h2>
                                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '1rem', fontWeight: '500' }}>{game.desc}</p>
                                </div>
                            </div>

                            {/* Overlay Decor (Giant Icon) */}
                            <div style={{
                                position: 'absolute', bottom: -10, right: -10,
                                fontSize: '9rem', opacity: 0.2, transform: 'rotate(-15deg)', pointerEvents: 'none'
                            }}>
                                {game.icon}
                            </div>

                            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.4)', padding: '5px 12px', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', gap: '5px', backdropFilter: 'blur(5px)'
                                }}>
                                    🏆 <span style={{ color: 'var(--neon-gold)' }}>{getHighScore(game.id, stats)}</span>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'white', color: 'black',
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.2rem', boxShadow: '0 0 15px rgba(255,255,255,0.4)'
                                    }}
                                >
                                    ▶
                                </motion.div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* LEADERBOARDS SECTION */}
            <div style={{
                marginTop: '80px', padding: '30px',
                background: 'rgba(15, 15, 27, 0.8)',
                border: '1px solid #333',
                maxWidth: '900px', margin: '80px auto 20px auto',
                borderRadius: '30px', backdropFilter: 'blur(10px)'
            }}>
                <h2 style={{ color: 'gold', marginBottom: '30px', fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px' }}>🌍 GLOBAL RANKINGS</h2>

                {/* Game Selector */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', scrollbarWidth: 'none' }}>
                    {games.map(g => (
                        <button
                            key={g.id}
                            onClick={() => setSelectedLeaderboard(g.leaderboardId)}
                            style={{
                                background: selectedLeaderboard === g.leaderboardId ? g.gradient : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                border: selectedLeaderboard === g.leaderboardId ? `none` : '1px solid #333',
                                padding: '10px 20px', borderRadius: '20px',
                                cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap',
                                transition: 'all 0.3s',
                                boxShadow: selectedLeaderboard === g.leaderboardId ? '0 0 15px rgba(255,255,255,0.2)' : 'none'
                            }}
                        >
                            {g.title}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LeaderboardTable gameId={selectedLeaderboard} />
                </div>
            </div>
        </div>
    );
};

export default ArcadeHub;
