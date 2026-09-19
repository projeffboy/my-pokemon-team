import pokedex from "@/data/pokedex";
import { idsByName } from "@/shared/ids-by-name";

const pokemonIds = idsByName(pokedex);

// The inverse of the pokemonName function
// E.g. 'Squirtle' => 'squirtle'
export function pokemonNameInverse(pokemonName: string) {
  return pokemonIds.get(pokemonName);
}

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
