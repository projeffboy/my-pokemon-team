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
});
