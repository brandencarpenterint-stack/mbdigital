import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed'; // Global Feed
import { LeaderboardService } from '../../services/LeaderboardService';

// --- DATA & CONFIG ---

const BIOMES = [
    { name: 'Surface', maxDepth: 300, color: ['#87CEEB', '#006994'], particle: '🫧', effect: 'STAR' },
    { name: 'Seagrass', maxDepth: 600, color: ['#006994', '#2E8B57'], particle: '🌿', effect: 'BUBBLE_COLUMN' },
    { name: 'Coral', maxDepth: 900, color: ['#2E8B57', '#008080'], particle: '🪸', effect: 'VOLCANO' },
    { name: 'Twilight', maxDepth: 1200, color: ['#4B0082', '#191970'], particle: '✨', effect: 'AURORA' },
    { name: 'Midnight', maxDepth: 1500, color: ['#191970', '#000033'], particle: '👁️', effect: 'EYES' },
    { name: 'The Trench', maxDepth: 1800, color: ['#000033', '#000000'], particle: '🌫️', effect: 'FOG' },
    { name: 'Neon City', maxDepth: 2100, color: ['#000000', '#2a003b'], particle: '👾', effect: 'MATRIX' },
    { name: 'Boneyard', maxDepth: 2400, color: ['#3b2a00', '#1a1100'], particle: '🦴', effect: 'BONES' },
    { name: 'Magma Core', maxDepth: 2700, color: ['#330000', '#550000'], particle: '🔥', effect: 'EMBER' },
    { name: 'Frozen Deep', maxDepth: 3000, color: ['#003333', '#005555'], particle: '❄️', effect: 'SNOW' },
    { name: 'The Ether', maxDepth: 3500, color: ['#2a003b', '#4B0082'], particle: '🔮', effect: 'SPIRIT' },
    { name: 'The Void', maxDepth: 4000, color: ['#000000', '#111111'], particle: '⚫', effect: 'GLITCH' }
];

const FISH_DATA = [
    // --- SURFACE (0-300m) ---
    { id: 'boot', name: 'Old Boot', score: 1, emoji: '👢', minDepth: 0, maxDepth: 300, pattern: 'FLOAT', speed: 1, weight: [0.5, 2.0] },
    { id: 'can', name: 'Soda Can', score: 1, emoji: '🥤', minDepth: 0, maxDepth: 300, pattern: 'FLOAT', speed: 1, weight: [0.1, 0.5] },
    { id: 'goldy', name: 'Goldy', score: 5, emoji: '🐟', minDepth: 0, maxDepth: 300, pattern: 'FLOAT', speed: 1.5, weight: [0.1, 1.5] },
    { id: 'shrimp', name: 'Lil Shrimp', score: 3, emoji: '🦐', minDepth: 50, maxDepth: 300, pattern: 'DART', speed: 2.5, weight: [0.05, 0.2] },
    { id: 'ducky', name: 'Lost Duck', score: 10, emoji: '🐤', minDepth: 0, maxDepth: 100, pattern: 'FLOAT', speed: 0.5, weight: [0.5, 1.0] },
    { id: 'sushi', name: 'Runaway Sushi', score: 15, emoji: '🍣', minDepth: 100, maxDepth: 350, pattern: 'DART', speed: 3.0, weight: [0.1, 0.3] },
    // NEW Phase 27
    { id: 'bottle', name: 'Message', score: 5, emoji: '🍾', minDepth: 0, maxDepth: 300, pattern: 'FLOAT', speed: 0.5, weight: [1.0, 2.0] },
    { id: 'wood', name: 'Driftwood', score: 2, emoji: '🪵', minDepth: 0, maxDepth: 300, pattern: 'FLOAT', speed: 0.8, weight: [2.0, 10.0] },

    // --- SEAGRASS (300-600m) ---
    { id: 'crab', name: 'Crabby', score: 8, emoji: '🦀', minDepth: 300, maxDepth: 600, pattern: 'DART', speed: 2.0, weight: [0.5, 3.0] },
    { id: 'turtle', name: 'Mr. Turtle', score: 25, emoji: '🐢', minDepth: 300, maxDepth: 600, pattern: 'FLOAT', speed: 0.8, weight: [10.0, 50.0] },
    { id: 'seahorse', name: 'Seahorse', score: 12, emoji: '🐉', minDepth: 350, maxDepth: 600, pattern: 'SINE', speed: 1.5, weight: [0.1, 0.5] },
    { id: 'snake', name: 'Sea Snake', score: 18, emoji: '🐍', minDepth: 400, maxDepth: 600, pattern: 'SINE', speed: 3.0, weight: [1.0, 5.0] },
    { id: 'eel', name: 'Zappy Eel', score: 20, emoji: '⚡', minDepth: 550, maxDepth: 700, pattern: 'GLITCH', speed: 4.0, weight: [2.0, 8.0] },
    // NEW Phase 27
    { id: 'snail', name: 'Gary', score: 6, emoji: '🐌', minDepth: 300, maxDepth: 600, pattern: 'FLOAT', speed: 0.2, weight: [0.1, 0.5] },
    { id: 'cuke', name: 'Sea Cucumber', score: 10, emoji: '🥒', minDepth: 500, maxDepth: 600, pattern: 'FLOAT', speed: 0.1, weight: [0.5, 1.0] },

    // --- CORAL (600-900m) ---
    { id: 'guppy', name: 'Neon Guppy', score: 10, emoji: '🐠', minDepth: 600, maxDepth: 900, pattern: 'DART', speed: 2.5, weight: [0.1, 0.5] },
    { id: 'clown', name: 'Nemo', score: 15, emoji: '🟠', minDepth: 600, maxDepth: 900, pattern: 'DART', speed: 2.0, weight: [0.2, 0.8] },
    { id: 'squid', name: 'Squiddy', score: 20, emoji: '🦑', minDepth: 650, maxDepth: 900, pattern: 'DART', speed: 3.0, weight: [2.0, 15.0] },
    { id: 'lobster', name: 'Rock Lobster', score: 25, emoji: '🦞', minDepth: 700, maxDepth: 900, pattern: 'FLOAT', speed: 2.0, weight: [1.0, 5.0] },
    { id: 'puffer', name: 'Puff Daddy', score: 30, emoji: '🐡', minDepth: 600, maxDepth: 900, pattern: 'FLOAT', speed: 1.0, weight: [1.0, 4.0] },
    { id: 'star', name: 'Pat-Rock', score: 10, emoji: '⭐', minDepth: 600, maxDepth: 900, pattern: 'FLOAT', speed: 0.5, weight: [0.5, 2.0] },
    // NEW Phase 27
    { id: 'box', name: 'Boxfish', score: 35, emoji: '📦', minDepth: 700, maxDepth: 900, pattern: 'FLOAT', speed: 1.0, weight: [1.0, 2.0] },
    { id: 'conch', name: 'Magic Conch', score: 40, emoji: '🐚', minDepth: 800, maxDepth: 900, pattern: 'FLOAT', speed: 0, weight: [2.0, 5.0] },

    // --- TWILIGHT (900-1200m) ---
    { id: 'jelly', name: 'Jelly', score: 30, emoji: '🎐', minDepth: 900, maxDepth: 1200, pattern: 'FLOAT', speed: 0.5, weight: [1.0, 5.0] },
    { id: 'stingray', name: 'Flappy Ray', score: 40, emoji: '🛸', minDepth: 950, maxDepth: 1200, pattern: 'SINE', speed: 1.5, weight: [10.0, 40.0] },
    { id: 'angler', name: 'Lantern Fish', score: 45, emoji: '🏮', minDepth: 1000, maxDepth: 1200, pattern: 'DART', speed: 3.0, weight: [5.0, 15.0] },
    { id: 'sword', name: 'Swordy', score: 50, emoji: '🗡️', minDepth: 1000, maxDepth: 1200, pattern: 'DART', speed: 5.0, weight: [50.0, 200.0] },
    { id: 'micro', name: 'Microbe', score: 5, emoji: '🦠', minDepth: 1100, maxDepth: 1200, pattern: 'FLOAT', speed: 0.5, weight: [0.01, 0.05] },
    // NEW Phase 27
    { id: 'flash', name: 'Flashlight', score: 55, emoji: '🔦', minDepth: 1000, maxDepth: 1200, pattern: 'DART', speed: 4.0, weight: [0.5, 1.0] },
    { id: 'vamp', name: 'Vampire Squid', score: 60, emoji: '🦑', minDepth: 1100, maxDepth: 1200, pattern: 'GLITCH', speed: 3.0, weight: [5.0, 10.0] },

    // --- MIDNIGHT (1200-1500m) ---
    { id: 'shark', name: 'Sharky', score: 50, emoji: '🦈', minDepth: 1200, maxDepth: 1500, pattern: 'SINE', speed: 2.0, weight: [50.0, 300.0] },
    { id: 'whale', name: 'Whaley', score: 80, emoji: '🐳', minDepth: 1200, maxDepth: 1500, pattern: 'FLOAT', speed: 1.0, weight: [1000.0, 5000.0] },
    { id: 'moon', name: 'Moon Rock', score: 100, emoji: '🌑', minDepth: 1300, maxDepth: 1500, pattern: 'FLOAT', speed: 0.2, weight: [100.0, 200.0] },
    // NEW Phase 27
    { id: 'wolf', name: 'Wolf Fish', score: 70, emoji: '🐟', minDepth: 1200, maxDepth: 1500, pattern: 'DART', speed: 3.0, weight: [10.0, 20.0] },
    { id: 'sleep', name: 'Sleeper Shark', score: 75, emoji: '💤', minDepth: 1400, maxDepth: 1500, pattern: 'FLOAT', speed: 0.5, weight: [200.0, 400.0] },

    // --- TRENCH (1500-1800m) ---
    { id: 'blob', name: 'Blobfish', score: 70, emoji: '🗿', minDepth: 1500, maxDepth: 1800, pattern: 'FLOAT', speed: 0.5, weight: [5.0, 20.0] },
    { id: 'worm', name: 'Tube Worm', score: 60, emoji: '🐛', minDepth: 1550, maxDepth: 1800, pattern: 'FLOAT', speed: 0, weight: [1.0, 2.0] },
    // NEW Phase 27
    { id: 'viper', name: 'Viperfish', score: 85, emoji: '🦷', minDepth: 1600, maxDepth: 1800, pattern: 'DART', speed: 5.0, weight: [2.0, 5.0] },
    { id: 'iso', name: 'Giant Isopod', score: 90, emoji: '🦗', minDepth: 1700, maxDepth: 1800, pattern: 'FLOAT', speed: 1.0, weight: [1.0, 2.0] },

    // --- NEON CITY (1800-2100m) ---
    { id: 'cyber', name: 'Cyber Fish', score: 110, emoji: '👾', minDepth: 1800, maxDepth: 2100, pattern: 'DART', speed: 5.0, weight: [2.0, 5.0] },
    { id: 'robot', name: 'Bot-01', score: 120, emoji: '🤖', minDepth: 1850, maxDepth: 2100, pattern: 'GLITCH', speed: 3.0, weight: [50.0, 100.0] },
    // NEW Phase 27
    { id: 'floppy', name: 'Diskette', score: 50, emoji: '💾', minDepth: 1900, maxDepth: 2100, pattern: 'FLOAT', speed: 0, weight: [0.1, 0.1] },
    { id: 'batt', name: 'Battery', score: 60, emoji: '🔋', minDepth: 2000, maxDepth: 2100, pattern: 'FLOAT', speed: 0, weight: [0.2, 0.5] },

    // --- BONEYARD (2100-2400m) ---
    { id: 'skull', name: 'Bone Fish', score: 60, emoji: '☠️', minDepth: 2100, maxDepth: 2400, pattern: 'DART', speed: 3.0, weight: [5.0, 10.0] },
    { id: 'fossil', name: 'Trilobite', score: 80, emoji: '🐌', minDepth: 2150, maxDepth: 2400, pattern: 'FLOAT', speed: 1.0, weight: [1.0, 3.0] },
    { id: 'dino', name: 'Rex Skull', score: 200, emoji: '🦖', minDepth: 2200, maxDepth: 2400, pattern: 'SINE', speed: 1.0, weight: [500.0, 1000.0] },
    // NEW Phase 27
    { id: 'key', name: 'Skeleton Key', score: 100, emoji: '🗝️', minDepth: 2100, maxDepth: 2400, pattern: 'FLOAT', speed: 0, weight: [0.1, 0.1] },
    { id: 'pirate_skull', name: 'Jolly Roger', score: 150, emoji: '🏴‍☠️', minDepth: 2200, maxDepth: 2400, pattern: 'FLOAT', speed: 0.5, weight: [1.0, 2.0] },

    // --- MAGMA CORE (2400-2700m) ---
    { id: 'ember', name: 'Fire Fish', score: 130, emoji: '🐠', minDepth: 2400, maxDepth: 2700, pattern: 'DART', speed: 6.0, weight: [2.0, 8.0] },
    { id: 'dragon', name: 'Sea Dragon', score: 150, emoji: '🐉', minDepth: 2450, maxDepth: 2700, pattern: 'SINE', speed: 2.0, weight: [50.0, 200.0] },
    // NEW Phase 27
    { id: 'rock', name: 'Obsidian', score: 40, emoji: '🪨', minDepth: 2400, maxDepth: 2700, pattern: 'FLOAT', speed: 0, weight: [50.0, 100.0] },
    { id: 'cooked', name: 'Dinner', score: 200, emoji: '🍗', minDepth: 2500, maxDepth: 2700, pattern: 'FLOAT', speed: 0.5, weight: [0.5, 1.0] },

    // --- FROZEN DEEP (2700-3000m) ---
    { id: 'ice', name: 'Ice Cube', score: 90, emoji: '🧊', minDepth: 2700, maxDepth: 3000, pattern: 'FLOAT', speed: 0.5, weight: [10.0, 20.0] },
    { id: 'penguin', name: 'Lost Pingu', score: 200, emoji: '🐧', minDepth: 2750, maxDepth: 3000, pattern: 'DART', speed: 4.0, weight: [5.0, 15.0] },
    // NEW Phase 27
    { id: 'yeti', name: 'Yeti Crab', score: 210, emoji: '🦀', minDepth: 2800, maxDepth: 3000, pattern: 'FLOAT', speed: 1.0, weight: [2.0, 5.0] },
    { id: 'pizza', name: 'Frozen Pizza', score: 150, emoji: '🍕', minDepth: 2900, maxDepth: 3000, pattern: 'FLOAT', speed: 0, weight: [0.5, 0.5] },

    // --- THE ETHER (3000-3500m) ---
    { id: 'spirit', name: 'Wisp', score: 180, emoji: '👻', minDepth: 3000, maxDepth: 3500, pattern: 'SINE', speed: 2.0, weight: [0.0, 0.0] },
    { id: 'angel', name: 'Seraphim', score: 333, emoji: '👼', minDepth: 3100, maxDepth: 3500, pattern: 'FLOAT', speed: 1.0, weight: [1.0, 7.0] },
    // NEW Phase 27
    { id: 'cloud', name: 'Nimbus', score: 250, emoji: '☁️', minDepth: 3000, maxDepth: 3500, pattern: 'FLOAT', speed: 0.5, weight: [0.0, 0.0] },
    { id: 'harp', name: 'Angel Harp', score: 300, emoji: '🎵', minDepth: 3200, maxDepth: 3500, pattern: 'SINE', speed: 1.5, weight: [5.0, 10.0] },

    // --- VOID (3500-4000m) ---
    { id: 'glitch', name: 'MISSINGNO', score: 150, emoji: '👾', minDepth: 3500, maxDepth: 4000, pattern: 'GLITCH', speed: 6.0, weight: [0.0, 999.9] },
    { id: 'eye', name: 'Watcher', score: 120, emoji: '👁️', minDepth: 3500, maxDepth: 4000, pattern: 'FLOAT', speed: 0.5, weight: [10.0, 50.0] },
    { id: 'alien', name: 'Invader', score: 140, emoji: '👽', minDepth: 3600, maxDepth: 4000, pattern: 'GLITCH', speed: 5.0, weight: [40.0, 80.0] },
    { id: 'dna', name: 'Origin', score: 200, emoji: '🧬', minDepth: 3700, maxDepth: 4000, pattern: 'SINE', speed: 3.0, weight: [0.001, 0.002] },
    { id: 'blackhole', name: 'Singularity', score: 500, emoji: '⚫', minDepth: 3800, maxDepth: 4000, pattern: 'FLOAT', speed: 0.1, weight: [9999.0, 9999.0] },
    // NEW Phase 27
    { id: 'null', name: 'NULL', score: 0, emoji: '🚫', minDepth: 3500, maxDepth: 4000, pattern: 'GLITCH', speed: 10.0, weight: [0.0, 0.0] },
    { id: 'undef', name: 'undefined', score: 404, emoji: '⁉️', minDepth: 3600, maxDepth: 4000, pattern: 'GLITCH', speed: 8.0, weight: [404.0, 404.0] },

    // --- LEGENDARIES (Universal/Abyss) ---
    { id: 'goldboot', name: 'Golden Boot', score: 500, emoji: '🥾', minDepth: 0, maxDepth: 4000, pattern: 'DART', speed: 4.0, weight: [10.0, 10.0], legendary: true },
    { id: 'cybershark', name: 'Cyber Shark', score: 1000, emoji: '🦈', minDepth: 1800, maxDepth: 2100, pattern: 'GLITCH', speed: 5.0, weight: [500.0, 1000.0], legendary: true },
    { id: 'kraken', name: 'Lil Kraken', score: 800, emoji: '🐙', minDepth: 3500, maxDepth: 4000, pattern: 'SINE', speed: 3.0, weight: [200.0, 500.0], legendary: true },
];

const SHOP_ITEMS = [
    // --- LURES (High Contrast) ---
    { id: 'lure_neon', name: 'Neon Cylinder', type: 'bobber', price: 500, desc: 'High Visibility Cyan.', icon: '🧪', color: '#00ffff', char: '🟦' },
    { id: 'lure_sun', name: 'Solar Flare', type: 'bobber', price: 800, desc: 'Blindingly bright.', icon: '☀️', color: '#ffcc00', char: '✨' },
    { id: 'lure_love', name: 'Love Potion', type: 'bobber', price: 1000, desc: 'Attracts fish with love.', icon: '💖', color: '#ff00aa', char: '❤️' },
    { id: 'lure_toxic', name: 'Rad Waste', type: 'bobber', price: 1200, desc: 'Glows in the dark.', icon: '☢️', color: '#00ff00', char: '🔋' },
    { id: 'lure_void', name: 'Abyss Beacon', type: 'bobber', price: 2000, desc: 'High contrast B&W.', icon: '⚫', color: '#ffffff', char: '⚪' },
    { id: 'lure_fire', name: 'Fireball', type: 'bobber', price: 1500, desc: 'Hot stuff!', icon: '🔥', color: '#ff4400', char: '🔥' },
    { id: 'lure_star', name: 'Super Star', type: 'bobber', price: 3000, desc: 'Invincible vibe.', icon: '⭐', color: '#ffffaa', char: '⭐' },
    { id: 'lure_ice', name: 'Frost Bite', type: 'bobber', price: 1000, desc: 'Stay cool.', icon: '🧊', color: '#aaooff', char: '❄️' },
    { id: 'lure_money', name: 'Bling Bling', type: 'bobber', price: 5000, desc: 'Trails of cash.', icon: '💎', color: '#00ff00', char: '💲' },
    { id: 'lure_matrix', name: 'The Code', type: 'bobber', price: 4000, desc: 'See the matrix.', icon: '👾', color: '#00ff00', char: '01' },

    // --- BOATS ---
    { id: 'duck', name: 'Rubber Duck', type: 'skin', price: 500, desc: 'Squeak squeak!', icon: '🦆' },
    { id: 'ufo', name: 'U.F.O.', type: 'skin', price: 2000, desc: 'Beam them up!', icon: '🛸' },
    { id: 'pirate', name: 'Galleon', type: 'skin', price: 1000, desc: 'Yarrr!', icon: '🏴‍☠️' },
    { id: 'banana', name: 'Banana Boat', type: 'skin', price: 3000, desc: 'Potassium!', icon: '🍌' },
    { id: 'viking', name: 'Longship', type: 'skin', price: 5000, desc: 'Valhalla!', icon: '🛡️' },
    // MEME FLEET
    { id: 'box', name: 'Cardboard Box', type: 'skin', price: 10, desc: 'Budget option.', icon: '📦' },
    { id: 'trash', name: 'Trash Lid', type: 'skin', price: 69, desc: 'Garbage Day.', icon: '🗑️' },
    { id: 'balloon', name: 'Red Balloon', type: 'skin', price: 67, desc: 'You float too.', icon: '🎈' },
    { id: 'toilet', name: 'The Throne', type: 'skin', price: 150, desc: 'Flush away.', icon: '🚽' },
    { id: 'tub', name: 'Bathtub', type: 'skin', price: 200, desc: 'Scrub a dub.', icon: '🛁' },
    { id: 'chair', name: 'Gamer Chair', type: 'skin', price: 399, desc: '+10% Skill.', icon: '💺' },
    { id: 'pizza_raft', name: 'Giant Slice', type: 'skin', price: 420, desc: 'Greasy.', icon: '🍕' },
    { id: 'carpet', name: 'Magic Carpet', type: 'skin', price: 1000, desc: 'Shining, shimmering.', icon: '🧞' },
    { id: 'cloud', name: 'Nimbus', type: 'skin', price: 777, desc: 'Pure heart required.', icon: '☁️' },
    { id: 'invisible', name: 'Invisible Boat', type: 'skin', price: 5000, desc: 'To the invisible boatmobile!', icon: '🚫' },

    // --- UPGRADES ---
    { id: 'bigbar', name: 'Titanium Bar', type: 'upgrade', price: 1500, desc: '+10% Catch Area', icon: '📏' },
    { id: 'turbo', name: 'Turbo Reel', type: 'upgrade', price: 1500, desc: '+10% Reel Speed', icon: '⏩' },
    { id: 'diamond', name: 'Diamond Rod', type: 'upgrade', price: 10000, desc: 'The Ultimate Flex', icon: '💎' },
    { id: 'hats', name: 'Fish Fashion', type: 'upgrade', price: 3000, desc: 'Fish wear hats!', icon: '🎩' },
];

/* --- SPRITE CONFIG --- */
const SPRITE_SHEETS = {
    surface: '/assets/fishing/fishing_surface.png',
    seagrass: '/assets/fishing/fishing_seagrass.png',
    coral: '/assets/fishing/fishing_coral.png',
    twilight: '/assets/fishing/fishing_twilight.png',
    abyss: '/assets/fishing/fishing_abyss.png',
    neon: '/assets/fishing/fishing_neon.png',
    boneyard: '/assets/fishing/fishing_boneyard.png',
    magma: '/assets/fishing/fishing_magma.png',
    frozen: '/assets/fishing/fishing_frozen.png',
    ether: '/assets/fishing/fishing_ether.png',
    void: '/assets/fishing/fishing_void.png',
};

const FISH_SPRITES = {
    // SURFACE (3x2)
    'boot': { sheet: 'surface', index: 0, grid: [3, 2] },
    'can': { sheet: 'surface', index: 1, grid: [3, 2] },
    'goldy': { sheet: 'surface', index: 2, grid: [3, 2] },
    'shrimp': { sheet: 'surface', index: 3, grid: [3, 2] },
    'bottle': { sheet: 'surface', index: 4, grid: [3, 2] },
    'wood': { sheet: 'surface', index: 5, grid: [3, 2] },
    'ducky': { sheet: 'surface', index: 0, grid: [3, 2] }, // Reuse boot/misc if missing, or use unique if gen allowed
    'sushi': { sheet: 'surface', index: 2, grid: [3, 2] }, // Reuse goldy temporarily

    // SEAGRASS (3x3)
    'crab': { sheet: 'seagrass', index: 0, grid: [3, 3] },
    'turtle': { sheet: 'seagrass', index: 1, grid: [3, 3] },
    'seahorse': { sheet: 'seagrass', index: 2, grid: [3, 3] },
    'snake': { sheet: 'seagrass', index: 3, grid: [3, 3] },
    'eel': { sheet: 'seagrass', index: 4, grid: [3, 3] },
    'snail': { sheet: 'seagrass', index: 5, grid: [3, 3] },
    'cuke': { sheet: 'seagrass', index: 6, grid: [3, 3] },

    // CORAL (4x2 likely based on gen image shape, let's assume 4x2)
    'guppy': { sheet: 'coral', index: 0, grid: [4, 2] },
    'clown': { sheet: 'coral', index: 1, grid: [4, 2] },
    'squid': { sheet: 'coral', index: 2, grid: [4, 2] },
    'lobster': { sheet: 'coral', index: 3, grid: [4, 2] },
    'puffer': { sheet: 'coral', index: 4, grid: [4, 2] },
    'star': { sheet: 'coral', index: 5, grid: [4, 2] },
    'box': { sheet: 'coral', index: 6, grid: [4, 2] },
    'conch': { sheet: 'coral', index: 7, grid: [4, 2] },

    // TWILIGHT (3x2)
    'jelly': { sheet: 'twilight', index: 0, grid: [3, 2] },
    'stingray': { sheet: 'twilight', index: 1, grid: [3, 2] }, // 1?
    // Wait, generated image showed Jelly, Ray, Ray... let's check index
    // Top row: Jelly, Ray1, Ray2? No, Ray1, Ray2, Angler?
    // Let's assume standard left-to-right reading of prompt items.
    // 1. Jelly, 2. Stingray, 3. Angler?
    // But gen usually does 3x2.
    // Let's map safely:
    // 'stingray': { sheet: 'twilight', index: 1, grid: [3, 2] },
    'angler': { sheet: 'twilight', index: 3, grid: [3, 2] }, // Row 2 Item 1? Or Row 1 Item 3?
    // Let's guess: Top: Jelly, Ray, Angler. Bot: Sword, Flash, Vamp.
    // 'stingray': { sheet: 'twilight', index: 1, grid: [3, 2] },
    // 'angler': { sheet: 'twilight', index: 2, grid: [3, 2] },
    'sword': { sheet: 'twilight', index: 3, grid: [3, 2] },
    'flash': { sheet: 'twilight', index: 4, grid: [3, 2] },
    'vamp': { sheet: 'twilight', index: 5, grid: [3, 2] },

    // ABYSS (3x3) - Midnight + Trench
    'shark': { sheet: 'abyss', index: 0, grid: [3, 3] }, // Great White
    'whale': { sheet: 'abyss', index: 1, grid: [3, 3] },
    'moon': { sheet: 'abyss', index: 2, grid: [3, 3] },
    'wolf': { sheet: 'abyss', index: 3, grid: [3, 3] },
    'sleep': { sheet: 'abyss', index: 4, grid: [3, 3] },
    'blob': { sheet: 'abyss', index: 5, grid: [3, 3] },
    'worm': { sheet: 'abyss', index: 6, grid: [3, 3] },
    'viper': { sheet: 'abyss', index: 7, grid: [3, 3] },
    'iso': { sheet: 'abyss', index: 8, grid: [3, 3] },

    // NEON (3x2)
    'cyber': { sheet: 'neon', index: 0, grid: [3, 2] },
    'robot': { sheet: 'neon', index: 1, grid: [3, 2] },
    'floppy': { sheet: 'neon', index: 2, grid: [3, 2] },
    'batt': { sheet: 'neon', index: 3, grid: [3, 2] },
    'glitch_neon': { sheet: 'neon', index: 4, grid: [3, 2] },

    // BONEYARD (3x2)
    'skull': { sheet: 'boneyard', index: 0, grid: [3, 2] }, // Bone Fish
    'fossil': { sheet: 'boneyard', index: 1, grid: [3, 2] },
    'dino': { sheet: 'boneyard', index: 2, grid: [3, 2] }, // T-Rex
    'key': { sheet: 'boneyard', index: 3, grid: [3, 2] },
    'pirate_skull': { sheet: 'boneyard', index: 4, grid: [3, 2] },

    // MAGMA (2x2)
    'ember': { sheet: 'magma', index: 0, grid: [2, 2] },
    'dragon': { sheet: 'magma', index: 1, grid: [2, 2] },
    'rock': { sheet: 'magma', index: 2, grid: [2, 2] },
    'cooked': { sheet: 'magma', index: 3, grid: [2, 2] },

    // FROZEN (2x2)
    'ice': { sheet: 'frozen', index: 0, grid: [2, 2] },
    'penguin': { sheet: 'frozen', index: 1, grid: [2, 2] },
    'yeti': { sheet: 'frozen', index: 2, grid: [2, 2] },
    'pizza': { sheet: 'frozen', index: 3, grid: [2, 2] },

    // ETHER (3x2?)
    'spirit': { sheet: 'ether', index: 0, grid: [3, 2] }, // Wisp
    'angel': { sheet: 'ether', index: 1, grid: [3, 2] }, // Seraphim
    'cloud': { sheet: 'ether', index: 2, grid: [3, 2] }, // Nimbus
    'harp': { sheet: 'ether', index: 3, grid: [3, 2] },
    'blackhole': { sheet: 'ether', index: 4, grid: [3, 2] }, // Singularity

    // VOID (3x2)
    'glitch': { sheet: 'void', index: 0, grid: [3, 2] }, // MissingNo
    'eye': { sheet: 'void', index: 1, grid: [3, 2] }, // Watcher
    'alien': { sheet: 'void', index: 2, grid: [3, 2] }, // Invader
    'dna': { sheet: 'void', index: 3, grid: [3, 2] },
    'null': { sheet: 'void', index: 4, grid: [3, 2] },
    'undef': { sheet: 'void', index: 5, grid: [3, 2] },
};

const GAME_WIDTH = 1280; // Widescreen
const GAME_HEIGHT = 720;
const MAX_DEPTH = 4000;
const BAR_HEIGHT = 80;
const BAR_AREA_HEIGHT = 300;

// Social Helper
const shareToIG = (fish, weight) => {
    const text = `I just caught a ${weight}kg ${fish.name} in Deep Dive Fishing! 🎣 Can you beat my record? #CrazyFishing @br0dad`;
    navigator.clipboard.writeText(text).then(() => {
        alert("Caption copied! Tag @br0dad on Instagram! 📸");
    });
};

const CrazyFishing = () => {
    // Orientation Check
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    // FIX: Provide default shopState to prevent crash if context is missing
    const { shopState = { unlocked: [], equipped: {} }, playSound, incrementStat, updateStat, addCoins, userProfile } = useGamification() || {};

    useEffect(() => {
        const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ... (State code) ...

    const [gameState, setGameState] = useState('IDLE');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [caughtFish, setCaughtFish] = useState(null);
    const [measuredWeight, setMeasuredWeight] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [zoneNotification, setZoneNotification] = useState(null);

    // USE GLOBAL SHOP STATE for skin and rod
    // USE GLOBAL SHOP STATE for skin and rod
    // (Syncing handled in useEffect below)
    // Wait, shopState.equipped.fishing only holds ONE item.
    // If user equips a rod, they lose their boat skin?
    // FIX: CrazyFishing probably needs separate slots in global shop or just support one active "fishing item".
    // For now, let's assume 'fishing' slot is for the BOAT, and we check 'unlocked' for PASSIVE upgrades like Rods?
    // No, standard is equipped.
    // Let's check ShopItems.js categories. 
    // 'fishing' category contains BOTH rods and boats.
    // If I equip a rod, `shopState.equipped.fishing` becomes 'rod_gold'.
    // If I equip a boat, it becomes 'boat_duck'.
    // This is a conflict!
    // I should probably split them in the CONTEXT or just handle it here.
    // Hack for now: check if the equipped item string starts with 'rod_' or 'boat_'.
    // Ideally, we want to allow BOTH.
    // But GamificationContext `equipItem` over-writes the category key.

    // TEMPORARY FIX:
    // We will trust `shopState.equipped.fishing` for the VISUAL (Boat/Rod).
    // If it's a rod, we show default boat + special rod.
    // If it's a boat, we show special boat + default rod?
    // That's annoying.
    // Let's stick to the requested "Boat Skins".

    const [coins, setCoins] = useState(0);
    const [inventory, setInventory] = useState([]); // Restore local inventory for compatibility
    const [equippedSkin, setEquippedSkin] = useState('boat_default');
    const [equippedBobber, setEquippedBobber] = useState('bobber_red');
    const [hasGoldenRod, setHasGoldenRod] = useState(false);

    // Refs
    const gameStateRef = useRef('IDLE');
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const logoImgRef = useRef(null);

    // State Refs (For Game Loop)
    const skinRef = useRef('boat_default');
    const invRef = useRef([]); // Unlocked items for upgrades
    const comboRef = useRef(0);
    const spritesRef = useRef({});

    // Load Sprites
    useEffect(() => {
        Object.entries(SPRITE_SHEETS).forEach(([key, src]) => {
            const img = new Image();
            img.src = src;
            spritesRef.current[key] = img;
        });
    }, []);

    // Sync Refs on Every Render
    useEffect(() => {
        // --- SYNC SKINS & RODS ---
        let skin = 'boat_default';
        let useGoldRod = false;

        if (shopState?.equipped) {
            // New Granular Slots
            if (shopState.equipped.fishing_boat) skin = shopState.equipped.fishing_boat;
            if (shopState.equipped.fishing_rod === 'rod_gold') useGoldRod = true;

            // Legacy / Fallback (if mixed)
            if (shopState.equipped.fishing) {
                const item = shopState.equipped.fishing;
                if (item.includes('boat')) skin = item;
                if (item === 'rod_gold') useGoldRod = true;
            }
        }

        // Apply Skin
        skinRef.current = skin;
        setEquippedSkin(skin);
        if (shopState?.equipped?.fishing_bobber) setEquippedBobber(shopState.equipped.fishing_bobber);

        // Apply Rod
        if (shopState?.unlocked?.includes('rod_gold')) useGoldRod = true;

        setHasGoldenRod(useGoldRod);



        // Pass unlocked items for passive bonuses (Hats, Rods, etc)
        if (shopState?.unlocked) {
            invRef.current = shopState.unlocked;
        }

        comboRef.current = combo;
    }, [shopState, combo]);

    // Physics State...
    const stateRef = useRef({
        hookX: GAME_WIDTH / 2,
        hookY: 100,
        depth: 0,
        fish: [],
        lastSpawnDepth: 0,

        // Battle
        battleFish: null,
        barPos: 0,
        barVel: 0,
        fishPos: 0,
        fishTarget: 0,
        fishTimer: 0,
        catchPercent: 30,

        // Visuals
        castTimer: 0,
        particles: [],
        shake: 0,
        bossSpawned: false,
        lastBiomeIndex: -1 // Track zones
    });

    const isMouseDown = useRef(false);
    const { playBeep, playJump, playCollect, playWin, playCrash } = useRetroSound();

    // --- INIT ---
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/boy-logo.png';
        logoImgRef.current = img;

        // Load Save (Safeguarded)
        try {
            const savedCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
            setCoins(savedCoins);
            const savedInv = JSON.parse(localStorage.getItem('fishingInventory')) || [];
            setInventory(savedInv);
            const savedSkin = localStorage.getItem('fishingSkin') || 'default';
            setEquippedSkin(savedSkin);
            const savedBobber = localStorage.getItem('fishingBobber') || 'lure_neon';
            setEquippedBobber(savedBobber);
            if (localStorage.getItem('goldenRod')) setHasGoldenRod(true);
        } catch (e) {
            console.error("Save file corrupted, resetting", e);
        }

        // Start Loop (Continuous)
        if (!stateRef.current.isRunning) {
            stateRef.current.isRunning = true;
            requestRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            stateRef.current.isRunning = false;
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const buyItem = (item) => {
        if (inventory.includes(item.id)) {
            // Equip if owned
            if (item.type === 'skin') {
                setEquippedSkin(item.id);
                localStorage.setItem('fishingSkin', item.id);
                playCollect();
            } else if (item.type === 'bobber') {
                setEquippedBobber(item.id);
                localStorage.setItem('fishingBobber', item.id);
                playCollect();
            }
            return;
        }
        if (coins >= item.price) {
            const newCoins = coins - item.price;
            setCoins(newCoins);
            localStorage.setItem('arcadeCoins', newCoins);

            const newInv = [...inventory, item.id];
            setInventory(newInv);
            localStorage.setItem('fishingInventory', JSON.stringify(newInv));

            playWin();
            // Auto Equip
            if (item.type === 'skin') {
                setEquippedSkin(item.id);
                localStorage.setItem('fishingSkin', item.id);
            } else if (item.type === 'bobber') {
                setEquippedBobber(item.id);
                localStorage.setItem('fishingBobber', item.id);
            }
        } else {
            playCrash(); // Too poor
        }
    };

    // --- LOOP ---
    const gameLoop = () => {
        if (!stateRef.current.isRunning) return;

        try {
            const currentMode = gameStateRef.current;
            const state = stateRef.current;
            const ctx = canvasRef.current?.getContext('2d');

            if (ctx) {
                // 1. UPDATE
                updateEntities(currentMode, state);

                // 2. DRAW
                drawGame(ctx, currentMode, state);
            }
        } catch (e) { console.error(e); }

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const updateEntities = (mode, state) => {
        // GLOBAL PARTICLE UPDATE (Runs in all modes)
        state.particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.015; // Slower fade for longer trails
        });
        state.particles = state.particles.filter(p => p.life > 0 && p.y > -100);

        // Shake Decay
        if (state.shake > 0) {
            state.shake *= 0.9;
            if (state.shake < 0.5) state.shake = 0;
        }

        // --- BOBBER TRAILS ---
        if (equippedBobber && state.depth >= 0) {
            const isMoving = mode === 'DROPPING' || mode === 'REELING_UP';
            const intensity = isMoving ? 0.9 : 0.3;

            // Find Bobber Config
            const config = SHOP_ITEMS.find(i => i.id === equippedBobber);

            if (Math.random() < intensity) {
                if (config && config.color) {
                    // Dynamic Color Lures
                    state.particles.push({
                        x: state.hookX + (Math.random() - 0.5) * 10,
                        y: state.hookY,
                        dx: (Math.random() - 0.5) * 2,
                        dy: -2 - Math.random(),
                        life: 1,
                        char: config.char || '●',
                        color: config.color,
                        size: isMoving ? 20 : 10
                    });
                } else {
                    // Fallback / Legacy
                    state.particles.push({
                        x: state.hookX, y: state.hookY,
                        dx: 0, dy: 0, life: 0.5, char: '🔴', color: 'red'
                    });
                }
            }
        }

        // IDLE Animation
        if (mode === 'IDLE') {
            state.castTimer++; // Use castTimer for idle rocking
        }

        // CASTING
        if (mode === 'CASTING') {
            state.castTimer++;
            if (state.castTimer > 120) startDrop();
        }

        // DROPPING
        if (mode === 'DROPPING') {
            // Start Drop (Slower)
            state.depth += 0.45;
            if (state.depth > MAX_DEPTH) state.depth = MAX_DEPTH;

            // Biome Check
            const currentBiome = BIOMES.find(b => state.depth <= b.maxDepth) || BIOMES[0];
            const biomeIndex = BIOMES.indexOf(currentBiome);
            if (biomeIndex !== state.lastBiomeIndex) {
                state.lastBiomeIndex = biomeIndex;
                if (biomeIndex > 0) {
                    setZoneNotification(currentBiome.name);
                    setTimeout(() => setZoneNotification(null), 3000);
                    if (navigator.vibrate) navigator.vibrate(200);
                }
            }

            // 1. ATMOSPHERIC EFFECTS (25% Chance Activity)
            if (Math.random() > 0.98) { // Rare tick
                // Spawn Effect based on Biome
                if (currentBiome.effect === 'STAR') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: 0, dx: 2 + Math.random() * 3, dy: 2 + Math.random() * 3, life: 1.5, char: '🌠', color: 'yellow' });
                }
                else if (currentBiome.effect === 'BUBBLE_COLUMN') {
                    for (let k = 0; k < 5; k++) state.particles.push({ type: 'bg', x: 100 + Math.random() * 50, y: GAME_HEIGHT + k * 20, dx: 0, dy: -2 - Math.random(), life: 3, char: '○', color: 'rgba(255,255,255,0.3)' });
                }
                else if (currentBiome.effect === 'VOLCANO') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: GAME_HEIGHT, dx: (Math.random() - 0.5), dy: -1, life: 4, char: '🌋', color: 'red' });
                }
                else if (currentBiome.effect === 'AURORA') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, dx: 0.2, dy: 0, life: 5, char: '〰️', color: 'cyan' });
                }
                else if (currentBiome.effect === 'EYES') {
                    if (Math.random() > 0.5) state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, dx: 0, dy: 0, life: 1, char: '👀', color: 'red', size: 40 });
                }
                else if (currentBiome.effect === 'FOG') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, dx: (Math.random() - 0.5), dy: 0, life: 4, char: '☁️', color: 'rgba(100,100,100,0.2)', size: 100 });
                }
                else if (currentBiome.effect === 'MATRIX') {
                    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: 0, dx: 0, dy: 5 + Math.random() * 5, life: 2, char: char, color: '#00ff00' });
                }
                else if (currentBiome.effect === 'BONES') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: 0, dx: (Math.random() - 0.5), dy: 2 + Math.random(), life: 3, char: '🦴', color: '#ccc' });
                }
                else if (currentBiome.effect === 'EMBER') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: GAME_HEIGHT, dx: (Math.random() - 0.5) * 2, dy: -4 - Math.random(), life: 2, char: '🔥', color: 'orange' });
                }
                else if (currentBiome.effect === 'SNOW') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: 0, dx: (Math.random() - 0.5), dy: 1 + Math.random(), life: 3, char: '❄️', color: 'white' });
                }
                else if (currentBiome.effect === 'SPIRIT') {
                    state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: GAME_HEIGHT, dx: (Math.random() - 0.5), dy: -1, life: 4, char: '✨', color: 'violet' });
                }
                else if (currentBiome.effect === 'GLITCH') {
                    if (Math.random() > 0.2) state.particles.push({ type: 'bg', x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, dx: 0, dy: 0, life: 0.5, char: ['░', '▒', '▓'][Math.floor(Math.random() * 3)], color: 'white' });
                }
            }

            // Spawn Regular Particles based on Biome
            if (Math.random() > 0.9) {
                state.particles.push({
                    x: Math.random() * GAME_WIDTH,
                    y: GAME_HEIGHT + 10,
                    dx: (Math.random() - 0.5) * 0.5,
                    dy: -1 - Math.random(), // Bubble up
                    life: 2,
                    char: currentBiome.particle
                });
            }

            // Spawn Fish Logic
            if (state.depth - state.lastSpawnDepth > 12) {
                state.lastSpawnDepth = state.depth;

                // 0. GOD CHEST (Floor)
                if (state.depth > 3980 && !state.godChestSpawned) {
                    state.fish.push({
                        x: GAME_WIDTH / 2 - 50, y: GAME_HEIGHT + 50,
                        type: { id: 'god_chest', name: 'GOD CHEST', score: 0, emoji: '👑⚰️', pattern: 'FLOAT', speed: 0, weight: [420, 420], instant: true, god: true },
                        id: 'god', dir: 0
                    });
                    state.godChestSpawned = true;
                }
                // 1. Check for Boss (Abyss only)
                else if (state.depth > 1900 && state.depth < 2500 && !state.bossSpawned) {
                    state.fish.push({
                        x: Math.random() * (GAME_WIDTH - 40), y: GAME_HEIGHT + 50,
                        type: { id: 'mermaid', name: 'MER-LOGO', score: 300, type: 'image', src: '/assets/boy-logo.png', pattern: 'GLITCH', speed: 5, legendary: true, emoji: '🧜‍♂️' },
                        id: Math.random(), dir: 1
                    });
                    state.bossSpawned = true;
                }
                // 2. Check for Treasure Chest (Rare)
                else if (Math.random() > 0.95) {
                    state.fish.push({
                        x: Math.random() * (GAME_WIDTH - 40), y: GAME_HEIGHT + 50,
                        type: { id: 'chest', name: 'Treasure!', score: 50, emoji: '💎', pattern: 'FLOAT', speed: 0, weight: [5, 5], instant: true },
                        id: Math.random(), dir: 0
                    });
                }
                // 3. Spawn Normal Fish
                else {
                    let choices = FISH_DATA.filter(f => state.depth >= f.minDepth && state.depth <= f.maxDepth);
                    if (Math.random() > 0.1) choices = choices.filter(f => !f.legendary); // 90% chance to hide legendaries

                    if (choices.length > 0) {
                        const baseType = choices[Math.floor(Math.random() * choices.length)];
                        // SHINY VARIANT CHECK
                        const isShiny = Math.random() > 0.9; // 10% chance
                        const type = {
                            ...baseType,
                            score: isShiny ? baseType.score * 3 : baseType.score,
                            name: isShiny ? `Shiny ${baseType.name}` : baseType.name,
                            shiny: isShiny
                        };

                        // SPAWN LOGIC: 20% Top Down
                        const fromTop = Math.random() > 0.8;
                        const isEel = type.id === 'eel' || type.id === 'snake';
                        const swimUp = isEel && Math.random() > 0.5;

                        state.fish.push({
                            x: Math.random() * (GAME_WIDTH - 40),
                            y: fromTop ? -50 : (swimUp ? GAME_HEIGHT + 50 : GAME_HEIGHT + 50),
                            type, id: Math.random(),
                            dir: Math.random() > 0.5 ? 1 : -1,
                            fromTop: fromTop,
                            swimUp: swimUp
                        });
                    }
                }
            }

            // Move Fish
            state.fish.forEach(f => {
                if (mode === 'REELING_UP') {
                    f.y += 25;
                } else {
                    // Normal Dropping Movement
                    if (f.fromTop) {
                        f.y += 1; // Moves slightly UP screen (slower than camera)
                    } else if (f.swimUp) {
                        f.y -= 6; // Swim UP fast
                        f.x += Math.sin(state.depth * 0.1) * 5; // Squiggly
                    } else {
                        f.y -= 3; // Standard Parallax
                    }
                }

                f.x += f.dir * 2;
                if (f.x < 0 || f.x > GAME_WIDTH - 40) f.dir *= -1;
            });
            // Filter logic: In reel up, we want to keep them until they hit bottom
            if (mode === 'REELING_UP') {
                state.fish = state.fish.filter(f => f.y < GAME_HEIGHT + 100);
            } else {
                state.fish = state.fish.filter(f => f.y > -50);
            }

            // Bounds Collision (Hook)
            const hookRect = { x: state.hookX - 10, y: state.hookY - 10, w: 20, h: 20 };

            // Check Floor (Miss/Chest)
            if (state.depth >= MAX_DEPTH) {
                // Hit the bottom - ABYSS CHEST
                const reward = Math.floor(Math.random() * 501); // 0-500
                startBattle({
                    id: 'abyss_chest',
                    name: 'Abyss Chest',
                    score: reward,
                    emoji: '🎁',
                    pattern: 'FLOAT',
                    speed: 0,
                    weight: [50, 50],
                    instant: true
                });
                return;
            }

            // Check Fish
            for (let f of state.fish) {
                if (hookRect.x < f.x + 40 && hookRect.x + hookRect.w > f.x && hookRect.y < f.y + 40 && hookRect.y + hookRect.w > f.y) {
                    startBattle(f.type);
                    return;
                }
            }
        }

        // BATTLE
        if (mode === 'BATTLE' && state.battleFish) {
            // Bar Logic (Inertia based - Snappier/Harder)
            if (isMouseDown.current) state.barVel += 0.4; else state.barVel -= 0.3; // Increased gravity/lift
            state.barPos += state.barVel;

            // Bounce/Clamping
            const maxBar = BAR_AREA_HEIGHT - BAR_HEIGHT;
            if (state.barPos < 0) { state.barPos = 0; state.barVel = 0; }
            if (state.barPos > maxBar) { state.barPos = maxBar; state.barVel = 0; }

            // Fish AI (Smoother, Stardew-like patterns)
            const { pattern } = state.battleFish;
            // Base speed increase for challenge
            const speed = (state.battleFish.speed || 1) * 1.0;

            state.fishTimer++;
            const maxFish = BAR_AREA_HEIGHT - 40;

            // Target seeking logic (Lerp for smoothness)
            if (!state.fishTarget) state.fishTarget = state.fishPos;

            if (pattern === 'FLOAT') {
                // Chill, changes mind every 1s
                if (state.fishTimer % 60 === 0) state.fishTarget = Math.random() * maxFish;
                // Move towards target
                const d = state.fishTarget - state.fishPos;
                state.fishPos += Math.sign(d) * Math.min(Math.abs(d), speed);
            }
            else if (pattern === 'DART') {
                // Sits still, then DASHES
                if (state.fishTimer % 120 === 0) {
                    state.fishTarget = Math.random() * maxFish;
                }
                const d = state.fishTarget - state.fishPos;
                // Only move if we have a target delta, else drift
                if (Math.abs(d) > 10) {
                    // Dash speed
                    state.fishPos += Math.sign(d) * Math.min(Math.abs(d), speed * 4);
                } else {
                    // Drift
                    state.fishPos += Math.sin(state.fishTimer / 20) * 0.5;
                }
            }
            else if (pattern === 'SINE') {
                // Predictable Wave
                state.fishPos = (maxFish / 2) + Math.sin(Date.now() / 800) * (maxFish / 2 - 10);
            }
            else if (pattern === 'GLITCH') {
                // Teleport rarely
                if (state.fishTimer % 60 === 0 && Math.random() > 0.7) {
                    state.fishPos = Math.random() * maxFish;
                }
                // Jitter
                state.fishPos += (Math.random() - 0.5) * speed * 4;
            }

            // Bounds check
            state.fishPos = Math.max(0, Math.min(maxFish, state.fishPos));

            // Catch Logic (Stardew Mechanics)
            const barB = state.barPos; const barT = state.barPos + BAR_HEIGHT;
            const fishB = state.fishPos; const fishT = state.fishPos + 40;
            // Generous overlap detection
            const overlap = (barB < fishT - 5 && barT > fishB + 5);

            // BALANCING
            // Gain: Constant steady rate
            // Drain: Scales gently with fish Score logic
            const difficultyMod = Math.min((state.battleFish.score || 10) * 0.0005, 0.3); // Cap max drain penalty

            if (overlap) {
                state.catchPercent += 0.3; // Steady progress
            } else {
                // DRAIN (Fish escaping)
                const drain = 0.1 + difficultyMod; // Base drain 0.1, Max drain 0.4
                state.catchPercent -= drain;

                // Shake bar if losing
                if (state.fishTimer % 5 === 0) {
                    state.barPos += (Math.random() - 0.5) * 5;
                }
            }

            // WIN / LOSE
            if (state.catchPercent >= 100) {
                startReelUp();
            } else if (state.catchPercent <= 0) {
                // FAIL CONDITION
                loseBattle();
            }
        }

        // REELING UP (Reverse Journey)
        if (mode === 'REELING_UP') {
            state.depth -= 8; // Extended ascent time

            // Spawn Passing Fish (Visual only)
            if (Math.random() > 0.4) { // 60% spawn chance (Frequent)
                const choices = FISH_DATA.filter(f => state.depth >= f.minDepth && state.depth <= f.maxDepth);
                if (choices.length > 0) {
                    const base = choices[Math.floor(Math.random() * choices.length)];
                    state.fish.push({
                        x: Math.random() * (GAME_WIDTH - 40),
                        y: -50, // Spawn top
                        type: base, id: Math.random(), dir: Math.random() > 0.5 ? 1 : -1
                    });
                }
            }

            if (state.depth <= 0) {
                // Instead of direct success, go into SHOWCASE
                state.depth = 0;
                startShowcase();
            }
        }

        // SHOWCASE (ZELDA LIFT)
        if (mode === 'SHOWCASE_CATCH') {
            state.castTimer++; // Reuse timer for animation

            // Fast showcase
            if (state.castTimer > 30) {
                catchSuccess();
            }
        }
    };

    const drawGame = (ctx, mode, state) => {
        ctx.save();
        if (state.shake > 0) {
            const dx = (Math.random() - 0.5) * state.shake;
            const dy = (Math.random() - 0.5) * state.shake;
            ctx.translate(dx, dy);
        }
        ctx.save();
        // Screen Shake
        if (state.shake > 0) {
            const dx = (Math.random() - 0.5) * state.shake;
            const dy = (Math.random() - 0.5) * state.shake;
            ctx.translate(dx, dy);
        }
        // 1. DYNAMIC BACKGROUND (BIOME)
        const currentBiome = BIOMES.find(b => state.depth <= b.maxDepth) || BIOMES[0];
        // Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
        grad.addColorStop(0, currentBiome.color[0]);
        grad.addColorStop(1, currentBiome.color[1]);
        if (mode === 'SHOWCASE_CATCH') {
            // Sunny Sky override
            ctx.fillStyle = '#87CEEB';
        } else {
            ctx.fillStyle = grad;
        }
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 2. CASTING / IDLE ANIMATION
        if (mode === 'CASTING' || mode === 'IDLE' || mode === 'SHOP' || mode === 'FISHDEX') {
            // In IDLE/SHOP/DEX, we still want to show the boat background
            drawCasting(ctx, state);
            ctx.restore();
            return;
        }

        // 3. SHOWCASE ANIMATION
        if (mode === 'SHOWCASE_CATCH') {
            drawShowcase(ctx, state);
            ctx.restore();
            return;
        }

        // 3. GAME ELEMENTS
        // Depth Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        const offset = (state.depth * 10) % 100;
        for (let i = 0; i < GAME_HEIGHT; i += 100) {
            ctx.beginPath(); ctx.moveTo(0, i - offset); ctx.lineTo(GAME_WIDTH, i - offset); ctx.stroke();
        }

        // Particles
        state.particles.forEach(p => {
            ctx.save();
            ctx.fillStyle = p.color || `rgba(255,255,255,${p.life})`;
            if (p.color) {
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;
            }
            ctx.font = p.size ? `${p.size}px serif` : '20px serif';
            ctx.fillText(p.char, p.x, p.y);
            ctx.restore();
        });

        // 3. LIGHTING & ATMOSPHERE (ABYSS ENGINE)
        drawLighting(ctx, state);

        // 4. FISH DROPPING (WITH HATS)
        if (mode === 'DROPPING') {
            ctx.font = '30px serif';
            state.fish.forEach(f => {
                // Shiny Glow
                if (f.type.shiny) { ctx.shadowColor = 'gold'; ctx.shadowBlur = 10; }

                // SPRITE RENDER
                const spriteCfg = FISH_SPRITES[f.type.id];
                const sheet = spriteCfg ? spritesRef.current[spriteCfg.sheet] : null;

                if (sheet && sheet.complete && sheet.naturalWidth !== 0) {
                    const cols = spriteCfg.grid[0];
                    const rows = spriteCfg.grid[1];
                    const sw = sheet.width / cols;
                    const sh = sheet.height / rows;
                    const sx = (spriteCfg.index % cols) * sw;
                    const sy = Math.floor(spriteCfg.index / cols) * sh;

                    const size = 60; // Standard size

                    ctx.save();
                    // Center pivot for flipping
                    const drawX = f.x + 20; // approximate center of emoji text bounds
                    const drawY = f.y - 10;
                    ctx.translate(drawX, drawY);

                    if (f.dir === -1) ctx.scale(-1, 1); // Flip if moving left

                    ctx.drawImage(sheet, sx, sy, sw, sh, -size / 2, -size / 2, size, size);
                    ctx.restore();
                } else {
                    // Fallback Emoji
                    ctx.fillText(f.type.emoji, f.x, f.y);
                }

                // BUBBLES (Atmosphere)
                if (Math.random() > 0.95) {
                    state.particles.push({
                        x: f.x + (Math.random() * 40), y: f.y,
                        dx: 0, dy: -2, life: 1.0, char: '°', size: 10 + Math.random() * 5,
                        color: 'rgba(200, 255, 255, 0.5)'
                    });
                }

                ctx.shadowBlur = 0;

                // Cosmetic Hat (If unlocked)
                if (invRef.current.includes('hats') && !f.type.instant) {
                    ctx.font = '20px serif';
                    // Random hat based on ID
                    const hat = (Math.floor(f.id * 100) % 2 === 0) ? '🎩' : '🧢';
                    ctx.fillText(hat, f.x, f.y - 20);
                    ctx.font = '30px serif';
                }
                // Suit? just a tie unicode maybe
                if (invRef.current.includes('hats') && Math.random() > 0.8) {
                    ctx.font = '15px serif';
                    ctx.fillText('👔', f.x + 5, f.y + 15);
                }
            });
        }

        // Hook line
        ctx.strokeStyle = hasGoldenRod ? 'gold' : 'silver';
        ctx.lineWidth = hasGoldenRod ? 3 : 1;
        ctx.beginPath(); ctx.moveTo(state.hookX, 0); ctx.lineTo(state.hookX, state.hookY); ctx.stroke();

        // Hook / Bobber
        ctx.fillStyle = hasGoldenRod ? 'gold' : 'silver';

        // Render Bobber Skin
        const bobberIcon = equippedBobber === 'bobber_duck' ? '🦆' :
            equippedBobber === 'bobber_skull' ? '💀' :
                equippedBobber === 'bobber_sparkle' ? '✨' :
                    equippedBobber === 'bobber_neon' ? '🧿' :
                        equippedBobber === 'bobber_comet' ? '☄️' : null;

        if (bobberIcon) {
            ctx.font = '20px serif';
            ctx.fillText(bobberIcon, state.hookX - 10, state.hookY + 5);
        } else {
            // Default Rect Hook
            ctx.fillRect(state.hookX - 5, state.hookY, 10, 10);
        }

        // Special skin laser check?
        if (skinRef.current === 'ufo') {
            ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(state.hookX, 0); ctx.lineTo(state.hookX, state.hookY); ctx.stroke();
        }

        // REELING UP VISUALS
        if (mode === 'REELING_UP') {
            // Draw Caught Fish on Hook
            const f = state.battleFish;
            ctx.font = '40px serif';
            if (f.type === 'image') ctx.fillText('🧜‍♂️', state.hookX - 20, state.hookY + 40);
            else ctx.fillText(f.emoji, state.hookX - 20, state.hookY + 40);
        }

        // BATTLE UI
        if (mode === 'BATTLE' && state.battleFish) {
            // ... (Draw Green Bar, Fish, Progress - Same as V9)
            // Simplified for brevity in this step, assume standard drawing code
            drawBattle(ctx, state);
        }

        // SPEED LINES (Dropping)
        if (mode === 'DROPPING' || mode === 'REELING_UP') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const lx = Math.random() * GAME_WIDTH;
                const ly = Math.random() * GAME_HEIGHT;
                ctx.moveTo(lx, ly);
                ctx.lineTo(lx, ly + (mode === 'DROPPING' ? -100 : 100));
            }
            ctx.stroke();
        }

        // HUD - MOVED TO HTML OVERLAY (See Render)
    };

    // Helper    // Draw Boat based on Skin
    const drawCasting = (ctx, state) => {
        // Sky & Water
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = '#006994'; ctx.fillRect(0, GAME_HEIGHT - 100, GAME_WIDTH, 100);

        const CX = GAME_WIDTH / 2;
        const CY = GAME_HEIGHT - 100;
        const t = state.castTimer;
        const rockAmt = (t < 60) ? Math.sin(t) * 10 : 0;

        ctx.save();
        ctx.translate(CX, CY);
        ctx.rotate(rockAmt * Math.PI / 180);
        ctx.translate(-CX, -CY);

        // SKIN LOGIC
        // Map global IDs (boat_duck) to local logic if needed, or just update cases
        const skinId = skinRef.current;

        switch (skinId) {
            case 'boat_duck': case 'duck': ctx.font = '100px serif'; ctx.fillText('🦆', CX - 50, CY + 30); break;
            case 'boat_ufo': case 'ufo': ctx.font = '100px serif'; ctx.fillText('🛸', CX - 50, CY + 30); break;
            case 'boat_pirate': case 'pirate': ctx.font = '100px serif'; ctx.fillText('🏴‍☠️', CX - 50, CY + 10); ctx.fillStyle = '#5C4033'; ctx.fillRect(CX - 70, CY + 10, 140, 40); break;
            case 'boat_banana': case 'banana': ctx.font = '100px serif'; ctx.fillText('🍌', CX - 50, CY + 10); break;
            case 'boat_viking': case 'viking': ctx.font = '100px serif'; ctx.fillText('🛶', CX - 50, CY + 10); ctx.font = '40px serif'; ctx.fillText('🛡️', CX - 30, CY + 30); ctx.fillText('🛡️', CX + 30, CY + 30); break;

            // MEME SKINS
            case 'boat_box': case 'box': ctx.font = '100px serif'; ctx.fillText('📦', CX - 50, CY + 20); break;
            case 'boat_trash': case 'trash': ctx.font = '100px serif'; ctx.fillText('🗑️', CX - 50, CY + 20); break;
            case 'boat_toilet': case 'toilet': ctx.font = '100px serif'; ctx.fillText('🚽', CX - 50, CY + 20); break;
            case 'boat_tub': case 'tub': ctx.font = '100px serif'; ctx.fillText('🛁', CX - 50, CY + 20); break;
            case 'boat_chair': case 'chair': ctx.font = '100px serif'; ctx.fillText('💺', CX - 50, CY + 20); break;
            case 'boat_pizza': case 'pizza_raft': ctx.font = '120px serif'; ctx.fillText('🍕', CX - 60, CY + 40); break;
            case 'boat_carpet': case 'carpet': ctx.font = '120px serif'; ctx.fillText('🧞', CX - 60, CY + 40);
                ctx.fillStyle = 'purple'; ctx.fillRect(CX - 60, CY, 120, 10); break;
            case 'boat_cloud': case 'cloud': ctx.font = '100px serif'; ctx.fillText('☁️', CX - 50, CY + 20); break;
            case 'boat_invisible': case 'invisible': /* Draws nothing */ break;
            case 'boat_balloon': case 'balloon':
                // Draw Balloon string going UP
                ctx.strokeStyle = 'white'; ctx.beginPath(); ctx.moveTo(CX, CY - 30); ctx.lineTo(CX, CY - 150); ctx.stroke();
                ctx.font = '80px serif'; ctx.fillText('🎈', CX - 25, CY - 150);
                break;
            default: // Default Boat
                ctx.fillStyle = '#8B4513';
                ctx.beginPath(); ctx.moveTo(CX - 100, CY - 20); ctx.lineTo(CX + 100, CY - 20); ctx.lineTo(CX + 70, CY + 30); ctx.lineTo(CX - 70, CY + 30); ctx.fill();
        }

        // Character Position adjustments
        let charY = CY - 30;
        let charX = CX;
        if (skinId.includes('balloon')) charY = CY - 50; // Hanging
        if (skinId.includes('chair') || skinId.includes('toilet')) charY = CY - 10; // Sitting

        // Stick Figure
        ctx.strokeStyle = 'black'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(charX, charY); ctx.lineTo(charX, charY - 50); // Body

        // Legs
        if (skinId.includes('balloon')) {
            // Legs dangling
            ctx.moveTo(charX, charY); ctx.lineTo(charX - 10, charY + 20);
            ctx.moveTo(charX, charY); ctx.lineTo(charX + 10, charY + 20);
        } else if (skinId.includes('chair') || skinId.includes('toilet')) {
            // Sitting legs
            ctx.moveTo(charX, charY); ctx.lineTo(charX + 20, charY); ctx.lineTo(charX + 20, charY + 20);
        } else {
            // Standing
            ctx.moveTo(charX - 20, charY + 10); ctx.lineTo(charX, charY); ctx.lineTo(charX + 20, charY + 10);
        }
        ctx.stroke();

        // Head
        ctx.save(); ctx.translate(charX, charY - 80); if (t < 60) ctx.rotate(t);
        if (logoImgRef.current && logoImgRef.current.complete) ctx.drawImage(logoImgRef.current, -25, -25, 50, 50);
        else { ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();

        // Arm & Rod logic same as before...
        let armAngle = 0; let rodAngle = 0;
        // ... (Time based angles)
        if (t < 60) { armAngle = -t; rodAngle = armAngle - Math.PI / 4; }
        else if (t < 80) { armAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.2; rodAngle = armAngle; }
        else { armAngle = Math.PI / 2; rodAngle = Math.PI / 3; }

        if (equippedSkin === 'balloon') { armAngle = Math.PI; } // Holding ON for dear life? No, fishing.
        // Actually, let's keep normal fishing arm.

        const shoulderX = charX; const shoulderY = charY - 40;
        const handX = shoulderX + Math.cos(armAngle) * 30; const handY = shoulderY + Math.sin(armAngle) * 30;

        ctx.beginPath(); ctx.moveTo(shoulderX, shoulderY); ctx.lineTo(handX, handY); ctx.stroke();

        // Rod
        const rodTipX = handX + Math.cos(rodAngle) * 100; const rodTipY = handY + Math.sin(rodAngle) * 100;
        ctx.strokeStyle = '#555'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(rodTipX, rodTipY); ctx.stroke();

        if (t > 80) {
            ctx.strokeStyle = (equippedSkin === 'ufo') ? '#00ff00' : 'white'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(rodTipX, rodTipY);
            const lineEndY = Math.min(GAME_HEIGHT, rodTipY + (t - 80) * 25);
            const lineEndX = rodTipX + (t - 80) * 15;
            ctx.quadraticCurveTo(rodTipX + 50, rodTipY - 50, lineEndX, lineEndY); ctx.stroke();
            // Sound/Text
            if (equippedSkin === 'toilet' && t === 81) { /* flush sound logic? */ }
            ctx.fillStyle = 'red'; ctx.font = 'bold 60px monospace'; ctx.fillText("YEET!", 50, 200);
            if (lineEndY >= CY) { ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(lineEndX, CY, (t - 80), 0, Math.PI); ctx.fill(); }
        }

        ctx.restore();
        ctx.restore();
    };

    const drawBattle = (ctx, state) => {
        // CYBER-GLOW BATTLE INTERFACE
        const trackX = GAME_WIDTH / 2 - 30;
        const trackY = 50;
        const trackW = 60;

        ctx.save();

        // 1. Track Background (Glassy)
        ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.roundRect(trackX, trackY, trackW, BAR_AREA_HEIGHT, 10);
        ctx.fill();
        ctx.stroke();

        // Big Bar Upgrade Logic
        const effectiveBarHeight = inventory.includes('bigbar') ? BAR_HEIGHT * 1.2 : BAR_HEIGHT;
        const barY = (trackY + BAR_AREA_HEIGHT) - state.barPos - effectiveBarHeight;

        // 2. The "Safe Zone" Bar (Gradient + Glow)
        const overlap = (state.barPos < state.fishPos + 40 && state.barPos + effectiveBarHeight > state.fishPos);

        const barGrad = ctx.createLinearGradient(trackX, barY, trackX + trackW, barY);
        barGrad.addColorStop(0, overlap ? '#00ff00' : '#888800');
        barGrad.addColorStop(1, overlap ? '#ccffcc' : '#ffff00');

        ctx.shadowColor = overlap ? '#00ff00' : 'orange';
        ctx.shadowBlur = overlap ? 20 : 5;
        ctx.fillStyle = barGrad;

        ctx.beginPath();
        ctx.roundRect(trackX + 4, barY, trackW - 8, effectiveBarHeight, 5);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset

        // 3. The Fish Icon (Bobbing)
        const fishY = (trackY + BAR_AREA_HEIGHT) - state.fishPos - 40;

        // Use Sprite if available!
        const f = state.battleFish;
        const spriteCfg = FISH_SPRITES[f.type.id];
        const sheet = spriteCfg ? spritesRef.current[spriteCfg.sheet] : null;

        if (sheet && sheet.complete) {
            const cols = spriteCfg.grid[0];
            const rows = spriteCfg.grid[1];
            const sw = sheet.width / cols;
            const sh = sheet.height / rows;
            const sx = ((spriteCfg.index % cols) * sw) + (sw * 0.15); // Safe crop
            const sy = (Math.floor(spriteCfg.index / cols) * sh) + (sh * 0.15);
            ctx.drawImage(sheet, sx, sy, sw * 0.7, sh * 0.7, trackX + 10, fishY + 10, 40, 40);
        } else {
            ctx.font = '30px serif';
            ctx.fillText(f.emoji, trackX + 15, fishY + 35);
        }

        // 4. Progress Bar (Side)
        const h = (state.catchPercent / 100) * BAR_AREA_HEIGHT;

        // Container
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(trackX + trackW + 10, trackY, 15, BAR_AREA_HEIGHT);

        // Fill
        const progGrad = ctx.createLinearGradient(0, trackY + BAR_AREA_HEIGHT, 0, trackY);
        progGrad.addColorStop(0, 'red');
        progGrad.addColorStop(0.5, 'yellow');
        progGrad.addColorStop(1, '#00ff00');

        ctx.fillStyle = progGrad;
        ctx.fillRect(trackX + trackW + 12, (trackY + BAR_AREA_HEIGHT) - h, 11, h);

        // Text Feedback
        if (overlap) {
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 24px "Orbitron", monospace';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
            ctx.fillText("REELING!", GAME_WIDTH / 2 - 60, 40);
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    };

    const drawShowcase = (ctx, state) => {
        // Draw Water
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Sky
        ctx.fillStyle = '#006994'; ctx.fillRect(0, GAME_HEIGHT - 100, GAME_WIDTH, 100);

        const CX = GAME_WIDTH / 2;
        const CY = GAME_HEIGHT - 100;

        // Draw Boat (Skin Logic)
        ctx.font = '100px serif';
        switch (skinRef.current) {
            case 'duck': ctx.fillText('🦆', CX - 50, CY + 30); break;
            case 'ufo': ctx.fillText('🛸', CX - 50, CY + 30); break;
            case 'pirate': ctx.fillText('🏴‍☠️', CX - 50, CY + 10); ctx.fillStyle = '#5C4033'; ctx.fillRect(CX - 70, CY + 10, 140, 40); break;
            case 'banana': ctx.fillText('🍌', CX - 50, CY + 10); break;
            case 'viking': ctx.fillText('🛶', CX - 50, CY + 10); ctx.font = '40px serif'; ctx.fillText('🛡️', CX - 30, CY + 30); ctx.fillText('🛡️', CX + 30, CY + 30); break;
            case 'box': ctx.fillText('📦', CX - 50, CY + 20); break;
            case 'trash': ctx.fillText('🗑️', CX - 50, CY + 20); break;
            case 'toilet': ctx.fillText('🚽', CX - 50, CY + 20); break;
            case 'tub': ctx.fillText('🛁', CX - 50, CY + 20); break;
            case 'chair': ctx.fillText('💺', CX - 50, CY + 20); break;
            case 'pizza_raft': ctx.font = '120px serif'; ctx.fillText('🍕', CX - 60, CY + 40); break;
            case 'carpet': ctx.font = '120px serif'; ctx.fillText('🧞', CX - 60, CY + 40);
                ctx.fillStyle = 'purple'; ctx.fillRect(CX - 60, CY, 120, 10); break;
            case 'cloud': ctx.fillText('☁️', CX - 50, CY + 20); break;
            case 'invisible': break;
            case 'balloon':
                ctx.strokeStyle = 'white'; ctx.beginPath(); ctx.moveTo(CX, CY - 30); ctx.lineTo(CX, CY - 150); ctx.stroke();
                ctx.font = '80px serif'; ctx.fillText('🎈', CX - 25, CY - 150);
                break;
            default:
                ctx.fillStyle = '#8B4513';
                ctx.beginPath(); ctx.moveTo(CX - 100, CY - 20); ctx.lineTo(CX + 100, CY - 20); ctx.lineTo(CX + 70, CY + 30); ctx.lineTo(CX - 70, CY + 30); ctx.fill();
        }

        // Character Logic
        let charY = CY - 30;
        if (skinRef.current === 'balloon') charY = CY - 50;
        if (skinRef.current === 'chair' || skinRef.current === 'toilet') charY = CY - 10;

        const charX = CX;
        ctx.strokeStyle = 'black'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(charX, charY); ctx.lineTo(charX, charY - 50); // Body

        // Legs
        if (skinRef.current === 'balloon') {
            ctx.moveTo(charX, charY); ctx.lineTo(charX - 10, charY + 20);
            ctx.moveTo(charX, charY); ctx.lineTo(charX + 10, charY + 20);
        } else if (skinRef.current === 'chair' || skinRef.current === 'toilet') {
            ctx.moveTo(charX, charY); ctx.lineTo(charX + 20, charY); ctx.lineTo(charX + 20, charY + 20);
        } else {
            ctx.moveTo(charX - 20, charY + 10); ctx.lineTo(charX, charY); ctx.lineTo(charX + 20, charY + 10);
        }

        // Arms V shape (Victory!)
        ctx.moveTo(charX, charY - 40); ctx.lineTo(charX - 25, charY - 80);
        ctx.moveTo(charX, charY - 40); ctx.lineTo(charX + 25, charY - 80);
        ctx.stroke();

        // Head
        if (logoImgRef.current && logoImgRef.current.complete) ctx.drawImage(logoImgRef.current, charX - 25, charY - 110, 50, 50);
        else { ctx.beginPath(); ctx.arc(charX, charY - 80, 20, 0, Math.PI * 2); ctx.stroke(); }

        // THE CATCH (Floating High)
        const fishY = charY - 120 - (Math.sin(state.castTimer / 10) * 10); // Higher up
        const f = state.battleFish || caughtFish;

        // SPRITE SHOWCASE
        const spriteCfg = f ? FISH_SPRITES[f.type.id] : null;
        const sheet = spriteCfg ? spritesRef.current[spriteCfg.sheet] : null;

        if (sheet && sheet.complete) {
            const cols = spriteCfg.grid[0]; // ... redundant calc but robust
            const rows = spriteCfg.grid[1];
            const sw = sheet.width / cols;
            const sh = sheet.height / rows;
            const sx = ((spriteCfg.index % cols) * sw) + (sw * 0.15);
            const sy = (Math.floor(spriteCfg.index / rows) * sh) + (sh * 0.15); // Note: index/rows? No index/cols usually.
            // Logic check: sx is index % cols. sy is index / cols. 
            const properSy = (Math.floor(spriteCfg.index / cols) * sh) + (sh * 0.15);

            const sSize = 150;
            ctx.drawImage(sheet, sx, properSy, sw * 0.7, sh * 0.7, charX - 75, fishY - 75, sSize, sSize);
        } else if (f) {
            ctx.font = '80px serif';
            ctx.textAlign = 'center';
            ctx.fillText(f.emoji, charX, fishY);
            ctx.textAlign = 'start';
        }
        ctx.textAlign = 'start';

        // GOD RAYS / GLOW
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const alpha = Math.abs(Math.sin(state.castTimer / 5));
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
        ctx.beginPath(); ctx.arc(charX, fishY - 30, 120, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Particles
        state.particles.forEach(p => {
            ctx.fillStyle = p.color || `rgba(255,255,255,${p.life})`;
            ctx.font = p.size ? `${p.size}px serif` : '20px serif';
            ctx.fillText(p.char, p.x, p.y);
        });
    };

    // --- ACTIONS ---
    const startCast = () => {
        if (gameStateRef.current === 'CASTING') return; // Prevent double-trigger
        gameStateRef.current = 'CASTING'; setGameState('CASTING'); stateRef.current.castTimer = 0; playBeep();
    };
    const startDrop = () => { gameStateRef.current = 'DROPPING'; setGameState('DROPPING'); stateRef.current.depth = 0; stateRef.current.fish = []; stateRef.current.particles = []; stateRef.current.bossSpawned = false; playJump(); };
    const startBattle = (fish) => {
        if (!fish) return;

        // Instant Catch (Chests)
        if (fish.instant) {
            setCaughtFish(fish);
            stateRef.current.battleFish = fish;

            // GOD CHEST RNG
            if (fish.god) {
                const rngScore = Math.floor(Math.random() * (420 - 69 + 1)) + 69;
                fish.score = rngScore;
                fish.name = `ANCIENT LOOT: ${rngScore}`;
            }

            catchSuccess();
            return;
        }

        gameStateRef.current = 'BATTLE'; setGameState('BATTLE'); setCaughtFish(fish);
        stateRef.current.battleFish = fish; stateRef.current.barPos = 0; stateRef.current.catchPercent = 25;
        if (navigator.vibrate) navigator.vibrate(200); // Heavy buzz

        // HITSTOP (IMPACT)
        stateRef.current.shake = 10;
        // Optional: play "Hit" sound
        playBeep(); // Replace with impact sound if available
    };
    const startReelUp = () => {
        gameStateRef.current = 'REELING_UP'; // No state set needed for visual-only modes usually, but consistency helps
        playCollect(); // Reel sound
    };
    const startShowcase = () => {
        gameStateRef.current = 'SHOWCASE_CATCH';
        setGameState('SHOWCASE_CATCH');
        stateRef.current.castTimer = 0;
        stateRef.current.particles = [];
        playWin();
    };
    const catchSuccess = () => {
        gameStateRef.current = 'CATCH_SCREEN';
        setGameState('CATCH_SCREEN');
        playWin();
        triggerConfetti();

        const fish = stateRef.current.battleFish;

        // WEIGHT LOGIC
        const minW = fish.weight ? fish.weight[0] : 1.0;
        const maxW = fish.weight ? fish.weight[1] : 5.0;
        const weight = parseFloat((Math.random() * (maxW - minW) + minW).toFixed(2));
        setMeasuredWeight(weight);

        // Save Record
        const records = JSON.parse(localStorage.getItem('fishingRecords')) || {};
        const oldBest = records[fish.id] || 0;
        if (weight > oldBest) {
            records[fish.id] = weight;
            localStorage.setItem('fishingRecords', JSON.stringify(records));
            setIsNewRecord(true);
            playWin(); // Double fanfare
        } else {
            setIsNewRecord(false);
        }

        // Golden Rod
        if (fish.legendary && !hasGoldenRod) {
            localStorage.setItem('goldenRod', 'true');
            setHasGoldenRod(true);
        }

        // Coins (Use Context for Multiplier!)
        const streakMult = 1 + (comboRef.current * 0.1);
        let baseScore = fish.score;
        if (baseScore > 75) {
            // "Grind" Update: Heavily tax high value fish
            baseScore = 75 + Math.floor((baseScore - 75) * 0.1);
        }
        const value = Math.floor(baseScore * streakMult);
        setCombo(c => c + 1);
        const newTotalScore = score + value;
        setScore(newTotalScore);

        // Use Context addCoins (Social + Multiplier)
        if (addCoins) addCoins(value);

        // --- GAMIFICATION INTEGRATION ---
        if (incrementStat) {
            incrementStat('fishCaught', 1);
            incrementStat('gamesPlayedCount', 1);
        }
        if (updateStat) {
            updateStat('gamesPlayed', 'fishing');
            updateStat('crazyFishingHighScore', newTotalScore); // Track High Score
        }

        const playerName = userProfile?.name || 'Player';
        if (fish.legendary && incrementStat) {
            incrementStat('legendariesCaught', 1);
            // Global Feed Event
            feedService.publish(`caught a LEGENDARY ${fish.name}!`, 'win', playerName);
        } else if (newTotalScore > 500 && Math.random() > 0.7) {
            // Random brag for high scores
            feedService.publish(`is on a fishing streak! Score: ${newTotalScore}`, 'win', playerName);
        }

        // Leaderboard sync handled by updateStat -> GamificationContext -> Cloud
    };

    // ... (loseBattle same as before)
    const loseBattle = () => {
        // Just return to IDLE with visual feedback needed?
        // Ideally we show "FISH ESCAPED" text.
        // For now, simpler reset to keep flow.
        gameStateRef.current = 'IDLE';
        setGameState('IDLE');
        setCaughtFish(null);
        setCombo(0);
        playCrash();

        // Add a particle effect for "Snap"
        const state = stateRef.current;
        for (let i = 0; i < 10; i++) {
            state.particles.push({
                x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2,
                dx: (Math.random() - 0.5) * 10, dy: (Math.random() - 0.5) * 10,
                life: 1.0, char: '💨', size: 30
            });
        }
        state.particles.push({
            x: GAME_WIDTH / 2 - 100, y: GAME_HEIGHT / 2,
            dx: 0, dy: -1, life: 2.0, char: 'ESCAPED!', color: 'red', size: 40
        });
    };

    // --- ABYSS ENGINE (LIGHTING) ---
    const drawLighting = (ctx, state) => {
        const depth = state.depth;

        // 1. DEPTH VIGNETTE
        // As depth increases, visible radius decreases
        if (depth > 300) {
            ctx.save();
            const radius = Math.max(300, 1000 - (depth * 0.3)); // Shrinks deep down
            // Dynamic Light Pos (follows hook in deep, or sun in shallow)
            const lx = depth > 900 ? state.hookX : GAME_WIDTH / 2;
            const ly = depth > 900 ? state.hookY : 0;

            const grad = ctx.createRadialGradient(lx, ly, radius * 0.2, lx, ly, radius);
            grad.addColorStop(0, 'rgba(0,0,0,0)'); // Transparent center
            grad.addColorStop(1, `rgba(0,0,10,${Math.min(0.95, depth / 3000)})`); // Dark edges

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            ctx.restore();
        }

        // 2. BIOLUMINESCENCE GLOW
        // For standard "Particle" glows or deep sea creatures
        if (depth > 600) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Draw hook light
            const hookGlow = ctx.createRadialGradient(state.hookX, state.hookY, 10, state.hookX, state.hookY, 150);
            hookGlow.addColorStop(0, 'rgba(200, 255, 255, 0.4)');
            hookGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = hookGlow;
            ctx.beginPath(); ctx.arc(state.hookX, state.hookY, 150, 0, Math.PI * 2); ctx.fill();

            // Glow for recent particles/fish that are "luminous"
            state.fish.forEach(f => {
                if (f.type.id === 'jelly' || f.type.id === 'angler' || f.type.id === 'cyber' || f.type.id === 'flash' || f.type.id === 'ember' || f.type.shiny) {
                    const g = ctx.createRadialGradient(f.x + 20, f.y + 20, 10, f.x + 20, f.y + 20, 80);
                    g.addColorStop(0, f.type.id === 'ember' ? 'rgba(255,100,0,0.4)' : 'rgba(0,255,255,0.3)');
                    g.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = g;
                    ctx.beginPath(); ctx.arc(f.x + 20, f.y + 20, 80, 0, Math.PI * 2); ctx.fill();
                }
            });

            ctx.restore();
        }
    };

    // Controls
    const handleKeyDown = (e) => { if (e.code === 'Space') isMouseDown.current = true; };
    const handleKeyUp = (e) => { if (e.code === 'Space') isMouseDown.current = false; };
    const handleInputStart = (e) => {
        if (e.type === 'touchstart') {
            e.preventDefault(); // Prevent default to avoid ghost clicks and scrolling
        }
        isMouseDown.current = true;

        if (gameStateRef.current === 'IDLE') {
            startCast();
        }
    };

    const handleInputEnd = () => {
        isMouseDown.current = false;
        if (gameStateRef.current === 'CASTING') {
            startDrop();
        }
    };

    const handleInputMove = (e) => {
        if (gameStateRef.current === 'DROPPING') {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Handle Touch or Mouse
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;

            stateRef.current.hookX = Math.max(20, Math.min(GAME_WIDTH - 20, x));
            stateRef.current.hookY = Math.max(50, Math.min(GAME_HEIGHT - 50, y)); // Unlocked Vertical
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Global release safety
        const handleGlobalUp = () => { isMouseDown.current = false; };
        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('touchend', handleGlobalUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, []);

    // OVERLAY HELPER COMPONENT
    // OVERLAY HELPER COMPONENT (V3 Styled)
    const Overlay = ({ title, onClose, children, color = 'var(--neon-blue)' }) => (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 5, 20, 0.90)',
            zIndex: 2000,
            display: 'flex', flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box',
            backdropFilter: 'blur(15px)',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '20px', borderBottom: `1px solid ${color}`, paddingBottom: '15px'
            }}>
                <h2 style={{ margin: 0, color: color, fontSize: '2rem', textShadow: `0 0 10px ${color}` }}>{title}</h2>
                <SquishyButton onClick={onClose} style={{ background: '#111', color: '#888', border: '1px solid #333', fontSize: '1.2rem', padding: '10px 20px' }}>❌</SquishyButton>
            </div>
            <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                {children}
            </div>
        </div>
    );

    // ROTATE OVERLAY
    // ROTATE OVERLAY
    if (isPortrait && window.innerWidth < 768) {
        return (
            <Overlay title="ROTATE PHONE" onClose={() => { }} color="orange">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱🔄</div>
                    <div>Please rotate your device specifically for this fishing trip!</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '20px' }}>
                        (Landscape Mode Required)
                    </div>
                </div>
            </Overlay>
        );
    }

    // RENDER UI
    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            style={{
                position: 'fixed', // Force fixed to cover header/nav
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999, // Ensure it's on top of everything
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #001133 0%, #006994 100%)',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                outline: 'none',
                overscrollBehavior: 'none'
            }}>
            {/* COMPACT HEADER - REMOVED, INTEGRATED INTO HUD */}
            {/* <div style={{ position: 'absolute', top: '10px', width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}> */}
            {/* </div> */}

            {/* OLD SCORE HUD - REMOVED */}

            {/* HOME BUTTON */}
            {/* HOME BUTTON */}
            <Link to="/arcade" style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 100 }}>
                <SquishyButton style={{ borderRadius: '50px', padding: '10px 20px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', textDecoration: 'none' }}>
                    🏠 EXIT
                </SquishyButton>
            </Link>

            {/* ABYSS ENGINE OVERLAY - Optional Flash */}
            {
                stateRef.current.shake > 2 && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'white', opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'overlay'
                    }} />
                )
            }

            {/* MAIN GAME CONTAINER - Centered */}
            <div style={{
                display: 'flex',
                flexDirection: 'row', // Side-by-side for landscape controls if needed, or overlay. Keeping column for now but centered.
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                position: 'relative'
            }}>

                {/* GAME CANVAS CONTAINER */}
                <div style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100vw', // Fill width
                    maxHeight: '90vh', // Fill height (leave small gap for header)
                    aspectRatio: '16/9', // Widescreen
                    border: hasGoldenRod ? '4px solid gold' : '4px solid white',
                    borderRadius: '20px',
                    backgroundColor: '#000',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    flexShrink: 0
                }}>
                    <canvas
                        ref={canvasRef}
                        width={GAME_WIDTH}
                        height={GAME_HEIGHT}
                        // Touch & Mouse Events
                        onMouseDown={handleInputStart}
                        onMouseUp={handleInputEnd}
                        onMouseLeave={handleInputEnd}
                        onMouseMove={handleInputMove}

                        onTouchStart={handleInputStart}
                        onTouchEnd={handleInputEnd}
                        onTouchMove={handleInputMove}

                        style={{
                            width: '100%',
                            height: '100%',
                            cursor: gameState === 'IDLE' ? 'pointer' : 'none',
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
                    />

                    {gameState === 'IDLE' && (
                        <div style={{ position: 'absolute', top: '30%', width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
                            <h2 style={{ color: 'white', textShadow: '2px 2px black', fontSize: '5vw' }}>TAP TO CAST</h2>
                        </div>
                    )}


                    {/* 2026 HUD OVERLAY */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50, pointerEvents: 'none' }}>
                        {/* DEPTH GAUGE */}
                        <div style={{ display: 'flex', alignItems: 'end', gap: '5px' }}>
                            <div style={{ fontSize: '3rem', fontFamily: '"Orbitron", sans-serif', fontWeight: 'bold', color: 'cyan', textShadow: '0 0 10px cyan' }}>
                                {Math.floor(stateRef.current.depth)}
                            </div>
                            <div style={{ fontSize: '1.5rem', color: '#aaa', paddingBottom: '10px' }}>m</div>
                        </div>
                        {/* CURRENT BIOME */}
                        <div style={{ fontSize: '1.2rem', color: 'white', letterSpacing: '2px', opacity: 0.8, marginTop: '-5px' }}>
                            {BIOMES.find(b => stateRef.current.depth <= b.maxDepth)?.name.toUpperCase() || 'UNKNOWN'}
                        </div>
                    </div>

                    {/* SCORE & COMBO HUD - TOP RIGHT */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right', pointerEvents: 'none', zIndex: 50 }}>
                        <div style={{ fontSize: '1.5rem', color: '#ffcc00', textShadow: '0 0 10px orange', fontFamily: '"Orbitron", monospace' }}>
                            💰 {coins}
                        </div>
                        {combo > 1 && (
                            <div style={{ fontSize: '1.2rem', color: '#ff0055', fontWeight: 'bold', textShadow: '0 0 10px red', animation: 'pulse 0.5s infinite' }}>
                                {combo}x STREAK
                            </div>
                        )}
                    </div>


                    {/* OVERLAYS */}
                    {gameState === 'FISHDEX' && (
                        <Overlay title="📘 FISHDEX" onClose={() => setGameState('IDLE')} color="cyan">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                {FISH_DATA.map(fish => {
                                    const records = JSON.parse(localStorage.getItem('fishingRecords')) || {};
                                    const best = records[fish.id];
                                    const unlocked = best !== undefined;
                                    return (
                                        <div key={fish.id} style={{
                                            border: unlocked ? (fish.legendary ? '2px solid gold' : '1px solid cyan') : '1px solid #333',
                                            background: unlocked ? '#111' : '#000',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            textAlign: 'center',
                                            opacity: unlocked ? 1 : 0.5,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ fontSize: '3rem' }}>{unlocked ? fish.emoji : '❓'}</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px', color: 'white' }}>{unlocked ? fish.name : '???'}</div>
                                            {unlocked && <div style={{ fontSize: '0.7rem', color: 'lime' }}>Max: {best}kg</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </Overlay>
                    )}

                    {gameState === 'SHOP' && (
                        <Overlay title="🛍️ SHOP" onClose={() => setGameState('IDLE')} color="gold">
                            <div style={{ textAlign: 'center', marginBottom: '20px', color: 'yellow', fontSize: '1.5rem' }}>
                                Wallet: {coins} 💰
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                {SHOP_ITEMS.map(item => {
                                    const owned = inventory.includes(item.id);
                                    const equipped = (equippedSkin === item.id) || (equippedBobber === item.id);
                                    return (
                                        <div key={item.id} onClick={() => buyItem(item)} style={{
                                            border: owned ? (equipped ? '2px solid lime' : '2px solid gray') : '2px solid white',
                                            padding: '15px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            background: owned ? '#222' : '#000',
                                            display: 'flex', alignItems: 'center', gap: '20px'
                                        }}>
                                            <div style={{ fontSize: '3rem' }}>{item.icon}</div>
                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{item.desc}</div>
                                            </div>
                                            <div>
                                                {owned ? (
                                                    <div style={{ color: equipped ? 'lime' : 'white', fontWeight: 'bold' }}>
                                                        {((item.type === 'skin' && equippedSkin === item.id) || (item.type === 'bobber' && equippedBobber === item.id)) ? 'EQUIPPED' : 'OWNED'}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.2rem' }}>{item.price} 💰</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Overlay>
                    )}

                    {gameState === 'CATCH_SCREEN' && caughtFish && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 120
                        }}>
                            <h2 style={{ color: 'var(--neon-gold)', fontSize: '3rem', margin: 0, fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 20px gold' }}>CAUGHT!</h2>
                            <div style={{ fontSize: '6rem', margin: '20px', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))' }}>{caughtFish.type === 'image' ? <img src={caughtFish.src} style={{ width: '120px' }} /> : caughtFish.emoji}</div>
                            <h3 style={{ color: 'white', fontSize: '2rem', margin: '5px', fontFamily: '"Orbitron", sans-serif' }}>{caughtFish.name}</h3>
                            <div style={{ color: isNewRecord ? 'var(--neon-green)' : '#ccc', fontSize: '1.2rem', fontFamily: 'monospace' }}>{measuredWeight}kg {isNewRecord && "🏆 NEW PB!"}</div>
                            <div style={{ margin: '20px', textAlign: 'center' }}>
                                <div style={{ color: 'var(--neon-gold)', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 10px orange' }}>
                                    +{Math.floor(caughtFish.score * (1 + (combo * 0.1)))} COINS
                                </div>
                            </div>
                            <SquishyButton onClick={startCast} style={{ marginTop: '20px', background: 'var(--neon-blue)', color: 'black', padding: '15px 40px', fontSize: '1.5rem', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 0 20px var(--neon-blue)' }}>🎣 CAST AGAIN</SquishyButton>
                            <SquishyButton onClick={() => setGameState('IDLE')} style={{ marginTop: '15px', background: 'transparent', border: '1px solid #555', color: '#888', padding: '10px 30px', borderRadius: '20px' }}>DOCK</SquishyButton>
                        </div>
                    )}
                    {/* ZONE NOTIFICATION */}
                    <div style={{
                        position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, 0)',
                        color: 'rgba(255,255,255,0.8)', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 0 5px cyan',
                        opacity: zoneNotification ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: 'none',
                        zIndex: 10, textAlign: 'center', fontFamily: '"Impact", sans-serif'
                    }}>
                        {zoneNotification && (
                            <>
                                <div style={{ fontSize: '1.2rem', color: '#aaf', letterSpacing: '5px' }}>ENTERING ZONE</div>
                                {zoneNotification.toUpperCase()}
                            </>
                        )}
                    </div>

                    {/* CONTROLS OVERLAY (Moved Inside) */}
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '20px', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <SquishyButton onClick={() => setGameState('FISHDEX')} style={{ background: '#006994', width: '60px', height: '60px', borderRadius: '50%', border: '4px solid cyan', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: '0 0 10px cyan' }}>
                            🤖
                        </SquishyButton>
                        <SquishyButton onClick={() => setGameState('SHOP')} style={{ background: 'orange', width: '60px', height: '60px', borderRadius: '50%', border: '4px solid gold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: '0 0 10px gold' }}>
                            🛍️
                        </SquishyButton>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '10px', textAlign: 'center', color: '#ccc', fontSize: '0.8rem' }}>
                <p>Tap & Hold to Cast/Reel • Drag to Move Hook</p>
            </div>

            <Link to="/arcade" style={{ marginTop: '20px', color: 'white', textDecoration: 'underline', fontSize: '1rem' }}>Exit Dock</Link>
        </div >
    );
};

export default CrazyFishing;
