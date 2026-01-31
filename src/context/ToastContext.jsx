import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [achievementQueue, setAchievementQueue] = useState([]);
    const [currentAchievement, setCurrentAchievement] = useState(null);

    // Debug
    useEffect(() => { console.log("Toast System Online 🍞"); }, []);

    // Add a new toast
    // type: 'success', 'info', 'warning', 'achievement', 'xp', 'coin'
    const showToast = useCallback((message, type = 'info', details = null) => {
        const id = Date.now() + Math.random();

        if (type === 'achievement') {
            setAchievementQueue(prev => [...prev, { id, message, type, details }]);
        } else {
            setToasts(prev => [...prev, { id, message, type, details }]);
            // Auto remove standard toasts
            setTimeout(() => {
                removeToast(id);
            }, 3000);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // PROCESS ACHIEVEMENT QUEUE
    useEffect(() => {
        if (!currentAchievement && achievementQueue.length > 0) {
            // Pop the next one
            const next = achievementQueue[0];
            setCurrentAchievement(next);
            setAchievementQueue(prev => prev.slice(1));

            // Wait 5 seconds (Enter -> Read -> Exit), then clear
            setTimeout(() => {
                setCurrentAchievement(null);
            }, 5000);
        }
    }, [currentAchievement, achievementQueue]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* STANDARD TOASTS (Top Right) */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 11000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            }}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>

            {/* SEQUENTIAL ACHIEVEMENT OVERLAY (Center) */}
            {/* SEQUENTIAL ACHIEVEMENT OVERLAY (Center) */}
            <div style={{
                position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
                zIndex: 11001, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', maxWidth: '400px'
            }}>
                {currentAchievement && (
                    <AchievementToast key={currentAchievement.id} toast={currentAchievement} />
                )}
            </div>

        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    // Styling based on type
    let bg = 'rgba(0,0,0,0.8)';
    let border = 'rgba(255,255,255,0.2)';
    let icon = 'ℹ️';

    if (toast.type === 'success') { bg = 'rgba(0, 20, 0, 0.9)'; border = '#00ff00'; icon = '✅'; }
    if (toast.type === 'error') { bg = 'rgba(20, 0, 0, 0.9)'; border = '#ff0000'; icon = '❌'; }
    if (toast.type === 'xp') { bg = 'rgba(0, 0, 50, 0.9)'; border = '#00ccff'; icon = '⚡'; }
    if (toast.type === 'coin') { bg = 'rgba(20, 20, 0, 0.9)'; border = '#ffd700'; icon = '🪙'; }

    // Achievements handled separately visually, but fallback here just in case
    if (toast.type === 'achievement') return null;

    return (
        <div
            style={{
                background: bg,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                border: `1px solid ${border}`,
                boxShadow: `0 4px 15px ${bg}`,
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', gap: '10px',
                minWidth: '200px',
                pointerEvents: 'auto',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '0.8rem',
                animation: 'fadeIn 0.3s ease-out'
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span>{toast.message}</span>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </div>
    );
};

const AchievementToast = ({ toast }) => {
    return (
        <div
            style={{
                background: 'rgba(0,0,0,0.9)', // Dark base
                color: 'white',
                padding: '2px', // Border wrapper
                borderRadius: '20px',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                backgroundImage: 'linear-gradient(#000,#000), linear-gradient(135deg, gold, #ff0055)', // Neon Border
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)',
                textAlign: 'center',
                pointerEvents: 'none',
                marginBottom: '10px',
                width: '100%',
                animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
        >
            <div style={{ padding: '20px', borderRadius: '18px', background: '#111' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px', animation: 'bounce 1s infinite' }}>🏆</div>
                <div style={{ color: 'gold', fontWeight: '900', fontSize: '1.2rem', fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px', marginBottom: '5px' }}>
                    ACHIEVEMENT UNLOCKED
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{toast.message}</div>

                {toast.details?.description && (
                    <div style={{ fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic', marginBottom: '10px' }}>
                        "{toast.details.description}"
                    </div>
                )}

                {/* REWARD SECTION */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {toast.details?.reward && (
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#00ff00', fontWeight: 'bold' }}>
                            🎁 {toast.details.reward}
                        </div>
                    )}
                    <div style={{ background: 'rgba(255,255,0,0.1)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', color: 'gold', fontWeight: 'bold' }}>
                        ⚡ +500 XP
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5) translateY(50px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};
