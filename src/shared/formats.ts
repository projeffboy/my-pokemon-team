import {
  LETS_GO,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
  variantGeneration,
} from "./game-variants";
import type { Generation, SavedTeam } from "@/types";
import { isGeneration, LATEST_GENERATION } from "./generations";

export const CHAMPIONS_FORMAT = "Pokemon Champions (M-C)";

// Showdown's Create-A-Pokemon format: OU plus the fan-made CAP pokemon
export const CAP_FORMAT = "CAP";

// Pokemon Champions is a Gen 9 game, so a team in its format is a Gen 9 team
export const CHAMPIONS_GENERATION: Generation = 9;

export const formatGeneration = (format: string, generation: Generation) =>
  format === CHAMPIONS_FORMAT ? CHAMPIONS_GENERATION : (
    (variantGeneration(format) ?? generation)
  );

// The format when it is a game, which share links carry, and "" for a tier or none
export const gameFormat = (format: string) =>
  format === CHAMPIONS_FORMAT || variantGeneration(format) ? format : "";

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
  CAP_FORMAT,
  "Doubles Uber",
  "Doubles OU",
  "Doubles UU",
];

// Supported tier formats in Showdown's config/formats.ts, including challenge-only
// past-gen formats. RU exists in Gen 3 but not Gen 4; Gen 2 has no LC format.
// Showdown's CAP goes back to Gen 4, but the past generations' data has no CAP pokemon.
const FORMAT_GENERATIONS: Record<string, readonly Generation[]> = {
  [CHAMPIONS_FORMAT]: [9],
  [CAP_FORMAT]: [9],
  "RU: Rarely Used": [3, 5, 6, 7, 8, 9],
  "Little Cup (LC)": [1, 3, 4, 5, 6, 7, 8, 9],
  "Doubles Uber": [8, 9],
  "Doubles OU": [3, 4, 5, 6, 7, 8, 9],
  "Doubles UU": [7, 8, 9],
};

// Generations 6–9 lists only pokemon from the games, so there CAP would be the same as OU
export const formatsForGeneration = (
  generation: Generation,
  generationProfile?: SavedTeam["generationProfile"],
) =>
  FORMATS.filter(
    format =>
      (FORMAT_GENERATIONS[format]?.includes(generation) ?? true) &&
      !(format === CAP_FORMAT && generationProfile),
  );

export const formatForGeneration = (
  format: string,
  generation: Generation,
  generationProfile?: SavedTeam["generationProfile"],
) =>
  (
    variantGeneration(format) === generation ||
    formatsForGeneration(generation, generationProfile).includes(format)
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
  [CAP_FORMAT]: "CAP",
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
  [CAP_FORMAT]: "cap",
  "Doubles Uber": "doublesubers",
  "Doubles OU": "doublesou",
  "Doubles UU": "doublesuu",
};

export const showdownFormatId = (generation: Generation, format: string) =>
  `gen${generation}${SHOWDOWN_FORMAT_IDS[format] ?? ""}`;

// The reverse: "gen8ou" => Gen 8 OU; older unprefixed tier IDs use Gen 6.
// Unknown IDs retain the regular latest-generation default.
export function parseShowdownFormatId(id: string): {
  generation: Generation;
  format: string;
} {
  const raw = id.trim().toLowerCase();
  const legacy =
    !raw.startsWith("gen") && Object.values(SHOWDOWN_FORMAT_IDS).includes(raw);
  const formatId = legacy ? `gen6${raw}` : raw;
  const match = /^gen(\d)(.*)$/.exec(formatId);
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
