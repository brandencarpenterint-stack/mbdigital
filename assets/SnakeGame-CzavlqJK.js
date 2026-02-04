import { r as reactExports, a as useGamification, b as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, t as triggerConfetti } from "./index-CfmL3Xs0.js";
import { G as GameOverCard } from "./GameOverCard-yDEoNRNB.js";
const GRID_SIZE = 20;
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
  const { playCollect, playCrash } = useRetroSound();
  const sheetRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/snake_sheet.png";
    sheetRef.current = img;
    if (stats?.snakeHighScore > highScore) setHighScore(stats.snakeHighScore);
  }, [stats]);
  const initGame = () => {
    setScore(0);
    setGameOver(false);
    gameState.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      food: spawnFood(),
      direction: "RIGHT",
      nextDirection: "RIGHT",
      speed: INITIAL_SPEED,
      lastMove: 0,
      shake: 0,
      particles: [],
      animId: null
    };
    requestAnimationFrame(gameLoop);
  };
  const spawnFood = () => {
    let x, y;
    while (true) {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      const safe = !gameState.current.snake.some((s) => s.x === x && s.y === y);
      if (safe) break;
    }
    return { x, y, type: Math.floor(Math.random() * 4) };
  };
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      gameState.current.particles.push({
        x: x * (canvasRef.current.width / GRID_SIZE) + canvasRef.current.width / GRID_SIZE / 2,
        y: y * (canvasRef.current.height / GRID_SIZE) + canvasRef.current.height / GRID_SIZE / 2,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color
      });
    }
  };
  const endGame = () => {
    setGameOver(true);
    playCrash();
    gameState.current.shake = 20;
    cancelAnimationFrame(gameState.current.animId);
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("snakeHighScore", score);
      triggerConfetti();
    }
    if (addCoins) addCoins(Math.floor(score / 10));
  };
  const gameLoop = (time) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = gameState.current;
    const CELL = canvasRef.current.width / GRID_SIZE;
    if (!gameOver && time - state.lastMove > state.speed) {
      state.lastMove = time;
      state.direction = state.nextDirection;
      const head = { ...state.snake[0] };
      if (state.direction === "UP") head.y--;
      if (state.direction === "DOWN") head.y++;
      if (state.direction === "LEFT") head.x--;
      if (state.direction === "RIGHT") head.x++;
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        endGame();
        return;
      }
      if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
      }
      state.snake.unshift(head);
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore((s) => s + 10);
        playCollect();
        state.shake = 5;
        spawnParticles(head.x, head.y, "gold");
        state.food = spawnFood();
        state.speed = Math.max(50, INITIAL_SPEED - score / 10 * 2);
      } else {
        state.snake.pop();
      }
    }
    state.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
    if (state.shake > 0) state.shake *= 0.9;
    if (state.shake < 0.5) state.shake = 0;
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }
    ctx.strokeStyle = "#113";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const p = i * CELL;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, canvasRef.current.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(canvasRef.current.width, p);
      ctx.stroke();
    }
    if (sheetRef.current && sheetRef.current.complete) {
      const sw = sheetRef.current.width / 4;
      const sh = sheetRef.current.height / 4;
      const sx = state.food.type * sw;
      const sy = 2 * sh;
      ctx.drawImage(sheetRef.current, sx, sy, sw, sh, state.food.x * CELL, state.food.y * CELL, CELL, CELL);
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(state.food.x * CELL + CELL / 2, state.food.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    state.snake.forEach((s, i) => {
      const isHead = i === 0;
      if (sheetRef.current && sheetRef.current.complete) {
        const sw = sheetRef.current.width / 4;
        const sh = sheetRef.current.height / 4;
        if (isHead) {
          let col = 3;
          if (state.direction === "UP") col = 0;
          if (state.direction === "DOWN") col = 1;
          if (state.direction === "LEFT") col = 2;
          ctx.drawImage(sheetRef.current, col * sw, 0, sw, sh, s.x * CELL, s.y * CELL, CELL, CELL);
        } else {
          ctx.drawImage(sheetRef.current, 0, sh, sw, sh, s.x * CELL, s.y * CELL, CELL, CELL);
        }
      } else {
        ctx.fillStyle = isHead ? "#0f0" : "#0a0";
        ctx.fillRect(s.x * CELL, s.y * CELL, CELL, CELL);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(s.x * CELL, s.y * CELL, CELL, CELL);
      }
    });
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
    state.animId = requestAnimationFrame(gameLoop);
  };
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
