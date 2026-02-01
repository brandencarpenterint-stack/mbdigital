import { r as reactExports, b as useGamification, c as useRetroSound, j as jsxRuntimeExports, t as triggerConfetti } from "./index-Csj9Q7BA.js";
const COMMON_SUBS = [
  // STREAMING
  { id: "netflix", name: "Netflix", price: 15.49, color: "#E50914", cancelUrl: "https://www.netflix.com/youraccount" },
  { id: "hulu", name: "Hulu", price: 7.99, color: "#1CE783", cancelUrl: "https://secure.hulu.com/account" },
  { id: "disney", name: "Disney+", price: 13.99, color: "#113CCF", cancelUrl: "https://www.disneyplus.com/account" },
  { id: "hbo", name: "Max (HBO)", price: 15.99, color: "#5426C9", cancelUrl: "https://auth.max.com/subscription" },
  { id: "prime", name: "Amazon Prime", price: 14.99, color: "#00A8E1", cancelUrl: "https://www.amazon.com/mc/pipeline/cancellation" },
  { id: "peacock", name: "Peacock", price: 5.99, color: "#000000", cancelUrl: "https://www.peacocktv.com/account" },
  { id: "paramount", name: "Paramount+", price: 5.99, color: "#0066FF", cancelUrl: "https://www.paramountplus.com/account/" },
  { id: "appletv", name: "Apple TV+", price: 9.99, color: "#000000", cancelUrl: "https://tv.apple.com/settings" },
  { id: "youtube", name: "YouTube Premium", price: 13.99, color: "#FF0000", cancelUrl: "https://www.youtube.com/paid_memberships" },
  { id: "crunchyroll", name: "Crunchyroll", price: 7.99, color: "#F47521", cancelUrl: "https://www.crunchyroll.com/account/membership" },
  // MUSIC
  { id: "spotify", name: "Spotify", price: 10.99, color: "#1DB954", cancelUrl: "https://www.spotify.com/us/account/subscription" },
  { id: "applemusic", name: "Apple Music", price: 10.99, color: "#FA243C", cancelUrl: "https://music.apple.com/account" },
  { id: "tidal", name: "Tidal", price: 10.99, color: "#000000", cancelUrl: "https://account.tidal.com" },
  { id: "soundcloud", name: "SoundCloud", price: 9.99, color: "#FF5500", cancelUrl: "https://soundcloud.com/you/subscriptions" },
  // TECH / PROD
  { id: "chatgpt", name: "ChatGPT Plus", price: 20, color: "#10A37F", cancelUrl: "https://chat.openai.com/#settings/DataControls" },
  { id: "adobe", name: "Adobe Creative Cloud", price: 54.99, color: "#FF0000", cancelUrl: "https://account.adobe.com/plans" },
  { id: "dropbox", name: "Dropbox", price: 11.99, color: "#0061FF", cancelUrl: "https://www.dropbox.com/account/plan" },
  { id: "midjourney", name: "Midjourney", price: 10, color: "#FFFFFF", cancelUrl: "https://www.midjourney.com/account" },
  { id: "github", name: "GitHub Copilot", price: 10, color: "#171515", cancelUrl: "https://github.com/settings/billing" },
  // GAMING
  { id: "xbox", name: "Xbox Game Pass", price: 16.99, color: "#107C10", cancelUrl: "https://account.microsoft.com/services" },
  { id: "psn", name: "PlayStation Plus", price: 9.99, color: "#00439C", cancelUrl: "https://www.playstation.com/acct/management" },
  { id: "nintendo", name: "Nintendo Switch Online", price: 3.99, color: "#E60012", cancelUrl: "https://ec.nintendo.com/my/membership" },
  // LIFESTYLE
  { id: "peloton", name: "Peloton", price: 44, color: "#FF3347", cancelUrl: "https://www.onepeloton.com/profile/subscriptions" },
  { id: "audible", name: "Audible", price: 14.95, color: "#F7991C", cancelUrl: "https://www.audible.com/account/overview" },
  { id: "duolingo", name: "Duolingo Plus", price: 6.99, color: "#58CC02", cancelUrl: "https://www.duolingo.com/settings/plus" },
  { id: "dashpass", name: "DoorDash DashPass", price: 9.99, color: "#FF3008", cancelUrl: "https://www.doordash.com/consumer/checkout/dashpass_management" },
  { id: "uberone", name: "Uber One", price: 9.99, color: "#000000", cancelUrl: "https://wallet.uber.com/" }
];
const SubSlayer = () => {
  const [mySubs, setMySubs] = reactExports.useState(() => {
    const saved = localStorage.getItem("subSlayerData");
    return saved ? JSON.parse(saved) : [];
  });
  const [slainSubs, setSlainSubs] = reactExports.useState(() => {
    const saved = localStorage.getItem("subSlayerKills");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [customName, setCustomName] = reactExports.useState("");
  const [customPrice, setCustomPrice] = reactExports.useState("");
  const { addCoins } = useGamification() || { addCoins: () => {
  } };
  const { playWin } = useRetroSound();
  const [rewardHistory, setRewardHistory] = reactExports.useState(() => {
    const saved = localStorage.getItem("subSlayerRewards");
    return saved ? JSON.parse(saved) : {};
  });
  reactExports.useEffect(() => {
    localStorage.setItem("subSlayerData", JSON.stringify(mySubs));
    localStorage.setItem("subSlayerKills", JSON.stringify(slainSubs));
    localStorage.setItem("subSlayerRewards", JSON.stringify(rewardHistory));
  }, [mySubs, slainSubs, rewardHistory]);
  const addSub = (sub) => {
    if (!mySubs.find((s) => s.id === sub.id)) {
      setMySubs([...mySubs, { ...sub, instanceId: Date.now() }]);
    }
    setIsAdding(false);
  };
  const addCustomSub = () => {
    if (!customName || !customPrice) return;
    setMySubs([...mySubs, {
      id: `custom-${Date.now()}`,
      name: customName,
      price: parseFloat(customPrice),
      color: "#999",
      cancelUrl: null,
      instanceId: Date.now()
    }]);
    setCustomName("");
    setCustomPrice("");
    setIsAdding(false);
  };
  const slaySub = (sub) => {
    setMySubs(mySubs.filter((s) => s.id !== sub.id));
    setSlainSubs([...slainSubs, { ...sub, slainDate: (/* @__PURE__ */ new Date()).toLocaleDateString() }]);
    if (sub.cancelUrl) {
      window.open(sub.cancelUrl, "_blank");
    } else {
      alert(`No direct link for ${sub.name}. Check your bank statement or settings!`);
    }
    const now = Date.now();
    const COOLDOWN_DAYS = 150;
    const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1e3;
    const lastReward = rewardHistory[sub.id];
    if (lastReward && now - lastReward < COOLDOWN_MS) {
      const daysLeft = Math.ceil((COOLDOWN_MS - (now - lastReward)) / (24 * 60 * 60 * 1e3));
      alert(`⚠️ REWARD DENIED ⚠️

You already claimed coins for ${sub.name}.
Cooldown active: ${daysLeft} days remaining.`);
    } else {
      const coinReward = Math.floor(sub.price * 100);
      addCoins(coinReward);
      playWin();
      triggerConfetti();
      setRewardHistory((prev) => ({
        ...prev,
        [sub.id]: now
      }));
      setTimeout(() => alert(`⚔️ SUBSCRIPTION SLAIN! ⚔️

To reward your fiscal responsibility, you have been awarded:
💰 ${coinReward} ARCADE COINS!`), 500);
    }
  };
  const restoreSub = (sub) => {
    setSlainSubs(slainSubs.filter((s) => s.id !== sub.id));
    setMySubs([...mySubs, sub]);
  };
  const totalMonthly = mySubs.reduce((acc, sub) => acc + sub.price, 0);
  const totalYearly = totalMonthly * 12;
  const totalSavedYearly = slainSubs.reduce((acc, sub) => acc + sub.price, 0) * 12;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-enter", style: {
    background: "linear-gradient(to bottom right, #000000, #1a0b2e)",
    minHeight: "100vh",
    color: "white",
    padding: "40px 20px 120px",
    fontFamily: "Inter, sans-serif"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "900px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      textAlign: "center",
      marginBottom: "50px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", marginBottom: "10px" }, children: "⚔️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        fontFamily: '"Orbitron", sans-serif',
        fontSize: "3.5rem",
        margin: "0",
        color: "var(--neon-pink)",
        textShadow: "0 0 30px rgba(255, 0, 85, 0.4)",
        textTransform: "uppercase",
        letterSpacing: "2px"
      }, children: "SUB SLAYER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", marginTop: "10px", fontSize: "1.1rem" }, children: [
        "Audit your recurring expenses. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--neon-pink)", fontWeight: "bold" }, children: "Kill the waste." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
      marginBottom: "50px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { padding: "25px", textAlign: "center", borderTop: "4px solid #fff" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }, children: "Monthly Cost" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.5rem", fontWeight: "bold", color: "#fff", fontFamily: '"Orbitron", sans-serif' }, children: [
          "$",
          totalMonthly.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
        padding: "25px",
        textAlign: "center",
        borderTop: "4px solid var(--neon-pink)",
        background: "rgba(255, 0, 85, 0.05)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "var(--neon-pink)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px" }, children: "Yearly Bleed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.5rem", fontWeight: "bold", color: "var(--neon-pink)", fontFamily: '"Orbitron", sans-serif', textShadow: "0 0 15px rgba(255, 0, 85, 0.4)" }, children: [
          "$",
          totalYearly.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
        padding: "25px",
        textAlign: "center",
        borderTop: "4px solid var(--neon-green)",
        background: "rgba(0, 255, 170, 0.05)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: "1px" }, children: "Total Saved / Yr" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.5rem", fontWeight: "bold", color: "var(--neon-green)", fontFamily: '"Orbitron", sans-serif', textShadow: "0 0 15px rgba(0, 255, 170, 0.4)" }, children: [
          "$",
          totalSavedYearly.toFixed(2)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: {
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      paddingBottom: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: '"Orbitron", sans-serif',
      letterSpacing: "1px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "ACTIVE SUBS (",
        mySubs.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "squishy-btn",
          onClick: () => setIsAdding(!isAdding),
          style: {
            background: "var(--neon-blue)",
            color: "black",
            border: "none",
            padding: "10px 20px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem"
          },
          children: "+ ADD NEW"
        }
      )
    ] }),
    isAdding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { padding: "25px", marginBottom: "30px", animation: "slideDown 0.3s" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginTop: 0, color: "var(--neon-blue)", fontFamily: '"Orbitron", sans-serif' }, children: "QUICK ADD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "25px" }, children: COMMON_SUBS.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => addSub(sub),
          disabled: mySubs.some((s) => s.id === sub.id),
          style: {
            padding: "10px 20px",
            borderRadius: "25px",
            border: mySubs.some((s) => s.id === sub.id) ? "1px solid #333" : "1px solid rgba(255,255,255,0.2)",
            background: mySubs.some((s) => s.id === sub.id) ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.1)",
            color: mySubs.some((s) => s.id === sub.id) ? "#555" : "white",
            cursor: mySubs.some((s) => s.id === sub.id) ? "default" : "pointer",
            fontWeight: "bold",
            transition: "background 0.2s"
          },
          children: [
            sub.name,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.7 }, children: [
              "$",
              sub.price
            ] })
          ]
        },
        sub.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginTop: 0, color: "var(--neon-blue)", fontFamily: '"Orbitron", sans-serif' }, children: "CUSTOM SUB" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Service Name",
            value: customName,
            onChange: (e) => setCustomName(e.target.value),
            style: {
              flex: 1,
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              minWidth: "200px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            placeholder: "Cost",
            value: customPrice,
            onChange: (e) => setCustomPrice(e.target.value),
            style: {
              width: "100px",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.5)",
              color: "white"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: addCustomSub,
            className: "squishy-btn",
            style: {
              background: "var(--neon-green)",
              border: "none",
              borderRadius: "10px",
              padding: "0 30px",
              cursor: "pointer",
              color: "black",
              fontWeight: "bold"
            },
            children: "ADD"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "60px" }, children: [
      mySubs.length === 0 && !isAdding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "60px", color: "#555", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", opacity: 0.3, marginBottom: "10px" }, children: "🧘" }),
        "No active subscriptions.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Are you sure? That's impressive."
      ] }),
      mySubs.map((sub, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
        padding: "20px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: `5px solid ${sub.color || "#fff"}`,
        transition: "transform 0.2s"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "1.2rem", marginBottom: "5px" }, children: sub.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: "0.9rem" }, children: [
            "$",
            sub.price,
            "/mo ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.3 }, children: "|" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-pink)" }, children: [
              "$",
              (sub.price * 12).toFixed(2),
              "/yr"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "squishy-btn",
            onClick: () => slaySub(sub),
            style: {
              background: "var(--neon-pink)",
              color: "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "900",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 5px 15px rgba(255, 0, 85, 0.3)",
              fontSize: "0.9rem"
            },
            children: "⚔️ SLAY"
          }
        )
      ] }, i))
    ] }),
    slainSubs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: { padding: "30px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.05)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { color: "#666", marginTop: 0, fontFamily: '"Orbitron", sans-serif', display: "flex", alignItems: "center", gap: "10px" }, children: [
        "🪦 GRAVEYARD ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", fontWeight: "normal" }, children: "(SAVED MONEY)" })
      ] }),
      slainSubs.map((sub, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "15px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#666"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textDecoration: "line-through" }, children: sub.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-green)", fontWeight: "bold" }, children: [
            "+$",
            (sub.price * 12).toFixed(2),
            "/yr"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => restoreSub(sub), style: { background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "1.2rem", title: "Restore" }, children: "↺" })
        ] })
      ] }, i))
    ] })
  ] }) });
};
export {
  SubSlayer as default
};
