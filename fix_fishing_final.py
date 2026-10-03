import glob
from PIL import Image

def is_bg(c):
    r,g,b = c[:3]
    # Check light gray checkerboard tile
    if abs(r-198) < 15 and abs(g-198) < 15 and abs(b-198) < 15:
        return True
    # Check dark gray checkerboard tile
    if abs(r-124) < 15 and abs(g-124) < 15 and abs(b-124) < 15:
        return True
    # Sometimes it's slightly different, maybe solid white?
    if r > 240 and g > 240 and b > 240:
        return True
    return False

def remove_background(img_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # BFS from borders
    visited = set()
    queue = []
    
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        
    for q in queue:
        visited.add(q)
        
    while queue:
        x, y = queue.pop(0)
        c = pixels[x,y]
        
        if is_bg(c):
            pixels[x,y] = (0,0,0,0) # Make transparent
            
            # Add neighbors
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    img.save(img_path, "PNG")
    print(f"Cleaned {img_path}")

for f in glob.glob("public/assets/fishing/*.png"):
    remove_background(f)

# Also fix CrazyFishing.jsx missing char
import re
filepath = "src/games/CrazyFishing/CrazyFishing.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the missing char in particle
old_particle = """                    state.particles.push({
                        x: state.hookX + (Math.random() - 0.5) * 10,
                        y: state.hookY,
                        dx: (Math.random() - 0.5) * 2,
                        dy: -2 - Math.random(),
                        life: 1,
                        color: config.color,
                        size: isMoving ? 20 : 10
                    });"""

new_particle = """                    state.particles.push({
                        x: state.hookX + (Math.random() - 0.5) * 10,
                        y: state.hookY,
                        dx: (Math.random() - 0.5) * 2,
                        dy: -2 - Math.random(),
                        life: 1,
                        char: 'o', // ADDED MISSING CHAR
                        color: config.color,
                        size: isMoving ? 20 : 10
                    });"""

content = content.replace(old_particle, new_particle)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

