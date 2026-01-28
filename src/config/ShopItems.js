export const SHOP_ITEMS = [
    // --- SNAKE SKINS ---
    { id: 'snake_default', type: 'snake_skin', name: 'Neon Green', price: 0, category: 'snake', description: 'The classic look.' },
    { id: 'snake_gold', type: 'snake_skin', name: 'Midas Touch', price: 500, category: 'snake', description: 'Solid gold snake. Fancy!' },
    { id: 'snake_rainbow', type: 'snake_skin', name: 'Rainbow', price: 1000, category: 'snake', description: 'Changes colors as you move!' },
    { id: 'snake_ghost', type: 'snake_skin', name: 'Ghost', price: 750, category: 'snake', description: 'Spooky transparent vibes.' },

    // --- FISHING RODS ---
    { id: 'rod_default', type: 'fishing_rod', name: 'Bamboo Pole', price: 0, category: 'fishing', description: 'Ol\' reliable.' },
    { id: 'rod_fiberglass', type: 'fishing_rod', name: 'Fiberglass', price: 300, category: 'fishing', description: 'Sleek and sturdy.' },
    { id: 'rod_gold', type: 'fishing_rod', name: 'Golden Rod', price: 1500, category: 'fishing', description: 'Attracts legendary fish... maybe.' },

    // --- BRICK PADDLES ---
    { id: 'paddle_default', type: 'brick_paddle', name: 'Standard', price: 0, category: 'brick', description: 'Basic paddle.' },
    { id: 'paddle_flame', type: 'brick_paddle', name: 'Flame', price: 600, category: 'brick', description: 'Hot stuff!' },
    { id: 'paddle_ice', type: 'brick_paddle', name: 'Glacier', price: 600, category: 'brick', description: 'Cool as ice.' },

    // --- GALAXY SHIPS ---
    { id: 'ship_default', type: 'galaxy_ship', name: 'Interceptor', price: 0, category: 'galaxy', description: 'Standard issue.' },
    { id: 'ship_ufo', type: 'galaxy_ship', name: 'Invader', price: 1200, category: 'galaxy', description: 'Fly the enemy ship!' },
];

export const CATEGORIES = [
    { id: 'snake', name: 'Neon Snake', icon: '🐍' },
    { id: 'fishing', name: 'Crazy Fishing', icon: '🎣' },
    { id: 'brick', name: 'Neon Bricks', icon: '🧱' },
    { id: 'galaxy', name: 'Galaxy Defender', icon: '🚀' },
];
