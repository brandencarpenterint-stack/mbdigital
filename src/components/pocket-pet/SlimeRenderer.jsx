
import React, { useEffect, useState } from 'react';

const SlimeRenderer = ({ mood = 'happy', isSleeping = false, isEating = false, stage = 'BABY' }) => {
    const [wobble, setWobble] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWobble(prev => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Slime Color Palette
    const mainColor = "#00ff88";
    const highlightColor = "#ccffdd";
    const darkColor = "#00aa55";

    const renderBaby = () => (
        <g className="gelatin">
            {/* Blob Body */}
            <path d="M 20 90 Q 50 100 80 90 Q 95 80 90 60 Q 80 20 50 20 Q 20 20 10 60 Q 5 80 20 90 Z" fill={mainColor} opacity="0.8" />
            <ellipse cx="50" cy="85" rx="35" ry="10" fill={darkColor} opacity="0.3" /> {/* Inner depth */}

            {/* Shine */}
            <ellipse cx="30" cy="40" rx="5" ry="8" fill="white" opacity="0.6" transform="rotate(-20 30 40)" />

            {/* Eyes */}
            <circle cx="35" cy="55" r="5" fill="black" />
            <circle cx="65" cy="55" r="5" fill="black" />

            {/* Mouth */}
            {!isSleeping ? (
                <path d="M 40 70 Q 50 80 60 70" stroke="black" strokeWidth="2" fill="none" />
            ) : <text x="45" y="70" fontSize="15">z</text>}
        </g>
    );

    const renderAdult = () => (
        <g className="gelatin">
            {/* King Slime Crown */}
            <path d="M 30 20 L 40 5 L 50 20 L 60 5 L 70 20 Z" fill="gold" />

            {/* BIG Blob Body */}
            <path d="M 10 90 Q 50 105 90 90 Q 100 70 95 40 Q 80 10 50 10 Q 20 10 5 40 Q 0 70 10 90 Z" fill="#00dddd" opacity="0.85" />

            {/* Inner Core */}
            <circle cx="50" cy="60" r="15" fill="#005555" opacity="0.4" />

            {/* Eyes */}
            <circle cx="35" cy="50" r="7" fill="black" />
            <circle cx="65" cy="50" r="7" fill="black" />
            <circle cx="37" cy="48" r="2" fill="white" />
            <circle cx="67" cy="48" r="2" fill="white" />

            {/* Mouth - drooling? */}
            <path d="M 40 70 Q 50 85 60 70" stroke="black" strokeWidth="3" fill="none" />
        </g>
    );

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Slime Trail */}
            <path d="M 20 95 Q 50 100 80 95" stroke={mainColor} strokeWidth="5" strokeLinecap="round" opacity="0.3" />

            {stage === 'ADULT' ? renderAdult() : renderBaby()}

            <style>{`
                .gelatin { animation: gelatin 2s infinite; transform-origin: center bottom; }
                @keyframes gelatin {
                    from, to { transform: scale(1, 1); }
                    25% { transform: scale(0.9, 1.1); }
                    50% { transform: scale(1.1, 0.9); }
                    75% { transform: scale(0.95, 1.05); }
                }
             `}</style>
        </svg>
    );
};

export default SlimeRenderer;
