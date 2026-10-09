import { u as useGamification, a as useRetroSound, e as useNavigate, r as reactExports, s as supabase, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-_52vK3nY.js";
const MOCK_WAGERS = [
  { id: "m1", player: "ShadowBroker", gameId: "slots", gameName: "Cosmic Slots", wager: 5e3, state: "open", targetScore: 1e3 },
  { id: "m2", player: "GlitchKing99", gameId: "face-runner", gameName: "Face Warp", wager: 2500, state: "open", targetScore: 150 },
  { id: "m3", player: "VoidEntity", gameId: "brick", gameName: "Neon Bricks", wager: 1e4, state: "open", targetScore: 4e3 }
];
const GAMES_LIST = [
  { id: "slots", name: "Cosmic Slots" },
  { id: "face-runner", name: "Face Warp" },
  { id: "brick", name: "Neon Bricks" },
  { id: "flappy", name: "FlappyBro" },
  { id: "snake", name: "Neon Snake" }
];
const TheUnderworld = () => {
  const { coins, addCoins, userProfile, incrementStat } = useGamification();
  const { playBeep, playClick, playError, playWin } = useRetroSound();
  const navigate = useNavigate();
  const [wagers, setWagers] = reactExports.useState(MOCK_WAGERS);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selectedGame, setSelectedGame] = reactExports.useState("face-runner");
  const [wagerAmount, setWagerAmount] = reactExports.useState(1e3);
  const [targetScore, setTargetScore] = reactExports.useState(100);
  const channelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel("underworld_wagers").on("broadcast", { event: "new_wager" }, (payload) => {
      setWagers((prev) => [payload.payload, ...prev]);
      playClick();
    }).on("broadcast", { event: "wager_accepted" }, (payload) => {
      setWagers((prev) => prev.filter((w) => w.id !== payload.payload.id));
    }).subscribe();
    channelRef.current = channel;
    return () => supabase.removeChannel(channel);
  }, []);
  const handleCreateWager = () => {
    if (coins < wagerAmount) {
      playError();
      alert("You don't have enough coins to wager that much!");
      return;
    }
    addCoins(-wagerAmount);
    playBeep();
    const newWager = {
      id: `w_${Date.now()}`,
      player: userProfile?.name || "Anonymous",
      gameId: selectedGame,
      gameName: GAMES_LIST.find((g) => g.id === selectedGame)?.name || "Unknown",
      wager: parseInt(wagerAmount),
      targetScore: parseInt(targetScore),
      state: "open"
    };
    setWagers((prev) => [newWager, ...prev]);
    setShowCreate(false);
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "new_wager",
        payload: newWager
      });
    }
  };
  const handleAcceptWager = (wager) => {
    if (coins < wager.wager) {
      playError();
      alert("You don't have enough coins to match this wager!");
      return;
    }
    const confirmMsg = `Match ${wager.wager} coins to beat ${wager.targetScore} in ${wager.gameName}?`;
    if (window.confirm(confirmMsg)) {
      addCoins(-wager.wager);
      incrementStat("underworldWagersMatched", 1);
      playWin();
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "wager_accepted",
          payload: { id: wager.id }
        });
      }
      setWagers((prev) => prev.filter((w) => w.id !== wager.id));
      alert(`Wager Accepted! Good luck. Redirecting to ${wager.gameName}...`);
      navigate(`/arcade/${wager.gameId}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #220000 0%, #000000 100%)",
    color: "#ff0055",
    fontFamily: '"Orbitron", sans-serif',
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "linear-gradient(#ff005511 1px, transparent 1px), linear-gradient(90deg, #ff005511 1px, transparent 1px)",
      backgroundSize: "30px 30px",
      zIndex: 0,
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #ff0055", paddingBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "3rem", margin: "0 0 10px 0", color: "#ff0055", textShadow: "0 0 20px #ff0055, 0 0 40px #ff0000" }, children: "THE UNDERWORLD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "1.2rem", margin: 0, letterSpacing: "2px" }, children: "ILLEGAL WAGERS & SHADOW DUELS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right", marginBottom: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowCreate(!showCreate),
          style: {
            background: showCreate ? "transparent" : "#ff0055",
            color: showCreate ? "#ff0055" : "#000",
            border: "1px solid #ff0055",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "5px",
            boxShadow: showCreate ? "none" : "0 0 15px #ff0055"
          },
          children: showCreate ? "CANCEL WAGER" : "+ NEW WAGER"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          style: { overflow: "hidden", marginBottom: "30px" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#110000", border: "1px solid #ff0055", padding: "20px", borderRadius: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 20px 0", color: "#fff" }, children: "POST A NEW DUEL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "GAME" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: selectedGame,
                    onChange: (e) => setSelectedGame(e.target.value),
                    style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none" },
                    children: GAMES_LIST.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g.id, children: g.name }, g.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "TARGET SCORE TO BEAT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: targetScore,
                    onChange: (e) => setTargetScore(e.target.value),
                    style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none" }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "#aaa", marginBottom: "5px", fontSize: "0.8rem" }, children: "YOUR WAGER (COINS)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: wagerAmount,
                  onChange: (e) => setWagerAmount(e.target.value),
                  style: { width: "100%", padding: "10px", background: "#220000", color: "#fff", border: "1px solid #ff0055", outline: "none", fontSize: "1.2rem", fontWeight: "bold" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleCreateWager,
                style: {
                  width: "100%",
                  background: "#ff0055",
                  color: "#000",
                  padding: "15px",
                  border: "none",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 20px #ff0055"
                },
                children: [
                  "CONFIRM WAGER & DEDUCT ",
                  wagerAmount,
                  " 🪙"
                ]
              }
            )
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#fff", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }, children: "OPEN WAGERS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
        wagers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#666", textAlign: "center", padding: "40px" }, children: "No open wagers. The shadows are quiet." }),
        wagers.map((wager) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, scale: 0.9 },
            style: {
              background: "rgba(20, 0, 0, 0.8)",
              border: "1px solid #550011",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#ff0055", marginBottom: "5px" }, children: [
                  wager.player,
                  " CHALLENGES YOU"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: "0 0 5px 0", fontSize: "1.5rem", color: "#fff" }, children: wager.gameName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: "0.9rem" }, children: [
                  "Target Score: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fff" }, children: wager.targetScore })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2rem", color: "var(--neon-gold)", fontWeight: "bold", textShadow: "0 0 10px var(--neon-gold)", marginBottom: "10px" }, children: [
                  wager.wager.toLocaleString(),
                  " 🪙"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleAcceptWager(wager),
                    style: {
                      background: "transparent",
                      color: "#00ffcc",
                      border: "1px solid #00ffcc",
                      padding: "8px 20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      boxShadow: "0 0 10px rgba(0, 255, 204, 0.2)"
                    },
                    children: "MATCH & PLAY"
                  }
                )
              ] })
            ]
          },
          wager.id
        ))
      ] }) })
    ] })
  ] });
};
export {
  TheUnderworld as default
};
