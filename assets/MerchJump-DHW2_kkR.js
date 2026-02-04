import { r as reactExports, b as useRetroSound, a as useGamification, j as jsxRuntimeExports, S as SquishyButton } from "./index-C_VBZq5g.js";
import { G as GameOverCard } from "./GameOverCard-aZufjMYa.js";
const WIDTH = 400;
const HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_FORCE = -13;
const MerchJump = () => {
  const canvasRef = reactExports.useRef(null);
  const { playJump, playCollect, playCrash } = useRetroSound();
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const [gameState, setGameState] = reactExports.useState("MENU");
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("merchJumpHighScore")) || 0);
  const stateRef = reactExports.useRef({
    player: { x: WIDTH / 2, y: HEIGHT - 150, vy: 0, state: "JUMP" },
    platforms: [],
    items: [],
    particles: [],
    cameraY: 0,
    score: 0,
    sheet: null
  });
  reactExports.useRef(null);
  const inputRef = reactExports.useRef(WIDTH / 2);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/jump_sheet.png";
    stateRef.current.sheet = img;
    if (stats?.merchJumpHighScore > highScore) setHighScore(stats.merchJumpHighScore);
  }, [stats]);
  const initGame = () => {
    setScore(0);
    stateRef.current.score = 0;
    stateRef.current.cameraY = 0;
    stateRef.current.player = { x: WIDTH / 2, y: HEIGHT - 150, vy: -10, state: "JUMP" };
    stateRef.current.platforms = [{ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, type: "normal" }];
    stateRef.current.items = [];
    stateRef.current.particles = [];
    let y = HEIGHT - 150;
    for (let i = 0; i < 20; i++) {
      generatePlatform(y);
      y -= 80 + Math.random() * 20;
    }
    setGameState("PLAYING");
    requestAnimationFrame(gameLoop);
  };
  const generatePlatform = (y) => {
    const typeRand = Math.random();
    let type = "normal";
    if (stateRef.current.score > 1e3 && typeRand > 0.8) type = "moving";
    if (stateRef.current.score > 2e3 && typeRand > 0.9) type = "break";
    const w = 70;
    const x = Math.random() * (WIDTH - w);
    stateRef.current.platforms.push({
      x,
      y,
      w,
      type,
      vx: type === "moving" ? 2 : 0,
      broken: false
    });
    if (Math.random() < 0.05) {
      stateRef.current.items.push({
        x: x + 20,
        y: y - 40,
        type: "balloon",
        collected: false
      });
    }
  };
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 8; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color
      });
    }
  };
  const gameLoop = () => {
    if (gameState === "GAMEOVER") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = stateRef.current;
    const sheet = state.sheet;
    const player = state.player;
    player.x += (inputRef.current - player.x) * 0.15;
    if (player.x < -20) player.x = WIDTH + 20;
    if (player.x > WIDTH + 20) player.x = -20;
    player.vy += GRAVITY;
    player.y += player.vy;
    player.state = player.vy < 0 ? "JUMP" : "FALL";
    if (player.y < HEIGHT / 2) {
      const shift = HEIGHT / 2 - player.y;
      player.y = HEIGHT / 2;
      state.cameraY += shift;
      state.score += Math.floor(shift);
      setScore(state.score);
      state.platforms.forEach((p) => p.y += shift);
      state.items.forEach((i) => i.y += shift);
      state.particles.forEach((p) => p.y += shift);
      const oldLen = state.platforms.length;
      state.platforms = state.platforms.filter((p) => p.y < HEIGHT + 50);
      if (state.platforms.length < oldLen) {
        const highest = state.platforms.reduce((min, p) => Math.min(min, p.y), HEIGHT);
        generatePlatform(highest - 80 - Math.random() * 40);
      }
    }
    state.platforms.forEach((p) => {
      if (p.type === "moving") {
        p.x += p.vx;
        if (p.x < 0 || p.x + p.w > WIDTH) p.vx *= -1;
      }
      if (player.vy > 0 && player.x > p.x - 20 && player.x < p.x + p.w + 20 && player.y + 40 > p.y && player.y + 40 < p.y + 20) {
        if (p.type === "break") {
          if (!p.broken) {
            p.broken = true;
            playCrash();
            spawnParticles(p.x + p.w / 2, p.y, "brown");
          }
        } else {
          player.vy = JUMP_FORCE;
          playJump();
          spawnParticles(player.x, player.y + 40, "white");
        }
      }
    });
    state.items.forEach((item) => {
      if (!item.collected && player.x > item.x - 30 && player.x < item.x + 30 && player.y > item.y - 30 && player.y < item.y + 30) {
        item.collected = true;
        if (item.type === "balloon") {
          player.vy = -30;
          playCollect();
          spawnParticles(item.x, item.y, "red");
        }
      }
    });
    if (player.y > HEIGHT) {
      setGameState("GAMEOVER");
      playCrash();
      if (state.score > highScore) {
        setHighScore(state.score);
        if (updateStat) updateStat("merchJumpHighScore", state.score);
      }
      return;
    }
    state.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    const offY = state.cameraY % 50;
    for (let l = 0; l < HEIGHT; l += 50) {
      ctx.beginPath();
      ctx.moveTo(0, l + offY);
      ctx.lineTo(WIDTH, l + offY);
      ctx.stroke();
    }
    state.platforms.forEach((p) => {
      if (p.type === "break" && p.broken) return;
      if (sheet && sheet.complete) {
        const sw = sheet.width / 3;
        const sh = sheet.height / 3;
        let sx = 0;
        let sy = sh;
        if (p.type === "moving") sx = sw;
        if (p.type === "break") sx = sw * 2;
        ctx.drawImage(sheet, sx, sy, sw, sh, p.x, p.y, p.w, 20);
      } else {
        ctx.fillStyle = p.type === "moving" ? "cyan" : p.type === "break" ? "brown" : "#0f0";
        ctx.fillRect(p.x, p.y, p.w, 15);
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
      }
    });
    state.items.forEach((i) => {
      if (i.collected) return;
      if (sheet && sheet.complete) {
        const sw = sheet.width / 3;
        const sh = sheet.height / 3;
        ctx.drawImage(sheet, 0, sh * 2, sw, sh, i.x - 15, i.y, 30, 40);
      } else {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(i.x, i.y, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    if (sheet && sheet.complete) {
      const sw = sheet.width / 3;
      const sh = sheet.height / 3;
      let col = 0;
      if (player.state === "JUMP") col = 1;
      if (player.state === "FALL") col = 2;
      ctx.drawImage(sheet, col * sw, 0, sw, sh, player.x - 25, player.y - 30, 50, 60);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(player.x - 20, player.y - 30, 40, 60);
    }
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    stateRef.current.animId = requestAnimationFrame(gameLoop);
  };
  const handleInput = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = WIDTH / rect.width;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    inputRef.current = x * scale;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: '"Orbitron", monospace' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "#0f0", textShadow: "0 0 10px #0f0", marginBottom: "20px" }, children: "MERCH JUMP" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", border: "2px solid #333", borderRadius: "10px", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: WIDTH,
          height: HEIGHT,
          onMouseMove: handleInput,
          onTouchMove: handleInput,
          style: { background: "#111", cursor: "crosshair", maxWidth: "100%" }
        }
      ),
      gameState === "MENU" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: initGame, style: { fontSize: "2rem", padding: "20px 50px", background: "#0f0", color: "black" }, children: "JUMP" }) }),
      gameState === "GAMEOVER" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GameOverCard, { score: stateRef.current.score, bestScore: highScore, gameId: "merch_jump", onReplay: initGame, onHome: () => window.location.href = "/arcade" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 10, left: 10, color: "white", fontWeight: "bold" }, children: [
        "SCORE: ",
        score
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#666", marginTop: "10px" }, children: "Mouse / Touch to Move" })
  ] });
};
export {
  MerchJump as default
};
