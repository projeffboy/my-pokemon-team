import pokedex from "@/data/pokedex";
import {
  POKEMON_TYPES,
  STAT_KEYS,
  type BaseStats,
  type Gender,
  type StatKey,
  type TeamPokemon,
  type TeamPokemonDetails,
} from "@/types";

export const DEFAULT_LEVEL = 100;
export const MAX_LEVEL = 100;
export const MAX_EV = 252;
export const MAX_EV_TOTAL = 510;
export const MAX_IV = 31;

// Showdown's stat abbreviations, as its team text writes them
export const STAT_NAMES: Record<StatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

export const TERA_TYPES: readonly string[] = [...POKEMON_TYPES, "Stellar"];

export const DETAIL_KEYS = [
  "nickname",
  "level",
  "gender",
  "shiny",
  "teraType",
  "nature",
  "evs",
  "ivs",
] as const satisfies readonly (keyof TeamPokemonDetails)[];

export const getEv = (evs: Partial<BaseStats> | undefined, stat: StatKey) =>
  evs?.[stat] ?? 0;

export const getIv = (ivs: Partial<BaseStats> | undefined, stat: StatKey) =>
  ivs?.[stat] ?? MAX_IV;

export const evTotal = (evs: Partial<BaseStats> | undefined) =>
  STAT_KEYS.reduce((sum, stat) => sum + getEv(evs, stat), 0);

// A species that is always one gender, or genderless, has no choice
export function genderOptions(pokemon: string): readonly Gender[] {
  const gender = pokedex[pokemon]?.gender;
  return gender ? [gender] : ["M", "F"];
}

// Does the slot hold anything the Advanced dialog can reset?
export const hasDetails = (member: Readonly<TeamPokemon>) =>
  DETAIL_KEYS.some(key => member[key] !== undefined);

export function clearDetails(member: TeamPokemon) {
  for (const key of DETAIL_KEYS) delete member[key];
}

export const baseStatTotal = (baseStats: BaseStats | undefined) =>
  baseStats ? STAT_KEYS.reduce((sum, stat) => sum + baseStats[stat], 0) : 0;

// Sets a detail, or removes it when it is back at its default
export function setDetail<K extends keyof TeamPokemonDetails>(
  member: TeamPokemon,
  key: K,
  value: TeamPokemonDetails[K] | "",
) {
  if (value === undefined || value === "" || value === false)
    delete member[key];
  else (member as Record<K, TeamPokemonDetails[K]>)[key] = value;
}

// Sets one EV or IV, keeping only the stats that differ from the default
export function setStat(
  member: TeamPokemon,
  kind: "evs" | "ivs",
  stat: StatKey,
  value: number,
) {
  const isDefault = kind === "evs" ? value === 0 : value === MAX_IV;
  const stats = { ...member[kind] };
  if (isDefault) delete stats[stat];
  else stats[stat] = value;
  setDetail(member, kind, Object.keys(stats).length ? stats : undefined);
}
