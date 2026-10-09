import { u as useGamification, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-BryxHj3G.js";
const CryptoExchange = () => {
  const { coins } = useGamification();
  const [btcData, setBtcData] = reactExports.useState([]);
  const [currentPrice, setCurrentPrice] = reactExports.useState(0);
  const [priceChange, setPriceChange] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchBtc = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1");
        const data = await res.json();
        if (data.prices) {
          const prices = data.prices.map((p) => p[1]);
          setBtcData(prices);
          const current = prices[prices.length - 1];
          const first = prices[0];
          setCurrentPrice(current);
          setPriceChange((current - first) / first * 100);
        }
      } catch (e) {
        console.error("Failed to fetch BTC", e);
      }
      setLoading(false);
    };
    fetchBtc();
    const interval = setInterval(fetchBtc, 6e4);
    return () => clearInterval(interval);
  }, []);
  const Graph = ({ data, color: color2 }) => {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `grad-${color2.replace("#", "")}`, x1: "0", x2: "0", y1: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color2, stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color2, stopOpacity: "0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M 0,100 L 0,${100 - (data[0] - min) / range * 100} ${points.replace(/,/g, " ")} L 100,100 Z`, fill: `url(#grad-${color2.replace("#", "")})`, stroke: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: color2, strokeWidth: "2", points, vectorEffect: "non-scaling-stroke" })
    ] });
  };
  const isUp = priceChange >= 0;
  const color = isUp ? "#00ff00" : "#ff0055";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#0a0a12",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    paddingBottom: "100px",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #333" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.5rem", opacity: 0.8, color: "white" }, children: "◄" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.5rem", color: "#f7931a", textShadow: "0 0 10px #f7931a" }, children: "BITCOIN TRACKER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#666" }, children: "LIVE MAINFRAME FEED" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffcc00", fontWeight: "bold" }, children: [
        coins.toFixed(0),
        " CP"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flex: 1, padding: "20px", gap: "20px", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, maxWidth: "800px", background: "#111", borderRadius: "12px", padding: "40px", border: "1px solid #333", boxShadow: "0 10px 50px rgba(0,0,0,0.5)" }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#f7931a", padding: "100px" }, children: "ESTABLISHING SATELLITE LINK..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "40px", background: "#f7931a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem", color: "white" }, children: "₿" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "white", fontSize: "2.5rem" }, children: "Bitcoin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", fontSize: "1.2rem" }, children: "BTC" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { margin: 0, fontSize: "3rem", color: "white" }, children: [
            "$",
            currentPrice.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.2rem", color, fontWeight: "bold" }, children: [
            isUp ? "▲" : "▼",
            " ",
            Math.abs(priceChange).toFixed(2),
            "% (24H)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "300px", borderBottom: "1px solid #333", borderLeft: "1px solid #333", padding: "10px", background: `linear-gradient(to top, ${color}11, transparent)`, position: "relative" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Graph, { data: btcData, color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "-25px", left: 0, color: "#666", fontSize: "0.8rem" }, children: "24 Hours Ago" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: "-25px", right: 0, color: "#666", fontSize: "0.8rem" }, children: "Now" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "40px", padding: "20px", background: "#1a1a1a", borderRadius: "8px", textAlign: "center", border: "1px solid #333" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 10px 0", color: "#f7931a" }, children: "NETWORK STATUS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, color: "#aaa" }, children: "Live feed provided by CoinGecko Global Oracle. Updates automatically every 60 seconds." })
      ] })
    ] }) }) })
  ] });
};
export {
  CryptoExchange as default
};
