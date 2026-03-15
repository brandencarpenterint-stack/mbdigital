import { r as reactExports, u as useRetroSound, s as supabase, j as jsxRuntimeExports, a as usePocketBro, b as useGamification, c as useToast, m as motion, L as Link } from "./index-I_jIDthF.js";
/* empty css              */
import { T as TiltCard } from "./TiltCard-1P_Hnnyi.js";
import "./use-transform-DafMV2Rs.js";
import "./use-spring-BKaO7Omg.js";
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
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};
const Home = () => {
  const { getMood } = usePocketBro();
  const { getLevelInfo, dailyState, userProfile, coins, followers, activeDrops } = useGamification();
  const { playBeep } = useRetroSound();
  const { level, progress } = getLevelInfo ? getLevelInfo() : { level: 1, progress: 0 };
  const rank = level > 20 ? "LEGEND" : level > 10 ? "VETERAN" : "ROOKIE";
  activeDrops?.reduce((a, b) => a + (b.revenue || 0), 0) || 0;
  const [ticker, setTicker] = reactExports.useState("MCH: $102 ▲ | GLT: $49 ▲");
  const [time, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const { showToast } = useToast();
  reactExports.useEffect(() => {
    const timer = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-container", style: { maxWidth: "1400px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "top-bar-container",
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: { padding: "0 15px", height: "100%", display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: "1.2rem", color: "#00ffcc", fontWeight: "bold" }, children: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://merchboy.shop", target: "_blank", className: "squishy-btn", style: {
            height: "100%",
            padding: "0 20px",
            background: "#FFD700",
            color: "black",
            display: "flex",
            alignItems: "center",
            fontWeight: "900",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.9rem"
          }, children: "🛍️ SHOP" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "dashboard-grid",
        variants: container,
        initial: "hidden",
        animate: "show",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #111, #222)",
            border: "1px solid #333",
            padding: "25px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "70px", height: "70px", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: -5, width: "80px", height: "80px", transform: "rotate(-90deg)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#333", strokeWidth: "5", fill: "none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "#00ffcc", strokeWidth: "5", fill: "none", strokeDasharray: "283", strokeDashoffset: 283 - 283 * progress / 100, transition: "stroke-dashoffset 1s" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar || "/assets/merchboy_face.png", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #000" } })
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "auto" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", textAlign: "center", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#555" }, children: "BALANCE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.2rem", color: "#ffd700" }, children: [
                  "🪙 ",
                  coins
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", textAlign: "center", transform: "translateZ(10px)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#555" }, children: "MOOD" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: getMood() })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "#0f0f1b",
            border: "1px solid #444",
            padding: "0",
            overflow: "hidden"
          }, glowColor: "rgba(0,255,100,0.2)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "15px 25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", color: "#fff" }, children: "DAILY MISSIONS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", background: "#333", padding: "2px 8px", borderRadius: "4px" }, children: [
                dailyState?.quests?.filter((q) => q.claimed).length,
                "/3"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "20px", transform: "translateZ(10px)" }, children: dailyState?.quests?.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
              opacity: q.claimed ? 0.5 : 1
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: q.claimed ? "none" : "2px solid #555",
                background: q.claimed ? "#00ff00" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: q.claimed && "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textDecoration: q.claimed ? "line-through" : "none", color: "#ddd" }, children: [
                  q.desc || q.text,
                  " "
                ] }),
                !q.claimed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888", marginTop: "2px" }, children: [
                  "Progress: ",
                  q.progress || 0,
                  " / ",
                  q.target,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "4px", background: "#333", marginTop: "2px", borderRadius: "2px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    width: `${Math.min(100, (q.progress || 0) / q.target * 100)}%`,
                    height: "100%",
                    background: "var(--neon-green)",
                    borderRadius: "2px"
                  } }) })
                ] })
              ] }),
              !q.claimed && (q.progress || 0) >= q.target && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: {
                background: "gold",
                color: "black",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "0.7rem",
                fontWeight: "bold",
                cursor: "pointer"
              }, children: "CLAIM" })
            ] }, q.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", style: { textDecoration: "none", color: "inherit", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            padding: "20px"
          }, glowColor: "rgba(255, 215, 0, 0.4)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", transform: "translateZ(30px)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "5px" }, children: "🏆" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, fontSize: "1.5rem", fontWeight: "900" }, children: "RANKINGS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: 0.8, fontSize: "0.7rem", fontWeight: "bold" }, children: "HALL OF LEGENDS" })
          ] }) }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/merch-lab", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: { background: "#fff", color: "#333", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🧢" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "MERCH LAB ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "DESIGN STUDIO" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/coloring", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "#fff",
            color: "#333",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "2px solid #ff0055"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🎨" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "COLORING BOOK",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "RELAX & CREATE" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://merchboy.shop", target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)",
            // Gold
            color: "black",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid #ffcc00"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🛍️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "900", letterSpacing: "-1px" }, children: "MERCHBOY.SHOP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", opacity: 0.8, fontWeight: "bold" }, children: "OFFICIAL STORE" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/beatlab", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #110022, #330066)",
            border: "1px solid #5500aa",
            color: "#e0c0ff",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "🎹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "BEAT LAB",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#aa88cc" }, children: "SONIC STUDIO" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subslayer", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, onMouseEnter: playBeep, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
            background: "linear-gradient(135deg, #220000, #440000)",
            border: "1px solid #ff3333",
            color: "#ffaaaa",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", transform: "translateZ(20px)" }, children: "⚔️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: "translateZ(10px)" }, children: [
              "SUB SLAYER",
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#cc5555" }, children: "EXPENSE TRACKER" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: item, style: { height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TheButton, {}) })
        ]
      }
    )
  ] });
};
export {
  Home as default
};
