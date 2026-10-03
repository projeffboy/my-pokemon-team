import { useLayoutEffect, useRef, useState } from "react";

// Measures text in the button's font without laying it out
let context: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, font: string) => {
  context ??= document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

// The first of the labels, longest first, that fits on one line of the button, or the last one
export default function useFittingLabel(labels: readonly string[]) {
  const ref = useRef<HTMLButtonElement>(null);
  const [label, setLabel] = useState(labels[0] ?? "");
  const key = labels.join("\n");

  useLayoutEffect(() => {
    const button = ref.current;
    if (!button) return;
    const pick = () => {
      const style = getComputedStyle(button);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const room =
        button.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setLabel(
        labels.find(text => textWidth(text, font) <= room) ??
          labels[labels.length - 1] ??
          "",
      );
    };
    pick();
    // The web font arriving changes the text widths but not the button's size
    document.fonts?.ready.then(pick);
    const observer = new ResizeObserver(pick);
    observer.observe(button);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- labels is a new array each render
  }, [key]);

  return { ref, label };
}
