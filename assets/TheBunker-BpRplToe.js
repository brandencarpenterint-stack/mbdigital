import { g as useNavigate, a as useGamification, r as reactExports, u as useRetroSound, s as supabase, o as confetti, j as jsxRuntimeExports, L as Link, m as motion, A as AnimatePresence } from "./index-Dg19OBOw.js";
const TheBunker = () => {
  const navigate = useNavigate();
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
  const SIMULATED_PATRONS = [
    { id: "patron_dino", name: "Don Dino", avatar: "/assets/skins/face_dino.png", x: 22, y: 68, chat: null },
    { id: "patron_bunny", name: "Cyber Bunny", avatar: "/assets/skins/face_bunny.png", x: 74, y: 72, chat: null },
    { id: "patron_whale", name: "Whale Bro", avatar: "/assets/skins/face_money.png", x: 54, y: 58, chat: null },
    { id: "patron_star", name: "Astro Pilot", avatar: "/assets/skins/face_star.png", x: 38, y: 80, chat: null }
  ];
  const [patrons, setPatrons] = reactExports.useState(SIMULATED_PATRONS);
  reactExports.useEffect(() => {
    const BARK_PHRASES = [
      "Who is ready for Cyber Derby? 🏇",
      "Hitting 21 on the blackjack table! 💰",
      "Moonshot 15x paid out! 🚀",
      "Bunker drinks are free tonight! 🍸",
      "Vault pot is getting huge! 🔓",
      "Number 7 on Roulette paid 35:1! 🎡",
      "🔥",
      "💀"
    ];
    const interval = setInterval(() => {
      setPatrons((prev) => prev.map((p) => {
        if (Math.random() < 0.45) {
          const newX = Math.max(12, Math.min(85, p.x + (Math.random() - 0.5) * 28));
          const newY = Math.max(54, Math.min(84, p.y + (Math.random() - 0.5) * 22));
          const hasChat = Math.random() < 0.35;
          return {
            ...p,
            x: newX,
            y: newY,
            chat: hasChat ? BARK_PHRASES[Math.floor(Math.random() * BARK_PHRASES.length)] : null
          };
        }
        return p;
      }));
    }, 4200);
    return () => clearInterval(interval);
  }, []);
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "20px", left: "20px", color: "white", fontFamily: "monospace", pointerEvents: "none", background: "rgba(0,0,0,0.7)", padding: "12px 18px", borderRadius: "12px", border: "1px solid rgba(0,255,204,0.3)", backdropFilter: "blur(8px)", zIndex: 100 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00ffcc", fontWeight: "bold", fontSize: "1rem", letterSpacing: "1px" }, children: "THE BUNKER (COMMUNITY LOBBY)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#ffd700", marginTop: "2px" }, children: [
            "PLAYERS IN ROOM: ",
            Object.keys(players).length + 1 + (Object.keys(players).length < 2 ? patrons.length : 0)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.7rem", marginTop: "4px" }, children: "Click anywhere on the floor to walk." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "20px", right: "20px", display: "flex", gap: "10px", zIndex: 1e3 }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                window.dispatchEvent(new CustomEvent("spawn-raid-boss"));
                try {
                  playCrash();
                } catch (err) {
                }
              },
              style: {
                background: "linear-gradient(135deg, #ff0055, #ff5500)",
                border: "2px solid rgba(255,255,255,0.4)",
                color: "white",
                padding: "10px 18px",
                borderRadius: "25px",
                fontWeight: "900",
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255,0,85,0.6)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚨" }),
                " SOUND THE ALARM"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/arcade",
              style: {
                background: "rgba(0,0,0,0.7)",
                border: "1px solid #00ffcc",
                color: "#00ffcc",
                padding: "10px 18px",
                borderRadius: "25px",
                fontWeight: "bold",
                fontSize: "0.85rem",
                textDecoration: "none",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center"
              },
              children: "◄ ARCADE"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/blackjack");
            },
            style: {
              position: "absolute",
              top: "28%",
              left: "22%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "#ffd700",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 10px #ffd700",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER 21" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "60px",
                height: "90px",
                background: "linear-gradient(145deg, #182218, #0a140a)",
                border: "3px solid #ffd700",
                borderRadius: "8px 8px 2px 2px",
                boxShadow: "0 0 25px rgba(255,215,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "42px", height: "32px", background: "#000", border: "1px solid #ffd700", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }, children: "🃏" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "14px", background: "#222", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/derby");
            },
            style: {
              position: "absolute",
              top: "32%",
              right: "28%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "#00ff66",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 10px #00ff66",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "BRO DERBY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "60px",
                height: "90px",
                background: "linear-gradient(145deg, #152515, #081208)",
                border: "3px solid #00ff66",
                borderRadius: "8px 8px 2px 2px",
                boxShadow: "0 0 25px rgba(0,255,102,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "42px", height: "32px", background: "#000", border: "1px solid #00ff66", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }, children: "🏇" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "14px", background: "#222", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/plinko");
            },
            style: {
              position: "absolute",
              top: "32%",
              right: "18%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "#ff007f",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 10px #ff007f",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "PLAY PLINKO" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "60px",
                height: "90px",
                background: "linear-gradient(145deg, #222, #111)",
                border: "3px solid #00ffcc",
                borderRadius: "8px 8px 2px 2px",
                boxShadow: "0 0 25px rgba(0,255,204,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "42px", height: "32px", background: "#000", border: "1px solid #ff007f", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }, children: "🔮" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "14px", background: "#333", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/pinball");
            },
            style: {
              position: "absolute",
              top: "35%",
              left: "10%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #ff007f, #00e5ff)",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #ff007f",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER PINBALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #1f0b2e, #090014)",
                border: "3px solid #ff007f",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(255,0,127,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #00e5ff", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "⚡" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #ff007f, #ffd700)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/crash");
            },
            style: {
              position: "absolute",
              top: "68%",
              left: "22%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #ff0055, #ffd700)",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #ff0055",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER CRASH" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #2b0b14, #080104)",
                border: "3px solid #ff0055",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(255,0,85,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #ffd700", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "🚀" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #ff0055, #00e5ff)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/roulette");
            },
            style: {
              position: "absolute",
              top: "18%",
              left: "48%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #00ff66, #ffd700)",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #00ff66",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER ROULETTE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #0b2e1a, #010d06)",
                border: "3px solid #00ff66",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(0,255,102,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #00ff66", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "🎡" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #00ff66, #ff0055)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/scratchers");
            },
            style: {
              position: "absolute",
              top: "28%",
              left: "8%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #ffd700, #ff8800)",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #ffd700",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "SCRATCHERS KIOSK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #2b1f04, #0d0a01)",
                border: "3px solid #ffd700",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(255,215,0,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #ffd700", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "🎟️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #ffd700, #ff3366)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/dozer");
            },
            style: {
              position: "absolute",
              top: "48%",
              left: "8%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #00e5ff, #ff007f)",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #00e5ff",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "COIN DOZER" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #021a22, #00080b)",
                border: "3px solid #00e5ff",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(0,229,255,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #00e5ff", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "⚙️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #00e5ff, #ff007f)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/hilo");
            },
            style: {
              position: "absolute",
              top: "68%",
              left: "8%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #00ff66, #00e5ff)",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #00ff66",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER HI-LO" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #032412, #000c05)",
                border: "3px solid #00ff66",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(0,255,102,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #00ff66", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "🃏" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #00ff66, #00e5ff)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate("/arcade/mines");
            },
            style: {
              position: "absolute",
              top: "48%",
              left: "22%",
              zIndex: 45,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                background: "linear-gradient(90deg, #00e5ff, #00ff66)",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 0 12px #00e5ff",
                marginBottom: "4px",
                animation: "pulse 1.5s infinite"
              }, children: "CYBER MINES" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                width: "64px",
                height: "96px",
                background: "linear-gradient(145deg, #041f26, #010a0d)",
                border: "3px solid #00e5ff",
                borderRadius: "8px 8px 4px 4px",
                boxShadow: "0 0 25px rgba(0,229,255,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "48px", height: "40px", background: "#000", border: "1px solid #00ff66", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }, children: "💎" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "46px", height: "12px", background: "linear-gradient(90deg, #00e5ff, #ffd700)", borderRadius: "3px" } })
              ] })
            ]
          }
        ),
        Object.values(players).concat(Object.keys(players).length < 2 ? patrons : []).map((p) => renderPlayer(p, false)),
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
