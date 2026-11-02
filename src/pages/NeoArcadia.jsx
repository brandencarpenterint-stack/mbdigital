import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro, POCKET_BRO_STAGES } from '../context/PocketBroContext';
import useRetroSound from '../hooks/useRetroSound';
import { triggerConfetti } from '../utils/confetti';
import { getSkinAura } from '../config/SkinAuras';
import { drawCanvasAura, createAuraTrailParticle, updateAndRenderAuraParticles } from '../utils/skinAuraCanvas';
import { useToast } from '../context/ToastContext';
import {
    startCyberRadio,
    stopCyberRadio,
    setCyberRadioBPM,
    isCyberRadioPlaying,
    getCyberRadioBPM,
    subscribeBeat,
    getVisualizerEnergy
} from '../utils/cyberRadioSynth';

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

// Smashable Street Crates (Respawnable with CP Loot)
const INITIAL_STREET_CRATES = [
    { id: 'sc1', x: 740, y: 520, smashed: false, respawn: 0, reward: 25 },
    { id: 'sc2', x: 1220, y: 540, smashed: false, respawn: 0, reward: 30 },
    { id: 'sc3', x: 1600, y: 510, smashed: false, respawn: 0, reward: 20 },
    { id: 'sc4', x: 400, y: 920, smashed: false, respawn: 0, reward: 35 },
    { id: 'sc5', x: 800, y: 940, smashed: false, respawn: 0, reward: 25 },
    { id: 'sc6', x: 1350, y: 920, smashed: false, respawn: 0, reward: 30 },
    { id: 'sc7', x: 1800, y: 940, smashed: false, respawn: 0, reward: 40 },
    { id: 'sc8', x: 1080, y: 320, smashed: false, respawn: 0, reward: 20 },
    { id: 'sc9', x: 1120, y: 1150, smashed: false, respawn: 0, reward: 35 }
];

// Living City Citizens
const CITIZENS = [
    { id: 'c1', name: 'AstroPaul', skinId: 'face_astro', x: 580, y: 460, vx: 0.6, vy: 0, text: 'Heading to the Cannon! 🚀' },
    { id: 'c2', name: 'CyberBunny', skinId: 'face_bunny', x: 980, y: 470, vx: -0.4, vy: 0, text: 'Hit 1,200m in Merch Jump! 🦘' },
    { id: 'c3', name: 'DonDino', skinId: 'face_dino', x: 1150, y: 880, vx: 0.3, vy: 0.2, text: 'Ghost Syndicate bounty is +500 CP! 👻' },
    { id: 'c4', name: 'StarGamer', skinId: 'face_gamer', x: 1420, y: 460, vx: -0.5, vy: 0, text: 'Flappy Bro speed ramp is insane! 🐦' },
    { id: 'c5', name: 'NekoBro', skinId: 'face_cat', x: 1650, y: 1100, vx: 0.4, vy: -0.2, text: 'Hooked a 40kg Neon Tuna! 🎣' }
];

// Cyber Snacks Catalog for Companion
const CYBER_SNACKS = [
    {
        id: 'battery',
        name: 'Quantum Battery',
        cost: 20,
        desc: '+40 Energy, +15 Hunger, +25 XP',
        iconColor: '#00f0ff'
    },
    {
        id: 'donut',
        name: 'Glitch Donut',
        cost: 25,
        desc: '+40 Hunger, +35 Happy, +30 XP',
        iconColor: '#ec4899'
    },
    {
        id: 'crystal',
        name: 'CP Crystal',
        cost: 50,
        desc: '+50 Happy, +60 XP, Rainbow Aura',
        iconColor: '#ffd700'
    },
    {
        id: 'pepper',
        name: 'Overdrive Pepper',
        cost: 35,
        desc: '+35 Energy, +45 XP, Flame Boost',
        iconColor: '#ef4444'
    }
];

export const NeoArcadia = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const { userProfile, shopState, addCoins, spendCoins, coins, incrementStat } = useGamification() || {};
    const { stats: petStats, feedCyberSnack, awardArcadeXP, getCompanionPerks, play: playWithPet } = usePocketBro?.() || {};
    const { playCoin, playClick, playJump, playWin, playFanfare, playBoop, playCollect, playPowerUp, playExplosion, triggerHaptic } = useRetroSound();
    const { showToast } = useToast() || {};

    // Player & Cyber Vehicle State
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
        footstepTimer: 0,

        // Hover-Bike & Drift Vehicle Mode
        isMounted: false,
        vehicleAngle: 0,
        vehicleSpeed: 0,
        vehicleMaxSpeed: 9.8,
        vehicleAccel: 0.35,
        vehicleDecel: 0.95,
        isDrifting: false,
        isBoosting: false,
        boostFuel: 100,
        skidTrails: [],
        debrisParticles: []
    });

    const [isVehicleMounted, setIsVehicleMounted] = useState(false);
    const [boostFuelPercent, setBoostFuelPercent] = useState(100);
    const streetCratesRef = useRef([...INITIAL_STREET_CRATES]);

    // Companion State
    const companionRef = useRef({
        x: 1100 + 40,
        y: 600 + 25,
        targetX: 1100 + 40,
        targetY: 600 + 25,
        hoverAngle: 0,
        speech: '',
        speechTimer: 0,
        petHearts: [],
        radarPulse: 0,
        isSniffingChest: false,
        nearestChest: null,
        beatBounce: 0
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

    // Touch joystick / Virtual controls & Modals
    const [touchTarget, setTouchTarget] = useState(null);
    const [isMinimapOpen, setIsMinimapOpen] = useState(false);
    const [isCompanionDrawerOpen, setIsCompanionDrawerOpen] = useState(false);

    // Cyber Radio State
    const [radioPlaying, setRadioPlaying] = useState(false);
    const [radioBpm, setRadioBpm] = useState(128);
    const [visualizerBars, setVisualizerBars] = useState([8, 12, 16, 12, 8, 14]);

    // Cyber Beat Reflex Minigame State (Embedded in Companion Drawer)
    const [isReflexPlaying, setIsReflexPlaying] = useState(false);
    const [reflexTimeLeft, setReflexTimeLeft] = useState(15);
    const [reflexScore, setReflexScore] = useState(0);
    const [reflexCombo, setReflexCombo] = useState(1);
    const [reflexFeedback, setReflexFeedback] = useState('');
    const [beatPulseRing, setBeatPulseRing] = useState(1.0);

    // Camera
    const cameraRef = useRef({ x: 1100 - window.innerWidth / 2, y: 600 - window.innerHeight / 2 });
    const keysPressed = useRef({});
    const auraParticlesRef = useRef([]);

    // Skin Image Reference
    const skinImgRef = useRef(null);
    const citizenImgsRef = useRef({});

    const equippedSkinId = userProfile?.skinId || shopState?.equipped?.skin || 'face_default';
    const { aura } = getSkinAura(equippedSkinId);
    const companionPerks = getCompanionPerks ? getCompanionPerks() : {};

    // Record Overworld Visit
    useEffect(() => {
        incrementStat?.('overworldVisits', 1);
    }, [incrementStat]);

    // Preload player skin & citizens
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        const src = equippedSkinId.startsWith('/') ? equippedSkinId : `/assets/skins/${equippedSkinId}.png`;
        img.src = src;
        skinImgRef.current = img;

        CITIZENS.forEach(c => {
            const cImg = new Image();
            cImg.crossOrigin = 'Anonymous';
            cImg.src = `/assets/skins/${c.skinId}.png`;
            citizenImgsRef.current[c.id] = cImg;
        });
    }, [equippedSkinId]);

    // Cyber Radio Beat Subscription
    useEffect(() => {
        const unsubscribe = subscribeBeat(({ beat, bpm }) => {
            if (companionRef.current) {
                companionRef.current.beatBounce = 1.0;
            }
            if (playerRef.current && !playerRef.current.isMounted) {
                playerRef.current.walkCycle += 0.2;
            }
            setBeatPulseRing(1.8);
            setTimeout(() => setBeatPulseRing(1.0), 120);
        });

        const visInterval = setInterval(() => {
            const energy = getVisualizerEnergy ? getVisualizerEnergy() : 0.5;
            setVisualizerBars(prev => prev.map(() => Math.floor(4 + Math.random() * 16 * Math.max(0.3, energy))));
        }, 80);

        return () => {
            unsubscribe();
            clearInterval(visInterval);
            stopCyberRadio();
        };
    }, []);

    // Cyber Beat Reflex Game Timer
    useEffect(() => {
        if (!isReflexPlaying) return;

        const timer = setInterval(() => {
            setReflexTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsReflexPlaying(false);
                    const totalCoins = Math.floor(reflexScore * 0.5) + 50;
                    const totalXP = Math.floor(reflexScore * 1.5) + 75;
                    if (addCoins) addCoins(totalCoins);
                    if (awardArcadeXP) awardArcadeXP('beat_reflex', totalXP);
                    triggerConfetti?.();
                    playFanfare?.();
                    showToast?.(`Reflex Session Complete! +${totalXP} Pet XP, +${totalCoins} CP`, 'success');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isReflexPlaying, reflexScore, addCoins, awardArcadeXP, playFanfare, showToast]);

    // Mount / Dismount Cyber Hover-Bike
    const toggleVehicleMount = useCallback(() => {
        const p = playerRef.current;
        const comp = companionRef.current;
        p.isMounted = !p.isMounted;
        setIsVehicleMounted(p.isMounted);

        if (p.isMounted) {
            p.vehicleAngle = p.facing === 'right' ? 0 : p.facing === 'down' ? Math.PI / 2 : p.facing === 'left' ? Math.PI : -Math.PI / 2;
            p.vehicleSpeed = 0;
            playPowerUp?.();
            triggerHaptic?.([30, 50]);
            comp.speech = '🏎️ VROOOM! LET\'S DRIFT, BRO!';
            comp.speechTimer = 200;
            comp.beatBounce = 1.4;
            if (showToast) showToast('Mounted Cyber Hover-Bike! [SPACE] Nitro • [H] Horn', 'success');
        } else {
            p.vehicleSpeed = 0;
            playBoop?.();
            triggerHaptic?.([20]);
            comp.speech = '🚶 Exploring on foot!';
            comp.speechTimer = 160;
        }
    }, [playPowerUp, playBoop, triggerHaptic, showToast]);

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current[e.code] = true;

            // Vehicle Mount / Dismount
            if (e.code === 'KeyV') {
                e.preventDefault();
                toggleVehicleMount();
                return;
            }

            // Horn Key on Vehicle
            if (e.code === 'KeyH' && playerRef.current.isMounted) {
                e.preventDefault();
                playBoop?.();
                if (companionRef.current) {
                    companionRef.current.speech = '📢 *BEEP BEEP!* GET OUT THE WAY!';
                    companionRef.current.speechTimer = 140;
                }
                return;
            }

            // Landmark Enter on foot or bike
            if (e.code === 'KeyE' || (!playerRef.current.isMounted && e.code === 'Space')) {
                if (nearbyLandmark) {
                    e.preventDefault();
                    enterLandmark(nearbyLandmark);
                }
            }

            // Companion Hub
            if (e.code === 'KeyP') {
                setIsCompanionDrawerOpen(prev => !prev);
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
    }, [nearbyLandmark, toggleVehicleMount, playBoop]);

    const enterLandmark = (lm) => {
        if (!lm) return;
        playWin?.();
        triggerHaptic?.([20, 30, 60]);
        navigate(lm.path);
    };

    // Toggle Cyber Radio
    const handleToggleRadio = () => {
        if (radioPlaying) {
            stopCyberRadio();
            setRadioPlaying(false);
        } else {
            startCyberRadio(radioBpm);
            setRadioPlaying(true);
            playBoop?.();
        }
    };

    const handleSelectBpm = (bpm) => {
        setRadioBpm(bpm);
        setCyberRadioBPM(bpm);
        if (!radioPlaying) {
            startCyberRadio(bpm);
            setRadioPlaying(true);
        }
        playClick?.();
    };

    // Canvas Tap to Walk / Companion Pet Interaction
    const handleCanvasClick = (e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const worldX = clientX + cameraRef.current.x;
        const worldY = clientY + cameraRef.current.y;

        // Check if player clicked directly on the companion
        const comp = companionRef.current;
        const distToComp = Math.hypot(worldX - comp.x, worldY - comp.y);
        if (distToComp < 44) {
            comp.speech = '❤️ *PURRR!* LOVE YA, BRO!';
            comp.speechTimer = 180;
            comp.beatBounce = 1.3;
            for (let i = 0; i < 6; i++) {
                comp.petHearts.push({
                    x: comp.x,
                    y: comp.y - 12,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: -1.8 - Math.random() * 2,
                    alpha: 1.0,
                    size: 14 + Math.random() * 6
                });
            }
            playBoop?.();
            playWithPet?.();
            setIsCompanionDrawerOpen(true);
            return;
        }

        // Tap Destination Beacon
        setTouchTarget({ x: Math.max(50, Math.min(MAP_WIDTH - 50, worldX)), y: Math.max(50, Math.min(MAP_HEIGHT - 50, worldY)) });
        playClick?.();
    };

    // Feeding Cyber Snack to Companion
    const handleFeedSnack = (snack) => {
        if (spendCoins && !spendCoins(snack.cost)) {
            showToast?.('Insufficient CP! Earn more CP in arcade runs.', 'error');
            return;
        }
        if (feedCyberSnack) {
            const fed = feedCyberSnack(snack.id);
            triggerConfetti?.();
            playPowerUp?.();
            showToast?.(`Fed ${fed.name}! +${fed.xp} Pet XP`, 'success');

            const comp = companionRef.current;
            if (comp) {
                comp.speech = `😋 YUM! ${fed.name.toUpperCase()}! ⚡`;
                comp.speechTimer = 180;
                comp.beatBounce = 1.5;
            }
        }
    };

    // Handle Tap on Beat in Reflex Game
    const handleReflexTap = () => {
        if (!isReflexPlaying) return;

        const diff = Math.abs(beatPulseRing - 1.0);
        if (diff < 0.35) {
            setReflexFeedback('PERFECT! +50 XP');
            setReflexScore(prev => prev + 50 * reflexCombo);
            setReflexCombo(prev => Math.min(8, prev + 1));
            playPowerUp?.();
        } else if (diff < 0.65) {
            setReflexFeedback('GREAT! +25 XP');
            setReflexScore(prev => prev + 25);
            setReflexCombo(prev => Math.min(8, prev + 1));
            playCollect?.();
        } else {
            setReflexFeedback('EARLY/LATE!');
            setReflexCombo(1);
            playBoop?.();
        }

        setTimeout(() => setReflexFeedback(''), 400);
    };

    const startReflexMinigame = () => {
        setIsReflexPlaying(true);
        setReflexTimeLeft(15);
        setReflexScore(0);
        setReflexCombo(1);
        setReflexFeedback('');
        if (!radioPlaying) {
            startCyberRadio(radioBpm);
            setRadioPlaying(true);
        }
        playClick?.();
    };

    // Chest Interaction
    const handleLootChest = (chest) => {
        if (lootedChests.includes(chest.id)) return;

        const nextLooted = [...lootedChests, chest.id];
        setLootedChests(nextLooted);
        localStorage.setItem('mb_neo_arcadia_chests', JSON.stringify(nextLooted));

        const multiplier = companionPerks?.coinMultiplier || 1.0;
        const finalReward = Math.round(chest.reward * multiplier);

        if (addCoins) addCoins(finalReward);
        incrementStat?.('chestsOpened', 1);
        playFanfare?.();
        triggerConfetti?.();
        triggerHaptic?.([30, 40, 80]);

        if (companionRef.current) {
            companionRef.current.speech = `🎉 CHEST OPENED! +${finalReward} CP!`;
            companionRef.current.speechTimer = 220;
        }

        if (showToast) {
            showToast(`💎 Found ${chest.name}! +${finalReward} CP`, 'success');
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
            const comp = companionRef.current;
            const keys = keysPressed.current;
            const crates = streetCratesRef.current;

            // --- 1. MOVEMENT & VEHICLE PHYSICS ---
            if (p.isMounted) {
                // VEHICLE DRIFT & DRIVE MODE
                let steer = 0;
                if (keys['KeyA'] || keys['ArrowLeft']) steer -= 1;
                if (keys['KeyD'] || keys['ArrowRight']) steer += 1;

                let accel = 0;
                if (keys['KeyW'] || keys['ArrowUp']) accel += 1;
                if (keys['KeyS'] || keys['ArrowDown']) accel -= 1;

                // Nitro Boost
                p.isBoosting = !!(keys['Space'] && p.boostFuel > 4 && accel > 0);
                if (p.isBoosting) {
                    p.boostFuel = Math.max(0, p.boostFuel - 0.9);
                } else {
                    p.boostFuel = Math.min(100, p.boostFuel + 0.35);
                }
                setBoostFuelPercent(Math.round(p.boostFuel));

                // Drifting Check
                p.isDrifting = (keys['ShiftLeft'] || keys['ShiftRight'] || Math.abs(steer) > 0) && Math.abs(p.vehicleSpeed) > 4.5 && steer !== 0;

                const turnRate = p.isDrifting ? 0.088 : 0.052;
                if (Math.abs(p.vehicleSpeed) > 0.2) {
                    p.vehicleAngle += steer * turnRate * (p.vehicleSpeed > 0 ? 1 : -1);
                }

                // Speed calculation
                const currentMaxSpd = p.vehicleMaxSpeed * (p.isBoosting ? 1.48 : 1.0);
                if (accel > 0) {
                    p.vehicleSpeed = Math.min(currentMaxSpd, p.vehicleSpeed + p.vehicleAccel * (p.isBoosting ? 1.8 : 1.0));
                } else if (accel < 0) {
                    p.vehicleSpeed = Math.max(-3.5, p.vehicleSpeed - p.vehicleAccel * 0.8);
                } else {
                    p.vehicleSpeed *= p.vehicleDecel;
                    if (Math.abs(p.vehicleSpeed) < 0.05) p.vehicleSpeed = 0;
                }

                // Apply velocity
                p.vx = Math.cos(p.vehicleAngle) * p.vehicleSpeed;
                p.vy = Math.sin(p.vehicleAngle) * p.vehicleSpeed;
                p.x += p.vx;
                p.y += p.vy;

                // Facing direction for landmarks
                if (Math.abs(p.vx) > Math.abs(p.vy)) {
                    p.facing = p.vx > 0 ? 'right' : 'left';
                } else {
                    p.facing = p.vy > 0 ? 'down' : 'up';
                }

                // Drifting Skid Trails
                if (p.isDrifting && Math.random() < 0.65) {
                    const skidOffsetX = Math.cos(p.vehicleAngle + Math.PI / 2) * 12;
                    const skidOffsetY = Math.sin(p.vehicleAngle + Math.PI / 2) * 12;
                    p.skidTrails.push({
                        x1: p.x - Math.cos(p.vehicleAngle) * 16 + skidOffsetX,
                        y1: p.y - Math.sin(p.vehicleAngle) * 16 + skidOffsetY,
                        x2: p.x - Math.cos(p.vehicleAngle) * 22 + skidOffsetX,
                        y2: p.y - Math.sin(p.vehicleAngle) * 22 + skidOffsetY,
                        alpha: 0.85
                    });
                    p.skidTrails.push({
                        x1: p.x - Math.cos(p.vehicleAngle) * 16 - skidOffsetX,
                        y1: p.y - Math.sin(p.vehicleAngle) * 16 - skidOffsetY,
                        x2: p.x - Math.cos(p.vehicleAngle) * 22 - skidOffsetX,
                        y2: p.y - Math.sin(p.vehicleAngle) * 22 - skidOffsetY,
                        alpha: 0.85
                    });
                    if (p.skidTrails.length > 70) p.skidTrails.splice(0, 10);
                }

                // Companion locks seamlessly into the sidecar pod!
                const sidecarDist = 28;
                const sidecarAngle = p.vehicleAngle + Math.PI / 2;
                comp.x = p.x + Math.cos(sidecarAngle) * sidecarDist - Math.cos(p.vehicleAngle) * 2;
                comp.y = p.y + Math.sin(sidecarAngle) * sidecarDist - Math.sin(p.vehicleAngle) * 2;
                comp.hoverAngle += 0.08;

                if (p.isBoosting && Math.random() < 0.04) {
                    comp.speech = '🔥 SPEED OVERLOAD!! ⚡';
                    comp.speechTimer = 60;
                }
            } else {
                // FOOT ON-FOOT MOVEMENT
                let dx = 0;
                let dy = 0;

                if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
                if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
                if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
                if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

                p.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);

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

                const moveLen = Math.hypot(dx, dy);
                if (moveLen > 0) {
                    dx /= moveLen;
                    dy /= moveLen;
                    const currentSpd = p.speed * (p.isSprinting ? p.sprintMultiplier : 1.0);
                    p.x += dx * currentSpd;
                    p.y += dy * currentSpd;
                    p.walkCycle += 0.22;

                    if (Math.abs(dx) > Math.abs(dy)) {
                        p.facing = dx > 0 ? 'right' : 'left';
                    } else {
                        p.facing = dy > 0 ? 'down' : 'up';
                    }

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

                // Companion spring-damper trail logic on foot
                let compOffsetX = -44;
                let compOffsetY = 14;
                if (p.facing === 'right') { compOffsetX = -46; compOffsetY = 12; }
                else if (p.facing === 'left') { compOffsetX = 46; compOffsetY = 12; }
                else if (p.facing === 'up') { compOffsetX = 24; compOffsetY = 44; }
                else if (p.facing === 'down') { compOffsetX = -24; compOffsetY = -44; }

                const targetCompX = p.x + compOffsetX;
                const targetCompY = p.y + compOffsetY;
                comp.x += (targetCompX - comp.x) * 0.12;
                comp.y += (targetCompY - comp.y) * 0.12;
                comp.hoverAngle += 0.05;
            }

            if (comp.beatBounce > 0) comp.beatBounce *= 0.88;

            // Clamp player to city map bounds
            p.x = Math.max(60, Math.min(MAP_WIDTH - 60, p.x));
            p.y = Math.max(60, Math.min(MAP_HEIGHT - 60, p.y));

            // Camera lerp towards player
            const targetCamX = p.x - canvas.width / 2;
            const targetCamY = p.y - canvas.height / 2;
            cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
            cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12;

            cameraRef.current.x = Math.max(0, Math.min(MAP_WIDTH - canvas.width, cameraRef.current.x));
            cameraRef.current.y = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, cameraRef.current.y));

            const camX = cameraRef.current.x;
            const camY = cameraRef.current.y;

            // --- CRATE RAMMING PHYSICS ---
            crates.forEach(crate => {
                if (crate.smashed) {
                    crate.respawn--;
                    if (crate.respawn <= 0) crate.smashed = false;
                    return;
                }

                const dist = Math.hypot(p.x - crate.x, p.y - crate.y);
                if (dist < 34 && p.isMounted && Math.abs(p.vehicleSpeed) > 3.0) {
                    crate.smashed = true;
                    crate.respawn = 1600; // ~26s respawn
                    const reward = crate.reward;
                    if (addCoins) addCoins(reward);
                    playExplosion?.();
                    playCoin?.();
                    triggerHaptic?.([40, 60]);

                    for (let i = 0; i < 9; i++) {
                        p.debrisParticles.push({
                            x: crate.x,
                            y: crate.y,
                            vx: (Math.random() - 0.5) * 8 + p.vx * 0.4,
                            vy: (Math.random() - 0.5) * 8 + p.vy * 0.4,
                            size: 3 + Math.random() * 4,
                            alpha: 1.0,
                            color: Math.random() > 0.5 ? '#00f0ff' : '#ffd700'
                        });
                    }

                    if (showToast) showToast(`💥 Rammed Street Crate! +${reward} CP`, 'success');
                    comp.speech = `💥 SMASH! +${reward} CP!`;
                    comp.speechTimer = 160;
                }
            });

            // Curiosity Radar detector for secret loot chests
            let nearestUnlootedChest = null;
            let nearestDist = 9999;
            SECRET_CHESTS.forEach(chest => {
                if (!lootedChests.includes(chest.id)) {
                    const dist = Math.hypot(comp.x - chest.x, comp.y - chest.y);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        nearestUnlootedChest = chest;
                    }
                }
            });

            if (nearestUnlootedChest && nearestDist < 240) {
                comp.isSniffingChest = true;
                comp.nearestChest = nearestUnlootedChest;
                comp.radarPulse = (comp.radarPulse + 0.04) % 1;
                if (comp.speechTimer <= 0) {
                    comp.speech = `‼️ SNIFF SNIFF! ${nearestUnlootedChest.name.toUpperCase()} DETECTED! 💎`;
                    comp.speechTimer = 220;
                    playCollect?.();
                }
            } else {
                comp.isSniffingChest = false;
                comp.nearestChest = null;
                if (comp.speechTimer > 0) {
                    comp.speechTimer--;
                    if (comp.speechTimer === 0) comp.speech = '';
                } else if (Math.random() < 0.002) {
                    const phrases = [
                        '⚡ Exploring Neo-Arcadia!',
                        '❤️ Best buds!',
                        '🎵 Loving these Cyber Radio beats!',
                        '👾 Click me for Cyber Snacks & Reflex!',
                        '🏎️ Press [V] to drift the Cyber-Bike!'
                    ];
                    comp.speech = phrases[Math.floor(Math.random() * phrases.length)];
                    comp.speechTimer = 160;
                }
            }

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

            // Check Secret Chests Proximity to Player
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

            // C. Main Cyber Boulevards
            ctx.fillStyle = '#0c1222';
            ctx.fillRect(60, 480, MAP_WIDTH - 120, 100);
            ctx.fillRect(60, 880, MAP_WIDTH - 120, 100);
            ctx.fillRect(1040, 60, 120, MAP_HEIGHT - 120);

            // Glowing Road Dividers
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.setLineDash([16, 16]);

            ctx.beginPath();
            ctx.moveTo(80, 530);
            ctx.lineTo(MAP_WIDTH - 80, 530);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(80, 930);
            ctx.lineTo(MAP_WIDTH - 80, 930);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(1100, 80);
            ctx.lineTo(1100, MAP_HEIGHT - 80);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.shadowBlur = 0;

            // D. Render Drifting Skid Marks
            if (p.skidTrails && p.skidTrails.length > 0) {
                for (let i = p.skidTrails.length - 1; i >= 0; i--) {
                    const s = p.skidTrails[i];
                    ctx.strokeStyle = `rgba(0, 240, 255, ${s.alpha * 0.7})`;
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(s.x1, s.y1);
                    ctx.lineTo(s.x2, s.y2);
                    ctx.stroke();
                    s.alpha -= 0.007;
                    if (s.alpha <= 0) p.skidTrails.splice(i, 1);
                }
            }

            // E. Render Touch Destination Ring
            if (touchTarget) {
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(touchTarget.x, touchTarget.y, 16 + Math.sin(Date.now() / 150) * 4, 0, Math.PI * 2);
                ctx.stroke();
            }

            // F. Render Landmarks
            LANDMARKS.forEach(lm => {
                const isNear = closestLm && closestLm.id === lm.id;

                ctx.save();
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

                // Entrance Gate
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

                if (isNear) {
                    ctx.fillStyle = '#ffd700';
                    ctx.font = 'bold 10px "Orbitron", sans-serif';
                    ctx.fillText('▼ PRESS [E] TO PLAY ▼', lm.x + lm.width / 2, lm.y - 12);
                }

                ctx.restore();
            });

            // G. Render Smashable Street Crates
            crates.forEach(crate => {
                if (crate.smashed) return;
                ctx.save();
                ctx.translate(crate.x, crate.y);
                ctx.fillStyle = '#1e1b4b';
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 1.5;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 8;
                ctx.beginPath(); ctx.roundRect(-12, -12, 24, 24, 4); ctx.fill(); ctx.stroke();

                ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                ctx.beginPath();
                ctx.moveTo(-8, -8); ctx.lineTo(8, 8);
                ctx.moveTo(8, -8); ctx.lineTo(-8, 8);
                ctx.stroke();

                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 8px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('CP', 0, 0);
                ctx.restore();
            });

            // H. Render Debris Particles from smashed crates
            if (p.debrisParticles && p.debrisParticles.length > 0) {
                for (let i = p.debrisParticles.length - 1; i >= 0; i--) {
                    const d = p.debrisParticles[i];
                    d.x += d.vx;
                    d.y += d.vy;
                    d.vx *= 0.95;
                    d.vy *= 0.95;
                    d.alpha -= 0.025;
                    if (d.alpha <= 0) {
                        p.debrisParticles.splice(i, 1);
                    } else {
                        ctx.fillStyle = d.color;
                        ctx.globalAlpha = d.alpha;
                        ctx.fillRect(d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
                        ctx.globalAlpha = 1.0;
                    }
                }
            }

            // I. Render Secret Loot Chests
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

            // J. Render Living Citizens (NPCs)
            CITIZENS.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                if (c.x < 100 || c.x > MAP_WIDTH - 100) c.vx *= -1;
                if (c.y < 100 || c.y > MAP_HEIGHT - 100) c.vy *= -1;

                ctx.save();
                ctx.translate(c.x, c.y);

                const cImg = citizenImgsRef.current[c.id];
                if (cImg && cImg.complete) {
                    ctx.drawImage(cImg, -18, -18, 36, 36);
                } else {
                    ctx.fillStyle = '#00f0ff';
                    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
                }

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

            // K. Update and Render Aura Particles
            updateAndRenderAuraParticles(ctx, auraParticlesRef.current);

            // L. RENDER PLAYER (ON FOOT OR IN CYBER HOVER-BIKE)
            if (p.isMounted) {
                // --- CYBER HOVER-BIKE & SIDECAR RENDERING ---
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.vehicleAngle);

                // Shadows
                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                ctx.beginPath();
                ctx.ellipse(-8, 16, 16, 7, 0, 0, Math.PI * 2);
                ctx.ellipse(14, 16, 12, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Twin Thruster Plasma Flames
                if (Math.abs(p.vehicleSpeed) > 0.5 || p.isBoosting) {
                    const flameLen = p.isBoosting ? 28 + Math.random() * 12 : 12 + Math.random() * 6;
                    ctx.fillStyle = p.isBoosting ? '#a855f7' : '#00f0ff';
                    ctx.shadowColor = p.isBoosting ? '#a855f7' : '#00f0ff';
                    ctx.shadowBlur = 14;

                    ctx.beginPath();
                    ctx.moveTo(-22, -6); ctx.lineTo(-22 - flameLen, 0); ctx.lineTo(-22, 6);
                    ctx.closePath(); ctx.fill();

                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(-22, -3); ctx.lineTo(-22 - flameLen * 0.6, 0); ctx.lineTo(-22, 3);
                    ctx.closePath(); ctx.fill();
                    ctx.shadowBlur = 0;
                }

                // Connecting Strut to Sidecar
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-6, 4); ctx.lineTo(-6, 26);
                ctx.moveTo(8, 4); ctx.lineTo(8, 26);
                ctx.stroke();

                // Sidecar Pod (Right side)
                ctx.save();
                ctx.translate(0, 26);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.beginPath(); ctx.ellipse(0, 14, 16, 7, 0, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#0f172a';
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(-16, -10, 32, 20, 8);
                ctx.fill(); ctx.stroke();

                // Windshield
                ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
                ctx.beginPath();
                ctx.roundRect(4, -8, 8, 16, 4);
                ctx.fill();
                ctx.restore();

                // Main Bike Chassis
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(-20, -9, 40, 18, 6);
                ctx.fill(); ctx.stroke();

                // Aerodynamic Nose
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.moveTo(20, -8); ctx.lineTo(28, 0); ctx.lineTo(20, 8);
                ctx.closePath(); ctx.fill(); ctx.stroke();

                // Headlight Beam
                ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
                ctx.beginPath();
                ctx.moveTo(28, 0); ctx.lineTo(100, -32); ctx.lineTo(100, 32);
                ctx.closePath(); ctx.fill();

                // Handlebars
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(10, -12); ctx.lineTo(10, 12);
                ctx.stroke();

                // Mascot Seated on Bike
                if (skinImgRef.current && skinImgRef.current.complete) {
                    ctx.save();
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(skinImgRef.current, -14, -14, 28, 28);
                    ctx.restore();
                } else {
                    ctx.fillStyle = '#00f0ff';
                    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
                }

                ctx.restore();
            } else {
                // --- ON-FOOT MASCOT RENDERING ---
                ctx.save();
                ctx.translate(p.x, p.y);

                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                ctx.beginPath();
                ctx.ellipse(0, 18, 16, 8, 0, 0, Math.PI * 2);
                ctx.fill();

                drawCanvasAura(ctx, 0, 0, 32, equippedSkinId, Date.now() * 0.05);

                const walkSquash = Math.hypot(p.vx, p.vy) > 0 ? 1 + Math.sin(p.walkCycle) * 0.08 : 1;
                ctx.scale(p.facing === 'left' ? -1 : 1, walkSquash);

                if (skinImgRef.current && skinImgRef.current.complete) {
                    ctx.drawImage(skinImgRef.current, -22, -22, 44, 44);
                } else {
                    ctx.fillStyle = aura.primaryColor;
                    ctx.beginPath();
                    ctx.arc(0, 0, 18, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Name tag
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
            }

            // M. RENDER OVERWORLD WALKING/SIDECAR COMPANION & RADAR
            const hoverY = comp.y + Math.sin(comp.hoverAngle) * 5 - comp.beatBounce * 8;

            // Sonar Radar Waves towards nearest unlooted chest
            if (comp.isSniffingChest && comp.nearestChest) {
                const angle = Math.atan2(comp.nearestChest.y - comp.y, comp.nearestChest.x - comp.x);
                ctx.save();
                for (let ring = 0; ring < 3; ring++) {
                    const r = 20 + ((comp.radarPulse + ring * 0.33) % 1) * 60;
                    const alpha = Math.max(0, 1 - (r - 20) / 60);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
                    ctx.lineWidth = 2.5;
                    ctx.shadowColor = '#00f0ff';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(comp.x, comp.y, r, angle - 0.45, angle + 0.45);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Companion Ground Shadow (when on foot)
            if (!p.isMounted) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.beginPath();
                ctx.ellipse(comp.x, comp.y + 16, 12, 6, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Render Companion Creature based on Stage & Type
            const stageKey = petStats?.stage || 'EGG';
            const typeKey = petStats?.type || 'SOOT';
            const petColor = petStats?.color || '#00f0ff';

            ctx.save();
            ctx.translate(comp.x, hoverY);

            if (stageKey === 'EGG') {
                ctx.shadowColor = petColor;
                ctx.shadowBlur = 14;
                ctx.fillStyle = petColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(-4, -6, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(5, 4, 2, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath(); ctx.ellipse(-5, -7, 4, 8, -0.4, 0, Math.PI * 2); ctx.fill();
            } else if (typeKey.includes('SLIME')) {
                const squish = 1 + Math.sin(comp.hoverAngle * 2) * 0.08;
                ctx.scale(1 / squish, squish);
                ctx.shadowColor = petColor;
                ctx.shadowBlur = 14;
                ctx.fillStyle = petColor;
                ctx.beginPath();
                ctx.roundRect(-16, -14, 32, 28, [16, 16, 8, 8]);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#000';
                ctx.beginPath(); ctx.arc(-6, -2, 2.5, 0, Math.PI * 2); ctx.arc(6, -2, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(-7, -3, 1, 0, Math.PI * 2); ctx.arc(5, -3, 1, 0, Math.PI * 2); ctx.fill();

                if (typeKey === 'KING_SLIME') {
                    ctx.fillStyle = '#ffd700';
                    ctx.beginPath();
                    ctx.moveTo(-8, -14); ctx.lineTo(-12, -22); ctx.lineTo(-4, -17);
                    ctx.lineTo(0, -24); ctx.lineTo(4, -17); ctx.lineTo(12, -22); ctx.lineTo(8, -14);
                    ctx.closePath(); ctx.fill();
                }
            } else if (typeKey.includes('ROBOT') || typeKey.includes('MECH')) {
                ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 10;
                ctx.fillRect(-10, 12, 6, 8 + Math.random() * 5);
                ctx.fillRect(4, 12, 6, 8 + Math.random() * 5);

                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = petColor;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(-15, -14, 30, 26, 6); ctx.fill(); ctx.stroke();

                ctx.fillStyle = petColor;
                ctx.beginPath(); ctx.roundRect(-10, -5, 20, 6, 2); ctx.fill();

                ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -22); ctx.stroke();
                ctx.fillStyle = '#ff0055';
                ctx.beginPath(); ctx.arc(0, -23, 2.5, 0, Math.PI * 2); ctx.fill();
            } else if (typeKey.includes('DRAGON') || typeKey.includes('DINO')) {
                ctx.shadowColor = petColor;
                ctx.shadowBlur = 14;
                const wingFlap = Math.sin(comp.hoverAngle * 3) * 0.3;
                ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';

                ctx.save(); ctx.rotate(-wingFlap);
                ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(-24, -16); ctx.lineTo(-14, 6); ctx.closePath(); ctx.fill();
                ctx.restore();

                ctx.save(); ctx.rotate(wingFlap);
                ctx.beginPath(); ctx.moveTo(12, -2); ctx.lineTo(24, -16); ctx.lineTo(14, 6); ctx.closePath(); ctx.fill();
                ctx.restore();

                ctx.fillStyle = petColor;
                ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#ffd700';
                ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(0, -24); ctx.lineTo(4, -14); ctx.closePath(); ctx.fill();

                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(-5, -2, 3.5, 0, Math.PI * 2); ctx.arc(5, -2, 3.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#1e1b4b';
                ctx.beginPath(); ctx.arc(-5, -2, 2, 0, Math.PI * 2); ctx.arc(5, -2, 2, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.shadowColor = petColor;
                ctx.shadowBlur = 14;
                ctx.fillStyle = petColor;
                ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(-5, -2, 3, 0, Math.PI * 2); ctx.arc(5, -2, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#00f0ff';
                ctx.beginPath(); ctx.arc(-5, -2, 1.5, 0, Math.PI * 2); ctx.arc(5, -2, 1.5, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(255, 100, 150, 0.4)';
                ctx.beginPath(); ctx.arc(-8, 3, 2.5, 0, Math.PI * 2); ctx.arc(8, 3, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            // Cute Pilot Goggles on Companion when Mounted in Sidecar!
            if (p.isMounted) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 1.8;
                ctx.strokeRect(-9, -6, 7, 6);
                ctx.strokeRect(2, -6, 7, 6);
                ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
                ctx.fillRect(-8, -5, 5, 4);
                ctx.fillRect(3, -5, 5, 4);
                ctx.beginPath();
                ctx.moveTo(-12, -3); ctx.lineTo(12, -3);
                ctx.stroke();
            }

            ctx.restore();

            // Companion Name Badge
            ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
            ctx.strokeStyle = petColor;
            ctx.lineWidth = 1;
            const cTagW = 82;
            ctx.beginPath();
            ctx.roundRect(comp.x - cTagW / 2, hoverY - 32, cTagW, 14, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#00f0ff';
            ctx.font = 'bold 7px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            const stageLabel = POCKET_BRO_STAGES[stageKey]?.name || 'Egg';
            ctx.fillText(`${stageLabel} • ${typeKey}`.slice(0, 14), comp.x, hoverY - 22);

            // Companion Emoji Speech Bubble
            if (comp.speech) {
                ctx.save();
                ctx.font = 'bold 10px sans-serif';
                const textWidth = ctx.measureText(comp.speech).width;
                const bubbleW = textWidth + 18;
                const bubbleH = 24;
                const bubbleX = comp.x - bubbleW / 2;
                const bubbleY = hoverY - 60;

                ctx.fillStyle = 'rgba(10, 15, 30, 0.95)';
                ctx.strokeStyle = comp.isSniffingChest ? '#ffd700' : '#00f0ff';
                ctx.lineWidth = 1.5;
                if (comp.isSniffingChest) {
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 10;
                }

                ctx.beginPath();
                ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(comp.x - 4, bubbleY + bubbleH);
                ctx.lineTo(comp.x, bubbleY + bubbleH + 6);
                ctx.lineTo(comp.x + 4, bubbleY + bubbleH);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = comp.isSniffingChest ? '#ffd700' : '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(comp.speech, comp.x, bubbleY + bubbleH / 2);
                ctx.restore();
            }

            // Update & Render Companion Pet Hearts
            if (comp.petHearts && comp.petHearts.length > 0) {
                for (let i = comp.petHearts.length - 1; i >= 0; i--) {
                    const h = comp.petHearts[i];
                    h.x += h.vx;
                    h.y += h.vy;
                    h.alpha -= 0.025;
                    if (h.alpha <= 0) {
                        comp.petHearts.splice(i, 1);
                    } else {
                        ctx.save();
                        ctx.globalAlpha = h.alpha;
                        ctx.font = `${Math.round(h.size)}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('❤️', h.x, h.y);
                        ctx.restore();
                    }
                }
            }

            ctx.restore(); // Undo camera translation

            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentDistrict, nearbyLandmark, touchTarget, lootedChests, equippedSkinId, petStats, companionPerks]);

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

    const petStageData = POCKET_BRO_STAGES[petStats?.stage || 'EGG'] || POCKET_BRO_STAGES.EGG;
    const petXp = petStats?.xp || 0;
    const petHunger = Math.round(petStats?.hunger ?? 80);
    const petHappy = Math.round(petStats?.happy ?? 80);
    const petEnergy = Math.round(petStats?.energy ?? 80);

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

                {/* Right: Cyber Bike Mount, Cyber Radio, Companion Hub, CP & Minimap */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* CYBER HOVER-BIKE MOUNT BUTTON & NITRO GAUGE */}
                    <button
                        type="button"
                        onClick={toggleVehicleMount}
                        style={{
                            background: isVehicleMounted ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(0, 240, 255, 0.3))' : 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: isVehicleMounted ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: isVehicleMounted ? '0 0 18px rgba(0, 240, 255, 0.4)' : 'none',
                            borderRadius: '30px',
                            padding: '6px 14px',
                            color: isVehicleMounted ? '#00f0ff' : '#e2e8f0',
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            fontFamily: '"Orbitron", sans-serif',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="5" cy="18" r="3" />
                            <circle cx="19" cy="18" r="3" />
                            <path d="M12 18V9l4-4h4" />
                            <path d="M5 18l5-9h4l-2 5" />
                        </svg>
                        <span>{isVehicleMounted ? 'DISMOUNT [V]' : 'CYBER BIKE [V]'}</span>
                        {isVehicleMounted && (
                            <span style={{ fontSize: '0.65rem', color: '#ffd700' }}>
                                {boostFuelPercent}% ⚡
                            </span>
                        )}
                    </button>

                    {/* CYBER RADIO PROCEDURAL SYNTH ENGINE DOCK */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0, 240, 255, 0.35)',
                        borderRadius: '30px',
                        padding: '6px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 16px rgba(0, 240, 255, 0.15)'
                    }}>
                        <button
                            type="button"
                            onClick={handleToggleRadio}
                            title={radioPlaying ? 'Pause Cyber Radio' : 'Play Procedural Cyber Radio'}
                            style={{
                                background: radioPlaying ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                                color: radioPlaying ? '#000' : '#00f0ff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {radioPlaying ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px', padding: '0 2px' }}>
                            {visualizerBars.map((height, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '3px',
                                        height: radioPlaying ? `${height}px` : '4px',
                                        background: radioPlaying ? '#00f0ff' : 'rgba(255, 255, 255, 0.25)',
                                        borderRadius: '1px',
                                        transition: 'height 0.08s ease'
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {[100, 128, 140].map((bpm) => (
                                <button
                                    key={bpm}
                                    type="button"
                                    onClick={() => handleSelectBpm(bpm)}
                                    style={{
                                        background: radioBpm === bpm && radioPlaying ? 'rgba(0, 240, 255, 0.25)' : 'transparent',
                                        color: radioBpm === bpm && radioPlaying ? '#00f0ff' : '#94a3b8',
                                        border: radioBpm === bpm && radioPlaying ? '1px solid #00f0ff' : '1px solid transparent',
                                        borderRadius: '12px',
                                        padding: '2px 6px',
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {bpm}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* POCKET COMPANION QUICK HUB BUTTON */}
                    <button
                        type="button"
                        onClick={() => { setIsCompanionDrawerOpen(true); playClick?.(); }}
                        style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1.5px solid #a855f7',
                            boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)',
                            borderRadius: '30px',
                            padding: '6px 14px',
                            color: '#e2e8f0',
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            fontFamily: '"Orbitron", sans-serif',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><circle cx="9" cy="10" r="1.5" fill="#a855f7" /><circle cx="15" cy="10" r="1.5" fill="#a855f7" /><path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5" /></svg>
                        <span>{petStageData.name.toUpperCase()}</span>
                        <span style={{ fontSize: '0.68rem', color: '#ffd700' }}>{petHappy}% ❤️</span>
                    </button>

                    {/* CP Balance */}
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

                    {/* City Map Fast Travel Toggle */}
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
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

            {/* POCKET BRO COMPANION CYBER DRAWER / HUB MODAL */}
            <AnimatePresence>
                {isCompanionDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.96 }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            bottom: '20px',
                            right: '20px',
                            width: '390px',
                            maxWidth: 'calc(100vw - 40px)',
                            background: 'rgba(7, 11, 24, 0.96)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid #a855f7',
                            boxShadow: '0 0 40px rgba(168, 85, 247, 0.35)',
                            borderRadius: '24px',
                            padding: '22px',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#fff',
                            overflowY: 'auto'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.68rem', color: '#a855f7', fontWeight: '900', letterSpacing: '1px' }}>
                                    OVERWORLD WALKING COMPANION
                                </div>
                                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', color: '#fff' }}>
                                    {petStats?.name || 'POCKET BRO'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCompanionDrawerOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Companion Status & Evolution Card */}
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.75)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.6rem' }}>{petStageData.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#a855f7' }}>
                                            {petStageData.name.toUpperCase()} ({petStats?.type || 'SOOT'})
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                            XP: {petXp.toLocaleString()} Total
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    background: companionPerks?.coinMultiplier > 1 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                    color: companionPerks?.coinMultiplier > 1 ? '#00ff88' : '#94a3b8',
                                    border: `1px solid ${companionPerks?.coinMultiplier > 1 ? '#00ff88' : 'rgba(255,255,255,0.2)'}`,
                                    borderRadius: '20px',
                                    padding: '3px 8px',
                                    fontSize: '0.65rem',
                                    fontWeight: '900'
                                }}>
                                    {companionPerks?.coinMultiplier > 1 ? '+25% CP BUFF' : 'NORMAL CP'}
                                </span>
                            </div>

                            {/* Vitals Meters */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                                        <span>HUNGER</span>
                                        <span style={{ color: petHunger > 50 ? '#00ff88' : '#ef4444' }}>{petHunger}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${petHunger}%`, height: '100%', background: '#00ff88', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                                        <span>HAPPINESS</span>
                                        <span style={{ color: petHappy > 50 ? '#ffd700' : '#ef4444' }}>{petHappy}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${petHappy}%`, height: '100%', background: '#ffd700', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                                        <span>ENERGY</span>
                                        <span style={{ color: petEnergy > 50 ? '#00f0ff' : '#ef4444' }}>{petEnergy}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${petEnergy}%`, height: '100%', background: '#00f0ff', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CYBER-SNACK BAR */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#00f0ff', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                FEED CYBER-SNACKS (LEVEL UP & HEAL)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {CYBER_SNACKS.map(snack => (
                                    <button
                                        key={snack.id}
                                        type="button"
                                        onClick={() => handleFeedSnack(snack)}
                                        style={{
                                            background: 'rgba(15, 23, 42, 0.8)',
                                            border: `1.5px solid ${snack.iconColor}55`,
                                            borderRadius: '12px',
                                            padding: '10px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = snack.iconColor; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${snack.iconColor}55`; }}
                                    >
                                        <div style={{ fontSize: '0.78rem', fontWeight: '900', color: snack.iconColor }}>
                                            {snack.name}
                                        </div>
                                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace', margin: '3px 0' }}>
                                            {snack.desc}
                                        </div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: '900', color: '#ffd700' }}>
                                            🪙 {snack.cost} CP
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CYBER BEAT REFLEX RHYTHM MINIGAME */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(0, 240, 255, 0.1))',
                            border: '1.5px solid #a855f7',
                            borderRadius: '16px',
                            padding: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#ffd700', marginBottom: '4px' }}>
                                CYBER BEAT REFLEX RHYTHM TRIAL
                            </div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                Tap on beat with procedural synthwave tracks to earn Pet XP and CP jackpots!
                            </p>

                            {!isReflexPlaying ? (
                                <button
                                    type="button"
                                    onClick={startReflexMinigame}
                                    style={{
                                        background: 'linear-gradient(135deg, #a855f7, #00f0ff)',
                                        border: 'none',
                                        color: '#000',
                                        borderRadius: '12px',
                                        padding: '10px 20px',
                                        fontSize: '0.78rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", sans-serif',
                                        cursor: 'pointer',
                                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
                                    }}
                                >
                                    START 15S REFLEX TRIAL
                                </button>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '900', marginBottom: '8px' }}>
                                        <span style={{ color: '#00f0ff' }}>TIME: {reflexTimeLeft}s</span>
                                        <span style={{ color: '#ffd700' }}>SCORE: {reflexScore}</span>
                                        <span style={{ color: '#a855f7' }}>COMBO: x{reflexCombo}</span>
                                    </div>

                                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '10px auto' }}>
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '50%',
                                            border: '2px solid #00f0ff',
                                            transform: `scale(${beatPulseRing})`,
                                            transition: 'transform 0.12s linear',
                                            opacity: beatPulseRing > 1 ? 0.7 : 0.2
                                        }} />
                                        <button
                                            type="button"
                                            onClick={handleReflexTap}
                                            style={{
                                                position: 'absolute',
                                                inset: '10px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #a855f7, #00f0ff)',
                                                border: '2px solid #fff',
                                                color: '#000',
                                                fontSize: '0.75rem',
                                                fontWeight: '900',
                                                fontFamily: '"Orbitron", sans-serif',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            TAP BEAT!
                                        </button>
                                    </div>

                                    {reflexFeedback && (
                                        <div style={{ fontSize: '0.85rem', fontWeight: '900', color: reflexFeedback.includes('PERFECT') ? '#ffd700' : '#00f0ff' }}>
                                            {reflexFeedback}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL CITY MINIMAP FAST TRAVEL DIRECTORY */}
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
                                type="button"
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
                <span>WASD / ARROWS: DRIVE/WALK</span>
                <span>•</span>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>[V]: HOVER-BIKE</span>
                <span>•</span>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>[SPACE]: NITRO / DRIFT</span>
                <span>•</span>
                <span>[H]: HORN</span>
                <span>•</span>
                <span>[P]: COMPANION</span>
            </div>
        </div>
    );
};

export default NeoArcadia;
