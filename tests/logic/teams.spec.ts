import { test, expect } from "./fixtures";
import { createTeam } from "./shared/team";
import { completeLearnset } from "@/store/learnsets";
import { pokemonTypes } from "@/shared/pokedex";

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

  test("selects, renames, duplicates, and deletes teams", ({ store }) => {
    const first = store.currentTeam;
    first.team[0].name = "milotic";
    const second = store.addTeam({ name: "Rain" });

    store.selectTeam("missing");
    expect(store.currentTeamId).toBe(second.id);
    store.selectTeam(first.id);
    expect(store.team[0].name).toBe("milotic");

    store.setTeamSettings(first.id, {
      name: "Stall",
      generation: 6,
      format: "OU: Over Used",
    });
    expect(first).toMatchObject({ name: "Stall", generation: 6 });

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

  test("opens a linked team in the empty current team, a matching saved team, or a new team", ({
    store,
  }) => {
    const linked = createTeam({ name: "milotic", move1: "scald" });
    store.openTeamFromLink(linked);
    expect(store.teams).toHaveLength(1);
    expect(store.team[0].name).toBe("milotic");

    store.openTeamFromLink(createTeam({ name: "milotic", move1: "scald" }));
    expect(store.teams).toHaveLength(1);

    const first = store.currentTeam;
    store.openTeamFromLink(createTeam({ name: "kingdra" }));
    expect(store.teams).toHaveLength(2);
    expect(store.team[0].name).toBe("kingdra");

    store.openTeamFromLink(createTeam({ name: "milotic", move1: "scald" }));
    expect(store.teams).toHaveLength(2);
    expect(store.currentTeamId).toBe(first.id);
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

  test("randomizes a slot from the filtered pokemon with a full set", ({
    store,
  }) => {
    store.filters.type = "Fire";
    store.randomizeSlot(1);
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

  test("switching teams starts a fresh history", async ({ store }) => {
    store.team[0].name = "milotic";
    await settle();
    store.addTeam();
    await settle();
    expect(store.canUndo).toBe(false);
    store.undo();
    expect(store.isTeamEmpty).toBe(true);
  });
});
