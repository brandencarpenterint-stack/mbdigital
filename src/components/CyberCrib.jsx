import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePocketBro, POCKET_BRO_STAGES } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import { DECOR_ITEMS } from '../config/DecorItems';
import PocketPet from './pocket-pet/PocketPet';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { useToast } from '../context/ToastContext';

const GRID_COLS = 6;
const GRID_ROWS = 6;

const DIALOGUES = [
    "Hacking Night City mainframe... 💻",
    "Feeling fresh and ready to rumble! ⚡",
    "Did someone say Cyber Crash? 🚀",
    "Got any more pizza in the stash? 🍕",
    "Chilling in the neon penthouse. ✨",
    "Gotta hit high-roller status in the Bunker! 🎲",
    "Watching the flying cars drift by... 🛸"
];

const CyberCrib = ({ onOpenShop, onOpenBattle, onOpenAdventure }) => {
    const {
        stats,
        feed,
        play,
        sleep,
        clean,
        placeItem,
        removeItem,
        interactWithItem,
        equipDecor,
        gainExp
    } = usePocketBro();

    const { shopState, addCoins } = useGamification() || {};
    const equippedSkin = shopState?.equipped?.pocketbro || null;

    const { playClick, playCollect, playZap, playWin } = useRetroSound();
    const { showToast } = useToast() || { showToast: () => {} };

    // Crib Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDecorId, setSelectedDecorId] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'tech', 'living', 'loot', 'wallpaper'
    const [speechIndex, setSpeechIndex] = useState(0);

    // Bro Roaming Position (tile coordinates)
    const [broPos, setBroPos] = useState({ x: 2, y: 3 });
    const [isWalking, setIsWalking] = useState(false);
    const [petHearts, setPetHearts] = useState([]);

    // Cycle speech dialogue every 12 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSpeechIndex(prev => (prev + 1) % DIALOGUES.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    // Active Wallpaper / Background
    const activeBgId = stats.decor?.background || 'bg_penthouse';
    const activeBg = DECOR_ITEMS.find(d => d.id === activeBgId) || DECOR_ITEMS[0];

    // Placed Items
    const placedItems = stats.placedItems || [];
    const getItemAt = (x, y) => placedItems.find(i => i.x === x && i.y === y);

    // Unlocked decor list from context
    const unlockedIds = stats.unlockedDecor || ['furn_arcade', 'furn_pc', 'furn_bed', 'furn_plant', 'furn_pizza', 'rug_retro'];
    const availableItems = DECOR_ITEMS.filter(item => unlockedIds.includes(item.id) || item.price === 0);

    // Filter decor by category
    const filteredDecor = availableItems.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'tech') return ['furn_pc', 'furn_arcade', 'furn_server', 'furn_tv', 'furn_hologram', 'item_pc'].includes(item.id);
        if (activeTab === 'living') return ['furn_bed', 'furn_pod', 'furn_pizza', 'furn_plant', 'furn_cat_tree', 'furn_duck', 'rug_retro', 'rug_dance'].includes(item.id);
        if (activeTab === 'loot') return ['furn_chest', 'furn_whale', 'furn_ufo', 'furn_robot', 'furn_konami', 'furn_neon_sign', 'furn_turntable'].includes(item.id);
        if (activeTab === 'wallpaper') return item.type === 'background';
        return true;
    });

    // Handle Tile Click in Crib
    const handleTileClick = (x, y) => {
        playClick();

        if (isEditing) {
            // Edit Mode: Place or Remove
            const existing = getItemAt(x, y);

            if (selectedDecorId) {
                // If it's a background, apply wallpaper
                const decorDef = DECOR_ITEMS.find(d => d.id === selectedDecorId);
                if (decorDef?.type === 'background') {
                    equipDecor('background', selectedDecorId);
                    showToast(`Applied ${decorDef.name}!`, 'info');
                    return;
                }

                // Cannot place directly on top of Bro's current tile
                if (x === broPos.x && y === broPos.y) {
                    // Nudge Bro to an adjacent tile
                    setBroPos({ x: (x + 1) % GRID_COLS, y });
                }

                placeItem(selectedDecorId, x, y);
                playCollect();
            } else if (existing) {
                // Eraser mode: remove clicked item
                removeItem(x, y);
                showToast("Item removed from crib.", "info");
            }
        } else {
            // Live Interactive Mode
            const existing = getItemAt(x, y);

            if (existing) {
                // Trigger item interaction
                interactWithItem(existing.id);
                // Also guide Bro over to check it out!
                setIsWalking(true);
                setBroPos({ x, y });
                setTimeout(() => setIsWalking(false), 500);
            } else {
                // Empty tile clicked: Bro walks over!
                setIsWalking(true);
                setBroPos({ x, y });
                setTimeout(() => setIsWalking(false), 400);
            }
        }
    };

    // Petting Bro
    const handlePetBro = (e) => {
        e.stopPropagation();
        playWin();
        playZap();
        triggerConfetti();

        // Spawn floating heart particle
        const newHeart = { id: Date.now() + Math.random(), x: Math.random() * 40 - 20 };
        setPetHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
            setPetHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1500);

        if (play) play(15);
        if (gainExp) gainExp(25);
        showToast("Bro is super happy! (+25 XP)", "win");
    };

    // Evolution Info
    const stageConfig = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES['EGG'];

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            color: '#fff',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            {/* TOP CYBER HUD PANEL */}
            <div style={{
                background: 'rgba(10, 15, 26, 0.85)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '20px',
                padding: '16px 20px',
                marginBottom: '16px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Left: Bro Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,128,0.2))',
                        border: '1px solid #00f0ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        boxShadow: '0 0 15px rgba(0,240,255,0.4)'
                    }}>
                        {stageConfig.icon}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px', color: '#fff' }}>
                                POCKET BRO
                            </h2>
                            <span style={{
                                background: '#00f0ff',
                                color: '#000',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                fontSize: '0.65rem',
                                fontWeight: '900'
                            }}>
                                {stats.stage}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                            XP: {Math.floor(stats.xp)} • TYPE: {stats.type || 'SOOT'}
                        </div>
                    </div>
                </div>

                {/* Center: Vital Gauges */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Hunger */}
                    <div style={{ minWidth: '90px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '4px', color: '#ffaa00' }}>
                            <span>🍗 HUNGER</span>
                            <span>{Math.round(stats.hunger)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.hunger}%`, height: '100%', background: '#ffaa00', borderRadius: '3px' }} />
                        </div>
                    </div>

                    {/* Happy */}
                    <div style={{ minWidth: '90px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '4px', color: '#ff007f' }}>
                            <span>❤️ HAPPY</span>
                            <span>{Math.round(stats.happy)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.happy}%`, height: '100%', background: '#ff007f', borderRadius: '3px' }} />
                        </div>
                    </div>

                    {/* Energy */}
                    <div style={{ minWidth: '90px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '4px', color: '#00ff66' }}>
                            <span>⚡ ENERGY</span>
                            <span>{Math.round(stats.energy)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.energy}%`, height: '100%', background: '#00ff66', borderRadius: '3px' }} />
                        </div>
                    </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => { feed(15); playCollect(); }}
                        disabled={stats.isSleeping}
                        style={{
                            background: 'rgba(255, 170, 0, 0.15)',
                            border: '1px solid #ffaa00',
                            color: '#ffaa00',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            cursor: stats.isSleeping ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                        title="Feed Bro (+Hunger)"
                    >
                        🍗 FEED
                    </button>

                    <button
                        onClick={() => { sleep(); playZap(); }}
                        style={{
                            background: stats.isSleeping ? 'rgba(0, 255, 102, 0.2)' : 'rgba(0, 240, 255, 0.15)',
                            border: stats.isSleeping ? '1px solid #00ff66' : '1px solid #00f0ff',
                            color: stats.isSleeping ? '#00ff66' : '#00f0ff',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                        title="Sleep / Wake"
                    >
                        {stats.isSleeping ? '☀️ WAKE' : '💤 SLEEP'}
                    </button>

                    <button
                        onClick={() => { clean(); playCollect(); }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                        title="Clean Up Crib"
                    >
                        🧹 CLEAN
                    </button>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            background: isEditing ? 'linear-gradient(135deg, #ff007f, #ff003c)' : 'linear-gradient(135deg, #00f0ff, #0072ff)',
                            color: isEditing ? '#fff' : '#000',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            boxShadow: isEditing ? '0 0 15px rgba(255, 0, 127, 0.5)' : '0 0 15px rgba(0, 240, 255, 0.5)'
                        }}
                    >
                        {isEditing ? '✓ DONE EDITING' : '🛋️ DECORATE CRIB'}
                    </button>
                </div>
            </div>

            {/* THE 2D CYBER CRIB MAIN CANVAS */}
            <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2px solid rgba(0, 240, 255, 0.4)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 240, 255, 0.1)',
                background: activeBg?.css?.background || '#090a14'
            }}>
                {/* 1. Holographic Window / Back Wall Scene */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '140px',
                    borderBottom: '2px solid rgba(0, 240, 255, 0.3)',
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 15, 30, 0.9) 100%)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px'
                }}>
                    {/* Skyline Grid Background Effect */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.6
                    }} />

                    {/* Window Frame Label */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.65rem', color: '#00f0ff', letterSpacing: '2px', fontFamily: 'monospace' }}>
                            SECTOR 7 • LEVEL 88
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
                            {activeBg?.name || 'CYBER PENTHOUSE'}
                        </div>
                    </div>

                    {/* Speech Emote Bubble Above Crib */}
                    <motion.div
                        key={speechIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            background: 'rgba(0, 0, 0, 0.75)',
                            border: '1px solid #00f0ff',
                            borderRadius: '16px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            color: '#00ffff',
                            fontFamily: 'monospace',
                            boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        💬 {DIALOGUES[speechIndex]}
                    </motion.div>
                </div>

                {/* 2. 2.5D Isometric Floor Grid Canvas */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '440px',
                    padding: '30px 20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(ellipse at bottom, rgba(0, 240, 255, 0.1) 0%, rgba(5, 7, 15, 0.95) 70%)'
                }}>
                    {/* Perspective Floor Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                        gap: '8px',
                        width: '100%',
                        maxWidth: '680px',
                        aspectRatio: '1/1',
                        position: 'relative',
                        padding: '10px',
                        borderRadius: '18px',
                        border: isEditing ? '2px dashed rgba(0, 240, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(0, 0, 0, 0.45)',
                        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)'
                    }}>
                        {/* Render All Grid Cells */}
                        {[...Array(GRID_ROWS)].map((_, y) =>
                            [...Array(GRID_COLS)].map((_, x) => {
                                const placed = getItemAt(x, y);
                                const itemDef = placed ? DECOR_ITEMS.find(d => d.id === placed.id) : null;
                                const isBroHere = broPos.x === x && broPos.y === y;

                                return (
                                    <div
                                        key={`${x}-${y}`}
                                        onClick={() => handleTileClick(x, y)}
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '12px',
                                            background: isEditing
                                                ? (selectedDecorId ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)')
                                                : 'rgba(255, 255, 255, 0.015)',
                                            border: isEditing
                                                ? '1px dashed rgba(0, 240, 255, 0.3)'
                                                : '1px solid rgba(255, 255, 255, 0.04)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isEditing ? 'pointer' : (placed ? 'pointer' : 'default'),
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (isEditing) {
                                                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)';
                                                e.currentTarget.style.borderColor = '#00f0ff';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (isEditing) {
                                                e.currentTarget.style.background = selectedDecorId ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                                            }
                                        }}
                                    >
                                        {/* Placed Furniture Item */}
                                        {itemDef && itemDef.type !== 'background' && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                whileHover={{ scale: 1.15, y: -4 }}
                                                style={{
                                                    fontSize: '2.5rem',
                                                    position: 'relative',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    filter: 'drop-shadow(0 8px 6px rgba(0, 0, 0, 0.7))',
                                                    ...itemDef.style
                                                }}
                                                title={itemDef.name}
                                            >
                                                {itemDef.render || itemDef.icon}

                                                {/* Ground Shadow */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '-6px',
                                                    width: '70%',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)',
                                                    zIndex: -1
                                                }} />
                                            </motion.div>
                                        )}

                                        {/* LIVING POCKET BRO COMPANION */}
                                        {isBroHere && (
                                            <motion.div
                                                onClick={handlePetBro}
                                                animate={{
                                                    y: isWalking ? [-6, 0] : [0, -6, 0],
                                                    scale: [1, 1.05, 1]
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: isWalking ? 0.3 : 2,
                                                    ease: 'easeInOut'
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    zIndex: 25,
                                                    width: '70px',
                                                    height: '70px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                                title="Pet PocketBro!"
                                            >
                                                <PocketPet
                                                    type={stats.type || 'SOOT'}
                                                    stage={stats.stage}
                                                    mood={stats.happy < 40 ? 'sad' : 'happy'}
                                                    isSleeping={stats.isSleeping}
                                                    skin={equippedSkin}
                                                    color={stats.color}
                                                    effect={stats.effect}
                                                />

                                                {/* Sleeping Zzz Badge */}
                                                {stats.isSleeping && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-5px',
                                                        fontSize: '1.2rem',
                                                        animation: 'float 2s infinite'
                                                    }}>
                                                        💤
                                                    </span>
                                                )}

                                                {/* Poop Indicator */}
                                                {stats.poopCount > 0 && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        bottom: '-5px',
                                                        right: '-10px',
                                                        fontSize: '1.2rem'
                                                    }}>
                                                        💩
                                                    </span>
                                                )}

                                                {/* Floating Hearts Particle Animation */}
                                                {petHearts.map(h => (
                                                    <motion.span
                                                        key={h.id}
                                                        initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
                                                        animate={{ opacity: 0, y: -45, scale: 1.4 }}
                                                        transition={{ duration: 1.2 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-15px',
                                                            fontSize: '1.4rem',
                                                            pointerEvents: 'none'
                                                        }}
                                                    >
                                                        ❤️
                                                    </motion.span>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 3. DECORATION TOOLBAR DOCK (Shown in Edit Mode) */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                            style={{
                                background: 'rgba(7, 10, 19, 0.95)',
                                borderTop: '2px solid #00f0ff',
                                padding: '16px 20px',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            {/* Category Filter Tabs */}
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', scrollbarWidth: 'none' }}>
                                {[
                                    { id: 'all', label: '🛋️ ALL DECOR' },
                                    { id: 'tech', label: '🕹️ TECH & ARCADES' },
                                    { id: 'living', label: '🛏️ LIVING & PODS' },
                                    { id: 'loot', label: '✨ ADVENTURE LOOT' },
                                    { id: 'wallpaper', label: '🖼️ WALLPAPERS' }
                                ].map(tab => {
                                    const isSelected = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{
                                                background: isSelected ? 'linear-gradient(135deg, #00f0ff, #0072ff)' : 'rgba(255, 255, 255, 0.05)',
                                                color: isSelected ? '#000' : '#ccc',
                                                border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '12px',
                                                padding: '6px 14px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                fontFamily: 'monospace',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}

                                <div style={{ flex: 1 }} />

                                <button
                                    onClick={() => setSelectedDecorId(null)}
                                    style={{
                                        background: selectedDecorId === null ? '#ff0055' : 'rgba(255, 0, 85, 0.15)',
                                        border: '1px solid #ff0055',
                                        color: selectedDecorId === null ? '#fff' : '#ff88aa',
                                        borderRadius: '12px',
                                        padding: '6px 14px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    🧹 ERASER / REMOVE
                                </button>
                            </div>

                            {/* Item Carousel Cards */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                overflowX: 'auto',
                                paddingBottom: '8px',
                                scrollbarWidth: 'thin'
                            }}>
                                {filteredDecor.map(item => {
                                    const isSelected = selectedDecorId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedDecorId(item.id);
                                                playClick();
                                            }}
                                            style={{
                                                minWidth: '85px',
                                                padding: '10px 8px',
                                                background: isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                                                border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                boxShadow: isSelected ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                maxWidth: '75px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {item.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{
                                marginTop: '10px',
                                fontSize: '0.72rem',
                                color: '#94a3b8',
                                fontFamily: 'monospace',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>SELECT AN ITEM ABOVE, THEN CLICK ANY TILE IN THE ROOM TO PLACE IT.</span>
                                <span>{placedItems.length} ITEMS PLACED</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CyberCrib;
