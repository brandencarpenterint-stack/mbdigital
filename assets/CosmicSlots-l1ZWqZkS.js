import { a as useGamification, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, L as Link } from "./index-_TtGPJrl.js";
import { feedService } from "./feed-DKmBZMvR.js";
const SYMBOLS = [
  { id: 0, name: "Diamond", weight: 20 },
  { id: 1, name: "Seven", weight: 5 },
  { id: 2, name: "Cherry", weight: 30 },
  { id: 3, name: "Bell", weight: 25 },
  { id: 4, name: "Bar", weight: 15 },
  { id: 5, name: "Lemon", weight: 30 },
  { id: 6, name: "Coin", weight: 25 },
  { id: 7, name: "Wild", weight: 2 }
];
const CosmicSlots = () => {
  const { coins, spendCoins, addCoins, updateStat, userProfile } = useGamification() || { coins: 0 };
  const { playJump, playCollect, playWin } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const [gameState, setGameState] = reactExports.useState("IDLE");
  const [winAmount, setWinAmount] = reactExports.useState(0);
  const reelsRef = reactExports.useRef([
    { offset: 0, speed: 0, symbols: [], stopping: false },
    { offset: 0, speed: 0, symbols: [], stopping: false },
    { offset: 0, speed: 0, symbols: [], stopping: false }
  ]);
  const sheetRef = reactExports.useRef(null);
  const frameRef = reactExports.useRef(null);
  const particlesRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/slots_sheet.png";
    sheetRef.current = img;
    reelsRef.current.forEach((r) => {
      r.symbols = Array(5).fill(0).map(() => getRandomSymbol().id);
    });
    requestAnimationFrame(drawLoop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
  const getRandomSymbol = () => {
    let r = Math.random() * 152;
    for (let s of SYMBOLS) {
      r -= s.weight;
      if (r <= 0) return s;
    }
    return SYMBOLS[0];
  };
  const spin = () => {
    if (gameState === "SPINNING") return;
    if (coins < 10) return;
    if (spendCoins(10)) {
      setGameState("SPINNING");
      setWinAmount(0);
      playJump();
      reelsRef.current.forEach((r, i) => {
        r.speed = 30 + i * 5;
        r.stopping = false;
        setTimeout(() => stopReel(i), 1e3 + i * 500);
      });
    }
  };
  const stopReel = (index) => {
    reelsRef.current[index].stopping = true;
  };
  const checkWin = () => {
    const line = reelsRef.current.map((r) => r.symbols[2]);
    const s1 = SYMBOLS[line[0]];
    const s2 = SYMBOLS[line[1]];
    const s3 = SYMBOLS[line[2]];
    let payout = 0;
    if (s1.id === s2.id && s2.id === s3.id) {
      payout = (100 - s1.weight) * 5;
    } else if (s1.name === "Wild" && s2.name === "Wild" && s3.name === "Wild") {
      payout = 1e3;
    } else if (s1.name === "Seven" && s2.name === "Seven") payout = 50;
    else if (s1.name === "Cherry" && s2.name === "Cherry") payout = 15;
    if (payout > 0) {
      setWinAmount(payout);
      addCoins(payout);
      playWin();
      spawnParticles();
      setGameState("WIN");
      if (payout > 500) feedService.publish(`Jackpot! ${payout} Coins!`, "win", userProfile?.name);
      updateStat("slotsBiggestWin", payout);
    } else {
      setGameState("IDLE");
    }
  };
  const spawnParticles = () => {
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push({
        x: 400,
        y: 300,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 1,
        color: Math.random() > 0.5 ? "gold" : "yellow"
      });
    }
  };
  const drawLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sheet = sheetRef.current;
    const SW = sheet && sheet.complete ? sheet.width / 3 : 50;
    const SH = sheet && sheet.complete ? sheet.height / 3 : 50;
    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    grad.addColorStop(0, "#220033");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "#333";
    ctx.fillRect(150, 100, 500, 400);
    ctx.fillStyle = "#000";
    ctx.fillRect(170, 120, 460, 300);
    reelsRef.current.forEach((reel, i) => {
      const x = 200 + i * 140;
      if (reel.speed > 0) {
        reel.offset += reel.speed;
        if (reel.offset >= SH) {
          reel.offset -= SH;
          reel.symbols.pop();
          reel.symbols.unshift(getRandomSymbol().id);
        }
        if (reel.stopping) {
          if (reel.offset < 10 && reel.speed < 40) {
            reel.offset = 0;
            reel.speed = 0;
            playCollect();
            if (i === 2) checkWin();
            else if (i === 2 && gameStateRef.current === "SPINNING") checkWin();
          }
        }
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 130, 120, 280);
      ctx.clip();
      reel.symbols.forEach((sid, idx) => {
        const sy = 130 + (idx - 1) * 100 + reel.offset;
        const col = sid % 3;
        const row = Math.floor(sid / 3);
        if (sheet && sheet.complete) {
          ctx.drawImage(sheet, col * SW, row * SH, SW, SH, x + 10, sy, 100, 100);
        } else {
          ctx.fillStyle = "white";
          ctx.fillText(sid, x + 50, sy + 50);
        }
      });
      ctx.restore();
      ctx.strokeStyle = "#555";
      ctx.beginPath();
      ctx.moveTo(x + 130, 120);
      ctx.lineTo(x + 130, 420);
      ctx.stroke();
    });
    ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(170, 270);
    ctx.lineTo(630, 270);
    ctx.stroke();
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5;
      p.life -= 0.02;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
    frameRef.current = requestAnimationFrame(drawLoop);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#111" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "gold", fontFamily: '"Orbitron"', textShadow: "0 0 10px red" }, children: "COSMIC SPIN" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: 800, height: 600, style: { maxWidth: "100%" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: spin,
          disabled: gameState === "SPINNING",
          style: { fontSize: "2rem", padding: "20px 60px", background: gameState === "SPINNING" ? "#555" : "red", color: "white" },
          children: "SPIN (10c)"
        }
      ) }),
      winAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)", color: "gold", fontSize: "4rem", fontWeight: "bold", textShadow: "0 0 20px yellow" }, children: [
        "WIN! ",
        winAmount
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, right: 20, color: "white", fontSize: "1.5rem" }, children: [
        "COINS: ",
        coins
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: 20, left: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { style: { background: "#333" }, children: "EXIT" }) })
    ] })
  ] });
};
export {
  CosmicSlots as default
};
