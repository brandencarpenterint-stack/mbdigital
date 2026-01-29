import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { SHOP_ITEMS, CATEGORIES } from '../config/ShopItems';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const ShopPage = () => {
    const { shopState, buyItem, equipItem } = useGamification() || {};
    const [activeCategory, setActiveCategory] = useState('fishing');
    const [coins, setCoins] = useState(0);
    const { playBeep, playCollect, playBoop } = useRetroSound();

    console.log('ShopPage Debug:', { shopState, items: SHOP_ITEMS.length });

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
        <div className="page-enter" style={{ padding: '20px', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* HEADER */}
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{
                    fontSize: '3rem', margin: '0 0 10px 0',
                    lineHeight: 1
                }}>GLOBAL SHOP</h1>
                <div style={{
                    fontSize: '1.2rem', background: 'white', display: 'inline-block',
                    padding: '8px 25px', borderRadius: '50px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    color: '#333', fontWeight: 'bold'
                }}>
                    🪙 {coins.toLocaleString()}
                </div>
            </div>

            {/* CATEGORY TABS */}
            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            playBoop();
                            if (navigator.vibrate) navigator.vibrate(10);
                        }}
                        style={{
                            padding: '10px 20px', borderRadius: '25px', border: 'none',
                            background: activeCategory === cat.id ? '#0ea5e9' : 'rgba(255,255,255,0.5)',
                            color: activeCategory === cat.id ? 'white' : '#555',
                            fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s',
                            boxShadow: activeCategory === cat.id ? '0 5px 15px rgba(14, 165, 233, 0.3)' : 'none'
                        }}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </button>
                ))}
            </div>

            {/* HERO MERCH CARD */}
            <div className="bento-card" style={{
                maxWidth: '1200px', margin: '0 auto 40px auto',
                background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                color: 'white', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
            }}>
                <div>
                    <span style={{ color: '#FFD700', fontWeight: 'bold', letterSpacing: '1px' }}>OFFICIAL MERCH</span>
                    <h2 style={{ fontSize: '2.5rem', margin: '5px 0' }}>WEAR THE HYPE</h2>
                    <p style={{ color: '#aaa', margin: '0 0 20px 0' }}>Get the physical gear delivered to your door.</p>
                    <a href="https://merchboy.shop" target="_blank" rel="noreferrer" style={{ background: 'white', color: 'black', padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none' }}>
                        VISIT MERCH STORE ↗
                    </a>
                </div>
                <div style={{ fontSize: '5rem' }}>👕</div>
            </div>

            {/* ITEMS GRID */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '25px', maxWidth: '1200px', margin: '0 auto'
            }}>
                {filteredItems.map(item => {
                    const isUnlocked = shopState.unlocked.includes(item.id);
                    const isEquipped = shopState.equipped[item.category] === item.id;
                    const canAfford = coins >= item.price;

                    return (
                        <div key={item.id} className="bento-card" style={{
                            background: 'rgba(255,255,255,0.8)', padding: '25px',
                            border: isEquipped ? '2px solid #00FA9A' : '1px solid rgba(255,255,255,0.5)',
                            position: 'relative', overflow: 'hidden',
                            textAlign: 'center', color: '#333'
                        }}>
                            {/* STATUS BADGE */}
                            {isEquipped && (
                                <div style={{
                                    position: 'absolute', top: '15px', right: '15px',
                                    background: '#00FA9A', color: 'black', padding: '5px 10px',
                                    fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '10px', zIndex: 2
                                }}>EQUIPPED</div>
                            )}

                            {/* ITEM ICON */}
                            <div style={{ fontSize: '4rem', marginBottom: '15px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>
                                {item.icon}
                            </div>

                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#1a202c' }}>{item.name}</h3>
                            <p style={{ color: '#718096', margin: '0 0 20px 0', minHeight: '40px', fontSize: '0.9rem' }}>{item.description}</p>

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
                                        width: '100%', padding: '12px', borderRadius: '15px',
                                        background: isEquipped ? '#e2e8f0' : '#4f46e5',
                                        color: isEquipped ? '#a0aec0' : 'white',
                                        border: 'none', fontWeight: 'bold',
                                        cursor: isEquipped ? 'default' : 'pointer',
                                        opacity: isEquipped ? 0.7 : 1,
                                        boxShadow: isEquipped ? 'none' : '0 4px 10px rgba(79, 70, 229, 0.3)'
                                    }}
                                >
                                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                                </button>
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
                                        width: '100%', padding: '12px', borderRadius: '15px',
                                        background: canAfford ? '#FFD700' : '#cbd5e0',
                                        color: canAfford ? 'black' : '#fff',
                                        border: 'none', fontWeight: 'bold',
                                        cursor: canAfford ? 'pointer' : 'not-allowed',
                                        boxShadow: canAfford ? '0 4px 10px rgba(255, 215, 0, 0.4)' : 'none'
                                    }}
                                >
                                    BUY {item.price > 0 ? `${item.price} 🪙` : 'FREE'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Link to="/arcade" style={{ color: '#888', textDecoration: 'none' }}>← Back to Arcade</Link>
            </div>
        </div>
    );
};

export default ShopPage;
