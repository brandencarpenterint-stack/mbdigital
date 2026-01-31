export const UNDERGROUND_ITEMS = [
    {
        id: 'void_essence',
        name: 'Void Essence',
        price: 500,
        icon: '⚫',
        desc: 'Consume to become one with the void. (Ghost Mode)',
        effect: { effect: 'ghost', duration: 30000 }
    },
    {
        id: 'glitch_pill',
        name: 'Glitch Pill',
        price: 100,
        icon: '💊',
        desc: 'Randomizes all stats. Feeling lucky?',
        effect: { type: 'gamble' }
    },
    {
        id: 'cursed_idol',
        name: 'Cursed Idol',
        price: 666,
        icon: '🗿',
        desc: 'Sacrifice Happiness for Wealth.',
        effect: { type: 'sacrifice', happy: -50, coins: 1000 }
    },
    {
        id: 'hack_tool',
        name: 'Zero Day Exploit',
        price: 1337,
        icon: '💾',
        desc: 'Unlocks the secret "Hacker" skin.',
        effect: { unlockSkin: 'pb_cyber' }
    },
    {
        id: 'midnight_oil',
        name: 'Midnight Oil',
        price: 200,
        icon: '🛢️',
        desc: 'Max Energy, but creates a mess.',
        effect: { energy: 100, hygiene: -100 }
    }
];
