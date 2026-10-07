import { test, expect } from "@playwright/test";
import spreads from "@/data/hidden-power-spreads";
import { hiddenPowerType, matchHiddenPower } from "@/shared/hidden-power";
import {
  getDv,
  hpDv,
  isShinyDv,
  LEGENDS_ARCEUS,
} from "@/shared/generation-rules";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { getIv } from "@/shared/set-details";
import { STAT_KEYS, type Generation } from "@/types";
import { randomSet, completeSet } from "@/store/random";
import { createTeam } from "./shared/team";

test("all sixteen Showdown spreads produce the selected type across IV and DV generations", () => {
  expect(Object.keys(spreads)).toHaveLength(16);
  for (const generation of [2, 3, 4, 5, 6, 7, 8] as const) {
    for (const type of Object.keys(spreads)) {
      const member = createTeam({
        name: "lanturn",
        ivs:
          type === "fighting" ? undefined : (
            { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, hp: 0 }
          ),
      })[0];
      if (!member) throw new Error("Missing pokemon");
      matchHiddenPower(member, `hiddenpower${type}`, generation);
      expect(
        hiddenPowerType(member, generation),
        `${generation}: ${type}`,
      ).toBe(type);
      if (generation === 2) {
        expect(getDv(member, "hp")).toBe(hpDv(member));
        expect(getDv(member, "spd")).toBe(getDv(member, "spa"));
        expect(member.shiny ?? false).toBe(isShinyDv(member));
      } else {
        // Every recommended IV retains its second bit, giving base power 70 before Gen 6.
        expect(STAT_KEYS.every(stat => getIv(member.ivs, stat) % 4 >= 2)).toBe(
          true,
        );
      }
    }
  }
});

test("changing Ice to Fire resets the previous spread and chooses Showdown's new IVs", () => {
  const member = createTeam({ name: "magcargo" })[0];
  if (!member) throw new Error("Missing pokemon");
  matchHiddenPower(member, "hiddenpowerice", 3);
  expect(member.ivs).toEqual({ atk: 30, def: 30 });
  matchHiddenPower(member, "hiddenpowerfire", 3);
  expect(member.ivs).toEqual({ atk: 30, spa: 30, spe: 30 });
  matchHiddenPower(member, "hiddenpowerdark", 3);
  expect(member.ivs).toBeUndefined();
});

test("Gen 2 Fire sets Attack 14, Defence 12, shared Special 15 and derived HP 3", () => {
  const member = createTeam({ name: "lanturn", shiny: true, gender: "F" })[0];
  if (!member) throw new Error("Missing pokemon");
  matchHiddenPower(member, "hiddenpowerfire", 2);
  expect(STAT_KEYS.map(stat => getDv(member, stat))).toEqual([
    3, 14, 12, 15, 15, 15,
  ]);
  expect(member.shiny).toBeUndefined();
  expect(member.gender).toBe("M");
  matchHiddenPower(member, "hiddenpowerice", 2);
  expect(STAT_KEYS.map(stat => getDv(member, stat))).toEqual([
    15, 15, 13, 15, 15, 15,
  ]);
});

test("compatible custom IVs and shiny DVs are preserved", () => {
  const special = createTeam({
    name: "magcargo",
    ivs: { atk: 0, spa: 30, spe: 0 },
  })[0];
  const shiny = createTeam({ name: "lanturn", shiny: true })[0];
  if (!special || !shiny) throw new Error("Missing pokemon");
  const before = structuredClone(special);
  matchHiddenPower(special, "hiddenpowerfire", 6);
  expect(special).toEqual(before);
  expect(hiddenPowerType(shiny, 2)).toBe("dragon");
  matchHiddenPower(shiny, "hiddenpowerdragon", 2);
  expect(shiny).toEqual({ ...createTeam({ name: "lanturn" })[0], shiny: true });
});

test("ordinary and untyped moves, Gen 1 and formats without IVs leave details alone", () => {
  for (const [move, generation, format] of [
    ["surf", 3, ""],
    ["hiddenpower", 3, ""],
    ["hiddenpowerfairy", 3, ""],
    ["hiddenpowerfire", 1, ""],
    ["hiddenpowerfire", 8, LEGENDS_ARCEUS],
    ["hiddenpowerfire", 9, CHAMPIONS_FORMAT],
  ] as const) {
    const member = createTeam({
      name: "lanturn",
      ivs: { atk: 4 },
      evs: { hp: 131 },
      nickname: "Lamp",
    })[0];
    if (!member) throw new Error("Missing pokemon");
    const before = structuredClone(member);
    matchHiddenPower(member, move, generation, format);
    expect(member).toEqual(before);
  }
});

test("random Hidden Power always has matching IVs or DVs without changing the original set", () => {
  for (const generation of [2, 3, 5, 6, 7, 8] satisfies Generation[]) {
    for (const type of Object.keys(spreads)) {
      const move = `hiddenpower${type}`;
      const set = randomSet("unown", [move], () => 0, generation);
      expect(set.move1).toBe(move);
      expect(hiddenPowerType(set, generation)).toBe(type);
      const member = createTeam({
        name: "unown",
        ivs: { atk: 0, def: 0 },
        nickname: "Letter",
      })[0];
      if (!member) throw new Error("Missing pokemon");
      const before = structuredClone(member);
      const completed = completeSet(member, [move], () => 0, generation);
      expect(hiddenPowerType(completed, generation)).toBe(type);
      expect(completed.nickname).toBe("Letter");
      expect(member).toEqual(before);
    }
  }
});
