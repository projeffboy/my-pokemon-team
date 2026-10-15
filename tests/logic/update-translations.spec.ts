import { test, expect } from "@playwright/test";
import {
  buildTranslations,
  disambiguatePokemon,
  parseCsv,
  renderTranslations,
  type PokeApiTables,
  type ShowdownNames,
} from "../../scripts/update-translations/transforms";

test("parseCsv reads quoted fields, escaped quotes, and CRLF lines", () => {
  expect(parseCsv('id,name\r\n1,"Farfetch""d"\n2,"a, b"\n')).toEqual([
    { id: "1", name: 'Farfetch"d' },
    { id: "2", name: "a, b" },
  ]);
});

// A miniature PokeAPI: Charizard with its Mega X, Raichu with its Alolan forme, and a
// Hisuian Growlithe that Korean lacks a form name for
const rows = (header: string, ...lines: string[]) =>
  parseCsv([header, ...lines].join("\n"));
const tables: PokeApiTables = {
  pokemon_species: rows(
    "id,identifier",
    "6,charizard",
    "26,raichu",
    "58,growlithe",
    "122,mr-mime",
  ),
  pokemon_species_names: rows(
    "pokemon_species_id,local_language_id,name",
    "6,5,Dracaufeu",
    "6,3,리자몽",
    "6,11,リザードン",
    "26,5,Raichu",
    "26,3,라이츄",
    "58,5,Caninos",
    "58,3,가디",
    "122,5,M. Mime",
  ),
  pokemon_forms: rows(
    "id,identifier",
    "10034,charizard-mega-x",
    "10100,raichu-alola",
    "10229,growlithe-hisui",
  ),
  pokemon_form_names: rows(
    "pokemon_form_id,local_language_id,form_name,pokemon_name",
    "10034,5,Méga-Dracaufeu X,Méga-Dracaufeu X",
    "10034,3,메가리자몽X,",
    "10100,5,Forme d’Alola,Raichu d’Alola",
    "10100,3,알로라의 모습,",
    "10229,5,Forme de Hisui,Caninos de Hisui",
  ),
  moves: rows(
    "id,identifier",
    "237,hidden-power",
    "622,breakneck-blitz--physical",
    "623,breakneck-blitz--special",
  ),
  move_names: rows(
    "move_id,local_language_id,name",
    "237,5,Puissance Cachée",
    "622,5,Turbo-Charge",
  ),
  items: rows(
    "id,identifier",
    "234,leftovers",
    "817,normalium-z--held",
    // Ends in "bag" without being a bag copy of another item
    "900,berserk-gene-bag",
  ),
  item_names: rows(
    "item_id,local_language_id,name",
    "234,5,Restes",
    "817,5,Normazélite",
    "900,5,Sac Gène",
  ),
  abilities: rows("id,identifier", "47,thick-fat", "301,embody-aspect"),
  ability_names: rows(
    "ability_id,local_language_id,name",
    "47,5,Isograisse",
    "301,5,Force Mémorielle",
  ),
  natures: rows("id,identifier", "3,adamant"),
  nature_names: rows("nature_id,local_language_id,name", "3,5,Rigide"),
  types: rows("id,identifier", "10,fire", "19,stellar"),
  type_names: rows(
    "type_id,local_language_id,name",
    "10,5,Feu",
    "10,3,불꽃",
    "19,5,Stellaire",
  ),
  regions: rows("id,identifier", "7,alola", "9,hisui"),
  region_names: rows(
    "region_id,local_language_id,name",
    "7,5,Alola",
    "7,3,알로라",
    "9,5,Hisui",
    "9,3,히스이",
  ),
};

const showdown: ShowdownNames = {
  pokedex: {
    charizard: { num: 6, name: "Charizard" },
    charizardmegax: {
      num: 6,
      name: "Charizard-Mega-X",
      baseSpecies: "Charizard",
      forme: "Mega-X",
    },
    charizardmegaz: {
      num: 6,
      name: "Charizard-Mega-Z",
      baseSpecies: "Charizard",
      forme: "Mega-Z",
    },
    raichu: { num: 26, name: "Raichu" },
    raichualola: {
      num: 26,
      name: "Raichu-Alola",
      baseSpecies: "Raichu",
      forme: "Alola",
    },
    growlithe: { num: 58, name: "Growlithe" },
    growlithehisui: {
      num: 58,
      name: "Growlithe-Hisui",
      baseSpecies: "Growlithe",
      forme: "Hisui",
    },
    growlithetotem: {
      num: 58,
      name: "Growlithe-Totem",
      baseSpecies: "Growlithe",
      forme: "Totem",
    },
    mrmime: { num: 122, name: "Mr. Mime" },
    missingno: { num: 0, name: "MissingNo." },
  },
  moves: {
    hiddenpower: { name: "Hidden Power" },
    hiddenpowerfire: { name: "Hidden Power Fire" },
    breakneckblitz: { name: "Breakneck Blitz" },
    gmaxwildfire: { name: "G-Max Wildfire" },
  },
  items: {
    leftovers: { name: "Leftovers" },
    normaliumz: { name: "Normalium Z" },
    berserkgene: { name: "Berserk Gene" },
  },
  natures: { adamant: { name: "Adamant" } },
  abilities: ["Thick Fat", "Embody Aspect (Teal)", "Fire Mane"],
  types: ["Fire", "Stellar"],
  regions: ["Alola", "Hisui"],
};

test("French names come from PokeAPI's species, forms, and other tables", () => {
  const { translations, report } = buildTranslations(showdown, tables, "fr");
  expect(translations.pokemon).toEqual({
    charizard: "Dracaufeu",
    charizardmegax: "Méga-Dracaufeu X",
    charizardmegaz: "Méga-Dracaufeu Z",
    raichu: "Raichu",
    raichualola: "Raichu d’Alola",
    growlithe: "Caninos",
    growlithehisui: "Caninos de Hisui",
    growlithetotem: "Caninos-Totem",
    mrmime: "M. Mime",
  });
  expect(translations.moves).toEqual({
    hiddenpower: "Puissance Cachée",
    hiddenpowerfire: "Puissance Cachée Feu",
    breakneckblitz: "Turbo-Charge",
  });
  expect(translations.items).toEqual({
    leftovers: "Restes",
    normaliumz: "Normazélite",
  });
  expect(translations.abilities).toEqual({
    "Thick Fat": "Isograisse",
    "Embody Aspect (Teal)": "Force Mémorielle (Teal)",
  });
  expect(translations.natures).toEqual({ adamant: "Rigide" });
  expect(translations.types).toEqual({ Fire: "Feu", Stellar: "Stellaire" });
  expect(translations.regions).toEqual({ Alola: "Alola", Hisui: "Hisui" });
  expect(report.untranslated).toEqual({
    pokemon: ["MissingNo."],
    moves: ["G-Max Wildfire"],
    items: ["Berserk Gene"],
    abilities: ["Fire Mane"],
    natures: [],
    types: [],
    regions: [],
  });
  expect(report.partialFormes).toEqual(["Growlithe-Totem"]);
});

test("Korean formes are the species with PokeAPI's form name, or a regional or mega template", () => {
  const { translations } = buildTranslations(showdown, tables, "ko");
  expect(translations.pokemon).toMatchObject({
    charizardmegax: "메가리자몽X",
    charizardmegaz: "메가리자몽Z",
    raichualola: "라이츄 (알로라의 모습)",
    growlithehisui: "가디 (히스이의 모습)",
    growlithetotem: "가디-Totem",
  });
  expect(translations.pokemon).not.toHaveProperty("mrmime");
});

test("Japanese falls back to kana names and halfwidth letters", () => {
  const kana = {
    ...tables,
    pokemon_species_names: rows(
      "pokemon_species_id,local_language_id,name",
      "6,1,リザードン",
    ),
    pokemon_form_names: rows(
      "pokemon_form_id,local_language_id,form_name,pokemon_name",
      "10034,1,メガリザードンＸ,",
    ),
  };
  const { translations } = buildTranslations(showdown, kana, "ja");
  expect(translations.pokemon.charizardmegax).toBe("メガリザードンX");
});

test("formes that share a name get their species and English forme instead", () => {
  const { translations, report } = buildTranslations(showdown, tables, "fr");
  translations.pokemon.charizardmegaz = "Méga-Dracaufeu X";
  translations.pokemon.raichu = "Dracaufeu";
  disambiguatePokemon(translations, showdown.pokedex, report);
  expect(translations.pokemon.charizardmegax).toBe("Dracaufeu-Mega-X");
  expect(translations.pokemon.charizardmegaz).toBe("Dracaufeu-Mega-Z");
  expect(report.partialFormes).toContain("Charizard-Mega-X");
  expect(report.collisions).toEqual(["pokemon: Charizard, Raichu (Dracaufeu)"]);
});

test("things PokeAPI names alike take a fallback language's names, else keep their detail", () => {
  const collisions: PokeApiTables = {
    ...tables,
    pokemon_species: rows("id,identifier", "896,glastrier", "897,spectrier"),
    pokemon_species_names: rows(
      "pokemon_species_id,local_language_id,name",
      "896,11,ブリザポス",
      "897,11,レイスポス",
    ),
    items: rows(
      "id,identifier",
      "259,stick",
      "2223,unremarkable-teacup",
      "2224,masterpiece-teacup",
    ),
    // PokeAPI's kanji row for the Masterpiece Teacup repeats the Unremarkable one's name
    item_names: rows(
      "item_id,local_language_id,name",
      "259,11,ながねぎ",
      "259,1,ながねぎ",
      "2223,11,ボンサクのちゃわん",
      "2223,1,ボンサクのちゃわん",
      "2224,11,ボンサクのちゃわん",
      "2224,1,ケッサクのちゃわん",
    ),
    moves: rows("id,identifier", "1,pound", "2,karate-chop"),
    move_names: rows(
      "move_id,local_language_id,name",
      "1,11,はたく",
      "2,11,はたく",
    ),
    abilities: rows(
      "id,identifier",
      "266,as-one-glastrier",
      "267,as-one-spectrier",
      "301,embody-aspect",
    ),
    ability_names: rows(
      "ability_id,local_language_id,name",
      "266,11,じんばいったい",
      "266,1,じんばいったい",
      "267,11,じんばいったい",
      "301,11,おもかげやどし",
    ),
  };
  const { translations, report } = buildTranslations(
    {
      ...showdown,
      items: {
        leek: { name: "Leek" },
        stick: { name: "Stick" },
        unremarkableteacup: { name: "Unremarkable Teacup" },
        masterpieceteacup: { name: "Masterpiece Teacup" },
      },
      moves: { pound: { name: "Pound" }, karatechop: { name: "Karate Chop" } },
      abilities: [
        "As One (Glastrier)",
        "As One (Spectrier)",
        "Embody Aspect (Teal)",
      ],
    },
    collisions,
    "ja",
  );
  expect(translations.items).toEqual({
    leek: "ながねぎ",
    stick: "ながねぎ",
    unremarkableteacup: "ボンサクのちゃわん",
    masterpieceteacup: "ケッサクのちゃわん",
  });
  expect(translations.abilities).toEqual({
    "As One (Glastrier)": "じんばいったい (ブリザポス)",
    "As One (Spectrier)": "じんばいったい (レイスポス)",
    "Embody Aspect (Teal)": "おもかげやどし (Teal)",
  });
  expect(report.collisions).toEqual(["moves: Pound, Karate Chop (はたく)"]);
});

test("renderTranslations writes one name per line", () => {
  expect(
    renderTranslations({
      pokemon: { charizard: "Dracaufeu" },
      moves: {},
      items: {},
      abilities: {},
      natures: {},
      types: {},
      regions: {},
    }),
  ).toBe(
    `{\n  "pokemon": {\n    "charizard": "Dracaufeu"\n  },\n  "moves": {\n\n  },\n  "items": {\n\n  },\n  "abilities": {\n\n  },\n  "natures": {\n\n  },\n  "types": {\n\n  },\n  "regions": {\n\n  }\n}\n`,
  );
});
