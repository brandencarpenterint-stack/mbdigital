
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
                .select('id, display_name, avatar_url, high_scores, coins, friend_code, squad')
                .order('last_seen', { ascending: false })
                .limit(1000);

            const STAT_MAP = {
                'crazy_fishing': 'fishHighWeight', // Usually fish_caught or fishHighWeight
                'crazy_fishing_count': 'fishCaught',
                'neon_snake': 'snakeHighScore',
                'flappy_mascot': 'flappyHighScore',
                'galaxy_defender': 'galaxyHighScore',
                'neon_bricks': 'brickHighScore',
                'whack_a_mole': 'whackHighScore',
                'memory_match': 'memoryHighScore',
                'face_runner': 'faceRunnerHighScore',
                'merch_jump': 'merchJumpHighScore',
                'bro_cannon': 'broCannonHighScore',
                'sub_hunter': 'subHunterHighScore',
                'cosmic_slots': 'slotsHighScore' // Assuming this key exists if tracked, or handled specially
            };

            if (data) {
                const standardized = data.map(p => {
                    let score = 0;
                    if (gameId === 'xp') score = p.xp || 0;
                    else if (gameId === 'coins') score = p.coins || 0;
                    else if (gameId === 'arena_wins') score = (p.high_scores && p.high_scores.arena_wins) ? parseInt(p.high_scores.arena_wins) : 0;
                    else {
                        const camelKey = STAT_MAP[gameId];
                        // check if high_scores exists, then try the direct gameId, then the camelKey mapped one.
                        if (p.high_scores) {
                            score = parseInt(p.high_scores[gameId]) || parseInt(p.high_scores[camelKey]) || 0;
                        }
                    }

                    return {
                        id: p.id,
                        player: p.display_name,
                        code: p.friend_code,
                        squad: p.squad,
                        score: score,
                        avatar: p.avatar_url,
                        stats: p.high_scores || {} // Pass full stats along just in case
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
