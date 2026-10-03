import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Emojis for various fish themes
emoji_map = {
    'boot': '👢', 'can': '🥫', 'bottle': '📜', 'wood': '🪵', 'goldy': '🐟', 'shrimp': '🦐',
    'ducky': '🦆', 'sushi': '🍣', 'crab': '🦀', 'turtle': '🐢', 'seahorse': '🎠', 'snake': '🐍',
    'eel': '⚡', 'snail': '🐌', 'cuke': '🥒', 'goldboot': '🥾',
    
    'guppy': '🐠', 'clown': '🤡', 'squid': '🦑', 'lobster': '🦞', 'puffer': '🐡', 'star': '⭐',
    'box': '📦', 'conch': '🐚', 'jelly': '🪼', 'stingray': '🪁', 'angler': '🎣', 'sword': '🗡️',
    'micro': '🦠', 'flash': '🔦', 'vamp': '🧛', 'iso': '🪳',
    
    'shark': '🦈', 'whale': '🐋', 'moon': '🌘', 'kraken': '🐙', 'ghost': '👻', 'fossil': '🦴',
    'key': '🗝️', 'pirate_skull': '☠️', 'dino': '🦖',
    
    'ember': '🔥', 'dragon': '🐉', 'rock': '🪨', 'cooked': '🍗',
    
    'pizza': '🍕', 'spirit': '🎐', 'angel': '👼', 'cloud': '☁️', 'harp': '🪕',
    
    'glitch': '👾', 'eye': '👁️', 'alien': '👽', 'dna': '🧬', 'blackhole': '🕳️', 'null': '🚫', 'undef': '❓'
}

def replacer(match):
    id_val = match.group(1)
    if id_val in emoji_map:
        emoji = emoji_map[id_val]
        rest = match.group(2)
        # If the emoji is '??', replace it
        rest = re.sub(r"emoji:\s*'\?\?',", f"emoji: '{emoji}',", rest)
        # Or if it still has sheet
        rest = re.sub(r"sheet:\s*'[^']+',\s*row:\s*\d+,\s*col:\s*\d+,", f"emoji: '{emoji}',", rest)
        return f"id: '{id_val}'{rest}"
    return match.group(0)

# Replace all FISH_DATA entries
content = re.sub(r"id:\s*'([^']+)'([^}]+)", replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
