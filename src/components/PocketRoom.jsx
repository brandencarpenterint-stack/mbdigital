import React from 'react';
import { usePocketBro } from '../context/PocketBroContext';
import { DECOR_ITEMS } from '../config/DecorItems';

const GRID_SIZE = 5;

const PocketRoom = ({ isEditing, selectedItem, onPlace, customItems }) => {
    const { stats, removeItem, interactWithItem } = usePocketBro();
    // Use customItems if provided (Friend View), otherwise use context stats (My Room)
    const placedItems = customItems || stats.placedItems || [];

    // Helper to get item at coord
    const getItemAt = (x, y) => placedItems.find(i => i.x === x && i.y === y);

    const handleCellClick = (x, y) => {
        // VIEW MODE: Interact
        if (!isEditing) {
            const existing = getItemAt(x, y);
            if (existing) {
                interactWithItem(existing.id);
            }
            return;
        }

        // EDIT MODE
        // Center Reserved for Bro
        if (x === 2 && y === 2) return;

        // Specific Logic
        const existing = getItemAt(x, y);

        if (selectedItem) {
            // Place Item
            onPlace(selectedItem, x, y);
        } else if (existing) {
            // Remove Item if nothing selected (Eraser Mode) or confirm?
            // For now, click existing to remove
            removeItem(x, y);
        }
    };

    // Render Grid
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const itemData = getItemAt(x, y);
            // Safety check: Ensure item definition exists AND is a furniture item (not background)
            const itemDef = itemData ? DECOR_ITEMS.find(d => d.id === itemData.id) : null;
            const isValidFurniture = itemDef && itemDef.type !== 'background';

            const isCenter = x === 2 && y === 2;

            cells.push(
                <div
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        border: isEditing ? '1px dashed rgba(255,255,255,0.2)' : 'none',
                        background: isEditing && isCenter ? 'rgba(255,0,0,0.1)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                        cursor: (isEditing || getItemAt(x, y)) ? 'pointer' : 'default',
                        position: 'relative'
                    }}
                >
                    {isValidFurniture ? (
                        <div style={{ ...itemDef.style, position: 'relative', top: 0, left: 0, right: 0, bottom: 0, fontSize: '2rem' }}>
                            {itemDef.render || itemDef.icon}
                        </div>
                    ) : null}

                    {/* Highlight for Center */}
                    {isCenter && isEditing && <div style={{ fontSize: '0.5rem', color: 'red' }}>BRO</div>}
                </div>
            );
        }
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            zIndex: 10 // Behind UI but above BG
        }}>
            {cells}
        </div>
    );
};

export default PocketRoom;
