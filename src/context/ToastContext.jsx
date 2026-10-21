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

            {/* AUTHENTIC XBOX ACHIEVEMENT BANNER OVERLAY (Bottom-Center) */}
            <div style={{
                position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 11001, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '92%', maxWidth: '440px'
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
    const gamerscore = toast.details?.gamerscore || 25;

    return (
        <div
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(8, 14, 22, 0.96) 0%, rgba(12, 20, 14, 0.98) 100%)',
                color: '#fff',
                padding: '14px 18px',
                borderRadius: '50px',
                border: '1.5px solid rgba(0, 255, 136, 0.5)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 255, 136, 0.25)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                pointerEvents: 'auto',
                animation: 'xboxSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Green Sheen */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00ff88, transparent)'
            }} />

            {/* Glowing Xbox-Style Achievement Trophy Icon */}
            <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #107c10 0%, #00ff88 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(0, 255, 136, 0.6), inset 0 0 6px rgba(255, 255, 255, 0.5)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
                🏆
            </div>

            {/* Text Information */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#00ff88',
                    fontSize: '0.68rem',
                    fontWeight: '900',
                    fontFamily: '"Orbitron", monospace',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase'
                }}>
                    <span>ACHIEVEMENT UNLOCKED</span>
                    <span>•</span>
                    <span style={{
                        background: 'rgba(0, 255, 136, 0.15)',
                        border: '1px solid rgba(0, 255, 136, 0.4)',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '0.65rem'
                    }}>
                        +{gamerscore}G
                    </span>
                </div>

                <div style={{
                    fontSize: '1rem',
                    fontWeight: '900',
                    color: '#fff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px'
                }}>
                    {toast.message}
                </div>

                {toast.details?.description && (
                    <div style={{
                        fontSize: '0.74rem',
                        color: '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px'
                    }}>
                        {toast.details.description}
                    </div>
                )}
            </div>

            {/* Reward Pill (if present) */}
            {toast.details?.reward && (
                <div style={{
                    background: 'rgba(255, 215, 0, 0.12)',
                    border: '1px solid rgba(255, 215, 0, 0.35)',
                    color: '#ffd700',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                }}>
                    🎁 {toast.details.reward}
                </div>
            )}

            <style>{`
                @keyframes xboxSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};
