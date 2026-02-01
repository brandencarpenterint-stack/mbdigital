import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import SquishyButton from '../../components/SquishyButton';
import GameOverCard from '../../components/GameOverCard';
import useRetroSound from '../../hooks/useRetroSound';
import { feedService } from '../../utils/feed';

const BIOMES = [
    { name: 'STREETS', limit: 2500, bgTop: '#87CEEB', bgBot: '#E0F7FA', plat: '#999', text: '#333', border: '#666' },
    { name: 'SUNSET WAVE', limit: 5000, bgTop: '#ff7e5f', bgBot: '#feb47b', plat: '#554433', text: 'white', border: '#332211' },
    { name: 'TOXIC WASTE', limit: 7500, bgTop: '#4b1', bgBot: '#260', plat: '#3f3', text: '#cbff00', border: '#252' },
    { name: 'CYBER CITY', limit: 10000, bgTop: '#2b1055', bgBot: '#7597de', plat: '#00ffaa', text: '#00ffaa', border: 'white' },
    { name: 'ICE AGE', limit: 12500, bgTop: '#00d2ff', bgBot: '#3a7bd5', plat: '#e0ffff', text: '#caf0f8', border: '#90e0ef' },
    { name: 'VOLCANO', limit: 15000, bgTop: '#800000', bgBot: '#ff0000', plat: '#300', text: '#ff4500', border: '#ffaa00' },
    { name: 'GLITCH REALM', limit: 17500, bgTop: '#000000', bgBot: '#111111', plat: '#00ff00', text: '#00ff00', border: 'lime', glitch: true },
    { name: 'MIDNIGHT TOKYO', limit: 20000, bgTop: '#0f0c29', bgBot: '#302b63', plat: '#ff00cc', text: '#00d4ff', border: '#ff00cc' },
    { name: 'STRATOSPHERE', limit: 22500, bgTop: '#000046', bgBot: '#1CB5E0', plat: '#fff', text: '#fff', border: '#aaa' },
    { name: 'ASCENSION', limit: 999999, bgTop: '#FFD700', bgBot: '#FFFFFF', plat: '#FFFFFF', text: '#B8860B', border: '#FFD700' }
];

const MerchJump = () => {
    const canvasRef = useRef(null);
    const { playJump, playCollect, playCrash, playBoop } = useRetroSound();
    const { updateStat, addCoins, userProfile, stats } = useGamification() || {};

    // Game Constants
    const GRAVITY = 0.4;
    const JUMP_FORCE = -12;
    const WIDTH = 400;
    const HEIGHT = 600;

    // Assets
    const SKINS = [
        { id: 'face_money', name: 'MONEY', src: '/assets/skins/face_money.png?t=v2', hoodie: '#111' },
        { id: 'face_bear', name: 'BEAR', src: '/assets/skins/face_bear.png?t=v2', hoodie: '#593a28' },
        { id: 'face_bunny', name: 'BUNNY', src: '/assets/skins/face_bunny.png?t=v2', hoodie: '#7cb9e8' },
        { id: 'face_default', name: 'OG', src: '/assets/skins/face_default.png?t=v2', hoodie: '#333' },
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
    // Shop State
    const [selectedStreak, setSelectedStreak] = useState(STREAKS[0]);
    const [unlockedStreaks, setUnlockedStreaks] = useState(['none']);
    const [isShopOpen, setIsShopOpen] = useState(window.innerWidth > 500); // Open by default on desktop

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
    const trailRef = useRef([]); // Trail Ref
    const cameraYRef = useRef(0);
    const scoreRef = useRef(0);
    const requestRef = useRef(null);
    const inputRef = useRef(WIDTH / 2);
    const skinImgRef = useRef(null);
    const biomeRef = useRef(BIOMES[0]);

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
            playBoop();
        } else {
            const cost = streak.price;
            if ((stats.arcadeCoins || 0) >= cost) {
                playCollect();
                const newUnlocked = [...unlockedStreaks, streak.id];
                setUnlockedStreaks(newUnlocked);
                updateStat('unlockedStreaks', newUnlocked);
                updateStat('arcadeCoins', (stats.arcadeCoins || 0) - cost);
                setSelectedStreak(streak);
            } else {
                playCrash();
            }
        }
    };

    const initGame = () => {
        setScore(0);
        scoreRef.current = 0;
        cameraYRef.current = 0;
        biomeRef.current = BIOMES[0];
        trailRef.current = []; // Reset Trail

        // Random Rocket Start 🚀 (2000m to 5000m)
        // v = sqrt(2gh)
        // h=2000 -> v=40. h=5000 -> v=63.
        const startVy = -(40 + Math.random() * 23); // Range [40, 63]
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

    const generatePlatform = (y, biome) => {
        const score = scoreRef.current;

        // MERCH BALLOON (Rainbow Glow & Boost)
        // Spawn chance between 2000m and 6000m? Or just around specific milestones?
        // User wants "no more red balloon", implies standard boost is now Merch Balloon.
        // Let's make it spawn periodically or at key milestones.

        // Spawn rule: Rare chance if score > 1000 and no items present
        if (score > 1000 && Math.random() < 0.005 && itemsRef.current.length === 0) {
            itemsRef.current.push({
                x: Math.random() * (WIDTH - 60), y: y - 100, type: 'merch_balloon', w: 50, h: 50
            });
        }

        let x = Math.random() * (WIDTH - 80);
        let w = 70 + Math.random() * 30;
        let type = 'normal';

        if (score > 2500 && Math.random() > 0.7) type = 'moving';
        if (score > 5000 && Math.random() > 0.8) type = 'crumble';

        if (score > 7500 && Math.random() > 0.8) {
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
        if (vy < 0) {
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.moveTo(-10, 20); ctx.lineTo(-5, 35 + Math.random() * 10); ctx.lineTo(0, 20);
            ctx.moveTo(10, 20); ctx.lineTo(15, 35 + Math.random() * 10); ctx.lineTo(5, 20);
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

        ctx.fillStyle = 'white';
        ctx.fillRect(-16, legLeftY, 8, 5); ctx.fillRect(8, legRightY, 8, 5);

        // BODY
        ctx.fillStyle = selectedSkin.hoodie || '#111';
        ctx.beginPath(); ctx.roundRect(-20, 0, 40, 35, 10); ctx.fill();

        ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.fillText('M', -5, 20);

        // ARMS
        ctx.strokeStyle = selectedSkin.hoodie || '#111'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-18, 5); ctx.lineTo(-30, vy < 0 ? -10 : 15); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, 5); ctx.lineTo(30, vy < 0 ? -10 : 15); ctx.stroke();

        // HEAD
        if (skinImgRef.current && skinImgRef.current.complete) {
            const size = 50;
            ctx.drawImage(skinImgRef.current, -size / 2, -size / 2 - 15, size, size);
        } else {
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(0, -20, 20, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    };

    const gameLoop = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const player = playerRef.current;
        const currentBiome = getCurrentBiome(scoreRef.current);
        biomeRef.current = currentBiome;

        // --- UPDATE ---
        const targetX = inputRef.current;
        player.x += (targetX - player.x) * 0.15;
        if (player.x < -20) player.x = WIDTH + 20;
        if (player.x > WIDTH + 20) player.x = -20;

        player.vy += GRAVITY;
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
            const lastP = platformsRef.current[platformsRef.current.length - 1];
            if (lastP && lastP.y > 100) {
                generatePlatform(lastP.y - (80 - Math.min(20, scoreRef.current / 1000) + Math.random() * 40), currentBiome);
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

        // COLLISION
        if (player.vy > 0) {
            platformsRef.current.forEach((p, idx) => {
                if (player.x > p.x - 20 && player.x < p.x + p.w + 20 && player.y + 30 > p.y && player.y + 30 < p.y + p.h + 20) {
                    player.vy = JUMP_FORCE;
                    playJump();
                    if (p.type === 'crumble') {
                        platformsRef.current.splice(idx, 1); playCrash();
                    }
                }
            });
        }

        itemsRef.current.forEach((item, idx) => {
            if (player.x > item.x - 30 && player.x < item.x + item.w + 30 && player.y > item.y - 30 && player.y < item.y + item.h + 30) {
                if (item.type === 'merch_balloon') {
                    player.vy = -60; // SUPER BOOST
                    playCollect();
                    itemsRef.current.splice(idx, 1);
                    feedService.publish(`found a Merch Balloon! 🎈`, 'win', userProfile?.name);
                }
            }
        });

        platformsRef.current.forEach(p => {
            if (p.type === 'moving') {
                p.x += p.vx;
                if (p.x <= 0 || p.x + p.w >= WIDTH) p.vx *= -1;
            }
        });

        if (player.y > HEIGHT) {
            handleGameOver();
            return;
        }

        // --- DRAW ---
        const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, currentBiome.bgTop); grad.addColorStop(1, currentBiome.bgBot);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (currentBiome.glitch && Math.random() > 0.95) {
            ctx.save(); ctx.translate((Math.random() - 0.5) * 10, 0);
            if (Math.random() > 0.5) ctx.filter = 'invert(1)';
        }

        // Decor
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
            ctx.fillStyle = p.color || currentBiome.plat;
            if (p.type === 'crumble') ctx.fillStyle = '#A0522D';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            if (p.type === 'crumble') {
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(p.x + 5, p.y); ctx.lineTo(p.x + 15, p.y + p.h); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.strokeStyle = p.border || currentBiome.border; ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // DRAW TRAIL
        if (selectedStreak.id !== 'none') {
            const t = trailRef.current;
            if (t.length > 1) {
                if (selectedStreak.id === 'rainbow') {
                    t.forEach((p, i) => {
                        ctx.globalAlpha = p.age; ctx.fillStyle = `hsl(${i * 20}, 100%, 50%)`;
                        ctx.beginPath(); ctx.arc(p.x, p.y + 20, 20 * p.age, 0, Math.PI * 2); ctx.fill();
                    });
                } else if (selectedStreak.id === 'black_death') {
                    t.forEach((p, i) => {
                        ctx.globalAlpha = p.age; ctx.fillStyle = i % 2 === 0 ? 'black' : '#330000';
                        ctx.beginPath(); ctx.arc(p.x + (Math.random() - 0.5) * 10, p.y + 20, 25 * p.age, 0, Math.PI * 2); ctx.fill();
                    });
                } else {
                    t.forEach((p, i) => {
                        const colors = selectedStreak.gradient;
                        ctx.globalAlpha = p.age; ctx.fillStyle = colors[i % colors.length];
                        ctx.beginPath(); ctx.arc(p.x, p.y + 20, 15 * p.age, 0, Math.PI * 2); ctx.fill();
                    });
                }
                ctx.globalAlpha = 1;
            }
        }

        // Items
        itemsRef.current.forEach(item => {
            if (item.type === 'merch_balloon') {
                // RAINBOW GLOW
                if (merchBalloonImgRef.current) {
                    ctx.save();
                    const glowColor = `hsl(${performance.now() * 0.1}, 100%, 50%)`;
                    ctx.shadowColor = glowColor;
                    ctx.shadowBlur = 20;
                    // Float animation
                    const floatY = Math.sin(performance.now() * 0.005) * 10;
                    ctx.drawImage(merchBalloonImgRef.current, item.x, item.y + floatY, item.w, item.h);
                    ctx.restore();
                } else {
                    ctx.fillStyle = 'purple'; ctx.fillRect(item.x, item.y, item.w, item.h);
                }
            }
        });

        const tilt = (inputRef.current - player.x) * 0.05;
        drawRig(ctx, player.x, player.y, player.vy, tilt);

        ctx.fillStyle = currentBiome.text; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'left';
        ctx.fillText(`${currentBiome.name}`, 10, 30); ctx.fillText(`${Math.floor(scoreRef.current)}m`, 10, 50);

        if (currentBiome.glitch && Math.random() > 0.95) ctx.restore();

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = () => {
        setGameState('GAMEOVER'); playCrash();
        const finalScore = Math.floor(scoreRef.current);
        if (addCoins) addCoins(Math.floor(finalScore / 200));
        if (updateStat) updateStat('gamesPlayed', 'merch_jump');
        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('merchJumpHighScore', finalScore);
            const playerName = userProfile?.name || 'Player';
            feedService.publish(`set a new Merch Jump High Score: ${finalScore}m! 🚀`, 'win', playerName);
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
                    /* FORCE FULL SCREEN SNAP */
                    .game-wrapper {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                        max-height: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important; /* Ensure no margin */
                    }
                    .game-canvas {
                        border-radius: 0 !important;
                        border: none !important;
                        object-fit: contain; 
                        background: #000 !important; /* Black bars instead of blue */
                        box-shadow: none !important; /* Remove shadow */
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
                        height: 50vh !important; /* Half screen */
                        transform: translateY(100%); /* Hidden by default via transform if closed */
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

            <button className="shop-toggle" onClick={() => setIsShopOpen(!isShopOpen)}>
                {isShopOpen ? 'CLOSE SHOP 🔽' : 'BOOST SHOP 🛒'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h1 className="game-header" style={{ color: 'white', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>MERCH JUMP</h1>
                <div className="game-wrapper" style={{ position: 'relative' }}>
                    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} onMouseMove={handleInput} onTouchMove={(e) => { e.preventDefault(); handleInput(e); }} onTouchStart={handleInput}
                        className="game-canvas"
                        style={{ width: '100%', height: '100%', background: '#87CEEB', border: '4px solid white', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
                    {gameState !== 'PLAYING' && (
                        <>
                            {gameState === 'GAMEOVER' ? (
                                <div className="game-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '10px', overflow: 'hidden' }}>
                                    <GameOverCard score={Math.floor(scoreRef.current)} bestScore={highScore} gameId="merch_jump" onReplay={initGame} onHome={() => window.location.href = '/arcade'} />
                                </div>
                            ) : (
                                <div className="game-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#333', borderRadius: '10px' }}>
                                    <h2 style={{ fontWeight: 'bold', marginBottom: '20px' }}>SKIN SELECT</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                        {SKINS.map(skin => (
                                            <button key={skin.id} onClick={() => { setSelectedSkin(skin); playBoop(); }}
                                                style={{ background: selectedSkin.id === skin.id ? '#87CEEB' : '#eee', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', transform: selectedSkin.id === skin.id ? 'scale(1.1)' : 'scale(1)' }}>
                                                <img src={skin.src} width="40" height="40" style={{ display: 'block', margin: '0 auto' }} />
                                            </button>
                                        ))}
                                    </div>
                                    <SquishyButton onClick={initGame} style={{ padding: '20px 50px', background: '#333', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', border: 'none', borderRadius: '100px' }}>JUMP</SquishyButton>
                                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>CHECK SHOP FOR TRAILS 👉</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <p className="mobile-hide" style={{ color: '#888', marginTop: '20px', fontSize: '0.8rem' }}>Slide to Move • Reach 2500m for Next Biome</p>
            </div>

            <div className={`boost-shop ${isShopOpen ? 'open' : ''}`} style={{ width: '250px', height: '600px', background: '#1a1a1a', borderRadius: '20px', border: '2px solid #444', padding: '20px', flexDirection: 'column', color: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>BOOST SHOP</h2>
                    <span style={{ color: 'gold' }}>${stats?.arcadeCoins || 0}</span>
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

            {/* FLOATING EXIT IS HANDLED BY LAYOUT, REMOVE LOCAL ONE IF DUPLICATE OR KEEP? */}
            {/* Keeping it won't hurt, but Layout one is better. I'll remove the local one in favor of Layout's if desired, or keep it as backup. */}
            <Link to="/arcade" className="mobile-hide" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}>
                <SquishyButton style={{ borderRadius: '50px', padding: '10px 20px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)' }}>🏠 EXIT</SquishyButton>
            </Link>
            <style>{`@media (max-width: 500px) { .mobile-hide { display: none !important; } }`}</style>
        </div>
    );
};

export default MerchJump;
