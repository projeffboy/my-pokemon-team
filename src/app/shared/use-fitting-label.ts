import { useLayoutEffect, useRef, useState } from "react";

// Measured widths by font, language, and text, until a font arriving changes them
const cache = new Map<string, number>();
if (typeof document !== "undefined")
  document.fonts?.addEventListener("loadingdone", () => cache.clear());

// Measures text as the element renders it, without laying it out there. A canvas would
// miss the element's language, which picks the glyphs of Japanese and Chinese text.
const textWidths = (element: HTMLElement, texts: readonly string[]) => {
  const style = getComputedStyle(element);
  const font = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontStyle: style.fontStyle,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    textTransform: style.textTransform,
  };
  const lang = element.closest("[lang]")?.getAttribute("lang") ?? "";
  const key = (text: string) => [...Object.values(font), lang, text].join("\n");
  const missing = texts.filter(text => !cache.has(key(text)));
  if (missing.length) {
    const ruler = document.createElement("span");
    Object.assign(ruler.style, font, {
      position: "fixed",
      visibility: "hidden",
      whiteSpace: "pre",
    });
    ruler.lang = lang;
    document.body.append(ruler);
    for (const text of missing) {
      ruler.textContent = text;
      cache.set(key(text), ruler.getBoundingClientRect().width);
    }
    ruler.remove();
  }
  return (text: string) => cache.get(key(text)) ?? 0;
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
      const room =
        element.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const width = textWidths(
        element,
        labels.flatMap(text => text.split("\n")),
      );
      setLabel(
        labels.find(text =>
          text.split("\n").every(line => width(line) <= room),
        ) ??
          labels[labels.length - 1] ??
          "",
      );
    };
    pick();
    // The web font arriving changes the text widths but not the element's size
    document.fonts?.ready.then(() => {
      cache.clear();
      pick();
    });
    const observer = new ResizeObserver(pick);
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- labels is a new array each render
  }, [key]);

  return { ref, label };
}
