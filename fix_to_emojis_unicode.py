import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    rest = match.group(0)
    rest = re.sub(r"sheet:\s*'[^']+',\s*", "", rest)
    rest = re.sub(r"row:\s*\d+,\s*", "", rest)
    rest = re.sub(r"col:\s*\d+,\s*", "", rest)
    return rest

content = re.sub(r"id:\s*'([^']+)'([^}]+)", replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
