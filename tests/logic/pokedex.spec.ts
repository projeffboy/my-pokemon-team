import { test, expect } from "@playwright/test";
import pokedex from "@/data/pokedex";

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
