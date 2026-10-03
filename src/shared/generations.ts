import type { Generation } from "@/types";

export const LATEST_GENERATION: Generation = 9;

// Newest first, as the generation menu lists them
export const GENERATIONS: readonly Generation[] = [9, 8, 7, 6, 5, 4, 3, 2, 1];

// Each generation's games, abbreviated; the full titles are in src/i18n
export const GENERATION_GAMES: Record<Generation, string> = {
  9: "SV / ZA",
  8: "SwSh / BDSP / PLA",
  7: "SM / USUM",
  6: "XY / ORAS",
  5: "BW / B2W2",
  4: "DPPt / HGSS",
  3: "RSE / FRLG",
  2: "GSC",
  1: "RBY",
};

export const isGeneration = (value: unknown): value is Generation =>
  GENERATIONS.includes(value as Generation);
