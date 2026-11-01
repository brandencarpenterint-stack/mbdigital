import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
import { usePocketBro } from '../../context/PocketBroContext';
import { feedService } from '../../utils/feed';
import { drawCanvasAura } from '../../utils/skinAuraCanvas';
import { getSkinAura } from '../../config/SkinAuras';
import { GhostDuelHUD } from '../../components/GhostDuelHUD';
import { ShareDuelModal } from '../../components/ShareDuelModal';
import { getGhostDuelFromUrl, interpolateGhostPosition, savePersonalBestGhost } from '../../utils/ghostDuelCodec';

const BIOMES = [
    { name: 'NEON CITY', bg: '#0d0221', grid: '#ff00ff', obs: ['#00ffaa', '#ff00ff'] },
    { name: 'MAGMA CORE', bg: '#220000', grid: '#ff4400', obs: ['#ffaa00', '#ff4400'] },
    { name: 'ICE CAVERN', bg: '#001133', grid: '#00ffff', obs: ['#ffffff', '#88ccff'] },
    { name: 'TOXIC JUNGLE', bg: '#002200', grid: '#00ff00', obs: ['#ccff00', '#009900'] },
    { name: 'THE VOID', bg: '#030008', grid: '#a855f7', obs: ['#a855f7', '#00f0ff'] }
];

const FaceRunner = () => {
    const { updateStat, addCoins, userProfile, stats, coins } = useGamification() || {};
    const { awardArcadeXP } = usePocketBro?.() || {};
    const canvasRef = useRef(null);
    const { soundEnabled } = useSettings();
    const { playCrash, playCollect, playWin, playShoot, playLaser, playPowerUp, playFanfare, playExplosion, playHit, playBeep } = useRetroSound();

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const TUNNEL_DEPTH = 2000;

    // State
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [canRestart, setCanRestart] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('faceRunnerHighScore')) || 0);

    // --- EPIC POWER-UPS & BOSS ENCOUNTERS ---
    const [activeShield, setActiveShield] = useState(false);
    const [activeBuff, setActiveBuff] = useState(null); // { type, label, timeLeft }
    const [bossDisplay, setBossDisplay] = useState(null); // { name, hp, maxHp }

    const activeShieldRef = useRef(false);
    const activeBuffRef = useRef(null); // { type, label, expiresAt }
    const powerUps3DRef = useRef([]); // [{ id, type, x, y, z, rot, size }]
    const torpedoes3DRef = useRef([]); // [{ id, x, y, z, pulse }]
    const playerMissilesRef = useRef([]); // [{ x, y, z, targetZ }]
    const particles3DRef = useRef([]); // [{ x, y, z, vx, vy, vz, color, alpha, decay }]

    const bossRef = useRef({
        active: false,
        name: 'THE OVERSEER MK-II',
        hp: 8,
        maxHp: 8,
        z: 750,
        angle: 0,
        attackTimer: 0,
        hitFlash: 0,
        bullets: [], // [{ x, y, z, vx, vy, vz, size, color }]
        stage: 1 // 1: Overseer (1500m), 2: Void Leviathan (3500m)
    });

    // Sync local high score with global stat on mount
    useEffect(() => {
        if (stats?.faceRunnerHighScore > highScore) {
            setHighScore(stats.faceRunnerHighScore);
        }
    }, [stats]);
    const [selectedFace, setSelectedFace] = useState('face_default');

    // --- GHOST DUEL STATES ---
    const [activeGhost, setActiveGhost] = useState(() => getGhostDuelFromUrl());
    const location = useLocation();
    useEffect(() => {
        const duel = getGhostDuelFromUrl();
        if (duel) {
            setActiveGhost(duel);
        }
    }, [location.search]);

    const [ghostPos, setGhostPos] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [lastFinishedRun, setLastFinishedRun] = useState(null);
    const [duelWon, setDuelWon] = useState(null);

    const runStartTimeRef = useRef(0);
    const runKeyframesRef = useRef([]);
    const lastSampleTimeRef = useRef(0);
    const ghostImgRef = useRef(null);

    // Preload Ghost Rival Skin
    useEffect(() => {
        if (activeGhost?.skinId) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            const src = activeGhost.skinId.startsWith('/') ? activeGhost.skinId : `/assets/skins/${activeGhost.skinId}.png`;
            img.src = src;
            ghostImgRef.current = img;
        }
    }, [activeGhost]);

    // Refs for Loop
    const playingRef = useRef(false);
    const speedRef = useRef(30);
    const scoreRef = useRef(0);
    const biomeIndexRef = useRef(0);
    const shakeRef = useRef(0);

    // Entities
    const playerRef = useRef({ x: 0, y: 0, squash: 1 });
    const obstaclesRef = useRef([]); // {x, y, z, color, rot}
    const requestRef = useRef(null);

    // ALL 25 SKINS INTACT
    const SKINS = [
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png' },
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png' },
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png' },
        { id: 'face_astro', name: 'ASTRO', src: '/assets/skins/face_astro.png' },
        { id: 'face_gamer', name: 'GAMER', src: '/assets/skins/face_gamer.png' },
        { id: 'face_star', name: 'STAR', src: '/assets/skins/face_star.png' },
        { id: 'face_star_dark', name: 'DARK STAR', src: '/assets/skins/face_star_dark.jpg' },
        { id: 'face_space', name: 'COSMIC', src: '/assets/skins/face_space.png' },
        { id: 'face_space_dark', name: 'OBSIDIAN', src: '/assets/skins/face_space_dark.jpg' },
        { id: 'face_dino', name: 'DINO', src: '/assets/skins/face_dino.png' },
        { id: 'face_dino_dark', name: 'DARK DINO', src: '/assets/skins/face_dino_dark.jpg' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
        { id: 'face_bunny_hoodie', name: 'STREET BUNNY', src: '/assets/skins/face_bunny_hoodie.png' },
        { id: 'face_bunny_blue', name: 'CYAN BUNNY', src: '/assets/skins/face_bunny_blue.png' },
        { id: 'face_cat', name: 'NEKO', src: '/assets/skins/face_cat.png' },
        { id: 'face_frog', name: 'PEPE', src: '/assets/skins/face_frog.png' },
        { id: 'face_pumpkin', name: 'SPOOKY', src: '/assets/skins/face_pumpkin.png' },
        { id: 'face_rainbow', name: 'PRISM', src: '/assets/skins/face_rainbow.png' },
        { id: 'face_hoodie', name: 'HYPE HOODIE', src: '/assets/skins/face_hoodie.png' },
        { id: 'face_hoodie_brown', name: 'BRONZE HOODIE', src: '/assets/skins/face_hoodie_brown.png' },
        { id: 'face_skater', name: 'SKATER', src: '/assets/skins/face_skater.jpg' },
        { id: 'face_standard_bw', name: 'MONOCHROME', src: '/assets/skins/face_standard_bw.png' },
        { id: 'logo_main', name: 'FOUNDER', src: '/assets/skins/logo_main.png' },
        { id: 'logo_typography', name: 'CYBER LOGO', src: '/assets/skins/logo_typography.png' },
    ];
    const faceImgs = useRef({});

    useEffect(() => {
        SKINS.forEach(skin => {
            const img = new Image();
            img.src = skin.src;
            faceImgs.current[skin.id] = img;
        });
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const startGame = () => {
        setGameState('PLAYING');
        setCanRestart(false);
        playingRef.current = true;
        setScore(0);

        // Reset Ghost Duel telemetry
        runStartTimeRef.current = performance.now();
        runKeyframesRef.current = [];
        lastSampleTimeRef.current = 0;
        setGhostPos(null);
        setDuelWon(null);

        // Reset Epic Buffs, Power-Ups & Bosses
        activeShieldRef.current = false;
        setActiveShield(false);
        activeBuffRef.current = null;
        setActiveBuff(null);
        setBossDisplay(null);
        powerUps3DRef.current = [];
        torpedoes3DRef.current = [];
        playerMissilesRef.current = [];
        particles3DRef.current = [];
        shakeRef.current = 0;

        bossRef.current = {
            active: false,
            name: 'THE OVERSEER MK-II',
            hp: 8,
            maxHp: 8,
            z: 750,
            angle: 0,
            attackTimer: 0,
            hitFlash: 0,
            bullets: [],
            stage: 1
        };

        speedRef.current = 30;
        scoreRef.current = 0;
        biomeIndexRef.current = 0;
        playerRef.current = { x: 0, y: 0, squash: 1 };
        obstaclesRef.current = [];

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnObstacle = (currentBiome) => {
        const spread = 800;
        const color = currentBiome.obs[Math.floor(Math.random() * currentBiome.obs.length)];
        obstaclesRef.current.push({
            x: (Math.random() - 0.5) * spread * 1.5,
            y: (Math.random() - 0.5) * spread * 1.5,
            z: TUNNEL_DEPTH,
            color: color,
            rot: Math.random() * Math.PI,
            size: 100 + Math.random() * 100
        });
    };

    const spawn3DPowerUp = () => {
        const types = ['shield', 'slipstream', 'emp', 'mult'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        powerUps3DRef.current.push({
            id: Math.random(),
            type: chosen,
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 450,
            z: TUNNEL_DEPTH,
            rot: 0,
            size: 80
        });
    };

    const gameLoop = (timestamp) => {
        if (!canvasRef.current) return;

        if (timestamp) {
            if (!playerRef.current.lastTime) playerRef.current.lastTime = timestamp;
            const delta = timestamp - playerRef.current.lastTime;
            if (delta < 16) {
                requestRef.current = requestAnimationFrame(gameLoop);
                return;
            }
            playerRef.current.lastTime = timestamp - (delta % 16);
        }

        const ctx = canvasRef.current.getContext('2d');
        const width = CANVAS_WIDTH;
        const height = CANVAS_HEIGHT;
        const cx = width / 2;
        const cy = height / 2;
        const now = performance.now();

        // Check active buff timer
        if (activeBuffRef.current) {
            const timeLeft = Math.max(0, Math.ceil((activeBuffRef.current.expiresAt - now) / 1000));
            if (timeLeft <= 0) {
                activeBuffRef.current = null;
                setActiveBuff(null);
            } else {
                setActiveBuff(prev => prev ? { ...prev, timeLeft } : null);
            }
        }

        // Biome Logic
        const distance = Math.floor(scoreRef.current);
        const biomeStage = Math.floor(distance / 2500) % BIOMES.length;
        biomeIndexRef.current = biomeStage;
        const currentBiome = BIOMES[biomeStage];

        const boss = bossRef.current;

        // --- BOSS SUMMON TRIGGERS ---
        if (!boss.active) {
            if (distance >= 1500 && boss.stage === 1) {
                // Summon Boss 1: The Overseer MK-II
                boss.active = true;
                boss.name = 'THE OVERSEER MK-II';
                boss.hp = 8;
                boss.maxHp = 8;
                boss.z = 800;
                boss.bullets = [];
                setBossDisplay({ name: boss.name, hp: 8, maxHp: 8 });
                playLaser?.();
                shakeRef.current = 15;
            } else if (distance >= 3500 && boss.stage === 2) {
                // Summon Boss 2: Void Leviathan
                boss.active = true;
                boss.name = 'VOID LEVIATHAN';
                boss.hp = 14;
                boss.maxHp = 14;
                boss.z = 700;
                boss.bullets = [];
                setBossDisplay({ name: boss.name, hp: 14, maxHp: 14 });
                playLaser?.();
                shakeRef.current = 18;
            }
        }

        // --- SPEED & UPDATE ---
        if (playingRef.current) {
            let baseSpeed = Math.min(50 + (scoreRef.current * 0.03), 150);
            if (activeBuffRef.current?.type === 'slipstream') {
                baseSpeed *= 1.7; // Quantum Slipstream speed
            }
            speedRef.current = baseSpeed;

            // Spawn Obstacles (only when Boss is NOT active)
            if (!boss.active && Math.random() < 0.08) {
                spawnObstacle(currentBiome);
            }

            // Spawn 3D Power-Ups occasionally (when boss is not active)
            if (!boss.active && powerUps3DRef.current.length < 2 && Math.random() < 0.02) {
                spawn3DPowerUp();
            }

            // Spawn 3D Plasma Torpedoes during Boss fights for player to retaliate
            if (boss.active && torpedoes3DRef.current.length < 2 && Math.random() < 0.05) {
                torpedoes3DRef.current.push({
                    id: Math.random(),
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 400,
                    z: TUNNEL_DEPTH,
                    pulse: 0
                });
            }

            // Move Obstacles
            for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
                const obs = obstaclesRef.current[i];
                obs.z -= speedRef.current;

                if (obs.z <= 0) {
                    obstaclesRef.current.splice(i, 1);
                    const ptsEarned = activeBuffRef.current?.type === 'mult' ? 45 : 15;
                    scoreRef.current += ptsEarned;
                    setScore(Math.floor(scoreRef.current));
                }
            }

            // Move 3D Power-Ups
            for (let pi = powerUps3DRef.current.length - 1; pi >= 0; pi--) {
                const pu = powerUps3DRef.current[pi];
                pu.z -= speedRef.current;
                pu.rot += 0.04;

                // Hitbox check with player
                if (pu.z < 110 && pu.z > 0) {
                    const fov = 600;
                    const scale = fov / pu.z;
                    const sx = cx + pu.x * scale;
                    const sy = cy + pu.y * scale;
                    const dx = sx - (cx + playerRef.current.x);
                    const dy = sy - (cy + playerRef.current.y);
                    if (Math.hypot(dx, dy) < 70) {
                        // Collect Power-up!
                        playPowerUp?.();
                        if (navigator.vibrate) navigator.vibrate(30);

                        if (pu.type === 'shield') {
                            activeShieldRef.current = true;
                            setActiveShield(true);
                        } else if (pu.type === 'slipstream') {
                            activeBuffRef.current = { type: 'slipstream', label: 'QUANTUM SLIPSTREAM', expiresAt: now + 6000 };
                            setActiveBuff({ type: 'slipstream', label: 'QUANTUM SLIPSTREAM', timeLeft: 6 });
                        } else if (pu.type === 'emp') {
                            // Instant screen wipe
                            const clearedCount = obstaclesRef.current.length;
                            obstaclesRef.current = [];
                            if (addCoins) addCoins(clearedCount * 25);
                            playExplosion?.();
                            shakeRef.current = 20;
                        } else if (pu.type === 'mult') {
                            activeBuffRef.current = { type: 'mult', label: '3x MULTIPLIER', expiresAt: now + 8000 };
                            setActiveBuff({ type: 'mult', label: '3x MULTIPLIER', timeLeft: 8 });
                        }

                        powerUps3DRef.current.splice(pi, 1);
                        continue;
                    }
                }

                if (pu.z <= 0) {
                    powerUps3DRef.current.splice(pi, 1);
                }
            }

            // Move 3D Torpedoes (during Boss encounters)
            for (let ti = torpedoes3DRef.current.length - 1; ti >= 0; ti--) {
                const torp = torpedoes3DRef.current[ti];
                torp.z -= speedRef.current * 0.9;
                torp.pulse += 0.08;

                if (torp.z < 110 && torp.z > 0) {
                    const fov = 600;
                    const scale = fov / torp.z;
                    const sx = cx + torp.x * scale;
                    const sy = cy + torp.y * scale;
                    const dx = sx - (cx + playerRef.current.x);
                    const dy = sy - (cy + playerRef.current.y);
                    if (Math.hypot(dx, dy) < 75) {
                        // Collected Torpedo -> Fire Missile down the tunnel at Boss!
                        playShoot?.();
                        playerMissilesRef.current.push({
                            x: playerRef.current.x,
                            y: playerRef.current.y,
                            z: 50,
                            targetZ: boss.z
                        });
                        torpedoes3DRef.current.splice(ti, 1);
                        continue;
                    }
                }

                if (torp.z <= 0) {
                    torpedoes3DRef.current.splice(ti, 1);
                }
            }

            // Move Player Missiles down tunnel towards Boss
            for (let mi = playerMissilesRef.current.length - 1; mi >= 0; mi--) {
                const m = playerMissilesRef.current[mi];
                m.z += 45; // Flies forward into depth

                // Hit Boss
                if (boss.active && m.z >= boss.z) {
                    boss.hp = Math.max(0, boss.hp - 2);
                    boss.hitFlash = 10;
                    playExplosion?.();
                    shakeRef.current = 16;
                    setBossDisplay({ name: boss.name, hp: boss.hp, maxHp: boss.maxHp });
                    playerMissilesRef.current.splice(mi, 1);
                    continue;
                }

                if (m.z > TUNNEL_DEPTH) {
                    playerMissilesRef.current.splice(mi, 1);
                }
            }

            // --- BOSS ATTACK CYCLE ---
            if (boss.active) {
                boss.angle += 0.03;
                boss.attackTimer++;

                if (boss.attackTimer >= 90) {
                    boss.attackTimer = 0;
                    playLaser?.();
                    // Fire 2 plasma orbs towards player crosshairs
                    boss.bullets.push({
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 300,
                        z: boss.z,
                        size: 70,
                        color: boss.stage === 1 ? '#ff0055' : '#00f0ff'
                    });
                }

                // Move & Draw Boss Bullets
                for (let bi = boss.bullets.length - 1; bi >= 0; bi--) {
                    const bb = boss.bullets[bi];
                    bb.z -= speedRef.current * 1.1;

                    // Collision with player
                    if (bb.z < 100 && bb.z > 0) {
                        const fov = 600;
                        const scale = fov / bb.z;
                        const sx = cx + bb.x * scale;
                        const sy = cy + bb.y * scale;
                        const dx = sx - (cx + playerRef.current.x);
                        const dy = sy - (cy + playerRef.current.y);
                        if (Math.hypot(dx, dy) < (bb.size * scale * 0.4 + 28)) {
                            if (activeShieldRef.current) {
                                activeShieldRef.current = false;
                                setActiveShield(false);
                                shakeRef.current = 18;
                                playCrash?.();
                                boss.bullets.splice(bi, 1);
                                continue;
                            } else if (activeBuffRef.current?.type === 'slipstream') {
                                // Invulnerable
                                boss.bullets.splice(bi, 1);
                                continue;
                            } else {
                                handleCrash();
                                break;
                            }
                        }
                    }

                    if (bb.z <= 0) {
                        boss.bullets.splice(bi, 1);
                    }
                }

                // Check Boss Defeat
                if (boss.hp <= 0) {
                    boss.active = false;
                    setBossDisplay(null);
                    shakeRef.current = 30;
                    playFanfare?.();
                    playExplosion?.();

                    const bonusCP = boss.stage === 1 ? 500 : 1000;
                    if (addCoins) addCoins(bonusCP);

                    // Advance boss stage
                    boss.stage += 1;
                }
            }
        }

        // --- DRAW 3D TUNNEL & MATRIX ---
        ctx.save();
        if (shakeRef.current > 0) {
            const sx = (Math.random() - 0.5) * shakeRef.current;
            const sy = (Math.random() - 0.5) * shakeRef.current;
            ctx.translate(sx, sy);
            shakeRef.current *= 0.88;
            if (shakeRef.current < 0.5) shakeRef.current = 0;
        }

        ctx.fillStyle = currentBiome.bg;
        ctx.fillRect(0, 0, width, height);

        // Tunnel Wireframe
        ctx.strokeStyle = currentBiome.grid;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * width, cy + Math.sin(angle) * height);
        }
        const offset = (performance.now() * speedRef.current * 0.05) % 500;
        for (let z = 500; z > 0; z -= 500 / 5) {
            const d = (z - offset + 500) % 500;
            if (d < 10) continue;
            const scale = 500 / d;
            const size = 50 * scale;
            if (size < width * 2) {
                ctx.rect(cx - size, cy - size, size * 2, size * 2);
            }
        }
        ctx.stroke();

        // --- DRAW 3D BOSS IN TUNNEL DEPTH ---
        if (boss.active) {
            const fov = 600;
            const bScale = fov / boss.z;
            const bSize = 180 * bScale;

            ctx.save();
            ctx.translate(cx, cy);
            if (boss.hitFlash > 0) {
                boss.hitFlash--;
                ctx.filter = 'brightness(2.5)';
            }

            if (boss.stage === 1) {
                // THE OVERSEER MK-II: Rotating cyber eye core with mechanical petals
                ctx.rotate(boss.angle);
                ctx.strokeStyle = '#ff0055';
                ctx.lineWidth = 4 * bScale;
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 18;
                ctx.strokeRect(-bSize / 2, -bSize / 2, bSize, bSize);

                ctx.rotate(-boss.angle * 2);
                ctx.strokeStyle = '#00f0ff';
                ctx.strokeRect(-bSize * 0.35, -bSize * 0.35, bSize * 0.7, bSize * 0.7);

                // Central Eye Core
                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.arc(0, 0, bSize * 0.22, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // VOID LEVIATHAN: Serpentine rings
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 5 * bScale;
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(Math.sin(boss.angle) * 80 * bScale, Math.cos(boss.angle) * 60 * bScale, bSize * 0.6, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#00f0ff';
                ctx.beginPath();
                ctx.arc(0, 0, bSize * 0.25, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // --- DRAW BOSS BULLETS ---
        if (boss.active) {
            boss.bullets.forEach(bb => {
                if (bb.z < 10) return;
                const fov = 600;
                const scale = fov / bb.z;
                const sx = cx + bb.x * scale;
                const sy = cy + bb.y * scale;
                const size = bb.size * scale;

                ctx.save();
                ctx.translate(sx, sy);
                ctx.fillStyle = bb.color;
                ctx.shadowColor = bb.color;
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        // --- DRAW 3D OBSTACLES ---
        obstaclesRef.current.sort((a, b) => b.z - a.z);
        obstaclesRef.current.forEach(obs => {
            if (obs.z < 10) return;
            const fov = 600;
            const scale = fov / obs.z;
            const sx = cx + obs.x * scale;
            const sy = cy + obs.y * scale;
            const size = obs.size * scale;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(obs.rot + (performance.now() * 0.002));

            // Hitbox Check
            if (obs.z < 100 && playingRef.current) {
                const dx = sx - (cx + playerRef.current.x);
                const dy = sy - (cy + playerRef.current.y);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (size / 2 + 30)) {
                    if (activeBuffRef.current?.type === 'slipstream') {
                        // Slipstream destroys obstacle on ram
                        obs.z = -100;
                        scoreRef.current += 50;
                        playCrash?.();
                        shakeRef.current = 10;
                    } else if (activeShieldRef.current) {
                        // Shield absorbs hit
                        activeShieldRef.current = false;
                        setActiveShield(false);
                        obs.z = -100;
                        shakeRef.current = 16;
                        playCrash?.();
                    } else {
                        handleCrash();
                    }
                }
            }

            ctx.fillStyle = obs.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = obs.color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);
            ctx.restore();
        });

        // --- DRAW 3D POWER-UPS ---
        powerUps3DRef.current.forEach(pu => {
            if (pu.z < 10) return;
            const fov = 600;
            const scale = fov / pu.z;
            const sx = cx + pu.x * scale;
            const sy = cy + pu.y * scale;
            const size = pu.size * scale;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(pu.rot);

            const puColors = { shield: '#00f0ff', slipstream: '#ffd700', emp: '#38bdf8', mult: '#ec4899' };
            const col = puColors[pu.type] || '#00f0ff';

            ctx.strokeStyle = col;
            ctx.lineWidth = 3;
            ctx.shadowColor = col;
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fill();

            // Icon
            ctx.fillStyle = col;
            ctx.font = `bold ${Math.max(10, size * 0.45)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const puIcons = { shield: '🛡', slipstream: '⚡', emp: '💥', mult: '3X' };
            ctx.fillText(puIcons[pu.type] || '★', 0, 1);
            ctx.restore();
        });

        // --- DRAW 3D TORPEDO PICKUPS ---
        torpedoes3DRef.current.forEach(torp => {
            if (torp.z < 10) return;
            const fov = 600;
            const scale = fov / torp.z;
            const sx = cx + torp.x * scale;
            const sy = cy + torp.y * scale;
            const size = 65 * scale;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#0284c7';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(-size / 2, -size / 4, size, size / 2, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.max(8, size * 0.3)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('EMP', 0, 1);
            ctx.restore();
        });

        // --- DRAW PLAYER MISSILES IN FLIGHT ---
        playerMissilesRef.current.forEach(m => {
            const fov = 600;
            const scale = fov / m.z;
            const sx = cx + m.x * scale;
            const sy = cy + m.y * scale;
            const size = 30 * scale;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(3, size / 2), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // --- GHOST DUEL TELEMETRY & PLAYBACK ---
        const elapsedLoop = now - (runStartTimeRef.current || now);
        if (playingRef.current) {
            if (!lastSampleTimeRef.current || now - lastSampleTimeRef.current >= 150) {
                runKeyframesRef.current.push({
                    t: Math.round(elapsedLoop),
                    x: Math.round(playerRef.current.x),
                    y: Math.round(playerRef.current.y),
                    score: Math.round(scoreRef.current)
                });
                lastSampleTimeRef.current = now;
            }
        }

        // Render Rival Phantom Ghost in 3D Tunnel
        if (activeGhost && playingRef.current) {
            const gPos = interpolateGhostPosition(activeGhost, elapsedLoop);
            if (gPos) {
                setGhostPos(gPos);
                const gx = cx + gPos.x;
                const gy = cy + gPos.y;

                ctx.save();
                ctx.globalAlpha = 0.55;
                ctx.shadowBlur = 18;
                ctx.shadowColor = '#00f0ff';

                const gSize = 85;
                if (ghostImgRef.current && ghostImgRef.current.complete) {
                    ctx.drawImage(ghostImgRef.current, gx - gSize / 2, gy - gSize / 2, gSize, gSize);
                } else {
                    ctx.fillStyle = '#00f0ff';
                    ctx.beginPath();
                    ctx.arc(gx, gy, gSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Nameplate
                ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                const tagW = 86;
                ctx.beginPath();
                ctx.roundRect(gx - tagW / 2, gy - 62, tagW, 18, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#00f0ff';
                ctx.font = 'bold 9px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`👻 ${(activeGhost.playerName || 'Rival').slice(0, 9)}`, gx, gy - 49);

                ctx.restore();
            }
        }

        // --- DRAW PLAYER WITH AURA & SHIELD ---
        if (playingRef.current) {
            const p = playerRef.current;
            p.squash = 1 + Math.sin(performance.now() * 0.02) * 0.05;

            ctx.save();
            ctx.translate(cx + p.x, cy + p.y);
            ctx.scale(p.squash, 1 / p.squash);

            // Active Shield Bubble
            if (activeShieldRef.current) {
                ctx.save();
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 16;
                ctx.beginPath();
                ctx.arc(0, 0, 58, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
                ctx.fill();
                ctx.restore();
            }

            // Slipstream Gold Aura
            if (activeBuffRef.current?.type === 'slipstream') {
                ctx.save();
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 22;
                ctx.beginPath();
                ctx.arc(0, 0, 64, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            drawCanvasAura(ctx, 0, 0, 48, selectedFace, performance.now() * 0.05);

            const img = faceImgs.current[selectedFace];
            const size = 100;

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'white';
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            } else {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        ctx.restore(); // Undo screen shake

        // HUD - Distance & Biome Name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentBiome.name, cx, 40);
        ctx.font = '13px monospace';
        ctx.fillText(`DISTANCE: ${Math.floor(scoreRef.current)}m`, cx, 64);

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleCrash = () => {
        const finalScore = Math.floor(scoreRef.current);
        if (awardArcadeXP) awardArcadeXP('face_runner', finalScore);

        if (updateStat) updateStat('gamesPlayed', 'face_runner');
        if (addCoins) addCoins(Math.floor(finalScore / 10));

        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('faceRunnerHighScore', finalScore);

            const playerName = userProfile?.name || 'Runner';
            feedService.publish(`reached ${finalScore}m in Face Runner!`, 'win', playerName);
        }

        const elapsed = performance.now() - (runStartTimeRef.current || performance.now());
        runKeyframesRef.current.push({
            t: Math.round(elapsed),
            x: Math.round(playerRef.current.x),
            y: Math.round(playerRef.current.y),
            score: finalScore
        });

        const runData = {
            gameId: 'face_runner',
            playerName: userProfile?.name || 'Runner',
            skinId: selectedFace || 'face_default',
            finalScore: finalScore,
            keyframes: runKeyframesRef.current
        };
        setLastFinishedRun(runData);
        savePersonalBestGhost('face_runner', runData);

        if (activeGhost) {
            const won = finalScore > (activeGhost.finalScore || 0);
            setDuelWon(won);
            if (won && addCoins) {
                addCoins(250);
            }
        }

        setGameState('GAME_OVER');
        playingRef.current = false;
        playCrash?.();

        setCanRestart(false);
        setTimeout(() => setCanRestart(true), 1200);
    };

    const handleInput = (clientX, clientY) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        let x = (clientX - rect.left) * scaleX - (CANVAS_WIDTH / 2);
        let y = (clientY - rect.top) * scaleY - (CANVAS_HEIGHT / 2);

        x = Math.max(-CANVAS_WIDTH / 2 + 50, Math.min(CANVAS_WIDTH / 2 - 50, x));
        y = Math.max(-CANVAS_HEIGHT / 2 + 50, Math.min(CANVAS_HEIGHT / 2 - 50, y));

        playerRef.current.x = x;
        playerRef.current.y = y;
    };

    return (
        <div className="page-enter" style={{
            position: 'fixed', inset: 0,
            background: 'black',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            touchAction: 'none'
        }}>
            {/* GHOST DUEL LIVE TELEMETRY HUD */}
            {activeGhost && gameState === 'PLAYING' && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}>
                    <GhostDuelHUD
                        ghost={activeGhost}
                        currentScore={Math.floor(score)}
                        ghostCurrentScore={ghostPos ? ghostPos.score : 0}
                        isGhostFinished={ghostPos?.isFinished}
                        unit="m"
                    />
                </div>
            )}

            {/* BOSS HP BAR OVERLAY */}
            {bossDisplay && gameState === 'PLAYING' && (
                <div style={{
                    position: 'absolute',
                    top: '75px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%', maxWidth: '420px',
                    zIndex: 9999,
                    padding: '8px 16px',
                    background: 'rgba(255, 0, 85, 0.2)',
                    border: '1.5px solid #ff0055',
                    borderRadius: '12px',
                    fontFamily: '"Orbitron", monospace',
                    boxShadow: '0 0 16px rgba(255, 0, 85, 0.4)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#ff3366', fontWeight: '900', marginBottom: '4px' }}>
                        <span>⚠️ {bossDisplay.name}</span>
                        <span>{bossDisplay.hp} / {bossDisplay.maxHp} HP</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${(bossDisplay.hp / bossDisplay.maxHp) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #ff0055, #ffd700)',
                            transition: 'width 0.2s ease-out'
                        }}></div>
                    </div>
                </div>
            )}

            {/* ACTIVE BUFF / SHIELD PILL */}
            {(activeBuff || activeShield) && gameState === 'PLAYING' && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    zIndex: 9999,
                    padding: '6px 16px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    borderRadius: '20px',
                    fontFamily: '"Orbitron", monospace',
                    fontSize: '0.75rem',
                    color: '#00f0ff',
                    boxShadow: '0 0 14px rgba(0, 240, 255, 0.25)',
                    pointerEvents: 'none'
                }}>
                    {activeShield && <span style={{ color: '#38bdf8' }}>🛡️ HYPER-SHIELD ARMED</span>}
                    {activeBuff && (
                        <span style={{ color: '#ffd700' }}>
                            ⚡ {activeBuff.label}: {activeBuff.timeLeft}s
                        </span>
                    )}
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseMove={(e) => handleInput(e.clientX, e.clientY)}
                onTouchMove={(e) => {
                    e.preventDefault();
                    handleInput(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchStart={(e) => {
                    handleInput(e.touches[0].clientX, e.touches[0].clientY);
                }}
                style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    maxWidth: '800px', maxHeight: '600px',
                    border: `4px solid ${BIOMES[Math.floor(Math.floor(score) / 2500) % BIOMES.length]?.obs[0] || 'white'}`
                }}
            />

            {gameState === 'START' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.92)', padding: '36px', borderRadius: '20px', border: '2px solid cyan', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '440px' }}>
                    <h1 style={{ color: 'cyan', fontSize: '2.6rem', margin: 0, fontFamily: '"Orbitron"' }}>FACE WARP</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '14px', fontFamily: 'monospace', fontSize: '0.85rem' }}>Dodge the Void. Blast the Titans.</p>

                    {activeGhost && (
                        <div style={{
                            background: 'rgba(0, 240, 255, 0.12)',
                            border: '1px solid #00f0ff',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            marginBottom: '16px',
                            fontSize: '0.75rem',
                            color: '#00f0ff',
                            fontFamily: '"Orbitron", monospace',
                            boxShadow: '0 0 14px rgba(0, 240, 255, 0.3)'
                        }}>
                            👻 DUEL CHALLENGE: Beat <strong>{activeGhost.playerName}</strong> ({activeGhost.finalScore}m)!
                        </div>
                    )}
                    
                    {/* SKIN SELECTOR */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap', justifyContent: 'center', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                        {SKINS.map(skin => {
                            const { aura, tier } = getSkinAura(skin);
                            const isSelected = selectedFace === skin.id;
                            const tierColor = tier === 'MYTHIC' ? '#ff0055' : (tier === 'LEGENDARY' ? '#ffd700' : '#a855f7');
                            return (
                                <button 
                                    key={skin.id}
                                    onClick={() => setSelectedFace(skin.id)}
                                    style={{
                                        position: 'relative',
                                        background: isSelected ? `radial-gradient(circle, ${aura.glowColor} 0%, #111 80%)` : '#18181b',
                                        border: isSelected ? `2px solid ${aura.primaryColor}` : '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: isSelected ? `0 0 12px ${aura.glowColor}` : 'none',
                                        borderRadius: '10px',
                                        padding: '5px 4px',
                                        cursor: 'pointer',
                                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute', top: '2px', right: '2px',
                                        background: tierColor, color: '#000', fontSize: '0.45rem', fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace', padding: '1px 3px', borderRadius: '3px'
                                    }}>
                                        {tier === 'MYTHIC' ? '★' : tier[0]}
                                    </span>
                                    <img src={skin.src} alt={skin.name} style={{ width: '34px', height: '34px', objectFit: 'contain', filter: `drop-shadow(0 0 4px ${aura.primaryColor}88)` }} />
                                    <div style={{ fontSize: '0.48rem', fontWeight: 'bold', color: aura.primaryColor, textTransform: 'uppercase' }}>
                                        {aura.name.split(' ')[0]}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <SquishyButton onClick={startGame} style={{ background: 'cyan', color: 'black', fontSize: '1.4rem', padding: '14px 45px', fontWeight: '900', fontFamily: '"Orbitron", monospace' }}>RUN</SquishyButton>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.88)', padding: '36px', borderRadius: '20px', border: '2px solid red', maxWidth: '420px' }}>
                    <h1 style={{ color: 'red', fontSize: '2.8rem', margin: 0, fontFamily: '"Orbitron"' }}>CRASHED!</h1>
                    <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0' }}>{Math.floor(score)}m</p>
                    <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '0.9rem', fontFamily: 'monospace' }}>BEST: {highScore}m</p>
                    
                    {/* DUEL RESULTS BANNER */}
                    {activeGhost && (
                        <div style={{
                            background: duelWon ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 0, 85, 0.15)',
                            border: `1.5px solid ${duelWon ? '#00ff88' : '#ff0055'}`,
                            borderRadius: '12px',
                            padding: '8px 16px',
                            marginBottom: '14px',
                            textAlign: 'center',
                            fontFamily: '"Orbitron", sans-serif',
                            boxShadow: `0 0 16px ${duelWon ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,85,0.3)'}`
                        }}>
                            <div style={{ fontSize: '0.78rem', color: duelWon ? '#00ff88' : '#ff3366', fontWeight: '900' }}>
                                {duelWon ? '🏆 DUEL VICTORY (+250 CP)' : '💀 DUEL DEFEATED'}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                                Rival: {activeGhost.playerName} ({activeGhost.finalScore}m) | You: {Math.floor(score)}m
                            </div>
                        </div>
                    )}

                    {/* 1-TAP CHALLENGE A BRO BUTTON */}
                    <button
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        style={{
                            marginBottom: '14px',
                            padding: '10px 22px',
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
                            border: '1.5px solid #00f0ff',
                            borderRadius: '10px',
                            color: '#00f0ff',
                            fontWeight: '900',
                            fontFamily: '"Orbitron", monospace',
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span>⚡ CHALLENGE A BRO (COPY DUEL)</span>
                    </button>

                    <ShareDuelModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        gamePath="/arcade/face-runner"
                        ghostData={lastFinishedRun}
                        unit="m"
                    />

                    <SquishyButton
                        onClick={() => canRestart && startGame()}
                        style={{
                            background: canRestart ? 'white' : '#555',
                            color: canRestart ? 'black' : '#888',
                            fontSize: '1.3rem',
                            padding: '12px 36px',
                            cursor: canRestart ? 'pointer' : 'wait',
                            fontFamily: '"Orbitron", monospace',
                            fontWeight: 'bold'
                        }}
                    >
                        {canRestart ? 'AGAIN' : 'WAIT...'}
                    </SquishyButton>
                </div>
            )}

            {/* EXIT BUTTON */}
            <Link to="/arcade" style={{
                position: 'absolute', top: '20px', left: '20px', zIndex: 9999,
                textDecoration: 'none'
            }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.85)', color: '#fff',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    padding: '8px 18px', borderRadius: '30px',
                    fontWeight: 'bold', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 240, 255, 0.25)',
                    boxSizing: 'border-box',
                    fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'monospace'
                }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>EXIT</span>
                </div>
            </Link>
        </div>
    );
};

export default FaceRunner;
