import { u as useGamification, r as reactExports, a as useRetroSound, e as useNavigate, j as jsxRuntimeExports, t as triggerConfetti } from "./index-s4ZrXZ7w.js";
import { S as SquishyButton } from "./SquishyButton-BbdLy0qJ.js";
import { U as UniversalGameOver } from "./UniversalGameOver-BlwhKZ0X.js";
import { feedService } from "./feed-Dh98i2wS.js";
const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const LANES = 5;
const LANE_WIDTH = GAME_WIDTH / LANES;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 8;
const ENEMY_SIZE = 40;
const BOSS_SIZE = 120;
const BOSS_HP_MAX = 50;
const MAX_LIVES = 3;
const CHARACTERS = [
  { id: "classic", type: "image", content: "/assets/merchboy_face.png", name: "Merchboy", color: "#00FA9A" },
  { id: "brokid", type: "image", content: "/assets/brokid-logo.png", name: "BroKid", color: "#FF4500" },
  { id: "money", type: "image", content: "/assets/skins/face_money.png", name: "Money", color: "#FFD700" },
  { id: "bear", type: "image", content: "/assets/skins/face_bear.png", name: "Bear", color: "#8B4513" },
  { id: "bunny", type: "image", content: "/assets/skins/face_bunny.png", name: "Bunny", color: "#FF69B4" },
  { id: "astro", type: "image", content: "/assets/skins/face_astro.png", name: "Astro", color: "#87CEEB" },
  { id: "dino", type: "image", content: "/assets/skins/face_dino.png", name: "Dino", color: "#32CD32" },
  { id: "frog", type: "image", content: "/assets/skins/face_frog.png", name: "Frog", color: "#008000" },
  { id: "gamer", type: "image", content: "/assets/skins/face_gamer.png", name: "Gamer", color: "#8A2BE2" },
  { id: "pumpkin", type: "image", content: "/assets/skins/face_pumpkin.png", name: "Pumpkin", color: "#FF8C00" },
  { id: "rainbow", type: "image", content: "/assets/skins/face_rainbow.png", name: "Rainbow", color: "#FF1493" },
  { id: "space", type: "image", content: "/assets/skins/face_space.png", name: "Space", color: "#4B0082" },
  { id: "star", type: "image", content: "/assets/skins/face_star.png", name: "Star", color: "#FFFF00" }
];
const GalaxyDefender = () => {
  const { updateStat, incrementStat, addCoins, userProfile, stats } = useGamification() || {};
  const canvasRef = reactExports.useRef(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(MAX_LIVES);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("galaxyHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameWon, setGameWon] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [charIndex, setCharIndex] = reactExports.useState(0);
  const gameActiveRef = reactExports.useRef(false);
  const bossImgRef = reactExports.useRef(null);
  const loadedImages = reactExports.useRef({});
  const { playBeep, playCrash, playCollect, playWin } = useRetroSound();
  const gameState = reactExports.useRef({
    lane: 2,
    bullets: [],
    enemies: [],
    boss: null,
    enemyLasers: [],
    lastEnemySpawn: 0,
    lastShotTime: 0,
    scoreInternal: 0,
    invincible: 0,
    shake: 0,
    stars: [],
    powerups: [],
    weapon: "NORMAL",
    weaponTimer: 0,
    hasShield: false,
    level: 1,
    bossActive: false,
    animationId: null
  });
  reactExports.useEffect(() => {
    if (stats?.galaxyHighScore > highScore) {
      setHighScore(stats.galaxyHighScore);
    }
  }, [stats]);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/merchboy_face.png";
    bossImgRef.current = img;
    CHARACTERS.forEach((c) => {
      if (c.type === "image") {
        const i = new Image();
        i.src = c.content;
        loadedImages.current[c.id] = i;
      }
    });
    return () => cancelAnimationFrame(gameState.current.animationId);
  }, []);
  const startGame = () => {
    if (gameState.current.animationId) {
      cancelAnimationFrame(gameState.current.animationId);
    }
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setGameWon(false);
    setGameActive(true);
    gameActiveRef.current = true;
    gameState.current = {
      lane: 2,
      bullets: [],
      enemies: [],
      boss: null,
      enemyLasers: [],
      lastEnemySpawn: 0,
      lastShotTime: 0,
      scoreInternal: 0,
      invincible: 0,
      shake: 0,
      stars: [],
      powerups: [],
      weapon: "NORMAL",
      weaponTimer: 0,
      hasShield: false,
      level: 1,
      bossActive: false,
      animationId: null
    };
    for (let i = 0; i < 50; i++) {
      gameState.current.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 2,
        speed: 1 + Math.random() * 3
      });
    }
    requestAnimationFrame(gameLoop);
  };
  const endGame = (win) => {
    setGameActive(false);
    gameActiveRef.current = false;
    {
      setGameOver(true);
      playCrash();
    }
    cancelAnimationFrame(gameState.current.animationId);
    const finalScore = gameState.current.scoreInternal;
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (updateStat) updateStat("galaxyHighScore", finalScore);
      triggerConfetti();
      if (finalScore > 500) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`is dominating the galaxy! Score: ${finalScore} in Galaxy Defender!`, "win", playerName);
      }
    }
    if (updateStat) {
      updateStat("gamesPlayed", "galaxy_defender");
    }
    if (addCoins) addCoins(Math.floor(finalScore / 10));
  };
  const spawnEnemy = (timestamp) => {
    const lane = Math.floor(Math.random() * LANES);
    const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - ENEMY_SIZE / 2;
    const speed = 2 + gameState.current.level * 0.8 + Math.random() * 1.5;
    gameState.current.enemies.push({ x, y: -ENEMY_SIZE, lane, speed });
    gameState.current.lastEnemySpawn = timestamp;
  };
  const spawnBoss = () => {
    gameState.current.boss = {
      x: GAME_WIDTH / 2 - BOSS_SIZE / 2,
      y: -BOSS_SIZE,
      // Start off-screen
      hp: BOSS_HP_MAX,
      phase: 1,
      flash: 0,
      type: Math.random() > 0.5 ? "merch" : "chaos"
      // Boss variants
    };
    playCrash();
  };
  const takeDamage = () => {
    if (gameState.current.invincible > 0) return;
    gameState.current.shake = 20;
    playCrash();
    if (gameState.current.hasShield) {
      gameState.current.hasShield = false;
      gameState.current.invincible = 60;
      return;
    }
    setLives((l) => {
      const newLives = l - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        gameState.current.invincible = 90;
      }
      return newLives;
    });
  };
  const gameLoop = (timestamp) => {
    if (!gameActiveRef.current) return;
    const state = gameState.current;
    if (state.invincible > 0) state.invincible--;
    if (state.weaponTimer > 0) {
      state.weaponTimer--;
      if (state.weaponTimer <= 0) state.weapon = "NORMAL";
    }
    if (timestamp - state.lastShotTime > (state.weapon === "RAPID" ? 100 : 250)) {
      const playerX = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - BULLET_SIZE / 2;
      const playerY = GAME_HEIGHT - 80;
      if (state.weapon === "SPREAD") {
        state.bullets.push({ x: playerX, y: playerY, dx: -2, dy: -10, color: "#0ff" });
        state.bullets.push({ x: playerX, y: playerY, dx: 0, dy: -10, color: "#0ff" });
        state.bullets.push({ x: playerX, y: playerY, dx: 2, dy: -10, color: "#0ff" });
      } else if (state.weapon === "LASER") {
        state.bullets.push({ x: playerX - 10, y: playerY, dx: 0, dy: -15, width: 28, height: 40, color: "#f0f", penetrate: true });
      } else {
        state.bullets.push({ x: playerX, y: playerY, dx: 0, dy: -10, color: "#0f0" });
      }
      state.lastShotTime = timestamp;
    }
    state.bullets = state.bullets.filter((b) => b.y > -50);
    state.bullets.forEach((b) => {
      b.y += b.dy;
      if (b.dx) b.x += b.dx;
    });
    if (state.scoreInternal > state.level * 1e3 && !state.bossActive) {
      state.level++;
      if (state.level % 3 === 0) {
        state.bossActive = true;
        spawnBoss();
      }
    }
    if (state.boss) {
      if (state.boss.y < 50) {
        state.boss.y += 2;
      } else {
        state.boss.x = GAME_WIDTH / 2 - BOSS_SIZE / 2 + Math.sin(timestamp / 500) * 100;
        if (Math.random() < 0.02 + state.level * 5e-3) {
          const bossCenterX = state.boss.x + BOSS_SIZE / 2;
          if (state.level >= 2) {
            state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: -2 });
            state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: 2 });
          }
          state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE - 20, width: 20, height: 40, speed: 8, dx: 0 });
        }
      }
    } else {
      const spawnRate = Math.max(400, 1100 - state.level * 150);
      if (timestamp - state.lastEnemySpawn > spawnRate) {
        spawnEnemy(timestamp);
      }
    }
    state.enemies.forEach((e) => e.y += e.speed);
    state.enemyLasers = state.enemyLasers.filter((l) => l.y < GAME_HEIGHT);
    state.enemyLasers.forEach((l) => {
      l.y += l.speed;
      if (l.dx) l.x += l.dx;
    });
    if (Math.random() < 2e-3) {
      const types = ["SPREAD", "RAPID", "LASER", "SHIELD", "HEAL"];
      const type = types[Math.floor(Math.random() * types.length)];
      state.powerups.push({
        x: Math.random() * (GAME_WIDTH - 30),
        y: -30,
        type
      });
    }
    if (!gameOver) {
      const playerX = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2;
      const playerY = GAME_HEIGHT - 80;
      const pRect = { x: playerX, y: playerY, w: PLAYER_SIZE, h: PLAYER_SIZE };
      for (let bIdx = state.bullets.length - 1; bIdx >= 0; bIdx--) {
        const b = state.bullets[bIdx];
        let hit = false;
        if (state.boss && b.y < state.boss.y + BOSS_SIZE && b.x > state.boss.x && b.x < state.boss.x + BOSS_SIZE) {
          state.boss.hp--;
          state.boss.flash = 5;
          hit = true;
          if (state.boss.hp <= 0) {
            state.boss = null;
            state.bossActive = false;
            state.scoreInternal += 1e3;
            playWin();
            state.enemyLasers = [];
          }
        }
        if (!hit && !state.boss) {
          for (let eIdx = state.enemies.length - 1; eIdx >= 0; eIdx--) {
            const e = state.enemies[eIdx];
            if (b.x < e.x + ENEMY_SIZE && b.x + (b.width || BULLET_SIZE) > e.x && b.y < e.y + ENEMY_SIZE && b.y + (b.height || BULLET_SIZE) > e.y) {
              state.enemies.splice(eIdx, 1);
              state.scoreInternal += 50;
              hit = true;
              if (Math.random() < 0.1) {
                state.powerups.push({ x: e.x, y: e.y, type: "HEAL" });
              }
              break;
            }
          }
        }
        if (hit && !b.penetrate) {
          state.bullets.splice(bIdx, 1);
        }
      }
      for (let i = state.powerups.length - 1; i >= 0; i--) {
        const p = state.powerups[i];
        p.y += 3;
        if (p.x < pRect.x + pRect.w && p.x + 30 > pRect.x && p.y < pRect.y + pRect.h && p.y + 30 > pRect.y) {
          playCollect();
          if (p.type === "HEAL") {
            setLives((l) => Math.min(MAX_LIVES, l + 1));
          } else if (p.type === "SHIELD") {
            state.hasShield = true;
          } else {
            state.weapon = p.type;
            state.weaponTimer = 600;
          }
          state.powerups.splice(i, 1);
        } else if (p.y > GAME_HEIGHT) {
          state.powerups.splice(i, 1);
        }
      }
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (e.x < pRect.x + pRect.w && e.x + ENEMY_SIZE > pRect.x && e.y < pRect.y + pRect.h && e.y + ENEMY_SIZE > pRect.y) {
          takeDamage();
          state.enemies.splice(i, 1);
        }
        if (e.y > GAME_HEIGHT) {
          state.enemies.splice(i, 1);
        }
      }
      for (let i = state.enemyLasers.length - 1; i >= 0; i--) {
        const l = state.enemyLasers[i];
        if (l.x < pRect.x + pRect.w && l.x + l.width > pRect.x && l.y < pRect.y + pRect.h && l.y + l.height > pRect.y) {
          takeDamage();
          state.enemyLasers.splice(i, 1);
        }
      }
    }
    const ctx = canvasRef.current.getContext("2d");
    let offsetX = 0;
    let offsetY = 0;
    if (state.shake > 0) {
      offsetX = (Math.random() - 0.5) * state.shake;
      offsetY = (Math.random() - 0.5) * state.shake;
      state.shake *= 0.9;
      if (state.shake < 0.5) state.shake = 0;
    }
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.fillStyle = "#000";
    ctx.fillRect(-20, -20, GAME_WIDTH + 40, GAME_HEIGHT + 40);
    ctx.fillStyle = "#fff";
    state.stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed;
      if (star.y > GAME_HEIGHT) {
        star.y = 0;
        star.x = Math.random() * GAME_WIDTH;
      }
    });
    const playerXDraw = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2;
    const playerYDraw = GAME_HEIGHT - 80;
    if (state.invincible % 10 < 5) {
      ctx.save();
      ctx.translate(playerXDraw + PLAYER_SIZE / 2, playerYDraw + PLAYER_SIZE / 2);
      ctx.fillStyle = `rgba(0, 200, 255, ${0.5 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(-15, 20);
      ctx.lineTo(0, 40 + Math.random() * 10);
      ctx.lineTo(15, 20);
      ctx.fill();
      const charData = CHARACTERS[charIndex];
      ctx.fillStyle = charData.color;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(-25, 25);
      ctx.lineTo(25, 25);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
      const img = loadedImages.current[charData.id];
      if (img && img.complete) {
        ctx.drawImage(img, -15, -5, 30, 30);
      }
      if (state.hasShield) {
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    state.bullets.forEach((b) => {
      ctx.fillStyle = b.color || "#0f0";
      ctx.fillRect(b.x, b.y, b.width || BULLET_SIZE, b.height || BULLET_SIZE);
    });
    ctx.fillStyle = "#f00";
    state.enemies.forEach((e) => {
      ctx.fillRect(e.x, e.y, ENEMY_SIZE, ENEMY_SIZE);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(e.x + 10, e.y + 10, 8, 8);
      ctx.fillRect(e.x + 22, e.y + 10, 8, 8);
      ctx.fillStyle = "#f00";
    });
    state.powerups.forEach((p) => {
      ctx.fillStyle = "#ff0";
      ctx.beginPath();
      ctx.arc(p.x + 15, p.y + 15, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      let icon = "P";
      if (p.type === "SPREAD") icon = "S";
      if (p.type === "RAPID") icon = "R";
      if (p.type === "LASER") icon = "L";
      if (p.type === "HEAL") icon = "+";
      if (p.type === "SHIELD") icon = "O";
      ctx.fillText(icon, p.x + 8, p.y + 22);
    });
    if (state.boss) {
      if (state.boss.flash > 0) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "white";
        state.boss.flash--;
      }
      if (bossImgRef.current && bossImgRef.current.complete) {
        ctx.save();
        ctx.translate(state.boss.x + BOSS_SIZE / 2, state.boss.y + BOSS_SIZE / 2);
        const bob = Math.sin(Date.now() / 200) * 10;
        ctx.translate(0, bob);
        ctx.rotate(Math.sin(Date.now() / 500) * 0.1);
        ctx.drawImage(bossImgRef.current, -BOSS_SIZE / 2, -BOSS_SIZE / 2, BOSS_SIZE, BOSS_SIZE);
        ctx.restore();
      } else {
        ctx.font = "80px Arial";
        ctx.fillText("B", state.boss.x + 10, state.boss.y + 80);
      }
      const percent = state.boss.hp / BOSS_HP_MAX;
      ctx.fillStyle = "#333";
      ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE, 10);
      ctx.fillStyle = "#f00";
      ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE * percent, 10);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.fillStyle = "#ff0000";
    state.enemyLasers.forEach((l) => {
      ctx.fillRect(l.x, l.y, l.width, l.height);
    });
    ctx.restore();
    setScore(state.scoreInternal);
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const handleInput = (direction) => {
    if (!gameActiveRef.current) return;
    gameState.current.lane += direction;
    if (gameState.current.lane < 0) gameState.current.lane = 0;
    if (gameState.current.lane >= LANES) gameState.current.lane = LANES - 1;
    playBeep();
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handleInput(-1);
      if (e.key === "ArrowRight") handleInput(1);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "100vh", width: "100vw", background: "#111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, color: "white", display: "flex", flexDirection: "column", gap: "5px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem", color: "#00ff88", textShadow: "0 0 10px #00ff88" }, children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1rem", color: "#aaa" }, children: [
        "HIGH: ",
        highScore
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ff0055", fontSize: "1.5rem" }, children: [
        "❤️".repeat(lives),
        "🖤".repeat(MAX_LIVES - lives)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/arcade"), style: { position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "20px", cursor: "pointer", zIndex: 10 }, children: "EXIT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: GAME_WIDTH, height: GAME_HEIGHT, borderRadius: "15px", overflow: "hidden", boxShadow: "0 0 40px rgba(0,255,136,0.2)", border: "2px solid #333" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: GAME_WIDTH, height: GAME_HEIGHT, style: { width: "100%", height: "100%", display: "block" } }),
      gameActive && !gameOver && !gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: "150px", display: "flex" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, onTouchStart: (e) => {
          e.preventDefault();
          handleInput(-1);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, onTouchStart: (e) => {
          e.preventDefault();
          handleInput(1);
        } })
      ] }),
      !gameActive && !gameOver && !gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { color: "#00ff88", textShadow: "0 0 20px #00ff88", fontSize: "3rem", marginBottom: "10px", textAlign: "center" }, children: [
          "GALAXY",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "DEFENDER"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px", background: "rgba(255,255,255,0.1)", padding: "15px 30px", borderRadius: "50px", marginBottom: "30px", pointerEvents: "auto" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            prevChar();
          }, style: { background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }, children: "◀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: "60px",
              height: "60px",
              background: CHARACTERS[charIndex].color,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: CHARACTERS[charIndex].content, alt: "Mascot", style: { width: "30px", height: "30px", marginBottom: "5px" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: CHARACTERS[charIndex].color, fontWeight: "bold", marginTop: "10px", textShadow: "0 0 5px " + CHARACTERS[charIndex].color }, children: CHARACTERS[charIndex].name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            nextChar();
          }, style: { background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }, children: "▶" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: (e) => {
          e.stopPropagation();
          startGame();
        }, style: { fontSize: "1.5rem", padding: "15px 40px", background: "#00ff88", color: "black", borderRadius: "50px" }, children: "LAUNCH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", marginTop: "20px", fontSize: "0.9rem" }, children: "Tap left/right sides to move" })
      ] }),
      (gameOver || gameWon) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        UniversalGameOver,
        {
          score,
          highScore,
          onRestart: startGame,
          onExit: () => navigate("/arcade")
        }
      ) })
    ] })
  ] });
};
export {
  GalaxyDefender as default
};
