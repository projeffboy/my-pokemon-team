import { test, expect } from "@playwright/test";
import { typeAgainstPokemon } from "@/store/shared/effectiveness";

// Defence scores: -2 = 4x, -1 = 2x, 0 = 1x, 1 = 0.5x, 2 = 0.25x, 3 = immune.
test.describe("type effectiveness", () => {
  const cases: [string, string, number][] = [
    ["Water", "mudsdale", -1],
    ["Rock", "mudsdale", 1],
    ["Fire", "mudsdale", 0],
    ["Electric", "mudsdale", 3],
    ["Fire", "frosmoth", -2],
    ["Grass", "frosmoth", 1],
    ["Grass", "leavanny", 2],
    ["Fighting", "frosmoth", 0],
    ["Ground", "emolga", 3],
    ["Poison", "mawile", 3],
  ];

  for (const [type, pokemon, score] of cases) {
    test(`${type} against ${pokemon} scores ${score}`, () => {
      expect(typeAgainstPokemon(type, pokemon)).toBe(score);
    });
  }

  const immunityCases = [
    ["Electric", "lanturn", "Volt Absorb"],
    ["Electric", "seaking", "Lightning Rod"],
    ["Electric", "electivire", "Motor Drive"],
    ["Fire", "heatmor", "Flash Fire"],
    ["Fire", "dachsbun", "Well-Baked Body"],
    ["Grass", "gogoat", "Sap Sipper"],
    ["Ground", "bronzong", "Levitate"],
    ["Ground", "eelektrossmega", "Eelevate"],
    ["Ground", "orthworm", "Earth Eater"],
    ["Water", "cacturne", "Water Absorb"],
    ["Water", "cradily", "Storm Drain"],
  ];

  for (const [type, pokemon, ability] of immunityCases) {
    test(`${ability} grants ${type} immunity`, () => {
      expect(typeAgainstPokemon(type, pokemon)).not.toBe(3);
      expect(typeAgainstPokemon(type, pokemon, ability)).toBe(3);
      expect(typeAgainstPokemon("Normal", pokemon, ability)).toBe(
        typeAgainstPokemon("Normal", pokemon),
      );
    });
  }

  const abilityCases: [string, string, string, number][] = [
    ["Fire", "araquanid", "Water Bubble", 1],
    ["Fire", "walrein", "Thick Fat", 1],
    ["Ice", "hariyama", "Thick Fat", 1],
    ["Fire", "bronzong", "Heatproof", 0],
    ["Fire", "dubwool", "Fluffy", -1],
    ["Fire", "parasect", "Dry Skin", -3],
    ["Water", "parasect", "Dry Skin", 3],
    ["Ghost", "garganacl", "Purifying Salt", 1],
    ["Rock", "camerupt", "Solid Rock", 0],
    ["Ground", "camerupt", "Solid Rock", -0.5],
    ["Water", "camerupt", "Solid Rock", -1.5],
    ["Fighting", "aggronmega", "Filter", -0.5],
    ["Ground", "necrozmaduskmane", "Prism Armor", -0.5],
    ["Water", "shedinja", "Wonder Guard", 3],
    ["Grass", "shedinja", "Wonder Guard", 3],
    ["Fire", "shedinja", "Wonder Guard", -1],
  ];

  for (const [type, pokemon, ability, score] of abilityCases) {
    test(`${ability}: ${type} against ${pokemon} scores ${score}`, () => {
      expect(typeAgainstPokemon(type, pokemon, ability)).toBe(score);
    });
  }

  test("Air Balloon adds one Ground defence point without changing immunity", () => {
    expect(typeAgainstPokemon("Ground", "toxtricity", "", "airballoon")).toBe(-1);
    expect(typeAgainstPokemon("Ground", "bronzong", "Levitate", "airballoon")).toBe(3);
    expect(typeAgainstPokemon("Fire", "toxtricity", "", "airballoon")).toBe(0);
  });

  test("empty or unknown species have neutral effectiveness", () => {
    expect(typeAgainstPokemon("Water", "")).toBe(0);
    expect(typeAgainstPokemon("Water", "notapokemon")).toBe(0);
  });

});
