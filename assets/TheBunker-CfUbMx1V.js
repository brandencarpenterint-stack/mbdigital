import { u as useGamification, r as reactExports, a as useRetroSound, s as supabase, k as confetti, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-DhZw-4hp.js";
const TheBunker = () => {
  const { userProfile, shopState, consumeItem, incrementStat } = useGamification() || {};
  const [visualEffects, setVisualEffects] = reactExports.useState([]);
  const { playBeep, playJump } = useRetroSound();
  const [players, setPlayers] = reactExports.useState({});
  const [chatInput, setChatInput] = reactExports.useState("");
  const channelRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const myId = reactExports.useRef(Math.random().toString(36).substr(2, 9));
  const [myPos, setMyPos] = reactExports.useState({ x: 50, y: 50 });
  const [myChat, setMyChat] = reactExports.useState(null);
  const userName = userProfile?.name || "GUEST_" + myId.current.substr(0, 4);
  const avatar = userProfile?.avatar || "/assets/merchboy_face.png";
  reactExports.useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel("bunker_room", {
      config: { broadcast: { ack: false } }
    });
    channel.on("broadcast", { event: "player_action" }, (payload) => {
      const data = payload.payload;
      if (data.type === "fireworks") {
        confetti({
          particleCount: 50,
          spread: 80,
          startVelocity: 40,
          origin: { x: data.x / 100, y: data.y / 100 },
          colors: ["#00ffcc", "#ff00ff", "#ffffff", "#ffaa00"],
          zIndex: 9999
        });
      } else {
        setVisualEffects((prev) => [...prev, { id: Date.now() + Math.random(), type: data.type, x: data.x, y: data.y }]);
        setTimeout(() => {
          setVisualEffects((prev) => prev.filter((e) => Date.now() - e.id < 2e3));
        }, 2e3);
      }
    }).subscribe();
    channelRef.current = channel;
    const heartbeat = setInterval(() => {
      broadcastState();
    }, 2e3);
    const cleanup = setInterval(() => {
      const now = Date.now();
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        let changed = false;
        Object.keys(newPlayers).forEach((id) => {
          if (now - newPlayers[id].lastSeen > 5e3) {
            delete newPlayers[id];
            changed = true;
          }
        });
        return changed ? newPlayers : prev;
      });
    }, 2e3);
    setTimeout(broadcastState, 500);
    const fxCleanup = setInterval(() => {
      setVisualEffects((prev) => prev.filter((e) => Date.now() - parseInt(e.id) < 1500));
    }, 1e3);
    return () => {
      clearInterval(fxCleanup);
      supabase.removeChannel(channel);
      clearInterval(heartbeat);
      clearInterval(cleanup);
    };
  }, [myPos, myChat, userName, avatar]);
  const broadcastState = (overrideChat = myChat) => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "player_update",
      payload: {
        id: myId.current,
        name: userName,
        avatar,
        x: myPos.x,
        y: myPos.y,
        chat: overrideChat
      }
    });
  };
  const handleFloorClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let xPercent = (e.clientX - rect.left) / rect.width * 100;
    let yPercent = (e.clientY - rect.top) / rect.height * 100;
    if (yPercent < 50) yPercent = 50;
    if (yPercent > 95) yPercent = 95;
    if (xPercent < 5) xPercent = 5;
    if (xPercent > 95) xPercent = 95;
    setMyPos({ x: xPercent, y: yPercent });
    playJump();
    setTimeout(broadcastState, 50);
  };
  const sendEmoji = (emoji) => {
    playBeep();
    setMyChat(emoji);
    broadcastState(emoji);
    setTimeout(() => {
      setMyChat((prev) => prev === emoji ? null : prev);
      broadcastState(null);
    }, 3e3);
  };
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setMyChat(msg);
    setChatInput("");
    playBeep();
    broadcastState(msg);
    setTimeout(() => {
      setMyChat((prev) => prev === msg ? null : prev);
      broadcastState(null);
    }, 5e3);
  };
  const renderPlayer = (player, isMe = false) => {
    const pX = isMe ? myPos.x : player.x;
    const pY = isMe ? myPos.y : player.y;
    const pChat = isMe ? myChat : player.chat;
    const pAvatar = isMe ? avatar : player.avatar;
    const pName = isMe ? userName : player.name;
    const scale = 0.6 + (pY - 50) / 50 * 0.6;
    const zIndex = Math.floor(pY);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { x: `${pX}vw`, y: `${pY}vh` },
        animate: { x: `${pX}vw`, y: `${pY}vh` },
        transition: { type: "tween", duration: isMe ? 0.8 : 0.8, ease: "linear" },
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(-50%, -100%) scale(${scale})`,
          // anchor at feet
          zIndex,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: pChat && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10, scale: 0.8 },
              animate: { opacity: 1, y: -10, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
              style: {
                background: "white",
                color: "black",
                padding: "8px 12px",
                borderRadius: "15px",
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                maxWidth: "150px",
                textAlign: "center",
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                position: "relative"
              },
              children: [
                pChat,
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  position: "absolute",
                  bottom: "-5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "6px solid white"
                } })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            background: "rgba(0,0,0,0.6)",
            color: isMe ? "#00ffcc" : "white",
            padding: "2px 8px",
            borderRadius: "10px",
            fontSize: "10px",
            marginBottom: "5px",
            fontWeight: "bold",
            fontFamily: "monospace",
            border: isMe ? "1px solid #00ffcc" : "1px solid #444"
          }, children: pName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#111",
            border: "2px solid #333",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pAvatar, alt: pName, style: { width: "120%", height: "120%", objectFit: "cover" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "40px",
            height: "10px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            marginTop: "-5px",
            filter: "blur(2px)"
          } })
        ]
      },
      isMe ? "me" : player.id
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      onClick: handleFloorClick,
      style: {
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        cursor: "crosshair"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "10%", left: "10%", fontSize: "4rem", color: "#ff0055", opacity: 0.1, fontFamily: "monospace", transform: "rotate(-10deg)", pointerEvents: "none" }, children: "HACK THE PLANET" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "20%", right: "15%", fontSize: "3rem", color: "#00ffcc", textShadow: "0 0 20px #00ffcc", pointerEvents: "none" }, children: "[ SYSTEM_OVR ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "40%", left: 0, width: "100%", height: "2px", background: "rgba(255,255,255,0.1)", pointerEvents: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: "50%", left: 0, width: "100%", height: "50%", background: "rgba(0,0,0,0.3)", borderTop: "2px solid rgba(0,255,204,0.3)", pointerEvents: "none", perspective: "500px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: "100%",
          height: "100%",
          background: "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,255,204,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,255,204,0.05) 20px)",
          transform: "rotateX(60deg)",
          transformOrigin: "top"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "20px", left: "20px", color: "white", fontFamily: "monospace", pointerEvents: "none", background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00ffcc", fontWeight: "bold" }, children: "THE BUNKER (LOBBY)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "PLAYERS ONLINE: ",
            Object.keys(players).length + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "5px" }, children: "Click anywhere on the floor to walk." })
        ] }),
        Object.values(players).map((p) => renderPlayer(p, false)),
        renderPlayer(null, true),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          bottom: "90px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 1e3
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            sendEmoji("🔥");
          }, style: actionBtnStyle, children: "🔥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            sendEmoji("💀");
          }, style: actionBtnStyle, children: "💀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            sendEmoji("🚀");
          }, style: actionBtnStyle, children: "🚀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            sendEmoji("💰");
          }, style: actionBtnStyle, children: "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            triggerFireworks();
          }, style: { ...actionBtnStyle, background: "var(--neon-blue)", color: "black", fontWeight: "bold" }, children: "🧨 FIREWORKS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "500px",
          zIndex: 1e3
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: sendChat, style: { display: "flex", gap: "10px" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: chatInput,
              onChange: (e) => setChatInput(e.target.value),
              placeholder: "Say something to the room...",
              maxLength: 50,
              style: {
                flex: 1,
                padding: "15px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.8)",
                border: "2px solid #00ffcc",
                color: "white",
                fontFamily: "monospace",
                fontSize: "1rem",
                outline: "none",
                boxShadow: "0 0 15px rgba(0,255,204,0.3)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", style: {
            padding: "15px 25px",
            borderRadius: "20px",
            background: "#00ffcc",
            color: "black",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            fontFamily: '"Press Start 2P"'
          }, children: "CHAT" })
        ] }) })
      ]
    }
  );
};
const actionBtnStyle = {
  padding: "10px 15px",
  borderRadius: "15px",
  background: "rgba(0,0,0,0.8)",
  border: "2px solid #444",
  color: "white",
  fontSize: "1.2rem",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
  transition: "transform 0.1s"
};
export {
  TheBunker as default
};
