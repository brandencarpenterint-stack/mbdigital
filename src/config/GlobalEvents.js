export const GLOBAL_EVENTS = [
    {
        id: 'VOID_CALM',
        name: 'Void Calm',
        description: 'The universe is quiet today. No special effects.',
        chance: 0.6,
        color: '#000000',
        effect: null
    },
    {
        id: 'GLITCH_STORM',
        name: 'Glitch Storm',
        description: 'Reality is destabilizing. Electronic items are cheaper.',
        chance: 0.15,
        color: '#00ff00',
        effect: 'glitch'
    },
    {
        id: 'NEON_RAIN',
        name: 'Neon Rain',
        description: 'Acid rain from the Cyber City. Cleaning needs increased.',
        chance: 0.15,
        color: '#ff00ff',
        effect: 'rain'
    },
    {
        id: 'GOLD_RUSH',
        name: 'Gold Rush',
        description: 'Economic boom! Coin rewards doubled.',
        chance: 0.1,
        color: 'gold',
        effect: 'sparkle'
    }
];

export const getDailyEvent = () => {
    // Deterministic random based on Date
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    const seed = Math.abs(hash) / 2147483647; // 0-1 float

    let cumulative = 0;
    for (const event of GLOBAL_EVENTS) {
        cumulative += event.chance;
        if (seed < cumulative) return event;
    }
    return GLOBAL_EVENTS[0];
};
