filepath = 'src/components/Layout.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# 1. Replace the entire top <header> block with floating elements
header_pattern = re.compile(r'<header className="glass-panel main-header".*?</header>', re.DOTALL)

floating_top = """{/* FLOATING TOP BAR (Clean & Minimal) */}
                <div style={{
                    position: 'fixed', top: '20px', left: '20px', right: '20px', zIndex: 1000,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    pointerEvents: 'none' // Let clicks pass through empty space
                }}>
                    {/* Left: Logo & Faction */}
                    <div style={{ pointerEvents: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href="https://merchboy.shop" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ width: '25px', height: '25px', animation: 'float 3s ease-in-out infinite' }}>
                                <img src={FACES[faceIndex]} alt="Face" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>MBDIGITAL</span>
                        </a>
                        
                        {userProfile?.squad && (
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {userProfile.squad}
                            </div>
                        )}
                    </div>

                    {/* Right: Stats & Settings */}
                    <div style={{ pointerEvents: 'auto', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {/* Daily Quests Toggle */}
                        {session?.user && (
                            <button onClick={() => setShowQuests(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', position: 'relative' }}>
                                🎯
                                {showQuestDot && <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ff0055', borderRadius: '50%', boxShadow: '0 0 5px #ff0055' }} />}
                            </button>
                        )}

                        {/* Streak */}
                        {dailyState?.streak > 0 && (
                            <div style={{ fontSize: '0.9rem', color: dailyState.streak >= 15 ? '#00f260' : dailyState.streak >= 7 ? 'gold' : dailyState.streak >= 3 ? 'silver' : '#cd7f32', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                🔥 {dailyState.streak}
                            </div>
                        )}

                        {/* Coins */}
                        <div style={{ fontSize: '0.9rem', color: 'var(--neon-gold)', fontWeight: 'bold', marginLeft: '5px' }}>
                            🪙 {coins.toLocaleString()}
                        </div>

                        {/* Stash */}
                        <button onClick={() => setShowDaily(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', opacity: isDailyReady ? 1 : 0.6, filter: isDailyReady ? 'drop-shadow(0 0 5px gold)' : 'grayscale(100%)', animation: isDailyReady ? 'bounce 1s infinite' : 'none', marginLeft: '5px' }}>
                            🎁
                        </button>

                        {/* Sound */}
                        <button onClick={toggleSound} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', marginLeft: '5px' }}>
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                        
                        {/* Admin Void (Guest Mode) */}
                        {!session?.user && (
                            <Link to="/void" style={{ background: '#ff0055', color: 'white', padding: '3px 10px', borderRadius: '15px', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '5px' }}>
                                GUEST
                            </Link>
                        )}
                    </div>
                </div>"""

content = re.sub(header_pattern, floating_top, content)

# 2. Update the Dock to include FACTIONS instead of HUSTLE MODE (move hustle to profile/home or just keep dock as 5 items)
# Wait, replacing Hustle Mode with Factions
dock_pattern = re.compile(r'\{/\* 2\. HUSTLE MODE \(Productivity\) \*/\}.*?</Link>', re.DOTALL)
faction_dock = """{/* 2. FACTIONS */}
                        <Link to="/factions" className="dock-icon" style={{ opacity: location.pathname === '/factions' ? 1 : 0.5 }}>
                            ⚔️
                        </Link>"""

content = re.sub(dock_pattern, faction_dock, content)

# Also fix the top padding of main-content from 90px to 80px so it's not wasting space
content = content.replace("paddingTop: '90px'", "paddingTop: '80px'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Layout.jsx with clean unified floating nav")
