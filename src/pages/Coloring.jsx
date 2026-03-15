import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import ColoringCanvas from '../components/ColoringCanvas';
import SquishyButton from '../components/SquishyButton';
import { triggerConfetti } from '../utils/confetti';
import useRetroSound from '../hooks/useRetroSound';

const TEMPLATES = [
    { id: 2, src: '/assets/skins/face_bear.png', title: 'Bear Face', cost: 0 },
    { id: 3, src: '/assets/skins/face_bunny.png', title: 'Bunny Face', cost: 0 },
    { id: 4, src: '/assets/skins/face_hoodie.png', title: 'Hoodie Kid', cost: 0 },
    { id: 5, src: '/assets/skins/logo_main.png', title: 'Main Logo', cost: 0 },
    { id: 6, src: '/assets/skins/face_default.png', title: 'Standard', cost: 0 },
    { id: 9, src: '/assets/skins/face_bunny_blue.png', title: 'Blue Bunny', cost: 0 },
    { id: 10, src: '/assets/skins/face_standard_bw.png', title: 'Standard BW', cost: 0 },
    { id: 11, src: '/assets/coloring/scene_1.jpg', title: 'Hike Adventures', type: 'time', unlockTime: 5 },
    { id: 12, src: '/assets/coloring/scene_2.jpg', title: 'Merch Market', type: 'time', unlockTime: 10 },
    { id: 13, src: '/assets/coloring/scene_3.png', title: 'Campfire', type: 'time', unlockTime: 30 },
    { id: 14, src: '/assets/coloring/scene_4.png', title: 'Live Concert', type: 'time', unlockTime: 60 },
    { id: 15, src: '/assets/coloring/scene_5.jpg', title: 'Surf Session', type: 'time', unlockTime: 90 },
    { id: 16, src: '/assets/coloring/scene_6.jpg', title: 'Trick or Treat', type: 'time', unlockTime: 120 },
    { id: 17, src: '/assets/coloring/scene_7.jpg', title: 'Snowman Building', type: 'time', unlockTime: 150 },
    { id: 18, src: '/assets/coloring/scene_8.jpg', title: 'Lemonade Stand', cost: 500 },
    { id: 19, src: '/assets/coloring/scene_9.jpg', title: 'Moon Walk', type: 'time', unlockTime: 180 },
    { id: 20, src: '/assets/coloring/scene_10.jpg', title: 'Pirate Ship', cost: 500 },
    { id: 21, src: '/assets/coloring/scene_11.jpg', title: 'Campfire Time', type: 'time', unlockTime: 210 },
    { id: 22, src: '/assets/coloring/scene_12.jpg', title: 'Hot Air Balloon', cost: 500 },
    { id: 23, src: '/assets/coloring/scene_13.jpg', title: 'Superheroes', type: 'time', unlockTime: 240 },
    { id: 24, src: '/assets/coloring/scene_14.jpg', title: 'Scuba Diving', cost: 500 },
    { id: 25, src: '/assets/coloring/scene_15.jpg', title: 'Baking Cookies', type: 'time', unlockTime: 270 },
    { id: 26, src: '/assets/coloring/scene_6.png', title: 'Noodle Shop', type: 'time', unlockTime: 300 },
    { id: 27, src: '/assets/coloring/scene_7.png', title: 'Space Exploration', type: 'time', unlockTime: 330 },
    { id: 28, src: '/assets/coloring/scene_8.png', title: 'Skatepark', type: 'time', unlockTime: 360 },
    { id: 29, src: '/assets/coloring/scene_9.jpg', title: 'Farm Harvest', type: 'time', unlockTime: 390 },
    { id: 30, src: '/assets/coloring/scene_10.jpg', title: 'Aquarium', type: 'time', unlockTime: 420 },
];

const Coloring = () => {
    const [coins, setCoins] = useState(0);
    const [purchased, setPurchased] = useState(JSON.parse(localStorage.getItem('unlockedColoringPages')) || [1]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const { stats } = useGamification();
    const { showToast } = useToast();
    const playTimeMins = Math.floor((stats?.playTimeSeconds || 0) / 60);

    const { playCollect, playWin, playBeep } = useRetroSound();

    const [hasPremiumStamps, setHasPremiumStamps] = useState(localStorage.getItem('unlockedColoringStamps') === 'true');

    useEffect(() => {
        const handleStorageChange = () => {
            const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
            setCoins(currentCoins);
        };
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(handleStorageChange, 1000);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handlePurchaseStamps = () => {
        if (coins >= 2500) {
            const newCoins = coins - 2500;
            localStorage.setItem('arcadeCoins', newCoins);
            setCoins(newCoins);
            localStorage.setItem('unlockedColoringStamps', 'true');
            setHasPremiumStamps(true);
            playWin();
            triggerConfetti();
        } else {
            alert("Insufficient Funds!");
            playBeep();
        }
    };

    const handleSelect = (template) => {
        let isOwned = purchased.includes(template.id);
        if (template.type === 'time' && playTimeMins >= template.unlockTime) {
            isOwned = true;
        }

        if (isOwned) {
            setSelectedTemplate(template);
            playBeep();
        } else {
            if (template.type === 'time') {
                showToast(`Play ${template.unlockTime - playTimeMins} more mins to unlock!`, "info");
                playBeep(); // Maybe play error sound instead, but beep is fine
            } else {
                setPreviewTemplate(template);
                playBeep();
            }
        }
    };

    const handlePurchase = () => {
        if (!previewTemplate) return;

        if (coins >= previewTemplate.cost) {
            const newCoins = coins - previewTemplate.cost;
            localStorage.setItem('arcadeCoins', newCoins);
            setCoins(newCoins);

            const newPurchased = [...purchased, previewTemplate.id];
            setPurchased(newPurchased);
            localStorage.setItem('unlockedColoringPages', JSON.stringify(newPurchased));

            playWin();
            triggerConfetti();
            setPreviewTemplate(null);
        } else {
            alert("Insufficient Funds!");
        }
    };

    return (
        <div className="page-enter" style={{
            textAlign: 'center',
            minHeight: '100vh',
            fontFamily: '"Orbitron", sans-serif',
            background: 'linear-gradient(to bottom, #1a0b2e, #000)',
            paddingBottom: '150px'
        }}>
            {!selectedTemplate ? (
                <div>
                    {/* Header */}
                    <div style={{ padding: '20px', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--neon-pink)', textShadow: '0 0 10px var(--neon-pink)', margin: 0 }}>COLORING STUDIO</h2>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
                                WALLET: <span style={{ color: 'var(--neon-gold)', fontWeight: 'bold' }}>{coins.toLocaleString()} 🪙</span>
                            </p>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
                                PLAY TIME: <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>{playTimeMins} MINS ⏱️</span>
                            </p>
                        </div>
                    </div>

                    {!hasPremiumStamps && (
                        <div style={{ maxWidth: '1000px', margin: '0 auto 30px auto', padding: '0 20px' }}>
                            <div className="glass-panel" style={{
                                padding: '20px',
                                border: '2px solid var(--neon-gold)',
                                background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(0, 0, 0, 0.5))',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                <div style={{ textAlign: 'left', flex: 1, minWidth: '250px' }}>
                                    <h3 style={{ margin: 0, color: 'var(--neon-gold)', fontSize: '1.5rem', textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>⭐ PREMIUM STAMP PACK</h3>
                                    <p style={{ margin: '5px 0 0 0', color: '#ccc', fontSize: '0.9rem' }}>Unlock 50+ custom adorable stamps for your masterpieces! Aliens, dinosaurs, magical items, and more!</p>
                                </div>
                                <SquishyButton onClick={handlePurchaseStamps} style={{
                                    background: 'var(--neon-gold)',
                                    color: 'black',
                                    border: 'none',
                                    padding: '10px 30px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    borderRadius: '50px',
                                    boxShadow: '0 0 20px rgba(255,215,0,0.4)',
                                    display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap'
                                }}>
                                    UNLOCK 🪙 2500
                                </SquishyButton>
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '20px',
                        padding: '0 20px',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {TEMPLATES.map(template => {
                            let isOwned = purchased.includes(template.id);
                            if (template.type === 'time' && playTimeMins >= template.unlockTime) {
                                isOwned = true;
                            }
                            
                            return (
                                <div
                                    key={template.id}
                                    onClick={() => handleSelect(template)}
                                    className="glass-panel"
                                    style={{
                                        border: isOwned ? '1px solid var(--neon-green)' : '1px solid #333',
                                        padding: '15px',
                                        cursor: 'pointer',
                                        opacity: isOwned ? 1 : 0.7,
                                        transition: 'transform 0.2s',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isOwned ? 'rgba(0, 255, 170, 0.05)' : 'rgba(0,0,0,0.3)'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {!isOwned && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px', right: '10px',
                                            fontSize: '1.5rem',
                                            zIndex: 10
                                        }}>
                                            🔒
                                        </div>
                                    )}
                                    <div style={{ background: 'white', borderRadius: '8px', padding: '5px', width: '100%' }}>
                                        <img
                                            src={template.src}
                                            alt={template.title}
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                objectFit: 'contain',
                                                filter: isOwned ? 'none' : 'grayscale(100%) opacity(0.5)'
                                            }}
                                        />
                                    </div>
                                    <div style={{ marginTop: '15px', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>
                                        {template.title.toUpperCase()}
                                    </div>
                                    <div style={{
                                        color: isOwned ? 'var(--neon-green)' : (template.type === 'time' ? 'var(--neon-blue)' : 'var(--neon-gold)'),
                                        marginTop: '5px', fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {isOwned ? 'OWNED' : (template.type === 'time' ? `⏱️ ${template.unlockTime} MINS` : `🪙 ${template.cost}`)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 20px auto' }}>
                        <SquishyButton onClick={() => setSelectedTemplate(null)} style={{
                            padding: '10px 20px',
                            background: '#333',
                            color: 'white',
                            border: '1px solid #555',
                            fontSize: '0.9rem'
                        }}>
                            ⬅ BACK TO GALLERY
                        </SquishyButton>
                        <div style={{ color: '#888' }}>
                            EDITING: <span style={{ color: 'white' }}>{selectedTemplate.title.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px', display: 'inline-block', maxWidth: '100%' }}>
                        <ColoringCanvas templateImage={selectedTemplate.src} hasPremiumStamps={hasPremiumStamps} />
                    </div>
                </div>
            )}

            {/* PURCHASE MODAL */}
            {previewTemplate && !selectedTemplate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.9)', zIndex: 2000,
                    backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{
                        padding: '40px',
                        border: '1px solid var(--neon-gold)',
                        textAlign: 'center',
                        maxWidth: '400px',
                        boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
                    }}>
                        <h2 style={{ color: 'var(--neon-gold)', margin: 0, fontSize: '1.5rem' }}>UNLOCK TEMPLATE?</h2>
                        <div style={{ background: 'white', borderRadius: '10px', padding: '10px', margin: '20px 0' }}>
                            <img src={previewTemplate.src} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
                        </div>
                        <p style={{ fontSize: '1.2rem', color: 'white', margin: '20px 0' }}>COST: <strong style={{ color: 'var(--neon-gold)' }}>{previewTemplate.cost} COINS</strong></p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <SquishyButton onClick={handlePurchase} style={{
                                background: 'var(--neon-gold)', color: 'black', border: 'none', padding: '15px 40px', fontWeight: 'bold', fontSize: '1.1rem'
                            }}>
                                UNLOCK
                            </SquishyButton>
                            <button onClick={() => setPreviewTemplate(null)} style={{
                                background: 'transparent', color: '#888', border: '1px solid #555', padding: '10px 30px', borderRadius: '20px', cursor: 'pointer'
                            }}>
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coloring;
