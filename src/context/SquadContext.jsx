import React, { createContext, useContext, useState, useEffect } from 'react';

const SquadContext = createContext();

export const useSquad = () => useContext(SquadContext);

export const SquadProvider = ({ children }) => {
    // Persistent User Squad
    const [userSquad, setUserSquad] = useState(() => {
        return localStorage.getItem('userSquad') || null;
    });

    // Simulated Global State
    const [squadScores, setSquadScores] = useState({
        NEON: 450250,
        ZEN: 448100
    });

    // Save Squad selection
    useEffect(() => {
        if (userSquad) {
            localStorage.setItem('userSquad', userSquad);
        }
    }, [userSquad]);

    // Simulate "Live" Global Warfare
    useEffect(() => {
        const interval = setInterval(() => {
            setSquadScores(prev => ({
                NEON: prev.NEON + Math.floor(Math.random() * 10),
                ZEN: prev.ZEN + Math.floor(Math.random() * 10)
            }));
        }, 3000); // Updates every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const joinSquad = (team) => {
        setUserSquad(team);
        // Haptic Feedback handled in UI
    };

    const contribute = (amount) => {
        if (!userSquad) return;

        setSquadScores(prev => ({
            ...prev,
            [userSquad]: prev[userSquad] + amount
        }));
    };

    const getLeadingSquad = () => {
        return squadScores.NEON > squadScores.ZEN ? 'NEON' : 'ZEN';
    };

    return (
        <SquadContext.Provider value={{ userSquad, squadScores, joinSquad, contribute, getLeadingSquad }}>
            {children}
        </SquadContext.Provider>
    );
};
