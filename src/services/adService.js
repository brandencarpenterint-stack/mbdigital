/**
 * MBDigital Ad & Monetization Service (adService.js)
 * Manages rewarded video ads, interstitial rate-limiting, daily sponsor quotas,
 * and seamless fallback simulation when in development or without live ad tags.
 */

const STORAGE_KEY_DATE = 'mb_sponsor_quota_date';
const STORAGE_KEY_COUNT = 'mb_sponsor_quota_count';
const STORAGE_KEY_LAST_INTERSTITIAL = 'mb_last_interstitial_ts';

export const DAILY_MAX_SPONSOR_CLAIMS = 5;
export const SPONSOR_REWARD_CP = 1500;
export const SPONSOR_REWARD_XP = 150;
export const INTERSTITIAL_COOLDOWN_MS = 180000; // 3 minutes between interstitials

export const SPONSOR_CAMPAIGNS = [
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
];

export const adService = {
    /**
     * Returns today's quota status: remaining views, max, rewards
     */
    getDailyQuota: () => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
            let count = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);

            if (savedDate !== today) {
                // Reset daily quota at midnight
                localStorage.setItem(STORAGE_KEY_DATE, today);
                localStorage.setItem(STORAGE_KEY_COUNT, '0');
                count = 0;
            }

            const remaining = Math.max(0, DAILY_MAX_SPONSOR_CLAIMS - count);

            return {
                today,
                claimedCount: count,
                remaining,
                max: DAILY_MAX_SPONSOR_CLAIMS,
                rewardCP: SPONSOR_REWARD_CP,
                rewardXP: SPONSOR_REWARD_XP,
                canClaim: remaining > 0
            };
        } catch {
            return {
                today: new Date().toISOString().slice(0, 10),
                claimedCount: 0,
                remaining: DAILY_MAX_SPONSOR_CLAIMS,
                max: DAILY_MAX_SPONSOR_CLAIMS,
                rewardCP: SPONSOR_REWARD_CP,
                rewardXP: SPONSOR_REWARD_XP,
                canClaim: true
            };
        }
    },

    /**
     * Records a successful ad reward claim in localStorage
     */
    recordClaim: () => {
        try {
            const quota = adService.getDailyQuota();
            const newCount = quota.claimedCount + 1;
            localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());
            return adService.getDailyQuota();
        } catch {
            return adService.getDailyQuota();
        }
    },

    /**
     * Checks if an interstitial ad is allowed to show based on cooldown
     */
    canShowInterstitial: () => {
        try {
            const lastTs = parseInt(localStorage.getItem(STORAGE_KEY_LAST_INTERSTITIAL) || '0', 10);
            return Date.now() - lastTs > INTERSTITIAL_COOLDOWN_MS;
        } catch {
            return false;
        }
    },

    /**
     * Marks interstitial ad shown
     */
    recordInterstitialShown: () => {
        try {
            localStorage.setItem(STORAGE_KEY_LAST_INTERSTITIAL, Date.now().toString());
        } catch {
            // ignore
        }
    },

    /**
     * Pick a random sponsor campaign for the simulator
     */
    getRandomCampaign: () => {
        const index = Math.floor(Math.random() * SPONSOR_CAMPAIGNS.length);
        return SPONSOR_CAMPAIGNS[index];
    }
};

export default adService;
