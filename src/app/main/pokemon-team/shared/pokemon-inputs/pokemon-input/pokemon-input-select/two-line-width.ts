import type { CSSProperties } from "react";

// Wide enough for the longest name in any language to take two lines
const MAX_TEXT_WIDTH = 400;

const widths = new Map<string, number>();

// A classic scrollbar takes its width from the rows; an overlay one takes none
export const scrollbarWidth = () => {
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "absolute",
    visibility: "hidden",
    overflow: "scroll",
    width: "50px",
    height: "50px",
  });
  document.body.append(box);
  const width = box.offsetWidth - box.clientWidth;
  box.remove();
  return width;
};

// The widest of some short labels on one line, such as the type abbreviations
export const widestText = (labels: readonly string[], font: string) => {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  context.font = font;
  return Math.ceil(
    Math.max(0, ...labels.map(label => context.measureText(label).width)),
  );
};

// The narrowest text column, no narrower than `minWidth`, in which none of a dropdown's
// labels takes more than two lines. `key` names the list: its kind, language, and game.
// Measured in the browser, since the width of a name depends on the fonts the device has,
// most of all for Chinese, Japanese, and Korean.
export default function twoLineWidth(
  key: string,
  labels: () => readonly string[],
  typography: CSSProperties,
  minWidth: number,
) {
  const cached = widths.get(key);
  if (cached) return cached;

  const probe = document.createElement("div");
  Object.assign(probe.style, typography, {
    position: "absolute",
    visibility: "hidden",
    top: "0",
    left: "0",
    wordBreak: "break-word",
  });
  const line = document.createElement("div");
  line.textContent = "A";
  const rows = labels().map(label => {
    const row = document.createElement("div");
    row.textContent = label;
    return row;
  });
  probe.append(line, ...rows);
  document.body.append(probe);

  const twoLines = 2 * line.offsetHeight + 1;
  const tooTall = (candidates: HTMLElement[], width: number) => {
    probe.style.width = `${width}px`;
    return candidates.filter(row => row.offsetHeight > twoLines);
  };
  let low = minWidth;
  let high = MAX_TEXT_WIDTH;
  // A label that fits at the narrowest width fits at every wider one
  const longLabels = tooTall(rows, low);
  probe.replaceChildren(...longLabels);
  while (longLabels.length && low < high) {
    const middle = Math.floor((low + high) / 2);
    if (tooTall(longLabels, middle).length) low = middle + 1;
    else high = middle;
  }
  probe.remove();

  // Labels measured in a fallback font, or before the game's data has loaded, are
  // measured again
  if (rows.length && document.fonts.status === "loaded") widths.set(key, low);
  return low;
}
