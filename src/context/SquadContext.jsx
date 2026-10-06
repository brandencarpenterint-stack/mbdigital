import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient'; // Ensure correct path

const SquadContext = createContext();
export const useSquad = () => useContext(SquadContext);

export const SquadProvider = ({ children }) => {
    const [userSquad, setUserSquad] = useState(() => localStorage.getItem('userSquad') || null);
    
    // Global State for Faction War
    const [squadScores, setSquadScores] = useState({
        CYBER: 450250,
        SOLAR: 448100,
        VOID: 432000
    });

    useEffect(() => {
        if (userSquad) localStorage.setItem('userSquad', userSquad);
    }, [userSquad]);

    // LIVE Global Warfare Sync (Supabase Broadcast)
    useEffect(() => {
        if (!supabase) return;
        
        // Listen to donations from other players in real-time
        const channel = supabase.channel('faction_wars')
            .on('broadcast', { event: 'faction_donate' }, (payload) => {
                console.log("Realtime Faction Donate:", payload.payload);
                const { faction, amount } = payload.payload;
                setSquadScores(prev => ({
                    ...prev,
                    [faction]: (prev[faction] || 0) + amount
                }));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const joinSquad = (team) => {
        setUserSquad(team);
    };

    const contribute = (amount) => {
        if (!userSquad) return;
        
        // Optimistic local update
        setSquadScores(prev => ({
            ...prev,
            [userSquad]: prev[userSquad] + amount
        }));

        // Broadcast to everyone else
        if (supabase) {
            supabase.channel('faction_wars').send({
                type: 'broadcast',
                event: 'faction_donate',
                payload: { faction: userSquad, amount }
            });
        }
    };

    const getLeadingSquad = () => {
        return Object.keys(squadScores).reduce((a, b) => squadScores[a] > squadScores[b] ? a : b);
    };

    const getSquadDetails = (id) => {
        const DETAILS = {
            CYBER: { name: 'Cyber Punks', color: '#00f3ff', icon: '🦾' },
            SOLAR: { name: 'Solar Knights', color: '#ffaa00', icon: '☀️' },
            VOID: { name: 'Void Walkers', color: '#9d00ff', icon: '🔮' }
        };
        return DETAILS[id] || { name: 'Unknown', color: '#fff', icon: '❓' };
    };

    return (
        <SquadContext.Provider value={{ userSquad, squadScores, joinSquad, contribute, getLeadingSquad, getSquadDetails }}>
            {children}
        </SquadContext.Provider>
    );
};
