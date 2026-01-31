import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useInventory } from '../../context/InventoryContext';
import { useSettings } from '../../context/SettingsContext';

const SubHunterGame = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const { updateStats, addCoins } = useGamification() || {};
    const { incrementStat } = useInventory() || { incrementStat: () => { } };
    const { soundEnabled } = useSettings();

    // Game State
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('subHunterHighScore')) || 0);

    // Engine Refs
    const stateRef = useRef({
        player: { x: 50, y: 300, width: 60, height: 40, dy: 0 },
        bullets: [],
        enemies: [],
        particles: [],
        lastEnemyTime: 0,
        score: 0,
        isGameOver: false,
        frameCount: 0
    });

    // Loop
    useEffect(() => {
        let animationFrameId;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const loop = (timestamp) => {
            if (gameState === 'playing') {
                update(timestamp, canvas);
            }
            draw(ctx, canvas);
            animationFrameId = requestAnimationFrame(loop);
        };

        if (gameState !== 'start') {
            animationFrameId = requestAnimationFrame(loop);
        } else {
            // Initial Draw
            draw(ctx, canvas);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState]);

    const startGame = () => {
        stateRef.current = {
            player: { x: 50, y: 300, width: 60, height: 40, dy: 0 },
            bullets: [],
            enemies: [], // { x, y, type: 'N'|'S'|'A', color }
            particles: [],
            lastEnemyTime: 0,
            score: 0,
            isGameOver: false,
            frameCount: 0
        };
        setScore(0);
        setGameState('playing');
    };

    // UPDATE LOGIC
    const update = (time, canvas) => {
        const state = stateRef.current;
        state.frameCount++;

        // 1. Player Movement (Gravity is weak here, it's a sub)
        // Actually, let's do flappy style or direct control? 
        // Direct control (momentum) feels better for a sub.
        state.player.y += state.player.dy;
        state.player.dy *= 0.95; // Friction

        // Bounds
        if (state.player.y < 0) { state.player.y = 0; state.player.dy = 1; }
        if (state.player.y > canvas.height - state.player.height) {
            state.player.y = canvas.height - state.player.height;
            state.player.dy = -1;
        }

        // 2. Bullets
        state.bullets.forEach(b => b.x += 10);
        state.bullets = state.bullets.filter(b => b.x < canvas.width);

        // 3. Enemies Spawn
        if (time - state.lastEnemyTime > 1500) { // Every 1.5s
            const types = [
                { char: 'N', color: '#E50914' }, // Netflix
                { char: 'S', color: '#1DB954' }, // Spotify
                { char: 'A', color: '#00A8E1' }, // Amazon
                { char: 'H', color: '#1CE783' }  // Hulu
            ];
            const type = types[Math.floor(Math.random() * types.length)];
            state.enemies.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 50),
                width: 40,
                height: 40,
                type: type.char,
                color: type.color,
                hp: 1
            });
            state.lastEnemyTime = time;
        }

        // 4. Enemies Move
        state.enemies.forEach(e => {
            e.x -= 3 + (state.score / 100); // Speed up slightly over time
        });

        // 5. Collisions
        // Bullet Hit Enemy
        state.bullets.forEach(b => {
            state.enemies.forEach(e => {
                if (!b.hit && !e.dead &&
                    b.x < e.x + e.width &&
                    b.x + b.width > e.x &&
                    b.y < e.y + e.height &&
                    b.y + b.height > e.y) {

                    b.hit = true;
                    e.dead = true;
                    e.hp--;
                    createExplosion(e.x, e.y, e.color);
                    state.score += 10;
                    setScore(state.score);
                    // Sound
                    playSound('hit');
                }
            });
        });

        // Player Hit Enemy
        state.enemies.forEach(e => {
            if (!e.dead &&
                state.player.x < e.x + e.width &&
                state.player.x + state.player.width > e.x &&
                state.player.y < e.y + e.height &&
                state.player.y + state.player.height > e.y) {
                gameOver();
            }
        });

        // Cleanup
        state.enemies = state.enemies.filter(e => e.x > -50 && !e.dead);
        state.bullets = state.bullets.filter(b => !b.hit);

        // Particles
        state.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
        });
        state.particles = state.particles.filter(p => p.life > 0);
    };

    const createExplosion = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            stateRef.current.particles.push({
                x: x + 20,
                y: y + 20,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1,
                color: color
            });
        }
    };

    const gameOver = () => {
        stateRef.current.isGameOver = true;
        setGameState('gameover');
        playSound('die');

        // Save Score
        if (stateRef.current.score > highScore) {
            setHighScore(stateRef.current.score);
            localStorage.setItem('subHunterHighScore', stateRef.current.score);
            if (updateStats) {
                updateStats({ subHunterHighScore: stateRef.current.score });
            }
        }

        // Coins
        const earned = Math.floor(stateRef.current.score / 10);
        if (addCoins && earned > 0) addCoins(earned);

        // Leaderboard
        import('../../services/LeaderboardService').then(({ leaderboardService }) => {
            leaderboardService.submitScore('sub_hunter', stateRef.current.score, { difficulty: 'normal' });
        });
    };

    const playSound = (type) => {
        if (!soundEnabled) return;
        // Simple synth audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'shoot') {
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'hit') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'die') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        }
    };

    // DRAW LOGIC
    const draw = (ctx, canvas) => {
        // Clear
        ctx.fillStyle = '#000011'; // Deep Ocean
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = (Date.now() / 50 + i * 100) % canvas.width;
            const y = (i * 50) % canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, i % 5 + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        const state = stateRef.current;

        // Player (Yellow Submarine)
        ctx.fillStyle = '#FFD700';
        // Hull
        ctx.beginPath();
        ctx.ellipse(state.player.x + 30, state.player.y + 20, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cockpit
        ctx.fillStyle = '#00CCFF';
        ctx.beginPath();
        ctx.arc(state.player.x + 40, state.player.y + 15, 8, 0, Math.PI * 2);
        ctx.fill();
        // Propeller
        ctx.fillStyle = '#888';
        ctx.fillRect(state.player.x - 5, state.player.y + 15, 5, 10);


        // Bullets (Torpedoes)
        ctx.fillStyle = '#FF4400';
        state.bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, b.width, b.height);
        });

        // Enemies
        // ctx.font = '30px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        state.enemies.forEach(e => {
            // Draw Box
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.roundRect(e.x, e.y, e.width, e.height, 5);
            ctx.fill();
            // Draw Letter
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e.type, e.x + e.width / 2, e.y + e.height / 2);
        });

        // Particles
        state.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    };

    // CONTROLS
    const handleKeyDown = (e) => {
        if (gameState !== 'playing') return;
        if (e.code === 'ArrowUp') stateRef.current.player.dy = -5;
        if (e.code === 'ArrowDown') stateRef.current.player.dy = 5;
        if (e.code === 'Space') fire();
    };

    const fire = () => {
        if (gameState !== 'playing') return;
        stateRef.current.bullets.push({
            x: stateRef.current.player.x + 50,
            y: stateRef.current.player.y + 15,
            width: 15,
            height: 5,
            hit: false
        });
        playSound('shoot');
    };

    const handleTouchStart = (e) => {
        if (e.target.className.includes('fire-btn')) {
            fire();
            return;
        }
        // Touch to move (upper half up, lower half down)
        const touchY = e.touches[0].clientY;
        if (touchY < window.innerHeight / 2) stateRef.current.player.dy = -5;
        else stateRef.current.player.dy = 5;
    };


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <div className="page-enter" style={{
            height: '100vh', width: '100vw', background: '#000',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Header / HUD */}
            <div style={{
                position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10,
                fontFamily: '"Orbitron", sans-serif', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.5rem', color: '#FFD700', textShadow: '0 0 10px #FFD700' }}>SCORE: {score}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>HIGH: {highScore}</div>
            </div>

            <button
                onClick={() => navigate('/arcade')}
                style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                    padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', zIndex: 10
                }}
            >
                EXIT
            </button>

            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onTouchStart={handleTouchStart}
                style={{
                    border: '2px solid #00CCFF',
                    borderRadius: '10px',
                    maxWidth: '100%',
                    background: '#000011',
                    boxShadow: '0 0 30px #00CCFF'
                }}
            />

            {/* Start Screen */}
            {gameState === 'start' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', color: 'white', zIndex: 20
                }}>
                    <h1 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '3rem', color: '#00CCFF', textShadow: '0 0 20px #00CCFF' }}>
                        VOID HUNTER
                    </h1>
                    <p>Destroy the Subscriptions!</p>
                    <p>Arrow Keys/Tap to Move • Space/Btn to Shoot</p>
                    <button
                        onClick={startGame}
                        className="squishy-btn"
                        style={{
                            marginTop: '20px',
                            background: '#FFD700', border: 'none', padding: '15px 40px',
                            fontSize: '1.5rem', fontWeight: '900', color: 'black', borderRadius: '50px'
                        }}
                    >
                        DIVE! ⚓
                    </button>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', color: 'white', zIndex: 20,
                    background: 'rgba(0,0,0,0.9)', padding: '40px', borderRadius: '20px', border: '1px solid #ff0055'
                }}>
                    <h1 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '3rem', color: '#ff0055' }}>
                        HULL BREACHED
                    </h1>
                    <div style={{ fontSize: '2rem', marginBottom: '20px' }}>Final Score: {score}</div>
                    <div style={{ color: '#FFD700', marginBottom: '30px' }}>+{Math.floor(score / 10)} Coins Earned</div>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button
                            onClick={startGame}
                            className="squishy-btn"
                            style={{
                                background: '#00CCFF', border: 'none', padding: '10px 30px',
                                fontSize: '1.2rem', fontWeight: 'bold', color: 'black', borderRadius: '30px'
                            }}
                        >
                            REPLAY
                        </button>
                        <button
                            onClick={() => navigate('/arcade')}
                            className="squishy-btn"
                            style={{
                                background: 'transparent', border: '1px solid white', padding: '10px 30px',
                                fontSize: '1.2rem', fontWeight: 'bold', color: 'white', borderRadius: '30px'
                            }}
                        >
                            EXIT
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Controls */}
            {gameState === 'playing' && (
                <div style={{
                    position: 'absolute', bottom: '20px', right: '20px', zIndex: 15
                }}>
                    <button
                        className="fire-btn"
                        onClick={fire}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(255, 68, 0, 0.5)', border: '2px solid #FF4400',
                            color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        FIRE
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubHunterGame;
