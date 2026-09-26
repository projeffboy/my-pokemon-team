import pokedex from "@/data/pokedex";
import items from "@/data/items";
import moves from "@/data/moves";
import natures from "@/data/natures";
import type { NameTranslations } from "@/types";

// The display names of the data in one language. Each takes what the store holds: the
// Showdown ID of a pokemon, move, item, or nature, or the English name of an ability, type,
// or region, and gives back that ID or name when it has no translation.
export interface Names {
  pokemon: (id: string) => string;
  move: (id: string) => string;
  item: (id: string) => string;
  ability: (ability: string) => string;
  nature: (id: string) => string;
  type: (type: string) => string;
  region: (region: string) => string;
}

export const englishNames: Names = {
  pokemon: id => pokedex[id]?.name ?? id,
  move: id => moves[id]?.name ?? id,
  item: id => items[id]?.name ?? id,
  ability: ability => ability,
  nature: id => natures[id]?.name ?? id,
  type: type => type,
  region: region => region,
};

// English fills in whatever PokeAPI has not translated yet, such as a brand new item
export const localizedNames = (translations: NameTranslations): Names => ({
  pokemon: id => translations.pokemon[id] ?? englishNames.pokemon(id),
  move: id => translations.moves[id] ?? englishNames.move(id),
  item: id => translations.items[id] ?? englishNames.item(id),
  ability: ability =>
    translations.abilities[ability] ?? englishNames.ability(ability),
  nature: id => translations.natures[id] ?? englishNames.nature(id),
  type: type => translations.types[type] ?? englishNames.type(type),
  region: region => translations.regions[region] ?? englishNames.region(region),
});
