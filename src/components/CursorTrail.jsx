import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const trailsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            // Spawn particles on move
            for (let i = 0; i < 2; i++) {
                trailsRef.current.push({
                    x: e.clientX + (Math.random() - 0.5) * 5,
                    y: e.clientY + (Math.random() - 0.5) * 5,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    color: `hsl(${performance.now() * 0.5 % 360}, 100%, 70%)`,
                    size: Math.random() * 4 + 1
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            trailsRef.current.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // Gravity
                p.life -= 0.02;

                if (p.life <= 0) {
                    trailsRef.current.splice(i, 1);
                    return;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                // Draw pixel
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: 0.7
            }}
        />
    );
};

export default CursorTrail;
