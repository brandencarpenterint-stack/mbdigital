import React, { useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import html2canvas from 'html2canvas';

const BroCard = () => {
    const { stats, unlockedAchievements } = useGamification();
    const cardRef = useRef(null);

    // Get Data
    const coins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
    const subSlayerData = JSON.parse(localStorage.getItem('subSlayerKills')) || [];
    const monthlySaved = subSlayerData.reduce((acc, sub) => acc + sub.price, 0);
    const yearlySaved = monthlySaved * 12;

    const downloadCard = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2 // High res
            });
            const link = document.createElement('a');
            link.download = 'merchboy-bro-id.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            console.error(err);
            alert("Camera shy? Try again.");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

                {/* THE CARD ITSELF */}
                <div
                    ref={cardRef}
                    style={{
                        width: '400px',
                        height: '600px',
                        background: 'linear-gradient(135deg, #111, #222)',
                        borderRadius: '30px',
                        border: '2px solid #555',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        color: 'white',
                        fontFamily: 'Kanit, sans-serif'
                    }}
                >
                    {/* HOLOGRAPHIC OVERLAY */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(125deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}></div>

                    {/* HEADER */}
                    <div style={{ padding: '30px', background: '#000', borderBottom: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: '#fff' }}>BRO-ID</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>MB-DIGITAL-2026</div>
                    </div>

                    {/* AVATAR & INFO */}
                    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '120px', height: '120px',
                            background: '#000',
                            borderRadius: '50%',
                            border: '4px solid #00f2ff',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <img src="/assets/hustle_boy.png" alt="Avatar" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00f2ff' }}>PLAYER ONE</div>
                            <div style={{ color: '#aaa', fontSize: '1rem' }}>MEMBER SINCE 2026</div>
                        </div>

                        {/* STATS GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%', marginTop: '10px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase' }}>Arcade Coins</div>
                                <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>{coins}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase' }}>Saved / Yr</div>
                                <div style={{ color: '#00ffaa', fontSize: '1.5rem', fontWeight: 'bold' }}>${yearlySaved.toFixed(0)}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase' }}>Trophies</div>
                                <div style={{ color: '#ff0055', fontSize: '1.5rem', fontWeight: 'bold' }}>{unlockedAchievements.length}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase' }}>Rank</div>
                                <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    {coins > 1000 ? 'LEGEND' : (coins > 500 ? 'ELITE' : 'NOVICE')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BARCODE */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center', opacity: 0.5 }}>
                        <div style={{ height: '30px', background: 'repeating-linear-gradient(90deg, #fff, #fff 2px, #000 2px, #000 4px)', width: '80%', margin: '0 auto' }}></div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <button
                    onClick={downloadCard}
                    style={{
                        background: '#00f2ff',
                        color: 'black',
                        border: 'none',
                        padding: '15px 40px',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)'
                    }}
                >
                    📸 DOWNLOAD ID
                </button>
            </div>
        </div>
    );
};

export default BroCard;
