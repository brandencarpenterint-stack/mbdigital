import { b as useGamification, r as reactExports, j as jsxRuntimeExports, S as SquishyButton } from "./index-BL4nUXVC.js";
const AVATARS = [
  "/assets/skins/face_default.png",
  "/assets/skins/face_money.png",
  "/assets/skins/face_bear.png",
  "/assets/skins/face_bunny.png"
];
const OnboardingModal = () => {
  const { updateProfile, addCoins, userProfile } = useGamification() || {};
  const [visible, setVisible] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [avatar, setAvatar] = reactExports.useState(AVATARS[0]);
  reactExports.useEffect(() => {
    const hasOnboarded = localStorage.getItem("arcade_hasOnboarded");
    if (!hasOnboarded) {
      setVisible(true);
    }
  }, []);
  const handleComplete = () => {
    if (!name.trim()) {
      alert("IDENTIFICATION REQUIRED. ENTER CODE NAME.");
      return;
    }
    if (updateProfile && addCoins) {
      updateProfile({ name: name.toUpperCase(), avatar });
      addCoins(500);
      localStorage.setItem("arcade_hasOnboarded", "true");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setVisible(false);
    }
  };
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.95)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(20px)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bento-card", style: {
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
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
      fontSize: "2rem",
      marginBottom: "10px",
      background: "linear-gradient(to right, #00f260, #0575E6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }, children: "WELCOME OPERATOR" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#a0aec0", marginBottom: "30px", letterSpacing: "1px" }, children: [
      "INITIALIZE PROFILE TO RECEIVE ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ecc94b", fontWeight: "bold" }, children: "500 COINS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px", width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", marginBottom: "10px", color: "#a0aec0", fontSize: "0.8rem" }, children: "SELECT AVATAR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "15px" }, children: AVATARS.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "30px", width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", marginBottom: "10px", color: "#a0aec0", fontSize: "0.8rem" }, children: "CODENAME" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "ENTER NAME...",
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
            textTransform: "uppercase"
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SquishyButton,
      {
        onClick: handleComplete,
        style: {
          width: "100%",
          padding: "20px",
          fontSize: "1.2rem",
          background: "linear-gradient(90deg, #00f260, #0575E6)",
          boxShadow: "0 10px 30px rgba(0, 242, 96, 0.4)"
        },
        children: "INITIALIZE SYSTEM 🚀"
      }
    )
  ] }) });
};
export {
  OnboardingModal as default
};
