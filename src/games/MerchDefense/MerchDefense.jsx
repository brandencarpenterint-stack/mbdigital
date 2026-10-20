import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import { feedService } from '../../utils/feed';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
const CELL_SIZE = 40;

// ASSETS
const loadImg = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

const IMG_ASTRO = loadImg('/assets/skins/face_astro.png');
const IMG_BEAR = loadImg('/assets/skins/face_bear.png');
const IMG_MONEY = loadImg('/assets/skins/face_money.png');
const IMG_DINO = loadImg('/assets/skins/face_dino.png');
const IMG_TROLL = loadImg('/assets/skins/face_default.png'); // Haters

const TOWER_TYPES = {
    ASTRO: { name: 'Astro', img: IMG_ASTRO, cost: 50, range: 120, damage: 10, fireRate: 30, color: '#00ffff', desc: 'Fast lasers.' },
    BEAR: { name: 'Bear', img: IMG_BEAR, cost: 100, range: 80, damage: 40, fireRate: 90, color: '#ff8800', desc: 'Heavy hitter.' },
    DINO: { name: 'Dino', img: IMG_DINO, cost: 150, range: 100, damage: 20, fireRate: 60, color: '#00ff00', desc: 'Toxic splash.', splash: 50 },
    MONEY: { name: 'Money', img: IMG_MONEY, cost: 250, range: 200, damage: 100, fireRate: 120, color: 'gold', desc: 'Sniper cash.' }
};

const WAYPOINTS = [
    { x: 0, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 400 },
    { x: 400, y: 400 },
    { x: 400, y: 200 },
    { x: 600, y: 200 }
];

const MerchDefense = () => {
    const canvasRef = useRef(null);
    const { addCoins, updateStat, userProfile, stats } = useGamification();
    const { playShoot, playExplosion, playWin, playCrash, playBoop } = useRetroSound();

    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER, WIN
    const [hype, setHype] = useState(150);
    const [lives, setLives] = useState(20);
    const [wave, setWave] = useState(1);
    const [selectedTower, setSelectedTower] = useState('ASTRO');

    const stateRef = useRef({
        enemies: [],
        towers: [],
        projectiles: [],
        particles: [],
        frames: 0,
        waveActive: false,
        enemiesToSpawn: 0,
        spawnTimer: 0,
        hype: 150,
        lives: 20,
        wave: 1
    });

    // Sync state down
    useEffect(() => {
        stateRef.current.hype = hype;
        stateRef.current.lives = lives;
        stateRef.current.wave = wave;
    }, [hype, lives, wave]);

    const startWave = () => {
        if (stateRef.current.waveActive) return;
        stateRef.current.waveActive = true;
        stateRef.current.enemiesToSpawn = 5 + (stateRef.current.wave * 3);
        stateRef.current.spawnTimer = 60; // 1 second
        playBoop();
    };

    const startGame = () => {
        stateRef.current = {
            ...stateRef.current,
            enemies: [], towers: [], projectiles: [], particles: [],
            frames: 0, waveActive: false, enemiesToSpawn: 0,
            hype: 150, lives: 20, wave: 1
        };
        setHype(150);
        setLives(20);
        setWave(1);
        setGameState('PLAYING');
    };

    // GAME LOOP
    useEffect(() => {
        if (gameState !== 'PLAYING') return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const loop = () => {
            const state = stateRef.current;
            state.frames++;

            // SPAWN ENEMIES
            if (state.waveActive) {
                state.spawnTimer--;
                if (state.spawnTimer <= 0 && state.enemiesToSpawn > 0) {
                    state.enemies.push({
                        x: WAYPOINTS[0].x,
                        y: WAYPOINTS[0].y,
                        wpIndex: 1,
                        hp: 30 + (state.wave * 20),
                        maxHp: 30 + (state.wave * 20),
                        speed: 1.5 + (state.wave * 0.1),
                        radius: 15
                    });
                    state.enemiesToSpawn--;
                    state.spawnTimer = Math.max(20, 60 - (state.wave * 2));
                }

                if (state.enemiesToSpawn <= 0 && state.enemies.length === 0) {
                    state.waveActive = false;
                    setWave(w => {
                        const next = w + 1;
                        addCoins(next * 25);
                        updateStat('merchDefenseHighScore', Math.max(stats?.merchDefenseHighScore || 0, next));
                        if (next > 10) {
                            setGameState('WIN');
                            addCoins(1000);
                            playWin();
                                                        feedService.publish({ text: '🏰 ' + (userProfile?.name || 'Commander') + ' conquered all 10 Waves in Merch Defense!', type: 'jackpot' });
                        }
                        return next;
                    });
                }
            }

            // UPDATE ENEMIES
            for (let i = state.enemies.length - 1; i >= 0; i--) {
                const e = state.enemies[i];
                const target = WAYPOINTS[e.wpIndex];
                const dx = target.x - e.x;
                const dy = target.y - e.y;
                const dist = Math.hypot(dx, dy);

                if (dist < e.speed) {
                    e.x = target.x;
                    e.y = target.y;
                    e.wpIndex++;
                    if (e.wpIndex >= WAYPOINTS.length) {
                        // Reached base
                        state.enemies.splice(i, 1);
                        setLives(l => {
                            const nl = l - 1;
                            if (nl <= 0) {
                                setGameState('GAMEOVER');
                                playCrash();
                                                                if (stateRef.current.wave >= 3) {
                                    feedService.publish({ text: '🛡️ ' + (userProfile?.name || 'Defender') + ' defended to Wave ' + stateRef.current.wave + ' in Merch Defense!', type: 'game' });
                                }
                            }
                            return nl;
                        });
                        playCrash();
                        continue;
                    }
                } else {
                    e.x += (dx / dist) * e.speed;
                    e.y += (dy / dist) * e.speed;
                }
            }

            // UPDATE TOWERS
            state.towers.forEach(t => {
                if (state.frames % t.fireRate === 0) {
                    // Find target
                    const target = state.enemies.find(e => Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
                    if (target) {
                        state.projectiles.push({
                            x: t.x, y: t.y,
                            tx: target.x, ty: target.y,
                            speed: 8,
                            damage: t.damage,
                            color: t.color,
                            splash: t.splash || 0
                        });
                        playShoot();
                    }
                }
            });

            // UPDATE PROJECTILES
            for (let i = state.projectiles.length - 1; i >= 0; i--) {
                const p = state.projectiles[i];
                const dx = p.tx - p.x;
                const dy = p.ty - p.y;
                const dist = Math.hypot(dx, dy);

                if (dist < p.speed) {
                    // Hit!
                    state.projectiles.splice(i, 1);
                    
                    // Create Particles
                    for(let k=0; k<5; k++) {
                        state.particles.push({
                            x: p.tx, y: p.ty,
                            vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
                            life: 20, color: p.color
                        });
                    }

                    // Damage
                    if (p.splash > 0) {
                        state.enemies.forEach(e => {
                            if (Math.hypot(e.x - p.tx, e.y - p.ty) <= p.splash) {
                                e.hp -= p.damage;
                            }
                        });
                    } else {
                        // Find closest enemy to impact
                        const hitEnemy = state.enemies.find(e => Math.hypot(e.x - p.tx, e.y - p.ty) <= 20);
                        if (hitEnemy) hitEnemy.hp -= p.damage;
                    }
                } else {
                    p.x += (dx / dist) * p.speed;
                    p.y += (dy / dist) * p.speed;
                }
            }

            // KILL ENEMIES
            for (let i = state.enemies.length - 1; i >= 0; i--) {
                if (state.enemies[i].hp <= 0) {
                    state.enemies.splice(i, 1);
                    setHype(h => h + 10);
                    playExplosion();
                }
            }

            // UPDATE PARTICLES
            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if (p.life <= 0) state.particles.splice(i, 1);
            }

            // DRAW
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Draw Path
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
            WAYPOINTS.forEach(wp => ctx.lineTo(wp.x, wp.y));
            ctx.stroke();

            // Draw Base
            ctx.fillStyle = '#00ffcc';
            const lastWp = WAYPOINTS[WAYPOINTS.length-1];
            ctx.fillRect(lastWp.x - 20, lastWp.y - 20, 40, 40);
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('STORE', lastWp.x - 18, lastWp.y + 5);

            // Draw Towers
            state.towers.forEach(t => {
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.range, 0, Math.PI*2);
                ctx.fill();

                if (t.img && t.img.complete) {
                    ctx.drawImage(t.img, t.x - 20, t.y - 20, 40, 40);
                } else {
                    ctx.fillStyle = t.color;
                    ctx.fillRect(t.x - 15, t.y - 15, 30, 30);
                }
            });

            // Draw Enemies
            state.enemies.forEach(e => {
                if (IMG_TROLL && IMG_TROLL.complete) {
                    ctx.drawImage(IMG_TROLL, e.x - e.radius, e.y - e.radius, e.radius*2, e.radius*2);
                } else {
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(e.x, e.y, e.radius, 0, Math.PI*2);
                    ctx.fill();
                }
                // HP Bar
                ctx.fillStyle = 'red';
                ctx.fillRect(e.x - 15, e.y - 20, 30, 4);
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(e.x - 15, e.y - 20, 30 * (Math.max(0, e.hp) / e.maxHp), 4);
            });

            // Draw Projectiles
            state.projectiles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
                ctx.fill();
            });

            // Draw Particles
            state.particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 20;
                ctx.fillRect(p.x, p.y, 4, 4);
                ctx.globalAlpha = 1.0;
            });

            animationId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(animationId);
    }, [gameState]);

    const handleCanvasClick = (e) => {
        if (gameState !== 'PLAYING') return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        // Check if on path
        let onPath = false;
        // Simple distance check to line segments
        for(let i=0; i<WAYPOINTS.length-1; i++) {
            const p1 = WAYPOINTS[i];
            const p2 = WAYPOINTS[i+1];
            // Math magic for distance to segment
            const l2 = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
            let t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            const projX = p1.x + t * (p2.x - p1.x);
            const projY = p1.y + t * (p2.y - p1.y);
            const dist = Math.hypot(x - projX, y - projY);
            if (dist < 30) onPath = true; // Path width + padding
        }

        if (onPath) {
            playCrash(); // Error sound
            return; 
        }

        // Check overlapping towers
        const overlap = stateRef.current.towers.some(t => Math.hypot(t.x - x, t.y - y) < 40);
        if (overlap) {
            playCrash();
            return;
        }

        const tType = TOWER_TYPES[selectedTower];
        if (hype >= tType.cost) {
            setHype(h => h - tType.cost);
            stateRef.current.towers.push({
                x, y,
                ...tType
            });
            playBoop();
        } else {
            playCrash(); // Not enough hype
        }
    };

    return (
        <div className="page-enter" style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Link to="/arcade" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>â ARCADE</Link>
                <h1 style={{ margin: 0, color: '#00ffcc', textShadow: '0 0 10px #00ffcc', fontFamily: '"Press Start 2P"' }}>MERCH DEFENSE</h1>
                <div style={{ color: '#ffcc00', fontWeight: 'bold' }}>HYPE: {hype} | LIVES: {lives}</div>
            </div>

            {gameState === 'START' && (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <h2>DEFEND THE MERCH STORE FROM THE HATERS!</h2>
                    <p style={{ color: '#aaa' }}>Place Branded Towers to stop them.</p>
                    <SquishyButton onClick={startGame} style={{ padding: '20px 60px', background: '#00ffcc', color: 'black', fontSize: '1.5rem', marginTop: '20px' }}>DEPLOY NOW</SquishyButton>
                </div>
            )}

            {(gameState === 'GAMEOVER' || gameState === 'WIN') && (
                <UniversalGameOver score={wave} onRestart={startGame} title={gameState === 'WIN' ? "STORE SECURED!" : "THE HATERS WON"} />
            )}

            {gameState === 'PLAYING' && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* CANVAS */}
                    <div style={{ border: '4px solid #333', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,255,200,0.1)' }}>
                        <canvas 
                            ref={canvasRef} 
                            width={GAME_WIDTH} 
                            height={GAME_HEIGHT} 
                            onClick={handleCanvasClick} onTouchStart={handleCanvasClick}
                            style={{ cursor: 'crosshair', maxWidth: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>

                    {/* UI PANEL */}
                    <div style={{ width: '300px', background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, color: 'white' }}>WAVE {wave}/10</h2>
                            {!stateRef.current.waveActive ? (
                                <SquishyButton onClick={startWave} style={{ background: '#ff0055', color: 'white', padding: '10px' }}>SEND THEM</SquishyButton>
                            ) : (
                                <div style={{ color: '#ff0055' }} className="blink">IN PROGRESS...</div>
                            )}
                        </div>

                        <h3 style={{ color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '10px' }}>TOWERS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.keys(TOWER_TYPES).map(t => {
                                const info = TOWER_TYPES[t];
                                const isSelected = selectedTower === t;
                                const canAfford = hype >= info.cost;
                                return (
                                    <div 
                                        key={t}
                                        onClick={() => setSelectedTower(t)}
                                        style={{ 
                                            background: isSelected ? '#222' : '#000',
                                            border: isSelected ? `2px solid ${info.color}` : '2px solid #333',
                                            padding: '10px', borderRadius: '8px',
                                            cursor: 'pointer', display: 'flex', gap: '10px',
                                            opacity: canAfford ? 1 : 0.5
                                        }}
                                    >
                                        <div style={{ width: '50px', height: '50px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={info.img.src} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: info.color }}>{info.name} - {info.cost} HYPE</div>
                                            <div style={{ fontSize: '0.7rem', color: '#888' }}>{info.desc}</div>
                                            <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '5px' }}>RNG: {info.range} | DMG: {info.damage}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
                            Click the grid to place the selected tower. Towers cannot be placed on the dark grey path or overlapping each other.
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default MerchDefense;