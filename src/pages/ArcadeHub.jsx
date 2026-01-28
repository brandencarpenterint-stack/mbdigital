import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LeaderboardTable from '../components/LeaderboardTable';

const games = [
    {
        id: 'snake',
        title: 'NEON SNAKE',
        description: 'Eat the bits, grow longer, don\'t crash!',
        color: '#00ffaa'
    },
    {
        id: 'whack',
        title: 'WHACK-A-MOLE',
        description: 'Bonk the moles before they hide!',
        color: '#ff0055'
    },
    {
        id: 'memory',
        title: 'MEMORY MATCH',
        description: 'Find the matching pairs!',
        color: '#ffff00'
    },
    {
        id: 'galaxy',
        title: 'GALAXY DEFENDER',
        description: 'Blaken aliens with your ship!',
        color: '#00ccff'
    },
    {
        id: 'brick',
        title: 'NEON BRICKS',
        description: 'Smash pixel bricks!',
        color: '#cc00ff'
    },
    {
        id: 'flappy',
        title: 'FLAPPY MASCOT',
        description: 'Tap to fly!',
        color: '#ff9900'
    },
    {
        id: 'fishing',
        title: 'CRAZY FISHING',
        description: 'Catch the Mer-Logo!',
        color: '#00ccff'
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

    return localStorage.getItem(storageKey) || 0;
};

const ArcadeHub = () => {
    return (
        <div className="page-enter" style={{ textAlign: 'center', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Responsive Text
                color: 'var(--accent-color)',
                textShadow: '3px 3px #ff0055',
                marginBottom: '10px'
            }}>
                ARCADE ZONE
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>Select a game to start playing!</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Lower min width for smaller phones
                gap: '20px',
                padding: '10px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {games.map(game => (
                    <div key={game.id} style={{
                        background: '#0f0f1b',
                        border: `4px solid ${game.color}`,
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: `0 0 20px ${game.color}40`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '300px'
                    }}>
                        <h2 style={{ color: game.color, fontSize: '2rem', margin: '10px 0' }}>{game.title}</h2>
                        <div style={{
                            fontSize: '1.2rem',
                            color: '#fff',
                            marginBottom: '10px',
                            border: `1px solid ${game.color}`,
                            padding: '5px 10px',
                            borderRadius: '5px'
                        }}>
                            High Score: {getHighScore(game.id)}
                        </div>
                        <div style={{
                            width: '100%',
                            height: '120px',
                            background: '#000',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #333'
                        }}>
                            <span style={{ fontSize: '3rem' }}>
                                {game.id === 'snake' ? '🐍' :
                                    game.id === 'whack' ? '🔨' :
                                        game.id === 'fishing' ? '🎣' : '🎮'}
                            </span>
                        </div>
                        <p>{game.description}</p>
                        <Link to={`/arcade/${game.id}`} style={{
                            marginTop: '20px',
                            padding: '15px 40px',
                            background: game.color,
                            color: game.id === 'memory' ? 'black' : 'black',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            textTransform: 'uppercase'
                        }}>
                            PLAY NOW
                        </Link>
                    </div>
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
                            onClick={() => setSelectedLeaderboard(g.id)}
                            style={{
                                background: selectedLeaderboard === g.id ? g.color : '#333',
                                color: selectedLeaderboard === g.id ? 'black' : 'white',
                                border: 'none',
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
