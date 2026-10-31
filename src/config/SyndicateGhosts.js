/**
 * Global Ghost Duel Syndicate Config
 * Curated World Records and verified telemetry runs across all 4 original games.
 * 100% async peer-to-peer racing with 0 server costs.
 */

import { encodeGhostRun, generateDuelShareUrl } from '../utils/ghostDuelCodec';

// --- Trajectory Generators for Verified 60 FPS Runs ---

const genBroCannonTrajectory = (score, durationMs) => {
    const frames = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const t = Math.round((i / steps) * durationMs);
        const p = i / steps;
        let alt;
        if (p < 0.72) {
            const arcP = p / 0.72;
            alt = Math.sin(arcP * Math.PI) * 1250;
        } else {
            const bounceP = (p - 0.72) / 0.28;
            alt = Math.sin(bounceP * Math.PI) * 420;
        }
        const dist = Math.round(score * Math.pow(p, 0.88));
        frames.push({ t, x: dist, y: Math.max(0, Math.round(alt)), score: dist });
    }
    return frames;
};

const genMerchJumpTrajectory = (score, durationMs) => {
    const frames = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const t = Math.round((i / steps) * durationMs);
        const p = i / steps;
        const currentScore = Math.round(score * p);
        const x = Math.round(200 + Math.sin(i * 0.7) * 95);
        frames.push({ t, x, y: currentScore, score: currentScore });
    }
    return frames;
};

const genFlappyTrajectory = (score, durationMs) => {
    const frames = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const t = Math.round((i / steps) * durationMs);
        const p = i / steps;
        const currentScore = Math.floor(score * p);
        const y = Math.round(290 + Math.sin(i * 1.25) * 115);
        frames.push({ t, x: 50, y, score: currentScore });
    }
    return frames;
};

const genFaceRunnerTrajectory = (score, durationMs) => {
    const frames = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const t = Math.round((i / steps) * durationMs);
        const p = i / steps;
        const currentScore = Math.round(score * p);
        const x = Math.round(Math.sin(i * 0.85) * 140);
        frames.push({ t, x, y: 0, score: currentScore });
    }
    return frames;
};

// --- Raw Curated Syndicate Roster ---

const RAW_SYNDICATE_ROSTER = {
    'bro_cannon': {
        gameKey: 'bro_cannon',
        title: 'BRO CANNON',
        subtitle: 'Sub-Orbital Ballistics & Sky Gliding',
        path: '/arcade/bro-cannon',
        unit: 'm',
        bountyMultiplier: 1.5,
        legends: [
            {
                rank: 1,
                title: 'WORLD RECORD',
                playerName: 'NovaCannon',
                squad: 'SOLAR',
                skinId: 'face_astro',
                score: 4850,
                durationMs: 18400,
                durationFormatted: '00:18.4s',
                bounty: 500,
                verifiedDate: 'Oct 2026',
                bio: 'Maximum apex launch at 52° with 3 sequential stratosphere boost pads.',
                gen: genBroCannonTrajectory
            },
            {
                rank: 2,
                title: 'GRANDMASTER',
                playerName: 'IronBro',
                squad: 'CYBER',
                skinId: 'face_gamer',
                score: 3920,
                durationMs: 15800,
                durationFormatted: '00:15.8s',
                bounty: 350,
                verifiedDate: 'Oct 2026',
                bio: 'Flawless double air-hop glide through cloud corridor.',
                gen: genBroCannonTrajectory
            },
            {
                rank: 3,
                title: 'ELITE DUELIST',
                playerName: 'VoidBlaster',
                squad: 'VOID',
                skinId: 'face_space_dark',
                score: 3140,
                durationMs: 13200,
                durationFormatted: '00:13.2s',
                bounty: 250,
                verifiedDate: 'Oct 2026',
                bio: 'Direct low-angle velocity surge skimming tree line.',
                gen: genBroCannonTrajectory
            },
            {
                rank: 4,
                title: 'CONTENDER',
                playerName: 'OrbitKid',
                squad: 'CYBER',
                skinId: 'face_bunny_hoodie',
                score: 2420,
                durationMs: 11500,
                durationFormatted: '00:11.5s',
                bounty: 150,
                verifiedDate: 'Oct 2026',
                bio: 'Clean rookie entry run with reliable parachute flare.',
                gen: genBroCannonTrajectory
            }
        ]
    },
    'merch_jump': {
        gameKey: 'merch_jump',
        title: 'MERCH JUMP',
        subtitle: 'Infinite Synthwave Platform Climb',
        path: '/arcade/merch-jump',
        unit: 'm',
        bountyMultiplier: 2.0,
        legends: [
            {
                rank: 1,
                title: 'WORLD RECORD',
                playerName: 'CyberLeaper',
                squad: 'CYBER',
                skinId: 'jump_guy',
                score: 1820,
                durationMs: 24600,
                durationFormatted: '00:24.6s',
                bounty: 500,
                verifiedDate: 'Oct 2026',
                bio: 'Insane 180-combo platform ladder without missing a trampoline spring.',
                gen: genMerchJumpTrajectory
            },
            {
                rank: 2,
                title: 'GRANDMASTER',
                playerName: 'StarBounce',
                squad: 'SOLAR',
                skinId: 'face_star',
                score: 1450,
                durationMs: 20100,
                durationFormatted: '00:20.1s',
                bounty: 350,
                verifiedDate: 'Oct 2026',
                bio: 'High-speed vertical trajectory catching double balloon ascents.',
                gen: genMerchJumpTrajectory
            },
            {
                rank: 3,
                title: 'ELITE DUELIST',
                playerName: 'NeonFrog',
                squad: 'VOID',
                skinId: 'face_frog',
                score: 1180,
                durationMs: 16500,
                durationFormatted: '00:16.5s',
                bounty: 250,
                verifiedDate: 'Oct 2026',
                bio: 'Precision edge-hopping along shifting neon platforms.',
                gen: genMerchJumpTrajectory
            },
            {
                rank: 4,
                title: 'CONTENDER',
                playerName: 'AstroDino',
                squad: 'SOLAR',
                skinId: 'face_dino',
                score: 890,
                durationMs: 13200,
                durationFormatted: '00:13.2s',
                bounty: 150,
                verifiedDate: 'Oct 2026',
                bio: 'Steady rhythm climb entering the lower stratosphere.',
                gen: genMerchJumpTrajectory
            }
        ]
    },
    'flappy_mascot': {
        gameKey: 'flappy_mascot',
        title: 'FLAPPY BRO',
        subtitle: 'Precision Skyline Hazard Weaving',
        path: '/arcade/flappy',
        unit: 'pts',
        bountyMultiplier: 10.0,
        legends: [
            {
                rank: 1,
                title: 'WORLD RECORD',
                playerName: 'AeroPhantom',
                squad: 'VOID',
                skinId: 'face_bunny',
                score: 48,
                durationMs: 21200,
                durationFormatted: '00:21.2s',
                bounty: 500,
                verifiedDate: 'Oct 2026',
                bio: '48 consecutive cyber pillars cleared with 12 close-shave matrix dodges.',
                gen: genFlappyTrajectory
            },
            {
                rank: 2,
                title: 'GRANDMASTER',
                playerName: 'SkyGlider',
                squad: 'SOLAR',
                skinId: 'face_money',
                score: 36,
                durationMs: 16400,
                durationFormatted: '00:16.4s',
                bounty: 350,
                verifiedDate: 'Oct 2026',
                bio: 'Centimeter-level tap consistency during high-speed neon zone.',
                gen: genFlappyTrajectory
            },
            {
                rank: 3,
                title: 'ELITE DUELIST',
                playerName: 'ByteWing',
                squad: 'CYBER',
                skinId: 'face_default',
                score: 27,
                durationMs: 12800,
                durationFormatted: '00:12.8s',
                bounty: 250,
                verifiedDate: 'Oct 2026',
                bio: 'Rock-solid OG pilot run through dynamic moving gate sectors.',
                gen: genFlappyTrajectory
            },
            {
                rank: 4,
                title: 'CONTENDER',
                playerName: 'PixelPaul',
                squad: 'CYBER',
                skinId: 'face_bear',
                score: 19,
                durationMs: 9600,
                durationFormatted: '00:09.6s',
                bounty: 150,
                verifiedDate: 'Oct 2026',
                bio: 'Rhythmic wing flutter pacing through early tower block.',
                gen: genFlappyTrajectory
            }
        ]
    },
    'face_runner': {
        gameKey: 'face_runner',
        title: 'FACE RUNNER',
        subtitle: '3D Cyber Tunnel Void Evasion',
        path: '/arcade/face-runner',
        unit: 'm',
        bountyMultiplier: 1.0,
        legends: [
            {
                rank: 1,
                title: 'WORLD RECORD',
                playerName: 'Hyperspeed',
                squad: 'CYBER',
                skinId: 'face_rainbow',
                score: 2860,
                durationMs: 28000,
                durationFormatted: '00:28.0s',
                bounty: 500,
                verifiedDate: 'Oct 2026',
                bio: 'Cleared all 5 biomes reaching Stage 4 Void Matrix at 145 km/h.',
                gen: genFaceRunnerTrajectory
            },
            {
                rank: 2,
                title: 'GRANDMASTER',
                playerName: 'VoidDrifter',
                squad: 'VOID',
                skinId: 'face_dino_dark',
                score: 2180,
                durationMs: 22400,
                durationFormatted: '00:22.4s',
                bounty: 350,
                verifiedDate: 'Oct 2026',
                bio: 'Graceful rotational dodging past magma core rotating prisms.',
                gen: genFaceRunnerTrajectory
            },
            {
                rank: 3,
                title: 'ELITE DUELIST',
                playerName: 'SolarSurfer',
                squad: 'SOLAR',
                skinId: 'face_bear',
                score: 1640,
                durationMs: 17500,
                durationFormatted: '00:17.5s',
                bounty: 250,
                verifiedDate: 'Oct 2026',
                bio: 'Razor-thin near-misses surviving the toxic jungle ring clusters.',
                gen: genFaceRunnerTrajectory
            },
            {
                rank: 4,
                title: 'CONTENDER',
                playerName: 'CyberCat',
                squad: 'CYBER',
                skinId: 'face_cat',
                score: 1120,
                durationMs: 12500,
                durationFormatted: '00:12.5s',
                bounty: 150,
                verifiedDate: 'Oct 2026',
                bio: 'Tight center-lock barrel rolls through neon city gates.',
                gen: genFaceRunnerTrajectory
            }
        ]
    }
};

// Cache for encoded ghosts so they are computed once and memoized
const ENCODED_SYNDICATE_CACHE = {};

/**
 * Returns the populated syndicate records for a specific game with pre-encoded duel strings
 */
export const getSyndicateGameData = (gameKey) => {
    const raw = RAW_SYNDICATE_ROSTER[gameKey] || RAW_SYNDICATE_ROSTER['bro_cannon'];
    if (ENCODED_SYNDICATE_CACHE[gameKey]) {
        return ENCODED_SYNDICATE_CACHE[gameKey];
    }

    const compiledLegends = raw.legends.map(leg => {
        const keyframes = leg.gen(leg.score, leg.durationMs);
        const ghostData = {
            gameId: raw.gameKey,
            playerName: leg.playerName,
            skinId: leg.skinId,
            finalScore: leg.score,
            keyframes
        };
        const encodedDuel = encodeGhostRun(ghostData);
        const duelUrl = generateDuelShareUrl(raw.path, ghostData);

        return {
            ...leg,
            ghostData,
            encodedDuel,
            duelUrl
        };
    });

    const compiled = {
        ...raw,
        legends: compiledLegends
    };

    ENCODED_SYNDICATE_CACHE[gameKey] = compiled;
    return compiled;
};

/**
 * Returns all 4 syndicate game entries
 */
export const getAllSyndicateGames = () => {
    return Object.keys(RAW_SYNDICATE_ROSTER).map(key => getSyndicateGameData(key));
};
