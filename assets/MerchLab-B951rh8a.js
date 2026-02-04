import { a as useGamification, c as useToast, b as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, S as SquishyButton } from "./index-DYfGmaJ9.js";
import "./html2canvas.esm-B6qI7jro.js";
const TEMPLATES = [
  { id: "tee", name: "T-SHIRT", src: "/assets/merch_templates.png", x: 0, y: 0, w: 128, h: 128, scale: 3 },
  { id: "hoodie", name: "HOODIE", src: "/assets/merch_templates.png", x: 128, y: 0, w: 128, h: 128, scale: 3 },
  { id: "cap", name: "CAP", src: "/assets/merch_templates.png", x: 256, y: 0, w: 128, h: 128, scale: 3 }
];
const COLORS = ["#FFFFFF", "#000000", "#FF0055", "#00CCFF", "#FFFF00", "#333333"];
const MerchLab = () => {
  const { dailyState, shopState, launchDrop, activeDrops, hasUpgrade } = useGamification();
  const { showToast } = useToast();
  const { playClick, playWin } = useRetroSound();
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(TEMPLATES[0]);
  const [baseColor, setBaseColor] = reactExports.useState("#FFFFFF");
  const [layers, setLayers] = reactExports.useState([]);
  const [selectedLayerId, setSelectedLayerId] = reactExports.useState(null);
  const canvasRef = reactExports.useRef(null);
  const stickers = [
    ...["👾", "🔥", "💎", "💀", "👽", "🍕", "🕹️", "🚀", "❤️", "⚡"],
    ...dailyState?.achievements?.filter((a) => a.unlocked).map((a) => a.icon) || []
  ];
  const addLayer = (content, type = "sticker") => {
    playClick();
    const newLayer = {
      id: Date.now(),
      type,
      content,
      x: 150,
      // Center-ish
      y: 150,
      scale: 1,
      rotation: 0,
      color: "#000000"
      // Text color
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
  const handleLaunch = async () => {
    playWin();
    launchDrop({
      name: `${selectedTemplate.name} ${Date.now().toString().slice(-4)}`,
      color: baseColor
    });
    showToast("DROP LAUNCHED! CHECK REVENUE.", "success");
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.2rem", color: "var(--neon-green)", textShadow: "0 0 10px var(--neon-green)" }, children: "MERCH LAB 🧪" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.6rem", color: "#666" }, children: "CUSTOM GEAR FABRICATOR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "30px" } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, height: "calc(100vh - 80px)", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "250px", background: "#181818", borderRight: "1px solid #333", overflowY: "auto", padding: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "BASE ITEM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px" }, children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTemplate(t), style: {
            flex: 1,
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" }, children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBaseColor(c), style: {
            width: "30px",
            height: "30px",
            background: c,
            border: baseColor === c ? "2px solid white" : "1px solid #555",
            cursor: "pointer"
          } }, c)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#888", marginBottom: "10px" }, children: "STICKERS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }, children: stickers.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addLayer(s, "sticker"), style: {
            width: "40px",
            height: "40px",
            background: "#222",
            border: "1px solid #444",
            fontSize: "1.5rem",
            cursor: "pointer"
          }, children: s }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addLayer("MERCHBOY", "text"), style: {
          width: "100%",
          padding: "10px",
          background: "#333",
          color: "white",
          border: "1px dashed #555",
          cursor: "pointer",
          fontSize: "0.7rem"
        }, children: "+ ADD TEXT" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }, children: [
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
              justifyContent: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "384px",
                height: "384px",
                backgroundColor: baseColor,
                maskImage: `url('${selectedTemplate.src}')`,
                maskPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                maskSize: `${384 * 3}px ${128 * 3}px`,
                // Scaled up sprite sheet logic (128*3 = 384)
                WebkitMaskImage: `url('${selectedTemplate.src}')`,
                WebkitMaskPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                WebkitMaskSize: `${384 * 3}px ${128 * 3}px`
                // CSS Sprite logic for Mask is tricky, usually requires separate images or specific div sizing.
                // Falling back to standard image filter/tint if mask fails or using precise sprite div.
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                inset: 0,
                pointerEvents: "none"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "100%",
                height: "100%",
                backgroundImage: `url('${selectedTemplate.src}')`,
                backgroundPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                backgroundSize: "300% 100%",
                // 3 cols
                imageRendering: "pixelated",
                mixBlendMode: "multiply",
                // This might not work well on black bg.
                opacity: 0
                // Spacer
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                width: "384px",
                height: "384px",
                backgroundImage: `url('${selectedTemplate.src}')`,
                backgroundPosition: `${-(selectedTemplate.id === "tee" ? 0 : selectedTemplate.id === "hoodie" ? 1 : 2) * 100}% 0`,
                backgroundSize: "300% 100%",
                imageRendering: "pixelated",
                filter: `drop-shadow(0 0 0 ${baseColor})`
                // This floods the shape with color if image is transparent
                // The image is white with transparency. drop-shadow moves color.
                // Actually, let's just use CSS filter to colorize.
                // SVG would be better but we have PNG.
                // Let's rely on simple layering:
                // 1. Coloured Block
                // 2. Masked by Image
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                maskImage: `url('${selectedTemplate.src}')`,
                maskSize: "300% 100%",
                maskPosition: `${selectedTemplate.id === "tee" ? 0 : selectedTemplate.id === "hoodie" ? 50 : 100}% 0`,
                WebkitMaskImage: `url('${selectedTemplate.src}')`,
                WebkitMaskSize: "300% 100%",
                WebkitMaskPosition: `${selectedTemplate.id === "tee" ? 0 : selectedTemplate.id === "hoodie" ? 50 : 100}% 0`,
                background: baseColor,
                zIndex: 1
              }, children: layers.map((layer) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                LayerComponent,
                {
                  layer,
                  isSelected: selectedLayerId === layer.id,
                  onSelect: () => setSelectedLayerId(layer.id),
                  onChange: (u) => updateLayer(layer.id, u)
                },
                layer.id
              )) })
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
                style: { width: "100%", marginTop: "5px", background: "#333", border: "1px solid #555", color: "white", padding: "5px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeLayer(selectedLayerId), style: { ...btnStyle, background: "red", color: "white", marginTop: "20px" }, children: "🗑️ DELETE LAYER" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: "0.7rem", textAlign: "center", marginTop: "50px" }, children: "SELECT AN OBJECT ON CANVAS TO EDIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto", paddingTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handleLaunch, style: { width: "100%" }, children: "🚀 LAUNCH DROP" }) }),
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
  const handleMouseDown = (e) => {
    onSelect();
    setIsDragging(true);
    e.stopPropagation();
  };
  reactExports.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onChange({
          x: layer.x + e.movementX,
          y: layer.y + e.movementY
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
  }, [isDragging, layer.x, layer.y]);
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
        fontSize: "2rem",
        color: layer.color
      },
      children: layer.type === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "Impact, sans-serif", textTransform: "uppercase" }, children: layer.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: layer.content })
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
