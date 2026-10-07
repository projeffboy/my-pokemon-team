import type {
  BaseStats,
  NameView,
  MoveSortOrder,
  SavedTeam,
  SortOrder,
  Team,
  TeamPokemon,
} from "@/types";
import { isGeneration, LATEST_GENERATION } from "@/shared/generations";
import { generationRules } from "@/shared/generation-rules";
import { MAX_HAPPINESS, DEFAULT_HAPPINESS } from "@/shared/set-details";
import { isLocale, type Locale } from "@/i18n/locales";
import {
  createEmptyTeam,
  createSavedTeam,
  createSearchFilters,
  DEFAULT_TEAM_SETTINGS,
} from "@/shared/team";
import { DEFAULT_SORT, DEFAULT_MOVE_SORT, SORT_KEYS } from "./sorting";

export const STORAGE_KEY = "mypokemonteam";

export interface StoredState {
  teams: SavedTeam[];
  currentTeamId: string;
  isMoreOpen: boolean;
  sort: SortOrder;
  moveSort: MoveSortOrder;
  nameView: NameView;
  // Unset until a language is chosen, so the browser's language applies
  locale?: Locale;
  // Set once the player has dragged a slot tab or dismissed the hint about it
  knowsSlotDrag?: boolean;
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
  if (
    typeof raw.happiness === "number" &&
    Number.isInteger(raw.happiness) &&
    raw.happiness >= 0 &&
    raw.happiness <= MAX_HAPPINESS &&
    raw.happiness !== DEFAULT_HAPPINESS
  )
    member.happiness = raw.happiness;
  if (raw.gender === "M" || raw.gender === "F" || raw.gender === "N")
    member.gender = raw.gender;
  if (raw.shiny === true) member.shiny = true;
  if (typeof raw.teraType === "string") member.teraType = raw.teraType;
  if (typeof raw.nature === "string") member.nature = raw.nature;
  if (isStatMap(raw.evs)) member.evs = raw.evs;
  if (isStatMap(raw.ivs)) member.ivs = raw.ivs;
  if (isStatMap(raw.statExperience)) member.statExperience = raw.statExperience;
  if (isStatMap(raw.effortLevels)) member.effortLevels = raw.effortLevels;
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
  const generation =
    isGeneration(value.generation) ? value.generation : LATEST_GENERATION;
  const format = string(value.format);
  const team = sanitizeTeam(value.team);
  if (!generationRules(generation, format).happiness)
    for (const member of team) delete member.happiness;
  return {
    id: value.id,
    name: string(value.name),
    generation,
    format,
    filters: Object.fromEntries(
      Object.entries(createSearchFilters()).map(([key, fallback]) => [
        key,
        string(
          isRecord(value.filters) ? value.filters[key] : undefined,
          fallback,
        ),
      ]),
    ) as SavedTeam["filters"],
    team,
  };
}

function sanitizeSort(value: unknown): SortOrder {
  const by =
    isRecord(value) ? SORT_KEYS.find(key => key === value.by) : undefined;
  if (!isRecord(value) || !by) return DEFAULT_SORT;
  return { by, descending: value.descending === true };
}

function sanitizeMoveSort(value: unknown): MoveSortOrder {
  if (!isRecord(value) || (value.by !== "name" && value.by !== "type"))
    return DEFAULT_MOVE_SORT;
  return { by: value.by, descending: value.descending === true };
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
    moveSort: sanitizeMoveSort(raw.moveSort),
    nameView:
      raw.nameView === "grid" || raw.nameView === "big-grid" ?
        raw.nameView
      : "list",
    ...(isLocale(raw.locale) && { locale: raw.locale }),
    ...(raw.knowsSlotDrag === true && { knowsSlotDrag: true }),
  };
}

// Set details are stored in the order they were edited, so keys are sorted
// for the same value to give the same text
const sortKeys = (_key: string, value: unknown) =>
  typeof value === "object" && value !== null && !Array.isArray(value) ?
    Object.fromEntries(
      Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
    )
  : value;

export const stableJson = (value: unknown) => JSON.stringify(value, sortKeys);

// This tab's state with what other tabs have saved since `base`, the saved
// state as this tab last read or saved it. What this tab changed too stays as
// it is here, and so does the team it is on.
export function mergeStoredState(
  base: StoredState,
  mine: StoredState,
  theirs: StoredState,
): StoredState {
  const pick = <T>(base: T, mine: T, theirs: T) =>
    (
      stableJson(mine) === stableJson(base) &&
      stableJson(mine) !== stableJson(theirs)
    ) ?
      theirs
    : mine;
  const find = ({ teams }: StoredState, id: string) =>
    teams.find(team => team.id === id);
  const ids = new Set([...mine.teams, ...theirs.teams].map(({ id }) => id));
  const merged = [...ids]
    .map(id => pick(find(base, id), find(mine, id), find(theirs, id)))
    .filter(team => team !== undefined);
  const teams = merged.length ? merged : mine.teams;
  const currentTeam =
    [mine, theirs]
      .map(state => find({ ...state, teams }, state.currentTeamId))
      .find(team => team) ?? teams[0];
  const locale = pick(base.locale, mine.locale, theirs.locale);
  return {
    teams,
    currentTeamId: currentTeam?.id ?? mine.currentTeamId,
    isMoreOpen: pick(base.isMoreOpen, mine.isMoreOpen, theirs.isMoreOpen),
    sort: pick(base.sort, mine.sort, theirs.sort),
    moveSort: pick(base.moveSort, mine.moveSort, theirs.moveSort),
    nameView: pick(base.nameView, mine.nameView, theirs.nameView),
    ...(locale && { locale }),
    ...((mine.knowsSlotDrag || theirs.knowsSlotDrag) && {
      knowsSlotDrag: true,
    }),
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
  const team = createSavedTeam({ name: "Team 1", ...DEFAULT_TEAM_SETTINGS });
  return {
    teams: [team],
    currentTeamId: team.id,
    isMoreOpen: false,
    sort: DEFAULT_SORT,
    moveSort: DEFAULT_MOVE_SORT,
    nameView: "list",
  };
};
