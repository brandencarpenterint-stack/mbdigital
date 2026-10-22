import { useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

const useRetroSound = () => {
    let soundEnabled = true;
    try {
        const settings = useSettings();
        if (settings) soundEnabled = settings.soundEnabled;
    } catch { /* ignore */ }

    const audioContextRef = useRef(null);

    const shouldPlay = () => soundEnabled;

    const getContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        return audioContextRef.current;
    };

    /**
     * Master Studio Analog Bus
     * Applies warm 2400Hz analog low-pass filtering and gentle dynamics compression
     * to prevent harsh digital clipping, ear fatigue, and click artifacts.
     */
    const getMasterBus = (ctx) => {
        if (!ctx._masterBus) {
            // Warm Analog Biquad Filter
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2400, ctx.currentTime);
            filter.Q.setValueAtTime(1.2, ctx.currentTime);

            // Studio Dynamics Compressor
            const compressor = ctx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-14, ctx.currentTime);
            compressor.knee.setValueAtTime(8, ctx.currentTime);
            compressor.ratio.setValueAtTime(3.5, ctx.currentTime);
            compressor.attack.setValueAtTime(0.004, ctx.currentTime);
            compressor.release.setValueAtTime(0.12, ctx.currentTime);

            filter.connect(compressor);
            compressor.connect(ctx.destination);
            ctx._masterBus = filter;
        }
        return ctx._masterBus;
    };

    const playTone = (freq, type, duration, vol = 0.08) => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const bus = getMasterBus(ctx);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft 4ms attack prevents popping clicks
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + duration);
    };

    const playBeep = () => playTone(880, 'sine', 0.08, 0.07);

    const playBoop = () => playTone(320, 'triangle', 0.1, 0.08);

    // Warm, rounded arcade bounce/jump
    const playJump = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const bus = getMasterBus(ctx);
        const now = ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.16);
    };

    // Shimmering crystal coin collect
    const playCollect = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const bus = getMasterBus(ctx);
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

    // Low-end rumble impact with filtered noise
    const playCrash = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const bus = getMasterBus(ctx);
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
    };

    // Ascending melodic victory fanfare
    const playWin = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);

            gain.gain.setValueAtTime(0.001, now + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

            osc.connect(gain);
            gain.connect(bus);

            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.35);
        });
    };

    const playClick = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.025);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(bus);

        osc.start(now);
        osc.stop(now + 0.025);
    };

    // Two-part ascending crystal Xbox chime
    const playXboxChime = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
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
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
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
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
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
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const bus = getMasterBus(ctx);
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
        playBeep, playBoop, playJump, playCollect, playCrash, playWin, playClick,
        playFire, playWater, playZap, playGlitch, playGhost, playAirhorn, playBoing,
        playXboxChime
    };
};

export default useRetroSound;
