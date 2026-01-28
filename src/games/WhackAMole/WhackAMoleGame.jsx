import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const MOLE_COUNT = 9;
const GAME_DURATION = 30;

const WhackAMoleGame = () => {
    const [moles, setMoles] = useState(new Array(MOLE_COUNT).fill(false));
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('whackHighScore')) || 0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const { playJump, playWin } = useRetroSound();

    // Timer Ref to clear intervals
    const popTimerRef = useRef(null);
    const gameTimerRef = useRef(null);

    const endGame = () => {
        clearInterval(gameTimerRef.current);
        clearTimeout(popTimerRef.current);
        setGameActive(false);
        setGameOver(true);
        setMoles(new Array(MOLE_COUNT).fill(false));
        playWin(); // Fanfare

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('whackHighScore', score);
            triggerConfetti();
        }

        // Award Coins (1 coin per 10 points)
        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + Math.floor(score / 10));
    };

    const popMoles = () => {
        const popTime = Math.random() * 800 + 400; // Random time
        popTimerRef.current = setTimeout(() => {
            if (!gameActive && timeLeft <= 0) return;

            const newMoles = new Array(MOLE_COUNT).fill(false);
            const randomIdx = Math.floor(Math.random() * MOLE_COUNT);
            newMoles[randomIdx] = true;
            setMoles(newMoles);

            // Check if game is still active before continuing recursion (implicitly handled by useEffect cleanup somewhat, but robust here)
            // But popMoles is only called if we want more moles. We should check if game is over inside the timeout.
            // (Added check above)
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', color: '#ff0055', width: '100%', minHeight: '100vh', touchAction: 'manipulation' }}>
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
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                padding: '10px',
                width: '100%',
                maxWidth: '500px',
                aspectRatio: '1/1', // Keep square aspect ratio for the whole board
                backgroundColor: '#2a2a40',
                borderRadius: '20px',
                border: '4px solid #ff0055',
                boxShadow: '0 0 20px #ff005540'
            }}>
                {moles.map((isUp, index) => (
                    <div
                        key={index}
                        onMouseDown={() => handleWhack(index)} // Mouse
                        onTouchStart={(e) => { e.preventDefault(); handleWhack(index); }} // Touch (prevent ghost clicks)
                        style={{
                            width: '100%',
                            height: '100%', // Fill grid cell
                            backgroundColor: '#1a1a2e',
                            borderRadius: '50%',
                            position: 'relative',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            border: '2px solid #333',
                            touchAction: 'none'
                        }}
                    >
                        {/* Hole Bottom */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '10%',
                            width: '80%',
                            height: '30%',
                            backgroundColor: '#000',
                            borderRadius: '50%'
                        }} />

                        {/* Mole (Mascot) */}
                        <div style={{
                            position: 'absolute',
                            bottom: isUp ? '10%' : '-100%', // Use % for responsiveness
                            left: '10%',
                            width: '80%',
                            height: '80%',
                            backgroundImage: 'url(/assets/merchboy_face.png)',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            transition: 'bottom 0.1s ease-out'
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
