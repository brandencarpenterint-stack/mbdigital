import { r as reactExports, u as useGamification, a as useRetroSound, e as useNavigate, j as jsxRuntimeExports, t as triggerConfetti } from "./index-s4ZrXZ7w.js";
import { S as SquishyButton } from "./SquishyButton-BbdLy0qJ.js";
import { U as UniversalGameOver } from "./UniversalGameOver-BlwhKZ0X.js";
import { feedService } from "./feed-Dh98i2wS.js";
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -7.5;
const PIPE_SPEED = 3.5;
const PIPE_SPACING = 250;
const PIPE_GAP = 180;
const BIRD_SIZE = 40;
const CHARACTERS = [
  { id: "classic", type: "image", content: "/assets/merchboy_face.png", name: "Merchboy" },
  { id: "brokid", type: "image", content: "/assets/brokid-logo.png", name: "BroKid" },
  { id: "money", type: "image", content: "/assets/skins/face_money.png", name: "Money" },
  { id: "bear", type: "image", content: "/assets/skins/face_bear.png", name: "Bear" },
  { id: "bunny", type: "image", content: "/assets/skins/face_bunny.png", name: "Bunny" },
  { id: "astro", type: "image", content: "/assets/skins/face_astro.png", name: "Astro" },
  { id: "dino", type: "image", content: "/assets/skins/face_dino.png", name: "Dino" },
  { id: "frog", type: "image", content: "/assets/skins/face_frog.png", name: "Frog" },
  { id: "gamer", type: "image", content: "/assets/skins/face_gamer.png", name: "Gamer" },
  { id: "pumpkin", type: "image", content: "/assets/skins/face_pumpkin.png", name: "Pumpkin" },
  { id: "rainbow", type: "image", content: "/assets/skins/face_rainbow.png", name: "Rainbow" },
  { id: "space", type: "image", content: "/assets/skins/face_space.png", name: "Space" },
  { id: "star", type: "image", content: "/assets/skins/face_star.png", name: "Star" }
];
const FlappyMascot = () => {
  const canvasRef = reactExports.useRef(null);
  const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("flappyHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [charIndex, setCharIndex] = reactExports.useState(0);
  const loadedImages = reactExports.useRef({});
  reactExports.useEffect(() => {
    if (stats?.flappyHighScore > highScore) {
      setHighScore(stats.flappyHighScore);
    }
  }, [stats]);
  const gameActiveRef = reactExports.useRef(false);
  const { playJump, playCrash, playCollect, playBeep } = useRetroSound();
  const gameState = reactExports.useRef({
    birdY: GAME_HEIGHT / 2,
    velocity: 0,
    pipes: [],
    lastTime: 0,
    animationId: null
  });
  reactExports.useEffect(() => {
    CHARACTERS.forEach((c) => {
      if (c.type === "image") {
        const img = new Image();
        img.src = c.content;
        loadedImages.current[c.id] = img;
      }
    });
  }, []);
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameActive(true);
    gameActiveRef.current = true;
    gameState.current = {
      birdY: GAME_HEIGHT / 2,
      velocity: 0,
      pipes: [{ x: GAME_WIDTH, topHeight: 200 }],
      lastTime: 0,
      animationId: null
    };
    requestAnimationFrame(gameLoop);
  };
  const endGame = () => {
    setGameActive(false);
    gameActiveRef.current = false;
    setGameOver(true);
    cancelAnimationFrame(gameState.current.animationId);
    playCrash();
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("flappyHighScore", score);
      triggerConfetti();
      if (score > 10) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`is flying high! Score: ${score} in Flappy Mascot!`, "win", playerName);
      }
    }
    if (addCoins) addCoins(Math.floor(score));
    if (updateStat) {
      updateStat("gamesPlayed", "flappy_mascot");
    }
  };
  const gameLoop = (timestamp) => {
    if (!gameActiveRef.current) return;
    const state = gameState.current;
    if (timestamp) {
      if (!state.lastTime) state.lastTime = timestamp;
      const delta = timestamp - state.lastTime;
      if (delta < 16) {
        state.animationId = requestAnimationFrame(gameLoop);
        return;
      }
      state.lastTime = timestamp - delta % 16;
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(i * 100 - state.lastTime / 100 % 100, GAME_HEIGHT - 100, 80, 100);
      ctx.fillRect(i * 100 + 40 - state.lastTime / 100 % 100, GAME_HEIGHT - 150, 40, 150);
    }
    state.velocity += GRAVITY;
    state.birdY += state.velocity;
    if (state.birdY > GAME_HEIGHT - BIRD_SIZE || state.birdY < 0) {
      endGame();
      return;
    }
    state.pipes.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;
    });
    if (state.pipes[state.pipes.length - 1].x < GAME_WIDTH - PIPE_SPACING) {
      const minHeight = 50;
      const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      state.pipes.push({ x: GAME_WIDTH, topHeight: height });
    }
    if (state.pipes[0].x < -60) {
      state.pipes.shift();
      setScore((prev) => prev + 1);
      playCollect();
    }
    state.pipes.forEach((pipe) => {
      const birdRight = 50 + BIRD_SIZE;
      const birdLeft = 50;
      const birdTop = state.birdY;
      const birdBottom = state.birdY + BIRD_SIZE;
      const hitMargin = 10;
      if (birdRight - hitMargin > pipe.x && birdLeft + hitMargin < pipe.x + 60) {
        if (birdTop + hitMargin < pipe.topHeight || birdBottom - hitMargin > pipe.topHeight + PIPE_GAP) {
          endGame();
        }
      }
    });
    ctx.fillStyle = "#73bf2e";
    ctx.strokeStyle = "#558c22";
    ctx.lineWidth = 4;
    state.pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
      ctx.strokeRect(pipe.x, 0, 60, pipe.topHeight);
      ctx.fillRect(pipe.x - 4, pipe.topHeight - 20, 68, 20);
      ctx.strokeRect(pipe.x - 4, pipe.topHeight - 20, 68, 20);
      const bottomY = pipe.topHeight + PIPE_GAP;
      ctx.fillRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
      ctx.strokeRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
      ctx.fillRect(pipe.x - 4, bottomY, 68, 20);
      ctx.strokeRect(pipe.x - 4, bottomY, 68, 20);
    });
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
    ctx.fillStyle = "#73bf2e";
    ctx.fillRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 10);
    const charData = CHARACTERS[charIndex];
    ctx.save();
    ctx.translate(50 + BIRD_SIZE / 2, state.birdY + BIRD_SIZE / 2);
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.velocity * 0.1));
    ctx.rotate(rotation);
    const flutter = Math.sin(Date.now() / 50) * 0.5;
    const drawWing = (side = "front") => {
      const flap = side === "back" ? flutter * 0.8 : flutter;
      ctx.save();
      ctx.translate(-20, 5);
      ctx.rotate(flap);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    drawWing("back");
    const img = loadedImages.current[charData.id];
    if (img && img.complete) {
      ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    }
    drawWing("front");
    ctx.restore();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const handleJump = () => {
    if (!gameActiveRef.current) return;
    gameState.current.velocity = JUMP_STRENGTH;
    playJump();
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive]);
  const navigate = useNavigate();
  const nextChar = () => {
    setCharIndex((prev) => (prev + 1) % CHARACTERS.length);
    playBeep();
  };
  const prevChar = () => {
    setCharIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    playBeep();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "100vh", width: "100vw", background: "#222", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, color: "white" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem" }, children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1rem", color: "#00ffcc" }, children: [
        "HIGH: ",
        highScore
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/arcade"), style: { position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "20px", cursor: "pointer", zIndex: 100 }, children: "EXIT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: GAME_WIDTH, height: GAME_HEIGHT, borderRadius: "15px", overflow: "hidden", boxShadow: "0 0 30px rgba(0,255,200,0.3)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: GAME_WIDTH, height: GAME_HEIGHT, onClick: handleJump, style: { width: "100%", height: "100%", touchAction: "none" } }),
      !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "white", textShadow: "2px 2px 0px #000", fontSize: "2.5rem", marginBottom: "20px" }, children: "FLAPPY MASCOT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px", background: "rgba(0,0,0,0.5)", padding: "15px 30px", borderRadius: "50px", marginBottom: "30px", pointerEvents: "auto" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            prevChar();
          }, style: { background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }, children: "â—€" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: CHARACTERS[charIndex].content, alt: "Mascot", style: { width: "60px", height: "60px", objectFit: "contain" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--neon-green)", fontWeight: "bold", marginTop: "5px" }, children: CHARACTERS[charIndex].name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            nextChar();
          }, style: { background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }, children: "â–¶" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: (e) => {
          e.stopPropagation();
          startGame();
        }, style: { fontSize: "1.5rem", padding: "15px 40px", background: "var(--neon-green)", color: "black", borderRadius: "50px" }, children: "START" })
      ] }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        UniversalGameOver,
        {
          score,
          highScore,
          onRestart: (e) => {
            if (e) e.stopPropagation();
            startGame();
          },
          onExit: () => navigate("/arcade")
        }
      ) })
    ] })
  ] });
};
export {
  FlappyMascot as default
};
