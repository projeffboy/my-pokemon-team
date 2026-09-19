import pokedexData from "@/data/pokedex";
import type { Pokedex, Team, TeamPokemonProperties } from "@/types";

const pokedex: Pokedex = pokedexData;

const toId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function createEmptyTeam(): Team {
  return Array.from({ length: 6 }, (): TeamPokemonProperties => ({
    name: "",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
  }));
}

// E.g. Blastoisinite for Blastoise-Mega, or Zap Plate (listed before Electrium Z) for Arceus-Electric
export function getAutoSelectedItem(pokemon: string, pokemonItem: string): string {
  const { requiredItem, requiredItems } = pokedex[pokemon] ?? {};
  const itemName = requiredItem ?? requiredItems?.[0];

  return itemName ? toId(itemName) : pokemonItem;
}
