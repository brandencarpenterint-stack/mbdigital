import { a as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, A as AnimatePresence, m as motion, t as triggerConfetti, f as feedService } from "./index-Du1n4boJ.js";
const WHEEL_RADIUS = 210;
const SEGMENTS = [
  { label: "10,000 CP", sub: "JACKPOT", value: 1e4, color: "#ffd700", text: "#000", icon: "👑" },
  { label: "100 CP", sub: "COINS", value: 100, color: "#00ffcc", text: "#000", icon: "🪙" },
  { label: "250 CP", sub: "COINS", value: 250, color: "#9d4edd", text: "#fff", icon: "🪙" },
  { label: "CRATE DROP", sub: "FREE CASE", value: 500, color: "#ff007f", text: "#fff", icon: "📦" },
  { label: "500 CP", sub: "COINS", value: 500, color: "#ff8800", text: "#000", icon: "🪙" },
  { label: "THE VOID", sub: "UNLUCKY", value: 0, color: "#1a1a28", text: "#ff0055", icon: "💀" },
  { label: "1,000 CP", sub: "BIG WIN", value: 1e3, color: "#00c6ff", text: "#000", icon: "💎" },
  { label: "50 CP", sub: "COINS", value: 50, color: "#ffffff", text: "#000", icon: "🪙" },
  { label: "2,500 CP", sub: "HIGH ROLLER", value: 2500, color: "#e0aaff", text: "#000", icon: "💎" },
  { label: "150 CP", sub: "COINS", value: 150, color: "#06d6a0", text: "#000", icon: "🪙" },
  { label: "750 CP", sub: "COINS", value: 750, color: "#ff4d6d", text: "#fff", icon: "🪙" },
  { label: "MYSTERY", sub: "300 CP", value: 300, color: "#7209b7", text: "#fff", icon: "🎁" }
];
const CyberWheel = () => {
  const { coins, addCoins, updateStat, incrementStat, userProfile, stats } = useGamification() || {};
  const { playAirhorn, playWin, playCrash } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [currentAngle, setCurrentAngle] = reactExports.useState(0);
  const [lastWin, setLastWin] = reactExports.useState(null);
  const [spinHistory, setSpinHistory] = reactExports.useState([]);
  const [freeSpinsLeft, setFreeSpinsLeft] = reactExports.useState(1);
  const SPIN_COST = 100;
  const playTickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
    }
  };
  const drawWheel = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const numSegments = SEGMENTS.length;
    const arc = 2 * Math.PI / numSegments;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    for (let i = 0; i < numSegments; i++) {
      const seg = SEGMENTS[i];
      const segAngle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = seg.color;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, WHEEL_RADIUS, segAngle, segAngle + arc);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.strokeStyle = "#0a0a14";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.save();
      ctx.rotate(segAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = seg.text;
      ctx.font = 'bold 13px "Orbitron", monospace';
      ctx.fillText(seg.icon + " " + seg.label, WHEEL_RADIUS - 22, 5);
      ctx.font = "9px monospace";
      ctx.fillStyle = seg.text === "#000" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)";
      ctx.fillText(seg.sub, WHEEL_RADIUS - 22, 17);
      ctx.restore();
    }
    ctx.strokeStyle = "#ff007f";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#ff007f";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, WHEEL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let i = 0; i < numSegments; i++) {
      const pegAngle = i * arc;
      const px = Math.cos(pegAngle) * WHEEL_RADIUS;
      const py = Math.sin(pegAngle) * WHEEL_RADIUS;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 44);
    hubGrad.addColorStop(0, "#2d3748");
    hubGrad.addColorStop(0.7, "#1a202c");
    hubGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(0, 255, 204, 0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 22);
    coreGrad.addColorStop(0, "#ffffff");
    coreGrad.addColorStop(0.3, "#00ffcc");
    coreGrad.addColorStop(1, "#052b2f");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy);
    ctx.lineTo(cx + 12, cy);
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx, cy + 12);
    ctx.stroke();
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - WHEEL_RADIUS - 8);
    ctx.lineTo(cx + 14, cy - WHEEL_RADIUS - 8);
    ctx.lineTo(cx, cy - WHEEL_RADIUS + 16);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  };
  reactExports.useEffect(() => {
    drawWheel(currentAngle);
  }, [currentAngle]);
  const spinWheel = () => {
    if (isSpinning) return;
    const isFree = freeSpinsLeft > 0;
    if (!isFree && coins < SPIN_COST) {
      try {
        playCrash();
      } catch (e) {
      }
      return;
    }
    if (isFree) {
      setFreeSpinsLeft(0);
    } else {
      if (addCoins) addCoins(-SPIN_COST);
    }
    if (incrementStat) {
      incrementStat("wheelSpins", 1);
      incrementStat("gamesPlayedCount", 1);
    }
    setIsSpinning(true);
    setLastWin(null);
    const rand = Math.random();
    let targetIndex = 0;
    if (rand < 0.02) targetIndex = 0;
    else if (rand < 0.06) targetIndex = 8;
    else if (rand < 0.14) targetIndex = 6;
    else if (rand < 0.22) targetIndex = 3;
    else if (rand < 0.32) targetIndex = 4;
    else if (rand < 0.44) targetIndex = 2;
    else if (rand < 0.58) targetIndex = 9;
    else if (rand < 0.74) targetIndex = 1;
    else if (rand < 0.88) targetIndex = 7;
    else targetIndex = 5;
    const numSegments = SEGMENTS.length;
    const arc = 2 * Math.PI / numSegments;
    const segmentCenter = targetIndex * arc + arc / 2;
    const targetWheelAngle = 3 * Math.PI / 2 - segmentCenter;
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
    const finalAngle = extraSpins + targetWheelAngle;
    const duration = 5500;
    const startTime = performance.now();
    const startAngle = currentAngle % (2 * Math.PI);
    const totalDistance = finalAngle - startAngle;
    let lastPegIndex = -1;
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 5);
      const angle = startAngle + totalDistance * ease;
      setCurrentAngle(angle);
      const currentPeg = Math.floor(angle / arc % numSegments);
      if (currentPeg !== lastPegIndex) {
        lastPegIndex = currentPeg;
        playTickSound();
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        handleSpinOutcome(SEGMENTS[targetIndex]);
      }
    };
    requestAnimationFrame(animate);
  };
  const handleSpinOutcome = (wonSegment) => {
    setLastWin(wonSegment);
    setSpinHistory((h) => [wonSegment, ...h.slice(0, 5)]);
    if (wonSegment.value > 0) {
      if (addCoins) addCoins(wonSegment.value);
      if (wonSegment.value >= 1e3) {
        try {
          playAirhorn();
          triggerConfetti();
        } catch (e) {
        }
        feedService.publish({
          text: "👑 " + (userProfile?.name || "HighRoller") + " won " + wonSegment.label + " on the CYBER WHEEL!",
          type: "jackpot"
        });
      } else {
        try {
          playWin();
        } catch (e) {
        }
      }
    } else {
      try {
        playCrash();
      } catch (e) {
      }
    }
    const currentHS = stats?.wheelHighScore || 0;
    if (wonSegment.value > currentHS && updateStat) {
      updateStat("wheelHighScore", wonSegment.value);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#070710",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    paddingBottom: "100px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "850px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      padding: "12px 20px",
      background: "rgba(15, 15, 28, 0.7)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 215, 0, 0.25)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/arcade", style: {
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0, 255, 204, 0.08)",
        border: "1px solid rgba(0, 255, 204, 0.3)",
        color: "#00ffcc",
        fontWeight: "800",
        fontSize: "0.85rem",
        letterSpacing: "1px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "ARCADE"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.6rem", color: "#ffd700", textShadow: "0 0 20px rgba(255, 215, 0, 0.6)", letterSpacing: "3px", fontWeight: "900" }, children: "CYBER WHEEL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#00ffcc", letterSpacing: "2px", opacity: 0.8, textTransform: "uppercase" }, children: "HIGH ROLLER APEX • 10,000 CP JACKPOT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        background: "rgba(255, 215, 0, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        borderRadius: "10px",
        color: "#ffd700",
        fontWeight: "800",
        fontSize: "0.9rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ffd700",
          boxShadow: "0 0 8px #ffd700"
        } }),
        coins.toLocaleString(),
        " CP"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "30px",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      maxWidth: "900px",
      width: "100%"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "relative",
        width: "460px",
        height: "460px",
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 460,
          height: 460,
          style: { maxWidth: "100%", height: "auto", display: "block" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        flex: "1 1 280px",
        maxWidth: "350px",
        background: "linear-gradient(145deg, #12121e, #0c0c16)",
        border: "1px solid #28283c",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", letterSpacing: "1px" }, children: "STATUS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: freeSpinsLeft > 0 ? "#00ffcc" : "#ffd700", fontWeight: "900", fontSize: "1.2rem", marginTop: "4px" }, children: freeSpinsLeft > 0 ? "🎁 FREE DAILY SPIN" : `HIGH ROLLER (${SPIN_COST} CP)` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: spinWheel,
            disabled: isSpinning || freeSpinsLeft === 0 && coins < SPIN_COST,
            style: {
              background: "linear-gradient(135deg, #ffd700, #ff007f)",
              color: "#000",
              padding: "18px",
              fontSize: "1.3rem",
              fontWeight: "900",
              letterSpacing: "2px",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)"
            },
            children: isSpinning ? "SPINNING..." : freeSpinsLeft > 0 ? "SPIN FREE!" : `SPIN (${SPIN_COST} CP)`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lastWin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            style: {
              background: lastWin.value > 0 ? "rgba(0, 255, 204, 0.15)" : "rgba(255, 0, 85, 0.15)",
              border: "1px solid " + (lastWin.value > 0 ? "#00ffcc" : "#ff0055"),
              borderRadius: "12px",
              padding: "12px",
              marginTop: "5px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.8rem" }, children: lastWin.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: "900", fontSize: "1.1rem" }, children: lastWin.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: lastWin.value > 0 ? "#00ffcc" : "#ff0055", fontSize: "0.8rem", fontWeight: "bold" }, children: lastWin.value > 0 ? `+${lastWin.value.toLocaleString()} CP CLAIMED!` : "BETTER LUCK NEXT TIME!" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px" }, children: "RECENT SPINS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px", justifyContent: "center" }, children: spinHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: "0.7rem" }, children: "No spins yet..." }) : spinHistory.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { background: s.color, color: s.text, padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "bold" }, children: [
            s.icon,
            " ",
            s.label
          ] }, idx)) })
        ] })
      ] })
    ] })
  ] });
};
export {
  CyberWheel as default
};
