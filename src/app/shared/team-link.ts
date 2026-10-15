// Shared store <-> URL team parameter conversion
import store from "@/store";
import { isGeneration } from "@/shared/generations";
import { CHAMPIONS_FORMAT, formatGeneration } from "@/shared/formats";
import { LEGENDS_ZA } from "@/shared/game-variants";
import {
  COMBINED_GENERATIONS_PROFILE,
  teamDataFormat,
} from "@/shared/generation-profile";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import type { SavedTeam, ReadonlyTeam } from "@/types";
import { toBase64Url, fromBase64Url } from "./base64url";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamText,
  serializeTeam,
} from "@/store/team-text";

// Limit applies to the raw (still-encoded) URL parameter, before any decoding is attempted
export const MAX_ENCODED_TEAM_PARAMETER_LENGTH = 16 * 1024;

// Returns the `team` URL parameter value for the store's current team, or "" if the team is empty
export function encodeTeamForUrl(): string {
  if (store.isTeamEmpty) return "";
  return toBase64Url(
    serializeTeam(
      store.team,
      store.currentTeam.generation,
      store.currentTeam.format,
    ),
  );
}

// The `game` parameter of each game, which a link carries in place of `gen`
const GAME_PARAMETERS = new Map([
  [CHAMPIONS_FORMAT, "champions"],
  [LEGENDS_ZA, "legends-za"],
]);

// The share link of any team, as the address bar shows the current one
export function syncGenerationToUrl(
  url: URL,
  settings: Pick<SavedTeam, "generation" | "format" | "generationProfile">,
) {
  const game = GAME_PARAMETERS.get(settings.format);
  if (game) {
    url.searchParams.set("game", game);
    url.searchParams.delete("gen");
  } else {
    url.searchParams.set(
      "gen",
      settings.generationProfile ?? String(settings.generation),
    );
    url.searchParams.delete("game");
  }
  url.searchParams.sort();
}

export function teamUrl(
  team: ReadonlyTeam,
  settings = store.currentTeam,
): string {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set(
    "team",
    toBase64Url(serializeTeam(team, settings.generation, settings.format)),
  );
  syncGenerationToUrl(url, settings);
  return url.href;
}

// A recognized game wins over gen. A gen or game the site does not recognize is
// `unrecognized`, and the link opens in its valid gen, or else in Generations 6–9.
export function generationSettingsFromUrl(): {
  settings: Pick<SavedTeam, "generation" | "format" | "generationProfile">;
  unrecognized: boolean;
} {
  const params = new URLSearchParams(
    typeof location === "undefined" ? "" : location.search,
  );
  // An empty value counts as missing
  const gen = params.get("gen") || null;
  const game = params.get("game") || null;
  // Links made Oct 10–13, 2026 named Champions by its format at the time
  const format =
    game === "Pokemon Champions (M-C)" ? CHAMPIONS_FORMAT : (
      [...GAME_PARAMETERS].find(([, value]) => value === game)?.[0]
    );
  if (format)
    return {
      settings: { generation: formatGeneration(format, 9), format },
      unrecognized: false,
    };
  const generation = Number(gen);
  const valid = isGeneration(generation);
  return {
    settings: valid ? { generation, format: "" } : { ...DEFAULT_TEAM_SETTINGS },
    unrecognized:
      game !== null ||
      (gen !== null && gen !== COMBINED_GENERATIONS_PROFILE && !valid),
  };
}

// Opens a matching saved team, or an unsaved draft until the first edit, and returns
// whether it opened one. Malformed, oversized, or non-UTF-8 payloads are ignored.
export function importTeamFromUrlParameter(teamParameter: string): boolean {
  if (
    !teamParameter ||
    teamParameter.length > MAX_ENCODED_TEAM_PARAMETER_LENGTH
  )
    return false;

  let text: string;
  try {
    text = fromBase64Url(teamParameter);
  } catch {
    return false;
  }

  const { settings } = generationSettingsFromUrl();
  return store.openTeamFromLink(
    parseTeamText(
      text,
      settings.generation,
      teamDataFormat(settings),
      LEGACY_LINK_PARSING_OPTIONS,
    ),
    settings,
  );
}
