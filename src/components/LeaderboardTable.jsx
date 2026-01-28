import React, { useEffect, useState } from 'react';
import { LeaderboardService } from '../services/LeaderboardService';

const LeaderboardTable = ({ gameId }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            const data = await LeaderboardService.getTopScores(gameId);
            setScores(data);
            setLoading(false);
        };
        fetchScores();
    }, [gameId]);

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
                            <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '8px', color: idx < 3 ? 'gold' : 'white', fontWeight: idx < 3 ? 'bold' : 'normal' }}>
                                    #{idx + 1}
                                </td>
                                <td style={{ padding: '8px' }}>{entry.player}</td>
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
