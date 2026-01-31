
import React, { useState, useEffect } from 'react';

const BotRenderer = ({ mood = 'happy', isSleeping = false, stage = 'BABY' }) => {
    const [ledState, setLedState] = useState(true);

    useEffect(() => {
        const i = setInterval(() => setLedState(p => !p), 500);
        return () => clearInterval(i);
    }, []);

    const renderBot = () => (
        <g className="hover">
            {/* Antenna */}
            <line x1="50" y1="20" x2="50" y2="10" stroke="#555" strokeWidth="2" />
            <circle cx="50" cy="10" r="3" fill={ledState ? "red" : "#500"} />

            {/* Head */}
            <rect x="30" y="20" width="40" height="30" rx="5" fill="#ccc" stroke="#555" strokeWidth="2" />

            {/* Screen Face */}
            <rect x="35" y="25" width="30" height="20" fill="#002200" />

            {/* Pixel Eyes */}
            {!isSleeping ? (
                <g fill="#0f0">
                    <rect x="38" y="30" width="4" height="4" />
                    <rect x="58" y="30" width="4" height="4" />
                    {/* Smile */}
                    <rect x="40" y="38" width="20" height="2" />
                    <rect x="38" y="36" width="2" height="2" />
                    <rect x="60" y="36" width="2" height="2" />
                </g>
            ) : (
                <text x="40" y="40" fill="lime" fontFamily="monospace" fontSize="10">- -</text>
            )}

            {/* Body */}
            {stage !== 'BABY' && (
                <g>
                    <rect x="35" y="52" width="30" height="25" rx="3" fill="#999" stroke="#555" strokeWidth="2" />
                    {/* Buttons */}
                    <circle cx="45" cy="65" r="3" fill="blue" />
                    <circle cx="55" cy="65" r="3" fill="yellow" />
                </g>
            )}

            {/* Arms - Hovering */}
            {stage !== 'BABY' && (
                <g>
                    <path d="M 30 60 L 20 70" stroke="#555" strokeWidth="3" />
                    <circle cx="20" cy="70" r="4" fill="#333" />
                    <path d="M 70 60 L 80 70" stroke="#555" strokeWidth="3" />
                    <circle cx="80" cy="70" r="4" fill="#333" />
                </g>
            )}
        </g>
    );

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Shadow */}
            <ellipse cx="50" cy="90" rx="20" ry="3" fill="rgba(0,0,0,0.2)" />

            {renderBot()}

            <style>{`
                .hover { animation: robotHover 1s ease-in-out infinite alternate; }
                @keyframes robotHover { from { transform: translateY(0); } to { transform: translateY(-3px); } }
             `}</style>
        </svg>
    );
};

export default BotRenderer;
