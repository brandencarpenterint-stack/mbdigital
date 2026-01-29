import React, { createContext, useContext, useState, useEffect } from 'react';

const PocketBroContext = createContext();

export const usePocketBro = () => useContext(PocketBroContext);

export const PocketBroProvider = ({ children }) => {
    const STAGES = {
        EGG: { threshold: 0, icon: '🥚', name: 'Egg' },
        BABY: { threshold: 50, icon: '👶', name: 'Baby' },
        CHILD: { threshold: 200, icon: '👦', name: 'Kid' },
        TEEN: { threshold: 1000, icon: '🛹', name: 'Teen' },
        ADULT: { threshold: 3000, icon: '🕴️', name: 'Bro' },
        ELDER: { threshold: 10000, icon: '🧙‍♂️', name: 'Elder' }
    };

    // Initialize State (Lazy Load for Safety)
    const [stats, setStats] = useState(() => {
        try {
            const saved = localStorage.getItem('pocketBroState');
            if (saved) {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                const hoursPassed = (now - parsed.lastInteraction) / (1000 * 60 * 60);
                const decay = Math.floor(hoursPassed * 4);

                // Validate Stage immediately
                const safeStage = STAGES[parsed.stage] ? parsed.stage : 'EGG';

                return {
                    ...parsed,
                    stage: safeStage,
                    hunger: Math.max(0, parsed.hunger - decay),
                    happy: Math.max(0, parsed.happy - decay),
                    energy: Math.max(0, parsed.energy - decay),
                    isSleeping: false,
                    lastInteraction: now
                };
            }
        } catch (e) {
            console.error("Corrupt Save Data Reset", e);
        }

        // Default New State
        return {
            hunger: 80,
            happy: 80,
            energy: 80,
            age: 0,
            xp: 0,
            stage: 'EGG',
            isSleeping: false,
            lastInteraction: Date.now()
        };
    });

    // Game Loop (Global Heartbeat)
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const newStats = {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - (prev.isSleeping ? 0.05 : 0.2)),
                    happy: Math.max(0, prev.happy - (prev.isSleeping ? 0.05 : 0.1)),
                    energy: prev.isSleeping ? Math.min(100, prev.energy + 0.5) : Math.max(0, prev.energy - 0.1),
                    age: prev.age + 0.0001
                };

                // Check Evolution
                const nextStage = Object.keys(STAGES).reverse().find(key => newStats.xp >= STAGES[key].threshold);

                // Safety check: ensure current and next stages exist in config
                if (nextStage && STAGES[newStats.stage]) {
                    if (STAGES[nextStage].threshold > STAGES[newStats.stage].threshold) {
                        newStats.stage = nextStage;
                    }
                } else if (!STAGES[newStats.stage]) {
                    // Auto-fix corrupted state
                    newStats.stage = 'EGG';
                }

                return newStats;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Auto-Save
    useEffect(() => {
        localStorage.setItem('pocketBroState', JSON.stringify({ ...stats, lastInteraction: Date.now() }));
    }, [stats]);

    // Actions
    const feed = (amount = 30) => {
        setStats(prev => ({
            ...prev,
            hunger: Math.min(100, prev.hunger + amount),
            xp: prev.xp + 5
        }));
    };

    const play = (amount = 20) => {
        setStats(prev => ({
            ...prev,
            happy: Math.min(100, prev.happy + amount),
            energy: Math.max(0, prev.energy - 10),
            hunger: Math.max(0, prev.hunger - 5),
            xp: prev.xp + 15
        }));
    };

    const sleep = () => {
        setStats(prev => ({ ...prev, isSleeping: !prev.isSleeping }));
    };

    const getMood = () => {
        if (stats.stage === 'EGG') return '🥚';
        if (stats.hunger < 20) return '😫';
        if (stats.happy < 20) return '😢';
        if (stats.energy < 20) return '😴';

        return STAGES[stats.stage]?.icon || '😃';
    };

    const isCritical = stats.hunger < 20 || stats.happy < 20;

    return (
        <PocketBroContext.Provider value={{ stats, feed, play, sleep, getMood, isCritical }}>
            {children}
        </PocketBroContext.Provider>
    );
};
