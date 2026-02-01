
import React from 'react';
import SootRenderer from './SootRenderer';
import SlimeRenderer from './SlimeRenderer';
import BotRenderer from './BotRenderer';
import GhostRenderer from './GhostRenderer';
import DinoRenderer from './DinoRenderer';

const PocketPet = ({ type = 'SOOT', stage = 'EGG', mood = 'happy', isSleeping = false, isEating = false, skin = null, color = null }) => {

    // Egg is universal (mostly)
    if (stage === 'EGG') {
        return <SootRenderer stage="EGG" mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
    }

    switch (type) {
        case 'SLIME':
            return <SlimeRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />;
        case 'ROBOT':
            return <BotRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />;
        case 'GHOST':
            return <GhostRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />;
        case 'DINO':
            return <DinoRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />;
        case 'SOOT':
        default:
            return <SootRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} color={color} />;
    }
};

export default PocketPet;
