import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const LiveFeed = () => {
    const [messages, setMessages] = useState([
        { id: 1, user: 'System', text: 'Connecting to Global Feed...', time: 'Now', color: '#ffaaaa' }
    ]);

    useEffect(() => {
        // Initial Fetch
        const loadHistory = async () => {
            const { data } = await supabase.from('feed_events').select('*').order('created_at', { ascending: false }).limit(5);
            if (data) {
                const mapped = data.map(evt => ({
                    id: evt.id,
                    user: evt.player_name,
                    text: evt.message,
                    time: 'Recent',
                    color: evt.type === 'win' ? 'gold' : (evt.type === 'fail' ? '#ff4444' : '#00ccff')
                }));
                setMessages(mapped);
            }
        };
        loadHistory();

        // Subscribe to New Events
        const channel = supabase.channel('global-feed')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'feed_events' },
                (payload) => {
                    const evt = payload.new;
                    const newMessage = {
                        id: evt.id,
                        user: evt.player_name,
                        text: evt.message,
                        time: 'Just now',
                        color: evt.type === 'win' ? 'gold' : (evt.type === 'fail' ? '#ff4444' : '#00ccff')
                    };
                    setMessages(prev => [newMessage, ...prev].slice(0, 5));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '800px', margin: '0 auto 20px auto',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #333',
            height: '120px', overflow: 'hidden',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute', top: 5, right: 10,
                fontSize: '0.7rem', color: 'var(--neon-green)',
                display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                <div style={{ width: 6, height: 6, background: 'var(--neon-green)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                LIVE GLOBAL FEED
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.length === 0 ? <div style={{ color: '#666', fontSize: '0.8rem' }}>Waiting for signal...</div> :
                    messages.map((msg, i) => (
                        <div key={msg.id} style={{
                            fontSize: '0.85rem',
                            opacity: 1 - (i * 0.2), // Fade out older messages
                            transform: `translateX(${i * 5}px)`,
                            transition: 'all 0.3s'
                        }}>
                            <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>@{msg.user}</span>: <span style={{ color: msg.color }}>{msg.text}</span>
                        </div>
                    ))}
            </div>

            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default LiveFeed;
