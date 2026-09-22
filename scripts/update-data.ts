import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import type { Items, Learnsets, Moves, Pokedex } from "../src/types.ts";
import {
  type DataTypes,
  type MoveSearch,
  type ShowdownTable,
  collectViableMoves,
  flattenLearnsets,
  nameChanges,
  projectFormats,
  projectTable,
  projectTypeChart,
  renderTypedData,
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

async function writeData<N extends keyof DataTypes>(
  typeName: N,
  data: DataTypes[N],
  onePerLine = false,
) {
  await fs.writeFile(
    path.join(dataRoot, `${typeName.toLowerCase()}.ts`),
    renderTypedData(typeName, data, onePerLine),
  );
}

async function updateProjectedDataset(
  sourceName: string,
  exportName: string,
  typeName: "Pokedex" | "Moves" | "Items",
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
  const dex = {
    gen: 9,
    moves: {
      get: (id: string) => ({ exists: id in moves, flags: {}, ...moves[id] }),
    },
  };
  const searches: MoveSearch[] = [
    { formatType: null, isDoubles: false },
    { formatType: "doubles", isDoubles: true },
  ].map(format => Object.assign(new BattleMoveSearch(), { dex, ...format }));
  const hiddenPowers = Object.keys(moves).filter(
    id => id.startsWith("hiddenpower") && id !== "hiddenpower",
  );
  const viable = collectViableMoves(pokedex, learnsets, hiddenPowers, searches);

  await fs.writeFile(
    path.join(dataRoot, "viable-moves.ts"),
    [
      "// Moves that Pokemon Showdown's teambuilder lists as usually useful for at least one pokemon",
      `const data: ReadonlySet<string> = new Set(${JSON.stringify(viable, null, 2)});`,
      "",
      "export default data;",
      "",
    ].join("\n"),
  );
}

async function updateTypeChart() {
  const typeChart = await loadShowdownTable("data/typechart.ts", "TypeChart");
  await writeData("TypeChart", projectTypeChart(typeChart));
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
    const local = await fs.readFile(path.join(root, `src/images/${name}.png`));
    const response = await fetch(`${showdownSprites}/${name}.png`);
    console.log(
      local.equals(Buffer.from(await response.arrayBuffer())) ?
        `${name}.png matches Showdown's.`
      : `${name}.png differs from Showdown's, last changed ${response.headers.get("last-modified")}.`,
    );
  }
}

const exists = async (url: string) => (await fetch(url, { method: "HEAD" })).ok;

// Request what PokemonSprite.tsx would, at both sprite sizes
async function reportNewSprites(
  before: ReportedData,
  { pokedex }: ReportedData,
  iconIndexes: Record<string, number>,
) {
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
  const check = async (id: string) => {
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
        `  ${pokedex[id]?.name}: no ${src.replace(`${showdownSprites}/`, "")}, so it shows ${hasFallback ? "the static gen5 sprite" : "a broken image"}`,
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
  if (!(error instanceof Error) || error.message !== "fetch failed")
    throw error;
  console.warn(
    "Could not reach play.pokemonshowdown.com, so the icon sheets and new sprites were not checked.",
  );
}
