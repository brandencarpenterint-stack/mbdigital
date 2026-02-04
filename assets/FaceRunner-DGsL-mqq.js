import { a as useGamification, r as reactExports, b as useRetroSound, j as jsxRuntimeExports, L as Link, S as SquishyButton } from "./index-W_tBu39q.js";
const BIOMES = [
  { name: "NEON CITY", bg: "#050011", grid: "#ff00ff", obsType: 0 },
  { name: "CYBER VOID", bg: "#000000", grid: "#00ffff", obsType: 1 },
  { name: "PLASMA ZONE", bg: "#220022", grid: "#ff0055", obsType: 2 }
];
const FaceRunner = () => {
  const { updateStat, addCoins, stats } = useGamification() || {};
  const canvasRef = reactExports.useRef(null);
  const { playCrash } = useRetroSound();
  const WIDTH = 800;
  const HEIGHT = 600;
  const [gameState, setGameState] = reactExports.useState("START");
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("faceRunnerHighScore")) || 0);
  const stateRef = reactExports.useRef({
    player: { x: 0, y: 0, bank: 0 },
    obstacles: [],
    items: [],
    speed: 30,
    distance: 0,
    frame: 0
  });
  const sheetRef = reactExports.useRef(null);
  const requestRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/runner_sheet.png";
    sheetRef.current = img;
    if (stats?.faceRunnerHighScore > highScore) setHighScore(stats.faceRunnerHighScore);
    return () => cancelAnimationFrame(requestRef.current);
  }, [stats]);
  const startGame = () => {
    stateRef.current = {
      player: { x: 0, y: 0, bank: 0 },
      obstacles: [],
      items: [],
      speed: 30,
      distance: 0,
      frame: 0
    };
    setScore(0);
    setGameState("PLAYING");
    requestAnimationFrame(gameLoop);
  };
  const spawnObstacle = (type) => {
    const spread = 800;
    stateRef.current.obstacles.push({
      x: (Math.random() - 0.5) * spread * 2,
      y: (Math.random() - 0.5) * spread * 2,
      z: 2e3,
      type: Math.floor(Math.random() * 3),
      // 0: Cube, 1: Spike, 2: Gate
      rot: Math.random() * Math.PI,
      size: 150 + Math.random() * 50
    });
  };
  const drawSprite = (ctx, row, col, x, y, size, rot) => {
    if (!sheetRef.current || !sheetRef.current.complete) return;
    const sw = sheetRef.current.width / 3;
    const sh = sheetRef.current.height / 3;
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.drawImage(sheetRef.current, col * sw, row * sh, sw, sh, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const state = stateRef.current;
    const dist = Math.floor(state.distance);
    const biomeConfig = BIOMES[Math.floor(dist / 3e3) % BIOMES.length];
    if (gameState === "PLAYING") {
      state.speed = Math.min(30 + dist * 0.01, 100);
      state.distance += state.speed * 0.1;
      setScore(Math.floor(state.distance));
      if (Math.random() < 0.1) spawnObstacle(biomeConfig.obsType);
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.z -= state.speed;
        if (obs.z <= 0) {
          state.obstacles.splice(i, 1);
        }
      }
    }
    ctx.fillStyle = biomeConfig.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = biomeConfig.grid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * WIDTH, cy + Math.sin(a) * HEIGHT);
    }
    const offset = performance.now() * state.speed * 0.05 % 500;
    for (let z = 500; z > 0; z -= 100) {
      const d = (z - offset + 500) % 500;
      if (d < 10) continue;
      const s = 500 / d * 50;
      if (s < WIDTH * 2) {
        ctx.rect(cx - s, cy - s, s * 2, s * 2);
      }
    }
    ctx.stroke();
    state.obstacles.sort((a, b) => b.z - a.z);
    state.obstacles.forEach((obs) => {
      if (obs.z < 10) return;
      const scale = 500 / obs.z;
      const sx = cx + obs.x * scale;
      const sy = cy + obs.y * scale;
      const s = obs.size * scale;
      drawSprite(ctx, 1, obs.type, sx, sy, s, obs.rot + state.distance * 0.01);
      if (obs.z < 100 && gameState === "PLAYING") {
        const dx = sx - (cx + state.player.x);
        const dy = sy - (cy + state.player.y);
        if (Math.sqrt(dx * dx + dy * dy) < s / 2 + 20) {
          endGame();
        }
      }
    });
    if (gameState === "PLAYING") {
      const bank = state.player.bank;
      let col = 0;
      if (bank < -50) col = 1;
      if (bank > 50) col = 2;
      drawSprite(ctx, 0, col, cx + state.player.x, cy + state.player.y, 100, 0);
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  const endGame = () => {
    setGameState("GAMEOVER");
    playCrash();
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("faceRunnerHighScore", score);
    }
    if (addCoins) addCoins(Math.floor(score / 10));
  };
  const handleInput = (x, y) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nx = (x - rect.left) / rect.width - 0.5;
    const ny = (y - rect.top) / rect.height - 0.5;
    const targetX = nx * WIDTH * 1.5;
    const targetY = ny * HEIGHT * 1.5;
    stateRef.current.player.x += (targetX - stateRef.current.player.x) * 0.2;
    stateRef.current.player.y += (targetY - stateRef.current.player.y) * 0.2;
    stateRef.current.player.bank = targetX - stateRef.current.player.x;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "black", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100vw", height: "100vh" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: WIDTH,
        height: HEIGHT,
        onMouseMove: (e) => handleInput(e.clientX, e.clientY),
        onTouchMove: (e) => {
          e.preventDefault();
          handleInput(e.touches[0].clientX, e.touches[0].clientY);
        },
        style: { width: "100%", height: "100%", objectFit: "cover" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, color: "cyan", fontFamily: '"Orbitron"', fontSize: "2rem", textShadow: "0 0 10px blue" }, children: [
      score,
      "m"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: 20, right: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { background: "#ff0055" }, children: "EXIT" }) }),
    gameState === "START" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "4rem", color: "cyan", textShadow: "0 0 20px cyan" }, children: "FACE WARP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { fontSize: "2rem", padding: "20px 50px", background: "cyan", color: "black" }, children: "WAR_P" })
    ] }),
    gameState === "GAMEOVER" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "red", fontSize: "4rem" }, children: "CRITICAL FAILURE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { fontSize: "1.5rem", background: "white", color: "black" }, children: "RETRY" })
    ] })
  ] }) });
};
export {
  FaceRunner as default
};
