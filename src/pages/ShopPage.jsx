/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { SHOP_ITEMS, CATEGORIES } from '../config/ShopItems';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import GachaponModal from '../components/GachaponModal';
import SquishyButton from '../components/SquishyButton';

const RARITY_COLORS = {
    common: '#a0aec0',
    rare: '#00bfff',
    epic: '#d53f8c',
    legendary: '#ecc94b'
};

const getRarity = (price) => {
    if (price >= 5000) return 'legendary';
    if (price >= 2000) return 'epic';
    if (price >= 500) return 'rare';
    return 'common';
};

const ShopPage = () => {
    const { shopState, buyItem, equipItem, unlockedAchievements, coins } = useGamification() || {};
    const [activeCategory, setActiveCategory] = useState('fishing');
    const [showGacha, setShowGacha] = useState(false);
    const { playBeep, playCollect, playBoop } = useRetroSound();

    // Featured Item (Pick a random high-value item daily - simplified to random on amount here)
    const featuredItem = useMemo(() => {
        const legendaries = SHOP_ITEMS.filter(i => i.price >= 2000);
        return legendaries[Math.floor(Math.random() * legendaries.length)] || SHOP_ITEMS[0];
    }, []);

    const filteredItems = useMemo(() =>
        SHOP_ITEMS.filter(item => item.category === activeCategory),
        [activeCategory]);

    // Debug Overlay
    if (!shopState) {
        return (
            <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>
                <h1>LOADING SHOP...</h1>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ minHeight: '100vh', paddingBottom: '120px', background: 'radial-gradient(circle at top, #1a202c, #000)' }}>

            {/* STICKY HEADER */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #333',
                padding: '10px 0'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'white', fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px' }}>
                        GLOBAL <span style={{ color: 'var(--neon-blue)' }}>SHOP</span>
                    </h1>

                    <div style={{
                        background: 'rgba(255, 215, 0, 0.1)', border: '1px solid var(--neon-gold)',
                        padding: '5px 15px', borderRadius: '20px', color: 'var(--neon-gold)', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                        <span>🪙</span> {coins.toLocaleString()}
                    </div>
                </div>

                {/* CATEGORY NAV */}
                <div style={{
                    overflowX: 'auto', whiteSpace: 'nowrap', padding: '15px 20px',
                    display: 'flex', gap: '10px', maxWidth: '1200px', margin: '0 auto',
                    scrollbarWidth: 'none' // Hide scrollbar
                }}>
                    {CATEGORIES.map(cat => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                playBoop();
                                if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            style={{
                                padding: '8px 20px', borderRadius: '20px', border: 'none',
                                background: activeCategory === cat.id ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)',
                                color: activeCategory === cat.id ? 'black' : '#888',
                                fontWeight: 'bold', cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                boxShadow: activeCategory === cat.id ? '0 0 15px var(--neon-blue)' : 'none'
                            }}
                        >
                            <span style={{ marginRight: '5px' }}>{cat.icon}</span>
                            {cat.name.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </header>

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* HERO BANNER (FEATURED) */}
                <div className="glass-panel" style={{
                    marginBottom: '40px', padding: '0',
                    background: 'linear-gradient(135deg, #1a202c, #000)',
                    border: `1px solid ${RARITY_COLORS[getRarity(featuredItem.price)]}`,
                    display: 'flex', flexWrap: 'wrap', overflow: 'hidden'
                }}>
                    <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ color: RARITY_COLORS[getRarity(featuredItem.price)], fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>
                            FEATURED ITEM
                        </div>
                        <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                            {featuredItem.name}
                        </h2>
                        <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '30px', maxWidth: '500px' }}>
                            {featuredItem.description} Limited time offer in the Global Shop.
                        </p>
                        <SquishyButton
                            onClick={() => {
                                setActiveCategory(featuredItem.category);
                                playBeep();
                            }}
                            style={{
                                width: 'fit-content',
                                background: RARITY_COLORS[getRarity(featuredItem.price)],
                                color: 'black'
                            }}
                        >
                            VIEW IN STORE ->
                        </SquishyButton>
                    </div>
                    <div style={{
                        width: '300px', background: 'rgba(255,255,255,0.02)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '8rem', position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${RARITY_COLORS[getRarity(featuredItem.price)]}22 0%, transparent 70%)` }} />
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {featuredItem.icon}
                        </motion.div>
                    </div>
                </div>

                {/* GACHA BANNER */}
                <div
                    onClick={() => setShowGacha(true)}
                    className="glass-panel"
                    style={{
                        marginBottom: '40px', padding: '20px',
                        background: 'linear-gradient(90deg, #330033, #000)',
                        border: '1px solid #d53f8c',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '3rem' }}>🔮</div>
                        <div>
                            <h3 style={{ margin: 0, color: '#d53f8c', fontSize: '1.5rem' }}>STICKER GACHAPON</h3>
                            <p style={{ margin: 0, color: '#aaa' }}>Test your luck! Win rare stickers.</p>
                        </div>
                    </div>
                    <div style={{ color: '#d53f8c', fontWeight: 'bold' }}>OPEN ></div>
                </div>

                {/* ITEMS GRID */}
                <motion.div
                    layout
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '20px'
                    }}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map(item => {
                            const slot = item.slot || item.category;
                            const isUnlocked = shopState.unlocked.includes(item.id);
                            const isEquipped = shopState.equipped[slot] === item.id;
                            const canAfford = coins >= item.price;
                            const rarity = getRarity(item.price);
                            const color = RARITY_COLORS[rarity];

                            // Requirement Logic
                            const requirementId = item.unlockCondition;
                            const requirement = requirementId ? ACHIEVEMENTS.find(a => a.id === requirementId) : null;
                            const isAchievementUnlocked = !requirementId || unlockedAchievements?.includes(requirementId);

                            // Consumable Logic
                            const isConsumable = item.type === 'consumable';
                            const stock = shopState.inventory?.[item.id] || 0;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={item.id}
                                    className="glass-panel"
                                    style={{
                                        padding: '20px',
                                        border: isEquipped ? '2px solid var(--neon-green)' : `1px solid ${color}44`,
                                        background: isEquipped ? 'rgba(0, 255, 154, 0.05)' : `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, ${color}11 100%)`,
                                        display: 'flex', flexDirection: 'column',
                                        position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    {/* RARITY STRIPE */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: color, boxShadow: `0 0 10px ${color}` }} />

                                    {/* STATUS BADGES */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '0.7rem', color: color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {rarity}
                                        </div>
                                        {isEquipped && <div style={{ background: 'var(--neon-green)', color: 'black', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EQUIPPED</div>}
                                        {isConsumable && stock > 0 && <div style={{ background: 'white', color: 'black', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>OWNED: {stock}</div>}
                                    </div>

                                    {/* ICON */}
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '10px' }}>
                                        <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                                            {item.icon}
                                        </motion.div>
                                    </div>

                                    {/* INFO */}
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'white' }}>{item.name}</h3>
                                    <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: '#888', flex: 1 }}>{item.description}</p>

                                    {/* ACTION BUTTON */}
                                    <div style={{ marginTop: 'auto' }}>
                                        {isUnlocked && !isConsumable ? (
                                            <button
                                                onClick={() => {
                                                    equipItem(item.category, item.id);
                                                    playBeep();
                                                }}
                                                disabled={isEquipped}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '10px',
                                                    background: isEquipped ? 'transparent' : 'var(--neon-blue)',
                                                    color: isEquipped ? 'var(--neon-green)' : 'black',
                                                    border: isEquipped ? '1px solid var(--neon-green)' : 'none',
                                                    fontWeight: 'bold', cursor: isEquipped ? 'default' : 'pointer',
                                                    opacity: isEquipped ? 0.7 : 1
                                                }}
                                            >
                                                {isEquipped ? 'ACTIVE' : 'EQUIP'}
                                            </button>
                                        ) : !isAchievementUnlocked ? (
                                            <div style={{
                                                padding: '10px', background: 'rgba(255,0,0,0.1)',
                                                border: '1px solid rgba(255,0,0,0.3)', borderRadius: '10px',
                                                color: '#ff5555', fontSize: '0.7rem', textAlign: 'center'
                                            }}>
                                                🔒 {requirement?.title?.toUpperCase() || 'LOCKED'}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (buyItem(item)) {
                                                        playCollect();
                                                        triggerConfetti();
                                                    }
                                                }}
                                                disabled={!canAfford}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '10px',
                                                    background: canAfford ? 'var(--neon-gold)' : '#333',
                                                    color: canAfford ? 'black' : '#666',
                                                    border: 'none', fontWeight: 'bold',
                                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                                                }}
                                            >
                                                {canAfford ? 'BUY' : 'NEED'}
                                                <span>{item.price === 0 ? 'FREE' : item.price}</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <Link to="/arcade" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>← RETURN TO ARCADE</Link>
                </div>
            </div>

            {showGacha && <GachaponModal onClose={() => setShowGacha(false)} />}
        </div>
    );
};

export default ShopPage;
