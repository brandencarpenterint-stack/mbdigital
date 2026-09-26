import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

const SingularityEvent = () => {
    const { addCoins } = useGamification() || {};
    const { playPowerUp, playCrash } = useRetroSound();
    
    const [isActive, setIsActive] = useState(false);
    const [fakeCursors, setFakeCursors] = useState([]);
    
    useEffect(() => {
        if (!supabase) return;
        
        const channel = supabase.channel('arcade_singularity');
        
        channel.on('broadcast', { event: '33x' }, () => {
            setIsActive(true);
            playPowerUp();
            setTimeout(() => playCrash(), 1000);
            
            // Visual Chaos
            document.body.style.animation = 'screen-shake 0.1s infinite';
            document.body.style.filter = 'hue-rotate(90deg) contrast(1.5)';
            
            // Generate 33 fake cursors
            const cursors = Array.from({ length: 33 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                name: 'GHOST_' + i
            }));
            setFakeCursors(cursors);

            // Give massive fake payout
            addCoins(33333);

            // End event after 10 seconds
            setTimeout(() => {
                setIsActive(false);
                setFakeCursors([]);
                document.body.style.animation = 'none';
                document.body.style.filter = 'none';
            }, 10000);
        });

        channel.subscribe();
        return () => supabase.removeChannel(channel);
    }, [playPowerUp, playCrash, addCoins]);

    // Move fake cursors
    useEffect(() => {
        if (!isActive) return;
        
        const interval = setInterval(() => {
            setFakeCursors(prev => prev.map(c => ({
                ...c,
                x: Math.max(0, Math.min(100, c.x + (Math.random() - 0.5) * 20)),
                y: Math.max(0, Math.min(100, c.y + (Math.random() - 0.5) * 20))
            })));
        }, 100);
        
        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999999, overflow: 'hidden' }}>
            {/* OVERLAY */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, transparent 50%, rgba(255,0,0,0.5) 100%)',
                mixBlendMode: 'screen'
            }} />
            
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                fontFamily: '"Press Start 2P", monospace', fontSize: '8rem', color: '#fff',
                textShadow: '0 0 50px #ff00ff, 0 0 100px #00ffcc',
                animation: 'pulse 0.5s infinite alternate'
            }}>
                33X
            </div>

            {/* GHOST CURSORS */}
            {fakeCursors.map(c => (
                <div 
                    key={c.id}
                    style={{
                        position: 'absolute',
                        left: `${c.x}vw`,
                        top: `${c.y}vh`,
                        transition: 'all 0.1s linear',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transform: 'translate(-5px, -5px) scale(1.5)'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 10px ${c.color})` }}>
                        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86c-.31-.31-.85-.09-.85.35z" fill={c.color} stroke="#fff" strokeWidth="1.5" />
                    </svg>
                    <div style={{
                        background: c.color, color: '#000', fontSize: '0.6rem', fontWeight: 'bold',
                        padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace',
                        marginTop: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'
                    }}>
                        {c.name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SingularityEvent;
