import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';

const FaceRunner = () => {
    const canvasRef = useRef(null);
    const { soundEnabled } = useSettings();
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);

    // Game Constants
    const GRAVITY = 0.6;
    const JUMP_FORCE = -10;
    const SPEED = 5;

    // Refs for game loop state (to avoid closure stale state)
    const playerRef = useRef({ y: 0, dy: 0, grounded: false });
    const obstaclesRef = useRef([]);
    const scoreRef = useRef(0);
    const frameRef = useRef(0);
    const animationFrameId = useRef(null);

    // Audio Context (Lazy load)
    const audioCtxRef = useRef(null);
    const playSound = (type) => {
        if (!soundEnabled) return;
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'jump') {
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(500, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'hit') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    };

    const startGame = () => {
        playerRef.current = { y: 200, dy: 0, grounded: false, rotation: 0 };
        obstaclesRef.current = [];
        scoreRef.current = 0;
        frameRef.current = 0;
        setScore(0);
        setGameState('PLAYING');
    };

    const jump = () => {
        if (gameState !== 'PLAYING') return;
        if (playerRef.current.grounded) {
            playerRef.current.dy = JUMP_FORCE;
            playerRef.current.grounded = false;
            playSound('jump');
            if (navigator.vibrate) navigator.vibrate(10);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let groundY = canvas.height - 50;

        // Assets
        const faceImg = new Image();
        faceImg.src = '/assets/brokid-logo.png'; // Using Logo as the Runner

        const obstacleImg = new Image();
        obstacleImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmYwMDU1Ii8+PC9zdmc+'; // Red Block

        const loop = () => {
            if (gameState !== 'PLAYING') return;

            // Clear
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground
            ctx.fillStyle = '#333';
            ctx.fillRect(0, groundY, canvas.width, 50);

            // Update Player
            const p = playerRef.current;
            p.dy += GRAVITY;
            p.y += p.dy;

            // Ground Collision
            if (p.y + 40 > groundY) { // Assuming player is 40px
                p.y = groundY - 40;
                p.dy = 0;
                p.grounded = true;
                p.rotation = 0; // Reset rotation on land
            } else {
                p.grounded = false;
                p.rotation += 5; // Spin in air!
            }

            // Draw Player (The Face)
            ctx.save();
            ctx.translate(50 + 20, p.y + 20); // Center pivot
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.drawImage(faceImg, -20, -20, 40, 40);
            ctx.restore();

            // Spawn Obstacles
            frameRef.current++;
            if (frameRef.current % 100 === 0) { // Every ~1.6 seconds
                obstaclesRef.current.push({ x: canvas.width, w: 30, h: 50 }); // Tall block
            }

            // Update & Draw Obstacles
            ctx.fillStyle = '#ff0055';
            obstaclesRef.current.forEach((obs, i) => {
                obs.x -= SPEED;
                // Draw Spikes/Block
                ctx.fillRect(obs.x, groundY - obs.h, obs.w, obs.h);

                // Collision Detection
                // Simple AABB
                if (
                    50 < obs.x + obs.w &&
                    50 + 30 > obs.x &&
                    p.y < groundY &&
                    p.y + 40 > groundY - obs.h
                ) {
                    setGameState('GAME_OVER');
                    playSound('hit');
                    if (navigator.vibrate) navigator.vibrate(200);
                }

                // Cleanup
                if (obs.x + obs.w < 0) {
                    obstaclesRef.current.shift();
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                }
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        if (gameState === 'PLAYING') {
            animationFrameId.current = requestAnimationFrame(loop);
        }

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [gameState]);

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                if (gameState === 'START' || gameState === 'GAME_OVER') startGame();
                else jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(180deg, #87CEEB 0%, #fff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Press Start 2P", monospace'
        }}
            onClick={() => {
                if (gameState === 'START' || gameState === 'GAME_OVER') startGame();
                else jump();
            }}
        >
            <h1 style={{ color: '#ff0055', textShadow: '2px 2px #333', marginBottom: '20px' }}>FACE RUNNER</h1>

            <div style={{ position: 'relative', border: '4px solid #333', boxShadow: '10px 10px 0 rgba(0,0,0,0.2)' }}>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    style={{ background: '#f0f0f0', maxWidth: '100%' }}
                />

                {gameState !== 'PLAYING' && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                            {gameState === 'START' ? 'TAP TO RUN' : 'GAME OVER'}
                        </h2>
                        {gameState === 'GAME_OVER' && <p>Score: {score}</p>}
                        <p className="blink">Press Space or Tap</p>
                    </div>
                )}

                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', color: '#333' }}>
                    SCORE: {score}
                </div>
            </div>

            <p style={{ marginTop: '20px', color: '#666' }}>Jump over the glitches!</p>
        </div>
    );
};

export default FaceRunner;
