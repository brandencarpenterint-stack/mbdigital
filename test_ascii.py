from PIL import Image

def ascii_art(img_path):
    img = Image.open(img_path).convert("RGBA")
    img = img.resize((32, 32))
    pixels = img.load()
    chars = " .:-=+*#%@"
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
        print(row)

print("WOOD:")
ascii_art("wood.png")
print("SNAKE:")
ascii_art("snake.png")
