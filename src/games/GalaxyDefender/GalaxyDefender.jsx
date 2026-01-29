import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { LeaderboardService } from '../../services/LeaderboardService';

const GAME_WIDTH = 480; // Reduced by 20%
const GAME_HEIGHT = 320;
const LANES = 5;
const LANE_WIDTH = GAME_WIDTH / LANES; // 96px
const PLAYER_SIZE = 50; // Scaled down
const BULLET_SIZE = 8;
const ENEMY_SIZE = 40;
const BOSS_SIZE = 100;
const BOSS_HP_MAX = 30;
const MAX_LIVES = 3;

const GalaxyDefender = () => {
    const { updateStat, incrementStat, shopState } = useGamification() || { updateStat: () => { }, incrementStat: () => { }, shopState: null };
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
        img.src = '/assets/boy_face.png'; // Head Logo
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
            stars: [], // Background stars
            powerups: [], // {x, y, type}
            weaponLevel: 1,
            weaponTimer: 0,
            level: 1, // Difficulty level
            bossActive: false,
            animationId: null
        };
        // Init Stars
        for (let i = 0; i < 50; i++) {
            gameState.current.stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                size: Math.random() * 2,
                speed: 0.5 + Math.random() * 2
            });
        }
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

        // Gamification
        LeaderboardService.submitScore('galaxy_defender', 'Player1', finalScore);
        updateStat('galaxyHighScore', (prev) => Math.max(prev, finalScore));
        incrementStat('gamesPlayed', 'galaxy');

        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + Math.floor(finalScore / 10));
    };

    const spawnEnemy = (timestamp) => {
        const lane = Math.floor(Math.random() * LANES);
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2) - (ENEMY_SIZE / 2);
        // Variable Speed based on level
        const speed = 2 + (gameState.current.level) + Math.random() * 2;

        gameState.current.enemies.push({ x, y: -ENEMY_SIZE, lane, speed });
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

        // Draw Starfield
        ctx.fillStyle = '#fff';
        state.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            // Update Star
            star.y += star.speed;
            if (star.y > GAME_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * GAME_WIDTH;
            }
        });

        // Draw Lanes (Faint)
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
            // Level Up / Spawn Boss check
            // Every 1000 points = Boss
            const pointsSinceBoss = state.scoreInternal % 1000;
            const isBossTime = state.scoreInternal > 0 && pointsSinceBoss >= 900 && !state.bossActive;
            // We use a flag 'bossActive' to ensure we only spawn once per threshold
            // Better logic: Target score for next boss
            const nextBossScore = state.level * 1000;

            if (state.scoreInternal >= nextBossScore) {
                // SPAWN BOSS
                state.boss = {
                    x: GAME_WIDTH / 2 - BOSS_SIZE / 2,
                    y: -BOSS_SIZE,
                    hp: BOSS_HP_MAX * state.level,
                    dir: 1,
                    flash: 0,
                    lastAttack: 0,
                    type: state.level % 3 // Vary boss type (0, 1, 2)
                };
                state.bossActive = true;
                // Clear enemies
                state.enemies = [];
            } else {
                // Normal Spawning
                const spawnRate = Math.max(400, 1000 - (state.level * 100));

                if (timestamp - state.lastEnemySpawn > spawnRate) {
                    spawnEnemy(timestamp);
                }
            }
        }

        // 2. Boss Logic
        if (state.boss) {
            // Entrance
            if (state.boss.y < 50) {
                state.boss.y += 1;
            } else {
                // Battle phase
                state.boss.x += (2 + state.level) * state.boss.dir;
                if (state.boss.x + BOSS_SIZE > GAME_WIDTH || state.boss.x < 0) {
                    state.boss.dir *= -1;
                }

                // Silly Bounce
                const bounce = Math.sin(timestamp / 200) * 10;

                // MOUTH LASER ATTACK
                // Fires faster at higher levels
                const fireRate = Math.max(500, 2000 - (state.level * 200));

                if (timestamp - state.boss.lastAttack > fireRate) {
                    const bossCenterX = state.boss.x + BOSS_SIZE / 2;
                    // Spread shot at higher levels
                    if (state.level >= 2) {
                        state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: -2 });
                        state.enemyLasers.push({ x: bossCenterX - 10, y: state.boss.y + BOSS_SIZE, width: 20, height: 20, speed: 6, dx: 2 });
                    }
                    state.enemyLasers.push({
                        x: bossCenterX - 10,
                        y: state.boss.y + BOSS_SIZE - 20,
                        width: 20,
                        height: 40,
                        speed: 8,
                        dx: 0
                    });
                    state.boss.lastAttack = timestamp;
                }
            }
        } else {
            // Powerup Spawning (Random chance when no boss)
            if (Math.random() < 0.002 && state.powerups.length === 0) {
                state.powerups.push({
                    x: Math.random() * (GAME_WIDTH - 40),
                    y: -40,
                    type: 'DOUBLE',
                    speed: 2
                });
            }
        }

        // 3. Move Objects
        state.bullets = state.bullets.filter(b => b.y > -20);
        state.bullets.forEach(b => b.y -= 15);

        state.enemies.forEach(e => e.y += e.speed);

        state.enemyLasers = state.enemyLasers.filter(l => l.y < GAME_HEIGHT);
        state.enemyLasers.forEach(l => {
            l.y += l.speed;
            if (l.dx) l.x += l.dx; // Horizontal movement for boss spread
        });

        // Move Powerups
        state.powerups.forEach(p => p.y += p.speed);

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
                    if (state.boss.hp <= 0) {
                        incrementStat('bossKills', 1);
                        // Boss Defeated
                        state.boss = null;
                        state.level++;
                        state.scoreInternal += 500; // Bonus
                        playWin();
                        triggerConfetti();
                        return;
                    }
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

        // Powerup Collection
        for (let i = state.powerups.length - 1; i >= 0; i--) {
            const p = state.powerups[i];
            // Hitbox Check
            if (p.x < pRect.x + pRect.w && p.x + 30 > pRect.x &&
                p.y < pRect.y + pRect.h && p.y + 30 > pRect.y) {
                // Collect
                state.weaponLevel = 2;
                state.weaponTimer = 600; // 10 seconds approx (60fps)
                state.powerups.splice(i, 1);
                playCollect();
                triggerConfetti(); // Mini confetti for powerup
            } else if (p.y > GAME_HEIGHT) {
                state.powerups.splice(i, 1);
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
            const currentSkin = shopState?.equipped?.galaxy || 'ship_default';

            if (currentSkin === 'ship_ufo') {
                // UFO Skin
                ctx.fillStyle = '#00ff88';
                ctx.beginPath();
                ctx.ellipse(0, 0, 25, 10, 0, 0, Math.PI * 2); // Saucer
                ctx.fill();

                // Dome
                ctx.fillStyle = 'rgba(200, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(0, -5, 12, Math.PI, 0);
                ctx.fill();

                // Lights
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(-15, 0, 3, 0, Math.PI * 2);
                ctx.arc(0, 5, 3, 0, Math.PI * 2);
                ctx.arc(15, 0, 3, 0, Math.PI * 2);
                ctx.fill();

            } else {
                // Default Ship
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
            }

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

        // Powerups
        state.powerups.forEach(p => {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(p.x + 15, p.y + 15, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('P', p.x + 8, p.y + 22);
        });

        // Boss
        if (state.boss) {
            if (state.boss.flash > 0) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = 'white';
                state.boss.flash--;
            }

            if (bossImgRef.current && bossImgRef.current.complete) {
                // Silly Boss Animations based on state.boss.type
                ctx.save();
                ctx.translate(state.boss.x + BOSS_SIZE / 2, state.boss.y + BOSS_SIZE / 2);

                // Bobbing effect
                const bob = Math.sin(Date.now() / 200) * 10;
                ctx.translate(0, bob);

                // Rotate slightly
                ctx.rotate(Math.sin(Date.now() / 500) * 0.1);

                ctx.drawImage(bossImgRef.current, -BOSS_SIZE / 2, -BOSS_SIZE / 2, BOSS_SIZE, BOSS_SIZE);
                ctx.restore();
            } else {
                // Fallback Emoji Boss
                ctx.font = '80px Arial';
                ctx.fillText('👹', state.boss.x + 10, state.boss.y + 80);
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
    // Mobile Actions
    const moveLeft = () => {
        if (!gameActiveRef.current) return;
        if (gameState.current.lane > 0) gameState.current.lane--;
    };
    const moveRight = () => {
        if (!gameActiveRef.current) return;
        if (gameState.current.lane < LANES - 1) gameState.current.lane++;
    };
    const fire = () => {
        if (!gameActiveRef.current) return;
        const state = gameState.current;
        const now = Date.now();
        if (now - state.lastShotTime > 200) {
            const startX = state.lane * LANE_WIDTH + (LANE_WIDTH / 2) - (BULLET_SIZE / 2);

            // Double Shot Logic
            if (state.weaponTimer > 0) {
                state.bullets.push({ x: startX - 10, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
                state.bullets.push({ x: startX + 10, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
                state.weaponTimer--;
            } else {
                state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 15, dx: 0 });
            }

            state.lastShotTime = now;
            playBeep();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameActiveRef.current) return;
            if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
            if (e.key === ' ') fire();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', color: '#00ccff' }}>

            {/* Header Removed for space */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '480px', marginBottom: '5px', fontSize: '1rem', fontWeight: 'bold' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
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

            {/* MOBILE CONTROLS */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <SquishyButton onClick={moveLeft} style={{ width: '60px', height: '60px', fontSize: '2rem', background: '#333', border: '2px solid #00ccff', borderRadius: '15px' }}>⬅️</SquishyButton>
                    <SquishyButton onClick={moveRight} style={{ width: '60px', height: '60px', fontSize: '2rem', background: '#333', border: '2px solid #00ccff', borderRadius: '15px' }}>➡️</SquishyButton>
                </div>
                <SquishyButton onClick={fire} style={{ width: '80px', height: '80px', fontSize: '1.5rem', background: 'red', border: '4px solid orange', borderRadius: '50%', boxShadow: '0 0 15px orange' }}>🔥</SquishyButton>
            </div>

            <p style={{ marginTop: '10px', color: '#666' }}>Defeat the Head at 500 Points!</p>
        </div>
    );
};

export default GalaxyDefender;
