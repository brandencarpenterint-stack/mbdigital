import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { supabase } from '../lib/supabaseClient';
import useRetroSound from '../hooks/useRetroSound';
import { useNavigate } from 'react-router-dom';

const MOCK_WAGERS = [
    { id: 'm1', player: 'ShadowBroker', gameId: 'slots', gameName: 'Cosmic Slots', wager: 5000, state: 'open', targetScore: 1000 },
    { id: 'm2', player: 'GlitchKing99', gameId: 'face-runner', gameName: 'Face Warp', wager: 2500, state: 'open', targetScore: 150 },
    { id: 'm3', player: 'VoidEntity', gameId: 'brick', gameName: 'Neon Bricks', wager: 10000, state: 'open', targetScore: 4000 }
];

const GAMES_LIST = [
    { id: 'unboxing', name: 'HypeDrop Mystery Crates' },
    { id: 'merch-defense', name: 'Merch Defense TD' },
    { id: 'bro-cannon', name: 'Bro Cannon Launch' },
    { id: 'fishing', name: 'Crazy Fishing' },
    { id: 'merch-jump', name: 'Merch Jump' },
    { id: 'slots', name: 'Cosmic Slots' },
    { id: 'face-runner', name: 'Face Warp' },
    { id: 'brick', name: 'Neon Bricks' },
    { id: 'flappy', name: 'FlappyBro' },
    { id: 'snake', name: 'Neon Snake' }
];

const TheUnderworld = () => {
    const { coins, addCoins, userProfile, incrementStat } = useGamification();
    const { playBeep, playClick, playError, playWin } = useRetroSound();
    const navigate = useNavigate();
    
    const [wagers, setWagers] = useState(MOCK_WAGERS);
    const [showCreate, setShowCreate] = useState(false);
    
    // Create Form
    const [selectedGame, setSelectedGame] = useState('face-runner');
    const [wagerAmount, setWagerAmount] = useState(1000);
    const [targetScore, setTargetScore] = useState(100);

    const channelRef = useRef(null);

    useEffect(() => {
        if (!supabase) return;
        
        const channel = supabase.channel('underworld_wagers')
            .on('broadcast', { event: 'new_wager' }, (payload) => {
                setWagers(prev => [payload.payload, ...prev]);
                playClick();
            })
            .on('broadcast', { event: 'wager_accepted' }, (payload) => {
                setWagers(prev => prev.filter(w => w.id !== payload.payload.id));
            })
            .subscribe();
            
        channelRef.current = channel;
        return () => supabase.removeChannel(channel);
    }, []);

    const handleCreateWager = () => {
        if (coins < wagerAmount) {
            playError();
            alert("You don't have enough coins to wager that much!");
            return;
        }

        addCoins(-wagerAmount); // Deduct wager
        playBeep();
        
        const newWager = {
            id: `w_${Date.now()}`,
            player: userProfile?.name || 'Anonymous',
            gameId: selectedGame,
            gameName: GAMES_LIST.find(g => g.id === selectedGame)?.name || 'Unknown',
            wager: parseInt(wagerAmount),
            targetScore: parseInt(targetScore),
            state: 'open'
        };

        // Add locally
        setWagers(prev => [newWager, ...prev]);
        setShowCreate(false);

        // Broadcast to others
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'new_wager',
                payload: newWager
            });
        }
    };

    const handleAcceptWager = (wager) => {
        if (coins < wager.wager) {
            playError();
            alert("You don't have enough coins to match this wager!");
            return;
        }
        
        const confirmMsg = `Match ${wager.wager} coins to beat ${wager.targetScore} in ${wager.gameName}?`;
        if (window.confirm(confirmMsg)) {
            addCoins(-wager.wager); // Deduct your match
            incrementStat('underworldWagersMatched', 1);
            playWin();
            
            // Broadcast accepted
            if (channelRef.current) {
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'wager_accepted',
                    payload: { id: wager.id }
                });
            }
            
            // Remove from board locally
            setWagers(prev => prev.filter(w => w.id !== wager.id));
            
            // Redirect to game with wager state (Mocking the redirect functionality for now)
            // In a full build, this would pass state to the game component to verify the score upon game over
            alert(`Wager Accepted! Good luck. Redirecting to ${wager.gameName}...`);
            navigate(`/arcade/${wager.gameId}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #220000 0%, #000000 100%)',
            color: '#ff0055',
            fontFamily: '"Orbitron", sans-serif',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Dark Grid Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(#ff005511 1px, transparent 1px), linear-gradient(90deg, #ff005511 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #ff0055', paddingBottom: '20px' }}>
                    <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#ff0055', textShadow: '0 0 20px #ff0055, 0 0 40px #ff0000' }}>
                        THE UNDERWORLD
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '1.2rem', margin: 0, letterSpacing: '2px' }}>
                        ILLEGAL WAGERS & SHADOW DUELS
                    </p>
                </div>

                {/* Create Wager Button */}
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button 
                        onClick={() => setShowCreate(!showCreate)}
                        style={{
                            background: showCreate ? 'transparent' : '#ff0055',
                            color: showCreate ? '#ff0055' : '#000',
                            border: '1px solid #ff0055',
                            padding: '10px 20px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            boxShadow: showCreate ? 'none' : '0 0 15px #ff0055'
                        }}
                    >
                        {showCreate ? 'CANCEL WAGER' : '+ NEW WAGER'}
                    </button>
                </div>

                {/* Create Form */}
                <AnimatePresence>
                    {showCreate && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '30px' }}
                        >
                            <div style={{ background: '#110000', border: '1px solid #ff0055', padding: '20px', borderRadius: '10px' }}>
                                <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>POST A NEW DUEL</h3>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>GAME</label>
                                        <select 
                                            value={selectedGame} 
                                            onChange={e => setSelectedGame(e.target.value)}
                                            style={{ width: '100%', padding: '10px', background: '#220000', color: '#fff', border: '1px solid #ff0055', outline: 'none' }}
                                        >
                                            {GAMES_LIST.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>TARGET SCORE TO BEAT</label>
                                        <input 
                                            type="number" 
                                            value={targetScore} 
                                            onChange={e => setTargetScore(e.target.value)}
                                            style={{ width: '100%', padding: '10px', background: '#220000', color: '#fff', border: '1px solid #ff0055', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>YOUR WAGER (COINS)</label>
                                    <input 
                                        type="number" 
                                        value={wagerAmount} 
                                        onChange={e => setWagerAmount(e.target.value)}
                                        style={{ width: '100%', padding: '10px', background: '#220000', color: '#fff', border: '1px solid #ff0055', outline: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}
                                    />
                                </div>

                                <button 
                                    onClick={handleCreateWager}
                                    style={{
                                        width: '100%', background: '#ff0055', color: '#000', padding: '15px', border: 'none',
                                        fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px #ff0055'
                                    }}
                                >
                                    CONFIRM WAGER & DEDUCT {wagerAmount} 🪙
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wager List */}
                <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>OPEN WAGERS</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <AnimatePresence>
                        {wagers.length === 0 && (
                            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No open wagers. The shadows are quiet.</p>
                        )}
                        
                        {wagers.map(wager => (
                            <motion.div
                                key={wager.id}
                                layout
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{
                                    background: 'rgba(20, 0, 0, 0.8)',
                                    border: '1px solid #550011',
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#ff0055', marginBottom: '5px' }}>{wager.player} CHALLENGES YOU</div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#fff' }}>{wager.gameName}</h4>
                                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Target Score: <b style={{ color: '#fff' }}>{wager.targetScore}</b></div>
                                </div>
                                
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '2rem', color: 'var(--neon-gold)', fontWeight: 'bold', textShadow: '0 0 10px var(--neon-gold)', marginBottom: '10px' }}>
                                        {wager.wager.toLocaleString()} 🪙
                                    </div>
                                    <button
                                        onClick={() => handleAcceptWager(wager)}
                                        style={{
                                            background: 'transparent',
                                            color: '#00ffcc',
                                            border: '1px solid #00ffcc',
                                            padding: '8px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            boxShadow: '0 0 10px rgba(0, 255, 204, 0.2)'
                                        }}
                                    >
                                        MATCH & PLAY
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default TheUnderworld;
