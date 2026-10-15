import pokedex from "@/data/pokedex";
import { pokemonNameInverse } from "@/shared/names";

// Input a pokemon ID to return the pokemon ID of its base forme
// E.g. 'giratinaorigin' => 'giratina'
// (it will return undefined for pokemon already at the base forme)
// E.g. 'wartortle' => undefined
export function baseForme(pokemon: string) {
  const baseFormeName = pokedex[pokemon]?.baseSpecies;

  return baseFormeName ? pokemonNameInverse(baseFormeName) : undefined;
}

// Get previous evolution
// E.g. 'mrrime' => 'mrmimegalar'
export function previousEvolution(pokemon: string) {
  const prevo = pokedex[pokemon]?.prevo;

  return prevo ? pokemonNameInverse(prevo) : undefined;
}

// Showdown numbers CAP (fan-made) pokemon from -1 down, and Pokestar pokemon from -5000 down
export function isCapPokemon(pokemon: string) {
  const num = pokedex[pokemon]?.num ?? 0;
  return num < 0 && num > -5000;
}
