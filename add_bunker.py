filepath = 'src/pages/Home.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    <Link to="/pocketbro" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👾</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>POCKET BRO</h3>
                            </div>
                        </TiltCard>
                    </Link>"""

replacement = """                    <Link to="/bunker" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🚨</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>THE BUNKER</h3>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px' }}>MULTIPLAYER LOBBY</div>
                            </div>
                        </TiltCard>
                    </Link>
                    
                    <Link to="/pocketbro" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #333 0%, #111 100%)', border: '1px solid #444', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👾</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>POCKET BRO</h3>
                            </div>
                        </TiltCard>
                    </Link>"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Bunker link to Home")
