import { test, expect } from "@playwright/test";
import { evaluateChecklist } from "@/store/checklist";
import type { Generation, ReadonlyTeam } from "@/types";
import en from "@/i18n/en";
import { createTeam } from "./shared/team";

// The passed checks, by their English labels
const checked = (team: ReadonlyTeam, generation?: Generation) =>
  evaluateChecklist(team, generation)
    .flatMap(group => group.items)
    .filter(item => item.isChecked)
    .map(item => en.checklist.items[item.key].label);

test("an empty team passes no check, in three groups of three", () => {
  const groups = evaluateChecklist(createTeam());
  expect(groups.map(group => en.checklist.groups[group.key])).toEqual([
    "General",
    "Defensive",
    "Offensive",
  ]);
  expect(groups.map(group => group.items.length)).toEqual([3, 3, 3]);
  expect(checked(createTeam())).toEqual([]);
});

test("general checks count hazards, hazard removal, and recovery moves", () => {
  expect(
    checked(
      createTeam(
        { name: "kleavor", move1: "stoneaxe" },
        { name: "glimmora", move1: "mortalspin" },
        { name: "sudowoodo", move1: "strengthsap" },
      ),
    ),
  ).toEqual([
    "Entry Hazard",
    "Spinner/Defogger",
    "Reliable Recovery",
    // Mortal Spin always poisons
    "Status Move",
  ]);
});

test("Ceaseless Edge counts as an entry hazard", () => {
  expect(
    checked(createTeam({ name: "samurotthisui", move1: "ceaselessedge" })),
  ).toEqual(["Entry Hazard"]);
});

test("wish is reliable recovery only with a protect move on the same pokemon", () => {
  expect(
    checked(createTeam({ name: "alomomola", move1: "wish", move2: "detect" })),
  ).toEqual(["Reliable Recovery"]);
  expect(
    checked(
      createTeam(
        { name: "alomomola", move1: "wish" },
        { name: "chesnaught", move1: "spikyshield" },
      ),
    ),
  ).toEqual([]);
});

test("Wish also pairs with newer moves that protect the user", () => {
  for (const move of ["obstruct", "silktrap", "burningbulwark"]) {
    expect(
      checked(createTeam({ name: "smeargle", move1: "wish", move2: move })),
    ).toContain("Reliable Recovery");
  }
});

test("Floral Healing cannot supply its user's own reliable recovery", () => {
  expect(
    checked(createTeam({ name: "comfey", move1: "floralhealing" })),
  ).not.toContain("Reliable Recovery");
});

test("Defog removes the user's hazards only from Gen 6 onward", () => {
  const team = createTeam({ name: "skarmory", move1: "defog" });
  expect(checked(team, 4)).not.toContain("Spinner/Defogger");
  expect(checked(team, 5)).not.toContain("Spinner/Defogger");
  expect(checked(team, 6)).toContain("Spinner/Defogger");
});

test("status moves include guaranteed side effects but not chances", () => {
  expect(checked(createTeam({ name: "salazzle", move1: "toxic" }))).toEqual([
    "Status Move",
  ]);
  expect(checked(createTeam({ name: "pachirisu", move1: "nuzzle" }))).toEqual([
    "Status Move",
  ]);
  expect(
    checked(createTeam({ name: "pachirisu", move1: "discharge" })),
  ).toEqual([]);
});

test("Yawn counts as a move that inflicts sleep", () => {
  expect(checked(createTeam({ name: "dondozo", move1: "yawn" }))).toEqual([
    "Status Move",
  ]);
});

test("defensive checks count clerics and phazers", () => {
  expect(
    checked(
      createTeam(
        { name: "chansey", move1: "healbell" },
        { name: "drampa", move1: "dragontail" },
      ),
    ),
  ).toEqual(["Cleric", "Phazer"]);
});

test("boosting moves raise two stages in total, or are Curse", () => {
  const boosts = (move: string) =>
    checked(createTeam({ name: "cloyster", move1: move })).includes(
      "Boosting Move",
    );
  expect(boosts("shellsmash")).toBe(true);
  expect(boosts("growth")).toBe(true);
  expect(boosts("curse")).toBe(true);
  expect(boosts("bellydrum")).toBe(true);
  expect(boosts("howl")).toBe(false);
  expect(boosts("iciclespear")).toBe(false);
});

test("Growth's setup check follows its historical one-stage boost", () => {
  const team = createTeam({ name: "bellsprout", move1: "growth" });
  expect(checked(team, 1)).not.toContain("Boosting Move");
  expect(checked(team, 4)).not.toContain("Boosting Move");
  expect(checked(team, 5)).toContain("Boosting Move");
});

test("Curse counts as setup only when its user is not a Ghost type", () => {
  expect(
    checked(createTeam({ name: "banette", move1: "curse" })),
  ).not.toContain("Boosting Move");
  expect(checked(createTeam({ name: "snorlax", move1: "curse" }))).toContain(
    "Boosting Move",
  );
});

test("offensive checks count pivot moves and choice items", () => {
  expect(
    checked(
      createTeam(
        { name: "wugtrio", move1: "flipturn" },
        { name: "porygonz", item: "choicespecs" },
      ),
    ),
  ).toEqual(["Volt-turn Move", "Choice Item"]);
  expect(checked(createTeam({ name: "porygonz", item: "leftovers" }))).toEqual(
    [],
  );
});
