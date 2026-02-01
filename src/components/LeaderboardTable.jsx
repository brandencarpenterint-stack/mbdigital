import React, { useEffect, useState } from 'react';
import { LeaderboardService } from '../services/LeaderboardService';
import { useGamification } from '../context/GamificationContext';

const LeaderboardTable = ({ gameId }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setViewedProfile } = useGamification();

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            const data = await LeaderboardService.getTopScores(gameId);
            setScores(data);
            setLoading(false);
        };
        fetchScores();
    }, [gameId]);

    const handleRowClick = (entry) => {
        // Construct a partial profile from leaderboard data
        const partialProfile = {
            name: entry.player,
            // Generate a consistent avatar if we don't have one, or use a default
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`,
            code: 'UNKNOWN',
            squad: null,
            stats: {
                gameHighScore: entry.score // Just show what we know
            },
            isMock: true // Flag to tell ProfileModal this is a partial view
        };
        setViewedProfile(partialProfile);
    };

    if (loading) return <div style={{ color: '#666' }}>Loading Global Ranks...</div>;

    return (
        <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '10px' }}>
            <h3 style={{ textAlign: 'center', color: 'gold', margin: '0 0 10px 0' }}>🏆 GLOBAL TOP 10</h3>
            {scores.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999' }}>No scores yet. Be the first!</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <tbody>
                        {scores.map((entry, idx) => (
                            <tr
                                key={idx}
                                onClick={() => handleRowClick(entry)}
                                style={{
                                    borderBottom: '1px solid #333',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '8px', color: idx < 3 ? 'gold' : 'white', fontWeight: idx < 3 ? 'bold' : 'normal' }}>
                                    #{idx + 1}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {/* Avatar Fallback */}
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.player}`}
                                                alt="av"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        {entry.player}
                                    </div>
                                </td>
                                <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                    {entry.score.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LeaderboardTable;
