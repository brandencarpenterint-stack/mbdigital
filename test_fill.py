from PIL import Image

def is_bg(c):
    r,g,b = c[:3]
    if abs(r-g) < 30 and abs(g-b) < 30 and abs(r-b) < 30:
        if 80 < r < 230:
            return True
    return False

def remove_background(img_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    visited = set()
    queue = []
    
    # Add borders of all 16 cells
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

    opaque = sum(1 for x in range(width) for y in range(height) if pixels[x,y][3] == 255)
    print(f"{img_path}: Opaque pixels = {opaque} / {width*height}")
    img.save("test_out.png", "PNG")

# first, git checkout to restore the ORIGINAL image so we have the full checkerboard
import os
os.system("git checkout public/assets/fishing/fishing_surface.png")
remove_background('public/assets/fishing/fishing_surface.png')
