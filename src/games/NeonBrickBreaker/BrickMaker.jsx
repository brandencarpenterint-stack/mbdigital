import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SquishyButton from '../../components/SquishyButton';
import useRetroSound from '../../hooks/useRetroSound';

const ROWS = 20;
const COLS = 10;
const COLORS = ['#ff0055', '#00ffaa', '#00ccff', '#ffff00', '#aa00ff', '#ffffff'];

const BrickMaker = () => {
    const navigate = useNavigate();
    const { playBeep, playWin } = useRetroSound();

    // Grid State: 2D array of { active: bool, color: string, type: string }
    const [grid, setGrid] = useState(() => {
        const saved = localStorage.getItem('merchboy_custom_brick');
        if (saved) return JSON.parse(saved);

        // Default Empty
        const g = [];
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push(null); // null = empty
            }
            g.push(row);
        }
        return g;
    });

    const [selectedTool, setSelectedTool] = useState({ type: 'normal', color: '#ff0055' }); // { type, color }
    // type: 'normal' | 'steel' | 'eraser'

    const handleCellClick = (r, c) => {
        const newGrid = [...grid];
        if (selectedTool.type === 'eraser') {
            newGrid[r][c] = null;
            playBeep();
        } else {
            newGrid[r][c] = {
                type: selectedTool.type,
                color: selectedTool.type === 'steel' ? '#aaa' : selectedTool.color
            };
            playBeep();
        }
        setGrid(newGrid);
    };

    const handleSave = () => {
        localStorage.setItem('merchboy_custom_brick', JSON.stringify(grid));
        playWin();
        alert("LEVEL SAVED! GO PLAY IT.");
    };

    const clearGrid = () => {
        const g = [];
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push(null);
            }
            g.push(row);
        }
        setGrid(g);
        playBeep();
    };

    const handlePlay = () => {
        handleSave();
        navigate('/arcade/brick?mode=custom');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#111',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: '"Press Start 2P", monospace'
        }}>
            <h1 style={{ color: 'var(--neon-green)', marginBottom: '20px', fontSize: '1.2rem' }}>LEVEL EDITOR 🛠️</h1>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* TOOLBAR */}
                <div style={{ background: '#222', padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>TOOLS</div>

                    {/* ERASER */}
                    <button onClick={() => setSelectedTool({ type: 'eraser' })} style={{
                        padding: '10px', background: selectedTool.type === 'eraser' ? 'red' : '#333', border: '1px solid #555', color: 'white', cursor: 'pointer'
                    }}>🗑️ ERASE</button>

                    {/* STEEL */}
                    <button onClick={() => setSelectedTool({ type: 'steel', color: '#aaa' })} style={{
                        padding: '10px', background: selectedTool.type === 'steel' ? '#888' : '#333', border: '1px solid #555', color: 'white', cursor: 'pointer'
                    }}>🛡️ STEEL</button>

                    <div style={{ height: '10px' }}></div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>BRICKS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                        {COLORS.map(c => (
                            <button key={c} onClick={() => setSelectedTool({ type: 'normal', color: c })} style={{
                                width: '40px', height: '40px', background: c,
                                border: (selectedTool.type === 'normal' && selectedTool.color === c) ? '3px solid white' : '1px solid #333',
                                cursor: 'pointer'
                            }} />
                        ))}
                    </div>
                </div>

                {/* GRID CANVAS */}
                <div style={{
                    border: '2px solid white',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLS}, 30px)`,
                    gridTemplateRows: `repeat(${ROWS}, 15px)`,
                    gap: '1px',
                    background: '#000',
                    padding: '2px'
                }}>
                    {grid.map((row, r) => (
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                onMouseDown={() => handleCellClick(r, c)}
                                onMouseEnter={(e) => { if (e.buttons === 1) handleCellClick(r, c); }}
                                style={{
                                    width: '30px',
                                    height: '15px',
                                    background: cell ? cell.color : '#1a1a1a',
                                    border: cell ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        ))
                    ))}
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <SquishyButton onClick={handleSave} style={{ background: 'var(--neon-blue)', fontSize: '0.8rem' }}>💾 SAVE</SquishyButton>
                    <SquishyButton onClick={handlePlay} style={{ background: 'var(--neon-green)', fontSize: '0.8rem' }}>▶️ TEST PLAY</SquishyButton>
                    <button onClick={clearGrid} style={{ padding: '10px', background: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer' }}>💥 CLEAR</button>
                    <Link to="/arcade/brick">
                        <button style={{ padding: '10px', width: '100%', background: 'transparent', color: '#888', border: '1px solid #555', cursor: 'pointer' }}>EXIT</button>
                    </Link>
                </div>

            </div>

            <div style={{ marginTop: '20px', color: '#666', fontSize: '0.7rem' }}>
                DRAW YOUR LEVEL. STEEL BRICKS ARE INDESTRUCTIBLE.
            </div>
        </div>
    );
};

export default BrickMaker;
