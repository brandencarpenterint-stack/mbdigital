import { a as useGamification, r as reactExports, u as useRetroSound, j as jsxRuntimeExports, b as SquishyButton, L as Link, t as triggerConfetti, f as feedService } from "./index-DJTAqwQG.js";
import { R as RewardedSponsorModal } from "./RewardedSponsorModal-DlwPPbBD.js";
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
  const [hasRevived, setHasRevived] = reactExports.useState(false);
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const [gameWon, setGameWon] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const gameActiveRef = reactExports.useRef(false);
  const bossImgsRef = reactExports.useRef([]);
  const { playCrash, playCollect, playWin, playFire, playZap } = useRetroSound();
  const gameState = reactExports.useRef({
    lane: 2,
    roll: 0,
    rollTarget: 0,
    bullets: [],
    enemies: [],
    boss: null,
    enemyLasers: [],
    particles: [],
    floatingTexts: [],
    comboCount: 0,
    lastKillTime: 0,
    warpSpeed: 0,
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
    lastTime: 0,
    animationId: null
  });
  reactExports.useEffect(() => {
    const skins = [
      "/assets/skins/face_money.png",
      "/assets/skins/face_astro.png",
      "/assets/skins/face_bear.png",
      "/assets/skins/face_cat.png",
      "/assets/skins/face_pumpkin.png",
      "/assets/merchboy_face.png"
    ];
    bossImgsRef.current = skins.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    return () => {
      if (gameState.current.animationId) {
        cancelAnimationFrame(gameState.current.animationId);
      }
    };
  }, []);
  const startGame = () => {
    if (gameState.current.animationId) {
      cancelAnimationFrame(gameState.current.animationId);
    }
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setGameWon(false);
    setHasRevived(false);
    setGameActive(true);
    gameActiveRef.current = true;
    gameState.current = {
      lane: 2,
      roll: 0,
      rollTarget: 0,
      bullets: [],
      enemies: [],
      boss: null,
      enemyLasers: [],
      particles: [],
      floatingTexts: [],
      comboCount: 0,
      lastKillTime: 0,
      warpSpeed: 0,
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
      lastTime: 0,
      animationId: null
    };
    for (let i = 0; i < 65; i++) {
      gameState.current.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: 0.8 + Math.random() * 2,
        speed: 1.2 + Math.random() * 2.5,
        color: Math.random() > 0.6 ? "#00f0ff" : Math.random() > 0.4 ? "#ff007f" : "#ffffff"
      });
    }
    gameState.current.animationId = requestAnimationFrame(gameLoop);
  };
  const takeDamage = () => {
    const state = gameState.current;
    if (state.invincible > 0) return;
    if (state.hasShield) {
      state.hasShield = false;
      state.invincible = 60;
      state.shake = 12;
      playZap();
      if (navigator.vibrate) navigator.vibrate(30);
      const px = state.lane * LANE_WIDTH + LANE_WIDTH / 2;
      const py = GAME_HEIGHT - 60;
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        state.particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * (3 + Math.random() * 3),
          vy: Math.sin(angle) * (3 + Math.random() * 3),
          size: 3,
          color: "#00ffff",
          alpha: 1,
          decay: 0.04
        });
      }
      return;
    }
    state.invincible = 75;
    state.shake = 16;
    playCrash();
    if (navigator.vibrate) navigator.vibrate([40, 30, 70]);
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
      feedService.publish(`saved the Galaxy with score: ${finalScore} in Galaxy Defender`, "win", playerName);
    }
    if (incrementStat) incrementStat("gamesPlayed", "galaxy");
    if (addCoins) addCoins(Math.floor(finalScore / 10));
  };
  const spawnEnemy = (timestamp) => {
    const lane = Math.floor(Math.random() * LANES);
    const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - ENEMY_SIZE / 2;
    const speed = 4 + gameState.current.level * 1.2 + Math.random() * 2;
    gameState.current.enemies.push({ x, y: -ENEMY_SIZE, lane, speed });
    gameState.current.lastEnemySpawn = timestamp;
  };
  const gameLoop = (timestamp) => {
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
    let offsetX = 0;
    let offsetY = 0;
    if (state.shake > 0) {
      offsetX = (Math.random() - 0.5) * state.shake;
      offsetY = (Math.random() - 0.5) * state.shake;
      state.shake *= 0.88;
      if (state.shake < 0.5) state.shake = 0;
    }
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.fillStyle = "#050711";
    ctx.fillRect(-20, -20, GAME_WIDTH + 40, GAME_HEIGHT + 40);
    const isWarping = state.warpSpeed > 0;
    if (isWarping) state.warpSpeed--;
    state.stars.forEach((star) => {
      const currentSpeed = isWarping ? star.speed * (4 + state.warpSpeed * 0.3) : star.speed;
      if (isWarping) {
        ctx.strokeStyle = star.color || "#00f0ff";
        ctx.lineWidth = star.size * 1.2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y - currentSpeed * 2.5);
        ctx.stroke();
      } else {
        ctx.fillStyle = star.color || "#fff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      star.y += currentSpeed;
      if (star.y > GAME_HEIGHT) {
        star.y = 0;
        star.x = Math.random() * GAME_WIDTH;
      }
    });
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(i * LANE_WIDTH, 0);
      ctx.lineTo(i * LANE_WIDTH, GAME_HEIGHT);
      ctx.stroke();
    }
    if (gameActiveRef.current) {
      if (state.invincible > 0) state.invincible--;
      state.roll += (state.rollTarget - state.roll) * 0.18;
      state.rollTarget *= 0.84;
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
            type: (state.level - 1) % 6
          };
          state.bossActive = true;
          state.enemies = [];
        } else {
          const spawnRate = Math.max(240, 850 - state.level * 140);
          if (timestamp - state.lastEnemySpawn > spawnRate) {
            spawnEnemy(timestamp);
          }
        }
      }
      if (state.boss) {
        if (state.boss.y < 50) {
          state.boss.y += 1.5;
        } else {
          state.boss.x += (2.2 + state.level * 0.8) * state.boss.dir;
          if (state.boss.x + BOSS_SIZE > GAME_WIDTH || state.boss.x < 0) {
            state.boss.dir *= -1;
          }
          const fireRate = Math.max(380, 1800 - state.level * 180);
          if (timestamp - state.boss.lastAttack > fireRate) {
            const bossCenterX = state.boss.x + BOSS_SIZE / 2;
            if (state.boss.type === 0) {
              state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 14, height: 14, speed: 7, dx: -3, color: "#ffd700", shape: "disc" });
              state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 14, height: 14, speed: 7, dx: 0, color: "#ffd700", shape: "disc" });
              state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 14, height: 14, speed: 7, dx: 3, color: "#ffd700", shape: "disc" });
            } else if (state.boss.type === 1) {
              state.enemyLasers.push({ x: bossCenterX - 4, y: state.boss.y + BOSS_SIZE, width: 8, height: 35, speed: 10, dx: 0, color: "#00f0ff", shape: "beam" });
            } else if (state.boss.type === 2) {
              state.enemyLasers.push({ x: bossCenterX - 24, y: state.boss.y + BOSS_SIZE, width: 48, height: 48, speed: 4.5, dx: 0, color: "#ff6600", shape: "meteor" });
            } else if (state.boss.type === 3) {
              state.enemyLasers.push({ x: bossCenterX - 8, y: state.boss.y + BOSS_SIZE, width: 16, height: 24, speed: 8, dx: (Math.random() - 0.5) * 8, color: "#ff007f", shape: "plasma" });
            } else if (state.boss.type === 4) {
              for (let i = -2; i <= 2; i++) {
                state.enemyLasers.push({ x: bossCenterX - 7, y: state.boss.y + BOSS_SIZE, width: 14, height: 20, speed: 6, dx: i * 2.5, color: "#a855f7", shape: "plasma" });
              }
            } else {
              state.enemyLasers.push({ x: bossCenterX - 12, y: state.boss.y + BOSS_SIZE, width: 24, height: 32, speed: 9, dx: -4, color: "#ff0055", shape: "beam" });
              state.enemyLasers.push({ x: bossCenterX - 12, y: state.boss.y + BOSS_SIZE, width: 24, height: 32, speed: 9, dx: 0, color: "#ffffff", shape: "beam" });
              state.enemyLasers.push({ x: bossCenterX - 12, y: state.boss.y + BOSS_SIZE, width: 24, height: 32, speed: 9, dx: 4, color: "#00f0ff", shape: "beam" });
            }
            state.boss.lastAttack = timestamp;
          }
        }
        if (Math.random() < 5e-3 && state.powerups.length === 0) {
          const typeRoll = Math.random();
          let type = "SPREAD";
          if (typeRoll > 0.6) type = "RAPID";
          if (typeRoll > 0.88) type = "SHIELD";
          state.powerups.push({
            x: Math.random() * (GAME_WIDTH - 40),
            y: -40,
            type,
            speed: 3
          });
        }
      }
      state.bullets = state.bullets.filter((b) => b.y > -20);
      state.bullets.forEach((b) => {
        b.y -= b.speed || 15;
        if (b.dx) b.x += b.dx;
      });
      state.enemies.forEach((e) => e.y += e.speed);
      state.enemyLasers = state.enemyLasers.filter((l) => l.y < GAME_HEIGHT + 30);
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
            state.shake = 5;
            if (state.boss.hp <= 0) {
              incrementStat("bossKills", 1);
              state.boss = null;
              state.level++;
              state.scoreInternal += 1e3;
              state.warpSpeed = 40;
              state.shake = 22;
              playWin();
              triggerConfetti();
              for (let p = 0; p < 40; p++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 3 + Math.random() * 7;
                state.particles.push({
                  x: GAME_WIDTH / 2,
                  y: 110,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  size: 4 + Math.random() * 5,
                  color: ["#ffd700", "#ff0055", "#00f0ff", "#ffffff"][Math.floor(Math.random() * 4)],
                  alpha: 1,
                  decay: 0.025
                });
              }
              state.floatingTexts.push({
                text: "BOSS DEFEATED • HYPERDRIVE ACTIVE",
                x: 40,
                y: 220,
                life: 48,
                maxLife: 48,
                color: "#ffd700",
                size: 14
              });
              if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
            }
          }
        }
        if (!hit && !state.boss) {
          for (let eIdx = state.enemies.length - 1; eIdx >= 0; eIdx--) {
            const e = state.enemies[eIdx];
            if (b.x < e.x + ENEMY_SIZE && b.x + BULLET_SIZE > e.x && b.y < e.y + ENEMY_SIZE && b.y + BULLET_SIZE > e.y) {
              state.enemies.splice(eIdx, 1);
              const now = Date.now();
              if (now - state.lastKillTime < 1800) {
                state.comboCount = (state.comboCount || 1) + 1;
              } else {
                state.comboCount = 1;
              }
              state.lastKillTime = now;
              const comboBonus = state.comboCount > 1 ? state.comboCount * 25 : 0;
              state.scoreInternal += 50 + comboBonus;
              setScore(state.scoreInternal);
              playCollect();
              hit = true;
              state.shake = Math.min(10, 3 + state.comboCount);
              if (state.comboCount >= 2) {
                const comboTitles = {
                  2: "2X COMBO",
                  3: "3X STREAK",
                  4: "4X MULTI-KILL",
                  5: "5X ULTRA",
                  6: "6X UNSTOPPABLE",
                  7: "7X GODLIKE"
                };
                const title = comboTitles[Math.min(7, state.comboCount)] || `${state.comboCount}X STREAK`;
                state.floatingTexts.push({
                  text: title,
                  x: e.x - 10,
                  y: e.y - 12,
                  life: 34,
                  maxLife: 34,
                  color: state.comboCount >= 5 ? "#ffd700" : "#00f0ff",
                  size: state.comboCount >= 5 ? 14 : 12
                });
                if (navigator.vibrate) navigator.vibrate(20);
              }
              for (let p = 0; p < 12; p++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 2 + Math.random() * 4;
                state.particles.push({
                  x: e.x + ENEMY_SIZE / 2,
                  y: e.y + ENEMY_SIZE / 2,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  size: 3 + Math.random() * 3,
                  color: ["#00f0ff", "#ff007f", "#ffd700", "#ffffff"][Math.floor(Math.random() * 4)],
                  alpha: 1,
                  decay: 0.04
                });
              }
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
          if (p.type === "SHIELD") {
            state.hasShield = true;
          } else {
            state.weapon = p.type;
            state.weaponTimer = 600;
          }
          state.powerups.splice(i, 1);
          playCollect();
          triggerConfetti();
          if (navigator.vibrate) navigator.vibrate(30);
        } else if (p.y > GAME_HEIGHT) {
          state.powerups.splice(i, 1);
        }
      }
      state.particles.push({
        x: playerX + 15,
        y: playerY + 44,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 3 + Math.random() * 3,
        size: 2.5 + Math.random() * 2,
        color: "#00f0ff",
        alpha: 0.8,
        decay: 0.08
      });
      state.particles.push({
        x: playerX + 35,
        y: playerY + 44,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 3 + Math.random() * 3,
        size: 2.5 + Math.random() * 2,
        color: "#00f0ff",
        alpha: 0.8,
        decay: 0.08
      });
    }
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y -= 0.9;
      ft.life--;
      if (ft.life <= 0) {
        state.floatingTexts.splice(i, 1);
        continue;
      }
      const alpha = ft.life / ft.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${ft.size || 13}px "Orbitron", monospace`;
      ctx.fillStyle = ft.color || "#00f0ff";
      ctx.shadowColor = ft.color || "#00f0ff";
      ctx.shadowBlur = 10;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
    const playerXDraw = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2;
    const playerYDraw = GAME_HEIGHT - 80;
    if (state.invincible % 10 < 5) {
      ctx.save();
      ctx.translate(playerXDraw + PLAYER_SIZE / 2, playerYDraw + PLAYER_SIZE / 2);
      ctx.rotate(state.roll);
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
      } else {
        ctx.fillStyle = "#0a2239";
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(22, 12);
        ctx.lineTo(12, 22);
        ctx.lineTo(-12, 22);
        ctx.lineTo(-22, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#00f0ff";
        ctx.beginPath();
        ctx.ellipse(0, -4, 4, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state.hasShield) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 34 + Math.sin(Date.now() / 90) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }
    state.bullets.forEach((b) => {
      ctx.save();
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 12;
      ctx.fillRect(b.x, b.y, b.w || BULLET_SIZE, b.h || 20);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x + 2, b.y + 2, (b.w || BULLET_SIZE) - 4, (b.h || 20) - 4);
      ctx.restore();
    });
    state.enemies.forEach((e) => {
      ctx.save();
      ctx.translate(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE / 2);
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#1c0512";
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(16, -6);
      ctx.lineTo(8, -14);
      ctx.lineTo(-8, -14);
      ctx.lineTo(-16, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(-14, -6, 3, 8);
      ctx.fillRect(11, -6, 3, 8);
      const pulse = Math.sin(Date.now() / 110) * 1.5;
      ctx.fillStyle = "#ff0055";
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 1, 4 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    state.enemyLasers.forEach((l) => {
      ctx.save();
      ctx.fillStyle = l.color || "#ff0055";
      ctx.shadowColor = l.color || "#ff0055";
      ctx.shadowBlur = 10;
      if (l.shape === "disc") {
        ctx.beginPath();
        ctx.arc(l.x + l.width / 2, l.y + l.height / 2, l.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(l.x + l.width / 2, l.y + l.height / 2, l.width / 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (l.shape === "meteor") {
        ctx.beginPath();
        ctx.arc(l.x + l.width / 2, l.y + l.height / 2, l.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(l.x, l.y, l.width, l.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(l.x + 2, l.y + 2, Math.max(1, l.width - 4), Math.max(1, l.height - 4));
      }
      ctx.restore();
    });
    state.powerups.forEach((p) => {
      ctx.save();
      const color = p.type === "SHIELD" ? "#00ffff" : "#ffd700";
      ctx.fillStyle = "rgba(10, 15, 25, 0.9)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x + 15, p.y + 15, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = '900 11px "Orbitron", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = p.type === "SPREAD" ? "3X" : p.type === "RAPID" ? "RPM" : "DEF";
      ctx.fillText(label, p.x + 15, p.y + 15);
      ctx.restore();
    });
    if (state.boss) {
      const bossImg = bossImgsRef.current[state.boss.type];
      ctx.save();
      ctx.translate(state.boss.x + BOSS_SIZE / 2, state.boss.y + BOSS_SIZE / 2);
      const bob = Math.sin(Date.now() / 180) * 8;
      ctx.translate(0, bob);
      ctx.rotate(Math.sin(Date.now() / 400) * 0.08);
      if (bossImg && bossImg.complete) {
        ctx.drawImage(bossImg, -BOSS_SIZE / 2, -BOSS_SIZE / 2, BOSS_SIZE, BOSS_SIZE);
      } else {
        ctx.fillStyle = "#ff0055";
        ctx.shadowColor = "#ff0055";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(50, -40);
        ctx.lineTo(-50, -40);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      const percent = Math.max(0, state.boss.hp / (BOSS_HP_MAX * state.level));
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(state.boss.x, state.boss.y - 18, BOSS_SIZE, 7);
      ctx.fillStyle = percent > 0.5 ? "#00ff88" : "#ff0055";
      ctx.fillRect(state.boss.x, state.boss.y - 18, BOSS_SIZE * percent, 7);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(state.boss.x, state.boss.y - 18, BOSS_SIZE, 7);
    }
    ctx.restore();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const moveLeft = () => {
    if (!gameActiveRef.current) return;
    if (gameState.current.lane > 0) {
      gameState.current.lane--;
      gameState.current.rollTarget = -0.32;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };
  const moveRight = () => {
    if (!gameActiveRef.current) return;
    if (gameState.current.lane < LANES - 1) {
      gameState.current.lane++;
      gameState.current.rollTarget = 0.32;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };
  const fire = () => {
    if (!gameActiveRef.current) return;
    const state = gameState.current;
    const now = Date.now();
    const fireRate = state.weapon === "RAPID" ? 100 : 220;
    if (now - state.lastShotTime > fireRate) {
      const startX = state.lane * LANE_WIDTH + LANE_WIDTH / 2 - BULLET_SIZE / 2;
      if (state.weaponTimer > 0) state.weaponTimer--;
      else state.weapon = "NORMAL";
      if (state.weapon === "SPREAD") {
        state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 15, dx: 0, w: 8, h: 22 });
        state.bullets.push({ x: startX - 10, y: GAME_HEIGHT - 80, speed: 15, dx: -2.5, w: 6, h: 18 });
        state.bullets.push({ x: startX + 10, y: GAME_HEIGHT - 80, speed: 15, dx: 2.5, w: 6, h: 18 });
      } else if (state.weapon === "RAPID") {
        state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 25, dx: 0, w: 6, h: 26 });
      } else {
        state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 16, dx: 0, w: 8, h: 22 });
      }
      state.lastShotTime = now;
      playFire();
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
    touchRef.current = { startX: touch.clientX, hasMoved: false };
  };
  const handleTouchMove = (e) => {
    if (!gameActiveRef.current) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const diffX = touch.clientX - touchRef.current.startX;
    const SWIPE_THRESHOLD = 36;
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0) moveRight();
      else moveLeft();
      touchRef.current.startX = touch.clientX;
      touchRef.current.hasMoved = true;
    }
  };
  const handleTouchEnd = () => {
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
    padding: "16px",
    color: "#00f0ff",
    minHeight: "100vh",
    touchAction: "none"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "480px",
      marginBottom: "10px",
      padding: "10px 16px",
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "14px",
      fontFamily: '"Orbitron", monospace',
      fontSize: "0.85rem"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.68rem", color: "#64748b", letterSpacing: "1px" }, children: "HULL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: Array.from({ length: MAX_LIVES }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              background: i < lives ? "#00f0ff" : "rgba(255, 255, 255, 0.1)",
              boxShadow: i < lives ? "0 0 8px #00f0ff" : "none",
              transition: "all 0.2s ease"
            }
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00f0ff", fontSize: "0.75rem" }, children: [
          "WAVE ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: Math.floor(score / 1e3) + 1 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700", fontSize: "0.9rem" }, children: [
          score.toLocaleString(),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.65rem", color: "#94a3b8" }, children: "PTS" })
        ] })
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
            border: "1px solid rgba(0, 240, 255, 0.35)",
            background: "#050711",
            borderRadius: "20px",
            boxShadow: "0 0 60px rgba(0, 240, 255, 0.18), 0 25px 50px rgba(0,0,0,0.85)",
            touchAction: "none"
          }
        }
      ),
      !gameActive && !gameOver && !gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "85%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#94a3b8", marginBottom: "16px", fontFamily: '"Inter", sans-serif', letterSpacing: "0.5px" }, children: "USE [← / →] TO DRIFT LANES • [SPACE] TO FIRE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              padding: "16px 42px",
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
              border: "none",
              borderRadius: "14px",
              color: "#000",
              fontWeight: "900",
              fontFamily: '"Orbitron", monospace',
              boxShadow: "0 0 30px rgba(0, 240, 255, 0.5)",
              letterSpacing: "1px"
            },
            children: "ENGAGE DEFENSE"
          }
        )
      ] }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(5, 7, 17, 0.92)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        padding: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "#ff0055", fontFamily: '"Orbitron", monospace', letterSpacing: "2px", marginBottom: "6px" }, children: "SYSTEM FAILURE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.5rem", color: "#fff", fontFamily: '"Orbitron", monospace', margin: "0 0 12px 0" }, children: "MISSION OVER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.2rem", marginBottom: "24px", color: "#94a3b8", fontFamily: "monospace" }, children: [
          "Final Score: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#00f0ff" }, children: score.toLocaleString() })
        ] }),
        !hasRevived && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowSponsorModal(true),
            style: {
              marginBottom: "16px",
              padding: "12px 28px",
              background: "rgba(0, 255, 136, 0.12)",
              border: "1.5px solid #00ff88",
              borderRadius: "12px",
              color: "#00ff88",
              fontWeight: "900",
              fontFamily: '"Orbitron", monospace',
              fontSize: "0.78rem",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.25)",
              letterSpacing: "1px"
            },
            children: "SECOND CHANCE REVIVE (+2 LIVES)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RewardedSponsorModal,
          {
            isOpen: showSponsorModal,
            onClose: () => setShowSponsorModal(false),
            rewardTitle: "2 EXTRA LIVES REVIVE",
            rewardIcon: "❤️",
            rewardDescription: "Watch the brief sponsor spot to restore hull integrity and resume battle!",
            onRewarded: () => {
              setHasRevived(true);
              setGameOver(false);
              setGameActive(true);
              gameActiveRef.current = true;
              setLives(2);
              gameState.current.invincible = 90;
              gameState.current.animationId = requestAnimationFrame(gameLoop);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              marginBottom: "12px",
              padding: "14px 40px",
              background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#000",
              fontWeight: "900",
              fontFamily: '"Orbitron", monospace',
              letterSpacing: "1px"
            },
            children: "RETRY MISSION"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#64748b", textDecoration: "none", fontSize: "0.85rem", marginTop: "8px", fontFamily: '"Inter", sans-serif' }, children: "← Return to Arcade Hub" })
      ] }),
      gameWon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(5, 7, 17, 0.94)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "#00ffaa", fontFamily: '"Orbitron", monospace', letterSpacing: "2px", marginBottom: "6px" }, children: "SECTOR SECURED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.5rem", color: "#fff", fontFamily: '"Orbitron", monospace', margin: "0 0 16px 0" }, children: "VICTORY!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              marginBottom: "12px",
              padding: "14px 40px",
              background: "#ffd700",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: "900",
              fontFamily: '"Orbitron", monospace'
            },
            children: "DEFEND NEXT SECTOR"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }, children: "← Exit to Hub" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "16px",
      display: "flex",
      gap: "24px",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: "480px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "14px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: moveLeft,
            style: {
              width: "64px",
              height: "64px",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              borderRadius: "16px",
              color: "#00f0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: moveRight,
            style: {
              width: "64px",
              height: "64px",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              borderRadius: "16px",
              color: "#00f0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 18 15 12 9 6" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: fire,
          style: {
            width: "74px",
            height: "74px",
            background: "linear-gradient(135deg, rgba(255, 0, 85, 0.25) 0%, rgba(255, 85, 0, 0.35) 100%)",
            backdropFilter: "blur(12px)",
            border: "2px solid #ff0055",
            borderRadius: "50%",
            color: "#ff0055",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(255, 0, 85, 0.4)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "22", y1: "12", x2: "18", y2: "12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "12", x2: "2", y2: "12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "6", x2: "12", y2: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "22", x2: "12", y2: "18" })
          ] })
        }
      )
    ] })
  ] });
};
export {
  GalaxyDefender as default
};
