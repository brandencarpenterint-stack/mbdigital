export const ACHIEVEMENTS = [ // Updated 2026-01-29
    // --- CRAZY FISHING (10) ---
    { id: 'fish_novice', title: 'Novice Angler', description: 'Catch 10 fish.', reward: 'Bronze Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 10 },
    { id: 'fish_amateur', title: 'Weekend Fisher', description: 'Catch 50 fish.', reward: 'Silver Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 50 },
    { id: 'fish_pro', title: 'Pro Angler', description: 'Catch 100 fish.', reward: 'Gold Hook', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 100 },
    { id: 'fish_master', title: 'Fishing Legend', description: 'Catch 500 fish.', reward: 'Diamond Rod', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 500 },
    { id: 'fish_god', title: 'Poseidon', description: 'Catch 1000 fish.', reward: 'Trident Skin', game: 'Crazy Fishing', condition: (s) => s.fishCaught >= 1000 },
    { id: 'fish_legend_1', title: 'Lucky Catch', description: 'Catch 1 Legendary.', reward: 'Shiny Lure', game: 'Crazy Fishing', condition: (s) => s.legendariesCaught >= 1 },
    { id: 'fish_legend_5', title: 'Myth Hunter', description: 'Catch 5 Legendaries.', reward: 'Mystic Bait', game: 'Crazy Fishing', condition: (s) => s.legendariesCaught >= 5 },
    { id: 'fish_boot', title: 'Boot Licker', description: 'Catch 5 Boots.', reward: 'Old Boot', game: 'Crazy Fishing', condition: (s) => (s.bootsCaught || 0) >= 5 },
    { id: 'fish_combo_5', title: 'On Fire', description: 'Get a 5x Combo.', reward: 'Fire Icon', game: 'Crazy Fishing', condition: (s) => (s.maxCombo || 0) >= 5 },
    {
        id: 'fish_night', title: 'Night Owl', description: 'Fish at night (8PM-4AM).', reward: 'Moon Lure', game: 'Crazy Fishing', condition: (s) => {
            const h = new Date().getHours();
            return (h >= 20 || h < 4) && s.fishCaught > 0; // Trigger when catching fish at night
        }
    },

    // --- GALAXY DEFENDER (8) ---
    { id: 'galaxy_novice', title: 'Cadet', description: 'Score 500 points.', reward: 'Bronze Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 500 },
    { id: 'galaxy_pro', title: 'Captain', description: 'Score 2000 points.', reward: 'Silver Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 2000 },
    { id: 'galaxy_master', title: 'Admiral', description: 'Score 5000 points.', reward: 'Gold Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 5000 },
    { id: 'galaxy_elite', title: 'Galactic Hero', description: 'Score 10,000 points.', reward: 'Platinum Badge', game: 'Galaxy Defender', condition: (s) => s.galaxyHighScore >= 10000 },
    { id: 'galaxy_boss_1', title: 'Giant Slayer', description: 'Defeat the Boss.', reward: 'Boss Trophy', game: 'Galaxy Defender', condition: (s) => s.bossKills >= 1 },
    { id: 'galaxy_boss_5', title: 'Extinction Event', description: 'Defeat 5 Bosses.', reward: 'Alien Head', game: 'Galaxy Defender', condition: (s) => s.bossKills >= 5 },
    { id: 'galaxy_waves_10', title: 'Survivor', description: 'Survive 10 Waves.', reward: 'Shield', game: 'Galaxy Defender', condition: (s) => (s.galaxyMaxWave || 0) >= 10 },
    { id: 'galaxy_untouchable', title: 'Untouchable', description: 'Win a wave without damage.', reward: 'Ghost Ship', game: 'Galaxy Defender', condition: (s) => s.galaxyPerfectWave === true },

    // --- NEON BRICKS (8) ---
    { id: 'brick_novice', title: 'Brick Layer', description: 'Score 100 points.', reward: 'Bronze Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 100 },
    { id: 'brick_pro', title: 'Demolitionist', description: 'Score 1000 points.', reward: 'Silver Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 1000 },
    { id: 'brick_master', title: 'Breakout King', description: 'Score 5000 points.', reward: 'Gold Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 5000 },
    { id: 'brick_god', title: 'Brick God', description: 'Score 10,000 points.', reward: 'Diamond Paddle', game: 'Neon Bricks', condition: (s) => s.brickHighScore >= 10000 },
    { id: 'brick_level_5', title: 'Neon Survivor', description: 'Reach Level 5.', reward: 'Flame Ball', game: 'Neon Bricks', condition: (s) => s.brickMaxLevel >= 5 },
    { id: 'brick_level_10', title: 'The Architect', description: 'Reach Level 10.', reward: 'Matrix Skin', game: 'Neon Bricks', condition: (s) => s.brickMaxLevel >= 10 },
    { id: 'brick_powerups', title: 'Hoarder', description: 'Collect 50 Powerups.', reward: 'Magnet', game: 'Neon Bricks', condition: (s) => (s.brickPowerups || 0) >= 50 },
    { id: 'brick_fast', title: 'Speed Demon', description: 'Clear Level 1 in 30s.', reward: 'Lightning', game: 'Neon Bricks', condition: (s) => s.brickFastClear === true },

    // --- SNAKE (6) ---
    { id: 'snake_novice', title: 'Worm', description: 'Score 10 points.', reward: 'Apple', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 10 },
    { id: 'snake_pro', title: 'Python', description: 'Score 50 points.', reward: 'Golden Apple', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 50 },
    { id: 'snake_master', title: 'Basilisk', description: 'Score 100 points.', reward: 'Diamond Scale', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 100 },
    { id: 'snake_god', title: 'Ouroboros', description: 'Score 500 points.', reward: 'Infinity Loop', game: 'Neon Snake', condition: (s) => s.snakeHighScore >= 500 },
    { id: 'snake_time_5', title: 'Survivor', description: 'Survive 5 minutes.', reward: 'Clock', game: 'Neon Snake', condition: (s) => s.snakeMaxTime >= 300 },
    { id: 'snake_fill', title: 'Stuffed', description: 'Fill 50% of screen.', reward: 'Fat Snake', game: 'Neon Snake', condition: (s) => (s.snakeFillPercent || 0) >= 50 },

    // --- POCKET BRO (Evolution & Care) (12) ---
    { id: 'pb_hatch', title: 'New Life', description: 'Hatch a Pocket Bro.', reward: 'Egg Shell', game: 'Pocket Bro', condition: () => getPB().stage !== 'EGG' },
    { id: 'pb_baby', title: 'It\'s a Boy!', description: 'Reach Baby Stage.', reward: 'Pacifier', game: 'Pocket Bro', condition: () => getPB().stage === 'BABY' || getPB().xp > 50 },
    { id: 'pb_child', title: 'Growing Up', description: 'Reach Child Stage.', reward: 'Toy Car', game: 'Pocket Bro', condition: () => getPB().stage === 'CHILD' || getPB().xp > 200 },
    { id: 'pb_teen', title: 'Rebellion', description: 'Reach Teen Stage.', reward: 'Headphones', game: 'Pocket Bro', condition: () => getPB().stage === 'TEEN' || getPB().xp > 1000 },
    { id: 'pb_adult', title: 'All Grown Up', description: 'Reach Adult Stage.', reward: 'Briefcase', game: 'Pocket Bro', condition: () => getPB().stage === 'ADULT' || getPB().xp > 3000 },
    { id: 'pb_feed_10', title: 'Chef', description: 'Feed Bro 10 times.', reward: 'Spoon', game: 'Pocket Bro', condition: () => (getPB().stats?.feedCount || 0) >= 10 },
    { id: 'pb_feed_100', title: 'Master Chef', description: 'Feed Bro 100 times.', reward: 'Golden Spoon', game: 'Pocket Bro', condition: () => (getPB().stats?.feedCount || 0) >= 100 },
    { id: 'pb_play_50', title: 'Best Friend', description: 'Play 50 times.', reward: 'Ball', game: 'Pocket Bro', condition: () => (getPB().stats?.playCount || 0) >= 50 },
    { id: 'pb_clean_20', title: 'Janitor', description: 'Clean poop 20 times.', reward: 'Broom', game: 'Pocket Bro', condition: () => (getPB().stats?.cleanCount || 0) >= 20 },
    { id: 'pb_max_happy', title: 'Euphoria', description: 'Reach 100% Happiness.', reward: 'Smiley', game: 'Pocket Bro', condition: () => (getPB().stats?.happy || 0) >= 100 },
    { id: 'pb_sushi', title: 'Gourmet', description: 'Feed Premium Sushi.', reward: 'Chopsticks', game: 'Pocket Bro', condition: () => (getPB().stats?.ateSushi === true) },
    { id: 'pb_party', title: 'Party Animal', description: 'Make Bro Dance.', reward: 'Disco Ball', game: 'Pocket Bro', condition: () => (getPB().stats?.tempStatus === 'dance') },

    // --- FLAPPY MASCOT (5) ---
    { id: 'flappy_novice', title: 'First Flight', description: 'Score 10 points.', reward: 'Feather', game: 'Flappy Mascot', condition: (s) => s.flappyHighScore >= 10 },
    { id: 'flappy_pro', title: 'Barnstormer', description: 'Score 50 points.', reward: 'Goggles', game: 'Flappy Mascot', condition: (s) => s.flappyHighScore >= 50 },
    { id: 'flappy_master', title: 'Sky Captain', description: 'Score 100 points.', reward: 'Propeller', game: 'Flappy Mascot', condition: (s) => s.flappyHighScore >= 100 },
    { id: 'flappy_addict', title: 'Frequent Flyer', description: 'Play 20 times.', reward: 'Passport', game: 'Flappy Mascot', condition: () => getGameCount('flappy_mascot') >= 20 },
    { id: 'flappy_collector', title: 'Squadron', description: 'Unlock 5 Pilots.', reward: 'Hangar Key', game: 'Flappy Mascot', condition: () => getShop().unlocked.filter(id => id.startsWith('flappy_')).length >= 5 },

    // --- FACE RUNNER (4) ---
    { id: 'run_novice', title: '5k Runner', description: 'Reach 500m.', reward: 'Sweatband', game: 'Face Runner', condition: (s) => s.faceRunnerHighScore >= 500 },
    { id: 'run_pro', title: 'Marathon', description: 'Reach 2000m.', reward: 'Sneakers', game: 'Face Runner', condition: (s) => s.faceRunnerHighScore >= 2000 },
    { id: 'run_elite', title: 'Iron Man', description: 'Reach 5000m.', reward: 'Medal', game: 'Face Runner', condition: (s) => s.faceRunnerHighScore >= 5000 },
    { id: 'run_void', title: 'Void Walker', description: 'Reach The Void (10k).', reward: 'Black Hole', game: 'Face Runner', condition: (s) => s.faceRunnerHighScore >= 10000 },

    // --- ECONOMY (8) ---
    { id: 'eco_100', title: 'Pocket Money', description: 'Earn 100 coins.', reward: 'Coin Stack', game: 'Economy', condition: () => getCoins() >= 100 },
    { id: 'eco_1000', title: 'Tycoon', description: 'Earn 1000 coins.', reward: 'Money Bag', game: 'Economy', condition: () => getCoins() >= 1000 },
    { id: 'eco_10000', title: 'Millionaire', description: 'Earn 10,000 coins.', reward: 'Gold Bar', game: 'Economy', condition: () => getCoins() >= 10000 },
    { id: 'eco_spend_500', title: 'Shopper', description: 'Spend 500 coins.', reward: 'Receipt', game: 'Economy', condition: () => (getSpent() >= 500) },
    { id: 'eco_spend_5000', title: 'Big Spender', description: 'Spend 5000 coins.', reward: 'Credit Card', game: 'Economy', condition: () => (getSpent() >= 5000) },
    { id: 'eco_shop_5', title: 'Collector', description: 'Buy 5 different items.', reward: 'Shopping Cart', game: 'Economy', condition: () => (getInventoryCount() >= 5) },
    { id: 'eco_broke', title: 'Bankruptcy', description: 'Reach 0 coins after having 100.', reward: 'Empty Wallet', game: 'Economy', condition: () => getCoins() === 0 && getSpent() > 100 },

    // --- SOCIAL & STREAKS (15) ---
    { id: 'streak_3', title: 'Habit Former', description: '3 Day Streak.', reward: 'Bronze Flame', game: 'General', condition: () => getStreak() >= 3 },
    { id: 'streak_7', title: 'Dedicated', description: '7 Day Streak.', reward: 'Silver Flame', game: 'General', condition: () => getStreak() >= 7 },
    { id: 'streak_14', title: 'Obsessed', description: '14 Day Streak.', reward: 'Gold Flame', game: 'General', condition: () => getStreak() >= 14 },
    { id: 'streak_30', title: 'Legendary Streak', description: '30 Day Streak.', reward: 'Platinum Flame', game: 'General', condition: () => getStreak() >= 30 },
    { id: 'meta_all_games', title: 'Gamer', description: 'Play all arcade games.', reward: 'Joystick', game: 'General', condition: (s) => (s.gamesPlayed?.length >= 4) },
    { id: 'meta_clicker', title: 'Restless', description: 'Click 1000 times.', reward: 'Mouse', game: 'General', condition: (s) => (s.totalClicks || 0) >= 1000 },
    { id: 'meta_early', title: 'Early Bird', description: 'Play before 8AM.', reward: 'Coffee', game: 'General', condition: () => new Date().getHours() < 8 && new Date().getHours() > 4 },
    { id: 'meta_late', title: 'Night Owl', description: 'Play after Midnight.', reward: 'Moon', game: 'General', condition: () => new Date().getHours() < 4 },

    // --- HIDDEN / FUN (5) ---
    { id: 'secret_debug', title: 'Developer', description: 'Find a bug (or not).', reward: 'Bug', game: 'Hidden', condition: () => false }, // Placeholder
    { id: 'secret_leet', title: '1337', description: 'Have exactly 1337 coins.', reward: 'Hacker Mask', game: 'Hidden', condition: () => getCoins() === 1337 },
    { id: 'secret_love', title: 'Self Love', description: 'Click your own profile.', reward: 'Heart', game: 'Hidden', condition: (s) => s.viewedProfile === true },
    { id: 'secret_konami', title: 'The Code', description: 'Enter Konami Code.', reward: 'Contra Gun', game: 'Hidden', condition: (s) => s.konamiActivated === true },
    { id: 'secret_404', title: 'Lost', description: 'Visit a 404 page.', reward: 'Map', game: 'Hidden', condition: () => false }

    // TOTAL: ~66-67 Achievements
];

// --- HELPERS ---
const getPB = () => {
    try {
        return JSON.parse(localStorage.getItem('merchboy_pocket_bro')) || {};
    } catch { return {}; }
};

const getCoins = () => parseInt(localStorage.getItem('arcadeCoins')) || 0;

const getSpent = () => parseInt(localStorage.getItem('merchboy_total_spent')) || 0;

const getStreak = () => {
    try {
        const daily = JSON.parse(localStorage.getItem('merchboy_daily'));
        return daily?.streak || 0;
    } catch { return 0; }
};

const getShop = () => {
    try {
        return JSON.parse(localStorage.getItem('merchboy_shop')) || { unlocked: [], equipped: {} };
    } catch { return { unlocked: [], equipped: {} }; }
};

const getGameCount = (gameId) => {
    try {
        const stats = JSON.parse(localStorage.getItem('merchboy_stats')) || {};
        const played = stats.gamesPlayed || [];
        return played.filter(g => g === gameId).length;
    } catch { return 0; }
};

const getInventoryCount = () => {
    // Placeholder if inventory is tracked
    return 0;
}
