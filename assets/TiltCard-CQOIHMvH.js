import { r as reactExports, j as jsxRuntimeExports, m as motion } from "./index-CDIAvxnU.js";
import { u as useMotionValue, a as useTransform } from "./use-transform-CaG2_BbL.js";
import { u as useSpring } from "./use-spring-CQgLS1RG.js";
const TiltCard = ({ children, className, style, onClick, glowColor = "rgba(255,255,255,0.2)" }) => {
  const ref = reactExports.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), springConfig);
  useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      ref,
      className,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
      style: {
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1e3
      },
      whileHover: { scale: 1.02, zIndex: 10 },
      whileTap: { scale: 0.98 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "translateZ(20px)", height: "100%", display: "flex", flexDirection: "column" }, children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            style: {
              position: "absolute",
              top: "-50%",
              left: "-50%",
              bottom: "-50%",
              right: "-50%",
              background: `radial-gradient(circle at ${50}% ${50}%, ${glowColor}, transparent 60%)`,
              opacity: useTransform(x, [-0.5, 0.5], [0, 0.4]),
              translateX: useTransform(x, [-0.5, 0.5], [-50, 50]),
              // Parallax glare
              translateY: useTransform(y, [-0.5, 0.5], [-50, 50]),
              pointerEvents: "none",
              zIndex: 20,
              mixBlendMode: "overlay"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            style: {
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: useTransform(
                [rotateX, rotateY],
                (latest) => `${latest[1] * -2}px ${latest[0] * 2}px 20px rgba(0,0,0,0.5)`
              ),
              pointerEvents: "none"
            }
          }
        )
      ]
    }
  );
};
export {
  TiltCard as T
};
