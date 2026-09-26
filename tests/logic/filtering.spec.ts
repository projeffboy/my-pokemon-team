import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import { filterPokemon, introducedIn, isInGeneration } from "@/store/filtering";

const all = { format: "", region: "", type: "" };

const isCap = (pokemon: string) => {
  const num = pokedex[pokemon]?.num ?? 0;
  return num < 0 && num > -5000;
};

test("empty filters preserve Pokedex order and return an independent list", () => {
  const expected = Object.keys(pokedex).filter(pokemon => !isCap(pokemon));
  const result = filterPokemon(Object.freeze({ ...all }));
  expect(result).toEqual(expected);
  result.pop();
  expect(filterPokemon(all)).toEqual(expected);
});

test("CAP pokemon are hidden, but MissingNo. and Pokestar pokemon are not", () => {
  const result = filterPokemon(all);
  for (const cap of [
    "syclar",
    "crucibellemega",
    "ramnarokradiant",
    "obliteryx",
  ])
    expect(result).not.toContain(cap);
  expect(filterPokemon({ ...all, type: "Ghost" })).not.toContain("pajantom");
  expect(result).toContain("missingno");
  expect(result).toContain("pokestargiant");
});

test("type filtering includes either type of a dual-type species", () => {
  const psychic = filterPokemon({ ...all, type: "Psychic" });
  expect(psychic).toContain("espurr");
  expect(psychic).toContain("medicham");
  expect(psychic).not.toContain("milotic");
});

test("cosmetic formes retain their species' type and region filters", () => {
  const result = filterPokemon({ ...all, type: "Bug", region: "Kalos" });
  expect(result).toContain("vivillongarden");
  expect(result).toContain("vivillonpolar");
});

const regionCases = [
  ["Kanto", "bulbasaur", "mew", "chikorita"],
  ["Johto", "chikorita", "celebi", "treecko"],
  ["Hoenn", "treecko", "deoxys", "turtwig"],
  ["Sinnoh", "turtwig", "arceus", "victini"],
  ["Unova", "victini", "genesect", "chespin"],
  ["Kalos", "chespin", "volcanion", "rowlet"],
  ["Alola", "rowlet", "melmetal", "grookey"],
  ["Galar", "grookey", "calyrex", "wyrdeer"],
  ["Hisui", "wyrdeer", "enamorus", "sprigatito"],
  ["Paldea", "sprigatito", "pecharunt", "bulbasaur"],
];

for (const [region, first, last, outside] of regionCases) {
  test(`${region} includes both ends of its national dex range`, () => {
    const result = filterPokemon({ ...all, region });
    expect(result).toContain(first);
    expect(result).toContain(last);
    expect(result).not.toContain(outside);
  });
}

for (const [region, regional, original] of [
  ["Alola", "rattataalola", "rattata"],
  ["Galar", "ponytagalar", "ponyta"],
  ["Hisui", "voltorbhisui", "voltorb"],
  ["Paldea", "taurospaldeaaqua", "tauros"],
]) {
  test(`${region} adds its regional formes of earlier species`, () => {
    const result = filterPokemon({ ...all, region });
    expect(result).toContain(regional);
    expect(result).not.toContain(original);
  });
}

test("Kanto excludes every later regional forme", () => {
  const result = filterPokemon({ ...all, region: "Kanto" });
  expect(result).not.toContain("rattataalola");
  expect(result).not.toContain("ponytagalar");
  expect(result).not.toContain("growlithehisui");
  expect(result).not.toContain("taurospaldeablaze");
});

test("Hisui includes the origin formes", () => {
  const result = filterPokemon({ ...all, region: "Hisui" });
  expect(result).toEqual(
    expect.arrayContaining(["dialgaorigin", "palkiaorigin"]),
  );
});

test("singles formats include lower tiers in tier order", () => {
  const result = filterPokemon({ ...all, format: "OU: Over Used" });
  expect(result).toEqual(
    expect.arrayContaining(["tinglu", "milotic", "dreepy"]),
  );
  expect(result).not.toContain("miraidon");
  expect(result.indexOf("tinglu")).toBeLessThan(result.indexOf("milotic"));
  expect(result.indexOf("milotic")).toBeLessThan(result.indexOf("dreepy"));
});

test("doubles formats use doubles tiers, including untiered DUU species", () => {
  const result = filterPokemon({ ...all, format: "Doubles UU" });
  expect(result).toContain("regieleki");
  expect(result).toContain("milotic");
  expect(result).not.toContain("tinglu");
  expect(result).not.toContain("miraidon");
  expect(result.indexOf("regieleki")).toBeLessThan(result.indexOf("milotic"));
});

test("format, region, and type filters intersect", () => {
  expect(
    filterPokemon({
      format: "Little Cup (LC)",
      region: "Kalos",
      type: "Poison",
    }),
  ).toEqual(["skrelp"]);
});

test("Pokemon Champions keeps only eligible species without mutating the source Pokedex or filters", () => {
  const expectedKeys = Object.keys(pokedex);
  const filters = Object.freeze({ ...all, format: "Pokemon Champions (M-C)" });
  const result = filterPokemon(filters);
  // eligible species, their megas, and formes that inherit their species' eligibility
  for (const eligible of [
    "hydreigon",
    "scovillainmega",
    "floetteeternal",
    "meowsticf",
    "aegislashblade",
    "polteageistantique",
  ]) {
    expect(result).toContain(eligible);
  }
  // species outside the game, their formes, and unevolved pokemon it leaves out
  for (const ineligible of ["clodsire", "gastrodoneast", "mewtwo", "ivysaur"]) {
    expect(result).not.toContain(ineligible);
  }
  expect(Object.keys(pokedex)).toEqual(expectedKeys);
  expect(filters).toEqual({ ...all, format: "Pokemon Champions (M-C)" });
});

test("unknown format and type filters return no species", () => {
  expect(filterPokemon({ ...all, format: "Unknown" })).toEqual([]);
  expect(filterPokemon({ ...all, region: "Unknown" })).toEqual([]);
  expect(filterPokemon({ ...all, type: "Unknown" })).toEqual([]);
});

test("each species and forme knows the generation it appeared in", () => {
  expect(introducedIn({ num: 1 })).toBe(1);
  expect(introducedIn({ num: 3, forme: "Mega" })).toBe(6);
  expect(introducedIn({ num: 383, forme: "Primal" })).toBe(6);
  expect(introducedIn({ num: 26, forme: "Alola" })).toBe(7);
  expect(introducedIn({ num: 52, forme: "Galar" })).toBe(8);
  expect(introducedIn({ num: 157, forme: "Hisui" })).toBe(8);
  expect(introducedIn({ num: 128, forme: "Paldea-Combat" })).toBe(9);
  expect(introducedIn({ num: 906 })).toBe(9);
  expect(introducedIn({ num: 251 })).toBe(2);
  expect(introducedIn({ num: 154, forme: "Mega", gen: 9 })).toBe(9);
});

test("megas skip gen 8 and Gigantamax formes exist only there", () => {
  expect(isInGeneration({ num: 3, forme: "Mega" }, 6)).toBe(true);
  expect(isInGeneration({ num: 3, forme: "Mega" }, 8)).toBe(false);
  expect(isInGeneration({ num: 3, forme: "Mega" }, 9)).toBe(true);
  expect(isInGeneration({ num: 3, forme: "Gmax" }, 8)).toBe(true);
  expect(isInGeneration({ num: 3, forme: "Gmax" }, 7)).toBe(false);
  expect(isInGeneration({ num: 3, forme: "Gmax" }, 9)).toBe(true);
  expect(isInGeneration({ num: 154, forme: "Mega", gen: 9 }, 7)).toBe(false);
});

test("a generation lists the pokemon that existed in it", () => {
  const filters = { format: "", region: "", type: "" };
  const gen1 = filterPokemon({ ...filters, generation: 1 });
  expect(gen1).toContain("mew");
  expect(gen1).not.toContain("chikorita");
  expect(gen1).not.toContain("venusaurmega");
  expect(gen1).not.toContain("raichualola");

  const gen6 = filterPokemon({ ...filters, generation: 6 });
  expect(gen6).toContain("diancie");
  expect(gen6).toContain("groudonprimal");
  expect(gen6).toContain("garchompmega");
  expect(gen6).not.toContain("garchompmegaz");
  expect(gen6).not.toContain("rowlet");
  expect(gen6).not.toContain("raichualola");

  const gen8 = filterPokemon({ ...filters, generation: 8 });
  expect(gen8).toContain("meowthgalar");
  expect(gen8).toContain("zoruahisui");
  expect(gen8).toContain("pikachugmax");
  expect(gen8).not.toContain("venusaurmega");
  expect(gen8).not.toContain("sprigatito");

  const gen9 = filterPokemon({ ...filters, generation: 9 });
  expect(gen9).toEqual(filterPokemon(filters));
});

test("the ability filter keeps pokemon with that ability, in any slot", () => {
  const filters = { format: "", region: "", type: "" };
  const levitate = filterPokemon({ ...filters, ability: "Levitate" });
  expect(levitate).toContain("bronzong");
  expect(levitate).toContain("rotom");
  expect(levitate).not.toContain("garchomp");
  expect(filterPokemon({ ...filters, ability: "Rough Skin" })).toContain(
    "garchomp",
  );
  expect(filterPokemon({ ...filters, ability: "Imaginary" })).toEqual([]);
});
