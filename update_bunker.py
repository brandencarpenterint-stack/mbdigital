import re

filepath = 'src/pages/TheBunker.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add confetti import
content = content.replace(
    "import useRetroSound from '../hooks/useRetroSound';",
    "import useRetroSound from '../hooks/useRetroSound';\nimport confetti from 'canvas-confetti';"
)

# Add player_action broadcast listener
target_listener = """        channel.on('broadcast', { event: 'player_update' }, (payload) => {
            const data = payload.payload;"""

replacement_listener = """        channel.on('broadcast', { event: 'player_action' }, (payload) => {
            const data = payload.payload;
            if (data.type === 'fireworks') {
                confetti({
                    particleCount: 50,
                    spread: 80,
                    startVelocity: 40,
                    origin: { x: data.x / 100, y: data.y / 100 },
                    colors: ['#00ffcc', '#ff00ff', '#ffffff', '#ffaa00'],
                    zIndex: 9999
                });
            }
        });

        channel.on('broadcast', { event: 'player_update' }, (payload) => {
            const data = payload.payload;"""

content = content.replace(target_listener, replacement_listener)

# Add sendAction function
target_sendChat = """    const sendChat = (e) => {"""
replacement_sendChat = """    const triggerFireworks = () => {
        playBeep();
        // Fire locally
        confetti({
            particleCount: 50,
            spread: 80,
            startVelocity: 40,
            origin: { x: myPos.x / 100, y: myPos.y / 100 },
            colors: ['#00ffcc', '#ff00ff', '#ffffff', '#ffaa00'],
            zIndex: 9999
        });
        // Broadcast
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'player_action',
                payload: { type: 'fireworks', x: myPos.x, y: myPos.y }
            });
        }
    };

    const sendEmoji = (emoji) => {
        playBeep();
        setMyChat(emoji); // Reuse chat bubble for big emojis
        broadcastState(emoji);
        setTimeout(() => {
            setMyChat(prev => prev === emoji ? null : prev);
            broadcastState(null);
        }, 3000);
    };

    const sendChat = (e) => {"""
content = content.replace(target_sendChat, replacement_sendChat)

# Add action bar UI above chat
target_chatUI = """            {/* Chat Bar */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '500px', zIndex: 1000
            }}>"""

replacement_chatUI = """            {/* Action Bar */}
            <div style={{
                position: 'absolute', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '10px', zIndex: 1000
            }}>
                <button onClick={(e) => { e.stopPropagation(); sendEmoji('🔥'); }} style={actionBtnStyle}>🔥</button>
                <button onClick={(e) => { e.stopPropagation(); sendEmoji('💀'); }} style={actionBtnStyle}>💀</button>
                <button onClick={(e) => { e.stopPropagation(); sendEmoji('🚀'); }} style={actionBtnStyle}>🚀</button>
                <button onClick={(e) => { e.stopPropagation(); sendEmoji('💰'); }} style={actionBtnStyle}>💰</button>
                <button onClick={(e) => { e.stopPropagation(); triggerFireworks(); }} style={{ ...actionBtnStyle, background: 'var(--neon-blue)', color: 'black', fontWeight: 'bold' }}>
                    🧨 FIREWORKS
                </button>
            </div>

            {/* Chat Bar */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '500px', zIndex: 1000
            }}>"""
content = content.replace(target_chatUI, replacement_chatUI)

# Add styles helper
target_end = "export default TheBunker;"
replacement_end = """const actionBtnStyle = {
    padding: '10px 15px',
    borderRadius: '15px',
    background: 'rgba(0,0,0,0.8)',
    border: '2px solid #444',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
    transition: 'transform 0.1s'
};

export default TheBunker;"""
content = content.replace(target_end, replacement_end)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated TheBunker.jsx")
