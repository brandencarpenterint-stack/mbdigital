import React from 'react';
import { motion } from 'framer-motion';
import './ArcadeCabinet.css';

const ArcadeCabinet = ({ game, highScore, zoneControl, onClick }) => {
    // Determine Faction Styles
    const owner = zoneControl?.owner || 'NEUTRAL';
    const points = zoneControl?.points || 0;

    let glowClass = 'glow-neutral';
    let factionColor = '#888';

    if (owner === 'CYBER') { glowClass = 'glow-cyber'; factionColor = '#00f260'; }
    if (owner === 'SOLAR') { glowClass = 'glow-solar'; factionColor = 'gold'; }
    if (owner === 'VOID') { glowClass = 'glow-void'; factionColor = '#b026ff'; }

    return (
        <div className="cabinet-container" onClick={onClick}>
            <div className={`cabinet`}>
                {/* 3D FACES */}
                <div className="cab-face cab-left"></div>
                <div className="cab-face cab-right"></div>
                <div className="cab-face cab-top"></div>
                <div className="cab-face cab-back"></div>

                {/* FRONT FACE (Main Content) */}
                <div className={`cab-face cab-front ${glowClass}`}>

                    {/* MARQUEE */}
                    <div className="cab-marquee" style={{ color: factionColor, backgroundColor: owner === 'NEUTRAL' ? '#111' : 'black' }}>
                        <div className="marquee-title">{game.title}</div>
                        {/* Flashing Light effect based on points? */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                            background: 'rgba(255,255,255,0.5)', boxShadow: `0 0 10px ${factionColor}`
                        }}></div>
                    </div>

                    {/* SCREEN */}
                    <div className="cab-screen-housing">
                        <div className="cab-screen" style={{ background: game.gradient }}>
                            <div className="cab-screen-content">
                                <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px black)' }}>
                                    {game.icon}
                                </div>
                                <div style={{
                                    background: 'rgba(0,0,0,0.6)',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    marginTop: '10px',
                                    color: 'white',
                                    textAlign: 'center',
                                    border: `1px solid ${factionColor}`
                                }}>
                                    <div style={{ fontSize: '0.6rem', color: '#aaa' }}>HIGH SCORE</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'lime' }}>{highScore}</div>
                                </div>

                                {/* FACTION STAMP */}
                                <div style={{
                                    marginTop: '10px',
                                    fontSize: '0.6rem',
                                    fontWeight: 'bold',
                                    color: factionColor,
                                    textShadow: '0 1px 2px black',
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {owner} CONTROL
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="cab-controls">
                        <div className="joystick" style={{ background: factionColor }}></div>
                        <div className="btn-group">
                            <div className="arcade-btn" style={{ background: 'red' }}></div>
                            <div className="arcade-btn" style={{ background: 'blue' }}></div>
                        </div>
                        <div style={{
                            width: '4px', height: '20px', background: '#333',
                            boxShadow: 'inset 0 0 5px black', border: '1px solid #555'
                        }}></div> {/* COIN SLOT */}
                    </div>

                </div>
            </div>

            {/* REFLECTION / SHADOW */}
            <div style={{
                position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
                width: '200px', height: '20px', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%)',
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default ArcadeCabinet;
