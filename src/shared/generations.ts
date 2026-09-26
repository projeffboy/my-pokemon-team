import type { Generation } from "@/types";

export const LATEST_GENERATION: Generation = 9;

// Newest first, as the generation menu lists them
export const GENERATIONS: readonly Generation[] = [9, 8, 7, 6, 5, 4, 3, 2, 1];

export const GENERATION_GAMES: Record<
  Generation,
  { short: string; games: string }
> = {
  9: { short: "SV / ZA", games: "Scarlet / Violet · Legends: Z-A" },
  8: {
    short: "SwSh / BDSP / PLA",
    games:
      "Sword / Shield · Brilliant Diamond / Shining Pearl · Legends: Arceus",
  },
  7: {
    short: "SM / USUM",
    games: "Sun / Moon · Ultra Sun / Ultra Moon · Let's Go",
  },
  6: { short: "XY / ORAS", games: "X / Y · Omega Ruby / Alpha Sapphire" },
  5: { short: "BW / B2W2", games: "Black / White · Black 2 / White 2" },
  4: {
    short: "DPPt / HGSS",
    games: "Diamond / Pearl / Platinum · HeartGold / SoulSilver",
  },
  3: {
    short: "RSE / FRLG",
    games: "Ruby / Sapphire / Emerald · FireRed / LeafGreen",
  },
  2: { short: "GSC", games: "Gold / Silver / Crystal" },
  1: { short: "RBY", games: "Red / Blue / Yellow" },
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

export const generationLabel = (generation: Generation) => `Gen ${generation}`;

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
