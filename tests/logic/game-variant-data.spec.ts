import { test, expect } from "@playwright/test";
import { moveDataIn } from "@/shared/generation-data";
import { pokemonBaseStats } from "@/shared/pokedex";
import {
  CHAMPIONS_FORMAT,
  LETS_GO,
  LEGENDS_ARCEUS,
  LEGENDS_ZA,
} from "@/shared/game-variants";
import { calculateTypeCoverage } from "@/store/coverage";
import { coverageMatrix } from "@/store/matrix";
import { sortMoves, sortPokemon } from "@/store/sorting";
import { createTeam } from "./shared/team";

test("Let's Go Absorb has its native power and adds coverage", () => {
  expect(moveDataIn("absorb", 7)?.basePower).toBe(20);
  expect(moveDataIn("absorb", 7, LETS_GO)?.basePower).toBe(40);
  const team = createTeam({ name: "oddish", move1: "absorb" });
  expect(calculateTypeCoverage(team, 7).Water).toBe(0);
  expect(calculateTypeCoverage(team, 7, LETS_GO).Water).toBe(2);
  expect(
    coverageMatrix(team, undefined, 7, LETS_GO).Water?.[0]?.multiplier,
  ).toBe(2);
});

test("Pokemon Champions uses its own move changes without changing ordinary Gen 9", () => {
  expect(moveDataIn("appleacid", 9)?.basePower).toBe(80);
  expect(moveDataIn("appleacid", 9, CHAMPIONS_FORMAT)?.basePower).toBe(90);
  expect(moveDataIn("freezedry", 9)?.secondary?.chance).toBe(10);
  expect(
    moveDataIn("freezedry", 9, CHAMPIONS_FORMAT)?.secondary,
  ).toBeUndefined();
  expect(moveDataIn("earthquake", 9, CHAMPIONS_FORMAT)).toBe(
    moveDataIn("earthquake", 9),
  );
});

test("Pokemon Champions sorts Snap Trap by its Steel type", () => {
  const moves = ["snaptrap", "psychic"];
  const sort = { by: "type", descending: false } as const;
  expect(sortMoves(moves, sort, 9)).toEqual(["snaptrap", "psychic"]);
  expect(sortMoves(moves, sort, 9, undefined, CHAMPIONS_FORMAT)).toEqual([
    "psychic",
    "snaptrap",
  ]);
});

test("Legends Z-A uses its Mega evolution base stats without changing ordinary Gen 9", () => {
  expect(pokemonBaseStats("starmiemega", 9)?.atk).toBe(100);
  expect(pokemonBaseStats("starmiemega", 9, LEGENDS_ZA)?.atk).toBe(140);
  expect(pokemonBaseStats("mawilemega", 9, LEGENDS_ZA)?.atk).toBe(147);
  expect(pokemonBaseStats("medichammega", 9, LEGENDS_ZA)?.atk).toBe(140);
  const pokemon = ["mawilemega", "dragonite"];
  const sort = { by: "atk", descending: true } as const;
  expect(sortPokemon(pokemon, sort)).toEqual(["dragonite", "mawilemega"]);
  expect(sortPokemon(pokemon, sort, undefined, 9, LEGENDS_ZA)).toEqual([
    "mawilemega",
    "dragonite",
  ]);
});

test("Cherrim Sunshine's boosted stats are native to Legends Arceus", () => {
  expect(pokemonBaseStats("cherrimsunshine", 8)?.atk).toBe(60);
  expect(pokemonBaseStats("cherrimsunshine", 8, LEGENDS_ARCEUS)?.atk).toBe(90);
  expect(pokemonBaseStats("cherrimsunshine", 8, LEGENDS_ARCEUS)?.spd).toBe(117);
  expect(pokemonBaseStats("cherrim", 8, LEGENDS_ARCEUS)?.atk).toBe(60);
});
