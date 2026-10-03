import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

missing_emojis = {
    'wolf': '\U0001F43A', # 🐺
    'sleep': '\U0001F4A4', # 💤
    'blob': '\U0001F4A7', # 💧
    'worm': '\U0001FAB1', # 🪱
    'viper': '\U0001F40D', # 🐍
    'cyber': '\U0001F916', # 🤖
    'robot': '\U0001F9BE', # 🦾
    'floppy': '\U0001F4BE', # 💾
    'batt': '\U0001F50B', # 🔋
    'skull': '\U0001F480', # 💀
    'ice': '\U0001F9CA', # 🧊
    'penguin': '\U0001F427', # 🐧
    'yeti': '\U0001F98D', # 🦍
    'cybershark': '\U0001F988' # 🦈
}

def replacer(match):
    id_val = match.group(1)
    rest = match.group(2)
    if id_val in missing_emojis:
        emoji = missing_emojis[id_val]
        # Only add if it doesn't already have one
        if 'emoji:' not in rest:
            # insert it after score
            rest = re.sub(r"(score:\s*\d+,)", rf"\1 emoji: '{emoji}',", rest)
    return f"id: '{id_val}'{rest}"

content = re.sub(r"id:\s*'([^']+)'([^}]+)", replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
