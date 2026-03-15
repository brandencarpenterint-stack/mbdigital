import { a as useGamification, k as useSquad, r as reactExports, j as jsxRuntimeExports, m as motion, s as supabase } from "./index-DuF62wvg.js";
import { T as TiltCard } from "./TiltCard-DEtwrsaT.js";
import "./use-transform-CugY6JX-.js";
import "./use-spring-CvXBshTA.js";
const MOCK_RIVALS = [
  { name: "NullPtr", squad: "CYBER", xp: 5e4, coins: 12e3, avatar: "/assets/avatar_robot.png" },
  { name: "SunGazer", squad: "SOLAR", xp: 48e3, coins: 9e3, avatar: "/assets/avatar_alien.png" },
  { name: "GhostInShell", squad: "VOID", xp: 45e3, coins: 15e3, avatar: "/assets/avatar_ghost.png" },
  { name: "BitWise", squad: "CYBER", xp: 32e3, coins: 5e3, avatar: "/assets/merchboy_face.png" },
  { name: "CosmicDust", squad: "SOLAR", xp: 28e3, coins: 8e3, avatar: "/assets/merchboy_face.png" },
  { name: "ShadowRealm", squad: "VOID", xp: 25e3, coins: 2e4, avatar: "/assets/merchboy_face.png" },
  { name: "GlitchKing", squad: "CYBER", xp: 15e3, coins: 2e3, avatar: "/assets/merchboy_face.png" },
  { name: "StarLord", squad: "SOLAR", xp: 12e3, coins: 1e3, avatar: "/assets/merchboy_face.png" },
  { name: "VoidWalker", squad: "VOID", xp: 8e3, coins: 500, avatar: "/assets/merchboy_face.png" },
  { name: "NewbieBot", squad: "CYBER", xp: 1e3, coins: 100, avatar: "/assets/merchboy_face.png" }
];
const Leaderboard = () => {
  const { userProfile, getLevelInfo, coins } = useGamification();
  const { totalXP } = getLevelInfo();
  const { squadScores } = useSquad();
  const [players, setPlayers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("ALL");
  reactExports.useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      let data = [];
      if (supabase) {
        const { data: realData } = await supabase.from("profiles").select("display_name, squad, xp, coins, avatar_url").order("xp", { ascending: false }).limit(20);
        if (realData && realData.length > 0) {
          data = realData.map((d) => ({
            name: d.display_name,
            squad: d.squad || "NEUTRAL",
            xp: d.xp || 0,
            coins: d.coins || 0,
            avatar: d.avatar_url,
            isUser: false
          }));
        }
      }
      if (data.length < 10) {
        data = [...data, ...MOCK_RIVALS];
      }
      if (!data.find((p) => p.name === userProfile.name)) {
        data.push({
          name: userProfile.name,
          squad: userProfile.squad || "NEUTRAL",
          xp: totalXP,
          coins,
          avatar: userProfile.avatar,
          isUser: true
        });
      }
      data.sort((a, b) => b.xp - a.xp);
      data = data.map((p, i) => ({ ...p, rank: i + 1 }));
      setPlayers(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [userProfile, totalXP, coins]);
  const filteredPlayers = filter === "ALL" ? players : players.filter((p) => p.squad === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    padding: "40px 20px",
    paddingBottom: "120px",
    color: "white",
    fontFamily: '"Rajdhani", sans-serif',
    maxWidth: "800px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { textAlign: "center", fontSize: "3rem", margin: "0 0 10px 0", textShadow: "0 0 20px rgba(255,255,255,0.5)" }, children: "HALL OF LEGENDS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { textAlign: "center", opacity: 0.7, marginBottom: "40px" }, children: "GLOBAL RANKINGS // SEASON 1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "30px" }, children: Object.entries(squadScores || { CYBER: 0, SOLAR: 0, VOID: 0 }).map(([squad, score]) => {
      let color = "#fff";
      if (squad === "CYBER") color = "#00ffcc";
      if (squad === "SOLAR") color = "#ffcc00";
      if (squad === "VOID") color = "#ff0055";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.5))`,
        borderBottom: `4px solid ${color}`,
        padding: "15px",
        textAlign: "center",
        borderRadius: "8px 8px 0 0"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color }, children: squad }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: score.toLocaleString() })
      ] }, squad);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }, children: ["ALL", "CYBER", "SOLAR", "VOID"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setFilter(f),
        style: {
          background: filter === f ? "#fff" : "transparent",
          color: filter === f ? "#000" : "#fff",
          border: "1px solid #555",
          padding: "5px 20px",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: "bold"
        },
        children: f
      },
      f
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: "CALCULATING..." }) : filteredPlayers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: p.rank * 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TiltCard,
          {
            style: {
              padding: "15px 20px",
              background: p.isUser ? "linear-gradient(90deg, rgba(0,255,200,0.1), rgba(0,0,0,0))" : "rgba(20,20,30,0.8)",
              border: p.isUser ? "1px solid #00ffcc" : "1px solid #333",
              display: "flex",
              alignItems: "center",
              gap: "20px"
            },
            glowColor: p.isUser ? "rgba(0,255,200,0.3)" : "rgba(255,255,255,0.1)",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: "1.5rem",
                fontWeight: "bold",
                width: "40px",
                textAlign: "center",
                color: p.rank === 1 ? "gold" : p.rank === 2 ? "silver" : p.rank === 3 ? "#cd7f32" : "#666"
              }, children: [
                "#",
                p.rank
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.avatar || "/assets/merchboy_face.png", style: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }, children: [
                  p.name,
                  p.squad && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: "0.6rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "#333",
                    color: "#aaa"
                  }, children: p.squad })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "OPERATOR" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontSize: "1.2rem", fontWeight: "bold" }, children: [
                  p.xp.toLocaleString(),
                  " XP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.8rem" }, children: [
                  "🪙 ",
                  p.coins.toLocaleString()
                ] })
              ] })
            ]
          }
        )
      },
      `${p.name}-${p.rank}`
    )) })
  ] });
};
export {
  Leaderboard as default
};
