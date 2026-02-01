import { r as reactExports, c as useRetroSound, b as useGamification, j as jsxRuntimeExports, L as Link, S as SquishyButton, t as triggerConfetti, y as triggerWinConfetti } from "./index-B6r3rtPj.js";
import { feedService } from "./feed-BySVxqnZ.js";
import { G as GameOverCard } from "./GameOverCard-C8TCjOUX.js";
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const FACE_ASSETS = [
  "/assets/snake/face1.png",
  "/assets/snake/face2.png",
  "/assets/snake/face3.png",
  "/assets/snake/face4.png"
];
const SnakeGame = () => {
  const [snake, setSnake] = reactExports.useState([{ x: 10, y: 10 }]);
  const [food, setFood] = reactExports.useState({ x: 15, y: 15 });
  const [direction, setDirection] = reactExports.useState("RIGHT");
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [highScore, setHighScore] = reactExports.useState(parseInt(localStorage.getItem("snakeHighScore")) || 0);
  const [isPaused, setIsPaused] = reactExports.useState(false);
  const [shake, setShake] = reactExports.useState(0);
  const { playJump, playCrash, playCollect } = useRetroSound();
  const { shopState, addCoins, updateStat, userProfile, stats, consumeItem } = useGamification() || {};
  reactExports.useEffect(() => {
    if (stats?.snakeHighScore > highScore) {
      setHighScore(stats.snakeHighScore);
    }
  }, [stats]);
  const gameLoopRef = reactExports.useRef();
  const touchStart = reactExports.useRef({ x: 0, y: 0 });
  const touchEnd = reactExports.useRef({ x: 0, y: 0 });
  const getSegmentStyle = (index) => {
    const skin = shopState?.equipped?.snake || "snake_default";
    let style = {
      position: "absolute",
      left: `${snake[index].x * 5}%`,
      top: `${snake[index].y * 5}%`,
      width: "5%",
      height: "5%",
      borderRadius: index === 0 ? "4px" : "2px",
      zIndex: 2,
      boxShadow: "0 0 5px rgba(0,0,0,0.5)"
    };
    if (skin === "snake_gold") {
      style.backgroundColor = index === 0 ? "#fff" : "#FFD700";
      style.boxShadow = "0 0 10px #FFD700";
    } else if (skin === "snake_rainbow") {
      style.backgroundColor = `hsl(${index * 20 % 360}, 100%, 50%)`;
      style.boxShadow = "0 0 5px white";
    } else if (skin === "snake_ghost") {
      style.backgroundColor = index === 0 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)";
      style.border = "1px solid white";
    } else if (skin === "snake_tron") {
      style.backgroundColor = "#00f3ff";
      style.boxShadow = "0 0 10px #00f3ff, 0 0 20px #00f3ff";
      style.borderRadius = "0px";
    } else {
      style.backgroundColor = index === 0 ? "#ccffdd" : "#00ffaa";
      style.boxShadow = "0 0 5px #00ffaa";
    }
    return style;
  };
  const endGame = () => {
    setGameOver(true);
    playCrash();
    if (updateStat) updateStat("gamesPlayed", "snake");
    if (score > highScore) {
      setHighScore(score);
      if (updateStat) updateStat("snakeHighScore", score);
      triggerConfetti();
      if (score > 50) {
        const playerName = userProfile?.name || "Player";
        feedService.publish(`slithered to a new High Score: ${score} in Neon Snake 🐍`, "win", playerName);
      }
    } else {
      triggerWinConfetti();
    }
    if (addCoins) addCoins(Math.floor(score / 10));
  };
  const spawnFood = () => {
    let newFood;
    let attempts = 0;
    while (attempts < 100) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const onSnake = snake.some((s) => s.x === newFood.x && s.y === newFood.y);
      if (!onSnake) break;
      attempts++;
    }
    setFood(newFood);
  };
  const moveSnake = () => {
    if (gameOver || isPaused) return;
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      endGame();
      return;
    }
    if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }
    newSnake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 10);
      setShake(5);
      playCollect();
      spawnFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (isPaused) {
        if (e.key === " " || e.key === "Enter") setIsPaused((prev) => !prev);
        return;
      }
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") {
            setDirection("UP");
            playJump();
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") {
            setDirection("DOWN");
            playJump();
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") {
            setDirection("LEFT");
            playJump();
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") {
            setDirection("RIGHT");
            playJump();
          }
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isPaused, playJump]);
  reactExports.useEffect(() => {
    if (gameOver || isPaused) return;
    gameLoopRef.current = setInterval(() => {
      moveSnake();
      if (shake > 0) setShake((s) => Math.max(0, s - 1));
    }, INITIAL_SPEED - Math.min(score * 2, 100));
    return () => clearInterval(gameLoopRef.current);
  }, [snake, direction, gameOver, isPaused, score, shake]);
  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };
  const handleDir = (d) => {
    if (direction === "UP" && d === "DOWN") return;
    if (direction === "DOWN" && d === "UP") return;
    if (direction === "LEFT" && d === "RIGHT") return;
    if (direction === "RIGHT" && d === "LEFT") return;
    setDirection(d);
    playJump();
  };
  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e) => {
    touchEnd.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    handleSwipe();
  };
  const handleSwipe = () => {
    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        if (dx > 0) handleDir("RIGHT");
        else handleDir("LEFT");
      }
    } else {
      if (Math.abs(dy) > 30) {
        if (dy > 0) handleDir("DOWN");
        else handleDir("UP");
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    paddingBottom: "120px",
    color: "var(--neon-green)",
    fontFamily: '"Orbitron", sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
      fontSize: "2.5rem",
      margin: "0 0 20px 0",
      textAlign: "center",
      textShadow: "0 0 20px var(--neon-green)",
      letterSpacing: "2px"
    }, children: "NEON SNAKE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: "20px", left: "20px", zIndex: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { borderRadius: "50px", padding: "10px 20px", fontSize: "1.2rem", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)" }, children: "🏠 EXIT" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: "400px",
      marginBottom: "20px",
      padding: "15px 25px",
      fontSize: "1.2rem",
      border: "1px solid var(--neon-green)",
      background: "rgba(0, 20, 0, 0.6)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.7rem", color: "#888" }, children: "SCORE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.5rem", fontWeight: "bold" }, children: score })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.7rem", color: "#888" }, children: "HIGH SCORE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", color: "var(--neon-gold)", textShadow: "0 0 10px var(--neon-gold)" }, children: highScore })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          aspectRatio: "1/1",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid var(--neon-green)",
          borderRadius: "10px",
          boxShadow: "0 0 30px rgba(0, 255, 170, 0.3), inset 0 0 50px rgba(0, 255, 170, 0.1)",
          touchAction: "none",
          // Prevent scroll while swiping
          backgroundImage: "linear-gradient(rgba(0, 255, 170, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 170, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          overflow: "hidden",
          transform: `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`
        },
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        children: [
          snake.map((segment, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: getSegmentStyle(index) }, `${segment.x}-${segment.y}`)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            left: `${food.x * 5}%`,
            top: `${food.y * 5}%`,
            width: "5%",
            height: "5%",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1em"
            // Scale emoji
          }, children: !shopState?.equipped?.snake_food ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: FACE_ASSETS[score / 10 % FACE_ASSETS.length],
              alt: "food",
              style: {
                width: "120%",
                height: "120%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 5px white)",
                animation: "pulse 0.5s infinite alternate"
              }
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem", animation: "pulse 1s infinite alternate", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }, children: shopState.equipped.snake_food === "food_apple" ? "🍎" : shopState.equipped.snake_food === "food_burger" ? "🍔" : "🍣" }) }),
          gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx(
            GameOverCard,
            {
              score,
              bestScore: highScore,
              gameId: "snake",
              onReplay: restartGame,
              onHome: () => window.location.href = "/arcade",
              children: shopState?.inventory?.["snake_life"] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    if (consumeItem("snake_life")) {
                      setGameOver(false);
                      setSnake([{ x: 10, y: 10 }]);
                      setDirection("RIGHT");
                    }
                  },
                  className: "squishy-btn",
                  style: {
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    background: "#ff0055",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    fontWeight: "900",
                    boxShadow: "0 0 20px #ff0055",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  },
                  children: [
                    "❤️ REVIVE (",
                    shopState.inventory["snake_life"],
                    ")"
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "30px",
      display: "grid",
      gridTemplateColumns: "repeat(3, 70px)",
      gap: "10px",
      justifyContent: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onPointerDown: () => handleDir("UP"),
          className: "glass-panel",
          style: { height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", borderRadius: "15px", background: "rgba(255,255,255,0.05)" },
          children: "⬆️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onPointerDown: () => handleDir("LEFT"),
          className: "glass-panel",
          style: { height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", borderRadius: "15px", background: "rgba(255,255,255,0.05)" },
          children: "⬅️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onPointerDown: () => handleDir("DOWN"),
          className: "glass-panel",
          style: { height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", borderRadius: "15px", background: "rgba(255,255,255,0.05)" },
          children: "⬇️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onPointerDown: () => handleDir("RIGHT"),
          className: "glass-panel",
          style: { height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", borderRadius: "15px", background: "rgba(255,255,255,0.05)" },
          children: "➡️"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "30px", textAlign: "center", color: "#555", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SWIPE or TAP CONTROLS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "1px", height: "10px", background: "#333" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SPACE TO PAUSE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(1.2); opacity: 1; }
                }
            ` })
  ] });
};
export {
  SnakeGame as default
};
