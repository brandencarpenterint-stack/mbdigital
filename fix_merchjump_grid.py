filepath = 'src/games/MerchJump/MerchJump.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("gridTemplateColumns: '1fr 1fr'", "gridTemplateColumns: 'repeat(4, 1fr)'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated grid in MerchJump")
