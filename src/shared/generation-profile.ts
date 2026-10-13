import type { SavedTeam } from "@/types";

export const COMBINED_GENERATIONS_PROFILE = "6-9";
export const COMBINED_GENERATIONS_FORMAT = "Generations 6–9";

// Gen 6–9 and the four special-game pools occupy bits 5–12.
export const COMBINED_GENERATIONS_MASK = 0b1111111100000;

export const teamDataFormat = (
  team: Pick<SavedTeam, "format" | "generationProfile">,
) =>
  team.generationProfile === COMBINED_GENERATIONS_PROFILE ?
    COMBINED_GENERATIONS_FORMAT
  : team.format;
