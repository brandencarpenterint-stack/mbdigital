import { u as useSquad, a as usePocketBro, b as useGamification, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-6H0vzCe-.js";
import { L as LiveFeed } from "./LiveFeed-ClVDVl2W.js";
import "./feed-D8ANQY2d.js";
const Home = () => {
  const { squadScores } = useSquad();
  const { getMood } = usePocketBro();
  const { getLevelInfo, dailyState, userProfile } = useGamification();
  const { level, progress, totalXP } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0, totalXP: 0 };
  const rank = level > 20 ? "LEGEND" : level > 10 ? "VETERAN" : "ROOKIE";
  const [logs, setLogs] = reactExports.useState([
    { id: 1, text: "System Online...", time: "Now" },
    { id: 2, text: "Market: +2.4% 📈", time: "2m" },
    { id: 3, text: "New High Score: SNAKE", time: "15m" }
  ]);
  reactExports.useEffect(() => {
    if (dailyState) {
      const completed = dailyState.quests.filter((q) => q.claimed).length;
      const status = completed === 3 ? "ALL COMPLETED ✅" : `${completed}/3 DONE`;
      setLogs((prev) => [
        { id: 99, text: `Daily Protocols: ${status}`, time: "Live" },
        ...prev.filter((l) => l.id !== 99)
      ]);
    }
  }, [dailyState]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1200px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "2rem", color: "var(--neon-blue)", textShadow: "0 0 20px rgba(0, 243, 255, 0.4)" }, children: "COMMAND CENTER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, color: "var(--text-secondary)", letterSpacing: "2px", fontSize: "0.8rem" }, children: "SYSTEM V3.0 // ONLINE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: { padding: "5px 15px", fontSize: "0.9rem", color: "var(--neon-green)" }, children: "SIGNAL: STRONG 📶" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { padding: "25px", display: "flex", flexDirection: "column", gap: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#333",
            border: "2px solid var(--neon-pink)",
            overflow: "hidden"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: userProfile?.name || "OPERATOR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", style: { textDecoration: "none", fontSize: "1.2rem", opacity: 0.8, filter: "grayscale(100%) brightness(1.5)" }, children: "⚙️" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem", fontWeight: "bold" }, children: rank }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "var(--neon-green)", marginTop: "2px" }, children: "AUTO-SAVE: ACTIVE 💾" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "LVL ",
              level
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.floor(progress),
              "% XP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--neon-blue), var(--neon-pink))" } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "auto", display: "flex", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { flex: 1, padding: "10px", textAlign: "center", fontSize: "0.8rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "MOOD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: getMood() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { flex: 1, padding: "10px", textAlign: "center", fontSize: "0.8rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "TEAM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--neon-blue)", fontWeight: "bold" }, children: "NEON" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bento-card", style: {
        // gridColumn: 'span 2', // REMOVED per user request for uniformity
        background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "30px",
        position: "relative",
        // Adjusted padding
        border: "1px solid white"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "white", color: "#66a6ff", padding: "2px 10px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }, children: "NEW 🔥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3rem", margin: "10px 0", textShadow: "0 0 20px rgba(255,255,255,0.5)" }, children: "MERCH JUMP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "white", maxWidth: "60%", margin: "0 0 20px 0", fontWeight: "bold" }, children: "Sky High Streetwear. Jetpack Enabled." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/merch-jump", className: "squishy-btn", style: {
            display: "inline-block",
            background: "white",
            color: "#66a6ff",
            padding: "12px 30px",
            borderRadius: "50px",
            fontWeight: "900",
            textDecoration: "none",
            fontSize: "1.2rem"
          }, children: "JUMP NOW" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", right: "20px", bottom: "20px", fontSize: "10rem", opacity: 0.5 }, children: "👟" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFeed, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/subslayer", className: "bento-card", style: {
        textDecoration: "none",
        color: "white",
        padding: "25px",
        background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0 }, children: "SUB SLAYER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.65rem", color: "#ccc", marginTop: "5px", lineHeight: "1.2", fontWeight: "bold", letterSpacing: "0.5px" }, children: [
            "SUBSCRIPTION",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "MANAGER & SAVER"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { alignSelf: "flex-end", fontSize: "2.5rem", display: "flex", gap: "5px", filter: "drop-shadow(0 0 5px rgba(0,255,100,0.5))" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✂️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💸" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/coloring", className: "bento-card", style: {
        textDecoration: "none",
        color: "white",
        padding: "25px",
        background: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { zIndex: 1 }, children: "COLORING BOOK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { alignSelf: "flex-end", position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", position: "absolute", top: -20, right: 30, opacity: 0.3, transform: "rotate(-20deg)" }, children: "🎨" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/merchboy_bunny.png", alt: "Bunny", style: { width: "80px", height: "80px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))", transform: "rotate(10deg)" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/beatlab", className: "bento-card", style: {
        textDecoration: "none",
        color: "white",
        padding: "25px",
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "BEAT LAB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { alignSelf: "flex-end", fontSize: "3rem" }, children: "🎹" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://merchboy.shop", target: "_blank", className: "bento-card", style: {
        textDecoration: "none",
        color: "black",
        padding: "20px",
        background: "#fffdf5",
        // Cream/Off-white for Vintage feel
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        border: "4px solid #000",
        position: "relative",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/merchboy_money.png", style: { position: "absolute", top: -10, left: -10, width: "50px", transform: "rotate(-20deg)", opacity: 0.8 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/merchboy_cat.png", style: { position: "absolute", bottom: -10, right: -10, width: "50px", transform: "rotate(20deg)", opacity: 0.8 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/merchboy_bunny.png", style: { position: "absolute", top: "40%", right: -20, width: "40px", transform: "rotate(10deg)", opacity: 0.6 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "140px", height: "140px", zIndex: 10, filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.2))" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/merchboy_logo_badge.png",
            alt: "Merchboy Badge",
            style: { width: "100%", height: "100%", objectFit: "contain" },
            onError: (e) => {
              e.target.src = "/assets/merchboy_face.png";
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", fontWeight: "900", letterSpacing: "1px", fontSize: "1.2rem" }, children: "OFFICIAL SHOP" })
      ] })
    ] })
  ] });
};
export {
  Home as default
};
