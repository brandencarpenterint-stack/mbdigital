import { e as useNavigate, a as useRetroSound, u as useGamification, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, t as triggerConfetti, f as feedService } from "./index-eujTeecC.js";
const GRAVITY = 0.24;
const GROUND_LEVEL = 60;
const SKINS = [
  { id: "face_default", name: "OG BRO", src: "/assets/skins/face_default.png" },
  { id: "face_money", name: "MONEY", src: "/assets/skins/face_money.png" },
  { id: "face_astro", name: "ASTRO", src: "/assets/skins/face_astro.png" },
  { id: "face_space", name: "COSMIC", src: "/assets/skins/face_space.png" },
  { id: "face_gamer", name: "GAMER", src: "/assets/skins/face_gamer.png" },
  { id: "face_star", name: "STAR", src: "/assets/skins/face_star.png" },
  { id: "face_dino", name: "DINO", src: "/assets/skins/face_dino.png" },
  { id: "face_bear", name: "BEAR", src: "/assets/skins/face_bear.png" },
  { id: "face_cat", name: "NEKO", src: "/assets/skins/face_cat.png" },
  { id: "face_bunny", name: "BUNNY", src: "/assets/skins/face_bunny.png" },
  { id: "face_bunny_hoodie", name: "STREET BUNNY", src: "/assets/skins/face_bunny_hoodie.png" },
  { id: "face_frog", name: "PEPE", src: "/assets/skins/face_frog.png" },
  { id: "face_pumpkin", name: "SPOOKY", src: "/assets/skins/face_pumpkin.png" },
  { id: "face_rainbow", name: "PRISM", src: "/assets/skins/face_rainbow.png" },
  { id: "face_hoodie", name: "HYPE HOODIE", src: "/assets/skins/face_hoodie.png" },
  { id: "face_bunny_blue", name: "CYAN BUNNY", src: "/assets/skins/face_bunny_blue.png" }
];
const UPGRADE_BASE_COSTS = {
  power: 20,
  fuel: 25,
  thrust: 30,
  aero: 35,
  bounce: 25,
  magnet: 40
};
const BroCannon = () => {
  const navigate = useNavigate();
  const { playJump, playBoop, playCollect, playCrash, playWin, playShoot } = useRetroSound();
  const { coins, spendCoins, addCoins, stats, updateStat, userProfile } = useGamification();
  const [gameState, setGameState] = reactExports.useState("MENU");
  const gameStateRef = reactExports.useRef("MENU");
  reactExports.useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  const [angle, setAngle] = reactExports.useState(45);
  const [power, setPower] = reactExports.useState(0);
  const [distance, setDistance] = reactExports.useState(0);
  const [altitude, setAltitude] = reactExports.useState(0);
  const [coinsEarned, setCoinsEarned] = reactExports.useState(0);
  const [fuel, setFuel] = reactExports.useState(100);
  const [maxFuel, setMaxFuel] = reactExports.useState(100);
  const [isBoosting, setIsBoosting] = reactExports.useState(false);
  const isBoostingRef = reactExports.useRef(false);
  const particlesRef = reactExports.useRef([]);
  const shakeRef = reactExports.useRef(0);
  const [selectedSkin, setSelectedSkin] = reactExports.useState(SKINS[0]);
  const [upgrades, setUpgrades] = reactExports.useState(() => {
    return stats?.broCannonUpgrades || {
      power: 1,
      fuel: 1,
      thrust: 1,
      aero: 1,
      bounce: 1,
      magnet: 1
    };
  });
  reactExports.useEffect(() => {
    const capacity = 60 + upgrades.fuel * 40;
    setMaxFuel(capacity);
    setFuel(capacity);
  }, [upgrades.fuel]);
  const physics = reactExports.useRef({
    x: 0,
    y: GROUND_LEVEL,
    vx: 0,
    vy: 0,
    rot: 0,
    lastTime: 0
  });
  const cameraRef = reactExports.useRef({ x: -100, y: 0 });
  const raFrame = reactExports.useRef();
  const itemsRef = reactExports.useRef([]);
  const [visibleItems, setVisibleItems] = reactExports.useState([]);
  const generateWorld = () => {
    const newItems = [];
    for (let x = 250; x < 15e4; x += Math.random() * 80 + 40) {
      const rand = Math.random();
      let type = "COIN";
      let y = Math.random() * 1200 + 40;
      if (rand < 0.15) {
        type = "BOOST";
      } else if (rand < 0.28) {
        type = "FUEL";
      } else if (rand < 0.38) {
        type = "TRAMPOLINE";
        y = Math.min(y, 180);
      } else if (rand < 0.44) {
        type = "UFO";
        y = Math.random() * 2e3 + 800;
      } else if (rand < 0.55) {
        type = "DIAMOND";
      } else {
        type = "COIN";
      }
      newItems.push({ id: x, x, y, type, active: true });
    }
    itemsRef.current = newItems;
  };
  reactExports.useEffect(() => {
    generateWorld();
    return () => cancelAnimationFrame(raFrame.current);
  }, []);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameStateRef.current === "FLYING") {
          isBoostingRef.current = true;
          setIsBoosting(true);
        } else if (gameStateRef.current === "AIM" || gameStateRef.current === "POWER") {
          interact();
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        isBoostingRef.current = false;
        setIsBoosting(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);
  reactExports.useEffect(() => {
    let timer;
    if (gameState === "AIM") {
      let dir = 1;
      timer = setInterval(() => {
        setAngle((a) => {
          if (a >= 80) dir = -1;
          if (a <= 15) dir = 1;
          return a + dir * 1.8;
        });
      }, 16);
    } else if (gameState === "POWER") {
      let dir = 1;
      timer = setInterval(() => {
        setPower((p) => {
          if (p >= 100) dir = -1;
          if (p <= 0) dir = 1;
          return p + dir * 2.5;
        });
      }, 16);
    }
    return () => clearInterval(timer);
  }, [gameState]);
  const spawnParticles = (x, y, count = 10, color = "white", speed = 8) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        life: 1,
        color
      });
    }
  };
  const tick = (timestamp) => {
    if (gameStateRef.current !== "FLYING") return;
    if (timestamp) {
      if (!physics.current.lastTime) physics.current.lastTime = timestamp;
      const delta = timestamp - physics.current.lastTime;
      if (delta < 14) {
        raFrame.current = requestAnimationFrame(tick);
        return;
      }
      physics.current.lastTime = timestamp - delta % 14;
    }
    const p = physics.current;
    const drag = 0.993 + upgrades.aero * 1e-3;
    if (isBoostingRef.current && fuel > 0) {
      const thrustForce = 0.55 + upgrades.thrust * 0.15;
      p.vx += thrustForce * 0.8;
      p.vy += thrustForce * 1.1;
      setFuel((f) => Math.max(0, f - 0.6));
      spawnParticles(p.x - 20, p.y - 10, 3, Math.random() > 0.5 ? "#ff5500" : "#ffcc00", 4);
      if (Math.random() > 0.6) playShoot();
    }
    p.vx *= drag;
    p.vy -= GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    const targetRot = Math.atan2(p.vy, p.vx) * 180 / Math.PI;
    p.rot += (targetRot - p.rot) * 0.15;
    const magnetRange = 40 + upgrades.magnet * 30;
    itemsRef.current.forEach((item) => {
      if (!item.active) return;
      const dx = item.x - p.x;
      const dy = item.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < magnetRange && (item.type === "COIN" || item.type === "DIAMOND" || item.type === "FUEL")) {
        item.x -= dx / dist * 8;
        item.y -= dy / dist * 8;
      }
      if (dist < 45) {
        item.active = false;
        if (item.type === "BOOST") {
          p.vx += 22;
          p.vy += 18;
          playCollect();
          spawnParticles(item.x, item.y, 16, "#00ffff", 12);
          shakeRef.current = 12;
        } else if (item.type === "FUEL") {
          const refill = maxFuel * 0.4;
          setFuel((f) => Math.min(maxFuel, f + refill));
          playCollect();
          spawnParticles(item.x, item.y, 12, "#ffcc00", 8);
        } else if (item.type === "TRAMPOLINE") {
          p.vy = Math.max(Math.abs(p.vy) * 1.4, 25);
          p.vx += 10;
          playJump();
          spawnParticles(item.x, item.y, 15, "#ff00ff", 10);
          shakeRef.current = 8;
        } else if (item.type === "UFO") {
          p.vy += 35;
          p.vx += 15;
          playWin();
          spawnParticles(item.x, item.y, 25, "#76ff03", 15);
          shakeRef.current = 15;
        } else if (item.type === "DIAMOND") {
          setCoinsEarned((c) => c + 25);
          addCoins(25);
          playWin();
          spawnParticles(item.x, item.y, 10, "#00e5ff", 8);
        } else {
          setCoinsEarned((c) => c + 5);
          addCoins(5);
          playCollect();
          spawnParticles(item.x, item.y, 6, "#ffd700", 6);
        }
      }
    });
    if (p.y <= GROUND_LEVEL) {
      p.y = GROUND_LEVEL;
      if (Math.abs(p.vy) > 1.8 || Math.abs(p.vx) > 2) {
        const bounceFactor = 0.58 + upgrades.bounce * 0.06;
        p.vy = Math.abs(p.vy) * bounceFactor;
        p.vx *= 0.82;
        playCrash();
        spawnParticles(p.x, p.y, 8, "#76ff03", 6);
        if (Math.abs(p.vy) > 8) shakeRef.current = 6;
      } else {
        finishRun();
        return;
      }
    }
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const pt = particlesRef.current[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.04;
      if (pt.life <= 0) particlesRef.current.splice(i, 1);
    }
    if (shakeRef.current > 0) shakeRef.current *= 0.88;
    if (shakeRef.current < 0.5) shakeRef.current = 0;
    const currentDist = Math.floor(p.x / 10);
    const currentAlt = Math.floor(Math.max(0, p.y - GROUND_LEVEL) / 5);
    setDistance(currentDist);
    setAltitude(currentAlt);
    const targetX = p.x - 180;
    const targetY = Math.max(0, p.y - 320);
    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.12;
    cameraRef.current.y += (targetY - cameraRef.current.y) * 0.12;
    setVisibleItems(
      itemsRef.current.filter(
        (i) => i.active && i.x > cameraRef.current.x - 150 && i.x < cameraRef.current.x + 1200
      )
    );
    raFrame.current = requestAnimationFrame(tick);
  };
  const interact = () => {
    if (gameState === "AIM") {
      playBoop();
      setGameState("POWER");
    } else if (gameState === "POWER") {
      const rad = angle * Math.PI / 180;
      const force = power * 0.55 + 18 + upgrades.power * 3;
      physics.current = {
        x: 0,
        y: GROUND_LEVEL + 40,
        vx: Math.cos(rad) * force,
        vy: Math.sin(rad) * force,
        rot: angle,
        lastTime: 0
      };
      playJump();
      shakeRef.current = 20;
      spawnParticles(0, GROUND_LEVEL + 40, 30, "#ff9100", 14);
      setGameState("FLYING");
      gameStateRef.current = "FLYING";
      raFrame.current = requestAnimationFrame(tick);
    } else if (gameState === "FLYING") {
      isBoostingRef.current = true;
      setIsBoosting(true);
      setTimeout(() => {
        isBoostingRef.current = false;
        setIsBoosting(false);
      }, 300);
    }
  };
  const finishRun = () => {
    setGameState("LANDED");
    gameStateRef.current = "LANDED";
    cancelAnimationFrame(raFrame.current);
    const finalDist = Math.floor(physics.current.x / 10);
    const flightCoins = Math.floor(finalDist / 8);
    setCoinsEarned(flightCoins);
    addCoins(flightCoins);
    const best = stats?.broCannonHighScore || 0;
    if (finalDist > best) {
      updateStat("broCannonHighScore", finalDist);
      triggerConfetti();
      playWin();
      const playerName = userProfile?.name || "Player";
      feedService.publish(`launched a record ${finalDist}m in Bro Cannon! 🚀💥`, "win", playerName);
    }
  };
  const resetGame = () => {
    setAngle(45);
    setPower(0);
    setDistance(0);
    setAltitude(0);
    setCoinsEarned(0);
    setFuel(maxFuel);
    setGameState("AIM");
    gameStateRef.current = "AIM";
    physics.current = { x: 0, y: GROUND_LEVEL, vx: 0, vy: 0, rot: 0, lastTime: 0 };
    cameraRef.current = { x: -100, y: 0 };
    itemsRef.current.forEach((i) => i.active = true);
    particlesRef.current = [];
  };
  const goToMenu = () => {
    setGameState("MENU");
    gameStateRef.current = "MENU";
    resetGame();
  };
  const buyUpgrade = (key) => {
    const lvl = upgrades[key];
    const cost = UPGRADE_BASE_COSTS[key] * lvl;
    if (spendCoins(cost)) {
      playCollect();
      const next = { ...upgrades, [key]: lvl + 1 };
      setUpgrades(next);
      updateStat("broCannonUpgrades", next);
    } else {
      playCrash();
    }
  };
  const altRatio = Math.min(1, altitude / 2500);
  let skyGradient;
  if (altRatio < 0.25) {
    skyGradient = "linear-gradient(to top, #64b5f6 0%, #1976d2 100%)";
  } else if (altRatio < 0.55) {
    skyGradient = "linear-gradient(to top, #ffb74d 0%, #7b1fa2 100%)";
  } else if (altRatio < 0.85) {
    skyGradient = "linear-gradient(to top, #4a148c 0%, #0d001a 100%)";
  } else {
    skyGradient = "radial-gradient(ellipse at bottom, #1b003a 0%, #02000a 100%)";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: "100vw",
        height: "100vh",
        background: skyGradient,
        overflow: "hidden",
        position: "relative",
        touchAction: "none",
        fontFamily: '"Orbitron", monospace',
        color: "white",
        userSelect: "none"
      },
      onMouseDown: () => {
        if (gameState === "FLYING") {
          isBoostingRef.current = true;
          setIsBoosting(true);
        }
      },
      onMouseUp: () => {
        if (gameState === "FLYING") {
          isBoostingRef.current = false;
          setIsBoosting(false);
        }
      },
      onTouchStart: () => {
        if (gameState === "FLYING") {
          isBoostingRef.current = true;
          setIsBoosting(true);
        }
      },
      onTouchEnd: () => {
        if (gameState === "FLYING") {
          isBoostingRef.current = false;
          setIsBoosting(false);
        }
      },
      onClick: interact,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, zIndex: 100, pointerEvents: "none" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.5rem", fontWeight: "900", textShadow: "0 0 15px rgba(0,0,0,0.8)", color: "#ffea00" }, children: [
            distance,
            "m"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1rem", color: "#00e5ff", textShadow: "0 0 10px rgba(0,0,0,0.8)" }, children: [
            "ALT: ",
            altitude,
            "m ",
            altitude > 1500 ? "🌌 [ORBIT]" : altitude > 600 ? "☁️ [CLOUDS]" : "🌲 [SURFACE]"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.9rem", marginTop: "4px" }, children: [
            "COINS: ",
            coins.toLocaleString()
          ] })
        ] }),
        gameState === "FLYING" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.85rem", color: isBoosting ? "#ff5500" : "white", fontWeight: "bold", marginBottom: "4px" }, children: isBoosting ? "🔥 THRUSTERS FIRING!" : "HOLD [SPACE] / TAP SCREEN TO BOOST" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "280px",
            height: "16px",
            background: "rgba(0,0,0,0.6)",
            border: "2px solid white",
            borderRadius: "10px",
            overflow: "hidden"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: `${fuel / maxFuel * 100}%`,
            height: "100%",
            background: fuel > maxFuel * 0.3 ? "linear-gradient(90deg, #ff9100, #ffd600)" : "#ff1744",
            transition: "width 0.1s"
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade");
            },
            style: { position: "absolute", top: 20, right: 20, zIndex: 100, background: "#ff1744", color: "white" },
            children: "EXIT"
          }
        ),
        (gameState === "AIM" || gameState === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              bottom: 20,
              right: 20,
              zIndex: 90,
              background: "rgba(10, 10, 20, 0.9)",
              padding: "16px",
              borderRadius: "16px",
              border: "2px solid gold",
              maxWidth: "380px",
              boxShadow: "0 0 30px rgba(255,215,0,0.2)"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, color: "gold" }, children: "🛠️ CANNON GARAGE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", color: "#ffea00" }, children: [
                  "🪙 ",
                  coins
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }, children: Object.keys(UPGRADE_BASE_COSTS).map((key) => {
                const lvl = upgrades[key];
                const cost = UPGRADE_BASE_COSTS[key] * lvl;
                const canAfford = coins >= cost;
                const labels = {
                  power: "💥 POW",
                  fuel: "⛽ FUEL",
                  thrust: "🚀 JETS",
                  aero: "🪂 AERO",
                  bounce: "🏈 BNCE",
                  magnet: "🧲 MAG"
                };
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: () => buyUpgrade(key),
                    style: {
                      background: canAfford ? "#1a237e" : "#222",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: canAfford ? "pointer" : "not-allowed",
                      border: canAfford ? "1px solid #00e5ff" : "1px solid #444",
                      opacity: canAfford ? 1 : 0.6
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", fontWeight: "bold" }, children: labels[key] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.65rem", color: "#aaa" }, children: [
                        "LVL ",
                        lvl
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.7rem" }, children: [
                        "🪙 ",
                        cost
                      ] })
                    ]
                  },
                  key
                );
              }) })
            ]
          }
        ),
        gameState === "MENU" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "rgba(5, 5, 15, 0.92)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3rem", color: "gold", margin: 0, textShadow: "0 0 20px gold" }, children: "BRO CANNON 🚀" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", margin: "10px 0 25px 0" }, children: "CHOOSE YOUR BRAVE PILOT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "15px",
                maxHeight: "340px",
                overflowY: "auto",
                padding: "10px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                border: "1px solid #333"
              }, children: SKINS.map((skin) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => {
                    setSelectedSkin(skin);
                    playBoop();
                  },
                  style: {
                    border: selectedSkin.id === skin.id ? "3px solid gold" : "1px solid #444",
                    borderRadius: "12px",
                    padding: "8px",
                    background: selectedSkin.id === skin.id ? "rgba(255, 215, 0, 0.25)" : "#111",
                    cursor: "pointer",
                    textAlign: "center",
                    transform: selectedSkin.id === skin.id ? "scale(1.06)" : "scale(1)",
                    transition: "all 0.15s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: skin.src, width: "55", height: "55", style: { display: "block", margin: "0 auto", objectFit: "contain" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", marginTop: "6px", color: selectedSkin.id === skin.id ? "gold" : "#ccc" }, children: skin.name })
                  ]
                },
                skin.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SquishyButton,
                {
                  onClick: resetGame,
                  style: {
                    fontSize: "1.5rem",
                    padding: "16px 60px",
                    background: "#00ffcc",
                    color: "black",
                    marginTop: "30px",
                    fontWeight: "bold",
                    boxShadow: "0 0 25px #00ffcc"
                  },
                  children: "LOCK IN & LAUNCH"
                }
              )
            ]
          }
        ),
        (gameState === "AIM" || gameState === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          textAlign: "center",
          pointerEvents: "none"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.5rem", textShadow: "0 0 20px black", margin: 0, color: gameState === "AIM" ? "#00e5ff" : "#ff1744" }, children: gameState === "AIM" ? "CLICK TO SET ANGLE" : "CLICK TO LAUNCH!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "320px",
            height: "22px",
            background: "#222",
            border: "3px solid white",
            margin: "15px auto",
            borderRadius: "12px",
            overflow: "hidden"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: `${gameState === "AIM" ? angle : power}%`,
            height: "100%",
            background: gameState === "AIM" ? "linear-gradient(90deg, #00e5ff, #76ff03)" : "linear-gradient(90deg, #ffd600, #ff1744)"
          } }) })
        ] }),
        gameState === "LANDED" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { fontSize: "4.5rem", color: "gold", margin: 0, textShadow: "0 0 30px gold" }, children: [
                distance,
                "m"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "#00e5ff", margin: "10px 0" }, children: [
                "EARNED +",
                coinsEarned,
                " COINS 🪙"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", marginBottom: "25px" }, children: [
                "BEST RECORD: ",
                stats?.broCannonHighScore || distance,
                "m"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SquishyButton,
                  {
                    onClick: resetGame,
                    style: { fontSize: "1.2rem", padding: "16px 36px", background: "#00ffcc", color: "black" },
                    children: "LAUNCH AGAIN 🚀"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SquishyButton,
                  {
                    onClick: goToMenu,
                    style: { fontSize: "1.2rem", padding: "16px 36px", background: "#333", color: "white" },
                    children: "GARAGE & PILOTS 🛠️"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              transform: `translate3d(${-cameraRef.current.x}px, ${cameraRef.current.y}px, 0) translate(${Math.random() * shakeRef.current}px, ${Math.random() * shakeRef.current}px)`,
              pointerEvents: "none",
              willChange: "transform"
            },
            children: [
              altitude > 1e3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                left: cameraRef.current.x - 500,
                top: -4e3,
                width: "3000px",
                height: "4000px",
                pointerEvents: "none",
                opacity: Math.min(1, (altitude - 1e3) / 1e3)
              }, children: [...Array(60)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: `${i * 47 % 3e3}px`,
                    top: `${i * 73 % 4e3}px`,
                    width: `${i % 3 + 2}px`,
                    height: `${i % 3 + 2}px`,
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 0 6px white"
                  }
                },
                i
              )) }),
              visibleItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: item.x,
                    bottom: item.y,
                    width: "44px",
                    height: "44px",
                    transform: "translate(-50%, 50%)",
                    fontSize: "32px",
                    textAlign: "center",
                    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.4))"
                  },
                  children: item.type === "BOOST" ? "🚀" : item.type === "FUEL" ? "⛽" : item.type === "TRAMPOLINE" ? "☁️" : item.type === "UFO" ? "🛸" : item.type === "DIAMOND" ? "💎" : "🪙"
                },
                item.id
              )),
              particlesRef.current.map((pt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: pt.x,
                    bottom: pt.y,
                    width: "8px",
                    height: "8px",
                    background: pt.color,
                    borderRadius: "50%",
                    opacity: pt.life,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 8px ${pt.color}`
                  }
                },
                i
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: -2e3,
                    bottom: 0,
                    width: "200000px",
                    height: `${GROUND_LEVEL}px`,
                    background: "linear-gradient(to bottom, #2e7d32 0%, #1b5e20 100%)",
                    borderTop: "6px solid #76ff03",
                    boxShadow: "0 0 20px rgba(118, 255, 3, 0.4)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: -55,
                    bottom: GROUND_LEVEL,
                    width: "65px",
                    height: "45px",
                    background: "#222",
                    borderRadius: "12px",
                    border: "2px solid #555"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: -40,
                    bottom: GROUND_LEVEL + 20,
                    width: "90px",
                    height: "24px",
                    background: "linear-gradient(to right, #333, #666)",
                    transformOrigin: "left center",
                    transform: `rotate(${-angle}deg)`,
                    borderRadius: "6px",
                    border: "2px solid gold"
                  }
                }
              ),
              (gameState === "FLYING" || gameState === "LANDED") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: physics.current.x,
                    bottom: physics.current.y,
                    width: "54px",
                    height: "54px",
                    transform: `translate(-50%, 50%) rotate(${physics.current.rot}deg)`
                  },
                  children: [
                    isBoosting && fuel > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                      position: "absolute",
                      left: -22,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "24px"
                    }, children: "🔥" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: selectedSkin.src,
                        style: { width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,0,0,0.8))" }
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
export {
  BroCannon as default
};
