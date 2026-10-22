import { r as reactExports, u as useRetroSound, q as adService, t as triggerConfetti, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-B8SwAFNt.js";
const TOTAL_COUNTDOWN_SEC = 10;
const RewardedSponsorModal = ({
  isOpen,
  onClose,
  onRewarded,
  rewardTitle = "FREE REVIVE",
  rewardIcon = "❤️",
  rewardDescription = "Watch the sponsor spot to claim your reward."
}) => {
  const [campaign, setCampaign] = reactExports.useState(null);
  const [timeLeft, setTimeLeft] = reactExports.useState(TOTAL_COUNTDOWN_SEC);
  const [isCompleted, setIsCompleted] = reactExports.useState(false);
  const [showEarlyExitWarning, setShowEarlyExitWarning] = reactExports.useState(false);
  const { playBeep, playWin, playCollect } = useRetroSound();
  reactExports.useEffect(() => {
    if (isOpen) {
      setCampaign(adService.getRandomCampaign());
      setTimeLeft(TOTAL_COUNTDOWN_SEC);
      setIsCompleted(false);
      setShowEarlyExitWarning(false);
      playBeep?.();
    }
  }, [isOpen, playBeep]);
  reactExports.useEffect(() => {
    if (!isOpen || isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          playWin?.();
          triggerConfetti();
          adService.recordClaim();
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isOpen, isCompleted, playWin]);
  if (!isOpen || !campaign) return null;
  const progressPercentage = Math.round((TOTAL_COUNTDOWN_SEC - timeLeft) / TOTAL_COUNTDOWN_SEC * 100);
  const handleClaim = () => {
    playCollect?.();
    triggerConfetti();
    onRewarded?.();
    onClose();
  };
  const handleAttemptClose = () => {
    if (isCompleted) {
      onClose();
    } else {
      setShowEarlyExitWarning(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 11500,
        background: "rgba(3, 6, 12, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.92, y: 20, opacity: 0 },
          animate: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 0.92, y: 20, opacity: 0 },
          transition: { type: "spring", damping: 25, stiffness: 350 },
          style: {
            width: "100%",
            maxWidth: "480px",
            background: campaign.bgGradient || "linear-gradient(135deg, #091a28, #001f3f)",
            border: `2px solid ${campaign.accentColor || "#00f0ff"}`,
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px ${campaign.accentColor}33`,
            display: "flex",
            flexDirection: "column",
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              padding: "14px 20px",
              background: "rgba(0, 0, 0, 0.6)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isCompleted ? "#00ff88" : campaign.accentColor,
                  boxShadow: `0 0 8px ${isCompleted ? "#00ff88" : campaign.accentColor}`
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                  fontSize: "0.68rem",
                  color: "#e2e8f0",
                  fontWeight: "900",
                  fontFamily: '"Orbitron", monospace',
                  letterSpacing: "1px"
                }, children: isCompleted ? "SPONSOR REWARD READY" : "SPONSOR SPOT IN PROGRESS" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                  fontSize: "0.65rem",
                  color: "#94a3b8",
                  fontFamily: "monospace"
                }, children: [
                  "(",
                  adService.getDailyQuota().remaining,
                  "/",
                  adService.DAILY_MAX_SPONSOR_CLAIMS,
                  " LEFT TODAY)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  background: isCompleted ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 0, 0, 0.5)",
                  border: `1px solid ${isCompleted ? "#00ff88" : "rgba(255, 255, 255, 0.2)"}`,
                  color: isCompleted ? "#00ff88" : "#fff",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: "900",
                  fontFamily: "monospace"
                }, children: isCompleted ? "✓ COMPLETED" : `⏳ ${timeLeft}s` })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              height: "4px",
              background: "rgba(0, 0, 0, 0.4)",
              width: "100%",
              overflow: "hidden"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { width: `${progressPercentage}%` },
                transition: { ease: "linear", duration: 0.3 },
                style: {
                  height: "100%",
                  background: isCompleted ? "#00ff88" : campaign.accentColor,
                  boxShadow: `0 0 10px ${campaign.accentColor}`
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "28px 24px", textAlign: "center", position: "relative" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                color: "#ffd700",
                fontWeight: "bold",
                fontFamily: "monospace",
                marginBottom: "16px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rewardIcon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rewardTitle })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: "rgba(0, 0, 0, 0.4)",
                border: `2px solid ${campaign.accentColor}`,
                margin: "0 auto 16px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                boxShadow: `0 0 25px ${campaign.accentColor}44`
              }, children: campaign.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "0.72rem",
                fontWeight: "900",
                color: campaign.accentColor,
                letterSpacing: "2px",
                fontFamily: "monospace",
                marginBottom: "4px"
              }, children: campaign.tagline }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
                margin: "0 0 12px 0",
                fontSize: "1.4rem",
                fontWeight: "900",
                color: "#fff",
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: "1px"
              }, children: campaign.brand }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                margin: "0 0 20px 0",
                fontSize: "0.85rem",
                color: "#cbd5e1",
                lineHeight: "1.5",
                fontFamily: "system-ui, -apple-system, sans-serif"
              }, children: campaign.pitch }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "0.74rem",
                color: "#94a3b8",
                fontStyle: "italic",
                marginBottom: "10px"
              }, children: rewardDescription })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              padding: "16px 24px",
              background: "rgba(0, 0, 0, 0.7)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }, children: [
              isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: handleClaim,
                  style: {
                    width: "100%",
                    background: "linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)",
                    color: "#000",
                    border: "none",
                    borderRadius: "14px",
                    padding: "14px",
                    fontWeight: "900",
                    fontSize: "0.95rem",
                    fontFamily: '"Orbitron", sans-serif',
                    letterSpacing: "1px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 0 25px rgba(0, 255, 136, 0.5)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rewardIcon }),
                    " CLAIM ",
                    rewardTitle,
                    " ➔"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  fontFamily: "monospace"
                }, children: [
                  "Reward unlocks in ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { style: { color: "#fff" }, children: [
                    timeLeft,
                    "s"
                  ] }),
                  "..."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleAttemptClose,
                    style: {
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#64748b",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "0.72rem",
                      cursor: "pointer"
                    },
                    children: "Skip & Forfeit"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                textAlign: "center",
                fontSize: "0.62rem",
                color: "#64748b",
                marginTop: "8px",
                fontFamily: "monospace"
              }, children: adService.isRealAdsConfigured() ? "🟢 Google H5 Ad Network Active • Monetization Live" : "⚡ Preview Mode (Simulated Sponsor) • Connect Google AdSense in .env" }),
              showEarlyExitWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                background: "rgba(255, 0, 85, 0.15)",
                border: "1px solid #ff0055",
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "#ff0055",
                marginTop: "4px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Forfeit your ",
                  rewardTitle,
                  "? Watch ",
                  timeLeft,
                  " more seconds to claim!"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "12px", marginTop: "6px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setShowEarlyExitWarning(false),
                      style: {
                        background: "#ff0055",
                        color: "#fff",
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      },
                      children: "Keep Watching"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: onClose,
                      style: {
                        background: "transparent",
                        color: "#aaa",
                        border: "1px solid #555",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      },
                      children: "Forfeit & Close"
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  ) });
};
export {
  RewardedSponsorModal as R
};
