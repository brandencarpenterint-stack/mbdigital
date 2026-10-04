import re

# 1. Update BroCard.jsx
filepath = 'src/pages/BroCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                {/* THE CARD */}
                <div
                    ref={cardRef}"""

replacement = """
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* THE CARD */}
                <div
                    ref={cardRef}"""

target2 = """                </div>
            </motion.div>
        </div>
    );
};"""

replacement2 = """                </div>
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
        </div>
    );
};"""

content = content.replace(target, replacement)
content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("BroCard updated")
