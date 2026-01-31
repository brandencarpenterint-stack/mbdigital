import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const TRACKS = [
    { title: "Lofi Study", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Elipsis.mp3", duration: "Stream" },
    { title: "CPU Talk", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/BoxCat_Games/Nameless_the_Hackers_RPG_Soundtrack/BoxCat_Games_-_10_-_CPU_Talk.mp3", duration: "Stream" },
    { title: "Night Float", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3", duration: "Stream" },
];

const PirateRadio = () => {
    const { soundEnabled } = useSettings();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isExpanded, setIsExpanded] = useState(false);

    const currentTrack = TRACKS[trackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying && soundEnabled) {
            audioRef.current?.play().catch(e => console.log("Audio autoplay blocked", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, trackIndex, soundEnabled]);


    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
    };

    // Auto next
    const handleEnded = () => {
        nextTrack();
    };

    if (!soundEnabled) return null;

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="glass-panel"
            style={{
                position: 'fixed',
                bottom: '80px', // Above bottom nav
                right: '20px',
                width: isExpanded ? '300px' : '50px',
                height: '50px',
                border: '1px solid var(--neon-pink)',
                borderRadius: '25px',
                background: 'rgba(0,0,0,0.8)',
                zIndex: 900,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: '0 0 15px rgba(188, 19, 254, 0.3)',
                transition: 'width 0.3s ease'
            }}
        >
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onEnded={handleEnded}
                loop={false}
                crossOrigin="anonymous"
            />

            {/* COLLAPSED / EXPAND TOGGLE */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '50px', height: '50px',
                    background: 'transparent', border: 'none',
                    color: 'var(--neon-pink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0
                }}
            >
                {isExpanded ? '📻' : (isPlaying ? '🔊' : '🔇')}
            </button>

            {/* EXPANDED CONTROLS */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', flex: 1, paddingRight: '15px', gap: '10px' }}
                    >
                        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <div style={{
                                fontSize: '0.8rem', color: 'white', fontFamily: '"Orbitron", sans-serif',
                                animation: isPlaying ? 'scrollText 5s linear infinite' : 'none'
                            }}>
                                {currentTrack.title}
                            </div>
                        </div>

                        <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>⏮️</button>
                        <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>⏭️</button>

                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes scrollText {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </motion.div>
    );
};

export default PirateRadio;
