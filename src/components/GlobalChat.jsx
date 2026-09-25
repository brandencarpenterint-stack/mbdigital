import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

const GlobalChat = () => {
    const { userProfile } = useGamification() || {};
    const { playBeep } = useRetroSound();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const channelRef = useRef(null);

    const userName = userProfile?.name || 'GUEST_' + Math.floor(Math.random() * 9999);

    useEffect(() => {
        if (!supabase) return;
        
        // Initialize Supabase Broadcast Channel for Ephemeral Chat
        const channel = supabase.channel('arcade_global_chat');
        
        channel.on('broadcast', { event: 'chat_message' }, (payload) => {
            setMessages(prev => {
                const newMessages = [...prev, payload.payload];
                if (newMessages.length > 50) return newMessages.slice(newMessages.length - 50); // Keep last 50
                return newMessages;
            });
            if (!isOpen) playBeep();
        }).subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, playBeep]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !channelRef.current) return;

        const payload = {
            id: Date.now(),
            user: userName,
            text: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Optimistic update
        setMessages(prev => [...prev, payload]);
        
        // Broadcast to others
        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat_message',
            payload: payload
        });

        setInput('');
    };

    if (!isOpen) {
        return (
            <div 
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 999999,
                    background: 'rgba(0,0,0,0.8)', border: '2px solid #00ffcc',
                    padding: '10px 20px', borderRadius: '30px', cursor: 'pointer',
                    color: '#00ffcc', fontFamily: 'monospace', fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(0,255,204,0.3)', backdropFilter: 'blur(10px)'
                }}
            >
                💬 LIVE CHAT {messages.length > 0 ? `(${messages.length})` : ''}
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 999999,
            width: '320px', height: '450px', background: 'rgba(10,10,15,0.95)',
            border: '2px solid #00ffcc', borderRadius: '15px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,255,204,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                background: '#00ffcc', color: '#000', padding: '10px 15px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold'
            }}>
                <span>GLOBAL TROLLBOX</span>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.length === 0 && (
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '50px', fontFamily: 'monospace' }}>
                        Connected to Global Frequency...<br/>Be the first to speak.
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={msg.id || i} style={{ 
                        display: 'flex', flexDirection: 'column', 
                        alignItems: msg.user === userName ? 'flex-end' : 'flex-start' 
                    }}>
                        <div style={{ fontSize: '0.7rem', color: msg.user === userName ? '#00ffcc' : '#ff00ff', marginBottom: '3px', fontFamily: 'monospace' }}>
                            {msg.user} <span style={{color: '#555'}}>{msg.timestamp}</span>
                        </div>
                        <div style={{ 
                            background: msg.user === userName ? 'rgba(0,255,204,0.1)' : 'rgba(255,0,255,0.1)',
                            border: `1px solid ${msg.user === userName ? '#00ffcc' : '#ff00ff'}`,
                            padding: '8px 12px', borderRadius: '10px', fontSize: '0.9rem',
                            color: '#fff', wordBreak: 'break-word', maxWidth: '85%'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid #333' }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="TRASH TALK HERE..."
                    style={{
                        flex: 1, background: 'transparent', border: 'none', color: '#fff',
                        outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem'
                    }}
                />
                <button type="submit" style={{
                    background: '#00ffcc', color: '#000', border: 'none', padding: '5px 15px',
                    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                }}>SEND</button>
            </form>
        </div>
    );
};

export default GlobalChat;
