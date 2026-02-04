import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import SquishyButton from '../../components/SquishyButton';
import { useGamification } from '../../context/GamificationContext';

const MemoryMatchGame = () => {
    const { updateStat, addCoins, stats } = useGamification() || {};
    const { playCollect, playWin, playBeep } = useRetroSound();

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, WON

    // Assets
    const SHEET_SRC = '/assets/match_sheet.png';
    // 8 items in sheet. 2x4 grid?
    // Indices 0-7.
    // 0: Back (Logo), 1: Hoodie, 2: Cap, 3: Sneaker, 4: GB, 5: Disk, 6: Pizza, 7: Potion.

    useEffect(() => {
        if (stats?.memoryHighScore) setHighScore(stats.memoryHighScore);
    }, [stats]);

    const initGame = () => {
        // Pairs of indices 1 to 7
        const items = [1, 2, 3, 4, 5, 6, 7];
        // Select 6 pairs for 12 cards grid (3x4) or 8 pairs for 16 (4x4).
        // Sheet has 7 items + Back. 
        // Let's use all 7 items (14 cards) + maybe duplicate one to make 16? 
        // Or just use 6 items (12 cards). 3x4 grid is nice.
        const selection = items.slice(0, 6);
        const deck = [...selection, ...selection];
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        setCards(deck.map((id, index) => ({ id, uid: index })));
        setFlipped([]);
        setSolved([]);
        setScore(0);
        setMoves(0);
        setGameState('PLAYING');
    };

    const handleCardClick = (uid) => {
        if (gameState !== 'PLAYING') return;
        if (flipped.includes(uid) || solved.includes(cards.find(c => c.uid === uid).id)) return;
        if (flipped.length >= 2) return; // Wait

        playBeep();
        const newFlipped = [...flipped, uid];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const c1 = cards.find(c => c.uid === newFlipped[0]);
            const c2 = cards.find(c => c.uid === newFlipped[1]);

            if (c1.id === c2.id) {
                // Match
                setTimeout(() => {
                    playCollect();
                    setSolved(s => [...s, c1.id]);
                    setFlipped([]);
                    setScore(s => s + 100);

                    if (solved.length + 1 === 6) { // 6 pairs
                        winGame();
                    }
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    const winGame = () => {
        playWin();
        setGameState('WON');
        const finalScore = score + 100 + Math.max(0, 100 - moves * 5);
        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (updateStat) updateStat('memoryHighScore', finalScore);
        }
        if (addCoins) addCoins(50);
    };

    // Render Tile helper
    const CardTile = ({ card, isFlipped, isSolved }) => {
        const showFace = isFlipped || isSolved;
        return (
            <div onClick={() => handleCardClick(card.uid)} style={{
                width: '80px', height: '80px', margin: '5px',
                position: 'relative', perspective: '1000px', cursor: 'pointer'
            }}>
                <div style={{
                    width: '100%', height: '100%', position: 'absolute',
                    transformStyle: 'preserve-3d', transition: 'transform 0.4s',
                    transform: showFace ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                    {/* Front (Back of card logically) */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                        background: '#222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #555'
                    }}>
                        {/* Sprite: Back is Index 0. Row 0, Col 0 */}
                        <div style={{
                            width: '64px', height: '64px',
                            backgroundImage: `url(${SHEET_SRC})`,
                            backgroundPosition: '0 0', // 0,0
                            backgroundSize: '400% 200%' // 4 cols, 2 rows approx (8 items) -> Sheet logic check
                            // Sheet prompt: 8 items. Grid. usually 2x4 or 4x2.
                            // Generated img likely 4 cols x 2 rows.
                            // Id 0 (Back) -> 0,0
                        }} />
                    </div>

                    {/* Back (Face of card logically) */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                        background: '#fff', borderRadius: '10px', transform: 'rotateY(180deg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid gold', boxShadow: isSolved ? '0 0 10px gold' : 'none'
                    }}>
                        {/* Sprite: ID determines pos */}
                        {/* ID 1..7 */}
                        {/* 4 cols. Row 0: 0, 1, 2, 3. Row 1: 4, 5, 6, 7 */}
                        <div style={{
                            width: '64px', height: '64px',
                            backgroundImage: `url(${SHEET_SRC})`,
                            backgroundPosition: `${(card.id % 4) * 100 / 3}% ${Math.floor(card.id / 4) * 100}%`,
                            backgroundSize: '400% 200%'
                        }} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#222', color: 'white' }}>
            <h1 style={{ fontFamily: '"Press Start 2P"', color: 'cyan', textShadow: '4px 4px 0 magenta' }}>MERCH MATCH</h1>

            <div style={{ display: 'flex', gap: '20px', fontSize: '1.2rem', margin: '10px' }}>
                <div>MOVES: {moves}</div>
                <div>SCORE: {score}</div>
                <div>HIGH: {highScore}</div>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
                background: '#333', padding: '20px', borderRadius: '20px', border: '4px solid #555'
            }}>
                {cards.map(c => (
                    <CardTile key={c.uid} card={c} isFlipped={flipped.includes(c.uid)} isSolved={solved.includes(c.id)} />
                ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <SquishyButton onClick={initGame} style={{ background: 'cyan', color: 'black' }}>
                    {gameState === 'START' ? 'START' : 'RESTART'}
                </SquishyButton>
                <Link to="/arcade">
                    <SquishyButton style={{ background: '#555' }}>EXIT</SquishyButton>
                </Link>
            </div>

            {gameState === 'WON' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: 'gold', fontSize: '3rem' }}>MATCHED!</h1>
                    <div style={{ fontSize: '2rem' }}>FINAL SCORE: {score + 100 + Math.max(0, 100 - moves * 5)}</div>
                    <SquishyButton onClick={initGame} style={{ background: 'gold', color: 'black', marginTop: '20px' }}>PLAY AGAIN</SquishyButton>
                </div>
            )}
        </div>
    );
};

export default MemoryMatchGame;
