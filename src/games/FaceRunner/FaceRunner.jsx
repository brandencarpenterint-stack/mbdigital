import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import SquishyButton from '../../components/SquishyButton';
import useRetroSound from '../../hooks/useRetroSound';

const FaceRunner = () => {
    const canvasRef = useRef(null);
    const { soundEnabled } = useSettings();
    const { playCrash, playCollect, playWin } = useRetroSound();

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const TUNNEL_DEPTH = 2000;

    // State
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);
    const [selectedFace, setSelectedFace] = useState('face_money'); // default
    // Using Ref for speed to avoid closure staleness in gameLoop
    const speedRef = useRef(20);
    const playingRef = useRef(false); // Track playing state for loop

    // Refs
    const playerRef = useRef({ x: 0, y: 0, tilt: 0, squash: 1 });
    const obstaclesRef = useRef([]); // {x, y, z, type}
    const particlesRef = useRef([]);
    const scoreRef = useRef(0);
    const requestRef = useRef(null);

    // Assets
    const faceImgs = useRef({});

    useEffect(() => {
        // Preload Faces
        const faces = ['face_money', 'face_bear', 'face_bunny', 'face_default', 'face_cat'];
        faces.forEach(f => {
            const img = new Image();
            img.src = `/assets/skins/${f}.png`;
            img.onerror = () => {
                console.error(`Failed to load: ${f}`);
                faceImgs.current[f] = null; // Fallback
            };
            faceImgs.current[f] = img;
        });
    }, []);

    const startGame = () => {
        setGameState('PLAYING');
        playingRef.current = true;
        setScore(0);
        speedRef.current = 20;
        scoreRef.current = 0;
        playerRef.current = { x: 0, y: 0, tilt: 0, squash: 1 };
        obstaclesRef.current = [];
        particlesRef.current = [];

        // Init Loop
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnObstacle = () => {
        // Spawn far away (z = TUNNEL_DEPTH)
        // x,y range: -width/2 to width/2
        const spread = 800;
        obstaclesRef.current.push({
            x: (Math.random() - 0.5) * spread,
            y: (Math.random() - 0.5) * spread,
            z: TUNNEL_DEPTH,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            rot: Math.random() * Math.PI
        });
    };

    const gameLoop = () => {
        const ctx = canvasRef.current.getContext('2d');
        const width = CANVAS_WIDTH;
        const height = CANVAS_HEIGHT;
        const cx = width / 2;
        const cy = height / 2;

        try {
            // --- UPDATE ---

            // Spawn
            if (Math.random() < 0.05 + (scoreRef.current * 0.0001)) {
                spawnObstacle();
            }

            // Move Obstacles
            for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
                const obs = obstaclesRef.current[i];
                obs.z -= speedRef.current;

                if (obs.z <= 0) {
                    obstaclesRef.current.splice(i, 1);
                    scoreRef.current += 10;
                    setScore(scoreRef.current);
                    // Increase Speed cap at 80
                    speedRef.current = Math.min(speedRef.current + 0.1, 80);
                }
            }

            // --- DRAW ---
            // 1. Clear & Background
            ctx.fillStyle = '#110022';
            ctx.fillRect(0, 0, width, height);

            // Tunnel Grid Effect
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < 20; i++) {
                // Concentric Lines
                const z = (performance.now() * speedRef.current * 0.1 + i * 200) % 2000;
                const s = 400 / (z + 1);
                if (s > 0) {
                    ctx.rect(cx - width * s, cy - height * s, width * s * 2, height * s * 2);
                }
            }
            // Radial Lines
            ctx.moveTo(cx, cy); ctx.lineTo(0, 0);
            ctx.moveTo(cx, cy); ctx.lineTo(width, 0);
            ctx.moveTo(cx, cy); ctx.lineTo(0, height);
            ctx.moveTo(cx, cy); ctx.lineTo(width, height);
            ctx.stroke();


            // 2. Draw Obstacles (Back to Front)
            obstaclesRef.current.sort((a, b) => b.z - a.z); // Draw farthest first

            obstaclesRef.current.forEach(obs => {
                if (obs.z < 10) return; // Too close / behind

                const fov = 600;
                const scale = fov / obs.z;
                const sx = cx + obs.x * scale;
                const sy = cy + obs.y * scale;
                const size = 150 * scale; // Base size of obstacle

                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(obs.rot + (performance.now() * 0.005));

                // Check Collision here where we know Screen X/Y
                // Player is at PlayerRef.x + cx, PlayerRef.y + cy
                if (obs.z < 100) {
                    const dx = sx - (cx + playerRef.current.x);
                    const dy = sy - (cy + playerRef.current.y);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < (size / 2 + 40)) { // 40 is player radius
                        // CRASH
                        handleCrash(ctx);
                        return;
                    }
                }

                ctx.fillStyle = obs.color;
                ctx.shadowBlur = 10; ctx.shadowColor = obs.color;
                ctx.fillRect(-size / 2, -size / 2, size, size);

                // Inner
                ctx.fillStyle = 'black';
                ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);

                ctx.restore();
            });

            if (!playingRef.current) return;

            // 3. Draw Player Face
            // Mouse controls offset
            const p = playerRef.current;
            p.tilt *= 0.9;
            p.squash = 1 + Math.sin(performance.now() * 0.02) * 0.05; // Breathing

            ctx.save();
            ctx.translate(cx + p.x, cy + p.y);
            ctx.rotate(p.x * 0.001); // Tilt based on movement
            ctx.scale(p.squash, 1 / p.squash);

            const img = faceImgs.current[selectedFace];
            const faceSize = 120; // Big face!
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, -faceSize / 2, -faceSize / 2, faceSize, faceSize);
            } else {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#00ffaa';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(0, 0, faceSize / 2, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

                // Eyes for fallback
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(-20, -10, 10, 0, Math.PI * 2);
                ctx.arc(20, -10, 10, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

        } catch (err) {
            console.error("Game Loop Error:", err);
            cancelAnimationFrame(requestRef.current);
            return;
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleCrash = (ctx) => {
        const finalScore = scoreRef.current;
        const highScore = parseInt(localStorage.getItem('faceRunnerHighScore')) || 0;
        if (finalScore > highScore) {
            localStorage.setItem('faceRunnerHighScore', finalScore);
        }
        setGameState('GAME_OVER');
        playingRef.current = false;
        playCrash();
        cancelAnimationFrame(requestRef.current);
    };

    const handleMouseMove = (e) => {
        if (gameState !== 'PLAYING') return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        // Relative to center
        // Limit movement
        const rawX = (e.clientX - rect.left) * scaleX - (CANVAS_WIDTH / 2);
        const rawY = (e.clientY - rect.top) * scaleY - (CANVAS_HEIGHT / 2);

        playerRef.current.x = rawX;
        playerRef.current.y = rawY;
    };

    return (
        <div style={{
            width: '100%', minHeight: '100vh',
            background: '#0a0a1a',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#00ffaa', textShadow: '0 0 20px #00ffaa', marginBottom: '10px' }}>FACE WARP</h1>

            <div style={{
                position: 'relative',
                border: '4px solid #00ffaa',
                boxShadow: '0 0 50px rgba(0, 255, 170, 0.2)',
                cursor: 'none' // Hide cursor for immersion
            }}>
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseMove={handleMouseMove}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
                    }}
                    style={{ background: 'black', display: 'block', maxWidth: '100vw' }}
                />

                {/* UI OVERLAY */}
                {gameState !== 'PLAYING' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'default'
                    }}>
                        {gameState === 'GAME_OVER' && (
                            <>
                                <h2 style={{ fontSize: '4rem', color: '#ff0055', margin: 0 }}>CRASHED!</h2>
                                <p style={{ fontSize: '2rem' }}>Score: {score}</p>
                            </>
                        )}

                        <div style={{ margin: '30px 0', display: 'flex', gap: '20px' }}>
                            {['face_money', 'face_bear', 'face_bunny', 'face_cat', 'face_default'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setSelectedFace(f)}
                                    style={{
                                        background: selectedFace === f ? '#00ffaa' : '#333',
                                        border: 'none', borderRadius: '10px', padding: '10px',
                                        transform: selectedFace === f ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <img src={`/assets/skins/${f}.png`} width="60" height="60" style={{ display: 'block' }} />
                                </button>
                            ))}
                        </div>

                        <SquishyButton onClick={startGame} style={{
                            fontSize: '2rem', padding: '20px 60px',
                            background: 'linear-gradient(45deg, #00ffaa, #00ccff)',
                            color: 'black', fontWeight: '900'
                        }}>
                            {gameState === 'START' ? 'ENTER TUNNEL' : 'WARP AGAIN'}
                        </SquishyButton>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '2rem', fontWeight: 'bold' }}>
                        SCORE: {score}
                    </div>
                )}
            </div>

            <p style={{ marginTop: '20px', color: '#888' }}>Use Mouse/Touch to dodge the blocks!</p>
        </div>
    );
};

export default FaceRunner;
