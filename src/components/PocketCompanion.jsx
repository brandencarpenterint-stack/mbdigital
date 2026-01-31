import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import PocketPet from './pocket-pet/PocketPet';

const PocketCompanion = () => {
    const location = useLocation();
    const { stats, isCritical } = usePocketBro();
    const { shopState } = useGamification() || {};
    const [message, setMessage] = useState(null);
    const [screenSize, setScreenSize] = useState({ w: window.innerWidth, h: window.innerHeight });

    // Detect Game Mode (Arcade sub-routes, but not the Hub itself)
    const isGame = location.pathname.startsWith('/arcade/') && location.pathname !== '/arcade';

    // Handle Resize for Float Boundaries
    useEffect(() => {
        const handleResize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hooks must always run!
    // React to Routes
    useEffect(() => {
        const path = location.pathname;
        let msg = null;

        if (path === '/shop') msg = "Ooh! Buy something nice! 🛍️";
        else if (path === '/arcade') msg = "Let's beat some high scores! 🕹️";
        else if (path === '/hustle') msg = "Work hard, play hard! 💪";
        else if (path === '/beatlab') msg = "Drop the beat! 🎧";
        else if (path === '/') msg = "Home sweet home. 🏠";

        // Game specific intro handled below or suppressed to avoid distraction
        if (isGame) msg = "Huhuhuh...";

        if (msg) {
            setMessage(msg);
            setTimeout(() => setMessage(null), 3000);
        }
    }, [location.pathname, isGame]);

    // Random Chatter
    useEffect(() => {
        const interval = setInterval(() => {
            if (location.pathname === '/pocketbro') return; // Don't chat if hidden

            // GAME MODE CHATTER
            if (isGame) {
                if (Math.random() > 0.8) {
                    const noises = ["Huhuhuh", "Weueue", "Hrrrng", "Pop?", "...", "Huhu!"];
                    setMessage(noises[Math.floor(Math.random() * noises.length)]);
                    setTimeout(() => setMessage(null), 2000);
                }
                return;
            }

            // NORMAL CHATTER
            if (Math.random() > 0.7) {
                const chats = [
                    "I'm hungry...",
                    "Did you check the daily drop?",
                    "Bored...",
                    "Nice wallpaper.",
                    "Is it nap time?",
                    "Where are we going?",
                    "Vibe check? ✨"
                ];
                setMessage(chats[Math.floor(Math.random() * chats.length)]);
                setTimeout(() => setMessage(null), 3000);
            }
        }, 12000); // Check every 12s
        return () => clearInterval(interval);
    }, [location.pathname, isGame]);

    // Critical Alerts
    useEffect(() => {
        if (isCritical && location.pathname !== '/pocketbro' && !isGame) {
            setMessage("I don't feel so good... 🤢");
        }
    }, [isCritical, location.pathname, isGame]);

    // CONDITIONAL RENDER AT THE END
    if (location.pathname === '/pocketbro') return null;

    const equippedSkin = shopState?.equipped?.pocketbro || null;

    // FLOATING ANIMATION VARIANTS
    const floatVariants = {
        normal: {
            scale: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.5 }
        },
        game: {
            scale: 0.25, // 1/4th size (visually tiny)
            // Wander around the screen relative to bottom-right anchor
            x: [0, -screenSize.w * 0.4, -screenSize.w * 0.8, -screenSize.w * 0.2, 0],
            y: [0, -screenSize.h * 0.5, -screenSize.h * 0.2, -screenSize.h * 0.7, 0],
            rotate: [0, 15, -15, 10, 0],
            opacity: 0.8,
            transition: {
                duration: 25, // Slow float
                repeat: Infinity,
                ease: "linear",
                repeatType: "mirror"
            }
        }
    };

    return (
        <motion.div
            variants={floatVariants}
            animate={isGame ? 'game' : 'normal'}
            style={{
                position: 'fixed',
                bottom: '100px', // Default anchor
                right: '20px',
                zIndex: 1500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'end',
                pointerEvents: 'none' // Click through for gameplay
            }}
        >
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            color: 'black',
                            padding: '10px 15px',
                            borderRadius: '15px 15px 0 15px',
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            maxWidth: '200px',
                            fontSize: '0.8rem', // Text size scales with parent transform!
                            pointerEvents: isGame ? 'none' : 'auto', // No interaction during game
                            border: '1px solid rgba(255,255,255,0.5)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={!isGame ? { scale: 1.1 } : {}}
                whileTap={!isGame ? { scale: 0.9 } : {}}
                drag={!isGame}
                dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
                onTap={() => {
                    if (isGame) return;
                    setMessage("Hey! Stop poking me!");
                    setTimeout(() => setMessage(null), 2000);
                }}
                style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    // Glassmorphism Bubble
                    background: isCritical
                        ? 'radial-gradient(circle at 30% 30%, rgba(255,0,0,0.3), rgba(100,0,0,0.8))'
                        : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(0,0,0,0.6))',
                    backdropFilter: 'blur(3px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isGame ? 'default' : 'grab',
                    pointerEvents: isGame ? 'none' : 'auto',
                }}
            >
                <div style={{ width: '80%', height: '80%' }}>
                    <PocketPet
                        type={stats.type || 'SOOT'}
                        stage={stats.stage || 'EGG'}
                        mood={isCritical ? 'sad' : 'happy'}
                        skin={equippedSkin}
                        isSleeping={stats.isSleeping}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PocketCompanion;
