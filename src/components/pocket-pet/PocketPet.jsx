
import React from 'react';
import SootRenderer from './SootRenderer';
import SlimeRenderer from './SlimeRenderer';
import BotRenderer from './BotRenderer';
import GhostRenderer from './GhostRenderer';
import DinoRenderer from './DinoRenderer';
import AlienRenderer from './AlienRenderer';
import OrbRenderer from './OrbRenderer';

const PocketPet = ({ type = 'SOOT', stage = 'EGG', mood = 'happy', isSleeping = false, isEating = false, skin = null, color = null, effect = null, accessory = null }) => {

    // Egg is universal (mostly)
    if (stage === 'EGG') {
        return <SootRenderer stage="EGG" mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
    }

    let PetComponent;
    
    let baseType = type;
    if (type.includes('SLIME')) baseType = 'SLIME';
    if (type.includes('ORB') || type === 'ANGEL') baseType = 'ORB';
    if (type.includes('DINO') || type === 'DRAGON') baseType = 'DINO';
    if (type.includes('GHOST') || type === 'SHADOW' || type === 'VAMPIRE') baseType = 'GHOST';
    if (type.includes('BOT') || type.includes('MECH') || type === 'CYBORG') baseType = 'ROBOT';
    if (type.includes('ALIEN') || type === 'MUTANT') baseType = 'ALIEN';

    switch (baseType) {
        case 'SLIME':
            PetComponent = <SlimeRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'ROBOT':
            PetComponent = <BotRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'GHOST':
            PetComponent = <GhostRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'DINO':
            PetComponent = <DinoRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'ALIEN':
            PetComponent = <AlienRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'ORB':
            PetComponent = <OrbRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
        case 'SOOT':
        default:
            PetComponent = <SootRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />; break;
    }

    // Wrap for Effects
    const isShiny = color === '#FFD700';
    const isRainbow = effect === 'rainbow';

    // Style Transforms for Effects
    let effectStyle = { position: 'relative', width: '100%', height: '100%' };

    if (effect === 'ghost') {
        effectStyle.opacity = 0.5;
        effectStyle.filter = 'blur(2px) grayscale(100%)';
    }
    if (effect === 'glitch') {
        effectStyle.animation = 'glitch 0.3s infinite';
        effectStyle.filter = 'hue-rotate(90deg) contrast(200%)';
    }
    if (effect === 'jitter') {
        effectStyle.animation = 'shake 0.1s infinite';
    }

    return (
        <div style={effectStyle} className={effect}>
            {isShiny && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="url(#shinyParams)" opacity="0.3" />
                        <defs>
                            <radialGradient id="shinyParams">
                                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {[...Array(5)].map((_, i) => (
                            <circle key={i} cx={50 + 30 * Math.cos(i)} cy={50 + 30 * Math.sin(i)} r="2" fill="white">
                                <animate attributeName="opacity" values="0;1;0" dur={`${1 + i * 0.5}s`} repeatCount="indefinite" />
                            </circle>
                        ))}
                    </svg>
                </div>
            )}
            {/* Rainbow Aura */}
            {isRainbow && (
                <div style={{
                    position: 'absolute', inset: -5, borderRadius: '50%',
                    background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
                    zIndex: -2, opacity: 0.5, filter: 'blur(5px)',
                    animation: 'spin 2s linear infinite'
                }} />
            )}

            {/* CSS for Keyframes (Injected here or assume global index.css) */}
            <style>{`
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(2px); }
                    75% { transform: translateX(-2px); }
                    100% { transform: translateX(0); } 
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>

            {PetComponent}

            {/* CYBER ACCESSORIES OVERLAY */}
            {accessory === 'acc_shades' && (
                <div style={{
                    position: 'absolute',
                    top: '26%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 25,
                    fontSize: '1.5rem',
                    filter: 'drop-shadow(0 0 6px #00f0ff)',
                    pointerEvents: 'none',
                    lineHeight: 1
                }} title="Cyber Shades">
                    🕶️
                </div>
            )}

            {accessory === 'acc_chain' && (
                <div style={{
                    position: 'absolute',
                    top: '52%',
                    left: '50%',
                    transform: 'translateX(-50%) scale(1.15)',
                    zIndex: 25,
                    fontSize: '1.3rem',
                    filter: 'drop-shadow(0 0 8px #ffd700)',
                    pointerEvents: 'none',
                    lineHeight: 1
                }} title="Gold Cuban Chain">
                    ⛓️
                </div>
            )}

            {accessory === 'acc_vr' && (
                <div style={{
                    position: 'absolute',
                    top: '22%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 25,
                    fontSize: '1.6rem',
                    filter: 'drop-shadow(0 0 10px #00ffcc)',
                    pointerEvents: 'none',
                    lineHeight: 1
                }} title="VR Netrunner Visor">
                    🥽
                </div>
            )}

            {accessory === 'acc_halo' && (
                <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 25,
                    fontSize: '1.5rem',
                    filter: 'drop-shadow(0 0 12px #ffd700)',
                    animation: 'float 2s ease-in-out infinite',
                    pointerEvents: 'none',
                    lineHeight: 1
                }} title="Celestial Angel Halo">
                    😇
                </div>
            )}

            {accessory === 'acc_horns' && (
                <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 25,
                    fontSize: '1.5rem',
                    filter: 'drop-shadow(0 0 12px #ff0055)',
                    pointerEvents: 'none',
                    lineHeight: 1
                }} title="Cyber Oni Horns">
                    😈
                </div>
            )}
        </div>
    );
};

export default PocketPet;
