import { b as useGamification, j as jsxRuntimeExports } from "./index-CRAV8IaB.js";
const DailyQuestModal = ({ onClose }) => {
  const context = useGamification();
  if (!context) console.warn("GamificationContext is missing in DailyQuestModal!");
  const { dailyState, claimDailyLogin, claimQuest, skipQuest } = context || {};
  const safeClaimLogin = claimDailyLogin || (() => console.error("claimDailyLogin missing!"));
  if (!dailyState) return null;
  const { lastCheckIn, streak, quests } = dailyState;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const canCheckIn = lastCheckIn !== today;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.8)",
    zIndex: 6e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
    width: "90%",
    maxWidth: "500px",
    padding: "30px",
    position: "relative",
    border: "1px solid var(--neon-blue)",
    boxShadow: "0 0 40px rgba(0, 243, 255, 0.2)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        style: {
          position: "absolute",
          top: "15px",
          right: "15px",
          border: "none",
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%"
        },
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
      marginTop: 0,
      color: "var(--neon-blue)",
      textAlign: "center",
      fontSize: "2rem",
      textShadow: "0 0 10px rgba(0,243,255,0.5)"
    }, children: "DAILY PROTOCOLS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "15px",
      padding: "20px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#aaa", letterSpacing: "1px" }, children: "CURRENT STREAK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }, children: [
          streak,
          " DAYS ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "🔥" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: safeClaimLogin,
          disabled: !canCheckIn,
          className: "squishy-btn",
          style: {
            background: canCheckIn ? "linear-gradient(45deg, #00ffaa, #00ccff)" : "#333",
            color: canCheckIn ? "#000" : "#888",
            border: "none",
            padding: "15px 30px",
            borderRadius: "50px",
            fontWeight: "900",
            fontSize: "1.2rem",
            cursor: canCheckIn ? "pointer" : "default",
            boxShadow: canCheckIn ? "0 0 30px rgba(0, 255, 170, 0.6)" : "none",
            animation: canCheckIn ? "pulse 2s infinite" : "none",
            textTransform: "uppercase"
          },
          children: canCheckIn ? "💰 CLAIM REWARD (+100)" : "✅ CHECKED IN"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 170, 0.7); }
                        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 255, 170, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 170, 0); }
                    }
                ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#fff", fontSize: "1.2rem", marginBottom: "15px" }, children: "ACTIVE MISSIONS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "15px", maxHeight: "400px", overflowY: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", fontSize: "0.8rem", color: "#888", marginBottom: "5px" }, children: [
        "SKIPS AVAILABLE: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "white", fontWeight: "bold" }, children: dailyState.skipsAvailable || 0 })
      ] }),
      quests.map((q) => {
        const isDone = q.progress >= q.target;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: q.isWeekly ? "rgba(50, 0, 100, 0.4)" : "rgba(0,0,0,0.3)",
          borderRadius: "10px",
          padding: "15px",
          border: q.claimed ? "1px solid var(--neon-green)" : q.isWeekly ? "1px solid #d53f8c" : "1px solid rgba(255,255,255,0.1)",
          opacity: q.claimed ? 0.6 : 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.9rem", color: "#eee", marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }, children: [
              q.isWeekly && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "#d53f8c", color: "white", fontSize: "0.6rem", padding: "2px 5px", borderRadius: "4px" }, children: "WEEKLY" }),
              q.desc
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "6px", background: "#333", borderRadius: "3px", marginBottom: "5px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: `${Math.min(q.progress / q.target * 100, 100)}%`,
              height: "100%",
              background: isDone ? "var(--neon-green)" : q.isWeekly ? "#d53f8c" : "var(--neon-blue)",
              transition: "width 0.5s"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888" }, children: [
              Math.min(q.progress, q.target),
              " / ",
              q.target,
              " • Reward: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "gold" }, children: [
                q.reward,
                " 🪙"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => claimQuest(q.id),
                disabled: !isDone || q.claimed,
                style: {
                  background: q.claimed ? "transparent" : isDone ? "#39ff14" : "#333",
                  color: q.claimed ? "#39ff14" : isDone ? "#000" : "#888",
                  border: q.claimed ? "1px solid #39ff14" : "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: isDone && !q.claimed ? "pointer" : "default",
                  fontSize: "0.8rem",
                  boxShadow: isDone && !q.claimed ? "0 0 15px rgba(57, 255, 20, 0.6)" : "none",
                  textTransform: "uppercase",
                  minWidth: "90px"
                },
                children: q.claimed ? "DONE" : isDone ? "CLAIM" : "..."
              }
            ),
            !q.isWeekly && !q.claimed && !isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => skipQuest(q.id),
                disabled: (dailyState.skipsAvailable || 0) <= 0,
                style: {
                  padding: "5px",
                  background: "transparent",
                  color: (dailyState.skipsAvailable || 0) > 0 ? "#ff4444" : "#555",
                  border: "1px solid",
                  borderColor: (dailyState.skipsAvailable || 0) > 0 ? "#ff4444" : "#333",
                  borderRadius: "8px",
                  cursor: (dailyState.skipsAvailable || 0) > 0 ? "pointer" : "default",
                  fontSize: "0.7rem"
                },
                children: "SKIP 🔄"
              }
            )
          ] })
        ] }, q.id);
      })
    ] })
  ] }) });
};
export {
  DailyQuestModal as default
};
