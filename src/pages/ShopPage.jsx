import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { SHOP_ITEMS, CATEGORIES } from '../config/ShopItems';

const ShopPage = () => {
    const { shopState, buyItem, equipItem } = useGamification() || {};
    const [activeCategory, setActiveCategory] = useState('fishing');
    const [coins, setCoins] = useState(0);

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
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: '3rem', margin: '0 0 10px 0',
                    color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                }}>GLOBAL SHOP</h1>
                <div style={{
                    fontSize: '1.5rem', background: '#333', display: 'inline-block',
                    padding: '10px 30px', borderRadius: '50px', border: '2px solid #FFD700'
                }}>
                    🪙 {coins} COINS
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{
                            padding: '12px 25px', borderRadius: '15px', border: 'none',
                            background: activeCategory === cat.id ? '#FFD700' : '#1a1a2e',
                            color: activeCategory === cat.id ? 'black' : 'white',
                            fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            transition: 'all 0.2s',
                            boxShadow: activeCategory === cat.id ? '0 0 15px rgba(255,215,0,0.4)' : 'none'
                        }}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </button>
                ))}
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
                        <div key={item.id} style={{
                            background: '#161625', borderRadius: '20px', padding: '25px',
                            border: isEquipped ? '2px solid #00FA9A' : '1px solid #333',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: isEquipped ? '0 0 20px rgba(0, 250, 154, 0.2)' : '0 10px 30px rgba(0,0,0,0.3)'
                        }}>
                            {/* STATUS BADGE */}
                            {isEquipped && (
                                <div style={{
                                    position: 'absolute', top: '15px', right: '15px',
                                    background: '#00FA9A', color: 'black', padding: '5px 10px',
                                    fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '10px'
                                }}>EQUIPPED</div>
                            )}

                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{item.name}</h3>
                            <p style={{ color: '#888', margin: '0 0 20px 0', minHeight: '40px' }}>{item.description}</p>

                            {/* ACTION BUTTON */}
                            {isUnlocked ? (
                                <button
                                    onClick={() => equipItem(item.category, item.id)}
                                    disabled={isEquipped}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '10px',
                                        background: isEquipped ? '#1a1a2e' : '#6A5ACD',
                                        color: isEquipped ? '#555' : 'white',
                                        border: 'none', fontWeight: 'bold',
                                        cursor: isEquipped ? 'default' : 'pointer',
                                        opacity: isEquipped ? 0.7 : 1
                                    }}
                                >
                                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => buyItem(item)}
                                    disabled={!canAfford}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '10px',
                                        background: canAfford ? '#FFD700' : '#333',
                                        color: canAfford ? 'black' : '#888',
                                        border: 'none', fontWeight: 'bold',
                                        cursor: canAfford ? 'pointer' : 'not-allowed'
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
