# FaceRunner
filepath = 'src/games/FaceRunner/FaceRunner.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const SKINS = [
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png' },
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
    ];"""

replacement = """    const SKINS = [
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png' },
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
        { id: 'face_dino', name: 'DINO', src: '/assets/skins/face_dino.png' },
        { id: 'face_star', name: 'STAR', src: '/assets/skins/face_star.png' },
        { id: 'face_space', name: 'SPACE', src: '/assets/skins/face_space.png' },
        { id: 'face_pumpkin', name: 'PUMPKIN', src: '/assets/skins/face_pumpkin.png' },
        { id: 'face_gamer', name: 'GAMER', src: '/assets/skins/face_gamer.png' },
        { id: 'face_frog', name: 'FROG', src: '/assets/skins/face_frog.png' },
        { id: 'face_astro', name: 'ASTRO', src: '/assets/skins/face_astro.png' },
        { id: 'face_rainbow', name: 'RAINBOW', src: '/assets/skins/face_rainbow.png' },
    ];"""
content = content.replace(target, replacement)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)


# MerchJump
filepath = 'src/games/MerchJump/MerchJump.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target2 = """    const SKINS = [
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png?t=v3', hoodie: '#111' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2', hoodie: '#593a28' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2', hoodie: '#7cb9e8' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2', hoodie: '#333' },
    ];"""

replacement2 = """    const SKINS = [
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png?t=v3', hoodie: '#111' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2', hoodie: '#593a28' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2', hoodie: '#7cb9e8' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2', hoodie: '#333' },
        { id: 'face_dino', name: 'DINO', src: '/assets/skins/face_dino.png', hoodie: '#85c34a' },
        { id: 'face_star', name: 'STAR', src: '/assets/skins/face_star.png', hoodie: '#ffaa00' },
        { id: 'face_space', name: 'SPACE', src: '/assets/skins/face_space.png', hoodie: '#33ccff' },
        { id: 'face_pumpkin', name: 'PUMPKIN', src: '/assets/skins/face_pumpkin.png', hoodie: '#ff6600' },
        { id: 'face_gamer', name: 'GAMER', src: '/assets/skins/face_gamer.png', hoodie: '#9966ff' },
        { id: 'face_frog', name: 'FROG', src: '/assets/skins/face_frog.png', hoodie: '#66ff99' },
        { id: 'face_astro', name: 'ASTRO', src: '/assets/skins/face_astro.png', hoodie: '#ffcc00' },
        { id: 'face_rainbow', name: 'RAINBOW', src: '/assets/skins/face_rainbow.png', hoodie: '#ff6699' },
    ];"""

content = content.replace(target2, replacement2)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# MemoryMatch
filepath = 'src/games/MemoryMatch/MemoryMatchGame.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target3 = """    { id: 7, type: 'image', content: '/assets/skins/face_dino.png', alt: 'Dino' },
    { id: 8, type: 'image', content: '/assets/skins/face_star.png', alt: 'Star' },
    { id: 9, type: 'image', content: '/assets/skins/face_space.png', alt: 'Space' },"""
replacement3 = """    { id: 7, type: 'image', content: '/assets/skins/face_dino.png', alt: 'Dino' },
    { id: 8, type: 'image', content: '/assets/skins/face_star.png', alt: 'Star' },
    { id: 9, type: 'image', content: '/assets/skins/face_space.png', alt: 'Space' },
    { id: 19, type: 'image', content: '/assets/skins/face_pumpkin.png', alt: 'Pumpkin' },
    { id: 20, type: 'image', content: '/assets/skins/face_gamer.png', alt: 'Gamer' },
    { id: 21, type: 'image', content: '/assets/skins/face_frog.png', alt: 'Frog' },
    { id: 22, type: 'image', content: '/assets/skins/face_astro.png', alt: 'Astro' },
    { id: 23, type: 'image', content: '/assets/skins/face_rainbow.png', alt: 'Rainbow' },"""
content = content.replace(target3, replacement3)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated skins in all games")
