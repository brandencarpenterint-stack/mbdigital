import { r as reactExports, u as useRetroSound, s as supabase, j as jsxRuntimeExports, a as useGamification, A as AnimatePresence, m as motion, L as Link, R as React, S as SponsorStationModal } from "./index-BNUj3mBX.js";
import { C as CinematicGameCard, E as EmblemCrash, a as EmblemSlots, b as EmblemDozer, c as EmblemBlackjack } from "./GameEmblems-7G8Z_639.js";
import { T as TiltCard } from "./TiltCard-j6al4yCi.js";
import { u as useRealBtc } from "./useRealBtc-DrgKnRag.js";
import "./use-transform-DCNk9NWc.js";
import "./use-spring-NuKVR6gW.js";
const TheButton = () => {
  const [globalClicks, setGlobalClicks] = reactExports.useState(0);
  const [myClicks, setMyClicks] = reactExports.useState(0);
  const [isPressed, setIsPressed] = reactExports.useState(false);
  const { playClick } = useRetroSound();
  const clickBuffer = reactExports.useRef(0);
  reactExports.useRef(Date.now());
  reactExports.useEffect(() => {
    const fetchClicks = async () => {
      try {
        const { data, error } = await supabase.from("global_stats").select("value").eq("key", "the_button_clicks").single();
        if (data) {
          setGlobalClicks(parseInt(data.value, 10));
        } else if (error && error.code === "PGRST116") {
          await supabase.from("global_stats").insert({ key: "the_button_clicks", value: "0" });
        }
      } catch (err) {
        console.error("Failed to fetch button clicks", err);
      }
    };
    fetchClicks();
    const channel = supabase.channel("the_button").on("postgres_changes", { event: "UPDATE", schema: "public", table: "global_stats", filter: "key=eq.the_button_clicks" }, (payload) => {
      setGlobalClicks(parseInt(payload.new.value, 10));
    }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  reactExports.useEffect(() => {
    const syncInterval = setInterval(async () => {
      if (clickBuffer.current > 0) {
        const clicksToSync = clickBuffer.current;
        clickBuffer.current = 0;
        try {
          const { data, error } = await supabase.rpc("increment_button_clicks", { amount: clicksToSync });
          if (error) {
            const { data: currentData } = await supabase.from("global_stats").select("value").eq("key", "the_button_clicks").single();
            if (currentData) {
              const newTotal = parseInt(currentData.value, 10) + clicksToSync;
              await supabase.from("global_stats").update({ value: newTotal.toString() }).eq("key", "the_button_clicks");
            }
          }
        } catch (err) {
          console.error("Sync failed", err);
          clickBuffer.current += clicksToSync;
        }
      }
    }, 2e3);
    return () => clearInterval(syncInterval);
  }, []);
  const handlePress = () => {
    setIsPressed(true);
    playClick();
    if (navigator.vibrate) navigator.vibrate(20);
    setMyClicks((prev) => prev + 1);
    setGlobalClicks((prev) => prev + 1);
    clickBuffer.current += 1;
  };
  const handleRelease = () => {
    setIsPressed(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
    background: "linear-gradient(135deg, #1a0000, #330000)",
    border: "2px solid #ff0000",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "10px",
      background: "repeating-linear-gradient(45deg, #ffe600, #ffe600 10px, #000 10px, #000 20px)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "10px",
      background: "repeating-linear-gradient(45deg, #ffe600, #ffe600 10px, #000 10px, #000 20px)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(30px)", width: "100%", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#ff6666", fontWeight: "bold", letterSpacing: "2px", marginBottom: "15px" }, children: "DO NOT PRESS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onMouseDown: handlePress,
          onMouseUp: handleRelease,
          onMouseLeave: handleRelease,
          onTouchStart: (e) => {
            e.preventDefault();
            handlePress();
          },
          onTouchEnd: handleRelease,
          style: {
            position: "relative",
            width: "120px",
            height: "120px",
            margin: "0 auto",
            borderRadius: "50%",
            background: isPressed ? "#aa0000" : "#ff0000",
            boxShadow: isPressed ? "inset 0 10px 20px rgba(0,0,0,0.8), 0 0 10px #ff0000" : "inset 0 10px 20px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.5), 0 10px 30px rgba(255,0,0,0.6)",
            border: "4px solid #cc0000",
            cursor: "pointer",
            transform: isPressed ? "scale(0.95) translateY(5px)" : "scale(1)",
            transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), background 0.1s, box-shadow 0.1s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
            position: "absolute",
            top: "5%",
            pointerEvents: "none",
            opacity: isPressed ? 0.3 : 1
          } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"Courier New", monospace', fontSize: "1.5rem", fontWeight: "bold", color: "#ff3333", textShadow: "0 0 10px #ff0000" }, children: globalClicks.toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.6rem", color: "#888", marginTop: "5px" }, children: [
          "GLOBAL CLICKS (",
          myClicks,
          " YOURS)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes pulseDanger {
                    0% { box-shadow: inset 0 0 0 rgba(255,0,0,0); }
                    50% { box-shadow: inset 0 0 20px rgba(255,0,0,0.3); }
                    100% { box-shadow: inset 0 0 0 rgba(255,0,0,0); }
                }
            ` })
  ] });
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};
const HERO_SHOWCASE = [
  {
    id: "crash",
    tag: "FLAGSHIP MULTIPLAYER",
    title: "CYBER CRASH 2088",
    desc: "Watch the exponential starship surge up to 100x multipliers. Calculate your launch timing and bail out before catastrophic network collapse.",
    path: "/arcade/crash",
    badge: "DEFCON 1 ACTIVE",
    badgeColor: "#ff0055",
    gradient: "linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(255, 85, 0, 0.15))",
    border: "#ff0055",
    accentColor: "#ff0055"
  },
  {
    id: "slots",
    tag: "PROGRESSIVE JACKPOT",
    title: "COSMIC SLOTS 777",
    desc: "Classified 3-reel quantum slot matrix. Align pure vector 777s, gold bullion, and diamond prisms to trigger the multi-million CP syndicate pool.",
    path: "/arcade/slots",
    badge: "1.48M CP POOL",
    badgeColor: "#ffd700",
    gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 136, 0, 0.15))",
    border: "#ffd700",
    accentColor: "#ffd700"
  },
  {
    id: "blackjack",
    tag: "HIGH ROLLER SUITE",
    title: "CYBER 21 VIP",
    desc: "High-roller penthouse holographic croupier blackjack. Royal face visors, authentic 3:2 payouts, split hands, and double-down tactical wagers.",
    path: "/arcade/blackjack",
    badge: "VIP PENTHOUSE",
    badgeColor: "#00f0ff",
    gradient: "linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 114, 255, 0.15))",
    border: "#00f0ff",
    accentColor: "#00f0ff"
  },
  {
    id: "dozer",
    tag: "PHYSICS ARCADE",
    title: "COIN DOZER 3D",
    desc: "Precision physics pusher with giant solid bullion drops, prism gems, seismic table quakes, and tactical jackpot coin cascades.",
    path: "/arcade/dozer",
    badge: "PHYSICS SIM",
    badgeColor: "#00ff88",
    gradient: "linear-gradient(135deg, rgba(0, 255, 136, 0.25), rgba(0, 180, 216, 0.15))",
    border: "#00ff88",
    accentColor: "#00ff88"
  }
];
const PREMIER_GAMES = [
  {
    id: "crash",
    title: "CYBER CRASH 2088",
    desc: "Exponential starship trajectory with manual bail-out controls.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EmblemCrash, {}),
    category: "casino",
    gradient: "linear-gradient(135deg, #ff0055 0%, #ff5500 100%)",
    path: "/arcade/crash"
  },
  {
    id: "slots",
    title: "COSMIC SLOTS 777",
    desc: "3-reel progressive jackpot with vector neon 777s and gold bars.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EmblemSlots, {}),
    category: "casino",
    gradient: "linear-gradient(135deg, #ffd700 0%, #ff8800 100%)",
    path: "/arcade/slots"
  },
  {
    id: "dozer",
    title: "COIN DOZER 3D",
    desc: "Real-time coin physics with seismic quakes and gold bullion.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EmblemDozer, {}),
    category: "action",
    gradient: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
    path: "/arcade/dozer"
  },
  {
    id: "blackjack",
    title: "CYBER 21 VIP",
    desc: "Penthouse royal blackjack with animated cyber croupier hologram.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EmblemBlackjack, {}),
    category: "casino",
    gradient: "linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)",
    path: "/arcade/blackjack"
  }
];
const Home = () => {
  const { getLevelInfo, userProfile, coins = 0, stats } = useGamification() || {};
  const { playBeep, playBoop } = useRetroSound();
  const { btcPrice = 0, priceChange24h = 0, chartData = [] } = useRealBtc();
  const { level = 1, progress = 0 } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const rank = level >= 20 ? "BLACK-OPS" : level >= 10 ? "TOP-SECRET" : level >= 5 ? "SECRET" : "CONFIDENTIAL";
  const [heroIndex, setHeroIndex] = reactExports.useState(0);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SHOWCASE.length);
    }, 6e3);
    return () => clearInterval(timer);
  }, [isHovered]);
  const activeHero = HERO_SHOWCASE[heroIndex];
  const isBtcUp = priceChange24h >= 0;
  const btcColor = isBtcUp ? "#00ffcc" : "#ff0055";
  const MiniSparkline = ({ data, color }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 40;
    const points = data.map((val, i) => {
      const x = i / (data.length - 1) * width;
      const y = height - (val - min) / range * height;
      return `${x},${y}`;
    }).join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${width} ${height}`, style: { width: "100%", height: "40px", overflow: "visible" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "homeBtcGrad", x1: "0", x2: "0", y1: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0.0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: `0,${height} ${points} ${width},${height}`, fill: "url(#homeBtcGrad)", stroke: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: color, strokeWidth: "2", points, vectorEffect: "non-scaling-stroke" })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1080px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        style: {
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(12, 18, 30, 0.95), rgba(4, 7, 14, 0.98))",
          border: `1.5px solid ${activeHero.border}`,
          padding: "36px 32px",
          marginBottom: "24px",
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${activeHero.accentColor}25`,
          transition: "border 0.5s ease, box-shadow 0.5s ease"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            pointerEvents: "none"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 2, maxWidth: "640px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: `${activeHero.accentColor}20`,
                border: `1px solid ${activeHero.accentColor}`,
                color: activeHero.accentColor,
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "0.68rem",
                fontWeight: "900",
                fontFamily: "monospace"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: activeHero.accentColor, boxShadow: `0 0 8px ${activeHero.accentColor}` } }),
                activeHero.tag
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: activeHero.badgeColor,
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "0.68rem",
                fontWeight: "900",
                fontFamily: "monospace"
              }, children: activeHero.badge })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -12 },
                transition: { duration: 0.3 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
                    margin: "0 0 10px 0",
                    fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)",
                    fontWeight: "900",
                    color: "#fff",
                    letterSpacing: "1.5px",
                    fontFamily: '"Orbitron", sans-serif',
                    textShadow: `0 0 25px ${activeHero.accentColor}55`
                  }, children: activeHero.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                    margin: "0 0 24px 0",
                    fontSize: "0.95rem",
                    color: "#94a3b8",
                    lineHeight: "1.6",
                    fontFamily: "system-ui, -apple-system, sans-serif"
                  }, children: activeHero.desc })
                ]
              },
              activeHero.id
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: activeHero.path,
                  onClick: () => playBeep?.(),
                  style: {
                    background: `linear-gradient(135deg, ${activeHero.accentColor}, #0072ff)`,
                    color: "#000",
                    padding: "12px 28px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontWeight: "900",
                    fontSize: "0.88rem",
                    letterSpacing: "0.5px",
                    boxShadow: `0 0 20px ${activeHero.accentColor}60`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: '"Orbitron", monospace'
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "5 3 19 12 5 21 5 3" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PLAY NOW" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/arcade",
                  onClick: () => playBoop?.(),
                  style: {
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "0.88rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "monospace"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "6", width: "20", height: "12", rx: "4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "12", x2: "10", y2: "12" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "10", x2: "8", y2: "14" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "13", x2: "15.01", y2: "13" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "11", x2: "18.01", y2: "11" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ALL 27 GAMES" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            bottom: "24px",
            right: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 3
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px" }, children: HERO_SHOWCASE.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setHeroIndex(i);
                  playBoop?.();
                },
                style: {
                  width: i === heroIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === heroIndex ? activeHero.accentColor : "#475569",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: i === heroIndex ? `0 0 10px ${activeHero.accentColor}` : "none"
                },
                title: h.title
              },
              h.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "6px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setHeroIndex((heroIndex - 1 + HERO_SHOWCASE.length) % HERO_SHOWCASE.length);
                    playBoop?.();
                  },
                  style: {
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  },
                  title: "Previous Showcase",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setHeroIndex((heroIndex + 1) % HERO_SHOWCASE.length);
                    playBoop?.();
                  },
                  style: {
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  },
                  title: "Next Showcase",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 18 15 12 9 6" }) })
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "#0a0d16",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "14px",
      marginBottom: "28px",
      padding: "10px 0",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "flex",
      fontFamily: "monospace",
      fontSize: "0.82rem"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { x: [0, -1200] },
        transition: { repeat: Infinity, ease: "linear", duration: 25 },
        style: { display: "flex", gap: "40px", color: "#94a3b8", alignItems: "center" },
        children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#f7931a", display: "inline-block", boxShadow: "0 0 6px #f7931a" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "BTC/USD ORACLE:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff", fontWeight: "bold" }, children: [
              "$",
              (btcPrice || 0).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: btcColor, fontWeight: "bold" }, children: [
              "(",
              isBtcUp ? "+" : "",
              (priceChange24h || 0).toFixed(2),
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700", fontWeight: "bold" }, children: "DEFCON 1 JACKPOT: +1,482,900 CP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00f0ff", fontWeight: "bold" }, children: "27 ARCADE TITLES LIVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00ff88", fontWeight: "bold" }, children: "1,480+ OPERATORS ONLINE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff007f", fontWeight: "bold" }, children: "THE BUNKER MULTIPLAYER OPEN" })
        ] }, i))
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "35px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", padding: "0 4px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#00f0ff", boxShadow: "0 0 8px #00f0ff" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: "0.9rem", fontWeight: "900", letterSpacing: "1.5px", fontFamily: '"Orbitron", monospace' }, children: "PREMIER SPOTLIGHT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#00f0ff", fontSize: "0.8rem", fontWeight: "bold", textDecoration: "none", fontFamily: "monospace" }, children: "VIEW ALL 27 TITLES →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px"
      }, children: PREMIER_GAMES.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: game.path,
          style: { textDecoration: "none", display: "flex", width: "100%", WebkitTapHighlightColor: "transparent" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CinematicGameCard,
            {
              game,
              highScore: stats?.[`${game.id}HighScore`] || 0
            }
          )
        },
        game.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "dashboard-grid", variants: container, initial: "hidden", animate: "show", style: { gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #0e1525, #070a12)", border: "1px solid rgba(0, 240, 255, 0.25)", padding: "24px", display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "68px", height: "68px", transform: "translateZ(10px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: -5, width: "78px", height: "78px", transform: "rotate(-90deg)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#1e293b", strokeWidth: "5", fill: "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#00f0ff", strokeWidth: "5", fill: "none", strokeDasharray: "283", strokeDashoffset: 283 - 283 * progress / 100, style: { transition: "stroke-dashoffset 1s" } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/skins/face_default.png", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #000" }, alt: "Avatar" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(20px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#64748b", fontSize: "0.65rem", letterSpacing: "2px", fontWeight: "bold" }, children: "OPERATOR DOSSIER" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.35rem", fontWeight: "bold", textTransform: "uppercase", color: "#fff" }, children: userProfile?.name || "AGENT-770" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#00f0ff", fontSize: "0.8rem", fontWeight: "900", fontFamily: "monospace" }, children: [
              rank,
              " • LVL ",
              level
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto", paddingTop: "16px", transform: "translateZ(10px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "12px 16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.06)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "#94a3b8", letterSpacing: "1px" }, children: "ACTIVE VAULT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.2rem", color: "#ffd700", fontWeight: "900", display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "monospace" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v12M8 10h8" })
              ] }),
              (coins || 0).toLocaleString(),
              " CP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => window.dispatchEvent(new CustomEvent("open-clearance")),
              style: {
                background: "linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 114, 255, 0.15))",
                border: "1px solid #00f0ff",
                color: "#00f0ff",
                borderRadius: "12px",
                padding: "8px 14px",
                fontSize: "0.75rem",
                fontWeight: "900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.25)",
                fontFamily: '"Orbitron", monospace'
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PENTAGON CLEARANCE DOSSIER" })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: item, style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bunker", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, rgba(255, 0, 85, 0.2), rgba(255, 0, 255, 0.2))", border: "1px solid #ff0055", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", borderRadius: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#ff0055", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { marginBottom: "6px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "12" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "0.9rem", fontWeight: "900" }, children: "THE BUNKER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.62rem", color: "#ff88aa", marginTop: "2px" }, children: "MULTIPLAYER LOBBY" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pocketbro", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(16, 24, 40, 0.9))", border: "1px solid #00f0ff", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", borderRadius: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#00f0ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { marginBottom: "6px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "10", r: "1", fill: "#00f0ff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15", cy: "10", r: "1", fill: "#00f0ff" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "0.9rem", fontWeight: "900" }, children: "POCKET BRO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.62rem", color: "#67e8f9", marginTop: "2px" }, children: "CYBER COMPANION" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(16, 24, 40, 0.9))", border: "1px solid #ffd700", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", borderRadius: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { marginBottom: "6px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 22h16" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 14.66V17c0 .55-.45 1-1 1H7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 14.66V17c0 .55.45 1 1 1h2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2z" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "0.9rem", fontWeight: "900" }, children: "RANKINGS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.62rem", color: "#fde047", marginTop: "2px" }, children: "LEADERBOARD" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vault", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(16, 24, 40, 0.9))", border: "1px solid #00ff88", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", borderRadius: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#00ff88", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { marginBottom: "6px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "0.9rem", fontWeight: "900" }, children: "THE VAULT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.62rem", color: "#86efac", marginTop: "2px" }, children: "SECURE INVENTORY" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #121928, #070b14)", border: "1px solid #2d2d42", padding: "24px", display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #28283a", paddingBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#00ffcc", display: "inline-block", boxShadow: "0 0 8px #00ffcc" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f7931a", fontSize: "0.85rem", fontWeight: "bold", letterSpacing: "1px" }, children: "BITCOIN ORACLE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/exchange", style: { background: "#f7931a", color: "#000", padding: "4px 10px", borderRadius: "6px", textDecoration: "none", fontSize: "0.68rem", fontWeight: "900" }, children: "EXCHANGE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.65rem", letterSpacing: "1px" }, children: "BTC / USD SPOT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.75rem", fontWeight: "900", color: "#fff", letterSpacing: "1px", marginTop: "2px", fontFamily: "monospace" }, children: [
            "$",
            (btcPrice || 0).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: btcColor, fontSize: "0.8rem", fontWeight: "bold", marginTop: "2px", fontFamily: "monospace" }, children: [
            isBtcUp ? "▲" : "▼",
            " ",
            Math.abs(priceChange24h || 0).toFixed(2),
            "% (24H)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "auto", paddingTop: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniSparkline, { data: chartData, color: btcColor }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "6px", color: "#64748b", fontSize: "0.62rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "24H SATELLITE ORACLE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LIVE" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TheButton, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorStationModal, { isOpen: showSponsorModal, onClose: () => setShowSponsorModal(false) })
  ] });
};
export {
  Home as default
};
