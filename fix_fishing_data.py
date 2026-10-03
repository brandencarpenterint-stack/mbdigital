filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace missing items
content = content.replace("sheet: 'surface', row: 0, col: 3", "sheet: 'surface', row: 0, col: 1") # Driftwood -> Tin Can
content = content.replace("sheet: 'surface', row: 1, col: 3", "sheet: 'surface', row: 1, col: 2") # Sushi -> Bass
content = content.replace("sheet: 'surface', row: 2, col: 3", "sheet: 'surface', row: 0, col: 2") # Snake -> Bone
content = content.replace("sheet: 'surface', row: 3, col: 0", "sheet: 'surface', row: 1, col: 0") # Eel -> Goldfish
content = content.replace("sheet: 'surface', row: 3, col: 1", "sheet: 'surface', row: 1, col: 1") # Snail -> Clown
content = content.replace("sheet: 'surface', row: 3, col: 2", "sheet: 'surface', row: 2, col: 0") # Cuke -> Crab
content = content.replace("sheet: 'surface', row: 3, col: 3", "sheet: 'surface', row: 0, col: 0") # Chest -> Boot

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
