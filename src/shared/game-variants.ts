import type { Generation } from "@/types";
export const LETS_GO = "Let’s Go";
export const LEGENDS_ARCEUS = "Legends: Arceus";
export const LEGENDS_ZA = "Legends: Z-A";
// A format rather than a variant in the menus, but with its own move data like the variants
export const CHAMPIONS_FORMAT = "Pokemon Champions (M-C)";
export const GAME_VARIANTS = [LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA] as const;
export const variantGeneration = (format: string): Generation | undefined =>
  format === LETS_GO ? 7
  : format === LEGENDS_ARCEUS ? 8
  : format === LEGENDS_ZA ? 9
  : undefined;
