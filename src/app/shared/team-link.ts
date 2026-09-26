// Shared store <-> URL team parameter conversion
import store from "@/store";
import type { ReadonlyTeam } from "@/types";
import { toBase64Url, fromBase64Url } from "./base64url";
import { parseTeamText, serializeTeam, serializeTeamText } from "./team-text";

// Limit applies to the raw (still-encoded) URL parameter, before any decoding is attempted
export const MAX_ENCODED_TEAM_PARAMETER_LENGTH = 16 * 1024;

// Returns the `team` URL parameter value for the store's current team, or "" if the team is empty
export function encodeTeamForUrl(): string {
  if (store.isTeamEmpty) return "";
  return toBase64Url(serializeTeamText());
}

// The share link of any team, as the address bar shows the current one
export function teamUrl(team: ReadonlyTeam): string {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("team", toBase64Url(serializeTeam(team)));
  return url.href;
}

// Decodes a `team` URL parameter value and opens it in the store: in the current team
// when it is empty, else in the saved team it matches or a new one. Malformed,
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

  store.openTeamFromLink(parseTeamText(text));
}
