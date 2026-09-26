import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('soundEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [tiktokMode, setTiktokMode] = useState(() => {
        const saved = localStorage.getItem('tiktokMode');
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem('tiktokMode', JSON.stringify(tiktokMode));
        if (tiktokMode) {
            document.body.classList.add('tiktok-mode-active');
        } else {
            document.body.classList.remove('tiktok-mode-active');
        }
    }, [tiktokMode]);

    const toggleSound = () => setSoundEnabled(prev => !prev);
    const toggleTiktokMode = () => setTiktokMode(prev => !prev);

    return (
        <SettingsContext.Provider value={{ soundEnabled, toggleSound, tiktokMode, toggleTiktokMode }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
