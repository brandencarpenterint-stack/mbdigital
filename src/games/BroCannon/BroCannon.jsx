import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';
import { triggerConfetti } from '../../utils/confetti';
import { feedService } from '../../utils/feed';
import { getSkinAura } from '../../config/SkinAuras';
import GhostDuelHUD from '../../components/GhostDuelHUD';
import ShareDuelModal from '../../components/ShareDuelModal';
import {
    getGhostDuelFromUrl,
    interpolateGhostPosition,
    savePersonalBestGhost
} from '../../utils/ghostDuelCodec';

const GRAVITY = 0.24;
const GROUND_LEVEL = 60;

// ALL 25 PROTECTED SKINS WITH MYTHIC AURAS
const SKINS = [
    { id: 'face_default', name: 'OG BRO', src: '/assets/skins/face_default.png' },
    { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png' },
    { id: 'face_astro', name: 'ASTRO', src: '/assets/skins/face_astro.png' },
    { id: 'face_space', name: 'COSMIC', src: '/assets/skins/face_space.png' },
    { id: 'face_space_dark', name: 'OBSIDIAN', src: '/assets/skins/face_space_dark.jpg' },
    { id: 'face_gamer', name: 'GAMER', src: '/assets/skins/face_gamer.png' },
    { id: 'face_star', name: 'STAR', src: '/assets/skins/face_star.png' },
    { id: 'face_star_dark', name: 'DARK STAR', src: '/assets/skins/face_star_dark.jpg' },
    { id: 'face_dino', name: 'DINO', src: '/assets/skins/face_dino.png' },
    { id: 'face_dino_dark', name: 'DARK DINO', src: '/assets/skins/face_dino_dark.jpg' },
    { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png' },
    { id: 'face_cat', name: 'NEKO', src: '/assets/skins/face_cat.png' },
    { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png' },
    { id: 'face_bunny_hoodie', name: 'STREET BUNNY', src: '/assets/skins/face_bunny_hoodie.png' },
    { id: 'face_bunny_blue', name: 'CYAN BUNNY', src: '/assets/skins/face_bunny_blue.png' },
    { id: 'face_frog', name: 'PEPE', src: '/assets/skins/face_frog.png' },
    { id: 'face_pumpkin', name: 'SPOOKY', src: '/assets/skins/face_pumpkin.png' },
    { id: 'face_rainbow', name: 'PRISM', src: '/assets/skins/face_rainbow.png' },
    { id: 'face_hoodie', name: 'HYPE HOODIE', src: '/assets/skins/face_hoodie.png' },
    { id: 'face_hoodie_brown', name: 'BRONZE HOODIE', src: '/assets/skins/face_hoodie_brown.png' },
    { id: 'face_skater', name: 'SKATER', src: '/assets/skins/face_skater.jpg' },
    { id: 'face_standard_bw', name: 'MONOCHROME', src: '/assets/skins/face_standard_bw.png' },
    { id: 'jump_guy', name: 'JUMPER', src: '/assets/skins/jump_guy.png' },
    { id: 'logo_main', name: 'FOUNDER LOGO', src: '/assets/skins/logo_main.png' },
    { id: 'logo_typography', name: 'CYBER LOGO', src: '/assets/skins/logo_typography.png' },
];

const UPGRADE_BASE_COSTS = {
    power: 20,
    fuel: 25,
    thrust: 30,
    aero: 35,
    bounce: 25,
    magnet: 40
};

const BroCannon = () => {
    const navigate = useNavigate();
    const { playJump, playBoop, playCollect, playCrash, playWin, playShoot, playCannonBlast } = useRetroSound();
    const { coins, spendCoins, addCoins, stats, updateStat, userProfile } = useGamification();

    const [gameState, setGameState] = useState('MENU');
    const gameStateRef = useRef('MENU');

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(0);
    const [distance, setDistance] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [coinsEarned, setCoinsEarned] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [maxFuel, setMaxFuel] = useState(100);
    const [isBoosting, setIsBoosting] = useState(false);
    const isBoostingRef = useRef(false);

    const particlesRef = useRef([]);
    const shakeRef = useRef(0);
    const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

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

    const [upgrades, setUpgrades] = useState(() => {
        return stats?.broCannonUpgrades || {
            power: 1, fuel: 1, thrust: 1, aero: 1, bounce: 1, magnet: 1
        };
    });

    useEffect(() => {
        const capacity = 60 + upgrades.fuel * 40;
        setMaxFuel(capacity);
        setFuel(capacity);
    }, [upgrades.fuel]);

    const physics = useRef({
        x: 0, y: GROUND_LEVEL, vx: 0, vy: 0, rot: 0, lastTime: 0
    });
    const cameraRef = useRef({ x: -100, y: 0 });
    const raFrame = useRef();
    const itemsRef = useRef([]);
    const [visibleItems, setVisibleItems] = useState([]);

    const generateWorld = () => {
        const newItems = [];
        for (let x = 250; x < 150000; x += Math.random() * 80 + 40) {
            const rand = Math.random();
            let type = 'COIN';
            let y = Math.random() * 1200 + 40;

            if (rand < 0.15) {
                type = 'BOOST';
            } else if (rand < 0.28) {
                type = 'FUEL';
            } else if (rand < 0.38) {
                type = 'TRAMPOLINE';
                y = Math.min(y, 180);
            } else if (rand < 0.44) {
                type = 'UFO';
                y = Math.random() * 2000 + 800;
            } else if (rand < 0.55) {
                type = 'DIAMOND';
            } else {
                type = 'COIN';
            }

            newItems.push({ id: x, x, y, type, active: true });
        }
        itemsRef.current = newItems;
    };

    useEffect(() => {
        generateWorld();
        return () => cancelAnimationFrame(raFrame.current);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (gameStateRef.current === 'FLYING') {
                    isBoostingRef.current = true;
                    setIsBoosting(true);
                } else if (gameStateRef.current === 'AIM' || gameStateRef.current === 'POWER') {
                    interact();
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                isBoostingRef.current = false;
                setIsBoosting(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    useEffect(() => {
        let timer;
        if (gameState === 'AIM') {
            let dir = 1;
            timer = setInterval(() => {
                setAngle(a => {
                    if (a >= 80) dir = -1;
                    if (a <= 15) dir = 1;
                    return a + dir * 1.8;
                });
            }, 16);
        } else if (gameState === 'POWER') {
            let dir = 1;
            timer = setInterval(() => {
                setPower(p => {
                    if (p >= 100) dir = -1;
                    if (p <= 0) dir = 1;
                    return p + dir * 2.5;
                });
            }, 16);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    const spawnParticles = (x, y, count = 10, color = 'white', speed = 8, extra = {}) => {
        for (let i = 0; i < count; i++) {
            particlesRef.current.push({
                x, y,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                life: 1.0,
                color,
                ...extra
            });
        }
    };

    const tick = (timestamp) => {
        if (gameStateRef.current !== 'FLYING') return;

        if (timestamp) {
            if (!physics.current.lastTime) physics.current.lastTime = timestamp;
            const delta = timestamp - physics.current.lastTime;
            if (delta < 14) {
                raFrame.current = requestAnimationFrame(tick);
                return;
            }
            physics.current.lastTime = timestamp - (delta % 14);
        }

        const p = physics.current;
        const drag = 0.993 + (upgrades.aero * 0.001);

        if (isBoostingRef.current && fuel > 0) {
            const thrustForce = 0.55 + (upgrades.thrust * 0.15);
            p.vx += thrustForce * 0.8;
            p.vy += thrustForce * 1.1;
            setFuel(f => Math.max(0, f - 0.6));
            spawnParticles(p.x - 20, p.y - 10, 3, Math.random() > 0.5 ? '#ff5500' : '#ffcc00', 4);
            if (Math.random() > 0.6) playShoot();
        }

        // Procedural Skin Aura Particle Emission
        const activeAura = getSkinAura(selectedSkin).aura;
        if (Math.random() > 0.45) {
            let pColor = Math.random() > 0.5 ? activeAura.primaryColor : activeAura.secondaryColor;
            let extraData = {};
            if (activeAura.id === 'VOID_MATRIX') {
                extraData = { char: Math.random() > 0.5 ? '1' : '0', size: 10 };
            } else if (activeAura.id === 'CYBER_GLITCH') {
                extraData = { shape: 'slice', size: 12 };
            } else if (activeAura.id === 'SOLAR_FLARE') {
                extraData = { vyBoost: Math.random() * 2 + 1, size: 5 };
            } else if (activeAura.id === 'PRISM_NOVA') {
                extraData = { shape: 'sparkle', size: 6 };
            }
            particlesRef.current.push({
                x: p.x - 22 + (Math.random() - 0.5) * 8,
                y: p.y + (Math.random() - 0.5) * 8,
                vx: -p.vx * 0.15 + (Math.random() - 0.5) * 2,
                vy: (extraData.vyBoost || 0) + (Math.random() - 0.5) * 2,
                life: 1.0,
                decay: 0.035,
                color: pColor,
                ...extraData
            });
        }

        p.vx *= drag;
        p.vy -= GRAVITY;

        p.x += p.vx;
        p.y += p.vy;

        const targetRot = (Math.atan2(p.vy, p.vx) * 180) / Math.PI;
        p.rot += (targetRot - p.rot) * 0.15;

        const magnetRange = 40 + (upgrades.magnet * 30);

        itemsRef.current.forEach(item => {
            if (!item.active) return;
            const dx = item.x - p.x;
            const dy = item.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < magnetRange && (item.type === 'COIN' || item.type === 'DIAMOND' || item.type === 'FUEL')) {
                item.x -= (dx / dist) * 8;
                item.y -= (dy / dist) * 8;
            }

            if (dist < 45) {
                item.active = false;
                if (item.type === 'BOOST') {
                    p.vx += 22; p.vy += 18;
                    playCollect();
                    spawnParticles(item.x, item.y, 16, '#00ffff', 12);
                    shakeRef.current = 12;
                } else if (item.type === 'FUEL') {
                    const refill = maxFuel * 0.4;
                    setFuel(f => Math.min(maxFuel, f + refill));
                    playCollect();
                    spawnParticles(item.x, item.y, 12, '#ffcc00', 8);
                } else if (item.type === 'TRAMPOLINE') {
                    p.vy = Math.max(Math.abs(p.vy) * 1.4, 25);
                    p.vx += 10;
                    playJump();
                    spawnParticles(item.x, item.y, 15, '#ff00ff', 10);
                    shakeRef.current = 8;
                } else if (item.type === 'UFO') {
                    p.vy += 35; p.vx += 15;
                    playWin();
                    spawnParticles(item.x, item.y, 25, '#76ff03', 15);
                    shakeRef.current = 15;
                } else if (item.type === 'DIAMOND') {
                    setCoinsEarned(c => c + 25);
                    addCoins(25);
                    playWin();
                    spawnParticles(item.x, item.y, 10, '#00e5ff', 8);
                } else {
                    setCoinsEarned(c => c + 5);
                    addCoins(5);
                    playCollect();
                    spawnParticles(item.x, item.y, 6, '#ffd700', 6);
                }
            }
        });

        if (p.y <= GROUND_LEVEL) {
            p.y = GROUND_LEVEL;
            if (Math.abs(p.vy) > 1.8 || Math.abs(p.vx) > 2) {
                const bounceFactor = 0.58 + (upgrades.bounce * 0.06);
                p.vy = Math.abs(p.vy) * bounceFactor;
                p.vx *= 0.82;
                playCrash();
                spawnParticles(p.x, p.y, 8, '#76ff03', 6);
                if (Math.abs(p.vy) > 8) shakeRef.current = 6;
            } else {
                finishRun();
                return;
            }
        }

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const pt = particlesRef.current[i];
            pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.04;
            if (pt.life <= 0) particlesRef.current.splice(i, 1);
        }

        if (shakeRef.current > 0) shakeRef.current *= 0.88;
        if (shakeRef.current < 0.5) shakeRef.current = 0;

        const currentDist = Math.floor(p.x / 10);
        const currentAlt = Math.floor(Math.max(0, p.y - GROUND_LEVEL) / 5);

        // --- GHOST DUEL SAMPLING & PLAYBACK ---
        const now = performance.now();
        const elapsed = now - runStartTimeRef.current;
        if (!lastSampleTimeRef.current || now - lastSampleTimeRef.current >= 150) {
            runKeyframesRef.current.push({
                t: Math.round(elapsed),
                x: currentDist,
                y: currentAlt,
                score: currentDist
            });
            lastSampleTimeRef.current = now;
        }

        if (activeGhost) {
            const gPos = interpolateGhostPosition(activeGhost, elapsed);
            if (gPos) setGhostPos(gPos);
        }
        setDistance(currentDist);
        setAltitude(currentAlt);

        const targetX = p.x - 180;
        const targetY = Math.max(0, p.y - 320);
        cameraRef.current.x += (targetX - cameraRef.current.x) * 0.12;
        cameraRef.current.y += (targetY - cameraRef.current.y) * 0.12;

        setVisibleItems(
            itemsRef.current.filter(i =>
                i.active &&
                i.x > cameraRef.current.x - 150 &&
                i.x < cameraRef.current.x + 1200
            )
        );

        raFrame.current = requestAnimationFrame(tick);
    };

    const interact = () => {
        if (gameState === 'AIM') {
            playBoop();
            setGameState('POWER');
        } else if (gameState === 'POWER') {
            const rad = (angle * Math.PI) / 180;
            const force = (power * 0.55) + 18 + (upgrades.power * 3);

            physics.current = {
                x: 0,
                y: GROUND_LEVEL + 40,
                vx: Math.cos(rad) * force,
                vy: Math.sin(rad) * force,
                rot: angle,
                lastTime: 0
            };

            playCannonBlast();
            shakeRef.current = 20;
            spawnParticles(0, GROUND_LEVEL + 40, 30, '#ff9100', 14);

            setGameState('FLYING');
            gameStateRef.current = 'FLYING';
            runStartTimeRef.current = performance.now();
            runKeyframesRef.current = [];
            lastSampleTimeRef.current = 0;
            setGhostPos(null);
            setDuelWon(null);
            raFrame.current = requestAnimationFrame(tick);
        } else if (gameState === 'FLYING') {
            isBoostingRef.current = true;
            setIsBoosting(true);
            setTimeout(() => {
                isBoostingRef.current = false;
                setIsBoosting(false);
            }, 300);
        }
    };

    const finishRun = () => {
        setGameState('LANDED');
        gameStateRef.current = 'LANDED';
        cancelAnimationFrame(raFrame.current);

        const finalDist = Math.floor(physics.current.x / 10);
        const flightCoins = Math.floor(finalDist / 8);

        setCoinsEarned(flightCoins);
        addCoins(flightCoins);

        const best = stats?.broCannonHighScore || 0;
        // Finalize Ghost Run for Sharing
        const completedGhost = {
            gameId: 'bro-cannon',
            playerName: userProfile?.name || 'Pilot',
            skinId: selectedSkin.id,
            finalScore: finalDist,
            keyframes: runKeyframesRef.current
        };
        setLastFinishedRun(completedGhost);
        savePersonalBestGhost('bro-cannon', completedGhost);

        // Check Duel Status
        if (activeGhost) {
            const won = finalDist > (activeGhost.finalScore || 0);
            setDuelWon(won);
            if (won && addCoins) {
                addCoins(250); // Winner bounty bonus!
            }
        }

        if (finalDist > best) {
            updateStat('broCannonHighScore', finalDist);
            triggerConfetti();
            playWin();
            const playerName = userProfile?.name || 'Player';
            feedService.publish(`launched a record ${finalDist}m in Bro Cannon!`, 'win', playerName);
        }
    };

    const resetGame = () => {
        setAngle(45);
        setPower(0);
        setDistance(0);
        setAltitude(0);
        setCoinsEarned(0);
        setFuel(maxFuel);
        setGameState('AIM');
        gameStateRef.current = 'AIM';
        physics.current = { x: 0, y: GROUND_LEVEL, vx: 0, vy: 0, rot: 0, lastTime: 0 };
        cameraRef.current = { x: -100, y: 0 };
        itemsRef.current.forEach(i => (i.active = true));
        particlesRef.current = [];
    };

    const goToMenu = () => {
        setGameState('MENU');
        gameStateRef.current = 'MENU';
        resetGame();
    };

    const buyUpgrade = (key) => {
        const lvl = upgrades[key];
        const cost = UPGRADE_BASE_COSTS[key] * lvl;

        if (spendCoins(cost)) {
            playCollect();
            const next = { ...upgrades, [key]: lvl + 1 };
            setUpgrades(next);
            updateStat('broCannonUpgrades', next);
        } else {
            playCrash();
        }
    };

    const altRatio = Math.min(1, altitude / 2500);
    let skyGradient;
    if (altRatio < 0.25) {
        skyGradient = 'linear-gradient(to top, #64b5f6 0%, #1976d2 100%)';
    } else if (altRatio < 0.55) {
        skyGradient = 'linear-gradient(to top, #ffb74d 0%, #7b1fa2 100%)';
    } else if (altRatio < 0.85) {
        skyGradient = 'linear-gradient(to top, #4a148c 0%, #0d001a 100%)';
    } else {
        skyGradient = 'radial-gradient(ellipse at bottom, #1b003a 0%, #02000a 100%)';
    }

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: skyGradient,
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'none',
                fontFamily: '"Orbitron", monospace',
                color: 'white',
                userSelect: 'none'
            }}
            onMouseDown={() => {
                if (gameState === 'FLYING') {
                    isBoostingRef.current = true;
                    setIsBoosting(true);
                }
            }}
            onMouseUp={() => {
                if (gameState === 'FLYING') {
                    isBoostingRef.current = false;
                    setIsBoosting(false);
                }
            }}
            onTouchStart={() => {
                if (gameState === 'FLYING') {
                    isBoostingRef.current = true;
                    setIsBoosting(true);
                }
            }}
            onTouchEnd={() => {
                if (gameState === 'FLYING') {
                    isBoostingRef.current = false;
                    setIsBoosting(false);
                }
            }}
            onClick={interact}
        >
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, pointerEvents: 'none' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', textShadow: '0 0 15px rgba(0,0,0,0.8)', color: '#ffea00' }}>
                    {distance}m
                </div>
                <div style={{ fontSize: '1rem', color: '#00e5ff', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    ALT: {altitude}m
                    <span style={{
                        background: altitude > 1500 ? 'rgba(168, 85, 247, 0.3)' : altitude > 600 ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 255, 136, 0.3)',
                        border: `1px solid ${altitude > 1500 ? '#a855f7' : altitude > 600 ? '#00f0ff' : '#00ff88'}`,
                        color: altitude > 1500 ? '#c084fc' : altitude > 600 ? '#00f0ff' : '#00ff88',
                        padding: '1px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace'
                    }}>
                        {altitude > 1500 ? 'ORBIT' : altitude > 600 ? 'CLOUDS' : 'SURFACE'}
                    </span>
                </span>
                </div>
                <div style={{ color: 'gold', fontSize: '0.9rem', marginTop: '4px' }}>
                    COINS: {coins.toLocaleString()}
                </div>
            </div>

            {gameState === 'FLYING' && (
                <div style={{
                    position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
                }}>
                    <div style={{ fontSize: '0.85rem', color: isBoosting ? '#ff5500' : 'white', fontWeight: 'bold', marginBottom: '4px' }}>
                        {isBoosting ? 'THRUSTERS FIRING // OVERDRIVE' : 'HOLD [SPACE] / TAP SCREEN TO BOOST'}
                    </div>
                    <div style={{
                        width: '280px', height: '16px', background: 'rgba(0,0,0,0.6)',
                        border: '2px solid white', borderRadius: '10px', overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${(fuel / maxFuel) * 100}%`,
                            height: '100%',
                            background: fuel > maxFuel * 0.3 ? 'linear-gradient(90deg, #ff9100, #ffd600)' : '#ff1744',
                            transition: 'width 0.1s'
                        }} />
                    </div>
                </div>
            )}

            <SquishyButton
                onClick={(e) => {
                    e.stopPropagation();
                    navigate('/arcade');
                }}
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, background: '#ff1744', color: 'white' }}
            >
                EXIT
            </SquishyButton>

            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div
                    style={{
                        position: 'absolute', bottom: 20, right: 20, zIndex: 90,
                        background: 'rgba(10, 10, 20, 0.9)', padding: '16px', borderRadius: '16px',
                        border: '2px solid gold', maxWidth: '380px', boxShadow: '0 0 30px rgba(255,215,0,0.2)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, color: 'gold', fontWeight: '900', letterSpacing: '1px' }}>CANNON ARMORY</h4>
                        <span style={{ fontSize: '0.8rem', color: '#ffd700', fontWeight: '800' }}>{coins.toLocaleString()} CP</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {Object.keys(UPGRADE_BASE_COSTS).map(key => {
                            const lvl = upgrades[key];
                            const cost = UPGRADE_BASE_COSTS[key] * lvl;
                            const canAfford = coins >= cost;
                            const labels = {
                                power: 'POWER',
                                fuel: 'FUEL',
                                thrust: 'THRUST',
                                aero: 'AERO',
                                bounce: 'BOUNCE',
                                magnet: 'MAGNET'
                            };

                            return (
                                <div
                                    key={key}
                                    onClick={() => buyUpgrade(key)}
                                    style={{
                                        background: canAfford ? '#1a237e' : '#222',
                                        padding: '8px', borderRadius: '8px',
                                        textAlign: 'center', cursor: canAfford ? 'pointer' : 'not-allowed',
                                        border: canAfford ? '1px solid #00e5ff' : '1px solid #444',
                                        opacity: canAfford ? 1 : 0.6
                                    }}
                                >
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{labels[key]}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#aaa' }}>LVL {lvl}</div>
                                    <div style={{ color: '#ffd700', fontSize: '0.7rem', fontWeight: 'bold' }}>{cost} CP</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {gameState === 'MENU' && (
                <div
                    style={{
                        position: 'absolute', inset: 0, background: 'rgba(5, 5, 15, 0.92)',
                        zIndex: 200, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <h1 style={{ fontSize: '3rem', color: 'gold', margin: 0, textShadow: '0 0 20px gold' }}>
                        BRO CANNON <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
                    </h1>
                    <p style={{ color: '#aaa', margin: '10px 0 25px 0' }}>CHOOSE YOUR BRAVE PILOT</p>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px',
                        maxHeight: '340px', overflowY: 'auto', padding: '10px',
                        background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid #333'
                    }}>
                        {SKINS.map(skin => {
                            const { aura, tier } = getSkinAura(skin);
                            const isSelected = selectedSkin.id === skin.id;
                            const tierColor = tier === 'MYTHIC' ? '#ff0055' : (tier === 'LEGENDARY' ? '#ffd700' : '#a855f7');
                            return (
                                <div
                                    key={skin.id}
                                    onClick={() => { setSelectedSkin(skin); playBoop(); }}
                                    style={{
                                        position: 'relative',
                                        border: isSelected ? `2.5px solid ${aura.primaryColor}` : '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '14px',
                                        padding: '10px 6px',
                                        background: isSelected ? `radial-gradient(circle, ${aura.glowColor} 0%, rgba(15,23,42,0.9) 80%)` : 'rgba(15,23,42,0.6)',
                                        boxShadow: isSelected ? `0 0 18px ${aura.glowColor}` : 'none',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.18s ease'
                                    }}
                                >
                                    {/* Rarity Tag */}
                                    <span style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        background: tierColor,
                                        color: '#000',
                                        fontSize: '0.52rem',
                                        fontWeight: '900',
                                        fontFamily: '"Orbitron", monospace',
                                        padding: '1px 5px',
                                        borderRadius: '4px',
                                        boxShadow: `0 0 6px ${tierColor}`
                                    }}>
                                        {tier === 'MYTHIC' ? '★ MYTHIC' : tier}
                                    </span>

                                    <img src={skin.src} width="52" height="52" style={{ display: 'block', margin: '8px auto 4px auto', objectFit: 'contain', filter: `drop-shadow(0 0 6px ${aura.primaryColor}88)` }} />
                                    <div style={{ fontSize: '0.72rem', fontWeight: '800', fontFamily: '"Orbitron", sans-serif', color: isSelected ? '#fff' : '#cbd5e1' }}>
                                        {skin.name}
                                    </div>
                                    <div style={{ fontSize: '0.58rem', fontWeight: 'bold', color: aura.primaryColor, letterSpacing: '0.5px', marginTop: '2px', textTransform: 'uppercase' }}>
                                        {aura.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <SquishyButton
                        onClick={resetGame}
                        style={{
                            fontSize: '1.5rem', padding: '16px 60px',
                            background: '#00ffcc', color: 'black', marginTop: '30px',
                            fontWeight: 'bold', boxShadow: '0 0 25px #00ffcc'
                        }}
                    >
                        LOCK IN & LAUNCH
                    </SquishyButton>
                </div>
            )}

            {(gameState === 'AIM' || gameState === 'POWER') && (
                <div style={{
                    position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)',
                    zIndex: 50, textAlign: 'center', pointerEvents: 'none'
                }}>
                    <h2 style={{ fontSize: '2.5rem', textShadow: '0 0 20px black', margin: 0, color: gameState === 'AIM' ? '#00e5ff' : '#ff1744' }}>
                        {gameState === 'AIM' ? 'CLICK TO SET ANGLE' : 'CLICK TO LAUNCH!'}
                    </h2>
                    <div style={{
                        width: '320px', height: '22px', background: '#222', border: '3px solid white',
                        margin: '15px auto', borderRadius: '12px', overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${gameState === 'AIM' ? angle : power}%`,
                            height: '100%',
                            background: gameState === 'AIM' ? 'linear-gradient(90deg, #00e5ff, #76ff03)' : 'linear-gradient(90deg, #ffd600, #ff1744)'
                        }} />
                    </div>
                </div>
            )}

            {gameState === 'LANDED' && (
                <div
                    style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
                        zIndex: 200, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <h1 style={{ fontSize: '4.5rem', color: 'gold', margin: 0, textShadow: '0 0 30px gold' }}>
                        {distance}m
                    </h1>
                    <h3 style={{ color: '#00e5ff', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>EARNED +{coinsEarned} CP</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><path d="M14.5 9h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4.5"/><path d="M12 7v10"/></svg>
                    </h3>
                    <div style={{ color: '#aaa', marginBottom: '25px' }}>
                        BEST RECORD: {stats?.broCannonHighScore || distance}m
                    </div>

                    {/* DUEL RESULTS CARD */}
                    {activeGhost && (
                        <div style={{
                            background: duelWon ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 0, 85, 0.15)',
                            border: `1.5px solid ${duelWon ? '#00ff88' : '#ff0055'}`,
                            borderRadius: '16px',
                            padding: '12px 24px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            fontFamily: '"Orbitron", sans-serif'
                        }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.75rem', color: duelWon ? '#00ff88' : '#ff3366', fontWeight: '900' }}>
                                    {duelWon ? '🏆 DUEL VICTORY (+250 CP)' : '💀 DUEL DEFEATED'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '700' }}>
                                    vs {activeGhost.playerName} ({activeGhost.finalScore}m)
                                </div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: duelWon ? '#00ff88' : '#ff3366' }}>
                                {duelWon ? `+${distance - activeGhost.finalScore}m` : `-${activeGhost.finalScore - distance}m`}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            style={{
                                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.35))',
                                border: '1.5px solid #00f0ff',
                                color: '#00f0ff',
                                borderRadius: '12px',
                                padding: '14px 28px',
                                fontWeight: '900',
                                fontSize: '0.95rem',
                                fontFamily: '"Orbitron", sans-serif',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
                                letterSpacing: '1px'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            <span>⚡ CHALLENGE A BRO (COPY DUEL)</span>
                        </button>
                    </div>

                    <ShareDuelModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        gamePath="/arcade/bro-cannon"
                        ghostData={lastFinishedRun}
                        unit="m"
                    />

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <SquishyButton
                            onClick={resetGame}
                            style={{ fontSize: '1.2rem', padding: '16px 36px', background: '#00ffcc', color: 'black' }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span>LAUNCH AGAIN</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                            </span>
                        </SquishyButton>
                        <SquishyButton
                            onClick={goToMenu}
                            style={{ fontSize: '1.2rem', padding: '16px 36px', background: '#333', color: 'white' }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span>GARAGE & PILOTS</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                            </span>
                        </SquishyButton>
                    </div>
                </div>
            )}

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translate3d(${-cameraRef.current.x}px, ${cameraRef.current.y}px, 0) translate(${Math.random() * shakeRef.current}px, ${Math.random() * shakeRef.current}px)`,
                    pointerEvents: 'none',
                    willChange: 'transform'
                }}
            >
                {altitude > 1000 && (
                    <div style={{
                        position: 'absolute', left: cameraRef.current.x - 500, top: -4000,
                        width: '3000px', height: '4000px', pointerEvents: 'none', opacity: Math.min(1, (altitude - 1000) / 1000)
                    }}>
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `${(i * 47) % 3000}px`,
                                    top: `${(i * 73) % 4000}px`,
                                    width: `${(i % 3) + 2}px`,
                                    height: `${(i % 3) + 2}px`,
                                    background: 'white',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 6px white'
                                }}
                            />
                        ))}
                    </div>
                )}

                {visibleItems.map(item => (
                    <div
                        key={item.id}
                        style={{
                            position: 'absolute',
                            left: item.x,
                            bottom: item.y,
                            width: '44px',
                            height: '44px',
                            transform: 'translate(-50%, 50%)',
                            fontSize: '32px',
                            textAlign: 'center',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))'
                        }}
                    >
                        {item.type === 'BOOST' ? (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 0, 85, 0.25)', border: '1.5px solid #ff0055', borderRadius: '50%', boxShadow: '0 0 15px #ff0055' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff0055" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                            </div>
                        ) : item.type === 'FUEL' ? (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 240, 255, 0.25)', border: '1.5px solid #00f0ff', borderRadius: '50%', boxShadow: '0 0 15px #00f0ff' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="7" width="12" height="14" rx="2"/><line x1="9" y1="3" x2="15" y2="3"/><line x1="12" y1="3" x2="12" y2="7"/><polygon points="11 11 13 11 11 17 14 14" fill="#00f0ff"/></svg>
                            </div>
                        ) : item.type === 'TRAMPOLINE' ? (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 255, 136, 0.25)', border: '1.5px solid #00ff88', borderRadius: '50%', boxShadow: '0 0 15px #00ff88' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4-4-4 4"/><rect x="3" y="16" width="18" height="4" rx="1"/><line x1="7" y1="20" x2="5" y2="23"/><line x1="17" y1="20" x2="19" y2="23"/></svg>
                            </div>
                        ) : item.type === 'UFO' ? (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(168, 85, 247, 0.25)', border: '1.5px solid #a855f7', borderRadius: '50%', boxShadow: '0 0 15px #a855f7' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="14" rx="9" ry="4"/><path d="M7 13c0-3 2-5 5-5s5 2 5 5"/><line x1="9" y1="18" x2="8" y2="21"/><line x1="15" y1="18" x2="16" y2="21"/></svg>
                            </div>
                        ) : item.type === 'DIAMOND' ? (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 240, 255, 0.25)', border: '1.5px solid #00f0ff', borderRadius: '50%', boxShadow: '0 0 15px #00f0ff' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,240,255,0.3)" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="12" y1="22" x2="12" y2="9"/><line x1="2" y1="9" x2="22" y2="9"/></svg>
                            </div>
                        ) : (
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 215, 0, 0.25)', border: '1.5px solid #ffd700', borderRadius: '50%', boxShadow: '0 0 15px #ffd700' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,215,0,0.3)" stroke="#ffd700" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><path d="M14.5 9h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4.5"/><path d="M12 7v10"/></svg>
                            </div>
                        )}
                    </div>
                ))}

                {particlesRef.current.map((pt, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: pt.x,
                            bottom: pt.y,
                            width: '8px',
                            height: '8px',
                            background: pt.color,
                            borderRadius: '50%',
                            opacity: pt.life,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: `0 0 8px ${pt.color}`,}}
                    />
                ))}

                <div
                    style={{
                        position: 'absolute',
                        left: -2000,
                        bottom: 0,
                        width: '200000px',
                        height: `${GROUND_LEVEL}px`,
                        background: 'linear-gradient(to bottom, #2e7d32 0%, #1b5e20 100%)',
                        borderTop: '6px solid #76ff03',
                        boxShadow: '0 0 20px rgba(118, 255, 3, 0.4)'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        left: -55,
                        bottom: GROUND_LEVEL,
                        width: '65px',
                        height: '45px',
                        background: '#222',
                        borderRadius: '12px',
                        border: '2px solid #555'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        left: -40,
                        bottom: GROUND_LEVEL + 20,
                        width: '90px',
                        height: '24px',
                        background: 'linear-gradient(to right, #333, #666)',
                        transformOrigin: 'left center',
                        transform: `rotate(${-angle}deg)`,
                        borderRadius: '6px',
                        border: '2px solid gold'
                    }}
                />

                {/* Render Rival Phantom Ghost Pod in Flight */}
                {activeGhost && ghostPos && (gameState === 'FLYING' || gameState === 'LANDED') && (
                    <div
                        style={{
                            position: 'absolute',
                            left: ghostPos.x * 10,
                            bottom: ghostPos.y * 5 + GROUND_LEVEL,
                            width: '48px',
                            height: '48px',
                            transform: 'translate(-50%, 50%)',
                            opacity: 0.55,
                            pointerEvents: 'none',
                            zIndex: 8
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: '-8px',
                                borderRadius: '50%',
                                border: '1.5px dashed #00f0ff',
                                boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)',
                                animation: 'spin 8s linear infinite'
                            }}
                        />
                        <img
                            src={activeGhost.skinId?.startsWith('/') ? activeGhost.skinId : `/assets/skins/${activeGhost.skinId}.png`}
                            alt="Ghost"
                            onError={(e) => { e.target.src = '/assets/skins/face_default.png'; }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #00f0ff)' }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '-22px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(5, 10, 25, 0.85)',
                                border: '1px solid #00f0ff',
                                borderRadius: '6px',
                                padding: '1px 6px',
                                fontSize: '0.55rem',
                                color: '#00f0ff',
                                fontWeight: '900',
                                fontFamily: '"Orbitron", monospace',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            👻 {activeGhost.playerName}
                        </div>
                    </div>
                )}

                {(gameState === 'FLYING' || gameState === 'LANDED') && (
                    <div
                        style={{
                            position: 'absolute',
                            left: physics.current.x,
                            bottom: physics.current.y,
                            width: '54px',
                            height: '54px',
                            transform: `translate(-50%, 50%) rotate(${physics.current.rot}deg)`,
                        }}
                    >
                        {isBoosting && fuel > 0 && (
                            <div style={{
                                position: 'absolute',
                                left: -22,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                filter: 'drop-shadow(0 0 10px #ff5500)'
                            }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff5500" stroke="#ffaa00" strokeWidth="1">
                                    <path d="M12 23c-4.97 0-9-3.8-9-8.5 0-3.37 2.1-6.7 4.77-8.8.44-.35 1.09-.16 1.25.38.64 2.15 1.83 3.67 3.03 4.54.27.2.65.1.78-.2.53-1.2.97-3.07.97-5.42 0-.6.64-1 1.14-.66C17.5 5.9 21 10.3 21 14.5 21 19.2 16.97 23 12 23z" />
                                </svg>
                            </div>
                        )}
                        {/* Mythic Procedural Skin Aura Halo */}
                        {(() => {
                            const { aura } = getSkinAura(selectedSkin);
                            return (
                                <>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: '-12px',
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, ${aura.glowColor} 0%, rgba(0,0,0,0) 70%)`,
                                            border: `1.5px dashed ${aura.primaryColor}88`,
                                            boxShadow: `0 0 22px ${aura.glowColor}`,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <img
                                        src={selectedSkin.src}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 2, filter: `drop-shadow(0 0 10px ${aura.primaryColor}aa)` }}
                                    />
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroCannon;
