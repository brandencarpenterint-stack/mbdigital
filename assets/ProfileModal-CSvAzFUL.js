import { b as useGamification, D as useNotifications, u as useSquad, E as useTheme, c as useRetroSound, a as usePocketBro, r as reactExports, d as STICKER_COLLECTIONS, j as jsxRuntimeExports, S as SquishyButton, A as AnimatePresence, m as motion, f as ACHIEVEMENTS, s as supabase, t as triggerConfetti } from "./index-BW7aM1MD.js";
import { feedService } from "./feed-DYJppU3f.js";
import { P as PocketRoom, D as DECOR_ITEMS } from "./PocketRoom-B8xtAMnF.js";
const AVATARS = [
  "/assets/skins/face_default.png",
  "/assets/skins/face_money.png",
  "/assets/skins/face_bear.png",
  "/assets/skins/face_bunny.png"
];
const ProfileModal = ({ onClose, readOnlyProfile }) => {
  const {
    unlockedAchievements,
    unlockedStickers,
    stats: myStats,
    userProfile: myProfile,
    updateProfile,
    getLevelInfo,
    session,
    loginWithProvider,
    logout,
    addFriend
    // Use the real function
  } = useGamification();
  const { sendChallenge } = useNotifications();
  const { userSquad, squadScores, getSquadDetails } = useSquad();
  const { themeId, setThemeId } = useTheme();
  const { playClick } = useRetroSound();
  const handleTabClick = (tab) => {
    playClick();
    setActiveTab(tab);
  };
  const { placeItem, stats: pocketStats } = usePocketBro();
  const [isRoomEditing, setIsRoomEditing] = reactExports.useState(false);
  const [selectedDecor, setSelectedDecor] = reactExports.useState(null);
  const handleRoomPlace = (item, x, y) => {
    placeItem(item.id, x, y);
  };
  const [originalTheme] = reactExports.useState(themeId);
  const isReadOnly = !!readOnlyProfile;
  const [remoteProfile, setRemoteProfile] = reactExports.useState(null);
  const [loadingRemote, setLoadingRemote] = reactExports.useState(false);
  const displayProfile = remoteProfile || readOnlyProfile || myProfile;
  reactExports.useEffect(() => {
    const fetchFullProfile = async () => {
      if (!isReadOnly) return;
      if (!readOnlyProfile.isMock && readOnlyProfile.placedStickers) return;
      const code = readOnlyProfile.code;
      const name = readOnlyProfile.name;
      if ((!code || code === "UNKNOWN") && !name) return;
      setLoadingRemote(true);
      try {
        let query = supabase.from("profiles").select("*");
        if (code && code !== "UNKNOWN") {
          query = query.eq("friend_code", code);
        } else if (name) {
          query = query.eq("display_name", name);
        }
        const { data, error } = await query.single();
        if (data) {
          const mapped = {
            name: data.display_name,
            avatar: data.avatar_url || readOnlyProfile.avatar,
            code: data.friend_code,
            stats: data.stats || {},
            achievements: data.achievements || [],
            placedStickers: data.placedStickers || [],
            squad: data.squad,
            xp: data.xp,
            // Capture XP for accurate level
            pocket_state: data.pocket_state
            // Capture Theme & Skin
          };
          setRemoteProfile(mapped);
        }
      } catch (err) {
        console.error("Error hydrating profile:", err);
      } finally {
        setLoadingRemote(false);
      }
    };
    fetchFullProfile();
  }, [readOnlyProfile, isReadOnly]);
  reactExports.useEffect(() => {
    if (displayProfile?.pocket_state?.theme) {
      setThemeId(displayProfile.pocket_state.theme);
    }
    return () => setThemeId(originalTheme);
  }, [displayProfile, setThemeId, originalTheme]);
  const displayStats = isReadOnly ? displayProfile.stats || {} : myStats;
  const displayAchievements = isReadOnly ? displayProfile.achievements || [] : unlockedAchievements;
  const displayStickers = isReadOnly ? displayProfile.placedStickers || [] : myProfile.placedStickers || [];
  const getRemoteLevelInfo = () => {
    if (displayProfile.xp !== void 0) {
      const level2 = Math.floor(Math.sqrt(displayProfile.xp / 100)) + 1;
      const nextXP = Math.pow(level2, 2) * 100;
      return { level: level2, progress: (displayProfile.xp - Math.pow(level2 - 1, 2) * 100) / (nextXP - Math.pow(level2 - 1, 2) * 100) * 100, xp: displayProfile.xp, nextXP, totalXP: displayProfile.xp };
    }
    const score = displayStats.gameHighScore || 0;
    const level = Math.max(1, Math.floor(score / 5e3) + 1);
    return {
      level,
      progress: 50,
      xp: score,
      nextXP: score + 1e3,
      totalXP: score
    };
  };
  const levelInfo = isReadOnly ? getRemoteLevelInfo() : getLevelInfo();
  const [activeTab, setActiveTab] = reactExports.useState("PROFILE");
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editName, setEditName] = reactExports.useState(displayProfile.name);
  const [editAvatar, setEditAvatar] = reactExports.useState(displayProfile.avatar);
  const [isDecorating, setIsDecorating] = reactExports.useState(false);
  const [localStickers, setLocalStickers] = reactExports.useState(displayStickers);
  reactExports.useEffect(() => {
    setLocalStickers(displayStickers);
    setEditName(displayProfile.name);
    setEditAvatar(displayProfile.avatar);
  }, [displayProfile, displayStickers]);
  const flattenedStickers = reactExports.useMemo(() => {
    return STICKER_COLLECTIONS.flatMap((c) => c.items);
  }, []);
  const getStickerUrl = (id) => {
    const found = flattenedStickers.find((s) => s.id === id);
    return found || { icon: "❓" };
  };
  const handleAddSticker = (stickerId) => {
    if (isReadOnly) return;
    const newSticker = {
      instanceId: Date.now(),
      id: stickerId,
      x: 150,
      // Center-ish
      y: 150,
      rotation: Math.random() * 20 - 10
    };
    setLocalStickers([...localStickers, newSticker]);
  };
  const handleStickerDragEnd = (instanceId, info) => {
    if (isReadOnly) return;
    const { offset } = info;
    setLocalStickers((prev) => prev.map((s) => {
      if (s.instanceId === instanceId) {
        return { ...s, x: s.x + offset.x, y: s.y + offset.y };
      }
      return s;
    }));
  };
  const saveDecoration = () => {
    updateProfile({ placedStickers: localStickers });
    setIsDecorating(false);
  };
  const handleSave = () => {
    updateProfile({ name: editName, avatar: editAvatar });
    setIsEditing(false);
  };
  const [friendCode, setFriendCode] = reactExports.useState("");
  const [visitingFriend, setVisitingFriend] = reactExports.useState(null);
  const totalUnlocked = displayAchievements.length;
  const handleAddFriendClick = () => {
    addFriend(friendCode);
    setFriendCode("");
  };
  const handleFlex = (friendName) => {
    feedService.publish(`flexed their High Score on ${friendName}! 💪`, "win");
  };
  const handleVibe = () => {
    triggerConfetti();
    feedService.publish(`vibed with ${displayProfile.name} in the Social Plaza!`, "love");
  };
  const handleChallenge = async () => {
    const game = "Crazy Fishing";
    const score = displayStats.crazyFishingHighScore ? displayStats.crazyFishingHighScore + 1 : 100;
    await sendChallenge(displayProfile, game, score);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    zIndex: 5e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bento-card", style: {
    background: "#1a202c",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    borderRadius: "30px",
    padding: "30px",
    border: "2px solid #2d3748",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: "white",
    position: "relative"
  }, children: [
    isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 10px, #000 10px, #000 20px)",
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
      padding: "2px",
      marginBottom: "10px",
      fontSize: "0.8rem",
      textShadow: "0 0 2px black"
    }, children: "⚠ VIEWING REMOTE PROFILE ⚠" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            onClick: () => handleTabClick("PROFILE"),
            style: {
              margin: 0,
              fontSize: "1.5rem",
              cursor: "pointer",
              color: activeTab === "PROFILE" ? "#63b3ed" : "#718096",
              paddingBottom: "5px",
              borderBottom: activeTab === "PROFILE" ? "2px solid #63b3ed" : "2px solid transparent"
            },
            children: "PROFILE"
          }
        ),
        !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            onClick: () => handleTabClick("SQUAD"),
            style: {
              margin: 0,
              fontSize: "1.5rem",
              cursor: "pointer",
              color: activeTab === "SQUAD" ? "#63b3ed" : "#718096",
              paddingBottom: "5px",
              borderBottom: activeTab === "SQUAD" ? "2px solid #63b3ed" : "2px solid transparent"
            },
            children: "SQUAD"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            onClick: () => handleTabClick("ROOM"),
            style: {
              margin: 0,
              fontSize: "1.5rem",
              cursor: "pointer",
              color: activeTab === "ROOM" ? "#63b3ed" : "#718096",
              paddingBottom: "5px",
              borderBottom: activeTab === "ROOM" ? "2px solid #63b3ed" : "2px solid transparent"
            },
            children: "ROOM"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { padding: "5px 15px", background: "#e53e3e" }, children: "X" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "hidden", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      activeTab === "PROFILE" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: { duration: 0.2 },
          style: { height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" },
          children: isEditing ? (
            // EDIT MODE
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", marginBottom: "5px", color: "var(--neon-blue)", fontWeight: "bold" }, children: "CODENAME" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: editName,
                    onChange: (e) => setEditName(e.target.value),
                    style: {
                      width: "100%",
                      padding: "15px",
                      borderRadius: "10px",
                      border: "1px solid var(--neon-blue)",
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      fontSize: "1.2rem",
                      outline: "none",
                      boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", marginBottom: "10px", color: "var(--neon-blue)", fontWeight: "bold" }, children: "AVATAR (PRESETS)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }, children: AVATARS.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    onClick: () => setEditAvatar(src),
                    style: {
                      border: editAvatar === src ? "2px solid var(--neon-pink)" : "1px solid #444",
                      borderRadius: "15px",
                      overflow: "hidden",
                      cursor: "pointer",
                      aspectRatio: "1/1",
                      background: "rgba(0,0,0,0.3)",
                      transform: editAvatar === src ? "scale(1.1)" : "scale(1)",
                      boxShadow: editAvatar === src ? "0 0 15px var(--neon-pink)" : "none",
                      transition: "all 0.2s"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, style: { width: "100%", height: "100%", objectFit: "cover" } })
                  },
                  src
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px", padding: "15px", background: "rgba(0,0,0,0.3)", borderRadius: "15px", border: "1px solid #333" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", marginBottom: "10px", color: "#aaa", fontWeight: "bold", fontSize: "0.8rem" }, children: "CLOUD SYNC" }),
                session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#00ff00", marginBottom: "10px", fontSize: "0.9rem" }, children: [
                    "✅ SYNCED AS ",
                    session.user.email
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: logout, style: { background: "#333", fontSize: "0.8rem", padding: "5px 10px" }, children: "LOGOUT" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => loginWithProvider("google"),
                      style: {
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
                        transition: "transform 0.1s"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "G" }),
                        " Sign in with Google"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => loginWithProvider("apple"),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "black",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "transform 0.1s"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem" }, children: "" }),
                        " Sign in with Apple"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleSave, style: { width: "100%", background: "linear-gradient(90deg, #00ff00, #00aa00)", color: "black", fontWeight: "bold", padding: "15px" }, children: "SAVE CHANGES" })
            ] })
          ) : (
            // VIEW MODE
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "80px", height: "80px", borderRadius: "50%", border: "2px solid var(--neon-blue)", overflow: "hidden", boxShadow: "0 0 20px var(--neon-blue)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: displayProfile.avatar, style: { width: "100%", height: "100%", objectFit: "cover" }, onError: (e) => e.target.src = "/assets/merchboy_face.png" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.8rem", textShadow: "0 0 10px rgba(255,255,255,0.5)" }, children: displayProfile.name }),
                  !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                        background: "linear-gradient(90deg, var(--neon-pink), #7928ca)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        boxShadow: "0 0 10px var(--neon-pink)"
                      }, children: [
                        "LVL ",
                        levelInfo.level
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: "6px", background: "#222", borderRadius: "3px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${levelInfo.progress}%`, height: "100%", background: "#00ffaa", boxShadow: "0 0 10px #00ffaa" } }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#aaa" }, children: [
                        Math.floor(levelInfo.progress),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888", marginTop: "4px" }, children: [
                      Math.floor(levelInfo.xp),
                      " / ",
                      Math.floor(levelInfo.nextXP),
                      " XP"
                    ] })
                  ] }),
                  isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SquishyButton,
                      {
                        onClick: handleVibe,
                        style: { fontSize: "0.8rem", padding: "8px 15px", background: "var(--neon-pink)" },
                        children: "✨ VIBE WITH THEM"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SquishyButton,
                      {
                        onClick: handleChallenge,
                        style: { fontSize: "0.8rem", padding: "8px 15px", background: "#e53e3e", marginLeft: "10px" },
                        children: "⚔️ CHALLENGE"
                      }
                    )
                  ] }),
                  !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "10px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(true), style: { background: "transparent", border: "none", color: "var(--neon-blue)", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "EDIT PROFILE ✏️" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                      setIsDecorating(true);
                      setLocalStickers(displayProfile.placedStickers || []);
                    }, style: { background: "transparent", border: "none", color: "var(--neon-pink)", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "DECORATE 🎨" })
                  ] })
                ] })
              ] }),
              (isDecorating || displayStickers?.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticker-layer", style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: isDecorating ? "auto" : "none", zIndex: 10, overflow: "hidden" }, children: (isDecorating ? localStickers : displayStickers)?.map((sticker) => {
                const def = getStickerUrl(sticker.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    drag: isDecorating,
                    dragMomentum: false,
                    onDragEnd: (e, info) => handleStickerDragEnd(sticker.instanceId, info),
                    initial: { x: sticker.x, y: sticker.y, rotate: sticker.rotation, scale: 0 },
                    animate: { x: sticker.x, y: sticker.y, rotate: sticker.rotation, scale: 1 },
                    whileHover: isDecorating ? { scale: 1.2, cursor: "grab" } : {},
                    whileDrag: { scale: 1.1, cursor: "grabbing" },
                    style: {
                      position: "absolute",
                      fontSize: "3rem",
                      filter: "drop-shadow(2px 2px 0px rgba(255,255,255,0.5)) drop-shadow(0 5px 10px rgba(0,0,0,0.5))",
                      userSelect: "none"
                    },
                    children: def.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: def.image, alt: def.name, style: { width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))" } }) : def.icon || "❓"
                  },
                  sticker.instanceId || Math.random()
                );
              }) }),
              isDecorating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "300px",
                background: "rgba(0,0,0,0.9)",
                borderTop: "2px solid var(--neon-pink)",
                zIndex: 20,
                padding: "20px",
                display: "flex",
                flexDirection: "column"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "10px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: "var(--neon-pink)" }, children: "STICKER COLLECTION" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: saveDecoration, style: { padding: "5px 15px", background: "#00ff00", color: "black" }, children: "DONE" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }, children: flattenedStickers.filter((s) => unlockedStickers.includes(s.id)).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    onClick: () => handleAddSticker(s.id),
                    style: {
                      fontSize: "2rem",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      aspectRatio: "1/1",
                      cursor: "pointer"
                    },
                    children: s.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.image, style: { width: "80%", height: "80%", objectFit: "contain" } }) : s.icon
                  },
                  s.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.8rem", color: "#666", marginTop: "10px", textAlign: "center" }, children: "Drag icons to place. Click DONE to save." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px", marginTop: "30px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.3)", border: "1px solid #333", padding: "15px", borderRadius: "20px", textAlign: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px" }, children: "ACHIEVEMENTS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "gold", fontSize: "1.8rem", fontWeight: "900", margin: "5px 0", textShadow: "0 0 10px gold" }, children: [
                    totalUnlocked,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1rem", color: "#555" }, children: [
                      "/ ",
                      ACHIEVEMENTS.length
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.3)", border: "1px solid #333", padding: "15px", borderRadius: "20px", textAlign: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px" }, children: "FISH CAUGHT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--neon-blue)", fontSize: "1.8rem", fontWeight: "900", margin: "5px 0", textShadow: "0 0 10px var(--neon-blue)" }, children: displayStats.fishCaught || 0 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "white", paddingBottom: "10px", fontSize: "1.2rem", borderBottom: "1px solid #333", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "10px" }, children: [
                "TROPHY ROOM ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", background: "#333", padding: "2px 8px", borderRadius: "10px" }, children: totalUnlocked })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", marginTop: "15px", paddingBottom: "20px" }, children: ACHIEVEMENTS.map((ach) => {
                const isUnlocked = displayAchievements.includes(ach.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  background: isUnlocked ? "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0,0,0,0))" : "rgba(0,0,0,0.3)",
                  border: isUnlocked ? "1px solid gold" : "1px solid #333",
                  borderRadius: "15px",
                  padding: "15px",
                  opacity: isUnlocked ? 1 : 0.4,
                  boxShadow: isUnlocked ? "0 0 15px rgba(255, 215, 0, 0.2)" : "none",
                  transform: isUnlocked ? "translateY(-2px)" : "none",
                  transition: "all 0.3s"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { margin: "0", color: isUnlocked ? "gold" : "#888", fontSize: "0.8rem", fontWeight: "bold" }, children: ach.title.toUpperCase() }),
                    isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.2rem", filter: "drop-shadow(0 0 5px gold)" }, children: "🏆" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: "0.7rem", color: isUnlocked ? "#ddd" : "#666", lineHeight: "1.3" }, children: ach.description })
                ] }, ach.id);
              }) })
            ] })
          )
        },
        "PROFILE"
      ),
      activeTab === "SQUAD" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: { duration: 0.2 },
          style: { height: "100%", display: "flex", flexDirection: "column" },
          children: !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: visitingFriend ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", height: "100%" } }) : (
            /* SQUAD LIST VIEW (Normal) */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#2d3748", padding: "20px", borderRadius: "20px", marginBottom: "30px", textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#a0aec0", fontSize: "0.9rem", marginBottom: "5px" }, children: "YOUR SQUAD ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", fontWeight: "900", color: "#63b3ed", letterSpacing: "2px" }, children: myProfile.code || "UNKNOWN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#718096", marginTop: "5px" }, children: "SHARE WITH FRIENDS" })
              ] }),
              userSquad && (() => {
                const details = getSquadDetails(userSquad);
                const totalScore = Object.values(squadScores).reduce((a, b) => a + b, 0) || 1;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "30px", padding: "15px", border: `1px solid ${details.color}`, borderRadius: "15px", background: "rgba(0,0,0,0.3)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem" }, children: details.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#aaa" }, children: "ALLEGIANCE" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: details.color, fontSize: "1.2rem" }, children: details.name.toUpperCase() })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: "bold", marginBottom: "10px" }, children: "GLOBAL CONFLICT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: Object.keys(squadScores).map((key) => {
                    const sq = getSquadDetails(key);
                    const sc = squadScores[key];
                    const pct = sc / totalScore * 100;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", fontSize: "0.7rem" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "60px" }, children: sq.name.split(" ")[0] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: "8px", background: "#333", borderRadius: "4px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${pct}%`, height: "100%", background: sq.color, transition: "width 1s linear" } }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        Math.floor(pct),
                        "%"
                      ] })
                    ] }, key);
                  }) })
                ] });
              })(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#a0aec0", marginBottom: "15px" }, children: "ADD FRIENDS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "30px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "ENTER FRIEND CODE...",
                    value: friendCode,
                    onChange: (e) => setFriendCode(e.target.value),
                    style: {
                      flex: 1,
                      padding: "15px",
                      borderRadius: "15px",
                      background: "#2d3748",
                      border: "2px solid #4a5568",
                      color: "white",
                      fontSize: "1rem",
                      outline: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleAddFriendClick, style: { background: "#48bb78", padding: "0 25px" }, children: "Add" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#a0aec0", marginBottom: "15px" }, children: "YOUR ROSTER" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                (!myProfile.friends || myProfile.friends.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "#666", fontStyle: "italic", padding: "20px" }, children: [
                  "No agents recruited yet. ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  " Share your code to build your squad!"
                ] }),
                myProfile.friends?.map((friend, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "15px"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: friend.avatar, style: { width: "100%", height: "100%", objectFit: "cover" }, onError: (e) => e.target.src = "/assets/merchboy_face.png" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: friend.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#718096" }, children: [
                      "BEST: ",
                      friend.score || 0
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SquishyButton,
                    {
                      onClick: () => handleFlex(friend.name),
                      style: { fontSize: "0.8rem", padding: "8px 15px", background: "#ed64a6" },
                      children: "😈"
                    }
                  )
                ] }, i))
              ] })
            ] })
          ) })
        },
        "SQUAD"
      ),
      activeTab === "ROOM" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: { duration: 0.2 },
          style: { height: "100%", display: "flex", flexDirection: "column" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              flex: 1,
              position: "relative",
              background: "#000",
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid #333",
              minHeight: "300px"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PocketRoom,
                {
                  isEditing: isRoomEditing,
                  selectedItem: selectedDecor,
                  onPlace: handleRoomPlace,
                  customItems: isReadOnly ? displayProfile.pocket_state?.room_data || [] : null
                }
              ),
              !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 10, right: 10, zIndex: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setIsRoomEditing(!isRoomEditing), style: { fontSize: "0.7rem" }, children: isRoomEditing ? "DONE" : "EDIT DECOR" }) })
            ] }),
            isRoomEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", background: "#222", padding: "10px", borderRadius: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.8rem", marginBottom: "10px" }, children: "DRAG OR CLICK TO PLACE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }, children: DECOR_ITEMS.filter((item) => pocketStats?.unlockedDecor?.includes(item.id)).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => setSelectedDecor(item),
                  style: {
                    padding: "10px",
                    background: selectedDecor?.id === item.id ? "var(--neon-blue)" : "#333",
                    borderRadius: "5px",
                    cursor: "pointer",
                    minWidth: "60px",
                    textAlign: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: item.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem" }, children: item.name })
                  ]
                },
                item.id
              )) }),
              DECOR_ITEMS.filter((item) => pocketStats?.unlockedDecor?.includes(item.id)).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "0.8rem" }, children: "No furniture found." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => {
                  onClose();
                  window.location.href = "/shop";
                }, style: { background: "var(--neon-blue)", color: "black" }, children: "GO TO DECOR SHOP" })
              ] })
            ] })
          ] })
        },
        "ROOM"
      )
    ] }) })
  ] }) });
};
export {
  ProfileModal as default
};
