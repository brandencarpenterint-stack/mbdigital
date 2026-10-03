filepath = "src/games/CrazyFishing/CrazyFishing.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    for line in f:
        if "id: 'snake'" in line:
            print(repr(line))
