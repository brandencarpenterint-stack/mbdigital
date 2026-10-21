/**
 * MBDigital Ad & Monetization Service (adService.js)
 * Manages rewarded video ads, interstitial rate-limiting, daily sponsor quotas,
 * and seamless fallback simulation when in development or without live ad tags.
 * 
 * Supports:
 * - Google AdSense for Games / H5 Game Ads Placement API (adBreak / adConfig)
 * - AdinPlay / HTML5 Gaming Ad Networks
 * - Curated fallback sponsor simulation for offline / adblock / test mode
 */

import MonetizationConfig from '../config/MonetizationConfig';

const STORAGE_KEY_DATE = 'mb_sponsor_quota_date';
const STORAGE_KEY_COUNT = 'mb_sponsor_quota_count';
const STORAGE_KEY_LAST_INTERSTITIAL = 'mb_last_interstitial_ts';

export const DAILY_MAX_SPONSOR_CLAIMS = MonetizationConfig.dailyMaxSponsorClaims || 5;
export const SPONSOR_REWARD_CP = MonetizationConfig.rewardCP || 1500;
export const SPONSOR_REWARD_XP = MonetizationConfig.rewardXP || 150;
export const INTERSTITIAL_COOLDOWN_MS = MonetizationConfig.interstitialCooldownMs || 180000; // 3 minutes

export const SPONSOR_CAMPAIGNS = MonetizationConfig.simulatedSponsors;

export const adService = {
    DAILY_MAX_SPONSOR_CLAIMS,
    SPONSOR_REWARD_CP,
    SPONSOR_REWARD_XP,
    INTERSTITIAL_COOLDOWN_MS,

    /**
     * Check if real fiat ad network is configured with a live publisher ID
     */
    isRealAdsConfigured: () => {
        return Boolean(MonetizationConfig.enableRealAds && MonetizationConfig.adsensePublisherId);
    },

    /**
     * Get active publisher ID
     */
    getPublisherId: () => {
        return MonetizationConfig.adsensePublisherId || '';
    },

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
                canClaim: remaining > 0,
                isRealAds: adService.isRealAdsConfigured()
            };
        } catch {
            return {
                today: new Date().toISOString().slice(0, 10),
                claimedCount: 0,
                remaining: DAILY_MAX_SPONSOR_CLAIMS,
                max: DAILY_MAX_SPONSOR_CLAIMS,
                rewardCP: SPONSOR_REWARD_CP,
                rewardXP: SPONSOR_REWARD_XP,
                canClaim: true,
                isRealAds: false
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
        const campaigns = MonetizationConfig.simulatedSponsors || SPONSOR_CAMPAIGNS;
        const index = Math.floor(Math.random() * campaigns.length);
        return campaigns[index];
    },

    /**
     * Attempt to show a real Google H5 Games rewarded video ad.
     * Returns a promise resolving to:
     * - 'rewarded': user watched full ad, reward claimed
     * - 'dismissed': user skipped or closed early
     * - 'fallback': no real ad available, show simulated modal
     */
    requestLiveRewardedAd: ({ beforeAd, afterAd } = {}) => {
        return new Promise((resolve) => {
            if (
                typeof window !== 'undefined' &&
                typeof window.adBreak === 'function' &&
                adService.isRealAdsConfigured()
            ) {
                try {
                    window.adBreak({
                        type: 'reward',
                        name: 'sponsor_revive',
                        beforeAd: () => {
                            beforeAd?.();
                        },
                        afterAd: () => {
                            afterAd?.();
                        },
                        beforeReward: (showAdFn) => {
                            showAdFn();
                        },
                        adDismissed: () => {
                            resolve('dismissed');
                        },
                        adViewed: () => {
                            adService.recordClaim();
                            resolve('rewarded');
                        }
                    });
                    return;
                } catch {
                    resolve('fallback');
                    return;
                }
            }
            // Real ads not loaded or configured -> trigger fallback modal
            resolve('fallback');
        });
    }
};

export default adService;
