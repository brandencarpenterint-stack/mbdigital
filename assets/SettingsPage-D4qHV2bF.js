import { p as useSettings, a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, i as SHOP_ITEMS, b as SquishyButton, q as adService } from "./index-DuJS5nsO.js";
const SettingsPage = () => {
  const { soundEnabled, toggleSound } = useSettings();
  const { getLevelInfo, userProfile, updateProfile, session, loginWithProvider, logout, shopState, equipItem } = useGamification();
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "35px",
      padding: "14px 22px",
      background: "rgba(15, 15, 28, 0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0, 240, 255, 0.25)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          style: {
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            color: "#00f0ff",
            fontSize: "0.75rem",
            fontWeight: "900",
            letterSpacing: "1px",
            transition: "all 0.2s ease"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "DASHBOARD"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        margin: 0,
        fontSize: "1.3rem",
        fontWeight: "900",
        letterSpacing: "3px",
        color: "#fff",
        textShadow: "0 0 15px rgba(0, 240, 255, 0.6)"
      }, children: "SYSTEM SETTINGS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "0.7rem",
        letterSpacing: "1px",
        color: "#00ff88",
        padding: "4px 10px",
        borderRadius: "8px",
        background: "rgba(0, 255, 136, 0.1)",
        border: "1px solid rgba(0, 255, 136, 0.3)"
      }, children: "BUILD 3.0.1" })
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
                  style: { background: "#222", border: "1px solid #555", color: "white", padding: "8px 12px", borderRadius: "8px", width: "100%", fontFamily: "inherit" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleNameSave,
                  title: "Save Codename",
                  style: {
                    background: "var(--neon-green)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "0 14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) })
                }
              )
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
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#00f0ff",
                    fontSize: "0.7rem"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { marginRight: "4px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 20h9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })
                    ] }),
                    "EDIT"
                  ] })
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid var(--neon-blue)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: 0, color: "var(--neon-blue)", fontSize: "1.2rem", borderBottom: "1px solid rgba(0,255,255,0.1)", paddingBottom: "15px" }, children: "VISUAL SYSTEM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "15px" }, children: SHOP_ITEMS.filter((item) => item.category === "themes").map((item) => {
          const isOwned = item.price === 0 || shopState?.unlocked?.includes(item.id);
          const isActive = shopState?.equipped?.theme === item.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => {
                if (isOwned) {
                  equipItem("themes", item.id);
                  playBoop();
                } else {
                  showToast("LOCKED! Purchase in Shop.", "error");
                  playBeep();
                }
              },
              style: {
                background: isActive ? "var(--neon-blue)" : isOwned ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.5)",
                color: isActive ? "black" : isOwned ? "white" : "#555",
                padding: "10px",
                borderRadius: "10px",
                cursor: isOwned ? "pointer" : "not-allowed",
                border: isActive ? "2px solid white" : "1px solid #333",
                textAlign: "center",
                opacity: isOwned ? 1 : 0.6,
                transition: "all 0.2s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", marginBottom: "5px" }, children: item.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: "bold" }, children: item.name }),
                !isOwned && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontSize: "0.65rem",
                  color: "#ffd700",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginTop: "4px"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    item.price,
                    " CP"
                  ] })
                ] }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", fontWeight: "900", marginTop: "2px" }, children: "ACTIVE" })
              ]
            },
            item.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid rgba(0, 243, 255, 0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { marginTop: 0, color: "var(--neon-blue)", fontSize: "1.2rem", borderBottom: "1px solid rgba(0,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
          ] }),
          "AUDIO SETTINGS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "MASTER SOUND" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "Enable high-fidelity retro arcade FX" })
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
                minWidth: "80px",
                borderRadius: "30px",
                padding: "10px 18px",
                fontWeight: "900",
                letterSpacing: "1px"
              },
              children: soundEnabled ? "ENABLED" : "MUTED"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid var(--neon-blue)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { marginTop: 0, color: "var(--neon-blue)", fontSize: "1.2rem", borderBottom: "1px solid rgba(0,255,255,0.1)", paddingBottom: "15px" }, children: "CLOUD SYNC" }),
        session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              fontSize: "0.9rem",
              color: "#00ff88",
              fontWeight: "900",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: "0 0 10px #00ff88",
                display: "inline-block"
              } }),
              "CLOUD SYNC ACTIVE"
            ] }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel", style: { padding: "25px", border: "1px solid #ffd700", background: "rgba(255, 215, 0, 0.03)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { marginTop: 0, color: "#ffd700", fontSize: "1.2rem", borderBottom: "1px solid rgba(255,215,0,0.2)", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v2m0 8v2" })
            ] }),
            "MONETIZATION & ADS ENGINE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", padding: "4px 8px", borderRadius: "6px", background: adService.isRealAdsConfigured() ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 215, 0, 0.2)", color: adService.isRealAdsConfigured() ? "#00ff88" : "#ffd700" }, children: adService.isRealAdsConfigured() ? "LIVE MONETIZATION" : "DEV SIMULATION" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "#ccc" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ad Engine:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: "bold" }, children: "Google H5 Games Ads / Placement API" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "#ccc" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Publisher ID:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: adService.isRealAdsConfigured() ? "#00ff88" : "#888", fontFamily: "monospace" }, children: "None (Simulated Sponsors Active)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "#ccc" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rewarded Revives / Day:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00f0ff", fontFamily: "monospace" }, children: [
              adService.DAILY_MAX_SPONSOR_CLAIMS,
              " Claims (1,500 CP + 150 XP each)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#888", fontSize: "0.75rem", lineHeight: "1.4", margin: "4px 0 0 0", display: "flex", alignItems: "flex-start", gap: "6px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", style: { flexShrink: 0, marginTop: "2px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 18h6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 22h4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "To earn real money from player views, set your Google AdSense Publisher ID in ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".env" }),
              " (",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXX" }),
              ") and update ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "public/ads.txt" }),
              "."
            ] })
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
