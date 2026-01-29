import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { DAILY_TEMPLATES } from '../config/DailyQuests';
import { SHOP_ITEMS } from '../config/ShopItems';
import useRetroSound from '../hooks/useRetroSound';
import { useToast } from './ToastContext';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const { showToast } = useToast();
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



    // --- ECONOMY STATE ---
    const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('arcadeCoins')) || 0);

    useEffect(() => {
        localStorage.setItem('arcadeCoins', coins);
        // Trigger storage event for cross-tab? Not needed for single tab app.
    }, [coins]);

    // --- PROFILE STATE ---
    const [userProfile, setUserProfile] = useState(() => {
        return JSON.parse(localStorage.getItem('merchboy_profile')) || {
            name: 'OPERATOR',
            avatar: '/assets/merchboy_face.png'
        };
    });

    const updateProfile = (updates) => {
        setUserProfile(prev => {
            const newState = { ...prev, ...updates };
            localStorage.setItem('merchboy_profile', JSON.stringify(newState));
            return newState;
        });
        showToast('Profile Updated!', 'success');
    };

    // --- DAILY REWARDS STATE ---

    const [dailyState, setDailyState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('merchboy_daily')) || {
                lastCheckIn: null, streak: 0, questDate: null, quests: []
            };
        } catch (e) {
            console.error("Daily State Corrupt:", e);
            return { lastCheckIn: null, streak: 0, questDate: null, quests: [] };
        }
    });

    const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('merchboy_achievements')) || [];
        } catch (e) { return []; }
    });

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
        playWin(); // Sound
        showToast(achievement.title, 'achievement');
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
        showToast("Daily Login: +100 Coins", "coin");

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
            showToast(`Quest Complete: +${reward} Coins`, "coin");
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
        const defaults = {
            unlocked: ['snake_default', 'rod_default', 'boat_default', 'paddle_default', 'ship_default', 'flappy_boy', 'food_apple', 'bobber_red', 'ball_std', 'bullet_laser'],
            equipped: {
                snake: 'snake_default',
                snake_food: 'food_apple',
                fishing_rod: 'rod_default',
                fishing_boat: 'boat_default',
                fishing_bobber: 'bobber_red',
                brick: 'paddle_default',
                brick_ball: 'ball_std',
                galaxy: 'ship_default',
                galaxy_bullet: 'bullet_laser',
                flappy: 'flappy_boy'
            }
        };

        try {
            const saved = JSON.parse(localStorage.getItem('merchboy_shop'));
            if (saved) {
                return {
                    unlocked: [...new Set([...defaults.unlocked, ...(saved.unlocked || [])])],
                    equipped: { ...defaults.equipped, ...(saved.equipped || {}) }
                };
            }
            return defaults;
        } catch (e) {
            console.error("Shop State Corrupt:", e);
            return defaults;
        }
    });

    useEffect(() => {
        localStorage.setItem('merchboy_shop', JSON.stringify(shopState));
    }, [shopState]);

    const buyItem = (item) => {
        if (coins >= item.price && !shopState.unlocked.includes(item.id)) {
            spendCoins(item.price);
            setShopState(prev => ({ ...prev, unlocked: [...prev.unlocked, item.id] }));
            playWin();
            showToast(`Purchased ${item.name}!`, "success");
            return true;
        }
        if (coins < item.price) showToast("Not enough coins!", "error");
        return false;
    };

    const equipItem = (category, itemId) => {
        if (shopState.unlocked.includes(itemId)) {
            const itemDef = SHOP_ITEMS.find(i => i.id === itemId);
            const slot = itemDef?.slot || category;

            setShopState(prev => ({
                ...prev,
                equipped: { ...prev.equipped, [slot]: itemId }
            }));
        }
    };

    const addCoins = (amount) => {
        setCoins(prev => prev + amount);
        if (amount > 0) showToast(`+${amount} Coins`, 'coin');
    };

    const spendCoins = (amount) => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true;
        }
        showToast("Not enough coins!", "error");
        return false;
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

    // LEVEL SYSTEM
    const getLevelInfo = () => {
        // Base XP from Achievements (500 XP each)
        const achievementXP = unlockedAchievements.length * 500;
        // XP from Actions
        const fishXP = (stats.fishCaught || 0) * 50;
        const gamesXP = (stats.gamesPlayedCount || 0) * 100;

        const totalXP = achievementXP + fishXP + gamesXP;

        // Level Formula: Level N requires 1000 * N XP
        // Level = Math.floor(totalXP / 1000) + 1
        const level = Math.floor(totalXP / 1000) + 1;
        const currentLevelXP = totalXP % 1000;
        const nextLevelXP = 1000;
        const progress = Math.min((currentLevelXP / nextLevelXP) * 100, 100);

        return { level, xp: currentLevelXP, nextXP: nextLevelXP, progress, totalXP };
    };

    return (
        <GamificationContext.Provider value={{
            stats,
            unlockedAchievements,
            updateStat,
            incrementStat,
            dailyState,
            claimDailyLogin,
            claimQuest,
            addCoins,
            spendCoins,
            coins,
            userProfile,
            updateProfile,
            shopState,
            buyItem,
            equipItem,
            getLevelInfo
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
