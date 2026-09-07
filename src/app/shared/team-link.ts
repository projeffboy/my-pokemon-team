// Shared store <-> URL team param conversion
import store from "@/store";
import { toBase64Url, fromBase64Url } from "@/app/shared/base64url";
import { serializeTeamText, applyTeamText } from "@/app/shared/team-text";

// Limit applies to the raw (still-encoded) URL param, before any decoding is attempted
export const MAX_ENCODED_TEAM_PARAM_LENGTH = 16 * 1024;

// Returns the `team` URL param value for the store's current team, or "" if the team is empty
export function encodeTeamForUrl(): string {
  if (store.isTeamEmpty) return "";
  return toBase64Url(serializeTeamText());
}

// Decodes a `team` URL param value and applies it to the store. Malformed, oversized,
// or non-UTF-8 payloads are ignored rather than throwing.
export function importTeamFromUrlParam(param: string): void {
  if (!param || param.length > MAX_ENCODED_TEAM_PARAM_LENGTH) return;

  let text: string;
  try {
    text = fromBase64Url(param);
  } catch {
    return;
  }

  applyTeamText(text);
}
