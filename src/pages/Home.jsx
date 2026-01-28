import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--secondary-color)', textShadow: '4px 4px var(--primary-color)' }}>
                WELCOME TO MERCHBOY
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>Where Creativity meets Arcade Fun!</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                <Link to="/coloring" style={{
                    display: 'block',
                    width: '250px',
                    padding: '30px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 0 #990033',
                    transition: 'transform 0.1s, box-shadow 0.1s'
                }}>
                    START COLORING
                </Link>
                <Link to="/arcade" style={{
                    display: 'block',
                    width: '300px', // Slightly larger for the image
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
                }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                >
                    <img
                        src="/assets/arcade-cabinet.png"
                        alt="Play Arcade"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                    />
                </Link>
            </div>

            <div style={{ marginTop: '60px' }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '200px', opacity: 0.8 }} />
            </div>
        </div>
    );
};

export default Home;
