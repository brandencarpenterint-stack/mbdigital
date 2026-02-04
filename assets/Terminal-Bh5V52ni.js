import { b as useRetroSound, r as reactExports, j as jsxRuntimeExports, a as useGamification, u as usePocketBro, e as SHOP_ITEMS } from "./index-_TtGPJrl.js";
import { U as UndergroundModal } from "./UndergroundModal-5PO9S_f7.js";
import { S as SystemCodex } from "./SystemCodex-e0cg1sdc.js";
const HackingMinigame = ({ target, difficulty = 1, onComplete, onClose }) => {
  const { playBeep, playCollect, playCrash, playWin } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const TARGET_ZONES = 3 + difficulty;
  const SPEED_BASE = 5 + difficulty * 2;
  const [gameState, setGameState] = reactExports.useState("START");
  const [hits, setHits] = reactExports.useState(0);
  const [cursorPos, setCursorPos] = reactExports.useState(0);
  const [targetPos, setTargetPos] = reactExports.useState(Math.random() * 80 + 10);
  const [direction, setDirection] = reactExports.useState(1);
  const [speed, setSpeed] = reactExports.useState(SPEED_BASE);
  const requestRef = reactExports.useRef();
  const matrixRef = reactExports.useRef();
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;
    const cols = Math.floor(canvas.width / 20);
    const ypos = Array(cols).fill(0);
    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 10, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gameState === "FAIL" ? "#f00" : "#0f0";
      ctx.font = "15px monospace";
      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 1e4) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
      matrixRef.current = requestAnimationFrame(drawMatrix);
    };
    drawMatrix();
    return () => cancelAnimationFrame(matrixRef.current);
  }, [gameState]);
  const animate = () => {
    if (gameState === "PLAYING") {
      setCursorPos((prev) => {
        let next = prev + speed * direction * 0.5;
        if (next >= 100 || next <= 0) {
          setDirection((d) => d * -1);
          next = next >= 100 ? 100 : 0;
        }
        return next;
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  };
  reactExports.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, speed, direction]);
  const handleAction = () => {
    if (gameState === "START") {
      setGameState("PLAYING");
      playBeep();
      return;
    }
    if (gameState === "PLAYING") {
      const diff = Math.abs(cursorPos - targetPos);
      const HIT_WINDOW = 10;
      if (diff <= HIT_WINDOW) {
        const newHits = hits + 1;
        setHits(newHits);
        playCollect();
        if (newHits >= TARGET_ZONES) {
          setGameState("WIN");
          playWin();
          setTimeout(() => onComplete(true), 1500);
        } else {
          setTargetPos(Math.random() * 80 + 10);
          setSpeed((s) => s * 1.2);
        }
      } else {
        setGameState("FAIL");
        playCrash();
        setTimeout(() => onComplete(false), 1500);
      }
    }
  };
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" || e.code === "Enter") handleAction();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, cursorPos, targetPos, hits]);
  const colorPrimary = gameState === "FAIL" ? "#ff0055" : "#00ff41";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1e4,
    backdropFilter: "blur(8px)",
    fontFamily: '"Courier New", monospace'
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      width: "600px",
      height: "400px",
      background: "#000",
      border: `2px solid ${colorPrimary}`,
      boxShadow: `0 0 50px ${colorPrimary}40`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: gameState === "FAIL" ? "shake 0.5s" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { position: "absolute", inset: 0, opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
        backgroundSize: "100% 2px, 3px 100%",
        pointerEvents: "none",
        zIndex: 20
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 10, padding: "30px", height: "100%", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "20px", color: colorPrimary, textShadow: `0 0 5px ${colorPrimary}` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "TARGET: ",
            target.toUpperCase()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "STATUS: ",
            gameState
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "40px", display: "flex", gap: "5px" }, children: Array(TARGET_ZONES).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          flex: 1,
          height: "8px",
          background: i < hits ? colorPrimary : "#222",
          border: `1px solid ${colorPrimary}`,
          boxShadow: i < hits ? `0 0 10px ${colorPrimary}` : "none",
          transition: "all 0.2s"
        } }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          flex: 1,
          position: "relative",
          background: "rgba(0,0,0,0.6)",
          border: `1px dashed ${colorPrimary}60`,
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: [
          gameState === "START" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            color: colorPrimary,
            animation: "pulse 0.8s infinite",
            textAlign: "center"
          }, children: "[ PRESS SPACE TO BREACH ]" }),
          gameState === "WIN" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", color: colorPrimary, textShadow: `0 0 30px ${colorPrimary}`, fontWeight: "bold" }, children: "ACCESS GRANTED" }),
          gameState === "FAIL" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", color: colorPrimary, textShadow: `0 0 30px ${colorPrimary}`, fontWeight: "bold" }, children: "BREACH DETECTED" }),
          (gameState === "PLAYING" || gameState === "START") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: "100%",
            height: "60px",
            background: "#111",
            position: "relative",
            overflow: "hidden",
            borderTop: `1px solid ${colorPrimary}`,
            borderBottom: `1px solid ${colorPrimary}`
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              left: `${targetPos}%`,
              top: 0,
              bottom: 0,
              width: "12%",
              background: `${colorPrimary}20`,
              borderLeft: `2px solid ${colorPrimary}`,
              borderRight: `2px solid ${colorPrimary}`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 15px ${colorPrimary}40`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              left: `${cursorPos}%`,
              top: 0,
              bottom: 0,
              width: "4px",
              background: "#fff",
              boxShadow: "0 0 15px #fff",
              transform: "translateX(-50%)",
              zIndex: 5
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: colorPrimary, opacity: 0.7, display: "flex", justifyContent: "space-between", fontFamily: "monospace" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "SPEED: ",
            Math.round(speed * 10),
            " MHz"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "BUFFER: ",
            hits,
            "/",
            TARGET_ZONES
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onClose(), style: {
      position: "absolute",
      top: 20,
      right: 20,
      background: "rgba(0,0,0,0.5)",
      border: "1px solid #444",
      color: "#888",
      padding: "8px 16px",
      cursor: "pointer",
      fontFamily: "monospace",
      transition: "all 0.2s"
    }, children: "[ ESC ] ABORT" })
  ] });
};
const Terminal = () => {
  const { addCoins, userProfile, shopState, updateStat, cryptoMarket, addFollowers, coins, buyItem, triggerEvent } = useGamification();
  const { stats, debugUpdate } = usePocketBro();
  const { playBeep, playWin, playCrash } = useRetroSound();
  const [showUnderground, setShowUnderground] = reactExports.useState(false);
  const [showCodex, setShowCodex] = reactExports.useState(false);
  const [hackTarget, setHackTarget] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([
    "MERCHBOY_OS [Version 9.7.2]",
    "(c) MBDigital Corp. All rights reserved.",
    " ",
    "Initializing core... OK.",
    "Loading secrets... <ENCRYPTED>",
    "Type 'help' for available commands.",
    " "
  ]);
  const [input, setInput] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  reactExports.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const print = (text) => setHistory((prev) => [...prev, text]);
  const handleCommand = (cmdStr) => {
    const parts = cmdStr.trim().split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    playBeep();
    print(`> ${cmdStr}`);
    switch (cmd) {
      case "help":
        print("AVAILABLE COMMANDS:");
        print("  status       - Show system/user status");
        print("  whoami       - User identity info");
        print("  clear        - Clear terminal");
        print("  echo [text]  - Echo text back");
        print("  music [on/off] - Toggle radio (simulated)");
        print("  hack [target] - Attempt a hack (risky)");
        print("  botnet [amt]  - Buy fans (Illegal). 100/coin.");
        print("  analyze [id]  - Insider info on Crypto Trend.");
        print("  darkweb       - Access forbidden upgrades.");
        print("  buy [id]      - Purchase software/upgrades.");
        print("  buy [id]      - Purchase software/upgrades.");
        print("  event [type]  - DEBUG: trigger meteor/rain/glitch/void");
        print("  matrix       - Toggle visual mode");
        print("  shop         - List installed software (items)");
        print("  date         - Check Server Time");
        print("  codex        - Access The Ghost Files (Lore)");
        print("  exit         - Return to GUI");
        break;
      case "status":
        print("--- SYSTEM STATUS ---");
        print(`USER: ${userProfile?.name || "GUEST"}`);
        print(`COINS: ${localStorage.getItem("arcadeCoins")}`);
        print(`POCKET_BRO: ${stats.stage} (${stats.happy}% Happy)`);
        print(`UPTIME: ${Math.floor(performance.now() / 1e3)}s`);
        break;
      case "whoami":
        print("You are the Operator.");
        print("The ghost in the machine.");
        print(`UID: ${userProfile?.code || "UNKNOWN"}`);
        break;
      case "clear":
        setHistory([]);
        break;
      case "date":
        const now = /* @__PURE__ */ new Date();
        print(`SERVER TIME: ${now.toLocaleTimeString()}`);
        print(`DATE: ${now.toLocaleDateString()}`);
        break;
      case "echo":
        print(args.join(" "));
        break;
      case "exit":
        window.location.href = "/";
        break;
      case "hack":
        if (args[0] === "bank") {
          print("Connecting to Global Bank...");
          setTimeout(() => {
            print("FIREWALL DETECTED. BYPASS REQUIRED.");
            setHackTarget("bank");
          }, 500);
        } else if (args[0] === "pocketbro") {
          print("Injecting happiness serum...");
          debugUpdate({ happy: 100, hunger: 100 });
          print("Subject is now euphoric.");
        } else {
          print("Usage: hack [bank | pocketbro]");
        }
        break;
      case "botnet":
        const amount = parseInt(args[0]) || 100;
        const botCost = Math.floor(amount * 0.5);
        print(`Initiating Botnet for ${amount} users... Cost: ${botCost} CP`);
        if (window.confirm(`Launch Botnet? Cost: ${botCost}`)) {
          if (coins >= botCost) {
            addCoins(-botCost);
            setTimeout(() => {
              print(`BOTNET ONLINE. FLOODING SERVERS...`);
              addFollowers(amount);
              playWin();
            }, 1e3);
          } else {
            print("INSUFFICIENT FUNDS.");
          }
        }
        break;
      case "analyze":
        const token = cryptoMarket.find((t) => t.id === args[0]?.toUpperCase());
        if (!token) {
          print("Usage: analyze [MCH | DOG | VOD | GLT]");
        } else {
          print(`ANALYZING ${token.name}...`);
          setTimeout(() => {
            const hasInsider = shopState.unlocked.includes("hack_insider");
            if (hasInsider) {
              print(`--- INSIDER CHIP v1.0 ACTIVE ---`);
              print(`TOKEN: ${token.name}`);
              print(`EXACT TREND: ${token.trend.toFixed(6)}`);
              print(`VOLATILITY: ${(token.volatility * 100).toFixed(1)}%`);
              const willPump = token.trend > 0;
              print(`PREDICTION: ${willPump ? "🚀 PUMP (99%)" : "📉 DUMP (99%)"}`);
            } else {
              const sentiment = token.trend > 0.2 ? "BULLISH (MOON SOON)" : token.trend > 0 ? "SLIGHTLY POSITIVE" : token.trend < -0.2 ? "BEARISH (CRASH IMMINENT)" : "STAGNANT";
              print(`REPORT: ${sentiment}`);
              print(`CONFIDENCE: ${Math.floor(Math.random() * 20 + 60)}%`);
              print(`(Buy 'Insider Chip' on darkweb for precision)`);
            }
          }, 1e3);
        }
        break;
      case "matrix":
        document.body.classList.toggle("glitch-active");
        print("Visuals toggled.");
        break;
      case "shop":
        print("--- INSTALLED MODULES ---");
        shopState?.unlocked?.forEach((item) => print(`- ${item}`));
        break;
      case "darkweb":
      case "blackmarket":
      case "underground":
        print("--- CONNECTING TO ONION ROUTER... ---");
        setTimeout(() => {
          const hour = (/* @__PURE__ */ new Date()).getHours();
          const hasRoot = shopState.unlocked.includes("hack_root");
          const isNight = hour >= 22 || hour < 4;
          if (isNight || hasRoot) {
            print("ENCRYPTED CONNECTION ESTABLISHED.");
            if (hasRoot && !isNight) print("ROOT ACCESS DETECTED. BYPASSING TIME GATE.");
            print("Welcome to The Underground.");
            setShowUnderground(true);
          } else {
            print("CONNECTION REFUSED.");
            print(`ERR_TIME_GATE: Market open 22:00 - 04:00.`);
            print(`Current Server Time: ${hour}:00`);
            playCrash();
          }
        }, 1e3);
        break;
      case "buy":
        const itemId = args[0];
        if (!itemId) {
          print("Usage: buy [item_id]");
        } else {
          const item = SHOP_ITEMS.find((i) => i.id === itemId);
          if (!item) {
            print("ERROR: Item not found.");
          } else if (shopState.unlocked.includes(itemId)) {
            print("ERROR: Already owned.");
          } else {
            if (buyItem(item)) {
              print(`SUCCESS: Purchased ${item.name}.`);
              print("Instaling...");
            } else {
              print("ERROR: Transaction failed (Insufficient Funds).");
            }
          }
        }
        break;
      case "codex":
      case "files":
      case "ghosts":
        print("OPENING CLASSIFIED ARCHIVES...");
        setShowCodex(true);
        break;
      case "event":
        const evtType = args[0]?.toUpperCase();
        const validEvents = ["METEOR_SHOWER", "NEON_RAIN", "GLITCH_STORM", "GOLD_RUSH", "VOID_CALM"];
        const match = validEvents.find((e) => e.includes(evtType));
        if (match) {
          triggerEvent(match);
          print(`INITIATING GLOBAL EVENT SEQUENCE: ${match}...`);
        } else {
          print("Usage: event [METEOR | RAIN | GLITCH | GOLD | VOID]");
        }
        break;
      // SECRET COMMANDS
      case "sudo":
        print("User is not in the sudoers file. This incident will be reported.");
        break;
      case "merchboy":
        print("THE LEGEND. THE MYTH. THE BRAND.");
        break;
      // RADIO SECRETS
      case "...help...me...":
      case "help me":
        print("Signal received... Origin: THE VOID.");
        print("Download complete.");
        if (!shopState.unlocked.includes("ghost_badge")) {
          print("Ghost Badge added to profile.");
        }
        break;
      case "system override":
      case "system_override":
        print("AUTHENTICATING DEVELOPER ACCESS...");
        setTimeout(() => {
          print("ACCESS GRANTED.");
          print("Unlocking DEV_TUNER for Radio Widget...");
          const devItem = SHOP_ITEMS.find((i) => i.id === "radio_dev");
          if (devItem && !shopState.unlocked.includes("radio_dev")) {
            buyItem({ ...devItem, price: 0 });
          } else if (shopState.unlocked.includes("radio_dev")) {
            print("ALREADY UNLOCKED.");
          }
        }, 1e3);
        break;
      case "bigdawg":
        print("WOOF WOOF 🐶. YOU ARE NOW TOP DOG.");
        addCoins(1e3);
        playWin();
        break;
      default:
        print(`Command not found: ${cmd}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "black",
    color: "#00ff00",
    fontFamily: '"Courier New", monospace',
    minHeight: "100vh",
    padding: "20px",
    fontSize: "1.2rem",
    overflowY: "auto"
  }, onClick: () => inputRef.current?.focus(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      inset: 0,
      background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
      backgroundSize: "100% 2px, 3px 100%",
      pointerEvents: "none",
      opacity: 0.6
    } }),
    history.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap", marginBottom: "5px" }, children: line }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginRight: "10px" }, children: userProfile?.name ? `${userProfile.name}@MBOS:~#` : "guest@MBOS:~#" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          style: {
            background: "transparent",
            border: "none",
            color: "#00ff00",
            fontFamily: "inherit",
            fontSize: "inherit",
            outline: "none",
            flex: 1,
            caretColor: "#00ff00"
          },
          autoFocus: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef }),
    showUnderground && /* @__PURE__ */ jsxRuntimeExports.jsx(UndergroundModal, { onClose: () => setShowUnderground(false) }),
    showCodex && /* @__PURE__ */ jsxRuntimeExports.jsx(SystemCodex, { onClose: () => setShowCodex(false) }),
    hackTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HackingMinigame,
      {
        target: hackTarget,
        difficulty: 1,
        onClose: () => {
          setHackTarget(null);
          print("HACK ABORTED.");
        },
        onComplete: (success) => {
          setHackTarget(null);
          if (success) {
            print("ACCESS GRANTED. SIPHONING FUNDS...");
            const amount = Math.floor(Math.random() * 200) + 50;
            addCoins(amount);
            playWin();
            print(`TRANSFER COMPLETE: +${amount} Coins.`);
          } else {
            print("ACCESS DENIED. TRACE DETECTED.");
            playCrash();
          }
        }
      }
    )
  ] });
};
export {
  Terminal as default
};
