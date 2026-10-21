import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsOfService = () => {
    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '30px 20px 100px 20px',
            color: '#e2e8f0',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.7'
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 136, 0, 0.05))',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <Link to="/arcade" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffd700',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    }}>
                        ← RETURN TO ARCADE
                    </Link>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>LEGAL & COMPLIANCE</span>
                </div>

                <h1 style={{
                    margin: '0 0 10px 0',
                    fontFamily: '"Orbitron", sans-serif',
                    color: '#fff',
                    fontSize: '2rem',
                    letterSpacing: '1px'
                }}>
                    TERMS OF SERVICE
                </h1>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Platform: <strong>MBDigital World</strong> (www.mbdigital.world) | Effective Date: October 2026
                </p>
            </motion.div>

            {/* Content Sections */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '35px',
                backdropFilter: 'blur(12px)'
            }}>
                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By visiting, accessing, or playing games on <strong>MBDigital</strong> (<a href="https://www.mbdigital.world" style={{ color: '#ffd700' }}>www.mbdigital.world</a>), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the platform immediately.
                    </p>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        2. Entertainment Only — No Real-Money Gambling
                    </h2>
                    <div style={{
                        background: 'rgba(255, 215, 0, 0.08)',
                        borderLeft: '4px solid #ffd700',
                        padding: '16px',
                        borderRadius: '0 12px 12px 0',
                        marginBottom: '16px'
                    }}>
                        <strong>CRITICAL NOTICE:</strong> All arcade titles, simulation games, and casino-themed experiences (including but not limited to Cyber Crash, Cyber Blackjack, Cyber Roulette, Cosmic Slots, Cyber Hi-Lo, Cyber Mines, Cyber Scratchers, and Cyber Coin Dozer) are strictly for <strong>entertainment and amusement purposes only</strong>.
                    </div>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li><strong>Zero Cash Value:</strong> In-game currency denoted as "Cyber Points", "Coins", or "CP" has no monetary value in the real world.</li>
                        <li><strong>Non-Redeemable:</strong> Cyber Points cannot be withdrawn, refunded, cashed out, or exchanged for fiat currency, cryptocurrency, or real-world goods.</li>
                        <li><strong>No Real Wagers:</strong> At no point can real-world funds be wagered or won on this platform.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        3. User Conduct & Fair Play
                    </h2>
                    <p>
                        Users agree to enjoy the platform fairly and ethically. You agree not to:
                    </p>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li>Deploy automated scripts, bots, spiders, or malicious code to manipulate gameplay, game scores, or leaderboard rankings.</li>
                        <li>Attempt to bypass security features, reverse engineer platform source code, or launch denial-of-service (DoS) attacks.</li>
                        <li>Harass, impersonate, or broadcast offensive content through chat, profile handles, or community features.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        4. Intellectual Property
                    </h2>
                    <p>
                        All original graphics, character skins, brand artwork, audio soundscapes, UI designs, and custom software code on MBDigital are protected by copyright, trademark, and intellectual property laws. All rights are reserved by MBDigital and its creators.
                    </p>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        5. Disclaimer of Warranties & Limitation of Liability
                    </h2>
                    <p>
                        The platform and all games are provided on an "as is" and "as available" basis without warranties of any kind. MBDigital does not warrant uninterrupted, error-free, or virus-free operation. In no event shall MBDigital, its operators, or affiliates be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
                    </p>
                </section>

                <section style={{ marginBottom: '10px' }}>
                    <h2 style={{ color: '#ffd700', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        6. Inquiries & Legal Contact
                    </h2>
                    <p>
                        For questions regarding these Terms of Service or commercial licensing inquiries, please contact:
                    </p>
                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: 'monospace',
                        color: '#ffd700'
                    }}>
                        Email: legal@mbdigital.world | Domain: www.mbdigital.world
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
