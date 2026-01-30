import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { DAILY_TEMPLATES, WEEKLY_TEMPLATES } from '../config/DailyQuests';
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





    // ... (GamificationContext Header) ...

    // Helper for Weeks
    const getWeekId = () => {
        const d = new Date();
        const start = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
        return `${d.getFullYear()}-W${Math.ceil(days / 7)}`;
    };

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const currentWeek = getWeekId();

        setDailyState(prev => {
            let newState = { ...prev };
            let updated = false;

            // 1. DAILY GENERATION (Midnight Reset)
            if (prev.questDate !== today) {
                const shuffled = [...DAILY_TEMPLATES].sort(() => 0.5 - Math.random());
                // Keep existing Weekly if valid, else filter out old dailies
                const existingWeekly = prev.quests.find(q => q.isWeekly && q.weekId === currentWeek);

                const newDailies = shuffled.slice(0, 3).map(q => ({
                    ...q,
                    id: `${q.id}_${today}`, // Unique ID per day
                    progress: 0,
                    claimed: false,
                    isWeekly: false
                }));

                newState.questDate = today;
                newState.quests = existingWeekly ? [existingWeekly, ...newDailies] : newDailies;
                newState.skipsAvailable = 1; // RESET SKIPS
                updated = true;
            }

            // 2. WEEKLY GENERATION
            // If no weekly quest for this week, add one.
            const hasWeekly = newState.quests.some(q => q.isWeekly && q.weekId === currentWeek);
            if (!hasWeekly) {
                const weeklyTemplate = WEEKLY_TEMPLATES[Math.floor(Math.random() * WEEKLY_TEMPLATES.length)];
                const newWeekly = {
                    ...weeklyTemplate,
                    id: `${weeklyTemplate.id}_${currentWeek}`,
                    weekId: currentWeek,
                    progress: 0,
                    claimed: false
                };
                newState.quests = [newWeekly, ...newState.quests.filter(q => !q.isWeekly)]; // Replace old weekly
                updated = true;
            }

            return updated ? newState : prev;
        });
    }, []); // Run once on mount

    // ... (rest of context) ...

    const skipQuest = (questId) => {
        if (dailyState.skipsAvailable <= 0) {
            showToast("No skips left today!", "error");
            return;
        }

        setDailyState(prev => {
            const questIndex = prev.quests.findIndex(q => q.id === questId);
            if (questIndex === -1) return prev;

            const quest = prev.quests[questIndex];
            if (quest.isWeekly) {
                showToast("Cannot skip Weekly Quests!", "error");
                return prev; // Can't skip weekly
            }

            // Pick a new daily
            const currentIds = prev.quests.map(q => q.id.split('_')[0]); // Base IDs
            const candidates = DAILY_TEMPLATES.filter(t => !currentIds.includes(t.id));

            if (candidates.length === 0) {
                showToast("No other quests available!", "error");
                return prev;
            }

            const newTemplate = candidates[Math.floor(Math.random() * candidates.length)];
            const newQuest = {
                ...newTemplate,
                id: `${newTemplate.id}_${prev.questDate}_skip`,
                progress: 0,
                claimed: false,
                isWeekly: false
            };

            const newQuests = [...prev.quests];
            newQuests[questIndex] = newQuest;

            showToast("Quest Skipped!", "success");
            return {
                ...prev,
                quests: newQuests,
                skipsAvailable: prev.skipsAvailable - 1
            };
        });
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
            addCoins(reward); // Use existing addCoins helper
            playWin();
            showToast(`Quest Complete: +${reward} Coins`, "coin");

            // Weekly Bonus XP?
            const q = dailyState.quests.find(q => q.id === questId);
            if (q && q.isWeekly) {
                // Maybe add XP? For now just coins.
            }
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
        // Apply Pet Multiplier (Check Local Storage to avoid direct dependency)
        let multiplier = 1.0;
        try {
            const stored = localStorage.getItem('merchboy_multiplier');
            if (stored) multiplier = parseFloat(stored);
        } catch (e) { }

        const finalAmount = Math.floor(amount * multiplier);

        setCoins(prev => prev + finalAmount);

        if (finalAmount > 0) {
            if (multiplier > 1.0) showToast(`+${finalAmount} Coins (Pet Bonus!)`, 'coin');
            else if (multiplier < 1.0) showToast(`+${finalAmount} Coins (Pet Sad!)`, 'error');
            else showToast(`+${finalAmount} Coins`, 'coin');
        }
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

        // Progressive Level Formula: TotalXP = 250 * (Level^2)
        // Level 2 requires 1000 XP. Level 10 requires 25,000 XP.
        // If totalXP < 250, level is 1.
        // sqrt(999/250) = 1.99 -> floor -> 1.
        // sqrt(1000/250) = 2.

        let level = Math.floor(Math.sqrt(totalXP / 250));
        if (level < 1) level = 1;

        const currentLevelBaseXP = 250 * (level * level);
        const xpForNextLevel = 250 * ((level + 1) * (level + 1));
        const xpNeededForNext = xpForNextLevel - currentLevelBaseXP;
        const currentLevelProgress = totalXP - currentLevelBaseXP;

        // Ensure progress doesn't go negative or overflow (though math says it shouldn't)
        const progressPercent = Math.min((currentLevelProgress / xpNeededForNext) * 100, 100);

        return {
            level,
            xp: currentLevelProgress,
            nextXP: xpNeededForNext,
            progress: progressPercent,
            totalXP
        };
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
            getLevelInfo,
            skipQuest
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
