import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';
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

    const updateStat = (key, value) => {
        setStats(prev => {
            // Handle arrays (e.g. gamesPlayed)
            if (Array.isArray(prev[key])) {
                if (!prev[key].includes(value)) {
                    return { ...prev, [key]: [...prev[key], value] };
                }
                return prev;
            }
            // Handle increment (if functionality meant to add) or replace?
            // For now, let's assume direct replacement for HighScores, implementation specific for accumulation
            // But wait, fishCaught needs to increment.

            // Simple logic: If existing is number and new is number -> replace? 
            // Better: updateStat('fishCaught', (prev) => prev + 1) pattern support?

            const newValue = typeof value === 'function' ? value(prev[key] || 0) : value;
            return { ...prev, [key]: newValue };
        });
    };

    const incrementStat = (key, amount = 1) => {
        setStats(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + amount
        }));
    };

    return (
        <GamificationContext.Provider value={{
            stats,
            unlockedAchievements,
            updateStat,
            incrementStat,
            recentUnlock
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
