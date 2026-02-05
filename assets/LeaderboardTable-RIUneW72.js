import { r as reactExports, a as useGamification, j as jsxRuntimeExports } from "./index-ofeJceFx.js";
import { LeaderboardService } from "./LeaderboardService-Df7n_QLN.js";
const LeaderboardTable = ({ gameId }) => {
  const [scores, setScores] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const { setViewedProfile } = useGamification();
  reactExports.useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const data = await LeaderboardService.getTopScores(gameId);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, [gameId]);
  const handleRowClick = (entry) => {
    const partialProfile = {
      name: entry.player,
      // Generate a consistent avatar if we don't have one, or use a default
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`,
      code: "UNKNOWN",
      squad: entry.squad || "UNKNOWN",
      stats: {
        gameHighScore: entry.score
        // Just show what we know
      },
      isMock: true
      // Flag to tell ProfileModal this is a partial view
    };
    setViewedProfile(partialProfile);
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666" }, children: "Loading Global Ranks..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: "400px", background: "rgba(0,0,0,0.5)", borderRadius: "10px", padding: "10px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { textAlign: "center", color: "gold", margin: "0 0 10px 0" }, children: "🏆 GLOBAL TOP 10" }),
    scores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#999" }, children: "No scores yet. Be the first!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { width: "100%", borderCollapse: "collapse", color: "white" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: scores.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        onClick: () => handleRowClick(entry),
        style: {
          borderBottom: "1px solid #333",
          cursor: "pointer",
          transition: "background 0.2s"
        },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "8px", color: idx < 3 ? "gold" : "white", fontWeight: idx < 3 ? "bold" : "normal" }, children: [
            "#",
            idx + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "24px", height: "24px", borderRadius: "50%", background: "#333", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`,
                alt: "av",
                style: { width: "100%", height: "100%", objectFit: "cover" }
              }
            ) }),
            entry.player
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px", textAlign: "right", fontFamily: "monospace" }, children: entry.score.toLocaleString() })
        ]
      },
      idx
    )) }) })
  ] });
};
export {
  LeaderboardTable as L
};
