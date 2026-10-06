filepath = 'src/games/MemoryMatch/MemoryMatchGame.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Fix win condition
target_win = re.compile(r"// Allow animation to finish\s*if \(solved\.length \+ 1 === CARDS\.length\) \{.*?\}\s*\} else \{", re.DOTALL)
replacement_win = """// Allow animation to finish
            if (solved.length + 1 === cards.length / 2) {
                playWin();
                triggerConfetti();
                const finalScore = score + 100 + (Math.max(0, 50 - moves) * 10);
                setScore(finalScore);
                
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    if (updateStat) updateStat('memoryHighScore', finalScore);
                }

                if (updateStat) updateStat('gamesPlayed', 'memory_match');
                if (addCoins) addCoins(50);
                
                setTimeout(() => setGameState('ROUND_OVER'), 1000);
            }
        } else {"""

content = re.sub(target_win, replacement_win, content)

# Slow down the incorrect match flip-back
content = content.replace("}, 400);", "}, 1000);")

# Slow down the flip animation slightly
content = content.replace("transition: 'transform 0.6s',", "transition: 'transform 0.8s',")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed win logic and flip speed")
