import { z as useNavigate, b as useGamification, c as useRetroSound, r as reactExports, j as jsxRuntimeExports, S as SquishyButton } from "./index-BwLfVL7x.js";
const GRAVITY = 0.4;
const DRAG = 0.995;
const BOOST_CHANCE = 0.15;
const GROUND_Y = 0;
const BroCannon = () => {
  const navigate = useNavigate();
  const { updateStat } = useGamification();
  const { playBoop, playCollect, playCrash, playWin } = useRetroSound();
  const [phase, setPhase] = reactExports.useState("AIM");
  const [angle, setAngle] = reactExports.useState(45);
  const [power, setPower] = reactExports.useState(0);
  const [distance, setDistance] = reactExports.useState(0);
  const [altitude, setAltitude] = reactExports.useState(0);
  const [boosts, setBoosts] = reactExports.useState([]);
  const [combo, setCombo] = reactExports.useState(0);
  const pos = reactExports.useRef({ x: 0, y: 0 });
  const vel = reactExports.useRef({ x: 0, y: 0 });
  const gameLoop = reactExports.useRef(null);
  const cameraX = reactExports.useRef(0);
  reactExports.useRef(0);
  const oscDir = reactExports.useRef(1);
  reactExports.useEffect(() => {
    if (phase === "AIM" || phase === "POWER") {
      const interval = setInterval(() => {
        if (phase === "AIM") {
          setAngle((prev) => {
            let next = prev + oscDir.current * 1.5;
            if (next > 85) {
              next = 85;
              oscDir.current = -1;
            }
            if (next < 5) {
              next = 5;
              oscDir.current = 1;
            }
            return next;
          });
        } else if (phase === "POWER") {
          setPower((prev) => {
            let next = prev + oscDir.current * 2;
            if (next > 100) {
              next = 100;
              oscDir.current = -1;
            }
            if (next < 0) {
              next = 0;
              oscDir.current = 1;
            }
            return next;
          });
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [phase]);
  const handleAction = () => {
    if (phase === "AIM") {
      playBoop();
      setPhase("POWER");
      oscDir.current = 1;
    } else if (phase === "POWER") {
      launch();
    }
  };
  const launch = () => {
    playWin();
    setPhase("FLYING");
    const rad = angle * Math.PI / 180;
    const totalForce = 15 + power * 0.4;
    pos.current = { x: 0, y: 10 };
    vel.current = {
      x: Math.cos(rad) * totalForce,
      y: Math.sin(rad) * totalForce
    };
    generateBoosts(0, 1e4);
    gameLoop.current = requestAnimationFrame(update);
  };
  const generateBoosts = (startX, endX) => {
    const newBoosts = [];
    for (let x = startX; x < endX; x += 150) {
      if (Math.random() < BOOST_CHANCE) {
        newBoosts.push({
          id: Math.random(),
          x: x + Math.random() * 100,
          y: Math.random() * 800 + 100,
          // Sky height
          type: Math.random() > 0.8 ? "SUPER" : "NORMAL"
        });
      }
    }
    setBoosts((prev) => [...prev, ...newBoosts]);
  };
  const update = () => {
    vel.current.x *= DRAG;
    vel.current.y *= DRAG;
    vel.current.y -= GRAVITY;
    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;
    if (pos.current.y <= GROUND_Y) {
      pos.current.y = GROUND_Y;
      if (Math.abs(vel.current.y) > 2) {
        vel.current.y *= -0.5;
        vel.current.x *= 0.8;
        playCrash();
      } else {
        finishGame();
        return;
      }
    }
    setBoosts((currentBoosts) => {
      const kept = [];
      for (const b of currentBoosts) {
        const dx = b.x - pos.current.x;
        const dy = b.y - pos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          playCollect();
          if (b.type === "SUPER") {
            vel.current.x += 15;
            vel.current.y += 15;
            setCombo((c) => c + 1);
          } else {
            vel.current.x += 5;
            vel.current.y += 10;
          }
        } else {
          if (b.x > pos.current.x - 500) kept.push(b);
        }
      }
      return kept;
    });
    if (pos.current.x > cameraX.current + 2e3) ;
    setDistance(Math.floor(pos.current.x));
    setAltitude(Math.floor(pos.current.y));
    cameraX.current = pos.current.x;
    if (Math.abs(vel.current.x) < 0.1 && pos.current.y <= 1) {
      finishGame();
      return;
    }
    gameLoop.current = requestAnimationFrame(update);
  };
  const finishGame = cancelAnimationFrame(gameLoop.current);
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
      // Placeholder for camera
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
      // Actually React render cycle might be too slow for smooth cam via style prop
      // But for simple game it might pass. simpler: Use the ref in a requestAnimationFrame to setting style directly?
      // For this "v1", let's trust React can handle 60fps style updates on simple DOM.
      // Wait, I updated 'distance' state every frame. That causes re-render.
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
    (phase === "AIM" || phase === "POWER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      bottom: 150,
      left: 50,
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }, children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "white", fontSize: "1.5rem", animation: "pulse 0.5s infinite" }, children: phase === "AIM" ? "CLICK TO SET ANGLE" : "CLICK TO FIRE!" })
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
