export const DAILY_TEMPLATES = [
    // FISHING
    { id: 'fish_10', desc: 'Catch 10 Fish', target: 10, reward: 50, type: 'fishCaught', game: 'fishing' },
    { id: 'fish_rare', desc: 'Catch 1 Rare Fish', target: 1, reward: 100, type: 'legendariesCaught', game: 'fishing' },

    // BRICK BREAKER
    { id: 'brick_500', desc: 'Score 500 in Bricks', target: 500, reward: 50, type: 'brickHighScore', condition: 'gt', game: 'brick' },
    { id: 'brick_level_3', desc: 'Reach Level 3 in Bricks', target: 3, reward: 80, type: 'brickMaxLevel', condition: 'gt', game: 'brick' },

    // FLAPPY
    { id: 'flappy_20', desc: 'Score 20 in Flappy', target: 20, reward: 50, type: 'flappyHighScore', condition: 'gt', game: 'flappy' },
    { id: 'flappy_50', desc: 'Score 50 in Flappy', target: 50, reward: 100, type: 'flappyHighScore', condition: 'gt', game: 'flappy' },

    // MERCH JUMP
    { id: 'jump_5000', desc: 'Score 5000 in Jump', target: 5000, reward: 75, type: 'merchJumpHighScore', condition: 'gt', game: 'jump' },

    // CYBER PLINKO
    { id: 'plinko_drops_5', desc: 'Drop 5 Cyber Plinko Chips', target: 5, reward: 75, type: 'plinkoDrops', game: 'plinko' },
    { id: 'plinko_win_100', desc: 'Score 100+ CP on Plinko', target: 100, reward: 120, type: 'plinkoHighScore', condition: 'gt', game: 'plinko' },

    // CYBER WHEEL
    { id: 'wheel_spin_1', desc: 'Spin the Cyber Wheel', target: 1, reward: 100, type: 'wheelSpins', game: 'wheel' },

    // NEON DRIFT
    { id: 'drift_2000', desc: 'Reach 2,000 PTS in Neon Drift', target: 2000, reward: 150, type: 'neonDriftHighScore', condition: 'gt', game: 'drift' },

    // CYBER DERBY
    { id: 'derby_races_3', desc: 'Race in 3 Cyber Derbies', target: 3, reward: 120, type: 'derbyRaces', game: 'derby' },
    { id: 'derby_win_1', desc: 'Win 1st Place in Cyber Derby', target: 1, reward: 200, type: 'derbyWins', game: 'derby' },

    // CYBER 21 BLACKJACK
    { id: 'bj_wins_3', desc: 'Win 3 Cyber 21 Hands', target: 3, reward: 125, type: 'blackjackWins', game: 'blackjack' },
    { id: 'bj_natural_1', desc: 'Hit a Natural Blackjack (21)', target: 1, reward: 200, type: 'blackjackBlackjacks', game: 'blackjack' },

    // CYBER PINBALL 2088
    { id: 'pinball_score_5000', desc: 'Score 5,000 PTS in Cyber Pinball', target: 5000, reward: 120, type: 'pinballHighScore', condition: 'gt', game: 'pinball' },
    { id: 'pinball_multiball_1', desc: 'Spell B-R-O & Trigger Pinball Multiball', target: 1, reward: 180, type: 'pinballMultiballs', game: 'pinball' },

    // CYBER CRASH: MOONSHOT
    { id: 'crash_bail_2x', desc: 'Bail Out at 2.0x+ in Cyber Crash', target: 2, reward: 125, type: 'crashHighScore', condition: 'gt', game: 'crash' },
    { id: 'crash_wins_3', desc: 'Win 3 Cyber Crash Rounds', target: 3, reward: 150, type: 'crashWins', game: 'crash' },

    // MERCH DEFENSE
    { id: 'defense_wave_5', desc: 'Survive to Wave 5 in Merch Defense', target: 5, reward: 150, type: 'merchDefenseHighScore', condition: 'gt', game: 'defense' },

    // HYPE DROP
    { id: 'hypedrop_unbox_1', desc: 'Unbox a Mystery Crate', target: 1, reward: 100, type: 'cratesOpened', game: 'unboxing' },

    // COSMIC SLOTS
    { id: 'slots_spin_10', desc: 'Spin Slots 10 Times', target: 10, reward: 50, type: 'slotsSpins', game: 'slots' },

    // GALAXY
    { id: 'galaxy_1000', desc: 'Score 1000 in Galaxy', target: 1000, reward: 60, type: 'galaxyHighScore', condition: 'gt', game: 'galaxy' },
    { id: 'galaxy_boss', desc: 'Defeat a Galaxy Boss', target: 1, reward: 150, type: 'bossKills', game: 'galaxy' },
    { id: 'galaxy_boss_3', desc: 'Defeat 3 Bosses', target: 3, reward: 250, type: 'bossKills', game: 'galaxy' },

    // SNAKE
    { id: 'snake_50', desc: 'Score 50 in Snake', target: 50, reward: 50, type: 'snakeHighScore', condition: 'gt', game: 'snake' },

    
    // FACTION & SOCIAL
    { id: 'faction_donate_100', desc: 'Donate 100 FP to your Faction', target: 100, reward: 50, type: 'factionPointsDonated', game: 'social' },
    { id: 'faction_donate_1000', desc: 'Donate 1,000 FP to your Faction', target: 1000, reward: 200, type: 'factionPointsDonated', game: 'social' },
    { id: 'bunker_pie_1', desc: 'Throw a Custard Pie', target: 1, reward: 100, type: 'bunkerPiesThrown', game: 'social' },
    { id: 'bunker_smoke_1', desc: 'Vanish with a Smoke Bomb', target: 1, reward: 100, type: 'bunkerSmokesUsed', game: 'social' },
    { id: 'underworld_duel_1', desc: 'Match an Underworld Wager', target: 1, reward: 250, type: 'underworldWagersMatched', game: 'social' },

    // GENERAL
    { id: 'play_3', desc: 'Play 3 Games', target: 3, reward: 40, type: 'gamesPlayedCount', game: 'general' },
    { id: 'coins_50', desc: 'Earn 50 Coins', target: 50, reward: 50, type: 'coinsEarnedToday', game: 'general' },
    { id: 'coins_100', desc: 'Earn 100 Coins', target: 100, reward: 100, type: 'coinsEarnedToday', game: 'general' },

    // SOCIAL / RIVALS
    { id: 'rival_1', desc: 'Defeat a Rival', target: 1, reward: 150, type: 'rivalsDefeated', game: 'social' }
];

export const WEEKLY_TEMPLATES = [
    { id: 'week_crash_10x', desc: 'WEEKLY: Moonshot Bailout at 10.0x+ in Cyber Crash', target: 10, reward: 950, type: 'crashHighScore', condition: 'gt', game: 'crash', isWeekly: true },
    { id: 'week_pinball_25000', desc: 'WEEKLY: Score 25,000 PTS in Cyber Pinball', target: 25000, reward: 850, type: 'pinballHighScore', condition: 'gt', game: 'pinball', isWeekly: true },
    { id: 'week_bj_15', desc: 'WEEKLY: Win 15 Hands of Cyber 21', target: 15, reward: 850, type: 'blackjackWins', game: 'blackjack', isWeekly: true },
    { id: 'week_derby_10', desc: 'WEEKLY: Win 10 Cyber Derby Races', target: 10, reward: 900, type: 'derbyWins', game: 'derby', isWeekly: true },
    { id: 'week_plinko_50', desc: 'WEEKLY: Drop 50 Plinko Chips', target: 50, reward: 600, type: 'plinkoDrops', game: 'plinko', isWeekly: true },
    { id: 'week_drift_10000', desc: 'WEEKLY: Reach 10,000 PTS in Neon Drift', target: 10000, reward: 800, type: 'neonDriftHighScore', condition: 'gt', game: 'drift', isWeekly: true },
    { id: 'week_fish_50', desc: 'WEEKLY: Catch 50 Fish', target: 50, reward: 500, type: 'fishCaught', game: 'fishing', isWeekly: true },
    { id: 'week_games_40', desc: 'WEEKLY: Play 40 Games', target: 40, reward: 400, type: 'gamesPlayedCount', game: 'general', isWeekly: true },
    { id: 'week_rares_5', desc: 'WEEKLY: Catch 5 Rare Fish', target: 5, reward: 800, type: 'legendariesCaught', game: 'fishing', isWeekly: true },
    { id: 'week_boss_5', desc: 'WEEKLY: Defeat 5 Bosses', target: 5, reward: 1000, type: 'bossKills', game: 'galaxy', isWeekly: true }
];
