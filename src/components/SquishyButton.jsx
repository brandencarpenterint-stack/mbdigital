import React from 'react';
import useRetroSound from '../hooks/useRetroSound';

const SquishyButton = ({ children, onClick, style, ...props }) => {
    const { playBeep } = useRetroSound();

    const handleClick = (e) => {
        playBeep();

        // Haptic Feedback (Mobile)
        if (navigator.vibrate) {
            navigator.vibrate(10); // Tiny tick
        }

        if (onClick) onClick(e);
    };

    return (
        <button
            className="squishy-btn"
            onClick={handleClick}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};

export default SquishyButton;
