import { j as jsxRuntimeExports, a as useGamification, c as useToast, r as reactExports, s as supabase } from "./index-DYzI18Qv.js";
const ChatMessage = ({ msg }) => {
  if (msg.type === "system") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", fontSize: "0.6rem", color: "#666", margin: "5px 0" }, children: [
      "-- ",
      msg.text,
      " --"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    alignSelf: msg.isMe ? "flex-end" : "flex-start",
    flexDirection: msg.isMe ? "row-reverse" : "row",
    maxWidth: "90%"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "#333",
      overflow: "hidden",
      flexShrink: 0,
      border: `1px solid ${msg.squad === "CYBER" ? "#00ffcc" : msg.squad === "SOLAR" ? "#ffcc00" : msg.squad === "VOID" ? "#ff0055" : "#888"}`
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.avatar || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: msg.isMe ? "flex-end" : "flex-start" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#888", marginBottom: "2px" }, children: msg.user }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: msg.isMe ? "var(--neon-blue)" : "rgba(255,255,255,0.1)",
        color: msg.isMe ? "black" : "white",
        padding: "6px 10px",
        borderRadius: msg.isMe ? "12px 0 12px 12px" : "0 12px 12px 12px",
        fontSize: "0.8rem",
        lineHeight: "1.4"
      }, children: msg.text })
    ] })
  ] });
};
const MOCK_BOTS = [
  { name: "NullPtr", squad: "CYBER", avatar: "/assets/avatar_robot.png" },
  { name: "SunGazer", squad: "SOLAR", avatar: "/assets/avatar_alien.png" },
  { name: "GhostInShell", squad: "VOID", avatar: "/assets/avatar_ghost.png" },
  { name: "BitWise", squad: "CYBER", avatar: "/assets/merchboy_face.png" },
  { name: "GlitchKing", squad: "CYBER", avatar: "/assets/merchboy_face.png" }
];
const BOT_MESSAGES = [
  "Just hit a new high score in Snake! 🐍",
  "Buying Golden Koi 500c PM me",
  "Anyone up for Arena PvP? My squad needs XP.",
  "The new shop skins are fire 🔥",
  "Void squad is taking over the leaderboard...",
  "System update detected...",
  "GGs everyone",
  "Where is the secret level?",
  "Need one more friend for the quest!",
  "LFG Arena",
  "lol saw that",
  "Solar squad superior confirmed ☀️",
  "Cyber squad rise up 🤖"
];
const SocialSidebar = () => {
  const { userProfile, setViewedProfile, coins, updateStat } = useGamification();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("CHAT");
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const [loadingRadar, setLoadingRadar] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    { id: 1, user: "SYSTEM", text: "CONNECTION ESTABLISHED TO THE VOID.", type: "system", timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = reactExports.useState("");
  const chatEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, activeTab]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        return;
      }
      const bot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
      const msg = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
      addMessage({
        user: bot.name,
        squad: bot.squad,
        avatar: bot.avatar,
        text: msg,
        type: "chat"
      });
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  const addMessage = (msg) => {
    setMessages((prev) => {
      const next = [...prev, { ...msg, id: Date.now() + Math.random(), timestamp: Date.now() }];
      if (next.length > 50) next.shift();
      return next;
    });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addMessage({
      user: userProfile.name || "GUEST",
      squad: userProfile.squad,
      avatar: userProfile.avatar,
      text: inputText.trim(),
      type: "chat",
      isMe: true
    });
    setInputText("");
  };
  reactExports.useEffect(() => {
    if (!isOpen || activeTab !== "RADAR") return;
    const fetchOnlineUsers = async () => {
      setLoadingRadar(true);
      try {
        let realUsers = [];
        if (supabase) {
          const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1e3).toISOString();
          const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, squad, coins").gt("last_seen", fiveMinsAgo).neq("display_name", userProfile?.name).limit(20);
          if (data) realUsers = data;
        }
        if (realUsers.length < 5) {
          realUsers = [...realUsers, ...MOCK_BOTS.map((b, i) => ({
            id: `bot-${i}`,
            display_name: b.name,
            avatar_url: b.avatar,
            squad: b.squad,
            coins: Math.floor(Math.random() * 5e4),
            isBot: true
          }))];
        }
        setOnlineUsers(realUsers);
      } catch (e) {
        console.error(e);
      }
      setLoadingRadar(false);
    };
    fetchOnlineUsers();
  }, [isOpen, activeTab]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(true),
        style: {
          position: "fixed",
          top: "80px",
          right: "0",
          zIndex: 998,
          background: "rgba(0,0,0,0.8)",
          border: "1px solid var(--neon-blue)",
          borderRight: "none",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          padding: "10px 15px",
          color: "var(--neon-blue)",
          cursor: "pointer",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "-5px 0 15px rgba(0,0,0,0.5)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "10px", height: "10px", background: "#00ff00", borderRadius: "50%", boxShadow: "0 0 5px #00ff00" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", fontSize: "0.9rem" }, children: "THE VOID" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: "60px",
      right: isOpen ? "0" : "-350px",
      width: "320px",
      height: "calc(100vh - 60px - 70px)",
      background: "rgba(5, 5, 10, 0.95)",
      backdropFilter: "blur(20px)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 999,
      transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "flex",
      flexDirection: "column",
      boxShadow: isOpen ? "-10px 0 50px rgba(0,0,0,0.8)" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: "1px solid #333" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setActiveTab("CHAT"),
            style: { flex: 1, padding: "15px", background: activeTab === "CHAT" ? "rgba(255,255,255,0.05)" : "transparent", border: "none", color: activeTab === "CHAT" ? "#fff" : "#666", fontWeight: "bold", cursor: "pointer" },
            children: "💬 CHAT"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("RADAR"),
            style: { flex: 1, padding: "15px", background: activeTab === "RADAR" ? "rgba(255,255,255,0.05)" : "transparent", border: "none", color: activeTab === "RADAR" ? "#fff" : "#666", fontWeight: "bold", cursor: "pointer" },
            children: [
              "📡 RADAR (",
              onlineUsers.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsOpen(false), style: { padding: "0 15px", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "1.2rem" }, children: "✕" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }, children: [
        activeTab === "CHAT" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
          messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChatMessage, { msg }, msg.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
        ] }),
        activeTab === "RADAR" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }, children: onlineUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
          if (user.isBot && window.confirm(`Challenge ${user.display_name} to a duel?`)) {
            if (Math.random() > 0.5) {
              showToast(`VICTORY! You defeated ${user.display_name}!`, "win");
              if (updateStat) updateStat("rivalsDefeated", (prev) => (prev || 0) + 1);
            } else {
              showToast("DEFEAT! They were too fast.", "error");
            }
          } else {
            setViewedProfile({ name: user.display_name, avatar: user.avatar_url, squad: user.squad });
          }
        }, style: {
          display: "flex",
          gap: "10px",
          alignItems: "center",
          padding: "10px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "8px",
          cursor: "pointer"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar_url || "/assets/merchboy_face.png", style: { width: "32px", height: "32px", borderRadius: "50%" } }),
            user.isBot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: -2, right: -2, width: "8px", height: "8px", background: "red", borderRadius: "50%", border: "1px solid black" }, title: "Hostile" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: "0.9rem" }, children: user.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: "0.7rem" }, children: user.squad || "FREELANCER" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", fontSize: "1.2rem" }, children: "⚔️" })
        ] }, user.id)) })
      ] }),
      activeTab === "CHAT" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendMessage, style: { padding: "15px", borderTop: "1px solid #333", display: "flex", gap: "10px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: inputText,
            onChange: (e) => setInputText(e.target.value),
            placeholder: "Broadcast to void...",
            style: {
              flex: 1,
              background: "#111",
              border: "1px solid #333",
              borderRadius: "4px",
              padding: "10px",
              color: "white",
              fontFamily: "inherit"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", style: { background: "var(--neon-blue)", border: "none", borderRadius: "4px", color: "black", fontWeight: "bold", cursor: "pointer", padding: "0 15px" }, children: "SEND" })
      ] })
    ] })
  ] });
};
export {
  SocialSidebar as default
};
