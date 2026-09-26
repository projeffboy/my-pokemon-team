import { test, expect } from "@playwright/test";
import { validateTeam } from "@/store/validation";
import { createTeam } from "./shared/team";

test("an empty team is the only problem of an empty team", () => {
  expect(validateTeam(createTeam(), 9, "OU: Over Used")).toEqual([
    "The team is empty.",
  ]);
});

test("a legal team has no problems", () => {
  const team = createTeam(
    { name: "milotic", ability: "Marvel Scale", move1: "scald" },
    { name: "ogerponwellspring", item: "wellspringmask" },
  );
  expect(validateTeam(team, 9, "")).toEqual([]);
});

test("reports pokemon outside the format or generation", () => {
  expect(
    validateTeam(createTeam({ name: "milotic" }), 9, "Little Cup (LC)"),
  ).toEqual(["Milotic is not allowed in Gen 9 Little Cup (LC)."]);
  expect(validateTeam(createTeam({ name: "chikorita" }), 1, "")).toEqual([
    "Chikorita is not allowed in Gen 1.",
  ]);
});

test("reports illegal abilities, missing required items, and repeated moves", () => {
  const team = createTeam(
    {
      name: "milotic",
      ability: "Levitate",
      move1: "scald",
      move2: "scald",
    },
    { name: "ogerponwellspring" },
  );
  expect(validateTeam(team, 9, "")).toEqual([
    "Milotic cannot have Levitate.",
    "Milotic has Scald twice.",
    "Ogerpon-Wellspring must hold Wellspring Mask.",
  ]);
});

test("reports EVs, levels, and tera types that the games do not allow", () => {
  const team = createTeam(
    { name: "milotic", evs: { hp: 252, atk: 252, spe: 252 }, level: 0 },
    { name: "kingdra", evs: { hp: 300 }, level: 101 },
    { name: "chansey", teraType: "Steel" },
  );
  expect(validateTeam(team, 8, "")).toEqual([
    "Milotic has 756 EVs (at most 510).",
    "Milotic's level must be 1 to 100.",
    "Kingdra has more than 252 EVs in one stat.",
    "Kingdra's level must be 1 to 100.",
    "Chansey has a Tera Type, which only exists in Gen 9.",
  ]);
});

test("applies Species Clause everywhere and Item Clause in doubles", () => {
  const team = createTeam(
    { name: "milotic", item: "leftovers" },
    { name: "kingdra", item: "leftovers" },
    { name: "kingdra" },
  );
  expect(validateTeam(team, 9, "OU: Over Used")).toEqual([
    "Two pokemon are Kingdra (Species Clause).",
  ]);
  expect(validateTeam(team, 9, "Doubles OU")).toEqual([
    "Two pokemon are Kingdra (Species Clause).",
    "Two pokemon hold Leftovers (Item Clause).",
  ]);
  expect(
    validateTeam(
      createTeam(
        { name: "venusaur" },
        { name: "venusaurmega", item: "venusaurite" },
      ),
      9,
      "Pokemon Champions (M-C)",
    ),
  ).toEqual(["Two pokemon are Venusaur (Species Clause)."]);
});
