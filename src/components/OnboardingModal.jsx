import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import SquishyButton from './SquishyButton';
import { motion, AnimatePresence } from 'framer-motion';
import useRetroSound from '../hooks/useRetroSound';

const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/face_money.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
];

const BOOT_LOGS = [
    { text: "INITIALIZING MERCHOS KERNEL...", delay: 500 },
    { text: "MOUNTING VIRTUAL DOM...", delay: 300 },
    { text: "ALLOCATING PIXEL BUFFERS...", delay: 300 },
    { text: "CONNECTING TO POCKET BRO LINK...", delay: 600 },
    { text: "SUCCESS: BRO DETECTED [OK]", delay: 200, color: '#0f0' },
    { text: "SCANNING FOR PIRATE FREQUENCIES...", delay: 800 },
    { text: "WARNING: GHOST SIGNAL DETECTED", delay: 400, color: 'red' },
    { text: "LOADING USER PROFILE...", delay: 500 },
];

const OnboardingModal = () => {
    const { updateProfile, addCoins, userProfile } = useGamification() || {};
    const { playClick, playTyper } = useRetroSound(); // Assuming playTyper exists or fallback

    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState('CHECK'); // CHECK, BOOT, FORM, MISSION

    // Boot State
    const [logs, setLogs] = useState([]);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);

    // Form State
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(AVATARS[0]);

    useEffect(() => {
        if (userProfile?.name) setName(userProfile.name);
        if (userProfile?.avatar) setAvatar(userProfile.avatar);
    }, [userProfile]);

    useEffect(() => {
        const hasBooted = localStorage.getItem('merchos_v3_boot');
        if (!hasBooted) {
            setVisible(true);
            setStep('BOOT');
        }
    }, []);

    // Boot Sequence Logic
    useEffect(() => {
        if (step !== 'BOOT') return;

        if (currentLogIndex < BOOT_LOGS.length) {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, BOOT_LOGS[currentLogIndex]]);
                setCurrentLogIndex(prev => prev + 1);
                // playClick(); // Typing sound effect
            }, BOOT_LOGS[currentLogIndex].delay);
            return () => clearTimeout(timeout);
        } else {
            // Boot Complete
            setTimeout(() => {
                setStep('FORM');
            }, 1000);
        }
    }, [step, currentLogIndex]);

    const handleComplete = () => {
        if (!name.trim()) {
            alert("IDENTIFICATION REQUIRED. ENTER CODE NAME.");
            return;
        }

        if (updateProfile && addCoins) {
            updateProfile({ name: name.toUpperCase(), avatar: avatar });
            addCoins(500);
            localStorage.setItem('merchos_v3_boot', 'true');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            // Move to Mission Phase instead of closing immediately
            setStep('MISSION');
        }
    };

    const closeOnboarding = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: '#000', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Press Start 2P", monospace',
                overflow: 'hidden'
            }}>

                {/* PHASE 1: BOOT SEQUENCE */}
                {step === 'BOOT' && (
                    <div style={{ width: '80%', maxWidth: '600px', padding: '20px' }}>
                        <div style={{ color: '#0f0', marginBottom: '20px', borderBottom: '2px solid #0f0', paddingBottom: '10px' }}>
                            MERCHOS v3.0 // BOOT SEQUENCE
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ color: log.color || '#0f0' }}
                                >
                                    {`> ${log.text}`}
                                </motion.div>
                            ))}
                            <motion.div
                                animate={{ opacity: [0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                style={{ color: '#0f0' }}
                            >
                                _
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* PHASE 2: PROFILE FORM */}
                {step === 'FORM' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bento-card"
                        style={{
                            background: '#1a202c', width: '90%', maxWidth: '500px',
                            borderRadius: '30px', padding: '40px',
                            border: '4px solid var(--neon-blue)',
                            boxShadow: '0 0 50px rgba(0,255,255,0.2)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textAlign: 'center', color: 'white'
                        }}
                    >
                        <h1 style={{
                            fontSize: '1.5rem', marginBottom: '10px',
                            background: 'linear-gradient(to right, #00f260, #0575E6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            SYSTEM READY
                        </h1>
                        <p style={{ color: '#a0aec0', marginBottom: '30px', fontSize: '0.8rem' }}>
                            IDENTIFY YOURSELF TO PROCEED
                        </p>

                        {/* AVATAR SELECTOR */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                {AVATARS.map(src => (
                                    <div
                                        key={src}
                                        onClick={() => setAvatar(src)}
                                        style={{
                                            width: '60px', height: '60px', borderRadius: '50%',
                                            border: avatar === src ? '4px solid var(--neon-blue)' : '2px solid #4a5568',
                                            overflow: 'hidden', cursor: 'pointer',
                                            transform: avatar === src ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                            boxShadow: avatar === src ? '0 0 20px var(--neon-blue)' : 'none'
                                        }}
                                    >
                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NAME INPUT */}
                        <div style={{ marginBottom: '30px', width: '100%' }}>
                            <input
                                type="text"
                                placeholder="ENTER CODENAME..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%', padding: '15px', borderRadius: '15px',
                                    background: '#2d3748', border: '2px solid #4a5568',
                                    color: 'white', fontSize: '1.2rem', textAlign: 'center',
                                    outline: 'none', textTransform: 'uppercase', fontFamily: '"Press Start 2P"'
                                }}
                            />
                        </div>

                        <SquishyButton
                            onClick={handleComplete}
                            style={{
                                width: '100%', padding: '20px', fontSize: '1rem',
                                background: 'linear-gradient(90deg, #00f260, #0575E6)',
                                boxShadow: '0 10px 30px rgba(0, 242, 96, 0.4)'
                            }}
                        >
                            INITIALIZE PROFILE 🚀
                        </SquishyButton>
                    </motion.div>
                )}

                {/* PHASE 3: MISSION DIRECTIVE */}
                {step === 'MISSION' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: '#111', width: '90%', maxWidth: '600px',
                            border: '1px solid #333', padding: '30px',
                            color: '#0f0', fontFamily: 'monospace'
                        }}
                    >
                        <h2 style={{ borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>
                            MISSION LOG: DAY 1
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                            <li>[ ] VISIT YOUR POCKET BRO ROOM</li>
                            <li>[ ] TUNE RADIO TO A SECRET FREQUENCY</li>
                            <li>[ ] CHECK TERMINAL FOR 'HELP'</li>
                        </ul>
                        <div style={{ marginTop: '30px', textAlign: 'right' }}>
                            <button
                                onClick={closeOnboarding}
                                style={{
                                    background: '#0f0', color: 'black', border: 'none',
                                    padding: '10px 20px', fontFamily: 'monospace', fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                ACKNOWLEDGED_
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>
        </AnimatePresence>
    );
};

export default OnboardingModal;
