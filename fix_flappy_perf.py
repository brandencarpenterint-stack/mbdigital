filepath = 'src/games/FlappyMascot/FlappyMascot.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            } else if (charData.content.includes('/assets/')) {
                // Generic Loader for new assets
                // We should really strictly preload these but for now, rely on cache
                const img = new Image();
                img.src = charData.content;
                ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
            } else {"""

replacement = """            } else if (charData.content.includes('/assets/')) {
                // Use preloaded ref if it matches the current charData
                let img = null;
                if (charData.id === 'flappy_money') img = moneyImgRef.current;
                else if (charData.id === 'flappy_face_money') img = moneyImgRef.current;
                else if (charData.id === 'flappy_cat' || charData.id === 'flappy_face_bear') img = bearImgRef.current;
                else if (charData.id === 'flappy_bunny' || charData.id === 'flappy_face_bunny') img = bunnyImgRef.current;
                else if (charData.id === 'flappy_brokid') img = brokidImgRef.current;
                else img = birdImgRef.current; // Fallback to classic

                if (img && img.complete) {
                    ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
                }
            } else {"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
