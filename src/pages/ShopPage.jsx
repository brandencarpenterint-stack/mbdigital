import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { SHOP_ITEMS, CATEGORIES } from '../config/ShopItems';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const ShopPage = () => {
    const { shopState, buyItem, equipItem, unlockedAchievements } = useGamification() || {};
    const [activeCategory, setActiveCategory] = useState('fishing');
    const [coins, setCoins] = useState(0);
    const { playBeep, playCollect, playBoop } = useRetroSound();



    // Coin Sync
    useEffect(() => {
        const updateCoins = () => setCoins(parseInt(localStorage.getItem('arcadeCoins')) || 0);
        updateCoins();
        const interval = setInterval(updateCoins, 1000);
        return () => clearInterval(interval);
    }, []);

    // Debug Overlay
    if (!shopState) {
        return (
            <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>
                <h1>LOADING SHOP DATA...</h1>
                <p>Status: {shopState ? 'Defined' : 'Undefined'}</p>
                <p>Check Console for "ShopPage Debug"</p>
                <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Reload Page
                </button>
            </div>
        );
    }

    const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

    return (
        <div className="page-enter" style={{ padding: '20px', minHeight: '100vh', paddingBottom: '120px' }}>
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    margin: '0 0 10px 0',
                    lineHeight: 1,
                    fontFamily: '"Orbitron", sans-serif',
                    color: 'var(--neon-blue)',
                    textShadow: '0 0 20px rgba(0, 204, 255, 0.5)'
                }}>GLOBAL SHOP</h1>
                <div style={{
                    fontSize: '1.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '10px 30px', borderRadius: '50px',
                    border: '1px solid var(--neon-gold)',
                    color: 'var(--neon-gold)', fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
                }}>
                    🪙 {coins.toLocaleString()}
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            playBoop();
                            if (navigator.vibrate) navigator.vibrate(10);
                        }}
                        style={{
                            padding: '12px 25px', borderRadius: '30px',
                            border: activeCategory === cat.id ? '2px solid var(--neon-pink)' : '1px solid rgba(255,255,255,0.2)',
                            background: activeCategory === cat.id ? 'rgba(255, 0, 128, 0.2)' : 'transparent',
                            color: activeCategory === cat.id ? 'white' : '#888',
                            fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            boxShadow: activeCategory === cat.id ? '0 0 20px rgba(255, 0, 128, 0.4)' : 'none',
                            transform: activeCategory === cat.id ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </button>
                ))}
            </div>

            {/* MYSTERY CRATE REMOVED BY USER REQUEST (Step 5496) */}

            {/* HERO MERCH CARD (Static) */}
            <div className="glass-panel" style={{
                maxWidth: '1200px', margin: '0 auto 40px auto',
                background: 'linear-gradient(90deg, #000 0%, #111 100%)',
                color: 'white', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px',
                border: '1px solid #333'
            }}>
                <div>
                    <span style={{ color: 'var(--neon-gold)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>OFFICIAL MERCH</span>
                    <h2 style={{ fontSize: '2rem', margin: '10px 0', fontFamily: '"Orbitron", sans-serif' }}>WEAR THE HYPE</h2>
                    <p style={{ color: '#888', margin: '0 0 20px 0' }}>Get physical gear delivered to your door.</p>
                    <a href="https://merchboy.shop" target="_blank" rel="noreferrer" className="squishy-btn" style={{
                        background: 'white', color: 'black', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block'
                    }}>
                        VISIT STORE ↗
                    </a>
                </div>
                <img src="/assets/merchboy_money.png" alt="Merch Boy Money" style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} />
            </div>

            {/* ITEMS GRID */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
                gap: '25px', maxWidth: '1200px', margin: '0 auto'
            }}>
                {filteredItems.map(item => {
                    const isUnlocked = shopState.unlocked.includes(item.id);
                    const isEquipped = shopState.equipped[item.category] === item.id;
                    const canAfford = coins >= item.price;

                    // Achievement Lock Logic
                    const requirementId = item.unlockCondition;
                    const requirement = requirementId ? ACHIEVEMENTS.find(a => a.id === requirementId) : null;
                    const isAchievementUnlocked = !requirementId || unlockedAchievements?.includes(requirementId);

                    return (
                        <div key={item.id} className="glass-panel" style={{
                            padding: '25px',
                            border: isEquipped ? '2px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)',
                            position: 'relative', overflow: 'hidden',
                            textAlign: 'center',
                            background: isEquipped ? 'rgba(0, 255, 154, 0.05)' : 'rgba(0,0,0,0.4)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            {/* STATUS BADGE */}
                            {isEquipped && (
                                <div style={{
                                    position: 'absolute', top: '15px', right: '15px',
                                    background: 'var(--neon-green)', color: 'black', padding: '4px 10px',
                                    fontSize: '0.7rem', fontWeight: '900', borderRadius: '4px', zIndex: 2,
                                    boxShadow: '0 0 10px var(--neon-green)'
                                }}>ACTIVE</div>
                            )}

                            <div>
                                {/* ITEM ICON */}
                                <div style={{
                                    fontSize: '4rem', marginBottom: '20px',
                                    filter: isEquipped ? 'drop-shadow(0 0 15px var(--neon-green))' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))',
                                    transition: 'filter 0.3s'
                                }}>
                                    {item.icon}
                                </div>

                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'white', fontFamily: '"Orbitron", sans-serif' }}>{item.name}</h3>
                                <p style={{ color: '#888', margin: '0 0 20px 0', minHeight: '40px', fontSize: '0.85rem' }}>{item.description}</p>
                            </div>

                            {/* ACTION BUTTON */}
                            {isUnlocked ? (
                                <button
                                    onClick={() => {
                                        equipItem(item.category, item.id);
                                        playBeep();
                                        if (navigator.vibrate) navigator.vibrate(20);
                                    }}
                                    disabled={isEquipped}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px',
                                        background: isEquipped ? 'transparent' : 'var(--neon-blue)',
                                        color: isEquipped ? 'var(--neon-green)' : 'black',
                                        border: isEquipped ? '1px solid var(--neon-green)' : 'none',
                                        fontWeight: 'bold',
                                        cursor: isEquipped ? 'default' : 'pointer',
                                        opacity: isEquipped ? 1 : 1,
                                        boxShadow: isEquipped ? 'none' : '0 0 20px rgba(0, 204, 255, 0.4)'
                                    }}
                                >
                                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                                </button>
                            ) : !isAchievementUnlocked ? (
                                <div style={{
                                    width: '100%', padding: '10px', borderRadius: '12px',
                                    background: 'rgba(255, 0, 0, 0.2)',
                                    color: '#ff5555',
                                    border: '1px solid #ff5555',
                                    fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    🔒 REQUIRES:<br />
                                    <span style={{ color: 'white' }}>{requirement?.title || 'UNKNOWN'}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        buyItem(item);
                                        playCollect();
                                        triggerConfetti();
                                        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
                                    }}
                                    disabled={!canAfford}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px',
                                        background: canAfford ? 'var(--neon-gold)' : '#333',
                                        color: canAfford ? 'black' : '#666',
                                        border: 'none', fontWeight: 'bold',
                                        cursor: canAfford ? 'pointer' : 'not-allowed',
                                        boxShadow: canAfford ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none'
                                    }}
                                >
                                    BUY {item.price > 0 ? `${item.price}` : 'FREE'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Link to="/arcade" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>← RETURN TO ARCADE</Link>
            </div>
        </div>
    );
};

export default ShopPage;
