import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const LANES = 5;
const LANE_WIDTH = GAME_WIDTH / LANES; // 120px
const PLAYER_SIZE = 60;
const BULLET_SIZE = 10;
const ENEMY_SIZE = 50;
const BOSS_SIZE = 120;
const BOSS_HP_MAX = 30;
const MAX_LIVES = 3;

const GalaxyDefender = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('galaxyHighScore')) || 0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameActive, setGameActive] = useState(false);

    // Sync Ref
    const gameActiveRef = useRef(false);
    const bossImgRef = useRef(null);

    const { playBeep, playCrash, playCollect, playWin } = useRetroSound();

    // Game State
    const gameState = useRef({
        lane: 2,
        bullets: [],
        enemies: [],
        boss: null,
        enemyLasers: [], // Boss attacks
        lastEnemySpawn: 0,
        lastShotTime: 0,
        scoreInternal: 0,
        invincible: 0, // i-frames
        shake: 0, // screen shake
        animationId: null
    });

    useEffect(() => {
        const img = new Image();
        img.src = '/assets/boy-logo.png'; // Head Logo
        bossImgRef.current = img;
    }, []);

    const startGame = () => {
        setScore(0);
        setLives(MAX_LIVES);
        setGameOver(false);
        setGameWon(false);
        setGameActive(true);
        gameActiveRef.current = true;

        gameState.current = {
            lane: 2,
            bullets: [],
            enemies: [],
            boss: null,
            enemyLasers: [],
            lastEnemySpawn: 0,
            lastShotTime: 0,
            scoreInternal: 0,
            invincible: 0,
            shake: 0,
            animationId: null
        };
        requestAnimationFrame(gameLoop);
    };

    const takeDamage = () => {
        const state = gameState.current;
        if (state.invincible > 0) return;

        state.invincible = 60; // 1 second (approx)
        state.shake = 10;
        playCrash();

        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                endGame(false);
            }
            return newLives;
        });
    };

    const endGame = (win) => {
        setGameActive(false);
        gameActiveRef.current = false;

        if (win) {
            setGameWon(true);
            playWin();
            triggerConfetti();
        } else {
            setGameOver(true);
            playCrash();
        }

        cancelAnimationFrame(gameState.current.animationId);

        const finalScore = gameState.current.scoreInternal + (win ? 1000 : 0);
        setScore(finalScore);

        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('galaxyHighScore', finalScore);
        }

        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + Math.floor(finalScore / 10));
    };

    const spawnEnemy = (timestamp) => {
        const lane = Math.floor(Math.random() * LANES);
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2) - (ENEMY_SIZE / 2);
        // Variable Speed: 2 is base, + random 0-2
        const speed = 2 + Math.random() * 2;

        gameState.current.enemies.push({
            x,
            y: -ENEMY_SIZE,
            lane,
            speed
        });
        gameState.current.lastEnemySpawn = timestamp;
    };

    const gameLoop = (timestamp) => {
        if (!gameActiveRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const state = gameState.current;

        // Shake Effect
        let offsetX = 0;
        let offsetY = 0;
        if (state.shake > 0) {
            offsetX = (Math.random() - 0.5) * state.shake;
            offsetY = (Math.random() - 0.5) * state.shake;
            state.shake *= 0.9;
            if (state.shake < 0.5) state.shake = 0;
        }

        // Clear & Apply Shake
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.fillStyle = '#000';
        ctx.fillRect(-20, -20, GAME_WIDTH + 40, GAME_HEIGHT + 40);

        // Draw Lanes
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        for (let i = 1; i < LANES; i++) {
            ctx.beginPath();
            ctx.moveTo(i * LANE_WIDTH, 0);
            ctx.lineTo(i * LANE_WIDTH, GAME_HEIGHT);
            ctx.stroke();
        }

        // --- UPDATE ---
        if (state.invincible > 0) state.invincible--;

        // 1. Spawning
        if (!state.boss) {
            if (state.scoreInternal < 500) {
                if (timestamp - state.lastEnemySpawn > 1000) {
                    spawnEnemy(timestamp);
                }
            } else if (state.enemies.length === 0) {
                // SPAWN BOSS
                state.boss = {
                    x: GAME_WIDTH / 2 - BOSS_SIZE / 2,
                    y: -BOSS_SIZE,
                    hp: BOSS_HP_MAX,
                    dir: 1,
                    flash: 0,
                    lastAttack: 0
                };
            }
        }

        // 2. Boss Logic
        if (state.boss) {
            // Movement
            if (state.boss.y < 50) {
                state.boss.y += 1;
            } else {
                state.boss.x += 2 * state.boss.dir;
                if (state.boss.x + BOSS_SIZE > GAME_WIDTH || state.boss.x < 0) {
                    state.boss.dir *= -1;
                }

                // MOUTH LASER ATTACK
                if (timestamp - state.boss.lastAttack > 2000) {
                    const bossCenterX = state.boss.x + BOSS_SIZE / 2;
                    state.enemyLasers.push({
                        x: bossCenterX - 10,
                        y: state.boss.y + BOSS_SIZE - 20,
                        width: 20,
                        height: 40, // Laser Bullet Style
                        speed: 8
                    });
                    state.boss.lastAttack = timestamp;
                }
            }
        }

        // 3. Move Objects
        state.bullets = state.bullets.filter(b => b.y > -20);
        state.bullets.forEach(b => b.y -= 15);

        state.enemies.forEach(e => e.y += e.speed);

        state.enemyLasers = state.enemyLasers.filter(l => l.y < GAME_HEIGHT);
        state.enemyLasers.forEach(l => l.y += l.speed);

        // 4. Collision: Player Bullets
        for (let bIdx = state.bullets.length - 1; bIdx >= 0; bIdx--) {
            const b = state.bullets[bIdx];
            let hit = false;

            // Boss Hit
            if (state.boss) {
                if (b.x > state.boss.x && b.x < state.boss.x + BOSS_SIZE &&
                    b.y > state.boss.y && b.y < state.boss.y + BOSS_SIZE) {
                    state.boss.hp--;
                    state.boss.flash = 3;
                    hit = true;
                    playCollect();
                    if (state.boss.hp <= 0) { endGame(true); return; }
                }
            }

            // Enemy Hit
            if (!hit && !state.boss) {
                for (let eIdx = state.enemies.length - 1; eIdx >= 0; eIdx--) {
                    const e = state.enemies[eIdx];
                    if (b.x < e.x + ENEMY_SIZE &&
                        b.x + BULLET_SIZE > e.x &&
                        b.y < e.y + ENEMY_SIZE &&
                        b.y + BULLET_SIZE > e.y) {
                        state.enemies.splice(eIdx, 1);
                        state.scoreInternal += 50;
                        setScore(state.scoreInternal);
                        playCollect();
                        hit = true;
                        break;
                    }
                }
            }
            if (hit) state.bullets.splice(bIdx, 1);
        }

        // 5. Collision: Player vs Everything
        const playerX = state.lane * LANE_WIDTH + (LANE_WIDTH / 2) - (PLAYER_SIZE / 2);
        const playerY = GAME_HEIGHT - 80;
        const pRect = { x: playerX, y: playerY, w: PLAYER_SIZE, h: PLAYER_SIZE };

        // Hit by Enemy
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            const e = state.enemies[i];
            // Check Overlap
            if (e.x < pRect.x + pRect.w && e.x + ENEMY_SIZE > pRect.x &&
                e.y < pRect.y + pRect.h && e.y + ENEMY_SIZE > pRect.y) {
                takeDamage();
                state.enemies.splice(i, 1);
            }
            // Enemy reached bottom
            if (e.y > GAME_HEIGHT) {
                state.enemies.splice(i, 1); // Despawn
            }
        }

        // Hit by Boss Laser
        for (let i = state.enemyLasers.length - 1; i >= 0; i--) {
            const l = state.enemyLasers[i];
            if (l.x < pRect.x + pRect.w && l.x + l.width > pRect.x &&
                l.y < pRect.y + pRect.h && l.y + l.height > pRect.y) {
                takeDamage();
                state.enemyLasers.splice(i, 1);
            }
        }


        // --- DRAW ---

        // Player
        if (state.invincible % 10 < 5) { // Flash if invincible
            ctx.save();
            ctx.translate(playerX + PLAYER_SIZE / 2, playerY + PLAYER_SIZE / 2);

            // Flames
            ctx.fillStyle = `rgba(0, 200, 255, ${0.5 + Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(-15, 20);
            ctx.lineTo(0, 40 + Math.random() * 10);
            ctx.lineTo(15, 20);
            ctx.fill();

            // Ship
            ctx.fillStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(20, 10);
            ctx.lineTo(10, 20);
            ctx.lineTo(-10, 20);
            ctx.lineTo(-20, 10);
            ctx.closePath();
            ctx.fill();

            // Cockpit
            ctx.fillStyle = '#00ccff';
            ctx.beginPath();
            ctx.ellipse(0, -5, 5, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        // Bullets
        ctx.fillStyle = '#ffcc00';
        state.bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, BULLET_SIZE, 20);
        });

        // Enemies
        ctx.fillStyle = '#ff0055';
        ctx.font = '40px serif';
        state.enemies.forEach(e => {
            ctx.fillText('👾', e.x, e.y + 40);
        });

        // Boss Lasers
        ctx.fillStyle = '#ff0000';
        state.enemyLasers.forEach(l => {
            ctx.fillRect(l.x, l.y, l.width, l.height);
        });

        // Boss
        if (state.boss) {
            if (state.boss.flash > 0) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = 'white';
                state.boss.flash--;
            }
            if (bossImgRef.current && bossImgRef.current.complete) {
                ctx.drawImage(bossImgRef.current, state.boss.x, state.boss.y, BOSS_SIZE, BOSS_SIZE);
            } else {
                ctx.fillStyle = 'red';
                ctx.fillRect(state.boss.x, state.boss.y, BOSS_SIZE, BOSS_SIZE);
            }

            // Boss HP
            const percent = state.boss.hp / BOSS_HP_MAX;
            ctx.fillStyle = '#333';
            ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE, 10);
            ctx.fillStyle = percent > 0.5 ? '#00ff00' : 'red';
            ctx.fillRect(state.boss.x, state.boss.y - 20, BOSS_SIZE * percent, 10);
        }

        ctx.restore(); // Undo shake

        if (gameActiveRef.current) {
            state.animationId = requestAnimationFrame(gameLoop);
        }
    };

    // Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameActiveRef.current) return;
            const state = gameState.current;

            if (e.key === 'ArrowLeft') {
                if (state.lane > 0) state.lane--;
            }
            if (e.key === 'ArrowRight') {
                if (state.lane < LANES - 1) state.lane++;
            }

            if (e.key === ' ') {
                const now = Date.now();
                if (now - state.lastShotTime > 200) {
                    const startX = state.lane * LANE_WIDTH + (LANE_WIDTH / 2) - (BULLET_SIZE / 2);
                    state.bullets.push({ x: startX, y: GAME_HEIGHT - 80 });
                    state.lastShotTime = now;
                    playBeep();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: '#00ccff' }}>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '3rem', margin: '10px 0' }}>GALAXY DEFENDER</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '600px', marginBottom: '10px', fontSize: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {Array.from({ length: MAX_LIVES }).map((_, i) => (
                        <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                    ))}
                </div>
                <span>SCORE: {score}</span>
            </div>

            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    style={{ border: '4px solid #00ccff', background: 'radial-gradient(circle, #001133 0%, #000000 100%)', borderRadius: '10px', boxShadow: '0 0 20px #00ccff40' }}
                />

                {!gameActive && !gameOver && !gameWon && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <p style={{ color: 'white', marginBottom: '10px' }}>Use <span style={{ fontWeight: 'bold' }}>ARROWS</span> to move.</p>
                        <SquishyButton onClick={startGame} style={{ padding: '15px 40px', fontSize: '1.5rem', background: '#00ccff', border: 'none', borderRadius: '10px' }}>
                            START MISSION
                        </SquishyButton>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '3rem', color: '#ff0055' }}>GAME OVER</h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Final Score: {score}</p>
                        <SquishyButton onClick={startGame} style={{ marginBottom: '10px', padding: '10px 30px', background: '#00ccff', border: 'none', borderRadius: '5px' }}>Retry</SquishyButton>
                        <Link to="/arcade" style={{ color: 'white', textDecoration: 'underline' }}>Exit</Link>
                    </div>
                )}

                {gameWon && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '3rem', color: '#00ffaa' }}>VICTORY!</h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>GALAXY SAVED</p>
                        <SquishyButton onClick={startGame} style={{ marginBottom: '10px', padding: '10px 30px', background: 'gold', color: 'black', border: 'none', borderRadius: '5px' }}>Play Again</SquishyButton>
                        <Link to="/arcade" style={{ color: 'white', textDecoration: 'underline' }}>Exit</Link>
                    </div>
                )}
            </div>
            <p style={{ marginTop: '10px', color: '#666' }}>Defeat the Head at 500 Points!</p>
        </div>
    );
};

export default GalaxyDefender;
