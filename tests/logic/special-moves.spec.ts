import { test, expect } from "@playwright/test";
import type { PokemonType } from "@/types";
import { moveType, moveAgainstType } from "@/store/shared/effectiveness";

test.describe("move types", () => {
  const cases: [string, string, string, string][] = [
    ["return", "salamencemega", "Aerilate", "Flying"],
    ["hypervoice", "sylveon", "Pixilate", "Fairy"],
    ["return", "aurorus", "Refrigerate", "Ice"],
    ["return", "golemalola", "Galvanize", "Electric"],
    ["thunderbolt", "delcatty", "Normalize", "Normal"],
    ["moonblast", "sylveon", "Pixilate", "Fairy"],
    ["hypervoice", "primarina", "Liquid Voice", "Water"],
    ["moonblast", "primarina", "Liquid Voice", "Fairy"],
    ["judgment", "arceus", "Multitype", "Normal"],
    ["judgment", "arceuspoison", "Multitype", "Poison"],
    ["ivycudgel", "ogerpon", "Defiant", "Grass"],
    ["ivycudgel", "ogerponwellspring", "Water Absorb", "Water"],
    ["ivycudgel", "ogerponhearthflame", "Mold Breaker", "Fire"],
    ["ivycudgel", "ogerponcornerstone", "Sturdy", "Rock"],
    ["technoblast", "genesect", "Download", "Normal"],
    ["technoblast", "genesectdouse", "Download", "Water"],
    ["technoblast", "genesectshock", "Download", "Electric"],
    ["technoblast", "genesectburn", "Download", "Fire"],
    ["technoblast", "genesectchill", "Download", "Ice"],
    ["multiattack", "silvally", "RKS System", "Normal"],
    ["multiattack", "silvallyghost", "RKS System", "Ghost"],
    ["hiddenpowerfire", "unown", "Levitate", "Fire"],
  ];

  for (const [move, pokemon, ability, type] of cases) {
    test(`${pokemon} with ${ability} uses ${type}-type ${move}`, () => {
      expect(moveType(move, pokemon, ability)).toBe(type);
    });
  }

  test("unknown moves have no type", () => {
    expect(moveType("notamove", "unown")).toBeUndefined();
  });
});

test.describe("move effectiveness", () => {
  const cases: [string, PokemonType, string, number | undefined][] = [
    ["icebeam", "Water", "cryogonal", 1],
    ["freezedry", "Water", "cryogonal", -1],
    ["freezedry", "Grass", "cryogonal", -1],
    ["freezedry", "Fire", "cryogonal", 1],
    ["flyingpress", "Normal", "hawlucha", -1],
    ["flyingpress", "Grass", "hawlucha", -1],
    ["flyingpress", "Bug", "hawlucha", 0],
    ["flyingpress", "Rock", "hawlucha", 0],
    ["flyingpress", "Ghost", "hawlucha", 2],
    ["flyingpress", "Poison", "hawlucha", 1],
    ["machpunch", "Rock", "hitmonchan", -1],
    ["bulletseed", "Water", "cinccino", -1],
    ["grassknot", "Water", "simisage", -1],
    ["nuzzle", "Water", "togedemaru", undefined],
    ["swordsdance", "Rock", "zangoose", undefined],
    ["seismictoss", "Rock", "chansey", undefined],
    ["nightshade", "Psychic", "banette", undefined],
    ["notamove", "Water", "cryogonal", undefined],
  ];

  for (const [move, type, pokemon, score] of cases) {
    test(`${move} against ${type} scores ${score}`, () => {
      expect(moveAgainstType(move, type, pokemon)).toBe(score);
    });
  }

  test("effectiveness uses the ability's converted move type", () => {
    expect(moveAgainstType("hypervoice", "Dragon", "sylveon")).toBe(0);
    expect(moveAgainstType("hypervoice", "Dragon", "sylveon", "Pixilate")).toBe(
      -1,
    );
  });
});

test("unknown Silvally formes retain Multi-Attack's default type", () => {
  expect(moveType("multiattack", "silvallyunknown")).toBe("Normal");
});
