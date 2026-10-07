import { test, expect } from "./fixtures";
import { createTeam } from "./shared/team";
import { completeLearnset } from "@/store/learnsets";
import { pokemonTypes } from "@/shared/pokedex";
import { setDetail, setStat } from "@/shared/set-details";
import { sanitizeTeam } from "@/store/teams-storage";
import { parseTeamText, serializeTeam } from "@/store/team-text";
import { CHAMPIONS_FORMAT } from "@/shared/formats";

const settle = () => new Promise(resolve => setTimeout(resolve, 500));

test.describe("saved teams", () => {
  test("starts with one team, and new teams inherit its generation and format", ({
    store,
  }) => {
    expect(store.teams).toHaveLength(1);
    expect(store.currentTeam).toMatchObject({ name: "Team 1", generation: 9 });
    store.currentTeam.generation = 7;
    store.currentTeam.format = "UU: Under Used";

    const added = store.addTeam();
    expect(added).toMatchObject({
      name: "Team 2",
      generation: 7,
      format: "UU: Under Used",
    });
    expect(store.currentTeamId).toBe(added.id);
    expect(store.isTeamEmpty).toBe(true);

    store.teams[0].name = "Team 3";
    expect(store.addTeam().name).toBe("Team 4");
  });

  test("New Team reuses an empty team of the same generation", ({ store }) => {
    const first = store.currentTeamId;
    expect(store.openEmptyTeam()).toMatchObject({
      team: { id: first },
      isNew: false,
    });

    store.team[0].name = "kingdra";
    const { team: second, isNew } = store.openEmptyTeam();
    expect(isNew).toBe(true);
    expect(store.currentTeamId).toBe(second.id);

    // Another empty team is reused, but not one of another generation
    store.selectTeam(first);
    expect(store.openEmptyTeam().team.id).toBe(second.id);
    store.currentTeam.generation = 8;
    store.selectTeam(first);
    expect(store.openEmptyTeam().isNew).toBe(true);
    expect(store.teams).toHaveLength(3);
  });

  test("does not duplicate empty saved teams or drafts", ({ store }) => {
    const id = store.currentTeamId;
    const count = store.teams.length;
    expect(store.duplicateTeam(id)).toBeUndefined();
    expect(store.teams).toHaveLength(count);
    expect(store.currentTeamId).toBe(id);
    store.openUnsavedTeam();
    const draftId = store.currentTeamId;
    expect(store.duplicateTeam(draftId)).toBeUndefined();
    expect(store.teams).toHaveLength(count);
    expect(store.currentTeamId).toBe(draftId);
  });

  test("selects, renames, duplicates, and deletes teams", ({ store }) => {
    const first = store.currentTeam;
    first.team[0].name = "milotic";
    const second = store.addTeam({ name: "Rain" });

    store.selectTeam("missing");
    expect(store.currentTeamId).toBe(second.id);
    store.selectTeam(first.id);
    expect(store.team[0].name).toBe("milotic");

    store.renameTeam(first.id, "Stall");
    expect(first).toMatchObject({ name: "Stall", generation: 9 });

    const copy = store.duplicateTeam(first.id);
    expect(store.teams.map(({ name }) => name)).toEqual([
      "Stall",
      "Stall copy",
      "Rain",
    ]);
    expect(store.currentTeamId).toBe(copy?.id);
    store.team[0].name = "kingdra";
    expect(first.team[0].name).toBe("milotic");

    store.deleteTeam(copy?.id ?? "");
    expect(store.currentTeamId).toBe(second.id);
    store.deleteTeam(second.id);
    store.deleteTeam(first.id);
    expect(store.teams).toHaveLength(1);
    expect(store.currentTeam.name).toBe("Team 1");
    expect(store.isTeamEmpty).toBe(true);
  });

  test("keeps unfamiliar links unsaved until edited and reopens matching saved teams", ({
    store,
  }) => {
    const first = store.currentTeam;
    store.selectPokemon(0, "milotic");
    store.team[0].move1 = "scald";
    store.openTeamFromLink(parseTeamText(serializeTeam(store.team)));
    expect(store.currentTeamId).toBe(first.id);

    store.openTeamFromLink(createTeam({ name: "kingdra" }));
    const draft = store.currentTeam;
    expect(store.teams).toHaveLength(1);
    expect(store.team[0].name).toBe("kingdra");
    expect(first.team[0].name).toBe("milotic");

    store.team[0].move1 = "surf";
    expect(store.teams).toHaveLength(2);
    expect(store.currentTeamId).toBe(draft.id);
    expect(store.findTeam(draft.id)).toBe(store.currentTeam);

    store.openTeamFromLink(createTeam({ name: "milotic", move1: "scald" }));
    expect(store.currentTeamId).toBe(first.id);
    expect(store.teams).toHaveLength(2);
  });

  test("a matching link keeps the selected copy when saved teams have identical text", ({
    store,
  }) => {
    store.selectPokemon(0, "carbink");
    const copy = store.duplicateTeam(store.currentTeamId);
    store.openTeamFromLink(parseTeamText(serializeTeam(store.team)));
    expect(store.currentTeamId).toBe(copy?.id);
    expect(store.teams).toHaveLength(2);
  });

  test("discarding an unedited draft leaves saved teams unchanged", ({
    store,
  }) => {
    const first = store.currentTeam;
    store.selectPokemon(0, "milotic");
    store.openTeamFromLink(createTeam({ name: "kingdra" }));
    store.openTeamFromLink(createTeam({ name: "tentacruel" }));
    expect(store.teams).toHaveLength(1);
    store.selectTeam(first.id);
    expect(store.currentTeamId).toBe(first.id);
    expect(store.teams).toHaveLength(1);
  });

  test("a draft's first edit can be undone without losing the imported team", async ({
    store,
  }) => {
    store.openTeamFromLink(createTeam({ name: "kingdra" }));
    await settle();
    expect(store.canUndo).toBe(false);
    store.team[0].name = "kingdra";
    expect(store.teams).toHaveLength(1);
    store.team[0].move1 = "surf";
    await settle();
    expect(store.teams).toHaveLength(2);
    store.undo();
    expect(store.team[0]).toMatchObject({ name: "kingdra", move1: "" });
    store.redo();
    expect(store.team[0].move1).toBe("surf");
  });

  test("fresh drafts are distinct and settings edits save the current draft", ({
    store,
  }) => {
    store.openUnsavedTeam();
    const firstDraft = store.currentTeamId;
    store.openUnsavedTeam();
    expect(store.currentTeamId).not.toBe(firstDraft);
    expect(store.teams).toHaveLength(1);
    store.renameTeam(store.currentTeamId, "Draft renamed");
    expect(store.teams).toHaveLength(2);
    expect(store.currentTeam).toMatchObject({
      name: "Draft renamed",
      generation: 9,
    });
  });
});

test.describe("slot tools", () => {
  test("swaps two slots and ignores a slot that does not exist", ({
    store,
  }) => {
    store.team[0].name = "milotic";
    store.team[2].name = "kingdra";
    store.swapSlots(0, 2);
    expect(store.teamPokemon.slice(0, 3)).toEqual(["kingdra", "", "milotic"]);
    store.swapSlots(2, 6);
    expect(store.team[2].name).toBe("milotic");
  });

  test("moves a pokemon to another slot, shifting the ones in between", ({
    store,
  }) => {
    store.team[0].name = "clodsire";
    store.team[1].name = "kilowattrel";
    store.team[3].name = "bombirdier";
    store.moveSlot(0, 3);
    expect(store.teamPokemon).toEqual([
      "kilowattrel",
      "",
      "bombirdier",
      "clodsire",
      "",
      "",
    ]);
    store.moveSlot(3, 1);
    expect(store.teamPokemon.slice(0, 4)).toEqual([
      "kilowattrel",
      "clodsire",
      "",
      "bombirdier",
    ]);
    store.moveSlot(1, 6);
    expect(store.team[1].name).toBe("clodsire");
  });

  test("randomizes a slot from the filtered pokemon with a full set", ({
    store,
  }) => {
    store.filters.type = "Fire";
    expect(store.randomizeSlot(1)).toBe("Randomized pokemon");
    const member = store.team[1];
    expect(pokemonTypes(member.name)).toContain("Fire");
    expect(store.filteredPokemon).toContain(member.name);
    const moves = [member.move1, member.move2, member.move3, member.move4];
    expect(new Set(moves).size).toBe(4);
    for (const move of moves) {
      expect(completeLearnset(member.name)).toContain(move);
    }
    store.randomizeSlot(6);
    expect(store.team[0].name).toBe("");
  });

  test("randomizes the whole team with six different pokemon", ({ store }) => {
    store.randomizeTeam();
    const pokemon = store.teamPokemon;
    expect(pokemon.every(name => name)).toBe(true);
    expect(new Set(pokemon).size).toBe(6);
  });

  test("a link to the current team, with details set in any order, opens no new team", ({
    store,
  }) => {
    store.selectPokemon(0, "gliscor");
    const member = store.team[0];
    setStat(member, "evs", "spe", 252);
    setStat(member, "evs", "hp", 252);
    setDetail(member, "nature", "jolly");
    setDetail(member, "level", 50);
    setDetail(member, "gender", "F");
    setDetail(member, "nickname", "Batty");
    // As a reload does: the saved team, then the team of the address bar
    store.team = sanitizeTeam(JSON.parse(JSON.stringify(store.team)));
    store.openTeamFromLink(parseTeamText(serializeTeam(store.team)));
    expect(store.teams).toHaveLength(1);
    expect(store.team[0]).toMatchObject({ name: "gliscor", nickname: "Batty" });
  });

  test("a link to the current team opens no new team when the team holds what the text leaves out", ({
    store,
  }) => {
    // An empty slot before a pokemon, a gender the text does not write, and a
    // nickname that ends in a space
    store.selectPokemon(1, "magnezone");
    setDetail(store.team[1], "gender", "N");
    setDetail(store.team[1], "nickname", "Magnet ");
    store.team = sanitizeTeam(JSON.parse(JSON.stringify(store.team)));
    store.openTeamFromLink(parseTeamText(serializeTeam(store.team)));
    expect(store.teams).toHaveLength(1);
    expect(store.teamPokemon.slice(0, 2)).toEqual(["", "magnezone"]);
  });

  test("randomizing the whole team repeats nobody when six options remain", ({
    store,
  }) => {
    store.filters.ability = "Forewarn";
    const options = [
      "drowzee",
      "hypno",
      "jynx",
      "smoochum",
      "munna",
      "musharna",
    ];
    expect([...store.filteredPokemon].sort()).toEqual([...options].sort());
    options.forEach((pokemon, i) => store.selectPokemon(i, pokemon));
    for (let run = 0; run < 20; run++) {
      store.randomizeTeam();
      expect([...store.teamPokemon].sort()).toEqual([...options].sort());
    }
  });

  test("selecting a pokemon clears its details, and resetting keeps the set", ({
    store,
  }) => {
    const member = store.team[0];
    member.name = "milotic";
    member.move1 = "scald";
    member.level = 50;
    member.evs = { hp: 252 };
    store.resetDetails(0);
    expect(member).toEqual(createTeam({ name: "milotic", move1: "scald" })[0]);

    member.shiny = true;
    store.selectPokemon(0, "kingdra");
    expect(member.shiny).toBeUndefined();
  });
});

test.describe("undo and redo", () => {
  for (const [generation, format] of [
    [7, ""],
    [9, CHAMPIONS_FORMAT],
  ] as const) {
    test(`switching to generation ${generation} ${format} resets both history stacks and pending edits`, async ({
      store,
    }) => {
      store.team[0].name = "wartortle";
      await settle();
      store.team[0].move1 = "surf";
      await settle();
      store.team[0].move1 = "waterpulse";
      store.undo();
      expect(store.canUndo).toBe(true);
      expect(store.canRedo).toBe(true);
      store.team[0].ability = "Torrent";

      const transferred = createTeam({
        name: "wartortle",
        move1: "surf",
        ability: "Torrent",
      });
      const baseline = structuredClone(transferred);
      store.transferTeamGeneration(generation, format, transferred, false);
      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(false);
      expect(store.undo()).toBeUndefined();
      expect(store.redo()).toBeUndefined();
      await settle();
      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(false);

      store.team[0].move1 = "waterpulse";
      store.undo();
      expect(store.team).toEqual(baseline);
      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(true);
    });
  }

  test("steps back through bursts of edits and forward again", async ({
    store,
  }) => {
    await settle();
    expect(store.canUndo).toBe(false);
    store.team[0].name = "milotic";
    store.team[0].move1 = "scald";
    await settle();
    store.team[1].name = "kingdra";
    await settle();
    expect(store.canUndo).toBe(true);

    store.undo();
    expect(store.teamPokemon.slice(0, 2)).toEqual(["milotic", ""]);
    store.undo();
    expect(store.isTeamEmpty).toBe(true);
    expect(store.canUndo).toBe(false);
    expect(store.canRedo).toBe(true);

    store.redo();
    expect(store.team[0]).toMatchObject({ name: "milotic", move1: "scald" });
    store.redo();
    expect(store.team[1].name).toBe("kingdra");
    expect(store.canRedo).toBe(false);
    await settle();
    expect(store.canUndo).toBe(true);
  });

  test("a new edit after undoing drops the redo history", async ({ store }) => {
    store.team[0].name = "milotic";
    await settle();
    store.undo();
    store.team[0].name = "kingdra";
    await settle();
    expect(store.canRedo).toBe(false);
    store.undo();
    expect(store.team[0].name).toBe("");
  });

  test("undoing right after an edit undoes that edit alone", async ({
    store,
  }) => {
    store.team[0].name = "milotic";
    await settle();
    store.team[1].name = "kingdra";
    await settle();
    store.team[2].name = "gliscor";
    store.undo();
    expect(store.teamPokemon.slice(0, 3)).toEqual(["milotic", "kingdra", ""]);
    store.redo();
    expect(store.team[2].name).toBe("gliscor");
  });

  test("switching teams starts a fresh history", async ({ store }) => {
    store.team[0].name = "milotic";
    await settle();
    store.addTeam();
    await settle();
    expect(store.canUndo).toBe(false);
    store.undo();
    expect(store.isTeamEmpty).toBe(true);
  });

  test("undo and redo name the original action, and no-op history has no message", async ({
    store,
  }) => {
    await settle();
    expect(store.undo()).toBeUndefined();
    store.team[0].name = "scolipede";
    store.team[0].move1 = "poisonjab";
    await settle();
    store.team[0].move1 = "megahorn";
    expect(store.undo()).toBe(
      "Undo replace Poison Jab with Megahorn for Scolipede",
    );
    expect(store.redo()).toBe(
      "Redo replace Poison Jab with Megahorn for Scolipede",
    );
    expect(store.redo()).toBeUndefined();
  });
});

test("filters belong to each team and duplicated teams keep an independent copy", ({
  store,
}) => {
  const first = store.currentTeam;
  store.selectPokemon(0, "ariados");
  store.filters = {
    type: "Bug",
    region: "Johto",
    ability: "Swarm",
    moves: "Viable",
  };
  const second = store.addTeam();
  expect(store.filters).toEqual({
    type: "",
    region: "",
    ability: "",
    moves: "",
  });
  store.filters.type = "Flying";
  store.selectTeam(first.id);
  expect(store.filters).toEqual(first.filters);
  expect(store.filters.type).toBe("Bug");
  const copy = store.duplicateTeam(first.id)!;
  expect(store.filters).toEqual(first.filters);
  store.filters.type = "Poison";
  expect(first.filters.type).toBe("Bug");
  expect(store.currentTeam.id).toBe(copy.id);
  expect(store.currentTeam.filters.type).toBe("Poison");
  store.selectTeam(second.id);
  expect(store.filters.type).toBe("Flying");
});

test("generation transfer can modify the current team or keep an unsaved original as a separate team", ({
  store,
}) => {
  store.openUnsavedTeam(createTeam({ name: "gorebyss", move1: "surf" }));
  const originalId = store.currentTeamId;
  store.transferTeamGeneration(
    2,
    "",
    createTeam({ name: "seadra", move1: "surf" }),
    true,
  );
  expect(store.findTeam(originalId)?.team[0]!.name).toBe("gorebyss");
  expect(store.findTeam(originalId)?.generation).toBe(9);
  expect(store.currentTeamId).not.toBe(originalId);
  expect(store.currentTeam.generation).toBe(2);
  const newId = store.currentTeamId;
  store.transferTeamGeneration(1, "", createTeam({ name: "seadra" }), false);
  expect(store.currentTeamId).toBe(newId);
  expect(store.team[0]!.move1).toBe("");
  expect(store.findTeam(originalId)?.team[0]!.move1).toBe("surf");
});

test("renaming another team keeps its generation, format, slots, and the open team's history", async ({
  store,
}) => {
  store.team[0].name = "dewgong";
  store.currentTeam.generation = 7;
  store.currentTeam.format = "UU: Under Used";
  const sourceId = store.currentTeamId;
  store.addTeam();
  store.team[0].name = "misdreavus";
  await settle();
  store.renameTeam(sourceId, "Ice team");
  expect(store.findTeam(sourceId)).toMatchObject({
    name: "Ice team",
    generation: 7,
    format: "UU: Under Used",
    team: createTeam({ name: "dewgong" }),
  });
  expect(store.team[0]!.name).toBe("misdreavus");
  expect(store.canUndo).toBe(true);
});
