import React, { useState } from 'react';
import SquishyButton from './SquishyButton';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { STICKER_COLLECTIONS } from '../config/StickerDefinitions';
import { useGamification } from '../context/GamificationContext';
import { useSquad } from '../context/SquadContext';
import { feedService } from '../utils/feed';
import { triggerConfetti } from '../utils/confetti';

import PocketRoom from './PocketRoom';
import { DECOR_ITEMS } from '../config/DecorItems';
import SootSprite from './SootSprite';

const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/face_money.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
];

const MODEL_FRIENDS = [
    {
        name: 'NeonViper', code: 'NEON-9921', avatar: AVATARS[1], score: 5200,
        pocket_state: {
            decor: { background: 'bg_space' },
            placedItems: [{ id: 'item_bansai', x: 0, y: 0 }, { id: 'item_pc', x: 4, y: 4 }],
            stage: 'TEEN_NEON', happy: 80, hunger: 50
        }
    },
    {
        name: 'CyberWolf', code: 'CYBR-4422', avatar: AVATARS[2], score: 8100,
        pocket_state: {
            decor: { background: 'bg_magma' },
            placedItems: [{ id: 'item_lamp', x: 4, y: 0 }],
            stage: 'ADULT_BOSS', happy: 100, hunger: 100
        }
    },
];

const ProfileModal = ({ onClose }) => {
    const { unlockedAchievements, unlockedStickers, stats, userProfile, updateProfile, getLevelInfo, session, loginWithProvider, logout } = useGamification();
    const { userSquad, squadScores, getSquadDetails } = useSquad();
    const [activeTab, setActiveTab] = useState('PROFILE'); // PROFILE, SQUAD
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(userProfile.name);
    const [editAvatar, setEditAvatar] = useState(userProfile.avatar);

    // Sticker State
    const [isDecorating, setIsDecorating] = useState(false);
    const [localStickers, setLocalStickers] = useState(userProfile.placedStickers || []);

    const flattenedStickers = React.useMemo(() => {
        return STICKER_COLLECTIONS.flatMap(c => c.items);
    }, []);

    const getStickerUrl = (id) => {
        const found = flattenedStickers.find(s => s.id === id);
        return found || { icon: '❓' };
    };

    const handleAddSticker = (stickerId) => {
        const newSticker = {
            instanceId: Date.now(),
            id: stickerId,
            x: 150, // Center-ish
            y: 150,
            rotation: (Math.random() * 20) - 10
        };
        setLocalStickers([...localStickers, newSticker]);
    };

    const handleStickerDragEnd = (instanceId, info) => {
        // We need to track position relative to the modal?
        // Framer Motion 'drag' modifies the transform. To save, we need to update state.
        // However, updating state on every drag end re-renders.
        // Ideally we use a constraint ref.
        // Simplified: We assume visual persistence for now, but to SAVE we need values.
        // For this prototype, we'll let them visual-only drag, but saving exact offset is tricky without ref measurements.
        // Actually, let's just use visually relative movement.
        const { offset } = info;
        setLocalStickers(prev => prev.map(s => {
            if (s.instanceId === instanceId) {
                return { ...s, x: s.x + offset.x, y: s.y + offset.y };
            }
            return s;
        }));
    };

    const saveDecoration = () => {
        updateProfile({ placedStickers: localStickers });
        setIsDecorating(false);
    };

    const levelInfo = getLevelInfo();

    // Squad State
    const [friendCode, setFriendCode] = useState('');
    const [friends, setFriends] = useState(MODEL_FRIENDS);
    const [visitingFriend, setVisitingFriend] = useState(null);

    const totalUnlocked = unlockedAchievements.length;
    const progress = Math.floor((totalUnlocked / ACHIEVEMENTS.length) * 100);

    const handleSave = () => {
        updateProfile({ name: editName, avatar: editAvatar });
        setIsEditing(false);
    };

    const handleAddFriend = () => {
        if (!friendCode) return;
        // Mock Add
        const newFriend = {
            name: `AGENT-${Math.floor(Math.random() * 9000)}`,
            code: friendCode.toUpperCase(),
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
            score: Math.floor(Math.random() * 10000)
        };
        setFriends([...friends, newFriend]);
        setFriendCode('');
        feedService.publish(`added ${newFriend.name} to their Squad!`, 'shop');
    };

    const handleFlex = (friendName) => {
        feedService.publish(`flexed their High Score on ${friendName}! 💪`, 'win');
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
                color: 'white',
                position: 'relative' // Essential for sticker absolute pos
            }}>
                {/* HEAD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <h2
                            onClick={() => setActiveTab('PROFILE')}
                            style={{
                                margin: 0, fontSize: '1.5rem', cursor: 'pointer',
                                color: activeTab === 'PROFILE' ? '#63b3ed' : '#718096',
                                paddingBottom: '5px',
                                borderBottom: activeTab === 'PROFILE' ? '2px solid #63b3ed' : '2px solid transparent'
                            }}
                        >
                            PROFILE
                        </h2>
                        <h2
                            onClick={() => setActiveTab('SQUAD')}
                            style={{
                                margin: 0, fontSize: '1.5rem', cursor: 'pointer',
                                color: activeTab === 'SQUAD' ? '#63b3ed' : '#718096',
                                paddingBottom: '5px',
                                borderBottom: activeTab === 'SQUAD' ? '2px solid #63b3ed' : '2px solid transparent'
                            }}
                        >
                            SQUAD
                        </h2>
                    </div>
                    <SquishyButton onClick={onClose} style={{ padding: '5px 15px', background: '#e53e3e' }}>X</SquishyButton>
                </div>

                {activeTab === 'PROFILE' && (
                    isEditing ? (
                        // EDIT MODE
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-blue)', fontWeight: 'bold' }}>CODENAME</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '15px', borderRadius: '10px',
                                        border: '1px solid var(--neon-blue)', background: 'rgba(0,0,0,0.5)', color: 'white',
                                        fontSize: '1.2rem', outline: 'none', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--neon-blue)', fontWeight: 'bold' }}>AVATAR (PRESETS)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                    {AVATARS.map(src => (
                                        <div
                                            key={src}
                                            onClick={() => setEditAvatar(src)}
                                            style={{
                                                border: editAvatar === src ? '2px solid var(--neon-pink)' : '1px solid #444',
                                                borderRadius: '15px', overflow: 'hidden',
                                                cursor: 'pointer', aspectRatio: '1/1',
                                                background: 'rgba(0,0,0,0.3)',
                                                transform: editAvatar === src ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: editAvatar === src ? '0 0 15px var(--neon-pink)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', border: '1px solid #333' }}>
                                <label style={{ display: 'block', marginBottom: '10px', color: '#aaa', fontWeight: 'bold', fontSize: '0.8rem' }}>CLOUD SYNC</label>
                                {session ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: '#00ff00', marginBottom: '10px', fontSize: '0.9rem' }}>
                                            ✅ SYNCED AS {session.user.email}
                                        </div>
                                        <SquishyButton onClick={logout} style={{ background: '#333', fontSize: '0.8rem', padding: '5px 10px' }}>
                                            LOGOUT
                                        </SquishyButton>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button
                                            onClick={() => loginWithProvider('google')}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                padding: '12px', borderRadius: '10px', border: 'none',
                                                background: 'white', color: '#333', fontWeight: 'bold', cursor: 'pointer',
                                                transition: 'transform 0.1s'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>G</span> Sign in with Google
                                        </button>
                                        <button
                                            onClick={() => loginWithProvider('apple')}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                padding: '12px', borderRadius: '10px', border: 'none',
                                                background: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                                transition: 'transform 0.1s'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}></span> Sign in with Apple
                                        </button>
                                        <div style={{ fontSize: '0.7rem', color: '#666', textAlign: 'center', marginTop: '5px' }}>
                                            Login to save your progress permanently and track across devices.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <SquishyButton onClick={handleSave} style={{ width: '100%', background: 'linear-gradient(90deg, #00ff00, #00aa00)', color: 'black', fontWeight: 'bold', padding: '15px' }}>
                                SAVE CHANGES
                            </SquishyButton>
                        </div>
                    ) : (
                        // VIEW MODE
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--neon-blue)', overflow: 'hidden', boxShadow: '0 0 20px var(--neon-blue)' }}>
                                    <img src={userProfile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{userProfile.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                        <div style={{
                                            background: 'linear-gradient(90deg, var(--neon-pink), #7928ca)',
                                            padding: '2px 8px', borderRadius: '4px',
                                            fontSize: '0.8rem', fontWeight: 'bold',
                                            boxShadow: '0 0 10px var(--neon-pink)'
                                        }}>
                                            LVL {levelInfo.level}
                                        </div>
                                        <div style={{ flex: 1, height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${levelInfo.progress}%`, height: '100%', background: '#00ffaa', boxShadow: '0 0 10px #00ffaa' }} />
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{Math.floor(levelInfo.progress)}%</div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                                        {Math.floor(levelInfo.xp)} / {Math.floor(levelInfo.nextXP)} XP
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-blue)', cursor: 'pointer', padding: '5px 0 0 0', fontSize: '0.8rem', textDecoration: 'underline' }}>
                                            EDIT PROFILE ✏️
                                        </button>
                                        <button onClick={() => { setIsDecorating(true); setLocalStickers(userProfile.placedStickers || []); }} style={{ background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer', padding: '5px 0 0 0', fontSize: '0.8rem', textDecoration: 'underline' }}>
                                            DECORATE 🎨
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* STICKER LAYER (DECORATE MODE & VIEW MODE) */}
                            {(isDecorating || userProfile.placedStickers?.length > 0) && (
                                <div className="sticker-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: isDecorating ? 'auto' : 'none', zIndex: 10, overflow: 'hidden' }}>
                                    {(isDecorating ? localStickers : userProfile.placedStickers)?.map((sticker) => {
                                        const def = getStickerUrl(sticker.id);
                                        return (
                                            <motion.div
                                                key={sticker.instanceId || Math.random()}
                                                drag={isDecorating}
                                                dragMomentum={false}
                                                onDragEnd={(e, info) => handleStickerDragEnd(sticker.instanceId, info)}
                                                initial={{ x: sticker.x, y: sticker.y, rotate: sticker.rotation, scale: 0 }}
                                                animate={{ x: sticker.x, y: sticker.y, rotate: sticker.rotation, scale: 1 }}
                                                whileHover={isDecorating ? { scale: 1.2, cursor: 'grab' } : {}}
                                                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                                                style={{
                                                    position: 'absolute',
                                                    fontSize: '3rem',
                                                    filter: 'drop-shadow(2px 2px 0px rgba(255,255,255,0.5)) drop-shadow(0 5px 10px rgba(0,0,0,0.5))',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {def.image ? (
                                                    <img src={def.image} alt={def.name} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} />
                                                ) : (
                                                    def.icon || '❓'
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* DECORATION CONTROLS */}
                            {isDecorating && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '300px',
                                    background: 'rgba(0,0,0,0.9)', borderTop: '2px solid var(--neon-pink)',
                                    zIndex: 20, padding: '20px', display: 'flex', flexDirection: 'column'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, color: 'var(--neon-pink)' }}>STICKER COLLECTION</h3>
                                        <SquishyButton onClick={saveDecoration} style={{ padding: '5px 15px', background: '#00ff00', color: 'black' }}>
                                            DONE
                                        </SquishyButton>
                                    </div>
                                    <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                                        {/* Shows unlocked stickers */}
                                        {flattenedStickers.filter(s => unlockedStickers.includes(s.id)).map(s => (
                                            <div
                                                key={s.id}
                                                onClick={() => handleAddSticker(s.id)}
                                                style={{
                                                    fontSize: '2rem', background: 'rgba(255,255,255,0.1)',
                                                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    aspectRatio: '1/1', cursor: 'pointer'
                                                }}
                                            >
                                                {s.image ? <img src={s.image} style={{ width: '80%', height: '80%', objectFit: 'contain' }} /> : s.icon}
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>Drag icons to place. Click DONE to save.</p>
                                </div>
                            )}

                            {/* STATS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #333', padding: '15px', borderRadius: '20px', textAlign: 'center' }}>
                                    <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>ACHIEVEMENTS</div>
                                    <div style={{ color: 'gold', fontSize: '1.8rem', fontWeight: '900', margin: '5px 0', textShadow: '0 0 10px gold' }}>{totalUnlocked} <span style={{ fontSize: '1rem', color: '#555' }}>/ {ACHIEVEMENTS.length}</span></div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #333', padding: '15px', borderRadius: '20px', textAlign: 'center' }}>
                                    <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>FISH CAUGHT</div>
                                    <div style={{ color: 'var(--neon-blue)', fontSize: '1.8rem', fontWeight: '900', margin: '5px 0', textShadow: '0 0 10px var(--neon-blue)' }}>{stats.fishCaught}</div>
                                </div>
                            </div>

                            {/* BADGES */}
                            <h3 style={{ color: 'white', paddingBottom: '10px', fontSize: '1.2rem', borderBottom: '1px solid #333', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                TROPHY ROOM <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '10px' }}>{totalUnlocked}</span>
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', marginTop: '15px', paddingBottom: '20px' }}>
                                {ACHIEVEMENTS.map(ach => {
                                    const isUnlocked = unlockedAchievements.includes(ach.id);
                                    return (
                                        <div key={ach.id} style={{
                                            background: isUnlocked ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0,0,0,0))' : 'rgba(0,0,0,0.3)',
                                            border: isUnlocked ? '1px solid gold' : '1px solid #333',
                                            borderRadius: '15px', padding: '15px',
                                            opacity: isUnlocked ? 1 : 0.4,
                                            boxShadow: isUnlocked ? '0 0 15px rgba(255, 215, 0, 0.2)' : 'none',
                                            transform: isUnlocked ? 'translateY(-2px)' : 'none',
                                            transition: 'all 0.3s'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <h4 style={{ margin: '0', color: isUnlocked ? 'gold' : '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>{ach.title.toUpperCase()}</h4>
                                                {isUnlocked && <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 5px gold)' }}>🏆</span>}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: isUnlocked ? '#ddd' : '#666', lineHeight: '1.3' }}>{ach.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}

                {activeTab === 'SQUAD' && (
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {/* VIEWING A FRIEND'S ROOM? */}
                        {visitingFriend ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <button onClick={() => setVisitingFriend(null)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem' }}>⬅ BACK</button>
                                    <div style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>VISITING: {visitingFriend.name}</div>
                                    <div style={{ width: '50px' }}></div>
                                </div>

                                {/* THE ROOM VIEW */}
                                <div style={{
                                    width: '280px', height: '280px',
                                    background: '#222', borderRadius: '20px',
                                    position: 'relative', overflow: 'hidden',
                                    border: '4px solid #444',
                                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                                }}>
                                    {/* BACKGROUND */}
                                    {(() => {
                                        const bgId = visitingFriend.pocket_state?.decor?.background;
                                        const bgItem = DECOR_ITEMS.find(i => i.id === bgId);
                                        return (
                                            <div
                                                className={bgItem ? bgItem.className : ''}
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    background: bgItem ? bgItem.css.background : '#888',
                                                    backgroundImage: bgItem ? bgItem.css.backgroundImage : undefined
                                                }}
                                            />
                                        );
                                    })()}

                                    {/* FURNITURE & BRO */}
                                    <PocketRoom
                                        isEditing={false}
                                        customItems={visitingFriend.pocket_state?.placedItems}
                                    />

                                    {/* THE BRO */}
                                    <div style={{
                                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        zIndex: 20, pointerEvents: 'none'
                                    }}>
                                        <SootSprite
                                            stage={visitingFriend.pocket_state?.stage || 'EGG'}
                                            mood={visitingFriend.pocket_state?.happy > 50 ? 'happy' : 'sad'}
                                            skin={null} // TODO: Add skin to mock data
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <SquishyButton
                                        onClick={() => {
                                            feedService.publish(`petted ${visitingFriend.name}'s Bro!`, 'love');
                                            triggerConfetti();
                                        }}
                                        style={{ background: '#ed64a6', padding: '10px 30px' }}
                                    >
                                        👋 PET BRO
                                    </SquishyButton>
                                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px' }}>
                                        (Gives them +1 Happy)
                                    </div>
                                </div>

                            </div>
                        ) : (
                            /* SQUAD LIST VIEW (Normal) */
                            <>
                                <div style={{ background: '#2d3748', padding: '20px', borderRadius: '20px', marginBottom: '30px', textAlign: 'center' }}>
                                    <div style={{ color: '#a0aec0', fontSize: '0.9rem', marginBottom: '5px' }}>YOUR SQUAD ID</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#63b3ed', letterSpacing: '2px' }}>
                                        {userProfile.code || 'UNKNOWN'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '5px' }}>SHARE WITH FRIENDS</div>
                                </div>

                                {/* FACTION WAR STATUS */}
                                {userSquad && (() => {
                                    const details = getSquadDetails(userSquad);
                                    const totalScore = Object.values(squadScores).reduce((a, b) => a + b, 0);

                                    return (
                                        <div style={{ marginBottom: '30px', padding: '15px', border: `1px solid ${details.color}`, borderRadius: '15px', background: 'rgba(0,0,0,0.3)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                                <div style={{ fontSize: '2.5rem' }}>{details.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>ALLEGIANCE</div>
                                                    <h3 style={{ margin: 0, color: details.color, fontSize: '1.2rem' }}>{details.name.toUpperCase()}</h3>
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>GLOBAL CONFLICT</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {Object.keys(squadScores).map(key => {
                                                    const sq = getSquadDetails(key);
                                                    const sc = squadScores[key];
                                                    const pct = (sc / totalScore) * 100;
                                                    return (
                                                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem' }}>
                                                            <span style={{ width: '60px' }}>{sq.name.split(' ')[0]}</span>
                                                            <div style={{ flex: 1, height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${pct}%`, height: '100%', background: sq.color, transition: 'width 1s linear' }}></div>
                                                            </div>
                                                            <span>{Math.floor(pct)}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <h3 style={{ color: '#a0aec0', marginBottom: '15px' }}>ADD FRIENDS</h3>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                    <input
                                        type="text"
                                        placeholder="ENTER FRIEND CODE..."
                                        value={friendCode}
                                        onChange={(e) => setFriendCode(e.target.value)}
                                        style={{
                                            flex: 1, padding: '15px', borderRadius: '15px',
                                            background: '#2d3748', border: '2px solid #4a5568',
                                            color: 'white', fontSize: '1rem', outline: 'none'
                                        }}
                                    />
                                    <SquishyButton onClick={handleAddFriend} style={{ background: '#48bb78', padding: '0 25px' }}>Add</SquishyButton>
                                </div>

                                <h3 style={{ color: '#a0aec0', marginBottom: '15px' }}>YOUR ROSTER</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {friends.map((friend, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: '15px',
                                            background: 'rgba(255,255,255,0.05)', padding: '15px',
                                            borderRadius: '15px'
                                        }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                                                <img src={friend.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold' }}>{friend.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#718096' }}>BEST: {friend.score}m</div>
                                            </div>

                                            {/* VISIT BUTTON */}
                                            {friend.pocket_state && (
                                                <SquishyButton
                                                    onClick={() => setVisitingFriend(friend)}
                                                    style={{ fontSize: '0.8rem', padding: '8px 15px', background: 'var(--neon-blue)', marginRight: '5px' }}
                                                >
                                                    🏠
                                                </SquishyButton>
                                            )}

                                            <SquishyButton
                                                onClick={() => handleFlex(friend.name)}
                                                style={{ fontSize: '0.8rem', padding: '8px 15px', background: '#ed64a6' }}
                                            >
                                                😈
                                            </SquishyButton>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
