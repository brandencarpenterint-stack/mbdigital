import { r as reactExports, b as useGamification, j as jsxRuntimeExports, a as usePocketBro, c as useRetroSound, L as Link, m as motion, P as PocketPet } from "./index-BwLfVL7x.js";
import { L as LiveFeed } from "./LiveFeed-CU6SCGg1.js";
import { LeaderboardService } from "./LeaderboardService-gOGaNNxJ.js";
import "./feed-e9_3cEgk.js";
const LeaderboardTable = ({ gameId }) => {
  const [scores, setScores] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const { setViewedProfile } = useGamification();
  reactExports.useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const data = await LeaderboardService.getTopScores(gameId);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, [gameId]);
  const handleRowClick = (entry) => {
    const partialProfile = {
      name: entry.player,
      // Generate a consistent avatar if we don't have one, or use a default
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`,
      code: "UNKNOWN",
      squad: null,
      stats: {
        gameHighScore: entry.score
        // Just show what we know
      },
      isMock: true
      // Flag to tell ProfileModal this is a partial view
    };
    setViewedProfile(partialProfile);
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666" }, children: "Loading Global Ranks..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: "400px", background: "rgba(0,0,0,0.5)", borderRadius: "10px", padding: "10px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { textAlign: "center", color: "gold", margin: "0 0 10px 0" }, children: "🏆 GLOBAL TOP 10" }),
    scores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#999" }, children: "No scores yet. Be the first!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { width: "100%", borderCollapse: "collapse", color: "white" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: scores.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        onClick: () => handleRowClick(entry),
        style: {
          borderBottom: "1px solid #333",
          cursor: "pointer",
          transition: "background 0.2s"
        },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "8px", color: idx < 3 ? "gold" : "white", fontWeight: idx < 3 ? "bold" : "normal" }, children: [
            "#",
            idx + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "24px", height: "24px", borderRadius: "50%", background: "#333", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`,
                alt: "av",
                style: { width: "100%", height: "100%", objectFit: "cover" }
              }
            ) }),
            entry.player
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px", textAlign: "right", fontFamily: "monospace" }, children: entry.score.toLocaleString() })
        ]
      },
      idx
    )) }) })
  ] });
};
const games = [
  {
    id: "slots",
    title: "COSMIC SLOTS",
    desc: "Spin to WIN BIG!",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
    // Gold
    icon: "🎰",
    colSpan: 2,
    // Highlight it!
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
  const { stats, shopState, userProfile } = useGamification() || {};
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
  }, []);
  const displayName = userProfile?.name || "OPERATOR";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    textAlign: "center",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    paddingBottom: "120px"
  }, children: [
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
        fontFamily: '"Orbitron", sans-serif'
      }, children: [
        "ARCADE ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-pink)" }, children: "ZONE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "clamp(1rem, 4vw, 1.2rem)", color: "#aaa", marginTop: "10px" }, children: "Ready to play? Select a game console below." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: "800px", margin: "0 auto 40px auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFeed, {}) }),
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
          width: "100%"
        },
        children: games.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            variants: itemVariants,
            style: { gridColumn: game.colSpan === 2 ? "span 2" : "span 1" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: `/arcade/${game.id}`,
                className: "bento-card game-card-hover",
                onMouseEnter: () => playBoop(),
                style: {
                  background: game.gradient,
                  padding: "25px",
                  textDecoration: "none",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px",
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  position: "relative",
                  overflow: "hidden"
                },
                children: [
                  game.id === "slots" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    top: 15,
                    right: 15,
                    background: "white",
                    color: "black",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: "900",
                    zIndex: 5,
                    boxShadow: "0 0 10px rgba(255,255,255,0.5)"
                  }, children: "HOT 🔥" }),
                  game.id === "fishing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    top: 15,
                    right: 15,
                    background: "rgba(0,0,0,0.6)",
                    color: "#00C6FF",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: "900",
                    zIndex: 5,
                    border: "1px solid #00C6FF"
                  }, children: "DAILY 🎣" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "left" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
                      margin: 0,
                      fontSize: "1.8rem",
                      fontWeight: "900",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      lineHeight: 1,
                      fontFamily: '"Orbitron", sans-serif',
                      letterSpacing: "1px"
                    }, children: game.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "8px 0 0 0", opacity: 0.9, fontSize: "1rem", fontWeight: "500" }, children: game.desc }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.7rem", opacity: 0.8 }, children: (() => {
                      const factions = ["CYBER", "SOLAR", "VOID"];
                      const owner = factions[game.id.charCodeAt(0) % 3];
                      const color = owner === "CYBER" ? "#00f260" : owner === "SOLAR" ? "#FFD700" : "#b026ff";
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { border: `1px solid ${color}`, color, padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.5)" }, children: [
                        owner,
                        " ZONE"
                      ] });
                    })() })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                    fontSize: "9rem",
                    opacity: 0.2,
                    transform: "rotate(-15deg)",
                    pointerEvents: "none"
                  }, children: game.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "25px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      background: "rgba(0, 0, 0, 0.4)",
                      padding: "5px 12px",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backdropFilter: "blur(5px)"
                    }, children: [
                      "🏆 ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-gold)" }, children: getHighScore(game.id, stats) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        style: {
                          background: "white",
                          color: "black",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          boxShadow: "0 0 15px rgba(255,255,255,0.4)"
                        },
                        children: "▶"
                      }
                    )
                  ] })
                ]
              }
            )
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
