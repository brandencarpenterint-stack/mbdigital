from PIL import Image

def ascii_art(img_path):
    img = Image.open(img_path).convert("RGBA")
    img = img.resize((32, 32))
    pixels = img.load()
    chars = " .:-=+*#%@"
    row_strs = []
    for y in range(32):
        row = ""
        for x in range(32):
            r,g,b,a = pixels[x,y]
            if a < 128:
                row += " "
            else:
                brightness = sum([r,g,b]) / 3
                idx = int(brightness / 255 * 9)
                row += chars[idx]
        row_strs.append(row)
    return row_strs

img = Image.open('public/assets/fishing/fishing_deep.png')
for r in range(4):
    for c in range(4):
        img.crop((c*256, r*256, (c+1)*256, (r+1)*256)).save(f'temp_{r}_{c}.png')
        
for r in range(4):
    rows = ["" for _ in range(32)]
    for c in range(4):
        art = ascii_art(f'temp_{r}_{c}.png')
        for i in range(32):
            rows[i] += art[i] + " | "
    print(f"--- ROW {r} ---")
    for row in rows:
        print(row)


