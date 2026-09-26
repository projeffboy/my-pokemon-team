import type { Generation } from "@/types";
import { isGeneration, LATEST_GENERATION } from "./generations";

export const CHAMPIONS_FORMAT = "Pokemon Champions (M-C)";

// The Format options, as the Filters and Name and Format dialogs list them
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

export const isDoublesFormat = (format: string) =>
  format === CHAMPIONS_FORMAT || format.startsWith("Doubles");

// E.g. "OU" or "Champions (M-C)", for the team cards
export const formatShortName = (format: string) =>
  format === CHAMPIONS_FORMAT ? "Champions (M-C)" : (
    (TIER_BY_FORMAT[format] ?? format)
  );

// The format ID in a Showdown team header, e.g. `=== [gen9ou] My team ===`
const SHOWDOWN_FORMAT_IDS: Record<string, string> = {
  [CHAMPIONS_FORMAT]: "champions",
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
    generation: isGeneration(generation) ? generation : LATEST_GENERATION,
    format,
  };
}
