import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import SquishyButton from '../../components/SquishyButton';
import GameOverCard from '../../components/GameOverCard';
import useRetroSound from '../../hooks/useRetroSound';
import { feedService } from '../../utils/feed';

const WIDTH = 400;
const HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_FORCE = -13;

const SKINS = [
    { id: 'default', name: 'Hoodie', frame: 0 },
    { id: 'money', name: 'Money', frame: 1 }, // Assuming sheet structure allows variants
];

const MerchJump = () => {
    const canvasRef = useRef(null);
    const { playJump, playCollect, playCrash, playBoop } = useRetroSound();
    const { updateStat, addCoins, userProfile, stats } = useGamification() || {};

    // State
    const [gameState, setGameState] = useState('MENU');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('merchJumpHighScore')) || 0);

    // Refs
    const stateRef = useRef({
        player: { x: WIDTH / 2, y: HEIGHT - 150, vy: 0, state: 'JUMP' },
        platforms: [],
        items: [],
        particles: [],
        cameraY: 0,
        score: 0,
        sheet: null
    });
    const animId = useRef(null);
    const inputRef = useRef(WIDTH / 2);

    useEffect(() => {
        const img = new Image();
        img.src = '/assets/jump_sheet.png';
        stateRef.current.sheet = img;

        if (stats?.merchJumpHighScore > highScore) setHighScore(stats.merchJumpHighScore);
    }, [stats]);

    const initGame = () => {
        setScore(0);
        stateRef.current.score = 0;
        stateRef.current.cameraY = 0;
        stateRef.current.player = { x: WIDTH / 2, y: HEIGHT - 150, vy: -10, state: 'JUMP' };
        stateRef.current.platforms = [{ x: WIDTH / 2 - 50, y: HEIGHT - 50, w: 100, type: 'normal' }];
        stateRef.current.items = [];
        stateRef.current.particles = [];

        // Generate Start Platforms
        let y = HEIGHT - 150;
        for (let i = 0; i < 20; i++) {
            generatePlatform(y);
            y -= 80 + Math.random() * 20;
        }

        setGameState('PLAYING');
        requestAnimationFrame(gameLoop);
    };

    const generatePlatform = (y) => {
        const typeRand = Math.random();
        let type = 'normal';
        if (stateRef.current.score > 1000 && typeRand > 0.8) type = 'moving';
        if (stateRef.current.score > 2000 && typeRand > 0.9) type = 'break';

        const w = 70;
        const x = Math.random() * (WIDTH - w);

        stateRef.current.platforms.push({
            x, y, w, type,
            vx: type === 'moving' ? 2 : 0,
            broken: false
        });

        // Item Chance
        if (Math.random() < 0.05) {
            stateRef.current.items.push({
                x: x + 20, y: y - 40, type: 'balloon', collected: false
            });
        }
    };

    const spawnParticles = (x, y, color) => {
        for (let i = 0; i < 8; i++) {
            stateRef.current.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                life: 1.0, color
            });
        }
    };

    const gameLoop = () => {
        if (gameState === 'GAMEOVER') return; // React state isn't instant in loop?
        // Actually, rely on ref or just loop cancellation.

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const state = stateRef.current;
        const sheet = state.sheet;

        // --- UPDATE ---
        const player = state.player;

        // Tilt Control
        player.x += (inputRef.current - player.x) * 0.15;
        // Wrap
        if (player.x < -20) player.x = WIDTH + 20;
        if (player.x > WIDTH + 20) player.x = -20;

        // Physics
        player.vy += GRAVITY;
        player.y += player.vy;

        // State for animation
        player.state = player.vy < 0 ? 'JUMP' : 'FALL';

        // Camera Follow
        if (player.y < HEIGHT / 2) {
            const shift = (HEIGHT / 2) - player.y;
            player.y = HEIGHT / 2;
            state.cameraY += shift;
            state.score += Math.floor(shift);
            setScore(state.score);

            // Move Objects
            state.platforms.forEach(p => p.y += shift);
            state.items.forEach(i => i.y += shift);
            state.particles.forEach(p => p.y += shift);

            // Clean & Gen
            const oldLen = state.platforms.length;
            state.platforms = state.platforms.filter(p => p.y < HEIGHT + 50);
            if (state.platforms.length < oldLen) {
                // Generate new
                const highest = state.platforms.reduce((min, p) => Math.min(min, p.y), HEIGHT);
                generatePlatform(highest - 80 - Math.random() * 40);
            }
        }

        // Platforms Logic
        state.platforms.forEach(p => {
            // Move
            if (p.type === 'moving') {
                p.x += p.vx;
                if (p.x < 0 || p.x + p.w > WIDTH) p.vx *= -1;
            }

            // Collision (Only falling)
            if (player.vy > 0 &&
                player.x > p.x - 20 && player.x < p.x + p.w + 20 &&
                player.y + 40 > p.y && player.y + 40 < p.y + 20) {

                if (p.type === 'break') {
                    if (!p.broken) {
                        p.broken = true;
                        playCrash();
                        spawnParticles(p.x + p.w / 2, p.y, 'brown');
                    }
                } else {
                    player.vy = JUMP_FORCE;
                    playJump();
                    spawnParticles(player.x, player.y + 40, 'white');
                }
            }
        });

        // Items
        state.items.forEach(item => {
            if (!item.collected &&
                player.x > item.x - 30 && player.x < item.x + 30 &&
                player.y > item.y - 30 && player.y < item.y + 30) {

                item.collected = true;
                if (item.type === 'balloon') {
                    player.vy = -30; // Super Jump
                    playCollect();
                    spawnParticles(item.x, item.y, 'red');
                }
            }
        });

        // Death
        if (player.y > HEIGHT) {
            setGameState('GAMEOVER');
            playCrash();
            if (state.score > highScore) {
                setHighScore(state.score);
                if (updateStat) updateStat('merchJumpHighScore', state.score);
            }
            return;
        }

        // Particles
        state.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        });
        state.particles = state.particles.filter(p => p.life > 0);

        // --- DRAW ---
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // BG Grid (Virtual)
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        const offY = state.cameraY % 50;
        for (let l = 0; l < HEIGHT; l += 50) {
            ctx.beginPath(); ctx.moveTo(0, l + offY); ctx.lineTo(WIDTH, l + offY); ctx.stroke();
        }

        // Platforms
        state.platforms.forEach(p => {
            if (p.type === 'break' && p.broken) return; // Don't draw broken

            // Sprite Logic?
            // Prompt: Platform Normal, Moving, Breakable.
            // Let's rely on standard sprites if available or fallback.
            if (sheet && sheet.complete) {
                // Mock Slicing based on Prompt Grid
                // Row 1: Normal, Moving, Breakable?
                // Let's assume 3 cols, 3 rows basically.
                // Normal: 0,1. Moving: 1,1. Break: 2,1.
                const sw = sheet.width / 3;
                const sh = sheet.height / 3;
                let sx = 0; let sy = sh; // Row 1
                if (p.type === 'moving') sx = sw;
                if (p.type === 'break') sx = sw * 2;

                ctx.drawImage(sheet, sx, sy, sw, sh, p.x, p.y, p.w, 20);
            } else {
                ctx.fillStyle = p.type === 'moving' ? 'cyan' : p.type === 'break' ? 'brown' : '#0f0';
                ctx.fillRect(p.x, p.y, p.w, 15);
                ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle;
            }
        });

        // Items
        state.items.forEach(i => {
            if (i.collected) return;
            if (sheet && sheet.complete) {
                // Balloon: Row 2, Col 0
                const sw = sheet.width / 3;
                const sh = sheet.height / 3;
                ctx.drawImage(sheet, 0, sh * 2, sw, sh, i.x - 15, i.y, 30, 40);
            } else {
                ctx.fillStyle = 'red';
                ctx.beginPath(); ctx.arc(i.x, i.y, 15, 0, Math.PI * 2); ctx.fill();
            }
        });

        // Player
        if (sheet && sheet.complete) {
            // Player: Row 0. Col 0 (Idle/Stand), 1 (Jump), 2 (Fall)
            const sw = sheet.width / 3;
            const sh = sheet.height / 3;
            let col = 0;
            if (player.state === 'JUMP') col = 1;
            if (player.state === 'FALL') col = 2;

            ctx.drawImage(sheet, col * sw, 0, sw, sh, player.x - 25, player.y - 30, 50, 60);
        } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(player.x - 20, player.y - 30, 40, 60);
        }

        // Particles
        state.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        stateRef.current.animId = requestAnimationFrame(gameLoop);
    };

    const handleInput = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scale = WIDTH / rect.width;
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        inputRef.current = x * scale;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Orbitron", monospace' }}>
            <h1 style={{ color: '#0f0', textShadow: '0 0 10px #0f0', marginBottom: '20px' }}>MERCH JUMP</h1>

            <div style={{ position: 'relative', border: '2px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
                <canvas
                    ref={canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseMove={handleInput}
                    onTouchMove={handleInput}
                    style={{ background: '#111', cursor: 'crosshair', maxWidth: '100%' }}
                />

                {gameState === 'MENU' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
                        <SquishyButton onClick={initGame} style={{ fontSize: '2rem', padding: '20px 50px', background: '#0f0', color: 'black' }}>JUMP</SquishyButton>
                    </div>
                )}

                {gameState === 'GAMEOVER' && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                        <GameOverCard score={stateRef.current.score} bestScore={highScore} gameId="merch_jump" onReplay={initGame} onHome={() => window.location.href = '/arcade'} />
                    </div>
                )}

                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontWeight: 'bold' }}>
                    SCORE: {score}
                </div>
            </div>

            <p style={{ color: '#666', marginTop: '10px' }}>Mouse / Touch to Move</p>
        </div>
    );
};

export default MerchJump;
