import { CHAMPIONS_LOGO, GAME_LOGOS } from "@/images/game-logos";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { variantGeneration } from "@/shared/game-variants";
import type { Generation } from "@/types";

export function gameLogosFor(generation: Generation, format = "") {
  if (format === CHAMPIONS_FORMAT) return [CHAMPIONS_LOGO];
  return GAME_LOGOS[generation].filter(logo =>
    format === "Let’s Go" ? logo.name.includes("Let's Go")
    : variantGeneration(format) ? logo.name.includes(format)
    : !logo.name.includes("Legends:") && !logo.name.includes("Let's Go"),
  );
}
