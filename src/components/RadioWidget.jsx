import React, { useState, useRef, useEffect } from 'react';

const RadioWidget = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const [isHovered, setIsHovered] = useState(false);
    const audioRef = useRef(null);

    // Reliable synthwave/vaporwave radio stream
    const STREAM_URL = "https://radio.plaza.one/mp3";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // Need to set src again sometimes to clear buffer on live streams
            if (!audioRef.current.src || audioRef.current.src === '') {
                audioRef.current.src = STREAM_URL;
            }
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error("Audio playback failed:", err);
            });
        }
    };

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 999990,
                background: 'rgba(10, 10, 15, 0.85)',
                border: '2px solid #ff00ff',
                borderRadius: '12px',
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                fontFamily: 'monospace'
            }}
        >
            <audio ref={audioRef} preload="none" />

            {/* Play/Pause Button */}
            <button 
                onClick={togglePlay}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff00ff',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    textShadow: '0 0 10px #ff00ff',
                    padding: 0
                }}
            >
                {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Info and Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    MERCH.FM <span style={{ color: '#00ffcc', fontSize: '0.7rem' }}>[LIVE]</span>
                </div>
                
                {/* Fake EQ Visualizer */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '15px' }}>
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i} 
                            style={{
                                width: '4px',
                                background: isPlaying ? '#00ffcc' : '#555',
                                height: isPlaying ? `${20 + Math.random() * 80}%` : '20%',
                                transition: 'height 0.1s ease',
                                animation: isPlaying ? `eq-bounce 0.${4 + (i%3)}s infinite alternate` : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Volume Control */}
            {isHovered && (
                <input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ width: '60px', accentColor: '#ff00ff', marginLeft: '10px' }}
                />
            )}

            <style>{`
                @keyframes eq-bounce {
                    0% { height: 20%; }
                    100% { height: 100%; }
                }
            `}</style>
        </div>
    );
};

export default RadioWidget;
