import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import { useSquad } from '../context/SquadContext'; // Assuming we have or will update SquadContext
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from '../components/SquishyButton';

const GENERATOR_PARTS = {
    bodies: ['🤖', '👽', '👾', '🤡', '👻', '👺', '💀', '😸', '🐻', '🐼'],
    names: ['Zorg', 'X-AE-12', 'Glitch', 'Bitsy', 'Pixel', 'Retro', 'Neon', 'Vapor', 'Cyber', 'Null'],
    jobs: ['Hacker', 'Miner', 'Gamer', 'Influencer', 'Bot', 'Ghost', 'Jester', 'King', 'Pilot', 'Chef'],
    taglines: [
        "Looking for a squad.",
        "Will work for crypto.",
        "System 32 deleted.",
        "404 Soul Not Found.",
        "Level 99 Boss.",
        "Just vibing.",
        "No n00bs.",
        "Ready to raid.",
        "I handle storage.",
        "Speedrunner."
    ]
};

const BroFinder = () => {
    const { coins, addCoins } = useGamification();
    const { recruitMember, recruits } = useSquad();
    const { playClick, playCollect, playCrash, playWin } = useRetroSound();
    const { showToast } = useToast();

    const [currentProfile, setCurrentProfile] = useState(null);
    const [direction, setDirection] = useState(0); // -1 left, 1 right

    const generateProfile = () => {
        return {
            id: Date.now(),
            icon: GENERATOR_PARTS.bodies[Math.floor(Math.random() * GENERATOR_PARTS.bodies.length)],
            name: `${GENERATOR_PARTS.names[Math.floor(Math.random() * GENERATOR_PARTS.names.length)]}_${Math.floor(Math.random() * 99)}`,
            job: GENERATOR_PARTS.jobs[Math.floor(Math.random() * GENERATOR_PARTS.jobs.length)],
            tagline: GENERATOR_PARTS.taglines[Math.floor(Math.random() * GENERATOR_PARTS.taglines.length)],
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            price: Math.floor(Math.random() * 500) + 100
        };
    };

    useEffect(() => {
        setCurrentProfile(generateProfile());
    }, []);

    const handleSwipe = (dir) => {
        setDirection(dir);
        playClick();

        setTimeout(() => {
            if (dir === 1) {
                // LIKE / HIRE
                // CAP CHECK
                if (recruits && recruits.length >= 10) {
                    showToast("SQUAD FULL! Fire some members first.", "error");
                    playCrash();
                    setDirection(0);
                    return;
                }

                if (coins >= 50) {
                    // Match Check (RNG)
                    if (Math.random() > 0.3) {
                        // IT'S A MATCH!
                        // Pay cost? Or is cost per swipe?
                        // Let's say cost is PER SWIPE 50c
                        addCoins(-50);

                        // HIRE COST?
                        // Let's simplify: Tinder style. Swipe = cost? No, that's mean.
                        // Swipe = Free. Match = Opportunity to Hire.

                        // REVISION:
                        // Swipe Right = Attempt to Recruit. Cost 50 coins to "Send Message".
                        // addCoins(-50); // ALREADY CALLED ABOVE? No, I see it there twice in logic.

                        playWin();
                        showToast(`MATCH! ${currentProfile.name} Joined!`, "success");
                        recruitMember(currentProfile);
                    } else {
                        addCoins(-50);
                        playCrash(); // Ghosted
                        showToast("Ghosted... -50 Coins", "error");
                    }
                } else {
                    playCrash();
                    showToast("NOT ENOUGH COINS TO DM!", "error");
                    setDirection(0);
                    return;
                }
            }

            // NEXT
            setDirection(0);
            setCurrentProfile(generateProfile());
        }, 300);
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #ff0055, #7700ff)',
            color: 'white',
            fontFamily: '"Outfit", sans-serif',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingBottom: '100px', overflow: 'hidden'
        }}>

            {/* HEADER */}
            <div style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <Link to="/" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'white' }}>⬅</Link>
                <div style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🔥 BroFinder
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    🪙 {coins}
                </div>
            </div>

            {/* CARD STACK */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>

                <AnimatePresence>
                    {currentProfile && (
                        <motion.div
                            key={currentProfile.id}
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{
                                scale: 1, opacity: 1, y: 0, x: direction * 200, rotate: direction * 20
                            }}
                            exit={{ x: direction * 500, opacity: 0, rotate: direction * 45 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: '90%',
                                maxWidth: '350px',
                                height: '500px',
                                background: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                overflow: 'hidden',
                                position: 'absolute',
                                display: 'flex', flexDirection: 'column'
                            }}
                        >
                            {/* IMAGE AREA */}
                            <div style={{ flex: 2, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', position: 'relative' }}>
                                {/* Pattern */}
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                {currentProfile.icon}

                                {/* PRICE TAG */}
                                <div style={{
                                    position: 'absolute', bottom: '20px', right: '20px',
                                    background: 'rgba(0,0,0,0.8)', color: '#00ffcc',
                                    padding: '5px 15px', borderRadius: '10px', fontWeight: 'bold'
                                }}>
                                    Salary: {currentProfile.price}/hr
                                </div>
                            </div>

                            {/* INFO AREA */}
                            <div style={{ flex: 1, padding: '20px', color: '#333' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{currentProfile.name}</h2>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>⭐ {currentProfile.rating}</span>
                                </div>
                                <div style={{ fontSize: '1rem', color: '#888', marginBottom: '15px', fontWeight: '600', textTransform: 'uppercase' }}>
                                    💼 {currentProfile.job}
                                </div>
                                <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic' }}>
                                    "{currentProfile.tagline}"
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* CONTROLS */}
            <div style={{ padding: '30px', display: 'flex', gap: '30px', zIndex: 10 }}>
                {/* REJECT */}
                <button
                    onClick={() => handleSwipe(-1)}
                    style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        background: 'white', border: 'none',
                        color: '#ff0055', fontSize: '2rem',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        cursor: 'pointer', transition: 'transform 0.1s'
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    ✖️
                </button>

                {/* LIKE */}
                <button
                    onClick={() => handleSwipe(1)}
                    style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        background: 'white', border: 'none',
                        color: '#00ffcc', fontSize: '2.5rem',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        cursor: 'pointer', transition: 'transform 0.1s'
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    🔥
                </button>
            </div>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '20px', textAlign: 'center' }}>
                50 COINS per DM • 30% Match Rate
            </div>

        </div>
    );
};

export default BroFinder;
