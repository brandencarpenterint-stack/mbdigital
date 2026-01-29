import React, { useState } from 'react';
import { usePocketBro } from '../context/PocketBroContext';
import { useInventory } from '../context/InventoryContext';

const TASKS = [
    { id: 'feed', icon: '🍗', label: 'FEED' },
    { id: 'play', icon: '🎾', label: 'PLAY' },
    { id: 'sleep', icon: '💤', label: 'SLEEP' },
];

const PocketBro = () => {
    const { stats, feed, play, sleep, getMood } = usePocketBro();
    const { activeSkin } = useInventory();
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
                background: 'linear-gradient(135deg, rgba(200, 100, 255, 0.6) 0%, rgba(150, 50, 255, 0.4) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Egg shapeish
                padding: '40px 20px 80px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2), inset 0 0 40px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.8)',
                border: '4px solid rgba(255,255,255,0.3)',
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
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                    border: '8px solid #444',
                    borderRadius: '20px',
                    boxShadow: 'inset 5px 5px 10px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    fontFamily: '"Press Start 2P", monospace',
                    imageRendering: 'pixelated'
                }}>
                    {/* Status Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#333', width: '100%', marginBottom: '10px' }}>
                        <span>Lvl: {stats.stage}</span>
                        <span>XP: {stats.xp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#333', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>❤️</span>
                            <div style={{ width: '50px', height: '10px', background: '#888', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.happy}%`, height: '100%', background: '#ff0055' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '50px', height: '10px', background: '#888', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.hunger}%`, height: '100%', background: 'orange' }} />
                            </div>
                            <span>🍔</span>
                        </div>
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
                            transform: bounce ? 'translateY(-20px) scale(1.1)' : 'translateY(0) scale(1)',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.2))',
                            animation: bounce ? 'none' : 'idle 3s infinite ease-in-out'
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
                        <div key={task.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            <button
                                onClick={() => handleAction(task)}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: stats.isSleeping && task.id !== 'sleep' ? '#888' : '#FFEB3B',
                                    color: '#333',
                                    fontSize: '1.5rem',
                                    boxShadow: '0 4px 0 #FBC02D',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}
                                onMouseDown={(e) => e.target.style.transform = 'translateY(4px)'}
                                onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {task.icon}
                            </button>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>{task.label}</span>
                        </div>
                    ))}
                </div>

                {/* Decoration: Brand Logo */}
                <div style={{ position: 'absolute', bottom: '20px', color: '#ccc', fontWeight: 'bold' }}>
                    POCKET BRO™
                </div>

                <style>{`
                    @keyframes idle {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `}</style>
            </div>
        </div>
    );
};


export default PocketBro;
