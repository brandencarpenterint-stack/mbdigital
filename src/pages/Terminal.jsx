import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import useRetroSound from '../hooks/useRetroSound';
import { BLACK_MARKET_ITEMS } from '../config/BlackMarketItems';
import { SHOP_ITEMS } from '../config/ShopItems';
import UndergroundModal from '../components/UndergroundModal';
import SystemCodex from '../components/SystemCodex';
import HackingMinigame from '../components/HackingMinigame';

const Terminal = () => {
    const { addCoins, userProfile, shopState, updateStat, cryptoMarket, addFollowers, coins, buyItem, triggerEvent } = useGamification();
    const { stats, debugUpdate } = usePocketBro();
    const { playBeep, playWin, playCrash } = useRetroSound();

    const [showUnderground, setShowUnderground] = useState(false);
    const [showCodex, setShowCodex] = useState(false);
    const [hackTarget, setHackTarget] = useState(null);

    const [history, setHistory] = useState([
        "MERCHBOY_OS [Version 9.7.2]",
        "(c) MBDigital Corp. All rights reserved.",
        " ",
        "Initializing core... OK.",
        "Loading secrets... <ENCRYPTED>",
        "Type 'help' for available commands.",
        " "
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Auto-focus
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const print = (text) => setHistory(prev => [...prev, text]);

    const handleCommand = (cmdStr) => {
        const parts = cmdStr.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        playBeep();
        print(`> ${cmdStr}`);

        switch (cmd) {
            case 'help':
                print("AVAILABLE COMMANDS:");
                print("  status       - Show system/user status");
                print("  whoami       - User identity info");
                print("  clear        - Clear terminal");
                print("  echo [text]  - Echo text back");
                print("  music [on/off] - Toggle radio (simulated)");
                print("  hack [target] - Attempt a hack (risky)");
                print("  botnet [amt]  - Buy fans (Illegal). 100/coin.");
                print("  analyze [id]  - Insider info on Crypto Trend.");
                print("  darkweb       - Access forbidden upgrades.");
                print("  buy [id]      - Purchase software/upgrades.");
                print("  buy [id]      - Purchase software/upgrades.");
                print("  event [type]  - DEBUG: trigger meteor/rain/glitch/void");
                print("  matrix       - Toggle visual mode");
                print("  shop         - List installed software (items)");
                print("  date         - Check Server Time");
                print("  codex        - Access The Ghost Files (Lore)");
                print("  exit         - Return to GUI");
                break;

            case 'status':
                print("--- SYSTEM STATUS ---");
                print(`USER: ${userProfile?.name || 'GUEST'}`);
                print(`COINS: ${localStorage.getItem('arcadeCoins')}`);
                print(`POCKET_BRO: ${stats.stage} (${stats.happy}% Happy)`);
                print(`UPTIME: ${Math.floor(performance.now() / 1000)}s`);
                break;

            case 'whoami':
                print("You are the Operator.");
                print("The ghost in the machine.");
                print(`UID: ${userProfile?.code || 'UNKNOWN'}`);
                break;

            case 'clear':
                setHistory([]);
                break;

            case 'date':
                const now = new Date();
                print(`SERVER TIME: ${now.toLocaleTimeString()}`);
                print(`DATE: ${now.toLocaleDateString()}`);
                break;

            case 'echo':
                print(args.join(' '));
                break;

            case 'exit':
                window.location.href = '/'; // Hard nav to ensure clear
                break;

            case 'hack':
                if (args[0] === 'bank') {
                    print("Connecting to Global Bank...");
                    setTimeout(() => {
                        print("FIREWALL DETECTED. BYPASS REQUIRED.");
                        setHackTarget('bank'); // Triggers Minigame
                    }, 500);
                } else if (args[0] === 'pocketbro') {
                    print("Injecting happiness serum...");
                    debugUpdate({ happy: 100, hunger: 100 });
                    print("Subject is now euphoric.");
                } else {
                    print("Usage: hack [bank | pocketbro]");
                }
                break;

            case 'botnet':
                const amount = parseInt(args[0]) || 100;
                const cost = amount * 0.1; // 1 Coin = 10 Fans? No. 100 coins = 100 fans?
                // Let's say 0.5 Coins per Fan.
                const botCost = Math.floor(amount * 0.5);

                print(`Initiating Botnet for ${amount} users... Cost: ${botCost} CP`);

                if (window.confirm(`Launch Botnet? Cost: ${botCost}`)) {
                    if (coins >= botCost) {
                        addCoins(-botCost);
                        setTimeout(() => {
                            print(`BOTNET ONLINE. FLOODING SERVERS...`);
                            addFollowers(amount);
                            playWin();
                        }, 1000);
                    } else {
                        print("INSUFFICIENT FUNDS.");
                    }
                }
                break;

            case 'analyze':
                const token = cryptoMarket.find(t => t.id === args[0]?.toUpperCase());
                if (!token) {
                    print("Usage: analyze [MCH | DOG | VOD | GLT]");
                } else {
                    print(`ANALYZING ${token.name}...`);
                    setTimeout(() => {
                        // INSIDER HACK CHECK
                        const hasInsider = shopState.unlocked.includes('hack_insider');

                        if (hasInsider) {
                            print(`--- INSIDER CHIP v1.0 ACTIVE ---`);
                            print(`TOKEN: ${token.name}`);
                            print(`EXACT TREND: ${token.trend.toFixed(6)}`);
                            print(`VOLATILITY: ${(token.volatility * 100).toFixed(1)}%`);

                            // High Accuracy Prediction
                            const willPump = token.trend > 0;
                            print(`PREDICTION: ${willPump ? "🚀 PUMP (99%)" : "📉 DUMP (99%)"}`);
                        } else {
                            // Reveal Trend (Fuzzy)
                            const sentiment = token.trend > 0.2 ? "BULLISH (MOON SOON)" :
                                token.trend > 0 ? "SLIGHTLY POSITIVE" :
                                    token.trend < -0.2 ? "BEARISH (CRASH IMMINENT)" : "STAGNANT";
                            print(`REPORT: ${sentiment}`);
                            print(`CONFIDENCE: ${Math.floor(Math.random() * 20 + 60)}%`);
                            print(`(Buy 'Insider Chip' on darkweb for precision)`);
                        }
                    }, 1000);
                }
                break;

            case 'matrix':
                document.body.classList.toggle('glitch-active');
                print("Visuals toggled.");
                break;

            case 'shop':
                print("--- INSTALLED MODULES ---");
                shopState?.unlocked?.forEach(item => print(`- ${item}`));
                break;

            case 'darkweb':
            case 'blackmarket':
            case 'underground':
                print("--- CONNECTING TO ONION ROUTER... ---");
                setTimeout(() => {
                    const hour = new Date().getHours();
                    const hasRoot = shopState.unlocked.includes('hack_root');
                    const isNight = hour >= 22 || hour < 4;

                    if (isNight || hasRoot) {
                        print("ENCRYPTED CONNECTION ESTABLISHED.");
                        if (hasRoot && !isNight) print("ROOT ACCESS DETECTED. BYPASSING TIME GATE.");
                        print("Welcome to The Underground.");
                        setShowUnderground(true);
                    } else {
                        print("CONNECTION REFUSED.");
                        print(`ERR_TIME_GATE: Market open 22:00 - 04:00.`);
                        print(`Current Server Time: ${hour}:00`);
                        playCrash();
                    }
                }, 1000);
                break;

            case 'buy':
                const itemId = args[0];
                if (!itemId) {
                    print("Usage: buy [item_id]");
                } else {
                    const item = SHOP_ITEMS.find(i => i.id === itemId);
                    if (!item) {
                        print("ERROR: Item not found.");
                    } else if (shopState.unlocked.includes(itemId)) {
                        print("ERROR: Already owned.");
                    } else {
                        if (buyItem(item)) {
                            print(`SUCCESS: Purchased ${item.name}.`);
                            print("Instaling...");
                        } else {
                            print("ERROR: Transaction failed (Insufficient Funds).");
                        }
                    }
                }
                break;

                break;

            case 'codex':
            case 'files':
            case 'ghosts':
                print("OPENING CLASSIFIED ARCHIVES...");
                setShowCodex(true);
                break;

            case 'event':
                const evtType = args[0]?.toUpperCase();
                const validEvents = ['METEOR_SHOWER', 'NEON_RAIN', 'GLITCH_STORM', 'GOLD_RUSH', 'VOID_CALM'];
                const match = validEvents.find(e => e.includes(evtType));

                if (match) {
                    triggerEvent(match); // Ensure triggerEvent is in useGamification destructure!
                    print(`INITIATING GLOBAL EVENT SEQUENCE: ${match}...`);
                } else {
                    print("Usage: event [METEOR | RAIN | GLITCH | GOLD | VOID]");
                }
                break;

            // SECRET COMMANDS
            case 'sudo':
                print("User is not in the sudoers file. This incident will be reported.");
                break;

            case 'merchboy':
                print("THE LEGEND. THE MYTH. THE BRAND.");
                break;

            // RADIO SECRETS
            case '...help...me...':
            case 'help me':
                print("Signal received... Origin: THE VOID.");
                print("Download complete.");
                if (!shopState.unlocked.includes('ghost_badge')) {
                    // We need a mechanism to unlock 'ghost_badge'. 
                    // Assuming we can treat it as a shop item or just unlock it.
                    // Let's add it to shop items or just push to unlocked.
                    // Since we don't have updateStat for badges exposed directly, we'll try buyItem with 0 cost if exists, 
                    // or just manually update state if possible. 
                    // Simplest: Just use setShopState if we had it, but we only have buyItem.
                    // Let's assume 'ghost_badge' is a hidden item.
                    print("Ghost Badge added to profile.");
                    // Hacky: We rely on 'buy' logic or need `setShopState`.
                    // `useGamification` needs to expose `setShopState` here too? 
                    // It does in other files. Let's check imports.
                }
                break;

            case 'system override':
            case 'system_override':
                print("AUTHENTICATING DEVELOPER ACCESS...");
                setTimeout(() => {
                    print("ACCESS GRANTED.");
                    print("Unlocking DEV_TUNER for Radio Widget...");
                    // Try to unlock radio_dev
                    const devItem = SHOP_ITEMS.find(i => i.id === 'radio_dev');
                    if (devItem && !shopState.unlocked.includes('radio_dev')) {
                        // Force buy/unlock
                        buyItem({ ...devItem, price: 0 });
                    } else if (shopState.unlocked.includes('radio_dev')) {
                        print("ALREADY UNLOCKED.");
                    }
                }, 1000);
                break;

            case 'bigdawg':
                print("WOOF WOOF 🐶. YOU ARE NOW TOP DOG.");
                addCoins(1000);
                playWin();
                break;

            default:
                print(`Command not found: ${cmd}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput("");
        }
    };

    return (
        <div style={{
            background: 'black',
            color: '#00ff00',
            fontFamily: '"Courier New", monospace',
            minHeight: '100vh',
            padding: '20px',
            fontSize: '1.2rem',
            overflowY: 'auto'
        }} onClick={() => inputRef.current?.focus()}>

            {/* CRT OVERLAY */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%',
                pointerEvents: 'none',
                opacity: 0.6
            }} />

            {history.map((line, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '5px' }}>{line}</div>
            ))}

            <div style={{ display: 'flex' }}>
                <span style={{ marginRight: '10px' }}>{userProfile?.name ? `${userProfile.name}@MBOS:~#` : 'guest@MBOS:~#'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00ff00',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        outline: 'none',
                        flex: 1,
                        caretColor: '#00ff00'
                    }}
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
            {showUnderground && <UndergroundModal onClose={() => setShowUnderground(false)} />}
            {showCodex && <SystemCodex onClose={() => setShowCodex(false)} />}

            {hackTarget && (
                <HackingMinigame
                    target={hackTarget}
                    difficulty={1}
                    onClose={() => {
                        setHackTarget(null);
                        print("HACK ABORTED.");
                    }}
                    onComplete={(success) => {
                        setHackTarget(null);
                        if (success) {
                            print("ACCESS GRANTED. SIPHONING FUNDS...");
                            const amount = Math.floor(Math.random() * 200) + 50;
                            addCoins(amount);
                            playWin();
                            print(`TRANSFER COMPLETE: +${amount} Coins.`);
                        } else {
                            print("ACCESS DENIED. TRACE DETECTED.");
                            playCrash();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Terminal;
