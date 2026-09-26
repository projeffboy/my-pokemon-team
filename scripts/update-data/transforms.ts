// Pure transforms from Showdown's data to src/data, kept apart from the I/O so they can be tested
import {
  POKEMON_TYPES,
  type Formats,
  type Items,
  type Learnsets,
  type MoveEntry,
  type Moves,
  type Natures,
  type Pokedex,
  type PokedexEntry,
  type TypeChart,
} from "../../src/types.ts";

// Showdown's data is untyped when it arrives here, so values are trusted and only keys are checked
export type ShowdownEntry = Record<string, unknown>;
export type ShowdownTable = Record<string, ShowdownEntry>;

export type DataTypes = {
  Pokedex: Pokedex;
  Moves: Moves;
  Items: Items;
  Formats: Formats;
  Learnsets: Learnsets;
  TypeChart: TypeChart;
  Natures: Natures;
};

export const toId = (text: unknown) =>
  `${text ?? ""}`.toLowerCase().replace(/[^a-z0-9]/g, "");

const isRecord = (value: unknown): value is ShowdownEntry =>
  typeof value === "object" && value !== null;

// `onePerLine` keeps each entry on its own line so data updates produce readable diffs
export function renderTypedData<N extends keyof DataTypes>(
  typeName: N,
  data: DataTypes[N],
  onePerLine = false,
) {
  const json =
    onePerLine ?
      `{\n${Object.entries(data)
        .map(
          ([id, entry]) => `  ${JSON.stringify(id)}: ${JSON.stringify(entry)},`,
        )
        .join("\n")}\n}`
    : JSON.stringify(data, null, 2);

  return [
    `import type { ${typeName} } from "../types";`,
    "",
    `const data: ${typeName} = ${json};`,
    "",
    "export default data;",
    "",
  ].join("\n");
}

// Keep only the fields the app reads, so the rest of Showdown's data stays out of the bundle.
// Callbacks become `true` since the app only checks whether they exist.
export function pick<T extends object>(
  entry: ShowdownEntry,
  keys: (keyof T & string)[],
): Partial<T> {
  return Object.fromEntries(
    keys
      .filter(key => entry[key] !== undefined)
      .map(key => [key, typeof entry[key] === "function" ? true : entry[key]]),
  ) as Partial<T>;
}

export const projections = {
  Pokedex: (entry: ShowdownEntry, pokedex: ShowdownTable): PokedexEntry => {
    if (entry.isCosmeticForme) {
      entry = {
        ...pokedex[toId(entry.baseSpecies)],
        ...entry,
        otherFormes: undefined,
      };
    }
    return pick<PokedexEntry>(entry, [
      "num",
      "name",
      "types",
      "baseSpecies",
      "forme",
      "otherFormes",
      "prevo",
      "abilities",
      "baseStats",
      "gender",
      "gen",
      "requiredItem",
      "requiredItems",
    ]);
  },
  Moves: (entry: ShowdownEntry): MoveEntry => ({
    ...pick<MoveEntry>(entry, [
      "name",
      "type",
      "category",
      "basePower",
      "multihit",
      "basePowerCallback",
      "onModifyMove",
      "status",
      "boosts",
    ]),
    ...(isRecord(entry.secondary) && {
      secondary: pick<NonNullable<MoveEntry["secondary"]>>(entry.secondary, [
        "chance",
        "status",
      ]),
    }),
    ...(isRecord(entry.flags) &&
      !!entry.flags.sound && { flags: { sound: 1 } }),
  }),
  Items: (entry: ShowdownEntry): Items[string] =>
    pick<Items[string]>(entry, ["name", "spritenum"]),
  Formats: (entry: ShowdownEntry): Formats[string] =>
    pick<Formats[string]>(entry, ["tier", "doublesTier"]),
  Natures: (entry: ShowdownEntry): Natures[string] =>
    pick<Natures[string]>(entry, ["name", "plus", "minus"]),
};

export function projectTable<
  N extends "Pokedex" | "Moves" | "Items" | "Natures",
>(typeName: N, table: ShowdownTable): DataTypes[N] {
  return Object.fromEntries(
    Object.entries(table).map(([id, entry]) => [
      id,
      projections[typeName](entry, table),
    ]),
  );
}

// Showdown's `champions` mod tracks the current Pokemon Champions regulation. A forme without
// its own entry there is as legal as the forme or species it comes from.
export function projectFormats(
  pokedex: ShowdownTable,
  formatsData: ShowdownTable,
  championsFormatsData: ShowdownTable,
): Formats {
  const championsData = { ...formatsData, ...championsFormatsData };
  const isChampionsLegal = (id: string): boolean => {
    const entry = championsData[id];
    if (entry?.isNonstandard) return false;
    if (entry?.tier) return entry.tier !== "Illegal";

    const { battleOnly, baseSpecies } = pokedex[id] ?? {};
    const parent = toId([battleOnly, baseSpecies].flat().find(Boolean));
    return !!parent && parent !== id && isChampionsLegal(parent);
  };
  const ids = new Set([...Object.keys(formatsData), ...Object.keys(pokedex)]);
  return Object.fromEntries(
    [...ids]
      .map((id): [string, Formats[string]] => [
        id,
        {
          ...projections.Formats(formatsData[id] ?? {}),
          ...(isChampionsLegal(id) && { champions: true as const }),
        },
      ])
      .filter(([, entry]) => Object.keys(entry).length),
  );
}

const learnsetMoves = (entry: ShowdownEntry) =>
  Object.keys(isRecord(entry.learnset) ? entry.learnset : {});

// Every move from every game, as a sorted list per species
export function flattenLearnsets(
  learnsets: ShowdownTable,
  modLearnsets: ShowdownTable[],
): Learnsets {
  const flattened: Learnsets = Object.fromEntries(
    Object.entries(learnsets).map(([species, entry]) => [
      species,
      learnsetMoves(entry),
    ]),
  );
  for (const modLearnset of modLearnsets) {
    for (const [species, entry] of Object.entries(modLearnset)) {
      flattened[species] = [
        ...new Set([...(flattened[species] ?? []), ...learnsetMoves(entry)]),
      ].sort();
    }
  }
  return flattened;
}

// The Showdown client's BattleMoveSearch, which judges a move for one set
export interface MoveSearch {
  moveIsNotUseless(
    move: string,
    species: ShowdownEntry,
    moves: string[],
    set: { ability: unknown; item: unknown; moves: string[] },
  ): boolean;
}

// A move is viable if any pokemon that learns it, with any of its abilities and required
// items, finds it useful in any of the searches
export function collectViableMoves(
  pokedex: ShowdownTable,
  learnsets: Learnsets,
  hiddenPowers: string[],
  searches: MoveSearch[],
) {
  const viable = new Set<string>();
  for (const [id, entry] of Object.entries(pokedex)) {
    // Formes also learn their base species' moves
    const learnset = [
      ...(learnsets[id] ?? []),
      ...(learnsets[toId(entry.baseSpecies)] ?? []),
    ];
    const species = { baseSpecies: entry.name, ...entry, id };
    // A forme always holds its required item, e.g. Techno Blast needs Genesect-Douse's Drive
    const items = [
      "",
      entry.requiredItem,
      ...(Array.isArray(entry.requiredItems) ? entry.requiredItems : []),
    ].filter(item => item !== undefined);
    // Cosmetic formes list no abilities; their base species covers them
    const sets = Object.values(
      isRecord(entry.abilities) ? entry.abilities : {},
    ).flatMap(ability => items.map(item => ({ ability, item, moves: [] })));
    for (const set of sets) {
      for (const move of [
        ...learnset,
        ...(learnset.includes("hiddenpower") ? hiddenPowers : []),
      ]) {
        if (
          searches.some(search =>
            search.moveIsNotUseless(move, species, [], set),
          )
        ) {
          viable.add(move);
        }
      }
    }
  }
  return [...viable].sort();
}

// Showdown codes damage taken as 0 neutral, 1 weak, 2 resisted, 3 immune;
// the app scores those as 0, -1, 1, 2
const damageCode: Record<string, number> = { 0: 0, 1: -1, 2: 1, 3: 2 };

export function projectTypeChart(typeChart: ShowdownTable): TypeChart {
  return Object.fromEntries(
    POKEMON_TYPES.map(type => {
      const entry = typeChart[type.toLowerCase()];
      if (!entry) throw new Error(`Showdown's type chart has no ${type}`);
      const { damageTaken } = entry;
      return [
        type,
        Object.fromEntries(
          Object.entries(isRecord(damageTaken) ? damageTaken : {})
            .filter(([attackType]) => attackType !== "Stellar")
            .map(([attackType, code]) => [attackType, damageCode[`${code}`]]),
        ),
      ];
    }),
  ) as TypeChart;
}

export type NamedDatasets = Record<string, Record<string, { name?: string }>>;

// Share links hold display names, so a name that disappears empties that slot in old links.
// Showdown's aliases say what a removed ID is called now.
export function nameChanges(
  before: NamedDatasets,
  after: NamedDatasets,
  aliases: Record<string, unknown>,
) {
  return Object.entries(before).flatMap(([dataset, oldEntries]) => {
    const newEntries = after[dataset] ?? {};
    const newNames = new Set(Object.values(newEntries).map(e => e.name));
    return Object.entries(oldEntries)
      .filter(([, { name }]) => !newNames.has(name))
      .map(([id, { name }]) => {
        const newName = newEntries[id]?.name ?? aliases[id];
        const isRenamed = typeof newName === "string" && newNames.has(newName);
        return `  ${dataset}: ${name} ${isRenamed ? `is now ${newName}` : "was removed"}`;
      });
  });
}
