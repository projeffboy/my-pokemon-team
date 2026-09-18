import type { Pokedex } from "@/types";
import pokedexData from "@/data/pokedex";

const pokedex: Pokedex = pokedexData;

// The inverse of the pokemonName function
// E.g. 'Squirtle' => 'squirtle'
export function pokemonNameInverse(pokemonName: string) {
  for (const pokemon in pokedex) {
    if (pokedex[pokemon]?.name === pokemonName) {
      return pokemon;
    }
  }
}

// Input a pokemon ID to return the pokemon ID of its base forme
// E.g. 'giratinaorigin' => 'giratina'
// (it will return undefined for pokemon already at the base forme)
// E.g. 'wartortle' => undefined
export function baseForme(pokemon: string) {
  const baseFormeName = pokedex[pokemon]?.baseSpecies;
  const baseForme =
    baseFormeName ? pokemonNameInverse(baseFormeName) : undefined;

  return baseForme;
}

// Get previous evolution
export function previousEvolution(pokemon: string) {
  const prevo = pokedex[pokemon]?.prevo;
  return prevo ?
      prevo.toLowerCase().replace("-", "").replace(":", "").replace(" ", "")
    : undefined;
}
