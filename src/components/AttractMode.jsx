import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IDLE_TIMEOUT = 30000; // 30 seconds

const AttractMode = () => {
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timeout;

        const resetIdle = () => {
            setIsIdle(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
        };

        // Listen for activity
        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);
        window.addEventListener('click', resetIdle);
        window.addEventListener('scroll', resetIdle);

        // Initial set
        timeout = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);

        return () => {
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('keydown', resetIdle);
            window.removeEventListener('click', resetIdle);
            window.removeEventListener('scroll', resetIdle);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AnimatePresence>
            {isIdle && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 999999999,
                        background: '#000', color: '#fff',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'none'
                    }}
                >
                    {/* Scanlines / CRT specific to attract mode */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                        backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 2
                    }} />

                    {/* Massive Floating Text */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{ textAlign: 'center', zIndex: 3 }}
                    >
                        <h1 style={{
                            fontFamily: '"Press Start 2P", monospace', fontSize: '4rem',
                            color: '#00ffcc', textShadow: '0 0 20px #00ffcc, 5px 5px 0 #ff00ff',
                            margin: '0 0 40px 0', letterSpacing: '5px'
                        }}>
                            MERCHBOY DIGITAL
                        </h1>
                        
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            style={{
                                fontFamily: '"Press Start 2P", monospace', fontSize: '2rem',
                                color: '#ff0055', textShadow: '0 0 10px #ff0055'
                            }}
                        >
                            - INSERT COIN -
                        </motion.div>
                    </motion.div>

                    {/* Bouncing Logo or Elements */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        style={{
                            position: 'absolute', opacity: 0.1, zIndex: 1,
                            width: '80vmin', height: '80vmin',
                            border: '20px solid #ff00ff', borderRadius: '50%',
                            borderTopColor: '#00ffcc', borderBottomColor: '#00ffcc'
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AttractMode;
