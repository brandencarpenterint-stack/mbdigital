filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        // Progress
        ctx.fillStyle = 'white'; ctx.font = '20px Arial';
        ctx.fillText(`fishPos: ${state.fishPos}`, 100, 100);
        ctx.fillText(`fishY: ${fishY}`, 100, 130);
        ctx.fillText(`emoji: ${state.battleFish.emoji}`, 100, 160);
        const h = (state.catchPercent / 100) * BAR_AREA_HEIGHT;"""

replacement = """        // Progress
        const h = (state.catchPercent / 100) * BAR_AREA_HEIGHT;"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
