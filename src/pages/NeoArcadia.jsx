import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { getSkinAura } from '../config/SkinAuras';
import { drawCanvasAura, createAuraTrailParticle, updateAndRenderAuraParticles } from '../utils/skinAuraCanvas';
import { useToast } from '../context/ToastContext';

// City Map Dimensions
const MAP_WIDTH = 2200;
const MAP_HEIGHT = 1500;

// Districts Definition
const DISTRICTS = [
    { id: 'arcade', name: 'THE ARCADE STRIP', color: '#00f0ff', bounds: { minX: 0, maxX: 2200, minY: 0, maxY: 580 } },
    { id: 'syndicate', name: 'SYNDICATE PLAZA & LABS', color: '#ffd700', bounds: { minX: 0, maxX: 2200, minY: 580, maxY: 920 } },
    { id: 'casino', name: 'MIDNIGHT CASINO DISTRICT', color: '#ff0055', bounds: { minX: 0, maxX: 1550, minY: 920, maxY: 1500 } },
    { id: 'harbor', name: 'ABYSSAL HARBOR & DOCKS', color: '#00ffcc', bounds: { minX: 1550, maxX: 2200, minY: 920, maxY: 1500 } }
];

// Interactive City Landmarks
const LANDMARKS = [
    {
        id: 'bro-cannon',
        title: 'BRO CANNON TOWER',
        category: 'FLAGSHIP ARCADE',
        x: 440, y: 340, width: 170, height: 130,
        color: '#ff8800', glow: 'rgba(255, 136, 0, 0.45)', icon: '🚀',
        path: '/arcade/bro-cannon',
        desc: 'Sub-Orbital Ballistics & Sky Gliding'
    },
    {
        id: 'merch-jump',
        title: 'MERCH JUMP SPIRE',
        category: 'FLAGSHIP ARCADE',
        x: 880, y: 320, width: 160, height: 140,
        color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)', icon: '🦘',
        path: '/arcade/merch-jump',
        desc: 'Infinite Platform Ascent & Balloons'
    },
    {
        id: 'flappy',
        title: 'FLAPPY BRO SKYWAY',
        category: 'FLAGSHIP ARCADE',
        x: 1340, y: 340, width: 170, height: 130,
        color: '#ff007f', glow: 'rgba(255, 0, 127, 0.45)', icon: '🐦',
        path: '/arcade/flappy',
        desc: 'Precision Skyline Hazard Weaving'
    },
    {
        id: 'face-runner',
        title: 'FACE RUNNER HYPER-PORTAL',
        category: 'FLAGSHIP ARCADE',
        x: 1760, y: 340, width: 170, height: 130,
        color: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', icon: '⚡',
        path: '/arcade/face-runner',
        desc: '3D Cyber Tunnel Void Trials'
    },
    {
        id: 'syndicate-hq',
        title: 'GHOST DUEL SYNDICATE HQ',
        category: 'WORLD RECORDS',
        x: 1100, y: 730, width: 200, height: 140,
        color: '#ffd700', glow: 'rgba(255, 215, 0, 0.55)', icon: '👻',
        path: '/leaderboard?tab=duels',
        desc: 'Async World Records & 1-Click Duels'
    },
    {
        id: 'merch-defense',
        title: 'MERCH DEFENSE CITADEL',
        category: 'TACTICAL STRATEGY',
        x: 480, y: 730, width: 160, height: 130,
        color: '#00ff88', glow: 'rgba(0, 255, 136, 0.45)', icon: '🛡️',
        path: '/arcade/merch-defense',
        desc: 'Tactical Turret Grid Defense'
    },
    {
        id: 'merch-lab',
        title: 'MERCH LAB & WORKSHOP',
        category: 'SKIN CUSTOMIZER',
        x: 780, y: 740, width: 150, height: 120,
        color: '#ff3366', glow: 'rgba(255, 51, 102, 0.45)', icon: '🧵',
        path: '/merch-lab',
        desc: 'Design Customs & Unlock Drops'
    },
    {
        id: 'crypto-bank',
        title: 'CRYPTO TERMINAL',
        category: 'FINANCIAL EXCHANGE',
        x: 1460, y: 740, width: 150, height: 120,
        color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', icon: '🪙',
        path: '/exchange',
        desc: 'Live Bitcoin Market & CP Swaps'
    },
    {
        id: 'casino-slots',
        title: 'COSMIC SLOTS PALACE',
        category: 'CYBER CASINO',
        x: 450, y: 1180, width: 170, height: 130,
        color: '#ffd700', glow: 'rgba(255, 215, 0, 0.45)', icon: '🎰',
        path: '/arcade/slots',
        desc: 'Mega Multipliers & Jackpots'
    },
    {
        id: 'cyber-derby',
        title: 'CYBER DERBY RACEWAY',
        category: 'CYBER CASINO',
        x: 880, y: 1200, width: 170, height: 120,
        color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', icon: '🏇',
        path: '/arcade/derby',
        desc: 'Neon Thoroughbred Cyber Stakes'
    },
    {
        id: 'cyber-21',
        title: 'CYBER 21 & PLINKO CLUB',
        category: 'CYBER CASINO',
        x: 1300, y: 1180, width: 170, height: 130,
        color: '#ff0055', glow: 'rgba(255, 0, 85, 0.45)', icon: '🃏',
        path: '/arcade/cyber21',
        desc: 'High Stakes Blackjack & Gravity Plinko'
    },
    {
        id: 'crazy-fishing',
        title: 'ABYSSAL FISHING PIER',
        category: 'OCEANIC EXPEDITION',
        x: 1820, y: 1180, width: 170, height: 130,
        color: '#00ffff', glow: 'rgba(0, 255, 255, 0.45)', icon: '🎣',
        path: '/arcade/fishing',
        desc: 'Deep Mariana Trench Monster Fishing'
    }
];

// Secret Hidden Loot Chests in Back Alleys
const SECRET_CHESTS = [
    { id: 'chest_alley_cannon', x: 250, y: 280, reward: 150, name: 'Cannon Alley Cache' },
    { id: 'chest_spire_vent', x: 1040, y: 250, reward: 200, name: 'Spire AC Duct Stash' },
    { id: 'chest_syndicate_dumpster', x: 1280, y: 640, reward: 250, name: 'Syndicate High-Roller Safe' },
    { id: 'chest_harbor_pier', x: 2050, y: 1380, reward: 300, name: 'Abyssal Smuggler Drop' }
];

// Simulated Living City Citizens
const CITIZENS = [
    { id: 'c1', name: 'AstroPaul', skinId: 'face_astro', x: 580, y: 460, vx: 0.6, vy: 0, text: 'Heading to the Cannon! 🚀' },
    { id: 'c2', name: 'CyberBunny', skinId: 'face_bunny', x: 980, y: 470, vx: -0.4, vy: 0, text: 'Hit 1,200m in Merch Jump! 🦘' },
    { id: 'c3', name: 'DonDino', skinId: 'face_dino', x: 1150, y: 880, vx: 0.3, vy: 0.2, text: 'Ghost Syndicate bounty is +500 CP! 👻' },
    { id: 'c4', name: 'StarGamer', skinId: 'face_gamer', x: 1420, y: 460, vx: -0.5, vy: 0, text: 'Flappy Bro speed ramp is insane! 🐦' },
    { id: 'c5', name: 'NekoBro', skinId: 'face_cat', x: 1650, y: 1100, vx: 0.4, vy: -0.2, text: 'Hooked a 40kg Neon Tuna! 🎣' }
];

export const NeoArcadia = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const { userProfile, shopState, addCoins, coins, incrementStat } = useGamification() || {};
    const { playCoin, playClick, playJump, playWin, playFanfare, triggerHaptic } = useRetroSound();
    const { showToast } = useToast() || {};

    // Player State
    const playerRef = useRef({
        x: 1100,
        y: 600,
        vx: 0,
        vy: 0,
        speed: 4.8,
        sprintMultiplier: 1.45,
        isSprinting: false,
        facing: 'down',
        walkCycle: 0,
        footstepTimer: 0
    });

    const [currentDistrict, setCurrentDistrict] = useState(DISTRICTS[0]);
    const [nearbyLandmark, setNearbyLandmark] = useState(null);
    const [lootedChests, setLootedChests] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('mb_neo_arcadia_chests') || '[]');
        } catch {
            return [];
        }
    });

    // Touch joystick / Virtual controls
    const [touchTarget, setTouchTarget] = useState(null);
    const [isMinimapOpen, setIsMinimapOpen] = useState(false);

    // Camera
    const cameraRef = useRef({ x: 1100 - window.innerWidth / 2, y: 600 - window.innerHeight / 2 });
    const keysPressed = useRef({});
    const auraParticlesRef = useRef([]);

    // Skin Image Reference
    const skinImgRef = useRef(null);
    const citizenImgsRef = useRef({});

    const equippedSkinId = userProfile?.skinId || shopState?.equipped?.skin || 'face_default';
    const { aura } = getSkinAura(equippedSkinId);

    // Record Overworld Visit
    useEffect(() => {
        incrementStat?.('overworldVisits', 1);
    }, [incrementStat]);

    // Preload player skin
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        const src = equippedSkinId.startsWith('/') ? equippedSkinId : `/assets/skins/${equippedSkinId}.png`;
        img.src = src;
        skinImgRef.current = img;

        // Preload citizen avatars
        CITIZENS.forEach(c => {
            const cImg = new Image();
            cImg.crossOrigin = 'Anonymous';
            cImg.src = `/assets/skins/${c.skinId}.png`;
            citizenImgsRef.current[c.id] = cImg;
        });
    }, [equippedSkinId]);

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current[e.code] = true;
            if (e.code === 'KeyE' || e.code === 'Space') {
                if (nearbyLandmark) {
                    e.preventDefault();
                    enterLandmark(nearbyLandmark);
                }
            }
        };

        const handleKeyUp = (e) => {
            keysPressed.current[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [nearbyLandmark]);

    const enterLandmark = (lm) => {
        if (!lm) return;
        playWin?.();
        triggerHaptic?.([20, 30, 60]);
        navigate(lm.path);
    };

    // Canvas Tap to Walk
    const handleCanvasClick = (e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Map screen to world
        const worldX = clientX + cameraRef.current.x;
        const worldY = clientY + cameraRef.current.y;

        setTouchTarget({ x: Math.max(50, Math.min(MAP_WIDTH - 50, worldX)), y: Math.max(50, Math.min(MAP_HEIGHT - 50, worldY)) });
        playClick?.();
    };

    // Chest Interaction
    const handleLootChest = (chest) => {
        if (lootedChests.includes(chest.id)) return;

        const nextLooted = [...lootedChests, chest.id];
        setLootedChests(nextLooted);
        localStorage.setItem('mb_neo_arcadia_chests', JSON.stringify(nextLooted));

        if (addCoins) addCoins(chest.reward);
        incrementStat?.('chestsOpened', 1);
        playFanfare?.();
        triggerConfetti?.();
        triggerHaptic?.([30, 40, 80]);

        if (showToast) {
            showToast(`💎 Found ${chest.name}! +${chest.reward} CP`, 'success');
        }
    };

    // 60 FPS Game Loop
    useEffect(() => {
        let animationFrameId;

        const tick = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const p = playerRef.current;
            const keys = keysPressed.current;

            // 1. INPUT PROCESSING
            let dx = 0;
            let dy = 0;

            if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
            if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
            if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
            if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

            p.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);

            // Touch Target Lerp
            if (touchTarget) {
                const tdx = touchTarget.x - p.x;
                const tdy = touchTarget.y - p.y;
                const dist = Math.hypot(tdx, tdy);
                if (dist > 10) {
                    dx = tdx / dist;
                    dy = tdy / dist;
                } else {
                    setTouchTarget(null);
                }
            }

            // Normalize diagonal movement
            const moveLen = Math.hypot(dx, dy);
            if (moveLen > 0) {
                dx /= moveLen;
                dy /= moveLen;
                const currentSpd = p.speed * (p.isSprinting ? p.sprintMultiplier : 1.0);
                p.x += dx * currentSpd;
                p.y += dy * currentSpd;
                p.walkCycle += 0.22;

                // Facing direction
                if (Math.abs(dx) > Math.abs(dy)) {
                    p.facing = dx > 0 ? 'right' : 'left';
                } else {
                    p.facing = dy > 0 ? 'down' : 'up';
                }

                // Footstep particles & haptic tap
                p.footstepTimer += 1;
                if (p.footstepTimer >= 14) {
                    p.footstepTimer = 0;
                    playJump?.();
                    auraParticlesRef.current.push(createAuraTrailParticle(p.x, p.y + 12, equippedSkinId, {
                        vy: -0.4,
                        size: 2.5
                    }));
                }
            }

            // Clamp player to city map bounds
            p.x = Math.max(60, Math.min(MAP_WIDTH - 60, p.x));
            p.y = Math.max(60, Math.min(MAP_HEIGHT - 60, p.y));

            // Camera lerp towards player
            const targetCamX = p.x - canvas.width / 2;
            const targetCamY = p.y - canvas.height / 2;
            cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
            cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12;

            // Clamp camera to map bounds
            cameraRef.current.x = Math.max(0, Math.min(MAP_WIDTH - canvas.width, cameraRef.current.x));
            cameraRef.current.y = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, cameraRef.current.y));

            const camX = cameraRef.current.x;
            const camY = cameraRef.current.y;

            // Detect Current District
            const activeDist = DISTRICTS.find(d =>
                p.x >= d.bounds.minX && p.x <= d.bounds.maxX &&
                p.y >= d.bounds.minY && p.y <= d.bounds.maxY
            ) || DISTRICTS[0];
            if (activeDist.id !== currentDistrict.id) {
                setCurrentDistrict(activeDist);
            }

            // Proximity Check for Landmarks
            let closestLm = null;
            let closestDist = 95;
            LANDMARKS.forEach(lm => {
                const centerX = lm.x + lm.width / 2;
                const centerY = lm.y + lm.height / 2;
                const dist = Math.hypot(p.x - centerX, p.y - centerY);
                if (dist < closestDist) {
                    closestLm = lm;
                    closestDist = dist;
                }
            });
            setNearbyLandmark(closestLm);

            // Check Secret Chests Proximity
            SECRET_CHESTS.forEach(chest => {
                if (!lootedChests.includes(chest.id)) {
                    const dist = Math.hypot(p.x - chest.x, p.y - chest.y);
                    if (dist < 42) {
                        handleLootChest(chest);
                    }
                }
            });

            // --- 2. RENDER OVERWORLD CANVAS ---
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(-camX, -camY);

            // A. Base Cyber Asphalt Floor
            ctx.fillStyle = '#080c18';
            ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

            // B. Perspective Cyber Grid Street Grid
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x <= MAP_WIDTH; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, MAP_HEIGHT);
                ctx.stroke();
            }
            for (let y = 0; y <= MAP_HEIGHT; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(MAP_WIDTH, y);
                ctx.stroke();
            }

            // C. Main Cyber Boulevards (Wide Glowing Roadways)
            ctx.fillStyle = '#0c1222';
            // Cyber Avenue (top horizontal)
            ctx.fillRect(60, 480, MAP_WIDTH - 120, 100);
            // Neon Boulevard (mid horizontal)
            ctx.fillRect(60, 880, MAP_WIDTH - 120, 100);
            // Syndicate Way (central vertical)
            ctx.fillRect(1040, 60, 120, MAP_HEIGHT - 120);

            // Glowing Road Dividers
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.setLineDash([16, 16]);

            // Top road divider
            ctx.beginPath();
            ctx.moveTo(80, 530);
            ctx.lineTo(MAP_WIDTH - 80, 530);
            ctx.stroke();

            // Mid road divider
            ctx.beginPath();
            ctx.moveTo(80, 930);
            ctx.lineTo(MAP_WIDTH - 80, 930);
            ctx.stroke();

            // Vertical divider
            ctx.beginPath();
            ctx.moveTo(1100, 80);
            ctx.lineTo(1100, MAP_HEIGHT - 80);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.shadowBlur = 0;

            // D. Render Touch Destination Ring
            if (touchTarget) {
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(touchTarget.x, touchTarget.y, 16 + Math.sin(Date.now() / 150) * 4, 0, Math.PI * 2);
                ctx.stroke();
            }

            // E. Render Landmarks (Buildings / Arcade Machines)
            LANDMARKS.forEach(lm => {
                const isNear = closestLm && closestLm.id === lm.id;

                ctx.save();
                // Building Base
                ctx.fillStyle = isNear ? 'rgba(20, 32, 55, 0.95)' : 'rgba(12, 18, 34, 0.92)';
                ctx.strokeStyle = isNear ? lm.color : `${lm.color}88`;
                ctx.lineWidth = isNear ? 3 : 1.5;
                if (isNear) {
                    ctx.shadowColor = lm.color;
                    ctx.shadowBlur = 18;
                }

                ctx.beginPath();
                ctx.roundRect(lm.x, lm.y, lm.width, lm.height, 16);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Marquee Header
                ctx.fillStyle = `${lm.color}22`;
                ctx.fillRect(lm.x, lm.y, lm.width, 36);

                // Icon & Title
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${lm.icon} ${lm.title}`, lm.x + lm.width / 2, lm.y + 24);

                // Subtitle
                ctx.fillStyle = '#94a3b8';
                ctx.font = '9px monospace';
                ctx.fillText(lm.category, lm.x + lm.width / 2, lm.y + 58);

                // Neon Entrance Gate
                const gateW = 54;
                const gateH = 28;
                const gateX = lm.x + lm.width / 2 - gateW / 2;
                const gateY = lm.y + lm.height - gateH;

                ctx.fillStyle = isNear ? lm.color : 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(gateX, gateY, gateW, gateH);
                ctx.strokeStyle = lm.color;
                ctx.strokeRect(gateX, gateY, gateW, gateH);

                ctx.fillStyle = isNear ? '#000' : lm.color;
                ctx.font = 'bold 9px "Orbitron", monospace';
                ctx.fillText('ENTER', gateX + gateW / 2, gateY + 18);

                // Floating Near Marker Pulse
                if (isNear) {
                    ctx.fillStyle = '#ffd700';
                    ctx.font = 'bold 10px "Orbitron", sans-serif';
                    ctx.fillText('▼ PRESS [E] TO PLAY ▼', lm.x + lm.width / 2, lm.y - 12);
                }

                ctx.restore();
            });

            // F. Render Secret Loot Chests
            SECRET_CHESTS.forEach(chest => {
                const isLooted = lootedChests.includes(chest.id);
                ctx.save();
                ctx.translate(chest.x, chest.y);

                if (!isLooted) {
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 12;
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                    ctx.beginPath();
                    ctx.arc(0, 0, 18, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.font = '18px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🎁', 0, 0);

                    // Name badge
                    ctx.font = 'bold 8px monospace';
                    ctx.fillStyle = '#ffd700';
                    ctx.fillText('SECRET CHEST', 0, -22);
                } else {
                    ctx.font = '14px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('📦', 0, 0);
                }
                ctx.restore();
            });

            // G. Render Wandering Citizens (NPCs)
            CITIZENS.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                if (c.x < 100 || c.x > MAP_WIDTH - 100) c.vx *= -1;
                if (c.y < 100 || c.y > MAP_HEIGHT - 100) c.vy *= -1;

                ctx.save();
                ctx.translate(c.x, c.y);

                // Citizen Avatar
                const cImg = citizenImgsRef.current[c.id];
                if (cImg && cImg.complete) {
                    ctx.drawImage(cImg, -18, -18, 36, 36);
                } else {
                    ctx.fillStyle = '#00f0ff';
                    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
                }

                // Speech Bubble
                if (c.text) {
                    ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 1;
                    const bw = 140;
                    ctx.beginPath();
                    ctx.roundRect(-bw / 2, -44, bw, 20, 6);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#e2e8f0';
                    ctx.font = '9px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(c.text, 0, -30);
                }
                ctx.restore();
            });

            // H. Update and Render Aura Particles
            updateAndRenderAuraParticles(ctx, auraParticlesRef.current);

            // I. Render Player Character
            ctx.save();
            ctx.translate(p.x, p.y);

            // Ground Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(0, 18, 16, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Procedural Aura
            drawCanvasAura(ctx, 0, 0, 32, equippedSkinId, Date.now() * 0.05);

            // Squish-and-stretch walking animation
            const walkSquash = moveLen > 0 ? 1 + Math.sin(p.walkCycle) * 0.08 : 1;
            ctx.scale(p.facing === 'left' ? -1 : 1, walkSquash);

            // Draw Skin Image
            if (skinImgRef.current && skinImgRef.current.complete) {
                ctx.drawImage(skinImgRef.current, -22, -22, 44, 44);
            } else {
                ctx.fillStyle = aura.primaryColor;
                ctx.beginPath();
                ctx.arc(0, 0, 18, 0, Math.PI * 2);
                ctx.fill();
            }

            // Floating Player Name Tag
            ctx.scale(p.facing === 'left' ? -1 : 1, 1 / walkSquash);
            ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
            ctx.strokeStyle = aura.primaryColor;
            ctx.lineWidth = 1;
            const tagW = 74;
            ctx.beginPath();
            ctx.roundRect(-tagW / 2, -36, tagW, 16, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 8px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText((userProfile?.name || 'Bro').slice(0, 10), 0, -24);

            ctx.restore();

            ctx.restore(); // Undo camera translation

            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentDistrict, nearbyLandmark, touchTarget, lootedChests, equippedSkinId]);

    // Handle Window Resize
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            background: '#080c18',
            fontFamily: '"Orbitron", sans-serif',
            userSelect: 'none',
            touchAction: 'none'
        }}>
            {/* 60 FPS OVERWORLD CANVAS */}
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
            />

            {/* TOP BAR HUD */}
            <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                zIndex: 20
            }}>
                {/* Left: Return & District Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
                    <Link to="/arcade" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '30px',
                            padding: '8px 16px',
                            color: '#e2e8f0',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                            <span>ARCADE</span>
                        </div>
                    </Link>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(12px)',
                        border: `1.5px solid ${currentDistrict.color}`,
                        boxShadow: `0 0 15px ${currentDistrict.color}44`,
                        borderRadius: '30px',
                        padding: '8px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentDistrict.color, boxShadow: `0 0 8px ${currentDistrict.color}` }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#fff', letterSpacing: '1px' }}>
                            {currentDistrict.name}
                        </span>
                    </div>
                </div>

                {/* Right: CP & Minimap Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 215, 0, 0.35)',
                        borderRadius: '30px',
                        padding: '8px 16px',
                        color: '#ffd700',
                        fontSize: '0.85rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span>🪙</span>
                        <span>{(coins || 0).toLocaleString()} CP</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => { setIsMinimapOpen(!isMinimapOpen); playClick?.(); }}
                        style={{
                            background: isMinimapOpen ? '#00f0ff' : 'rgba(15, 23, 42, 0.85)',
                            color: isMinimapOpen ? '#000' : '#00f0ff',
                            border: '1.5px solid #00f0ff',
                            borderRadius: '30px',
                            padding: '8px 16px',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            fontFamily: '"Orbitron", sans-serif',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>🗺️</span>
                        <span>{isMinimapOpen ? 'CLOSE MAP' : 'CITY MAP'}</span>
                    </button>
                </div>
            </div>

            {/* INTERACTIVE BUILDING PROMPT BANNER */}
            <AnimatePresence>
                {nearbyLandmark && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(10, 15, 28, 0.98))',
                            border: `2px solid ${nearbyLandmark.color}`,
                            boxShadow: `0 0 30px ${nearbyLandmark.glow}`,
                            borderRadius: '24px',
                            padding: '16px 28px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            zIndex: 30,
                            maxWidth: '90vw'
                        }}
                    >
                        <div style={{ fontSize: '2.4rem' }}>{nearbyLandmark.icon}</div>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: nearbyLandmark.color, fontWeight: '900', letterSpacing: '1px' }}>
                                {nearbyLandmark.category}
                            </div>
                            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>
                                {nearbyLandmark.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                {nearbyLandmark.desc}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => enterLandmark(nearbyLandmark)}
                            style={{
                                background: `linear-gradient(135deg, ${nearbyLandmark.color}, #0072ff)`,
                                border: 'none',
                                color: '#000',
                                borderRadius: '14px',
                                padding: '12px 24px',
                                fontSize: '0.82rem',
                                fontWeight: '900',
                                fontFamily: '"Orbitron", sans-serif',
                                cursor: 'pointer',
                                boxShadow: `0 0 20px ${nearbyLandmark.color}88`,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span>ENTER [E]</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL CITY MINIMAP MODAL */}
            <AnimatePresence>
                {isMinimapOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            inset: '20px',
                            background: 'rgba(5, 8, 18, 0.96)',
                            backdropFilter: 'blur(16px)',
                            border: '2px solid #00f0ff',
                            boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
                            borderRadius: '24px',
                            padding: '24px',
                            zIndex: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#fff'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00f0ff' }}>NEO-ARCADIA FAST TRAVEL DIRECTORY</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    Click any landmark to teleport or warp directly to that game!
                                </p>
                            </div>
                            <button
                                onClick={() => setIsMinimapOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Landmarks Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '14px',
                            overflowY: 'auto',
                            paddingRight: '6px'
                        }}>
                            {LANDMARKS.map(lm => (
                                <div
                                    key={lm.id}
                                    onClick={() => {
                                        setIsMinimapOpen(false);
                                        enterLandmark(lm);
                                    }}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.8)',
                                        border: `1.5px solid ${lm.color}66`,
                                        borderRadius: '16px',
                                        padding: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = lm.color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${lm.color}66`; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{lm.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: lm.color }}>{lm.title}</div>
                                            <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>{lm.category}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                        {lm.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTROLS GUIDE (BOTTOM LEFT) */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(10, 15, 28, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '8px 14px',
                fontSize: '0.68rem',
                color: '#94a3b8',
                fontFamily: 'monospace',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span>WASD / ARROWS: WALK</span>
                <span>•</span>
                <span>SHIFT: SPRINT</span>
                <span>•</span>
                <span>CLICK / TAP: DESTINATION BEACON</span>
            </div>
        </div>
    );
};

export default NeoArcadia;
