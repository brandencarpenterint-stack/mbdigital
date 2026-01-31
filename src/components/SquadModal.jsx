import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';

const SQUADS = [
    {
        id: 'CYBER',
        name: 'CYBER PUNKS',
        icon: '🦾',
        color: '#00f3ff',
        desc: 'Technology is power. We hack the system.',
        perk: '-10% Shop Costs'
    },
    {
        id: 'SOLAR',
        name: 'SOLAR KNIGHTS',
        icon: '☀️',
        color: '#ffaa00',
        desc: 'Light brings life. We protect the weak.',
        perk: '+10% XP Gain'
    },
    {
        id: 'VOID',
        name: 'VOID WALKERS',
        icon: '🌑',
        color: '#9d00ff',
        desc: 'Embrace the darkness. We explore the unknown.',
        perk: 'Crit Chance Up'
    }
];

const SquadModal = ({ onClose }) => {
    const { updateProfile, userProfile, triggerConfetti } = useGamification();
    const { showToast } = useToast();

    const joinSquad = (squadId) => {
        updateProfile({ squad: squadId });
        showToast(`Joined ${SQUADS.find(s => s.id === squadId).name}!`, "success");
        triggerConfetti();
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '600px',
                padding: '30px',
                border: '2px solid #fff',
                position: 'relative',
                textAlign: 'center'
            }}>
                <h1 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1.5rem', marginBottom: '20px', color: 'white' }}>
                    CHOOSE YOUR FACTION
                </h1>
                <p style={{ color: '#aaa', marginBottom: '30px' }}>
                    This choice is permanent. Choose wisely.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                    {SQUADS.map(squad => (
                        <div key={squad.id} style={{
                            border: `2px solid ${squad.color}`,
                            borderRadius: '10px',
                            padding: '20px',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onClick={() => joinSquad(squad.id)}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{squad.icon}</div>
                            <h3 style={{ color: squad.color, margin: '5px 0' }}>{squad.name}</h3>
                            <p style={{ fontSize: '0.7rem', color: '#ccc', margin: '10px 0' }}>{squad.desc}</p>
                            <div style={{
                                background: squad.color, color: 'black',
                                padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 'bold'
                            }}>
                                {squad.perk}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    style={{ marginTop: '30px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                >
                    Decide Later
                </button>
            </div>
        </div>
    );
};

export default SquadModal;
