import { b as useGamification, a as usePocketBro, g as useToast, c as useRetroSound, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, L as Link, P as PocketPet, S as SquishyButton } from "./index-BW7aM1MD.js";
const HustleMode = () => {
  const { addCoins, incrementStat, shopState } = useGamification();
  const { stats } = usePocketBro();
  const equippedSkin = shopState?.equipped?.pocketbro || null;
  const { showToast } = useToast();
  const { playWin, playCollect, playClick } = useRetroSound();
  const [timeLeft, setTimeLeft] = reactExports.useState(25 * 60);
  const [isActive, setIsActive] = reactExports.useState(false);
  const [mode, setMode] = reactExports.useState("WORK");
  const [completedSessions, setCompletedSessions] = reactExports.useState(0);
  const [deepFocus, setDeepFocus] = reactExports.useState(false);
  const totalTime = mode === "WORK" ? 25 * 60 : 5 * 60;
  const progress = (totalTime - timeLeft) / totalTime * 100;
  reactExports.useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "WORK") {
        handleWorkComplete();
      } else {
        handleBreakComplete();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);
  const handleWorkComplete = () => {
    addCoins(300);
    incrementStat("hustleSessions", 1);
    setCompletedSessions((s) => s + 1);
    playWin();
    showToast("HUSTLE COMPLETE! +300 COINS", "success");
    setMode("BREAK");
    setTimeLeft(5 * 60);
    setDeepFocus(false);
  };
  const handleBreakComplete = () => {
    playCollect();
    showToast("BREAK OVER! BACK TO WORK.", "info");
    setMode("WORK");
    setTimeLeft(25 * 60);
  };
  const toggleTimer = () => {
    playClick();
    setIsActive(!isActive);
  };
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "WORK" ? 25 * 60 : 5 * 60);
    setDeepFocus(false);
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const themeColor = mode === "WORK" ? "var(--neon-pink)" : "var(--neon-green)";
  const bgColor = mode === "WORK" ? "#1a0b2e" : "#002222";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    background: deepFocus ? "#000" : `linear-gradient(to bottom, ${bgColor}, #000)`,
    minHeight: "100vh",
    padding: "20px",
    color: "white",
    fontFamily: '"Orbitron", sans-serif',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    transition: "background 1s ease"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: !deepFocus && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        style: { position: "absolute", top: 20, left: 20, zIndex: 10 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.5rem", opacity: 0.8 }, children: "⬅" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      opacity: deepFocus ? 0.05 : 0.2,
      transform: "perspective(500px) rotateX(20deg)",
      transformOrigin: "top",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        layout: true,
        animate: { scale: deepFocus ? 1.1 : 1 },
        transition: { duration: 0.5 },
        className: "glass-panel",
        style: {
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
          textAlign: "center",
          border: `2px solid ${themeColor}`,
          background: deepFocus ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)",
          boxShadow: isActive ? `0 0 50px ${themeColor}60` : `0 0 20px ${themeColor}20`,
          marginTop: "-50px",
          position: "relative",
          zIndex: 20
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { y: isActive ? [0, -5, 0] : 0 },
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              style: {
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: "4px",
                background: themeColor,
                color: "#000",
                fontWeight: "900",
                fontSize: "1rem",
                marginBottom: "30px",
                boxShadow: `0 0 20px ${themeColor}`,
                textTransform: "uppercase",
                letterSpacing: "2px"
              },
              children: mode === "WORK" ? "🔥 NEON HUSTLE" : "☕ SYSTEM RECHARGE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            position: "relative"
          }, children: [
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: `2px dashed ${themeColor}`,
              animation: "spin 10s linear infinite",
              opacity: 0.5
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "150px", height: "150px", filter: deepFocus ? "drop-shadow(0 0 20px white)" : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PocketPet,
              {
                stage: stats.stage,
                type: stats.type || "SOOT",
                mood: isActive ? "happy" : "neutral",
                isSleeping: mode === "BREAK",
                skin: equippedSkin
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: "5.5rem",
            fontWeight: "bold",
            fontFamily: "monospace",
            color: themeColor,
            textShadow: `0 0 30px ${themeColor}`,
            marginBottom: "10px",
            letterSpacing: "-4px",
            lineHeight: 1
          }, children: formatTime(timeLeft) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "6px", background: "#333", borderRadius: "3px", marginBottom: "40px", overflow: "hidden", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${progress}%` },
              style: {
                height: "100%",
                background: themeColor,
                boxShadow: `0 0 15px ${themeColor}`
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", justifyContent: "center", marginBottom: "30px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SquishyButton,
              {
                onClick: toggleTimer,
                style: {
                  fontSize: "1.2rem",
                  padding: "15px 40px",
                  background: isActive ? "transparent" : themeColor,
                  color: isActive ? themeColor : "#000",
                  fontWeight: "bold",
                  border: `2px solid ${themeColor}`,
                  boxShadow: `0 0 20px ${themeColor}40`
                },
                children: isActive ? "PAUSE" : "INITIATE"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: resetTimer,
                style: { background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "0.9rem", fontFamily: "inherit" },
                children: "RESET"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", opacity: isActive ? 1 : 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { fontSize: "0.8rem", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: deepFocus,
                onChange: (e) => setDeepFocus(e.target.checked),
                style: { accentColor: themeColor }
              }
            ),
            "DEEP FOCUS MODE"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "center", gap: "30px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", letterSpacing: "1px" }, children: "SESSIONS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.8rem", fontWeight: "bold", color: "white" }, children: completedSessions })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            ` })
  ] });
};
export {
  HustleMode as default
};
