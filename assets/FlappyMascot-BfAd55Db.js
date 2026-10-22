import { r as reactExports, a as useGamification, u as useRetroSound, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-BAs_s9C_.js";
import { R as RewardedSponsorModal } from "./RewardedSponsorModal-DEzaRV1i.js";
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -7.2;
const BASE_PIPE_SPEED = 3;
const PIPE_SPACING = 250;
const BIRD_SIZE = 40;
const CHARACTERS = [
  { id: "flappy_boy", type: "image", content: "/assets/skins/face_default.png", name: "Classic" },
  { id: "flappy_face_bear", type: "image", content: "/assets/skins/face_bear.png", name: "Bear" },
  { id: "flappy_face_bunny", type: "image", content: "/assets/skins/face_bunny.png", name: "Bunny" },
  { id: "flappy_cat", type: "image", content: "/assets/skins/face_cat.png", name: "Kitty" },
  { id: "flappy_frog", type: "image", content: "/assets/skins/face_frog.png", name: "Froggo" },
  { id: "flappy_rainbow", type: "image", content: "/assets/skins/face_rainbow.png", name: "Pride" },
  { id: "flappy_alien", type: "image", content: "/assets/skins/face_astro.png", name: "Paul" },
  { id: "flappy_brokid", type: "image", content: "/assets/brokid-logo.png", name: "BroKid" },
  { id: "flappy_monster", type: "image", content: "/assets/skins/face_dino.png", name: "8-Bit" },
  { id: "flappy_diamond", type: "image", content: "/assets/skins/face_star.png", name: "Richie" },
  { id: "flappy_cowboy", type: "image", content: "/assets/skins/face_pumpkin.png", name: "Sheriff" },
  { id: "flappy_robot", type: "image", content: "/assets/skins/face_gamer.png", name: "BeepBoop" },
  { id: "flappy_ghost", type: "image", content: "/assets/skins/face_space.png", name: "Spooky" }
];
const SKYLINE_BUILDINGS = [
  { w: 42, h: 140 },
  { w: 28, h: 210 },
  { w: 52, h: 120 },
  { w: 38, h: 175 },
  { w: 48, h: 230 },
  { w: 32, h: 145 },
  { w: 56, h: 190 },
  { w: 44, h: 160 },
  { w: 48, h: 200 },
  { w: 30, h: 135 },
  { w: 54, h: 220 },
  { w: 40, h: 170 }
];
const SKYLINE_TOTAL_WIDTH = SKYLINE_BUILDINGS.reduce((sum, b) => sum + b.w, 0);
const FlappyMascot = () => {
  const canvasRef = reactExports.useRef(null);
  const { shopState, updateStat, incrementStat, equipItem, addCoins, userProfile, stats, coins, consumeItem } = useGamification() || {};
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("flappyHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [hasRevived, setHasRevived] = reactExports.useState(false);
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  const [scoreScale, setScoreScale] = reactExports.useState(1);
  reactExports.useEffect(() => {
    if (stats?.flappyHighScore > highScore) {
      setHighScore(stats.flappyHighScore);
    }
  }, [stats]);
  const selectedId = shopState?.equipped?.flappy || "flappy_boy";
  const gameActiveRef = reactExports.useRef(false);
  const { playJump, playCrash, playCollect, playBeep } = useRetroSound();
  const birdImgRef = reactExports.useRef(null);
  const brokidImgRef = reactExports.useRef(null);
  const moneyImgRef = reactExports.useRef(null);
  const bearImgRef = reactExports.useRef(null);
  const bunnyImgRef = reactExports.useRef(null);
  const gameState = reactExports.useRef({
    birdY: GAME_HEIGHT / 2,
    velocity: 0,
    pipes: [],
    particles: [],
    floatingTexts: [],
    shake: 0,
    slowMoFrames: 0,
    skylineOffset: 0,
    gridOffset: 0,
    lastTime: 0,
    animationId: null
  });
  reactExports.useEffect(() => {
    const img1 = new Image();
    img1.src = "/assets/merchboy_face.png";
    birdImgRef.current = img1;
    const img2 = new Image();
    img2.src = "/assets/brokid-logo.png";
    brokidImgRef.current = img2;
    const img3 = new Image();
    img3.src = "/assets/skins/face_money.png";
    moneyImgRef.current = img3;
    const img4 = new Image();
    img4.src = "/assets/skins/face_bear.png";
    bearImgRef.current = img4;
    const img5 = new Image();
    img5.src = "/assets/skins/face_bunny.png";
    bunnyImgRef.current = img5;
    const faces = ["merchboy_face.png", "merchboy_money.png", "merchboy_cat.png", "merchboy_bunny.png"];
    faces.forEach((f) => {
      const img = new Image();
      img.src = "/assets/" + f;
    });
  }, []);
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameActive(true);
    setHasRevived(false);
    gameActiveRef.current = true;
    gameState.current = {
      birdY: GAME_HEIGHT / 2,
      velocity: 0,
      pipes: [{ x: GAME_WIDTH + 60, topHeight: 180, nearMissTriggered: false, passed: false }],
      particles: [],
      floatingTexts: [],
      shake: 0,
      slowMoFrames: 0,
      skylineOffset: 0,
      gridOffset: 0,
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
    gameState.current.shake = 22;
    if (navigator.vibrate) navigator.vibrate([50, 40, 90]);
    const birdX = 50 + BIRD_SIZE / 2;
    const birdY = gameState.current.birdY + BIRD_SIZE / 2;
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      gameState.current.particles.push({
        x: birdX,
        y: birdY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: ["#ff0055", "#00f0ff", "#ffd700", "#ffffff"][Math.floor(Math.random() * 4)],
        alpha: 1,
        decay: 0.03
      });
    }
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("flappyHighScore", score);
      triggerConfetti();
      if (score > 10) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`is flying high! Score: ${score} in FlappyBro 🦅`, "win", playerName);
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
    let speedMultiplier = 1;
    if (state.slowMoFrames > 0) {
      speedMultiplier = 0.45;
      state.slowMoFrames--;
    }
    const currentPipeSpeed = BASE_PIPE_SPEED * speedMultiplier;
    ctx.save();
    if (state.shake > 0) {
      const shakeX = (Math.random() - 0.5) * state.shake;
      const shakeY = (Math.random() - 0.5) * state.shake;
      ctx.translate(shakeX, shakeY);
      state.shake *= 0.88;
      if (state.shake < 0.5) state.shake = 0;
    }
    const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    bgGrad.addColorStop(0, "#080314");
    bgGrad.addColorStop(0.45, "#1e0c2f");
    bgGrad.addColorStop(0.72, "#50143c");
    bgGrad.addColorStop(0.92, "#ff3366");
    bgGrad.addColorStop(1, "#ff9900");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const sunX = GAME_WIDTH / 2;
    const sunY = GAME_HEIGHT * 0.72;
    const sunRad = 68;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRad);
    sunGrad.addColorStop(0, "#fff685");
    sunGrad.addColorStop(0.6, "#ff007f");
    sunGrad.addColorStop(1, "rgba(255, 0, 127, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e0c2f";
    for (let bandY = sunY - 15; bandY < sunY + sunRad; bandY += 10) {
      const thickness = Math.min(5, (bandY - (sunY - 20)) * 0.12 + 1);
      ctx.fillRect(sunX - sunRad, bandY, sunRad * 2, thickness);
    }
    state.skylineOffset = (state.skylineOffset + currentPipeSpeed * 0.35) % SKYLINE_TOTAL_WIDTH;
    ctx.fillStyle = "rgba(18, 8, 30, 0.92)";
    let currX = -state.skylineOffset;
    while (currX < GAME_WIDTH + 60) {
      for (let i = 0; i < SKYLINE_BUILDINGS.length; i++) {
        const b = SKYLINE_BUILDINGS[i];
        const bY = GAME_HEIGHT - 35 - b.h;
        ctx.fillRect(currX, bY, b.w, b.h);
        ctx.fillStyle = i % 3 === 0 ? "rgba(0, 240, 255, 0.6)" : "rgba(255, 0, 127, 0.5)";
        for (let wy = bY + 12; wy < bY + b.h - 15; wy += 22) {
          if (wy % 2 === 0) {
            ctx.fillRect(currX + 8, wy, 4, 6);
            ctx.fillRect(currX + b.w - 12, wy, 4, 6);
          }
        }
        ctx.fillStyle = "rgba(18, 8, 30, 0.92)";
        currX += b.w;
      }
    }
    state.gridOffset = (state.gridOffset + currentPipeSpeed) % 40;
    const floorY = GAME_HEIGHT - 35;
    ctx.fillStyle = "#0a0512";
    ctx.fillRect(0, floorY, GAME_WIDTH, 35);
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(GAME_WIDTH, floorY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    ctx.lineWidth = 1.5;
    for (let gx = -state.gridOffset; gx < GAME_WIDTH + 40; gx += 40) {
      ctx.beginPath();
      ctx.moveTo(gx, floorY);
      ctx.lineTo(gx - 20, GAME_HEIGHT);
      ctx.stroke();
    }
    state.velocity += GRAVITY * speedMultiplier;
    state.birdY += state.velocity * speedMultiplier;
    if (state.birdY > floorY - BIRD_SIZE || state.birdY < 0) {
      endGame();
      ctx.restore();
      return;
    }
    state.pipes.forEach((pipe) => {
      pipe.x -= currentPipeSpeed;
    });
    if (state.pipes[state.pipes.length - 1].x < GAME_WIDTH - PIPE_SPACING) {
      const minHeight = 60;
      const maxHeight = GAME_HEIGHT - 240 - minHeight;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      state.pipes.push({ x: GAME_WIDTH, topHeight: height, nearMissTriggered: false, passed: false });
    }
    if (state.pipes[0].x < -70) {
      state.pipes.shift();
    }
    const birdX = 50;
    const birdY = state.birdY;
    state.pipes.forEach((pipe) => {
      const pipeW = 64;
      const bottomY = pipe.topHeight + 215;
      const isNearX = birdX + BIRD_SIZE > pipe.x && birdX < pipe.x + pipeW;
      if (!pipe.passed && birdX > pipe.x + pipeW) {
        pipe.passed = true;
        setScore((prev) => prev + 1);
        playCollect();
        setScoreScale(1.3);
        setTimeout(() => setScoreScale(1), 180);
        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: birdX + BIRD_SIZE / 2,
            y: birdY,
            vx: (Math.random() - 0.5) * 4,
            vy: -2 - Math.random() * 3,
            size: 3 + Math.random() * 3,
            color: "#ffd700",
            alpha: 1,
            decay: 0.04
          });
        }
      }
      if (isNearX && !pipe.nearMissTriggered) {
        const distTop = birdY - pipe.topHeight;
        const distBottom = bottomY - (birdY + BIRD_SIZE);
        if (distTop > 0 && distTop < 18 || distBottom > 0 && distBottom < 18) {
          pipe.nearMissTriggered = true;
          state.slowMoFrames = 12;
          state.floatingTexts.push({
            text: "⚡ CLOSE SHAVE! +100 CP",
            x: birdX - 30,
            y: birdY - 32,
            life: 38,
            maxLife: 38,
            color: "#ffd700",
            size: 13
          });
          if (addCoins) addCoins(100);
          playBeep?.();
          if (navigator.vibrate) navigator.vibrate(35);
        }
      }
      if (isNearX) {
        if (birdY < pipe.topHeight || birdY + BIRD_SIZE > bottomY) {
          endGame();
        }
      }
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
      topGrad.addColorStop(0, "#0c1b26");
      topGrad.addColorStop(0.4, "#00f0ff");
      topGrad.addColorStop(0.7, "#073247");
      topGrad.addColorStop(1, "#05121b");
      ctx.fillStyle = topGrad;
      ctx.fillRect(pipe.x, 0, pipeW, pipe.topHeight);
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, pipeW, pipe.topHeight);
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 12;
      ctx.fillRect(pipe.x - 4, pipe.topHeight - 22, pipeW + 8, 22);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x - 4, pipe.topHeight - 22, pipeW + 8, 22);
      ctx.fillStyle = "#000";
      ctx.fillRect(pipe.x + 8, pipe.topHeight - 12, pipeW - 16, 3);
      const bottomGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
      bottomGrad.addColorStop(0, "#0c1b26");
      bottomGrad.addColorStop(0.4, "#ff007f");
      bottomGrad.addColorStop(0.7, "#420a23");
      bottomGrad.addColorStop(1, "#05121b");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(pipe.x, bottomY, pipeW, floorY - bottomY);
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, bottomY, pipeW, floorY - bottomY);
      ctx.fillStyle = "#ff007f";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 12;
      ctx.fillRect(pipe.x - 4, bottomY, pipeW + 8, 22);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x - 4, bottomY, pipeW + 8, 22);
      ctx.fillStyle = "#000";
      ctx.fillRect(pipe.x + 8, bottomY + 9, pipeW - 16, 3);
    });
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
      ft.y -= 0.8;
      ft.life--;
      if (ft.life <= 0) {
        state.floatingTexts.splice(i, 1);
        continue;
      }
      const alpha = ft.life / ft.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${ft.size || 13}px "Orbitron", monospace`;
      ctx.fillStyle = ft.color || "#ffd700";
      ctx.shadowColor = ft.color || "#ffd700";
      ctx.shadowBlur = 10;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
    const charData = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];
    ctx.save();
    ctx.translate(birdX + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);
    let scaleX = 1;
    let scaleY = 1;
    if (state.velocity < -2) {
      scaleX = 0.88;
      scaleY = 1.18;
    } else if (state.velocity > 3) {
      scaleX = 1.12;
      scaleY = 0.9;
    }
    ctx.scale(scaleX, scaleY);
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.velocity * 0.08));
    ctx.rotate(rotation);
    const flutter = Math.sin(Date.now() / 45) * 0.45;
    const drawWing = (side = "front") => {
      const wingOffset = state.velocity * 0.12 + flutter;
      const flap = side === "back" ? wingOffset * 0.8 : wingOffset;
      ctx.save();
      ctx.translate(-24, 6);
      ctx.rotate(flap);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 1.5;
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawWing("back");
    let img = null;
    if (charData.id === "flappy_boy") img = birdImgRef.current;
    else if (charData.id === "flappy_brokid") img = brokidImgRef.current;
    else if (charData.id === "flappy_face_money") img = moneyImgRef.current;
    else if (charData.id === "flappy_face_bear") img = bearImgRef.current;
    else if (charData.id === "flappy_face_bunny") img = bunnyImgRef.current;
    else img = birdImgRef.current;
    if (img && img.complete) {
      ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    } else {
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    }
    drawWing("front");
    ctx.restore();
    ctx.restore();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const lastJumpRef = reactExports.useRef(0);
  const handleInput = () => {
    if (!gameActiveRef.current) return;
    const now = Date.now();
    if (now - lastJumpRef.current < 140) return;
    lastJumpRef.current = now;
    gameState.current.velocity = JUMP_STRENGTH;
    playJump();
    const birdX = 50;
    const birdY = gameState.current.birdY + BIRD_SIZE / 2;
    for (let i = 0; i < 6; i++) {
      gameState.current.particles.push({
        x: birdX - 5,
        y: birdY + (Math.random() - 0.5) * 10,
        vx: -2 - Math.random() * 3,
        vy: 1 + Math.random() * 2.5,
        size: 3 + Math.random() * 3,
        color: "#00f0ff",
        alpha: 0.9,
        decay: 0.04
      });
    }
    if (navigator.vibrate) navigator.vibrate(12);
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: "16px", left: "16px", zIndex: 100, textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "30px",
      color: "#e2e8f0",
      fontSize: "0.78rem",
      fontFamily: '"Orbitron", monospace',
      letterSpacing: "1px",
      transition: "all 0.2s ease"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ARCADE" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "400px",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#00f0ff", boxShadow: "0 0 8px #00f0ff" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "#fff", letterSpacing: "1px" }, children: "FLAPPY BRO" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          transform: `scale(${scoreScale})`,
          transition: "transform 0.15s ease-out",
          display: "inline-block",
          color: "#00f0ff",
          fontSize: "0.9rem"
        }, children: [
          score,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.65rem", color: "#94a3b8" }, children: "PTS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700", fontSize: "0.85rem" }, children: [
          "🪙 ",
          coins?.toLocaleString() || 0
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          onMouseDown: handleInput,
          onTouchStart: (e) => {
            if (e.cancelable) e.preventDefault();
            handleInput();
          },
          style: {
            border: "3px solid #00f0ff",
            borderRadius: "16px",
            boxShadow: "0 0 35px rgba(0, 240, 255, 0.3), 0 20px 40px rgba(0,0,0,0.8)",
            cursor: "pointer",
            touchAction: "none"
          }
        }
      ),
      !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              padding: "16px 45px",
              fontSize: "1.4rem",
              background: "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontWeight: "900",
              fontFamily: '"Orbitron", monospace',
              boxShadow: "0 0 25px rgba(0, 240, 255, 0.6)"
            },
            children: "FLY! 🦅"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.8rem", marginTop: "12px", fontFamily: "monospace" }, children: "[SPACE] OR TAP SCREEN TO FLAP" })
      ] }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(3, 6, 15, 0.88)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.8rem", color: "#ff0055", fontFamily: '"Orbitron", monospace', margin: "0 0 10px 0", textShadow: "0 0 20px #ff0055" }, children: "GAME OVER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.4rem", marginBottom: "20px", color: "#fff", fontFamily: "monospace" }, children: [
          "Score: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#00f0ff" }, children: score }),
          " | Best: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#ffd700" }, children: highScore })
        ] }),
        shopState?.inventory?.["flappy_shield"] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SquishyButton,
          {
            onClick: () => {
              if (consumeItem("flappy_shield")) {
                setGameOver(false);
                setGameActive(true);
                gameActiveRef.current = true;
                gameState.current.birdY = GAME_HEIGHT / 2;
                gameState.current.velocity = 0;
                gameState.current.pipes.forEach((p) => p.x += 300);
                requestAnimationFrame(gameLoop);
              }
            },
            style: { marginBottom: "12px", padding: "10px 30px", background: "#00f0ff", border: "none", borderRadius: "8px", color: "#000", fontWeight: "bold" },
            children: [
              "🛡️ USE SHIELD (",
              shopState.inventory["flappy_shield"],
              ")"
            ]
          }
        ),
        !hasRevived && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowSponsorModal(true),
            style: {
              marginBottom: "14px",
              padding: "12px 24px",
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 229, 255, 0.25) 100%)",
              border: "1.5px solid #00ff88",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "900",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📺" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FREE REVIVE (WATCH SPOT ❤️)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RewardedSponsorModal,
          {
            isOpen: showSponsorModal,
            onClose: () => setShowSponsorModal(false),
            rewardTitle: "FLAPPY FREE REVIVE",
            rewardIcon: "❤️",
            rewardDescription: "Complete the 10-second sponsor spot to revive and continue flying!",
            onRewarded: () => {
              setHasRevived(true);
              setGameOver(false);
              setGameActive(true);
              gameActiveRef.current = true;
              gameState.current.birdY = GAME_HEIGHT / 2;
              gameState.current.velocity = 0;
              gameState.current.pipes.forEach((p) => p.x += 350);
              requestAnimationFrame(gameLoop);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              marginBottom: "12px",
              padding: "12px 36px",
              background: "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold"
            },
            children: "Try Again"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", marginTop: "6px" }, children: "← Back to Base" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", width: "100%", maxWidth: "400px", overflowX: "auto", paddingBottom: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#94a3b8", textAlign: "center", marginBottom: "8px", fontSize: "0.8rem", fontFamily: "monospace" }, children: "SELECT PILOT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", padding: "0 10px" }, children: CHARACTERS.map((char) => {
        const isSelected = selectedId === char.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              if (equipItem) {
                equipItem("flappy", char.id);
                if (navigator.vibrate) navigator.vibrate(20);
              }
            },
            style: {
              background: isSelected ? "rgba(0, 240, 255, 0.25)" : "rgba(255,255,255,0.06)",
              border: isSelected ? "2px solid #00f0ff" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "8px 12px",
              minWidth: "65px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "all 0.2s ease"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", marginBottom: "4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: char.content, style: { width: "32px", height: "32px", objectFit: "contain" }, alt: char.name }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.68rem", color: isSelected ? "#00f0ff" : "#94a3b8", whiteSpace: "nowrap", fontFamily: "monospace" }, children: char.name })
            ]
          },
          char.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", style: { color: "#ffd700", textDecoration: "none", fontSize: "0.85rem", fontFamily: "monospace" }, children: "🛍️ Unlock More Pilots in Shop" }) })
  ] });
};
export {
  FlappyMascot as default
};
