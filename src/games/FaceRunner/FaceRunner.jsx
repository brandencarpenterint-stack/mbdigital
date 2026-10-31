import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
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
    { name: 'THE VOID', bg: '#ffffff', grid: '#000000', obs: ['#000000', '#333333'] }
];

const FaceRunner = () => {
    const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
    const canvasRef = useRef(null);
    const { soundEnabled } = useSettings();
    const { playCrash, playCollect, playWin } = useRetroSound();

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const TUNNEL_DEPTH = 2000;

    // State
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [canRestart, setCanRestart] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('faceRunnerHighScore')) || 0);

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
    const speedRef = useRef(30); // Start faster
    const scoreRef = useRef(0);
    const biomeIndexRef = useRef(0);

    // Entities
    const playerRef = useRef({ x: 0, y: 0, squash: 1 });
    const obstaclesRef = useRef([]); // {x, y, z, color, rot}
    const requestRef = useRef(null);

    // Assets
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
        // Preload Faces
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
        speedRef.current = 30; // Faster start speed
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
            size: 100 + Math.random() * 100 // Varied sizes
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

        // Biome Logic
        const distance = Math.floor(scoreRef.current);
        const biomeStage = Math.floor(distance / 2500) % BIOMES.length;
        biomeIndexRef.current = biomeStage;
        const currentBiome = BIOMES[biomeStage];

        // --- UPDATE ---
        if (playingRef.current) {
            // Speed up over time (faster scaling)
            speedRef.current = Math.min(50 + (scoreRef.current * 0.03), 150);

            // Spawn Rate
            if (Math.random() < 0.08) {
                spawnObstacle(currentBiome);
            }

            // Move Obstacles
            for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
                const obs = obstaclesRef.current[i];
                obs.z -= speedRef.current;

                if (obs.z <= 0) {
                    obstaclesRef.current.splice(i, 1);
                    scoreRef.current += 15; // 5m per obstacle passed
                    setScore(Math.floor(scoreRef.current));
                }
            }
        }

        // --- DRAW ---
        ctx.fillStyle = currentBiome.bg;
        ctx.fillRect(0, 0, width, height);

        // Tunnel Effect
        ctx.strokeStyle = currentBiome.grid;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Radial Lines
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * width, cy + Math.sin(angle) * height);
        }
        // Moving Rings
        const offset = (performance.now() * speedRef.current * 0.05) % 500;
        for (let z = 500; z > 0; z -= 500 / 5) { // Fewer rings for mobile performance
            const d = (z - offset + 500) % 500; // 0 to 500
            if (d < 10) continue;
            const scale = 500 / d; // Fake perspective
            // Just draw a rect for speed instead of complex path
            const size = 50 * scale;
            if (size < width * 2) {
                ctx.rect(cx - size, cy - size, size * 2, size * 2);
            }
        }
        ctx.stroke();

        // Obstacles
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
                if (dist < (size / 2 + 30)) { // 30 is player radius approx
                    handleCrash();
                }
            }

            ctx.fillStyle = obs.color;
            ctx.shadowBlur = 10; ctx.shadowColor = obs.color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            // Detail
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);
            ctx.restore();
        });

        // --- GHOST DUEL TELEMETRY & PLAYBACK ---
        const now = performance.now();
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

        // Player
        if (playingRef.current) {
            const p = playerRef.current;
            p.squash = 1 + Math.sin(performance.now() * 0.02) * 0.05;

            ctx.save();
            ctx.translate(cx + p.x, cy + p.y);
            ctx.scale(p.squash, 1 / p.squash);

            const { aura: playerAura } = getSkinAura(selectedFace);
            drawCanvasAura(ctx, 0, 0, 48, selectedFace, performance.now() * 0.05);

            const img = faceImgs.current[selectedFace];
            const size = 100;

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.shadowBlur = 20; ctx.shadowColor = 'white';
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            } else {
                ctx.fillStyle = 'white';
                ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }

        // HUD - Biome Name (Cinematic)
        ctx.fillStyle = 'white';
        ctx.font = '20px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentBiome.name, cx, 40);
        ctx.font = '14px monospace';
        ctx.fillText(`DISTANCE: ${Math.floor(scoreRef.current)}m`, cx, 65);

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleCrash = () => {
        const finalScore = Math.floor(scoreRef.current);

        if (updateStat) updateStat('gamesPlayed', 'face_runner');
        if (addCoins) addCoins(Math.floor(finalScore / 10)); // 1 coin per 10m

        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('faceRunnerHighScore', finalScore);

            const playerName = userProfile?.name || 'Runner';
            feedService.publish(`reached ${finalScore}m in Face Runner!`, 'win', playerName);
        }
        // Sample final telemetry frame
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
        playCrash();

        // Delay restart capability
        setCanRestart(false);
        setTimeout(() => setCanRestart(true), 1500);
    };

    const handleInput = (clientX, clientY) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        // Map input to canvas coordinates relative to center
        // Limit x/y to bounds
        let x = (clientX - rect.left) * scaleX - (CANVAS_WIDTH / 2);
        let y = (clientY - rect.top) * scaleY - (CANVAS_HEIGHT / 2);

        // Clamp
        x = Math.max(-CANVAS_WIDTH / 2 + 50, Math.min(CANVAS_WIDTH / 2 - 50, x));
        y = Math.max(-CANVAS_HEIGHT / 2 + 50, Math.min(CANVAS_HEIGHT / 2 - 50, y));

        playerRef.current.x = x;
        playerRef.current.y = y;
    };

    return (
        <div className="page-enter" style={{
            position: 'fixed', inset: 0,
            background: 'black',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            touchAction: 'none' // DISALLOW SCROLLING
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

            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseMove={(e) => handleInput(e.clientX, e.clientY)}
                onTouchMove={(e) => {
                    e.preventDefault(); // Stop scroll
                    handleInput(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchStart={(e) => {
                    // Initial jump to finger
                    handleInput(e.touches[0].clientX, e.touches[0].clientY);
                }}
                style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    maxWidth: '800px', maxHeight: '600px',
                    // Border changes color with Biome
                    border: `4px solid ${BIOMES[Math.floor(Math.floor(score) / 2500) % BIOMES.length]?.obs[0] || 'white'}`
                }}
            />

            {gameState === 'START' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.9)', padding: '40px', borderRadius: '20px', border: '2px solid cyan', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ color: 'cyan', fontSize: '3rem', margin: 0, fontFamily: '"Orbitron"' }}>FACE WARP</h1>
                    <p style={{ color: 'white', marginBottom: '20px', fontFamily: 'monospace' }}>Avoid the Void.</p>

                    {activeGhost && (
                        <div style={{
                            background: 'rgba(0, 240, 255, 0.12)',
                            border: '1px solid #00f0ff',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            marginBottom: '18px',
                            fontSize: '0.75rem',
                            color: '#00f0ff',
                            fontFamily: '"Orbitron", monospace',
                            boxShadow: '0 0 14px rgba(0, 240, 255, 0.3)'
                        }}>
                            👻 DUEL CHALLENGE: Beat <strong>{activeGhost.playerName}</strong> ({activeGhost.finalScore}m)!
                        </div>
                    )}
                    
                    {/* SKIN SELECTOR */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '300px' }}>
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
                                        padding: '6px 4px',
                                        cursor: 'pointer',
                                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
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
                                    <img src={skin.src} alt={skin.name} style={{ width: '38px', height: '38px', objectFit: 'contain', filter: `drop-shadow(0 0 4px ${aura.primaryColor}88)` }} />
                                    <div style={{ fontSize: '0.5rem', fontWeight: 'bold', color: aura.primaryColor, textTransform: 'uppercase' }}>
                                        {aura.name.split(' ')[0]}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <SquishyButton onClick={startGame} style={{ background: 'cyan', color: 'black', fontSize: '1.5rem', padding: '15px 40px', fontWeight: 'bold' }}>RUN</SquishyButton>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div style={{ position: 'absolute', textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '20px', border: '2px solid red' }}>
                    <h1 style={{ color: 'red', fontSize: '3rem', margin: 0 }}>CRASHED!</h1>
                    <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>{Math.floor(score)}m</p>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>BEST: {highScore}m</p>
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
                            fontSize: '1.5rem',
                            padding: '15px 40px',
                            cursor: canRestart ? 'pointer' : 'wait'
                        }}
                    >
                        {canRestart ? 'AGAIN' : 'WAIT...'}
                    </SquishyButton>
                </div>
            )}

            {/* HOME BUTTON - Top Left (High Z-Index) */}
            <Link to="/arcade" style={{
                position: 'absolute', top: '20px', left: '20px', zIndex: 9999,
                textDecoration: 'none'
            }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.85)', color: '#fff',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    padding: '10px 22px', borderRadius: '30px',
                    fontWeight: 'bold', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 240, 255, 0.25)',
                    boxSizing: 'border-box',
                    fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'monospace'
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>EXIT</span>
                </div>
            </Link>
        </div>
    );
};

export default FaceRunner;
