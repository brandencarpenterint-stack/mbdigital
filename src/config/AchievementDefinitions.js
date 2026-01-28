export const ACHIEVEMENTS = [
    // --- CRAZY FISHING ---
    {
        id: 'fishing_first_catch',
        title: 'First Catch',
        description: 'Catch your first fish.',
        reward: 'Bronze Badge',
        game: 'Crazy Fishing',
        condition: (stats) => stats.fishCaught >= 1
    },
    {
        id: 'fishing_master',
        title: 'Master Angler',
        description: 'Catch 50 fish total.',
        reward: 'Golden Rod Skin',
        game: 'Crazy Fishing',
        condition: (stats) => stats.fishCaught >= 50
    },
    {
        id: 'fishing_legendary',
        title: 'Legendary Hunter',
        description: 'Catch a Legendary fish.',
        reward: 'Crown Badge',
        game: 'Crazy Fishing',
        condition: (stats) => stats.legendariesCaught >= 1
    },

    // --- GALAXY DEFENDER ---
    {
        id: 'galaxy_savior',
        title: 'Galaxy Savior',
        description: 'Defeat the Giant Head Boss.',
        reward: 'Laser Vision',
        game: 'Galaxy Defender',
        condition: (stats) => stats.bossKills >= 1
    },
    {
        id: 'galaxy_score_1000',
        title: 'Sharpshooter',
        description: 'Score 1000 points in one run.',
        reward: 'Silver Badge',
        game: 'Galaxy Defender',
        condition: (stats) => stats.galaxyHighScore >= 1000
    },

    // --- NEON BRICK BREAKER ---
    {
        id: 'brick_breaker_pro',
        title: 'Brick Breaker Pro',
        description: 'Score 500 points.',
        reward: 'Neon Ball',
        game: 'Neon Brick Breaker',
        condition: (stats) => stats.brickHighScore >= 500
    },

    // --- GENERAL ---
    {
        id: 'arcade_gamer',
        title: 'Arcade Gamer',
        description: 'Play every game at least once.',
        reward: 'Controller Badge',
        game: 'General',
        condition: (stats) => {
            const games = ['fishing', 'galaxy', 'brick', 'snake', 'whack'];
            return games.every(g => stats.gamesPlayed && stats.gamesPlayed.includes(g));
        }
    }
];
