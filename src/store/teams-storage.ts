import type {
  BaseStats,
  NameView,
  MoveSortOrder,
  SavedTeam,
  SortOrder,
  Team,
  TeamPokemon,
} from "@/types";
import { STAT_KEYS } from "@/types";
import { isGeneration, LATEST_GENERATION } from "@/shared/generations";
import { COMBINED_GENERATIONS_PROFILE } from "@/shared/generation-profile";
import { gameFormat } from "@/shared/formats";
import { isLocale, type Locale } from "@/i18n/locales";
import {
  createEmptyTeam,
  createSavedTeam,
  createSearchFilters,
  DEFAULT_TEAM_SETTINGS,
} from "@/shared/team";
import { DEFAULT_SORT, DEFAULT_MOVE_SORT, SORT_KEYS } from "./sorting";

export const STORAGE_KEY = "mypokemonteam";

export function getBrowserStorage(): Storage | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

export interface StoredState {
  teams: SavedTeam[];
  currentTeamId: string;
  showMoveTypes: boolean;
  sort: SortOrder;
  moveSort: MoveSortOrder;
  nameView: NameView;
  // Unset until a language is chosen, so the browser's language applies
  locale?: Locale;
  // Set once the player has dragged a slot tab or dismissed the hint about it
  knowsSlotDrag?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const string = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

function sanitizeStats(value: unknown): Partial<BaseStats> | undefined {
  if (!isRecord(value)) return undefined;
  return Object.fromEntries(
    STAT_KEYS.flatMap(stat => {
      const number = value[stat];
      return typeof number === "number" && Number.isFinite(number) ?
          [[stat, number]]
        : [];
    }),
  );
}

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
  if (typeof raw.level === "number" && Number.isFinite(raw.level))
    member.level = raw.level;
  if (typeof raw.happiness === "number" && Number.isFinite(raw.happiness))
    member.happiness = raw.happiness;
  if (raw.gender === "M" || raw.gender === "F" || raw.gender === "N")
    member.gender = raw.gender;
  if (typeof raw.shiny === "boolean") member.shiny = raw.shiny;
  if (typeof raw.teraType === "string") member.teraType = raw.teraType;
  if (typeof raw.nature === "string") member.nature = raw.nature;
  for (const key of ["evs", "ivs", "statExperience", "effortLevels"] as const) {
    const stats = sanitizeStats(raw[key]);
    if (stats) member[key] = stats;
  }
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
  if (!isRecord(value) || typeof value.id !== "string" || !value.id)
    return undefined;
  const generation =
    isGeneration(value.generation) ? value.generation : LATEST_GENERATION;
  const format = string(value.format);
  const team = sanitizeTeam(value.team);
  return {
    id: value.id,
    name: string(value.name),
    generation,
    format,
    ...(generation === 9 &&
      !gameFormat(format) &&
      value.generationProfile === COMBINED_GENERATIONS_PROFILE && {
        generationProfile: COMBINED_GENERATIONS_PROFILE,
      }),
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
  const usedIds = new Set(
    raw.teams.flatMap(team =>
      isRecord(team) && typeof team.id === "string" && team.id ? [team.id] : [],
    ),
  );
  const seenIds = new Set<string>();
  let recoveredCurrentTeamId: string | undefined;
  const teams = raw.teams
    .map((team, index) => {
      if (!isRecord(team)) return undefined;
      let id = typeof team.id === "string" ? team.id : "";
      if (!id || seenIds.has(id)) {
        const prefix = `recovered-team-${index + 1}`;
        id = prefix;
        let suffix = 2;
        while (usedIds.has(id)) id = `${prefix}-${suffix++}`;
        usedIds.add(id);
      }
      seenIds.add(id);
      if (
        recoveredCurrentTeamId === undefined &&
        typeof raw.currentTeamId === "string" &&
        team.id === raw.currentTeamId
      )
        recoveredCurrentTeamId = id;
      return sanitizeSavedTeam({ ...team, id });
    })
    .filter((team): team is SavedTeam => team !== undefined);
  if (!teams.length) return undefined;
  const currentTeamId = recoveredCurrentTeamId ?? string(raw.currentTeamId);
  return {
    teams,
    currentTeamId:
      teams.some(team => team.id === currentTeamId) ? currentTeamId : (
        (teams[0]?.id ?? "")
      ),
    // On unless it was turned off, so states saved before the setting keep the icons
    showMoveTypes: raw.showMoveTypes !== false,
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
  const pick = <T>(base: T, mine: T, theirs: T) => {
    const value = stableJson(mine);
    return value === stableJson(base) && value !== stableJson(theirs) ?
        theirs
      : mine;
  };
  const indexed = ({ teams }: StoredState) =>
    new Map(teams.map(team => [team.id, team]));
  const baseById = indexed(base);
  const mineById = indexed(mine);
  const theirsById = indexed(theirs);
  const idsIn = ({ teams }: StoredState, other: Map<string, SavedTeam>) =>
    teams.map(({ id }) => id).filter(id => other.has(id));
  // Teams only `rest` has go after the team before them there
  const order = (first: StoredState, rest: StoredState) => {
    const nextIds = new Map<string, string | undefined>(
      first.teams.map(({ id }, index) => [id, first.teams[index + 1]?.id]),
    );
    let head = first.teams[0]?.id;
    let before: string | undefined;
    rest.teams.forEach(({ id }) => {
      if (!nextIds.has(id)) {
        nextIds.set(id, before === undefined ? head : nextIds.get(before));
        if (before === undefined) head = id;
        else nextIds.set(before, id);
      }
      before = id;
    });
    const ids: string[] = [];
    for (
      let id: string | undefined = head;
      id !== undefined;
      id = nextIds.get(id)
    )
      ids.push(id);
    return ids;
  };
  // The other tab's order, unless this tab reordered its teams
  const reordered =
    stableJson(idsIn(mine, baseById)) !== stableJson(idsIn(base, mineById));
  const merged = (reordered ? order(mine, theirs) : order(theirs, mine))
    .map(id => pick(baseById.get(id), mineById.get(id), theirsById.get(id)))
    .filter(team => team !== undefined);
  const teams = merged.length ? merged : mine.teams;
  const teamsById = new Map(teams.map(team => [team.id, team]));
  const currentTeam =
    [mine, theirs]
      .map(state => teamsById.get(state.currentTeamId))
      .find(team => team) ?? teams[0];
  const locale = pick(base.locale, mine.locale, theirs.locale);
  return {
    teams,
    currentTeamId: currentTeam?.id ?? mine.currentTeamId,
    showMoveTypes: pick(
      base.showMoveTypes,
      mine.showMoveTypes,
      theirs.showMoveTypes,
    ),
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
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    // The team still lives in the page's link
    return false;
  }
}

export const initialStoredState = (): StoredState => {
  const team = createSavedTeam({ name: "Team 1", ...DEFAULT_TEAM_SETTINGS });
  return {
    teams: [team],
    currentTeamId: team.id,
    showMoveTypes: true,
    sort: DEFAULT_SORT,
    moveSort: DEFAULT_MOVE_SORT,
    nameView: "list",
  };
};
