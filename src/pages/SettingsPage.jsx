import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from '../components/SquishyButton';

const SettingsPage = () => {
    const { soundEnabled, toggleSound } = useSettings();
    const { getLevelInfo, userProfile, updateProfile, session, loginWithProvider, logout } = useGamification();
    const { showToast } = useToast();
    const { playBeep, playBoop } = useRetroSound();

    const [confirmReset, setConfirmReset] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);

    // Fallback if getLevelInfo isn't ready
    const levelInfo = getLevelInfo ? getLevelInfo() : { level: 1, rank: 'ROOKIE' };

    const AVATARS = [
        '/assets/merchboy_face.png',
        '/assets/merchboy_cat.png',
        '/assets/merchboy_bunny.png',
        '/assets/merchboy_money.png',
        '/assets/neon_brick/ball1.png',
        '/assets/neon_brick/ball2.png',
        '/assets/neon_brick/ball3.png',
        '/assets/neon_brick/ball4.png'
    ];

    const handleNameSave = () => {
        if (newName.trim()) {
            updateProfile({ name: newName.trim().toUpperCase() });
            setIsEditingName(false);
        }
    };

    const handleReset = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            playBeep();
            return;
        }

        // Hard Reset
        localStorage.clear();
        showToast("SYSTEM RESET COMPLETE. REFRESHING...", "error");
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    return (
        <div className="page-enter" style={{
            background: 'linear-gradient(to bottom, #000000, #0a0a0a)',
            minHeight: '100vh',
            padding: '20px',
            paddingBottom: '120px',
            color: 'white',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '1.5rem', marginRight: '20px' }}>
                    ⬅
                </Link>
                <h1 style={{ margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>SYSTEM SETTINGS</h1>
            </header>

            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* 1. PROFILE SETTINGS */}
                <section className="glass-panel" style={{ padding: '25px', border: '1px solid var(--neon-pink)' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--neon-pink)', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,0,255,0.1)', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>OPERATOR IDENTITY</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neon-gold)' }}>LVL {levelInfo.level}</span>
                    </h2>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        {/* AVATAR */}
                        <div style={{ textAlign: 'center' }}>
                            <div
                                onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    overflow: 'hidden', border: '2px solid white',
                                    cursor: 'pointer', position: 'relative'
                                }}>
                                <img src={userProfile?.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="hover-show">
                                    EDIT
                                </div>
                            </div>
                            <div style={{ fontSize: '0.6rem', marginTop: '5px', color: '#888' }}>TAP TO CHANGE</div>
                        </div>

                        {/* NAME */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>CODENAME</div>
                            {isEditingName ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                        placeholder={userProfile?.name}
                                        style={{ background: '#222', border: '1px solid #555', color: 'white', padding: '5px 10px', borderRadius: '5px', width: '100%', fontFamily: 'inherit' }}
                                    />
                                    <button onClick={handleNameSave} style={{ background: 'var(--neon-green)', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💾</button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => { setIsEditingName(true); setNewName(userProfile?.name); }}
                                    style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    {userProfile?.name} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>✎</span>
                                </div>
                            )}
                            <div style={{ fontSize: '0.8rem', color: 'var(--neon-gold)', marginTop: '5px' }}>{levelInfo.rank} CLASS</div>
                        </div>
                    </div>

                    {/* AVATAR SELECTOR */}
                    {showAvatarSelect && (
                        <div style={{
                            marginTop: '20px',
                            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px',
                            background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px',
                            animation: 'fadeIn 0.3s'
                        }}>
                            {AVATARS.map((src, i) => (
                                <div key={i}
                                    onClick={() => {
                                        updateProfile({ avatar: src });
                                        setShowAvatarSelect(false);
                                        playBoop();
                                    }}
                                    style={{
                                        width: '100%', aspectRatio: '1/1', borderRadius: '50%',
                                        overflow: 'hidden', border: userProfile?.avatar === src ? '2px solid var(--neon-green)' : '2px solid transparent',
                                        cursor: 'pointer',
                                        transform: userProfile?.avatar === src ? 'scale(1.1)' : 'scale(1)'
                                    }}
                                >
                                    <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#222' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 2. AUDIO */}
                <section className="glass-panel" style={{ padding: '25px', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--neon-blue)', fontSize: '1.2rem', borderBottom: '1px solid rgba(0,255,255,0.1)', paddingBottom: '10px' }}>
                        AUDIO
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>MASTER SOUND</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Enable sound effects</div>
                        </div>
                        <SquishyButton
                            onClick={() => { toggleSound(); playBeep(); }}
                            style={{
                                background: soundEnabled ? 'var(--neon-green)' : '#333',
                                color: soundEnabled ? 'black' : '#888',
                                width: '60px', borderRadius: '30px', padding: '10px'
                            }}
                        >
                            {soundEnabled ? 'ON' : 'OFF'}
                        </SquishyButton>
                    </div>
                </section>

                {/* 3. CLOUD SYNC */}
                <section className="glass-panel" style={{ padding: '25px', border: '1px solid var(--neon-blue)' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--neon-blue)', fontSize: '1.2rem', borderBottom: '1px solid rgba(0,255,255,0.1)', paddingBottom: '15px' }}>
                        CLOUD SYNC
                    </h2>

                    {session ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '1rem', color: '#00ff00', fontWeight: 'bold' }}>✅ ONLINE</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Synced as <span style={{ color: 'white' }}>{session.user.email}</span></div>
                            </div>
                            <SquishyButton
                                onClick={logout}
                                style={{ background: '#333', border: '1px solid #555', fontSize: '0.8rem', padding: '10px 20px' }}>
                                DISCONNECT
                            </SquishyButton>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.4' }}>
                                Link your account to save progress across devices and never lose your high scores.
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => loginWithProvider('google')}
                                    className="squishy-btn"
                                    style={{
                                        flex: 1, minWidth: '140px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        padding: '12px', borderRadius: '10px', border: 'none',
                                        background: 'white', color: '#333', fontWeight: 'bold', cursor: 'pointer',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>G</span> GOOGLE
                                </button>
                                <button
                                    onClick={() => loginWithProvider('apple')}
                                    className="squishy-btn"
                                    style={{
                                        flex: 1, minWidth: '140px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        padding: '12px', borderRadius: '10px',
                                        background: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                        fontFamily: 'inherit', border: '1px solid #333'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}></span> APPLE
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* 4. DANGER ZONE */}
                <section className="glass-panel" style={{ padding: '25px', border: '1px solid rgba(255, 0, 0, 0.3)', background: 'rgba(20, 0, 0, 0.6)' }}>
                    <h2 style={{ marginTop: 0, color: 'red', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,0,0,0.1)', paddingBottom: '10px' }}>
                        DANGER ZONE
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#ffaaaa' }}>FACTORY RESET</div>
                            <div style={{ fontSize: '0.8rem', color: '#aabbbb' }}>Wipes all progress, coins, and unlocks.</div>
                        </div>

                        {!confirmReset ? (
                            <button
                                onClick={handleReset}
                                className="squishy-btn"
                                style={{
                                    background: '#333', color: 'red', border: '1px solid red',
                                    padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                RESET
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setConfirmReset(false)}
                                    style={{ padding: '10px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="squishy-btn"
                                    style={{
                                        background: 'red', color: 'white', border: 'none',
                                        padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    FIRM IT?
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <div style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', marginTop: '20px' }}>
                    SYSTEM VERSION 3.0.1 (NEON HORIZON)<br />
                    POWERED BY MBDIGITAL
                </div>
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default SettingsPage;
