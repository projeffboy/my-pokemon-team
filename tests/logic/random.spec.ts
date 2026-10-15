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
  availablePokemon,
  completeLearnset,
  generationLearnset,
  learnsetsReady,
} from "@/store/learnsets";
import { filterPokemon } from "@/store/filtering";
import { validateTeam } from "@/store/validation";
import { CAP_FORMAT } from "@/shared/formats";
import { COMBINED_GENERATIONS_FORMAT } from "@/shared/generation-profile";
import { pokemonAbilities } from "@/shared/pokedex";
import { createTeam } from "./shared/team";
import { english, loadTranslation } from "@/i18n/translation";
import { hiddenPowerType } from "@/shared/hidden-power";
import {
  dvGender,
  gen2Dvs,
  isShinyInGeneration,
} from "@/shared/generation-rules";
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

test("prefers a species that is not on the team yet, then another forme", () => {
  const options = ["tyranitar", "tyranitarmega", "volcarona"];
  for (const random of [() => 0, () => 0.99]) {
    expect(randomPokemon(options, ["tyranitarmega"], random)).toBe("volcarona");
    expect(randomPokemon(options, ["tyranitar"], random)).toBe("volcarona");
  }
  expect(randomPokemon(options, ["tyranitar", "volcarona"], () => 0)).toBe(
    "tyranitarmega",
  );
});

test("a random item is one no teammate holds, while any remain", () => {
  const taken = RANDOM_ITEMS.slice(1);
  for (const random of [() => 0, () => 0.5, () => 0.99]) {
    expect(
      randomSet("lapras", completeLearnset("lapras"), random, 9, "", taken)
        .item,
    ).toBe(RANDOM_ITEMS[0]);
  }
  expect(
    RANDOM_ITEMS.includes(
      randomSet("lapras", completeLearnset("lapras"), () => 0, 9, "", [
        ...RANDOM_ITEMS,
      ]).item,
    ),
  ).toBe(true);
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

test("Gen 2 random completion keeps shiny and gender when choosing Hidden Power", () => {
  const member = createTeam({
    name: "gyarados",
    shiny: true,
    item: "leftovers",
    move1: "surf",
    move2: "return",
    move3: "rest",
  })[0]!;
  for (const roll of [0, 0.5, 0.96]) {
    const set = completeSet(
      member,
      generationLearnset(member.name, 2),
      () => roll,
      2,
    );
    expect(set.shiny).toBe(true);
    expect(isShinyInGeneration(set, 2)).toBe(true);
    expect(dvGender(gen2Dvs(set))).toBe(dvGender(gen2Dvs(member)));
    expect(set).toMatchObject({
      item: "leftovers",
      move1: "surf",
      move2: "return",
      move3: "rest",
    });
    if (set.move4.startsWith("hiddenpower"))
      expect(set.move4).toBe(`hiddenpower${hiddenPowerType(set, 2)}`);
  }
  const incompatible = completeSet(member, ["hiddenpowerwater"], () => 0, 2);
  expect(incompatible.move4).toBe("");
  expect(incompatible.shiny).toBe(true);
});

test("random completion preserves explicit IVs and avoids incompatible Hidden Power", () => {
  const member = createTeam({
    name: "ampharos",
    item: "leftovers",
    ability: "Static",
    ivs: { atk: 0, def: 30 },
    move1: "thunderbolt",
    move2: "thunderwave",
    move3: "rest",
  })[0]!;
  const type = hiddenPowerType(member, 3);
  const set = completeSet(
    member,
    [`hiddenpower${type}`, "hiddenpowerfire", "hiddenpowerwater"],
    () => 0.99,
    3,
  );
  expect(set.ivs).toEqual(member.ivs);
  expect(set.move4).toBe(`hiddenpower${type}`);
  expect(member.ivs).toEqual({ atk: 0, def: 30 });
});

test("random completion prefers historically viable moves before its whole-learnset fallback", () => {
  const set = randomSet(
    "scizor",
    ["hiddenpowerbug", "swordsdance", "agility", "batonpass", "falseswipe"],
    () => 0.99,
    3,
  );
  const moves = [set.move1, set.move2, set.move3, set.move4];
  expect(moves).toContain("hiddenpowerbug");
  expect(moves).not.toContain("falseswipe");
});

test("random tooltips identify duplicate moves that completion will replace", () => {
  const member = createTeam({
    name: "bellossom",
    item: "leftovers",
    ability: "Chlorophyll",
    move1: "hiddenpowerice",
    move2: "hiddenpowerfire",
    move3: "gigadrain",
    move4: "gigadrain",
  })[0];
  if (!member) throw new Error("Missing pokemon");
  expect(randomizeSlotLabel(member, undefined, 3)).toBe("Randomize moves");
});

test("random sets leave out the moves and abilities the tier bans", () => {
  const learnset = [
    "terablast",
    "batonpass",
    "tackle",
    "growl",
    "protect",
    "rest",
  ];
  for (const value of [0, 0.3, 0.6, 0.99]) {
    for (const set of [
      randomSet("garchomp", learnset, () => value, 9, "OU: Over Used"),
      // A Generations 6–9 team follows the bans of the tier chosen for it
      randomSet(
        "garchomp",
        learnset,
        () => value,
        9,
        COMBINED_GENERATIONS_FORMAT,
        [],
        "OU: Over Used",
      ),
    ]) {
      expect(set.ability).toBe("Rough Skin");
      expect([set.move1, set.move2, set.move3, set.move4].sort()).toEqual([
        "growl",
        "protect",
        "rest",
        "tackle",
      ]);
    }
    // With fewer than four moves left, a banned one still completes the set
    const short = randomSet(
      "garchomp",
      learnset.slice(1, -1),
      () => value,
      9,
      "OU: Over Used",
    );
    expect([short.move1, short.move2, short.move3, short.move4].sort()).toEqual(
      ["batonpass", "growl", "protect", "tackle"],
    );
  }
});

// Randomize should never build a team that the team analysis warns about
test("random teams break none of their tier's rules, such as its bans", () => {
  // A fixed sequence, so that a failure repeats
  let seed = 1;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const problems: string[] = [];
  for (const [generation, format, tier] of [
    [9, "OU: Over Used", "OU: Over Used"],
    [9, CAP_FORMAT, CAP_FORMAT],
    [9, "Little Cup (LC)", "Little Cup (LC)"],
    [8, "OU: Over Used", "OU: Over Used"],
    [9, COMBINED_GENERATIONS_FORMAT, "OU: Over Used"],
  ] as const) {
    const candidates = filterPokemon({
      generation,
      format: tier,
      region: "",
      type: "",
    });
    const options =
      format === COMBINED_GENERATIONS_FORMAT ?
        availablePokemon(candidates, generation, format)
      : candidates;
    for (let i = 0; i < 50; i++) {
      const team = createTeam();
      const chosen: string[] = [];
      for (const slot of team.keys()) {
        const pokemon = randomPokemon(options, chosen, random);
        chosen.push(pokemon);
        team[slot] = randomSet(
          pokemon,
          generationLearnset(pokemon, generation, format),
          random,
          generation,
          format,
          team.map(({ item }) => item),
          tier,
        );
      }
      problems.push(
        ...validateTeam(team, generation, format, english, tier).map(
          ({ message }) => message,
        ),
      );
    }
  }
  expect(problems).toEqual([]);
});
