import React, { useState, useEffect, useRef } from 'react';
import SquishyButton from '../components/SquishyButton';
import { Link } from 'react-router-dom';
import BeatVisualizer from '../components/BeatVisualizer';
import { motion } from 'framer-motion';

const BeatLab = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(128);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedBank, setSelectedBank] = useState('retro'); // retro, 8bit, trap
    const [activeTracks, setActiveTracks] = useState({
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
        bass: Array(16).fill(false),
        fx: Array(16).fill(false),
    });

    const audioCtx = useRef(null);
    const analyserNode = useRef(null); // Visualizer node
    const timerRef = useRef(null);
    const stepRef = useRef(0);

    // PRESETS
    const PRESETS = {
        'MUSHROOM': {
            kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
            snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
            hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
            bass: [true, true, false, true, false, false, true, false, true, true, false, true, false, false, true, false],
            fx: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false]
        },
        'SPEEDSTER': {
            kick: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
            snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
            hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
            bass: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
            fx: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true]
        },
        'HERO': {
            kick: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
            snare: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
            hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            bass: [true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true],
            fx: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false]
        }
    };

    const initAudio = () => {
        if (!audioCtx.current) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            audioCtx.current = new Ctx();

            // Setup Visualizer Node
            analyserNode.current = audioCtx.current.createAnalyser();
            analyserNode.current.connect(audioCtx.current.destination);
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
    };

    const playSound = (type, time = 0) => {
        if (!audioCtx.current) return;
        const ctx = audioCtx.current;
        const now = time || ctx.currentTime;
        const dest = analyserNode.current || ctx.destination; // Route through visualizer

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);

        // SOUND BANKS
        if (selectedBank === '8bit') {
            // ... 8-BIT CHIPTUNE STYLE ...
            if (type === 'kick') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'snare') {
                // Noise burst
                const nOsc = ctx.createOscillator();
                nOsc.type = 'sawtooth';
                nOsc.frequency.setValueAtTime(400, now); // Low res noise
                nOsc.connect(gain);
                nOsc.start(now); nOsc.stop(now + 0.1);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            } else if (type === 'hihat') {
                // High pitch blip
                osc.type = 'square';
                osc.frequency.setValueAtTime(2000, now); // Fixed high tone
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now); osc.stop(now + 0.05);
            } else if (type === 'bass') {
                // 8-bit Triangle Bass
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(110, now); // A2
                osc.frequency.setValueAtTime(55, now + 0.1); // Drop
                gain.gain.setValueAtTime(0.6, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                osc.start(now); osc.stop(now + 0.4);
            } else if (type === 'fx') {
                // Arpeggio / Coin sound
                osc.type = 'square';
                osc.frequency.setValueAtTime(900, now);
                osc.frequency.setValueAtTime(1200, now + 0.05);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
            }
        } else if (selectedBank === 'trap') {
            // ... TRAP STYLE ...
            if (type === 'kick') {
                osc.type = 'sine'; // Deep 808
                osc.frequency.setValueAtTime(60, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
                gain.gain.setValueAtTime(1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now); osc.stop(now + 0.4);
            } else if (type === 'snare') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'bass') {
                // Sub Bass
                osc.type = 'sine';
                osc.frequency.setValueAtTime(40, now);
                gain.gain.setValueAtTime(0.8, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.8); // Long sustain
                osc.start(now); osc.stop(now + 0.8);
            } else {
                // Fallback to retro for others
                playRetroSound(type, now, dest);
            }
        } else {
            // ... RETRO (Default) ...
            playRetroSound(type, now, dest);
        }
    };

    const playRetroSound = (type, now, dest) => {
        const ctx = audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);

        switch (type) {
            case 'kick':
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
                gain.gain.setValueAtTime(0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now); osc.stop(now + 0.5);
                break;
            case 'snare':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(250, now);
                gain.gain.setValueAtTime(0.7, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
                break;
            case 'hihat':
                osc.type = 'square';
                osc.frequency.setValueAtTime(8000, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now); osc.stop(now + 0.05);
                break;
            case 'bass':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, now);
                const lp = ctx.createBiquadFilter();
                lp.type = 'lowpass';
                lp.frequency.value = 600;
                osc.disconnect(); osc.connect(lp); lp.connect(gain);
                gain.gain.setValueAtTime(0.6, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                osc.start(now); osc.stop(now + 0.4);
                break;
            case 'fx':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
                break;
        }
    };


    useEffect(() => {
        if (isPlaying) {
            stepRef.current = currentStep;
            timerRef.current = setInterval(() => {
                const next = (stepRef.current + 1) % 16;
                stepRef.current = next;
                setCurrentStep(next);
                playStep(next);
            }, (60 / bpm) * 1000 / 4);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, bpm, selectedBank]);

    const activeTracksRef = useRef(activeTracks);
    useEffect(() => { activeTracksRef.current = activeTracks; }, [activeTracks]);

    const playStep = (step) => {
        const tracks = activeTracksRef.current;
        if (tracks.kick[step]) playSound('kick');
        if (tracks.snare[step]) playSound('snare');
        if (tracks.hihat[step]) playSound('hihat');
        if (tracks.bass[step]) playSound('bass');
        if (tracks.fx[step]) playSound('fx');
    };

    const toggleStep = (track, index) => {
        const newTracks = { ...activeTracks };
        newTracks[track][index] = !newTracks[track][index];
        setActiveTracks(newTracks);
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const loadPreset = (name) => {
        if (PRESETS[name]) {
            setActiveTracks(PRESETS[name]);
            // Auto switch bank based on name?
            if (name === 'MUSHROOM') setSelectedBank('8bit');
            else if (name === 'SPEEDSTER') setSelectedBank('8bit');
            else if (name === 'HERO') setSelectedBank('retro');
        }
    };

    const clearPattern = () => {
        setActiveTracks({
            kick: Array(16).fill(false),
            snare: Array(16).fill(false),
            hihat: Array(16).fill(false),
            bass: Array(16).fill(false),
            fx: Array(16).fill(false),
        });
    };

    const togglePlay = () => {
        initAudio();
        setIsPlaying(!isPlaying);
    };

    const TRACK_COLORS = {
        kick: '#ff0055',    // Neon Pink
        snare: '#ffcc00',   // Gold
        hihat: '#00ccff',   // Cyan
        bass: '#bf00ff',    // Purple
        fx: '#00ff66'       // Green
    };

    return (
        <div className="page-enter" style={{
            background: 'linear-gradient(to bottom, #050510, #000)',
            minHeight: '100vh',
            padding: '20px',
            paddingBottom: '140px',
            color: 'white',
            fontFamily: '"Orbitron", sans-serif',
            textAlign: 'center'
        }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative', zIndex: 10 }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8, color: 'white' }}>⬅</Link>
                <div style={{ textAlign: 'center' }}>
                    <motion.h1
                        animate={{ textShadow: ['0 0 10px #00ccff', '0 0 20px #bf00ff', '0 0 10px #00ccff'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '1.8rem', color: '#fff', margin: 0, letterSpacing: '2px' }}
                    >
                        BEAT LAB 3.0
                    </motion.h1>
                    <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '2px' }}>SONIC ARCHITECTURE</div>
                </div>
                <div style={{ width: '2rem' }}></div>
            </div>

            {/* VISUALIZER */}
            <BeatVisualizer audioCtx={audioCtx} isPlaying={isPlaying} />

            {/* Main Controls Round */}
            <div className="glass-panel" style={{
                padding: '20px', marginBottom: '20px',
                background: 'rgba(20, 20, 30, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Play Button */}
                    <SquishyButton
                        onClick={togglePlay}
                        style={{
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            background: isPlaying ? 'var(--neon-pink)' : 'var(--neon-green)',
                            color: 'black',
                            border: 'none', borderRadius: '50px', fontWeight: 'bold',
                            boxShadow: `0 0 20px ${isPlaying ? 'var(--neon-pink)' : 'var(--neon-green)'}`,
                            minWidth: '150px'
                        }}
                    >
                        {isPlaying ? 'HALT ■' : 'ENGAGE ▶'}
                    </SquishyButton>

                    {/* Bank Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>SOUND BANK</label>
                        <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            style={{
                                background: '#111', color: 'var(--neon-blue)', border: '1px solid var(--neon-blue)',
                                padding: '10px', borderRadius: '5px', fontFamily: 'inherit',
                                cursor: 'pointer', outline: 'none',
                                boxShadow: '0 0 5px var(--neon-blue)'
                            }}
                        >
                            <option value="retro">RETRO WAVE</option>
                            <option value="8bit">8-BIT CHIP</option>
                            <option value="trap">DEEP TRAP</option>
                        </select>
                    </div>

                    {/* BPM */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#888' }}>TEMPO: {bpm} BPM</label>
                        <input
                            type="range" min="60" max="180" value={bpm}
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            style={{ accentColor: 'var(--neon-pink)', width: '120px' }}
                        />
                    </div>
                </div>
            </div>

            {/* PRESETS */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: '#888', alignSelf: 'center', fontSize: '0.8rem' }}>PRESETS:</span>
                <button onClick={() => loadPreset('MUSHROOM')} className="preset-btn" style={{ borderColor: '#e52521', color: '#e52521' }}>MUSHROOM 🍄</button>
                <button onClick={() => loadPreset('SPEEDSTER')} className="preset-btn" style={{ borderColor: '#0066cc', color: '#0066cc' }}>SPEEDSTER 🦔</button>
                <button onClick={() => loadPreset('HERO')} className="preset-btn" style={{ borderColor: '#107a28', color: '#107a28' }}>HERO 🛡️</button>
                <button onClick={clearPattern} className="preset-btn" style={{ borderColor: '#555', color: '#aaa' }}>CLEAR 🗑️</button>
            </div>

            <style>{`
                .preset-btn {
                    padding: 8px 15px;
                    background: transparent;
                    border: 1px solid;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: inherit;
                    transition: all 0.2s;
                }
                .preset-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: scale(1.05);
                }
            `}</style>

            {/* Sequencer Grid */}
            <div className="glass-panel" style={{
                padding: '20px',
                border: '1px solid #333',
                background: 'rgba(0,0,0,0.8)',
                overflowX: 'auto',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
            }}>
                {Object.keys(activeTracks).map(track => (
                    <div key={track} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{
                            width: '60px', textAlign: 'right', marginRight: '15px',
                            color: TRACK_COLORS[track],
                            fontWeight: 'bold', fontSize: '0.7rem',
                            textShadow: `0 0 5px ${TRACK_COLORS[track]}`
                        }}>
                            {track.toUpperCase()}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px', flex: 1, minWidth: '350px' }}>
                            {activeTracks[track].map((isActive, i) => (
                                <motion.div
                                    key={i}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => toggleStep(track, i)}
                                    style={{
                                        aspectRatio: '1/1.5',
                                        background: isActive ? TRACK_COLORS[track] : (i % 4 === 0 ? '#333' : '#1a1a1a'),
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        border: i === currentStep ? '1px solid white' : `1px solid ${isActive ? TRACK_COLORS[track] : '#222'}`,
                                        opacity: isActive ? 1 : 0.6,
                                        transform: i === currentStep ? 'scale(1.15)' : 'scale(1)',
                                        boxShadow: isActive ? `0 0 10px ${TRACK_COLORS[track]}` : 'none',
                                        zIndex: i === currentStep ? 10 : 1
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '20px', color: '#555', fontSize: '0.6rem', letterSpacing: '2px' }}>
                AUDIO ENGINE CONNECTED // 44.1KHZ
            </p>
        </div>
    );
};

export default BeatLab;
