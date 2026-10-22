import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';

const SUITS = [
    { name: 'Spades', symbol: '♠', color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.5)' },
    { name: 'Hearts', symbol: '♥', color: '#ff0055', glow: 'rgba(255, 0, 85, 0.5)' },
    { name: 'Clubs', symbol: '♣', color: '#00ff66', glow: 'rgba(0, 255, 102, 0.5)' },
    { name: 'Diamonds', symbol: '♦', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.5)' }
];

const RANKS = [
    { value: 1, label: 'A', name: 'Ace' },
    { value: 2, label: '2', name: '2' },
    { value: 3, label: '3', name: '3' },
    { value: 4, label: '4', name: '4' },
    { value: 5, label: '5', name: '5' },
    { value: 6, label: '6', name: '6' },
    { value: 7, label: '7', name: '7' },
    { value: 8, label: '8', name: '8' },
    { value: 9, label: '9', name: '9' },
    { value: 10, label: '10', name: '10' },
    { value: 11, label: 'J', name: 'Jack' },
    { value: 12, label: 'Q', name: 'Queen' },
    { value: 13, label: 'K', name: 'King' }
];

const BET_PRESETS = [25, 50, 100, 250, 500, 1000];

const CyberHiLo = () => {
    const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();

    const audioCtxRef = useRef(null);

    // Game State
    const [bet, setBet] = useState(100);
    const [inRound, setInRound] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [nextCard, setNextCard] = useState(null);
    const [cardHistory, setCardHistory] = useState([]);
    const [multiplier, setMultiplier] = useState(1.0);
    const [skipsRemaining, setSkipsRemaining] = useState(2);
    const [isFlipping, setIsFlipping] = useState(false);
    const [roundResult, setRoundResult] = useState(null); // 'win', 'loss', 'cashout'
    const [highestStreak, setHighestStreak] = useState(0);

    // Audio Synthesizer for Card SFX
    const playSynthTone = (type) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'flip') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, t);
                osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
                osc.start(t);
                osc.stop(t + 0.1);
            } else if (type === 'correct') {
                const chord = [523.25, 659.25, 783.99, 1046.50];
                const freq = chord[Math.min(chord.length - 1, cardHistory.length % chord.length)];
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
                osc.start(t);
                osc.stop(t + 0.26);
            } else if (type === 'loss') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, t);
                osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
                osc.start(t);
                osc.stop(t + 0.4);
            }
        } catch (e) {}
    };

    // Generate Random Card
    const getRandomCard = () => {
        const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
        const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
        return {
            id: Math.random().toString(36).substr(2, 9),
            suit,
            rank,
            value: rank.value
        };
    };

    // Calculate Multipliers for Higher and Lower
    const getMultipliers = (card) => {
        if (!card) return { higher: 1.5, lower: 1.5 };
        const rankVal = card.value;

        // Count cards higher (rankVal + 1 to 13) and lower (1 to rankVal - 1)
        // If equal, counts as push or loss based on mode
        const higherCount = 13 - rankVal;
        const lowerCount = rankVal - 1;

        // Casino standard 96% RTP multiplier math: (Total / Winning) * 0.96
        const higherMult = higherCount > 0 ? Number(((12 / higherCount) * 0.96).toFixed(2)) : 12.0;
        const lowerMult = lowerCount > 0 ? Number(((12 / lowerCount) * 0.96).toFixed(2)) : 12.0;

        return {
            higher: Math.max(1.05, higherMult),
            lower: Math.max(1.05, lowerMult)
        };
    };

    // Start Round
    const handleStartGame = () => {
        if ((coins ?? 0) < bet) {
            showToast('Insufficient Cyber Points for this bet!', 'error');
            return;
        }

        if (addCoins) addCoins(-bet);
        playCollect();

        const initialCard = getRandomCard();
        setCurrentCard(initialCard);
        setNextCard(null);
        setCardHistory([initialCard]);
        setMultiplier(1.0);
        setSkipsRemaining(2);
        setInRound(true);
        setRoundResult(null);

        if (incrementStat) {
            incrementStat('hiloRoundsPlayed', 1);
            incrementStat('gamesPlayedCount', 1);
        }
    };

    // Player Guess (Higher or Lower)
    const handleGuess = (direction) => {
        if (!inRound || isFlipping || !currentCard) return;

        setIsFlipping(true);
        playSynthTone('flip');

        setTimeout(() => {
            const drawn = getRandomCard();
            setNextCard(drawn);

            const prevVal = currentCard.value;
            const nextVal = drawn.value;

            let isCorrect = false;
            if (direction === 'higher') {
                isCorrect = nextVal > prevVal;
            } else if (direction === 'lower') {
                isCorrect = nextVal < prevVal;
            }

            const { higher, lower } = getMultipliers(currentCard);
            const stepMult = direction === 'higher' ? higher : lower;

            if (isCorrect) {
                // Correct guess!
                playSynthTone('correct');
                const newMult = Number((multiplier * stepMult).toFixed(2));
                setMultiplier(newMult);
                setCardHistory(prev => [drawn, ...prev]);
                setCurrentCard(drawn);

                const currentStreak = cardHistory.length;
                if (currentStreak > highestStreak) setHighestStreak(currentStreak);

                if (newMult >= 10.0) {
                    playAirhorn();
                    triggerConfetti();
                }

                showToast(`🎯 CORRECT! Multiplier increased to ${newMult}x!`, 'success');

                if (incrementStat) incrementStat('hiloCorrectGuesses', 1);
            } else {
                // Wrong guess / Bust
                playSynthTone('loss');
                playCrash();
                setRoundResult('loss');
                setInRound(false);
                showToast(`💥 BUSTED! The card was ${drawn.rank.label} of ${drawn.suit.name}. Better luck next run!`, 'error');
            }

            setIsFlipping(false);
        }, 350);
    };

    // Skip Card Action
    const handleSkip = () => {
        if (!inRound || skipsRemaining <= 0 || isFlipping) return;

        setSkipsRemaining(prev => prev - 1);
        playSynthTone('flip');
        const newCard = getRandomCard();
        setCurrentCard(newCard);
        setCardHistory(prev => [newCard, ...prev.slice(1)]);
        showToast('🔀 Card Swapped! Streak preserved.', 'info');
    };

    // Cash Out Current Pot
    const handleCashOut = () => {
        if (!inRound || multiplier <= 1.0) return;

        const payout = Math.floor(bet * multiplier);
        if (addCoins) addCoins(payout);
        playWin();

        if (multiplier >= 5.0) {
            playAirhorn();
            triggerConfetti();
        }

        setRoundResult('cashout');
        setInRound(false);

        showToast(`💰 CASHED OUT! Won +${payout.toLocaleString()} CP (${multiplier}x)!`, 'success');

        if (incrementStat) {
            incrementStat('hiloCashouts', 1);
            incrementStat('coinsEarnedToday', payout);
        }

        const currentHS = stats?.hiloHighScore || 0;
        if (payout > currentHS && updateStat) {
            updateStat('hiloHighScore', payout);
        }

        if (payout >= 1000) {
            feedService.broadcast('arcade_win', {
                player: userProfile?.name || 'StreakMaster',
                game: 'Cyber Hi-Lo',
                coinsWon: payout,
                avatar: userProfile?.avatar || '/assets/skins/face_default.png'
            });
        }
    };

    const multipliers = getMultipliers(currentCard);
    const currentPayout = Math.floor(bet * multiplier);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none">
            {/* Ambient Lighting Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff08_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top Navigation & Status Bar */}
            <div className="relative z-10 w-full max-w-[760px] flex items-center justify-between mb-3 px-1">
                <Link
                    to="/arcade"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-fuchsia-500/30 text-fuchsia-400 hover:text-fuchsia-300 hover:border-fuchsia-400/60 transition-all font-mono text-xs font-bold shadow-lg active:scale-95"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    ARCADE HUB
                </Link>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#ffd700]" />
                        <span>{(coins ?? 0).toLocaleString()} CP</span>
                    </div>
                </div>
            </div>

            {/* Main Cyber Hi-Lo Cabinet */}
            <div className="relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col items-center">
                {/* Header Title Banner */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-pulse">🃏</span>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                            CYBER HI-LO 2088: NEON STREAK
                        </h1>
                    </div>

                    <div className="px-3 py-1 bg-black/60 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-300 tracking-wide">
                        MAX MULTIPLIER: 180x
                    </div>
                </div>

                {/* Central Card Display & Pedestal */}
                <div className="w-full max-w-[500px] bg-black/70 rounded-3xl border-2 border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,229,255,0.2)] flex flex-col items-center relative overflow-hidden">
                    {/* Live Multiplier & Pot Header */}
                    <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3 font-mono text-xs">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">CURRENT MULTIPLIER</span>
                            <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_#00e5ff]">
                                {multiplier.toFixed(2)}x
                            </span>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">ESTIMATED PAYOUT</span>
                            <span className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_#ffd700]">
                                +{currentPayout.toLocaleString()} CP
                            </span>
                        </div>
                    </div>

                    {/* Holographic 3D Card Stage */}
                    <div className="relative w-44 h-64 my-2 flex items-center justify-center perspective-[1000px]">
                        {currentCard ? (
                            <div
                                className={`w-full h-full bg-slate-900 border-2 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_35px] transition-all duration-300 ${isFlipping ? 'scale-90 opacity-40 rotate-y-90' : 'scale-100 opacity-100 rotate-y-0'}`}
                                style={{
                                    borderColor: currentCard.suit.color,
                                    boxShadow: `0 0 30px ${currentCard.suit.glow}`
                                }}
                            >
                                {/* Card Top-Left Rank & Suit */}
                                <div className="flex flex-col items-start leading-none" style={{ color: currentCard.suit.color }}>
                                    <span className="text-2xl font-black font-mono">{currentCard.rank.label}</span>
                                    <span className="text-xl">{currentCard.suit.symbol}</span>
                                </div>

                                {/* Center Massive Holographic Suit */}
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-6xl drop-shadow-[0_0_15px]" style={{ color: currentCard.suit.color }}>
                                        {currentCard.suit.symbol}
                                    </span>
                                    <span className="text-xs font-mono font-bold mt-1 tracking-widest text-slate-400">
                                        {currentCard.rank.name.toUpperCase()}
                                    </span>
                                </div>

                                {/* Card Bottom-Right Inverted Rank & Suit */}
                                <div className="flex flex-col items-end leading-none rotate-180" style={{ color: currentCard.suit.color }}>
                                    <span className="text-2xl font-black font-mono">{currentCard.rank.label}</span>
                                    <span className="text-xl">{currentCard.suit.symbol}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-center p-4">
                                <span className="text-4xl mb-2">🃏</span>
                                <span className="text-xs font-bold">PLACE BET & DEAL FIRST CARD</span>
                            </div>
                        )}
                    </div>

                    {/* Game In-Progress Guess Controls */}
                    {inRound ? (
                        <div className="w-full mt-4 flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                {/* HIGHER BUTTON */}
                                <SquishyButton
                                    onClick={() => handleGuess('higher')}
                                    disabled={isFlipping}
                                    className="py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-mono font-black text-sm uppercase rounded-2xl border border-emerald-400 shadow-[0_0_20px_rgba(0,255,102,0.4)] flex flex-col items-center justify-center transition-all disabled:opacity-40"
                                >
                                    <span>▲ HIGHER</span>
                                    <span className="text-[11px] text-emerald-200 font-normal">
                                        x{multipliers.higher} Payout
                                    </span>
                                </SquishyButton>

                                {/* LOWER BUTTON */}
                                <SquishyButton
                                    onClick={() => handleGuess('lower')}
                                    disabled={isFlipping}
                                    className="py-3.5 bg-gradient-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white font-mono font-black text-sm uppercase rounded-2xl border border-rose-400 shadow-[0_0_20px_rgba(255,0,85,0.4)] flex flex-col items-center justify-center transition-all disabled:opacity-40"
                                >
                                    <span>▼ LOWER</span>
                                    <span className="text-[11px] text-rose-200 font-normal">
                                        x{multipliers.lower} Payout
                                    </span>
                                </SquishyButton>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {/* SKIP BUTTON */}
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    disabled={skipsRemaining <= 0 || isFlipping}
                                    className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono font-bold text-xs uppercase rounded-xl transition-all disabled:opacity-40 active:scale-95"
                                >
                                    🔀 SKIP ({skipsRemaining} LEFT)
                                </button>

                                {/* CASH OUT BUTTON */}
                                <button
                                    type="button"
                                    onClick={handleCashOut}
                                    disabled={multiplier <= 1.0 || isFlipping}
                                    className="py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black font-mono font-black text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:brightness-110 transition-all disabled:opacity-40 active:scale-95 animate-pulse"
                                >
                                    💰 CASH OUT (+{currentPayout.toLocaleString()} CP)
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Pre-Round Bet Selector & Deal Button */
                        <div className="w-full mt-4 flex flex-col gap-3 font-mono">
                            {/* Bet Preset Pills */}
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>SELECT WAGER:</span>
                                <span className="text-yellow-400 font-bold">{bet} CP</span>
                            </div>

                            <div className="grid grid-cols-6 gap-1.5">
                                {BET_PRESETS.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setBet(amt)}
                                        className={`py-2 rounded-xl text-xs font-black border transition-all ${bet === amt ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00e5ff]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                                    >
                                        {amt}
                                    </button>
                                ))}
                            </div>

                            <SquishyButton
                                onClick={handleStartGame}
                                disabled={(coins ?? 0) < bet}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-black font-black text-sm uppercase rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 mt-1"
                            >
                                🃏 DEAL & START STREAK ({bet} CP)
                            </SquishyButton>
                        </div>
                    )}

                    {/* Result Banner */}
                    {roundResult && (
                        <div className={`w-full mt-3 p-3 rounded-2xl border text-center font-mono font-black text-xs ${roundResult === 'cashout' ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_#00ff66]' : 'bg-red-950/60 border-red-500 text-red-400'}`}>
                            {roundResult === 'cashout' ? (
                                <div>
                                    🎉 CASHED OUT AT {multiplier.toFixed(2)}x! WON +{currentPayout.toLocaleString()} CP!
                                </div>
                            ) : (
                                <div>
                                    💥 STREAK BUSTED! BETTER LUCK NEXT RUN!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Card Streak History Tape */}
                <div className="w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            CARD STREAK TIMELINE
                        </span>
                        <span className="text-cyan-400 font-bold">STREAK: {cardHistory.length} CARDS</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {cardHistory.map((c, idx) => (
                            <div
                                key={idx}
                                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-900 border flex items-center gap-1 font-mono font-bold text-xs"
                                style={{ borderColor: c.suit.color }}
                            >
                                <span style={{ color: c.suit.color }}>{c.suit.symbol}</span>
                                <span>{c.rank.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberHiLo;
