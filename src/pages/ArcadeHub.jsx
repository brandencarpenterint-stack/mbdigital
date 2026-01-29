import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        title: 'FACE RUNNER',
        desc: 'Infinite Glitch Runner',
        gradient: 'linear-gradient(135deg, #FF0080 0%, #FF8C00 100%)',
        icon: '🏃',
        colSpan: 2,
        leaderboardId: 'face_runner'
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
    const key = `${id}HighScore`;
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

            {/* DAILY ZONE MOVED TO HEADER */}
            {/* <DailyZone /> */}

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // Wider cards
                gap: '25px',
                padding: '10px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {games.map(game => (
                    <Link to={`/arcade/${game.id}`} key={game.id} className="bento-card" style={{
                        background: game.gradient,
                        padding: '30px',
                        textDecoration: 'none',
                        color: 'white',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        minHeight: '260px', // Taller
                        gridColumn: game.colSpan === 2 ? 'span 2' : 'span 1',
                        border: '4px solid rgba(255,255,255,0.3)', // Tactile border
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)', // Lifted look
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '2.2rem',
                                    fontWeight: '900',
                                    textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                                    lineHeight: 1.1
                                }}>
                                    {game.title}
                                </h2>
                                <p style={{ margin: '10px 0 0 0', opacity: 1, fontSize: '1.2rem', fontWeight: '500' }}>{game.desc}</p>
                            </div>
                            <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))' }}>{game.icon}</span>
                        </div>

                        {/* Overlay Decor */}
                        <div style={{
                            position: 'absolute', bottom: -20, right: -20,
                            fontSize: '8rem', opacity: 0.1, transform: 'rotate(-20deg)', pointerEvents: 'none'
                        }}>
                            {game.icon}
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '8px 15px',
                                borderRadius: '15px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '5px'
                            }}>
                                🏆 <span style={{ color: '#fff' }}>{getHighScore(game.id)}</span>
                            </div>
                            <button className="squishy-btn" style={{
                                background: 'white',
                                color: 'black',
                                padding: '12px 30px',
                                borderRadius: '50px',
                                border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '900',
                                fontSize: '1.2rem',
                                boxShadow: '0 5px 0 rgba(0,0,0,0.2)',
                                cursor: 'pointer'
                            }}>
                                PLAY
                            </button>
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
