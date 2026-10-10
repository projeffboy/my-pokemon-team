import {
  MOVE_KEYS,
  STAT_KEYS,
  type BaseStats,
  type SavedTeam,
  type TeamPokemon,
} from "@/types";
import { isGeneration } from "@/shared/generations";
import { createSavedTeam } from "@/shared/team";
import { stableJson } from "./teams-storage";

export const MAX_TEAM_BACKUP_BYTES = 10 * 1024 * 1024;

export interface TeamBackupCollection {
  teams: readonly SavedTeam[];
  currentTeamId: string;
  draftTeam?: SavedTeam;
}

export interface TeamBackup extends TeamBackupCollection {
  format: "mypokemonteam";
  version: 1;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasFields = (
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
) =>
  required.every(key => Object.hasOwn(value, key)) &&
  Object.keys(value).every(
    key => required.includes(key) || optional.includes(key),
  );

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isStatMap = (value: unknown): value is Partial<BaseStats> =>
  isRecord(value) &&
  Object.entries(value).every(
    ([key, number]) =>
      STAT_KEYS.some(stat => stat === key) && isFiniteNumber(number),
  );

// A backup preserves set values even when they are unavailable or illegal in its game.
function isMember(value: unknown): value is TeamPokemon {
  const properties = ["name", "item", "ability", ...MOVE_KEYS];
  const strings = ["nickname", "teraType", "nature"];
  const numbers = ["level", "happiness"];
  const stats = ["evs", "ivs", "statExperience", "effortLevels"];
  return (
    isRecord(value) &&
    hasFields(value, properties, [
      ...strings,
      ...numbers,
      ...stats,
      "gender",
      "shiny",
    ]) &&
    properties.every(key => typeof value[key] === "string") &&
    strings.every(
      key => value[key] === undefined || typeof value[key] === "string",
    ) &&
    numbers.every(
      key => value[key] === undefined || isFiniteNumber(value[key]),
    ) &&
    stats.every(key => value[key] === undefined || isStatMap(value[key])) &&
    (value.gender === undefined ||
      value.gender === "M" ||
      value.gender === "F" ||
      value.gender === "N") &&
    (value.shiny === undefined || typeof value.shiny === "boolean")
  );
}

function isSavedTeam(value: unknown): value is SavedTeam {
  const filters = ["type", "region", "ability", "moves"];
  return (
    isRecord(value) &&
    hasFields(value, [
      "id",
      "name",
      "generation",
      "format",
      "filters",
      "team",
    ]) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    isGeneration(value.generation) &&
    typeof value.format === "string" &&
    isRecord(value.filters) &&
    hasFields(value.filters, filters) &&
    filters.every(
      key =>
        typeof (value.filters as Record<string, unknown>)[key] === "string",
    ) &&
    Array.isArray(value.team) &&
    value.team.length === 6 &&
    Array.from(value.team).every(isMember)
  );
}

function isTeamBackup(value: unknown): value is TeamBackup {
  if (
    !isRecord(value) ||
    !hasFields(
      value,
      ["format", "version", "teams", "currentTeamId"],
      ["draftTeam"],
    ) ||
    value.format !== "mypokemonteam" ||
    value.version !== 1 ||
    !Array.isArray(value.teams) ||
    !Array.from(value.teams).every(isSavedTeam) ||
    typeof value.currentTeamId !== "string" ||
    (value.draftTeam !== undefined && !isSavedTeam(value.draftTeam))
  )
    return false;
  const teams = [
    ...value.teams,
    ...(value.draftTeam ? [value.draftTeam] : []),
  ] as SavedTeam[];
  const ids = new Set(teams.map(team => team.id));
  return ids.size === teams.length && ids.has(value.currentTeamId);
}

const withinSizeLimit = (text: string) =>
  text.length <= MAX_TEAM_BACKUP_BYTES &&
  new TextEncoder().encode(text).byteLength <= MAX_TEAM_BACKUP_BYTES;

export function serializeTeamBackup(collection: TeamBackupCollection): string {
  const backup: TeamBackup = {
    format: "mypokemonteam",
    version: 1,
    ...collection,
  };
  if (!isTeamBackup(backup)) throw new Error("Invalid team backup");
  const pretty = `${JSON.stringify(backup, null, 2)}\n`;
  if (withinSizeLimit(pretty)) return pretty;
  const compact = `${JSON.stringify(backup)}\n`;
  if (!withinSizeLimit(compact))
    throw new RangeError("Team backup is too large");
  return compact;
}

export function parseTeamBackup(text: string): TeamBackup | undefined {
  if (!withinSizeLimit(text)) return undefined;
  try {
    const backup: unknown = JSON.parse(text.replace(/^\uFEFF/, ""));
    return isTeamBackup(backup) ? backup : undefined;
  } catch {
    return undefined;
  }
}

const payloadKey = ({ id: _id, ...payload }: SavedTeam) => stableJson(payload);

export function mergeTeamBackup(
  existing: readonly SavedTeam[],
  backup: TeamBackup,
) {
  if (!isTeamBackup(backup)) throw new Error("Invalid team backup");
  const copies = new Map<string, number>();
  for (const team of existing) {
    const key = payloadKey(team);
    copies.set(key, (copies.get(key) ?? 0) + 1);
  }
  const ids = new Set(existing.map(team => team.id));
  const added: SavedTeam[] = [];
  let skipped = 0;
  for (const source of [
    ...backup.teams,
    ...(backup.draftTeam ? [backup.draftTeam] : []),
  ]) {
    const key = payloadKey(source);
    const remaining = copies.get(key) ?? 0;
    if (remaining) {
      copies.set(key, remaining - 1);
      skipped++;
      continue;
    }
    const { id: _id, ...settings } = structuredClone(source);
    let restored = createSavedTeam(settings);
    while (ids.has(restored.id)) restored = createSavedTeam(settings);
    ids.add(restored.id);
    added.push(restored);
  }
  return { added, skipped };
}
