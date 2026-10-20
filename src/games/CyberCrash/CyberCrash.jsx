import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 420;

// Character skins for cockpit selection & bots
const BRO_PILOTS = [
    { id: 'dino', name: 'Turbo Dino', skin: '/assets/skins/face_dino.png', color: '#00ff66' },
    { id: 'bunny', name: 'Cyber Bunny', skin: '/assets/skins/face_bunny.png', color: '#ff007f' },
    { id: 'money', name: 'Whale Bro', skin: '/assets/skins/face_money.png', color: '#ffd700' },
    { id: 'star', name: 'Super Star', skin: '/assets/skins/face_star.png', color: '#00e5ff' },
    { id: 'cat', name: 'Astro Neko', skin: '/assets/skins/face_cat.png', color: '#d500f9' }
];

const BOT_NAMES = ['VaporPilot', 'MatrixHustler', 'CryptoKev', 'ZeroG_Bro', 'NeonRider'];

const CyberCrash = () => {
    const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const engineOscRef = useRef(null);
    const engineGainRef = useRef(null);
    const animIdRef = useRef(null);
    const pilotImagesRef = useRef({});

    // Game Loop & Round State
    const [gameState, setGameState] = useState('waiting'); // 'waiting', 'countdown', 'flying', 'crashed'
    const [multiplier, setMultiplier] = useState(1.00);
    const [wager, setWager] = useState(100);
    const [autoCashout, setAutoCashout] = useState(2.00);
    const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(true);
    const [hasBet, setHasBet] = useState(false);
    const [cashedOut, setCashedOut] = useState(false);
    const [cashedOutMultiplier, setCashedOutMultiplier] = useState(null);
    const [cashedOutAmount, setCashedOutAmount] = useState(0);
    const [selectedPilot, setSelectedPilot] = useState(BRO_PILOTS[0]);
    const [roundHistory, setRoundHistory] = useState([1.85, 3.42, 1.12, 12.50, 2.10, 1.45, 5.80, 1.05]);
    const [countdown, setCountdown] = useState(5);
    const [bots, setBots] = useState([]);

    // Physics & flight refs
    const flightRef = useRef({
        startTime: 0,
        crashPoint: 2.0,
        currentMultiplier: 1.0,
        particles: [],
        stars: [],
        shake: 0
    });

    // Initialize Starfield
    useEffect(() => {
        const stars = [];
        for (let i = 0; i < 90; i++) {
            stars.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                size: Math.random() * 2 + 0.8,
                speed: Math.random() * 1.5 + 0.5,
                color: Math.random() > 0.7 ? '#00e5ff' : (Math.random() > 0.5 ? '#ff007f' : '#ffffff')
            });
        }
        flightRef.current.stars = stars;
    }, []);

    // Preload pilot skins
    useEffect(() => {
        BRO_PILOTS.forEach(p => {
            const img = new Image();
            img.src = p.skin;
            img.onload = () => {
                pilotImagesRef.current[p.id] = img;
            };
        });
    }, []);

    // Web Audio Engine Sound Synthesis
    const startEngineSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, ctx.currentTime);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            engineOscRef.current = osc;
            engineGainRef.current = gain;
        } catch (e) {
            console.error('Audio init error', e);
        }
    };

    const updateEngineSound = (mult) => {
        if (!engineOscRef.current || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        // Pitch rises smoothly from 80Hz up to 600Hz as multiplier increases
        const freq = Math.min(650, 80 + (mult - 1) * 35);
        engineOscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
    };

    const stopEngineSound = () => {
        try {
            if (engineOscRef.current) {
                engineOscRef.current.stop();
                engineOscRef.current.disconnect();
                engineOscRef.current = null;
            }
        } catch (e) {}
    };

    const playBeep = (freq = 440) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    };

    // Generate Provably-Fair Crash Point
    const generateCrashPoint = () => {
        const rand = Math.random();
        // 4% instant crash at 1.00x - 1.05x
        if (rand < 0.04) return 1.00 + Math.random() * 0.05;
        // Exponential distribution with 96% RTP
        const e = 100 / (100 - rand * 96);
        return Math.max(1.01, parseFloat(e.toFixed(2)));
    };

    // Generate simulated online bots
    const generateBots = () => {
        return BOT_NAMES.map((name, i) => {
            const pilot = BRO_PILOTS[i % BRO_PILOTS.length];
            const botWager = [50, 100, 250, 500, 1000][Math.floor(Math.random() * 5)];
            const targetCashout = parseFloat((1.2 + Math.random() * 3.5).toFixed(2));
            return {
                id: 'bot_' + i,
                name,
                pilot,
                wager: botWager,
                targetCashout,
                cashedOut: false,
                cashedOutMultiplier: null
            };
        });
    };

    // Start New Countdown
    const startCountdown = () => {
        setGameState('countdown');
        setCountdown(4);
        setMultiplier(1.00);
        setCashedOut(false);
        setCashedOutMultiplier(null);
        setCashedOutAmount(0);

        const newBots = generateBots();
        setBots(newBots);

        let count = 4;
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            playBeep(count === 0 ? 880 : 440);

            if (count <= 0) {
                clearInterval(timer);
                launchRocket();
            }
        }, 1000);
    };

    // Launch Rocket Round
    const launchRocket = () => {
        setGameState('flying');
        const crash = generateCrashPoint();
        flightRef.current.crashPoint = crash;
        flightRef.current.startTime = Date.now();
        flightRef.current.currentMultiplier = 1.00;
        flightRef.current.particles = [];
        flightRef.current.shake = 0;

        startEngineSound();
    };

    // Place Bet
    const handlePlaceBet = () => {
        if (wager <= 0) {
            showToast('Enter a valid wager!', 'error');
            return;
        }
        if ((coins ?? 0) < wager) {
            showToast('Insufficient Cyber Points!', 'error');
            return;
        }

        if (addCoins) addCoins(-wager);
        setHasBet(true);
        playCollect();
        showToast(`Bet placed: ${wager} CP on ${selectedPilot.name}!`, 'info');

        if (incrementStat) {
            incrementStat('crashGames', 1);
            incrementStat('gamesPlayedCount', 1);
        }
    };

    // Bail Out / Cashout
    const handleCashout = () => {
        if (!hasBet || cashedOut || gameState !== 'flying') return;

        const currentMult = flightRef.current.currentMultiplier;
        const winAmount = Math.floor(wager * currentMult);

        setCashedOut(true);
        setCashedOutMultiplier(currentMult);
        setCashedOutAmount(winAmount);

        if (addCoins) addCoins(winAmount);
        playWin();

        if (currentMult >= 5.0) {
            playAirhorn();
            triggerConfetti();
        }

        showToast(`🚀 BAILED OUT AT ${currentMult.toFixed(2)}x! Won +${winAmount} CP!`, 'success');

        // Stats & Global Feed
        if (incrementStat) incrementStat('crashWins', 1);
        const currentHS = stats?.crashHighScore || 0;
        if (currentMult > currentHS && updateStat) {
            updateStat('crashHighScore', parseFloat(currentMult.toFixed(2)));
        }

        feedService.broadcast('arcade_win', {
            player: userProfile?.name || 'CyberBro',
            game: 'Cyber Crash',
            coinsWon: winAmount,
            avatar: selectedPilot.skin
        });
    };

    // Auto-start countdown on mount
    useEffect(() => {
        startCountdown();
        return () => {
            stopEngineSound();
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        };
    }, []);

    // 60FPS Flight Physics & Canvas Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const loop = () => {
            const flight = flightRef.current;

            // Clear Canvas
            ctx.fillStyle = '#060714';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Screen Shake
            ctx.save();
            if (flight.shake > 0) {
                const sx = (Math.random() - 0.5) * flight.shake;
                const sy = (Math.random() - 0.5) * flight.shake;
                ctx.translate(sx, sy);
                flight.shake *= 0.92;
                if (flight.shake < 0.2) flight.shake = 0;
            }

            // Starfield Simulation
            const speedFactor = gameState === 'flying' ? Math.min(8, 1 + (flight.currentMultiplier - 1) * 1.5) : 1;
            flight.stars.forEach(st => {
                st.x -= st.speed * speedFactor;
                st.y += (st.speed * 0.4) * speedFactor;
                if (st.x < 0) st.x = CANVAS_WIDTH;
                if (st.y > CANVAS_HEIGHT) st.y = 0;

                ctx.fillStyle = st.color;
                ctx.beginPath();
                ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Cyberpunk Grid Lines
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let y = 60; y < CANVAS_HEIGHT; y += 60) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(CANVAS_WIDTH, y);
                ctx.stroke();
            }
            for (let x = 70; x < CANVAS_WIDTH; x += 70) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, CANVAS_HEIGHT);
                ctx.stroke();
            }

            // FLIGHT LOGIC
            if (gameState === 'flying') {
                const elapsedSec = (Date.now() - flight.startTime) / 1000;
                // Realistic exponential curve
                const currentMult = parseFloat((1.00 + Math.pow(elapsedSec, 1.85) * 0.07).toFixed(2));
                flight.currentMultiplier = currentMult;
                setMultiplier(currentMult);
                updateEngineSound(currentMult);

                // Auto-Cashout Check for Player
                if (hasBet && !cashedOut && autoCashoutEnabled && currentMult >= autoCashout) {
                    handleCashout();
                }

                // Check Bots Cashouts
                setBots(prevBots =>
                    prevBots.map(b => {
                        if (!b.cashedOut && currentMult >= b.targetCashout) {
                            return {
                                ...b,
                                cashedOut: true,
                                cashedOutMultiplier: currentMult
                            };
                        }
                        return b;
                    })
                );

                // Check Crash
                if (currentMult >= flight.crashPoint) {
                    setGameState('crashed');
                    stopEngineSound();
                    playCrash();
                    flight.shake = 18;

                    // Spawn Explosion Particles
                    for (let p = 0; p < 45; p++) {
                        const angle = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 8 + 2;
                        flight.particles.push({
                            x: CANVAS_WIDTH * 0.72,
                            y: CANVAS_HEIGHT * 0.32,
                            vx: Math.cos(angle) * spd,
                            vy: Math.sin(angle) * spd,
                            color: ['#ff0055', '#ff9900', '#ffff00', '#00e5ff'][Math.floor(Math.random() * 4)],
                            radius: Math.random() * 6 + 2,
                            life: 1.0,
                            decay: Math.random() * 0.025 + 0.015
                        });
                    }

                    // Append to round history
                    setRoundHistory(prev => [flight.crashPoint, ...prev.slice(0, 9)]);
                    setHasBet(false);

                    // Auto restart countdown after 3 seconds
                    setTimeout(() => {
                        startCountdown();
                    }, 3200);
                }
            }

            // Trajectory Curve Calculation
            const progress = gameState === 'flying' || gameState === 'crashed'
                ? Math.min(1.0, (flight.currentMultiplier - 1) / 10)
                : 0;

            const startX = 60;
            const startY = CANVAS_HEIGHT - 60;
            const targetX = startX + (CANVAS_WIDTH - 200) * Math.min(1.0, progress * 1.2 + 0.15);
            const targetY = startY - (CANVAS_HEIGHT - 140) * Math.min(1.0, Math.pow(progress, 0.75) * 1.1 + 0.1);

            // Draw Trajectory Glowing Path
            if (gameState === 'flying' || gameState === 'crashed') {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(startX + (targetX - startX) * 0.45, startY, targetX, targetY);

                // Gradient stroke
                const grad = ctx.createLinearGradient(startX, startY, targetX, targetY);
                grad.addColorStop(0, '#00e5ff');
                grad.addColorStop(0.5, '#d500f9');
                grad.addColorStop(1, '#ff007f');

                ctx.strokeStyle = grad;
                ctx.lineWidth = 4;
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 15;
                ctx.stroke();

                // Path Under-fill Gradient
                ctx.lineTo(targetX, startY);
                ctx.lineTo(startX, startY);
                ctx.closePath();
                const fillGrad = ctx.createLinearGradient(startX, startY, startX, targetY);
                fillGrad.addColorStop(0, 'rgba(0, 229, 255, 0.0)');
                fillGrad.addColorStop(1, 'rgba(213, 0, 249, 0.15)');
                ctx.fillStyle = fillGrad;
                ctx.fill();
                ctx.restore();

                // Spawn Jet Exhaust Particles
                if (gameState === 'flying') {
                    for (let ep = 0; ep < 3; ep++) {
                        flight.particles.push({
                            x: targetX - 18,
                            y: targetY + 12,
                            vx: -Math.random() * 4 - 2,
                            vy: Math.random() * 3 + 1,
                            color: ['#00e5ff', '#ff007f', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
                            radius: Math.random() * 4 + 1.5,
                            life: 1.0,
                            decay: 0.04
                        });
                    }
                }
            }

            // Draw & Update Particles (Exhaust & Explosion)
            for (let i = flight.particles.length - 1; i >= 0; i--) {
                const p = flight.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life <= 0) {
                    flight.particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            // Draw Rocket & Pilot Cockpit
            if (gameState === 'flying') {
                ctx.save();
                ctx.translate(targetX, targetY);
                const angle = -0.45; // 25 deg upward tilt
                ctx.rotate(angle);

                // Rocket Body
                ctx.fillStyle = '#0f172a';
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 10;

                ctx.beginPath();
                ctx.moveTo(28, 0); // Nose cone
                ctx.lineTo(-18, -12); // Top wing
                ctx.lineTo(-14, 0);
                ctx.lineTo(-18, 12); // Bottom wing
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Neon Wing Accents
                ctx.strokeStyle = '#ff007f';
                ctx.beginPath();
                ctx.moveTo(-18, -12);
                ctx.lineTo(-4, -5);
                ctx.moveTo(-18, 12);
                ctx.lineTo(-4, 5);
                ctx.stroke();

                // Cockpit Bubble & Pilot Skin Avatar
                ctx.save();
                ctx.beginPath();
                ctx.arc(4, 0, 11, 0, Math.PI * 2);
                ctx.clip();
                const pilotImg = pilotImagesRef.current[selectedPilot.id];
                if (pilotImg && pilotImg.complete) {
                    ctx.drawImage(pilotImg, -7, -11, 22, 22);
                } else {
                    ctx.fillStyle = '#38bdf8';
                    ctx.fill();
                }
                ctx.restore();

                // Cockpit Glass Border
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(4, 0, 11, 0, Math.PI * 2);
                ctx.stroke();

                // Engine Thruster Flame
                const flameLen = 14 + Math.random() * 8;
                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.moveTo(-18, -4);
                ctx.lineTo(-18 - flameLen, 0);
                ctx.lineTo(-18, 4);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#00e5ff';
                ctx.beginPath();
                ctx.moveTo(-18, -2);
                ctx.lineTo(-18 - flameLen * 0.6, 0);
                ctx.lineTo(-18, 2);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }

            // BIG CENTRAL MULTIPLIER DISPLAY
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (gameState === 'waiting' || gameState === 'countdown') {
                ctx.font = '900 16px "Courier New", monospace';
                ctx.fillStyle = '#38bdf8';
                ctx.fillText('NEXT MOONSHOT IN', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25);

                ctx.font = '900 52px "Courier New", monospace';
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 15;
                ctx.fillText(countdown > 0 ? countdown + 's' : 'BLASTOFF!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
            } else if (gameState === 'flying') {
                const multText = flight.currentMultiplier.toFixed(2) + 'x';
                ctx.font = '900 64px "Courier New", monospace';

                // Color shifts as multiplier rises
                let textColor = '#00e5ff';
                if (flight.currentMultiplier >= 10.0) textColor = '#ffd700';
                else if (flight.currentMultiplier >= 5.0) textColor = '#ff007f';
                else if (flight.currentMultiplier >= 2.0) textColor = '#00ff66';

                ctx.fillStyle = textColor;
                ctx.shadowColor = textColor;
                ctx.shadowBlur = 20;
                ctx.fillText(multText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

                ctx.font = '700 13px "Courier New", monospace';
                ctx.fillStyle = '#94a3b8';
                ctx.shadowBlur = 0;
                ctx.fillText('CURRENT PAYOUT RATIO', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
            } else if (gameState === 'crashed') {
                ctx.font = '900 54px "Courier New", monospace';
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 25;
                ctx.fillText('CRASHED @ ' + flight.crashPoint.toFixed(2) + 'x', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            }

            ctx.restore();
            ctx.restore(); // Restore shake translation

            animIdRef.current = requestAnimationFrame(loop);
        };

        animIdRef.current = requestAnimationFrame(loop);
        return () => {
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        };
    }, [gameState, selectedPilot]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none">
            {/* Ambient Cosmic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#00ffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top Navigation & Status Bar */}
            <div className="relative z-10 w-full max-w-[760px] flex items-center justify-between mb-3 px-1">
                <Link
                    to="/arcade"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono text-xs font-bold shadow-lg active:scale-95"
                >
                    <span>◄</span> ARCADE HUB
                </Link>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-1.5 shadow-lg">
                        <span>🪙</span>
                        <span>{(coins ?? 0).toLocaleString()} CP</span>
                    </div>
                </div>
            </div>

            {/* Main Cyber Crash Cabinet */}
            <div className="relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col items-center">
                {/* Header Title & Marquee */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-pulse">🚀</span>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                            CYBER CRASH: MOONSHOT
                        </h1>
                    </div>

                    {/* Pilot Selection Avatars */}
                    <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono px-1">PILOT:</span>
                        {BRO_PILOTS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPilot(p)}
                                className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${selectedPilot.id === p.id ? 'border-cyan-400 scale-110 shadow-[0_0_10px_#00e5ff]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                title={p.name}
                            >
                                <img src={p.skin} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Round Multiplier History Ticker */}
                <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-3 font-mono text-xs scrollbar-none">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">HISTORY:</span>
                    {roundHistory.map((rh, idx) => (
                        <div
                            key={idx}
                            className={`px-2 py-0.5 rounded-md font-black shrink-0 border ${rh >= 10 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-[0_0_8px_rgba(255,215,0,0.5)]' : (rh >= 2.0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400' : 'bg-red-500/10 text-red-400 border-red-500/30')}`}
                        >
                            {rh.toFixed(2)}x
                        </div>
                    ))}
                </div>

                {/* Canvas Display Viewport */}
                <div className="relative w-full aspect-[700/420] max-h-[420px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-inner flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="w-full h-full object-contain"
                    />

                    {/* Cashed Out Banner Overlay */}
                    {cashedOut && (
                        <div className="absolute top-4 left-4 bg-emerald-500/90 text-black px-4 py-2 rounded-xl font-mono font-black text-xs sm:text-sm shadow-[0_0_20px_#00ff66] flex items-center gap-2 animate-bounce">
                            <span>✅ BAILED OUT:</span>
                            <span>{cashedOutMultiplier.toFixed(2)}x (+{cashedOutAmount} CP)</span>
                        </div>
                    )}
                </div>

                {/* Control & Betting Console */}
                <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Wager Panel */}
                    <div className="bg-black/60 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1 text-xs text-slate-400 font-mono">
                            <span>BET AMOUNT</span>
                            <span>MAX: {(coins ?? 0).toLocaleString()} CP</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                min="10"
                                max={coins ?? 100000}
                                value={wager}
                                onChange={(e) => setWager(Math.max(10, parseInt(e.target.value) || 0))}
                                disabled={hasBet || gameState === 'flying'}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-400 font-mono font-bold text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[25, 100, 500, 1000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setWager(amt)}
                                    disabled={hasBet || gameState === 'flying'}
                                    className="py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[10px] font-bold rounded-lg border border-slate-700 disabled:opacity-40"
                                >
                                    +{amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auto-Cashout Panel */}
                    <div className="bg-black/60 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1 text-xs text-slate-400 font-mono">
                            <span>AUTO CASHOUT</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoCashoutEnabled}
                                    onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                                    className="accent-cyan-400 cursor-pointer"
                                />
                                <span className="text-[10px] text-cyan-300">ENABLE</span>
                            </label>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                step="0.1"
                                min="1.05"
                                max="100.0"
                                value={autoCashout}
                                onChange={(e) => setAutoCashout(Math.max(1.05, parseFloat(e.target.value) || 1.05))}
                                disabled={!autoCashoutEnabled}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-400 font-mono font-bold text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-40"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[1.5, 2.0, 5.0, 10.0].map(target => (
                                <button
                                    key={target}
                                    type="button"
                                    onClick={() => { setAutoCashout(target); setAutoCashoutEnabled(true); }}
                                    className="py-1 bg-slate-800/80 hover:bg-slate-700 text-yellow-300/80 font-mono text-[10px] font-bold rounded-lg border border-slate-700"
                                >
                                    {target.toFixed(1)}x
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <div className="flex flex-col justify-center">
                        {gameState === 'flying' && hasBet && !cashedOut ? (
                            <button
                                type="button"
                                onClick={handleCashout}
                                className="w-full h-full min-h-[75px] bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 text-black font-black text-lg tracking-wider uppercase rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.8)] active:scale-95 transition-all flex flex-col items-center justify-center animate-pulse"
                            >
                                <span>⚡ BAIL OUT NOW!</span>
                                <span className="text-xs font-mono font-extrabold mt-0.5">
                                    +{(wager * multiplier).toFixed(0)} CP ({multiplier.toFixed(2)}x)
                                </span>
                            </button>
                        ) : hasBet ? (
                            <div className="w-full h-full min-h-[75px] bg-cyan-950/60 border border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center font-mono">
                                <span className="text-xs text-cyan-300 font-bold">BET ACTIVE: {wager} CP</span>
                                <span className="text-[11px] text-slate-400 mt-1">
                                    {cashedOut ? `WON +${cashedOutAmount} CP` : 'WAITING FOR BLASTOFF...'}
                                </span>
                            </div>
                        ) : (
                            <SquishyButton
                                onClick={handlePlaceBet}
                                disabled={gameState === 'flying' || (coins ?? 0) < wager}
                                className="w-full h-full min-h-[75px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
                            >
                                🚀 PLACE BET ({wager} CP)
                            </SquishyButton>
                        )}
                    </div>
                </div>

                {/* Live Online Ghost Pilots Table */}
                <div className="w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3">
                    <div className="flex justify-between items-center mb-2 font-mono text-xs text-slate-400">
                        <span className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            LIVE MOONSHOT PILOTS ({bots.length + (hasBet ? 1 : 0)})
                        </span>
                        <span>STATUS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
                        {hasBet && (
                            <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/50">
                                <div className="flex items-center gap-2">
                                    <img src={selectedPilot.skin} alt="You" className="w-5 h-5 rounded-full object-cover border border-cyan-400" />
                                    <span className="font-bold text-cyan-300">YOU ({selectedPilot.name})</span>
                                </div>
                                <div>
                                    {cashedOut ? (
                                        <span className="text-emerald-400 font-bold">+{cashedOutAmount} CP ({cashedOutMultiplier.toFixed(2)}x)</span>
                                    ) : gameState === 'crashed' ? (
                                        <span className="text-red-400 font-bold">BUSTED</span>
                                    ) : (
                                        <span className="text-yellow-400 font-bold">IN FLIGHT</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {bots.map(bot => (
                            <div key={bot.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                                <div className="flex items-center gap-2">
                                    <img src={bot.pilot.skin} alt={bot.name} className="w-5 h-5 rounded-full object-cover" />
                                    <span className="text-slate-300 font-semibold truncate max-w-[90px]">{bot.name}</span>
                                </div>
                                <div>
                                    {bot.cashedOut ? (
                                        <span className="text-emerald-400 font-bold">+{Math.floor(bot.wager * bot.cashedOutMultiplier)} CP ({bot.cashedOutMultiplier.toFixed(2)}x)</span>
                                    ) : gameState === 'crashed' ? (
                                        <span className="text-red-400/80">BUSTED</span>
                                    ) : (
                                        <span className="text-slate-500">IN FLIGHT</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberCrash;
