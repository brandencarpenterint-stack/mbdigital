import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SquadContext = createContext();

export const useSquad = () => useContext(SquadContext);

export const SquadProvider = ({ children }) => {
    // Persistent User Squad (Team)
    const [userSquad, setUserSquad] = useState(() => localStorage.getItem('userSquad') || null);

    // Persistent Recruits (BroFinder Matches)
    const [recruits, setRecruits] = useState(() => {
        const saved = localStorage.getItem('squadRecruits');
        return saved ? JSON.parse(saved) : [];
    });

    // Global State
    const [squadScores, setSquadScores] = useState({
        CYBER: 450250,
        SOLAR: 448100,
        VOID: 432000
    });

    // Save persistence
    useEffect(() => {
        if (userSquad) localStorage.setItem('userSquad', userSquad);
    }, [userSquad]);

    useEffect(() => {
        localStorage.setItem('squadRecruits', JSON.stringify(recruits));
    }, [recruits]);


    const recruitMember = (member) => {
        setRecruits(prev => [...prev, { ...member, joinedAt: Date.now(), xp: 0, level: 1 }]);
    };

    const fireMember = (id) => {
        setRecruits(prev => prev.filter(m => m.id !== id));
    };

    // LIVE Global Warfare (Aggregation)
    useEffect(() => {
        const fetchScores = async () => {
            // DB columns missing. Using local/mock scores for now.
            // if (!supabase) return;
            // try {
            //    const { data, error } = await supabase.from('profiles').select('squad, xp');
            //    ...
            // } catch (e) { ... }

            // Keep Mock Scores
            // console.log("Squad Sync Skipped (DB Schema Pending)");
        };

        fetchScores(); // Initial
        const interval = setInterval(fetchScores, 10000); // Poll every 10s

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
        return Object.keys(squadScores).reduce((a, b) => squadScores[a] > squadScores[b] ? a : b);
    };

    const getSquadDetails = (id) => {
        const DETAILS = {
            CYBER: { name: 'Cyber Punks', color: '#00f3ff', icon: '🦾' },
            SOLAR: { name: 'Solar Knights', color: '#ffaa00', icon: '☀️' },
            VOID: { name: 'Void Walkers', color: '#9d00ff', icon: '🌑' }
        };
        return DETAILS[id] || { name: 'Unknown', color: '#fff' };
    };

    return (
        <SquadContext.Provider value={{ userSquad, squadScores, joinSquad, contribute, getLeadingSquad, getSquadDetails, recruits, recruitMember, fireMember }}>
            {children}
        </SquadContext.Provider>
    );
};
