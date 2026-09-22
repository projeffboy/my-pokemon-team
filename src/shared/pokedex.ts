import pokedex from "@/data/pokedex";
import { isPokemonType } from "@/types";

// E.g. 'bronzong' => ['Steel', 'Psychic']
export const pokemonTypes = (pokemon: string) =>
  pokedex[pokemon]?.types?.filter(isPokemonType) ?? [];

// E.g. 'bronzong' => ['Levitate', 'Heatproof', 'Heavy Metal']
export const pokemonAbilities = (pokemon: string) =>
  Object.values(pokedex[pokemon]?.abilities ?? {});
