import re
filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of blindly replacing, let's just find the FISH_DATA array and replace row: 3 -> row: 2, col: 3 -> col: 2
# But wait, some fish might be row: 3, col: 3 -> row: 2, col: 2.
def replacer(match):
    row = int(match.group(1))
    col = int(match.group(2))
    if row == 3: row = 2
    if col == 3: col = 2
    return f"row: {row}, col: {col}"

content = re.sub(r"row:\s*(\d+),\s*col:\s*(\d+)", replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
