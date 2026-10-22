import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';
import RewardedSponsorModal from '../../components/RewardedSponsorModal';
import { motion } from 'framer-motion';

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 420;

// High-tech starship classes (Vector Iconography, 0 Photos)
const CYBER_SHIPS = [
    { id: 'viper', name: 'Viper-X Interceptor', callsign: 'VIPER', color: '#00f0ff', perk: 'Agile Thrusters' },
    { id: 'valkyrie', name: 'Valkyrie-9 Starfighter', callsign: 'VALK', color: '#ff007f', perk: 'Plasma Shield' },
    { id: 'apex', name: 'Apex-Gold Cruiser', callsign: 'APEX', color: '#ffd700', perk: 'Hyper Overdrive' },
    { id: 'phantom', name: 'Phantom-Z Stealth', callsign: 'PHNTM', color: '#00ff66', perk: 'Quantum Phase' },
    { id: 'solaris', name: 'Solaris Titan', callsign: 'SOLAR', color: '#a855f7', perk: 'Fusion Core' }
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

    // Game Loop & Round State: 'ready', 'countdown', 'flying', 'crashed', 'cashed_out'
    const [gameState, setGameState] = useState('ready');
    const [multiplier, setMultiplier] = useState(1.00);
    const [wager, setWager] = useState(100);
    const [autoCashout, setAutoCashout] = useState(2.00);
    const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(true);
    const [hasBet, setHasBet] = useState(false);
    const [lostWager, setLostWager] = useState(0);
    const [hasClaimedInsurance, setHasClaimedInsurance] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [cashedOut, setCashedOut] = useState(false);
    const [cashedOutMultiplier, setCashedOutMultiplier] = useState(null);
    const [cashedOutAmount, setCashedOutAmount] = useState(0);
    const [selectedShip, setSelectedShip] = useState(CYBER_SHIPS[0]);
    const [roundHistory, setRoundHistory] = useState([2.15, 1.42, 8.50, 1.18, 3.20, 1.05, 14.80, 2.75]);
    const [countdown, setCountdown] = useState(3);
    const [bots, setBots] = useState([]);

    // Physics & flight telemetry refs
    const flightRef = useRef({
        startTime: 0,
        crashPoint: 2.0,
        currentMultiplier: 1.0,
        particles: [],
        stars: [],
        shake: 0
    });

    // Initialize Starfield with Depth Layers
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

    // Provably-fair crash point calculation
    const generateCrashPoint = () => {
        const rand = Math.random();
        if (rand < 0.03) return 1.00 + Math.random() * 0.05; // 3% instant bust
        const e = 100 / (100 - rand * 96); // 96% RTP exponential curve
        return Math.max(1.01, parseFloat(e.toFixed(2)));
    };

    // Generate simulated network wingmen
    const generateBots = () => {
        return BOT_NAMES.map((name, i) => {
            const ship = CYBER_SHIPS[i % CYBER_SHIPS.length];
            const botWager = [50, 100, 250, 500, 1000][Math.floor(Math.random() * 5)];
            const targetCashout = parseFloat((1.3 + Math.random() * 4.0).toFixed(2));
            return {
                id: 'bot_' + i,
                name,
                ship,
                wager: botWager,
                targetCashout,
                cashedOut: false,
                cashedOutMultiplier: null
            };
        });
    };

    // Player-triggered Moonshot Launch
    const handleLaunch = () => {
        if (gameState !== 'ready') return;

        if (wager <= 0) {
            showToast('Enter a valid wager!', 'error');
            return;
        }
        if ((coins ?? 0) < wager) {
            showToast('Insufficient Cyber Points!', 'error');
            return;
        }

        // Deduct Wager & setup round
        if (addCoins) addCoins(-wager);
        setHasBet(true);
        setCashedOut(false);
        setCashedOutMultiplier(null);
        setCashedOutAmount(0);
        setMultiplier(1.00);
        setBots(generateBots());
        playCollect();

        if (incrementStat) {
            incrementStat('crashGames', 1);
            incrementStat('gamesPlayedCount', 1);
        }

        // 3-2-1 Rapid Countdown
        setGameState('countdown');
        let count = 3;
        setCountdown(count);
        playBeep(440);

        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            playBeep(count === 0 ? 880 : 440);

            if (count <= 0) {
                clearInterval(timer);
                igniteFlight();
            }
        }, 800);
    };

    // Ignite rocket flight
    const igniteFlight = () => {
        setGameState('flying');
        const crash = generateCrashPoint();
        flightRef.current.crashPoint = crash;
        flightRef.current.startTime = Date.now();
        flightRef.current.currentMultiplier = 1.00;
        flightRef.current.particles = [];
        flightRef.current.shake = 0;

        startEngineSound();
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

        showToast(`🚀 BAILED OUT AT ${currentMult.toFixed(2)}x! Won +${winAmount.toLocaleString()} CP!`, 'success');

        if (incrementStat) incrementStat('crashWins', 1);
        const currentHS = stats?.crashHighScore || 0;
        if (currentMult > currentHS && updateStat) {
            updateStat('crashHighScore', parseFloat(currentMult.toFixed(2)));
        }

        feedService.broadcast('arcade_win', {
            player: userProfile?.name || 'CyberPilot',
            game: 'Cyber Crash',
            coinsWon: winAmount,
            avatar: userProfile?.avatar || '/assets/skins/face_default.png'
        });
    };

    // 60FPS Flight Physics & Canvas Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const render = () => {
            // Clear Canvas
            ctx.fillStyle = '#05070e';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Screen Shake Effect
            ctx.save();
            if (flightRef.current.shake > 0) {
                const sx = (Math.random() - 0.5) * flightRef.current.shake;
                const sy = (Math.random() - 0.5) * flightRef.current.shake;
                ctx.translate(sx, sy);
                flightRef.current.shake *= 0.88;
                if (flightRef.current.shake < 0.2) flightRef.current.shake = 0;
            }

            // Draw Parallax Starfield
            flightRef.current.stars.forEach(st => {
                ctx.fillStyle = st.color;
                ctx.fillRect(st.x, st.y, st.size, st.size);
                if (gameState === 'flying') {
                    st.x -= st.speed * (flightRef.current.currentMultiplier * 0.8);
                    st.y += st.speed * 0.4;
                } else {
                    st.x -= st.speed * 0.2;
                }
                if (st.x < 0) st.x = CANVAS_WIDTH;
                if (st.y > CANVAS_HEIGHT) st.y = 0;
            });

            // Draw Neon Cyber Grid Radar
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
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

            const flight = flightRef.current;

            // In-flight math update
            if (gameState === 'flying') {
                const elapsedSec = (Date.now() - flight.startTime) / 1000;
                // Exponential acceleration curve
                const currentMult = parseFloat((1.00 + Math.pow(elapsedSec * 0.55, 1.85)).toFixed(2));
                flight.currentMultiplier = currentMult;
                setMultiplier(currentMult);
                updateEngineSound(currentMult);

                // Auto Cashout Check
                if (autoCashoutEnabled && !cashedOut && hasBet && currentMult >= autoCashout) {
                    handleCashout();
                }

                // Simulated Bots Cashouts
                setBots(prev =>
                    prev.map(b => {
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
                    flight.shake = 22;

                    // Spawn Explosion Particles
                    for (let p = 0; p < 50; p++) {
                        const angle = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 9 + 3;
                        flight.particles.push({
                            x: CANVAS_WIDTH * 0.72,
                            y: CANVAS_HEIGHT * 0.32,
                            vx: Math.cos(angle) * spd,
                            vy: Math.sin(angle) * spd,
                            color: ['#ff0055', '#ff9900', '#ffd700', '#00f0ff'][Math.floor(Math.random() * 4)],
                            radius: Math.random() * 6 + 2,
                            life: 1.0,
                            decay: Math.random() * 0.025 + 0.015
                        });
                    }

                    // Append to round history
                    setRoundHistory(prev => [flight.crashPoint, ...prev.slice(0, 9)]);
                    if (hasBet && !cashedOut) {
                        setLostWager(wager);
                        setHasClaimedInsurance(false);
                    }
                    setHasBet(false);

                    // Reset to ready state after brief delay
                    setTimeout(() => {
                        setGameState('ready');
                    }, 2800);
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
                ctx.quadraticCurveTo(
                    startX + (targetX - startX) * 0.55,
                    startY,
                    targetX,
                    targetY
                );
                ctx.strokeStyle = gameState === 'crashed' ? 'rgba(255, 0, 85, 0.6)' : selectedShip.color;
                ctx.lineWidth = 3.5;
                ctx.shadowColor = gameState === 'crashed' ? '#ff0055' : selectedShip.color;
                ctx.shadowBlur = 15;
                ctx.stroke();

                // Gradient area under curve
                ctx.lineTo(targetX, startY);
                ctx.lineTo(startX, startY);
                ctx.closePath();
                const areaGrad = ctx.createLinearGradient(0, targetY, 0, startY);
                areaGrad.addColorStop(0, gameState === 'crashed' ? 'rgba(255, 0, 85, 0.25)' : 'rgba(0, 240, 255, 0.2)');
                areaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = areaGrad;
                ctx.fill();
                ctx.restore();
            }

            // Particle Updates & Drawing
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

            // Draw Cyber Starship
            if (gameState === 'flying') {
                ctx.save();
                ctx.translate(targetX, targetY);
                const angle = -0.42; // ~24 deg upward trajectory
                ctx.rotate(angle);

                // Rocket Chassis
                ctx.fillStyle = '#080d1a';
                ctx.strokeStyle = selectedShip.color;
                ctx.lineWidth = 2.2;
                ctx.shadowColor = selectedShip.color;
                ctx.shadowBlur = 12;

                ctx.beginPath();
                ctx.moveTo(30, 0); // Nose cone
                ctx.lineTo(-20, -14); // Top wing
                ctx.lineTo(-14, 0); // Fuselage mid
                ctx.lineTo(-20, 14); // Bottom wing
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Cyber Wing Accents
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-18, -12);
                ctx.lineTo(-2, -5);
                ctx.moveTo(-18, 12);
                ctx.lineTo(-2, 5);
                ctx.stroke();

                // Holographic Plasma Core (NO Photos - Pure Futuristic Reactor)
                ctx.save();
                ctx.beginPath();
                ctx.arc(4, 0, 9, 0, Math.PI * 2);
                ctx.fillStyle = selectedShip.color;
                ctx.shadowColor = selectedShip.color;
                ctx.shadowBlur = 16;
                ctx.fill();

                // Core inner pulse
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(4, 0, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Engine Thruster Flame Trail
                const flameLen = 16 + Math.random() * 10;
                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.moveTo(-20, -5);
                ctx.lineTo(-20 - flameLen, 0);
                ctx.lineTo(-20, 5);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.moveTo(-20, -2);
                ctx.lineTo(-20 - (flameLen * 0.6), 0);
                ctx.lineTo(-20, 2);
                ctx.closePath();
                ctx.fill();

                ctx.restore();

                // Spawn Rocket Trail Particles
                if (Math.random() > 0.25) {
                    flight.particles.push({
                        x: targetX - 25,
                        y: targetY + (Math.random() - 0.5) * 8,
                        vx: -Math.random() * 4 - 2,
                        vy: (Math.random() - 0.5) * 2,
                        color: selectedShip.color,
                        radius: Math.random() * 4 + 1.5,
                        life: 0.8,
                        decay: 0.04
                    });
                }
            }

            // Center HUD Typography
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '900 24px "Orbitron", monospace';

            if (gameState === 'ready') {
                ctx.fillStyle = '#00f0ff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 15;
                ctx.fillText('MOONSHOT READY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

                ctx.font = '800 13px "Orbitron", monospace';
                ctx.fillStyle = '#94a3b8';
                ctx.shadowBlur = 0;
                ctx.fillText('SET WAGER & HIT LAUNCH MOONSHOT', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
            } else if (gameState === 'countdown') {
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 20;
                ctx.fillText('IGNITION SEQUENCE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25);

                ctx.font = '900 56px "Orbitron", monospace';
                ctx.fillStyle = '#00ff88';
                ctx.shadowColor = '#00ff88';
                ctx.fillText(countdown > 0 ? countdown.toString() : 'BLASTOFF!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
            } else if (gameState === 'flying') {
                ctx.font = '900 68px "Orbitron", monospace';
                const multText = multiplier.toFixed(2) + 'x';
                ctx.fillStyle = cashedOut ? '#00ff88' : '#ffffff';
                ctx.shadowColor = cashedOut ? '#00ff88' : selectedShip.color;
                ctx.shadowBlur = 25;
                ctx.fillText(multText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

                ctx.font = '800 12px "Orbitron", monospace';
                ctx.fillStyle = cashedOut ? '#00ff88' : '#00f0ff';
                ctx.shadowBlur = 0;
                ctx.fillText(cashedOut ? `SECURED AT ${cashedOutMultiplier.toFixed(2)}x (+${cashedOutAmount} CP)` : 'CURRENT PAYOUT RATIO', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 42);
            } else if (gameState === 'crashed') {
                ctx.font = '900 48px "Orbitron", monospace';
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 25;
                ctx.fillText('CRASHED @ ' + flight.crashPoint.toFixed(2) + 'x', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            }

            ctx.restore();
            ctx.restore(); // Restore shake

            animIdRef.current = requestAnimationFrame(render);
        };

        animIdRef.current = requestAnimationFrame(render);

        return () => {
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
            stopEngineSound();
        };
    }, [gameState, multiplier, cashedOut, cashedOutMultiplier, cashedOutAmount, countdown, selectedShip]);

    return (
        <div className="page-enter min-h-screen bg-slate-950 text-white font-sans pb-28 pt-4 px-3 sm:px-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
                {/* Header Back & Title */}
                <div className="w-full flex items-center justify-between mb-4">
                    <Link
                        to="/arcade"
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-400 transition-all shadow-md active:scale-95"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>ARCADE HUB</span>
                    </Link>

                    <div className="flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-full border border-yellow-500/30 text-yellow-400 font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v12M8 10h8" />
                        </svg>
                        <span>{(coins ?? 0).toLocaleString()} CP</span>
                    </div>
                </div>

                {/* Banner & Ship Class Selector */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_#00e5ff]">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                            CYBER CRASH: MOONSHOT
                        </h1>
                    </div>

                    {/* Ship Class Selection Tabs */}
                    <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono px-1">SHIP:</span>
                        {CYBER_SHIPS.map(ship => (
                            <button
                                key={ship.id}
                                onClick={() => setSelectedShip(ship)}
                                disabled={gameState === 'flying' || gameState === 'countdown'}
                                className={`px-2 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${selectedShip.id === ship.id ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_#00e5ff]' : 'border-transparent text-slate-400 hover:text-white'} disabled:opacity-50`}
                                title={ship.name}
                            >
                                {ship.callsign}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Round Multiplier History Ticker */}
                <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-3 font-mono text-xs scrollbar-none">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">RECENT:</span>
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
                <div className="relative w-full aspect-[700/420] max-h-[420px] rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-black shadow-[0_0_30px_rgba(0,240,255,0.15)] flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="w-full h-full object-contain"
                    />

                    {/* Cashed Out Banner Overlay */}
                    {cashedOut && (
                        <div className="absolute top-4 left-4 bg-emerald-500/90 text-black px-4 py-2 rounded-xl font-mono font-black text-xs sm:text-sm shadow-[0_0_20px_#00ff66] flex items-center gap-2">
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
                                disabled={gameState === 'flying' || gameState === 'countdown'}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-400 font-mono font-bold text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[25, 100, 500, 1000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setWager(amt)}
                                    disabled={gameState === 'flying' || gameState === 'countdown'}
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
                                disabled={!autoCashoutEnabled || gameState === 'flying' || gameState === 'countdown'}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-400 font-mono font-bold text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-40"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[1.5, 2.0, 5.0, 10.0].map(target => (
                                <button
                                    key={target}
                                    type="button"
                                    onClick={() => { setAutoCashout(target); setAutoCashoutEnabled(true); }}
                                    disabled={gameState === 'flying' || gameState === 'countdown'}
                                    className="py-1 bg-slate-800/80 hover:bg-slate-700 text-yellow-300/80 font-mono text-[10px] font-bold rounded-lg border border-slate-700 disabled:opacity-40"
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
                                <span className="flex items-center gap-2 font-mono">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    BAIL OUT NOW!
                                </span>
                                <span className="text-xs font-mono font-extrabold mt-0.5">
                                    +{(wager * multiplier).toFixed(0)} CP ({multiplier.toFixed(2)}x)
                                </span>
                            </button>
                        ) : gameState === 'flying' ? (
                            <div className="w-full h-full min-h-[75px] bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center font-mono text-cyan-300 text-xs font-bold">
                                <span>ROCKET IN FLIGHT</span>
                                <span className="text-[11px] text-slate-400 mt-1">WAITING FOR NEXT ROUND</span>
                            </div>
                        ) : gameState === 'countdown' ? (
                            <div className="w-full h-full min-h-[75px] bg-amber-950/60 border border-amber-500/40 rounded-2xl flex flex-col items-center justify-center font-mono text-amber-300 font-bold">
                                <span className="text-sm">IGNITION IN {countdown}s</span>
                                <span className="text-[10px] text-slate-400 mt-1">STAND BY FOR BLASTOFF</span>
                            </div>
                        ) : (
                            <SquishyButton
                                onClick={handleLaunch}
                                disabled={(coins ?? 0) < wager}
                                className="w-full h-full min-h-[75px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                                <span>LAUNCH MOONSHOT ({wager} CP)</span>
                            </SquishyButton>
                        )}
                    </div>
                </div>

                {/* REWARDED SPONSOR LOSS INSURANCE BANNER */}
                {lostWager > 0 && !hasClaimedInsurance && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 via-amber-950/50 to-slate-950/90 border border-amber-500/50 flex flex-wrap items-center justify-between gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🛡️</span>
                            <div>
                                <div className="text-xs font-black text-amber-400 font-mono tracking-wider">
                                    SPONSOR LOSS INSURANCE AVAILABLE
                                </div>
                                <div className="text-[11px] text-slate-300">
                                    Recover 50% (+{Math.floor(lostWager / 2)} CP) by watching a 10s Sponsor Spot.
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowSponsorModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <span>📺</span>
                            <span>CLAIM +{Math.floor(lostWager / 2)} CP CASHBACK</span>
                        </button>
                    </motion.div>
                )}

                <RewardedSponsorModal
                    isOpen={showSponsorModal}
                    onClose={() => setShowSponsorModal(false)}
                    rewardCP={Math.floor(lostWager / 2)}
                    onRewardGranted={(amount) => {
                        if (addCoins) addCoins(amount);
                        setHasClaimedInsurance(true);
                        showToast(`Sponsor Insurance Credited! +${amount} CP!`, 'success');
                    }}
                />

                {/* Live Online Wingmen Status Table */}
                <div className="w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3">
                    <div className="flex justify-between items-center mb-2 font-mono text-xs text-slate-400">
                        <span className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            NETWORK SQUADRON PILOTS ({bots.length + (hasBet ? 1 : 0)})
                        </span>
                        <span>STATUS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
                        {hasBet && (
                            <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: selectedShip.color }} />
                                    <span className="font-bold text-cyan-300">YOU ({selectedShip.callsign})</span>
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
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: bot.ship.color }} />
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
