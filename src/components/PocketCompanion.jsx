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

    // Hooks must always run!
    // React to Routes
    useEffect(() => {
        const path = location.pathname;
        let msg = null;

        if (path === '/shop') msg = "Ooh! Buy something nice! 🛍️";
        else if (path === '/arcade') msg = "Let's beat some high scores! 🕹️";
        else if (path.includes('/game') && !path.includes('pocketbro')) msg = "Focus! You got this! 😤";
        else if (path === '/hustle') msg = "Work hard, play hard! 💪";
        else if (path === '/beatlab') msg = "Drop the beat! 🎧";
        else if (path === '/') msg = "Home sweet home. 🏠";

        if (msg) {
            setMessage(msg);
            setTimeout(() => setMessage(null), 3000);
        }
    }, [location.pathname]);

    // Random Chatter
    useEffect(() => {
        const interval = setInterval(() => {
            if (location.pathname === '/pocketbro') return; // Don't chat if hidden
            if (Math.random() > 0.7) {
                const chats = [
                    "I'm hungry...",
                    "Did you check the daily drop?",
                    "Bored...",
                    "Nice wallpaper.",
                    "Is it nap time?",
                    "Where are we going?"
                ];
                setMessage(chats[Math.floor(Math.random() * chats.length)]);
                setTimeout(() => setMessage(null), 3000);
            }
        }, 15000); // Check every 15s
        return () => clearInterval(interval);
    }, [location.pathname]);

    // Critical Alerts
    useEffect(() => {
        if (isCritical && location.pathname !== '/pocketbro') {
            setMessage("I don't feel so good... 🤢");
        }
    }, [isCritical, location.pathname]);

    // CONDITIONAL RENDER AT THE END
    if (location.pathname === '/pocketbro') return null;

    const equippedSkin = shopState?.equipped?.pocketbro || null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '100px', // Above Dock
            right: '20px',
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            pointerEvents: 'none' // Click through for gameplay
        }}>
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
                            fontSize: '0.8rem',
                            pointerEvents: 'auto',
                            border: '1px solid rgba(255,255,255,0.5)'
                        }}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                drag
                dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
                onTap={() => {
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
                    cursor: 'grab',
                    pointerEvents: 'auto',
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
        </div>
    );
};

export default PocketCompanion;
