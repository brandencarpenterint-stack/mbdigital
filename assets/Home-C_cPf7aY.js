import { u as useGamification, a as useRetroSound, r as reactExports, j as jsxRuntimeExports, m as motion, L as Link } from "./index-HnrdNYLo.js";
/* empty css              */
import { T as TiltCard } from "./TiltCard-npi2zG6-.js";
import "./use-transform-BeQ688UQ.js";
import "./use-spring-BwGO9ZIi.js";
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};
const Home = () => {
  const { getLevelInfo, userProfile, coins } = useGamification();
  const { playBeep } = useRetroSound();
  const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const rank = level > 20 ? "LEGEND" : level > 10 ? "VETERAN" : "ROOKIE";
  const [time, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const timer = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1000px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "top-bar-container", initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, children: [
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
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, type: "spring" }, style: { marginBottom: "30px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bento-card",
        style: {
          background: "linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(255, 0, 255, 0.15))",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(0, 255, 204, 0.3)",
          borderRadius: "30px",
          padding: "80px 40px",
          textAlign: "center",
          boxShadow: "0 0 50px rgba(0, 255, 204, 0.1), inset 0 0 20px rgba(255, 0, 255, 0.1)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 10px 60px rgba(0, 255, 204, 0.3)";
          playBeep();
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 0 50px rgba(0, 255, 204, 0.1)";
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "clamp(3rem, 8vw, 5rem)", margin: 0, background: "linear-gradient(to right, #00ffcc, #ff00ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 0 30px rgba(0,255,204,0.4)", fontWeight: "900", letterSpacing: "4px" }, children: "ENTER ARCADE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", marginTop: "15px", letterSpacing: "3px", fontFamily: "monospace" }, children: "PRESS START TO BEGIN" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "dashboard-grid", variants: container, initial: "hidden", animate: "show", style: { gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #111, #222)", border: "1px solid #333", padding: "25px", display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "70px", height: "70px", transform: "translateZ(10px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: -5, width: "80px", height: "80px", transform: "rotate(-90deg)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#333", strokeWidth: "5", fill: "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#00ffcc", strokeWidth: "5", fill: "none", strokeDasharray: "283", strokeDashoffset: 283 - 283 * progress / 100, style: { transition: "stroke-dashoffset 1s" } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/skins/face_default.png", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #000" }, alt: "Avatar" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "auto", transform: "translateZ(10px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "#888", letterSpacing: "1px" }, children: "FUNDS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.2rem", color: "#ffd700", fontWeight: "bold" }, children: [
            "🪙 ",
            coins
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: item, style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)", color: "#000", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🏆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "GLOBAL RANKINGS" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vault", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)", color: "#000", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🎒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "THE VAULT" })
        ] }) }) })
      ] })
    ] })
  ] });
};
export {
  Home as default
};
