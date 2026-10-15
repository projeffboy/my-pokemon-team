import { test, expect } from "@playwright/test";
import {
  calculateTypeDefence,
  calculateTypeCoverage,
  createTypeScores,
} from "@/store/coverage";
import { createTeam } from "./shared/team";

test("calculations accept frozen teams and return independent score objects", () => {
  const team = Object.freeze(
    createTeam({
      name: "glaceon",
      move1: "icebeam",
      ability: "Ice Body",
    }).map(pokemon => Object.freeze(pokemon)),
  );
  const original = JSON.stringify(team);
  const coverage = calculateTypeCoverage(team);
  const defence = calculateTypeDefence(team);
  expect(coverage.Dragon).toBe(2);
  expect(defence.Fire).toBe(-1);

  coverage.Dragon = 99;
  defence.Fire = 99;
  expect(calculateTypeCoverage(team).Dragon).toBe(2);
  expect(calculateTypeDefence(team).Fire).toBe(-1);
  expect(Object.values(calculateTypeCoverage([]))).toEqual(Array(18).fill(0));
  expect(Object.values(calculateTypeDefence([]))).toEqual(Array(18).fill(0));
  expect(JSON.stringify(team)).toBe(original);
});

test("team defence sums contributions after capping each at 1.5", () => {
  const team = createTeam();
  expect(Object.values(calculateTypeDefence(team))).toEqual(Array(18).fill(0));

  team[0].name = "leavanny";
  team[1].name = "mudsdale";
  expect(calculateTypeDefence(team)).toMatchObject({
    Fire: -1.5,
    Grass: 0.5,
    Electric: 2.5,
  });
  expect(Object.values(createTypeScores())).toEqual(Array(18).fill(0));
});

test.describe("team coverage", () => {
  test("Judgment coverage changes with a Plate versus a Z-Crystal", () => {
    const team = createTeam({
      name: "arceusdragon",
      ability: "Multitype",
      item: "dragoniumz",
      move1: "judgment",
    });
    expect(calculateTypeCoverage(team, 7).Dragon).toBe(0);
    team[0].item = "dracoplate";
    expect(calculateTypeCoverage(team, 7).Dragon).toBe(2);
  });

  test("counts each ordinary move type once per Pokemon and awards STAB", () => {
    const team = createTeam();
    expect(Object.values(calculateTypeCoverage(team))).toEqual(
      Array(18).fill(0),
    );
    Object.assign(team[0], {
      name: "cryogonal",
      move1: "icebeam",
      move2: "blizzard",
      move3: "flashcannon",
    });
    expect(calculateTypeCoverage(team)).toMatchObject({
      Dragon: 2,
      Fairy: 1,
      Water: 0,
    });

    Object.assign(team[1], { name: "beartic", move1: "icebeam" });
    expect(calculateTypeCoverage(team).Dragon).toBe(4);
    expect(Object.values(createTypeScores())).toEqual(Array(18).fill(0));
  });

  for (const [pokemon, move, target] of [
    ["cryogonal", "freezedry", "Water"],
    ["hawlucha", "flyingpress", "Grass"],
  ] as const) {
    test(`duplicate ${move} slots do not inflate coverage`, () => {
      const team = createTeam();
      Object.assign(team[0], { name: pokemon, move1: move });
      const singleMoveCoverage = { ...calculateTypeCoverage(team) };
      expect(singleMoveCoverage[target]).toBe(2);

      Object.assign(team[0], { move2: move, move3: move, move4: move });
      expect(calculateTypeCoverage(team)).toEqual(singleMoveCoverage);
    });
  }

  test("Freeze-Dry and Flying Press count a target once with moves of their own type", () => {
    const coverage = (name: string, move1: string, move2: string) =>
      calculateTypeCoverage(createTeam({ name, move1, move2 }));
    for (const [move1, move2] of [
      ["icebeam", "freezedry"],
      ["freezedry", "icebeam"],
    ])
      expect(coverage("lapras", move1, move2)).toEqual({
        ...coverage("lapras", "icebeam", "blizzard"),
        Water: 2,
      });
    for (const [move1, move2] of [
      ["closecombat", "flyingpress"],
      ["flyingpress", "closecombat"],
    ])
      expect(coverage("hawlucha", move1, move2).Normal).toBe(
        coverage("hawlucha", "closecombat", "highjumpkick").Normal,
      );
  });

  test("Flying Press counts its Flying hits once with Flying moves", () => {
    const coverage = (move1: string, move2 = "") =>
      calculateTypeCoverage(createTeam({ name: "hawluchamega", move1, move2 }));
    for (const [move1, move2] of [
      ["flyingpress", "acrobatics"],
      ["acrobatics", "flyingpress"],
    ])
      expect(coverage(move1, move2)).toEqual({
        ...coverage("flyingpress"),
        Bug: 2,
      });
  });

  test("Freeze-Dry still covers Water after a regular Ice move", () => {
    const team = createTeam();
    Object.assign(team[0], {
      name: "cryogonal",
      move1: "icebeam",
      move2: "freezedry",
    });
    expect(calculateTypeCoverage(team).Water).toBe(2);
  });

  test("Flying Press still covers Grass after a regular Fighting move", () => {
    const team = createTeam();
    Object.assign(team[0], {
      name: "hawlucha",
      move1: "closecombat",
      move2: "flyingpress",
    });
    expect(calculateTypeCoverage(team).Grass).toBe(2);
  });

  test("weak and status moves do not add coverage", () => {
    const team = createTeam();
    Object.assign(team[0], {
      name: "togedemaru",
      move1: "nuzzle",
      move2: "thunderwave",
    });
    expect(Object.values(calculateTypeCoverage(team))).toEqual(
      Array(18).fill(0),
    );
  });

  for (const { pokemon, delayedMove, typedMove, generations, targets } of [
    {
      pokemon: "xatu",
      delayedMove: "futuresight",
      typedMove: "psychic",
      generations: [2, 3, 4],
      targets: ["Fighting", "Poison"],
    },
    {
      pokemon: "jirachi",
      delayedMove: "doomdesire",
      typedMove: "irontail",
      generations: [3, 4],
      targets: ["Ice", "Rock"],
    },
  ] as const) {
    for (const generation of generations) {
      test(`Gen ${generation} typeless ${delayedMove} never suppresses ${typedMove} coverage`, () => {
        const coverage = calculateTypeCoverage(
          createTeam({ name: pokemon, move1: typedMove }),
          generation,
        );
        for (const target of targets) expect(coverage[target]).toBe(2);
        expect(
          Object.values(
            calculateTypeCoverage(
              createTeam({ name: pokemon, move1: delayedMove }),
              generation,
            ),
          ),
        ).toEqual(Array(18).fill(0));

        for (const [move1, move2] of [
          [delayedMove, typedMove],
          [typedMove, delayedMove],
        ]) {
          expect(
            calculateTypeCoverage(
              createTeam({ name: pokemon, move1, move2 }),
              generation,
            ),
          ).toEqual(coverage);
        }
      });
    }
  }
});

test("coverage excludes moves below the historical power threshold", () => {
  const wing = createTeam({ name: "aerodactyl", move1: "wingattack" });
  expect(calculateTypeCoverage(wing, 1).Grass).toBe(0);
  expect(calculateTypeCoverage(wing, 2).Grass).toBe(2);
  const leech = createTeam({ name: "venonat", move1: "leechlife" });
  expect(calculateTypeCoverage(leech, 6).Psychic).toBe(0);
  expect(calculateTypeCoverage(leech, 7).Psychic).toBe(2);
});

test("Normalize changes Natural Gift to Normal in gen4 but preserves it in gen7", () => {
  const team = createTeam({
    name: "delcatty",
    ability: "Normalize",
    item: "liechiberry",
    move1: "naturalgift",
  });
  expect(calculateTypeCoverage(team, 4).Water).toBe(0);
  for (const generation of [5, 6, 7] as const)
    expect(calculateTypeCoverage(team, generation).Water).toBe(1);
});

test("Dry Skin's 1.25x Fire damage scores a half step in team defence", () => {
  const scores = (name: string) =>
    calculateTypeDefence(createTeam({ name, ability: "Dry Skin" })).Fire;
  expect(scores("toxicroak")).toBe(-0.5);
  expect(scores("heliolisk")).toBe(-0.5);
  expect(scores("jynx")).toBe(-1.5);
  expect(scores("parasect")).toBe(-1.5);
});
