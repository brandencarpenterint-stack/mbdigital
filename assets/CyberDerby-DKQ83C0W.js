import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-8Nabfto9.js";
const RACERS = [
  { id: "r1", name: "Turbo Dino", num: 1, skin: "/assets/skins/face_dino.png", color: "#00ff66", odds: 2.8, speed: 90, accel: 86, chaos: 25, archetype: "SPEED DEMON", quote: "Rawr means full throttle!" },
  { id: "r2", name: "Cyber Bunny", num: 2, skin: "/assets/skins/face_bunny.png", color: "#ff007f", odds: 3.5, speed: 84, accel: 96, chaos: 20, archetype: "ROCKET START", quote: "Hop ahead, leave'em in dust." },
  { id: "r3", name: "Gamer Bro 3K", num: 3, skin: "/assets/skins/face_gamer.png", color: "#00e5ff", odds: 4.2, speed: 86, accel: 82, chaos: 40, archetype: "TACTICIAN", quote: "Calculated optimal trajectory." },
  { id: "r4", name: "Golden Money", num: 4, skin: "/assets/skins/face_money.png", color: "#ffd700", odds: 5.5, speed: 82, accel: 80, chaos: 55, archetype: "WEALTH SURGE", quote: "Money buys horsepower, baby!" },
  { id: "r5", name: "Astro Pilot", num: 5, skin: "/assets/skins/face_astro.png", color: "#9d4edd", odds: 9, speed: 88, accel: 74, chaos: 70, archetype: "WARP THRUST", quote: "Igniting hyper-drive!" },
  { id: "r6", name: "Neko Cat", num: 6, skin: "/assets/skins/face_cat.png", color: "#ff5e7e", odds: 14, speed: 80, accel: 76, chaos: 65, archetype: "NINE LIVES", quote: "Purrfect draft on the inside." },
  { id: "r7", name: "Spooky Pumpkin", num: 7, skin: "/assets/skins/face_pumpkin.png", color: "#ff7700", odds: 25, speed: 78, accel: 84, chaos: 85, archetype: "CHAOS WILDCARD", quote: "Tricks, treats & turbo!" },
  { id: "r8", name: "Void Titan Dino", num: 8, skin: "/assets/skins/face_dino_dark.jpg", color: "#ff0033", odds: 50, speed: 95, accel: 62, chaos: 92, archetype: "MEGABOSS", quote: "UNSTOPPABLE VOID FREIGHT." }
];
const TRACK_LENGTH = 1100;
const LANE_HEIGHT = 48;
const TRACK_TOP = 110;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 520;
const CyberDerby = () => {
  const { coins, addCoins, spendCoins, updateStat, incrementStat, userProfile, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playCrash, playAirhorn } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const animIdRef = reactExports.useRef(null);
  const skinImagesRef = reactExports.useRef({});
  const [gameState, setGameState] = reactExports.useState("BETTING");
  const [selectedRacer, setSelectedRacer] = reactExports.useState(RACERS[0]);
  const [betType, setBetType] = reactExports.useState("WIN");
  const [secondRacer, setSecondRacer] = reactExports.useState(RACERS[1]);
  const [betAmount, setBetAmount] = reactExports.useState(100);
  const [countdownVal, setCountdownVal] = reactExports.useState(3);
  const [liveRankings, setLiveRankings] = reactExports.useState(RACERS);
  const [raceCommentary, setRaceCommentary] = reactExports.useState(["WELCOME TO BRO GRAND PRIX 2088! PLACE YOUR BETS!"]);
  const [raceResults, setRaceResults] = reactExports.useState([]);
  const [winPayout, setWinPayout] = reactExports.useState(0);
  const [nitroAvailable, setNitroAvailable] = reactExports.useState(true);
  const [slickAvailable, setSlickAvailable] = reactExports.useState(true);
  const raceDataRef = reactExports.useRef({
    racers: [],
    hazards: [],
    cameraX: 0,
    startTime: 0,
    finishedCount: 0,
    lastCommentTime: 0
  });
  reactExports.useEffect(() => {
    RACERS.forEach((r) => {
      const img = new Image();
      img.src = r.skin;
      skinImagesRef.current[r.id] = img;
    });
  }, []);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };
  const playBeep = (freq, duration = 0.15, type = "sine") => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
    }
  };
  const playNitroSynth = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
    }
  };
  const playSlickSynth = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
    }
  };
  const playWinFanfare = () => {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        setTimeout(() => playBeep(f, 0.25, "triangle"), idx * 120);
      });
    } catch (e) {
    }
  };
  const handleStartRace = () => {
    if (gameState !== "BETTING") return;
    const totalCost = betAmount;
    if ((coins || 0) < totalCost) {
      playCrash();
      showToast("Not enough coins to place this bet!", "error");
      return;
    }
    spendCoins(totalCost);
    setGameState("COUNTDOWN");
    setCountdownVal(3);
    setNitroAvailable(true);
    setSlickAvailable(true);
    setRaceResults([]);
    setWinPayout(0);
    setRaceCommentary(["RACERS LINING UP AT THE GATES..."]);
    const initializedRacers = RACERS.map((r, idx) => ({
      ...r,
      laneIndex: idx,
      x: 60,
      y: TRACK_TOP + idx * LANE_HEIGHT + LANE_HEIGHT / 2,
      speed: 0,
      rotation: 0,
      nitroTimer: 0,
      spinTimer: 0,
      finished: false,
      finishTime: 0,
      particles: []
    }));
    const hazards = [];
    for (let l = 0; l < RACERS.length; l++) {
      hazards.push({
        id: "n_" + l,
        type: "nitro",
        x: 200 + Math.random() * 600,
        laneIndex: l,
        active: true
      });
      hazards.push({
        id: "s_" + l,
        type: "slick",
        x: 300 + Math.random() * 600,
        laneIndex: l,
        active: true
      });
    }
    raceDataRef.current = {
      racers: initializedRacers,
      hazards,
      cameraX: 0,
      startTime: 0,
      finishedCount: 0,
      lastCommentTime: 0
    };
    playBeep(440, 0.15, "sine");
    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownVal(count);
        playBeep(440, 0.15, "sine");
      } else if (count === 0) {
        setCountdownVal("GO!");
        playBeep(880, 0.35, "triangle");
        clearInterval(countInterval);
        setTimeout(() => {
          setGameState("RACING");
          raceDataRef.current.startTime = performance.now();
          setRaceCommentary((prev) => ["GREEN FLAG! THEY'RE OFF LIKE LIGHTNING!", ...prev]);
        }, 400);
      }
    }, 1e3);
  };
  const triggerPlayerNitro = () => {
    if (!nitroAvailable || gameState !== "RACING") return;
    setNitroAvailable(false);
    playNitroSynth();
    const target = raceDataRef.current.racers.find((r) => r.id === selectedRacer.id);
    if (target && !target.finished) {
      target.nitroTimer = 90;
      setRaceCommentary((prev) => ["⚡ OVERDRIVE ACTIVATED! " + target.name.toUpperCase() + " SURGES! 🔥", ...prev.slice(0, 4)]);
    }
  };
  const triggerPlayerSlick = () => {
    if (!slickAvailable || gameState !== "RACING") return;
    setSlickAvailable(false);
    playSlickSynth();
    const contenders = [...raceDataRef.current.racers].sort((a, b) => b.x - a.x);
    const leader = contenders.find((r) => r.id !== selectedRacer.id && !r.finished) || contenders[0];
    if (leader) {
      raceDataRef.current.hazards.push({
        id: "trap_" + Date.now(),
        type: "slick",
        x: leader.x + 80,
        laneIndex: leader.laneIndex,
        active: true
      });
      setRaceCommentary((prev) => ["🍌 TACTICAL OIL SLICK DROPPED ON LANE " + leader.num + "!", ...prev.slice(0, 4)]);
    }
  };
  const finishRace = (racersList) => {
    setGameState("RESULTS");
    const sorted = [...racersList].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.x - a.x;
    });
    setRaceResults(sorted);
    const winner = sorted[0];
    const runnerUp = sorted[1];
    let wonCoins = 0;
    if (betType === "WIN") {
      if (winner.id === selectedRacer.id) {
        wonCoins = Math.floor(betAmount * selectedRacer.odds);
      }
    } else if (betType === "EXACTA") {
      if (winner.id === selectedRacer.id && runnerUp.id === secondRacer.id) {
        wonCoins = Math.floor(betAmount * selectedRacer.odds * secondRacer.odds * 2.2);
      }
    }
    setWinPayout(wonCoins);
    if (incrementStat) {
      incrementStat("derbyRaces", 1);
      incrementStat("gamesPlayedCount", 1);
    }
    if (wonCoins > 0) {
      if (addCoins) addCoins(wonCoins);
      if (incrementStat) incrementStat("derbyWins", 1);
      const currentHS = stats?.derbyHighScore || 0;
      if (wonCoins > currentHS && updateStat) {
        updateStat("derbyHighScore", wonCoins);
      }
      playWinFanfare();
      playWin();
      if (wonCoins >= 500) {
        triggerConfetti();
        feedService.publish("just won " + wonCoins.toLocaleString() + " CP on the Bro Derby! 🏇⚡", "win", userProfile?.name || "Player");
      }
    } else {
      try {
        playCrash();
      } catch (e) {
      }
    }
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loop = (timestamp) => {
      const data = raceDataRef.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (gameState === "RACING") {
        let currentLeader = data.racers[0];
        data.racers.forEach((r) => {
          if (r.finished) return;
          const maxSpeed = 3.6 + r.speed / 100 * 1.8;
          const accelStep = r.accel / 100 * 0.12;
          r.speed = Math.min(maxSpeed, r.speed + accelStep);
          r.speed += (Math.random() - 0.49) * (r.chaos / 100) * 0.4;
          if (r.nitroTimer > 0) {
            r.nitroTimer--;
            r.speed = Math.max(r.speed, maxSpeed + 2.8);
            for (let p = 0; p < 2; p++) {
              r.particles.push({
                x: r.x - 20,
                y: r.y + (Math.random() - 0.5) * 8,
                vx: -(2 + Math.random() * 3),
                vy: (Math.random() - 0.5) * 1.5,
                color: Math.random() > 0.4 ? "#00e5ff" : "#ffffff",
                life: 1
              });
            }
          }
          if (r.spinTimer > 0) {
            r.spinTimer--;
            r.rotation += 0.35;
            r.speed *= 0.75;
          } else {
            r.rotation = 0;
          }
          r.x += r.speed;
          if (Math.random() > 0.4) {
            r.particles.push({
              x: r.x - 18,
              y: r.y + (Math.random() - 0.5) * 6,
              vx: -1.5,
              vy: (Math.random() - 0.5) * 0.8,
              color: r.color,
              life: 0.8
            });
          }
          data.hazards.forEach((h) => {
            if (h.active && h.laneIndex === r.laneIndex && Math.abs(r.x - h.x) < 22) {
              h.active = false;
              if (h.type === "nitro") {
                r.nitroTimer = 75;
                playNitroSynth();
                setRaceCommentary((prev) => ["⚡ " + r.name.toUpperCase() + " HIT A NITRO PAD!", ...prev.slice(0, 4)]);
              } else if (h.type === "slick") {
                r.spinTimer = 45;
                playSlickSynth();
                setRaceCommentary((prev) => ["🍌 " + r.name.toUpperCase() + " SLIPPED ON OIL!", ...prev.slice(0, 4)]);
              }
            }
          });
          if (r.x >= TRACK_LENGTH && !r.finished) {
            r.finished = true;
            r.finishTime = (timestamp - data.startTime) / 1e3;
            data.finishedCount++;
            if (data.finishedCount === 1) {
              playAirhorn();
              setRaceCommentary((prev) => ["🏁 " + r.name.toUpperCase() + " CROSSES THE LINE 1ST!", ...prev.slice(0, 4)]);
            }
          }
          if (r.x > currentLeader.x) {
            currentLeader = r;
          }
        });
        const targetCamX = Math.max(0, Math.min(TRACK_LENGTH - CANVAS_WIDTH + 140, currentLeader.x - 300));
        data.cameraX += (targetCamX - data.cameraX) * 0.08;
        const sortedLiving = [...data.racers].sort((a, b) => b.x - a.x);
        setLiveRankings(sortedLiving);
        if (data.finishedCount >= 1 && (data.finishedCount >= 4 || data.racers.every((r) => r.finished || r.x >= TRACK_LENGTH - 40))) {
          finishRace(data.racers);
        }
      }
      const camX = data.cameraX || 0;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, TRACK_TOP);
      skyGrad.addColorStop(0, "#04040c");
      skyGrad.addColorStop(1, "#0e0e24");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, TRACK_TOP);
      ctx.fillStyle = "#141432";
      for (let i = 0; i < 25; i++) {
        const bx = (i * 90 - camX * 0.25) % (CANVAS_WIDTH + 150);
        const bWidth = 65;
        const bHeight = 40 + i * 37 % 65;
        ctx.fillRect(bx, TRACK_TOP - bHeight, bWidth, bHeight);
        ctx.fillStyle = i % 3 === 0 ? "#00e5ff" : "#ff007f";
        ctx.fillRect(bx + 12, TRACK_TOP - bHeight + 10, 4, 4);
        ctx.fillRect(bx + 32, TRACK_TOP - bHeight + 22, 4, 4);
        ctx.fillStyle = "#141432";
      }
      ctx.fillStyle = "rgba(0, 229, 255, 0.05)";
      ctx.fillRect(0, TRACK_TOP - 2, CANVAS_WIDTH, 2);
      for (let l = 0; l < 8; l++) {
        const laneY = TRACK_TOP + l * LANE_HEIGHT;
        ctx.fillStyle = l % 2 === 0 ? "#0a0a16" : "#0f0f20";
        ctx.fillRect(0, laneY, CANVAS_WIDTH, LANE_HEIGHT);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.setLineDash([15, 15]);
        ctx.lineDashOffset = camX % 30;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, laneY);
        ctx.lineTo(CANVAS_WIDTH, laneY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = "bold 12px Orbitron, monospace";
        ctx.textAlign = "left";
        ctx.fillText(L, 10, laneY + 28);
      }
      ctx.fillStyle = "#00e5ff";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 8;
      ctx.fillRect(0, TRACK_TOP + 8 * LANE_HEIGHT, CANVAS_WIDTH, 4);
      ctx.shadowBlur = 0;
      for (let d = 100; d <= TRACK_LENGTH; d += 100) {
        const screenX = d - camX;
        if (screenX >= -50 && screenX <= CANVAS_WIDTH + 50) {
          ctx.strokeStyle = d === TRACK_LENGTH ? "#ffd700" : "rgba(0, 229, 255, 0.25)";
          ctx.lineWidth = d === TRACK_LENGTH ? 6 : 2;
          ctx.beginPath();
          ctx.moveTo(screenX, TRACK_TOP);
          ctx.lineTo(screenX, TRACK_TOP + 8 * LANE_HEIGHT);
          ctx.stroke();
          if (d === TRACK_LENGTH) {
            const bW = 24;
            const bH = 10;
            const bX = screenX - bW / 2;
            const bY = TRACK_TOP - 20;
            ctx.fillStyle = "#000";
            ctx.fillRect(bX, bY, bW, bH);
            ctx.fillStyle = "#fff";
            for (let rIdx = 0; rIdx < 2; rIdx++) {
              for (let cIdx = 0; cIdx < 4; cIdx++) {
                if ((rIdx + cIdx) % 2 === 0) {
                  ctx.fillRect(bX + cIdx * 6, bY + rIdx * 5, 6, 5);
                }
              }
            }
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 11px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText("FINISH // 1100M", screenX, TRACK_TOP - 24);
          } else {
            ctx.fillStyle = "rgba(0, 229, 255, 0.6)";
            ctx.font = "10px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText(d + "M", screenX, TRACK_TOP - 8);
          }
        }
      }
      const startScreenX = 60 - camX;
      if (startScreenX >= -40 && startScreenX <= CANVAS_WIDTH + 40) {
        ctx.strokeStyle = "#ff007f";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startScreenX, TRACK_TOP);
        ctx.lineTo(startScreenX, TRACK_TOP + 8 * LANE_HEIGHT);
        ctx.stroke();
        ctx.fillStyle = "#ff007f";
        ctx.font = "10px Orbitron";
        ctx.fillText("START", startScreenX, TRACK_TOP - 8);
      }
      data.hazards.forEach((h) => {
        if (!h.active) return;
        const hx = h.x - camX;
        const hy = TRACK_TOP + h.laneIndex * LANE_HEIGHT + LANE_HEIGHT / 2;
        if (hx >= -40 && hx <= CANVAS_WIDTH + 40) {
          if (h.type === "nitro") {
            ctx.fillStyle = "#00e5ff";
            ctx.shadowColor = "#00e5ff";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(hx + 10, hy);
            ctx.lineTo(hx - 10, hy - 12);
            ctx.lineTo(hx - 4, hy);
            ctx.lineTo(hx - 10, hy + 12);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (h.type === "slick") {
            ctx.save();
            ctx.shadowColor = "#ff0055";
            ctx.shadowBlur = 12;
            const slickGrad = ctx.createRadialGradient(hx, hy, 2, hx, hy, 16);
            slickGrad.addColorStop(0, "rgba(255, 0, 85, 0.95)");
            slickGrad.addColorStop(0.6, "rgba(255, 170, 0, 0.7)");
            slickGrad.addColorStop(1, "rgba(255, 0, 85, 0)");
            ctx.fillStyle = slickGrad;
            ctx.beginPath();
            ctx.ellipse(hx, hy, 16, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(hx - 7, hy + 2);
            ctx.lineTo(hx - 2, hy - 4);
            ctx.lineTo(hx + 3, hy + 3);
            ctx.lineTo(hx + 8, hy - 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      });
      const racersToDraw = gameState === "BETTING" ? RACERS.map((r, i) => ({
        ...r,
        laneIndex: i,
        x: 60,
        y: TRACK_TOP + i * LANE_HEIGHT + LANE_HEIGHT / 2,
        rotation: 0,
        particles: [],
        nitroTimer: 0
      })) : data.racers;
      racersToDraw.forEach((r) => {
        const rx = r.x - camX;
        const ry = r.y;
        if (r.particles) {
          for (let pIdx = r.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = r.particles[pIdx];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.life -= 0.05;
            if (pt.life <= 0) {
              r.particles.splice(pIdx, 1);
            } else {
              ctx.fillStyle = pt.color;
              ctx.globalAlpha = pt.life;
              ctx.beginPath();
              ctx.arc(pt.x - camX, pt.y, 3 * pt.life, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }
        ctx.save();
        ctx.translate(rx, ry);
        if (r.rotation) ctx.rotate(r.rotation);
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#1e1e2f";
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(-14, -14);
        ctx.lineTo(-20, -8);
        ctx.lineTo(-20, 8);
        ctx.lineTo(-14, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = r.nitroTimer > 0 ? "#00e5ff" : r.color;
        ctx.beginPath();
        ctx.arc(-20, 0, r.nitroTimer > 0 ? 8 : 4, 0, Math.PI * 2);
        ctx.fill();
        const img = skinImagesRef.current[r.id];
        const avatarRadius = 16;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        if (img && img.complete) {
          ctx.drawImage(img, -avatarRadius, -avatarRadius, avatarRadius * 2, avatarRadius * 2);
        } else {
          ctx.fillStyle = r.color;
          ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, avatarRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Orbitron, monospace";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        ctx.fillText("[#" + r.num + "] " + r.name, rx, ry - 22);
        if (r.id === selectedRacer.id) {
          ctx.save();
          ctx.fillStyle = "#ffd700";
          ctx.shadowColor = "#ffd700";
          ctx.shadowBlur = 8;
          ctx.font = "900 10px Orbitron, monospace";
          ctx.fillText("[ TARGET LOCKED ]", rx, ry - 34);
          ctx.beginPath();
          ctx.moveTo(rx, ry - 28);
          ctx.lineTo(rx + 4, ry - 24);
          ctx.lineTo(rx, ry - 20);
          ctx.lineTo(rx - 4, ry - 24);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
      });
      animIdRef.current = requestAnimationFrame(loop);
    };
    animIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [gameState, selectedRacer]);
  const calculatedOdds = betType === "WIN" ? selectedRacer.odds : Math.round(selectedRacer.odds * secondRacer.odds * 2.2 * 10) / 10;
  const potentialPayout = Math.floor(betAmount * calculatedOdds);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#070712",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    paddingBottom: "120px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
      background: "rgba(15, 15, 30, 0.75)",
      padding: "12px 20px",
      borderRadius: "16px",
      border: "1px solid rgba(0, 229, 255, 0.25)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/arcade", style: {
        color: "#00e5ff",
        textDecoration: "none",
        fontWeight: "800",
        fontSize: "0.85rem",
        letterSpacing: "1px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0, 229, 255, 0.08)",
        border: "1px solid rgba(0, 229, 255, 0.3)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "ARCADE HUB"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "16px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.8)",
          letterSpacing: "0.5px"
        }, children: [
          "HIGH RECORD: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: "900", color: "#ffd700" }, children: [
            (stats?.derbyHighScore || 0).toLocaleString(),
            " CP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(255, 215, 0, 0.08)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          padding: "6px 14px",
          borderRadius: "10px",
          fontWeight: "800",
          color: "#ffd700",
          fontSize: "0.9rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#ffd700",
            boxShadow: "0 0 8px #ffd700"
          } }),
          (coins || 0).toLocaleString(),
          " CP"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        margin: 0,
        fontSize: "2.4rem",
        background: "linear-gradient(135deg, #00e5ff, #ff007f, #ffd700)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textTransform: "uppercase",
        letterSpacing: "2px",
        filter: "drop-shadow(0 0 15px rgba(0, 229, 255, 0.4))"
      }, children: "CYBER DERBY: BRO GRAND PRIX" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "6px 0 0", color: "#a0a0c0", fontSize: "0.9rem" }, children: "HIGH-STAKES 8-BRO CYBER TRACK RACING • STRATEGIC ABILITIES • MASSIVE EXACTA ODDS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      width: "100%",
      maxWidth: "960px",
      background: "#030308",
      borderRadius: "16px",
      overflow: "hidden",
      border: "2px solid rgba(0, 229, 255, 0.4)",
      boxShadow: "0 0 30px rgba(0, 229, 255, 0.15)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          style: { width: "100%", height: "auto", display: "block" }
        }
      ),
      gameState === "COUNTDOWN" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: "6rem",
          fontWeight: "bold",
          color: countdownVal === "GO!" ? "#00ff66" : "#ffd700",
          textShadow: "0 0 30px currentColor"
        }, children: countdownVal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00e5ff", fontSize: "1.2rem", letterSpacing: "4px" }, children: "STARTING ENGINES..." })
      ] }),
      gameState === "RACING" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(10, 10, 20, 0.85)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "0.75rem",
          zIndex: 10,
          minWidth: "160px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ffd700", fontWeight: "bold", marginBottom: "4px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2px" }, children: "LIVE STANDINGS" }),
          liveRankings.slice(0, 4).map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            color: r.id === selectedRacer.id ? "#ffd700" : "white",
            fontWeight: r.id === selectedRacer.id ? "bold" : "normal",
            marginTop: "2px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "#",
              idx + 1,
              " ",
              r.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: r.color }, children: [
              r.odds,
              "x"
            ] })
          ] }, r.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          bottom: "12px",
          left: "12px",
          display: "flex",
          gap: "10px",
          zIndex: 10
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: triggerPlayerNitro,
              disabled: !nitroAvailable,
              style: {
                background: nitroAvailable ? "linear-gradient(135deg, #00e5ff, #0077ff)" : "#333",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: nitroAvailable ? "pointer" : "not-allowed",
                boxShadow: nitroAvailable ? "0 0 15px rgba(0,229,255,0.4)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [
                "⚡ NITRO OVERDRIVE ",
                nitroAvailable ? "[READY]" : "[USED]"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: triggerPlayerSlick,
              disabled: !slickAvailable,
              style: {
                background: slickAvailable ? "linear-gradient(135deg, #ffd700, #ff8800)" : "#333",
                color: "black",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: slickAvailable ? "pointer" : "not-allowed",
                boxShadow: slickAvailable ? "0 0 15px rgba(255,215,0,0.4)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [
                "🍌 DROP OIL SLICK ",
                slickAvailable ? "[READY]" : "[USED]"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(5, 5, 12, 0.95)",
        padding: "8px 16px",
        borderTop: "1px solid rgba(0, 229, 255, 0.2)",
        fontSize: "0.8rem",
        color: "#00e5ff",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700", fontWeight: "bold" }, children: "🎙️ ANNOUNCER:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e0e0ff" }, children: raceCommentary[0] || "Ready for the next race!" })
      ] })
    ] }),
    gameState === "RESULTS" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      marginTop: "20px",
      background: "rgba(15, 15, 30, 0.95)",
      border: winPayout > 0 ? "2px solid #ffd700" : "2px solid rgba(255, 0, 127, 0.5)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: winPayout > 0 ? "0 0 40px rgba(255, 215, 0, 0.3)" : "0 0 30px rgba(0,0,0,0.8)",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: winPayout > 0 ? "#ffd700" : "#ff0055",
        marginBottom: "8px"
      }, children: winPayout > 0 ? `🎉 VICTORY! PAYOUT: +${winPayout.toLocaleString()} CP` : "🏁 RACE CONCLUDED - BETTER LUCK NEXT DERBY!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#a0a0c0", fontSize: "0.9rem", marginBottom: "20px" }, children: winPayout > 0 ? `Your bet on ${selectedRacer.name} landed with glorious returns!` : `Winner: ${raceResults[0]?.name} (#${raceResults[0]?.num}) with odds ${raceResults[0]?.odds}x` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
      }, children: raceResults.slice(0, 3).map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: idx === 0 ? "rgba(255, 215, 0, 0.15)" : "rgba(255, 255, 255, 0.05)",
        border: idx === 0 ? "2px solid #ffd700" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: idx === 0 ? "#ffd700" : idx === 1 ? "#e0e0e0" : "#cd7f32",
          marginBottom: "8px"
        }, children: idx === 0 ? "🥇 1ST PLACE" : idx === 1 ? "🥈 2ND PLACE" : "🥉 3RD PLACE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: r.skin,
            alt: r.name,
            style: {
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: `3px solid ${r.color}`,
              marginBottom: "8px",
              objectFit: "cover"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: "white", fontSize: "1rem" }, children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: r.color }, children: [
          "Odds: ",
          r.odds,
          "x"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.75rem", color: "#888", marginTop: "4px" }, children: [
          "Time: ",
          r.finishTime ? `${r.finishTime.toFixed(2)}s` : "DNF"
        ] })
      ] }, r.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: () => setGameState("BETTING"),
          style: {
            background: "linear-gradient(135deg, #00e5ff, #ff007f)",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "12px 35px",
            borderRadius: "30px",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)"
          },
          children: "🏇 PLACE NEXT BET"
        }
      )
    ] }),
    gameState === "BETTING" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      marginTop: "25px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(15, 15, 30, 0.85)",
        border: "1px solid rgba(0, 229, 255, 0.3)",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBetType("WIN"),
              style: {
                background: betType === "WIN" ? "#00e5ff" : "rgba(255,255,255,0.05)",
                color: betType === "WIN" ? "#000" : "#fff",
                border: "1px solid #00e5ff",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "inherit"
              },
              children: "WIN BET (1ST PLACE)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBetType("EXACTA"),
              style: {
                background: betType === "EXACTA" ? "#ff007f" : "rgba(255,255,255,0.05)",
                color: "#fff",
                border: "1px solid #ff007f",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "inherit"
              },
              children: "EXACTA (1ST & 2ND) 🔥"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.85rem", color: "#888" }, children: "BET CP:" }),
          [25, 50, 100, 250, 500].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBetAmount(amt),
              style: {
                background: betAmount === amt ? "#ffd700" : "rgba(255,255,255,0.05)",
                color: betAmount === amt ? "#000" : "#fff",
                border: betAmount === amt ? "1px solid #ffd700" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "inherit"
              },
              children: amt
            },
            amt
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "15px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "#888" }, children: "EST. PAYOUT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.2rem", color: "#ffd700", fontWeight: "bold" }, children: [
              potentialPayout.toLocaleString(),
              " CP (",
              calculatedOdds,
              "x)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: handleStartRace,
              style: {
                background: "linear-gradient(135deg, #00ff66, #00e5ff)",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                padding: "12px 28px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(0, 255, 102, 0.4)"
              },
              children: "🏁 START RACE"
            }
          )
        ] })
      ] }),
      betType === "EXACTA" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(255, 0, 127, 0.1)",
        border: "1px solid #ff007f",
        borderRadius: "12px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem", color: "#ff77aa" }, children: "🎯 SELECT 2ND PLACE RACER FOR EXACTA:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px" }, children: RACERS.filter((r) => r.id !== selectedRacer.id).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSecondRacer(r),
            style: {
              background: secondRacer.id === r.id ? "#ff007f" : "rgba(255,255,255,0.05)",
              color: "white",
              border: secondRacer.id === r.id ? "1px solid #fff" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "inherit"
            },
            children: [
              "#",
              r.num,
              " ",
              r.name.split(" ")[0]
            ]
          },
          r.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px"
      }, children: RACERS.map((r) => {
        const isSelected = selectedRacer.id === r.id;
        const isSecond = betType === "EXACTA" && secondRacer.id === r.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setSelectedRacer(r),
            style: {
              background: isSelected ? "rgba(0, 229, 255, 0.12)" : isSecond ? "rgba(255, 0, 127, 0.12)" : "rgba(15, 15, 30, 0.7)",
              border: isSelected ? "2px solid #00e5ff" : isSecond ? "2px solid #ff007f" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxShadow: isSelected ? "0 0 15px rgba(0, 229, 255, 0.3)" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  background: r.color,
                  color: "#000",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "0.75rem"
                }, children: [
                  "LANE #",
                  r.num
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontWeight: "bold",
                  color: "#ffd700",
                  fontSize: "1.1rem"
                }, children: [
                  r.odds,
                  "x ODDS"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: r.skin,
                    alt: r.name,
                    style: {
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      border: `2px solid ${r.color}`,
                      objectFit: "cover"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "0.95rem", color: "white" }, children: r.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: r.color, fontWeight: "bold" }, children: r.archetype })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.7rem", color: "#888" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SPEED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff" }, children: [
                    r.speed,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#222", height: "4px", borderRadius: "2px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#00e5ff", width: `${r.speed}%`, height: "100%" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ACCEL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff" }, children: [
                    r.accel,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#222", height: "4px", borderRadius: "2px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#ff007f", width: `${r.accel}%`, height: "100%" } }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: "0.7rem",
                color: "#777",
                fontStyle: "italic",
                textAlign: "center",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: "6px"
              }, children: [
                '"',
                r.quote,
                '"'
              ] })
            ]
          },
          r.id
        );
      }) })
    ] })
  ] });
};
export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  LANE_HEIGHT,
  RACERS,
  TRACK_LENGTH,
  TRACK_TOP,
  CyberDerby as default
};
