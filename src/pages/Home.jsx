import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import DailyStash from '../components/DailyStash';

import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';

const FeedCard = ({ children, style = {} }) => (
    <div style={{
        background: '#141414',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid #222',
        position: 'relative',
        overflow: 'hidden',
        ...style
    }}>
        {children}
    </div>
);

const Home = () => {
    const [showDaily, setShowDaily] = React.useState(false);
    const { squadScores, userSquad } = useSquad();
    const { stats, feed, getMood } = usePocketBro();

    // Squad Calcs
    const totalScore = squadScores ? (squadScores.NEON + squadScores.ZEN) : 100;
    const neonPercent = squadScores ? (squadScores.NEON / totalScore) * 100 : 50;

    return (
        <div className="home-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', paddingBottom: '100px' }}>
            {showDaily && <DailyStash onClose={() => setShowDaily(false)} />}

            {/* HEADER / FEED TITLE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#00af89' }}>PLAYGROUND</h1>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Have fun today! ☀️</div>
            </div>

            {/* 1. POCKET BRO STATUS CARD */}
            <FeedCard style={{ background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', color: '#006064', margin: 0 }}>POCKET BRO</h2>
                        <p style={{ color: '#00838F', fontSize: '0.9rem', marginTop: '5px' }}>
                            Lvl {stats.stage || 'EGG'} • {Math.round(stats.energy || 0)}% Energy
                        </p>
                    </div>
                    <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }}>
                        {getMood()}
                    </div>
                </div>

                {/* Quick Action */}
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => feed()}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                            background: '#00ACC1', color: 'white', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        🍗 FEED
                    </button>
                    <Link to="/pocketbro" style={{
                        flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #00ACC1',
                        background: 'transparent', color: '#006064', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none'
                    }}>
                        VISIT ROOM
                    </Link>
                </div>
            </FeedCard>

            {/* 2. SQUAD RALLY CARD */}
            <FeedCard style={{ background: '#f0f4f8', border: '1px solid #dae1e7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <span style={{ color: '#00f2ff' }}>NEON {squadScores?.NEON.toLocaleString()}</span>
                    <span style={{ color: '#ff0055' }}>{squadScores?.ZEN.toLocaleString()} ZEN</span>
                </div>

                {/* Bar */}
                <div style={{ height: '15px', background: '#fff', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid #eee' }}>
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, #00f2ff 50%, #ff0055 50%)',
                        position: 'absolute', top: 0, left: 0
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, bottom: 0,
                            width: '4px', background: 'white',
                            left: `${neonPercent}%`,
                            boxShadow: '0 0 10px white',
                            transition: 'left 1s ease'
                        }}></div>
                    </div>
                </div>

                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#555', fontWeight: '600' }}>
                    Team Rally is Live! Play games to help your team! 🏆
                </div>
            </FeedCard>

            {/* 3. DAILY DROP CARD */}
            <FeedCard style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: 'black',
                border: 'none',
                cursor: 'pointer'
            }}>
                <div onClick={() => setShowDaily(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, textTransform: 'uppercase' }}>Daily Stash</h2>
                        <p style={{ margin: 0, opacity: 0.8 }}>Tap to open your supply crate</p>
                    </div>
                    <div style={{ fontSize: '2.5rem', animation: 'shake 2s infinite' }}>🎁</div>
                </div>
            </FeedCard>

            {/* 4. FEATURED GAME: FACE RUNNER */}
            <FeedCard style={{ padding: 0, height: '200px', background: 'black' }}>
                <img
                    src="/assets/arcade_cabinet.png"
                    style={{ position: 'absolute', right: '-20px', bottom: '-20px', height: '180px', opacity: 0.5 }}
                    alt="Arcade"
                />
                <div style={{ position: 'relative', zIndex: 1, padding: '20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ background: '#ff0055', color: 'white', display: 'inline-block', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            NEW GAME
                        </div>
                        <h2 style={{ color: 'white', margin: 0, textShadow: '2px 2px #ff0055' }}>FACE RUNNER</h2>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Go infinite.</p>
                    </div>

                    <Link to="/arcade/face-runner" style={{
                        background: 'white', color: 'black', textDecoration: 'none',
                        padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold',
                        display: 'inline-block', alignSelf: 'flex-start'
                    }}>
                        PLAY NOW
                    </Link>
                </div>
            </FeedCard>

            {/* 5. SHOP FEATURE */}
            <FeedCard style={{ background: '#fff', color: 'black' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontSize: '3rem' }}>👕</div>
                    <div>
                        <h3 style={{ margin: 0 }}>Fresh Merch</h3>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Get the physical gear.</p>
                        <a href="https://merchboy.shop" style={{ color: 'blue', fontWeight: 'bold' }}>Visit Shop →</a>
                    </div>
                </div>
            </FeedCard>

            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px', opacity: 0.3 }}>
                <p>v2.0.0 "FLUX"</p>
            </div>
        </div>
    );
};

export default Home;
