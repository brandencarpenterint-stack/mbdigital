
import React from 'react';
import SootRenderer from './SootRenderer';
import SlimeRenderer from './SlimeRenderer';
import BotRenderer from './BotRenderer';
import GhostRenderer from './GhostRenderer';

const PocketPet = ({ type = 'SOOT', stage = 'EGG', mood = 'happy', isSleeping = false, isEating = false, skin = null }) => {

    // Egg is universal (mostly)
    if (stage === 'EGG') {
        return <SootRenderer stage="EGG" mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
    }

    switch (type) {
        case 'SLIME':
            return <SlimeRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
        case 'ROBOT':
            return <BotRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
        case 'GHOST':
            return <GhostRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
        case 'SOOT':
        default:
            return <SootRenderer stage={stage} mood={mood} isSleeping={isSleeping} isEating={isEating} skin={skin} />;
    }
};

export default PocketPet;
