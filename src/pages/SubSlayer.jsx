import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';

const COMMON_SUBS = [
    // STREAMING
    { id: 'netflix', name: 'Netflix', price: 15.49, color: '#E50914', cancelUrl: 'https://www.netflix.com/youraccount' },
    { id: 'hulu', name: 'Hulu', price: 7.99, color: '#1CE783', cancelUrl: 'https://secure.hulu.com/account' },
    { id: 'disney', name: 'Disney+', price: 13.99, color: '#113CCF', cancelUrl: 'https://www.disneyplus.com/account' },
    { id: 'hbo', name: 'Max (HBO)', price: 15.99, color: '#5426C9', cancelUrl: 'https://auth.max.com/subscription' },
    { id: 'prime', name: 'Amazon Prime', price: 14.99, color: '#00A8E1', cancelUrl: 'https://www.amazon.com/mc/pipeline/cancellation' },
    { id: 'peacock', name: 'Peacock', price: 5.99, color: '#000000', cancelUrl: 'https://www.peacocktv.com/account' },
    { id: 'paramount', name: 'Paramount+', price: 5.99, color: '#0066FF', cancelUrl: 'https://www.paramountplus.com/account/' },
    { id: 'appletv', name: 'Apple TV+', price: 9.99, color: '#000000', cancelUrl: 'https://tv.apple.com/settings' },
    { id: 'youtube', name: 'YouTube Premium', price: 13.99, color: '#FF0000', cancelUrl: 'https://www.youtube.com/paid_memberships' },
    { id: 'crunchyroll', name: 'Crunchyroll', price: 7.99, color: '#F47521', cancelUrl: 'https://www.crunchyroll.com/account/membership' },

    // MUSIC
    { id: 'spotify', name: 'Spotify', price: 10.99, color: '#1DB954', cancelUrl: 'https://www.spotify.com/us/account/subscription' },
    { id: 'applemusic', name: 'Apple Music', price: 10.99, color: '#FA243C', cancelUrl: 'https://music.apple.com/account' },
    { id: 'tidal', name: 'Tidal', price: 10.99, color: '#000000', cancelUrl: 'https://account.tidal.com' },
    { id: 'soundcloud', name: 'SoundCloud', price: 9.99, color: '#FF5500', cancelUrl: 'https://soundcloud.com/you/subscriptions' },

    // TECH / PROD
    { id: 'chatgpt', name: 'ChatGPT Plus', price: 20.00, color: '#10A37F', cancelUrl: 'https://chat.openai.com/#settings/DataControls' },
    { id: 'adobe', name: 'Adobe Creative Cloud', price: 54.99, color: '#FF0000', cancelUrl: 'https://account.adobe.com/plans' },
    { id: 'dropbox', name: 'Dropbox', price: 11.99, color: '#0061FF', cancelUrl: 'https://www.dropbox.com/account/plan' },
    { id: 'midjourney', name: 'Midjourney', price: 10.00, color: '#FFFFFF', cancelUrl: 'https://www.midjourney.com/account' },
    { id: 'github', name: 'GitHub Copilot', price: 10.00, color: '#171515', cancelUrl: 'https://github.com/settings/billing' },

    // GAMING
    { id: 'xbox', name: 'Xbox Game Pass', price: 16.99, color: '#107C10', cancelUrl: 'https://account.microsoft.com/services' },
    { id: 'psn', name: 'PlayStation Plus', price: 9.99, color: '#00439C', cancelUrl: 'https://www.playstation.com/acct/management' },
    { id: 'nintendo', name: 'Nintendo Switch Online', price: 3.99, color: '#E60012', cancelUrl: 'https://ec.nintendo.com/my/membership' },

    // LIFESTYLE
    { id: 'peloton', name: 'Peloton', price: 44.00, color: '#FF3347', cancelUrl: 'https://www.onepeloton.com/profile/subscriptions' },
    { id: 'audible', name: 'Audible', price: 14.95, color: '#F7991C', cancelUrl: 'https://www.audible.com/account/overview' },
    { id: 'duolingo', name: 'Duolingo Plus', price: 6.99, color: '#58CC02', cancelUrl: 'https://www.duolingo.com/settings/plus' },
    { id: 'dashpass', name: 'DoorDash DashPass', price: 9.99, color: '#FF3008', cancelUrl: 'https://www.doordash.com/consumer/checkout/dashpass_management' },
    { id: 'uberone', name: 'Uber One', price: 9.99, color: '#000000', cancelUrl: 'https://wallet.uber.com/' },
];

const SubSlayer = () => {
    // Subs the user actually has
    const [mySubs, setMySubs] = useState(() => {
        const saved = localStorage.getItem('subSlayerData');
        return saved ? JSON.parse(saved) : [];
    });

    // Subs that have been "Slain" (removed)
    const [slainSubs, setSlainSubs] = useState(() => {
        const saved = localStorage.getItem('subSlayerKills');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAdding, setIsAdding] = useState(false);
    const [customName, setCustomName] = useState('');
    const [customPrice, setCustomPrice] = useState('');

    const { addCoins } = useGamification() || { addCoins: () => { } };
    const { playWin, playCollect } = useRetroSound();

    // Reward History (Anti-Cheat)
    const [rewardHistory, setRewardHistory] = useState(() => {
        const saved = localStorage.getItem('subSlayerRewards');
        return saved ? JSON.parse(saved) : {}; // { serviceId: timestamp }
    });

    useEffect(() => {
        localStorage.setItem('subSlayerData', JSON.stringify(mySubs));
        localStorage.setItem('subSlayerKills', JSON.stringify(slainSubs));
        localStorage.setItem('subSlayerRewards', JSON.stringify(rewardHistory));
    }, [mySubs, slainSubs, rewardHistory]);

    const addSub = (sub) => {
        if (!mySubs.find(s => s.id === sub.id)) {
            setMySubs([...mySubs, { ...sub, instanceId: Date.now() }]);
        }
        setIsAdding(false);
    };

    const addCustomSub = () => {
        if (!customName || !customPrice) return;
        setMySubs([...mySubs, {
            id: `custom-${Date.now()}`,
            name: customName,
            price: parseFloat(customPrice),
            color: '#999',
            cancelUrl: null,
            instanceId: Date.now()
        }]);
        setCustomName('');
        setCustomPrice('');
        setIsAdding(false);
    };

    const slaySub = (sub) => {
        // Remove from active
        setMySubs(mySubs.filter(s => s.id !== sub.id));
        // Add to graveyard
        setSlainSubs([...slainSubs, { ...sub, slainDate: new Date().toLocaleDateString() }]);

        // Open Cancel Link
        if (sub.cancelUrl) {
            window.open(sub.cancelUrl, '_blank');
        } else {
            alert(`No direct link for ${sub.name}. Check your bank statement or settings!`);
        }

        // GAMIFICATION REWARD CHECK
        const now = Date.now();
        const COOLDOWN_DAYS = 150;
        const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
        const lastReward = rewardHistory[sub.id];

        if (lastReward && (now - lastReward) < COOLDOWN_MS) {
            const daysLeft = Math.ceil((COOLDOWN_MS - (now - lastReward)) / (24 * 60 * 60 * 1000));
            alert(`⚠️ REWARD DENIED ⚠️\n\nYou already claimed coins for ${sub.name}.\nCooldown active: ${daysLeft} days remaining.`);
            // Still slay it, but no coins
        } else {
            // GRANT REWARD
            const coinReward = Math.floor(sub.price * 100);
            addCoins(coinReward);
            playWin();
            triggerConfetti();

            // Record History
            setRewardHistory(prev => ({
                ...prev,
                [sub.id]: now
            }));

            setTimeout(() => alert(`⚔️ SUBSCRIPTION SLAIN! ⚔️\n\nTo reward your fiscal responsibility, you have been awarded:\n💰 ${coinReward} ARCADE COINS!`), 500);
        }
    };

    const restoreSub = (sub) => {
        setSlainSubs(slainSubs.filter(s => s.id !== sub.id));
        setMySubs([...mySubs, sub]);
    };

    // Calculations
    const totalMonthly = mySubs.reduce((acc, sub) => acc + sub.price, 0);
    const totalYearly = totalMonthly * 12;
    const totalSavedYearly = slainSubs.reduce((acc, sub) => acc + sub.price, 0) * 12;

    return (
        <div className="page-enter" style={{
            background: 'linear-gradient(to bottom right, #000000, #1a0b2e)',
            minHeight: '100vh',
            color: 'white',
            padding: '40px 20px 120px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header Stats */}
                <div style={{
                    textAlign: 'center', marginBottom: '50px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚔️</div>
                    <h1 style={{
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: '3.5rem',
                        margin: '0',
                        color: 'var(--neon-pink)',
                        textShadow: '0 0 30px rgba(255, 0, 85, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        SUB SLAYER
                    </h1>
                    <p style={{ color: '#aaa', marginTop: '10px', fontSize: '1.1rem' }}>Audit your recurring expenses. <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>Kill the waste.</span></p>
                </div>

                {/* Dashboard Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '50px'
                }}>
                    <div className="glass-panel" style={{ padding: '25px', textAlign: 'center', borderTop: '4px solid #fff' }}>
                        <div style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly Cost</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', fontFamily: '"Orbitron", sans-serif' }}>${totalMonthly.toFixed(2)}</div>
                    </div>

                    <div className="glass-panel" style={{
                        padding: '25px', textAlign: 'center',
                        borderTop: '4px solid var(--neon-pink)',
                        background: 'rgba(255, 0, 85, 0.05)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--neon-pink)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Yearly Bleed</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-pink)', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 15px rgba(255, 0, 85, 0.4)' }}>
                            ${totalYearly.toFixed(2)}
                        </div>
                    </div>

                    <div className="glass-panel" style={{
                        padding: '25px', textAlign: 'center',
                        borderTop: '4px solid var(--neon-green)',
                        background: 'rgba(0, 255, 170, 0.05)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--neon-green)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Saved / Yr</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-green)', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 15px rgba(0, 255, 170, 0.4)' }}>
                            ${totalSavedYearly.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Active Subs List */}
                <h2 style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontFamily: '"Orbitron", sans-serif', letterSpacing: '1px'
                }}>
                    <span>ACTIVE SUBS ({mySubs.length})</span>
                    <button
                        className="squishy-btn"
                        onClick={() => setIsAdding(!isAdding)}
                        style={{
                            background: 'var(--neon-blue)', color: 'black',
                            border: 'none', padding: '10px 20px', borderRadius: '30px',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'
                        }}
                    >
                        + ADD NEW
                    </button>
                </h2>

                {/* Add Menu */}
                {isAdding && (
                    <div className="glass-panel" style={{ padding: '25px', marginBottom: '30px', animation: 'slideDown 0.3s' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--neon-blue)', fontFamily: '"Orbitron", sans-serif' }}>QUICK ADD</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                            {COMMON_SUBS.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => addSub(sub)}
                                    disabled={mySubs.some(s => s.id === sub.id)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        border: mySubs.some(s => s.id === sub.id) ? '1px solid #333' : '1px solid rgba(255,255,255,0.2)',
                                        background: mySubs.some(s => s.id === sub.id) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)',
                                        color: mySubs.some(s => s.id === sub.id) ? '#555' : 'white',
                                        cursor: mySubs.some(s => s.id === sub.id) ? 'default' : 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {sub.name} <span style={{ opacity: 0.7 }}>${sub.price}</span>
                                </button>
                            ))}
                        </div>

                        <h3 style={{ marginTop: 0, color: 'var(--neon-blue)', fontFamily: '"Orbitron", sans-serif' }}>CUSTOM SUB</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <input
                                placeholder="Service Name"
                                value={customName}
                                onChange={e => setCustomName(e.target.value)}
                                style={{
                                    flex: 1, padding: '15px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white',
                                    minWidth: '200px'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Cost"
                                value={customPrice}
                                onChange={e => setCustomPrice(e.target.value)}
                                style={{
                                    width: '100px', padding: '15px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'
                                }}
                            />
                            <button
                                onClick={addCustomSub}
                                className="squishy-btn"
                                style={{
                                    background: 'var(--neon-green)', border: 'none', borderRadius: '10px',
                                    padding: '0 30px', cursor: 'pointer', color: 'black', fontWeight: 'bold'
                                }}
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                )}

                {/* Subscription Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '60px' }}>
                    {mySubs.length === 0 && !isAdding && (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#555', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '10px' }}>🧘</div>
                            No active subscriptions.<br />Are you sure? That's impressive.
                        </div>
                    )}

                    {mySubs.map((sub, i) => (
                        <div key={i} className="glass-panel" style={{
                            padding: '20px 25px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: `5px solid ${sub.color || '#fff'}`,
                            transition: 'transform 0.2s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px' }}>{sub.name}</div>
                                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                        ${sub.price}/mo <span style={{ opacity: 0.3 }}>|</span> <span style={{ color: 'var(--neon-pink)' }}>${(sub.price * 12).toFixed(2)}/yr</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="squishy-btn"
                                onClick={() => slaySub(sub)}
                                style={{
                                    background: 'var(--neon-pink)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 25px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '900',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 5px 15px rgba(255, 0, 85, 0.3)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                ⚔️ SLAY
                            </button>
                        </div>
                    ))}
                </div>

                {/* Graveyard */}
                {slainSubs.length > 0 && (
                    <div className="glass-panel" style={{ padding: '30px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#666', marginTop: 0, fontFamily: '"Orbitron", sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🪦 GRAVEYARD <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>(SAVED MONEY)</span>
                        </h3>
                        {slainSubs.map((sub, i) => (
                            <div key={i} style={{
                                padding: '15px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#666'
                            }}>
                                <span style={{ textDecoration: 'line-through' }}>{sub.name}</span>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>+${(sub.price * 12).toFixed(2)}/yr</span>
                                    <button onClick={() => restoreSub(sub)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1.2rem', title: 'Restore' }}>↺</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SubSlayer;
