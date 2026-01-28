import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px', minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            maxWidth: '600px', margin: '0 auto'
        }}>
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
                <h1 style={{
                    fontSize: '2.5rem', margin: '0 0 10px 0',
                    color: '#00FA9A', // SpringGreen
                    textShadow: '3px 3px #ff0055', fontFamily: '"Courier New", monospace',
                    letterSpacing: '-1px'
                }}>
                    WELCOME TO MERCHBOY
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#ddd' }}>Where Creativity meets Arcade Fun!</p>
            </div>

            {/* CARD GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>

                {/* SHOP CARD */}
                <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // Pastel Pink Gradient
                        borderRadius: '25px', padding: '40px 20px',
                        textAlign: 'center', color: 'white',
                        boxShadow: '0 10px 25px rgba(255, 105, 180, 0.4)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        position: 'relative', overflow: 'hidden'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* Decorative Circle */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>

                        <div style={{ marginBottom: '15px', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))' }}>
                            <img src="/assets/boy-logo.png" alt="Merchboy Face" style={{ width: '80px', height: 'auto' }} />
                        </div>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>MERCHBOY.SHOP</h2>
                        <p style={{ margin: 0, opacity: 0.95, fontSize: '1rem', fontWeight: '500' }}>Fresh drops • Quality gear • Free shipping</p>
                    </div>
                </a>

                {/* COLORING STUDIO CARD */}
                <Link to="/coloring" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '25px', padding: '35px 25px',
                        textAlign: 'center', color: '#333',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s',
                        position: 'relative'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '2.5rem' }}>🎨</span>
                            <h2 style={{ fontSize: '2rem', margin: 0, color: '#6A5ACD', fontWeight: '800' }}>Coloring Studio</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '30px', fontSize: '1.05rem' }}>
                            Jump into our interactive digital coloring book featuring 21 pages of MERCHBOY characters and abstract designs.
                        </p>
                        <button style={{
                            background: '#6A5ACD', color: 'white',
                            border: 'none', padding: '15px 35px',
                            fontSize: '1.1rem', fontWeight: 'bold',
                            borderRadius: '50px', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 5px 15px rgba(106, 90, 205, 0.4)'
                        }}>
                            Start Coloring Now ➝
                        </button>
                    </div>
                </Link>

                {/* ARCADE ZONE CARD */}
                <Link to="/arcade" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
                        border: '2px solid #00FA9A',
                        borderRadius: '25px', padding: '0',
                        textAlign: 'center', color: 'white',
                        boxShadow: '0 0 20px rgba(0, 250, 154, 0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'transform 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ padding: '40px 20px', position: 'relative', zIndex: 2 }}>
                            <div style={{
                                width: '100%', height: '180px',
                                backgroundImage: 'url(/assets/arcade-cabinet.png)',
                                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                marginBottom: '20px',
                                filter: 'drop-shadow(0 0 15px #00FA9A)'
                            }}></div>
                            <h2 style={{
                                fontSize: '2.5rem', margin: '0 0 10px 0',
                                color: '#00FA9A', textShadow: '0 0 10px rgba(0, 250, 154, 0.5)',
                                fontFamily: '"Courier New", monospace', fontWeight: '900'
                            }}>ARCADE ZONE</h2>
                            <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '1rem' }}>Play Retro Games • Earn Coins • Top the Leaderboard</p>

                            <div style={{
                                display: 'inline-block', padding: '12px 30px',
                                border: '2px solid #00FA9A', borderRadius: '50px',
                                color: '#00FA9A', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px',
                                background: 'rgba(0, 250, 154, 0.1)',
                                boxShadow: '0 0 15px rgba(0, 250, 154, 0.2)'
                            }}>
                                INSERT COIN 🪙
                            </div>
                        </div>

                        {/* Background Grid Effect */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundImage: 'linear-gradient(rgba(0, 250, 154, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 250, 154, 0.1) 1px, transparent 1px)',
                            backgroundSize: '30px 30px',
                            opacity: 0.3, zIndex: 1
                        }}></div>
                    </div>
                </Link>

            </div>

            <div style={{ marginTop: '60px', opacity: 0.7 }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '150px' }} />
            </div>
        </div>
    );
};

export default Home;
