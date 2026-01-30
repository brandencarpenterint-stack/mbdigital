
// --- SUPABASE SYNC HOOK (To be pasted into GamificationContext.jsx) ---
// This effect syncs local state to Supabase on changes
useEffect(() => {
    const saveToCloud = async () => {
        const storedId = localStorage.getItem('merchboy_client_id');
        if (!storedId) return; // Not initialized yet

        try {
            const { error } = await supabase.from('profiles').upsert({
                id: storedId,
                display_name: userProfile.name,
                avatar_url: userProfile.avatar,
                friend_code: userProfile.code,
                coins: coins,
                stats: stats,
                achievements: unlockedAchievements,
                daily_data: dailyState,
                last_seen: new Date().toISOString()
            });
            if (error) console.error("Cloud Save Error:", error);
        } catch (e) {
            console.error("Supabase Error:", e);
        }
    };

    // Debounce Save (2s)
    const timeout = setTimeout(saveToCloud, 2000);
    return () => clearTimeout(timeout);
}, [coins, stats, userProfile, unlockedAchievements, dailyState]);

// Initial Load Effect
useEffect(() => {
    const initCloud = async () => {
        let storedId = localStorage.getItem('merchboy_client_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('merchboy_client_id', storedId);
        }

        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', storedId).single();

            if (data) {
                console.log("Cloud Profile Loaded:", data);
                // Merge/Load logic
                setCoins(parseInt(data.coins) || 0);
                setUserProfile(prev => ({
                    ...prev,
                    name: data.display_name,
                    avatar: data.avatar_url,
                    code: data.friend_code
                }));
                if (data.stats) setStats(data.stats);
                if (data.achievements) setUnlockedAchievements(data.achievements);
                if (data.daily_data) setDailyState(data.daily_data);
                showToast('Cloud Profile Synced ☁️', 'success');
            } else {
                console.log("Creating New Cloud Profile...");
                // It will autosave on next render due to the save effect above
            }
        } catch (e) {
            console.warn("Cloud Sync Failed (Offline Mode)", e);
        }
    };

    initCloud();
}, []);
