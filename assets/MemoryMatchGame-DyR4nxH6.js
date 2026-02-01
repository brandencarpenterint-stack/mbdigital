import { b as useGamification, r as reactExports, c as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-BW7aM1MD.js";
import { feedService } from "./feed-DYJppU3f.js";
const CARDS = [
  { id: 1, type: "image", content: "/assets/boy-logo.png", alt: "Boy" },
  { id: 2, type: "image", content: "/assets/brokid-logo.png", alt: "Brokid" },
  { id: 3, type: "image", content: "/assets/boy_face.png", alt: "Merchboy" },
  { id: 4, type: "image", content: "/assets/merchboy_cat.png", alt: "Cat Hat" },
  { id: 5, type: "image", content: "/assets/merchboy_bunny.png", alt: "Bunny Hat" },
  { id: 6, type: "image", content: "/assets/merchboy_money.png", alt: "Money Face" },
  { id: 7, type: "emoji", content: "⭐️" },
  { id: 8, type: "emoji", content: "🍔" }
];
const MemoryMatchGame = () => {
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const [cards, setCards] = reactExports.useState([]);
  const [flipped, setFlipped] = reactExports.useState([]);
  const [solved, setSolved] = reactExports.useState([]);
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
  const initializeGame = () => {
    const duplicatedCards = [...CARDS, ...CARDS];
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5).map((card, index) => ({ ...card, uid: index }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setScore(0);
    setMoves(0);
    setDisabled(false);
  };
  reactExports.useEffect(() => {
    initializeGame();
  }, []);
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
      if (solved.length + 1 === CARDS.length) {
        playWin();
        triggerConfetti();
        const finalScore = score + 100 + Math.max(0, 50 - moves) * 10;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          if (updateStat) updateStat("memoryHighScore", finalScore);
          const playerName = userProfile?.name || "Mind Master";
          feedService.publish(`solved the Memory Matrix with ${finalScore} points! 🧠`, "win", playerName);
        }
        if (updateStat) updateStat("gamesPlayed", "memory_match");
        if (addCoins) addCoins(50);
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
      gridTemplateColumns: "repeat(4, 1fr)",
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
            width: "100px",
            height: "100px",
            perspective: "1000px",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: "100%",
            height: "100%",
            position: "relative",
            transition: "transform 0.6s",
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
    solved.length === CARDS.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "#ffff00", margin: "0 0 20px 0" }, children: "YOU WIN!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", marginBottom: "30px", color: "white" }, children: "Great Job!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initializeGame, style: {
        padding: "10px 20px",
        fontSize: "1.2rem",
        backgroundColor: "#ffff00",
        color: "black",
        border: "none",
        borderRadius: "5px",
        marginRight: "15px",
        fontWeight: "bold"
      }, children: "PLAY AGAIN" }),
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
