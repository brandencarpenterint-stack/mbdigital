import { y as useNavigate, b as useRetroSound, a as useGamification, r as reactExports, j as jsxRuntimeExports, S as SquishyButton } from "./index-CfmL3Xs0.js";
const GRAVITY = 0.28;
const GROUND_LEVEL = 50;
const BroCannon = () => {
  const navigate = useNavigate();
  const { playJump, playBoop, playCollect, playCrash, playWin } = useRetroSound();
  const { stats, updateStat, addZonePoints, userProfile } = useGamification() || { stats: {} };
  const [gameState, setGameState] = reactExports.useState("MENU");
  const gameStateRef = reactExports.useRef("MENU");
  const [angle, setAngle] = reactExports.useState(45);
  const [power, setPower] = reactExports.useState(0);
  const [distance, setDistance] = reactExports.useState(0);
  const [coinsEarned, setCoinsEarned] = reactExports.useState(0);
  const sheetRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/cannon_sheet.png";
    sheetRef.current = img;
  }, []);
  const [upgrades, setUpgrades] = reactExports.useState(stats.broCannonUpgrades || { power: 1, aero: 1, bounce: 1 });
  const PRICES = { power: 10, aero: 15, bounce: 20 };
  const physics = reactExports.useRef({ x: 0, y: GROUND_LEVEL, vx: 0, vy: 0, rot: 0, state: "FLY" });
  const cameraRef = reactExports.useRef({ x: -100, y: 0 });
  const particlesRef = reactExports.useRef([]);
  const itemsRef = reactExports.useRef([]);
  const frameRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const newItems = [];
    for (let i = 300; i < 5e4; i += Math.random() * 150 + 100) {
      const r = Math.random();
      const type = r > 0.8 ? "BOOST" : r > 0.9 ? "SUPER" : "COIN";
      newItems.push({
        x: i,
        y: Math.random() * 800 + 50,
        type,
        active: true
      });
    }
    itemsRef.current = newItems;
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
  reactExports.useEffect(() => {
    let oscDir = 1;
    const id = setInterval(() => {
      if (gameState === "AIM") {
        setAngle((prev) => {
          if (prev >= 85) oscDir = -1;
          if (prev <= 5) oscDir = 1;
          return prev + oscDir * 3;
        });
      } else if (gameState === "POWER") {
        setPower((prev) => {
          if (prev >= 100) oscDir = -1;
          if (prev <= 0) oscDir = 1;
          return prev + oscDir * 4;
        });
      }
    }, 16);
    return () => clearInterval(id);
  }, [gameState]);
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: color || "white"
      });
    }
  };
  const tick = () => {
    if (gameStateRef.current !== "FLYING") return;
    const p = physics.current;
    const drag = 0.99 + upgrades.aero * 5e-4;
    p.vx *= drag;
    p.vy -= GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vx * 2;
    const camX = p.x;
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      if (!item.active) continue;
      if (item.x < camX - 100) continue;
      if (item.x > camX + 100) break;
      if (Math.abs(item.x - p.x) < 40 && Math.abs(item.y - p.y) < 40) {
        item.active = false;
        if (item.type === "BOOST") {
          p.vx += 15;
          p.vy += 15;
          playBoop();
          spawnParticles(p.x, p.y, "red");
        } else if (item.type === "SUPER") {
          p.vx += 30;
          p.vy += 20;
          playCollect();
          spawnParticles(p.x, p.y, "yellow");
        } else {
          playCollect();
        }
      }
    }
    if (p.y <= GROUND_LEVEL) {
      p.y = GROUND_LEVEL;
      if (Math.abs(p.vx) > 1 || Math.abs(p.vy) > 2) {
        const bounce = 0.5 + upgrades.bounce * 0.05;
        p.vy = Math.abs(p.vy) * bounce;
        p.vx *= 0.7;
        playCrash();
        spawnParticles(p.x, p.y, "green");
        p.state = "CRASH";
      } else {
        finishRun();
        return;
      }
    } else {
      p.state = "FLY";
    }
    cameraRef.current.x += (p.x - 150 - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (Math.max(0, p.y - 300) - cameraRef.current.y) * 0.1;
    particlesRef.current.forEach((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.05;
    });
    particlesRef.current = particlesRef.current.filter((pt) => pt.life > 0);
    setDistance(Math.floor(p.x / 10));
    frameRef.current = requestAnimationFrame(tick);
  };
  const interact = () => {
    if (gameState === "AIM") {
      setGameState("POWER");
    } else if (gameState === "POWER") {
      const rad = angle * Math.PI / 180;
      const force = power * 0.5 + 15 + upgrades.power * 2;
      physics.current = {
        x: 0,
        y: GROUND_LEVEL + 50,
        vx: Math.cos(rad) * force,
        vy: Math.sin(rad) * force,
        rot: 0,
        state: "FLY"
      };
      playJump();
      spawnParticles(0, GROUND_LEVEL, "white");
      setGameState("FLYING");
      gameStateRef.current = "FLYING";
      frameRef.current = requestAnimationFrame(tick);
    }
  };
  const finishRun = () => {
    setGameState("LANDED");
    gameStateRef.current = "LANDED";
    cancelAnimationFrame(frameRef.current);
    const dist = Math.floor(physics.current.x / 10);
    const earned = Math.floor(dist / 10);
    setCoinsEarned(earned);
    if (updateStat) {
      updateStat("arcadeCoins", (stats.arcadeCoins || 0) + earned);
      if (dist > (stats.broCannonHighScore || 0)) {
        updateStat("broCannonHighScore", dist);
        playWin();
      }
    }
    if (addZonePoints && dist > 100) {
      const points = Math.floor(dist / 10);
      const squad = userProfile?.squad || "CYBER";
      addZonePoints("bro-cannon", points, squad);
    }
  };
  const resetGame = () => {
    setGameState("AIM");
    gameStateRef.current = "AIM";
    setAngle(45);
    setPower(0);
    setDistance(0);
    cameraRef.current = { x: -100, y: 0 };
  };
  const buy = (type) => {
    const cost = PRICES[type] * upgrades[type];
    if (stats.arcadeCoins >= cost) {
      const next = { ...upgrades, [type]: upgrades[type] + 1 };
      setUpgrades(next);
      updateStat("broCannonUpgrades", next);
      updateStat("arcadeCoins", stats.arcadeCoins - cost);
      playCollect();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: "linear-gradient(to bottom, #87CEEB, #E0F7FA)", touchAction: "none" }, onClick: interact, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, color: "white", fontFamily: "Impact, sans-serif", fontSize: "2rem", textShadow: "2px 2px 0 black", zIndex: 100 }, children: [
      distance,
      "m"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: (e) => {
      e.stopPropagation();
      navigate("/arcade");
    }, style: { position: "absolute", top: 20, right: 20, zIndex: 100, background: "red" }, children: "EXIT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      transform: `translate3d(${-cameraRef.current.x}px, ${cameraRef.current.y}px, 0)`
    }, children: [
      [...Array(20)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: i * 800,
        top: -Math.random() * 1e3,
        width: "200px",
        height: "100px",
        backgroundImage: "url(/assets/cannon_sheet.png)",
        backgroundPosition: "0 80%",
        // Assume cloud is roughly bottom left of sheet
        backgroundSize: "400%",
        // Zoom in on sprite sheet
        opacity: 0.8
      } }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", left: -1e3, bottom: 0, width: "100000px", height: "50px", background: "#4CAF50", borderTop: "5px solid #388E3C" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", left: -50, bottom: 50, width: "100px", height: "100px", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "60px",
          height: "40px",
          background: "url(/assets/cannon_sheet.png) 0 0",
          // Top Left
          backgroundSize: "300%"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 20,
          left: 10,
          width: "80px",
          height: "20px",
          background: "url(/assets/cannon_sheet.png) 33% 0",
          // Top Mid
          backgroundSize: "300%",
          transformOrigin: "left center",
          transform: `rotate(${-angle}deg)`
        } })
      ] }),
      (gameState === "FLYING" || gameState === "LANDED") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: physics.current.x,
        bottom: physics.current.y,
        width: "50px",
        height: "50px",
        transform: `translate(-50%, 50%) rotate(${physics.current.rot}deg)`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/cannon_sheet.png)",
        // Row 2: Fly (Col 0), Crash (Col 1), Win (Col 2)
        // Assuming 3x4 grid 
        backgroundPosition: physics.current.state === "FLY" ? "0 33%" : physics.current.state === "CRASH" ? "33% 33%" : "66% 33%",
        backgroundSize: "300%"
      } }) }),
      itemsRef.current.map((item) => {
        if (!item.active) return null;
        if (item.x < cameraRef.current.x - 200 || item.x > cameraRef.current.x + 1e3) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          left: item.x,
          bottom: item.y,
          width: "40px",
          height: "40px",
          transform: "translate(-50%, 50%)",
          backgroundImage: "url(/assets/cannon_sheet.png)",
          // Row 3: Rocket, Lightning, Coin
          backgroundPosition: item.type === "BOOST" ? "0 66%" : item.type === "SUPER" ? "33% 66%" : "66% 66%",
          backgroundSize: "300%"
        } }, item.x);
      }),
      particlesRef.current.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: p.x,
        bottom: p.y,
        width: "5px",
        height: "5px",
        background: p.color,
        borderRadius: "50%"
      } }, i))
    ] }),
    (gameState === "AIM" || gameState === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 20, right: 20, background: "rgba(0,0,0,0.8)", padding: "20px", borderRadius: "10px", color: "white", zIndex: 50 }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        "SHOP (Coins: ",
        stats.arcadeCoins || 0,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px" }, children: Object.keys(PRICES).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => buy(k), style: { border: "1px solid #555", padding: "10px", borderRadius: "5px", cursor: "pointer", background: stats.arcadeCoins >= PRICES[k] * upgrades[k] ? "#333" : "#111" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          k.toUpperCase(),
          " LVL ",
          upgrades[k]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold" }, children: [
          "$",
          PRICES[k] * upgrades[k]
        ] })
      ] }, k)) })
    ] }),
    (gameState === "AIM" || gameState === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "white", fontSize: "3rem", textShadow: "0 0 10px black" }, children: gameState === "AIM" ? "CLICK TO AIM" : "CLICK TO FIRE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "300px", height: "30px", background: "#333", border: "3px solid white", margin: "0 auto", borderRadius: "15px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${gameState === "AIM" ? angle : power}%`, height: "100%", background: gameState === "AIM" ? "orange" : "red" } }) })
    ] }),
    gameState === "LANDED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", zIndex: 100 }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
        "DISTANCE: ",
        distance,
        "m"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
        "EARNED ",
        coinsEarned,
        " COINS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: resetGame, style: { background: "cyan", color: "black" }, children: "LAUNCH AGAIN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setGameState("MENU"), style: { background: "#555" }, children: "MENU" })
      ] })
    ] }),
    gameState === "MENU" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", zIndex: 100 }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "4rem", color: "gold" }, children: "BRO CANNON" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => resetGame(), style: { fontSize: "2rem", padding: "20px 50px", background: "gold", color: "black" }, children: "START" })
    ] })
  ] });
};
export {
  BroCannon as default
};
