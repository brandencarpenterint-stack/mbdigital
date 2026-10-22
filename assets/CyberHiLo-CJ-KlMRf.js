import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-B8Id7fqA.js";
const SUITS = [
  { name: "Spades", symbol: "♠", color: "#00e5ff", glow: "rgba(0, 229, 255, 0.5)" },
  { name: "Hearts", symbol: "♥", color: "#ff0055", glow: "rgba(255, 0, 85, 0.5)" },
  { name: "Clubs", symbol: "♣", color: "#00ff66", glow: "rgba(0, 255, 102, 0.5)" },
  { name: "Diamonds", symbol: "♦", color: "#ffd700", glow: "rgba(255, 215, 0, 0.5)" }
];
const RANKS = [
  { value: 1, label: "A", name: "Ace" },
  { value: 2, label: "2", name: "2" },
  { value: 3, label: "3", name: "3" },
  { value: 4, label: "4", name: "4" },
  { value: 5, label: "5", name: "5" },
  { value: 6, label: "6", name: "6" },
  { value: 7, label: "7", name: "7" },
  { value: 8, label: "8", name: "8" },
  { value: 9, label: "9", name: "9" },
  { value: 10, label: "10", name: "10" },
  { value: 11, label: "J", name: "Jack" },
  { value: 12, label: "Q", name: "Queen" },
  { value: 13, label: "K", name: "King" }
];
const BET_PRESETS = [25, 50, 100, 250, 500, 1e3];
const CyberHiLo = () => {
  const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playCrash, playCollect, playAirhorn } = useRetroSound();
  const audioCtxRef = reactExports.useRef(null);
  const [bet, setBet] = reactExports.useState(100);
  const [inRound, setInRound] = reactExports.useState(false);
  const [currentCard, setCurrentCard] = reactExports.useState(null);
  const [nextCard, setNextCard] = reactExports.useState(null);
  const [cardHistory, setCardHistory] = reactExports.useState([]);
  const [multiplier, setMultiplier] = reactExports.useState(1);
  const [skipsRemaining, setSkipsRemaining] = reactExports.useState(2);
  const [isFlipping, setIsFlipping] = reactExports.useState(false);
  const [roundResult, setRoundResult] = reactExports.useState(null);
  const [highestStreak, setHighestStreak] = reactExports.useState(0);
  const playSynthTone = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "flip") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.09);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === "correct") {
        const chord = [523.25, 659.25, 783.99, 1046.5];
        const freq = chord[Math.min(chord.length - 1, cardHistory.length % chord.length)];
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.26);
      } else if (type === "loss") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.38);
        osc.start(t);
        osc.stop(t + 0.4);
      }
    } catch (e) {
    }
  };
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
  const getMultipliers = (card) => {
    if (!card) return { higher: 1.5, lower: 1.5 };
    const rankVal = card.value;
    const higherCount = 13 - rankVal;
    const lowerCount = rankVal - 1;
    const higherMult = higherCount > 0 ? Number((12 / higherCount * 0.96).toFixed(2)) : 12;
    const lowerMult = lowerCount > 0 ? Number((12 / lowerCount * 0.96).toFixed(2)) : 12;
    return {
      higher: Math.max(1.05, higherMult),
      lower: Math.max(1.05, lowerMult)
    };
  };
  const handleStartGame = () => {
    if ((coins ?? 0) < bet) {
      showToast("Insufficient Cyber Points for this bet!", "error");
      return;
    }
    if (addCoins) addCoins(-bet);
    playCollect();
    const initialCard = getRandomCard();
    setCurrentCard(initialCard);
    setNextCard(null);
    setCardHistory([initialCard]);
    setMultiplier(1);
    setSkipsRemaining(2);
    setInRound(true);
    setRoundResult(null);
    if (incrementStat) {
      incrementStat("hiloRoundsPlayed", 1);
      incrementStat("gamesPlayedCount", 1);
    }
  };
  const handleGuess = (direction) => {
    if (!inRound || isFlipping || !currentCard) return;
    setIsFlipping(true);
    playSynthTone("flip");
    setTimeout(() => {
      const drawn = getRandomCard();
      setNextCard(drawn);
      const prevVal = currentCard.value;
      const nextVal = drawn.value;
      let isCorrect = false;
      if (direction === "higher") {
        isCorrect = nextVal > prevVal;
      } else if (direction === "lower") {
        isCorrect = nextVal < prevVal;
      }
      const { higher, lower } = getMultipliers(currentCard);
      const stepMult = direction === "higher" ? higher : lower;
      if (isCorrect) {
        playSynthTone("correct");
        const newMult = Number((multiplier * stepMult).toFixed(2));
        setMultiplier(newMult);
        setCardHistory((prev) => [drawn, ...prev]);
        setCurrentCard(drawn);
        const currentStreak = cardHistory.length;
        if (currentStreak > highestStreak) setHighestStreak(currentStreak);
        if (newMult >= 10) {
          playAirhorn();
          triggerConfetti();
        }
        showToast(`🎯 CORRECT! Multiplier increased to ${newMult}x!`, "success");
        if (incrementStat) incrementStat("hiloCorrectGuesses", 1);
      } else {
        playSynthTone("loss");
        playCrash();
        setRoundResult("loss");
        setInRound(false);
        showToast(`💥 BUSTED! The card was ${drawn.rank.label} of ${drawn.suit.name}. Better luck next run!`, "error");
      }
      setIsFlipping(false);
    }, 350);
  };
  const handleSkip = () => {
    if (!inRound || skipsRemaining <= 0 || isFlipping) return;
    setSkipsRemaining((prev) => prev - 1);
    playSynthTone("flip");
    const newCard = getRandomCard();
    setCurrentCard(newCard);
    setCardHistory((prev) => [newCard, ...prev.slice(1)]);
    showToast("🔀 Card Swapped! Streak preserved.", "info");
  };
  const handleCashOut = () => {
    if (!inRound || multiplier <= 1) return;
    const payout = Math.floor(bet * multiplier);
    if (addCoins) addCoins(payout);
    playWin();
    if (multiplier >= 5) {
      playAirhorn();
      triggerConfetti();
    }
    setRoundResult("cashout");
    setInRound(false);
    showToast(`💰 CASHED OUT! Won +${payout.toLocaleString()} CP (${multiplier}x)!`, "success");
    if (incrementStat) {
      incrementStat("hiloCashouts", 1);
      incrementStat("coinsEarnedToday", payout);
    }
    const currentHS = stats?.hiloHighScore || 0;
    if (payout > currentHS && updateStat) {
      updateStat("hiloHighScore", payout);
    }
    if (payout >= 1e3) {
      feedService.broadcast("arcade_win", {
        player: userProfile?.name || "StreakMaster",
        game: "Cyber Hi-Lo",
        coinsWon: payout,
        avatar: userProfile?.avatar || "/assets/skins/face_default.png"
      });
    }
  };
  const multipliers = getMultipliers(currentCard);
  const currentPayout = Math.floor(bet * multiplier);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#00e5ff08_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/arcade",
          className: "flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-fuchsia-500/30 text-fuchsia-400 hover:text-fuchsia-300 hover:border-fuchsia-400/60 transition-all font-mono text-xs font-bold shadow-lg active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "ARCADE HUB"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-2 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#ffd700]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          (coins ?? 0).toLocaleString(),
          " CP"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl animate-pulse", children: "🃏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]", children: "CYBER HI-LO 2088: NEON STREAK" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 bg-black/60 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-300 tracking-wide", children: "MAX MULTIPLIER: 180x" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[500px] bg-black/70 rounded-3xl border-2 border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,229,255,0.2)] flex flex-col items-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold", children: "CURRENT MULTIPLIER" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_#00e5ff]", children: [
              multiplier.toFixed(2),
              "x"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold", children: "ESTIMATED PAYOUT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_#ffd700]", children: [
              "+",
              currentPayout.toLocaleString(),
              " CP"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-44 h-64 my-2 flex items-center justify-center perspective-[1000px]", children: currentCard ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `w-full h-full bg-slate-900 border-2 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_35px] transition-all duration-300 ${isFlipping ? "scale-90 opacity-40 rotate-y-90" : "scale-100 opacity-100 rotate-y-0"}`,
            style: {
              borderColor: currentCard.suit.color,
              boxShadow: `0 0 30px ${currentCard.suit.glow}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start leading-none", style: { color: currentCard.suit.color }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black font-mono", children: currentCard.rank.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: currentCard.suit.symbol })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl drop-shadow-[0_0_15px]", style: { color: currentCard.suit.color }, children: currentCard.suit.symbol }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold mt-1 tracking-widest text-slate-400", children: currentCard.rank.name.toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end leading-none rotate-180", style: { color: currentCard.suit.color }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black font-mono", children: currentCard.rank.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: currentCard.suit.symbol })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-center p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-2", children: "🃏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "PLACE BET & DEAL FIRST CARD" })
        ] }) }),
        inRound ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SquishyButton,
              {
                onClick: () => handleGuess("higher"),
                disabled: isFlipping,
                className: "py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-mono font-black text-sm uppercase rounded-2xl border border-emerald-400 shadow-[0_0_20px_rgba(0,255,102,0.4)] flex flex-col items-center justify-center transition-all disabled:opacity-40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "▲ HIGHER" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-emerald-200 font-normal", children: [
                    "x",
                    multipliers.higher,
                    " Payout"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SquishyButton,
              {
                onClick: () => handleGuess("lower"),
                disabled: isFlipping,
                className: "py-3.5 bg-gradient-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white font-mono font-black text-sm uppercase rounded-2xl border border-rose-400 shadow-[0_0_20px_rgba(255,0,85,0.4)] flex flex-col items-center justify-center transition-all disabled:opacity-40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "▼ LOWER" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-rose-200 font-normal", children: [
                    "x",
                    multipliers.lower,
                    " Payout"
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleSkip,
                disabled: skipsRemaining <= 0 || isFlipping,
                className: "py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono font-bold text-xs uppercase rounded-xl transition-all disabled:opacity-40 active:scale-95",
                children: [
                  "🔀 SKIP (",
                  skipsRemaining,
                  " LEFT)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleCashOut,
                disabled: multiplier <= 1 || isFlipping,
                className: "py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black font-mono font-black text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:brightness-110 transition-all disabled:opacity-40 active:scale-95 animate-pulse",
                children: [
                  "💰 CASH OUT (+",
                  currentPayout.toLocaleString(),
                  " CP)"
                ]
              }
            )
          ] })
        ] }) : (
          /* Pre-Round Bet Selector & Deal Button */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 flex flex-col gap-3 font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SELECT WAGER:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-bold", children: [
                bet,
                " CP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1.5", children: BET_PRESETS.map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setBet(amt),
                className: `py-2 rounded-xl text-xs font-black border transition-all ${bet === amt ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00e5ff]" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"}`,
                children: amt
              },
              amt
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SquishyButton,
              {
                onClick: handleStartGame,
                disabled: (coins ?? 0) < bet,
                className: "w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-black font-black text-sm uppercase rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 mt-1",
                children: [
                  "🃏 DEAL & START STREAK (",
                  bet,
                  " CP)"
                ]
              }
            )
          ] })
        ),
        roundResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full mt-3 p-3 rounded-2xl border text-center font-mono font-black text-xs ${roundResult === "cashout" ? "bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_#00ff66]" : "bg-red-950/60 border-red-500 text-red-400"}`, children: roundResult === "cashout" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "🎉 CASHED OUT AT ",
          multiplier.toFixed(2),
          "x! WON +",
          currentPayout.toLocaleString(),
          " CP!"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "💥 STREAK BUSTED! BETTER LUCK NEXT RUN!" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
            "CARD STREAK TIMELINE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-400 font-bold", children: [
            "STREAK: ",
            cardHistory.length,
            " CARDS"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto py-1", children: cardHistory.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-900 border flex items-center gap-1 font-mono font-bold text-xs",
            style: { borderColor: c.suit.color },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: c.suit.color }, children: c.suit.symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.rank.label })
            ]
          },
          idx
        )) })
      ] })
    ] })
  ] });
};
export {
  CyberHiLo as default
};
