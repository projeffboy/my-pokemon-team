type CssUnit = "px" | "rem";

const ROOT_FONT_SIZE = 16;
const PRECISION = 6;

const round = (value: number) => Number(value.toFixed(PRECISION));

export function fluidClamp(
  minSize: number,
  maxSize: number,
  minViewportWidth: number,
  maxViewportWidth: number,
  unit: CssUnit = "px",
) {
  if (maxSize < minSize) {
    throw new RangeError("maxSize must be greater than or equal to minSize");
  }

  if (maxViewportWidth <= minViewportWidth) {
    throw new RangeError(
      "maxViewportWidth must be greater than minViewportWidth",
    );
  }

  const unitScale = unit === "rem" ? ROOT_FONT_SIZE : 1;
  const minSizeInPixels = minSize * unitScale;
  const maxSizeInPixels = maxSize * unitScale;
  const slope =
    (maxSizeInPixels - minSizeInPixels) / (maxViewportWidth - minViewportWidth);
  const interceptInPixels = minSizeInPixels - slope * minViewportWidth;
  const intercept = round(interceptInPixels / unitScale);
  const fluidSize = `${round(slope * 100)}vw`;
  const preferredSize =
    intercept === 0 ? fluidSize : (
      `calc(${fluidSize} ${intercept < 0 ? "-" : "+"} ${Math.abs(intercept)}${unit})`
    );

  return `clamp(${minSize}${unit}, ${preferredSize}, ${maxSize}${unit})`;
}
