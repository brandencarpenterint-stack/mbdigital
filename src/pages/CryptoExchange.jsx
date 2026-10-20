import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';

const CryptoExchange = () => {
    const { coins } = useGamification();

    const [btcData, setBtcData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBtc = async () => {
            try {
                // Fetch 1 day historical chart
                const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');
                const data = await res.json();
                
                if (data.prices) {
                    const prices = data.prices.map(p => p[1]);
                    setBtcData(prices);
                    
                    const current = prices[prices.length - 1];
                    const first = prices[0];
                    setCurrentPrice(current);
                    setPriceChange(((current - first) / first) * 100);
                }
            } catch (e) {
                console.error("Failed to fetch BTC", e);
            }
            setLoading(false);
        };
        
        fetchBtc();
        const interval = setInterval(fetchBtc, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // SVG Graph
    const Graph = ({ data, color }) => {
        if (!data || data.length === 0) return null;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 100;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height; // Invert Y
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id={`grad-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 100} ${points.replace(/,/g, ' ')} L 100,100 Z`} fill={`url(#grad-${color.replace('#','')})`} stroke="none" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
            </svg>
        );
    };

    const isUp = priceChange >= 0;
    const color = isUp ? '#00ff00' : '#ff0055';

    return (
        <div className="page-enter" style={{
            minHeight: '100vh', background: '#0a0a12', color: 'white',
            fontFamily: '"Orbitron", monospace', paddingBottom: '100px',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* HEADER */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8, color: 'white' }}>◄</Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#f7931a', textShadow: '0 0 10px #f7931a' }}>BITCOIN TRACKER</h1>
                    <div style={{ fontSize: '0.6rem', color: '#666' }}>LIVE MAINFRAME FEED</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffcc00', fontWeight: 'bold' }}>{coins.toFixed(0)} CP</div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', justifyContent: 'center' }}>
                {/* TRADING VIEW */}
                <div style={{ flex: 1, maxWidth: '800px', background: '#111', borderRadius: '12px', padding: '40px', border: '1px solid #333', boxShadow: '0 10px 50px rgba(0,0,0,0.5)' }}>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#f7931a', padding: '100px' }}>ESTABLISHING SATELLITE LINK...</div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f7931a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>₿</div>
                                        <h2 style={{ margin: 0, color: 'white', fontSize: '2.5rem' }}>Bitcoin</h2>
                                        <span style={{ color: '#888', fontSize: '1.2rem' }}>BTC</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h2 style={{ margin: 0, fontSize: '3rem', color: 'white' }}>${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                    <div style={{ fontSize: '1.2rem', color: color, fontWeight: 'bold' }}>
                                        {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}% (24H)
                                    </div>
                                </div>
                            </div>

                            {/* GRAPH */}
                            <div style={{ height: '300px', borderBottom: '1px solid #333', borderLeft: '1px solid #333', padding: '10px', background: `linear-gradient(to top, ${color}11, transparent)`, position: 'relative' }}>
                                <Graph data={btcData} color={color} />
                                <div style={{ position: 'absolute', bottom: '-25px', left: 0, color: '#666', fontSize: '0.8rem' }}>24 Hours Ago</div>
                                <div style={{ position: 'absolute', bottom: '-25px', right: 0, color: '#666', fontSize: '0.8rem' }}>Now</div>
                            </div>

                            <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#f7931a' }}>NETWORK STATUS</h3>
                                <p style={{ margin: 0, color: '#aaa' }}>Live feed provided by CoinGecko Global Oracle. Updates automatically every 60 seconds.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CryptoExchange;
