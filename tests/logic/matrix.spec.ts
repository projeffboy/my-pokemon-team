import { test, expect } from "@playwright/test";
import {
  coverageMatrix,
  defenceMatrix,
  formatMultiplier,
} from "@/store/matrix";
import { createTeam } from "./shared/team";

test("formats multipliers like a type chart", () => {
  expect([4, 3, 2, 1.5, 1, 0.5, 0.25, 0].map(formatMultiplier)).toEqual([
    "×4",
    "×3",
    "×2",
    "×1.5",
    "",
    "½",
    "¼",
    "0",
  ]);
});

test("the defence matrix explains each slot's multiplier, including abilities and items", () => {
  const matrix = defenceMatrix(
    createTeam(
      { name: "bronzong", ability: "Levitate" },
      { name: "aggronmega", ability: "Filter" },
      { name: "heatran", item: "airballoon" },
    ),
  );
  expect(matrix.Ground[0]).toEqual({
    multiplier: 0,
    reason: "Ground does 0x to Bronzong (Steel/Psychic) with Levitate",
  });
  expect(matrix.Fire[0]).toEqual({
    multiplier: 2,
    reason: "Fire does 2x to Bronzong (Steel/Psychic)",
  });
  expect(matrix.Fighting[1]).toEqual({
    multiplier: 1.5,
    reason: "Fighting does 1.5x to Aggron-Mega (Steel) with Filter",
  });
  expect(matrix.Ground[2]).toEqual({
    multiplier: 2,
    reason: "Ground does 2x to Heatran (Fire/Steel) with Air Balloon",
  });
  expect(matrix.Water[2]?.multiplier).toBe(2);
  expect(matrix.Water[3]).toBeNull();
});

test("the coverage matrix picks each slot's best damaging move against a type", () => {
  const matrix = coverageMatrix(
    createTeam(
      { name: "excadrill", move1: "earthquake", move2: "ironhead" },
      { name: "hawlucha", move1: "flyingpress" },
      { name: "chansey", move1: "toxic" },
    ),
  );
  expect(matrix.Steel[0]).toEqual({
    multiplier: 2,
    reason: "Excadrill's Earthquake (Ground) does 2x to Steel",
  });
  expect(matrix.Flying[0]?.multiplier).toBe(1);
  expect(matrix.Fairy[0]).toEqual({
    multiplier: 2,
    reason: "Excadrill's Iron Head (Steel) does 2x to Fairy",
  });
  expect(matrix.Grass[1]).toEqual({
    multiplier: 2,
    reason: "Hawlucha's Flying Press (Fighting/Flying) does 2x to Grass",
  });
  expect(matrix.Ghost[1]?.multiplier).toBe(0);
  expect(matrix.Ice[1]?.multiplier).toBe(2);
  expect(matrix.Electric[1]?.multiplier).toBe(0.5);
  expect(matrix.Normal[2]).toEqual({
    multiplier: 1,
    reason: "Chansey has no damaging move",
  });
  expect(matrix.Normal[3]).toBeNull();
});
