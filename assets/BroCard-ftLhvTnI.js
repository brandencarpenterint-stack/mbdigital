import { a as useGamification, r as reactExports, j as jsxRuntimeExports, m as motion } from "./index-W_tBu39q.js";
import { h as html2canvas } from "./html2canvas.esm-B6qI7jro.js";
import { u as useMotionValue, a as useTransform } from "./use-transform-CnlL7WPD.js";
import { u as useSpring } from "./use-spring-BbaC6gi3.js";
const BroCard = () => {
  const { userProfile, getLevelTitle, unlockedAchievements } = useGamification() || {};
  const cardRef = reactExports.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  const sheenGradient = useTransform(
    mouseX,
    [-0.5, 0.5],
    [
      "linear-gradient(115deg, transparent, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
      "linear-gradient(115deg, transparent, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 55%, transparent)"
    ]
  );
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const coins = parseInt(localStorage.getItem("arcadeCoins")) || 0;
  const subSlayerData = JSON.parse(localStorage.getItem("subSlayerKills")) || [];
  const monthlySaved = subSlayerData.reduce((acc, sub) => acc + sub.price, 0);
  const yearlySaved = monthlySaved * 12;
  const joinDate = localStorage.getItem("siteFirstVisit") || (/* @__PURE__ */ new Date()).toLocaleDateString();
  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const el = cardRef.current;
      const prevTransform = el.style.transform;
      el.style.transform = "none";
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 3,
        // Super High Res
        useCORS: true
      });
      el.style.transform = prevTransform;
      const link = document.createElement("a");
      link.download = "MerchBoy_Elite_ID.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error(err);
      alert("Hologram interference. Try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #000, #111)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
    perspective: "1200px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "white", marginBottom: "40px", fontFamily: '"Orbitron", sans-serif', letterSpacing: "4px", opacity: 0.8 }, children: "IDENTITY // ELITE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          cursor: "grab"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: cardRef,
            style: {
              width: "400px",
              height: "640px",
              background: "#0a0a0a",
              borderRadius: "24px",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
              border: "1px solid #333",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  style: {
                    position: "absolute",
                    inset: 0,
                    background: sheenGradient,
                    zIndex: 20,
                    pointerEvents: "none",
                    mixBlendMode: "overlay"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                zIndex: 1
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                height: "140px",
                background: "linear-gradient(180deg, #1A1A1A 0%, #000 100%)",
                position: "relative",
                borderBottom: "2px solid #333",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingBottom: "20px",
                zIndex: 2
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  position: "absolute",
                  top: 20,
                  left: 20,
                  color: "#444",
                  fontWeight: "900",
                  fontSize: "3rem",
                  lineHeight: 0.8,
                  opacity: 0.2
                }, children: [
                  "MB",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "DG"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "4px solid #fff",
                  background: "#000",
                  overflow: "hidden",
                  transform: "translateY(50%)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/merchboy_face.png", alt: "Avatar", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 20, right: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/qr-code-placeholder.png", style: {
                  width: "40px",
                  height: "40px",
                  opacity: 0.5,
                  filter: "invert(1)"
                }, alt: "QR", onError: (e) => e.target.style.display = "none" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "70px 30px 30px 30px", textAlign: "center", zIndex: 2, background: "linear-gradient(180deg, #111 0%, #080808 100%)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "white", margin: "0 0 5px 0", fontSize: "1.8rem", letterSpacing: "1px" }, children: userProfile?.name || "OPERATOR" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  background: coins > 5e3 ? "linear-gradient(90deg, #ffd700, #ffaa00)" : "#333",
                  color: coins > 5e3 ? "black" : "#888",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "30px"
                }, children: coins > 5e3 ? "Gold Member" : "Standard Access" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", style: boxStyle, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "BALANCE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: valStyle, children: [
                      "🪙 ",
                      coins.toLocaleString()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", style: boxStyle, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "SAVED (YTD)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...valStyle, color: "#00ff9d" }, children: [
                      "$",
                      yearlySaved.toFixed(0)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", style: boxStyle, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "SHIFTS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: valStyle, children: localStorage.getItem("hustleSessions") || 0 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", style: boxStyle, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "ID VERIFIED" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...valStyle, fontSize: "0.8rem", paddingTop: "4px" }, children: joinDate })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }, children: [
                  unlockedAchievements?.slice(0, 10).map((achId) => {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "24px", height: "24px", background: "gold", borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 0 5px gold" }, title: achId }, achId);
                  }),
                  (!unlockedAchievements || unlockedAchievements.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#444" }, children: "NO BADGES YET" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "30px", height: "2px", background: "#333", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -4, left: "50%", width: "40px", height: "10px", background: "#111", transform: "translateX(-50%)" } }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", background: "#000", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "monospace", color: "#444", fontSize: "0.6rem" }, children: [
                  "ID: ",
                  Math.random().toString(36).substr(2, 9).toUpperCase()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "monospace", color: "#444", fontSize: "0.6rem" }, children: "SECURE::ENCRYPTED" })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: downloadCard,
        style: {
          marginTop: "40px",
          background: "transparent",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "12px 30px",
          borderRadius: "50px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          cursor: "pointer",
          letterSpacing: "1px",
          transition: "all 0.2s"
        },
        onMouseEnter: (e) => e.target.style.background = "rgba(255,255,255,0.1)",
        onMouseLeave: (e) => e.target.style.background = "transparent",
        children: "⬇ SAVE TO DEVICE"
      }
    )
  ] });
};
const boxStyle = {
  background: "rgba(255,255,255,0.03)",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "left",
  border: "1px solid rgba(255,255,255,0.05)"
};
const labelStyle = {
  color: "#666",
  fontSize: "0.6rem",
  fontWeight: "bold",
  letterSpacing: "1px",
  marginBottom: "5px"
};
const valStyle = {
  color: "#fff",
  fontSize: "1.2rem",
  fontWeight: "600",
  fontFamily: '"Rajdhani", sans-serif'
};
export {
  BroCard as default
};
