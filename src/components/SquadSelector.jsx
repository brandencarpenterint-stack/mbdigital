import React from 'react';
import { useSquad } from '../context/SquadContext';

const SquadSelector = () => {
    const { userSquad, joinSquad } = useSquad();

    if (userSquad) return null; // Already joined

    const handleJoin = (team) => {
        if (navigator.vibrate) navigator.vibrate([50, 50, 200]);
        joinSquad(team);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: '"Press Start 2P", monospace', textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '40px', color: '#fff', textShadow: '0 0 20px white' }}>CHOOSE YOUR SQUAD</h1>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* TEAM NEON */}
                <div
                    onClick={() => handleJoin('NEON')}
                    style={{
                        background: '#ff0055', padding: '40px', borderRadius: '20px',
                        cursor: 'pointer', border: '5px solid #fff',
                        boxShadow: '0 0 50px #ff0055',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        width: '200px',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚡</div>
                    <h2>TEAM NEON</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>High Energy. Glitch. Chaos.</p>
                </div>

                {/* TEAM ZEN */}
                <div
                    onClick={() => handleJoin('ZEN')}
                    style={{
                        background: '#00ccff', padding: '40px', borderRadius: '20px',
                        cursor: 'pointer', border: '5px solid #fff',
                        boxShadow: '0 0 50px #00ccff',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        width: '200px',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌀</div>
                    <h2>TEAM ZEN</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Chill. Flow. Precision.</p>
                </div>
            </div>

            <p style={{ marginTop: '40px', color: '#888', maxWidth: '600px', lineHeight: '1.6' }}>
                Your choice is permanent for this season. All game points you earn will contribute to your Squad's global dominance.
            </p>
        </div>
    );
};

export default SquadSelector;
