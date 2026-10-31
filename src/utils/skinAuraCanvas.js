import { getSkinAura } from '../config/SkinAuras';

/**
 * High-performance 60 FPS procedural particle & aura renderer for HTML5 Canvas games.
 * Pure math & vector drawing — zero external textures or DOM nodes required.
 */

/**
 * Draws a glowing energetic aura halo around a character in Canvas
 */
export const drawCanvasAura = (ctx, x, y, radius = 24, skinOrId, frame = 0) => {
    const { aura, tier } = getSkinAura(skinOrId);
    if (!aura) return;

    ctx.save();

    const pulse = Math.sin(frame * 0.08) * 4;
    const currentRadius = radius + pulse;

    // 1. Radial glow gradient
    const grad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, currentRadius + 14);
    grad.addColorStop(0, aura.glowColor || 'rgba(0, 240, 255, 0.4)');
    grad.addColorStop(0.6, aura.primaryColor + '33');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, currentRadius + 14, 0, Math.PI * 2);
    ctx.fill();

    // 2. Type-specific aura flair
    if (aura.id === 'CYBER_GLITCH') {
        // Digital glitch slice offset
        if (frame % 8 < 3) {
            ctx.strokeStyle = aura.secondaryColor;
            ctx.lineWidth = 2;
            const sliceY = y + (Math.sin(frame) * radius * 0.7);
            ctx.beginPath();
            ctx.moveTo(x - radius - 8, sliceY);
            ctx.lineTo(x + radius + 8, sliceY);
            ctx.stroke();
        }
    } else if (aura.id === 'SOLAR_FLARE') {
        // Solar corona spikes
        ctx.strokeStyle = aura.secondaryColor;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
            const angle = (frame * 0.05) + (i * Math.PI / 2);
            const sx = x + Math.cos(angle) * (radius + 2);
            const sy = y + Math.sin(angle) * (radius + 2);
            const ex = x + Math.cos(angle) * (radius + 9 + pulse);
            const ey = y + Math.sin(angle) * (radius + 9 + pulse);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
        }
    } else if (aura.id === 'VOID_MATRIX') {
        // Digital orbiting data bits
        ctx.fillStyle = aura.primaryColor;
        for (let i = 0; i < 3; i++) {
            const angle = (frame * -0.06) + (i * (Math.PI * 2 / 3));
            const bx = x + Math.cos(angle) * (radius + 6);
            const by = y + Math.sin(angle) * (radius + 6);
            ctx.fillRect(bx - 1.5, by - 1.5, 3, 3);
        }
    } else if (aura.id === 'PRISM_NOVA') {
        // Starlight 4-point sparkle flare
        ctx.strokeStyle = aura.primaryColor;
        ctx.lineWidth = 1.2;
        const flareSize = radius + 8 + pulse;
        ctx.beginPath();
        ctx.moveTo(x - flareSize, y);
        ctx.lineTo(x + flareSize, y);
        ctx.moveTo(x, y - flareSize);
        ctx.lineTo(x, y + flareSize);
        ctx.stroke();
    } else if (aura.id === 'GOLD_MIDAS') {
        // Golden sparkling halo ring
        ctx.strokeStyle = aura.primaryColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
    } else if (aura.id === 'ASTRO_PLASMA') {
        // Orbiting celestial ring
        ctx.strokeStyle = aura.primaryColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, radius + 8, (radius + 8) * 0.35, frame * 0.04, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
};

/**
 * Creates dynamic trail particles based on the equipped skin's aura
 */
export const createAuraTrailParticle = (x, y, skinOrId, options = {}) => {
    const { aura } = getSkinAura(skinOrId);
    const speed = aura?.speed || 5;

    const baseColor = Math.random() > 0.4 ? aura.primaryColor : aura.secondaryColor;

    return {
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: options.vx !== undefined ? options.vx + (Math.random() - 0.5) * speed * 0.4 : (Math.random() - 0.5) * speed,
        vy: options.vy !== undefined ? options.vy + (Math.random() - 0.5) * speed * 0.4 : (Math.random() - 0.5) * speed,
        life: 1.0,
        decay: options.decay || (0.025 + Math.random() * 0.02),
        size: options.size || (3 + Math.random() * 4),
        color: baseColor,
        auraType: aura.id,
        char: aura.id === 'VOID_MATRIX' ? (Math.random() > 0.5 ? '1' : '0') : null
    };
};

/**
 * Updates and renders a list of aura particles on Canvas
 */
export const updateAndRenderAuraParticles = (ctx, particlesList) => {
    for (let i = particlesList.length - 1; i >= 0; i--) {
        const p = particlesList[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
            particlesList.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);

        if (p.auraType === 'VOID_MATRIX' && p.char) {
            ctx.fillStyle = p.color;
            ctx.font = 'bold 10px monospace';
            ctx.fillText(p.char, p.x, p.y);
        } else if (p.auraType === 'CYBER_GLITCH') {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size * 1.4, p.size * 0.6);
        } else if (p.auraType === 'PRISM_NOVA') {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
};
