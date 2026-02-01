import { b as useGamification, r as reactExports, j as jsxRuntimeExports, d as STICKER_COLLECTIONS, S as SquishyButton, a as usePocketBro, c as useRetroSound, e as SHOP_ITEMS, C as CATEGORIES, m as motion, A as AnimatePresence, f as ACHIEVEMENTS, t as triggerConfetti, L as Link } from "./index-CRAV8IaB.js";
import { u as useMotionValue, a as useTransform } from "./use-transform-BHjmmYdT.js";
const GachaponModal = ({ onClose }) => {
  const { coins, buyCapsule, unlockedStickers } = useGamification();
  const [view, setView] = reactExports.useState("MACHINE");
  const [animationState, setAnimationState] = reactExports.useState("IDLE");
  const [reward, setReward] = reactExports.useState(null);
  const handleSpin = () => {
    if (coins < 100) return;
    setAnimationState("SHAKING");
    setTimeout(() => {
      const item = buyCapsule();
      if (item) {
        setReward(item);
        setAnimationState("OPENING");
        setTimeout(() => setAnimationState("REVEAL"), 1e3);
      } else {
        setAnimationState("IDLE");
      }
    }, 1e3);
  };
  const reset = () => {
    setReward(null);
    setAnimationState("IDLE");
  };
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "#ff00ff";
      // Neon Pink
      case "epic":
        return "#a333c8";
      // Purple
      case "rare":
        return "#2185d0";
      // Blue
      default:
        return "#767676";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 6e3,
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
      width: "90%",
      maxWidth: "800px",
      height: "80vh",
      border: "2px solid #ffcc00",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", padding: "20px", borderBottom: "1px solid #444" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "#ffcc00", fontFamily: '"Press Start 2P"' }, children: "GACHA-STATION" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("MACHINE"), style: { background: "none", border: "none", color: view === "MACHINE" ? "#fff" : "#666", cursor: "pointer", fontWeight: "bold" }, children: "PLAY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setView("ALBUM"), style: { background: "none", border: "none", color: view === "ALBUM" ? "#fff" : "#666", cursor: "pointer", fontWeight: "bold" }, children: [
            "ALBUM (",
            unlockedStickers.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "none", border: "none", color: "red", cursor: "pointer" }, children: "X" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto", padding: "20px" }, children: [
        view === "ALBUM" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%" }, children: STICKER_COLLECTIONS.map((col) => {
          const collectedCount = col.items.filter((i) => unlockedStickers.includes(i.id)).length;
          const isComplete = collectedCount === col.items.length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "30px", background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "15px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { margin: 0, color: isComplete ? "gold" : "white" }, children: [
                col.name,
                " ",
                isComplete && "👑"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#aaa" }, children: [
                collectedCount,
                "/",
                col.items.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "15px", flexWrap: "wrap" }, children: col.items.map((item) => {
              const isUnlocked = unlockedStickers.includes(item.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "80px",
                height: "100px",
                background: isUnlocked ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.5)",
                border: `2px solid ${isUnlocked ? getRarityColor(item.rarity) : "#333"}`,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: isUnlocked ? 1 : 0.3,
                filter: isUnlocked ? "none" : "grayscale(100%)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", marginBottom: "5px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "60px" }, children: item.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, style: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" } }) : item.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", textAlign: "center", color: "#fff" }, children: item.name })
              ] }, item.id);
            }) })
          ] }, col.id);
        }) }),
        view === "MACHINE" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", position: "relative" }, children: animationState === "REVEAL" && reward ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reveal-anim", style: { animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "relative",
            background: `radial-gradient(circle, ${getRarityColor(reward.rarity)} 0%, #000 100%)`,
            padding: "50px",
            borderRadius: "50%",
            boxShadow: `0 0 50px ${getRarityColor(reward.rarity)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            height: "200px"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "6rem", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }, children: reward.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: reward.image, style: { maxHeight: "80%", maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.5))" } }) : reward.icon }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: "20px", color: "#fff", textShadow: "0 0 10px white" }, children: reward.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            color: getRarityColor(reward.rarity),
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "1.2rem",
            letterSpacing: "5px"
          }, children: reward.rarity }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "30px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: reset, style: { marginRight: "10px" }, children: "GO AGAIN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setView("ALBUM"), style: { background: "#333" }, children: "VIEW ALBUM" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: "10rem",
            marginBottom: "20px",
            animation: animationState === "SHAKING" ? "shake 0.5s infinite" : "float 3s infinite ease-in-out"
          }, children: "🔮" }),
          animationState === "SHAKING" || animationState === "OPENING" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "gold", fontSize: "1.5rem", fontWeight: "bold" }, children: "DISPENSING..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#333", padding: "10px 20px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#aaa" }, children: "BALANCE:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "gold", fontWeight: "bold" }, children: [
                coins,
                " 🪙"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SquishyButton,
              {
                onClick: handleSpin,
                disabled: coins < 100,
                style: {
                  padding: "20px 50px",
                  fontSize: "1.2rem",
                  background: coins >= 100 ? "linear-gradient(45deg, #ff00cc, #333399)" : "#555",
                  opacity: coins >= 100 ? 1 : 0.5
                },
                children: "INSERT 100 🪙"
              }
            )
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            ` })
  ] });
};
const RARITY_COLORS = {
  common: "#a0aec0",
  rare: "#00bfff",
  epic: "#d53f8c",
  legendary: "#ecc94b"
};
const getRarity = (price) => {
  if (price >= 5e3) return "legendary";
  if (price >= 2e3) return "epic";
  if (price >= 500) return "rare";
  return "common";
};
const ShopPage = () => {
  const { shopState, buyItem, equipItem, unlockedAchievements, coins } = useGamification() || {};
  const { unlockDecor: unlockPocketDecor, stats: pocketStats } = usePocketBro() || {};
  const [activeCategory, setActiveCategory] = reactExports.useState("fishing");
  const [showGacha, setShowGacha] = reactExports.useState(false);
  const { playBeep, playCollect, playBoop } = useRetroSound();
  const featuredItem = reactExports.useMemo(() => {
    const legendaries = SHOP_ITEMS.filter((i) => i.price >= 2e3);
    return legendaries[Math.floor(Math.random() * legendaries.length)] || SHOP_ITEMS[0];
  }, []);
  const filteredItems = reactExports.useMemo(
    () => SHOP_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };
  if (!shopState) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "50px", color: "white", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: '"Orbitron", sans-serif' }, children: "LOADING MARKETPLACE..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: { minHeight: "100vh", paddingBottom: "120px", background: "radial-gradient(circle at top, #1a202c, #000)", fontFamily: '"Rajdhani", sans-serif' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(5,5,10,0.9)",
      backdropFilter: "blur(15px)",
      borderBottom: "1px solid #333",
      padding: "15px 0",
      boxShadow: "0 5px 20px rgba(0,0,0,0.5)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { margin: 0, fontSize: "1.6rem", color: "white", fontFamily: '"Orbitron", sans-serif', letterSpacing: "2px", textShadow: "0 0 10px #00f2ff" }, children: [
          "CYBER ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-blue)" }, children: "MART" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(0,0,0,0.5)",
          border: "1px solid var(--neon-gold)",
          padding: "8px 18px",
          borderRadius: "4px",
          color: "var(--neon-gold)",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 0 10px rgba(255, 215, 0, 0.2)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: coins.toLocaleString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        overflowX: "auto",
        whiteSpace: "nowrap",
        padding: "15px 20px",
        display: "flex",
        gap: "15px",
        maxWidth: "1200px",
        margin: "0 auto",
        scrollbarWidth: "none"
      }, children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          whileHover: { scale: 1.05, y: -2 },
          whileTap: { scale: 0.95 },
          onClick: () => {
            setActiveCategory(cat.id);
            playBoop();
            if (navigator.vibrate) navigator.vibrate(10);
          },
          style: {
            padding: "10px 25px",
            borderRadius: "4px",
            border: activeCategory === cat.id ? "1px solid var(--neon-blue)" : "1px solid #333",
            background: activeCategory === cat.id ? "rgba(0, 242, 255, 0.1)" : "rgba(0,0,0,0.4)",
            color: activeCategory === cat.id ? "var(--neon-blue)" : "#888",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.9rem",
            letterSpacing: "1px",
            fontFamily: '"Orbitron", sans-serif',
            transition: "all 0.2s",
            boxShadow: activeCategory === cat.id ? "0 0 15px rgba(0, 242, 255, 0.2)" : "none",
            clipPath: "polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginRight: "8px" }, children: cat.icon }),
            cat.name.toUpperCase()
          ]
        },
        cat.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", maxWidth: "1200px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "glass-panel",
          onMouseMove: handleMouseMove,
          onMouseLeave: () => {
            mouseX.set(0);
            mouseY.set(0);
          },
          style: {
            marginBottom: "40px",
            padding: "0",
            background: "radial-gradient(circle at center, #222, #000)",
            border: `1px solid ${RARITY_COLORS[getRarity(featuredItem.price)]}`,
            display: "flex",
            flexWrap: "wrap",
            overflow: "hidden",
            perspective: "1000px",
            transformStyle: "preserve-3d",
            boxShadow: `0 0 30px ${RARITY_COLORS[getRarity(featuredItem.price)]}20`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: RARITY_COLORS[getRarity(featuredItem.price)], fontWeight: "bold", letterSpacing: "4px", marginBottom: "10px", fontSize: "0.8rem" }, children: "// FEATURED ITEM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "3.5rem", margin: "0 0 10px 0", color: "white", textShadow: "0 0 20px rgba(255,255,255,0.2)", fontFamily: '"Orbitron", sans-serif' }, children: featuredItem.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", fontSize: "1.2rem", marginBottom: "30px", maxWidth: "500px", lineHeight: 1.5 }, children: [
                featuredItem.description,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.9rem", color: "#666" }, children: "LIMITED STOCK [==============--] 85%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SquishyButton,
                {
                  onClick: () => {
                    setActiveCategory(featuredItem.category);
                    playBeep();
                  },
                  style: {
                    width: "fit-content",
                    background: RARITY_COLORS[getRarity(featuredItem.price)],
                    color: "black",
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: "1rem",
                    padding: "15px 40px"
                  },
                  children: "VIEW IN STORE ->"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                style: {
                  width: "350px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10rem",
                  position: "relative",
                  rotateX,
                  rotateY
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] },
                    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    style: { filter: `drop-shadow(0 20px 50px ${RARITY_COLORS[getRarity(featuredItem.price)]}66)` },
                    children: featuredItem.icon
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setShowGacha(true),
          className: "glass-panel",
          style: {
            marginBottom: "40px",
            padding: "25px",
            background: "linear-gradient(90deg, #220022 0%, #000 100%)",
            border: "1px solid #d53f8c",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "inset 0 0 50px #d53f8c22"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "30px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 20, loop: Infinity, ease: "linear" }, style: { fontSize: "3rem" }, children: "🔮" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: "#d53f8c", fontSize: "1.8rem", fontFamily: '"Orbitron", sans-serif' }, children: "STICKER GACHAPON" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "5px 0 0 0", color: "#aaa" }, children: "Test your luck! Win rare stickers for your Bro Card." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#d53f8c", fontWeight: "bold", padding: "10px 20px", border: "2px solid #d53f8c", borderRadius: "4px" }, children: "OPEN >" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          layout: true,
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredItems.map((item) => {
            const slot = item.slot || item.category;
            const isDecor = item.category === "homedecor";
            const isUnlocked = isDecor ? pocketStats?.unlockedDecor?.includes(item.id) : shopState.unlocked.includes(item.id);
            const isEquipped = shopState.equipped[slot] === item.id;
            const canAfford = coins >= item.price;
            const rarity = getRarity(item.price);
            const color = RARITY_COLORS[rarity];
            const requirementId = item.unlockCondition;
            const requirement = requirementId ? ACHIEVEMENTS.find((a) => a.id === requirementId) : null;
            const isAchievementUnlocked = !requirementId || unlockedAchievements?.includes(requirementId);
            const isConsumable = item.type === "consumable";
            const stock = shopState.inventory?.[item.id] || 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                layout: true,
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
                className: "glass-panel",
                style: {
                  padding: "25px",
                  border: isEquipped ? "2px solid var(--neon-green)" : `1px solid ${color}33`,
                  background: isEquipped ? "rgba(0, 255, 154, 0.05)" : `linear-gradient(180deg, #111 0%, ${color}08 100%)`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  clipPath: "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "15px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", border: `1px solid ${color}`, padding: "2px 6px", borderRadius: "4px" }, children: rarity }),
                    isEquipped && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "var(--neon-green)", color: "black", fontSize: "0.6rem", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" }, children: "EQUIPPED" }),
                    isConsumable && stock > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "white", color: "black", fontSize: "0.6rem", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" }, children: [
                      "STOCK: ",
                      stock
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem", marginBottom: "15px", position: "relative" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", width: "100px", height: "100px", borderRadius: "50%", background: color, opacity: 0.1, filter: "blur(20px)" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: { scale: 1.1, rotate: [0, -5, 5, 0] }, children: item.icon })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 5px 0", fontSize: "1.4rem", color: "white", fontFamily: '"Orbitron", sans-serif' }, children: item.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 20px 0", fontSize: "0.9rem", color: "#888", flex: 1, lineHeight: 1.4 }, children: item.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto" }, children: isUnlocked && !isConsumable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        equipItem(item.category, item.id);
                        playBeep();
                      },
                      disabled: isEquipped,
                      style: {
                        width: "100%",
                        padding: "15px",
                        borderRadius: "4px",
                        background: isEquipped ? "transparent" : "var(--neon-blue)",
                        color: isEquipped ? "var(--neon-green)" : "black",
                        border: isEquipped ? "1px solid var(--neon-green)" : "none",
                        fontWeight: "bold",
                        cursor: isEquipped ? "default" : "pointer",
                        opacity: isEquipped ? 0.7 : 1,
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: "0.9rem"
                      },
                      children: isEquipped ? "ACTIVE" : "EQUIP"
                    }
                  ) : !isAchievementUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    padding: "15px",
                    background: "rgba(255,0,0,0.05)",
                    border: "1px solid rgba(255,0,0,0.4)",
                    borderRadius: "4px",
                    color: "#ff5555",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }, children: [
                    "🔒 ",
                    requirement?.title?.toUpperCase() || "LOCKED"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        if (buyItem(item)) {
                          playCollect();
                          triggerConfetti();
                          if (isDecor && unlockPocketDecor) {
                            unlockPocketDecor(item.id);
                          }
                        }
                      },
                      disabled: !canAfford,
                      style: {
                        width: "100%",
                        padding: "15px",
                        borderRadius: "4px",
                        background: canAfford ? "var(--neon-gold)" : "#222",
                        color: canAfford ? "black" : "#555",
                        border: "none",
                        fontWeight: "bold",
                        cursor: canAfford ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: "0.9rem"
                      },
                      children: [
                        canAfford ? "PURCHASE" : "INSUFFICIENT FUNDS",
                        canAfford && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "rgba(0,0,0,0.2)", padding: "2px 6px", borderRadius: "4px" }, children: item.price })
                      ]
                    }
                  ) })
                ]
              },
              item.id
            );
          }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "80px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { color: "#666", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "2px", fontFamily: '"Orbitron", sans-serif' }, children: "← RETURN TO SECTOR 7 (ARCADE)" }) })
    ] }),
    showGacha && /* @__PURE__ */ jsxRuntimeExports.jsx(GachaponModal, { onClose: () => setShowGacha(false) })
  ] });
};
export {
  ShopPage as default
};
