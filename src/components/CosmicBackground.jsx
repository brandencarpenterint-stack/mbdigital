import React from 'react';
import { useGamification } from '../context/GamificationContext';

const CosmicBackground = () => {
    const { currentEvent } = useGamification() || {}; // Optional chain in case used outside provider
    const evt = currentEvent?.id;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            background: 'var(--bg-deep)'
        }}>
            {/* 1. DISTANT STARS (Parallax Layer 1) */}
            <div className="stars-small" />

            {/* 2. CLOSER STARS (Parallax Layer 2) */}
            <div className="stars-medium" />

            {/* EVENT LAYER: METEORS */}
            {evt === 'METEOR_SHOWER' && (
                <>
                    <div className="meteor" style={{ top: '10%', left: '80%', animationDelay: '0s' }} />
                    <div className="meteor" style={{ top: '20%', left: '40%', animationDelay: '2s' }} />
                    <div className="meteor" style={{ top: '5%', left: '20%', animationDelay: '4s' }} />
                    <div className="meteor" style={{ top: '40%', left: '90%', animationDelay: '1.5s' }} />
                </>
            )}

            {/* EVENT LAYER: RAIN */}
            {evt === 'NEON_RAIN' && <div className="rain-layer" />}

            {/* EVENT LAYER: GLITCH */}
            {evt === 'GLITCH_STORM' && <div className="glitch-overlay" />}

            {/* 3. SYNTHWAVE GRID (Floor) */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-50%',
                width: '200%',
                height: '40%',
                background: evt === 'GLITCH_STORM'
                    ? 'linear-gradient(transparent 0%, #0f0 1px, transparent 1px), linear-gradient(90deg, transparent 0%, #0f0 1px, transparent 1px)'
                    : 'linear-gradient(transparent 0%, rgba(188, 19, 254, 0.2) 1px, transparent 1px), linear-gradient(90deg, transparent 0%, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(400px) rotateX(60deg)',
                animation: evt === 'GLITCH_STORM' ? 'gridGlitch 0.2s infinite' : 'gridScroll 4s linear infinite',
                opacity: 0.5,
                maskImage: 'linear-gradient(to bottom, transparent, black)'
            }} />

            {/* 4. HORIZON GLOW */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '30%',
                background: evt === 'METEOR_SHOWER' ? 'radial-gradient(ellipse at bottom, rgba(255, 170, 0, 0.3) 0%, transparent 70%)'
                    : evt === 'NEON_RAIN' ? 'radial-gradient(ellipse at bottom, rgba(255, 0, 255, 0.3) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse at bottom, rgba(0, 243, 255, 0.2) 0%, transparent 70%)',
                zIndex: 1
            }} />

            <style>{`
                .stars-small {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        radial-gradient(1px 1px at 10% 10%, #fff, transparent),
                        radial-gradient(1px 1px at 20% 30%, #fff, transparent),
                        radial-gradient(1px 1px at 40% 70%, #fff, transparent),
                        radial-gradient(1px 1px at 60% 40%, #fff, transparent),
                        radial-gradient(1px 1px at 80% 80%, #fff, transparent),
                        radial-gradient(1px 1px at 90% 20%, #fff, transparent);
                    background-size: 200px 200px;
                    opacity: 0.3;
                    animation: starFlash 5s infinite;
                }
                
                .stars-medium {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 15% 15%, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 50% 50%, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 85% 85%, rgba(255,255,255,0.8), transparent);
                    background-size: 300px 300px;
                    opacity: 0.4;
                    animation: starMove 100s linear infinite;
                }

                /* METEORS */
                .meteor {
                    position: absolute; width: 200px; height: 2px;
                    background: linear-gradient(90deg, #fff, transparent);
                    transform: rotate(-45deg);
                    animation: shoot 5s infinite ease-in;
                    opacity: 0;
                }

                @keyframes shoot {
                    0% { transform: translate(0, 0) rotate(-45deg); opacity: 1; }
                    20% { transform: translate(-500px, 500px) rotate(-45deg); opacity: 0; }
                    100% { opacity: 0; }
                }

                /* NEON RAIN */
                .rain-layer {
                    position: absolute; inset: 0;
                    background-image: linear-gradient(180deg, rgba(255,0,255,0.5), transparent);
                    background-size: 2px 50px;
                    animation: rain 0.5s linear infinite;
                    opacity: 0.3;
                }
                @keyframes rain { from { background-position: 0 0; } to { background-position: 0 50px; } }

                /* GLITCH */
                .glitch-overlay {
                    position: absolute; inset: 0;
                    background: rgba(0, 255, 0, 0.05);
                    animation: glitchFlash 2s infinite;
                    pointer-events: none;
                }
                @keyframes glitchFlash {
                    0% { opacity: 0; transform: translateX(0); }
                    5% { opacity: 0.2; transform: translateX(5px); }
                    10% { opacity: 0; transform: translateX(0); }
                    100% { opacity: 0; }
                }

                @keyframes gridScroll {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
                
                @keyframes gridGlitch {
                     0% { background-position: 0 0; }
                    50% { background-position: 10px 20px; filter: hue-rotate(90deg); }
                    100% { background-position: 0 40px; }
                }

                @keyframes starMove {
                    from { background-position: 0 0; }
                    to { background-position: 0 300px; }
                }

                @keyframes starFlash {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default CosmicBackground;
