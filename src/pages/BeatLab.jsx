import React, { useState, useEffect, useRef } from 'react';

const BeatLab = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(128);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTracks, setActiveTracks] = useState({
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
        synth: Array(16).fill(false),
    });

    const audioCtx = useRef(null);
    const timerRef = useRef(null);
    const stepRef = useRef(0); // Track step in Ref to avoid stale closure issues completely

    // PRESETS
    const BASIC_BEAT = {
        kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        synth: [true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, true]
    };

    // Initialize AudioContext
    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
    };

    // Sound Generators
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

                // Add Noise for snare (approximate)
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
                osc.type = 'square'; // Metallic
                osc.frequency.setValueAtTime(8000, now);
                // Bandpass filter for hi-hat feel
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
            case 'synth':
                osc.type = 'sine';
                // Simple melody logic based on step? Random for now or fixed
                // Let's make it a simple arpeggio based on step index
                const note = [261.63, 329.63, 392.00, 523.25][currentStep % 4];
                osc.frequency.setValueAtTime(note, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            default:
                break;
        }
    };

    // Sequencer Logic
    useEffect(() => {
        if (isPlaying) {
            // Reset Ref
            stepRef.current = currentStep;

            timerRef.current = setInterval(() => {
                const next = (stepRef.current + 1) % 16;
                stepRef.current = next;
                setCurrentStep(next);
                playStep(next);
            }, (60 / bpm) * 1000 / 4); // 16th notes
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, bpm]);

    // Handle playing sounds for the current step (outside effect to capture latest state state?)
    // Actually, state inside interval is stale.
    // Use a ref for activeTracks to read inside interval?
    // Or just use the fact that setStep triggers a render, and we trigger sound on step change?
    // Let's use a separate useEffect watching currentStep.

    const activeTracksRef = useRef(activeTracks);
    useEffect(() => { activeTracksRef.current = activeTracks; }, [activeTracks]);

    const playStep = (step) => {
        const tracks = activeTracksRef.current;
        if (tracks.kick[step]) playSound('kick');
        if (tracks.snare[step]) playSound('snare');
        if (tracks.hihat[step]) playSound('hihat');
        if (tracks.synth[step]) playSound('synth');
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
            synth: Array(16).fill(false),
        });
        if (navigator.vibrate) navigator.vibrate(20);
    };

    const togglePlay = () => {
        initAudio(); // Ensure context is started
        setIsPlaying(!isPlaying);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #2c3e50, #000000)',
            minHeight: '100vh',
            padding: '100px 20px 40px',
            color: 'white',
            fontFamily: 'monospace',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#00ffaa', textShadow: '0 0 20px #00ffaa' }}>BEAT LAB 🎹</h1>
            <p>Make some noise. Click grid to program.</p>

            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: isPlaying ? '#ff0055' : '#00ffaa',
                        color: 'black',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: `0 0 20px ${isPlaying ? '#ff0055' : '#00ffaa'}`
                    }}
                >
                    {isPlaying ? 'STOP ■' : 'PLAY ▶'}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>BPM: {bpm}</label>
                    <input
                        type="range"
                        min="60" max="180"
                        value={bpm}
                        onChange={(e) => setBpm(parseInt(e.target.value))}
                        style={{ accentColor: '#00ffaa' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <button onClick={loadPreset} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    LOAD PRESET
                </button>
                <button onClick={clearPattern} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    CLEAR
                </button>
            </div>

            <div style={{
                background: '#111',
                padding: '20px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '1px solid #333',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {Object.keys(activeTracks).map(track => (
                    <div key={track} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '80px', textAlign: 'right', marginRight: '15px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {track}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px' }}>
                            {activeTracks[track].map((isActive, i) => (
                                <div
                                    key={i}
                                    onClick={() => toggleStep(track, i)}
                                    style={{
                                        width: '25px',
                                        height: '40px',
                                        background: isActive ? (track === 'kick' ? '#ff0055' : track === 'snare' ? '#ffff00' : '#00ffaa') : '#333',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        border: i % 4 === 0 ? '1px solid #555' : '1px solid #222',
                                        opacity: i === currentStep ? 1 : (isActive ? 0.8 : 0.5),
                                        transform: i === currentStep ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.1s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '20px', color: '#666', fontSize: '0.8rem' }}>Tap buttons to create pattern.</p>
        </div>
    );
};

export default BeatLab;
