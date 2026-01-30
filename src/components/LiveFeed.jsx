import React, { useState, useEffect } from 'react';
import { feedService } from '../utils/feed';

const FAKE_USERS = [
    'NeonViper', 'CyberWolf', 'PixelQueen', 'RetroRider',
    'GlitchBoy', 'ArcadeHero', 'BitMaster', 'HighScorer99',
    'LaserFace', 'TurboCat', 'ShadowMonk', 'CosmicSurfer'
];

const EVENTS = [
    { text: 'just won 500 🪙 in Cosmic Slots!', type: 'win' },
    { text: 'hit the JACKPOT! 🎰🚨', type: 'jackpot' },
    { text: 'reached Level 10 in Neon Bricks 🧱', type: 'level' },
    { text: 'caught a Legendary Shark! 🦈', type: 'fish' },
    { text: 'bought the Flame Paddle 🔥', type: 'shop' },
    { text: 'is on a 10x Win Streak!', type: 'streak' },
    { text: 'just lost all their lives... 💀', type: 'fail' },
    { text: 'found a Secret Chest! 🎁', type: 'loot' },
    { text: 'set a new High Score in Snake! 🐍', type: 'score' }
];

const LiveFeed = () => {
    const [messages, setMessages] = useState([
        { id: 1, user: 'System', text: 'Welcome to the Global Arcade Network.', time: 'Now', color: '#fff' }
    ]);

    useEffect(() => {
        // 1. Listen for REAL events
        const handleRealEvent = (e) => {
            const { message, type } = e.detail;
            const newMessage = {
                id: Date.now(),
                user: 'YOU', // Or fetch from Context if possible, but keep it simple
                text: message,
                time: 'Just now',
                color: '#00ffaa' // Highlight User Actions
            };
            setMessages(prev => [newMessage, ...prev].slice(0, 5));
        };

        feedService.addEventListener('feed-message', handleRealEvent);

        // 2. Simulated "Global" Traffic
        const addMessage = () => {
            const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
            const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];

            let color = '#aaa';
            if (event.type === 'win') color = 'gold';
            if (event.type === 'jackpot') color = '#ff00ff';
            if (event.type === 'fail') color = '#ff4444';
            if (event.type === 'fish') color = '#00ccff';

            const newMessage = {
                id: Date.now(),
                user,
                text: event.text,
                time: 'Just now',
                color
            };

            setMessages(prev => [newMessage, ...prev].slice(0, 5)); // Keep last 5
        };

        // Random interval between 2s and 6s
        const loop = () => {
            const delay = Math.random() * 4000 + 4000; // Slower traffic
            setTimeout(() => {
                addMessage();
                loop();
            }, delay);
        };

        loop();

        return () => {
            feedService.removeEventListener('feed-message', handleRealEvent);
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
                {messages.map((msg, i) => (
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
