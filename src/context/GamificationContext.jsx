import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
import { DAILY_TEMPLATES, WEEKLY_TEMPLATES } from '../config/DailyQuests';
import { SHOP_ITEMS } from '../config/ShopItems';
import { STICKER_COLLECTIONS, RARITY_WEIGHTS } from '../config/StickerDefinitions';
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
            crazyFishingHighScore: 0,
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
        }

        // 2026-01-31: No more generic 'OPERATOR'. Generate cool default.
        if (!stored.name || stored.name === 'OPERATOR') {
            const prefixes = ['AGENT', 'NEON', 'CYBER', 'COSMIC', 'VOID', 'SHADOW', 'PIXEL'];
            const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const randomSuffix = Math.floor(Math.random() * 9999);
            stored.name = `${randomPrefix}-${randomSuffix}`;
        }

        return {
            name: stored.name,
            avatar: stored.avatar || '/assets/merchboy_face.png',
            code: stored.code,
            squad: stored.squad || null,
            placedStickers: stored.placedStickers || [],
            friends: stored.friends || []
        };
    });

    const updateProfile = async (updates) => {
        // Special Handling for Name Updates
        if (updates.name) {
            let proposedName = updates.name.trim().toUpperCase();

            // 1. Block "OPERATOR"
            if (proposedName === 'OPERATOR') {
                showToast("Name 'OPERATOR' is restricted.", 'error');
                return;
            }

            // 2. Length Check
            if (proposedName.length < 3 || proposedName.length > 15) {
                showToast("Name must be 3-15 chars.", "error");
                return;
            }

            // 3. Profanity/Forbidden Block (Simple List)
            const forbidden = ['ADMIN', 'SYSTEM', 'MOD', 'NULL', 'UNDEFINED'];
            if (forbidden.some(word => proposedName.includes(word))) {
                showToast("Name contains restricted words.", "error");
                return;
            }

            // 4. Uniqueness Check (Supabase)
            if (session && supabase) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('display_name', proposedName) // Case-insensitive check
                    .neq('id', session.user.id); // Exclude self

                if (data && data.length > 0) {
                    showToast(`Name '${proposedName}' is taken!`, 'error');
                    return;
                }
            }

            updates.name = proposedName;
        }

        setUserProfile(prev => {
            const newState = { ...prev, ...updates };
            localStorage.setItem('merchboy_profile', JSON.stringify(newState));
            return newState;
        });
        showToast('Profile Updated!', 'success');
    };

    const addFriend = async (friendCode) => {
        if (!friendCode) return;
        const normalizedCode = friendCode.trim().toUpperCase();

        // 1. Validation
        if (normalizedCode === userProfile.code) {
            showToast("You can't friend yourself (sadly).", "error");
            return;
        }
        if (userProfile.friends.some(f => f.code === normalizedCode)) {
            showToast("Already in your squad!", "info");
            return;
        }

        // 2. Lookup
        if (supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .select('display_name, avatar_url, high_scores, friend_code, id')
                .eq('friend_code', normalizedCode)
                .single();

            if (data) {
                const newFriend = {
                    name: data.display_name,
                    code: data.friend_code,
                    avatar: data.avatar_url,
                    id: data.id,
                    score: data.high_scores?.crazy_fishing || 0 // Default 'score' to show
                };

                setUserProfile(prev => ({
                    ...prev,
                    friends: [...prev.friends, newFriend]
                }));
                showToast(`Added ${newFriend.name} to Squad!`, "success");

                // Cloud save will trigger automatically via debounce
            } else {
                showToast("Agent not found with that code.", "error");
            }
        } else {
            // Offline/Mock Fallback
            showToast("Offline: Cannot verify friend code.", "error");
        }
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

    const [unlockedStickers, setUnlockedStickers] = useState(() => {
        const saved = localStorage.getItem('merchboy_stickers');
        return saved ? JSON.parse(saved) : [];
    });

    const { playWin } = useRetroSound();

    useEffect(() => {
        localStorage.setItem('merchboy_stats', JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem('merchboy_achievements', JSON.stringify(unlockedAchievements));
    }, [unlockedAchievements]);

    useEffect(() => {
        localStorage.setItem('merchboy_stickers', JSON.stringify(unlockedStickers));
    }, [unlockedStickers]);

    // MISSING PERSISTENCE FIX
    useEffect(() => {
        localStorage.setItem('merchboy_daily', JSON.stringify(dailyState));
    }, [dailyState]);

    // --- AUTH & CLOUD SYNC ---
    const [session, setSession] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) syncCloud(session.user.id);
            else syncCloud(null); // Load legacy/local
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                showToast(`Welcome back, ${session.user.email}!`, 'success');
                syncCloud(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithProvider = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) showToast(error.message, 'error');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        showToast('Logged out!', 'info');
        setSession(null);
        // Optionally revert to local/guest state?
        // For now, we keep the data on screen but it won't save to the cloud ID anymore.
    };

    // --- SOCIAL STATE ---
    const [viewedProfile, setViewedProfile] = useState(null);

    // --- ECONOMY HELPERS ---
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

    // --- SHOP STATE (Moved Up to avoid TDZ) ---
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
                    equipped: { ...defaults.equipped, ...(saved.equipped || {}) },
                    inventory: saved.inventory || {} // Load Inventory
                };
            }
            return { ...defaults, inventory: {} }; // Default Inventory
        } catch (e) {
            console.error("Shop State Corrupt:", e);
            return defaults;
        }
    });

    useEffect(() => {
        localStorage.setItem('merchboy_shop', JSON.stringify(shopState));
    }, [shopState]);

    const buyItem = (item) => {
        if (coins < item.price) {
            showToast("Not enough coins!", "error");
            return false;
        }

        // CONSUMABLES (Stackable)
        if (item.type === 'consumable') {
            spendCoins(item.price);
            setShopState(prev => ({
                ...prev,
                inventory: {
                    ...prev.inventory,
                    [item.id]: (prev.inventory?.[item.id] || 0) + 1
                }
            }));
            playWin();
            showToast(`Bought ${item.name}!`, "success"); // Don't show count creates circular dep on state update? No it's fine.
            return true;
        }

        // DURABLES (One-time)
        if (!shopState.unlocked.includes(item.id)) {
            spendCoins(item.price);
            setShopState(prev => ({ ...prev, unlocked: [...prev.unlocked, item.id] }));

            // DECOR handled by component invocation of PocketBroContext


            playWin();
            showToast(`Purchased ${item.name}!`, "success");
            return true;
        }
        return false;
    };

    const consumeItem = (itemId) => {
        if ((shopState.inventory?.[itemId] || 0) > 0) {
            setShopState(prev => ({
                ...prev,
                inventory: {
                    ...prev.inventory,
                    [itemId]: prev.inventory[itemId] - 1
                }
            }));
            return true;
        }
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

    const unlockHiddenItem = (itemId) => {
        setShopState(prev => {
            if (prev.unlocked.includes(itemId)) return prev;
            return {
                ...prev,
                unlocked: [...prev.unlocked, itemId]
            };
        });
    };

    // --- AUTH & CLOUD SYNC ---
    const syncCloud = async (userId) => {
        if (!supabase) return;

        // Determine ID: Auth ID > Local Stored ID > Generate New
        let targetId = userId;
        if (!targetId) {
            targetId = localStorage.getItem('merchboy_client_id');
            if (!targetId) {
                try {
                    targetId = crypto.randomUUID();
                } catch (e) {
                    targetId = `LEGACY-${Math.floor(Math.random() * 1000000)}`;
                }
                localStorage.setItem('merchboy_client_id', targetId);
            }
        }

        // Attempt Load
        const { data, error } = await supabase.from('profiles').select('*').eq('id', targetId).single();
        if (data) {
            console.log("☁️ CLOUD SYNC: Loading Profile", data);

            // HYDRATE STATE FROM CLOUD - WITH SMART MERGE
            // 1. Coins: Take Max (simplest way to prevent loss, though theoretically exploit-prone, safe enough for this)
            if (data.coins !== undefined && data.coins !== null) {
                setCoins(prev => Math.max(prev, Number(data.coins)));
            }

            // 2. Stats: Merge (Trust higher numbers for high scores)
            if (data.stats && typeof data.stats === 'object') {
                setStats(prev => {
                    const merged = { ...prev };
                    Object.keys(data.stats).forEach(key => {
                        if (typeof data.stats[key] === 'number') {
                            merged[key] = Math.max(merged[key] || 0, data.stats[key]);
                        } else if (Array.isArray(data.stats[key])) {
                            // Merge unique items? Or just trust cloud?
                            // For gamesPlayed array, trust cloud if larger?
                            // Let's just trust cloud for arrays generally to avoid complexity, or skip if local is populated?
                            // Actually, local stats might be newer.
                            // Let's only overwrite if local is 'empty' or older? Hard to tell.
                            // Strategy: Trust Cloud for High Scores. Keep Local for ephemeral?
                            // Safer: Only update if cloud value is DEFINED.
                            merged[key] = data.stats[key];
                        } else {
                            merged[key] = data.stats[key];
                        }
                    });
                    return merged;
                });
            }

            // 3. Achievements: Union
            if (data.achievements && Array.isArray(data.achievements)) {
                setUnlockedAchievements(prev => [...new Set([...prev, ...data.achievements])]);
            }

            // 4. Daily State: Protect Local Check-in
            if (data.daily_data) {
                setDailyState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    // If local has checked in TODAY, and cloud hasn't, KEEP LOCAL.
                    if (prev.lastCheckIn === today) {
                        // Cloud might have old streak, but we want to keep today's status.
                        // But maybe cloud has better streak from specific history?
                        // Simplest: If local is today, ignore cloud checkin.
                        // BUT we might want to sync Quest Progress from cloud if it's better?
                        // For Dailies, usually Session-based or Local is fresher.
                        // Decision: If local `questDate` is today, assume Local is master for today.
                        if (prev.questDate === today) return prev;
                    }
                    return data.daily_data;
                });
            }

            // Update Profile Info
            setUserProfile(prev => ({
                ...prev,
                name: data.display_name || prev.name,
                avatar: data.avatar_url || prev.avatar,
                code: data.friend_code || prev.code,
                squad: data.squad || prev.squad,
                friends: data.friends || prev.friends || []
            }));
        } else if (userId) {
            // New Auth User -> Upload current local state to Cloud to "Migrate"
            console.log("Creating Cloud Profile for new user...");
            // The Debounced Save will handle the upsert shortly, or we can force one now.
        }
    };

    // Debounced Save
    useEffect(() => {
        const timeout = setTimeout(async () => {
            // ID Priority: Session > Local
            let targetId = session?.user?.id || localStorage.getItem('merchboy_client_id');

            if (targetId) {
                // Calculate XP locally
                const achXP = unlockedAchievements.length * 500;
                const fishXP = (stats.fishCaught || 0) * 50;
                const gamesXP = (stats.gamesPlayedCount || 0) * 100;
                const currentTotalXP = achXP + fishXP + gamesXP;

                // Read Pocket Bro State
                let pocketData = {};
                try {
                    pocketData = JSON.parse(localStorage.getItem('pocketBroState')) || {};
                } catch (e) { }

                try {
                    await supabase.from('profiles').upsert({
                        id: targetId,
                        display_name: userProfile.name,
                        friend_code: userProfile.code,
                        avatar_url: userProfile.avatar,
                        coins: coins,
                        squad: userProfile.squad,
                        xp: currentTotalXP,
                        games_played: stats.gamesPlayedCount || 0,
                        high_scores: {
                            merch_jump: stats.merchJumpHighScore || 0,
                            neon_snake: stats.snakeHighScore || 0,
                            flappy_mascot: stats.flappyHighScore || 0,
                            crazy_fishing: stats.crazyFishingHighScore || 0,
                            galaxy_defender: stats.galaxyHighScore || 0,
                            neon_bricks: stats.brickHighScore || 0,
                            whack_a_mole: stats.whackHighScore || 0,
                            memory_match: stats.memoryHighScore || 0,
                            face_runner: stats.faceRunnerHighScore || 0,
                            cosmic_slots: stats.slotsBiggestWin || 0
                        },
                        stats: stats,
                        room_data: pocketData.placedItems || [],
                        pocket_state: {
                            stage: pocketData.stage,
                            skin: shopState.equipped?.pocketbro || null,
                            theme: shopState.equipped?.theme || 'theme_default'
                        },
                        achievements: unlockedAchievements,
                        daily_data: dailyState,
                        friends: userProfile.friends,
                        last_seen: new Date()
                    });
                } catch (e) {
                    console.error("Cloud Save Failed", e);
                }
            }
        }, 3000); // 3 seconds debounce
        return () => clearTimeout(timeout);
    }, [coins, stats, userProfile, unlockedAchievements, dailyState, session, shopState]);


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
        addCoins(100); // bonus coins

        // SCREEN GOES NUTS
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 300);
        setTimeout(() => triggerConfetti(), 600);

        showToast(achievement.title, 'achievement', {
            description: achievement.description,
            reward: achievement.reward || '100 Coins'
        });

        // Push to Global Feed
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

    const claimDailyLogin = () => {
        const today = new Date().toISOString().split('T')[0];
        if (dailyState.lastCheckIn === today) return false;

        setDailyState(prev => ({
            ...prev,
            lastCheckIn: today,
            streak: prev.streak + 1
        }));

        playWin();
        triggerConfetti();
        addCoins(100);
        showToast("Daily Login: +100 Coins", "coin");
        return true;
    };

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

    // GACHAPON LOGIC
    const buyCapsule = () => {
        const PRICE = 100;
        if (coins < PRICE) {
            showToast("Not enough coins!", "error");
            return null;
        }

        spendCoins(PRICE);

        // 1. Determine Rarity
        const roll = Math.random() * 100;
        let selectedRarity = 'common';
        if (roll < RARITY_WEIGHTS.legendary) selectedRarity = 'legendary';
        else if (roll < RARITY_WEIGHTS.epic) selectedRarity = 'epic';
        else if (roll < RARITY_WEIGHTS.rare) selectedRarity = 'rare';

        // 2. Filter Pool
        let pool = [];
        STICKER_COLLECTIONS.forEach(col => {
            pool = [...pool, ...col.items.filter(i => i.rarity === selectedRarity)];
        });

        // Fallback if empty (shouldn't happen with proper config)
        if (pool.length === 0) pool = STICKER_COLLECTIONS[0].items;

        // 3. Pick Item
        const item = pool[Math.floor(Math.random() * pool.length)];

        // 4. Unlock
        if (!unlockedStickers.includes(item.id)) {
            setUnlockedStickers(prev => [...prev, item.id]);
            showToast(`New Sticker: ${item.name}!`, "success");
        } else {
            showToast(`Got a duplicate: ${item.name}!`, "info");
        }
        playWin();
        triggerConfetti();

        return item; // Return for UI display
    };

    return (
        <GamificationContext.Provider value={{
            stats, coins, addCoins, spendCoins, userProfile, updateProfile, dailyState, claimDailyLogin,
            claimQuest, skipQuest, checkHighscoreQuest, shopState, buyItem, equipItem, unlockHiddenItem, consumeItem,
            unlockedAchievements, getLevelInfo,
            unlockedStickers, buyCapsule, triggerConfetti,
            session, loginWithProvider, logout,
            addFriend, viewedProfile, setViewedProfile
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
