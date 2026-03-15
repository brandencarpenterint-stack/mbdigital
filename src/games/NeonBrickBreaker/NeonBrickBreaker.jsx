import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 800; // Portrait Mode
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 24;
const BRICK_ROWS = 20; // Increased for verticality
const BRICK_COLS = 10; // Increased resolution
const CONTROL_HEIGHT = 120; // Height of the touch zone
const BALL_ASSETS = [
    '/assets/neon_brick/ball1.png',
    '/assets/neon_brick/ball2.png',
    '/assets/neon_brick/ball3.png',
    '/assets/neon_brick/ball4.png'
];

const NeonBrickBreaker = () => {
    const { updateStat, incrementStat, shopState, addCoins, coins, spendCoins, buyItem, equipItem, userProfile, stats } = useGamification() || { updateStat: () => { }, incrementStat: () => { }, shopState: { unlocked: [], equipped: {} } };
    const canvasRef = useRef(null);
    const [searchParams] = useSearchParams();
    const isCustomMode = searchParams.get('mode') === 'custom';

    // Shop UI State
    const [isShopOpen, setIsShopOpen] = useState(false);

    // Definitions
    const BRICK_SHOP_ITEMS = [
        { id: 'paddle_default', name: 'NEON GREEN', type: 'paddle', price: 0, category: 'brick' },
        { id: 'paddle_flame', name: 'INFERNO', type: 'paddle', price: 500, category: 'brick', color: '#ff4500' },
        { id: 'paddle_ice', name: 'FROSTBITE', type: 'paddle', price: 800, category: 'brick', color: '#00bfff' },
        { id: 'paddle_laser', name: 'CYBER PUNK', type: 'paddle', price: 1500, category: 'brick', color: '#00ff00' },
        { id: 'paddle_shadow', name: 'VOID WALKER', type: 'paddle', price: 3000, category: 'brick', color: '#4b0082' },
        { id: 'ball_std', name: 'STANDARD', type: 'ball', price: 0, category: 'brick_ball' },
        { id: 'ball_fire', name: 'METEOR', type: 'ball', price: 2000, category: 'brick_ball' },
        { id: 'ball_eye', name: 'ALL-SEEING', type: 'ball', price: 5000, category: 'brick_ball' },
    ];

    const handleBuyOrEquip = (item) => {
        if (shopState.unlocked.includes(item.id)) {
            equipItem(item.category, item.id);
            playCollect();
        } else {
            // Construct item object for context buyItem helper
            const success = buyItem({
                id: item.id,
                name: item.name,
                price: item.price,
                type: 'permanent' // or whatever context expects, actually context just checks id presence
            });
            if (success) {
                // Auto equip on buy?
                equipItem(item.category, item.id);
            } else {
                playCrash();
            }
        }
    };

    // Game State
    const [score, setScore] = useState(0);

    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('brickHighScore')) || 0);

    // ... (rest of sync effect)

    // ... (rest of logic up to draw) 

    // DRAW FUNCTION UPDATE FOR PADDLE SHADOW
    // inside gameLoop...
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
    } else if (currentSkin === 'paddle_laser') {
        paddleColor = '#00ff00'; // Lime
        paddleGlow = '#00ffff';  // Cyan
    } else if (currentSkin === 'paddle_shadow') {
        paddleColor = '#220033';
        paddleGlow = '#8800ff';
    }

    // ... (rest of logic) ...


    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [shake, setShake] = useState({ x: 0, y: 0 }); // Screen shake offset

    const gameActiveRef = useRef(false);
    const ballImages = useRef([]); // Array of Image objects
    const shakeTimeoutRef = useRef(null);
    const nextLevelTimeoutRef = useRef(null); // Fix for lingering timeouts
    const levelRef = useRef(1); // FIX: Ref to track level avoiding stale closures

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

    // Lifecycle & Cleanup
    useEffect(() => {
        BALL_ASSETS.forEach(src => {
            const img = new Image();
            img.src = src;
            ballImages.current.push(img);
        });

        return () => {
            if (gameState.current.animationId) cancelAnimationFrame(gameState.current.animationId);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
            if (nextLevelTimeoutRef.current) clearTimeout(nextLevelTimeoutRef.current);
            gameActiveRef.current = false;
        };
    }, []);

    // --- LEVEL GENERATION ---
    const generateLevel = (lvl) => {
        const bricks = [];
        const brickWidth = GAME_WIDTH / BRICK_COLS;
        const brickHeight = 25;

        const addBrick = (c, r, color, hp = 1, type = 'normal') => {
            bricks.push({
                x: c * brickWidth,
                y: r * brickHeight + 80, // More Top padding
                width: brickWidth - 4,
                height: brickHeight - 4,
                active: true,
                color: color || `hsl(${c * 40 + r * 20}, 100%, 50%)`,
                value: 10 * hp,
                hp,
                maxHp: hp,
                type // 'normal', 'steel'
            });
        };

        // Helper for ASCII Maps
        const drawMap = (map, colorFn) => {
            map.forEach((rowStr, r) => {
                const row = rowStr.split('');
                row.forEach((char, c) => {
                    if (char === ' ') return;
                    if (char === 'S') addBrick(c, r, '#aaa', 999, 'steel');
                    else {
                        const style = colorFn(char, c, r);
                        addBrick(c, r, style.color, style.hp || 1);
                    }
                });
            });
        };

        if (lvl === 'custom') {
            const customData = JSON.parse(localStorage.getItem('merchboy_custom_brick'));
            if (customData) {
                customData.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell) { // { type, color }
                            if (cell.type === 'steel') addBrick(c, r, '#aaa', 999, 'steel');
                            else addBrick(c, r, cell.color || '#fff', 1);
                        }
                    });
                });
            } else {
                // Fallback if empty
                for (let r = 0; r < 5; r++) for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, null, 1);
            }
            return bricks;
        }

        // PATTERNS
        if (lvl === 1) { // Standard Warmup
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, null, 1);
            }
        }
        else if (lvl === 2) { // INSANE: CHECKERBOARD
            for (let r = 0; r < 14; r++) {
                for (let c = 0; c < BRICK_COLS; c++) {
                    if ((r + c) % 2 === 0) addBrick(c, r, '#ff0055', 1); // Red
                    else addBrick(c, r, '#00ff00', 1); // Green
                }
            }
        }
        else if (lvl === 3) { // SPACE INVADER
            const map = [
                "  XX   XX ",
                "   X   X  ",
                "  XXXXXXX ",
                " XX XXX XX",
                "XXXXXXXXXX",
                "X SXXXXS X",
                "X X     X X",
                "   XX XX   "
            ];
            drawMap(map, (char) => {
                if (char === 'S') return { color: '#aaa', hp: 999 }; // Steel Eyes
                return { color: '#76ff03', hp: 2 };
            });
        }
        else if (lvl === 4) { // ALIEN SWARM
            for (let r = 0; r < 16; r += 2) {
                for (let c = (r % 4 === 0 ? 0 : 1); c < BRICK_COLS; c += 2) {
                    addBrick(c, r, '#76ff03', r < 6 ? 2 : 1);
                }
            }
        }
        else if (lvl === 5) { // THE BOSS SKULL (Re-vamped)
            const map = [
                "   XXXX   ",
                " XXXXXXXX ",
                "XXXXXXXXXX",
                "XX O  O XX",
                "XXXXXXXXXX",
                " XXXXXXXX ",
                "  XX  XX  ",
                "  XX  XX  ",
                "  XX  XX  "
            ];
            drawMap(map, (char) => char === 'O' ? { color: '#000', hp: 1 } : { color: '#fff', hp: 3 });
        }
        else if (lvl === 6) { // STEEL RAIN
            for (let r = 0; r < 12; r++) {
                if (r % 3 === 0) {
                    for (let c = 0; c < BRICK_COLS; c++) {
                        if (c % 2 === 0) addBrick(c, r, '#aaa', 999, 'steel');
                    }
                } else {
                    for (let c = 0; c < BRICK_COLS; c++) addBrick(c, r, '#00bfff', 1);
                }
            }
        }
        else { // LVL 7+: RANDOM CHAOS
            for (let r = 0; r < 15; r++) {
                for (let c = 0; c < BRICK_COLS; c++) {
                    if (Math.random() > 0.3) {
                        const hp = Math.floor(Math.random() * 3) + 1;
                        addBrick(c, r, `hsl(${Math.random() * 360}, 100%, 50%)`, hp);
                    }
                }
            }
        }

        return bricks;
    };

    const triggerShake = (amount = 5) => {
        if (gameState.current.shakeTime <= 0) {
            gameState.current.shakeTime = 10; // Frames to shake
        }
        setShake({ x: (Math.random() - 0.5) * amount, y: (Math.random() - 0.5) * amount });
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => setShake({ x: 0, y: 0 }), 100);
    };

    const startLevel = (lvl) => {
        setLevel(lvl);
        levelRef.current = lvl;

        // SURVIVAL MODE: FASTER SCALING
        const speedBase = 6 + (lvl * 0.8);

        const newBalls = [];
        // ALWAYS MULTIBALL START!
        const ballCount = 3;

        for (let i = 0; i < ballCount; i++) {
            newBalls.push({
                x: GAME_WIDTH / 2,
                y: GAME_HEIGHT - 60,
                dx: speedBase * (Math.random() > 0.5 ? 1 : -1) * (1 + i * 0.2), // Slight variation
                dy: -speedBase,
                rot: 0,
                imgIndex: Math.floor(Math.random() * 4)
            });
        }
        gameState.current.balls = newBalls;

        gameState.current.bricks = generateLevel(lvl);
        gameState.current.paddleX = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
        gameState.current.powerups = [];
        gameState.current.particles = [];
        // Reset Transition Flag
        gameState.current.transitioning = false;

        setGameActive(true);
        gameActiveRef.current = true;

        // Gamification
        if (lvl === 5) {
            incrementStat('brickMaxLevel', 5);
        } else if (lvl > 1) {
            updateStat('brickMaxLevel', (prev) => Math.max(prev, lvl));
        }
    };

    const startGame = (mode = 1) => {
        setScore(0);
        setLives(3); // Start with 3 Lives
        setGameOver(false);
        startLevel(mode);
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
        // Spawn 4 balls (One of each face type) from the paddle
        const paddleCenter = gameState.current.paddleX + PADDLE_WIDTH / 2;

        for (let i = 0; i < 4; i++) {
            gameState.current.balls.push({
                x: paddleCenter,
                y: GAME_HEIGHT - 60,
                dx: (Math.random() - 0.5) * 6, // Spread out
                dy: -Math.abs((Math.random() * 2) + 4), // Go Up
                rot: 0,
                imgIndex: i // Force different face
            });
        }
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
            if (updateStat) updateStat('brickHighScore', score);

            if (score > 100) {
                const playerName = userProfile?.name || 'Breaker';
                feedService.publish(`smashed a new High Score: ${score} in Neon Bricks 🧱`, 'win', playerName);
            }
        }

        if (addCoins) addCoins(Math.floor(score / 5));

        // Gamification
        if (updateStat) updateStat('gamesPlayed', 'neon_brick');
    };

    const gameLoop = () => {
        if (!gameActiveRef.current) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const state = gameState.current;

        // --- UPDATE ---
        if (!state.transitioning) {

            // 1. Balls
            const { balls, paddleX } = state;
            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];
                ball.x += ball.dx;
                ball.y += ball.dy;
                ball.rot += 0.005; // Almost zero rotation

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

                    // Gradual Speed Increase (Cap at max speed)
                    const MAX_SPEED_Y = 18; // Cap
                    if (Math.abs(ball.dy) < MAX_SPEED_Y) {
                        ball.dy *= 1.02; // +2% speed per hit
                        ball.dx *= 1.02;
                    }
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
                        rot: 0,
                        imgIndex: Math.floor(Math.random() * 4)
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
                // Fix: Ignore steel bricks for win condition
                if (brick.type !== 'steel') activeBricks++;

                // Check against ALL balls
                state.balls.forEach(ball => {
                    if (ball.x < brick.x + brick.width &&
                        ball.x + BALL_SIZE > brick.x &&
                        ball.y < brick.y + brick.height &&
                        ball.y + BALL_SIZE > brick.y) {

                        ball.dy = -ball.dy;

                        if (brick.type === 'steel') {
                            playBeep();
                            triggerShake(2);
                            return; // Indestructible
                        }

                        brick.hp -= 1;
                        if (brick.hp <= 0) {
                            brick.active = false;
                            setScore(prev => prev + brick.value);
                            playCollect();
                            spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                            triggerShake(3);

                            if (Math.random() < 0.15) {
                                state.powerups.push({ x: brick.x + brick.width / 2, y: brick.y, type: 'multiball' });
                            }
                        } else {
                            // Hit Sound
                            playBeep();
                            // Visual Damage (Darken)
                            brick.color = 'white'; // Flash white
                            setTimeout(() => brick.color = brick.color, 50); // Reset? Need to store original color.
                            // Simplified: Just use opacity or predefined colors for HP.
                            // For now, let's just flash?
                        }
                    }
                });
            });

            if (activeBricks === 0 && !gameState.current.transitioning) {
                // NEXT LEVEL
                gameState.current.transitioning = true;
                triggerConfetti();
                playWin();

                setTimeout(() => {
                    startLevel(levelRef.current + 1);
                    // Ensure transitioning is reset inside startLevel or here
                    gameState.current.transitioning = false;
                }, 1000);
            }

            if (gameState.current.transitioning) {
                // Keep drawing but skip other updates? 
                // Actually, let's just let it run but maybe pause balls?
                state.balls.forEach(b => { b.x += 0; b.y += 0; }); // Pause movement
                // Continue to draw loop
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

        } // End Update

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
                // Dim color based on HP
                if (brick.type === 'steel') ctx.fillStyle = '#888';
                else {
                    ctx.fillStyle = brick.color;
                    if (brick.hp < brick.maxHp) ctx.globalAlpha = 0.5 + (0.5 * (brick.hp / brick.maxHp));
                }

                ctx.shadowBlur = 10;
                ctx.shadowColor = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;

                // HP Indicator
                if (brick.hp > 1 && brick.type !== 'steel') {
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    ctx.fillText(brick.hp, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
                }
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
        } else if (currentSkin === 'paddle_laser') {
            paddleColor = '#00ff00'; // Lime
            paddleGlow = '#00ffff';  // Cyan
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
        const currentBall = shopState?.equipped?.brick_ball || 'ball_std';

        state.balls.forEach(ball => {
            ctx.save();
            ctx.translate(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2);
            ctx.rotate(ball.rot);

            if (currentBall === 'ball_eye') {
                // Eyeball
                ctx.fillStyle = 'white';
                ctx.beginPath(); ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2); ctx.fill();
                // Iris
                ctx.fillStyle = '#00aaff';
                ctx.beginPath(); ctx.arc(0, 0, BALL_SIZE / 4, 0, Math.PI * 2); ctx.fill();
                // Pupil
                ctx.fillStyle = 'black';
                ctx.beginPath(); ctx.arc(0, 0, BALL_SIZE / 8, 0, Math.PI * 2); ctx.fill();
            } else if (currentBall === 'ball_fire') {
                // Fireball
                ctx.fillStyle = '#ff4500';
                ctx.shadowBlur = 10; ctx.shadowColor = 'orange';
                ctx.beginPath(); ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2); ctx.fill();
                // Trail
                if (Math.random() > 0.5) spawnParticles(ball.x, ball.y + 10, 'orange');
            } else {
                // Default: Face Balls
                const img = ballImages.current[ball.imgIndex % ballImages.current.length];
                if (img && img.complete) {
                    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,255,255,0.5)';
                    ctx.drawImage(img, -BALL_SIZE / 2, -BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
                    ctx.shadowBlur = 0;
                } else {
                    // Fallback
                    ctx.fillStyle = 'white';
                    ctx.beginPath(); ctx.arc(0, 0, BALL_SIZE / 2, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.restore();
        });

        ctx.restore();
        state.animationId = requestAnimationFrame(gameLoop);
    };

    // --- CONTROLS ---
    useEffect(() => {
        const handleInput = (clientX) => {
            if (!gameActiveRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = GAME_WIDTH / rect.width;
            const relativeX = (clientX - rect.left) * scaleX;

            // Center the paddle on the finger/mouse
            gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2));
        };

        const onTouchMove = (e) => {
            if (e.target.tagName !== 'BUTTON') { // Allow clicking buttons
                // e.preventDefault(); // Stop scrolling? Maybe dangerous if they want to scroll away.
                // Let's rely on touch-action: none in CSS for the game container
            }
            handleInput(e.touches[0].clientX);
        };

        const onMouseMove = (e) => {
            handleInput(e.clientX);
        };

        const onKeyDown = (e) => {
            if (!gameActiveRef.current) return;
            const SPEED = 40;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                gameState.current.paddleX = Math.max(0, gameState.current.paddleX - SPEED);
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                gameState.current.paddleX = Math.min(GAME_WIDTH - PADDLE_WIDTH, gameState.current.paddleX + SPEED);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    // Orientation Check REMOVED - Portrait is now native!


    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: '#050505',
                touchAction: 'none', // Critical for preventing scroll while playing
                overflow: 'hidden',
                cursor: gameActive ? 'none' : 'default', // Hide cursor while playing!
                fontFamily: '"Orbitron", sans-serif'
            }}
            onTouchMove={(e) => {
                if (gameActive) {
                    const rect = canvasRef.current.getBoundingClientRect();
                    const scaleX = GAME_WIDTH / rect.width;
                    const relativeX = (e.touches[0].clientX - rect.left) * scaleX;
                    gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2));
                }
            }}
        >
            <style>{`
                .shop-panel {
                    position: fixed;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    width: 300px;
                    background: rgba(10, 10, 15, 0.95);
                    border-left: 2px solid var(--neon-blue);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 100;
                    padding: 20px;
                    color: white;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .shop-panel.open {
                    transform: translateX(0);
                }
                .shop-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 10px;
                    padding: 15px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .shop-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .shop-item.equipped {
                    border-color: var(--neon-green);
                    background: rgba(0, 255, 0, 0.05);
                }
                .shop-toggle-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 90;
                    background: var(--neon-pink);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                    box-shadow: 0 0 20px var(--neon-pink);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                .shop-toggle-btn:hover {
                    transform: scale(1.1);
                }
                @media(max-width: 600px) {
                    .shop-panel {
                        top: auto;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        height: 50vh;
                        border-left: none;
                        border-top: 2px solid var(--neon-blue);
                        transform: translateY(100%);
                    }
                    .shop-panel.open {
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a0b2e 0%, #000 100%)',
                zIndex: -1
            }} />

            {/* SHOP TOGGLE */}
            {!gameActive && (
                <button className="shop-toggle-btn" onClick={() => setIsShopOpen(!isShopOpen)}>
                    🛒
                </button>
            )}

            {/* SHOP PANEL */}
            <div className={`shop-panel ${isShopOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: 'var(--neon-blue)' }}>ARMORY</h2>
                    <button onClick={() => setIsShopOpen(false)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ marginBottom: '20px', padding: '10px', background: '#000', borderRadius: '8px', textAlign: 'center', color: 'gold', fontWeight: 'bold' }}>
                    BALANCE: ${coins}
                </div>

                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '5px', color: '#888' }}>PADDLES</h3>
                {BRICK_SHOP_ITEMS.filter(i => i.type === 'paddle').map(item => {
                    const isUnlocked = shopState.unlocked.includes(item.id);
                    const isEquipped = shopState.equipped.brick === item.id;
                    return (
                        <div key={item.id} className={`shop-item ${isEquipped ? 'equipped' : ''}`} onClick={() => handleBuyOrEquip(item)}>
                            <div>
                                <div style={{ fontWeight: 'bold', color: item.color || 'white' }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{isUnlocked ? (isEquipped ? 'EQUIPPED' : 'OWNED') : `${item.price}`}</div>
                            </div>
                            {isUnlocked ? (
                                <div style={{ fontSize: '1.2rem' }}>{isEquipped ? '✅' : '🛡️'}</div>
                            ) : (
                                <div style={{ fontSize: '1.2rem' }}>🔒</div>
                            )}
                        </div>
                    );
                })}

                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '5px', color: '#888', marginTop: '20px' }}>BALLS</h3>
                {BRICK_SHOP_ITEMS.filter(i => i.type === 'ball').map(item => {
                    const isUnlocked = shopState.unlocked.includes(item.id);
                    const isEquipped = shopState.equipped.brick_ball === item.id;
                    return (
                        <div key={item.id} className={`shop-item ${isEquipped ? 'equipped' : ''}`} onClick={() => handleBuyOrEquip(item)}>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{isUnlocked ? (isEquipped ? 'EQUIPPED' : 'OWNED') : `${item.price}`}</div>
                            </div>
                            {isUnlocked ? (
                                <div style={{ fontSize: '1.2rem' }}>{isEquipped ? '✅' : '🔮'}</div>
                            ) : (
                                <div style={{ fontSize: '1.2rem' }}>🔒</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* HUD */}
            <div style={{
                position: 'absolute', top: 10, width: '100%',
                display: 'flex', justifyContent: 'space-between', padding: '0 30px',
                color: 'var(--neon-pink)', fontSize: '1.2rem', zIndex: 10,
                textShadow: '0 0 10px var(--neon-pink)', fontWeight: 'bold'
            }}>
                <span>SCORE: {score}</span>
                <span style={{ color: 'white' }}>LVL {level}</span>
                <span style={{ color: 'var(--neon-green)' }}>LIVES: {lives}</span>
            </div>

            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
                transform: `translate(${shake.x}px, ${shake.y}px)`,
                transition: 'transform 0.05s'
            }}>
                {/* CANVAS */}
                <div style={{
                    position: 'relative',
                    boxShadow: '0 0 50px rgba(255, 0, 85, 0.2)',
                    border: '2px solid var(--neon-blue)',
                    borderRadius: '8px',
                    background: '#000'
                }}>
                    <canvas
                        ref={canvasRef}
                        width={GAME_WIDTH}
                        height={GAME_HEIGHT}
                        style={{
                            display: 'block',
                            maxWidth: '95vw',
                            maxHeight: '85vh',
                            aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
                            width: 'auto',
                            height: 'auto'
                        }}
                    />

                    {/* OVERLAYS */}
                    {/* START SCREEN */}
                    {!gameActive && !gameOver && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <h1 style={{
                                color: 'var(--neon-pink)',
                                fontSize: '4rem',
                                textAlign: 'center',
                                textShadow: '0 0 30px var(--neon-pink)',
                                lineHeight: '1',
                                marginBottom: '2rem',
                                letterSpacing: '4px'
                            }}>
                                NEON<br />BRICKS
                            </h1>
                            <SquishyButton onClick={() => startGame(1)} style={{
                                padding: '15px 50px',
                                fontSize: '1.5rem',
                                background: 'var(--neon-green)',
                                color: 'black',
                                border: 'none',
                                fontWeight: '900',
                                boxShadow: '0 0 20px var(--neon-green)'
                            }}>
                                PLAY ARCADE
                            </SquishyButton>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <Link to="/arcade/brick-maker">
                                    <button style={{ padding: '10px', background: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        🛠️ LEVEL EDITOR
                                    </button>
                                </Link>
                                {localStorage.getItem('merchboy_custom_brick') && (
                                    <button onClick={() => startGame('custom')} style={{ padding: '10px', background: 'var(--neon-blue)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
                                        ▶️ PLAY CUSTOM
                                    </button>
                                )}
                            </div>

                            {isCustomMode && (
                                <div style={{ marginTop: '10px', color: 'var(--neon-blue)', fontSize: '0.8rem' }}>
                                    TESTING CUSTOM LEVEL
                                </div>
                            )}
                            <p style={{ marginTop: '20px', color: '#888', fontSize: '0.8rem', letterSpacing: '2px' }}>MOUSE / TOUCH TO MOVE</p>
                        </div>
                    )}

                    {/* GAME OVER */}
                    {gameOver && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <h2 style={{ fontSize: '3.5rem', color: '#ff0055', textShadow: '0 0 20px red', marginBottom: '10px' }}>GAME OVER</h2>
                            <p style={{ fontSize: '1.5rem', color: 'white', marginBottom: '30px' }}>FINAL SCORE: <span style={{ color: 'var(--neon-green)' }}>{score}</span></p>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <SquishyButton onClick={() => startGame(String(levelRef.current) === 'custom' ? 'custom' : 1)} style={{ background: 'var(--neon-blue)', color: 'black', fontWeight: 'bold' }}>RETRY</SquishyButton>
                                <Link to="/arcade">
                                    <SquishyButton style={{ background: '#333', color: '#fff' }}>EXIT</SquishyButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeonBrickBreaker;
