export const ACHIEVEMENTS = [
    // --- CRAZY FISHING ---
    { id: 'fish_novice', title: 'Novice Angler', description: 'Catch 10 fish.', reward: 'Bronze Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 10 },
    { id: 'fish_amateur', title: 'Weekend Fisher', description: 'Catch 50 fish.', reward: 'Silver Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 50 },
    { id: 'fish_pro', title: 'Pro Angler', description: 'Catch 100 fish.', reward: 'Gold Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 100 },
    { id: 'fish_master', title: 'Fishing Legend', description: 'Catch 500 fish.', reward: 'Diamond Rod', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 500 },
    { id: 'fish_legend_1', title: 'Lucky Catch', description: 'Catch 1 Legendary.', reward: 'Shiny Lure', game: 'Crazy Fishing', condition: (s) => s.legendariesCaught >= 1 },
    { id: 'fish_legend_5', title: 'Myth Hunter', description: 'Catch 5 Legendaries.', reward: 'Poseidon Trident', game: 'Crazy Fishing', condition: (s) => s.legendariesCaught >= 5 },

    // --- GALAXY DEFENDER ---
    { id: 'galaxy_novice', title: 'Cadet', description: 'Score 500 points.', reward: 'Bronze Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 500 },
    { id: 'galaxy_pro', title: 'Captain', description: 'Score 2000 points.', reward: 'Gold Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 2000 },
    { id: 'galaxy_master', title: 'Admiral', description: 'Score 5000 points.', reward: 'Plasma Cannon', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 5000 },
    { id: 'galaxy_boss_1', title: 'Giant Slayer', description: 'Defeat the Boss.', reward: 'Boss Trophy', game: 'Galaxy Defender', condition: (s) => s.bossKills >= 1 },
    { id: 'galaxy_boss_5', title: 'Extinction Event', description: 'Defeat 5 Bosses.', reward: 'Alien Head', game: 'Galaxy Defender', condition: (s) => s.bossKills >= 5 },

    // --- NEON BRICKS ---
    { id: 'brick_novice', title: 'Brick Layer', description: 'Score 100 points.', reward: 'Bronze Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 100 },
    { id: 'brick_pro', title: 'Demolitionist', description: 'Score 1000 points.', reward: 'Silver Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 1000 },
    { id: 'brick_master', title: 'Breakout King', description: 'Score 5000 points.', reward: 'Gold Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 5000 },
    { id: 'brick_level_5', title: 'Neon Survivor', description: 'Reach Level 5.', reward: 'Flame Ball', game: 'Neon Bricks', condition: (s) => s.brickMaxLevel >= 5 },
    { id: 'brick_level_10', title: 'The Architect', description: 'Reach Level 10.', reward: 'Matrix Skin', game: 'Neon Bricks', condition: (s) => s.brickMaxLevel >= 10 },

    // --- SNAKE ---
    { id: 'snake_novice', title: 'Worm', description: 'Score 10 points.', reward: 'Apple', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 10 },
    { id: 'snake_pro', title: 'Python', description: 'Score 50 points.', reward: 'Golden Apple', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 50 },
    { id: 'snake_master', title: 'Basilisk', description: 'Score 100 points.', reward: 'Diamond Scale', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 100 },
    { id: 'snake_time_5', title: 'Survivor', description: 'Survive 5 minutes.', reward: 'Clock', game: 'Neon Snake', condition: (s) => s.snakeMaxTime >= 300 },

    // --- GENERAL ---
    { id: 'arcade_gamer', title: 'Gamer', description: 'Play all games.', reward: 'Controller', game: 'General', condition: (s) => ['fishing', 'galaxy', 'brick', 'snake'].every(g => s.gamesPlayed?.includes(g)) },
    { id: 'arcade_rich', title: 'Pocket Money', description: 'Earn 100 coins total.', reward: 'Coin Stack', game: 'General', condition: (s) => getCoins(s) >= 100 },
    { id: 'arcade_millionaire', title: 'Tycoon', description: 'Earn 1000 coins total.', reward: 'Money Bag', game: 'General', condition: (s) => getCoins(s) >= 1000 }
];

// Helper to get coins safely if not in stats object directly (it's in localStorage usually)
// But for context check, we might need it in stats. 
// For now, we'll rely on updateStat syncing 'totalCoins' if we add it.
// Actually, let's just check localStorage via a getter if possible, but stats is passed in.
// workaround: We will assume 'totalEarned' stat is added later, or just remove coin achievement for safety if coin tracking isn't robust yet in context.
// Let's keep it but use a placeholder condition that always returns false if field missing.
const getCoins = () => parseInt(localStorage.getItem('arcadeCoins')) || 0;

