import { b as useGamification, r as reactExports, c as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-BL4nUXVC.js";
import { feedService } from "./feed-bz_NwCbC.js";
const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const LANES = 5;
const LANE_WIDTH = GAME_WIDTH / LANES;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 8;
const ENEMY_SIZE = 40;
const BOSS_SIZE = 100;
const BOSS_HP_MAX = 30;
const MAX_LIVES = 3;
const GalaxyDefender = () => {
  const { updateStat, incrementStat, shopState, addCoins, userProfile, stats } = useGamification() || { updateStat: () => {
  }, incrementStat: () => {
  }, shopState: null };
  const canvasRef = reactExports.useRef(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(MAX_LIVES);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("galaxyHighScore")) || 0);
  reactExports.useEffect(() => {
    if (stats?.galaxyHighScore > highScore) {
      setHighScore(stats.galaxyHighScore);
    }
  }, [stats]);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameWon, setGameWon] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const gameActiveRef = reactExports.useRef(false);
  const bossImgRef = reactExports.useRef(null);
  const { playBeep, playCrash, playCollect, playWin } = useRetroSound();
  const gameState = reactExports.useRef({
    lane: 2,
    bullets: [],
    enemies: [],
    boss: null,
    enemyLasers: [],
    // Boss attacks
    lastEnemySpawn: 0,
    lastShotTime: 0,
    scoreInternal: 0,
    invincible: 0,
    // i-frames
    shake: 0,
    // screen shake
    animationId: null
  });
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/boy_face.png";
    bossImgRef.current = img;
    return () => cancelAnimationFrame(gameState.current.animationId);
  }, []);
  const startGame = () => {
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
      // Background stars
      powerups: [],
      // {x, y, type}
      weaponLevel: 1,
      weaponTimer: 0,
      level: 1,
      // Difficulty level
      bossActive: false,
      animationId: null
    };
    for (let i = 0; i < 50; i++) {
      gameState.current.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 2,
        speed: 0.5 + Math.random() * 2
      });
    }
    requestAnimationFrame(gameLoop);
  };
  const takeDamage = () => {
    const state = gameState.current;
    if (state.invincible > 0) return;
    state.invincible = 60;
    state.shake = 10;
    playCrash();
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      }
      return newLives;
    });
  };
  const endGame = (win) => {
    setGameActive(false);
    gameActiveRef.current = false;
    {
      setGameOver(true);
      playCrash();
    }
    const finalScore = gameState.current.scoreInternal + 0;
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (updateStat) updateStat("galaxyHighScore", finalScore);
      const playerName = userProfile?.name || "Pilot";
      feedService.publish(`saved the Galaxy with score: ${finalScore} 🚀`, "win", playerName);
    }
    if (incrementStat) incrementStat("gamesPlayed", "galaxy");
    if (addCoins) addCoins(Math.floor(finalScore / 10));
  };
  const spawnEnemy = (timestamp) => {
    const lane = Math.floor(Math.random() * LANES);
    const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - ENEMY_SIZE / 2;
    const speed = 2 + gameState.current.level + Math.random() * 2;
    gameState.current.enemies.push({ x, y: -ENEMY_SIZE, lane, speed });
    gameState.current.lastEnemySpawn = timestamp;
  };
  const gameLoop = (timestamp) => {
    const ctx = canvasRef.current.getContext("2d");
    const state = gameState.current;
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
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(i * LANE_WIDTH, 0);
      ctx.lineTo(i * LANE_WIDTH, GAME_HEIGHT);
      ctx.stroke();
    }
    if (gameActiveRef.current) {
      if (state.invincible > 0) state.invincible--;
      if (!state.boss) {
        const nextBossScore = state.level * 1e3;
        if (state.scoreInternal >= nextBossScore) {
          state.boss = {
            x: GAME_WIDTH / 2 - BOSS_SIZE / 2,
            y: -BOSS_SIZE,
            hp: BOSS_HP_MAX * state.level,
            dir: 1,
            flash: 0,
            lastAttack: 0,
            type: state.level % 3
            // Vary boss type (0, 1, 2)
          };
          state.bossActive = true;
          state.enemies = [];
        } else {
          const spawnRate = Math.max(400, 1e3 - state.level * 100);
          if (timestamp - state.lastEnemySpawn > spawnRate) {
            spawnEnemy(timestamp);
          }
        }
      }
      if (state.boss) {
        if (state.boss.y < 50) {
          state.boss.y += 1;
        } else {
          state.boss.x += (2 + state.level) * state.boss.dir;
          if (state.boss.x + BOSS_SIZE > GAME_WIDTH || state.boss.x < 0) {
            state.boss.dir *= -1;
          }
          const fireRate = Math.max(500, 2e3 - state.level * 200);
          if (timestamp - state.boss.lastAttack > fireRate) {
            const bossCenterX = state.boss.x + BOSS_SIZE / 2;
            if (state.level >= 2) {
              state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: -2 });
              state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: 2 });
            }
            state.enemyLasers.push({
              x: bossCenterX - 10,
              y: state.boss.y + BOSS_SIZE - 20,
              width: 20,
              height: 40,
              speed: 8,
              dx: 0
            });
            state.boss.lastAttack = timestamp;
          }
        }
      } else {
        if (Math.random() < 2e-3 && state.powerups.length === 0) {
          state.powerups.push({
            x: Math.random() * (GAME_WIDTH - 40),
            y: -40,
            type: "DOUBLE",
            speed: 2
          });
        }
      }
      state.bullets = state.bullets.filter((b) => b.y > -20);
      state.bullets.forEach((b) => b.y -= 15);
      state.enemies.forEach((e) => e.y += e.speed);
      state.enemyLasers = state.enemyLasers.filter((l) => l.y < GAME_HEIGHT);
      state.enemyLasers.forEach((l) => {
        l.y += l.speed;
        if (l.dx) l.x += l.dx;
      });
      state.powerups.forEach((p) => p.y += p.speed);
      for (let bIdx = state.bullets.length - 1; bIdx >= 0; bIdx--) {
        const b = state.bullets[bIdx];
        let hit = false;
        if (state.boss) {
          if (b.x > state.boss.x && b.x < state.boss.x + BOSS_SIZE && b.y > state.boss.y && b.y < state.boss.y + BOSS_SIZE) {
            state.boss.hp--;
            state.boss.flash = 3;
            hit = true;
            playCollect();
            if (state.boss.hp <= 0) {
              incrementStat("bossKills", 1);
              state.boss = null;
              state.level++;
              state.scoreInternal += 500;
              playWin();
              triggerConfetti();
            }
          }
        }
        if (!hit && !state.boss) {
          for (let eIdx = state.enemies.length - 1; eIdx >= 0; eIdx--) {
            const e = state.enemies[eIdx];
            if (b.x < e.x + ENEMY_SIZE && b.x + BULLET_SIZE > e.x && b.y < e.y + ENEMY_SIZE && b.y + BULLET_SIZE > e.y) {
              state.enemies.splice(eIdx, 1);
              state.scoreInternal += 50;
              setScore(state.scoreInternal);
              playCollect();
              hit = true;
              break;
            }
          }
        }
        if (hit) state.bullets.splice(bIdx, 1);
      }
      const playerX = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2;
      const playerY = GAME_HEIGHT - 80;
      const pRect = { x: playerX, y: playerY, w: PLAYER_SIZE, h: PLAYER_SIZE };
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
      for (let i = state.powerups.length - 1; i >= 0; i--) {
        const p = state.powerups[i];
        if (p.x < pRect.x + pRect.w && p.x + 30 > pRect.x && p.y < pRect.y + pRect.h && p.y + 30 > pRect.y) {
          state.weaponLevel = 2;
          state.weaponTimer = 600;
          state.powerups.splice(i, 1);
          playCollect();
          triggerConfetti();
        } else if (p.y > GAME_HEIGHT) {
          state.powerups.splice(i, 1);
        }
      }
    }
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
      const currentSkin = shopState?.equipped?.galaxy || "ship_default";
      if (currentSkin === "ship_ufo") {
        ctx.fillStyle = "#00ff88";
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(200, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(0, -5, 12, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(-15, 0, 3, 0, Math.PI * 2);
        ctx.arc(15, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentSkin === "ship_dragon") {
        ctx.fillStyle = "#00aa00";
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(10, -10);
        ctx.lineTo(-10, -10);
        ctx.fill();
        ctx.fillStyle = "#008800";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(0, 40);
        ctx.lineTo(-10, 20);
        ctx.lineTo(-30, 20);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(-5, -20, 2, 0, Math.PI * 2);
        ctx.arc(5, -20, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(20, 10);
        ctx.lineTo(10, 20);
        ctx.lineTo(-10, 20);
        ctx.lineTo(-20, 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#00ccff";
        ctx.beginPath();
        ctx.ellipse(0, -5, 5, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    const currentBullet = shopState?.equipped?.galaxy_bullet || "bullet_laser";
    ctx.fillStyle = "#ffcc00";
    state.bullets.forEach((b) => {
      if (currentBullet === "bullet_donut") {
        ctx.font = "20px serif";
        ctx.fillText("🍩", b.x - 5, b.y + 10);
      } else if (currentBullet === "bullet_cat") {
        ctx.font = "20px serif";
        ctx.fillText("🐱", b.x - 5, b.y + 10);
      } else {
        ctx.fillRect(b.x, b.y, BULLET_SIZE, 20);
      }
    });
    ctx.fillStyle = "#ff0055";
    ctx.font = "40px serif";
    state.enemies.forEach((e) => {
      ctx.fillText("👾", e.x, e.y + 40);
    });
    ctx.fillStyle = "#ff0000";
    state.enemyLasers.forEach((l) => {
      ctx.fillRect(l.x, l.y, l.width, l.height);
    });
    state.powerups.forEach((p) => {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(p.x + 15, p.y + 15, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("P", p.x + 8, p.y + 22);
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
        ctx.fillText("👹", state.boss.x + 10, state.boss.y + 80);
      }
      const percent = state.boss.hp / BOSS_HP_MAX;
      ctx.fillStyle = "#333";
      ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE, 10);
      ctx.fillStyle = percent > 0.5 ? "#00ff00" : "red";
      ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE * percent, 10);
    }
    ctx.restore();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const moveLeft = () => {
    if (!gameActiveRef.current) return;
    if (gameState.current.lane > 0) gameState.current.lane--;
  };
  const moveRight = () => {
    if (!gameActiveRef.current) return;
    if (gameState.current.lane < LANES - 1) gameState.current.lane++;
  };
  const fire = () => {
    if (!gameActiveRef.current) return;
    const state = gameState.current;
    const now = Date.now();
    if (now - state.lastShotTime > 200) {
      const startX = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - BULLET_SIZE / 2;
      if (state.weaponTimer > 0) {
        state.bullets.push({ x: startX - 10, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
        state.bullets.push({ x: startX + 10, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
        state.weaponTimer--;
      } else {
        state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
      }
      state.lastShotTime = now;
      playBeep();
    }
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActiveRef.current) return;
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft();
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight();
      if (e.key === " ") fire();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const touchRef = reactExports.useRef({ startX: 0, hasMoved: false });
  const handleTouchStart = (e) => {
    if (!gameActiveRef.current) return;
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      hasMoved: false
    };
  };
  const handleTouchMove = (e) => {
    if (!gameActiveRef.current) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const diffX = touch.clientX - touchRef.current.startX;
    const SWIPE_THRESHOLD = 40;
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0) moveRight();
      else moveLeft();
      touchRef.current.startX = touch.clientX;
      touchRef.current.hasMoved = true;
    }
  };
  const handleTouchEnd = (e) => {
    if (!gameActiveRef.current) return;
    const wasSwipe = touchRef.current.hasMoved;
    touchRef.current = { startX: 0, hasMoved: false };
    if (!wasSwipe) {
      fire();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    color: "#00ccff",
    minHeight: "100vh",
    touchAction: "none"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: "480px",
      marginBottom: "5px",
      fontSize: "1rem",
      fontWeight: "bold"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: Array.from({ length: MAX_LIVES }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: i < lives ? 1 : 0.2 }, children: "❤️" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%", maxWidth: "480px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          style: {
            width: "100%",
            height: "auto",
            border: "4px solid #00ccff",
            background: "radial-gradient(circle, #001133 0%, #000000 100%)",
            borderRadius: "10px",
            boxShadow: "0 0 20px #00ccff40",
            touchAction: "none"
            // Critical for preventing scrolling
          }
        }
      ),
      !gameActive && !gameOver && !gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "white", marginBottom: "10px" }, children: [
          "Use ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold" }, children: "ARROWS" }),
          " to move."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { padding: "15px 40px", fontSize: "1.5rem", background: "#00ccff", border: "none", borderRadius: "10px" }, children: "START MISSION" })
      ] }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "#ff0055" }, children: "GAME OVER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", marginBottom: "20px" }, children: [
          "Final Score: ",
          score
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { marginBottom: "10px", padding: "10px 30px", background: "#00ccff", border: "none", borderRadius: "5px" }, children: "Retry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "white", textDecoration: "underline" }, children: "Exit" })
      ] }),
      gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "#00ffaa" }, children: "VICTORY!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", marginBottom: "10px", color: "#fff" }, children: "GALAXY SAVED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { marginBottom: "10px", padding: "10px 30px", background: "gold", color: "black", border: "none", borderRadius: "5px" }, children: "Play Again" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "white", textDecoration: "underline" }, children: "Exit" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", width: "100%", paddingBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: moveLeft, style: { width: "60px", height: "60px", fontSize: "2rem", background: "#333", border: "2px solid #00ccff", borderRadius: "15px" }, children: "⬅️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: moveRight, style: { width: "60px", height: "60px", fontSize: "2rem", background: "#333", border: "2px solid #00ccff", borderRadius: "15px" }, children: "➡️" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: fire, style: { width: "80px", height: "80px", fontSize: "1.5rem", background: "red", border: "4px solid orange", borderRadius: "50%", boxShadow: "0 0 15px orange" }, children: "🔥" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginTop: "10px", color: "#666" }, children: "Defeat the Head at 500 Points!" })
  ] });
};
export {
  GalaxyDefender as default
};
