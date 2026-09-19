import { u as useGamification, a as useRetroSound, r as reactExports, j as jsxRuntimeExports, m as motion, S as SquishyButton, A as AnimatePresence } from "./index-HnrdNYLo.js";
import { T as TiltCard } from "./TiltCard-npi2zG6-.js";
import { S as StickerSprite } from "./StickerSprite-Dlq48BOf.js";
import "./use-transform-BeQ688UQ.js";
import "./use-spring-BwGO9ZIi.js";
const FISH_SHEETS = {
  surface: "/assets/fishing/fishing_surface.png",
  coral: "/assets/fishing/fishing_coral.png",
  deep: "/assets/fishing/fishing_deep.png",
  void: "/assets/fishing/fishing_void.png"
};
const Inventory = () => {
  const { shopState, userProfile } = useGamification();
  const { playBeep, playClick } = useRetroSound();
  const inventory = shopState?.inventory || {};
  const [activeTab, setActiveTab] = reactExports.useState("ALL");
  const allItems = [];
  Object.keys(inventory).forEach((itemId) => {
    inventory[itemId].forEach((instance) => {
      allItems.push({
        baseId: itemId,
        ...instance
      });
    });
  });
  const unlocked = shopState?.unlocked || [];
  unlocked.forEach((id, idx) => {
    if (id.startsWith("sticker_")) {
      allItems.push({
        id: "unlocked_" + id + "_" + idx,
        // unique key
        baseId: id,
        type: "sticker",
        metadata: {
          name: id.replace("sticker_", "").replace(/_/g, " ").toUpperCase()
        }
      });
    } else if (id.startsWith("lure_") || id.startsWith("boat_") || id.startsWith("rod_")) {
      allItems.push({
        id: "unlocked_" + id + "_" + idx,
        baseId: id,
        type: "gear",
        metadata: {
          name: id.replace(/_/g, " ").toUpperCase(),
          emoji: id.includes("rod") ? "🎣" : id.includes("boat") ? "🛥️" : "🪱"
        }
      });
    }
  });
  const filteredItems = allItems.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "FISH" && item.type === "fish") return true;
    if (activeTab === "STICKERS" && item.type === "sticker") return true;
    if (activeTab === "GEAR" && item.type === "gear") return true;
    return false;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "1200px", margin: "0 auto", padding: "20px", paddingBottom: "120px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.h1,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        style: {
          fontSize: "3rem",
          margin: "0 0 20px 0",
          background: "linear-gradient(to right, #00ffcc, #ff00ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(0,255,204,0.3)",
          textAlign: "center"
        },
        children: "THE VAULT"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }, children: ["ALL", "FISH", "STICKERS", "GEAR"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SquishyButton,
      {
        onClick: () => {
          setActiveTab(tab);
          playClick();
        },
        style: {
          background: activeTab === tab ? "var(--neon-blue)" : "rgba(255,255,255,0.1)",
          color: activeTab === tab ? "black" : "white",
          border: activeTab === tab ? "none" : "1px solid rgba(255,255,255,0.2)"
        },
        children: tab
      },
      tab
    )) }),
    filteredItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: "50px", color: "#888", fontStyle: "italic" }, children: "YOUR VAULT IS EMPTY. GO PLAY SOME GAMES!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "20px"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filteredItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: idx * 0.05 },
        onMouseEnter: playBeep,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TiltCard, { className: "bento-card", style: {
          cursor: "pointer",
          transition: "all 0.2s",
          background: "rgba(20,20,30,0.8)",
          border: "1px solid #333",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "150px"
        }, children: [
          item.type === "fish" ? item.metadata?.sheet ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "64px",
            height: "64px",
            backgroundImage: `url(${FISH_SHEETS[item.metadata.sheet]})`,
            backgroundSize: "400% 400%",
            backgroundPosition: `${(item.metadata.col || 0) * 33.33}% ${(item.metadata.row || 0) * 33.33}%`,
            imageRendering: "pixelated"
          } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem" }, children: item.metadata?.emoji || "❓" }) : item.type === "sticker" ? /* @__PURE__ */ jsxRuntimeExports.jsx(StickerSprite, { sticker: item.baseId, size: 64 }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem" }, children: item.metadata?.emoji || "📦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", fontSize: "0.8rem", fontWeight: "bold", color: "#00ffcc", textAlign: "center" }, children: item.metadata?.name || item.baseId }),
          item.metadata?.weight && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.6rem", color: "#888" }, children: [
            item.metadata.weight,
            " lbs"
          ] })
        ] })
      },
      item.id
    )) }) })
  ] });
};
export {
  Inventory as default
};
