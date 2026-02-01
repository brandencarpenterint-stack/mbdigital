import { r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, S as SquishyButton } from "./index-CRAV8IaB.js";
const BeatVisualizer = ({ audioCtx, isPlaying }) => {
  const canvasRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const dataArrayRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!audioCtx || !audioCtx.current) return;
    if (!analyserRef.current) {
      const analyser = audioCtx.current.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
    }
  }, [audioCtx]);
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      if (!dataArrayRef.current) {
        dataArrayRef.current = new Uint8Array(bufferLength);
      }
      analyser.getByteFrequencyData(dataArrayRef.current);
    } else {
      if (!dataArrayRef.current) dataArrayRef.current = new Uint8Array(32).fill(0);
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / 32 * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < 32; i++) {
      let value = dataArrayRef.current ? dataArrayRef.current[i] : 0;
      if (isPlaying && !analyserRef.current) {
        value = Math.random() * 200;
      }
      barHeight = value / 2;
      ctx.fillStyle = `rgb(${value + 100}, 50, 255)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, Date.now() / 5 % canvas.height, canvas.width, 2);
    rafRef.current = requestAnimationFrame(draw);
  };
  reactExports.useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    border: "4px solid #333",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    marginBottom: "20px"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: 300,
      height: 100,
      style: { width: "100%", height: "100px", display: "block" }
    }
  ) });
};
const BeatLab = () => {
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [bpm, setBpm] = reactExports.useState(128);
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [selectedBank, setSelectedBank] = reactExports.useState("retro");
  const [activeTracks, setActiveTracks] = reactExports.useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    hihat: Array(16).fill(false),
    bass: Array(16).fill(false),
    fx: Array(16).fill(false)
  });
  const audioCtx = reactExports.useRef(null);
  const analyserNode = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const stepRef = reactExports.useRef(0);
  const PRESETS = {
    "MUSHROOM": {
      kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
      bass: [true, true, false, true, false, false, true, false, true, true, false, true, false, false, true, false],
      fx: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false]
    },
    "SPEEDSTER": {
      kick: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
      snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      bass: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      fx: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true]
    },
    "HERO": {
      kick: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      snare: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      bass: [true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true],
      fx: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false]
    }
  };
  const initAudio = () => {
    if (!audioCtx.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new Ctx();
      analyserNode.current = audioCtx.current.createAnalyser();
      analyserNode.current.connect(audioCtx.current.destination);
    }
    if (audioCtx.current.state === "suspended") {
      audioCtx.current.resume();
    }
  };
  const playSound = (type, time = 0) => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = time || ctx.currentTime;
    const dest = analyserNode.current || ctx.destination;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(dest);
    if (selectedBank === "8bit") {
      if (type === "kick") {
        osc.type = "square";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "snare") {
        const nOsc = ctx.createOscillator();
        nOsc.type = "sawtooth";
        nOsc.frequency.setValueAtTime(400, now);
        nOsc.connect(gain);
        nOsc.start(now);
        nOsc.stop(now + 0.1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      } else if (type === "hihat") {
        osc.type = "square";
        osc.frequency.setValueAtTime(2e3, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "bass") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.setValueAtTime(55, now + 0.1);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "fx") {
        osc.type = "square";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.setValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } else if (selectedBank === "trap") {
      if (type === "kick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "snare") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "bass") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(40, now);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else {
        playRetroSound(type, now, dest);
      }
    } else {
      playRetroSound(type, now, dest);
    }
  };
  const playRetroSound = (type, now, dest) => {
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(dest);
    switch (type) {
      case "kick":
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case "snare":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(250, now);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case "hihat":
        osc.type = "square";
        osc.frequency.setValueAtTime(8e3, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case "bass":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 600;
        osc.disconnect();
        osc.connect(lp);
        lp.connect(gain);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case "fx":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  };
  reactExports.useEffect(() => {
    if (isPlaying) {
      stepRef.current = currentStep;
      timerRef.current = setInterval(() => {
        const next = (stepRef.current + 1) % 16;
        stepRef.current = next;
        setCurrentStep(next);
        playStep(next);
      }, 60 / bpm * 1e3 / 4);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, bpm, selectedBank]);
  const activeTracksRef = reactExports.useRef(activeTracks);
  reactExports.useEffect(() => {
    activeTracksRef.current = activeTracks;
  }, [activeTracks]);
  const playStep = (step) => {
    const tracks = activeTracksRef.current;
    if (tracks.kick[step]) playSound("kick");
    if (tracks.snare[step]) playSound("snare");
    if (tracks.hihat[step]) playSound("hihat");
    if (tracks.bass[step]) playSound("bass");
    if (tracks.fx[step]) playSound("fx");
  };
  const toggleStep = (track, index) => {
    const newTracks = { ...activeTracks };
    newTracks[track][index] = !newTracks[track][index];
    setActiveTracks(newTracks);
    if (navigator.vibrate) navigator.vibrate(5);
  };
  const loadPreset = (name) => {
    if (PRESETS[name]) {
      setActiveTracks(PRESETS[name]);
      if (name === "MUSHROOM") setSelectedBank("8bit");
      else if (name === "SPEEDSTER") setSelectedBank("8bit");
      else if (name === "HERO") setSelectedBank("retro");
    }
  };
  const clearPattern = () => {
    setActiveTracks({
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false),
      bass: Array(16).fill(false),
      fx: Array(16).fill(false)
    });
  };
  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };
  const TRACK_COLORS = {
    kick: "#ff0055",
    // Neon Pink
    snare: "#ffcc00",
    // Gold
    hihat: "#00ccff",
    // Cyan
    bass: "#bf00ff",
    // Purple
    fx: "#00ff66"
    // Green
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    background: "linear-gradient(to bottom, #050510, #000)",
    minHeight: "100vh",
    padding: "20px",
    paddingBottom: "140px",
    color: "white",
    fontFamily: '"Orbitron", sans-serif',
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", position: "relative", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: { textDecoration: "none", fontSize: "1.5rem", opacity: 0.8, color: "white" }, children: "⬅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h1,
          {
            animate: { textShadow: ["0 0 10px #00ccff", "0 0 20px #bf00ff", "0 0 10px #00ccff"] },
            transition: { duration: 2, repeat: Infinity },
            style: { fontSize: "1.8rem", color: "#fff", margin: 0, letterSpacing: "2px" },
            children: "BEAT LAB 3.0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", color: "#666", letterSpacing: "2px" }, children: "SONIC ARCHITECTURE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "2rem" } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BeatVisualizer, { audioCtx, isPlaying }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: {
      padding: "20px",
      marginBottom: "20px",
      background: "rgba(20, 20, 30, 0.6)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(10px)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "20px", alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SquishyButton,
        {
          onClick: togglePlay,
          style: {
            padding: "15px 40px",
            fontSize: "1.2rem",
            background: isPlaying ? "var(--neon-pink)" : "var(--neon-green)",
            color: "black",
            border: "none",
            borderRadius: "50px",
            fontWeight: "bold",
            boxShadow: `0 0 20px ${isPlaying ? "var(--neon-pink)" : "var(--neon-green)"}`,
            minWidth: "150px"
          },
          children: isPlaying ? "HALT ■" : "ENGAGE ▶"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "5px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: "0.7rem", color: "#888", letterSpacing: "1px" }, children: "SOUND BANK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedBank,
            onChange: (e) => setSelectedBank(e.target.value),
            style: {
              background: "#111",
              color: "var(--neon-blue)",
              border: "1px solid var(--neon-blue)",
              padding: "10px",
              borderRadius: "5px",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
              boxShadow: "0 0 5px var(--neon-blue)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "retro", children: "RETRO WAVE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "8bit", children: "8-BIT CHIP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "trap", children: "DEEP TRAP" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "5px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { fontSize: "0.7rem", color: "#888" }, children: [
          "TEMPO: ",
          bpm,
          " BPM"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: "60",
            max: "180",
            value: bpm,
            onChange: (e) => setBpm(parseInt(e.target.value)),
            style: { accentColor: "var(--neon-pink)", width: "120px" }
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", alignSelf: "center", fontSize: "0.8rem" }, children: "PRESETS:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => loadPreset("MUSHROOM"), className: "preset-btn", style: { borderColor: "#e52521", color: "#e52521" }, children: "MUSHROOM 🍄" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => loadPreset("SPEEDSTER"), className: "preset-btn", style: { borderColor: "#0066cc", color: "#0066cc" }, children: "SPEEDSTER 🦔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => loadPreset("HERO"), className: "preset-btn", style: { borderColor: "#107a28", color: "#107a28" }, children: "HERO 🛡️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearPattern, className: "preset-btn", style: { borderColor: "#555", color: "#aaa" }, children: "CLEAR 🗑️" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .preset-btn {
                    padding: 8px 15px;
                    background: transparent;
                    border: 1px solid;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: inherit;
                    transition: all 0.2s;
                }
                .preset-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: scale(1.05);
                }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-panel", style: {
      padding: "20px",
      border: "1px solid #333",
      background: "rgba(0,0,0,0.8)",
      overflowX: "auto",
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)"
    }, children: Object.keys(activeTracks).map((track) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: "10px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "60px",
        textAlign: "right",
        marginRight: "15px",
        color: TRACK_COLORS[track],
        fontWeight: "bold",
        fontSize: "0.7rem",
        textShadow: `0 0 5px ${TRACK_COLORS[track]}`
      }, children: track.toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "4px", flex: 1, minWidth: "350px" }, children: activeTracks[track].map((isActive, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          whileTap: { scale: 0.8 },
          onClick: () => toggleStep(track, i),
          style: {
            aspectRatio: "1/1.5",
            background: isActive ? TRACK_COLORS[track] : i % 4 === 0 ? "#333" : "#1a1a1a",
            borderRadius: "3px",
            cursor: "pointer",
            border: i === currentStep ? "1px solid white" : `1px solid ${isActive ? TRACK_COLORS[track] : "#222"}`,
            opacity: isActive ? 1 : 0.6,
            transform: i === currentStep ? "scale(1.15)" : "scale(1)",
            boxShadow: isActive ? `0 0 10px ${TRACK_COLORS[track]}` : "none",
            zIndex: i === currentStep ? 10 : 1
          }
        },
        i
      )) })
    ] }, track)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginTop: "20px", color: "#555", fontSize: "0.6rem", letterSpacing: "2px" }, children: "AUDIO ENGINE CONNECTED // 44.1KHZ" })
  ] });
};
export {
  BeatLab as default
};
