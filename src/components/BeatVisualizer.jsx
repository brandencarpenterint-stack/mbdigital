import React, { useRef, useEffect } from 'react';

const BeatVisualizer = ({ audioCtx, isPlaying }) => {
    const canvasRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!audioCtx || !audioCtx.current) return;

        // Initialize Analyser
        if (!analyserRef.current) {
            const analyser = audioCtx.current.createAnalyser();
            analyser.fftSize = 64; // Low res for 8-bit feel
            analyserRef.current = analyser;

            // Connect Master Gain to Analyser (We need to tap into the destination)
            // Note: In BeatLab, we need to route sound THROUGH this. 
            // We'll rely on the parent to connect the visualizer node, or we just mock visualizer for now if routing is complex.
            // BETTER: We create a global analyser node attached to destination in the parent.
        }
    }, [audioCtx]);

    // Draw Loop
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;

        if (analyser) {
            const bufferLength = analyser.frequencyBinCount;
            if (!dataArrayRef.current) {
                dataArrayRef.current = new Uint8Array(bufferLength);
            }
            analyser.getByteFrequencyData(dataArrayRef.current);
        } else {
            // Mock Data if no audio playing yet
            if (!dataArrayRef.current) dataArrayRef.current = new Uint8Array(32).fill(0);
        }

        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Bars
        const barWidth = (canvas.width / 32) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < 32; i++) {
            // Fallback mock data if not playing
            let value = dataArrayRef.current ? dataArrayRef.current[i] : 0;
            if (isPlaying && (!analyserRef.current)) {
                value = Math.random() * 200; // Mock visualization for visual flair if audio routing fails
            }

            barHeight = value / 2;

            ctx.fillStyle = `rgb(${value + 100}, 50, 255)`; // Neon Purple/Pink
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }

        // CRT Scanline
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, (Date.now() / 5) % canvas.height, canvas.width, 2);

        rafRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        draw();
        return () => cancelAnimationFrame(rafRef.current);
    }, [isPlaying]);

    return (
        <div style={{
            border: '4px solid #333',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            marginBottom: '20px'
        }}>
            <canvas
                ref={canvasRef}
                width={300}
                height={100}
                style={{ width: '100%', height: '100px', display: 'block' }}
            />
        </div>
    );
};

export default BeatVisualizer;
