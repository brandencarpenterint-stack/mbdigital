import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

// A simple 2.5D Social Hangout Room
const TheBunker = () => {
    const { userProfile } = useGamification() || {};
    const { playClick, playBeep, playJump } = useRetroSound();
    const [players, setPlayers] = useState({});
    const [chatInput, setChatInput] = useState('');
    const channelRef = useRef(null);
    const containerRef = useRef(null);
    const myId = useRef(Math.random().toString(36).substr(2, 9));
    
    // My local state (where I am currently walking to)
    const [myPos, setMyPos] = useState({ x: 50, y: 50 }); // Percentages
    const [myChat, setMyChat] = useState(null);

    const userName = userProfile?.name || 'GUEST_' + myId.current.substr(0, 4);
    const avatar = userProfile?.avatar || '/assets/merchboy_face.png';

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase.channel('bunker_room', {
            config: { broadcast: { ack: false } }
        });

        channel.on('broadcast', { event: 'player_update' }, (payload) => {
            const data = payload.payload;
            if (data.id === myId.current) return;
            
            setPlayers(prev => ({
                ...prev,
                [data.id]: {
                    ...data,
                    lastSeen: Date.now()
                }
            }));
        }).subscribe();

        channelRef.current = channel;

        // Broadcast my existence every 2 seconds (Heartbeat)
        const heartbeat = setInterval(() => {
            broadcastState();
        }, 2000);

        // Cleanup stale players (haven't heard from in 5s)
        const cleanup = setInterval(() => {
            const now = Date.now();
            setPlayers(prev => {
                const newPlayers = { ...prev };
                let changed = false;
                Object.keys(newPlayers).forEach(id => {
                    if (now - newPlayers[id].lastSeen > 5000) {
                        delete newPlayers[id];
                        changed = true;
                    }
                });
                return changed ? newPlayers : prev;
            });
        }, 2000);

        // Initial broadcast
        setTimeout(broadcastState, 500);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
            clearInterval(cleanup);
        };
    }, [myPos, myChat, userName, avatar]);

    const broadcastState = (overrideChat = myChat) => {
        if (!channelRef.current) return;
        channelRef.current.send({
            type: 'broadcast',
            event: 'player_update',
            payload: {
                id: myId.current,
                name: userName,
                avatar: avatar,
                x: myPos.x,
                y: myPos.y,
                chat: overrideChat
            }
        });
    };

    const handleFloorClick = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate click position as percentage of the container
        let xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        let yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        // Clamp to floor area (bottom 40% of the screen)
        if (yPercent < 50) yPercent = 50; 
        if (yPercent > 95) yPercent = 95;
        if (xPercent < 5) xPercent = 5;
        if (xPercent > 95) xPercent = 95;

        setMyPos({ x: xPercent, y: yPercent });
        playJump();
        
        // Broadcast immediately on move
        setTimeout(broadcastState, 50); 
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const msg = chatInput.trim();
        setMyChat(msg);
        setChatInput('');
        playBeep();
        
        broadcastState(msg);

        // Clear chat bubble after 5s
        setTimeout(() => {
            setMyChat(prev => prev === msg ? null : prev);
            broadcastState(null);
        }, 5000);
    };

    // Rendering Helpers
    const renderPlayer = (player, isMe = false) => {
        const pX = isMe ? myPos.x : player.x;
        const pY = isMe ? myPos.y : player.y;
        const pChat = isMe ? myChat : player.chat;
        const pAvatar = isMe ? avatar : player.avatar;
        const pName = isMe ? userName : player.name;

        // 2.5D Magic: Scale based on Y position (further back = smaller)
        // Y goes from 50 (back) to 100 (front)
        const scale = 0.6 + ((pY - 50) / 50) * 0.6; // Scale from 0.6 to 1.2
        const zIndex = Math.floor(pY); // Lower on screen = draws on top

        return (
            <motion.div
                key={isMe ? 'me' : player.id}
                initial={{ x: `${pX}vw`, y: `${pY}vh` }}
                animate={{ x: `${pX}vw`, y: `${pY}vh` }}
                transition={{ type: 'tween', duration: isMe ? 0.8 : 0.8, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    transform: `translate(-50%, -100%) scale(${scale})`, // anchor at feet
                    zIndex: zIndex,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none'
                }}
            >
                {/* Chat Bubble */}
                <AnimatePresence>
                    {pChat && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                background: 'white',
                                color: 'black',
                                padding: '8px 12px',
                                borderRadius: '15px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                maxWidth: '150px',
                                textAlign: 'center',
                                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                                position: 'relative'
                            }}
                        >
                            {pChat}
                            {/* Speech Triangle */}
                            <div style={{
                                position: 'absolute', bottom: '-5px', left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0, height: 0,
                                borderLeft: '5px solid transparent',
                                borderRight: '5px solid transparent',
                                borderTop: '6px solid white'
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Name Tag */}
                <div style={{
                    background: 'rgba(0,0,0,0.6)', color: isMe ? '#00ffcc' : 'white',
                    padding: '2px 8px', borderRadius: '10px', fontSize: '10px',
                    marginBottom: '5px', fontWeight: 'bold', fontFamily: 'monospace',
                    border: isMe ? '1px solid #00ffcc' : '1px solid #444'
                }}>
                    {pName}
                </div>

                {/* Character Sprite */}
                <div style={{
                    width: '60px', height: '60px',
                    borderRadius: '50%',
                    background: '#111',
                    border: '2px solid #333',
                    overflow: 'hidden',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <img src={pAvatar} alt={pName} style={{ width: '120%', height: '120%', objectFit: 'cover' }} />
                </div>
                
                {/* Drop Shadow */}
                <div style={{
                    width: '40px', height: '10px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    marginTop: '-5px',
                    filter: 'blur(2px)'
                }} />
            </motion.div>
        );
    };

    return (
        <div 
            ref={containerRef}
            onClick={handleFloorClick}
            style={{
                width: '100vw', height: '100vh',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                cursor: 'crosshair'
            }}
        >
            {/* Background Details (Graffiti, Posters, Neon) */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '4rem', color: '#ff0055', opacity: 0.1, fontFamily: 'monospace', transform: 'rotate(-10deg)', pointerEvents: 'none' }}>
                HACK THE PLANET
            </div>
            <div style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '3rem', color: '#00ffcc', textShadow: '0 0 20px #00ffcc', pointerEvents: 'none' }}>
                [ SYSTEM_OVR ]
            </div>
            <div style={{ position: 'absolute', top: '40%', left: 0, width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
            
            {/* Floor Horizon Line */}
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid rgba(0,255,204,0.3)', pointerEvents: 'none', perspective: '500px' }}>
                {/* Grid on the floor */}
                <div style={{
                    width: '100%', height: '100%',
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,255,204,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,255,204,0.05) 20px)',
                    transform: 'rotateX(60deg)',
                    transformOrigin: 'top'
                }} />
            </div>

            <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontFamily: 'monospace', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ color: '#00ffcc', fontWeight: 'bold' }}>THE BUNKER (LOBBY)</div>
                <div>PLAYERS ONLINE: {Object.keys(players).length + 1}</div>
                <div style={{ color: '#aaa', fontSize: '0.7rem', marginTop: '5px' }}>Click anywhere on the floor to walk.</div>
            </div>

            {/* Render Other Players */}
            {Object.values(players).map(p => renderPlayer(p, false))}
            
            {/* Render Me */}
            {renderPlayer(null, true)}

            {/* Chat Bar */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '500px', zIndex: 1000
            }}>
                <form onSubmit={sendChat} style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Say something to the room..."
                        maxLength={50}
                        style={{
                            flex: 1, padding: '15px', borderRadius: '20px',
                            background: 'rgba(0,0,0,0.8)', border: '2px solid #00ffcc',
                            color: 'white', fontFamily: 'monospace', fontSize: '1rem',
                            outline: 'none', boxShadow: '0 0 15px rgba(0,255,204,0.3)'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '15px 25px', borderRadius: '20px',
                        background: '#00ffcc', color: 'black', fontWeight: 'bold',
                        border: 'none', cursor: 'pointer', fontFamily: '"Press Start 2P"'
                    }}>
                        CHAT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TheBunker;
