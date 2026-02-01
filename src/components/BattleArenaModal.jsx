import React, { useState, useEffect } from 'react';
import { usePocketBro } from '../context/PocketBroContext';
import { useGamification } from '../context/GamificationContext';
import PocketPet from './pocket-pet/PocketPet';
import SquishyButton from './SquishyButton';
import { useToast } from '../context/ToastContext';

const ELEMENTS = {
    SOOT: { weak: 'SLIME', strong: 'GHOST' },
    SLIME: { weak: 'ROBOT', strong: 'SOOT' },
    ROBOT: { weak: 'ALIEN', strong: 'SLIME' },
    ALIEN: { weak: 'DINO', strong: 'ROBOT' },
    DINO: { weak: 'GHOST', strong: 'ALIEN' },
    GHOST: { weak: 'SOOT', strong: 'DINO' },
    ORB: { weak: 'None', strong: 'All' } // OP
};

const BOTS = [
    { name: 'Rookie', type: 'SOOT', stage: 'BABY', hp: 100, atk: 10 },
    { name: 'Sludge', type: 'SLIME', stage: 'CHILD', hp: 150, atk: 15 },
    { name: 'Mecha', type: 'ROBOT', stage: 'TEEN', hp: 200, atk: 20 },
    { name: 'Rex', type: 'DINO', stage: 'ADULT', hp: 300, atk: 25 },
    { name: 'Xeno', type: 'ALIEN', stage: 'ELDER', hp: 400, atk: 35 }
];

const BattleArenaModal = ({ onClose }) => {
    const { stats, play } = usePocketBro();
    const { addCoins } = useGamification();
    const { showToast } = useToast();

    const [opponent, setOpponent] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [turn, setTurn] = useState(0);
    const [myHp, setMyHp] = useState(1);
    const [oppHp, setOppHp] = useState(1);
    const [battleState, setBattleState] = useState('LOBBY'); // LOBBY, FIGHT, WIN, LOSE

    const MAX_MY_HP = 100 + (stats.xp * 0.1);

    // Initial Setup
    useEffect(() => {
        setMyHp(MAX_MY_HP);
    }, [MAX_MY_HP]);

    const startBattle = (botIndex) => {
        const bot = BOTS[botIndex];
        setOpponent({ ...bot, maxHp: bot.hp });
        setOppHp(bot.hp);
        setMyHp(MAX_MY_HP);
        setBattleState('FIGHT');
        setBattleLog([`Battle Started! VS ${bot.name}`]);
        setTurn(1);
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
        // Player Turn
        const myDmg = Math.floor(10 + (stats.xp * 0.05) + (Math.random() * 5));
        const newOppHp = Math.max(0, oppHp - myDmg);
        setOppHp(newOppHp);

        const logEntry = `You hit ${opponent.name} for ${myDmg}!`;
        setBattleLog(prev => [...prev.slice(-4), logEntry]);

        if (newOppHp <= 0) {
            setBattleState('WIN');
            return;
        }

        // Enemy Turn (Delayed slightly? No, immediate response for pacing)
        setTimeout(() => {
            const oppDmg = Math.floor(opponent.atk + (Math.random() * 5));
            const newMyHp = Math.max(0, myHp - oppDmg);
            setMyHp(newMyHp);

            setBattleLog(prev => [...prev.slice(-4), `${opponent.name} hits you for ${oppDmg}!`]);

            if (newMyHp <= 0) {
                setBattleState('LOSE');
            } else {
                setTurn(t => t + 1);
            }
        }, 500);
    };

    const handleWin = () => {
        const reward = opponent.atk * 5;
        addCoins(reward); // Fixed function in GamificationContext needs to be passed
        // Since we can't access addCoins directly (it's not exported?), 
        // wait, I destructured it from useGamification. Check if it exists.
        // Step 3266: addCoins is defined in context.
        play(20); // Happiness
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
                <div style={{ display: 'grid', gap: '15px' }}>
                    {BOTS.map((bot, i) => (
                        <button key={i} onClick={() => startBattle(i)} style={{
                            padding: '15px', background: '#222', border: '2px solid #555',
                            color: 'white', fontFamily: 'inherit', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', width: '300px'
                        }}>
                            <span>{bot.name} ({bot.type})</span>
                            <span style={{ color: 'red' }}>⚔️ {bot.atk}</span>
                        </button>
                    ))}
                    <button onClick={onClose} style={{ marginTop: '20px', background: 'transparent', color: '#fff', border: 'none' }}>EXIT</button>
                </div>
            )}

            {battleState === 'FIGHT' && opponent && (
                <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>

                    {/* ENEMY */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                            <div style={{ transform: 'scale(0.8)' }}>
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
                            <div style={{ transform: 'scale(1.2)' }}>
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
