from test_ascii import ascii_art
print("DEEP ROW 0, COL 0:")
import os
os.system("python -c \"from PIL import Image; img = Image.open('public/assets/fishing/fishing_deep.png'); img.crop((0, 0, 256, 256)).save('temp.png')\"")
ascii_art('temp.png')
