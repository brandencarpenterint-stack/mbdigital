import { u as useGamification, r as reactExports, a as useRetroSound, j as jsxRuntimeExports, L as Link, t as triggerConfetti } from "./index-_52vK3nY.js";
import { S as SquishyButton } from "./SquishyButton-Rd_AQ6Od.js";
const CARD_POOL = [
  { id: 1, type: "image", content: "/assets/brokid-logo.png", alt: "Brokid" },
  { id: 2, type: "image", content: "/assets/merchboy_cat.png", alt: "Cat Hat" },
  { id: 3, type: "image", content: "/assets/merchboy_bunny.png", alt: "Bunny Hat" },
  { id: 4, type: "image", content: "/assets/skins/face_default.png", alt: "OG" },
  { id: 5, type: "image", content: "/assets/skins/jump_guy.png", alt: "Jumper" },
  { id: 6, type: "image", content: "/assets/skins/face_bear.png", alt: "Bear" },
  { id: 7, type: "image", content: "/assets/skins/face_dino.png", alt: "Dino" },
  { id: 8, type: "image", content: "/assets/skins/face_star.png", alt: "Star" },
  { id: 9, type: "image", content: "/assets/skins/face_space.png", alt: "Space" },
  { id: 10, type: "emoji", content: "🍔" },
  { id: 11, type: "emoji", content: "⭐" },
  { id: 12, type: "emoji", content: "🚀" },
  { id: 13, type: "emoji", content: "👾" },
  { id: 14, type: "emoji", content: "💰" },
  { id: 15, type: "emoji", content: "🔥" },
  { id: 16, type: "emoji", content: "💎" },
  { id: 17, type: "emoji", content: "🍄" },
  { id: 18, type: "emoji", content: "👑" },
  { id: 19, type: "image", content: "/assets/skins/face_pumpkin.png", alt: "Pumpkin" },
  { id: 20, type: "image", content: "/assets/skins/face_gamer.png", alt: "Gamer" },
  { id: 21, type: "image", content: "/assets/skins/face_frog.png", alt: "Frog" },
  { id: 22, type: "image", content: "/assets/skins/face_astro.png", alt: "Astro" },
  { id: 23, type: "image", content: "/assets/skins/face_rainbow.png", alt: "Rainbow" }
];
const MemoryMatchGame = () => {
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const [cards, setCards] = reactExports.useState([]);
  const [flipped, setFlipped] = reactExports.useState([]);
  const [solved, setSolved] = reactExports.useState([]);
  const [round, setRound] = reactExports.useState(1);
  const [gameState, setGameState] = reactExports.useState("PLAYING");
  const [disabled, setDisabled] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [moves, setMoves] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("memoryHighScore")) || 0);
  reactExports.useEffect(() => {
    if (stats?.memoryHighScore > highScore) {
      setHighScore(stats.memoryHighScore);
    }
  }, [stats]);
  const { playBeep, playCollect, playWin } = useRetroSound();
  const initializeGame = (resetScore = false) => {
    let pairsCount = 6 + round * 2;
    if (pairsCount > CARD_POOL.length) pairsCount = CARD_POOL.length;
    const shuffledPool = [...CARD_POOL].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledPool.slice(0, pairsCount);
    const duplicatedCards = [...selectedCards, ...selectedCards];
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5).map((card, index) => ({ ...card, uid: index }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    if (resetScore) {
      setScore(0);
      setMoves(0);
      setRound(1);
    }
    setGameState("PLAYING");
    setDisabled(false);
  };
  reactExports.useEffect(() => {
    if (round > 1) {
      initializeGame(false);
    } else {
      initializeGame(true);
    }
  }, [round]);
  const checkForMatch = ([firstId, secondId]) => {
    const firstCard = cards.find((c) => c.uid === firstId);
    const secondCard = cards.find((c) => c.uid === secondId);
    if (firstCard.id === secondCard.id) {
      setSolved((prev) => [...prev, firstCard.id]);
      setFlipped([]);
      setDisabled(false);
      setScore((prev) => prev + 100);
      playCollect();
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
      if (solved.length + 1 === cards.length / 2) {
        playWin();
        triggerConfetti();
        const finalScore = score + 100 + Math.max(0, 50 - moves) * 10;
        setScore(finalScore);
        if (finalScore > highScore) {
          setHighScore(finalScore);
          if (updateStat) updateStat("memoryHighScore", finalScore);
        }
        if (updateStat) updateStat("gamesPlayed", "memory_match");
        if (addCoins) addCoins(50);
        setTimeout(() => setGameState("ROUND_OVER"), 1e3);
      }
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1e3);
    }
  };
  const handleClick = (id) => {
    if (disabled) return;
    if (flipped.includes(id) || solved.includes(cards.find((c) => c.uid === id).id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    playBeep();
    if (navigator.vibrate) navigator.vibrate(5);
    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((prev) => prev + 1);
      checkForMatch(newFlipped);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", color: "#ffff00" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Courier New", monospace', fontSize: "3rem", margin: "10px 0" }, children: "MEMORY MATCH" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "500px", marginBottom: "20px", fontSize: "1.5rem", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "MOVES: ",
        moves
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cards.length >= 24 ? 6 : cards.length === 20 ? 5 : 4}, 1fr)`,
      gap: "15px",
      padding: "20px",
      backgroundColor: "#1a1a2e",
      borderRadius: "15px",
      border: "4px solid #ffff00"
    }, children: cards.map((card) => {
      const isFlipped = flipped.includes(card.uid) || solved.includes(card.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: () => handleClick(card.uid),
          style: {
            width: cards.length >= 24 ? "80px" : "100px",
            height: cards.length >= 24 ? "80px" : "100px",
            perspective: "1000px",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: "100%",
            height: "100%",
            position: "relative",
            transition: "transform 0.8s",
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#333",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #555"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "2rem", color: "#777" }, children: "?" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#fff",
              borderRadius: "10px",
              transform: "rotateY(180deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ffff00"
            }, children: card.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: card.content, alt: card.alt, style: { width: "80%", height: "80%", objectFit: "contain" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "3rem" }, children: card.content }) })
          ] })
        },
        card.uid
      );
    }) }),
    gameState === "ROUND_OVER" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: "40px",
      borderRadius: "20px",
      border: "4px solid #ffff00",
      textAlign: "center",
      zIndex: 100
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "#ffff00", margin: "0 0 20px 0" }, children: "ROUND CLEARED!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", marginBottom: "30px", color: "white" }, children: "Great Job!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setRound((r) => r + 1), style: {
        padding: "10px 20px",
        fontSize: "1.2rem",
        backgroundColor: "#ffff00",
        color: "black",
        border: "none",
        borderRadius: "5px",
        marginRight: "15px",
        fontWeight: "bold"
      }, children: "NEXT ROUND" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: {
        padding: "10px 20px",
        fontSize: "1.2rem",
        backgroundColor: "#333",
        color: "white",
        textDecoration: "none",
        borderRadius: "5px"
      }, children: "EXIT" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/brokid-logo.png", alt: "Brokid", style: { width: "150px", opacity: 0.6 } }) })
  ] });
};
export {
  MemoryMatchGame as default
};
