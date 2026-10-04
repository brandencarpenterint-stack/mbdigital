filepath = 'src/games/MemoryMatch/MemoryMatchGame.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("YOU WIN!", "ROUND CLEARED!")

content = content.replace("width: '100px',", "width: cards.length >= 24 ? '80px' : '100px',")
content = content.replace("height: '100px',", "height: cards.length >= 24 ? '80px' : '100px',")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Tweaked MemoryMatch styles")
