import { d as useSquad, u as useGamification, a as useRetroSound, r as reactExports, j as jsxRuntimeExports, t as triggerConfetti } from "./index-DXIHRrTn.js";
import { S as SquishyButton } from "./SquishyButton-DEi3u2BX.js";
import { feedService } from "./feed-Ce650PV3.js";
const Factions = () => {
  const { userSquad, squadScores, contribute, getSquadDetails, getLeadingSquad } = useSquad();
  const { coins, addCoins, userProfile, incrementStat } = useGamification();
  const { playCoin, playError } = useRetroSound();
  const [timeLeft, setTimeLeft] = reactExports.useState({ d: 4, h: 12, m: 32, s: 0 });
  const [donateAmount, setDonateAmount] = reactExports.useState(100);
  const totalScore = Object.values(squadScores).reduce((a, b) => a + b, 0);
  const cyberPct = (squadScores.CYBER / totalScore * 100).toFixed(1);
  const solarPct = (squadScores.SOLAR / totalScore * 100).toFixed(1);
  const voidPct = (squadScores.VOID / totalScore * 100).toFixed(1);
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          d--;
        }
        return { d, h, m, s };
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const handleDonate = () => {
    if (!userSquad) {
      playError();
      alert("Join a faction first!");
      return;
    }
    if (coins < donateAmount) {
      playError();
      alert("Insufficient coins to donate!");
      return;
    }
    addCoins(-donateAmount);
    contribute(donateAmount);
    incrementStat("factionPointsDonated", donateAmount);
    playCoin();
    triggerConfetti();
    if (donateAmount >= 1e3) {
      feedService.publish(`donated ${donateAmount} coins to the ${getSquadDetails(userSquad).name}! ⚔️`, "win", userProfile?.name || "A player");
    }
  };
  const leader = getLeadingSquad();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", color: "white", maxWidth: "800px", margin: "0 auto", textAlign: "center", fontFamily: '"Orbitron", sans-serif' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3rem", color: "#fff", textShadow: "0 0 20px var(--neon-pink)", marginBottom: "10px" }, children: "FACTION WARS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", marginBottom: "40px" }, children: [
      "Donate to the shrine to help your faction claim the title of ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "King Ding Dong" }),
      " 👑."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.5)", border: "1px solid #333", padding: "20px", borderRadius: "15px", marginBottom: "40px", boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 10px 0", color: "var(--neon-blue)" }, children: "SEASON 1 ENDS IN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.5rem", fontWeight: "bold", fontFamily: '"Press Start 2P", monospace', letterSpacing: "2px", color: "#fff", textShadow: "0 0 10px #fff" }, children: [
        String(timeLeft.d).padStart(2, "0"),
        "d ",
        String(timeLeft.h).padStart(2, "0"),
        "h ",
        String(timeLeft.m).padStart(2, "0"),
        "m ",
        String(timeLeft.s).padStart(2, "0"),
        "s"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", marginBottom: "15px" }, children: "GLOBAL DOMINATION" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", height: "50px", display: "flex", borderRadius: "25px", overflow: "hidden", boxShadow: "0 0 30px rgba(255,255,255,0.2)", marginBottom: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${cyberPct}%`, background: "linear-gradient(90deg, #0055ff, #00f3ff)", transition: "width 1s ease-out" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${solarPct}%`, background: "linear-gradient(90deg, #ff6600, #ffaa00)", transition: "width 1s ease-out" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${voidPct}%`, background: "linear-gradient(90deg, #6600ff, #9d00ff)", transition: "width 1s ease-out" } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "50px", fontSize: "0.8rem", fontWeight: "bold" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#00f3ff" }, children: [
        "CYBER: ",
        squadScores.CYBER.toLocaleString(),
        " (",
        cyberPct,
        "%) ",
        leader === "CYBER" && "👑"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffaa00" }, children: [
        "SOLAR: ",
        squadScores.SOLAR.toLocaleString(),
        " (",
        solarPct,
        "%) ",
        leader === "SOLAR" && "👑"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#9d00ff" }, children: [
        "VOID: ",
        squadScores.VOID.toLocaleString(),
        " (",
        voidPct,
        "%) ",
        leader === "VOID" && "👑"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "linear-gradient(180deg, #111, #000)", border: "2px solid #333", borderRadius: "20px", padding: "30px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "var(--neon-gold)", textShadow: "0 0 10px var(--neon-gold)" }, children: "THE COIN SHRINE" }),
      userSquad ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", filter: `drop-shadow(0 0 20px ${getSquadDetails(userSquad).color})`, margin: "20px 0" }, children: getSquadDetails(userSquad).icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#fff", fontSize: "1.2rem", marginBottom: "20px" }, children: [
          "You are fighting for the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: getSquadDetails(userSquad).color }, children: getSquadDetails(userSquad).name }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }, children: [100, 500, 1e3, 5e3].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setDonateAmount(amt),
            style: {
              background: donateAmount === amt ? "var(--neon-gold)" : "transparent",
              color: donateAmount === amt ? "#000" : "var(--neon-gold)",
              border: "1px solid var(--neon-gold)",
              borderRadius: "10px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: donateAmount === amt ? "0 0 10px var(--neon-gold)" : "none"
            },
            children: [
              amt,
              " 🪙"
            ]
          },
          amt
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SquishyButton, { onClick: handleDonate, style: {
          padding: "15px 40px",
          fontSize: "1.5rem",
          background: getSquadDetails(userSquad).color,
          color: "#000",
          border: "none",
          borderRadius: "15px",
          boxShadow: `0 0 20px ${getSquadDetails(userSquad).color}`
        }, children: [
          "DONATE ",
          donateAmount,
          " FP"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "40px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#ff0055", fontSize: "1.2rem" }, children: "You have not chosen a faction yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#888" }, children: "Head to the profile or refresh to join the fight." })
      ] })
    ] })
  ] });
};
export {
  Factions as default
};
