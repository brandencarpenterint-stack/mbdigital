import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 3;
const PIPE_SPACING = 200;
const BIRD_SIZE = 40;

const CHARACTERS = [
    { id: 'boy', type: 'image', content: '/assets/boy-logo.png', name: 'MerchBoy', rarity: 'Common' },
    { id: 'brokid', type: 'image', content: '/assets/brokid-logo.png', name: 'BroKid', rarity: 'Common' },
    { id: 'cat', type: 'emoji', content: '🐱', name: 'Kitty', rarity: 'Common' },
    { id: 'dog', type: 'emoji', content: '🐶', name: 'Puppy', rarity: 'Common' },
    { id: 'frog', type: 'emoji', content: '🐸', name: 'Froggo', rarity: 'Common' },
    { id: 'unicorn', type: 'emoji', content: '🦄', name: 'Uni', rarity: 'Legendary' },
    { id: 'rainbow', type: 'emoji', content: '🌈', name: 'Pride Heart', rarity: 'Rare' },
    { id: 'ghost', type: 'emoji', content: '👻', name: 'Spooky', rarity: 'Rare' },
    { id: 'zombie', type: 'emoji', content: '🧟', name: 'Walker', rarity: 'Rare' },
    { id: 'vampire', type: 'emoji', content: '🧛', name: 'Drac', rarity: 'Rare' },
    { id: 'clown', type: 'emoji', content: '🤡', name: 'Bozo', rarity: 'Uncommon' },
    { id: 'poop', type: 'emoji', content: '💩', name: 'Stinky', rarity: 'Common' },
    { id: 'hotdog', type: 'emoji', content: '🌭', name: 'Glizzy', rarity: 'Uncommon' },
    { id: 'taco', type: 'emoji', content: '🌮', name: 'Crunch', rarity: 'Uncommon' },
    { id: 'burger', type: 'emoji', content: '🍔', name: 'Beefy', rarity: 'Uncommon' },
    { id: 'alien', type: 'emoji', content: '👽', name: 'Paul', rarity: 'Rare' },
    { id: 'robot', type: 'emoji', content: '🤖', name: 'BeepBoop', rarity: 'Rare' },
    { id: 'cowboy', type: 'emoji', content: '🤠', name: 'Sheriff', rarity: 'Uncommon' },
    { id: 'monster', type: 'emoji', content: '👾', name: '8-Bit', rarity: 'Legendary' },
    { id: 'diamond', type: 'emoji', content: '💎', name: 'Richie', rarity: 'Legendary' },
    { id: 'crown', type: 'emoji', content: '👑', name: 'King', rarity: 'Legendary' },
    { id: 'catdog', type: 'emoji', content: '😺', name: 'CatDog?', rarity: 'Legendary' }, // Pretend CatDog
];

const FlappyMascot = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('flappyHighScore')) || 0);
    const [gameOver, setGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);

    // Gacha State
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('arcadeCoins')) || 0);
    const [unlockedIds, setUnlockedIds] = useState(JSON.parse(localStorage.getItem('flappyUnlocked')) || ['boy']);
    const [selectedId, setSelectedId] = useState(localStorage.getItem('flappySelected') || 'boy');

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
        img1.src = '/assets/boy-logo.png';
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

    const unlockCharacter = () => {
        if (coins < 500) {
            alert("Not enough coins! You need 500.");
            return;
        }

        const locked = CHARACTERS.filter(c => !unlockedIds.includes(c.id));
        if (locked.length === 0) {
            alert("You've unlocked everyone! 🏆");
            return;
        }

        const randomChar = locked[Math.floor(Math.random() * locked.length)];
        const newUnlocked = [...unlockedIds, randomChar.id];
        setUnlockedIds(newUnlocked);
        localStorage.setItem('flappyUnlocked', JSON.stringify(newUnlocked));

        // Deduct Coins
        const newCoins = coins - 500;
        localStorage.setItem('arcadeCoins', newCoins);
        setCoins(newCoins);

        // Auto-select
        setSelectedId(randomChar.id);
        localStorage.setItem('flappySelected', randomChar.id);

        triggerConfetti();
        playWin();
        alert(`You unlocked: ${randomChar.name} ${randomChar.type === 'emoji' ? randomChar.content : ''}!`);
    };

    const selectCharacter = (id) => {
        setSelectedId(id);
        localStorage.setItem('flappySelected', id);
        playBeep();
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

        // 1. Draw Wings (BACK) - Before Body
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        // Shift wing slightly back and up
        ctx.ellipse(-10, -5, 12, 8, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

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
            const img = charData.id === 'boy' ? birdImgRef.current : brokidImgRef.current;
            if (img && img.complete) {
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
                    style={{ border: '4px solid #fff', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', cursor: 'pointer' }}
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

            {/* GACHA SHOP */}
            <div style={{ marginTop: '20px', width: '400px', background: '#222', padding: '15px', borderRadius: '10px', border: '2px solid #555' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'gold', margin: 0 }}>CHOOSE PILOT</h3>
                    <SquishyButton onClick={unlockCharacter} style={{ fontSize: '0.9rem', background: 'gold', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                        UNLOCK RANDOM (500 🪙)
                    </SquishyButton>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                    {CHARACTERS.map(char => {
                        const isUnlocked = unlockedIds.includes(char.id);
                        const isSelected = selectedId === char.id;
                        return (
                            <button
                                key={char.id}
                                onClick={() => isUnlocked && selectCharacter(char.id)}
                                title={isUnlocked ? char.name : 'Allocated'}
                                style={{
                                    background: isSelected ? '#ff9900' : (isUnlocked ? '#333' : '#111'),
                                    border: isSelected ? '2px solid white' : '1px solid #444',
                                    borderRadius: '5px',
                                    height: '50px',
                                    fontSize: '1.5rem',
                                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                    opacity: isUnlocked ? 1 : 0.3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px'
                                }}
                            >
                                {isUnlocked ? (
                                    char.type === 'image' ?
                                        <img src={char.content} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> :
                                        char.content
                                ) : '?'}
                            </button>
                        );
                    })}
                </div>
            </div>

            <p style={{ marginTop: '10px', color: '#666' }}>Space or Click to Flap</p>
        </div>
    );
};

export default FlappyMascot;
