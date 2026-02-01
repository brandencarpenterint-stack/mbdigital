import { a as usePocketBro, j as jsxRuntimeExports } from "./index-BL4nUXVC.js";
const DECOR_ITEMS = [
  // --- BACKGROUNDS ---
  {
    id: "bg_cyber",
    name: "Cyber City",
    type: "background",
    price: 500,
    icon: "🌃",
    css: { background: "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)" },
    desc: "A view of the neon skyline."
  },
  {
    id: "bg_dojo",
    name: "Zen Dojo",
    type: "background",
    price: 800,
    icon: "⛩️",
    css: { background: "linear-gradient(to bottom, #d7d2cc 0%, #304352 100%)" },
    desc: "Peace and tranquility."
  },
  {
    id: "bg_space",
    name: "Deep Space",
    type: "background",
    price: 1e3,
    icon: "🌌",
    css: { background: "#090a0f" },
    className: "bg-space",
    desc: "Stars shimmer in the void."
  },
  {
    id: "bg_city",
    name: "Neon City",
    type: "background",
    price: 1500,
    icon: "🌃",
    css: { background: "#000" },
    className: "bg-city",
    desc: "The city never sleeps."
  },
  {
    id: "bg_underwater",
    name: "The Abyss",
    type: "background",
    price: 1200,
    icon: "🫧",
    css: { background: "#001e36" },
    className: "bg-abyss",
    desc: "Glub glub."
  },
  {
    id: "bg_magma",
    name: "Magma Core",
    type: "background",
    price: 2e3,
    icon: "🔥",
    css: { background: "#330000" },
    className: "bg-magma",
    desc: "Some like it hot."
  },
  // --- RUGS (Floor) ---
  {
    id: "rug_retro",
    name: "Retro Rug",
    type: "rug",
    price: 150,
    icon: "🟧",
    style: { width: "80%", height: "20px", background: "repeating-linear-gradient(45deg, #f06, #f06 10px, #444 10px, #444 20px)", borderRadius: "10px", bottom: "10px" },
    desc: "Really ties the room together."
  },
  {
    id: "rug_dance",
    name: "Dance Floor",
    type: "rug",
    price: 500,
    icon: "🕺",
    style: { width: "80%", height: "20px", background: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)", animation: "rainbow 2s infinite linear", bottom: "10px" },
    desc: "Can't stop the feeling!"
  },
  // --- LEFT ITEMS (Plants/Lamps) ---
  {
    id: "item_bonsai",
    name: "Neon Bonsai",
    type: "item_left",
    price: 300,
    icon: "🌳",
    render: "🌳",
    style: { fontSize: "2rem", filter: "drop-shadow(0 0 5px #0f0)", bottom: "20px", left: "10px" },
    desc: "Low maintenance."
  },
  {
    id: "item_pc",
    name: "Gaming Rig",
    type: "item_left",
    price: 1200,
    icon: "🖥️",
    render: "🖥️RGB",
    style: { fontSize: "2rem", filter: "drop-shadow(0 0 10px cyan)", bottom: "20px", left: "10px" },
    desc: "Runs Crysis."
  },
  // --- RIGHT ITEMS (Toys/Posters) ---
  {
    id: "item_poster",
    name: "Merchboy Poster",
    type: "item_right",
    price: 200,
    icon: "📜",
    render: "📜",
    style: { fontSize: "2rem", top: "20px", right: "10px", transform: "rotate(5deg)" },
    desc: "Support the brand."
  },
  {
    id: "item_lamp",
    name: "Lava Lamp",
    type: "item_right",
    price: 400,
    icon: "💡",
    render: "🌋",
    style: { fontSize: "2rem", bottom: "20px", right: "10px", filter: "drop-shadow(0 0 10px red)" },
    desc: "Groovy."
  },
  // --- FURNITURE (Grid Mode) ---
  { id: "furn_arcade", name: "Arcade Cab", type: "furniture", price: 2e3, icon: "🕹️", desc: "Mini cabinet.", style: { fontSize: "2.5rem" } },
  { id: "furn_tv", name: "Retro TV", type: "furniture", price: 800, icon: "📺", desc: "Static noise.", style: { fontSize: "2.2rem" } },
  { id: "furn_pc", name: "Battlestation", type: "furniture", price: 2500, icon: "🖥️", desc: "RGB Everything.", style: { fontSize: "2.2rem", filter: "drop-shadow(0 0 5px cyan)" } },
  { id: "furn_bed", name: "Cozy Bed", type: "furniture", price: 1e3, icon: "🛏️", desc: "Nap time.", style: { fontSize: "2.5rem" } },
  { id: "furn_plant", name: "Houseplant", type: "furniture", price: 200, icon: "🪴", desc: "Oxygen provider.", style: { fontSize: "2rem" } },
  { id: "furn_pizza", name: "Pizza Stack", type: "furniture", price: 150, icon: "🍕", desc: "Leftovers.", style: { fontSize: "1.8rem" } },
  { id: "furn_cat_tree", name: "Cat Tower", type: "furniture", price: 600, icon: "🐈", desc: "For the kitty.", style: { fontSize: "2.5rem" } },
  { id: "furn_skull", name: "Skull Decor", type: "furniture", price: 500, icon: "💀", desc: "Edgy.", style: { fontSize: "2rem" } },
  { id: "furn_chest", name: "Loot Box", type: "furniture", price: 3e3, icon: "💎", desc: "Stash your crypto.", style: { fontSize: "2.2rem", filter: "drop-shadow(0 0 5px gold)" } },
  { id: "furn_ufo", name: "Model UFO", type: "furniture", price: 1500, icon: "🛸", desc: "I want to believe.", style: { fontSize: "2rem", animation: "float 2s infinite" } },
  { id: "furn_duck", name: "Giant Duck", type: "furniture", price: 400, icon: "🦆", desc: "Mega quack.", style: { fontSize: "2rem" } },
  { id: "furn_robot", name: "Toy Robot", type: "furniture", price: 700, icon: "🤖", desc: "Beep boop.", style: { fontSize: "2rem" } }
];
const GRID_SIZE = 5;
const PocketRoom = ({ isEditing, selectedItem, onPlace, customItems }) => {
  const { stats, removeItem } = usePocketBro();
  const placedItems = customItems || stats.placedItems || [];
  const getItemAt = (x, y) => placedItems.find((i) => i.x === x && i.y === y);
  const handleCellClick = (x, y) => {
    if (!isEditing) return;
    if (x === 2 && y === 2) return;
    const existing = getItemAt(x, y);
    if (selectedItem) {
      onPlace(selectedItem, x, y);
    } else if (existing) {
      removeItem(x, y);
    }
  };
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const itemData = getItemAt(x, y);
      const itemDef = itemData ? DECOR_ITEMS.find((d) => d.id === itemData.id) : null;
      const isValidFurniture = itemDef && itemDef.type !== "background";
      const isCenter = x === 2 && y === 2;
      cells.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => handleCellClick(x, y),
            style: {
              width: "100%",
              aspectRatio: "1/1",
              border: isEditing ? "1px dashed rgba(255,255,255,0.2)" : "none",
              background: isEditing && isCenter ? "rgba(255,0,0,0.1)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              cursor: isEditing ? "pointer" : "default",
              position: "relative"
            },
            children: [
              isValidFurniture ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...itemDef.style, position: "relative", top: 0, left: 0, right: 0, bottom: 0, fontSize: "2rem" }, children: itemDef.render || itemDef.icon }) : null,
              isCenter && isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.5rem", color: "red" }, children: "BRO" })
            ]
          },
          `${x}-${y}`
        )
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
    width: "100%",
    height: "100%",
    position: "absolute",
    inset: 0,
    zIndex: 10
    // Behind UI but above BG
  }, children: cells });
};
export {
  DECOR_ITEMS as D,
  PocketRoom as P
};
