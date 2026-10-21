import React from 'react';
import { motion } from 'framer-motion';
import { usePocketBro, POCKET_BRO_STAGES } from '../context/PocketBroContext';

const EVOLUTION_BRANCHES = [
    {
        id: 'branch_mech',
        name: 'MECHA OVERLORD',
        type: 'ROBOT',
        icon: '🤖',
        color: '#00f0ff',
        perk: '+15% CP BOOST IN ALL ARCADE GAMES',
        desc: 'Forged from overclocked processors. Gains XP through high scores and typing hacking.'
    },
    {
        id: 'branch_dragon',
        name: 'CYBER DRAGON',
        type: 'DINO',
        icon: '🐲',
        color: '#ff0055',
        perk: '+20% MULTIPLIER ON CRASH & COIN DOZER',
        desc: 'High-voltage apex predator. Thrives on high stakes and long adventure runs.'
    },
    {
        id: 'branch_king',
        name: 'GOLDEN KING SLIME',
        type: 'SLIME',
        icon: '👑',
        color: '#ffd700',
        perk: '+10% CASINO DIVIDENDS & FREE SCRATCH TICKETS',
        desc: 'Formed from concentrated Cyber Points and jackpot wins in the Underworld.'
    },
    {
        id: 'branch_void',
        name: 'VOID SPECTER',
        type: 'GHOST',
        icon: '👻',
        color: '#a855f7',
        perk: '2X ADVENTURE LOOT DROPS DURING NIGHT HOURS',
        desc: 'Phase-shifts between reality and the net. Awakened by midnight operations.'
    },
    {
        id: 'branch_angel',
        name: 'CELESTIAL ARCHON',
        type: 'ORB',
        icon: '😇',
        color: '#ffffff',
        perk: 'PERMANENT +25% XP GROWTH & INSTANT STAMINA',
        desc: 'Pure harmonic energy entity achieved through maximum happiness and immaculate care.'
    }
];

const PocketBroEvolutionTree = () => {
    const { stats } = usePocketBro();

    const stageKeys = Object.keys(POCKET_BRO_STAGES);
    const currentIdx = stageKeys.indexOf(stats.stage);
    const currentConfig = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES['EGG'];
    const nextStageKey = stageKeys[currentIdx + 1];
    const nextConfig = nextStageKey ? POCKET_BRO_STAGES[nextStageKey] : null;

    let progressPct = 100;
    if (nextConfig) {
        const span = nextConfig.threshold - currentConfig.threshold;
        const currentInSpan = stats.xp - currentConfig.threshold;
        progressPct = Math.min(100, Math.max(0, (currentInSpan / span) * 100));
    }

    return (
        <div style={{
            maxWidth: '920px',
            margin: '0 auto',
            color: '#fff',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            {/* Header Stage Status */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(168, 85, 247, 0.15))',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#00f0ff', letterSpacing: '2px', fontFamily: 'monospace' }}>
                            GENETIC MATRIX & EVOLUTIONARY TREE
                        </div>
                        <h2 style={{ margin: '4px 0', fontSize: '1.6rem', color: '#fff', letterSpacing: '1px' }}>
                            CURRENT FORM: {currentConfig.name.toUpperCase()} ({stats.stage})
                        </h2>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            CURRENT XP: {Math.floor(stats.xp)} {nextConfig ? `/ ${nextConfig.threshold} XP NEEDED` : '(MAX STAGE ACHIEVED)'}
                        </div>
                    </div>

                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '2px solid #00f0ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                    }}>
                        {currentConfig.icon}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                        <span>NEXT EVOLUTION MILESTONE: {nextConfig ? nextConfig.name.toUpperCase() : 'PEAK SYNTHESIS'}</span>
                        <span>{Math.round(progressPct)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 1 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #00f0ff, #a855f7)', boxShadow: '0 0 10px #00f0ff' }}
                        />
                    </div>
                </div>
            </div>

            {/* Linear Milestones */}
            <div style={{
                background: 'rgba(10, 15, 26, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px'
            }}>
                <h3 style={{ fontSize: '1rem', color: '#00f0ff', margin: '0 0 16px 0', letterSpacing: '1px' }}>
                    🧬 EVOLUTION TIMELINE
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px'
                }}>
                    {stageKeys.map((stageKey, i) => {
                        const conf = POCKET_BRO_STAGES[stageKey];
                        const isUnlocked = currentIdx >= i;
                        const isCurrent = stats.stage === stageKey;

                        return (
                            <div
                                key={stageKey}
                                style={{
                                    background: isCurrent
                                        ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(168, 85, 247, 0.2))'
                                        : (isUnlocked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.4)'),
                                    border: isCurrent
                                        ? '2px solid #00f0ff'
                                        : (isUnlocked ? '1px solid rgba(255, 255, 255, 0.15)' : '1px dashed #334155'),
                                    borderRadius: '14px',
                                    padding: '16px 12px',
                                    textAlign: 'center',
                                    boxShadow: isCurrent ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none',
                                    opacity: isUnlocked ? 1 : 0.5
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{conf.icon}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isCurrent ? '#00f0ff' : '#fff' }}>
                                    {conf.name}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>
                                    {conf.threshold} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Branching Class Archetypes */}
            <div style={{
                background: 'rgba(10, 15, 26, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px'
            }}>
                <h3 style={{ fontSize: '1rem', color: '#a855f7', margin: '0 0 16px 0', letterSpacing: '1px' }}>
                    ⚡ BRANCHING ARCHETYPES & PASSIVE PERKS
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {EVOLUTION_BRANCHES.map(branch => {
                        const isMyType = (stats.type || '').includes(branch.type);

                        return (
                            <motion.div
                                key={branch.id}
                                whileHover={{ y: -4 }}
                                style={{
                                    background: isMyType
                                        ? `linear-gradient(135deg, ${branch.color}22, rgba(0,0,0,0.8))`
                                        : 'rgba(255, 255, 255, 0.03)',
                                    border: isMyType ? `2px solid ${branch.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    boxShadow: isMyType ? `0 0 20px ${branch.color}44` : 'none',
                                    position: 'relative'
                                }}
                            >
                                {isMyType && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px', right: '12px',
                                        background: branch.color,
                                        color: '#000',
                                        fontSize: '0.6rem',
                                        fontWeight: '900',
                                        padding: '2px 8px',
                                        borderRadius: '8px'
                                    }}>
                                        ACTIVE CLASS
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '2rem' }}>{branch.icon}</span>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: branch.color }}>{branch.name}</h4>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>TYPE: {branch.type}</div>
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    border: `1px solid ${branch.color}44`,
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    fontSize: '0.72rem',
                                    fontWeight: 'bold',
                                    color: branch.color,
                                    marginBottom: '10px',
                                    fontFamily: 'monospace'
                                }}>
                                    ⭐ {branch.perk}
                                </div>

                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4', fontFamily: 'sans-serif' }}>
                                    {branch.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PocketBroEvolutionTree;
