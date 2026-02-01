
import React from 'react';
import SootRenderer from './SootRenderer';
import SlimeRenderer from './SlimeRenderer';
import BotRenderer from './BotRenderer';
import GhostRenderer from './GhostRenderer';
import DinoRenderer from './DinoRenderer';
import AlienRenderer from './AlienRenderer';
import OrbRenderer from './OrbRenderer';

const PocketPet = ({ type = 'SOOT', stage = 'EGG', mood = 'happy', isSleeping = false, isEating = false, skin = null, color = null }) => {

    // Egg is universal (mostly)
    if (stage === 'EGG') {
        return <SootRenderer stage="EGG" mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
    }

    let PetComponent;

    switch (type) {
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

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                        {/* Sparkles */}
                        {[...Array(5)].map((_, i) => (
                            <circle key={i} cx={50 + 30 * Math.cos(i)} cy={50 + 30 * Math.sin(i)} r="2" fill="white">
                                <animate attributeName="opacity" values="0;1;0" dur={`${1 + i * 0.5}s`} repeatCount="indefinite" />
                            </circle>
                        ))}
                    </svg>
                </div>
            )}
            {PetComponent}
        </div>
    );
};

export default PocketPet;
