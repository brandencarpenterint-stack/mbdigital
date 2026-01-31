import React, { useState, useEffect, useMemo } from 'react';
import { useSquad } from '../context/SquadContext';
import { useGamification } from '../context/GamificationContext';

const MOCK_WINNERS = ['Neo', 'Trinity', 'Morpheus', 'Cipher', 'Tank', 'Dozer', 'Switch', 'Apoc', 'Mouse'];
const MOCK_PRIZES = [50, 100, 250, 500, 1000, 5000];
const GAMES = ['Cosmic Slots', 'Neon Snake', 'Galaxy Defender', 'Crazy Fishing'];

const HypeTicker = () => {
    const { squadScores, getSquadDetails } = useSquad();
    const { userProfile } = useGamification() || {};

    // Generate dynamic headlines based on state
    const headlines = useMemo(() => {
        const list = [
            "🔥 HOT: 'Face Runner' Jackpot is surging!",
            "💎 TIP: Feed your Pocket Bro Sushi for double XP!",
            "🛍️ SHOP: New 'Neon' skins just dropped.",
            "🌊 LEGEND: A Golden Koi was spotted in the lake...",
            "🎹 BEAT LAB: Trap presets now available.",
        ];

        // 1. Squad Leader News
        if (squadScores) {
            const leader = Object.entries(squadScores).sort((a, b) => b[1] - a[1])[0];
            if (leader) {
                const details = getSquadDetails(leader[0]);
                list.unshift(`🏆 WAR ROOM: Team ${details.name} is dominating with ${leader[1]} points!`);
            }
        }

        // 2. Personal Shoutout
        if (userProfile?.name) {
            list.push(`👋 Welcome back, Agent ${userProfile.name}. The system is online.`);
        }

        return list;
    }, [squadScores, userProfile]);

    // Live "Ticker" of random wins
    const [liveEvent, setLiveEvent] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const winner = MOCK_WINNERS[Math.floor(Math.random() * MOCK_WINNERS.length)];
                const prize = MOCK_PRIZES[Math.floor(Math.random() * MOCK_PRIZES.length)];
                const game = GAMES[Math.floor(Math.random() * GAMES.length)];
                setLiveEvent(`🎰 BREAKING: ${winner} just won ${prize} Coins in ${game}!`);

                // Clear after 5s
                setTimeout(() => setLiveEvent(null), 5000);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Combine static headlines + live event
    const content = liveEvent ? [liveEvent] : headlines;

    return (
        <div className="hype-ticker-container">
            <div className="ticker-label">LIVE</div>
            <div className="ticker-track">
                {/* Double the content for seamless loop */}
                <div className="ticker-content">
                    {content.map((text, i) => (
                        <span key={i} className="ticker-item">{text} • </span>
                    ))}
                    {/* Repeat for seamlessness if no live event */}
                    {!liveEvent && headlines.map((text, i) => (
                        <span key={`dup-${i}`} className="ticker-item">{text} • </span>
                    ))}
                </div>
            </div>

            <style>{`
                .hype-ticker-container {
                    background: #000;
                    border-bottom: 1px solid var(--neon-blue);
                    height: 30px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 2000; /* Above Header */
                    font-family: 'Courier New', monospace;
                }
                .ticker-label {
                    background: #ff0055;
                    color: white;
                    padding: 0 10px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    font-size: 0.8rem;
                    z-index: 2;
                    box-shadow: 5px 0 15px rgba(0,0,0,0.8);
                }
                .ticker-track {
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    mask-image: linear-gradient(to right, transparent, black 20px, black 95%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20px, black 95%, transparent);
                }
                .ticker-content {
                    display: inline-block;
                    padding-left: 100%;
                    animation: marquee 60s linear infinite;
                }
                .ticker-content:hover {
                    animation-play-state: paused;
                }
                .ticker-item {
                    color: var(--neon-blue);
                    font-size: 0.8rem;
                    margin-right: 30px;
                    text-shadow: 0 0 5px var(--neon-blue);
                }
                @keyframes marquee {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-100%, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default HypeTicker;
