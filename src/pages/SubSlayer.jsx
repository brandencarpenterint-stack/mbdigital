import React, { useState, useEffect } from 'react';

const COMMON_SUBS = [
    { id: 'netflix', name: 'Netflix', price: 15.49, color: '#E50914', cancelUrl: 'https://www.netflix.com/youraccount' },
    { id: 'spotify', name: 'Spotify', price: 10.99, color: '#1DB954', cancelUrl: 'https://www.spotify.com/us/account/subscription' },
    { id: 'prime', name: 'Amazon Prime', price: 14.99, color: '#00A8E1', cancelUrl: 'https://www.amazon.com/mc/pipeline/cancellation' },
    { id: 'disney', name: 'Disney+', price: 13.99, color: '#113CCF', cancelUrl: 'https://www.disneyplus.com/account' },
    { id: 'hulu', name: 'Hulu', price: 7.99, color: '#1CE783', cancelUrl: 'https://secure.hulu.com/account' },
    { id: 'youtube', name: 'YouTube Premium', price: 13.99, color: '#FF0000', cancelUrl: 'https://www.youtube.com/paid_memberships' },
    { id: 'apple', name: 'Apple One', price: 19.95, color: '#000000', cancelUrl: 'https://support.apple.com/en-us/HT202039' },
    { id: 'chatgpt', name: 'ChatGPT Plus', price: 20.00, color: '#10A37F', cancelUrl: 'https://chat.openai.com/#settings/DataControls' },
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

    useEffect(() => {
        localStorage.setItem('subSlayerData', JSON.stringify(mySubs));
        localStorage.setItem('subSlayerKills', JSON.stringify(slainSubs));
    }, [mySubs, slainSubs]);

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
        <div style={{
            background: 'linear-gradient(to bottom right, #1a0b2e, #000000)',
            minHeight: '100vh',
            color: 'white',
            padding: '100px 20px 40px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header Stats */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '50px',
                    animation: 'fadeIn 1s ease'
                }}>
                    <h1 style={{
                        fontFamily: 'Kanit, sans-serif',
                        fontSize: '3rem',
                        margin: '0',
                        background: 'linear-gradient(to right, #ff0055, #ff4d4d)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}>
                        Sub Slayer
                    </h1>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>Audit your recurring expenses. Kill the waste.</p>
                </div>

                {/* Dashboard Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Monthly Cost</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>${totalMonthly.toFixed(2)}</div>
                    </div>

                    <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #ff0055', textAlign: 'center', boxShadow: '0 0 20px rgba(255, 0, 85, 0.2)' }}>
                        <div style={{ fontSize: '0.9rem', color: '#ff4d4d', textTransform: 'uppercase', fontWeight: 'bold' }}>Yearly Bleed</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff0055' }}>${totalYearly.toFixed(2)}</div>
                    </div>

                    <div style={{ background: '#0a2a1a', padding: '20px', borderRadius: '15px', border: '1px solid #00ffaa', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#00ffaa', textTransform: 'uppercase' }}>Total Saved / Yr</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00ffaa' }}>${totalSavedYearly.toFixed(2)}</div>
                    </div>
                </div>

                {/* Active Subs List */}
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Active Subscriptions ({mySubs.length})</span>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        style={{ background: '#0070f3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Add New
                    </button>
                </h2>

                {/* Add Menu */}
                {isAdding && (
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', marginBottom: '20px', animation: 'slideDown 0.3s' }}>
                        <h3 style={{ marginTop: 0 }}>Quick Add</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {COMMON_SUBS.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => addSub(sub)}
                                    disabled={mySubs.some(s => s.id === sub.id)}
                                    style={{
                                        padding: '8px 15px',
                                        borderRadius: '20px',
                                        border: '1px solid #333',
                                        background: mySubs.some(s => s.id === sub.id) ? '#333' : 'black',
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: mySubs.some(s => s.id === sub.id) ? 0.5 : 1
                                    }}
                                >
                                    {sub.name} (${sub.price})
                                </button>
                            ))}
                        </div>

                        <h3 style={{ marginTop: 0 }}>Custom Sub</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                placeholder="Service Name"
                                value={customName}
                                onChange={e => setCustomName(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                            />
                            <input
                                type="number"
                                placeholder="Monthly Cost"
                                value={customPrice}
                                onChange={e => setCustomPrice(e.target.value)}
                                style={{ width: '100px', padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                            />
                            <button onClick={addCustomSub} style={{ background: '#00ffaa', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', color: 'black', fontWeight: 'bold' }}>Add</button>
                        </div>
                    </div>
                )}

                {/* Subscription Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '50px' }}>
                    {mySubs.length === 0 && !isAdding && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#555', border: '2px dashed #333', borderRadius: '15px' }}>
                            No active subscriptions. Are you sure? That's impressive.
                        </div>
                    )}

                    {mySubs.map((sub, i) => (
                        <div key={i} style={{
                            background: '#111',
                            padding: '20px',
                            borderRadius: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: `5px solid ${sub.color || '#fff'}`,
                            transition: 'transform 0.2s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{sub.name}</div>
                                    <div style={{ color: '#888', fontSize: '0.9rem' }}>${sub.price}/mo &bull; <span style={{ color: '#ff4d4d' }}>${(sub.price * 12).toFixed(2)}/yr</span></div>
                                </div>
                            </div>

                            <button
                                onClick={() => slaySub(sub)}
                                style={{
                                    background: '#ff0055',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: '0 4px 10px rgba(255, 0, 85, 0.4)'
                                }}
                            >
                                ⚔️ SLAY
                            </button>
                        </div>
                    ))}
                </div>

                {/* Graveyard */}
                {slainSubs.length > 0 && (
                    <div style={{ opacity: 0.6 }}>
                        <h3 style={{ color: '#888' }}>Graveyard (Saved Money)</h3>
                        {slainSubs.map((sub, i) => (
                            <div key={i} style={{
                                background: '#1a0b0b',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid #331111'
                            }}>
                                <span style={{ textDecoration: 'line-through', color: '#666' }}>{sub.name}</span>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span style={{ color: '#00ffaa' }}>+${(sub.price * 12).toFixed(2)}/yr</span>
                                    <button onClick={() => restoreSub(sub)} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer' }}>↺</button>
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
