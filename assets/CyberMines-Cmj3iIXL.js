import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-D1qMrXPS.js";
import { R as RewardedSponsorModal } from "./RewardedSponsorModal-DLMvuypS.js";
const TOTAL_TILES = 25;
const MINE_PRESETS = [1, 3, 5, 10, 15, 24];
const SCOUT_MASCOTS = [
  { id: "dino", name: "Turbo Dino", skin: "/assets/skins/face_dino.png", perk: "Thermal Sniffer" },
  { id: "bunny", name: "Cyber Bunny", skin: "/assets/skins/face_bunny.png", perk: "EMP Pulse" },
  { id: "money", name: "Whale Bro", skin: "/assets/skins/face_money.png", perk: "Gold Radar" },
  { id: "star", name: "Super Star", skin: "/assets/skins/face_star.png", perk: "Quantum Probe" }
];
const calculateMultiplier = (minesCount, gemsRevealed) => {
  if (gemsRevealed <= 0) return 1;
  let mult = 0.98;
  for (let i = 0; i < gemsRevealed; i++) {
    mult *= (TOTAL_TILES - i) / (TOTAL_TILES - minesCount - i);
  }
  return parseFloat(mult.toFixed(2));
};
const CyberMines = () => {
  const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();
  const audioCtxRef = reactExports.useRef(null);
  const [wager, setWager] = reactExports.useState(100);
  const [minesCount, setMinesCount] = reactExports.useState(3);
  const [selectedMascot, setSelectedMascot] = reactExports.useState(SCOUT_MASCOTS[0]);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [grid, setGrid] = reactExports.useState(Array(TOTAL_TILES).fill({ revealed: false, isMine: false, scanned: false }));
  const [revealedGems, setRevealedGems] = reactExports.useState(0);
  const [currentMultiplier, setCurrentMultiplier] = reactExports.useState(1);
  const [nextMultiplier, setNextMultiplier] = reactExports.useState(1.11);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [cashedOut, setCashedOut] = reactExports.useState(false);
  const [scoutAvailable, setScoutAvailable] = reactExports.useState(true);
  const [messageFeed, setMessageFeed] = reactExports.useState("CONFIGURE MINES & BET TO START THE GRID!");
  const [lostWager, setLostWager] = reactExports.useState(0);
  const [hasClaimedInsurance, setHasClaimedInsurance] = reactExports.useState(false);
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const [ghostFeed, setGhostFeed] = reactExports.useState([
    { id: 1, user: "CyberBunny", text: "Cashed out 2.45x (+490 CP)! 💎", time: "Just now" },
    { id: 2, user: "TurboDino", text: "Hit a mine on tile 18 (Busted 250 CP)! 💥", time: "12s ago" },
    { id: 3, user: "WhaleBro", text: "Scored 14.8x on 5-Mine Grid (+7,400 CP)! 💰", time: "28s ago" }
  ]);
  const playTileChime = (gemIndex) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const baseFreq = 320;
      const freq = baseFreq * Math.pow(1.12, gemIndex);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
    }
  };
  const playMineDetonation = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
    }
  };
  reactExports.useEffect(() => {
    const next = calculateMultiplier(minesCount, revealedGems + 1);
    setNextMultiplier(next);
  }, [minesCount, revealedGems]);
  const handleStartGame = () => {
    if (wager <= 0) {
      showToast("Enter a valid wager!", "error");
      return;
    }
    if ((coins ?? 0) < wager) {
      showToast("Insufficient Cyber Points!", "error");
      return;
    }
    if (addCoins) addCoins(-wager);
    playCollect();
    const mineIndices = /* @__PURE__ */ new Set();
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
    setCurrentMultiplier(1);
    setScoutAvailable(true);
    setMessageFeed(`GRID ACTIVE! FIND THE GEMS & AVOID ${minesCount} MINES!`);
    if (incrementStat) {
      incrementStat("minesGames", 1);
      incrementStat("gamesPlayedCount", 1);
    }
  };
  const handleTileClick = (index) => {
    if (!isPlaying || gameOver || cashedOut || grid[index].revealed) return;
    const tile = grid[index];
    if (tile.isMine) {
      playMineDetonation();
      playCrash();
      setIsPlaying(false);
      setGameOver(true);
      setMessageFeed(`💥 DETONATION ON TILE ${index + 1}! BUSTED ${wager} CP!`);
      showToast(`Detonation! Lost ${wager} CP!`, "error");
      setLostWager(wager);
      setHasClaimedInsurance(false);
      setGrid((prev) => prev.map((t) => ({ ...t, revealed: true })));
      setGhostFeed((prev) => [
        { id: Date.now(), user: userProfile?.name || "You", text: `Hit a mine on tile ${index + 1} (-${wager} CP)! 💥`, time: "Just now" },
        ...prev.slice(0, 3)
      ]);
      return;
    }
    const nextRevealedCount = revealedGems + 1;
    setRevealedGems(nextRevealedCount);
    playTileChime(nextRevealedCount);
    const newMult = calculateMultiplier(minesCount, nextRevealedCount);
    setCurrentMultiplier(newMult);
    const updatedGrid = [...grid];
    updatedGrid[index] = { ...tile, revealed: true };
    setGrid(updatedGrid);
    setMessageFeed(`💎 GEM REVEALED! CURRENT: ${newMult.toFixed(2)}x (+${Math.floor(wager * newMult)} CP)`);
    if (nextRevealedCount === TOTAL_TILES - minesCount) {
      handleCashout(newMult);
    }
  };
  const handleScoutScan = () => {
    if (!isPlaying || !scoutAvailable || gameOver) return;
    const unrevealedGems = grid.filter((t) => !t.revealed && !t.isMine);
    if (unrevealedGems.length === 0) return;
    const luckyTile = unrevealedGems[Math.floor(Math.random() * unrevealedGems.length)];
    setGrid((prev) => prev.map((t) => t.id === luckyTile.id ? { ...t, scanned: true } : t));
    setScoutAvailable(false);
    playTileChime(8);
    showToast(`🔍 ${selectedMascot.name}'s Scout Drone detected a safe gem at Tile ${luckyTile.id + 1}!`, "info");
    setMessageFeed(`🔍 SCOUT DRONE HIGHLIGHTED SAFE TILE #${luckyTile.id + 1}!`);
  };
  const handleCashout = (overrideMult = currentMultiplier) => {
    if (!isPlaying || revealedGems === 0 || gameOver || cashedOut) return;
    const winAmount = Math.floor(wager * overrideMult);
    setCashedOut(true);
    setIsPlaying(false);
    if (addCoins) addCoins(winAmount);
    playWin();
    if (overrideMult >= 3) {
      playAirhorn();
      triggerConfetti();
    }
    setMessageFeed(`🎉 CASHED OUT AT ${overrideMult.toFixed(2)}x! WON +${winAmount.toLocaleString()} CP!`);
    showToast(`Cashed out at ${overrideMult.toFixed(2)}x! Won +${winAmount} CP!`, "success");
    setGrid((prev) => prev.map((t) => ({ ...t, revealed: true })));
    if (incrementStat) incrementStat("minesWins", 1);
    const currentHS = stats?.minesHighScore || 0;
    if (winAmount > currentHS && updateStat) {
      updateStat("minesHighScore", winAmount);
    }
    if (winAmount >= 500) {
      feedService.broadcast("arcade_win", {
        player: userProfile?.name || "CyberMiner",
        game: "Cyber Mines",
        coinsWon: winAmount,
        avatar: selectedMascot.skin
      });
    }
    setGhostFeed((prev) => [
      { id: Date.now(), user: userProfile?.name || "You", text: `Cashed out ${overrideMult.toFixed(2)}x (+${winAmount} CP)! 💎`, time: "Just now" },
      ...prev.slice(0, 3)
    ]);
  };
  const currentCashoutValue = Math.floor(wager * currentMultiplier);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#00ff6608_1px,transparent_1px),linear-gradient(to_bottom,#00ff6608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[820px] flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/arcade",
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono text-xs font-bold shadow-lg active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◄" }),
            " ARCADE HUB"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-1.5 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          (coins ?? 0).toLocaleString(),
          " CP"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[820px] bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,255,102,0.25)] flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl animate-pulse", children: "💎" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]", children: "CYBER MINES 2088" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 bg-black/60 rounded-full border border-emerald-500/30 text-[11px] font-mono text-emerald-300 tracking-wide truncate", children: messageFeed })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full grid grid-cols-3 gap-2 mb-4 bg-black/70 p-3 rounded-2xl border border-slate-800 font-mono text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "GEMS FOUND" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl sm:text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]", children: [
            revealedGems,
            " / ",
            TOTAL_TILES - minesCount
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-x border-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "MULTIPLIER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xl sm:text-2xl font-black ${currentMultiplier > 1 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" : "text-slate-400"}`, children: [
            currentMultiplier.toFixed(2),
            "x"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "NEXT GEM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]", children: [
            nextMultiplier.toFixed(2),
            "x"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 aspect-square max-w-[440px] w-full mx-auto grid grid-cols-5 gap-2 p-3 bg-black/80 rounded-2xl border-2 border-emerald-500/30 shadow-inner", children: grid.map((tile, i) => {
          let tileClass = "bg-slate-800/90 border-slate-700 hover:border-cyan-400/80 hover:bg-slate-700/80";
          let content = null;
          if (tile.revealed) {
            if (tile.isMine) {
              tileClass = "bg-red-950/80 border-red-500 shadow-[0_0_15px_#ff0055] animate-shake";
              content = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💣" });
            } else {
              tileClass = "bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_#00ff66] animate-pop";
              content = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💎" });
            }
          } else if (tile.scanned) {
            tileClass = "bg-cyan-950/90 border-cyan-400 animate-pulse shadow-[0_0_15px_#00e5ff]";
            content = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-cyan-300", children: "SAFE!" });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleTileClick(i),
              disabled: !isPlaying || tile.revealed || gameOver || cashedOut,
              className: `rounded-xl border flex items-center justify-center transition-all aspect-square active:scale-95 disabled:cursor-default ${tileClass}`,
              children: content
            },
            i
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col gap-3 font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 border border-slate-800 rounded-2xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-400 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "BET AMOUNT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "MAX: ",
                (coins ?? 0).toLocaleString(),
                " CP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "10",
                max: coins ?? 1e5,
                value: wager,
                onChange: (e) => setWager(Math.max(10, parseInt(e.target.value) || 0)),
                disabled: isPlaying,
                className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-400 font-bold text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-50 mb-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: [25, 100, 500, 1e3].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setWager(amt),
                disabled: isPlaying,
                className: "py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 disabled:opacity-40",
                children: [
                  "+",
                  amt
                ]
              },
              amt
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 border border-slate-800 rounded-2xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-400 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "NUMBER OF MINES" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400 font-bold", children: [
                minesCount,
                " MINES"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5 mt-1.5", children: MINE_PRESETS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setMinesCount(m),
                disabled: isPlaying,
                className: `py-1.5 rounded-xl border text-xs font-bold transition-all ${minesCount === m ? "border-red-400 bg-red-950/40 text-red-300 shadow-[0_0_8px_#ff0055]" : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"} disabled:opacity-50`,
                children: [
                  m,
                  " ",
                  m === 1 ? "Mine" : "Mines"
                ]
              },
              m
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 border border-slate-800 rounded-2xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-400 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SCOUT DRONE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-cyan-300", children: selectedMascot.perk })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: SCOUT_MASCOTS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedMascot(m),
                disabled: isPlaying,
                className: `w-8 h-8 rounded-xl overflow-hidden border-2 p-0.5 transition-all ${selectedMascot.id === m.id ? "border-cyan-400 scale-110 shadow-[0_0_10px_#00e5ff]" : "border-transparent opacity-50 hover:opacity-100"} disabled:opacity-40`,
                title: m.name,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.skin, alt: m.name, className: "w-full h-full object-cover rounded-lg" })
              },
              m.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleScoutScan,
                disabled: !isPlaying || !scoutAvailable || gameOver,
                className: "w-full py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/60 text-cyan-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-30 transition-all shadow-md active:scale-95",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔍" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scoutAvailable ? "SCAN 1 SAFE TILE (FREE)" : "DRONE DEPLETED" })
                ]
              }
            )
          ] }),
          lostWager > 0 && !hasClaimedInsurance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full p-3 rounded-2xl bg-gradient-to-r from-red-950/70 via-amber-950/50 to-slate-950/90 border border-amber-500/50 flex items-center justify-between gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🛡️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-black text-amber-400 font-mono tracking-wide", children: "SPONSOR LOSS INSURANCE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-300", children: [
                  "Recover 50% (+",
                  Math.floor(lostWager / 2),
                  " CP) via 10s Sponsor Spot."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowSponsorModal(true),
                className: "px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black font-mono text-[11px] rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📺" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "CLAIM +",
                    Math.floor(lostWager / 2),
                    " CP"
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RewardedSponsorModal,
            {
              isOpen: showSponsorModal,
              onClose: () => setShowSponsorModal(false),
              rewardTitle: `+${Math.floor(lostWager / 2)} CP CASHBACK`,
              rewardIcon: "🛡️",
              rewardDescription: `Complete the sponsor spot to recover 50% of your lost minefield bet (+${Math.floor(lostWager / 2)} CP)!`,
              onRewarded: () => {
                const refund = Math.floor(lostWager / 2);
                addCoins?.(refund);
                setHasClaimedInsurance(true);
                setLostWager(0);
                showToast?.(`50% Minefield Loss Insurance Recovered (+${refund} CP)!`, "coin");
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isPlaying && revealedGems > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleCashout(),
              className: "w-full py-4 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.8)] active:scale-95 transition-all flex flex-col items-center justify-center animate-pulse",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡ CASH OUT NOW!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-extrabold mt-0.5", children: [
                  "+",
                  currentCashoutValue.toLocaleString(),
                  " CP (",
                  currentMultiplier.toFixed(2),
                  "x)"
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SquishyButton,
            {
              onClick: handleStartGame,
              disabled: isPlaying || (coins ?? 0) < wager,
              className: "w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-yellow-400 text-black font-black text-base uppercase rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚀" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "START MINES (",
                  wager,
                  " CP)"
                ] })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
          "LIVE MINES NETWORK ACTIVITY"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: ghostFeed.map((feed) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-300 font-bold", children: [
            "@",
            feed.user,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400 truncate max-w-[150px]", children: feed.text })
        ] }, feed.id)) })
      ] })
    ] })
  ] });
};
export {
  CyberMines as default
};
