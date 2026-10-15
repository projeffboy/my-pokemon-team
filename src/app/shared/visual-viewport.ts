// The part of the page on screen, which the on-screen keyboard shrinks. Phone browsers
// keep the layout viewport, which fixed elements such as dialogs fill, at full height
// behind the keyboard, so a dialog sized by these instead keeps its actions in view.
export const visualViewportTop = "var(--visual-viewport-top, 0px)";
export const visualViewportHeight = "var(--visual-viewport-height, 100%)";

export function trackVisualViewport() {
  const viewport = window.visualViewport;
  if (!viewport) return;
  const { style } = document.documentElement;
  const update = () => {
    style.setProperty("--visual-viewport-top", `${viewport.offsetTop}px`);
    style.setProperty("--visual-viewport-height", `${viewport.height}px`);
  };
  update();
  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);
  return () => {
    viewport.removeEventListener("resize", update);
    viewport.removeEventListener("scroll", update);
    style.removeProperty("--visual-viewport-top");
    style.removeProperty("--visual-viewport-height");
  };
}
