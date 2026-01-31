export const STICKER_COLLECTIONS = [
    {
        id: 'pixel_pals',
        name: 'Pixel Pals',
        reward: { coins: 500 },
        items: [
            { id: 'sticker_cat', name: '8-Bit Cat', rarity: 'common', icon: '🐱' },
            { id: 'sticker_dog', name: '8-Bit Dog', rarity: 'common', icon: '🐶' },
            { id: 'sticker_duck', name: '8-Bit Duck', rarity: 'common', icon: '🦆' },
            { id: 'sticker_slime', name: 'Green Slime', rarity: 'common', icon: '🦠' },
            { id: 'sticker_skull', name: 'Pixel Skull', rarity: 'rare', icon: '💀' },
        ]
    },
    {
        id: 'fast_food',
        name: 'Retro Diner',
        reward: { coins: 1000 },
        items: [
            { id: 'sticker_burger', name: 'Mega Burger', rarity: 'common', icon: '🍔' },
            { id: 'sticker_fries', name: 'Salty Fries', rarity: 'common', icon: '🍟' },
            { id: 'sticker_pizza', name: 'Gooey Pizza', rarity: 'rare', icon: '🍕' },
            { id: 'sticker_soda', name: 'Neon Soda', rarity: 'rare', icon: '🥤' },
            { id: 'sticker_taco', name: 'Spicy Taco', rarity: 'epic', icon: '🌮' },
        ]
    },
    {
        id: 'deep_space',
        name: 'Cosmic Voyage',
        reward: { skin: 'pb_alien' },
        items: [
            { id: 'sticker_rocket', name: 'Rocket', rarity: 'common', icon: '🚀' },
            { id: 'sticker_ufo', name: 'UFO', rarity: 'rare', icon: '🛸', image: '/assets/stickers/cosmic_ufo.png' },
            { id: 'sticker_planet', name: 'Saturn', rarity: 'rare', icon: '🪐', image: '/assets/stickers/cosmic_saturn.png' },
            { id: 'sticker_comet', name: 'Comet', rarity: 'epic', icon: '☄️' },
            { id: 'sticker_blackhole', name: 'Singularity', rarity: 'legendary', icon: '🕳️', image: '/assets/stickers/cosmic_blackhole.png' },
        ]
    }
];

export const RARITY_WEIGHTS = {
    common: 60,
    rare: 30,
    epic: 9,
    legendary: 1
};
