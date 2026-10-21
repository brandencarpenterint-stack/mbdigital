// Comprehensive Game Catalog with controls, rules, and telemetry mapping

export const GAMES_CATALOG = {
    crash: {
        id: 'crash',
        title: 'CYBER CRASH 2088',
        category: 'casino',
        badge: 'ROCKET MULTIPLIER',
        icon: '🚀',
        bannerGradient: 'linear-gradient(135deg, #ff0055 0%, #ff7700 100%)',
        controls: 'Mouse / Tap: Bet & Manual Cash Out • Quick Cashout Preset Buttons',
        rules: 'A neon rocket ascends into cyberspace. Cash out before the system crashes to multiply your CP up to 100x!',
        getScore: (stats) => stats?.crashHighScore ? `${stats.crashHighScore}x` : '100x'
    },
    mines: {
        id: 'mines',
        title: 'CYBER MINES 2088',
        category: 'casino',
        badge: '5x5 GRID SCANNER',
        icon: '💣',
        bannerGradient: 'linear-gradient(135deg, #00ff66 0%, #00b4d8 100%)',
        controls: 'Mouse / Tap: Reveal Grid Tiles • Green Button: Cash Out Multiplier',
        rules: 'Uncover cyber gems while avoiding hidden EMP mines. Each safe tile compounds your multiplier payout.',
        getScore: (stats) => stats?.minesHighScore ? `${stats.minesHighScore}x` : 'EXP'
    },
    hilo: {
        id: 'hilo',
        title: 'CYBER HI-LO 2088',
        category: 'casino',
        badge: 'STREAK CARD PREDICTOR',
        icon: '📈',
        bannerGradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        controls: 'Mouse / Tap: Predict HIGHER / LOWER • Cash Out button to bank winnings',
        rules: 'Guess if the next hologram card is higher or lower. Build a streak to reach massive 180x payouts.',
        getScore: (stats) => stats?.hiloHighScore ? `${stats.hiloHighScore.toLocaleString()} CP` : '180x'
    },
    scratchers: {
        id: 'scratchers',
        title: 'CYBER SCRATCHERS',
        category: 'casino',
        badge: 'SILVER FOIL LOTTERY',
        icon: '🎫',
        bannerGradient: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
        controls: 'Mouse Drag / Touch: Scratch foil surface • Auto-Scratch button',
        rules: 'Scratch 3 matching symbols to win instant jackpot payouts up to 100,000 CP.',
        getScore: (stats) => stats?.scratchersHighScore ? `${stats.scratchersHighScore.toLocaleString()} CP` : '100k'
    },
    roulette: {
        id: 'roulette',
        title: 'CYBER ROULETTE',
        category: 'casino',
        badge: 'EUROPEAN SINGLE-ZERO',
        icon: '🎡',
        bannerGradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        controls: 'Mouse / Tap: Place Chips on table layout • Spin wheel button',
        rules: 'Place inside or outside bets. Straight-up single numbers pay out 35:1.',
        getScore: (stats) => '35:1'
    },
    blackjack: {
        id: 'blackjack',
        title: 'CYBER 21 BLACKJACK',
        category: 'casino',
        badge: 'HIGH-ROLLER VIP',
        icon: '🃏',
        bannerGradient: 'linear-gradient(135deg, #0d2818 0%, #00ff66 100%)',
        controls: 'Buttons: Hit, Stand, Double Down, Split',
        rules: 'Beat the cyber dealer without busting over 21. Natural 21 Blackjack pays 3:2.',
        getScore: (stats) => '3:2 VIP'
    },
    derby: {
        id: 'derby',
        title: 'CYBER DERBY',
        category: 'casino',
        badge: '8-BRO VELODROME',
        icon: '🐎',
        bannerGradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        controls: 'Mouse / Tap: Select Bro racer & bet type (Win / Place / Exacta)',
        rules: '8 cyber companions sprint down the high-speed track with randomized boosts and photo-finishes.',
        getScore: (stats) => 'EXACTA'
    },
    slots: {
        id: 'slots',
        title: 'COSMIC SLOTS',
        category: 'casino',
        badge: 'NEON 3-REEL',
        icon: '🎰',
        bannerGradient: 'linear-gradient(135deg, #ff00ff 0%, #7000ff 100%)',
        controls: 'Spacebar / Tap: Spin Reels • Auto-Spin toggle',
        rules: 'Align matching cyber fruits, 777s, or Bro wildcards across payout paylines.',
        getScore: (stats) => 'JACKPOT'
    },
    underworld: {
        id: 'underworld',
        title: 'THE UNDERWORLD',
        category: 'casino',
        badge: 'BLACK MARKET VAULT',
        icon: '🕶️',
        bannerGradient: 'linear-gradient(135deg, #330033 0%, #110022 100%)',
        controls: 'Mouse / Tap: Black market barter & shadow dice roll',
        rules: 'Exclusive underground bazaar for high-rollers and rogue netrunners.',
        getScore: (stats) => 'SHADOW'
    },
    dozer: {
        id: 'dozer',
        title: 'CYBER COIN DOZER',
        category: 'action',
        badge: '3D PHYSICS PUSHER',
        icon: '🪙',
        bannerGradient: 'linear-gradient(135deg, #ffd700 0%, #ff0055 100%)',
        controls: 'Tap / Click: Drop coins onto pusher • Quake button: Trigger tremors',
        rules: 'Push coins, giant tokens, and mascot figurines over the edge into your wallet.',
        getScore: (stats) => stats?.dozerHighScore ? `${stats.dozerHighScore.toLocaleString()} CP` : 'READY'
    },
    pinball: {
        id: 'pinball',
        title: 'CYBER PINBALL 2088',
        category: 'action',
        badge: 'PHYSICS ARCADE',
        icon: '⚡',
        bannerGradient: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
        controls: 'A / D or Left/Right Arrow: Flippers • Down Arrow: Launch ball',
        rules: 'Keep the laser sphere in play, hit neon bumpers, and trigger multiball frenzy.',
        getScore: (stats) => stats?.pinballHighScore ? `${stats.pinballHighScore.toLocaleString()} PTS` : 'READY'
    },
    plinko: {
        id: 'plinko',
        title: 'CYBER PLINKO',
        category: 'action',
        badge: 'PEGBOARD DROP',
        icon: '🎯',
        bannerGradient: 'linear-gradient(135deg, #00f0ff 0%, #ffd700 100%)',
        controls: 'Click / Tap Drop Zone: Release glowing cyber orbs',
        rules: 'Orbs bounce off physics pegs into multipliers at the bottom row up to 1000x.',
        getScore: (stats) => '1000x'
    },
    drift: {
        id: 'drift',
        title: 'NEON DRIFT: 2088',
        category: 'action',
        badge: 'SYNTH RUNNER',
        icon: '🏎️',
        bannerGradient: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
        controls: 'A / D or Left / Right Arrow: Steer vehicle • Space: Turbo boost',
        rules: 'Weave through neon grid traffic, collect energy cells, and drift past police barriers.',
        getScore: (stats) => stats?.neonDriftHighScore ? `${stats.neonDriftHighScore.toLocaleString()} PTS` : 'READY'
    },
    'merch-defense': {
        id: 'merch-defense',
        title: 'MERCH DEFENSE',
        category: 'action',
        badge: 'TOWER STRATEGY',
        icon: '🛡️',
        bannerGradient: 'linear-gradient(135deg, #00ff88 0%, #0072ff 100%)',
        controls: 'Mouse / Tap: Place Turrets & upgrade defensive perimeter',
        rules: 'Defend your warehouse drops against waves of rogue corporate salvage bots.',
        getScore: (stats) => stats?.merchDefenseHighScore ? `WAVE ${stats.merchDefenseHighScore}` : 'READY'
    },
    galaxy: {
        id: 'galaxy',
        title: 'GALAXY DEFENDER',
        category: 'action',
        badge: 'SPACE SHMUP',
        icon: '👾',
        bannerGradient: 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
        controls: 'Arrow Keys / WASD: Maneuver ship • Spacebar / Auto: Rapid Laser Fire',
        rules: 'Destroy alien motherships, collect weapon upgrades, and survive bullet hell swarms.',
        getScore: (stats) => stats?.galaxyHighScore ? `${stats.galaxyHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    'face-runner': {
        id: 'face-runner',
        title: 'FACE WARP RUNNER',
        category: 'action',
        badge: 'ENDLESS PARKOUR',
        icon: '🏃',
        bannerGradient: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
        controls: 'Spacebar / Tap: Jump • Down Arrow: Slide under lasers',
        rules: 'Sprint across cyberpunk rooftops while dodging drones and grabbing golden chips.',
        getScore: (stats) => stats?.faceRunnerHighScore ? `${stats.faceRunnerHighScore.toLocaleString()} M` : '0 M'
    },
    'bro-cannon': {
        id: 'bro-cannon',
        title: 'BRO CANNON',
        category: 'action',
        badge: 'BALLISTIC LAUNCHER',
        icon: '💥',
        bannerGradient: 'linear-gradient(135deg, #ff7700 0%, #ff0055 100%)',
        controls: 'Mouse Aim & Hold: Calibrate angle & power • Release: Launch Bro',
        rules: 'Launch your companion through target rings and explosive bounce pads for distance records.',
        getScore: (stats) => stats?.broCannonHighScore ? `${stats.broCannonHighScore.toLocaleString()} M` : '0 M'
    },
    arena: {
        id: 'arena',
        title: 'THE ARENA',
        category: 'action',
        badge: 'MULTIPLAYER DUEL',
        icon: '⚔️',
        bannerGradient: 'linear-gradient(135deg, #ff0055 0%, #ffd700 100%)',
        controls: 'Tactical Card & Action Selectors',
        rules: 'Challenge online operators in tactical combat for seasonal ranking and bounty rewards.',
        getScore: (stats) => 'PVP RANK'
    },
    brick: {
        id: 'brick',
        title: 'NEON BRICKS',
        category: 'retro',
        badge: 'BREAKOUT CLASSIC',
        icon: '🧱',
        bannerGradient: 'linear-gradient(135deg, #00f0ff 0%, #00ff88 100%)',
        controls: 'Mouse Move / Left-Right Arrows: Move neon paddle',
        rules: 'Smash through glowing crystal blocks and grab multiball and laser power-ups.',
        getScore: (stats) => stats?.brickHighScore ? `${stats.brickHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    snake: {
        id: 'snake',
        title: 'NEON SNAKE',
        category: 'retro',
        badge: 'GRID CRAWLER',
        icon: '🐍',
        bannerGradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        controls: 'Arrow Keys / WASD / Swipe: Change direction',
        rules: 'Eat glowing food pellets to grow longer without colliding into the walls or your tail.',
        getScore: (stats) => stats?.snakeHighScore ? `${stats.snakeHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    flappy: {
        id: 'flappy',
        title: 'FLAPPY BRO',
        category: 'retro',
        badge: 'TAP FLYER',
        icon: '🐤',
        bannerGradient: 'linear-gradient(135deg, #ffd700 0%, #ff0055 100%)',
        controls: 'Spacebar / Tap Screen: Flap wings to gain altitude',
        rules: 'Guide your mascot through neon pipe gates. Timing is everything!',
        getScore: (stats) => stats?.flappyHighScore ? `${stats.flappyHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    unboxing: {
        id: 'unboxing',
        title: 'HYPE DROP',
        category: 'retro',
        badge: 'MYSTERY LOOT',
        icon: '📦',
        bannerGradient: 'linear-gradient(135deg, #ff007f 0%, #7000ff 100%)',
        controls: 'Click / Tap: Unlock crate spinner',
        rules: 'Open mystery crates for rare mascot skins, cyber furniture, and CP jackpots.',
        getScore: (stats) => 'CRATE DROP'
    },
    wheel: {
        id: 'wheel',
        title: 'CYBER WHEEL',
        category: 'retro',
        badge: 'FORTUNE WHEEL',
        icon: '🎡',
        bannerGradient: 'linear-gradient(135deg, #ffd700 0%, #00f0ff 100%)',
        controls: 'Tap / Click: Spin Wheel',
        rules: 'Spin the fortune wheel for guaranteed daily prizes and multiplier rewards.',
        getScore: (stats) => stats?.wheelHighScore ? `${stats.wheelHighScore.toLocaleString()} CP` : 'FREE SPIN'
    },
    'merch-jump': {
        id: 'merch-jump',
        title: 'MERCH JUMP',
        category: 'retro',
        badge: 'DOODLE HOPPER',
        icon: '🦘',
        bannerGradient: 'linear-gradient(135deg, #00f0ff 0%, #ff0055 100%)',
        controls: 'A / D or Left / Right Arrows / Tilt: Move horizontally',
        rules: 'Bounce endlessly upward on moving neon platforms without falling into the abyss.',
        getScore: (stats) => stats?.merchJumpHighScore ? `${stats.merchJumpHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    fishing: {
        id: 'fishing',
        title: 'CRAZY FISHING',
        category: 'retro',
        badge: 'CYBER LAKE',
        icon: '🎣',
        bannerGradient: 'linear-gradient(135deg, #00b4d8 0%, #00ff88 100%)',
        controls: 'Click / Tap: Cast hook • Hold & release: Reel tension',
        rules: 'Catch exotic cyber fish, legendary mecha-sharks, and submerged treasure chests.',
        getScore: (stats) => stats?.crazyFishingHighScore ? `${stats.crazyFishingHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    whack: {
        id: 'whack',
        title: 'WHACK-A-MOLE',
        category: 'retro',
        badge: 'REACTION SPEED',
        icon: '🔨',
        bannerGradient: 'linear-gradient(135deg, #ff7700 0%, #ffd700 100%)',
        controls: 'Click / Tap: Whack appearing cyber critters',
        rules: 'Hit glitch bots as fast as they surface while avoiding friendly mascots.',
        getScore: (stats) => stats?.whackHighScore ? `${stats.whackHighScore.toLocaleString()} PTS` : '0 PTS'
    },
    memory: {
        id: 'memory',
        title: 'MEMORY MATCH',
        category: 'retro',
        badge: 'NEURAL RECALL',
        icon: '🧠',
        bannerGradient: 'linear-gradient(135deg, #7000ff 0%, #00f0ff 100%)',
        controls: 'Click / Tap: Flip cards to find matching pairs',
        rules: 'Flip cyber cards and match all identical pairs in the fewest moves.',
        getScore: (stats) => stats?.memoryHighScore ? `${stats.memoryHighScore.toLocaleString()} MOVES` : '0 MOVES'
    }
};

/**
 * Helper to get game details by pathname or gameId
 */
export const getGameDetails = (pathnameOrId) => {
    if (!pathnameOrId) return null;
    const cleanId = pathnameOrId.replace('/arcade/', '').replace('/', '').trim().toLowerCase();
    return GAMES_CATALOG[cleanId] || {
        id: cleanId,
        title: cleanId.toUpperCase(),
        category: 'arcade',
        badge: 'CYBER GAME',
        icon: '🎮',
        bannerGradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
        controls: 'Keyboard & Touch Controls',
        rules: 'Compete for high scores and level up your player profile.',
        getScore: () => 'ACTIVE'
    };
};
