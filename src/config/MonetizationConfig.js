/**
 * MonetizationConfig.js
 * Centralized configuration for real ad monetization and fallback sponsors.
 * 
 * To monetize with real fiat cash via Google AdSense for Games / H5 Game Ads:
 * 1. Create a free account at https://adsense.google.com
 * 2. Add your Publisher ID (e.g. ca-pub-1234567890123456) in .env as:
 *    VITE_ADSENSE_PUB_ID=ca-pub-1234567890123456
 * 3. Update public/ads.txt with your publisher ID:
 *    google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
 */

export const MonetizationConfig = {
    // Read from environment variable or configure here
    adsensePublisherId: import.meta.env.VITE_ADSENSE_PUB_ID || '',
    h5ChannelId: import.meta.env.VITE_ADSENSE_CHANNEL_ID || '',
    adinplayGameId: import.meta.env.VITE_ADINPLAY_GAME_ID || '',

    // Feature toggles
    enableRealAds: Boolean(import.meta.env.VITE_ADSENSE_PUB_ID || import.meta.env.VITE_ADINPLAY_GAME_ID),
    fallbackToSimulatedSponsors: true,

    // Quotas and rewards
    dailyMaxSponsorClaims: 5,
    rewardCP: 1500,
    rewardXP: 150,
    interstitialCooldownMs: 180000, // 3 minutes

    // Fallback simulated sponsors (cyberpunk lore)
    simulatedSponsors: [
        {
            id: 'camp_arasaka',
            brand: 'ARASAKA NEURAL SYSTEMS',
            tagline: 'NEXT-GEN CORTICAL OVERCLOCKS',
            pitch: 'Experience zero-latency neural reflex speeds exceeding 140 Terabits/sec. Out-gamble the algorithms.',
            icon: '⚡',
            accentColor: '#00f0ff',
            bgGradient: 'linear-gradient(135deg, #091a28 0%, #001f3f 100%)',
            callToAction: 'UPGRADE HARDWARE'
        },
        {
            id: 'camp_brocola',
            brand: 'BROCOLA: ZERO GLITCH',
            tagline: 'HIGH-VOLTAGE ENERGY SYNTHESIS',
            pitch: 'Zero Sugar. 320mg Neuro-Caffeine. Infused with liquid neon electrolytes to fuel 24-hour arcade marathons.',
            icon: '🥤',
            accentColor: '#00ff66',
            bgGradient: 'linear-gradient(135deg, #0a2612 0%, #003314 100%)',
            callToAction: 'HYDRATE OR DIE'
        },
        {
            id: 'camp_voidmining',
            brand: 'VOID CLOUD MINING CORP',
            tagline: 'OFF-WORLD DEEP MINING RIGS',
            pitch: 'Deploy autonomous drone swarms into Kuiper belt asteroids. Earn passive quantum compute while you sleep.',
            icon: '🚀',
            accentColor: '#ffd700',
            bgGradient: 'linear-gradient(135deg, #261f0a 0%, #332200 100%)',
            callToAction: 'STAKE SATELLITE'
        },
        {
            id: 'camp_synthwave',
            brand: 'NIGHT CITY SYNTHWAVE 2088',
            tagline: 'HOLOGRAPHIC MUSIC FESTIVAL',
            pitch: '72-Hour continuous cyberpunk cybercast broadcast across all orbital stations. Live bass synth assault.',
            icon: '📻',
            accentColor: '#ff007f',
            bgGradient: 'linear-gradient(135deg, #28091a 0%, #33001f 100%)',
            callToAction: 'TUNE IN FREQUENCY'
        },
        {
            id: 'camp_titan',
            brand: 'TITAN MK-IV CYBER-ARMOR',
            tagline: 'BALLISTIC CARBON-FIBER WEAR',
            pitch: 'Military-grade kinetic deflection with integrated sub-woofer chassis. Dominate the street and The Bunker.',
            icon: '🛡️',
            accentColor: '#ff003c',
            bgGradient: 'linear-gradient(135deg, #280909 0%, #330005 100%)',
            callToAction: 'SECURE ARMOR'
        }
    ]
};

export default MonetizationConfig;
