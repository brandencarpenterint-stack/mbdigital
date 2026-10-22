import { a as useGamification, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, A as AnimatePresence, m as motion, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-Du1n4boJ.js";
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const ROAD_WIDTH = 2e3;
const SEGMENT_LENGTH = 200;
const CAMERA_HEIGHT = 1e3;
const CAMERA_DEPTH = 0.84;
const DRAW_DISTANCE = 140;
const TOTAL_SEGMENTS = 1600;
const PILOTS = [
  { id: "gamer", name: "Gamer Bro", src: "/assets/skins/face_gamer.png", color: "#ff0055" },
  { id: "star", name: "Star Bro", src: "/assets/skins/face_star.png", color: "#ffd700" },
  { id: "money", name: "Money Bro", src: "/assets/skins/face_money.png", color: "#00ffcc" },
  { id: "astro", name: "Astro Bro", src: "/assets/skins/face_astro.png", color: "#00c6ff" },
  { id: "dino", name: "Dino Bro", src: "/assets/skins/face_dino.png", color: "#00ff66" }
];
const RIVALS = [
  { id: "bear", name: "Bear Bus", src: "/assets/skins/face_bear.png", color: "#ff8800" },
  { id: "cat", name: "Cyber Cat", src: "/assets/skins/face_cat.png", color: "#ff00aa" },
  { id: "money", name: "Cash Crusher", src: "/assets/skins/face_money.png", color: "#ffd700" },
  { id: "dino", name: "Dino Drifter", src: "/assets/skins/face_dino.png", color: "#00ff00" }
];
const NeonDrift = () => {
  const { coins, addCoins, updateStat, userProfile, stats } = useGamification() || {};
  const { playCrash, playCollect, playWin, playAirhorn, playBoop } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const engineOscRef = reactExports.useRef(null);
  const [gameState, setGameState] = reactExports.useState("MENU");
  const [selectedPilot, setSelectedPilot] = reactExports.useState(PILOTS[0]);
  const [score, setScore] = reactExports.useState(0);
  const [coinsCollected, setCoinsCollected] = reactExports.useState(0);
  const [speed, setSpeed] = reactExports.useState(0);
  const [nitroLeft, setNitroLeft] = reactExports.useState(0);
  const [nearMissText, setNearMissText] = reactExports.useState(null);
  const pilotImagesRef = reactExports.useRef({});
  reactExports.useEffect(() => {
    [...PILOTS, ...RIVALS].forEach((p) => {
      if (!pilotImagesRef.current[p.id]) {
        const img = new Image();
        img.src = p.src;
        pilotImagesRef.current[p.id] = img;
      }
    });
  }, []);
  const initEngineAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      if (!engineOscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        engineOscRef.current = osc;
      }
    } catch (e) {
    }
  };
  const stopEngineAudio = () => {
    try {
      if (engineOscRef.current) {
        engineOscRef.current.stop();
        engineOscRef.current.disconnect();
        engineOscRef.current = null;
      }
    } catch (e) {
    }
  };
  reactExports.useEffect(() => {
    return () => stopEngineAudio();
  }, []);
  const stateRef = reactExports.useRef({
    position: 0,
    playerX: 0,
    speed: 0,
    maxSpeed: 180,
    accel: 0.8,
    breaking: 1.2,
    decel: 0.3,
    nitro: 0,
    segments: [],
    cars: [],
    collectibles: [],
    keyLeft: false,
    keyRight: false,
    keyFaster: false,
    keySlower: false,
    score: 0,
    coinsEarned: 0
  });
  const buildRoad = () => {
    const segments = [];
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      let curve = 0;
      if (i > 100 && i < 300) curve = 2.5;
      else if (i > 400 && i < 650) curve = -3.2;
      else if (i > 800 && i < 1100) curve = 4;
      else if (i > 1200 && i < 1450) curve = -3.5;
      let y = 0;
      if (i > 200 && i < 400) y = Math.sin((i - 200) / 40) * 900;
      else if (i > 650 && i < 850) y = Math.sin((i - 650) / 35) * 1100;
      segments.push({
        index: i,
        p1: { world: { x: 0, y, z: i * SEGMENT_LENGTH }, camera: {}, screen: {} },
        p2: { world: { x: 0, y, z: (i + 1) * SEGMENT_LENGTH }, camera: {}, screen: {} },
        curve,
        color: Math.floor(i / 3) % 2 ? {
          road: "#0d0d1a",
          grass: "#050510",
          rumble: "#ff007f",
          lane: "#00ffcc"
        } : {
          road: "#141428",
          grass: "#080818",
          rumble: "#ffffff",
          lane: "transparent"
        }
      });
    }
    const cars = [];
    for (let i = 0; i < 40; i++) {
      cars.push({
        offset: (Math.random() - 0.5) * 1.5,
        z: (i + 1) * 3500 + Math.random() * 800,
        speed: 70 + Math.random() * 50,
        rival: RIVALS[i % RIVALS.length],
        passed: false
      });
    }
    const collectibles = [];
    for (let i = 0; i < 80; i++) {
      collectibles.push({
        type: i % 8 === 0 ? "NITRO" : "COIN",
        offset: (Math.random() - 0.5) * 1.4,
        z: (i + 1) * 2e3 + Math.random() * 500,
        collected: false
      });
    }
    stateRef.current.segments = segments;
    stateRef.current.cars = cars;
    stateRef.current.collectibles = collectibles;
  };
  const project = (p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) => {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / Math.max(0.01, p.camera.z);
    p.screen.x = Math.round(width / 2 + p.screen.scale * p.camera.x * width / 2);
    p.screen.y = Math.round(height / 2 - p.screen.scale * p.camera.y * height / 2);
    p.screen.w = Math.round(p.screen.scale * roadWidth * width / 2);
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "PLAYING") return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") stateRef.current.keyLeft = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") stateRef.current.keyRight = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") stateRef.current.keyFaster = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") stateRef.current.keySlower = true;
      if (e.key === " " || e.key === "Shift") activateNitro();
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") stateRef.current.keyLeft = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") stateRef.current.keyRight = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") stateRef.current.keyFaster = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") stateRef.current.keySlower = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);
  const activateNitro = () => {
    if (stateRef.current.nitro > 0) return;
    stateRef.current.nitro = 180;
    try {
      playBoop();
    } catch (e) {
    }
  };
  const startGame = () => {
    buildRoad();
    stateRef.current.position = 0;
    stateRef.current.playerX = 0;
    stateRef.current.speed = 40;
    stateRef.current.score = 0;
    stateRef.current.coinsEarned = 0;
    stateRef.current.nitro = 0;
    setScore(0);
    setCoinsCollected(0);
    setGameState("PLAYING");
    initEngineAudio();
  };
  reactExports.useEffect(() => {
    if (gameState !== "PLAYING") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const loop = () => {
      const s = stateRef.current;
      const segments = s.segments;
      const trackLength = segments.length * SEGMENT_LENGTH;
      const topSpd = s.nitro > 0 ? 250 : s.maxSpeed;
      if (s.keyFaster) s.speed = Math.min(topSpd, s.speed + s.accel);
      else if (s.keySlower) s.speed = Math.max(0, s.speed - s.breaking);
      else s.speed = Math.max(0, s.speed - s.decel);
      if (!s.keyFaster && !s.keySlower && s.speed < 80) s.speed += 0.4;
      if (s.nitro > 0) {
        s.nitro--;
        setNitroLeft(Math.ceil(s.nitro / 60));
      } else {
        setNitroLeft(0);
      }
      const steerRate = 6e-4 * (s.speed / s.maxSpeed);
      if (s.keyLeft) s.playerX -= steerRate * 100;
      if (s.keyRight) s.playerX += steerRate * 100;
      if ((s.playerX < -1 || s.playerX > 1) && s.speed > 60) s.speed -= 1.2;
      s.playerX = Math.max(-1.8, Math.min(1.8, s.playerX));
      s.position = (s.position + s.speed * 4) % trackLength;
      s.score += Math.floor(s.speed / 10);
      setScore(s.score);
      setSpeed(Math.round(s.speed));
      if (engineOscRef.current && audioCtxRef.current) {
        const pitch = 65 + s.speed / topSpd * 220 + (s.nitro > 0 ? 60 : 0);
        engineOscRef.current.frequency.setValueAtTime(pitch, audioCtxRef.current.currentTime);
      }
      ctx.fillStyle = "#050314";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const sunY = CANVAS_HEIGHT * 0.45;
      const grad = ctx.createLinearGradient(0, sunY - 90, 0, sunY);
      grad.addColorStop(0, "#ffd700");
      grad.addColorStop(0.5, "#ff007f");
      grad.addColorStop(1, "#7928ca");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, sunY, 70, 0, Math.PI, true);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 0, 127, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, sunY);
      for (let mx = 0; mx <= CANVAS_WIDTH; mx += 30) {
        const my = sunY - (Math.sin(mx * 0.03) * 25 + Math.cos(mx * 0.08) * 15);
        ctx.lineTo(mx, my);
      }
      ctx.lineTo(CANVAS_WIDTH, sunY);
      ctx.stroke();
      const startPos = s.position;
      const baseSegmentIndex = Math.floor(startPos / SEGMENT_LENGTH);
      let maxy = CANVAS_HEIGHT;
      let x = 0;
      let dx = -(segments[baseSegmentIndex]?.curve || 0) * (startPos % SEGMENT_LENGTH) / SEGMENT_LENGTH;
      for (let n = 0; n < DRAW_DISTANCE; n++) {
        const segment = segments[(baseSegmentIndex + n) % segments.length];
        const looped = segment.index < baseSegmentIndex;
        const cameraZ = startPos - (looped ? trackLength : 0);
        project(segment.p1, s.playerX * ROAD_WIDTH - x, CAMERA_HEIGHT, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);
        project(segment.p2, s.playerX * ROAD_WIDTH - x - dx, CAMERA_HEIGHT, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);
        x += dx;
        dx += segment.curve;
        if (segment.p1.camera.z <= CAMERA_DEPTH || segment.p2.screen.y >= maxy) continue;
        ctx.fillStyle = segment.color.grass;
        ctx.fillRect(0, segment.p2.screen.y, CANVAS_WIDTH, segment.p1.screen.y - segment.p2.screen.y);
        ctx.fillStyle = segment.color.road;
        ctx.beginPath();
        ctx.moveTo(segment.p1.screen.x - segment.p1.screen.w, segment.p1.screen.y);
        ctx.lineTo(segment.p1.screen.x + segment.p1.screen.w, segment.p1.screen.y);
        ctx.lineTo(segment.p2.screen.x + segment.p2.screen.w, segment.p2.screen.y);
        ctx.lineTo(segment.p2.screen.x - segment.p2.screen.w, segment.p2.screen.y);
        ctx.fill();
        const r1 = segment.p1.screen.w / 8;
        const r2 = segment.p2.screen.w / 8;
        ctx.fillStyle = segment.color.rumble;
        ctx.beginPath();
        ctx.moveTo(segment.p1.screen.x - segment.p1.screen.w - r1, segment.p1.screen.y);
        ctx.lineTo(segment.p1.screen.x - segment.p1.screen.w, segment.p1.screen.y);
        ctx.lineTo(segment.p2.screen.x - segment.p2.screen.w, segment.p2.screen.y);
        ctx.lineTo(segment.p2.screen.x - segment.p2.screen.w - r2, segment.p2.screen.y);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(segment.p1.screen.x + segment.p1.screen.w + r1, segment.p1.screen.y);
        ctx.lineTo(segment.p1.screen.x + segment.p1.screen.w, segment.p1.screen.y);
        ctx.lineTo(segment.p2.screen.x + segment.p2.screen.w, segment.p2.screen.y);
        ctx.lineTo(segment.p2.screen.x + segment.p2.screen.w + r2, segment.p2.screen.y);
        ctx.fill();
        if (segment.color.lane !== "transparent") {
          const lw1 = segment.p1.screen.w / 25;
          const lw2 = segment.p2.screen.w / 25;
          ctx.fillStyle = segment.color.lane;
          ctx.fillRect(segment.p1.screen.x - lw1 / 2, segment.p2.screen.y, lw2, segment.p1.screen.y - segment.p2.screen.y);
        }
        maxy = segment.p2.screen.y;
      }
      s.collectibles.forEach((col) => {
        if (col.collected) return;
        const relZ = col.z - s.position;
        if (relZ > 0 && relZ < DRAW_DISTANCE * SEGMENT_LENGTH) {
          const scale = CAMERA_DEPTH / relZ;
          const cx = CANVAS_WIDTH / 2 + scale * (col.offset * ROAD_WIDTH - s.playerX * ROAD_WIDTH) * CANVAS_WIDTH / 2;
          const cy = CANVAS_HEIGHT / 2 + scale * CAMERA_HEIGHT * CANVAS_HEIGHT / 2;
          const size = Math.max(10, Math.min(36, 24 * scale * 25));
          if (relZ < 180 && Math.abs(col.offset - s.playerX) < 0.4) {
            col.collected = true;
            if (col.type === "COIN") {
              s.coinsEarned += 25;
              setCoinsCollected((c) => c + 25);
              if (addCoins) addCoins(25);
              try {
                playCollect();
              } catch (e) {
              }
            } else {
              s.nitro = 240;
              try {
                playWin();
              } catch (e) {
              }
            }
          } else {
            const r = size / 2;
            ctx.save();
            ctx.translate(cx, cy - 20);
            if (col.type === "COIN") {
              ctx.shadowColor = "#ffd700";
              ctx.shadowBlur = Math.min(20, r * 1.2);
              const rimGrad = ctx.createLinearGradient(-r, -r, r, r);
              rimGrad.addColorStop(0, "#fff3a8");
              rimGrad.addColorStop(0.5, "#ffd700");
              rimGrad.addColorStop(1, "#b8860b");
              ctx.fillStyle = rimGrad;
              ctx.beginPath();
              ctx.arc(0, 0, r, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
              const innerGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 0.78);
              innerGrad.addColorStop(0, "#ffe875");
              innerGrad.addColorStop(0.8, "#d49400");
              innerGrad.addColorStop(1, "#8c6000");
              ctx.fillStyle = innerGrad;
              ctx.beginPath();
              ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
              ctx.lineWidth = Math.max(1, r * 0.12);
              ctx.beginPath();
              ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = "#ffffff";
              ctx.font = "900 " + Math.max(7, Math.round(r * 0.65)) + 'px "Orbitron", sans-serif';
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("C", 0, 0.5);
            } else {
              ctx.shadowColor = "#00ffcc";
              ctx.shadowBlur = Math.min(22, r * 1.4);
              const auraGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
              auraGrad.addColorStop(0, "#ffffff");
              auraGrad.addColorStop(0.3, "#00ffcc");
              auraGrad.addColorStop(1, "#003844");
              ctx.fillStyle = auraGrad;
              ctx.beginPath();
              ctx.arc(0, 0, r, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              const s2 = r * 0.65;
              ctx.moveTo(s2 * 0.1, -s2);
              ctx.lineTo(-s2 * 0.45, s2 * 0.05);
              ctx.lineTo(0, s2 * 0.05);
              ctx.lineTo(-s2 * 0.15, s2);
              ctx.lineTo(s2 * 0.5, -s2 * 0.1);
              ctx.lineTo(s2 * 0.05, -s2 * 0.1);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          }
        }
      });
      s.cars.forEach((car) => {
        car.z += car.speed * 2.5;
        const relZ = car.z - s.position;
        if (relZ > 0 && relZ < DRAW_DISTANCE * SEGMENT_LENGTH) {
          const scale = CAMERA_DEPTH / relZ;
          const carScreenX = CANVAS_WIDTH / 2 + scale * (car.offset * ROAD_WIDTH - s.playerX * ROAD_WIDTH) * CANVAS_WIDTH / 2;
          const carScreenY = CANVAS_HEIGHT / 2 + scale * CAMERA_HEIGHT * CANVAS_HEIGHT / 2;
          const carW = Math.max(15, Math.min(100, 70 * scale * 20));
          const carH = carW * 0.6;
          if (!car.passed && relZ < 100) {
            car.passed = true;
            if (Math.abs(car.offset - s.playerX) < 0.5) {
              if (Math.abs(car.offset - s.playerX) < 0.25) {
                s.speed = 15;
                try {
                  playCrash();
                } catch (e) {
                }
              } else {
                s.score += 250;
                setNearMissText("+250 NEAR MISS!");
                setTimeout(() => setNearMissText(null), 1e3);
                try {
                  playBoop();
                } catch (e) {
                }
              }
            }
          }
          ctx.fillStyle = car.rival.color;
          ctx.beginPath();
          ctx.roundRect(carScreenX - carW / 2, carScreenY - carH, carW, carH, 6);
          ctx.fill();
          const avatarImg = pilotImagesRef.current[car.rival.id];
          if (avatarImg && avatarImg.complete) {
            const avSize = Math.max(12, carW * 0.45);
            ctx.save();
            ctx.beginPath();
            ctx.arc(carScreenX, carScreenY - carH - avSize / 2 - 4, avSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatarImg, carScreenX - avSize / 2, carScreenY - carH - avSize - 4, avSize, avSize);
            ctx.restore();
          }
        }
      });
      const pCarW = 120;
      const pCarH = 65;
      const pCarX = CANVAS_WIDTH / 2;
      const pCarY = CANVAS_HEIGHT - 35;
      const steerAngle = s.keyLeft ? -0.08 : s.keyRight ? 0.08 : 0;
      ctx.save();
      ctx.translate(pCarX, pCarY);
      ctx.rotate(steerAngle);
      if (s.nitro > 0) {
        ctx.fillStyle = "#00ffcc";
        ctx.shadowColor = "#00ffcc";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(-35, pCarH / 2 + Math.random() * 15, 8 + Math.random() * 6, 0, Math.PI * 2);
        ctx.arc(35, pCarH / 2 + Math.random() * 15, 8 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = selectedPilot.color;
      ctx.shadowColor = selectedPilot.color;
      ctx.shadowBlur = 25;
      ctx.fillRect(-pCarW / 2 + 10, -10, pCarW - 20, 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0c0c16";
      ctx.strokeStyle = selectedPilot.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-pCarW / 2, -pCarH / 2, pCarW, pCarH, 12);
      ctx.fill();
      ctx.stroke();
      const pilotImg = pilotImagesRef.current[selectedPilot.id];
      if (pilotImg && pilotImg.complete) {
        const pSize = 32;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -pCarH / 4 + 4, pSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(pilotImg, -pSize / 2, -pCarH / 4 + 4 - pSize / 2, pSize, pSize);
        ctx.restore();
      }
      ctx.fillStyle = s.keySlower ? "#ffffff" : "#ff0055";
      ctx.fillRect(-pCarW / 2 + 8, pCarH / 4, 25, 8);
      ctx.fillRect(pCarW / 2 - 33, pCarH / 4, 25, 8);
      ctx.restore();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [gameState, selectedPilot]);
  const endGame = () => {
    stopEngineAudio();
    const currentHS = stats?.neonDriftHighScore || 0;
    if (score > currentHS && updateStat) {
      updateStat("neonDriftHighScore", score);
    }
    if (score >= 3e3) {
      try {
        playAirhorn();
        triggerConfetti();
      } catch (e) {
      }
      feedService.publish({
        text: "🏎️ " + (userProfile?.name || "Racer") + " scorched the highway in Neon Drift 2088! (Score: " + score.toLocaleString() + " PTS)",
        type: "jackpot"
      });
    }
    setGameState("GAMEOVER");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#070710",
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
      maxWidth: "850px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
      padding: "12px 20px",
      background: "rgba(15, 15, 28, 0.7)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 0, 127, 0.25)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/arcade", onClick: stopEngineAudio, style: {
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0, 255, 204, 0.08)",
        border: "1px solid rgba(0, 255, 204, 0.3)",
        color: "#00ffcc",
        fontWeight: "800",
        fontSize: "0.85rem",
        letterSpacing: "1px",
        transition: "all 0.2s"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "ARCADE"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: 0, fontSize: "1.5rem", color: "#ff007f", textShadow: "0 0 20px rgba(255, 0, 127, 0.6)", letterSpacing: "3px", fontWeight: "900" }, children: "NEON DRIFT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#00ffcc", letterSpacing: "2px", opacity: 0.8, textTransform: "uppercase" }, children: "Studio Velocity 2088" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        background: "rgba(255, 215, 0, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        borderRadius: "10px",
        color: "#ffd700",
        fontWeight: "800",
        fontSize: "0.9rem",
        letterSpacing: "0.5px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ffd700",
          boxShadow: "0 0 8px #ffd700"
        } }),
        coins.toLocaleString(),
        " CP"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      width: CANVAS_WIDTH,
      maxWidth: "100%",
      background: "#000",
      border: "3px solid #ff007f",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 0 40px rgba(255, 0, 127, 0.25)"
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
      gameState === "PLAYING" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "15px",
          left: "20px",
          background: "rgba(0,0,0,0.65)",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(0, 255, 204, 0.4)",
          backdropFilter: "blur(5px)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#888" }, children: "SPEED" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.4rem", fontWeight: "900", color: speed > 200 ? "#ff0055" : "#00ffcc" }, children: [
            speed,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem" }, children: "MPH" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "15px",
          right: "20px",
          background: "rgba(0,0,0,0.65)",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 215, 0, 0.4)",
          textAlign: "right",
          backdropFilter: "blur(5px)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.65rem", color: "#888" }, children: "DISTANCE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.4rem", fontWeight: "900", color: "#ffd700" }, children: [
            score.toLocaleString(),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem" }, children: "PTS" })
          ] })
        ] }),
        nitroLeft > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "80px",
          left: "20px",
          background: "linear-gradient(135deg, rgba(255, 0, 127, 0.9), rgba(0, 255, 204, 0.9))",
          color: "#000",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "900",
          letterSpacing: "1px",
          boxShadow: "0 0 25px rgba(0, 255, 204, 0.6)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
          "NITRO OVERDRIVE: ",
          nitroLeft,
          "S"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: nearMissText && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0, y: 10 },
            animate: { scale: 1.2, y: 0 },
            exit: { scale: 0, opacity: 0 },
            style: {
              position: "absolute",
              top: "120px",
              left: "calc(50% - 100px)",
              width: "200px",
              textAlign: "center",
              color: "#00ffcc",
              fontWeight: "900",
              fontSize: "1.2rem",
              textShadow: "0 0 10px #00ffcc"
            },
            children: nearMissText
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: endGame,
            style: {
              position: "absolute",
              bottom: "15px",
              right: "15px",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid #ff0055",
              color: "#ff0055",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              cursor: "pointer"
            },
            children: "FINISH RUN"
          }
        )
      ] }),
      gameState === "MENU" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        inset: 0,
        background: "rgba(5, 5, 15, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.5rem", margin: 0, color: "#ff007f", textShadow: "0 0 25px #ff007f" }, children: "NEON DRIFT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00ffcc", fontSize: "0.9rem", marginBottom: "25px", letterSpacing: "2px" }, children: "OUTRUN THE CYBER VOID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "30px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.75rem", marginBottom: "10px" }, children: "SELECT DRIVER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "12px", justifyContent: "center" }, children: PILOTS.map((p) => {
            const isSel = selectedPilot.id === p.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: () => setSelectedPilot(p),
                style: {
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: isSel ? "3px solid " + p.color : "2px solid #333",
                  boxShadow: isSel ? "0 0 15px " + p.color : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: "#111"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.src, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: p.name })
              },
              p.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: selectedPilot.color, fontWeight: "bold", fontSize: "0.85rem", marginTop: "8px" }, children: selectedPilot.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              background: "linear-gradient(135deg, #ff007f, #00ffcc)",
              color: "#000",
              padding: "16px 45px",
              fontSize: "1.2rem",
              fontWeight: "900",
              letterSpacing: "2px",
              boxShadow: "0 0 30px rgba(0, 255, 204, 0.4)"
            },
            children: "PRESS START"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", color: "#666", fontSize: "0.75rem", textAlign: "center" }, children: "STEER: ◄ ► or A / D • ACCEL: ▲ or W • BRAKE: ▼ or S • NITRO: SPACEBAR" })
      ] }),
      gameState === "GAMEOVER" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        inset: 0,
        background: "rgba(5, 5, 15, 0.92)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.2rem", color: "#ffd700", textShadow: "0 0 20px gold", margin: 0 }, children: "RUN COMPLETED!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "2.8rem", fontWeight: "900", color: "#fff", margin: "15px 0" }, children: [
          score.toLocaleString(),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1rem", color: "#888" }, children: "PTS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", marginBottom: "25px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: "10px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem" }, children: "COINS EARNED" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffd700", fontWeight: "bold", fontSize: "1.1rem" }, children: [
              "+",
              coinsCollected,
              " CP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: "10px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: "0.7rem" }, children: "RECORD HIGH" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#00ffcc", fontWeight: "bold", fontSize: "1.1rem" }, children: Math.max(score, stats?.neonDriftHighScore || 0).toLocaleString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: startGame,
            style: {
              background: "linear-gradient(135deg, #00ffcc, #ff007f)",
              color: "#000",
              padding: "14px 40px",
              fontSize: "1.1rem",
              fontWeight: "900"
            },
            children: "RACE AGAIN"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "18px",
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      width: "100%",
      maxWidth: "640px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onTouchStart: () => stateRef.current.keyLeft = true,
          onTouchEnd: () => stateRef.current.keyLeft = false,
          onMouseDown: () => stateRef.current.keyLeft = true,
          onMouseUp: () => stateRef.current.keyLeft = false,
          style: {
            flex: 1,
            padding: "16px",
            background: "rgba(20, 20, 35, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 255, 204, 0.25)",
            borderRadius: "14px",
            color: "#00ffcc",
            fontSize: "1rem",
            fontWeight: "800",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "STEER LEFT"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: activateNitro,
          style: {
            flex: 1,
            padding: "16px",
            background: "linear-gradient(135deg, rgba(255, 0, 127, 0.9), rgba(121, 40, 202, 0.9))",
            border: "1px solid rgba(255, 0, 127, 0.4)",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: "900",
            letterSpacing: "1.5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(255, 0, 127, 0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
            "NITRO"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onTouchStart: () => stateRef.current.keyRight = true,
          onTouchEnd: () => stateRef.current.keyRight = false,
          onMouseDown: () => stateRef.current.keyRight = true,
          onMouseUp: () => stateRef.current.keyRight = false,
          style: {
            flex: 1,
            padding: "16px",
            background: "rgba(20, 20, 35, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 255, 204, 0.25)",
            borderRadius: "14px",
            color: "#00ffcc",
            fontSize: "1rem",
            fontWeight: "800",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          },
          children: [
            "STEER RIGHT",
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 18 15 12 9 6" }) })
          ]
        }
      )
    ] })
  ] });
};
export {
  NeonDrift as default
};
