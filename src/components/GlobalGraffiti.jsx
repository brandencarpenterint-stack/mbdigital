import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../config/supabaseClient';

const COLORS = ['#ff00ff', '#00ffcc', '#ffff00', '#00ff00', '#ff0055'];

const GlobalGraffiti = () => {
    const canvasRef = useRef(null);
    const channelRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Choose random color for this user's spray can
    const myColor = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!supabase) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to cover whole screen
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 10;
        };
        resize();
        window.addEventListener('resize', resize);

        const channel = supabase.channel('arcade_graffiti', { config: { broadcast: { ack: false } } });
        
        channel.on('broadcast', { event: 'draw' }, (payload) => {
            const { x0, y0, x1, y1, color } = payload.payload;
            
            // Draw remote line
            ctx.beginPath();
            ctx.moveTo(x0 * canvas.width, y0 * canvas.height);
            ctx.lineTo(x1 * canvas.width, y1 * canvas.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.closePath();
        }).subscribe();

        channelRef.current = channel;

        // Auto-fade graffiti over time so it doesn't become a mess
        const fader = setInterval(() => {
            ctx.fillStyle = 'rgba(0,0,0,0.02)'; // Fade out
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 100);

        return () => {
            window.removeEventListener('resize', resize);
            supabase.removeChannel(channel);
            clearInterval(fader);
        };
    }, []);

    const startDrawing = (e) => {
        if (!e.shiftKey) return; // Only draw if holding shift
        setIsDrawing(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const draw = (e) => {
        if (!isDrawing || !e.shiftKey) {
            setIsDrawing(false);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = e.clientX;
        const y = e.clientY;

        // Draw locally immediately
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = myColor.current;
        ctx.lineWidth = 5;
        ctx.shadowColor = myColor.current;
        ctx.stroke();
        ctx.closePath();

        // Broadcast percentages so it scales
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'draw',
                payload: {
                    x0: lastPos.current.x / canvas.width,
                    y0: lastPos.current.y / canvas.height,
                    x1: x / canvas.width,
                    y1: y / canvas.height,
                    color: myColor.current
                }
            }).catch(() => {});
        }

        lastPos.current = { x, y };
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    useEffect(() => {
        window.addEventListener('mousedown', startDrawing);
        window.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        window.addEventListener('mouseleave', stopDrawing);

        return () => {
            window.removeEventListener('mousedown', startDrawing);
            window.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stopDrawing);
            window.removeEventListener('mouseleave', stopDrawing);
        };
    }, [isDrawing]);

    return (
        <>
            <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999998, 
                    opacity: 0.8, mixBlendMode: 'screen' 
                }} 
            />
            {/* Tooltip hint */}
            <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 99999999, fontFamily: 'monospace' }}>
                HOLD [SHIFT] TO SPRAY PAINT
            </div>
        </>
    );
};

export default GlobalGraffiti;
