import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import SquishyButton from './SquishyButton';

const AVATARS = [
    '/assets/skins/face_default.png',
    '/assets/skins/face_money.png',
    '/assets/skins/face_bear.png',
    '/assets/skins/face_bunny.png',
];

const OnboardingModal = () => {
    const { updateProfile, earnCoins, userProfile } = useGamification() || {};
    const [visible, setVisible] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(AVATARS[0]);

    useEffect(() => {
        // Check if onboarding is done
        const hasOnboarded = localStorage.getItem('arcade_hasOnboarded');
        if (!hasOnboarded) {
            setVisible(true);
        }
    }, []);

    const handleComplete = () => {
        if (!name.trim()) {
            alert("IDENTIFICATION REQUIRED. ENTER CODE NAME.");
            return;
        }

        if (updateProfile && earnCoins) {
            // 1. Update Profile
            updateProfile({ name: name.toUpperCase(), avatar: avatar });

            // 2. Award Starter Funds
            earnCoins(500);

            // 3. Mark Complete
            localStorage.setItem('arcade_hasOnboarded', 'true');

            // 4. Close with Animation
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            setVisible(false);
        }
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)'
        }}>
            <div className="bento-card" style={{
                background: '#1a202c', width: '90%', maxWidth: '500px',
                borderRadius: '30px', padding: '40px',
                border: '4px solid var(--neon-blue)',
                boxShadow: '0 0 50px rgba(0,255,255,0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', color: 'white'
            }}>
                <h1 style={{
                    fontSize: '2rem', marginBottom: '10px',
                    background: 'linear-gradient(to right, #00f260, #0575E6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                    WELCOME OPERATOR
                </h1>
                <p style={{ color: '#a0aec0', marginBottom: '30px', letterSpacing: '1px' }}>
                    INITIALIZE PROFILE TO RECEIVE <span style={{ color: '#ecc94b', fontWeight: 'bold' }}>500 COINS</span>
                </p>

                {/* AVATAR SELECTOR */}
                <div style={{ marginBottom: '20px', width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#a0aec0', fontSize: '0.8rem' }}>SELECT AVATAR</label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        {AVATARS.map(src => (
                            <div
                                key={src}
                                onClick={() => setAvatar(src)}
                                style={{
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    border: avatar === src ? '4px solid var(--neon-blue)' : '2px solid #4a5568',
                                    overflow: 'hidden', cursor: 'pointer',
                                    transform: avatar === src ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.2s',
                                    boxShadow: avatar === src ? '0 0 20px var(--neon-blue)' : 'none'
                                }}
                            >
                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* NAME INPUT */}
                <div style={{ marginBottom: '30px', width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#a0aec0', fontSize: '0.8rem' }}>CODENAME</label>
                    <input
                        type="text"
                        placeholder="ENTER NAME..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%', padding: '15px', borderRadius: '15px',
                            background: '#2d3748', border: '2px solid #4a5568',
                            color: 'white', fontSize: '1.2rem', textAlign: 'center',
                            outline: 'none', textTransform: 'uppercase'
                        }}
                    />
                </div>

                <SquishyButton
                    onClick={handleComplete}
                    style={{
                        width: '100%', padding: '20px', fontSize: '1.2rem',
                        background: 'linear-gradient(90deg, #00f260, #0575E6)',
                        boxShadow: '0 10px 30px rgba(0, 242, 96, 0.4)'
                    }}
                >
                    INITIALIZE SYSTEM 🚀
                </SquishyButton>
            </div>
        </div>
    );
};

export default OnboardingModal;
