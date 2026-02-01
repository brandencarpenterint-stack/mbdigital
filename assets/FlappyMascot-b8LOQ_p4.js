import { r as reactExports, b as useGamification, c as useRetroSound, j as jsxRuntimeExports, S as SquishyButton, L as Link, t as triggerConfetti } from "./index-B6r3rtPj.js";
import { feedService } from "./feed-BySVxqnZ.js";
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 3;
const PIPE_SPACING = 200;
const BIRD_SIZE = 40;
const CHARACTERS = [
  { id: "flappy_boy", type: "image", content: "/assets/merchboy_face.png", name: "MerchBoy" },
  { id: "flappy_face1", type: "image", content: "/assets/neon_brick/ball1.png", name: "Face 1" },
  { id: "flappy_face2", type: "image", content: "/assets/neon_brick/ball2.png", name: "Face 2" },
  { id: "flappy_face3", type: "image", content: "/assets/neon_brick/ball3.png", name: "Face 3" },
  { id: "flappy_face4", type: "image", content: "/assets/neon_brick/ball4.png", name: "Face 4" },
  { id: "flappy_brokid", type: "image", content: "/assets/brokid-logo.png", name: "BroKid" },
  { id: "flappy_cat", type: "emoji", content: "🐱", name: "Kitty" },
  { id: "flappy_dog", type: "emoji", content: "🐶", name: "Puppy" },
  { id: "flappy_frog", type: "emoji", content: "🐸", name: "Froggo" },
  { id: "flappy_unicorn", type: "emoji", content: "🦄", name: "Uni" },
  { id: "flappy_rainbow", type: "emoji", content: "🌈", name: "Pride" },
  { id: "flappy_ghost", type: "emoji", content: "👻", name: "Spooky" },
  { id: "flappy_zombie", type: "emoji", content: "🧟", name: "Walker" },
  // Missing in Shop? Add it there later if needed
  { id: "flappy_vampire", type: "emoji", content: "🧛", name: "Drac" },
  // Missing in Shop
  { id: "flappy_clown", type: "emoji", content: "🤡", name: "Bozo" },
  // Missing in Shop
  { id: "flappy_poop", type: "emoji", content: "💩", name: "Stinky" },
  { id: "flappy_hotdog", type: "emoji", content: "🌭", name: "Glizzy" },
  // Missing
  { id: "flappy_taco", type: "emoji", content: "🌮", name: "Crunch" },
  // Missing
  { id: "flappy_burger", type: "emoji", content: "🍔", name: "Beefy" },
  // Missing
  { id: "flappy_alien", type: "emoji", content: "👽", name: "Paul" },
  { id: "flappy_robot", type: "emoji", content: "🤖", name: "Bot" },
  { id: "flappy_cowboy", type: "emoji", content: "🤠", name: "Sheriff" },
  { id: "flappy_monster", type: "emoji", content: "👾", name: "8-Bit" },
  { id: "flappy_diamond", type: "emoji", content: "💎", name: "Richie" },
  { id: "flappy_crown", type: "emoji", content: "👑", name: "King" },
  // Missing
  { id: "flappy_catdog", type: "emoji", content: "😺", name: "CatDog" },
  { id: "flappy_face_money", type: "image", content: "/assets/skins/face_money.png", name: "Money" },
  { id: "flappy_face_bear", type: "image", content: "/assets/skins/face_bear.png", name: "Bear" },
  { id: "flappy_face_bunny", type: "image", content: "/assets/skins/face_bunny.png", name: "Bunny" }
];
const FlappyMascot = () => {
  const canvasRef = reactExports.useRef(null);
  const { shopState, updateStat, incrementStat, equipItem, addCoins, userProfile, stats, coins, consumeItem } = useGamification() || {};
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("flappyHighScore")) || 0);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameActive, setGameActive] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (stats?.flappyHighScore > highScore) {
      setHighScore(stats.flappyHighScore);
    }
  }, [stats]);
  const selectedId = shopState?.equipped?.flappy || "flappy_boy";
  const gameActiveRef = reactExports.useRef(false);
  const { playJump, playCrash, playCollect } = useRetroSound();
  const birdImgRef = reactExports.useRef(null);
  const brokidImgRef = reactExports.useRef(null);
  const moneyImgRef = reactExports.useRef(null);
  const bearImgRef = reactExports.useRef(null);
  const bunnyImgRef = reactExports.useRef(null);
  const gameState = reactExports.useRef({
    birdY: GAME_HEIGHT / 2,
    velocity: 0,
    pipes: [],
    // {x, topHeight}
    lastPipeTime: 0,
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
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/assets/neon_brick/ball${i}.png`;
    }
    const handleStorage = () => {
      setCoins(parseInt(localStorage.getItem("arcadeCoins")) || 0);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
      lastPipeTime: 0,
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
        feedService.publish(`is flying high! Score: ${score} in Flappy Mascot 🦅`, "win", playerName);
      }
    }
    if (addCoins) addCoins(Math.floor(score));
    if (updateStat) {
      updateStat("gamesPlayed", "flappy_mascot");
    }
  };
  const gameLoop = () => {
    if (!gameActiveRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const state = gameState.current;
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
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
      const maxHeight = GAME_HEIGHT - 150 - minHeight;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      state.pipes.push({ x: GAME_WIDTH, topHeight: height });
    }
    if (state.pipes[0].x < -60) {
      state.pipes.shift();
      setScore((prev) => prev + 1);
      playCollect();
    }
    state.pipes.forEach((pipe) => {
      if (50 + BIRD_SIZE > pipe.x && 50 < pipe.x + 60) {
        if (state.birdY < pipe.topHeight || state.birdY + BIRD_SIZE > pipe.topHeight + 150) {
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
      const bottomY = pipe.topHeight + 150;
      ctx.fillRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
      ctx.strokeRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
      ctx.fillRect(pipe.x - 4, bottomY, 68, 20);
      ctx.strokeRect(pipe.x - 4, bottomY, 68, 20);
    });
    const birdX = 50;
    const birdY = state.birdY;
    const charData = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];
    ctx.save();
    ctx.translate(birdX + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.velocity * 0.1));
    ctx.rotate(rotation);
    const flutter = Math.sin(Date.now() / 50) * 0.5;
    const drawWing = (side = "front") => {
      const wingOffset = state.velocity * 0.15 + flutter;
      const flap = side === "back" ? wingOffset * 0.8 : wingOffset;
      ctx.save();
      ctx.translate(-20, 10);
      ctx.rotate(flap);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -15, -35, -5);
      ctx.quadraticCurveTo(-20, 10, 0, 5);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.moveTo(-10, -2);
      ctx.lineTo(-25, -2);
      ctx.stroke();
      ctx.restore();
    };
    drawWing("back");
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-5, 15);
    ctx.lineTo(-10, 25);
    ctx.moveTo(5, 15);
    ctx.lineTo(10, 25);
    ctx.stroke();
    if (charData.type === "image") {
      let img = null;
      if (charData.id === "flappy_boy") img = birdImgRef.current;
      else if (charData.id === "flappy_brokid") img = brokidImgRef.current;
      else if (charData.id === "flappy_face_money") img = moneyImgRef.current;
      else if (charData.id === "flappy_face_bear") img = bearImgRef.current;
      else if (charData.id === "flappy_face_bunny") img = bunnyImgRef.current;
      if (img && img.complete) {
        ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      } else if (charData.id.startsWith("flappy_face")) {
        const img2 = new Image();
        img2.src = charData.content;
        ctx.drawImage(img2, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      }
    } else {
      ctx.font = "35px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(charData.content, 0, 2);
    }
    drawWing("front");
    ctx.restore();
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT - 20);
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - 20);
    ctx.strokeStyle = "#73bf2e";
    ctx.stroke();
    state.animationId = requestAnimationFrame(gameLoop);
  };
  const lastJumpRef = reactExports.useRef(0);
  const handleInput = () => {
    if (!gameActiveRef.current) return;
    const now = Date.now();
    if (now - lastJumpRef.current < 150) return;
    lastJumpRef.current = now;
    gameState.current.velocity = JUMP_STRENGTH;
    playJump();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", color: "#70c5ce" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Courier New", monospace', fontSize: "3rem", margin: "10px 0" }, children: "FLAPPY MASCOT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "400px", marginBottom: "10px", fontSize: "1.2rem", color: "#fff", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "SCORE: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "COINS: ",
        coins
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
          style: { border: "4px solid #fff", borderRadius: "10px", boxShadow: "0 0 20px rgba(0,0,0,0.2)", cursor: "pointer", touchAction: "none" }
        }
      ),
      !gameActive && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { padding: "15px 40px", fontSize: "1.5rem", background: "#ff9900", border: "none", borderRadius: "10px", color: "white" }, children: "FLY!" }) }),
      gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", color: "#ff9900" }, children: "GAME OVER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", marginBottom: "20px", color: "white" }, children: [
          "Score: ",
          score
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
            style: { marginBottom: "15px", padding: "10px 30px", background: "var(--neon-blue)", border: "none", borderRadius: "5px", color: "black", fontWeight: "bold" },
            children: [
              "🛡️ USE SHIELD (",
              shopState.inventory["flappy_shield"],
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: startGame, style: { marginBottom: "10px", padding: "10px 30px", background: "#ff9900", border: "none", borderRadius: "5px", color: "white" }, children: "Try Again" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "white", textDecoration: "underline" }, children: "Back to Base" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", width: "100%", maxWidth: "400px", overflowX: "auto", paddingBottom: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#fff", textAlign: "center", marginBottom: "5px" }, children: "SELECT PILOT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", padding: "0 10px" }, children: CHARACTERS.map((char) => {
        const isDefault = ["flappy_boy", "flappy_face1", "flappy_face2", "flappy_face3", "flappy_face4"].includes(char.id);
        const isUnlocked = isDefault || shopState?.unlocked?.includes(char.id);
        const isSelected = selectedId === char.id;
        if (!isUnlocked) return null;
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
              background: isSelected ? "#ff9900" : "rgba(255,255,255,0.2)",
              border: isSelected ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "10px",
              minWidth: "60px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", marginBottom: "5px" }, children: char.type === "emoji" ? char.content : char.id === "flappy_boy" ? "👦" : "🅱️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.7rem", color: "white", whiteSpace: "nowrap" }, children: char.name })
            ]
          },
          char.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", style: { color: "gold", textDecoration: "none", fontSize: "0.9rem" }, children: "🛍️ Get More Pilots" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginTop: "10px", color: "#666" }, children: "Space or Click to Flap" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: "10px", left: "10px", zIndex: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { borderRadius: "50px", padding: "10px 20px", fontSize: "1.2rem", background: "rgba(255,255,255,0.2)" }, children: "🏠 EXIT" }) })
  ] });
};
export {
  FlappyMascot as default
};
