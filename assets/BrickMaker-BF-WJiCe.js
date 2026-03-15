import { B as useNavigate, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, L as Link } from "./index-CDIAvxnU.js";
const ROWS = 20;
const COLS = 10;
const COLORS = ["#ff0055", "#00ffaa", "#00ccff", "#ffff00", "#aa00ff", "#ffffff"];
const BrickMaker = () => {
  const navigate = useNavigate();
  const { playBeep, playWin } = useRetroSound();
  const [grid, setGrid] = reactExports.useState(() => {
    const saved = localStorage.getItem("merchboy_custom_brick");
    if (saved) return JSON.parse(saved);
    const g = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push(null);
      }
      g.push(row);
    }
    return g;
  });
  const [selectedTool, setSelectedTool] = reactExports.useState({ type: "normal", color: "#ff0055" });
  const handleCellClick = (r, c) => {
    const newGrid = [...grid];
    if (selectedTool.type === "eraser") {
      newGrid[r][c] = null;
      playBeep();
    } else {
      newGrid[r][c] = {
        type: selectedTool.type,
        color: selectedTool.type === "steel" ? "#aaa" : selectedTool.color
      };
      playBeep();
    }
    setGrid(newGrid);
  };
  const handleSave = () => {
    localStorage.setItem("merchboy_custom_brick", JSON.stringify(grid));
    playWin();
    alert("LEVEL SAVED! GO PLAY IT.");
  };
  const clearGrid = () => {
    const g = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push(null);
      }
      g.push(row);
    }
    setGrid(g);
    playBeep();
  };
  const handlePlay = () => {
    handleSave();
    navigate("/arcade/brick?mode=custom");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: '"Press Start 2P", monospace'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "var(--neon-green)", marginBottom: "20px", fontSize: "1.2rem" }, children: "LEVEL EDITOR 🛠️" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#222", padding: "15px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "TOOLS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTool({ type: "eraser" }), style: {
          padding: "10px",
          background: selectedTool.type === "eraser" ? "red" : "#333",
          border: "1px solid #555",
          color: "white",
          cursor: "pointer"
        }, children: "🗑️ ERASE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTool({ type: "steel", color: "#aaa" }), style: {
          padding: "10px",
          background: selectedTool.type === "steel" ? "#888" : "#333",
          border: "1px solid #555",
          color: "white",
          cursor: "pointer"
        }, children: "🛡️ STEEL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "10px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "BRICKS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px" }, children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTool({ type: "normal", color: c }), style: {
          width: "40px",
          height: "40px",
          background: c,
          border: selectedTool.type === "normal" && selectedTool.color === c ? "3px solid white" : "1px solid #333",
          cursor: "pointer"
        } }, c)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        border: "2px solid white",
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 30px)`,
        gridTemplateRows: `repeat(${ROWS}, 15px)`,
        gap: "1px",
        background: "#000",
        padding: "2px"
      }, children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onMouseDown: () => handleCellClick(r, c),
          onMouseEnter: (e) => {
            if (e.buttons === 1) handleCellClick(r, c);
          },
          style: {
            width: "30px",
            height: "15px",
            background: cell ? cell.color : "#1a1a1a",
            border: cell ? "1px solid rgba(255,255,255,0.2)" : "none",
            cursor: "pointer"
          }
        },
        `${r}-${c}`
      ))) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleSave, style: { background: "var(--neon-blue)", fontSize: "0.8rem" }, children: "💾 SAVE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handlePlay, style: { background: "var(--neon-green)", fontSize: "0.8rem" }, children: "▶️ TEST PLAY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearGrid, style: { padding: "10px", background: "#333", color: "white", border: "1px solid #555", cursor: "pointer" }, children: "💥 CLEAR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/brick", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "10px", width: "100%", background: "transparent", color: "#888", border: "1px solid #555", cursor: "pointer" }, children: "EXIT" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "#666", fontSize: "0.7rem" }, children: "DRAW YOUR LEVEL. STEEL BRICKS ARE INDESTRUCTIBLE." })
  ] });
};
export {
  BrickMaker as default
};
