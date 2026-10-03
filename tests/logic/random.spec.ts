import { test, expect } from "@playwright/test";
import {
  RANDOM_ITEMS,
  completeSet,
  isSetComplete,
  pickRandom,
  randomPokemon,
  randomSet,
} from "@/store/random";
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

test("skips pokemon that learn no moves while others remain", () => {
  expect(completeLearnset("pokestarufo")).toEqual([]);
  for (const random of [() => 0, () => 0.99]) {
    expect(randomPokemon(["pokestarufo", "lapras"], [], random)).toBe("lapras");
  }
  expect(randomPokemon(["pokestarufo"], [], () => 0)).toBe("pokestarufo");
  expect(randomPokemon(["pokestarufo", "ditto"], [], () => 0)).toBe("ditto");
});

test("builds a set with an ability, an item, and four different viable moves", () => {
  const set = randomSet("swampert", completeLearnset("swampert"));
  expect(pokemonAbilities("swampert")).toContain(set.ability);
  expect(RANDOM_ITEMS).toContain(set.item);
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

test("completes a set by filling only its empty fields, keeping its details", () => {
  const member = {
    name: "swampert",
    item: "leftovers",
    ability: "",
    move1: "earthquake",
    move2: "",
    move3: "icebeam",
    move4: "",
    nickname: "Swampy",
  };
  expect(isSetComplete(member)).toBe(false);
  const set = completeSet(member, completeLearnset("swampert"));
  expect(set).toMatchObject({
    name: "swampert",
    item: "leftovers",
    move1: "earthquake",
    move3: "icebeam",
    nickname: "Swampy",
  });
  expect(pokemonAbilities("swampert")).toContain(set.ability);
  const moves = [set.move1, set.move2, set.move3, set.move4];
  expect(new Set(moves).size).toBe(4);
  expect(isSetComplete(set)).toBe(true);
  expect(isSetComplete({ ...set, item: "" })).toBe(false);
  expect(completeSet({ ...set, item: "" }, [])).toMatchObject({
    ...set,
    item: expect.stringMatching(/./),
  });
});
