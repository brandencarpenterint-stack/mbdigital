import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const MOLE_COUNT = 16;
const GAME_DURATION = 30;

const WhackAMoleGame = () => {
    const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
    const [moles, setMoles] = useState(new Array(MOLE_COUNT).fill(false));
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('whackHighScore')) || 0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    // Sync local high score with global stat on mount
    useEffect(() => {
        if (stats?.whackHighScore > highScore) {
            setHighScore(stats.whackHighScore);
        }
    }, [stats]);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const { playJump, playWin } = useRetroSound();

    // Timer Ref to clear intervals
    const popTimerRef = useRef(null);
    const gameTimerRef = useRef(null);

    const [moleTypes, setMoleTypes] = useState(new Array(MOLE_COUNT).fill('default'));

    const endGame = () => {
        clearInterval(gameTimerRef.current);
        clearTimeout(popTimerRef.current);
        setGameActive(false);
        setGameOver(true);
        setMoles(new Array(MOLE_COUNT).fill(false));
        playWin(); // Fanfare

        if (updateStat) updateStat('gamesPlayed', 'whack');

        if (score > highScore) {
            setHighScore(score);
            if (updateStat) updateStat('whackHighScore', score);
            triggerConfetti();

            if (score > 100) {
                const playerName = userProfile?.name || 'Player';
                feedService.publish(`is a Whack-a-Mole Champion! Score: ${score} 🔨`, 'win', playerName);
            }
        }

        // Award Coins (1 coin per 10 points)
        if (addCoins) addCoins(Math.floor(score / 10));
    };

    const popMoles = () => {
        const popTime = Math.random() * 800 + 400; // Random time
        popTimerRef.current = setTimeout(() => {
            if (!gameActive && timeLeft <= 0) return;

            const newMoles = [...moles]; // Copy current state to avoid overwriting others if we want multi-mole (though currently it clears others? No, line 48 was creating new Array)
            // Wait, previous logic was `new Array(MOLE_COUNT).fill(false)`. This meant only ONE mole at a time.
            // Do we want only one? The user didn't specify multi-mole. Sticking to one for now but randomizing types.
            const resetMoles = new Array(MOLE_COUNT).fill(false);

            const randomIdx = Math.floor(Math.random() * MOLE_COUNT);
            resetMoles[randomIdx] = true;
            setMoles(resetMoles);

            // Random Face
            const types = ['default', 'cat', 'bunny', 'money'];
            const newTypes = [...moleTypes];
            newTypes[randomIdx] = types[Math.floor(Math.random() * types.length)];
            setMoleTypes(newTypes);

            popMoles();
        }, popTime);
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameActive(true);
        setGameOver(false);

        // Start Game Timer
        gameTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Start Pop Timer
        popMoles();
    };

    const handleWhack = (index) => {
        if (!gameActive || !moles[index]) return;

        setScore(prev => prev + 10);
        playJump(); // Bonk
        if (navigator.vibrate) navigator.vibrate(100); // Strongbonk

        const newMoles = [...moles];
        newMoles[index] = false;
        setMoles(newMoles);
    };

    useEffect(() => {
        return () => {
            clearInterval(gameTimerRef.current);
            clearTimeout(popTimerRef.current);
        };
    }, []);

    const IMAGES = {
        default: '/assets/merchboy_face.png',
        cat: '/assets/merchboy_cat.png',
        bunny: '/assets/merchboy_bunny.png',
        money: '/assets/merchboy_money.png'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', color: '#ff0055', width: '100%', minHeight: '100vh', touchAction: 'manipulation' }}>
            <style>{`
                @keyframes spinMole {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes fullSpin {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            `}</style>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '2.5rem', margin: '10px 0', textAlign: 'center' }}>WHACK-A-MOLE</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '500px', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>SCORE: {score}</span>
                <span>TIME: {timeLeft}s</span>
                <span>HIGH: {highScore}</span>
            </div>

            {!gameActive && !gameOver && (
                <SquishyButton onClick={startGame} style={{
                    padding: '15px 40px',
                    fontSize: '1.5rem',
                    backgroundColor: '#ff0055',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 5px 0 #990033',
                    marginBottom: '20px'
                }}>
                    START GAME
                </SquishyButton>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                padding: '10px',
                width: '100%',
                maxWidth: '600px',
                aspectRatio: '1/1', // Keep square aspect ratio for the whole board
                backgroundColor: '#2a2a40',
                borderRadius: '20px',
                border: '4px solid #ff0055',
                boxShadow: '0 0 20px #ff005540'
            }}>
                {moles.map((isUp, index) => (
                    <div
                        key={index}
                        onMouseDown={() => handleWhack(index)}
                        onTouchStart={(e) => { e.preventDefault(); handleWhack(index); }}
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#151525', // Darker cell background (Ground)
                            borderRadius: '15px', // Rounded square
                            position: 'relative',
                            cursor: 'pointer',
                            overflow: 'hidden', // Clip the mole when down
                            border: '2px solid #333',
                            touchAction: 'none',
                            boxShadow: 'inset 0 0 10px #000'
                        }}
                    >
                        {/* Hole Visual (Shadow) */}
                        <div style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '10%',
                            width: '80%',
                            height: '25%',
                            backgroundColor: '#000',
                            borderRadius: '50%',
                            opacity: 0.6
                        }} />

                        {/* Mole */}
                        <div style={{
                            position: 'absolute',
                            bottom: isUp ? '15%' : '-100%', // Pop up position
                            left: '0',
                            width: '100%', // Full width of cell to maximize size
                            height: '90%',
                            backgroundImage: `url(${IMAGES[moleTypes[index]] || IMAGES.default})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'bottom center',
                            transition: 'bottom 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            animation: isUp ? 'fullSpin 2s linear infinite' : 'none',
                            zIndex: 10
                        }} />
                    </div>
                ))}
            </div>

            {gameOver && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '4px solid #ff0055',
                    textAlign: 'center',
                    zIndex: 100,
                    width: '90%',
                    maxWidth: '400px'
                }}>
                    <h2 style={{ fontSize: '3rem', color: '#ff0055', margin: '0 0 20px 0' }}>TIME'S UP!</h2>
                    <p style={{ fontSize: '2rem', marginBottom: '30px', color: 'white' }}>Final Score: {score}</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <SquishyButton onClick={startGame} style={{
                            padding: '10px 20px',
                            fontSize: '1.2rem',
                            backgroundColor: '#ff0055',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}>
                            AGAIN
                        </SquishyButton>
                        <Link to="/arcade" style={{
                            padding: '10px 20px',
                            fontSize: '1.2rem',
                            backgroundColor: '#333',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            display: 'inline-block'
                        }}>
                            EXIT
                        </Link>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '100px', opacity: 0.6 }} />
            </div>
        </div>
    );
};

export default WhackAMoleGame;
