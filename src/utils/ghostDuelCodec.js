/**
 * Ghost Duel Codec & Interpolation Engine
 * Enables peer-to-peer async ghost racing without server costs.
 * Trajectories are quantized, downsampled to <= 80 keyframes, and URL-safe Base64 encoded.
 */

const MAX_KEYFRAMES = 85;

/**
 * Packs a raw ghost run into a compact structure and encodes to URL-safe string
 */
export const encodeGhostRun = ({ gameId, playerName = 'Player', skinId = 'face_default', finalScore = 0, keyframes = [] }) => {
    try {
        if (!keyframes || keyframes.length === 0) return null;

        // Downsample keyframes if exceeding MAX_KEYFRAMES
        let sampled = keyframes;
        if (keyframes.length > MAX_KEYFRAMES) {
            const step = keyframes.length / MAX_KEYFRAMES;
            sampled = [];
            for (let i = 0; i < MAX_KEYFRAMES - 1; i++) {
                sampled.push(keyframes[Math.floor(i * step)]);
            }
            sampled.push(keyframes[keyframes.length - 1]); // Always include finish
        }

        // Pack frames: [timestamp_ms, x, y_or_score]
        const packedFrames = sampled.map(k => [
            Math.round(k.t || 0),
            Math.round(k.x || 0),
            Math.round(k.y !== undefined ? k.y : (k.score || 0))
        ]);

        const compactPayload = {
            g: gameId,
            p: (playerName || 'Player').trim().slice(0, 14),
            k: skinId || 'face_default',
            s: Math.round(finalScore || 0),
            f: packedFrames
        };

        const jsonStr = JSON.stringify(compactPayload);
        // Base64 encoding with URL-safe replacements
        const b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) =>
            String.fromCharCode(parseInt(p1, 16))
        ));

        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (err) {
        console.error('Failed to encode ghost run:', err);
        return null;
    }
};

/**
 * Decodes a URL-safe Base64 string into a validated ghost run
 */
export const decodeGhostRun = (encodedStr) => {
    if (!encodedStr || typeof encodedStr !== 'string') return null;

    try {
        // Restore standard Base64
        let base64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }

        const decoded = decodeURIComponent(
            Array.prototype.map.call(atob(base64), c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );

        const data = JSON.parse(decoded);
        if (!data || !data.f || !Array.isArray(data.f) || data.f.length === 0) {
            return null;
        }

        // Reconstruct keyframe objects
        const keyframes = data.f.map(frame => ({
            t: frame[0],
            x: frame[1],
            y: frame[2],
            score: frame[2]
        }));

        const totalDuration = keyframes[keyframes.length - 1].t || 1;

        return {
            gameId: data.g || 'game',
            playerName: data.p || 'Rival',
            skinId: data.k || 'face_default',
            finalScore: data.s || 0,
            keyframes,
            totalDuration
        };
    } catch (err) {
        console.warn('Invalid ghost duel string:', err);
        return null;
    }
};

/**
 * Smoothly interpolates the ghost position and score at any elapsed time (in ms)
 * Returns { x, y, score, isFinished } at 60 FPS
 */
export const interpolateGhostPosition = (ghostData, elapsedMs) => {
    if (!ghostData || !ghostData.keyframes || ghostData.keyframes.length === 0) {
        return null;
    }

    const { keyframes, totalDuration } = ghostData;

    // Past final keyframe
    if (elapsedMs >= totalDuration) {
        const last = keyframes[keyframes.length - 1];
        return {
            x: last.x,
            y: last.y,
            score: last.score,
            isFinished: true
        };
    }

    // Before first keyframe
    if (elapsedMs <= keyframes[0].t) {
        const first = keyframes[0];
        return {
            x: first.x,
            y: first.y,
            score: first.score,
            isFinished: false
        };
    }

    // Binary / linear search for surrounding keyframes
    let i = 0;
    while (i < keyframes.length - 1 && keyframes[i + 1].t < elapsedMs) {
        i++;
    }

    const p0 = keyframes[i];
    const p1 = keyframes[i + 1];

    if (!p1) {
        return { x: p0.x, y: p0.y, score: p0.score, isFinished: true };
    }

    const span = p1.t - p0.t;
    const progress = span > 0 ? (elapsedMs - p0.t) / span : 0;
    const clampedProgress = Math.max(0, Math.min(1, progress));

    return {
        x: p0.x + (p1.x - p0.x) * clampedProgress,
        y: p0.y + (p1.y - p0.y) * clampedProgress,
        score: p0.score + (p1.score - p0.score) * clampedProgress,
        isFinished: false
    };
};

/**
 * Checks URL for `?duel=...` parameter and decodes it
 */
export const getGhostDuelFromUrl = () => {
    if (typeof window === 'undefined') return null;

    try {
        const params = new URLSearchParams(window.location.search);
        let duelParam = params.get('duel');

        if (!duelParam && window.location.hash) {
            const hashParts = window.location.hash.split('?');
            if (hashParts[1]) {
                const hashParams = new URLSearchParams(hashParts[1]);
                duelParam = hashParams.get('duel');
            }
        }

        if (duelParam) {
            return decodeGhostRun(duelParam);
        }
    } catch { /* ignore */ }

    return null;
};

/**
 * Saves a personal best ghost to localStorage
 */
export const savePersonalBestGhost = (gameId, ghostData) => {
    if (!gameId || !ghostData) return;
    try {
        const key = `mb_pb_ghost_${gameId}`;
        const existing = localStorage.getItem(key);
        if (existing) {
            const parsed = JSON.parse(existing);
            if (parsed.finalScore && parsed.finalScore >= ghostData.finalScore) {
                return; // Existing PB is higher
            }
        }
        localStorage.setItem(key, JSON.stringify(ghostData));
    } catch { /* ignore storage errors */ }
};

/**
 * Retrieves a personal best ghost from localStorage
 */
export const getPersonalBestGhost = (gameId) => {
    if (!gameId) return null;
    try {
        const item = localStorage.getItem(`mb_pb_ghost_${gameId}`);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

/**
 * Builds the full shareable Duel URL to copy to clipboard
 */
export const generateDuelShareUrl = (gamePath, ghostData) => {
    const encoded = encodeGhostRun(ghostData);
    if (!encoded) return '';
    const origin = window.location.origin;
    const cleanPath = gamePath.startsWith('/') ? gamePath : `/${gamePath}`;
    return `${origin}${cleanPath}?duel=${encoded}`;
};
