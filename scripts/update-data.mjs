import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const showdownRoot =
  process.env.SHOWDOWN_ROOT ?? path.resolve(root, "../pokemon-showdown");
const clientRoot =
  process.env.SHOWDOWN_CLIENT_ROOT ??
  path.resolve(root, "../pokemon-showdown-client");
const dataRoot = path.join(root, "src/data");

async function read(relativePath) {
  return fs.readFile(relativePath, "utf8");
}

async function importTypeScript(source) {
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022 },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
  return import(moduleUrl);
}

async function loadTypeScriptExport(sourcePath, exportName) {
  return (await importTypeScript(await read(sourcePath)))[exportName];
}

const toId = text => `${text ?? ""}`.toLowerCase().replace(/[^a-z0-9]/g, "");

// `onePerLine` keeps each entry on its own line so data updates produce readable diffs
function renderTypedData(typeName, data, onePerLine = false) {
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
function pick(entry, keys) {
  return Object.fromEntries(
    keys
      .filter(key => entry[key] !== undefined)
      .map(key => [key, typeof entry[key] === "function" ? true : entry[key]]),
  );
}

const projections = {
  Pokedex: (entry, pokedex) => {
    if (entry.isCosmeticForme) {
      entry = {
        ...pokedex[toId(entry.baseSpecies)],
        ...entry,
        otherFormes: undefined,
      };
    }
    return pick(entry, [
      "num",
      "name",
      "types",
      "baseSpecies",
      "forme",
      "otherFormes",
      "prevo",
      "abilities",
      "requiredItem",
      "requiredItems",
    ]);
  },
  Moves: entry => ({
    ...pick(entry, [
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
    ...(entry.secondary && {
      secondary: pick(entry.secondary, ["chance", "status"]),
    }),
    ...(entry.flags?.sound && { flags: { sound: 1 } }),
  }),
  Items: entry => pick(entry, ["name", "spritenum"]),
  Formats: entry => pick(entry, ["tier", "doublesTier"]),
};

async function updateProjectedDataset(sourceName, exportName, typeName) {
  const dataset = await loadTypeScriptExport(
    path.join(showdownRoot, "data", `${sourceName}.ts`),
    exportName,
  );
  const projected = Object.fromEntries(
    Object.entries(dataset).map(([id, entry]) => [
      id,
      projections[typeName](entry, dataset),
    ]),
  );
  await fs.writeFile(
    path.join(dataRoot, `${typeName.toLowerCase()}.ts`),
    renderTypedData(typeName, projected, true),
  );
}

// Showdown's `champions` mod tracks the current Pokemon Champions regulation. A forme without
// its own entry there is as legal as the forme or species it comes from.
async function updateFormats() {
  const [pokedex, formatsData, championsFormatsData] = await Promise.all(
    [
      ["data/pokedex.ts", "Pokedex"],
      ["data/formats-data.ts", "FormatsData"],
      ["data/mods/champions/formats-data.ts", "FormatsData"],
    ].map(([file, exportName]) =>
      loadTypeScriptExport(path.join(showdownRoot, file), exportName),
    ),
  );
  const championsData = { ...formatsData, ...championsFormatsData };
  const isChampionsLegal = id => {
    const entry = championsData[id];
    if (entry?.isNonstandard) return false;
    if (entry?.tier) return entry.tier !== "Illegal";

    const { battleOnly, baseSpecies } = pokedex[id] ?? {};
    const parent = toId([battleOnly, baseSpecies].flat().find(Boolean));
    return !!parent && parent !== id && isChampionsLegal(parent);
  };
  const ids = new Set([...Object.keys(formatsData), ...Object.keys(pokedex)]);
  const projected = Object.fromEntries(
    [...ids]
      .map(id => [
        id,
        {
          ...projections.Formats(formatsData[id] ?? {}),
          ...(isChampionsLegal(id) && { champions: true }),
        },
      ])
      .filter(([, entry]) => Object.keys(entry).length),
  );
  await fs.writeFile(
    path.join(dataRoot, "formats.ts"),
    renderTypedData("Formats", projected, true),
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
    ].map(file =>
      loadTypeScriptExport(path.join(showdownRoot, file), "Learnsets"),
    ),
  );
  const flattened = Object.fromEntries(
    Object.entries(learnsets).map(([species, entry]) => [
      species,
      Object.keys(entry.learnset ?? {}),
    ]),
  );
  for (const modLearnset of modLearnsets) {
    for (const [species, entry] of Object.entries(modLearnset)) {
      flattened[species] = [
        ...new Set([
          ...(flattened[species] ?? []),
          ...Object.keys(entry.learnset ?? {}),
        ]),
      ].sort();
    }
  }
  await fs.writeFile(
    path.join(dataRoot, "learnsets.ts"),
    renderTypedData("Learnsets", flattened),
  );
  return flattened;
}

// Showdown's teambuilder sorts "usually useful" moves with BattleMoveSearch.moveIsNotUseless,
// which judges a move for one set. Run that function itself, so its rules stay Showdown's:
// a move is viable if any pokemon that learns it, with any of its abilities and required items,
// finds it useful in singles or doubles. (Gen 9 singles alone would drop sleep moves like Spore.)
async function updateViableMoves(learnsets) {
  const [pokedex, moves, source] = await Promise.all([
    loadTypeScriptExport(path.join(showdownRoot, "data/pokedex.ts"), "Pokedex"),
    loadTypeScriptExport(path.join(showdownRoot, "data/moves.ts"), "Moves"),
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
  const dex = {
    gen: 9,
    moves: { get: id => ({ exists: id in moves, flags: {}, ...moves[id] }) },
  };
  const searches = [
    { formatType: null, isDoubles: false },
    { formatType: "doubles", isDoubles: true },
  ].map(format => Object.assign(new BattleMoveSearch(), { dex, ...format }));
  const hiddenPowers = Object.keys(moves).filter(
    id => id.startsWith("hiddenpower") && id !== "hiddenpower",
  );

  const viable = new Set();
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
      ...(entry.requiredItems ?? []),
    ].filter(item => item !== undefined);
    // Cosmetic formes list no abilities; their base species covers them
    const sets = Object.values(entry.abilities ?? {}).flatMap(ability =>
      items.map(item => ({ ability, item, moves: [] })),
    );
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

  await fs.writeFile(
    path.join(dataRoot, "viable-moves.ts"),
    [
      "// Moves that Pokemon Showdown's teambuilder lists as usually useful for at least one pokemon",
      `const data: ReadonlySet<string> = new Set(${JSON.stringify([...viable].sort(), null, 2)});`,
      "",
      "export default data;",
      "",
    ].join("\n"),
  );
}

async function updateTypeChart() {
  const typeChart = await loadTypeScriptExport(
    path.join(showdownRoot, "data/typechart.ts"),
    "TypeChart",
  );
  const standardTypes = [
    "Bug",
    "Dark",
    "Dragon",
    "Electric",
    "Fairy",
    "Fighting",
    "Fire",
    "Flying",
    "Ghost",
    "Grass",
    "Ground",
    "Ice",
    "Normal",
    "Poison",
    "Psychic",
    "Rock",
    "Steel",
    "Water",
  ];
  const damageCode = { 0: 0, 1: -1, 2: 1, 3: 2 };
  const projected = Object.fromEntries(
    standardTypes.map(type => {
      const damageTaken = typeChart[type.toLowerCase()].damageTaken;
      return [
        type,
        Object.fromEntries(
          Object.entries(damageTaken)
            .filter(([attackType]) => attackType !== "Stellar")
            .map(([attackType, code]) => [attackType, damageCode[code]]),
        ),
      ];
    }),
  );
  await fs.writeFile(
    path.join(dataRoot, "typechart.ts"),
    renderTypedData("TypeChart", projected),
  );
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

const loadAppData = async name =>
  (await importTypeScript(await read(path.join(dataRoot, `${name}.ts`))))
    .default;

// Share links hold display names, so a name that disappears empties that slot in old links.
// Showdown's aliases say what a removed ID is called now.
async function reportNameChanges(before, after) {
  const aliases = await loadTypeScriptExport(
    path.join(showdownRoot, "data/aliases.ts"),
    "Aliases",
  );
  const lines = Object.entries(before).flatMap(([dataset, oldEntries]) => {
    const newNames = new Set(Object.values(after[dataset]).map(e => e.name));
    return Object.entries(oldEntries)
      .filter(([, { name }]) => !newNames.has(name))
      .map(([id, { name }]) => {
        const newName = after[dataset][id]?.name ?? aliases[id];
        return `  ${dataset}: ${name} ${newNames.has(newName) ? `is now ${newName}` : "was removed"}`;
      });
  });
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
    const local = await fs.readFile(path.join(root, `src/images/${name}.png`));
    const response = await fetch(`${showdownSprites}/${name}.png`);
    console.log(
      local.equals(Buffer.from(await response.arrayBuffer())) ?
        `${name}.png matches Showdown's.`
      : `${name}.png differs from Showdown's, last changed ${response.headers.get("last-modified")}.`,
    );
  }
}

const exists = async url => (await fetch(url, { method: "HEAD" })).ok;

// Request what PokemonSprite.tsx would, at both sprite sizes
async function reportNewSprites(before, { pokedex }, iconIndexes) {
  const { spriteUrls } = await importTypeScript(
    await read(
      path.join(
        root,
        "src/app/main/pokemon-team/shared/pokemon-sprite/sprite-urls.ts",
      ),
    ),
  );
  const localSprites = await fs.readdir(
    path.join(root, "src/images/local-sprites"),
  );
  const newIds = Object.keys(pokedex).filter(id => !(id in before.pokedex));
  const check = async id => {
    const lines = [];
    for (const isSmall of [false, true]) {
      const { src, fallback } = spriteUrls(
        id,
        pokedex[id],
        iconIndexes[id],
        isSmall,
      );
      if (await exists(src)) continue;
      const hasFallback = src !== fallback && (await exists(fallback));
      lines.push(
        `  ${pokedex[id].name}: no ${src.replace(`${showdownSprites}/`, "")}, so it shows ${hasFallback ? "the static gen5 sprite" : "a broken image"}`,
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

const loadReportedData = async () =>
  Object.fromEntries(
    await Promise.all(
      ["pokedex", "moves", "items"].map(async name => [
        name,
        await loadAppData(name),
      ]),
    ),
  );
const before = await loadReportedData();

await Promise.all([
  updateProjectedDataset("pokedex", "Pokedex", "Pokedex"),
  updateProjectedDataset("moves", "Moves", "Moves"),
  updateProjectedDataset("items", "Items", "Items"),
  updateFormats(),
  updateLearnsets().then(updateViableMoves),
  updateTypeChart(),
  updateIconIndexes(),
]);

await Promise.all(
  [
    "altSpriteNum",
    "formats",
    "items",
    "learnsets",
    "moves",
    "pokedex",
    "typechart",
  ].map(name => fs.rm(path.join(dataRoot, `${name}.js`), { force: true })),
);

const after = await loadReportedData();
await reportNameChanges(before, after);
try {
  await reportIconSheets();
  await reportNewSprites(before, after, await loadAppData("altSpriteNum"));
} catch (error) {
  if (error.message !== "fetch failed") throw error;
  console.warn(
    "Could not reach play.pokemonshowdown.com, so the icon sheets and new sprites were not checked.",
  );
}
