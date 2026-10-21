import { a as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, A as AnimatePresence, m as motion, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-PU9APJCR.js";
const CANVAS_WIDTH = 580;
const CANVAS_HEIGHT = 650;
const ROWS = 9;
const PEG_RADIUS = 5;
const BALL_RADIUS = 13;
const RISK_MODES = {
  NORMAL: {
    label: "NORMAL",
    color: "#00ffcc",
    multipliers: [25, 8, 3, 1.5, 0.8, 0.4, 0.8, 1.5, 3, 8, 25]
  },
  HIGH: {
    label: "HIGH ROLLER",
    color: "#ffaa00",
    multipliers: [50, 15, 5, 2, 0.4, 0.2, 0.4, 2, 5, 15, 50]
  },
  DEGEN: {
    label: "DEGEN 100X",
    color: "#ff0055",
    multipliers: [100, 25, 7, 1.5, 0.2, 0, 0.2, 1.5, 7, 25, 100]
  }
};
const AVATARS = [
  { id: "star", name: "Star Bro", src: "/assets/skins/face_star.png" },
  { id: "money", name: "Money Bro", src: "/assets/skins/face_money.png" },
  { id: "astro", name: "Astro Bro", src: "/assets/skins/face_astro.png" },
  { id: "dino", name: "Dino Bro", src: "/assets/skins/face_dino.png" },
  { id: "bear", name: "Bear Bro", src: "/assets/skins/face_bear.png" },
  { id: "cat", name: "Cat Bro", src: "/assets/skins/face_cat.png" },
  { id: "gamer", name: "Gamer Bro", src: "/assets/skins/face_gamer.png" }
];
const PENTATONIC = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
const CyberPlinko = () => {
  const { coins, addCoins, updateStat, incrementStat, userProfile, stats } = useGamification() || {};
  const { playBoop, playWin, playAirhorn, playCollect, playCrash } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const [risk, setRisk] = reactExports.useState("NORMAL");
  const [bet, setBet] = reactExports.useState(25);
  const [selectedAvatar, setSelectedAvatar] = reactExports.useState(AVATARS[0]);
  const [history, setHistory] = reactExports.useState([]);
  const [totalWon, setTotalWon] = reactExports.useState(0);
  const [jackpotEffect, setJackpotEffect] = reactExports.useState(false);
  const playPegChime = (row) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = PENTATONIC[row % PENTATONIC.length] * (row > 4 ? 2 : 1);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
    }
  };
  const avatarImagesRef = reactExports.useRef({});
  reactExports.useEffect(() => {
    AVATARS.forEach((a) => {
      const img = new Image();
      img.src = a.src;
      avatarImagesRef.current[a.id] = img;
    });
  }, []);
  const engineRef = reactExports.useRef({
    pegs: [],
    bins: [],
    balls: [],
    particles: [],
    animId: null
  });
  reactExports.useEffect(() => {
    const pegs = [];
    const topY = 90;
    const spacingY = 48;
    const spacingX = 46;
    for (let r = 0; r < ROWS; r++) {
      const count = r + 3;
      const startX = (CANVAS_WIDTH - (count - 1) * spacingX) / 2;
      const y = topY + r * spacingY;
      for (let c = 0; c < count; c++) {
        pegs.push({
          x: startX + c * spacingX,
          y,
          row: r,
          glow: 0
        });
      }
    }
    const binCount = RISK_MODES[risk].multipliers.length;
    const binWidth = CANVAS_WIDTH / binCount;
    const binY = topY + ROWS * spacingY + 20;
    const bins = RISK_MODES[risk].multipliers.map((mult, idx) => ({
      index: idx,
      mult,
      x: idx * binWidth,
      width: binWidth,
      y: binY,
      height: 38,
      hitGlow: 0
    }));
    engineRef.current.pegs = pegs;
    engineRef.current.bins = bins;
  }, [risk]);
  const handleBallLanded = (bin, ballBet) => {
    const mult = bin.mult;
    const payout = Math.floor(ballBet * mult);
    bin.hitGlow = 1;
    if (payout > 0) {
      if (addCoins) addCoins(payout);
      setTotalWon((w) => w + payout);
      if (mult >= 15) {
        try {
          playAirhorn();
          triggerConfetti();
        } catch (e) {
        }
        setJackpotEffect(true);
        setTimeout(() => setJackpotEffect(false), 2e3);
        feedService.publish({
          text: "🎰 " + (userProfile?.name || "HighRoller") + " smashed " + mult + "x on Cyber Plinko! (+" + payout.toLocaleString() + " CP)",
          type: "jackpot"
        });
      } else if (mult >= 2) {
        try {
          playWin();
        } catch (e) {
        }
      } else {
        try {
          playCollect();
        } catch (e) {
        }
      }
    } else {
      try {
        playCrash();
      } catch (e) {
      }
    }
    const currentHS = stats?.plinkoHighScore || 0;
    if (payout > currentHS && updateStat) {
      updateStat("plinkoHighScore", payout);
    }
    setHistory((h) => [{ mult, payout, id: Date.now() + Math.random() }, ...h.slice(0, 8)]);
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loop = () => {
      const engine = engineRef.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = "rgba(0, 255, 204, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      engine.pegs.forEach((peg) => {
        if (peg.glow > 0) {
          peg.glow -= 0.03;
          ctx.fillStyle = "rgba(255, 0, 127, " + peg.glow + ")";
          ctx.beginPath();
          ctx.arc(peg.x, peg.y, PEG_RADIUS + 8 * peg.glow, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = peg.glow > 0.1 ? "#ff007f" : "#ffffff";
        ctx.shadowColor = peg.glow > 0.1 ? "#ff007f" : "#00ffff";
        ctx.shadowBlur = peg.glow > 0.1 ? 15 : 6;
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      engine.bins.forEach((bin) => {
        const isEdge = bin.mult >= 15;
        const isMid = bin.mult >= 3 && bin.mult < 15;
        let binColor = "#00c6ff";
        if (isEdge) binColor = "#ff0055";
        else if (isMid) binColor = "#ffaa00";
        if (bin.hitGlow > 0) {
          bin.hitGlow -= 0.04;
          ctx.fillStyle = binColor;
          ctx.globalAlpha = bin.hitGlow * 0.4;
          ctx.fillRect(bin.x + 2, bin.y - 10, bin.width - 4, bin.height + 10);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = isEdge ? "rgba(255, 0, 85, 0.2)" : "rgba(0, 255, 204, 0.12)";
        ctx.strokeStyle = binColor;
        ctx.lineWidth = bin.hitGlow > 0.1 ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.roundRect(bin.x + 2, bin.y, bin.width - 4, bin.height, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = 'bold 12px "Orbitron", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bin.mult + "x", bin.x + bin.width / 2, bin.y + bin.height / 2);
      });
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      for (let i = engine.balls.length - 1; i >= 0; i--) {
        const b = engine.balls[i];
        b.vy += 0.28;
        b.vx *= 0.995;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.vx * 0.1;
        if (b.x < BALL_RADIUS + 10) {
          b.x = BALL_RADIUS + 10;
          b.vx = Math.abs(b.vx) * 0.7;
        } else if (b.x > CANVAS_WIDTH - BALL_RADIUS - 10) {
          b.x = CANVAS_WIDTH - BALL_RADIUS - 10;
          b.vx = -Math.abs(b.vx) * 0.7;
        }
        engine.pegs.forEach((peg) => {
          const dx = b.x - peg.x;
          const dy = b.y - peg.y;
          const dist = Math.hypot(dx, dy);
          const minDist = BALL_RADIUS + PEG_RADIUS;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            b.x += nx * overlap;
            b.y += ny * overlap;
            const dot = b.vx * nx + b.vy * ny;
            b.vx = b.vx - 1.5 * dot * nx + (Math.random() - 0.5) * 0.6;
            b.vy = (b.vy - 1.5 * dot * ny) * 0.65;
            if (Math.abs(b.vx) < 0.4) b.vx = (Math.random() > 0.5 ? 1 : -1) * 0.8;
            peg.glow = 1;
            playPegChime(peg.row);
            for (let k = 0; k < 3; k++) {
              engine.particles.push({
                x: peg.x,
                y: peg.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: "#00ffcc",
                life: 1
              });
            }
          }
        });
        if (b.y >= engine.bins[0]?.y) {
          const landedBin = engine.bins.find((bin) => b.x >= bin.x && b.x <= bin.x + bin.width);
          if (landedBin) {
            handleBallLanded(landedBin, b.bet);
          }
          engine.balls.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.shadowColor = "#00ffcc";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
        ctx.clip();
        const img = avatarImagesRef.current[b.avatarId];
        if (img && img.complete) {
          ctx.drawImage(img, -BALL_RADIUS, -BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
        } else {
          ctx.fillStyle = "#ffd700";
          ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }
      engine.animId = requestAnimationFrame(loop);
    };
    engineRef.current.animId = requestAnimationFrame(loop);
    return () => {
      if (engineRef.current.animId) {
        cancelAnimationFrame(engineRef.current.animId);
      }
    };
  }, [risk]);
  const dropBalls = (count = 1) => {
    const cost = bet * count;
    if (coins < cost) {
      try {
        playCrash();
      } catch (e) {
      }
      return;
    }
    if (addCoins) addCoins(-cost);
    if (incrementStat) {
      incrementStat("plinkoDrops", count);
      incrementStat("gamesPlayedCount", 1);
    }
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const dropOffsetX = (Math.random() - 0.5) * 40;
        engineRef.current.balls.push({
          x: CANVAS_WIDTH / 2 + dropOffsetX,
          y: 35,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 1,
          rotation: 0,
          avatarId: selectedAvatar.id,
          bet
        });
        try {
          playBoop();
        } catch (e) {
        }
      }, i * 180);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#07070e",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    paddingBottom: "100px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: "1px solid #222",
      paddingBottom: "15px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/arcade", style: { textDecoration: "none", color: "#00ffcc", fontWeight: "bold", fontSize: "1.1rem" }, children: "◄ ARCADE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.6rem", color: "#ff007f", textShadow: "0 0 15px rgba(255, 0, 127, 0.7)", letterSpacing: "2px" }, children: "CYBER PLINKO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#888", letterSpacing: "1px" }, children: "DROP THE BRO • PEGGED GRAVITY MATRIX" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffd700", fontWeight: "900", fontSize: "1.1rem" }, children: [
        "🪙 ",
        coins.toLocaleString(),
        " CP"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: jackpotEffect && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0, y: -20 },
        animate: { scale: 1.1, y: 0 },
        exit: { scale: 0, opacity: 0 },
        style: {
          position: "fixed",
          top: "120px",
          zIndex: 1e4,
          background: "linear-gradient(135deg, #ffd700, #ff0055)",
          padding: "15px 40px",
          borderRadius: "25px",
          color: "#000",
          fontWeight: "900",
          fontSize: "1.8rem",
          boxShadow: "0 0 50px gold",
          letterSpacing: "2px"
        },
        children: "🎉 MEGA JACKPOT MULTIPLIER! 🎉"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "25px",
      alignItems: "flex-start",
      flexWrap: "wrap",
      justifyContent: "center",
      maxWidth: "960px",
      width: "100%"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "#0a0a14",
        border: "3px solid #222",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(0, 255, 204, 0.15)",
        maxWidth: "100%"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          style: { maxWidth: "100%", height: "auto", display: "block" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        flex: "1 1 300px",
        maxWidth: "350px",
        background: "linear-gradient(145deg, #12121e, #0c0c16)",
        border: "1px solid #28283c",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "1px" }, children: "RISK TIER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }, children: Object.keys(RISK_MODES).map((key) => {
            const mode = RISK_MODES[key];
            const isSel = risk === key;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setRisk(key),
                style: {
                  background: isSel ? mode.color : "rgba(255,255,255,0.05)",
                  color: isSel ? "#000" : "#fff",
                  border: isSel ? "none" : "1px solid #333",
                  borderRadius: "8px",
                  padding: "8px 4px",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                },
                children: mode.label
              },
              key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "1px" }, children: "SELECT BRO CHIP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }, children: AVATARS.map((a) => {
            const isSel = selectedAvatar.id === a.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: () => setSelectedAvatar(a),
                style: {
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: isSel ? "3px solid #ff007f" : "2px solid #333",
                  boxShadow: isSel ? "0 0 12px #ff007f" : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#111"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.src, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: a.name })
              },
              a.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "1px" }, children: "BET PER DROP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }, children: [10, 25, 50, 100].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setBet(amt),
              style: {
                background: bet === amt ? "#ffd700" : "rgba(255,255,255,0.05)",
                color: bet === amt ? "#000" : "#fff",
                border: bet === amt ? "none" : "1px solid #333",
                borderRadius: "8px",
                padding: "8px",
                fontWeight: "bold",
                fontSize: "0.75rem",
                cursor: "pointer"
              },
              children: [
                amt,
                " CP"
              ]
            },
            amt
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SquishyButton,
            {
              onClick: () => dropBalls(1),
              disabled: coins < bet,
              style: {
                background: "linear-gradient(135deg, #ff007f, #7928ca)",
                color: "white",
                padding: "16px",
                fontSize: "1.1rem",
                fontWeight: "900",
                letterSpacing: "1px",
                boxShadow: "0 0 25px rgba(255, 0, 127, 0.4)"
              },
              children: [
                "DROP CHIP (",
                bet,
                " CP)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => dropBalls(3),
                disabled: coins < bet * 3,
                style: {
                  background: "rgba(0, 255, 204, 0.15)",
                  color: "#00ffcc",
                  border: "1px solid #00ffcc",
                  borderRadius: "10px",
                  padding: "10px",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                },
                children: "TRIPLE (3x)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => dropBalls(5),
                disabled: coins < bet * 5,
                style: {
                  background: "rgba(255, 215, 0, 0.15)",
                  color: "#ffd700",
                  border: "1px solid #ffd700",
                  borderRadius: "10px",
                  padding: "10px",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                },
                children: "FRENZY (5x)"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "1px" }, children: "RECENT DROPS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }, children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: "0.7rem" }, children: "No drops yet..." }) : history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              style: {
                background: h.mult >= 5 ? "#ff0055" : h.mult >= 1 ? "#00ffcc" : "#333",
                color: h.mult >= 1 ? "#000" : "#888",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: "bold",
                flexShrink: 0
              },
              children: [
                h.mult,
                "x"
              ]
            },
            h.id
          )) })
        ] })
      ] })
    ] })
  ] });
};
export {
  CyberPlinko as default
};
