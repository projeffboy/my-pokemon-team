import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import { filterPokemon } from "@/store/filtering";

const all = { format: "", region: "", type: "" };

test("empty filters preserve Pokedex order and return an independent list", () => {
  const expected = Object.keys(pokedex);
  const result = filterPokemon(Object.freeze({ ...all }));
  expect(result).toEqual(expected);
  result.pop();
  expect(filterPokemon(all)).toEqual(expected);
});

test("type filtering includes either type of a dual-type species", () => {
  const psychic = filterPokemon({ ...all, type: "Psychic" });
  expect(psychic).toContain("espurr");
  expect(psychic).toContain("medicham");
  expect(psychic).not.toContain("milotic");
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

test("Kanto excludes Alolan and Galarian formes", () => {
  const result = filterPokemon({ ...all, region: "Kanto" });
  expect(result).not.toContain("rattataalola");
  expect(result).not.toContain("ponytagalar");
});

test("Hisui includes the origin formes", () => {
  const result = filterPokemon({ ...all, region: "Hisui" });
  expect(result).toEqual(expect.arrayContaining(["dialgaorigin", "palkiaorigin"]));
});

test("singles formats include lower tiers in tier order", () => {
  const result = filterPokemon({ ...all, format: "OU: Over Used" });
  expect(result).toEqual(expect.arrayContaining(["tinglu", "milotic", "dreepy"]));
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
  expect(filterPokemon({
    format: "Little Cup (LC)", region: "Kalos", type: "Poison",
  })).toEqual(["skrelp"]);
});

test("Battle Stadium exclusions do not mutate the source Pokedex or filters", () => {
  const expectedKeys = Object.keys(pokedex);
  const filters = Object.freeze({ ...all, format: "Battle Stadium Singles" });
  const result = filterPokemon(filters);
  expect(result).not.toContain("zekrom");
  expect(result).not.toContain("xerneas");
  expect(result).toContain("terrakion");
  expect(Object.keys(pokedex)).toEqual(expectedKeys);
  expect(filters).toEqual({ ...all, format: "Battle Stadium Singles" });
});

test("unknown format and type filters return no species", () => {
  expect(filterPokemon({ ...all, format: "Unknown" })).toEqual([]);
  expect(filterPokemon({ ...all, region: "Unknown" })).toEqual([]);
  expect(filterPokemon({ ...all, type: "Unknown" })).toEqual([]);
});
