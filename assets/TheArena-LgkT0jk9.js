import { k as useSquad, u as usePocketBro, a as useGamification, b as useRetroSound, r as reactExports, R as React, j as jsxRuntimeExports, L as Link, m as motion } from "./index-B9FV-ur0.js";
const GLITCH_MOBS = [
  { name: "Null Pointer", level: 1, hp: 100, dmg: 5, reward: 50 },
  { name: "404 Demon", level: 3, hp: 300, dmg: 10, reward: 100 },
  { name: "Lag Spike", level: 5, hp: 800, dmg: 15, reward: 250 },
  { name: "Blue Screen", level: 10, hp: 2e3, dmg: 50, reward: 1e3, boss: true }
];
const TheArena = () => {
  const { recruits, fireMember } = useSquad();
  const { stats: petStats } = usePocketBro();
  const { addCoins, updateStat, addFollowers, followers, hasUpgrade } = useGamification();
  const { playWin } = useRetroSound();
  const [combatLog, setCombatLog] = reactExports.useState([]);
  const [gameState, setGameState] = reactExports.useState("IDLE");
  const [currentMob, setCurrentMob] = reactExports.useState(null);
  const [battleTimer, setBattleTimer] = reactExports.useState(null);
  const leaderPower = petStats ? Math.floor((petStats.happy + petStats.energy) / 10) : 10;
  const squadPower = recruits.reduce((acc, m) => acc + parseFloat(m.rating) * 10, 0);
  const hackActive = hasUpgrade("hack_arena");
  const hackMultiplier = hackActive ? 1.2 : 1;
  const totalDmg = Math.floor((leaderPower + squadPower) * hackMultiplier);
  const [mobHp, setMobHp] = reactExports.useState(0);
  const logRef = React.useRef(null);
  reactExports.useEffect(() => {
    logRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combatLog]);
  const log = (msg) => {
    setCombatLog((prev) => [...prev.slice(-10), msg]);
  };
  const startFight = (mobIndex) => {
    if (gameState === "FIGHTING") return;
    const mob = GLITCH_MOBS[mobIndex || 0];
    setCurrentMob(mob);
    setMobHp(mob.hp);
    setGameState("FIGHTING");
    log(`⚠ ENGAGING ${mob.name} (Lvl ${mob.level})!`);
  };
  reactExports.useEffect(() => {
    let interval;
    if (gameState === "FIGHTING" && currentMob) {
      interval = setInterval(() => {
        const isCrit = Math.random() > 0.8;
        const hit = isCrit ? totalDmg * 2 : totalDmg;
        setMobHp((prev) => {
          const nextHp = prev - hit;
          if (nextHp <= 0) {
            clearInterval(interval);
            handleVictory();
            return 0;
          }
          return nextHp;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [gameState, currentMob, totalDmg]);
  const handleVictory = () => {
    playWin();
    const gainedUsers = Math.floor(currentMob.reward / 10);
    log(`🏆 VICTORY! DEFEATED ${currentMob.name}.`);
    log(`+${currentMob.reward} Coins | +${gainedUsers} Fans`);
    addCoins(currentMob.reward);
    addFollowers(gainedUsers);
    setGameState("VICTORY");
    setTimeout(() => setGameState("IDLE"), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "url(/assets/backgrounds/grid_bg.png), #050505",
    backgroundSize: "cover",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", borderBottom: "1px solid #333", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", color: "#fff", fontSize: "1.5rem" }, children: "⬅ HUB" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff0055", fontSize: "1.5rem", fontWeight: "900", textShadow: "0 0 10px #ff0055" }, children: "GLITCH ARENA" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#888", display: "flex", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "TOTAL FANS: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700" }, children: (followers || 0).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "SQUAD POWER: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: hackActive ? "#ff0000" : "#00ffcc" }, children: [
            Math.floor(totalDmg),
            " DPS ",
            hackActive && "(HACKED)"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", padding: "20px", gap: "20px", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "250px", background: "rgba(10,10,20,0.9)", border: "1px solid #333", borderRadius: "12px", padding: "15px", overflowY: "auto" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { borderBottom: "1px solid #333", paddingBottom: "10px" }, children: "YOUR PARTY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", padding: "10px", background: "linear-gradient(90deg, #333, transparent)", borderRadius: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: "👾" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "0.9rem" }, children: "POCKET BRO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#00ffcc" }, children: [
              "LEADER (Lvl ",
              petStats?.level || 1,
              ")"
            ] })
          ] })
        ] }),
        recruits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "20px", color: "#555", fontSize: "0.8rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "NO SQUAD MEMBERS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bro-finder", style: { color: "#ff0055" }, children: "GO RECRUITING" })
        ] }) : recruits.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", background: "rgba(255,255,255,0.05)", padding: "5px", borderRadius: "5px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: r.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: "bold" }, children: r.name.split("_")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888" }, children: r.job })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => fireMember(r.id),
              style: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", opacity: 0.7 },
              title: "Fire Member",
              children: "✖"
            }
          )
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "#000", border: "2px solid #222", borderRadius: "12px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 0, 255, .3) 25%, rgba(255, 0, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, .3) 75%, rgba(255, 0, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 255, .3) 25%, rgba(255, 0, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, .3) 75%, rgba(255, 0, 255, .3) 76%, transparent 77%, transparent)", backgroundSize: "50px 50px", transform: "perspective(500px) rotateX(60deg) translateY(100px)" } }),
          gameState === "IDLE" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555" }, children: "WAITING FOR TARGET..." }),
          gameState === "FIGHTING" && currentMob && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", zIndex: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: {
                  x: [0, -10, 10, -5, 5, 0],
                  filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                },
                transition: { duration: 0.5, repeat: Infinity },
                style: { fontSize: "8rem", marginBottom: "20px", filter: "drop-shadow(0 0 20px red)" },
                children: "👹"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "red", textShadow: "0 0 10px red" }, children: currentMob.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "300px", height: "10px", background: "#333", borderRadius: "5px", margin: "10px auto", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${mobHp / currentMob.hp * 100}%`, background: "red", transition: "width 0.2s" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              Math.floor(mobHp),
              " / ",
              currentMob.hp
            ] })
          ] }),
          gameState === "VICTORY" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              style: { fontSize: "4rem", color: "#ffd700", textShadow: "0 0 20px #ffd700", zIndex: 20 },
              children: "VICTORY!"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", height: "100px" }, children: GLITCH_MOBS.map((mob, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            disabled: gameState === "FIGHTING",
            onClick: () => startFight(i),
            style: {
              flex: 1,
              background: "#111",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#fff",
              cursor: gameState === "FIGHTING" ? "not-allowed" : "pointer",
              opacity: gameState === "FIGHTING" ? 0.5 : 1
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: mob.boss ? "red" : "white" }, children: mob.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888" }, children: [
                "Lvl ",
                mob.level,
                " • ",
                mob.reward,
                " CP"
              ] })
            ]
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "250px", background: "rgba(0,0,0,0.5)", borderLeft: "1px solid #333", padding: "15px", fontFamily: '"Courier New", monospace', fontSize: "0.8rem", overflowY: "auto", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", marginBottom: "10px" }, children: "COMBAT LOG" }),
        combatLog.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "5px", color: line.includes("VICTORY") ? "#ffd700" : "#ddd" }, children: line }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: logRef })
      ] })
    ] })
  ] });
};
export {
  TheArena as default
};
