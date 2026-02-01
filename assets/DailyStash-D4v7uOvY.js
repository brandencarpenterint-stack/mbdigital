import { b as useGamification, c as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, t as triggerConfetti } from "./index-6H0vzCe-.js";
const DailyStash = ({ onClose }) => {
  const { addCoins } = useGamification();
  const { playClick, playFanfare, playCoin } = useRetroSound();
  const [status, setStatus] = reactExports.useState("LOCKED");
  const [reward, setReward] = reactExports.useState(null);
  const [timeLeft, setTimeLeft] = reactExports.useState("");
  const [streak, setStreak] = reactExports.useState(parseInt(localStorage.getItem("dailyStreak")) || 0);
  reactExports.useEffect(() => {
    checkAvailability();
    const interval = setInterval(checkAvailability, 6e4);
    return () => clearInterval(interval);
  }, []);
  const checkAvailability = () => {
    const lastClaim = localStorage.getItem("dailyStashClaim");
    if (lastClaim) {
      const lastDate = new Date(parseInt(lastClaim));
      const now = /* @__PURE__ */ new Date();
      const diff = now - lastDate;
      const hours = diff / (1e3 * 60 * 60);
      if (hours < 24) {
        setStatus("CLAIMED");
        const remaining = 24 - hours;
        const h = Math.floor(remaining);
        const m = Math.floor((remaining - h) * 60);
        setTimeLeft(`${h}h ${m}m`);
        return;
      }
    }
    if (status === "CLAIMED") setStatus("LOCKED");
  };
  const openChest = () => {
    playClick();
    setStatus("OPENING");
    let currentStreak = parseInt(localStorage.getItem("dailyStreak")) || 0;
    const lastClaim = parseInt(localStorage.getItem("dailyStashClaim")) || 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1e3;
    if (now - lastClaim > oneDay * 2) {
      currentStreak = 0;
    }
    const newStreak = currentStreak + 1;
    localStorage.setItem("dailyStreak", newStreak);
    setStreak(newStreak);
    const roll = Math.random();
    let baseAmount = 50;
    let isBigWin = false;
    if (roll > 0.95) {
      baseAmount = 500;
      isBigWin = true;
    } else if (roll > 0.85) {
      baseAmount = 250;
      isBigWin = true;
    } else if (roll > 0.6) baseAmount = 100;
    setTimeout(() => {
      const bonus = Math.floor(baseAmount * (1 + (newStreak - 1) * 0.1));
      setReward({
        amount: bonus,
        label: `${bonus} COINS`,
        isBigWin
      });
      setStatus("OPENED");
      if (isBigWin) {
        playFanfare();
        triggerConfetti();
      } else {
        playCoin();
        triggerConfetti();
      }
      addCoins(bonus);
      localStorage.setItem("dailyStashClaim", Date.now().toString());
    }, 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.85)",
    zIndex: 6e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    fontFamily: '"Orbitron", sans-serif'
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
    background: "linear-gradient(135deg, #1a0b2e 0%, #2b003e 100%)",
    width: "90%",
    maxWidth: "450px",
    padding: "40px 20px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid var(--neon-pink)",
    boxShadow: "0 0 50px rgba(255, 0, 85, 0.2)",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        style: { position: "absolute", top: "15px", right: "15px", background: "transparent", border: "none", color: "#ff0055", fontSize: "1.5rem", cursor: "pointer", zIndex: 20 },
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        color: "white",
        letterSpacing: "4px",
        fontSize: "2rem",
        textShadow: "0 0 10px var(--neon-pink)",
        margin: "0 0 10px 0"
      }, children: "NEON STASH" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(255, 0, 85, 0.1)",
        color: "var(--neon-pink)",
        display: "inline-block",
        padding: "5px 15px",
        borderRadius: "4px",
        fontWeight: "bold",
        fontSize: "0.9rem",
        border: "1px solid var(--neon-pink)",
        marginBottom: "20px"
      }, children: [
        "🔥 STREAK: ",
        streak,
        " DAY",
        streak !== 1 ? "S" : "",
        " (+",
        Math.round(streak * 0.1 * 100),
        "%)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { perspective: "800px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `loot-box ${status === "OPENING" ? "shaking" : ""} ${status === "OPENED" ? "opened" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face front", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lock-icon", children: status === "CLAIMED" ? "🚫" : "🔒" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face right" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face top" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "face bottom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reward-item ${status === "OPENED" ? "visible" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "5rem", filter: "drop-shadow(0 0 20px gold)", animation: "spinCoin 3s infinite linear" }, children: "💰" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", fontWeight: "900", color: "gold", textShadow: "0 0 10px gold", marginTop: "10px" }, children: reward?.amount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "white", fontSize: "1rem", letterSpacing: "2px" }, children: "CREDITS" })
          ] })
        ] }),
        status === "CLAIMED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          background: "rgba(0,0,0,0.9)",
          padding: "30px",
          border: "1px solid #333",
          borderRadius: "15px",
          boxShadow: "0 0 30px black"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#888", textTransform: "uppercase", fontSize: "0.8rem", margin: 0 }, children: "Next Supply Drop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", color: "var(--neon-blue)", fontWeight: "bold", textShadow: "0 0 10px var(--neon-blue)", marginTop: "5px" }, children: timeLeft })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        .loot-box {
                            width: 150px; height: 150px;
                            position: relative;
                            transform-style: preserve-3d;
                            transform: rotateX(-20deg) rotateY(30deg);
                            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }
                        .loot-box.shaking { animation: shakeBox 0.5s infinite; }
                        .loot-box.opened { transform: rotateX(-20deg) rotateY(30deg) translateY(60px); }
                        .loot-box.opened .top { transform: rotateX(130deg) translateZ(75px); } 
                        
                        .face {
                            position: absolute;
                            width: 150px; height: 150px;
                            background: rgba(20, 10, 30, 0.95);
                            border: 2px solid var(--neon-pink);
                            display: flex; alignItems: center; justifyContent: center;
                            box-shadow: inset 0 0 30px rgba(255, 0, 85, 0.2);
                        }
                        .front { transform: translateZ(75px); }
                        .back  { transform: rotateY(180deg) translateZ(75px); }
                        .right { transform: rotateY(90deg) translateZ(75px); border-color: #aa0033; }
                        .left  { transform: rotateY(-90deg) translateZ(75px); border-color: #aa0033; }
                        .top   { transform: rotateX(90deg) translateZ(75px); background: var(--neon-pink); border-color: white; transform-origin: top; transition: transform 0.5s ease-out; }
                        .bottom { transform: rotateX(-90deg) translateZ(75px); background: #000; }

                        .lock-icon { font-size: 3rem; filter: drop-shadow(0 0 10px var(--neon-pink)); }

                        .reward-item {
                            position: absolute;
                            top: 50%; left: 50%;
                            transform: translate(-50%, 0) scale(0);
                            opacity: 0;
                            display: flex; flexDirection: column; alignItems: center; justify-content: center;
                            text-align: center;
                            width: 200px;
                            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                            pointer-events: none;
                        }
                        .reward-item.visible {
                            transform: translate(-50%, -200%) scale(1);
                            opacity: 1;
                        }

                        @keyframes shakeBox {
                            0% { transform: rotateX(-20deg) rotateY(25deg); }
                            50% { transform: rotateX(-20deg) rotateY(35deg); }
                            100% { transform: rotateX(-20deg) rotateY(25deg); }
                        }
                        @keyframes spinCoin {
                            0% { transform: rotateY(0deg); }
                            100% { transform: rotateY(360deg); }
                        }
                    ` }),
      status === "LOCKED" && /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: openChest, style: { width: "100%", padding: "20px", background: "var(--neon-pink)", color: "white", fontSize: "1.2rem", textTransform: "uppercase", boxShadow: "0 0 20px var(--neon-pink)" }, children: "DECRYPT LOOT 🔓" }),
      status === "OPENED" && /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { width: "100%", padding: "20px", background: "var(--neon-blue)", color: "black", fontSize: "1.2rem", textTransform: "uppercase", boxShadow: "0 0 20px var(--neon-blue)" }, children: "COLLECT & CLOSE" }),
      status === "CLAIMED" && /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { width: "100%", padding: "15px", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "1rem" }, children: "RETURN TO BASE" })
    ] })
  ] }) });
};
export {
  DailyStash as default
};
