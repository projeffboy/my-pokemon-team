// Pure transforms from PokeAPI's CSV tables to src/data/translations, kept apart from the I/O
// so they can be tested
import type { NamedLocale } from "../../src/i18n/locales.ts";
import type { NameTranslations, Pokedex } from "../../src/types.ts";

export type CsvRow = Record<string, string>;

// PokeAPI's language IDs for each locale, most preferred first. Japanese prefers the kanji
// names (ja) and falls back to the kana-only ones (ja-Hrkt) where PokeAPI has no kanji row.
export const LANGUAGE_IDS: Record<NamedLocale, string[]> = {
  ja: ["11", "1"],
  ko: ["3"],
  "zh-Hant": ["4"],
  "zh-Hans": ["12"],
  fr: ["5"],
  de: ["6"],
  es: ["7"],
  it: ["8"],
};

export const toId = (text: unknown) =>
  `${text ?? ""}`.toLowerCase().replace(/[^a-z0-9]/g, "");

// RFC 4180 CSV: quoted fields may hold commas, newlines, and doubled quotes
export function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char !== '"') field += char;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === ",") endField();
    else if (char === "\n") endRow();
    else if (char !== "\r") field += char;
  }
  if (field || row.length) endRow();
  const [header = [], ...records] = rows;
  return records
    .filter(record => record.length > 1)
    .map(record =>
      Object.fromEntries(header.map((key, i) => [key, record[i] ?? ""])),
    );
}

// The CSV tables the translations come from, as parsed rows
export interface PokeApiTables {
  pokemon_species: CsvRow[];
  pokemon_species_names: CsvRow[];
  pokemon_forms: CsvRow[];
  pokemon_form_names: CsvRow[];
  moves: CsvRow[];
  move_names: CsvRow[];
  items: CsvRow[];
  item_names: CsvRow[];
  abilities: CsvRow[];
  ability_names: CsvRow[];
  natures: CsvRow[];
  nature_names: CsvRow[];
  types: CsvRow[];
  type_names: CsvRow[];
  regions: CsvRow[];
  region_names: CsvRow[];
}

export const POKEAPI_TABLES = [
  "pokemon_species",
  "pokemon_species_names",
  "pokemon_forms",
  "pokemon_form_names",
  "moves",
  "move_names",
  "items",
  "item_names",
  "abilities",
  "ability_names",
  "natures",
  "nature_names",
  "types",
  "type_names",
  "regions",
  "region_names",
] as const satisfies readonly (keyof PokeApiTables)[];

// The Showdown data the translations are keyed by
export interface ShowdownNames {
  pokedex: Pokedex;
  moves: Record<string, { name?: string }>;
  items: Record<string, { name?: string }>;
  natures: Record<string, { name?: string }>;
  abilities: string[];
  types: string[];
  regions: string[];
}

// Fullwidth letters and digits, which PokeAPI's Japanese and Chinese names use for
// suffixes like Ｘ and １０％, become halfwidth so typing "X" finds them
const toHalfwidth = (text: string) =>
  text.replace(/[！-～]/g, char =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0),
  );

type Names = Map<string, Record<string, string>>; // PokeAPI id → language id → name

function namesById(rows: CsvRow[], idKey: string, nameKey = "name"): Names {
  const names: Names = new Map();
  for (const row of rows) {
    const id = row[idKey] ?? "";
    const name = row[nameKey]?.trim();
    if (!name) continue;
    const byLanguage = names.get(id) ?? {};
    byLanguage[row.local_language_id ?? ""] ??= name;
    names.set(id, byLanguage);
  }
  return names;
}

// PokeAPI's identifier for a Showdown ID, when they differ by more than punctuation
const identifierOf = (
  rows: CsvRow[],
  normalize = (identifier: string) => identifier,
) => {
  const ids = new Map<string, string>();
  for (const row of rows) {
    const key = toId(normalize(row.identifier ?? ""));
    if (!ids.has(key)) ids.set(key, row.id ?? "");
  }
  return ids;
};

const stripSuffix = (suffixes: string[]) => (id: string) =>
  suffixes.reduce(
    (id, suffix) => (id.endsWith(suffix) ? id.slice(0, -suffix.length) : id),
    id,
  );

// Showdown formes whose PokeAPI form is named differently
const FORM_ALIASES: Record<string, string> = {
  rockruffdusk: "rockruffowntempo",
  greninjabond: "greninjabattlebond",
  miniormeteor: "miniorredmeteor",
  marowakalolatotem: "marowaktotem",
  raticatealolatotem: "raticatetotemalola",
  mimikyubustedtotem: "mimikyutotembusted",
  necrozmaduskmane: "necrozmadusk",
  necrozmadawnwings: "necrozmadawn",
  mausholdfour: "mausholdfamilyoffour",
  dudunsparcethreesegment: "dudunsparcethreesegment",
  pikachuoriginal: "pikachuoriginalcap",
  pikachuhoenn: "pikachuhoenncap",
  pikachusinnoh: "pikachusinnohcap",
  pikachuunova: "pikachuunovacap",
  pikachukalos: "pikachukaloscap",
  pikachualola: "pikachualolacap",
  pikachupartner: "pikachupartnercap",
  pikachuworld: "pikachuworldcap",
  darmanitangalar: "darmanitangalarstandard",
  urshifugmax: "urshifusinglestrikegmax",
  mimikyutotem: "mimikyutotemdisguised",
};

// Regional and gendered formes, breeds, masks, plumages, and Alcremie's flavours carry a suffix on PokeAPI
const FORM_SUFFIXES = [
  "",
  "breed",
  "mask",
  "plumage",
  "cap",
  "strawberrysweet",
];

function findFormId(forms: Map<string, string>, id: string, forme: string) {
  const candidates = [FORM_ALIASES[id] ?? id];
  const gendered = { F: "female", M: "male" }[forme];
  if (gendered) candidates.push(id.slice(0, -1) + gendered);
  for (const candidate of candidates) {
    for (const suffix of FORM_SUFFIXES) {
      const formId = forms.get(candidate + suffix);
      if (formId) return formId;
    }
  }
  return undefined;
}

// How each language writes a mega evolution's name, e.g. Méga-Dracaufeu X
const MEGA_NAMES: Record<
  NamedLocale,
  (name: string, suffix: string) => string
> = {
  ja: (name, suffix) => `メガ${name}${suffix}`,
  ko: (name, suffix) => `메가${name}${suffix}`,
  "zh-Hant": (name, suffix) => `超級${name}${suffix}`,
  "zh-Hans": (name, suffix) => `超级${name}${suffix}`,
  fr: (name, suffix) => `Méga-${name}${suffix && ` ${suffix}`}`,
  de: (name, suffix) => `Mega-${name}${suffix && ` ${suffix}`}`,
  es: (name, suffix) => `Mega-${name}${suffix && ` ${suffix}`}`,
  it: (name, suffix) => `Mega${name}${suffix && ` ${suffix}`}`,
};

// How each language names a Gigantamax forme, which PokeAPI only names in some languages
const GMAX_FORMS: Record<NamedLocale, string> = {
  ja: "キョダイマックスのすがた",
  ko: "거다이맥스의 모습",
  "zh-Hant": "超極巨化的樣子",
  "zh-Hans": "超极巨化的样子",
  fr: "Forme Gigamax",
  de: "Gigadynamax-Form",
  es: "Forma Gigamax",
  it: "Forma Gigamax",
};

const REGIONAL_FORMES = ["Alola", "Galar", "Hisui", "Paldea"];

// Formes that mean the same on every species, so one species' PokeAPI name serves the others,
// e.g. Giratina's Origin Forme names Dialga-Origin
const SHARED_FORMES = [
  "Origin",
  "Therian",
  "F",
  "M",
  "Sandy",
  "Trash",
  "Summer",
  "Autumn",
  "Winter",
];

export interface TranslationReport {
  // Showdown names left in English, by dataset
  untranslated: Record<keyof NameTranslations, string[]>;
  // Formes named after their translated species and English forme, e.g. 彩粉蝶-Icy Snow
  partialFormes: string[];
  // Different things left with the same name, e.g. "items: A, B (name)"
  collisions: string[];
}

// A name and the PokeAPI row it comes from, with the row's name in each of the locale's
// languages, the preferred name first
interface Candidate {
  source: string;
  names: string[];
}

// Groups of keys that share a name although they come from different sources. Keys from
// one source share it on purpose, e.g. Leek and Stick, the same item in different games.
function sharedNames(
  names: Record<string, string>,
  sourceOf = (key: string) => key,
) {
  const byName = new Map<string, string[]>();
  for (const [key, name] of Object.entries(names)) {
    byName.set(name, [...(byName.get(name) ?? []), key]);
  }
  return [...byName.values()].filter(
    keys => new Set(keys.map(sourceOf)).size > 1,
  );
}

// Each key's preferred name, except that rows sharing one, such as PokeAPI's Japanese
// Masterpiece Teacup repeating the Unremarkable Teacup's name, take their names in the
// first fallback language that tells them apart
function distinctNames(candidates: Record<string, Candidate>) {
  const names: Record<string, string> = {};
  for (const [key, candidate] of Object.entries(candidates)) {
    names[key] = candidate.names[0] ?? "";
  }
  const sourceOf = (key: string) => candidates[key]?.source ?? key;
  for (const keys of sharedNames(names, sourceOf)) {
    const languages = Math.max(
      ...keys.map(key => candidates[key]?.names.length ?? 0),
    );
    for (let i = 1; i < languages; i++) {
      const alternatives = keys.map(key => candidates[key]?.names[i] ?? "");
      if (alternatives.includes("") || new Set(alternatives).size < keys.length)
        continue;
      keys.forEach((key, j) => (names[key] = alternatives[j] ?? ""));
      break;
    }
  }
  return names;
}

const reportCollisions = (
  report: TranslationReport,
  dataset: keyof NameTranslations,
  names: Record<string, string>,
  displayName = (key: string) => key,
  sourceOf?: (key: string) => string,
) => {
  for (const keys of sharedNames(names, sourceOf)) {
    report.collisions.push(
      `${dataset}: ${keys.map(displayName).join(", ")} (${names[keys[0] ?? ""]})`,
    );
  }
};

const firstName = (
  names: Record<string, string> | undefined,
  languageIds: string[],
) => {
  for (const languageId of languageIds) {
    const name = names?.[languageId];
    if (name) return toHalfwidth(name);
  }
  return undefined;
};

// One locale's translations of every Showdown name, with what could not be translated
export function buildTranslations(
  showdown: ShowdownNames,
  tables: PokeApiTables,
  locale: NamedLocale,
): { translations: NameTranslations; report: TranslationReport } {
  const languageIds = LANGUAGE_IDS[locale];
  const lookup = (names: Names, id: string | undefined) =>
    id === undefined ? undefined : firstName(names.get(id), languageIds);
  // A row's names for distinctNames: its preferred name, then its name in each fallback
  // language, or the preferred name where that language has none
  const candidate = (
    names: Names,
    id: string,
    preferred: string,
  ): Candidate => ({
    source: id,
    names: languageIds.map((languageId, i) => {
      const name = names.get(id)?.[languageId];
      return i && name ? toHalfwidth(name) : preferred;
    }),
  });

  const speciesIds = identifierOf(tables.pokemon_species);
  const speciesNames = namesById(
    tables.pokemon_species_names,
    "pokemon_species_id",
  );
  const formIds = identifierOf(tables.pokemon_forms);
  const formNames = namesById(
    tables.pokemon_form_names,
    "pokemon_form_id",
    "form_name",
  );
  const fullFormNames = namesById(
    tables.pokemon_form_names,
    "pokemon_form_id",
    "pokemon_name",
  );
  const moveIds = identifierOf(
    tables.moves,
    stripSuffix(["--physical", "--special"]),
  );
  const moveNames = namesById(tables.move_names, "move_id");
  const itemIds = identifierOf(tables.items, stripSuffix(["--held", "--bag"]));
  const itemNames = namesById(tables.item_names, "item_id");
  const abilityIds = identifierOf(tables.abilities);
  const abilityNames = namesById(tables.ability_names, "ability_id");
  const natureIds = identifierOf(tables.natures);
  const natureNames = namesById(tables.nature_names, "nature_id");
  const typeIds = identifierOf(tables.types);
  const typeNames = namesById(tables.type_names, "type_id");
  const regionIds = identifierOf(tables.regions);
  const regionNames = namesById(tables.region_names, "region_id");

  const translations: NameTranslations = {
    pokemon: {},
    moves: {},
    items: {},
    abilities: {},
    natures: {},
    types: {},
    regions: {},
  };
  const report: TranslationReport = {
    untranslated: {
      pokemon: [],
      moves: [],
      items: [],
      abilities: [],
      natures: [],
      types: [],
      regions: [],
    },
    partialFormes: [],
    collisions: [],
  };

  const { pokedex } = showdown;
  const speciesName = (id: string) => lookup(speciesNames, speciesIds.get(id));

  const typeName = (type: string) => lookup(typeNames, typeIds.get(toId(type)));
  const regionName = (region: string) =>
    lookup(regionNames, regionIds.get(toId(region)));

  // "{region}のすがた", from how PokeAPI names Alolan Raichu, for the regional formes it
  // does not name in this language
  const regionalForm = (region: string) => {
    const alola = regionName("Alola") ?? "Alola";
    const reference = lookup(formNames, formIds.get("raichualola"));
    if (!reference?.includes(alola)) return undefined;
    return reference.replace(alola, regionName(region) ?? region);
  };

  // Another species' PokeAPI name for the same forme, when it does not name that species
  const sharedForms = new Map<string, string | undefined>();
  const sharedForm = (forme: string) => {
    if (sharedForms.has(forme)) return sharedForms.get(forme);
    let shared: string | undefined;
    for (const [id, entry] of Object.entries(pokedex)) {
      if (entry.forme !== forme || !entry.baseSpecies) continue;
      const species = speciesName(toId(entry.baseSpecies));
      const formName = lookup(formNames, findFormId(formIds, id, forme));
      if (species && formName && !formName.includes(species)) {
        shared = formName;
        break;
      }
    }
    sharedForms.set(forme, shared);
    return shared;
  };

  // A pokemon's name: its species, then its forme as PokeAPI names it, else a mega
  // evolution, regional, Gigantamax, or type forme in the language's own style, else
  // the species with the English forme
  const labels = new Map<string, string | undefined>();
  const pokemonName = (id: string): string | undefined => {
    if (labels.has(id)) return labels.get(id);
    const label = buildPokemonName(id);
    labels.set(id, label);
    return label;
  };
  const buildPokemonName = (id: string): string | undefined => {
    const entry = pokedex[id];
    if (!entry) return undefined;
    const base = entry.baseSpecies ? toId(entry.baseSpecies) : id;
    const species = speciesName(base);
    if (!species) return undefined;
    const { forme } = entry;
    if (!forme) return species;

    const formId = findFormId(formIds, id, forme);
    const fullName = lookup(fullFormNames, formId);
    if (fullName) return fullName;
    const withForm = (formName: string | undefined) =>
      formName === undefined ? undefined
      : formName.includes(species) ? formName
      : `${species} (${formName})`;
    const formName = withForm(lookup(formNames, formId));
    if (formName) return formName;

    const mega = /^(?:(.+)-)?Mega(?:-([XYZ]))?$/.exec(forme);
    if (mega) {
      const [, baseForme, suffix = ""] = mega;
      // E.g. Meowstic-F-Mega is the mega of Meowstic-F
      const baseName =
        baseForme ? pokemonName(base + toId(baseForme)) : undefined;
      return MEGA_NAMES[locale](baseName ?? species, suffix);
    }
    const templated =
      REGIONAL_FORMES.includes(forme) ? withForm(regionalForm(forme))
      : forme === "Gmax" ? withForm(GMAX_FORMS[locale])
      : showdown.types.includes(forme) ? withForm(typeName(forme))
      : SHARED_FORMES.includes(forme) ? withForm(sharedForm(forme))
      : undefined;
    if (templated) return templated;

    report.partialFormes.push(entry.name ?? id);
    return `${species}-${forme}`;
  };

  for (const [id, entry] of Object.entries(pokedex)) {
    const name = pokemonName(id);
    if (name) translations.pokemon[id] = name;
    else report.untranslated.pokemon.push(entry.name ?? id);
  }

  const MOVE_ALIASES: Record<string, string> = { visegrip: "vicegrip" };
  const hiddenPower = lookup(moveNames, moveIds.get("hiddenpower"));
  const moveCandidates: Record<string, Candidate> = {};
  for (const [id, { name }] of Object.entries(showdown.moves)) {
    const type = /^hiddenpower(.+)$/.exec(id)?.[1];
    const hiddenPowerType = type && typeName(type);
    const moveId = moveIds.get(MOVE_ALIASES[id] ?? id);
    const translated = lookup(moveNames, moveId);
    if (type && hiddenPower && hiddenPowerType) {
      moveCandidates[id] = {
        source: id,
        names: [`${hiddenPower} ${hiddenPowerType}`],
      };
    } else if (moveId && translated) {
      moveCandidates[id] = candidate(moveNames, moveId, translated);
    } else report.untranslated.moves.push(name ?? id);
  }
  translations.moves = distinctNames(moveCandidates);

  const ITEM_ALIASES: Record<string, string> = {
    leek: "stick",
    prettyfeather: "prettywing",
  };
  const itemCandidates: Record<string, Candidate> = {};
  for (const [id, { name }] of Object.entries(showdown.items)) {
    const itemId = itemIds.get(ITEM_ALIASES[id] ?? id);
    const translated = lookup(itemNames, itemId);
    if (itemId && translated) {
      itemCandidates[id] = candidate(itemNames, itemId, translated);
    } else report.untranslated.items.push(name ?? id);
  }
  translations.items = distinctNames(itemCandidates);

  const abilityCandidates: Record<string, Candidate> = {};
  const details: Record<string, string> = {};
  for (const ability of showdown.abilities) {
    // E.g. Embody Aspect (Teal) is one of four Embody Aspect abilities, and As One
    // (Glastrier) one of two, with the pokemon named in the current language
    const [, plain = ability, detail] =
      /^(.*?)\s*\((.*)\)$/.exec(ability) ?? [];
    if (detail) details[ability] = `(${speciesName(toId(detail)) ?? detail})`;
    const exactId = abilityIds.get(toId(ability));
    const sharedId = abilityIds.get(toId(plain));
    const exact = lookup(abilityNames, exactId);
    const shared = lookup(abilityNames, sharedId);
    const withDetail = (name: string) =>
      details[ability] ? `${name} ${details[ability]}` : name;
    if (exactId && exact) {
      abilityCandidates[ability] = candidate(abilityNames, exactId, exact);
    } else if (sharedId && shared) {
      const { names } = candidate(abilityNames, sharedId, shared);
      abilityCandidates[ability] = {
        source: ability,
        names: names.map(withDetail),
      };
    } else report.untranslated.abilities.push(ability);
  }
  translations.abilities = distinctNames(abilityCandidates);
  // Abilities that PokeAPI names alike in every language, such as the two As One, keep
  // their detail
  const abilitySource = (ability: string) =>
    abilityCandidates[ability]?.source ?? ability;
  for (const abilities of sharedNames(translations.abilities, abilitySource)) {
    for (const ability of abilities) {
      if (details[ability]) {
        translations.abilities[ability] += ` ${details[ability]}`;
      }
    }
  }

  for (const [id, { name }] of Object.entries(showdown.natures)) {
    const translated = lookup(natureNames, natureIds.get(id));
    if (translated) translations.natures[id] = translated;
    else report.untranslated.natures.push(name ?? id);
  }

  for (const type of showdown.types) {
    const translated = typeName(type);
    if (translated) translations.types[type] = translated;
    else report.untranslated.types.push(type);
  }

  for (const region of showdown.regions) {
    const translated = regionName(region);
    if (translated) translations.regions[region] = translated;
    else report.untranslated.regions.push(region);
  }

  const englishName =
    (data: Record<string, { name?: string }>) => (id: string) =>
      data[id]?.name ?? id;
  const sourceOf = (candidates: Record<string, Candidate>) => (key: string) =>
    candidates[key]?.source ?? key;
  reportCollisions(
    report,
    "moves",
    translations.moves,
    englishName(showdown.moves),
    sourceOf(moveCandidates),
  );
  reportCollisions(
    report,
    "items",
    translations.items,
    englishName(showdown.items),
    sourceOf(itemCandidates),
  );
  reportCollisions(
    report,
    "abilities",
    translations.abilities,
    undefined,
    abilitySource,
  );
  reportCollisions(
    report,
    "natures",
    translations.natures,
    englishName(showdown.natures),
  );
  reportCollisions(report, "types", translations.types);
  reportCollisions(report, "regions", translations.regions);

  return { translations, report };
}

// Formes that ended up with the same name, e.g. the three Paldean Tauros breeds where
// PokeAPI only names the Paldean form, get their species with the English forme instead
export function disambiguatePokemon(
  translations: NameTranslations,
  pokedex: Pokedex,
  report: TranslationReport,
) {
  for (const ids of sharedNames(translations.pokemon)) {
    for (const id of ids) {
      const entry = pokedex[id];
      const base = entry?.baseSpecies ? toId(entry.baseSpecies) : id;
      const species = translations.pokemon[base];
      if (!entry?.forme || !species) continue;
      translations.pokemon[id] = `${species}-${entry.forme}`;
      report.partialFormes.push(entry.name ?? id);
    }
  }
  reportCollisions(
    report,
    "pokemon",
    translations.pokemon,
    id => pokedex[id]?.name ?? id,
  );
}

// One entry per line, so PokeAPI updates produce readable diffs
export function renderTranslations(translations: NameTranslations) {
  const sections = Object.entries(translations).map(([key, names]) => {
    const lines = Object.entries(names).map(
      ([id, name]) => `    ${JSON.stringify(id)}: ${JSON.stringify(name)}`,
    );
    return `  ${JSON.stringify(key)}: {\n${lines.join(",\n")}\n  }`;
  });
  return `{\n${sections.join(",\n")}\n}\n`;
}
