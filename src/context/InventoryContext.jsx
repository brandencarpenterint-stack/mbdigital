import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    // Inventory State
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('userInventory');
        return saved ? JSON.parse(saved) : {
            skins: ['DEFAULT'], // Pocket Bro Skins
            backgrounds: ['DEFAULT'], // App Themes?
            music: ['DEFAULT'], // Beat Lab Packs
            codesRedeemed: [] // Track used codes
        };
    });

    const [activeSkin, setActiveSkin] = useState(() => localStorage.getItem('activeSkin') || 'DEFAULT');

    useEffect(() => {
        localStorage.setItem('userInventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('activeSkin', activeSkin);
    }, [activeSkin]);

    // Validation Logic (Mock Database of codes)
    const VALID_CODES = {
        'NEON-DROP-01': { type: 'skin', id: 'NEON_HOODIE', name: 'Neon Genesis Hoodie' },
        'ZEN-MASTER-XX': { type: 'skin', id: 'ZEN_ROBE', name: 'Zen Grandmaster Robe' },
        'GLITCH-GOD': { type: 'skin', id: 'GLITCH_GHOST', name: 'The Glitch Ghost' },
        'BEAT-MAKER-PRO': { type: 'music', id: 'TRAP_PACK', name: 'Trap Drum Kit' }
    };

    const redeemCode = (code) => {
        const cleanCode = code.trim().toUpperCase();

        if (inventory.codesRedeemed.includes(cleanCode)) {
            return { success: false, message: 'Code already used!' };
        }

        const reward = VALID_CODES[cleanCode];
        if (reward) {
            setInventory(prev => {
                const newState = { ...prev, codesRedeemed: [...prev.codesRedeemed, cleanCode] };

                if (reward.type === 'skin' && !prev.skins.includes(reward.id)) {
                    newState.skins = [...prev.skins, reward.id];
                }
                if (reward.type === 'music' && !prev.music.includes(reward.id)) {
                    newState.music = [...prev.music, reward.id];
                }

                return newState;
            });
            return { success: true, message: `UNLOCKED: ${reward.name}`, reward };
        }

        return { success: false, message: 'Invalid Code. Try "NEON-DROP-01"' };
    };

    const equipSkin = (skinId) => {
        if (inventory.skins.includes(skinId)) {
            setActiveSkin(skinId);
        }
    };

    return (
        <InventoryContext.Provider value={{ inventory, activeSkin, redeemCode, equipSkin }}>
            {children}
        </InventoryContext.Provider>
    );
};
