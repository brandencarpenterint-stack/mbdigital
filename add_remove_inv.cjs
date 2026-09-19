const fs = require('fs');
let code = fs.readFileSync('src/context/GamificationContext.jsx', 'utf8');

const removeInventoryFunc = `    const removeInventoryItem = (itemId, instanceId) => {
        setShopState(prev => {
            const currentInventory = prev.inventory || {};
            const items = currentInventory[itemId] || [];
            const newItems = items.filter(i => i.id !== instanceId);
            
            const newInventory = { ...currentInventory };
            if (newItems.length === 0) {
                delete newInventory[itemId];
            } else {
                newInventory[itemId] = newItems;
            }
            
            return {
                ...prev,
                inventory: newInventory
            };
        });
    };`;

code = code.replace('const addInventoryItem = (itemId', removeInventoryFunc + '\n    const addInventoryItem = (itemId');
code = code.replace('addInventoryItem, ', 'addInventoryItem, removeInventoryItem, ');

fs.writeFileSync('src/context/GamificationContext.jsx', code, 'utf8');
console.log('Added removeInventoryItem');
