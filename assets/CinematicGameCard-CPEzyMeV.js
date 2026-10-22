import { j as jsxRuntimeExports, m as motion } from "./index-DJjTZN72.js";
const GENRE_COLORS = {
  casino: { bg: "rgba(255, 215, 0, 0.15)", text: "#ffd700", border: "rgba(255, 215, 0, 0.3)" },
  action: { bg: "rgba(0, 240, 255, 0.15)", text: "#00f0ff", border: "rgba(0, 240, 255, 0.3)" },
  retro: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "rgba(168, 85, 247, 0.3)" },
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
        background: "linear-gradient(180deg, rgba(18, 24, 38, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)",
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
          height: "145px",
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
            background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.55) 100%)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: "12px",
            left: "12px",
            background: genreStyle.bg,
            color: genreStyle.text,
            border: `1px solid ${genreStyle.border}`,
            borderRadius: "8px",
            padding: "3px 8px",
            fontSize: "0.65rem",
            fontWeight: "800",
            letterSpacing: "1px",
            fontFamily: "monospace",
            zIndex: 2,
            textTransform: "uppercase"
          }, children: game.category || "ARCADE" }),
          highScore > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#00ff88",
            borderRadius: "8px",
            padding: "3px 8px",
            fontSize: "0.65rem",
            fontWeight: "bold",
            fontFamily: "monospace",
            zIndex: 2
          }, children: [
            "🏆 ",
            highScore.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              whileHover: { scale: 1.12, rotate: 3 },
              transition: { type: "spring", stiffness: 300 },
              style: {
                fontSize: "3.5rem",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.6))"
              },
              children: game.icon || "🎮"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          background: "rgba(10, 14, 22, 0.95)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
              margin: "0 0 6px 0",
              fontSize: "1.05rem",
              fontWeight: "800",
              color: "#f8fafc",
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              letterSpacing: "0.3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: game.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
              margin: 0,
              fontSize: "0.78rem",
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
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: "0.7rem",
              color: "#64748b",
              fontFamily: "monospace",
              fontWeight: "bold"
            }, children: "INSTANT PLAY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              background: "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.2))",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              color: "#00f0ff",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "0.75rem",
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
