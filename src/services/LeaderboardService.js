
import { supabase } from '../lib/supabaseClient';

const MOCK_DATA = [];

export const LeaderboardService = {
    getTopScores: async (gameId) => {
        try {
            if (!supabase) return MOCK_DATA;

            // Fetch profiles with high scores
            // Ideally we'd filter WHERE high_scores->gameId IS NOT NULL
            // But JSON filter syntax is tricky without exact setup.
            // We'll fetch top 50 active players (by coins or xp?) to likely get high scores.
            // Or just fetch latest 100 active.

            const { data, error } = await supabase
                .from('profiles')
                .select('display_name, high_scores, coins, friend_code, xp')
                .order('coins', { ascending: false }) // Initial heuristic: rich players play more
                .limit(50);

            if (data) {
                const standardized = data.map(p => {
                    let score = 0;
                    if (gameId === 'xp') score = p.xp || 0;
                    else if (gameId === 'coins') score = p.coins || 0;
                    else score = (p.high_scores && p.high_scores[gameId]) ? parseInt(p.high_scores[gameId]) : 0;

                    return {
                        player: p.display_name,
                        code: p.friend_code,
                        score: score
                    };
                });

                // Sort by actual score for the requested game
                return standardized
                    .filter(s => s.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5); // Top 5
            }
            return [];
        } catch (e) {
            console.error("Leaderboard Fetch Error:", e);
            return [];
        }
    },

    // submitScore is handled by GamificationContext.stats sync, 
    // but we can add a direct helper if needed. 
    // For now, we rely on the profile sync.
};
