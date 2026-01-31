import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { feedService } from '../utils/feed';

const LiveFeed = () => {
    const [messages, setMessages] = useState([
        { id: 1, user: 'System', text: 'Connecting to Global Feed...', time: 'Now', color: '#ffaaaa' }
    ]);

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
                    // Deduplicate if we just added it locally (based on time or ID?)
                    // For now, allow dupes or rely on React key?
                    // Supabase sends ID. Local uses Date.now().
                    // We'll rely on the fact that local events are instant feedback.

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
                } catch (e) { console.error('SOL fetch error', e); }

                // 2. Fetch BTC Balance
                let btcAmount = 0;
                try {
                    // Using blockchain.info plain text API (returns satoshis)
                    const btcResp = await fetch('https://blockchain.info/q/addressbalance/bc1q6dn4yaswgw9gja7pgfnakcf93r74svj5qk82qj');
                    const btcSats = await btcResp.text();
                    btcAmount = parseInt(btcSats) / 100000000;
                } catch (e) { console.error('BTC fetch error', e); }

                // 3. Fetch Prices (Coinbase)
                let solPrice = 0;
                let btcPrice = 0;
                try {
                    const [pSol, pBtc] = await Promise.all([
                        fetch('https://api.coinbase.com/v2/prices/SOL-USD/spot').then(r => r.json()),
                        fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot').then(r => r.json())
                    ]);
                    solPrice = parseFloat(pSol.data.amount);
                    btcPrice = parseFloat(pBtc.data.amount);
                } catch (e) { console.error('Price fetch error', e); }

                // 4. Calculate Total
                const total = (solAmount * solPrice) + (btcAmount * btcPrice);
                // Format Currency
                setTreasuryUSD(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total));

            } catch (e) {
                console.error("Treasury update failed", e);
            }
        };

        fetchTreasury();
        const interval = setInterval(fetchTreasury, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '800px', margin: '0 auto 20px auto',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #333',
            height: '120px', overflow: 'hidden',
            position: 'relative'
        }}>
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
                position: 'absolute', top: 5, right: 10,
                fontSize: '0.7rem', color: 'var(--neon-green)',
                display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                <div style={{ width: 6, height: 6, background: 'var(--neon-green)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                LIVE GLOBAL FEED
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
