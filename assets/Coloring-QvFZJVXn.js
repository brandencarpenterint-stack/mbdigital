import { r as reactExports, j as jsxRuntimeExports, S as SquishyButton, c as useRetroSound, t as triggerConfetti } from "./index-BwLfVL7x.js";
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
};
const smartFloodFill = (colorCtx, lineCtx, startX, startY, fillColor) => {
  const w = colorCtx.canvas.width;
  const h = colorCtx.canvas.height;
  const colorImgData = colorCtx.getImageData(0, 0, w, h);
  const colorData = colorImgData.data;
  const lineImgData = lineCtx.getImageData(0, 0, w, h);
  const lineData = lineImgData.data;
  const fill = hexToRgb(fillColor);
  const startIdx = (startY * w + startX) * 4;
  const sr = colorData[startIdx];
  const sg = colorData[startIdx + 1];
  const sb = colorData[startIdx + 2];
  const sa = colorData[startIdx + 3];
  if (sr === fill.r && sg === fill.g && sb === fill.b && sa === 255) return;
  const isBoundary = (idx) => {
    const r = lineData[idx];
    const g = lineData[idx + 1];
    const b = lineData[idx + 2];
    const a = lineData[idx + 3];
    return a > 50 && r + g + b < 300;
  };
  const pixelStack = [[startX, startY]];
  while (pixelStack.length) {
    const newPos = pixelStack.pop();
    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * w + x) * 4;
    while (y-- >= 0 && (colorData[pixelPos] === sr && colorData[pixelPos + 1] === sg && colorData[pixelPos + 2] === sb && colorData[pixelPos + 3] === sa) && !isBoundary(pixelPos)) {
      pixelPos -= w * 4;
    }
    pixelPos += w * 4;
    ++y;
    let reachLeft = false;
    let reachRight = false;
    while (y++ < h - 1 && (colorData[pixelPos] === sr && colorData[pixelPos + 1] === sg && colorData[pixelPos + 2] === sb && colorData[pixelPos + 3] === sa) && !isBoundary(pixelPos)) {
      colorData[pixelPos] = fill.r;
      colorData[pixelPos + 1] = fill.g;
      colorData[pixelPos + 2] = fill.b;
      colorData[pixelPos + 3] = 255;
      if (x > 0) {
        const leftPos = pixelPos - 4;
        const matchLeft = colorData[leftPos] === sr && colorData[leftPos + 1] === sg && colorData[leftPos + 2] === sb && colorData[leftPos + 3] === sa && !isBoundary(leftPos);
        if (matchLeft) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }
      if (x < w - 1) {
        const rightPos = pixelPos + 4;
        const matchRight = colorData[rightPos] === sr && colorData[rightPos + 1] === sg && colorData[rightPos + 2] === sb && colorData[rightPos + 3] === sa && !isBoundary(rightPos);
        if (matchRight) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      pixelPos += w * 4;
    }
  }
  colorCtx.putImageData(colorImgData, 0, 0);
};
const COLORS = [
  "#ff0055",
  "#00ffaa",
  "#ffff00",
  "#00ccff",
  "#ff9900",
  "#cc00ff",
  "#ffffff",
  "#000000"
];
const STICKERS = [
  { type: "emoji", content: "⭐" },
  { type: "emoji", content: "🚀" },
  { type: "emoji", content: "🌈" },
  { type: "emoji", content: "🐱" },
  { type: "emoji", content: "🍕" },
  { type: "emoji", content: "👕" },
  { type: "emoji", content: "🧢" },
  { type: "emoji", content: "👟" },
  { type: "emoji", content: "🕶️" },
  { type: "image", content: "/assets/boy-logo.png" },
  { type: "image", content: "/assets/brokid-logo.png" }
];
const ColoringCanvas = ({ templateImage, onComplete }) => {
  const canvasContainerRef = reactExports.useRef(null);
  const lineCanvasRef = reactExports.useRef(null);
  const colorCanvasRef = reactExports.useRef(null);
  const [tool, setTool] = reactExports.useState("bucket");
  const [color, setColor] = reactExports.useState("#ff0055");
  const [selectedSticker, setSelectedSticker] = reactExports.useState(STICKERS[0]);
  const [brushSize, setBrushSize] = reactExports.useState(10);
  const [isDrawing, setIsDrawing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!templateImage) return;
    const lineCanvas = lineCanvasRef.current;
    const colorCanvas = colorCanvasRef.current;
    const lineCtx = lineCanvas.getContext("2d");
    const colorCtx = colorCanvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    img.src = templateImage;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const container = canvasContainerRef.current;
      const size = Math.min(container.clientWidth, 500);
      lineCanvas.width = size;
      lineCanvas.height = size;
      colorCanvas.width = size;
      colorCanvas.height = size;
      lineCtx.drawImage(img, 0, 0, size, size);
      const imgData = lineCtx.getImageData(0, 0, size, size);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 200 && g > 200 && b > 200) {
          data[i + 3] = 0;
        }
      }
      lineCtx.putImageData(imgData, 0, 0);
      colorCtx.fillStyle = "#ffffff";
      colorCtx.fillRect(0, 0, size, size);
    };
  }, [templateImage]);
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    if (tool === "bucket") {
      useBucket(x, y);
      setIsDrawing(false);
    } else if (tool === "sticker") {
      useSticker(x, y);
      setIsDrawing(false);
    } else {
      usePencil(x, y, true);
    }
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    if (tool === "pencil" || tool === "eraser") {
      usePencil(x, y, false);
    }
  };
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  const getCoordinates = (e) => {
    const rect = colorCanvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: Math.floor(clientX - rect.left),
      y: Math.floor(clientY - rect.top)
    };
  };
  const useBucket = (x, y) => {
    const colorCtx = colorCanvasRef.current.getContext("2d", { willReadFrequently: true });
    const lineCtx = lineCanvasRef.current.getContext("2d", { willReadFrequently: true });
    smartFloodFill(colorCtx, lineCtx, x, y, color);
  };
  const useSticker = (x, y) => {
    const ctx = colorCanvasRef.current.getContext("2d");
    if (selectedSticker.type === "emoji") {
      ctx.font = "40px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedSticker.content, x, y);
    } else if (selectedSticker.type === "image") {
      const img = new Image();
      img.src = selectedSticker.content;
      img.onload = () => {
        const size = 60;
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      };
    }
  };
  const usePencil = (x, y, isStart) => {
    const ctx = colorCanvasRef.current.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    if (isStart) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  const downloadArt = () => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = colorCanvasRef.current.width;
    finalCanvas.height = colorCanvasRef.current.height;
    const ctx = finalCanvas.getContext("2d");
    ctx.drawImage(colorCanvasRef.current, 0, 0);
    ctx.drawImage(lineCanvasRef.current, 0, 0);
    const link = document.createElement("a");
    link.download = "merchboy-masterpiece.png";
    link.href = finalCanvas.toDataURL();
    link.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "10px",
      background: "#222",
      padding: "10px",
      borderRadius: "50px",
      border: "2px solid #555"
    }, children: [
      COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: () => {
            setColor(c);
            setTool("pencil");
          },
          style: {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: c,
            border: color === c ? "3px solid white" : "none"
          }
        },
        c
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
        border: "2px solid #555",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "color",
          value: color,
          onChange: (e) => {
            setColor(e.target.value);
            setTool("pencil");
          },
          style: { width: "150%", height: "150%", padding: 0, border: "none", background: "none" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "2px", background: "#555" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setTool("bucket"), style: { background: tool === "bucket" ? "#444" : "transparent", border: "none", fontSize: "1.2rem" }, children: "🪣" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setTool("pencil"), style: { background: tool === "pencil" ? "#444" : "transparent", border: "none", fontSize: "1.2rem" }, children: "✏️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setTool("eraser"), style: { background: tool === "eraser" ? "#444" : "transparent", border: "none", fontSize: "1.2rem" }, children: "🧹" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "2px", background: "#555" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setTool("sticker"), style: { background: tool === "sticker" ? "#444" : "transparent", border: "none", fontSize: "1.2rem" }, children: "🦄" })
    ] }),
    tool === "sticker" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      gap: "10px",
      background: "#222",
      padding: "10px",
      borderRadius: "20px",
      border: "2px dashed #555"
    }, children: STICKERS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setSelectedSticker(s),
        style: {
          background: "transparent",
          border: selectedSticker === s ? "2px solid white" : "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          borderRadius: "5px",
          padding: "5px"
        },
        children: s.type === "emoji" ? s.content : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.content, style: { width: "30px", height: "30px", objectFit: "contain" } })
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: canvasContainerRef, style: { position: "relative", width: "100%", maxWidth: "500px", aspectRatio: "1/1", border: "4px solid gold", borderRadius: "10px", background: "white" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: colorCanvasRef,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp,
          onTouchStart: (e) => {
            e.preventDefault();
            handleMouseDown(e);
          },
          onTouchMove: (e) => {
            e.preventDefault();
            handleMouseMove(e);
          },
          onTouchEnd: (e) => {
            e.preventDefault();
            handleMouseUp();
          },
          style: { position: "absolute", top: 0, left: 0, touchAction: "none" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: lineCanvasRef,
          style: { position: "absolute", top: 0, left: 0, pointerEvents: "none" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: downloadArt, style: {
      padding: "10px 30px",
      background: "gold",
      color: "black",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "1.2rem"
    }, children: "SAVE MASTERPIECE 💾" })
  ] });
};
const TEMPLATES = [
  { id: 1, src: "/assets/skins/face_money.png", title: "Money Face", cost: 0 },
  { id: 2, src: "/assets/skins/face_bear.png", title: "Bear Face", cost: 0 },
  { id: 3, src: "/assets/skins/face_bunny.png", title: "Bunny Face", cost: 0 },
  { id: 4, src: "/assets/skins/face_default.png", title: "Standard", cost: 0 }
];
const Coloring = () => {
  const [coins, setCoins] = reactExports.useState(0);
  const [purchased, setPurchased] = reactExports.useState(JSON.parse(localStorage.getItem("unlockedColoringPages")) || [1]);
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(null);
  const [previewTemplate, setPreviewTemplate] = reactExports.useState(null);
  const { playWin, playBeep } = useRetroSound();
  reactExports.useEffect(() => {
    const handleStorageChange = () => {
      const currentCoins = parseInt(localStorage.getItem("arcadeCoins")) || 0;
      setCoins(currentCoins);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1e3);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const handleSelect = (template) => {
    if (purchased.includes(template.id)) {
      setSelectedTemplate(template);
      playBeep();
    } else {
      setPreviewTemplate(template);
      playBeep();
    }
  };
  const handlePurchase = () => {
    if (!previewTemplate) return;
    if (coins >= previewTemplate.cost) {
      const newCoins = coins - previewTemplate.cost;
      localStorage.setItem("arcadeCoins", newCoins);
      setCoins(newCoins);
      const newPurchased = [...purchased, previewTemplate.id];
      setPurchased(newPurchased);
      localStorage.setItem("unlockedColoringPages", JSON.stringify(newPurchased));
      playWin();
      triggerConfetti();
      setPreviewTemplate(null);
    } else {
      alert("Insufficient Funds!");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    textAlign: "center",
    minHeight: "100vh",
    fontFamily: '"Orbitron", sans-serif',
    background: "linear-gradient(to bottom, #1a0b2e, #000)",
    paddingBottom: "150px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2rem", color: "var(--neon-pink)", textShadow: "0 0 10px var(--neon-pink)", margin: 0 }, children: "COLORING STUDIO" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", fontSize: "0.9rem", marginTop: "5px" }, children: [
        "WALLET: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--neon-gold)", fontWeight: "bold" }, children: [
          coins.toLocaleString(),
          " 🪙"
        ] })
      ] })
    ] }),
    !selectedTemplate ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "20px",
      padding: "0 20px",
      maxWidth: "1000px",
      margin: "0 auto"
    }, children: TEMPLATES.map((template) => {
      const isOwned = purchased.includes(template.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => handleSelect(template),
          className: "glass-panel",
          style: {
            border: isOwned ? "1px solid var(--neon-green)" : "1px solid #333",
            padding: "15px",
            cursor: "pointer",
            opacity: isOwned ? 1 : 0.7,
            transition: "transform 0.2s",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: isOwned ? "rgba(0, 255, 170, 0.05)" : "rgba(0,0,0,0.3)"
          },
          onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
          onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
          children: [
            !isOwned && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "1.5rem",
              zIndex: 10
            }, children: "🔒" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "white", borderRadius: "8px", padding: "5px", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: template.src,
                alt: template.title,
                style: {
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  filter: isOwned ? "none" : "grayscale(100%) opacity(0.5)"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "15px", fontWeight: "bold", color: "white", letterSpacing: "1px" }, children: template.title.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              color: isOwned ? "var(--neon-green)" : "var(--neon-gold)",
              marginTop: "5px",
              fontSize: "0.8rem",
              fontWeight: "bold"
            }, children: isOwned ? "OWNED" : `🪙 ${template.cost}` })
          ]
        },
        template.id
      );
    }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", margin: "0 auto 20px auto" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: () => setSelectedTemplate(null), style: {
          padding: "10px 20px",
          background: "#333",
          color: "white",
          border: "1px solid #555",
          fontSize: "0.9rem"
        }, children: "⬅ BACK TO GALLERY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888" }, children: [
          "EDITING: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "white" }, children: selectedTemplate.title.toUpperCase() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: { padding: "20px", display: "inline-block", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ColoringCanvas, { templateImage: selectedTemplate.src }) })
    ] }),
    previewTemplate && !selectedTemplate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.9)",
      zIndex: 2e3,
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel", style: {
      padding: "40px",
      border: "1px solid var(--neon-gold)",
      textAlign: "center",
      maxWidth: "400px",
      boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "var(--neon-gold)", margin: 0, fontSize: "1.5rem" }, children: "UNLOCK TEMPLATE?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "white", borderRadius: "10px", padding: "10px", margin: "20px 0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: previewTemplate.src, style: { width: "100%", height: "200px", objectFit: "contain" } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.2rem", color: "white", margin: "20px 0" }, children: [
        "COST: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { style: { color: "var(--neon-gold)" }, children: [
          previewTemplate.cost,
          " COINS"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquishyButton, { onClick: handlePurchase, style: {
          background: "var(--neon-gold)",
          color: "black",
          border: "none",
          padding: "15px 40px",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }, children: "UNLOCK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreviewTemplate(null), style: {
          background: "transparent",
          color: "#888",
          border: "1px solid #555",
          padding: "10px 30px",
          borderRadius: "20px",
          cursor: "pointer"
        }, children: "CANCEL" })
      ] })
    ] }) })
  ] });
};
export {
  Coloring as default
};
