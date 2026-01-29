import React from 'react';
import SquishyButton from './SquishyButton';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { useGamification } from '../context/GamificationContext';

const ProfileModal = ({ onClose }) => {
    const { unlockedAchievements, stats } = useGamification();

    const totalUnlocked = unlockedAchievements.length;
    const progress = Math.floor((totalUnlocked / ACHIEVEMENTS.length) * 100);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 5000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="bento-card" style={{
                background: 'rgba(255, 255, 255, 0.95)', width: '90%', maxWidth: '600px', maxHeight: '90vh',
                borderRadius: '30px', padding: '30px',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                color: '#333'
            }}>
                {/* HEAD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px' }}>
                    <h2 className="text-gradient" style={{ margin: 0, fontSize: '2rem' }}>PROFILE</h2>
                    <SquishyButton onClick={onClose} style={{ padding: '5px 15px', background: '#333' }}>X</SquishyButton>
                </div>

                {/* CONTENT */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {/* STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>ACHIEVEMENTS</div>
                            <div style={{ color: '#d69e2e', fontSize: '2rem', fontWeight: '900', margin: '5px 0' }}>{totalUnlocked} / {ACHIEVEMENTS.length}</div>
                            <div style={{ width: '100%', height: '6px', background: '#edf2f7', marginTop: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #ecc94b, #d69e2e)', borderRadius: '3px' }}></div>
                            </div>
                        </div>
                        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>FISH CAUGHT</div>
                            <div style={{ color: '#3182ce', fontSize: '2rem', fontWeight: '900', margin: '5px 0' }}>{stats.fishCaught}</div>
                        </div>
                    </div>

                    {/* BADGES */}
                    <h3 style={{ color: '#4a5568', paddingBottom: '10px', fontSize: '1.2rem' }}>TROPHY ROOM</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '10px', paddingBottom: '20px' }}>
                        {ACHIEVEMENTS.map(ach => {
                            const isUnlocked = unlockedAchievements.includes(ach.id);
                            return (
                                <div key={ach.id} style={{
                                    background: isUnlocked ? 'white' : '#f7fafc',
                                    border: isUnlocked ? '2px solid #ecc94b' : '1px solid #e2e8f0',
                                    borderRadius: '15px', padding: '15px',
                                    opacity: isUnlocked ? 1 : 0.6,
                                    position: 'relative',
                                    boxShadow: isUnlocked ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: '0', color: isUnlocked ? '#2d3748' : '#a0aec0', fontSize: '0.9rem' }}>{ach.title}</h4>
                                        {isUnlocked && <span style={{ fontSize: '1.2rem' }}>🏆</span>}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096', lineHeight: '1.3' }}>{ach.description}</p>
                                    <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 'bold', color: isUnlocked ? '#38a169' : '#cbd5e0', background: isUnlocked ? '#f0fff4' : 'transparent', padding: '2px 8px', borderRadius: '10px', width: 'fit-content' }}>
                                        +{ach.reward} 🪙
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
