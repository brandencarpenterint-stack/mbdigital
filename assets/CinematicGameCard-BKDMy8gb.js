import { j as jsxRuntimeExports, m as motion } from "./index-D2O71Cho.js";
const GENRE_COLORS = {
  casino: { bg: "rgba(255, 215, 0, 0.15)", text: "#ffd700", border: "rgba(255, 215, 0, 0.35)" },
  action: { bg: "rgba(0, 240, 255, 0.15)", text: "#00f0ff", border: "rgba(0, 240, 255, 0.35)" },
  retro: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "rgba(168, 85, 247, 0.35)" },
  default: { bg: "rgba(255, 255, 255, 0.1)", text: "#fff", border: "rgba(255, 255, 255, 0.2)" }
};
const CinematicGameCard = ({ game, highScore = 0 }) => {
  const genreStyle = GENRE_COLORS[game.category] || GENRE_COLORS.default;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { y: -6, scale: 1.02 },
      transition: { type: "spring", stiffness: 350, damping: 25 },
      style: {
        width: "100%",
        maxWidth: "340px",
        background: "linear-gradient(180deg, rgba(16, 20, 32, 0.9) 0%, rgba(8, 10, 18, 0.98) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        position: "relative",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.45)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 240, 255, 0.2)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "relative",
          height: "120px",
          width: "100%",
          background: game.gradient || "linear-gradient(135deg, #1e293b, #0f172a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.5,
            pointerEvents: "none"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 35%, rgba(5, 7, 15, 0.7) 100%)",
            pointerEvents: "none"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: "10px",
            left: "12px",
            background: genreStyle.bg,
            color: genreStyle.text,
            border: `1px solid ${genreStyle.border}`,
            borderRadius: "6px",
            padding: "2px 8px",
            fontSize: "0.62rem",
            fontWeight: "900",
            letterSpacing: "1px",
            fontFamily: "monospace",
            zIndex: 2,
            textTransform: "uppercase",
            backdropFilter: "blur(6px)"
          }, children: game.category || "ARCADE" }),
          highScore > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            top: "10px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            color: "#00ff88",
            borderRadius: "6px",
            padding: "2px 8px",
            fontSize: "0.62rem",
            fontWeight: "bold",
            fontFamily: "monospace",
            zIndex: 2,
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "#00ff88", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }),
            highScore.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              whileHover: { scale: 1.1, rotate: 2 },
              transition: { type: "spring", stiffness: 300 },
              style: {
                position: "relative",
                zIndex: 1,
                width: "68px",
                height: "68px",
                borderRadius: "18px",
                background: "rgba(5, 8, 18, 0.65)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem"
              },
              children: game.icon || "🎮"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          background: "rgba(8, 12, 20, 0.95)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
              margin: "0 0 6px 0",
              fontSize: "1rem",
              fontWeight: "900",
              color: "#f8fafc",
              fontFamily: '"Orbitron", sans-serif',
              letterSpacing: "1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: game.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
              margin: 0,
              fontSize: "0.75rem",
              color: "#94a3b8",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontFamily: "system-ui, -apple-system, sans-serif"
            }, children: game.desc || "Experience high-stakes cyberpunk arcade gameplay." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: "0.65rem",
              color: "#64748b",
              fontFamily: "monospace",
              fontWeight: "900",
              letterSpacing: "0.5px"
            }, children: "INSTANT PLAY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              background: "linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 114, 255, 0.25))",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              color: "#00f0ff",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: "900",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }, children: "PLAY ➔" })
          ] })
        ] })
      ]
    }
  );
};
export {
  CinematicGameCard as C
};
