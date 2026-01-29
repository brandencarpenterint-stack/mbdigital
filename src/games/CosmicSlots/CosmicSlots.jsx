import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useRetroSound from '../../hooks/useRetroSound';
import { useGamification } from '../../context/GamificationContext';
import { triggerConfetti } from '../../utils/confetti';
import SquishyButton from '../../components/SquishyButton';

// SYMBOLS CONFIG
// Weights: Lower = Rarity
const SYMBOLS = [
    { id: 'cat', img: '/assets/merchboy_cat.png', value: 50, weight: 3 },
    { id: 'bunny', img: '/assets/merchboy_bunny.png', value: 50, weight: 3 },
    { id: 'face', img: '/assets/merchboy_face.png', value: 20, weight: 4 },
    { id: 'money', img: '/assets/merchboy_money.png', value: 100, weight: 1 }, // Jackpot
    { id: 'seven', char: '7️⃣', value: 200, weight: 1 }, // Super Jackpot
    { id: 'cherry', char: '🍒', value: 10, weight: 5 },
    { id: 'grape', char: '🍇', value: 10, weight: 5 }
];

// Helper to pick random symbol based on weight
const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (let s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
};

const REEL_COUNT = 3;
const SPIN_COST = 10;

const CosmicSlots = () => {
    const { coins, incrementStat, updateStat } = useGamification() || { coins: 1000, incrementStat: () => { }, updateStat: () => { } };
    const { playJump, playCollect, playWin } = useRetroSound();

    // State
    const [reels, setReels] = useState([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [jackpotEffect, setJackpotEffect] = useState(false);

    // Refs for animation
    const spinIntervals = useRef([]);

    const spin = () => {
        if (isSpinning) return;
        if (coins < SPIN_COST) {
            alert("Not enough coins! Go play other games to earn.");
            return;
        }

        // Deduct Cost
        // We assume updateStat handles deduction if negative? Or we need a specific method.
        // Assuming GamificationContext has a way, otherwise we might just increment negative.
        incrementStat('coins', -SPIN_COST);

        setIsSpinning(true);
        setWinAmount(0);
        setJackpotEffect(false);
        playJump(); // Spin sound start

        // Start Spinning
        const newReels = [...reels]; // Placeholders

        // Spin separate reels with slight delay
        [0, 1, 2].forEach((reelIdx) => {
            spinIntervals.current[reelIdx] = setInterval(() => {
                setReels(prev => {
                    const next = [...prev];
                    next[reelIdx] = getRandomSymbol();
                    return next;
                });
            }, 50 + (reelIdx * 20)); // Differing speeds
        });

        // Stop Sequence
        setTimeout(() => stopReel(0), 1000);
        setTimeout(() => stopReel(1), 1500);
        setTimeout(() => stopReel(2), 2000); // Final stop
    };

    const stopReel = (reelIdx) => {
        clearInterval(spinIntervals.current[reelIdx]);
        playCollect(); // Click sound on stop

        if (reelIdx === REEL_COUNT - 1) {
            checkWin();
        }
    };

    const checkWin = () => {
        setIsSpinning(false);

        // Determine result based on CURRENT reels state
        // Note: verify if state update is immediate enough. In React intervals, it might be tricky.
        // Better approach: Pre-determine the result at start, and just show animation.
        // BUT, given the simple setup above, let's grab the reel refs or just trust the state render cycle (might be risky).

        // To be safe, let's re-read the state in a clean timeout or use a ref. 
        // Actually, the `stopReel` closing over the variable might be stale.
        // Let's us `reels` from state selector inside a useEffect or just pass it?
        // Simplest Fix: calculate the results at the START of the spin and store them in a ref, 
        // then set the state to those results when stopping.
        // But for "visual" randomness, I'll stick to true random for now and read a Ref.
    };

    // Using a Ref to track current reels during spin for accurate final check
    const currentReelsRef = useRef(reels);
    useEffect(() => { currentReelsRef.current = reels; }, [reels]);

    const finalizeSpin = () => {
        const finalEx = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        // Actually, let's just force the state to these final "Rigged" (Randomly generated) values ensures consistency.
        // Updated logic:
        // 1. Generate 3 final symbols immediately.
        // 2. Animate visually.
        // 3. On stop, Set visual to final symbol.
    };

    // --- BETTER SPIN LOGIC ---
    useEffect(() => {
        return () => spinIntervals.current.forEach(clearInterval);
    }, []);

    const handleSpinClick = () => {
        if (isSpinning) return;
        if (coins < SPIN_COST) {
            alert("Need 10 Coins!");
            return;
        }

        incrementStat('coins', -SPIN_COST);
        setIsSpinning(true);
        setWinAmount(0);
        setJackpotEffect(false);
        playJump();

        // Determine Outcome Immediately
        const finalSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Start Visual Spin
        [0, 1, 2].forEach((i) => {
            spinIntervals.current[i] = setInterval(() => {
                setReels(prev => {
                    const u = [...prev];
                    u[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    return u;
                });
            }, 60);
        });

        // Stop Logic
        [0, 1, 2].forEach((i) => {
            setTimeout(() => {
                clearInterval(spinIntervals.current[i]);
                setReels(prev => {
                    const u = [...prev];
                    u[i] = finalSymbols[i];
                    return u;
                });
                playCollect(); // Clack!

                if (i === 2) {
                    calculateWin(finalSymbols);
                }
            }, 1000 + (i * 600)); // Staggered stops
        });
    };

    const calculateWin = (finalReels) => {
        setIsSpinning(false);
        const r0 = finalReels[0];
        const r1 = finalReels[1];
        const r2 = finalReels[2];

        let prize = 0;

        // 3 Match
        if (r0.id === r1.id && r1.id === r2.id) {
            prize = r0.value * 10; // BIG WIN
            setJackpotEffect(true);
            playWin();
            triggerConfetti();
        }
        // 2 Match (Any 2? Or just 0-1, 1-2? Let's say Any 2 for kid friendliness)
        else if (r0.id === r1.id || r1.id === r2.id || r0.id === r2.id) {
            prize = 15; // Small profit
            playCollect();
        }

        if (prize > 0) {
            setWinAmount(prize);
            incrementStat('coins', prize);
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
                <h1 style={{
                    fontFamily: '"Press Start 2P", display', color: '#ffd700',
                    fontSize: '2.5rem', textShadow: '0 0 20px #ff00ff', margin: 0
                }}>
                    COSMIC SLOTS
                </h1>
                <p style={{ color: '#aaa', marginTop: '10px' }}>SPIN 10 🪙 TO WIN BIG!</p>
            </div>

            {/* WALLET */}
            <div style={{
                background: '#333', padding: '10px 30px', borderRadius: '50px',
                border: '2px solid gold', fontSize: '1.5rem', marginBottom: '30px',
                boxShadow: '0 0 15px gold'
            }}>
                🪙 {coins}
            </div>

            {/* MACHINE */}
            <div style={{
                background: '#444',
                padding: '20px',
                borderRadius: '20px',
                border: '8px solid #cc00ff', // Neon Purple
                boxShadow: '0 0 50px #cc00ff40',
                position: 'relative',
                maxWidth: '600px',
                width: '100%'
            }}>
                {/* REELS CONTAINER */}
                <div style={{
                    display: 'flex', gap: '10px', background: '#000', padding: '10px',
                    borderRadius: '10px', border: '4px solid #222',
                    boxShadow: 'inset 0 0 20px #000'
                }}>
                    {reels.map((symbol, i) => (
                        <div key={i} style={{
                            flex: 1,
                            background: '#fff',
                            height: '150px',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem',
                            overflow: 'hidden',
                            border: '2px solid #ccc',
                            position: 'relative'
                        }}>
                            {/* GLOW IF WIN */}
                            {winAmount > 0 && (reels[0].id === symbol.id && reels[1].id === symbol.id && reels[2].id === symbol.id) && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 215, 0, 0.3)', zIndex: 0 }} className="blink"></div>
                            )}

                            {symbol.img ? (
                                <img src={symbol.img} alt={symbol.id} style={{
                                    width: '80%', height: '80%', objectFit: 'contain',
                                    filter: isSpinning ? 'blur(2px)' : 'none',
                                    transform: jackpotEffect ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'transform 0.3s'
                                }} />
                            ) : (
                                <span style={{ filter: isSpinning ? 'blur(2px)' : 'none' }}>{symbol.char}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* DECORATION */}
                <div style={{ position: 'absolute', top: -15, left: 20, width: '20px', height: '20px', background: 'red', borderRadius: '50%', boxShadow: '0 0 10px red' }} className="blink"></div>
                <div style={{ position: 'absolute', top: -15, right: 20, width: '20px', height: '20px', background: 'red', borderRadius: '50%', boxShadow: '0 0 10px red' }} className="blink"></div>
            </div>

            {/* CONTROLS */}
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

                {winAmount > 0 && (
                    <div style={{
                        fontSize: '3rem', color: '#00ffaa', fontWeight: 'bold',
                        textShadow: '0 0 20px #00ffaa', animation: 'bounce 0.5s infinite alternate'
                    }}>
                        +{winAmount} 🪙
                    </div>
                )}

                <SquishyButton
                    onClick={handleSpinClick}
                    disabled={isSpinning}
                    style={{
                        padding: '20px 80px',
                        fontSize: '2rem',
                        background: isSpinning ? '#555' : 'linear-gradient(to bottom, #ff0055, #cc0000)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        boxShadow: isSpinning ? 'none' : '0 10px 0 #660000',
                        opacity: isSpinning ? 0.7 : 1,
                        transform: isSpinning ? 'translateY(10px)' : 'none'
                    }}
                >
                    {isSpinning ? 'SPINNING...' : 'SPIN 🎰'}
                </SquishyButton>
            </div>

            <style>{`
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
                @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
            `}</style>

            <Link to="/arcade" style={{ marginTop: '40px', color: '#666' }}>Back to Arcade</Link>
        </div>
    );
};

export default CosmicSlots;
