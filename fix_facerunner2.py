filepath = 'src/games/FaceRunner/FaceRunner.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png' },"
content = content.replace(target, "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed face_money from FaceRunner")
