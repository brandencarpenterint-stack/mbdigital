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
    const { squadScores, userSquad } = useSquad();
    const { stats, feed, getMood } = usePocketBro();

    // Squad Calcs
    const totalScore = squadScores ? (squadScores.NEON + squadScores.ZEN) : 100;
    const neonPercent = squadScores ? (squadScores.NEON / totalScore) * 100 : 50;

    return (
        <div className="home-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', paddingBottom: '100px' }}>
            {/* HEADER / FEED TITLE */}
            <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
                <div className="mascot-float" style={{ marginBottom: '20px' }}>
                    <img src="/assets/boy_face.png" alt="Merchboy" style={{ width: '120px', height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(100, 100, 255, 0.3))' }} />
                </div>
                <h1 className="text-gradient" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>PLAYGROUND</h1>
                <p style={{ color: '#718096', fontSize: '1.1rem', marginTop: '10px' }}>Create • Play • Explore</p>
            </header>

            <BentoGrid>
                {/* 1. FEATURED GAME (Her0) - COSMIC SLOTS */}
                <div className="bento-card" style={{
                    gridColumn: '1 / -1', // Full width
                    background: 'linear-gradient(135deg, #120c1f 0%, #4c1d95 100%)', // Dark Purple
                    color: 'white',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '280px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px',
                    border: '2px solid #ffd700',
                    boxShadow: '0 0 30px rgba(138, 43, 226, 0.4)'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <span style={{ color: '#ffd700', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem' }}>NEW FEATURE</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', margin: '5px 0', lineHeight: 1, color: '#fff', textShadow: '0 0 20px #d946ef' }}>
                            COSMIC SLOTS
                        </h2>
                        <p style={{ color: '#e9d5ff', maxWidth: '70%', margin: '10px 0 20px 0', fontSize: '1.2rem' }}>8-Payline Jackpot Machine. Spin to win!</p>
                        <Link to="/arcade/slots" style={{ display: 'inline-block', background: '#ffd700', color: 'black', padding: '15px 40px', borderRadius: '50px', fontWeight: '900', textDecoration: 'none', boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)', fontSize: '1.1rem' }}>
                            SPIN NOW 🎰
                        </Link>
                    </div>
                    <div style={{ position: 'absolute', right: '10px', bottom: '10px', fontSize: '10rem', opacity: 0.9, filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))', transform: 'rotate(-10deg)' }}>
                        🎰
                    </div>
                </div>

                {/* 2. SUB SLAYER (Restored) */}
                <Link to="/subslayer" className="bento-card" style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%, #fdbb2d 100%)', // Deep Sea styling? Maybe just Dark Blue
                    background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                    color: 'white',
                    padding: '30px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: '200px'
                }}>
                    <div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', width: 'fit-content', padding: '5px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>ACTION</div>
                        <h2 style={{ fontSize: '2rem', margin: '10px 0 0 0' }}>SUB SLAYER</h2>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>Defend the depths.</p>
                    </div>
                    <div style={{ fontSize: '4rem', alignSelf: 'flex-end', opacity: 0.8 }}>⚓</div>
                </Link>

                {/* 2. BEAT LAB (Sub-Hero) */}
                <Link to="/beatlab" className="bento-card" style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #0BC5EA 0%, #00f2ff 100%)',
                    color: 'white',
                    padding: '30px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: '200px'
                }}>
                    <div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', width: 'fit-content', padding: '5px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>CREATIVE</div>
                        <h2 style={{ fontSize: '2rem', margin: '10px 0 0 0' }}>BEAT LAB</h2>
                    </div>
                    <div style={{ fontSize: '4rem', alignSelf: 'flex-end', opacity: 0.8 }}>🎹</div>
                </Link>

                {/* 3. SHOP & RALLY (Split) */}
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
