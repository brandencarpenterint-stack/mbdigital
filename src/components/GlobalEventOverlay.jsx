import React, { useRef, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useTime } from '../context/TimeContext';

const GlobalEventOverlay = () => {
    const { currentEvent } = useGamification() || {};
    const { isNight } = useTime() || { isNight: false };
    const canvasRef = useRef(null);

    // Determine active mode
    const activeMode = currentEvent ? currentEvent.id : (isNight ? 'NIGHT_MODE' : null);

    if ((!currentEvent && !isNight) || currentEvent?.id === 'VOID_CALM') return null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize Handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // PARTICLE SYSTEM
        let particles = [];

        const createParticle = () => {
            const w = canvas.width;
            const h = canvas.height;

            if (currentEvent.id === 'METEOR_SHOWER') {
                return {
                    x: Math.random() * w + (w * 0.5), // Start mostly right/top
                    y: Math.random() * -h, // Start above
                    vx: -5 - Math.random() * 5,
                    vy: 5 + Math.random() * 5,
                    size: 1 + Math.random() * 2,
                    length: 20 + Math.random() * 50,
                    alpha: 1,
                    color: '#ffaa00'
                };
            }
            if (currentEvent.id === 'NEON_RAIN') {
                return {
                    x: Math.random() * w,
                    y: -10,
                    vx: 0,
                    vy: 5 + Math.random() * 5,
                    size: 1,
                    length: 10 + Math.random() * 10,
                    alpha: 0.5 + Math.random() * 0.5,
                    color: '#ff00ff'
                };
            }
            if (activeMode === 'GOLD_RUSH') {
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -1 - Math.random(), // Float up
                    size: Math.random() * 3,
                    alpha: Math.random(),
                    life: 100,
                    color: '#FFD700'
                };
            }
            if (activeMode === 'NIGHT_MODE') {
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.2, // Very slow
                    vy: (Math.random() - 0.5) * 0.2,
                    size: 1 + Math.random() * 2,
                    alpha: Math.random() * 0.5 + 0.2, // Faint
                    life: Math.random() * 100, // Pulse tracking
                    color: '#00ffff' // Cyan fireflies
                };
            }
            return null;
        };

        // INITIAL POPULATION
        for (let i = 0; i < 50; i++) {
            const p = createParticle();
            if (p) {
                p.y = Math.random() * canvas.height; // Scatter initially
                particles.push(p);
            }
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // SPAWNER
            if (particles.length < 100) {
                if (Math.random() < 0.1) { // Spawn rate
                    const p = createParticle();
                    if (p) particles.push(p);
                }
            }

            // UPDATE & DRAW
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                p.x += p.vx;
                p.y += p.vy;

                // WRAP / KILL logic
                if (activeMode === 'METEOR_SHOWER') {
                    // Draw Tail
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 170, 0, ${p.alpha})`;
                    ctx.lineWidth = p.size;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5); // Trail opposite to velocity? Wait. 
                    // Velocity is (-x, +y). Trail should be (+x, -y).
                    // Actually simple line:
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.length, p.y - p.length); // Diagonal hack
                    ctx.stroke();

                    // Kill
                    if (p.x < -100 || p.y > canvas.height + 100) {
                        particles[i] = createParticle();
                    }
                }
                else if (activeMode === 'NEON_RAIN') {
                    ctx.fillStyle = `rgba(255, 0, 255, ${p.alpha})`;
                    ctx.fillRect(p.x, p.y, p.size, p.length);

                    if (p.y > canvas.height) particles[i] = createParticle();
                }
                else if (activeMode === 'GOLD_RUSH') {
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    p.alpha -= 0.01;
                    if (p.alpha <= 0) particles[i] = createParticle();
                }
                else if (activeMode === 'NIGHT_MODE') {
                    ctx.beginPath();
                    // Pulse
                    const pulse = (Math.sin(Date.now() / 500 + i) + 1) / 2;
                    const curAlpha = p.alpha * pulse;

                    ctx.fillStyle = `rgba(0, 255, 255, ${curAlpha})`;
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'cyan';
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                }
            });

            // GLITCH STORM (Non-particle, usually)
            if (activeMode === 'GLITCH_STORM') {
                if (Math.random() > 0.95) {
                    const h = Math.random() * 50;
                    const y = Math.random() * canvas.height;
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                    ctx.fillRect(0, y, canvas.width, h);

                    // Text Glitch
                    ctx.fillStyle = '#0f0';
                    ctx.font = '20px monospace';
                    ctx.fillText('010101 ERROR', Math.random() * canvas.width, y + 20);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentEvent, activeMode]);

    return (
        <div style={{
            position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000
        }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

            {/* FORCE MESSAGE */}
            {currentEvent && (
                <div style={{
                    position: 'absolute', top: 10, width: '100%', textAlign: 'center',
                    color: currentEvent.color,
                    textShadow: `0 0 10px ${currentEvent.color}`,
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: '0.8rem',
                    opacity: 0.8
                }}>
                    ⚠ GLOBAL EVENT: {currentEvent.name.toUpperCase()} ⚠
                </div>
            )}
        </div>
    );
};

export default GlobalEventOverlay;
