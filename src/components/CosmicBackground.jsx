import React from 'react';

const CosmicBackground = () => {
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

            {/* 3. SYNTHWAVE GRID (Floor) */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-50%',
                width: '200%',
                height: '40%',
                background: 'linear-gradient(transparent 0%, rgba(188, 19, 254, 0.2) 1px, transparent 1px), linear-gradient(90deg, transparent 0%, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(400px) rotateX(60deg)',
                animation: 'gridScroll 4s linear infinite',
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
                background: 'radial-gradient(ellipse at bottom, rgba(0, 243, 255, 0.2) 0%, transparent 70%)',
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

                @keyframes gridScroll {
                    0% { background-position: 0 0; }
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
