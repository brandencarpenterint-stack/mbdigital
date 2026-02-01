import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import SquishyButton from './SquishyButton';
import { useNavigate } from 'react-router-dom';

const NotificationList = ({ onClose }) => {
    const { notifications, markRead } = useNotifications();
    const navigate = useNavigate();

    const handleItemClick = (n) => {
        if (!n.read) markRead(n.id);
    };

    const handleAcceptChallenge = (n) => {
        markRead(n.id);
        const gameMap = {
            'Snake': '/arcade/snake',
            'FlappyMascot': '/arcade/flappy',
            'NeonBrickBreaker': '/arcade/brick',
            'CrazyFishing': '/arcade/fishing',
            'GalaxyDefender': '/arcade/galaxy',
            'WhackAMole': '/arcade/whack',
            'MemoryMatch': '/arcade/memory',
            'FaceRunner': '/arcade/face-runner',
            'CosmicSlots': '/arcade/slots',
            'SubHunter': '/arcade/sub-hunter',
            'MerchJump': '/arcade/merch-jump',
            'BroCannon': '/arcade/bro-cannon'
        };

        const route = gameMap[n.payload?.game] || '/arcade';
        navigate(route);
        if (onClose) onClose();
    };

    return (
        <div style={{
            position: 'absolute', top: '70px', right: '20px', width: '300px',
            maxHeight: '400px', overflowY: 'auto',
            background: 'rgba(20,20,30,0.95)', border: '1px solid #444',
            borderRadius: '15px', padding: '10px', zIndex: 2000,
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 5px' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neon-blue)' }}>NOTIFICATIONS</h3>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
            </div>

            {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
                    No new alerts.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            style={{
                                background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                                borderLeft: n.read ? '3px solid #444' : '3px solid var(--neon-pink)',
                                padding: '10px', borderRadius: '5px',
                                cursor: 'pointer', transition: 'background 0.2s'
                            }}
                        >
                            <div
                                onClick={() => handleItemClick(n)}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}
                            >
                                {/* Avatar or Icon */}
                                {n.type === 'challenge' ? (
                                    <span style={{ fontSize: '1.2rem' }}>⚔️</span>
                                ) : (
                                    <span style={{ fontSize: '1.2rem' }}>🔔</span>
                                )}
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: n.read ? '#aaa' : 'white' }}>
                                    {n.sender?.name || 'System'}
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#666' }}>
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.3' }}>
                                {n.message}
                            </div>

                            {/* Actions */}
                            {n.type === 'challenge' && (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                                    <SquishyButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAcceptChallenge(n);
                                        }}
                                        style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'var(--neon-blue)' }}
                                    >
                                        Accept
                                    </SquishyButton>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markRead(n.id);
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.7rem' }}
                                    >
                                        Ignore
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationList;
