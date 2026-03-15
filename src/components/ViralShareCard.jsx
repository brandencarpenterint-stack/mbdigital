import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import SquishyButton from './SquishyButton';
import { useGamification } from '../context/GamificationContext';

const ViralShareCard = ({ onClose }) => {
    const { userProfile, stats, unlockedAchievements, getLevelInfo, coins } = useGamification();
    const cardRef = useRef(null);

    const levelInfo = getLevelInfo(stats.xp || 0);
    const totalPlaytime = Math.floor((stats.totalPlayTime || 0) / 60); // minutes? assuming seconds
    const achievementsCount = unlockedAchievements.length;
    const rareBadges = unlockedAchievements.slice(0, 5); // Just grab first 5 for now

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2, // Retina quality
                logging: false,
                useCORS: true // For images
            });
            const image = canvas.toDataURL("image/png");

            // Trigger Download
            const link = document.createElement('a');
            link.href = image;
            link.download = `MERCHBOY_STATS_${userProfile.name}.png`;
            link.click();
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <h2 style={{ color: 'var(--neon-green)', textShadow: '0 0 10px var(--neon-green)', marginBottom: '20px' }}>YOUR LEGACY CARD</h2>

            {/* THE CARD ITSELF */}
            <div ref={cardRef} style={{
                width: '350px',
                background: '#111',
                border: '2px solid var(--neon-blue)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                fontFamily: '"Press Start 2P", monospace'
            }}>
                {/* Header / Banner */}
                <div style={{
                    background: 'linear-gradient(45deg, #FF0055, #7928ca)',
                    padding: '20px',
                    textAlign: 'center',
                    borderBottom: '2px solid #333'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white',
                        margin: '0 auto 10px', overflow: 'hidden', background: '#000'
                    }}>
                        <img src={userProfile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', textShadow: '2px 2px 0px #000' }}>{userProfile.name}</h3>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', marginTop: '5px' }}>OPERATOR ID: {userProfile.code}</div>
                </div>

                {/* Body Stats */}
                <div style={{ padding: '20px', background: 'repeating-linear-gradient(45deg, #111 0px, #111 10px, #151515 10px, #151515 20px)' }}>

                    {/* Level Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>CURRENT LEVEL</div>
                        <div style={{ fontSize: '1.5rem', color: 'var(--neon-gold)', textShadow: '0 0 10px gold' }}>{levelInfo.level}</div>
                    </div>

                    {/* Grid Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <div style={statBoxStyle}>
                            <div style={labelStyle}>EARNINGS</div>
                            <div style={valStyle}>🪙 {coins.toLocaleString()}</div>
                        </div>
                        <div style={statBoxStyle}>
                            <div style={labelStyle}>TROPHIES</div>
                            <div style={valStyle}>🏆 {achievementsCount}</div>
                        </div>
                        <div style={statBoxStyle}>
                            <div style={labelStyle}>FISH CAUGHT</div>
                            <div style={valStyle}>🐟 {stats.fishCaught || 0}</div>
                        </div>
                        <div style={statBoxStyle}>
                            <div style={labelStyle}>HIGH SCORE</div>
                            <div style={valStyle}>🚀 {stats.galaxyHighScore || 0}</div>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div style={{
                        borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ fontSize: '0.6rem', color: '#555' }}>
                            GENERATED BY<br />
                            <span style={{ color: 'var(--neon-blue)' }}>MERCHBOY DIGITAL</span>
                        </div>
                        <div style={{ fontSize: '1.5rem' }}>👾</div>
                    </div>
                </div>

                {/* Glitch Overlay Effect */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)',
                    backgroundSize: '100% 4px',
                    pointerEvents: 'none', opacity: 0.3
                }} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <SquishyButton onClick={handleDownload} style={{ background: 'var(--neon-gold)', color: 'black', padding: '15px 30px' }}>
                    ⬇ SAVE IMAGE
                </SquishyButton>
                <SquishyButton onClick={onClose} style={{ background: '#333' }}>
                    CLOSE
                </SquishyButton>
            </div>
        </div>
    );
};

const statBoxStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #333', padding: '10px', borderRadius: '8px'
};
const labelStyle = {
    fontSize: '0.6rem', color: '#666', marginBottom: '5px'
};
const valStyle = {
    fontSize: '0.9rem', color: 'white'
};

export default ViralShareCard;
