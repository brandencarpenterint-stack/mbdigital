import { a as useGamification, r as reactExports, j as jsxRuntimeExports, S as SquishyButton, b as useRetroSound, m as motion, f as ACHIEVEMENTS, D as useNotifications, k as useSquad, E as useTheme, c as useToast, u as usePocketBro, d as STICKER_COLLECTIONS, A as AnimatePresence, g as POCKET_BRO_STAGES, P as PocketPet, t as triggerConfetti, s as supabase } from "./index-CjF5hE3I.js";
import { feedService } from "./feed-foH0nf54.js";
import { S as StickerSprite } from "./StickerSprite-BXlApIj9.js";
import { P as PocketRoom, D as DECOR_ITEMS } from "./PocketRoom-C8XDPXOR.js";
import { S as SystemCodex } from "./SystemCodex-DYWW18BI.js";
import { h as html2canvas } from "./html2canvas.esm-B6qI7jro.js";
const ViralShareCard = ({ onClose }) => {
  const { userProfile: userProfile2, stats, unlockedAchievements, getLevelInfo, coins } = useGamification();
  const cardRef = reactExports.useRef(null);
  const levelInfo = getLevelInfo(stats.xp || 0);
  Math.floor((stats.totalPlayTime || 0) / 60);
  const achievementsCount = unlockedAchievements.length;
  unlockedAchievements.slice(0, 5);
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        // Retina quality
        logging: false,
        useCORS: true
        // For images
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `MERCHBOY_STATS_${userProfile2.name}.png`;
      link.click();
    } catch (err) {
      console.error("Share failed", err);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "var(--neon-green)", textShadow: "0 0 10px var(--neon-green)", marginBottom: "20px" }, children: "YOUR LEGACY CARD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: cardRef, style: {
      width: "350px",
      background: "#111",
      border: "2px solid var(--neon-blue)",
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
      fontFamily: '"Press Start 2P", monospace'
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "linear-gradient(45deg, #FF0055, #7928ca)",
        padding: "20px",
        textAlign: "center",
        borderBottom: "2px solid #333"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "4px solid white",
          margin: "0 auto 10px",
          overflow: "hidden",
          background: "#000"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile2.avatar, style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: "white", fontSize: "1.2rem", textShadow: "2px 2px 0px #000" }, children: userProfile2.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.8)", fontSize: "0.7rem", marginTop: "5px" }, children: [
          "OPERATOR ID: ",
          userProfile2.code
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", background: "repeating-linear-gradient(45deg, #111 0px, #111 10px, #151515 10px, #151515 20px)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#888" }, children: "CURRENT LEVEL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", color: "var(--neon-gold)", textShadow: "0 0 10px gold" }, children: levelInfo.level })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statBoxStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "EARNINGS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: valStyle, children: [
              "🪙 ",
              coins.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statBoxStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "TROPHIES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: valStyle, children: [
              "🏆 ",
              achievementsCount
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statBoxStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "FISH CAUGHT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: valStyle, children: [
              "🐟 ",
              stats.fishCaught || 0
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statBoxStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "HIGH SCORE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: valStyle, children: [
              "🚀 ",
              stats.galaxyHighScore || 0
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          borderTop: "1px solid #333",
          paddingTop: "10px",
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.6rem", color: "#555" }, children: [
            "GENERATED BY",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-blue)" }, children: "MERCHBOY DIGITAL" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem" }, children: "👾" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)",
        backgroundSize: "100% 4px",
        pointerEvents: "none",
        opacity: 0.3
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleDownload, style: { background: "var(--neon-gold)", color: "black", padding: "15px 30px" }, children: "⬇ SAVE IMAGE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { background: "#333" }, children: "CLOSE" })
    ] })
  ] });
};
const statBoxStyle = {
  background: "rgba(0,0,0,0.5)",
  border: "1px solid #333",
  padding: "10px",
  borderRadius: "8px"
};
const labelStyle = {
  fontSize: "0.6rem",
  color: "#666",
  marginBottom: "5px"
};
const valStyle = {
  fontSize: "0.9rem",
  color: "white"
};
const generateRoast = (profile, stats, achievements, pocketStats) => {
  const lines = [];
  const xp = stats.xp || 0;
  if (xp < 100) {
    lines.push("Oh look, a fresh install. Do you even know how to hold a mouse, or did you click here by accident?");
  } else if (xp > 1e4) {
    lines.push("Touch grass immediately. Your keyboard is begging for mercy and your chair has a permanent indent.");
  } else {
    lines.push("Ah, right in the middle. Perfectly average, just like your high school report card.");
  }
  const maxAch = ACHIEVEMENTS.length;
  const unlockedAch = achievements?.length || 0;
  if (unlockedAch === 0) {
    lines.push("0 achievements? You're playing life on spectator mode.");
  } else if (unlockedAch < 5) {
    lines.push(`Wow, ${unlockedAch} whole achievements out of ${maxAch}. My grandmother accidentally unlocks more just by unlocking her phone.`);
  } else if (unlockedAch === maxAch) {
    lines.push("100% completion? Okay tryhard. What's next, are you going to platinum Microsoft Excel?");
  }
  const fish = stats.fishCaught || 0;
  if (fish === 0) {
    lines.push("Zero fish caught. The virtual fish are literally laughing at you.");
  } else if (fish > 50) {
    lines.push(`Caught ${fish} fish? You're aware you can't actually eat them, right?`);
  }
  if (pocketStats) {
    if (pocketStats.happy < 30) {
      lines.push("Your Pocket Bro hates you. It's plotting to delete your system32 folder tonight.");
    }
    if (pocketStats.hunger < 20) {
      lines.push("FEED YOUR PET. It's surviving off pure spite right now.");
    }
  }
  const coins = stats.coins || 0;
  if (coins === 0) {
    lines.push("Broke in real life AND in the game. Consistency is key, I guess.");
  } else if (coins > 5e4) {
    lines.push("Hoarding virtual coins won't fix the economy, Scrooge.");
  }
  const intro = `INITIALIZING AI ROAST ENGINE...
ANALYZING TARGET [${profile.name.toUpperCase()}]...

`;
  return intro + lines.join("\n\n") + "\n\nCONCLUSION: YOU ARE NGMI.";
};
const RoastModal = ({ onClose, profile, stats, achievements, pocketStats }) => {
  const { playClick, playError } = useRetroSound();
  const [roastText, setRoastText] = reactExports.useState("");
  const [isGenerating, setIsGenerating] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fullText = generateRoast(profile, stats, achievements, pocketStats);
    let i = 0;
    playError();
    const typeInterval = setInterval(() => {
      setRoastText((prev) => fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typeInterval);
        setIsGenerating(false);
      }
    }, 30);
    return () => clearInterval(typeInterval);
  }, [profile, stats, achievements, pocketStats, playError]);
  const handleShare = async () => {
    playClick();
    const shareText = `Just got absolutely ROASTED by the Merchboy AI:

"${roastText.replace("INITIALIZING AI ROAST ENGINE...\nANALYZING TARGET [" + profile.name.toUpperCase() + "]...\n\n", "").replace("\n\nCONCLUSION: YOU ARE NGMI.", "")}"

Get roasted at merchboy.com! 🔥`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Merchboy Roast",
          text: shareText
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Roast copied to clipboard!");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(5px)",
    zIndex: 6e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      style: {
        background: "#0a0a0a",
        width: "90%",
        maxWidth: "500px",
        borderRadius: "10px",
        padding: "30px",
        border: "2px solid #ff0055",
        boxShadow: "0 0 30px rgba(255, 0, 85, 0.4), inset 0 0 20px rgba(255, 0, 85, 0.2)",
        display: "flex",
        flexDirection: "column",
        color: "#ff0055",
        fontFamily: '"Courier New", Courier, monospace'
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ff0055", paddingBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { margin: 0, fontSize: "1.2rem", textShadow: "0 0 5px #ff0055", display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "blink", children: "🔥" }),
            " TERMINAL: ROAST_ENGINE.EXE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { padding: "2px 10px", background: "transparent", border: "1px solid #ff0055", color: "#ff0055", fontSize: "0.8rem" }, children: "[X]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crt-effect", style: {
          flex: 1,
          minHeight: "200px",
          background: "#000",
          padding: "15px",
          borderRadius: "5px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          border: "1px solid #333"
        }, children: [
          roastText,
          isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "blink", children: "_" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "15px", marginTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleShare,
            disabled: isGenerating,
            style: {
              flex: 1,
              background: isGenerating ? "#333" : "#ff0055",
              color: isGenerating ? "#666" : "black",
              fontWeight: "bold",
              border: "none",
              padding: "15px",
              fontFamily: '"Press Start 2P"',
              fontSize: "0.8rem"
            },
            children: isGenerating ? "ANALYZING..." : "SHARE TO X/IG 📤"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                    .blink { animation: blink 1s step-end infinite; }
                    @keyframes blink { 50% { opacity: 0; } }
                    .crt-effect::before {
                        content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
                        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                        z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none;
                    }
                ` })
      ]
    }
  ) });
};
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
    addFriend,
    // Use the real function
    unlockedLore
  } = useGamification() || { unlockedLore: [] };
  const [activeTab, setActiveTab] = reactExports.useState("PROFILE");
  const [showShareCard, setShowShareCard] = reactExports.useState(false);
  const [showRoastModal, setShowRoastModal] = reactExports.useState(false);
  const { sendChallenge } = useNotifications();
  const { userSquad, squadScores, getSquadDetails } = useSquad();
  const { themeId, setThemeId } = useTheme();
  const { playClick } = useRetroSound();
  const { showToast } = useToast();
  const handleTabClick = (tab) => {
    playClick();
    setActiveTab(tab);
  };
  const { placeItem, stats: pocketStats } = usePocketBro();
  const [isRoomEditing, setIsRoomEditing] = reactExports.useState(false);
  const [selectedDecor, setSelectedDecor] = reactExports.useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = reactExports.useState(false);
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
            id: data.id,
            // Need ID for updates
            stats: data.stats || {},
            achievements: data.achievements || [],
            placedStickers: data.placedStickers || [],
            guestbook: data.guestbook || [],
            squad: data.squad,
            xp: data.xp,
            pocket_state: data.pocket_state
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
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editName, setEditName] = reactExports.useState(myProfile?.name || "");
  const [editAvatar, setEditAvatar] = reactExports.useState(myProfile?.avatar || AVATARS[0]);
  reactExports.useEffect(() => {
    if (myProfile) {
      setEditName(myProfile.name);
      setEditAvatar(myProfile.avatar);
    }
  }, [myProfile]);
  const handleSave = () => {
    updateProfile({ name: editName, avatar: editAvatar });
    setIsEditing(false);
    playClick();
    showToast("Profile Updated!", "success");
  };
  const [friendCode, setFriendCode] = reactExports.useState("");
  const [visitingFriend, setVisitingFriend] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const effectiveTarget = visitingFriend || (isReadOnly ? displayProfile : null);
    if (effectiveTarget?.pocket_state?.theme) {
      setThemeId(effectiveTarget.pocket_state.theme);
    } else {
      setThemeId(originalTheme);
    }
    return () => setThemeId(originalTheme);
  }, [visitingFriend, isReadOnly, displayProfile, originalTheme, setThemeId]);
  const handleAddFriendClick = () => {
    if (friendCode.trim()) {
      addFriend(friendCode);
      setFriendCode("");
      playClick();
    }
  };
  const [isDecorating, setIsDecorating] = reactExports.useState(false);
  const [localStickers, setLocalStickers] = reactExports.useState([]);
  const flattenedStickers = reactExports.useMemo(() => {
    return STICKER_COLLECTIONS.flatMap((c) => c.items);
  }, []);
  const getStickerUrl = (id) => flattenedStickers.find((s) => s.id === id) || { icon: "❓" };
  const handleAddSticker = (id) => {
    setLocalStickers((prev) => [...prev, {
      id,
      instanceId: Date.now() + Math.random(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: (Math.random() - 0.5) * 40
    }]);
    playClick();
  };
  const handleStickerDragEnd = (instanceId, info) => {
    setLocalStickers((prev) => prev.map((s) => {
      if (s.instanceId === instanceId) {
        return { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y };
      }
      return s;
    }));
  };
  const saveDecoration = () => {
    updateProfile({ placedStickers: localStickers });
    setIsDecorating(false);
    triggerConfetti();
    playClick();
    showToast("Sticker Journal Saved!", "success");
  };
  const displayStats = reactExports.useMemo(() => isReadOnly ? readOnlyProfile.stats || {} : myStats, [isReadOnly, readOnlyProfile, myStats]);
  const displayAchievements = reactExports.useMemo(() => isReadOnly ? readOnlyProfile.achievements || [] : unlockedAchievements, [isReadOnly, readOnlyProfile, unlockedAchievements]);
  const totalUnlocked = displayAchievements.length;
  const levelInfo = reactExports.useMemo(() => getLevelInfo(displayStats.xp || 0), [displayStats.xp, getLevelInfo]);
  const displayStickers = isReadOnly ? readOnlyProfile.placedStickers || [] : myProfile?.placedStickers || [];
  const petStatsToDisplay = isReadOnly ? remoteProfile?.pocket_state || readOnlyProfile?.pocket_state : pocketStats;
  const handleVibe = () => {
    feedService.publish(`vibed with ${displayProfile.name}! ✨`, "love", userProfile?.name);
    triggerConfetti();
    playClick();
  };
  const handleChallenge = () => {
    sendChallenge(displayProfile.id);
    showToast(`Challenged ${displayProfile.name}!`, "info");
  };
  const handleFlex = (targetName) => {
    feedService.publish(`flexed on ${targetName} 💪`, "flex", userProfile?.name);
    playClick();
  };
  const handleSignGuestbook = async (stickerEmoji) => {
    if (!displayProfile.id) {
      showToast("Cannot sign: Identity Unknown", "error");
      return;
    }
    const entry = {
      from: userProfile.name,
      avatar: userProfile.avatar,
      emoji: stickerEmoji,
      ts: Date.now()
    };
    const newGuestbook = [entry, ...displayProfile.guestbook || []].slice(0, 20);
    setRemoteProfile((prev) => ({ ...prev, guestbook: newGuestbook }));
    showToast("Signed Guestbook!", "success");
    const { error } = await supabase.from("profiles").update({ guestbook: newGuestbook }).eq("id", displayProfile.id);
    if (error) {
      console.error("Guestbook Write Error (RLS?):", error);
    } else {
      feedService.publish(`signed ${displayProfile.name}'s Guestbook! ✍️`, "info");
    }
  };
  const handleVisit = async (friend) => {
    if (!friend.pocket_state || !friend.pocket_state.placedItems) {
      try {
        let query = supabase.from("profiles").select("*");
        if (friend.code) query = query.eq("friend_code", friend.code);
        else if (friend.name) query = query.eq("display_name", friend.name);
        else {
          console.error("Cannot visit unknown friend");
          return;
        }
        const { data, error } = await query.single();
        if (data) {
          const fullFriend = {
            ...friend,
            id: data.id,
            pocket_state: data.pocket_state || { placedItems: [] },
            avatar: data.avatar_url || friend.avatar,
            guestbook: data.guestbook || []
          };
          setVisitingFriend(fullFriend);
          return;
        }
      } catch (e) {
        console.error("Visit failed", e);
      }
    }
    setVisitingFriend(friend);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
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
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bento-card", style: {
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
          ),
          unlockedLore?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              onClick: () => handleTabClick("SECRETS"),
              style: {
                margin: 0,
                fontSize: "1.5rem",
                cursor: "pointer",
                color: activeTab === "SECRETS" ? "var(--neon-green)" : "#718096",
                paddingBottom: "5px",
                borderBottom: activeTab === "SECRETS" ? "2px solid var(--neon-green)" : "2px solid transparent",
                animation: "pulse 2s infinite"
              },
              children: "👁️"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: onClose, style: { padding: "5px 15px", background: "#e53e3e" }, children: "X" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "hidden", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        activeTab === "SECRETS" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemCodex, { onClose: () => setActiveTab("PROFILE") }) }),
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
                    petStatsToDisplay && (() => {
                      const currentStageKey = petStatsToDisplay.stage || "EGG";
                      const nextStageIndex = Object.keys(POCKET_BRO_STAGES).indexOf(currentStageKey) + 1;
                      const nextStageKey = Object.keys(POCKET_BRO_STAGES)[nextStageIndex];
                      if (!nextStageKey) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", fontSize: "0.7rem", color: "gold", textAlign: "center" }, children: "MAX LEVEL EVOLUTION REACHED 🌟" });
                      const threshold = POCKET_BRO_STAGES[nextStageKey].threshold;
                      const currentXP = petStatsToDisplay.xp || 0;
                      const pct = Math.min(100, Math.max(0, currentXP / threshold * 100));
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px", background: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "5px" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#aaa", marginBottom: "2px" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: POCKET_BRO_STAGES[currentStageKey]?.name || "Unknown" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "Next: ",
                            POCKET_BRO_STAGES[nextStageKey]?.name
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "4px", background: "#333", borderRadius: "2px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${pct}%`, height: "100%", background: "var(--neon-blue)", boxShadow: "0 0 5px var(--neon-blue)" } }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", fontSize: "0.6rem", color: "#666" }, children: [
                          Math.floor(currentXP),
                          " / ",
                          threshold,
                          " XP"
                        ] })
                      ] });
                    })(),
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
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SquishyButton,
                        {
                          onClick: () => setActiveTab("ROOM"),
                          style: { fontSize: "0.8rem", padding: "8px 15px", background: "var(--neon-green)", marginLeft: "10px", color: "black" },
                          children: "🏠 VISIT ROOM"
                        }
                      )
                    ] }),
                    !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "10px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(true), style: { background: "transparent", border: "none", color: "var(--neon-blue)", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "EDIT PROFILE ✏️" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                        setIsDecorating(true);
                        setLocalStickers(displayProfile.placedStickers || []);
                      }, style: { background: "transparent", border: "none", color: "var(--neon-pink)", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "DECORATE 🎨" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowShareCard(true), style: { background: "transparent", border: "none", color: "var(--neon-gold)", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "SHARE STATS 📤" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowRoastModal(true), style: { background: "transparent", border: "none", color: "#ff0055", cursor: "pointer", padding: "5px 0 0 0", fontSize: "0.8rem", textDecoration: "underline" }, children: "ROAST ME 🔥" })
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
                      children: def.sheet ? /* @__PURE__ */ jsxRuntimeExports.jsx(StickerSprite, { sticker: def, size: "100%" }) : def.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: def.image, alt: def.name, style: { width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))" } }) : def.icon || "❓"
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
                      children: s.sheet ? /* @__PURE__ */ jsxRuntimeExports.jsx(StickerSprite, { sticker: s, size: 50 }) : s.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.image, style: { width: "80%", height: "80%", objectFit: "contain" } }) : s.icon
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "30px", marginBottom: "50px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: {
                    color: "var(--neon-gold)",
                    fontSize: "1.5rem",
                    borderBottom: "2px solid var(--neon-gold)",
                    paddingBottom: "15px",
                    marginBottom: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
                    fontFamily: '"Press Start 2P", cursive',
                    letterSpacing: "2px"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🏆 TROPHY HALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      fontSize: "0.8rem",
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid var(--neon-gold)",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      color: "var(--neon-gold)"
                    }, children: [
                      totalUnlocked,
                      " / ",
                      ACHIEVEMENTS.length
                    ] })
                  ] }),
                  Object.entries(ACHIEVEMENTS.reduce((acc, ach) => {
                    const cat = ach.game || "General";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(ach);
                    return acc;
                  }, {})).map(([category, items]) => {
                    const unlockedInCat = items.filter((i) => displayAchievements.includes(i.id)).length;
                    const isComplete = unlockedInCat === items.length;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "30px", background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "15px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        padding: "0 10px",
                        borderLeft: isComplete ? "4px solid var(--neon-green)" : "4px solid #555",
                        paddingLeft: "15px"
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: "bold", color: isComplete ? "var(--neon-green)" : "#ddd", fontSize: "1rem", letterSpacing: "1px" }, children: [
                          category.toUpperCase(),
                          isComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "10px", fontSize: "0.8rem", background: "var(--neon-green)", color: "black", padding: "2px 6px", borderRadius: "4px" }, children: "COMPLETE" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#888", fontFamily: "monospace" }, children: [
                          "[",
                          unlockedInCat.toString().padStart(2, "0"),
                          " / ",
                          items.length.toString().padStart(2, "0"),
                          "]"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }, children: items.map((ach) => {
                        const isUnlocked = displayAchievements.includes(ach.id);
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.div,
                          {
                            whileHover: { scale: 1.05, y: -5 },
                            style: {
                              position: "relative",
                              background: isUnlocked ? "linear-gradient(135deg, rgba(40,40,50,0.9), rgba(10,10,10,0.9))" : "rgba(0,0,0,0.5)",
                              border: isUnlocked ? "1px solid rgba(255, 215, 0, 0.5)" : "1px solid #333",
                              borderRadius: "12px",
                              padding: "15px 10px",
                              opacity: isUnlocked ? 1 : 0.6,
                              boxShadow: isUnlocked ? "0 0 15px rgba(255, 215, 0, 0.1)" : "none",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              filter: isUnlocked ? "none" : "grayscale(100%)",
                              height: "100%",
                              justifyContent: "space-between"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "10px" }, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                                  fontSize: "2rem",
                                  marginBottom: "5px",
                                  filter: isUnlocked ? "drop-shadow(0 0 8px gold)" : "none"
                                }, children: isUnlocked ? "🏆" : "🔒" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                                  fontWeight: "bold",
                                  fontSize: "0.65rem",
                                  color: isUnlocked ? "var(--neon-gold)" : "#666",
                                  textTransform: "uppercase",
                                  marginBottom: "5px"
                                }, children: ach.title }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.55rem", color: "#999", lineHeight: "1.2" }, children: ach.description })
                              ] }),
                              isUnlocked && ach.reward && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                                marginTop: "10px",
                                fontSize: "0.5rem",
                                color: "var(--neon-blue)",
                                background: "rgba(0, 200, 255, 0.1)",
                                padding: "3px 8px",
                                borderRadius: "10px",
                                border: "1px solid rgba(0, 200, 255, 0.3)"
                              }, children: [
                                "🎁 ",
                                ach.reward
                              ] })
                            ]
                          },
                          ach.id
                        );
                      }) })
                    ] }, category);
                  })
                ] })
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
            children: !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: visitingFriend ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", height: "100%", position: "relative" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "100%",
                background: "#2d3748",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: visitingFriend.avatar || AVATARS[0], style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { margin: 0, fontSize: "1rem", color: "white" }, children: [
                    "VISITING: ",
                    visitingFriend.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setVisitingFriend(null), style: { fontSize: "0.8rem", padding: "5px 10px", background: "#e53e3e" }, children: "LEAVE" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                flex: 1,
                width: "100%",
                position: "relative",
                background: "#000",
                borderRadius: "20px",
                overflow: "hidden",
                border: "2px solid #333"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PocketRoom,
                {
                  isEditing: false,
                  customItems: visitingFriend.pocket_state?.placedItems || [],
                  petComponent: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PocketPet,
                    {
                      type: visitingFriend.pocket_state?.type || "SOOT",
                      stage: visitingFriend.pocket_state?.stage || "EGG",
                      mood: (visitingFriend.pocket_state?.happy || 50) < 40 ? "sad" : "happy",
                      color: visitingFriend.pocket_state?.color,
                      effect: visitingFriend.pocket_state?.tempStatus
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", display: "flex", gap: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => {
                triggerConfetti();
                feedService.publish(`vibed with ${visitingFriend.name}'s room!`, "love");
              }, style: { background: "var(--neon-pink)", width: "100%" }, children: "✨ VIBE CHECK" }) })
            ] }) : (
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
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SquishyButton,
                      {
                        onClick: () => handleVisit(friend),
                        style: { fontSize: "0.8rem", padding: "8px 15px", background: "var(--neon-blue)", marginLeft: "10px" },
                        children: "🏠"
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
                    customItems: isReadOnly ? displayProfile.pocket_state?.placedItems || [] : null,
                    petComponent: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PocketPet,
                      {
                        type: petStatsToDisplay?.type || "SOOT",
                        stage: petStatsToDisplay?.stage || "EGG",
                        mood: (petStatsToDisplay?.happy || 50) < 40 ? "sad" : "happy",
                        color: petStatsToDisplay?.color,
                        effect: petStatsToDisplay?.tempStatus
                      }
                    )
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
              ] }),
              !isRoomEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "15px", border: "1px solid #333" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { margin: "0 0 10px 0", fontSize: "1rem", color: "#ff0055", letterSpacing: "2px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GUESTBOOK ✍️" }),
                  isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setShowEmojiPicker(!showEmojiPicker), style: { fontSize: "0.7rem", padding: "5px 10px", background: "#ff0055" }, children: "SIGN LOG" }),
                    showEmojiPicker && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#222",
                      border: "1px solid #555",
                      borderRadius: "10px",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "5px",
                      zIndex: 100,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
                    }, children: ["🔥", "👾", "👽", "❤️", "💩", "👑", "👋", "💀"].map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        onClick: () => {
                          handleSignGuestbook(emoji);
                          setShowEmojiPicker(false);
                        },
                        style: { fontSize: "1.5rem", cursor: "pointer", padding: "5px", borderRadius: "5px", background: "rgba(255,255,255,0.1)" },
                        children: emoji
                      },
                      emoji
                    )) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto" }, children: [
                  (!displayProfile.guestbook || displayProfile.guestbook.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontStyle: "italic", fontSize: "0.8rem", textAlign: "center" }, children: "Be the first to sign!" }),
                  displayProfile.guestbook?.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "8px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem" }, children: entry.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: "bold" }, children: entry.from }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#888" }, children: new Date(entry.ts).toLocaleDateString() })
                    ] })
                  ] }, idx))
                ] })
              ] })
            ] })
          },
          "ROOM"
        )
      ] }) })
    ] }),
    showShareCard && /* @__PURE__ */ jsxRuntimeExports.jsx(ViralShareCard, { onClose: () => setShowShareCard(false) }),
    showRoastModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RoastModal,
      {
        onClose: () => setShowRoastModal(false),
        profile: displayProfile,
        stats: displayStats,
        achievements: displayAchievements,
        pocketStats: petStatsToDisplay
      }
    )
  ] });
};
export {
  ProfileModal as default
};
