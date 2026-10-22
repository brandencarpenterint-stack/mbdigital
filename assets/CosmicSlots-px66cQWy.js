import { a as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, f as feedService, t as triggerConfetti } from "./index-DuJS5nsO.js";
const SYMBOLS = [
  {
    id: "seven",
    name: "NEON 777",
    value: 500,
    // Jackpot!
    weight: 1,
    color: "#ffd700",
    badge: "JACKPOT",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gold7", x1: "0", y1: "0", x2: "1", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#fff3a1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#ffd700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ff8800" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: "glow7", x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "0", stdDeviation: "3", floodColor: "#ffd700", floodOpacity: "0.8" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: "50%",
          y: "36",
          textAnchor: "middle",
          fill: "url(#gold7)",
          filter: "url(#glow7)",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: "900",
          fontSize: "32",
          letterSpacing: "-2",
          children: "777"
        }
      )
    ] })
  },
  {
    id: "diamond",
    name: "CYBER GEM",
    value: 150,
    weight: 2,
    color: "#00e5ff",
    badge: "ULTRA",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gemGrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#e0ffff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#00e5ff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0066cc" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12,14 36,14 44,24 24,42 4,24", fill: "url(#gemGrad)", stroke: "#00e5ff", strokeWidth: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12,14 24,24 36,14", fill: "#ffffff", fillOpacity: "0.4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "24,24 24,42 4,24", fill: "#003366", fillOpacity: "0.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "24,24 24,42 44,24", fill: "#ffffff", fillOpacity: "0.2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4", y1: "24", x2: "44", y2: "24", stroke: "#ffffff", strokeWidth: "1.5", strokeOpacity: "0.7" })
    ] })
  },
  {
    id: "bar",
    name: "GOLD BAR",
    value: 75,
    weight: 3,
    color: "#ffb300",
    badge: "HIGH",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "barGrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#fff8e1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "40%", stopColor: "#ffb300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#e65100" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "14", width: "36", height: "20", rx: "4", fill: "url(#barGrad)", stroke: "#ffd700", strokeWidth: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "17", width: "30", height: "4", rx: "2", fill: "#ffffff", fillOpacity: "0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: "50%",
          y: "29",
          textAnchor: "middle",
          fill: "#2b1400",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: "900",
          fontSize: "13",
          letterSpacing: "1",
          children: "BAR"
        }
      )
    ] })
  },
  {
    id: "bell",
    name: "NEON BELL",
    value: 40,
    weight: 4,
    color: "#ff007f",
    badge: "MED",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M24 6 C20 6 18 10 18 14 L16 28 C14 30 12 31 12 34 L36 34 C36 31 34 30 32 28 L30 14 C30 10 28 6 24 6 Z",
          fill: "rgba(255, 0, 127, 0.25)",
          stroke: "#ff007f",
          strokeWidth: "2.5"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "34", rx: "12", ry: "3", fill: "#ff007f", fillOpacity: "0.5", stroke: "#ff007f", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "38", r: "3.5", fill: "#ffd700", stroke: "#ff007f", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "6", r: "3", fill: "#ff007f" })
    ] })
  },
  {
    id: "horseshoe",
    name: "QUANTUM SHOE",
    value: 25,
    weight: 5,
    color: "#00ff66",
    badge: "LUCKY",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M12 10 V24 C12 33 17 38 24 38 C31 38 36 33 36 24 V10 H29 V23 C29 26 27 28 24 28 C21 28 19 26 19 23 V10 Z",
          fill: "rgba(0, 255, 102, 0.2)",
          stroke: "#00ff66",
          strokeWidth: "2.5",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15.5", cy: "18", r: "2", fill: "#00ff66" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15.5", cy: "26", r: "2", fill: "#00ff66" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32.5", cy: "18", r: "2", fill: "#00ff66" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32.5", cy: "26", r: "2", fill: "#00ff66" })
    ] })
  },
  {
    id: "cherries",
    name: "NEON CHERRIES",
    value: 15,
    weight: 7,
    color: "#ff3366",
    badge: "SWEET",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 32 C12 20 22 10 32 8", stroke: "#00ff66", strokeWidth: "2.5", strokeLinecap: "round" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M30 32 C26 20 28 12 32 8", stroke: "#00ff66", strokeWidth: "2.5", strokeLinecap: "round" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "32", r: "8", fill: "rgba(255, 51, 102, 0.3)", stroke: "#ff3366", strokeWidth: "2.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "30", r: "2.5", fill: "#ffffff", fillOpacity: "0.7" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "32", r: "8", fill: "rgba(255, 51, 102, 0.3)", stroke: "#ff3366", strokeWidth: "2.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "30", cy: "30", r: "2.5", fill: "#ffffff", fillOpacity: "0.7" })
    ] })
  },
  {
    id: "star",
    name: "CYBER STAR",
    value: 8,
    weight: 9,
    color: "#c084fc",
    badge: "NOVA",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polygon",
        {
          points: "24,4 29,17 43,19 33,29 36,43 24,36 12,43 15,29 5,19 19,17",
          fill: "rgba(192, 132, 252, 0.25)",
          stroke: "#c084fc",
          strokeWidth: "2.5",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "24", r: "5", fill: "#ffffff", fillOpacity: "0.8" })
    ] })
  },
  {
    id: "chip",
    name: "CYBER CHIP",
    value: 3,
    weight: 12,
    color: "#38bdf8",
    badge: "BASE",
    render: (size = 40) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "24", r: "18", fill: "rgba(56, 189, 248, 0.15)", stroke: "#38bdf8", strokeWidth: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "24", r: "13", stroke: "#38bdf8", strokeWidth: "1.5", strokeDasharray: "3 3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "24,15 31,19 31,29 24,33 17,29 17,19", fill: "rgba(56, 189, 248, 0.3)", stroke: "#38bdf8", strokeWidth: "1.5" })
    ] })
  }
];
const getRandomSymbol = () => {
  const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const s of SYMBOLS) {
    if (random < s.weight) return s;
    random -= s.weight;
  }
  return SYMBOLS[0];
};
const ROWS = 3;
const COLS = 3;
const BET_TIERS = [
  { label: "15 CP", multiplier: 1, cost: 15 },
  { label: "45 CP", multiplier: 3, cost: 45 },
  { label: "75 CP", multiplier: 5, cost: 75 }
];
const CosmicSlots = () => {
  const { coins, spendCoins, addCoins, updateStat, incrementStat, userProfile } = useGamification() || {
    coins: 0,
    spendCoins: () => false,
    addCoins: () => {
    }
  };
  const { playJump, playCollect, playWin, playAirhorn } = useRetroSound();
  const [selectedBetIndex, setSelectedBetIndex] = reactExports.useState(0);
  const currentBet = BET_TIERS[selectedBetIndex];
  const [grid, setGrid] = reactExports.useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
  ]);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [isJackpot, setIsJackpot] = reactExports.useState(false);
  const [winAmount, setWinAmount] = reactExports.useState(0);
  const [winningLines, setWinningLines] = reactExports.useState([]);
  const [streak, setStreak] = reactExports.useState(1);
  const spinIntervals = reactExports.useRef([]);
  reactExports.useEffect(() => {
    return () => spinIntervals.current.forEach(clearInterval);
  }, []);
  const handleSpinClick = () => {
    if (isSpinning) return;
    if (!spendCoins(currentBet.cost)) return;
    if (incrementStat) incrementStat("slotsSpins", 1);
    setIsSpinning(true);
    setWinAmount(0);
    setIsJackpot(false);
    setWinningLines([]);
    playJump();
    const finalGrid = Array(3).fill(null).map(
      () => Array(3).fill(null).map(() => getRandomSymbol())
    );
    [0, 1, 2].forEach((col) => {
      spinIntervals.current[col] = setInterval(() => {
        setGrid((prev) => {
          const newGrid = [...prev.map((row) => [...row])];
          for (let row = 0; row < ROWS; row++) {
            newGrid[row][col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          }
          return newGrid;
        });
      }, 55 + col * 15);
    });
    [0, 1, 2].forEach((col) => {
      setTimeout(() => {
        clearInterval(spinIntervals.current[col]);
        setGrid((prev) => {
          const newGrid = [...prev.map((row) => [...row])];
          for (let row = 0; row < ROWS; row++) {
            newGrid[row][col] = finalGrid[row][col];
          }
          return newGrid;
        });
        playCollect();
        if (col === 2) {
          calculateWin(finalGrid);
        }
      }, 750 + col * 350);
    });
  };
  const calculateWin = (finalGrid) => {
    setIsSpinning(false);
    let basePrize = 0;
    let lines = [];
    const checkLine = (s1, s2, s3, lineId) => {
      if (s1.id === s2.id && s2.id === s3.id) {
        basePrize += s1.value * 3;
        lines.push(lineId);
      }
    };
    for (let r = 0; r < ROWS; r++) checkLine(finalGrid[r][0], finalGrid[r][1], finalGrid[r][2], `row-${r}`);
    for (let c = 0; c < COLS; c++) checkLine(finalGrid[0][c], finalGrid[1][c], finalGrid[2][c], `col-${c}`);
    checkLine(finalGrid[0][0], finalGrid[1][1], finalGrid[2][2], "diag-1");
    checkLine(finalGrid[2][0], finalGrid[1][1], finalGrid[0][2], "diag-2");
    if (basePrize > 0) {
      const totalWin = Math.floor(basePrize * currentBet.multiplier * streak);
      setWinAmount(totalWin);
      setWinningLines(lines);
      addCoins(totalWin);
      playWin();
      if (updateStat) updateStat("slotsBiggestWin", totalWin);
      if (totalWin >= 1500) {
        setIsJackpot(true);
        playAirhorn();
      }
      if (totalWin >= 300) {
        const playerName = userProfile?.name || "CyberRoller";
        feedService.broadcast("arcade_win", {
          player: playerName,
          game: "Cosmic Slots",
          coinsWon: totalWin,
          avatar: userProfile?.avatar || "/assets/skins/face_default.png"
        });
      }
      setStreak((s) => Math.min(s + 1, 5));
      if (totalWin > 100 || lines.length > 1) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
        triggerConfetti();
      }
    } else {
      setStreak(1);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at top, #1a0826 0%, #080312 60%, #000000 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: '"Orbitron", -apple-system, BlinkMacSystemFont, sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      inset: 0,
      backgroundImage: "radial-gradient(circle at 50% 15%, rgba(255, 0, 127, 0.08) 0%, transparent 60%)",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "12px 20px",
      background: "rgba(15, 15, 28, 0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 0, 127, 0.3)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      position: "relative",
      zIndex: 10
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "14px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/arcade",
            style: {
              padding: "8px 14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            },
            children: "← ARCADE HUB"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.25rem", fontWeight: "900", letterSpacing: "2px", color: "#ff007f", textShadow: "0 0 15px rgba(255,0,127,0.5)" }, children: "COSMIC SLOTS 2088" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase" }, children: "NEON 3x3 MATRIX CASINO" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        background: "rgba(255, 215, 0, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.35)",
        borderRadius: "12px",
        color: "#ffd700",
        fontWeight: "800",
        fontSize: "0.95rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ffd700",
          boxShadow: "0 0 8px #ffd700"
        } }),
        (coins || 0).toLocaleString(),
        " CP"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "32px",
      alignItems: "flex-start",
      flexWrap: "wrap",
      justifyContent: "center",
      width: "100%",
      maxWidth: "960px",
      position: "relative",
      zIndex: 10
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(15, 15, 26, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 229, 255, 0.3)",
        borderRadius: "16px",
        padding: "16px 20px",
        minWidth: "240px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "10px",
          marginBottom: "12px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.85rem", fontWeight: "800", color: "#00e5ff", letterSpacing: "1.5px" }, children: "PAYOUTS (3x MATCH)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.65rem", background: "#00e5ff22", color: "#00e5ff", padding: "2px 6px", borderRadius: "4px" }, children: "BASE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: SYMBOLS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 6px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }, children: s.render(26) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", fontWeight: "700", color: "#cbd5e1" }, children: s.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: s.color, fontWeight: "800", fontSize: "0.85rem" }, children: [
                "+",
                (s.value * 3 * currentBet.multiplier).toLocaleString()
              ] })
            ]
          },
          s.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "linear-gradient(180deg, #1f0b2e 0%, #100519 100%)",
          padding: "24px",
          borderRadius: "24px",
          border: "3px solid #ff007f",
          boxShadow: "0 0 50px rgba(255, 0, 127, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)",
          position: "relative"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            padding: "0 8px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "6px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#ff007f", boxShadow: "0 0 8px #ff007f" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 8px #00e5ff" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#ffd700", boxShadow: "0 0 8px #ffd700" } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", fontWeight: "800", color: "#ffd700", letterSpacing: "2px" }, children: streak > 1 ? `HOT STREAK x${streak}` : "LUCKY 8 LINES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "6px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#ffd700", boxShadow: "0 0 8px #ffd700" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 8px #00e5ff" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#ff007f", boxShadow: "0 0 8px #ff007f" } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 110px)",
            gap: "12px",
            background: "#040208",
            padding: "14px",
            borderRadius: "16px",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.9)"
          }, children: grid.flat().map((symbol, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            let isWinner = false;
            if (winningLines.includes(`row-${row}`)) isWinner = true;
            if (winningLines.includes(`col-${col}`)) isWinner = true;
            if (winningLines.includes("diag-1") && (row === 0 && col === 0 || row === 1 && col === 1 || row === 2 && col === 2)) isWinner = true;
            if (winningLines.includes("diag-2") && (row === 2 && col === 0 || row === 1 && col === 1 || row === 0 && col === 2)) isWinner = true;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  height: "110px",
                  background: isWinner ? "radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(15, 15, 30, 0.9) 100%)" : "linear-gradient(180deg, rgba(25, 20, 35, 0.8) 0%, rgba(10, 8, 16, 0.95) 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isWinner ? "2px solid #ffd700" : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: isWinner ? "0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.3)" : "inset 0 2px 4px rgba(255, 255, 255, 0.05)",
                  transform: isWinner ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.25s ease"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: isSpinning ? "scale(0.92)" : "scale(1)",
                    transition: "transform 0.1s"
                  }, children: symbol.render ? symbol.render(56) : null }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    color: isWinner ? "#ffd700" : "#64748b",
                    marginTop: "4px",
                    letterSpacing: "1px"
                  }, children: symbol.name })
                ]
              },
              i
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "16px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px" }, children: "BET:" }),
            BET_TIERS.map((tier, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => !isSpinning && setSelectedBetIndex(idx),
                disabled: isSpinning,
                style: {
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: selectedBetIndex === idx ? "linear-gradient(135deg, #00e5ff, #0077b6)" : "rgba(255, 255, 255, 0.05)",
                  border: selectedBetIndex === idx ? "1px solid #00e5ff" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: selectedBetIndex === idx ? "#000" : "#cbd5e1",
                  fontWeight: "900",
                  fontSize: "0.8rem",
                  cursor: isSpinning ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease"
                },
                children: tier.label
              },
              tier.label
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSpinClick,
            disabled: isSpinning,
            style: {
              width: "100%",
              maxWidth: "380px",
              padding: "16px",
              fontSize: "1.4rem",
              fontWeight: "900",
              letterSpacing: "3px",
              borderRadius: "16px",
              background: isSpinning ? "linear-gradient(180deg, #475569, #334155)" : "linear-gradient(180deg, #ff007f 0%, #d50060 100%)",
              border: "none",
              color: "#ffffff",
              cursor: isSpinning ? "not-allowed" : "pointer",
              boxShadow: isSpinning ? "none" : "0 6px 0 #880040, 0 12px 30px rgba(255, 0, 127, 0.4)",
              transform: isSpinning ? "translateY(6px)" : "translateY(0)",
              transition: "all 0.12s cubic-bezier(0.4, 0, 0.2, 1)"
            },
            children: isSpinning ? "SPINNING REELS..." : `PULL LEVER (-${currentBet.cost} CP)`
          }
        ),
        winAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: "1.5rem",
          color: "#00ffaa",
          fontWeight: "900",
          textShadow: "0 0 20px #00ffaa",
          letterSpacing: "2px",
          animation: "pulse 1s infinite"
        }, children: [
          "WIN: +",
          winAmount.toLocaleString(),
          " CP!"
        ] })
      ] })
    ] }),
    isJackpot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(5, 5, 12, 0.95)",
      border: "4px solid #ffd700",
      padding: "40px 60px",
      borderRadius: "24px",
      boxShadow: "0 0 100px rgba(255, 215, 0, 0.6), inset 0 0 40px rgba(255, 215, 0, 0.3)",
      zIndex: 9999,
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3.5rem", color: "#ffd700", margin: 0, textShadow: "0 0 30px #ffd700", letterSpacing: "4px" }, children: "MEGA JACKPOT!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { fontSize: "2.5rem", color: "#00ffaa", margin: "16px 0", textShadow: "0 0 20px #00ffaa" }, children: [
        "+",
        winAmount.toLocaleString(),
        " CP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setIsJackpot(false),
          style: {
            marginTop: "12px",
            padding: "10px 24px",
            background: "#ffd700",
            color: "#000",
            fontWeight: "900",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            cursor: "pointer"
          },
          children: "CLAIM WINNINGS"
        }
      )
    ] })
  ] });
};
export {
  CosmicSlots as default
};
