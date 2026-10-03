filepath = 'src/games/GalaxyDefender/GalaxyDefender.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("            powerups: [],\n            powerups: [],", "            powerups: [],")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
