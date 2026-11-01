import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import RewardedSponsorModal from '../../components/RewardedSponsorModal';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed';
import { GhostDuelHUD } from '../../components/GhostDuelHUD';
import { ShareDuelModal } from '../../components/ShareDuelModal';
import { getGhostDuelFromUrl, interpolateGhostPosition, savePersonalBestGhost } from '../../utils/ghostDuelCodec';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -7.2;
const BASE_PIPE_SPEED = 3;
const PIPE_SPACING = 250;
const BIRD_SIZE = 40;

const CHARACTERS = [
    { id: 'flappy_boy', type: 'image', content: '/assets/skins/face_default.png', name: 'Classic' },
    { id: 'flappy_face_bear', type: 'image', content: '/assets/skins/face_bear.png', name: 'Bear' },
    { id: 'flappy_face_bunny', type: 'image', content: '/assets/skins/face_bunny.png', name: 'Bunny' },
    { id: 'flappy_cat', type: 'image', content: '/assets/skins/face_cat.png', name: 'Kitty' },
    { id: 'flappy_frog', type: 'image', content: '/assets/skins/face_frog.png', name: 'Froggo' },
    { id: 'flappy_rainbow', type: 'image', content: '/assets/skins/face_rainbow.png', name: 'Pride' },
    { id: 'flappy_alien', type: 'image', content: '/assets/skins/face_astro.png', name: 'Paul' },
    { id: 'flappy_brokid', type: 'image', content: '/assets/brokid-logo.png', name: 'BroKid' },
    { id: 'flappy_monster', type: 'image', content: '/assets/skins/face_dino.png', name: '8-Bit' },
    { id: 'flappy_diamond', type: 'image', content: '/assets/skins/face_star.png', name: 'Richie' },
    { id: 'flappy_cowboy', type: 'image', content: '/assets/skins/face_pumpkin.png', name: 'Sheriff' },
    { id: 'flappy_robot', type: 'image', content: '/assets/skins/face_gamer.png', name: 'BeepBoop' },
    { id: 'flappy_ghost', type: 'image', content: '/assets/skins/face_space.png', name: 'Spooky' },
];

// Procedural Skyline Silhouettes
const SKYLINE_BUILDINGS = [
    { w: 42, h: 140 }, { w: 28, h: 210 }, { w: 52, h: 120 }, { w: 38, h: 175 },
    { w: 48, h: 230 }, { w: 32, h: 145 }, { w: 56, h: 190 }, { w: 44, h: 160 },
    { w: 48, h: 200 }, { w: 30, h: 135 }, { w: 54, h: 220 }, { w: 40, h: 170 }
];
const SKYLINE_TOTAL_WIDTH = SKYLINE_BUILDINGS.reduce((sum, b) => sum + b.w, 0);

const FlappyMascot = () => {
    const canvasRef = useRef(null);
    const { shopState, updateStat, incrementStat, equipItem, addCoins, userProfile, stats, coins, consumeItem } = useGamification() || {};
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('flappyHighScore')) || 0);
    const [gameOver, setGameOver] = useState(false);
    const [hasRevived, setHasRevived] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [scoreScale, setScoreScale] = useState(1);

    // --- EPIC SECTORS, POWER-UPS & BOSS ENCOUNTERS ---
    const [currentSector, setCurrentSector] = useState(1); // 1: Neon Skyline, 2: Acid Runway, 3: Orbital Singularity
    const [activeShield, setActiveShield] = useState(false);
    const [activePowerUp, setActivePowerUp] = useState(null); // { type, label, timeLeft }
    const [bossDisplay, setBossDisplay] = useState(null); // { name, hp, maxHp }

    const activeShieldRef = useRef(false);
    const activePowerUpRef = useRef(null); // { type, label, expiresAt }
    const powerUpsRef = useRef([]); // [{ id, type, x, y, size }]
    const lasersRef = useRef([]); // [{ x, y, vx }]
    const torpedoesRef = useRef([]); // [{ id, x, y, size }]
    const missilesRef = useRef([]); // [{ x, y, vx, vy, targetX, targetY }]
    const lastLaserShootRef = useRef(0);
    const currentSectorRef = useRef(1);

    const bossRef = useRef({
        active: false,
        name: 'MECHA-PHOENIX MK-1',
        hp: 6,
        maxHp: 6,
        x: GAME_WIDTH + 80,
        y: 260,
        vy: 2.2,
        attackTimer: 0,
        hitFlash: 0,
        bullets: [],
        defeated: false,
        stage: 1
    });

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

    // Sync high score
    useEffect(() => {
        if (stats?.flappyHighScore > highScore) {
            setHighScore(stats.flappyHighScore);
        }
    }, [stats]);

    const selectedId = shopState?.equipped?.flappy || 'flappy_boy';
    const gameActiveRef = useRef(false);

    const { playJump, playCrash, playCollect, playWin, playBeep, playShoot, playLaser, playPowerUp, playFanfare, playExplosion, playHit } = useRetroSound();

    const birdImgRef = useRef(null);
    const brokidImgRef = useRef(null);
    const moneyImgRef = useRef(null);
    const bearImgRef = useRef(null);
    const bunnyImgRef = useRef(null);

    // Game Physics & Particle Juice State
    const gameState = useRef({
        birdY: GAME_HEIGHT / 2,
        velocity: 0,
        pipes: [],
        particles: [],
        floatingTexts: [],
        shake: 0,
        slowMoFrames: 0,
        skylineOffset: 0,
        gridOffset: 0,
        stars: [],
        lastTime: 0,
        animationId: null
    });

    useEffect(() => {
        const img1 = new Image(); img1.src = '/assets/merchboy_face.png'; birdImgRef.current = img1;
        const img2 = new Image(); img2.src = '/assets/brokid-logo.png'; brokidImgRef.current = img2;
        const img3 = new Image(); img3.src = '/assets/skins/face_money.png'; moneyImgRef.current = img3;
        const img4 = new Image(); img4.src = '/assets/skins/face_bear.png'; bearImgRef.current = img4;
        const img5 = new Image(); img5.src = '/assets/skins/face_bunny.png'; bunnyImgRef.current = img5;

        // Initialize background starfield for orbital sector
        const stars = [];
        for (let i = 0; i < 45; i++) {
            stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                speed: 0.5 + Math.random() * 1.5,
                size: 1 + Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        gameState.current.stars = stars;
    }, []);

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameActive(true);
        setHasRevived(false);
        gameActiveRef.current = true;

        // Reset Ghost Duel telemetry
        runStartTimeRef.current = performance.now();
        runKeyframesRef.current = [];
        lastSampleTimeRef.current = 0;
        setGhostPos(null);
        setDuelWon(null);

        // Reset Epic Sectors, Power-Ups & Bosses
        currentSectorRef.current = 1;
        setCurrentSector(1);
        activeShieldRef.current = false;
        setActiveShield(false);
        activePowerUpRef.current = null;
        setActivePowerUp(null);
        setBossDisplay(null);
        powerUpsRef.current = [];
        lasersRef.current = [];
        torpedoesRef.current = [];
        missilesRef.current = [];
        lastLaserShootRef.current = 0;
        bossRef.current = {
            active: false,
            name: 'MECHA-PHOENIX MK-1',
            hp: 6,
            maxHp: 6,
            x: GAME_WIDTH + 80,
            y: 260,
            vy: 2.2,
            attackTimer: 0,
            hitFlash: 0,
            bullets: [],
            defeated: false,
            stage: 1
        };

        gameState.current = {
            birdY: GAME_HEIGHT / 2,
            velocity: 0,
            pipes: [{ x: GAME_WIDTH + 60, topHeight: 180, nearMissTriggered: false, passed: false }],
            particles: [],
            floatingTexts: [],
            shake: 0,
            slowMoFrames: 0,
            skylineOffset: 0,
            gridOffset: 0,
            stars: gameState.current.stars || [],
            lastTime: 0,
            animationId: null
        };
        requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
        setGameActive(false);
        gameActiveRef.current = false;
        setGameOver(true);
        cancelAnimationFrame(gameState.current.animationId);
        playCrash?.();

        // Sample final telemetry point and build ghost record
        const elapsed = performance.now() - (runStartTimeRef.current || performance.now());
        runKeyframesRef.current.push({
            t: Math.round(elapsed),
            x: 50,
            y: Math.round(gameState.current.birdY),
            score: score
        });

        const skinName = selectedId?.replace('flappy_', '') || 'face_default';
        const runData = {
            gameId: 'flappy_mascot',
            playerName: userProfile?.name || 'Bro',
            skinId: skinName.startsWith('face_') ? skinName : 'face_default',
            finalScore: score,
            keyframes: runKeyframesRef.current
        };
        setLastFinishedRun(runData);
        savePersonalBestGhost('flappy_mascot', runData);

        if (activeGhost) {
            const won = score > (activeGhost.finalScore || 0);
            setDuelWon(won);
            if (won && addCoins) {
                addCoins(250);
            }
        }

        // Screen shake + haptics on death
        gameState.current.shake = 22;
        if (navigator.vibrate) navigator.vibrate([50, 40, 90]);

        // Spawn death spark burst
        const birdX = 50 + BIRD_SIZE / 2;
        const birdY = gameState.current.birdY + BIRD_SIZE / 2;
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            gameState.current.particles.push({
                x: birdX,
                y: birdY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 4,
                color: ['#ff0055', '#00f0ff', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
                alpha: 1,
                decay: 0.03
            });
        }

        if (score > highScore) {
            setHighScore(score);
            if (updateStat) updateStat('flappyHighScore', score);
            triggerConfetti();

            if (score > 10) {
                const playerName = userProfile?.name || 'Player';
                feedService.publish(`is flying high! Score: ${score} in FlappyBro!`, 'win', playerName);
            }
        }

        if (addCoins) addCoins(Math.floor(score));

        if (updateStat) {
            updateStat('gamesPlayed', 'flappy_mascot');
        }
    };

    const gameLoop = (timestamp) => {
        if (!gameActiveRef.current) return;

        const state = gameState.current;
        if (timestamp) {
            if (!state.lastTime) state.lastTime = timestamp;
            const delta = timestamp - state.lastTime;
            if (delta < 16) {
                state.animationId = requestAnimationFrame(gameLoop);
                return;
            }
            state.lastTime = timestamp - (delta % 16);
        }

        const ctx = canvasRef.current.getContext('2d');
        const now = performance.now();

        // Check active power-ups expiration
        if (activePowerUpRef.current) {
            const remaining = Math.max(0, Math.ceil((activePowerUpRef.current.expiresAt - now) / 1000));
            if (remaining <= 0) {
                activePowerUpRef.current = null;
                setActivePowerUp(null);
            } else {
                setActivePowerUp(prev => prev ? { ...prev, timeLeft: remaining } : null);
            }
        }

        // Apply Slow-Mo / Chrono Time Dilation
        let speedMultiplier = 1.0;
        if (state.slowMoFrames > 0) {
            speedMultiplier = 0.45;
            state.slowMoFrames--;
        } else if (activePowerUpRef.current?.type === 'chrono') {
            speedMultiplier = 0.55;
        }

        const currentPipeSpeed = BASE_PIPE_SPEED * speedMultiplier;

        // Sector Progression by Score
        if (score >= 30 && currentSectorRef.current < 3) {
            currentSectorRef.current = 3;
            setCurrentSector(3);
            playFanfare?.();
            state.floatingTexts.push({
                text: 'SECTOR 3: ORBITAL SINGULARITY',
                x: 35, y: 160, life: 60, maxLife: 60, color: '#a855f7', size: 14
            });
        } else if (score >= 15 && currentSectorRef.current < 2) {
            currentSectorRef.current = 2;
            setCurrentSector(2);
            playFanfare?.();
            state.floatingTexts.push({
                text: 'SECTOR 2: ACID RUNWAY',
                x: 60, y: 160, life: 60, maxLife: 60, color: '#39ff14', size: 14
            });
        }

        // --- 1. SCREEN SHAKE MATRIX ---
        ctx.save();
        if (state.shake > 0) {
            const shakeX = (Math.random() - 0.5) * state.shake;
            const shakeY = (Math.random() - 0.5) * state.shake;
            ctx.translate(shakeX, shakeY);
            state.shake *= 0.88;
            if (state.shake < 0.5) state.shake = 0;
        }

        // --- 2. SECTOR-ADAPTIVE PROCEDURAL BACKGROUND ---
        const sector = currentSectorRef.current;
        if (sector === 1) {
            // Sector 1: Neon Skyline
            const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
            bgGrad.addColorStop(0, '#080314');
            bgGrad.addColorStop(0.45, '#1e0c2f');
            bgGrad.addColorStop(0.72, '#50143c');
            bgGrad.addColorStop(0.92, '#ff3366');
            bgGrad.addColorStop(1, '#ff9900');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Synthwave Sun on the Horizon
            const sunX = GAME_WIDTH / 2;
            const sunY = GAME_HEIGHT * 0.72;
            const sunRad = 68;
            const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRad);
            sunGrad.addColorStop(0, '#fff685');
            sunGrad.addColorStop(0.6, '#ff007f');
            sunGrad.addColorStop(1, 'rgba(255, 0, 127, 0)');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunRad, 0, Math.PI * 2);
            ctx.fill();

            // Horizontal Horizon Raster Bands
            ctx.fillStyle = '#1e0c2f';
            for (let bandY = sunY - 15; bandY < sunY + sunRad; bandY += 10) {
                const thickness = Math.min(5, (bandY - (sunY - 20)) * 0.12 + 1);
                ctx.fillRect(sunX - sunRad, bandY, sunRad * 2, thickness);
            }

            // Parallax Distant Skyline Silhouettes
            state.skylineOffset = (state.skylineOffset + currentPipeSpeed * 0.35) % SKYLINE_TOTAL_WIDTH;
            ctx.fillStyle = 'rgba(18, 8, 30, 0.92)';
            let currX = -state.skylineOffset;
            while (currX < GAME_WIDTH + 60) {
                for (let i = 0; i < SKYLINE_BUILDINGS.length; i++) {
                    const b = SKYLINE_BUILDINGS[i];
                    const bY = GAME_HEIGHT - 35 - b.h;
                    ctx.fillRect(currX, bY, b.w, b.h);

                    ctx.fillStyle = (i % 3 === 0) ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 0, 127, 0.5)';
                    for (let wy = bY + 12; wy < bY + b.h - 15; wy += 22) {
                        if (wy % 2 === 0) {
                            ctx.fillRect(currX + 8, wy, 4, 6);
                            ctx.fillRect(currX + b.w - 12, wy, 4, 6);
                        }
                    }
                    ctx.fillStyle = 'rgba(18, 8, 30, 0.92)';
                    currX += b.w;
                }
            }
        } else if (sector === 2) {
            // Sector 2: Acid Runway
            const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
            bgGrad.addColorStop(0, '#020b04');
            bgGrad.addColorStop(0.5, '#091f0c');
            bgGrad.addColorStop(0.85, '#123812');
            bgGrad.addColorStop(1, '#2dfc52');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Radioactive fog atmosphere
            ctx.fillStyle = 'rgba(45, 252, 82, 0.08)';
            ctx.beginPath();
            ctx.ellipse(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, 180, 70, 0, 0, Math.PI * 2);
            ctx.fill();

            // Industrial smokestack silhouettes
            state.skylineOffset = (state.skylineOffset + currentPipeSpeed * 0.3) % SKYLINE_TOTAL_WIDTH;
            ctx.fillStyle = 'rgba(6, 16, 8, 0.95)';
            let currX = -state.skylineOffset;
            while (currX < GAME_WIDTH + 60) {
                for (let i = 0; i < SKYLINE_BUILDINGS.length; i++) {
                    const b = SKYLINE_BUILDINGS[i];
                    const bY = GAME_HEIGHT - 35 - b.h;
                    ctx.fillRect(currX, bY, b.w, b.h);
                    ctx.fillStyle = 'rgba(57, 255, 20, 0.4)';
                    ctx.fillRect(currX + b.w / 2 - 2, bY + 8, 4, b.h - 16);
                    ctx.fillStyle = 'rgba(6, 16, 8, 0.95)';
                    currX += b.w;
                }
            }
        } else {
            // Sector 3: Orbital Singularity
            const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
            bgGrad.addColorStop(0, '#020008');
            bgGrad.addColorStop(0.5, '#0b041a');
            bgGrad.addColorStop(0.85, '#1e0b38');
            bgGrad.addColorStop(1, '#4a154b');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Twinkling Starfield
            ctx.fillStyle = '#ffffff';
            (state.stars || []).forEach(star => {
                star.x = (star.x - star.speed * currentPipeSpeed * 0.4 + GAME_WIDTH) % GAME_WIDTH;
                star.twinkle += 0.05;
                const alpha = 0.4 + Math.sin(star.twinkle) * 0.5;
                ctx.save();
                ctx.globalAlpha = Math.max(0.1, alpha);
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Swirling Singularity Core on horizon
            const singX = GAME_WIDTH / 2;
            const singY = GAME_HEIGHT * 0.5;
            const singGrad = ctx.createRadialGradient(singX, singY, 15, singX, singY, 120);
            singGrad.addColorStop(0, '#000000');
            singGrad.addColorStop(0.3, '#7928ca');
            singGrad.addColorStop(0.7, '#00f0ff');
            singGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = singGrad;
            ctx.beginPath();
            ctx.arc(singX, singY, 120, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- 3. SCROLLING NEON GRID FLOOR ---
        state.gridOffset = (state.gridOffset + currentPipeSpeed) % 40;
        const floorY = GAME_HEIGHT - 35;
        const floorColor = sector === 2 ? '#041206' : (sector === 3 ? '#060212' : '#0a0512');
        const gridColor = sector === 2 ? '#39ff14' : (sector === 3 ? '#a855f7' : '#00f0ff');

        ctx.fillStyle = floorColor;
        ctx.fillRect(0, floorY, GAME_WIDTH, 35);

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = gridColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(GAME_WIDTH, floorY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = gridColor + '55';
        ctx.lineWidth = 1.5;
        for (let gx = -state.gridOffset; gx < GAME_WIDTH + 40; gx += 40) {
            ctx.beginPath();
            ctx.moveTo(gx, floorY);
            ctx.lineTo(gx - 20, GAME_HEIGHT);
            ctx.stroke();
        }

        // --- 4. UPDATE BIRD PHYSICS & HITBOX ---
        state.velocity += GRAVITY * speedMultiplier;
        state.birdY += state.velocity * speedMultiplier;

        // Floor / Ceiling Boundary Check
        if (state.birdY > floorY - BIRD_SIZE || state.birdY < 0) {
            endGame();
            ctx.restore();
            return;
        }

        // --- BOSS TRIGGER LOGIC ---
        const boss = bossRef.current;
        if (!boss.active && !boss.defeated) {
            if (score >= 15 && boss.stage === 1) {
                // Summon Boss 1: Mecha-Phoenix MK-1
                boss.active = true;
                boss.name = 'MECHA-PHOENIX MK-1';
                boss.hp = 6;
                boss.maxHp = 6;
                boss.x = GAME_WIDTH + 70;
                boss.y = 250;
                boss.bullets = [];
                setBossDisplay({ name: boss.name, hp: 6, maxHp: 6 });
                playLaser?.();
                state.floatingTexts.push({
                    text: '🚨 WARNING: MECHA-PHOENIX MK-1! 🚨',
                    x: 30, y: 180, life: 75, maxLife: 75, color: '#ff0055', size: 14
                });
            } else if (score >= 30 && boss.stage === 2) {
                // Summon Boss 2: Cyber Dreadnought
                boss.active = true;
                boss.name = 'CYBER DREADNOUGHT';
                boss.hp = 10;
                boss.maxHp = 10;
                boss.x = GAME_WIDTH + 80;
                boss.y = 240;
                boss.bullets = [];
                setBossDisplay({ name: boss.name, hp: 10, maxHp: 10 });
                playLaser?.();
                state.floatingTexts.push({
                    text: '🚨 WARNING: CYBER DREADNOUGHT! 🚨',
                    x: 30, y: 180, life: 75, maxLife: 75, color: '#00f0ff', size: 14
                });
            }
        }

        // --- 5. PIPES UPDATE & DRAW (Pause pipes while Boss is active) ---
        if (!boss.active) {
            state.pipes.forEach(pipe => {
                pipe.x -= currentPipeSpeed;
            });

            // Add New Pipe
            if (state.pipes.length === 0 || state.pipes[state.pipes.length - 1].x < GAME_WIDTH - PIPE_SPACING) {
                const minHeight = 60;
                const maxHeight = GAME_HEIGHT - 240 - minHeight;
                const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                state.pipes.push({ x: GAME_WIDTH, topHeight: height, nearMissTriggered: false, passed: false });

                // 45% chance to spawn floating power-up inside gap
                if (Math.random() < 0.45) {
                    const pTypes = ['shield', 'lasers', 'chrono', 'magnet'];
                    const chosen = pTypes[Math.floor(Math.random() * pTypes.length)];
                    powerUpsRef.current.push({
                        id: Math.random(),
                        type: chosen,
                        x: GAME_WIDTH + 32,
                        y: height + 105,
                        size: 26,
                        pulse: 0
                    });
                }
            }

            // Remove off-screen pipes
            if (state.pipes[0]?.x < -70) {
                state.pipes.shift();
            }
        } else {
            // Push existing pipes off-screen during boss
            state.pipes.forEach(pipe => {
                pipe.x -= currentPipeSpeed * 1.5;
            });
            if (state.pipes[0]?.x < -70) {
                state.pipes.shift();
            }
        }

        const birdX = 50;
        const birdY = state.birdY;

        // Pipe Drawing & Collision Detection
        state.pipes.forEach(pipe => {
            const pipeW = 64;
            const bottomY = pipe.topHeight + 215; // 215px arcade gap
            const isNearX = (birdX + BIRD_SIZE > pipe.x) && (birdX < pipe.x + pipeW);

            // Passing & Score increment
            if (!pipe.passed && birdX > pipe.x + pipeW) {
                pipe.passed = true;
                setScore(prev => prev + 1);
                playCollect?.();
                setScoreScale(1.3);
                setTimeout(() => setScoreScale(1), 180);

                // Spawn score sparkle fountain
                for (let i = 0; i < 8; i++) {
                    state.particles.push({
                        x: birdX + BIRD_SIZE / 2,
                        y: birdY,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -2 - Math.random() * 3,
                        size: 3 + Math.random() * 3,
                        color: '#ffd700',
                        alpha: 1,
                        decay: 0.04
                    });
                }
            }

            // Near-Miss Bullet Time Detection
            if (isNearX && !pipe.nearMissTriggered) {
                const distTop = birdY - pipe.topHeight;
                const distBottom = bottomY - (birdY + BIRD_SIZE);

                if ((distTop > 0 && distTop < 18) || (distBottom > 0 && distBottom < 18)) {
                    pipe.nearMissTriggered = true;
                    state.slowMoFrames = 12;
                    state.floatingTexts.push({
                        text: 'CLOSE SHAVE! +100 CP',
                        x: birdX - 30,
                        y: birdY - 32,
                        life: 38,
                        maxLife: 38,
                        color: '#ffd700',
                        size: 13
                    });
                    if (addCoins) addCoins(100);
                    playBeep?.();
                    if (navigator.vibrate) navigator.vibrate(35);
                }
            }

            // Hitbox Collision with Shield Deflection
            if (isNearX) {
                if (birdY < pipe.topHeight || birdY + BIRD_SIZE > bottomY) {
                    if (activeShieldRef.current) {
                        // Shield absorbs fatal impact!
                        activeShieldRef.current = false;
                        setActiveShield(false);
                        state.shake = 18;
                        playCrash?.();
                        if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
                        state.floatingTexts.push({
                            text: '🛡️ SHIELD DEFLECTED IMPACT!',
                            x: birdX - 40,
                            y: birdY - 30,
                            life: 45,
                            maxLife: 45,
                            color: '#00f0ff',
                            size: 13
                        });
                        pipe.topHeight = Math.max(10, pipe.topHeight - 65);
                    } else {
                        endGame();
                    }
                }
            }

            // --- DRAW CYBER PILLARS ---
            const topColor1 = sector === 2 ? '#07240c' : (sector === 3 ? '#160829' : '#0c1b26');
            const topColor2 = sector === 2 ? '#39ff14' : (sector === 3 ? '#a855f7' : '#00f0ff');
            const botColor2 = sector === 2 ? '#ffff00' : (sector === 3 ? '#00f0ff' : '#ff007f');

            // Top Pipe Body
            const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
            topGrad.addColorStop(0, topColor1);
            topGrad.addColorStop(0.4, topColor2);
            topGrad.addColorStop(1, topColor1);
            ctx.fillStyle = topGrad;
            ctx.fillRect(pipe.x, 0, pipeW, pipe.topHeight);

            ctx.strokeStyle = topColor2;
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, 0, pipeW, pipe.topHeight);

            // Top Pipe Cap Emitter
            ctx.fillStyle = topColor2;
            ctx.shadowColor = topColor2;
            ctx.shadowBlur = 12;
            ctx.fillRect(pipe.x - 4, pipe.topHeight - 22, pipeW + 8, 22);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x - 4, pipe.topHeight - 22, pipeW + 8, 22);

            // Bottom Pipe Body
            const bottomGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeW, 0);
            bottomGrad.addColorStop(0, topColor1);
            bottomGrad.addColorStop(0.4, botColor2);
            bottomGrad.addColorStop(1, topColor1);
            ctx.fillStyle = bottomGrad;
            ctx.fillRect(pipe.x, bottomY, pipeW, floorY - bottomY);

            ctx.strokeStyle = botColor2;
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, bottomY, pipeW, floorY - bottomY);

            // Bottom Pipe Cap Emitter
            ctx.fillStyle = botColor2;
            ctx.shadowColor = botColor2;
            ctx.shadowBlur = 12;
            ctx.fillRect(pipe.x - 4, bottomY, pipeW + 8, 22);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x - 4, bottomY, pipeW + 8, 22);
        });

        // --- 5B. AUTO-FIRE TWIN LASERS ---
        if (activePowerUpRef.current?.type === 'lasers') {
            if (now - lastLaserShootRef.current > 180) {
                lastLaserShootRef.current = now;
                lasersRef.current.push({ x: birdX + BIRD_SIZE, y: birdY + 10, vx: 14 });
                lasersRef.current.push({ x: birdX + BIRD_SIZE, y: birdY + 30, vx: 14 });
                playShoot?.();
            }
        }

        // Update & Draw Lasers
        for (let li = lasersRef.current.length - 1; li >= 0; li--) {
            const laser = lasersRef.current[li];
            laser.x += laser.vx;

            // Collision with pipes: cracks pipe topHeight
            for (let pi = 0; pi < state.pipes.length; pi++) {
                const pipe = state.pipes[pi];
                const pipeW = 64;
                const bottomY = pipe.topHeight + 215;
                if (laser.x >= pipe.x && laser.x <= pipe.x + pipeW) {
                    if (laser.y < pipe.topHeight || laser.y > bottomY) {
                        // Pipe hit!
                        state.particles.push({
                            x: laser.x, y: laser.y, vx: -2, vy: (Math.random() - 0.5) * 3,
                            size: 4, color: '#00f0ff', alpha: 1, decay: 0.08
                        });
                        lasersRef.current.splice(li, 1);
                        break;
                    }
                }
            }

            // Collision with Boss
            if (boss.active && laser.x >= boss.x - 40 && laser.x <= boss.x + 60 &&
                laser.y >= boss.y - 40 && laser.y <= boss.y + 40) {
                boss.hp = Math.max(0, boss.hp - 1);
                boss.hitFlash = 8;
                playHit?.();
                setBossDisplay({ name: boss.name, hp: boss.hp, maxHp: boss.maxHp });
                state.shake = 8;
                lasersRef.current.splice(li, 1);
                continue;
            }

            if (laser.x > GAME_WIDTH + 30) {
                lasersRef.current.splice(li, 1);
                continue;
            }

            // Draw laser bolt
            ctx.save();
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(laser.x - 14, laser.y);
            ctx.lineTo(laser.x, laser.y);
            ctx.stroke();
            ctx.restore();
        }

        // --- 5C. POWER-UP TOKENS UPDATE & DRAW ---
        for (let pui = powerUpsRef.current.length - 1; pui >= 0; pui--) {
            const pu = powerUpsRef.current[pui];
            pu.x -= currentPipeSpeed;
            pu.pulse += 0.08;

            // Magnet suction effect
            if (activePowerUpRef.current?.type === 'magnet') {
                const dx = (birdX + BIRD_SIZE / 2) - pu.x;
                const dy = (birdY + BIRD_SIZE / 2) - pu.y;
                pu.x += dx * 0.12;
                pu.y += dy * 0.12;
            }

            // Collection Check with mascot
            const dist = Math.hypot((birdX + BIRD_SIZE / 2) - pu.x, (birdY + BIRD_SIZE / 2) - pu.y);
            if (dist < 34) {
                // Collect power-up!
                playPowerUp?.();
                if (navigator.vibrate) navigator.vibrate(30);

                if (pu.type === 'shield') {
                    activeShieldRef.current = true;
                    setActiveShield(true);
                    state.floatingTexts.push({ text: '🛡️ SHIELD EQUIPPED!', x: birdX - 20, y: birdY - 24, life: 40, maxLife: 40, color: '#00f0ff', size: 13 });
                } else if (pu.type === 'lasers') {
                    activePowerUpRef.current = { type: 'lasers', label: 'TWIN BLASTERS', expiresAt: now + 8000 };
                    setActivePowerUp({ type: 'lasers', label: 'TWIN BLASTERS', timeLeft: 8 });
                    state.floatingTexts.push({ text: '⚡ TWIN BLASTERS! (8s)', x: birdX - 25, y: birdY - 24, life: 40, maxLife: 40, color: '#ffd700', size: 13 });
                } else if (pu.type === 'chrono') {
                    activePowerUpRef.current = { type: 'chrono', label: 'CHRONO WARP', expiresAt: now + 6000 };
                    setActivePowerUp({ type: 'chrono', label: 'CHRONO WARP', timeLeft: 6 });
                    state.floatingTexts.push({ text: '⏱️ CHRONO WARP! (6s)', x: birdX - 25, y: birdY - 24, life: 40, maxLife: 40, color: '#38bdf8', size: 13 });
                } else if (pu.type === 'magnet') {
                    activePowerUpRef.current = { type: 'magnet', label: 'CP MAGNET', expiresAt: now + 8000 };
                    setActivePowerUp({ type: 'magnet', label: 'CP MAGNET', timeLeft: 8 });
                    state.floatingTexts.push({ text: '🧲 CP MAGNET! (8s)', x: birdX - 20, y: birdY - 24, life: 40, maxLife: 40, color: '#ec4899', size: 13 });
                }

                // Burst particles
                for (let k = 0; k < 12; k++) {
                    state.particles.push({
                        x: pu.x, y: pu.y,
                        vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                        size: 3 + Math.random() * 3, color: '#00f0ff', alpha: 1, decay: 0.05
                    });
                }
                powerUpsRef.current.splice(pui, 1);
                continue;
            }

            if (pu.x < -40) {
                powerUpsRef.current.splice(pui, 1);
                continue;
            }

            // Draw glowing Power-Up Token
            ctx.save();
            const bobY = pu.y + Math.sin(pu.pulse) * 4;
            ctx.translate(pu.x, bobY);
            ctx.shadowBlur = 12;

            const puColors = { shield: '#00f0ff', lasers: '#ffd700', chrono: '#38bdf8', magnet: '#ec4899' };
            const pColor = puColors[pu.type] || '#00f0ff';
            ctx.shadowColor = pColor;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = pColor;
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner icon
            ctx.fillStyle = pColor;
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const puIcons = { shield: '🛡', lasers: '⚡', chrono: '⏱', magnet: '🧲' };
            ctx.fillText(puIcons[pu.type] || '★', 0, 1);
            ctx.restore();
        }

        // --- 5D. BOSS BATTLE ENGINE & EMP TORPEDOES ---
        if (boss.active) {
            // Smooth boss entry & hovering
            boss.x += (GAME_WIDTH - 85 - boss.x) * 0.05;
            boss.y += boss.vy;
            if (boss.y < 120 || boss.y > GAME_HEIGHT - 160) {
                boss.vy *= -1;
            }

            // Spawn floating EMP Torpedoes for player to counter-attack
            if (torpedoesRef.current.length < 2 && Math.random() < 0.03) {
                torpedoesRef.current.push({
                    id: Math.random(),
                    x: GAME_WIDTH + 20,
                    y: 120 + Math.random() * (GAME_HEIGHT - 260),
                    pulse: 0
                });
            }

            // Boss attack timer: fires plasma flares
            boss.attackTimer++;
            if (boss.attackTimer >= 105) {
                boss.attackTimer = 0;
                playLaser?.();
                const flareVy = (birdY - boss.y) * 0.015;
                boss.bullets.push({
                    x: boss.x - 30, y: boss.y, vx: -4.2, vy: flareVy,
                    size: 8, color: boss.stage === 1 ? '#ff0055' : '#00f0ff'
                });
                if (boss.stage === 2) {
                    boss.bullets.push({
                        x: boss.x - 30, y: boss.y - 25, vx: -3.8, vy: -1.2,
                        size: 7, color: '#a855f7'
                    });
                    boss.bullets.push({
                        x: boss.x - 30, y: boss.y + 25, vx: -3.8, vy: 1.2,
                        size: 7, color: '#a855f7'
                    });
                }
            }

            // Update & Draw Boss Bullets
            for (let bi = boss.bullets.length - 1; bi >= 0; bi--) {
                const b = boss.bullets[bi];
                b.x += b.vx;
                b.y += b.vy;

                // Collision with player
                const bDist = Math.hypot((birdX + BIRD_SIZE / 2) - b.x, (birdY + BIRD_SIZE / 2) - b.y);
                if (bDist < 26) {
                    if (activeShieldRef.current) {
                        activeShieldRef.current = false;
                        setActiveShield(false);
                        state.shake = 16;
                        playCrash?.();
                        state.floatingTexts.push({ text: '🛡️ SHIELD ABSORBED BLAST!', x: birdX - 35, y: birdY - 25, life: 40, maxLife: 40, color: '#00f0ff', size: 13 });
                        boss.bullets.splice(bi, 1);
                        continue;
                    } else {
                        endGame();
                        break;
                    }
                }

                if (b.x < -30) {
                    boss.bullets.splice(bi, 1);
                    continue;
                }

                ctx.save();
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Update & Draw EMP Torpedoes
            for (let ti = torpedoesRef.current.length - 1; ti >= 0; ti--) {
                const torp = torpedoesRef.current[ti];
                torp.x -= 2.2;
                torp.pulse += 0.08;

                // Suction by magnet
                if (activePowerUpRef.current?.type === 'magnet') {
                    torp.x += (birdX - torp.x) * 0.1;
                    torp.y += (birdY - torp.y) * 0.1;
                }

                // Proximity check with bird
                const tDist = Math.hypot((birdX + BIRD_SIZE / 2) - torp.x, (birdY + BIRD_SIZE / 2) - torp.y);
                if (tDist < 34) {
                    // Collect torpedo -> Launch Homing Missile at Boss!
                    playShoot?.();
                    missilesRef.current.push({
                        x: birdX + BIRD_SIZE,
                        y: birdY + BIRD_SIZE / 2,
                        vx: 4,
                        vy: 0
                    });
                    state.floatingTexts.push({ text: '🚀 EMP TORPEDO LAUNCHED!', x: birdX, y: birdY - 20, life: 35, maxLife: 35, color: '#38bdf8', size: 12 });
                    torpedoesRef.current.splice(ti, 1);
                    continue;
                }

                if (torp.x < -30) {
                    torpedoesRef.current.splice(ti, 1);
                    continue;
                }

                // Render floating EMP Torpedo
                ctx.save();
                ctx.translate(torp.x, torp.y + Math.sin(torp.pulse) * 3);
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 10;
                ctx.fillStyle = '#0284c7';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(-12, -7, 24, 14, 5);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('EMP', 0, 1);
                ctx.restore();
            }

            // Update & Draw Homing Missiles
            for (let mi = missilesRef.current.length - 1; mi >= 0; mi--) {
                const m = missilesRef.current[mi];
                const dx = boss.x - m.x;
                const dy = boss.y - m.y;
                const angle = Math.atan2(dy, dx);
                m.vx = Math.cos(angle) * 11;
                m.vy = Math.sin(angle) * 11;
                m.x += m.vx;
                m.y += m.vy;

                // Smoke trail
                state.particles.push({
                    x: m.x, y: m.y,
                    vx: -m.vx * 0.2, vy: (Math.random() - 0.5) * 2,
                    size: 3, color: '#38bdf8', alpha: 0.8, decay: 0.08
                });

                // Hit boss
                if (Math.hypot(dx, dy) < 35) {
                    boss.hp = Math.max(0, boss.hp - 2);
                    boss.hitFlash = 12;
                    playExplosion?.();
                    state.shake = 14;
                    setBossDisplay({ name: boss.name, hp: boss.hp, maxHp: boss.maxHp });
                    missilesRef.current.splice(mi, 1);
                    continue;
                }
            }

            // Draw Boss Entity
            ctx.save();
            ctx.translate(boss.x, boss.y);
            if (boss.hitFlash > 0) {
                boss.hitFlash--;
                ctx.filter = 'brightness(2.2)';
            }

            if (boss.stage === 1) {
                // MECHA-PHOENIX MK-1
                const wingFlap = Math.sin(now * 0.01) * 0.5;

                // Left Wing
                ctx.save();
                ctx.rotate(-wingFlap);
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(-15, -10);
                ctx.lineTo(-45, -35);
                ctx.lineTo(-20, -5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // Right Wing
                ctx.save();
                ctx.rotate(wingFlap);
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(-15, 10);
                ctx.lineTo(-45, 35);
                ctx.lineTo(-20, 5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // Mecha Body Hull
                ctx.fillStyle = '#1e0c2f';
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(-25, -20, 55, 40, 10);
                ctx.fill();
                ctx.stroke();

                // Glowing Eye Visor
                ctx.fillStyle = '#00f0ff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.ellipse(-12, 0, 6, 12, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // CYBER DREADNOUGHT
                ctx.fillStyle = '#0f172a';
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.moveTo(35, 0);
                ctx.lineTo(-25, -35);
                ctx.lineTo(-40, -18);
                ctx.lineTo(-40, 18);
                ctx.lineTo(-25, 35);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Reactor Core
                ctx.fillStyle = '#00f0ff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 18;
                ctx.beginPath();
                ctx.arc(-5, 0, 12, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // BOSS DEFEAT CHECK
            if (boss.hp <= 0) {
                boss.active = false;
                boss.defeated = true;
                setBossDisplay(null);
                state.shake = 26;
                playFanfare?.();
                playExplosion?.();

                const bonusCP = boss.stage === 1 ? 500 : 1000;
                if (addCoins) addCoins(bonusCP);

                state.floatingTexts.push({
                    text: `🏆 ${boss.name} DEFEATED! +${bonusCP} CP!`,
                    x: 25, y: 160, life: 80, maxLife: 80, color: '#ffd700', size: 14
                });

                // Defeat explosion cloud
                for (let k = 0; k < 45; k++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 7;
                    state.particles.push({
                        x: boss.x, y: boss.y,
                        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                        size: 3 + Math.random() * 5,
                        color: ['#ff0055', '#00f0ff', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
                        alpha: 1, decay: 0.025
                    });
                }

                // Advance boss stage
                boss.stage += 1;
            }
        }

        // --- 6. PARTICLES UPDATE & DRAW ---
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const p = state.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                state.particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // --- 7. FLOATING TEXTS ---
        for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
            const ft = state.floatingTexts[i];
            ft.y -= 0.8;
            ft.life--;

            if (ft.life <= 0) {
                state.floatingTexts.splice(i, 1);
                continue;
            }

            const alpha = ft.life / ft.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = `900 ${ft.size || 13}px "Orbitron", monospace`;
            ctx.fillStyle = ft.color || '#ffd700';
            ctx.shadowColor = ft.color || '#ffd700';
            ctx.shadowBlur = 10;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }

        // --- 8. DRAW CHARACTER WITH SQUASH & STRETCH ---
        const charData = CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0];

        ctx.save();
        ctx.translate(birdX + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);

        // --- GHOST DUEL TELEMETRY SAMPLING & RENDERING ---
        const elapsedLoop = now - (runStartTimeRef.current || now);
        if (!lastSampleTimeRef.current || now - lastSampleTimeRef.current >= 150) {
            runKeyframesRef.current.push({
                t: Math.round(elapsedLoop),
                x: 50,
                y: Math.round(birdY),
                score: score
            });
            lastSampleTimeRef.current = now;
        }

        // Render Ghost Rival in Canvas
        if (activeGhost) {
            const gPos = interpolateGhostPosition(activeGhost, elapsedLoop);
            if (gPos) {
                setGhostPos(gPos);
                const ghostBirdX = 42;
                const ghostBirdY = gPos.y;

                ctx.save();
                ctx.globalAlpha = 0.55;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 14;

                if (ghostImgRef.current && ghostImgRef.current.complete) {
                    ctx.drawImage(ghostImgRef.current, ghostBirdX - BIRD_SIZE / 2, ghostBirdY - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
                } else {
                    ctx.fillStyle = '#00f0ff';
                    ctx.beginPath();
                    ctx.arc(ghostBirdX, ghostBirdY, BIRD_SIZE / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Floating Ghost Name Tag
                ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                const tagW = 78;
                ctx.beginPath();
                ctx.roundRect(ghostBirdX - tagW / 2, ghostBirdY - 26, tagW, 16, 6);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#00f0ff';
                ctx.font = 'bold 8px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`👻 ${(activeGhost.playerName || 'Rival').slice(0, 8)}`, ghostBirdX, ghostBirdY - 15);

                ctx.restore();
            }
        }

        // Active Shield Forcefield Bubble Around Bird
        if (activeShieldRef.current) {
            ctx.save();
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(0, 0, BIRD_SIZE / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
            ctx.beginPath();
            ctx.arc(0, 0, BIRD_SIZE / 2 + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Dynamic Squash-and-Stretch on Flap & Dive
        let scaleX = 1.0;
        let scaleY = 1.0;
        if (state.velocity < -2) {
            scaleX = 0.88;
            scaleY = 1.18;
        } else if (state.velocity > 3) {
            scaleX = 1.12;
            scaleY = 0.90;
        }
        ctx.scale(scaleX, scaleY);

        // Rotation
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (state.velocity * 0.08)));
        ctx.rotate(rotation);

        // Animated Wing Flutter
        const flutter = Math.sin(Date.now() / 45) * 0.45;
        const drawWing = (side = 'front') => {
            const wingOffset = (state.velocity * 0.12) + flutter;
            const flap = side === 'back' ? wingOffset * 0.8 : wingOffset;

            ctx.save();
            ctx.translate(-24, 6);
            ctx.rotate(flap);

            ctx.fillStyle = '#fff';
            ctx.strokeStyle = sector === 2 ? '#39ff14' : (sector === 3 ? '#a855f7' : '#00f0ff');
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = sector === 2 ? '#39ff14' : (sector === 3 ? '#a855f7' : '#00f0ff');
            ctx.lineWidth = 1.5;
            ctx.moveTo(-5, 0);
            ctx.lineTo(5, 0);
            ctx.stroke();

            ctx.restore();
        };

        drawWing('back');

        // Draw Character Image
        let img = null;
        if (charData.id === 'flappy_boy') img = birdImgRef.current;
        else if (charData.id === 'flappy_brokid') img = brokidImgRef.current;
        else if (charData.id === 'flappy_face_money') img = moneyImgRef.current;
        else if (charData.id === 'flappy_face_bear') img = bearImgRef.current;
        else if (charData.id === 'flappy_face_bunny') img = bunnyImgRef.current;
        else img = birdImgRef.current;

        if (img && img.complete) {
            ctx.drawImage(img, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
        } else {
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
        }

        drawWing('front');

        ctx.restore(); // Undo bird transforms
        ctx.restore(); // Undo screen shake

        state.animationId = requestAnimationFrame(gameLoop);
    };

    const lastJumpRef = useRef(0);
    const handleInput = () => {
        if (!gameActiveRef.current) return;

        const now = Date.now();
        if (now - lastJumpRef.current < 140) return;
        lastJumpRef.current = now;

        gameState.current.velocity = JUMP_STRENGTH;
        playJump?.();

        // Spawn Flap Particle Exhaust
        const birdX = 50;
        const birdY = gameState.current.birdY + BIRD_SIZE / 2;
        for (let i = 0; i < 6; i++) {
            gameState.current.particles.push({
                x: birdX - 5,
                y: birdY + (Math.random() - 0.5) * 10,
                vx: -2 - Math.random() * 3,
                vy: 1 + Math.random() * 2.5,
                size: 3 + Math.random() * 3,
                color: currentSectorRef.current === 2 ? '#39ff14' : (currentSectorRef.current === 3 ? '#a855f7' : '#00f0ff'),
                alpha: 0.9,
                decay: 0.04
            });
        }

        if (navigator.vibrate) navigator.vibrate(12);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleInput();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '16px', color: '#00f0ff', minHeight: '100vh', touchAction: 'none'
        }}>
            {/* RETURN BUTTON */}
            <Link to="/arcade" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 100, textDecoration: 'none' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '30px',
                    color: '#e2e8f0',
                    fontSize: '0.78rem',
                    fontFamily: '"Orbitron", monospace',
                    letterSpacing: '1px',
                    transition: 'all 0.2s ease'
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span>ARCADE</span>
                </div>
            </Link>

            {/* STUDIO TELEMETRY HEADER */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', maxWidth: '400px',
                marginBottom: '10px',
                padding: '10px 16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                fontFamily: '"Orbitron", monospace',
                fontSize: '0.85rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: currentSector === 2 ? '#39ff14' : (currentSector === 3 ? '#a855f7' : '#00f0ff'),
                        boxShadow: `0 0 8px ${currentSector === 2 ? '#39ff14' : (currentSector === 3 ? '#a855f7' : '#00f0ff')}`
                    }}></span>
                    <span style={{ fontSize: '0.72rem', color: '#fff', letterSpacing: '1px' }}>
                        {currentSector === 1 ? 'SEC 1: SKYLINE' : (currentSector === 2 ? 'SEC 2: ACID RUN' : 'SEC 3: ORBITAL')}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                        transform: `scale(${scoreScale})`,
                        transition: 'transform 0.15s ease-out',
                        display: 'inline-block',
                        color: '#00f0ff',
                        fontSize: '0.9rem'
                    }}>
                        {score} <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>PTS</span>
                    </span>
                    <span style={{ color: '#ffd700', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><path d="M14.5 9h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4.5"/><path d="M12 7v10"/></svg>
                        {(coins || 0).toLocaleString()} CP
                    </span>
                </div>
            </div>

            {/* ACTIVE POWER-UP STATUS BADGE */}
            {(activePowerUp || activeShield) && gameActive && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '8px',
                    padding: '4px 14px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    borderRadius: '20px',
                    fontFamily: '"Orbitron", monospace',
                    fontSize: '0.72rem',
                    color: '#00f0ff',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.25)'
                }}>
                    {activeShield && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>🛡️ SHIELD READY</span>}
                    {activePowerUp && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ffd700' }}>
                            ⚡ {activePowerUp.label}: {activePowerUp.timeLeft}s
                        </span>
                    )}
                </div>
            )}

            {/* BOSS HP BAR OVERLAY */}
            {bossDisplay && gameActive && (
                <div style={{
                    width: '100%', maxWidth: '400px',
                    marginBottom: '8px',
                    padding: '6px 14px',
                    background: 'rgba(255, 0, 85, 0.15)',
                    border: '1.5px solid #ff0055',
                    borderRadius: '12px',
                    fontFamily: '"Orbitron", monospace',
                    boxShadow: '0 0 16px rgba(255, 0, 85, 0.4)',
                    textAlign: 'center'
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

            <div style={{ position: 'relative' }}>
                {/* GHOST DUEL LIVE TELEMETRY HUD */}
                {activeGhost && gameActive && (
                    <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 60,
                        pointerEvents: 'none'
                    }}>
                        <GhostDuelHUD
                            ghost={activeGhost}
                            currentScore={score}
                            ghostCurrentScore={ghostPos ? ghostPos.score : 0}
                            isGhostFinished={ghostPos?.isFinished}
                            unit="pts"
                        />
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    onMouseDown={handleInput}
                    onTouchStart={(e) => {
                        if (e.cancelable) e.preventDefault();
                        handleInput();
                    }}
                    style={{
                        border: '3px solid #00f0ff',
                        borderRadius: '16px',
                        boxShadow: '0 0 35px rgba(0, 240, 255, 0.3), 0 20px 40px rgba(0,0,0,0.8)',
                        cursor: 'pointer',
                        touchAction: 'none'
                    }}
                />

                {!gameActive && !gameOver && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
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
                                👻 DUEL CHALLENGE: Beat <strong>{activeGhost.playerName}</strong> ({activeGhost.finalScore} pts)!
                            </div>
                        )}
                        <SquishyButton
                            onClick={startGame}
                            style={{
                                padding: '16px 45px',
                                fontSize: '1.4rem',
                                background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
                                border: 'none',
                                borderRadius: '14px',
                                color: 'white',
                                fontWeight: '900',
                                fontFamily: '"Orbitron", monospace',
                                boxShadow: '0 0 25px rgba(0, 240, 255, 0.6)'
                            }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span>FLY!</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h4v4"/><path d="m22 2-7.5 7.5"/><path d="M21.5 13V8.5a6.5 6.5 0 0 0-6.5-6.5H10.5A6.5 6.5 0 0 0 4 8.5V13"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/></svg>
                            </span>
                        </SquishyButton>
                        <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '12px', fontFamily: 'monospace' }}>
                            [SPACE] OR TAP SCREEN TO FLAP
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(3, 6, 15, 0.88)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px'
                    }}>
                        <h2 style={{ fontSize: '2.8rem', color: '#ff0055', fontFamily: '"Orbitron", monospace', margin: '0 0 10px 0', textShadow: '0 0 20px #ff0055' }}>
                            GAME OVER
                        </h2>
                        <p style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#fff', fontFamily: 'monospace' }}>
                            Score: <strong style={{ color: '#00f0ff' }}>{score}</strong> | Best: <strong style={{ color: '#ffd700' }}>{highScore}</strong>
                        </p>

                        {/* SHIELD REVIVE OPTION */}
                        {(shopState?.inventory?.['flappy_shield'] > 0) && (
                            <SquishyButton
                                onClick={() => {
                                    if (consumeItem('flappy_shield')) {
                                        setGameOver(false);
                                        setGameActive(true);
                                        gameActiveRef.current = true;
                                        gameState.current.birdY = GAME_HEIGHT / 2;
                                        gameState.current.velocity = 0;
                                        gameState.current.pipes.forEach(p => p.x += 300);
                                        requestAnimationFrame(gameLoop);
                                    }
                                }}
                                style={{ marginBottom: '12px', padding: '10px 30px', background: '#00f0ff', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold' }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    <span>USE SHIELD ({shopState.inventory['flappy_shield']})</span>
                                </span>
                            </SquishyButton>
                        )}

                        {/* SPONSOR REWARDED REVIVE */}
                        {!hasRevived && (
                            <button
                                type="button"
                                onClick={() => setShowSponsorModal(true)}
                                style={{
                                    marginBottom: '14px',
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 229, 255, 0.25) 100%)',
                                    border: '1.5px solid #00ff88',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontWeight: '900',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
                                    <span>FREE REVIVE (WATCH SPONSOR SPOT)</span>
                                </span>
                            </button>
                        )}

                        <RewardedSponsorModal
                            isOpen={showSponsorModal}
                            onClose={() => setShowSponsorModal(false)}
                            rewardTitle="FLAPPY FREE REVIVE"
                            rewardIcon="❤️"
                            rewardDescription="Complete the 10-second sponsor spot to revive and continue flying!"
                            onRewarded={() => {
                                setHasRevived(true);
                                setGameOver(false);
                                setGameActive(true);
                                gameActiveRef.current = true;
                                gameState.current.birdY = GAME_HEIGHT / 2;
                                gameState.current.velocity = 0;
                                gameState.current.pipes.forEach(p => p.x += 350);
                                requestAnimationFrame(gameLoop);
                            }}
                        />

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
                                    Rival: {activeGhost.playerName} ({activeGhost.finalScore} pts) | You: {score} pts
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
                            <span>⚡ CHALLENGE A FRIEND (COPY DUEL)</span>
                        </button>

                        <SquishyButton
                            onClick={startGame}
                            style={{
                                marginBottom: '12px',
                                padding: '12px 36px',
                                background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            Try Again
                        </SquishyButton>

                        <ShareDuelModal
                            isOpen={isShareModalOpen}
                            onClose={() => setIsShareModalOpen(false)}
                            gamePath="/arcade/flappy"
                            ghostData={lastFinishedRun}
                            unit="pts"
                        />
                        <Link to="/arcade" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', marginTop: '6px' }}>
                            ← Back to Base
                        </Link>
                    </div>
                )}
            </div>

            {/* PILOT SELECTOR */}
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '400px', overflowX: 'auto', paddingBottom: '10px' }}>
                <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    SELECT PILOT
                </p>
                <div style={{ display: 'flex', gap: '10px', padding: '0 10px' }}>
                    {CHARACTERS.map(char => {
                        const isSelected = selectedId === char.id;
                        return (
                            <button
                                key={char.id}
                                onClick={() => {
                                    if (equipItem) {
                                        equipItem('flappy', char.id);
                                        if (navigator.vibrate) navigator.vibrate(20);
                                    }
                                }}
                                style={{
                                    background: isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.06)',
                                    border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    minWidth: '65px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                                    <img src={char.content} style={{ width: '32px', height: '32px', objectFit: 'contain' }} alt={char.name} />
                                </div>
                                <span style={{ fontSize: '0.68rem', color: isSelected ? '#00f0ff' : '#94a3b8', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                                    {char.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <Link to="/shop" style={{ color: '#ffd700', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        <span>Unlock More Pilots in Shop</span>
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default FlappyMascot;
