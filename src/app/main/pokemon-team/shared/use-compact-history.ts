import { useLayoutEffect, useRef, useState } from "react";

export default function useCompactHistory(key: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const row = ref.current;
    const context = document.createElement("canvas").getContext("2d");
    if (!row || !context) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const buttons = [
        ...row.querySelectorAll<HTMLButtonElement>(":scope > button"),
      ];
      const widths = buttons.map(button => {
        const style = getComputedStyle(button);
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        // Use the full adaptive labels so shrinking history cannot change the measurement.
        const text = button.dataset.fullLabel ?? button.textContent ?? "";
        const label =
          style.textTransform === "uppercase" ? text.toUpperCase() : text;
        const textWidth =
          context.measureText(label).width +
          label.length * (parseFloat(style.letterSpacing) || 0);
        const iconWidth =
          button.querySelector("svg")?.getBoundingClientRect().width ?? 0;
        const contents =
          style.flexDirection === "column" ?
            Math.max(textWidth, iconWidth)
          : textWidth + iconWidth + (parseFloat(style.columnGap) || 0);
        return (
          contents +
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight)
        );
      });
      const stacked =
        buttons[0] && getComputedStyle(buttons[0]).flexDirection === "column";
      const needed =
        stacked ?
          Math.max(...widths) * widths.length
        : widths.reduce((sum, width) => sum + width, 0);
      setCompact(needed > row.clientWidth);
    };
    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    const labels = new MutationObserver(measure);
    labels.observe(row, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => {
      active = false;
      observer.disconnect();
      labels.disconnect();
    };
  }, [key]);

  return { ref, compact };
}
