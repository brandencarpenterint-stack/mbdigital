import { s as supabase } from "./index-ofeJceFx.js";
const MOCK_DATA = [];
const LeaderboardService = {
  getTopScores: async (gameId) => {
    try {
      if (!supabase) return MOCK_DATA;
      const { data, error } = await supabase.from("profiles").select("display_name, high_scores, coins, friend_code, xp, squad").order("coins", { ascending: false }).limit(50);
      const STAT_MAP = {
        "crazy_fishing": "crazyFishingHighScore",
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
            const key = STAT_MAP[gameId] || gameId;
            score = p.high_scores && p.high_scores[key] ? parseInt(p.high_scores[key]) : 0;
          }
          return {
            player: p.display_name,
            code: p.friend_code,
            squad: p.squad,
            score
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
