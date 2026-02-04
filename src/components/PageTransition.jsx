import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger generic load animation on route change
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 800); // 0.8s Duration

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        background: 'black',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none' // Allow clicks to pass through if it glitches but usually it blocks
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ scale: [0.8, 1.2, 1], opacity: 1, filter: 'blur(0px)' }}
                        exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Glitch Effect Behind */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'url(/brand_favicon.png) no-repeat center/contain',
                            filter: 'blur(2px)', opacity: 0.7,
                            transform: 'translate(-2px, 2px)',
                            animation: 'glitch-anim 0.2s infinite'
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'url(/brand_favicon.png) no-repeat center/contain',
                            filter: 'blur(2px)', opacity: 0.7,
                            transform: 'translate(2px, -2px)',
                            animation: 'glitch-anim-2 0.2s infinite'
                        }} />

                        {/* Main Logo */}
                        <img
                            src="/brand_favicon.png"
                            alt="Loading..."
                            style={{
                                width: '150px', height: '150px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 20px cyan)'
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
            <style>{`
                @keyframes glitch-anim {
                    0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
                    20% { clip-path: inset(80% 0 10% 0); transform: translate(2px, -2px); }
                    40% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 2px); }
                    60% { clip-path: inset(10% 0 80% 0); transform: translate(2px, -2px); }
                    80% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
                    100% { clip-path: inset(40% 0 40% 0); transform: translate(2px, -2px); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip-path: inset(80% 0 10% 0); transform: translate(2px, -2px); }
                    20% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
                    40% { clip-path: inset(40% 0 40% 0); transform: translate(2px, -2px); }
                    60% { clip-path: inset(80% 0 10% 0); transform: translate(-2px, 2px); }
                    80% { clip-path: inset(10% 0 80% 0); transform: translate(2px, -2px); }
                    100% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 2px); }
                }
            `}</style>
        </AnimatePresence>
    );
};

export default PageTransition;
