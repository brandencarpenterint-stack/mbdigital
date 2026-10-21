import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useToast } from '../../context/ToastContext';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import SquishyButton from '../../components/SquishyButton';
import RewardedSponsorModal from '../../components/RewardedSponsorModal';

const TOTAL_TILES = 25;
const MINE_PRESETS = [1, 3, 5, 10, 15, 24];

const SCOUT_MASCOTS = [
    { id: 'dino', name: 'Turbo Dino', skin: '/assets/skins/face_dino.png', perk: 'Thermal Sniffer' },
    { id: 'bunny', name: 'Cyber Bunny', skin: '/assets/skins/face_bunny.png', perk: 'EMP Pulse' },
    { id: 'money', name: 'Whale Bro', skin: '/assets/skins/face_money.png', perk: 'Gold Radar' },
    { id: 'star', name: 'Super Star', skin: '/assets/skins/face_star.png', perk: 'Quantum Probe' }
];

// 98% RTP Math Formula for Mines Multiplier
const calculateMultiplier = (minesCount, gemsRevealed) => {
    if (gemsRevealed <= 0) return 1.0;
    let mult = 0.98;
    for (let i = 0; i < gemsRevealed; i++) {
        mult *= (TOTAL_TILES - i) / (TOTAL_TILES - minesCount - i);
    }
    return parseFloat(mult.toFixed(2));
};

const CyberMines = () => {
    const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();

    const audioCtxRef = useRef(null);

    // Game Configuration State
    const [wager, setWager] = useState(100);
    const [minesCount, setMinesCount] = useState(3);
    const [selectedMascot, setSelectedMascot] = useState(SCOUT_MASCOTS[0]);

    // Active Round State
    const [isPlaying, setIsPlaying] = useState(false);
    const [grid, setGrid] = useState(Array(TOTAL_TILES).fill({ revealed: false, isMine: false, scanned: false }));
    const [revealedGems, setRevealedGems] = useState(0);
    const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
    const [nextMultiplier, setNextMultiplier] = useState(1.11);
    const [gameOver, setGameOver] = useState(false);
    const [cashedOut, setCashedOut] = useState(false);
    const [scoutAvailable, setScoutAvailable] = useState(true);
    const [messageFeed, setMessageFeed] = useState('CONFIGURE MINES & BET TO START THE GRID!');
    const [lostWager, setLostWager] = useState(0);
    const [hasClaimedInsurance, setHasClaimedInsurance] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);

    // Simulated Live Multiplayer Ghost Grid Feed
    const [ghostFeed, setGhostFeed] = useState([
        { id: 1, user: 'CyberBunny', text: 'Cashed out 2.45x (+490 CP)! 💎', time: 'Just now' },
        { id: 2, user: 'TurboDino', text: 'Hit a mine on tile 18 (Busted 250 CP)! 💥', time: '12s ago' },
        { id: 3, user: 'WhaleBro', text: 'Scored 14.8x on 5-Mine Grid (+7,400 CP)! 💰', time: '28s ago' }
    ]);

    // Web Audio Sound Synthesizers
    const playTileChime = (gemIndex) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            // Rising musical pitch based on gems found (Pentatonic Scale)
            const baseFreq = 320;
            const freq = baseFreq * Math.pow(1.12, gemIndex);

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    };

    const playMineDetonation = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {}
    };

    // Calculate Next Multiplier preview
    useEffect(() => {
        const next = calculateMultiplier(minesCount, revealedGems + 1);
        setNextMultiplier(next);
    }, [minesCount, revealedGems]);

    // Start New Round
    const handleStartGame = () => {
        if (wager <= 0) {
            showToast('Enter a valid wager!', 'error');
            return;
        }
        if ((coins ?? 0) < wager) {
            showToast('Insufficient Cyber Points!', 'error');
            return;
        }

        // Deduct Wager
        if (addCoins) addCoins(-wager);
        playCollect();

        // Generate Random Mine Positions
        const mineIndices = new Set();
        while (mineIndices.size < minesCount) {
            mineIndices.add(Math.floor(Math.random() * TOTAL_TILES));
        }

        const newGrid = Array(TOTAL_TILES).fill(null).map((_, idx) => ({
            id: idx,
            revealed: false,
            isMine: mineIndices.has(idx),
            scanned: false
        }));

        setGrid(newGrid);
        setIsPlaying(true);
        setGameOver(false);
        setCashedOut(false);
        setRevealedGems(0);
        setCurrentMultiplier(1.0);
        setScoutAvailable(true);
        setMessageFeed(`GRID ACTIVE! FIND THE GEMS & AVOID ${minesCount} MINES!`);

        if (incrementStat) {
            incrementStat('minesGames', 1);
            incrementStat('gamesPlayedCount', 1);
        }
    };

    // Click a Tile
    const handleTileClick = (index) => {
        if (!isPlaying || gameOver || cashedOut || grid[index].revealed) return;

        const tile = grid[index];

        // HIT A MINE! BOOM!
        if (tile.isMine) {
            playMineDetonation();
            playCrash();
            setIsPlaying(false);
            setGameOver(true);
            setMessageFeed(`💥 DETONATION ON TILE ${index + 1}! BUSTED ${wager} CP!`);
            showToast(`Detonation! Lost ${wager} CP!`, 'error');
            setLostWager(wager);
            setHasClaimedInsurance(false);

            // Reveal all tiles
            setGrid(prev => prev.map(t => ({ ...t, revealed: true })));

            // Add to simulated ghost feed
            setGhostFeed(prev => [
                { id: Date.now(), user: userProfile?.name || 'You', text: `Hit a mine on tile ${index + 1} (-${wager} CP)! 💥`, time: 'Just now' },
                ...prev.slice(0, 3)
            ]);
            return;
        }

        // REVEALED A SAFE NEON GEM!
        const nextRevealedCount = revealedGems + 1;
        setRevealedGems(nextRevealedCount);
        playTileChime(nextRevealedCount);

        const newMult = calculateMultiplier(minesCount, nextRevealedCount);
        setCurrentMultiplier(newMult);

        const updatedGrid = [...grid];
        updatedGrid[index] = { ...tile, revealed: true };
        setGrid(updatedGrid);

        setMessageFeed(`💎 GEM REVEALED! CURRENT: ${newMult.toFixed(2)}x (+${Math.floor(wager * newMult)} CP)`);

        // Check if all safe gems are revealed (Full Board Clear!)
        if (nextRevealedCount === TOTAL_TILES - minesCount) {
            handleCashout(newMult);
        }
    };

    // Tactical Mascot Scout Drone (Reveals 1 safe tile)
    const handleScoutScan = () => {
        if (!isPlaying || !scoutAvailable || gameOver) return;

        // Find all unrevealed safe gem tiles
        const unrevealedGems = grid.filter(t => !t.revealed && !t.isMine);
        if (unrevealedGems.length === 0) return;

        const luckyTile = unrevealedGems[Math.floor(Math.random() * unrevealedGems.length)];

        setGrid(prev => prev.map(t => t.id === luckyTile.id ? { ...t, scanned: true } : t));
        setScoutAvailable(false);
        playTileChime(8);
        showToast(`🔍 ${selectedMascot.name}'s Scout Drone detected a safe gem at Tile ${luckyTile.id + 1}!`, 'info');
        setMessageFeed(`🔍 SCOUT DRONE HIGHLIGHTED SAFE TILE #${luckyTile.id + 1}!`);
    };

    // Cash Out Winnings
    const handleCashout = (overrideMult = currentMultiplier) => {
        if (!isPlaying || revealedGems === 0 || gameOver || cashedOut) return;

        const winAmount = Math.floor(wager * overrideMult);
        setCashedOut(true);
        setIsPlaying(false);

        if (addCoins) addCoins(winAmount);
        playWin();

        if (overrideMult >= 3.0) {
            playAirhorn();
            triggerConfetti();
        }

        setMessageFeed(`🎉 CASHED OUT AT ${overrideMult.toFixed(2)}x! WON +${winAmount.toLocaleString()} CP!`);
        showToast(`Cashed out at ${overrideMult.toFixed(2)}x! Won +${winAmount} CP!`, 'success');

        // Reveal remaining grid to show where mines were
        setGrid(prev => prev.map(t => ({ ...t, revealed: true })));

        if (incrementStat) incrementStat('minesWins', 1);
        const currentHS = stats?.minesHighScore || 0;
        if (winAmount > currentHS && updateStat) {
            updateStat('minesHighScore', winAmount);
        }

        if (winAmount >= 500) {
            feedService.broadcast('arcade_win', {
                player: userProfile?.name || 'CyberMiner',
                game: 'Cyber Mines',
                coinsWon: winAmount,
                avatar: selectedMascot.skin
            });
        }

        // Add to ghost feed
        setGhostFeed(prev => [
            { id: Date.now(), user: userProfile?.name || 'You', text: `Cashed out ${overrideMult.toFixed(2)}x (+${winAmount} CP)! 💎`, time: 'Just now' },
            ...prev.slice(0, 3)
        ]);
    };

    const currentCashoutValue = Math.floor(wager * currentMultiplier);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none">
            {/* Ambient Cyber Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-black pointer-events-none" />
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

            {/* Main Cyber Mines Cabinet */}
            <div className="relative z-10 w-full max-w-[820px] bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,255,102,0.25)] flex flex-col items-center">
                {/* Header Title & Marquee */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-pulse">💎</span>
                        <h1 className="text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]">
                            CYBER MINES 2088
                        </h1>
                    </div>

                    <div className="px-3 py-1 bg-black/60 rounded-full border border-emerald-500/30 text-[11px] font-mono text-emerald-300 tracking-wide truncate">
                        {messageFeed}
                    </div>
                </div>

                {/* Score & HUD Banner */}
                <div className="w-full grid grid-cols-3 gap-2 mb-4 bg-black/70 p-3 rounded-2xl border border-slate-800 font-mono text-center">
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">GEMS FOUND</span>
                        <div className="text-xl sm:text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                            {revealedGems} / {TOTAL_TILES - minesCount}
                        </div>
                    </div>
                    <div className="border-x border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">MULTIPLIER</span>
                        <div className={`text-xl sm:text-2xl font-black ${currentMultiplier > 1 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-slate-400'}`}>
                            {currentMultiplier.toFixed(2)}x
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">NEXT GEM</span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]">
                            {nextMultiplier.toFixed(2)}x
                        </div>
                    </div>
                </div>

                {/* Interactive 5x5 Cyber Grid Area */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* The 5x5 Grid (Col 1-2 on desktop) */}
                    <div className="lg:col-span-2 aspect-square max-w-[440px] w-full mx-auto grid grid-cols-5 gap-2 p-3 bg-black/80 rounded-2xl border-2 border-emerald-500/30 shadow-inner">
                        {grid.map((tile, i) => {
                            let tileClass = 'bg-slate-800/90 border-slate-700 hover:border-cyan-400/80 hover:bg-slate-700/80';
                            let content = null;

                            if (tile.revealed) {
                                if (tile.isMine) {
                                    tileClass = 'bg-red-950/80 border-red-500 shadow-[0_0_15px_#ff0055] animate-shake';
                                    content = <span className="text-2xl">💣</span>;
                                } else {
                                    tileClass = 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_#00ff66] animate-pop';
                                    content = <span className="text-2xl">💎</span>;
                                }
                            } else if (tile.scanned) {
                                tileClass = 'bg-cyan-950/90 border-cyan-400 animate-pulse shadow-[0_0_15px_#00e5ff]';
                                content = <span className="text-xs font-mono font-bold text-cyan-300">SAFE!</span>;
                            }

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleTileClick(i)}
                                    disabled={!isPlaying || tile.revealed || gameOver || cashedOut}
                                    className={`rounded-xl border flex items-center justify-center transition-all aspect-square active:scale-95 disabled:cursor-default ${tileClass}`}
                                >
                                    {content}
                                </button>
                            );
                        })}
                    </div>

                    {/* Betting & Tactical Scout Console (Col 3) */}
                    <div className="w-full flex flex-col gap-3 font-mono">
                        {/* Wager Input */}
                        <div className="bg-black/60 border border-slate-800 rounded-2xl p-3">
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                                <span>BET AMOUNT</span>
                                <span>MAX: {(coins ?? 0).toLocaleString()} CP</span>
                            </div>
                            <input
                                type="number"
                                min="10"
                                max={coins ?? 100000}
                                value={wager}
                                onChange={(e) => setWager(Math.max(10, parseInt(e.target.value) || 0))}
                                disabled={isPlaying}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-400 font-bold text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-50 mb-2"
                            />
                            <div className="grid grid-cols-4 gap-1">
                                {[25, 100, 500, 1000].map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setWager(amt)}
                                        disabled={isPlaying}
                                        className="py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 disabled:opacity-40"
                                    >
                                        +{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mines Count Selector */}
                        <div className="bg-black/60 border border-slate-800 rounded-2xl p-3">
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                                <span>NUMBER OF MINES</span>
                                <span className="text-red-400 font-bold">{minesCount} MINES</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                                {MINE_PRESETS.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMinesCount(m)}
                                        disabled={isPlaying}
                                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${minesCount === m ? 'border-red-400 bg-red-950/40 text-red-300 shadow-[0_0_8px_#ff0055]' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'} disabled:opacity-50`}
                                    >
                                        {m} {m === 1 ? 'Mine' : 'Mines'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mascot Scout Drone Perk */}
                        <div className="bg-black/60 border border-slate-800 rounded-2xl p-3">
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                                <span>SCOUT DRONE</span>
                                <span className="text-[10px] text-cyan-300">{selectedMascot.perk}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                {SCOUT_MASCOTS.map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setSelectedMascot(m)}
                                        disabled={isPlaying}
                                        className={`w-8 h-8 rounded-xl overflow-hidden border-2 p-0.5 transition-all ${selectedMascot.id === m.id ? 'border-cyan-400 scale-110 shadow-[0_0_10px_#00e5ff]' : 'border-transparent opacity-50 hover:opacity-100'} disabled:opacity-40`}
                                        title={m.name}
                                    >
                                        <img src={m.skin} alt={m.name} className="w-full h-full object-cover rounded-lg" />
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleScoutScan}
                                disabled={!isPlaying || !scoutAvailable || gameOver}
                                className="w-full py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/60 text-cyan-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-30 transition-all shadow-md active:scale-95"
                            >
                                <span>🔍</span>
                                <span>{scoutAvailable ? 'SCAN 1 SAFE TILE (FREE)' : 'DRONE DEPLETED'}</span>
                            </button>
                        </div>

                        {/* SPONSOR LOSS INSURANCE BANNER */}
                        {lostWager > 0 && !hasClaimedInsurance && (
                            <div className="w-full p-3 rounded-2xl bg-gradient-to-r from-red-950/70 via-amber-950/50 to-slate-950/90 border border-amber-500/50 flex items-center justify-between gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🛡️</span>
                                    <div>
                                        <div className="text-[11px] font-black text-amber-400 font-mono tracking-wide">
                                            SPONSOR LOSS INSURANCE
                                        </div>
                                        <div className="text-[10px] text-slate-300">
                                            Recover 50% (+{Math.floor(lostWager / 2)} CP) via 10s Sponsor Spot.
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowSponsorModal(true)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black font-mono text-[11px] rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                                >
                                    <span>📺</span>
                                    <span>CLAIM +{Math.floor(lostWager / 2)} CP</span>
                                </button>
                            </div>
                        )}

                        <RewardedSponsorModal
                            isOpen={showSponsorModal}
                            onClose={() => setShowSponsorModal(false)}
                            rewardTitle={`+${Math.floor(lostWager / 2)} CP CASHBACK`}
                            rewardIcon="🛡️"
                            rewardDescription={`Complete the sponsor spot to recover 50% of your lost minefield bet (+${Math.floor(lostWager / 2)} CP)!`}
                            onRewarded={() => {
                                const refund = Math.floor(lostWager / 2);
                                addCoins?.(refund);
                                setHasClaimedInsurance(true);
                                setLostWager(0);
                                showToast?.(`50% Minefield Loss Insurance Recovered (+${refund} CP)!`, 'coin');
                            }}
                        />

                        {/* Action Buttons: Bet or Cashout */}
                        <div>
                            {isPlaying && revealedGems > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => handleCashout()}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.8)] active:scale-95 transition-all flex flex-col items-center justify-center animate-pulse"
                                >
                                    <span>⚡ CASH OUT NOW!</span>
                                    <span className="text-xs font-extrabold mt-0.5">
                                        +{currentCashoutValue.toLocaleString()} CP ({currentMultiplier.toFixed(2)}x)
                                    </span>
                                </button>
                            ) : (
                                <SquishyButton
                                    onClick={handleStartGame}
                                    disabled={isPlaying || (coins ?? 0) < wager}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-yellow-400 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                                >
                                    <span>🚀</span>
                                    <span>START MINES ({wager} CP)</span>
                                </SquishyButton>
                            )}
                        </div>
                    </div>
                </div>

                {/* Simulated Live Ghost Grid Activity Ticker */}
                <div className="w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        LIVE MINES NETWORK ACTIVITY
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ghostFeed.map(feed => (
                            <div key={feed.id} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                <span className="text-slate-300 font-bold">@{feed.user}:</span>
                                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{feed.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberMines;
