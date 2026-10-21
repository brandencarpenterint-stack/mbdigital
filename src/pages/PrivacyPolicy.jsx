import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 114, 255, 0.05))',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
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
                        color: '#00f0ff',
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
                    PRIVACY POLICY
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
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        1. Introduction & Overview
                    </h2>
                    <p>
                        Welcome to <strong>MBDigital</strong> ("we", "us", or "our"), accessible at <a href="https://www.mbdigital.world" style={{ color: '#00f0ff' }}>www.mbdigital.world</a>. We respect your privacy and are committed to protecting any information associated with your use of our cyberpunk gaming platform, web applications, and services.
                    </p>
                    <p>
                        This Privacy Policy outlines how data is handled, the role of cookies, our advertising partners, and your rights under global privacy frameworks including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
                    </p>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        2. Information We Collect
                    </h2>
                    <p>
                        MBDigital is built with user privacy at its foundation. We collect minimal information strictly required to deliver responsive arcade gameplay:
                    </p>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li><strong>Gameplay & State Data:</strong> High scores, game statistics, quest progress, companion levels (PocketBro), unlocked skins, and in-game Cyber Points (CP) balances stored locally in your browser's <code>localStorage</code> or synchronized anonymously with our Supabase database.</li>
                        <li><strong>Anonymous Device Telemetry:</strong> Browser type, operating system, screen resolution, referral URLs, and access timestamps collected automatically via standard web server logs.</li>
                        <li><strong>No Sensitive Financial Information:</strong> MBDigital does not collect credit cards, banking info, or government identifiers. All in-game currency (CP) is strictly virtual entertainment points with zero cash value.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        3. Cookies & Advertising Partners
                    </h2>
                    <p>
                        We partner with authorized third-party ad networks (such as Google AdSense, GameDistribution, and dedicated video networks) to serve advertisements when you visit our website.
                    </p>
                    <p>
                        Third-party vendors, including Google, use cookies to serve ads based on prior visits to this website or other websites on the Internet:
                    </p>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to MBDigital and/or other sites on the Internet.</li>
                        <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f0ff' }}>Google Ads Settings</a>.</li>
                        <li>Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f0ff' }}>aboutads.info</a>.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        4. GDPR & CCPA Compliance
                    </h2>
                    <p>
                        <strong>For European Economic Area (EEA) Users (GDPR):</strong> You have the right to access, rectify, or request the erasure of any personal data we hold. Since gameplay data is primarily stored within your browser's Local Storage, you can reset or delete all stored data at any time by clearing your browser cache.
                    </p>
                    <p>
                        <strong>For California Residents (CCPA):</strong> MBDigital does not sell personal information to third parties. You have the right to request information regarding data categories collected, and the right to request deletion of personal information without discrimination.
                    </p>
                </section>

                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        5. Children's Information (COPPA)
                    </h2>
                    <p>
                        Protecting children's privacy online is paramount. MBDigital does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided this information on our website, please contact us immediately, and we will promptly remove such records.
                    </p>
                </section>

                <section style={{ marginBottom: '10px' }}>
                    <h2 style={{ color: '#00f0ff', fontFamily: '"Orbitron", sans-serif', fontSize: '1.25rem' }}>
                        6. Contact Us
                    </h2>
                    <p>
                        If you have questions, feedback, or legal inquiries concerning this Privacy Policy, reach out to us at:
                    </p>
                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: 'monospace',
                        color: '#00ffcc'
                    }}>
                        Email: contact@mbdigital.world | Domain: www.mbdigital.world
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
