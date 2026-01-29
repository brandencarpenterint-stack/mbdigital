import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

const CARDS = [
    { id: 1, type: 'image', content: '/assets/boy-logo.png', alt: 'Boy' },
    { id: 2, type: 'image', content: '/assets/brokid-logo.png', alt: 'Brokid' },
    { id: 3, type: 'image', content: '/assets/boy_face.png', alt: 'Merchboy' },
    { id: 4, type: 'image', content: '/assets/merchboy_cat.png', alt: 'Cat Hat' },
    { id: 5, type: 'image', content: '/assets/merchboy_bunny.png', alt: 'Bunny Hat' },
    { id: 6, type: 'image', content: '/assets/merchboy_money.png', alt: 'Money Face' },
    { id: 7, type: 'emoji', content: '⭐️' },
    { id: 8, type: 'emoji', content: '🍔' },
];

const MemoryMatchGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('memoryHighScore')) || 0);

    const { playBeep, playCollect, playWin } = useRetroSound();

    const initializeGame = () => {
        const duplicatedCards = [...CARDS, ...CARDS];
        const shuffledCards = duplicatedCards
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uid: index }));

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setScore(0);
        setMoves(0);
        setDisabled(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const checkForMatch = ([firstId, secondId]) => {
        const firstCard = cards.find(c => c.uid === firstId);
        const secondCard = cards.find(c => c.uid === secondId);

        if (firstCard.id === secondCard.id) {
            setSolved(prev => [...prev, firstCard.id]);
            setFlipped([]);
            setDisabled(false);
            setScore(prev => prev + 100);
            playCollect();
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // Success Triple-Tap

            // Allow animation to finish
            if (solved.length + 1 === CARDS.length) {
                playWin();
                triggerConfetti();
                const finalScore = score + 100 + (Math.max(0, 50 - moves) * 10);
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    localStorage.setItem('memoryHighScore', finalScore);
                }

                // Award Coins flat amount for win
                const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
                localStorage.setItem('arcadeCoins', currentCoins + 50);
            }
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    const handleClick = (id) => {
        if (disabled) return;

        // Prevent clicking same card or solved card
        if (flipped.includes(id) || solved.includes(cards.find(c => c.uid === id).id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);
        playBeep();
        if (navigator.vibrate) navigator.vibrate(5); // Tiny tick

        if (newFlipped.length === 2) {
            setDisabled(true);
            setMoves(prev => prev + 1);
            checkForMatch(newFlipped);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: '#ffff00' }}>
            <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '3rem', margin: '10px 0' }}>MEMORY MATCH</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '500px', marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span>MOVES: {moves}</span>
                <span>SCORE: {score}</span>
                <span>HIGH: {highScore}</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                padding: '20px',
                backgroundColor: '#1a1a2e',
                borderRadius: '15px',
                border: '4px solid #ffff00'
            }}>
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.uid) || solved.includes(card.id);
                    return (
                        <div
                            key={card.uid}
                            onClick={() => handleClick(card.uid)}
                            style={{
                                width: '100px',
                                height: '100px',
                                perspective: '1000px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}>
                                {/* Front (Hidden) */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    backgroundColor: '#333',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #555'
                                }}>
                                    <span style={{ fontSize: '2rem', color: '#777' }}>?</span>
                                </div>

                                {/* Back (Revealed) */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                    transform: 'rotateY(180deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #ffff00'
                                }}>
                                    {card.type === 'image' ? (
                                        <img src={card.content} alt={card.alt} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '3rem' }}>{card.content}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {solved.length === CARDS.length && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '4px solid #ffff00',
                    textAlign: 'center',
                    zIndex: 100
                }}>
                    <h2 style={{ fontSize: '3rem', color: '#ffff00', margin: '0 0 20px 0' }}>YOU WIN!</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: 'white' }}>Great Job!</p>
                    <SquishyButton onClick={initializeGame} style={{
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        backgroundColor: '#ffff00',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '15px',
                        fontWeight: 'bold'
                    }}>
                        PLAY AGAIN
                    </SquishyButton>
                    <Link to="/arcade" style={{
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        backgroundColor: '#333',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}>
                        EXIT
                    </Link>
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <img src="/assets/brokid-logo.png" alt="Brokid" style={{ width: '150px', opacity: 0.6 }} />
            </div>
        </div>
    );
};

export default MemoryMatchGame;
