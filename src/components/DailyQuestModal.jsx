import React from 'react';
import SquishyButton from './SquishyButton'; // Assuming we have this, or I'll just use a button
import { useGamification } from '../context/GamificationContext';

const DailyQuestModal = ({ onClose }) => {
    const { dailyState, claimDailyLogin, claimQuest } = useGamification() || {};

    if (!dailyState) return null;

    const { lastCheckIn, streak, quests } = dailyState;
    const today = new Date().toISOString().split('T')[0];
    const canCheckIn = lastCheckIn !== today;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', zIndex: 6000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '500px',
                padding: '30px',
                position: 'relative',
                border: '1px solid var(--neon-blue)',
                boxShadow: '0 0 40px rgba(0, 243, 255, 0.2)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: 'none', border: 'none', color: '#fff',
                        fontSize: '1.5rem', cursor: 'pointer',
                        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                    }}
                >
                    ✕
                </button>

                <h2 style={{
                    marginTop: 0,
                    color: 'var(--neon-blue)',
                    textAlign: 'center',
                    fontSize: '2rem',
                    textShadow: '0 0 10px rgba(0,243,255,0.5)'
                }}>
                    DAILY PROTOCOLS
                </h2>

                {/* CHECK-IN SECTION */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '15px', padding: '20px',
                    marginBottom: '20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', letterSpacing: '1px' }}>CURRENT STREAK</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
                            {streak} DAYS <span style={{ fontSize: '1.2rem' }}>🔥</span>
                        </div>
                    </div>

                    <button
                        onClick={claimDailyLogin}
                        disabled={!canCheckIn}
                        className="squishy-btn"
                        style={{
                            background: canCheckIn ? 'var(--neon-green)' : '#333',
                            color: canCheckIn ? '#000' : '#888',
                            border: 'none', padding: '10px 20px', borderRadius: '10px',
                            fontWeight: 'bold', fontSize: '1rem',
                            cursor: canCheckIn ? 'pointer' : 'default',
                            boxShadow: canCheckIn ? '0 0 15px rgba(0, 255, 170, 0.4)' : 'none'
                        }}
                    >
                        {canCheckIn ? 'CHECK IN (+100 🪙)' : 'CHECKED IN ✅'}
                    </button>
                </div>

                {/* QUESTS LIST */}
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '15px' }}>ACTIVE MISSIONS</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                    {quests.map(q => {
                        const isDone = q.progress >= q.target;
                        return (
                            <div key={q.id} style={{
                                background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px',
                                border: q.claimed ? '1px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)',
                                opacity: q.claimed ? 0.6 : 1,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#eee', marginBottom: '5px' }}>{q.desc}</div>

                                    {/* Progress Bar */}
                                    <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', marginBottom: '5px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min((q.progress / q.target) * 100, 100)}%`,
                                            height: '100%',
                                            background: isDone ? 'var(--neon-green)' : 'var(--neon-blue)',
                                            transition: 'width 0.5s'
                                        }}></div>
                                    </div>

                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                        {Math.min(q.progress, q.target)} / {q.target} • Reward: <span style={{ color: 'gold' }}>{q.reward} 🪙</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => claimQuest(q.id)}
                                    disabled={!isDone || q.claimed}
                                    style={{
                                        padding: '8px 15px',
                                        minWidth: '80px',
                                        background: q.claimed ? 'transparent' : (isDone ? 'var(--neon-green)' : '#333'),
                                        color: q.claimed ? 'var(--neon-green)' : (isDone ? 'black' : '#888'),
                                        border: q.claimed ? '1px solid var(--neon-green)' : 'none',
                                        borderRadius: '8px', fontWeight: 'bold',
                                        cursor: (isDone && !q.claimed) ? 'pointer' : 'default',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {q.claimed ? 'DONE' : (isDone ? 'CLAIM' : '...')}
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default DailyQuestModal;
