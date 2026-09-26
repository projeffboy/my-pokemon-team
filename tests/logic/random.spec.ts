import { test, expect } from "@playwright/test";
import { pickRandom, randomPokemon, randomSet } from "@/store/random";
import { completeLearnset, learnsetsReady } from "@/store/learnsets";
import { pokemonAbilities } from "@/shared/pokedex";

test.beforeAll(() => learnsetsReady);

test("picks the option the random number lands on", () => {
  expect(pickRandom(["a", "b", "c"], () => 0.5)).toBe("b");
  expect(pickRandom(["a", "b", "c"], () => 0.99)).toBe("c");
  expect(pickRandom([], () => 0)).toBeUndefined();
});

test("prefers pokemon that are not on the team yet", () => {
  expect(randomPokemon(["lapras", "swampert"], ["lapras"], () => 0)).toBe(
    "swampert",
  );
  expect(randomPokemon(["lapras"], ["lapras"], () => 0)).toBe("lapras");
  expect(randomPokemon([], [], () => 0)).toBe("");
});

test("builds a set with an ability, the required item, and four different viable moves", () => {
  const set = randomSet("swampert", completeLearnset("swampert"));
  expect(pokemonAbilities("swampert")).toContain(set.ability);
  expect(set.item).toBe("");
  const moves = [set.move1, set.move2, set.move3, set.move4];
  expect(new Set(moves).size).toBe(4);
  for (const move of moves) {
    expect(completeLearnset("swampert")).toContain(move);
  }

  const mega = randomSet("swampertmega", completeLearnset("swampertmega"));
  expect(mega).toMatchObject({ item: "swampertite", ability: "Swift Swim" });
});

test("falls back to the whole learnset, and leaves moves blank when it runs out", () => {
  const set = randomSet("swampert", ["tackle", "growl"], () => 0);
  expect([set.move1, set.move2, set.move3, set.move4]).toEqual([
    "tackle",
    "growl",
    "",
    "",
  ]);
});
