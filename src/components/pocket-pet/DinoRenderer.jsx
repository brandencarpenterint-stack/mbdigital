
import React, { useEffect, useState } from 'react';

const DinoRenderer = ({ mood = 'happy', isSleeping = false, isEating = false, stage = 'BABY', color = '#4CAF50' }) => {
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSleeping) {
                setBlink(true);
                setTimeout(() => setBlink(false), 150);
            }
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, [isSleeping]);

    const renderStage = () => {
        // SCALING BASED ON STAGE
        let scale = 1;
        if (stage === 'BABY') scale = 0.6;
        if (stage === 'CHILD') scale = 0.8;
        if (stage === 'TEEN') scale = 0.9;

        return (
            <g transform={`scale(${scale}) translate(${50 * (1 - scale)}, ${50 * (1 - scale)})`}>
                <g className={isEating ? "bite" : "walk"}>
                    {/* Tail */}
                    <path d="M 20 60 Q 10 50 15 40 L 40 60 Z" fill={color} />

                    {/* Body */}
                    <ellipse cx="50" cy="65" rx="30" ry="25" fill={color} />

                    {/* Head */}
                    <circle cx="70" cy="40" r="20" fill={color} />

                    {/* Spikes */}
                    <path d="M 30 45 L 35 30 L 40 45 Z" fill="#2E7D32" />
                    <path d="M 45 45 L 50 30 L 55 45 Z" fill="#2E7D32" />
                    <path d="M 60 45 L 65 30 L 70 45 Z" fill="#2E7D32" />

                    {/* Legs */}
                    <path d="M 35 80 L 35 95 L 45 95 L 45 80" fill={color} stroke="#1B5E20" strokeWidth="2" />
                    <path d="M 65 80 L 65 95 L 75 95 L 75 80" fill={color} stroke="#1B5E20" strokeWidth="2" />

                    {/* Face */}
                    {!isSleeping ? (
                        <g>
                            <circle cx="75" cy="35" r="5" fill="white" />
                            <circle cx="77" cy="35" r="2" fill="black" />
                            {blink && <path d="M 70 35 L 80 35" stroke="#1B5E20" strokeWidth="2" />}

                            {/* Mouth */}
                            <path d="M 75 45 L 85 45" stroke="#1B5E20" strokeWidth="2" />
                        </g>
                    ) : (
                        <text x="70" y="40" fontSize="15">💤</text>
                    )}
                </g>
            </g>
        );
    };

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <ellipse cx="50" cy="95" rx="30" ry="5" fill="rgba(0,0,0,0.3)" />
            {renderStage()}
            <style>{`
                .bite { animation: bite 0.5s infinite; }
                .walk { animation: hover 3s infinite ease-in-out; }
                @keyframes bite { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
                @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
             `}</style>
        </svg>
    );
};

export default DinoRenderer;
