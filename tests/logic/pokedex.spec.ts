import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";
import { pokemonAbilities, pokemonBaseStats } from "@/shared/pokedex";

test("historical base stats follow the selected generation", () => {
  expect(pokemonBaseStats("pidgeot", 1)?.spe).toBe(91);
  expect(pokemonBaseStats("pidgeot", 5)?.spe).toBe(91);
  expect(pokemonBaseStats("pidgeot", 6)?.spe).toBe(101);
  expect(pokemonBaseStats("pidgeot")?.spe).toBe(101);
  expect(pokemonBaseStats("charizard", 1)?.spa).toBe(85);
  expect(pokemonBaseStats("charizard", 1)?.spd).toBe(85);
  expect(pokemonBaseStats("charizard", 2)?.spa).toBe(109);
  expect(pokemonBaseStats("charizard", 2)?.spd).toBe(85);
  expect(pokemonBaseStats("missing" as string, 1)).toBeUndefined();
});

test("historical abilities exclude future and hidden abilities", () => {
  expect(pokemonAbilities("pidgeot", 1)).toEqual([]);
  expect(pokemonAbilities("pidgeot", 2)).toEqual([]);
  expect(pokemonAbilities("pidgeot", 3)).toEqual(["Keen Eye"]);
  expect(pokemonAbilities("pidgeot", 4)).toEqual(["Keen Eye", "Tangled Feet"]);
  expect(pokemonAbilities("pidgeot", 5)).toEqual([
    "Keen Eye",
    "Tangled Feet",
    "Big Pecks",
  ]);
  expect(pokemonAbilities("gengar", 6)).toEqual(["Levitate"]);
  expect(pokemonAbilities("gengar", 7)).toEqual(["Cursed Body"]);
});

test("every Vivillon pattern has its abilities and Bug/Flying typing", () => {
  const patterns = Object.values(pokedex).filter(
    entry => entry.name === "Vivillon" || entry.baseSpecies === "Vivillon",
  );
  expect(patterns).toHaveLength(20);
  for (const pattern of patterns) {
    expect(pattern.abilities, pattern.name).toEqual({
      0: "Shield Dust",
      1: "Compound Eyes",
      H: "Friend Guard",
    });
    expect(pattern.types, pattern.name).toEqual(["Bug", "Flying"]);
    expect(pattern.num, pattern.name).toBe(666);
  }
  expect(pokedex.vivillongarden).toMatchObject({
    name: "Vivillon-Garden",
    baseSpecies: "Vivillon",
    forme: "Garden",
    prevo: "Spewpa",
  });
  expect(pokedex.vivillongarden?.otherFormes).toBeUndefined();
});

test("other cosmetic formes inherit their species' battle data", () => {
  expect(pokedex.gastrodoneast).toMatchObject({
    name: "Gastrodon-East",
    num: 423,
    types: ["Water", "Ground"],
    abilities: { 0: "Sticky Hold", 1: "Storm Drain", H: "Sand Force" },
    prevo: "Shellos",
  });
  expect(pokedex.miniorviolet).toMatchObject({
    name: "Minior-Violet",
    num: 774,
    types: ["Rock", "Flying"],
    abilities: { 0: "Shields Down" },
  });
});

test("non-cosmetic formes keep their distinct abilities and types", () => {
  expect(pokedex.slowkinggalar).toMatchObject({
    types: ["Poison", "Psychic"],
    abilities: { 0: "Curious Medicine", 1: "Own Tempo", H: "Regenerator" },
    prevo: "Slowpoke-Galar",
  });
});
