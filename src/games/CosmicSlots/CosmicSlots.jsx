import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

// SYMBOLS CONFIG
const SYMBOLS = [
    { id: 'cat', img: '/assets/merchboy_cat.png', value: 50, weight: 3 },
    { id: 'bunny', img: '/assets/merchboy_bunny.png', value: 50, weight: 3 },
    { id: 'face', img: '/assets/merchboy_face.png', value: 20, weight: 4 },
    { id: 'money', img: '/assets/merchboy_money.png', value: 100, weight: 1 }, // Jackpot
    { id: 'seven', char: '7️⃣', value: 200, weight: 1 }, // Super Jackpot
    { id: 'cherry', char: '🍒', value: 10, weight: 5 },
    { id: 'grape', char: '🍇', value: 10, weight: 5 }
];

const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (let s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
};

const ROWS = 3;
const COLS = 3;
const SPIN_COST = 25; // Increased cost for 3 rows

const CosmicSlots = () => {
    const { coins, incrementStat } = useGamification() || { coins: 1000, incrementStat: () => { } };
    const { playJump, playCollect, playWin } = useRetroSound();

    // 3x3 Grid State (Array of Arrays)
    const [grid, setGrid] = useState([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
    ]);

    const [isSpinning, setIsSpinning] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [winningLines, setWinningLines] = useState([]); // Array of line indices

    const spinIntervals = useRef([]);

    useEffect(() => {
        return () => spinIntervals.current.forEach(clearInterval);
    }, []);

    const handleSpinClick = () => {
        if (isSpinning) return;
        if (coins < SPIN_COST) {
            alert(`Need ${SPIN_COST} Coins!`);
            return;
        }

        incrementStat('coins', -SPIN_COST);
        setIsSpinning(true);
        setWinAmount(0);
        setWinningLines([]);
        playJump();

        // Target Outcome
        const finalGrid = Array(3).fill(null).map(() =>
            Array(3).fill(null).map(() => getRandomSymbol())
        );

        // Animate Cols (Reels)
        [0, 1, 2].forEach((col) => {
            spinIntervals.current[col] = setInterval(() => {
                setGrid(prev => {
                    const newGrid = [...prev.map(row => [...row])];
                    // Randomize just this column
                    for (let row = 0; row < ROWS; row++) {
                        newGrid[row][col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                    return newGrid;
                });
            }, 60 + (col * 20));
        });

        // Stop Logic
        [0, 1, 2].forEach((col) => {
            setTimeout(() => {
                clearInterval(spinIntervals.current[col]);
                setGrid(prev => {
                    const newGrid = [...prev.map(row => [...row])];
                    // Set final column
                    for (let row = 0; row < ROWS; row++) {
                        newGrid[row][col] = finalGrid[row][col];
                    }
                    return newGrid;
                });
                playCollect();

                if (col === 2) {
                    calculateWin(finalGrid);
                }
            }, 1000 + (col * 500));
        });
    };

    const calculateWin = (finalGrid) => {
        setIsSpinning(false);
        let totalPrize = 0;
        let lines = [];

        // Check Rows
        for (let r = 0; r < ROWS; r++) {
            if (finalGrid[r][0].id === finalGrid[r][1].id && finalGrid[r][1].id === finalGrid[r][2].id) {
                totalPrize += finalGrid[r][0].value * 3;
                lines.push(`row-${r}`);
            }
        }

        // Check Columns (Vertical)
        for (let c = 0; c < COLS; c++) {
            if (finalGrid[0][c].id === finalGrid[1][c].id && finalGrid[1][c].id === finalGrid[2][c].id) {
                totalPrize += finalGrid[0][c].value * 3;
                lines.push(`col-${c}`);
            }
        }

        // Check Diagonals
        if (finalGrid[0][0].id === finalGrid[1][1].id && finalGrid[1][1].id === finalGrid[2][2].id) {
            totalPrize += finalGrid[1][1].value * 3;
            lines.push('diag-1');
        }
        if (finalGrid[2][0].id === finalGrid[1][1].id && finalGrid[1][1].id === finalGrid[0][2].id) {
            totalPrize += finalGrid[1][1].value * 3;
            lines.push('diag-2');
        }

        if (totalPrize > 0) {
            setWinAmount(totalPrize);
            setWinningLines(lines);
            incrementStat('coins', totalPrize);
            playWin();
            // Multi-win effect
            if (lines.length > 1) {
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
                triggerConfetti();
            } else if (totalPrize > 100) {
                triggerConfetti();
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle, #220033 0%, #000 100%)',
            color: 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontFamily: '"Press Start 2P", display', color: '#ffd700', fontSize: '2.5rem', textShadow: '0 0 20px #ff00ff', margin: 0 }}>
                    COSMIC SLOTS
                </h1>
                <p style={{ color: '#aaa', marginTop: '10px' }}>SPIN 25 🪙 FOR 8-LINE ACTION!</p>
            </div>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* LEFT: PAYOUT TABLE */}
                <div style={{
                    background: 'rgba(0,0,0,0.5)', border: '2px solid #555',
                    borderRadius: '10px', padding: '20px', minWidth: '200px',
                    fontFamily: 'monospace'
                }}>
                    <h3 style={{ color: '#ffd700', borderBottom: '1px solid #555', paddingBottom: '10px' }}>PAYOUTS (3x)</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {SYMBOLS.sort((a, b) => b.value - a.value).map(s => (
                            <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #333' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {s.img ? <img src={s.img} style={{ width: '20px' }} /> : <span>{s.char}</span>}
                                    {s.img ? <img src={s.img} style={{ width: '20px' }} /> : <span>{s.char}</span>}
                                    {s.img ? <img src={s.img} style={{ width: '20px' }} /> : <span>{s.char}</span>}
                                </div>
                                <span style={{ color: 'gold' }}>{s.value * 3}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CENTER: MACHINE */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                }}>
                    {/* WALLET */}
                    <div style={{
                        background: '#333', padding: '10px 30px', borderRadius: '50px',
                        border: '2px solid gold', fontSize: '1.5rem',
                        boxShadow: '0 0 15px gold'
                    }}>
                        🪙 {coins}
                    </div>

                    <div style={{
                        background: '#444', padding: '20px', borderRadius: '20px',
                        border: '8px solid #cc00ff', boxShadow: '0 0 50px #cc00ff40',
                        position: 'relative'
                    }}>
                        {/* 3x3 GRID */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px',
                            background: '#000', padding: '10px', borderRadius: '10px', border: '4px solid #222'
                        }}>
                            {grid.flat().map((symbol, i) => {
                                const row = Math.floor(i / 3);
                                const col = i % 3;
                                // Check if this cell is part of a winning line
                                let isWinner = false;
                                if (winningLines.includes(`row-${row}`)) isWinner = true;
                                if (winningLines.includes(`col-${col}`)) isWinner = true;
                                if (winningLines.includes('diag-1') && ((row === 0 && col === 0) || (row === 1 && col === 1) || (row === 2 && col === 2))) isWinner = true;
                                if (winningLines.includes('diag-2') && ((row === 2 && col === 0) || (row === 1 && col === 1) || (row === 0 && col === 2))) isWinner = true;

                                return (
                                    <div key={i} style={{
                                        height: '100px', background: isWinner ? '#ffffcc' : '#fff',
                                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '3rem', border: isWinner ? '4px solid gold' : '2px solid #ccc',
                                        transition: 'background 0.3s'
                                    }}>
                                        {symbol.img ? (
                                            <img src={symbol.img} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                        ) : (
                                            <span>{symbol.char}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* DECORATION */}
                        <div style={{ position: 'absolute', top: -15, left: 20, width: '20px', height: '20px', background: 'red', borderRadius: '50%', boxShadow: '0 0 10px red' }} className="blink"></div>
                        <div style={{ position: 'absolute', top: -15, right: 20, width: '20px', height: '20px', background: 'red', borderRadius: '50%', boxShadow: '0 0 10px red' }} className="blink"></div>
                    </div>

                    <SquishyButton
                        onClick={handleSpinClick}
                        disabled={isSpinning}
                        style={{
                            padding: '20px 80px', fontSize: '2rem',
                            background: isSpinning ? '#555' : 'linear-gradient(to bottom, #ff0055, #cc0000)',
                            color: 'white', border: 'none', borderRadius: '20px',
                            boxShadow: isSpinning ? 'none' : '0 10px 0 #660000',
                            opacity: isSpinning ? 0.7 : 1, transform: isSpinning ? 'translateY(10px)' : 'none'
                        }}
                    >
                        {isSpinning ? '...' : 'SPIN'}
                    </SquishyButton>

                    {winAmount > 0 && (
                        <div style={{ fontSize: '2rem', color: '#00ffaa', fontWeight: 'bold', textShadow: '0 0 20px #00ffaa' }}>
                            WIN: {winAmount} 🪙
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
            `}</style>

            <Link to="/arcade" style={{ marginTop: '40px', color: '#666' }}>Back to Arcade</Link>
        </div>
    );
};

export default CosmicSlots;
