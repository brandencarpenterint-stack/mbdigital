import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SquishyButton from './SquishyButton';
import useRetroSound from '../hooks/useRetroSound';
import { ACHIEVEMENTS } from '../config/AchievementDefinitions';

const generateRoast = (profile, stats, achievements, pocketStats) => {
    const lines = [];
    
    // Level & XP Roasts
    const xp = stats.xp || 0;
    if (xp < 100) {
        lines.push("Oh look, a fresh install. Do you even know how to hold a mouse, or did you click here by accident?");
    } else if (xp > 10000) {
        lines.push("Touch grass immediately. Your keyboard is begging for mercy and your chair has a permanent indent.");
    } else {
        lines.push("Ah, right in the middle. Perfectly average, just like your high school report card.");
    }

    // Achievements Roasts
    const maxAch = ACHIEVEMENTS.length;
    const unlockedAch = achievements?.length || 0;
    
    if (unlockedAch === 0) {
        lines.push("0 achievements? You're playing life on spectator mode.");
    } else if (unlockedAch < 5) {
        lines.push(`Wow, ${unlockedAch} whole achievements out of ${maxAch}. My grandmother accidentally unlocks more just by unlocking her phone.`);
    } else if (unlockedAch === maxAch) {
        lines.push("100% completion? Okay tryhard. What's next, are you going to platinum Microsoft Excel?");
    }

    // Fishing Game Stats
    const fish = stats.fishCaught || 0;
    if (fish === 0) {
        lines.push("Zero fish caught. The virtual fish are literally laughing at you.");
    } else if (fish > 50) {
        lines.push(`Caught ${fish} fish? You're aware you can't actually eat them, right?`);
    }

    // Pocket Bro Stats
    if (pocketStats) {
        if (pocketStats.happy < 30) {
            lines.push("Your Pocket Bro hates you. It's plotting to delete your system32 folder tonight.");
        }
        if (pocketStats.hunger < 20) {
            lines.push("FEED YOUR PET. It's surviving off pure spite right now.");
        }
    }

    // Money
    const coins = stats.coins || 0;
    if (coins === 0) {
        lines.push("Broke in real life AND in the game. Consistency is key, I guess.");
    } else if (coins > 50000) {
        lines.push("Hoarding virtual coins won't fix the economy, Scrooge.");
    }

    // Assemble the final roast
    const intro = `INITIALIZING AI ROAST ENGINE...\nANALYZING TARGET [${profile.name.toUpperCase()}]...\n\n`;
    
    // Pick 3 random lines or just use all
    return intro + lines.join('\n\n') + "\n\nCONCLUSION: YOU ARE NGMI.";
};

const RoastModal = ({ onClose, profile, stats, achievements, pocketStats }) => {
    const { playClick, playError } = useRetroSound();
    const [roastText, setRoastText] = useState('');
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        const fullText = generateRoast(profile, stats, achievements, pocketStats);
        
        let i = 0;
        playError(); // play a glitchy sound for the AI booting up
        
        const typeInterval = setInterval(() => {
            setRoastText(prev => fullText.substring(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(typeInterval);
                setIsGenerating(false);
            }
        }, 30); // typing speed

        return () => clearInterval(typeInterval);
    }, [profile, stats, achievements, pocketStats, playError]);

    const handleShare = async () => {
        playClick();
        const shareText = `Just got absolutely ROASTED by the Merchboy AI:\n\n"${roastText.replace('INITIALIZING AI ROAST ENGINE...\nANALYZING TARGET [' + profile.name.toUpperCase() + ']...\n\n', '').replace('\n\nCONCLUSION: YOU ARE NGMI.', '')}"\n\nGet roasted at merchboy.com! 🔥`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Merchboy Roast',
                    text: shareText,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText);
            alert("Roast copied to clipboard!");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)', zIndex: 6000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#0a0a0a', width: '90%', maxWidth: '500px',
                    borderRadius: '10px', padding: '30px',
                    border: '2px solid #ff0055',
                    boxShadow: '0 0 30px rgba(255, 0, 85, 0.4), inset 0 0 20px rgba(255, 0, 85, 0.2)',
                    display: 'flex', flexDirection: 'column',
                    color: '#ff0055', fontFamily: '"Courier New", Courier, monospace'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ff0055', paddingBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 0 5px #ff0055', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="blink">🔥</span> TERMINAL: ROAST_ENGINE.EXE
                    </h2>
                    <SquishyButton onClick={onClose} style={{ padding: '2px 10px', background: 'transparent', border: '1px solid #ff0055', color: '#ff0055', fontSize: '0.8rem' }}>
                        [X]
                    </SquishyButton>
                </div>

                <div className="crt-effect" style={{ 
                    flex: 1, minHeight: '200px', background: '#000', padding: '15px', 
                    borderRadius: '5px', overflowY: 'auto', whiteSpace: 'pre-wrap', 
                    fontSize: '0.9rem', lineHeight: '1.5',
                    border: '1px solid #333'
                }}>
                    {roastText}
                    {isGenerating && <span className="blink">_</span>}
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <SquishyButton 
                        onClick={handleShare} 
                        disabled={isGenerating}
                        style={{ 
                            flex: 1, background: isGenerating ? '#333' : '#ff0055', 
                            color: isGenerating ? '#666' : 'black', fontWeight: 'bold', 
                            border: 'none', padding: '15px', fontFamily: '"Press Start 2P"', fontSize: '0.8rem'
                        }}
                    >
                        {isGenerating ? 'ANALYZING...' : 'SHARE TO X/IG 📤'}
                    </SquishyButton>
                </div>
                
                <style>{`
                    .blink { animation: blink 1s step-end infinite; }
                    @keyframes blink { 50% { opacity: 0; } }
                    .crt-effect::before {
                        content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
                        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                        z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none;
                    }
                `}</style>
            </motion.div>
        </div>
    );
};

export default RoastModal;
