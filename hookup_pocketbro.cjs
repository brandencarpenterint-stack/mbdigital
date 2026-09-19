const fs = require('fs');
let code = fs.readFileSync('src/pages/Inventory.jsx', 'utf8');

// 1. Add imports
code = code.replace("import { useGamification } from '../context/GamificationContext';", "import { useGamification } from '../context/GamificationContext';\nimport { usePocketBro } from '../context/PocketBroContext';\nimport { triggerConfetti } from '../utils/confetti';");

// 2. Add state and hooks
const hooksStr = `    const { shopState, userProfile, removeInventoryItem } = useGamification();
    const pocketBro = usePocketBro();
    const { playBeep, playClick, playCoin } = useRetroSound();
    
    const [selectedItem, setSelectedItem] = useState(null);`;

code = code.replace(/    const { shopState, userProfile } = useGamification\(\);\n    const { playBeep, playClick } = useRetroSound\(\);/, hooksStr);

// 3. Add onClick to TiltCard
code = code.replace(`className="bento-card" style={{ cursor: 'pointer'`, `onClick={() => { setSelectedItem(item); playClick(); }}\n                                className="bento-card" style={{ cursor: 'pointer'`);

// 4. Add the Modal render at the very end (before the last closing div)
const modalCode = `
            {/* ITEM MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 2000,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setSelectedItem(null)}>
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel"
                            style={{
                                background: 'rgba(20,20,30,0.95)', border: '2px solid var(--neon-blue)',
                                padding: '30px', borderRadius: '20px', textAlign: 'center',
                                width: '90%', maxWidth: '400px',
                                boxShadow: '0 0 50px rgba(0, 255, 204, 0.2)'
                            }}
                        >
                            <h2 style={{ color: 'var(--neon-blue)', marginTop: 0 }}>
                                {selectedItem.metadata?.name || selectedItem.baseId}
                            </h2>
                            
                            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
                                {selectedItem.type === 'fish' ? (
                                    selectedItem.metadata?.sheet ? (
                                        <div style={{
                                            width: '128px', height: '128px',
                                            backgroundImage: \`url(\${FISH_SHEETS[selectedItem.metadata.sheet]})\`,
                                            backgroundSize: '400% 400%',
                                            backgroundPosition: \`\${(selectedItem.metadata.col || 0) * 33.33}% \${(selectedItem.metadata.row || 0) * 33.33}%\`,
                                            imageRendering: 'pixelated'
                                        }} />
                                    ) : (
                                        <div style={{ fontSize: '5rem' }}>{selectedItem.metadata?.emoji || '❓'}</div>
                                    )
                                ) : selectedItem.type === 'sticker' ? (
                                    <StickerSprite sticker={selectedItem.baseId} size={128} />
                                ) : (
                                    <div style={{ fontSize: '5rem' }}>{selectedItem.metadata?.emoji || '📦'}</div>
                                )}
                            </div>

                            {selectedItem.type === 'fish' && (
                                <p style={{ color: '#aaa', marginBottom: '20px' }}>
                                    Weight: <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedItem.metadata?.weight} lbs</span>
                                </p>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedItem.type === 'fish' && pocketBro && (
                                    <SquishyButton 
                                        onClick={() => {
                                            // FEED LOGIC
                                            if (removeInventoryItem) {
                                                removeInventoryItem(selectedItem.baseId, selectedItem.id);
                                            }
                                            pocketBro.feed(Math.max(10, selectedItem.metadata?.weight || 10));
                                            pocketBro.triggerEffect('heart');
                                            pocketBro.debugUpdate({ xp: (pocketBro.stats?.xp || 0) + Math.floor(selectedItem.metadata?.weight || 10) * 10 });
                                            
                                            playCoin();
                                            triggerConfetti();
                                            setSelectedItem(null);
                                        }}
                                        style={{ background: '#ff0055', color: 'white', fontWeight: 'bold' }}
                                    >
                                        🍗 FEED TO POCKET BRO
                                    </SquishyButton>
                                )}
                                
                                <SquishyButton 
                                    onClick={() => setSelectedItem(null)}
                                    style={{ background: '#333', color: 'white' }}
                                >
                                    CLOSE
                                </SquishyButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};`;

code = code.replace(`        </div>\n    );\n};`, modalCode);

fs.writeFileSync('src/pages/Inventory.jsx', code, 'utf8');
console.log('Hooked up PocketBro to Inventory!');
