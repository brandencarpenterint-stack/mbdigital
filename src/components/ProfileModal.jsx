import React, { useState } from 'react';
import SquishyButton from './SquishyButton';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { useGamification } from '../context/GamificationContext';

const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/face_money.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
];

const ProfileModal = ({ onClose }) => {
    const { unlockedAchievements, stats, userProfile, updateProfile } = useGamification();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(userProfile.name);
    const [editAvatar, setEditAvatar] = useState(userProfile.avatar);

    const totalUnlocked = unlockedAchievements.length;
    const progress = Math.floor((totalUnlocked / ACHIEVEMENTS.length) * 100);

    const handleSave = () => {
        updateProfile({ name: editName, avatar: editAvatar });
        setIsEditing(false);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 5000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="bento-card" style={{
                background: '#1a202c', width: '90%', maxWidth: '600px', maxHeight: '90vh',
                borderRadius: '30px', padding: '30px',
                border: '2px solid #2d3748',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                color: 'white'
            }}>
                {/* HEAD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(90deg, #63b3ed, #4299e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        OPERATOR PROFILE
                    </h2>
                    <SquishyButton onClick={onClose} style={{ padding: '5px 15px', background: '#e53e3e' }}>X</SquishyButton>
                </div>

                {isEditing ? (
                    // EDIT MODE
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#a0aec0' }}>CODENAME</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                    width: '100%', padding: '15px', borderRadius: '10px',
                                    border: '2px solid #4a5568', background: '#2d3748', color: 'white',
                                    fontSize: '1.2rem', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', color: '#a0aec0' }}>AVATAR</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                {AVATARS.map(src => (
                                    <div
                                        key={src}
                                        onClick={() => setEditAvatar(src)}
                                        style={{
                                            border: editAvatar === src ? '3px solid #63b3ed' : '2px solid #4a5568',
                                            borderRadius: '15px', overflow: 'hidden',
                                            cursor: 'pointer', aspectRatio: '1/1',
                                            background: '#2d3748'
                                        }}
                                    >
                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <SquishyButton onClick={handleSave} style={{ width: '100%', background: '#48bb78', padding: '15px' }}>
                            SAVE CHANGES
                        </SquishyButton>
                    </div>
                ) : (
                    // VIEW MODE
                    <div style={{ flex: 1, overflowY: 'auto' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid white', overflow: 'hidden' }}>
                                <img src={userProfile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{userProfile.name}</h3>
                                <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: '#63b3ed', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                                    EDIT PROFILE ✏️
                                </button>
                            </div>
                        </div>

                        {/* STATS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ background: '#2d3748', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 'bold' }}>ACHIEVEMENTS</div>
                                <div style={{ color: '#ecc94b', fontSize: '2rem', fontWeight: '900', margin: '5px 0' }}>{totalUnlocked} / {ACHIEVEMENTS.length}</div>
                                <div style={{ width: '100%', height: '6px', background: '#4a5568', marginTop: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #ecc94b, #d69e2e)' }}></div>
                                </div>
                            </div>
                            <div style={{ background: '#2d3748', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 'bold' }}>FISH CAUGHT</div>
                                <div style={{ color: '#63b3ed', fontSize: '2rem', fontWeight: '900', margin: '5px 0' }}>{stats.fishCaught}</div>
                            </div>
                        </div>

                        {/* BADGES */}
                        <h3 style={{ color: '#a0aec0', paddingBottom: '10px', fontSize: '1.2rem', borderBottom: '1px solid #4a5568' }}>TROPHY ROOM</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '15px', paddingBottom: '20px' }}>
                            {ACHIEVEMENTS.map(ach => {
                                const isUnlocked = unlockedAchievements.includes(ach.id);
                                return (
                                    <div key={ach.id} style={{
                                        background: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                                        border: isUnlocked ? '2px solid #ecc94b' : '1px solid #4a5568',
                                        borderRadius: '15px', padding: '15px',
                                        opacity: isUnlocked ? 1 : 0.5,
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h4 style={{ margin: '0', color: isUnlocked ? 'white' : '#a0aec0', fontSize: '0.9rem' }}>{ach.title}</h4>
                                            {isUnlocked && <span style={{ fontSize: '1.2rem' }}>🏆</span>}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e0', lineHeight: '1.3' }}>{ach.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
