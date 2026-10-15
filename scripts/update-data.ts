import { generationTransferData } from "./update-data/generation-transfer.ts";
import { formatBansData } from "./update-data/format-bans.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import type {
  Generation,
  GenerationTransferData,
  GameVariantData,
  Items,
  Learnsets,
  Moves,
  Pokedex,
} from "../src/types.ts";
import { LATEST_GENERATION } from "../src/shared/generations.ts";
import {
  LETS_GO,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
} from "../src/shared/game-variants.ts";
import {
  type DataSnapshot,
  type DataTypes,
  type ModData,
  type MoveSearch,
  type ShowdownTable,
  changeNotice,
  collectViableItems,
  collectViableMoves,
  historicalViableInputs,
  flattenLearnsets,
  nameChanges,
  projectFormats,
  projectPastGenerations,
  projectGameVariant,
  projectTable,
  projectTypeChart,
  projectHiddenPowerSpreads,
  projectHistoricalMoves,
  renderGenerationSets,
  renderTypedData,
  resolveMod,
  toId,
} from "./update-data/transforms.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const showdownRoot =
  process.env.SHOWDOWN_ROOT ?? path.resolve(root, "../pokemon-showdown");
const clientRoot =
  process.env.SHOWDOWN_CLIENT_ROOT ??
  path.resolve(root, "../pokemon-showdown-client");
const dataRoot = path.join(root, "src/data");

async function read(relativePath: string) {
  return fs.readFile(relativePath, "utf8");
}

// Showdown's data files are TypeScript modules, so run them as such
async function importTypeScript(source: string) {
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022 },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
  return import(moduleUrl);
}

async function loadTable(
  sourcePath: string,
  exportName: string,
): Promise<ShowdownTable> {
  return (await importTypeScript(await read(sourcePath)))[exportName];
}

const loadShowdownTable = (file: string, exportName: string) =>
  loadTable(path.join(showdownRoot, file), exportName);

// A mod only has the files it changes
async function loadModTable(mod: string, file: string, exportName: string) {
  const modPath = path.join(showdownRoot, `data/mods/${mod}/${file}.ts`);
  try {
    await fs.access(modPath);
  } catch {
    return undefined;
  }
  return loadTable(modPath, exportName);
}

// The data files named differently from their type, lowercased
const DATA_FILES: Partial<Record<keyof DataTypes, string>> = {
  PastGenerations: "past-generations",
  HiddenPowerSpreads: "hidden-power-spreads",
  GameVariantData: "game-variants",
  FormatBans: "format-bans",
};

async function writeData<N extends keyof DataTypes>(
  typeName: N,
  data: DataTypes[N],
  onePerLine = false,
) {
  const file = DATA_FILES[typeName] ?? typeName.toLowerCase();
  // Learnsets are the bulk of the data and load lazily as JSON, which the browser parses faster
  if (typeName === "Learnsets") {
    await fs.writeFile(
      path.join(dataRoot, `${file}.json`),
      `${JSON.stringify(data, null, 2)}\n`,
    );
    return;
  }
  await fs.writeFile(
    path.join(dataRoot, `${file}.ts`),
    renderTypedData(typeName, data, onePerLine),
  );
}

async function updateProjectedDataset(
  sourceName: string,
  exportName: string,
  typeName: "Pokedex" | "Moves" | "Items" | "Natures",
) {
  const table = await loadShowdownTable(`data/${sourceName}.ts`, exportName);
  await writeData(typeName, projectTable(typeName, table), true);
}

async function updateFormats() {
  const [pokedex, formatsData, championsFormatsData] = await Promise.all([
    loadShowdownTable("data/pokedex.ts", "Pokedex"),
    loadShowdownTable("data/formats-data.ts", "FormatsData"),
    loadShowdownTable("data/mods/champions/formats-data.ts", "FormatsData"),
  ]);
  await writeData(
    "Formats",
    projectFormats(pokedex, formatsData, championsFormatsData),
    true,
  );
}

// Games whose learnsets Showdown keeps outside data/learnsets.ts:
// Champions, Legends: Z-A, Legends: Arceus, and BDSP
const learnsetMods = [
  "champions",
  "championsregmb",
  "gen9legends",
  "gen8legends",
  "gen8bdsp",
];

async function updateLearnsets() {
  const [learnsets, ...modLearnsets] = await Promise.all(
    [
      "data/learnsets.ts",
      ...learnsetMods.map(mod => `data/mods/${mod}/learnsets.ts`),
    ].map(file => loadShowdownTable(file, "Learnsets")),
  );
  if (!learnsets) throw new Error("data/learnsets.ts exports no Learnsets");
  const flattened = flattenLearnsets(learnsets, modLearnsets);
  await writeData("Learnsets", flattened);
  return flattened;
}

// Showdown's teambuilder sorts "usually useful" moves with BattleMoveSearch.moveIsNotUseless,
// which judges a move for one set. Run that function itself, so its rules stay Showdown's:
// a move is viable if any pokemon that learns it, with any of its abilities and required items,
// finds it useful in singles or doubles. (Gen 9 singles alone would drop sleep moves like Spore.)
async function updateViableMoves(learnsets: Learnsets) {
  const [pokedex, moves, source] = await Promise.all([
    loadShowdownTable("data/pokedex.ts", "Pokedex"),
    loadShowdownTable("data/moves.ts", "Moves"),
    read(
      path.join(
        clientRoot,
        "play.pokemonshowdown.com/src/battle-dex-search.ts",
      ),
    ),
  ]);
  // The method, followed by the four move lists it reads
  const match = source.match(
    /\tprivate (moveIsNotUseless\([\s\S]*?static readonly GOOD_DOUBLES_MOVES = [\s\S]*?;\n)/,
  );
  if (!match) {
    throw new Error("Could not find BattleMoveSearch.moveIsNotUseless");
  }
  const { BattleMoveSearch } = await importTypeScript(
    `const toID = ${toId};\nexport class BattleMoveSearch {\n${match[1]}}`,
  );
  const availability: GenerationTransferData = JSON.parse(
    await read(path.join(dataRoot, "generation-transfer.json")),
  );
  const past =
    await loadAppData<DataTypes["PastGenerations"]>("past-generations");
  let generationMoves = moves;
  const generations: Record<number, string[]> = {};
  for (let generation = 9; generation >= 1; generation--) {
    if (generation < 9)
      generationMoves = resolveMod(
        generationMoves,
        await loadModTable(`gen${generation}`, "moves", "Moves"),
      );
    const dex = {
      gen: generation,
      moves: {
        get: (id: string) => ({
          exists: id in generationMoves,
          flags: {},
          ...generationMoves[id],
        }),
      },
    };
    const searches: MoveSearch[] = [
      { formatType: null, isDoubles: false },
      { formatType: "doubles", isDoubles: true },
    ].map(format => Object.assign(new BattleMoveSearch(), { dex, ...format }));
    const hiddenPowers = Object.keys(moves).filter(
      id => id.startsWith("hiddenpower") && id !== "hiddenpower",
    );
    const inputs =
      generation === 9 ?
        { pokedex, learnsets }
      : historicalViableInputs(
          generation as Generation,
          pokedex,
          learnsets,
          availability,
          past[generation as Generation],
        );
    generations[generation] = collectViableMoves(
      inputs.pokedex,
      inputs.learnsets,
      hiddenPowers,
      searches,
    );
  }

  await fs.writeFile(
    path.join(dataRoot, "viable-moves.ts"),
    renderGenerationSets(
      "Moves that Pokemon Showdown's teambuilder lists as usually useful for at least one pokemon",
      "viableMovesIn",
      generations,
    ),
  );
}

// Showdown's teambuilder groups each generation's items, from popular to useless, in its
// build-tools/build-indexes. Run that grouping itself, so its rules stay Showdown's:
// an item is viable unless it is usually useless, useless, or unreleased.
async function updateViableItems() {
  const [items, source, ids] = await Promise.all([
    loadShowdownTable("data/items.ts", "Items"),
    read(path.join(clientRoot, "build-tools/build-indexes")),
    loadAppData<Items>("items").then(Object.keys),
  ]);
  const match = source.match(
    /(const greatItems = [\s\S]*?items\.push\(\.\.\.unreleasedItems\);)\n/,
  );
  if (!match) throw new Error("Could not find the teambuilder's item groups");
  // As for a singles format that is not National Dex or Metronome
  const { group } = await importTypeScript(
    [
      "export function group(Dex, gen, genNum, itemList) {",
      "const isMetBattle = false, isNatDex = false, isNDChampions = false, isDoubles = false;",
      "const items = [];",
      match[1],
      `return items.slice(0, items.indexOf(poorItems[0])).filter(row => typeof row === "string");`,
      "}",
    ].join("\n"),
  );
  const tables: Partial<Record<Generation, ShowdownTable>> = { 9: items };
  // Gen 1 has no held items
  for (let generation = 8; generation >= 2; generation--)
    tables[generation as Generation] = resolveMod(
      tables[(generation + 1) as Generation] ?? {},
      await loadModTable(`gen${generation}`, "items", "Items"),
    );
  await fs.writeFile(
    path.join(dataRoot, "viable-items.ts"),
    renderGenerationSets(
      "Items that Pokemon Showdown's teambuilder lists above its usually useless ones",
      "viableItemsIn",
      collectViableItems(group, tables, ids),
    ),
  );
}

async function updateTypeChart() {
  const typeChart = await loadShowdownTable("data/typechart.ts", "TypeChart");
  await writeData("TypeChart", projectTypeChart(typeChart));
}

async function updateHiddenPowerSpreads() {
  const typeChart = await loadShowdownTable("data/typechart.ts", "TypeChart");
  await writeData(
    "HiddenPowerSpreads",
    projectHiddenPowerSpreads(typeChart),
    true,
  );
}

// Showdown keeps each past generation's data in a mod that inherits from the next one's
async function updatePastGenerations() {
  const tables = [
    ["pokedex", "Pokedex"],
    ["moves", "Moves"],
    ["typechart", "TypeChart"],
    ["abilities", "Abilities"],
  ] as const;
  const [pokedex, moves, typechart, abilities] = await Promise.all(
    tables.map(([file, exportName]) =>
      loadShowdownTable(`data/${file}.ts`, exportName),
    ),
  );
  const formats = await loadShowdownTable(
    "data/formats-data.ts",
    "FormatsData",
  );
  if (!pokedex || !moves || !typechart) throw new Error("Missing base data");
  const mods = Object.fromEntries(
    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8].map(async gen => {
        const mod: ModData = {};
        for (const [file, exportName] of tables) {
          mod[file] = await loadModTable(`gen${gen}`, file, exportName);
        }
        mod.formats = await loadModTable(
          `gen${gen}`,
          "formats-data",
          "FormatsData",
        );
        return [gen, mod];
      }),
    ),
  );
  await writeData(
    "PastGenerations",
    projectPastGenerations(
      { pokedex, moves, typechart, abilities, formats },
      mods,
    ),
  );
}

async function updateGameVariants() {
  let pokedex = await loadShowdownTable("data/pokedex.ts", "Pokedex");
  let moves = await loadShowdownTable("data/moves.ts", "Moves");
  const variants = [
    [LEGENDS_ZA, "gen9legends", 9],
    [LEGENDS_ARCEUS, "gen8legends", 8],
    [LETS_GO, "gen7letsgo", 7],
  ] as const;
  const data: GameVariantData = {};
  for (let generation = 9; generation >= 7; generation--) {
    if (generation < 9) {
      pokedex = resolveMod(
        pokedex,
        await loadModTable(`gen${generation}`, "pokedex", "Pokedex"),
      );
      moves = resolveMod(
        moves,
        await loadModTable(`gen${generation}`, "moves", "Moves"),
      );
    }
    for (const [format, mod, gen] of variants) {
      if (gen !== generation) continue;
      data[format] = projectGameVariant(
        { pokedex, moves, typechart: {} },
        {
          pokedex: await loadModTable(mod, "pokedex", "Pokedex"),
          moves: await loadModTable(mod, "moves", "Moves"),
        },
      );
    }
  }
  await writeData("GameVariantData", data);
}

async function updateIconIndexes() {
  const source = await read(
    path.join(clientRoot, "play.pokemonshowdown.com/src/battle-dex-data.ts"),
  );
  const match = source.match(
    /export const BattlePokemonIconIndexes: \{ \[id: string\]: number \} = (\{[\s\S]*?\n\});\n\nexport const BattlePokemonIconIndexesLeft/,
  );
  if (!match) {
    throw new Error("Could not find BattlePokemonIconIndexes");
  }
  await fs.writeFile(
    path.join(dataRoot, "altSpriteNum.ts"),
    `const data: Record<string, number> = ${match[1]};\n\nexport default data;\n`,
  );
}

const loadAppData = async <T>(name: string): Promise<T> =>
  (await importTypeScript(await read(path.join(dataRoot, `${name}.ts`))))
    .default;

type ReportedData = { pokedex: Pokedex; moves: Moves; items: Items };

async function reportNameChanges(before: ReportedData, after: ReportedData) {
  const aliases = await loadShowdownTable("data/aliases.ts", "Aliases");
  const lines = nameChanges(before, after, aliases);
  console.log(
    lines.length ?
      `Old share links lose these names:\n${lines.join("\n")}`
    : "No pokemon, move, or item was renamed or removed.",
  );
}

const showdownSprites = "https://play.pokemonshowdown.com/sprites";

// The bundled icon sheets have to show every icon index in src/data
async function reportIconSheets() {
  for (const name of ["pokemonicons-sheet", "itemicons-sheet"]) {
    const local = await fs.readFile(
      path.join(root, `src/images/icon-sheets/${name}.png`),
    );
    const response = await fetch(`${showdownSprites}/${name}.png`);
    console.log(
      local.equals(Buffer.from(await response.arrayBuffer())) ?
        `${name}.png matches Showdown's.`
      : `${name}.png differs from Showdown's, last changed ${response.headers.get("last-modified")}.`,
    );
  }
}

const exists = async (url: string) => (await fetch(url, { method: "HEAD" })).ok;
const shortName = (url: string) => url.replace(`${showdownSprites}/`, "");

// Request what PokemonSprite.tsx would, at both sprite sizes
async function reportNewSprites(
  before: ReportedData,
  { pokedex }: ReportedData,
  iconIndexes: Record<string, number>,
) {
  const { spriteUrls } = await importTypeScript(
    await read(path.join(root, "src/app/shared/pokemon-sprite/sprite-urls.ts")),
  );
  const localSprites = await fs.readdir(
    path.join(root, "src/images/local-sprites"),
  );
  const newIds = Object.keys(pokedex).filter(id => !(id in before.pokedex));
  const check = async (id: string) => {
    const lines = [];
    for (const isSmall of [false, true]) {
      const [src, ...fallbacks] = spriteUrls(
        id,
        pokedex[id],
        iconIndexes[id],
        isSmall,
        LATEST_GENERATION,
      ).sources;
      if (await exists(src)) continue;
      let shown = "a broken image";
      for (const fallback of fallbacks) {
        if (!(await exists(fallback))) continue;
        shown = shortName(fallback);
        break;
      }
      lines.push(
        `  ${pokedex[id]?.name}: no ${shortName(src)}, so it shows ${shown}`,
      );
    }
    return lines;
  };
  const lines = [];
  const unbundled = newIds.filter(id => !localSprites.includes(`${id}.png`));
  for (let i = 0; i < unbundled.length; i += 8) {
    lines.push(...(await Promise.all(unbundled.slice(i, i + 8).map(check))));
  }
  const problems = [...new Set(lines.flat())];
  console.log(
    problems.length ?
      `${newIds.length} new pokemon, with these sprites missing on Showdown:\n${problems.join("\n")}`
    : `${newIds.length} new pokemon, all with sprites.`,
  );
}

const loadReportedData = async (): Promise<ReportedData> => {
  const [pokedex, moves, items] = await Promise.all([
    loadAppData<Pokedex>("pokedex"),
    loadAppData<Moves>("moves"),
    loadAppData<Items>("items"),
  ]);
  return { pokedex, moves, items };
};

// Everything the full update writes
async function loadSnapshot(): Promise<DataSnapshot> {
  const readData = (file: string) => read(path.join(dataRoot, file));
  const tables = [
    "pokedex",
    "moves",
    "items",
    "natures",
    "formats",
    "typechart",
    "game-variants",
    "past-generations",
    "hidden-power-spreads",
    "altSpriteNum",
  ];
  const transfer: GenerationTransferData = JSON.parse(
    await readData("generation-transfer.json"),
  );
  return {
    ...Object.fromEntries(
      await Promise.all(
        tables.map(async name => [`${name}.ts`, await loadAppData(name)]),
      ),
    ),
    "learnsets.json": JSON.parse(await readData("learnsets.json")),
    "generation-transfer.json (pokemon)": transfer.pokemon,
    "generation-transfer.json (items)": transfer.items,
    "viable-moves.ts": await readData("viable-moves.ts"),
    "viable-items.ts": await readData("viable-items.ts"),
  };
}

// Showdown's CAP (fan-made) moves and items, by the file they go to
async function loadCapIds() {
  const capIds = async (file: string, exportName: string) => {
    const table = await loadShowdownTable(`data/${file}`, exportName);
    const ids = Object.entries(table)
      .filter(([, entry]) => entry.isNonstandard === "CAP")
      .map(([id]) => id);
    return [file, ids] as const;
  };
  return Object.fromEntries(
    await Promise.all([
      capIds("moves.ts", "Moves"),
      capIds("items.ts", "Items"),
    ]),
  );
}

// `--notice=<file>` also writes the notice there, for the Showdown data workflow to post
async function reportChanges(before: DataSnapshot, after: DataSnapshot) {
  const notice = changeNotice(before, after, await loadCapIds());
  console.log(notice ?? "Showdown changed nothing the site uses.");
  const file = process.argv
    .find(arg => arg.startsWith("--notice="))
    ?.slice("--notice=".length);
  if (notice && file) {
    await fs.writeFile(
      file,
      `${notice}\n\nTo bring these into the site, run \`npm run update:data\`, then \`npm run update:translations\`, as the README describes.\n`,
    );
  }
}

async function updateMoveEffects() {
  const latest = await loadShowdownTable("data/moves.ts", "Moves");
  const before = await loadAppData<Moves>("moves");
  const projected = projectTable("Moves", latest);
  const moves = Object.fromEntries(
    Object.entries(before).map(([id, entry]) => [
      id,
      projected[id] ? { ...projected[id], name: entry.name } : entry,
    ]),
  );
  const mods = Object.fromEntries(
    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8].map(async gen => [
        gen,
        {
          moves: await loadModTable(`gen${gen}`, "moves", "Moves"),
        },
      ]),
    ),
  );
  const historical = projectHistoricalMoves(latest, mods, Object.keys(before));
  const past =
    await loadAppData<DataTypes["PastGenerations"]>("past-generations");
  for (const [gen, entry] of Object.entries(past)) {
    const properties = historical[Number(gen) as keyof typeof historical];
    if (properties) entry.moveData = properties;
    else delete entry.moveData;
  }
  await writeData("Moves", moves, true);
  await writeData("PastGenerations", past);
  console.log(
    "Updated move effects and historical properties; existing move IDs and names are unchanged.",
  );
}

async function updateData() {
  if (process.argv.includes("--viable-moves-only")) {
    const learnsets = JSON.parse(
      await read(path.join(dataRoot, "learnsets.json")),
    ) as Learnsets;
    await updateViableMoves(learnsets);
    return;
  }
  if (process.argv.includes("--viable-items-only")) {
    await updateViableItems();
    return;
  }
  if (process.argv.includes("--move-effects-only")) {
    await updateMoveEffects();
    return;
  }
  if (process.argv.includes("--item-effects-only")) {
    const before = await loadAppData<Items>("items");
    const table = projectTable(
      "Items",
      await loadShowdownTable("data/items.ts", "Items"),
    );
    await writeData(
      "Items",
      Object.fromEntries(
        Object.entries(before).map(([id, entry]) => {
          const {
            name: _name,
            spritenum: _sprite,
            ...effects
          } = table[id] ?? {};
          return [
            id,
            { name: entry.name, spritenum: entry.spritenum, ...effects },
          ];
        }),
      ),
      true,
    );
    console.log(
      "Updated item effects; existing item IDs, names and icons are unchanged.",
    );
    return;
  }
  if (process.argv.includes("--pokedex-only")) {
    await updateProjectedDataset("pokedex", "Pokedex", "Pokedex");
    return;
  }
  if (process.argv.includes("--items-only")) {
    await updateProjectedDataset("items", "Items", "Items");
    return;
  }
  if (process.argv.includes("--game-variants-only")) {
    await updateGameVariants();
    return;
  }
  if (process.argv.includes("--past-generations-only")) {
    await updatePastGenerations();
    return;
  }
  if (process.argv.includes("--hidden-power-only")) {
    await updateHiddenPowerSpreads();
    return;
  }
  if (process.argv.includes("--format-bans-only")) {
    await writeData("FormatBans", formatBansData(showdownRoot), true);
    return;
  }
  const before = await loadReportedData();
  const snapshot = await loadSnapshot();

  await Promise.all([
    updateProjectedDataset("pokedex", "Pokedex", "Pokedex"),
    updateProjectedDataset("moves", "Moves", "Moves"),
    updateProjectedDataset("items", "Items", "Items"),
    updateProjectedDataset("natures", "Natures", "Natures"),
    updateFormats(),
    updateLearnsets(),
    updateTypeChart(),
    updateHiddenPowerSpreads(),
    updatePastGenerations(),
    updateGameVariants(),
    updateIconIndexes(),
  ]);

  await Promise.all(
    [
      "altSpriteNum",
      "formats",
      "items",
      "learnsets",
      "moves",
      "natures",
      "past-generations",
      "pokedex",
      "typechart",
    ].map(name => fs.rm(path.join(dataRoot, `${name}.js`), { force: true })),
  );

  const transferData = generationTransferData(
    showdownRoot,
    Object.keys(await loadAppData<Pokedex>("pokedex")),
    Object.keys(await loadAppData<Items>("items")),
  );
  await fs.writeFile(
    path.join(dataRoot, "generation-transfer.json"),
    `${JSON.stringify(transferData, null, 2)}\n`,
  );
  await writeData("FormatBans", formatBansData(showdownRoot), true);

  await updateViableMoves(
    JSON.parse(await read(path.join(dataRoot, "learnsets.json"))) as Learnsets,
  );
  await updateViableItems();

  const after = await loadReportedData();
  await reportChanges(snapshot, await loadSnapshot());
  await reportNameChanges(before, after);
  try {
    await reportIconSheets();
    await reportNewSprites(before, after, await loadAppData("altSpriteNum"));
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "fetch failed")
      throw error;
    console.warn(
      "Could not reach play.pokemonshowdown.com, so the icon sheets and new sprites were not checked.",
    );
  }
}

await updateData();
