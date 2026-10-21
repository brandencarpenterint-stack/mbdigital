/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LiveFeed from '../components/LiveFeed';
import LeaderboardTable from '../components/LeaderboardTable';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import PocketPet from '../components/pocket-pet/PocketPet';
import useRetroSound from '../hooks/useRetroSound';
import { supabase } from '../lib/supabaseClient';
import './Home.css';
import ArcadeCabinet from '../components/ArcadeCabinet';
import CinematicGameCard from '../components/CinematicGameCard';
import SponsorStationModal from '../components/SponsorStationModal';
import { useToast } from '../context/ToastContext';

const OnlinePlaza = () => {
    const { userProfile, xp } = useGamification() || {};
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOnline = async () => {
            let users = [];
            if (supabase) {
                const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
                const { data } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url, coins, last_seen')
                    .gt('last_seen', fifteenMinsAgo)
                    .order('last_seen', { ascending: false })
                    .limit(20);

                if (data) {
                    users = data.map(u => ({
                        ...u,
                        level: Math.floor(Math.sqrt((u.coins || 0) / 250)) || 1
                    }));
                }
            }

            if (userProfile && userProfile.name) {
                const isMe = users.find(u => u.display_name === userProfile.name);
                if (!isMe) {
                    users.unshift({
                        display_name: userProfile.name,
                        avatar_url: userProfile.avatar_url,
                        level: Math.floor(Math.sqrt((xp || 0) / 250)) || 1
                    });
                }
            }

            setOnlineUsers(users);
            setLoading(false);
        };

        fetchOnline();
        const interval = setInterval(fetchOnline, 30000);
        return () => clearInterval(interval);
    }, [userProfile, xp]);

    if (loading) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--neon-green)', fontFamily: '"Orbitron", sans-serif', fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }}></span>
                ONLINE PLAZA ({onlineUsers.length} BROS DETECTED)
            </h3>

            <div style={{
                display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px',
                scrollbarWidth: 'thin', scrollbarColor: '#333 transparent'
            }}>
                {onlineUsers.length === 0 && (
                    <div style={{ color: '#666', fontStyle: 'italic', fontSize: '0.8rem' }}>No other signals detected...</div>
                )}
                {onlineUsers.map((user, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -3 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        style={{
                            minWidth: '90px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            padding: '8px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #00ffcc', marginBottom: '5px' }}>
                            <img src={user.avatar_url || '/assets/skins/face_default.png'} alt={user.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.display_name}
                        </span>
                        <span style={{ color: '#ffd700', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                            LVL {user.level}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const CATEGORIES = [
    { id: 'all', label: '🌟 ALL GAMES', count: 26 },
    { id: 'casino', label: '🎰 CYBER CASINO', count: 9 },
    { id: 'action', label: '⚡ ACTION & SKILL', count: 9 },
    { id: 'retro', label: '👾 RETRO CLASSICS', count: 8 }
];

const games = [
    // CASINO & HIGH-ROLLER
    {
        id: 'crash',
        title: 'CYBER CRASH',
        category: 'casino',
        desc: 'Rocket Multipliers & 100x Auto-Cashouts',
        gradient: 'linear-gradient(135deg, #ff0055 0%, #ffd700 100%)',
        icon: <img src='/assets/skins/face_dino.png' alt='Crash' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #ff0055)'}} />,
        colSpan: 2,
        path: '/arcade/crash',
        leaderboardId: 'cyber_crash'
    },
    {
        id: 'mines',
        title: 'CYBER MINES 2088',
        category: 'casino',
        desc: '5x5 Grid, Scout Drones & Exponential Gems',
        gradient: 'linear-gradient(135deg, #00ff66 0%, #ffd700 100%)',
        icon: <img src='/assets/skins/face_bunny.png' alt='Mines' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00ff66)'}} />,
        colSpan: 2,
        path: '/arcade/mines',
        leaderboardId: 'cyber_mines'
    },
    {
        id: 'hilo',
        title: 'CYBER HI-LO 2088',
        category: 'casino',
        desc: 'Card Streak Guessing, Up to 180x Multipliers',
        gradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        icon: <img src='/assets/skins/face_bunny.png' alt='Hi-Lo' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00ff66)'}} />,
        colSpan: 2,
        path: '/arcade/hilo',
        leaderboardId: 'cyber_hilo'
    },
    {
        id: 'scratchers',
        title: 'CYBER SCRATCHERS',
        category: 'casino',
        desc: 'Silver Foil Instant Lottery, 100k CP Jackpots',
        gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
        icon: <img src='/assets/skins/face_money.png' alt='Scratchers' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #ffd700)'}} />,
        colSpan: 2,
        path: '/arcade/scratchers',
        leaderboardId: 'cyber_scratchers'
    },
    {
        id: 'roulette',
        title: 'CYBER ROULETTE',
        category: 'casino',
        desc: 'Single-Zero European Wheel & 35:1 Payouts',
        gradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        icon: <img src='/assets/skins/face_money.png' alt='Roulette' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00ff66)'}} />,
        colSpan: 2,
        path: '/arcade/roulette',
        leaderboardId: 'cyber_roulette'
    },
    {
        id: 'blackjack',
        title: 'CYBER 21 BLACKJACK',
        category: 'casino',
        desc: '3:2 Payouts, Card Counting HUD & High Stakes',
        gradient: 'linear-gradient(135deg, #0d2818 0%, #00ff66 100%)',
        icon: <img src='/assets/skins/face_money.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00ff66)'}} />,
        colSpan: 2,
        path: '/arcade/blackjack',
        leaderboardId: 'cyber_21'
    },
    {
        id: 'derby',
        title: 'CYBER DERBY',
        category: 'casino',
        desc: '8-Bro Cyber Velodrome Racing & Exacta Bets',
        gradient: 'linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)',
        icon: <img src='/assets/skins/face_dino.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00ff66)'}} />,
        colSpan: 2,
        path: '/arcade/derby',
        leaderboardId: 'cyber_derby'
    },
    {
        id: 'slots',
        title: 'COSMIC SLOTS',
        category: 'casino',
        desc: '3-Reel Crypto Tumbler & Vault Jackpots',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        icon: <img src='/assets/skins/face_money.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px gold)'}} />,
        colSpan: 2,
        leaderboardId: 'cosmic_slots'
    },
    {
        id: 'underworld',
        title: 'THE UNDERWORLD',
        category: 'casino',
        desc: 'High-Stakes Peer-to-Peer Wagers',
        gradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
        icon: <img src='/assets/skins/face_hoodie.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #4e4376)'}} />,
        colSpan: 2,
        path: '/underworld'
    },

    // ACTION & SKILL
    {
        id: 'dozer',
        title: 'CYBER COIN DOZER',
        category: 'action',
        desc: 'Mechanical Neon Pusher, Figurines & Quakes',
        gradient: 'linear-gradient(135deg, #00e5ff 0%, #ff007f 100%)',
        icon: <img src='/assets/skins/face_star.png' alt='Coin Dozer' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00e5ff)'}} />,
        colSpan: 2,
        path: '/arcade/dozer',
        leaderboardId: 'cyber_dozer'
    },
    {
        id: 'pinball',
        title: 'CYBER PINBALL 2088',
        category: 'action',
        desc: 'Bumper Chaos, B-R-O Drop Targets & Multiball',
        gradient: 'linear-gradient(135deg, #ff007f 0%, #00e5ff 100%)',
        icon: <img src='/assets/skins/face_star.png' alt='Pinball' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00e5ff)'}} />,
        colSpan: 2,
        path: '/arcade/pinball',
        leaderboardId: 'cyber_pinball'
    },
    {
        id: 'plinko',
        title: 'CYBER PLINKO',
        category: 'action',
        desc: 'Pegged Gravity 100x High-Multiplier Drops',
        gradient: 'linear-gradient(135deg, #f107a3 0%, #7b2ff7 100%)',
        icon: <img src='/assets/skins/face_star.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #f107a3)'}} />,
        colSpan: 2,
        path: '/arcade/plinko',
        leaderboardId: 'cyber_plinko'
    },
    {
        id: 'drift',
        title: 'NEON DRIFT: 2088',
        category: 'action',
        desc: 'Pseudo-3D Synthwave Supercar Racer',
        gradient: 'linear-gradient(135deg, #ff007f 0%, #00ffcc 100%)',
        icon: <img src='/assets/skins/face_gamer.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #ff007f)'}} />,
        colSpan: 2,
        path: '/arcade/drift',
        leaderboardId: 'neon_drift'
    },
    {
        id: 'merch-defense',
        title: 'MERCH DEFENSE',
        category: 'action',
        desc: 'Branded Cyber Tower Defense',
        gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
        icon: <img src='/assets/skins/face_astro.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #00c6ff)'}} />,
        colSpan: 2,
        leaderboardId: 'merch_defense'
    },
    {
        id: 'galaxy',
        title: 'GALAXY DEFENDER',
        category: 'action',
        desc: 'Retro Space Shooter & Boss Battles',
        gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        icon: <img src='/assets/skins/face_space.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #8E2DE2)'}} />,
        colSpan: 1,
        leaderboardId: 'galaxy_defender'
    },
    {
        id: 'face-runner',
        title: 'FACE WARP',
        category: 'action',
        desc: 'High-Speed 3D Tunnel Chaos',
        gradient: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
        icon: <img src='/assets/skins/face_rainbow.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px cyan)'}} />,
        colSpan: 2,
        leaderboardId: 'face_runner'
    },
    {
        id: 'bro-cannon',
        title: 'BRO CANNON',
        category: 'action',
        desc: 'Trajectory Launch Physics & Air Bounces',
        gradient: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        icon: <img src='/assets/avatar_ghost.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #FF512F)'}} />,
        colSpan: 1,
        leaderboardId: 'bro_cannon'
    },
    {
        id: 'arena',
        title: 'THE ARENA',
        category: 'action',
        desc: 'Turn-Based RPG Squad Battles',
        gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
        icon: <img src='/assets/skins/face_gamer.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #ff0844)'}} />,
        colSpan: 2,
        path: '/arena'
    },

    // RETRO CLASSICS
    {
        id: 'brick',
        title: 'NEON BRICKS',
        category: 'retro',
        desc: 'Breakout Pixel Destruction',
        gradient: 'linear-gradient(135deg, #da22ff 0%, #9733ee 100%)',
        icon: <img src='/assets/skins/face_gamer.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #da22ff)'}} />,
        colSpan: 1,
        leaderboardId: 'neon_bricks'
    },
    {
        id: 'snake',
        title: 'NEON SNAKE',
        category: 'retro',
        desc: 'Retro Grid Slither',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        icon: <img src='/assets/skins/face_dino.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #38ef7d)'}} />,
        colSpan: 1,
        leaderboardId: 'neon_snake'
    },
    {
        id: 'flappy',
        title: 'FLAPPY BRO',
        category: 'retro',
        desc: 'Physics Pipe Dodging',
        gradient: 'linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)',
        icon: <img src='/assets/skins/face_default.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #22C1C3)'}} />,
        colSpan: 1,
        leaderboardId: 'flappy_mascot'
    },
    {
        id: 'unboxing',
        title: 'HYPE DROP',
        category: 'retro',
        desc: 'Mystery Crates & Rare Skins',
        gradient: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)',
        icon: <img src='/assets/skins/face_star.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #ff007f)'}} />,
        colSpan: 2,
        leaderboardId: 'hype_drop'
    },
    {
        id: 'wheel',
        title: 'CYBER WHEEL',
        category: 'retro',
        desc: '10,000 CP Daily Free Spin',
        gradient: 'linear-gradient(135deg, #ffd700 0%, #ff007f 100%)',
        icon: <img src='/assets/skins/face_money.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px gold)'}} />,
        colSpan: 2,
        path: '/arcade/wheel',
        leaderboardId: 'cyber_wheel'
    },
    {
        id: 'merch-jump',
        title: 'MERCH JUMP',
        category: 'retro',
        desc: 'Endless Platform Jumping',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        icon: <img src='/assets/skins/face_bear.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #66a6ff)'}} />,
        colSpan: 1,
        leaderboardId: 'merch_jump'
    },
    {
        id: 'fishing',
        title: 'CRAZY FISHING',
        category: 'retro',
        desc: 'Reel in Rare Cyber Leviathans',
        gradient: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
        icon: <img src='/assets/merchboy_cat.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #0072FF)'}} />,
        colSpan: 1,
        leaderboardId: 'crazy_fishing'
    },
    {
        id: 'whack',
        title: 'WHACK-A-MOLE',
        category: 'retro',
        desc: 'Fast Reflex Mascot Bonking',
        gradient: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
        icon: <img src='/assets/mole_normal.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #FF416C)'}} />,
        colSpan: 1,
        leaderboardId: 'whack_a_mole'
    },
    {
        id: 'memory',
        title: 'MEMORY MATCH',
        category: 'retro',
        desc: 'Cyber Deck Pattern Recall',
        gradient: 'linear-gradient(135deg, #f79d00 0%, #64f38c 100%)',
        icon: <img src='/assets/skins/face_cat.png' style={{height:'60px', objectFit:'contain', filter: 'drop-shadow(0 0 10px #64f38c)'}} />,
        colSpan: 1,
        leaderboardId: 'memory_match'
    }
];

const getHighScore = (id, stats) => {
    if (!stats) return 0;
    if (id === 'snake') return stats.snakeHighScore || 0;
    if (id === 'whack') return stats.whackHighScore || 0;
    if (id === 'memory') return stats.memoryHighScore || 0;
    if (id === 'galaxy') return stats.galaxyHighScore || 0;
    if (id === 'brick') return stats.brickHighScore || 0;
    if (id === 'flappy') return stats.flappyHighScore || 0;
    if (id === 'fishing') return stats.crazyFishingHighScore || 0;
    if (id === 'drift') return stats?.neonDriftHighScore ? `${stats.neonDriftHighScore.toLocaleString()} PTS` : 'READY';
    if (id === 'crash') return stats?.crashHighScore ? `${stats.crashHighScore}x` : '100x';
    if (id === 'mines') return stats?.minesHighScore ? `${stats.minesHighScore}x` : 'EXP';
    if (id === 'scratchers') return stats?.scratchersHighScore ? `${stats.scratchersHighScore.toLocaleString()} CP` : '100k';
    if (id === 'dozer') return stats?.dozerHighScore ? `${stats.dozerHighScore.toLocaleString()} CP` : 'READY';
    if (id === 'hilo') return stats?.hiloHighScore ? `${stats.hiloHighScore.toLocaleString()} CP` : '180x';
    if (id === 'pinball') return stats?.pinballHighScore ? `${stats.pinballHighScore.toLocaleString()} PTS` : 'READY';
    if (id === 'face-runner') return stats.faceRunnerHighScore || 0;
    if (id === 'slots') return 'JACKPOT';
    if (id === 'wheel') return stats?.wheelHighScore ? `${stats.wheelHighScore.toLocaleString()} CP` : 'FREE SPIN';
    if (id === 'merch-jump') return stats.merchJumpHighScore || 0;
    if (id === 'bro-cannon') return stats.broCannonHighScore || 0;
    if (id === 'merch-defense') return stats.merchDefenseHighScore ? `WAVE ${stats.merchDefenseHighScore}` : 'READY';
    return 0;
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } }
};

const ArcadeHub = () => {
    const { stats, shopState, userProfile, zoneControl } = useGamification() || {};
    const { stats: broStats, getMood } = usePocketBro() || {};
    const { playBoop } = useRetroSound();

    const equippedSkin = shopState?.equipped?.pocketbro || null;
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard', 'feed', 'plaza', 'pocketbro'
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('crazy_fishing');
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const [loot, setLoot] = useState(null);
    const { setShopState } = useGamification() || {};
    const { showToast } = useToast();

    const handleCollectLoot = () => {
        if (!loot) return;
        playBoop();
        setShopState(prev => ({ ...prev, unlocked: [...prev.unlocked, loot.id] }));
        showToast(`FOUND: ${loot.id === 'bank_lofi' ? 'Lo-Fi Tape' : 'Cyber Deck'}!`, 'win');
        setLoot(null);
    };

    const displayName = userProfile?.name || 'OPERATOR';

    // Filter games by category and search query
    const filteredGames = useMemo(() => {
        return games.filter(g => {
            const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
            const matchesSearch = searchQuery === '' || 
                g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.desc.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="page-enter" style={{
            textAlign: 'center',
            padding: '16px',
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            paddingBottom: '120px',
            position: 'relative'
        }}>
            {/* LOOT ITEM POPUP */}
            <AnimatePresence>
                {loot && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: [0, 10, -10, 0] }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ rotate: { repeat: Infinity, duration: 2 } }}
                        onClick={handleCollectLoot}
                        style={{
                            position: 'absolute',
                            top: `${loot.y}%`, left: `${loot.x}%`,
                            zIndex: 100,
                            cursor: 'pointer',
                            fontSize: '3rem',
                            filter: 'drop-shadow(0 0 10px gold)'
                        }}
                    >
                        {loot.icon}
                        <div style={{ fontSize: '0.6rem', background: 'black', padding: '2px', borderRadius: '4px' }}>CLICK ME</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER & QUICK HUB BAR */}
            <div style={{ marginBottom: '24px', marginTop: '10px' }}>
                <p style={{ color: 'var(--neon-blue)', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '4px', fontFamily: 'monospace' }}>
                    {greeting.toUpperCase()}, {displayName} • SYSTEM ONLINE
                </p>
                <h1 style={{
                    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                    textShadow: '0 0 25px rgba(0, 229, 255, 0.5)',
                    margin: '0',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: '900',
                    letterSpacing: '2px'
                }}>
                    CYBER <span style={{ color: 'var(--neon-pink)', textShadow: '0 0 25px rgba(255, 0, 127, 0.6)' }}>ARCADE</span>
                </h1>
                
                {/* FAST HUB DESTINATION STRIP */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: '15px'
                }}>
                    <button
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('spawn-raid-boss'));
                            try { playBoop(); } catch(e) {}
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #ff0055, #ff5500)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            fontWeight: '900',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 12px rgba(255, 0, 85, 0.4)',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        <span>🚨</span> RAID BOSS
                    </button>

                    <Link to="/bunker" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(0, 229, 255, 0.15)',
                            border: '1px solid #00e5ff',
                            color: '#00ffff',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span>🍸</span> THE BUNKER
                        </div>
                    </Link>

                    <Link to="/underworld" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(255, 215, 0, 0.15)',
                            border: '1px solid #ffd700',
                            color: '#ffd700',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span>🎲</span> THE UNDERWORLD
                        </div>
                    </Link>

                    <Link to="/arena" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(255, 8, 68, 0.15)',
                            border: '1px solid #ff0844',
                            color: '#ff88aa',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span>⚔️</span> THE ARENA
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowSponsorModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.2))',
                            border: '1px solid #00f0ff',
                            color: '#00f0ff',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 0 14px rgba(0, 240, 255, 0.35)',
                            fontFamily: 'monospace'
                        }}
                    >
                        <span>⚡</span> SPONSOR (+1,500 CP)
                    </button>
                </div>
            </div>

            {/* SEARCH & CATEGORY FILTER BAR */}
            <div style={{
                background: 'rgba(10, 15, 26, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                borderRadius: '24px',
                padding: '12px 16px',
                margin: '0 auto 28px auto',
                maxWidth: '920px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {/* Search Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search games by name, genre, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(0, 229, 255, 0.4)',
                            borderRadius: '16px',
                            padding: '12px 20px',
                            color: '#fff',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)'
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem'
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    {CATEGORIES.map(cat => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    flex: '1 0 auto',
                                    background: isSelected ? 'linear-gradient(135deg, #00e5ff, #0072ff)' : 'rgba(255,255,255,0.05)',
                                    color: isSelected ? '#000' : '#ccc',
                                    border: isSelected ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
                                    padding: '8px 16px',
                                    borderRadius: '14px',
                                    fontWeight: '900',
                                    fontSize: '0.8rem',
                                    fontFamily: 'monospace',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: isSelected ? '0 0 16px rgba(0, 229, 255, 0.5)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ARCADE CABINETS GRID (FRONT & CENTER) */}
            <motion.div
                className="dashboard-grid arcade-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={selectedCategory + searchQuery}
                style={{
                    padding: '0',
                    maxWidth: '1200px',
                    margin: '0 auto 40px auto',
                    width: '100%',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    rowGap: '32px',
                    columnGap: '20px'
                }}
            >
                {filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                        <motion.div
                            key={game.id}
                            variants={itemVariants}
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Link to={game.path || `/arcade/${game.id}`} style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent', width: '100%', maxWidth: '340px' }}>
                                <CinematicGameCard
                                    game={game}
                                    highScore={getHighScore(game.id, stats)}
                                />
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '60px 20px', color: '#888', fontStyle: 'italic', fontFamily: 'monospace' }}>
                        No games matched your search query. Try another term or reset category!
                    </div>
                )}
            </motion.div>

            {/* COMMUNITY & LEADERBOARD MULTI-TAB PANEL */}
            <div style={{
                background: 'rgba(10, 15, 26, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '20px',
                maxWidth: '920px',
                margin: '0 auto 40px auto',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
            }}>
                {/* Secondary Hub Navigation Tabs */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #222', paddingBottom: '12px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                        { id: 'leaderboard', label: '🏆 LEADERBOARDS' },
                        { id: 'feed', label: '📡 LIVE FEED' },
                        { id: 'plaza', label: '🌐 ONLINE PLAZA' },
                        { id: 'pocketbro', label: '👾 POCKET BRO' }
                    ].map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                background: activeTab === t.id ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                                border: activeTab === t.id ? '1px solid #00e5ff' : 'none',
                                color: activeTab === t.id ? '#00e5ff' : '#888',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '0.82rem',
                                fontFamily: 'monospace',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* TAB 1: LEADERBOARD */}
                {activeTab === 'leaderboard' && (
                    <div>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'thin' }}>
                            {games.filter(g => g.leaderboardId).map(g => (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedLeaderboard(g.leaderboardId)}
                                    style={{
                                        background: selectedLeaderboard === g.leaderboardId ? g.gradient : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: selectedLeaderboard === g.leaderboardId ? '1px solid #fff' : '1px solid #333',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {g.title}
                                </button>
                            ))}
                        </div>
                        <LeaderboardTable gameId={selectedLeaderboard} />
                    </div>
                )}

                {/* TAB 2: LIVE FEED */}
                {activeTab === 'feed' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <LiveFeed />
                    </div>
                )}

                {/* TAB 3: ONLINE PLAZA */}
                {activeTab === 'plaza' && (
                    <OnlinePlaza />
                )}

                {/* TAB 4: POCKET BRO */}
                {activeTab === 'pocketbro' && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px'
                    }}>
                        <div style={{ position: 'relative', height: '90px', width: '90px', marginBottom: '10px' }}>
                            <PocketPet
                                stage={broStats?.stage || 'EGG'}
                                type={broStats?.type || 'SOOT'}
                                mood={getMood()}
                                isSleeping={broStats?.isSleeping}
                                skin={equippedSkin}
                            />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0', color: 'white' }}>POCKET BRO LINKED</h3>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '0.8rem', color: '#aaa', marginBottom: '15px' }}>
                            <span>❤️ {Math.floor(broStats?.happy || 0)}% HAPPY</span>
                            <span>⚡ {Math.floor(broStats?.xp || 0)} XP</span>
                        </div>
                        <Link to="/pocketbro" style={{
                            background: 'var(--neon-blue)', color: 'black', padding: '8px 24px',
                            borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem',
                            boxShadow: '0 0 15px var(--neon-blue)'
                        }}>
                            ENTER PET ROOM 🚪
                        </Link>
                    </div>
                )}
            </div>

            <SponsorStationModal isOpen={showSponsorModal} onClose={() => setShowSponsorModal(false)} />
        </div>
    );
};

export default ArcadeHub;
