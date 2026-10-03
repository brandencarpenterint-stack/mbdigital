filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("char: 'dY\\' '", "char: '\\U0001F4A7'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
