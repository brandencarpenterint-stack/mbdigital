/**
 * Character Skin Particle Auras & Trails Configuration
 * Maps all 25 protected skins in public/assets/skins/ to procedural visual prestige effects.
 * Zero modifications to source images — all effects generated procedurally via Canvas and CSS shaders.
 */

export const AURA_TYPES = {
    CYBER_GLITCH: {
        id: 'CYBER_GLITCH',
        name: 'Cyber Glitch',
        tagline: 'Digital chromatic aberration & matrix slices',
        primaryColor: '#00f0ff',
        secondaryColor: '#ff0055',
        glowColor: 'rgba(0, 240, 255, 0.45)',
        trailType: 'glitch',
        particleCount: 8,
        speed: 6,
        description: 'Splits RGB channels with holographic glitch slices and stutter echoes.'
    },
    SOLAR_FLARE: {
        id: 'SOLAR_FLARE',
        name: 'Solar Flare',
        tagline: 'Fiery ember sparks & coronal heatwave',
        primaryColor: '#ff5500',
        secondaryColor: '#ffcc00',
        glowColor: 'rgba(255, 85, 0, 0.45)',
        trailType: 'fire',
        particleCount: 12,
        speed: 7,
        description: 'Ignites rising golden-orange embers with a burning plasma aura.'
    },
    VOID_MATRIX: {
        id: 'VOID_MATRIX',
        name: 'Void Matrix',
        tagline: 'Neon green binary code & radioactive stream',
        primaryColor: '#00ff66',
        secondaryColor: '#003311',
        glowColor: 'rgba(0, 255, 102, 0.45)',
        trailType: 'matrix',
        particleCount: 10,
        speed: 5,
        description: 'Cascades glowing digital rain and gravitational dark matter particles.'
    },
    PRISM_NOVA: {
        id: 'PRISM_NOVA',
        name: 'Prism Nova',
        tagline: 'Holographic rainbow flares & spectral shimmer',
        primaryColor: '#ff00cc',
        secondaryColor: '#00f0ff',
        glowColor: 'rgba(255, 0, 204, 0.45)',
        trailType: 'prism',
        particleCount: 10,
        speed: 6,
        description: 'Emits chromatic spectral flares and starlight diffraction diamonds.'
    },
    GOLD_MIDAS: {
        id: 'GOLD_MIDAS',
        name: 'Gold Midas',
        tagline: 'Gilded coin sparkles & amber prestige bloom',
        primaryColor: '#ffd700',
        secondaryColor: '#ff9900',
        glowColor: 'rgba(255, 215, 0, 0.45)',
        trailType: 'gold',
        particleCount: 9,
        speed: 5,
        description: 'Shimmers with pure gilded sparks and spinning currency tokens.'
    },
    ASTRO_PLASMA: {
        id: 'ASTRO_PLASMA',
        name: 'Astro Plasma',
        tagline: 'Deep space ion trails & celestial rings',
        primaryColor: '#38bdf8',
        secondaryColor: '#818cf8',
        glowColor: 'rgba(56, 189, 248, 0.45)',
        trailType: 'plasma',
        particleCount: 8,
        speed: 7,
        description: 'Radiates pulsing ion satellite rings and cosmic nebula clouds.'
    }
};

/**
 * Mapping of all 25 skins to their assigned Mythic / Legendary visual prestige aura
 */
export const SKIN_AURA_MAP = {
    // 1. OG Bro
    'face_default': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_default.png': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 2. Astro
    'face_astro': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_astro.png': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' },

    // 3. Bear
    'face_bear': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'EPIC', rarity: 'Epic' },
    '/assets/skins/face_bear.png': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'EPIC', rarity: 'Epic' },

    // 4. Bunny
    'face_bunny': { aura: AURA_TYPES.PRISM_NOVA, tier: 'EPIC', rarity: 'Epic' },
    '/assets/skins/face_bunny.png': { aura: AURA_TYPES.PRISM_NOVA, tier: 'EPIC', rarity: 'Epic' },

    // 5. Cyan Bunny
    'face_bunny_blue': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_bunny_blue.png': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'MYTHIC', rarity: 'Mythic' },

    // 6. Street Bunny Hoodie
    'face_bunny_hoodie': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_bunny_hoodie.png': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 7. Cyber Cat
    'face_cat': { aura: AURA_TYPES.PRISM_NOVA, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_cat.png': { aura: AURA_TYPES.PRISM_NOVA, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 8. Dino
    'face_dino': { aura: AURA_TYPES.VOID_MATRIX, tier: 'EPIC', rarity: 'Epic' },
    '/assets/skins/face_dino.png': { aura: AURA_TYPES.VOID_MATRIX, tier: 'EPIC', rarity: 'Epic' },

    // 9. Dark Dino
    'face_dino_dark': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_dino_dark.jpg': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },

    // 10. Pepe Frog
    'face_frog': { aura: AURA_TYPES.VOID_MATRIX, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_frog.png': { aura: AURA_TYPES.VOID_MATRIX, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 11. Gamer (Hacker)
    'face_gamer': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_gamer.png': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'MYTHIC', rarity: 'Mythic' },

    // 12. Hype Hoodie
    'face_hoodie': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_hoodie.png': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 13. Bronze Hoodie
    'face_hoodie_brown': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'EPIC', rarity: 'Epic' },
    '/assets/skins/face_hoodie_brown.png': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'EPIC', rarity: 'Epic' },

    // 14. Money Maker
    'face_money': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_money.png': { aura: AURA_TYPES.GOLD_MIDAS, tier: 'MYTHIC', rarity: 'Mythic' },

    // 15. Spooky Pumpkin
    'face_pumpkin': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_pumpkin.png': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },

    // 16. Rainbow Prism
    'face_rainbow': { aura: AURA_TYPES.PRISM_NOVA, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_rainbow.png': { aura: AURA_TYPES.PRISM_NOVA, tier: 'MYTHIC', rarity: 'Mythic' },

    // 17. Skater
    'face_skater': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_skater.jpg': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 18. Cosmic Space
    'face_space': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_space.png': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },

    // 19. Dark Space Obsidian
    'face_space_dark': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_space_dark.jpg': { aura: AURA_TYPES.VOID_MATRIX, tier: 'MYTHIC', rarity: 'Mythic' },

    // 20. Monochrome BW
    'face_standard_bw': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/face_standard_bw.png': { aura: AURA_TYPES.CYBER_GLITCH, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 21. Star Supernova
    'face_star': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_star.png': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },

    // 22. Dark Star
    'face_star_dark': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/face_star_dark.jpg': { aura: AURA_TYPES.SOLAR_FLARE, tier: 'MYTHIC', rarity: 'Mythic' },

    // 23. Jumper
    'jump_guy': { aura: AURA_TYPES.PRISM_NOVA, tier: 'LEGENDARY', rarity: 'Legendary' },
    '/assets/skins/jump_guy.png': { aura: AURA_TYPES.PRISM_NOVA, tier: 'LEGENDARY', rarity: 'Legendary' },

    // 24. Founder Logo
    'logo_main': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/logo_main.png': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' },

    // 25. Cyber Typography
    'logo_typography': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' },
    '/assets/skins/logo_typography.png': { aura: AURA_TYPES.ASTRO_PLASMA, tier: 'MYTHIC', rarity: 'Mythic' }
};

/**
 * Helper to retrieve aura config for any skin object or skin path/id
 */
export const getSkinAura = (skinOrPath) => {
    if (!skinOrPath) return { aura: AURA_TYPES.GOLD_MIDAS, tier: 'LEGENDARY', rarity: 'Legendary' };

    let lookupKey = '';
    if (typeof skinOrPath === 'string') {
        lookupKey = skinOrPath;
    } else if (skinOrPath.id) {
        lookupKey = skinOrPath.id;
    } else if (skinOrPath.src) {
        lookupKey = skinOrPath.src;
    }

    // Try direct lookup
    if (SKIN_AURA_MAP[lookupKey]) return SKIN_AURA_MAP[lookupKey];

    // Strip path or extensions if needed
    const filename = lookupKey.split('/').pop()?.split('?')[0];
    if (filename && SKIN_AURA_MAP[filename]) return SKIN_AURA_MAP[filename];
    const baseId = filename ? filename.replace(/\.[^/.]+$/, '') : '';
    if (baseId && SKIN_AURA_MAP[baseId]) return SKIN_AURA_MAP[baseId];

    return { aura: AURA_TYPES.GOLD_MIDAS, tier: 'LEGENDARY', rarity: 'Legendary' };
};
