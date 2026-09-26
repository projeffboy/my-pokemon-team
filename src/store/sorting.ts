import pokedex from "@/data/pokedex";
import formats from "@/data/formats";
import { STAT_KEYS, type SortKey, type SortOrder } from "@/types";
import { baseStatTotal, STAT_FULL_NAMES } from "@/shared/set-details";

// The Sort dialog's options, in order
export const SORT_OPTIONS: readonly { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "num", label: "Pokedex number" },
  { key: "format", label: "Format" },
  { key: "bst", label: "Base stat total" },
  ...STAT_KEYS.map(key => ({ key, label: STAT_FULL_NAMES[key] })),
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

// Sorts pokemon IDs by the chosen key, with ties broken by name. Names sort
// case-insensitively, and formes stay grouped after their species.
export function sortPokemon(
  pokemon: readonly string[],
  { by, descending }: SortOrder,
): string[] {
  const byName = (a: string, b: string) =>
    (pokedex[a]?.name ?? a).localeCompare(pokedex[b]?.name ?? b, "en", {
      sensitivity: "base",
    });
  const direction = descending ? -1 : 1;
  return [...pokemon].sort(
    (a, b) =>
      direction * (sortValue(a, by) - sortValue(b, by)) ||
      (by === "name" ? direction : 1) * byName(a, b),
  );
}
