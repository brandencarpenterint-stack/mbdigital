filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            } else {
                ctx.fillText(fish.emoji || '❓', x, y);
            }"""

replacement = """            } else {
                ctx.save();
                ctx.translate(x, y);
                if (dir === -1) ctx.scale(-1, 1);
                ctx.font = `${size}px serif`;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(fish.emoji || '❓', 0, 0);
                ctx.restore();
            }"""

# Python string replace using literal characters
content = content.replace(target.replace('❓', '?'), replacement.replace('❓', '?'))
content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
