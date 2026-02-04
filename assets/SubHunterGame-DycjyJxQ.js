import { y as useNavigate, r as reactExports, a as useGamification, b as useRetroSound, j as jsxRuntimeExports, S as SquishyButton } from "./index-CN6BZGmc.js";
import { G as GameOverCard } from "./GameOverCard-Dr0so2bB.js";
const SubHunterGame = () => {
  const navigate = useNavigate();
  const canvasRef = reactExports.useRef(null);
  const { updateStat, addCoins, stats } = useGamification() || {};
  const { playShoot, playCrash } = useRetroSound();
  const [gameState, setGameState] = reactExports.useState("start");
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("subHunterHighScore")) || 0);
  const stateRef = reactExports.useRef({
    player: { x: 50, y: 300, w: 80, h: 50, dy: 0, frame: 0 },
    bullets: [],
    enemies: [],
    particles: [],
    bubbles: [],
    lastEnemyTime: 0,
    score: 0,
    gameTime: 0
  });
  const sheetRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/sub_sheet.png";
    sheetRef.current = img;
    if (stats?.subHunterHighScore > highScore) setHighScore(stats.subHunterHighScore);
  }, [stats]);
  const initGame = () => {
    stateRef.current = {
      player: { x: 50, y: 300, w: 80, h: 50, dy: 0, frame: 0 },
      bullets: [],
      enemies: [],
      particles: [],
      bubbles: [],
      lastEnemyTime: 0,
      score: 0,
      gameTime: 0
    };
    setScore(0);
    setGameState("playing");
    requestAnimationFrame(gameLoop);
  };
  const spawnExplosion = (x, y, color) => {
    for (let i = 0; i < 12; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color
      });
    }
  };
  const gameLoop = (time) => {
    if (gameState !== "playing" && stateRef.current.score === 0 && time > 1e3) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;
    state.gameTime = time;
    if (gameState === "playing") {
      state.player.dy += 0.2;
      state.player.y += state.player.dy;
      if (state.player.y < 0) {
        state.player.y = 0;
        state.player.dy = 0;
      }
      if (state.player.y > canvas.height - state.player.h) {
        state.player.y = canvas.height - state.player.h;
        state.player.dy = 0;
      }
      state.bullets.forEach((b) => b.x += 12);
      state.bullets = state.bullets.filter((b) => b.x < canvas.width);
      if (time - state.lastEnemyTime > 1200) {
        const type = Math.floor(Math.random() * 3);
        const y = Math.random() * (canvas.height - 60);
        state.enemies.push({
          x: canvas.width,
          y,
          w: 50,
          h: 50,
          type,
          // 0: N, 1: S, 2: A
          speed: 3 + state.score / 500
        });
        state.lastEnemyTime = time;
      }
      state.enemies.forEach((e) => {
        e.x -= e.speed;
        e.y += Math.sin(time * 5e-3 + e.x * 0.01) * 1;
      });
      state.bullets.forEach((b) => {
        if (b.hit) return;
        state.enemies.forEach((e) => {
          if (e.dead) return;
          if (b.x < e.x + e.w && b.x + 30 > e.x && b.y < e.y + e.h && b.y + 10 > e.y) {
            b.hit = true;
            e.dead = true;
            playCrash();
            spawnExplosion(
              e.x + e.w / 2,
              e.y + e.h / 2,
              e.type === 0 ? "red" : e.type === 1 ? "green" : "blue"
            );
            state.score += 50;
            setScore(state.score);
          }
        });
      });
      const pRect = state.player;
      state.enemies.forEach((e) => {
        if (e.dead) return;
        if (pRect.x + 10 < e.x + e.w && pRect.x + pRect.w - 10 > e.x && pRect.y + 10 < e.y + e.h && pRect.y + pRect.h - 10 > e.y) {
          setGameState("gameover");
          playCrash();
          if (state.score > highScore) {
            setHighScore(state.score);
            if (updateStat) updateStat("subHunterHighScore", state.score);
          }
        }
      });
      state.bullets = state.bullets.filter((b) => !b.hit);
      state.enemies = state.enemies.filter((e) => e.x > -100 && !e.dead);
      if (Math.random() < 0.05) {
        state.bubbles.push({
          x: canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,
          speed: Math.random() * 2 + 1
        });
      }
      state.bubbles.forEach((b) => b.x -= b.speed);
      state.bubbles = state.bubbles.filter((b) => b.x > -10);
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
      });
      state.particles = state.particles.filter((p) => p.life > 0);
    }
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#001");
    grad.addColorStop(1, "#002");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    state.bubbles.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
    });
    const sheet = sheetRef.current;
    if (sheet && sheet.complete) {
      const sw = sheet.width / 3;
      const sh = sheet.height / 3;
      const pFrame = Math.floor(time / 100) % 2;
      ctx.drawImage(sheet, pFrame * sw, 0, sw, sh, state.player.x, state.player.y, state.player.w, state.player.h);
      state.enemies.forEach((e) => {
        let sx = 0, sy = sh;
        if (e.type === 0) {
          sx = sw;
          sy = sh;
        }
        if (e.type === 1) {
          sx = 2 * sw;
          sy = sh;
        }
        if (e.type === 2) {
          sx = 0;
          sy = 2 * sh;
        }
        ctx.save();
        ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
        ctx.rotate(Math.sin(time * 2e-3 + e.x) * 0.1);
        ctx.drawImage(sheet, sx, sy, sw, sh, -e.w / 2, -e.h / 2, e.w, e.h);
        ctx.restore();
      });
      state.bullets.forEach((b) => {
        ctx.drawImage(sheet, 0, sh, sw, sh, b.x, b.y, 40, 20);
      });
    } else {
      ctx.fillStyle = "yellow";
      ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);
      state.enemies.forEach((e) => {
        ctx.fillStyle = e.type === 0 ? "red" : e.type === 1 ? "green" : "blue";
        ctx.fillRect(e.x, e.y, e.w, e.h);
      });
    }
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (gameState === "playing") {
      requestAnimationFrame(() => gameLoop(performance.now()));
    }
  };
  const handleInput = (type) => {
    if (gameState !== "playing") return;
    if (type === "UP") stateRef.current.player.dy = -4;
    if (type === "DOWN") stateRef.current.player.dy = 4;
    if (type === "FIRE") {
      stateRef.current.bullets.push({
        x: stateRef.current.player.x + 60,
        y: stateRef.current.player.y + 20,
        w: 20,
        h: 10,
        hit: false
      });
      playShoot();
      stateRef.current.player.dy -= 1;
    }
  };
  reactExports.useEffect(() => {
    const kd = (e) => {
      if (e.code === "ArrowUp") handleInput("UP");
      if (e.code === "ArrowDown") handleInput("DOWN");
      if (e.code === "Space") handleInput("FIRE");
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [gameState]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#001" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "cyan", fontFamily: '"Orbitron", monospace', textShadow: "0 0 10px blue" }, children: "VOID HUNTER" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", border: "4px solid #0055ff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 30px #0022ff" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 800,
          height: 500,
          onPointerDown: (e) => {
            handleInput("FIRE");
            handleInput("UP");
          },
          style: { background: "#000", maxWidth: "100%", height: "auto", display: "block" }
        }
      ),
      gameState === "start" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "white", marginBottom: "20px" }, children: "MISSION: PURGE SUBSCRIPTIONS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { fontSize: "1.5rem", background: "cyan", color: "black" }, children: "DIVE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", marginTop: "10px" }, children: "Tap or Space to Shoot & Rise" })
      ] }),
      gameState === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 10, left: 10, color: "white", fontWeight: "bold" }, children: [
        "SCORE: ",
        score
      ] }),
      gameState === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GameOverCard, { score, bestScore: highScore, gameId: "sub_hunter", onReplay: initGame, onHome: () => navigate("/arcade") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", display: "flex", gap: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => handleInput("UP"), style: { padding: "20px", fontSize: "1.5rem" }, children: "⬆️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => handleInput("FIRE"), style: { padding: "20px 40px", fontSize: "1.5rem", background: "red" }, children: "🔥" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => handleInput("DOWN"), style: { padding: "20px", fontSize: "1.5rem" }, children: "⬇️" })
    ] })
  ] });
};
export {
  SubHunterGame as default
};
