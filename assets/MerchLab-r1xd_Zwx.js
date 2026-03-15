import { a as useGamification, c as useToast, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, S as SquishyButton } from "./index-BjlAyyZi.js";
import { h as html2canvas } from "./html2canvas.esm-B6qI7jro.js";
const TEMPLATES = [
  { id: "tee", type: "merch", name: "T-SHIRT", src: "/assets/merch_templates.png", x: 0, y: 0, w: 128, h: 128, scale: 3 },
  { id: "hoodie", type: "merch", name: "HOODIE", src: "/assets/merch_templates.png", x: 128, y: 0, w: 128, h: 128, scale: 3 },
  { id: "cap", type: "merch", name: "CAP", src: "/assets/merch_templates.png", x: 256, y: 0, w: 128, h: 128, scale: 3 },
  { id: "meme_canvas", type: "meme", name: "POSTER", bg: "#ffffff" },
  { id: "billboard", type: "meme", name: "BILLBOARD", bg: "#111111" }
];
const COLORS = ["#FFFFFF", "#000000", "#FF0055", "#00CCFF", "#FFFF00", "#333333", "#00FF00", "#AA00FF", "#FF8800"];
const FILTERS = [
  { name: "NONE", filter: "none" },
  { name: "DEEP FRIED", filter: "contrast(200%) saturate(300%) hue-rotate(-10deg) sepia(20%)" },
  { name: "VINTAGE", filter: "sepia(80%) contrast(120%) brightness(90%)" },
  { name: "GLITCH", filter: "invert(100%) hue-rotate(180deg) saturate(300%)" },
  { name: "B&W", filter: "grayscale(100%) contrast(150%)" },
  { name: "MATRIX", filter: "hue-rotate(90deg) saturate(200%) contrast(150%)" }
];
const MEME_PRESETS = [
  {
    name: "SIGMA",
    template: "meme_canvas",
    baseColor: "#222222",
    layers: [
      { type: "image", content: "/assets/skins/face_standard_bw.png", x: 200, y: 200, scale: 2, rotation: 0 },
      { type: "text", content: "SIGMA MINDSET", x: 200, y: 50, scale: 0.8, rotation: 0, color: "#FFFFFF", isMeme: true },
      { type: "text", content: "REJECT SLEEP", x: 200, y: 350, scale: 0.8, rotation: 0, color: "#FFFFFF", isMeme: true }
    ]
  },
  {
    name: "STONKS",
    template: "meme_canvas",
    baseColor: "#00FF55",
    layers: [
      { type: "image", content: "/assets/skins/face_money.png", x: 200, y: 200, scale: 2, rotation: 0 },
      { type: "sticker", content: "📈", x: 300, y: 150, scale: 3, rotation: 15 },
      { type: "text", content: "BUY HIGH", x: 200, y: 50, scale: 1, rotation: 0, color: "#FFFFFF", isMeme: true },
      { type: "text", content: "SELL LOW", x: 200, y: 350, scale: 1, rotation: 0, color: "#FFFFFF", isMeme: true }
    ]
  },
  {
    name: "WANTED",
    template: "meme_canvas",
    baseColor: "#D2B48C",
    layers: [
      { type: "text", content: "WANTED", x: 200, y: 60, scale: 1.2, rotation: 0, color: "#000000", isMeme: true },
      { type: "image", content: "/assets/skins/face_bear.png", x: 200, y: 200, scale: 1.5, rotation: 0 },
      { type: "text", content: "REWARD: 1M COINS", x: 200, y: 320, scale: 0.6, rotation: 0, color: "#000000", isMeme: false },
      { type: "text", content: "FOR TAX EVASION", x: 200, y: 360, scale: 0.5, rotation: 0, color: "#000000", isMeme: false }
    ]
  },
  {
    name: "DEGEN",
    template: "billboard",
    baseColor: "#111111",
    layers: [
      { type: "image", content: "/assets/skins/face_bunny.png", x: 200, y: 200, scale: 1.5, rotation: 0 },
      { type: "sticker", content: "🎰", x: 80, y: 200, scale: 2, rotation: -20 },
      { type: "sticker", content: "💸", x: 320, y: 200, scale: 2, rotation: 20 },
      { type: "text", content: "I CAN QUIT", x: 200, y: 80, scale: 1, rotation: 0, color: "#FFFFFF", isMeme: true },
      { type: "text", content: "WHENEVER I WANT", x: 200, y: 300, scale: 0.8, rotation: 0, color: "#FFFFFF", isMeme: true }
    ]
  },
  {
    name: "BASIC TEE",
    template: "tee",
    baseColor: "#FFFFFF",
    layers: [
      { type: "image", content: "/assets/skins/logo_main.png", x: 200, y: 150, scale: 1.5, rotation: 0 },
      { type: "text", content: "CLASSIC", x: 200, y: 250, scale: 0.4, rotation: 0, color: "#000000", isMeme: false }
    ]
  },
  {
    name: "BASIC HOODIE",
    template: "hoodie",
    baseColor: "#111111",
    layers: [
      { type: "image", content: "/assets/skins/logo_typography.png", x: 200, y: 150, scale: 1.2, rotation: 0 }
    ]
  },
  {
    name: "BASIC CAP",
    template: "cap",
    baseColor: "#00FF55",
    layers: [
      { type: "image", content: "/assets/skins/face_money.png", x: 200, y: 150, scale: 0.5, rotation: 0 }
    ]
  }
];
const MerchLab = () => {
  const { shopState, launchDrop, activeDrops, hasUpgrade, coins, addCoins, dailyState } = useGamification();
  const { showToast } = useToast();
  const { playClick, playWin, playError, playExplosion, playAirhorn, playBoing } = useRetroSound();
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(TEMPLATES[0]);
  const [baseColor, setBaseColor] = reactExports.useState("#FFFFFF");
  const [layers, setLayers] = reactExports.useState([]);
  const [selectedLayerId, setSelectedLayerId] = reactExports.useState(null);
  const [customUrl, setCustomUrl] = reactExports.useState("");
  const [isNuking, setIsNuking] = reactExports.useState(false);
  const [canvasFilter, setCanvasFilter] = reactExports.useState("none");
  const canvasRef = reactExports.useRef(null);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (playBoing) playBoing();
      const reader = new FileReader();
      reader.onload = (event) => {
        addLayer(event.target.result, "image");
      };
      reader.readAsDataURL(file);
    }
  };
  const userAssets = [
    "/assets/stickers/money_face.png",
    "/assets/stickers/cat_hoodie.png",
    "/assets/stickers/blue_bunny.png",
    "/assets/stickers/merch_typo.png",
    "/assets/skins/face_money.png",
    "/assets/skins/face_bear.png",
    "/assets/skins/face_bunny.png",
    "/assets/skins/face_hoodie.png",
    "/assets/skins/logo_main.png",
    "/assets/skins/logo_typography.png",
    "/assets/skins/face_hoodie_brown.png",
    "/assets/skins/face_bunny_blue.png",
    "/assets/skins/face_bunny_hoodie.png",
    "/assets/skins/face_standard_bw.png",
    "/assets/skins/face_cat.png"
  ];
  const stickers = [
    ...["👾", "🔥", "💎", "💀", "👽", "🍕", "🕹️", "🚀", "❤️", "⚡", "🦄", "🌈", "🎸", "💿", "🛹", "🎮", "💸", "👁️"],
    ...dailyState?.achievements?.filter((a) => a.unlocked).map((a) => a.icon) || []
  ];
  const addLayer = (content, type = "sticker") => {
    if (playBoing) playBoing();
    const newLayer = {
      id: Date.now(),
      type,
      content,
      x: 200,
      // Center
      y: 200,
      scale: type === "image" ? 0.5 : 1,
      // Default scale for images
      rotation: 0,
      color: type === "text" ? "#FFFFFF" : "#000000",
      // Text color defaults to white for memes
      isMeme: type === "text"
      // Auto toggle meme font
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };
  const updateLayer = (id, updates) => {
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, ...updates } : l));
  };
  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setSelectedLayerId(null);
  };
  const duplicateLayer = (id) => {
    const layerToDup = layers.find((l) => l.id === id);
    if (layerToDup) {
      if (playBoing) playBoing();
      const newLayer = { ...layerToDup, id: Date.now(), x: layerToDup.x + 20, y: layerToDup.y + 20 };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
    }
  };
  const moveLayer = (id, direction) => {
    const index = layers.findIndex((l) => l.id === id);
    if (index < 0) return;
    const newLayers = [...layers];
    if (direction === "up" && index < newLayers.length - 1) {
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    } else if (direction === "down" && index > 0) {
      [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
    }
    setLayers(newLayers);
  };
  const handleShare = async () => {
    if (coins < 10) {
      playError();
      showToast("NOT ENOUGH COINS FOR EXPORT (Costs 10)", "error");
      return;
    }
    playWin();
    if (canvasRef.current) {
      try {
        showToast("Capturing Design... (-10 Coins)", "info");
        addCoins(-10);
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: null,
          scale: 2
          // HD
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `MERCHLAB_${Date.now()}.png`;
        link.click();
        const text = `Check out my design! @br0dad @merchboy_viz #MerchLab`;
        await navigator.clipboard.writeText(text);
        showToast("IMAGE SAVED & TEXT COPIED! READY FOR IG.", "success");
      } catch (err) {
        console.error(err);
        showToast("Capture failed.", "error");
      }
    }
  };
  const handleNuke = () => {
    if (layers.length === 0) return;
    if (playExplosion) playExplosion();
    setIsNuking(true);
    setTimeout(() => {
      setLayers([]);
      setSelectedLayerId(null);
      setBaseColor("#FFFFFF");
      setIsNuking(false);
      showToast("CANVAS NUKED", "error");
    }, 500);
  };
  const handleRandomize = () => {
    playClick();
    setLayers([]);
    const templates = ["meme_canvas", "meme_canvas", "billboard", "tee", "hoodie"];
    const randomTemplateId = templates[Math.floor(Math.random() * templates.length)];
    const template = TEMPLATES.find((t) => t.id === randomTemplateId);
    setSelectedTemplate(template);
    setBaseColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const newLayers = [];
    let timeBase = Date.now();
    const randomFace = userAssets[Math.floor(Math.random() * userAssets.length)];
    newLayers.push({
      id: timeBase + 1,
      type: "image",
      content: randomFace,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      scale: 0.5 + Math.random() * 1.5,
      rotation: (Math.random() - 0.5) * 90,
      color: "#000",
      isMeme: false
    });
    const numStickers = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numStickers; i++) {
      const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
      newLayers.push({
        id: timeBase + 2 + i,
        type: "sticker",
        content: randomSticker,
        x: 50 + Math.random() * 300,
        y: 50 + Math.random() * 300,
        scale: 0.8 + Math.random() * 2,
        rotation: (Math.random() - 0.5) * 360,
        color: "#000",
        isMeme: false
      });
    }
    const memeWords = ["STONKS", "HODL", "BRUH", "WEN MOON", "LFG", "REKT", "COPIUM", "GIGA CHAD", "NO CAP"];
    const randomWord = memeWords[Math.floor(Math.random() * memeWords.length)];
    newLayers.push({
      id: timeBase + 10,
      type: "text",
      content: randomWord,
      x: 200,
      y: Math.random() > 0.5 ? 50 : 350,
      // top or bottom
      scale: 1 + Math.random(),
      rotation: 0,
      color: "#FFFFFF",
      isMeme: true
    });
    setLayers(newLayers);
    if (playAirhorn) playAirhorn();
    showToast("ROULETTE ROLLED", "info");
  };
  const applyPreset = (preset) => {
    if (playAirhorn && !preset.name.includes("BASIC")) playAirhorn();
    else if (playClick) playClick();
    const template = TEMPLATES.find((t) => t.id === preset.template);
    setSelectedTemplate(template);
    setBaseColor(preset.baseColor);
    const timeBase = Date.now();
    const presetLayers = preset.layers.map((l, i) => ({
      ...l,
      id: timeBase + i
    }));
    setLayers(presetLayers);
    setSelectedLayerId(null);
    showToast(`LOADED PRESET: ${preset.name}`, "info");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #111, #222)",
    color: "white",
    fontFamily: '"Press Start 2P", monospace',
    paddingBottom: "100px",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #333" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.5rem", opacity: 0.8, color: "white" }, children: "⬅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.2rem", color: "var(--neon-green)", textShadow: "0 0 10px var(--neon-green)" }, children: "MERCH & MEME LAB 🧪" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#666" }, children: "CUSTOM GEAR & MEME FABRICATOR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "30px" } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, height: "calc(100vh - 80px)", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "250px", background: "#181818", borderRight: "1px solid #333", overflowY: "auto", padding: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "🔥 ONE-CLICK TEMPLATES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: MEME_PRESETS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => applyPreset(p), style: {
            flex: "1 1 40%",
            padding: "10px",
            background: p.name.includes("BASIC") ? "#444" : "var(--neon-green)",
            border: "1px solid #222",
            color: p.name.includes("BASIC") ? "white" : "black",
            cursor: "pointer",
            fontSize: "0.6rem",
            fontWeight: "bold"
          }, children: p.name }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "BASE ITEM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTemplate(t), style: {
            flex: "1 1 40%",
            padding: "10px",
            background: selectedTemplate.id === t.id ? "var(--neon-blue)" : "#333",
            border: "none",
            color: selectedTemplate.id === t.id ? "black" : "white",
            cursor: "pointer",
            fontSize: "0.6rem"
          }, children: t.name }, t.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "DYE COLOR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }, children: [
            COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBaseColor(c), style: {
              width: "30px",
              height: "30px",
              background: c,
              border: baseColor === c ? "2px solid white" : "1px solid #555",
              cursor: "pointer"
            } }, c)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: {
              width: "30px",
              height: "30px",
              background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
              border: "1px solid #555",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: baseColor,
                onChange: (e) => setBaseColor(e.target.value),
                style: { opacity: 0, width: "100%", height: "100%", cursor: "pointer" }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "GLOBAL FILTER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px" }, children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCanvasFilter(f.filter), style: {
            padding: "5px",
            background: canvasFilter === f.filter ? "var(--neon-blue)" : "#333",
            border: "none",
            color: canvasFilter === f.filter ? "black" : "white",
            cursor: "pointer",
            fontSize: "0.6rem",
            fontWeight: "bold"
          }, children: f.name }, f.name)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "LOGOS & STICKERS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", marginBottom: "10px" }, children: userAssets.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addLayer(src, "image"), style: {
            height: "50px",
            background: "#222",
            border: "1px solid #444",
            cursor: "pointer",
            padding: "5px",
            overflow: "hidden"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, style: { width: "100%", height: "100%", objectFit: "contain" } }) }, `img_${i}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }, children: stickers.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addLayer(s, "sticker"), style: {
            width: "40px",
            height: "40px",
            background: "#222",
            border: "1px solid #444",
            fontSize: "1.5rem",
            cursor: "pointer"
          }, children: s }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#888", marginBottom: "5px" }, children: "UPLOAD IMAGE (FROM PC)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                onChange: handleFileUpload,
                style: { width: "100%", fontSize: "0.6rem", background: "#333", color: "white", border: "1px solid #555", padding: "5px", boxSizing: "border-box" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#888", marginBottom: "5px" }, children: "CUSTOM IMAGE URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "https://...",
                  value: customUrl,
                  onChange: (e) => setCustomUrl(e.target.value),
                  style: { flex: 1, background: "#333", border: "1px solid #555", color: "white", padding: "5px", fontSize: "0.6rem" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                if (customUrl) {
                  addLayer(customUrl, "image");
                  setCustomUrl("");
                }
              }, style: { padding: "5px", background: "var(--neon-green)", color: "black", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.6rem" }, children: "ADD" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addLayer("MERCHBOY", "text"), style: {
          width: "100%",
          padding: "10px",
          background: "#333",
          color: "white",
          border: "1px dashed #555",
          cursor: "pointer",
          fontSize: "0.7rem"
        }, children: "+ ADD TEXT" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", borderTop: "1px solid #333", paddingTop: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "CHAOS TOOLS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRandomize, style: {
            width: "100%",
            padding: "10px",
            background: "linear-gradient(90deg, #ff00cc, #3333ff)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.7rem",
            fontWeight: "bold",
            marginBottom: "10px"
          }, children: "🎲 RANDOMIZE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNuke, style: {
            width: "100%",
            padding: "10px",
            background: "#ff0000",
            color: "black",
            border: "2px dashed black",
            cursor: "pointer",
            fontSize: "0.7rem",
            fontWeight: "bold"
          }, children: "☢️ NUKE CANVAS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }, children: [
        isNuking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 999,
          animation: "flash 0.5s ease-out forwards"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        @keyframes flash {
                            0% { opacity: 1; background: white; }
                            50% { opacity: 0.8; background: red; }
                            100% { opacity: 0; }
                        }
                    ` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: canvasRef,
            style: {
              width: "400px",
              height: "400px",
              position: "relative",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: isNuking ? "scale(1.1) rotate(5deg)" : "none",
              transition: "transform 0.1s, filter 0.3s",
              filter: isNuking ? "blur(5px) sepia(100%) hue-rotate(-50deg) saturate(500%)" : canvasFilter
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "384px",
                height: "384px",
                backgroundColor: selectedTemplate.type === "meme" ? selectedTemplate.bg || baseColor : baseColor,
                maskImage: selectedTemplate.type === "merch" ? `url('${selectedTemplate.src}')` : "none",
                maskSize: "300% 100%",
                maskPosition: `${selectedTemplate.id === "tee" ? "0%" : selectedTemplate.id === "hoodie" ? "50%" : "100%"} 0%`,
                WebkitMaskImage: selectedTemplate.type === "merch" ? `url('${selectedTemplate.src}')` : "none",
                WebkitMaskSize: "300% 100%",
                WebkitMaskPosition: `${selectedTemplate.id === "tee" ? "0%" : selectedTemplate.id === "hoodie" ? "50%" : "100%"} 0%`,
                border: selectedTemplate.type === "meme" ? "2px solid #555" : "none",
                boxSizing: "border-box",
                position: "relative",
                zIndex: 1,
                overflow: "hidden"
              }, children: layers.map((layer) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                LayerComponent,
                {
                  layer,
                  isSelected: selectedLayerId === layer.id,
                  onSelect: () => setSelectedLayerId(layer.id),
                  onChange: (u) => updateLayer(layer.id, u)
                },
                layer.id
              )) }),
              selectedTemplate.type === "merch" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `url('${selectedTemplate.src}')`,
                backgroundSize: "300% 100%",
                backgroundPosition: `${selectedTemplate.id === "tee" ? "0%" : selectedTemplate.id === "hoodie" ? "50%" : "100%"} 0%`,
                mixBlendMode: "multiply",
                opacity: 0.5,
                zIndex: 2
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                bottom: "5px",
                right: "5px",
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.5rem",
                fontFamily: '"Press Start 2P", monospace',
                pointerEvents: "none",
                zIndex: 10,
                textShadow: "1px 1px 0 #000"
              }, children: "MADE IN MERCH & MEME LAB" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "250px", background: "#181818", borderLeft: "1px solid #333", padding: "15px" }, children: [
        selectedLayerId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "LAYER PROPERTIES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { scale: layers.find((l) => l.id === selectedLayerId).scale + 0.1 }), style: btnStyle, children: "➕ SIZE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { scale: Math.max(0.1, layers.find((l) => l.id === selectedLayerId).scale - 0.1) }), style: btnStyle, children: "➖ SIZE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { rotation: layers.find((l) => l.id === selectedLayerId).rotation + 15 }), style: btnStyle, children: "↩️ ROTATE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { rotation: layers.find((l) => l.id === selectedLayerId).rotation - 15 }), style: btnStyle, children: "↪️ ROTATE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "5px", marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => moveLayer(selectedLayerId, "up"), style: btnStyle, children: "🔼 LAYER UP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => moveLayer(selectedLayerId, "down"), style: btnStyle, children: "🔽 LAYER DOWN" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => duplicateLayer(selectedLayerId), style: { ...btnStyle, width: "100%", marginBottom: "10px", background: "var(--neon-blue)", color: "black" }, children: "📄 DUPLICATE LAYER" }),
          layers.find((l) => l.id === selectedLayerId)?.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", marginBottom: "5px" }, children: "TEXT COLOR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { color: c }), style: {
              width: "20px",
              height: "20px",
              background: c,
              border: "1px solid #555"
            } }, c)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: layers.find((l) => l.id === selectedLayerId).content,
                onChange: (e) => updateLayer(selectedLayerId, { content: e.target.value }),
                style: { width: "100%", marginTop: "5px", background: "#333", border: "1px solid #555", color: "white", padding: "5px", boxSizing: "border-box" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateLayer(selectedLayerId, { isMeme: !layers.find((l) => l.id === selectedLayerId).isMeme }), style: { ...btnStyle, marginTop: "5px", width: "100%" }, children: layers.find((l) => l.id === selectedLayerId).isMeme ? "🕶️ MEME FONT: ON" : "🔤 MEME FONT: OFF" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeLayer(selectedLayerId), style: { ...btnStyle, background: "red", color: "white", marginTop: "20px" }, children: "🗑️ DELETE LAYER" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: "0.7rem", textAlign: "center", marginTop: "50px" }, children: "SELECT AN OBJECT ON CANVAS TO EDIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto", paddingTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SquishyButton, { onClick: handleShare, style: { width: "100%", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", display: "flex", flexDirection: "column", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1rem" }, children: "📸 SHARE TO IG" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.6rem", color: "rgba(255,255,255,0.8)" }, children: "COST: 10 COINS" })
        ] }) }),
        activeDrops?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "20px", borderTop: "1px solid #333", paddingTop: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "5px", display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ACTIVE DROPS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-green)" }, children: [
              activeDrops.filter((d) => d.active).length,
              " LIVE"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "150px", overflowY: "auto" }, children: activeDrops.slice().reverse().map((drop) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "#222",
            padding: "10px",
            marginBottom: "5px",
            borderRadius: "4px",
            borderLeft: drop.active ? "2px solid var(--neon-green)" : "2px solid #555"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", fontWeight: "bold" }, children: drop.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#aaa", marginTop: "5px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "STOCK: ",
                Math.max(0, drop.stock - drop.sold),
                "/",
                drop.stock
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700" }, children: [
                "+",
                drop.revenue.toLocaleString(),
                " CP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "3px", background: "#333", marginTop: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: `${drop.sold / drop.stock * 100}%`,
              height: "100%",
              background: drop.active ? "var(--neon-green)" : "#555"
            } }) }),
            hasUpgrade && hasUpgrade("hack_tax") && drop.active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.5rem", color: "#00ffcc", marginTop: "2px", textAlign: "right" }, children: "🏝️ OFFSHORE BONUS ACTIVE" })
          ] }, drop.id)) })
        ] })
      ] })
    ] })
  ] });
};
const LayerComponent = ({ layer, isSelected, onSelect, onChange }) => {
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const lastPos = reactExports.useRef({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    onSelect();
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };
  reactExports.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        onChange({
          x: layer.x + dx,
          y: layer.y + dy
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, layer.x, layer.y, onChange]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onMouseDown: handleMouseDown,
      style: {
        position: "absolute",
        top: layer.y,
        left: layer.x,
        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? "2px dashed cyan" : "none",
        padding: "5px",
        userSelect: "none",
        fontSize: layer.type === "text" ? "3rem" : "4rem",
        color: layer.color,
        display: "inline-block",
        pointerEvents: "auto",
        whiteSpace: "nowrap"
      },
      children: layer.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: layer.content, style: { width: "100px", pointerEvents: "none", display: "block" }, onDragStart: (e) => e.preventDefault() }) : layer.type === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: layer.isMeme ? '"Impact", sans-serif' : "inherit",
        textTransform: "uppercase",
        lineHeight: 1,
        textShadow: layer.isMeme ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000" : "none"
      }, children: layer.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "block", lineHeight: 1 }, children: layer.content })
    }
  );
};
const btnStyle = {
  flex: 1,
  padding: "5px",
  background: "#333",
  border: "1px solid #555",
  color: "#ccc",
  cursor: "pointer",
  fontSize: "0.6rem"
};
export {
  MerchLab as default
};
