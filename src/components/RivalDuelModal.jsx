import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from './SquishyButton';

const RIVALS = [
    { name: 'NeonViper', skin: '/assets/skins/face_dino.png', game: 'Cyber 21', path: '/arcade/blackjack', wager: 250 },
    { name: 'CyberSamurai', skin: '/assets/skins/face_bunny.png', game: 'Bro Derby', path: '/arcade/derby', wager: 300 },
    { name: 'MoonshotApe', skin: '/assets/skins/face_money.png', game: 'Cyber Crash', path: '/arcade/crash', wager: 500 },
    { name: 'SpinMaster', skin: '/assets/skins/face_star.png', game: 'Cyber Roulette', path: '/arcade/roulette', wager: 200 }
];

const RivalDuelModal = () => {
    const navigate = useNavigate();
    const { coins, addCoins } = useGamification() || {};
    const { showToast } = useToast() || { showToast: () => {} };
    const { playAirhorn, playBeep } = useRetroSound();

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [countdown, setCountdown] = useState(15);

    // Schedule random rival challenges
    useEffect(() => {
        const scheduleChallenge = () => {
            const delay = 180000 + Math.random() * 120000; // 3 to 5 minutes
            return setTimeout(() => {
                const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
                setActiveChallenge(rival);
                setCountdown(15);
                playBeep(880);
            }, delay);
        };

        const timer = scheduleChallenge();
        return () => clearTimeout(timer);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!activeChallenge) return;
        if (countdown <= 0) {
            setActiveChallenge(null);
            return;
        }

        const interval = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [activeChallenge, countdown]);

    const handleAccept = () => {
        if (!activeChallenge) return;

        playAirhorn();
        // Give 100 CP signing bonus for accepting challenge
        if (addCoins) addCoins(100);
        showToast(`⚔️ DUEL ACCEPTED against @${activeChallenge.name}! +100 CP Challenger Bonus!`, 'success');

        const dest = activeChallenge.path;
        setActiveChallenge(null);
        navigate(dest);
    };

    const handleDecline = () => {
        setActiveChallenge(null);
    };

    if (!activeChallenge) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[99999] max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border-2 border-red-500/60 rounded-3xl p-5 shadow-[0_0_40px_rgba(255,0,85,0.4)] animate-slideIn select-none font-sans">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-black text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    LIVE RIVAL CHALLENGE ({countdown}s)
                </span>
                <button
                    onClick={handleDecline}
                    className="text-slate-500 hover:text-white font-mono text-xs px-1.5 py-0.5"
                >
                    ✕
                </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-red-400 p-0.5 bg-black shrink-0 shadow-md">
                    <img
                        src={activeChallenge.skin}
                        alt={activeChallenge.name}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white m-0">
                        @{activeChallenge.name} wants to duel!
                    </h4>
                    <p className="text-xs text-slate-300 m-0 mt-0.5 font-mono">
                        Game: <span className="text-cyan-400 font-bold">{activeChallenge.game}</span> • Stake: <span className="text-yellow-400 font-bold">{activeChallenge.wager} CP</span>
                    </p>
                </div>
            </div>

            <div className="bg-black/60 rounded-xl p-2.5 mb-3 border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
                🎁 Accept now to claim <span className="text-yellow-300 font-bold">+100 CP Instant Bounty</span>!
            </div>

            <div className="grid grid-cols-2 gap-2">
                <SquishyButton
                    onClick={handleAccept}
                    className="py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-black font-black text-xs uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-center"
                >
                    ⚔️ ACCEPT (+100 CP)
                </SquishyButton>
                <button
                    onClick={handleDecline}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs uppercase rounded-xl border border-slate-700 transition-colors"
                >
                    DECLINE
                </button>
            </div>
        </div>
    );
};

export default RivalDuelModal;
