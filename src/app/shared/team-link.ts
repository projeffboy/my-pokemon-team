// Shared store <-> URL team parameter conversion
import store from "@/store";
import { isGeneration } from "@/shared/generations";
import { GAME_VARIANTS, variantGeneration } from "@/shared/game-variants";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { DEFAULT_TEAM_SETTINGS } from "@/shared/team";
import type { SavedTeam, ReadonlyTeam } from "@/types";
import { toBase64Url, fromBase64Url } from "./base64url";
import { parseTeamText, serializeTeam } from "@/store/team-text";

// Limit applies to the raw (still-encoded) URL parameter, before any decoding is attempted
export const MAX_ENCODED_TEAM_PARAMETER_LENGTH = 16 * 1024;

// Returns the `team` URL parameter value for the store's current team, or "" if the team is empty
export function encodeTeamForUrl(): string {
  if (store.isTeamEmpty) return "";
  return toBase64Url(serializeTeam(store.team));
}

// The share link of any team, as the address bar shows the current one
export function syncGenerationToUrl(
  url: URL,
  settings: Pick<SavedTeam, "generation" | "format">,
) {
  if (
    settings.generation !== 9 ||
    (!url.searchParams.has("team") &&
      settings.format !== CHAMPIONS_FORMAT &&
      !variantGeneration(settings.format))
  )
    url.searchParams.set("gen", String(settings.generation));
  else url.searchParams.delete("gen");
  if (
    settings.format === CHAMPIONS_FORMAT ||
    variantGeneration(settings.format)
  )
    url.searchParams.set("game", settings.format);
  else url.searchParams.delete("game");
}

export function teamUrl(
  team: ReadonlyTeam,
  settings = store.currentTeam,
): string {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("team", toBase64Url(serializeTeam(team)));
  syncGenerationToUrl(url, settings);
  return url.href;
}

export function generationSettingsFromUrl() {
  const params = new URLSearchParams(
    typeof location === "undefined" ? "" : location.search,
  );
  if (!params.has("gen") && !params.has("game")) {
    // Old team links without a generation are regular Gen 9; only fresh visits default to Champions.
    return params.get("team") ?
        { generation: 9 as const, format: "" }
      : { ...DEFAULT_TEAM_SETTINGS };
  }
  const game = params.get("game") ?? "";
  const format =
    (
      game === CHAMPIONS_FORMAT ||
      GAME_VARIANTS.some(variant => variant === game)
    ) ?
      game
    : "";
  const generation =
    format === CHAMPIONS_FORMAT ? 9 : (
      (variantGeneration(format) ?? Number(params.get("gen")))
    );
  return isGeneration(generation) ? { generation, format } : undefined;
}

// Opens a matching saved team, or an unsaved draft until the first edit. Malformed,
// oversized, or non-UTF-8 payloads are ignored rather than throwing.
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

  store.openTeamFromLink(
    parseTeamText(text),
    generationSettingsFromUrl() ?? { generation: 9, format: "" },
  );
}
