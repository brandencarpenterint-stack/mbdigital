
import React, { useEffect, useState } from 'react';

const AlienRenderer = ({ mood = 'happy', isSleeping = false, isEating = false, stage = 'BABY', color = '#9C27B0' }) => {
    const [wiggle, setWiggle] = useState(0);

    // Wiggle logic
    useEffect(() => {
        const interval = setInterval(() => {
            setWiggle(prev => (prev + 1));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const renderStage = () => {
        // SCALING
        let scale = 1;
        if (stage === 'BABY') scale = 0.6;
        if (stage === 'CHILD') scale = 0.8;
        if (stage === 'TEEN') scale = 0.9;

        // Colors
        const primary = color;
        const secondary = "#BA68C8";

        return (
            <g transform={`scale(${scale}) translate(${50 * (1 - scale)}, ${50 * (1 - scale)})`}>
                <g className={isEating ? "chomp" : "hover"}>

                    {/* Tentacles (Animated via Sine waves or simple CSS) */}
                    {[...Array(5)].map((_, i) => (
                        <path key={i}
                            d={`M ${30 + i * 10} 70 Q ${30 + i * 10 + Math.sin(wiggle + i) * 5} 85 ${35 + i * 10} 95`}
                            stroke={primary} strokeWidth="6" fill="none" strokeLinecap="round"
                        />
                    ))}

                    {/* Head */}
                    <path d="M 20 40 Q 50 10 80 40 Q 90 60 80 80 Q 50 90 20 80 Q 10 60 20 40 Z" fill={primary} />

                    {/* SPOTS */}
                    <circle cx="30" cy="30" r="3" fill="rgba(255,255,255,0.2)" />
                    <circle cx="70" cy="35" r="5" fill="rgba(255,255,255,0.2)" />
                    <circle cx="50" cy="25" r="4" fill="rgba(255,255,255,0.2)" />

                    {/* EYES (Multi) */}
                    {!isSleeping ? (
                        <g>
                            {/* Main Eye */}
                            <circle cx="50" cy="50" r="12" fill="white" />
                            <circle cx="50" cy="50" r="5" fill="black" />
                            <circle cx="52" cy="48" r="2" fill="white" />

                            {/* Side Eyes */}
                            <circle cx="30" cy="45" r="8" fill="white" />
                            <circle cx="30" cy="45" r="3" fill="black" />

                            <circle cx="70" cy="45" r="8" fill="white" />
                            <circle cx="70" cy="45" r="3" fill="black" />
                        </g>
                    ) : (
                        <g>
                            <path d="M 40 50 Q 50 55 60 50" stroke="#ddd" strokeWidth="2" fill="none" />
                            <text x="45" y="40" fontSize="15" fill="white">zzz</text>
                        </g>
                    )}

                    {/* Antenna */}
                    <path d="M 50 20 L 50 10" stroke={primary} strokeWidth="3" />
                    <circle cx="50" cy="10" r="5" fill="#E040FB" className="glow" />
                </g>
            </g>
        );
    };

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <ellipse cx="50" cy="95" rx="25" ry="5" fill="rgba(0,0,0,0.3)" />
            {renderStage()}
            <style>{`
                .hover { animation: floatAlien 4s infinite ease-in-out; }
                .glow { animation: pulseGlow 2s infinite; }
                .chomp { animation: chompAlien 0.2s infinite; }

                @keyframes floatAlien { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes pulseGlow { 0%, 100% { fill: #E040FB; } 50% { fill: #FF80AB; } }
                @keyframes chompAlien { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.9); } }
             `}</style>
        </svg>
    );
};

export default AlienRenderer;
