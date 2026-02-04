import { r as reactExports, a as useGamification, b as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-B9FV-ur0.js";
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_SPEED = 3;
const PIPE_SPACING = 200;
const BIRD_SIZE = 40;
const FlappyMascot = () => {
  const canvasRef = reactExports.useRef(null);
  const { shopState, updateStat, addCoins, userProfile, stats, consumeItem } = useGamification() || {};
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("flappyHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  shopState?.equipped?.flappy || "flappy_boy";
  const { playJump, playCrash, playCollect } = useRetroSound();
  const spriteSheetRef = reactExports.useRef(null);
  const gameState = reactExports.useRef({
    birdY: GAME_HEIGHT / 2,
    velocity: 0,
    pipes: [],
    coins: [],
    particles: [],
    bgOffset: 0,
    rotation: 0,
    animationId: null,
    frame: 0
  });
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/flappy_sheet.png";
    spriteSheetRef.current = img;
    if (stats?.flappyHighScore > highScore) setHighScore(stats.flappyHighScore);
  }, [stats]);
  const initGame = () => {
    setScore(0);
    setGameOver(false);
    setGameActive(true);
    gameState.current = {
      birdY: GAME_HEIGHT / 2,
      velocity: 0,
      pipes: [{ x: GAME_WIDTH + 100, topHeight: 200, passed: false }],
      coins: [],
      particles: [],
      bgOffset: 0,
      rotation: 0,
      animationId: null,
      frame: 0
    };
    requestAnimationFrame(gameLoop);
  };
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      gameState.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: color || "white"
      });
    }
  };
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    cancelAnimationFrame(gameState.current.animationId);
    playCrash();
    spawnParticles(50 + BIRD_SIZE / 2, gameState.current.birdY + BIRD_SIZE / 2, "orange");
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("flappyHighScore", score);
      triggerConfetti();
    }
    if (addCoins) addCoins(Math.floor(score));
    if (updateStat) updateStat("gamesPlayed", "flappy_mascot");
  };
  const useShield = () => {
    if (consumeItem && consumeItem("flappy_shield")) {
      setGameOver(false);
      setGameActive(true);
      gameState.current.birdY = GAME_HEIGHT / 2;
      gameState.current.velocity = 0;
      gameState.current.pipes = gameState.current.pipes.filter((p) => p.x > 200);
      if (gameState.current.pipes.length === 0) {
        gameState.current.pipes.push({ x: GAME_WIDTH + 100, topHeight: 200, passed: false });
      }
      requestAnimationFrame(gameLoop);
    }
  };
  const gameLoop = () => {
    if (!gameActive) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = gameState.current;
    state.frame++;
    state.velocity += GRAVITY;
    state.birdY += state.velocity;
    state.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.velocity * 0.1));
    state.bgOffset = (state.bgOffset + 1) % GAME_WIDTH;
    state.pipes.forEach((p) => p.x -= PIPE_SPEED);
    const lastPipe = state.pipes[state.pipes.length - 1];
    if (lastPipe && GAME_WIDTH - lastPipe.x >= PIPE_SPACING) {
      const minH = 50;
      const maxH = GAME_HEIGHT - 150 - minH;
      const h = Math.floor(Math.random() * (maxH - minH)) + minH;
      state.pipes.push({ x: GAME_WIDTH, topHeight: h, passed: false });
      if (Math.random() > 0.5) {
        state.coins.push({
          x: GAME_WIDTH + 50,
          y: h + 150 / 2 + (Math.random() * 40 - 20),
          // Center of gap
          collected: false
        });
      }
    }
    if (state.pipes[0].x < -60) state.pipes.shift();
    state.coins.forEach((c) => {
      c.x -= PIPE_SPEED;
      if (!c.collected && 50 + BIRD_SIZE > c.x && 50 < c.x + 30 && state.birdY + BIRD_SIZE > c.y && state.birdY < c.y + 30) {
        c.collected = true;
        playCollect();
        setScore((s) => s + 5);
        spawnParticles(c.x, c.y, "gold");
      }
    });
    state.coins = state.coins.filter((c) => c.x > -50 && !c.collected);
    if (state.birdY > GAME_HEIGHT - 20 || state.birdY < 0) {
      endGame();
      return;
    }
    state.pipes.forEach((p) => {
      if (50 + BIRD_SIZE - 5 > p.x && 50 + 5 < p.x + 60) {
        if (state.birdY + 5 < p.topHeight || state.birdY + BIRD_SIZE - 5 > p.topHeight + 150) {
          endGame();
        }
      }
      if (!p.passed && p.x + 60 < 50) {
        p.passed = true;
        setScore((s) => s + 1);
      }
    });
    if (!gameActive) return;
    state.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 5; i++) {
      const x = (i * 150 - state.bgOffset * 0.5 + 1e3) % (GAME_WIDTH + 200) - 100;
      const y = 100 + Math.sin(i + performance.now() * 1e-3) * 20;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 30, y - 10, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#3a8";
    for (let i = 0; i < 10; i++) {
      const x = (i * 60 - state.bgOffset * 0.2 + 1e3) % (GAME_WIDTH + 100) - 50;
      const h = 50 + i % 3 * 40;
      ctx.fillRect(x, GAME_HEIGHT - h, 60, h);
    }
    state.pipes.forEach((p) => {
      ctx.fillStyle = "#73bf2e";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.fillRect(p.x, 0, 60, p.topHeight);
      ctx.strokeRect(p.x, -5, 60, p.topHeight + 5);
      ctx.fillStyle = "#558c22";
      ctx.fillRect(p.x - 4, p.topHeight - 20, 68, 20);
      ctx.strokeRect(p.x - 4, p.topHeight - 20, 68, 20);
      const by = p.topHeight + 150;
      ctx.fillStyle = "#73bf2e";
      ctx.fillRect(p.x, by, 60, GAME_HEIGHT - by);
      ctx.strokeRect(p.x, by, 60, GAME_HEIGHT - by);
      ctx.fillStyle = "#558c22";
      ctx.fillRect(p.x - 4, by, 68, 20);
      ctx.strokeRect(p.x - 4, by, 68, 20);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(p.x + 10, 0, 5, p.topHeight);
      ctx.fillRect(p.x + 10, by, 5, GAME_HEIGHT - by);
    });
    state.coins.forEach((c) => {
      ctx.save();
      ctx.translate(c.x + 15, c.y + 15);
      ctx.rotate(state.frame * 0.1);
      ctx.fillStyle = "gold";
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.save();
    ctx.translate(50 + BIRD_SIZE / 2, state.birdY + BIRD_SIZE / 2);
    ctx.rotate(state.rotation);
    if (spriteSheetRef.current && spriteSheetRef.current.complete) {
      const frame = Math.floor(state.frame / 5) % 3;
      try {
        const cellW = spriteSheetRef.current.width / 4;
        const cellH = spriteSheetRef.current.height / 2;
        ctx.drawImage(spriteSheetRef.current, frame * cellW, 0, cellW, cellH, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      } catch (e) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      }
    } else {
      ctx.fillStyle = "yellow";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    }
    ctx.restore();
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
    const gOff = state.frame * PIPE_SPEED % 20;
    ctx.strokeStyle = "#cbb968";
    ctx.lineWidth = 2;
    for (let i = -20; i < GAME_WIDTH; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i - gOff, GAME_HEIGHT - 20);
      ctx.lineTo(i - gOff - 10, GAME_HEIGHT);
      ctx.stroke();
    }
    gameState.current.animationId = requestAnimationFrame(gameLoop);
  };
  const handleInput = (e) => {
    if (e) e.preventDefault();
    if (!gameActive) return;
    gameState.current.velocity = JUMP_STRENGTH;
    playJump();
    spawnParticles(50, gameState.current.birdY + BIRD_SIZE, "white");
  };
  reactExports.useEffect(() => {
    const kd = (e) => {
      if (e.code === "Space") handleInput(e);
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [gameActive]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#222", fontFamily: '"Orbitron", monospace' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "cyan", textShadow: "0 0 10px cyan", marginBottom: "10px" }, children: "FLAPPY MASCOT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", color: "white", marginBottom: "10px", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#aaa" }, children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", border: "4px solid #fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 30px rgba(0,255,255,0.2)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          onMouseDown: handleInput,
          onTouchStart: handleInput,
          style: { display: "block", maxWidth: "100%", height: "auto", cursor: "pointer" }
        }
      ),
      !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { fontSize: "2rem", padding: "20px 40px", background: "cyan", color: "black", fontWeight: "bold" }, children: "FLY!" }) }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "red", marginBottom: "20px" }, children: "CRASHED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "white", fontSize: "1.5rem", marginBottom: "20px" }, children: [
          "Score: ",
          score
        ] }),
        shopState?.inventory?.["flappy_shield"] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(SquishyButton, { onClick: useShield, style: { marginBottom: "10px", background: "gold", color: "black" }, children: [
          "🛡️ REVIVE (",
          shopState.inventory["flappy_shield"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { marginBottom: "10px", background: "cyan", color: "black" }, children: "RETRY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "white" }, children: "EXIT" })
      ] })
    ] })
  ] });
};
export {
  FlappyMascot as default
};
