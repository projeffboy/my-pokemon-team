export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export const STAT_KEYS = ["hp", "atk", "def", "spa", "spd", "spe"] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type BaseStats = Record<StatKey, number>;

export type Gender = "M" | "F" | "N";

export interface PokedexEntry {
  num?: number;
  types?: (PokemonType | "Bird")[];
  name?: string;
  baseSpecies?: string;
  otherFormes?: string[];
  prevo?: string;
  forme?: string;
  abilities?: Record<string, string>;
  baseStats?: BaseStats;
  // Set when a species is always male, always female, or genderless
  gender?: Gender;
  tier?: string;
  doublesTier?: string;
  natDexTier?: string;
  isNonstandard?: string;
  requiredItem?: string;
  requiredItems?: string[];
}

export type Pokedex = Record<string, PokedexEntry>;

export interface MoveEntry {
  type?: PokemonType | "Stellar" | "???";
  status?: string;
  secondary?: { chance?: number; status?: string };
  boosts?: Record<string, number>;
  basePower?: number;
  multihit?: unknown;
  basePowerCallback?: unknown;
  onModifyMove?: unknown;
  flags?: Record<string, number>;
  category?: string;
  name?: string;
}

export type Moves = Record<string, MoveEntry>;

export type Learnsets = Record<string, string[]>;

export type Formats = Record<
  string,
  { tier?: string; doublesTier?: string; champions?: true }
>;

type TypeChartStatus =
  | "prankster"
  | "par"
  | "brn"
  | "trapped"
  | "powder"
  | "sandstorm"
  | "hail"
  | "psn"
  | "tox"
  | "frz";

export type TypeChart = Record<
  PokemonType,
  Record<PokemonType, number> & Partial<Record<TypeChartStatus, number>>
>;

export type Items = Record<string, { name?: string; spritenum?: number }>;

export type Natures = Record<
  string,
  { name?: string; plus?: StatKey; minus?: StatKey }
>;

export type PokemonType =
  | "Bug"
  | "Dark"
  | "Dragon"
  | "Electric"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Flying"
  | "Ghost"
  | "Grass"
  | "Ground"
  | "Ice"
  | "Normal"
  | "Poison"
  | "Psychic"
  | "Rock"
  | "Steel"
  | "Water";

export const MOVE_KEYS = ["move1", "move2", "move3", "move4"] as const;
export type MoveKey = (typeof MOVE_KEYS)[number];
export type PokemonProperties = keyof TeamPokemonProperties;

export const POKEMON_TYPES: readonly PokemonType[] = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water",
];

export function isPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.some(type => type === value);
}

// The dropdown inputs of a team slot
export interface TeamPokemonProperties {
  name: string;
  item: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  ability: string;
}

// The Advanced dialog's set details. Each is optional so a slot without them is unchanged:
// a missing level is 100, missing EVs are 0, and missing IVs are 31.
export interface TeamPokemonDetails {
  nickname?: string;
  level?: number;
  gender?: Gender;
  shiny?: boolean;
  teraType?: string;
  nature?: string;
  evs?: Partial<BaseStats>;
  ivs?: Partial<BaseStats>;
}

export interface TeamPokemon
  extends TeamPokemonProperties, TeamPokemonDetails {}

export type Team = TeamPokemon[];

export type ReadonlyTeam = readonly Readonly<TeamPokemon>[];

export type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// A team as saved in the browser, with the settings of its Name and Format dialog
export interface SavedTeam {
  id: string;
  name: string;
  generation: Generation;
  format: string;
  team: Team;
}

// The Filters dialog's global filters; the format and generation are the current team's
export type SearchFilterKey = "type" | "region" | "ability" | "moves";

export type SearchFilters = Record<SearchFilterKey, string>;

export interface PokemonFilters extends SearchFilters {
  generation: Generation;
  format: string;
}

export type SortKey = "name" | "num" | "format" | "bst" | StatKey;

export interface SortOrder {
  by: SortKey;
  descending: boolean;
}

export type TeamStatType = "typeDefence" | "typeCoverage";

export type TeamStatTitle = "Team Defence" | "Team Type Coverage";
