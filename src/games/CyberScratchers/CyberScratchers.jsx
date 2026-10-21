import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';

const CARD_TIERS = [
    {
        id: 'street',
        name: 'Street Hustle',
        cost: 50,
        color: '#00e5ff',
        maxPrize: 5000,
        rows: 3,
        cols: 3,
        symbols: [
            { id: 'pizza', name: 'Neon Pizza', icon: '🍕', value: 100 },
            { id: 'coin', name: 'Cyber Coin', icon: '🪙', value: 250 },
            { id: 'dino', name: 'Turbo Dino', icon: '🦖', skin: '/assets/skins/face_dino.png', value: 1000 },
            { id: 'gold', name: 'Gold Bar', icon: '🏆', value: 5000 }
        ]
    },
    {
        id: 'syndicate',
        name: 'Neon Syndicate',
        cost: 250,
        color: '#ff007f',
        maxPrize: 25000,
        rows: 3,
        cols: 4,
        symbols: [
            { id: 'dice', name: 'Cyber Dice', icon: '🎲', value: 500 },
            { id: 'bunny', name: 'Cyber Bunny', icon: '🐰', skin: '/assets/skins/face_bunny.png', value: 2500 },
            { id: 'diamond', name: 'Neon Diamond', icon: '💎', value: 10000 },
            { id: 'key', name: 'Vault Key', icon: '🗝️', value: 25000 }
        ]
    },
    {
        id: 'whale',
        name: 'Whale Grand Jackpot',
        cost: 1000,
        color: '#ffd700',
        maxPrize: 100000,
        rows: 4,
        cols: 4,
        symbols: [
            { id: 'chip', name: 'VIP Chip', icon: '🎰', value: 2500 },
            { id: 'star', name: 'Star Bro', icon: '⭐', skin: '/assets/skins/face_star.png', value: 25000 },
            { id: 'crown', name: 'Cyber Crown', icon: '👑', value: 50000 },
            { id: 'whale', name: 'Whale Bro', icon: '💰', skin: '/assets/skins/face_money.png', value: 100000 }
        ]
    }
];

const CyberScratchers = () => {
    const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const isScratchingRef = useRef(false);

    // Card State
    const [selectedTier, setSelectedTier] = useState(CARD_TIERS[0]);
    const [cardActive, setCardActive] = useState(false);
    const [gridSymbols, setGridSymbols] = useState([]);
    const [scratchedPercent, setScratchedPercent] = useState(0);
    const [cardResult, setCardResult] = useState(null); // { won: bool, prize: number, winningSymbol: symbol }
    const [revealed, setRevealed] = useState(false);
    const [recentWins, setRecentWins] = useState([
        { user: 'TurboDino', prize: 1000, tier: 'Street Hustle' },
        { user: 'CyberBunny', prize: 10000, tier: 'Neon Syndicate' },
        { user: 'WhaleBro', prize: 50000, tier: 'Whale Grand' }
    ]);

    // Synthesize Scraping Foil Sound
    const playScrapeSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const bufferSize = ctx.sampleRate * 0.05;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.15;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1800;

            noise.connect(filter);
            filter.connect(ctx.destination);
            noise.start();
        } catch (e) {}
    };

    // Generate Card Grid Symbols (Mathematical Odds)
    const generateCard = (tier) => {
        const totalSpots = tier.rows * tier.cols;
        const symbols = tier.symbols;

        // Weighted win probability: ~42% win chance
        const isWinningCard = Math.random() < 0.42;
        const grid = [];

        if (isWinningCard) {
            // Pick a winning symbol based on tier weights
            const roll = Math.random();
            let winningSym = symbols[0];
            if (roll < 0.04) winningSym = symbols[3]; // 4% Jackpot
            else if (roll < 0.15) winningSym = symbols[2]; // 11% High
            else if (roll < 0.40) winningSym = symbols[1]; // 25% Medium
            else winningSym = symbols[0]; // 60% Common

            // Guarantee 3 copies of winning symbol
            const winPositions = new Set();
            while (winPositions.size < 3) {
                winPositions.add(Math.floor(Math.random() * totalSpots));
            }

            for (let i = 0; i < totalSpots; i++) {
                if (winPositions.has(i)) {
                    grid.push(winningSym);
                } else {
                    // Random other symbol (avoid making another 3 of a kind)
                    const others = symbols.filter(s => s.id !== winningSym.id);
                    grid.push(others[Math.floor(Math.random() * others.length)]);
                }
            }

            return { grid, isWin: true, prize: winningSym.value, winningSymbol: winningSym };
        } else {
            // Losing card: distribute symbols so no 3-of-a-kind exists
            const counts = {};
            symbols.forEach(s => counts[s.id] = 0);

            for (let i = 0; i < totalSpots; i++) {
                const available = symbols.filter(s => counts[s.id] < 2);
                const sym = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : symbols[0];
                counts[sym.id] = (counts[sym.id] || 0) + 1;
                grid.push(sym);
            }

            return { grid, isWin: false, prize: 0, winningSymbol: null };
        }
    };

    // Buy & Prepare New Scratch Card
    const handleBuyCard = () => {
        if ((coins ?? 0) < selectedTier.cost) {
            showToast('Insufficient Cyber Points for this card!', 'error');
            return;
        }

        // Deduct CP
        if (addCoins) addCoins(-selectedTier.cost);
        playCollect();

        const { grid, isWin, prize, winningSymbol } = generateCard(selectedTier);
        setGridSymbols(grid);
        setCardResult({ won: isWin, prize, winningSymbol });
        setCardActive(true);
        setRevealed(false);
        setScratchedPercent(0);

        if (incrementStat) {
            incrementStat('scratchersPlayed', 1);
            incrementStat('gamesPlayedCount', 1);
        }

        // Draw fresh silver holographic foil on canvas
        setTimeout(() => {
            initFoilCanvas();
        }, 50);
    };

    // Initialize Canvas Silver Foil
    const initFoilCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.globalCompositeOperation = 'source-over';

        // Silver Holographic Gradient Foil
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(0.25, '#e2e8f0');
        grad.addColorStop(0.5, '#64748b');
        grad.addColorStop(0.75, '#cbd5e1');
        grad.addColorStop(1, '#475569');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Cyber Grid Lines Pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 20; y < h; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Centered Holographic Stamp
        ctx.fillStyle = '#1e293b';
        ctx.font = '900 18px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillText('⚡ SCRATCH TO REVEAL ⚡', w / 2, h / 2 - 10);

        ctx.font = '700 11px "Courier New", monospace';
        ctx.fillStyle = selectedTier.color;
        ctx.fillText(`TOP PRIZE: +${selectedTier.maxPrize.toLocaleString()} CP`, w / 2, h / 2 + 16);
    };

    // Scratch Action (destination-out clear)
    const scratchAt = (clientX, clientY) => {
        const canvas = canvasRef.current;
        if (!canvas || revealed) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = ((clientX - rect.left) / rect.width) * canvas.width;
        const y = ((clientY - rect.top) / rect.height) * canvas.height;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, Math.PI * 2);
        ctx.fill();

        playScrapeSound();

        // Sample scratched percentage every few scrapes
        checkScratchedPercent();
    };

    // Calculate Scratched Foil Percentage
    const checkScratchedPercent = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Sample 64 points across the canvas
        let cleared = 0;
        const sampleRows = 8;
        const sampleCols = 8;
        const imgData = ctx.getImageData(0, 0, w, h);

        for (let r = 0; r < sampleRows; r++) {
            for (let c = 0; c < sampleCols; c++) {
                const px = Math.floor((c + 0.5) * (w / sampleCols));
                const py = Math.floor((r + 0.5) * (h / sampleRows));
                const alpha = imgData.data[(py * w + px) * 4 + 3];
                if (alpha < 30) cleared++;
            }
        }

        const pct = Math.floor((cleared / 64) * 100);
        setScratchedPercent(pct);

        if (pct >= 55 && !revealed) {
            handleCompleteReveal();
        }
    };

    // Complete Reveal of the Card
    const handleCompleteReveal = () => {
        setRevealed(true);
        setScratchedPercent(100);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (cardResult && cardResult.won) {
            const win = cardResult.prize;
            if (addCoins) addCoins(win);
            playWin();

            if (win >= selectedTier.cost * 10) {
                playAirhorn();
                triggerConfetti();
            }

            showToast(`🎉 MATCH 3 WINNER! You won +${win.toLocaleString()} CP!`, 'success');

            if (incrementStat) incrementStat('scratchersWon', 1);
            const currentHS = stats?.scratchersHighScore || 0;
            if (win > currentHS && updateStat) {
                updateStat('scratchersHighScore', win);
            }

            // Feed broadcast
            if (win >= 1000) {
                feedService.broadcast('arcade_win', {
                    player: userProfile?.name || 'LuckyScratcher',
                    game: 'Cyber Scratchers',
                    coinsWon: win,
                    avatar: selectedTier.symbols[3].skin || '/assets/skins/face_money.png'
                });
            }

            setRecentWins(prev => [
                { user: userProfile?.name || 'You', prize: win, tier: selectedTier.name },
                ...prev.slice(0, 3)
            ]);
        } else {
            playCrash();
            showToast('No match this time! Try another card!', 'info');
        }
    };

    // Mouse and Touch Listeners for Scratching
    const handleMouseDown = (e) => {
        isScratchingRef.current = true;
        scratchAt(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isScratchingRef.current) return;
        scratchAt(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        isScratchingRef.current = false;
    };

    const handleTouchStart = (e) => {
        isScratchingRef.current = true;
        const t = e.touches[0];
        scratchAt(t.clientX, t.clientY);
    };

    const handleTouchMove = (e) => {
        if (!isScratchingRef.current) return;
        const t = e.touches[0];
        scratchAt(t.clientX, t.clientY);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none">
            {/* Ambient Lighting Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-950/30 via-slate-950 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffd70008_1px,transparent_1px),linear-gradient(to_bottom,#ffd70008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

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

            {/* Main Cyber Scratchers Cabinet */}
            <div className="relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-yellow-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(255,215,0,0.25)] flex flex-col items-center">
                {/* Header Title */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-bounce">🎟️</span>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                            CYBER SCRATCHERS: HIGH-ROLLER
                        </h1>
                    </div>

                    <div className="px-3 py-1 bg-black/60 rounded-full border border-yellow-500/30 text-[11px] font-mono text-yellow-300 tracking-wide">
                        MATCH 3 SYMBOLS TO WIN UP TO 100,000 CP!
                    </div>
                </div>

                {/* Card Tier Selection Tabs */}
                <div className="w-full grid grid-cols-3 gap-2 mb-4 font-mono text-xs">
                    {CARD_TIERS.map(tier => (
                        <button
                            key={tier.id}
                            type="button"
                            onClick={() => {
                                if (!cardActive) setSelectedTier(tier);
                            }}
                            disabled={cardActive}
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedTier.id === tier.id ? 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'} disabled:opacity-50`}
                        >
                            <span className="font-black text-sm" style={{ color: tier.color }}>{tier.name}</span>
                            <span className="text-white font-bold mt-1">COST: {tier.cost} CP</span>
                            <span className="text-[10px] text-yellow-400">TOP: {tier.maxPrize.toLocaleString()} CP</span>
                        </button>
                    ))}
                </div>

                {/* The Scratch Card Container */}
                <div className="w-full max-w-[480px] bg-black/80 rounded-3xl border-2 border-yellow-500/50 p-4 shadow-[0_0_30px_rgba(255,215,0,0.2)] flex flex-col items-center relative overflow-hidden">
                    {/* Card Header Stamp */}
                    <div className="w-full flex items-center justify-between mb-3 border-b border-slate-800 pb-2 font-mono text-xs">
                        <span className="font-black" style={{ color: selectedTier.color }}>
                            {selectedTier.name.toUpperCase()}
                        </span>
                        <span className="text-slate-400">
                            {scratchedPercent > 0 ? `${scratchedPercent}% SCRATCHED` : 'READY TO SCRATCH'}
                        </span>
                    </div>

                    {/* Card Grid Area */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-3">
                        {cardActive ? (
                            <>
                                {/* Underneath Symbols Grid */}
                                <div
                                    className="w-full h-full grid gap-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${selectedTier.cols}, minmax(0, 1fr))`,
                                        gridTemplateRows: `repeat(${selectedTier.rows}, minmax(0, 1fr))`
                                    }}
                                >
                                    {gridSymbols.map((sym, idx) => {
                                        const isWinningSymbol = cardResult?.won && cardResult.winningSymbol.id === sym.id;
                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-xl border flex flex-col items-center justify-center p-1 font-mono transition-all ${isWinningSymbol && revealed ? 'bg-yellow-500/30 border-yellow-400 shadow-[0_0_12px_#ffd700] animate-pulse' : 'bg-slate-900 border-slate-800'}`}
                                            >
                                                {sym.skin ? (
                                                    <img src={sym.skin} alt={sym.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                                                ) : (
                                                    <span className="text-xl">{sym.icon}</span>
                                                )}
                                                <span className="text-[9px] text-yellow-300 font-bold mt-0.5">
                                                    +{sym.value.toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Holographic Canvas Foil Overlay */}
                                {!revealed && (
                                    <canvas
                                        ref={canvasRef}
                                        width={440}
                                        height={330}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleMouseUp}
                                        className="absolute inset-0 w-full h-full cursor-pointer touch-none"
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                <span className="text-4xl mb-2">🎟️</span>
                                <h3 className="text-base font-black text-yellow-400">
                                    BUY A {selectedTier.name.toUpperCase()} TICKET
                                </h3>
                                <p className="text-xs text-slate-400 max-w-xs font-mono mt-1">
                                    Match 3 identical symbols anywhere on the card to win the multiplier prize!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Result Banner */}
                    {revealed && cardResult && (
                        <div className={`w-full mt-3 p-3 rounded-2xl border text-center font-mono font-black ${cardResult.won ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_#00ff66]' : 'bg-red-950/40 border-red-500 text-red-400'}`}>
                            {cardResult.won ? (
                                <div>
                                    🎉 YOU WON +{cardResult.prize.toLocaleString()} CP!
                                </div>
                            ) : (
                                <div>
                                    NO MATCH THIS TIME! BETTER LUCK NEXT CARD!
                                </div>
                            )}
                        </div>
                    )}

                    {/* Card Actions */}
                    <div className="w-full mt-3 flex gap-2">
                        {cardActive && !revealed ? (
                            <button
                                type="button"
                                onClick={handleCompleteReveal}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-xs uppercase rounded-xl border border-slate-700 transition-all active:scale-95"
                            >
                                ⚡ AUTO-SCRATCH (QUICK REVEAL)
                            </button>
                        ) : (
                            <SquishyButton
                                onClick={handleBuyCard}
                                disabled={(coins ?? 0) < selectedTier.cost}
                                className="w-full py-3.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black font-black text-sm uppercase rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
                            >
                                🎟️ BUY SCRATCHER ({selectedTier.cost} CP)
                            </SquishyButton>
                        )}
                    </div>
                </div>

                {/* Recent High Roller Scratch Wins Feed */}
                <div className="w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                        RECENT LOTTERY JACKPOTS
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {recentWins.map((w, idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                <span className="text-slate-300 font-bold">@{w.user}:</span>
                                <span className="text-yellow-400 font-black">+{w.prize.toLocaleString()} CP ({w.tier})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberScratchers;
