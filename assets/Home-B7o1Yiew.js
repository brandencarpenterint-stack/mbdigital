import { u as usePocketBro, a as useGamification, b as useRetroSound, r as reactExports, c as useToast, j as jsxRuntimeExports, m as motion, L as Link } from "./index-CDIAvxnU.js";
/* empty css              */
import { T as TiltCard } from "./TiltCard-CQOIHMvH.js";
import "./use-transform-CaG2_BbL.js";
import "./use-spring-CQgLS1RG.js";
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};
const Home = () => {
  const { getMood } = usePocketBro();
  const { getLevelInfo, dailyState, userProfile, coins, followers, activeDrops } = useGamification();
  const { playBeep } = useRetroSound();
  const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const rank = level > 20 ? "LEGEND" : level > 10 ? "VETERAN" : "ROOKIE";
  activeDrops?.reduce((a, b) => a + (b.revenue || 0), 0) || 0;
  const [ticker, setTicker] = reactExports.useState("MCH: $102 ▲ | GLT: $49 ▲");
  const [time, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const { showToast } = useToast();
  reactExports.useEffect(() => {
    const timer = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1400px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "top-bar-container",
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: { padding: "0 15px", height: "100%", display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: "1.2rem", color: "#00ffcc", fontWeight: "bold" }, children: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://merchboy.shop", target: "_blank", className: "squishy-btn", style: {
            height: "100%",
            padding: "0 20px",
            background: "#FFD700",
            color: "black",
            display: "flex",
            alignItems: "center",
            fontWeight: "900",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.9rem"
          }, children: "🛍️ SHOP" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "dashboard-grid",
        variants: container,
        initial: "hidden",
        animate: "show",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #111, #222)",
            border: "1px solid #333",
            padding: "25px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "70px", height: "70px", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: -5, width: "80px", height: "80px", transform: "rotate(-90deg)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#333", strokeWidth: "5", fill: "none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#00ffcc", strokeWidth: "5", fill: "none", strokeDasharray: "283", strokeDashoffset: 283 - 283 * progress / 100, transition: "stroke-dashoffset 1s" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #000" } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(20px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem", letterSpacing: "2px" }, children: "OPERATOR" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", fontWeight: "bold", textTransform: "uppercase" }, children: userProfile?.name || "GUEST" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#00ffcc", fontSize: "0.9rem", fontWeight: "bold" }, children: [
                  rank,
                  " // LVL ",
                  level
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "auto" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", textAlign: "center", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#555" }, children: "BALANCE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.2rem", color: "#ffd700" }, children: [
                  "🪙 ",
                  coins
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", textAlign: "center", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#555" }, children: "MOOD" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: getMood() })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "#0f0f1b",
            border: "1px solid #444",
            padding: "0",
            overflow: "hidden"
          }, glowColor: "rgba(0,255,100,0.2)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "15px 25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", color: "#fff" }, children: "DAILY MISSIONS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", background: "#333", padding: "2px 8px", borderRadius: "4px" }, children: [
                dailyState?.quests?.filter((q) => q.claimed).length,
                "/3"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "20px", transform: "translateZ(10px)" }, children: dailyState?.quests?.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
              opacity: q.claimed ? 0.5 : 1
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: q.claimed ? "none" : "2px solid #555",
                background: q.claimed ? "#00ff00" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: q.claimed && "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textDecoration: q.claimed ? "line-through" : "none", color: "#ddd" }, children: [
                  q.desc || q.text,
                  " "
                ] }),
                !q.claimed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888", marginTop: "2px" }, children: [
                  "Progress: ",
                  q.progress || 0,
                  " / ",
                  q.target,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "4px", background: "#333", marginTop: "2px", borderRadius: "2px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    width: `${Math.min(100, (q.progress || 0) / q.target * 100)}%`,
                    height: "100%",
                    background: "var(--neon-green)",
                    borderRadius: "2px"
                  } }) })
                ] })
              ] }),
              !q.claimed && (q.progress || 0) >= q.target && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: {
                background: "gold",
                color: "black",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "0.7rem",
                fontWeight: "bold",
                cursor: "pointer"
              }, children: "CLAIM" })
            ] }, q.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", style: { textDecoration: "none", color: "inherit", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            padding: "20px"
          }, glowColor: "rgba(255, 215, 0, 0.4)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(30px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "5px" }, children: "🏆" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, fontSize: "1.5rem", fontWeight: "900" }, children: "RANKINGS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: 0.8, fontSize: "0.7rem", fontWeight: "bold" }, children: "HALL OF LEGENDS" })
          ] }) }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/merch-lab", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "#fff", color: "#333", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🧢" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "MERCH LAB ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "DESIGN STUDIO" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/coloring", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "#fff",
            color: "#333",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "2px solid #ff0055"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🎨" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "COLORING BOOK",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "RELAX & CREATE" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            border: "1px solid #444",
            color: "#00ffcc",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🕹️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "ARCADE ZONE",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "GAMES & UTILITIES" })
            ] })
          ] }) }) })
        ]
      }
    )
  ] });
};
export {
  Home as default
};
