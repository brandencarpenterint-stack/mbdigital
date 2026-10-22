import { a as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, A as AnimatePresence, m as motion, t as triggerConfetti, f as feedService } from "./index-9iIJqYUv.js";
const WHEEL_RADIUS = 210;
const SEGMENTS = [
  { label: "10,000 CP", sub: "DEFCON JACKPOT", value: 1e4, color: "#ffd700", text: "#000", type: "CROWN" },
  { label: "100 CP", sub: "CYBER COINS", value: 100, color: "#00ffcc", text: "#000", type: "COIN" },
  { label: "250 CP", sub: "CYBER COINS", value: 250, color: "#9d4edd", text: "#fff", type: "COIN" },
  { label: "CRATE DROP", sub: "TACTICAL CASE", value: 500, color: "#ff007f", text: "#fff", type: "CRATE" },
  { label: "500 CP", sub: "CYBER COINS", value: 500, color: "#ff8800", text: "#000", type: "COIN" },
  { label: "THE VOID", sub: "DEFCON HAZARD", value: 0, color: "#1a1a28", text: "#ff0055", type: "HAZARD" },
  { label: "1,000 CP", sub: "HIGH ROLLER", value: 1e3, color: "#00c6ff", text: "#000", type: "DIAMOND" },
  { label: "50 CP", sub: "CYBER COINS", value: 50, color: "#ffffff", text: "#000", type: "COIN" },
  { label: "2,500 CP", sub: "MEGA BOUNTY", value: 2500, color: "#e0aaff", text: "#000", type: "DIAMOND" },
  { label: "150 CP", sub: "CYBER COINS", value: 150, color: "#06d6a0", text: "#000", type: "COIN" },
  { label: "750 CP", sub: "CYBER COINS", value: 750, color: "#ff4d6d", text: "#fff", type: "COIN" },
  { label: "MYSTERY", sub: "BLACK-BOX 300", value: 300, color: "#7209b7", text: "#fff", type: "CRATE" }
];
const renderPrizeIcon = (type, size = 18, color = "currentColor") => {
  if (type === "CROWN") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: color, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" }) });
  }
  if (type === "DIAMOND") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: color, children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "6 3 18 3 22 9 12 22 2 9 6 3" }) });
  }
  if (type === "CRATE") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "9", x2: "21", y2: "9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "9", y1: "21", x2: "9", y2: "9" })
    ] });
  }
  if (type === "HAZARD") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: color })
  ] });
};
const CyberWheel = () => {
  const { coins = 0, addCoins, updateStat, incrementStat, userProfile } = useGamification() || {};
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
      const px = WHEEL_RADIUS - 16;
      const py = 0;
      ctx.fillStyle = seg.text;
      ctx.strokeStyle = seg.text;
      if (seg.type === "CROWN") {
        ctx.beginPath();
        ctx.moveTo(px - 5, py + 4);
        ctx.lineTo(px + 5, py + 4);
        ctx.lineTo(px + 4, py - 4);
        ctx.lineTo(px + 1.5, py);
        ctx.lineTo(px, py - 5);
        ctx.lineTo(px - 1.5, py);
        ctx.lineTo(px - 4, py - 4);
        ctx.closePath();
        ctx.fill();
      } else if (seg.type === "DIAMOND") {
        ctx.beginPath();
        ctx.moveTo(px, py - 5);
        ctx.lineTo(px + 4.5, py);
        ctx.lineTo(px, py + 5);
        ctx.lineTo(px - 4.5, py);
        ctx.closePath();
        ctx.fill();
      } else if (seg.type === "CRATE") {
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px - 4, py - 4, 8, 8);
        ctx.beginPath();
        ctx.moveTo(px - 4, py);
        ctx.lineTo(px + 4, py);
        ctx.stroke();
      } else if (seg.type === "HAZARD") {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px - 4.5, py + 4);
        ctx.lineTo(px + 4.5, py + 4);
        ctx.lineTo(px, py - 4.5);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.textAlign = "right";
      ctx.fillStyle = seg.text;
      ctx.font = 'bold 12px "Orbitron", monospace';
      ctx.fillText(seg.label, WHEEL_RADIUS - 26, 4);
      ctx.font = "8px monospace";
      ctx.fillStyle = seg.text === "#000" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)";
      ctx.fillText(seg.sub, WHEEL_RADIUS - 26, 16);
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
    if (freeSpinsLeft > 0) {
      setFreeSpinsLeft((prev) => prev - 1);
    } else {
      if (coins < SPIN_COST) return;
      if (addCoins) addCoins(-SPIN_COST);
    }
    setIsSpinning(true);
    setLastWin(null);
    const totalSpins = 5 + Math.random() * 4;
    const targetAngle = currentAngle + totalSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4e3;
    const startTime = performance.now();
    const startAngle = currentAngle;
    let lastPegPassed = -1;
    const numSegments = SEGMENTS.length;
    const arc = 2 * Math.PI / numSegments;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newAngle = startAngle + (targetAngle - startAngle) * easeOut;
      setCurrentAngle(newAngle);
      const normalizedAngle = (newAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentPeg = Math.floor(normalizedAngle / arc);
      if (currentPeg !== lastPegPassed) {
        playTickSound();
        lastPegPassed = currentPeg;
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalAngle = (newAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = 3 * Math.PI / 2;
        let relativeAngle = pointerAngle - finalAngle;
        relativeAngle = (relativeAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(relativeAngle / arc);
        const wonItem = SEGMENTS[winningIndex];
        setLastWin(wonItem);
        setSpinHistory((prev) => [wonItem, ...prev.slice(0, 4)]);
        if (wonItem.value > 0) {
          if (addCoins) addCoins(wonItem.value);
          if (wonItem.value >= 1e3) {
            playAirhorn?.();
            triggerConfetti?.();
          } else {
            playWin?.();
          }
          if (incrementStat) incrementStat("wheelWins", 1);
        } else {
          playCrash?.();
        }
        if (updateStat && incrementStat) {
          incrementStat("wheelSpinsCount", 1);
        }
        feedService.broadcast({
          type: wonItem.value >= 1e3 ? "JACKPOT" : "PLAY",
          game: "Cyber Wheel",
          user: userProfile?.name || "HighRoller",
          amount: wonItem.value,
          action: wonItem.value > 0 ? `won ${wonItem.label}` : "hit the Void"
        });
      }
    };
    requestAnimationFrame(animate);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #111124 0%, #06060c 100%)",
    color: "#fff",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "900px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/arcade",
          style: {
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 19 5 12 12 5" })
            ] }),
            "ARCADE"
          ]
        }
      ),
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
        (coins || 0).toLocaleString(),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: freeSpinsLeft > 0 ? "#00ffcc" : "#ffd700", fontWeight: "900", fontSize: "1.2rem", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }, children: freeSpinsLeft > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#00ffcc", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 12 20 22 4 22 4 12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "7", width: "20", height: "5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "22", x2: "12", y2: "7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" })
            ] }),
            "FREE DAILY SPIN"
          ] }) : `HIGH ROLLER (${SPIN_COST} CP)` })
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
              fontSize: "1.15rem",
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", marginBottom: "4px", color: lastWin.value > 0 ? "#00ffcc" : "#ff0055" }, children: renderPrizeIcon(lastWin.type, 26, lastWin.value > 0 ? "#00ffcc" : "#ff0055") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: "900", fontSize: "1.1rem" }, children: lastWin.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: lastWin.value > 0 ? "#00ffcc" : "#ff0055", fontSize: "0.8rem", fontWeight: "bold" }, children: lastWin.value > 0 ? `+${lastWin.value.toLocaleString()} CP CLAIMED!` : "BETTER LUCK NEXT TIME!" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px" }, children: "RECENT SPINS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }, children: spinHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: "0.7rem" }, children: "No spins yet..." }) : spinHistory.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
            background: s.color,
            color: s.text,
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "0.68rem",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }, children: [
            renderPrizeIcon(s.type, 12, s.text),
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
