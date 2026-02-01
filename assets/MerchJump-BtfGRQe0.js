import { r as reactExports, c as useRetroSound, b as useGamification, j as jsxRuntimeExports, S as SquishyButton, L as Link } from "./index-Csj9Q7BA.js";
import { G as GameOverCard } from "./GameOverCard-m3tUD8Dy.js";
import { feedService } from "./feed-DGYyEmJ9.js";
const BIOMES = [
  { name: "STREETS", limit: 2500, bgTop: "#87CEEB", bgBot: "#E0F7FA", plat: "#999", text: "#333", border: "#666" },
  { name: "SUNSET WAVE", limit: 5e3, bgTop: "#ff7e5f", bgBot: "#feb47b", plat: "#554433", text: "white", border: "#332211" },
  { name: "CYBER CITY", limit: 7500, bgTop: "#2b1055", bgBot: "#7597de", plat: "#00ffaa", text: "#00ffaa", border: "white" },
  { name: "GLITCH REALM", limit: 1e4, bgTop: "#000000", bgBot: "#111111", plat: "#00ff00", text: "#00ff00", border: "lime", glitch: true },
  { name: "ASCENSION", limit: 999999, bgTop: "#FFD700", bgBot: "#FFFFFF", plat: "#FFFFFF", text: "#B8860B", border: "#FFD700" }
];
const MerchJump = () => {
  const canvasRef = reactExports.useRef(null);
  const { playJump, playCrash, playBoop } = useRetroSound();
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  reactExports.useEffect(() => {
    if (stats?.merchJumpHighScore > highScore) {
      setHighScore(stats.merchJumpHighScore);
    }
  }, [stats]);
  const GRAVITY = 0.4;
  const JUMP_FORCE = -12;
  const WIDTH = 400;
  const HEIGHT = 600;
  const SKINS = [
    { id: "face_money", name: "MONEY", src: "/assets/skins/face_money.png?t=v2", hoodie: "#111" },
    { id: "face_bear", name: "BEAR", src: "/assets/skins/face_bear.png?t=v2", hoodie: "#593a28" },
    { id: "face_bunny", name: "BUNNY", src: "/assets/skins/face_bunny.png?t=v2", hoodie: "#7cb9e8" },
    { id: "face_default", name: "OG", src: "/assets/skins/face_default.png?t=v2", hoodie: "#333" }
  ];
  const [gameState, setGameState] = reactExports.useState("MENU");
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("merchJumpHighScore")) || 0);
  const [selectedSkin, setSelectedSkin] = reactExports.useState(SKINS[0]);
  const playerRef = reactExports.useRef({ x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 40, height: 60 });
  const platformsRef = reactExports.useRef([]);
  const cameraYRef = reactExports.useRef(0);
  const scoreRef = reactExports.useRef(0);
  const requestRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(WIDTH / 2);
  const skinImgRef = reactExports.useRef(null);
  const biomeRef = reactExports.useRef(BIOMES[0]);
  reactExports.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = selectedSkin.src;
    skinImgRef.current = img;
    return () => cancelAnimationFrame(requestRef.current);
  }, [selectedSkin]);
  const getCurrentBiome = (s) => {
    for (let b of BIOMES) {
      if (s < b.limit) return b;
    }
    return BIOMES[BIOMES.length - 1];
  };
  const initGame = () => {
    setScore(0);
    scoreRef.current = 0;
    cameraYRef.current = 0;
    biomeRef.current = BIOMES[0];
    playerRef.current = { x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 40, height: 60 };
    platformsRef.current = [];
    platformsRef.current.push({ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, h: 20, type: "normal", color: BIOMES[0].plat, border: BIOMES[0].border });
    let y = HEIGHT - 200;
    for (let i = 0; i < 15; i++) {
      generatePlatform(y, BIOMES[0]);
      y -= 80 + Math.random() * 40;
    }
    setGameState("PLAYING");
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  const generatePlatform = (y, biome) => {
    const x = Math.random() * (WIDTH - 80);
    platformsRef.current.push({
      x,
      y,
      w: 70 + Math.random() * 30,
      h: 15,
      type: Math.random() > 0.8 ? "moving" : "normal",
      vx: Math.random() > 0.5 ? 2 : -2,
      color: biome.plat,
      border: biome.border
    });
  };
  const drawRig = (ctx, x, y, vy, tilt) => {
    const time = performance.now() * 0.01;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * 0.2);
    ctx.fillStyle = "#ccc";
    ctx.fillRect(-15, -10, 10, 30);
    ctx.fillRect(5, -10, 10, 30);
    if (vy < 0) {
      ctx.fillStyle = "#ff9900";
      ctx.beginPath();
      ctx.moveTo(-10, 20);
      ctx.lineTo(-5, 35 + Math.random() * 10);
      ctx.lineTo(0, 20);
      ctx.moveTo(10, 20);
      ctx.lineTo(15, 35 + Math.random() * 10);
      ctx.lineTo(5, 20);
      ctx.fill();
    }
    ctx.fillStyle = "#222";
    const legLeftY = vy < 0 ? 30 : 30 + Math.abs(Math.sin(time) * 5);
    const legRightY = vy < 0 ? 30 + 5 : 30 + Math.abs(Math.cos(time) * 5);
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.quadraticCurveTo(-15, 25, -12, legLeftY);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#222";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.quadraticCurveTo(15, 25, 12, legRightY);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fillRect(-16, legLeftY, 8, 5);
    ctx.fillRect(8, legRightY, 8, 5);
    ctx.fillStyle = selectedSkin.hoodie || "#111";
    ctx.beginPath();
    ctx.roundRect(-20, 0, 40, 35, 10);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "10px sans-serif";
    ctx.fillText("M", -5, 20);
    ctx.strokeStyle = selectedSkin.hoodie || "#111";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-18, 5);
    ctx.lineTo(-30, vy < 0 ? -10 : 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18, 5);
    ctx.lineTo(30, vy < 0 ? -10 : 15);
    ctx.stroke();
    if (skinImgRef.current && skinImgRef.current.complete) {
      const size = 50;
      ctx.drawImage(skinImgRef.current, -size / 2, -size / 2 - 15, size, size);
    } else {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(0, -20, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const player = playerRef.current;
    const currentBiome = getCurrentBiome(scoreRef.current);
    biomeRef.current = currentBiome;
    const targetX = inputRef.current;
    player.x += (targetX - player.x) * 0.15;
    if (player.x < -20) player.x = WIDTH + 20;
    if (player.x > WIDTH + 20) player.x = -20;
    player.vy += GRAVITY;
    player.y += player.vy;
    if (player.y < HEIGHT / 2) {
      const shift = HEIGHT / 2 - player.y;
      player.y = HEIGHT / 2;
      cameraYRef.current += shift;
      scoreRef.current += Math.floor(shift);
      setScore(scoreRef.current);
      platformsRef.current.forEach((p) => p.y += shift);
      platformsRef.current = platformsRef.current.filter((p) => p.y < HEIGHT);
      const lastP = platformsRef.current[platformsRef.current.length - 1];
      if (lastP && lastP.y > 100) {
        generatePlatform(lastP.y - (80 + Math.random() * 40), currentBiome);
      }
    }
    if (player.vy > 0) {
      platformsRef.current.forEach((p) => {
        if (player.x > p.x - 20 && player.x < p.x + p.w + 20 && player.y + 30 > p.y && player.y + 30 < p.y + p.h + 20) {
          player.vy = JUMP_FORCE;
          playJump();
        }
      });
    }
    platformsRef.current.forEach((p) => {
      if (p.type === "moving") {
        p.x += p.vx;
        if (p.x <= 0 || p.x + p.w >= WIDTH) p.vx *= -1;
      }
    });
    if (player.y > HEIGHT) {
      handleGameOver();
      return;
    }
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grad.addColorStop(0, currentBiome.bgTop);
    grad.addColorStop(1, currentBiome.bgBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    if (currentBiome.glitch && Math.random() > 0.95) {
      ctx.save();
      ctx.translate((Math.random() - 0.5) * 10, 0);
      if (Math.random() > 0.5) ctx.filter = "invert(1)";
    }
    if (currentBiome.name === "STREETS" || currentBiome.name === "SUNSET WAVE") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 5; i++) {
        const cx = (i * 100 + cameraYRef.current * 0.2) % (WIDTH + 200) - 100;
        const cy = i * 150 % HEIGHT;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.arc(cx + 40, cy + 10, 50, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (currentBiome.name === "CYBER CITY" || currentBiome.name === "GLITCH REALM") {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      const gridY = cameraYRef.current * 0.5 % 100;
      for (let y = gridY; y < HEIGHT; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }
    }
    platformsRef.current.forEach((p) => {
      ctx.fillStyle = p.color || currentBiome.plat;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.strokeStyle = p.border || currentBiome.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    });
    const tilt = (inputRef.current - player.x) * 0.05;
    drawRig(ctx, player.x, player.y, player.vy, tilt);
    ctx.fillStyle = currentBiome.text;
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${currentBiome.name}`, 10, 30);
    ctx.fillText(`${Math.floor(scoreRef.current)}m`, 10, 50);
    if (currentBiome.glitch && Math.random() > 0.95) {
      ctx.restore();
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  const handleGameOver = () => {
    setGameState("GAMEOVER");
    playCrash();
    const finalScore = Math.floor(scoreRef.current);
    if (addCoins) addCoins(Math.floor(finalScore / 100));
    if (updateStat) updateStat("gamesPlayed", "merch_jump");
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (updateStat) updateStat("merchJumpHighScore", finalScore);
      const playerName = userProfile?.name || "Player";
      feedService.publish(`set a new Merch Jump High Score: ${finalScore}m! 🚀`, "win", playerName);
    }
  };
  const handleInput = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    inputRef.current = (clientX - rect.left) * scaleX;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#222",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    touchAction: "none"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "white", marginBottom: "10px", fontSize: "1.5rem", fontWeight: "bold" }, children: "MERCH JUMP" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "2/3" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: WIDTH,
          height: HEIGHT,
          onMouseMove: handleInput,
          onTouchMove: (e) => {
            e.preventDefault();
            handleInput(e);
          },
          onTouchStart: handleInput,
          style: {
            width: "100%",
            height: "100%",
            background: "#87CEEB",
            border: "4px solid white",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }
        }
      ),
      gameState !== "PLAYING" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: gameState === "GAMEOVER" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        GameOverCard,
        {
          score: Math.floor(scoreRef.current),
          bestScore: highScore,
          gameId: "merch_jump",
          onReplay: initGame,
          onHome: () => window.location.href = "/arcade"
        }
      ) : (
        // ... MAIN MENU ...
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(5px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          borderRadius: "10px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: "bold", marginBottom: "10px" }, children: "SELECT DRIP:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }, children: SKINS.map((skin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setSelectedSkin(skin);
                  playBoop();
                },
                style: {
                  background: selectedSkin.id === skin.id ? "#87CEEB" : "#eee",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  transform: selectedSkin.id === skin.id ? "scale(1.1)" : "scale(1)",
                  boxShadow: selectedSkin.id === skin.id ? "0 5px 15px rgba(0,0,0,0.1)" : "none"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: skin.src, width: "40", height: "40", style: { display: "block", margin: "0 auto" } })
              },
              skin.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: {
            padding: "20px 50px",
            background: "#333",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
            border: "none",
            borderRadius: "100px"
          }, children: "JUMP" })
        ] })
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#888", marginTop: "20px", fontSize: "0.8rem" }, children: "Slide to Move • Reach 2500m for Next Biome" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: "20px", left: "20px", zIndex: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { borderRadius: "50px", padding: "10px 20px", fontSize: "1.2rem", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(5px)" }, children: "🏠 EXIT" }) })
  ] });
};
export {
  MerchJump as default
};
