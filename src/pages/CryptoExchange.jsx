import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from '../components/SquishyButton';
import { useToast } from '../context/ToastContext';

// TOKENS DEFINED IN CONTEXT NOW

const CryptoExchange = () => {
    const { coins, addCoins, cryptoMarket, cryptoPortfolio, buyCrypto, sellCrypto } = useGamification();
    const { playCollect, playBeep, playCrash, playWin } = useRetroSound();
    const { showToast } = useToast();

    // Use Context Data
    const market = cryptoMarket;
    const portfolio = cryptoPortfolio;
    const { shopState } = useGamification();
    const hasInsider = shopState?.unlocked.includes('hack_insider');

    const [selectedTokenId, setSelectedTokenId] = useState('MCH');
    const selectedToken = market.find(t => t.id === selectedTokenId) || market[0];

    const graphRef = useRef(null);

    const handleBuy = () => {
        playBeep();
        buyCrypto(selectedToken.id, 1);
    };

    const handleSell = () => {
        playBeep();
        sellCrypto(selectedToken.id, 1);
    };



    // SVG Graph
    const Graph = ({ data, color, hasInsider, trend }) => {
        const max = Math.max(...data, 1);
        const min = Math.min(...data, 0);
        const range = max - min || 1;
        const width = 100;
        const height = 100;

        // Create Path
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height; // Invert Y
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 100} ${points.replace(/,/g, ' ')} L 100,100 Z`} fill={`url(#grad-${color})`} stroke="none" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />

                {/* FORECAST LINE (INSIDER CHIP) */}
                {hasInsider && (
                    <line
                        x1="90" y1={100 - ((data[data.length - 1] - min) / range) * 100}
                        x2="100" y2={100 - ((data[data.length - 1] * (trend > 0 ? 1.1 : 0.9) - min) / range) * 100}
                        stroke="white" strokeWidth="2" strokeDasharray="4" opacity="0.5"
                    />
                )}
            </svg>
        );
    };

    const portfolioValue = market.reduce((acc, token) => acc + (portfolio[token.id] || 0) * token.price, 0);

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: '#0a0a12',
            color: 'white',
            fontFamily: '"Orbitron", monospace',
            paddingBottom: '100px',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* HEADER */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8, color: 'white' }}>⬅</Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>MBX EXCHANGE</h1>
                    <div style={{ fontSize: '0.6rem', color: '#666' }}>DECENTRALIZED TRADING PROTOCOL</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffcc00', fontWeight: 'bold' }}>{coins.toFixed(0)} CP</div>
                    <div style={{ fontSize: '0.7rem', color: '#00ffcc' }}>ASSETS: {portfolioValue.toFixed(0)} CP</div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', flexWrap: 'wrap' }}>

                {/* LIST */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {market.map(token => {
                        const isSelected = token.id === selectedTokenId;
                        const owned = portfolio[token.id] || 0;
                        const lastPrice = token.history[token.history.length - 2];
                        const isUp = token.price >= lastPrice;

                        return (
                            <motion.button
                                key={token.id}
                                onClick={() => { setSelectedTokenId(token.id); playBeep(); }}
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    background: isSelected ? '#1a1a2e' : '#111',
                                    border: isSelected ? `2px solid ${token.color}` : '1px solid #333',
                                    padding: '15px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    color: 'white', cursor: 'pointer', textAlign: 'left',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{token.emoji}</span>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{token.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>OWNED: {owned}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem' }}>{token.price.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.7rem', color: isUp ? '#00ff00' : '#ff0055' }}>
                                        {isUp ? '▲' : '▼'} {Math.abs(((token.price - lastPrice) / lastPrice) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* TRADING VIEW */}
                <div style={{ flex: 2, minWidth: '300px', background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: selectedToken.color, fontSize: '2rem' }}>{selectedToken.name}</h2>
                        <h2 style={{ margin: 0 }}>{selectedToken.price.toFixed(2)}</h2>
                    </div>

                    {/* GRAPH */}
                    <div style={{ height: '200px', borderBottom: '1px solid #333', borderLeft: '1px solid #333', padding: '10px', marginBottom: '20px', background: `linear-gradient(to top, ${selectedToken.color}11, transparent)` }}>
                        <Graph data={selectedToken.history} color={selectedToken.color} hasInsider={hasInsider} trend={selectedToken.trend} />
                    </div>

                    {/* CONTROLS */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, padding: '20px', background: '#0a0a0a', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ color: '#888', marginBottom: '10px' }}>MY WALLET</div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{portfolio[selectedToken.id]} {selectedToken.id}</div>
                            <SquishyButton onClick={handleSell} style={{ width: '100%', background: '#ff0055', color: 'white' }}>
                                SELL (-1)
                            </SquishyButton>
                        </div>

                        <div style={{ flex: 1, padding: '20px', background: '#0a0a0a', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ color: '#888', marginBottom: '10px' }}>MARKET PRICE</div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{selectedToken.price.toFixed(2)}</div>
                            <SquishyButton onClick={handleBuy} style={{ width: '100%', background: '#00ffcc', color: 'black' }}>
                                BUY (+1)
                            </SquishyButton>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#555', textAlign: 'center' }}>
                        *Trading involves risk. You may lose all your fake internet money.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoExchange;
