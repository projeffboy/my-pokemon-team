import { test, expect } from "@playwright/test";
import { sortPokemon } from "@/store/sorting";

test("sorts by name in either direction, ignoring case", () => {
  const ids = ["absol", "abra", "abomasnow"];
  expect(sortPokemon(ids, { by: "name", descending: false })).toEqual([
    "abomasnow",
    "abra",
    "absol",
  ]);
  expect(sortPokemon(ids, { by: "name", descending: true })).toEqual([
    "absol",
    "abra",
    "abomasnow",
  ]);
  expect(ids).toEqual(["absol", "abra", "abomasnow"]);
});

test("sorts by pokedex number with formes after their species", () => {
  const ids = ["venusaurmega", "mew", "venusaur", "chikorita", "bulbasaur"];
  expect(sortPokemon(ids, { by: "num", descending: false })).toEqual([
    "bulbasaur",
    "venusaur",
    "venusaurmega",
    "mew",
    "chikorita",
  ]);
  expect(sortPokemon(ids, { by: "num", descending: true })).toEqual([
    "chikorita",
    "mew",
    "venusaur",
    "venusaurmega",
    "bulbasaur",
  ]);
});

test("sorts by format from the top tier down, with untiered formes last", () => {
  const ids = ["bulbasaur", "venusaurmega", "koraidon", "ivysaur"];
  expect(sortPokemon(ids, { by: "format", descending: false })).toEqual([
    "koraidon",
    "ivysaur",
    "bulbasaur",
    "venusaurmega",
  ]);
});

test("sorts by base stat total and by single stats", () => {
  const ids = ["shuckle", "arceus", "magikarp"];
  expect(sortPokemon(ids, { by: "bst", descending: false })).toEqual([
    "magikarp",
    "shuckle",
    "arceus",
  ]);
  expect(sortPokemon(ids, { by: "bst", descending: true })).toEqual([
    "arceus",
    "shuckle",
    "magikarp",
  ]);
  expect(
    sortPokemon(["deoxysspeed", "shuckle", "blissey"], {
      by: "spe",
      descending: false,
    }),
  ).toEqual(["shuckle", "blissey", "deoxysspeed"]);
  expect(
    sortPokemon(["shuckle", "blissey", "magikarp"], {
      by: "hp",
      descending: true,
    }),
  ).toEqual(["blissey", "magikarp", "shuckle"]);
});

test("breaks ties by name whichever way the values are sorted", () => {
  const ids = ["venusaurmega", "venusaur"];
  for (const descending of [false, true]) {
    expect(sortPokemon(ids, { by: "num", descending })).toEqual([
      "venusaur",
      "venusaurmega",
    ]);
  }
});
