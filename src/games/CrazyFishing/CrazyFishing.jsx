import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
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
    const { shopState } = useGamification() || {};

    useEffect(() => {
        const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- STATE ---
    // --- STATE ---
    const [gameState, setGameState] = useState('IDLE');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [caughtFish, setCaughtFish] = useState(null);
    const [measuredWeight, setMeasuredWeight] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);

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
        bossSpawned: false
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
            p.life -= 0.02; // Slower fade for bubbles
        });
        state.particles = state.particles.filter(p => p.life > 0 && p.y > -100);

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
            // Start Drop
            state.depth += 0.8;
            if (state.depth > MAX_DEPTH) state.depth = MAX_DEPTH;

            const currentBiome = BIOMES.find(b => state.depth <= b.maxDepth) || BIOMES[0];

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

                        state.fish.push({
                            x: Math.random() * (GAME_WIDTH - 40),
                            y: GAME_HEIGHT + 50,
                            type, id: Math.random(), dir: Math.random() > 0.5 ? 1 : -1
                        });
                    }
                }
            }

            // Move Fish
            state.fish.forEach(f => {
                if (mode === 'REELING_UP') {
                    f.y += 15; // Zoom down during ascent
                } else {
                    f.y -= 3; // Parallax up during descent
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
            state.depth -= 15; // Faster ascent

            // Spawn Passing Fish (Visual only)
            if (Math.random() > 0.7) {
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
            return;
        }

        // 3. SHOWCASE ANIMATION
        if (mode === 'SHOWCASE_CATCH') {
            drawShowcase(ctx, state);
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
            ctx.fillStyle = p.color || `rgba(255,255,255,${p.life})`;
            ctx.font = p.size ? `${p.size}px serif` : '20px serif';
            ctx.fillText(p.char, p.x, p.y);
        });

        // FISH DROPPING (WITH HATS)
        if (mode === 'DROPPING') {
            ctx.font = '30px serif';
            state.fish.forEach(f => {
                // Shiny Glow
                if (f.type.shiny) { ctx.shadowColor = 'gold'; ctx.shadowBlur = 10; }

                ctx.fillText(f.type.emoji, f.x, f.y);
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

        // HUD
        ctx.fillStyle = 'white'; ctx.font = '16px monospace';
        if (mode !== 'CASTING') ctx.fillText(`DEPTH: ${Math.floor(state.depth)}m`, 10, 20);
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
    };

    const drawBattle = (ctx, state) => {
        const trackX = GAME_WIDTH / 2 - 25; const trackY = 50;
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(trackX, trackY, 50, BAR_AREA_HEIGHT);
        ctx.strokeStyle = 'white'; ctx.strokeRect(trackX, trackY, 50, BAR_AREA_HEIGHT);

        // Big Bar Upgrade
        const effectiveBarHeight = inventory.includes('bigbar') ? BAR_HEIGHT * 1.2 : BAR_HEIGHT;

        const barY = (trackY + BAR_AREA_HEIGHT) - state.barPos - effectiveBarHeight;
        const fishY = (trackY + BAR_AREA_HEIGHT) - state.fishPos - 40;

        const overlap = (state.barPos < state.fishPos + 40 && state.barPos + effectiveBarHeight > state.fishPos);

        ctx.fillStyle = overlap ? '#00ff00' : 'rgba(0,255,0,0.4)';
        ctx.fillRect(trackX + 2, barY, 46, effectiveBarHeight);

        ctx.font = '30px serif';
        if (state.battleFish.type === 'image') ctx.fillText('🧜‍♂️', trackX + 10, fishY + 30);
        else ctx.fillText(state.battleFish.emoji, trackX + 10, fishY + 30);

        // Progress
        const h = (state.catchPercent / 100) * BAR_AREA_HEIGHT;
        if (overlap) { ctx.fillStyle = '#00ff00'; ctx.font = 'bold 24px monospace'; ctx.fillText("REELING!", GAME_WIDTH / 2 - 40, 40); }
        ctx.fillStyle = overlap ? 'cyan' : 'gold';
        ctx.fillRect(trackX + 60, (trackY + BAR_AREA_HEIGHT) - h, 20, h);
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
        ctx.font = '80px serif';
        ctx.textAlign = 'center';
        if (f && f.type === 'image') ctx.fillText('🧜‍♂️', charX, fishY);
        else if (f) ctx.fillText(f.emoji, charX, fishY);
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
        playBeep();
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

        // Coins
        const streakMult = 1 + (comboRef.current * 0.1);
        let baseScore = fish.score;
        if (baseScore > 75) {
            // "Grind" Update: Heavily tax high value fish
            baseScore = 75 + Math.floor((baseScore - 75) * 0.1);
        }
        const value = Math.floor(baseScore * streakMult);
        setCombo(c => c + 1);
        setScore(s => s + value);
        const coins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', coins + value);

        // --- GAMIFICATION INTEGRATION ---
        incrementStat('fishCaught', 1);
        incrementStat('gamesPlayedCount', 1); // Track total count
        updateStat('gamesPlayed', 'fishing'); // Add to unique list

        if (fish.legendary) {
            incrementStat('legendariesCaught', 1);
        }

        // Submit Score to Global Leaderboard (Total Score Accumulation)
        LeaderboardService.submitScore('crazy_fishing', 'Player1', score + value);
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
            let clientX;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const x = (clientX - rect.left) * scaleX;
            stateRef.current.hookX = Math.max(20, Math.min(GAME_WIDTH - 20, x));
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
    if (isPortrait && window.innerWidth < 768) { // Only force on mobile
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: '#001133', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, textAlign: 'center', padding: '20px'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔄</div>
                <h1>Please Rotate Your Phone</h1>
                <p>Designed for Landscape Mode</p>
            </div>
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
            {/* COMPACT HEADER */}
            <div style={{ position: 'absolute', top: '10px', width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
                <h1 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '1.8rem', margin: 0, textShadow: '0 0 10px rgba(0,0,0,0.8)', color: hasGoldenRod ? 'var(--neon-gold)' : 'white' }}>
                    {hasGoldenRod ? '✨ GOLDEN FISHING ✨' : 'DEEP DIVE FISHING'}
                </h1>
            </div>

            <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.2rem', color: 'white', fontWeight: 'bold', zIndex: 10, fontFamily: '"Orbitron", monospace', display: 'flex', gap: '20px' }}>
                <span style={{ color: 'var(--neon-gold)', textShadow: '0 0 5px orange' }}>💰 {coins}</span>
                <span style={{ color: 'var(--neon-pink)', textShadow: '0 0 5px red' }}>🔥 {combo}</span>
            </div>

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
        </div>
    );
};

export default CrazyFishing;
