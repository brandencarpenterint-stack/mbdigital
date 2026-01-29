import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from '../components/SquishyButton';

const SettingsPage = () => {
    const { soundEnabled, toggleSound } = useSettings();
    const { getLevelInfo } = useGamification();
    const { showToast } = useToast();
    const { playBeep } = useRetroSound();

    const [confirmReset, setConfirmReset] = useState(false);

    // Fallback if getLevelInfo isn't ready
    const levelInfo = getLevelInfo ? getLevelInfo() : { level: 1, rank: 'ROOKIE' };

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

                {/* 1. AUDIO */}
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

                {/* 2. OPERATOR INFO */}
                <section className="glass-panel" style={{ padding: '25px', border: '1px solid rgba(255, 0, 255, 0.3)' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--neon-pink)', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,0,255,0.1)', paddingBottom: '10px' }}>
                        OPERATOR
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#888' }}>ID</span>
                        <span>PLAYER_1</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>CURRENT RANK</span>
                        <span style={{ color: 'var(--neon-gold)', textShadow: '0 0 5px var(--neon-gold)' }}>LVL {levelInfo.level}</span>
                    </div>
                </section>

                {/* 3. DANGER ZONE */}
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
        </div>
    );
};

export default SettingsPage;
