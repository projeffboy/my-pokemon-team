import pokedex from "@/data/pokedex";
import items from "@/data/items";
import type { Team, TeamPokemonProperties } from "@/types";
import { idsByName } from "./ids-by-name";

const itemIds = idsByName(items);

// E.g. 'Leftovers' => 'leftovers'
export function itemNameInverse(itemName: string) {
  return itemIds.get(itemName);
}

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

  return (itemName && itemNameInverse(itemName)) || pokemonItem;
}
