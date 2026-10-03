from test_ascii import ascii_art
for r in range(4):
    for c in range(4):
        print(f"ROW {r}, COL {c}:")
        import os
        os.system(f"python -c \"from PIL import Image; img = Image.open('public/assets/fishing/fishing_surface.png'); img.crop(({c}*256, {r}*256, ({c}+1)*256, ({r}+1)*256)).save('temp_{r}_{c}.png')\"")
        ascii_art(f"temp_{r}_{c}.png")
