import React, { useState, useEffect, useRef } from 'react';
import SquishyButton from '../components/SquishyButton';
import { Link } from 'react-router-dom';

const BeatLab = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(128);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTracks, setActiveTracks] = useState({
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
        fx: Array(16).fill(false),
    });

    const audioCtx = useRef(null);
    const timerRef = useRef(null);
    const stepRef = useRef(0);

    // PRESETS
    const BASIC_BEAT = {
        kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        fx: [false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false]
    };

    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
    };

    const playSound = (type) => {
        if (!audioCtx.current) return;
        const ctx = audioCtx.current;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'kick':
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
                gain.gain.setValueAtTime(0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'snare':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(250, now);
                gain.gain.setValueAtTime(0.7, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

                // Noise layer
                const noiseOsc = ctx.createOscillator();
                const noiseGain = ctx.createGain();
                noiseOsc.type = 'sawtooth';
                noiseOsc.frequency.value = 800;
                noiseOsc.connect(noiseGain);
                noiseGain.connect(ctx.destination);
                noiseGain.gain.setValueAtTime(0.2, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                noiseOsc.start(now);
                noiseOsc.stop(now + 0.2);

                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'hihat':
                osc.type = 'square';
                osc.frequency.setValueAtTime(8000, now);
                const filter = ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 7000;
                osc.disconnect();
                osc.connect(filter);
                filter.connect(gain);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'fx':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                const lowpass = ctx.createBiquadFilter();
                lowpass.type = 'lowpass';
                lowpass.frequency.value = 400;
                osc.disconnect();
                osc.connect(lowpass);
                lowpass.connect(gain);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            default: break;
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
    }, [isPlaying, bpm]);

    const activeTracksRef = useRef(activeTracks);
    useEffect(() => { activeTracksRef.current = activeTracks; }, [activeTracks]);

    const playStep = (step) => {
        const tracks = activeTracksRef.current;
        if (tracks.kick[step]) playSound('kick');
        if (tracks.snare[step]) playSound('snare');
        if (tracks.hihat[step]) playSound('hihat');
        if (tracks.fx[step]) playSound('fx');
    };

    const toggleStep = (track, index) => {
        const newTracks = { ...activeTracks };
        newTracks[track][index] = !newTracks[track][index];
        setActiveTracks(newTracks);
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const loadPreset = () => {
        setActiveTracks(BASIC_BEAT);
        if (navigator.vibrate) navigator.vibrate(20);
    };

    const clearPattern = () => {
        setActiveTracks({
            kick: Array(16).fill(false),
            snare: Array(16).fill(false),
            hihat: Array(16).fill(false),
            fx: Array(16).fill(false),
        });
        if (navigator.vibrate) navigator.vibrate(20);
    };

    const togglePlay = () => {
        initAudio();
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="page-enter" style={{
            background: 'linear-gradient(to bottom, #111, #000)',
            minHeight: '100vh',
            padding: '20px',
            paddingBottom: '140px',
            color: 'white',
            fontFamily: '"Orbitron", sans-serif',
            textAlign: 'center'
        }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8 }}>⬅</Link>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--neon-blue)', textShadow: '0 0 10px var(--neon-blue)', margin: 0 }}>BEAT LAB 🎹</h1>
                <div style={{ width: '2rem' }}></div>
            </div>

            {/* Main Controls */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                    <SquishyButton
                        onClick={togglePlay}
                        style={{
                            padding: '20px 50px',
                            fontSize: '1.2rem',
                            background: isPlaying ? 'var(--neon-pink)' : 'var(--neon-green)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            boxShadow: `0 0 20px ${isPlaying ? 'var(--neon-pink)' : 'var(--neon-green)'}`,
                            width: '180px'
                        }}
                    >
                        {isPlaying ? 'STOP ■' : 'PLAY ▶'}
                    </SquishyButton>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>TEMPO</span>
                    <input
                        type="range"
                        min="60" max="180"
                        value={bpm}
                        onChange={(e) => setBpm(parseInt(e.target.value))}
                        style={{ accentColor: 'var(--neon-blue)', width: '150px' }}
                    />
                    <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>{bpm} BPM</span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <button onClick={loadPreset} style={{ padding: '8px 20px', background: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    LOAD PRESET
                </button>
                <button onClick={clearPattern} style={{ padding: '8px 20px', background: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    CLEAR
                </button>
            </div>

            {/* Sequencer Grid */}
            <div className="glass-panel" style={{
                padding: '20px',
                border: '1px solid #333',
                background: 'rgba(0,0,0,0.5)',
                overflowX: 'auto'
            }}>
                {Object.keys(activeTracks).map(track => (
                    <div key={track} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{
                            width: '60px',
                            textAlign: 'right',
                            marginRight: '15px',
                            color: track === 'kick' ? 'var(--neon-pink)' :
                                track === 'snare' ? 'var(--neon-gold)' :
                                    track === 'hihat' ? 'var(--neon-blue)' : '#aaa',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            letterSpacing: '1px'
                        }}>
                            {track}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px', flex: 1, minWidth: '300px' }}>
                            {activeTracks[track].map((isActive, i) => (
                                <div
                                    key={i}
                                    onClick={() => toggleStep(track, i)}
                                    style={{
                                        aspectRatio: '1/1.5',
                                        background: isActive ? (
                                            track === 'kick' ? 'var(--neon-pink)' :
                                                track === 'snare' ? 'var(--neon-gold)' :
                                                    track === 'hihat' ? 'var(--neon-blue)' : '#fff'
                                        ) : (i % 4 === 0 ? '#333' : '#222'),
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        border: i === currentStep ? '1px solid white' : 'none',
                                        boxShadow: i === currentStep ? '0 0 10px white' : 'none',
                                        opacity: isActive ? 1 : 0.6,
                                        transform: i === currentStep && isPlaying ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 0.05s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '20px', color: '#666', fontSize: '0.7rem', letterSpacing: '1px' }}>
                TAP GRID TO PROGRAM • USE HEADPHONES FOR BEST BASS
            </p>
        </div>
    );
};

export default BeatLab;
