import React, { createContext, useContext, useState, useEffect } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    // 0-23
    const [hour, setHour] = useState(new Date().getHours());

    // Cycle duration in milliseconds (e.g. 60000 = 1 minute real time = 24 hours game time? No, let's stick to real time or accelerated?)
    // User requested "Temporal Shift (Day/Night cycle)".
    // Let's do Real Time for now, but maybe provide debug controls.

    useEffect(() => {
        const timer = setInterval(() => {
            setHour(new Date().getHours());
        }, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    // Derived State
    const isNight = hour >= 20 || hour < 6;
    const isDay = !isNight;

    // Phase: DAWN, DAY, DUSK, NIGHT
    let phase = 'DAY';
    if (hour >= 5 && hour < 8) phase = 'DAWN';
    else if (hour >= 8 && hour < 18) phase = 'DAY';
    else if (hour >= 18 && hour < 21) phase = 'DUSK';
    else phase = 'NIGHT';

    return (
        <TimeContext.Provider value={{ hour, isNight, isDay, phase }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => useContext(TimeContext);
