import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { useRealBtc } from '../hooks/useRealBtc';

const CryptoExchange = () => {
    const { coins } = useGamification();
    const { btcPrice, priceChange24h, chartData, loading, lastUpdated } = useRealBtc();

    const isUp = priceChange24h >= 0;
    const color = isUp ? '#00ffcc' : '#ff0055';

    // SVG Graph
    const Graph = ({ data, strokeColor }) => {
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
                    <linearGradient id="btcGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,100 ${points} 100,100`} fill="url(#btcGrad)" stroke="none" />
                <polyline fill="none" stroke={strokeColor} strokeWidth="2.5" points={points} vectorEffect="non-scaling-stroke" />
            </svg>
        );
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh', background: '#0a0a12', color: 'white',
            fontFamily: '"Orbitron", monospace', paddingBottom: '100px',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* HEADER */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.2rem', color: '#00ffcc', fontWeight: 'bold' }}>◄ TERMINAL</Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#f7931a', textShadow: '0 0 12px rgba(247, 147, 26, 0.6)', letterSpacing: '2px' }}>
                        ₿ LIVE BITCOIN ORACLE
                    </h1>
                    <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffcc', display: 'inline-block', boxShadow: '0 0 6px #00ffcc' }}></span>
                        GLOBAL MAINFRAME FEED • REFRESH 30S
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1rem' }}>🪙 {coins.toFixed(0)} CP</div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                {/* TRADING VIEW */}
                <div style={{ width: '100%', maxWidth: '850px', background: 'linear-gradient(145deg, #13131f, #0b0b12)', borderRadius: '20px', padding: '35px', border: '1px solid #28283c', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>
                    
                    {loading && chartData.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#f7931a', padding: '100px', fontSize: '1.1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🛰️</div>
                            SYNCING GLOBAL BLOCKCHAIN NODES...
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f7931a, #ffb347)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '2rem', color: 'white', boxShadow: '0 0 20px rgba(247, 147, 26, 0.4)' }}>
                                            ₿
                                        </div>
                                        <div>
                                            <h2 style={{ margin: 0, color: 'white', fontSize: '2.2rem', fontWeight: '800' }}>Bitcoin</h2>
                                            <span style={{ color: '#888', fontSize: '1rem', letterSpacing: '1px' }}>BTC / USD • SPOT</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h2 style={{ margin: 0, fontSize: '2.6rem', color: 'white', fontWeight: '900', letterSpacing: '1px' }}>
                                        ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                    <div style={{ fontSize: '1.1rem', color: color, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                                        <span>{isUp ? '▲' : '▼'}</span>
                                        <span>{Math.abs(priceChange24h).toFixed(2)}% (24H)</span>
                                    </div>
                                </div>
                            </div>

                            {/* GRAPH */}
                            <div style={{ height: '300px', borderBottom: '1px solid #2d2d40', borderLeft: '1px solid #2d2d40', padding: '10px', background: `linear-gradient(to top, ${color}15, transparent)`, position: 'relative', borderRadius: '4px' }}>
                                <Graph data={chartData} strokeColor={color} />
                                <div style={{ position: 'absolute', bottom: '-26px', left: 4, color: '#666', fontSize: '0.75rem' }}>-24H</div>
                                <div style={{ position: 'absolute', bottom: '-26px', right: 4, color: '#666', fontSize: '0.75rem' }}>NOW</div>
                            </div>

                            {/* STATS STRIP */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginTop: '45px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#777', fontSize: '0.75rem' }}>24H HIGH EST.</div>
                                    <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '4px' }}>
                                        ${(Math.max(...(chartData.length ? chartData : [btcPrice]))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#777', fontSize: '0.75rem' }}>24H LOW EST.</div>
                                    <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '4px' }}>
                                        ${(Math.min(...(chartData.length ? chartData : [btcPrice]))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#777', fontSize: '0.75rem' }}>FEED SYNC</div>
                                    <div style={{ color: '#00ffcc', fontSize: '1rem', fontWeight: 'bold', marginTop: '4px' }}>
                                        {lastUpdated.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', padding: '16px', background: 'rgba(247, 147, 26, 0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(247, 147, 26, 0.25)' }}>
                                <div style={{ color: '#f7931a', fontSize: '0.85rem', fontWeight: 'bold' }}>⚡ REAL-TIME MULTI-ORACLE ACTIVE</div>
                                <p style={{ margin: '6px 0 0 0', color: '#999', fontSize: '0.75rem' }}>Aggregated live price across institutional gateways. 100% verified real market data.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CryptoExchange;
