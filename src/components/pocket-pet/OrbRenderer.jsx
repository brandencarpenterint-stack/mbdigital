
import React from 'react';

const OrbRenderer = ({ mood = 'happy', isSleeping = false, isEating = false, stage = 'BABY', color = '#00BCD4' }) => {

    // Orb logic is pure css animation

    const renderStage = () => {
        // SCALING
        let scale = 1;
        if (stage === 'BABY') scale = 0.6;
        if (stage === 'CHILD') scale = 0.8;
        if (stage === 'TEEN') scale = 0.9;

        return (
            <g transform={`scale(${scale}) translate(${50 * (1 - scale)}, ${50 * (1 - scale)})`}>
                <g className={isEating ? "pulse-fast" : "pulse-slow"}>

                    {/* Outer Ring */}
                    <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="2" fill="none" opacity="0.3" className="spin-cw" strokeDasharray="10, 5" />

                    {/* Inner Ring */}
                    <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="4" fill="none" opacity="0.5" className="spin-ccw" strokeDasharray="20, 10" />

                    {/* Core */}
                    <circle cx="50" cy="50" r="20" fill={color}>
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="50" r="15" fill="white" opacity="0.5" />

                    {/* Face (Minimalist) */}
                    {!isSleeping ? (
                        <g>
                            <circle cx="45" cy="48" r="3" fill="black" />
                            <circle cx="55" cy="48" r="3" fill="black" />
                        </g>
                    ) : (
                        <text x="45" y="55" fontSize="15" fill="black">- -</text>
                    )}
                </g>
            </g>
        );
    };

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Glow */}
            <circle cx="50" cy="50" r="30" fill={color} opacity="0.2" filter="blur(10px)" />
            {renderStage()}
            <style>{`
                .pulse-slow { animation: pulse 3s infinite ease-in-out; }
                .pulse-fast { animation: pulse 0.5s infinite; }
                .spin-cw { transform-origin: 50px 50px; animation: spin 10s linear infinite; }
                .spin-ccw { transform-origin: 50px 50px; animation: spin 8s linear infinite reverse; }

                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
             `}</style>
        </svg>
    );
};

export default OrbRenderer;
