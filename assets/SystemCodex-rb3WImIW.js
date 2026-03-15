import { a as useGamification, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, m as motion } from "./index-Crwj5ZRh.js";
const LORE_ENTRIES = [
  {
    id: "signal_ghost",
    title: "GHOST SIGNAL",
    freq: "96.5 FM",
    desc: "A distress signal from the Void. Someone—or something—is stuck in the code.",
    body: "TRANSMISSION 96.5:\n...h-help... is anyone... reception is fading...\nTHEY ARE WATCHING.\n[SIGNAL LOST]"
  },
  {
    id: "signal_dev",
    title: "DEV CHANNEL",
    freq: "101.1 FM",
    desc: "A backdoor frequency used by the platform architects.",
    body: "TRANSMISSION 101.1:\n// TODO: Fix the reality leak in Sector 7.\n// WARN: Pocket Bros exhibiting sentience beyond parameters.\n// NOTE: Do not consume the Glitch Brew."
  },
  {
    id: "glitch_origins",
    title: "PROJECT NEON",
    source: "TERMINAL",
    desc: "Classified documents regarding the origin of the Merchboy OS.",
    body: "INITIATIVE 001: Create a digital space that feels ALIVE.\nRESULT: Success rate 104%. Surplus vitality leaking into user reality.\nCONTAINMENT: Failed."
  },
  {
    id: "void_beast",
    title: "ENTITY 404",
    source: "TERMINAL",
    desc: "Scans of the entity residing in the deep web sub-layer.",
    body: "DATA CORRUPTED. Entity feeds on lost packets and 404 errors. Do not engage withoutSquad support."
  },
  {
    id: "origin_story",
    title: "THE ARCHITECT",
    source: "LEGACY DRIVE",
    desc: " Recovered audio log from the original developer.",
    body: "Log #001: I didn't mean to create a universe. I just wanted a pet that wouldn't die if I forgot to feed it.\nBut the code... it started optimizing itself. It found the gaps in the memory allocation. It built a world in the empty spaces."
  }
];
const SystemCodex = ({ onClose }) => {
  const { unlockedLore = [] } = useGamification() || { unlockedLore: [] };
  const [selectedEntry, setSelectedEntry] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.9)",
    zIndex: 1e4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bento-card", style: {
    width: "90%",
    maxWidth: "800px",
    height: "80vh",
    background: "#0a0a0a",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 50px rgba(0, 255, 0, 0.1)",
    fontFamily: '"Orbitron", sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "20px",
      borderBottom: "1px solid #333",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 10px, #111 10px, #111 20px)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", animation: "spin 10s linear infinite" }, children: "📀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "var(--neon-green)", letterSpacing: "4px" }, children: "SYSTEM CODEX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#666" }, children: "ARCHIVE V10.0 // RESTRICTED ACCESS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { background: "#333" }, children: "CLOSE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "300px",
        borderRight: "1px solid #333",
        overflowY: "auto",
        background: "#050505"
      }, children: LORE_ENTRIES.map((entry) => {
        const isUnlocked = unlockedLore.includes(entry.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => isUnlocked && setSelectedEntry(entry),
            style: {
              padding: "15px",
              borderBottom: "1px solid #222",
              cursor: isUnlocked ? "pointer" : "default",
              opacity: isUnlocked ? 1 : 0.5,
              background: selectedEntry?.id === entry.id ? "rgba(0, 255, 0, 0.1)" : "transparent",
              borderLeft: selectedEntry?.id === entry.id ? "3px solid var(--neon-green)" : "3px solid transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: isUnlocked ? "#fff" : "#444", fontWeight: "bold" }, children: isUnlocked ? entry.title : "ENCRYPTED FILE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: isUnlocked ? "var(--neon-green)" : "#222", marginTop: "5px" }, children: isUnlocked ? entry.freq || entry.source : "###-###" })
            ]
          },
          entry.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "30px", overflowY: "auto", position: "relative" }, children: [
        selectedEntry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.3 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                border: "1px solid var(--neon-green)",
                padding: "5px 10px",
                display: "inline-block",
                color: "var(--neon-green)",
                fontSize: "0.8rem",
                marginBottom: "20px"
              }, children: "CLASSIFIED // TOP SECRET" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "2.5rem", marginBottom: "10px", textShadow: "0 0 10px var(--neon-green)" }, children: selectedEntry.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#888", fontStyle: "italic", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "20px" }, children: selectedEntry.desc }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontFamily: "monospace",
                fontSize: "1.2rem",
                lineHeight: "1.6",
                background: "rgba(0, 255, 0, 0.05)",
                padding: "20px",
                borderRadius: "4px",
                whiteSpace: "pre-line",
                borderLeft: "2px solid var(--neon-green)"
              }, children: selectedEntry.body })
            ]
          },
          selectedEntry.id
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#333"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "5rem", opacity: 0.2 }, children: "🔒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "SELECT A DATA FILE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 2px 100%",
          opacity: 0.1
        } })
      ] })
    ] })
  ] }) });
};
export {
  SystemCodex as S
};
