import pokedex from "@/data/pokedex";
import items from "@/data/items";
import moves from "@/data/moves";

function idsByName(data: Record<string, { name?: string }>) {
  const ids = new Map<string, string>();

  for (const [id, { name }] of Object.entries(data)) {
    if (name !== undefined && !ids.has(name)) ids.set(name, id);
  }

  return ids;
}

const pokemonIds = idsByName(pokedex);
const itemIds = idsByName(items);
const moveIds = idsByName(moves);

// E.g. 'Squirtle' => 'squirtle'
export const pokemonNameInverse = (name: string) => pokemonIds.get(name);

// E.g. 'Leftovers' => 'leftovers'
export const itemNameInverse = (name: string) => itemIds.get(name);

// E.g. 'Hydro Pump' => 'hydropump'
export const moveNameInverse = (name: string) => moveIds.get(name);

// E.g. 'squirtle' => 'Squirtle'
export const pokemonName = (pokemon: string) => pokedex[pokemon]?.name;

// E.g. 'leftovers' => 'Leftovers'
export const itemName = (item: string) => items[item]?.name ?? "";

// E.g. 'hydropump' => 'Hydro Pump'
export const moveName = (move: string) => moves[move]?.name;

// Every item, as the item input's options
export const allItemIds = Object.keys(items);
export const allItemNames = allItemIds.map(id => items[id]?.name ?? id);
