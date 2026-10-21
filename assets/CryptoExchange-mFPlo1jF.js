import { a as useGamification, j as jsxRuntimeExports, L as Link } from "./index-utgmxuS9.js";
import { u as useRealBtc } from "./useRealBtc-BxmE4sPg.js";
const CryptoExchange = () => {
  const { coins } = useGamification();
  const { btcPrice, priceChange24h, chartData, loading, lastUpdated } = useRealBtc();
  const isUp = priceChange24h >= 0;
  const color = isUp ? "#00ffcc" : "#ff0055";
  const Graph = ({ data, strokeColor }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 100;
    const points = data.map((val, i) => {
      const x = i / (data.length - 1) * width;
      const y = height - (val - min) / range * height;
      return `${x},${y}`;
    }).join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { width: "100%", height: "100%", overflow: "visible" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "btcGrad", x1: "0", x2: "0", y1: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: strokeColor, stopOpacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: strokeColor, stopOpacity: "0.0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: `0,100 ${points} 100,100`, fill: "url(#btcGrad)", stroke: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: strokeColor, strokeWidth: "2.5", points, vectorEffect: "non-scaling-stroke" })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#0a0a12",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    paddingBottom: "100px",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #222", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.2rem", color: "#00ffcc", fontWeight: "bold" }, children: "◄ TERMINAL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.4rem", color: "#f7931a", textShadow: "0 0 12px rgba(247, 147, 26, 0.6)", letterSpacing: "2px" }, children: "₿ LIVE BITCOIN ORACLE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.65rem", color: "#888", marginTop: "3px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: "#00ffcc", display: "inline-block", boxShadow: "0 0 6px #00ffcc" } }),
          "GLOBAL MAINFRAME FEED • REFRESH 30S"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffd700", fontWeight: "bold", fontSize: "1rem" }, children: [
        "🪙 ",
        coins.toFixed(0),
        " CP"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flex: 1, padding: "20px", gap: "20px", justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", maxWidth: "850px", background: "linear-gradient(145deg, #13131f, #0b0b12)", borderRadius: "20px", padding: "35px", border: "1px solid #28283c", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }, children: loading && chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "#f7931a", padding: "100px", fontSize: "1.1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "15px" }, children: "🛰️" }),
      "SYNCING GLOBAL BLOCKCHAIN NODES..."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "35px", flexWrap: "wrap", gap: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "52px", height: "52px", background: "linear-gradient(135deg, #f7931a, #ffb347)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "2rem", color: "white", boxShadow: "0 0 20px rgba(247, 147, 26, 0.4)" }, children: "₿" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "white", fontSize: "2.2rem", fontWeight: "800" }, children: "Bitcoin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", fontSize: "1rem", letterSpacing: "1px" }, children: "BTC / USD • SPOT" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { margin: 0, fontSize: "2.6rem", color: "white", fontWeight: "900", letterSpacing: "1px" }, children: [
            "$",
            btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.1rem", color, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", marginTop: "4px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isUp ? "▲" : "▼" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.abs(priceChange24h).toFixed(2),
              "% (24H)"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "300px", borderBottom: "1px solid #2d2d40", borderLeft: "1px solid #2d2d40", padding: "10px", background: `linear-gradient(to top, ${color}15, transparent)`, position: "relative", borderRadius: "4px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Graph, { data: chartData, strokeColor: color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "-26px", left: 4, color: "#666", fontSize: "0.75rem" }, children: "-24H" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "-26px", right: 4, color: "#666", fontSize: "0.75rem" }, children: "NOW" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "45px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "12px", border: "1px solid #222" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#777", fontSize: "0.75rem" }, children: "24H HIGH EST." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontSize: "1.2rem", fontWeight: "bold", marginTop: "4px" }, children: [
            "$",
            Math.max(...chartData.length ? chartData : [btcPrice]).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "12px", border: "1px solid #222" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#777", fontSize: "0.75rem" }, children: "24H LOW EST." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontSize: "1.2rem", fontWeight: "bold", marginTop: "4px" }, children: [
            "$",
            Math.min(...chartData.length ? chartData : [btcPrice]).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "12px", border: "1px solid #222" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#777", fontSize: "0.75rem" }, children: "FEED SYNC" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00ffcc", fontSize: "1rem", fontWeight: "bold", marginTop: "4px" }, children: lastUpdated.toLocaleTimeString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "25px", padding: "16px", background: "rgba(247, 147, 26, 0.08)", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(247, 147, 26, 0.25)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f7931a", fontSize: "0.85rem", fontWeight: "bold" }, children: "⚡ REAL-TIME MULTI-ORACLE ACTIVE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "6px 0 0 0", color: "#999", fontSize: "0.75rem" }, children: "Aggregated live price across institutional gateways. 100% verified real market data." })
      ] })
    ] }) }) })
  ] });
};
export {
  CryptoExchange as default
};
