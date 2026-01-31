/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../config/Themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Load from local storage or default
    const [themeId, setThemeId] = useState(() => {
        return localStorage.getItem('merchboy_theme') || 'theme_default';
    });

    const activeTheme = THEMES[themeId] || THEMES['theme_default'];

    useEffect(() => {
        const root = document.documentElement;
        const colors = activeTheme.colors;

        // Apply CSS Variables
        Object.keys(colors).forEach(key => {
            root.style.setProperty(key, colors[key]);
        });

        localStorage.setItem('merchboy_theme', themeId);
    }, [themeId, activeTheme]);

    return (
        <ThemeContext.Provider value={{ themeId, setThemeId, activeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
