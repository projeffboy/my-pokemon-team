import { test, expect } from "@playwright/test";
import {
  RANDOM_ITEMS,
  completeSet,
  isSetComplete,
  pickRandom,
  randomPokemon,
  randomSet,
  randomizedFieldsMessage,
  randomizeSlotLabel,
} from "@/store/random";
import {
  completeLearnset,
  generationLearnset,
  learnsetsReady,
} from "@/store/learnsets";
import { pokemonAbilities } from "@/shared/pokedex";
import { createTeam } from "./shared/team";
import { loadTranslation } from "@/i18n/translation";
import { baseMoveId } from "@/shared/moves";

test("random notifications name only the moves, item and ability that changed", () => {
  const before = createTeam({
    name: "vileplume",
    item: "leftovers",
    ability: "Chlorophyll",
    move1: "gigadrain",
  })[0];
  if (!before) throw new Error("Missing pokemon");
  const cases = [
    [1, "moves"],
    [2, "item"],
    [3, "moves and item"],
    [4, "ability"],
    [5, "moves and ability"],
    [6, "item and ability"],
    [7, "moves, item, and ability"],
  ] as const;
  for (const [mask, fields] of cases) {
    const after = {
      ...before,
      move2: mask & 1 ? "sludgebomb" : before.move2,
      item: mask & 2 ? "lifeorb" : before.item,
      ability: mask & 4 ? "Effect Spore" : before.ability,
    };
    expect(randomizedFieldsMessage(before, after)).toBe(
      `Randomized pokemon's ${fields}`,
    );
  }
  expect(randomizedFieldsMessage(before, before)).toBeUndefined();
});

test("random notification lists follow the current language", async () => {
  const before = createTeam({ name: "vileplume" })[0];
  if (!before) throw new Error("Missing pokemon");
  const translation = await loadTranslation("fr");
  const after = { ...before, item: "lifeorb", ability: "Chlorophyll" };
  expect(randomizedFieldsMessage(before, after, translation)).toBe(
    translation.t.team.randomizedPokemonDetails(
      `${translation.t.team.item} et ${translation.t.team.ability}`,
    ),
  );
});

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

test("Hidden Power has one draw chance regardless of its number of types", () => {
  const ordinary = ["surf", "icebeam", "earthquake", "protect"];
  for (const hiddenPower of [
    ["hiddenpowerice"],
    completeLearnset("unown").filter(move => move.startsWith("hiddenpower")),
  ]) {
    const counts = new Map<string, number>();
    for (let i = 0; i < 100; i++) {
      let draw = 0;
      const set = randomSet(
        "quagsire",
        [...ordinary, ...hiddenPower],
        () => (draw++ === 0 ? (i + 0.5) / 100 : 0),
        3,
      );
      const id = baseMoveId(set.move1);
      counts.set(id, (counts.get(id) ?? 0) + 1);
      const moves = [set.move1, set.move2, set.move3, set.move4];
      expect(new Set(moves.map(baseMoveId)).size).toBe(4);
      expect(moves).not.toContain("hiddenpower");
    }
    expect([...counts.values()]).toEqual([20, 20, 20, 20, 20]);
  }
});

test("typed variants do not make a short viable pool count as four moves", () => {
  const set = randomSet(
    "unown",
    [
      "growl",
      "hiddenpowerice",
      "hiddenpowerfire",
      "hiddenpowergrass",
      "hiddenpowerghost",
    ],
    () => 0,
    2,
  );
  expect([set.move1, set.move2, set.move3, set.move4]).toEqual([
    "growl",
    "hiddenpowerice",
    "",
    "",
  ]);
  const unown = randomSet("unown", completeLearnset("unown"), () => 0, 2);
  expect([unown.move2, unown.move3, unown.move4]).toEqual(["", "", ""]);
  expect(isSetComplete(unown, 2)).toBe(true);
});

test("completion retains the first move and replaces exact and Hidden Power duplicates", () => {
  const member = createTeam({
    name: "bellossom",
    move1: "hiddenpowerice",
    move2: "hiddenpowerfire",
    move3: "gigadrain",
    move4: "gigadrain",
  })[0];
  if (!member) throw new Error("Missing pokemon");
  expect(
    isSetComplete({ ...member, item: "leftovers", ability: "Chlorophyll" }, 3),
  ).toBe(false);
  const set = completeSet(
    member,
    generationLearnset("bellossom", 3),
    () => 0,
    3,
  );
  expect(set.move1).toBe("hiddenpowerice");
  expect(set.move3).toBe("gigadrain");
  expect(
    new Set([set.move1, set.move2, set.move3, set.move4].map(baseMoveId)).size,
  ).toBe(4);
  expect(member.move2).toBe("hiddenpowerfire");
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

test("random tooltips describe missing fields, or a new pokemon for empty and complete slots", () => {
  const complete = createTeam({
    name: "relicanth",
    item: "leftovers",
    ability: "Rock Head",
    move1: "surf",
    move2: "icebeam",
    move3: "rockslide",
    move4: "earthquake",
  })[0];
  if (!complete) throw new Error("Missing pokemon");
  expect(randomizeSlotLabel(complete)).toBe("Randomize pokemon");
  expect(randomizeSlotLabel({ ...complete, name: "" })).toBe(
    "Randomize pokemon",
  );
  for (const [mask, fields] of [
    [1, "moves"],
    [2, "item"],
    [3, "moves and item"],
    [4, "ability"],
    [5, "moves and ability"],
    [6, "item and ability"],
    [7, "moves, item, and ability"],
  ] as const) {
    expect(
      randomizeSlotLabel({
        ...complete,
        move4: mask & 1 ? "" : complete.move4,
        item: mask & 2 ? "" : complete.item,
        ability: mask & 4 ? "" : complete.ability,
      }),
    ).toBe(`Randomize ${fields}`);
  }
});
