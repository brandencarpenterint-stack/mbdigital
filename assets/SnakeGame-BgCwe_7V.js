import { r as reactExports, a as useGamification, b as useRetroSound, j as jsxRuntimeExports, S as SquishyButton } from "./index-BzABmepQ.js";
import { G as GameOverCard } from "./GameOverCard-BO2FQG-y.js";
const INITIAL_SPEED = 150;
const SnakeGame = () => {
  const canvasRef = reactExports.useRef(null);
  const { shopState, addCoins, updateStat, userProfile, stats, consumeItem } = useGamification() || {};
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("snakeHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const gameState = reactExports.useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15, type: 0 },
    direction: "RIGHT",
    nextDirection: "RIGHT",
    speed: INITIAL_SPEED,
    lastMove: 0,
    shake: 0,
    particles: [],
    animId: null
  });
  useRetroSound();
  const ASSETS = {
    head: "/assets/merchboy_face.png",
    food: "/assets/merchboy_money.png"
  };
  reactExports.useEffect(() => {
    gameState.current.images = {};
    const headImg = new Image();
    headImg.src = ASSETS.head;
    gameState.current.images.head = headImg;
    const foodImg = new Image();
    foodImg.src = ASSETS.food;
    gameState.current.images.food = foodImg;
    if (stats?.snakeHighScore > highScore) setHighScore(stats.snakeHighScore);
  }, [stats]);
  const handleInput = (key) => {
    const state = gameState.current;
    if (key === "ArrowUp" && state.direction !== "DOWN") state.nextDirection = "UP";
    if (key === "ArrowDown" && state.direction !== "UP") state.nextDirection = "DOWN";
    if (key === "ArrowLeft" && state.direction !== "RIGHT") state.nextDirection = "LEFT";
    if (key === "ArrowRight" && state.direction !== "LEFT") state.nextDirection = "RIGHT";
  };
  reactExports.useEffect(() => {
    const kd = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      handleInput(e.key);
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, []);
  const touchStart = reactExports.useRef(null);
  const handleTouchStart = (e) => touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) handleInput(dx > 0 ? "ArrowRight" : "ArrowLeft");
    } else {
      if (Math.abs(dy) > 30) handleInput(dy > 0 ? "ArrowDown" : "ArrowUp");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#000" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "#0f0", fontFamily: '"Orbitron", monospace', textShadow: "0 0 10px #0f0" }, children: "NEON SNAKE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", color: "white", marginBottom: "10px", fontSize: "1.2rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", border: "2px solid #0f0", borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 20px #0f0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 400,
          height: 400,
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
          style: { background: "#111", width: "100%", maxWidth: "400px", height: "auto" }
        }
      ),
      !gameOver && !gameState.current.animId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { fontSize: "1.5rem", background: "#0f0", color: "black" }, children: "START" }) }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GameOverCard, { score, bestScore: highScore, gameId: "snake", onReplay: initGame, onHome: () => window.location.href = "/arcade" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#555", marginTop: "10px" }, children: "Swipe or Arrow Keys" })
  ] });
};
export {
  SnakeGame as default
};
