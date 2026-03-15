import { l as frame, n as isMotionValue, J as JSAnimation, r as reactExports, M as MotionConfigContext } from "./index-Dbaofx5w.js";
import { a as useTransform, u as useMotionValue } from "./use-transform-YWkJi1zV.js";
function attachFollow(value, source, options = {}) {
  const initialValue = value.get();
  let activeAnimation = null;
  let latestValue = initialValue;
  let latestSetter;
  const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
  const stopAnimation = () => {
    if (activeAnimation) {
      activeAnimation.stop();
      activeAnimation = null;
    }
  };
  const startAnimation = () => {
    stopAnimation();
    const currentValue = asNumber(value.get());
    const targetValue = asNumber(latestValue);
    if (currentValue === targetValue) {
      return;
    }
    activeAnimation = new JSAnimation({
      keyframes: [currentValue, targetValue],
      velocity: value.getVelocity(),
      // Default to spring if no type specified (matches useSpring behavior)
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...options,
      onUpdate: latestSetter
    });
  };
  value.attach((v, set) => {
    latestValue = v;
    latestSetter = (latest) => set(parseValue(latest, unit));
    frame.postRender(() => {
      startAnimation();
      value["events"].animationStart?.notify();
      activeAnimation?.then(() => {
        value["events"].animationComplete?.notify();
      });
    });
  }, stopAnimation);
  if (isMotionValue(source)) {
    const removeSourceOnChange = source.on("change", (v) => value.set(parseValue(v, unit)));
    const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
    return () => {
      removeSourceOnChange();
      removeValueOnDestroy();
    };
  }
  return stopAnimation;
}
function parseValue(v, unit) {
  return unit ? v + unit : v;
}
function asNumber(v) {
  return typeof v === "number" ? v : parseFloat(v);
}
function useFollowValue(source, options = {}) {
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  const getFromSource = () => isMotionValue(source) ? source.get() : source;
  if (isStatic) {
    return useTransform(getFromSource);
  }
  const value = useMotionValue(getFromSource());
  reactExports.useInsertionEffect(() => {
    return attachFollow(value, source, options);
  }, [value, JSON.stringify(options)]);
  return value;
}
function useSpring(source, options = {}) {
  return useFollowValue(source, { type: "spring", ...options });
}
export {
  useSpring as u
};
