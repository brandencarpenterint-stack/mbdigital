
export const PET_TYPES = {
    SOOT: { id: 'SOOT', name: 'Soot Sprite', description: 'Just a little guy.' },
    SLIME: { id: 'SLIME', name: 'Gooey', description: 'Sticky and sweet.' },
    ROBOT: { id: 'ROBOT', name: 'BitBot', description: 'Beep boop.' },
    GHOST: { id: 'GHOST', name: 'Wisp', description: 'Boo!' },
    DRAGON: { id: 'DRAGON', name: 'Ignis', description: 'Hot stuff.' }
};

export const EVOLUTION_STAGES = {
    EGG: 'EGG',
    BABY: 'BABY',
    CHILD: 'CHILD',
    TEEN: 'TEEN',
    ADULT: 'ADULT',
    LEGENDNING: 'LEGEND' // Special final form?
};

// Thresholds are cumulative XP needed to reach this stage
export const XP_THRESHOLDS = {
    BABY: 50,
    CHILD: 300,
    TEEN: 1200,
    ADULT: 4000,
    LEGEND: 15000
};

export const EVOLUTION_CRITERIA = {
    // FROM BABY TO CHILD
    BABY: [
        {
            toType: 'ROBOT',
            condition: (stats) => stats.intelligence > 30 || stats.played_minigames > 10,
            priority: 10
        },
        {
            toType: 'SLIME',
            condition: (stats) => stats.hungerAvg > 80, // Well fed
            priority: 10
        },
        {
            toType: 'GHOST',
            condition: (stats) => stats.nightOwlScore > 5, // Active at night
            priority: 10
        },
        {
            toType: 'SOOT',
            condition: () => true, // Fallback
            priority: 1
        }
    ],

    // FROM CHILD TO TEEN (Branching within Type)
    CHILD: [
        // SOOT LINE
        { fromType: 'SOOT', toType: 'SOOT', condition: () => true, priority: 1 },

        // ROBOT LINE
        { fromType: 'ROBOT', toType: 'ROBOT', condition: () => true, priority: 1 },

        // SLIME LINE
        { fromType: 'SLIME', toType: 'SLIME', condition: () => true, priority: 1 },

        // GHOST LINE
        { fromType: 'GHOST', toType: 'GHOST', condition: () => true, priority: 1 },
    ],

    // TO ADULT
    TEEN: [
        { fromType: 'SOOT', toType: 'SOOT', check: 'balanced' },
        { fromType: 'ROBOT', toType: 'ROBOT', check: 'tech' },
        { fromType: 'SLIME', toType: 'SLIME', check: 'goo' },
        { fromType: 'GHOST', toType: 'GHOST', check: 'spiritual' },
        // Special mutations
        { fromType: 'SLIME', toType: 'DRAGON', condition: (stats) => stats.happy > 95 && stats.hunger > 95, priority: 100 }
    ]
};
