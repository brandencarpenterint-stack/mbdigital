import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
    { id: 'fishing', title: 'CRAZY FISHING', subtitle: 'Reel in the Big One!', color: '#00ccff', icon: '🎣' },
    { id: 'galaxy', title: 'GALAXY DEFENDER', subtitle: 'Defend the Universe!', color: '#00ccff', icon: '🚀' },
    { id: 'snake', title: 'NEON SNAKE', subtitle: 'Classic Action Redefined', color: '#00ffaa', icon: '🐍' },
];

const ArcadeHero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const current = HERO_IMAGES[currentIndex];

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            height: '300px',
            margin: '0 auto 40px auto',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: `0 0 30px ${current.color}60`,
            border: `2px solid ${current.color}`,
            background: '#000',
            transition: 'all 0.5s ease'
        }}>
            {/* Background Grid Effect */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.3,
                animation: 'scrollGrid 20s linear infinite'
            }} />

            <style>
                {`
                    @keyframes scrollGrid {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(40px); }
                    }
                `}
            </style>

            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
                background: `radial-gradient(circle at center, ${current.color}20 0%, transparent 70%)`
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
                    {current.icon}
                </div>
                <h1 style={{
                    color: current.color,
                    fontSize: '3rem',
                    margin: 0,
                    textShadow: `0 0 20px ${current.color}`,
                    fontFamily: '"Courier New", monospace'
                }}>
                    {current.title}
                </h1>
                <p style={{ color: '#fff', fontSize: '1.5rem', marginTop: '10px' }}>{current.subtitle}</p>

                <Link to={`/arcade/${current.id}`} style={{
                    marginTop: '20px',
                    padding: '10px 30px',
                    background: current.color,
                    color: 'black',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: `0 0 20px ${current.color}`,
                    transition: 'transform 0.2s'
                }}>
                    PLAY NOW
                </Link>
            </div>
        </div>
    );
};

export default ArcadeHero;
