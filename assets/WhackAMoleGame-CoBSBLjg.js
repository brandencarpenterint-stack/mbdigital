import { b as useGamification, r as reactExports, c as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, t as triggerConfetti } from "./index-CFpr8q3e.js";
import { feedService } from "./feed-9cDp0up7.js";
import { G as GameOverCard } from "./GameOverCard-4wYC_qyI.js";
const MOLE_COUNT = 16;
const GAME_DURATION = 30;
const WhackAMoleGame = () => {
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const [moles, setMoles] = reactExports.useState(new Array(MOLE_COUNT).fill(false));
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("whackHighScore")) || 0);
  const [timeLeft, setTimeLeft] = reactExports.useState(GAME_DURATION);
  reactExports.useEffect(() => {
    if (stats?.whackHighScore > highScore) {
      setHighScore(stats.whackHighScore);
    }
  }, [stats]);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const { playJump, playWin } = useRetroSound();
  const popTimerRef = reactExports.useRef(null);
  const gameTimerRef = reactExports.useRef(null);
  const [moleTypes, setMoleTypes] = reactExports.useState(new Array(MOLE_COUNT).fill("default"));
  const endGame = () => {
    clearInterval(gameTimerRef.current);
    clearTimeout(popTimerRef.current);
    setGameActive(false);
    setGameOver(true);
    setMoles(new Array(MOLE_COUNT).fill(false));
    playWin();
    if (updateStat) updateStat("gamesPlayed", "whack");
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("whackHighScore", score);
      triggerConfetti();
      if (score > 100) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`is a Whack-a-Mole Champion! Score: ${score} 🔨`, "win", playerName);
      }
    }
    if (addCoins) addCoins(Math.floor(score / 10));
  };
  const popMoles = () => {
    const popTime = Math.random() * 800 + 400;
    popTimerRef.current = setTimeout(() => {
      if (!gameActive && timeLeft <= 0) return;
      [...moles];
      const resetMoles = new Array(MOLE_COUNT).fill(false);
      const randomIdx = Math.floor(Math.random() * MOLE_COUNT);
      resetMoles[randomIdx] = true;
      setMoles(resetMoles);
      const types = ["default", "cat", "bunny", "money"];
      const newTypes = [...moleTypes];
      newTypes[randomIdx] = types[Math.floor(Math.random() * types.length)];
      setMoleTypes(newTypes);
      popMoles();
    }, popTime);
  };
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setGameOver(false);
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    popMoles();
  };
  const handleWhack = (index) => {
    if (!gameActive || !moles[index]) return;
    setScore((prev) => prev + 10);
    playJump();
    if (navigator.vibrate) navigator.vibrate(100);
    const newMoles = [...moles];
    newMoles[index] = false;
    setMoles(newMoles);
  };
  reactExports.useEffect(() => {
    return () => {
      clearInterval(gameTimerRef.current);
      clearTimeout(popTimerRef.current);
    };
  }, []);
  const IMAGES = {
    default: "/assets/merchboy_face.png",
    cat: "/assets/merchboy_cat.png",
    bunny: "/assets/merchboy_bunny.png",
    money: "/assets/merchboy_money.png"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "10px", color: "#ff0055", width: "100%", minHeight: "100vh", touchAction: "manipulation" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes spinMole {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes fullSpin {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Courier New", monospace', fontSize: "2.5rem", margin: "10px 0", textAlign: "center" }, children: "WHACK-A-MOLE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "TIME: ",
        timeLeft,
        "s"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: {
      padding: "15px 40px",
      fontSize: "1.5rem",
      backgroundColor: "#ff0055",
      color: "white",
      border: "none",
      borderRadius: "10px",
      boxShadow: "0 5px 0 #990033",
      marginBottom: "20px"
    }, children: "START GAME" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
      padding: "10px",
      width: "100%",
      maxWidth: "600px",
      aspectRatio: "1/1",
      // Keep square aspect ratio for the whole board
      backgroundColor: "#2a2a40",
      borderRadius: "20px",
      border: "4px solid #ff0055",
      boxShadow: "0 0 20px #ff005540"
    }, children: moles.map((isUp, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onMouseDown: () => handleWhack(index),
        onTouchStart: (e) => {
          e.preventDefault();
          handleWhack(index);
        },
        style: {
          width: "100%",
          height: "100%",
          backgroundColor: "#151525",
          // Darker cell background (Ground)
          borderRadius: "15px",
          // Rounded square
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          // Clip the mole when down
          border: "2px solid #333",
          touchAction: "none",
          boxShadow: "inset 0 0 10px #000"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: "80%",
            height: "25%",
            backgroundColor: "#000",
            borderRadius: "50%",
            opacity: 0.6
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            bottom: isUp ? "15%" : "-100%",
            // Pop up position
            left: "0",
            width: "100%",
            // Full width of cell to maximize size
            height: "90%",
            backgroundImage: `url(${IMAGES[moleTypes[index]] || IMAGES.default})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom center",
            transition: "bottom 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            animation: isUp ? "fullSpin 2s linear infinite" : "none",
            zIndex: 10
          } })
        ]
      },
      index
    )) }),
    gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GameOverCard,
      {
        score,
        bestScore: highScore,
        gameId: "whack",
        onReplay: startGame,
        onHome: () => window.location.href = "/arcade"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/brokid-logo.png", alt: "Brokid", style: { width: "100px", opacity: 0.6 } }) })
  ] });
};
export {
  WhackAMoleGame as default
};
