import { x as useSettings, b as useGamification, g as useToast, c as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, S as SquishyButton } from "./index-CFpr8q3e.js";
const SettingsPage = () => {
  const { soundEnabled, toggleSound } = useSettings();
  const { getLevelInfo, userProfile, updateProfile, session, loginWithProvider, logout } = useGamification();
  const { showToast } = useToast();
  const { playBeep, playBoop } = useRetroSound();
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const [isEditingName, setIsEditingName] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [showAvatarSelect, setShowAvatarSelect] = reactExports.useState(false);
  const levelInfo = getLevelInfo ? getLevelInfo() : { level: 1, rank: "ROOKIE" };
  const AVATARS = [
    "/assets/merchboy_face.png",
    "/assets/merchboy_cat.png",
    "/assets/merchboy_bunny.png",
    "/assets/merchboy_money.png",
    "/assets/neon_brick/ball1.png",
    "/assets/neon_brick/ball2.png",
    "/assets/neon_brick/ball3.png",
    "/assets/neon_brick/ball4.png"
  ];
  const handleNameSave = () => {
    if (newName.trim()) {
      updateProfile({ name: newName.trim().toUpperCase() });
      setIsEditingName(false);
    }
  };
  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      playBeep();
      return;
    }
    localStorage.clear();
    showToast("SYSTEM RESET COMPLETE. REFRESHING...", "error");
    setTimeout(() => {
      window.location.reload();
    }, 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    background: "linear-gradient(to bottom, #000000, #0a0a0a)",
    minHeight: "100vh",
    padding: "20px",
    paddingBottom: "120px",
    color: "white",
    fontFamily: '"Orbitron", sans-serif'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { style: { display: "flex", alignItems: "center", marginBottom: "40px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { color: "#888", textDecoration: "none", fontSize: "1.5rem", marginRight: "20px" }, children: "⬅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, textShadow: "0 0 10px rgba(255,255,255,0.5)" }, children: "SYSTEM SETTINGS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid var(--neon-pink)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { marginTop: 0, color: "var(--neon-pink)", fontSize: "1.2rem", borderBottom: "1px solid rgba(255,0,255,0.1)", paddingBottom: "15px", display: "flex", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "OPERATOR IDENTITY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", color: "var(--neon-gold)" }, children: [
            "LVL ",
            levelInfo.level
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setShowAvatarSelect(!showAvatarSelect),
                style: {
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid white",
                  cursor: "pointer",
                  position: "relative"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile?.avatar, style: { width: "100%", height: "100%", objectFit: "cover" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }, className: "hover-show", children: "EDIT" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", marginTop: "5px", color: "#888" }, children: "TAP TO CHANGE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888", marginBottom: "5px" }, children: "CODENAME" }),
            isEditingName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  value: newName,
                  onChange: (e) => setNewName(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleNameSave(),
                  placeholder: userProfile?.name,
                  style: { background: "#222", border: "1px solid #555", color: "white", padding: "5px 10px", borderRadius: "5px", width: "100%", fontFamily: "inherit" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNameSave, style: { background: "var(--neon-green)", border: "none", borderRadius: "5px", cursor: "pointer" }, children: "💾" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  setIsEditingName(true);
                  setNewName(userProfile?.name);
                },
                style: { fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
                children: [
                  userProfile?.name,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", opacity: 0.5 }, children: "✎" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "var(--neon-gold)", marginTop: "5px" }, children: [
              levelInfo.rank,
              " CLASS"
            ] })
          ] })
        ] }),
        showAvatarSelect && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          background: "rgba(0,0,0,0.5)",
          padding: "15px",
          borderRadius: "10px",
          animation: "fadeIn 0.3s"
        }, children: AVATARS.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => {
              updateProfile({ avatar: src });
              setShowAvatarSelect(false);
              playBoop();
            },
            style: {
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              overflow: "hidden",
              border: userProfile?.avatar === src ? "2px solid var(--neon-green)" : "2px solid transparent",
              cursor: "pointer",
              transform: userProfile?.avatar === src ? "scale(1.1)" : "scale(1)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, style: { width: "100%", height: "100%", objectFit: "contain", background: "#222" } })
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid rgba(0, 243, 255, 0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: 0, color: "var(--neon-blue)", fontSize: "1.2rem", borderBottom: "1px solid rgba(0,255,255,0.1)", paddingBottom: "10px" }, children: "AUDIO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "MASTER SOUND" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "Enable sound effects" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: () => {
                toggleSound();
                playBeep();
              },
              style: {
                background: soundEnabled ? "var(--neon-green)" : "#333",
                color: soundEnabled ? "black" : "#888",
                width: "60px",
                borderRadius: "30px",
                padding: "10px"
              },
              children: soundEnabled ? "ON" : "OFF"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid var(--neon-blue)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: 0, color: "var(--neon-blue)", fontSize: "1.2rem", borderBottom: "1px solid rgba(0,255,255,0.1)", paddingBottom: "15px" }, children: "CLOUD SYNC" }),
        session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1rem", color: "#00ff00", fontWeight: "bold" }, children: "✅ ONLINE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#aaa" }, children: [
              "Synced as ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "white" }, children: session.user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: logout,
              style: { background: "#333", border: "1px solid #555", fontSize: "0.8rem", padding: "10px 20px" },
              children: "DISCONNECT"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "#ccc", lineHeight: "1.4" }, children: "Link your account to save progress across devices and never lose your high scores." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => loginWithProvider("google"),
                className: "squishy-btn",
                style: {
                  flex: 1,
                  minWidth: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "white",
                  color: "#333",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "inherit"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "G" }),
                  " GOOGLE"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => loginWithProvider("apple"),
                className: "squishy-btn",
                style: {
                  flex: 1,
                  minWidth: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "black",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  border: "1px solid #333"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "" }),
                  " APPLE"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid rgba(255, 0, 0, 0.3)", background: "rgba(20, 0, 0, 0.6)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: 0, color: "red", fontSize: "1.2rem", borderBottom: "1px solid rgba(255,0,0,0.1)", paddingBottom: "10px" }, children: "DANGER ZONE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: "#ffaaaa" }, children: "FACTORY RESET" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#aabbbb" }, children: "Wipes all progress, coins, and unlocks." })
          ] }),
          !confirmReset ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleReset,
              className: "squishy-btn",
              style: {
                background: "#333",
                color: "red",
                border: "1px solid red",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontFamily: "inherit"
              },
              children: "RESET"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setConfirmReset(false),
                style: { padding: "10px", background: "transparent", color: "#fff", border: "none", cursor: "pointer" },
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleReset,
                className: "squishy-btn",
                style: {
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                },
                children: "FIRM IT?"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "#444", fontSize: "0.8rem", marginTop: "20px" }, children: [
        "SYSTEM VERSION 3.0.1 (NEON HORIZON)",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "POWERED BY MBDIGITAL"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }` })
  ] });
};
export {
  SettingsPage as default
};
