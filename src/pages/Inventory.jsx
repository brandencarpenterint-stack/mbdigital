import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { triggerConfetti } from '../utils/confetti';
import TiltCard from '../components/TiltCard';
import SquishyButton from '../components/SquishyButton';
import StickerSprite from '../components/StickerSprite';
import useRetroSound from '../hooks/useRetroSound';

// Quick ref to fish sheets so we can draw them in inventory
const FISH_SHEETS = {
    surface: '/assets/fishing/fishing_surface.png',
    coral: '/assets/fishing/fishing_coral.png',
    deep: '/assets/fishing/fishing_deep.png',
    void: '/assets/fishing/fishing_void.png',
    seagrass: '/assets/fishing/fishing_seagrass.png',
    abyss: '/assets/fishing/fishing_abyss.png',
    boneyard: '/assets/fishing/fishing_boneyard.png',
    ether: '/assets/fishing/fishing_ether.png',
    frozen: '/assets/fishing/fishing_frozen.png',
    magma: '/assets/fishing/fishing_magma.png',
    neon: '/assets/fishing/fishing_neon.png',
    twilight: '/assets/fishing/fishing_twilight.png',
};

const FISH_DATA_MAP = {
    // Just a sample mapping so we can know sheet coords. In real app, we'd export this from CrazyFishing.
    // We'll rely on the metadata passed during capture!
};

const Inventory = () => {
    const { shopState, userProfile, removeInventoryItem } = useGamification();
    const pocketBro = usePocketBro();
    const { playBeep, playClick, playCoin } = useRetroSound();
    
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Inventory format: { [itemId]: [ { id: 'uid', type: 'fish', metadata: { ... } } ] }
    const inventory = shopState?.inventory || {};
    
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, FISH, STICKERS, GEAR
    
    // Flatten inventory
    const allItems = [];
    Object.keys(inventory).forEach(itemId => {
        inventory[itemId].forEach(instance => {
            allItems.push({
                baseId: itemId,
                ...instance
            });
        });
    });
    
        // Add stickers from unlocked!
    const unlocked = shopState?.unlocked || [];
    unlocked.forEach((id, idx) => {
        if (id.startsWith('sticker_')) {
            allItems.push({
                id: 'unlocked_' + id + '_' + idx, // unique key
                baseId: id,
                type: 'sticker',
                metadata: {
                    name: id.replace('sticker_', '').replace(/_/g, ' ').toUpperCase()
                }
            });
        } else if (id.startsWith('lure_') || id.startsWith('boat_') || id.startsWith('rod_')) {
            allItems.push({
                id: 'unlocked_' + id + '_' + idx,
                baseId: id,
                type: 'gear',
                metadata: {
                    name: id.replace(/_/g, ' ').toUpperCase(),
                    emoji: id.includes('rod') ? '🎣' : (id.includes('boat') ? '🛥️' : '🪱')
                }
            });
        }
    });
    const filteredItems = allItems.filter(item => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'FISH' && item.type === 'fish') return true;
        if (activeTab === 'STICKERS' && item.type === 'sticker') return true;
        if (activeTab === 'GEAR' && item.type === 'gear') return true;
        return false;
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '120px' }}>
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                    fontSize: '3rem', margin: '0 0 20px 0', 
                    background: 'linear-gradient(to right, #00ffcc, #ff00ff)', 
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(0,255,204,0.3)',
                    textAlign: 'center'
                }}
            >
                THE VAULT
            </motion.h1>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {['ALL', 'FISH', 'STICKERS', 'GEAR'].map(tab => (
                    <SquishyButton 
                        key={tab} 
                        onClick={() => { setActiveTab(tab); playClick(); }}
                        style={{ 
                            background: activeTab === tab ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)',
                            color: activeTab === tab ? 'black' : 'white',
                            border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        {tab}
                    </SquishyButton>
                ))}
            </div>

            {/* INVENTORY GRID */}
            {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888', fontStyle: 'italic' }}>
                    YOUR VAULT IS EMPTY. GO PLAY SOME GAMES!
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                    gap: '20px' 
                }}>
                    <AnimatePresence>
                        {filteredItems.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onMouseEnter={playBeep}
                            >
                                <TiltCard onClick={() => { setSelectedItem(item); playClick(); }}
                                className="bento-card" style={{ cursor: 'pointer', transition: 'all 0.2s', 
                                    background: 'rgba(20,20,30,0.8)', 
                                    border: '1px solid #333', 
                                    padding: '15px', 
                                    display: 'flex', flexDirection: 'column', 
                                    alignItems: 'center', justifyContent: 'center',
                                    height: '150px'
                                }}>
                                    {item.type === 'fish' ? (
                                        item.metadata?.sheet ? (
                                            <div style={{
                                                width: '64px', height: '64px',
                                                backgroundImage: `url(${FISH_SHEETS[item.metadata.sheet]})`,
                                                backgroundSize: '400% 400%',
                                                backgroundPosition: `${(item.metadata.col || 0) * 33.33}% ${(item.metadata.row || 0) * 33.33}%`,
                                                imageRendering: 'pixelated'
                                            }} />
                                        ) : (
                                            <div style={{ fontSize: '3rem' }}>{item.metadata?.emoji || '❓'}</div>
                                        )
                                    ) : item.type === 'sticker' ? (
                                        <StickerSprite sticker={item.baseId} size={64} />
                                    ) : (
                                        <div style={{ fontSize: '3rem' }}>{item.metadata?.emoji || '📦'}</div>
                                    )}
                                    <div style={{ marginTop: '10px', fontSize: '0.8rem', fontWeight: 'bold', color: '#00ffcc', textAlign: 'center' }}>
                                        {item.metadata?.name || item.baseId}
                                    </div>
                                    {item.metadata?.weight && (
                                        <div style={{ fontSize: '0.6rem', color: '#888' }}>
                                            {item.metadata.weight} lbs
                                        </div>
                                    )}
                                </TiltCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* ITEM MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 2000,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setSelectedItem(null)}>
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel"
                            style={{
                                background: 'rgba(20,20,30,0.95)', border: '2px solid var(--neon-blue)',
                                padding: '30px', borderRadius: '20px', textAlign: 'center',
                                width: '90%', maxWidth: '400px',
                                boxShadow: '0 0 50px rgba(0, 255, 204, 0.2)'
                            }}
                        >
                            <h2 style={{ color: 'var(--neon-blue)', marginTop: 0 }}>
                                {selectedItem.metadata?.name || selectedItem.baseId}
                            </h2>
                            
                            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
                                {selectedItem.type === 'fish' ? (
                                    selectedItem.metadata?.sheet ? (
                                        <div style={{
                                            width: '128px', height: '128px',
                                            backgroundImage: `url(${FISH_SHEETS[selectedItem.metadata.sheet]})`,
                                            backgroundSize: '400% 400%',
                                            backgroundPosition: `${(selectedItem.metadata.col || 0) * 33.33}% ${(selectedItem.metadata.row || 0) * 33.33}%`,
                                            imageRendering: 'pixelated'
                                        }} />
                                    ) : (
                                        <div style={{ fontSize: '5rem' }}>{selectedItem.metadata?.emoji || '❓'}</div>
                                    )
                                ) : selectedItem.type === 'sticker' ? (
                                    <StickerSprite sticker={selectedItem.baseId} size={128} />
                                ) : (
                                    <div style={{ fontSize: '5rem' }}>{selectedItem.metadata?.emoji || '📦'}</div>
                                )}
                            </div>

                            {selectedItem.type === 'fish' && (
                                <p style={{ color: '#aaa', marginBottom: '20px' }}>
                                    Weight: <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedItem.metadata?.weight} lbs</span>
                                </p>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedItem.type === 'fish' && pocketBro && (
                                    <SquishyButton 
                                        onClick={() => {
                                            // FEED LOGIC
                                            if (removeInventoryItem) {
                                                removeInventoryItem(selectedItem.baseId, selectedItem.id);
                                            }
                                            pocketBro.feed(Math.max(10, selectedItem.metadata?.weight || 10));
                                            pocketBro.triggerEffect('heart');
                                            pocketBro.debugUpdate({ xp: (pocketBro.stats?.xp || 0) + Math.floor(selectedItem.metadata?.weight || 10) * 10 });
                                            
                                            playCoin();
                                            triggerConfetti();
                                            setSelectedItem(null);
                                        }}
                                        style={{ background: '#ff0055', color: 'white', fontWeight: 'bold' }}
                                    >
                                        🍗 FEED TO POCKET BRO
                                    </SquishyButton>
                                )}
                                
                                <SquishyButton 
                                    onClick={() => setSelectedItem(null)}
                                    style={{ background: '#333', color: 'white' }}
                                >
                                    CLOSE
                                </SquishyButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
