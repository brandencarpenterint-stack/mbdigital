import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti, triggerWinConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('snakeHighScore')) || 0);
    const [isPaused, setIsPaused] = useState(false);

    // Hooks
    const { playJump, playCrash, playCollect } = useRetroSound();
    const gameLoopRef = useRef();

    // Define moveSnake BEFORE using it in useEffect (to avoid hoisting issues with const)
    // Actually, good practice is to wrap it in useEffect or useCallback, 
    // but for simplicity in this file structure, we can verify order or use a ref for the function if needed.
    // However, defining it before the useEffect that calls it is the simplest fix.

    const endGame = () => {
        setGameOver(true);
        playCrash(); // Now defined
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score);
            triggerConfetti();
        } else {
            triggerWinConfetti();
        }

        // Award Coins (1 coin per 10 points)
        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + Math.floor(score / 10));
    };

    const spawnFood = () => {
        let newFood;
        // Simple loop protection
        let attempts = 0;
        while (attempts < 100) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Ensure food doesn't spawn on snake
            // eslint-disable-next-line no-loop-func
            const onSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
            if (!onSnake) break;
            attempts++;
        }
        setFood(newFood);
    };

    const moveSnake = () => {
        if (gameOver || isPaused) return;

        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
            default: break;
        }

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            endGame();
            return;
        }

        // Check Self Collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        newSnake.unshift(head);

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
            setScore(prev => prev + 10);
            playCollect(); // Now defined
            spawnFood();
            // Snake grows, so we don't pop tail
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isPaused) return;
            switch (e.key) {
                case 'ArrowUp': if (direction !== 'DOWN') { setDirection('UP'); playJump(); } break;
                case 'ArrowDown': if (direction !== 'UP') { setDirection('DOWN'); playJump(); } break;
                case 'ArrowLeft': if (direction !== 'RIGHT') { setDirection('LEFT'); playJump(); } break;
                case 'ArrowRight': if (direction !== 'LEFT') { setDirection('RIGHT'); playJump(); } break;
                case ' ': setIsPaused(prev => !prev); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, isPaused, playJump]);

    // Game Loop
    useEffect(() => {
        if (gameOver || isPaused) return;

        gameLoopRef.current = setInterval(() => {
            moveSnake();
        }, INITIAL_SPEED - Math.min(score * 2, 100));

        return () => clearInterval(gameLoopRef.current);
    }, [snake, direction, gameOver, isPaused, score]); // moveSnake is excluded from dep array here to avoid infinite re-creation loop but it relies on state.
    // Better pattern: use functional updates or refs, but sticking to this style:
    // We need moveSnake in the closure. 
    // Actually, because moveSnake uses the *current* state (snake), it changes every render.
    // So the interval is cleared and restarted every tick. That's fine for Snake.

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection('RIGHT');
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
    };

    // D-Pad Helper
    const handleDir = (d) => {
        if (direction === 'UP' && d === 'DOWN') return;
        if (direction === 'DOWN' && d === 'UP') return;
        if (direction === 'LEFT' && d === 'RIGHT') return;
        if (direction === 'RIGHT' && d === 'LEFT') return;
        setDirection(d);
        playJump();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', color: '#00ffaa', width: '100%', maxWidth: '100%' }}>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '2.5rem', margin: '10px 0', textAlign: 'center' }}>NEON SNAKE</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px', marginBottom: '10px', fontSize: '1.2rem' }}>
                <span>SCORE: {score}</span>
                <span>HIGH: {highScore}</span>
            </div>

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1/1',
                backgroundColor: '#000',
                border: '4px solid #00ffaa',
                boxShadow: '0 0 20px #00ffaa40',
                touchAction: 'none' // Prevent scroll while swiping if we added swipe (we are using buttons for now)
            }}>
                {/* Snake */}
                {snake.map((segment, index) => (
                    <div key={`${segment.x}-${segment.y}`} style={{
                        position: 'absolute',
                        left: `${segment.x * 5}%`,
                        top: `${segment.y * 5}%`,
                        width: '5%',
                        height: '5%',
                        backgroundColor: index === 0 ? '#ccffdd' : '#00ffaa',
                        boxShadow: '0 0 5px #00ffaa',
                        borderRadius: index === 0 ? '4px' : '2px',
                        zIndex: 2
                    }} />
                ))}

                {/* Food */}
                <div style={{
                    position: 'absolute',
                    left: `${food.x * 5}%`,
                    top: `${food.y * 5}%`,
                    width: '5%',
                    height: '5%',
                    backgroundImage: 'url(/assets/boy-logo.png)',
                    backgroundSize: 'cover',
                    borderRadius: '50%',
                    zIndex: 1,
                    animation: 'pulse 1s infinite'
                }} />

                {/* Game Over */}
                {gameOver && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}>
                        <h2 style={{ fontSize: '3rem', color: '#ff0055', textShadow: '0 0 10px red' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Final Score: {score}</p>
                        <SquishyButton onClick={restartGame} style={{
                            padding: '10px 20px',
                            fontSize: '1.2rem',
                            backgroundColor: '#00ffaa',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold'
                        }}>
                            PLAY AGAIN
                        </SquishyButton>
                        <Link to="/arcade" style={{ marginTop: '15px', color: '#fff', textDecoration: 'underline' }}>Back to Arcade</Link>
                    </div>
                )}
            </div>

            {/* Mobile Controls (D-Pad) */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '10px', justifyContent: 'center' }}>
                <div />
                <SquishyButton onClick={() => handleDir('UP')} style={{ width: '60px', height: '60px', background: '#333', borderRadius: '10px', fontSize: '24px' }}>⬆️</SquishyButton>
                <div />
                <SquishyButton onClick={() => handleDir('LEFT')} style={{ width: '60px', height: '60px', background: '#333', borderRadius: '10px', fontSize: '24px' }}>⬅️</SquishyButton>
                <SquishyButton onClick={() => handleDir('DOWN')} style={{ width: '60px', height: '60px', background: '#333', borderRadius: '10px', fontSize: '24px' }}>⬇️</SquishyButton>
                <SquishyButton onClick={() => handleDir('RIGHT')} style={{ width: '60px', height: '60px', background: '#333', borderRadius: '10px', fontSize: '24px' }}>➡️</SquishyButton>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
                <p>Use Arrow Keys or Buttons to Move • Space to Pause</p>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '80px', marginTop: '10px', opacity: 0.5 }} />
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.9); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(0.9); }
                }
            `}</style>
        </div>
    );
};

export default SnakeGame;
