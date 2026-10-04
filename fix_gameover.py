filepath = 'src/components/UniversalGameOver.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const finalCoins = Math.max(finalCoins * 3, Math.floor(score * 1.5));", "const finalCoins = Math.max(coinsEarned * 3, Math.floor(score * 1.5));")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed UniversalGameOver")
