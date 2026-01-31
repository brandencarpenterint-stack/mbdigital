
import React from 'react';

const GhostRenderer = ({ mood = 'happy', isSleeping = false, stage = 'BABY' }) => {

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>

            <g className="ghost-float" opacity="0.8">
                {/* Body */}
                <path d="M 20 80 Q 20 20 50 20 Q 80 20 80 80 L 70 90 L 60 80 L 50 90 L 40 80 L 30 90 L 20 80" fill="white" filter="url(#glow)" />

                {/* Face */}
                {!isSleeping ? (
                    <g fill="#222">
                        <circle cx="35" cy="45" r="5" />
                        <circle cx="65" cy="45" r="5" />
                        <ellipse cx="50" cy="60" rx="4" ry="6" />
                        {mood === 'happy' && (
                            <g stroke="pink" strokeWidth="2">
                                <line x1="25" y1="55" x2="30" y2="50" />
                                <line x1="75" y1="55" x2="70" y2="50" />
                            </g>
                        )}
                    </g>
                ) : (
                    <text x="35" y="55" fontSize="20">U ω U</text>
                )}

                {/* Will-o-wisp orbs for adults */}
                {stage === 'ADULT' && (
                    <g>
                        <circle cx="10" cy="50" r="5" fill="#aaffff" className="orb1" />
                        <circle cx="90" cy="30" r="5" fill="#aaffff" className="orb2" />
                    </g>
                )}
            </g>

            {/* Glow Filter */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <style>{`
                .ghost-float { animation: ghostFloat 3s ease-in-out infinite; }
                .orb1 { animation: orbOrbit 4s infinite linear; transform-origin: 50px 50px; }
                .orb2 { animation: orbOrbit 6s infinite reverse linear; transform-origin: 50px 50px; }

                @keyframes ghostFloat { 
                    0% { transform: translateY(0); opacity: 0.6; } 
                    50% { transform: translateY(-10px); opacity: 0.9; } 
                    100% { transform: translateY(0); opacity: 0.6; }
                }
                @keyframes orbOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
             `}</style>
        </svg>
    );
};

export default GhostRenderer;
