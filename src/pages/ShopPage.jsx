/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
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
    const { unlockDecor: unlockPocketDecor, stats: pocketStats } = usePocketBro() || {};
    const [activeCategory, setActiveCategory] = useState('fishing');
    const [showGacha, setShowGacha] = useState(false);
    const { playBeep, playCollect, playBoop } = useRetroSound();

    // Featured Item
    const featuredItem = useMemo(() => {
        const legendaries = SHOP_ITEMS.filter(i => i.price >= 2000);
        return legendaries[Math.floor(Math.random() * legendaries.length)] || SHOP_ITEMS[0];
    }, []);

    const filteredItems = useMemo(() =>
        SHOP_ITEMS.filter(item => item.category === activeCategory),
        [activeCategory]);

    // Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const xPct = (e.clientX - rect.left) / width - 0.5;
        const yPct = (e.clientY - rect.top) / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    // Debug Overlay
    if (!shopState) {
        return (
            <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontFamily: '"Orbitron", sans-serif' }}>LOADING MARKETPLACE...</h1>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ minHeight: '100vh', paddingBottom: '120px', background: 'radial-gradient(circle at top, #1a202c, #000)', fontFamily: '"Rajdhani", sans-serif' }}>

            {/* STICKY HEADER */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(5,5,10,0.9)', backdropFilter: 'blur(15px)',
                borderBottom: '1px solid #333',
                padding: '15px 0',
                boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', color: 'white', fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px', textShadow: '0 0 10px #00f2ff' }}>
                        CYBER <span style={{ color: 'var(--neon-blue)' }}>MART</span>
                    </h1>

                    <div style={{
                        background: 'rgba(0,0,0,0.5)', border: '1px solid var(--neon-gold)',
                        padding: '8px 18px', borderRadius: '4px', color: 'var(--neon-gold)', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)'
                    }}>
                        <span>🪙</span> <span style={{ fontSize: '1.2rem' }}>{coins.toLocaleString()}</span>
                    </div>
                </div>

                {/* CATEGORY NAV */}
                <div style={{
                    overflowX: 'auto', whiteSpace: 'nowrap', padding: '15px 20px',
                    display: 'flex', gap: '15px', maxWidth: '1200px', margin: '0 auto',
                    scrollbarWidth: 'none'
                }}>
                    {CATEGORIES.map(cat => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                playBoop();
                                if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            style={{
                                padding: '10px 25px', borderRadius: '4px', border: activeCategory === cat.id ? '1px solid var(--neon-blue)' : '1px solid #333',
                                background: activeCategory === cat.id ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0,0,0,0.4)',
                                color: activeCategory === cat.id ? 'var(--neon-blue)' : '#888',
                                fontWeight: 'bold', cursor: 'pointer',
                                fontSize: '0.9rem',
                                letterSpacing: '1px',
                                fontFamily: '"Orbitron", sans-serif',
                                transition: 'all 0.2s',
                                boxShadow: activeCategory === cat.id ? '0 0 15px rgba(0, 242, 255, 0.2)' : 'none',
                                clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)'
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                            {cat.name.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </header>

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* HERO BANNER (PARALLAX) */}
                <motion.div
                    className="glass-panel"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
                    style={{
                        marginBottom: '40px', padding: '0',
                        background: 'radial-gradient(circle at center, #222, #000)',
                        border: `1px solid ${RARITY_COLORS[getRarity(featuredItem.price)]}`,
                        display: 'flex', flexWrap: 'wrap', overflow: 'hidden',
                        perspective: '1000px', transformStyle: 'preserve-3d',
                        boxShadow: `0 0 30px ${RARITY_COLORS[getRarity(featuredItem.price)]}20`
                    }}
                >
                    <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
                        <div style={{ color: RARITY_COLORS[getRarity(featuredItem.price)], fontWeight: 'bold', letterSpacing: '4px', marginBottom: '10px', fontSize: '0.8rem' }}>
                            // FEATURED ITEM
                        </div>
                        <h2 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.2)', fontFamily: '"Orbitron", sans-serif' }}>
                            {featuredItem.name}
                        </h2>
                        <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '30px', maxWidth: '500px', lineHeight: 1.5 }}>
                            {featuredItem.description} <br />
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>LIMITED STOCK [==============--] 85%</span>
                        </p>
                        <SquishyButton
                            onClick={() => {
                                setActiveCategory(featuredItem.category);
                                playBeep();
                            }}
                            style={{
                                width: 'fit-content',
                                background: RARITY_COLORS[getRarity(featuredItem.price)],
                                color: 'black',
                                fontFamily: '"Orbitron", sans-serif',
                                fontSize: '1rem',
                                padding: '15px 40px'
                            }}
                        >
                            VIEW IN STORE -&gt;
                        </SquishyButton>
                    </div>
                    <motion.div
                        style={{
                            width: '350px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10rem', position: 'relative',
                            rotateX, rotateY
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ filter: `drop-shadow(0 20px 50px ${RARITY_COLORS[getRarity(featuredItem.price)]}66)` }}
                        >
                            {featuredItem.icon}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* GACHA BANNER */}
                <div
                    onClick={() => setShowGacha(true)}
                    className="glass-panel"
                    style={{
                        marginBottom: '40px', padding: '25px',
                        background: 'linear-gradient(90deg, #220022 0%, #000 100%)',
                        border: '1px solid #d53f8c',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: 'inset 0 0 50px #d53f8c22'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, loop: Infinity, ease: "linear" }} style={{ fontSize: '3rem' }}>🔮</motion.div>
                        <div>
                            <h3 style={{ margin: 0, color: '#d53f8c', fontSize: '1.8rem', fontFamily: '"Orbitron", sans-serif' }}>STICKER GACHAPON</h3>
                            <p style={{ margin: '5px 0 0 0', color: '#aaa' }}>Test your luck! Win rare stickers for your Bro Card.</p>
                        </div>
                    </div>
                    <div style={{ color: '#d53f8c', fontWeight: 'bold', padding: '10px 20px', border: '2px solid #d53f8c', borderRadius: '4px' }}>OPEN &gt;</div>
                </div>

                {/* ITEMS GRID */}
                <motion.div
                    layout
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '25px'
                    }}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map(item => {
                            const slot = item.slot || item.category;
                            // Check ownership in PocketBro for decor, otherwise ShopState
                            const isDecor = item.category === 'homedecor';
                            const isUnlocked = isDecor
                                ? pocketStats?.unlockedDecor?.includes(item.id)
                                : shopState.unlocked.includes(item.id);

                            const isEquipped = shopState.equipped[slot] === item.id;
                            const canAfford = coins >= item.price;
                            const rarity = getRarity(item.price);
                            const color = RARITY_COLORS[rarity];

                            // Requirement Logic
                            const requirementId = item.unlockCondition;
                            const requirement = requirementId ? ACHIEVEMENTS.find(a => a.id === requirementId) : null;
                            const isAchievementUnlocked = !requirementId || unlockedAchievements?.includes(requirementId);
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
                                        padding: '25px',
                                        border: isEquipped ? '2px solid var(--neon-green)' : `1px solid ${color}33`,
                                        background: isEquipped ? 'rgba(0, 255, 154, 0.05)' : `linear-gradient(180deg, #111 0%, ${color}08 100%)`,
                                        display: 'flex', flexDirection: 'column',
                                        position: 'relative', overflow: 'hidden',
                                        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)'
                                    }}
                                >
                                    {/* RARITY & TYPE */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '0.65rem', color: color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${color}`, padding: '2px 6px', borderRadius: '4px' }}>
                                            {rarity}
                                        </div>
                                        {isEquipped && <div style={{ background: 'var(--neon-green)', color: 'black', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>EQUIPPED</div>}
                                        {isConsumable && stock > 0 && <div style={{ background: 'white', color: 'black', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>STOCK: {stock}</div>}
                                    </div>

                                    {/* ICON */}
                                    <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem', marginBottom: '15px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: color, opacity: 0.1, filter: 'blur(20px)' }}></div>
                                        <motion.div whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}>
                                            {item.icon}
                                        </motion.div>
                                    </div>

                                    {/* INFO */}
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: 'white', fontFamily: '"Orbitron", sans-serif' }}>{item.name}</h3>
                                    <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#888', flex: 1, lineHeight: 1.4 }}>{item.description}</p>

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
                                                    width: '100%', padding: '15px', borderRadius: '4px',
                                                    background: isEquipped ? 'transparent' : 'var(--neon-blue)',
                                                    color: isEquipped ? 'var(--neon-green)' : 'black',
                                                    border: isEquipped ? '1px solid var(--neon-green)' : 'none',
                                                    fontWeight: 'bold', cursor: isEquipped ? 'default' : 'pointer',
                                                    opacity: isEquipped ? 0.7 : 1,
                                                    fontFamily: '"Orbitron", sans-serif', fontSize: '0.9rem'
                                                }}
                                            >
                                                {isEquipped ? 'ACTIVE' : 'EQUIP'}
                                            </button>
                                        ) : !isAchievementUnlocked ? (
                                            <div style={{
                                                padding: '15px', background: 'rgba(255,0,0,0.05)',
                                                border: '1px solid rgba(255,0,0,0.4)', borderRadius: '4px',
                                                color: '#ff5555', fontSize: '0.8rem', textAlign: 'center',
                                                fontFamily: '"Rajdhani", sans-serif', fontWeight: 'bold',
                                                textTransform: 'uppercase', letterSpacing: '1px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}>
                                                🔒 {requirement?.title?.toUpperCase() || 'LOCKED'}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (buyItem(item)) {
                                                        playCollect();
                                                        triggerConfetti();
                                                        if (isDecor && unlockPocketDecor) {
                                                            unlockPocketDecor(item.id);
                                                        }
                                                    }
                                                }}
                                                disabled={!canAfford}
                                                style={{
                                                    width: '100%', padding: '15px', borderRadius: '4px',
                                                    background: canAfford ? 'var(--neon-gold)' : '#222',
                                                    color: canAfford ? 'black' : '#555',
                                                    border: 'none', fontWeight: 'bold',
                                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                    fontFamily: '"Orbitron", sans-serif', fontSize: '0.9rem'
                                                }}
                                            >
                                                {canAfford ? 'PURCHASE' : 'INSUFFICIENT FUNDS'}
                                                {canAfford && <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{item.price}</span>}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                <div style={{ textAlign: 'center', marginTop: '80px' }}>
                    <Link to="/arcade" style={{ color: '#666', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '2px', fontFamily: '"Orbitron", sans-serif' }}>← RETURN TO SECTOR 7 (ARCADE)</Link>
                </div>
            </div>

            {showGacha && <GachaponModal onClose={() => setShowGacha(false)} />}
        </div>
    );
};

export default ShopPage;
