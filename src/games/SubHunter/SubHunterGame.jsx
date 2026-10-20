import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { useSettings } from '../../context/SettingsContext';

const WORD_BANKS = {
    letters: ['M','E','R','C','H','B','O','Y','V','I','D','S','L','A','G','T','N','U','K'],
    short: ['VOID','BOY','COIN','SUB','NEON','HYPE','WIN','RUN','BOT','HEX'],
    medium: ['MERCH','GLITCH','CYBER','SOLAR','ARCADE','BUNKER','RADAR','TOKEN'],
    long: ['DIGITAL','OPERATOR','HUSTLE','SINGULARITY','TENTACLE','PROTOCOL']
};

const SubHunterGame = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const { updateStat, addCoins, incrementStat, stats } = useGamification() || {};
    const { soundEnabled } = useSettings();

    // Game State
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState((stats && stats.subHunterHighScore) || parseInt(localStorage.getItem('subHunterHighScore')) || 0);

    // Engine Refs
    const stateRef = useRef({
        enemies: [],
        bullets: [],
        particles: [],
        score: 0,
        lives: 3,
        slowTimer: 0,
        targetEnemyId: null,
        isGameOver: false,
        lastEnemyTime: 0,
        frameCount: 0,
        enemyIdCounter: 0
    });

    // Loop
    useEffect(() => {
        let animationFrameId;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let lastTime = 0;
        const loop = (timestamp) => {
            if (timestamp) {
                if (!lastTime) lastTime = timestamp;
                const delta = timestamp - lastTime;
                if (delta < 16) {
                    animationFrameId = requestAnimationFrame(loop);
                    return;
                }
                lastTime = timestamp - (delta % 16);
            }

            if (gameState === 'playing') {
                update(timestamp, canvas);
            }
            draw(ctx, canvas);
            animationFrameId = requestAnimationFrame(loop);
        };

        if (gameState !== 'start') {
            animationFrameId = requestAnimationFrame(loop);
        } else {
            draw(ctx, canvas);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState]);

    const startGame = () => {
        stateRef.current = {
            enemies: [],
            bullets: [],
            particles: [],
            score: 0,
        lives: 3,
        slowTimer: 0,
            targetEnemyId: null,
            isGameOver: false,
            lastEnemyTime: 0,
            frameCount: 0,
            enemyIdCounter: 0
        };
        setScore(0);
        setLives(3);
        setGameState('playing');
        
        // Focus input for mobile
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const getWordForScore = (currentScore) => {
        let r = Math.random();
        let pool = [];
        if (currentScore < 100) {
            pool = r < 0.9 ? WORD_BANKS.letters : WORD_BANKS.short;
        } else if (currentScore < 300) {
            pool = r < 0.3 ? WORD_BANKS.letters : (r < 0.8 ? WORD_BANKS.short : WORD_BANKS.medium);
        } else if (currentScore < 600) {
            pool = r < 0.2 ? WORD_BANKS.short : (r < 0.7 ? WORD_BANKS.medium : WORD_BANKS.long);
        } else {
            pool = r < 0.2 ? WORD_BANKS.short : (r < 0.6 ? WORD_BANKS.medium : WORD_BANKS.long);
        }
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // UPDATE LOGIC
    const update = (time, canvas) => {
        const state = stateRef.current;
        state.frameCount++;

        // 1. Bullets Move
        state.bullets.forEach(b => {
            const dx = b.targetX - b.x;
            const dy = b.targetY - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 10) {
                b.hit = true;
            } else {
                b.x += (dx / dist) * 20;
                b.y += (dy / dist) * 20;
            }
        });

        // 2. Enemies Spawn
        // Speed up spawn rate over time (min 800ms)
        const spawnDelay = Math.max(800, 2000 - (state.score * 2)); 
        
        if (time - state.lastEnemyTime > spawnDelay) {
            const word = getWordForScore(state.score);
            const colors = ['#E50914', '#1DB954', '#00A8E1', '#1CE783', '#b026ff', '#ff00ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            let isPowerUp = false;
            let powerType = null;
            let finalWord = word;
            let finalColor = color;
            
            if (Math.random() < 0.05) { // 5% chance
                isPowerUp = true;
                const pTypes = ['HEAL', 'NUKE', 'SLOW'];
                powerType = pTypes[Math.floor(Math.random() * pTypes.length)];
                finalWord = powerType;
                finalColor = '#FFFFFF';
            }
            
            state.enemies.push({
                id: state.enemyIdCounter++,
                word: finalWord,
                typed: 0,
                x: canvas.width,
                y: Math.random() * (canvas.height - 80) + 40,
                speed: 1 + (state.score / 200), // Speed up moving over time
                color: finalColor,
                dead: false,
                isPowerUp: isPowerUp,
                powerType: powerType
            });
            state.lastEnemyTime = time;
        }

        // 3. Enemies Move
        let speedMult = 1;
        if (state.slowTimer > 0) {
            state.slowTimer--;
            speedMult = 0.3; // Slowed down
        }
        
        state.enemies.forEach(e => {
            e.x -= e.speed * speedMult;
            // Wobble
            e.y += Math.sin(state.frameCount / 20 + e.id) * 1;
        });

        // 4. Collisions / Game Over
        state.enemies.forEach(e => {
            if (!e.dead && e.x < 100) { // Sub is at x=100
                e.dead = true;
                state.targetEnemyId = null;
                createExplosion(e.x, e.y, '#FF0000');
                
                if (!e.isPowerUp) {
                    state.lives--;
                    setLives(state.lives);
                    playSound('hit');
                    if (state.lives <= 0) {
                        gameOver();
                    }
                }
            }
        });

        // Cleanup
        state.enemies = state.enemies.filter(e => !e.dead);
        state.bullets = state.bullets.filter(b => !b.hit);

        // Particles
        state.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
        });
        state.particles = state.particles.filter(p => p.life > 0);
    };

    const fireBullet = (enemy) => {
        stateRef.current.bullets.push({
            x: 120, // sub gun position
            y: 250,
            targetX: enemy.x,
            targetY: enemy.y,
            hit: false
        });
        playSound('shoot');
    };

    const destroyEnemy = (enemy) => {
        enemy.dead = true;
        stateRef.current.targetEnemyId = null;
        createExplosion(enemy.x, enemy.y, enemy.color);
        
        if (enemy.isPowerUp) {
            playSound('shoot'); // double sound?
            if (enemy.powerType === 'HEAL') {
                stateRef.current.lives = Math.min(3, stateRef.current.lives + 1);
                setLives(stateRef.current.lives);
            } else if (enemy.powerType === 'NUKE') {
                stateRef.current.enemies.forEach(e => {
                    e.dead = true;
                    createExplosion(e.x, e.y, e.color);
                    stateRef.current.score += 10;
                });
            } else if (enemy.powerType === 'SLOW') {
                stateRef.current.slowTimer = 300; // ~5 seconds at 60fps
            }
        } else {
            stateRef.current.score += (enemy.word.length * 10);
        }
        
        setScore(stateRef.current.score);
        playSound('hit');
    };

    const createExplosion = (x, y, color) => {
        for (let i = 0; i < 15; i++) {
            stateRef.current.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: color
            });
        }
    };

    const gameOver = () => {
        stateRef.current.isGameOver = true;
        setGameState('gameover');
        playSound('die');

        if (stateRef.current.score > highScore) {
            setHighScore(stateRef.current.score);
            // Save locally
            localStorage.setItem('subHunterHighScore', stateRef.current.score);
            // Save to profile
            if (updateStat) {
                updateStat('subHunterHighScore', stateRef.current.score);
            }
        }
        
        if (incrementStat) {
            incrementStat('gamesPlayedCount', 1);
            incrementStat('gamesPlayed', 'sub_hunter');
        }

        const earned = Math.floor(stateRef.current.score / 10);
        if (addCoins && earned > 0) addCoins(earned);

        import('../../services/LeaderboardService').then(({ leaderboardService }) => {
            leaderboardService.submitScore('sub_hunter', stateRef.current.score, { difficulty: 'typing' });
        });
    };

    const playSound = (type) => {
        if (!soundEnabled) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'shoot') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
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
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.8);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        }
    };

    // DRAW LOGIC
    const draw = (ctx, canvas) => {
        ctx.fillStyle = '#0f0c29'; // Void background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines (Void aesthetic)
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
        ctx.lineWidth = 1;
        const offset = (Date.now() / 20) % 50;
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i - offset, 0);
            ctx.lineTo(i - offset, canvas.height);
            ctx.stroke();
        }

        const state = stateRef.current;

        // Player (Submarine/Ship) at fixed position
        const subY = 250 + Math.sin(state.frameCount / 30) * 10;
        ctx.fillStyle = '#00f260';
        ctx.beginPath();
        ctx.ellipse(80, subY, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#00CCFF';
        ctx.beginPath();
        ctx.arc(90, subY - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888';
        ctx.fillRect(45, subY - 5, 5, 10);
        // Shield radius
        ctx.strokeStyle = 'rgba(0, 242, 96, 0.3)';
        ctx.beginPath();
        ctx.arc(80, subY, 50, 0, Math.PI * 2);
        ctx.stroke();


        // Bullets (Lasers)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        state.bullets.forEach(b => {
            ctx.beginPath();
            ctx.moveTo(b.x - 10, b.y);
            ctx.lineTo(b.x + 10, b.y);
            ctx.stroke();
        });

        // Enemies
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        state.enemies.forEach(e => {
            // Draw Box
            ctx.fillStyle = e.isPowerUp ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.5)';
            ctx.strokeStyle = e.isPowerUp ? '#FFFFFF' : e.color;
            ctx.lineWidth = e.isPowerUp ? 4 : 2;
            
            // Width based on word length
            const boxWidth = Math.max(40, e.word.length * 15 + 20);
            
            ctx.beginPath();
            ctx.roundRect(e.x - boxWidth/2, e.y - 20, boxWidth, 40, 5);
            ctx.fill();
            
            if (state.targetEnemyId === e.id) {
                // Highlight targeted
                ctx.strokeStyle = '#fff';
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Word
            ctx.font = 'bold 20px "Courier New", monospace';
            
            // Split word into typed and untyped
            const typedPart = e.word.substring(0, e.typed);
            const untypedPart = e.word.substring(e.typed);
            
            // Calculate widths to center
            const totalWidth = ctx.measureText(e.word).width;
            let startX = e.x - totalWidth / 2;
            
            // Typed
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.fillText(typedPart, startX, e.y);
            startX += ctx.measureText(typedPart).width;
            
            // Untyped
            ctx.fillStyle = e.color;
            ctx.fillText(untypedPart, startX, e.y);
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

    // KEYBOARD INPUT
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== 'playing') return;
            const key = e.key.toUpperCase();
            if (!/^[A-Z0-9]$/.test(key)) return;

            const state = stateRef.current;
            if (state.targetEnemyId !== null) {
                const enemy = state.enemies.find(en => en.id === state.targetEnemyId);
                if (enemy) {
                    const nextChar = enemy.word[enemy.typed];
                    if (key === nextChar) {
                        enemy.typed++;
                        fireBullet(enemy);
                        if (enemy.typed === enemy.word.length) {
                            destroyEnemy(enemy);
                        }
                    } else {
                        // Miss sound?
                    }
                } else {
                    state.targetEnemyId = null;
                }
            } else {
                // Find enemy starting with key
                const validEnemies = state.enemies.filter(en => en.word[0] === key);
                if (validEnemies.length > 0) {
                    // Closest to player
                    validEnemies.sort((a, b) => a.x - b.x);
                    const enemy = validEnemies[0];
                    state.targetEnemyId = enemy.id;
                    enemy.typed = 1;
                    fireBullet(enemy);
                    if (enemy.word.length === 1) {
                        destroyEnemy(enemy);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Handle Mobile Input
    const handleMobileInput = (e) => {
        if (gameState !== 'playing') return;
        const val = e.target.value;
        if (val.length > 0) {
            const key = val[val.length - 1].toUpperCase();
            // Simulate keydown
            window.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
            // Clear input
            e.target.value = '';
        }
    };

    return (
        <div className="page-enter" style={{
            height: '100vh', width: '100vw', background: '#000',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}
        onClick={() => inputRef.current?.focus()}
        >
            {/* Hidden Input for Mobile Keyboard */}
            <input 
                ref={inputRef}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={handleMobileInput}
                style={{ position: 'absolute', top: '-100px', opacity: 0 }}
            />

            {/* Header / HUD */}
            <div style={{
                position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10,
                fontFamily: '"Orbitron", sans-serif', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.5rem', color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>SCORE: {score}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>HIGH: {highScore}</div>
                <div style={{ color: '#ff0055', marginTop: '5px', fontSize: '1.2rem', textShadow: '0 0 10px red' }}>
                    {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
                </div>
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
                style={{
                    border: '2px solid #b026ff',
                    borderRadius: '10px',
                    maxWidth: '100%',
                    background: '#0f0c29',
                    boxShadow: '0 0 30px #b026ff'
                }}
            />

            {/* Start Screen */}
            {gameState === 'start' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20
                }}>
                    <h1 style={{ color: '#00ffff', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 20px #00ffff', fontSize: '3rem', textAlign: 'center' }}>
                        VOID HUNTER
                    </h1>
                    <p style={{ color: 'white', textAlign: 'center', maxWidth: '400px', lineHeight: '1.5', fontFamily: 'monospace' }}>
                        Destroy the incoming Void anomalies by TYPING their code.
                        <br/><br/>
                        Start with single letters, progress to long strings. Survive as long as you can!
                    </p>
                    <button
                        onClick={startGame}
                        style={{
                            marginTop: '20px', padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #b026ff, #ff00ff)', border: 'none', borderRadius: '50px',
                            color: 'white', cursor: 'pointer', boxShadow: '0 0 20px rgba(176, 38, 255, 0.5)'
                        }}
                    >
                        START TYPING
                    </button>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.3)', backdropFilter: 'blur(5px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20
                }}>
                    <h1 style={{ color: 'white', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 20px red', fontSize: '4rem', margin: 0 }}>
                        BREACH DETECTED
                    </h1>
                    <div style={{ fontSize: '2rem', color: '#FFD700', margin: '20px 0', fontWeight: 'bold' }}>SCORE: {score}</div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={startGame}
                            style={{
                                padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold',
                                background: 'white', color: 'black', border: 'none', borderRadius: '50px',
                                cursor: 'pointer', boxShadow: '0 0 20px white'
                            }}
                        >
                            TRY AGAIN
                        </button>
                        <button
                            onClick={() => navigate('/arcade')}
                            style={{
                                padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold',
                                background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '50px',
                                cursor: 'pointer'
                            }}
                        >
                            ARCADE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubHunterGame;
