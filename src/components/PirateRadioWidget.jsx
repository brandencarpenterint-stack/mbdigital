/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

const STATIONS = [
    {
        id: 'synthwave',
        name: 'NORAD SYNTHWAVE',
        badge: 'CYBER-ARPS',
        freq: 104.2,
        color: '#00f0ff',
        bpm: 120,
        desc: 'Classified 16th-note tactical arpeggios & sub-kick drive'
    },
    {
        id: 'radar',
        name: 'PENTAGON RADAR',
        badge: 'TACTICAL COMMS',
        freq: 98.5,
        color: '#00ff88',
        bpm: 75,
        desc: '600km sonar telemetry, tactical radar sweep & sub-drone'
    },
    {
        id: 'horizon',
        name: 'NEON HORIZON',
        badge: 'OUTRUN BASS',
        freq: 92.0,
        color: '#ff007f',
        bpm: 128,
        desc: 'Resonant analog synth bassline & cyber lead frequencies'
    },
    {
        id: 'void',
        name: 'DEEP VOID COMM',
        badge: 'SUB-HARMONIC',
        freq: 88.5,
        color: '#bf5af2',
        bpm: 60,
        desc: 'Cosmic ambient drone with slow lowpass filter sweeps'
    }
];

const SECRET_FREQUENCIES = [
    {
        freq: 99.9,
        name: 'WARGAMES DEFCON-1',
        badge: 'TOP SECRET // NOFORN',
        color: '#ff3b30',
        reward: 'WARGAMES_DECRYPTOR',
        rewardCoins: 2500,
        desc: 'Classified emergency defense broadcast override'
    }
];

const PirateRadioWidget = () => {
    const { showToast } = useToast() || { showToast: console.log };
    const { shopState, setShopState, unlockLore, addCoins } = useGamification() || {};
    const skin = shopState?.equipped?.radio_skin || 'radio_cyber';

    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState('PRESETS'); // PRESETS | MANUAL
    const [frequency, setFrequency] = useState(104.2);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [activeStation, setActiveStation] = useState(STATIONS[0]);
    const [signalStrength, setSignalStrength] = useState(100);
    const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);

    // Audio & Synth References
    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);
    const staticGainRef = useRef(null);
    const staticSourceRef = useRef(null);
    const analyserRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const stepTimerRef = useRef(null);
    const stepIndexRef = useRef(0);

    // Setup Web Audio Graph
    const initAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(volume, ctx.currentTime);

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;

            masterGain.connect(analyser);
            analyser.connect(ctx.destination);

            // Procedural Static Noise Generator (for tuning crackle)
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1400, ctx.currentTime);
            noiseFilter.Q.setValueAtTime(2.0, ctx.currentTime);

            const staticGain = ctx.createGain();
            staticGain.gain.setValueAtTime(0, ctx.currentTime);

            whiteNoise.connect(noiseFilter);
            noiseFilter.connect(staticGain);
            staticGain.connect(analyser);
            whiteNoise.start();

            audioCtxRef.current = ctx;
            masterGainRef.current = masterGain;
            staticGainRef.current = staticGain;
            staticSourceRef.current = whiteNoise;
            analyserRef.current = analyser;
        }

        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, [volume]);

    // Note Playback Utility
    const triggerTone = (freq, type, duration, vol = 0.12, decay = true) => {
        const ctx = audioCtxRef.current;
        const master = masterGainRef.current;
        if (!ctx || !master || isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol * volume, now + 0.008);
        if (decay) {
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        } else {
            gain.gain.linearRampToValueAtTime(0.0001, now + duration);
        }

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + duration);
    };

    // Kick Generator
    const triggerKick = (vol = 0.25) => {
        const ctx = audioCtxRef.current;
        const master = masterGainRef.current;
        if (!ctx || !master || isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.14);

        gain.gain.setValueAtTime(vol * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + 0.16);
    };

    // High Hat Generator
    const triggerHat = (vol = 0.04) => {
        const ctx = audioCtxRef.current;
        const master = masterGainRef.current;
        if (!ctx || !master || isMuted) return;

        // Band-passed white noise or ultra high ping
        triggerTone(8000, 'triangle', 0.03, vol * 0.8, true);
    };

    // Procedural Sequencer Engine
    const stepSequence = useCallback(() => {
        if (!isPlaying || !activeStation) return;
        const step = stepIndexRef.current % 16;
        stepIndexRef.current++;

        if (activeStation.id === 'synthwave') {
            // Norad Synthwave: 16th-note arpeggiator over Am - F - C - G
            const chord = Math.floor(step / 4);
            const notes = [
                [220, 261.63, 329.63, 440], // Am
                [174.61, 220, 261.63, 349.23], // F
                [261.63, 329.63, 392, 523.25], // C
                [196, 246.94, 293.66, 392]  // G
            ][chord];

            const noteFreq = notes[step % 4];
            triggerTone(noteFreq, 'sawtooth', 0.1, 0.08);

            // Sub kick on beat 0 and 8
            if (step === 0 || step === 8) {
                triggerKick(0.25);
            }
            // Crisp hat on 16th off-beats
            if (step % 2 === 1) {
                triggerHat(0.04);
            }
        } else if (activeStation.id === 'radar') {
            // Pentagon Radar: Tactical sonar pings & telemetry
            if (step === 0) {
                // Sonar radar pulse (880Hz -> 440Hz)
                triggerTone(880, 'sine', 0.35, 0.14);
            } else if (step === 8) {
                triggerTone(1760, 'sine', 0.18, 0.08);
            } else if (step === 12 || step === 14) {
                triggerTone(2200, 'triangle', 0.05, 0.05);
            }
            // Deep sub-harmonic pulse
            if (step === 0 || step === 8) {
                triggerTone(55, 'sine', 0.25, 0.18);
            }
        } else if (activeStation.id === 'horizon') {
            // Neon Horizon: Fast 128bpm retrowave driving bassline
            const bassNotes = [110, 110, 130.81, 110, 146.83, 110, 164.81, 130.81];
            const currentBass = bassNotes[step % 8];
            triggerTone(currentBass, 'sawtooth', 0.12, 0.12);

            if (step % 4 === 0) {
                triggerKick(0.28);
            }
            if (step % 4 === 2) {
                triggerTone(3000, 'triangle', 0.06, 0.07); // Snare snap
            }
            if (step === 4 || step === 12) {
                triggerTone(440, 'square', 0.14, 0.06); // Lead fill
            }
        } else if (activeStation.id === 'void') {
            // Deep Void Comm: slow ethereal drone
            if (step === 0) {
                triggerTone(65.41, 'sine', 0.8, 0.22); // C2
                triggerTone(98.0, 'sine', 0.8, 0.15);  // G2
            } else if (step === 8) {
                triggerTone(110.0, 'sine', 0.7, 0.15); // A2
                triggerTone(164.81, 'triangle', 0.6, 0.08);
            }
        } else if (activeStation.id === 'secret_wargames') {
            // Wargames DEFCON 1: Rapid classified computer war telemetry
            const secretNotes = [1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093];
            const f = secretNotes[step % secretNotes.length];
            triggerTone(f, 'square', 0.06, 0.09);
            if (step % 4 === 0) {
                triggerKick(0.3);
                triggerTone(440, 'sawtooth', 0.18, 0.15);
            }
        }
    }, [isPlaying, activeStation, isMuted, volume]);

    // Sequencer interval clock
    useEffect(() => {
        if (!isPlaying) {
            if (stepTimerRef.current) clearInterval(stepTimerRef.current);
            return;
        }

        const intervalMs = activeStation ? Math.max(60, Math.floor(60000 / (activeStation.bpm * 4))) : 125;
        stepTimerRef.current = setInterval(stepSequence, intervalMs);

        return () => {
            if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        };
    }, [isPlaying, activeStation, stepSequence]);

    // Tuner Frequency & Static Logic
    useEffect(() => {
        const exactStation = STATIONS.find(s => Math.abs(s.freq - frequency) < 0.25);
        const secretStation = SECRET_FREQUENCIES.find(s => Math.abs(s.freq - frequency) < 0.15);

        if (secretStation) {
            setSignalStrength(100);
            if (staticGainRef.current) staticGainRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);

            if (activeStation?.id !== 'secret_wargames') {
                setActiveStation({
                    id: 'secret_wargames',
                    name: secretStation.name,
                    badge: secretStation.badge,
                    freq: secretStation.freq,
                    color: secretStation.color,
                    bpm: 140,
                    desc: secretStation.desc
                });

                if (!isSecretUnlocked) {
                    setIsSecretUnlocked(true);
                    showToast(`DEFCON-1 OVERRIDE: ${secretStation.name} DECODED! +${secretStation.rewardCoins} CP`, 'win');
                    if (addCoins) addCoins(secretStation.rewardCoins);
                    if (unlockLore) unlockLore('pentagon_wargames_signal');
                    if (setShopState) {
                        setShopState(prev => ({
                            ...prev,
                            unlocked: [...new Set([...(prev?.unlocked || []), 'pentagon_wargames_badge'])]
                        }));
                    }
                }
            }
            return;
        }

        if (exactStation) {
            const dist = Math.abs(exactStation.freq - frequency);
            const strength = Math.round(Math.max(0, (1 - dist / 0.25) * 100));
            setSignalStrength(strength);

            // Fine tuning: near zero static when strength > 90%
            const staticAmount = ((100 - strength) / 100) * 0.08;
            if (staticGainRef.current && audioCtxRef.current) {
                staticGainRef.current.gain.setValueAtTime(staticAmount, audioCtxRef.current.currentTime);
            }

            if (activeStation?.id !== exactStation.id) {
                setActiveStation(exactStation);
            }
        } else {
            // Static / White Noise
            setSignalStrength(0);
            if (staticGainRef.current && audioCtxRef.current) {
                staticGainRef.current.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);
            }
            if (activeStation?.id !== 'static') {
                setActiveStation({
                    id: 'static',
                    name: 'SEARCHING CARRIER...',
                    badge: 'STATIC NOISE',
                    freq: frequency,
                    color: '#666',
                    bpm: 60,
                    desc: 'Tune frequency dial to lock on classified comm channels'
                });
            }
        }
    }, [frequency, activeStation, isSecretUnlocked, addCoins, unlockLore, setShopState, showToast]);

    // Canvas Oscilloscope / Spectrum Visualizer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId;
        const render = () => {
            animationId = requestAnimationFrame(render);
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Subtle scanline grid
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            const analyser = analyserRef.current;
            const themeColor = activeStation?.color || '#00f0ff';

            if (isPlaying && analyser) {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);

                const barWidth = (width / bufferLength) * 1.5;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * (height * 0.85);

                    const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
                    grad.addColorStop(0, `${themeColor}22`);
                    grad.addColorStop(1, themeColor);

                    ctx.fillStyle = grad;
                    ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

                    // Peak cap
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(x, height - barHeight - 2, barWidth - 2, 1.5);

                    x += barWidth;
                }
            } else {
                // Idle flat green line
                ctx.strokeStyle = themeColor;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.stroke();
            }
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying, activeStation]);

    // Play/Pause Action
    const togglePlayback = () => {
        initAudioContext();
        setIsPlaying(!isPlaying);
    };

    // Station Switcher
    const selectStation = (station) => {
        initAudioContext();
        setFrequency(station.freq);
        setActiveStation(station);
        setIsPlaying(true);
    };

    // Volume adjustment
    const handleVolumeChange = (newVol) => {
        setVolume(newVol);
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : newVol, audioCtxRef.current.currentTime);
        }
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setValueAtTime(nextMute ? 0 : volume, audioCtxRef.current.currentTime);
        }
    };

    // Theme Styles
    const getStyles = () => {
        if (skin === 'radio_gold') {
            return {
                bg: 'linear-gradient(145deg, #1f1a0e, #0c0a06)',
                border: '#ffd700',
                accent: '#ffd700',
                shadow: '0 0 25px rgba(255, 215, 0, 0.35)'
            };
        }
        if (skin === 'radio_dev') {
            return {
                bg: 'linear-gradient(145deg, #051405, #000)',
                border: '#00ff66',
                accent: '#00ff66',
                shadow: '0 0 25px rgba(0, 255, 102, 0.3)'
            };
        }
        return {
            bg: 'linear-gradient(145deg, #0a1120, #040810)',
            border: '#00f0ff',
            accent: '#00f0ff',
            shadow: '0 0 30px rgba(0, 240, 255, 0.35)'
        };
    };

    const styles = getStyles();

    return (
        <>
            {/* FLOATING HUD TOGGLE PILL */}
            {!isOpen && (
                <motion.button
                    initial={{ y: 0 }}
                    animate={{ y: isPlaying ? [0, -3, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    onClick={() => {
                        initAudioContext();
                        setIsOpen(true);
                    }}
                    style={{
                        position: 'fixed',
                        bottom: '22px',
                        left: '22px',
                        background: 'rgba(8, 12, 22, 0.92)',
                        border: `1.5px solid ${styles.border}`,
                        borderRadius: '30px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        zIndex: 9000,
                        boxShadow: styles.shadow,
                        backdropFilter: 'blur(16px)',
                        fontFamily: '"Orbitron", monospace',
                        color: '#fff'
                    }}
                    title="Open Pentagon Tactical Radio & Comms Deck"
                >
                    {/* Pulsing Tactical Signal Indicator */}
                    <div style={{ position: 'relative', width: '12px', height: '12px' }}>
                        <span style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: isPlaying ? styles.accent : '#666',
                            boxShadow: isPlaying ? `0 0 10px ${styles.accent}` : 'none'
                        }} />
                        {isPlaying && (
                            <motion.span
                                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                style={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    border: `1.5px solid ${styles.accent}`
                                }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.62rem', color: styles.accent, letterSpacing: '1px', fontWeight: 'bold' }}>
                            {isPlaying ? 'COMMS ONLINE' : 'PENTAGON COMMS'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.5px' }}>
                            {activeStation?.freq ? `${activeStation.freq.toFixed(1)} FM` : 'RADIO'}
                        </span>
                    </div>

                    {/* Animated Mini Waveform */}
                    {isPlaying && (
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '16px', marginLeft: '4px' }}>
                            <motion.div animate={{ height: ['20%', '90%', '40%'] }} transition={{ repeat: Infinity, duration: 0.4 }} style={{ width: '3px', background: styles.accent, borderRadius: '2px' }} />
                            <motion.div animate={{ height: ['60%', '20%', '100%'] }} transition={{ repeat: Infinity, duration: 0.55 }} style={{ width: '3px', background: styles.accent, borderRadius: '2px' }} />
                            <motion.div animate={{ height: ['90%', '30%', '70%'] }} transition={{ repeat: Infinity, duration: 0.45 }} style={{ width: '3px', background: styles.accent, borderRadius: '2px' }} />
                        </div>
                    )}
                </motion.button>
            )}

            {/* EXPANDED PENTAGON COMMS DECK */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        style={{
                            position: 'fixed',
                            bottom: '22px',
                            left: '22px',
                            width: '340px',
                            background: styles.bg,
                            border: `1.5px solid ${styles.border}`,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            zIndex: 9001,
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 240, 255, 0.25)',
                            backdropFilter: 'blur(20px)',
                            fontFamily: '"Orbitron", monospace',
                            color: '#fff'
                        }}
                    >
                        {/* DECK HEADER */}
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={styles.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                                    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                                    <circle cx="12" cy="12" r="2" />
                                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                                    <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
                                </svg>
                                <div>
                                    <div style={{ fontSize: '0.62rem', color: styles.accent, letterSpacing: '1.5px', fontWeight: '900' }}>
                                        PENTAGON TACTICAL
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px' }}>
                                        SYNTH COMMS DECK
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#94a3b8',
                                    borderRadius: '8px',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* DISPLAY MONITOR */}
                        <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.65)', position: 'relative' }}>
                            {/* Frequency & Signal Badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: '900',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: `${activeStation?.color || '#00f0ff'}22`,
                                    border: `1px solid ${activeStation?.color || '#00f0ff'}66`,
                                    color: activeStation?.color || '#00f0ff'
                                }}>
                                    {activeStation?.badge || 'MONITOR'}
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.62rem', color: signalStrength > 70 ? '#00ff88' : '#ff9500', fontWeight: 'bold' }}>
                                        SIG: {signalStrength}%
                                    </span>
                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '10px' }}>
                                        <div style={{ width: '3px', height: '30%', background: signalStrength > 20 ? '#00ff88' : '#444' }} />
                                        <div style={{ width: '3px', height: '60%', background: signalStrength > 50 ? '#00ff88' : '#444' }} />
                                        <div style={{ width: '3px', height: '100%', background: signalStrength > 80 ? '#00ff88' : '#444' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Station Name & Frequency */}
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: '900',
                                letterSpacing: '1px',
                                color: '#fff',
                                textShadow: `0 0 12px ${activeStation?.color || '#00f0ff'}`,
                                marginBottom: '4px'
                            }}>
                                {activeStation?.name || 'SEARCHING...'}
                            </div>

                            <div style={{
                                fontSize: '0.68rem',
                                color: '#94a3b8',
                                marginBottom: '14px',
                                height: '28px',
                                lineHeight: '14px',
                                overflow: 'hidden'
                            }}>
                                {activeStation?.desc}
                            </div>

                            {/* Real-Time Audio Canvas Visualizer */}
                            <div style={{
                                width: '100%',
                                height: '54px',
                                background: '#020408',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <canvas
                                    ref={canvasRef}
                                    width={308}
                                    height={54}
                                    style={{ width: '100%', height: '100%', display: 'block' }}
                                />
                            </div>
                        </div>

                        {/* ANALOG TUNER / FREQUENCY SLIDER (when MANUAL mode) */}
                        {mode === 'MANUAL' && (
                            <div style={{ padding: '12px 16px', background: 'rgba(0, 0, 0, 0.85)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '1px' }}>TUNER DIAL</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: styles.accent }}>
                                        {frequency.toFixed(1)} <span style={{ fontSize: '0.65rem' }}>FM</span>
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min="88.0"
                                    max="108.0"
                                    step="0.1"
                                    value={frequency}
                                    onChange={(e) => {
                                        initAudioContext();
                                        setFrequency(parseFloat(e.target.value));
                                    }}
                                    style={{
                                        width: '100%',
                                        accentColor: styles.accent,
                                        cursor: 'pointer'
                                    }}
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#666', marginTop: '4px' }}>
                                    <span>88.0</span>
                                    <span>98.0</span>
                                    <span style={{ color: '#ff3b30' }}>99.9 CLASSIFIED</span>
                                    <span>108.0</span>
                                </div>
                            </div>
                        )}

                        {/* QUICK PRESETS STRIP (when PRESETS mode) */}
                        {mode === 'PRESETS' && (
                            <div style={{
                                padding: '10px 14px',
                                background: 'rgba(0, 0, 0, 0.75)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '6px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                            }}>
                                {STATIONS.map(s => {
                                    const isSelected = activeStation?.id === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => selectStation(s)}
                                            style={{
                                                background: isSelected ? `${s.color}25` : 'rgba(255, 255, 255, 0.04)',
                                                border: isSelected ? `1.5px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                padding: '6px 8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                cursor: 'pointer',
                                                boxShadow: isSelected ? `0 0 10px ${s.color}44` : 'none'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.62rem', fontWeight: '900', color: isSelected ? s.color : '#cbd5e1' }}>
                                                {s.name}
                                            </span>
                                            <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: 'monospace' }}>
                                                {s.freq.toFixed(1)} FM
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* MASTER CONTROLS DECK */}
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(0, 0, 0, 0.95)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            {/* Mode Toggle & Secret Hint */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => setMode(mode === 'PRESETS' ? 'MANUAL' : 'PRESETS')}
                                    style={{
                                        background: mode === 'MANUAL' ? `${styles.accent}25` : 'rgba(255, 255, 255, 0.06)',
                                        border: `1px solid ${mode === 'MANUAL' ? styles.accent : 'rgba(255, 255, 255, 0.15)'}`,
                                        color: mode === 'MANUAL' ? styles.accent : '#94a3b8',
                                        borderRadius: '8px',
                                        padding: '6px 10px',
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {mode === 'PRESETS' ? 'MANUAL TUNER' : 'PRESET LIST'}
                                </button>

                                {/* Volume Slider Toggle */}
                                <button
                                    onClick={toggleMute}
                                    style={{
                                        background: isMuted ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                        border: `1px solid ${isMuted ? '#ff3b30' : 'rgba(255, 255, 255, 0.15)'}`,
                                        color: isMuted ? '#ff3b30' : '#cbd5e1',
                                        borderRadius: '8px',
                                        padding: '6px 8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Main Power Play / Pause Button */}
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.94 }}
                                onClick={togglePlayback}
                                style={{
                                    background: isPlaying ? 'linear-gradient(135deg, #ff0055, #ff5500)' : 'linear-gradient(135deg, #00f0ff, #0072ff)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '42px',
                                    height: '42px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    boxShadow: isPlaying ? '0 0 20px rgba(255, 0, 85, 0.6)' : '0 0 20px rgba(0, 240, 255, 0.6)'
                                }}
                                title={isPlaying ? 'Halt Comms Audio' : 'Transmit Comms Audio'}
                            >
                                {isPlaying ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" rx="1" />
                                        <rect x="14" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PirateRadioWidget;
