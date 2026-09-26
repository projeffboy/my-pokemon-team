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

// Smogon's strategy dex is organised by each generation's main games
const SMOGON_DEX_CODES: Record<Generation, string> = {
  1: "rb",
  2: "gs",
  3: "rs",
  4: "dp",
  5: "bw",
  6: "xy",
  7: "sm",
  8: "ss",
  9: "sv",
};

export const isGeneration = (value: unknown): value is Generation =>
  GENERATIONS.includes(value as Generation);

// E.g. https://www.smogon.com/dex/sv/pokemon/garchomp/ for any Garchomp forme
export function smogonDexUrl(generation: Generation, baseSpeciesName: string) {
  const slug = baseSpeciesName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://www.smogon.com/dex/${SMOGON_DEX_CODES[generation]}/pokemon/${slug}/`;
}
