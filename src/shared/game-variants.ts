import type { Generation } from "@/types";
export const LETS_GO = "Let’s Go";
export const LEGENDS_ARCEUS = "Legends: Arceus";
export const LEGENDS_ZA = "Legends: Z-A";
export const GAME_VARIANTS = [LETS_GO, LEGENDS_ARCEUS, LEGENDS_ZA] as const;
export const variantGeneration = (format: string): Generation | undefined =>
  format === LETS_GO ? 7
  : format === LEGENDS_ARCEUS ? 8
  : format === LEGENDS_ZA ? 9
  : undefined;
