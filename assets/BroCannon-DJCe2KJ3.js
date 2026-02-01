import { z as useNavigate, c as useRetroSound, r as reactExports, b as useGamification, j as jsxRuntimeExports, S as SquishyButton } from "./index-D0gjAU-3.js";
const BroCannon = () => {
  const navigate = useNavigate();
  const { playCollect } = useRetroSound();
  const ZONES = [
    { name: "NOOB VALLEY", limit: 500, color: "#8BC34A" },
    { name: "NEON CITY", limit: 1500, color: "#00BCD4" },
    { name: "CYBER WASTELAND", limit: 3e3, color: "#FF9800" },
    { name: "COSMIC VOID", limit: 99999, color: "#9C27B0" }
  ];
  const PRICES = { power: 10, aero: 15, bounce: 20 };
  const [phase, setPhase] = reactExports.useState("AIM");
  const [angle, setAngle] = reactExports.useState(45);
  const [power, setPower] = reactExports.useState(0);
  const [distance, setDistance] = reactExports.useState(0);
  const [altitude, setAltitude] = reactExports.useState(0);
  const [boosts, setBoosts] = reactExports.useState([]);
  const { stats, updateStat } = useGamification();
  const [upgrades, setUpgrades] = reactExports.useState(stats.broCannonUpgrades || { power: 1, aero: 1, bounce: 1 });
  const pos = reactExports.useRef({ x: 0, y: 0 });
  reactExports.useRef({ x: 0, y: 0 });
  reactExports.useRef(null);
  const cameraX = reactExports.useRef(0);
  const buyUpgrade = (type) => {
    const cost = PRICES[type] * upgrades[type];
    if (stats.arcadeCoins >= cost) {
      playCollect();
      updateStat("arcadeCoins", stats.arcadeCoins - cost);
      const newUpgrades = { ...upgrades, [type]: upgrades[type] + 1 };
      setUpgrades(newUpgrades);
      updateStat("broCannonUpgrades", newUpgrades);
    }
  };
  const currentZone = ZONES.find((z) => distance < z.limit) || ZONES[3];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    width: "100vw",
    height: "100vh",
    background: "#87CEEB",
    overflow: "hidden",
    position: "relative",
    touchAction: "none"
  }, onClick: handleAction, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to bottom, #1a1a2e ${Math.min(100, altitude / 10)}%, #87CEEB 100%)`,
      transition: "background 0.5s"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "100px", background: "#4CAF50" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      transform: `rotate(0deg)`,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      left: 0,
      bottom: 0,
      transform: `translate3d(${-cameraX.current + 100}px, ${Math.min(altitude * 0.5, 0)}px, 0)`,
      transition: phase === "AIM" ? "none" : "transform 0.1s linear"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: -50,
        bottom: 0,
        width: "100px",
        height: "100px",
        background: "#333",
        transformOrigin: "bottom center",
        transform: `rotate(${-angle}deg)`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "60px", height: "150px", background: "black", margin: "0 auto", borderRadius: "10px" } }) }),
      (phase === "FLYING" || phase === "RESULT") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: pos.current.x,
        bottom: pos.current.y,
        fontSize: "40px",
        transform: `rotate(${distance * 5}deg)`
      }, children: "😎" }),
      boosts.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        left: b.x,
        bottom: b.y,
        fontSize: b.type === "SUPER" ? "50px" : "30px",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: b.type === "SUPER" ? "gold" : "white",
        borderRadius: "50%",
        boxShadow: "0 0 10px white"
      }, children: b.type === "SUPER" ? "🚀" : "💨" }, b.id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 20, left: 20, color: "white", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { margin: 0, textShadow: "2px 2px 0 #000" }, children: [
        "DIST: ",
        distance,
        "m"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { margin: 0, textShadow: "2px 2px 0 #000" }, children: [
        "ALT: ",
        altitude,
        "m"
      ] })
    ] }),
    phase === "FLYING" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 100, width: "100%", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: currentZone.color, textShadow: "0 0 20px black", fontSize: "3rem", margin: 0 }, children: currentZone.name }) }),
    (phase === "AIM" || phase === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      bottom: 50,
      left: 50,
      display: "flex",
      gap: "40px",
      alignItems: "flex-end"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "200px", height: "20px", background: "#333", border: "2px solid white" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${angle / 90 * 100}%`, height: "100%", background: "orange" } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontWeight: "bold" }, children: [
          "ANGLE: ",
          Math.floor(angle),
          "°"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "200px", height: "20px", background: "#333", border: "2px solid white" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${power}%`, height: "100%", background: "red" } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontWeight: "bold" }, children: [
          "POWER: ",
          Math.floor(power),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "white", fontSize: "1.5rem", animation: "pulse 0.5s infinite", textShadow: "0 0 10px black" }, children: phase === "AIM" ? "CLICK TO SET ANGLE" : "CLICK TO FIRE!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.8)", padding: "20px", borderRadius: "15px", backdropFilter: "blur(5px)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "gold", margin: "0 0 10px 0" }, children: [
          "CANNON SHOP (Coins: ",
          stats.arcadeCoins || 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
            e.stopPropagation();
            buyUpgrade("power");
          }, style: { cursor: "pointer", textAlign: "center", background: "#333", padding: "10px", borderRadius: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "20px" }, children: "💥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontSize: "0.8rem" }, children: [
              "LVL ",
              upgrades.power
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.8rem" }, children: [
              "$",
              PRICES.power * upgrades.power
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
            e.stopPropagation();
            buyUpgrade("aero");
          }, style: { cursor: "pointer", textAlign: "center", background: "#333", padding: "10px", borderRadius: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "20px" }, children: "💨" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontSize: "0.8rem" }, children: [
              "LVL ",
              upgrades.aero
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.8rem" }, children: [
              "$",
              PRICES.aero * upgrades.aero
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
            e.stopPropagation();
            buyUpgrade("bounce");
          }, style: { cursor: "pointer", textAlign: "center", background: "#333", padding: "10px", borderRadius: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "20px" }, children: "🏀" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "white", fontSize: "0.8rem" }, children: [
              "LVL ",
              upgrades.bounce
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "0.8rem" }, children: [
              "$",
              PRICES.bounce * upgrades.bounce
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/arcade"), style: { position: "absolute", top: 20, right: 20, padding: "10px", zIndex: 20 }, children: "EXIT" }),
    phase === "RESULT" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      zIndex: 30
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { fontSize: "3rem", color: "gold" }, children: [
        distance,
        "m"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: currentZone.color }, children: currentZone.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Distance Traveled" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => {
        setPhase("AIM");
        setDistance(0);
        setAltitude(0);
        setBoosts([]);
        pos.current = { x: 0, y: 0 };
      }, children: "LAUNCH AGAIN" })
    ] })
  ] });
};
export {
  BroCannon as default
};
