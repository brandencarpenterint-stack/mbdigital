import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { usePocketBro } from '../../context/PocketBroContext';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import useRetroSound from '../../hooks/useRetroSound';
import { feedService } from '../../utils/feed';
import { drawCanvasAura, createAuraTrailParticle, updateAndRenderAuraParticles } from '../../utils/skinAuraCanvas';
import { getSkinAura } from '../../config/SkinAuras';
import GhostDuelHUD from '../../components/GhostDuelHUD';
import ShareDuelModal from '../../components/ShareDuelModal';
import {
    getGhostDuelFromUrl,
    interpolateGhostPosition,
    savePersonalBestGhost
} from '../../utils/ghostDuelCodec';

const BIOMES = [
    { name: 'STREETS', limit: 3000, bgTop: '#87CEEB', bgBot: '#E0F7FA', plat: '#999', text: '#333', border: '#666' },
    { name: 'SUNSET WAVE', limit: 6000, bgTop: '#ff7e5f', bgBot: '#feb47b', plat: '#554433', text: 'white', border: '#332211' },
    { name: 'TOXIC WASTE', limit: 9000, bgTop: '#4b1', bgBot: '#260', plat: '#3f3', text: '#cbff00', border: '#252' },
    { name: 'CYBER CITY', limit: 12000, bgTop: '#2b1055', bgBot: '#7597de', plat: '#00ffaa', text: '#00ffaa', border: 'white' },
    { name: 'ICE AGE', limit: 15000, bgTop: '#00d2ff', bgBot: '#3a7bd5', plat: '#e0ffff', text: '#caf0f8', border: '#90e0ef' },
    { name: 'VOLCANO', limit: 18000, bgTop: '#800000', bgBot: '#ff0000', plat: '#300', text: '#ff4500', border: '#ffaa00' },
    { name: 'CANDY LAND', limit: 21000, bgTop: '#ffb6c1', bgBot: '#ff69b4', plat: '#ff1493', text: '#fff', border: '#fff' },
    { name: 'GLITCH REALM', limit: 24000, bgTop: '#000000', bgBot: '#111111', plat: '#00ff00', text: '#00ff00', border: 'lime', glitch: true },
    { name: 'MIDNIGHT TOKYO', limit: 28000, bgTop: '#0f0c29', bgBot: '#302b63', plat: '#ff00cc', text: '#00d4ff', border: '#ff00cc' },
    { name: 'DEEP SPACE', limit: 32000, bgTop: '#000011', bgBot: '#000033', plat: '#888', text: '#ccc', border: '#444' },
    { name: 'STRATOSPHERE', limit: 36000, bgTop: '#000046', bgBot: '#1CB5E0', plat: '#fff', text: '#fff', border: '#aaa' },
    { name: 'THE VOID', limit: 40000, bgTop: '#1a0033', bgBot: '#000', plat: '#5500ff', text: '#aa00ff', border: '#ff0055' },
    { name: 'ASCENSION', limit: 999999, bgTop: '#FFD700', bgBot: '#FFFFFF', plat: '#FFFFFF', text: '#B8860B', border: '#FFD700' }
];

const MerchJump = () => {
    const canvasRef = useRef(null);
    const { playJump, playCollect, playCrash, playBoop, playShoot, playLaser, playPowerUp, playFanfare, playExplosion, playHit } = useRetroSound();
    const { updateStat, addCoins, coins, spendCoins, userProfile, stats } = useGamification() || {};
    const { awardArcadeXP } = usePocketBro?.() || {};

    // Game Constants
    const GRAVITY = 0.35;
    const JUMP_FORCE = -12;
    const WIDTH = 400;
    const HEIGHT = 600;

    // Assets
    const SKINS = [
        { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png?t=v3', hoodie: '#111' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2', hoodie: '#593a28' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2', hoodie: '#7cb9e8' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2', hoodie: '#333' },
        { id: 'face_dino', name: 'DINO', src: '/assets/skins/face_dino.png', hoodie: '#85c34a' },
        { id: 'face_star', name: 'STAR', src: '/assets/skins/face_star.png', hoodie: '#ffaa00' },
        { id: 'face_space', name: 'SPACE', src: '/assets/skins/face_space.png', hoodie: '#33ccff' },
        { id: 'face_pumpkin', name: 'PUMPKIN', src: '/assets/skins/face_pumpkin.png', hoodie: '#ff6600' },
        { id: 'face_gamer', name: 'GAMER', src: '/assets/skins/face_gamer.png', hoodie: '#9966ff' },
        { id: 'face_frog', name: 'FROG', src: '/assets/skins/face_frog.png', hoodie: '#66ff99' },
        { id: 'face_astro', name: 'ASTRO', src: '/assets/skins/face_astro.png', hoodie: '#ffcc00' },
        { id: 'face_rainbow', name: 'RAINBOW', src: '/assets/skins/face_rainbow.png', hoodie: '#ff6699' },
    ];

    // STREAKS
    const STREAKS = [
        { id: 'none', name: 'NONE', price: 0, color: 'transparent' },
        { id: 'rainbow', name: 'RAINBOW', price: 500, gradient: ['red', 'orange', 'yellow', 'green', 'blue', 'violet'] },
        { id: 'black_death', name: 'BLACK DEATH', price: 1000, gradient: ['#000', '#220000', '#550000', '#ff0000'] },
        { id: 'fire', name: 'INFERNO', price: 750, gradient: ['#fff', '#ffaa00', '#ff4500', '#550000'] },
        { id: 'matrix', name: 'MATRIX', price: 2000, gradient: ['#0f0', '#003300', '#0f0'] },
        { id: 'gold_rush', name: 'GOLD RUSH', price: 5000, gradient: ['#ffd700', '#fff', '#daa520'] },
        { id: 'neon_pulse', name: 'NEON PULSE', price: 3000, gradient: ['#ff00ff', '#00ffff'] }
    ];

    // State
    const [gameState, setGameState] = useState('MENU');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('merchJumpHighScore')) || 0);
    const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

    // Shop State
    const [selectedStreak, setSelectedStreak] = useState(STREAKS[0]);
    const [unlockedStreaks, setUnlockedStreaks] = useState(['none']);
    const [isShopOpen, setIsShopOpen] = useState(window.innerWidth > 500);

    // --- EPIC POWER-UPS & BOSS ENCOUNTERS ---
    const [activeForcefield, setActiveForcefield] = useState(false);
    const [activeBuff, setActiveBuff] = useState(null); // { type, label, timeLeft }
    const [bossDisplay, setBossDisplay] = useState(null); // { name, hp, maxHp }

    const activeForcefieldRef = useRef(false);
    const activeBuffRef = useRef(null); // { type, label, expiresAt, charges }
    const bossRef = useRef({
        active: false,
        name: 'CHRONO-DRONE MK-IV',
        hp: 6,
        maxHp: 6,
        x: WIDTH / 2,
        y: -100,
        targetY: 130,
        vx: 2.2,
        attackTimer: 0,
        hitFlash: 0,
        bombs: [], // [{ x, y, vy }]
        rockets: [], // [{ x, y, vy, targetX, targetY }]
        stage: 1 // 1: Chrono-Drone (40,000m Ascension), 2: Nebula Colossus (45,000m Ascension)
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

    // Sync Stats
    useEffect(() => {
        if (stats?.merchJumpHighScore > highScore) {
            setHighScore(stats.merchJumpHighScore);
        }
        if (stats?.unlockedStreaks) {
            setUnlockedStreaks(stats.unlockedStreaks);
        }
    }, [stats]);

    // Refs
    const playerRef = useRef({ x: WIDTH / 2, y: HEIGHT - 150, vy: 0, width: 40, height: 60 });
    const platformsRef = useRef([]);
    const itemsRef = useRef([]);
    const trailRef = useRef([]);
    const cameraYRef = useRef(0);
    const scoreRef = useRef(0);
    const requestRef = useRef(null);
    const inputRef = useRef(WIDTH / 2);
    const skinImgRef = useRef(null);
    const auraParticlesRef = useRef([]);
    const frameRef = useRef(0);
    const biomeRef = useRef(BIOMES[0]);

    // Preload Ghost Skin
    useEffect(() => {
        if (activeGhost?.skinId) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            const src = activeGhost.skinId.startsWith('/') ? activeGhost.skinId : `/assets/skins/${activeGhost.skinId}.png`;
            img.src = src;
            ghostImgRef.current = img;
        }
    }, [activeGhost]);

    // Image Loader
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = selectedSkin.src;
        skinImgRef.current = img;
        return () => cancelAnimationFrame(requestRef.current);
    }, [selectedSkin]);

    // Load Merch Balloon
    const merchBalloonImgRef = useRef(null);
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/merch_balloon.png';
        merchBalloonImgRef.current = img;
    }, []);

    const getCurrentBiome = (s) => {
        for (let b of BIOMES) {
            if (s < b.limit) return b;
        }
        return BIOMES[BIOMES.length - 1];
    };

    const buyStreak = (streak) => {
        if (unlockedStreaks.includes(streak.id)) {
            setSelectedStreak(streak);
            playBoop?.();
        } else {
            if (spendCoins(streak.price)) {
                playCollect?.();
                const newUnlocked = [...unlockedStreaks, streak.id];
                setUnlockedStreaks(newUnlocked);
                updateStat?.('unlockedStreaks', newUnlocked);
                setSelectedStreak(streak);
            } else {
                playCrash?.();
            }
        }
    };

    const initGame = () => {
        setScore(0);
        scoreRef.current = 0;
        cameraYRef.current = 0;
        biomeRef.current = BIOMES[0];
        runStartTimeRef.current = performance.now();
        runKeyframesRef.current = [];
        lastSampleTimeRef.current = 0;
        setGhostPos(null);
        setDuelWon(null);
        trailRef.current = [];
        auraParticlesRef.current = [];

        // Reset Epic Buffs & Boss
        activeForcefieldRef.current = false;
        setActiveForcefield(false);
        activeBuffRef.current = null;
        setActiveBuff(null);
        setBossDisplay(null);
        bossRef.current = {
            active: false,
            name: 'CHRONO-DRONE MK-IV',
            hp: 6,
            maxHp: 6,
            x: WIDTH / 2,
            y: -100,
            targetY: 130,
            vx: 2.2,
            attackTimer: 0,
            hitFlash: 0,
            bombs: [],
            rockets: [],
            stage: 1
        };

        const startVy = -(40 + Math.random() * 23);
        playerRef.current = { x: WIDTH / 2, y: HEIGHT - 150, vy: startVy, width: 40, height: 60 };

        platformsRef.current = [];
        itemsRef.current = [];
        platformsRef.current.push({ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, h: 20, type: 'normal', color: BIOMES[0].plat, border: BIOMES[0].border });

        let y = HEIGHT - 200;
        for (let i = 0; i < 20; i++) {
            generatePlatform(y, BIOMES[0]);
            y -= 80 + Math.random() * 40;
        }

        setGameState('PLAYING');
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleRevive = () => {
        setGameState('PLAYING');
        playerRef.current.vy = -35;
        playerRef.current.y = HEIGHT / 2;
        activeForcefieldRef.current = true;
        setActiveForcefield(true);
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const generatePlatform = (y, biome) => {
        const score = scoreRef.current;

        // Spawn In-Game Power-Ups on platforms ONLY AFTER ASCENSION (40,000m+)
        const isAscension = score >= 40000 || biome?.name === 'ASCENSION';
        if (isAscension && Math.random() < 0.14) {
            const puTypes = ['jetpack', 'sneakers', 'forcefield', 'vacuum'];
            const chosen = puTypes[Math.floor(Math.random() * puTypes.length)];
            itemsRef.current.push({
                x: Math.random() * (WIDTH - 50) + 15,
                y: y - 26,
                type: chosen,
                w: 32,
                h: 32
            });
        }

        // Rare Merch Balloon
        if (score > 1000 && Math.random() < 0.045) {
            itemsRef.current.push({
                x: Math.random() * (WIDTH - 60), y: y - 100, type: 'merch_balloon', w: 50, h: 50
            });
        }

        let x = Math.random() * (WIDTH - 80);
        let w = 70 + Math.random() * 30;
        let type = 'normal';

        if (score > 4000 && Math.random() > 0.7) type = 'moving';
        if (score > 8000 && Math.random() > 0.8) type = 'crumble';
        if (biome.name === 'ICE AGE' && Math.random() > 0.5) type = 'slippery';
        if (biome.name === 'VOLCANO' && Math.random() > 0.5) type = 'melting';
        if ((biome.name === 'THE VOID' || biome.name === 'DEEP SPACE') && Math.random() > 0.6) type = 'shrinking';

        if (score > 12000 && Math.random() > 0.8) {
            const gap = 40 + Math.random() * 30;
            const w2 = 40;
            platformsRef.current.push({
                x: Math.max(0, x - gap / 2 - w2), y, w: w2, h: 15,
                type: 'normal', color: biome.plat, border: biome.border
            });
            platformsRef.current.push({
                x: Math.min(WIDTH - w2, x + gap / 2), y, w: w2, h: 15,
                type: 'normal', color: biome.plat, border: biome.border
            });
            return;
        }

        platformsRef.current.push({
            x, y, w, h: 15,
            type,
            vx: Math.random() > 0.5 ? 2 : -2,
            color: type === 'crumble' ? '#8B4513' : biome.plat,
            border: biome.border
        });
    };

    const drawRig = (ctx, x, y, vy, tilt) => {
        const time = performance.now() * 0.01;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt * 0.2);

        // JETPACK
        ctx.fillStyle = '#ccc';
        ctx.fillRect(-15, -10, 10, 30);
        ctx.fillRect(5, -10, 10, 30);
        if (vy < 0 || activeBuffRef.current?.type === 'jetpack') {
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.moveTo(-10, 20); ctx.lineTo(-5, 35 + Math.random() * 12); ctx.lineTo(0, 20);
            ctx.moveTo(10, 20); ctx.lineTo(15, 35 + Math.random() * 12); ctx.lineTo(5, 20);
            ctx.fill();
        }

        // LEGS
        ctx.fillStyle = '#222';
        const legLeftY = vy < 0 ? 30 : 30 + Math.abs(Math.sin(time) * 5);
        const legRightY = vy < 0 ? 30 + 5 : 30 + Math.abs(Math.cos(time) * 5);

        ctx.beginPath(); ctx.moveTo(-10, 20); ctx.quadraticCurveTo(-15, 25, -12, legLeftY);
        ctx.lineWidth = 6; ctx.strokeStyle = '#222'; ctx.stroke();

        ctx.beginPath(); ctx.moveTo(10, 20); ctx.quadraticCurveTo(15, 25, 12, legRightY);
        ctx.stroke();

        // Spring Sneakers on feet if active
        if (activeBuffRef.current?.type === 'sneakers') {
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-18, legLeftY, 12, 7);
            ctx.fillRect(6, legRightY, 12, 7);
        } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(-16, legLeftY, 8, 5);
            ctx.fillRect(8, legRightY, 8, 5);
        }

        // BODY
        ctx.fillStyle = selectedSkin.hoodie || '#111';
        ctx.beginPath(); ctx.roundRect(-20, 0, 40, 35, 10); ctx.fill();

        ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.fillText('M', -5, 20);

        // ARMS
        ctx.strokeStyle = selectedSkin.hoodie || '#111'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-18, 5); ctx.lineTo(-30, vy < 0 ? -10 : 15); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, 5); ctx.lineTo(30, vy < 0 ? -10 : 15); ctx.stroke();

        // MYTHIC SKIN AURA HALO
        drawCanvasAura(ctx, 0, -15, 26, selectedSkin, frameRef.current);

        // HEAD
        if (skinImgRef.current && skinImgRef.current.complete) {
            const size = 50;
            ctx.drawImage(skinImgRef.current, -size / 2, -size / 2 - 15, size, size);
        } else {
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(0, -20, 20, 0, Math.PI * 2); ctx.fill();
        }

        // BUBBLE FORCEFIELD SURROUNDING MASCOT
        if (activeForcefieldRef.current) {
            ctx.save();
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(0, 5, 42, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();
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
        const player = playerRef.current;
        const currentBiome = getCurrentBiome(scoreRef.current);
        biomeRef.current = currentBiome;
        const now = performance.now();

        // Active Buff countdown
        if (activeBuffRef.current) {
            if (activeBuffRef.current.expiresAt) {
                const timeLeft = Math.max(0, Math.ceil((activeBuffRef.current.expiresAt - now) / 1000));
                if (timeLeft <= 0) {
                    activeBuffRef.current = null;
                    setActiveBuff(null);
                } else {
                    setActiveBuff(prev => prev ? { ...prev, timeLeft } : null);
                }
            }
        }

        const boss = bossRef.current;

        // --- BOSS SUMMON TRIGGERS (ASCENSION ONLY: 40,000m+) ---
        if (!boss.active) {
            if (scoreRef.current >= 40000 && boss.stage === 1) {
                boss.active = true;
                boss.name = 'CHRONO-DRONE MK-IV';
                boss.hp = 6;
                boss.maxHp = 6;
                boss.x = WIDTH / 2;
                boss.y = 120;
                boss.bombs = [];
                boss.rockets = [];
                setBossDisplay({ name: boss.name, hp: 6, maxHp: 6 });
                playLaser?.();

                // Spawn a wide hovering safety platform for the boss duel
                platformsRef.current.push({
                    x: WIDTH / 2 - 100, y: HEIGHT - 120, w: 200, h: 20,
                    type: 'normal', color: '#00f0ff', border: '#fff'
                });
            } else if (scoreRef.current >= 45000 && boss.stage === 2) {
                boss.active = true;
                boss.name = 'NEBULA COLOSSUS';
                boss.hp = 10;
                boss.maxHp = 10;
                boss.x = WIDTH / 2;
                boss.y = 110;
                boss.bombs = [];
                boss.rockets = [];
                setBossDisplay({ name: boss.name, hp: 10, maxHp: 10 });
                playLaser?.();

                platformsRef.current.push({
                    x: WIDTH / 2 - 110, y: HEIGHT - 120, w: 220, h: 20,
                    type: 'normal', color: '#a855f7', border: '#fff'
                });
            }
        }

        // --- UPDATE PLAYER ---
        const targetX = inputRef.current;
        player.x += (targetX - player.x) * 0.15;
        if (player.x < -20) player.x = WIDTH + 20;
        if (player.x > WIDTH + 20) player.x = -20;

        // Rocket Jetpack continuous climb
        if (activeBuffRef.current?.type === 'jetpack') {
            player.vy = -18;
        } else {
            player.vy += GRAVITY;
        }
        player.y += player.vy;

        let shift = 0;
        if (player.y < HEIGHT / 2) {
            shift = HEIGHT / 2 - player.y;
            player.y = HEIGHT / 2;
            cameraYRef.current += shift;
            scoreRef.current += Math.floor(shift);
            setScore(scoreRef.current);
            platformsRef.current.forEach(p => p.y += shift);
            platformsRef.current = platformsRef.current.filter(p => p.y < HEIGHT);
            itemsRef.current.forEach(i => i.y += shift);
            itemsRef.current = itemsRef.current.filter(i => i.y < HEIGHT);

            if (!boss.active) {
                const lastP = platformsRef.current[platformsRef.current.length - 1];
                if (lastP && lastP.y > 100) {
                    generatePlatform(lastP.y - (80 - Math.min(20, scoreRef.current / 1000) + Math.random() * 40), currentBiome);
                }
            }
        }

        // TRAIL UPDATE
        if (player.vy < -10 && selectedStreak.id !== 'none') {
            trailRef.current.push({ x: player.x, y: player.y, age: 1.0 });
        }
        for (let i = trailRef.current.length - 1; i >= 0; i--) {
            trailRef.current[i].y += shift;
            trailRef.current[i].age -= 0.05;
            if (trailRef.current[i].age <= 0) trailRef.current.splice(i, 1);
        }

        // --- PLATFORM COLLISIONS ---
        if (player.vy > 0) {
            platformsRef.current.forEach((p, idx) => {
                if (player.x > p.x - 20 && player.x < p.x + p.w + 20 && player.y + 30 > p.y && player.y + 30 < p.y + p.h + 20) {
                    // Check Spring Sneakers
                    if (activeBuffRef.current?.type === 'sneakers' && activeBuffRef.current.charges > 0) {
                        player.vy = JUMP_FORCE * 2.3;
                        activeBuffRef.current.charges -= 1;
                        setActiveBuff(prev => prev ? { ...prev, label: `SNEAKERS (${activeBuffRef.current.charges} left)` } : null);
                        if (activeBuffRef.current.charges <= 0) {
                            activeBuffRef.current = null;
                            setActiveBuff(null);
                        }
                        playJump?.();
                    } else if (p.type === 'slippery') {
                        player.vy = JUMP_FORCE * 0.7;
                        playJump?.();
                    } else {
                        player.vy = JUMP_FORCE;
                        playJump?.();
                    }
                    
                    if (p.type === 'crumble') {
                        platformsRef.current.splice(idx, 1);
                        playCrash?.();
                    }
                    if (p.type === 'melting') {
                        p.w = Math.max(20, p.w - 15);
                    }
                }
            });
        }

        // --- ITEM PICKUPS ---
        itemsRef.current.forEach((item, idx) => {
            // Vacuum suction
            if (activeBuffRef.current?.type === 'vacuum') {
                item.x += (player.x - item.x) * 0.12;
                item.y += (player.y - item.y) * 0.12;
            }

            if (player.x > item.x - 30 && player.x < item.x + item.w + 30 && player.y > item.y - 30 && player.y < item.y + item.h + 30) {
                if (item.type === 'merch_balloon') {
                    player.vy = -60;
                    playCollect?.();
                    itemsRef.current.splice(idx, 1);
                    feedService.publish(`found a Merch Balloon!`, 'win', userProfile?.name);
                } else if (item.type === 'jetpack') {
                    activeBuffRef.current = { type: 'jetpack', label: 'ROCKET JETPACK', expiresAt: now + 4000 };
                    setActiveBuff({ type: 'jetpack', label: 'ROCKET JETPACK', timeLeft: 4 });
                    playPowerUp?.();
                    itemsRef.current.splice(idx, 1);
                } else if (item.type === 'sneakers') {
                    activeBuffRef.current = { type: 'sneakers', label: 'SPRING SNEAKERS (5)', charges: 5 };
                    setActiveBuff({ type: 'sneakers', label: 'SPRING SNEAKERS (5)', charges: 5 });
                    playPowerUp?.();
                    itemsRef.current.splice(idx, 1);
                } else if (item.type === 'forcefield') {
                    activeForcefieldRef.current = true;
                    setActiveForcefield(true);
                    playPowerUp?.();
                    itemsRef.current.splice(idx, 1);
                } else if (item.type === 'vacuum') {
                    activeBuffRef.current = { type: 'vacuum', label: 'CP VACUUM', expiresAt: now + 8000 };
                    setActiveBuff({ type: 'vacuum', label: 'CP VACUUM', timeLeft: 8 });
                    playPowerUp?.();
                    itemsRef.current.splice(idx, 1);
                }
            }
        });

        // Moving platforms
        platformsRef.current.forEach(p => {
            if (p.type === 'moving') {
                p.x += p.vx;
                if (p.x <= 0 || p.x + p.w >= WIDTH) p.vx *= -1;
            }
        });

        // --- BOSS BATTLE LOOP ---
        if (boss.active) {
            boss.x += boss.vx;
            if (boss.x < 50 || boss.x > WIDTH - 50) boss.vx *= -1;

            // Boss attack: drop bombs
            boss.attackTimer++;
            if (boss.attackTimer >= 90) {
                boss.attackTimer = 0;
                boss.bombs.push({ x: boss.x, y: boss.y + 20, vy: 3 });
                playLaser?.();
            }

            // Stomp on boss weak point!
            if (player.vy > 0 && Math.hypot(player.x - boss.x, player.y - boss.y) < 45) {
                boss.hp -= 2;
                boss.hitFlash = 12;
                player.vy = -24; // Super bounce on boss head!
                playHit?.();
                setBossDisplay({ name: boss.name, hp: boss.hp, maxHp: boss.maxHp });
            }

            // Move & Draw Boss Bombs
            for (let bi = boss.bombs.length - 1; bi >= 0; bi--) {
                const b = boss.bombs[bi];
                b.y += b.vy + (shift > 0 ? shift : 0);

                if (Math.hypot(player.x - b.x, player.y - b.y) < 30) {
                    if (activeForcefieldRef.current) {
                        activeForcefieldRef.current = false;
                        setActiveForcefield(false);
                        player.vy = -20;
                        playCrash?.();
                        boss.bombs.splice(bi, 1);
                        continue;
                    } else {
                        handleGameOver();
                        return;
                    }
                }

                if (b.y > HEIGHT) {
                    boss.bombs.splice(bi, 1);
                }
            }

            // Boss Defeat
            if (boss.hp <= 0) {
                boss.active = false;
                setBossDisplay(null);
                playFanfare?.();
                playExplosion?.();

                const bonusCP = boss.stage === 1 ? 500 : 1000;
                if (addCoins) addCoins(bonusCP);

                // Victory launch catapult!
                player.vy = -55;
                boss.stage += 1;
            }
        }

        // --- FALL / DEATH CHECK (WITH FORCEFIELD SAVE) ---
        if (player.y > HEIGHT) {
            if (activeForcefieldRef.current) {
                activeForcefieldRef.current = false;
                setActiveForcefield(false);
                player.vy = -36; // Forcefield bounce saves run!
                playCrash?.();
            } else {
                handleGameOver();
                return;
            }
        }

        // --- DRAW ---
        const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, currentBiome.bgTop); grad.addColorStop(1, currentBiome.bgBot);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (currentBiome.glitch && Math.random() > 0.95) {
            ctx.save(); ctx.translate((Math.random() - 0.5) * 10, 0);
            if (Math.random() > 0.5) ctx.filter = 'invert(1)';
        }

        // Decor clouds/stars
        const cloudBiomes = ['STREETS', 'SUNSET WAVE', 'TOXIC WASTE', 'ICE AGE', 'STRATOSPHERE', 'ASCENSION'];
        if (cloudBiomes.includes(currentBiome.name)) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            if (currentBiome.name === 'TOXIC WASTE') ctx.fillStyle = 'rgba(100, 255, 0, 0.2)';
            if (currentBiome.name === 'ASCENSION') ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            for (let i = 0; i < 5; i++) {
                const cx = ((i * 100) + cameraYRef.current * 0.2) % (WIDTH + 200) - 100;
                const cy = (i * 150) % HEIGHT;
                ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill();
            }
        } else {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            if (currentBiome.name === 'VOLCANO') ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            if (currentBiome.name === 'MIDNIGHT TOKYO') ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
            ctx.lineWidth = 2; const gridY = (cameraYRef.current * 0.5) % 100;
            for (let y = gridY; y < HEIGHT; y += 100) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
            }
        }

        // Platforms
        platformsRef.current.forEach(p => {
            if (p.type === 'shrinking') {
                p.w = Math.max(10, p.w - 0.2);
            }

            ctx.fillStyle = p.color || currentBiome.plat;
            if (p.type === 'crumble') ctx.fillStyle = '#A0522D';
            if (p.type === 'slippery') ctx.fillStyle = '#ff0000';
            if (p.type === 'melting') ctx.fillStyle = '#ff4500';
            if (p.type === 'shrinking') ctx.fillStyle = '#8a2be2';
            
            ctx.fillRect(p.x, p.y, p.w, p.h);
            
            if (p.type === 'crumble') {
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(p.x + 5, p.y); ctx.lineTo(p.x + 15, p.y + p.h); ctx.stroke();
            }
            if (p.type === 'slippery') {
                ctx.fillStyle = 'black'; ctx.font = '12px Courier'; ctx.fillText('DANGER', p.x + 5, p.y + 12);
            }
            if (p.type === 'melting') {
                ctx.fillStyle = '#ff8c00';
                for(let i=10; i<p.w; i+=15) {
                     ctx.fillRect(p.x + i, p.y + p.h, 4, 6 + Math.random() * 5);
                }
            }

            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.strokeStyle = p.border || currentBiome.border; ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // Items & Power-Ups Drawing
        itemsRef.current.forEach(item => {
            if (item.type === 'merch_balloon') {
                if (merchBalloonImgRef.current) {
                    ctx.save();
                    const glowColor = `hsl(${performance.now() * 0.1}, 100%, 50%)`;
                    ctx.shadowColor = glowColor;
                    ctx.shadowBlur = 20;
                    const floatY = Math.sin(performance.now() * 0.005) * 10;
                    ctx.drawImage(merchBalloonImgRef.current, item.x, item.y + floatY, item.w, item.h);
                    ctx.restore();
                }
            } else {
                ctx.save();
                ctx.translate(item.x + 16, item.y + 16);
                const colMap = { jetpack: '#ff0055', sneakers: '#ffd700', forcefield: '#00f0ff', vacuum: '#ec4899' };
                const c = colMap[item.type] || '#fff';
                ctx.strokeStyle = c;
                ctx.lineWidth = 2;
                ctx.shadowColor = c;
                ctx.shadowBlur = 12;
                ctx.strokeRect(-14, -14, 28, 28);
                ctx.fillStyle = 'rgba(15,23,42,0.85)';
                ctx.fillRect(-14, -14, 28, 28);

                ctx.fillStyle = c;
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const iconMap = { jetpack: '🚀', sneakers: '👟', forcefield: '🛡', vacuum: '🧲' };
                ctx.fillText(iconMap[item.type] || '★', 0, 1);
                ctx.restore();
            }
        });

        // Draw Boss Entity
        if (boss.active) {
            ctx.save();
            ctx.translate(boss.x, boss.y);
            if (boss.hitFlash > 0) {
                boss.hitFlash--;
                ctx.filter = 'brightness(2.2)';
            }

            // Mechanical drone wings
            const wingOsc = Math.sin(now * 0.02) * 10;
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = boss.stage === 1 ? '#00f0ff' : '#a855f7';
            ctx.lineWidth = 3;
            ctx.shadowColor = boss.stage === 1 ? '#00f0ff' : '#a855f7';
            ctx.shadowBlur = 14;

            ctx.strokeRect(-35, -15, 70, 30);
            ctx.fillRect(-35, -15, 70, 30);

            // Left Rotor
            ctx.beginPath();
            ctx.ellipse(-45, wingOsc, 18, 6, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Right Rotor
            ctx.beginPath();
            ctx.ellipse(45, -wingOsc, 18, 6, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Eye / Weak Point
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Draw Boss Bombs
            boss.bombs.forEach(b => {
                ctx.save();
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        frameRef.current = (frameRef.current || 0) + 1;

        // Procedural Mythic Aura Particle Emission
        if (player.vy < -4 && Math.random() > 0.3) {
            auraParticlesRef.current.push(createAuraTrailParticle(player.x, player.y + 15, selectedSkin, {
                vy: (Math.random() * 2) + 1,
                size: 3 + Math.random() * 4
            }));
        }
        if (shift > 0) {
            auraParticlesRef.current.forEach(pt => pt.y += shift);
        }
        updateAndRenderAuraParticles(ctx, auraParticlesRef.current);

        // --- GHOST TELEMETRY SAMPLING & PLAYBACK ---
        const elapsed = now - runStartTimeRef.current;

        if (!lastSampleTimeRef.current || now - lastSampleTimeRef.current >= 160) {
            runKeyframesRef.current.push({
                t: Math.round(elapsed),
                x: Math.round(player.x),
                y: Math.round(scoreRef.current),
                score: Math.round(scoreRef.current)
            });
            lastSampleTimeRef.current = now;
        }

        // Interpolate and Draw Phantom Ghost
        if (activeGhost) {
            const gPos = interpolateGhostPosition(activeGhost, elapsed);
            if (gPos) {
                setGhostPos(gPos);
                const deltaWorldY = gPos.score - scoreRef.current;
                const ghostScreenY = player.y - deltaWorldY;
                const ghostScreenX = gPos.x;

                if (ghostScreenY >= -80 && ghostScreenY <= HEIGHT + 80) {
                    ctx.save();
                    ctx.globalAlpha = 0.55;
                    ctx.shadowColor = '#00f0ff';
                    ctx.shadowBlur = 12;

                    if (ghostImgRef.current && ghostImgRef.current.complete) {
                        ctx.drawImage(ghostImgRef.current, ghostScreenX - 25, ghostScreenY - 35, 50, 50);
                    } else {
                        ctx.fillStyle = '#00f0ff';
                        ctx.beginPath();
                        ctx.arc(ghostScreenX, ghostScreenY - 15, 20, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Floating Name Pill
                    ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 1;
                    const tagW = 86;
                    ctx.beginPath();
                    ctx.roundRect(ghostScreenX - tagW / 2, ghostScreenY - 58, tagW, 17, 8);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#00f0ff';
                    ctx.font = 'bold 9px "Orbitron", monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(`👻 ${activeGhost.playerName} ${Math.floor(gPos.score)}m`, ghostScreenX, ghostScreenY - 46);

                    ctx.restore();
                }
            }
        }

        const tilt = (inputRef.current - player.x) * 0.05;
        drawRig(ctx, player.x, player.y, player.vy, tilt);

        ctx.fillStyle = currentBiome.text; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'left';
        ctx.fillText(`${currentBiome.name}`, 10, 30); ctx.fillText(`${Math.floor(scoreRef.current)}m`, 10, 50);

        if (currentBiome.glitch && Math.random() > 0.95) ctx.restore();

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = () => {
        const finalScore = Math.floor(scoreRef.current);
        if (awardArcadeXP) awardArcadeXP('merch_jump', finalScore);
        setGameState('GAMEOVER');
        playCrash?.();
        if (addCoins) addCoins(Math.floor(finalScore / 200));
        if (updateStat) updateStat('gamesPlayed', 'merch_jump');

        const completedGhost = {
            gameId: 'merch-jump',
            playerName: userProfile?.name || 'Player',
            skinId: selectedSkin.id,
            finalScore: finalScore,
            keyframes: runKeyframesRef.current
        };
        setLastFinishedRun(completedGhost);
        savePersonalBestGhost('merch-jump', completedGhost);

        if (activeGhost) {
            const won = finalScore > (activeGhost.finalScore || 0);
            setDuelWon(won);
            if (won && addCoins) {
                addCoins(250);
            }
        }
        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('merchJumpHighScore', finalScore);
            const playerName = userProfile?.name || 'Player';
            feedService.publish(`set a new Merch Jump High Score: ${finalScore}m!`, 'win', playerName);
        }
    };

    const handleInput = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        inputRef.current = (clientX - rect.left) * scaleX;
    };

    return (
        <div className="merch-jump-container" style={{
            minHeight: '100vh', background: '#222', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', touchAction: 'none', gap: '20px'
        }}>
            <style>{`
                .merch-jump-container {
                    flex-direction: row;
                }
                .game-wrapper {
                    width: 400px;
                    height: 600px;
                }
                .boost-shop {
                    display: flex;
                }
                @media (max-width: 800px) {
                    .merch-jump-container {
                        flex-direction: column;
                        padding: 20px;
                    }
                    .boost-shop {
                        width: 100% !important;
                        height: auto !important;
                        max-height: 200px;
                    }
                }
                @media (max-width: 500px) {
                    .merch-jump-container {
                        padding: 0;
                        align-items: flex-start;
                        background: #000;
                    }
                    .game-wrapper {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                        max-height: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                    }
                    .game-canvas {
                        border-radius: 0 !important;
                        border: none !important;
                        object-fit: contain; 
                        background: #000 !important;
                        box-shadow: none !important;
                    }
                    .boost-shop {
                        display: flex !important; 
                        width: 100% !important;
                        border-radius: 0 !important;
                        border-left: none !important;
                        border-right: none !important;
                        border-bottom: none !important;
                        margin-top: 0 !important;
                        background: rgba(0,0,0,0.95) !important;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 200;
                        transition: transform 0.3s ease-in-out;
                        height: 50vh !important;
                        transform: translateY(100%);
                    }
                    .boost-shop.open {
                        transform: translateY(0);
                    }
                    .shop-toggle {
                        display: block !important;
                    }
                    .game-header {
                        display: none;
                    }
                    .game-overlay {
                        width: 100% !important;
                        height: 100% !important;
                        border-radius: 0 !important;
                    }
                }
                .shop-toggle {
                    display: none;
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 300;
                    background: #ff0055;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    padding: 10px 20px;
                    font-weight: bold;
                    box-shadow: 0 0 10px #ff0055;
                }
            `}</style>

            <button className="shop-toggle" onClick={() => setIsShopOpen(!isShopOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isShopOpen ? (
                    <>
                        <span>CLOSE SHOP</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </>
                ) : (
                    <>
                        <span>BOOST SHOP</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </>
                )}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h1 className="game-header" style={{ color: 'white', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>MERCH JUMP</h1>
                
                {/* ACTIVE BUFF / SHIELD PILL */}
                {(activeBuff || activeForcefield) && gameState === 'PLAYING' && (
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
                        {activeForcefield && <span style={{ color: '#38bdf8' }}>🛡️ FORCEFIELD READY</span>}
                        {activeBuff && (
                            <span style={{ color: '#ffd700' }}>
                                ⚡ {activeBuff.label} {activeBuff.timeLeft ? `(${activeBuff.timeLeft}s)` : ''}
                            </span>
                        )}
                    </div>
                )}

                {/* BOSS HP BAR OVERLAY */}
                {bossDisplay && gameState === 'PLAYING' && (
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

                <div className="game-wrapper" style={{ position: 'relative' }}>
                    {/* GHOST DUEL LIVE TELEMETRY HUD */}
                    {activeGhost && gameState === 'PLAYING' && (
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
                                currentScore={Math.floor(score)}
                                ghostCurrentScore={ghostPos ? ghostPos.score : 0}
                                isGhostFinished={ghostPos?.isFinished}
                                unit="m"
                            />
                        </div>
                    )}
                    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} onMouseMove={handleInput} onTouchMove={(e) => { e.preventDefault(); handleInput(e); }} onTouchStart={handleInput}
                        className="game-canvas"
                        style={{ width: '100%', height: '100%', background: '#87CEEB', border: '4px solid white', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
                    {gameState !== 'PLAYING' && (
                        <>
                            {gameState === 'GAMEOVER' ? (
                                <div className="game-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '10px', overflow: 'hidden' }}>
                                    <UniversalGameOver
                                        gameName="MERCH JUMP"
                                        score={Math.floor(scoreRef.current)}
                                        bestScore={highScore}
                                        coinsEarned={Math.floor(scoreRef.current / 200)}
                                        xpEarned={100}
                                        onReplay={initGame}
                                        onHome={() => window.location.href = '/arcade'}
                                        onRevive={handleRevive}
                                    >
                                        {activeGhost && (
                                            <div style={{
                                                background: duelWon ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 0, 85, 0.15)',
                                                border: `1.5px solid ${duelWon ? '#00ff88' : '#ff0055'}`,
                                                borderRadius: '14px',
                                                padding: '10px 14px',
                                                marginBottom: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                fontFamily: '"Orbitron", sans-serif'
                                            }}>
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ fontSize: '0.65rem', color: duelWon ? '#00ff88' : '#ff3366', fontWeight: '900' }}>
                                                        {duelWon ? '🏆 DUEL VICTORY (+250 CP)' : '💀 DUEL DEFEATED'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '700' }}>
                                                        vs {activeGhost.playerName} ({activeGhost.finalScore}m)
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '900', color: duelWon ? '#00ff88' : '#ff3366' }}>
                                                    {duelWon ? `+${Math.floor(scoreRef.current - activeGhost.finalScore)}m` : `-${Math.floor(activeGhost.finalScore - scoreRef.current)}m`}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setIsShareModalOpen(true)}
                                            style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.3))',
                                                border: '1.5px solid #00f0ff',
                                                color: '#00f0ff',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                fontWeight: '900',
                                                fontSize: '0.82rem',
                                                fontFamily: '"Orbitron", sans-serif',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                boxShadow: '0 0 16px rgba(0, 240, 255, 0.3)',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                                <polyline points="16 6 12 2 8 6" />
                                                <line x1="12" y1="2" x2="12" y2="15" />
                                            </svg>
                                            <span>⚡ CHALLENGE A FRIEND (COPY DUEL)</span>
                                        </button>
                                    </UniversalGameOver>

                                    <ShareDuelModal
                                        isOpen={isShareModalOpen}
                                        onClose={() => setIsShareModalOpen(false)}
                                        gamePath="/arcade/merch-jump"
                                        ghostData={lastFinishedRun}
                                        unit="m"
                                    />
                                </div>
                            ) : (
                                <div className="game-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#333', borderRadius: '10px' }}>
                                    <h2 style={{ fontWeight: 'bold', marginBottom: '12px', fontFamily: '"Orbitron", sans-serif' }}>SKIN SELECT</h2>
                                    {activeGhost && (
                                        <div style={{
                                            background: 'rgba(0, 240, 255, 0.12)', border: '1px solid #00f0ff',
                                            borderRadius: '20px', padding: '4px 14px', marginBottom: '14px',
                                            fontSize: '0.72rem', color: '#00f0ff', fontFamily: '"Orbitron", monospace',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            <span>👻 DUEL READY:</span>
                                            <span style={{ color: '#fff' }}>{activeGhost.playerName} ({activeGhost.finalScore}m)</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                                        {SKINS.map(skin => {
                                            const { aura, tier } = getSkinAura(skin);
                                            const isSelected = selectedSkin.id === skin.id;
                                            const tierColor = tier === 'MYTHIC' ? '#ff0055' : (tier === 'LEGENDARY' ? '#ffd700' : '#a855f7');
                                            return (
                                                <button key={skin.id} onClick={() => { setSelectedSkin(skin); playBoop?.(); }}
                                                    style={{
                                                        position: 'relative',
                                                        background: isSelected ? `radial-gradient(circle, ${aura.glowColor} 0%, #1e293b 80%)` : '#0f172a',
                                                        border: isSelected ? `2px solid ${aura.primaryColor}` : '1px solid rgba(255,255,255,0.1)',
                                                        boxShadow: isSelected ? `0 0 14px ${aura.glowColor}` : 'none',
                                                        borderRadius: '12px', padding: '8px 4px', cursor: 'pointer',
                                                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                                                        transition: 'all 0.15s ease'
                                                    }}>
                                                    <span style={{
                                                        position: 'absolute', top: '3px', right: '3px',
                                                        background: tierColor, color: '#000', fontSize: '0.48rem', fontWeight: '900',
                                                        fontFamily: '"Orbitron", monospace', padding: '1px 3px', borderRadius: '3px'
                                                    }}>
                                                        {tier === 'MYTHIC' ? '★' : tier[0]}
                                                    </span>
                                                    <img src={skin.src} width="38" height="38" style={{ display: 'block', margin: '4px auto', filter: `drop-shadow(0 0 4px ${aura.primaryColor}88)` }} />
                                                    <div style={{ fontSize: '0.52rem', fontWeight: 'bold', color: aura.primaryColor, textTransform: 'uppercase' }}>
                                                        {aura.name.split(' ')[0]}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <SquishyButton onClick={initGame} style={{ padding: '20px 50px', background: '#333', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', border: 'none', borderRadius: '100px' }}>JUMP</SquishyButton>
                                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                        <span>CHECK BOOST SHOP FOR AURA TRAILS</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <p className="mobile-hide" style={{ color: '#888', marginTop: '20px', fontSize: '0.8rem' }}>Slide to Move • Classic Bounce & Boost • Ascension Bosses at 40,000m+</p>
            </div>

            <div className={`boost-shop ${isShopOpen ? 'open' : ''}`} style={{ width: '250px', height: '600px', background: '#1a1a1a', borderRadius: '20px', border: '2px solid #444', padding: '20px', flexDirection: 'column', color: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>BOOST SHOP</h2>
                    <span style={{ color: 'gold', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><path d="M14.5 9h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4.5"/><path d="M12 7v10"/></svg>
                        {coins || 0} CP
                    </span>
                </div>
                {STREAKS.map(streak => {
                    const isUnlocked = unlockedStreaks.includes(streak.id);
                    const isEquipped = selectedStreak.id === streak.id;
                    return (
                        <div key={streak.id} onClick={() => buyStreak(streak)} style={{ background: isEquipped ? '#333' : '#222', border: isEquipped ? '2px solid cyan' : (isUnlocked ? '1px solid #555' : '1px solid #333'), borderRadius: '10px', padding: '15px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s', opacity: isUnlocked ? 1 : 0.7 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{streak.name}</div>
                            {streak.gradient && (<div style={{ height: '10px', borderRadius: '5px', marginBottom: '10px', background: `linear-gradient(to right, ${streak.gradient.join(',')})` }} />)}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                {isUnlocked ? (<span style={{ color: 'cyan' }}>{isEquipped ? 'EQUIPPED' : 'TAP TO EQUIP'}</span>) : (<span style={{ color: 'gold' }}>${streak.price}</span>)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Link to="/arcade" className="mobile-hide" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, textDecoration: 'none' }}>
                <SquishyButton style={{ borderRadius: '50px', padding: '10px 22px', fontSize: '1rem', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>EXIT</span>
                </SquishyButton>
            </Link>
            <style>{`@media (max-width: 500px) { .mobile-hide { display: none !important; } }`}</style>
        </div>
    );
};

export default MerchJump;
