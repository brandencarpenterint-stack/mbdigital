import { a as useGamification, r as reactExports, u as useRetroSound, j as jsxRuntimeExports, A as AnimatePresence, m as motion, b as SquishyButton, t as triggerConfetti } from "./index-COldL9OR.js";
import { R as RewardedSponsorModal } from "./RewardedSponsorModal-Dz5jzRvM.js";
const UniversalGameOver = ({
  gameName = "ARCADE",
  score,
  bestScore,
  coinsEarned = 0,
  xpEarned = 100,
  onReplay,
  onHome,
  onRevive,
  children
}) => {
  const { getLevelInfo, addCoins } = useGamification() || {};
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const [hasClaimedSponsor, setHasClaimedSponsor] = reactExports.useState(false);
  const { playCoin, playWin, playBeep } = useRetroSound();
  const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const isNewRecord = score > (bestScore || 0);
  const finalCoins = Math.max(coinsEarned * 3, Math.floor(score * 1.5));
  const [displayScore, setDisplayScore] = reactExports.useState(0);
  const [displayCoins, setDisplayCoins] = reactExports.useState(0);
  const [showLevelUp, setShowLevelUp] = reactExports.useState(false);
  reactExports.useEffect(() => {
    playBeep();
    let startTime = null;
    const duration = 1500;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const runtime = timestamp - startTime;
      const relativeProgress = Math.min(runtime / duration, 1);
      const ease = 1 - (1 - relativeProgress) * (1 - relativeProgress);
      setDisplayScore(Math.floor(ease * score));
      setDisplayCoins(Math.floor(ease * finalCoins));
      if (relativeProgress < 1) {
        requestAnimationFrame(animate);
        if (Math.random() > 0.8) playCoin();
      } else {
        setDisplayScore(score);
        setDisplayCoins(finalCoins);
        if (progress < 15 && xpEarned > 0) {
          setShowLevelUp(true);
          triggerConfetti();
          playWin();
        } else if (isNewRecord) {
          triggerConfetti();
          playWin();
        }
      }
    };
    requestAnimationFrame(animate);
  }, [score, finalCoins]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(15px)",
    zIndex: 1e3,
    fontFamily: '"Press Start 2P", monospace'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showLevelUp && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 2, opacity: 0 },
        style: {
          position: "absolute",
          top: "15%",
          fontSize: "4rem",
          color: "#00ffcc",
          textShadow: "0 0 50px #00ffcc",
          zIndex: 1100,
          textAlign: "center"
        },
        children: [
          "LEVEL UP!",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.5rem", color: "white" }, children: [
            "YOU ARE NOW RANK ",
            level
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.8, y: 50, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        transition: { type: "spring", bounce: 0.5 },
        className: "glass-panel",
        style: {
          padding: "40px",
          textAlign: "center",
          width: "90%",
          maxWidth: "500px",
          border: isNewRecord ? "2px solid gold" : "2px solid rgba(0, 255, 204, 0.5)",
          background: isNewRecord ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,0,0,0.9))" : "rgba(20,20,30,0.95)",
          boxShadow: isNewRecord ? "0 0 80px rgba(255,215,0,0.4)" : "0 20px 50px rgba(0,255,204,0.2)",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.05) 2px, rgba(0,255,204,0.05) 4px)", pointerEvents: "none" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1rem", color: "#888", letterSpacing: "4px", marginBottom: "10px" }, children: gameName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
            fontSize: "3rem",
            margin: "0 0 20px 0",
            background: isNewRecord ? "linear-gradient(to right, gold, #ffaa00)" : "linear-gradient(to right, #00ffcc, #ff00ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
            textShadow: isNewRecord ? "0 0 20px rgba(255,215,0,0.5)" : "none"
          }, children: isNewRecord ? "NEW RECORD" : "GAME OVER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.6)", padding: "20px", borderRadius: "15px", border: "1px solid #333" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "5px" }, children: "SCORE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", fontWeight: "bold", color: "white" }, children: displayScore })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.6)", padding: "20px", borderRadius: "15px", border: "1px solid #333" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "5px" }, children: "BEST" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", fontWeight: "bold", color: "gold" }, children: isNewRecord ? displayScore : bestScore })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,255,204,0.05)", padding: "20px", borderRadius: "15px", marginBottom: "30px", border: "1px solid rgba(0,255,204,0.2)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "1.2rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00ffcc" }, children: [
                "+ ",
                xpEarned,
                " XP"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "gold" }, children: [
                "+ ",
                displayCoins,
                " 🪙"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left", fontSize: "0.7rem", color: "#888", marginBottom: "5px", display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "LVL ",
                level
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Math.floor(progress),
                "% TO NEXT"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "15px", background: "#111", borderRadius: "10px", overflow: "hidden", border: "1px solid #333" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { width: 0 },
                animate: { width: progress + "%" },
                transition: { duration: 1.5, ease: "easeOut" },
                style: { height: "100%", background: "linear-gradient(90deg, #00ffcc, #ff00ff)", boxShadow: "0 0 10px #00ffcc" }
              }
            ) })
          ] }),
          !hasClaimedSponsor && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.95, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              style: { marginBottom: "20px", width: "100%" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    playBeep?.();
                    setShowSponsorModal(true);
                  },
                  style: {
                    width: "100%",
                    padding: "14px 18px",
                    background: onRevive ? "linear-gradient(135deg, rgba(255, 0, 85, 0.25) 0%, rgba(255, 119, 0, 0.25) 100%)" : "linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 229, 255, 0.2) 100%)",
                    border: onRevive ? "1.5px solid #ff0055" : "1.5px solid #00ff88",
                    borderRadius: "12px",
                    color: "#fff",
                    fontFamily: '"Orbitron", monospace',
                    fontSize: "0.8rem",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: onRevive ? "0 0 20px rgba(255, 0, 85, 0.3)" : "0 0 20px rgba(0, 255, 136, 0.3)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📺" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: onRevive ? "WATCH SPONSOR SPOT (1 FREE REVIVE ❤️)" : `WATCH SPONSOR SPOT (+${Math.max(1e3, finalCoins)} CP 🪙)` })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RewardedSponsorModal,
            {
              isOpen: showSponsorModal,
              onClose: () => setShowSponsorModal(false),
              rewardTitle: onRevive ? "1 FREE REVIVE" : `+${Math.max(1e3, finalCoins)} CP BONUS`,
              rewardIcon: onRevive ? "❤️" : "🪙",
              rewardDescription: onRevive ? "Complete the sponsor spot to revive and continue your run!" : "Complete the sponsor spot to boost your coin payout!",
              onRewarded: () => {
                setHasClaimedSponsor(true);
                if (onRevive) {
                  onRevive();
                } else {
                  const bonus = Math.max(1e3, finalCoins);
                  addCoins?.(bonus);
                  setDisplayCoins((prev) => prev + bonus);
                }
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "20px" }, children }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "15px", justifyContent: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onHome, style: { background: "#222", color: "#aaa", padding: "15px 30px" }, children: "HOME" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onReplay, style: { background: "var(--neon-blue)", color: "black", padding: "15px 40px", fontSize: "1.2rem", fontWeight: "bold" }, children: "REPLAY" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                const text = encodeURIComponent(`I just scored ${score} on ${gameName} at Merchboy Digital! Think you can beat me? 🕹️🔥 #MerchboyArcade`);
                const url = encodeURIComponent(window.location.origin);
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
              },
              style: {
                width: "100%",
                padding: "15px",
                background: "#1DA1F2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 5px 15px rgba(29, 161, 242, 0.4)",
                marginTop: "15px"
              },
              children: "🐦 BRAG ON X (TWITTER)"
            }
          )
        ]
      }
    )
  ] });
};
export {
  UniversalGameOver as U
};
