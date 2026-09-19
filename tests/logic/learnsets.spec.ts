import learnsets from "@/data/learnsets";
import { test, expect } from "@playwright/test";
import {
  completeLearnset,
  canItLearn,
  getTeamLearnsets,
} from "@/store/learnsets";
import { createTeam } from "./shared/team";

test.describe("learnset inheritance", () => {
  test("includes moves from both earlier evolutions", () => {
    expect(learnsets.roserade).not.toContain("sweetkiss");
    expect(learnsets.roserade).not.toContain("watersport");
    expect(learnsets.roselia).not.toContain("watersport");

    expect(completeLearnset("roserade")).toEqual(
      expect.arrayContaining(["sweetkiss", "watersport", "petaldance"]),
    );
    expect(canItLearn("watersport", "roserade")).toBe(true);
  });

  test("a Mega forme inherits its base forme and previous evolution", () => {
    expect(learnsets.slowbromega).toBeUndefined();
    expect(learnsets.slowbro).not.toContain("mefirst");
    expect(completeLearnset("slowbromega")).toEqual(
      expect.arrayContaining(["psychic", "mefirst"]),
    );
  });

  test("regional evolutions inherit from their regional predecessor", () => {
    expect(learnsets.sandslashalola).not.toContain("mirrorcoat");
    expect(canItLearn("mirrorcoat", "sandslashalola")).toBe(true);
    expect(canItLearn("earthpower", "sandslashalola")).toBe(false);
    expect(canItLearn("earthpower", "sandslash")).toBe(true);
  });

  test("a regional evolution can inherit from a nonregional predecessor", () => {
    expect(learnsets.marowakalola).not.toContain("bellydrum");
    expect(canItLearn("bellydrum", "marowakalola")).toBe(true);
  });

  test("mrrime resolves punctuation in its predecessor's name", () => {
    expect(learnsets.mrrime).not.toContain("healingwish");
    expect(canItLearn("healingwish", "mrrime")).toBe(true);
  });

  for (const [game, pokemon, move] of [
    ["Champions", "meganium", "dazzlinggleam"],
    ["Champions", "rotomfan", "electroball"],
    ["Champions Regulation M-B", "archaludon", "mirrorcoat"],
    ["Legends: Z-A", "grapploct", "bulletpunch"],
    ["Legends: Arceus", "decidueyehisui", "focusenergy"],
    ["BDSP", "mismagius", "grudge"],
  ]) {
    test(`${pokemon} can learn its ${game} move ${move}`, () => {
      expect(canItLearn(move, pokemon)).toBe(true);
    });
  }

  test("expands Hidden Power into its supported types only", () => {
    const hiddenPowers = completeLearnset("unown").filter(move =>
      move.startsWith("hiddenpower"),
    );
    expect(hiddenPowers.sort()).toEqual(
      [
        "hiddenpower",
        "hiddenpowerbug",
        "hiddenpowerdark",
        "hiddenpowerdragon",
        "hiddenpowerelectric",
        "hiddenpowerfighting",
        "hiddenpowerfire",
        "hiddenpowerflying",
        "hiddenpowerghost",
        "hiddenpowergrass",
        "hiddenpowerground",
        "hiddenpowerice",
        "hiddenpowerpoison",
        "hiddenpowerpsychic",
        "hiddenpowerrock",
        "hiddenpowersteel",
        "hiddenpowerwater",
      ].sort(),
    );
    expect(canItLearn("hiddenpowerice", "dachsbun")).toBe(false);
  });

  test("deduplicates inherited moves into a frozen, cached result without mutating the source data", () => {
    const original = [...learnsets.roserade];
    const complete = completeLearnset("roserade");
    expect(complete.length).toBe(new Set(complete).size);
    expect(completeLearnset("roserade")).toBe(complete); // cached
    expect(Object.isFrozen(complete)).toBe(true);
    expect(learnsets.roserade).toEqual(original);
  });

  test("rejects missing moves, unknown moves, and unknown species", () => {
    expect(canItLearn(undefined, "roserade")).toBe(false);
    expect(canItLearn("", "roserade")).toBe(false);
    expect(canItLearn("notamove", "roserade")).toBe(false);
    expect(completeLearnset("notapokemon")).toEqual([]);
    expect(completeLearnset("")).toEqual([]);
    expect(canItLearn("tackle", "notapokemon")).toBe(false);
  });

  test("builds aligned move values and labels while preserving empty slots", () => {
    const team = Object.freeze(
      createTeam({ name: "whimsicott" }).map(pokemon => Object.freeze(pokemon)),
    );
    const all = getTeamLearnsets(team, false);
    const viable = getTeamLearnsets(team, true);

    expect(all.values[0]).toContain("absorb");
    expect(viable.values[0]).not.toContain("absorb");
    expect(viable.values[0]).toContain("encore");
    expect(viable.labels[0][viable.values[0].indexOf("encore")]).toBe("Encore");
    expect(viable.labels[0]).toHaveLength(viable.values[0].length);
    expect(viable.values.slice(1)).toEqual(Array(5).fill([]));
    expect(viable.labels.slice(1)).toEqual(Array(5).fill([]));

    expect(Object.isFrozen(all.values[0])).toBe(true);
    expect(getTeamLearnsets(team, false)).toEqual(all);
  });
});
