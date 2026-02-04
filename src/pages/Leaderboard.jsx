import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useSquad } from '../context/SquadContext';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import { supabase } from '../lib/supabaseClient';

const MOCK_RIVALS = [
    { name: 'NullPtr', squad: 'CYBER', xp: 50000, coins: 12000, avatar: '/assets/avatar_robot.png' },
    { name: 'SunGazer', squad: 'SOLAR', xp: 48000, coins: 9000, avatar: '/assets/avatar_alien.png' },
    { name: 'GhostInShell', squad: 'VOID', xp: 45000, coins: 15000, avatar: '/assets/avatar_ghost.png' },
    { name: 'BitWise', squad: 'CYBER', xp: 32000, coins: 5000, avatar: '/assets/merchboy_face.png' },
    { name: 'CosmicDust', squad: 'SOLAR', xp: 28000, coins: 8000, avatar: '/assets/merchboy_face.png' },
    { name: 'ShadowRealm', squad: 'VOID', xp: 25000, coins: 20000, avatar: '/assets/merchboy_face.png' },
    { name: 'GlitchKing', squad: 'CYBER', xp: 15000, coins: 2000, avatar: '/assets/merchboy_face.png' },
    { name: 'StarLord', squad: 'SOLAR', xp: 12000, coins: 1000, avatar: '/assets/merchboy_face.png' },
    { name: 'VoidWalker', squad: 'VOID', xp: 8000, coins: 500, avatar: '/assets/merchboy_face.png' },
    { name: 'NewbieBot', squad: 'CYBER', xp: 1000, coins: 100, avatar: '/assets/merchboy_face.png' }
];

const Leaderboard = () => {
    const { userProfile, getLevelInfo, coins } = useGamification();
    const { totalXP } = getLevelInfo();
    const { squadScores } = useSquad();

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, CYBER, SOLAR, VOID

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            let data = [];

            // 1. Try Fetch Real
            if (supabase) {
                const { data: realData } = await supabase
                    .from('profiles')
                    .select('display_name, squad, xp, coins, avatar_url')
                    .order('xp', { ascending: false })
                    .limit(20);

                if (realData && realData.length > 0) {
                    data = realData.map(d => ({
                        name: d.display_name,
                        squad: d.squad || 'NEUTRAL',
                        xp: d.xp || 0,
                        coins: d.coins || 0,
                        avatar: d.avatar_url,
                        isUser: false
                    }));
                }
            }

            // 2. Mix in Mock Data if sparse
            if (data.length < 10) {
                data = [...data, ...MOCK_RIVALS];
            }

            // 3. Add Current User (if not already fetched)
            if (!data.find(p => p.name === userProfile.name)) {
                data.push({
                    name: userProfile.name,
                    squad: userProfile.squad || 'NEUTRAL',
                    xp: totalXP,
                    coins: coins,
                    avatar: userProfile.avatar,
                    isUser: true
                });
            }

            // 4. Sort
            data.sort((a, b) => b.xp - a.xp);

            // 5. Rank
            data = data.map((p, i) => ({ ...p, rank: i + 1 }));

            setPlayers(data);
            setLoading(false);
        };

        fetchLeaderboard();
    }, [userProfile, totalXP, coins]);

    const filteredPlayers = filter === 'ALL' ? players : players.filter(p => p.squad === filter);

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            padding: '40px 20px',
            paddingBottom: '120px',
            color: 'white',
            fontFamily: '"Rajdhani", sans-serif',
            maxWidth: '800px', margin: '0 auto'
        }}>
            <h1 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 10px 0', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                HALL OF LEGENDS
            </h1>
            <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '40px' }}>GLOBAL RANKINGS // SEASON 1</p>

            {/* SQUAD SCOREBOARD */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                {Object.entries(squadScores || { CYBER: 0, SOLAR: 0, VOID: 0 }).map(([squad, score]) => {
                    let color = '#fff';
                    if (squad === 'CYBER') color = '#00ffcc';
                    if (squad === 'SOLAR') color = '#ffcc00';
                    if (squad === 'VOID') color = '#ff0055';

                    return (
                        <div key={squad} style={{
                            background: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.5))`,
                            borderBottom: `4px solid ${color}`,
                            padding: '15px', textAlign: 'center',
                            borderRadius: '8px 8px 0 0'
                        }}>
                            <div style={{ fontWeight: 'bold', color: color }}>{squad}</div>
                            <div style={{ fontSize: '1.5rem' }}>{score.toLocaleString()}</div>
                        </div>
                    );
                })}
            </div>

            {/* FILTERS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {['ALL', 'CYBER', 'SOLAR', 'VOID'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            background: filter === f ? '#fff' : 'transparent',
                            color: filter === f ? '#000' : '#fff',
                            border: '1px solid #555',
                            padding: '5px 20px', borderRadius: '20px',
                            cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loading ? <div style={{ textAlign: 'center' }}>CALCULATING...</div> : filteredPlayers.map((p) => (
                    <motion.div
                        key={`${p.name}-${p.rank}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: p.rank * 0.05 }}
                    >
                        <TiltCard
                            style={{
                                padding: '15px 20px',
                                background: p.isUser ? 'linear-gradient(90deg, rgba(0,255,200,0.1), rgba(0,0,0,0))' : 'rgba(20,20,30,0.8)',
                                border: p.isUser ? '1px solid #00ffcc' : '1px solid #333',
                                display: 'flex', alignItems: 'center', gap: '20px'
                            }}
                            glowColor={p.isUser ? "rgba(0,255,200,0.3)" : "rgba(255,255,255,0.1)"}
                        >
                            <div style={{
                                fontSize: '1.5rem', fontWeight: 'bold', width: '40px', textAlign: 'center',
                                color: p.rank === 1 ? 'gold' : (p.rank === 2 ? 'silver' : (p.rank === 3 ? '#cd7f32' : '#666'))
                            }}>
                                #{p.rank}
                            </div>

                            <img src={p.avatar || "/assets/merchboy_face.png"} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {p.name}
                                    {p.squad && <span style={{
                                        fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px',
                                        background: '#333', color: '#aaa'
                                    }}>{p.squad}</span>}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>OPERATOR</div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{p.xp.toLocaleString()} XP</div>
                                <div style={{ color: 'gold', fontSize: '0.8rem' }}>🪙 {p.coins.toLocaleString()}</div>
                            </div>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
