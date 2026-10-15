// Pure transforms from Showdown's data to src/data, kept apart from the I/O so they can be tested
import {
  POKEMON_TYPES,
  type Formats,
  type GenerationTransferData,
  type Generation,
  type GameData,
  type GameVariantData,
  type BaseStats,
  type HiddenPowerSpreads,
  type Items,
  type Learnsets,
  type MoveEntry,
  type Moves,
  type Natures,
  type PastGeneration,
  type PastGenerations,
  type PastTypeChart,
  type Pokedex,
  type PokedexEntry,
  type PokemonType,
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
  PastGenerations: PastGenerations;
  GameVariantData: GameVariantData;
  HiddenPowerSpreads: HiddenPowerSpreads;
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
      .filter(key => entry[key] !== undefined && entry[key] !== null)
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
    const forme = String(entry.forme ?? "");
    const battleOnly =
      entry.battleOnly ??
      (forme.includes("Mega") || forme === "Primal" ?
        entry.baseSpecies
      : undefined);
    const changesFrom =
      entry.changesFrom ??
      (Array.isArray(battleOnly) ? battleOnly[0] : battleOnly);
    if (typeof changesFrom === "string") entry = { ...entry, changesFrom };
    return pick<PokedexEntry>(entry, [
      "num",
      "name",
      "types",
      "baseSpecies",
      "changesFrom",
      "forme",
      "otherFormes",
      "prevo",
      "abilities",
      "baseStats",
      "gender",
      "genderRatio",
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
      "target",
      "forceSwitch",
    ]),
    ...(isRecord(entry.self) &&
      isRecord(entry.self.boosts) && {
        selfBoosts: entry.self.boosts as Record<string, number>,
      }),
    ...(isRecord(entry.selfBoost) &&
      isRecord(entry.selfBoost.boosts) && {
        selfBoosts: entry.selfBoost.boosts as Record<string, number>,
      }),
    ...(isRecord(entry.secondary) &&
      entry.secondary.chance === 100 &&
      isRecord(entry.secondary.self) &&
      isRecord(entry.secondary.self.boosts) && {
        selfBoosts: entry.secondary.self.boosts as Record<string, number>,
      }),
    ...(isRecord(entry.secondary) && {
      secondary: pick<NonNullable<MoveEntry["secondary"]>>(entry.secondary, [
        "chance",
        "status",
      ]),
    }),
    ...(isRecord(entry.flags) &&
      !!entry.flags.sound && { flags: { sound: 1 } }),
  }),
  Items: (entry: ShowdownEntry): Items[string] => {
    const defaults =
      entry.onMemory ? 50
      : entry.megaStone ? 80
      : entry.onDrive ? 70
      : entry.onPlate ? 90
      : entry.isBerry ? 10
      : undefined;
    return {
      ...pick<Items[string]>(entry, [
        "name",
        "spritenum",
        "onPlate",
        "onDrive",
        "onMemory",
        "naturalGift",
        "ignoreKlutz",
        "megaStone",
        "zMove",
      ]),
      ...(defaults !== undefined ? { fling: { basePower: defaults } }
      : isRecord(entry.fling) ?
        {
          fling: pick<NonNullable<Items[string]["fling"]>>(entry.fling, [
            "basePower",
            "status",
          ]) as NonNullable<Items[string]["fling"]>,
        }
      : {}),
    };
  },
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

export function historicalViableInputs(
  generation: Generation,
  pokedex: ShowdownTable,
  learnsets: Learnsets,
  availability: GenerationTransferData,
  past: PastGeneration | undefined,
) {
  const bit = 1 << (generation - 1);
  const species = Object.fromEntries(
    Object.entries(pokedex).flatMap(([id, entry]) => {
      if (!((availability.pokemon[id]?.generations ?? 0) & bit)) return [];
      const abilities = generation < 3 ? [""] : past?.abilities?.[id];
      return [
        [
          id,
          {
            ...pokedex[toId(entry.baseSpecies)],
            ...entry,
            ...(past?.pokemon[id] && { types: past.pokemon[id] }),
            ...(past?.baseStats?.[id] && { baseStats: past.baseStats[id] }),
            ...(abilities && {
              abilities: Object.fromEntries(
                abilities.map((ability, i) => [i, ability]),
              ),
            }),
          },
        ],
      ];
    }),
  );
  const learnableMoves = new Set(Object.values(learnsets).flat());
  const historicalLearnsets = Object.fromEntries(
    Object.entries(learnsets).map(([id, moves]) => [
      id,
      (moves.includes("sketch") ?
        Object.keys(availability.pokemon[id]?.moves ?? {}).filter(move =>
          learnableMoves.has(move),
        )
      : moves
      ).filter(move => !!((availability.pokemon[id]?.moves[move] ?? 0) & bit)),
    ]),
  );
  return { pokedex: species, learnsets: historicalLearnsets };
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

export function projectHiddenPowerSpreads(
  typeChart: ShowdownTable,
): HiddenPowerSpreads {
  return Object.fromEntries(
    Object.entries(typeChart)
      .filter(([, entry]) => isRecord(entry.HPivs))
      .map(([type, entry]) => [
        type,
        {
          ivs: entry.HPivs,
          dvs: isRecord(entry.HPdvs) ? entry.HPdvs : {},
        },
      ]),
  ) as HiddenPowerSpreads;
}

// Showdown's mods each inherit from the next generation's data: a mod's entry replaces
// its parent's, merges into it with `inherit: true`, or deletes it when null
export function resolveMod(
  parent: ShowdownTable,
  mod: Record<string, ShowdownEntry | null> = {},
): ShowdownTable {
  const resolved = { ...parent };
  for (const [id, entry] of Object.entries(mod)) {
    if (entry === null) {
      delete resolved[id];
    } else if (entry.inherit) {
      const { inherit: _inherit, ...changes } = entry;
      resolved[id] = { ...parent[id], ...changes };
    } else {
      resolved[id] = entry;
    }
  }
  return resolved;
}

export type GenerationData = {
  pokedex: ShowdownTable;
  moves: ShowdownTable;
  typechart: ShowdownTable;
  abilities?: ShowdownTable;
  formats?: ShowdownTable;
};
export type ModData = Partial<
  Record<keyof GenerationData, Record<string, ShowdownEntry | null>>
>;

export function projectGameVariant(
  base: GenerationData,
  mod: ModData,
): GameData {
  const moves = Object.fromEntries(
    Object.entries(resolveMod(base.moves, mod.moves)).flatMap(([id, entry]) => {
      const properties = projections.Moves(entry);
      return (
          JSON.stringify(properties) ===
            JSON.stringify(projections.Moves(base.moves[id] ?? {}))
        ) ?
          []
        : [[id, properties]];
    }),
  );
  const baseStats = changedField<BaseStats>(
    base.pokedex,
    resolveMod(base.pokedex, mod.pokedex),
    "baseStats",
  );
  return {
    ...(Object.keys(moves).length && { moves }),
    ...(Object.keys(baseStats).length && { baseStats }),
  };
}

// A generation's types are the chart's entries that are not marked as future
const typesOf = (typechart: ShowdownTable) =>
  POKEMON_TYPES.filter(type => {
    const entry = typechart[type.toLowerCase()];
    return entry && !entry.isNonstandard;
  });

// The chart over the generation's own types, without the status conditions
const pastTypeChart = (typechart: ShowdownTable, types: PokemonType[]) =>
  Object.fromEntries(
    types.map(type => {
      const { damageTaken } = typechart[type.toLowerCase()] ?? {};
      const codes = isRecord(damageTaken) ? damageTaken : {};
      return [
        type,
        Object.fromEntries(
          types.map(attackType => [
            attackType,
            damageCode[`${codes[attackType] ?? 0}`],
          ]),
        ),
      ];
    }),
  ) as PastTypeChart;

// The entries whose field differs from the latest generation's
const changedField = <T>(
  latest: ShowdownTable,
  resolved: ShowdownTable,
  field: string,
) =>
  Object.fromEntries(
    Object.entries(resolved)
      .filter(
        ([id, entry]) =>
          entry[field] !== undefined &&
          JSON.stringify(entry[field]) !== JSON.stringify(latest[id]?.[field]),
      )
      .map(([id, entry]) => [id, entry[field] as T]),
  );

// Showdown infers an ability's debut generation from its number when gen is absent.
const abilityGeneration = (ability: ShowdownEntry = {}) => {
  if (typeof ability.gen === "number") return ability.gen;
  const num = Number(ability.num);
  const index = [268, 234, 192, 165, 124, 77, 1].findIndex(
    first => num >= first,
  );
  return index < 0 ? 0 : 9 - index;
};

// Complete projections replace modern properties, including fields removed by a mod.
export function projectHistoricalMoves(
  latest: ShowdownTable,
  mods: Partial<Record<number, ModData>>,
  ids = Object.keys(latest),
): Partial<Record<keyof PastGenerations, Moves>> {
  const current = projectTable("Moves", latest);
  const past: Partial<Record<keyof PastGenerations, Moves>> = {};
  let parent = latest;
  for (let gen = 8; gen >= 1; gen--) {
    parent = resolveMod(parent, mods[gen]?.moves);
    const projected = projectTable("Moves", parent);
    const changed = Object.fromEntries(
      ids.flatMap(id => {
        const entry = projected[id];
        return entry && JSON.stringify(entry) !== JSON.stringify(current[id]) ?
            [[id, entry]]
          : [];
      }),
    );
    if (Object.keys(changed).length)
      past[gen as keyof PastGenerations] = changed;
  }
  return past;
}

// Each past generation's types, from Showdown's mods, which are listed newest first
export function projectPastGenerations(
  latest: GenerationData,
  mods: Partial<Record<number, ModData>>,
): PastGenerations {
  const past: PastGenerations = {};
  let parent = latest;
  let nextChart = pastTypeChart(latest.typechart, typesOf(latest.typechart));
  const speciesFields = (table: ShowdownTable) =>
    Object.fromEntries(
      Object.entries(table).map(([id, species]) => [
        id,
        species.isCosmeticForme ?
          { ...table[toId(species.baseSpecies)], ...species }
        : species,
      ]),
    );
  const latestSpecies = speciesFields(latest.pokedex);
  for (let gen = 8; gen >= 1; gen--) {
    const mod = mods[gen] ?? {};
    const resolved: GenerationData = {
      pokedex: resolveMod(parent.pokedex, mod.pokedex),
      moves: resolveMod(parent.moves, mod.moves),
      typechart: resolveMod(parent.typechart, mod.typechart),
      abilities: resolveMod(parent.abilities ?? {}, mod.abilities),
      formats: resolveMod(parent.formats ?? {}, mod.formats),
    };
    const types = typesOf(resolved.typechart);
    const typechart = pastTypeChart(resolved.typechart, types);
    const entry: PastGeneration = {
      types,
      pokemon: changedField(latest.pokedex, resolved.pokedex, "types"),
      moves: changedField(latest.moves, resolved.moves, "type"),
    };
    const moveData = Object.fromEntries(
      Object.entries(resolved.moves).flatMap(([id, move]) => {
        const properties = projections.Moves(move);
        return (
            JSON.stringify(properties) ===
              JSON.stringify(projections.Moves(latest.moves[id] ?? {}))
          ) ?
            []
          : [[id, properties]];
      }),
    );
    const formats = Object.fromEntries(
      Object.keys(mod.formats ?? resolved.formats ?? {}).flatMap(id => {
        const format = resolved.formats?.[id];
        if (!format) return [];
        const properties = projections.Formats(format);
        return (
            JSON.stringify(properties) ===
              JSON.stringify(projections.Formats(latest.formats?.[id] ?? {}))
          ) ?
            []
          : [[id, properties]];
      }),
    );
    if (Object.keys(formats).length) entry.formats = formats;
    const resolvedSpecies = speciesFields(resolved.pokedex);
    const baseStats = changedField<BaseStats>(
      latestSpecies,
      resolvedSpecies,
      "baseStats",
    );
    if (Object.keys(baseStats).length) entry.baseStats = baseStats;
    const abilities = Object.fromEntries(
      Object.entries(resolvedSpecies).flatMap(([id, species]) => {
        const current = isRecord(species.abilities) ? species.abilities : {};
        const names =
          gen < 3 ?
            []
          : Object.entries(current)
              .filter(([slot, name]) => {
                const introduced = abilityGeneration(
                  resolved.abilities?.[toId(name)],
                );
                // Showdown's validator rejects a hidden ability it marks unreleased
                const isHiddenUnavailable =
                  slot === "H" &&
                  (gen < 5 || species.unreleasedHidden === true);
                return !isHiddenUnavailable && introduced <= gen;
              })
              .map(([, name]) => String(name));
        const latestAbilities = latestSpecies[id]?.abilities;
        const latestNames = Object.values(
          isRecord(latestAbilities) ? latestAbilities : {},
        );
        return (
            gen < 3 || JSON.stringify(names) === JSON.stringify(latestNames)
          ) ?
            []
          : [[id, names]];
      }),
    );
    if (Object.keys(abilities).length) entry.abilities = abilities;
    // Kept so that old links holding one still load it
    const unreleasedHidden = Object.fromEntries(
      Object.entries(resolvedSpecies).flatMap(([id, species]) => {
        const hidden =
          isRecord(species.abilities) ? species.abilities.H : undefined;
        return (
            gen >= 5 &&
              species.unreleasedHidden === true &&
              typeof hidden === "string" &&
              abilityGeneration(resolved.abilities?.[toId(hidden)]) <= gen
          ) ?
            [[id, hidden]]
          : [];
      }),
    );
    if (Object.keys(unreleasedHidden).length)
      entry.unreleasedHidden = unreleasedHidden;
    if (JSON.stringify(typechart) !== JSON.stringify(nextChart)) {
      entry.typechart = typechart;
    }
    // Last, where --move-effects-only adds it, so both write the same file
    if (Object.keys(moveData).length) entry.moveData = moveData;
    past[gen as keyof PastGenerations] = entry;
    parent = resolved;
    nextChart = typechart;
  }
  return past;
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

// Each src/data file's entries by ID, or its text when it is not one table
export type DataSnapshot = Record<string, Record<string, unknown> | string>;

const tableOf = (value: unknown) => (isRecord(value) ? value : {});

// A full update orders some keys differently from a partial one, so compare with sorted keys
const sortedKeys = (_key: string, value: unknown) =>
  isRecord(value) && !Array.isArray(value) ?
    Object.fromEntries(
      Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
    )
  : value;
const isSame = (a: unknown, b: unknown) =>
  JSON.stringify(a, sortedKeys) === JSON.stringify(b, sortedKeys);

const championsLegal = (snapshot: DataSnapshot) =>
  Object.entries(tableOf(snapshot["formats.ts"]))
    .filter(([, entry]) => tableOf(entry).champions)
    .map(([id]) => id);

// Tells the maintainer what an update changed in src/data, and whether it looks major, like a
// new game or regulation, or minor. Undefined when nothing changed. `capIds` holds, by file, the
// moves and items Showdown marks as CAP (fan-made), which no game adds.
export function changeNotice(
  before: DataSnapshot,
  after: DataSnapshot,
  capIds: Partial<Record<string, string[]>> = {},
) {
  const nameTables = ["pokedex.ts", "items.ts", "moves.ts"].map(file => ({
    ...tableOf(before[file]),
    ...tableOf(after[file]),
  }));
  // E.g. "added Pikachu; changed Mew, Ditto, Eevee, Snorlax, Lapras, and 3 more"
  const describe = (
    changes: Record<string, string[]>,
    ...tables: Record<string, unknown>[]
  ) =>
    Object.entries(changes)
      .filter(([, ids]) => ids.length)
      .map(([change, ids]) => {
        const names = ids.map(
          id =>
            [...tables, ...nameTables]
              .map(table => tableOf(table[id]).name)
              .find(name => typeof name === "string") ?? id,
        );
        const more = names.length > 5 ? `, and ${names.length - 5} more` : "";
        return `${change} ${names.slice(0, 5).join(", ")}${more}`;
      })
      .join("; ");

  // The site's rule for CAP pokemon, in src/store/filtering.ts
  const pokedex = tableOf(after["pokedex.ts"]);
  const isCap = (file: string, id: string) => {
    const { num } = tableOf(pokedex[id]);
    return file === "pokedex.ts" ?
        typeof num === "number" && num < 0 && num > -5000
      : !!capIds[file]?.includes(id);
  };

  const lines: string[] = [];
  const newEntries: Record<string, number> = {};
  for (const [file, now] of Object.entries(after)) {
    const old = before[file];
    if (typeof old === "string" || typeof now === "string") {
      if (old !== now) lines.push(`- \`${file}\` changed`);
      continue;
    }
    const oldTable = tableOf(old);
    const added = Object.keys(now).filter(id => !Object.hasOwn(oldTable, id));
    const removed = Object.keys(oldTable).filter(id => !Object.hasOwn(now, id));
    const changed = Object.keys(now).filter(
      id => Object.hasOwn(oldTable, id) && !isSame(oldTable[id], now[id]),
    );
    const summary = describe({ added, removed, changed }, now, oldTable);
    if (summary) lines.push(`- \`${file}\`: ${summary}`);
    newEntries[file] = added.filter(id => !isCap(file, id)).length;
  }
  const wasLegal = championsLegal(before);
  const isLegal = championsLegal(after);
  const legality = describe({
    "now allows": isLegal.filter(id => !wasLegal.includes(id)),
    "no longer allows": wasLegal.filter(id => !isLegal.includes(id)),
  });
  if (legality) lines.unshift(`- Pokemon Champions: ${legality}`);
  if (!lines.length) return undefined;

  // One new pokemon, move, or item is minor, but a new game brings several pokemon, or pokemon
  // with their moves or items
  const newPokemon = newEntries["pokedex.ts"] ?? 0;
  const newGame =
    newPokemon > 1 ||
    (newPokemon > 0 && !!(newEntries["moves.ts"] || newEntries["items.ts"]));
  const reasons = [
    newGame &&
      "added several pokemon, or pokemon with new moves or items, as a new game does",
    !!legality &&
      "changed which pokemon Pokemon Champions allows, as a new regulation does",
  ].filter(reason => typeof reason === "string");
  const verdict =
    reasons.length ?
      `**Looks major:** Showdown ${reasons.join(", and ")}. Major data is due on the site within 2 days of Showdown publishing it.`
    : "**Looks minor:** Showdown added at most one pokemon and no pokemon with new moves or items, not counting CAP (fan-made) ones, and Pokemon Champions allows the same pokemon. Minor data is due on the site within 7 days of Showdown publishing it.";
  return [verdict, "", ...lines].join("\n");
}
