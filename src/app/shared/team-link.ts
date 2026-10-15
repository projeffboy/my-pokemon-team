// Shared store <-> URL team parameter conversion
import store from "@/store";
import { isGeneration } from "@/shared/generations";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import {
  COMBINED_GENERATIONS_PROFILE,
  teamDataFormat,
} from "@/shared/generation-profile";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import type { SavedTeam, ReadonlyTeam } from "@/types";
import { toBase64Url, fromBase64Url } from "./base64url";
import {
  LEGACY_LINK_PARSING_OPTIONS,
  parseTeamTextReport,
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

// The share link of any team, as the address bar shows the current one
export function syncGenerationToUrl(
  url: URL,
  settings: Pick<SavedTeam, "generation" | "format" | "generationProfile">,
) {
  if (settings.format === CHAMPIONS_FORMAT) {
    url.searchParams.set("game", "champions");
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

export function generationSettingsFromUrl():
  Pick<SavedTeam, "generation" | "format" | "generationProfile"> | undefined {
  const params = new URLSearchParams(
    typeof location === "undefined" ? "" : location.search,
  );
  if (
    !params.has("game") &&
    (!params.has("gen") || params.get("gen") === COMBINED_GENERATIONS_PROFILE)
  )
    return { ...DEFAULT_TEAM_SETTINGS };
  const game = params.get("game");
  const format = game === "champions" ? CHAMPIONS_FORMAT : "";
  const generation =
    format === CHAMPIONS_FORMAT ? 9 : Number(params.get("gen"));
  return isGeneration(generation) ? { generation, format } : undefined;
}

// Opens a matching saved team, or an unsaved draft until the first edit, and names
// what the link's text lost. Malformed, oversized, or non-UTF-8 payloads are
// ignored rather than throwing.
export function importTeamFromUrlParameter(teamParameter: string): void {
  if (
    !teamParameter ||
    teamParameter.length > MAX_ENCODED_TEAM_PARAMETER_LENGTH
  )
    return;

  let text: string;
  try {
    text = fromBase64Url(teamParameter);
  } catch {
    return;
  }

  const settings = generationSettingsFromUrl() ?? { ...DEFAULT_TEAM_SETTINGS };
  const { team, dropped } = parseTeamTextReport(
    text,
    settings.generation,
    teamDataFormat(settings),
    LEGACY_LINK_PARSING_OPTIONS,
  );
  store.openTeamFromLink(team, settings);
  store.reportDroppedEntries("link", dropped, text);
}
