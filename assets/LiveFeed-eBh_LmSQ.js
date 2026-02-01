import { r as reactExports, s as supabase, j as jsxRuntimeExports } from "./index-CRAV8IaB.js";
import { feedService } from "./feed-CNxWj2PR.js";
const LiveFeed = () => {
  const [messages, setMessages] = reactExports.useState([
    { id: 1, user: "System", text: "Connecting to Global Feed...", time: "Now", color: "#ffaaaa" }
  ]);
  const [isCollapsed, setIsCollapsed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const loadHistory = async () => {
      const { data } = await supabase.from("feed_events").select("*").order("created_at", { ascending: false }).limit(5);
      if (data && data.length > 0) {
        const mapped = data.map((evt) => ({
          id: evt.id,
          user: evt.player_name,
          text: evt.message,
          time: "Recent",
          color: evt.type === "win" ? "gold" : evt.type === "fail" ? "#ff4444" : "#00ccff"
        }));
        setMessages(mapped);
      } else {
        setMessages([
          { id: "sys-1", user: "SYSTEM", text: "Global Uplink Established.", time: "Now", color: "#00ff00" },
          { id: "sys-2", user: "SYSTEM", text: "Welcome to the Arcade Zone.", time: "Now", color: "#00ccff" }
        ]);
      }
    };
    loadHistory();
    const channel = supabase.channel("global-feed").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "feed_events" },
      (payload) => {
        const evt = payload.new;
        if (evt.player_name === "OPERATOR") return;
        const newMessage = {
          id: evt.id,
          user: evt.player_name,
          text: evt.message,
          time: "Just now",
          color: evt.type === "win" ? "gold" : evt.type === "fail" ? "#ff4444" : "#00ccff"
        };
        setMessages((prev) => {
          if (prev.some((m) => m.id === evt.id)) return prev;
          return [newMessage, ...prev].slice(0, 5);
        });
      }
    ).subscribe();
    const handleLocal = (e) => {
      const { message, type, user } = e.detail;
      const newMessage = {
        id: Date.now(),
        // Temp ID
        user: user || "YOU",
        text: message,
        time: "Just now",
        color: type === "win" ? "gold" : "#00ffaa"
      };
      setMessages((prev) => [newMessage, ...prev].slice(0, 5));
    };
    feedService.addEventListener("feed-message", handleLocal);
    return () => {
      supabase.removeChannel(channel);
      feedService.removeEventListener("feed-message", handleLocal);
    };
  }, []);
  const [treasuryUSD, setTreasuryUSD] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchTreasury = async () => {
      try {
        let solAmount = 0;
        try {
          const solResp = await fetch("https://api.mainnet-beta.solana.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: ["GQfGtoF7FA3iZfmwmThQrmiZv87zmk6PnqrRFYFsWSHv"]
            })
          });
          const solData = await solResp.json();
          if (solData.result) solAmount = solData.result.value / 1e9;
        } catch (e) {
          solAmount = 145.5;
        }
        let btcAmount = 45e-4;
        try {
          const btcResp = await fetch("https://blockchain.info/q/addressbalance/bc1q6dn4yaswgw9gja7pgfnakcf93r74svj5qk82qj");
          const btcSats = await btcResp.text();
          btcAmount += parseInt(btcSats) / 1e8;
        } catch (e) {
        }
        let solPrice = 140;
        let btcPrice = 65e3;
        try {
          const [pSol, pBtc] = await Promise.all([
            fetch("https://api.coinbase.com/v2/prices/SOL-USD/spot").then((r) => r.json()),
            fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot").then((r) => r.json())
          ]);
          solPrice = parseFloat(pSol.data.amount);
          btcPrice = parseFloat(pBtc.data.amount);
        } catch (e) {
        }
        const total = solAmount * solPrice + btcAmount * btcPrice;
        setTreasuryUSD(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total));
      } catch (e) {
        console.error("Treasury update failed", e);
        setTreasuryUSD("$12,450.00");
      }
    };
    fetchTreasury();
    const interval = setInterval(fetchTreasury, 6e4);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 20px auto",
    padding: isCollapsed ? "5px 20px" : "10px 20px",
    background: "rgba(0,0,0,0.8)",
    border: "1px solid #333",
    height: isCollapsed ? "30px" : "120px",
    overflow: "hidden",
    position: "relative",
    transition: "height 0.3s ease, padding 0.3s ease"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: () => setIsCollapsed(!isCollapsed),
        style: {
          position: "absolute",
          bottom: 5,
          right: 10,
          zIndex: 10,
          cursor: "pointer",
          color: "#666",
          fontSize: "10px",
          padding: "2px 5px",
          border: "1px solid #333",
          borderRadius: "3px",
          background: "black"
        },
        children: isCollapsed ? "▼ EXPAND" : "▲ HIDE"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 5,
      left: 10,
      fontSize: "0.7rem",
      color: "#ffd700",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "monospace"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🏛️ TREASURY:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold" }, children: treasuryUSD || "Loading..." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 5,
      right: 60,
      fontSize: "0.7rem",
      color: "var(--neon-green)",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 6, height: 6, background: "var(--neon-green)", borderRadius: "50%", animation: "blink 1s infinite" } }),
      "LIVE"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "25px", display: "flex", flexDirection: "column", gap: "8px", opacity: isCollapsed ? 0 : 1, transition: "opacity 0.2s" }, children: messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "10px",
      textAlign: "center",
      opacity: 0.7,
      color: "var(--neon-green)",
      fontFamily: "monospace",
      letterSpacing: "1px",
      animation: "blink 2s infinite",
      fontSize: "0.8rem"
    }, children: [
      "// GLOBAL UPLINK ONLINE",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.7rem", color: "#666" }, children: "listening for signals..." })
    ] }) : messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      fontSize: "0.85rem",
      opacity: 1 - i * 0.2,
      // Fade out older messages
      transform: `translateX(${i * 5}px)`,
      transition: "all 0.3s"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-blue)", fontWeight: "bold" }, children: [
        "@",
        msg.user
      ] }),
      ": ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: msg.color }, children: msg.text })
    ] }, msg.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes blink { 50% { opacity: 0; } }
            ` })
  ] });
};
export {
  LiveFeed as L
};
