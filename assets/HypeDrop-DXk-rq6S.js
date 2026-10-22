import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-DNvIaumc.js";
const RARITY = {
  COMMON: { name: "COMMON", color: "#b0bec5", bg: "rgba(176,190,197,0.1)", border: "#78909c" },
  RARE: { name: "RARE", color: "#00e5ff", bg: "rgba(0,229,255,0.12)", border: "#00b0ff" },
  EPIC: { name: "EPIC", color: "#d500f9", bg: "rgba(213,0,249,0.15)", border: "#aa00ff" },
  LEGENDARY: { name: "LEGENDARY", color: "#ffd700", bg: "rgba(255,215,0,0.2)", border: "#ffab00" }
};
const CRATES = [
  {
    id: "street",
    name: "STREET CRATE",
    cost: 75,
    tag: "STARTER DROP",
    color: "#00e5ff",
    desc: "Classic street drip & bonus cash.",
    pool: [
      { id: "face_default", name: "OG Bro", rarity: "COMMON", img: "/assets/skins/face_default.png", type: "skin" },
      { id: "coins_50", name: "50 Coins", rarity: "COMMON", coins: 50, type: "coins" },
      { id: "coins_100", name: "100 Coins", rarity: "COMMON", coins: 100, type: "coins" },
      { id: "face_frog", name: "Pepe Frog", rarity: "RARE", img: "/assets/skins/face_frog.png", type: "skin" },
      { id: "face_hoodie", name: "Hype Hoodie", rarity: "RARE", img: "/assets/skins/face_hoodie.png", type: "skin" },
      { id: "face_cat", name: "Neko Cat", rarity: "EPIC", img: "/assets/skins/face_cat.png", type: "skin" },
      { id: "face_pumpkin", name: "Spooky Bro", rarity: "EPIC", img: "/assets/skins/face_pumpkin.png", type: "skin" },
      { id: "face_money", name: "Money Face", rarity: "LEGENDARY", img: "/assets/skins/face_money.png", type: "skin" },
      { id: "coins_500", name: "500 Coin Stash", rarity: "LEGENDARY", coins: 500, type: "coins" }
    ]
  },
  {
    id: "cosmic",
    name: "COSMIC VAULT",
    cost: 250,
    tag: "POPULAR DROP",
    color: "#d500f9",
    desc: "Outer-space rarities & big jackpots.",
    pool: [
      { id: "face_bunny", name: "Bunny Bro", rarity: "COMMON", img: "/assets/skins/face_bunny.png", type: "skin" },
      { id: "coins_150", name: "150 Coins", rarity: "COMMON", coins: 150, type: "coins" },
      { id: "face_bear", name: "Bear Bro", rarity: "RARE", img: "/assets/skins/face_bear.png", type: "skin" },
      { id: "face_bunny_blue", name: "Cyan Bunny", rarity: "RARE", img: "/assets/skins/face_bunny_blue.png", type: "skin" },
      { id: "face_dino", name: "Dino Bro", rarity: "EPIC", img: "/assets/skins/face_dino.png", type: "skin" },
      { id: "face_space", name: "Cosmic Bro", rarity: "EPIC", img: "/assets/skins/face_space.png", type: "skin" },
      { id: "face_astro", name: "Astro Pilot", rarity: "LEGENDARY", img: "/assets/skins/face_astro.png", type: "skin" },
      { id: "face_rainbow", name: "Prism Rainbow", rarity: "LEGENDARY", img: "/assets/skins/face_rainbow.png", type: "skin" },
      { id: "coins_1500", name: "1,500 Jackpot", rarity: "LEGENDARY", coins: 1500, type: "coins" }
    ]
  },
  {
    id: "highroller",
    name: "HIGH ROLLER CRATE",
    cost: 750,
    tag: "ULTRA LUXURY",
    color: "#ffd700",
    desc: "Top-tier cosmetics & 5,000 Coin payouts.",
    pool: [
      { id: "face_bunny_hoodie", name: "Street Bunny", rarity: "COMMON", img: "/assets/skins/face_bunny_hoodie.png", type: "skin" },
      { id: "coins_500", name: "500 Coins", rarity: "COMMON", coins: 500, type: "coins" },
      { id: "face_gamer", name: "Gamer Bro", rarity: "RARE", img: "/assets/skins/face_gamer.png", type: "skin" },
      { id: "coins_1000", name: "1,000 Coins", rarity: "RARE", coins: 1e3, type: "coins" },
      { id: "face_star", name: "Gold Star", rarity: "EPIC", img: "/assets/skins/face_star.png", type: "skin" },
      { id: "face_astro", name: "Astro Pilot", rarity: "EPIC", img: "/assets/skins/face_astro.png", type: "skin" },
      { id: "face_money", name: "Holo Money Face", rarity: "LEGENDARY", img: "/assets/skins/face_money.png", type: "skin" },
      { id: "coins_5000", name: "5,000 Ultra Jackpot", rarity: "LEGENDARY", coins: 5e3, type: "coins" }
    ]
  }
];
const renderCrateIcon = (crateId, color, size = 32) => {
  if (crateId === "cosmic") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "12", rx: "10", ry: "4", transform: "rotate(-30 12 12)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3", fill: color })
    ] });
  }
  if (crateId === "highroller") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "7", width: "18", height: "14", rx: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5", fill: color }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "14", r: "2", fill: color })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9h18M9 21V9M15 21V9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "6", r: "1.5", fill: color })
  ] });
};
const renderDropItemIcon = (item, size = 65) => {
  if (item.type === "skin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: item.img,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
          filter: `drop-shadow(0 0 10px ${RARITY[item.rarity]?.color || "#ffd700"})`,
          margin: "10px 0"
        },
        alt: item.name
      }
    );
  }
  const coins = item.coins || 0;
  if (coins >= 5e3) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { margin: "10px 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 8h14l-3 10H2L5 8z", fill: "rgba(255,215,0,0.3)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 4h14l-3 4H5L8 4z", fill: "rgba(255,215,0,0.5)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 8l3-4v10l-3 4V8z", fill: "rgba(255,215,0,0.2)" })
    ] });
  }
  if (coins >= 1500) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "rgba(0, 229, 255, 0.3)", stroke: "#00e5ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { margin: "10px 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "6 3 18 3 22 9 12 22 2 9 6 3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "22", x2: "12", y2: "9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "9", x2: "22", y2: "9" })
    ] });
  }
  if (coins >= 500) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { margin: "10px 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "7", rx: "9", ry: "3", fill: "rgba(255,215,0,0.2)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 7v5c0 1.66-4 3-9 3s-9-1.34-9-3V7" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12v5c0 1.66-4 3-9 3s-9-1.34-9-3v-5" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "#00ffcc", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { margin: "10px 0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "9", fill: "rgba(0,255,204,0.15)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "4", stroke: "#00ffcc", fill: "#00ffcc" })
  ] });
};
const ITEM_CARD_WIDTH = 150;
const WINNER_INDEX = 45;
const TOTAL_SPIN_ITEMS = 60;
const HypeDrop = () => {
  const { coins = 0, spendCoins, addCoins, incrementStat, userProfile, updateProfile } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playCrash, playCollect } = useRetroSound();
  const [selectedCrate, setSelectedCrate] = reactExports.useState(CRATES[0]);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [quickOpen, setQuickOpen] = reactExports.useState(false);
  const [itemsList, setItemsList] = reactExports.useState([]);
  const [winnerItem, setWinnerItem] = reactExports.useState(null);
  const [showRewardModal, setShowRewardModal] = reactExports.useState(false);
  const [recentPulls, setRecentPulls] = reactExports.useState([]);
  const [isShake, setIsShake] = reactExports.useState(false);
  const trackRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const animIdRef = reactExports.useRef(null);
  const playMechanicalTick = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
    }
  };
  const pickWeightedWinner = (pool) => {
    const rand = Math.random() * 100;
    let targetRarity = "COMMON";
    if (rand < 2) targetRarity = "LEGENDARY";
    else if (rand < 12) targetRarity = "EPIC";
    else if (rand < 35) targetRarity = "RARE";
    else targetRarity = "COMMON";
    const matching = pool.filter((item) => item.rarity === targetRarity);
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const handleOpenCrate = () => {
    if (isSpinning) return;
    if ((coins || 0) < selectedCrate.cost) {
      playCrash();
      showToast("Not enough coins to unlock this crate!", "error");
      return;
    }
    spendCoins(selectedCrate.cost);
    if (incrementStat) {
      incrementStat("cratesOpened", 1);
      incrementStat("gamesPlayedCount", 1);
    }
    setIsSpinning(true);
    setShowRewardModal(false);
    const pool = selectedCrate.pool;
    const winner = pickWeightedWinner(pool);
    setWinnerItem(winner);
    const track = [];
    for (let i = 0; i < TOTAL_SPIN_ITEMS; i++) {
      if (i === WINNER_INDEX) {
        track.push(winner);
      } else {
        track.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    setItemsList(track);
    if (quickOpen) {
      finishSpin(winner);
      return;
    }
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = "translateX(0px)";
    }
    const containerWidth = trackRef.current?.parentElement?.clientWidth || 700;
    const randomOffset = (Math.random() - 0.5) * 60;
    const targetDistance = WINNER_INDEX * ITEM_CARD_WIDTH + ITEM_CARD_WIDTH / 2 - containerWidth / 2 + randomOffset;
    const duration = 4800;
    const startTime = performance.now();
    let lastTickIndex = 0;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 4.5);
      const currentX = targetDistance * easeOut;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-currentX}px)`;
      }
      const currentCardIndex = Math.floor((currentX + containerWidth / 2) / ITEM_CARD_WIDTH);
      if (currentCardIndex !== lastTickIndex) {
        playMechanicalTick();
        lastTickIndex = currentCardIndex;
      }
      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(animate);
      } else {
        finishSpin(winner);
      }
    };
    animIdRef.current = requestAnimationFrame(animate);
  };
  const finishSpin = (winner) => {
    setIsSpinning(false);
    setRecentPulls((prev) => [winner, ...prev.slice(0, 7)]);
    if (winner.type === "coins") {
      addCoins(winner.coins);
    }
    if (winner.rarity === "EPIC" || winner.rarity === "LEGENDARY") {
      setIsShake(true);
      triggerConfetti();
      playWin();
      setTimeout(() => setIsShake(false), 900);
      feedService.publish(`just unboxed a ${winner.rarity} ${winner.name}!`, "win", userProfile?.name || "Player");
    } else {
      playCollect();
    }
    setTimeout(() => {
      setShowRewardModal(true);
    }, 350);
  };
  const handleEquipAvatar = (img) => {
    if (!img) return;
    if (updateProfile) {
      updateProfile({ avatar: img });
      showToast("Equipped avatar to profile!", "success");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% 20%, #150028 0%, #05000d 80%, #000000 100%)",
    color: "white",
    padding: "30px 20px 80px 20px",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, className: isShake ? "shake-viewport" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "1000px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      padding: "12px 20px",
      background: "rgba(15, 15, 28, 0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 0, 127, 0.25)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/arcade", style: {
        color: "#00ffcc",
        textDecoration: "none",
        fontWeight: "800",
        fontSize: "0.85rem",
        letterSpacing: "1px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0, 255, 204, 0.08)",
        border: "1px solid rgba(0, 255, 204, 0.3)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "ARCADE"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        background: "rgba(255, 215, 0, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        borderRadius: "10px",
        color: "#ffd700",
        fontWeight: "800",
        fontSize: "0.9rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ffd700",
          boxShadow: "0 0 8px #ffd700"
        } }),
        coins ? coins.toLocaleString() : 0,
        " CP"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "25px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
        margin: 0,
        background: "linear-gradient(135deg, #ff007f, #7928ca, #00f2fe)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 30px rgba(255,0,127,0.4)",
        letterSpacing: "3px",
        fontWeight: 900
      }, children: "HYPE DROP: CASE UNBOXING" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", margin: "8px 0 0 0", fontSize: "0.9rem", letterSpacing: "1px" }, children: "MYSTERY CRATES // UNBOX LEGENDARY SKINS & JACKPOTS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap", justifyContent: "center" }, children: CRATES.map((crate) => {
      const isSelected = selectedCrate.id === crate.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => {
            if (isSpinning) return;
            setSelectedCrate(crate);
          },
          style: {
            background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.4)",
            border: isSelected ? `2px solid ${crate.color}` : "1px solid #333",
            borderRadius: "16px",
            padding: "16px 24px",
            cursor: isSpinning ? "not-allowed" : "pointer",
            transition: "all 0.25s ease",
            textAlign: "center",
            minWidth: "180px",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
            boxShadow: isSelected ? `0 0 25px ${crate.color}40` : "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", marginBottom: "8px" }, children: renderCrateIcon(crate.id, crate.color, 36) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.95rem", fontWeight: "bold", color: crate.color }, children: crate.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.75rem", color: "#ffd700", fontWeight: "800", marginTop: "4px" }, children: [
              crate.cost,
              " CP"
            ] })
          ]
        },
        crate.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "850px",
      background: "rgba(5, 5, 15, 0.85)",
      border: "2px solid #222",
      borderRadius: "24px",
      padding: "24px 20px",
      position: "relative",
      boxShadow: "0 0 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.02)",
      marginBottom: "30px",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        width: "4px",
        background: "#ffd700",
        boxShadow: "0 0 15px #ffd700, 0 0 30px #ffab00",
        zIndex: 20,
        transform: "translateX(-50%)",
        pointerEvents: "none"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "16px solid #ffd700",
          filter: "drop-shadow(0 0 8px #ffd700)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "16px solid #ffd700",
          filter: "drop-shadow(0 0 8px #ffd700)"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", overflow: "hidden", height: "170px", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: trackRef,
          style: {
            display: "flex",
            gap: "10px",
            position: "absolute",
            left: 0,
            top: 0,
            willChange: "transform"
          },
          children: (itemsList.length > 0 ? itemsList : selectedCrate.pool.concat(selectedCrate.pool).concat(selectedCrate.pool)).map((item, idx) => {
            const rInfo = RARITY[item.rarity] || RARITY.COMMON;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  width: "140px",
                  height: "160px",
                  background: rInfo.bg,
                  border: `2px solid ${rInfo.border}`,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  flexShrink: 0,
                  boxShadow: `inset 0 0 15px ${rInfo.color}20`,
                  position: "relative"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    top: "6px",
                    right: "8px",
                    fontSize: "0.6rem",
                    color: rInfo.color,
                    fontWeight: "bold"
                  }, children: rInfo.name }),
                  renderDropItemIcon(item, 65),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "white",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%"
                  }, children: item.name })
                ]
              },
              idx
            );
          })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "35px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: handleOpenCrate,
          disabled: isSpinning || (coins || 0) < selectedCrate.cost,
          style: {
            padding: "18px 45px",
            fontSize: "1.3rem",
            fontWeight: "900",
            background: (coins || 0) >= selectedCrate.cost ? selectedCrate.color : "#333",
            color: (coins || 0) >= selectedCrate.cost ? "#000" : "#888",
            cursor: (coins || 0) >= selectedCrate.cost && !isSpinning ? "pointer" : "not-allowed",
            boxShadow: (coins || 0) >= selectedCrate.cost ? `0 0 30px ${selectedCrate.color}60` : "none",
            letterSpacing: "1px"
          },
          children: isSpinning ? "ROLLING..." : `UNLOCK FOR ${selectedCrate.cost} COINS`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#aaa" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: quickOpen,
            onChange: (e) => setQuickOpen(e.target.checked),
            style: { accentColor: selectedCrate.color, width: "16px", height: "16px" }
          }
        ),
        "FAST UNBOX"
      ] })
    ] }),
    recentPulls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: "850px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.85rem", fontWeight: "bold", color: "#888", marginBottom: "12px" }, children: "RECENT UNBOXINGS:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }, children: recentPulls.map((item, idx) => {
        const rInfo = RARITY[item.rarity] || RARITY.COMMON;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: rInfo.bg,
              border: `1px solid ${rInfo.border}`,
              borderRadius: "10px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0
            },
            children: [
              item.type === "skin" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.img, style: { width: "28px", height: "28px", objectFit: "contain" }, alt: item.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center" }, children: renderDropItemIcon(item, 24) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", fontWeight: "bold", color: "white" }, children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: rInfo.color }, children: item.rarity })
              ] })
            ]
          },
          idx
        );
      }) })
    ] }),
    showRewardModal && winnerItem && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        },
        onClick: () => setShowRewardModal(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#0a0a14",
              border: `3px solid ${RARITY[winnerItem.rarity]?.color || "gold"}`,
              boxShadow: `0 0 60px ${RARITY[winnerItem.rarity]?.color || "gold"}60`,
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
              maxWidth: "420px",
              width: "90%"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: "0.9rem",
                fontWeight: "900",
                letterSpacing: "3px",
                color: RARITY[winnerItem.rarity]?.color || "white",
                marginBottom: "10px"
              }, children: [
                "• ",
                winnerItem.rarity,
                " UNBOXED! •"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", margin: "20px 0" }, children: renderDropItemIcon(winnerItem, 130) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.8rem", margin: "0 0 10px 0", color: "white" }, children: winnerItem.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "0.85rem", marginBottom: "25px" }, children: winnerItem.type === "coins" ? `Added +${winnerItem.coins} Coins directly to your vault!` : "Permanent cosmetic unlocked for your profile!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                winnerItem.type === "skin" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SquishyButton,
                  {
                    onClick: () => {
                      handleEquipAvatar(winnerItem.img);
                      setShowRewardModal(false);
                    },
                    style: {
                      background: "#00ffcc",
                      color: "#000",
                      padding: "12px",
                      fontWeight: "bold",
                      fontSize: "1rem"
                    },
                    children: "EQUIP AS AVATAR"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SquishyButton,
                  {
                    onClick: () => {
                      setShowRewardModal(false);
                      handleOpenCrate();
                    },
                    style: {
                      background: selectedCrate.color,
                      color: "#000",
                      padding: "12px",
                      fontWeight: "bold",
                      fontSize: "1rem"
                    },
                    children: [
                      "OPEN ANOTHER (",
                      selectedCrate.cost,
                      " COINS)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setShowRewardModal(false),
                    style: {
                      background: "transparent",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      padding: "8px",
                      fontSize: "0.85rem"
                    },
                    children: "CLOSE"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .shake-viewport {
                    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-3px, 0, 0); }
                    20%, 80% { transform: translate3d(5px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
                    40%, 60% { transform: translate3d(6px, 0, 0); }
                }
            ` })
  ] });
};
export {
  HypeDrop as default
};
