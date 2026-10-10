import { useLayoutEffect, useRef, useState } from "react";

// Measures text in the element's font without laying it out
let context: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, font: string) => {
  context ??= document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

// The first label whose lines fit the element's width, or the last one
export default function useFittingLabel<
  T extends HTMLElement = HTMLButtonElement,
>(labels: readonly string[]) {
  const ref = useRef<T>(null);
  const [label, setLabel] = useState(labels[0] ?? "");
  const key = labels.join("\n");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pick = () => {
      const style = getComputedStyle(element);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;
      const room =
        element.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setLabel(
        labels.find(text =>
          text
            .split("\n")
            .every(
              line =>
                textWidth(line, font) + line.length * letterSpacing <= room,
            ),
        ) ??
          labels[labels.length - 1] ??
          "",
      );
    };
    pick();
    // The web font arriving changes the text widths but not the element's size
    document.fonts?.ready.then(pick);
    const observer = new ResizeObserver(pick);
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- labels is a new array each render
  }, [key]);

  return { ref, label };
}
