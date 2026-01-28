import React from 'react';
import useRetroSound from '../hooks/useRetroSound';

const SquishyButton = ({ children, onClick, style, ...props }) => {
    const { playBeep } = useRetroSound();

    const handleClick = (e) => {
        playBeep();

        // Create a temporary scale effect using DOM manipulation for 'juice'
        // or rely on CSS :active. We'll enhance CSS for this specific class.

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
