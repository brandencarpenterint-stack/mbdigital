import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';

const COLORS = ['#ff00ff', '#00ffcc', '#ffff00', '#ff0055', '#00ff00'];

const GHOST_BROS = [
    { id: 'ghost_dino', name: 'Turbo Dino', color: '#00ff66', skin: '/assets/skins/face_dino.png', phrase: 'Derby time! 🏇' },
    { id: 'ghost_bunny', name: 'Cyber Bunny', color: '#ff007f', skin: '/assets/skins/face_bunny.png', phrase: 'Moonshot 10x! 🚀' },
    { id: 'ghost_whale', name: 'Whale Bro', color: '#ffd700', skin: '/assets/skins/face_money.png', phrase: 'All in on 21! 🃏' }
];

const MultiplayerCursors = () => {
    const { userProfile } = useGamification() || {};
    const [cursors, setCursors] = useState({});
    const [ghostCursors, setGhostCursors] = useState([]);
    const channelRef = useRef(null);
    const myId = useRef(Math.random().toString(36).substr(2, 9));
    const myColor = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const userName = userProfile?.name || 'GUEST_' + myId.current.substr(0, 4);

    const lastBroadcast = useRef(0);

    // Initialize Simulated Ghost Bros
    useEffect(() => {
        const initialGhosts = GHOST_BROS.map(g => ({
            ...g,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            targetX: 20 + Math.random() * 60,
            targetY: 20 + Math.random() * 60,
            bubble: null
        }));
        setGhostCursors(initialGhosts);

        // Move ghosts smoothly every 2.5 - 4.5 seconds
        const ghostInterval = setInterval(() => {
            setGhostCursors(prev =>
                prev.map(g => {
                    const newX = Math.max(8, Math.min(92, g.x + (Math.random() - 0.5) * 35));
                    const newY = Math.max(10, Math.min(88, g.y + (Math.random() - 0.5) * 35));
                    const showBubble = Math.random() < 0.25;

                    return {
                        ...g,
                        x: newX,
                        y: newY,
                        bubble: showBubble ? g.phrase : null
                    };
                })
            );
        }, 3200);

        return () => clearInterval(ghostInterval);
    }, []);

    // Real-time Supabase Peers
    useEffect(() => {
        if (!supabase) return;

        const channel = supabase.channel('arcade_cursors', {
            config: { broadcast: { ack: false } }
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

        // Cleanup old real cursors
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

    // Broadcast My Cursor
    useEffect(() => {
        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastBroadcast.current > 50 && channelRef.current) {
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

    const realCursorList = Object.values(cursors);
    // If fewer than 2 real users are connected, show simulated ghost bros
    const displayGhosts = realCursorList.length < 2;

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999999, overflow: 'hidden' }}>
            {/* Real Supabase Peer Cursors */}
            {realCursorList.map((c, i) => (
                <div
                    key={`real_${i}`}
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${c.color})` }}>
                        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86c-.31-.31-.85-.09-.85.35z" fill={c.color} stroke="#fff" strokeWidth="1.5" />
                    </svg>
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

            {/* Simulated Online Ghost Bros */}
            {displayGhosts && ghostCursors.map(g => (
                <div
                    key={g.id}
                    style={{
                        position: 'absolute',
                        left: `${g.x}vw`,
                        top: `${g.y}vh`,
                        transition: 'all 2.8s cubic-bezier(0.25, 1, 0.5, 1)',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transform: 'translate(-5px, -5px)'
                    }}
                >
                    {/* Speech Bubble */}
                    {g.bubble && (
                        <div style={{
                            background: 'rgba(0,0,0,0.85)',
                            border: `1px solid ${g.color}`,
                            color: g.color,
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            marginBottom: '4px',
                            boxShadow: `0 0 10px ${g.color}40`,
                            whiteSpace: 'nowrap',
                            animation: 'fadeIn 0.3s'
                        }}>
                            {g.bubble}
                        </div>
                    )}

                    {/* SVG Pointer with mini avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 6px ${g.color})` }}>
                            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86c-.31-.31-.85-.09-.85.35z" fill={g.color} stroke="#fff" strokeWidth="1.5" />
                        </svg>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: `1px solid ${g.color}`,
                            padding: '2px 6px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                            <img
                                src={g.skin}
                                alt={g.name}
                                style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ color: g.color, fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                @{g.name}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MultiplayerCursors;
