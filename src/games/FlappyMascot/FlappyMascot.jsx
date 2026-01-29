import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 3;
const PIPE_SPACING = 200;
const BIRD_SIZE = 40;

const CHARACTERS = [
    { id: 'flappy_boy', type: 'image', content: '/assets/merchboy_face.png', name: 'MerchBoy' },
    { id: 'flappy_brokid', type: 'image', content: '/assets/brokid-logo.png', name: 'BroKid' },
    { id: 'flappy_cat', type: 'emoji', content: '🐱', name: 'Kitty' },
    { id: 'flappy_dog', type: 'emoji', content: '🐶', name: 'Puppy' },
    { id: 'flappy_frog', type: 'emoji', content: '🐸', name: 'Froggo' },
    { id: 'flappy_unicorn', type: 'emoji', content: '🦄', name: 'Uni' },
    { id: 'flappy_rainbow', type: 'emoji', content: '🌈', name: 'Pride' },
    { id: 'flappy_ghost', type: 'emoji', content: '👻', name: 'Spooky' },
    { id: 'flappy_zombie', type: 'emoji', content: '🧟', name: 'Walker' }, // Missing in Shop? Add it there later if needed
    { id: 'flappy_vampire', type: 'emoji', content: '🧛', name: 'Drac' }, // Missing in Shop
    { id: 'flappy_clown', type: 'emoji', content: '🤡', name: 'Bozo' }, // Missing in Shop
    { id: 'flappy_poop', type: 'emoji', content: '💩', name: 'Stinky' },
    { id: 'flappy_hotdog', type: 'emoji', content: '🌭', name: 'Glizzy' }, // Missing
    { id: 'flappy_taco', type: 'emoji', content: '🌮', name: 'Crunch' }, // Missing
    { id: 'flappy_burger', type: 'emoji', content: '🍔', name: 'Beefy' }, // Missing
    { id: 'flappy_alien', type: 'emoji', content: '👽', name: 'Paul' },
    { id: 'flappy_robot', type: 'emoji', content: '🤖', name: 'Bot' },
    { id: 'flappy_cowboy', type: 'emoji', content: '🤠', name: 'Sheriff' },
    { id: 'flappy_monster', type: 'emoji', content: '👾', name: '8-Bit' },
    { id: 'flappy_diamond', type: 'emoji', content: '💎', name: 'Richie' },
    { id: 'flappy_crown', type: 'emoji', content: '👑', name: 'King' }, // Missing
    { id: 'flappy_catdog', type: 'emoji', content: '😺', name: 'CatDog' }, // Missing
];

const FlappyMascot = () => {
    const canvasRef = useRef(null);
    // Global Shop State
    const { shopState, updateStat, incrementStat } = useGamification() || {};
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('flappyHighScore')) || 0);
    const [gameOver, setGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('arcadeCoins')) || 0);

    // Character Logic
    // Default to 'flappy_boy' if nothing equipped, but strip prefix for internal lookup if needed
    // OR just update lookups to match global IDs.
    // Global IDs are 'flappy_boy', 'flappy_cat', etc.
    // Local IDs were 'boy', 'cat'.
    // I need to update the CHARACTERS array or mapping.
    // Let's update CHARACTERS array to match Global IDs.

    // Initial Sync
    const selectedId = shopState?.equipped?.flappy || 'flappy_boy';

    // Sync Ref
    const gameActiveRef = useRef(false);

    const { playJump, playCrash, playCollect, playWin, playBeep } = useRetroSound();

    const birdImgRef = useRef(null);
    const brokidImgRef = useRef(null);

    // Game State
    const gameState = useRef({
        birdY: GAME_HEIGHT / 2,
        velocity: 0,
        pipes: [], // {x, topHeight}
        lastPipeTime: 0,
        animationId: null
    });

    useEffect(() => {
        // Preload images
        const img1 = new Image();
        img1.src = '/assets/merchboy_face.png';
        birdImgRef.current = img1;

        const img2 = new Image();
        img2.src = '/assets/brokid-logo.png';
        brokidImgRef.current = img2;

        // Listen for coin updates
        const handleStorage = () => {
            setCoins(parseInt(localStorage.getItem('arcadeCoins')) || 0);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);

    }, []);

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameActive(true);
        gameActiveRef.current = true;

        gameState.current = {
            birdY: GAME_HEIGHT / 2,
            velocity: 0,
            pipes: [{ x: GAME_WIDTH, topHeight: 200 }],
            lastPipeTime: 0,
            animationId: null
        };
        requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
        setGameActive(false);
        gameActiveRef.current = false;
        setGameOver(true);
        cancelAnimationFrame(gameState.current.animationId);
        playCrash();

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappyHighScore', score);
            triggerConfetti();
        }

        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        const newCoins = currentCoins + Math.floor(score);
        localStorage.setItem('arcadeCoins', newCoins);
        setCoins(newCoins);
    };



    const gameLoop = () => {
        if (!gameActiveRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const state = gameState.current;

        // Clear
        ctx.fillStyle = '#70c5ce'; // Sky blue
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Update Bird
        state.velocity += GRAVITY;
        state.birdY += state.velocity;

        // Floor/Ceiling Collision
        if (state.birdY > GAME_HEIGHT - BIRD_SIZE || state.birdY < 0) {
            endGame();
            return;
        }

        // Update Pipes
        state.pipes.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
        });

        // Add Pipe
        if (state.pipes[state.pipes.length - 1].x < GAME_WIDTH - PIPE_SPACING) {
            const minHeight = 50;
            const maxHeight = GAME_HEIGHT - 150 - minHeight;
            const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            state.pipes.push({ x: GAME_WIDTH, topHeight: height });
        }

        // Remove off-screen pipes
        if (state.pipes[0].x < -60) {
            state.pipes.shift();
            setScore(prev => prev + 1);
            playCollect(); // Point sound
        }

        // Check Collisions
        state.pipes.forEach(pipe => {
            // Horizontal Hit?
            if (50 + BIRD_SIZE > pipe.x && 50 < pipe.x + 60) {
                // Vertical Hit?
                if (state.birdY < pipe.topHeight || state.birdY + BIRD_SIZE > pipe.topHeight + 150) {
                    endGame();
                }
            }
        });


        // Draw Pipes
        ctx.fillStyle = '#73bf2e';
        ctx.strokeStyle = '#558c22';
        ctx.lineWidth = 4;
        state.pipes.forEach(pipe => {
            // Top Pipe
            ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, 60, pipe.topHeight);
            // Cap
            ctx.fillRect(pipe.x - 4, pipe.topHeight - 20, 68, 20);
            ctx.strokeRect(pipe.x - 4, pipe.topHeight - 20, 68, 20);

            // Bottom Pipe
            const bottomY = pipe.topHeight + 150;
            ctx.fillRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
            ctx.strokeRect(pipe.x, bottomY, 60, GAME_HEIGHT - bottomY);
            // Cap
            ctx.fillRect(pipe.x - 4, bottomY, 68, 20);
            ctx.strokeRect(pipe.x - 4, bottomY, 68, 20);
        });

        // --- DRAW CHARACTER ---
        const birdX = 50;
        const birdY = state.birdY;
        const charData = CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0];

        ctx.save();
        ctx.translate(birdX + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);

        // Rotation
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (state.velocity * 0.1)));
        ctx.rotate(rotation);

        // 1. Draw Wings (BACK) - Animated Cute Wing
        // Flutter effect: Fast sine wave
        const flutter = Math.sin(Date.now() / 50) * 0.5; // Fast flutter
        const wingAngle = (state.velocity * 0.1) + flutter;

        ctx.save();
        ctx.translate(-12, 5); // Back/Low position
        ctx.rotate(wingAngle);

        // Cute Small Wing (Simple Oval)
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000'; // Black outline for cartoon look
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // 2. Draw Legs (BACK)
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-5, 15);
        ctx.lineTo(-10, 25);
        ctx.moveTo(5, 15);
        ctx.lineTo(10, 25);
        ctx.stroke();

        // 3. Draw Body
        if (charData.type === 'image') {
            const img = charData.id === 'flappy_boy' ? birdImgRef.current : brokidImgRef.current;
            if (img && img.complete) {
                // Determine source rect if sprite sheet, but here we assume single image
                // Use source dimensions to prevent squashing if not square?
                // For now, simple draw.
                ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
            } else {
                ctx.fillStyle = 'white';
                ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
            }
        } else {
            // Emoji
            ctx.font = '35px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Adjust emoji position slightly to center it
            ctx.fillText(charData.content, 0, 2);
        }

        // 4. Draw Wing (FRONT - Flapping)
        // Only if user desires? "put wings on back" implies removing front? 
        // User said "put the wings on the back". I will remove Front Wing for cleaner face visual.
        // Or make it very subtle. Let's remove front wing to ensure face visibility as requested.

        ctx.restore();

        // Ground
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
        ctx.beginPath();
        ctx.moveTo(0, GAME_HEIGHT - 20);
        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - 20);
        ctx.strokeStyle = '#73bf2e';
        ctx.stroke();

        state.animationId = requestAnimationFrame(gameLoop);
    };

    const handleInput = () => {
        if (!gameActiveRef.current) return;
        gameState.current.velocity = JUMP_STRENGTH;
        playJump();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') handleInput();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: '#70c5ce' }}>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '3rem', margin: '10px 0' }}>FLAPPY MASCOT</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px', marginBottom: '10px', fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>
                <span>SCORE: {score}</span>
                <span>COINS: {coins}</span>
            </div>

            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    onMouseDown={handleInput}
                    onTouchStart={(e) => {
                        // Prevent default to avoid scroll or ghost clicks
                        if (e.cancelable) e.preventDefault();
                        handleInput();
                    }}
                    style={{ border: '4px solid #fff', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', cursor: 'pointer', touchAction: 'none' }}
                />

                {!gameActive && !gameOver && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <SquishyButton onClick={startGame} style={{ padding: '15px 40px', fontSize: '1.5rem', background: '#ff9900', border: 'none', borderRadius: '10px', color: 'white' }}>
                            FLY!
                        </SquishyButton>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '3rem', color: '#ff9900' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'white' }}>Score: {score}</p>
                        <SquishyButton onClick={startGame} style={{ marginBottom: '10px', padding: '10px 30px', background: '#ff9900', border: 'none', borderRadius: '5px', color: 'white' }}>Try Again</SquishyButton>
                        <Link to="/arcade" style={{ color: 'white', textDecoration: 'underline' }}>Back to Base</Link>
                    </div>
                )}
            </div>

            {/* PILOT SELECTOR */}
            <div style={{ marginTop: '20px', width: '400px', textAlign: 'center' }}>
                <p style={{ color: '#fff' }}>Playing as: <span style={{ color: 'gold', fontWeight: 'bold' }}>
                    {CHARACTERS.find(c => c.id === selectedId)?.name || 'Pilot'}
                </span></p>
                <Link to="/shop" style={{ display: 'inline-block', padding: '10px 20px', background: '#333', color: 'gold', borderRadius: '10px', textDecoration: 'none', border: '1px solid gold' }}>
                    🛍️ Unlock Pilots in Global Shop
                </Link>
            </div>

            <p style={{ marginTop: '10px', color: '#666' }}>Space or Click to Flap</p>
        </div>
    );
};

export default FlappyMascot;
