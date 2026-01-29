import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { LeaderboardService } from '../../services/LeaderboardService';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400; // Canvas size
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 16;
const BRICK_ROWS = 6;
const BRICK_COLS = 8;
const CONTROL_HEIGHT = 120; // Height of the touch zone

const NeonBrickBreaker = () => {
    const { updateStat, incrementStat, shopState } = useGamification() || { updateStat: () => { }, incrementStat: () => { }, shopState: null };
    const canvasRef = useRef(null);

    // Game State
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('brickHighScore')) || 0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [shake, setShake] = useState({ x: 0, y: 0 }); // Screen shake offset

    const gameActiveRef = useRef(false);
    const ballImgRef = useRef(null);
    const shakeTimeoutRef = useRef(null);

    const { playBeep, playCrash, playCollect, playWin } = useRetroSound();

    const gameState = useRef({
        paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
        balls: [],
        bricks: [],
        powerups: [],
        particles: [],
        animationId: null,
        shakeTime: 0
    });

    useEffect(() => {
        const img = new Image();
        img.src = '/assets/boy_face.png';
        ballImgRef.current = img;
    }, []);

    // --- LEVEL GENERATION ---
    const generateLevel = (lvl) => {
        const bricks = [];
        const brickWidth = GAME_WIDTH / BRICK_COLS;
        const brickHeight = 25;

        const addBrick = (c, r, color) => {
            bricks.push({
                x: c * brickWidth,
                y: r * brickHeight + 50, // Top padding
                width: brickWidth - 6,
                height: brickHeight - 6,
                active: true,
                color: color || `hsl(${c * 40 + r * 20}, 100%, 50%)`,
                value: 10 + (lvl * 5)
            });
        };

        // Pattern Logic
        for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLS; c++) {
                // Level 1: Standard Rows
                if (lvl === 1) {
                    if (r < 4) addBrick(c, r);
                }
                // Level 2: Pyramid
                else if (lvl === 2) {
                    const mid = BRICK_COLS / 2;
                    if (c >= mid - r && c < mid + r) addBrick(c, r, '#ff0055');
                }
                // Level 3: Space Invaders (Gaps)
                else if (lvl === 3) {
                    if ((c + r) % 2 === 0) addBrick(c, r, '#00ffaa');
                }
                // Level 4: Walls
                else if (lvl === 4) {
                    if (c === 0 || c === BRICK_COLS - 1 || r === 0 || r === BRICK_ROWS - 1) addBrick(c, r, '#ffff00');
                    else if (r === 3 && c > 2 && c < 5) addBrick(c, r, 'red'); // Core
                }
                // Level 5+: Chaos / Random
                else {
                    if (Math.random() > 0.3) addBrick(c, r, `hsl(${Math.random() * 360}, 100%, 50%)`);
                }
            }
        }
        return bricks;
    };

    const triggerShake = (amount = 5) => {
        if (gameState.current.shakeTime <= 0) {
            gameState.current.shakeTime = 10; // Frames to shake
        }
        // Visual react state update for DOM shaking (optional/heavy) 
        // OR just canvas offset. Let's do DOM for "JUICE".
        setShake({ x: (Math.random() - 0.5) * amount, y: (Math.random() - 0.5) * amount });
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => setShake({ x: 0, y: 0 }), 100);
    };

    const startLevel = (lvl) => {
        setLevel(lvl);

        // Speed Up per level
        const speedBase = 4 + (lvl * 0.5);

        gameState.current.balls = [{
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 40,
            dx: speedBase * (Math.random() > 0.5 ? 1 : -1),
            dy: -speedBase,
            rot: 0
        }];
        gameState.current.bricks = generateLevel(lvl);
        gameState.current.paddleX = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
        gameState.current.powerups = [];
        gameState.current.particles = []; // Keep old particles? Nah, clear em.

        setGameActive(true);
        gameActiveRef.current = true;

        // Gamification
        if (lvl === 5) {
            incrementStat('brickMaxLevel', 5); // Trigger achievement
        } else if (lvl > 1) {
            updateStat('brickMaxLevel', (prev) => Math.max(prev, lvl));
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameOver(false);
        startLevel(1);
        requestAnimationFrame(gameLoop);
    };

    const spawnParticles = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            gameState.current.particles.push({
                x, y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color
            });
        }
    };

    const activateMultiball = () => {
        const newBalls = [];
        gameState.current.balls.forEach(ball => {
            newBalls.push({ ...ball, dx: ball.dx + 1, dy: ball.dy });
            newBalls.push({ ...ball, dx: ball.dx - 1, dy: ball.dy });
        });
        gameState.current.balls.push(...newBalls);
        playWin(); // Powerup sound
        triggerConfetti();
    };

    const endGame = (win) => {
        setGameActive(false);
        gameActiveRef.current = false;
        setGameOver(true);
        cancelAnimationFrame(gameState.current.animationId);

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('brickHighScore', score);
        }

        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + Math.floor(score / 5));

        // Gamification
        LeaderboardService.submitScore('neon_brick', 'Player1', score);
        updateStat('brickHighScore', (prev) => Math.max(prev, score));
        incrementStat('gamesPlayed', 'brick');
    };

    const gameLoop = () => {
        if (!gameActiveRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const state = gameState.current;

        // --- UPDATE ---

        // 1. Balls
        const { balls, paddleX } = state;
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.x += ball.dx;
            ball.y += ball.dy;
            ball.rot += 0.2; // Spin faster

            // Walls
            if (ball.x + BALL_SIZE > GAME_WIDTH || ball.x < 0) {
                ball.dx = -ball.dx;
                playBeep();
            }
            if (ball.y < 0) {
                ball.dy = -ball.dy;
                playBeep();
            }

            // Paddle
            if (ball.y + BALL_SIZE > GAME_HEIGHT - PADDLE_HEIGHT - 10 &&
                ball.x + BALL_SIZE > paddleX &&
                ball.x < paddleX + PADDLE_WIDTH) {

                // English/Spin
                const hitPoint = ball.x - (paddleX + PADDLE_WIDTH / 2);
                ball.dx = hitPoint * 0.2;
                ball.dy = -Math.abs(ball.dy); // Force up
                playBeep();
                if (navigator.vibrate) navigator.vibrate(15);
            }

            // Death
            if (ball.y > GAME_HEIGHT) {
                balls.splice(i, 1);
                triggerShake(10);
                playCrash();
            }
        }

        // Life Loss Check
        if (balls.length === 0) {
            if (lives > 1) {
                setLives(l => l - 1);
                // Respawn ball
                state.balls.push({
                    x: GAME_WIDTH / 2,
                    y: GAME_HEIGHT - 40,
                    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
                    dy: -4,
                    rot: 0
                });
            } else {
                endGame(false);
                return;
            }
        }

        // 2. Bricks
        let activeBricks = 0;
        state.bricks.forEach(brick => {
            if (!brick.active) return;
            activeBricks++;

            // Check against ALL balls
            state.balls.forEach(ball => {
                if (ball.x < brick.x + brick.width &&
                    ball.x + BALL_SIZE > brick.x &&
                    ball.y < brick.y + brick.height &&
                    ball.y + BALL_SIZE > brick.y) {

                    ball.dy = -ball.dy;
                    brick.active = false;
                    setScore(prev => prev + brick.value);
                    playCollect();
                    spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                    triggerShake(3);

                    if (Math.random() < 0.15) {
                        state.powerups.push({ x: brick.x + brick.width / 2, y: brick.y, type: 'multiball' });
                    }
                }
            });
        });

        if (activeBricks === 0) {
            // NEXT LEVEL
            triggerConfetti();
            playWin();
            setTimeout(() => {
                startLevel(level + 1);
            }, 1000);
            return;
        }

        // 3. Powerups
        for (let i = state.powerups.length - 1; i >= 0; i--) {
            const p = state.powerups[i];
            p.y += 3;
            if (p.y > GAME_HEIGHT - PADDLE_HEIGHT - 10 &&
                p.y < GAME_HEIGHT - 10 &&
                p.x > state.paddleX &&
                p.x < state.paddleX + PADDLE_WIDTH) {
                if (p.type === 'multiball') activateMultiball();
                state.powerups.splice(i, 1);
            } else if (p.y > GAME_HEIGHT) {
                state.powerups.splice(i, 1);
            }
        }

        // 4. Particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const p = state.particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.04;
            if (p.life <= 0) state.particles.splice(i, 1);
        }

        // --- DRAW ---
        // Clear with slight trail effect? No, clean clear.
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Shake Canvas (Software Shake) - Optional addition to DOM shake
        ctx.save();
        // If we wanted canvas shake: ctx.translate(Math.random()*2, Math.random()*2);

        // Draw Particles
        state.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 5, 5);
        });
        ctx.globalAlpha = 1;

        // Draw Bricks
        state.bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillStyle = brick.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                ctx.shadowBlur = 0;
            }
        });

        // Powerups
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        state.powerups.forEach(p => ctx.fillText('⚡', p.x, p.y));

        // Paddle
        const currentSkin = shopState?.equipped?.brick || 'paddle_default';
        let paddleColor = '#00ffaa';
        let paddleGlow = '#00ffaa';

        if (currentSkin === 'paddle_flame') {
            paddleColor = '#ff4500'; // OrangeRed
            paddleGlow = '#ff8c00';  // DarkOrange
        } else if (currentSkin === 'paddle_ice') {
            paddleColor = '#00bfff'; // DeepSkyBlue
            paddleGlow = '#e0ffff';  // LightCyan
        }

        ctx.fillStyle = paddleColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = paddleGlow;
        ctx.fillRect(state.paddleX, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Skin Details
        if (currentSkin === 'paddle_flame') {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(state.paddleX + 10, GAME_HEIGHT - PADDLE_HEIGHT - 5, PADDLE_WIDTH - 20, 2);
        }
        ctx.shadowBlur = 0;

        // Balls
        state.balls.forEach(ball => {
            ctx.save();
            ctx.translate(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2);
            ctx.rotate(ball.rot);
            if (ballImgRef.current) {
                ctx.drawImage(ballImgRef.current, -BALL_SIZE, -BALL_SIZE, BALL_SIZE * 2, BALL_SIZE * 2);
            } else {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        ctx.restore();
        state.animationId = requestAnimationFrame(gameLoop);
    };

    // --- CONTROLS ---
    // Handle touch/mouse on the Control Bar
    const handleControlInput = (clientX, rect) => {
        if (!gameActiveRef.current) return;

        // Relative X within the control bar
        const x = clientX - rect.left;
        const scaleX = GAME_WIDTH / rect.width;
        const canvasX = x * scaleX;

        gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, canvasX - PADDLE_WIDTH / 2));
    };

    // Orientation Check
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    useEffect(() => {
        const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (isPortrait && window.innerWidth < 768) {
        return (
            <div style={{ position: 'fixed', inset: 0, background: '#111', color: '#cc00ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999, textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔄</div>
                <h1>Rotate Phone</h1>
                <p>Landscape required!</p>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#050505',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transform: `translate(${shake.x}px, ${shake.y}px)`, // JUICE: Screen Shake
            transition: 'transform 0.05s'
        }}>

            {/* HUD */}
            <div style={{
                position: 'absolute', top: 10, width: '90%', maxWidth: '600px',
                display: 'flex', justifyContent: 'space-between',
                color: '#cc00ff', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 10
            }}>
                <span>SCORE: {score}</span>
                <span style={{ color: 'white' }}>LVL {level}</span>
                <span style={{ color: 'red' }}>❤️ {lives}</span>
            </div>

            {/* CANVAS */}
            <div style={{
                position: 'relative',
                boxShadow: '0 0 20px #cc00ff40',
                border: '2px solid #333',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    onTouchStart={(e) => {
                        handleControlInput(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                    }}
                    onTouchMove={(e) => {
                        // Prevent default to stop scrolling
                        if (e.cancelable) e.preventDefault();
                        handleControlInput(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                    }}
                    style={{
                        background: '#111',
                        display: 'block',
                        maxWidth: '95vw',
                        maxHeight: '65vh', // Save room for controls
                        width: 'auto',
                        height: 'auto',
                        touchAction: 'none'
                    }}
                />

                {!gameActive && !gameOver && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <h1 style={{ color: '#00ffaa', textShadow: '0 0 10px #00ffaa' }}>NEON BRICK BREAKER</h1>
                        <SquishyButton onClick={startGame} style={{ marginTop: '20px', padding: '15px 40px', fontSize: '1.5rem', background: '#cc00ff' }}>
                            START GAME
                        </SquishyButton>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '3rem', color: 'red' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.5rem', color: 'white' }}>Score: {score}</p>
                        <SquishyButton onClick={startGame} style={{ marginTop: '10px', background: '#cc00ff' }}>Try Again</SquishyButton>
                        <Link to="/arcade" style={{ color: '#666', marginTop: '15px' }}>Exit</Link>
                    </div>
                )}
            </div>

            {/* CONTROL ZONE */}
            <div
                className="control-zone"
                onTouchMove={(e) => {
                    e.preventDefault();
                    handleControlInput(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                }}
                onTouchStart={(e) => {
                    handleControlInput(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                }}
                onMouseMove={(e) => {
                    // Support mouse too for testing
                    if (e.buttons === 1) handleControlInput(e.clientX, e.currentTarget.getBoundingClientRect());
                }}
                style={{
                    width: '95vw',
                    maxWidth: '800px', // Wider than game to catch edges
                    height: '150px', // Taller for easier grabbing
                    marginTop: '10px',
                    background: 'linear-gradient(to bottom, #222, #111)',
                    borderRadius: '15px',
                    border: '2px dashed #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    userSelect: 'none',
                    touchAction: 'none', // Critical
                    cursor: 'grab'
                }}
            >
                <span>&lt;&lt;&lt; SLIDE TO MOVE &gt;&gt;&gt;</span>
            </div>
        </div>
    );
};

export default NeonBrickBreaker;
