import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { DAILY_TEMPLATES } from '../config/DailyQuests';
import { SHOP_ITEMS } from '../config/ShopItems';
import useRetroSound from '../hooks/useRetroSound';
import { useToast } from './ToastContext';
import { triggerConfetti } from '../utils/confetti';
import { supabase } from '../lib/supabaseClient';

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
    // --- PROFILE STATE ---
    const [userProfile, setUserProfile] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('merchboy_profile')) || {};

        // Generate a persistent code if one doesn't exist
        if (!stored.code) {
            stored.code = `OP-${Math.floor(Math.random() * 9000 + 1000)}`;
            // We'll save this back to storage in the effect or next update, 
            // but returning it ensures it's in state immediately.
        }

        return {
            name: stored.name || 'OPERATOR',
            avatar: stored.avatar || '/assets/merchboy_face.png',
            code: stored.code
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

    // --- CLOUD SYNC ---
    useEffect(() => {
        const syncCloud = async () => {
            if (!supabase) return;
            let storedId = localStorage.getItem('merchboy_client_id');

            // Generate ID if missing (First Time)
            if (!storedId) {
                // If creating profile, we likely want to associate with existing data if possible?
                // For now, random UUID for device.
                try {
                    storedId = crypto.randomUUID();
                } catch (e) {
                    storedId = `LEGACY-${Math.floor(Math.random() * 1000000)}`;
                }
                localStorage.setItem('merchboy_client_id', storedId);

                // Try Upsert initial state
                await supabase.from('profiles').upsert({
                    id: storedId,
                    display_name: userProfile.name,
                    friend_code: userProfile.code,
                    coins: coins,
                    stats: stats,
                    achievements: unlockedAchievements,
                    daily_data: dailyState,
                    settings: { version: '1.0' },
                    last_seen: new Date()
                }, { onConflict: 'id' });
                return;
            }

            // Attempt Load
            const { data, error } = await supabase.from('profiles').select('*').eq('id', storedId).single();
            if (data) {
                console.log("☁️ CLOUD SYNC: Loading Profile", data);
                // HYDRATE STATE FROM CLOUD
                if (data.coins !== undefined && data.coins !== null) setCoins(Number(data.coins));
                if (data.stats && typeof data.stats === 'object') setStats(data.stats);
                if (data.achievements && Array.isArray(data.achievements)) setUnlockedAchievements(data.achievements);
                if (data.daily_data) setDailyState(data.daily_data);

                // Update Profile Info
                setUserProfile(prev => ({
                    ...prev,
                    name: data.display_name || prev.name,
                    avatar: data.avatar_url || prev.avatar,
                    code: data.friend_code || prev.code
                }));

                // If cloud data exists, load it
                // setCoins(data.coins); // Wait, this might reset local progress if offline play happened.
                // For now, just log it.
                // console.log("Cloud Sync Active:", data);
            }
        };
        syncCloud();
    }, []);

    // Debounced Save
    useEffect(() => {
        const timeout = setTimeout(async () => {
            const storedId = localStorage.getItem('merchboy_client_id');
            if (storedId) {
                // Calculate XP locally to avoid ReferenceError
                const achXP = unlockedAchievements.length * 500;
                const fishXP = (stats.fishCaught || 0) * 50;
                const gamesXP = (stats.gamesPlayedCount || 0) * 100;
                const currentTotalXP = achXP + fishXP + gamesXP;

                try {
                    await supabase.from('profiles').upsert({
                        id: storedId,
                        display_name: userProfile.name,
                        friend_code: userProfile.code,
                        avatar_url: userProfile.avatar,
                        coins: coins,
                        xp: currentTotalXP,
                        games_played: stats.gamesPlayedCount || 0,
                        high_scores: {
                            merch_jump: stats.merchJumpHighScore || 0,
                            snake: stats.snakeHighScore || 0,
                            flappy: stats.flappyHighScore || 0
                        },
                        stats: stats,
                        achievements: unlockedAchievements,
                        daily_data: dailyState,
                        last_seen: new Date()
                    });
                } catch (e) {
                    console.error("Cloud Save Failed", e);
                }
            }
        }, 3000); // 3 seconds debounce
        return () => clearTimeout(timeout);
    }, [coins, stats, userProfile, unlockedAchievements, dailyState]);


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

        // SCREEN GOES NUTS
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 300);
        setTimeout(() => triggerConfetti(), 600);

        showToast(achievement.title, 'achievement');

        // Push to Global Feed
        // Using dynamic import or assuming feedService is available via import?
        // We need to import feedService at top.
        // For now, assuming it's imported or I add import.
        import('../utils/feed').then(({ feedService }) => {
            feedService.publish(`unlocked achievement: ${achievement.title} 🏆`, 'win', userProfile.name);
        });
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
            // Defensive: Don't increment arrays
            if (Array.isArray(prev[key])) {
                console.warn(`Attempted to increment array stat ${key}. Use updateStat instead.`);
                return prev;
            }

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
