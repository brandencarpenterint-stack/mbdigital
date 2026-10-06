filepath = 'src/games/MemoryMatch/MemoryMatchGame.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Find the entire const CARDS = [ ... ]; block
pattern = re.compile(r"const CARDS = \[.*?\];", re.DOTALL)

replacement = """const CARD_POOL = [
    { id: 1, type: 'image', content: '/assets/brokid-logo.png', alt: 'Brokid' },
    { id: 2, type: 'image', content: '/assets/merchboy_cat.png', alt: 'Cat Hat' },
    { id: 3, type: 'image', content: '/assets/merchboy_bunny.png', alt: 'Bunny Hat' },
    { id: 4, type: 'image', content: '/assets/skins/face_default.png', alt: 'OG' },
    { id: 5, type: 'image', content: '/assets/skins/jump_guy.png', alt: 'Jumper' },
    { id: 6, type: 'image', content: '/assets/skins/face_bear.png', alt: 'Bear' },
    { id: 7, type: 'image', content: '/assets/skins/face_dino.png', alt: 'Dino' },
    { id: 8, type: 'image', content: '/assets/skins/face_star.png', alt: 'Star' },
    { id: 9, type: 'image', content: '/assets/skins/face_space.png', alt: 'Space' },
    { id: 10, type: 'emoji', content: '🍔' },
    { id: 11, type: 'emoji', content: '⭐' },
    { id: 12, type: 'emoji', content: '🚀' },
    { id: 13, type: 'emoji', content: '👾' },
    { id: 14, type: 'emoji', content: '💰' },
    { id: 15, type: 'emoji', content: '🔥' },
    { id: 16, type: 'emoji', content: '💎' },
    { id: 17, type: 'emoji', content: '🍄' },
    { id: 18, type: 'emoji', content: '👑' },
    { id: 19, type: 'image', content: '/assets/skins/face_pumpkin.png', alt: 'Pumpkin' },
    { id: 20, type: 'image', content: '/assets/skins/face_gamer.png', alt: 'Gamer' },
    { id: 21, type: 'image', content: '/assets/skins/face_frog.png', alt: 'Frog' },
    { id: 22, type: 'image', content: '/assets/skins/face_astro.png', alt: 'Astro' },
    { id: 23, type: 'image', content: '/assets/skins/face_rainbow.png', alt: 'Rainbow' },
];"""

content = re.sub(pattern, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced CARDS with CARD_POOL")
