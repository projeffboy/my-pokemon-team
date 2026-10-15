import { test, expect } from "@playwright/test";
import { calculateTypeCoverage } from "@/store/coverage";
import { coverageMatrix } from "@/store/matrix";
import {
  isMoveStrongEnough,
  moveAgainstType,
} from "@/store/shared/effectiveness";
import { generationLearnset, learnsetsReady } from "@/store/learnsets";
import { hiddenPowerPower, hiddenPowerType } from "@/shared/hidden-power";
import { createTeam } from "./shared/team";

test.beforeAll(async () => {
  await learnsetsReady;
});

for (const generation of [2, 3, 4, 5, 6] as const) {
  test(`Gen${generation} Hidden Power eligibility uses the set's power in coverage and matrix`, () => {
    const team = createTeam({
      name: "jolteon",
      move1: "hiddenpowerfighting",
      ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    });
    const member = team[0]!;
    const strong = generation >= 6;
    expect(generationLearnset(member.name, generation)).toContain(member.move1);
    expect(hiddenPowerType(member, generation)).toBe("fighting");
    expect(hiddenPowerPower(member, generation)).toBe(
      generation === 2 ? 31
      : strong ? 60
      : 30,
    );
    expect(
      isMoveStrongEnough(
        member.move1,
        member.item,
        member.ability,
        generation,
        member.name,
        member.happiness,
        member,
      ),
    ).toBe(strong);
    expect(
      moveAgainstType(
        member.move1,
        "Rock",
        member.name,
        member.ability,
        generation,
        member.item,
        member.happiness,
        member,
      ),
    ).toBe(strong ? -1 : undefined);
    expect(calculateTypeCoverage(team, generation).Rock).toBe(strong ? 1 : 0);
    expect(coverageMatrix(team, undefined, generation).Rock?.[0]).toMatchObject(
      strong ? { multiplier: 2 } : { multiplier: 1 },
    );
    if (!strong)
      expect(
        coverageMatrix(team, undefined, generation).Rock?.[0]?.reason,
      ).toContain("no damaging move");
  });
}

test("the 40-power threshold and move ordering apply to known IVs", () => {
  const base = {
    name: "jolteon",
    move1: "hiddenpowerfighting",
    ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  };
  const weak = createTeam({
    ...base,
    ivs: { ...base.ivs, hp: 2, atk: 2, def: 2, spe: 2 },
  });
  const strong = createTeam({ ...base, ivs: { ...base.ivs, spa: 2 } });
  expect(hiddenPowerType(weak[0]!, 5)).toBe("fighting");
  expect(hiddenPowerType(strong[0]!, 5)).toBe("fighting");
  expect(calculateTypeCoverage(weak, 5).Rock).toBe(0);
  expect(calculateTypeCoverage(strong, 5).Rock).toBe(1);
  for (const [move1, move2] of [
    ["hiddenpowerfighting", "doublekick"],
    ["doublekick", "hiddenpowerfighting"],
  ]) {
    const combined = createTeam({ ...weak[0], move1, move2 });
    expect(calculateTypeCoverage(combined, 5).Rock).toBe(1);
    expect(coverageMatrix(combined, undefined, 5).Rock?.[0]?.multiplier).toBe(
      2,
    );
  }
});

test("weak per-hit multihit attacks retain the existing exception", () => {
  for (const [name, move, generation] of [
    ["breloom", "bulletseed", 3],
    ["maushold", "populationbomb", 9],
  ] as const) {
    const member = createTeam({ name, move1: move, ivs: { spa: 0 } })[0]!;
    expect(generationLearnset(name, generation)).toContain(move);
    expect(
      isMoveStrongEnough(move, "", "", generation, name, undefined, member),
    ).toBeTruthy();
    expect(
      moveAgainstType(
        move,
        "Water",
        name,
        "",
        generation,
        "",
        undefined,
        member,
      ),
    ).toBe(move === "bulletseed" ? -1 : 0);
  }
  expect(
    isMoveStrongEnough(
      "hiddenpowerfairy",
      "",
      "",
      5,
      "jolteon",
      undefined,
      createTeam({ name: "jolteon" })[0],
    ),
  ).toBeFalsy();
});

for (const generation of [2, 3, 4, 7] as const) {
  test(`Gen${generation} plain Hidden Power takes its type from the set's IVs`, () => {
    const team = createTeam({ name: "mew", move1: "hiddenpower" });
    const member = team[0]!;
    expect(generationLearnset(member.name, generation)).toContain(
      "hiddenpower",
    );
    expect(hiddenPowerType(member, generation)).toBe("dark");
    for (const target of ["Ghost", "Psychic"] as const) {
      expect(
        moveAgainstType(
          "hiddenpower",
          target,
          member.name,
          member.ability,
          generation,
          member.item,
          member.happiness,
          member,
        ),
      ).toBe(-1);
      expect(calculateTypeCoverage(team, generation)[target]).toBe(1);
      expect(
        coverageMatrix(team, undefined, generation)[target]?.[0],
      ).toMatchObject({
        multiplier: 2,
        reason: expect.stringContaining("Hidden Power (Dark) does 2x"),
      });
    }
  });
}

test("plain Hidden Power with Fire IVs covers as Fire", () => {
  const team = createTeam({
    name: "mew",
    move1: "hiddenpower",
    ivs: { atk: 30, spa: 30, spe: 30 },
  });
  expect(hiddenPowerType(team[0]!, 7)).toBe("fire");
  expect(calculateTypeCoverage(team, 7)).toMatchObject({
    Grass: 1,
    Ghost: 0,
  });
  expect(coverageMatrix(team, undefined, 7).Grass?.[0]?.reason).toContain(
    "Hidden Power (Fire) does 2x",
  );
  expect(coverageMatrix(team, undefined, 7).Water?.[0]?.multiplier).toBe(0.5);
});
