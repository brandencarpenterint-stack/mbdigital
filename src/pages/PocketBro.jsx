import React, { useState } from 'react';
import { usePocketBro } from '../context/PocketBroContext';

const TASKS = [
    { id: 'feed', icon: '🍗', label: 'FEED' },
    { id: 'play', icon: '🎾', label: 'PLAY' },
    { id: 'sleep', icon: '💤', label: 'SLEEP' },
];

const PocketBro = () => {
    const { stats, feed, play, sleep, getMood } = usePocketBro();
    const [message, setMessage] = useState("I'm here! 🥚");
    const [bounce, setBounce] = useState(false);

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
        <div style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Press Start 2P", monospace'
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#333', width: '100%', marginBottom: '10px' }}>
                        <span>Lvl: {stats.stage}</span>
                        <span>XP: {stats.xp}</span>
                    </div>
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
