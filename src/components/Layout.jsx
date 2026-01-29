// ... imports ...
import DailyQuestModal from './DailyQuestModal'; // Import the new modal

const Layout = () => {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);
    const [showDaily, setShowDaily] = useState(false);
    const [showQuests, setShowQuests] = useState(false); // New State

    // ... coins state ...
    const { unlockedAchievements, dailyState } = useGamification() || { unlockedAchievements: [], dailyState: null }; // Get dailyState
    // ...

    // Red Dot Logic for Quests
    const hasUnclaimedQuests = dailyState?.quests?.some(q => q.progress >= q.target && !q.claimed);
    const hasUncheckedDaily = dailyState?.lastCheckIn !== new Date().toISOString().split('T')[0];
    const showQuestDot = hasUnclaimedQuests || hasUncheckedDaily;

    // ... (rest of vars)

    return (
        <div className="layout-container" style={{ paddingBottom: '120px' }}>
            {!isFishingGame && (
                <header className="glass-panel main-header" style={{
                    // ... existing styles ...
                }}>
                    <div className="logo-section">
                        {/* ... existing logo ... */}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* QUESTS BUTTON */}
                        <button
                            onClick={() => setShowQuests(true)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', padding: '0', position: 'relative'
                            }}
                        >
                            📜
                            {showQuestDot && (
                                <div style={{
                                    position: 'absolute', top: -2, right: -2,
                                    width: '10px', height: '10px', background: '#ff0055',
                                    borderRadius: '50%', boxShadow: '0 0 5px #ff0055',
                                    animation: 'pulse 1s infinite'
                                }} />
                            )}
                        </button>

                        <div style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid var(--neon-gold)',
                            padding: '5px 12px', borderRadius: '20px',
                            fontSize: '0.9rem', color: 'var(--neon-gold)', fontWeight: 'bold'
                        }}>
                            🪙 {coins.toLocaleString()}
                        </div>
                        <button
                            onClick={() => setShowDaily(true)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', padding: '0',
                                animation: 'wiggle 2s infinite ease-in-out'
                            }}
                        >
                            🎁
                        </button>
                        <button
                            onClick={toggleSound}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                    </div>
                </header>
            )}

            <main className="main-content" style={{ paddingTop: '90px', minHeight: '100vh' }}>
                <Outlet />
            </main>

            {/* ... Dock ... */}

            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
            {showDaily && <DailyStash onClose={() => setShowDaily(false)} />}
            {showQuests && <DailyQuestModal onClose={() => setShowQuests(false)} />} {/* New Modal */}
            <SquadSelector />
        </div>
    );
};
export default Layout;
