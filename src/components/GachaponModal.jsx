import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { STICKER_COLLECTIONS } from '../config/StickerDefinitions';
import SquishyButton from './SquishyButton';

const GachaponModal = ({ onClose }) => {
    const { coins, buyCapsule, unlockedStickers } = useGamification();
    const [view, setView] = useState('MACHINE'); // MACHINE, ALBUM
    const [animationState, setAnimationState] = useState('IDLE'); // IDLE, SHAKING, OPENING, REVEAL
    const [reward, setReward] = useState(null);

    const handleSpin = () => {
        if (coins < 100) return;

        setAnimationState('SHAKING');
        setTimeout(() => {
            const item = buyCapsule();
            if (item) {
                setReward(item);
                setAnimationState('OPENING');
                setTimeout(() => setAnimationState('REVEAL'), 1000);
            } else {
                setAnimationState('IDLE'); // Failed (funds)
            }
        }, 1000);
    };

    const reset = () => {
        setReward(null);
        setAnimationState('IDLE');
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'legendary': return '#ff00ff'; // Neon Pink
            case 'epic': return '#a333c8'; // Purple
            case 'rare': return '#2185d0'; // Blue
            default: return '#767676'; // Grey
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 6000,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '800px', height: '80vh',
                border: '2px solid #ffcc00',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #444' }}>
                    <h2 style={{ margin: 0, color: '#ffcc00', fontFamily: '"Press Start 2P"' }}>GACHA-STATION</h2>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button onClick={() => setView('MACHINE')} style={{ background: 'none', border: 'none', color: view === 'MACHINE' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 'bold' }}>PLAY</button>
                        <button onClick={() => setView('ALBUM')} style={{ background: 'none', border: 'none', color: view === 'ALBUM' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 'bold' }}>ALBUM ({unlockedStickers.length})</button>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>X</button>
                    </div>
                </div>

                {/* CONTENT */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '20px' }}>

                    {view === 'ALBUM' && (
                        <div style={{ width: '100%' }}>
                            {STICKER_COLLECTIONS.map(col => {
                                const collectedCount = col.items.filter(i => unlockedStickers.includes(i.id)).length;
                                const isComplete = collectedCount === col.items.length;

                                return (
                                    <div key={col.id} style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 style={{ margin: 0, color: isComplete ? 'gold' : 'white' }}>{col.name} {isComplete && '👑'}</h3>
                                            <span style={{ color: '#aaa' }}>{collectedCount}/{col.items.length}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                            {col.items.map(item => {
                                                const isUnlocked = unlockedStickers.includes(item.id);
                                                return (
                                                    <div key={item.id} style={{
                                                        width: '80px', height: '100px',
                                                        background: isUnlocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
                                                        border: `2px solid ${isUnlocked ? getRarityColor(item.rarity) : '#333'}`,
                                                        borderRadius: '10px',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                        opacity: isUnlocked ? 1 : 0.3,
                                                        filter: isUnlocked ? 'none' : 'grayscale(100%)'
                                                    }}>
                                                        <div style={{ fontSize: '2.5rem', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '60px' }}>
                                                            {item.image ? <img src={item.image} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : item.icon}
                                                        </div>
                                                        <div style={{ fontSize: '0.6rem', textAlign: 'center', color: '#fff' }}>{item.name}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {view === 'MACHINE' && (
                        <div style={{ textAlign: 'center', position: 'relative' }}>
                            {animationState === 'REVEAL' && reward ? (
                                <div className="reveal-anim" style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                    <div style={{
                                        position: 'relative',
                                        background: `radial-gradient(circle, ${getRarityColor(reward.rarity)} 0%, #000 100%)`,
                                        padding: '50px', borderRadius: '50%',
                                        boxShadow: `0 0 50px ${getRarityColor(reward.rarity)}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '200px'
                                    }}>
                                        <div style={{ fontSize: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                            {reward.image ? <img src={reward.image} style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }} /> : reward.icon}
                                        </div>
                                    </div>
                                    <h2 style={{ marginTop: '20px', color: '#fff', textShadow: '0 0 10px white' }}>{reward.name}</h2>
                                    <div style={{
                                        color: getRarityColor(reward.rarity), textTransform: 'uppercase',
                                        fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '5px'
                                    }}>
                                        {reward.rarity}
                                    </div>
                                    <div style={{ marginTop: '30px' }}>
                                        <SquishyButton onClick={reset} style={{ marginRight: '10px' }}>GO AGAIN</SquishyButton>
                                        <SquishyButton onClick={() => setView('ALBUM')} style={{ background: '#333' }}>VIEW ALBUM</SquishyButton>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        fontSize: '10rem', marginBottom: '20px',
                                        animation: animationState === 'SHAKING' ? 'shake 0.5s infinite' : 'float 3s infinite ease-in-out'
                                    }}>
                                        🔮
                                    </div>

                                    {animationState === 'SHAKING' || animationState === 'OPENING' ? (
                                        <div style={{ color: 'gold', fontSize: '1.5rem', fontWeight: 'bold' }}>DISPENSING...</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ background: '#333', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ color: '#aaa' }}>BALANCE:</span>
                                                <span style={{ color: 'gold', fontWeight: 'bold' }}>{coins} 🪙</span>
                                            </div>
                                            <SquishyButton
                                                onClick={handleSpin}
                                                disabled={coins < 100}
                                                style={{
                                                    padding: '20px 50px', fontSize: '1.2rem',
                                                    background: coins >= 100 ? 'linear-gradient(45deg, #ff00cc, #333399)' : '#555',
                                                    opacity: coins >= 100 ? 1 : 0.5
                                                }}
                                            >
                                                INSERT 100 🪙
                                            </SquishyButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GachaponModal;
