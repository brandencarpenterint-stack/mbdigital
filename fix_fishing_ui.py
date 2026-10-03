import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. REELING_UP VISUALS
old_reel = '''        if (mode === 'REELING_UP') {
            // Draw Caught Fish on Hook
            const f = state.battleFish;
            ctx.font = '40px serif';
            if (f.type === 'image') ctx.fillText('??', state.hookX - 20, state.hookY + 40);
            else ctx.fillText(f.emoji, state.hookX - 20, state.hookY + 40);
        }'''
new_reel = '''        if (mode === 'REELING_UP') {
            // Draw Caught Fish on Hook
            const f = state.battleFish;
            if (f) drawFish(ctx, f, state.hookX, state.hookY + 20, 60);
        }'''
content = content.replace(old_reel, new_reel)
# In case it has weird characters in python
content = re.sub(r"        if \(mode === 'REELING_UP'\) \{\s*// Draw Caught Fish on Hook\s*const f = state\.battleFish;\s*ctx\.font = '40px serif';\s*if \(f\.type === 'image'\) ctx\.fillText\(.*?, state\.hookX - 20, state\.hookY \+ 40\);\s*else ctx\.fillText\(f\.emoji, state\.hookX - 20, state\.hookY \+ 40\);\s*\}", new_reel, content)


# 2. BATTLE UI
old_battle = '''        ctx.font = '30px serif';
        if (state.battleFish.type === 'image') ctx.fillText('??', trackX + 10, fishY + 30);
        else ctx.fillText(state.battleFish.emoji, trackX + 10, fishY + 30);'''
new_battle = '''        drawFish(ctx, state.battleFish, trackX + 25, fishY + 20, 40);'''
content = re.sub(r"        ctx\.font = '30px serif';\s*if \(state\.battleFish\.type === 'image'\) ctx\.fillText\(.*?, trackX \+ 10, fishY \+ 30\);\s*else ctx\.fillText\(state\.battleFish\.emoji, trackX \+ 10, fishY \+ 30\);", new_battle, content)

# 3. THE CATCH
old_catch = '''        const f = state.battleFish || caughtFish;
        ctx.font = '80px serif';
        ctx.textAlign = 'center';
        if (f && f.type === 'image') ctx.fillText('??', charX, fishY);
        else if (f) ctx.fillText(f.emoji, charX, fishY);
        ctx.textAlign = 'start';'''
new_catch = '''        const f = state.battleFish || caughtFish;
        if (f) drawFish(ctx, f, charX, fishY - 20, 100, -1);'''
content = re.sub(r"        const f = state\.battleFish \|\| caughtFish;\s*ctx\.font = '80px serif';\s*ctx\.textAlign = 'center';\s*if \(f && f\.type === 'image'\) ctx\.fillText\(.*?, charX, fishY\);\s*else if \(f\) ctx\.fillText\(f\.emoji, charX, fishY\);\s*ctx\.textAlign = 'start';", new_catch, content)

# 4. CAUGHT UI (DOM)
old_caught_dom = '''<div style={{ fontSize: '6rem', margin: '20px', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))' }}>{caughtFish.type === 'image' ? <img src={caughtFish.src} style={{ width: '120px' }} /> : caughtFish.emoji}</div>'''
new_caught_dom = '''<div style={{
                                width: '120px', height: '120px', margin: '20px auto',
                                filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
                                backgroundImage: url(/assets/fishing/fishing_.png),
                                backgroundSize: '400% 400%',
                                backgroundPosition: ${caughtFish.col * 33.3333}% %,
                                transform: 'scaleX(-1)'
                            }}></div>'''
content = content.replace(old_caught_dom, new_caught_dom)

# 5. FISHDEX
old_fishdex = '''<div style={{ fontSize: '3rem' }}>{unlocked ? fish.emoji : '?'}</div>'''
new_fishdex = '''<div style={{ width: '60px', height: '60px', filter: unlocked ? 'drop-shadow(0 0 5px cyan)' : 'brightness(0)', opacity: unlocked ? 1 : 0.5, backgroundImage: url(/assets/fishing/fishing_.png), backgroundSize: '400% 400%', backgroundPosition: ${fish.col * 33.3333}% %, transform: 'scaleX(-1)' }}></div>'''
content = content.replace(old_fishdex, new_fishdex)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
