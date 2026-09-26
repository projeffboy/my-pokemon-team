import pokedex from "@/data/pokedex";
import formats from "@/data/formats";
import { STAT_KEYS, type SortKey, type SortOrder } from "@/types";
import { baseStatTotal } from "@/shared/set-details";
import { pokemonNameInverse } from "@/shared/names";
import { english, type Translation } from "@/i18n/translation";

// The Sort dialog's options, in order; their labels are in src/i18n
export const SORT_KEYS: readonly SortKey[] = [
  "name",
  "num",
  "format",
  "bst",
  ...STAT_KEYS,
];

export const DEFAULT_SORT: SortOrder = { by: "name", descending: false };

// Smogon's singles tiers from the most to the least restricted, then unranked
const TIER_RANK = [
  "AG",
  "Uber",
  "OU",
  "UUBL",
  "UU",
  "RUBL",
  "RU",
  "NUBL",
  "NU",
  "PUBL",
  "PU",
  "ZUBL",
  "ZU",
  "(PU)",
  "NFE",
  "LC Uber",
  "LC",
];

const tierRank = (pokemon: string) => {
  const rank = TIER_RANK.indexOf(formats[pokemon]?.tier ?? "");
  return rank === -1 ? TIER_RANK.length : rank;
};

function sortValue(pokemon: string, by: SortKey): number {
  const entry = pokedex[pokemon];
  switch (by) {
    case "name":
      return 0;
    case "num":
      return entry?.num ?? 0;
    case "format":
      return tierRank(pokemon);
    case "bst":
      return baseStatTotal(entry?.baseStats);
    default:
      return entry?.baseStats?.[by] ?? 0;
  }
}

// MissingNo. and the Pokestar pokemon have no real number, tier, or stats,
// so every sort but name lists them last
const isOddball = (pokemon: string) => (pokedex[pokemon]?.num ?? 0) <= 0;

// Sorts pokemon IDs by the chosen key, with ties broken by name. Names sort
// case-insensitively in the current language, and formes stay grouped after
// their species, since a translated forme may not start with its species.
export function sortPokemon(
  pokemon: readonly string[],
  { by, descending }: SortOrder,
  { locale, names }: Translation = english,
): string[] {
  const species = (id: string) => {
    const base = pokedex[id]?.baseSpecies;
    return names.pokemon((base && pokemonNameInverse(base)) || id);
  };
  const compare = (a: string, b: string) =>
    a.localeCompare(b, locale, { sensitivity: "base" });
  const byName = (a: string, b: string) =>
    compare(species(a), species(b)) ||
    compare(pokedex[a]?.name ?? a, pokedex[b]?.name ?? b);
  const direction = descending ? -1 : 1;
  return [...pokemon].sort(
    (a, b) =>
      (by === "name" ? 0 : Number(isOddball(a)) - Number(isOddball(b))) ||
      direction * (sortValue(a, by) - sortValue(b, by)) ||
      (by === "name" ? direction : 1) * byName(a, b),
  );
}
