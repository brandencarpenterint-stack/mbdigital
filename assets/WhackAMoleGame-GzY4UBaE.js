import { a as useGamification, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, t as triggerConfetti } from "./index-DNW_3bB4.js";
const GRID_ROWS = 4;
const GRID_COLS = 4;
const CELL_SIZE = 100;
const GAP = 10;
const GAME_WIDTH = CELL_SIZE * GRID_COLS + GAP * (GRID_COLS - 1) + 40;
const GAME_HEIGHT = CELL_SIZE * GRID_ROWS + GAP * (GRID_ROWS - 1) + 40;
const SPRITE_SHEET_SRC = "/assets/whack_sheet.png";
const MOLE_TYPES = {
  normal: { row: 1, score: 10, hp: 1 },
  cyber: { row: 2, score: 50, hp: 2 },
  // Tougher
  gold: { row: 3, score: 100, hp: 1, speed: 2 }
  // Fast
};
const WhackAMoleGame = () => {
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const { playJump, playWin, playCrash, playBeep } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const [score, setScore] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(30);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("whackHighScore")) || 0);
  const gameState = reactExports.useRef({
    moles: [],
    // { row, col, type, state: 'UP'|'DOWN'|'HIT', animTimer, yOffset }
    particles: [],
    // { x, y, dx, dy, life, color, size }
    hammer: { x: 0, y: 0, state: "IDLE", timer: 0 },
    shake: 0,
    nextSpawn: 0,
    sheet: null
  });
  const animId = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (stats?.whackHighScore > highScore) setHighScore(stats.whackHighScore);
  }, [stats]);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = SPRITE_SHEET_SRC;
    gameState.current.sheet = img;
  }, []);
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    gameState.current.moles = [];
    gameState.current.particles = [];
    gameState.current.shake = 0;
    performance.now();
    const loop = (time) => {
      update();
      draw();
      if (gameActive) animId.current = requestAnimationFrame(loop);
    };
    animId.current = requestAnimationFrame(loop);
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timerInterval);
  };
  const endGame = () => {
    setGameActive(false);
    cancelAnimationFrame(animId.current);
    playWin();
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("whackHighScore", score);
      triggerConfetti();
    }
    if (addCoins) addCoins(Math.floor(score / 10));
    if (updateStat) updateStat("gamesPlayed", "whack");
  };
  const spawnMole = () => {
    const occupied = new Set(gameState.current.moles.map((m) => `${m.col},${m.row}`));
    const available = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!occupied.has(`${c},${r}`)) available.push({ c, r });
      }
    }
    if (available.length === 0) return;
    const spot = available[Math.floor(Math.random() * available.length)];
    const rand = Math.random();
    let type = "normal";
    if (rand > 0.9) type = "gold";
    else if (rand > 0.7) type = "cyber";
    gameState.current.moles.push({
      col: spot.c,
      row: spot.r,
      type,
      state: "UP",
      // Rising
      yOffset: CELL_SIZE,
      // Starts below
      timer: 0,
      maxTime: type === "gold" ? 60 : 120,
      // Frames to stay up
      hp: MOLE_TYPES[type].hp
    });
  };
  const update = (dt) => {
    const state = gameState.current;
    if (state.shake > 0) state.shake *= 0.9;
    if (state.shake < 0.5) state.shake = 0;
    state.nextSpawn--;
    if (state.nextSpawn <= 0) {
      spawnMole();
      state.nextSpawn = Math.max(20, 60 - score * 0.1);
    }
    for (let i = state.moles.length - 1; i >= 0; i--) {
      const m = state.moles[i];
      if (m.state === "UP") {
        m.yOffset *= 0.8;
        m.timer++;
        if (m.timer > m.maxTime) {
          m.state = "DOWN";
        }
      } else if (m.state === "DOWN") {
        m.yOffset += (CELL_SIZE - m.yOffset) * 0.1;
        if (m.yOffset > CELL_SIZE * 0.9) {
          state.moles.splice(i, 1);
          continue;
        }
      } else if (m.state === "HIT") {
        m.timer++;
        if (m.timer > 20) {
          state.moles.splice(i, 1);
          continue;
        }
      }
    }
    if (state.hammer.state === "SMASH") {
      state.hammer.timer--;
      if (state.hammer.timer <= 0) state.hammer.state = "IDLE";
    }
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.5;
      p.life -= 0.05;
      if (p.life <= 0) state.particles.splice(i, 1);
    }
  };
  const draw = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = gameState.current;
    const sheet = state.sheet;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }
    const OFFSET_X = 20;
    const OFFSET_Y = 20;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const x = OFFSET_X + c * (CELL_SIZE + GAP);
        const y = OFFSET_Y + r * (CELL_SIZE + GAP);
        if (sheet && sheet.complete) {
          const frame = Math.floor(Date.now() / 200) % 3;
          const sw = sheet.width / 3;
          const sh = sheet.height / 5;
          ctx.drawImage(sheet, frame * sw, 0, sw, sh, x, y, CELL_SIZE, CELL_SIZE);
        } else {
          ctx.fillStyle = "#222";
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2 - 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "cyan";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
    state.moles.forEach((m) => {
      const x = OFFSET_X + m.col * (CELL_SIZE + GAP);
      const y = OFFSET_Y + m.row * (CELL_SIZE + GAP);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.clip();
      if (sheet && sheet.complete) {
        const sw = sheet.width / 3;
        const sh = sheet.height / 5;
        const row = MOLE_TYPES[m.type].row;
        const col = m.state === "HIT" ? 1 : 0;
        const drawY = y + m.yOffset;
        ctx.drawImage(sheet, col * sw, row * sh, sw, sh, x, drawY, CELL_SIZE, CELL_SIZE);
      } else {
        ctx.fillStyle = m.type === "normal" ? "brown" : m.type === "cyber" ? "purple" : "gold";
        ctx.fillRect(x + 20, y + m.yOffset + 20, CELL_SIZE - 40, CELL_SIZE - 40);
      }
      ctx.restore();
    });
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    const h = state.hammer;
    if (h.state === "SMASH") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 40, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
  const handleInput = (clientX, clientY) => {
    if (!gameActive) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const OFFSET_X = 20;
    const OFFSET_Y = 20;
    const col = Math.floor((x - OFFSET_X) / (CELL_SIZE + GAP));
    const row = Math.floor((y - OFFSET_Y) / (CELL_SIZE + GAP));
    if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
      const idx = gameState.current.moles.findIndex((m) => m.col === col && m.row === row && m.state === "UP");
      if (idx !== -1) {
        const mole = gameState.current.moles[idx];
        mole.hp--;
        if (mole.hp <= 0) {
          mole.state = "HIT";
          mole.timer = 0;
          const scoreVal = MOLE_TYPES[mole.type].score;
          setScore((s) => s + scoreVal);
          playCrash();
          gameState.current.shake = 10;
          for (let i = 0; i < 10; i++) {
            gameState.current.particles.push({
              x,
              y,
              dx: (Math.random() - 0.5) * 10,
              dy: (Math.random() - 0.5) * 10,
              life: 1,
              color: mole.type === "cyber" ? "cyan" : "orange",
              size: Math.random() * 5
            });
          }
        } else {
          playBeep();
        }
      } else {
        playJump();
      }
    }
    gameState.current.hammer = { x, y, state: "SMASH", timer: 5 };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle, #222 0%, #000 100%)",
    fontFamily: '"Orbitron", sans-serif',
    color: "white"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3rem", color: "cyan", textShadow: "0 0 20px cyan", marginBottom: "20px" }, children: "CYBER MOLE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "40px", fontSize: "1.5rem", marginBottom: "20px", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "gold" }, children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: timeLeft < 10 ? "red" : "white" }, children: [
        "TIME: ",
        timeLeft
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#aaa" }, children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", border: "4px solid #ff0055", borderRadius: "10px", boxShadow: "0 0 30px #ff0055" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          onMouseDown: (e) => handleInput(e.clientX, e.clientY),
          onTouchStart: (e) => {
            e.preventDefault();
            handleInput(e.touches[0].clientX, e.touches[0].clientY);
          },
          style: { width: "90vw", maxWidth: "600px", height: "auto", display: "block", cursor: "cell" }
        }
      ),
      !gameActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: {
        padding: "20px 50px",
        fontSize: "2rem",
        background: "cyan",
        color: "black",
        fontWeight: "bold",
        boxShadow: "0 0 20px cyan"
      }, children: timeLeft === 0 ? "RETRY" : "START" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "#666" }, children: "Tap to Smash" })
  ] });
};
export {
  WhackAMoleGame as default
};
