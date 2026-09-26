import { test, expect } from "@playwright/test";
import {
  collectViableMoves,
  flattenLearnsets,
  nameChanges,
  pick,
  projectFormats,
  projectTypeChart,
  projections,
  renderTypedData,
  type MoveSearch,
} from "../../scripts/update-data/transforms";

test("pick keeps only the listed fields and marks callbacks as present", () => {
  const entry = {
    name: "Low Kick",
    basePower: 0,
    basePowerCallback: () => 60,
    desc: "Long text the app never reads",
    status: undefined,
  };
  expect(
    pick<typeof entry>(entry, [
      "name",
      "basePower",
      "basePowerCallback",
      "status",
    ]),
  ).toEqual({
    name: "Low Kick",
    basePower: 0,
    basePowerCallback: true,
  });
});

test("cosmetic formes take their battle data from the base species", () => {
  const pokedex = {
    sinistea: {
      num: 854,
      name: "Sinistea",
      types: ["Ghost"],
      abilities: { 0: "Weak Armor", H: "Cursed Body" },
      otherFormes: ["Sinistea-Antique"],
      eggGroups: ["Mineral"],
    },
    sinisteaantique: {
      num: 854,
      name: "Sinistea-Antique",
      baseSpecies: "Sinistea",
      forme: "Antique",
      isCosmeticForme: true,
    },
  };
  expect(projections.Pokedex(pokedex.sinisteaantique, pokedex)).toEqual({
    num: 854,
    name: "Sinistea-Antique",
    types: ["Ghost"],
    baseSpecies: "Sinistea",
    forme: "Antique",
    abilities: { 0: "Weak Armor", H: "Cursed Body" },
  });
  expect(projections.Pokedex(pokedex.sinistea, pokedex)).toEqual({
    num: 854,
    name: "Sinistea",
    types: ["Ghost"],
    otherFormes: ["Sinistea-Antique"],
    abilities: { 0: "Weak Armor", H: "Cursed Body" },
  });
});

test("moves keep their secondary status chance and sound flag only", () => {
  expect(
    projections.Moves({
      name: "Nuzzle",
      type: "Electric",
      category: "Physical",
      basePower: 20,
      secondary: { chance: 100, status: "par", volatileStatus: "x" },
      flags: { contact: 1, protect: 1 },
      desc: "Paralyzes the target",
    }),
  ).toEqual({
    name: "Nuzzle",
    type: "Electric",
    category: "Physical",
    basePower: 20,
    secondary: { chance: 100, status: "par" },
  });
  expect(
    projections.Moves({
      name: "Boomburst",
      flags: { sound: 1, protect: 1 },
      secondary: null,
    }),
  ).toEqual({ name: "Boomburst", flags: { sound: 1 } });
});

test("formats mark champions legality, inherited through battle-only formes", () => {
  const pokedex = {
    kingambit: { name: "Kingambit" },
    kingambitmega: { name: "Kingambit-Mega", baseSpecies: "Kingambit" },
    dracovish: { name: "Dracovish" },
    zaciancrowned: { name: "Zacian-Crowned", battleOnly: "Zacian" },
    zacian: { name: "Zacian" },
    missingno: { name: "MissingNo." },
  };
  const formatsData = {
    kingambit: { tier: "OU", doublesTier: "DOU", natDexTier: "OU" },
    dracovish: { tier: "OU" },
    zacian: { tier: "Uber" },
    missingno: { isNonstandard: "Custom" },
  };
  const champions = {
    kingambit: { tier: "Champions" },
    dracovish: { tier: "Illegal" },
    zacian: { isNonstandard: "Past" },
  };
  expect(projectFormats(pokedex, formatsData, champions)).toEqual({
    kingambit: { tier: "OU", doublesTier: "DOU", champions: true },
    kingambitmega: { champions: true },
    dracovish: { tier: "OU" },
    zacian: { tier: "Uber" },
  });
});

test("learnsets merge every mod into one sorted move list per species", () => {
  const flattened = flattenLearnsets(
    {
      meganium: { learnset: { solarbeam: ["9M"], earthquake: ["9M"] } },
      unown: {},
    },
    [
      {
        meganium: { learnset: { dazzlinggleam: ["9L1"], solarbeam: ["9L1"] } },
      },
      { ursaluna: { learnset: { headlongrush: ["8L1"] } } },
    ],
  );
  expect(flattened).toEqual({
    meganium: ["dazzlinggleam", "earthquake", "solarbeam"],
    unown: [],
    ursaluna: ["headlongrush"],
  });
});

test("viable moves are judged per forme, with base species moves, items, and hidden powers", () => {
  const judged: string[] = [];
  const search: MoveSearch = {
    moveIsNotUseless(move, species, _moves, set) {
      judged.push(`${species.id}:${set.ability}:${set.item}:${move}`);
      return move === "technoblast" ?
          set.item === "Douse Drive"
        : move === "hiddenpowerfire";
    },
  };
  const viable = collectViableMoves(
    {
      genesect: { name: "Genesect", abilities: { 0: "Download" } },
      genesectdouse: {
        name: "Genesect-Douse",
        baseSpecies: "Genesect",
        abilities: { 0: "Download" },
        requiredItem: "Douse Drive",
      },
      genesectchill: {
        name: "Genesect-Chill",
        baseSpecies: "Genesect",
        forme: "Chill",
        isCosmeticForme: true,
      },
    },
    { genesect: ["hiddenpower", "technoblast"], genesectdouse: ["magnetbomb"] },
    ["hiddenpowerfire", "hiddenpowerice"],
    [search],
  );
  expect(viable).toEqual(["hiddenpowerfire", "technoblast"]);
  expect(judged).toEqual([
    "genesect:Download::hiddenpower",
    "genesect:Download::technoblast",
    "genesect:Download::hiddenpowerfire",
    "genesect:Download::hiddenpowerice",
    "genesectdouse:Download::magnetbomb",
    "genesectdouse:Download::hiddenpower",
    "genesectdouse:Download::technoblast",
    "genesectdouse:Download::hiddenpowerfire",
    "genesectdouse:Download::hiddenpowerice",
    "genesectdouse:Download:Douse Drive:magnetbomb",
    "genesectdouse:Download:Douse Drive:hiddenpower",
    "genesectdouse:Download:Douse Drive:technoblast",
    "genesectdouse:Download:Douse Drive:hiddenpowerfire",
    "genesectdouse:Download:Douse Drive:hiddenpowerice",
  ]);
});

test("the type chart converts Showdown's damage codes and drops Stellar", () => {
  const damageTaken = Object.fromEntries(
    [
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
      "Stellar",
    ].map(type => [type, 0]),
  );
  const typeChart: Record<string, { damageTaken: Record<string, number> }> =
    Object.fromEntries(
      Object.keys(damageTaken).map(type => [
        type.toLowerCase(),
        { damageTaken: { ...damageTaken, prankster: 3 } },
      ]),
    );
  typeChart.ghost = {
    damageTaken: {
      ...damageTaken,
      Normal: 3,
      Fighting: 3,
      Ghost: 1,
      Dark: 1,
      Bug: 2,
      Poison: 2,
      trapped: 3,
    },
  };
  const projected = projectTypeChart(typeChart);
  expect(Object.keys(projected)).toHaveLength(18);
  expect(projected.Ghost).toEqual({
    Bug: 1,
    Dark: -1,
    Dragon: 0,
    Electric: 0,
    Fairy: 0,
    Fighting: 2,
    Fire: 0,
    Flying: 0,
    Ghost: -1,
    Grass: 0,
    Ground: 0,
    Ice: 0,
    Normal: 2,
    Poison: 1,
    Psychic: 0,
    Rock: 0,
    Steel: 0,
    Water: 0,
    trapped: 2,
  });
  expect(projected.Fire).not.toHaveProperty("Stellar");
  expect(projected.Fire.prankster).toBe(2);
});

test("name changes report renames through aliases and removals", () => {
  const before = {
    pokedex: {
      raticatealolatotem: { name: "Raticate-Alola-Totem" },
      pikachu: { name: "Pikachu" },
      syclant: { name: "Syclant" },
    },
    moves: { hiddenpower: { name: "Hidden Power" } },
  };
  const after = {
    pokedex: {
      raticatealolatotem: { name: "Raticate-Alola-Totem" },
      pikachu: { name: "Pikachu" },
    },
    moves: { hiddenpower: { name: "Hidden Power" } },
  };
  expect(nameChanges(before, after, {})).toEqual([
    "  pokedex: Syclant was removed",
  ]);
  expect(
    nameChanges(
      { pokedex: { basculegion: { name: "Basculegion" } } },
      { pokedex: { basculegion: { name: "Basculegion-M" } } },
      {},
    ),
  ).toEqual(["  pokedex: Basculegion is now Basculegion-M"]);
  expect(
    nameChanges(
      { items: { pokemonboxlink: { name: "Pokemon Box Link" } } },
      { items: { pokeball: { name: "Poke Ball" } } },
      { pokemonboxlink: "Poke Ball" },
    ),
  ).toEqual(["  items: Pokemon Box Link is now Poke Ball"]);
});

test("rendered data files import their type and can list one entry per line", () => {
  expect(renderTypedData("Items", { leftovers: { name: "Leftovers" } }, true))
    .toBe(`import type { Items } from "../types";

const data: Items = {
  "leftovers": {"name":"Leftovers"},
};

export default data;
`);
  expect(renderTypedData("Learnsets", { unown: ["hiddenpower"] })).toContain(
    'const data: Learnsets = {\n  "unown": [\n    "hiddenpower"\n  ]\n};',
  );
});

test("pokedex entries keep their base stats and fixed gender", () => {
  const entry = {
    num: 445,
    name: "Garchomp",
    types: ["Dragon", "Ground"],
    baseStats: { hp: 108, atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
    abilities: { 0: "Sand Veil", H: "Rough Skin" },
    heightm: 1.9,
    weightkg: 95,
    genderRatio: { M: 0.5, F: 0.5 },
    eggGroups: ["Monster", "Dragon"],
  };
  expect(projections.Pokedex(entry, { garchomp: entry })).toEqual({
    num: 445,
    name: "Garchomp",
    types: ["Dragon", "Ground"],
    baseStats: { hp: 108, atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
    abilities: { 0: "Sand Veil", H: "Rough Skin" },
  });
  const genderless = { num: 81, name: "Magnemite", gender: "N", gen: 9 };
  expect(projections.Pokedex(genderless, { magnemite: genderless })).toEqual(
    genderless,
  );
});

test("natures keep their name and stat changes", () => {
  expect(
    projections.Natures({ name: "Jolly", plus: "spe", minus: "spa" }),
  ).toEqual({ name: "Jolly", plus: "spe", minus: "spa" });
  expect(projections.Natures({ name: "Hardy" })).toEqual({ name: "Hardy" });
});
