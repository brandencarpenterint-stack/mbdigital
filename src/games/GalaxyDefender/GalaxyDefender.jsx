import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const LANES = 5;
const LANE_WIDTH = GAME_WIDTH / LANES;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 8;
const ENEMY_SIZE = 40;
const BOSS_SIZE = 120;
const BOSS_HP_MAX = 50;
const MAX_LIVES = 3; // INCREASED LIVES for fun

const GalaxyDefender = () => {
    const { updateStat, incrementStat, shopState, addCoins, userProfile, stats, addZonePoints } = useGamification() || { updateStat: () => { }, incrementStat: () => { }, shopState: null };
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('galaxyHighScore')) || 0);

    // Sync local high score with global stat on mount
    useEffect(() => {
        if (stats?.galaxyHighScore > highScore) {
            setHighScore(stats.galaxyHighScore);
        }
    }, [stats]);
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

    const sheetRef = useRef(null);
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/galaxy_sheet.png';
        sheetRef.current = img;
        return () => cancelAnimationFrame(gameState.current.animationId);
    }, []);

    const startGame = () => {
        if (gameState.current.animationId) {
            cancelAnimationFrame(gameState.current.animationId);
        }

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
            stars: [],
            powerups: [],
            particles: [],
            weapon: 'NORMAL',     // NORMAL, SPREAD, RAPID, LASER
            weaponTimer: 0,
            hasShield: false,
            level: 1,
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
        gameState.current.animationId = requestAnimationFrame(gameLoop);
    };

    const takeDamage = () => {
        const state = gameState.current;
        if (state.invincible > 0) return;

        if (state.hasShield) {
            state.hasShield = false;
            state.invincible = 60;
            state.shake = 10;
            playBeep(); // Shield break sound (placeholder)
            return;
        }

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

        const finalScore = gameState.current.scoreInternal + (win ? 1000 : 0);
        setScore(finalScore);

        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('galaxyHighScore', finalScore);

            const playerName = userProfile?.name || 'Pilot';
            feedService.publish(`saved the Galaxy with score: ${finalScore} 🚀`, 'win', playerName);
        }

        // Gamification
        if (incrementStat) incrementStat('gamesPlayed', 'galaxy');
        if (addCoins) addCoins(Math.floor(finalScore / 10)); // 1 coin per 10 points

        // ZONE CONTROL
        if (addZonePoints && finalScore > 200) {
            const points = Math.floor(finalScore / 20); // 500 score = 25 zone points (harder than cannon)
            const squad = userProfile?.squad || 'CYBER';
            addZonePoints('galaxy', points, squad);
        }
    };

    const spawnEnemy = (timestamp) => {
        const lane = Math.floor(Math.random() * LANES);
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2) - (ENEMY_SIZE / 2);
        // SURVIVAL SCALING (Faster!)
        const speed = 4 + (gameState.current.level * 1.2) + Math.random() * 2;

        gameState.current.enemies.push({ x, y: -ENEMY_SIZE, lane, speed });
        gameState.current.lastEnemySpawn = timestamp;
    };

    const gameLoop = (timestamp) => {
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
        if (gameActiveRef.current) {
            if (state.invincible > 0) state.invincible--;

            // 1. Spawning
            if (!state.boss) {
                // Level Up / Spawn Boss check
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
                    // Normal Spawning - FASTER SPAWN RATES
                    const spawnRate = Math.max(250, 900 - (state.level * 150));

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
                // Powerup Spawning (Random chance when no boss)
                if (Math.random() < 0.005 && state.powerups.length === 0) {
                    const typeRoll = Math.random();
                    let type = 'SPREAD';
                    if (typeRoll > 0.6) type = 'RAPID';
                    if (typeRoll > 0.9) type = 'SHIELD';

                    state.powerups.push({
                        x: Math.random() * (GAME_WIDTH - 40),
                        y: -40,
                        type,
                        speed: 3
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

            // Helper: Spawn Explosion
            const spawnExplosion = (x, y) => {
                for (let k = 0; k < 10; k++) {
                    state.particles.push({
                        x, y,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 1.0,
                        color: Math.random() > 0.5 ? 'orange' : 'yellow',
                        size: Math.random() * 4 + 2
                    });
                }
            };

            // Hit by Enemy
            for (let i = state.enemies.length - 1; i >= 0; i--) {
                const e = state.enemies[i];
                // Check Overlap
                if (e.x < pRect.x + pRect.w && e.x + ENEMY_SIZE > pRect.x &&
                    e.y < pRect.y + pRect.h && e.y + ENEMY_SIZE > pRect.y) {
                    takeDamage();
                    spawnExplosion(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE / 2);
                    state.enemies.splice(i, 1);
                }
                // Enemy reached bottom
                if (e.y > GAME_HEIGHT) {
                    state.enemies.splice(i, 1); // Despawn
                }
            }

            // Update Particles
            state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.05; });
            state.particles = state.particles.filter(p => p.life > 0);

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

                    if (p.type === 'SHIELD') {
                        state.hasShield = true;
                    } else {
                        state.weapon = p.type;
                        state.weaponTimer = 600; // 10 seconds
                    }

                    state.powerups.splice(i, 1);
                    playCollect();
                    triggerConfetti();
                } else if (p.y > GAME_HEIGHT) {
                    state.powerups.splice(i, 1);
                }
            }

        } // END UPDATE IF

        // --- DRAW ---

        // --- DRAW ---

        // Player
        const playerXDraw = state.lane * LANE_WIDTH + (LANE_WIDTH / 2) - (PLAYER_SIZE / 2);
        const playerYDraw = GAME_HEIGHT - 80;

        // Sprite Sheet geometry
        // Assuming 3x3 grid or similar based on prompt.
        // Row 0: Player (Left, Idle, Right)
        // Row 1: Enemy 1, Enemy 2, Bullet/Explosion?
        // Let's assume standardized 64x64 or similar cells.
        // Prompt said "Grid arrangement".
        // Let's try dynamic sizing or fixed.
        // Let's assume 3 Cols, 3 Rows.

        const drawSprite = (row, col, x, y, w, h) => {
            if (sheetRef.current && sheetRef.current.complete) {
                const sw = sheetRef.current.width / 3;
                const sh = sheetRef.current.height / 3;
                ctx.drawImage(sheetRef.current, col * sw, row * sh, sw, sh, x, y, w, h);
            } else {
                // Fallback
                ctx.fillStyle = 'magenta';
                ctx.fillRect(x, y, w, h);
            }
        };

        if (state.invincible % 10 < 5) {
            ctx.save();
            // Determine Player Frame: 
            // We only have strict lanes, but let's animate banking slightly if moving?
            // Since lane jump is instant, we can just use Idle (Row 0, Col 1).
            // Or use Left/Right based on recent movement? Too complex for now.
            // IDLE: Row 0, Col 1.
            drawSprite(0, 1, playerXDraw, playerYDraw, PLAYER_SIZE, PLAYER_SIZE);

            // Shield
            if (state.hasShield) {
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(playerXDraw + PLAYER_SIZE / 2, playerYDraw + PLAYER_SIZE / 2, 35, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        }

        // Enemies
        state.enemies.forEach(e => {
            // Row 1. Col 0 (Bug) or 1 (Saucer).
            // Alternate based on spawn or random?
            const type = (e.x + e.y) % 20 > 10 ? 0 : 1;
            drawSprite(1, type, e.x, e.y, ENEMY_SIZE, ENEMY_SIZE);
        });

        // Bullets
        ctx.fillStyle = '#ffcc00';
        state.bullets.forEach(b => {
            // Row 1, Col 2? Or draw rect.
            // Let's stick to glow rect for bullets, cleaner.
            ctx.fillStyle = 'orange';
            ctx.fillRect(b.x, b.y, b.w || BULLET_SIZE, b.h || 20);
            ctx.shadowBlur = 10; ctx.shadowColor = 'red';
        });
        ctx.shadowBlur = 0; // Reset

        // Boss
        if (state.boss) {
            // Row 2, Col 0 (Skull)
            // Shake/Flash
            if (state.boss.flash > 0) ctx.globalAlpha = 0.5;
            drawSprite(2, 0, state.boss.x, state.boss.y, BOSS_SIZE, BOSS_SIZE);
            ctx.globalAlpha = 1;

            // HP Bar
            const pct = state.boss.hp / (BOSS_HP_MAX * state.level);
            ctx.fillStyle = 'red';
            ctx.fillRect(state.boss.x, state.boss.y - 10, BOSS_SIZE, 5);
            ctx.fillStyle = 'lime';
            ctx.fillRect(state.boss.x, state.boss.y - 10, BOSS_SIZE * pct, 5);
        }

        // Particles
        state.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.restore(); // Undo shake

        // ALWAYS loop so rendering continues
        state.animationId = requestAnimationFrame(gameLoop);
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

        const fireRate = state.weapon === 'RAPID' ? 100 : 250;
        if (now - state.lastShotTime > fireRate) {
            const startX = state.lane * LANE_WIDTH + (LANE_WIDTH / 2) - (BULLET_SIZE / 2);

            // Weapon Logic
            if (state.weaponTimer > 0) state.weaponTimer--;
            else state.weapon = 'NORMAL';

            if (state.weapon === 'SPREAD') {
                // Triple Shot
                state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 15, dx: 0, w: 8, h: 20 });
                state.bullets.push({ x: startX - 10, y: GAME_HEIGHT - 80, speed: 15, dx: -2, w: 6, h: 15 });
                state.bullets.push({ x: startX + 10, y: GAME_HEIGHT - 80, speed: 15, dx: 2, w: 6, h: 15 });
            } else if (state.weapon === 'RAPID') {
                // Fast Center
                state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 25, dx: 0, w: 6, h: 25 });
            } else {
                // Normal
                state.bullets.push({ x: startX, y: GAME_HEIGHT - 80, speed: 15, dx: 0, w: 8, h: 20 });
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
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
            if (e.key === ' ') fire();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // TOUCH CONTROLS
    const touchRef = useRef({ startX: 0, hasMoved: false });

    const handleTouchStart = (e) => {
        if (!gameActiveRef.current) return;
        const touch = e.touches[0];
        touchRef.current = {
            startX: touch.clientX,
            hasMoved: false
        };
    };

    const handleTouchMove = (e) => {
        if (!gameActiveRef.current) return;
        if (e.cancelable) e.preventDefault(); // Prevent scrolling

        const touch = e.touches[0];
        const diffX = touch.clientX - touchRef.current.startX;
        const SWIPE_THRESHOLD = 40; // Sensitivity

        if (Math.abs(diffX) > SWIPE_THRESHOLD) {
            if (diffX > 0) moveRight();
            else moveLeft();

            // Reset startX to allow continuous swiping across multiple lanes
            touchRef.current.startX = touch.clientX;
            touchRef.current.hasMoved = true;
        }
    };

    const handleTouchEnd = (e) => {
        if (!gameActiveRef.current) return;
        // If we didn't swipe (didn't move lane), treat as Tap to Shoot
        const wasSwipe = touchRef.current.hasMoved;

        // Reset Ref
        touchRef.current = { startX: 0, hasMoved: false };

        if (!wasSwipe) {
            fire();
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '10px', color: '#00ccff', minHeight: '100vh', touchAction: 'none'
        }}>

            <div style={{
                display: 'flex', justifyContent: 'space-between',
                width: '100%', maxWidth: '480px',
                marginBottom: '5px', fontSize: '1rem', fontWeight: 'bold'
            }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    {Array.from({ length: MAX_LIVES }).map((_, i) => (
                        <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span>LVL {Math.floor(score / 1000) + 1}</span>
                    <span>SCORE: {score}</span>
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        width: '100%', height: 'auto',
                        border: '4px solid #00ccff',
                        background: 'radial-gradient(circle, #001133 0%, #000000 100%)',
                        borderRadius: '10px', boxShadow: '0 0 20px #00ccff40',
                        touchAction: 'none' // Critical for preventing scrolling
                    }}
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
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', width: '100%', paddingBottom: '20px' }}>
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
