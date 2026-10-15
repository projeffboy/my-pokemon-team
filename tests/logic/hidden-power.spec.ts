import { test, expect } from "@playwright/test";
import spreads from "@/data/hidden-power-spreads";
import {
  canHaveHiddenPowerType,
  hiddenPowerPower,
  hiddenPowerType,
  matchHiddenPower,
  matchImportedHiddenPower,
  matchHiddenPowerPreservingDetails,
} from "@/shared/hidden-power";
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
import { parseTeamText, serializeTeam } from "@/store/team-text";
import { learnsetsReady } from "@/store/learnsets";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";

test.beforeAll(async () => {
  await learnsetsReady;
});

test("all sixteen Showdown spreads produce the selected type across IV and DV generations", () => {
  expect(Object.keys(spreads)).toHaveLength(16);
  for (const generation of [2, 3, 4, 5, 6, 7, 8] as const) {
    for (const type of Object.keys(spreads)) {
      const member = createTeam({
        name: "lanturn",
        level: 99,
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
      } else if (generation < 6) {
        // Every recommended IV retains its second bit, giving base power 70 before Gen 6.
        expect(STAT_KEYS.every(stat => getIv(member.ivs, stat) % 4 >= 2)).toBe(
          true,
        );
      } else {
        // Power is fixed from Gen 6, so each IV moves by at most one.
        const start = type === "fighting" ? 31 : 0;
        expect(
          STAT_KEYS.every(
            stat => Math.abs(getIv(member.ivs, stat) - start) <= 1,
          ),
        ).toBe(true);
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

test("fixed-power Hidden Power changes as few custom IVs as the type allows", () => {
  for (const generation of [6, 7, 8] as const) {
    const trickRoom = createTeam({
      name: "lanturn",
      level: 99,
      ivs: { spe: 0 },
    })[0]!;
    matchHiddenPower(trickRoom, "hiddenpowerfire", generation);
    expect(trickRoom.ivs).toEqual({ atk: 30, spa: 30, spe: 0 });
    matchHiddenPower(trickRoom, "hiddenpowerice", generation);
    expect(trickRoom.ivs).toEqual({ spe: 0 });
    expect(hiddenPowerType(trickRoom, generation)).toBe("ice");
    for (const [type, ivs] of [
      ["water", { spa: 30, spe: 0 }],
      ["bug", { spd: 30, spe: 0 }],
    ] as const) {
      const member = createTeam({
        name: "lanturn",
        level: 99,
        ivs: { spe: 0 },
      })[0]!;
      matchHiddenPower(member, `hiddenpower${type}`, generation);
      expect(member.ivs, `${generation}: ${type}`).toEqual(ivs);
    }
    const special = createTeam({
      name: "starmie",
      level: 50,
      ivs: { atk: 0 },
    })[0]!;
    matchHiddenPower(special, "hiddenpowerghost", generation);
    expect(special.ivs).toEqual({ atk: 0, spd: 30 });
    for (const type of Object.keys(spreads)) {
      const member = createTeam({ name: "lanturn", level: 99 })[0]!;
      matchHiddenPower(member, `hiddenpower${type}`, generation);
      expect(member.ivs ?? {}, `${generation}: ${type}`).toEqual(
        spreads[type]?.ivs,
      );
    }
  }
  const variablePower = createTeam({ name: "lanturn", ivs: { spe: 0 } })[0]!;
  matchHiddenPower(variablePower, "hiddenpowerfire", 5);
  expect(variablePower.ivs).toEqual({ atk: 30, spa: 30, spe: 30 });
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

test("random Hidden Power matches new sets and respects existing custom IVs", () => {
  for (const generation of [2, 3, 5, 6, 7, 8] satisfies Generation[]) {
    for (const type of Object.keys(spreads)) {
      const move = `hiddenpower${type}`;
      const set = randomSet("unown", [move], () => 0, generation);
      expect(set.move1).toBe(move);
      expect(canHaveHiddenPowerType(set, type, generation)).toBe(true);
      const member = createTeam({
        name: "unown",
        ivs: { atk: 0, def: 0 },
        nickname: "Letter",
      })[0];
      if (!member) throw new Error("Missing pokemon");
      const before = structuredClone(member);
      const completed = completeSet(member, [move], () => 0, generation);
      const currentType = hiddenPowerType(member, generation);
      expect(completed.move1).toBe(
        canHaveHiddenPowerType(member, type, generation) ? move : "",
      );
      expect(hiddenPowerType(completed, generation)).toBe(currentType);
      expect(completed.ivs).toEqual(member.ivs);
      expect(completed.nickname).toBe("Letter");
      expect(member).toEqual(before);
    }
  }
});

test("Hyper Training preserves compatible stat IVs without changing their derived type", () => {
  for (const [generation, level] of [
    [7, 100],
    [8, 100],
    [9, 50],
  ] as const) {
    for (const type of Object.keys(spreads)) {
      const member = createTeam({ name: "unown", level })[0]!;
      const before = structuredClone(member);
      expect(hiddenPowerType(member, generation)).toBe("dark");
      matchHiddenPower(member, `hiddenpower${type}`, generation);
      expect(member).toEqual(before);
      expect(canHaveHiddenPowerType(member, type, generation)).toBe(true);
      expect(
        matchHiddenPowerPreservingDetails(
          member,
          `hiddenpower${type}`,
          generation,
          "",
          { preserveIvs: true },
        ),
      ).toBe(true);
      expect(member).toEqual(before);
    }
  }
  const partial = createTeam({
    name: "unown",
    ivs: { atk: 0, spe: 0 },
  })[0]!;
  expect(hiddenPowerType(partial, 7)).toBe("psychic");
  expect(canHaveHiddenPowerType(partial, "fire", 7)).toBe(true);
  expect(canHaveHiddenPowerType(partial, "ice", 7)).toBe(false);
  expect(canHaveHiddenPowerType(partial, "dark", 7)).toBe(false);
  const before = structuredClone(partial);
  matchHiddenPower(partial, "hiddenpowerfire", 7);
  expect(partial).toEqual(before);
  const historicalLink = createTeam({ name: "raikou" })[0]!;
  matchImportedHiddenPower(historicalLink, "hiddenpowerice", 7, "", {
    allowHyperTraining: false,
  });
  expect(historicalLink.ivs).toEqual({ atk: 30, def: 30 });
});

test("Hidden Power text round trips preserve capped Gen7 IVs while earlier controls still match", () => {
  for (const [generation, level, expected] of [
    [6, 100, 30],
    [7, 99, 30],
    [7, 100, 31],
    [9, 49, 30],
    [9, 50, 31],
  ] as const) {
    const team = parseTeamText(
      `Raikou\nLevel: ${level}\n- Hidden Power Ice`,
      generation,
    );
    expect(getIv(team[0]!.ivs, "atk")).toBe(expected);
    expect(getIv(team[0]!.ivs, "def")).toBe(expected);
    const shared = parseTeamText(serializeTeam(team), generation);
    expect(shared[0]!.ivs).toEqual(team[0]!.ivs);
    expect(shared[0]!.move1).toBe("hiddenpowerice");
  }
  const explicit = parseTeamText(
    "Raikou\nIVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe\n- Hidden Power Ice",
    7,
  );
  const recipient = parseTeamText(serializeTeam(explicit), 7);
  expect(recipient[0]!.ivs).toBeUndefined();
});

test("Hidden Power uses DV power in Gen2, second IV bits in Gen3–5 and fixed power since Gen6", () => {
  const low = createTeam({
    name: "jolteon",
    ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  })[0]!;
  const high = createTeam({ name: "jolteon" })[0]!;
  expect(hiddenPowerPower(low, 2)).toBe(31);
  expect(hiddenPowerPower(high, 2)).toBe(70);
  for (const generation of [3, 4, 5] as const) {
    expect(hiddenPowerPower(low, generation)).toBe(30);
    expect(hiddenPowerPower(high, generation)).toBe(70);
    expect(
      hiddenPowerPower(
        { ...low, ivs: { ...low.ivs, hp: 2, atk: 2, def: 2, spe: 2 } },
        generation,
      ),
    ).toBe(39);
    expect(
      hiddenPowerPower({ ...low, ivs: { ...low.ivs, spa: 2 } }, generation),
    ).toBe(40);
  }
  expect(
    hiddenPowerPower(
      { ...low, ivs: { ...low.ivs, spa: 21, spd: 21, spe: 17 } },
      2,
    ),
  ).toBe(39);
  expect(
    hiddenPowerPower(
      { ...low, ivs: { ...low.ivs, spa: 23, spd: 23, spe: 17 } },
      2,
    ),
  ).toBe(40);
  expect(hiddenPowerPower({ ...high, shiny: true }, 2)).toBe(69);
  for (const generation of [6, 7, 8, 9] as const) {
    expect(hiddenPowerPower(low, generation)).toBe(60);
    expect(hiddenPowerPower(high, generation)).toBe(60);
  }
});

test("generation transfer retains capped Hidden Power stat IVs only in an eligible target", async () => {
  const data = await loadGenerationTransferData();
  const source = createTeam({ name: "unown", move1: "hiddenpowerice" });
  const before = structuredClone(source);
  for (const generation of [7, 6] as const) {
    const plan = planGenerationTransfer(
      source,
      { generation: 8, format: "" },
      generation,
      "",
      data,
    );
    expect(plan.team[0]?.move1).toBe("hiddenpowerice");
    expect(getIv(plan.team[0]?.ivs, "atk")).toBe(generation === 7 ? 31 : 30);
    expect(getIv(plan.team[0]?.ivs, "def")).toBe(generation === 7 ? 31 : 30);
    expect(plan.losses.some(loss => loss.field === "ivs")).toBe(
      generation === 6,
    );
  }
  expect(source).toEqual(before);
});
