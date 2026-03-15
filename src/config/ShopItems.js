export const SHOP_ITEMS = [
    // --- SNAKE SKINS ---
    { id: 'snake_default', type: 'snake_skin', name: 'Neon Green', price: 0, category: 'snake', slot: 'snake', description: 'The classic look.', icon: '🟩' },
    { id: 'snake_gold', type: 'snake_skin', name: 'Midas Touch', price: 500, category: 'snake', slot: 'snake', description: 'Solid gold snake. Fancy!', icon: '🏆' },
    { id: 'snake_rainbow', type: 'snake_skin', name: 'Rainbow', price: 1000, category: 'snake', slot: 'snake', description: 'Changes colors as you move!', icon: '🌈', unlockCondition: 'snake_master' },
    { id: 'snake_ghost', type: 'snake_skin', name: 'Ghost', price: 750, category: 'snake', slot: 'snake', description: 'Spooky transparent vibes.', icon: '👻', unlockCondition: 'snake_pro' },
    { id: 'snake_tron', type: 'snake_skin', name: 'Cyber Cycle', price: 2000, category: 'snake', slot: 'snake', description: 'Leave a light trail.', icon: '🏍️', unlockCondition: 'snake_master' },

    // --- SNAKE FOOD ---
    { id: 'food_apple', type: 'snake_food', name: 'Red Apple', price: 0, category: 'snake', slot: 'snake_food', description: 'Healthy default.', icon: '🍎' },
    { id: 'food_burger', type: 'snake_food', name: 'Cheezburger', price: 500, category: 'snake', slot: 'snake_food', description: 'Can i haz?', icon: '🍔', unlockCondition: 'snake_novice' },
    { id: 'food_sushi', type: 'snake_food', name: 'Sashimi', price: 1000, category: 'snake', slot: 'snake_food', description: 'Fancy dining.', icon: '🍣', unlockCondition: 'snake_pro' },
    { id: 'food_caviar', type: 'snake_food', name: 'Almas Caviar', price: 25000, category: 'snake', slot: 'snake_food', description: 'It tastes like debt.', icon: '🥫' },

    // --- FISHING: RODS & UPGRADES ---
    { id: 'rod_default', type: 'fishing_rod', name: 'Bamboo Pole', price: 0, category: 'fishing', slot: 'fishing_rod', description: 'Ol\' reliable.', icon: '🎋' },
    { id: 'rod_fiberglass', type: 'fishing_rod', name: 'Fiberglass', price: 300, category: 'fishing', slot: 'fishing_rod', description: 'Sleek and sturdy.', icon: '🎣', unlockCondition: 'fish_novice' },
    { id: 'rod_candy', type: 'fishing_rod', name: 'Candy Cane', price: 1500, category: 'fishing', slot: 'fishing_rod', description: 'Sweet success.', icon: '🍭', unlockCondition: 'fish_amateur' },
    { id: 'rod_gold', type: 'fishing_rod', name: 'Golden Rod', price: 10000, category: 'fishing', slot: 'fishing_rod', description: 'The Ultimate Flex.', icon: '💎', unlockCondition: 'fish_master' },

    // --- FISHING: BOBBERS ---
    { id: 'bobber_red', type: 'fishing_bobber', name: 'Classic Red', price: 0, category: 'fishing', slot: 'fishing_bobber', description: 'Floating ball.', icon: '🔴' },
    { id: 'bobber_duck', type: 'fishing_bobber', name: 'Rubber Duck', price: 500, category: 'fishing', slot: 'fishing_bobber', description: 'Quack.', icon: '🦆', unlockCondition: 'fish_novice' },
    { id: 'bobber_skull', type: 'fishing_bobber', name: 'Skull', price: 2000, category: 'fishing', slot: 'fishing_bobber', description: 'Deadly effective.', icon: '💀', unlockCondition: 'fish_pro' },
    { id: 'bobber_sparkle', type: 'fishing_bobber', name: 'Sparkle', price: 2500, category: 'fishing', slot: 'fishing_bobber', description: 'Glitter trail!', icon: '✨' },
    { id: 'bobber_neon', type: 'fishing_bobber', name: 'Neon Pulse', price: 3000, category: 'fishing', slot: 'fishing_bobber', description: 'Cyber trail.', icon: '🧿' },
    { id: 'bobber_comet', type: 'fishing_bobber', name: 'Comet', price: 5000, category: 'fishing', slot: 'fishing_bobber', description: 'Burning tail effect.', icon: '☄️' },
    { id: 'bobber_brick', type: 'fishing_bobber', name: 'Actual Brick', price: 75000, category: 'fishing', slot: 'fishing_bobber', description: 'Sinks immediately. Very unhelpful.', icon: '🧱' },

    // --- FISHING: BOATS (SKINS) ---
    { id: 'boat_default', type: 'fishing_boat', name: 'Dinghy', price: 0, category: 'fishing', slot: 'fishing_boat', description: 'It floats.', icon: '🚣' },
    { id: 'boat_duck', type: 'fishing_boat', name: 'Rubber Duck', price: 500, category: 'fishing', slot: 'fishing_boat', description: 'Squeak squeak!', icon: '🦆' },
    { id: 'boat_ufo', type: 'fishing_boat', name: 'U.F.O.', price: 2000, category: 'fishing', slot: 'fishing_boat', description: 'Beam them up!', icon: '🛸' },
    { id: 'boat_pirate', type: 'fishing_boat', name: 'Galleon', price: 1000, category: 'fishing', slot: 'fishing_boat', description: 'Yarrr!', icon: '🏴‍☠️' },
    { id: 'boat_banana', type: 'fishing_boat', name: 'Banana Boat', price: 3000, category: 'fishing', slot: 'fishing_boat', description: 'Potassium!', icon: '🍌' },
    { id: 'boat_viking', type: 'fishing_boat', name: 'Longship', price: 5000, category: 'fishing', slot: 'fishing_boat', description: 'Valhalla!', icon: '🛡️' },
    { id: 'boat_box', type: 'fishing_boat', name: 'Cardboard Box', price: 10, category: 'fishing', slot: 'fishing_boat', description: 'Budget option.', icon: '📦' },
    { id: 'boat_trash', type: 'fishing_boat', name: 'Trash Lid', price: 69, category: 'fishing', slot: 'fishing_boat', description: 'Garbage Day.', icon: '🗑️' },
    { id: 'boat_balloon', type: 'fishing_boat', name: 'Red Balloon', price: 67, category: 'fishing', slot: 'fishing_boat', description: 'You float too.', icon: '🎈' },
    { id: 'boat_toilet', type: 'fishing_boat', name: 'The Throne', price: 150, category: 'fishing', slot: 'fishing_boat', description: 'Flush away.', icon: '🚽' },
    { id: 'boat_tub', type: 'fishing_boat', name: 'Bathtub', price: 200, category: 'fishing', slot: 'fishing_boat', description: 'Scrub a dub.', icon: '🛁' },
    { id: 'boat_chair', type: 'fishing_boat', name: 'Gamer Chair', price: 399, category: 'fishing', slot: 'fishing_boat', description: '+10% Skill.', icon: '💺' },
    { id: 'boat_pizza', type: 'fishing_boat', name: 'Giant Slice', price: 420, category: 'fishing', slot: 'fishing_boat', description: 'Greasy.', icon: '🍕' },
    { id: 'boat_carpet', type: 'fishing_boat', name: 'Magic Carpet', price: 1000, category: 'fishing', slot: 'fishing_boat', description: 'Shining, shimmering.', icon: '🧞' },
    { id: 'boat_cloud', type: 'fishing_boat', name: 'Nimbus', price: 777, category: 'fishing', slot: 'fishing_boat', description: 'Pure heart required.', icon: '☁️' },
    { id: 'boat_invisible', type: 'fishing_boat', name: 'Invisible', price: 5000, category: 'fishing', slot: 'fishing_boat', description: 'To the invisible boatmobile!', icon: '🚫' },

    // --- FISHING: UPGRADES ---
    { id: 'upgrade_catch_area', type: 'upgrade', name: 'Titanium Bar', price: 1500, category: 'fishing', description: '+10% Catch Area', icon: '📏' },
    { id: 'upgrade_reel_speed', type: 'upgrade', name: 'Turbo Reel', price: 1500, category: 'fishing', description: '+10% Reel Speed', icon: '⏩' },
    { id: 'upgrade_hats', type: 'upgrade', name: 'Fish Fashion', price: 3000, category: 'fishing', description: 'Fish wear hats!', icon: '🎩' },

    // --- BRICK PADDLES ---
    { id: 'paddle_default', type: 'brick_paddle', name: 'Standard', price: 0, category: 'brick', slot: 'brick', description: 'Basic paddle.', icon: '➖' },
    { id: 'paddle_flame', type: 'brick_paddle', name: 'Flame', price: 600, category: 'brick', slot: 'brick', description: 'Hot stuff!', icon: '🔥', unlockCondition: 'brick_pro' },
    { id: 'paddle_ice', type: 'brick_paddle', name: 'Glacier', price: 600, category: 'brick', slot: 'brick', description: 'Cool as ice.', icon: '❄️', unlockCondition: 'brick_pro' },
    { id: 'paddle_laser', type: 'brick_paddle', name: 'Laser Bar', price: 2000, category: 'brick', slot: 'brick', description: 'Pew pew aesthetics.', icon: '⚡', unlockCondition: 'brick_master' },

    // --- BRICK BALLS ---
    { id: 'ball_std', type: 'brick_ball', name: 'Steel Ball', price: 0, category: 'brick', slot: 'brick_ball', description: 'Heavy metal.', icon: '⚪' },
    { id: 'ball_fire', type: 'brick_ball', name: 'Fireball', price: 1000, category: 'brick', slot: 'brick_ball', description: 'Visual heat.', icon: '☄️', unlockCondition: 'brick_level_5' },
    { id: 'ball_eye', type: 'brick_ball', name: 'Eyeball', price: 1500, category: 'brick', slot: 'brick_ball', description: 'It watches you.', icon: '👁️', unlockCondition: 'brick_level_10' },
    { id: 'ball_invisible', type: 'brick_ball', name: 'Invisible Ball', price: 100000, category: 'brick', slot: 'brick_ball', description: 'Pay to lose.', icon: '🫥' },

    // --- GALAXY SHIPS ---
    { id: 'ship_default', type: 'galaxy_ship', name: 'Interceptor', price: 0, category: 'galaxy', slot: 'galaxy', description: 'Standard issue.', icon: '🚀' },
    { id: 'ship_ufo', type: 'galaxy_ship', name: 'Invader', price: 1200, category: 'galaxy', slot: 'galaxy', description: 'Fly the enemy ship!', icon: '🛸', unlockCondition: 'galaxy_boss_1' },
    { id: 'ship_dragon', type: 'galaxy_ship', name: 'Space Dragon', price: 5000, category: 'galaxy', slot: 'galaxy', description: 'Mythical beast.', icon: '🐉', unlockCondition: 'galaxy_boss_5' },

    // --- GALAXY BULLETS ---
    { id: 'bullet_laser', type: 'galaxy_bullet', name: 'Red Laser', price: 0, category: 'galaxy', slot: 'galaxy_bullet', description: 'Standard issue.', icon: '¦' },
    { id: 'bullet_donut', type: 'galaxy_bullet', name: 'Donut', price: 1000, category: 'galaxy', slot: 'galaxy_bullet', description: 'Sweet destruction.', icon: '🍩', unlockCondition: 'galaxy_novice' },
    { id: 'bullet_cat', type: 'galaxy_bullet', name: 'Nyan Cat', price: 2500, category: 'galaxy', slot: 'galaxy_bullet', description: 'Meow.', icon: '🐱', unlockCondition: 'galaxy_pro' },

    // --- FLAPPY PILOTS ---
    { id: 'flappy_boy', type: 'flappy_skin', name: 'MerchBoy', price: 0, category: 'flappy', slot: 'flappy', description: 'The original.', icon: '👦', skinType: 'image', skinContent: '/assets/boy_face.png' },
    { id: 'flappy_brokid', type: 'flappy_skin', name: 'BroKid', price: 500, category: 'flappy', slot: 'flappy', description: 'The sidekick.', icon: '🧢', skinType: 'image', skinContent: '/assets/brokid-logo.png' },
    { id: 'flappy_cat', type: 'flappy_skin', name: 'Kitty', price: 500, category: 'flappy', slot: 'flappy', description: 'Meow.', icon: '🐱', skinType: 'emoji', skinContent: '🐱' },
    { id: 'flappy_dog', type: 'flappy_skin', name: 'Puppy', price: 500, category: 'flappy', slot: 'flappy', description: 'Woof.', icon: '🐶', skinType: 'emoji', skinContent: '🐶' },
    { id: 'flappy_frog', type: 'flappy_skin', name: 'Froggo', price: 500, category: 'flappy', slot: 'flappy', description: 'Ribbit.', icon: '🐸', skinType: 'emoji', skinContent: '🐸' },
    { id: 'flappy_unicorn', type: 'flappy_skin', name: 'Uni', price: 2000, category: 'flappy', slot: 'flappy', description: 'Magical!', icon: '🦄', skinType: 'emoji', skinContent: '🦄' },
    { id: 'flappy_rainbow', type: 'flappy_skin', name: 'Pride Heart', price: 1000, category: 'flappy', slot: 'flappy', description: 'Love wins.', icon: '🌈', skinType: 'emoji', skinContent: '🌈' },
    { id: 'flappy_ghost', type: 'flappy_skin', name: 'Spooky', price: 1000, category: 'flappy', slot: 'flappy', description: 'Boo!', icon: '👻', skinType: 'emoji', skinContent: '👻' },
    { id: 'flappy_alien', type: 'flappy_skin', name: 'Paul', price: 1500, category: 'flappy', slot: 'flappy', description: 'Take me to your leader.', icon: '👽', skinType: 'emoji', skinContent: '👽' },
    { id: 'flappy_robot', type: 'flappy_skin', name: 'BeepBoop', price: 1500, category: 'flappy', slot: 'flappy', description: 'Start Program.', icon: '🤖', skinType: 'emoji', skinContent: '🤖' },
    { id: 'flappy_cowboy', type: 'flappy_skin', name: 'Sheriff', price: 800, category: 'flappy', slot: 'flappy', description: 'Yeehaw.', icon: '🤠', skinType: 'emoji', skinContent: '🤠' },
    { id: 'flappy_monster', type: 'flappy_skin', name: '8-Bit', price: 2500, category: 'flappy', slot: 'flappy', description: 'Pixel Perfect.', icon: '👾', skinType: 'emoji', skinContent: '👾' },
    { id: 'flappy_diamond', type: 'flappy_skin', name: 'Richie', price: 5000, category: 'flappy', slot: 'flappy', description: 'So shiny.', icon: '💎', skinType: 'emoji', skinContent: '💎' },
    { id: 'flappy_poop', type: 'flappy_skin', name: 'Stinky', price: 100, category: 'flappy', slot: 'flappy', description: 'Uh oh.', icon: '💩', skinType: 'emoji', skinContent: '💩' },
    { id: 'flappy_face_money', type: 'flappy_skin', name: 'Money Maker', price: 5000, category: 'flappy', slot: 'flappy', description: 'Cash rules everything.', icon: '🤑', skinType: 'image', skinContent: '/assets/skins/face_money.png' },
    { id: 'flappy_face_bear', type: 'flappy_skin', name: 'Beary Cute', price: 1000, category: 'flappy', slot: 'flappy', description: 'Unbearably adorable.', icon: '🐻', skinType: 'image', skinContent: '/assets/skins/face_bear.png' },
    { id: 'flappy_face_bunny', type: 'flappy_skin', name: 'Bunny Hop', price: 1000, category: 'flappy', slot: 'flappy', description: 'Hop to it.', icon: '🐰', skinType: 'image', skinContent: '/assets/skins/face_bunny.png' },

    // --- POCKET BRO SKINS ---
    { id: 'pb_gold', type: 'pb_skin', name: 'Golden Egg', price: 5000, category: 'pocketbro', slot: 'pocketbro', description: 'Shiny and expensive.', icon: '🥚' },
    { id: 'pb_cyber', type: 'pb_skin', name: 'Cyber Shell', price: 2500, category: 'pocketbro', slot: 'pocketbro', description: 'High tech housing.', icon: '🤖' },
    { id: 'pb_party', type: 'pb_skin', name: 'Party Mode', price: 1000, category: 'pocketbro', slot: 'pocketbro', description: 'Always celebrating.', icon: '🎉' },

    // --- HOME DECOR (Pocket Bro) ---
    // Backgrounds
    { id: 'bg_cyber', type: 'decor', name: 'Cyber City', price: 500, category: 'homedecor', slot: 'decor', description: 'Neon skyline view.', icon: '🌃' },
    { id: 'bg_dojo', type: 'decor', name: 'Zen Dojo', price: 800, category: 'homedecor', slot: 'decor', description: 'Peaceful vibes.', icon: '⛩️' },
    { id: 'bg_space', type: 'decor', name: 'Deep Space', price: 1000, category: 'homedecor', slot: 'decor', description: 'Stars everywhere.', icon: '🌌' },
    { id: 'bg_magma', type: 'decor', name: 'Magma Core', price: 2000, category: 'homedecor', slot: 'decor', description: 'Hot stuff.', icon: '🔥' },
    // Furniture
    { id: 'furn_arcade', type: 'decor', name: 'Arcade Cab', price: 2000, category: 'homedecor', slot: 'decor', description: 'Mini cabinet.', icon: '🕹️' },
    { id: 'furn_pc', type: 'decor', name: 'Battlestation', price: 2500, category: 'homedecor', slot: 'decor', description: 'RGB Everything.', icon: '🖥️' },
    { id: 'furn_bed', type: 'decor', name: 'Cozy Bed', price: 1000, category: 'homedecor', slot: 'decor', description: 'Nap time.', icon: '🛏️' },
    { id: 'furn_plant', type: 'decor', name: 'Houseplant', price: 200, category: 'homedecor', slot: 'decor', description: 'Oxygen.', icon: '🪴' },
    { id: 'furn_cat_tree', type: 'decor', name: 'Cat Tower', price: 600, category: 'homedecor', slot: 'decor', description: 'For the cat.', icon: '🐈' },
    { id: 'furn_ufo', type: 'decor', name: 'Model UFO', price: 1500, category: 'homedecor', slot: 'decor', description: 'I want to believe.', icon: '🛸' },
    { id: 'rug_dance', type: 'decor', name: 'Dance Floor', price: 500, category: 'homedecor', slot: 'decor', description: 'Disco lights.', icon: '🕺' },
    { id: 'furn_pet_rock', type: 'decor', name: 'Pet Rock', price: 50000, category: 'homedecor', slot: 'decor', description: 'It does absolutely nothing.', icon: '🪨' },
    { id: 'furn_konami', type: 'decor', name: 'Retro Controller', price: 0, category: 'homedecor', slot: 'decor', description: 'Up Up Down Down...', icon: '🎮', hidden: true },

    // --- DASHBOARD THEMES ---
    { id: 'theme_default', type: 'theme', name: 'Neon Dark', price: 0, category: 'themes', slot: 'theme', description: 'Standard OS.', icon: '🌑' },
    { id: 'theme_matrix', type: 'theme', name: 'The Matrix', price: 2000, category: 'themes', slot: 'theme', description: 'Wake up, Neo.', icon: '🟢' },
    { id: 'theme_sunset', type: 'theme', name: 'Sunset 80s', price: 2000, category: 'themes', slot: 'theme', description: 'Retrowave vibes.', icon: '🌅' },
    { id: 'theme_space', type: 'theme', name: 'Deep Space', price: 2000, category: 'themes', slot: 'theme', description: 'Among the stars.', icon: '🌌' },
    { id: 'theme_gold', type: 'theme', name: 'Midas OS', price: 10000, category: 'themes', slot: 'theme', description: 'Pure luxury.', icon: '🥇' },

    // --- RADIO SKINS ---
    { id: 'radio_default', type: 'radio_skin', name: 'Standard Issue', price: 0, category: 'radio', slot: 'radio_skin', description: 'Reliable receiver.', icon: '📻' },
    { id: 'radio_wood', type: 'radio_skin', name: 'Vintage Wood', price: 1500, category: 'radio', slot: 'radio_skin', description: 'Grandpa\'s radio.', icon: '🪵' },
    { id: 'radio_gold', type: 'radio_skin', name: 'Bling Box', price: 5000, category: 'radio', slot: 'radio_skin', description: 'Sound of money.', icon: '🏆' },
    { id: 'radio_cyber', type: 'radio_skin', name: 'Netrunner', price: 2500, category: 'radio', slot: 'radio_skin', description: 'Translucent tech.', icon: '💾' },
    { id: 'radio_dev', type: 'radio_skin', name: 'Dev Tuner', price: 99999, category: 'radio', slot: 'radio_skin', description: 'Debug Mode Enabled.', icon: '📟', hidden: true }, // Reward for finding freq

    // --- POWER UPS (CONSUMABLES) ---
    { id: 'snake_life', type: 'consumable', name: 'Extra Life', price: 200, category: 'powerups', description: 'Resurrect once in Snake.', icon: '❤️' },
    { id: 'snake_slow', type: 'consumable', name: 'Slo-Mo Pill', price: 150, category: 'powerups', description: 'Slow down time in Snake.', icon: '⏱️' },
    { id: 'fish_bait', type: 'consumable', name: 'Master Bait', price: 100, category: 'powerups', description: 'Guaranteed Rare bite.', icon: '🪱' },
    { id: 'flappy_shield', type: 'consumable', name: 'Energy Shield', price: 250, category: 'powerups', description: 'Crash protection (1 hit).', icon: '🛡️' },
    { id: 'brick_magnet', type: 'consumable', name: 'Magno-Paddle', price: 300, category: 'powerups', description: 'Catch the ball.', icon: '🧲' },

    // --- BLACK MARKET (HIDDEN) ---
    { id: 'hack_botnet_v1', type: 'upgrade', name: 'Botnet Mainframe', price: 5000, category: 'blackmarket', description: 'Passive +1 Fan/sec.', icon: '🤖', hidden: true },
    { id: 'hack_insider', type: 'upgrade', name: 'Insider Chip', price: 2500, category: 'blackmarket', description: 'Market Analyze Accuracy.', icon: '👁️', hidden: true },
    { id: 'hack_arena', type: 'upgrade', name: 'Crimson Code', price: 10000, category: 'blackmarket', description: 'Squad DMG +20%.', icon: '🩸', hidden: true },
    { id: 'hack_tax', type: 'upgrade', name: 'Offshore Account', price: 7500, category: 'blackmarket', description: 'Merch Income +50%.', icon: '🏝️', hidden: true },
];

export const CATEGORIES = [
    { id: 'snake', name: 'Neon Snake', icon: '🐍' },
    { id: 'fishing', name: 'Crazy Fishing', icon: '🎣' },
    { id: 'brick', name: 'Neon Bricks', icon: '🧱' },
    { id: 'galaxy', name: 'Galaxy Defender', icon: '🚀' },
    { id: 'flappy', name: 'Flappy Mascot', icon: '🐥' },
    { id: 'pocketbro', name: 'Pocket Skins', icon: '🥚' },
    { id: 'homedecor', name: 'Home Decor', icon: '🛋️' },
    { id: 'themes', name: 'OS Themes', icon: '🎨' },
    { id: 'radio', name: 'Radio Skins', icon: '📻' },
    { id: 'powerups', name: 'Power Ups', icon: '⚡' },
];
