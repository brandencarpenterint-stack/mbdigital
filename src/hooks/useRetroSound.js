import { useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

const useRetroSound = () => {
    // We handle the hook check gracefull in case context is missing during tests
    let soundEnabled = true;
    try {
        const settings = useSettings();
        if (settings) soundEnabled = settings.soundEnabled;
    } catch (e) { /* ignore */ }

    // Audio Context (Lazy load)
    const audioContextRef = useRef(null);

    // Helper to check mute status
    const shouldPlay = () => soundEnabled;

    const getContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        return audioContextRef.current;
    };

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playBeep = () => playTone(800, 'square', 0.1);

    const playBoop = () => playTone(300, 'square', 0.1);

    const playJump = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    };

    const playCollect = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        // Coin sound: high rapid arpeggio
        [1200, 1600].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.1);
        });
    };

    const playCrash = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    const playWin = () => {
        if (!shouldPlay()) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        // Victory Fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);

            gain.gain.setValueAtTime(0.1, now + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.01, now + i * 0.15 + 0.4); // Long sustain

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.5);
        });
    };

    return { playBeep, playBoop, playJump, playCollect, playCrash, playWin };
};

export default useRetroSound;
