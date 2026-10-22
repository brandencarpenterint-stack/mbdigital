import { a as useGamification, d as usePocketBro, c as useToast, r as reactExports, j as jsxRuntimeExports, i as SHOP_ITEMS, u as useRetroSound, l as POCKET_BRO_STAGES, m as motion, P as PocketPet, A as AnimatePresence, t as triggerConfetti, b as SquishyButton, s as supabase, L as Link, n as ADVENTURE_LOCATIONS } from "./index-DJjTZN72.js";
import { D as DECOR_ITEMS, P as PocketRoom } from "./PocketRoom-DMVyyeHz.js";
import { U as UndergroundModal } from "./UndergroundModal-DTGokL1c.js";
import { L as LeaderboardTable } from "./LeaderboardTable-D1PARn5B.js";
import "./LeaderboardService-B1UNsB2r.js";
const PET_ITEMS = [
  { id: "sushi", name: "Premium Sushi", price: 50, icon: "🍣", effect: { hunger: 40, happy: 20, xp: 50 }, desc: "Top tier food." },
  { id: "coffee", name: "Espresso", price: 25, icon: "☕", effect: { energy: 50, wake: true, effect: "jitter" }, desc: "Wakes Bro up instantly!" },
  { id: "chili", name: "Ghost Pepper", price: 40, icon: "🌶️", effect: { hunger: 10, happy: -5, speed: true, effect: "zoom" }, desc: "ZOOMIES!!!" },
  { id: "radio", name: "Boombox", price: 75, icon: "📻", effect: { happy: 40, effect: "dance" }, desc: "Dance party time." },
  { id: "gold_apple", name: "Golden Apple", price: 200, icon: "🍎", effect: { full: true, effect: "shine" }, desc: "Fully restores everything." },
  { id: "soap", name: "Mystic Soap", price: 15, icon: "🧼", effect: { clean: true }, desc: "Instantly destroys messes." },
  { id: "toy", name: "Bouncy Ball", price: 100, icon: "🎾", effect: { happy: 50, xp: 100 }, desc: "HUGE happiness boost!" }
];
const PetShopModal = ({ onClose }) => {
  const { coins, spendCoins, triggerConfetti: triggerConfetti2, shopState, buyItem: buyGItem, equipItem: equipGItem } = useGamification();
  const { feed, play, clean, sleep, triggerEffect, unlockDecor, equipDecor, stats } = usePocketBro();
  const { showToast } = useToast();
  const [tab, setTab] = reactExports.useState("supplies");
  const [showUnderground, setShowUnderground] = reactExports.useState(false);
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const isNight = hour >= 22 || hour <= 4;
  const buyItem = (item) => {
    if (!spendCoins) {
      console.error("spendCoins function not found in context!");
      return;
    }
    if (spendCoins(item.price)) {
      if (item.effect.clean) {
        clean();
        showToast("Squeaky Clean! ✨", "success");
      }
      if (item.effect.wake) {
        sleep();
        triggerEffect("jitter");
      }
      if (item.effect.full) {
        feed(100);
        play(100);
        clean();
        triggerEffect("shine");
      }
      if (item.effect.effect) {
        triggerEffect(item.effect.effect);
      }
      if (item.effect.hunger) feed(item.effect.hunger);
      if (item.effect.happy) play(item.effect.happy);
      showToast(`Bought ${item.name}`, "shop");
    }
  };
  const handleDecorAction = (item) => {
    const isUnlocked = (stats.unlockedDecor || []).includes(item.id);
    if (item.type === "furniture") {
      if (isUnlocked) {
        showToast("Use 'Edit Room' button to place!", "info");
        return;
      }
      if (spendCoins(item.price)) {
        unlockDecor(item.id);
        showToast(`Bought ${item.name}!`, "success");
        if (triggerConfetti2) triggerConfetti2();
      }
      return;
    }
    const isEquipped = stats.decor[item.type] === item.id;
    if (isEquipped) {
      equipDecor(item.type, null);
      showToast("Unequipped!", "success");
      return;
    }
    if (isUnlocked) {
      equipDecor(item.type, item.id);
      showToast("Equipped!", "success");
    } else {
      if (spendCoins(item.price)) {
        unlockDecor(item.id);
        equipDecor(item.type, item.id);
        showToast(`Bought ${item.name}!`, "success");
        if (triggerConfetti2) triggerConfetti2();
      }
    }
  };
  const handleSkinAction = (item) => {
    const isUnlocked = shopState.unlocked.includes(item.id) || item.price === 0;
    const isEquipped = shopState.equipped.pocketbro === item.id;
    if (isEquipped) {
      showToast("Already wearing this!", "info");
      return;
    }
    if (isUnlocked) {
      equipGItem("pocketbro", item.id);
      showToast("Costume changed!", "success");
      if (triggerConfetti2) triggerConfetti2();
    } else {
      if (buyGItem(item)) {
        equipGItem("pocketbro", item.id);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.85)",
    zIndex: 7e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
      width: "90%",
      maxWidth: "400px",
      padding: "20px",
      border: "1px solid var(--neon-blue)",
      boxShadow: "0 0 30px rgba(0, 243, 255, 0.3)",
      position: "relative",
      maxHeight: "90vh",
      overflowY: "auto"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          style: {
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer"
          },
          children: "✕"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { textAlign: "center", color: "var(--neon-blue)", marginTop: 0, marginBottom: "20px" }, children: "POCKET SHOP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", marginBottom: "20px", borderBottom: "1px solid #444", paddingBottom: "10px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("supplies"), style: { flex: 1, padding: "8px", background: tab === "supplies" ? "var(--neon-blue)" : "#333", color: tab === "supplies" ? "black" : "#888", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }, children: "SUPPLIES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("decor"), style: { flex: 1, padding: "8px", background: tab === "decor" ? "#d53f8c" : "#333", color: tab === "decor" ? "white" : "#888", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }, children: "DECOR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("skins"), style: { flex: 1, padding: "8px", background: tab === "skins" ? "gold" : "#333", color: tab === "skins" ? "black" : "#888", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }, children: "SKINS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", marginBottom: "15px", color: "gold", fontWeight: "bold" }, children: [
        "BALANCE: ",
        coins,
        " 🪙"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "10px" }, children: [
        tab === "supplies" && PET_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.1)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: item.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: "#fff" }, children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#aaa" }, children: item.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => buyItem(item), style: { background: "#333", color: "gold", border: "1px solid gold", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", fontWeight: "bold" }, children: [
            item.price,
            " 🪙"
          ] })
        ] }, item.id)),
        tab === "decor" && DECOR_ITEMS.map((item) => {
          const isUnlocked = (stats.unlockedDecor || []).includes(item.id);
          const isEquipped = stats.decor && stats.decor[item.type] === item.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: isEquipped ? "rgba(213, 63, 140, 0.2)" : "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", border: isEquipped ? "1px solid #d53f8c" : "1px solid rgba(255,255,255,0.1)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: "bold", color: isEquipped ? "#d53f8c" : "#fff" }, children: [
                item.name,
                " ",
                isEquipped && "(ON)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#aaa" }, children: item.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDecorAction(item), style: { background: isUnlocked ? isEquipped ? "#d53f8c" : "#333" : "#333", color: isUnlocked ? isEquipped ? "white" : "#fff" : "gold", border: isUnlocked ? isEquipped ? "1px solid white" : "1px solid #fff" : "1px solid gold", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", fontWeight: "bold", minWidth: "80px" }, children: item.type === "furniture" ? isUnlocked ? "OWNED" : `${item.price} 🪙` : isUnlocked ? isEquipped ? "UNEQUIP" : "EQUIP" : `${item.price} 🪙` })
          ] }, item.id);
        }),
        tab === "skins" && SHOP_ITEMS.filter((i) => i.category === "pocketbro").map((item) => {
          const isUnlocked = shopState.unlocked.includes(item.id) || item.price === 0;
          const isEquipped = shopState.equipped.pocketbro === item.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: isEquipped ? "rgba(255, 215, 0, 0.2)" : "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", border: isEquipped ? "1px solid gold" : "1px solid rgba(255,255,255,0.1)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: "bold", color: isEquipped ? "gold" : "#fff" }, children: [
                item.name,
                " ",
                isEquipped && "(ON)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#aaa" }, children: item.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSkinAction(item), style: { background: isUnlocked ? isEquipped ? "gold" : "#333" : "#333", color: isUnlocked ? isEquipped ? "black" : "#fff" : "gold", border: isUnlocked ? isEquipped ? "1px solid white" : "1px solid #fff" : "1px solid gold", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", fontWeight: "bold", minWidth: "80px" }, children: isUnlocked ? isEquipped ? "WEARING" : "WEAR" : `${item.price} 🪙` })
          ] }, item.id);
        })
      ] }),
      isNight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowUnderground(true), style: { background: "transparent", border: "none", color: "#333", cursor: "pointer", fontSize: "0.8rem", animation: "glitch 1s infinite" }, children: "👁️" }) })
    ] }),
    showUnderground && /* @__PURE__ */ jsxRuntimeExports.jsx(UndergroundModal, { onClose: () => setShowUnderground(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes glitch {
                    0% { opacity: 1; transform: translate(0); }
                    20% { opacity: 0.8; transform: translate(-2px, 2px); }
                    40% { opacity: 1; transform: translate(2px, -2px); }
                    60% { opacity: 0.5; transform: translate(0); }
                    80% { opacity: 1; transform: translate(-1px, 1px); color: red; }
                    100% { opacity: 1; transform: translate(0); }
                }
            ` })
  ] });
};
const PET_ACCESSORIES = [
  {
    id: "acc_shades",
    name: "Cyber Shades",
    icon: "🕶️",
    slot: "face",
    price: 500,
    perk: "+5% SWAG HIGH SCORE MULTIPLIER",
    desc: "Polarized mirror-tint shades with built-in HUD telemetry. Maximum Night City swagger.",
    glowColor: "#00f0ff",
    badge: "SWAG BOOST"
  },
  {
    id: "acc_chain",
    name: "Gold Cuban Chain",
    icon: "⛓️",
    slot: "neck",
    price: 1e3,
    perk: "HIGH-ROLLER DRIP: COINS CHIME ON STEPS",
    desc: "Heavy 24k electroplated gold links with diamond-cut cyber medallion that chimes as Bro walks.",
    glowColor: "#ffd700",
    badge: "DRIP AUDIO"
  },
  {
    id: "acc_vr",
    name: "VR Netrunner Visor",
    icon: "🥽",
    slot: "head",
    price: 1500,
    perk: "NETRUNNER RADAR: SWEEPS SCANLINES ACROSS ROOM",
    desc: "Direct optical cyber-feed with active tactical grid projection scanlines.",
    glowColor: "#00ffcc",
    badge: "SCANNER"
  },
  {
    id: "acc_halo",
    name: "Celestial Angel Halo",
    icon: "😇",
    slot: "aura",
    price: 2500,
    perk: "HOLY AURA: +20% HAPPINESS RECOVERY",
    desc: "Forged from pure harmonic plasma. Emits a floating celestial ring of divine light.",
    glowColor: "#ffffff",
    badge: "MYTHIC AURA"
  },
  {
    id: "acc_horns",
    name: "Cyber Oni Horns",
    icon: "😈",
    slot: "aura",
    price: 2500,
    perk: "RAGE AURA: +10% CRASH & MINES MULTIPLIER",
    desc: "Crimson cybernetic horns glowing with overclocked geothermal fire.",
    glowColor: "#ff0055",
    badge: "RAGE AURA"
  }
];
const GRID_COLS = 6;
const GRID_ROWS = 6;
const DIALOGUES = [
  "Hacking Night City mainframe... 💻",
  "Feeling fresh and ready to rumble! ⚡",
  "Did someone say Cyber Crash? 🚀",
  "Got any more pizza in the stash? 🍕",
  "Chilling in the neon penthouse. ✨",
  "Gotta hit high-roller status in the Bunker! 🎲",
  "Watching the flying cars drift by... 🛸"
];
const CyberCrib = ({ onOpenShop, onOpenBattle, onOpenAdventure }) => {
  const {
    stats,
    feed,
    play,
    sleep,
    clean,
    placeItem,
    removeItem,
    interactWithItem,
    equipDecor,
    gainExp,
    equipAccessory
  } = usePocketBro();
  const { shopState, addCoins } = useGamification() || {};
  const equippedSkin = shopState?.equipped?.pocketbro || null;
  const { playClick, playCollect, playZap, playWin } = useRetroSound();
  const { showToast } = useToast() || { showToast: () => {
  } };
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedDecorId, setSelectedDecorId] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [speechIndex, setSpeechIndex] = reactExports.useState(0);
  const [broPos, setBroPos] = reactExports.useState({ x: 2, y: 3 });
  const [isWalking, setIsWalking] = reactExports.useState(false);
  const [petHearts, setPetHearts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % DIALOGUES.length);
    }, 12e3);
    return () => clearInterval(interval);
  }, []);
  const activeBgId = stats.decor?.background || "bg_penthouse";
  const activeBg = DECOR_ITEMS.find((d) => d.id === activeBgId) || DECOR_ITEMS[0];
  const placedItems = stats.placedItems || [];
  const getItemAt = (x, y) => placedItems.find((i) => i.x === x && i.y === y);
  const unlockedIds = stats.unlockedDecor || ["furn_arcade", "furn_pc", "furn_bed", "furn_plant", "furn_pizza", "rug_retro"];
  const availableItems = DECOR_ITEMS.filter((item) => unlockedIds.includes(item.id) || item.price === 0);
  const filteredDecor = availableItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "tech") return ["furn_pc", "furn_arcade", "furn_server", "furn_tv", "furn_hologram", "item_pc"].includes(item.id);
    if (activeTab === "living") return ["furn_bed", "furn_pod", "furn_pizza", "furn_plant", "furn_cat_tree", "furn_duck", "rug_retro", "rug_dance"].includes(item.id);
    if (activeTab === "loot") return ["furn_chest", "furn_whale", "furn_ufo", "furn_robot", "furn_konami", "furn_neon_sign", "furn_turntable"].includes(item.id);
    if (activeTab === "wallpaper") return item.type === "background";
    return true;
  });
  const handleTileClick = (x, y) => {
    playClick();
    if (isEditing) {
      const existing = getItemAt(x, y);
      if (selectedDecorId) {
        const decorDef = DECOR_ITEMS.find((d) => d.id === selectedDecorId);
        if (decorDef?.type === "background") {
          equipDecor("background", selectedDecorId);
          showToast(`Applied ${decorDef.name}!`, "info");
          return;
        }
        if (x === broPos.x && y === broPos.y) {
          setBroPos({ x: (x + 1) % GRID_COLS, y });
        }
        placeItem(selectedDecorId, x, y);
        playCollect();
      } else if (existing) {
        removeItem(x, y);
        showToast("Item removed from crib.", "info");
      }
    } else {
      const existing = getItemAt(x, y);
      if (existing) {
        interactWithItem(existing.id);
        setIsWalking(true);
        setBroPos({ x, y });
        setTimeout(() => setIsWalking(false), 500);
      } else {
        setIsWalking(true);
        setBroPos({ x, y });
        if (stats.equippedAccessory === "acc_chain") {
          playCollect?.();
        }
        setTimeout(() => setIsWalking(false), 400);
      }
    }
  };
  const handlePetBro = (e) => {
    e.stopPropagation();
    playWin();
    playZap();
    triggerConfetti();
    const newHeart = { id: Date.now() + Math.random(), x: Math.random() * 40 - 20 };
    setPetHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setPetHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
    if (play) play(15);
    if (gainExp) gainExp(25);
    showToast("Bro is super happy! (+25 XP)", "win");
  };
  const stageConfig = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES["EGG"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    maxWidth: "1000px",
    margin: "0 auto",
    color: "#fff",
    fontFamily: '"Orbitron", sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(10, 15, 26, 0.85)",
      border: "1px solid rgba(0, 240, 255, 0.3)",
      borderRadius: "20px",
      padding: "16px 20px",
      marginBottom: "16px",
      backdropFilter: "blur(16px)",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "14px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,128,0.2))",
          border: "1px solid #00f0ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          boxShadow: "0 0 15px rgba(0,240,255,0.4)"
        }, children: stageConfig.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, fontSize: "1.2rem", letterSpacing: "1px", color: "#fff" }, children: "POCKET BRO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              background: "#00f0ff",
              color: "#000",
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "0.65rem",
              fontWeight: "900"
            }, children: stats.stage })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.75rem", color: "#94a3b8", fontFamily: "monospace", marginTop: "2px" }, children: [
            "XP: ",
            Math.floor(stats.xp),
            " • TYPE: ",
            stats.type || "SOOT"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: "90px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.68rem", marginBottom: "4px", color: "#ffaa00" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🍗 HUNGER" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(stats.hunger),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${stats.hunger}%`, height: "100%", background: "#ffaa00", borderRadius: "3px" } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: "90px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.68rem", marginBottom: "4px", color: "#ff007f" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "❤️ HAPPY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(stats.happy),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${stats.happy}%`, height: "100%", background: "#ff007f", borderRadius: "3px" } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: "90px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.68rem", marginBottom: "4px", color: "#00ff66" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡ ENERGY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(stats.energy),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${stats.energy}%`, height: "100%", background: "#00ff66", borderRadius: "3px" } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              feed(15);
              playCollect();
            },
            disabled: stats.isSleeping,
            style: {
              background: "rgba(255, 170, 0, 0.15)",
              border: "1px solid #ffaa00",
              color: "#ffaa00",
              padding: "6px 12px",
              borderRadius: "10px",
              cursor: stats.isSleeping ? "not-allowed" : "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            },
            title: "Feed Bro (+Hunger)",
            children: "🍗 FEED"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              sleep();
              playZap();
            },
            style: {
              background: stats.isSleeping ? "rgba(0, 255, 102, 0.2)" : "rgba(0, 240, 255, 0.15)",
              border: stats.isSleeping ? "1px solid #00ff66" : "1px solid #00f0ff",
              color: stats.isSleeping ? "#00ff66" : "#00f0ff",
              padding: "6px 12px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            },
            title: "Sleep / Wake",
            children: stats.isSleeping ? "☀️ WAKE" : "💤 SLEEP"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              clean();
              playCollect();
            },
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            },
            title: "Clean Up Crib",
            children: "🧹 CLEAN"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsEditing(true);
              setActiveTab("wardrobe");
              playClick?.();
            },
            style: {
              background: "linear-gradient(135deg, rgba(255, 0, 127, 0.25), rgba(0, 240, 255, 0.25))",
              border: "1px solid #ff007f",
              color: "#ff88aa",
              padding: "6px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 0 12px rgba(255, 0, 127, 0.4)"
            },
            children: "🥽 WARDROBE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setIsEditing(!isEditing),
            style: {
              background: isEditing ? "linear-gradient(135deg, #ff007f, #ff003c)" : "linear-gradient(135deg, #00f0ff, #0072ff)",
              color: isEditing ? "#fff" : "#000",
              border: "none",
              padding: "6px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "900",
              boxShadow: isEditing ? "0 0 15px rgba(255, 0, 127, 0.5)" : "0 0 15px rgba(0, 240, 255, 0.5)"
            },
            children: isEditing ? "✓ DONE EDITING" : "🛋️ DECORATE CRIB"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      width: "100%",
      borderRadius: "24px",
      overflow: "hidden",
      border: "2px solid rgba(0, 240, 255, 0.4)",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 240, 255, 0.1)",
      background: activeBg?.css?.background || "#090a14"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "relative",
        width: "100%",
        height: "140px",
        borderBottom: "2px solid rgba(0, 240, 255, 0.3)",
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 15, 30, 0.9) 100%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.6
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#00f0ff", letterSpacing: "2px", fontFamily: "monospace" }, children: "SECTOR 7 • LEVEL 88" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.1rem", fontWeight: "bold", color: "#fff", letterSpacing: "1px" }, children: activeBg?.name || "CYBER PENTHOUSE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10, scale: 0.9 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0 },
            style: {
              position: "relative",
              zIndex: 2,
              background: "rgba(0, 0, 0, 0.75)",
              border: "1px solid #00f0ff",
              borderRadius: "16px",
              padding: "8px 16px",
              fontSize: "0.8rem",
              color: "#00ffff",
              fontFamily: "monospace",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.3)"
            },
            children: [
              "💬 ",
              DIALOGUES[speechIndex]
            ]
          },
          speechIndex
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "relative",
        width: "100%",
        minHeight: "440px",
        padding: "30px 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at bottom, rgba(0, 240, 255, 0.1) 0%, rgba(5, 7, 15, 0.95) 70%)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        gap: "8px",
        width: "100%",
        maxWidth: "680px",
        aspectRatio: "1/1",
        position: "relative",
        padding: "10px",
        borderRadius: "18px",
        border: isEditing ? "2px dashed rgba(0, 240, 255, 0.6)" : "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(0, 0, 0, 0.45)",
        boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.8)"
      }, children: [...Array(GRID_ROWS)].map(
        (_, y) => [...Array(GRID_COLS)].map((_2, x) => {
          const placed = getItemAt(x, y);
          const itemDef = placed ? DECOR_ITEMS.find((d) => d.id === placed.id) : null;
          const isBroHere = broPos.x === x && broPos.y === y;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => handleTileClick(x, y),
              style: {
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                background: isEditing ? selectedDecorId ? "rgba(0, 240, 255, 0.08)" : "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.015)",
                border: isEditing ? "1px dashed rgba(0, 240, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isEditing ? "pointer" : placed ? "pointer" : "default",
                transition: "all 0.15s ease"
              },
              onMouseEnter: (e) => {
                if (isEditing) {
                  e.currentTarget.style.background = "rgba(0, 240, 255, 0.2)";
                  e.currentTarget.style.borderColor = "#00f0ff";
                }
              },
              onMouseLeave: (e) => {
                if (isEditing) {
                  e.currentTarget.style.background = selectedDecorId ? "rgba(0, 240, 255, 0.08)" : "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.3)";
                }
              },
              children: [
                itemDef && itemDef.type !== "background" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    whileHover: { scale: 1.15, y: -4 },
                    style: {
                      fontSize: "2.5rem",
                      position: "relative",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "drop-shadow(0 8px 6px rgba(0, 0, 0, 0.7))",
                      ...itemDef.style
                    },
                    title: itemDef.name,
                    children: [
                      itemDef.render || itemDef.icon,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                        position: "absolute",
                        bottom: "-6px",
                        width: "70%",
                        height: "8px",
                        borderRadius: "50%",
                        background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
                        zIndex: -1
                      } })
                    ]
                  }
                ),
                isBroHere && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    onClick: handlePetBro,
                    animate: {
                      y: isWalking ? [-6, 0] : [0, -6, 0],
                      scale: [1, 1.05, 1]
                    },
                    transition: {
                      repeat: Infinity,
                      duration: isWalking ? 0.3 : 2,
                      ease: "easeInOut"
                    },
                    style: {
                      position: "absolute",
                      zIndex: 25,
                      width: "70px",
                      height: "70px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    },
                    title: "Pet PocketBro!",
                    children: [
                      stats.equippedAccessory === "acc_vr" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                        position: "absolute",
                        inset: "-10px",
                        border: "1px solid #00ffcc",
                        borderRadius: "50%",
                        boxShadow: "0 0 15px #00ffcc, inset 0 0 10px #00ffcc",
                        pointerEvents: "none",
                        animation: "spin 4s linear infinite",
                        zIndex: -1
                      } }),
                      stats.equippedAccessory === "acc_halo" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                        position: "absolute",
                        inset: "-15px",
                        background: "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        animation: "breathe 2s ease-in-out infinite",
                        zIndex: -1
                      } }),
                      stats.equippedAccessory === "acc_horns" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                        position: "absolute",
                        inset: "-15px",
                        background: "radial-gradient(circle, rgba(255, 0, 85, 0.45) 0%, transparent 70%)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        animation: "jitter 0.2s infinite",
                        zIndex: -1
                      } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        PocketPet,
                        {
                          type: stats.type || "SOOT",
                          stage: stats.stage,
                          mood: stats.happy < 40 ? "sad" : "happy",
                          isSleeping: stats.isSleeping,
                          skin: equippedSkin,
                          color: stats.color,
                          effect: stats.effect,
                          accessory: stats.equippedAccessory
                        }
                      ),
                      stats.isSleeping && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        position: "absolute",
                        top: "-10px",
                        right: "-5px",
                        fontSize: "1.2rem",
                        animation: "float 2s infinite"
                      }, children: "💤" }),
                      stats.poopCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        position: "absolute",
                        bottom: "-5px",
                        right: "-10px",
                        fontSize: "1.2rem"
                      }, children: "💩" }),
                      petHearts.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.span,
                        {
                          initial: { opacity: 1, y: 0, x: h.x, scale: 0.8 },
                          animate: { opacity: 0, y: -45, scale: 1.4 },
                          transition: { duration: 1.2 },
                          style: {
                            position: "absolute",
                            top: "-15px",
                            fontSize: "1.4rem",
                            pointerEvents: "none"
                          },
                          children: "❤️"
                        },
                        h.id
                      ))
                    ]
                  }
                )
              ]
            },
            `${x}-${y}`
          );
        })
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { y: 80, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 80, opacity: 0 },
          style: {
            background: "rgba(7, 10, 19, 0.95)",
            borderTop: "2px solid #00f0ff",
            padding: "16px 20px",
            backdropFilter: "blur(16px)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", overflowX: "auto", marginBottom: "14px", scrollbarWidth: "none" }, children: [
              [
                { id: "wardrobe", label: "🥽 WARDROBE" },
                { id: "all", label: "🛋️ ALL DECOR" },
                { id: "tech", label: "🕹️ TECH & ARCADES" },
                { id: "living", label: "🛏️ LIVING & PODS" },
                { id: "loot", label: "✨ ADVENTURE LOOT" },
                { id: "wallpaper", label: "🖼️ WALLPAPERS" }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setActiveTab(tab.id),
                    style: {
                      background: isSelected ? "linear-gradient(135deg, #00f0ff, #0072ff)" : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#000" : "#ccc",
                      border: isSelected ? "1px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "6px 14px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    },
                    children: tab.label
                  },
                  tab.id
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSelectedDecorId(null),
                  style: {
                    background: selectedDecorId === null ? "#ff0055" : "rgba(255, 0, 85, 0.15)",
                    border: "1px solid #ff0055",
                    color: selectedDecorId === null ? "#fff" : "#ff88aa",
                    borderRadius: "12px",
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  },
                  children: "🧹 ERASER / REMOVE"
                }
              )
            ] }),
            activeTab === "wardrobe" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              paddingBottom: "8px"
            }, children: PET_ACCESSORIES.map((acc) => {
              const isEquipped = stats.equippedAccessory === acc.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: isEquipped ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                    border: isEquipped ? "2px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isEquipped ? "0 0 15px rgba(0, 240, 255, 0.35)" : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "2rem" }, children: acc.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }, children: acc.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: acc.glowColor, fontFamily: "monospace" }, children: acc.badge })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      background: "rgba(0,0,0,0.5)",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      fontSize: "0.68rem",
                      color: acc.glowColor,
                      fontFamily: "monospace",
                      marginBottom: "10px"
                    }, children: [
                      "⭐ ",
                      acc.perk
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          if (equipAccessory) equipAccessory(acc.id);
                          playZap?.();
                          triggerConfetti();
                          showToast(`${isEquipped ? "Unequipped" : "Equipped"} ${acc.name}!`, "win");
                        },
                        style: {
                          width: "100%",
                          background: isEquipped ? "linear-gradient(135deg, #ff0055, #ff007f)" : "linear-gradient(135deg, #00f0ff, #0072ff)",
                          color: isEquipped ? "#fff" : "#000",
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px",
                          fontSize: "0.75rem",
                          fontWeight: "900",
                          cursor: "pointer",
                          letterSpacing: "1px"
                        },
                        children: isEquipped ? "✓ EQUIPPED (TAP TO REMOVE)" : "⚡ EQUIP ON BRO"
                      }
                    )
                  ]
                },
                acc.id
              );
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "thin"
            }, children: filteredDecor.map((item) => {
              const isSelected = selectedDecorId === item.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setSelectedDecorId(item.id);
                    playClick();
                  },
                  style: {
                    minWidth: "85px",
                    padding: "10px 8px",
                    background: isSelected ? "rgba(0, 240, 255, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    border: isSelected ? "2px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: isSelected ? "0 0 15px rgba(0, 240, 255, 0.4)" : "none",
                    transition: "all 0.15s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.8rem" }, children: item.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                      fontSize: "0.65rem",
                      fontWeight: "bold",
                      color: "#fff",
                      maxWidth: "75px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }, children: item.name })
                  ]
                },
                item.id
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              marginTop: "10px",
              fontSize: "0.72rem",
              color: "#94a3b8",
              fontFamily: "monospace",
              display: "flex",
              justifyContent: "space-between"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SELECT AN ITEM ABOVE, THEN CLICK ANY TILE IN THE ROOM TO PLACE IT." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                placedItems.length,
                " ITEMS PLACED"
              ] })
            ] })
          ]
        }
      ) })
    ] })
  ] });
};
const EVOLUTION_BRANCHES = [
  {
    id: "branch_mech",
    name: "MECHA OVERLORD",
    type: "ROBOT",
    icon: "🤖",
    color: "#00f0ff",
    perk: "+15% CP BOOST IN ALL ARCADE GAMES",
    desc: "Forged from overclocked processors. Gains XP through high scores and typing hacking."
  },
  {
    id: "branch_dragon",
    name: "CYBER DRAGON",
    type: "DINO",
    icon: "🐲",
    color: "#ff0055",
    perk: "+20% MULTIPLIER ON CRASH & COIN DOZER",
    desc: "High-voltage apex predator. Thrives on high stakes and long adventure runs."
  },
  {
    id: "branch_king",
    name: "GOLDEN KING SLIME",
    type: "SLIME",
    icon: "👑",
    color: "#ffd700",
    perk: "+10% CASINO DIVIDENDS & FREE SCRATCH TICKETS",
    desc: "Formed from concentrated Cyber Points and jackpot wins in the Underworld."
  },
  {
    id: "branch_void",
    name: "VOID SPECTER",
    type: "GHOST",
    icon: "👻",
    color: "#a855f7",
    perk: "2X ADVENTURE LOOT DROPS DURING NIGHT HOURS",
    desc: "Phase-shifts between reality and the net. Awakened by midnight operations."
  },
  {
    id: "branch_angel",
    name: "CELESTIAL ARCHON",
    type: "ORB",
    icon: "😇",
    color: "#ffffff",
    perk: "PERMANENT +25% XP GROWTH & INSTANT STAMINA",
    desc: "Pure harmonic energy entity achieved through maximum happiness and immaculate care."
  }
];
const PocketBroEvolutionTree = () => {
  const { stats } = usePocketBro();
  const stageKeys = Object.keys(POCKET_BRO_STAGES);
  const currentIdx = stageKeys.indexOf(stats.stage);
  const currentConfig = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES["EGG"];
  const nextStageKey = stageKeys[currentIdx + 1];
  const nextConfig = nextStageKey ? POCKET_BRO_STAGES[nextStageKey] : null;
  let progressPct = 100;
  if (nextConfig) {
    const span = nextConfig.threshold - currentConfig.threshold;
    const currentInSpan = stats.xp - currentConfig.threshold;
    progressPct = Math.min(100, Math.max(0, currentInSpan / span * 100));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    maxWidth: "920px",
    margin: "0 auto",
    color: "#fff",
    fontFamily: '"Orbitron", sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(168, 85, 247, 0.15))",
      border: "1px solid rgba(0, 240, 255, 0.4)",
      borderRadius: "20px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "#00f0ff", letterSpacing: "2px", fontFamily: "monospace" }, children: "GENETIC MATRIX & EVOLUTIONARY TREE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { margin: "4px 0", fontSize: "1.6rem", color: "#fff", letterSpacing: "1px" }, children: [
            "CURRENT FORM: ",
            currentConfig.name.toUpperCase(),
            " (",
            stats.stage,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.85rem", color: "#94a3b8", fontFamily: "monospace" }, children: [
            "CURRENT XP: ",
            Math.floor(stats.xp),
            " ",
            nextConfig ? `/ ${nextConfig.threshold} XP NEEDED` : "(MAX STAGE ACHIEVED)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: "70px",
          height: "70px",
          borderRadius: "16px",
          background: "rgba(0,0,0,0.5)",
          border: "2px solid #00f0ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)"
        }, children: currentConfig.icon })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px", color: "#cbd5e1", fontFamily: "monospace" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "NEXT EVOLUTION MILESTONE: ",
            nextConfig ? nextConfig.name.toUpperCase() : "PEAK SYNTHESIS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            Math.round(progressPct),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "5px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { width: 0 },
            animate: { width: `${progressPct}%` },
            transition: { duration: 1 },
            style: { height: "100%", background: "linear-gradient(90deg, #00f0ff, #a855f7)", boxShadow: "0 0 10px #00f0ff" }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(10, 15, 26, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "20px",
      padding: "24px",
      marginBottom: "24px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1rem", color: "#00f0ff", margin: "0 0 16px 0", letterSpacing: "1px" }, children: "🧬 EVOLUTION TIMELINE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "12px"
      }, children: stageKeys.map((stageKey, i) => {
        const conf = POCKET_BRO_STAGES[stageKey];
        const isUnlocked = currentIdx >= i;
        const isCurrent = stats.stage === stageKey;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: isCurrent ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(168, 85, 247, 0.2))" : isUnlocked ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.4)",
              border: isCurrent ? "2px solid #00f0ff" : isUnlocked ? "1px solid rgba(255, 255, 255, 0.15)" : "1px dashed #334155",
              borderRadius: "14px",
              padding: "16px 12px",
              textAlign: "center",
              boxShadow: isCurrent ? "0 0 15px rgba(0, 240, 255, 0.4)" : "none",
              opacity: isUnlocked ? 1 : 0.5
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "6px" }, children: conf.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: "bold", color: isCurrent ? "#00f0ff" : "#fff" }, children: conf.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.65rem", color: "#94a3b8", fontFamily: "monospace", marginTop: "4px" }, children: [
                conf.threshold,
                " XP"
              ] })
            ]
          },
          stageKey
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(10, 15, 26, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "20px",
      padding: "24px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1rem", color: "#a855f7", margin: "0 0 16px 0", letterSpacing: "1px" }, children: "⚡ BRANCHING ARCHETYPES & PASSIVE PERKS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }, children: EVOLUTION_BRANCHES.map((branch) => {
        const isMyType = (stats.type || "").includes(branch.type);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            whileHover: { y: -4 },
            style: {
              background: isMyType ? `linear-gradient(135deg, ${branch.color}22, rgba(0,0,0,0.8))` : "rgba(255, 255, 255, 0.03)",
              border: isMyType ? `2px solid ${branch.color}` : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: isMyType ? `0 0 20px ${branch.color}44` : "none",
              position: "relative"
            },
            children: [
              isMyType && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                top: "12px",
                right: "12px",
                background: branch.color,
                color: "#000",
                fontSize: "0.6rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "8px"
              }, children: "ACTIVE CLASS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "2rem" }, children: branch.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: 0, fontSize: "0.95rem", color: branch.color }, children: branch.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.65rem", color: "#94a3b8", fontFamily: "monospace" }, children: [
                    "TYPE: ",
                    branch.type
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${branch.color}44`,
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "0.72rem",
                fontWeight: "bold",
                color: branch.color,
                marginBottom: "10px",
                fontFamily: "monospace"
              }, children: [
                "⭐ ",
                branch.perk
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: "0.78rem", color: "#94a3b8", lineHeight: "1.4", fontFamily: "sans-serif" }, children: branch.desc })
            ]
          },
          branch.id
        );
      }) })
    ] })
  ] });
};
const battleFxSprite = "/assets/battle_effects-C43S6fKL.png";
const VisualEffect = ({ type, onComplete }) => {
  let idx = 0;
  if (type === "WATER" || type === "SLIME") idx = 1;
  if (type === "ELECTRIC" || type === "ROBOT") idx = 2;
  if (type === "GLITCH" || type === "ALIEN") idx = 3;
  if (type === "GHOST") idx = 4;
  reactExports.useEffect(() => {
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px",
    height: "100px",
    pointerEvents: "none",
    zIndex: 9999,
    backgroundImage: `url(${battleFxSprite})`,
    backgroundSize: "500% 100%",
    // 5 frames
    backgroundPosition: `${idx * 25}% 0%`,
    imageRendering: "pixelated",
    animation: "popIn 0.2s"
  } });
};
const ELEMENTS = {
  SOOT: { weak: "SLIME", strong: "GHOST" },
  SLIME: { weak: "ROBOT", strong: "SOOT" },
  ROBOT: { weak: "ALIEN", strong: "SLIME" },
  ALIEN: { weak: "DINO", strong: "ROBOT" },
  DINO: { weak: "GHOST", strong: "ALIEN" },
  GHOST: { weak: "SOOT", strong: "DINO" },
  ORB: { weak: "None", strong: "All" }
  // OP
};
const BOTS = [
  { name: "Rookie Bot", type: "SOOT", stage: "BABY", hp: 100, atk: 10, avatar_url: null },
  { name: "Sludge Bot", type: "SLIME", stage: "CHILD", hp: 150, atk: 15, avatar_url: null },
  { name: "Mecha Bot", type: "ROBOT", stage: "TEEN", hp: 200, atk: 20, avatar_url: null }
];
const BattleArenaModal = ({ onClose }) => {
  const { stats, play } = usePocketBro();
  const { addCoins, userProfile, shopState, incrementStat } = useGamification();
  const { showToast } = useToast();
  const { playFire, playWater, playZap, playGlitch, playGhost, playCrash } = useRetroSound();
  const [opponent, setOpponent] = reactExports.useState(null);
  const [battleLog, setBattleLog] = reactExports.useState([]);
  const [turn, setTurn] = reactExports.useState(0);
  const [myHp, setMyHp] = reactExports.useState(1);
  const [oppHp, setOppHp] = reactExports.useState(1);
  const [battleState, setBattleState] = reactExports.useState("LOBBY");
  const [shake, setShake] = reactExports.useState(null);
  const [visualEffect, setVisualEffect] = reactExports.useState(null);
  const MAX_MY_HP = 100 + stats.xp * 0.1;
  reactExports.useEffect(() => {
    setMyHp(MAX_MY_HP);
  }, [MAX_MY_HP]);
  reactExports.useEffect(() => {
    if (!visualEffect) return;
    const t = visualEffect.type;
    if (t === "SOOT") playFire();
    if (t === "SLIME" || t === "WATER") playWater();
    if (t === "ROBOT" || t === "ELECTRIC") playZap();
    if (t === "ALIEN" || t === "GLITCH") playGlitch();
    if (t === "GHOST") playGhost();
    if (t === "DINO") playCrash();
  }, [visualEffect]);
  const findMatch = async () => {
    setBattleState("SEARCHING");
    let enemy = null;
    if (supabase) {
      try {
        const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, xp, squad").neq("id", userProfile?.id || "000").limit(50);
        if (data && data.length > 0) {
          const randomProfile = data[Math.floor(Math.random() * data.length)];
          const enemyLvl = Math.floor(Math.sqrt(randomProfile.xp / 100)) + 1;
          const enemyHp = 100 + randomProfile.xp * 0.1;
          const enemyAtk = 10 + enemyLvl * 2;
          let type = "SOOT";
          if (randomProfile.squad === "CYBER") type = "ROBOT";
          if (randomProfile.squad === "SOLAR") type = "ALIEN";
          if (randomProfile.squad === "VOID") type = "GHOST";
          enemy = {
            name: randomProfile.display_name,
            type,
            // In v2 we'd fetch their actual pet
            stage: enemyLvl > 10 ? "ADULT" : "CHILD",
            hp: Math.floor(enemyHp),
            maxHp: Math.floor(enemyHp),
            atk: Math.floor(enemyAtk),
            avatar_url: randomProfile.avatar_url
          };
        }
      } catch (e) {
        console.error("Matchmaking failed:", e);
      }
    }
    if (!enemy) {
      const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
      enemy = { ...bot, maxHp: bot.hp };
    }
    setTimeout(() => {
      setOpponent(enemy);
      setOppHp(enemy.hp);
      setMyHp(MAX_MY_HP);
      setBattleState("FIGHT");
      setBattleLog([`MATCH FOUND: VS ${enemy.name}!`, "Battle Started!"]);
      setTurn(1);
    }, 1500);
  };
  reactExports.useEffect(() => {
    if (battleState !== "FIGHT") return;
    const timer = setTimeout(() => {
      resolveTurn();
    }, 1500);
    return () => clearTimeout(timer);
  }, [battleState, turn, myHp, oppHp]);
  const resolveTurn = () => {
    let myDmg = Math.floor(10 + stats.xp * 0.05 + Math.random() * 5);
    userProfile?.unlocked?.includes("furn_konami") || false;
    const myType = stats.type || "SOOT";
    const oppType = opponent.type;
    let advantage = "NEUTRAL";
    if (shopState?.unlocked?.includes("arcade_overclock")) {
      myDmg = Math.floor(myDmg * 1.2);
    }
    if (ELEMENTS[myType]?.strong === oppType) {
      myDmg = Math.floor(myDmg * 1.5);
      advantage = "STRONG";
    } else if (ELEMENTS[myType]?.weak === oppType) {
      myDmg = Math.floor(myDmg * 0.5);
      advantage = "WEAK";
    }
    const newOppHp = Math.max(0, oppHp - myDmg);
    setShake("ENEMY");
    setVisualEffect({ target: "ENEMY", type: myType });
    setTimeout(() => {
      setShake(null);
      setVisualEffect(null);
    }, 300);
    setOppHp(newOppHp);
    let logMsg = `You hit ${opponent.name} for ${myDmg}`;
    if (advantage === "STRONG") logMsg += " (SUPER EFFECTIVE!)";
    if (advantage === "WEAK") logMsg += " (Not very effective...)";
    setBattleLog((prev) => [...prev.slice(-4), logMsg]);
    if (newOppHp <= 0) {
      setBattleState("WIN");
      return;
    }
    setTimeout(() => {
      let oppDmg = Math.floor(opponent.atk + Math.random() * 5);
      if (ELEMENTS[oppType]?.strong === myType) {
        oppDmg = Math.floor(oppDmg * 1.5);
      } else if (ELEMENTS[oppType]?.weak === myType) {
        oppDmg = Math.floor(oppDmg * 0.5);
      }
      const newMyHp = Math.max(0, myHp - oppDmg);
      setShake("PLAYER");
      setVisualEffect({ target: "PLAYER", type: oppType });
      setTimeout(() => {
        setShake(null);
        setVisualEffect(null);
      }, 300);
      setMyHp(newMyHp);
      setBattleLog((prev) => [...prev.slice(-4), `${opponent.name} hits you for ${oppDmg}!`]);
      if (newMyHp <= 0) {
        setBattleState("LOSE");
      } else {
        setTurn((t) => t + 1);
      }
    }, 600);
  };
  const handleWin = () => {
    const reward = opponent.atk * 5;
    addCoins(reward);
    play(20);
    triggerConfetti();
    if (incrementStat) incrementStat("arenaWins");
    showToast(`You Won! +${reward} Coins`, "success");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    zIndex: 9e3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Press Start 2P", cursive'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "red", textShadow: "0 0 20px red", marginBottom: "20px" }, children: "BATTLE ARENA" }),
    battleState === "LOBBY" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: findMatch, style: { padding: "20px 40px", fontSize: "1.2rem", background: "red", border: "4px solid gold" }, children: "FIND MATCH" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: "Searching Global Frequency..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", width: "100%", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardTable, { gameId: "arena_wins" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { marginTop: "20px", background: "transparent", color: "#fff", border: "none" }, children: "EXIT" })
    ] }),
    battleState === "SEARCHING" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "cyan", animation: "pulse 1s infinite" }, children: "SCANNING..." }),
    battleState === "FIGHT" && opponent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: "500px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "40px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          transform: shake === "ENEMY" ? "translate(5px, 0)" : "scale(0.8)",
          transition: "transform 0.1s",
          filter: shake === "ENEMY" ? "brightness(2) saturate(0)" : "none",
          // White flash
          position: "relative"
        }, children: [
          visualEffect?.target === "ENEMY" && /* @__PURE__ */ jsxRuntimeExports.jsx(VisualEffect, { type: visualEffect.type, onComplete: () => {
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem" }, children: opponent.type === "SOOT" ? "🌑" : opponent.type === "SLIME" ? "🟢" : opponent.type === "ROBOT" ? "🤖" : opponent.type === "DINO" ? "🦖" : "👽" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "200px", textAlign: "left" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            opponent.name,
            " LVL ",
            opponent.atk
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "10px", background: "#333", marginTop: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${oppHp / opponent.maxHp * 100}%`, height: "100%", background: "red", transition: "width 0.2s" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            oppHp,
            "/",
            opponent.maxHp
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", color: "yellow", margin: "20px 0" }, children: "VS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "40px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", flexDirection: "row-reverse" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          transform: shake === "PLAYER" ? "translate(-5px, 0) scale(1.2)" : "scale(1.2)",
          transition: "transform 0.1s",
          filter: shake === "PLAYER" ? "brightness(2) saturate(0)" : "none",
          // White flash
          position: "relative"
        }, children: [
          visualEffect?.target === "PLAYER" && /* @__PURE__ */ jsxRuntimeExports.jsx(VisualEffect, { type: visualEffect.type, onComplete: () => {
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PocketPet, { type: stats.type, stage: stats.stage, mood: "happy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "200px", textAlign: "right" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "YOU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "10px", background: "#333", marginTop: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${myHp / MAX_MY_HP * 100}%`, height: "100%", background: "lime", transition: "width 0.2s" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            Math.floor(myHp),
            "/",
            Math.floor(MAX_MY_HP)
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        marginTop: "30px",
        height: "100px",
        background: "#111",
        border: "2px solid #333",
        padding: "10px",
        overflowY: "auto",
        textAlign: "left",
        fontSize: "0.7rem",
        color: "#aaa",
        lineHeight: "1.5"
      }, children: battleLog.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: log }, i)) })
    ] }),
    battleState === "WIN" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "lime", fontSize: "3rem" }, children: "VICTORY!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleWin, style: { background: "lime", color: "black" }, children: "CLAIM LOOT" })
    ] }),
    battleState === "LOSE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "red", fontSize: "3rem" }, children: "DEFEATED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { background: "#333", color: "white" }, children: "RETREAT" })
    ] })
  ] });
};
const TASKS = [
  { id: "feed", icon: "🍗", label: "FEED" },
  { id: "clean", icon: "🧹", label: "CLEAN" },
  { id: "play", icon: "🎾", label: "PLAY" },
  { id: "battle", icon: "⚔️", label: "BATTLE" },
  { id: "shop", icon: "🛍️", label: "SHOP" },
  { id: "sleep", icon: "💤", label: "SLEEP" }
];
const PocketBro = () => {
  const { stats, feed, play, sleep, clean, getMood, placeItem, removeItem, debugUpdate, equipDecor, explore, returnFromExplore, speedUpAdventure } = usePocketBro();
  const { shopState } = useGamification() || {};
  const equippedSkin = shopState?.equipped?.pocketbro || null;
  const getSkinStyles = () => {
    if (equippedSkin === "pb_gold") return { filter: "drop-shadow(0 0 15px gold) sepia(100%) saturate(300%) hue-rotate(5deg)" };
    if (equippedSkin === "pb_cyber") return { filter: "drop-shadow(0 0 10px cyan) hue-rotate(180deg) contrast(150%)", fontFamily: "monospace" };
    if (equippedSkin === "pb_party") return { transform: "scale(1.1) rotate(5deg)" };
    return { filter: "drop-shadow(0 5px 0 rgba(0,0,0,0.2))" };
  };
  const [message, setMessage] = reactExports.useState("I'm here! 🥚");
  const [bounce, setBounce] = reactExports.useState(false);
  const [showShop, setShowShop] = reactExports.useState(false);
  const [showBattle, setShowBattle] = reactExports.useState(false);
  const [showMissionSelect, setShowMissionSelect] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedDecor, setSelectedDecor] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("crib");
  const [isEvolving, setIsEvolving] = reactExports.useState(false);
  const [prevStage, setPrevStage] = reactExports.useState(stats.stage);
  reactExports.useEffect(() => {
    if (stats.stage !== prevStage) {
      setIsEvolving(true);
      setMessage(`What ? Bro is evolving into ${stats.stage} !`);
      setTimeout(() => {
        setPrevStage(stats.stage);
        setIsEvolving(false);
        setMessage(`Bro evolved into ${stats.stage} ! 🎉`);
        triggerConfetti();
      }, 4e3);
    }
  }, [stats.stage, prevStage]);
  const currentStage = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES["EGG"];
  const stageKeys = Object.keys(POCKET_BRO_STAGES);
  const currentIndex = stageKeys.indexOf(stats.stage);
  const nextStageKey = stageKeys[currentIndex + 1];
  const nextStage = nextStageKey ? POCKET_BRO_STAGES[nextStageKey] : null;
  let progress = 100;
  if (nextStage) {
    const range = nextStage.threshold - currentStage.threshold;
    const currentInStage = stats.xp - currentStage.threshold;
    progress = Math.min(currentInStage / range * 100, 100);
  }
  const [miniGame, setMiniGame] = reactExports.useState(null);
  const [rpsState, setRpsState] = reactExports.useState("CHOOSING");
  const [rpsResult, setRpsResult] = reactExports.useState("");
  const handleAction = (task) => {
    triggerBounce();
    if (task.id === "sleep") {
      sleep();
      setMessage(stats.isSleeping ? "Good morning! ☀️" : "Goodnight! 🌙");
      return;
    }
    if (stats.isSleeping) {
      setMessage("Zzz... Wake me up!");
      return;
    }
    if (task.id === "clean") {
      if (stats.poopCount > 0) {
        clean();
        setMessage("Much better! ✨");
        triggerConfetti();
      } else {
        setMessage("It's already clean! ✨");
      }
    } else if (task.id === "shop") {
      setShowShop(true);
    } else if (task.id === "battle") {
      setShowBattle(true);
    } else if (task.id === "feed") {
      feed();
      setMessage("Yum! 😋");
      triggerConfetti();
    } else if (task.id === "play") {
      setMiniGame("rps");
      setRpsState("CHOOSING");
      setMessage("Let's Play RPS! 👊✋✌️");
    }
  };
  const handlePet = () => {
    if (stats.isSleeping) return;
    triggerBounce();
    play(2);
    setMessage("He likes that! ❤️");
  };
  const playRPS = (choice) => {
    const options = ["rock", "paper", "scissors"];
    const botChoice = options[Math.floor(Math.random() * options.length)];
    let result = "draw";
    if (choice === "rock" && botChoice === "scissors" || choice === "paper" && botChoice === "rock" || choice === "scissors" && botChoice === "paper") {
      result = "win";
    } else if (choice !== botChoice) {
      result = "lose";
    }
    setRpsResult({ user: choice, bot: botChoice, outcome: result });
    setRpsState("RESULT");
    if (result === "win") {
      play(40);
      setMessage("YOU WIN! 🎉 +40 Happy");
      triggerConfetti();
    } else if (result === "draw") {
      play(10);
      setMessage("DRAW! 🤝 +10 Happy");
    } else {
      play(5);
      setMessage("I WIN! 😜 +5 Happy");
    }
  };
  const triggerBounce = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 500);
  };
  const getAnimationClass = () => {
    if (isEvolving) return "";
    if (stats.tempStatus === "jitter") return "jitter";
    if (stats.tempStatus === "dance") return "dance";
    if (stats.tempStatus === "zoom") return "zoom";
    if (stats.isSleeping) return "breathe";
    if (bounce) return "bounce";
    return "idle";
  };
  const bgItem = DECOR_ITEMS.find((i) => i.id === stats.decor?.background);
  const unlockedDecorItems = DECOR_ITEMS.filter((item) => (stats.unlockedDecor || []).includes(item.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    background: stats.tempStatus === "shine" ? "radial-gradient(circle, gold, #222)" : "transparent",
    // Transparency allows global CosmicBackground
    transition: "background 1s",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "100px",
    fontFamily: '"Press Start 2P", monospace'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "var(--neon-blue)",
        color: "black",
        padding: "5px 20px",
        borderRadius: "20px",
        marginBottom: "20px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        boxShadow: "0 0 20px var(--neon-blue)"
      }, children: "POCKET BRO v3.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        background: "rgba(10, 15, 26, 0.85)",
        border: "1px solid rgba(0, 240, 255, 0.3)",
        borderRadius: "16px",
        padding: "6px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setViewMode("crib"),
            style: {
              background: viewMode === "crib" ? "linear-gradient(135deg, #00f0ff, #0072ff)" : "transparent",
              color: viewMode === "crib" ? "#000" : "#ccc",
              border: "none",
              borderRadius: "12px",
              padding: "8px 18px",
              fontSize: "0.78rem",
              fontWeight: "900",
              cursor: "pointer",
              boxShadow: viewMode === "crib" ? "0 0 16px rgba(0, 240, 255, 0.4)" : "none",
              fontFamily: '"Orbitron", sans-serif'
            },
            children: "🏠 2D CYBER CRIB"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setViewMode("tree"),
            style: {
              background: viewMode === "tree" ? "linear-gradient(135deg, #a855f7, #ec4899)" : "transparent",
              color: viewMode === "tree" ? "#000" : "#ccc",
              border: "none",
              borderRadius: "12px",
              padding: "8px 18px",
              fontSize: "0.78rem",
              fontWeight: "900",
              cursor: "pointer",
              boxShadow: viewMode === "tree" ? "0 0 16px rgba(168, 85, 247, 0.4)" : "none",
              fontFamily: '"Orbitron", sans-serif'
            },
            children: "🧬 EVOLUTION TREE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setViewMode("deck"),
            style: {
              background: viewMode === "deck" ? "linear-gradient(135deg, #ffd700, #ffaa00)" : "transparent",
              color: viewMode === "deck" ? "#000" : "#ccc",
              border: "none",
              borderRadius: "12px",
              padding: "8px 18px",
              fontSize: "0.78rem",
              fontWeight: "900",
              cursor: "pointer",
              boxShadow: viewMode === "deck" ? "0 0 16px rgba(255, 215, 0, 0.4)" : "none",
              fontFamily: '"Orbitron", sans-serif'
            },
            children: "📟 RETRO DECK"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: "8px",
        marginBottom: "18px",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "360px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 229, 255, 0.15)",
          border: "1px solid #00e5ff",
          color: "#00e5ff",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "◄ ARCADE" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/derby", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 255, 102, 0.15)",
          border: "1px solid #00ff66",
          color: "#00ff66",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🏇 DERBY TRACK" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/blackjack", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(255, 215, 0, 0.15)",
          border: "1px solid #ffd700",
          color: "#ffd700",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🃏 CYBER 21" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/underworld", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(255, 0, 127, 0.15)",
          border: "1px solid #ff007f",
          color: "#ff88aa",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🔓 THE VAULT" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/pinball", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 229, 255, 0.15)",
          border: "1px solid #00e5ff",
          color: "#66eeff",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "⚡ PINBALL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/crash", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(255, 0, 85, 0.15)",
          border: "1px solid #ff0055",
          color: "#ff88aa",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🚀 CRASH" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/roulette", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 255, 102, 0.15)",
          border: "1px solid #00ff66",
          color: "#66ffaa",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🎡 ROULETTE" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/mines", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 229, 255, 0.15)",
          border: "1px solid #00e5ff",
          color: "#66eeff",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "💎 MINES" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/scratchers", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(255, 215, 0, 0.15)",
          border: "1px solid #ffd700",
          color: "#ffe066",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🎟️ SCRATCH" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/dozer", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 229, 255, 0.15)",
          border: "1px solid #00e5ff",
          color: "#00ffff",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🪙 DOZER" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade/hilo", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          background: "rgba(0, 255, 102, 0.15)",
          border: "1px solid #00ff66",
          color: "#66ffaa",
          borderRadius: "16px",
          padding: "5px 12px",
          fontSize: "0.72rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }, children: "🃏 HI-LO" }) })
      ] }),
      viewMode === "crib" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", maxWidth: "980px", marginTop: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CyberCrib,
        {
          onOpenShop: () => setShowShop(true),
          onOpenBattle: () => setShowBattle(true),
          onOpenAdventure: () => setShowMissionSelect(true)
        }
      ) }),
      viewMode === "tree" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", maxWidth: "980px", marginTop: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PocketBroEvolutionTree, {}) }),
      viewMode === "deck" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        width: "320px",
        background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
        borderRadius: "40px",
        padding: "25px",
        boxShadow: "0 50px 100px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)",
        border: "1px solid #333",
        position: "relative"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: bgItem ? bgItem.className : "", style: {
          height: "320px",
          background: bgItem ? bgItem.css.background : "#8b9bb4",
          // LCD Base Color
          // Default to Scanlines if no BG, otherwise use BG css
          backgroundImage: bgItem ? bgItem.css.backgroundImage : "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: bgItem ? void 0 : "100% 2px, 3px 100%",
          // Scanline size
          borderRadius: "15px",
          border: "6px solid #111",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }, children: [
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#333", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "STAGE: ",
              stats.stage
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "XP: ",
              Math.floor(stats.xp)
            ] })
          ] }),
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${stats.happy}% `, height: "100%", background: "#ff0055", borderRadius: "4px" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${stats.hunger}% `, height: "100%", background: "#ffaa00", borderRadius: "4px" } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, position: "relative" }, children: [
            stats.adventure?.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  triggerBounce();
                  triggerConfetti();
                  speedUpAdventure(10);
                },
                style: {
                  position: "absolute",
                  inset: 0,
                  zIndex: 60,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: stats.adventure.locationId === "space_port" ? "bg-space" : "bg-cyber", style: {
                    position: "absolute",
                    inset: 0,
                    animation: "gridMove 2s linear infinite",
                    // Scroll effect
                    opacity: 0.5
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    position: "absolute",
                    top: "20px",
                    left: "10px",
                    right: "10px",
                    height: "60px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    fontSize: "0.6rem",
                    color: "lime",
                    fontFamily: "monospace",
                    textShadow: "1px 1px 0 black",
                    pointerEvents: "none"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: 0.5 }, children: "Checking radar..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: 0.8 }, children: "Path looks clear." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontWeight: "bold" }, children: [
                      "> Exploring ",
                      stats.adventure.name,
                      "..."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    marginBottom: "60px",
                    animation: "walkBob 0.6s infinite alternate",
                    transform: "scale(0.8)",
                    filter: "drop-shadow(0 10px 5px rgba(0,0,0,0.5))"
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PocketPet,
                    {
                      type: stats.type || "SOOT",
                      mood: "happy",
                      isSleeping: false,
                      stage: stats.stage,
                      skin: equippedSkin,
                      accessory: stats.equippedAccessory
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    width: "100%",
                    padding: "10px",
                    background: "rgba(0,0,0,0.8)",
                    borderTop: "2px solid #555",
                    color: "white",
                    textAlign: "center",
                    zIndex: 70
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", marginBottom: "5px" }, children: stats.adventure.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: stats.adventure.finishTime - Date.now() < 0 ? "lime" : "gold"
                    }, children: [
                      Math.max(0, Math.ceil((stats.adventure.finishTime - Date.now()) / 1e3)),
                      "s"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#aaa" }, children: "TAP TO HUSTLE! 👟" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                                        @keyframes walkBob {
                                            0% { transform: translateY(0) scale(0.8); }
                                            100% { transform: translateY(-10px) scale(0.8); }
                                        }
                                    ` })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PocketRoom,
              {
                isEditing,
                selectedItem: selectedDecor,
                onPlace: (id, x, y) => placeItem(id, x, y)
              }
            ) }),
            !stats.adventure?.active && miniGame === "rps" ? (
              // Only show RPS if not exploring
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                inset: 0,
                zIndex: 50,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", width: "100%" }, children: rpsState === "CHOOSING" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => playRPS("rock"), style: { fontSize: "2rem", padding: "10px", background: "#ddd", border: "2px solid #333", cursor: "pointer" }, children: "👊" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => playRPS("paper"), style: { fontSize: "2rem", padding: "10px", background: "#ddd", border: "2px solid #333", cursor: "pointer" }, children: "✋" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => playRPS("scissors"), style: { fontSize: "2rem", padding: "10px", background: "#ddd", border: "2px solid #333", cursor: "pointer" }, children: "✌️" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem", color: "white" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "20px", fontSize: "2rem" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "You",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    rpsResult.user === "rock" ? "👊" : rpsResult.user === "paper" ? "✋" : "✌️"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { alignSelf: "center" }, children: "VS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Bro",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    rpsResult.bot === "rock" ? "👊" : rpsResult.bot === "paper" ? "✋" : "✌️"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRpsState("CHOOSING"), style: { marginRight: "10px", cursor: "pointer", padding: "5px 10px" }, children: "Rematch ↺" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMiniGame(null), style: { cursor: "pointer", padding: "5px 10px" }, children: "Done ✅" })
                ] })
              ] }) }) })
            ) : !stats.adventure?.active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: isEditing ? null : handlePet,
                style: {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: isEditing ? "default" : "pointer",
                  zIndex: 20
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    transform: bounce ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    animation: `${getAnimationClass()} ${stats.tempStatus === "zoom" ? "0.5s" : "2s"} infinite`,
                    filter: isEvolving ? "brightness(100) drop-shadow(0 0 20px white)" : stats.tempStatus === "shine" ? "drop-shadow(0 0 20px gold)" : stats.tempStatus === "zoom" ? "hue-rotate(90deg)" : "none",
                    ...getSkinStyles()
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PocketPet,
                    {
                      type: stats.type || "SOOT",
                      mood: stats.happy < 40 || stats.poopCount > 0 ? "sad" : "happy",
                      isSleeping: stats.isSleeping,
                      stage: isEvolving ? prevStage : stats.stage,
                      skin: equippedSkin,
                      accessory: stats.equippedAccessory
                    }
                  ) }),
                  stats.poopCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    fontSize: "2rem",
                    animation: "shake 2s infinite",
                    filter: "drop-shadow(0 0 5px brown)"
                  }, children: "💩" }),
                  stats.isSleeping && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 0, right: 0, fontSize: "1.5rem", animation: "float 2s infinite" }, children: "💤" })
                ]
              }
            )
          ] }),
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#555", marginBottom: "2px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EVOLUTION" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: nextStage ? `${Math.floor(progress)}% ` : "MAX" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "3px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: `${progress}% `,
              height: "100%",
              background: "linear-gradient(90deg, #00C6FF, #0072FF)",
              borderRadius: "3px",
              transition: "width 0.5s"
            } }) })
          ] }),
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "10px", minHeight: "1.2em", color: "#333", fontSize: "0.7rem" }, children: message }),
          isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "10px", color: "#555", fontSize: "0.6rem" }, children: "Click grid to place items. Center is reserved." })
        ] }),
        isEditing ? (
          // EDITOR DOCK
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", background: "#333", padding: "10px", borderRadius: "15px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "thin" }, children: [
              unlockedDecorItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem", padding: "10px" }, children: "No furniture! Visit Shop." }),
              unlockedDecorItems.map((item) => {
                const isEquippedBg = stats.decor?.background === item.id;
                const isSelected = selectedDecor === item.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      if (item.type === "background") {
                        equipDecor("background", item.id);
                      } else {
                        setSelectedDecor(item.id);
                      }
                    },
                    style: {
                      minWidth: "50px",
                      height: "50px",
                      border: isSelected || isEquippedBg ? "2px solid gold" : "1px solid #555",
                      background: isEquippedBg ? "var(--neon-blue)" : "#222",
                      borderRadius: "5px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative"
                    },
                    children: [
                      item.icon,
                      item.type === "background" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", bottom: 2, right: 2, fontSize: "0.5rem" }, children: "BG" })
                    ]
                  },
                  item.id
                );
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "10px", borderTop: "1px solid #444", paddingTop: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedDecor(null), style: { background: "#444", border: "none", color: "white", padding: "5px 10px", borderRadius: "5px", fontSize: "0.7rem" }, children: "Eraser 🧹" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(false), style: { background: "var(--neon-blue)", border: "none", color: "black", padding: "5px 15px", borderRadius: "5px", fontWeight: "bold" }, children: "DONE" })
            ] })
          ] })
        ) : (
          // NORMAL CONTROLS
          /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }, children: TASKS.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleAction(task),
                disabled: stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep",
                style: {
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "none",
                  background: stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep" ? "#333" : "#e0e0e0",
                  boxShadow: stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep" ? "none" : "0 6px 0 #999",
                  fontSize: "1.8rem",
                  cursor: stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep" ? "not-allowed" : "pointer",
                  opacity: stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep" ? 0.5 : 1,
                  transform: "translateY(0)",
                  transition: "transform 0.1s, box-shadow 0.1s"
                },
                onMouseDown: (e) => {
                  if (stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep") return;
                  e.currentTarget.style.transform = "translateY(6px)";
                  e.currentTarget.style.boxShadow = "none";
                },
                onMouseUp: (e) => {
                  if (stats.adventure?.active || miniGame || stats.isSleeping && task.id !== "sleep") return;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 0 #999";
                },
                children: task.icon
              },
              task.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "20px" }, children: stats.adventure?.active ? (
              // ACTIVE ADVENTURE VIEW
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "10px", border: "1px solid #555" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "🚀 ",
                  stats.adventure.name || "EXPLORING",
                  "..."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#aaa" }, children: [
                  "Back in ",
                  Math.max(0, (stats.adventure.finishTime - Date.now()) / 6e4).toFixed(0),
                  "m"
                ] }),
                Date.now() > stats.adventure.finishTime && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      const loot = returnFromExplore();
                      if (loot) {
                        setMessage(`Found ${loot.coins} Coins & ${loot.items.length} Items!`);
                        triggerConfetti();
                      }
                    },
                    style: { background: "lime", color: "black", border: "none", padding: "5px 15px", borderRadius: "5px", marginTop: "5px", fontWeight: "bold" },
                    children: "CLAIM REWARDS 🎁"
                  }
                )
              ] })
            ) : showMissionSelect ? (
              // MISSION SELECTOR
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                background: "#222",
                borderTop: "2px solid #555",
                padding: "15px",
                borderRadius: "20px 20px 0 0",
                zIndex: 80,
                maxHeight: "250px",
                overflowY: "auto"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "white", fontWeight: "bold" }, children: "SELECT MISSION" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowMissionSelect(false), style: { background: "transparent", border: "none", color: "red", cursor: "pointer" }, children: "✖" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: ADVENTURE_LOCATIONS.map((loc) => {
                  const currentStageIdx = Object.keys(POCKET_BRO_STAGES).indexOf(stats.stage);
                  const requiredStageIdx = Object.keys(POCKET_BRO_STAGES).indexOf(loc.minStage);
                  const isLocked = currentStageIdx < requiredStageIdx;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      disabled: isLocked,
                      onClick: () => {
                        explore(loc.id);
                        setShowMissionSelect(false);
                        setMessage(`Off to ${loc.name}!`);
                      },
                      style: {
                        background: isLocked ? "#333" : "#444",
                        border: "1px solid #555",
                        padding: "10px",
                        borderRadius: "8px",
                        textAlign: "left",
                        cursor: isLocked ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        opacity: isLocked ? 0.6 : 1
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: loc.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: isLocked ? "#888" : "white", fontWeight: "bold", fontSize: "0.8rem" }, children: loc.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: "0.6rem" }, children: [
                            loc.durationMinutes,
                            "m • ",
                            loc.description
                          ] })
                        ] }),
                        isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "red" }, children: [
                          "🔒 ",
                          loc.minStage,
                          "+"
                        ] })
                      ]
                    },
                    loc.id
                  );
                }) })
              ] })
            ) : (
              // LAUNCH BUTTON
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowMissionSelect(true),
                  style: { background: "var(--neon-pink)", border: "none", color: "white", padding: "10px 20px", borderRadius: "25px", fontSize: "0.9rem", fontWeight: "bold", boxShadow: "0 0 10px var(--neon-pink)", cursor: "pointer" },
                  children: "🌍 ADVENTURE"
                }
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setIsEditing(true),
                disabled: stats.adventure?.active,
                style: { background: "transparent", border: "1px solid #555", color: "#777", fontSize: "0.7rem", padding: "5px 10px", borderRadius: "20px", cursor: stats.adventure?.active ? "not-allowed" : "pointer", opacity: stats.adventure?.active ? 0.3 : 1 },
                children: "🛋️ EDIT ROOM"
              }
            ) })
          ] })
        )
      ] })
    ] }),
    showShop && /* @__PURE__ */ jsxRuntimeExports.jsx(PetShopModal, { onClose: () => setShowShop(false) }),
    showBattle && /* @__PURE__ */ jsxRuntimeExports.jsx(BattleArenaModal, { onClose: () => setShowBattle(false) }),
    isEvolving && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
      zIndex: 100,
      pointerEvents: "none",
      animation: "flash 4s ease-in-out"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
@keyframes flash {
    0 % { opacity: 0; }
    20 % { opacity: 1; }
    50 % { opacity: 0.5; }
    80 % { opacity: 1; filter: brightness(2); }
    100 % { opacity: 0; }
}
@keyframes jitter {
    0 % { transform: translate(0, 0); }
    25 % { transform: translate(2px, 2px); }
    50 % { transform: translate(-2px, -2px); }
    75 % { transform: translate(2px, -2px); }
    100 % { transform: translate(0, 0); }
}
@keyframes dance {
    0 %, 100 % { transform: translateY(0) rotate(0deg); }
    25 % { transform: translateY(-10px) rotate(- 10deg); }
    75 % { transform: translateY(-5px) rotate(10deg); }
}
@keyframes zoom {
    0 % { transform: translateX(-100px); }
    50 % { transform: translateX(100px); }
    100 % { transform: translateX(-100px); }
}
@keyframes idle {
    0 %, 100 % { transform: translateY(0); }
    50 % { transform: translateY(-5px); }
}
@keyframes breathe {
    0 %, 100 % { transform: scale(1); opacity: 0.8; }
    50 % { transform: scale(1.05); opacity: 1; }
}
@keyframes float {
    0 %, 100 % { transform: translateY(0); }
    50 % { transform: translateY(-10px); }
}

/* --- ANIMATED BACKGROUNDS --- */
.bg-space::before {
    content: ''; position: absolute; inset: 0;
    background-image: 
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
    background-size: 550px 550px, 350px 350px, 250px 250px;
    background-position: 0 0, 40px 60px, 130px 270px;
    animation: stars 60s linear infinite;
    z-index: 1; opacity: 0.8;
}
.bg-space::after {
    content: ''; position: absolute; top: -50px; left: -50px;
    width: 60px; height: 2px;
    background: linear-gradient(90deg, transparent, white);
    box-shadow: 0 0 10px white;
    transform-origin: right;
    animation: shootingStar 8s linear infinite;
    z-index: 2;
}

/* --- CYBER CITY --- */
.bg-cyber {
    background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
}
.bg-cyber::before {
    /* Grid */
    content: ''; position: absolute; inset: 0;
    background: 
        linear-gradient(transparent 95%, rgba(0,255,255,0.3) 95%),
        linear-gradient(90deg, transparent 95%, rgba(0,255,255,0.3) 95%);
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg) translateY(100px) scale(2);
    opacity: 0.5;
    z-index: 1;
}
.bg-cyber::after {
    /* City Outline */
    content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 120px;
    background-image: linear-gradient(to top, #000 80%, transparent 100%);
    clip-path: polygon(
        0% 100%, 10% 100%, 10% 60%, 15% 60%, 15% 80%, 20% 80%, 20% 40%, 30% 40%, 30% 70%, 40% 70%, 40% 30%, 50% 30%, 50% 80%, 60% 80%, 60% 50%, 70% 50%, 70% 90%, 80% 90%, 80% 40%, 90% 40%, 90% 100%, 100% 100%
    );
    z-index: 2;
}

/* --- ZEN DOJO --- */
.bg-dojo {
    background: linear-gradient(to bottom, #ff7e5f, #feb47b); /* Sunset */
}
.bg-dojo::before {
    /* Sun */
    content: ''; position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%);
    width: 150px; height: 150px;
    background: linear-gradient(to bottom, #ff0000, #990000);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255,0,0,0.5);
    z-index: 1;
}
.bg-dojo::after {
    /* Torii Gate Silhouette */
    content: ''; position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 140px;
    background: black;
    clip-path: polygon(
        10% 0%, 90% 0%, 100% 10%, 90% 15%, 85% 15%, 85% 30%, 80% 30%, 80% 15%, 
        20% 15%, 20% 30%, 15% 30%, 15% 15%, 10% 15%, 0% 10%, 10% 0%,
        /* Posts */
        15% 15%, 15% 100%, 25% 100%, 25% 40%, 75% 40%, 75% 100%, 85% 100%, 85% 15%
    );
    z-index: 2;
}

.bg-abyss {
    background: linear-gradient(#000, #001e36);
}
.bg-abyss::before {
    content: '🫧'; position: absolute; bottom: -20px; left: 20%;
    animation: bubbleUp 4s infinite; font-size: 20px; z-index: 1;
}
.bg-abyss::after {
    content: '🫧'; position: absolute; bottom: -20px; right: 30%;
    animation: bubbleUp 6s infinite 1s; font-size: 15px; z-index: 1;
}

.bg-magma {
    background: #300;
}
.bg-magma::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle, transparent 20%, #000 120%);
    animation: pulseHeat 2s infinite alternate;
    z-index: 1;
}

@keyframes stars { from { transform: translateY(0); } to { transform: translateY(550px); } }
@keyframes shootingStar { 0% { transform: translate(0,0) rotate(45deg); opacity: 1; } 20% { transform: translate(400px, 400px) rotate(45deg); opacity: 0; } 100% { opacity: 0; } }
@keyframes gridMove { from { background-position: 0 0; } to { background-position: 0 40px; } }
@keyframes bubbleUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-400px); opacity: 0; } }
@keyframes pulseHeat { from { opacity: 0.2; } to { opacity: 0.6; background-color: #f00; } }

` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "50px", opacity: 0.1, hover: { opacity: 1 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "🧬 DEV LABS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.8)", padding: "10px", borderRadius: "10px", fontSize: "0.7rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Override Species:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: ["SOOT", "SLIME", "ROBOT", "GHOST"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => debugUpdate({ type: t }), style: { padding: "5px", cursor: "pointer" }, children: t }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Override Stage:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: ["EGG", "BABY", "CHILD", "TEEN", "ADULT"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => debugUpdate({ stage: s }), style: { padding: "5px", cursor: "pointer" }, children: s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Note: Renders immediately, logic may overwrite on next tick if XP not matching." })
      ] })
    ] }) })
  ] });
};
export {
  PocketBro as default
};
