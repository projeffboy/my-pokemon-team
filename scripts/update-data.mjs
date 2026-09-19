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

async function loadTypeScriptExport(sourcePath, exportName) {
  const source = await read(sourcePath);
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022 },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
  return (await import(moduleUrl))[exportName];
}

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
  Pokedex: entry =>
    pick(entry, [
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
      "tags",
    ]),
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
      projections[typeName](entry),
    ]),
  );
  await fs.writeFile(
    path.join(dataRoot, `${typeName.toLowerCase()}.ts`),
    renderTypedData(typeName, projected, true),
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

await Promise.all([
  updateProjectedDataset("pokedex", "Pokedex", "Pokedex"),
  updateProjectedDataset("moves", "Moves", "Moves"),
  updateProjectedDataset("items", "Items", "Items"),
  updateProjectedDataset("formats-data", "FormatsData", "Formats"),
  updateLearnsets(),
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
