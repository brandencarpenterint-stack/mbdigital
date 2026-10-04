filepath = 'src/components/PocketRoom.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    // Render Grid
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const itemDef = itemData ? DECOR_ITEMS.find(d => d.id === itemData.id) : null;"""

replacement = """    // Render Grid
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const itemData = getItemAt(x, y);
            const itemDef = itemData ? DECOR_ITEMS.find(d => d.id === itemData.id) : null;"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed PocketRoom.jsx")
