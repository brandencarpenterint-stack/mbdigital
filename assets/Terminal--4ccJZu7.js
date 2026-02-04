import { a as useGamification, u as usePocketBro, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, e as SHOP_ITEMS } from "./index-DNW_3bB4.js";
import { U as UndergroundModal } from "./UndergroundModal-DN6Fd8mg.js";
import { S as SystemCodex } from "./SystemCodex-Dd8i6Kwg.js";
const Terminal = () => {
  const { addCoins, userProfile, shopState, updateStat, cryptoMarket, addFollowers, coins, buyItem, triggerEvent } = useGamification();
  const { stats, debugUpdate } = usePocketBro();
  const { playBeep, playWin, playCrash } = useRetroSound();
  const [showUnderground, setShowUnderground] = reactExports.useState(false);
  const [showCodex, setShowCodex] = reactExports.useState(false);
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
            if (Math.random() > 0.8) {
              print("ACCESS GRANTED. SIPHONING FUNDS...");
              addCoins(100);
              playWin();
              print("TRANSFER COMPLETE: +100 Coins.");
            } else {
              print("FIREWALL DETECTED. DISCONNECTING.");
              playCrash();
            }
          }, 1500);
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
    showCodex && /* @__PURE__ */ jsxRuntimeExports.jsx(SystemCodex, { onClose: () => setShowCodex(false) })
  ] });
};
export {
  Terminal as default
};
