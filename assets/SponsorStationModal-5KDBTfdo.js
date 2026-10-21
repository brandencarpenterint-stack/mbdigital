import { a as useGamification, c as usePocketBro, u as useRetroSound, b as useToast, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, t as triggerConfetti, f as feedService } from "./index-BZRippnL.js";
const STORAGE_KEY_DATE = "mb_sponsor_quota_date";
const STORAGE_KEY_COUNT = "mb_sponsor_quota_count";
const STORAGE_KEY_LAST_INTERSTITIAL = "mb_last_interstitial_ts";
const DAILY_MAX_SPONSOR_CLAIMS = 5;
const SPONSOR_REWARD_CP = 1500;
const SPONSOR_REWARD_XP = 150;
const INTERSTITIAL_COOLDOWN_MS = 18e4;
const SPONSOR_CAMPAIGNS = [
  {
    id: "camp_arasaka",
    brand: "ARASAKA NEURAL SYSTEMS",
    tagline: "NEXT-GEN CORTICAL OVERCLOCKS",
    pitch: "Experience zero-latency neural reflex speeds exceeding 140 Terabits/sec. Out-gamble the algorithms.",
    icon: "⚡",
    accentColor: "#00f0ff",
    bgGradient: "linear-gradient(135deg, #091a28 0%, #001f3f 100%)",
    callToAction: "UPGRADE HARDWARE"
  },
  {
    id: "camp_brocola",
    brand: "BROCOLA: ZERO GLITCH",
    tagline: "HIGH-VOLTAGE ENERGY SYNTHESIS",
    pitch: "Zero Sugar. 320mg Neuro-Caffeine. Infused with liquid neon electrolytes to fuel 24-hour arcade marathons.",
    icon: "🥤",
    accentColor: "#00ff66",
    bgGradient: "linear-gradient(135deg, #0a2612 0%, #003314 100%)",
    callToAction: "HYDRATE OR DIE"
  },
  {
    id: "camp_voidmining",
    brand: "VOID CLOUD MINING CORP",
    tagline: "OFF-WORLD DEEP MINING RIGS",
    pitch: "Deploy autonomous drone swarms into Kuiper belt asteroids. Earn passive quantum compute while you sleep.",
    icon: "🚀",
    accentColor: "#ffd700",
    bgGradient: "linear-gradient(135deg, #261f0a 0%, #332200 100%)",
    callToAction: "STAKE SATELLITE"
  },
  {
    id: "camp_synthwave",
    brand: "NIGHT CITY SYNTHWAVE 2088",
    tagline: "HOLOGRAPHIC MUSIC FESTIVAL",
    pitch: "72-Hour continuous cyberpunk cybercast broadcast across all orbital stations. Live bass synth assault.",
    icon: "📻",
    accentColor: "#ff007f",
    bgGradient: "linear-gradient(135deg, #28091a 0%, #33001f 100%)",
    callToAction: "TUNE IN FREQUENCY"
  },
  {
    id: "camp_titan",
    brand: "TITAN MK-IV CYBER-ARMOR",
    tagline: "BALLISTIC CARBON-FIBER WEAR",
    pitch: "Military-grade kinetic deflection with integrated sub-woofer chassis. Dominate the street and The Bunker.",
    icon: "🛡️",
    accentColor: "#ff003c",
    bgGradient: "linear-gradient(135deg, #280909 0%, #330005 100%)",
    callToAction: "SECURE ARMOR"
  }
];
const adService = {
  /**
   * Returns today's quota status: remaining views, max, rewards
   */
  getDailyQuota: () => {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
      let count = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || "0", 10);
      if (savedDate !== today) {
        localStorage.setItem(STORAGE_KEY_DATE, today);
        localStorage.setItem(STORAGE_KEY_COUNT, "0");
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
        today: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
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
      const lastTs = parseInt(localStorage.getItem(STORAGE_KEY_LAST_INTERSTITIAL) || "0", 10);
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
const DURATION_SECONDS = 8;
const SponsorStationModal = ({ isOpen, onClose }) => {
  const { addCoins, userProfile } = useGamification() || {};
  const { gainExp } = usePocketBro() || {};
  const { playWin, playCollect, playZap, playClick } = useRetroSound();
  const { showToast } = useToast() || { showToast: () => {
  } };
  const [quota, setQuota] = reactExports.useState(adService.getDailyQuota());
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [secondsLeft, setSecondsLeft] = reactExports.useState(DURATION_SECONDS);
  const [activeCampaign, setActiveCampaign] = reactExports.useState(null);
  const [rewardReady, setRewardReady] = reactExports.useState(false);
  const [claimedSuccess, setClaimedSuccess] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isOpen) {
      setQuota(adService.getDailyQuota());
      setIsPlaying(false);
      setRewardReady(false);
      setClaimedSuccess(false);
      setSecondsLeft(DURATION_SECONDS);
      setActiveCampaign(adService.getRandomCampaign());
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isPlaying && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1e3);
    } else if (isPlaying && secondsLeft === 0) {
      setIsPlaying(false);
      setRewardReady(true);
      try {
        playCollect?.();
      } catch {
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, secondsLeft, playCollect]);
  if (!isOpen) return null;
  const handleStartWatch = () => {
    if (!quota.canClaim) return;
    playClick();
    setActiveCampaign(adService.getRandomCampaign());
    setSecondsLeft(DURATION_SECONDS);
    setRewardReady(false);
    setClaimedSuccess(false);
    setIsPlaying(true);
    try {
      playZap?.();
    } catch {
    }
  };
  const handleClaimReward = () => {
    if (!rewardReady) return;
    playWin();
    triggerConfetti();
    if (addCoins) {
      addCoins(SPONSOR_REWARD_CP);
    }
    if (gainExp) {
      gainExp(SPONSOR_REWARD_XP);
    }
    const updatedQuota = adService.recordClaim();
    setQuota(updatedQuota);
    setRewardReady(false);
    setClaimedSuccess(true);
    const operatorName = userProfile?.name || "CYBER OPERATOR";
    feedService.publish(
      `⚡ OPERATOR ${operatorName.toUpperCase()} CASHED A ${SPONSOR_REWARD_CP.toLocaleString()} CP SPONSOR AIRDROP!`,
      "sponsor",
      operatorName
    );
    if (showToast) {
      showToast(`AIRDROP RECEIVED: +${SPONSOR_REWARD_CP.toLocaleString()} CP & +${SPONSOR_REWARD_XP} BRO XP!`, "coin");
    }
  };
  const progressPct = (DURATION_SECONDS - secondsLeft) / DURATION_SECONDS * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    backdropFilter: "blur(14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1e4,
    padding: "16px"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { scale: 0.9, opacity: 0, y: 30 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.9, opacity: 0, y: 30 },
      transition: { type: "spring", damping: 25, stiffness: 300 },
      style: {
        background: "linear-gradient(180deg, #0f172a 0%, #030712 100%)",
        border: "2px solid rgba(0, 240, 255, 0.4)",
        borderRadius: "24px",
        boxShadow: "0 0 50px rgba(0, 240, 255, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.8)",
        width: "100%",
        maxWidth: "540px",
        overflow: "hidden",
        position: "relative",
        color: "#fff",
        fontFamily: '"Orbitron", sans-serif'
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "16px 20px",
          background: "rgba(0, 240, 255, 0.08)",
          borderBottom: "1px solid rgba(0, 240, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.4rem" }, children: "⚡" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1rem", letterSpacing: "2px", color: "#00f0ff" }, children: "SPONSOR RELAY NODE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#94a3b8", fontFamily: "monospace" }, children: "QUANTUM BANDWIDTH AIRDROP STATION" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              style: {
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#aaa",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "24px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "#cbd5e1", letterSpacing: "1px" }, children: "DAILY AIRDROPS REMAINING:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px" }, children: [...Array(quota.max)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: "14px",
                  height: "14px",
                  borderRadius: "4px",
                  background: i < quota.claimedCount ? "#334155" : "#00f0ff",
                  boxShadow: i < quota.claimedCount ? "none" : "0 0 8px #00f0ff",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                },
                title: i < quota.claimedCount ? "Claimed" : "Available"
              },
              i
            )) })
          ] }),
          isPlaying && activeCampaign && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              style: {
                background: activeCampaign.bgGradient,
                border: `1px solid ${activeCampaign.accentColor}`,
                borderRadius: "18px",
                padding: "24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 0 30px ${activeCampaign.accentColor}33`,
                marginBottom: "20px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
                  pointerEvents: "none"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(0,0,0,0.7)",
                  border: `1px solid ${activeCampaign.accentColor}`,
                  color: activeCampaign.accentColor,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  fontWeight: "bold"
                }, children: [
                  "AIRDROP IN: ",
                  secondsLeft,
                  "s"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "8px", filter: `drop-shadow(0 0 12px ${activeCampaign.accentColor})` }, children: activeCampaign.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "0.7rem",
                  letterSpacing: "2px",
                  color: activeCampaign.accentColor,
                  fontWeight: "bold",
                  marginBottom: "4px"
                }, children: "FEATURED SPONSOR" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
                  fontSize: "1.25rem",
                  margin: "0 0 8px 0",
                  color: "#fff",
                  letterSpacing: "1px"
                }, children: activeCampaign.brand }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  marginBottom: "16px",
                  fontFamily: "monospace"
                }, children: activeCampaign.tagline }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  color: "#e2e8f0",
                  margin: "0 0 16px 0",
                  fontFamily: "sans-serif"
                }, children: activeCampaign.pitch }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: "100%",
                  height: "8px",
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    style: {
                      height: "100%",
                      background: `linear-gradient(90deg, ${activeCampaign.accentColor}, #ffffff)`,
                      boxShadow: `0 0 10px ${activeCampaign.accentColor}`
                    },
                    animate: { width: `${progressPct}%` },
                    transition: { ease: "linear", duration: 1 }
                  }
                ) })
              ]
            }
          ),
          rewardReady && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              style: {
                background: "rgba(0, 240, 255, 0.1)",
                border: "1px solid #00f0ff",
                borderRadius: "18px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "20px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", marginBottom: "8px" }, children: "🎉" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#00f0ff", margin: "0 0 8px 0", fontSize: "1.2rem" }, children: "VERIFICATION TRANSMITTED!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#e2e8f0", fontSize: "0.85rem", marginBottom: "16px" }, children: "The sponsor relay confirmed your transmission. Claim your rewards now:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  marginBottom: "20px",
                  fontFamily: "monospace"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    background: "rgba(255, 215, 0, 0.15)",
                    border: "1px solid #ffd700",
                    color: "#ffd700",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontWeight: "bold"
                  }, children: [
                    "+",
                    SPONSOR_REWARD_CP.toLocaleString(),
                    " CP"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    background: "rgba(0, 240, 255, 0.15)",
                    border: "1px solid #00f0ff",
                    color: "#00f0ff",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontWeight: "bold"
                  }, children: [
                    "+",
                    SPONSOR_REWARD_XP,
                    " BRO XP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleClaimReward,
                    style: {
                      width: "100%",
                      background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
                      color: "#000",
                      border: "none",
                      borderRadius: "14px",
                      padding: "14px",
                      fontSize: "1rem",
                      fontWeight: "900",
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
                      letterSpacing: "1px"
                    },
                    children: [
                      "⚡ CLAIM AIRDROP (+",
                      SPONSOR_REWARD_CP,
                      " CP)"
                    ]
                  }
                )
              ]
            }
          ),
          claimedSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              style: {
                background: "rgba(0, 255, 102, 0.1)",
                border: "1px solid #00ff66",
                borderRadius: "18px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "20px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2.5rem", marginBottom: "8px" }, children: "💎" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#00ff66", margin: "0 0 8px 0", fontSize: "1.2rem" }, children: "AIRDROP CREDITED!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#94a3b8", fontSize: "0.85rem", marginBottom: "16px" }, children: [
                  "+",
                  SPONSOR_REWARD_CP.toLocaleString(),
                  " CP added to your balance. PocketBro gained +",
                  SPONSOR_REWARD_XP,
                  " XP!"
                ] }),
                quota.canClaim ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleStartWatch,
                    style: {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.85rem"
                    },
                    children: [
                      "CLAIM ANOTHER (",
                      quota.remaining,
                      " REMAINING)"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ffd700", fontSize: "0.8rem", fontFamily: "monospace" }, children: "ALL 5 DAILY AIRDROPS CLAIMED FOR TODAY!" })
              ]
            }
          ),
          !isPlaying && !rewardReady && !claimedSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "18px",
              padding: "24px",
              marginBottom: "20px"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "10px" }, children: "🛰️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#fff", margin: "0 0 8px 0", fontSize: "1.1rem" }, children: "INSTANT SPONSOR AIRDROP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                color: "#94a3b8",
                fontSize: "0.85rem",
                lineHeight: "1.5",
                margin: "0 0 16px 0",
                fontFamily: "sans-serif"
              }, children: "Watch a brief 8-second sponsor transmission to instantly reload your wallet with Cyber Points. 100% free, supporting the continuous development of MBDigital!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "inline-flex",
                gap: "12px",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "8px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                fontFamily: "monospace",
                fontSize: "0.85rem"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700" }, children: [
                  "🎁 +",
                  SPONSOR_REWARD_CP.toLocaleString(),
                  " CP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00f0ff" }, children: [
                  "⭐ +",
                  SPONSOR_REWARD_XP,
                  " XP"
                ] })
              ] })
            ] }),
            quota.canClaim ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleStartWatch,
                style: {
                  width: "100%",
                  background: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
                  color: "#000",
                  border: "none",
                  borderRadius: "16px",
                  padding: "16px",
                  fontSize: "1.05rem",
                  fontWeight: "900",
                  cursor: "pointer",
                  boxShadow: "0 0 25px rgba(0, 240, 255, 0.5)",
                  letterSpacing: "1px"
                },
                children: [
                  "INITIALIZE SPONSOR AIRDROP (",
                  quota.remaining,
                  "/",
                  quota.max,
                  ")"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              background: "rgba(255, 8, 68, 0.1)",
              border: "1px solid #ff0844",
              color: "#ff88aa",
              borderRadius: "14px",
              padding: "14px",
              fontSize: "0.85rem",
              fontFamily: "monospace"
            }, children: [
              "DAILY AIRDROP LIMIT REACHED (5/5).",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "SATELLITE BANDWIDTH RESETS AT MIDNIGHT."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "12px 20px",
          background: "rgba(0, 0, 0, 0.8)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.7rem",
          color: "#64748b",
          fontFamily: "monospace"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VERIFIED AD NETWORK ADAPTER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "MBDIGITAL WORLD 2088" })
        ] })
      ]
    }
  ) }) });
};
export {
  SponsorStationModal as S
};
