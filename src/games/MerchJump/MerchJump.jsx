import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import SquishyButton from '../../components/SquishyButton';
import useRetroSound from '../../hooks/useRetroSound';

const MerchJump = () => {
    const canvasRef = useRef(null);
    const { playJump, playCollect, playCrash, playBoop } = useRetroSound();

    // Game Constants
    const GRAVITY = 0.4;
    const JUMP_FORCE = -10;
    const WIDTH = 400; // Mobile friendly width
    const HEIGHT = 600;

    // Assets
    const SKINS = [
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png' },
    ];

    // State
    const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, GAMEOVER
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('merchJumpHighScore')) || 0);
    const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

    // Refs for Game Loop
    const playerRef = useRef({ x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 50, height: 50 });
    const platformsRef = useRef([]);
    const cameraYRef = useRef(0);
    const scoreRef = useRef(0);
    const requestRef = useRef(null);
    const inputRef = useRef(WIDTH / 2); // Mouse/Touch X position
    const skinImgRef = useRef(null);

    // Initial Setup
    useEffect(() => {
        // Preload Skin
        const img = new Image();
        img.src = selectedSkin.src;
        skinImgRef.current = img;

        return () => cancelAnimationFrame(requestRef.current);
    }, [selectedSkin]);

    const initGame = () => {
        setScore(0);
        scoreRef.current = 0;
        cameraYRef.current = 0;
        playerRef.current = { x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 60, height: 60 };

        // Generate Starting Platforms
        platformsRef.current = [];
        // Base platform
        platformsRef.current.push({ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, h: 20, type: 'normal' });

        let y = HEIGHT - 200;
        for (let i = 0; i < 10; i++) {
            generatePlatform(y);
            y -= 100 + Math.random() * 50;
        }

        setGameState('PLAYING');
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const generatePlatform = (y) => {
        const x = Math.random() * (WIDTH - 80);
        platformsRef.current.push({
            x, y, w: 80, h: 20,
            type: Math.random() > 0.9 ? 'moving' : 'normal',
            vx: Math.random() > 0.5 ? 2 : -2
        });
    };

    const gameLoop = () => {
        const ctx = canvasRef.current.getContext('2d');
        const player = playerRef.current;

        // --- UPDATE ---

        // Controls (Smooth Lerp)
        const targetX = inputRef.current - player.width / 2;
        player.x += (targetX - player.x) * 0.15;

        // Screen Wrap
        if (player.x < -player.width / 2) player.x = WIDTH - player.width / 2;
        if (player.x > WIDTH - player.width / 2) player.x = -player.width / 2;

        // Physics
        player.vy += GRAVITY;
        player.y += player.vy;

        // Camera Scroll (Player goes up)
        if (player.y < HEIGHT / 2) {
            const shift = HEIGHT / 2 - player.y;
            player.y = HEIGHT / 2;
            cameraYRef.current += shift;
            scoreRef.current += Math.floor(shift);
            setScore(scoreRef.current);

            // Move Platforms Down
            platformsRef.current.forEach(p => p.y += shift);

            // Remove old platforms
            platformsRef.current = platformsRef.current.filter(p => p.y < HEIGHT);

            // Add new platforms
            const lastP = platformsRef.current[platformsRef.current.length - 1];
            if (lastP && lastP.y > 100) {
                generatePlatform(lastP.y - (100 + Math.random() * 60));
            }
        }

        // Collision Detect (Only when falling)
        if (player.vy > 0) {
            platformsRef.current.forEach(p => {
                if (
                    player.x + player.width > p.x &&
                    player.x < p.x + p.w &&
                    player.y + player.height > p.y &&
                    player.y + player.height < p.y + p.h + 20 // Tolerance
                ) {
                    // Bounce
                    player.vy = JUMP_FORCE;
                    playJump();
                }
            });
        }

        // Moving Platforms
        platformsRef.current.forEach(p => {
            if (p.type === 'moving') {
                p.x += p.vx;
                if (p.x <= 0 || p.x + p.w >= WIDTH) p.vx *= -1;
            }
        });

        // Game Over Check
        if (player.y > HEIGHT) {
            handleGameOver();
            return;
        }

        // --- DRAW ---
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, '#1a0b2e');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Grid (Cyberpunk feel)
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.1)';
        ctx.beginPath();
        for (let i = 0; i < WIDTH; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, HEIGHT); }
        for (let i = 0; i < HEIGHT; i += 40) { ctx.moveTo(0, i + (cameraYRef.current % 40)); ctx.lineTo(WIDTH, i + (cameraYRef.current % 40)); }
        ctx.stroke();

        // Platforms
        platformsRef.current.forEach(p => {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.type === 'moving' ? '#00ccff' : '#00ffaa';
            ctx.fillStyle = p.type === 'moving' ? '#00ccff' : '#00ffaa';
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, 5);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Detail
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(p.x, p.y + p.h - 5, p.w, 5);
        });

        // Player
        if (skinImgRef.current && skinImgRef.current.complete) {
            ctx.save();
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
            // Tilt based on movement
            const tilt = (inputRef.current - (player.x + player.width / 2)) * 0.05;
            ctx.rotate(Math.min(0.5, Math.max(-0.5, tilt * 0.1)));

            // Squash stretch on bounce
            const scaleY = player.vy < 0 ? 1.1 : 0.9;
            const scaleX = 1 / scaleY;
            ctx.scale(scaleX, scaleY);

            ctx.drawImage(skinImgRef.current, -30, -30, 60, 60);
            ctx.restore();
        } else {
            // Fallback
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(player.x + 30, player.y + 30, 25, 0, Math.PI * 2); ctx.fill();
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = () => {
        setGameState('GAMEOVER');
        playCrash();
        if (scoreRef.current > highScore) {
            localStorage.setItem('merchJumpHighScore', scoreRef.current);
            setHighScore(scoreRef.current);
        }
    };

    const handleInput = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        let clientX;

        if (e.touches) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        inputRef.current = (clientX - rect.left) * scaleX;
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: '#0a0a1a',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Press Start 2P", cursive',
            touchAction: 'none'
        }}>
            <h1 style={{ color: '#00ffaa', textShadow: '0 0 10px #00ffaa', marginBottom: '10px', fontSize: '1.5rem' }}>
                MERCH JUMP 🚀
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
                        background: '#111',
                        border: '4px solid #333',
                        borderRadius: '10px',
                        boxShadow: '0 0 30px rgba(0,255,170,0.2)'
                    }}
                />

                {/* MENUS OVERLAY */}
                {gameState !== 'PLAYING' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: 'white', borderRadius: '10px'
                    }}>
                        {gameState === 'GAMEOVER' && (
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <h2 style={{ color: '#ff0055', fontSize: '2rem', marginBottom: '10px' }}>FALLEN!</h2>
                                <p style={{ fontSize: '1.2rem' }}>SCORE: {Math.floor(scoreRef.current)}</p>
                                <p style={{ color: '#aaa', fontSize: '0.8rem' }}>BEST: {highScore}</p>
                            </div>
                        )}

                        {gameState === 'MENU' && (
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <p style={{ color: '#00ffaa', marginBottom: '20px' }}>SELECT SKIN:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {SKINS.map(skin => (
                                        <button
                                            key={skin.id}
                                            onClick={() => { setSelectedSkin(skin); playBoop(); }}
                                            style={{
                                                background: selectedSkin.id === skin.id ? '#00ffaa' : '#333',
                                                border: '2px solid white',
                                                borderRadius: '10px',
                                                padding: '10px',
                                                cursor: 'pointer',
                                                transform: selectedSkin.id === skin.id ? 'scale(1.1)' : 'scale(1)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <img src={skin.src} alt={skin.name} width="50" height="50" style={{ display: 'block', margin: '0 auto' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <SquishyButton onClick={initGame} style={{
                            padding: '20px 40px',
                            background: 'linear-gradient(45deg, #00ffaa, #00ccff)',
                            color: 'black', fontWeight: 'bold', fontSize: '1.2rem'
                        }}>
                            {gameState === 'GAMEOVER' ? 'JUMP AGAIN' : 'BLAST OFF'}
                        </SquishyButton>
                    </div>
                )}

                {/* HUD */}
                {gameState === 'PLAYING' && (
                    <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '1rem', color: 'white', textShadow: '2px 2px 0 black' }}>
                        SCORE: {Math.floor(score)}
                    </div>
                )}
            </div>

            <p style={{ color: '#666', marginTop: '20px', fontSize: '0.7rem' }}>
                Slide to Move • Jump on Platforms
            </p>
        </div>
    );
};

export default MerchJump;
