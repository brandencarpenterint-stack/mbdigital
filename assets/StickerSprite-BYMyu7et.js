import { d as STICKER_COLLECTIONS, j as jsxRuntimeExports } from "./index-ofeJceFx.js";
const StickerSprite = ({ sticker, size = 64, style = {} }) => {
  const collection = STICKER_COLLECTIONS.find((c) => c.items.some((i) => i.id === sticker.id));
  if (!collection) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "?" });
  const sheetUrl = collection.sheet;
  const { row, col } = sticker;
  const posX = col / 2 * 100;
  const posY = row / 2 * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    width: size,
    height: size,
    backgroundImage: `url(${sheetUrl})`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundSize: "300%",
    // 3x zoom to show 1/3 of width
    imageRendering: "pixelated",
    borderRadius: "50%",
    // Optional circular crop if desired, or keep square die-cut
    backgroundColor: "transparent",
    filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))",
    ...style
  }, title: sticker.name });
};
export {
  StickerSprite as S
};
