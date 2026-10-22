import React from 'react';

/**
 * GameEmblems.jsx
 * Bespoke, high-precision vector emblems for each game in MBDigital Arcade.
 * Replaces duplicated placeholder stickers with studio-grade iconography.
 */

const BaseEmblem = ({ color = '#00f0ff', children }) => (
    <div style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 16px ${color}88)`
    }}>
        {children}
    </div>
);

export const EmblemCrash = () => (
    <BaseEmblem color="#ffd700">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
    </BaseEmblem>
);

export const EmblemMines = () => (
    <BaseEmblem color="#00ff66">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" fill="rgba(0, 255, 102, 0.2)"/>
            <circle cx="12" cy="12" r="2" fill="#00ff66"/>
            <line x1="12" y1="2" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/>
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/>
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>
        </svg>
    </BaseEmblem>
);

export const EmblemHiLo = () => (
    <BaseEmblem color="#00e5ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="13" height="16" rx="2" fill="rgba(0, 229, 255, 0.15)"/>
            <path d="M8 2h10a2 2 0 0 1 2 2v14"/>
            <polyline points="7 14 9.5 11 12 14"/>
            <line x1="9.5" y1="11" x2="9.5" y2="17"/>
        </svg>
    </BaseEmblem>
);

export const EmblemScratchers = () => (
    <BaseEmblem color="#ffd700">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(255, 215, 0, 0.15)"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
            <circle cx="7" cy="14.5" r="1.5" fill="#ffd700"/>
            <circle cx="12" cy="14.5" r="1.5" fill="#ffd700"/>
            <circle cx="17" cy="14.5" r="1.5" fill="#ffd700"/>
        </svg>
    </BaseEmblem>
);

export const EmblemBlackjack = () => (
    <BaseEmblem color="#00ff66">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="12" height="16" rx="2" fill="rgba(0, 255, 102, 0.15)"/>
            <path d="M14 6h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8"/>
            <text x="8" y="15" fill="#00ff66" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="monospace">A</text>
        </svg>
    </BaseEmblem>
);

export const EmblemRoulette = () => (
    <BaseEmblem color="#00e5ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="rgba(0, 229, 255, 0.15)"/>
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="2" x2="12" y2="7"/>
            <line x1="12" y1="17" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="7" y2="12"/>
            <line x1="17" y1="12" x2="22" y2="12"/>
            <circle cx="15.5" cy="8.5" r="1.5" fill="#ffd700"/>
        </svg>
    </BaseEmblem>
);

export const EmblemDerby = () => (
    <BaseEmblem color="#00ff66">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18c2-3 5-4 9-3l3-4h3l-1 4 3 2c-3 1-5 4-8 5l-4-1-3 2z"/>
            <circle cx="17" cy="8" r="1.5" fill="#00ff66"/>
        </svg>
    </BaseEmblem>
);

export const EmblemSlots = () => (
    <BaseEmblem color="#ffd700">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="rgba(255, 215, 0, 0.15)"/>
            <line x1="8" y1="4" x2="8" y2="20"/>
            <line x1="16" y1="4" x2="16" y2="20"/>
            <text x="5" y="14" fill="#ffd700" fontSize="7" fontWeight="bold">7</text>
            <text x="12" y="14" fill="#ffd700" fontSize="7" fontWeight="bold" textAnchor="middle">7</text>
            <text x="19" y="14" fill="#ffd700" fontSize="7" fontWeight="bold" textAnchor="end">7</text>
        </svg>
    </BaseEmblem>
);

export const EmblemUnderworld = () => (
    <BaseEmblem color="#c084fc">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a9 9 0 0 0-9 9c0 4 3 7 5 8v3h8v-3c2-1 5-4 5-8a9 9 0 0 0-9-9z" fill="rgba(192, 132, 252, 0.15)"/>
            <circle cx="9" cy="11" r="1.5" fill="#c084fc"/>
            <circle cx="15" cy="11" r="1.5" fill="#c084fc"/>
        </svg>
    </BaseEmblem>
);

export const EmblemDozer = () => (
    <BaseEmblem color="#00f0ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(0, 240, 255, 0.15)"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <circle cx="7" cy="15.5" r="2" fill="#ffd700"/>
            <circle cx="12" cy="15.5" r="2" fill="#ffd700"/>
            <circle cx="17" cy="15.5" r="2" fill="#ffd700"/>
        </svg>
    </BaseEmblem>
);

export const EmblemPinball = () => (
    <BaseEmblem color="#ff007f">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff007f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 20 8 18 21 6 21 4 8 12 2" fill="rgba(255, 0, 127, 0.15)"/>
            <circle cx="12" cy="10" r="2.5" fill="#00f0ff"/>
            <line x1="7" y1="18" x2="10" y2="16"/>
            <line x1="17" y1="18" x2="14" y2="16"/>
        </svg>
    </BaseEmblem>
);

export const EmblemPlinko = () => (
    <BaseEmblem color="#a855f7">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 3 21 21 3 21 12 3" fill="rgba(168, 85, 247, 0.15)"/>
            <circle cx="12" cy="9" r="1.5" fill="#a855f7"/>
            <circle cx="9.5" cy="13" r="1.5" fill="#a855f7"/>
            <circle cx="14.5" cy="13" r="1.5" fill="#a855f7"/>
            <circle cx="7" cy="17" r="1.5" fill="#a855f7"/>
            <circle cx="12" cy="17" r="1.5" fill="#00f0ff"/>
            <circle cx="17" cy="17" r="1.5" fill="#a855f7"/>
        </svg>
    </BaseEmblem>
);

export const EmblemDrift = () => (
    <BaseEmblem color="#ff007f">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff007f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2.5" fill="#00f0ff"/>
            <path d="M9.5 17h5"/>
            <circle cx="17" cy="17" r="2.5" fill="#00f0ff"/>
        </svg>
    </BaseEmblem>
);

export const EmblemDefense = () => (
    <BaseEmblem color="#00c6ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00c6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(0, 198, 255, 0.15)"/>
            <circle cx="12" cy="11" r="3" fill="#00c6ff"/>
        </svg>
    </BaseEmblem>
);

export const EmblemGalaxy = () => (
    <BaseEmblem color="#00f0ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 16 10 22 13 18 16 19 22 12 18 5 22 6 16 2 13 8 10 12 2" fill="rgba(0, 240, 255, 0.15)"/>
            <circle cx="12" cy="12" r="3" fill="#ff0055"/>
        </svg>
    </BaseEmblem>
);

export const EmblemFlappy = () => (
    <BaseEmblem color="#ffd700">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="12" r="6" fill="rgba(255, 215, 0, 0.15)"/>
            <circle cx="13" cy="10" r="1.5" fill="#000"/>
            <path d="M17 12l4-2-4-2"/>
            <ellipse cx="8" cy="13" rx="4" ry="2.5" fill="#00f0ff"/>
        </svg>
    </BaseEmblem>
);

export const EmblemWheel = () => (
    <BaseEmblem color="#ffd700">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="rgba(255, 215, 0, 0.15)"/>
            <circle cx="12" cy="12" r="3" fill="#ffd700"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"/>
        </svg>
    </BaseEmblem>
);

export const EmblemBricks = () => (
    <BaseEmblem color="#da22ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#da22ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="9" height="5" rx="1" fill="rgba(218, 34, 255, 0.2)"/>
            <rect x="13" y="3" width="9" height="5" rx="1" fill="rgba(218, 34, 255, 0.2)"/>
            <rect x="5" y="10" width="9" height="5" rx="1" fill="rgba(218, 34, 255, 0.2)"/>
            <circle cx="12" cy="18" r="2" fill="#00f0ff"/>
        </svg>
    </BaseEmblem>
);

export const EmblemSnake = () => (
    <BaseEmblem color="#38ef7d">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38ef7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18v-4a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/>
            <circle cx="6" cy="18" r="2" fill="#38ef7d"/>
        </svg>
    </BaseEmblem>
);

export const EmblemUnboxing = () => (
    <BaseEmblem color="#ff007f">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff007f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" fill="rgba(255, 0, 127, 0.15)"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
        </svg>
    </BaseEmblem>
);

export const EmblemArena = () => (
    <BaseEmblem color="#ff0844">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff0844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="4" x2="20" y2="20"/>
            <line x1="20" y1="4" x2="4" y2="20"/>
            <polyline points="2 6 4 4 6 6"/>
            <polyline points="18 4 20 4 20 6"/>
            <polyline points="4 18 4 20 6 20"/>
            <polyline points="18 20 20 20 20 18"/>
        </svg>
    </BaseEmblem>
);

export const EmblemFaceRunner = () => (
    <BaseEmblem color="#00f260">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00f260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" stroke="#0575e6" strokeWidth="1.5" />
            <polygon points="12 4 19 12 12 20 5 12" fill="rgba(0, 242, 96, 0.2)" />
            <polyline points="9 10 12 7 15 10" stroke="#00f260" strokeWidth="2" />
            <line x1="12" y1="7" x2="12" y2="17" stroke="#00f260" strokeWidth="2" />
        </svg>
    </BaseEmblem>
);

export const EmblemBroCannon = () => (
    <BaseEmblem color="#FF512F">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF512F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18h16" stroke="#DD2476" strokeWidth="2" />
            <circle cx="8" cy="18" r="3" fill="rgba(255, 81, 47, 0.25)" />
            <path d="M7 15l10-8 3 4-10 8z" fill="rgba(221, 36, 118, 0.3)" />
            <circle cx="19" cy="8" r="1.5" fill="#ffd700" />
        </svg>
    </BaseEmblem>
);

export const EmblemMerchJump = () => (
    <BaseEmblem color="#66a6ff">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#66a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16" stroke="#89f7fe" strokeWidth="2" />
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#66a6ff" strokeWidth="2.5" />
            <circle cx="12" cy="4" r="2" fill="#89f7fe" />
        </svg>
    </BaseEmblem>
);

export const EmblemFishing = () => (
    <BaseEmblem color="#00C6FF">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 4l-4 4m0 0l-6 6" stroke="#0072FF" strokeWidth="2" />
            <path d="M6 16c2 0 4 2 4 4" />
            <path d="M14 8c4-2 6 0 6 3s-4 4-6 3" fill="rgba(0, 198, 255, 0.25)" />
            <circle cx="18" cy="10" r="1" fill="#fff" />
        </svg>
    </BaseEmblem>
);

export const EmblemWhack = () => (
    <BaseEmblem color="#FF416C">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF416C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="8" height="12" rx="2" fill="rgba(255, 65, 108, 0.25)" stroke="#FF4B2B" strokeWidth="2" />
            <line x1="11" y1="11" x2="21" y2="11" stroke="#FF416C" strokeWidth="3" strokeLinecap="round" />
            <line x1="2" y1="2" x2="5" y2="5" stroke="#ffd700" strokeWidth="2" />
            <line x1="2" y1="20" x2="5" y2="17" stroke="#ffd700" strokeWidth="2" />
        </svg>
    </BaseEmblem>
);

export const EmblemMemory = () => (
    <BaseEmblem color="#64f38c">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64f38c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="8" height="12" rx="2" fill="rgba(100, 243, 140, 0.2)" stroke="#f79d00" strokeWidth="1.5" />
            <rect x="13" y="8" width="8" height="12" rx="2" fill="rgba(100, 243, 140, 0.3)" stroke="#64f38c" strokeWidth="2" />
            <circle cx="17" cy="14" r="2" fill="#64f38c" />
            <circle cx="7" cy="10" r="1.5" fill="#f79d00" />
        </svg>
    </BaseEmblem>
);

