import React from 'react';

const ChatMessage = ({ msg }) => {
    // SYSTEM
    if (msg.type === 'system') {
        return (
            <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#666', margin: '5px 0' }}>
                -- {msg.text} --
            </div>
        );
    }

    // USER
    return (
        <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
            flexDirection: msg.isMe ? 'row-reverse' : 'row',
            maxWidth: '90%'
        }}>
            {/* AVATAR */}
            <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#333', overflow: 'hidden', flexShrink: 0,
                border: `1px solid ${msg.squad === 'CYBER' ? '#00ffcc' : (msg.squad === 'SOLAR' ? '#ffcc00' : (msg.squad === 'VOID' ? '#ff0055' : '#888'))}`
            }}>
                <img src={msg.avatar || '/assets/merchboy_face.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* BUBBLE */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '2px' }}>
                    {msg.user}
                </div>
                <div style={{
                    background: msg.isMe ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)',
                    color: msg.isMe ? 'black' : 'white',
                    padding: '6px 10px',
                    borderRadius: msg.isMe ? '12px 0 12px 12px' : '0 12px 12px 12px',
                    fontSize: '0.8rem',
                    lineHeight: '1.4'
                }}>
                    {msg.text}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
