import { b as useGamification, j as jsxRuntimeExports, S as SquishyButton } from "./index-BW7aM1MD.js";
const GameOverCard = ({ score, bestScore, gameId, onReplay, onHome, children, currency = "🪙" }) => {
  const { userProfile } = useGamification();
  const isNewRecord = score > (bestScore || 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(10px)",
    zIndex: 100
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
      padding: "40px",
      textAlign: "center",
      border: isNewRecord ? "2px solid gold" : "1px solid #444",
      background: isNewRecord ? "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,0,0,0.8))" : "rgba(20,20,30,0.9)",
      boxShadow: isNewRecord ? "0 0 50px rgba(255,215,0,0.3)" : "0 10px 30px rgba(0,0,0,0.5)",
      animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", marginBottom: "10px" }, children: isNewRecord ? "🏆" : "💀" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
        fontSize: "2.5rem",
        margin: "0 0 10px 0",
        color: isNewRecord ? "gold" : "white",
        textTransform: "uppercase",
        letterSpacing: "2px"
      }, children: isNewRecord ? "New Record!" : "Game Over" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "30px 0" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "SCORE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", fontWeight: "bold", color: "white" }, children: score })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "BEST" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", fontWeight: "bold", color: "gold" }, children: isNewRecord ? score : bestScore })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onHome, style: { background: "#333", color: "#ccc" }, children: "🏠 HOME" }),
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onReplay, style: { background: "var(--neon-blue)", padding: "15px 40px", fontSize: "1.2rem" }, children: "🔄 REPLAY" })
      ] }),
      isNewRecord && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "gold", fontSize: "0.8rem", animation: "blink 1s infinite" }, children: "UPLOADING TO GLOBAL LEADERBOARD..." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            ` })
  ] });
};
export {
  GameOverCard as G
};
