import { b as useGamification, r as reactExports, x as useSettings, c as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link } from "./index-BwLfVL7x.js";
import { feedService } from "./feed-e9_3cEgk.js";
const BIOMES = [
  { name: "NEON CITY", bg: "#0d0221", grid: "#ff00ff", obs: ["#00ffaa", "#ff00ff"] },
  { name: "MAGMA CORE", bg: "#220000", grid: "#ff4400", obs: ["#ffaa00", "#ff4400"] },
  { name: "ICE CAVERN", bg: "#001133", grid: "#00ffff", obs: ["#ffffff", "#88ccff"] },
  { name: "TOXIC JUNGLE", bg: "#002200", grid: "#00ff00", obs: ["#ccff00", "#009900"] },
  { name: "THE VOID", bg: "#ffffff", grid: "#000000", obs: ["#000000", "#333333"] }
];
const FaceRunner = () => {
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const canvasRef = reactExports.useRef(null);
  const { soundEnabled } = useSettings();
  const { playCrash } = useRetroSound();
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const TUNNEL_DEPTH = 2e3;
  const [gameState, setGameState] = reactExports.useState("START");
  const [canRestart, setCanRestart] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("faceRunnerHighScore")) || 0);
  reactExports.useEffect(() => {
    if (stats?.faceRunnerHighScore > highScore) {
      setHighScore(stats.faceRunnerHighScore);
    }
  }, [stats]);
  const [selectedFace, setSelectedFace] = reactExports.useState("face_money");
  const playingRef = reactExports.useRef(false);
  const speedRef = reactExports.useRef(30);
  const scoreRef = reactExports.useRef(0);
  const biomeIndexRef = reactExports.useRef(0);
  const playerRef = reactExports.useRef({ x: 0, y: 0, squash: 1 });
  const obstaclesRef = reactExports.useRef([]);
  const requestRef = reactExports.useRef(null);
  const faceImgs = reactExports.useRef({});
  reactExports.useEffect(() => {
    const faces = ["face_money", "face_bear", "face_bunny", "face_default"];
    faces.forEach((f) => {
      const img = new Image();
      img.src = `/assets/skins/${f}.png`;
      faceImgs.current[f] = img;
    });
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  const startGame = () => {
    setGameState("PLAYING");
    setCanRestart(false);
    playingRef.current = true;
    setScore(0);
    speedRef.current = 30;
    scoreRef.current = 0;
    biomeIndexRef.current = 0;
    playerRef.current = { x: 0, y: 0, squash: 1 };
    obstaclesRef.current = [];
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  const spawnObstacle = (currentBiome) => {
    const spread = 800;
    const color = currentBiome.obs[Math.floor(Math.random() * currentBiome.obs.length)];
    obstaclesRef.current.push({
      x: (Math.random() - 0.5) * spread * 1.5,
      y: (Math.random() - 0.5) * spread * 1.5,
      z: TUNNEL_DEPTH,
      color,
      rot: Math.random() * Math.PI,
      size: 100 + Math.random() * 100
      // Varied sizes
    });
  };
  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;
    const cx = width / 2;
    const cy = height / 2;
    const distance = Math.floor(scoreRef.current);
    const biomeStage = Math.floor(distance / 2500) % BIOMES.length;
    biomeIndexRef.current = biomeStage;
    const currentBiome = BIOMES[biomeStage];
    if (playingRef.current) {
      speedRef.current = Math.min(30 + scoreRef.current * 0.015, 120);
      if (Math.random() < 0.08) {
        spawnObstacle(currentBiome);
      }
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.z -= speedRef.current;
        if (obs.z <= 0) {
          obstaclesRef.current.splice(i, 1);
          scoreRef.current += 5;
          setScore(Math.floor(scoreRef.current));
        }
      }
    }
    ctx.fillStyle = currentBiome.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = currentBiome.grid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i / 8 * Math.PI * 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * width, cy + Math.sin(angle) * height);
    }
    const offset = performance.now() * speedRef.current * 0.05 % 500;
    for (let z = 500; z > 0; z -= 500 / 5) {
      const d = (z - offset + 500) % 500;
      if (d < 10) continue;
      const scale = 500 / d;
      const size = 50 * scale;
      if (size < width * 2) {
        ctx.rect(cx - size, cy - size, size * 2, size * 2);
      }
    }
    ctx.stroke();
    obstaclesRef.current.sort((a, b) => b.z - a.z);
    obstaclesRef.current.forEach((obs) => {
      if (obs.z < 10) return;
      const fov = 600;
      const scale = fov / obs.z;
      const sx = cx + obs.x * scale;
      const sy = cy + obs.y * scale;
      const size = obs.size * scale;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(obs.rot + performance.now() * 2e-3);
      if (obs.z < 100 && playingRef.current) {
        const dx = sx - (cx + playerRef.current.x);
        const dy = sy - (cy + playerRef.current.y);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < size / 2 + 30) {
          handleCrash();
        }
      }
      ctx.fillStyle = obs.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = obs.color;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);
      ctx.restore();
    });
    if (playingRef.current) {
      const p = playerRef.current;
      p.squash = 1 + Math.sin(performance.now() * 0.02) * 0.05;
      ctx.save();
      ctx.translate(cx + p.x, cy + p.y);
      ctx.scale(p.squash, 1 / p.squash);
      const img = faceImgs.current[selectedFace];
      const size = 100;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.fillStyle = "white";
    ctx.font = '20px "Orbitron", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(currentBiome.name, cx, 40);
    ctx.font = "14px monospace";
    ctx.fillText(`DISTANCE: ${Math.floor(scoreRef.current)}m`, cx, 65);
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  const handleCrash = () => {
    const finalScore = Math.floor(scoreRef.current);
    if (updateStat) updateStat("gamesPlayed", "face_runner");
    if (addCoins) addCoins(Math.floor(finalScore / 10));
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (updateStat) updateStat("faceRunnerHighScore", finalScore);
      const playerName = userProfile?.name || "Runner";
      feedService.publish(`reached ${finalScore}m in Face Runner!`, "win", playerName);
    }
    setGameState("GAME_OVER");
    playingRef.current = false;
    playCrash();
    setCanRestart(false);
    setTimeout(() => setCanRestart(true), 1500);
  };
  const handleInput = (clientX, clientY) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    let x = (clientX - rect.left) * scaleX - CANVAS_WIDTH / 2;
    let y = (clientY - rect.top) * scaleY - CANVAS_HEIGHT / 2;
    x = Math.max(-CANVAS_WIDTH / 2 + 50, Math.min(CANVAS_WIDTH / 2 - 50, x));
    y = Math.max(-CANVAS_HEIGHT / 2 + 50, Math.min(CANVAS_HEIGHT / 2 - 50, y));
    playerRef.current.x = x;
    playerRef.current.y = y;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    position: "fixed",
    inset: 0,
    background: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none"
    // DISALLOW SCROLLING
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        onMouseMove: (e) => handleInput(e.clientX, e.clientY),
        onTouchMove: (e) => {
          e.preventDefault();
          handleInput(e.touches[0].clientX, e.touches[0].clientY);
        },
        onTouchStart: (e) => {
          handleInput(e.touches[0].clientX, e.touches[0].clientY);
        },
        style: {
          width: "100%",
          height: "100%",
          objectFit: "contain",
          maxWidth: "800px",
          maxHeight: "600px",
          // Border changes color with Biome
          border: `4px solid ${BIOMES[Math.floor(Math.floor(score) / 2500) % BIOMES.length]?.obs[0] || "white"}`
        }
      }
    ),
    gameState === "START" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", textAlign: "center", background: "rgba(0,0,0,0.8)", padding: "40px", borderRadius: "20px", border: "2px solid cyan" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "cyan", fontSize: "3rem", margin: 0 }, children: "FACE WARP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "white", marginBottom: "20px" }, children: "Avoid the Void." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { background: "cyan", color: "black", fontSize: "1.5rem", padding: "15px 40px" }, children: "RUN" })
    ] }),
    gameState === "GAME_OVER" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", textAlign: "center", background: "rgba(0,0,0,0.8)", padding: "40px", borderRadius: "20px", border: "2px solid red" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "red", fontSize: "3rem", margin: 0 }, children: "CRASHED!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "white", fontSize: "2rem", fontWeight: "bold" }, children: [
        Math.floor(score),
        "m"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", marginBottom: "20px" }, children: [
        "BEST: ",
        highScore,
        "m"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: () => canRestart && startGame(),
          style: {
            background: canRestart ? "white" : "#555",
            color: canRestart ? "black" : "#888",
            fontSize: "1.5rem",
            padding: "15px 40px",
            cursor: canRestart ? "pointer" : "wait"
          },
          children: canRestart ? "AGAIN" : "WAIT..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: {
      position: "absolute",
      top: "20px",
      left: "20px",
      zIndex: 9999,
      textDecoration: "none"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "#ff0055",
      color: "white",
      padding: "10px 20px",
      borderRadius: "30px",
      fontWeight: "bold",
      boxShadow: "0 5px 15px rgba(255, 0, 85, 0.4)",
      boxSizing: "border-box",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    }, children: "🏠 EXIT" }) })
  ] });
};
export {
  FaceRunner as default
};
