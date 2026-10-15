import { pokemonBaseStats } from "@/shared/pokedex";
import pokedex from "@/data/pokedex";
import {
  STAT_KEYS,
  type Generation,
  type MoveSortOrder,
  type SortKey,
  type SortOrder,
} from "@/types";
import { baseStatTotal } from "@/shared/set-details";
import { moveTypeIn, pokemonFormatIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { TIER_BY_FORMAT } from "@/shared/formats";
import { pokemonNameInverse } from "@/shared/names";
import { english, type Translation } from "@/i18n/translation";
import { isCapPokemon } from "./shared/pokemon";

// The Sort dialog's options, in order; their labels are in src/i18n
export const SORT_KEYS: readonly SortKey[] = [
  "num",
  "name",
  "format",
  "bst",
  ...STAT_KEYS,
];

export const DEFAULT_SORT: SortOrder = { by: "num", descending: false };
export const DEFAULT_MOVE_SORT: MoveSortOrder = {
  by: "name",
  descending: false,
};

export function sortMoves(
  moves: readonly string[],
  { by, descending }: MoveSortOrder = DEFAULT_MOVE_SORT,
  generation: Generation = LATEST_GENERATION,
  { locale, names }: Translation = english,
  format = "",
): string[] {
  const { compare } = new Intl.Collator(locale, { sensitivity: "base" });
  const direction = descending ? -1 : 1;
  const typeName = (move: string) => {
    const type = moveTypeIn(move, generation, format);
    return type ? names.type(type) : "";
  };
  return [...moves].sort(
    (a, b) =>
      (by === "type" ? direction * compare(typeName(a), typeName(b)) : 0) ||
      (by === "name" ? direction : 1) * compare(names.move(a), names.move(b)),
  );
}

// As Showdown's teambuilder orders them: the CAP tiers, which only the CAP format
// lists, then Smogon's singles tiers from the most to the least restricted, then unranked
const TIER_RANK = [
  "CAP",
  "CAP NFE",
  "CAP LC",
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

// Smogon's doubles tiers, used instead in the doubles formats
const DOUBLES_TIER_RANK = [
  "DUber",
  "(DUber)",
  "DOU",
  "(DOU)",
  "DUU",
  "(DUU)",
  "NFE",
  "LC",
];

const tierRank = (pokemon: string, generation: Generation, format: string) => {
  const doubles = DOUBLES_TIER_RANK.includes(TIER_BY_FORMAT[format] ?? "");
  const ranks = doubles ? DOUBLES_TIER_RANK : TIER_RANK;
  const tiers = pokemonFormatIn(pokemon, generation);
  const tier = (doubles ? tiers?.doublesTier : tiers?.tier) ?? "";
  const rank = ranks.indexOf(tier === "(OU)" ? "OU" : tier);
  return rank === -1 ? ranks.length : rank;
};

function sortValue(
  pokemon: string,
  by: SortKey,
  generation: Generation,
  format: string,
): number {
  const entry = pokedex[pokemon];
  switch (by) {
    case "name":
      return 0;
    // CAP pokemon count down from -1, so they sort in the order they were made
    case "num":
      return Math.abs(entry?.num ?? 0);
    case "format":
      return tierRank(pokemon, generation, format);
    case "bst": {
      const stats = pokemonBaseStats(pokemon, generation, format);
      return baseStatTotal(stats) - (generation === 1 ? (stats?.spd ?? 0) : 0);
    }
    default:
      return (
        pokemonBaseStats(pokemon, generation, format)?.[
          generation === 1 && by === "spd" ? "spa" : by
        ] ?? 0
      );
  }
}

// MissingNo. and the Pokestar pokemon have no real number, tier, or stats,
// so every sort but name lists them last. CAP pokemon lack only a real number.
const isOddball = (pokemon: string, by: SortKey) =>
  by !== "name" &&
  (pokedex[pokemon]?.num ?? 0) <= 0 &&
  (by === "num" || !isCapPokemon(pokemon));

// Sorts pokemon IDs by the chosen key, with ties broken by name. Names sort
// case-insensitively in the current language, and formes stay grouped after
// their species, since a translated forme may not start with its species.
export function sortPokemon(
  pokemon: readonly string[],
  { by, descending }: SortOrder,
  { locale, names }: Translation = english,
  generation: Generation = LATEST_GENERATION,
  format = "",
): string[] {
  const species = (id: string) => {
    const base = pokedex[id]?.baseSpecies;
    return names.pokemon((base && pokemonNameInverse(base)) || id);
  };
  const { compare } = new Intl.Collator(locale, { sensitivity: "base" });
  const byName = (a: string, b: string) =>
    compare(species(a), species(b)) ||
    compare(pokedex[a]?.name ?? a, pokedex[b]?.name ?? b);
  const direction = descending ? -1 : 1;
  return [...pokemon].sort(
    (a, b) =>
      Number(isOddball(a, by)) - Number(isOddball(b, by)) ||
      direction *
        (sortValue(a, by, generation, format) -
          sortValue(b, by, generation, format)) ||
      (by === "name" ? direction : 1) * byName(a, b),
  );
}
