import re
filepath = "src/games/CrazyFishing/CrazyFishing.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the missing char in the particle push
# We will just find all occurrences of color: config.color and add char if missing
# Let's search for "color: config.color,"
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'color: config.color,' in line:
        # Check if the previous line has char
        if 'char:' not in lines[i-1] and 'char:' not in line:
            lines[i] = "                        char: '??',\n" + line

content = '\n'.join(lines)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

