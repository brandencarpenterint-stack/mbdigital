import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useToast } from '../context/ToastContext';
import { SHOP_ITEMS } from '../config/ShopItems';
import { DECOR_ITEMS } from '../config/DecorItems';
import UndergroundModal from './UndergroundModal';

const PET_ITEMS = [
    { id: 'sushi', name: 'Premium Sushi', price: 50, icon: '🍣', effect: { hunger: 40, happy: 20, xp: 50 }, desc: 'Top tier food.' },
    { id: 'coffee', name: 'Espresso', price: 25, icon: '☕', effect: { energy: 50, wake: true, effect: 'jitter' }, desc: 'Wakes Bro up instantly!' },
    { id: 'chili', name: 'Ghost Pepper', price: 40, icon: '🌶️', effect: { hunger: 10, happy: -5, speed: true, effect: 'zoom' }, desc: 'ZOOMIES!!!' },
    { id: 'radio', name: 'Boombox', price: 75, icon: '📻', effect: { happy: 40, effect: 'dance' }, desc: 'Dance party time.' },
    { id: 'gold_apple', name: 'Golden Apple', price: 200, icon: '🍎', effect: { full: true, effect: 'shine' }, desc: 'Fully restores everything.' },
    { id: 'soap', name: 'Mystic Soap', price: 15, icon: '🧼', effect: { clean: true }, desc: 'Instantly destroys messes.' },
    { id: 'toy', name: 'Bouncy Ball', price: 100, icon: '🎾', effect: { happy: 50, xp: 100 }, desc: 'HUGE happiness boost!' },
];

const SKIN_ITEMS = [
    { id: 'bro_egg', name: 'Baby Face', price: 0, icon: '👶', desc: 'Return to innocence.' },
    { id: 'pb_cyber', name: 'Cyber Bro', price: 1000, icon: '🤖', desc: 'Digital assimilation.' },
    { id: 'pb_gold', name: 'Golden Bro', price: 5000, icon: '👑', desc: 'Pure luxury.' },
    { id: 'pb_party', name: 'Party Bro', price: 500, icon: '🎉', desc: 'Always bouncing.' }
];

const PetShopModal = ({ onClose }) => {
    // Destructure everything we need, including new exports from GamificationContext
    const { coins, spendCoins, triggerConfetti, shopState, buyItem: buyGItem, equipItem: equipGItem } = useGamification();
    const { feed, play, clean, sleep, triggerEffect, unlockDecor, equipDecor, stats } = usePocketBro();
    const { showToast } = useToast();
    const [tab, setTab] = useState('supplies'); // 'supplies', 'decor', 'skins'
    const [showUnderground, setShowUnderground] = useState(false);

    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour <= 4;

    const buyItem = (item) => {
        if (!spendCoins) {
            console.error("spendCoins function not found in context!");
            return;
        }

        if (spendCoins(item.price)) {
            // Apply Effects
            if (item.effect.clean) {
                clean();
                showToast("Squeaky Clean! ✨", "success");
            }

            if (item.effect.wake) {
                sleep(); // Toggle sleep logic
                triggerEffect('jitter');
            }

            if (item.effect.full) {
                feed(100);
                play(100);
                clean();
                triggerEffect('shine');
            }

            if (item.effect.effect) {
                triggerEffect(item.effect.effect);
            }

            if (item.effect.hunger) feed(item.effect.hunger);
            if (item.effect.happy) play(item.effect.happy);

            showToast(`Bought ${item.name}`, "shop");
        } else {
            // spendCoins handles the toast usually, but duplicate here is safer than none
            // showToast("Not enough coins!", "error");
        }
    };

    const handleDecorAction = (item) => {
        const isUnlocked = (stats.unlockedDecor || []).includes(item.id);

        // FURNITURE LOGIC (Grid Items)
        if (item.type === 'furniture') {
            if (isUnlocked) {
                showToast("Use 'Edit Room' button to place!", "info");
                return;
            }
            if (spendCoins(item.price)) {
                unlockDecor(item.id);
                showToast(`Bought ${item.name}!`, "success");
                if (triggerConfetti) triggerConfetti();
            }
            return;
        }

        // STANDARD DECOR LOGIC (Equip Slots)
        const isEquipped = stats.decor[item.type] === item.id;

        if (isEquipped) {
            // Unequip
            equipDecor(item.type, null);
            showToast("Unequipped!", "success");
            return;
        }

        if (isUnlocked) {
            equipDecor(item.type, item.id);
            showToast("Equipped!", "success");
        } else {
            // Buy
            if (spendCoins(item.price)) {
                unlockDecor(item.id);
                equipDecor(item.type, item.id); // Auto-equip
                showToast(`Bought ${item.name}!`, "success");
                if (triggerConfetti) triggerConfetti();
            }
        }
    };

    const handleSkinAction = (item) => {
        const isUnlocked = shopState.unlocked.includes(item.id) || item.price === 0;
        const isEquipped = shopState.equipped.pocketbro === item.id;

        if (isEquipped) {
            showToast("Already wearing this!", "info");
            return;
        }

        if (isUnlocked) {
            equipGItem('pocketbro', item.id);
            showToast("Costume changed!", "success");
            if (triggerConfetti) triggerConfetti();
        } else {
            // Buy using Gamification System
            if (buyGItem(item)) {
                equipGItem('pocketbro', item.id);
                // buyItem handles toast/coins
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 7000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '400px',
                padding: '20px',
                border: '1px solid var(--neon-blue)',
                boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)',
                position: 'relative',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'
                    }}
                >✕</button>

                <h2 style={{ textAlign: 'center', color: 'var(--neon-blue)', marginTop: 0, marginBottom: '20px' }}>
                    POCKET SHOP
                </h2>

                {/* TABS */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    <button onClick={() => setTab('supplies')} style={{ flex: 1, padding: '8px', background: tab === 'supplies' ? 'var(--neon-blue)' : '#333', color: tab === 'supplies' ? 'black' : '#888', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>SUPPLIES</button>
                    <button onClick={() => setTab('decor')} style={{ flex: 1, padding: '8px', background: tab === 'decor' ? '#d53f8c' : '#333', color: tab === 'decor' ? 'white' : '#888', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>DECOR</button>
                    <button onClick={() => setTab('skins')} style={{ flex: 1, padding: '8px', background: tab === 'skins' ? 'gold' : '#333', color: tab === 'skins' ? 'black' : '#888', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>SKINS</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: 'gold', fontWeight: 'bold' }}>
                    BALANCE: {coins} 🪙
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>

                    {/* SUPPLIES TAB */}
                    {tab === 'supplies' && PET_ITEMS.map(item => (
                        <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{item.desc}</div>
                            </div>
                            <button onClick={() => buyItem(item)} style={{ background: '#333', color: 'gold', border: '1px solid gold', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}>{item.price} 🪙</button>
                        </div>
                    ))}

                    {/* DECOR TAB */}
                    {tab === 'decor' && DECOR_ITEMS.map(item => {
                        const isUnlocked = (stats.unlockedDecor || []).includes(item.id);
                        const isEquipped = stats.decor && stats.decor[item.type] === item.id;
                        return (
                            <div key={item.id} style={{ background: isEquipped ? 'rgba(213, 63, 140, 0.2)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: isEquipped ? '1px solid #d53f8c' : '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', color: isEquipped ? '#d53f8c' : '#fff' }}>{item.name} {isEquipped && '(ON)'}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{item.desc}</div>
                                </div>
                                <button onClick={() => handleDecorAction(item)} style={{ background: isUnlocked ? (isEquipped ? '#d53f8c' : '#333') : '#333', color: isUnlocked ? (isEquipped ? 'white' : '#fff') : 'gold', border: isUnlocked ? (isEquipped ? '1px solid white' : '1px solid #fff') : '1px solid gold', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', minWidth: '80px' }}>
                                    {item.type === 'furniture'
                                        ? (isUnlocked ? 'OWNED' : `${item.price} 🪙`)
                                        : (isUnlocked ? (isEquipped ? 'UNEQUIP' : 'EQUIP') : `${item.price} 🪙`)
                                    }
                                </button>
                            </div>
                        );
                    })}

                    {/* SKINS TAB */}
                    {tab === 'skins' && SHOP_ITEMS.filter(i => i.category === 'pocketbro').map(item => {
                        const isUnlocked = shopState.unlocked.includes(item.id) || item.price === 0;
                        const isEquipped = shopState.equipped.pocketbro === item.id;
                        return (
                            <div key={item.id} style={{ background: isEquipped ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: isEquipped ? '1px solid gold' : '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', color: isEquipped ? 'gold' : '#fff' }}>{item.name} {isEquipped && '(ON)'}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{item.description}</div>
                                </div>
                                <button onClick={() => handleSkinAction(item)} style={{ background: isUnlocked ? (isEquipped ? 'gold' : '#333') : '#333', color: isUnlocked ? (isEquipped ? 'black' : '#fff') : 'gold', border: isUnlocked ? (isEquipped ? '1px solid white' : '1px solid #fff') : '1px solid gold', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', minWidth: '80px' }}>{isUnlocked ? (isEquipped ? 'WEARING' : 'WEAR') : `${item.price} 🪙`}</button>
                            </div>
                        );
                    })}
                </div>

                {/* SECRET ENTRY */}
                {isNight && (
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button onClick={() => setShowUnderground(true)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: '0.8rem', animation: 'glitch 1s infinite' }}>👁️</button>
                    </div>
                )}
            </div>

            {showUnderground && <UndergroundModal onClose={() => setShowUnderground(false)} />}

            <style>{`
                @keyframes glitch {
                    0% { opacity: 1; transform: translate(0); }
                    20% { opacity: 0.8; transform: translate(-2px, 2px); }
                    40% { opacity: 1; transform: translate(2px, -2px); }
                    60% { opacity: 0.5; transform: translate(0); }
                    80% { opacity: 1; transform: translate(-1px, 1px); color: red; }
                    100% { opacity: 1; transform: translate(0); }
                }
            `}</style>
        </div >
    );
};

export default PetShopModal;
