import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import type { Items, Moves, Natures, Pokedex } from "../src/types.ts";
import { LOCALES, type Locale } from "../src/i18n/locales.ts";
import {
  POKEAPI_TABLES,
  type PokeApiTables,
  type ShowdownNames,
  buildTranslations,
  disambiguatePokemon,
  parseCsv,
  renderTranslations,
} from "./update-translations/transforms.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(root, "src/data");
const pokeApiCsv =
  process.env.POKEAPI_CSV_URL ??
  "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv";

// Showdown's data files are TypeScript modules, so run them as such
async function loadAppData<T>(name: string): Promise<T> {
  const source = await fs.readFile(path.join(dataRoot, `${name}.ts`), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022 },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
  return (await import(moduleUrl)).default;
}

async function loadTable(name: string) {
  const response = await fetch(`${pokeApiCsv}/${name}.csv`);
  if (!response.ok) {
    throw new Error(`Could not fetch ${name}.csv: ${response.status}`);
  }
  return parseCsv(await response.text());
}

const [pokedex, moves, items, natures] = await Promise.all([
  loadAppData<Pokedex>("pokedex"),
  loadAppData<Moves>("moves"),
  loadAppData<Items>("items"),
  loadAppData<Natures>("natures"),
]);
const { POKEMON_TYPES } = await import("../src/types.ts");
const { REGIONS } = await import("../src/shared/regions.ts");

const showdown: ShowdownNames = {
  pokedex,
  moves,
  items,
  natures,
  // CAP pokemon are hidden from the dropdown, so their names and abilities stay English
  abilities: [
    ...new Set(
      Object.values(pokedex)
        .filter(({ num = 0 }) => num >= 0)
        .flatMap(({ abilities }) => Object.values(abilities ?? {})),
    ),
  ].filter(ability => ability),
  types: [...POKEMON_TYPES, "Stellar"],
  regions: [...REGIONS],
};

const tables = Object.fromEntries(
  await Promise.all(
    POKEAPI_TABLES.map(async name => [name, await loadTable(name)]),
  ),
) as PokeApiTables;

// Only moves a pokemon can be given matter: Z-Moves and Max Moves are in moves.ts but no learnset
const learnsets: Record<string, string[]> = JSON.parse(
  await fs.readFile(path.join(dataRoot, "learnsets.json"), "utf8"),
);
const learnableMoves = new Set(Object.values(learnsets).flat());
const isListed = (move: string) =>
  learnableMoves.has(move) || move.startsWith("hiddenpower");
const moveName = (id: string) => moves[id]?.name ?? id;

await fs.mkdir(path.join(dataRoot, "translations"), { recursive: true });
for (const locale of LOCALES.filter(
  (locale): locale is Exclude<Locale, "en"> => locale !== "en",
)) {
  const { translations, report } = buildTranslations(showdown, tables, locale);
  disambiguatePokemon(translations, pokedex, report);
  await fs.writeFile(
    path.join(dataRoot, `translations/${locale}.json`),
    renderTranslations(translations),
  );

  const listedMoves = Object.keys(moves).filter(isListed).map(moveName);
  const realPokemon = Object.values(pokedex)
    .filter(({ num = 0 }) => num >= 0)
    .map(({ name }) => name);
  const untranslated = { ...report.untranslated };
  untranslated.moves = untranslated.moves.filter(name =>
    listedMoves.includes(name),
  );
  untranslated.pokemon = untranslated.pokemon.filter(name =>
    realPokemon.includes(name),
  );
  const lines = Object.entries(untranslated)
    .filter(([, names]) => names.length)
    .map(
      ([dataset, names]) =>
        `  ${dataset} left in English (${names.length}): ${names.join(", ")}`,
    );
  if (report.partialFormes.length) {
    lines.push(
      `  formes named after their species and English forme (${report.partialFormes.length}): ${report.partialFormes.join(", ")}`,
    );
  }
  console.log(
    `${locale}:${lines.length ? `\n${lines.join("\n")}` : " everything translated"}`,
  );
}
