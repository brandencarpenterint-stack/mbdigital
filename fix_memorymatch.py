import re

filepath = 'src/games/MemoryMatch/MemoryMatchGame.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CARDS
target_cards = """const CARDS = [
    { id: 1, type: 'image', content: '/assets/boy-logo.png', alt: 'Boy' },
    { id: 2, type: 'image', content: '/assets/brokid-logo.png', alt: 'Brokid' },
    { id: 3, type: 'image', content: '/assets/boy_face.png', alt: 'Merchboy' },
    { id: 4, type: 'image', content: '/assets/merchboy_cat.png', alt: 'Cat Hat' },
    { id: 5, type: 'image', content: '/assets/merchboy_bunny.png', alt: 'Bunny Hat' },
    { id: 6, type: 'image', content: '/assets/merchboy_money.png', alt: 'Money Face' },
    { id: 7, type: 'emoji', content: '🍔' },
    { id: 8, type: 'emoji', content: '⭐' },
];"""

replacement_cards = """const CARD_POOL = [
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
];"""

content = content.replace(target_cards, replacement_cards)

# Add round state
target_state = """    const [solved, setSolved] = useState([]);"""
replacement_state = """    const [solved, setSolved] = useState([]);
    const [round, setRound] = useState(1);
    const [gameState, setGameState] = useState('PLAYING');"""
content = content.replace(target_state, replacement_state)

# Replace initializeGame
target_init = """    const initializeGame = () => {
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
    }, []);"""

replacement_init = """    const initializeGame = (resetScore = false) => {
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
    }, [round]);"""
content = content.replace(target_init, replacement_init)

# Replace check for match logic (winning round)
target_match = """            // Allow animation to finish
            if (solved.length + 1 === CARDS.length) {
                playWin();
                triggerConfetti();
                const finalScore = score + 100 + (Math.max(0, 50 - moves) * 10);
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    if (updateStat) updateStat('memoryHighScore', finalScore);

                    const playerName = userProfile?.name || 'Mind Master';
                    feedService.publish(`solved the Memory Matrix with ${finalScore} points! 👾`, 'win', playerName);
                }

                if (updateStat) updateStat('gamesPlayed', 'memory_match');
                if (addCoins) addCoins(50);
            }"""

replacement_match = """            // Allow animation to finish
            if (solved.length + 1 === cards.length / 2) {
                playWin();
                triggerConfetti();
                const finalScore = score + 100 + (Math.max(0, 50 - moves) * 10);
                setScore(finalScore);
                
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    if (updateStat) updateStat('memoryHighScore', finalScore);
                }

                if (updateStat) updateStat('gamesPlayed', 'memory_match');
                if (addCoins) addCoins(50);
                
                setTimeout(() => setGameState('ROUND_OVER'), 1000);
            }"""
content = content.replace(target_match, replacement_match)

# Replace grid styling
target_grid = """                gridTemplateColumns: 'repeat(4, 1fr)',"""
replacement_grid = """                gridTemplateColumns: `repeat(${cards.length >= 24 ? 6 : (cards.length === 20 ? 5 : 4)}, 1fr)`,"""
content = content.replace(target_grid, replacement_grid)

# Replace solved display
target_win = """            {solved.length === CARDS.length && ("""
replacement_win = """            {gameState === 'ROUND_OVER' && ("""
content = content.replace(target_win, replacement_win)

# Replace button in solved modal
target_button = """                    <SquishyButton onClick={initializeGame} style={{"""
replacement_button = """                    <SquishyButton onClick={() => setRound(r => r + 1)} style={{"""
content = content.replace(target_button, replacement_button)

# Also rename PLAY AGAIN to NEXT ROUND
target_playagain = """                        PLAY AGAIN
                    </SquishyButton>"""
replacement_playagain = """                        NEXT ROUND
                    </SquishyButton>"""
content = content.replace(target_playagain, replacement_playagain)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MemoryMatchGame.jsx")
