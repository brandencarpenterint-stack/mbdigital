import { r as reactExports, u as useRetroSound, s as supabase, j as jsxRuntimeExports, a as useGamification, m as motion, R as React, L as Link } from "./index-z9W2aAb3.js";
import { S as SponsorStationModal } from "./SponsorStationModal-COJGOzbB.js";
import { T as TiltCard } from "./TiltCard-CzT2SNCF.js";
import { u as useRealBtc } from "./useRealBtc-DpGeIyhF.js";
import "./use-transform-FP-4gvs2.js";
import "./use-spring-CkBzFeB6.js";
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
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};
const Home = () => {
  const { getLevelInfo, userProfile, coins } = useGamification();
  const { playBeep } = useRetroSound();
  const { btcPrice, priceChange24h, chartData } = useRealBtc();
  const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const rank = level > 20 ? "LEGEND" : level > 10 ? "VETERAN" : "ROOKIE";
  const [time, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1000px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "top-bar-container", initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: { padding: "0 15px", height: "100%", display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: "1.2rem", color: "#00ffcc", fontWeight: "bold" }, children: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowSponsorModal(true),
            className: "squishy-btn",
            style: {
              height: "100%",
              padding: "0 14px",
              background: "linear-gradient(135deg, #00f0ff, #0072ff)",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "900",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              boxShadow: "0 0 16px rgba(0, 240, 255, 0.4)",
              fontFamily: "monospace"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡" }),
              " +1.5K AIRDROP"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://merchboy.shop", target: "_blank", rel: "noreferrer", className: "squishy-btn", style: {
          height: "100%",
          padding: "0 16px",
          background: "#FFD700",
          color: "black",
          display: "flex",
          alignItems: "center",
          fontWeight: "900",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "0.85rem"
        }, children: "🛍️ SHOP" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "#0a0a10",
      borderTop: "1px solid #222",
      borderBottom: "1px solid #222",
      marginBottom: "20px",
      padding: "8px 0",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "flex",
      fontFamily: "monospace",
      fontSize: "0.85rem"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { x: [0, -1200] },
        transition: { repeat: Infinity, ease: "linear", duration: 25 },
        style: { display: "flex", gap: "40px", color: "#aaa", alignItems: "center" },
        children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#f7931a", display: "inline-block", boxShadow: "0 0 6px #f7931a" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "₿ BTC/USD:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff", fontWeight: "bold" }, children: [
              "$",
              btcPrice.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: btcColor, fontWeight: "bold" }, children: [
              "(",
              isBtcUp ? "+" : "",
              priceChange24h.toFixed(2),
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00e5ff", fontWeight: "bold" }, children: "🎮 26 CYBER GAMES LIVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00ff66", fontWeight: "bold" }, children: "🪙 1,480+ BROS ONLINE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700", fontWeight: "bold" }, children: "🏆 100,000 CP HIGH-ROLLER JACKPOTS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff007f", fontWeight: "bold" }, children: "🍸 THE BUNKER SPEAKEASY LOUNGE OPEN" })
        ] }, i))
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, type: "spring" }, style: { marginBottom: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bento-card",
        style: {
          background: "linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(255, 0, 255, 0.15))",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(0, 255, 204, 0.3)",
          borderRadius: "30px",
          padding: "70px 40px",
          textAlign: "center",
          boxShadow: "0 0 50px rgba(0, 255, 204, 0.1), inset 0 0 20px rgba(255, 0, 255, 0.1)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 10px 60px rgba(0, 255, 204, 0.3)";
          playBeep();
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 0 50px rgba(0, 255, 204, 0.1)";
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "clamp(2.5rem, 7vw, 4.5rem)", margin: 0, background: "linear-gradient(to right, #00ffcc, #ff00ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 0 30px rgba(0,255,204,0.4)", fontWeight: "900", letterSpacing: "4px" }, children: "ENTER ARCADE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", marginTop: "12px", letterSpacing: "3px", fontFamily: "monospace" }, children: "26 CYBER TITLES • CASINO HIGH-ROLLERS • DAILY QUESTS • LEADERBOARDS" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "35px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", px: "5px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 8px #00e5ff" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: "0.9rem", fontWeight: "900", letterSpacing: "1.5px", fontFamily: '"Orbitron", monospace' }, children: "FEATURED TITLES" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#00e5ff", fontSize: "0.8rem", fontWeight: "bold", textDecoration: "none", fontFamily: "monospace" }, children: "VIEW ALL 26 TITLES ➔" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/crash", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bento-card",
            style: {
              background: "linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(255, 215, 0, 0.15))",
              border: "1px solid rgba(255, 0, 85, 0.4)",
              borderRadius: "20px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
              cursor: "pointer"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#ff0055";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 0, 85, 0.4)";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_dino.png", style: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ff0055" }, alt: "Crash" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#ff0055", color: "#fff", fontSize: "0.6rem", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginBottom: "3px" }, children: "100X MOONSHOT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, color: "#fff", fontSize: "1rem", fontWeight: "900" }, children: "CYBER CRASH" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "2px" }, children: "Auto-Cashout Pilots" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/dozer", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bento-card",
            style: {
              background: "linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(255, 0, 127, 0.15))",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: "20px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
              cursor: "pointer"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#00e5ff";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.4)";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_astro.png", style: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%", border: "2px solid #00e5ff" }, alt: "Dozer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#00e5ff", color: "#000", fontSize: "0.6rem", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginBottom: "3px" }, children: "PHYSICS PUSHER" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, color: "#fff", fontSize: "1rem", fontWeight: "900" }, children: "COIN DOZER" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "2px" }, children: "Mascot Figurines & Quakes" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/mines", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bento-card",
            style: {
              background: "linear-gradient(135deg, rgba(0, 255, 102, 0.25), rgba(0, 229, 255, 0.15))",
              border: "1px solid rgba(0, 255, 102, 0.4)",
              borderRadius: "20px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
              cursor: "pointer"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#00ff66";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 102, 0.4)";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_bunny.png", style: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%", border: "2px solid #00ff66" }, alt: "Mines" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#00ff66", color: "#000", fontSize: "0.6rem", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginBottom: "3px" }, children: "5X5 GRID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, color: "#fff", fontSize: "1rem", fontWeight: "900" }, children: "CYBER MINES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "2px" }, children: "Scout Drones & Multipliers" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/blackjack", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bento-card",
            style: {
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(0, 255, 102, 0.15))",
              border: "1px solid rgba(255, 215, 0, 0.4)",
              borderRadius: "20px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
              cursor: "pointer"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#ffd700";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.4)";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/skins/face_money.png", style: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ffd700" }, alt: "Blackjack" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#ffd700", color: "#000", fontSize: "0.6rem", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginBottom: "3px" }, children: "3:2 PAYOUTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, color: "#fff", fontSize: "1rem", fontWeight: "900" }, children: "CYBER 21" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "2px" }, children: "High-Roller VIP Penthouse" })
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "dashboard-grid", variants: container, initial: "hidden", animate: "show", style: { gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #111, #222)", border: "1px solid #333", padding: "25px", display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "70px", height: "70px", transform: "translateZ(10px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: -5, width: "80px", height: "80px", transform: "rotate(-90deg)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#333", strokeWidth: "5", fill: "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#00ffcc", strokeWidth: "5", fill: "none", strokeDasharray: "283", strokeDashoffset: 283 - 283 * progress / 100, style: { transition: "stroke-dashoffset 1s" } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/skins/face_default.png", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #000" }, alt: "Avatar" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(20px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem", letterSpacing: "2px" }, children: "OPERATOR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", fontWeight: "bold", textTransform: "uppercase" }, children: userProfile?.name || "GUEST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#00ffcc", fontSize: "0.9rem", fontWeight: "bold" }, children: [
              rank,
              " // LVL ",
              level
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "auto", transform: "translateZ(10px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "#888", letterSpacing: "1px" }, children: "FUNDS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.2rem", color: "#ffd700", fontWeight: "bold" }, children: [
            "🪙 ",
            coins
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: item, style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bunker", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)", color: "#fff", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🚨" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "THE BUNKER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", opacity: 0.8, marginTop: "5px" }, children: "MULTIPLAYER LOBBY" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pocketbro", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #333 0%, #111 100%)", border: "1px solid #444", color: "#fff", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "👾" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "POCKET BRO" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)", color: "#000", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🏆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "GLOBAL RANKINGS" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vault", style: { textDecoration: "none", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)", color: "#000", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(20px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🎒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: "900" }, children: "THE VAULT" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "linear-gradient(135deg, #171724, #0c0c14)", border: "1px solid #2d2d42", padding: "25px", display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid #28283a", paddingBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#00ffcc", display: "inline-block", boxShadow: "0 0 8px #00ffcc" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f7931a", fontSize: "0.95rem", fontWeight: "bold", letterSpacing: "1px" }, children: "BITCOIN ORACLE ₿" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/exchange", style: { background: "#f7931a", color: "#000", padding: "5px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }, children: "LIVE FEED" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem", letterSpacing: "1px" }, children: "BTC / USD SPOT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.8rem", fontWeight: "900", color: "#fff", letterSpacing: "1px", marginTop: "2px" }, children: [
            "$",
            btcPrice.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: btcColor, fontSize: "0.85rem", fontWeight: "bold", marginTop: "2px" }, children: [
            isBtcUp ? "▲" : "▼",
            " ",
            Math.abs(priceChange24h).toFixed(2),
            "% (24H)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "auto", paddingTop: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniSparkline, { data: chartData, color: btcColor }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "8px", color: "#555", fontSize: "0.65rem" }, children: [
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
