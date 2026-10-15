// The part of the page on screen, which the on-screen keyboard shrinks. Phone browsers
// keep the layout viewport, which fixed elements such as dialogs fill, at full height
// behind the keyboard, so a dialog sized by these instead keeps its actions in view.
export const visualViewportTop = "var(--visual-viewport-top, 0px)";
export const visualViewportHeight = "var(--visual-viewport-height, 100%)";

// A dialog height that leaves a 60px gap for the bottom ad. The ad is fixed to the
// bottom of the layout viewport, so while the keyboard covers it the dialog takes the
// whole visible part of the page.
export const heightAboveAd = `min(${visualViewportHeight}, calc(100% - 60px - ${visualViewportTop}))`;

export function trackVisualViewport() {
  const viewport = window.visualViewport;
  if (!viewport) return;
  const { style } = document.documentElement;
  const clear = () => {
    style.removeProperty("--visual-viewport-top");
    style.removeProperty("--visual-viewport-height");
  };
  const update = () => {
    // Pinch zoom shrinks the visual viewport too, but zoomed-in dialogs keep filling
    // the page, so the player can pan around them
    if (viewport.scale !== 1) return clear();
    style.setProperty("--visual-viewport-top", `${viewport.offsetTop}px`);
    style.setProperty("--visual-viewport-height", `${viewport.height}px`);
  };
  update();
  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);
  return () => {
    viewport.removeEventListener("resize", update);
    viewport.removeEventListener("scroll", update);
    clear();
  };
}
