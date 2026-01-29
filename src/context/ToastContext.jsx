import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Add a new toast
    // type: 'success', 'info', 'warning', 'achievement', 'xp', 'coin'
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3s
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* TOAST CONTAINER OVERLAY */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px', // Top Right for Desktop
                zIndex: 11000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none' // Allow clicks through container
            }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {/* CENTERED ACHIEVEMENT OVERLAY (Special Case) */}
            <div style={{
                position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 11001, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <AnimatePresence>
                    {toasts.filter(t => t.type === 'achievement').map(toast => (
                        <AchievementToast key={toast.id} toast={toast} />
                    ))}
                </AnimatePresence>
            </div>

        </ToastContext.Provider>
    );
};

// --- SUB COMPONENTS ---

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
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
                fontSize: '0.8rem'
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span>{toast.message}</span>
        </motion.div>
    );
};

const AchievementToast = ({ toast }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: 'black',
                padding: '15px 30px',
                borderRadius: '50px',
                border: '4px solid white',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
                pointerEvents: 'none',
                marginBottom: '10px'
            }}
        >
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🏆</div>
            <div style={{ fontWeight: '900', fontSize: '1.2rem', fontFamily: '"Orbitron", sans-serif' }}>ACHIEVEMENT UNLOCKED</div>
            <div style={{ fontWeight: 'bold' }}>{toast.message}</div>
        </motion.div>
    );
};
