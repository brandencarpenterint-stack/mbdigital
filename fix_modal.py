filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                {caughtFish.type === 'image' ? (
                                    <div style={{ fontSize: '80px', margin: '20px auto' }}>??</div>
                                ) : (
                                    <div style={{
                                        width: '120px', height: '120px', margin: '20px auto',
                                        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
                                        backgroundImage: `url(/assets/fishing/fishing_${caughtFish.sheet}.png)`,
                                        backgroundSize: '400% 400%',
                                        backgroundPosition: `${caughtFish.col * 33.3333}% ${caughtFish.row * 33.3333}%`,
                                        transform: 'scaleX(-1)'
                                    }}></div>
                                )}"""

replacement = """                                {caughtFish.type === 'image' ? (
                                    <div style={{ fontSize: '80px', margin: '20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))', transform: 'scaleX(-1)' }}>??</div>
                                ) : (
                                    <div style={{ fontSize: '80px', margin: '20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))', transform: 'scaleX(-1)' }}>{caughtFish.emoji || '?'}</div>
                                )}"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
