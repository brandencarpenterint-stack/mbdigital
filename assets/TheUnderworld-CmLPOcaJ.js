import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, b as SquishyButton, t as triggerConfetti, f as feedService, g as useNavigate, s as supabase, A as AnimatePresence, m as motion } from "./index-cjXhQdPB.js";
const TUMBLER_SYMBOLS = [
  { id: "gold", label: "👑 GOLD KEY", icon: "👑", color: "#ffd700", weight: 8 },
  { id: "alpha", label: "⚡ ALPHA", icon: "⚡", color: "#00e5ff", weight: 15 },
  { id: "omega", label: "🔮 OMEGA", icon: "🔮", color: "#d500f9", weight: 20 },
  { id: "matrix", label: "💾 BYPASS", icon: "💾", color: "#00ff66", weight: 25 },
  { id: "skull", label: "💀 VOID", icon: "💀", color: "#ff0055", weight: 32 }
];
const BASELINE_JACKPOT = 25e3;
const CRACK_COST = 150;
const CyberVault = () => {
  const { coins, addCoins, spendCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playAirhorn, playWin, playCrash } = useRetroSound();
  const audioCtxRef = reactExports.useRef(null);
  const [jackpot, setJackpot] = reactExports.useState(() => {
    const saved = localStorage.getItem("cyber_vault_jackpot");
    return saved ? Math.max(BASELINE_JACKPOT, parseInt(saved, 10)) : BASELINE_JACKPOT + 8420;
  });
  const [isCracking, setIsCracking] = reactExports.useState(false);
  const [reels, setReels] = reactExports.useState([TUMBLER_SYMBOLS[0], TUMBLER_SYMBOLS[1], TUMBLER_SYMBOLS[2]]);
  const [vaultBreached, setVaultBreached] = reactExports.useState(false);
  const [lastReward, setLastReward] = reactExports.useState(null);
  const [vaultDoorOpen, setVaultDoorOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => {
        const inc = Math.floor(Math.random() * 8) + 2;
        const next = prev + inc;
        localStorage.setItem("cyber_vault_jackpot", next.toString());
        return next;
      });
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  const playTumblerTick = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
    }
  };
  const playAlarmSiren = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(850, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
    }
  };
  const getRandomSymbol = () => {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const s of TUMBLER_SYMBOLS) {
      cumulative += s.weight;
      if (rand <= cumulative) return s;
    }
    return TUMBLER_SYMBOLS[TUMBLER_SYMBOLS.length - 1];
  };
  const handleCrackVault = () => {
    if (isCracking) return;
    if ((coins || 0) < CRACK_COST) {
      playCrash();
      showToast("You need at least 150 CP to bypass the vault firewall!", "error");
      return;
    }
    spendCoins(CRACK_COST);
    setJackpot((j) => j + 50);
    setIsCracking(true);
    setVaultBreached(false);
    setLastReward(null);
    setVaultDoorOpen(false);
    const isJackpotRoll = Math.random() < 0.025;
    let targetReels = [];
    if (isJackpotRoll) {
      const jackpotSymbol = TUMBLER_SYMBOLS[0];
      targetReels = [jackpotSymbol, jackpotSymbol, jackpotSymbol];
    } else {
      const sym1 = getRandomSymbol();
      const sym2 = getRandomSymbol();
      const sym3 = getRandomSymbol();
      targetReels = [sym1, sym2, sym3];
    }
    let ticks = 0;
    const totalTicks = 24;
    const spinInterval = setInterval(() => {
      ticks++;
      playTumblerTick();
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      if (ticks >= totalTicks) {
        clearInterval(spinInterval);
        setReels(targetReels);
        finishCrack(targetReels);
      }
    }, 80);
  };
  const finishCrack = (finalReels) => {
    setIsCracking(false);
    const [r1, r2, r3] = finalReels;
    const allMatch = r1.id === r2.id && r2.id === r3.id;
    const twoMatch = r1.id === r2.id || r2.id === r3.id || r1.id === r3.id;
    if (allMatch) {
      const jackpotPrize = jackpot;
      setVaultBreached(true);
      setVaultDoorOpen(true);
      setLastReward({
        title: "🚨 VAULT CRACKED: GRAND HEIST!",
        coins: jackpotPrize,
        sub: "ALL 3 CRYPTOGRAPHIC TUMBLERS MATCHED!"
      });
      addCoins(jackpotPrize);
      if (incrementStat) {
        incrementStat("vaultCracks", 1);
        incrementStat("gamesPlayedCount", 1);
      }
      if (updateStat && jackpotPrize > (stats?.vaultHighScore || 0)) {
        updateStat("vaultHighScore", jackpotPrize);
      }
      playAlarmSiren();
      playAirhorn();
      triggerConfetti();
      feedService.publish(
        "just CRACKED the Cyber Vault for " + jackpotPrize.toLocaleString() + " CP! 🚨💎👑",
        "win",
        userProfile?.name || "Player"
      );
      setTimeout(() => {
        setJackpot(BASELINE_JACKPOT);
        localStorage.setItem("cyber_vault_jackpot", BASELINE_JACKPOT.toString());
      }, 3e3);
    } else if (twoMatch) {
      const reward = 600;
      setLastReward({
        title: "⚡ PARTIAL FIREWALL BREACH",
        coins: reward,
        sub: "2 Tumblers matched! Recovered encrypted coin stash."
      });
      addCoins(reward);
      playWin();
      if (incrementStat) incrementStat("gamesPlayedCount", 1);
    } else {
      setLastReward({
        title: "🔒 ACCESS DENIED",
        coins: 0,
        sub: "Firewall re-encrypted. Try another frequency bypass!"
      });
      playCrash();
      if (incrementStat) incrementStat("gamesPlayedCount", 1);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "linear-gradient(135deg, rgba(10, 10, 25, 0.95), rgba(18, 12, 38, 0.98))",
    border: vaultBreached ? "3px solid #ffd700" : "2px solid rgba(0, 229, 255, 0.4)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: vaultBreached ? "0 0 50px rgba(255, 215, 0, 0.4)" : "0 0 35px rgba(0, 229, 255, 0.15)",
    position: "relative",
    overflow: "hidden",
    fontFamily: '"Orbitron", monospace',
    color: "white",
    maxWidth: "850px",
    margin: "0 auto 40px auto"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(0, 229, 255, 0.2)",
      paddingBottom: "16px",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#00ff66",
          boxShadow: "0 0 10px #00ff66",
          animation: "pulse 1.5s infinite"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.85rem", color: "#00e5ff", letterSpacing: "2px", fontWeight: "bold" }, children: "PROGRESSIVE COMMUNITY CASINO VAULT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "rgba(255, 215, 0, 0.12)",
        border: "1px solid #ffd700",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "0.8rem",
        color: "#ffd700",
        fontWeight: "bold"
      }, children: "GLOBAL RECOVERY SYSTEM" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "25px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "#a0a0c0", letterSpacing: "3px", marginBottom: "6px" }, children: "CURRENT UNCLAIMED ACCUMULATION" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        filter: "drop-shadow(0 0 25px rgba(255, 215, 0, 0.5))"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "36", height: "36", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: { filter: "drop-shadow(0 0 12px #ffd700)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v2m0 8v2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          fontSize: "clamp(2.4rem, 6vw, 4rem)",
          fontWeight: "900",
          background: "linear-gradient(135deg, #ffd700, #ff8800, #ff007f)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "2px"
        }, children: [
          jackpot.toLocaleString(),
          " CP"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "#00ffcc", marginTop: "4px" }, children: "▲ Pot grows with every arcade bet across Plinko, Slots, Derby & Wheel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(5, 5, 12, 0.85)",
      border: "2px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "18px",
      padding: "24px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "0.85rem",
        color: vaultDoorOpen ? "#00ff66" : "#ff0055"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.8rem",
        fontWeight: "900",
        letterSpacing: "1px",
        color: vaultDoorOpen ? "#00ff66" : "#ff0055"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: vaultDoorOpen ? "#00ff66" : "#ff0055",
          boxShadow: `0 0 10px ${vaultDoorOpen ? "#00ff66" : "#ff0055"}`,
          display: "inline-block"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: vaultDoorOpen ? "STATUS: COMPROMISED / UNLOCKED" : "STATUS: TITANIUM LOCKDOWN ACTIVE" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        width: "100%",
        maxWidth: "540px"
      }, children: reels.map((sym, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            background: "linear-gradient(180deg, #151528, #0a0a14)",
            border: "2px solid " + (sym.color || "#333"),
            borderRadius: "14px",
            padding: "18px 10px",
            textAlign: "center",
            boxShadow: "0 0 20px " + sym.color + "33",
            transform: isCracking ? "scale(0.98)" : "scale(1)",
            transition: "all 0.1s ease"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", marginBottom: "8px" }, children: sym.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: sym.color,
              letterSpacing: "1px"
            }, children: sym.label })
          ]
        },
        idx
      )) }),
      lastReward && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        width: "100%",
        maxWidth: "540px",
        background: lastReward.coins > 0 ? "rgba(0, 255, 102, 0.15)" : "rgba(255, 0, 85, 0.15)",
        border: lastReward.coins > 0 ? "1px solid #00ff66" : "1px solid #ff0055",
        borderRadius: "12px",
        padding: "12px 16px",
        textAlign: "center",
        animation: "fadeIn 0.3s ease"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontWeight: "bold",
          fontSize: "1rem",
          color: lastReward.coins > 0 ? "#00ff66" : "#ff0055",
          marginBottom: "4px"
        }, children: lastReward.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#ccc" }, children: lastReward.sub }),
        lastReward.coins > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.2rem", color: "#ffd700", fontWeight: "bold", marginTop: "6px" }, children: [
          "+",
          lastReward.coins.toLocaleString(),
          " CP CREDITED!"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: handleCrackVault,
          disabled: isCracking,
          style: {
            background: isCracking ? "#333" : "linear-gradient(135deg, #ffd700, #ff007f)",
            color: isCracking ? "#888" : "#000",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "14px 45px",
            borderRadius: "30px",
            cursor: isCracking ? "not-allowed" : "pointer",
            border: "none",
            boxShadow: isCracking ? "none" : "0 0 25px rgba(255, 215, 0, 0.4)",
            letterSpacing: "1px"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "inline-flex", alignItems: "center", gap: "10px" }, children: isCracking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: { animation: "spin 1s linear infinite" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "12" }) }),
            "DECRYPTING TUMBLERS..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" })
            ] }),
            "ATTEMPT VAULT CRACK (150 CP)"
          ] }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: "15px",
      marginTop: "20px",
      fontSize: "0.75rem",
      color: "#888"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "👑 3 Gold Keys = ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#ffd700" }, children: "100% ENTIRE VAULT JACKPOT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "⚡ Any 3 Matches = ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#00e5ff" }, children: "1,500 CP BONUS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "💾 Any 2 Matches = ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#00ff66" }, children: "600 CP RECOVERY" })
      ] })
    ] })
  ] });
};
const MOCK_WAGERS = [
  { id: "m1", player: "ShadowBroker", gameId: "slots", gameName: "Cosmic Slots", wager: 5e3, state: "open", targetScore: 1e3 },
  { id: "m2", player: "GlitchKing99", gameId: "face-runner", gameName: "Face Warp", wager: 2500, state: "open", targetScore: 150 },
  { id: "m3", player: "VoidEntity", gameId: "brick", gameName: "Neon Bricks", wager: 1e4, state: "open", targetScore: 4e3 },
  { id: "m4", player: "CyberJockey", gameId: "derby", gameName: "Cyber Derby", wager: 7500, state: "open", targetScore: 2500 },
  { id: "m5", player: "DonDino", gameId: "blackjack", gameName: "Cyber 21", wager: 15e3, state: "open", targetScore: 21 },
  { id: "m6", player: "FlipperWizard", gameId: "pinball", gameName: "Cyber Pinball", wager: 12500, state: "open", targetScore: 25e3 },
  { id: "m7", player: "MoonshotApe", gameId: "crash", gameName: "Cyber Crash", wager: 2e4, state: "open", targetScore: 10 },
  { id: "m8", player: "RouletteRoyale", gameId: "roulette", gameName: "Cyber Roulette", wager: 25e3, state: "open", targetScore: 36 },
  { id: "m9", player: "GridHustler", gameId: "mines", gameName: "Cyber Mines", wager: 3e4, state: "open", targetScore: 10 },
  { id: "m10", player: "LuckyScratcher", gameId: "scratchers", gameName: "Cyber Scratchers", wager: 5e4, state: "open", targetScore: 25e3 },
  { id: "m11", player: "DozerKing", gameId: "dozer", gameName: "Cyber Coin Dozer", wager: 35e3, state: "open", targetScore: 5e3 },
  { id: "m12", player: "StreakSamurai", gameId: "hilo", gameName: "Cyber Hi-Lo", wager: 4e4, state: "open", targetScore: 10 }
];
const GAMES_LIST = [
  { id: "hilo", name: "Cyber Hi-Lo 2088" },
  { id: "dozer", name: "Cyber Coin Dozer 2088" },
  { id: "scratchers", name: "Cyber Scratchers (Lottery)" },
  { id: "mines", name: "Cyber Mines 2088" },
  { id: "roulette", name: "Cyber Roulette 2088" },
  { id: "crash", name: "Cyber Crash: Moonshot" },
  { id: "pinball", name: "Cyber Pinball 2088" },
  { id: "blackjack", name: "Cyber 21: High-Roller Blackjack" },
  { id: "derby", name: "Cyber Derby: Bro Grand Prix" },
  { id: "drift", name: "Neon Drift: 2088" },
  { id: "plinko", name: "Cyber Plinko" },
  { id: "wheel", name: "Cyber Wheel" },
  { id: "unboxing", name: "HypeDrop Mystery Crates" },
  { id: "merch-defense", name: "Merch Defense TD" },
  { id: "bro-cannon", name: "Bro Cannon Launch" },
  { id: "fishing", name: "Crazy Fishing" },
  { id: "merch-jump", name: "Merch Jump" },
  { id: "slots", name: "Cosmic Slots" },
  { id: "face-runner", name: "Face Warp" },
  { id: "brick", name: "Neon Bricks" },
  { id: "flappy", name: "FlappyBro" },
  { id: "snake", name: "Neon Snake" }
];
const TheUnderworld = () => {
  const { coins, addCoins, userProfile, incrementStat } = useGamification();
  const { playBeep, playClick, playError, playWin } = useRetroSound();
  const navigate = useNavigate();
  const [wagers, setWagers] = reactExports.useState(MOCK_WAGERS);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selectedGame, setSelectedGame] = reactExports.useState("face-runner");
  const [wagerAmount, setWagerAmount] = reactExports.useState(1e3);
  const [targetScore, setTargetScore] = reactExports.useState(100);
  const channelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel("underworld_wagers").on("broadcast", { event: "new_wager" }, (payload) => {
      setWagers((prev) => [payload.payload, ...prev]);
      playClick();
    }).on("broadcast", { event: "wager_accepted" }, (payload) => {
      setWagers((prev) => prev.filter((w) => w.id !== payload.payload.id));
    }).subscribe();
    channelRef.current = channel;
    return () => supabase.removeChannel(channel);
  }, []);
  const handleCreateWager = () => {
    if (coins < wagerAmount) {
      playError();
      alert("You don't have enough coins to wager that much!");
      return;
    }
    addCoins(-wagerAmount);
    playBeep();
    const newWager = {
      id: `w_${Date.now()}`,
      player: userProfile?.name || "Anonymous",
      gameId: selectedGame,
      gameName: GAMES_LIST.find((g) => g.id === selectedGame)?.name || "Unknown",
      wager: parseInt(wagerAmount),
      targetScore: parseInt(targetScore),
      state: "open"
    };
    setWagers((prev) => [newWager, ...prev]);
    setShowCreate(false);
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "new_wager",
        payload: newWager
      });
    }
  };
  const handleAcceptWager = (wager) => {
    if (coins < wager.wager) {
      playError();
      alert("You don't have enough coins to match this wager!");
      return;
    }
    const confirmMsg = `Match ${wager.wager} coins to beat ${wager.targetScore} in ${wager.gameName}?`;
    if (window.confirm(confirmMsg)) {
      addCoins(-wager.wager);
      incrementStat("underworldWagersMatched", 1);
      playWin();
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "wager_accepted",
          payload: { id: wager.id }
        });
      }
      setWagers((prev) => prev.filter((w) => w.id !== wager.id));
      alert(`Wager Accepted! Good luck. Redirecting to ${wager.gameName}...`);
      navigate(`/arcade/${wager.gameId}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #220000 0%, #000000 100%)",
    color: "#ff0055",
    fontFamily: '"Orbitron", sans-serif',
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "linear-gradient(#ff005511 1px, transparent 1px), linear-gradient(90deg, #ff005511 1px, transparent 1px)",
      backgroundSize: "30px 30px",
      zIndex: 0,
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #ff0055", paddingBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3rem", margin: "0 0 10px 0", color: "#ff0055", textShadow: "0 0 20px #ff0055, 0 0 40px #ff0000" }, children: "THE UNDERWORLD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "1.2rem", margin: 0, letterSpacing: "2px" }, children: "ILLEGAL WAGERS & SHADOW DUELS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CyberVault, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right", marginBottom: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowCreate(!showCreate),
          style: {
            background: showCreate ? "transparent" : "#ff0055",
            color: showCreate ? "#ff0055" : "#000",
            border: "1px solid #ff0055",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "5px",
            boxShadow: showCreate ? "none" : "0 0 15px #ff0055"
          },
          children: showCreate ? "CANCEL WAGER" : "+ NEW WAGER"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          style: { overflow: "hidden", marginBottom: "30px" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#110000", border: "1px solid #ff0055", padding: "20px", borderRadius: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 20px 0", color: "#fff" }, children: "POST A NEW DUEL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "GAME" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: selectedGame,
                    onChange: (e) => setSelectedGame(e.target.value),
                    style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none" },
                    children: GAMES_LIST.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g.id, children: g.name }, g.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "TARGET SCORE TO BEAT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: targetScore,
                    onChange: (e) => setTargetScore(e.target.value),
                    style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none" }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "YOUR WAGER (COINS)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: wagerAmount,
                  onChange: (e) => setWagerAmount(e.target.value),
                  style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none", fontSize: "1.2rem", fontWeight: "bold" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleCreateWager,
                style: {
                  width: "100%",
                  background: "#ff0055",
                  color: "#000",
                  padding: "15px",
                  border: "none",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 20px #ff0055"
                },
                children: [
                  "CONFIRM WAGER & DEDUCT ",
                  wagerAmount,
                  " CP"
                ]
              }
            )
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#fff", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }, children: "OPEN WAGERS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
        wagers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#666", textAlign: "center", padding: "40px" }, children: "No open wagers. The shadows are quiet." }),
        wagers.map((wager) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, scale: 0.9 },
            style: {
              background: "rgba(20, 0, 0, 0.8)",
              border: "1px solid #550011",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#ff0055", marginBottom: "5px" }, children: [
                  wager.player,
                  " CHALLENGES YOU"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: "0 0 5px 0", fontSize: "1.5rem", color: "#fff" }, children: wager.gameName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: "0.9rem" }, children: [
                  "Target Score: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fff" }, children: wager.targetScore })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.8rem", color: "var(--neon-gold)", fontWeight: "900", textShadow: "0 0 10px rgba(255, 215, 0, 0.5)", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    wager.wager.toLocaleString(),
                    " CP"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v12M8 10h8" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleAcceptWager(wager),
                    style: {
                      background: "transparent",
                      color: "#00ffcc",
                      border: "1px solid #00ffcc",
                      padding: "8px 20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      boxShadow: "0 0 10px rgba(0, 255, 204, 0.2)"
                    },
                    children: "MATCH & PLAY"
                  }
                )
              ] })
            ]
          },
          wager.id
        ))
      ] }) })
    ] })
  ] });
};
export {
  TheUnderworld as default
};
