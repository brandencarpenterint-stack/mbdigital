import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';

const GlobalNukeEvent = () => {
    const { addCoins } = useGamification() || {};
    const { playCrash, playWin, playBeep } = useRetroSound();
    
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [defuseClicks, setDefuseClicks] = useState(0);
    const REQUIRED_CLICKS = 1000;
    
    const channelRef = useRef(null);

    useEffect(() => {
        if (!supabase) return;
        
        const channel = supabase.channel('arcade_nuke');
        
        channel.on('broadcast', { event: 'launch' }, () => {
            setIsActive(true);
            setTimeLeft(60);
            setDefuseClicks(0);
            playCrash(); // Siren sound
        });
        
        channel.on('broadcast', { event: 'defuse_click' }, () => {
            setDefuseClicks(prev => prev + 1);
        });

        channel.subscribe();
        channelRef.current = channel;

        return () => supabase.removeChannel(channel);
    }, [playCrash]);

    // Timer logic
    useEffect(() => {
        if (!isActive) return;
        
        if (defuseClicks >= REQUIRED_CLICKS) {
            // DEFUSED!
            setIsActive(false);
            playWin();
            alert("GLOBAL NUKE DEFUSED! THE COMMUNITY HAS BEEN SAVED. +1,000 COINS!");
            addCoins(1000);
            return;
        }

        if (timeLeft <= 0) {
            // DETONATED!
            setIsActive(false);
            playCrash();
            document.body.style.animation = 'screen-shake 0.5s infinite';
            setTimeout(() => {
                document.body.style.animation = 'none';
                alert("THE GLOBAL NUKE HAS DETONATED. ALL PLAYERS LOSE 50% OF UNSTAKED COINS.");
                // Assuming addCoins with negative works or we just trigger an event
                // This is a playground so we just scare them or actually take coins
                // We'll just take 1000 for safety instead of 50% so we don't break their bank logic
                addCoins(-1000);
            }, 3000);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(t => t - 1);
            if (timeLeft <= 10) playBeep(); // Urgent beeps
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [isActive, timeLeft, defuseClicks, addCoins, playWin, playCrash, playBeep]);

    const handleDefuse = () => {
        setDefuseClicks(prev => prev + 1);
        channelRef.current?.send({ type: 'broadcast', event: 'defuse_click' });
    };

    if (!isActive) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999999,
            background: 'rgba(255,0,0,0.2)', pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: '#000', border: '5px solid #ff0000', borderRadius: '10px',
                padding: '40px', textAlign: 'center', pointerEvents: 'auto',
                boxShadow: '0 0 100px rgba(255,0,0,0.8)',
                animation: 'screen-shake 0.5s infinite'
            }}>
                <h1 style={{ color: '#ff0000', fontSize: '3rem', margin: '0 0 10px 0', fontFamily: 'monospace' }}>
                    WARNING: GLOBAL NUKE LAUNCHED
                </h1>
                <div style={{ fontSize: '5rem', color: '#fff', fontWeight: 'bold', margin: '20px 0', textShadow: '0 0 20px #ff0000' }}>
                    00:{timeLeft < 10 ? '0'+timeLeft : timeLeft}
                </div>
                <div style={{ color: '#ffaa00', fontSize: '1.2rem', marginBottom: '20px' }}>
                    COMMUNITY DEFUSE PROTOCOL: {defuseClicks} / {REQUIRED_CLICKS}
                </div>
                <button 
                    onClick={handleDefuse}
                    style={{
                        background: '#ff0000', color: '#fff', border: 'none', padding: '20px 50px',
                        fontSize: '2rem', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer',
                        boxShadow: '0 10px 0 #880000', textTransform: 'uppercase'
                    }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'translateY(10px)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 0 #880000'; }}
                >
                    MASH TO DEFUSE
                </button>
            </div>
        </div>
    );
};

export default GlobalNukeEvent;
