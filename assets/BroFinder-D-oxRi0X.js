import { a as useGamification, k as useSquad, b as useRetroSound, c as useToast, r as reactExports, j as jsxRuntimeExports, L as Link, A as AnimatePresence, m as motion } from "./index-DYcDl0OM.js";
const GENERATOR_PARTS = {
  bodies: ["🤖", "👽", "👾", "🤡", "👻", "👺", "💀", "😸", "🐻", "🐼"],
  names: ["Zorg", "X-AE-12", "Glitch", "Bitsy", "Pixel", "Retro", "Neon", "Vapor", "Cyber", "Null"],
  jobs: ["Hacker", "Miner", "Gamer", "Influencer", "Bot", "Ghost", "Jester", "King", "Pilot", "Chef"],
  taglines: [
    "Looking for a squad.",
    "Will work for crypto.",
    "System 32 deleted.",
    "404 Soul Not Found.",
    "Level 99 Boss.",
    "Just vibing.",
    "No n00bs.",
    "Ready to raid.",
    "I handle storage.",
    "Speedrunner."
  ]
};
const BroFinder = () => {
  const { coins, addCoins } = useGamification();
  const { recruitMember, recruits } = useSquad();
  const { playClick, playCrash, playWin } = useRetroSound();
  const { showToast } = useToast();
  const [currentProfile, setCurrentProfile] = reactExports.useState(null);
  const [direction, setDirection] = reactExports.useState(0);
  const generateProfile = () => {
    return {
      id: Date.now(),
      icon: GENERATOR_PARTS.bodies[Math.floor(Math.random() * GENERATOR_PARTS.bodies.length)],
      name: `${GENERATOR_PARTS.names[Math.floor(Math.random() * GENERATOR_PARTS.names.length)]}_${Math.floor(Math.random() * 99)}`,
      job: GENERATOR_PARTS.jobs[Math.floor(Math.random() * GENERATOR_PARTS.jobs.length)],
      tagline: GENERATOR_PARTS.taglines[Math.floor(Math.random() * GENERATOR_PARTS.taglines.length)],
      rating: (Math.random() * 2 + 3).toFixed(1),
      // 3.0 to 5.0
      price: Math.floor(Math.random() * 500) + 100
    };
  };
  reactExports.useEffect(() => {
    setCurrentProfile(generateProfile());
  }, []);
  const handleSwipe = (dir) => {
    setDirection(dir);
    playClick();
    setTimeout(() => {
      if (dir === 1) {
        if (recruits && recruits.length >= 10) {
          showToast("SQUAD FULL! Fire some members first.", "error");
          playCrash();
          setDirection(0);
          return;
        }
        if (coins >= 50) {
          if (Math.random() > 0.3) {
            addCoins(-50);
            playWin();
            showToast(`MATCH! ${currentProfile.name} Joined!`, "success");
            recruitMember(currentProfile);
          } else {
            addCoins(-50);
            playCrash();
            showToast("Ghosted... -50 Coins", "error");
          }
        } else {
          playCrash();
          showToast("NOT ENOUGH COINS TO DM!", "error");
          setDirection(0);
          return;
        }
      }
      setDirection(0);
      setCurrentProfile(generateProfile());
    }, 300);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #ff0055, #7700ff)",
    color: "white",
    fontFamily: '"Outfit", sans-serif',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "100px",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { fontSize: "1.5rem", textDecoration: "none", color: "white" }, children: "⬅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "900", fontSize: "1.5rem", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "5px" }, children: "🔥 BroFinder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.3)", padding: "5px 12px", borderRadius: "20px", fontSize: "0.9rem" }, children: [
        "🪙 ",
        coins
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: currentProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.8, opacity: 0, y: 50 },
        animate: {
          scale: 1,
          opacity: 1,
          y: 0,
          x: direction * 200,
          rotate: direction * 20
        },
        exit: { x: direction * 500, opacity: 0, rotate: direction * 45 },
        transition: { duration: 0.3 },
        style: {
          width: "90%",
          maxWidth: "350px",
          height: "500px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          overflow: "hidden",
          position: "absolute",
          display: "flex",
          flexDirection: "column"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 2, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8rem", position: "relative" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
            currentProfile.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "rgba(0,0,0,0.8)",
              color: "#00ffcc",
              padding: "5px 15px",
              borderRadius: "10px",
              fontWeight: "bold"
            }, children: [
              "Salary: ",
              currentProfile.price,
              "/hr"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "20px", color: "#333" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, fontSize: "1.8rem", fontWeight: "800" }, children: currentProfile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.2rem", fontWeight: "bold" }, children: [
                "⭐ ",
                currentProfile.rating
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1rem", color: "#888", marginBottom: "15px", fontWeight: "600", textTransform: "uppercase" }, children: [
              "💼 ",
              currentProfile.job
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1rem", color: "#555", fontStyle: "italic" }, children: [
              '"',
              currentProfile.tagline,
              '"'
            ] })
          ] })
        ]
      },
      currentProfile.id
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "30px", display: "flex", gap: "30px", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleSwipe(-1),
          style: {
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "white",
            border: "none",
            color: "#ff0055",
            fontSize: "2rem",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "transform 0.1s"
          },
          onMouseDown: (e) => e.target.style.transform = "scale(0.9)",
          onMouseUp: (e) => e.target.style.transform = "scale(1)",
          children: "✖️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleSwipe(1),
          style: {
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "white",
            border: "none",
            color: "#00ffcc",
            fontSize: "2.5rem",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "transform 0.1s"
          },
          onMouseDown: (e) => e.target.style.transform = "scale(0.9)",
          onMouseUp: (e) => e.target.style.transform = "scale(1)",
          children: "🔥"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", opacity: 0.7, marginBottom: "20px", textAlign: "center" }, children: "50 COINS per DM • 30% Match Rate" })
  ] });
};
export {
  BroFinder as default
};
