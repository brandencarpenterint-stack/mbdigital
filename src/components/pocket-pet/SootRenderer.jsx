
import React, { useEffect, useState } from 'react';

const SootRenderer = ({ mood = 'happy', isSleeping = false, isEating = false, stage = 'BABY', skin = null }) => {
    const [blink, setBlink] = useState(false);

    // Blinking logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSleeping) {
                setBlink(true);
                setTimeout(() => setBlink(false), 150);
            }
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, [isSleeping]);

    // --- STAGE RENDERERS ---

    const renderEgg = () => (
        <g className="wobble">
            <ellipse cx="50" cy="50" rx="30" ry="38" fill="#f0f0f0" />
            <path d="M 35 20 Q 50 40 65 20" stroke="#ddd" strokeWidth="2" fill="none" />
            <circle cx="40" cy="40" r="3" fill="#e0e0e0" />
            <circle cx="60" cy="60" r="5" fill="#e0e0e0" />
        </g>
    );

    const renderBaby = () => (
        <g className={isEating ? "bounce" : "float"}>
            {/* Main Body */}
            <circle cx="50" cy="50" r="25" fill="#111" />

            {/* Fuzz */}
            {[...Array(12)].map((_, i) => (
                <circle key={i} cx={50 + 22 * Math.cos(i * 30 * Math.PI / 180)} cy={50 + 22 * Math.sin(i * 30 * Math.PI / 180)} r="6" fill="#111" />
            ))}

            {/* Eyes (Big relative to body) */}
            {!isSleeping ? (
                <g>
                    <circle cx="40" cy="48" r="8" fill="white" />
                    <circle cx={40 + (mood === 'sad' ? 0 : 2)} cy="48" r="3" fill="black" />
                    <circle cx="60" cy="48" r="8" fill="white" />
                    <circle cx={60 + (mood === 'sad' ? 0 : 2)} cy="48" r="3" fill="black" />
                    {blink && <path d="M 32 48 L 48 48 M 52 48 L 68 48" stroke="#111" strokeWidth="3" />}
                </g>
            ) : <text x="40" y="55" fontSize="20" fill="white">💤</text>}
        </g>
    );

    const renderChild = () => (
        <g className={isEating ? "bounce" : "slide"}>
            {/* Bigger Body */}
            <circle cx="50" cy="50" r="35" fill="#111" />
            {/* Fuzz */}
            {[...Array(20)].map((_, i) => (
                <circle key={i} cx={50 + 32 * Math.cos(i * 18 * Math.PI / 180)} cy={50 + 32 * Math.sin(i * 18 * Math.PI / 180)} r="7" fill="#111" />
            ))}

            {/* Tiny Feet */}
            <ellipse cx="40" cy="85" rx="5" ry="3" fill="black" />
            <ellipse cx="60" cy="85" rx="5" ry="3" fill="black" />

            {/* Eyes */}
            {!isSleeping ? (
                <g>
                    <circle cx="35" cy="45" r="10" fill="white" />
                    <circle cx="37" cy="45" r="4" fill="black" />
                    <circle cx="65" cy="45" r="10" fill="white" />
                    <circle cx="67" cy="45" r="4" fill="black" />
                    {blink && <path d="M 25 45 L 45 45 M 55 45 L 75 45" stroke="#111" strokeWidth="3" />}
                </g>
            ) : <path d="M 30 45 Q 40 50 50 45 M 55 45 Q 65 50 75 45" stroke="#ccc" strokeWidth="2" fill="none" />}

            {/* Leaf Hat */}
            <path d="M 50 15 Q 50 0 60 -5 Q 60 5 50 15" fill="#76ff03" />
        </g>
    );

    const renderTeen = () => (
        <g className="vibrate">
            {/* Spiky Body */}
            <circle cx="50" cy="50" r="38" fill="#111" />
            {[...Array(15)].map((_, i) => (
                <path key={i} d={`M 50 50 L ${50 + 50 * Math.cos(i * 24 * Math.PI / 180)} ${50 + 50 * Math.sin(i * 24 * Math.PI / 180)} L ${50 + 40 * Math.cos((i * 24 + 12) * Math.PI / 180)} ${50 + 40 * Math.sin((i * 24 + 12) * Math.PI / 180)} Z`} fill="#111" />
            ))}

            {/* Sunglasses? No, just angry eyes */}
            {!isSleeping ? (
                <g>
                    {/* Angled Eyes */}
                    <path d="M 30 35 L 45 45 L 30 50 Z" fill="white" />
                    <circle cx="35" cy="42" r="2" fill="black" />
                    <path d="M 70 35 L 55 45 L 70 50 Z" fill="white" />
                    <circle cx="65" cy="42" r="2" fill="black" />
                </g>
            ) : <text x="40" y="50" fill="white">💤</text>}
        </g>
    );

    const renderAdult = () => (
        <g className="breathe">
            {/* Totoro-ish Shape */}
            <ellipse cx="50" cy="55" rx="45" ry="40" fill="#111" />
            {/* Ears */}
            <path d="M 20 30 L 15 5 L 35 25 Z" fill="#111" />
            <path d="M 80 30 L 85 5 L 65 25 Z" fill="#111" />

            {/* White Belly */}
            <ellipse cx="50" cy="70" rx="30" ry="20" fill="#222" />
            <path d="M 40 65 L 45 70 L 50 65 M 50 65 L 55 70 L 60 65" stroke="#444" strokeWidth="2" fill="none" />

            {/* Eyes */}
            {!isSleeping ? (
                <g>
                    <circle cx="30" cy="40" r="8" fill="white" />
                    <circle cx="32" cy="40" r="3" fill="black" />
                    <circle cx="70" cy="40" r="8" fill="white" />
                    <circle cx="72" cy="40" r="3" fill="black" />
                    {blink && <path d="M 22 40 L 38 40 M 62 40 L 78 40" stroke="#111" strokeWidth="3" />}

                    {/* Smile */}
                    <path d="M 40 50 Q 50 60 60 50" stroke="white" strokeWidth="2" fill="none" />
                </g>
            ) : (
                <g>
                    <path d="M 25 40 L 35 40 M 65 40 L 75 40" stroke="#ccc" strokeWidth="2" />
                    <circle cx="70" cy="50" r="10" fill="rgba(200,255,255,0.5)" stroke="white" />
                </g>
            )}

            {/* Umbrella? */}
            <path d="M 90 60 L 95 40 L 100 60 Z" fill="red" />
        </g>
    );

    const effectiveStage = (skin === 'bro_egg') ? 'BABY' : stage;

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Shadow */}
            <ellipse cx="50" cy="95" rx="30" ry="5" fill="rgba(0,0,0,0.3)" />

            {effectiveStage === 'EGG' && renderEgg()}
            {effectiveStage === 'BABY' && renderBaby()}
            {(effectiveStage === 'CHILD' || effectiveStage === 'TEEN') && (effectiveStage === 'TEEN' ? renderTeen() : renderChild())}
            {(effectiveStage === 'ADULT' || effectiveStage === 'ELDER') && renderAdult()}

            <style>{`
                .float { animation: float 3s ease-in-out infinite; }
                .bounce { animation: bounce 0.5s infinite; }
                .wobble { animation: wobble 2s infinite ease-in-out; }
                .slide { animation: slide 4s infinite ease-in-out; }
                .vibrate { animation: vibrate 0.2s infinite; }
                .breathe { animation: breathe 4s infinite ease-in-out; }

                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes bounce { 0%, 100% { transform: scale(1.1); } 50% { transform: scale(0.9); } }
                @keyframes wobble { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                @keyframes slide { 0%, 100% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
                @keyframes vibrate { 0% { transform: translateX(-1px); } 50% { transform: translateX(1px); } }
                @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
            `}</style>
        </svg>
    );
};

export default SootRenderer;
