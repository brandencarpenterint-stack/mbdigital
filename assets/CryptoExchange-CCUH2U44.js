import { a as useGamification, b as useRetroSound, c as useToast, r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, S as SquishyButton } from "./index-D1EmECzN.js";
const CryptoExchange = () => {
  const { coins, addCoins, cryptoMarket, cryptoPortfolio, buyCrypto, sellCrypto } = useGamification();
  const { playBeep } = useRetroSound();
  const { showToast } = useToast();
  const market = cryptoMarket;
  const portfolio = cryptoPortfolio;
  const { shopState } = useGamification();
  const hasInsider = shopState?.unlocked.includes("hack_insider");
  const [selectedTokenId, setSelectedTokenId] = reactExports.useState("MCH");
  const selectedToken = market.find((t) => t.id === selectedTokenId) || market[0];
  reactExports.useRef(null);
  const handleBuy = () => {
    playBeep();
    buyCrypto(selectedToken.id, 1);
  };
  const handleSell = () => {
    playBeep();
    sellCrypto(selectedToken.id, 1);
  };
  const Graph = ({ data, color, hasInsider: hasInsider2, trend }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const width = 100;
    const height = 100;
    const points = data.map((val, i) => {
      const x = i / (data.length - 1) * width;
      const y = height - (val - min) / range * height;
      return `${x},${y}`;
    }).join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { width: "100%", height: "100%", overflow: "visible" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `grad-${color}`, x1: "0", x2: "0", y1: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M 0,100 L 0,${100 - (data[0] - min) / range * 100} ${points.replace(/,/g, " ")} L 100,100 Z`, fill: `url(#grad-${color})`, stroke: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: color, strokeWidth: "2", points, vectorEffect: "non-scaling-stroke" }),
      hasInsider2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "line",
        {
          x1: "90",
          y1: 100 - (data[data.length - 1] - min) / range * 100,
          x2: "100",
          y2: 100 - (data[data.length - 1] * (trend > 0 ? 1.1 : 0.9) - min) / range * 100,
          stroke: "white",
          strokeWidth: "2",
          strokeDasharray: "4",
          opacity: "0.5"
        }
      )
    ] });
  };
  const portfolioValue = market.reduce((acc, token) => acc + (portfolio[token.id] || 0) * token.price, 0);
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.5rem", opacity: 0.8, color: "white" }, children: "⬅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.5rem", color: "#00ffcc", textShadow: "0 0 10px #00ffcc" }, children: "MBX EXCHANGE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#666" }, children: "DECENTRALIZED TRADING PROTOCOL" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffcc00", fontWeight: "bold" }, children: [
          coins.toFixed(0),
          " CP"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#00ffcc" }, children: [
          "ASSETS: ",
          portfolioValue.toFixed(0),
          " CP"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, padding: "20px", gap: "20px", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "10px" }, children: market.map((token) => {
        const isSelected = token.id === selectedTokenId;
        const owned = portfolio[token.id] || 0;
        const lastPrice = token.history[token.history.length - 2];
        const isUp = token.price >= lastPrice;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            onClick: () => {
              setSelectedTokenId(token.id);
              playBeep();
            },
            whileHover: { scale: 1.02 },
            style: {
              background: isSelected ? "#1a1a2e" : "#111",
              border: isSelected ? `2px solid ${token.color}` : "1px solid #333",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: "8px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.5rem" }, children: token.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: token.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888" }, children: [
                    "OWNED: ",
                    owned
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: token.price.toFixed(2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: isUp ? "#00ff00" : "#ff0055" }, children: [
                  isUp ? "▲" : "▼",
                  " ",
                  Math.abs((token.price - lastPrice) / lastPrice * 100).toFixed(1),
                  "%"
                ] })
              ] })
            ]
          },
          token.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 2, minWidth: "300px", background: "#111", borderRadius: "12px", padding: "20px", border: "1px solid #333" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: selectedToken.color, fontSize: "2rem" }, children: selectedToken.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0 }, children: selectedToken.price.toFixed(2) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "200px", borderBottom: "1px solid #333", borderLeft: "1px solid #333", padding: "10px", marginBottom: "20px", background: `linear-gradient(to top, ${selectedToken.color}11, transparent)` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Graph, { data: selectedToken.history, color: selectedToken.color, hasInsider, trend: selectedToken.trend }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "20px", background: "#0a0a0a", borderRadius: "8px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", marginBottom: "10px" }, children: "MY WALLET" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem", marginBottom: "20px" }, children: [
              portfolio[selectedToken.id],
              " ",
              selectedToken.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleSell, style: { width: "100%", background: "#ff0055", color: "white" }, children: "SELL (-1)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "20px", background: "#0a0a0a", borderRadius: "8px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", marginBottom: "10px" }, children: "MARKET PRICE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", marginBottom: "20px" }, children: selectedToken.price.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleBuy, style: { width: "100%", background: "#00ffcc", color: "black" }, children: "BUY (+1)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", fontSize: "0.7rem", color: "#555", textAlign: "center" }, children: "*Trading involves risk. You may lose all your fake internet money." })
      ] })
    ] })
  ] });
};
export {
  CryptoExchange as default
};
