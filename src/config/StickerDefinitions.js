export const STICKER_COLLECTIONS = [
    {
        id: 'cyber_snacks',
        name: 'Cyber Snacks',
        description: 'Neon-infused metabolic fuel.',
        reward: { coins: 1000 },
        sheet: '/assets/stickers/cyber_food.png',
        items: [
            { id: 'neon_ramen', name: 'Neon Ramen', rarity: 'common', row: 0, col: 0 },
            { id: 'glitch_burger', name: 'Glitch Burger', rarity: 'common', row: 0, col: 1 },
            { id: 'void_soda', name: 'Void Soda', rarity: 'common', row: 0, col: 2 },
            { id: 'pixel_pizza', name: 'Pixel Pizza', rarity: 'rare', row: 1, col: 0 },
            { id: 'cyber_donut', name: 'Cyber Donut', rarity: 'rare', row: 1, col: 1 },
            { id: 'data_taco', name: 'Data Taco', rarity: 'rare', row: 1, col: 2 },
            { id: 'chip_cookie', name: 'Chip Cookie', rarity: 'epic', row: 2, col: 0 },
            { id: 'synth_sushi', name: 'Synth Sushi', rarity: 'epic', row: 2, col: 1 },
            { id: 'laser_cream', name: 'Laser Cream', rarity: 'legendary', row: 2, col: 2 }
        ]
    },
    {
        id: 'retro_tech',
        name: 'Retro Tech',
        description: 'Obsolete hardware from 1999.',
        reward: { coins: 1500 },
        sheet: '/assets/stickers/retro_tech.png',
        items: [
            { id: 'floppy_disk', name: 'Floppy Disk', rarity: 'common', row: 0, col: 0 },
            { id: 'handheld_console', name: 'GameBoy', rarity: 'common', row: 0, col: 1 },
            { id: 'brick_phone', name: 'Brick Phone', rarity: 'common', row: 0, col: 2 },
            { id: 'cassette', name: 'Cassette Tape', rarity: 'rare', row: 1, col: 0 },
            { id: 'crt_monitor', name: 'CRT Monitor', rarity: 'rare', row: 1, col: 1 },
            { id: 'robo_head', name: 'Bot Head', rarity: 'rare', row: 1, col: 2 },
            { id: 'camcorder', name: 'Camcorder', rarity: 'epic', row: 2, col: 0 },
            { id: 'cd_player', name: 'DiscMan', rarity: 'epic', row: 2, col: 1 },
            { id: 'pc_tower', name: 'Tower PC', rarity: 'legendary', row: 2, col: 2 }
        ]
    },
    {
        id: 'space_loot',
        name: 'Space Loot',
        description: 'Artifacts from the outer rim.',
        reward: { coins: 2000 },
        sheet: '/assets/stickers/space_loot.png',
        items: [
            { id: 'alien_skull', name: 'Xeno Skull', rarity: 'common', row: 0, col: 0 },
            { id: 'meteor_shard', name: 'Meteor Shard', rarity: 'common', row: 0, col: 1 },
            { id: 'ray_gun', name: 'Ray Gun', rarity: 'common', row: 0, col: 2 },
            { id: 'crystal_gem', name: 'Power Crystal', rarity: 'rare', row: 1, col: 0 },
            { id: 'ufo', name: 'UFO', rarity: 'rare', row: 1, col: 1 },
            { id: 'astro_helm', name: 'Helmet', rarity: 'rare', row: 1, col: 2 },
            { id: 'warp_drive', name: 'Warp Cell', rarity: 'epic', row: 2, col: 0 },
            { id: 'ox_tank', name: 'O2 Tank', rarity: 'epic', row: 2, col: 1 },
            { id: 'mech_claw', name: 'Mech Claw', rarity: 'legendary', row: 2, col: 2 }
        ]
    }
];

export const RARITY_WEIGHTS = {
    common: 60,
    rare: 30,
    epic: 9,
    legendary: 1
};
