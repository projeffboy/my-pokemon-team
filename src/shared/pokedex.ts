import pokedex from "@/data/pokedex";
import pastGenerations from "@/data/past-generations";
import gameVariants from "@/data/game-variants";
import { LATEST_GENERATION } from "./generations";
import { isPokemonType, type Generation } from "@/types";
import {
  COMBINED_GENERATIONS_FORMAT,
  COMBINED_GENERATIONS_MASK,
} from "./generation-profile";
import { generationTransferData } from "./generation-transfer-data";

// E.g. 'bronzong' => ['Steel', 'Psychic'], or ['Normal'] for 'clefable' before gen 6
export const pokemonTypes = (pokemon: string, generation = LATEST_GENERATION) =>
  (
    pastGenerations[generation]?.pokemon[pokemon] ?? pokedex[pokemon]?.types
  )?.filter(isPokemonType) ?? [];

// E.g. 'bronzong' => ['Levitate', 'Heatproof', 'Heavy Metal']
export const pokemonAbilities = (
  pokemon: string,
  generation = LATEST_GENERATION,
  format = "",
) => {
  if (format === COMBINED_GENERATIONS_FORMAT) {
    const available = Object.entries(
      generationTransferData()?.pokemon[pokemon]?.abilities ?? {},
    )
      .filter(([, mask]) => !!(mask & COMBINED_GENERATIONS_MASK))
      .map(([ability]) => ability);
    const abilities = available.filter(ability => ability !== "No Ability");
    return abilities.length ? abilities : available;
  }
  return generation < 3 ?
      []
    : (pastGenerations[generation]?.abilities?.[pokemon] ??
        Object.values(pokedex[pokemon]?.abilities ?? {}));
};

// E.g. 'chandelure' => 'Shadow Tag' in gen 5, which old links may still hold
export const unreleasedHiddenAbility = (
  pokemon: string,
  generation: Generation,
) => pastGenerations[generation]?.unreleasedHidden?.[pokemon];

export function hasNoAbility(
  pokemon: string,
  generation = LATEST_GENERATION,
  format = "",
): boolean {
  const abilities = pokemonAbilities(pokemon, generation, format);
  return (
    abilities.length > 0 && abilities.every(ability => ability === "No Ability")
  );
}

export function isHiddenAbility(
  pokemon: string,
  ability: string,
  generation = LATEST_GENERATION,
  format = "",
): boolean {
  if (format === COMBINED_GENERATIONS_FORMAT)
    return (
      pokemonAbilities(pokemon, generation, format).includes(ability) &&
      ([6, 7, 8, 9] as const).some(gen =>
        isHiddenAbility(pokemon, ability, gen),
      )
    );
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
  format = "",
) =>
  gameVariants[format]?.baseStats?.[pokemon] ??
  pastGenerations[generation]?.baseStats?.[pokemon] ??
  pokedex[pokemon]?.baseStats;
