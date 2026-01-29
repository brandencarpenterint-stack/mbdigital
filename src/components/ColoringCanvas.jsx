import React, { useRef, useState, useEffect } from 'react';
import SquishyButton from './SquishyButton';
import { smartFloodFill } from '../utils/drawingUtils';

const COLORS = [
    '#ff0055', '#00ffaa', '#ffff00', '#00ccff', '#ff9900', '#cc00ff', '#ffffff', '#000000'
];

const STICKERS = [
    { type: 'emoji', content: '⭐' },
    { type: 'emoji', content: '🚀' },
    { type: 'emoji', content: '🌈' },
    { type: 'emoji', content: '🐱' },
    { type: 'emoji', content: '🍕' },
    { type: 'emoji', content: '👕' },
    { type: 'emoji', content: '🧢' },
    { type: 'emoji', content: '👟' },
    { type: 'emoji', content: '🕶️' },
    { type: 'image', content: '/assets/boy-logo.png' },
    { type: 'image', content: '/assets/brokid-logo.png' }
];

const ColoringCanvas = ({ templateImage, onComplete }) => {
    const canvasContainerRef = useRef(null);
    const lineCanvasRef = useRef(null);
    const colorCanvasRef = useRef(null);

    // Tools: 'pencil', 'bucket', 'eraser', 'sticker'
    const [tool, setTool] = useState('bucket');
    const [color, setColor] = useState('#ff0055');
    const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
    const [brushSize, setBrushSize] = useState(10);
    const [isDrawing, setIsDrawing] = useState(false);

    // Initialize Canvases
    useEffect(() => {
        if (!templateImage) return;

        const lineCanvas = lineCanvasRef.current;
        const colorCanvas = colorCanvasRef.current;
        const lineCtx = lineCanvas.getContext('2d');
        const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });

        const img = new Image();
        img.src = templateImage;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            // Set dimensions
            const container = canvasContainerRef.current;
            const size = Math.min(container.clientWidth, 500);

            lineCanvas.width = size;
            lineCanvas.height = size;
            colorCanvas.width = size;
            colorCanvas.height = size;

            // Draw image to Line Canvas
            lineCtx.drawImage(img, 0, 0, size, size);

            // Process Line Art: Turn White to Transparent
            const imgData = lineCtx.getImageData(0, 0, size, size);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // If pixel is bright (white-ish), make it transparent
                if (r > 200 && g > 200 && b > 200) {
                    data[i + 3] = 0;
                }
            }
            lineCtx.putImageData(imgData, 0, 0);

            // Fill Color Canvas with White (Background)
            colorCtx.fillStyle = '#ffffff';
            colorCtx.fillRect(0, 0, size, size);
        };

    }, [templateImage]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);

        if (tool === 'bucket') {
            useBucket(x, y);
            setIsDrawing(false);
        } else if (tool === 'sticker') {
            useSticker(x, y);
            setIsDrawing(false);
        } else {
            usePencil(x, y, true); // Start Drawing
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);

        if (tool === 'pencil' || tool === 'eraser') {
            usePencil(x, y, false);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        const rect = colorCanvasRef.current.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: Math.floor(clientX - rect.left),
            y: Math.floor(clientY - rect.top)
        };
    };

    const useBucket = (x, y) => {
        const colorCtx = colorCanvasRef.current.getContext('2d', { willReadFrequently: true });
        const lineCtx = lineCanvasRef.current.getContext('2d', { willReadFrequently: true });

        // Use Smart Flood Fill that checks Line Canvas for boundaries
        smartFloodFill(colorCtx, lineCtx, x, y, color);
    };

    const useSticker = (x, y) => {
        const ctx = colorCanvasRef.current.getContext('2d');

        if (selectedSticker.type === 'emoji') {
            ctx.font = '40px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(selectedSticker.content, x, y);
        } else if (selectedSticker.type === 'image') {
            const img = new Image();
            img.src = selectedSticker.content;
            img.onload = () => {
                const size = 60; // Sticker size
                ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            };
        }
    };

    const usePencil = (x, y, isStart) => {
        const ctx = colorCanvasRef.current.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

        if (isStart) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const downloadArt = () => {
        // Combine canvases
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = colorCanvasRef.current.width;
        finalCanvas.height = colorCanvasRef.current.height;
        const ctx = finalCanvas.getContext('2d');

        // Draw Color first
        ctx.drawImage(colorCanvasRef.current, 0, 0);
        // Draw Lines on top
        ctx.drawImage(lineCanvasRef.current, 0, 0);

        const link = document.createElement('a');
        link.download = 'merchboy-masterpiece.png';
        link.href = finalCanvas.toDataURL();
        link.click();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: '10px',
                background: '#222',
                padding: '10px',
                borderRadius: '50px',
                border: '2px solid #555'
            }}>
                {COLORS.map(c => (
                    <SquishyButton
                        key={c}
                        onClick={() => { setColor(c); setTool('pencil'); }}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: c,
                            border: color === c ? '3px solid white' : 'none',
                        }}
                    />
                ))}
                <div style={{ width: '2px', background: '#555' }} />
                <SquishyButton onClick={() => setTool('bucket')} style={{ background: tool === 'bucket' ? '#444' : 'transparent', border: 'none', fontSize: '1.2rem' }}>🪣</SquishyButton>
                <SquishyButton onClick={() => setTool('pencil')} style={{ background: tool === 'pencil' ? '#444' : 'transparent', border: 'none', fontSize: '1.2rem' }}>✏️</SquishyButton>
                <SquishyButton onClick={() => setTool('eraser')} style={{ background: tool === 'eraser' ? '#444' : 'transparent', border: 'none', fontSize: '1.2rem' }}>🧹</SquishyButton>
                <div style={{ width: '2px', background: '#555' }} />
                <SquishyButton onClick={() => setTool('sticker')} style={{ background: tool === 'sticker' ? '#444' : 'transparent', border: 'none', fontSize: '1.2rem' }}>🦄</SquishyButton>
            </div>

            {tool === 'sticker' && (
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    background: '#222',
                    padding: '10px',
                    borderRadius: '20px',
                    border: '2px dashed #555'
                }}>
                    {STICKERS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedSticker(s)}
                            style={{
                                background: 'transparent',
                                border: selectedSticker === s ? '2px solid white' : 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: '5px'
                            }}
                        >
                            {s.type === 'emoji' ? s.content : (
                                <img src={s.content} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Canvas Stack */}
            <div ref={canvasContainerRef} style={{ position: 'relative', width: '500px', height: '500px', border: '4px solid gold', borderRadius: '10px', background: 'white' }}>
                <canvas
                    ref={colorCanvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}

                    onTouchStart={(e) => { e.preventDefault(); handleMouseDown(e); }}
                    onTouchMove={(e) => { e.preventDefault(); handleMouseMove(e); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}

                    style={{ position: 'absolute', top: 0, left: 0, touchAction: 'none' }}
                />
                <canvas
                    ref={lineCanvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                />
            </div>

            <SquishyButton onClick={downloadArt} style={{
                padding: '10px 30px',
                background: 'gold',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
            }}>
                SAVE MASTERPIECE 💾
            </SquishyButton>
        </div>
    );
};

export default ColoringCanvas;
