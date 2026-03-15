import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const TRACKS = [
    { title: "Lofi Study", src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", duration: "Stream" },
    { title: "Neon Nights", src: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3", duration: "Stream" },
    { title: "Chill Vibes", src: "https://cdn.pixabay.com/audio/2022/11/22/audio_73138b0cd2.mp3", duration: "Stream" },
    { title: "THE SIGNAL", src: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b3ce8cd6.mp3", duration: "Encrypted" },
];

const PirateRadio = () => {
    const { soundEnabled } = useSettings();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isExpanded, setIsExpanded] = useState(false);

    const [errorCount, setErrorCount] = useState(0);

    const currentTrack = TRACKS[trackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying && soundEnabled) {
            const playPromise = audioRef.current?.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Audio autoplay blocked/error", e);
                    setIsPlaying(false); // Revert UI
                });
            }
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, trackIndex, soundEnabled]);


    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
        setErrorCount(0);
    };

    const prevTrack = () => {
        setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
        setErrorCount(0);
    };

    // Auto next
    const handleEnded = () => {
        nextTrack();
    };

    const handleError = () => {
        console.error("Radio Stream Failed:", currentTrack.src);
        if (errorCount < 3) {
            setErrorCount(prev => prev + 1);
            // Try next track automatically
            setTimeout(() => nextTrack(), 1000);
        } else {
            setIsPlaying(false); // Give up to prevent infinite loop
            setErrorCount(0);
        }
    };

    if (!soundEnabled) return null;

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="glass-panel"
            style={{
                position: 'fixed',
                top: '100px', // Moved below header
                right: '20px',
                width: isExpanded ? '300px' : '50px',
                height: '50px',
                border: isPlaying ? '1px solid var(--neon-green)' : '1px solid var(--neon-pink)', // Green when active
                borderRadius: '25px',
                background: 'rgba(0,0,0,0.8)',
                zIndex: 900,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: isPlaying ? '0 0 15px var(--neon-green)' : '0 0 5px rgba(188, 19, 254, 0.3)',
                transition: 'all 0.3s ease'
            }}
        >
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onEnded={handleEnded}
                onError={handleError}
                loop={false}
                crossOrigin="anonymous"
            />

            {/* COLLAPSED / EXPAND TOGGLE */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '50px', height: '50px',
                    background: 'transparent', border: 'none',
                    color: isPlaying ? 'var(--neon-green)' : 'var(--neon-pink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    animation: isPlaying ? 'pulse 2s infinite' : 'none'
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
                                {errorCount > 0 ? "SEARCHING FREQUENCY..." : currentTrack.title}
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
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
            `}</style>
        </motion.div>
    );
};

export default PirateRadio;
