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
