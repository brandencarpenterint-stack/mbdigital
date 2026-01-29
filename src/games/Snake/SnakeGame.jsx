import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
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
    const { shopState } = useGamification() || {};
    const gameLoopRef = useRef();

    // Swipe Refs
    const touchStart = useRef({ x: 0, y: 0 });
    const touchEnd = useRef({ x: 0, y: 0 });


    const getSegmentStyle = (index) => {
        const skin = shopState?.equipped?.snake || 'snake_default';

        // Base Style
        let style = {
            position: 'absolute',
            left: `${snake[index].x * 5}%`,
            top: `${snake[index].y * 5}%`,
            width: '5%',
            height: '5%',
            borderRadius: index === 0 ? '4px' : '2px',
            zIndex: 2,
            boxShadow: '0 0 5px rgba(0,0,0,0.5)'
        };

        if (skin === 'snake_gold') {
            style.backgroundColor = index === 0 ? '#fff' : '#FFD700';
            style.boxShadow = '0 0 10px #FFD700';
        } else if (skin === 'snake_rainbow') {
            style.backgroundColor = `hsl(${(index * 20) % 360}, 100%, 50%)`;
            style.boxShadow = '0 0 5px white';
        } else if (skin === 'snake_ghost') {
            style.backgroundColor = index === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
            style.border = '1px solid white';
        } else {
            // Default
            style.backgroundColor = index === 0 ? '#ccffdd' : '#00ffaa';
            style.boxShadow = '0 0 5px #00ffaa';
        }
        return style;
    };

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

    // Swipe Handlers
    const handleTouchStart = (e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        touchEnd.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        handleSwipe();
    };

    const handleSwipe = () => {
        const dx = touchEnd.current.x - touchStart.current.x;
        const dy = touchEnd.current.y - touchStart.current.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal
            if (Math.abs(dx) > 30) { // Threshold
                if (dx > 0) handleDir('RIGHT');
                else handleDir('LEFT');
            }
        } else {
            // Vertical
            if (Math.abs(dy) > 30) {
                if (dy > 0) handleDir('DOWN');
                else handleDir('UP');
            }
        }
    };

    return (
        <div className="page-enter" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minHeight: '100vh', padding: '20px', paddingBottom: '120px',
            color: 'var(--neon-green)', fontFamily: '"Orbitron", sans-serif'
        }}>
            <h1 style={{
                fontSize: '2.5rem', margin: '0 0 20px 0', textAlign: 'center',
                textShadow: '0 0 20px var(--neon-green)', letterSpacing: '2px'
            }}>NEON SNAKE</h1>

            <div className="glass-panel" style={{
                display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px',
                marginBottom: '20px', padding: '15px 25px', fontSize: '1.2rem',
                border: '1px solid var(--neon-green)', background: 'rgba(0, 20, 0, 0.6)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>SCORE</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>HIGH SCORE</span>
                    <div style={{ fontSize: '1.5rem', color: 'var(--neon-gold)', textShadow: '0 0 10px var(--neon-gold)' }}>{highScore}</div>
                </div>
            </div>

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1/1',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid var(--neon-green)',
                borderRadius: '10px',
                boxShadow: '0 0 30px rgba(0, 255, 170, 0.3), inset 0 0 50px rgba(0, 255, 170, 0.1)',
                touchAction: 'none', // Prevent scroll while swiping
                backgroundImage: 'linear-gradient(rgba(0, 255, 170, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 170, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                overflow: 'hidden'
            }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Snake */}
                {snake.map((segment, index) => (
                    <div key={`${segment.x}-${segment.y}`} style={getSegmentStyle(index)} />
                ))}

                {/* Food */}
                <div style={{
                    position: 'absolute',
                    left: `${food.x * 5}%`,
                    top: `${food.y * 5}%`,
                    width: '5%',
                    height: '5%',
                    zIndex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        width: '140%', height: '140%',
                        background: 'radial-gradient(circle, #ff0055 30%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite alternate',
                        boxShadow: '0 0 10px #ff0055'
                    }} />
                    {/* Inner Core */}
                    <div style={{ width: '40%', height: '40%', background: '#fff', borderRadius: '50%', position: 'absolute' }} />
                </div>

                {/* Game Over */}
                {gameOver && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10
                    }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#ff0055', textShadow: '0 0 20px #ff0055', marginBottom: '10px' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#ccc' }}>SCORE: <span style={{ color: 'white' }}>{score}</span></p>

                        <button
                            onClick={restartGame}
                            className="squishy-btn"
                            style={{
                                padding: '15px 40px', fontSize: '1.2rem',
                                background: 'var(--neon-green)', color: 'black',
                                border: 'none', borderRadius: '30px', fontWeight: '900',
                                boxShadow: '0 0 20px var(--neon-green)'
                            }}
                        >
                            RETRY
                        </button>
                        <Link to="/arcade" style={{ marginTop: '20px', color: '#888', textDecoration: 'none', fontSize: '0.8rem' }}>EXIT TO ARCADE</Link>
                    </div>
                )}
            </div>

            {/* Mobile Controls (D-Pad) */}
            <div style={{
                marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gap: '10px',
                justifyContent: 'center'
            }}>
                <div />
                <button
                    onPointerDown={() => handleDir('UP')}
                    className="glass-panel"
                    style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}
                >⬆️</button>
                <div />

                <button
                    onPointerDown={() => handleDir('LEFT')}
                    className="glass-panel"
                    style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}
                >⬅️</button>
                <button
                    onPointerDown={() => handleDir('DOWN')}
                    className="glass-panel"
                    style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}
                >⬇️</button>
                <button
                    onPointerDown={() => handleDir('RIGHT')}
                    className="glass-panel"
                    style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}
                >➡️</button>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center', color: '#555', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>SWIPE or TAP CONTROLS</span>
                <span style={{ width: '1px', height: '10px', background: '#333' }}></span>
                <span>SPACE TO PAUSE</span>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(1.2); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SnakeGame;
