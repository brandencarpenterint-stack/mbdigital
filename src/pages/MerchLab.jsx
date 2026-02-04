import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SquishyButton from '../components/SquishyButton';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import useRetroSound from '../hooks/useRetroSound';
import html2canvas from 'html2canvas';

// TEMPLATE CONFIG
const TEMPLATES = [
    { id: 'tee', name: 'T-SHIRT', src: '/assets/merch_templates.png', x: 0, y: 0, w: 128, h: 128, scale: 3 },
    { id: 'hoodie', name: 'HOODIE', src: '/assets/merch_templates.png', x: 128, y: 0, w: 128, h: 128, scale: 3 },
    { id: 'cap', name: 'CAP', src: '/assets/merch_templates.png', x: 256, y: 0, w: 128, h: 128, scale: 3 },
];

const COLORS = ['#FFFFFF', '#000000', '#FF0055', '#00CCFF', '#FFFF00', '#333333'];

const MerchLab = () => {
    const { dailyState, shopState, launchDrop, activeDrops, hasUpgrade } = useGamification();
    const { showToast } = useToast();
    const { playClick, playWin } = useRetroSound();

    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [baseColor, setBaseColor] = useState('#FFFFFF');
    const [layers, setLayers] = useState([]); // { id, type: 'sticker'|'text', content, x, y, scale, rotation }
    const [selectedLayerId, setSelectedLayerId] = useState(null);

    const canvasRef = useRef(null);

    // Available Assets (Unlocked Achievements + Standard)
    const stickers = [
        ...['👾', '🔥', '💎', '💀', '👽', '🍕', '🕹️', '🚀', '❤️', '⚡'],
        ...(dailyState?.achievements?.filter(a => a.unlocked).map(a => a.icon) || [])
    ];

    const addLayer = (content, type = 'sticker') => {
        playClick();
        const newLayer = {
            id: Date.now(),
            type,
            content,
            x: 150, // Center-ish
            y: 150,
            scale: 1,
            rotation: 0,
            color: '#000000' // Text color
        };
        setLayers([...layers, newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    const updateLayer = (id, updates) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const removeLayer = (id) => {
        setLayers(prev => prev.filter(l => l.id !== id));
        setSelectedLayerId(null);
    };

    const handleLaunch = async () => {
        playWin();
        // we can still calc canvas for thumbnail if we want, but logic first
        launchDrop({
            name: `${selectedTemplate.name} ${Date.now().toString().slice(-4)}`,
            color: baseColor
        });
        showToast("DROP LAUNCHED! CHECK REVENUE.", "success");
    };

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #111, #222)',
            color: 'white',
            fontFamily: '"Press Start 2P", monospace',
            paddingBottom: '100px',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* HEADER */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', opacity: 0.8, color: 'white' }}>⬅</Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--neon-green)', textShadow: '0 0 10px var(--neon-green)' }}>MERCH LAB 🧪</h1>
                    <div style={{ fontSize: '0.6rem', color: '#666' }}>CUSTOM GEAR FABRICATOR</div>
                </div>
                <div style={{ width: '30px' }}></div>
            </div>

            <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 80px)', overflow: 'hidden' }}>

                {/* LEFT: TOOLS */}
                <div style={{ width: '250px', background: '#181818', borderRight: '1px solid #333', overflowY: 'auto', padding: '15px' }}>

                    {/* 1. Garment */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '10px' }}>BASE ITEM</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {TEMPLATES.map(t => (
                                <button key={t.id} onClick={() => setSelectedTemplate(t)} style={{
                                    flex: 1, padding: '10px', background: selectedTemplate.id === t.id ? 'var(--neon-blue)' : '#333',
                                    border: 'none', color: selectedTemplate.id === t.id ? 'black' : 'white', cursor: 'pointer', fontSize: '0.6rem'
                                }}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Color */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '10px' }}>DYE COLOR</div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {COLORS.map(c => (
                                <button key={c} onClick={() => setBaseColor(c)} style={{
                                    width: '30px', height: '30px', background: c, border: baseColor === c ? '2px solid white' : '1px solid #555', cursor: 'pointer'
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* 3. Assets */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '10px' }}>STICKERS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                            {stickers.map((s, i) => (
                                <button key={i} onClick={() => addLayer(s, 'sticker')} style={{
                                    width: '40px', height: '40px', background: '#222', border: '1px solid #444', fontSize: '1.5rem', cursor: 'pointer'
                                }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Text */}
                    <div style={{ marginBottom: '20px' }}>
                        <button onClick={() => addLayer("MERCHBOY", "text")} style={{
                            width: '100%', padding: '10px', background: '#333', color: 'white', border: '1px dashed #555', cursor: 'pointer', fontSize: '0.7rem'
                        }}>
                            + ADD TEXT
                        </button>
                    </div>

                </div>

                {/* CENTER: CANVAS */}
                <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

                    {/* PATTERN BG */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* RENDER AREA */}
                    <div
                        ref={canvasRef}
                        style={{
                            width: '400px', height: '400px',
                            position: 'relative',
                            background: 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        {/* GARMENT BASE */}
                        <div style={{
                            width: '384px', height: '384px',
                            backgroundColor: baseColor,
                            maskImage: `url('${selectedTemplate.src}')`,
                            maskPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                            maskSize: `${384 * 3}px ${128 * 3}px`, // Scaled up sprite sheet logic (128*3 = 384)
                            WebkitMaskImage: `url('${selectedTemplate.src}')`,
                            WebkitMaskPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                            WebkitMaskSize: `${384 * 3}px ${128 * 3}px`, // CSS Sprite logic for Mask is tricky, usually requires separate images or specific div sizing.
                            // Falling back to standard image filter/tint if mask fails or using precise sprite div.
                        }} />

                        {/* 
                           Wait, css masking a sprite sheet is hard. 
                           Let's simplify: Use the sprite as an image with 'glab-composite-source-in' or mix-blend-mode.
                           Actually, standard pixel art scaling:
                        */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            pointerEvents: 'none'
                        }}>
                            {/* TINT LAYER (Multiply) */}
                            <div style={{
                                width: '100%', height: '100%',
                                backgroundImage: `url('${selectedTemplate.src}')`,
                                backgroundPosition: `-${selectedTemplate.x * selectedTemplate.scale}px -${selectedTemplate.y * selectedTemplate.scale}px`,
                                backgroundSize: '300% 100%', // 3 cols
                                imageRendering: 'pixelated',
                                mixBlendMode: 'multiply', // This might not work well on black bg.
                                opacity: 0 // Spacer
                            }} />
                        </div>

                        {/* BETTER APPROACH: DRAW SVG OR IMAGE FILTER */}
                        <div style={{
                            position: 'absolute',
                            width: '384px', height: '384px',
                            backgroundImage: `url('${selectedTemplate.src}')`,
                            backgroundPosition: `${-(selectedTemplate.id === 'tee' ? 0 : selectedTemplate.id === 'hoodie' ? 1 : 2) * 100}% 0`,
                            backgroundSize: '300% 100%',
                            imageRendering: 'pixelated',
                            filter: `drop-shadow(0 0 0 ${baseColor})`, // This floods the shape with color if image is transparent
                            // The image is white with transparency. drop-shadow moves color.
                            // Actually, let's just use CSS filter to colorize.
                            // SVG would be better but we have PNG.
                            // Let's rely on simple layering:
                            // 1. Coloured Block
                            // 2. Masked by Image
                        }}>
                        </div>

                        {/* RE-DO BASE LOGIC: Masking container */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            maskImage: `url('${selectedTemplate.src}')`,
                            maskSize: '300% 100%',
                            maskPosition: `${(selectedTemplate.id === 'tee' ? 0 : selectedTemplate.id === 'hoodie' ? 50 : 100)}% 0`,
                            WebkitMaskImage: `url('${selectedTemplate.src}')`,
                            WebkitMaskSize: '300% 100%',
                            WebkitMaskPosition: `${(selectedTemplate.id === 'tee' ? 0 : selectedTemplate.id === 'hoodie' ? 50 : 100)}% 0`,
                            background: baseColor,
                            zIndex: 1
                        }}>
                            {/* LAYERS GO INSIDE THE MASK SO THEY CLIP TO SHIRT */}
                            {layers.map(layer => (
                                <LayerComponent
                                    key={layer.id}
                                    layer={layer}
                                    isSelected={selectedLayerId === layer.id}
                                    onSelect={() => setSelectedLayerId(layer.id)}
                                    onChange={(u) => updateLayer(layer.id, u)}
                                />
                            ))}
                        </div>

                        {/* SHADING/OUTLINE OVERLAY (Multiply/Overlay) */}
                        {/* Since our png is white flat, we might need a separate outline file or just use filter drop-shadow for outline? */}
                        {/* Let's skip complex shading. The mask provides the shape. */}

                    </div>
                </div>

                {/* RIGHT: PROPERTIES */}
                <div style={{ width: '250px', background: '#181818', borderLeft: '1px solid #333', padding: '15px' }}>

                    {selectedLayerId ? (
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '10px' }}>LAYER PROPERTIES</div>

                            {/* Position Controls */}
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                <button onClick={() => updateLayer(selectedLayerId, { scale: layers.find(l => l.id === selectedLayerId).scale + 0.1 })} style={btnStyle}>➕ SIZE</button>
                                <button onClick={() => updateLayer(selectedLayerId, { scale: Math.max(0.1, layers.find(l => l.id === selectedLayerId).scale - 0.1) })} style={btnStyle}>➖ SIZE</button>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                <button onClick={() => updateLayer(selectedLayerId, { rotation: layers.find(l => l.id === selectedLayerId).rotation + 15 })} style={btnStyle}>↩️ ROTATE</button>
                                <button onClick={() => updateLayer(selectedLayerId, { rotation: layers.find(l => l.id === selectedLayerId).rotation - 15 })} style={btnStyle}>↪️ ROTATE</button>
                            </div>

                            {/* Color (If Text) */}
                            {layers.find(l => l.id === selectedLayerId)?.type === 'text' && (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '0.6rem', marginBottom: '5px' }}>TEXT COLOR</div>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {COLORS.map(c => (
                                            <button key={c} onClick={() => updateLayer(selectedLayerId, { color: c })} style={{
                                                width: '20px', height: '20px', background: c, border: '1px solid #555'
                                            }} />
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={layers.find(l => l.id === selectedLayerId).content}
                                        onChange={(e) => updateLayer(selectedLayerId, { content: e.target.value })}
                                        style={{ width: '100%', marginTop: '5px', background: '#333', border: '1px solid #555', color: 'white', padding: '5px' }}
                                    />
                                </div>
                            )}

                            <button onClick={() => removeLayer(selectedLayerId)} style={{ ...btnStyle, background: 'red', color: 'white', marginTop: '20px' }}>
                                🗑️ DELETE LAYER
                            </button>
                        </div>
                    ) : (
                        <div style={{ color: '#555', fontSize: '0.7rem', textAlign: 'center', marginTop: '50px' }}>
                            SELECT AN OBJECT ON CANVAS TO EDIT
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <SquishyButton onClick={handleLaunch} style={{ width: '100%' }}>
                            🚀 LAUNCH DROP
                        </SquishyButton>
                    </div>

                    {/* ACTIVE DROPS MINI-LIST */}
                    {activeDrops?.length > 0 && (
                        <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>ACTIVE DROPS</span>
                                <span style={{ color: 'var(--neon-green)' }}>{activeDrops.filter(d => d.active).length} LIVE</span>
                            </div>
                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {activeDrops.slice().reverse().map(drop => (
                                    <div key={drop.id} style={{
                                        background: '#222', padding: '10px', marginBottom: '5px', borderRadius: '4px',
                                        borderLeft: drop.active ? '2px solid var(--neon-green)' : '2px solid #555'
                                    }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{drop.name}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#aaa', marginTop: '5px' }}>
                                            <span>STOCK: {Math.max(0, drop.stock - drop.sold)}/{drop.stock}</span>
                                            <span style={{ color: '#ffd700' }}>+{drop.revenue.toLocaleString()} CP</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ width: '100%', height: '3px', background: '#333', marginTop: '5px' }}>
                                            <div style={{
                                                width: `${(drop.sold / drop.stock) * 100}%`,
                                                height: '100%',
                                                background: drop.active ? 'var(--neon-green)' : '#555'
                                            }} />
                                        </div>
                                        {hasUpgrade && hasUpgrade('hack_tax') && drop.active && (
                                            <div style={{ fontSize: '0.5rem', color: '#00ffcc', marginTop: '2px', textAlign: 'right' }}>
                                                🏝️ OFFSHORE BONUS ACTIVE
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const LayerComponent = ({ layer, isSelected, onSelect, onChange }) => {
    // Draggable logic simplified: click to select, basic buttons to move? 
    // Or use simple absolute positioning plus mouse events for drag (complex to impl in one file).
    // Let's Stick to "Select -> Use Buttons" for V1 reliability, or simple drag.

    // Let's implement simple Drag.
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e) => {
        onSelect();
        setIsDragging(true);
        e.stopPropagation();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                // Determine delta. Ideally we need ref to container.
                // Hack: use movementX/Y
                onChange({
                    x: layer.x + e.movementX,
                    y: layer.y + e.movementY
                });
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, layer.x, layer.y]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                top: layer.y, left: layer.x,
                transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                border: isSelected ? '2px dashed cyan' : 'none',
                padding: '5px',
                userSelect: 'none',
                fontSize: '2rem',
                color: layer.color
            }}
        >
            {layer.type === 'text' ? (
                <span style={{ fontFamily: 'Impact, sans-serif', textTransform: 'uppercase' }}>{layer.content}</span>
            ) : (
                <span>{layer.content}</span>
            )}
        </div>
    );
};

const btnStyle = {
    flex: 1, padding: '5px', background: '#333', border: '1px solid #555',
    color: '#ccc', cursor: 'pointer', fontSize: '0.6rem'
};

export default MerchLab;
