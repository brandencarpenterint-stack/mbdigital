import { a as useGamification, r as reactExports, s as supabase, f as feedService, j as jsxRuntimeExports, c as usePocketBro, u as useRetroSound, b as useToast, A as AnimatePresence, m as motion, L as Link, P as PocketPet } from "./index-DT_AxRsZ.js";
import { L as LeaderboardTable } from "./LeaderboardTable-bXMPKkXr.js";
import { S as SponsorStationModal } from "./SponsorStationModal-u7YGiIAG.js";
import "./LeaderboardService-Cmfqvoar.js";
const LiveFeed = () => {
  const { userProfile } = useGamification() || {};
  const [messages, setMessages] = reactExports.useState([
    { id: 1, user: "System", text: "Connecting to Global Feed...", time: "Now", color: "#ffaaaa" }
  ]);
  const [isCollapsed, setIsCollapsed] = reactExports.useState(true);
  const [inputMsg, setInputMsg] = reactExports.useState("");
  const [isSending, setIsSending] = reactExports.useState(false);
  const sendMessage = async () => {
    if (!inputMsg.trim()) return;
    setIsSending(true);
    const { error } = await supabase.from("feed_events").insert([{
      player_name: userProfile?.name || "ANON",
      message: inputMsg.substring(0, 50),
      // Cap length
      type: "chat"
    }]);
    if (error) {
      console.error("Failed to send:", error);
    } else {
      setInputMsg("");
    }
    setIsSending(false);
  };
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
    const SIM_EVENTS = [
      { user: "TurboDino", text: "Won 1,800 CP on Bro Derby Exacta! 🏇", color: "gold" },
      { user: "CyberBunny", text: "Cashed out 14.5x on Cyber Crash! 🚀", color: "gold" },
      { user: "WhaleBro", text: "Hit Double Down 21 against Dealer! 🃏", color: "#00ccff" },
      { user: "AstroNeko", text: "Spelled B-R-O on Cyber Pinball! ⚡", color: "#ff00ff" },
      { user: "DonDino", text: "Straight Up 7 paid 35:1 on Roulette! 🎡", color: "gold" },
      { user: "NeonSamurai", text: "Vault pool is over 40k CP, who is spinning? 🔓", color: "#00ffcc" }
    ];
    const simInterval = setInterval(() => {
      const ev = SIM_EVENTS[Math.floor(Math.random() * SIM_EVENTS.length)];
      const simMessage = {
        id: "sim_" + Date.now() + Math.random(),
        user: ev.user,
        text: ev.text,
        time: "Just now",
        color: ev.color
      };
      setMessages((prev) => [simMessage, ...prev].slice(0, 6));
    }, 13e3);
    return () => {
      supabase.removeChannel(channel);
      feedService.removeEventListener("feed-message", handleLocal);
      clearInterval(simInterval);
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
    const botInterval = setInterval(() => {
      const BOTS = ["NeonSlayer", "CyberRat", "VoidWalker", "PixelKing", "GlitchWitch", "RetroDad"];
      const EVENTS = [
        { text: "just won Snake!", type: "win" },
        { text: "found a rare sticker.", type: "info" },
        { text: "is vibing in the lounge.", type: "info" },
        { text: "lost 50 coins in Slots.", type: "fail" },
        { text: "evolved their PocketBro!", type: "win" },
        { text: "hacked the mainframe...", type: "info" }
      ];
      if (Math.random() > 0.7) {
        const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
        const evt = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        const ghostMsg = {
          id: `ghost-${Date.now()}`,
          user: bot,
          text: evt.text,
          time: "Now",
          color: evt.type === "win" ? "gold" : evt.type === "fail" ? "#ff4444" : "#00ccff"
        };
        setMessages((prev) => [ghostMsg, ...prev].slice(0, 5));
      }
    }, 1e4);
    return () => {
      clearInterval(interval);
      clearInterval(botInterval);
    };
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "25px", display: "flex", flexDirection: "column", gap: "8px", opacity: isCollapsed ? 0 : 1, transition: "opacity 0.2s" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "hidden" }, children: messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
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
      ] }) : messages.slice(0, 4).map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        fontSize: "0.85rem",
        opacity: 1 - i * 0.15,
        transform: `translateX(${i * 2}px)`,
        transition: "all 0.3s",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-blue)", fontWeight: "bold" }, children: [
          "@",
          msg.user
        ] }),
        ": ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: msg.color }, children: msg.text })
      ] }, msg.id)) }),
      !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", marginTop: "5px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Broadcast...",
            value: inputMsg,
            onChange: (e) => setInputMsg(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && sendMessage(),
            style: {
              flex: 1,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              padding: "2px 8px",
              fontSize: "0.8rem",
              borderRadius: "4px",
              fontFamily: "monospace"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: sendMessage,
            disabled: !inputMsg.trim() || isSending,
            style: {
              background: "var(--neon-blue)",
              color: "black",
              border: "none",
              fontWeight: "bold",
              fontSize: "0.7rem",
              padding: "2px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: !inputMsg.trim() || isSending ? 0.5 : 1
            },
            children: "TXT"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes blink { 50% { opacity: 0; } }
            ` })
  ] });
};
const ArcadeCabinet = ({ game, highScore, zoneControl, onClick }) => {
  const owner = zoneControl?.owner || "NEUTRAL";
  zoneControl?.points || 0;
  let glowClass = "glow-neutral";
  let factionColor = "#888";
  if (owner === "CYBER") {
    glowClass = "glow-cyber";
    factionColor = "#00f260";
  }
  if (owner === "SOLAR") {
    glowClass = "glow-solar";
    factionColor = "gold";
  }
  if (owner === "VOID") {
    glowClass = "glow-void";
    factionColor = "#b026ff";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cabinet-container", onClick, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `cabinet`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-face cab-left" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-face cab-right" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-face cab-top" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-face cab-back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `cab-face cab-front ${glowClass}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cab-marquee", style: { color: factionColor, backgroundColor: owner === "NEUTRAL" ? "#111" : "black" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marquee-title", children: game.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "rgba(255,255,255,0.5)",
            boxShadow: `0 0 10px ${factionColor}`
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-screen-housing", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cab-screen", style: { background: game.gradient }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cab-screen-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", filter: "drop-shadow(0 0 10px black)" }, children: game.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "rgba(0,0,0,0.6)",
            padding: "5px 10px",
            borderRadius: "5px",
            marginTop: "10px",
            color: "white",
            textAlign: "center",
            border: `1px solid ${factionColor}`
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#aaa" }, children: "HIGH SCORE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", fontWeight: "bold", color: "lime" }, children: highScore })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            marginTop: "10px",
            fontSize: "0.6rem",
            fontWeight: "bold",
            color: factionColor,
            textShadow: "0 1px 2px black",
            background: "rgba(0,0,0,0.5)",
            padding: "2px 8px",
            borderRadius: "10px"
          }, children: [
            owner,
            " CONTROL"
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cab-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "joystick", style: { background: factionColor } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "btn-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "arcade-btn", style: { background: "red" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "arcade-btn", style: { background: "blue" } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "4px",
            height: "20px",
            background: "#333",
            boxShadow: "inset 0 0 5px black",
            border: "1px solid #555"
          } }),
          " "
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      bottom: -20,
      left: "50%",
      transform: "translateX(-50%)",
      width: "200px",
      height: "20px",
      background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%)",
      pointerEvents: "none"
    } })
  ] });
};
const OnlinePlaza = () => {
  const { userProfile, xp } = useGamification() || {};
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchOnline = async () => {
      let users = [];
      if (supabase) {
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1e3).toISOString();
        const { data } = await supabase.from("profiles").select("display_name, avatar_url, coins, last_seen").gt("last_seen", fifteenMinsAgo).order("last_seen", { ascending: false }).limit(20);
        if (data) {
          users = data.map((u) => ({
            ...u,
            level: Math.floor(Math.sqrt((u.coins || 0) / 250)) || 1
          }));
        }
      }
      if (userProfile && userProfile.name) {
        const isMe = users.find((u) => u.display_name === userProfile.name);
        if (!isMe) {
          users.unshift({
            display_name: userProfile.name,
            avatar_url: userProfile.avatar_url,
            level: Math.floor(Math.sqrt((xp || 0) / 250)) || 1
          });
        }
      }
      setOnlineUsers(users);
      setLoading(false);
    };
    fetchOnline();
    const interval = setInterval(fetchOnline, 3e4);
    return () => clearInterval(interval);
  }, [userProfile, xp]);
  if (loading) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "800px", margin: "0 auto 20px auto", textAlign: "left" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "var(--neon-green)", fontFamily: '"Orbitron", sans-serif', fontSize: "0.85rem", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-green)", boxShadow: "0 0 10px var(--neon-green)" } }),
      "ONLINE PLAZA (",
      onlineUsers.length,
      " BROS DETECTED)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      paddingBottom: "10px",
      scrollbarWidth: "thin",
      scrollbarColor: "#333 transparent"
    }, children: [
      onlineUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontStyle: "italic", fontSize: "0.8rem" }, children: "No other signals detected..." }),
      onlineUsers.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -3 },
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: idx * 0.04 },
          style: {
            minWidth: "90px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "1px solid #00ffcc", marginBottom: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar_url || "/assets/skins/face_default.png", alt: user.display_name, style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: "0.75rem", fontWeight: "bold", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: user.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700", fontSize: "0.65rem", fontFamily: "monospace" }, children: [
              "LVL ",
              user.level
            ] })
          ]
        },
        idx
      ))
    ] })
  ] });
};
const CATEGORIES = [
  { id: "all", label: "🌟 ALL GAMES", count: 26 },
  { id: "casino", label: "🎰 CYBER CASINO", count: 9 },
  { id: "action", label: "⚡ ACTION & SKILL", count: 9 },
  { id: "retro", label: "👾 RETRO CLASSICS", count: 8 }
];
const games = [
  // CASINO & HIGH-ROLLER
  {
    id: "crash",
    title: "CYBER CRASH",
    category: "casino",
    desc: "Rocket Multipliers & 100x Auto-Cashouts",
    gradient: "linear-gradient(135deg, #ff0055 0%, #ffd700 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_dino.png", alt: "Crash", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #ff0055)" } }),
    colSpan: 2,
    path: "/arcade/crash",
    leaderboardId: "cyber_crash"
  },
  {
    id: "mines",
    title: "CYBER MINES 2088",
    category: "casino",
    desc: "5x5 Grid, Scout Drones & Exponential Gems",
    gradient: "linear-gradient(135deg, #00ff66 0%, #ffd700 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_bunny.png", alt: "Mines", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00ff66)" } }),
    colSpan: 2,
    path: "/arcade/mines",
    leaderboardId: "cyber_mines"
  },
  {
    id: "hilo",
    title: "CYBER HI-LO 2088",
    category: "casino",
    desc: "Card Streak Guessing, Up to 180x Multipliers",
    gradient: "linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_bunny.png", alt: "Hi-Lo", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00ff66)" } }),
    colSpan: 2,
    path: "/arcade/hilo",
    leaderboardId: "cyber_hilo"
  },
  {
    id: "scratchers",
    title: "CYBER SCRATCHERS",
    category: "casino",
    desc: "Silver Foil Instant Lottery, 100k CP Jackpots",
    gradient: "linear-gradient(135deg, #ffd700 0%, #ff8800 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", alt: "Scratchers", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #ffd700)" } }),
    colSpan: 2,
    path: "/arcade/scratchers",
    leaderboardId: "cyber_scratchers"
  },
  {
    id: "roulette",
    title: "CYBER ROULETTE",
    category: "casino",
    desc: "Single-Zero European Wheel & 35:1 Payouts",
    gradient: "linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", alt: "Roulette", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00ff66)" } }),
    colSpan: 2,
    path: "/arcade/roulette",
    leaderboardId: "cyber_roulette"
  },
  {
    id: "blackjack",
    title: "CYBER 21 BLACKJACK",
    category: "casino",
    desc: "3:2 Payouts, Card Counting HUD & High Stakes",
    gradient: "linear-gradient(135deg, #0d2818 0%, #00ff66 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00ff66)" } }),
    colSpan: 2,
    path: "/arcade/blackjack",
    leaderboardId: "cyber_21"
  },
  {
    id: "derby",
    title: "CYBER DERBY",
    category: "casino",
    desc: "8-Bro Cyber Velodrome Racing & Exacta Bets",
    gradient: "linear-gradient(135deg, #00ff66 0%, #00e5ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_dino.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00ff66)" } }),
    colSpan: 2,
    path: "/arcade/derby",
    leaderboardId: "cyber_derby"
  },
  {
    id: "slots",
    title: "COSMIC SLOTS",
    category: "casino",
    desc: "3-Reel Crypto Tumbler & Vault Jackpots",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px gold)" } }),
    colSpan: 2,
    leaderboardId: "cosmic_slots"
  },
  {
    id: "underworld",
    title: "THE UNDERWORLD",
    category: "casino",
    desc: "High-Stakes Peer-to-Peer Wagers",
    gradient: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_hoodie.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #4e4376)" } }),
    colSpan: 2,
    path: "/underworld"
  },
  // ACTION & SKILL
  {
    id: "dozer",
    title: "CYBER COIN DOZER",
    category: "action",
    desc: "Mechanical Neon Pusher, Figurines & Quakes",
    gradient: "linear-gradient(135deg, #00e5ff 0%, #ff007f 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_star.png", alt: "Coin Dozer", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00e5ff)" } }),
    colSpan: 2,
    path: "/arcade/dozer",
    leaderboardId: "cyber_dozer"
  },
  {
    id: "pinball",
    title: "CYBER PINBALL 2088",
    category: "action",
    desc: "Bumper Chaos, B-R-O Drop Targets & Multiball",
    gradient: "linear-gradient(135deg, #ff007f 0%, #00e5ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_star.png", alt: "Pinball", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00e5ff)" } }),
    colSpan: 2,
    path: "/arcade/pinball",
    leaderboardId: "cyber_pinball"
  },
  {
    id: "plinko",
    title: "CYBER PLINKO",
    category: "action",
    desc: "Pegged Gravity 100x High-Multiplier Drops",
    gradient: "linear-gradient(135deg, #f107a3 0%, #7b2ff7 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_star.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #f107a3)" } }),
    colSpan: 2,
    path: "/arcade/plinko",
    leaderboardId: "cyber_plinko"
  },
  {
    id: "drift",
    title: "NEON DRIFT: 2088",
    category: "action",
    desc: "Pseudo-3D Synthwave Supercar Racer",
    gradient: "linear-gradient(135deg, #ff007f 0%, #00ffcc 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_gamer.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #ff007f)" } }),
    colSpan: 2,
    path: "/arcade/drift",
    leaderboardId: "neon_drift"
  },
  {
    id: "merch-defense",
    title: "MERCH DEFENSE",
    category: "action",
    desc: "Branded Cyber Tower Defense",
    gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_astro.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #00c6ff)" } }),
    colSpan: 2,
    leaderboardId: "merch_defense"
  },
  {
    id: "galaxy",
    title: "GALAXY DEFENDER",
    category: "action",
    desc: "Retro Space Shooter & Boss Battles",
    gradient: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_space.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #8E2DE2)" } }),
    colSpan: 1,
    leaderboardId: "galaxy_defender"
  },
  {
    id: "face-runner",
    title: "FACE WARP",
    category: "action",
    desc: "High-Speed 3D Tunnel Chaos",
    gradient: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_rainbow.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px cyan)" } }),
    colSpan: 2,
    leaderboardId: "face_runner"
  },
  {
    id: "bro-cannon",
    title: "BRO CANNON",
    category: "action",
    desc: "Trajectory Launch Physics & Air Bounces",
    gradient: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/avatar_ghost.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #FF512F)" } }),
    colSpan: 1,
    leaderboardId: "bro_cannon"
  },
  {
    id: "arena",
    title: "THE ARENA",
    category: "action",
    desc: "Turn-Based RPG Squad Battles",
    gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_gamer.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #ff0844)" } }),
    colSpan: 2,
    path: "/arena"
  },
  // RETRO CLASSICS
  {
    id: "brick",
    title: "NEON BRICKS",
    category: "retro",
    desc: "Breakout Pixel Destruction",
    gradient: "linear-gradient(135deg, #da22ff 0%, #9733ee 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_gamer.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #da22ff)" } }),
    colSpan: 1,
    leaderboardId: "neon_bricks"
  },
  {
    id: "snake",
    title: "NEON SNAKE",
    category: "retro",
    desc: "Retro Grid Slither",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_dino.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #38ef7d)" } }),
    colSpan: 1,
    leaderboardId: "neon_snake"
  },
  {
    id: "flappy",
    title: "FLAPPY BRO",
    category: "retro",
    desc: "Physics Pipe Dodging",
    gradient: "linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_default.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #22C1C3)" } }),
    colSpan: 1,
    leaderboardId: "flappy_mascot"
  },
  {
    id: "unboxing",
    title: "HYPE DROP",
    category: "retro",
    desc: "Mystery Crates & Rare Skins",
    gradient: "linear-gradient(135deg, #ff007f 0%, #7928ca 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_star.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #ff007f)" } }),
    colSpan: 2,
    leaderboardId: "hype_drop"
  },
  {
    id: "wheel",
    title: "CYBER WHEEL",
    category: "retro",
    desc: "10,000 CP Daily Free Spin",
    gradient: "linear-gradient(135deg, #ffd700 0%, #ff007f 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px gold)" } }),
    colSpan: 2,
    path: "/arcade/wheel",
    leaderboardId: "cyber_wheel"
  },
  {
    id: "merch-jump",
    title: "MERCH JUMP",
    category: "retro",
    desc: "Endless Platform Jumping",
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_bear.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #66a6ff)" } }),
    colSpan: 1,
    leaderboardId: "merch_jump"
  },
  {
    id: "fishing",
    title: "CRAZY FISHING",
    category: "retro",
    desc: "Reel in Rare Cyber Leviathans",
    gradient: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/merchboy_cat.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #0072FF)" } }),
    colSpan: 1,
    leaderboardId: "crazy_fishing"
  },
  {
    id: "whack",
    title: "WHACK-A-MOLE",
    category: "retro",
    desc: "Fast Reflex Mascot Bonking",
    gradient: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/mole_normal.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #FF416C)" } }),
    colSpan: 1,
    leaderboardId: "whack_a_mole"
  },
  {
    id: "memory",
    title: "MEMORY MATCH",
    category: "retro",
    desc: "Cyber Deck Pattern Recall",
    gradient: "linear-gradient(135deg, #f79d00 0%, #64f38c 100%)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_cat.png", style: { height: "60px", objectFit: "contain", filter: "drop-shadow(0 0 10px #64f38c)" } }),
    colSpan: 1,
    leaderboardId: "memory_match"
  }
];
const getHighScore = (id, stats) => {
  if (!stats) return 0;
  if (id === "snake") return stats.snakeHighScore || 0;
  if (id === "whack") return stats.whackHighScore || 0;
  if (id === "memory") return stats.memoryHighScore || 0;
  if (id === "galaxy") return stats.galaxyHighScore || 0;
  if (id === "brick") return stats.brickHighScore || 0;
  if (id === "flappy") return stats.flappyHighScore || 0;
  if (id === "fishing") return stats.crazyFishingHighScore || 0;
  if (id === "drift") return stats?.neonDriftHighScore ? `${stats.neonDriftHighScore.toLocaleString()} PTS` : "READY";
  if (id === "crash") return stats?.crashHighScore ? `${stats.crashHighScore}x` : "100x";
  if (id === "mines") return stats?.minesHighScore ? `${stats.minesHighScore}x` : "EXP";
  if (id === "scratchers") return stats?.scratchersHighScore ? `${stats.scratchersHighScore.toLocaleString()} CP` : "100k";
  if (id === "dozer") return stats?.dozerHighScore ? `${stats.dozerHighScore.toLocaleString()} CP` : "READY";
  if (id === "hilo") return stats?.hiloHighScore ? `${stats.hiloHighScore.toLocaleString()} CP` : "180x";
  if (id === "pinball") return stats?.pinballHighScore ? `${stats.pinballHighScore.toLocaleString()} PTS` : "READY";
  if (id === "face-runner") return stats.faceRunnerHighScore || 0;
  if (id === "slots") return "JACKPOT";
  if (id === "wheel") return stats?.wheelHighScore ? `${stats.wheelHighScore.toLocaleString()} CP` : "FREE SPIN";
  if (id === "merch-jump") return stats.merchJumpHighScore || 0;
  if (id === "bro-cannon") return stats.broCannonHighScore || 0;
  if (id === "merch-defense") return stats.merchDefenseHighScore ? `WAVE ${stats.merchDefenseHighScore}` : "READY";
  return 0;
};
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
};
const ArcadeHub = () => {
  const { stats, shopState, userProfile, zoneControl } = useGamification() || {};
  const { stats: broStats, getMood } = usePocketBro() || {};
  const { playBoop } = useRetroSound();
  const equippedSkin = shopState?.equipped?.pocketbro || null;
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("leaderboard");
  const [selectedLeaderboard, setSelectedLeaderboard] = reactExports.useState("crazy_fishing");
  const [greeting, setGreeting] = reactExports.useState("Welcome");
  reactExports.useEffect(() => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  const [loot, setLoot] = reactExports.useState(null);
  const { setShopState } = useGamification() || {};
  const { showToast } = useToast();
  const handleCollectLoot = () => {
    if (!loot) return;
    playBoop();
    setShopState((prev) => ({ ...prev, unlocked: [...prev.unlocked, loot.id] }));
    showToast(`FOUND: ${loot.id === "bank_lofi" ? "Lo-Fi Tape" : "Cyber Deck"}!`, "win");
    setLoot(null);
  };
  const displayName = userProfile?.name || "OPERATOR";
  const filteredGames = reactExports.useMemo(() => {
    return games.filter((g) => {
      const matchesCategory = selectedCategory === "all" || g.category === selectedCategory;
      const matchesSearch = searchQuery === "" || g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    textAlign: "center",
    padding: "16px",
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
    paddingBottom: "120px",
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: loot && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0, y: -50 },
        animate: { opacity: 1, scale: 1, y: 0, rotate: [0, 10, -10, 0] },
        exit: { opacity: 0, scale: 0 },
        transition: { rotate: { repeat: Infinity, duration: 2 } },
        onClick: handleCollectLoot,
        style: {
          position: "absolute",
          top: `${loot.y}%`,
          left: `${loot.x}%`,
          zIndex: 100,
          cursor: "pointer",
          fontSize: "3rem",
          filter: "drop-shadow(0 0 10px gold)"
        },
        children: [
          loot.icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", background: "black", padding: "2px", borderRadius: "4px" }, children: "CLICK ME" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "24px", marginTop: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--neon-blue)", letterSpacing: "2px", fontWeight: "bold", fontSize: "0.75rem", marginBottom: "4px", fontFamily: "monospace" }, children: [
        greeting.toUpperCase(),
        ", ",
        displayName,
        " • SYSTEM ONLINE"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: {
        fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
        textShadow: "0 0 25px rgba(0, 229, 255, 0.5)",
        margin: "0",
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: "900",
        letterSpacing: "2px"
      }, children: [
        "CYBER ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-pink)", textShadow: "0 0 25px rgba(255, 0, 127, 0.6)" }, children: "ARCADE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "15px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              window.dispatchEvent(new CustomEvent("spawn-raid-boss"));
              try {
                playBoop();
              } catch (e) {
              }
            },
            style: {
              background: "linear-gradient(135deg, #ff0055, #ff5500)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "16px",
              padding: "6px 14px",
              fontWeight: "900",
              fontSize: "0.78rem",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(255, 0, 85, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚨" }),
              " RAID BOSS"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bunker", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(0, 229, 255, 0.15)",
          border: "1px solid #00e5ff",
          color: "#00ffff",
          borderRadius: "16px",
          padding: "6px 14px",
          fontWeight: "bold",
          fontSize: "0.78rem",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🍸" }),
          " THE BUNKER"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/underworld", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(255, 215, 0, 0.15)",
          border: "1px solid #ffd700",
          color: "#ffd700",
          borderRadius: "16px",
          padding: "6px 14px",
          fontWeight: "bold",
          fontSize: "0.78rem",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎲" }),
          " THE UNDERWORLD"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arena", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(255, 8, 68, 0.15)",
          border: "1px solid #ff0844",
          color: "#ff88aa",
          borderRadius: "16px",
          padding: "6px 14px",
          fontWeight: "bold",
          fontSize: "0.78rem",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚔️" }),
          " THE ARENA"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowSponsorModal(true),
            style: {
              background: "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 114, 255, 0.2))",
              border: "1px solid #00f0ff",
              color: "#00f0ff",
              borderRadius: "16px",
              padding: "6px 14px",
              fontWeight: "bold",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 0 14px rgba(0, 240, 255, 0.35)",
              fontFamily: "monospace"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡" }),
              " SPONSOR (+1,500 CP)"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(10, 15, 26, 0.85)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0, 229, 255, 0.25)",
      borderRadius: "24px",
      padding: "12px 16px",
      margin: "0 auto 28px auto",
      maxWidth: "920px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "🔍 Search games by name, genre, or keyword...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            style: {
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: "16px",
              padding: "12px 20px",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              outline: "none",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)"
            }
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearchQuery(""),
            style: {
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: "1rem"
            },
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }, children: CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedCategory(cat.id),
            style: {
              flex: "1 0 auto",
              background: isSelected ? "linear-gradient(135deg, #00e5ff, #0072ff)" : "rgba(255,255,255,0.05)",
              color: isSelected ? "#000" : "#ccc",
              border: isSelected ? "1px solid #00e5ff" : "1px solid rgba(255,255,255,0.1)",
              padding: "8px 16px",
              borderRadius: "14px",
              fontWeight: "900",
              fontSize: "0.8rem",
              fontFamily: "monospace",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: isSelected ? "0 0 16px rgba(0, 229, 255, 0.5)" : "none",
              transition: "all 0.2s ease"
            },
            children: cat.label
          },
          cat.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "dashboard-grid arcade-grid",
        variants: containerVariants,
        initial: "hidden",
        animate: "show",
        style: {
          padding: "0",
          maxWidth: "1200px",
          margin: "0 auto 40px auto",
          width: "100%",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          rowGap: "32px",
          columnGap: "20px"
        },
        children: filteredGames.length > 0 ? filteredGames.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            variants: itemVariants,
            style: {
              display: "flex",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: game.path || `/arcade/${game.id}`, style: { textDecoration: "none", WebkitTapHighlightColor: "transparent", width: "100%", maxWidth: "320px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ArcadeCabinet,
              {
                game,
                highScore: getHighScore(game.id, stats),
                zoneControl: zoneControl?.[game.id]
              }
            ) })
          },
          game.id
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { gridColumn: "1 / -1", padding: "60px 20px", color: "#888", fontStyle: "italic", fontFamily: "monospace" }, children: "No games matched your search query. Try another term or reset category!" })
      },
      selectedCategory + searchQuery
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(10, 15, 26, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "24px",
      padding: "20px",
      maxWidth: "920px",
      margin: "0 auto 40px auto",
      backdropFilter: "blur(16px)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", borderBottom: "1px solid #222", paddingBottom: "12px", marginBottom: "20px", justifyContent: "center", flexWrap: "wrap" }, children: [
        { id: "leaderboard", label: "🏆 LEADERBOARDS" },
        { id: "feed", label: "📡 LIVE FEED" },
        { id: "plaza", label: "🌐 ONLINE PLAZA" },
        { id: "pocketbro", label: "👾 POCKET BRO" }
      ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab(t.id),
          style: {
            background: activeTab === t.id ? "rgba(0, 229, 255, 0.2)" : "transparent",
            border: activeTab === t.id ? "1px solid #00e5ff" : "none",
            color: activeTab === t.id ? "#00e5ff" : "#888",
            padding: "8px 16px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "0.82rem",
            fontFamily: "monospace",
            cursor: "pointer",
            transition: "all 0.2s"
          },
          children: t.label
        },
        t.id
      )) }),
      activeTab === "leaderboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px", scrollbarWidth: "thin" }, children: games.filter((g) => g.leaderboardId).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSelectedLeaderboard(g.leaderboardId),
            style: {
              background: selectedLeaderboard === g.leaderboardId ? g.gradient : "rgba(255,255,255,0.05)",
              color: "white",
              border: selectedLeaderboard === g.leaderboardId ? "1px solid #fff" : "1px solid #333",
              padding: "6px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              transition: "all 0.2s"
            },
            children: g.title
          },
          g.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardTable, { gameId: selectedLeaderboard })
      ] }),
      activeTab === "feed" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: "800px", margin: "0 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFeed, {}) }),
      activeTab === "plaza" && /* @__PURE__ */ jsxRuntimeExports.jsx(OnlinePlaza, {}),
      activeTab === "pocketbro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "10px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", height: "90px", width: "90px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PocketPet,
          {
            stage: broStats?.stage || "EGG",
            type: broStats?.type || "SOOT",
            mood: getMood(),
            isSleeping: broStats?.isSleeping,
            skin: equippedSkin
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1.2rem", margin: "0 0 4px 0", color: "white" }, children: "POCKET BRO LINKED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "15px", justifyContent: "center", fontSize: "0.8rem", color: "#aaa", marginBottom: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "❤️ ",
            Math.floor(broStats?.happy || 0),
            "% HAPPY"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "⚡ ",
            Math.floor(broStats?.xp || 0),
            " XP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pocketbro", style: {
          background: "var(--neon-blue)",
          color: "black",
          padding: "8px 24px",
          borderRadius: "50px",
          fontWeight: "bold",
          textDecoration: "none",
          fontSize: "0.85rem",
          boxShadow: "0 0 15px var(--neon-blue)"
        }, children: "ENTER PET ROOM 🚪" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorStationModal, { isOpen: showSponsorModal, onClose: () => setShowSponsorModal(false) })
  ] });
};
export {
  ArcadeHub as default
};
