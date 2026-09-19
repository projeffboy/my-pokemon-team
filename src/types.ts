export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface PokedexEntry {
  num?: number;
  types?: (PokemonType | "Bird")[];
  name?: string;
  baseSpecies?: string;
  otherFormes?: string[];
  prevo?: string;
  forme?: string;
  abilities?: Record<string, string>;
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

export type Formats = Record<string, Record<string, string>>;

type TypeChartStatus =
  | "prankster" | "par" | "brn" | "trapped" | "powder"
  | "sandstorm" | "hail" | "psn" | "tox" | "frz";

export type TypeChart = Record<
  PokemonType,
  Record<PokemonType, number> & Partial<Record<TypeChartStatus, number>>
>;

export type Items = Record<string, { name?: string; spritenum?: number }>;

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
  "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
  "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water",
];

export function isPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.some(type => type === value);
}

export type OldMoves = Record<string, { name?: string; isViable?: boolean }>;

export interface TeamPokemonProperties {
  name: string;
  item: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  ability: string;
}

export type Team = TeamPokemonProperties[];

export type ReadonlyTeam = readonly Readonly<TeamPokemonProperties>[];

export type SearchFilterKey = "format" | "region" | "type" | "moves";

export type SearchFilters = Record<SearchFilterKey, string>;

export type TeamStatType = "typeDefence" | "typeCoverage";

export type TeamStatTitle = "Team Defence" | "Team Type Coverage";
