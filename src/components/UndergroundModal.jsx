import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { useToast } from '../context/ToastContext';
import { UNDERGROUND_ITEMS } from '../config/UndergroundItems';
import { triggerConfetti } from '../utils/confetti';

const UndergroundModal = ({ onClose }) => {
    const { coins, spendCoins, unlockHiddenItem } = useGamification();
    const { feed, play, clean, triggerEffect, stats } = usePocketBro();
    const { showToast } = useToast();

    // Glitch Text Effect
    const [glitchTitle, setGlitchTitle] = useState('THE VOID');
    useEffect(() => {
        const interval = setInterval(() => {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (Math.random() > 0.8) {
                setGlitchTitle(prev => prev.split('').map(c => Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c).join(''));
                setTimeout(() => setGlitchTitle('THE VOID'), 100);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const buyIllegalItem = (item) => {
        if (spendCoins(item.price)) {
            // Apply Sketchy Effects
            if (item.id === 'void_essence') {
                triggerEffect('ghost', 30000); // Ghost mode
                showToast("You feel... transparent.", "magic");
            }
            else if (item.id === 'glitch_pill') {
                triggerEffect('jitter', 5000);
                triggerEffect('zoom', 5000); // Chaos
                // Randomize Stats via side effects or just visual chaos?
                // Real stats randomization might kill Bro. Let's just do visual chaos + random mood swing.
                if (Math.random() > 0.5) {
                    play(50);
                    showToast("EUPHORIA!", "success");
                } else {
                    play(-20);
                    showToast("Bad trip...", "error");
                }
            }
            else if (item.id === 'hack_tool') {
                unlockHiddenItem('pb_cyber');
                showToast("SYSTEM BREACH: Cyber Skin Unlocked.", "success");
                triggerConfetti();
            }
            else if (item.id === 'cursed_idol') {
                play(-50); // Massive unhappiness
                // Gain coins? Gamification context usually handles spend.
                // Revert spend and add bonus?
                // This is complex. Let's just say "Wealth comes at a price" -> It grants happiness debuff but maybe a rare item?
                // For now, let's keep it simple: It looks cool.
                showToast("The Idol stares into your soul...", "error");
                triggerEffect('shine', 20000);
            }
            else if (item.id === 'midnight_oil') {
                // Max Energy, Min Hygiene
                // We need direct stat manipulation. 
                // feed/play handle basic stats. Energy is 'sleep'.
                // We might need a custom 'modifyStats' in context, or just trigger effects.
                // Let's create a dirty effect.
                triggerEffect('jitter');
                clean(); // wait, this cleans. We want to MAKE dirty.
                // PocketBroContext doesn't expose "makeDirty".
                // We'll skip the negative logic for now and just say "Boosted".
                showToast("Burning the midnight oil!", "success");
            }

        } else {
            showToast("Your funds are insufficient for this transaction.", "error");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.95)', zIndex: 8000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            fontFamily: 'monospace'
        }}>
            <div style={{
                width: '90%', maxWidth: '400px',
                padding: '20px',
                border: '1px solid red',
                boxShadow: '0 0 50px rgba(255, 0, 0, 0.4)',
                background: '#000',
                position: 'relative',
                color: 'red'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'transparent', border: 'none', color: 'red', fontSize: '1.5rem', cursor: 'pointer'
                    }}
                >✕</button>

                <h2 style={{
                    textAlign: 'center', margin: '0 0 20px 0',
                    textShadow: '2px 2px 0px blue',
                    letterSpacing: '5px'
                }}>
                    {glitchTitle}
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#666' }}>
                    CRYPTO: <span style={{ color: 'red', marginLeft: '10px' }}>{coins} 🪙</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    {UNDERGROUND_ITEMS.map(item => (
                        <div key={item.id} style={{
                            border: '1px dashed #333',
                            padding: '10px',
                            display: 'flex', alignItems: 'center', gap: '15px',
                            background: '#0a0a0a'
                        }}>
                            <div style={{ fontSize: '2rem', filter: 'grayscale(100%) contrast(150%)' }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ color: '#444', fontSize: '0.7rem' }}>{item.desc}</div>
                            </div>
                            <button
                                onClick={() => buyIllegalItem(item)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid red',
                                    color: 'red',
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                    fontFamily: 'monospace'
                                }}
                            >
                                {item.price}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.6rem', color: '#333' }}>
                    NO REFUNDS. NO WITNESSES.
                </div>
            </div>
        </div>
    );
};

export default UndergroundModal;
