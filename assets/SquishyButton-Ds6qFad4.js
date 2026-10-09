import { a as useRetroSound, j as jsxRuntimeExports } from "./index-YccJbbn7.js";
const SquishyButton = ({ children, onClick, style, ...props }) => {
  const { playBeep } = useRetroSound();
  const handleClick = (e) => {
    playBeep();
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    if (onClick) onClick(e);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "squishy-btn",
      onClick: handleClick,
      style,
      ...props,
      children
    }
  );
};
export {
  SquishyButton as S
};
