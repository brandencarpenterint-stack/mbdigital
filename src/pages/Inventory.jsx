import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
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
};

const FISH_DATA_MAP = {
    // Just a sample mapping so we can know sheet coords. In real app, we'd export this from CrazyFishing.
    // We'll rely on the metadata passed during capture!
};

const Inventory = () => {
    const { shopState, userProfile } = useGamification();
    const { playBeep, playClick } = useRetroSound();
    
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
                                <TiltCard className="bento-card" style={{ cursor: 'pointer', transition: 'all 0.2s', 
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
        </div>
    );
};

export default Inventory;
