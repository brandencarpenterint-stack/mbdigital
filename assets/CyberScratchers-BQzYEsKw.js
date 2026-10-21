import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-D1qMrXPS.js";
const CARD_TIERS = [
  {
    id: "street",
    name: "Street Hustle",
    cost: 50,
    color: "#00e5ff",
    maxPrize: 5e3,
    rows: 3,
    cols: 3,
    symbols: [
      { id: "pizza", name: "Neon Pizza", icon: "🍕", value: 100 },
      { id: "coin", name: "Cyber Coin", icon: "🪙", value: 250 },
      { id: "dino", name: "Turbo Dino", icon: "🦖", skin: "/assets/skins/face_dino.png", value: 1e3 },
      { id: "gold", name: "Gold Bar", icon: "🏆", value: 5e3 }
    ]
  },
  {
    id: "syndicate",
    name: "Neon Syndicate",
    cost: 250,
    color: "#ff007f",
    maxPrize: 25e3,
    rows: 3,
    cols: 4,
    symbols: [
      { id: "dice", name: "Cyber Dice", icon: "🎲", value: 500 },
      { id: "bunny", name: "Cyber Bunny", icon: "🐰", skin: "/assets/skins/face_bunny.png", value: 2500 },
      { id: "diamond", name: "Neon Diamond", icon: "💎", value: 1e4 },
      { id: "key", name: "Vault Key", icon: "🗝️", value: 25e3 }
    ]
  },
  {
    id: "whale",
    name: "Whale Grand Jackpot",
    cost: 1e3,
    color: "#ffd700",
    maxPrize: 1e5,
    rows: 4,
    cols: 4,
    symbols: [
      { id: "chip", name: "VIP Chip", icon: "🎰", value: 2500 },
      { id: "star", name: "Star Bro", icon: "⭐", skin: "/assets/skins/face_star.png", value: 25e3 },
      { id: "crown", name: "Cyber Crown", icon: "👑", value: 5e4 },
      { id: "whale", name: "Whale Bro", icon: "💰", skin: "/assets/skins/face_money.png", value: 1e5 }
    ]
  }
];
const CyberScratchers = () => {
  const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const isScratchingRef = reactExports.useRef(false);
  const [selectedTier, setSelectedTier] = reactExports.useState(CARD_TIERS[0]);
  const [cardActive, setCardActive] = reactExports.useState(false);
  const [gridSymbols, setGridSymbols] = reactExports.useState([]);
  const [scratchedPercent, setScratchedPercent] = reactExports.useState(0);
  const [cardResult, setCardResult] = reactExports.useState(null);
  const [revealed, setRevealed] = reactExports.useState(false);
  const [recentWins, setRecentWins] = reactExports.useState([
    { user: "TurboDino", prize: 1e3, tier: "Street Hustle" },
    { user: "CyberBunny", prize: 1e4, tier: "Neon Syndicate" },
    { user: "WhaleBro", prize: 5e4, tier: "Whale Grand" }
  ]);
  const playScrapeSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1800;
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch (e) {
    }
  };
  const generateCard = (tier) => {
    const totalSpots = tier.rows * tier.cols;
    const symbols = tier.symbols;
    const isWinningCard = Math.random() < 0.42;
    const grid = [];
    if (isWinningCard) {
      const roll = Math.random();
      let winningSym = symbols[0];
      if (roll < 0.04) winningSym = symbols[3];
      else if (roll < 0.15) winningSym = symbols[2];
      else if (roll < 0.4) winningSym = symbols[1];
      else winningSym = symbols[0];
      const winPositions = /* @__PURE__ */ new Set();
      while (winPositions.size < 3) {
        winPositions.add(Math.floor(Math.random() * totalSpots));
      }
      for (let i = 0; i < totalSpots; i++) {
        if (winPositions.has(i)) {
          grid.push(winningSym);
        } else {
          const others = symbols.filter((s) => s.id !== winningSym.id);
          grid.push(others[Math.floor(Math.random() * others.length)]);
        }
      }
      return { grid, isWin: true, prize: winningSym.value, winningSymbol: winningSym };
    } else {
      const counts = {};
      symbols.forEach((s) => counts[s.id] = 0);
      for (let i = 0; i < totalSpots; i++) {
        const available = symbols.filter((s) => counts[s.id] < 2);
        const sym = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : symbols[0];
        counts[sym.id] = (counts[sym.id] || 0) + 1;
        grid.push(sym);
      }
      return { grid, isWin: false, prize: 0, winningSymbol: null };
    }
  };
  const handleBuyCard = () => {
    if ((coins ?? 0) < selectedTier.cost) {
      showToast("Insufficient Cyber Points for this card!", "error");
      return;
    }
    if (addCoins) addCoins(-selectedTier.cost);
    playCollect();
    const { grid, isWin, prize, winningSymbol } = generateCard(selectedTier);
    setGridSymbols(grid);
    setCardResult({ won: isWin, prize, winningSymbol });
    setCardActive(true);
    setRevealed(false);
    setScratchedPercent(0);
    if (incrementStat) {
      incrementStat("scratchersPlayed", 1);
      incrementStat("gamesPlayedCount", 1);
    }
    setTimeout(() => {
      initFoilCanvas();
    }, 50);
  };
  const initFoilCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.globalCompositeOperation = "source-over";
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#94a3b8");
    grad.addColorStop(0.25, "#e2e8f0");
    grad.addColorStop(0.5, "#64748b");
    grad.addColorStop(0.75, "#cbd5e1");
    grad.addColorStop(1, "#475569");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
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
    ctx.fillStyle = "#1e293b";
    ctx.font = '900 18px "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.fillText("⚡ SCRATCH TO REVEAL ⚡", w / 2, h / 2 - 10);
    ctx.font = '700 11px "Courier New", monospace';
    ctx.fillStyle = selectedTier.color;
    ctx.fillText(`TOP PRIZE: +${selectedTier.maxPrize.toLocaleString()} CP`, w / 2, h / 2 + 16);
  };
  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width * canvas.width;
    const y = (clientY - rect.top) / rect.height * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    playScrapeSound();
    checkScratchedPercent();
  };
  const checkScratchedPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
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
    const pct = Math.floor(cleared / 64 * 100);
    setScratchedPercent(pct);
    if (pct >= 55 && !revealed) {
      handleCompleteReveal();
    }
  };
  const handleCompleteReveal = () => {
    setRevealed(true);
    setScratchedPercent(100);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
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
      showToast(`🎉 MATCH 3 WINNER! You won +${win.toLocaleString()} CP!`, "success");
      if (incrementStat) incrementStat("scratchersWon", 1);
      const currentHS = stats?.scratchersHighScore || 0;
      if (win > currentHS && updateStat) {
        updateStat("scratchersHighScore", win);
      }
      if (win >= 1e3) {
        feedService.broadcast("arcade_win", {
          player: userProfile?.name || "LuckyScratcher",
          game: "Cyber Scratchers",
          coinsWon: win,
          avatar: selectedTier.symbols[3].skin || "/assets/skins/face_money.png"
        });
      }
      setRecentWins((prev) => [
        { user: userProfile?.name || "You", prize: win, tier: selectedTier.name },
        ...prev.slice(0, 3)
      ]);
    } else {
      playCrash();
      showToast("No match this time! Try another card!", "info");
    }
  };
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-950/30 via-slate-950 to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#ffd70008_1px,transparent_1px),linear-gradient(to_bottom,#ffd70008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] flex items-center justify-between mb-3 px-1", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-yellow-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(255,215,0,0.25)] flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl animate-bounce", children: "🎟️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]", children: "CYBER SCRATCHERS: HIGH-ROLLER" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 bg-black/60 rounded-full border border-yellow-500/30 text-[11px] font-mono text-yellow-300 tracking-wide", children: "MATCH 3 SYMBOLS TO WIN UP TO 100,000 CP!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full grid grid-cols-3 gap-2 mb-4 font-mono text-xs", children: CARD_TIERS.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (!cardActive) setSelectedTier(tier);
          },
          disabled: cardActive,
          className: `p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedTier.id === tier.id ? "bg-yellow-500/20 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105" : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"} disabled:opacity-50`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-sm", style: { color: tier.color }, children: tier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold mt-1", children: [
              "COST: ",
              tier.cost,
              " CP"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-yellow-400", children: [
              "TOP: ",
              tier.maxPrize.toLocaleString(),
              " CP"
            ] })
          ]
        },
        tier.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[480px] bg-black/80 rounded-3xl border-2 border-yellow-500/50 p-4 shadow-[0_0_30px_rgba(255,215,0,0.2)] flex flex-col items-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center justify-between mb-3 border-b border-slate-800 pb-2 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black", style: { color: selectedTier.color }, children: selectedTier.name.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: scratchedPercent > 0 ? `${scratchedPercent}% SCRATCHED` : "READY TO SCRATCH" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-3", children: cardActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full h-full grid gap-2",
              style: {
                gridTemplateColumns: `repeat(${selectedTier.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${selectedTier.rows}, minmax(0, 1fr))`
              },
              children: gridSymbols.map((sym, idx) => {
                const isWinningSymbol = cardResult?.won && cardResult.winningSymbol.id === sym.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `rounded-xl border flex flex-col items-center justify-center p-1 font-mono transition-all ${isWinningSymbol && revealed ? "bg-yellow-500/30 border-yellow-400 shadow-[0_0_12px_#ffd700] animate-pulse" : "bg-slate-900 border-slate-800"}`,
                    children: [
                      sym.skin ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sym.skin, alt: sym.name, className: "w-7 h-7 rounded-full object-cover border border-slate-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: sym.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-yellow-300 font-bold mt-0.5", children: [
                        "+",
                        sym.value.toLocaleString()
                      ] })
                    ]
                  },
                  idx
                );
              })
            }
          ),
          !revealed && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: 440,
              height: 330,
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              onMouseLeave: handleMouseUp,
              onTouchStart: handleTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleMouseUp,
              className: "absolute inset-0 w-full h-full cursor-pointer touch-none"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center text-center p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-2", children: "🎟️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-yellow-400", children: [
            "BUY A ",
            selectedTier.name.toUpperCase(),
            " TICKET"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 max-w-xs font-mono mt-1", children: "Match 3 identical symbols anywhere on the card to win the multiplier prize!" })
        ] }) }),
        revealed && cardResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full mt-3 p-3 rounded-2xl border text-center font-mono font-black ${cardResult.won ? "bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_#00ff66]" : "bg-red-950/40 border-red-500 text-red-400"}`, children: cardResult.won ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "🎉 YOU WON +",
          cardResult.prize.toLocaleString(),
          " CP!"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "NO MATCH THIS TIME! BETTER LUCK NEXT CARD!" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mt-3 flex gap-2", children: cardActive && !revealed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleCompleteReveal,
            className: "w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-xs uppercase rounded-xl border border-slate-700 transition-all active:scale-95",
            children: "⚡ AUTO-SCRATCH (QUICK REVEAL)"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SquishyButton,
          {
            onClick: handleBuyCard,
            disabled: (coins ?? 0) < selectedTier.cost,
            className: "w-full py-3.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black font-black text-sm uppercase rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40",
            children: [
              "🎟️ BUY SCRATCHER (",
              selectedTier.cost,
              " CP)"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-yellow-400 animate-ping" }),
          "RECENT LOTTERY JACKPOTS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: recentWins.map((w, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-300 font-bold", children: [
            "@",
            w.user,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-black", children: [
            "+",
            w.prize.toLocaleString(),
            " CP (",
            w.tier,
            ")"
          ] })
        ] }, idx)) })
      ] })
    ] })
  ] });
};
export {
  CyberScratchers as default
};
