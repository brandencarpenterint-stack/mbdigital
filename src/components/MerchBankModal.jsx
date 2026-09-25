import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import useRetroSound from '../hooks/useRetroSound';
import SquishyButton from './SquishyButton';

const MerchBankModal = ({ onClose }) => {
    const { coins, addCoins } = useGamification() || {};
    const { playBeep, playWin, playCrash } = useRetroSound();
    
    const [stakedBalance, setStakedBalance] = useState(() => {
        return parseFloat(localStorage.getItem('merchbank_vault')) || 0;
    });
    
    const [amount, setAmount] = useState('');
    
    // Simulate Interest Generation (+0.5% every 10 seconds for arcade fun)
    useEffect(() => {
        const interval = setInterval(() => {
            if (stakedBalance > 0) {
                const interest = stakedBalance * 0.005; // 0.5%
                const newBalance = stakedBalance + interest;
                setStakedBalance(newBalance);
                localStorage.setItem('merchbank_vault', newBalance);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [stakedBalance]);

    const handleDeposit = () => {
        const val = parseInt(amount);
        if (isNaN(val) || val <= 0) return;
        
        if (coins >= val) {
            // addCoins usually adds, if we pass negative it should subtract in GamificationContext
            addCoins(-val);
            const newVault = stakedBalance + val;
            setStakedBalance(newVault);
            localStorage.setItem('merchbank_vault', newVault);
            setAmount('');
            playBeep();
        } else {
            playCrash();
            alert("INSUFFICIENT FUNDS.");
        }
    };

    const handleWithdraw = () => {
        if (stakedBalance > 0) {
            const val = Math.floor(stakedBalance);
            addCoins(val);
            setStakedBalance(0);
            localStorage.setItem('merchbank_vault', 0);
            playWin();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999999,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                        border: '2px solid #00ffcc',
                        borderRadius: '20px',
                        padding: '30px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 0 50px rgba(0, 255, 204, 0.2)',
                        color: 'white',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)'
                    }} />

                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '15px', right: '15px',
                            background: 'transparent', border: 'none', color: '#fff',
                            fontSize: '1.5rem', cursor: 'pointer', zIndex: 10
                        }}
                    >×</button>

                    <h2 style={{ margin: '0 0 5px 0', color: '#00ffcc', fontFamily: 'monospace', letterSpacing: '4px', fontSize: '2rem' }}>
                        M.BANK VAULT
                    </h2>
                    <p style={{ color: '#888', margin: '0 0 20px 0', fontSize: '0.9rem' }}>OFFSHORE DEGEN YIELD FARMING</p>

                    <div style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid #00ffcc',
                        padding: '20px',
                        borderRadius: '15px',
                        marginBottom: '25px',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '5px' }}>STAKED BALANCE</div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#00ffcc', textShadow: '0 0 20px #00ffcc', fontFamily: 'monospace' }}>
                            {Math.floor(stakedBalance).toLocaleString()} <span style={{fontSize: '1rem'}}>MCH</span>
                        </div>
                        <div style={{ color: '#00ffcc', fontSize: '0.8rem', marginTop: '10px' }}>
                            + {(stakedBalance * 0.005).toFixed(2)} COINS EVERY 10 SECONDS
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 5 }}>
                        <input 
                            type="number"
                            placeholder="AMOUNT TO DEPOSIT..."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{
                                flex: 1, padding: '15px', background: 'rgba(0,0,0,0.5)',
                                border: '1px solid #555', color: 'white', borderRadius: '8px',
                                outline: 'none', fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center'
                            }}
                        />
                        <button 
                            onClick={() => setAmount(coins.toString())}
                            style={{
                                background: '#333', color: '#fff', border: 'none', borderRadius: '8px',
                                padding: '0 15px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >MAX</button>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 5 }}>
                        <SquishyButton onClick={handleDeposit} style={{ flex: 1, padding: '15px', background: '#00ffcc', color: '#000', fontSize: '1.2rem' }}>
                            DEPOSIT
                        </SquishyButton>
                        <SquishyButton onClick={handleWithdraw} style={{ flex: 1, padding: '15px', background: '#ff0055', color: '#fff', fontSize: '1.2rem' }}>
                            WITHDRAW
                        </SquishyButton>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MerchBankModal;
