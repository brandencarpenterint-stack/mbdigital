import { b as useGamification, r as reactExports, z as useSearchParams, u as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-I_jIDthF.js";
import { feedService } from "./feed-BTU08FQT.js";
const GAME_WIDTH = 480;
const GAME_HEIGHT = 800;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 24;
const BRICK_COLS = 10;
const BALL_ASSETS = [
  "/assets/neon_brick/ball1.png",
  "/assets/neon_brick/ball2.png",
  "/assets/neon_brick/ball3.png",
  "/assets/neon_brick/ball4.png"
];
const NeonBrickBreaker = () => {
  const { updateStat, incrementStat, shopState, addCoins, coins, spendCoins, buyItem, equipItem, userProfile, stats } = useGamification() || { updateStat: () => {
  }, incrementStat: () => {
  }, shopState: { unlocked: [], equipped: {} } };
  const canvasRef = reactExports.useRef(null);
  const [searchParams] = useSearchParams();
  const isCustomMode = searchParams.get("mode") === "custom";
  const [isShopOpen, setIsShopOpen] = reactExports.useState(false);
  const BRICK_SHOP_ITEMS = [
    { id: "paddle_default", name: "NEON GREEN", type: "paddle", price: 0, category: "brick" },
    { id: "paddle_flame", name: "INFERNO", type: "paddle", price: 500, category: "brick", color: "#ff4500" },
    { id: "paddle_ice", name: "FROSTBITE", type: "paddle", price: 800, category: "brick", color: "#00bfff" },
    { id: "paddle_laser", name: "CYBER PUNK", type: "paddle", price: 1500, category: "brick", color: "#00ff00" },
    { id: "paddle_shadow", name: "VOID WALKER", type: "paddle", price: 3e3, category: "brick", color: "#4b0082" },
    { id: "ball_std", name: "STANDARD", type: "ball", price: 0, category: "brick_ball" },
    { id: "ball_fire", name: "METEOR", type: "ball", price: 2e3, category: "brick_ball" },
    { id: "ball_eye", name: "ALL-SEEING", type: "ball", price: 5e3, category: "brick_ball" }
  ];
  const handleBuyOrEquip = (item) => {
    if (shopState.unlocked.includes(item.id)) {
      equipItem(item.category, item.id);
      playCollect();
    } else {
      const success = buyItem({
        id: item.id,
        name: item.name,
        price: item.price,
        type: "permanent"
        // or whatever context expects, actually context just checks id presence
      });
      if (success) {
        equipItem(item.category, item.id);
      } else {
        playCrash();
      }
    }
  };
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("brickHighScore")) || 0);
  shopState?.equipped?.brick || "paddle_default";
  const [level, setLevel] = reactExports.useState(1);
  const [lives, setLives] = reactExports.useState(3);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [shake, setShake] = reactExports.useState({ x: 0, y: 0 });
  const gameActiveRef = reactExports.useRef(false);
  const ballImages = reactExports.useRef([]);
  const shakeTimeoutRef = reactExports.useRef(null);
  const nextLevelTimeoutRef = reactExports.useRef(null);
  const levelRef = reactExports.useRef(1);
  const { playBeep, playCrash, playCollect, playWin } = useRetroSound();
  const gameState = reactExports.useRef({
    paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    balls: [],
    bricks: [],
    powerups: [],
    particles: [],
    animationId: null,
    shakeTime: 0
  });
  reactExports.useEffect(() => {
    BALL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
      ballImages.current.push(img);
    });
    return () => {
      if (gameState.current.animationId) cancelAnimationFrame(gameState.current.animationId);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      if (nextLevelTimeoutRef.current) clearTimeout(nextLevelTimeoutRef.current);
      gameActiveRef.current = false;
    };
  }, []);
  const generateLevel = (lvl) => {
    const bricks = [];
    const brickWidth = GAME_WIDTH / BRICK_COLS;
    const brickHeight = 25;
    const addBrick = (c, r, color, hp = 1, type = "normal") => {
      bricks.push({
        x: c * brickWidth,
        y: r * brickHeight + 80,
        // More Top padding
        width: brickWidth - 4,
        height: brickHeight - 4,
        active: true,
        color: color || `hsl(${c * 40 + r * 20}, 100%, 50%)`,
        value: 10 * hp,
        hp,
        maxHp: hp,
        type
        // 'normal', 'steel'
      });
    };
    const drawMap = (map, colorFn) => {
      map.forEach((rowStr, r) => {
        const row = rowStr.split("");
        row.forEach((char, c) => {
          if (char === " ") return;
          if (char === "S") addBrick(c, r, "#aaa", 999, "steel");
          else {
            const style = colorFn(char, c, r);
            addBrick(c, r, style.color, style.hp || 1);
          }
        });
      });
    };
    if (lvl === "custom") {
      const customData = JSON.parse(localStorage.getItem("merchboy_custom_brick"));
      if (customData) {
        customData.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell) {
              if (cell.type === "steel") addBrick(c, r, "#aaa", 999, "steel");
              else addBrick(c, r, cell.color || "#fff", 1);
            }
          });
        });
      } else {
        for (let r = 0; r < 5; r++) for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, null, 1);
      }
      return bricks;
    }
    if (lvl === 1) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, null, 1);
      }
    } else if (lvl === 2) {
      for (let r = 0; r < 14; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          if ((r + c) % 2 === 0) addBrick(c, r, "#ff0055", 1);
          else addBrick(c, r, "#00ff00", 1);
        }
      }
    } else if (lvl === 3) {
      const map = [
        "  XX   XX ",
        "   X   X  ",
        "  XXXXXXX ",
        " XX XXX XX",
        "XXXXXXXXXX",
        "X SXXXXS X",
        "X X     X X",
        "   XX XX   "
      ];
      drawMap(map, (char) => {
        if (char === "S") return { color: "#aaa", hp: 999 };
        return { color: "#76ff03", hp: 2 };
      });
    } else if (lvl === 4) {
      for (let r = 0; r < 16; r += 2) {
        for (let c = r % 4 === 0 ? 0 : 1; c < BRICK_COLS; c += 2) {
          addBrick(c, r, "#76ff03", r < 6 ? 2 : 1);
        }
      }
    } else if (lvl === 5) {
      const map = [
        "   XXXX   ",
        " XXXXXXXX ",
        "XXXXXXXXXX",
        "XX O  O XX",
        "XXXXXXXXXX",
        " XXXXXXXX ",
        "  XX  XX  ",
        "  XX  XX  ",
        "  XX  XX  "
      ];
      drawMap(map, (char) => char === "O" ? { color: "#000", hp: 1 } : { color: "#fff", hp: 3 });
    } else if (lvl === 6) {
      for (let r = 0; r < 12; r++) {
        if (r % 3 === 0) {
          for (let c = 0; c < BRICK_COLS; c++) {
            if (c % 2 === 0) addBrick(c, r, "#aaa", 999, "steel");
          }
        } else {
          for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, "#00bfff", 1);
        }
      }
    } else {
      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          if (Math.random() > 0.3) {
            const hp = Math.floor(Math.random() * 3) + 1;
            addBrick(c, r, `hsl(${Math.random() * 360}, 100%, 50%)`, hp);
          }
        }
      }
    }
    return bricks;
  };
  const triggerShake = (amount = 5) => {
    if (gameState.current.shakeTime <= 0) {
      gameState.current.shakeTime = 10;
    }
    setShake({ x: (Math.random() - 0.5) * amount, y: (Math.random() - 0.5) * amount });
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setShake({ x: 0, y: 0 }), 100);
  };
  const startLevel = (lvl) => {
    setLevel(lvl);
    levelRef.current = lvl;
    const speedBase = 6 + lvl * 0.8;
    const newBalls = [];
    const ballCount = 3;
    for (let i = 0; i < ballCount; i++) {
      newBalls.push({
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT - 60,
        dx: speedBase * (Math.random() > 0.5 ? 1 : -1) * (1 + i * 0.2),
        // Slight variation
        dy: -speedBase,
        rot: 0,
        imgIndex: Math.floor(Math.random() * 4)
      });
    }
    gameState.current.balls = newBalls;
    gameState.current.bricks = generateLevel(lvl);
    gameState.current.paddleX = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    gameState.current.powerups = [];
    gameState.current.particles = [];
    gameState.current.transitioning = false;
    setGameActive(true);
    gameActiveRef.current = true;
    if (lvl === 5) {
      incrementStat("brickMaxLevel", 5);
    } else if (lvl > 1) {
      updateStat("brickMaxLevel", (prev) => Math.max(prev, lvl));
    }
  };
  const startGame = (mode = 1) => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    startLevel(mode);
    requestAnimationFrame(gameLoop);
  };
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      gameState.current.particles.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 8,
        dy: (Math.random() - 0.5) * 8,
        life: 1,
        color
      });
    }
  };
  const activateMultiball = () => {
    const paddleCenter = gameState.current.paddleX + PADDLE_WIDTH / 2;
    for (let i = 0; i < 4; i++) {
      gameState.current.balls.push({
        x: paddleCenter,
        y: GAME_HEIGHT - 60,
        dx: (Math.random() - 0.5) * 6,
        // Spread out
        dy: -Math.abs(Math.random() * 2 + 4),
        // Go Up
        rot: 0,
        imgIndex: i
        // Force different face
      });
    }
    playWin();
    triggerConfetti();
  };
  const endGame = (win) => {
    setGameActive(false);
    gameActiveRef.current = false;
    setGameOver(true);
    cancelAnimationFrame(gameState.current.animationId);
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("brickHighScore", score);
      if (score > 100) {
        const playerName = userProfile?.name || "Breaker";
        feedService.publish(`smashed a new High Score: ${score} in Neon Bricks 🧱`, "win", playerName);
      }
    }
    if (addCoins) addCoins(Math.floor(score / 5));
    if (updateStat) updateStat("gamesPlayed", "neon_brick");
  };
  const gameLoop = () => {
    if (!gameActiveRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = gameState.current;
    if (!state.transitioning) {
      const { balls, paddleX } = state;
      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.rot += 5e-3;
        if (ball.x + BALL_SIZE > GAME_WIDTH || ball.x < 0) {
          ball.dx = -ball.dx;
          playBeep();
        }
        if (ball.y < 0) {
          ball.dy = -ball.dy;
          playBeep();
        }
        if (ball.y + BALL_SIZE > GAME_HEIGHT - PADDLE_HEIGHT - 10 && ball.x + BALL_SIZE > paddleX && ball.x < paddleX + PADDLE_WIDTH) {
          const hitPoint = ball.x - (paddleX + PADDLE_WIDTH / 2);
          ball.dx = hitPoint * 0.2;
          ball.dy = -Math.abs(ball.dy);
          playBeep();
          if (navigator.vibrate) navigator.vibrate(15);
          const MAX_SPEED_Y = 18;
          if (Math.abs(ball.dy) < MAX_SPEED_Y) {
            ball.dy *= 1.02;
            ball.dx *= 1.02;
          }
        }
        if (ball.y > GAME_HEIGHT) {
          balls.splice(i, 1);
          triggerShake(10);
          playCrash();
        }
      }
      if (balls.length === 0) {
        if (lives > 1) {
          setLives((l) => l - 1);
          state.balls.push({
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 40,
            dx: 4 * (Math.random() > 0.5 ? 1 : -1),
            dy: -4,
            rot: 0,
            imgIndex: Math.floor(Math.random() * 4)
          });
        } else {
          endGame();
          return;
        }
      }
      let activeBricks = 0;
      state.bricks.forEach((brick) => {
        if (!brick.active) return;
        if (brick.type !== "steel") activeBricks++;
        state.balls.forEach((ball) => {
          if (ball.x < brick.x + brick.width && ball.x + BALL_SIZE > brick.x && ball.y < brick.y + brick.height && ball.y + BALL_SIZE > brick.y) {
            ball.dy = -ball.dy;
            if (brick.type === "steel") {
              playBeep();
              triggerShake(2);
              return;
            }
            brick.hp -= 1;
            if (brick.hp <= 0) {
              brick.active = false;
              setScore((prev) => prev + brick.value);
              playCollect();
              spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
              triggerShake(3);
              if (Math.random() < 0.15) {
                state.powerups.push({ x: brick.x + brick.width / 2, y: brick.y, type: "multiball" });
              }
            } else {
              playBeep();
              brick.color = "white";
              setTimeout(() => brick.color = brick.color, 50);
            }
          }
        });
      });
      if (activeBricks === 0 && !gameState.current.transitioning) {
        gameState.current.transitioning = true;
        triggerConfetti();
        playWin();
        setTimeout(() => {
          startLevel(levelRef.current + 1);
          gameState.current.transitioning = false;
        }, 1e3);
      }
      if (gameState.current.transitioning) {
        state.balls.forEach((b) => {
          b.x += 0;
          b.y += 0;
        });
      }
      for (let i = state.powerups.length - 1; i >= 0; i--) {
        const p = state.powerups[i];
        p.y += 3;
        if (p.y > GAME_HEIGHT - PADDLE_HEIGHT - 10 && p.y < GAME_HEIGHT - 10 && p.x > state.paddleX && p.x < state.paddleX + PADDLE_WIDTH) {
          if (p.type === "multiball") activateMultiball();
          state.powerups.splice(i, 1);
        } else if (p.y > GAME_HEIGHT) {
          state.powerups.splice(i, 1);
        }
      }
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 0.04;
        if (p.life <= 0) state.particles.splice(i, 1);
      }
    }
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.save();
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 5, 5);
    });
    ctx.globalAlpha = 1;
    state.bricks.forEach((brick) => {
      if (brick.active) {
        if (brick.type === "steel") ctx.fillStyle = "#888";
        else {
          ctx.fillStyle = brick.color;
          if (brick.hp < brick.maxHp) ctx.globalAlpha = 0.5 + 0.5 * (brick.hp / brick.maxHp);
        }
        ctx.shadowBlur = 10;
        ctx.shadowColor = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        if (brick.hp > 1 && brick.type !== "steel") {
          ctx.fillStyle = "white";
          ctx.font = "10px Arial";
          ctx.fillText(brick.hp, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
        }
      }
    });
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    state.powerups.forEach((p) => ctx.fillText("⚡", p.x, p.y));
    const currentSkin2 = shopState?.equipped?.brick || "paddle_default";
    let paddleColor2 = "#00ffaa";
    let paddleGlow2 = "#00ffaa";
    if (currentSkin2 === "paddle_flame") {
      paddleColor2 = "#ff4500";
      paddleGlow2 = "#ff8c00";
    } else if (currentSkin2 === "paddle_ice") {
      paddleColor2 = "#00bfff";
      paddleGlow2 = "#e0ffff";
    } else if (currentSkin2 === "paddle_laser") {
      paddleColor2 = "#00ff00";
      paddleGlow2 = "#00ffff";
    }
    ctx.fillStyle = paddleColor2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = paddleGlow2;
    ctx.fillRect(state.paddleX, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
    if (currentSkin2 === "paddle_flame") {
      ctx.fillStyle = "yellow";
      ctx.fillRect(state.paddleX + 10, GAME_HEIGHT - PADDLE_HEIGHT - 5, PADDLE_WIDTH - 20, 2);
    }
    ctx.shadowBlur = 0;
    const currentBall = shopState?.equipped?.brick_ball || "ball_std";
    state.balls.forEach((ball) => {
      ctx.save();
      ctx.translate(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2);
      ctx.rotate(ball.rot);
      if (currentBall === "ball_eye") {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#00aaff";
        ctx.beginPath();
        ctx.arc(0, 0, BALL_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(0, 0, BALL_SIZE / 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentBall === "ball_fire") {
        ctx.fillStyle = "#ff4500";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "orange";
        ctx.beginPath();
        ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        if (Math.random() > 0.5) spawnParticles(ball.x, ball.y + 10, "orange");
      } else {
        const img = ballImages.current[ball.imgIndex % ballImages.current.length];
        if (img && img.complete) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255,255,255,0.5)";
          ctx.drawImage(img, -BALL_SIZE / 2, -BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });
    ctx.restore();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  reactExports.useEffect(() => {
    const handleInput = (clientX) => {
      if (!gameActiveRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = GAME_WIDTH / rect.width;
      const relativeX = (clientX - rect.left) * scaleX;
      gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2));
    };
    const onMouseMove = (e) => {
      handleInput(e.clientX);
    };
    const onKeyDown = (e) => {
      if (!gameActiveRef.current) return;
      const SPEED = 40;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameState.current.paddleX = Math.max(0, gameState.current.paddleX - SPEED);
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameState.current.paddleX = Math.min(GAME_WIDTH - PADDLE_WIDTH, gameState.current.paddleX + SPEED);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "#050505",
        touchAction: "none",
        // Critical for preventing scroll while playing
        overflow: "hidden",
        cursor: gameActive ? "none" : "default",
        // Hide cursor while playing!
        fontFamily: '"Orbitron", sans-serif'
      },
      onTouchMove: (e) => {
        if (gameActive) {
          const rect = canvasRef.current.getBoundingClientRect();
          const scaleX = GAME_WIDTH / rect.width;
          const relativeX = (e.touches[0].clientX - rect.left) * scaleX;
          gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2));
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .shop-panel {
                    position: fixed;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    width: 300px;
                    background: rgba(10, 10, 15, 0.95);
                    border-left: 2px solid var(--neon-blue);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 100;
                    padding: 20px;
                    color: white;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .shop-panel.open {
                    transform: translateX(0);
                }
                .shop-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 10px;
                    padding: 15px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .shop-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .shop-item.equipped {
                    border-color: var(--neon-green);
                    background: rgba(0, 255, 0, 0.05);
                }
                .shop-toggle-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 90;
                    background: var(--neon-pink);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                    box-shadow: 0 0 20px var(--neon-pink);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                .shop-toggle-btn:hover {
                    transform: scale(1.1);
                }
                @media(max-width: 600px) {
                    .shop-panel {
                        top: auto;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        height: 50vh;
                        border-left: none;
                        border-top: 2px solid var(--neon-blue);
                        transform: translateY(100%);
                    }
                    .shop-panel.open {
                        transform: translateY(0);
                    }
                }
            ` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #000 100%)",
          zIndex: -1
        } }),
        !gameActive && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "shop-toggle-btn", onClick: () => setIsShopOpen(!isShopOpen), children: "🛒" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `shop-panel ${isShopOpen ? "open" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "var(--neon-blue)" }, children: "ARMORY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsShopOpen(false), style: { background: "none", border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer" }, children: "×" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px", padding: "10px", background: "#000", borderRadius: "8px", textAlign: "center", color: "gold", fontWeight: "bold" }, children: [
            "BALANCE: $",
            coins
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { borderBottom: "1px solid #333", paddingBottom: "5px", color: "#888" }, children: "PADDLES" }),
          BRICK_SHOP_ITEMS.filter((i) => i.type === "paddle").map((item) => {
            const isUnlocked = shopState.unlocked.includes(item.id);
            const isEquipped = shopState.equipped.brick === item.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `shop-item ${isEquipped ? "equipped" : ""}`, onClick: () => handleBuyOrEquip(item), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: item.color || "white" }, children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: isUnlocked ? isEquipped ? "EQUIPPED" : "OWNED" : `${item.price}` })
              ] }),
              isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: isEquipped ? "✅" : "🛡️" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: "🔒" })
            ] }, item.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { borderBottom: "1px solid #333", paddingBottom: "5px", color: "#888", marginTop: "20px" }, children: "BALLS" }),
          BRICK_SHOP_ITEMS.filter((i) => i.type === "ball").map((item) => {
            const isUnlocked = shopState.unlocked.includes(item.id);
            const isEquipped = shopState.equipped.brick_ball === item.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `shop-item ${isEquipped ? "equipped" : ""}`, onClick: () => handleBuyOrEquip(item), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: isUnlocked ? isEquipped ? "EQUIPPED" : "OWNED" : `${item.price}` })
              ] }),
              isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: isEquipped ? "✅" : "🔮" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: "🔒" })
            ] }, item.id);
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: 10,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 30px",
          color: "var(--neon-pink)",
          fontSize: "1.2rem",
          zIndex: 10,
          textShadow: "0 0 10px var(--neon-pink)",
          fontWeight: "bold"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "SCORE: ",
            score
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "white" }, children: [
            "LVL ",
            level
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-green)" }, children: [
            "LIVES: ",
            lives
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          transform: `translate(${shake.x}px, ${shake.y}px)`,
          transition: "transform 0.05s"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "relative",
          boxShadow: "0 0 50px rgba(255, 0, 85, 0.2)",
          border: "2px solid var(--neon-blue)",
          borderRadius: "8px",
          background: "#000"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              style: {
                display: "block",
                maxWidth: "95vw",
                maxHeight: "85vh",
                aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
                width: "auto",
                height: "auto"
              }
            }
          ),
          !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: {
              color: "var(--neon-pink)",
              fontSize: "4rem",
              textAlign: "center",
              textShadow: "0 0 30px var(--neon-pink)",
              lineHeight: "1",
              marginBottom: "2rem",
              letterSpacing: "4px"
            }, children: [
              "NEON",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "BRICKS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => startGame(1), style: {
              padding: "15px 50px",
              fontSize: "1.5rem",
              background: "var(--neon-green)",
              color: "black",
              border: "none",
              fontWeight: "900",
              boxShadow: "0 0 20px var(--neon-green)"
            }, children: "PLAY ARCADE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/brick-maker", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "10px", background: "#333", color: "white", border: "1px solid #555", cursor: "pointer", fontFamily: "inherit" }, children: "🛠️ LEVEL EDITOR" }) }),
              localStorage.getItem("merchboy_custom_brick") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startGame("custom"), style: { padding: "10px", background: "var(--neon-blue)", color: "black", border: "none", cursor: "pointer", fontWeight: "bold", fontFamily: "inherit" }, children: "▶️ PLAY CUSTOM" })
            ] }),
            isCustomMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", color: "var(--neon-blue)", fontSize: "0.8rem" }, children: "TESTING CUSTOM LEVEL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginTop: "20px", color: "#888", fontSize: "0.8rem", letterSpacing: "2px" }, children: "MOUSE / TOUCH TO MOVE" })
          ] }),
          gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3.5rem", color: "#ff0055", textShadow: "0 0 20px red", marginBottom: "10px" }, children: "GAME OVER" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", color: "white", marginBottom: "30px" }, children: [
              "FINAL SCORE: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-green)" }, children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => startGame(String(levelRef.current) === "custom" ? "custom" : 1), style: { background: "var(--neon-blue)", color: "black", fontWeight: "bold" }, children: "RETRY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { background: "#333", color: "#fff" }, children: "EXIT" }) })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};
export {
  NeonBrickBreaker as default
};
