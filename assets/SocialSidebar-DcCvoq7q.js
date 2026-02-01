import { b as useGamification, g as useToast, r as reactExports, j as jsxRuntimeExports, L as Link, s as supabase } from "./index-CK8jA7WB.js";
const SocialSidebar = () => {
  const { userProfile, setViewedProfile } = useGamification();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const fetchOnlineUsers = async () => {
      if (!supabase || !isOpen) return;
      setLoading(true);
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3).toISOString();
        const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url, last_seen, coins, achievements, stats, placedStickers").gt("last_seen", fiveMinutesAgo).neq("display_name", userProfile?.name).order("last_seen", { ascending: false }).limit(20);
        if (data) {
          setOnlineUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 3e4);
    return () => clearInterval(interval);
  }, [isOpen, userProfile]);
  const handleChallenge = (user) => {
    showToast(`Challenge sent to ${user.display_name}! ⚔️`, "success");
  };
  const handleProfileClick = (user) => {
    const profileData = {
      name: user.display_name,
      avatar: user.avatar_url,
      code: "UNKNOWN",
      // Friend code might not be public in this query
      stats: user.stats || {},
      achievements: user.achievements || [],
      placedStickers: user.placedStickers || []
    };
    setViewedProfile(profileData);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(true),
        style: {
          position: "fixed",
          top: "80px",
          // Below header
          right: "0",
          zIndex: 998,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid var(--neon-blue)",
          borderRight: "none",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          padding: "10px 15px",
          color: "var(--neon-blue)",
          cursor: "pointer",
          backdropFilter: "blur(5px)",
          boxShadow: "-5px 0 15px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "transform 0.2s"
        },
        onMouseEnter: (e) => e.currentTarget.style.transform = "translateX(-5px)",
        onMouseLeave: (e) => e.currentTarget.style.transform = "translateX(0)",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "10px",
            height: "10px",
            background: "#00ff00",
            borderRadius: "50%",
            boxShadow: "0 0 5px #00ff00"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", fontSize: "0.9rem" }, children: "SQUAD" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: "60px",
      // Header height
      right: isOpen ? "0" : "-300px",
      width: "280px",
      height: "calc(100vh - 60px - 70px)",
      // Minus header & dock
      background: "rgba(10, 10, 20, 0.85)",
      backdropFilter: "blur(15px)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 999,
      transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "flex",
      flexDirection: "column",
      boxShadow: isOpen ? "-10px 0 30px rgba(0,0,0,0.5)" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "15px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "🌍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1rem", color: "white", letterSpacing: "1px" }, children: "ONLINE PLAZA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setIsOpen(false),
            style: {
              background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "5px"
            },
            children: "✖"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }, children: [
        loading && onlineUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#666", padding: "20px" }, children: "Scanning frequency..." }),
        !loading && onlineUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", opacity: 0.5, marginTop: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "10px" }, children: "📡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No other operators online." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", marginTop: "5px" }, children: "It's quiet... too quiet." })
        ] }),
        onlineUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-panel",
            style: {
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s",
              cursor: "pointer"
              // Indicate clickable
            },
            onClick: () => handleProfileClick(user),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--neon-blue)"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar_url || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", objectFit: "cover" }, onError: (e) => e.target.src = "/assets/merchboy_face.png" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "8px",
                  height: "8px",
                  background: "#00ff00",
                  borderRadius: "50%",
                  border: "1px solid black"
                } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: "white", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: user.display_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#aaa" }, children: [
                  "💰 ",
                  user.coins?.toLocaleString() || 0
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleChallenge(user);
                  },
                  title: "Challenge",
                  style: {
                    background: "var(--neon-pink)",
                    border: "none",
                    borderRadius: "5px",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    color: "white"
                  },
                  children: "⚔️"
                }
              ) })
            ]
          },
          user.id
        )),
        onlineUsers.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", borderTop: "1px dashed #333", paddingTop: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#444", textAlign: "center", marginBottom: "10px" }, children: "OFFLINE SIMULATION" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-panel",
              style: { padding: "10px", display: "flex", alignItems: "center", gap: "10px", opacity: 0.8, cursor: "pointer" },
              onClick: () => handleProfileClick({ display_name: "Bot_Alpha", avatar_url: null }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "40px", borderRadius: "50%", background: "#333" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "#666" }, children: "Bot_Alpha" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#444" }, children: "AFK" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "15px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", style: {
        color: "var(--neon-blue)",
        textDecoration: "none",
        fontSize: "0.8rem",
        fontWeight: "bold",
        letterSpacing: "1px"
      }, children: "MY BRO CARD 🆔" }) })
    ] })
  ] });
};
export {
  SocialSidebar as default
};
