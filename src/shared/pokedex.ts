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

export function isHiddenAbility(
  pokemon: string,
  ability: string,
  generation = LATEST_GENERATION,
) {
  if (generation < 5 || !ability) return false;
  const current = pokedex[pokemon]?.abilities;
  const hidden = current?.H;
  if (!hidden) return false;
  const available = pokemonAbilities(pokemon, generation);
  if (!available.includes(ability)) return false;
  if (available.includes(hidden)) return ability === hidden;
  // Historical lists keep hidden abilities after ordinary ones, even when renamed.
  return (
    ability === available.at(-1) &&
    !Object.entries(current).some(
      ([slot, name]) => slot !== "H" && name === ability,
    )
  );
}

export const pokemonBaseStats = (
  pokemon: string,
  generation = LATEST_GENERATION,
) =>
  pastGenerations[generation]?.baseStats?.[pokemon] ??
  pokedex[pokemon]?.baseStats;
