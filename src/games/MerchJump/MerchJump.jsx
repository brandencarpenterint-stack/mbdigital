import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import SquishyButton from '../../components/SquishyButton';
import useRetroSound from '../../hooks/useRetroSound';
import { feedService } from '../../utils/feed';

const MerchJump = () => {
    const canvasRef = useRef(null);
    const { playJump, playCollect, playCrash, playBoop } = useRetroSound();

    // Game Constants
    const GRAVITY = 0.4;
    const JUMP_FORCE = -12; // Higher jump for jetpack feel
    const WIDTH = 400;
    const HEIGHT = 600;

    // Assets
    const SKINS = [
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png?t=v2', hoodie: '#111' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2', hoodie: '#593a28' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2', hoodie: '#7cb9e8' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2', hoodie: '#333' },
    ];

    // State
    const [gameState, setGameState] = useState('MENU');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('merchJumpHighScore')) || 0);
    const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

    // Refs
    const playerRef = useRef({ x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 40, height: 60 });
    const platformsRef = useRef([]);
    const cameraYRef = useRef(0);
    const scoreRef = useRef(0);
    const requestRef = useRef(null);
    const inputRef = useRef(WIDTH / 2);
    const skinImgRef = useRef(null);

    // Initial Setup
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = selectedSkin.src;
        skinImgRef.current = img;
        return () => cancelAnimationFrame(requestRef.current);
    }, [selectedSkin]);

    const initGame = () => {
        setScore(0);
        scoreRef.current = 0;
        cameraYRef.current = 0;
        playerRef.current = { x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 40, height: 60 };

        platformsRef.current = [];
        platformsRef.current.push({ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, h: 20, type: 'normal' });

        let y = HEIGHT - 200;
        for (let i = 0; i < 15; i++) {
            generatePlatform(y);
            y -= 80 + Math.random() * 40;
        }

        setGameState('PLAYING');
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const generatePlatform = (y) => {
        const x = Math.random() * (WIDTH - 80);
        platformsRef.current.push({
            x, y, w: 70 + Math.random() * 30, h: 15,
            type: Math.random() > 0.8 ? 'moving' : 'normal',
            vx: Math.random() > 0.5 ? 2 : -2,
            color: '#888' // Concrete
        });
    };

    const drawRig = (ctx, x, y, vy, tilt) => {
        const time = performance.now() * 0.01;

        ctx.save();
        ctx.translate(x, y);

        // Tilt Body
        ctx.rotate(tilt * 0.2);

        // 1. JETPACK (Behind)
        ctx.fillStyle = '#ccc';
        ctx.fillRect(-15, -10, 10, 30); // Left Tank
        ctx.fillRect(5, -10, 10, 30);  // Right Tank

        // Jetpack Flame (Only if jumping up)
        if (vy < 0) {
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.moveTo(-10, 20);
            ctx.lineTo(-5, 35 + Math.random() * 10);
            ctx.lineTo(0, 20);
            ctx.moveTo(10, 20);
            ctx.lineTo(15, 35 + Math.random() * 10);
            ctx.lineTo(5, 20);
            ctx.fill();
        }

        // 2. LEGS
        ctx.fillStyle = '#222'; // Black Jeans
        // Leg Animation
        const legLeftY = vy < 0 ? 30 : 30 + Math.abs(Math.sin(time) * 5);
        const legRightY = vy < 0 ? 30 + 5 : 30 + Math.abs(Math.cos(time) * 5);

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(-10, 20);
        ctx.quadraticCurveTo(-15, 25, -12, legLeftY);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#222';
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(10, 20);
        ctx.quadraticCurveTo(15, 25, 12, legRightY);
        ctx.stroke();

        // Shoes
        ctx.fillStyle = 'white';
        ctx.fillRect(-16, legLeftY, 8, 5);
        ctx.fillRect(8, legRightY, 8, 5);

        // 3. BODY (Hoodie)
        ctx.fillStyle = selectedSkin.hoodie || '#111';
        ctx.beginPath();
        ctx.roundRect(-20, 0, 40, 35, 10);
        ctx.fill();

        // Hoodie Logo?
        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.fillText('M', -5, 20);

        // 4. ARMS
        ctx.strokeStyle = selectedSkin.hoodie || '#111';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        // Arm Animation
        const armAngle = vy < 0 ? Math.PI + 0.5 : Math.PI - 0.5 + Math.sin(time) * 0.5;

        // Left Arm
        ctx.beginPath();
        ctx.moveTo(-18, 5);
        ctx.lineTo(-30, vy < 0 ? -10 : 15);
        ctx.stroke();

        // Right Arm
        ctx.beginPath();
        ctx.moveTo(18, 5);
        ctx.lineTo(30, vy < 0 ? -10 : 15);
        ctx.stroke();

        // 5. HEAD (The Face Asset)
        if (skinImgRef.current && skinImgRef.current.complete) {
            const size = 50;
            ctx.drawImage(skinImgRef.current, -size / 2, -size / 2 - 15, size, size);
        } else {
            // Fallback Head
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(0, -20, 20, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    };

    const gameLoop = () => {
        const ctx = canvasRef.current.getContext('2d');
        const player = playerRef.current;

        // --- UPDATE ---
        const targetX = inputRef.current;
        player.x += (targetX - player.x) * 0.15;

        // Wrap
        if (player.x < -20) player.x = WIDTH + 20;
        if (player.x > WIDTH + 20) player.x = -20;

        player.vy += GRAVITY;
        player.y += player.vy;

        // Scroll
        if (player.y < HEIGHT / 2) {
            const shift = HEIGHT / 2 - player.y;
            player.y = HEIGHT / 2;
            cameraYRef.current += shift;
            scoreRef.current += Math.floor(shift);
            setScore(scoreRef.current);
            platformsRef.current.forEach(p => p.y += shift);
            platformsRef.current = platformsRef.current.filter(p => p.y < HEIGHT);
            const lastP = platformsRef.current[platformsRef.current.length - 1];
            if (lastP && lastP.y > 100) {
                generatePlatform(lastP.y - (80 + Math.random() * 40));
            }
        }

        // Collision
        if (player.vy > 0) {
            platformsRef.current.forEach(p => {
                if (
                    player.x > p.x - 20 &&
                    player.x < p.x + p.w + 20 && // Widen hitbox for body
                    player.y + 30 > p.y && // Feet level estimate
                    player.y + 30 < p.y + p.h + 20
                ) {
                    player.vy = JUMP_FORCE;
                    playJump();
                }
            });
        }

        // Platform Move
        platformsRef.current.forEach(p => {
            if (p.type === 'moving') {
                p.x += p.vx;
                if (p.x <= 0 || p.x + p.w >= WIDTH) p.vx *= -1;
            }
        });

        if (player.y > HEIGHT) {
            handleGameOver();
            return;
        }

        // --- DRAW ---
        // Sky Background
        const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, '#87CEEB'); // Sky Blue
        grad.addColorStop(1, '#E0F7FA'); // Light Clouds
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Clouds (Simple Aesthetic)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 5; i++) {
            const cx = ((i * 100) + cameraYRef.current * 0.5) % (WIDTH + 200) - 100;
            const cy = (i * 150) % HEIGHT;
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI * 2);
            ctx.arc(cx + 40, cy + 10, 50, 0, Math.PI * 2);
            ctx.arc(cx - 30, cy + 10, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Platforms (Concrete)
        platformsRef.current.forEach(p => {
            ctx.fillStyle = '#999'; // Concrete Grey
            ctx.fillRect(p.x, p.y, p.w, p.h);

            // Top highlight
            ctx.fillStyle = '#bbb';
            ctx.fillRect(p.x, p.y, p.w, 5);

            // Border
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // Player Rig
        const tilt = (inputRef.current - player.x) * 0.05;
        drawRig(ctx, player.x, player.y, player.vy, tilt);

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = () => {
        setGameState('GAMEOVER');
        playCrash();
        if (scoreRef.current > highScore) {
            localStorage.setItem('merchJumpHighScore', scoreRef.current);
            setHighScore(scoreRef.current);
            feedService.publish(`set a new Merch Jump High Score: ${Math.floor(scoreRef.current)}m! 🚀`, 'win');
        }
    };

    const handleInput = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        inputRef.current = (clientX - rect.left) * scaleX;
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: '#222',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'sans-serif',
            touchAction: 'none'
        }}>
            <h1 style={{ color: 'white', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                MERCH JUMP 🌤️
            </h1>

            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '2/3' }}>
                <canvas
                    ref={canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseMove={handleInput}
                    onTouchMove={handleInput}
                    onTouchStart={handleInput}
                    style={{
                        width: '100%', height: '100%',
                        background: '#87CEEB',
                        border: '4px solid white',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                />

                {/* MENUS */}
                {gameState !== 'PLAYING' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: '#333', borderRadius: '10px'
                    }}>
                        {gameState === 'GAMEOVER' && (
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <h2 style={{ color: '#ff0055', fontSize: '2rem', margin: 0 }}>FALLEN!</h2>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.floor(scoreRef.current)}m</p>
                                <p style={{ color: '#888' }}>BEST: {highScore}m</p>
                            </div>
                        )}

                        {gameState === 'MENU' && (
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>SELECT DRIP:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {SKINS.map(skin => (
                                        <button
                                            key={skin.id}
                                            onClick={() => { setSelectedSkin(skin); playBoop(); }}
                                            style={{
                                                background: selectedSkin.id === skin.id ? '#87CEEB' : '#eee',
                                                border: 'none', borderRadius: '10px', padding: '10px',
                                                cursor: 'pointer',
                                                transform: selectedSkin.id === skin.id ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: selectedSkin.id === skin.id ? '0 5px 15px rgba(0,0,0,0.1)' : 'none'
                                            }}
                                        >
                                            <img src={skin.src} width="40" height="40" style={{ display: 'block', margin: '0 auto' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <SquishyButton onClick={initGame} style={{
                            padding: '20px 50px',
                            background: '#333',
                            color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                            border: 'none', borderRadius: '100px'
                        }}>
                            {gameState === 'GAMEOVER' ? 'RETRY' : 'JUMP'}
                        </SquishyButton>
                    </div>
                )}

                {/* HUD */}
                {gameState === 'PLAYING' && (
                    <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '1.2rem', color: '#333', fontWeight: '900' }}>
                        {Math.floor(score)}m
                    </div>
                )}
            </div>

            <p style={{ color: '#888', marginTop: '20px', fontSize: '0.8rem' }}>
                Slide to Move • Reach the Stratosphere
            </p>
        </div>
    );
};

export default MerchJump;
