import React, { useState, useEffect, useRef } from 'react';
import SquishyButton from './SquishyButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const MOCK_STATIONS = [
    { id: 'lofi', name: 'LO-FI CHILL', emoji: '☕', color: '#ffaa55', freq: 88.5, tracks: ['Study Beats 24/7', 'Rainy Day', 'Coffee Shop'] },
    { id: 'synth', name: 'SYNTHWAVE', emoji: '🌆', color: '#ff00ff', freq: 92.0, tracks: ['Neon Nights', 'Cyber Chase', 'Grid Walker'] },
    { id: 'void', name: 'VOID FM', emoji: '🌑', color: '#8800ff', freq: 104.5, tracks: ['Dark Matter', 'Entropy', 'Null Pointer'] },
    { id: 'community', name: 'PIRATE RADIO', emoji: '🏴‍☠️', color: '#ff0000', freq: 98.7, tracks: [] }
];

const SECRET_FREQUENCIES = [
    { freq: 96.5, name: 'GHOST SIGNAL', color: '#fff', message: '...help...me...', reward: 'ghost_badge', codexId: 'signal_ghost' },
    { freq: 101.1, name: 'DEV CHANNEL', color: '#00ff00', message: 'SYSTEM OVERRIDE', reward: 'dev_skin', codexId: 'signal_dev' }
];

import { useGamification } from '../context/GamificationContext';

const PirateRadioWidget = () => {
    const { showToast } = useToast() || { showToast: console.log };
    const { shopState, setShopState, unlockLore } = useGamification() || { shopState: {}, setShopState: () => { }, unlockLore: () => { } };
    const skin = shopState?.equipped?.radio_skin || 'radio_default';

    // State
    const [isOpen, setIsOpen] = useState(false);

    // Skin Styles
    const getSkinStyles = () => {
        if (skin === 'radio_wood') return { bg: '#5c4033', border: '#3e2723', font: 'Courier New, monospace' };
        if (skin === 'radio_gold') return { bg: 'linear-gradient(135deg, #FFD700, #FDB931)', border: '#DAA520', font: 'Orbitron, sans-serif' };
        if (skin === 'radio_cyber') return { bg: 'rgba(0, 255, 255, 0.1)', border: 'cyan', font: 'Orbitron, sans-serif', backdrop: 'blur(10px)' };
        if (skin === 'radio_dev') return { bg: '#000', border: '#0f0', font: 'monospace' };
        return { bg: '#111', border: '#333', font: 'Orbitron, sans-serif' };
    };
    const styles = getSkinStyles();

    const [mode, setMode] = useState('PRESET'); // PRESET | TUNER
    const [station, setStation] = useState(MOCK_STATIONS[0]);
    const [currentTrack, setCurrentTrack] = useState(MOCK_STATIONS[0].tracks[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    // Tuner State
    const [frequency, setFrequency] = useState(88.0);
    const [signalStrength, setSignalStrength] = useState(0); // 0-100
    const [staticNoise, setStaticNoise] = useState(0); // 0-1

    // User Uploads
    const [userTracks, setUserTracks] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('beatlab_uploads');
        if (saved) setUserTracks(JSON.parse(saved));
    }, [isOpen]);

    // Audio Mock
    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        // Logic to cycle tracks
        const list = station.id === 'community' ? (userTracks.length ? userTracks.map(t => t.name) : ['Static...']) : station.tracks;
        const idx = list.indexOf(currentTrack);
        const next = list[(idx + 1) % list.length];
        setCurrentTrack(next);
        setIsPlaying(true);
    };

    const switchStation = (newStation) => {
        setStation(newStation);
        setFrequency(newStation.freq); // Auto-tune
        if (newStation.id === 'community') {
            const list = userTracks.length ? userTracks.map(t => t.name) : ['No Signal...'];
            setCurrentTrack(list[0]);
        } else {
            setCurrentTrack(newStation.tracks && newStation.tracks[0] || 'Unknown Signal');
        }
        setIsPlaying(true);
        setMode('PRESET');
    };

    // Scrambler Passive
    const hasScrambler = shopState?.unlocked?.includes('radio_scrambler');
    const detectionRange = hasScrambler ? 0.5 : 0.2; // Widen range if owned
    const lockRange = hasScrambler ? 0.3 : 0.1;

    // TUNER LOGIC
    useEffect(() => {
        if (mode !== 'TUNER') return;

        // Check Stations
        const exactStation = MOCK_STATIONS.find(s => Math.abs(s.freq - frequency) < detectionRange);
        const secretStation = SECRET_FREQUENCIES.find(s => Math.abs(s.freq - frequency) < detectionRange);

        const target = exactStation || secretStation;

        if (target) {
            // Locked on
            if (Math.abs(target.freq - frequency) < lockRange) {
                setSignalStrength(100);
                setStaticNoise(0.1);
                if (target !== station) {
                    setStation(target.id ? target : { ...target, id: 'secret', emoji: '👁️', tracks: ['Unknown Transmission'] });
                    setCurrentTrack(target.message || target.tracks[0]);
                    // Secret Discovery
                    if (secretStation && Math.abs(secretStation.freq - frequency) < (lockRange / 2)) {
                        showToast(`SIGNAL DECODED: ${secretStation.name}`, 'win');

                        // Unlock Codex
                        if (secretStation.codexId && unlockLore) {
                            unlockLore(secretStation.codexId);
                        }

                        if (secretStation.reward && setShopState) {
                            setShopState(prev => {
                                if (prev.unlocked.includes(secretStation.reward)) return prev;
                                showToast(`REWARD UNLOCKED: ${secretStation.reward.toUpperCase()}`, 'max');
                                return { ...prev, unlocked: [...prev.unlocked, secretStation.reward] };
                            });
                        }
                    }
                }
            } else {
                setSignalStrength(50);
                setStaticNoise(0.5);
            }
        } else {
            // Static
            setSignalStrength(hasScrambler ? 10 : 0); // Scrambler picks up faint noise
            setStaticNoise(1.0);
            if (station.name !== 'STATIC') {
                setStation({ name: 'STATIC', color: '#444', emoji: '🌫️' });
                setCurrentTrack('...');
            }
        }

    }, [frequency, mode, station, hasScrambler]); // ADDED hasScrambler dependency

    return (
        <>
            {/* FLOATING TOGGLE */}
            {!isOpen && (
                <motion.button
                    initial={{ y: 0 }}
                    animate={{ y: isPlaying ? [0, -5, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed', bottom: '20px', left: '20px',
                        background: 'black', color: hasScrambler ? 'cyan' : 'white', // Cyan hint
                        border: hasScrambler ? '2px solid cyan' : '2px solid #333',
                        borderRadius: '50px',
                        padding: '10px 20px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        cursor: 'pointer', zIndex: 9000,
                        boxShadow: hasScrambler ? '0 0 15px cyan' : '0 5px 15px rgba(0,0,0,0.5)',
                        fontFamily: '"Orbitron", sans-serif'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>📻</span>
                    {isPlaying && (
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '15px' }}>
                            <motion.div animate={{ height: ['20%', '100%', '50%'] }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ width: '3px', background: '#0f0' }} />
                            <motion.div animate={{ height: ['50%', '20%', '80%'] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ width: '3px', background: '#0f0' }} />
                            <motion.div animate={{ height: ['80%', '40%', '90%'] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: '3px', background: '#0f0' }} />
                        </div>
                    )}
                </motion.button>
            )}

            {/* EXPANDED PLAYER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        style={{
                            position: 'fixed', bottom: '20px', left: '20px',
                            width: '320px',
                            background: styles.bg,
                            border: `2px solid ${styles.border}`,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            zIndex: 9001,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            fontFamily: styles.font,
                            backdropFilter: styles.backdrop || 'none'
                        }}
                    >
                        {/* SCREEN */}
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', position: 'relative', borderBottom: `1px solid ${styles.border}`, minHeight: '120px' }}>
                            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>

                            {/* Tuner Indicator */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <div style={{ color: station.color || '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {mode === 'TUNER' ? `${frequency.toFixed(1)} FM` : (station.emoji + ' ' + station.name)}
                                </div>
                                {mode === 'TUNER' && (
                                    <div style={{ fontSize: '0.6rem', color: signalStrength > 80 ? '#0f0' : '#888' }}>
                                        SIG: {signalStrength}%
                                    </div>
                                )}
                            </div>

                            <div style={{
                                color: 'white', fontSize: '1.2rem', marginTop: '5px', fontWeight: 'bold',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                textShadow: `0 0 10px ${station.color || '#fff'}`
                            }}>
                                {mode === 'TUNER' && station.name === 'STATIC' ? (
                                    <span style={{ color: '#666' }}>NO SIGNAL</span>
                                ) : currentTrack}
                            </div>

                            {/* Visualizer / Noise */}
                            <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end', marginTop: '15px', overflow: 'hidden', position: 'relative' }}>
                                {/* Noise Overlay */}
                                {mode === 'TUNER' && staticNoise > 0.1 && (
                                    <div style={{
                                        position: 'absolute', inset: 0, background: `url('/assets/noise.png')`, // Mock noise
                                        opacity: staticNoise * 0.5, zIndex: 10, pointerEvents: 'none'
                                    }} />
                                )}

                                {Array(25).fill(0).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isPlaying && staticNoise < 0.8 ? [`${Math.random() * 100}%`, `${Math.random() * 100}%`] : '5%' }}
                                        transition={{ repeat: Infinity, duration: 0.1 + Math.random() * 0.2 }}
                                        style={{ flex: 1, background: station.color || '#ccc', borderRadius: '2px 2px 0 0', opacity: 0.8 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ANALOG TUNER */}
                        {mode === 'TUNER' && (
                            <div style={{ padding: '15px', background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                                <input
                                    type="range" min="88.0" max="108.0" step="0.1"
                                    value={frequency}
                                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--neon-green)', cursor: 'crosshair' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#666', marginTop: '5px' }}>
                                    <span>88.0</span>
                                    <span>98.0</span>
                                    <span>108.0</span>
                                </div>
                            </div>
                        )}

                        {/* CONTROLS */}
                        <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => setMode(mode === 'PRESET' ? 'TUNER' : 'PRESET')} style={{
                                    background: '#333', color: mode === 'TUNER' ? 'var(--neon-green)' : 'white',
                                    border: '1px solid #555', borderRadius: '4px', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer'
                                }}>
                                    {mode === 'PRESET' ? '🎛️ MANUAL' : '📋 PRESETS'}
                                </button>
                                <button
                                    onClick={() => {
                                        // CYCLE SKINS
                                        const unlockedSkins = shopState.unlocked.filter(id => id.startsWith('radio_'));
                                        // Always include default if not present (though logic usually includes defaults separate)
                                        const allSkins = ['radio_default', 'radio_wood', 'radio_gold', 'radio_cyber', 'radio_dev'].filter(s => s === 'radio_default' || unlockedSkins.includes(s));

                                        const currentIndex = allSkins.indexOf(skin);
                                        const nextSkin = allSkins[(currentIndex + 1) % allSkins.length];

                                        // equip logic needs to be in context really, but we can hack it via direct setShopState if we must, 
                                        // OR import equipItem. But wait, this widget doesn't have equipItem?
                                        // The hook useGamification usually provides it. Let's assume we can update state manually if equipItem isn't exposed.
                                        // Re-checking useGamification destructure... only shopState/setShopState.

                                        setShopState(prev => ({
                                            ...prev,
                                            equipped: { ...prev.equipped, radio_skin: nextSkin }
                                        }));
                                        showToast(`Skin: ${nextSkin.replace('radio_', '').toUpperCase()}`, 'info');
                                    }}
                                    style={{
                                        background: 'transparent', color: styles.border, border: `1px solid ${styles.border}`,
                                        borderRadius: '4px', padding: '5px', fontSize: '0.8rem', cursor: 'pointer'
                                    }}>
                                    🎨
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={togglePlay} style={{
                                    background: isPlaying ? '#333' : 'white', color: isPlaying ? 'white' : 'black',
                                    border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                                    fontSize: '1.2rem', cursor: 'pointer'
                                }}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                {mode === 'PRESET' && (
                                    <button onClick={nextTrack} style={{ background: 'transparent', border: 'none', color: '#ccc', fontSize: '1.2rem', cursor: 'pointer' }}>⏭</button>
                                )}
                            </div>
                        </div>

                        {/* PRESET STATIONS LIST */}
                        {mode === 'PRESET' && (
                            <div style={{ background: '#000', padding: '10px', display: 'flex', gap: '5px', overflowX: 'auto' }}>
                                {MOCK_STATIONS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => switchStation(s)}
                                        style={{
                                            background: station.id === s.id ? s.color : '#222',
                                            color: station.id === s.id ? 'black' : '#888',
                                            border: '1px solid #333',
                                            borderRadius: '4px',
                                            padding: '5px 10px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PirateRadioWidget;
