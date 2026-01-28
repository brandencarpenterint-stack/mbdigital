import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ColoringCanvas from '../components/ColoringCanvas';
import SquishyButton from '../components/SquishyButton';
import { triggerConfetti } from '../utils/confetti';
import useRetroSound from '../hooks/useRetroSound';

const TEMPLATES = [
    { id: 1, src: '/assets/coloring-page-1.png', title: 'Start', cost: 0 },
    { id: 2, src: '/assets/coloring-page-2.png', title: 'Boy', cost: 100 },
    { id: 3, src: '/assets/coloring-page-3.png', title: 'Brokid', cost: 100 },
    { id: 4, src: '/assets/coloring-page-4.png', title: 'Love', cost: 100 },
    { id: 5, src: '/assets/coloring-page-5.png', title: 'Family', cost: 100 },
];

const Coloring = () => {
    const [coins, setCoins] = useState(0);
    const [purchased, setPurchased] = useState(JSON.parse(localStorage.getItem('unlockedColoringPages')) || [1]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null); // For purchase modal

    const { playCollect, playWin, playBeep } = useRetroSound();

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

    const handleSelect = (template) => {
        if (purchased.includes(template.id)) {
            setSelectedTemplate(template);
            playBeep();
        } else {
            setPreviewTemplate(template);
            playBeep();
        }
    };

    const handlePurchase = () => {
        if (!previewTemplate) return;

        if (coins >= previewTemplate.cost) {
            // Deduct Coins
            const newCoins = coins - previewTemplate.cost;
            localStorage.setItem('arcadeCoins', newCoins);
            setCoins(newCoins);

            // Unlock Page
            const newPurchased = [...purchased, previewTemplate.id];
            setPurchased(newPurchased);
            localStorage.setItem('unlockedColoringPages', JSON.stringify(newPurchased));

            // Success
            alert(`Unlocked ${previewTemplate.title}!`);
            playWin();
            triggerConfetti();

            setPreviewTemplate(null);
            // Optionally auto-open?
        } else {
            alert("Not enough coins! Go play some games!");
        }
    };

    const handleBack = () => {
        setSelectedTemplate(null);
    };

    return (
        <div className="page-enter" style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '50px' }}>
            <h2 style={{ color: 'var(--primary-color)' }}>Coloring Studio</h2>
            <p style={{ color: 'var(--text-color)' }}>
                Current Arcade Coins: <span style={{ color: 'gold', fontWeight: 'bold' }}>{coins}</span>
            </p>

            {!selectedTemplate ? (
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ marginBottom: '30px' }}>Select a Page</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        padding: '0 40px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {TEMPLATES.map(template => {
                            const isOwned = purchased.includes(template.id);
                            return (
                                <div
                                    key={template.id}
                                    onClick={() => handleSelect(template)}
                                    style={{
                                        border: `4px solid ${isOwned ? 'var(--secondary-color)' : '#333'}`,
                                        borderRadius: '15px',
                                        padding: '10px',
                                        backgroundColor: isOwned ? '#222' : '#111',
                                        cursor: 'pointer',
                                        opacity: isOwned ? 1 : 0.8,
                                        transition: 'transform 0.2s',
                                        position: 'relative',
                                        minHeight: '250px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {!isOwned && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px', right: '10px',
                                            fontSize: '1.5rem'
                                        }}>
                                            🔒
                                        </div>
                                    )}
                                    <img
                                        src={template.src}
                                        alt={template.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'contain',
                                            filter: isOwned ? 'none' : 'grayscale(100%)',
                                            backgroundColor: 'white',
                                            borderRadius: '10px'
                                        }}
                                    />
                                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                                        {template.title}
                                    </div>
                                    <div style={{
                                        color: isOwned ? '#00ffaa' : 'gold',
                                        marginTop: '5px'
                                    }}>
                                        {isOwned ? 'OWNED' : `🪙 ${template.cost}`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Link to="/arcade" style={{
                        display: 'inline-block',
                        marginTop: '40px',
                        color: 'var(--accent-color)',
                        textDecoration: 'underline',
                        fontSize: '1.2rem'
                    }}>Go to Arcade to earn coins</Link>
                </div>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <SquishyButton onClick={handleBack} style={{
                        marginBottom: '20px',
                        padding: '10px 20px',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}>
                        ← Back to Gallery
                    </SquishyButton>
                    <div style={{ marginBottom: '10px', color: '#666' }}>
                        Editing: {selectedTemplate.title}
                    </div>
                    <ColoringCanvas templateImage={selectedTemplate.src} />
                </div>
            )}

            {/* PURCHASE MODAL */}
            {previewTemplate && !selectedTemplate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#222', padding: '30px', borderRadius: '20px',
                        border: '4px solid gold', textAlign: 'center', maxWidth: '400px'
                    }}>
                        <h2 style={{ color: 'gold' }}>Unlock "{previewTemplate.title}"?</h2>
                        <img src={previewTemplate.src} style={{ width: '200px', background: 'white', borderRadius: '10px', margin: '20px 0' }} />
                        <p style={{ fontSize: '1.2rem', color: 'white' }}>Cost: <strong>{previewTemplate.cost} Coins</strong></p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                            <SquishyButton onClick={handlePurchase} style={{
                                background: 'gold', color: 'black', border: 'none', padding: '10px 30px', borderRadius: '10px', fontWeight: 'bold'
                            }}>
                                BUY IT!
                            </SquishyButton>
                            <SquishyButton onClick={() => setPreviewTemplate(null)} style={{
                                background: '#555', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px'
                            }}>
                                Cancel
                            </SquishyButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coloring;
