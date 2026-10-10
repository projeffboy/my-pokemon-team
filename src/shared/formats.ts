import {
  LETS_GO,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
  variantGeneration,
} from "./game-variants";
import type { Generation } from "@/types";
import { isGeneration, LATEST_GENERATION } from "./generations";

export const CHAMPIONS_FORMAT = "Pokemon Champions (M-C)";

// Pokemon Champions is a Gen 9 game, so a team in its format is a Gen 9 team
export const CHAMPIONS_GENERATION: Generation = 9;

export const formatGeneration = (format: string, generation: Generation) =>
  format === CHAMPIONS_FORMAT ? CHAMPIONS_GENERATION : (
    (variantGeneration(format) ?? generation)
  );

// The Format options listed in the Filters dialog
export const FORMATS: readonly string[] = [
  CHAMPIONS_FORMAT,
  "Uber",
  "OU: Over Used",
  "UU: Under Used",
  "RU: Rarely Used",
  "NU: Never Used",
  "PU",
  "ZU",
  "Little Cup (LC)",
  "Doubles Uber",
  "Doubles OU",
  "Doubles UU",
];

// Supported tier formats in Showdown's config/formats.ts, including challenge-only
// past-gen formats. RU exists in Gen 3 but not Gen 4; Gen 2 has no LC format.
const FORMAT_GENERATIONS: Record<string, readonly Generation[]> = {
  [CHAMPIONS_FORMAT]: [9],
  "RU: Rarely Used": [3, 5, 6, 7, 8, 9],
  "Little Cup (LC)": [1, 3, 4, 5, 6, 7, 8, 9],
  "Doubles Uber": [8, 9],
  "Doubles OU": [3, 4, 5, 6, 7, 8, 9],
  "Doubles UU": [7, 8, 9],
};

export const formatsForGeneration = (generation: Generation) =>
  FORMATS.filter(
    format => FORMAT_GENERATIONS[format]?.includes(generation) ?? true,
  );

export const formatForGeneration = (format: string, generation: Generation) =>
  (
    variantGeneration(format) === generation ||
    formatsForGeneration(generation).includes(format)
  ) ?
    format
  : "";

// Each format's Smogon tier, which formats.ts lists pokemon under
export const TIER_BY_FORMAT: Record<string, string> = {
  Uber: "Uber",
  "OU: Over Used": "OU",
  "UU: Under Used": "UU",
  "RU: Rarely Used": "RU",
  "NU: Never Used": "NU",
  PU: "PU",
  ZU: "ZU",
  "Little Cup (LC)": "LC",
  "Doubles Uber": "DUber",
  "Doubles OU": "DOU",
  "Doubles UU": "DUU",
};

// E.g. "OU" or "Champions (M-C)", for the team cards
export const formatShortName = (format: string) =>
  format === CHAMPIONS_FORMAT ? "Champions (M-C)" : (
    (TIER_BY_FORMAT[format] ?? format)
  );

// The format ID in a Showdown team header, e.g. `=== [gen9ou] My team ===`
const SHOWDOWN_FORMAT_IDS: Record<string, string> = {
  [CHAMPIONS_FORMAT]: "champions",
  [LETS_GO]: "letsgo",
  [LEGENDS_ARCEUS]: "legendsarceus",
  [LEGENDS_ZA]: "legendsza",
  Uber: "ubers",
  "OU: Over Used": "ou",
  "UU: Under Used": "uu",
  "RU: Rarely Used": "ru",
  "NU: Never Used": "nu",
  PU: "pu",
  ZU: "zu",
  "Little Cup (LC)": "lc",
  "Doubles Uber": "doublesubers",
  "Doubles OU": "doublesou",
  "Doubles UU": "doublesuu",
};

export const showdownFormatId = (generation: Generation, format: string) =>
  `gen${generation}${SHOWDOWN_FORMAT_IDS[format] ?? ""}`;

// The reverse: "gen8ou" => Gen 8 and OU, with unknown parts left at their defaults
export function parseShowdownFormatId(id: string): {
  generation: Generation;
  format: string;
} {
  const match = /^gen(\d)(.*)$/.exec(id.trim().toLowerCase());
  const generation = Number(match?.[1]);
  const rest = match?.[2] ?? "";
  const format =
    Object.entries(SHOWDOWN_FORMAT_IDS).find(([, formatId]) =>
      rest.startsWith(formatId),
    )?.[0] ?? "";
  return {
    generation: formatGeneration(
      format,
      isGeneration(generation) ? generation : LATEST_GENERATION,
    ),
    format,
  };
}
