export const ADVENTURE_LOCATIONS = [
    {
        id: 'backyard',
        name: 'Backyard Scavenge',
        icon: '🏡',
        durationMinutes: 15,
        energyCost: 20,
        minStage: 'BABY',
        description: 'A quick rummage around the neighborhood.',
        lootTable: {
            minCoins: 10,
            maxCoins: 50,
            xp: 20,
            dropRate: 0.3, // 30% chance of item
            items: [
                { id: 'furn_pizza', weight: 50 }, // Common
                { id: 'furn_plant', weight: 40 },
                { id: 'furn_duck', weight: 10 }  // Rare
            ]
        }
    },
    {
        id: 'city_run',
        name: 'Neon City Run',
        icon: '🌃',
        durationMinutes: 60,
        energyCost: 40,
        minStage: 'CHILD',
        description: 'Hustle through the downtown sector.',
        lootTable: {
            minCoins: 100,
            maxCoins: 300,
            xp: 100,
            dropRate: 0.4,
            items: [
                { id: 'furn_tv', weight: 40 },
                { id: 'rug_retro', weight: 30 },
                { id: 'item_lamp', weight: 20 },
                { id: 'furn_arcade', weight: 10 } // Rare
            ]
        }
    },
    {
        id: 'cyber_heist',
        name: 'Cyber Bank Heist',
        icon: '🏦',
        durationMinutes: 180, // 3h
        energyCost: 60,
        minStage: 'TEEN',
        description: 'A risky operation in the corporate zone.',
        lootTable: {
            minCoins: 500,
            maxCoins: 1500,
            xp: 500,
            dropRate: 0.5,
            items: [
                { id: 'furn_pc', weight: 30 },
                { id: 'item_pc', weight: 30 },
                { id: 'furn_robot', weight: 20 },
                { id: 'bg_cyber', weight: 10 },
                { id: 'furn_chest', weight: 10 } // Legendary
            ]
        }
    },
    {
        id: 'cyber_derby_track',
        name: 'Bro Derby Velodrome',
        icon: '🏇',
        durationMinutes: 30,
        energyCost: 35,
        minStage: 'CHILD',
        description: 'Compete on the cyber track circuit for race winnings & turbo gear.',
        lootTable: {
            minCoins: 250,
            maxCoins: 750,
            xp: 300,
            dropRate: 0.5,
            items: [
                { id: 'furn_arcade', weight: 40 },
                { id: 'furn_robot', weight: 35 },
                { id: 'rug_retro', weight: 25 }
            ]
        }
    },
    {
        id: 'underworld_vault_raid',
        name: 'Cyber Vault Infiltration',
        icon: '🔓',
        durationMinutes: 120,
        energyCost: 65,
        minStage: 'TEEN',
        description: 'Crack secret cipher locks in the high-stakes illegal betting den.',
        lootTable: {
            minCoins: 800,
            maxCoins: 2500,
            xp: 900,
            dropRate: 0.7,
            items: [
                { id: 'furn_chest', weight: 40 },
                { id: 'bg_cyber', weight: 35 },
                { id: 'furn_pc', weight: 25 }
            ]
        }
    },
    {
        id: 'pinball_wizard',
        name: 'Neon Pinball Wizard Hall',
        icon: '⚡',
        durationMinutes: 45,
        energyCost: 35,
        minStage: 'CHILD',
        description: 'Test flipper reflexes, hit secret bumper combos, and earn high-score rewards.',
        lootTable: {
            minCoins: 350,
            maxCoins: 1000,
            xp: 400,
            dropRate: 0.5,
            items: [
                { id: 'furn_arcade', weight: 45 },
                { id: 'rug_retro', weight: 35 },
                { id: 'furn_tv', weight: 20 }
            ]
        }
    },
    {
        id: 'moonshot_launchpad',
        name: 'Cyber Moonshot Launchpad',
        icon: '🚀',
        durationMinutes: 90,
        energyCost: 50,
        minStage: 'TEEN',
        description: 'Board the hyper-rocket into orbit and salvage cosmic space debris.',
        lootTable: {
            minCoins: 600,
            maxCoins: 1800,
            xp: 700,
            dropRate: 0.6,
            items: [
                { id: 'furn_ufo', weight: 40 },
                { id: 'bg_space', weight: 35 },
                { id: 'furn_robot', weight: 25 }
            ]
        }
    },
    {
        id: 'casino_royale',
        name: 'Neon Casino Royale Salon',
        icon: '🎡',
        durationMinutes: 75,
        energyCost: 45,
        minStage: 'CHILD',
        description: 'Mingle with high rollers at the single-zero roulette tables and collect VIP chips.',
        lootTable: {
            minCoins: 500,
            maxCoins: 1500,
            xp: 600,
            dropRate: 0.55,
            items: [
                { id: 'furn_chest', weight: 45 },
                { id: 'rug_retro', weight: 35 },
                { id: 'furn_arcade', weight: 20 }
            ]
        }
    },
    {
        id: 'cyber_minefield',
        name: 'Underground Cyber Minefield',
        icon: '💎',
        durationMinutes: 60,
        energyCost: 40,
        minStage: 'CHILD',
        description: 'Navigate the grid with scout drones and extract neon crystals.',
        lootTable: {
            minCoins: 400,
            maxCoins: 1200,
            xp: 500,
            dropRate: 0.55,
            items: [
                { id: 'furn_chest', weight: 45 },
                { id: 'furn_pc', weight: 35 },
                { id: 'rug_retro', weight: 20 }
            ]
        }
    },
    {
        id: 'neon_lottery_alley',
        name: 'Neon Lottery Alley',
        icon: '🎟️',
        durationMinutes: 40,
        energyCost: 30,
        minStage: 'BABY',
        description: 'Scour the glowing scratcher booths and foil kiosks for lucky golden tickets.',
        lootTable: {
            minCoins: 300,
            maxCoins: 900,
            xp: 350,
            dropRate: 0.5,
            items: [
                { id: 'furn_chest', weight: 40 },
                { id: 'furn_arcade', weight: 35 },
                { id: 'rug_retro', weight: 25 }
            ]
        }
    },
    {
        id: 'deep_space',
        name: 'Deep Space Void',
        icon: '🌌',
        durationMinutes: 480, // 8h (Sleep Mission)
        energyCost: 80,
        minStage: 'ADULT',
        description: 'Search the unknowns of the galaxy.',
        lootTable: {
            minCoins: 2000,
            maxCoins: 5000,
            xp: 2000,
            dropRate: 0.8, // High chance
            items: [
                { id: 'bg_space', weight: 30 },
                { id: 'furn_ufo', weight: 30 },
                { id: 'bg_magma', weight: 20 },
                { id: 'bg_underwater', weight: 15 },
                { id: 'furn_chest', weight: 5 }
            ]
        }
    }
];
