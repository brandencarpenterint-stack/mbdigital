import { b as useGamification, r as reactExports, s as supabase, j as jsxRuntimeExports, a as usePocketBro, u as useRetroSound, c as useToast, A as AnimatePresence, m as motion, L as Link, P as PocketPet } from "./index-I_jIDthF.js";
import { feedService } from "./feed-BTU08FQT.js";
import { L as LeaderboardTable } from "./LeaderboardTable-Clarxk-9.js";
/* empty css              */
import "./LeaderboardService-1OpB6Gbp.js";
const LiveFeed = () => {
  const { userProfile } = useGamification() || {};
  const [messages, setMessages] = reactExports.useState([
    { id: 1, user: "System", text: "Connecting to Global Feed...", time: "Now", color: "#ffaaaa" }
  ]);
  const [isCollapsed, setIsCollapsed] = reactExports.useState(false);
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
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchOnline = async () => {
      if (!supabase) return;
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1e3).toISOString();
      const { data } = await supabase.from("profiles").select("display_name, avatar_url, xp, last_seen").gt("last_seen", fifteenMinsAgo).order("last_seen", { ascending: false }).limit(20);
      if (data) {
        setOnlineUsers(data.map((u) => ({
          ...u,
          level: Math.floor(Math.sqrt((u.xp || 0) / 250)) || 1
        })));
      }
      setLoading(false);
    };
    fetchOnline();
    const interval = setInterval(fetchOnline, 3e4);
    return () => clearInterval(interval);
  }, []);
  if (loading) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "800px", margin: "0 auto 40px auto", textAlign: "left" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "var(--neon-green)", fontFamily: '"Orbitron", sans-serif', fontSize: "0.9rem", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-green)", boxShadow: "0 0 10px var(--neon-green)" } }),
      "ONLINE PLAZA (",
      onlineUsers.length,
      ")"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "15px",
      overflowX: "auto",
      paddingBottom: "15px",
      scrollbarWidth: "thin",
      scrollbarColor: "#333 transparent"
    }, children: [
      onlineUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontStyle: "italic", fontSize: "0.8rem" }, children: "No other signals detected..." }),
      onlineUsers.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -5 },
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: idx * 0.05 },
          style: {
            minWidth: "100px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--neon-blue)",
              marginBottom: "5px"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar_url || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", fontWeight: "bold", color: "white", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: user.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              marginTop: "5px",
              background: "#333",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.6rem",
              color: "gold",
              fontWeight: "bold"
            }, children: [
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
const games = [
  {
    id: "wheel",
    title: "WHEEL OF DEGEN",
    desc: "Spin. Win. Lose it all.",
    gradient: "linear-gradient(135deg, #ff0055 0%, #aa00ff 100%)",
    icon: "🎡",
    colSpan: 2,
    leaderboardId: "dopamine_wheel"
  },
  {
    id: "slots",
    title: "COSMIC SLOTS",
    desc: "Spin to WIN BIG!",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
    // Gold
    icon: "🎰",
    colSpan: 2,
    leaderboardId: "cosmic_slots"
  },
  {
    id: "face-runner",
    title: "FACE WARP",
    desc: "3D Tunnel Chaos",
    gradient: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)",
    icon: "🌀",
    colSpan: 2,
    leaderboardId: "face_runner"
  },
  {
    id: "merch-jump",
    title: "MERCH JUMP",
    desc: "Sky High.",
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    icon: "👟",
    colSpan: 1,
    leaderboardId: "merch_jump"
  },
  {
    id: "fishing",
    title: "CRAZY FISHING",
    desc: "Catch the Mer-Logo!",
    gradient: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
    icon: "🎣",
    colSpan: 1,
    leaderboardId: "crazy_fishing"
  },
  {
    id: "whack",
    title: "WHACK-A-MOLE",
    desc: "Bonk the moles!",
    gradient: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
    icon: "🔨",
    colSpan: 1,
    leaderboardId: "whack_a_mole"
  },
  {
    id: "snake",
    title: "NEON SNAKE",
    desc: "Classic vibes.",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    icon: "🐍",
    colSpan: 1,
    leaderboardId: "neon_snake"
  },
  {
    id: "galaxy",
    title: "GALAXY DEFENDER",
    desc: "Pew pew pew!",
    gradient: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
    icon: "🚀",
    colSpan: 1,
    leaderboardId: "galaxy_defender"
  },
  {
    id: "brick",
    title: "NEON BRICKS",
    desc: "Smash pixels.",
    gradient: "linear-gradient(135deg, #da22ff 0%, #9733ee 100%)",
    icon: "🧱",
    colSpan: 1,
    leaderboardId: "neon_bricks"
  },
  {
    id: "memory",
    title: "MEMORY MATCH",
    desc: "Train your brain.",
    gradient: "linear-gradient(135deg, #f79d00 0%, #64f38c 100%)",
    icon: "🧠",
    colSpan: 1,
    leaderboardId: "memory_match"
  },
  {
    id: "sub-hunter",
    title: "VOID HUNTER",
    desc: "Destroy the Subs!",
    gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    icon: "⚓",
    colSpan: 1,
    leaderboardId: "sub_hunter"
  },
  {
    id: "flappy",
    title: "FLAPPY MASCOT",
    desc: "Don't crash.",
    gradient: "linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)",
    icon: "🦅",
    colSpan: 1,
    leaderboardId: "flappy_mascot"
  },
  {
    id: "bro-cannon",
    title: "BRO CANNON",
    desc: "Launch for the stars!",
    gradient: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
    // Red/Pink
    icon: "💣",
    colSpan: 1,
    leaderboardId: "bro_cannon"
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
  if (id === "face-runner") return stats.faceRunnerHighScore || 0;
  if (id === "slots") return "JACKPOT";
  if (id === "wheel") return "DEGEN";
  if (id === "merch-jump") return stats.merchJumpHighScore || 0;
  if (id === "bro-cannon") return stats.broCannonHighScore || 0;
  return 0;
};
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};
const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
};
const ArcadeHub = () => {
  const { stats, shopState, userProfile, zoneControl } = useGamification() || {};
  const { stats: broStats, getMood } = usePocketBro() || {};
  const { playBoop } = useRetroSound();
  const equippedSkin = shopState?.equipped?.pocketbro || null;
  const [selectedLeaderboard, setSelectedLeaderboard] = reactExports.useState("crazy_fishing");
  const [greeting, setGreeting] = reactExports.useState("Welcome");
  reactExports.useEffect(() => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    const checkForLoot = () => {
      const chance = Math.random();
      if (chance > 0.7) {
        if (!shopState?.unlocked?.includes("bank_lofi")) {
          setLoot({ id: "bank_lofi", icon: "📼", x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        } else if (!shopState?.unlocked?.includes("bank_cyber") && Math.random() > 0.5) {
          setLoot({ id: "bank_cyber", icon: "💾", x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        }
      }
    };
    checkForLoot();
  }, [shopState?.unlocked]);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    textAlign: "center",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    paddingBottom: "120px",
    position: "relative"
    // relative for loot absolute pos
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "40px", marginTop: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--neon-blue)", letterSpacing: "2px", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "5px" }, children: [
        greeting.toUpperCase(),
        ", ",
        displayName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: {
        fontSize: "clamp(2.5rem, 8vw, 4rem)",
        textShadow: "0 0 20px var(--neon-pink)",
        margin: "0",
        fontFamily: '"Orbitron", sans-serif',
        animation: "textGlowPulse 3s infinite ease-in-out"
      }, children: [
        "ARCADE ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-pink)" }, children: "ZONE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "clamp(1rem, 4vw, 1.2rem)", color: "#aaa", marginTop: "10px" }, children: "Ready to play? Select a game console below." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: "800px", margin: "0 auto 40px auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFeed, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnlinePlaza, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "40px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", style: {
      background: "linear-gradient(90deg, #FFD700, #FFA500)",
      color: "black",
      padding: "15px 40px",
      borderRadius: "50px",
      textDecoration: "none",
      fontWeight: "900",
      fontSize: "1.2rem",
      boxShadow: "0 0 25px rgba(255, 215, 0, 0.4)",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      border: "2px solid white"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛒" }),
      " VISIT GLOBAL SHOP"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        whileHover: { scale: 1.02 },
        className: "glass-panel",
        style: {
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "20px",
          marginBottom: "50px",
          maxWidth: "800px",
          margin: "0 auto 50px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          border: "1px solid #555",
          position: "relative",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", height: "100px", width: "100px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PocketPet,
            {
              stage: broStats?.stage || "EGG",
              type: broStats?.type || "SOOT",
              mood: getMood(),
              isSleeping: broStats?.isSleeping,
              skin: equippedSkin
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", margin: "0 0 5px 0", color: "white", zIndex: 2 }, children: "POCKET BRO LINKED" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", justifyContent: "center", fontSize: "0.8rem", color: "#aaa", marginBottom: "15px", zIndex: 2 }, children: [
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
            padding: "10px 30px",
            borderRadius: "50px",
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: "0.9rem",
            boxShadow: "0 0 15px var(--neon-blue)",
            zIndex: 2
          }, children: "ENTER ROOM 🚪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at center, transparent 0%, #000 100%)",
            zIndex: 1,
            opacity: 0.8
          } })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "dashboard-grid",
        variants: containerVariants,
        initial: "hidden",
        animate: "show",
        style: {
          padding: "10px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          // Wider for cabinets
          rowGap: "40px"
          // More vertical space
        },
        children: games.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            variants: itemVariants,
            style: {
              gridColumn: "span 1",
              // Force single column for cabinets to look uniform
              display: "flex",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/arcade/${game.id}`, style: { textDecoration: "none", WebkitTapHighlightColor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ArcadeCabinet,
              {
                game,
                highScore: getHighScore(game.id, stats),
                zoneControl: zoneControl?.[game.id]
              }
            ) })
          },
          game.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "80px",
      padding: "30px",
      background: "rgba(15, 15, 27, 0.8)",
      border: "1px solid #333",
      maxWidth: "900px",
      margin: "80px auto 20px auto",
      borderRadius: "30px",
      backdropFilter: "blur(10px)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "gold", marginBottom: "30px", fontFamily: '"Orbitron", sans-serif', letterSpacing: "2px" }, children: "🌍 GLOBAL RANKINGS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "15px", marginBottom: "20px", scrollbarWidth: "none" }, children: games.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedLeaderboard(g.leaderboardId),
          style: {
            background: selectedLeaderboard === g.leaderboardId ? g.gradient : "rgba(255,255,255,0.05)",
            color: "white",
            border: selectedLeaderboard === g.leaderboardId ? `none` : "1px solid #333",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            transition: "all 0.3s",
            boxShadow: selectedLeaderboard === g.leaderboardId ? "0 0 15px rgba(255,255,255,0.2)" : "none"
          },
          children: g.title
        },
        g.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardTable, { gameId: selectedLeaderboard }) })
    ] })
  ] });
};
export {
  ArcadeHub as default
};
