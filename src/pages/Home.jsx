import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import DailyStash from '../components/DailyStash';

import { useSquad } from '../context/SquadContext';
import { usePocketBro } from '../context/PocketBroContext';

// Main Cards are now handled by CSS classes 'bento-card'
const BentoGrid = ({ children }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        paddingBottom: '100px'
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

            {/* HEADER */}
            <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
                <div className="mascot-float" style={{ marginBottom: '20px' }}>
                    <img src="/assets/boy_face.png" alt="Merchboy" style={{ width: '120px', height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(100, 100, 255, 0.3))' }} />
                </div>
                <h1 className="text-gradient" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>PLAYGROUND</h1>
                <p style={{ color: '#718096', fontSize: '1.1rem', marginTop: '10px' }}>Create • Play • Explore</p>
            </header>

            <BentoGrid>
                {/* 1. POCKET BRO (Tall Card) */}
                <div className="bento-card" style={{ gridRow: 'span 2', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ background: 'rgba(255,255,255,0.5)', padding: '5px 12px', borderRadius: '15px', fontSize: '0.8rem', color: '#006064', fontWeight: 'bold' }}>
                                LIVE STATUS
                            </span>
                        </div>
                        <div style={{ fontSize: '5rem', textAlign: 'center', margin: '40px 0', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))', animation: 'float 3s ease-in-out infinite' }}>
                            {getMood()}
                        </div>
                        <h2 style={{ color: '#0284c7', margin: 0, textAlign: 'center' }}>{stats.stage || 'EGG'}</h2>
                        <div style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 'bold', opacity: 0.8 }}>
                            Lvl {Math.floor(stats.xp / 100)}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                        <button onClick={feed} className="squishy-btn" style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 0 #0284c7' }}>
                            🍗 FEED
                        </button>
                        <Link to="/pocketbro" className="squishy-btn" style={{ background: 'white', color: '#0284c7', textDecoration: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center', boxShadow: '0 4px 0 #e0f2fe' }}>
                            VISIT
                        </Link>
                    </div>
                </div>

                {/* 2. DAILY DROP (Wide) */}
                <div className="bento-card" onClick={() => setShowDaily(true)} style={{
                    background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 30px'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#854d0e', fontSize: '1.5rem' }}>Daily Stash</h3>
                        <p style={{ margin: 0, color: '#a16207' }}>Tap to claim reward</p>
                    </div>
                    <div style={{ fontSize: '3rem', animation: 'wiggle 1s ease-in-out infinite' }}>🎁</div>
                </div>

                {/* 3. FEATURED GAME (Wide) */}
                <div className="bento-card" style={{
                    background: '#1a202c',
                    color: 'white',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <span style={{ color: '#f687b3', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>FEATURED</span>
                        <h2 style={{ fontSize: '2.5rem', margin: '5px 0', lineHeight: 1, background: 'linear-gradient(to right, #f687b3, #b794f4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            FACE RUNNER
                        </h2>
                        <Link to="/arcade/face-runner" style={{ display: 'inline-block', marginTop: '15px', background: 'white', color: 'black', padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none' }}>
                            PLAY NOW →
                        </Link>
                    </div>
                    <img src="/assets/arcade_cabinet.png" style={{ position: 'absolute', right: '-20px', bottom: '-40px', height: '240px', opacity: 0.8, transform: 'rotate(-10deg)' }} />
                </div>

                {/* 4. SHOP & RALLY (Split) */}
                <div className="bento-card" style={{ background: 'white', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ background: '#edf2f7', padding: '10px', borderRadius: '50%', fontSize: '1.5rem' }}>👕</div>
                        <div>
                            <h4 style={{ margin: 0 }}>The Shop</h4>
                            <a href="https://merchboy.shop" style={{ color: '#4299e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>Browse Gear</a>
                        </div>
                    </div>
                </div>

                <div className="bento-card" style={{ background: '#fff5f5', border: '1px solid #fed7d7', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#e53e3e', textAlign: 'center' }}>Team Rally</h4>
                    <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${neonPercent}%`, background: '#63b3ed' }}></div>
                        <div style={{ flex: 1, background: '#fc8181' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>
                        <span style={{ color: '#4299e1' }}>NEON</span>
                        <span style={{ color: '#f56565' }}>ZEN</span>
                    </div>
                </div>

            </BentoGrid>
        </div>
    );
};

export default Home;
