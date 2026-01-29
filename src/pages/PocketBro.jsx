import { useGamification } from '../context/GamificationContext';
import { usePocketBro, POCKET_BRO_STAGES } from '../context/PocketBroContext';


const TASKS = [
    { id: 'feed', icon: '🍗', label: 'FEED' },
    { id: 'play', icon: '🎾', label: 'PLAY' },
    { id: 'sleep', icon: '💤', label: 'SLEEP' },
];

const PocketBro = () => {
    const { stats, feed, play, sleep, getMood } = usePocketBro();
    const { shopState } = useGamification() || {};
    const equippedSkin = shopState?.equipped?.pocketbro || null;

    // Skin Styles
    const getSkinStyles = () => {
        if (equippedSkin === 'pb_gold') return { filter: 'drop-shadow(0 0 15px gold) sepia(100%) saturate(300%) hue-rotate(5deg)' };
        if (equippedSkin === 'pb_cyber') return { filter: 'drop-shadow(0 0 10px cyan) hue-rotate(180deg) contrast(150%)', fontFamily: 'monospace' };
        if (equippedSkin === 'pb_party') return { transform: 'scale(1.1) rotate(5deg)' }; // Bouncy
        return { filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.2))' };
    };

    const [message, setMessage] = useState("I'm here! 🥚");
    const [bounce, setBounce] = useState(false);

    // Evolution Progress Logic
    const currentStage = POCKET_BRO_STAGES[stats.stage];
    const stageKeys = Object.keys(POCKET_BRO_STAGES);
    const currentIndex = stageKeys.indexOf(stats.stage);
    const nextStageKey = stageKeys[currentIndex + 1];
    const nextStage = nextStageKey ? POCKET_BRO_STAGES[nextStageKey] : null;

    let progress = 100;
    let nextThreshold = currentStage.threshold; // Default if maxed

    if (nextStage) {
        const range = nextStage.threshold - currentStage.threshold;
        const currentInStage = stats.xp - currentStage.threshold;
        progress = Math.min((currentInStage / range) * 100, 100);
        nextThreshold = nextStage.threshold;
    }

    const handleAction = (task) => {
        triggerBounce();

        if (task.id === 'sleep') {
            sleep();
            setMessage(stats.isSleeping ? "Good morning! ☀️" : "Goodnight! 🌙");
            return;
        }

        if (stats.isSleeping) {
            setMessage("Zzz... Wake me up!");
            return;
        }

        if (task.id === 'feed') {
            feed();
            setMessage("Yum! 😋");
        } else if (task.id === 'play') {
            play();
            setMessage("Wheee! 🎉");
        }
    };

    const triggerBounce = () => {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
    };

    return (
        <div className="page-enter" style={{
            background: 'radial-gradient(circle at center, #2e003e 0%, #000000 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '100px',
            fontFamily: '"Press Start 2P", monospace'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                {/* Title Badge */}
                <div style={{
                    background: 'var(--neon-blue)', color: 'black',
                    padding: '5px 20px', borderRadius: '20px',
                    marginBottom: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                    boxShadow: '0 0 20px var(--neon-blue)'
                }}>
                    POCKET BRO v2.0
                </div>

                {/* THE DEVICE */}
                <div style={{
                    width: '320px',
                    background: 'linear-gradient(145deg, #222, #111)',
                    borderRadius: '50px 50px 50px 50px',
                    padding: '30px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
                    border: '4px solid #333',
                    position: 'relative'
                }}>

                    {/* Screen */}
                    <div style={{
                        height: '320px',
                        background: '#9ea7a0',
                        backgroundImage: 'radial-gradient(#8b968d 15%, transparent 16%), radial-gradient(#8b968d 15%, transparent 16%)',
                        backgroundSize: '10px 10px',
                        borderRadius: '20px',
                        border: '8px solid #000',
                        boxShadow: 'inset 5px 5px 15px rgba(0,0,0,0.4)',
                        padding: '20px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden'
                    }}>

                        {/* Status Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#333' }}>
                            <span>STAGE: {stats.stage}</span>
                            <span>XP: {Math.floor(stats.xp)}</span>
                        </div>

                        {/* Bars */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                <div style={{ width: `${stats.happy}%`, height: '100%', background: '#ff0055', borderRadius: '4px' }} />
                            </div>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                <div style={{ width: `${stats.hunger}%`, height: '100%', background: '#ffaa00', borderRadius: '4px' }} />
                            </div>
                        </div>

                        {/* Character Display */}
                        <div style={{
                            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* Skin Overlay - Party Hat */}
                            {equippedSkin === 'pb_party' && <div style={{ position: 'absolute', top: -40, fontSize: '3rem', zIndex: 10, animation: 'float 1s infinite' }}>🥳</div>}

                            <div style={{
                                fontSize: '6rem',
                                transform: bounce ? 'scale(1.2)' : 'scale(1)',
                                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                animation: stats.isSleeping ? 'breathe 3s infinite' : (bounce ? 'none' : 'idle 1.5s infinite'),
                                ...getSkinStyles()
                            }}>
                                {stats.isSleeping ? '💤' : getMood()}
                            </div>
                        </div>

                        {/* Evolution Bar */}
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#555', marginBottom: '2px' }}>
                                <span>EVOLUTION</span>
                                <span>{nextStage ? `${Math.floor(progress)}%` : 'MAX'}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px' }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #00C6FF, #0072FF)',
                                    borderRadius: '3px',
                                    transition: 'width 0.5s'
                                }}></div>
                            </div>
                        </div>

                        {/* Message Text */}
                        <div style={{ textAlign: 'center', marginTop: '10px', minHeight: '1.2em', color: '#333', fontSize: '0.7rem' }}>
                            {message}
                        </div>

                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '20px',
                        marginTop: '30px'
                    }}>
                        {TASKS.map(task => (
                            <button
                                key={task.id}
                                onClick={() => handleAction(task)}
                                disabled={stats.isSleeping && task.id !== 'sleep'}
                                style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: stats.isSleeping && task.id !== 'sleep' ? '#333' : '#e0e0e0',
                                    boxShadow: stats.isSleeping && task.id !== 'sleep' ? 'none' : '0 6px 0 #999',
                                    fontSize: '1.8rem',
                                    cursor: 'pointer',
                                    opacity: stats.isSleeping && task.id !== 'sleep' ? 0.5 : 1,
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.1s, box-shadow 0.1s'
                                }}
                                onMouseDown={(e) => {
                                    if (stats.isSleeping && task.id !== 'sleep') return;
                                    e.currentTarget.style.transform = 'translateY(6px)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onMouseUp={(e) => {
                                    if (stats.isSleeping && task.id !== 'sleep') return;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 0 #999';
                                }}
                            >
                                {task.icon}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes idle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default PocketBro;
