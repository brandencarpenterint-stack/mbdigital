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
            background: 'rgba(0,0,0,0.9)', zIndex: 5000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: '#1a1a2e', width: '90%', maxWidth: '600px', maxHeight: '90vh',
                borderRadius: '20px', padding: '20px',
                border: '2px solid #00ccff',
                boxShadow: '0 0 30px rgba(0, 204, 255, 0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* HEAD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                    <h2 style={{ margin: 0, color: 'white' }}>👤 GAMER PROFILE</h2>
                    <SquishyButton onClick={onClose} style={{ padding: '5px 15px', background: '#333' }}>X</SquishyButton>
                </div>

                {/* CONTENT */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {/* STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                        <div style={{ background: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>ACHIEVEMENTS</div>
                            <div style={{ color: 'gold', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalUnlocked} / {ACHIEVEMENTS.length}</div>
                            <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '5px', borderRadius: '2px' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'gold', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                        <div style={{ background: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>FISH CAUGHT</div>
                            <div style={{ color: '#00ccff', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.fishCaught}</div>
                        </div>
                    </div>

                    {/* BADGES */}
                    <h3 style={{ color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '5px' }}>TROPHY ROOM</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginTop: '10px' }}>
                        {ACHIEVEMENTS.map(ach => {
                            const isUnlocked = unlockedAchievements.includes(ach.id);
                            return (
                                <div key={ach.id} style={{
                                    background: isUnlocked ? 'linear-gradient(45deg, #222, #333)' : '#0f0f15',
                                    border: isUnlocked ? '1px solid gold' : '1px solid #333',
                                    borderRadius: '10px', padding: '15px',
                                    opacity: isUnlocked ? 1 : 0.5,
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: '0 0 5px 0', color: isUnlocked ? 'gold' : '#666' }}>{ach.title}</h4>
                                        {isUnlocked && <span style={{ fontSize: '1.2rem' }}>🏆</span>}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa' }}>{ach.description}</p>
                                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: isUnlocked ? '#00ff00' : '#444' }}>
                                        REWARD: {ach.reward}
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
