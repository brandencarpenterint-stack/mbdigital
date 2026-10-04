filepath = 'src/pages/BroCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the JSX structure
# Let's find the header IDENTITY // ELITE
# And wrap the motion.div and referral panel

target = """            <h1 style={{ color: 'white', marginBottom: '40px', fontFamily: '"Orbitron", sans-serif', letterSpacing: '4px', opacity: 0.8 }}>
                IDENTITY // ELITE
            </h1>

            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    cursor: 'grab'
                }}
            >

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* THE CARD */}"""

replacement = """            <h1 style={{ color: 'white', marginBottom: '40px', fontFamily: '"Orbitron", sans-serif', letterSpacing: '4px', opacity: 0.8 }}>
                IDENTITY // ELITE
            </h1>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    cursor: 'grab'
                }}
            >
                {/* THE CARD */}"""

content = content.replace(target, replacement)


target2 = """            </motion.div>

            {/* REFERRAL PANEL */}"""

replacement2 = """            </motion.div>

            {/* REFERRAL PANEL */}"""

# Wait, where was the original closing tag?
# Let's just restore the file from git and do it properly.

import os
os.system('git checkout src/pages/BroCard.jsx')

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    cursor: 'grab'
                }}
            >
                {/* THE CARD */}"""

replacement = """            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    cursor: 'grab'
                }}
            >
                {/* THE CARD */}"""

content = content.replace(target, replacement)

target2 = """                    </div>

                </div>
            </motion.div>

            <button"""

replacement2 = """                    </div>

                </div>
            </motion.div>

            {/* REFERRAL PANEL */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                    background: 'rgba(20,20,30,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 204, 0.3)',
                    borderRadius: '20px',
                    padding: '30px',
                    width: '350px',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <h2 style={{ margin: 0, color: '#00ffcc', fontFamily: '"Press Start 2P"', fontSize: '1rem', lineHeight: '1.5' }}>
                    INVITE BROS
                </h2>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>
                    Invite friends to your squad! When they join using your link, you BOTH get <strong style={{color:'gold'}}>5,000 Coins</strong>!
                </p>
                
                <div style={{ background: '#000', padding: '15px', borderRadius: '10px', border: '1px dashed #555', textAlign: 'center', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {window.location.origin}/?invite={userProfile.code}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/?invite=${userProfile.code}`);
                            alert('Link Copied! Send it to your bros.');
                        }}
                        style={{
                            flex: 1, padding: '15px', background: 'var(--neon-blue)', color: 'black',
                            border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(0,255,204,0.4)'
                        }}
                    >
                        COPY LINK
                    </button>
                    <button
                        onClick={() => {
                            const text = encodeURIComponent(`Join my squad on Merchboy Arcade! We both get 5,000 Coins! 💰👾`);
                            const url = encodeURIComponent(`${window.location.origin}/?invite=${userProfile.code}`);
                            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                        }}
                        style={{
                            flex: 1, padding: '15px', background: '#1DA1F2', color: 'white',
                            border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        SHARE ON X
                    </button>
                </div>
            </motion.div>
            </div>

            <button"""

content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
