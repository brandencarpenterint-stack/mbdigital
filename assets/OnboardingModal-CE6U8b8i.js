import { b as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, S as SquishyButton } from "./index-I_jIDthF.js";
const AVATARS = [
  "/assets/skins/face_default.png",
  "/assets/skins/face_money.png",
  "/assets/skins/face_bear.png",
  "/assets/skins/face_bunny.png"
];
const BOOT_LOGS = [
  { text: "INITIALIZING MERCHOS KERNEL...", delay: 500 },
  { text: "MOUNTING VIRTUAL DOM...", delay: 300 },
  { text: "ALLOCATING PIXEL BUFFERS...", delay: 300 },
  { text: "CONNECTING TO POCKET BRO LINK...", delay: 600 },
  { text: "SUCCESS: BRO DETECTED [OK]", delay: 200, color: "#0f0" },
  { text: "SCANNING FOR PIRATE FREQUENCIES...", delay: 800 },
  { text: "WARNING: GHOST SIGNAL DETECTED", delay: 400, color: "red" },
  { text: "LOADING USER PROFILE...", delay: 500 }
];
const OnboardingModal = () => {
  const { updateProfile, addCoins, userProfile } = useGamification() || {};
  useRetroSound();
  const [visible, setVisible] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState("CHECK");
  const [logs, setLogs] = reactExports.useState([]);
  const [currentLogIndex, setCurrentLogIndex] = reactExports.useState(0);
  const [name, setName] = reactExports.useState("");
  const [avatar, setAvatar] = reactExports.useState(AVATARS[0]);
  reactExports.useEffect(() => {
    if (userProfile?.name) setName(userProfile.name);
    if (userProfile?.avatar) setAvatar(userProfile.avatar);
  }, [userProfile]);
  reactExports.useEffect(() => {
    const hasBooted = localStorage.getItem("merchos_v3_boot");
    if (!hasBooted) {
      setVisible(true);
      setStep("BOOT");
    }
  }, []);
  reactExports.useEffect(() => {
    if (step !== "BOOT") return;
    if (currentLogIndex < BOOT_LOGS.length) {
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, BOOT_LOGS[currentLogIndex]]);
        setCurrentLogIndex((prev) => prev + 1);
      }, BOOT_LOGS[currentLogIndex].delay);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setStep("FORM");
      }, 1e3);
    }
  }, [step, currentLogIndex]);
  const handleComplete = () => {
    if (!name.trim()) {
      alert("IDENTIFICATION REQUIRED. ENTER CODE NAME.");
      return;
    }
    if (updateProfile && addCoins) {
      updateProfile({ name: name.toUpperCase(), avatar });
      addCoins(500);
      localStorage.setItem("merchos_v3_boot", "true");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setStep("MISSION");
    }
  };
  const closeOnboarding = () => {
    setVisible(false);
  };
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#000",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Press Start 2P", monospace',
    overflow: "hidden"
  }, children: [
    step === "BOOT" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "80%", maxWidth: "600px", padding: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#0f0", marginBottom: "20px", borderBottom: "2px solid #0f0", paddingBottom: "10px" }, children: "MERCHOS v3.0 // BOOT SEQUENCE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem" }, children: [
        logs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            style: { color: log.color || "#0f0" },
            children: `> ${log.text}`
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: { opacity: [0, 1] },
            transition: { repeat: Infinity, duration: 0.5 },
            style: { color: "#0f0" },
            children: "_"
          }
        )
      ] })
    ] }),
    step === "FORM" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        className: "bento-card",
        style: {
          background: "#1a202c",
          width: "90%",
          maxWidth: "500px",
          borderRadius: "30px",
          padding: "40px",
          border: "4px solid var(--neon-blue)",
          boxShadow: "0 0 50px rgba(0,255,255,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "white"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
            fontSize: "1.5rem",
            marginBottom: "10px",
            background: "linear-gradient(to right, #00f260, #0575E6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }, children: "SYSTEM READY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#a0aec0", marginBottom: "30px", fontSize: "0.8rem" }, children: "IDENTIFY YOURSELF TO PROCEED" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "20px", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "15px" }, children: AVATARS.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => setAvatar(src),
              style: {
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                border: avatar === src ? "4px solid var(--neon-blue)" : "2px solid #4a5568",
                overflow: "hidden",
                cursor: "pointer",
                transform: avatar === src ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s",
                boxShadow: avatar === src ? "0 0 20px var(--neon-blue)" : "none"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, style: { width: "100%", height: "100%", objectFit: "cover" } })
            },
            src
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "30px", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "ENTER CODENAME...",
              value: name,
              onChange: (e) => setName(e.target.value),
              style: {
                width: "100%",
                padding: "15px",
                borderRadius: "15px",
                background: "#2d3748",
                border: "2px solid #4a5568",
                color: "white",
                fontSize: "1.2rem",
                textAlign: "center",
                outline: "none",
                textTransform: "uppercase",
                fontFamily: '"Press Start 2P"'
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: handleComplete,
              style: {
                width: "100%",
                padding: "20px",
                fontSize: "1rem",
                background: "linear-gradient(90deg, #00f260, #0575E6)",
                boxShadow: "0 10px 30px rgba(0, 242, 96, 0.4)"
              },
              children: "INITIALIZE PROFILE 🚀"
            }
          )
        ]
      }
    ),
    step === "MISSION" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        style: {
          background: "#111",
          width: "90%",
          maxWidth: "600px",
          border: "1px solid #333",
          padding: "30px",
          color: "#0f0",
          fontFamily: "monospace"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { borderBottom: "1px solid #0f0", paddingBottom: "10px", marginBottom: "20px" }, children: "MISSION LOG: DAY 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { listStyle: "none", padding: 0, lineHeight: "2" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "[ ] VISIT YOUR POCKET BRO ROOM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "[ ] TUNE RADIO TO A SECRET FREQUENCY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "[ ] CHECK TERMINAL FOR 'HELP'" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "30px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: closeOnboarding,
              style: {
                background: "#0f0",
                color: "black",
                border: "none",
                padding: "10px 20px",
                fontFamily: "monospace",
                fontWeight: "bold",
                cursor: "pointer"
              },
              children: "ACKNOWLEDGED_"
            }
          ) })
        ]
      }
    )
  ] }) });
};
export {
  OnboardingModal as default
};
