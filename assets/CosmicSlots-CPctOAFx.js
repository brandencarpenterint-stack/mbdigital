import { b as useGamification, c as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-6H0vzCe-.js";
import { feedService } from "./feed-D8ANQY2d.js";
const SYMBOLS = [
  { id: "wild", char: "⭐", value: 0, weight: 1 },
  // Wildcard (Value determined by match)
  { id: "cat", img: "/assets/merchboy_cat.png", value: 25, weight: 3 },
  { id: "bunny", img: "/assets/merchboy_bunny.png", value: 25, weight: 3 },
  { id: "face", img: "/assets/merchboy_face.png", value: 10, weight: 4 },
  { id: "money", img: "/assets/merchboy_money.png", value: 50, weight: 1 },
  { id: "seven", char: "7️⃣", value: 100, weight: 1 },
  { id: "cherry", char: "🍒", value: 5, weight: 5 },
  { id: "grape", char: "🍇", value: 5, weight: 5 }
];
const getRandomSymbol = () => {
  const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (let s of SYMBOLS) {
    if (random < s.weight) return s;
    random -= s.weight;
  }
  return SYMBOLS[0];
};
const ROWS = 3;
const COLS = 3;
const SPIN_COST = 15;
const CosmicSlots = () => {
  const { coins, spendCoins, addCoins, updateStat, userProfile } = useGamification() || { coins: 0, spendCoins: () => false, addCoins: () => {
  } };
  const { playJump, playCollect, playWin } = useRetroSound();
  const [grid, setGrid] = reactExports.useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
  ]);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [winAmount, setWinAmount] = reactExports.useState(0);
  const [winningLines, setWinningLines] = reactExports.useState([]);
  const [streak, setStreak] = reactExports.useState(1);
  const spinIntervals = reactExports.useRef([]);
  reactExports.useEffect(() => {
    return () => spinIntervals.current.forEach(clearInterval);
  }, []);
  const handleSpinClick = () => {
    if (isSpinning) return;
    if (!spendCoins(SPIN_COST)) return;
    setIsSpinning(true);
    setWinAmount(0);
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
      }, 50 + col * 20);
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
      }, 800 + col * 400);
    });
  };
  const calculateWin = (finalGrid) => {
    setIsSpinning(false);
    let basePrize = 0;
    let lines = [];
    const checkLine = (s1, s2, s3, lineId) => {
      const nonWilds = [s1, s2, s3].filter((s) => s.id !== "wild");
      if (nonWilds.length === 0) {
        basePrize += 500;
        lines.push(lineId);
        return;
      }
      const targetId = nonWilds[0].id;
      const isMatch = nonWilds.every((s) => s.id === targetId);
      if (isMatch) {
        basePrize += nonWilds[0].value * 3;
        lines.push(lineId);
      }
    };
    for (let r = 0; r < ROWS; r++) checkLine(finalGrid[r][0], finalGrid[r][1], finalGrid[r][2], `row-${r}`);
    for (let c = 0; c < COLS; c++) checkLine(finalGrid[0][c], finalGrid[1][c], finalGrid[2][c], `col-${c}`);
    checkLine(finalGrid[0][0], finalGrid[1][1], finalGrid[2][2], "diag-1");
    checkLine(finalGrid[2][0], finalGrid[1][1], finalGrid[0][2], "diag-2");
    if (basePrize > 0) {
      const totalWin = basePrize * streak;
      setWinAmount(totalWin);
      setWinningLines(lines);
      addCoins(totalWin);
      playWin();
      if (updateStat) updateStat("slotsBiggestWin", totalWin);
      if (totalWin >= 500) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`hit a JACKPOT of ${totalWin} Coins! 🎰`, "win", playerName);
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
    background: "radial-gradient(circle, #220033 0%, #000 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Press Start 2P", display', color: "#ffd700", fontSize: "2.5rem", textShadow: "0 0 20px #ff00ff", margin: 0 }, children: "COSMIC SLOTS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", marginTop: "10px" }, children: "SPIN 15 🪙 FOR 8-LINE ACTION!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(0,0,0,0.5)",
        border: "2px solid #555",
        borderRadius: "10px",
        padding: "20px",
        minWidth: "200px",
        fontFamily: "monospace"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#ffd700", borderBottom: "1px solid #555", paddingBottom: "10px" }, children: "PAYOUTS (3x)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: { listStyle: "none", padding: 0 }, children: SYMBOLS.sort((a, b) => b.value - a.value).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { style: { display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #333" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "5px" }, children: [
            s.img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.img, style: { width: "20px" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.char }),
            s.img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.img, style: { width: "20px" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.char }),
            s.img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.img, style: { width: "20px" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.char })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "gold" }, children: s.value * 3 })
        ] }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "#333",
          padding: "10px 30px",
          borderRadius: "50px",
          border: "2px solid gold",
          fontSize: "1.5rem",
          boxShadow: "0 0 15px gold"
        }, children: [
          "🪙 ",
          coins
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "#444",
          padding: "20px",
          borderRadius: "20px",
          border: "8px solid #cc00ff",
          boxShadow: "0 0 50px #cc00ff40",
          position: "relative"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 100px)",
            gap: "10px",
            background: "#000",
            padding: "10px",
            borderRadius: "10px",
            border: "4px solid #222"
          }, children: grid.flat().map((symbol, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            let isWinner = false;
            if (winningLines.includes(`row-${row}`)) isWinner = true;
            if (winningLines.includes(`col-${col}`)) isWinner = true;
            if (winningLines.includes("diag-1") && (row === 0 && col === 0 || row === 1 && col === 1 || row === 2 && col === 2)) isWinner = true;
            if (winningLines.includes("diag-2") && (row === 2 && col === 0 || row === 1 && col === 1 || row === 0 && col === 2)) isWinner = true;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              height: "100px",
              background: isWinner ? "#ffffcc" : "#fff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              border: isWinner ? "4px solid gold" : "2px solid #ccc",
              transition: "background 0.3s"
            }, children: symbol.img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: symbol.img, style: { width: "80%", height: "80%", objectFit: "contain" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: symbol.char }) }, i);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -15, left: 20, width: "20px", height: "20px", background: "red", borderRadius: "50%", boxShadow: "0 0 10px red" }, className: "blink" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -15, right: 20, width: "20px", height: "20px", background: "red", borderRadius: "50%", boxShadow: "0 0 10px red" }, className: "blink" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleSpinClick,
            disabled: isSpinning,
            style: {
              padding: "20px 80px",
              fontSize: "2rem",
              background: isSpinning ? "#555" : "linear-gradient(to bottom, #ff0055, #cc0000)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              boxShadow: isSpinning ? "none" : "0 10px 0 #660000",
              opacity: isSpinning ? 0.7 : 1,
              transform: isSpinning ? "translateY(10px)" : "none"
            },
            children: isSpinning ? "..." : "SPIN"
          }
        ),
        streak > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "10px",
          right: "-80px",
          background: "#ff4500",
          color: "white",
          padding: "10px 15px",
          borderRadius: "10px",
          fontWeight: "900",
          fontSize: "1.5rem",
          transform: "rotate(10deg)",
          boxShadow: "0 0 15px #ff4500",
          animation: "pulse 1s infinite"
        }, children: [
          "x",
          streak,
          " 🔥"
        ] }),
        winAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2rem", color: "#00ffaa", fontWeight: "bold", textShadow: "0 0 20px #00ffaa" }, children: [
          "WIN: ",
          winAmount,
          " 🪙"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
                @keyframes pulse { 0% { transform: rotate(10deg) scale(1); } 50% { transform: rotate(10deg) scale(1.1); } 100% { transform: rotate(10deg) scale(1); } }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { marginTop: "40px", color: "#666" }, children: "Back to Arcade" })
  ] });
};
export {
  CosmicSlots as default
};
