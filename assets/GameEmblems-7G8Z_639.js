import { j as jsxRuntimeExports, m as motion } from "./index-BNUj3mBX.js";
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "8px", left: "8px", width: "8px", height: "8px", borderTop: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)", pointerEvents: "none" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderTop: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", pointerEvents: "none" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "8px", left: "8px", width: "8px", height: "8px", borderBottom: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)", pointerEvents: "none" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "8px", right: "8px", width: "8px", height: "8px", borderBottom: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", pointerEvents: "none" } }),
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
              children: game.icon || /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#00f0ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "12", x2: "10", y2: "12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "10", x2: "8", y2: "14" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "13", x2: "15.01", y2: "13" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "11", x2: "18.01", y2: "11" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "6", width: "20", height: "12", rx: "6" })
              ] })
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
const BaseEmblem = ({ color = "#00f0ff", children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
  position: "relative",
  width: "64px",
  height: "64px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: `drop-shadow(0 0 16px ${color}88)`
}, children });
const EmblemCrash = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ffd700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" })
] }) });
const EmblemMines = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00ff66", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00ff66", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "5", fill: "rgba(0, 255, 102, 0.2)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "2", fill: "#00ff66" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "4.93", x2: "7.05", y2: "7.05" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16.95", y1: "16.95", x2: "19.07", y2: "19.07" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "19.07", x2: "7.05", y2: "16.95" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16.95", y1: "7.05", x2: "19.07", y2: "4.93" })
] }) });
const EmblemHiLo = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00e5ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00e5ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "6", width: "13", height: "16", rx: "2", fill: "rgba(0, 229, 255, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 2h10a2 2 0 0 1 2 2v14" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "7 14 9.5 11 12 14" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "9.5", y1: "11", x2: "9.5", y2: "17" })
] }) });
const EmblemScratchers = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ffd700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", fill: "rgba(255, 215, 0, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "14.5", r: "1.5", fill: "#ffd700" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "14.5", r: "1.5", fill: "#ffd700" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "14.5", r: "1.5", fill: "#ffd700" })
] }) });
const EmblemBlackjack = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00ff66", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00ff66", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "4", width: "12", height: "16", rx: "2", fill: "rgba(0, 255, 102, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 6h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "8", y: "15", fill: "#00ff66", fontSize: "8", fontWeight: "900", textAnchor: "middle", fontFamily: "monospace", children: "A" })
] }) });
const EmblemRoulette = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00e5ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00e5ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", fill: "rgba(0, 229, 255, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "17", x2: "12", y2: "22" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "12", x2: "7", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "12", x2: "22", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15.5", cy: "8.5", r: "1.5", fill: "#ffd700" })
] }) });
const EmblemDerby = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00ff66", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00ff66", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 18c2-3 5-4 9-3l3-4h3l-1 4 3 2c-3 1-5 4-8 5l-4-1-3 2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "8", r: "1.5", fill: "#00ff66" })
] }) });
const EmblemSlots = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ffd700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", fill: "rgba(255, 215, 0, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "4", x2: "8", y2: "20" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "4", x2: "16", y2: "20" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "5", y: "14", fill: "#ffd700", fontSize: "7", fontWeight: "bold", children: "7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "12", y: "14", fill: "#ffd700", fontSize: "7", fontWeight: "bold", textAnchor: "middle", children: "7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "19", y: "14", fill: "#ffd700", fontSize: "7", fontWeight: "bold", textAnchor: "end", children: "7" })
] }) });
const EmblemUnderworld = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#c084fc", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#c084fc", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a9 9 0 0 0-9 9c0 4 3 7 5 8v3h8v-3c2-1 5-4 5-8a9 9 0 0 0-9-9z", fill: "rgba(192, 132, 252, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "11", r: "1.5", fill: "#c084fc" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15", cy: "11", r: "1.5", fill: "#c084fc" })
] }) });
const EmblemDozer = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00f0ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00f0ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", fill: "rgba(0, 240, 255, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "15.5", r: "2", fill: "#ffd700" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "15.5", r: "2", fill: "#ffd700" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "15.5", r: "2", fill: "#ffd700" })
] }) });
const EmblemPinball = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ff007f", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ff007f", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 20 8 18 21 6 21 4 8 12 2", fill: "rgba(255, 0, 127, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "10", r: "2.5", fill: "#00f0ff" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "18", x2: "10", y2: "16" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "18", x2: "14", y2: "16" })
] }) });
const EmblemPlinko = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#a855f7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#a855f7", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 3 21 21 3 21 12 3", fill: "rgba(168, 85, 247, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "9", r: "1.5", fill: "#a855f7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9.5", cy: "13", r: "1.5", fill: "#a855f7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14.5", cy: "13", r: "1.5", fill: "#a855f7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "17", r: "1.5", fill: "#a855f7" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "17", r: "1.5", fill: "#00f0ff" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "17", r: "1.5", fill: "#a855f7" })
] }) });
const EmblemDrift = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ff007f", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ff007f", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "17", r: "2.5", fill: "#00f0ff" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.5 17h5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "17", r: "2.5", fill: "#00f0ff" })
] }) });
const EmblemDefense = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00c6ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00c6ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", fill: "rgba(0, 198, 255, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "11", r: "3", fill: "#00c6ff" })
] }) });
const EmblemGalaxy = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00f0ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00f0ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 16 10 22 13 18 16 19 22 12 18 5 22 6 16 2 13 8 10 12 2", fill: "rgba(0, 240, 255, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: "#ff0055" })
] }) });
const EmblemFlappy = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ffd700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "12", r: "6", fill: "rgba(255, 215, 0, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "13", cy: "10", r: "1.5", fill: "#000" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 12l4-2-4-2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "8", cy: "13", rx: "4", ry: "2.5", fill: "#00f0ff" })
] }) });
const EmblemWheel = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ffd700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", fill: "rgba(255, 215, 0, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: "#ffd700" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "22" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "4.93", x2: "19.07", y2: "19.07" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "19.07", x2: "19.07", y2: "4.93" })
] }) });
const EmblemBricks = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#da22ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#da22ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "3", width: "9", height: "5", rx: "1", fill: "rgba(218, 34, 255, 0.2)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "3", width: "9", height: "5", rx: "1", fill: "rgba(218, 34, 255, 0.2)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "10", width: "9", height: "5", rx: "1", fill: "rgba(218, 34, 255, 0.2)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "18", r: "2", fill: "#00f0ff" })
] }) });
const EmblemSnake = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#38ef7d", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#38ef7d", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 18v-4a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "18", r: "2", fill: "#38ef7d" })
] }) });
const EmblemUnboxing = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ff007f", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ff007f", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", fill: "rgba(255, 0, 127, 0.15)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m3.3 7 8.7 5 8.7-5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22V12" })
] }) });
const EmblemArena = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#ff0844", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#ff0844", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4", y1: "4", x2: "20", y2: "20" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", y1: "4", x2: "4", y2: "20" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "2 6 4 4 6 6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "18 4 20 4 20 6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "4 18 4 20 6 20" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "18 20 20 20 20 18" })
] }) });
const EmblemFaceRunner = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00f260", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00f260", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "#0575e6", strokeWidth: "1.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 4 19 12 12 20 5 12", fill: "rgba(0, 242, 96, 0.2)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 10 12 7 15 10", stroke: "#00f260", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "7", x2: "12", y2: "17", stroke: "#00f260", strokeWidth: "2" })
] }) });
const EmblemBroCannon = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#FF512F", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#FF512F", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 18h16", stroke: "#DD2476", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "18", r: "3", fill: "rgba(255, 81, 47, 0.25)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 15l10-8 3 4-10 8z", fill: "rgba(221, 36, 118, 0.3)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "19", cy: "8", r: "1.5", fill: "#ffd700" })
] }) });
const EmblemMerchJump = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#66a6ff", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#66a6ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 20h16", stroke: "#89f7fe", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 16V4m0 0l-4 4m4-4l4 4", stroke: "#66a6ff", strokeWidth: "2.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "4", r: "2", fill: "#89f7fe" })
] }) });
const EmblemFishing = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#00C6FF", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#00C6FF", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 4l-4 4m0 0l-6 6", stroke: "#0072FF", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 16c2 0 4 2 4 4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 8c4-2 6 0 6 3s-4 4-6 3", fill: "rgba(0, 198, 255, 0.25)" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "10", r: "1", fill: "#fff" })
] }) });
const EmblemWhack = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#FF416C", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#FF416C", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "5", width: "8", height: "12", rx: "2", fill: "rgba(255, 65, 108, 0.25)", stroke: "#FF4B2B", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "11", y1: "11", x2: "21", y2: "11", stroke: "#FF416C", strokeWidth: "3", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "2", x2: "5", y2: "5", stroke: "#ffd700", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "20", x2: "5", y2: "17", stroke: "#ffd700", strokeWidth: "2" })
] }) });
const EmblemMemory = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BaseEmblem, { color: "#64f38c", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "#64f38c", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "4", width: "8", height: "12", rx: "2", fill: "rgba(100, 243, 140, 0.2)", stroke: "#f79d00", strokeWidth: "1.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "8", width: "8", height: "12", rx: "2", fill: "rgba(100, 243, 140, 0.3)", stroke: "#64f38c", strokeWidth: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17", cy: "14", r: "2", fill: "#64f38c" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "10", r: "1.5", fill: "#f79d00" })
] }) });
export {
  CinematicGameCard as C,
  EmblemCrash as E,
  EmblemSlots as a,
  EmblemDozer as b,
  EmblemBlackjack as c,
  EmblemMines as d,
  EmblemHiLo as e,
  EmblemScratchers as f,
  EmblemRoulette as g,
  EmblemDerby as h,
  EmblemUnderworld as i,
  EmblemPinball as j,
  EmblemPlinko as k,
  EmblemDrift as l,
  EmblemDefense as m,
  EmblemGalaxy as n,
  EmblemFaceRunner as o,
  EmblemBroCannon as p,
  EmblemArena as q,
  EmblemBricks as r,
  EmblemSnake as s,
  EmblemFlappy as t,
  EmblemUnboxing as u,
  EmblemWheel as v,
  EmblemMerchJump as w,
  EmblemFishing as x,
  EmblemWhack as y,
  EmblemMemory as z
};
