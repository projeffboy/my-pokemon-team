import type {
  BaseStats,
  SavedTeam,
  SortOrder,
  Team,
  TeamPokemon,
} from "@/types";
import { isGeneration, LATEST_GENERATION } from "@/shared/generations";
import { createEmptyTeam, createSavedTeam } from "@/shared/team";
import { DEFAULT_SORT } from "./sorting";

const STORAGE_KEY = "mypokemonteam";

export interface StoredState {
  teams: SavedTeam[];
  currentTeamId: string;
  isMoreOpen: boolean;
  sort: SortOrder;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const string = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const isStatMap = (value: unknown): value is Partial<BaseStats> =>
  isRecord(value) && Object.values(value).every(n => typeof n === "number");

// Keeps whatever of a stored slot is well-formed
function sanitizeMember(value: unknown): TeamPokemon {
  const raw = isRecord(value) ? value : {};
  const member: TeamPokemon = {
    name: string(raw.name),
    item: string(raw.item),
    ability: string(raw.ability),
    move1: string(raw.move1),
    move2: string(raw.move2),
    move3: string(raw.move3),
    move4: string(raw.move4),
  };
  if (typeof raw.nickname === "string") member.nickname = raw.nickname;
  if (typeof raw.level === "number") member.level = raw.level;
  if (raw.gender === "M" || raw.gender === "F" || raw.gender === "N")
    member.gender = raw.gender;
  if (raw.shiny === true) member.shiny = true;
  if (typeof raw.teraType === "string") member.teraType = raw.teraType;
  if (typeof raw.nature === "string") member.nature = raw.nature;
  if (isStatMap(raw.evs)) member.evs = raw.evs;
  if (isStatMap(raw.ivs)) member.ivs = raw.ivs;
  return member;
}

export function sanitizeTeam(value: unknown): Team {
  const team = createEmptyTeam();
  if (!Array.isArray(value)) return team;
  return team.map((empty, i) =>
    i < value.length ? sanitizeMember(value[i]) : empty,
  );
}

export function sanitizeSavedTeam(value: unknown): SavedTeam | undefined {
  if (!isRecord(value) || typeof value.id !== "string") return undefined;
  return {
    id: value.id,
    name: string(value.name),
    generation:
      isGeneration(value.generation) ? value.generation : LATEST_GENERATION,
    format: string(value.format),
    team: sanitizeTeam(value.team),
  };
}

function sanitizeSort(value: unknown): SortOrder {
  if (!isRecord(value) || typeof value.by !== "string") return DEFAULT_SORT;
  return {
    by: value.by as SortOrder["by"],
    descending: value.descending === true,
  };
}

// The saved state, or undefined when nothing usable is saved
export function loadStoredState(
  storage: Storage | undefined,
): StoredState | undefined {
  let raw: unknown;
  try {
    raw = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return undefined;
  }
  if (!isRecord(raw) || !Array.isArray(raw.teams)) return undefined;
  const teams = raw.teams
    .map(sanitizeSavedTeam)
    .filter((team): team is SavedTeam => team !== undefined);
  if (!teams.length) return undefined;
  const currentTeamId = string(raw.currentTeamId);
  return {
    teams,
    currentTeamId:
      teams.some(team => team.id === currentTeamId) ? currentTeamId : (
        (teams[0]?.id ?? "")
      ),
    isMoreOpen: raw.isMoreOpen === true,
    sort: sanitizeSort(raw.sort),
  };
}

// Saving can fail in private windows or when the storage is full, and the team stays usable
export function saveStoredState(
  storage: Storage | undefined,
  state: StoredState,
) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The team still lives in the page's link
  }
}

export const initialStoredState = (): StoredState => {
  const team = createSavedTeam({ name: "Team 1" });
  return {
    teams: [team],
    currentTeamId: team.id,
    isMoreOpen: false,
    sort: DEFAULT_SORT,
  };
};
