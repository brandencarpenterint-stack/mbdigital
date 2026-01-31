import React, { createContext, useContext, useState, useEffect } from 'react';

import { ADVENTURE_LOCATIONS } from '../config/AdventureLocations';
export const POCKET_BRO_STAGES = {
    EGG: { threshold: 0, icon: '🥚', name: 'Egg' },
    BABY: { threshold: 50, icon: '👶', name: 'Baby' },
    CHILD: { threshold: 200, icon: '👦', name: 'Kid' },
    TEEN: { threshold: 1000, icon: '🛹', name: 'Teen' },
    ADULT: { threshold: 3000, icon: '🕴️', name: 'Bro' },
    ELDER: { threshold: 10000, icon: '🧙‍♂️', name: 'Elder' }
};

const PocketBroContext = createContext();

export const usePocketBro = () => useContext(PocketBroContext);

export const PocketBroProvider = ({ children }) => {
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
                const safeStage = POCKET_BRO_STAGES[parsed.stage] ? parsed.stage : 'EGG';

                return {
                    ...parsed,
                    stage: safeStage,
                    hunger: Math.max(0, parsed.hunger - decay),
                    happy: Math.max(0, parsed.happy - decay),
                    energy: Math.max(0, parsed.energy - decay),
                    isSleeping: false,
                    lastInteraction: now,
                    hygiene: parsed.hygiene || 100,
                    poopCount: parsed.poopCount || 0,
                    unlockedDecor: parsed.unlockedDecor || [],
                    decor: parsed.decor || { background: null, rug: null, item_left: null, item_right: null }
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
            hygiene: 100,
            poopCount: 0,
            age: 0,
            xp: 0,
            stage: 'EGG',
            isSleeping: false,
            lastInteraction: Date.now(),
            unlockedDecor: [],
            decor: { background: null, rug: null, item_left: null, item_right: null }
        };
    });

    // Game Loop (Global Heartbeat)
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const now = new Date();
                const isNight = now.getHours() >= 22 || now.getHours() < 6;

                const newStats = {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - (prev.isSleeping ? 0.05 : 0.2)),
                    happy: Math.max(0, prev.happy - (prev.isSleeping ? 0.05 : 0.1) - (prev.poopCount * 0.5)),
                    energy: prev.isSleeping ? Math.min(100, prev.energy + 0.5) : Math.max(0, prev.energy - 0.1),
                    hygiene: Math.max(0, prev.hygiene - 0.1),
                    age: prev.age + 0.0001,
                    // Track averages/accumulators for evolution logic
                    history: {
                        ...prev.history,
                        nightActions: (prev.history?.nightActions || 0) + (isNight && !prev.isSleeping ? 0.01 : 0),
                        avgHunger: ((prev.history?.avgHunger || prev.hunger) * 0.99) + (prev.hunger * 0.01), // Moving average
                        avgHappy: ((prev.history?.avgHappy || prev.happy) * 0.99) + (prev.happy * 0.01),
                    }
                };

                // Poop Spawn Logic
                if (newStats.hygiene <= 0) {
                    newStats.poopCount = (prev.poopCount || 0) + 1;
                    newStats.hygiene = 100; // Reset cycle
                }

                // Check Evolution
                if (POCKET_BRO_STAGES[newStats.stage]) {
                    const currentStageConfig = POCKET_BRO_STAGES[newStats.stage];
                    // Look ahead
                    const nextStageKey = Object.keys(POCKET_BRO_STAGES)[Object.keys(POCKET_BRO_STAGES).indexOf(newStats.stage) + 1];

                    if (nextStageKey && newStats.xp >= POCKET_BRO_STAGES[nextStageKey].threshold) {
                        // EVOLUTION TIME
                        // Determine Type
                        let nextType = newStats.type || 'SOOT';

                        // Evolution Logic based on Stage
                        if (newStats.stage === 'BABY') {
                            // Branching Logic
                            if ((newStats.history?.nightActions || 0) > 50) nextType = 'GHOST';
                            else if (newStats.history?.avgHunger > 80) nextType = 'SLIME';
                            else if (newStats.history?.avgHappy > 90 && newStats.energy > 80) nextType = 'ROBOT';
                            else nextType = 'SOOT';
                        }
                        // FUTURE: Add more branching for Teen/Adult

                        newStats.stage = nextStageKey;
                        newStats.type = nextType;
                        // Effect?
                    }
                }

                return newStats;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Auto-Save & Economy Link
    useEffect(() => {
        // Calculate Coin Multiplier based on Happiness
        let multiplier = 1.0;
        if (stats.happy >= 80) multiplier = 1.2;
        // No Penalty for low happiness anymore!

        localStorage.setItem('pocketBroState', JSON.stringify({ ...stats, lastInteraction: Date.now() }));
        localStorage.setItem('merchboy_multiplier', multiplier.toString());
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

    const clean = () => {
        setStats(prev => ({
            ...prev,
            poopCount: 0,
            hygiene: 100,
            happy: Math.min(100, prev.happy + 20),
            xp: prev.xp + 10
        }));
    };

    const getMood = () => {
        if (stats.stage === 'EGG') return '🥚';
        if (stats.poopCount > 0) return '🤢'; // Sick if poop
        if (stats.hunger < 20) return '😫';
        if (stats.happy < 20) return '😢';
        if (stats.energy < 20) return '😴';

        return POCKET_BRO_STAGES[stats.stage]?.icon || '😃';
    };

    const triggerEffect = (effect, duration = 5000) => {
        setStats(prev => ({ ...prev, tempStatus: effect }));
        setTimeout(() => {
            setStats(prev => ({ ...prev, tempStatus: null })); // Clear after duration
        }, duration);
    };

    const unlockDecor = (itemId) => {
        setStats(prev => ({
            ...prev,
            unlockedDecor: [...new Set([...(prev.unlockedDecor || []), itemId])]
        }));
    };

    const equipDecor = (type, itemId) => {
        setStats(prev => ({
            ...prev,
            decor: { ...prev.decor, [type]: itemId }
        }));
    };

    // --- ROOM BUILDER LOGIC ---
    const placeItem = (itemId, x, y) => {
        setStats(prev => {
            // Remove any existing item at x,y
            const filtered = (prev.placedItems || []).filter(i => i.x !== x || i.y !== y);
            return {
                ...prev,
                placedItems: [...filtered, { id: itemId, x, y }]
            };
        });
    };

    const removeItem = (x, y) => {
        setStats(prev => ({
            ...prev,
            placedItems: (prev.placedItems || []).filter(i => i.x !== x || i.y !== y)
        }));
    };

    const isCritical = stats.hunger < 20 || stats.happy < 20 || stats.poopCount > 0;

    const debugUpdate = (updates) => {
        setStats(prev => ({ ...prev, ...updates }));
    };

    // --- ADVENTURE LOGIC ---
    const explore = (locationId) => {
        if (stats.adventure && stats.adventure.active) return; // Already exploring

        // Lookup Location
        const location = ADVENTURE_LOCATIONS.find(l => l.id === locationId);
        if (!location) {
            console.error("Invalid Location");
            return;
        }

        const finishTime = Date.now() + (location.durationMinutes * 60 * 1000);

        setStats(prev => ({
            ...prev,
            adventure: {
                active: true,
                locationId,
                name: location.name,
                startTime: Date.now(),
                finishTime,
                rewards: null // Revealed upon return
            }
        }));
    };

    const returnFromExplore = () => {
        if (!stats.adventure || !stats.adventure.active) return null;
        if (Date.now() < stats.adventure.finishTime) return null;

        // Lookup Location Data for Loot Table
        const location = ADVENTURE_LOCATIONS.find(l => l.id === stats.adventure.locationId);
        const lootTable = location?.lootTable || { minCoins: 10, maxCoins: 50, xp: 10, items: [] };

        // Generate Loot
        const coinAmount = Math.floor(Math.random() * (lootTable.maxCoins - lootTable.minCoins + 1)) + lootTable.minCoins;

        const loot = {
            xp: lootTable.xp,
            coins: coinAmount,
            items: []
        };

        // Item Drop Logic
        if (Math.random() < (lootTable.dropRate || 0)) {
            // Roll for item
            const roll = Math.random() * 100;
            let cumulative = 0;
            for (const item of lootTable.items) {
                cumulative += item.weight;
                if (roll <= cumulative) {
                    loot.items.push(item.id);
                    break;
                }
            }
        }

        // Apply Results
        setStats(prev => ({
            ...prev,
            xp: prev.xp + loot.xp,
            adventure: null // Clear adventure state
        }));

        // SYNC COINS GLOBALLY
        try {
            const currentCoins = parseInt(localStorage.getItem('arcadeCoins') || '0');
            const newTotal = currentCoins + loot.coins;
            localStorage.setItem('arcadeCoins', newTotal.toString());
        } catch (e) { console.error("Coin sync failed", e); }

        // UNLOCK ITEMS
        if (loot.items.length > 0) {
            loot.items.forEach(itemId => unlockDecor(itemId));
        }

        return loot;
    };

    return (
        <PocketBroContext.Provider value={{
            stats, feed, play, sleep, clean,
            triggerEffect, unlockDecor, equipDecor,
            getMood, isCritical, placeItem, removeItem,
            debugUpdate, explore, returnFromExplore
        }}>
            {children}
        </PocketBroContext.Provider>
    );
};
