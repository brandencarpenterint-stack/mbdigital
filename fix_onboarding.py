filepath = 'src/components/OnboardingModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

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

# Fix the flex wrapping
target_flex = "display: 'flex', justifyContent: 'center', gap: '15px'"
replacement_flex = "display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap'"
content = content.replace(target_flex, replacement_flex)

# Slightly reduce size from 60px to 45px so it fits nice
target_size = "width: '60px', height: '60px',"
replacement_size = "width: '50px', height: '50px',"
content = content.replace(target_size, replacement_size)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed OnboardingModal")
