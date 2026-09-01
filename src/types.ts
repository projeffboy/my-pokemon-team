export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface PokedexEntry {
  num?: number;
  types?: string[];
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
}

export type Pokedex = Record<string, PokedexEntry>;

export interface MoveEntry {
  type?: string;
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

export type TypeChart = Record<string, Record<string, number>>;

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

export type PokemonProperties =
  | "name"
  | "item"
  | "ability"
  | "move1"
  | "move2"
  | "move3"
  | "move4";

export type OldMoves = Record<string, { isViable?: boolean }>;

export interface TeamPokemonProperties extends Record<string, string> {
  name: string;
  item: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  ability: string;
}

export type Team = TeamPokemonProperties[];

export type SearchFilterKey = "format" | "region" | "type" | "moves";
