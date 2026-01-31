import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { POCKET_BRO_STAGES, usePocketBro } from '../context/PocketBroContext';
import { useToast } from '../context/ToastContext';
import PocketPet from '../components/pocket-pet/PocketPet';
import { DECOR_ITEMS } from '../config/DecorItems'; // Still needed for backgrounds/inventory
import { ADVENTURE_LOCATIONS } from '../config/AdventureLocations';
import PetShopModal from '../components/PetShopModal';
import PocketRoom from '../components/PocketRoom'; // NEW
import { triggerConfetti } from '../utils/confetti';

// TASKS DEFINITION
const TASKS = [
    { id: 'feed', icon: '🍗', label: 'FEED' },
    { id: 'clean', icon: '🧹', label: 'CLEAN' },
    { id: 'play', icon: '🎾', label: 'PLAY' },
    { id: 'shop', icon: '🛍️', label: 'SHOP' },
    { id: 'sleep', icon: '💤', label: 'SLEEP' },
];

const PocketBro = () => {
    const { stats, feed, play, sleep, clean, getMood, placeItem, removeItem, debugUpdate, equipDecor, explore, returnFromExplore } = usePocketBro();
    const { shopState } = useGamification() || {};
    const equippedSkin = shopState?.equipped?.pocketbro || null;

    // Skin Styles
    const getSkinStyles = () => {
        if (equippedSkin === 'pb_gold') return { filter: 'drop-shadow(0 0 15px gold) sepia(100%) saturate(300%) hue-rotate(5deg)' };
        if (equippedSkin === 'pb_cyber') return { filter: 'drop-shadow(0 0 10px cyan) hue-rotate(180deg) contrast(150%)', fontFamily: 'monospace' };
        if (equippedSkin === 'pb_party') return { transform: 'scale(1.1) rotate(5deg)' }; // Bouncy
        return { filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.2))' };
    };

    const [message, setMessage] = useState("I'm here! 🥚");
    const [bounce, setBounce] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showMissionSelect, setShowMissionSelect] = useState(false);

    // EDIT MODE STATE
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDecor, setSelectedDecor] = useState(null);

    // EVOLUTION LOGIC
    const [isEvolving, setIsEvolving] = useState(false);
    const [prevStage, setPrevStage] = useState(stats.stage);

    useEffect(() => {
        if (stats.stage !== prevStage) {
            setIsEvolving(true);
            setMessage(`What ? Bro is evolving into ${stats.stage} !`);

            setTimeout(() => {
                setPrevStage(stats.stage);
                setIsEvolving(false);
                setMessage(`Bro evolved into ${stats.stage} ! 🎉`);
                triggerConfetti();
            }, 4000);
        }
    }, [stats.stage, prevStage]);

    // Evolution Progress Logic
    const currentStage = POCKET_BRO_STAGES[stats.stage] || POCKET_BRO_STAGES['EGG'];
    const stageKeys = Object.keys(POCKET_BRO_STAGES);
    const currentIndex = stageKeys.indexOf(stats.stage);
    const nextStageKey = stageKeys[currentIndex + 1];
    const nextStage = nextStageKey ? POCKET_BRO_STAGES[nextStageKey] : null;

    let progress = 100;

    if (nextStage) {
        const range = nextStage.threshold - currentStage.threshold;
        const currentInStage = stats.xp - currentStage.threshold;
        progress = Math.min((currentInStage / range) * 100, 100);
    }

    const [miniGame, setMiniGame] = useState(null);
    const [rpsState, setRpsState] = useState('CHOOSING');
    const [rpsResult, setRpsResult] = useState('');

    const handleAction = (task) => {
        triggerBounce();

        if (task.id === 'sleep') {
            sleep();
            setMessage(stats.isSleeping ? "Good morning! ☀️" : "Goodnight! 🌙");
            return;
        }

        if (stats.isSleeping) {
            setMessage("Zzz... Wake me up!");
            return;
        }

        if (task.id === 'clean') {
            if (stats.poopCount > 0) {
                clean();
                setMessage("Much better! ✨");
                triggerConfetti();
            } else {
                setMessage("It's already clean! ✨");
            }
        } else if (task.id === 'shop') {
            setShowShop(true);
        } else if (task.id === 'feed') {
            feed();
            setMessage("Yum! 😋");
            triggerConfetti();
        } else if (task.id === 'play') {
            setMiniGame('rps');
            setRpsState('CHOOSING');
            setMessage("Let's Play RPS! 👊✋✌️");
        }
    };

    const handlePet = () => {
        if (stats.isSleeping) return;
        triggerBounce();
        play(2);
        setMessage("He likes that! ❤️");
    };

    const playRPS = (choice) => {
        const options = ['rock', 'paper', 'scissors'];
        const botChoice = options[Math.floor(Math.random() * options.length)];

        let result = 'draw';
        if (
            (choice === 'rock' && botChoice === 'scissors') ||
            (choice === 'paper' && botChoice === 'rock') ||
            (choice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'win';
        } else if (choice !== botChoice) {
            result = 'lose';
        }

        setRpsResult({ user: choice, bot: botChoice, outcome: result });
        setRpsState('RESULT');

        if (result === 'win') {
            play(40);
            setMessage("YOU WIN! 🎉 +40 Happy");
            triggerConfetti();
        } else if (result === 'draw') {
            play(10);
            setMessage("DRAW! 🤝 +10 Happy");
        } else {
            play(5);
            setMessage("I WIN! 😜 +5 Happy");
        }
    };

    const triggerBounce = () => {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
    };

    const getAnimationClass = () => {
        if (isEvolving) return '';
        if (stats.tempStatus === 'jitter') return 'jitter';
        if (stats.tempStatus === 'dance') return 'dance';
        if (stats.tempStatus === 'zoom') return 'zoom';
        if (stats.isSleeping) return 'breathe';
        if (bounce) return 'bounce';
        return 'idle';
    };

    const bgItem = DECOR_ITEMS.find(i => i.id === stats.decor?.background);

    // Inventory for Editor
    const unlockedDecorItems = DECOR_ITEMS.filter(item => (stats.unlockedDecor || []).includes(item.id));

    return (
        <div className="page-enter" style={{
            background: stats.tempStatus === 'shine' ? 'radial-gradient(circle, gold, #222)' : 'transparent', // Transparency allows global CosmicBackground
            transition: 'background 1s',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '100px',
            fontFamily: '"Press Start 2P", monospace'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                {/* Title Badge */}
                <div style={{
                    background: 'var(--neon-blue)', color: 'black',
                    padding: '5px 20px', borderRadius: '20px',
                    marginBottom: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                    boxShadow: '0 0 20px var(--neon-blue)'
                }}>
                    POCKET BRO v3.0
                </div>

                {/* THE DEVICE */}
                <div style={{
                    width: '320px',
                    background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                    borderRadius: '40px',
                    padding: '25px',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)',
                    border: '1px solid #333',
                    position: 'relative'
                }}>

                    {/* Screen */}
                    <div className={bgItem ? bgItem.className : ''} style={{
                        height: '320px',
                        background: bgItem ? bgItem.css.background : '#8b9bb4', // LCD Base Color
                        // Default to Scanlines if no BG, otherwise use BG css
                        backgroundImage: bgItem ? bgItem.css.backgroundImage : 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                        backgroundSize: bgItem ? undefined : '100% 2px, 3px 100%', // Scanline size
                        borderRadius: '15px',
                        border: '6px solid #111',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                        padding: '20px',
                        display: 'flex', flexDirection: 'column',
                        position: 'relative', overflow: 'hidden'
                    }}>

                        {/* Status Header (Hide in edit mode?) */}
                        {!isEditing && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#333', marginBottom: '10px' }}>
                                <span>STAGE: {stats.stage}</span>
                                <span>XP: {Math.floor(stats.xp)}</span>
                            </div>
                        )}

                        {/* Bars (Hide in edit mode?) */}
                        {!isEditing && (
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                    <div style={{ width: `${stats.happy}% `, height: '100%', background: '#ff0055', borderRadius: '4px' }} />
                                </div>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                    <div style={{ width: `${stats.hunger}% `, height: '100%', background: '#ffaa00', borderRadius: '4px' }} />
                                </div>
                            </div>
                        )}

                        {/* GAME/CHARACTER AREA (Grid Stack) */}
                        <div style={{ flex: 1, position: 'relative' }}>

                            {/* ADVENTURE MODE OVERLAY */}
                            {stats.adventure?.active ? (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.8)',
                                    zIndex: 60,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'lime', fontFamily: 'monospace'
                                }}>
                                    <div style={{ fontSize: '3rem', animation: 'spin 2s infinite linear' }}>🌍</div>
                                    <div style={{ marginTop: '20px', letterSpacing: '2px' }}>SCAVENGING...</div>
                                    <div style={{
                                        marginTop: '10px', width: '80%', height: '4px', background: '#333',
                                        overflow: 'hidden', borderRadius: '2px'
                                    }}>
                                        <div style={{
                                            width: '50%', height: '100%', background: 'lime',
                                            animation: 'scan 2s infinite ease-in-out'
                                        }}></div>
                                    </div>
                                    <style>{`
                                        @keyframes spin { 100% { transform: rotate(360deg); } }
                                        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                                    `}</style>
                                </div>
                            ) : (
                                <>
                                    {/* 1. ROOM GRID (Furniture) */}
                                    <PocketRoom
                                        isEditing={isEditing}
                                        selectedItem={selectedDecor}
                                        onPlace={(id, x, y) => placeItem(id, x, y)}
                                    />

                                    {/* 2. CHARACTER LAYER (Centered over grid) */}
                                </>
                            )}

                            {(!stats.adventure?.active && miniGame === 'rps') ? ( // Only show RPS if not exploring
                                <div style={{
                                    position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        {rpsState === 'CHOOSING' ? (
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button onClick={() => playRPS('rock')} style={{ fontSize: '2rem', padding: '10px', background: '#ddd', border: '2px solid #333', cursor: 'pointer' }}>👊</button>
                                                <button onClick={() => playRPS('paper')} style={{ fontSize: '2rem', padding: '10px', background: '#ddd', border: '2px solid #333', cursor: 'pointer' }}>✋</button>
                                                <button onClick={() => playRPS('scissors')} style={{ fontSize: '2rem', padding: '10px', background: '#ddd', border: '2px solid #333', cursor: 'pointer' }}>✌️</button>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '1.5rem', color: 'white' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '2rem' }}>
                                                    <div>You<br />{rpsResult.user === 'rock' ? '👊' : rpsResult.user === 'paper' ? '✋' : '✌️'}</div>
                                                    <div style={{ alignSelf: 'center' }}>VS</div>
                                                    <div>Bro<br />{rpsResult.bot === 'rock' ? '👊' : rpsResult.bot === 'paper' ? '✋' : '✌️'}</div>
                                                </div>
                                                <div style={{ marginTop: '10px' }}>
                                                    <button onClick={() => setRpsState('CHOOSING')} style={{ marginRight: '10px', cursor: 'pointer', padding: '5px 10px' }}>Rematch ↺</button>
                                                    <button onClick={() => setMiniGame(null)} style={{ cursor: 'pointer', padding: '5px 10px' }}>Done ✅</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (!stats.adventure?.active && (
                                <div
                                    onClick={isEditing ? null : handlePet}
                                    style={{
                                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        width: '100px', height: '100px',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        cursor: isEditing ? 'default' : 'pointer',
                                        zIndex: 20
                                    }}
                                >
                                    <div style={{
                                        transform: bounce ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        animation: `${getAnimationClass()} ${stats.tempStatus === 'zoom' ? '0.5s' : '2s'} infinite`,
                                        filter: isEvolving ? 'brightness(100) drop-shadow(0 0 20px white)' :
                                            stats.tempStatus === 'shine' ? 'drop-shadow(0 0 20px gold)' :
                                                stats.tempStatus === 'zoom' ? 'hue-rotate(90deg)' : 'none',
                                        ...getSkinStyles()
                                    }}>
                                        <PocketPet
                                            type={stats.type || 'SOOT'}
                                            mood={stats.happy < 40 || stats.poopCount > 0 ? 'sad' : 'happy'}
                                            isSleeping={stats.isSleeping}
                                            stage={isEvolving ? prevStage : stats.stage}
                                            skin={equippedSkin}
                                        />
                                    </div>

                                    {/* POOP OVERLAY */}
                                    {stats.poopCount > 0 && (
                                        <div style={{
                                            position: 'absolute', bottom: 0, right: 0,
                                            fontSize: '2rem',
                                            animation: 'shake 2s infinite',
                                            filter: 'drop-shadow(0 0 5px brown)'
                                        }}>💩</div>
                                    )}

                                    {/* SLEEP ZZZ */}
                                    {stats.isSleeping && <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '1.5rem', animation: 'float 2s infinite' }}>💤</div>}
                                </div>
                            ))}
                        </div>

                        {/* Evolution Bar (Hide in Edit) */}
                        {!isEditing && (
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#555', marginBottom: '2px' }}>
                                    <span>EVOLUTION</span>
                                    <span>{nextStage ? `${Math.floor(progress)}% ` : 'MAX'}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px' }}>
                                    <div style={{
                                        width: `${progress}% `,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #00C6FF, #0072FF)',
                                        borderRadius: '3px',
                                        transition: 'width 0.5s'
                                    }}></div>
                                </div>
                            </div>
                        )}

                        {/* Message Text */}
                        {!isEditing && (
                            <div style={{ textAlign: 'center', marginTop: '10px', minHeight: '1.2em', color: '#333', fontSize: '0.7rem' }}>
                                {message}
                            </div>
                        )}

                        {isEditing && (
                            <div style={{ textAlign: 'center', marginTop: '10px', color: '#555', fontSize: '0.6rem' }}>
                                Click grid to place items. Center is reserved.
                            </div>
                        )}

                    </div>

                    {/* Action Buttons */}
                    {isEditing ? (
                        // EDITOR DOCK
                        <div style={{ marginTop: '20px', background: '#333', padding: '10px', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                                {unlockedDecorItems.length === 0 && <div style={{ color: '#888', fontSize: '0.7rem', padding: '10px' }}>No furniture! Visit Shop.</div>}
                                {unlockedDecorItems.map(item => {
                                    const isEquippedBg = stats.decor?.background === item.id;
                                    const isSelected = selectedDecor === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                if (item.type === 'background') {
                                                    equipDecor('background', item.id);
                                                } else {
                                                    setSelectedDecor(item.id);
                                                }
                                            }}
                                            style={{
                                                minWidth: '50px', height: '50px',
                                                border: isSelected || isEquippedBg ? '2px solid gold' : '1px solid #555',
                                                background: isEquippedBg ? 'var(--neon-blue)' : '#222',
                                                borderRadius: '5px',
                                                fontSize: '1.5rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative'
                                            }}
                                        >
                                            {item.icon}
                                            {item.type === 'background' && <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '0.5rem' }}>BG</span>}
                                        </button>
                                    )
                                })}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
                                <button onClick={() => setSelectedDecor(null)} style={{ background: '#444', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem' }}>Eraser 🧹</button>
                                <button onClick={() => setIsEditing(false)} style={{ background: 'var(--neon-blue)', border: 'none', color: 'black', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold' }}>DONE</button>
                            </div>
                        </div>
                    ) : (
                        // NORMAL CONTROLS
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                                {TASKS.map(task => (
                                    <button
                                        key={task.id}
                                        onClick={() => handleAction(task)}
                                        disabled={stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')}
                                        style={{
                                            width: '60px', height: '60px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) ? '#333' : '#e0e0e0',
                                            boxShadow: (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) ? 'none' : '0 6px 0 #999',
                                            fontSize: '1.8rem',
                                            cursor: (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) ? 'not-allowed' : 'pointer',
                                            opacity: (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) ? 0.5 : 1,
                                            transform: 'translateY(0)',
                                            transition: 'transform 0.1s, box-shadow 0.1s'
                                        }}
                                        onMouseDown={(e) => {
                                            if (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) return;
                                            e.currentTarget.style.transform = 'translateY(6px)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                        onMouseUp={(e) => {
                                            if (stats.adventure?.active || miniGame || (stats.isSleeping && task.id !== 'sleep')) return;
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 6px 0 #999';
                                        }}
                                    >
                                        {task.icon}
                                    </button>
                                ))}
                            </div>

                            {/* ADVENTURE CONTROLS */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                {stats.adventure?.active ? (
                                    // ACTIVE ADVENTURE VIEW
                                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '10px', border: '1px solid #555' }}>
                                        <div>🚀 {stats.adventure.name || 'EXPLORING'}...</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Back in {(Math.max(0, (stats.adventure.finishTime - Date.now()) / 60000)).toFixed(0)}m</div>
                                        {Date.now() > stats.adventure.finishTime && (
                                            <button
                                                onClick={() => {
                                                    const loot = returnFromExplore();
                                                    if (loot) {
                                                        setMessage(`Found ${loot.coins} Coins & ${loot.items.length} Items!`);
                                                        triggerConfetti();
                                                    }
                                                }}
                                                style={{ background: 'lime', color: 'black', border: 'none', padding: '5px 15px', borderRadius: '5px', marginTop: '5px', fontWeight: 'bold' }}
                                            >
                                                CLAIM REWARDS 🎁
                                            </button>
                                        )}
                                    </div>
                                ) : showMissionSelect ? (
                                    // MISSION SELECTOR
                                    <div style={{
                                        position: 'absolute', bottom: '0', left: '0', right: '0',
                                        background: '#222', borderTop: '2px solid #555',
                                        padding: '15px', borderRadius: '20px 20px 0 0',
                                        zIndex: 80, maxHeight: '250px', overflowY: 'auto'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>SELECT MISSION</span>
                                            <button onClick={() => setShowMissionSelect(false)} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' }}>✖</button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {ADVENTURE_LOCATIONS.map(loc => {
                                                const currentStageIdx = Object.keys(POCKET_BRO_STAGES).indexOf(stats.stage);
                                                const requiredStageIdx = Object.keys(POCKET_BRO_STAGES).indexOf(loc.minStage);
                                                const isLocked = currentStageIdx < requiredStageIdx;

                                                return (
                                                    <button
                                                        key={loc.id}
                                                        disabled={isLocked}
                                                        onClick={() => {
                                                            explore(loc.id);
                                                            setShowMissionSelect(false);
                                                            setMessage(`Off to ${loc.name}!`);
                                                        }}
                                                        style={{
                                                            background: isLocked ? '#333' : '#444',
                                                            border: '1px solid #555',
                                                            padding: '10px', borderRadius: '8px',
                                                            textAlign: 'left', cursor: isLocked ? 'not-allowed' : 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            opacity: isLocked ? 0.6 : 1
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '1.5rem' }}>{loc.icon}</div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ color: isLocked ? '#888' : 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>{loc.name}</div>
                                                            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>{loc.durationMinutes}m • {loc.description}</div>
                                                        </div>
                                                        {isLocked && <div style={{ fontSize: '0.7rem', color: 'red' }}>🔒 {loc.minStage}+</div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    // LAUNCH BUTTON
                                    <button
                                        onClick={() => setShowMissionSelect(true)}
                                        style={{ background: 'var(--neon-pink)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 0 10px var(--neon-pink)', cursor: 'pointer' }}
                                    >
                                        🌍 ADVENTURE
                                    </button>
                                )}
                            </div>

                            {/* Edit Room Toggle */}
                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={stats.adventure?.active}
                                    style={{ background: 'transparent', border: '1px solid #555', color: '#777', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '20px', cursor: stats.adventure?.active ? 'not-allowed' : 'pointer', opacity: stats.adventure?.active ? 0.3 : 1 }}
                                >
                                    🛋️ EDIT ROOM
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* SHOP MODAL */}
            {showShop && <PetShopModal onClose={() => setShowShop(false)} />}

            {/* FLASHLIGHT EFFECT FOR EVOLUTION */}
            {isEvolving && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 100, pointerEvents: 'none',
                    animation: 'flash 4s ease-in-out'
                }}></div>
            )}

            <style>{`
@keyframes flash {
    0 % { opacity: 0; }
    20 % { opacity: 1; }
    50 % { opacity: 0.5; }
    80 % { opacity: 1; filter: brightness(2); }
    100 % { opacity: 0; }
}
@keyframes jitter {
    0 % { transform: translate(0, 0); }
    25 % { transform: translate(2px, 2px); }
    50 % { transform: translate(-2px, -2px); }
    75 % { transform: translate(2px, -2px); }
    100 % { transform: translate(0, 0); }
}
@keyframes dance {
    0 %, 100 % { transform: translateY(0) rotate(0deg); }
    25 % { transform: translateY(-10px) rotate(- 10deg); }
    75 % { transform: translateY(-5px) rotate(10deg); }
}
@keyframes zoom {
    0 % { transform: translateX(-100px); }
    50 % { transform: translateX(100px); }
    100 % { transform: translateX(-100px); }
}
@keyframes idle {
    0 %, 100 % { transform: translateY(0); }
    50 % { transform: translateY(-5px); }
}
@keyframes breathe {
    0 %, 100 % { transform: scale(1); opacity: 0.8; }
    50 % { transform: scale(1.05); opacity: 1; }
}
@keyframes float {
    0 %, 100 % { transform: translateY(0); }
    50 % { transform: translateY(-10px); }
}

/* --- ANIMATED BACKGROUNDS --- */
.bg-space::before {
    content: ''; position: absolute; inset: 0;
    background-image: 
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
    background-size: 550px 550px, 350px 350px, 250px 250px;
    background-position: 0 0, 40px 60px, 130px 270px;
    animation: stars 60s linear infinite;
    z-index: 1; opacity: 0.8;
}
.bg-space::after {
    content: ''; position: absolute; top: -50px; left: -50px;
    width: 60px; height: 2px;
    background: linear-gradient(90deg, transparent, white);
    box-shadow: 0 0 10px white;
    transform-origin: right;
    animation: shootingStar 8s linear infinite;
    z-index: 2;
}

.bg-city {
    background: linear-gradient(180deg, #10002b 0%, #240046 60%, #ff0 60.5%, #3c096c 61%, #5a189a 100%);
    position: relative;
    overflow: hidden;
}
.bg-city::before {
    content: ''; position: absolute; inset: 0;
    background: 
        linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px),
        linear-gradient(rgba(255,0,255,0.3) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(300px) rotateX(60deg) translateY(100px) translateZ(-100px);
    animation: gridMove 2s linear infinite;
    z-index: 1;
}
.bg-city::after {
    content: ''; position: absolute; top: 20px; right: 40px;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(to bottom, #f0f, #00f);
    box-shadow: 0 0 20px #f0f;
    z-index: 1;
}

.bg-abyss {
    background: linear-gradient(#000, #001e36);
}
.bg-abyss::before {
    content: '🫧'; position: absolute; bottom: -20px; left: 20%;
    animation: bubbleUp 4s infinite; font-size: 20px; z-index: 1;
}
.bg-abyss::after {
    content: '🫧'; position: absolute; bottom: -20px; right: 30%;
    animation: bubbleUp 6s infinite 1s; font-size: 15px; z-index: 1;
}

.bg-magma {
    background: #300;
}
.bg-magma::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle, transparent 20%, #000 120%);
    animation: pulseHeat 2s infinite alternate;
    z-index: 1;
}

@keyframes stars { from { transform: translateY(0); } to { transform: translateY(550px); } }
@keyframes shootingStar { 0% { transform: translate(0,0) rotate(45deg); opacity: 1; } 20% { transform: translate(400px, 400px) rotate(45deg); opacity: 0; } 100% { opacity: 0; } }
@keyframes gridMove { from { background-position: 0 0; } to { background-position: 0 40px; } }
@keyframes bubbleUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-400px); opacity: 0; } }
@keyframes pulseHeat { from { opacity: 0.2; } to { opacity: 0.6; background-color: #f00; } }

`}</style>

            {/* DEV DEBUGGER (Double Click Title to Toggle?) */}
            <div style={{ marginTop: '50px', opacity: 0.1, hover: { opacity: 1 } }}>
                <details>
                    <summary>🧬 DEV LABS</summary>
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '10px', fontSize: '0.7rem' }}>
                        <p>Override Species:</p>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {['SOOT', 'SLIME', 'ROBOT', 'GHOST'].map(t => (
                                <button key={t} onClick={() => debugUpdate({ type: t })} style={{ padding: '5px', cursor: 'pointer' }}>{t}</button>
                            ))}
                        </div>
                        <p>Override Stage:</p>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {['EGG', 'BABY', 'CHILD', 'TEEN', 'ADULT'].map(s => (
                                <button key={s} onClick={() => debugUpdate({ stage: s })} style={{ padding: '5px', cursor: 'pointer' }}>{s}</button>
                            ))}
                        </div>
                        <p>Note: Renders immediately, logic may overwrite on next tick if XP not matching.</p>
                    </div>
                </details>
            </div>
        </div>
    );
};

export default PocketBro;
