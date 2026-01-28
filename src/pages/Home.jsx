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
                    width: '250px',
                    padding: '30px',
                    backgroundColor: 'var(--accent-color)',
                    color: 'black',
                    textDecoration: 'none',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 0 #cccc00',
                    transition: 'transform 0.1s, box-shadow 0.1s'
                }}>
                    PLAY ARCADE
                </Link>
            </div>

            <div style={{ marginTop: '60px' }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '200px', opacity: 0.8 }} />
            </div>
        </div>
    );
};

export default Home;
