import React, { useState, useEffect, useRef } from 'react';
import TiltCard from './TiltCard';
import useRetroSound from '../hooks/useRetroSound';
import { supabase } from '../lib/supabaseClient';

const TheButton = () => {
    const [globalClicks, setGlobalClicks] = useState(0);
    const [myClicks, setMyClicks] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const { playClick, playError } = useRetroSound();
    
    // Batch updates to reduce network requests
    const clickBuffer = useRef(0);
    const lastUpdateTime = useRef(Date.now());

    // Fetch initial count
    useEffect(() => {
        const fetchClicks = async () => {
            try {
                const { data, error } = await supabase
                    .from('global_stats')
                    .select('value')
                    .eq('key', 'the_button_clicks')
                    .single();
                
                if (data) {
                    setGlobalClicks(parseInt(data.value, 10));
                } else if (error && error.code === 'PGRST116') {
                    // Row doesn't exist, try to create it
                    await supabase.from('global_stats').insert({ key: 'the_button_clicks', value: '0' });
                }
            } catch (err) {
                console.error("Failed to fetch button clicks", err);
            }
        };
        fetchClicks();

        // Optional: Realtime subscription (if Supabase is configured for it)
        const channel = supabase.channel('the_button')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_stats', filter: "key=eq.the_button_clicks" }, payload => {
                setGlobalClicks(parseInt(payload.new.value, 10));
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // Sync buffer to DB every 2 seconds if there are clicks
    useEffect(() => {
        const syncInterval = setInterval(async () => {
            if (clickBuffer.current > 0) {
                const clicksToSync = clickBuffer.current;
                clickBuffer.current = 0; // Reset buffer optimistically
                
                try {
                    // Call RPC function to atomic increment (best practice)
                    // If RPC doesn't exist, fallback to read-modify-write (less safe but works for now)
                    const { data, error } = await supabase.rpc('increment_button_clicks', { amount: clicksToSync });
                    
                    if (error) {
                        // Fallback logic if RPC isn't set up
                        const { data: currentData } = await supabase.from('global_stats').select('value').eq('key', 'the_button_clicks').single();
                        if (currentData) {
                            const newTotal = parseInt(currentData.value, 10) + clicksToSync;
                            await supabase.from('global_stats').update({ value: newTotal.toString() }).eq('key', 'the_button_clicks');
                            // Only set locally if realtime is disabled
                            // setGlobalClicks(newTotal); 
                        }
                    }
                } catch (err) {
                    console.error("Sync failed", err);
                    // Add back to buffer on failure
                    clickBuffer.current += clicksToSync;
                }
            }
        }, 2000);

        return () => clearInterval(syncInterval);
    }, []);

    const handlePress = () => {
        setIsPressed(true);
        playClick();
        if (navigator.vibrate) navigator.vibrate(20);
        
        // Optimistic UI updates
        setMyClicks(prev => prev + 1);
        setGlobalClicks(prev => prev + 1);
        clickBuffer.current += 1;
    };

    const handleRelease = () => {
        setIsPressed(false);
    };

    return (
        <TiltCard className="bento-card" style={{ 
            background: 'linear-gradient(135deg, #1a0000, #330000)', 
            border: '2px solid #ff0000',
            color: 'white',
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Warning Tape Border */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '10px',
                background: 'repeating-linear-gradient(45deg, #ffe600, #ffe600 10px, #000 10px, #000 20px)'
            }} />
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '10px',
                background: 'repeating-linear-gradient(45deg, #ffe600, #ffe600 10px, #000 10px, #000 20px)'
            }} />

            <div style={{ transform: 'translateZ(30px)', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#ff6666', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px' }}>
                    DO NOT PRESS
                </div>

                <div 
                    onMouseDown={handlePress}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
                    onTouchEnd={handleRelease}
                    style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        margin: '0 auto',
                        borderRadius: '50%',
                        background: isPressed ? '#aa0000' : '#ff0000',
                        boxShadow: isPressed 
                            ? 'inset 0 10px 20px rgba(0,0,0,0.8), 0 0 10px #ff0000' 
                            : 'inset 0 10px 20px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.5), 0 10px 30px rgba(255,0,0,0.6)',
                        border: '4px solid #cc0000',
                        cursor: 'pointer',
                        transform: isPressed ? 'scale(0.95) translateY(5px)' : 'scale(1)',
                        transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), background 0.1s, box-shadow 0.1s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                        WebkitTapHighlightColor: 'transparent'
                    }}
                >
                    <div style={{
                        width: '80%', height: '80%', borderRadius: '50%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                        position: 'absolute', top: '5%', pointerEvents: 'none',
                        opacity: isPressed ? 0.3 : 1
                    }} />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div style={{ fontFamily: '"Courier New", monospace', fontSize: '1.5rem', fontWeight: 'bold', color: '#ff3333', textShadow: '0 0 10px #ff0000' }}>
                        {globalClicks.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '5px' }}>GLOBAL CLICKS ({myClicks} YOURS)</div>
                </div>
            </div>
            
            <style>{`
                @keyframes pulseDanger {
                    0% { box-shadow: inset 0 0 0 rgba(255,0,0,0); }
                    50% { box-shadow: inset 0 0 20px rgba(255,0,0,0.3); }
                    100% { box-shadow: inset 0 0 0 rgba(255,0,0,0); }
                }
            `}</style>
        </TiltCard>
    );
};

export default TheButton;
