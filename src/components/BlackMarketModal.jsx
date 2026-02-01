import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { usePocketBro } from '../context/PocketBroContext';
import { BLACK_MARKET_ITEMS } from '../config/BlackMarketItems';
import SquishyButton from './SquishyButton';
import useRetroSound from '../hooks/useRetroSound';

const BlackMarketModal = ({ onClose }) => {
    const { coins, buyItem } = useGamification();
    const { consumeItem } = usePocketBro();

    const { playBeep, playCollect } = useRetroSound();
    const [msg, setMsg] = useState("NO REFUNDS. NO QUESTIONS.");

    const handleBuy = (item) => {
        if (coins < item.price) {
            setMsg("GET MORE C0INS, SCRUB.");
            return;
        }

        // Buy Logic
        const success = buyItem(item);
        if (success) {
            playCollect();
            // Immediate Consumption for Black Market Exclusives
            if (item.type === 'consumable') {
                const effectMsg = consumeItem(item.id);
                setMsg(effectMsg.toUpperCase());
            } else {
                setMsg(`ACQUIRED: ${item.name}`);
            }
        } else {
            setMsg("TRANSACTION FAILED.");
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Courier New", monospace'
        }}>
            <div style={{
                width: '600px',
                border: '2px solid #0f0',
                background: '#001100',
                padding: '20px',
                boxShadow: '0 0 50px #0f0',
                position: 'relative'
            }}>
                <SquishyButton onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'red', color: 'black' }}>X</SquishyButton>

                <h1 style={{ color: '#0f0', textAlign: 'center', borderBottom: '1px solid #0f0', paddingBottom: '10px', textShadow: '2px 2px 0 #005500' }}>
                    /// BLACK_MARKET_V9 ///
                </h1>

                <div style={{ color: '#0f0', textAlign: 'center', margin: '20px 0', background: '#002200', padding: '10px' }}>
                    &gt;&gt; {msg}
                    <span className="blink">_</span>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {BLACK_MARKET_ITEMS.map(item => (
                        <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            border: '1px dashed #0f0', padding: '10px',
                            background: 'rgba(0, 255, 0, 0.05)'
                        }}>
                            <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                            <div style={{ flex: 1, padding: '0 20px', color: '#0f0' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.description}</div>
                            </div>
                            <button
                                onClick={() => handleBuy(item)}
                                style={{
                                    background: '#0f0', color: 'black', border: 'none',
                                    padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}>
                                {item.price}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#0f0', textAlign: 'center', opacity: 0.5 }}>
                    CONNECTION ENCRYPTED via ONION_ROUTER_7
                </div>
            </div>
            <style>{`
                .blink { animation: blinker 1s linear infinite; }
                @keyframes blinker { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default BlackMarketModal;
