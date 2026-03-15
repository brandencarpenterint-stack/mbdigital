import { s as supabase } from "./index-BjlAyyZi.js";
const MOCK_DATA = [];
const LeaderboardService = {
  getTopScores: async (gameId) => {
    try {
      if (!supabase) return MOCK_DATA;
      const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url, high_scores, coins, friend_code, squad").order("last_seen", { ascending: false }).limit(1e3);
      const STAT_MAP = {
        "crazy_fishing": "fishHighWeight",
        // Usually fish_caught or fishHighWeight
        "crazy_fishing_count": "fishCaught",
        "neon_snake": "snakeHighScore",
        "flappy_mascot": "flappyHighScore",
        "galaxy_defender": "galaxyHighScore",
        "neon_bricks": "brickHighScore",
        "whack_a_mole": "whackHighScore",
        "memory_match": "memoryHighScore",
        "face_runner": "faceRunnerHighScore",
        "merch_jump": "merchJumpHighScore",
        "bro_cannon": "broCannonHighScore",
        "sub_hunter": "subHunterHighScore",
        "cosmic_slots": "slotsHighScore"
        // Assuming this key exists if tracked, or handled specially
      };
      if (data) {
        const standardized = data.map((p) => {
          let score = 0;
          if (gameId === "xp") score = p.xp || 0;
          else if (gameId === "coins") score = p.coins || 0;
          else if (gameId === "arena_wins") score = p.high_scores && p.high_scores.arena_wins ? parseInt(p.high_scores.arena_wins) : 0;
          else {
            const camelKey = STAT_MAP[gameId];
            if (p.high_scores) {
              score = parseInt(p.high_scores[gameId]) || parseInt(p.high_scores[camelKey]) || 0;
            }
          }
          return {
            id: p.id,
            player: p.display_name,
            code: p.friend_code,
            squad: p.squad,
            score,
            avatar: p.avatar_url,
            stats: p.high_scores || {}
            // Pass full stats along just in case
          };
        });
        return standardized.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
      }
      return [];
    } catch (e) {
      console.error("Leaderboard Fetch Error:", e);
      return [];
    }
  }
  // submitScore is handled by GamificationContext.stats sync, 
  // but we can add a direct helper if needed. 
  // For now, we rely on the profile sync.
};
export {
  LeaderboardService
};
