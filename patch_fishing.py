import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_draw = '''        const drawFish = (ctx, fish, x, y, size = 50) => {
            if (fish.sheet && sheetRefs.current[fish.sheet]) {
                const sx = fish.col * (sheetRefs.current[fish.sheet].width / 4);
                const sy = fish.row * (sheetRefs.current[fish.sheet].height / 4);
                const sSizeX = sheetRefs.current[fish.sheet].width / 4;
                const sSizeY = sheetRefs.current[fish.sheet].height / 4;
                ctx.drawImage(sheetRefs.current[fish.sheet], sx, sy, sSizeX, sSizeY, x - size/2, y - size/2, size, size);
            } else {
                ctx.fillText(fish.emoji || '?"', x, y);
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
                // Flip if moving left (dir === -1)
                if (dir === -1) ctx.scale(-1, 1);
                ctx.drawImage(img, sx, sy, sSizeX, sSizeY, -size/2, -size/2, size, size);
                ctx.restore();
            } else {
                ctx.fillText(fish.emoji || '?', x, y);
            }
        };'''

# Need to check if drawFish is called with direction to fix the flipping too!
# Let's just fix the crash first, and also pass ish.dir if available.
