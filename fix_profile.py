filepath = 'src/components/ProfileModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_avatars = """const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/face_money.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
];"""

replacement_avatars = """const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/jump_guy.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
    '/assets/skins/face_dino.png',
    '/assets/skins/face_star.png',
    '/assets/skins/face_space.png',
    '/assets/skins/face_pumpkin.png',
    '/assets/skins/face_gamer.png',
    '/assets/skins/face_frog.png',
    '/assets/skins/face_astro.png',
    '/assets/skins/face_rainbow.png'
];"""

content = content.replace(target_avatars, replacement_avatars)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ProfileModal")
