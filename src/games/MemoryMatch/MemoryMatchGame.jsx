import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';
import UniversalGameOver from '../../components/UniversalGameOver';
import { useGamification } from '../../context/GamificationContext';
import { feedService } from '../../utils/feed';

const CARD_POOL = [
    { id: 1, type: 'image', content: '/assets/brokid-logo.png', alt: 'Brokid' },
    { id: 2, type: 'image', content: '/assets/merchboy_cat.png', alt: 'Cat Hat' },
    { id: 3, type: 'image', content: '/assets/merchboy_bunny.png', alt: 'Bunny Hat' },
    { id: 4, type: 'image', content: '/assets/skins/face_default.png', alt: 'OG' },
    { id: 5, type: 'image', content: '/assets/skins/jump_guy.png', alt: 'Jumper' },
    { id: 6, type: 'image', content: '/assets/skins/face_bear.png', alt: 'Bear' },
    { id: 7, type: 'image', content: '/assets/skins/face_dino.png', alt: 'Dino' },
    { id: 8, type: 'image', content: '/assets/skins/face_star.png', alt: 'Star' },
    { id: 9, type: 'image', content: '/assets/skins/face_space.png', alt: 'Space' },
    { id: 10, type: 'emoji', content: '🍔' },
    { id: 11, type: 'emoji', content: '⭐' },
    { id: 12, type: 'emoji', content: '🚀' },
    { id: 13, type: 'emoji', content: '👾' },
    { id: 14, type: 'emoji', content: '💰' },
    { id: 15, type: 'emoji', content: '🔥' },
    { id: 16, type: 'emoji', content: '💎' },
    { id: 17, type: 'emoji', content: '🍄' },
    { id: 18, type: 'emoji', content: '👑' },
    { id: 19, type: 'image', content: '/assets/skins/face_pumpkin.png', alt: 'Pumpkin' },
    { id: 20, type: 'image', content: '/assets/skins/face_gamer.png', alt: 'Gamer' },
    { id: 21, type: 'image', content: '/assets/skins/face_frog.png', alt: 'Frog' },
    { id: 22, type: 'image', content: '/assets/skins/face_astro.png', alt: 'Astro' },
    { id: 23, type: 'image', content: '/assets/skins/face_rainbow.png', alt: 'Rainbow' },
];

const MemoryMatchGame = () => {
    const { updateStat, addCoins, userProfile, stats } = useGamification() || {};
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [round, setRound] = useState(1);
    const [gameState, setGameState] = useState('PLAYING');
    const [disabled, setDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('memoryHighScore')) || 0);

    // Sync local high score with global stat on mount
    useEffect(() => {
        if (stats?.memoryHighScore > highScore) {
            setHighScore(stats.memoryHighScore);
        }
    }, [stats]);

    const { playBeep, playCollect, playWin } = useRetroSound();

    const initializeGame = (resetScore = false) => {
        let pairsCount = 6 + (round * 2); // R1: 8 pairs (4x4), R2: 10 pairs (4x5), R3: 12 pairs (4x6)
        if (pairsCount > CARD_POOL.length) pairsCount = CARD_POOL.length;

        const shuffledPool = [...CARD_POOL].sort(() => Math.random() - 0.5);
        const selectedCards = shuffledPool.slice(0, pairsCount);

        const duplicatedCards = [...selectedCards, ...selectedCards];
        const shuffledCards = duplicatedCards
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uid: index }));

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        if (resetScore) {
            setScore(0);
            setMoves(0);
            setRound(1);
        }
        setGameState('PLAYING');
        setDisabled(false);
    };

    useEffect(() => {
        if (round > 1) {
            initializeGame(false);
        } else {
            initializeGame(true);
        }
    }, [round]);

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
                    if (updateStat) updateStat('memoryHighScore', finalScore);

                    const playerName = userProfile?.name || 'Mind Master';
                    feedService.publish(`solved the Memory Matrix with ${finalScore} points! 🧠`, 'win', playerName);
                }

                if (updateStat) updateStat('gamesPlayed', 'memory_match');
                if (addCoins) addCoins(50);
            }
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 400);
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
                gridTemplateColumns: `repeat(${cards.length >= 24 ? 6 : (cards.length === 20 ? 5 : 4)}, 1fr)`,
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
                                width: cards.length >= 24 ? '80px' : '100px',
                                height: cards.length >= 24 ? '80px' : '100px',
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

            {gameState === 'ROUND_OVER' && (
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
                    <h2 style={{ fontSize: '3rem', color: '#ffff00', margin: '0 0 20px 0' }}>ROUND CLEARED!</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: 'white' }}>Great Job!</p>
                    <SquishyButton onClick={() => setRound(r => r + 1)} style={{
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        backgroundColor: '#ffff00',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '15px',
                        fontWeight: 'bold'
                    }}>
                        NEXT ROUND
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
