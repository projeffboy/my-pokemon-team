import { test, expect } from "@playwright/test";
import { sortPokemon, sortMoves } from "@/store/sorting";
import { english } from "@/i18n/translation";

test("moves default to name ascending, can reverse, and leave the learnset intact", () => {
  const moves = ["thunderpunch", "firepunch", "drainpunch", "icepunch"];
  expect(sortMoves(moves)).toEqual([
    "drainpunch",
    "firepunch",
    "icepunch",
    "thunderpunch",
  ]);
  expect(sortMoves(moves, { by: "name", descending: true })).toEqual([
    "thunderpunch",
    "icepunch",
    "firepunch",
    "drainpunch",
  ]);
  expect(moves).toEqual([
    "thunderpunch",
    "firepunch",
    "drainpunch",
    "icepunch",
  ]);
});

test("moves group by type in either direction, with name ties ascending", () => {
  const moves = [
    "firepunch",
    "thunderpunch",
    "drainpunch",
    "focuspunch",
    "icepunch",
  ];
  expect(sortMoves(moves, { by: "type", descending: false })).toEqual([
    "thunderpunch",
    "drainpunch",
    "focuspunch",
    "firepunch",
    "icepunch",
  ]);
  expect(sortMoves(moves, { by: "type", descending: true })).toEqual([
    "icepunch",
    "firepunch",
    "drainpunch",
    "focuspunch",
    "thunderpunch",
  ]);
});

test("move type sorting uses the selected generation", () => {
  const moves = ["bite", "ember", "watergun"];
  expect(sortMoves(moves, { by: "type", descending: false }, 1)).toEqual([
    "ember",
    "bite",
    "watergun",
  ]);
  expect(sortMoves(moves, { by: "type", descending: false }, 2)).toEqual([
    "bite",
    "ember",
    "watergun",
  ]);
});

test("move names and types sort by their translated labels", () => {
  const translation = {
    ...english,
    names: {
      ...english.names,
      move: (id: string) => ({ ember: "Z", watergun: "A" })[id] ?? id,
      type: (type: string) => ({ Fire: "A", Water: "Z" })[type] ?? type,
    },
  };
  expect(sortMoves(["ember", "watergun"], undefined, 9, translation)).toEqual([
    "watergun",
    "ember",
  ]);
  expect(
    sortMoves(
      ["ember", "watergun"],
      { by: "type", descending: false },
      9,
      translation,
    ),
  ).toEqual(["ember", "watergun"]);
});

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

test("format sorting uses the selected generation's tiers", () => {
  const ids = ["clefable", "gengar"];
  const sort = { by: "format", descending: false } as const;
  expect(sortPokemon(ids, sort, undefined, 1)).toEqual(["gengar", "clefable"]);
  expect(sortPokemon(ids, sort, undefined, 9)).toEqual(["clefable", "gengar"]);
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

test("MissingNo. and Pokestar pokemon come last in every sort but name", () => {
  const ids = ["missingno", "pokestarsmeargle", "bulbasaur"];
  for (const descending of [false, true]) {
    expect(sortPokemon(ids, { by: "num", descending })[0]).toBe("bulbasaur");
    expect(sortPokemon(ids, { by: "bst", descending })[0]).toBe("bulbasaur");
  }
  expect(sortPokemon(ids, { by: "name", descending: false })[0]).toBe(
    "bulbasaur",
  );
});
