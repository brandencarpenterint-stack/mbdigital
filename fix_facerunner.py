filepath = 'src/games/FaceRunner/FaceRunner.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add SKINS definition
target_skins = """    // Assets
    const faceImgs = useRef({});"""

replacement_skins = """    // Assets
    const SKINS = [
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png' },
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png' },
    ];
    const faceImgs = useRef({});"""

content = content.replace(target_skins, replacement_skins)

# Update Preloader to preload all SKINS
target_preload = """        const faces = ['face_money', 'face_bear', 'face_bunny', 'face_default'];
        faces.forEach(f => {
            const img = new Image();
            img.src = `/assets/skins/${f}.png`;
            faceImgs.current[f] = img;
        });"""

replacement_preload = """        SKINS.forEach(skin => {
            const img = new Image();
            img.src = skin.src;
            faceImgs.current[skin.id] = img;
        });"""

content = content.replace(target_preload, replacement_preload)

# Set initial face
target_state = "const [selectedFace, setSelectedFace] = useState('face_money');"
replacement_state = "const [selectedFace, setSelectedFace] = useState('face_default');"
content = content.replace(target_state, replacement_state)

# Replace the START menu
target_menu = """            {gameState === 'START' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '20px', border: '2px solid cyan' }}>
                    <h1 style={{ color: 'cyan', fontSize: '3rem', margin: 0 }}>FACE WARP</h1>
                    <p style={{ color: 'white', marginBottom: '20px' }}>Avoid the Void.</p>
                    <SquishyButton onClick={startGame} style={{ background: 'cyan', color: 'black', fontSize: '1.5rem', padding: '15px 40px' }}>RUN</SquishyButton>
                </div>
            )}"""

replacement_menu = """            {gameState === 'START' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.9)', padding: '40px', borderRadius: '20px', border: '2px solid cyan', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ color: 'cyan', fontSize: '3rem', margin: 0, fontFamily: '"Orbitron"' }}>FACE WARP</h1>
                    <p style={{ color: 'white', marginBottom: '20px', fontFamily: 'monospace' }}>Avoid the Void.</p>
                    
                    {/* SKIN SELECTOR */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '300px' }}>
                        {SKINS.map(skin => (
                            <button 
                                key={skin.id}
                                onClick={() => setSelectedFace(skin.id)}
                                style={{
                                    background: selectedFace === skin.id ? 'cyan' : '#222',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '5px',
                                    cursor: 'pointer',
                                    transform: selectedFace === skin.id ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <img src={skin.src} alt={skin.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            </button>
                        ))}
                    </div>

                    <SquishyButton onClick={startGame} style={{ background: 'cyan', color: 'black', fontSize: '1.5rem', padding: '15px 40px', fontWeight: 'bold' }}>RUN</SquishyButton>
                </div>
            )}"""

content = content.replace(target_menu, replacement_menu)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FaceRunner")
