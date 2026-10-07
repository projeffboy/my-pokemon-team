import pokedex from "@/data/pokedex";
import pastGenerations from "@/data/past-generations";
import { LATEST_GENERATION } from "./generations";
import { isPokemonType } from "@/types";

// E.g. 'bronzong' => ['Steel', 'Psychic'], or ['Normal'] for 'clefable' before gen 6
export const pokemonTypes = (pokemon: string, generation = LATEST_GENERATION) =>
  (
    pastGenerations[generation]?.pokemon[pokemon] ?? pokedex[pokemon]?.types
  )?.filter(isPokemonType) ?? [];

// E.g. 'bronzong' => ['Levitate', 'Heatproof', 'Heavy Metal']
export const pokemonAbilities = (
  pokemon: string,
  generation = LATEST_GENERATION,
) =>
  generation < 3 ?
    []
  : (pastGenerations[generation]?.abilities?.[pokemon] ??
    Object.values(pokedex[pokemon]?.abilities ?? {}));

export const pokemonBaseStats = (
  pokemon: string,
  generation = LATEST_GENERATION,
) =>
  pastGenerations[generation]?.baseStats?.[pokemon] ??
  pokedex[pokemon]?.baseStats;
