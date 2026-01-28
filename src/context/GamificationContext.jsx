import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { DAILY_TEMPLATES } from '../config/DailyQuests';
import useRetroSound from '../hooks/useRetroSound';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const [stats, setStats] = useState(() => {
        return JSON.parse(localStorage.getItem('merchboy_stats')) || {
            fishCaught: 0,
            legendariesCaught: 0,
            bossKills: 0,
            galaxyHighScore: 0,
            brickHighScore: 0,
            gamesPlayed: []
        };
    });

    // --- DAILY REWARDS STATE ---
    // v2 Fix: Moved to top to prevent ReferenceError
    console.log('GamificationProvider: Initializing Daily State...');

    const [dailyState, setDailyState] = useState(() => {
        return JSON.parse(localStorage.getItem('merchboy_daily')) || {
            lastCheckIn: null, // Date string
            streak: 0,
            questDate: null,
            quests: []
        };
    });

    const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
        return JSON.parse(localStorage.getItem('merchboy_achievements')) || [];
    });

    const [recentUnlock, setRecentUnlock] = useState(null); // For Toast
    const { playWin } = useRetroSound();

    useEffect(() => {
        localStorage.setItem('merchboy_stats', JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem('merchboy_achievements', JSON.stringify(unlockedAchievements));
    }, [unlockedAchievements]);

    // Check Achievements whenever stats change
    useEffect(() => {
        ACHIEVEMENTS.forEach(ach => {
            if (!unlockedAchievements.includes(ach.id)) {
                if (ach.condition(stats)) {
                    unlock(ach);
                }
            }
        });
    }, [stats, unlockedAchievements]);

    const unlock = (achievement) => {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        setRecentUnlock(achievement);
        playWin(); // Sound

        // Clear toast after 3s
        setTimeout(() => setRecentUnlock(null), 3000);
    };



    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDailyState(prev => {
            let newState = { ...prev };

            // 1. QUEST GENERATION (Midnight Reset)
            if (prev.questDate !== today) {
                const shuffled = [...DAILY_TEMPLATES].sort(() => 0.5 - Math.random());
                const newQuests = shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, claimed: false }));

                newState.questDate = today;
                newState.quests = newQuests;
            }
            return newState;
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('merchboy_daily', JSON.stringify(dailyState));
    }, [dailyState]);

    const claimDailyLogin = () => {
        const today = new Date().toISOString().split('T')[0];
        if (dailyState.lastCheckIn === today) return false;

        setDailyState(prev => ({
            ...prev,
            lastCheckIn: today,
            streak: prev.streak + 1
        }));

        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        localStorage.setItem('arcadeCoins', currentCoins + 100);

        return true;
    };

    const claimQuest = (questId) => {
        let reward = 0;
        setDailyState(prev => {
            const quests = prev.quests.map(q => {
                if (q.id === questId && !q.claimed && q.progress >= q.target) {
                    reward = q.reward;
                    return { ...q, claimed: true };
                }
                return q;
            });
            return { ...prev, quests };
        });

        if (reward > 0) {
            const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
            localStorage.setItem('arcadeCoins', currentCoins + reward);
            playWin();
        }
    };

    // Helper to update daily quest progress (High Score type)
    const checkHighscoreQuest = (key, value) => {
        setDailyState(dPrev => {
            const updatedQuests = dPrev.quests.map(q => {
                if (!q.claimed && q.type === key && q.condition === 'gt') {
                    if (value >= q.target) return { ...q, progress: value }; // Instant complete
                }
                return q;
            });
            return { ...dPrev, quests: updatedQuests };
        });
    };

    // --- SHOP LOGIC ---
    const [shopState, setShopState] = useState(() => {
        return JSON.parse(localStorage.getItem('merchboy_shop')) || {
            unlocked: ['snake_default', 'rod_default', 'paddle_default', 'ship_default'],
            equipped: {
                snake: 'snake_default',
                fishing: 'rod_default',
                brick: 'paddle_default',
                galaxy: 'ship_default'
            }
        };
    });

    useEffect(() => {
        localStorage.setItem('merchboy_shop', JSON.stringify(shopState));
    }, [shopState]);

    const buyItem = (item) => {
        const currentCoins = parseInt(localStorage.getItem('arcadeCoins')) || 0;
        if (currentCoins >= item.price && !shopState.unlocked.includes(item.id)) {
            localStorage.setItem('arcadeCoins', currentCoins - item.price);
            setShopState(prev => ({ ...prev, unlocked: [...prev.unlocked, item.id] }));
            playWin();
            return true;
        }
        return false;
    };

    const equipItem = (category, itemId) => {
        if (shopState.unlocked.includes(itemId)) {
            setShopState(prev => ({
                ...prev,
                equipped: { ...prev.equipped, [category]: itemId }
            }));
        }
    };

    const incrementStat = (key, amount = 1) => {
        setStats(prev => {
            const newVal = (prev[key] || 0) + amount;

            // DAILY QUEST TRACKING HOOK
            setDailyState(dPrev => {
                const updatedQuests = dPrev.quests.map(q => {
                    if (!q.claimed && q.type === key && !q.condition) {
                        return { ...q, progress: q.progress + amount };
                    }
                    return q;
                });
                return { ...dPrev, quests: updatedQuests };
            });

            return { ...prev, [key]: newVal };
        });
    };

    const updateStat = (key, value) => {
        setStats(prev => {
            // 1. Highscore Quest Check
            if (typeof value === 'number' && (!prev[key] || value > prev[key])) {
                checkHighscoreQuest(key, value);
            }

            // 2. Array Handling (gamesPlayed)
            if (Array.isArray(prev[key])) {
                if (!prev[key].includes(value)) {
                    if (key === 'gamesPlayed') incrementStat('gamesPlayedCount', 1);
                    return { ...prev, [key]: [...prev[key], value] };
                }
                return prev;
            }

            // 3. Standard Replacement
            const newValue = typeof value === 'function' ? value(prev[key] || 0) : value;
            return { ...prev, [key]: newValue };
        });
    };

    return (
        <GamificationContext.Provider value={{
            stats,
            unlockedAchievements,
            updateStat,
            incrementStat,
            recentUnlock,
            dailyState,
            claimDailyLogin,
            claimQuest,
            shopState,
            buyItem,
            equipItem
        }}>
            {children}

            {/* GLOBAL TOAST */}
            {recentUnlock && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translate(-50%, 0)',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    border: '2px solid white', borderRadius: '10px',
                    padding: '10px 20px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    animation: 'slideDown 0.5s ease-out'
                }}>
                    <div style={{ fontSize: '2rem' }}>🏆</div>
                    <div>
                        <h4 style={{ margin: 0, color: 'black', fontWeight: 'bold' }}>ACHIEVEMENT UNLOCKED!</h4>
                        <p style={{ margin: 0, color: '#333' }}>{recentUnlock.title}</p>
                    </div>
                </div>
            )}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
