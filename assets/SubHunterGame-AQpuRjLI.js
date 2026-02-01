const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/LeaderboardService-DEFtqEGN.js","assets/index-6H0vzCe-.js","assets/index-Cn7Sh0og.css"])))=>i.map(i=>d[i]);
import { z as useNavigate, r as reactExports, b as useGamification, B as useInventory, x as useSettings, j as jsxRuntimeExports, _ as __vitePreload } from "./index-6H0vzCe-.js";
const SubHunterGame = () => {
  const navigate = useNavigate();
  const canvasRef = reactExports.useRef(null);
  const { updateStats, addCoins } = useGamification() || {};
  const { incrementStat } = useInventory() || { incrementStat: () => {
  } };
  const { soundEnabled } = useSettings();
  const [gameState, setGameState] = reactExports.useState("start");
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("subHunterHighScore")) || 0);
  const stateRef = reactExports.useRef({
    player: { x: 50, y: 300, width: 60, height: 40, dy: 0 },
    bullets: [],
    enemies: [],
    particles: [],
    lastEnemyTime: 0,
    score: 0,
    isGameOver: false,
    frameCount: 0
  });
  reactExports.useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const loop = (timestamp) => {
      if (gameState === "playing") {
        update(timestamp, canvas);
      }
      draw(ctx, canvas);
      animationFrameId = requestAnimationFrame(loop);
    };
    if (gameState !== "start") {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      draw(ctx, canvas);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);
  const startGame = () => {
    stateRef.current = {
      player: { x: 50, y: 300, width: 60, height: 40, dy: 0 },
      bullets: [],
      enemies: [],
      // { x, y, type: 'N'|'S'|'A', color }
      particles: [],
      lastEnemyTime: 0,
      score: 0,
      isGameOver: false,
      frameCount: 0
    };
    setScore(0);
    setGameState("playing");
  };
  const update = (time, canvas) => {
    const state = stateRef.current;
    state.frameCount++;
    state.player.y += state.player.dy;
    state.player.dy *= 0.95;
    if (state.player.y < 0) {
      state.player.y = 0;
      state.player.dy = 1;
    }
    if (state.player.y > canvas.height - state.player.height) {
      state.player.y = canvas.height - state.player.height;
      state.player.dy = -1;
    }
    state.bullets.forEach((b) => b.x += 10);
    state.bullets = state.bullets.filter((b) => b.x < canvas.width);
    if (time - state.lastEnemyTime > 1500) {
      const types = [
        { char: "N", color: "#E50914" },
        // Netflix
        { char: "S", color: "#1DB954" },
        // Spotify
        { char: "A", color: "#00A8E1" },
        // Amazon
        { char: "H", color: "#1CE783" }
        // Hulu
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      state.enemies.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 40,
        height: 40,
        type: type.char,
        color: type.color,
        hp: 1
      });
      state.lastEnemyTime = time;
    }
    state.enemies.forEach((e) => {
      e.x -= 3 + state.score / 100;
    });
    state.bullets.forEach((b) => {
      state.enemies.forEach((e) => {
        if (!b.hit && !e.dead && b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
          b.hit = true;
          e.dead = true;
          e.hp--;
          createExplosion(e.x, e.y, e.color);
          state.score += 10;
          setScore(state.score);
          playSound("hit");
        }
      });
    });
    state.enemies.forEach((e) => {
      if (!e.dead && state.player.x < e.x + e.width && state.player.x + state.player.width > e.x && state.player.y < e.y + e.height && state.player.y + state.player.height > e.y) {
        gameOver();
      }
    });
    state.enemies = state.enemies.filter((e) => e.x > -50 && !e.dead);
    state.bullets = state.bullets.filter((b) => !b.hit);
    state.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
  };
  const createExplosion = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      stateRef.current.particles.push({
        x: x + 20,
        y: y + 20,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color
      });
    }
  };
  const gameOver = () => {
    stateRef.current.isGameOver = true;
    setGameState("gameover");
    playSound("die");
    if (stateRef.current.score > highScore) {
      setHighScore(stateRef.current.score);
      localStorage.setItem("subHunterHighScore", stateRef.current.score);
      if (updateStats) {
        updateStats({ subHunterHighScore: stateRef.current.score });
      }
    }
    const earned = Math.floor(stateRef.current.score / 10);
    if (addCoins && earned > 0) addCoins(earned);
    __vitePreload(async () => {
      const { leaderboardService } = await import("./LeaderboardService-DEFtqEGN.js");
      return { leaderboardService };
    }, true ? __vite__mapDeps([0,1,2]) : void 0).then(({ leaderboardService }) => {
      leaderboardService.submitScore("sub_hunter", stateRef.current.score, { difficulty: "normal" });
    });
  };
  const playSound = (type) => {
    if (!soundEnabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "shoot") {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "die") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  };
  const draw = (ctx, canvas) => {
    ctx.fillStyle = "#000011";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 20; i++) {
      const x = (Date.now() / 50 + i * 100) % canvas.width;
      const y = i * 50 % canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, i % 5 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    const state = stateRef.current;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(state.player.x + 30, state.player.y + 20, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00CCFF";
    ctx.beginPath();
    ctx.arc(state.player.x + 40, state.player.y + 15, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#888";
    ctx.fillRect(state.player.x - 5, state.player.y + 15, 5, 10);
    ctx.fillStyle = "#FF4400";
    state.bullets.forEach((b) => {
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });
    state.enemies.forEach((e) => {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.roundRect(e.x, e.y, e.width, e.height, 5);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(e.type, e.x + e.width / 2, e.y + e.height / 2);
    });
    state.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };
  const handleKeyDown = (e) => {
    if (gameState !== "playing") return;
    if (e.code === "ArrowUp") stateRef.current.player.dy = -5;
    if (e.code === "ArrowDown") stateRef.current.player.dy = 5;
    if (e.code === "Space") fire();
  };
  const fire = () => {
    if (gameState !== "playing") return;
    stateRef.current.bullets.push({
      x: stateRef.current.player.x + 50,
      y: stateRef.current.player.y + 15,
      width: 15,
      height: 5,
      hit: false
    });
    playSound("shoot");
  };
  const handleTouchStart = (e) => {
    if (e.target.className.includes("fire-btn")) {
      fire();
      return;
    }
    const touchY = e.touches[0].clientY;
    if (touchY < window.innerHeight / 2) stateRef.current.player.dy = -5;
    else stateRef.current.player.dy = 5;
  };
  reactExports.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    height: "100vh",
    width: "100vw",
    background: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 20,
      left: 20,
      color: "white",
      zIndex: 10,
      fontFamily: '"Orbitron", sans-serif',
      pointerEvents: "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem", color: "#FFD700", textShadow: "0 0 10px #FFD700" }, children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", opacity: 0.7 }, children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => navigate("/arcade"),
        style: {
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "white",
          padding: "8px 15px",
          borderRadius: "20px",
          cursor: "pointer",
          zIndex: 10
        },
        children: "EXIT"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: 800,
        height: 500,
        onTouchStart: handleTouchStart,
        style: {
          border: "2px solid #00CCFF",
          borderRadius: "10px",
          maxWidth: "100%",
          background: "#000011",
          boxShadow: "0 0 30px #00CCFF"
        }
      }
    ),
    gameState === "start" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      zIndex: 20
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Orbitron", sans-serif', fontSize: "3rem", color: "#00CCFF", textShadow: "0 0 20px #00CCFF" }, children: "VOID HUNTER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Destroy the Subscriptions!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Arrow Keys/Tap to Move • Space/Btn to Shoot" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: startGame,
          className: "squishy-btn",
          style: {
            marginTop: "20px",
            background: "#FFD700",
            border: "none",
            padding: "15px 40px",
            fontSize: "1.5rem",
            fontWeight: "900",
            color: "black",
            borderRadius: "50px"
          },
          children: "DIVE! ⚓"
        }
      )
    ] }),
    gameState === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      zIndex: 20,
      background: "rgba(0,0,0,0.9)",
      padding: "40px",
      borderRadius: "20px",
      border: "1px solid #ff0055"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Orbitron", sans-serif', fontSize: "3rem", color: "#ff0055" }, children: "HULL BREACHED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2rem", marginBottom: "20px" }, children: [
        "Final Score: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#FFD700", marginBottom: "30px" }, children: [
        "+",
        Math.floor(score / 10),
        " Coins Earned"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: startGame,
            className: "squishy-btn",
            style: {
              background: "#00CCFF",
              border: "none",
              padding: "10px 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "black",
              borderRadius: "30px"
            },
            children: "REPLAY"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/arcade"),
            className: "squishy-btn",
            style: {
              background: "transparent",
              border: "1px solid white",
              padding: "10px 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "white",
              borderRadius: "30px"
            },
            children: "EXIT"
          }
        )
      ] })
    ] }),
    gameState === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      zIndex: 15
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "fire-btn",
        onClick: fire,
        style: {
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 68, 0, 0.5)",
          border: "2px solid #FF4400",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: "FIRE"
      }
    ) })
  ] });
};
export {
  SubHunterGame as default
};
