import glob
import os
from PIL import Image

def is_bg(c):
    r,g,b = c[:3]
    if abs(r-g) < 35 and abs(g-b) < 35 and abs(r-b) < 35:
        if 60 < r < 240:
            return True
    return False

def remove_background(img_path):
    # Restore original image first to avoid compounding artifact issues
    os.system(f'git checkout "{img_path}"')
    
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    visited = set()
    queue = []
    
    cell_w = width // 4
    cell_h = height // 4
    
    for row in range(4):
        for col in range(4):
            x_start = col * cell_w
            y_start = row * cell_h
            x_end = x_start + cell_w - 1
            y_end = y_start + cell_h - 1
            
            for x in range(x_start, x_end + 1):
                queue.append((x, y_start))
                queue.append((x, y_end))
            for y in range(y_start, y_end + 1):
                queue.append((x_start, y))
                queue.append((x_end, y))
                
    for q in queue:
        visited.add(q)
        
    while queue:
        x, y = queue.pop(0)
        c = pixels[x,y]
        
        if is_bg(c) or c[3] == 0:
            pixels[x,y] = (0,0,0,0)
            
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    # Optional: second pass to clean up any floating isolated pixels
    # For now, let's just save.
    img.save(img_path, "PNG")
    print(f"Cleaned {img_path}")

for f in glob.glob("public/assets/fishing/*.png"):
    remove_background(f)
