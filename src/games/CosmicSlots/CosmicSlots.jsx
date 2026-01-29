import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

// SYMBOLS CONFIG
const SYMBOLS = [
    { id: 'wild', char: '⭐', value: 0, weight: 1 }, // Wildcard (Value determined by match)
    { id: 'cat', img: '/assets/merchboy_cat.png', value: 25, weight: 3 },
    { id: 'bunny', img: '/assets/merchboy_bunny.png', value: 25, weight: 3 },
    { id: 'face', img: '/assets/merchboy_face.png', value: 10, weight: 4 },
    { id: 'money', img: '/assets/merchboy_money.png', value: 50, weight: 1 },
    { id: 'seven', char: '7️⃣', value: 100, weight: 1 },
    { id: 'cherry', char: '🍒', value: 5, weight: 5 },
    { id: 'grape', char: '🍇', value: 5, weight: 5 }
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
const SPIN_COST = 15;

const CosmicSlots = () => {
    const { coins, spendCoins, addCoins } = useGamification() || { coins: 0, spendCoins: () => false, addCoins: () => { } };
    const { playJump, playCollect, playWin } = useRetroSound();

    const [grid, setGrid] = useState([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
    ]);

    const [isSpinning, setIsSpinning] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [winningLines, setWinningLines] = useState([]);
    const [streak, setStreak] = useState(1); // Win Streak Multiplier

    const spinIntervals = useRef([]);

    useEffect(() => {
        return () => spinIntervals.current.forEach(clearInterval);
    }, []);

    const handleSpinClick = () => {
        if (isSpinning) return;

        // Attempt to spend coins
        if (!spendCoins(SPIN_COST)) return;

        setIsSpinning(true);
        setWinAmount(0);
        setWinningLines([]);
        playJump();

        // Target Outcome
        const finalGrid = Array(3).fill(null).map(() =>
            Array(3).fill(null).map(() => getRandomSymbol())
        );

        // Animate Cols
        [0, 1, 2].forEach((col) => {
            spinIntervals.current[col] = setInterval(() => {
                setGrid(prev => {
                    const newGrid = [...prev.map(row => [...row])];
                    for (let row = 0; row < ROWS; row++) {
                        newGrid[row][col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                    return newGrid;
                });
            }, 50 + (col * 20)); // Faster spin
        });

        // Stop Logic
        [0, 1, 2].forEach((col) => {
            setTimeout(() => {
                clearInterval(spinIntervals.current[col]);
                setGrid(prev => {
                    const newGrid = [...prev.map(row => [...row])];
                    for (let row = 0; row < ROWS; row++) {
                        newGrid[row][col] = finalGrid[row][col];
                    }
                    return newGrid;
                });
                playCollect();

                if (col === 2) {
                    calculateWin(finalGrid);
                }
            }, 800 + (col * 400)); // Snappier stop
        });
    };

    const calculateWin = (finalGrid) => {
        setIsSpinning(false);
        let basePrize = 0;
        let lines = [];

        // Helper: Check a line of 3 symbols
        const checkLine = (s1, s2, s3, lineId) => {
            // Filter out wilds to find the "target" symbol
            const nonWilds = [s1, s2, s3].filter(s => s.id !== 'wild');

            // If all wilds (3 Stars), JACKPOT!
            if (nonWilds.length === 0) {
                basePrize += 500;
                lines.push(lineId);
                return;
            }

            // Check if all non-wilds match the first non-wild
            const targetId = nonWilds[0].id;
            const isMatch = nonWilds.every(s => s.id === targetId);

            if (isMatch) {
                // Win value is the value of the target symbol
                // If it's pure wilds, we handled it. If mix, use target value.
                basePrize += nonWilds[0].value * 3;
                lines.push(lineId);
            }
        };

        // 1. Rows
        for (let r = 0; r < ROWS; r++) checkLine(finalGrid[r][0], finalGrid[r][1], finalGrid[r][2], `row-${r}`);
        // 2. Cols
        for (let c = 0; c < COLS; c++) checkLine(finalGrid[0][c], finalGrid[1][c], finalGrid[2][c], `col-${c}`);
        // 3. Diagonals
        checkLine(finalGrid[0][0], finalGrid[1][1], finalGrid[2][2], 'diag-1');
        checkLine(finalGrid[2][0], finalGrid[1][1], finalGrid[0][2], 'diag-2');

        if (basePrize > 0) {
            const totalWin = basePrize * streak;
            setWinAmount(totalWin);
            setWinningLines(lines);
            addCoins(totalWin);
            playWin();

            // Increase Streak
            setStreak(s => Math.min(s + 1, 5)); // Cap at 5x

            if (totalWin > 100 || lines.length > 1) {
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
                triggerConfetti();
            }
        } else {
            // Reset Streak on Loss
            setStreak(1);
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
                <p style={{ color: '#aaa', marginTop: '10px' }}>SPIN 15 🪙 FOR 8-LINE ACTION!</p>
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

                    {/* STREAK BADGE */}
                    {streak > 1 && (
                        <div style={{
                            position: 'absolute', top: '10px', right: '-80px',
                            background: '#ff4500', color: 'white', padding: '10px 15px',
                            borderRadius: '10px', fontWeight: '900', fontSize: '1.5rem',
                            transform: 'rotate(10deg)', boxShadow: '0 0 15px #ff4500',
                            animation: 'pulse 1s infinite'
                        }}>
                            x{streak} 🔥
                        </div>
                    )}

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
                @keyframes pulse { 0% { transform: rotate(10deg) scale(1); } 50% { transform: rotate(10deg) scale(1.1); } 100% { transform: rotate(10deg) scale(1); } }
            `}</style>

            <Link to="/arcade" style={{ marginTop: '40px', color: '#666' }}>Back to Arcade</Link>
        </div>
    );
};

export default CosmicSlots;
