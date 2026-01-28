export const DAILY_TEMPLATES = [
    // FISHING
    { id: 'fish_10', desc: 'Catch 10 Fish', target: 10, reward: 50, type: 'fishCaught', game: 'fishing' },
    { id: 'fish_rare', desc: 'Catch 1 Rare Fish', target: 1, reward: 100, type: 'legendariesCaught', game: 'fishing' },

    // BRICK BREAKER
    { id: 'brick_500', desc: 'Score 500 in Bricks', target: 500, reward: 50, type: 'brickHighScore', condition: 'gt', game: 'brick' },
    { id: 'brick_level_3', desc: 'Reach Level 3 in Bricks', target: 3, reward: 80, type: 'brickMaxLevel', condition: 'gt', game: 'brick' },

    // GALAXY
    { id: 'galaxy_1000', desc: 'Score 1000 in Galaxy', target: 1000, reward: 60, type: 'galaxyHighScore', condition: 'gt', game: 'galaxy' },
    { id: 'galaxy_boss', desc: 'Defeat a Galaxy Boss', target: 1, reward: 150, type: 'bossKills', game: 'galaxy' },

    // SNAKE
    { id: 'snake_50', desc: 'Score 50 in Snake', target: 50, reward: 50, type: 'snakeHighScore', condition: 'gt', game: 'snake' },
    { id: 'snake_time', desc: 'Survive 3 Mins in Snake', target: 180, reward: 100, type: 'snakeMaxTime', condition: 'gt', game: 'snake' }, // 180 sec

    // GENERAL
    { id: 'play_3', desc: 'Play 3 Games', target: 3, reward: 40, type: 'gamesPlayedCount', game: 'general' },
    { id: 'coins_50', desc: 'Earn 50 Coins', target: 50, reward: 50, type: 'coinsEarnedToday', game: 'general' }
];
