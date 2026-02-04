import React, { useState, useEffect } from 'react';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import PocketPet from './pocket-pet/PocketPet';
import SquishyButton from './SquishyButton';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';
import LeaderboardTable from './LeaderboardTable';
import { triggerConfetti } from '../utils/confetti';
import battleFxSprite from '../assets/battle_effects.png';

const VisualEffect = ({ type, onComplete }) => {
    // 0: FIRE, 1: WATER, 2: ELECTRIC, 3: GLITCH, 4: GHOST
    let idx = 0;
    if (type === 'WATER' || type === 'SLIME') idx = 1;
    if (type === 'ELECTRIC' || type === 'ROBOT') idx = 2;
    if (type === 'GLITCH' || type === 'ALIEN') idx = 3;
    if (type === 'GHOST') idx = 4;

    useEffect(() => {
        const timer = setTimeout(onComplete, 500); // 0.5s animation
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '100px', height: '100px', pointerEvents: 'none', zIndex: 9999,
            backgroundImage: `url(${battleFxSprite})`,
            backgroundSize: '500% 100%', // 5 frames
            backgroundPosition: `${idx * 25}% 0%`,
            imageRendering: 'pixelated',
            animation: 'popIn 0.2s'
        }} />
    );
};

const ELEMENTS = {
    SOOT: { weak: 'SLIME', strong: 'GHOST' },
    SLIME: { weak: 'ROBOT', strong: 'SOOT' },
    ROBOT: { weak: 'ALIEN', strong: 'SLIME' },
    ALIEN: { weak: 'DINO', strong: 'ROBOT' },
    DINO: { weak: 'GHOST', strong: 'ALIEN' },
    GHOST: { weak: 'SOOT', strong: 'DINO' },
    ORB: { weak: 'None', strong: 'All' } // OP
};

// FALLBACK BOTS
const BOTS = [
    { name: 'Rookie Bot', type: 'SOOT', stage: 'BABY', hp: 100, atk: 10, avatar_url: null },
    { name: 'Sludge Bot', type: 'SLIME', stage: 'CHILD', hp: 150, atk: 15, avatar_url: null },
    { name: 'Mecha Bot', type: 'ROBOT', stage: 'TEEN', hp: 200, atk: 20, avatar_url: null }
];

const BattleArenaModal = ({ onClose }) => {
    const { stats, play } = usePocketBro();
    const { addCoins, userProfile, shopState, incrementStat } = useGamification();
    const { showToast } = useToast();
    const { playFire, playWater, playZap, playGlitch, playGhost, playCrash, playJump } = useRetroSound();

    const [opponent, setOpponent] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [turn, setTurn] = useState(0);
    const [myHp, setMyHp] = useState(1);
    const [oppHp, setOppHp] = useState(1);
    const [battleState, setBattleState] = useState('LOBBY'); // LOBBY, FIGHT, WIN, LOSE, SEARCHING

    // VISUALS
    const [shake, setShake] = useState(null); // 'PLAYER' | 'ENEMY' | null
    const [visualEffect, setVisualEffect] = useState(null); // { target: 'PLAYER'|'ENEMY', type: string }

    const MAX_MY_HP = 100 + (stats.xp * 0.1);

    useEffect(() => {
        setMyHp(MAX_MY_HP);
    }, [MAX_MY_HP]);

    // SFX TRIGGER
    useEffect(() => {
        if (!visualEffect) return;
        const t = visualEffect.type;
        if (t === 'SOOT') playFire(); // Use Fire for Soot? Or just regular crash?
        if (t === 'SLIME' || t === 'WATER') playWater();
        if (t === 'ROBOT' || t === 'ELECTRIC') playZap();
        if (t === 'ALIEN' || t === 'GLITCH') playGlitch();
        if (t === 'GHOST') playGhost();
        if (t === 'DINO') playCrash(); // Stomp
    }, [visualEffect]);

    const findMatch = async () => {
        setBattleState('SEARCHING');

        // 1. Try Fetch Real Player
        let enemy = null;
        if (supabase) {
            try {
                // Get random profile (simple way: take any not me)
                // Since we can't do random() easily in SQL without RPC, we'll fetch top 20 and pick random
                const { data } = await supabase
                    .from('profiles')
                    .select('id, display_name, avatar_url, xp, squad')
                    .neq('id', userProfile?.id || '000') // Don't fight self
                    .limit(50);

                if (data && data.length > 0) {
                    const randomProfile = data[Math.floor(Math.random() * data.length)];

                    // SCALE ENEMY BASED ON XP
                    const enemyLvl = Math.floor(Math.sqrt(randomProfile.xp / 100)) + 1;
                    const enemyHp = 100 + (randomProfile.xp * 0.1);
                    const enemyAtk = 10 + (enemyLvl * 2);

                    // Determine Species based on Squad (Flavor)
                    let type = 'SOOT';
                    if (randomProfile.squad === 'CYBER') type = 'ROBOT';
                    if (randomProfile.squad === 'SOLAR') type = 'ALIEN';
                    if (randomProfile.squad === 'VOID') type = 'GHOST';

                    enemy = {
                        name: randomProfile.display_name,
                        type: type, // In v2 we'd fetch their actual pet
                        stage: enemyLvl > 10 ? 'ADULT' : 'CHILD',
                        hp: Math.floor(enemyHp),
                        maxHp: Math.floor(enemyHp),
                        atk: Math.floor(enemyAtk),
                        avatar_url: randomProfile.avatar_url
                    };
                }
            } catch (e) {
                console.error("Matchmaking failed:", e);
            }
        }

        // 2. Fallback to Bot
        if (!enemy) {
            const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
            enemy = { ...bot, maxHp: bot.hp };
        }

        // 3. Start Fight
        setTimeout(() => {
            setOpponent(enemy);
            setOppHp(enemy.hp);
            setMyHp(MAX_MY_HP);
            setBattleState('FIGHT');
            setBattleLog([`MATCH FOUND: VS ${enemy.name}!`, 'Battle Started!']);
            setTurn(1);
        }, 1500); // Fake searching delay
    };

    // Battle Loop
    useEffect(() => {
        if (battleState !== 'FIGHT') return;

        const timer = setTimeout(() => {
            resolveTurn();
        }, 1500);

        return () => clearTimeout(timer);
    }, [battleState, turn, myHp, oppHp]);

    const resolveTurn = () => {
        // 1. Calculate Player Damage
        let myDmg = Math.floor(10 + (stats.xp * 0.05) + (Math.random() * 5));

        // --- BUFFS ---
        // Konami Controller Buff
        const hasKonami = userProfile?.unlocked?.includes('furn_konami') || false; // Wait, handled in shopState usually.
        // Let's check shopState if available. We need to fetch it.
        // Assuming we update the hook below to get shopState.

        // Elemental Advantage
        const myType = stats.type || 'SOOT';
        const oppType = opponent.type;
        let advantage = 'NEUTRAL'; // NEUTRAL, STRONG, WEAK

        // ARCADE OVERCLOCK BUFF
        if (shopState?.unlocked?.includes('arcade_overclock')) {
            myDmg = Math.floor(myDmg * 1.2);
        }

        // For now, let's assume if userProfile.xp > 500 or if we check stats directly?
        // Actually, let's just use stats.tempStatus which could be set by the Modal opening?
        // Or better, let's just make damage highly dependent on XP.
        // Wait, I can access shopState below if I update the destructuring.
        // Let's rely on XP scaling for now to be safe, or check userProfile.

        if (ELEMENTS[myType]?.strong === oppType) {
            myDmg = Math.floor(myDmg * 1.5);
            advantage = 'STRONG';
        } else if (ELEMENTS[myType]?.weak === oppType) {
            myDmg = Math.floor(myDmg * 0.5);
            advantage = 'WEAK';
        }

        // Apply Damage
        const newOppHp = Math.max(0, oppHp - myDmg);
        setShake('ENEMY');
        setVisualEffect({ target: 'ENEMY', type: myType }); // Trigger VFX on Enemy
        setTimeout(() => { setShake(null); setVisualEffect(null); }, 300);
        setOppHp(newOppHp);

        // Visual Log
        let logMsg = `You hit ${opponent.name} for ${myDmg}`;
        if (advantage === 'STRONG') logMsg += " (SUPER EFFECTIVE!)";
        if (advantage === 'WEAK') logMsg += " (Not very effective...)";
        setBattleLog(prev => [...prev.slice(-4), logMsg]);

        if (newOppHp <= 0) {
            setBattleState('WIN');
            return;
        }

        // 2. Enemy Turn (Delayed)
        setTimeout(() => {
            let oppDmg = Math.floor(opponent.atk + (Math.random() * 5));

            // Enemy Elemental Advantage
            // Reverse logic
            if (ELEMENTS[oppType]?.strong === myType) {
                oppDmg = Math.floor(oppDmg * 1.5);
            } else if (ELEMENTS[oppType]?.weak === myType) {
                oppDmg = Math.floor(oppDmg * 0.5);
            }

            const newMyHp = Math.max(0, myHp - oppDmg);
            setShake('PLAYER');
            setVisualEffect({ target: 'PLAYER', type: oppType }); // Trigger VFX on Player
            setTimeout(() => { setShake(null); setVisualEffect(null); }, 300);
            setMyHp(newMyHp);

            setBattleLog(prev => [...prev.slice(-4), `${opponent.name} hits you for ${oppDmg}!`]);

            if (newMyHp <= 0) {
                setBattleState('LOSE');
            } else {
                setTurn(t => t + 1);
            }
        }, 600);
    };

    const handleWin = () => {
        const reward = opponent.atk * 5;
        addCoins(reward);
        play(20); // Happiness
        triggerConfetti();
        if (incrementStat) incrementStat('arenaWins');
        showToast(`You Won! +${reward} Coins`, "success");
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)', zIndex: 9000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Press Start 2P", cursive'
        }}>
            <h1 style={{ color: 'red', textShadow: '0 0 20px red', marginBottom: '20px' }}>
                BATTLE ARENA
            </h1>

            {battleState === 'LOBBY' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
                    <SquishyButton onClick={findMatch} style={{ padding: '20px 40px', fontSize: '1.2rem', background: 'red', border: '4px solid gold' }}>
                        FIND MATCH
                    </SquishyButton>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>Searching Global Frequency...</div>

                    {/* GLOBAL RANKING */}
                    <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <LeaderboardTable gameId="arena_wins" />
                    </div>

                    <button onClick={onClose} style={{ marginTop: '20px', background: 'transparent', color: '#fff', border: 'none' }}>EXIT</button>
                </div>
            )}

            {battleState === 'SEARCHING' && (
                <div style={{ textAlign: 'center', color: 'cyan', animation: 'pulse 1s infinite' }}>
                    SCANNING...
                </div>
            )}

            {battleState === 'FIGHT' && opponent && (
                <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>

                    {/* ENEMY */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                transform: shake === 'ENEMY' ? 'translate(5px, 0)' : 'scale(0.8)',
                                transition: 'transform 0.1s',
                                filter: shake === 'ENEMY' ? 'brightness(2) saturate(0)' : 'none', // White flash
                                position: 'relative'
                            }}>
                                {visualEffect?.target === 'ENEMY' && <VisualEffect type={visualEffect.type} onComplete={() => { }} />}
                                {/* Mock Pet for Enemy */}
                                <div style={{ fontSize: '4rem' }}>
                                    {opponent.type === 'SOOT' ? '🌑' :
                                        opponent.type === 'SLIME' ? '🟢' :
                                            opponent.type === 'ROBOT' ? '🤖' :
                                                opponent.type === 'DINO' ? '🦖' : '👽'}
                                </div>
                            </div>
                            <div style={{ width: '200px', textAlign: 'left' }}>
                                <div>{opponent.name} LVL {opponent.atk}</div>
                                <div style={{ height: '10px', background: '#333', marginTop: '5px' }}>
                                    <div style={{ width: `${(oppHp / opponent.maxHp) * 100}%`, height: '100%', background: 'red', transition: 'width 0.2s' }} />
                                </div>
                                <div>{oppHp}/{opponent.maxHp}</div>
                            </div>
                        </div>
                    </div>

                    {/* VS */}
                    <div style={{ fontSize: '2rem', color: 'yellow', margin: '20px 0' }}>VS</div>

                    {/* PLAYER */}
                    <div style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexDirection: 'row-reverse' }}>
                            <div style={{
                                transform: shake === 'PLAYER' ? 'translate(-5px, 0) scale(1.2)' : 'scale(1.2)',
                                transition: 'transform 0.1s',
                                filter: shake === 'PLAYER' ? 'brightness(2) saturate(0)' : 'none', // White flash
                                position: 'relative'
                            }}>
                                {visualEffect?.target === 'PLAYER' && <VisualEffect type={visualEffect.type} onComplete={() => { }} />}
                                <PocketPet type={stats.type} stage={stats.stage} mood="happy" />
                            </div>
                            <div style={{ width: '200px', textAlign: 'right' }}>
                                <div>YOU</div>
                                <div style={{ height: '10px', background: '#333', marginTop: '5px' }}>
                                    <div style={{ width: `${(myHp / MAX_MY_HP) * 100}%`, height: '100%', background: 'lime', transition: 'width 0.2s' }} />
                                </div>
                                <div>{Math.floor(myHp)}/{Math.floor(MAX_MY_HP)}</div>
                            </div>
                        </div>
                    </div>

                    {/* LOG */}
                    <div style={{
                        marginTop: '30px', height: '100px', background: '#111',
                        border: '2px solid #333', padding: '10px', overflowY: 'auto',
                        textAlign: 'left', fontSize: '0.7rem', color: '#aaa', lineHeight: '1.5'
                    }}>
                        {battleLog.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>

                </div>
            )}

            {battleState === 'WIN' && (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'lime', fontSize: '3rem' }}>VICTORY!</h2>
                    <SquishyButton onClick={handleWin} style={{ background: 'lime', color: 'black' }}>
                        CLAIM LOOT
                    </SquishyButton>
                </div>
            )}

            {battleState === 'LOSE' && (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'red', fontSize: '3rem' }}>DEFEATED</h2>
                    <SquishyButton onClick={onClose} style={{ background: '#333', color: 'white' }}>
                        RETREAT
                    </SquishyButton>
                </div>
            )}
        </div>
    );
};

export default BattleArenaModal;
