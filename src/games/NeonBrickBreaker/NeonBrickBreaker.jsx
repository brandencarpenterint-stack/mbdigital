import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { LeaderboardService } from '../../services/LeaderboardService';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 15; // Slightly larger for logo
const BRICK_ROWS = 5;
const BRICK_COLS = 8;

const NeonBrickBreaker = () => {
    const { updateStat, incrementStat } = useGamification() || { updateStat: () => { }, incrementStat: () => { } };
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('brickHighScore')) || 0);
    const [gameOver, setGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);

    const gameActiveRef = useRef(false);
    const ballImgRef = useRef(null);

    const { playBeep, playCrash, playCollect, playWin } = useRetroSound();

    const gameState = useRef({
        paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
        balls: [], // {x, y, dx, dy, rot}
        bricks: [],
        powerups: [], // {x, y, type}
        particles: [], // {x, y, dx, dy, life, color}
        animationId: null
    });

    useEffect(() => {
        const img = new Image();
        img.src = '/assets/boy-logo.png';
        ballImgRef.current = img;
    }, []);

    const initBricks = () => {
        const bricks = [];
        const brickWidth = GAME_WIDTH / BRICK_COLS;
        const brickHeight = 20;

        for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLS; c++) {
                bricks.push({
                    x: c * brickWidth,
                    y: r * brickHeight + 40,
                    width: brickWidth - 4,
                    height: brickHeight - 4,
                    active: true,
                    color: `hsl(${c * 45 + r * 20}, 100%, 50%)`
                });
            }
        }
        return bricks;
    };

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameActive(true);
        gameActiveRef.current = true;

        gameState.current = {
            paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
            balls: [{ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 30, dx: 4, dy: -4, rot: 0 }],
            bricks: initBricks(),
            powerups: [],
            particles: [],
            animationId: null
        };
        requestAnimationFrame(gameLoop);
    };

    const spawnParticles = (x, y, color) => {
        for (let i = 0; i < 8; i++) {
            gameState.current.particles.push({
                x, y,
                dx: (Math.random() - 0.5) * 5,
                dy: (Math.random() - 0.5) * 5,
                life: 1.0,
                color
            });
        }
    };

    const activateMultiball = () => {
        const newBalls = [];
        gameState.current.balls.forEach(ball => {
            // Clone 2 more balls per existing ball
            newBalls.push({ ...ball, dx: ball.dx * 0.8 + 1, dy: ball.dy * 0.8 });
            newBalls.push({ ...ball, dx: ball.dx * 0.8 - 1, dy: ball.dy * 0.8 });
        });
        gameState.current.balls.push(...newBalls);
        playWin(); // Powerup sound
        triggerConfetti();
    };

    const endGame = (win = false) => {
        setGameActive(false);
        gameActiveRef.current = false;
        setGameOver(true);
        cancelAnimationFrame(gameState.current.animationId);

        if (win) {
            playWin();
            triggerConfetti();
        } else {
            playCrash();
        }

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('brickHighScore', score);
            if (!win) triggerConfetti();
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

        // 1. Update Balls
        const { balls, paddleX } = state;

        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.x += ball.dx;
            ball.y += ball.dy;
            ball.rot += 0.1;

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
                ball.dx = hitPoint * 0.15; // Curve based on where it hit
                ball.dy = -Math.abs(ball.dy); // Force up
                playBeep();
            }

            // Death
            if (ball.y > GAME_HEIGHT) {
                balls.splice(i, 1);
            }
        }

        if (balls.length === 0) {
            endGame(false);
            return;
        }

        // 2. Bricks & Powerups
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
                    setScore(prev => prev + 10);
                    playCollect();
                    spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);

                    // 15% Chance for Powerup
                    if (Math.random() < 0.15) {
                        state.powerups.push({ x: brick.x + brick.width / 2, y: brick.y, type: 'multiball' });
                    }
                }
            });
        });

        if (activeBricks === 0) {
            endGame(true);
            return;
        }

        // 3. Update Powerups
        for (let i = state.powerups.length - 1; i >= 0; i--) {
            const p = state.powerups[i];
            p.y += 2; // Fall down

            // Catch
            if (p.y > GAME_HEIGHT - PADDLE_HEIGHT - 10 &&
                p.y < GAME_HEIGHT - 10 &&
                p.x > state.paddleX &&
                p.x < state.paddleX + PADDLE_WIDTH) {
                if (p.type === 'multiball') activateMultiball();
                state.powerups.splice(i, 1);
            }
            // Miss
            else if (p.y > GAME_HEIGHT) {
                state.powerups.splice(i, 1);
            }
        }

        // 4. Update Particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const p = state.particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.05;
            if (p.life <= 0) state.particles.splice(i, 1);
        }

        // --- DRAW ---
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Particles
        state.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
        });
        ctx.globalAlpha = 1;

        // Bricks
        state.bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        // Powerups (⚡ Bolt)
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        state.powerups.forEach(p => {
            ctx.fillText('⚡', p.x, p.y);
        });

        // Paddle
        ctx.fillStyle = '#00ffaa';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffaa';
        ctx.fillRect(state.paddleX, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.shadowBlur = 0;

        // Balls (Logos)
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

        state.animationId = requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!gameActiveRef.current) return;
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
        };

        const handleKeyDown = (e) => {
            if (!gameActiveRef.current) return;
            if (e.key === 'ArrowLeft') gameState.current.paddleX = Math.max(0, gameState.current.paddleX - 40);
            if (e.key === 'ArrowRight') gameState.current.paddleX = Math.min(GAME_WIDTH - PADDLE_WIDTH, gameState.current.paddleX + 40);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Orientation Logic
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    useEffect(() => {
        const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    if (isPortrait && window.innerWidth < 768) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: '#111', color: '#cc00ff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, textAlign: 'center', padding: '20px'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔄</div>
                <h1>Please Rotate Your Phone</h1>
                <p>Neon Brick Breaker requires Landscape Mode</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', // Center vertically
            width: '100vw', // Full width
            height: '100vh', // Full height
            position: 'fixed', // Fix to screen
            top: 0,
            left: 0,
            background: '#111',
            color: '#cc00ff',
            zIndex: 100 // Top of standard layout
        }}>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '2rem', margin: '5px 0' }}>NEON BRICK BREAKER</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90vw', maxWidth: '600px', marginBottom: '5px', fontSize: '1.2rem' }}>
                <span>SCORE: {score}</span>
                <span>HIGH: {highScore}</span>
            </div>

            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    // Touch Support
                    onTouchMove={(e) => {
                        if (!gameActiveRef.current) return;
                        e.preventDefault(); // Stop scroll
                        const rect = e.target.getBoundingClientRect();
                        const x = e.touches[0].clientX - rect.left;
                        // Scale for canvas resolution vs css size
                        const scaleX = GAME_WIDTH / rect.width;
                        const canvasX = x * scaleX;

                        gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, canvasX - PADDLE_WIDTH / 2));
                    }}
                    onTouchStart={(e) => {
                        if (!gameActiveRef.current) return;
                        // Optional: Allow tap to snap paddle
                        const rect = e.target.getBoundingClientRect();
                        const x = e.touches[0].clientX - rect.left;
                        const scaleX = GAME_WIDTH / rect.width;
                        const canvasX = x * scaleX;
                        gameState.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, canvasX - PADDLE_WIDTH / 2));
                    }}
                    style={{
                        border: '4px solid #cc00ff',
                        background: 'black',
                        borderRadius: '10px',
                        cursor: 'none',
                        touchAction: 'none',
                        maxWidth: '95vw', // Responsive width
                        maxHeight: '80vh', // Responsive height
                        width: 'auto',
                        height: 'auto'
                    }}
                />

                {!gameActive && !gameOver && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <SquishyButton onClick={startGame} style={{ padding: '15px 40px', fontSize: '1.5rem', background: '#cc00ff', border: 'none', borderRadius: '10px', color: 'white' }}>
                            START GAME
                        </SquishyButton>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '3rem', color: '#cc00ff' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Final Score: {score}</p>
                        <SquishyButton onClick={startGame} style={{ marginBottom: '10px', padding: '10px 30px', background: '#cc00ff', border: 'none', borderRadius: '5px', color: 'white' }}>Play Again</SquishyButton>
                        <Link to="/arcade" style={{ color: 'white', textDecoration: 'underline' }}>Exit to Arcade</Link>
                    </div>
                )}
            </div>
            <p style={{ marginTop: '5px', color: '#666', fontSize: '0.8rem' }}>Drag to Move. Catch ⚡ for MULTIBALL!</p>
        </div>
    );
};

export default NeonBrickBreaker;
