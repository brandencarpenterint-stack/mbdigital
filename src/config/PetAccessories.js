/**
 * PetAccessories.js - Bro Wardrobe & Cyber Accessories Configuration
 */

export const PET_ACCESSORIES = [
    {
        id: 'acc_shades',
        name: 'Cyber Shades',
        icon: '🕶️',
        slot: 'face',
        price: 500,
        perk: '+5% SWAG HIGH SCORE MULTIPLIER',
        desc: 'Polarized mirror-tint shades with built-in HUD telemetry. Maximum Night City swagger.',
        glowColor: '#00f0ff',
        badge: 'SWAG BOOST'
    },
    {
        id: 'acc_chain',
        name: 'Gold Cuban Chain',
        icon: '⛓️',
        slot: 'neck',
        price: 1000,
        perk: 'HIGH-ROLLER DRIP: COINS CHIME ON STEPS',
        desc: 'Heavy 24k electroplated gold links with diamond-cut cyber medallion that chimes as Bro walks.',
        glowColor: '#ffd700',
        badge: 'DRIP AUDIO'
    },
    {
        id: 'acc_vr',
        name: 'VR Netrunner Visor',
        icon: '🥽',
        slot: 'head',
        price: 1500,
        perk: 'NETRUNNER RADAR: SWEEPS SCANLINES ACROSS ROOM',
        desc: 'Direct optical cyber-feed with active tactical grid projection scanlines.',
        glowColor: '#00ffcc',
        badge: 'SCANNER'
    },
    {
        id: 'acc_halo',
        name: 'Celestial Angel Halo',
        icon: '😇',
        slot: 'aura',
        price: 2500,
        perk: 'HOLY AURA: +20% HAPPINESS RECOVERY',
        desc: 'Forged from pure harmonic plasma. Emits a floating celestial ring of divine light.',
        glowColor: '#ffffff',
        badge: 'MYTHIC AURA'
    },
    {
        id: 'acc_horns',
        name: 'Cyber Oni Horns',
        icon: '😈',
        slot: 'aura',
        price: 2500,
        perk: 'RAGE AURA: +10% CRASH & MINES MULTIPLIER',
        desc: 'Crimson cybernetic horns glowing with overclocked geothermal fire.',
        glowColor: '#ff0055',
        badge: 'RAGE AURA'
    }
];

export const getAccessoryById = (id) => PET_ACCESSORIES.find(a => a.id === id) || null;

export default PET_ACCESSORIES;
