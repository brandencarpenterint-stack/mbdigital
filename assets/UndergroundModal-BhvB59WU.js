import { a as useGamification, u as usePocketBro, c as useToast, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, t as triggerConfetti } from "./index-BjlAyyZi.js";
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
  },
  {
    id: "arcade_overclock",
    name: "CPU Overclock",
    price: 1500,
    icon: "⚡",
    desc: "Boosts coin earnings in Arcade games by 20% (Permanent).",
    effect: { passive: "coin_boost_20" }
  },
  {
    id: "radio_scrambler",
    name: "Signal Scrambler",
    price: 750,
    icon: "📡",
    desc: "Increases chance to find Secret Frequencies.",
    effect: { passive: "signal_boost" }
  },
  {
    id: "hack_root",
    name: "Root Kit",
    price: 5e3,
    icon: "💻",
    desc: "Bypass system time checks. Access Underground 24/7.",
    effect: { passive: "root_access" }
  },
  {
    id: "legacy_drive",
    name: "Legacy Drive",
    price: 1e3,
    icon: "📼",
    desc: "Contains data from the Before Times.",
    effect: { unlockLore: "origin_story" }
  }
];
const UndergroundModal = ({ onClose }) => {
  const { coins, spendCoins, unlockHiddenItem, addCoins, unlockLore } = useGamification();
  const { feed, play, clean, triggerEffect, stats } = usePocketBro();
  const { showToast } = useToast();
  const { playWin } = useRetroSound();
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
        if (unlockLore) unlockLore("void_beast");
      } else if (item.id === "glitch_pill") {
        triggerEffect("jitter", 5e3);
        triggerEffect("zoom", 5e3);
        if (unlockLore) unlockLore("glitch_origins");
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
      } else if (item.id === "arcade_overclock") {
        if (unlockHiddenItem) {
          unlockHiddenItem("arcade_overclock");
          showToast("CPU OVERCLOCK: +20% COINS ENGAGED", "success");
          triggerConfetti();
        } else {
          showToast("KERNEL ERROR: Cannot unlock.", "error");
        }
      } else if (item.id === "hack_root") {
        if (unlockHiddenItem) {
          unlockHiddenItem("hack_root");
          unlockLore("signal_dev");
          showToast("ROOT ACCESS GRANTED. TIME GATE REMOVED.", "max");
          triggerConfetti();
        }
      } else if (item.id === "legacy_drive") {
        if (unlockLore) {
          unlockLore("origin_story");
          showToast("DRIVE DECRYPTED. NEW LORE ADDED.", "success");
        }
      } else if (item.id === "radio_scrambler") {
        if (unlockHiddenItem) {
          unlockHiddenItem("radio_scrambler");
          showToast("SIGNAL SCRAMBLER INSTALLED", "success");
        }
      } else if (item.id === "midnight_oil") {
        triggerEffect("jitter");
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", fontSize: "0.6rem", color: "#333", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { borderColor: "#333", margin: "20px 0" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1rem", color: "red", marginBottom: "10px" }, children: "/// HIGH STAKES ///" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (spendCoins(100)) {
            if (Math.random() > 0.5) {
              setTimeout(() => {
                showToast("+200 COINS", "win");
                addCoins(200);
                playWin();
              }, 500);
            } else {
              showToast("LOST 100", "error");
            }
          }
        }, style: { background: "#330000", color: "red", border: "1px solid red", padding: "10px", cursor: "pointer" }, children: "BET 100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          const current = coins;
          if (current <= 0) {
            showToast("BROKE.", "error");
            return;
          }
          if (window.confirm("WARNING: 50% CHANCE TO LOSE EVERYTHING. PROCEED?")) {
            spendCoins(current);
            setTimeout(() => {
              if (Math.random() > 0.5) {
                addCoins(current * 2);
                playWin();
                triggerConfetti();
                showToast(`JACKPOT! +${current * 2}`, "max");
              } else {
                showToast("BANKRUPT.", "error");
                triggerEffect("crash");
              }
            }, 2e3);
          }
        }, style: { background: "red", color: "black", border: "1px solid red", padding: "10px", fontWeight: "bold", cursor: "pointer", animation: "pulse 1s infinite" }, children: "DOUBLE DOWN (ALL IN)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px" }, children: "NO REFUNDS. NO WITNESSES." })
    ] })
  ] }) });
};
export {
  UndergroundModal as U
};
