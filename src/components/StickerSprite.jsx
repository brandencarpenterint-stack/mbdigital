import React from 'react';
import { STICKER_COLLECTIONS } from '../config/StickerDefinitions';

const StickerSprite = ({ sticker, size = 64, style = {} }) => {
    // Find collection to get sheet URL
    const collection = STICKER_COLLECTIONS.find(c => c.items.some(i => i.id === sticker.id));

    if (!collection) return <span>?</span>;

    const sheetUrl = collection.sheet;
    const { row, col } = sticker;

    // Sprite Sheet Logic (3x3 Grid)
    // background-position: x% y%
    // 0,0 -> 0% 0%
    // 0,1 -> 50% 0%
    // 0,2 -> 100% 0%
    // Since it's 3 items, the positions are 0, 50, 100?
    // No, for n items, positions are i / (n-1) * 100.
    // 3 items: 0/2=0, 1/2=50, 2/2=100. Correct.

    const posX = (col / 2) * 100;
    const posY = (row / 2) * 100;

    return (
        <div style={{
            width: size,
            height: size,
            backgroundImage: `url(${sheetUrl})`,
            backgroundPosition: `${posX}% ${posY}%`,
            backgroundSize: '300%', // 3x zoom to show 1/3 of width
            imageRendering: 'pixelated',
            borderRadius: '50%', // Optional circular crop if desired, or keep square die-cut
            backgroundColor: 'transparent',
            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
            ...style
        }} title={sticker.name} />
    );
};

export default StickerSprite;
