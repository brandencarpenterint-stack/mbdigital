const STORAGE_KEY = 'merchboy_global_leaderboard';

// Mock Data
const MOCK_DATA = {
    'crazy_fishing': [
        { player: 'MerchBoyAdmin', score: 5000, date: Date.now() },
        { player: 'FishMaster99', score: 4200, date: Date.now() - 100000 },
        { player: 'NoobFisher', score: 120, date: Date.now() - 200000 },
    ],
    'galaxy_defender': [
        { player: 'StarLord', score: 2500, date: Date.now() },
        { player: 'AlienHunter', score: 1800, date: Date.now() - 50000 },
    ]
};

export const LeaderboardService = {
    getTopScores: async (gameId) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || MOCK_DATA;
        const scores = stored[gameId] || [];

        // Sort descending
        return scores.sort((a, b) => b.score - a.score).slice(0, 10);
    },

    submitScore: async (gameId, player, score) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || MOCK_DATA;
        if (!stored[gameId]) stored[gameId] = [];

        stored[gameId].push({ player, score, date: Date.now() });

        // Save
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

        return true;
    }
};
