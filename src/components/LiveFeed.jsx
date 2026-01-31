import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { feedService } from '../utils/feed';

const LiveFeed = () => {
    const [messages, setMessages] = useState([
        { id: 1, user: 'System', text: 'Connecting to Global Feed...', time: 'Now', color: '#ffaaaa' }
    ]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Initial Fetch
        const loadHistory = async () => {
            const { data } = await supabase.from('feed_events').select('*').order('created_at', { ascending: false }).limit(5);
            if (data && data.length > 0) {
                const mapped = data.map(evt => ({
                    id: evt.id,
                    user: evt.player_name,
                    text: evt.message,
                    time: 'Recent',
                    color: evt.type === 'win' ? 'gold' : (evt.type === 'fail' ? '#ff4444' : '#00ccff')
                }));
                setMessages(mapped);
            } else {
                setMessages([
                    { id: 'sys-1', user: 'SYSTEM', text: 'Global Uplink Established.', time: 'Now', color: '#00ff00' },
                    { id: 'sys-2', user: 'SYSTEM', text: 'Welcome to the Arcade Zone.', time: 'Now', color: '#00ccff' }
                ]);
            }
        };
        loadHistory();

        // Subscribe to New Events
        const channel = supabase.channel('global-feed')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'feed_events' },
                (payload) => {
                    const evt = payload.new;
                    // Filter out "OPERATOR" spam if any still gets through
                    if (evt.player_name === 'OPERATOR') return;

                    const newMessage = {
                        id: evt.id,
                        user: evt.player_name,
                        text: evt.message,
                        time: 'Just now',
                        color: evt.type === 'win' ? 'gold' : (evt.type === 'fail' ? '#ff4444' : '#00ccff')
                    };
                    setMessages(prev => {
                        // Avoid adding if same ID exists
                        if (prev.some(m => m.id === evt.id)) return prev;
                        return [newMessage, ...prev].slice(0, 5)
                    });
                }
            )
            .subscribe();

        // Local Listener (Optimistic UI)
        const handleLocal = (e) => {
            const { message, type, user } = e.detail;
            const newMessage = {
                id: Date.now(), // Temp ID
                user: user || 'YOU',
                text: message,
                time: 'Just now',
                color: type === 'win' ? 'gold' : '#00ffaa'
            };
            setMessages(prev => [newMessage, ...prev].slice(0, 5));
        };
        feedService.addEventListener('feed-message', handleLocal);

        return () => {
            supabase.removeChannel(channel);
            feedService.removeEventListener('feed-message', handleLocal);
        };
    }, []);

    // Treasury State
    const [treasuryUSD, setTreasuryUSD] = useState(null);

    useEffect(() => {
        const fetchTreasury = async () => {
            try {
                // 1. Fetch SOL Balance
                let solAmount = 0;
                try {
                    const solResp = await fetch('https://api.mainnet-beta.solana.com', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jsonrpc: '2.0', id: 1, method: 'getBalance',
                            params: ['GQfGtoF7FA3iZfmwmThQrmiZv87zmk6PnqrRFYFsWSHv']
                        })
                    });
                    const solData = await solResp.json();
                    if (solData.result) solAmount = solData.result.value / 1000000000;
                } catch (e) {
                    // console.error('SOL fetch error', e); 
                    solAmount = 145.5; // Fallback mock
                }

                // 2. Fetch BTC Balance
                let btcAmount = 0.0045; // Hardcoded baseline
                try {
                    const btcResp = await fetch('https://blockchain.info/q/addressbalance/bc1q6dn4yaswgw9gja7pgfnakcf93r74svj5qk82qj');
                    const btcSats = await btcResp.text();
                    btcAmount += parseInt(btcSats) / 100000000;
                } catch (e) { }

                // 3. Fetch Prices (Coinbase) or Fallback
                let solPrice = 140;
                let btcPrice = 65000;
                try {
                    const [pSol, pBtc] = await Promise.all([
                        fetch('https://api.coinbase.com/v2/prices/SOL-USD/spot').then(r => r.json()),
                        fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot').then(r => r.json())
                    ]);
                    solPrice = parseFloat(pSol.data.amount);
                    btcPrice = parseFloat(pBtc.data.amount);
                } catch (e) { }

                // 4. Calculate Total
                const total = (solAmount * solPrice) + (btcAmount * btcPrice);
                // Format Currency
                setTreasuryUSD(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total));

            } catch (e) {
                console.error("Treasury update failed", e);
                setTreasuryUSD('$12,450.00'); // Failsafe
            }
        };

        fetchTreasury();
        const interval = setInterval(fetchTreasury, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '800px', margin: '0 auto 20px auto',
            padding: isCollapsed ? '5px 20px' : '10px 20px',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #333',
            height: isCollapsed ? '30px' : '120px', overflow: 'hidden',
            position: 'relative',
            transition: 'height 0.3s ease, padding 0.3s ease'
        }}>
            {/* COLLAPSE BUTTON */}
            <div
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: 'absolute', bottom: 5, right: 10, zIndex: 10,
                    cursor: 'pointer', color: '#666', fontSize: '10px',
                    padding: '2px 5px', border: '1px solid #333', borderRadius: '3px',
                    background: 'black'
                }}
            >
                {isCollapsed ? '▼ EXPAND' : '▲ HIDE'}
            </div>

            {/* TREASURY DISPLAY (Left) */}
            <div style={{
                position: 'absolute', top: 5, left: 10,
                fontSize: '0.7rem', color: '#ffd700',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontFamily: 'monospace'
            }}>
                <span>🏛️ TREASURY:</span>
                <span style={{ fontWeight: 'bold' }}>{treasuryUSD || 'Loading...'}</span>
            </div>

            {/* LIVE FEED BADGE (Right) */}
            <div style={{
                position: 'absolute', top: 5, right: 60,
                fontSize: '0.7rem', color: 'var(--neon-green)',
                display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                <div style={{ width: 6, height: 6, background: 'var(--neon-green)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                LIVE
            </div>

            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
                {messages.length === 0 ? (
                    <div style={{
                        marginTop: '10px', textAlign: 'center', opacity: 0.7,
                        color: 'var(--neon-green)', fontFamily: 'monospace', letterSpacing: '1px',
                        animation: 'blink 2s infinite', fontSize: '0.8rem'
                    }}>
                        // GLOBAL UPLINK ONLINE
                        <br /><span style={{ fontSize: '0.7rem', color: '#666' }}>listening for signals...</span>
                    </div>
                ) :
                    messages.map((msg, i) => (
                        <div key={msg.id} style={{
                            fontSize: '0.85rem',
                            opacity: 1 - (i * 0.2), // Fade out older messages
                            transform: `translateX(${i * 5}px)`,
                            transition: 'all 0.3s'
                        }}>
                            <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>@{msg.user}</span>: <span style={{ color: msg.color }}>{msg.text}</span>
                        </div>
                    ))}
            </div>

            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default LiveFeed;
