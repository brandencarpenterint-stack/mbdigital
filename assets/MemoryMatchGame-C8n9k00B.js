import { a as useGamification, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, L as Link } from "./index-_TtGPJrl.js";
const MemoryMatchGame = () => {
  const { updateStat, addCoins, stats } = useGamification() || {};
  const { playCollect, playWin, playBeep } = useRetroSound();
  const [cards, setCards] = reactExports.useState([]);
  const [flipped, setFlipped] = reactExports.useState([]);
  const [solved, setSolved] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [moves, setMoves] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(0);
  const [gameState, setGameState] = reactExports.useState("START");
  const SHEET_SRC = "/assets/match_sheet.png";
  reactExports.useEffect(() => {
    if (stats?.memoryHighScore) setHighScore(stats.memoryHighScore);
  }, [stats]);
  const initGame = () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
    const selection = items.slice(0, 6);
    const deck = [...selection, ...selection];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck.map((id, index) => ({ id, uid: index })));
    setFlipped([]);
    setSolved([]);
    setScore(0);
    setMoves(0);
    setGameState("PLAYING");
  };
  const handleCardClick = (uid) => {
    if (gameState !== "PLAYING") return;
    if (flipped.includes(uid) || solved.includes(cards.find((c) => c.uid === uid).id)) return;
    if (flipped.length >= 2) return;
    playBeep();
    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const c1 = cards.find((c) => c.uid === newFlipped[0]);
      const c2 = cards.find((c) => c.uid === newFlipped[1]);
      if (c1.id === c2.id) {
        setTimeout(() => {
          playCollect();
          setSolved((s) => [...s, c1.id]);
          setFlipped([]);
          setScore((s) => s + 100);
          if (solved.length + 1 === 6) {
            winGame();
          }
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1e3);
      }
    }
  };
  const winGame = () => {
    playWin();
    setGameState("WON");
    const finalScore = score + 100 + Math.max(0, 100 - moves * 5);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (updateStat) updateStat("memoryHighScore", finalScore);
    }
    if (addCoins) addCoins(50);
  };
  const CardTile = ({ card, isFlipped, isSolved }) => {
    const showFace = isFlipped || isSolved;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => handleCardClick(card.uid), style: {
      width: "80px",
      height: "80px",
      margin: "5px",
      position: "relative",
      perspective: "1000px",
      cursor: "pointer"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      height: "100%",
      position: "absolute",
      transformStyle: "preserve-3d",
      transition: "transform 0.4s",
      transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        background: "#222",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #555"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "64px",
        height: "64px",
        backgroundImage: `url(${SHEET_SRC})`,
        backgroundPosition: "0 0",
        // 0,0
        backgroundSize: "400% 200%"
        // 4 cols, 2 rows approx (8 items) -> Sheet logic check
        // Sheet prompt: 8 items. Grid. usually 2x4 or 4x2.
        // Generated img likely 4 cols x 2 rows.
        // Id 0 (Back) -> 0,0
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        background: "#fff",
        borderRadius: "10px",
        transform: "rotateY(180deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid gold",
        boxShadow: isSolved ? "0 0 10px gold" : "none"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "64px",
        height: "64px",
        backgroundImage: `url(${SHEET_SRC})`,
        backgroundPosition: `${card.id % 4 * 100 / 3}% ${Math.floor(card.id / 4) * 100}%`,
        backgroundSize: "400% 200%"
      } }) })
    ] }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#222", color: "white" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Press Start 2P"', color: "cyan", textShadow: "4px 4px 0 magenta" }, children: "MERCH MATCH" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", fontSize: "1.2rem", margin: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "MOVES: ",
        moves
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      background: "#333",
      padding: "20px",
      borderRadius: "20px",
      border: "4px solid #555"
    }, children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardTile, { card: c, isFlipped: flipped.includes(c.uid), isSolved: solved.includes(c.id) }, c.uid)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", display: "flex", gap: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { background: "cyan", color: "black" }, children: gameState === "START" ? "START" : "RESTART" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { background: "#555" }, children: "EXIT" }) })
    ] }),
    gameState === "WON" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "gold", fontSize: "3rem" }, children: "MATCHED!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2rem" }, children: [
        "FINAL SCORE: ",
        score + 100 + Math.max(0, 100 - moves * 5)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { background: "gold", color: "black", marginTop: "20px" }, children: "PLAY AGAIN" })
    ] })
  ] });
};
export {
  MemoryMatchGame as default
};
