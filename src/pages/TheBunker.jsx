import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import confetti from 'canvas-confetti';
import { SHOP_ITEMS } from '../config/ShopItems';

// A simple 2.5D Social Hangout Room
const TheBunker = () => {
    const { userProfile, shopState, consumeItem, incrementStat } = useGamification() || {};
    const [visualEffects, setVisualEffects] = useState([]);

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

                channel.on('broadcast', { event: 'player_action' }, (payload) => {
            const data = payload.payload;
            if (data.type === 'fireworks') {
                confetti({
                    particleCount: 50, spread: 80, startVelocity: 40,
                    origin: { x: data.x / 100, y: data.y / 100 },
                    colors: ['#00ffcc', '#ff00ff', '#ffffff', '#ffaa00'], zIndex: 9999
                });
            } else {
                // Add to visual effects (smoke, pie)
                setVisualEffects(prev => [...prev, { id: Date.now() + Math.random(), type: data.type, x: data.x, y: data.y }]);
                setTimeout(() => {
                    setVisualEffects(prev => prev.filter(e => Date.now() - e.id < 2000)); // cleanup hack, actual cleanup below
                }, 2000);
            }
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

        
        // Cleanup visual effects periodically
        const fxCleanup = setInterval(() => {
            setVisualEffects(prev => prev.filter(e => Date.now() - parseInt(e.id) < 1500));
        }, 1000);

        return () => {
            clearInterval(fxCleanup);
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

    
    const triggerAction = (actionType) => {
        // Find item in shop
        const item = SHOP_ITEMS.find(i => i.id === actionType);
        if (actionType !== 'fireworks' && (!item || !shopState?.inventory?.[actionType] || shopState.inventory[actionType] <= 0)) {
            playError();
            alert("You don't have any of these! Buy them in the Shop.");
            return;
        }

        if (actionType !== 'fireworks') {
            consumeItem(actionType);
        }

        if (actionType === 'bunker_pie') incrementStat('bunkerPiesThrown', 1);
        if (actionType === 'bunker_smoke') incrementStat('bunkerSmokesUsed', 1);

        playBeep();
        
        if (actionType === 'fireworks' || actionType === 'bunker_fireworks') {
            confetti({
                particleCount: 50, spread: 80, startVelocity: 40,
                origin: { x: myPos.x / 100, y: myPos.y / 100 }, zIndex: 9999
            });
        } else {
            setVisualEffects(prev => [...prev, { id: Date.now(), type: actionType, x: myPos.x, y: myPos.y }]);
        }

        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast', event: 'player_action',
                payload: { type: actionType, x: myPos.x, y: myPos.y }
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

            <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontFamily: 'monospace', pointerEvents: 'none', background: 'rgba(0,0,0,0.7)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(0,255,204,0.3)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
                <div style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '1px' }}>THE BUNKER (COMMUNITY LOBBY)</div>
                <div style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '2px' }}>PLAYERS IN ROOM: {Object.keys(players).length + 1}</div>
                <div style={{ color: '#aaa', fontSize: '0.7rem', marginTop: '4px' }}>Click anywhere on the floor to walk.</div>
            </div>

            {/* TOP RIGHT CONTROLS: KLAXON & EXIT */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 1000 }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('spawn-raid-boss'));
                        try { playCrash(); } catch(err) {}
                    }}
                    style={{
                        background: 'linear-gradient(135deg, #ff0055, #ff5500)',
                        border: '2px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        padding: '10px 18px',
                        borderRadius: '25px',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(255,0,85,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>🚨</span> SOUND THE ALARM
                </button>

                <Link
                    to="/arcade"
                    style={{
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid #00ffcc',
                        color: '#00ffcc',
                        padding: '10px 18px',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    ◄ ARCADE
                </Link>
            </div>

            {/* INTERACTIVE BUNKER CYBER 21 VIP TABLE */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#/arcade/blackjack';
                }}
                style={{
                    position: 'absolute',
                    top: '32%',
                    left: '18%',
                    zIndex: 45,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    background: '#ffd700',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px #ffd700',
                    marginBottom: '4px',
                    animation: 'pulse 1.5s infinite'
                }}>
                    CYBER 21
                </div>
                <div style={{
                    width: '60px',
                    height: '90px',
                    background: 'linear-gradient(145deg, #182218, #0a140a)',
                    border: '3px solid #ffd700',
                    borderRadius: '8px 8px 2px 2px',
                    boxShadow: '0 0 25px rgba(255,215,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px'
                }}>
                    <div style={{ width: '42px', height: '32px', background: '#000', border: '1px solid #ffd700', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        🃏
                    </div>
                    <div style={{ width: '40px', height: '14px', background: '#222', borderRadius: '3px' }} />
                </div>
            </div>

            {/* INTERACTIVE BUNKER CYBER DERBY MACHINE */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#/arcade/derby';
                }}
                style={{
                    position: 'absolute',
                    top: '32%',
                    right: '28%',
                    zIndex: 45,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    background: '#00ff66',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px #00ff66',
                    marginBottom: '4px',
                    animation: 'pulse 1.5s infinite'
                }}>
                    BRO DERBY
                </div>
                <div style={{
                    width: '60px',
                    height: '90px',
                    background: 'linear-gradient(145deg, #152515, #081208)',
                    border: '3px solid #00ff66',
                    borderRadius: '8px 8px 2px 2px',
                    boxShadow: '0 0 25px rgba(0,255,102,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px'
                }}>
                    <div style={{ width: '42px', height: '32px', background: '#000', border: '1px solid #00ff66', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        🏇
                    </div>
                    <div style={{ width: '40px', height: '14px', background: '#222', borderRadius: '3px' }} />
                </div>
            </div>

            {/* INTERACTIVE BUNKER ARCADE MACHINE (BACKGROUND OBJECT) */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#/arcade/plinko';
                }}
                style={{
                    position: 'absolute',
                    top: '32%',
                    right: '18%',
                    zIndex: 45,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    background: '#ff007f',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px #ff007f',
                    marginBottom: '4px',
                    animation: 'pulse 1.5s infinite'
                }}>
                    PLAY PLINKO
                </div>
                <div style={{
                    width: '60px',
                    height: '90px',
                    background: 'linear-gradient(145deg, #222, #111)',
                    border: '3px solid #00ffcc',
                    borderRadius: '8px 8px 2px 2px',
                    boxShadow: '0 0 25px rgba(0,255,204,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px'
                }}>
                    <div style={{ width: '42px', height: '32px', background: '#000', border: '1px solid #ff007f', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        🔮
                    </div>
                    <div style={{ width: '40px', height: '14px', background: '#333', borderRadius: '3px' }} />
                </div>
            </div>

            {/* INTERACTIVE BUNKER CYBER PINBALL MACHINE */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#/arcade/pinball';
                }}
                style={{
                    position: 'absolute',
                    top: '35%',
                    left: '10%',
                    zIndex: 45,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    background: 'linear-gradient(90deg, #ff007f, #00e5ff)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 12px #ff007f',
                    marginBottom: '4px',
                    animation: 'pulse 1.5s infinite'
                }}>
                    CYBER PINBALL
                </div>
                <div style={{
                    width: '64px',
                    height: '96px',
                    background: 'linear-gradient(145deg, #1f0b2e, #090014)',
                    border: '3px solid #ff007f',
                    borderRadius: '8px 8px 4px 4px',
                    boxShadow: '0 0 25px rgba(255,0,127,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px'
                }}>
                    <div style={{ width: '48px', height: '40px', background: '#000', border: '1px solid #00e5ff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                        ⚡
                    </div>
                    <div style={{ width: '46px', height: '12px', background: 'linear-gradient(90deg, #ff007f, #ffd700)', borderRadius: '3px' }} />
                </div>
            </div>

            {/* INTERACTIVE BUNKER CYBER CRASH STATION */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#/arcade/crash';
                }}
                style={{
                    position: 'absolute',
                    top: '55%',
                    left: '16%',
                    zIndex: 45,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    background: 'linear-gradient(90deg, #ff0055, #ffd700)',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 12px #ff0055',
                    marginBottom: '4px',
                    animation: 'pulse 1.5s infinite'
                }}>
                    CYBER CRASH
                </div>
                <div style={{
                    width: '64px',
                    height: '96px',
                    background: 'linear-gradient(145deg, #2b0b14, #080104)',
                    border: '3px solid #ff0055',
                    borderRadius: '8px 8px 4px 4px',
                    boxShadow: '0 0 25px rgba(255,0,85,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px'
                }}>
                    <div style={{ width: '48px', height: '40px', background: '#000', border: '1px solid #ffd700', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                        🚀
                    </div>
                    <div style={{ width: '46px', height: '12px', background: 'linear-gradient(90deg, #ff0055, #00e5ff)', borderRadius: '3px' }} />
                </div>
            </div>

            {/* Render Other Players */}
            {Object.values(players).map(p => renderPlayer(p, false))}
            
            {/* Render Me */}
            {renderPlayer(null, true)}

            {/* Action Bar */}
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

const actionBtnStyle = {
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

export default TheBunker;
