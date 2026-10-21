import { u as useGamification, b as useToast, a as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, t as triggerConfetti, f as feedService } from "./index-wt3vNjP8.js";
const ITEM_TYPES = {
  SILVER_COIN: { id: "silver", name: "Silver CP Coin", radius: 14, color: "#00e5ff", value: 15, weight: 65, stroke: "#e0f7fa" },
  GOLD_COIN: { id: "gold", name: "Gold Cyber Coin", radius: 15, color: "#ffd700", value: 50, weight: 20, stroke: "#fff8e1" },
  GIANT_COIN: { id: "giant", name: "Giant Mega Token", radius: 25, color: "#ff007f", value: 200, weight: 5, stroke: "#ffe4e6" },
  DIAMOND: { id: "diamond", name: "Cyber Gem", radius: 16, color: "#00ff66", icon: "💎", value: 350, weight: 4 },
  DINO_FIG: { id: "dino", name: "Turbo Dino Figurine", radius: 22, skin: "/assets/skins/face_dino.png", value: 1e3, weight: 2 },
  BUNNY_FIG: { id: "bunny", name: "Cyber Bunny Figurine", radius: 22, skin: "/assets/skins/face_bunny.png", value: 1500, weight: 2 },
  WHALE_BAR: { id: "whale", name: "Whale Gold Ingot", radius: 24, skin: "/assets/skins/face_money.png", value: 5e3, weight: 1 },
  FRENZY_ORB: { id: "frenzy", name: "Frenzy Core", radius: 18, color: "#ffea00", icon: "⚡", value: 100, weight: 1, isFrenzy: true }
};
const TABLE_WIDTH = 480;
const TABLE_HEIGHT = 640;
const LEFT_GUTTER = 40;
const RIGHT_GUTTER = 440;
const FRONT_LIP = 570;
const PUSHER_MIN_Y = 70;
const PUSHER_MAX_Y = 160;
const CyberDozer = () => {
  const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playCollect, playWin, playAirhorn } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const animFrameRef = reactExports.useRef(null);
  const [tokens, setTokens] = reactExports.useState(40);
  const [regenTimer, setRegenTimer] = reactExports.useState(12);
  const [sessionCoinsWon, setSessionCoinsWon] = reactExports.useState(0);
  const [collectedPrizes, setCollectedPrizes] = reactExports.useState([]);
  const [dropperX, setDropperX] = reactExports.useState(TABLE_WIDTH / 2);
  const [shieldActive, setShieldActive] = reactExports.useState(false);
  const [shieldTimer, setShieldTimer] = reactExports.useState(0);
  const [quakeCooldown, setQuakeCooldown] = reactExports.useState(0);
  const [screenShake, setScreenShake] = reactExports.useState(0);
  const simRef = reactExports.useRef({
    coins: [],
    pusherY: PUSHER_MIN_Y,
    pusherDir: 1,
    pusherSpeed: 1.1,
    particles: [],
    nextId: 1,
    shakeOffset: { x: 0, y: 0 }
  });
  const playSynthSound = reactExports.useCallback((type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "clink") {
        const freqs = [2400, 3100, 3800, 4200];
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (type === "drop") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === "collect") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, t);
        osc.frequency.setValueAtTime(880, t + 0.06);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === "quake") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.45);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (type === "shield") {
        osc.type = "square";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.32);
      }
    } catch (e) {
    }
  }, []);
  const getRandomItemType = () => {
    const totalWeight = Object.values(ITEM_TYPES).reduce((acc, cur) => acc + cur.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of Object.values(ITEM_TYPES)) {
      if (rand < item.weight) return item;
      rand -= item.weight;
    }
    return ITEM_TYPES.SILVER_COIN;
  };
  const initTable = reactExports.useCallback(() => {
    const initialCoins = [];
    let idCounter = 1;
    for (let y = 180; y < 540; y += 28) {
      for (let x = 70; x < 410; x += 30) {
        if (Math.random() > 0.15) {
          const type = getRandomItemType();
          initialCoins.push({
            id: idCounter++,
            x: x + (Math.random() * 8 - 4),
            y: y + (Math.random() * 8 - 4),
            vx: 0,
            vy: 0,
            radius: type.radius,
            type,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05
          });
        }
      }
    }
    for (let y = 80; y < 140; y += 28) {
      for (let x = 80; x < 400; x += 32) {
        const type = getRandomItemType();
        initialCoins.push({
          id: idCounter++,
          x: x + (Math.random() * 6 - 3),
          y: y + (Math.random() * 6 - 3),
          vx: 0,
          vy: 0,
          radius: type.radius,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.05
        });
      }
    }
    simRef.current.coins = initialCoins;
    simRef.current.nextId = idCounter;
  }, []);
  const dropCoinAt = reactExports.useCallback((xPos, forcedType = null) => {
    if (tokens <= 0 && !forcedType) {
      showToast("Out of Arcade Tokens! Refill or wait for timer!", "error");
      return false;
    }
    if (!forcedType) {
      setTokens((prev) => Math.max(0, prev - 1));
      playSynthSound("drop");
      if (incrementStat) {
        incrementStat("dozerCoinsDropped", 1);
        incrementStat("gamesPlayedCount", 1);
      }
    }
    const type = forcedType || getRandomItemType();
    const clampedX = Math.max(LEFT_GUTTER + 20, Math.min(RIGHT_GUTTER - 20, xPos));
    const newCoin = {
      id: simRef.current.nextId++,
      x: clampedX,
      y: 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 2.8 + Math.random() * 1.2,
      radius: type.radius,
      type,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.1
    };
    simRef.current.coins.push(newCoin);
    return true;
  }, [tokens, showToast, incrementStat, playSynthSound]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setRegenTimer((prev) => {
        if (prev <= 1) {
          setTokens((t) => Math.min(50, t + 1));
          return 12;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setShieldTimer((prev) => {
        if (prev <= 1) {
          setShieldActive(false);
          return 0;
        }
        return prev - 1;
      });
      setQuakeCooldown((prev) => Math.max(0, prev - 1));
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  const handleTriggerQuake = () => {
    if (quakeCooldown > 0) return;
    setQuakeCooldown(18);
    setScreenShake(12);
    playSynthSound("quake");
    showToast("💥 TABLE SLAM! COIN QUAKE ACTIVATED!", "success");
    simRef.current.coins.forEach((c) => {
      c.vy += 3.5 + Math.random() * 2.5;
      c.vx += (Math.random() - 0.5) * 4;
    });
    setTimeout(() => setScreenShake(0), 600);
  };
  const handleTriggerShields = () => {
    if (shieldActive) return;
    setShieldActive(true);
    setShieldTimer(20);
    playSynthSound("shield");
    showToast("🛡️ LASER SIDE SHIELDS ENGAGED! 20s PROTECTED!", "info");
  };
  const triggerCoinShower = (count = 6) => {
    showToast("⚡ COIN FRENZY SHOWER! ⚡", "warning");
    playSynthSound("collect");
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const rx = LEFT_GUTTER + 40 + Math.random() * (RIGHT_GUTTER - LEFT_GUTTER - 80);
        dropCoinAt(rx, ITEM_TYPES.GOLD_COIN);
      }, i * 140);
    }
  };
  const handleBuyTokens = () => {
    if ((coins ?? 0) < 150) {
      showToast("Need 150 CP to refill 25 Arcade Tokens!", "error");
      return;
    }
    if (addCoins) addCoins(-150);
    setTokens((prev) => prev + 25);
    playCollect();
    showToast("+25 ARCADE TOKENS REFILLED!", "success");
  };
  reactExports.useEffect(() => {
    initTable();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loadedSkins = {};
    Object.values(ITEM_TYPES).forEach((item) => {
      if (item.skin) {
        const img = new Image();
        img.src = item.skin;
        loadedSkins[item.id] = img;
      }
    });
    performance.now();
    const loop = (currentTime) => {
      const sim = simRef.current;
      sim.pusherY += sim.pusherDir * sim.pusherSpeed;
      if (sim.pusherY >= PUSHER_MAX_Y) {
        sim.pusherDir = -1;
      } else if (sim.pusherY <= PUSHER_MIN_Y) {
        sim.pusherDir = 1;
      }
      const pusherVelocity = sim.pusherDir * sim.pusherSpeed;
      const coinsToKeep = [];
      const collectedThisFrame = [];
      for (let i = 0; i < sim.coins.length; i++) {
        const c = sim.coins[i];
        c.vy += 0.24;
        c.vx *= 0.94;
        c.vy *= 0.94;
        if (c.y >= sim.pusherY - 10 && c.y <= sim.pusherY + 40 && sim.pusherDir > 0) {
          c.vy += pusherVelocity * 1.25;
        }
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotSpeed;
        if (shieldActive) {
          if (c.x - c.radius < LEFT_GUTTER) {
            c.x = LEFT_GUTTER + c.radius;
            c.vx = Math.abs(c.vx) * 0.7;
          } else if (c.x + c.radius > RIGHT_GUTTER) {
            c.x = RIGHT_GUTTER - c.radius;
            c.vx = -Math.abs(c.vx) * 0.7;
          }
        } else {
          if ((c.x < LEFT_GUTTER || c.x > RIGHT_GUTTER) && c.y > 160) {
            continue;
          }
        }
        if (c.y >= FRONT_LIP) {
          collectedThisFrame.push(c);
          continue;
        }
        coinsToKeep.push(c);
      }
      const iterations = 3;
      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < coinsToKeep.length; i++) {
          const c1 = coinsToKeep[i];
          for (let j = i + 1; j < coinsToKeep.length; j++) {
            const c2 = coinsToKeep[j];
            const dx = c2.x - c1.x;
            const dy = c2.y - c1.y;
            const distSq = dx * dx + dy * dy;
            const minDist = c1.radius + c2.radius;
            if (distSq < minDist * minDist && distSq > 1e-3) {
              const dist = Math.sqrt(distSq);
              const overlap = (minDist - dist) * 0.5;
              const nx = dx / dist;
              const ny = dy / dist;
              c1.x -= nx * overlap;
              c1.y -= ny * overlap;
              c2.x += nx * overlap;
              c2.y += ny * overlap;
              const kx = c1.vx - c2.vx;
              const ky = c1.vy - c2.vy;
              const p = 2 * (nx * kx + ny * ky) / 2;
              c1.vx -= p * nx * 0.4;
              c1.vy -= p * ny * 0.4;
              c2.vx += p * nx * 0.4;
              c2.vy += p * ny * 0.4;
            }
          }
        }
      }
      sim.coins = coinsToKeep;
      if (collectedThisFrame.length > 0) {
        let totalPrize = 0;
        let hasBigPrize = false;
        collectedThisFrame.forEach((item) => {
          totalPrize += item.type.value;
          if (item.type.value >= 1e3) hasBigPrize = true;
          if (item.type.isFrenzy) triggerCoinShower(5);
          for (let p = 0; p < 8; p++) {
            sim.particles.push({
              x: item.x,
              y: FRONT_LIP,
              vx: (Math.random() - 0.5) * 5,
              vy: -(Math.random() * 4 + 2),
              color: item.type.color || "#ffd700",
              life: 1,
              size: Math.random() * 4 + 2
            });
          }
        });
        if (totalPrize > 0) {
          if (addCoins) addCoins(totalPrize);
          setSessionCoinsWon((prev) => prev + totalPrize);
          if (hasBigPrize) {
            playAirhorn();
            playWin();
            triggerConfetti();
            showToast(`🏆 BIG WIN! Dropped +${totalPrize.toLocaleString()} CP Figurine!`, "success");
          } else {
            playSynthSound("collect");
          }
          if (incrementStat) {
            incrementStat("dozerCoinsCollected", collectedThisFrame.length);
            incrementStat("coinsEarnedToday", totalPrize);
          }
          setCollectedPrizes((prev) => [
            ...collectedThisFrame.map((c) => ({
              name: c.type.name,
              value: c.type.value,
              icon: c.type.icon || "🪙",
              skin: c.type.skin
            })),
            ...prev.slice(0, 5)
          ]);
          if (totalPrize >= 1e3) {
            feedService.broadcast("arcade_win", {
              player: userProfile?.name || "CoinMaster",
              game: "Cyber Coin Dozer",
              coinsWon: totalPrize,
              avatar: collectedThisFrame[0].type.skin || "/assets/skins/face_star.png"
            });
          }
        }
      }
      const aliveParticles = [];
      for (let i = 0; i < sim.particles.length; i++) {
        const p = sim.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.035;
        if (p.life > 0) aliveParticles.push(p);
      }
      sim.particles = aliveParticles;
      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
      ctx.save();
      if (screenShake > 0) {
        const ox = (Math.random() - 0.5) * screenShake;
        const oy = (Math.random() - 0.5) * screenShake;
        ctx.translate(ox, oy);
      }
      const bgGrad = ctx.createLinearGradient(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
      bgGrad.addColorStop(0, "#060b14");
      bgGrad.addColorStop(0.5, "#0b1626");
      bgGrad.addColorStop(1, "#03070d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < TABLE_WIDTH; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, TABLE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < TABLE_HEIGHT; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(TABLE_WIDTH, y);
        ctx.stroke();
      }
      ctx.fillStyle = "#020408";
      ctx.fillRect(0, 0, LEFT_GUTTER, TABLE_HEIGHT);
      ctx.fillRect(RIGHT_GUTTER, 0, TABLE_WIDTH - RIGHT_GUTTER, TABLE_HEIGHT);
      ctx.strokeStyle = shieldActive ? "#00ff66" : "rgba(255, 0, 85, 0.4)";
      ctx.lineWidth = 3;
      if (shieldActive) {
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 12;
      }
      ctx.beginPath();
      ctx.moveTo(LEFT_GUTTER, 60);
      ctx.lineTo(LEFT_GUTTER, FRONT_LIP);
      ctx.moveTo(RIGHT_GUTTER, 60);
      ctx.lineTo(RIGHT_GUTTER, FRONT_LIP);
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (shieldActive) {
        ctx.fillStyle = "rgba(0, 255, 102, 0.2)";
        ctx.fillRect(LEFT_GUTTER - 6, 60, 6, FRONT_LIP - 60);
        ctx.fillRect(RIGHT_GUTTER, 60, 6, FRONT_LIP - 60);
        ctx.fillStyle = "#00ff66";
        ctx.font = "900 10px monospace";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(LEFT_GUTTER / 2, TABLE_HEIGHT / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("⚡ SHIELDS ACTIVE ⚡", 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(RIGHT_GUTTER + 20, TABLE_HEIGHT / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("⚡ SHIELDS ACTIVE ⚡", 0, 0);
        ctx.restore();
      }
      const pusherY = sim.pusherY;
      const pusherGrad = ctx.createLinearGradient(0, pusherY - 35, 0, pusherY + 20);
      pusherGrad.addColorStop(0, "#1e293b");
      pusherGrad.addColorStop(0.5, "#334155");
      pusherGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = pusherGrad;
      ctx.fillRect(LEFT_GUTTER, pusherY - 40, RIGHT_GUTTER - LEFT_GUTTER, 50);
      ctx.fillStyle = "#00e5ff";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;
      ctx.fillRect(LEFT_GUTTER, pusherY + 8, RIGHT_GUTTER - LEFT_GUTTER, 5);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "800 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("◄◄ PUSHER 2088 ►►", TABLE_WIDTH / 2, pusherY - 14);
      const chuteGrad = ctx.createLinearGradient(0, FRONT_LIP, 0, TABLE_HEIGHT);
      chuteGrad.addColorStop(0, "#ffd700");
      chuteGrad.addColorStop(0.2, "#b45309");
      chuteGrad.addColorStop(1, "#000000");
      ctx.fillStyle = chuteGrad;
      ctx.fillRect(LEFT_GUTTER, FRONT_LIP, RIGHT_GUTTER - LEFT_GUTTER, TABLE_HEIGHT - FRONT_LIP);
      ctx.fillStyle = "#000000";
      ctx.font = "900 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("▼ DROP ZONE / WIN HOPPER ▼", TABLE_WIDTH / 2, FRONT_LIP + 30);
      for (let i = 0; i < sim.coins.length; i++) {
        const c = sim.coins[i];
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        if (c.type.skin && loadedSkins[c.type.id] && loadedSkins[c.type.id].complete) {
          ctx.beginPath();
          ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#ffd700";
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, c.radius - 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(loadedSkins[c.type.id], -c.radius, -c.radius, c.radius * 2, c.radius * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
          const coinGrad = ctx.createRadialGradient(-c.radius * 0.3, -c.radius * 0.3, c.radius * 0.1, 0, 0, c.radius);
          coinGrad.addColorStop(0, c.type.stroke || "#ffffff");
          coinGrad.addColorStop(0.7, c.type.color || "#00e5ff");
          coinGrad.addColorStop(1, "#000000");
          ctx.fillStyle = coinGrad;
          ctx.fill();
          ctx.strokeStyle = c.type.stroke || "rgba(255,255,255,0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, c.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
          if (c.type.icon) {
            ctx.font = `${Math.floor(c.radius * 1)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(c.type.icon, 0, 0);
          } else {
            ctx.fillStyle = "#000";
            ctx.font = "900 9px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CP", 0, 0);
          }
        }
        ctx.restore();
      }
      for (let i = 0; i < sim.particles.length; i++) {
        const p = sim.particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(dropperX, 20);
      ctx.lineTo(dropperX, 70);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ff007f";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dropperX, 25, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initTable, shieldActive, screenShake, dropperX, addCoins, incrementStat, playAirhorn, playWin, playSynthSound, showToast, userProfile]);
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches && e.touches[0].clientX;
    const x = (clientX - rect.left) / rect.width * TABLE_WIDTH;
    setDropperX(x);
    dropCoinAt(x);
  };
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * TABLE_WIDTH;
    setDropperX(Math.max(LEFT_GUTTER + 20, Math.min(RIGHT_GUTTER - 20, x)));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#00e5ff08_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/arcade",
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono text-xs font-bold shadow-lg active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◄" }),
            " ARCADE HUB"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-black flex items-center gap-1.5 shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            tokens,
            " TOKENS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-cyan-400 font-normal", children: [
            "(",
            regenTimer,
            "s)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-1.5 shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            (coins ?? 0).toLocaleString(),
            " CP"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[760px] bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl animate-spin", style: { animationDuration: "6s" }, children: "⚙️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-yellow-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]", children: "CYBER COIN DOZER 2088" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-black/60 rounded-full border border-cyan-500/30 text-[11px] font-mono text-cyan-300 tracking-wide", children: [
          "SESSION WIN: +",
          sessionCoinsWon.toLocaleString(),
          " CP"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-[480px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(0,229,255,0.3)] bg-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: TABLE_WIDTH,
            height: TABLE_HEIGHT,
            onClick: handleCanvasClick,
            onMouseMove: handleCanvasMouseMove,
            className: "w-full h-full cursor-crosshair touch-none"
          }
        ),
        shieldActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-mono text-xs font-black rounded-full shadow-[0_0_15px_#00ff66] animate-pulse", children: [
          "🛡️ SHIELDS: ",
          shieldTimer,
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[480px] grid grid-cols-3 gap-2 mt-3 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleTriggerQuake,
            disabled: quakeCooldown > 0,
            className: `p-2.5 rounded-xl border flex flex-col items-center justify-center font-black transition-all ${quakeCooldown > 0 ? "bg-slate-900 border-slate-800 text-slate-500 opacity-60" : "bg-red-500/20 border-red-500 text-red-300 hover:brightness-125 shadow-[0_0_15px_rgba(255,0,85,0.3)] active:scale-95"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💥 COIN QUAKE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] mt-0.5", children: quakeCooldown > 0 ? `${quakeCooldown}s` : "READY" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleTriggerShields,
            disabled: shieldActive,
            className: `p-2.5 rounded-xl border flex flex-col items-center justify-center font-black transition-all ${shieldActive ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:brightness-125 shadow-[0_0_15px_rgba(0,229,255,0.3)] active:scale-95"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛡️ SIDE SHIELDS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] mt-0.5", children: shieldActive ? `${shieldTimer}s` : "ACTIVATE" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleBuyTokens,
            className: "p-2.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400 flex flex-col items-center justify-center font-black transition-all active:scale-95 shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙 REFILL 25" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] mt-0.5", children: "150 CP" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-center font-mono text-xs text-slate-400", children: "💡 TAP / CLICK ANYWHERE ON THE TABLE TO DROP COINS & PUSH FIGURINES OVER THE FRONT LIP!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 bg-black/60 border border-slate-800 rounded-2xl p-3 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping" }),
            "COLLECTED PRIZES & FIGURINES"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400", children: "WHALE INGOT = 5,000 CP" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: collectedPrizes.length > 0 ? collectedPrizes.slice(0, 4).map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2", children: [
          p.skin ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.skin, alt: p.name, className: "w-6 h-6 rounded-full object-cover border border-yellow-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: p.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-300 truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-yellow-400 font-black", children: [
              "+",
              p.value,
              " CP"
            ] })
          ] })
        ] }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-2 text-center text-slate-500 italic", children: "Push coins and figurines into the drop hopper to collect CP!" }) })
      ] })
    ] })
  ] });
};
export {
  CyberDozer as default
};
