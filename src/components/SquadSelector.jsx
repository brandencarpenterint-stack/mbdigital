import React from 'react';
import { useSquad } from '../context/SquadContext';
import { useToast } from '../context/ToastContext';

const SquadSelector = () => {
    const { userSquad, joinSquad, getSquadDetails } = useSquad();
    const { showToast } = useToast();

    if (userSquad) return null; // Already joined

    const handleJoin = (team) => {
        if (navigator.vibrate) navigator.vibrate([50, 50, 200]);
        joinSquad(team);
        const details = getSquadDetails(team);
        showToast(`Joined ${details.name}!`, "success");
    };

    const SQUADS = [
        { id: 'CYBER', desc: 'Technology & Speed', perk: '-10% Shop Costs' },
        { id: 'SOLAR', desc: 'Light & Growth', perk: '+10% XP Gain' },
        { id: 'VOID', desc: 'Mystery & Luck', perk: 'Crit Chance Up' }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: '"Press Start 2P", monospace', textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '40px', color: '#fff', textShadow: '0 0 20px white', fontSize: '1.5rem', lineHeight: '2rem' }}>
                CHOOSE YOUR FACTION
            </h1>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '90%' }}>
                {SQUADS.map(s => {
                    const details = getSquadDetails(s.id);
                    return (
                        <div
                            key={s.id}
                            onClick={() => handleJoin(s.id)}
                            style={{
                                background: `linear-gradient(145deg, ${details.color}22, #000)`,
                                padding: '30px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                border: `2px solid ${details.color}`,
                                boxShadow: `0 0 20px ${details.color}44`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                width: '220px',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = `0 0 40px ${details.color}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = `0 0 20px ${details.color}44`;
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '20px', filter: `drop-shadow(0 0 10px ${details.color})` }}>
                                {details.icon}
                            </div>
                            <h2 style={{ color: details.color, fontSize: '1.2rem', marginBottom: '10px' }}>{details.name}</h2>
                            <p style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '15px' }}>{s.desc}</p>
                            <div style={{
                                background: details.color, color: '#000',
                                padding: '5px 10px', borderRadius: '5px',
                                fontSize: '0.6rem', fontWeight: 'bold'
                            }}>
                                {s.perk}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p style={{ marginTop: '40px', color: '#666', fontSize: '0.7rem', maxWidth: '600px', lineHeight: '1.6' }}>
                Your choice is permanent for this season. Choose wisely.
            </p>
        </div>
    );
};

export default SquadSelector;
