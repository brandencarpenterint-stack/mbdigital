import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

const GlobalRaidBoss = () => {
    const { addCoins } = useGamification() || {};
    const { playCrash, playWin, playClick, playBeep } = useRetroSound();
    
    const [isActive, setIsActive] = useState(false);
    const [hp, setHp] = useState(1000);
    const MAX_HP = 1000;
    
    const channelRef = useRef(null);

    useEffect(() => {
        if (!supabase) return;
        
        const channel = supabase.channel('arcade_boss');
        
        channel.on('broadcast', { event: 'spawn' }, () => {
            setIsActive(true);
            setHp(MAX_HP);
            playCrash(); 
        });
        
        channel.on('broadcast', { event: 'damage' }, (payload) => {
            setHp(prev => {
                const newHp = prev - (payload.payload.amount || 1);
                if (newHp <= 0 && prev > 0) {
                    // BOSS DEFEATED
                    setIsActive(false);
                    playWin();
                    addCoins(5000);
                    alert("THE VOID TERROR HAS BEEN DEFEATED! EVERYONE GETS 5,000 COINS!");
                    import('../utils/confetti').then(m => m.triggerConfetti());
                }
                return newHp;
            });
            if (Math.random() > 0.8) playClick();
        });

        channel.subscribe();
        channelRef.current = channel;

        return () => supabase.removeChannel(channel);
    }, [playCrash, playWin, playClick, addCoins]);

    const handleDamage = () => {
        if (hp <= 0) return;
        
        // Optimistic update
        setHp(prev => prev - 1);
        addCoins(10); // Small reward per click
        playBeep();
        
        // Jiggle effect
        const eye = document.getElementById('boss-eye');
        if (eye) {
            eye.style.transform = `scale(0.9) translate(${(Math.random()-0.5)*20}px, ${(Math.random()-0.5)*20}px)`;
            setTimeout(() => eye.style.transform = 'scale(1)', 50);
        }
        
        // Broadcast
        channelRef.current?.send({ type: 'broadcast', event: 'damage', payload: { amount: 1 } });
    };

    if (!isActive || hp <= 0) return null;

    const hpPercent = (hp / MAX_HP) * 100;

    return (
        <div style={{
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 99999999, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            {/* The Boss Container */}
            <div 
                id="boss-eye"
                onClick={handleDamage}
                style={{
                    pointerEvents: 'auto', cursor: 'crosshair',
                    background: 'radial-gradient(circle, #ff00ff 0%, #000 70%)',
                    width: '150px', height: '150px', borderRadius: '50%',
                    border: '5px solid #00ffcc',
                    boxShadow: '0 0 50px rgba(255,0,255,0.8), inset 0 0 50px rgba(0,0,0,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite, pulseDanger 2s infinite',
                    transition: 'transform 0.1s',
                    position: 'relative', overflow: 'hidden'
                }}
            >
                {/* The Pupil */}
                <div style={{
                    width: '30px', height: '80px', background: '#00ffcc', borderRadius: '50%',
                    boxShadow: '0 0 20px #00ffcc',
                    animation: 'blink 4s infinite'
                }} />
                
                {/* Veins */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-radial-gradient(transparent, transparent 10px, rgba(255,0,0,0.3) 12px)', opacity: 0.5 }} />
            </div>

            {/* HP Bar */}
            <div style={{
                marginTop: '20px', width: '300px', height: '20px', background: '#000',
                border: '2px solid #ff00ff', borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 0 15px rgba(255,0,255,0.5)'
            }}>
                <div style={{
                    width: `${hpPercent}%`, height: '100%', background: hpPercent > 20 ? '#00ffcc' : '#ff0000',
                    transition: 'width 0.1s linear, background 0.3s'
                }} />
            </div>
            <div style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '5px', textShadow: '0 0 5px #00ffcc' }}>
                VOID TERROR HP: {hp} / {MAX_HP}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes blink {
                    0%, 96%, 100% { transform: scaleY(1); }
                    98% { transform: scaleY(0.1); }
                }
            `}</style>
        </div>
    );
};

export default GlobalRaidBoss;
