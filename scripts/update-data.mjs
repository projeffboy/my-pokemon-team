import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const showdownRoot = path.resolve(root, "../pokemon-showdown");
const clientRoot = path.resolve(root, "../pokemon-showdown-client");
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

function convertExport(source, exportName, checkTypes = true) {
  const declaration = new RegExp(
    `export const ${exportName}: import\\([^)]*\\)\\.[^=]+ =`,
  );
  const converted = source.replace(
    declaration,
    "const data: Record<string, any> =",
  );

  if (converted === source) {
    throw new Error(`Could not find the ${exportName} export`);
  }

  const header = checkTypes
    ? ""
    : "// @ts-nocheck -- callbacks depend on Pokemon Showdown simulator types.\n";
  return `${header}${converted.trimEnd()}\n\nexport default data;\n`;
}

function renderTypedData(typeName, data) {
  return [
    `import type { ${typeName} } from "../types";`,
    "",
    `const data: ${typeName} = ${JSON.stringify(data, null, 2)};`,
    "",
    "export default data;",
    "",
  ].join("\n");
}

async function updateDirectDataset(
  sourceName,
  exportName,
  targetName,
  checkTypes = true,
) {
  const source = await read(path.join(showdownRoot, "data", `${sourceName}.ts`));
  await fs.writeFile(
    path.join(dataRoot, `${targetName}.ts`),
    convertExport(source, exportName, checkTypes),
  );
}

async function updateLearnsets() {
  const learnsets = await loadTypeScriptExport(
    path.join(showdownRoot, "data/learnsets.ts"),
    "Learnsets",
  );
  const flattened = Object.fromEntries(
    Object.entries(learnsets).map(([species, entry]) => [
      species,
      Object.keys(entry.learnset ?? {}),
    ]),
  );
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
  updateDirectDataset("pokedex", "Pokedex", "pokedex"),
  updateDirectDataset("moves", "Moves", "moves", false),
  updateDirectDataset("items", "Items", "items", false),
  updateDirectDataset("formats-data", "FormatsData", "formats"),
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