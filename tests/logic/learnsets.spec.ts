import { viableMovesIn } from "@/data/viable-moves";
import learnsetsJson from "@/data/learnsets.json" with { type: "json" };
import { test, expect } from "@playwright/test";
import {
  completeLearnset,
  canItLearn,
  canUseItem,
  generationLearnset,
  getTeamLearnsets,
  learnsetsReady,
} from "@/store/learnsets";
import { CAP_FORMAT } from "@/shared/formats";
import { createTeam } from "./shared/team";
import type { Learnsets } from "@/types";

const learnsets: Learnsets = learnsetsJson;

test.beforeAll(() => learnsetsReady);

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

  test("a regional battle forme inherits its regional forme's moves", () => {
    expect(learnsets.darmanitangalarzen).toBeUndefined();
    expect(learnsets.darmanitangalar).toContain("iciclecrash");
    expect(learnsets.darumakagalar).not.toContain("iciclecrash");
    expect(canItLearn("iciclecrash", "darmanitangalarzen")).toBe(true);
    expect(completeLearnset("darmanitangalarzen")).toEqual(
      completeLearnset("darmanitangalar"),
    );
  });

  test("female species and their Megas do not inherit male-only moves", () => {
    expect(canItLearn("wish", "meowstic")).toBe(true);
    expect(canItLearn("wish", "meowsticf")).toBe(false);
    expect(canItLearn("quickguard", "meowsticfmega")).toBe(false);
    expect(canItLearn("earthpower", "meowsticfmega")).toBe(true);
    expect(canItLearn("encore", "indeedee")).toBe(true);
    expect(canItLearn("encore", "indeedeef")).toBe(false);
    expect(canItLearn("followme", "indeedeef")).toBe(true);
  });

  test("independent Lycanroc formes retain their own moves and predecessors", () => {
    expect(canItLearn("accelerock", "lycanroc")).toBe(true);
    expect(canItLearn("accelerock", "lycanrocmidnight")).toBe(false);
    expect(canItLearn("counter", "lycanrocmidnight")).toBe(true);
    expect(canItLearn("thrash", "lycanrocdusk")).toBe(true);
    expect(canItLearn("agility", "lycanrocdusk")).toBe(false);
    expect(canItLearn("happyhour", "lycanrocdusk")).toBe(true);
  });

  test("freely changing Rotom formes retain base moves and their appliance move", () => {
    expect(canItLearn("trick", "rotomfan")).toBe(true);
    expect(canItLearn("airslash", "rotomfan")).toBe(true);
    expect(canItLearn("overheat", "rotomfan")).toBe(false);
  });

  test("Kyurem formes keep their independent moves while Eternal Floette's Mega inherits it", () => {
    expect(canItLearn("glaciate", "kyurem")).toBe(true);
    expect(canItLearn("glaciate", "kyuremblack")).toBe(false);
    expect(canItLearn("fusionbolt", "kyuremblack")).toBe(true);
    expect(canItLearn("lightofruin", "floettemega")).toBe(true);
  });

  test("totems keep their own moves and only their first stage's Gen 9 egg moves", () => {
    expect(canItLearn("bite", "raticatealolatotem")).toBe(true);
    // Kanto Rattata's moves, which Showdown never gives the Alolan totem
    expect(canItLearn("bide", "raticatealolatotem")).toBe(false);
    expect(canItLearn("thunderbolt", "raticatealolatotem")).toBe(false);
    // Alolan Rattata's egg moves, which a totem from an event cannot have
    expect(canItLearn("stockpile", "raticatealolatotem")).toBe(false);
    expect(canItLearn("firefang", "gumshoostotem")).toBe(true);
    expect(canItLearn("psychicfangs", "gumshoostotem")).toBe(false);
  });

  test("cap Pikachu inherit Pichu's Gen 9 egg moves but not its other moves", () => {
    expect(canItLearn("wish", "pikachuoriginal")).toBe(true);
    expect(canItLearn("fakeout", "pikachucosplay")).toBe(true);
    expect(canItLearn("bide", "pikachuoriginal")).toBe(false);
    expect(canItLearn("volttackle", "pikachucosplay")).toBe(false);
  });

  test("a forme without a learnset in a game learns its base forme's moves there", () => {
    // Legends: Z-A gives Super Size Pumpkaboo and Stretchy Tatsugiri no learnset of their own
    expect(learnsets.pumpkaboo).toContain("tackle");
    expect(canItLearn("tackle", "pumpkaboosuper")).toBe(true);
    expect(canItLearn("tackle", "gourgeistsuper")).toBe(true);
    expect(learnsets.tatsugiri).toContain("scald");
    expect(canItLearn("scald", "tatsugiristretchy")).toBe(true);
    expect(completeLearnset("tatsugiristretchy")).toEqual(
      expect.arrayContaining([...completeLearnset("tatsugiri")]),
    );
  });

  test("Indeedee-F still lacks Indeedee's male-only moves", () => {
    expect(canItLearn("psychicnoise", "indeedee")).toBe(true);
    expect(canItLearn("psychicnoise", "indeedeef")).toBe(false);
  });

  test("a regional evolution can inherit from a nonregional predecessor", () => {
    expect(learnsets.marowakalola).not.toContain("bellydrum");
    expect(canItLearn("bellydrum", "marowakalola")).toBe(true);
  });

  test("a forme of a forme learns what that forme does", () => {
    expect(learnsets.darmanitangalarzen).toBeUndefined();
    expect(learnsets.darmanitangalar).toContain("iciclecrash");
    expect(canItLearn("iciclecrash", "darmanitangalarzen")).toBe(true);
    // Darmanitan's own moves stay with the Unovan forme
    expect(learnsets.darmanitan).toContain("flareblitz");
    expect(canItLearn("flareblitz", "darmanitangalarzen")).toBe(
      canItLearn("flareblitz", "darmanitangalar"),
    );
    expect(canItLearn("surgingstrikes", "urshifurapidstrikegmax")).toBe(true);
  });

  test("a regional evolution of a pokemon with a cap forme of that region inherits the pokemon's moves", () => {
    // Pikachu-Alola is a cap, not the Pikachu that Raichu-Alola evolves from
    expect(learnsets.pikachu).toContain("extremespeed");
    expect(learnsets.pikachualola).not.toContain("extremespeed");
    expect(canItLearn("extremespeed", "raichualola")).toBe(true);
  });

  test("Smeargle sketches the moves of other pokemon, but no Z-Moves", () => {
    expect(learnsets.smeargle).not.toContain("fakeout");
    for (const move of ["spore", "fakeout", "followme", "wideguard"])
      expect(canItLearn(move, "smeargle")).toBe(true);
    expect(canItLearn("aciddownpour", "smeargle")).toBe(false);
    expect(canItLearn("catastropika", "smeargle")).toBe(false);
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

  test("viable moves include ones that rely on a forme's required item", () => {
    const [viable = []] = getTeamLearnsets(
      createTeam({ name: "genesectchill" }),
      true,
    ).values;

    expect(viable).toContain("technoblast");
  });
});

test("Viable filtering follows historical Showdown usefulness rules", () => {
  const team = createTeam({ name: "scizor" });
  expect(getTeamLearnsets(team, true, undefined, 3).values[0]).toEqual(
    expect.arrayContaining(["hiddenpowerbug", "hiddenpowerflying"]),
  );
  expect(getTeamLearnsets(team, true, undefined, 7).values[0]).not.toContain(
    "hiddenpowerbug",
  );
  expect(getTeamLearnsets(team, true, undefined, 7).values[0]).not.toContain(
    "hiddenpowerflying",
  );
});

test("mega stones, Memories, and Drives are only for the pokemon that use them", () => {
  for (const [pokemon, item, usable] of [
    ["scovillain", "scovillainite", true],
    ["scovillainmega", "scovillainite", true],
    ["toedscruel", "scovillainite", false],
    ["tatsugiridroopy", "tatsugirinite", true],
    ["tatsugiridroopymega", "tatsugirinite", true],
    ["floetteeternal", "floettite", true],
    ["floette", "floettite", false],
    ["silvallyrock", "ghostmemory", true],
    ["toedscruel", "ghostmemory", false],
    ["genesect", "chilldrive", true],
    ["toedscruel", "chilldrive", false],
    ["toedscruel", "leftovers", true],
    ["", "scovillainite", true],
  ] as const)
    expect(canUseItem(pokemon, item), `${pokemon} ${item}`).toBe(usable);
});

test("the CAP format gives CAP pokemon the moves Showdown's CAP learnsets give a Gen 9 source", () => {
  const kitsunoh = generationLearnset("kitsunoh", 9, CAP_FORMAT);
  // Shadow Strike is CAP-only, so no game has it
  expect(kitsunoh).toEqual(
    expect.arrayContaining(["shadowstrike", "uturn", "meteormash"]),
  );
  for (const move of ["return", "magiccoat", "hiddenpowerfire"]) {
    expect(completeLearnset("kitsunoh")).toContain(move);
    expect(kitsunoh).not.toContain(move);
  }
  // Gen 9 has these moves, but Revenankh learns them only in earlier generations
  const revenankh = generationLearnset("revenankh", 9, CAP_FORMAT);
  for (const move of ["darkestlariat", "throatchop"]) {
    expect(completeLearnset("revenankh")).toContain(move);
    expect(revenankh).not.toContain(move);
  }
  expect(revenankh).toContain("drainpunch");
  // Real pokemon keep Gen 9's own movepools
  expect(generationLearnset("ogerpon", 9, CAP_FORMAT)).toEqual(
    generationLearnset("ogerpon", 9, "OU: Over Used"),
  );
});

test("historical viability excludes usefulness from future abilities", () => {
  expect(viableMovesIn(3).has("bulletseed")).toBe(false);
  expect(viableMovesIn(4).has("bulletseed")).toBe(true);
  expect(viableMovesIn(1).has("wrap")).toBe(true);
});
