const state = {
    barPos: 0,
    fishPos: 0,
    catchPercent: 25,
    battleFish: { id: 'snake', emoji: '🐍' }
};

const GAME_WIDTH = 800;
const BAR_AREA_HEIGHT = 300;
const BAR_HEIGHT = 50;
const invRef = { current: [] };

const ctx = {
    save: () => console.log('save'),
    restore: () => console.log('restore'),
    translate: (x, y) => console.log('translate', x, y),
    scale: (x, y) => console.log('scale', x, y),
    drawImage: () => console.log('drawImage'),
    fillText: (text, x, y) => console.log('fillText', text, x, y),
    fillRect: (x, y, w, h) => console.log('fillRect', x, y, w, h),
    strokeRect: (x, y, w, h) => console.log('strokeRect', x, y, w, h),
};

const sheetRefs = { current: {} };

const drawFish = (ctx, fish, x, y, size = 50, dir = 1) => {
    const img = fish.sheet && sheetRefs.current[fish.sheet];
    if (img && img.complete && img.width > 0) {
        // ...
    } else {
        ctx.save();
        ctx.translate(x, y);
        if (dir === -1) ctx.scale(-1, 1);
        ctx.font = `${size}px serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(fish.emoji || '?', 0, 0);
        ctx.restore();
    }
};

const drawBattle = (ctx, state) => {
    const trackX = GAME_WIDTH / 2 - 25; const trackY = 50;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(trackX, trackY, 50, BAR_AREA_HEIGHT);
    ctx.strokeStyle = 'white'; ctx.strokeRect(trackX, trackY, 50, BAR_AREA_HEIGHT);

    const effectiveBarHeight = invRef.current.includes('bigbar') ? BAR_HEIGHT * 1.2 : BAR_HEIGHT;

    const barY = (trackY + BAR_AREA_HEIGHT) - state.barPos - effectiveBarHeight;
    const fishY = (trackY + BAR_AREA_HEIGHT) - state.fishPos - 40;

    const overlap = (state.barPos < state.fishPos + 40 && state.barPos + effectiveBarHeight > state.fishPos);

    ctx.fillStyle = overlap ? '#00ff00' : 'rgba(0,255,0,0.4)';
    ctx.fillRect(trackX + 2, barY, 46, effectiveBarHeight);

    drawFish(ctx, state.battleFish, trackX + 25, fishY + 20, 40);

    const h = (state.catchPercent / 100) * BAR_AREA_HEIGHT;
    if (overlap) { ctx.fillStyle = '#00ff00'; ctx.font = 'bold 24px monospace'; ctx.fillText("REELING!", GAME_WIDTH / 2 - 40, 40); }
    ctx.fillStyle = overlap ? 'cyan' : 'gold';
    ctx.fillRect(trackX + 60, (trackY + BAR_AREA_HEIGHT) - h, 20, h);
};

drawBattle(ctx, state);
