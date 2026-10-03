import glob
from PIL import Image

def find_sprites(img_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    visited = set()
    sprites = []
    
    for y in range(height):
        for x in range(width):
            if pixels[x,y][3] > 0 and (x,y) not in visited:
                queue = [(x,y)]
                sprite_pixels = []
                min_x, max_x = x, x
                min_y, max_y = y, y
                
                visited.add((x,y))
                
                while queue:
                    cx, cy = queue.pop(0)
                    sprite_pixels.append((cx, cy, pixels[cx,cy]))
                    
                    min_x = min(min_x, cx)
                    max_x = max(max_x, cx)
                    min_y = min(min_y, cy)
                    max_y = max(max_y, cy)
                    
                    for dx, dy in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (-1,1), (1,-1), (1,1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if (nx, ny) not in visited and pixels[nx,ny][3] > 0:
                                visited.add((nx,ny))
                                queue.append((nx,ny))
                
                if len(sprite_pixels) > 50:
                    # Calculate center to determine which cell it belongs to
                    center_x = (min_x + max_x) // 2
                    center_y = (min_y + max_y) // 2
                    cell_col = min(3, max(0, center_x // 256))
                    cell_row = min(3, max(0, center_y // 256))
                    
                    sprites.append({
                        'min_x': min_x, 'max_x': max_x,
                        'min_y': min_y, 'max_y': max_y,
                        'pixels': sprite_pixels,
                        'cell_row': cell_row,
                        'cell_col': cell_col
                    })
    return sprites

for f in glob.glob("public/assets/fishing/*.png"):
    sprites = find_sprites(f)
    
    # Map to cells
    cells = {}
    for s in sprites:
        key = (s['cell_row'], s['cell_col'])
        if key not in cells:
            cells[key] = []
        cells[key].append(s)
        
    new_img = Image.new("RGBA", (1024, 1024), (0,0,0,0))
    cell_w, cell_h = 256, 256
    
    for row in range(4):
        for col in range(4):
            key = (row, col)
            if key in cells:
                # Get largest sprite in this cell
                cell_sprites = cells[key]
                s = max(cell_sprites, key=lambda x: len(x['pixels']))
                
                s_w = s['max_x'] - s['min_x'] + 1
                s_h = s['max_y'] - s['min_y'] + 1
                
                # If sprite is too big for cell, we'll just scale it down later or let it overflow slightly.
                # Let's center it perfectly.
                offset_x = col * cell_w + (cell_w - s_w) // 2
                offset_y = row * cell_h + (cell_h - s_h) // 2
                
                for px, py, color in s['pixels']:
                    new_x = offset_x + (px - s['min_x'])
                    new_y = offset_y + (py - s['min_y'])
                    if 0 <= new_x < 1024 and 0 <= new_y < 1024:
                        new_img.putpixel((new_x, new_y), color)
                        
    new_img.save(f, "PNG")
    print(f"Centered sprites in {f}")
