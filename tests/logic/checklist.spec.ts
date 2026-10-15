import { test, expect } from "@playwright/test";
import { evaluateChecklist } from "@/store/checklist";
import type { BattleFormat, Generation, ReadonlyTeam } from "@/types";
import en from "@/i18n/en";
import { createTeam } from "./shared/team";

// The passed checks, by their English labels
const checked = (team: ReadonlyTeam, generation?: Generation) =>
  evaluateChecklist(team, generation)
    .flatMap(group => group.items)
    .filter(item => item.isChecked)
    .map(item => en.checklist.items[item.key].label);

test("an empty team passes no check, in three groups", () => {
  const groups = evaluateChecklist(createTeam());
  expect(groups.map(group => en.checklist.groups[group.key])).toEqual([
    "General",
    "Defensive",
    "Offensive",
  ]);
  expect(groups.map(group => group.items.length)).toEqual([3, 3, 4]);
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

// The Spinner/Defogger role's result
const spinner = (
  team: ReadonlyTeam,
  generation: Generation,
  battleFormat?: BattleFormat,
) => {
  const item = evaluateChecklist(team, generation, "", battleFormat)
    .flatMap(group => group.items)
    .find(item => item.key === "spinner");
  return item?.dependsOnBattleFormat ? "depends" : item?.isChecked;
};

test("before Gen 6, Defog removes the user's hazards only in doubles", () => {
  for (const [name, generation] of [
    ["staraptor", 4],
    ["mandibuzz", 5],
  ] as const) {
    const team = createTeam({ name, move1: "defog" });
    expect(spinner(team, generation, "singles")).toBe(false);
    expect(spinner(team, generation, "doubles")).toBe(true);
    expect(spinner(team, generation)).toBe("depends");
  }
});

test("from Gen 6, Defog removes the user's hazards in every battle format", () => {
  const team = createTeam({ name: "swanna", move1: "defog" });
  for (const generation of [6, 9] as const) {
    expect(spinner(team, generation, "singles")).toBe(true);
    expect(spinner(team, generation, "doubles")).toBe(true);
    expect(spinner(team, generation)).toBe(true);
  }
});

test("only a role that singles and doubles judge differently depends on the battle format", () => {
  // Rapid Spin fills the role in both, so Defog beside it changes nothing
  expect(
    spinner(
      createTeam(
        { name: "hitmontop", move1: "rapidspin" },
        { name: "staraptor", move1: "defog" },
      ),
      4,
    ),
  ).toBe(true);
  expect(
    evaluateChecklist(createTeam({ name: "staraptor", move1: "defog" }), 4)
      .flatMap(group => group.items)
      .filter(item => item.dependsOnBattleFormat)
      .map(item => item.key),
  ).toEqual(["spinner"]);
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

test("Ceaseless Edge sets an entry hazard, as Stone Axe does", () => {
  expect(
    checked(createTeam({ name: "samurotthisui", move1: "ceaselessedge" })),
  ).toEqual(["Entry Hazard"]);
});

test("boosting moves raise the user two stages in total, or are Curse or Belly Drum", () => {
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
  // These raise a foe's or an ally's stats
  for (const move of ["swagger", "decorate", "coaching"])
    expect(boosts(move)).toBe(false);
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

test("priority moves are damaging moves that go first, not status moves like Protect", () => {
  const priority = (name: string, move1: string, generation?: Generation) =>
    checked(createTeam({ name, move1 }), generation).includes("Priority Move");
  expect(priority("weavile", "iceshard")).toBe(true);
  expect(priority("ragingbolt", "thunderclap")).toBe(true);
  // Fake Out had +1 priority before Gen 5
  expect(priority("hitmontop", "fakeout", 3)).toBe(true);
  expect(priority("ragingbolt", "thunderbolt")).toBe(false);
  for (const move of ["protect", "followme"])
    expect(priority("indeedee", move)).toBe(false);
});

test("Curse counts only for non-Ghost users in the selected generation", () => {
  expect(checked(createTeam({ name: "gengar", move1: "curse" }))).toEqual([]);
  const rotom = createTeam({ name: "rotomheat", move1: "curse" });
  const setup = (generation: 4 | 5) =>
    evaluateChecklist(rotom, generation)
      .flatMap(group => group.items)
      .find(item => item.key === "boosting")?.isChecked;
  expect(setup(4)).toBe(false);
  expect(setup(5)).toBe(true);
});

test("Sparkly Swirl is a cleric move", () => {
  expect(
    checked(createTeam({ name: "eeveestarter", move1: "sparklyswirl" })),
  ).toEqual(["Cleric"]);
});

test("callback-driven setup moves count, with historical Stockpile behavior", () => {
  expect(
    checked(createTeam({ name: "drapion", move1: "acupressure" })),
  ).toEqual(["Boosting Move"]);
  const team = createTeam({ name: "pelipper", move1: "stockpile" });
  const setup = (generation: 3 | 4) =>
    evaluateChecklist(team, generation)
      .flatMap(group => group.items)
      .find(item => item.key === "boosting")?.isChecked;
  expect(setup(3)).toBe(false);
  expect(setup(4)).toBe(true);
});

test("setup follows Contrary and Simple, without treating attacks as setup normally", () => {
  const setup = (
    name: string,
    move1: string,
    ability: string,
    generation: 3 | 4 | 5 | 9 = 9,
  ) =>
    evaluateChecklist(createTeam({ name, move1, ability }), generation)
      .flatMap(group => group.items)
      .find(item => item.key === "boosting")?.isChecked;
  expect(setup("malamar", "superpower", "Contrary")).toBe(true);
  expect(setup("lurantis", "leafstorm", "Contrary")).toBe(true);
  expect(setup("lurantis", "swordsdance", "Contrary")).toBe(false);
  expect(setup("lurantis", "stockpile", "Contrary")).toBe(false);
  expect(setup("malamar", "curse", "Contrary")).toBe(false);
  expect(setup("spinda", "superpower", "Own Tempo")).toBe(false);
  expect(setup("spinda", "superpower", "Contrary", 4)).toBe(false);
  expect(setup("spinda", "superpower", "Contrary", 5)).toBe(true);
  expect(setup("numel", "howl", "Simple", 3)).toBe(false);
  expect(setup("numel", "howl", "Simple", 4)).toBe(true);
});

test("Floral Healing heals another pokemon rather than satisfying self-recovery", () => {
  expect(
    checked(createTeam({ name: "comfey", move1: "floralhealing" })),
  ).toEqual([]);
});

test("Yawn counts as a sleep-causing status move", () => {
  expect(checked(createTeam({ name: "slowbro", move1: "yawn" }))).toEqual([
    "Status Move",
  ]);
});

test("Wish pairs with newer protection moves on the same pokemon", () => {
  for (const move2 of ["obstruct", "silktrap", "burningbulwark"])
    expect(
      checked(createTeam({ name: "smeargle", move1: "wish", move2 })),
    ).toEqual(["Reliable Recovery"]);
  expect(
    checked(
      createTeam(
        { name: "smeargle", move1: "wish" },
        { name: "araquanid", move1: "silktrap" },
      ),
    ),
  ).toEqual([]);
});

test("historical checklist roles use that generation's move effects", () => {
  const role = (
    name: string,
    move1: string,
    key: "boosting" | "spinner" | "phazer",
    generation: 1 | 2 | 4 | 5 | 6,
  ) =>
    evaluateChecklist(createTeam({ name, move1 }), generation)
      .flatMap(group => group.items)
      .find(item => item.key === key)?.isChecked;
  expect(role("parasect", "growth", "boosting", 1)).toBe(false);
  expect(role("slowbro", "amnesia", "boosting", 1)).toBe(true);
  expect(role("parasect", "growth", "boosting", 2)).toBe(false);
  expect(role("parasect", "growth", "boosting", 4)).toBe(false);
  expect(role("parasect", "growth", "boosting", 5)).toBe(true);
  expect(role("skarmory", "defog", "spinner", 4)).toBe(false);
  expect(role("skarmory", "defog", "spinner", 5)).toBe(false);
  expect(role("skarmory", "defog", "spinner", 6)).toBe(true);
  expect(role("arcanine", "roar", "phazer", 1)).toBe(false);
  expect(role("arcanine", "roar", "phazer", 2)).toBe(true);
  expect(role("butterfree", "whirlwind", "phazer", 1)).toBe(false);
  expect(role("butterfree", "whirlwind", "phazer", 2)).toBe(true);
});

test("guaranteed selfBoost effects count as setup and follow Contrary", () => {
  const setup = (move1: string, ability: string) =>
    evaluateChecklist(
      createTeam({ name: "kommoo", item: "kommoniumz", move1, ability }),
      7,
    )
      .flatMap(group => group.items)
      .find(item => item.key === "boosting")?.isChecked;
  expect(setup("clangoroussoulblaze", "Soundproof")).toBe(true);
  expect(setup("clangoroussoulblaze", "Contrary")).toBe(false);
  expect(setup("clangingscales", "Soundproof")).toBe(false);
});

test("Assault Vest blocks status moves in every checklist role", () => {
  for (const move of [
    "spikes",
    "defog",
    "slackoff",
    "healbell",
    "toxic",
    "roar",
    "calmmind",
  ]) {
    const team = createTeam({
      name: "smeargle",
      item: "assaultvest",
      ability: "Own Tempo",
      move1: move,
    });
    expect(checked(team)).toEqual([]);
    team[0].item = "";
    expect(checked(team).length).toBeGreaterThan(0);
    team[0].item = "assaultvest";
    team[0].ability = "Klutz";
    expect(checked(team).length).toBeGreaterThan(0);
  }
  expect(
    checked(
      createTeam({
        name: "smeargle",
        item: "assaultvest",
        move1: "wish",
        move2: "protect",
      }),
    ),
  ).toEqual([]);
  expect(
    checked(
      createTeam({ name: "pachirisu", item: "assaultvest", move1: "nuzzle" }),
    ),
  ).toEqual(["Status Move"]);
  expect(
    checked(
      createTeam({ name: "kleavor", item: "assaultvest", move1: "stoneaxe" }),
    ),
  ).toEqual(["Entry Hazard"]);
  expect(
    checked(
      createTeam({ name: "drampa", item: "assaultvest", move1: "dragontail" }),
    ),
  ).toEqual(["Phazer"]);
});

test("Klutz suppresses Choice roles without removing the item", () => {
  for (const item of ["choicescarf", "choiceband", "choicespecs"]) {
    const team = createTeam({ name: "lopunny", item, ability: "Klutz" });
    expect(checked(team)).toEqual([]);
    expect(team[0].item).toBe(item);
    team[0].ability = "Limber";
    expect(checked(team)).toEqual(["Choice Item"]);
  }
});

test("Fling counts the selected item's guaranteed status only when usable", () => {
  const team = createTeam({
    name: "lopunny",
    ability: "Limber",
    move1: "fling",
  });
  const status = (generation: 4 | 7) =>
    evaluateChecklist(team, generation)
      .flatMap(group => group.items)
      .find(item => item.key === "status")?.isChecked;
  for (const item of ["flameorb", "toxicorb", "poisonbarb"]) {
    team[0].item = item;
    expect(status(7)).toBe(true);
    team[0].ability = "Klutz";
    expect(status(7)).toBe(false);
    expect(status(4)).toBe(true);
    team[0].ability = "Limber";
  }
  for (const item of ["ironball", "", "lightball"]) {
    team[0].item = item;
    expect(status(7)).toBe(item === "lightball");
  }
  team[0].name = "arceus";
  team[0].ability = "Multitype";
  team[0].item = "flameorb";
  expect(status(4)).toBe(false);
  expect(status(7)).toBe(true);
});

const isBoosting = (
  member: Parameters<typeof createTeam>[0],
  generation: Generation = 9,
) =>
  evaluateChecklist(createTeam(member), generation)
    .flatMap(group => group.items)
    .find(item => item.key === "boosting")?.isChecked;

test("Tidy Up and Take Heart raise the user two stages in a callback", () => {
  expect(isBoosting({ name: "maushold", move1: "tidyup" })).toBe(true);
  expect(
    isBoosting({ name: "maushold", move1: "tidyup", ability: "Contrary" }),
  ).toBe(false);
  expect(isBoosting({ name: "phione", move1: "takeheart" })).toBe(true);
});

test("Stuff Cheeks counts only while its user holds a Berry", () => {
  const greedent = { name: "greedent", move1: "stuffcheeks" };
  expect(isBoosting({ ...greedent, item: "sitrusberry" })).toBe(true);
  expect(isBoosting({ ...greedent, item: "leftovers" })).toBe(false);
  expect(isBoosting(greedent)).toBe(false);
});

test("Simple doubles Howl after it began boosting allies too in Gen 8", () => {
  for (const generation of [7, 8, 9] as const) {
    expect(
      isBoosting(
        { name: "numel", move1: "howl", ability: "Simple" },
        generation,
      ),
    ).toBe(true);
    expect(
      isBoosting(
        { name: "numel", move1: "howl", ability: "Oblivious" },
        generation,
      ),
    ).toBe(false);
  }
});

test("Gear Up and Magnetic Flux boost their user only with Plus or Minus", () => {
  for (const move1 of ["gearup", "magneticflux"]) {
    expect(isBoosting({ name: "klinklang", move1, ability: "Plus" }, 7)).toBe(
      true,
    );
    expect(isBoosting({ name: "klinklang", move1, ability: "Minus" }, 7)).toBe(
      true,
    );
    expect(
      isBoosting({ name: "klinklang", move1, ability: "Clear Body" }, 7),
    ).toBe(false);
  }
});

test("Rototiller boosts a grounded Grass-type user", () => {
  const tapuBulu = { name: "tapubulu", move1: "rototiller" };
  expect(isBoosting(tapuBulu, 7)).toBe(true);
  expect(isBoosting({ ...tapuBulu, item: "airballoon" }, 7)).toBe(false);
  expect(isBoosting({ name: "bibarel", move1: "rototiller" }, 7)).toBe(false);
});

test("Simple doubles the boost a charging move gives its user", () => {
  expect(
    isBoosting({ name: "bibarel", move1: "skullbash", ability: "Simple" }, 7),
  ).toBe(true);
  expect(
    isBoosting({ name: "bibarel", move1: "skullbash", ability: "Unaware" }, 7),
  ).toBe(false);
});
