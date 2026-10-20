import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';

const WHEEL_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

const CHIP_VALUES = [25, 50, 100, 250, 500, 1000];

const getNumberColor = (num) => {
    if (num === 0) return '#00ff66'; // Neon Emerald
    return RED_NUMBERS.has(num) ? '#ff0055' : '#1e293b'; // Neon Red / Dark Slate
};

const CyberRoulette = () => {
    const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const animIdRef = useRef(null);

    // Betting & Table State
    const [selectedChip, setSelectedChip] = useState(100);
    const [bets, setBets] = useState({}); // { betKey: amount }
    const [lastBets, setLastBets] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winningNumber, setWinningNumber] = useState(null);
    const [lastWinAmount, setLastWinAmount] = useState(0);
    const [recentNumbers, setRecentNumbers] = useState([7, 21, 0, 36, 14, 2, 19, 31]);
    const [messageFeed, setMessageFeed] = useState('PLACE YOUR BETS ON THE NEON FELT!');

    // Wheel Physics Ref
    const wheelRef = useRef({
        wheelAngle: 0,
        ballAngle: 0,
        ballRadius: 135,
        targetNumber: 0,
        isSettled: true,
        startTime: 0,
        duration: 4800,
        initialBallSpeed: 0.14
    });

    // Web Audio Click & Ball Clatter Synthesizer
    const playBallClick = (pitch = 800) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(pitch, ctx.currentTime);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    };

    // Total Bet Calculator
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

    // Place a Bet on a tile
    const handlePlaceBet = (betKey) => {
        if (isSpinning) return;
        if ((coins ?? 0) < totalBet + selectedChip) {
            showToast('Insufficient Cyber Points for this chip!', 'error');
            return;
        }

        playCollect();
        setBets(prev => ({
            ...prev,
            [betKey]: (prev[betKey] || 0) + selectedChip
        }));
    };

    // Clear All Bets
    const handleClearBets = () => {
        if (isSpinning) return;
        if (totalBet > 0) setLastBets(bets);
        setBets({});
        playBallClick(300);
    };

    // Double All Bets
    const handleDoubleBets = () => {
        if (isSpinning || totalBet === 0) return;
        if ((coins ?? 0) < totalBet * 2) {
            showToast('Insufficient Cyber Points to double!', 'error');
            return;
        }
        playCollect();
        const doubled = {};
        for (const [k, v] of Object.entries(bets)) {
            doubled[k] = v * 2;
        }
        setBets(doubled);
    };

    // Repeat Last Bet
    const handleRepeatBets = () => {
        if (isSpinning || !lastBets) return;
        const lastTotal = Object.values(lastBets).reduce((a, b) => a + b, 0);
        if ((coins ?? 0) < lastTotal) {
            showToast('Insufficient Cyber Points to repeat bet!', 'error');
            return;
        }
        playCollect();
        setBets(lastBets);
    };

    // Spin the Wheel!
    const handleSpin = () => {
        if (isSpinning || totalBet === 0) return;
        if ((coins ?? 0) < totalBet) {
            showToast('Insufficient Cyber Points!', 'error');
            return;
        }

        // Deduct Wager
        if (addCoins) addCoins(-totalBet);
        setLastBets(bets);
        setIsSpinning(true);
        setWinningNumber(null);
        setLastWinAmount(0);
        setMessageFeed('NO MORE BETS! WHEEL IN MOTION...');

        // Pick Random Number 0-36
        const targetIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
        const chosen = WHEEL_NUMBERS[targetIndex];

        const w = wheelRef.current;
        w.startTime = Date.now();
        w.targetNumber = chosen;
        w.isSettled = false;
        w.duration = 4500 + Math.random() * 800;

        if (incrementStat) {
            incrementStat('rouletteSpins', 1);
            incrementStat('gamesPlayedCount', 1);
        }
    };

    // Compute Payouts when Ball Settles
    const settleRound = (num) => {
        setWinningNumber(num);
        setIsSpinning(false);
        setRecentNumbers(prev => [num, ...prev.slice(0, 9)]);

        let win = 0;
        const isRed = RED_NUMBERS.has(num);
        const isBlack = num !== 0 && !isRed;
        const isEven = num !== 0 && num % 2 === 0;
        const isOdd = num !== 0 && num % 2 !== 0;
        const isLow = num >= 1 && num <= 18;
        const isHigh = num >= 19 && num <= 36;
        const is1stDozen = num >= 1 && num <= 12;
        const is2ndDozen = num >= 13 && num <= 24;
        const is3rdDozen = num >= 25 && num <= 36;
        const colMod = num % 3; // 1 -> col 1, 2 -> col 2, 0 -> col 3 (if num > 0)

        // Straight Up Single Number (35:1 + original bet = 36x)
        if (bets[num.toString()]) {
            win += bets[num.toString()] * 36;
            if (incrementStat) incrementStat('rouletteStraightHits', 1);
        }

        // Outside Bets (1:1 + original bet = 2x)
        if (isRed && bets['red']) win += bets['red'] * 2;
        if (isBlack && bets['black']) win += bets['black'] * 2;
        if (isEven && bets['even']) win += bets['even'] * 2;
        if (isOdd && bets['odd']) win += bets['odd'] * 2;
        if (isLow && bets['1-18']) win += bets['1-18'] * 2;
        if (isHigh && bets['19-36']) win += bets['19-36'] * 2;

        // Dozens (2:1 + original bet = 3x)
        if (is1stDozen && bets['1st12']) win += bets['1st12'] * 3;
        if (is2ndDozen && bets['2nd12']) win += bets['2nd12'] * 3;
        if (is3rdDozen && bets['3rd12']) win += bets['3rd12'] * 3;

        // Columns (2:1 + original bet = 3x)
        if (num > 0) {
            if (colMod === 1 && bets['col1']) win += bets['col1'] * 3;
            if (colMod === 2 && bets['col2']) win += bets['col2'] * 3;
            if (colMod === 0 && bets['col3']) win += bets['col3'] * 3;
        }

        setLastWinAmount(win);

        if (win > 0) {
            if (addCoins) addCoins(win);
            playWin();
            if (win >= totalBet * 3) {
                playAirhorn();
                triggerConfetti();
            }
            setMessageFeed(`🎉 NUMBER ${num} HIT! YOU WON +${win.toLocaleString()} CP!`);
            showToast(`Winning Number: ${num}! Won +${win} CP!`, 'success');

            if (incrementStat) incrementStat('rouletteWins', 1);
            const currentHS = stats?.rouletteHighScore || 0;
            if (win > currentHS && updateStat) {
                updateStat('rouletteHighScore', win);
            }

            if (win >= 500) {
                feedService.broadcast('arcade_win', {
                    player: userProfile?.name || 'HighRoller',
                    game: 'Cyber Roulette',
                    coinsWon: win,
                    avatar: '/assets/skins/face_money.png'
                });
            }
        } else {
            playCrash();
            setMessageFeed(`NUMBER ${num} LANDED. BETTER LUCK NEXT SPIN!`);
        }
    };

    // Canvas Wheel 60FPS Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 160;

        const loop = () => {
            const w = wheelRef.current;

            // Clear Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Wheel Outer Rim Glow
            ctx.save();
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 14, 0, Math.PI * 2);
            ctx.fillStyle = '#090d16';
            ctx.fill();
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();

            // Wheel Spin Physics
            if (isSpinning) {
                const elapsed = Date.now() - w.startTime;
                const progress = Math.min(1.0, elapsed / w.duration);

                // Wheel spins clockwise, ball spins counter-clockwise
                const easeOut = 1 - Math.pow(1 - progress, 3);
                w.wheelAngle += 0.04 * (1 - easeOut * 0.7);

                // Ball decelerates
                const ballSpeed = w.initialBallSpeed * (1 - easeOut * 0.85);
                w.ballAngle -= ballSpeed;

                // Ball drops inward as it slows
                w.ballRadius = 142 - easeOut * 32 + Math.sin(elapsed * 0.03) * (2 * (1 - easeOut));

                if (Math.random() < 0.12 && progress < 0.9) {
                    playBallClick(600 + Math.random() * 400);
                }

                // Settle on Target Number
                if (progress >= 1.0 && !w.isSettled) {
                    w.isSettled = true;
                    // Find target number pocket angle on wheel
                    const targetIdx = WHEEL_NUMBERS.indexOf(w.targetNumber);
                    const sliceAngle = (Math.PI * 2) / WHEEL_NUMBERS.length;
                    const settledAngle = w.wheelAngle + targetIdx * sliceAngle;
                    w.ballAngle = settledAngle;
                    w.ballRadius = 110;
                    settleRound(w.targetNumber);
                }
            } else {
                // Gentle idle wheel rotation
                w.wheelAngle += 0.003;
            }

            // Draw Wheel Pockets
            const sliceAngle = (Math.PI * 2) / WHEEL_NUMBERS.length;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(w.wheelAngle);

            WHEEL_NUMBERS.forEach((num, idx) => {
                const angle = idx * sliceAngle;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, angle, angle + sliceAngle);
                ctx.closePath();

                // Pocket Color
                ctx.fillStyle = getNumberColor(num);
                ctx.fill();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Number Label
                ctx.save();
                ctx.rotate(angle + sliceAngle / 2);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'right';
                ctx.fillText(num.toString(), radius - 8, 4);
                ctx.restore();
            });

            // Center Brass Cone & Hub
            ctx.beginPath();
            ctx.arc(0, 0, 48, 0, Math.PI * 2);
            ctx.fillStyle = '#1e1b4b';
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center Chrome Star
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Draw Ball
            ctx.save();
            ctx.translate(centerX, centerY);
            const ballX = Math.cos(w.ballAngle) * w.ballRadius;
            const ballY = Math.sin(w.ballAngle) * w.ballRadius;

            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Chrome ball highlight
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(ballX - 1.5, ballY - 1.5, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            animIdRef.current = requestAnimationFrame(loop);
        };

        animIdRef.current = requestAnimationFrame(loop);
        return () => {
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        };
    }, [isSpinning]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none">
            {/* Ambient Casino Lighting Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-950 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff6608_1px,transparent_1px),linear-gradient(to_bottom,#00ff6608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top Navigation & Status Bar */}
            <div className="relative z-10 w-full max-w-[820px] flex items-center justify-between mb-3 px-1">
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

            {/* Main Cyber Roulette Cabinet */}
            <div className="relative z-10 w-full max-w-[820px] bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,255,102,0.2)] flex flex-col items-center">
                {/* Header Title & Marquee */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🎡</span>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]">
                            CYBER ROULETTE 2088
                        </h1>
                    </div>

                    <div className="px-3 py-1 bg-black/60 rounded-full border border-emerald-500/30 text-[11px] font-mono text-emerald-300 tracking-wide truncate">
                        {messageFeed}
                    </div>
                </div>

                {/* History Ticker */}
                <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-3 font-mono text-xs scrollbar-none">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">RECENT:</span>
                    {recentNumbers.map((rn, idx) => (
                        <div
                            key={idx}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 border shadow-md ${rn === 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400' : (RED_NUMBERS.has(rn) ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-slate-800 text-slate-200 border-slate-600')}`}
                        >
                            {rn}
                        </div>
                    ))}
                </div>

                {/* Center Wheel Stage & Winning Callout */}
                <div className="w-full flex flex-col lg:flex-row items-center justify-around gap-6 my-2">
                    {/* Wheel Canvas */}
                    <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            width={360}
                            height={360}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* HUD Callout Box */}
                    <div className="flex flex-col items-center justify-center bg-black/60 border border-slate-800 rounded-2xl p-5 min-w-[220px] font-mono text-center">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
                            {isSpinning ? 'SPINNING...' : (winningNumber !== null ? 'WINNING NUMBER' : 'READY TO SPIN')}
                        </span>
                        <div className={`text-5xl font-black my-2 ${winningNumber === 0 ? 'text-emerald-400 drop-shadow-[0_0_15px_#00ff66]' : (winningNumber && RED_NUMBERS.has(winningNumber) ? 'text-red-400 drop-shadow-[0_0_15px_#ff0055]' : 'text-cyan-400 drop-shadow-[0_0_15px_#00e5ff]')}`}>
                            {winningNumber !== null ? winningNumber : '??'}
                        </div>
                        {lastWinAmount > 0 ? (
                            <div className="text-emerald-400 font-black text-sm animate-bounce">
                                +{lastWinAmount.toLocaleString()} CP WON!
                            </div>
                        ) : (
                            <div className="text-xs text-slate-500">
                                TOTAL BET: {totalBet.toLocaleString()} CP
                            </div>
                        )}
                    </div>
                </div>

                {/* Interactive Neon Betting Felt Grid */}
                <div className="w-full mt-4 bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl p-3 select-none">
                    {/* Top Row: Single Zero 0 */}
                    <button
                        type="button"
                        onClick={() => handlePlaceBet('0')}
                        className={`w-full py-2 mb-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-300 font-mono font-black text-base flex items-center justify-center gap-2 transition-all relative ${bets['0'] ? 'ring-2 ring-yellow-400 shadow-[0_0_15px_#00ff66]' : ''}`}
                    >
                        <span>0 (ZERO - 35:1)</span>
                        {bets['0'] && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-black">
                                {bets['0']} CP
                            </span>
                        )}
                    </button>

                    {/* 3x12 Numbers Matrix (1 to 36) */}
                    <div className="grid grid-cols-12 gap-1 mb-2 font-mono text-xs font-bold text-center">
                        {Array.from({ length: 36 }, (_, i) => i + 1).map(num => {
                            const isRed = RED_NUMBERS.has(num);
                            const hasBetOnNum = bets[num.toString()];
                            return (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => handlePlaceBet(num.toString())}
                                    className={`py-2.5 rounded-lg border flex flex-col items-center justify-center transition-all relative ${isRed ? 'bg-red-600/30 hover:bg-red-600/50 border-red-500/60 text-red-200' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200'} ${hasBetOnNum ? 'ring-2 ring-yellow-400 scale-105 z-10 shadow-lg' : ''}`}
                                >
                                    <span>{num}</span>
                                    {hasBetOnNum && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-yellow-400 text-black text-[9px] font-black flex items-center justify-center shadow">
                                            ●
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dozens Row (1st 12, 2nd 12, 3rd 12 - 2:1) */}
                    <div className="grid grid-cols-3 gap-1 mb-2 font-mono text-xs font-bold">
                        {[
                            { key: '1st12', label: '1ST 12 (1-12)' },
                            { key: '2nd12', label: '2ND 12 (13-24)' },
                            { key: '3rd12', label: '3RD 12 (25-36)' }
                        ].map(d => (
                            <button
                                key={d.key}
                                type="button"
                                onClick={() => handlePlaceBet(d.key)}
                                className={`py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-all ${bets[d.key] ? 'ring-2 ring-yellow-400 text-yellow-400' : ''}`}
                            >
                                <span>{d.label}</span>
                                {bets[d.key] && (
                                    <span className="text-[10px] bg-yellow-400 text-black px-1.5 rounded-full font-black">
                                        {bets[d.key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Outside Bets Row (1-18, EVEN, RED, BLACK, ODD, 19-36 - 1:1) */}
                    <div className="grid grid-cols-6 gap-1 font-mono text-xs font-bold">
                        {[
                            { key: '1-18', label: '1-18' },
                            { key: 'even', label: 'EVEN' },
                            { key: 'red', label: 'RED', color: 'bg-red-600/40 text-red-300 border-red-500' },
                            { key: 'black', label: 'BLACK', color: 'bg-slate-950 text-slate-300 border-slate-700' },
                            { key: 'odd', label: 'ODD' },
                            { key: '19-36', label: '19-36' }
                        ].map(ob => (
                            <button
                                key={ob.key}
                                type="button"
                                onClick={() => handlePlaceBet(ob.key)}
                                className={`py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${ob.color || 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'} ${bets[ob.key] ? 'ring-2 ring-yellow-400 text-yellow-400 scale-105' : ''}`}
                            >
                                <span>{ob.label}</span>
                                {bets[ob.key] && (
                                    <span className="text-[9px] text-yellow-300 font-black mt-0.5">
                                        {bets[ob.key]} CP
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chip Denominations Selector */}
                <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 bg-black/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-slate-400 mr-1">CHIP:</span>
                        {CHIP_VALUES.map(val => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setSelectedChip(val)}
                                className={`w-10 h-10 rounded-full font-mono font-black text-xs border-2 flex items-center justify-center transition-all ${selectedChip === val ? 'scale-110 border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-[0_0_12px_rgba(255,215,0,0.6)]' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'}`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>

                    {/* Table Utility Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClearBets}
                            disabled={isSpinning || totalBet === 0}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 disabled:opacity-40"
                        >
                            CLEAR
                        </button>
                        <button
                            type="button"
                            onClick={handleDoubleBets}
                            disabled={isSpinning || totalBet === 0}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-400 font-mono text-xs font-bold border border-slate-700 disabled:opacity-40"
                        >
                            2X DOUBLE
                        </button>
                        {lastBets && (
                            <button
                                type="button"
                                onClick={handleRepeatBets}
                                disabled={isSpinning}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold border border-slate-700 disabled:opacity-40"
                            >
                                REPEAT
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Spin Action Button */}
                <div className="w-full mt-4">
                    <SquishyButton
                        onClick={handleSpin}
                        disabled={isSpinning || totalBet === 0}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-yellow-400 text-black font-black text-lg tracking-wider uppercase rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        <span>🎡</span>
                        <span>{isSpinning ? 'BALL IN PLAY...' : (totalBet > 0 ? `SPIN THE WHEEL (${totalBet.toLocaleString()} CP)` : 'PLACE BETS TO SPIN')}</span>
                    </SquishyButton>
                </div>
            </div>
        </div>
    );
};

export default CyberRoulette;
