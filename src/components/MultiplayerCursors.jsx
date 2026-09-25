import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';

const COLORS = ['#ff00ff', '#00ffcc', '#ffff00', '#ff0055', '#00ff00'];

const MultiplayerCursors = () => {
    const { userProfile } = useGamification() || {};
    const [cursors, setCursors] = useState({});
    const channelRef = useRef(null);
    const myId = useRef(Math.random().toString(36).substr(2, 9));
    const myColor = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const userName = userProfile?.name || 'GUEST_' + myId.current.substr(0,4);
    
    // Throttle broadcast
    const lastBroadcast = useRef(0);

    useEffect(() => {
        if (!supabase) return;
        
        const channel = supabase.channel('arcade_cursors', {
            config: {
                broadcast: { ack: false }
            }
        });
        
        channel.on('broadcast', { event: 'cursor_move' }, (payload) => {
            const { id, x, y, name, color } = payload.payload;
            if (id === myId.current) return;
            
            setCursors(prev => ({
                ...prev,
                [id]: { x, y, name, color, lastSeen: Date.now() }
            }));
        }).subscribe();

        channelRef.current = channel;

        // Cleanup old cursors
        const cleanup = setInterval(() => {
            const now = Date.now();
            setCursors(prev => {
                const next = { ...prev };
                let changed = false;
                for (const id in next) {
                    if (now - next[id].lastSeen > 5000) {
                        delete next[id];
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        }, 2000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(cleanup);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const now = Date.now();
            // Throttle to ~20fps (50ms) to save Supabase bandwidth
            if (now - lastBroadcast.current > 50 && channelRef.current) {
                // Get percentage positions to account for different screen sizes
                const xPercent = (e.clientX / window.innerWidth) * 100;
                const yPercent = (e.clientY / window.innerHeight) * 100;
                
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'cursor_move',
                    payload: {
                        id: myId.current,
                        name: userName,
                        color: myColor.current,
                        x: xPercent,
                        y: yPercent
                    }
                }).catch(() => {});
                lastBroadcast.current = now;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [userName]);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999999, overflow: 'hidden' }}>
            {Object.values(cursors).map((c, i) => (
                <div 
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${c.x}vw`,
                        top: `${c.y}vh`,
                        transition: 'all 0.1s linear',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transform: 'translate(-5px, -5px)'
                    }}
                >
                    {/* SVG Pointer */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${c.color})` }}>
                        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86c-.31-.31-.85-.09-.85.35z" fill={c.color} stroke="#fff" strokeWidth="1.5" />
                    </svg>
                    
                    {/* Name Tag */}
                    <div style={{
                        background: c.color,
                        color: '#000',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        marginTop: '2px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap'
                    }}>
                        {c.name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MultiplayerCursors;
