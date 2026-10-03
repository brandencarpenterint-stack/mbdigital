from PIL import Image

img = Image.open('public/assets/fishing/fishing_surface.png')
pixels = img.load()
width, height = img.size

# Let's count how many pixels are completely opaque
opaque = 0
for x in range(width):
    for y in range(height):
        if pixels[x,y][3] == 255:
            opaque += 1
print(f"Opaque pixels: {opaque} / {width*height}")
