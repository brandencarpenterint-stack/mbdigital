import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import ChatMessage from './ChatMessage';

const MOCK_BOTS = [
    { name: 'NullPtr', squad: 'CYBER', avatar: '/assets/avatar_robot.png' },
    { name: 'SunGazer', squad: 'SOLAR', avatar: '/assets/avatar_alien.png' },
    { name: 'GhostInShell', squad: 'VOID', avatar: '/assets/avatar_ghost.png' },
    { name: 'BitWise', squad: 'CYBER', avatar: '/assets/merchboy_face.png' },
    { name: 'GlitchKing', squad: 'CYBER', avatar: '/assets/merchboy_face.png' }
];

const BOT_MESSAGES = [
    "Just hit a new high score in Snake! 🐍",
    "Buying Golden Koi 500c PM me",
    "Anyone up for Arena PvP? My squad needs XP.",
    "The new shop skins are fire 🔥",
    "Void squad is taking over the leaderboard...",
    "System update detected...",
    "GGs everyone",
    "Where is the secret level?",
    "Need one more friend for the quest!",
    "LFG Arena",
    "lol saw that",
    "Solar squad superior confirmed ☀️",
    "Cyber squad rise up 🤖"
];

const SocialSidebar = () => {
    const { userProfile, setViewedProfile, coins, updateStat } = useGamification();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('CHAT'); // CHAT | RADAR

    // --- RADAR STATE ---
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loadingRadar, setLoadingRadar] = useState(false);

    // --- CHAT STATE ---
    const [messages, setMessages] = useState([
        { id: 1, user: 'SYSTEM', text: 'CONNECTION ESTABLISHED TO THE VOID.', type: 'system', timestamp: Date.now() }
    ]);
    const [inputText, setInputText] = useState("");
    const chatEndRef = useRef(null);

    // --- CHAT EFFECT: SCROLL TO BOTTOM ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen, activeTab]);

    // --- CHAT EFFECT: SIMULATE BOTS ---
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to skip tick
                return;
            }

            const bot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
            const msg = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];

            addMessage({
                user: bot.name,
                squad: bot.squad,
                avatar: bot.avatar,
                text: msg,
                type: 'chat'
            });
        }, 5000); // Check every 5s

        return () => clearInterval(interval);
    }, []);

    const addMessage = (msg) => {
        setMessages(prev => {
            const next = [...prev, { ...msg, id: Date.now() + Math.random(), timestamp: Date.now() }];
            if (next.length > 50) next.shift(); // Keep last 50
            return next;
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        addMessage({
            user: userProfile.name || 'GUEST',
            squad: userProfile.squad,
            avatar: userProfile.avatar,
            text: inputText.trim(),
            type: 'chat',
            isMe: true
        });

        setInputText("");
    };

    // --- POLL ONLINE USERS ---
    useEffect(() => {
        if (!isOpen || activeTab !== 'RADAR') return;

        const fetchOnlineUsers = async () => {
            // ... existing polling logic ...
            // For brevity, using mock/real hybrid in single block
            setLoadingRadar(true);
            try {
                let realUsers = [];
                if (supabase) {
                    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
                    const { data } = await supabase.from('profiles')
                        .select('id, display_name, avatar_url, squad, coins')
                        .gt('last_seen', fiveMinsAgo)
                        .neq('display_name', userProfile?.name)
                        .limit(20);
                    if (data) realUsers = data;
                }

                // Merge with Bots if empty to make world feel alive
                if (realUsers.length < 5) {
                    realUsers = [...realUsers, ...MOCK_BOTS.map((b, i) => ({
                        id: `bot-${i}`,
                        display_name: b.name,
                        avatar_url: b.avatar,
                        squad: b.squad,
                        coins: Math.floor(Math.random() * 50000),
                        isBot: true
                    }))];
                }

                setOnlineUsers(realUsers);
            } catch (e) { console.error(e); }
            setLoadingRadar(false);
        };

        fetchOnlineUsers();
        // No interval needed for this demo, just refresh on tab switch
    }, [isOpen, activeTab]);

    return (
        <>
            {/* TOGGLE BUTTON */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed', top: '80px', right: '0', zIndex: 998,
                        background: 'rgba(0,0,0,0.8)', border: '1px solid var(--neon-blue)', borderRight: 'none',
                        borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',
                        padding: '10px 15px', color: 'var(--neon-blue)', cursor: 'pointer',
                        backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '-5px 0 15px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ width: '10px', height: '10px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 5px #00ff00' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>THE VOID</span>
                </button>
            )}

            {/* SIDEBAR */}
            <div style={{
                position: 'fixed', top: '60px', right: isOpen ? '0' : '-350px',
                width: '320px', height: 'calc(100vh - 60px - 70px)',
                background: 'rgba(5, 5, 10, 0.95)', backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 999,
                transition: 'right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: isOpen ? '-10px 0 50px rgba(0,0,0,0.8)' : 'none'
            }}>
                {/* HEAD TABS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                    <button
                        onClick={() => setActiveTab('CHAT')}
                        style={{ flex: 1, padding: '15px', background: activeTab === 'CHAT' ? 'rgba(255,255,255,0.05)' : 'transparent', border: 'none', color: activeTab === 'CHAT' ? '#fff' : '#666', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        💬 CHAT
                    </button>
                    <button
                        onClick={() => setActiveTab('RADAR')}
                        style={{ flex: 1, padding: '15px', background: activeTab === 'RADAR' ? 'rgba(255,255,255,0.05)' : 'transparent', border: 'none', color: activeTab === 'RADAR' ? '#fff' : '#666', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        📡 RADAR ({onlineUsers.length})
                    </button>
                    <button onClick={() => setIsOpen(false)} style={{ padding: '0 15px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>

                {/* CONTENT AREA */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                    {/* --- CHAT TAB --- */}
                    {activeTab === 'CHAT' && (
                        <div style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {messages.map(msg => (
                                <ChatMessage key={msg.id} msg={msg} />
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                    )}

                    {/* --- RADAR TAB --- */}
                    {activeTab === 'RADAR' && (
                        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {onlineUsers.map(user => (
                                <div key={user.id} onClick={() => {
                                    if (user.isBot && window.confirm(`Challenge ${user.display_name} to a duel?`)) {
                                        if (Math.random() > 0.5) {
                                            showToast(`VICTORY! You defeated ${user.display_name}!`, 'win');
                                            if (updateStat) updateStat('rivalsDefeated', (prev) => (prev || 0) + 1);
                                        } else {
                                            showToast("DEFEAT! They were too fast.", 'error');
                                        }
                                    } else {
                                        setViewedProfile({ name: user.display_name, avatar: user.avatar_url, squad: user.squad });
                                    }
                                }} style={{
                                    display: 'flex', gap: '10px', alignItems: 'center', padding: '10px',
                                    background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer'
                                }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={user.avatar_url || '/assets/merchboy_face.png'} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                        {user.isBot && <div style={{ position: 'absolute', bottom: -2, right: -2, width: '8px', height: '8px', background: 'red', borderRadius: '50%', border: '1px solid black' }} title="Hostile" />}
                                    </div>
                                    <div>
                                        <div style={{ color: '#fff', fontSize: '0.9rem' }}>{user.display_name}</div>
                                        <div style={{ color: '#666', fontSize: '0.7rem' }}>{user.squad || 'FREELANCER'}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>⚔️</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* INPUT AREA (CHAT ONLY) */}
                {activeTab === 'CHAT' && (
                    <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
                        <input
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Broadcast to void..."
                            style={{
                                flex: 1, background: '#111', border: '1px solid #333', borderRadius: '4px',
                                padding: '10px', color: 'white', fontFamily: 'inherit'
                            }}
                        />
                        <button type="submit" style={{ background: 'var(--neon-blue)', border: 'none', borderRadius: '4px', color: 'black', fontWeight: 'bold', cursor: 'pointer', padding: '0 15px' }}>SEND</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default SocialSidebar;
