import { b as useGamification, a as usePocketBro, g as useToast, r as reactExports, j as jsxRuntimeExports, t as triggerConfetti, e as SHOP_ITEMS, h as POCKET_BRO_STAGES, P as PocketPet, i as ADVENTURE_LOCATIONS } from "./index-CK8jA7WB.js";
import { D as DECOR_ITEMS, P as PocketRoom } from "./PocketRoom-BgeAGv6D.js";
const UNDERGROUND_ITEMS = [
  {
    id: "void_essence",
    name: "Void Essence",
    price: 500,
    icon: "⚫",
    desc: "Consume to become one with the void. (Ghost Mode)",
    effect: { effect: "ghost", duration: 3e4 }
  },
  {
    id: "glitch_pill",
    name: "Glitch Pill",
    price: 100,
    icon: "💊",
    desc: "Randomizes all stats. Feeling lucky?",
    effect: { type: "gamble" }
  },
  {
    id: "cursed_idol",
    name: "Cursed Idol",
    price: 666,
    icon: "🗿",
    desc: "Sacrifice Happiness for Wealth.",
    effect: { type: "sacrifice", happy: -50, coins: 1e3 }
  },
  {
    id: "hack_tool",
    name: "Zero Day Exploit",
    price: 1337,
    icon: "💾",
    desc: 'Unlocks the secret "Hacker" skin.',
    effect: { unlockSkin: "pb_cyber" }
  },
  {
    id: "midnight_oil",
    name: "Midnight Oil",
    price: 200,
    icon: "🛢️",
    desc: "Max Energy, but creates a mess.",
    effect: { energy: 100, hygiene: -100 }
  }
];
const UndergroundModal = ({ onClose }) => {
  const { coins, spendCoins, unlockHiddenItem } = useGamification();
  const { feed, play, clean, triggerEffect, stats } = usePocketBro();
  const { showToast } = useToast();
  const [glitchTitle, setGlitchTitle] = reactExports.useState("THE VOID");
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      if (Math.random() > 0.8) {
        setGlitchTitle((prev) => prev.split("").map((c) => Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c).join(""));
        setTimeout(() => setGlitchTitle("THE VOID"), 100);
      }
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  const buyIllegalItem = (item) => {
    if (spendCoins(item.price)) {
      if (item.id === "void_essence") {
        triggerEffect("ghost", 3e4);
        showToast("You feel... transparent.", "magic");
      } else if (item.id === "glitch_pill") {
        triggerEffect("jitter", 5e3);
        triggerEffect("zoom", 5e3);
        if (Math.random() > 0.5) {
          play(50);
          showToast("EUPHORIA!", "success");
        } else {
          play(-20);
          showToast("Bad trip...", "error");
        }
      } else if (item.id === "hack_tool") {
        unlockHiddenItem("pb_cyber");
        showToast("SYSTEM BREACH: Cyber Skin Unlocked.", "success");
        triggerConfetti();
      } else if (item.id === "cursed_idol") {
        play(-50);
        showToast("The Idol stares into your soul...", "error");
        triggerEffect("shine", 2e4);
      } else if (item.id === "midnight_oil") {
        triggerEffect("jitter");
        clean();
        showToast("Burning the midnight oil!", "success");
      }
    } else {
      showToast("Your funds are insufficient for this transaction.", "error");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.95)",
    zIndex: 8e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    fontFamily: "monospace"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    width: "90%",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid red",
    boxShadow: "0 0 50px rgba(255, 0, 0, 0.4)",
    background: "#000",
    position: "relative",
    color: "red"
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
          color: "red",
          fontSize: "1.5rem",
          cursor: "pointer"
        },
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
      textAlign: "center",
      margin: "0 0 20px 0",
      textShadow: "2px 2px 0px blue",
      letterSpacing: "5px"
    }, children: glitchTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", marginBottom: "20px", color: "#666" }, children: [
      "CRYPTO: ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "red", marginLeft: "10px" }, children: [
        coins,
        " 🪙"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "15px" }, children: UNDERGROUND_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      border: "1px dashed #333",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      background: "#0a0a0a"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", filter: "grayscale(100%) contrast(150%)" }, children: item.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: "bold" }, children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#444", fontSize: "0.7rem" }, children: item.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => buyIllegalItem(item),
          style: {
            background: "transparent",
            border: "1px solid red",
            color: "red",
            padding: "5px 10px",
            cursor: "pointer",
            fontFamily: "monospace"
          },
          children: item.price
        }
      )
    ] }, item.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", textAlign: "center", fontSize: "0.6rem", color: "#333" }, children: "NO REFUNDS. NO WITNESSES." })
  ] }) });
};
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
const TASKS = [
  { id: "feed", icon: "🍗", label: "FEED" },
  { id: "clean", icon: "🧹", label: "CLEAN" },
  { id: "play", icon: "🎾", label: "PLAY" },
  { id: "shop", icon: "🛍️", label: "SHOP" },
  { id: "sleep", icon: "💤", label: "SLEEP" }
];
const PocketBro = () => {
  const { stats, feed, play, sleep, clean, getMood, placeItem, removeItem, debugUpdate, equipDecor, explore, returnFromExplore } = usePocketBro();
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
  const [showMissionSelect, setShowMissionSelect] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedDecor, setSelectedDecor] = reactExports.useState(null);
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
            stats.adventure?.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "lime",
              fontFamily: "monospace"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", animation: "spin 2s infinite linear" }, children: "🌍" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", letterSpacing: "2px" }, children: "SCAVENGING..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                marginTop: "10px",
                width: "80%",
                height: "4px",
                background: "#333",
                overflow: "hidden",
                borderRadius: "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "50%",
                height: "100%",
                background: "lime",
                animation: "scan 2s infinite ease-in-out"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                                        @keyframes spin { 100% { transform: rotate(360deg); } }
                                        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                                    ` })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                      skin: equippedSkin
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

.bg-city {
    background: linear-gradient(180deg, #10002b 0%, #240046 60%, #ff0 60.5%, #3c096c 61%, #5a189a 100%);
    position: relative;
    overflow: hidden;
}
.bg-city::before {
    content: ''; position: absolute; inset: 0;
    background: 
        linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px),
        linear-gradient(rgba(255,0,255,0.3) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(300px) rotateX(60deg) translateY(100px) translateZ(-100px);
    animation: gridMove 2s linear infinite;
    z-index: 1;
}
.bg-city::after {
    content: ''; position: absolute; top: 20px; right: 40px;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(to bottom, #f0f, #00f);
    box-shadow: 0 0 20px #f0f;
    z-index: 1;
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
