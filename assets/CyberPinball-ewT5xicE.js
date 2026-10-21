import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-YAU02hY5.js";
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 720;
const GRAVITY = 0.22;
const BALL_RADIUS = 9;
const BUMPERS = [
  { id: "b_dino", x: 170, y: 240, radius: 28, score: 150, color: "#00ff66", skin: "/assets/skins/face_dino.png", name: "Dino Bumper" },
  { id: "b_bunny", x: 310, y: 240, radius: 28, score: 150, color: "#ff007f", skin: "/assets/skins/face_bunny.png", name: "Bunny Bumper" },
  { id: "b_star", x: 240, y: 150, radius: 34, score: 300, color: "#ffd700", skin: "/assets/skins/face_star.png", name: "Super Star Bumper" }
];
const SLINGSHOTS = [
  { id: "left", p1: { x: 90, y: 550 }, p2: { x: 140, y: 620 }, p3: { x: 90, y: 620 }, color: "#00e5ff", kickX: 4.5, kickY: -5.5 },
  { id: "right", p1: { x: 390, y: 550 }, p2: { x: 340, y: 620 }, p3: { x: 390, y: 620 }, color: "#ff007f", kickX: -4.5, kickY: -5.5 }
];
const DROP_TARGETS = [
  { id: "B", letter: "B", x: 60, y: 220, width: 14, height: 26, active: true, color: "#00e5ff" },
  { id: "R", letter: "R", x: 60, y: 255, width: 14, height: 26, active: true, color: "#d500f9" },
  { id: "O", letter: "O", x: 60, y: 290, width: 14, height: 26, active: true, color: "#ffd700" }
];
const CyberPinball = () => {
  const { coins, addCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playWin, playAirhorn } = useRetroSound();
  const canvasRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const animIdRef = reactExports.useRef(null);
  const bumperImagesRef = reactExports.useRef({});
  const [score, setScore] = reactExports.useState(0);
  const [ballsLeft, setBallsLeft] = reactExports.useState(3);
  const [multiplier, setMultiplier] = reactExports.useState(1);
  const [multiballActive, setMultiballActive] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [coinsWon, setCoinsWon] = reactExports.useState(0);
  const [ballSaveActive, setBallSaveActive] = reactExports.useState(false);
  const [messageFeed, setMessageFeed] = reactExports.useState("PRESS SPACE OR PULL PLUNGER TO LAUNCH!");
  const engineRef = reactExports.useRef({
    balls: [],
    leftFlipper: { x: 155, y: 650, length: 65, angle: 0.5, restAngle: 0.5, activeAngle: -0.48, isPressed: false },
    rightFlipper: { x: 325, y: 650, length: 65, angle: 2.64, restAngle: 2.64, activeAngle: 3.62, isPressed: false },
    plunger: { y: 680, maxY: 710, chargedVelocity: 0, isCharging: false },
    bumpers: BUMPERS.map((b) => ({ ...b, hitEffect: 0 })),
    slingshots: SLINGSHOTS.map((s) => ({ ...s, hitEffect: 0 })),
    targets: DROP_TARGETS.map((t) => ({ ...t })),
    particles: [],
    lockedBalls: 0,
    ballSaveUntil: 0,
    score: 0,
    multiplier: 1
  });
  reactExports.useEffect(() => {
    BUMPERS.forEach((b) => {
      const img = new Image();
      img.src = b.skin;
      bumperImagesRef.current[b.id] = img;
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
  const playFlipperClack = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
    }
  };
  const playBumperSound = (freq = 520) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
    }
  };
  const playSlingshotSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
    }
  };
  const playPlungerLaunch = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
    }
  };
  const spawnBall = (engine) => {
    engine.balls.push({
      id: Date.now() + Math.random(),
      x: 458,
      y: 650,
      vx: 0,
      vy: 0,
      inPlungerLane: true
    });
    engine.ballSaveUntil = Date.now() + 15e3;
    setBallSaveActive(true);
    setTimeout(() => setBallSaveActive(false), 15e3);
  };
  const handleStartGame = () => {
    setScore(0);
    setBallsLeft(3);
    setMultiplier(1);
    setMultiballActive(false);
    setGameOver(false);
    setGameStarted(true);
    setCoinsWon(0);
    setMessageFeed("BALL 1 IN PLUNGER! HOLD SPACE/LAUNCH BUTTON!");
    const engine = engineRef.current;
    engine.balls = [];
    engine.score = 0;
    engine.multiplier = 1;
    engine.lockedBalls = 0;
    engine.particles = [];
    engine.targets = DROP_TARGETS.map((t) => ({ ...t }));
    spawnBall(engine);
  };
  const releasePlunger = () => {
    const engine = engineRef.current;
    const plungerBall = engine.balls.find((b) => b.inPlungerLane);
    if (plungerBall) {
      playPlungerLaunch();
      const launchPower = 19 + Math.random() * 4;
      plungerBall.vy = -launchPower;
      plungerBall.inPlungerLane = false;
      setMessageFeed("BALL LAUNCHED! USE A/D OR ARROWS TO FLIP!");
    }
  };
  const setLeftFlipper = (pressed) => {
    const engine = engineRef.current;
    if (pressed && !engine.leftFlipper.isPressed) playFlipperClack();
    engine.leftFlipper.isPressed = pressed;
  };
  const setRightFlipper = (pressed) => {
    const engine = engineRef.current;
    if (pressed && !engine.rightFlipper.isPressed) playFlipperClack();
    engine.rightFlipper.isPressed = pressed;
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const code = e.code;
      if (code === "KeyA" || code === "ArrowLeft" || code === "KeyZ") {
        setLeftFlipper(true);
      }
      if (code === "KeyD" || code === "ArrowRight" || code === "Slash") {
        setRightFlipper(true);
      }
      if (code === "Space" || code === "ArrowDown") {
        e.preventDefault();
        releasePlunger();
      }
    };
    const handleKeyUp = (e) => {
      const code = e.code;
      if (code === "KeyA" || code === "ArrowLeft" || code === "KeyZ") {
        setLeftFlipper(false);
      }
      if (code === "KeyD" || code === "ArrowRight" || code === "Slash") {
        setRightFlipper(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  const distToSegment = (p, v, w) => {
    const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    if (l2 === 0) return { dist: Math.hypot(p.x - v.x, p.y - v.y), closest: v };
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const closest = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    return { dist: Math.hypot(p.x - closest.x, p.y - closest.y), closest, t };
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loop = () => {
      const engine = engineRef.current;
      const lf = engine.leftFlipper;
      const targetLeftAngle = lf.isPressed ? lf.activeAngle : lf.restAngle;
      lf.angle += (targetLeftAngle - lf.angle) * 0.45;
      const rf = engine.rightFlipper;
      const targetRightAngle = rf.isPressed ? rf.activeAngle : rf.restAngle;
      rf.angle += (targetRightAngle - rf.angle) * 0.45;
      const lfTip = {
        x: lf.x + Math.cos(lf.angle) * lf.length,
        y: lf.y + Math.sin(lf.angle) * lf.length
      };
      const rfTip = {
        x: rf.x + Math.cos(rf.angle) * rf.length,
        y: rf.y + Math.sin(rf.angle) * rf.length
      };
      for (let i = engine.balls.length - 1; i >= 0; i--) {
        const b = engine.balls[i];
        if (!b.inPlungerLane) {
          b.vy += GRAVITY;
          b.vx *= 0.998;
          b.vy *= 0.998;
          b.x += b.vx;
          b.y += b.vy;
          if (Math.hypot(b.vx, b.vy) > 3) {
            engine.particles.push({
              x: b.x,
              y: b.y,
              color: "#00e5ff",
              radius: 3,
              life: 0.6
            });
          }
          if (b.x < 35 + BALL_RADIUS) {
            b.x = 35 + BALL_RADIUS;
            b.vx = Math.abs(b.vx) * 0.75;
          }
          if (b.x > 440 - BALL_RADIUS) {
            b.x = 440 - BALL_RADIUS;
            b.vx = -Math.abs(b.vx) * 0.75;
          }
          if (b.y < 90) {
            const topDist = Math.hypot(b.x - 240, b.y - 90);
            if (topDist > 200 - BALL_RADIUS) {
              const angle = Math.atan2(b.y - 90, b.x - 240);
              b.x = 240 + Math.cos(angle) * (200 - BALL_RADIUS);
              b.y = 90 + Math.sin(angle) * (200 - BALL_RADIUS);
              const normalX = Math.cos(angle);
              const normalY = Math.sin(angle);
              const dot = b.vx * normalX + b.vy * normalY;
              b.vx = (b.vx - 2 * dot * normalX) * 0.8;
              b.vy = (b.vy - 2 * dot * normalY) * 0.8;
            }
          }
          const leftWall = distToSegment(b, { x: 35, y: 480 }, { x: 130, y: 640 });
          if (leftWall.dist < BALL_RADIUS + 3) {
            const normalX = -160;
            const normalY = 130 - 35;
            const len = Math.hypot(normalX, normalY);
            const nx = normalX / len;
            const ny = normalY / len;
            b.x = leftWall.closest.x + nx * (BALL_RADIUS + 4);
            b.y = leftWall.closest.y + ny * (BALL_RADIUS + 4);
            const dot = b.vx * nx + b.vy * ny;
            b.vx = (b.vx - 1.8 * dot * nx) * 0.8;
            b.vy = (b.vy - 1.8 * dot * ny) * 0.8;
          }
          const rightWall = distToSegment(b, { x: 440, y: 480 }, { x: 350, y: 640 });
          if (rightWall.dist < BALL_RADIUS + 3) {
            const normalX = 640 - 480;
            const normalY = 90;
            const len = Math.hypot(normalX, normalY);
            const nx = normalX / len;
            const ny = normalY / len;
            b.x = rightWall.closest.x + nx * (BALL_RADIUS + 4);
            b.y = rightWall.closest.y + ny * (BALL_RADIUS + 4);
            const dot = b.vx * nx + b.vy * ny;
            b.vx = (b.vx - 1.8 * dot * nx) * 0.8;
            b.vy = (b.vy - 1.8 * dot * ny) * 0.8;
          }
          const lRes = distToSegment(b, { x: lf.x, y: lf.y }, lfTip);
          if (lRes.dist < BALL_RADIUS + 6) {
            const nx = -(lfTip.y - lf.y) / lf.length;
            const ny = (lfTip.x - lf.x) / lf.length;
            b.x = lRes.closest.x + nx * (BALL_RADIUS + 7);
            b.y = lRes.closest.y + ny * (BALL_RADIUS + 7);
            let flipperImpulse = 0;
            if (lf.isPressed && lRes.t > 0.2) {
              flipperImpulse = 13 + lRes.t * 6;
              playSlingshotSound();
            }
            const dot = b.vx * nx + b.vy * ny;
            b.vx = (b.vx - 1.9 * dot * nx) * 0.85;
            b.vy = (b.vy - 1.9 * dot * ny) * 0.85 - flipperImpulse;
          }
          const rRes = distToSegment(b, { x: rf.x, y: rf.y }, rfTip);
          if (rRes.dist < BALL_RADIUS + 6) {
            const nx = (rfTip.y - rf.y) / rf.length;
            const ny = -(rfTip.x - rf.x) / rf.length;
            b.x = rRes.closest.x + nx * (BALL_RADIUS + 7);
            b.y = rRes.closest.y + ny * (BALL_RADIUS + 7);
            let flipperImpulse = 0;
            if (rf.isPressed && rRes.t > 0.2) {
              flipperImpulse = 13 + rRes.t * 6;
              playSlingshotSound();
            }
            const dot = b.vx * nx + b.vy * ny;
            b.vx = (b.vx - 1.9 * dot * nx) * 0.85;
            b.vy = (b.vy - 1.9 * dot * ny) * 0.85 - flipperImpulse;
          }
          engine.bumpers.forEach((bump) => {
            const dist = Math.hypot(b.x - bump.x, b.y - bump.y);
            if (dist < bump.radius + BALL_RADIUS) {
              const angle = Math.atan2(b.y - bump.y, b.x - bump.x);
              b.x = bump.x + Math.cos(angle) * (bump.radius + BALL_RADIUS + 2);
              b.y = bump.y + Math.sin(angle) * (bump.radius + BALL_RADIUS + 2);
              const bouncePower = 11 + Math.random() * 3;
              b.vx = Math.cos(angle) * bouncePower;
              b.vy = Math.sin(angle) * bouncePower;
              bump.hitEffect = 1;
              playBumperSound(bump.score > 200 ? 680 : 440);
              const pts = bump.score * engine.multiplier;
              engine.score += pts;
              setScore(engine.score);
              setMessageFeed("+" + pts + " PTS ON " + bump.name.toUpperCase() + "!");
              for (let p = 0; p < 8; p++) {
                const pAngle = p / 8 * Math.PI * 2;
                engine.particles.push({
                  x: bump.x + Math.cos(pAngle) * bump.radius,
                  y: bump.y + Math.sin(pAngle) * bump.radius,
                  color: bump.color,
                  radius: 4,
                  life: 0.8,
                  vx: Math.cos(pAngle) * 3,
                  vy: Math.sin(pAngle) * 3
                });
              }
            }
          });
          engine.slingshots.forEach((sling) => {
            const sDist = distToSegment(b, sling.p1, sling.p2);
            if (sDist.dist < BALL_RADIUS + 4) {
              b.vx += sling.kickX;
              b.vy += sling.kickY;
              sling.hitEffect = 1;
              playSlingshotSound();
              const pts = 75 * engine.multiplier;
              engine.score += pts;
              setScore(engine.score);
            }
          });
          engine.targets.forEach((t) => {
            if (t.active && b.x >= t.x - BALL_RADIUS && b.x <= t.x + t.width + BALL_RADIUS && b.y >= t.y - BALL_RADIUS && b.y <= t.y + t.height + BALL_RADIUS) {
              t.active = false;
              b.vx = Math.abs(b.vx) * 0.8 + 2;
              playBumperSound(880);
              const pts = 500 * engine.multiplier;
              engine.score += pts;
              setScore(engine.score);
              setMessageFeed('TARGET "' + t.letter + '" HIT! + ' + pts + " PTS!");
              if (engine.targets.every((tgt) => !tgt.active)) {
                engine.multiplier = Math.min(5, engine.multiplier + 1);
                setMultiplier(engine.multiplier);
                setMultiballActive(true);
                if (incrementStat) incrementStat("pinballMultiballs", 1);
                if (engine.balls.length < 3) {
                  engine.balls.push({
                    id: Date.now() + Math.random(),
                    x: 240,
                    y: 350,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -4,
                    inPlungerLane: false
                  });
                }
                playAirhorn();
                triggerConfetti();
                setMessageFeed("⭐ B-R-O CLEARED! MULTIBALL ACTIVATED & MULTIPLIER " + engine.multiplier + "X!");
                setTimeout(() => {
                  engine.targets = DROP_TARGETS.map((item) => ({ ...item }));
                }, 1200);
              }
            }
          });
          if (b.y > CANVAS_HEIGHT + 15) {
            engine.balls.splice(i, 1);
            if (Date.now() < engine.ballSaveUntil && engine.balls.length === 0) {
              setMessageFeed("🛡️ BALL SAVED! RELAUNCHING...");
              playWin();
              spawnBall(engine);
            } else if (engine.balls.length === 0) {
              playBustSound();
              setBallsLeft((prev) => {
                const nextBalls = prev - 1;
                if (nextBalls > 0) {
                  setMessageFeed("BALL DRAINED! " + nextBalls + " BALLS LEFT.");
                  setTimeout(() => spawnBall(engine), 800);
                } else {
                  setGameOver(true);
                  const finalScore = engine.score;
                  const wonCP = Math.max(25, Math.floor(finalScore / 150));
                  setCoinsWon(wonCP);
                  if (addCoins) addCoins(wonCP);
                  if (incrementStat) {
                    incrementStat("pinballGames", 1);
                    incrementStat("gamesPlayedCount", 1);
                  }
                  const currentHS = stats?.pinballHighScore || 0;
                  if (finalScore > currentHS && updateStat) {
                    updateStat("pinballHighScore", finalScore);
                  }
                  if (wonCP >= 300) {
                    triggerConfetti();
                    feedService.publish(
                      "scored " + finalScore.toLocaleString() + " PTS on Cyber Pinball for " + wonCP.toLocaleString() + " CP! 🕹️⚡",
                      "win",
                      userProfile?.name || "Player"
                    );
                  }
                }
                return nextBalls;
              });
            }
          }
        }
      }
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, "#060614");
      bgGrad.addColorStop(1, "#0e0e24");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let y = 100; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(440, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(240, 90, 200, Math.PI, 0, false);
      ctx.lineTo(440, CANVAS_HEIGHT);
      ctx.moveTo(40, 90);
      ctx.lineTo(35, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(445, 130);
      ctx.lineTo(445, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(35, 480);
      ctx.lineTo(130, 640);
      ctx.moveTo(440, 480);
      ctx.lineTo(350, 640);
      ctx.stroke();
      engine.targets.forEach((t) => {
        if (t.active) {
          ctx.fillStyle = t.color;
          ctx.shadowColor = t.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(t.x, t.y, t.width, t.height);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#000";
          ctx.font = "bold 12px Orbitron, monospace";
          ctx.textAlign = "center";
          ctx.fillText(t.letter, t.x + t.width / 2, t.y + 18);
        } else {
          ctx.fillStyle = "#222";
          ctx.fillRect(t.x, t.y, t.width, t.height);
        }
      });
      engine.bumpers.forEach((bump) => {
        ctx.save();
        ctx.translate(bump.x, bump.y);
        if (bump.hitEffect > 0) {
          bump.hitEffect -= 0.05;
          ctx.scale(1 + bump.hitEffect * 0.25, 1 + bump.hitEffect * 0.25);
        }
        ctx.fillStyle = bump.color + "22";
        ctx.strokeStyle = bump.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = bump.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, bump.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        const img = bumperImagesRef.current[bump.id];
        const innerRadius = bump.radius - 4;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.clip();
        if (img && img.complete) {
          ctx.drawImage(img, -innerRadius, -innerRadius, innerRadius * 2, innerRadius * 2);
        } else {
          ctx.fillStyle = bump.color;
          ctx.fill();
        }
        ctx.restore();
        ctx.restore();
      });
      engine.slingshots.forEach((s) => {
        ctx.fillStyle = s.color + "33";
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
        ctx.lineTo(s.p3.x, s.p3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      ctx.save();
      ctx.translate(lf.x, lf.y);
      ctx.rotate(lf.angle);
      ctx.fillStyle = "#00ffcc";
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(0, -6, lf.length, 12, [6]);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(rf.x, rf.y);
      ctx.rotate(rf.angle);
      ctx.fillStyle = "#ff007f";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(0, -6, rf.length, 12, [6]);
      ctx.fill();
      ctx.restore();
      for (let pIdx = engine.particles.length - 1; pIdx >= 0; pIdx--) {
        const pt = engine.particles[pIdx];
        if (pt.vx) pt.x += pt.vx;
        if (pt.vy) pt.y += pt.vy;
        pt.life -= 0.05;
        if (pt.life <= 0) {
          engine.particles.splice(pIdx, 1);
        } else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius * pt.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      engine.balls.forEach((b) => {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00e5ff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animIdRef.current = requestAnimationFrame(loop);
    };
    animIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-6 px-3 relative overflow-hidden select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-950/40 via-slate-950 to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#ff007f08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[500px] flex items-center justify-between mb-3 px-1", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-black flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          (coins ?? 0).toLocaleString(),
          " CP"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[500px] bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-4 shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full text-center mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-black italic tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]", children: "⚡ CYBER PINBALL 2088 ⚡" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 px-3 py-1 bg-black/60 rounded-full border border-fuchsia-500/30 text-[11px] font-mono text-fuchsia-300 tracking-wide truncate", children: messageFeed })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full grid grid-cols-3 gap-2 mb-3 bg-black/70 p-2.5 rounded-2xl border border-slate-800 font-mono text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "SCORE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl sm:text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]", children: score.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center border-x border-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "MULTIPLIER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xl sm:text-2xl font-black ${multiplier > 1 ? "text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" : "text-slate-300"}`, children: [
              multiplier,
              "x"
            ] }),
            multiballActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-red-600/80 px-1.5 py-0.5 rounded font-black text-white animate-bounce", children: "MULTI" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold", children: "BALLS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-0.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-3.5 h-3.5 rounded-full border ${i <= ballsLeft ? "bg-cyan-400 border-white shadow-[0_0_8px_#00e5ff]" : "bg-slate-800 border-slate-700"}`
            },
            i
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[480/720] max-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            className: "w-full h-full object-contain"
          }
        ),
        !gameStarted && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_30px_rgba(0,229,255,0.5)] mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl", children: "🕹️" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-cyan-300 mb-1", children: "READY TO LAUNCH?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 max-w-xs mb-5 font-mono", children: "Hit Dino and Bunny character bumpers, spell B-R-O to trigger 3x MULTIBALL, and rack up Cyber Points!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: handleStartGame,
              className: "px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 text-black font-black text-sm tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all",
              children: "🚀 LAUNCH PINBALL (FREE)"
            }
          )
        ] }),
        gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-2", children: "💥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-red-400 tracking-wider mb-1 drop-shadow-[0_0_12px_rgba(248,113,113,0.6)]", children: "GAME OVER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 border border-slate-800 rounded-2xl p-4 my-4 w-full max-w-xs font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: "FINAL SCORE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]", children: score.toLocaleString() }),
            coinsWon > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-slate-800 text-xs text-yellow-400 font-bold flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪙 WON:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "+",
                coinsWon,
                " CP"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SquishyButton,
              {
                onClick: handleStartGame,
                className: "px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold text-xs uppercase rounded-xl shadow-lg hover:brightness-110",
                children: "🔄 PLAY AGAIN"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/arcade",
                className: "px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase rounded-xl border border-slate-700 transition-colors",
                children: "ARCADE"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-3 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onMouseDown: (e) => {
              e.preventDefault();
              setLeftFlipper(true);
            },
            onMouseUp: (e) => {
              e.preventDefault();
              setLeftFlipper(false);
            },
            onTouchStart: (e) => {
              e.preventDefault();
              setLeftFlipper(true);
            },
            onTouchEnd: (e) => {
              e.preventDefault();
              setLeftFlipper(false);
            },
            className: "py-4 bg-gradient-to-b from-cyan-500/20 to-cyan-600/40 border-2 border-cyan-400 rounded-2xl text-cyan-300 font-black text-sm uppercase shadow-[0_0_15px_rgba(0,229,255,0.3)] active:bg-cyan-400 active:text-black active:scale-95 transition-all select-none touch-manipulation",
            children: "◄ LEFT (A)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: releasePlunger,
            onTouchStart: (e) => {
              e.preventDefault();
              releasePlunger();
            },
            className: "py-4 bg-gradient-to-b from-yellow-500/20 to-yellow-600/40 border-2 border-yellow-400 rounded-2xl text-yellow-300 font-black text-sm uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)] active:bg-yellow-400 active:text-black active:scale-95 transition-all select-none touch-manipulation flex items-center justify-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚀" }),
              " LAUNCH"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onMouseDown: (e) => {
              e.preventDefault();
              setRightFlipper(true);
            },
            onMouseUp: (e) => {
              e.preventDefault();
              setRightFlipper(false);
            },
            onTouchStart: (e) => {
              e.preventDefault();
              setRightFlipper(true);
            },
            onTouchEnd: (e) => {
              e.preventDefault();
              setRightFlipper(false);
            },
            className: "py-4 bg-gradient-to-b from-fuchsia-500/20 to-fuchsia-600/40 border-2 border-fuchsia-400 rounded-2xl text-fuchsia-300 font-black text-sm uppercase shadow-[0_0_15px_rgba(255,0,127,0.3)] active:bg-fuchsia-400 active:text-black active:scale-95 transition-all select-none touch-manipulation",
            children: "RIGHT (D) ►"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full text-center mt-2.5 text-[10px] text-slate-500 font-mono", children: "KEYS: [A / ◄ Left]  |  [D / ► Right]  |  [SPACE Launch Plunger]" })
    ] })
  ] });
};
export {
  BALL_RADIUS,
  BUMPERS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DROP_TARGETS,
  GRAVITY,
  SLINGSHOTS,
  CyberPinball as default
};
