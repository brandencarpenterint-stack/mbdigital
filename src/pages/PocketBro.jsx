import React, { useState, useEffect, useRef } from 'react';

const TASKS = [
    { id: 'feed', icon: '🍗', label: 'FEED', cost: 0, effect: { hunger: 30, energy: -5 } },
    { id: 'play', icon: '🎾', label: 'PLAY', cost: 0, effect: { happy: 20, energy: -15, hunger: -10 } },
    { id: 'sleep', icon: '💤', label: 'SLEEP', cost: 0, effect: { energy: 100 } }, // Instant sleep for MVP, or toggle state
    { id: 'clean', icon: '🧹', label: 'CLEAN', cost: 0, effect: { happy: 10 } },
];

const PocketBro = () => {
    // Stats: 0 to 100
    const [stats, setStats] = useState({
        hunger: 80, // High is good (Full)
        happy: 80, // High is good
        energy: 80, // High is good
        age: 0, // Days
        isSleeping: false,
        lastInteraction: Date.now()
    });

    const [message, setMessage] = useState("I'm hatched! 🥚");
    const [poops, setPoops] = useState([]); // Array of positions or just count

    // Animation State
    const [bounce, setBounce] = useState(false);

    // Load Game
    useEffect(() => {
        const saved = localStorage.getItem('pocketBroState');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Calculate Decay based on time away
            const now = Date.now();
            const hoursPassed = (now - parsed.lastInteraction) / (1000 * 60 * 60);

            // Decay formulas (approx 100 points lost in 24 hours = ~4 pts/hr)
            const decay = Math.floor(hoursPassed * 4);

            setStats({
                ...parsed,
                hunger: Math.max(0, parsed.hunger - decay),
                happy: Math.max(0, parsed.happy - decay),
                // Energy recovers if sleeping, decays if not (simplified: decay)
                energy: Math.max(0, parsed.energy - decay),
                isSleeping: false // Wake up upon return
            });
            setMessage(`You were gone for ${hoursPassed.toFixed(1)} hours!`);
        }
    }, []);

    // Game Loop (Decay & Age)
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const newStats = {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - (prev.isSleeping ? 0.05 : 0.2)),
                    happy: Math.max(0, prev.happy - (prev.isSleeping ? 0.05 : 0.1)),
                    energy: prev.isSleeping ? Math.min(100, prev.energy + 0.5) : Math.max(0, prev.energy - 0.1),
                    age: prev.age + 0.0001 // Very slow aging
                };

                // Random Poop Event (if eaten recently and not sleeping)
                if (!prev.isSleeping && Math.random() < 0.005) {
                    setPoops(curr => [...curr, { id: Date.now(), x: Math.random() * 80 + 10 }]);
                }

                return newStats;
            });
        }, 1000); // Run every second

        return () => clearInterval(interval);
    }, []);

    // Auto-Save
    useEffect(() => {
        localStorage.setItem('pocketBroState', JSON.stringify({ ...stats, lastInteraction: Date.now() }));
    }, [stats]);

    const handleAction = (task) => {
        if (stats.isSleeping && task.id !== 'sleep') {
            setMessage("Zzz... Wake me up first!");
            return;
        }

        if (task.id === 'sleep') {
            setStats(prev => ({ ...prev, isSleeping: !prev.isSleeping }));
            setMessage(stats.isSleeping ? "Good morning! ☀️" : "Goodnight! 🌙");
            return;
        }

        if (task.id === 'clean') {
            setPoops([]);
            setMessage("All clean! ✨");
            setStats(prev => ({ ...prev, happy: Math.min(100, prev.happy + 10) }));
            triggerBounce();
            return;
        }

        setStats(prev => ({
            ...prev,
            hunger: Math.min(100, Math.max(0, prev.hunger + (task.effect.hunger || 0))),
            happy: Math.min(100, Math.max(0, prev.happy + (task.effect.happy || 0))),
            energy: Math.min(100, Math.max(0, prev.energy + (task.effect.energy || 0))),
        }));

        setMessage(task.id === 'feed' ? "Yum! 😋" : "Wheee! 🎉");
        triggerBounce();
    };

    const triggerBounce = () => {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
    };

    // Derived State for Visuals
    const getMood = () => {
        if (stats.hunger < 20) return '😫'; // Starving
        if (stats.happy < 20) return '😢'; // Sad
        if (stats.energy < 20) return '😴'; // Tired
        if (poops.length > 2) return '🤢'; // Gross
        return '😃'; // Happy
    };

    return (
        <div style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Press Start 2P", monospace' // If available, otherwise generic monospace
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: '#f8f8f8',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Egg shapeish
                padding: '40px 20px 80px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2), inset 0 -10px 20px rgba(0,0,0,0.1)',
                border: '10px solid #eee',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Screen */}
                <div style={{
                    width: '240px',
                    height: '240px',
                    background: '#9ea7a0', // LCD Greenish Grey
                    border: '8px solid #555',
                    borderRadius: '20px',
                    boxShadow: 'inset 5px 5px 10px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px'
                }}>
                    {/* Status Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#333' }}>
                        <span>❤️ {Math.round(stats.happy)}</span>
                        <span>🍔 {Math.round(stats.hunger)}</span>
                    </div>

                    {/* Main Character Area */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {/* The Pet */}
                        <div style={{
                            fontSize: '5rem',
                            transform: bounce ? 'translateY(-20px)' : 'translateY(0)',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.2))'
                        }}>
                            {stats.isSleeping ? '💤' : getMood()}
                        </div>

                        {/* Poops */}
                        {poops.map((poop, i) => (
                            <div key={poop.id} style={{
                                position: 'absolute',
                                fontSize: '1.5rem',
                                bottom: '20px',
                                left: `${poop.x}%`
                            }}>
                                💩
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#333', marginTop: '10px', height: '1.2em' }}>
                        {message}
                    </div>
                </div>

                {/* Controls */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '40px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {TASKS.map(task => (
                        <button
                            key={task.id}
                            onClick={() => handleAction(task)}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: 'none',
                                background: stats.isSleeping && task.id !== 'sleep' ? '#ccc' : '#ff0055',
                                color: 'white',
                                fontSize: '1.5rem',
                                boxShadow: '0 5px 0 #900030', // Deep red shadow for clicky feel
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                            onMouseDown={(e) => e.target.style.transform = 'translateY(5px)'}
                            onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {task.icon}
                        </button>
                    ))}
                </div>

                {/* Decoration: Brand Logo */}
                <div style={{ position: 'absolute', bottom: '20px', color: '#ccc', fontWeight: 'bold' }}>
                    POCKET BRO™
                </div>
            </div>
        </div>
    );
};

export default PocketBro;
