import { useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Global Singleton Web Audio Context & Master Studio Analog Bus
 * Sharing a single AudioContext across all callers prevents hitting browser
 * context limits (~6-32 instances), eliminates pop artifacts, and reduces CPU overhead.
 */
let sharedAudioCtx = null;
let sharedMasterBus = null;

const getSharedContext = () => {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            sharedAudioCtx = new AudioContextClass();
        }
    }
    return sharedAudioCtx;
};

/**
 * Master Studio Analog Bus
 * Applies warm 2400Hz analog low-pass filtering and gentle dynamics compression
 * to prevent harsh digital clipping, ear fatigue, and click artifacts.
 */
const getSharedMasterBus = (ctx) => {
    if (!ctx) return null;
    if (!sharedMasterBus || sharedMasterBus.context !== ctx) {
        // Warm Analog Biquad Filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, ctx.currentTime);
        filter.Q.setValueAtTime(1.1, ctx.currentTime);

        // Studio Dynamics Compressor
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-14, ctx.currentTime);
        compressor.knee.setValueAtTime(8, ctx.currentTime);
        compressor.ratio.setValueAtTime(3.5, ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, ctx.currentTime);
        compressor.release.setValueAtTime(0.12, ctx.currentTime);

        filter.connect(compressor);
        compressor.connect(ctx.destination);
        sharedMasterBus = filter;
    }
    return sharedMasterBus;
};

/**
 * Safe mobile tactile haptic trigger
 * Gracefully no-ops on unsupported hardware, desktop, or muted settings
 */
export const triggerHaptic = (pattern = 15) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(pattern);
        } catch {
            // Ignore restricted vibration policy
        }
    }
};

const useRetroSound = () => {
    let soundEnabled = true;
    try {
        const settings = useSettings();
        if (settings) soundEnabled = settings.soundEnabled;
    } catch { /* ignore */ }

    const shouldPlay = () => soundEnabled;

    const getContext = () => {
        const ctx = getSharedContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        return ctx;
    };

    const getBus = (ctx) => getSharedMasterBus(ctx);

    const safeHaptic = (pattern) => {
        if (!shouldPlay()) return;
        triggerHaptic(pattern);
    };

    /**
     * Primitive tone generator with soft anti-click ramps
     */
    const playTone = (freq, type, duration, vol = 0.08) => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft 4ms attack prevents popping clicks
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + duration);
    };

    // UI Click & Feedback
    const playClick = () => {
        safeHaptic(8);
        playTone(1200, 'sine', 0.03, 0.04);
    };

    const playBeep = () => {
        safeHaptic(10);
        playTone(880, 'sine', 0.08, 0.06);
    };

    const playBoop = () => {
        safeHaptic(12);
        playTone(320, 'triangle', 0.1, 0.08);
    };

    /**
     * Warm, rounded arcade bounce/jump
     */
    const playJump = () => {
        safeHaptic(14);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.16);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.16);
    };

    /**
     * Thunderous Cannon Blast (Bro Cannon launch)
     * Layered sub-bass downward sweep + filtered noise explosive pop
     */
    const playCannonBlast = () => {
        safeHaptic([40, 25, 55]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;

        // 1. Sub-bass downward shockwave
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(200, now);
        sub.frequency.exponentialRampToValueAtTime(26, now + 0.42);

        subGain.gain.setValueAtTime(0.25, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        sub.connect(subGain);
        subGain.connect(bus);
        sub.start(now);
        sub.stop(now + 0.42);

        // 2. High-impact explosive noise puff
        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.22);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(900, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.22);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(bus);
            noise.start(now);
        } catch { /* ignore buffer errors */ }
    };

    const playCannon = playCannonBlast;

    /**
     * Sci-Fi Laser Fire (Turrets, Blasters, PEW!)
     */
    const playShoot = () => {
        safeHaptic(10);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.085);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.085);
    };

    const playLaser = playShoot;

    /**
     * Explosion / Destruction Burst
     */
    const playExplosion = () => {
        safeHaptic([35, 20, 60]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;

        // Sub bass drop
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(150, now);
        sub.frequency.exponentialRampToValueAtTime(32, now + 0.38);

        subGain.gain.setValueAtTime(0.2, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        sub.connect(subGain);
        subGain.connect(bus);
        sub.start(now);
        sub.stop(now + 0.38);

        // Filtered noise crunch
        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.3);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.16, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            noise.connect(noiseGain);
            noiseGain.connect(bus);
            noise.start(now);
        } catch { /* ignore */ }
    };

    /**
     * Shimmering crystal coin collect
     */
    const playCollect = () => {
        safeHaptic(8);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;

        [1174.66, 1760.00].forEach((freq, i) => { // D6 -> A6
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0.001, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.09, now + i * 0.08 + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.12);
        });
    };

    /**
     * Triple-tone sparkling coin pickup
     */
    const playCoin = () => {
        safeHaptic(6);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;
        const freqs = [987.77, 1318.51]; // B5 -> E6
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0.001, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.08, now + i * 0.05 + 0.004);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.1);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.1);
        });
    };

    /**
     * Low-end rumble impact with filtered noise
     */
    const playCrash = () => {
        safeHaptic([30, 20, 45]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;

        // Sub bass drop
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(140, now);
        sub.frequency.exponentialRampToValueAtTime(35, now + 0.35);

        subGain.gain.setValueAtTime(0.18, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        sub.connect(subGain);
        subGain.connect(bus);
        sub.start(now);
        sub.stop(now + 0.35);

        // Filtered noise crunch
        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.25);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.12, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            noise.connect(noiseGain);
            noiseGain.connect(bus);
            noise.start(now);
        } catch { /* ignore */ }
    };

    /**
     * Ascending melodic victory fanfare
     */
    const playWin = () => {
        safeHaptic([20, 25, 20, 30, 60]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.11);

            gain.gain.setValueAtTime(0.001, now + i * 0.11);
            gain.gain.linearRampToValueAtTime(0.08, now + i * 0.11 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.32);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + i * 0.11);
            osc.stop(now + i * 0.11 + 0.32);
        });
    };

    /**
     * Triumphant Power-Up Arpeggio
     */
    const playPowerUp = () => {
        safeHaptic([15, 20, 25, 40]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const notes = [440.00, 554.37, 659.25, 880.00]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);

            gain.gain.setValueAtTime(0.001, now + i * 0.07);
            gain.gain.linearRampToValueAtTime(0.09, now + i * 0.07 + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.2);
        });
    };

    /**
     * Celebratory Grand Fanfare
     */
    const playFanfare = () => {
        safeHaptic([25, 30, 25, 40, 80]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const chords = [
            { freqs: [523.25, 659.25], start: 0, dur: 0.18 },
            { freqs: [587.33, 739.99], start: 0.14, dur: 0.18 },
            { freqs: [659.25, 783.99, 1046.50], start: 0.28, dur: 0.55 }
        ];

        chords.forEach(({ freqs, start, dur }) => {
            freqs.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + start);

                gain.gain.setValueAtTime(0.001, now + start);
                gain.gain.linearRampToValueAtTime(0.06, now + start + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

                osc.connect(gain);
                gain.connect(bus);
                osc.start(now + start);
                osc.stop(now + start + dur);
            });
        });
    };

    /**
     * Snappy combat hit / strike
     */
    const playHit = () => {
        safeHaptic(18);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.12);
    };

    /**
     * Dissonant error buzz
     */
    const playError = () => {
        safeHaptic([40, 30, 40]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        [140, 148].forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(bus);
            osc.start(now);
            osc.stop(now + 0.18);
        });
    };

    /**
     * Two-part ascending crystal Xbox chime
     */
    const playXboxChime = () => {
        safeHaptic([15, 20, 35]);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const chimeNotes = [
            { freq: 987.77, start: 0, dur: 0.35, vol: 0.11 }, // B5
            { freq: 1479.98, start: 0.08, dur: 0.85, vol: 0.14 } // F#6
        ];

        chimeNotes.forEach(({ freq, start, dur, vol }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + start);

            gain.gain.setValueAtTime(0.001, now + start);
            gain.gain.linearRampToValueAtTime(vol, now + start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + start);
            osc.stop(now + start + dur);
        });
    };

    const playBoing = () => {
        safeHaptic(14);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.09);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.32);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.32);
    };

    const playFire = () => {
        safeHaptic(10);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.1);
    };

    const playZap = () => {
        safeHaptic(12);
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (!ctx) return;
        const bus = getBus(ctx);
        if (!bus) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.18);
    };

    const playWater = () => playTone(440, 'sine', 0.15, 0.06);
    const playGlitch = () => playTone(620, 'triangle', 0.06, 0.05);
    const playGhost = () => playTone(540, 'sine', 0.4, 0.05);
    const playAirhorn = () => playTone(440, 'triangle', 0.25, 0.08);

    return {
        playBeep,
        playBoop,
        playJump,
        playCollect,
        playCoin,
        playCrash,
        playWin,
        playClick,
        playCannon,
        playCannonBlast,
        playShoot,
        playLaser,
        playExplosion,
        playHit,
        playPowerUp,
        playFanfare,
        playError,
        playFire,
        playWater,
        playZap,
        playGlitch,
        playGhost,
        playAirhorn,
        playBoing,
        playXboxChime,
        triggerHaptic: safeHaptic
    };
};

export default useRetroSound;
