import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LeaderboardTable from '../components/LeaderboardTable';
import { useGamification } from '../context/GamificationContext';
import ArcadeHero from '../components/ArcadeHero';

const DailyZone = () => {
    const { dailyState, claimDailyLogin, claimQuest } = useGamification() || {};
    // Safety check if context not ready
    if (!dailyState) return null;

    const { lastCheckIn, streak, quests } = dailyState;
    const today = new Date().toISOString().split('T')[0];
    const canCheckIn = lastCheckIn !== today;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #2a0845 0%, #6441a5 100%)',
            borderRadius: '20px', padding: '20px',
            marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto',
            border: '2px solid #a64bf4', boxShadow: '0 0 20px rgba(166, 75, 244, 0.4)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>📅 DAILY ZONE</h2>
                    <p style={{ margin: 0, color: '#e0c3fc' }}>Streak: {streak} Days 🔥</p>
                </div>
                <button
                    onClick={claimDailyLogin}
                    disabled={!canCheckIn}
                    style={{
                        background: canCheckIn ? '#00FA9A' : '#555',
                        color: canCheckIn ? '#000' : '#888',
                        border: 'none', padding: '10px 25px', borderRadius: '50px',
                        fontWeight: 'bold', fontSize: '1.1rem', cursor: canCheckIn ? 'pointer' : 'default',
                        transform: canCheckIn ? 'scale(1.05)' : 'scale(1)',
                        transition: '0.2s'
                    }}
                >
                    {canCheckIn ? 'CLAIM 100 🪙' : 'CHECKED IN ✅'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {quests.map(q => {
                    const isDone = q.progress >= q.target;
                    return (
                        <div key={q.id} style={{
                            background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px',
                            border: q.claimed ? '1px solid #00FA9A' : '1px solid rgba(255,255,255,0.1)',
                            opacity: q.claimed ? 0.6 : 1
                        }}>
                            <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>{q.desc}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: 'gold' }}>+{q.reward} 🪙</span>
                                <span style={{ fontSize: '0.8rem', color: '#fff' }}>{Math.min(q.progress, q.target)}/{q.target}</span>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min((q.progress / q.target) * 100, 100)}%`,
                                    height: '100%',
                                    background: isDone ? '#00FA9A' : '#a64bf4',
                                    transition: 'width 0.5s'
                                }}></div>
                            </div>

                            <button
                                onClick={() => claimQuest(q.id)}
                                disabled={!isDone || q.claimed}
                                style={{
                                    width: '100%', padding: '5px',
                                    background: q.claimed ? 'transparent' : (isDone ? '#00FA9A' : '#333'),
                                    color: q.claimed ? '#00FA9A' : (isDone ? 'black' : '#888'),
                                    border: q.claimed ? '1px solid #00FA9A' : 'none',
                                    borderRadius: '5px', fontWeight: 'bold', cursor: (isDone && !q.claimed) ? 'pointer' : 'default'
                                }}
                            >
                                {q.claimed ? 'COMPLETED' : (isDone ? 'CLAIM' : 'IN PROGRESS')}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('fishing');

    return (
        <div className="page-enter" style={{
            textAlign: 'center',
            padding: '20px',
            width: '100%',
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom, #050510, #1a0b2e)',
            minHeight: '100vh',
            color: 'white'
        }}>
            <ArcadeHero />

            <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Responsive Text
                textShadow: '3px 3px #ff0055',
                marginBottom: '10px'
            }}>
                ARCADE ZONE
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', marginBottom: '40px' }}>Select a game to start playing!</p>

            {/* DAILY ZONE */}
            <DailyZone />

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
