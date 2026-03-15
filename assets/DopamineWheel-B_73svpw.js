import { E as animateVisualElement, F as setTarget, p as useConstant, v as useIsomorphicLayoutEffect, b as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, t as triggerConfetti } from "./index-I_jIDthF.js";
function stopAnimation(visualElement) {
  visualElement.values.forEach((value) => value.stop());
}
function setVariants(visualElement, variantLabels) {
  const reversedLabels = [...variantLabels].reverse();
  reversedLabels.forEach((key) => {
    const variant = visualElement.getVariant(key);
    variant && setTarget(visualElement, variant);
    if (visualElement.variantChildren) {
      visualElement.variantChildren.forEach((child) => {
        setVariants(child, variantLabels);
      });
    }
  });
}
function setValues(visualElement, definition) {
  if (Array.isArray(definition)) {
    return setVariants(visualElement, definition);
  } else if (typeof definition === "string") {
    return setVariants(visualElement, [definition]);
  } else {
    setTarget(visualElement, definition);
  }
}
function animationControls() {
  const subscribers = /* @__PURE__ */ new Set();
  const controls = {
    subscribe(visualElement) {
      subscribers.add(visualElement);
      return () => void subscribers.delete(visualElement);
    },
    start(definition, transitionOverride) {
      const animations = [];
      subscribers.forEach((visualElement) => {
        animations.push(animateVisualElement(visualElement, definition, {
          transitionOverride
        }));
      });
      return Promise.all(animations);
    },
    set(definition) {
      return subscribers.forEach((visualElement) => {
        setValues(visualElement, definition);
      });
    },
    stop() {
      subscribers.forEach((visualElement) => {
        stopAnimation(visualElement);
      });
    },
    mount() {
      return () => {
        controls.stop();
      };
    }
  };
  return controls;
}
function useAnimationControls() {
  const controls = useConstant(animationControls);
  useIsomorphicLayoutEffect(controls.mount, []);
  return controls;
}
const useAnimation = useAnimationControls;
const SPIN_COST = 100;
const SEGMENTS = [
  { label: "BANKRUPT", type: "loss", value: 0, color: "#ff0055", probability: 5 },
  { label: "50", type: "win", value: 50, color: "#333333", probability: 15 },
  { label: "SPIN AGAIN", type: "special", value: 0, color: "#aa00ff", probability: 10 },
  { label: "100", type: "win", value: 100, color: "#333333", probability: 20 },
  { label: "500", type: "win", value: 500, color: "#00f2fe", probability: 5 },
  { label: "10", type: "win", value: 10, color: "#333333", probability: 15 },
  { label: "10,000", type: "jackpot", value: 1e4, color: "#FFD700", probability: 0.1 },
  { label: "50", type: "win", value: 50, color: "#333333", probability: 15 },
  { label: "250", type: "win", value: 250, color: "#00f2fe", probability: 5 },
  { label: "BANKRUPT", type: "loss", value: 0, color: "#ff0055", probability: 5 },
  { label: "1000", type: "big_win", value: 1e3, color: "#00f2fe", probability: 0.9 },
  { label: "10", type: "win", value: 10, color: "#333333", probability: 4 }
];
const totalProb = SEGMENTS.reduce((sum, seg) => sum + seg.probability, 0);
const NORMALIZED_SEGMENTS = SEGMENTS.map((seg) => ({ ...seg, normProb: seg.probability / totalProb }));
const DopamineWheel = () => {
  const { coins, addCoins } = useGamification();
  const { showToast } = useToast();
  const { playClick, playCoin, playWin, playError, playFanfare, playBoop } = useRetroSound();
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [rotation, setRotation] = reactExports.useState(0);
  const [lastPrize, setLastPrize] = reactExports.useState(null);
  const controls = useAnimation();
  const audioCtxRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);
  const playTick = () => {
    try {
      if (!audioCtxRef.current) return;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.05);
    } catch (e) {
    }
  };
  const spin = async () => {
    if (isSpinning) return;
    if (coins < SPIN_COST) {
      playError();
      showToast("NOT ENOUGH CREDITS", "error");
      return;
    }
    addCoins(-SPIN_COST);
    setIsSpinning(true);
    setLastPrize(null);
    playBoop();
    const randomVal = Math.random();
    let probSum = 0;
    let winningIndex = 0;
    for (let i = 0; i < NORMALIZED_SEGMENTS.length; i++) {
      probSum += NORMALIZED_SEGMENTS[i].normProb;
      if (randomVal <= probSum) {
        winningIndex = i;
        break;
      }
    }
    const degreesPerSegment = 360 / SEGMENTS.length;
    const spins = 5;
    const segmentOffset = winningIndex * degreesPerSegment;
    const randomOffsetWithinSegment = Math.random() * (degreesPerSegment * 0.8) - degreesPerSegment * 0.4;
    const targetRotation = rotation + 360 * spins - segmentOffset + randomOffsetWithinSegment;
    let tickInterval = setInterval(playTick, 100);
    setTimeout(() => clearInterval(tickInterval), 1500);
    setTimeout(() => {
      tickInterval = setInterval(playTick, 300);
    }, 1500);
    setTimeout(() => clearInterval(tickInterval), 3e3);
    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4,
        ease: [0.15, 0.85, 0.15, 1]
        // Custom slow down
      }
    });
    clearInterval(tickInterval);
    setRotation(targetRotation % 360);
    const wonSegment = SEGMENTS[winningIndex];
    setLastPrize(wonSegment);
    handleWin(wonSegment);
    setIsSpinning(false);
  };
  const handleWin = (segment) => {
    if (segment.type === "jackpot") {
      playFanfare();
      triggerConfetti();
      triggerConfetti();
      addCoins(segment.value);
      showToast(`JACKPOT! +${segment.value} COINS!`, "win");
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
    } else if (segment.type === "big_win") {
      playWin();
      triggerConfetti();
      addCoins(segment.value);
      showToast(`BIG WIN! +${segment.value} COINS!`, "win");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else if (segment.type === "win") {
      if (segment.value >= SPIN_COST) {
        playCoin();
        if (navigator.vibrate) navigator.vibrate(50);
      } else {
        playClick();
      }
      addCoins(segment.value);
    } else if (segment.type === "special") {
      playBoop();
      showToast("SPIN AGAIN!", "info");
      addCoins(SPIN_COST);
    } else {
      playError();
      if (navigator.vibrate) navigator.vibrate(200);
      showToast("BANKRUPT", "error");
    }
  };
  const radius = 200;
  const center = 210;
  const renderSegments = reactExports.useMemo(() => {
    const segs = [];
    const numSegments = SEGMENTS.length;
    const angle = 360 / numSegments;
    for (let i = 0; i < numSegments; i++) {
      const startAngle = (i * angle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z"
      ].join(" ");
      const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180);
      const textX = center + radius * 0.65 * Math.cos(midAngle);
      const textY = center + radius * 0.65 * Math.sin(midAngle);
      const textRotate = i * angle + angle / 2;
      segs.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: pathData,
              fill: SEGMENTS[i].color,
              stroke: "#111",
              strokeWidth: "2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: textX,
              y: textY,
              fill: "white",
              fontFamily: '"Orbitron", sans-serif',
              fontSize: SEGMENTS[i].type === "jackpot" ? "18px" : "14px",
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform: `rotate(${textRotate}, ${textX}, ${textY})`,
              style: { textShadow: "1px 1px 2px black" },
              children: SEGMENTS[i].label
            }
          )
        ] }, i)
      );
    }
    return segs;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #2b003b 0%, #000 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "60px",
    fontFamily: '"Rajdhani", sans-serif',
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { position: "absolute", top: 20, left: 20, color: "white", textDecoration: "none", fontSize: "1.2rem" }, children: "← BACK" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { color: "white", textShadow: "0 0 20px var(--neon-pink)", fontFamily: '"Orbitron", sans-serif', fontSize: "3rem", margin: "0 0 10px 0" }, children: [
      "WHEEL OF ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-pink)" }, children: "DEGEN" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(0,0,0,0.5)",
      padding: "10px 20px",
      borderRadius: "20px",
      border: "1px solid var(--neon-gold)",
      color: "var(--neon-gold)",
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginBottom: "40px",
      boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)"
    }, children: [
      "BALANCE: 🪙 ",
      coins.toLocaleString()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 420, height: 420, filter: "drop-shadow(0 0 30px rgba(255,0,85,0.4))" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        top: -20,
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "20px solid transparent",
        borderRight: "20px solid transparent",
        borderTop: "40px solid var(--neon-gold)",
        zIndex: 10,
        filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.5))"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          animate: controls,
          style: { width: 420, height: 420 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "420", height: "420", viewBox: "0 0 420 420", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "210", cy: "210", r: "205", fill: "#111", stroke: "#ff0055", strokeWidth: "10" }),
            renderSegments,
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "210", cy: "210", r: "30", fill: "#222", stroke: "var(--neon-gold)", strokeWidth: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "210", cy: "210", r: "10", fill: "var(--neon-gold)" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "60px", marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center" }, children: lastPrize && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: [1.2, 1], opacity: 1 },
        style: {
          fontSize: "2rem",
          fontWeight: "900",
          color: lastPrize.type === "loss" ? "#ff0055" : "var(--neon-green)",
          textShadow: `0 0 20px ${lastPrize.type === "loss" ? "#ff0055" : "var(--neon-green)"}`,
          fontFamily: '"Orbitron", sans-serif'
        },
        children: lastPrize.type === "loss" ? "💀 BANKRUPT 💀" : lastPrize.type === "special" ? "🔄 FREE SPIN 🔄" : `+${lastPrize.value} COINS`
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: spin,
        disabled: isSpinning,
        style: {
          marginTop: "20px",
          padding: "20px 60px",
          fontSize: "2rem",
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: "900",
          color: "white",
          background: isSpinning ? "#555" : "linear-gradient(135deg, #ff0055 0%, #aa00ff 100%)",
          border: "none",
          borderRadius: "50px",
          cursor: isSpinning ? "default" : "pointer",
          boxShadow: isSpinning ? "none" : "0 10px 30px rgba(255, 0, 85, 0.5)",
          opacity: isSpinning ? 0.7 : 1,
          textTransform: "uppercase"
        },
        children: isSpinning ? "SPINNING..." : `SPIN (-${SPIN_COST})`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#888", marginTop: "15px", fontSize: "0.9rem" }, children: "WARNING: HIGHLY ADDICTIVE. HOUSE ALWAYS WINS." })
  ] });
};
export {
  DopamineWheel as default
};
