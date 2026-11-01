/**
 * Cyber Radio Procedural Web Audio Synthwave Beats Engine
 * Synthesizes 100% procedurally generated chiptune & synthwave grooves at 100, 128, and 140 BPM.
 * Zero external audio files required. Real-time beat subscription for mascot & companion dance animations.
 */

let audioCtx = null;
let isPlaying = false;
let currentBpm = 128;
let nextNoteTime = 0;
let currentStep = 0; // 0 to 15 (16th notes)
let timerId = null;
let beatListeners = new Set();
let visualizerEnergy = 0;

const getAudioContext = () => {
    if (!audioCtx || audioCtx.state === 'closed') {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) {
            audioCtx = new AudioClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
};

// Bass scale notes (in Hz)
const SCALES = {
    100: [110.0, 110.0, 130.81, 146.83, 164.81, 196.0], // A Minor Chill
    128: [130.81, 146.83, 164.81, 174.61, 196.0, 220.0], // C Synthwave Electro
    140: [98.0, 116.54, 130.81, 146.83, 164.81, 196.0]   // G Dark Industrial
};

// Play synthesized kick
const playKick = (ctx, time, intensity = 1.0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

    gain.gain.setValueAtTime(0.28 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.24);
};

// Play synthesized snare / clap
const playSnare = (ctx, time, intensity = 1.0) => {
    // Noise buffer
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + 0.15);
};

// Play synthesized hi-hat
const playHiHat = (ctx, time, isOpen = false) => {
    const bufferSize = ctx.sampleRate * (isOpen ? 0.12 : 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = ctx.createGain();
    const duration = isOpen ? 0.1 : 0.035;
    gain.gain.setValueAtTime(isOpen ? 0.08 : 0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + duration + 0.01);
};

// Play synthesized synth bass / arp note
const playBassNote = (ctx, time, freq, duration = 0.16) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = currentBpm === 140 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(currentBpm === 140 ? 1200 : 750, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + duration);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
};

// Scheduler step
const scheduleStep = (ctx, step, time) => {
    const scale = SCALES[currentBpm] || SCALES[128];

    // Kick patterns
    if (currentBpm === 128) {
        // Four on the floor
        if (step % 4 === 0) playKick(ctx, time, 1.0);
    } else if (currentBpm === 140) {
        // Fast industrial driving
        if (step % 4 === 0 || step === 14) playKick(ctx, time, 1.1);
    } else {
        // 100 BPM Lofi: 0, 6, 10
        if (step === 0 || step === 6 || step === 10) playKick(ctx, time, 0.9);
    }

    // Snare on 4 and 12
    if (step === 4 || step === 12) {
        playSnare(ctx, time, 1.0);
    }

    // Hi-hats
    if (currentBpm === 140) {
        playHiHat(ctx, time, step % 4 === 2);
    } else {
        if (step % 2 === 0) playHiHat(ctx, time, step === 2 || step === 10);
    }

    // Bassline note
    if (step % 2 === 0) {
        const noteIndex = Math.floor((step / 2) % scale.length);
        const freq = scale[noteIndex];
        playBassNote(ctx, time, freq, 0.14);
    }

    // Notify listeners on quarter notes (beats)
    if (step % 4 === 0) {
        visualizerEnergy = 1.0;
        const beatNum = Math.floor(step / 4);
        beatListeners.forEach(listener => {
            try {
                listener({ beat: beatNum, bpm: currentBpm, time });
            } catch (e) {
                // Ignore listener errors
            }
        });
    }
};

const scheduler = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const secondsPer16th = (60.0 / currentBpm) / 4;

    while (nextNoteTime < ctx.currentTime + 0.12) {
        scheduleStep(ctx, currentStep, nextNoteTime);
        nextNoteTime += secondsPer16th;
        currentStep = (currentStep + 1) % 16;
    }

    if (isPlaying) {
        timerId = setTimeout(scheduler, 25);
    }
};

export const startCyberRadio = (bpm = 128) => {
    const ctx = getAudioContext();
    if (!ctx) return false;

    currentBpm = bpm;
    isPlaying = true;
    currentStep = 0;
    nextNoteTime = ctx.currentTime + 0.05;

    if (timerId) clearTimeout(timerId);
    scheduler();
    return true;
};

export const stopCyberRadio = () => {
    isPlaying = false;
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

export const setCyberRadioBPM = (bpm) => {
    currentBpm = bpm;
};

export const isCyberRadioPlaying = () => isPlaying;

export const getCyberRadioBPM = () => currentBpm;

export const subscribeBeat = (callback) => {
    beatListeners.add(callback);
    return () => beatListeners.delete(callback);
};

export const getVisualizerEnergy = () => {
    visualizerEnergy = Math.max(0, visualizerEnergy * 0.92);
    return visualizerEnergy;
};
