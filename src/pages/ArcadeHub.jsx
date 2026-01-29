
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LiveFeed from '../components/LiveFeed';
import LeaderboardTable from '../components/LeaderboardTable';
import { useGamification } from '../context/GamificationContext';

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
        desc: 'Sky High Streetwear.',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        icon: '👟',
        colSpan: 1, // Debug: changed to 1
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
        desc: 'Smash pixel bricks.',
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
        id: 'flappy',
        title: 'FLAPPY MASCOT',
        desc: 'Don\'t crash.',
        gradient: 'linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)',
        icon: '🦅',
        colSpan: 1,
        leaderboardId: 'flappy_mascot'
    }
];

const getHighScore = (id) => {
    const key = `${id} HighScore`;
    let storageKey = '';
    if (id === 'snake') storageKey = 'snakeHighScore';
    if (id === 'whack') storageKey = 'whackHighScore';
    if (id === 'memory') storageKey = 'memoryHighScore';
    if (id === 'galaxy') storageKey = 'galaxyHighScore';
    if (id === 'brick') storageKey = 'brickHighScore';
    if (id === 'flappy') storageKey = 'flappyHighScore';
    if (id === 'fishing') storageKey = 'fishingHighScore';
    if (id === 'face-runner') storageKey = 'faceRunnerHighScore';

    return localStorage.getItem(storageKey) || 0;
};

const ArcadeHub = () => {
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('crazy_fishing');

    return (
        <div className="page-enter" style={{
            textAlign: 'center',
            padding: '20px',
            width: '100%',
            boxSizing: 'border-box',
            paddingBottom: '120px' // Space for Dock
        }}>
            <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Responsive Text
                textShadow: '3px 3px #ff0055',
                marginBottom: '10px'
            }}>
                ARCADE ZONE
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', marginBottom: '40px' }}>Select a game to start playing!</p>

            {/* Live Global Feed */}
            <LiveFeed />

            <div style={{ marginBottom: '30px' }}>
                <Link to="/shop" style={{
                    background: '#FFD700', color: 'black', padding: '15px 40px',
                    borderRadius: '50px', textDecoration: 'none', fontWeight: '900',
                    fontSize: '1.2rem', boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                    display: 'inline-flex', alignItems: 'center', gap: '10px'
                }}>
                    <span>🛒</span> VISIT GLOBAL SHOP
                </Link>
            </div>

            {/* Pocket Bro Apartment (Top Feature) */}
            <div className="bento-card" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                padding: '30px',
                marginBottom: '40px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                border: '4px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: '#006064' }}>POCKET BRO'S ROOM</h2>
                <p style={{ color: '#555', marginBottom: '20px' }}>Your digital companion lives here.</p>
                <Link to="/pocketbro" className="squishy-btn" style={{
                    background: '#0ea5e9', color: 'white', padding: '15px 40px',
                    borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.2rem',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.4)'
                }}>
                    ENTER ROOM 🚪
                </Link>
            </div>

            {/* BENTO GRID GAMES */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                gap: '20px',
                padding: '10px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {games.map(game => (
                    <Link to={`/arcade/${game.id}`} key={game.id} className="bento-card game-card-hover" style={{
                        background: game.gradient,
                        padding: '25px',
                        textDecoration: 'none',
                        color: 'white',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        minHeight: '220px',
                        gridColumn: game.colSpan === 2 ? 'span 2' : 'span 1',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                    }}>
                        {/* BADGES */}
                        {(game.id === 'slots') && (
                            <div style={{
                                position: 'absolute', top: 15, right: 15,
                                background: 'white', color: 'black',
                                padding: '4px 10px', borderRadius: '20px',
                                fontSize: '0.7rem', fontWeight: '900', zIndex: 5,
                                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                            }}>
                                HOT 🔥
                            </div>
                        )}
                        {(game.id === 'fishing') && (
                            <div style={{
                                position: 'absolute', top: 15, right: 15,
                                background: 'rgba(0,0,0,0.6)', color: '#00C6FF',
                                padding: '4px 10px', borderRadius: '20px',
                                fontSize: '0.7rem', fontWeight: '900', zIndex: 5,
                                border: '1px solid #00C6FF'
                            }}>
                                DAILY 🎣
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.8rem',
                                    fontWeight: '900',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    lineHeight: 1,
                                    fontFamily: '"Orbitron", sans-serif', // V3 Font
                                    letterSpacing: '1px'
                                }}>
                                    {game.title}
                                </h2>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '1rem', fontWeight: '500' }}>{game.desc}</p>
                            </div>
                            {/* <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))' }}>{game.icon}</span> */}
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
                                background: 'rgba(0, 0, 0, 0.4)',
                                padding: '5px 12px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                backdropFilter: 'blur(5px)'
                            }}>
                                🏆 <span style={{ color: 'var(--neon-gold)', textShadow: '0 0 5px var(--neon-gold)' }}>{getHighScore(game.id)}</span>
                            </div>

                            <div style={{
                                background: 'white', color: 'black',
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem',
                                boxShadow: '0 0 15px rgba(255,255,255,0.4)'
                            }}>
                                ▶
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* LEADERBOARDS SECTION */}
            <div style={{
                marginTop: '60px',
                padding: '20px',
                background: '#0f0f1b',
                borderTop: '2px solid #333',
                width: '100%',
                maxWidth: '800px',
                margin: '60px auto 20px auto',
                borderRadius: '20px'
            }}>
                <h2 style={{ color: 'gold', marginBottom: '20px' }}>🌍 GLOBAL LEADERBOARDS</h2>

                {/* Game Selector */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {games.map(g => (
                        <button
                            key={g.id}
                            onClick={() => setSelectedLeaderboard(g.leaderboardId)}
                            style={{
                                background: selectedLeaderboard === g.leaderboardId ? 'white' : 'rgba(255,255,255,0.1)',
                                color: selectedLeaderboard === g.leaderboardId ? 'black' : 'white',
                                border: selectedLeaderboard === g.leaderboardId ? `2px solid #FFD700` : '1px solid #333',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
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
