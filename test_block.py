from PIL import Image

img = Image.open('public/assets/fishing/fishing_surface.png')
pixels = img.load()

# Let's find a pixel that is opaque and near the top left
for y in range(0, 100):
    for x in range(0, 100):
        if pixels[x,y][3] == 255:
            print(f"Blocked at {x},{y}: {pixels[x,y]}")
            break
    else:
        continue
    break
