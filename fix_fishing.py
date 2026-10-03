import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix drawFish DOMException
old_draw = '''        const drawFish = (ctx, fish, x, y, size = 50) => {
            if (fish.sheet && sheetRefs.current[fish.sheet]) {
                const sx = fish.col * (sheetRefs.current[fish.sheet].width / 4);
                const sy = fish.row * (sheetRefs.current[fish.sheet].height / 4);
                const sSizeX = sheetRefs.current[fish.sheet].width / 4;
                const sSizeY = sheetRefs.current[fish.sheet].height / 4;
                ctx.drawImage(sheetRefs.current[fish.sheet], sx, sy, sSizeX, sSizeY, x - size/2, y - size/2, size, size);
            } else {
                ctx.fillText(fish.emoji || '??', x, y);
            }
        };'''

new_draw = '''        const drawFish = (ctx, fish, x, y, size = 50, dir = 1) => {
            const img = fish.sheet && sheetRefs.current[fish.sheet];
            if (img && img.complete && img.width > 0) {
                const sx = fish.col * (img.width / 4);
                const sy = fish.row * (img.height / 4);
                const sSizeX = img.width / 4;
                const sSizeY = img.height / 4;
                
                ctx.save();
                ctx.translate(x, y);
                if (dir === -1) ctx.scale(-1, 1);
                ctx.drawImage(img, sx, sy, sSizeX, sSizeY, -size/2, -size/2, size, size);
                ctx.restore();
            } else {
                ctx.fillText(fish.emoji || '??', x, y);
            }
        };'''

# Need to safely replace, might have emoji encoding issues in Python strings.
# Instead, we can just replace the inside of the if statement!
old_if = '''            if (fish.sheet && sheetRefs.current[fish.sheet]) {
                const sx = fish.col * (sheetRefs.current[fish.sheet].width / 4);
                const sy = fish.row * (sheetRefs.current[fish.sheet].height / 4);
                const sSizeX = sheetRefs.current[fish.sheet].width / 4;
                const sSizeY = sheetRefs.current[fish.sheet].height / 4;
                ctx.drawImage(sheetRefs.current[fish.sheet], sx, sy, sSizeX, sSizeY, x - size/2, y - size/2, size, size);
            }'''

new_if = '''            const img = fish.sheet && sheetRefs.current[fish.sheet];
            if (img && img.complete && img.width > 0) {
                const sx = fish.col * (img.width / 4);
                const sy = fish.row * (img.height / 4);
                const sSizeX = img.width / 4;
                const sSizeY = img.height / 4;
                ctx.save();
                ctx.translate(x, y);
                // fish.dir isn't available here unless we pass it, so let's just draw normally for now
                // we'll pass dir as an extra param in next patch if needed
                ctx.drawImage(img, sx, sy, sSizeX, sSizeY, -size/2, -size/2, size, size);
                ctx.restore();
            }'''

content = content.replace(old_if, new_if)

# Fix drawFish calls in CrazyFishing.jsx
# drawFish(ctx, f.type, f.x, f.y, 40); -> drawFish(ctx, f.type, f.x, f.y, 40, f.dir);
# I'll update drawFish definition to take dir
content = content.replace("const drawFish = (ctx, fish, x, y, size = 50) => {", "const drawFish = (ctx, fish, x, y, size = 50, dir = 1) => {")
content = content.replace("drawFish(ctx, f.type, f.x, f.y, 40);", "drawFish(ctx, f.type, f.x, f.y, 40, f.dir);")
# add the scale to new_if:
content = content.replace("// fish.dir isn't available here unless we pass it, so let's just draw normally for now\n                // we'll pass dir as an extra param in next patch if needed\n                ctx.drawImage", "if (dir === -1) ctx.scale(-1, 1);\n                ctx.drawImage")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
