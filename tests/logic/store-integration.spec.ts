import { autorun } from "mobx";
import { test, expect } from "./fixtures";
import { LETS_GO, LEGENDS_ZA } from "@/shared/game-variants";
import { createSearchFilters } from "@/shared/team";

test("move selection rejects duplicates but permits changing its own Hidden Power type", ({
  store,
}) => {
  store.selectPokemon(0, "misdreavus");
  store.selectMove(0, "move1", "hiddenpowerice");
  store.selectMove(0, "move2", "hiddenpowerfire");
  expect(store.team[0].move2).toBe("");
  store.selectMove(0, "move1", "hiddenpowerfire");
  expect(store.team[0].move1).toBe("hiddenpowerfire");
  store.selectMove(0, "move2", "shadowball");
  store.selectMove(0, "move3", "shadowball");
  expect(store.team[0].move3).toBe("");
  store.selectMove(0, "move2", "");
  store.selectMove(0, "move3", "shadowball");
  expect(store.team[0].move3).toBe("shadowball");
});

test("Hidden Power selection updates IVs atomically and a rejected duplicate cannot change them", ({
  store,
}) => {
  store.currentTeam.generation = 3;
  store.selectPokemon(0, "misdreavus");
  store.selectMove(0, "move1", "hiddenpowerice");
  expect(store.team[0].ivs).toEqual({ atk: 30, def: 30 });
  store.selectMove(0, "move2", "hiddenpowerfire");
  expect(store.team[0].ivs).toEqual({ atk: 30, def: 30 });
  store.selectMove(0, "move1", "hiddenpowerfire");
  expect(store.team[0].ivs).toEqual({ atk: 30, spa: 30, spe: 30 });
  store.selectMove(0, "move1", "shadowball");
  expect(store.team[0].ivs).toEqual({ atk: 30, spa: 30, spe: 30 });
});

test("defence recomputes after nested species, item, and ability edits", ({
  store,
}) => {
  let groundScore = 0;
  const dispose = autorun(() => {
    groundScore = store.typeDefence.Ground;
  });
  try {
    expect(groundScore).toBe(0);
    store.team[0].name = "bronzong";
    expect(groundScore).toBe(-1);
    store.team[0].item = "airballoon";
    expect(groundScore).toBe(1.5);
    store.team[0].ability = "Levitate";
    expect(groundScore).toBe(1.5);
    store.selectPokemon(0, "");
    expect(groundScore).toBe(0);
  } finally {
    dispose();
  }
});

test("coverage recomputes after nested move, ability, and species edits", ({
  store,
}) => {
  let dragonScore = 0;
  const dispose = autorun(() => {
    dragonScore = store.typeCoverage.Dragon;
  });
  try {
    store.team[0].name = "sylveon";
    store.team[0].move1 = "hypervoice";
    expect(dragonScore).toBe(0);
    store.team[0].ability = "Pixilate";
    expect(dragonScore).toBe(2);
    store.team[0].move1 = "shadowball";
    expect(dragonScore).toBe(0);
    store.team[0].move1 = "hypervoice";
    expect(dragonScore).toBe(2);
    store.team[0].name = "exploud";
    expect(dragonScore).toBe(1);
    store.selectPokemon(0, "");
    expect(dragonScore).toBe(0);
  } finally {
    dispose();
  }
});

test("native game coverage and base-stat sorting follow the team's format", ({
  store,
}) => {
  store.currentTeam.generation = 7;
  store.selectPokemon(0, "oddish");
  store.team[0].move1 = "absorb";
  expect(store.typeCoverage.Water).toBe(0);
  store.currentTeam.format = LETS_GO;
  expect(store.typeCoverage.Water).toBe(2);
  store.currentTeam.generation = 9;
  store.currentTeam.format = LEGENDS_ZA;
  store.sort = { by: "atk", descending: true };
  expect(store.filteredPokemon.indexOf("mawilemega")).toBeLessThan(
    store.filteredPokemon.indexOf("dragonite"),
  );
  store.currentTeam.format = "";
  expect(store.filteredPokemon.indexOf("dragonite")).toBeLessThan(
    store.filteredPokemon.indexOf("mawilemega"),
  );
});

test("coverage recomputes when Arceus changes between a Plate and a Z-Crystal", ({
  store,
}) => {
  store.currentTeam.generation = 7;
  store.selectPokemon(0, "arceusdragon");
  store.team[0].move1 = "judgment";
  expect(store.typeCoverage.Dragon).toBe(2);
  store.team[0].item = "dragoniumz";
  expect(store.typeCoverage.Dragon).toBe(0);
  store.team[0].item = "dracoplate";
  expect(store.typeCoverage.Dragon).toBe(2);
});

test("learnsets recompute after species and move filter edits", ({ store }) => {
  let learnsets = store.teamLearnsets;
  const dispose = autorun(() => {
    learnsets = store.teamLearnsets;
  });
  try {
    expect(learnsets.values[0]).toEqual([]);
    store.team[0].name = "whimsicott";
    expect(learnsets.values[0]).toContain("absorb");
    store.filters.moves = "Viable";
    expect(learnsets.values[0]).not.toContain("absorb");
    expect(learnsets.values[0]).toContain("encore");
    store.team[0].name = "cryogonal";
    expect(learnsets.values[0]).not.toContain("encore");
    expect(learnsets.values[0]).toContain("icebeam");
    expect(learnsets.labels[0][learnsets.values[0].indexOf("icebeam")]).toBe(
      "Ice Beam",
    );
  } finally {
    dispose();
  }
});

test("item options recompute after the Items filter, by generation", ({
  store,
}) => {
  let items = store.teamItems;
  const dispose = autorun(() => {
    items = store.teamItems;
  });
  try {
    expect(items).toContain("pokeball");
    expect(items).toContain("oranberry");
    store.filters.items = "Viable";
    expect(items).not.toContain("pokeball");
    expect(items).not.toContain("oranberry");
    expect(items).toContain("leftovers");
    expect(items).toContain("venusaurite");
    expect(items).toContain("lightball");
    expect(store.gameItems).toContain("pokeball");
    // Sitrus Berry restored only 30 HP before Gen 4
    store.currentTeam.generation = 3;
    expect(store.gameItems).toContain("sitrusberry");
    expect(items).not.toContain("sitrusberry");
    store.currentTeam.generation = 4;
    expect(items).toContain("sitrusberry");
    store.filters.items = "";
    store.currentTeam.generation = 3;
    expect(items).toContain("sitrusberry");
  } finally {
    dispose();
  }
});

test("each slot's item options follow its pokemon under the Items filter", ({
  store,
}) => {
  let items = store.slotItems;
  const dispose = autorun(() => {
    items = store.slotItems;
  });
  try {
    store.selectPokemon(0, "pyroar");
    expect(items[0]).toBe(store.teamItems);
    store.filters.items = "Viable";
    expect(items[0]).toContain("pyroarite");
    expect(items[0]).not.toContain("dragalgite");
    expect(items[0]).toContain("leftovers");
    // An empty slot has no pokemon to judge by
    expect(items[1]).toContain("dragalgite");
    store.selectPokemon(1, "dragalge");
    expect(items[1]).toContain("dragalgite");
    expect(items[1]).not.toContain("pyroarite");
    store.filters.items = "";
    expect(items[0]).toContain("dragalgite");
  } finally {
    dispose();
  }
});

test("Pokemon options recompute after each filter and filter replacement", ({
  store,
}) => {
  let names: (string | undefined)[] = [];
  const dispose = autorun(() => {
    names = store.filteredPokemonNames;
  });
  try {
    expect(names).toContain("Milotic");
    store.filters.type = "Psychic";
    expect(names).toContain("Medicham");
    expect(names).not.toContain("Milotic");
    expect(names).toContain("Reuniclus");
    store.filters.region = "Hoenn";
    expect(names).toContain("Medicham");
    expect(names).not.toContain("Reuniclus");
    store.currentTeam.format = "Little Cup (LC)";
    expect(names).not.toContain("Medicham");
    expect(names).toContain("Spoink");
    store.filters = createSearchFilters();
    store.currentTeam.format = "";
    expect(names).toContain("Milotic");
  } finally {
    dispose();
  }
});

test("a past generation leaves out pokemon its games lack, and the latest lists every pokemon", ({
  store,
}) => {
  // Greninja was not in Sword and Shield, so it would have no moves there
  expect(store.filteredPokemon).toContain("greninja");
  store.currentTeam.generation = 8;
  expect(store.filteredPokemon).not.toContain("greninja");
  expect(store.filteredPokemon).toContain("corviknight");
  expect(store.filterAbilities).not.toContain("Battle Bond");
  store.currentTeam.generation = 7;
  expect(store.filteredPokemon).toContain("greninja");
  expect(store.filterAbilities).toContain("Battle Bond");
});

test("a past generation keeps the pokemon that learn no moves in any game", ({
  store,
}) => {
  store.currentTeam.generation = 5;
  expect(store.filteredPokemon).toContain("pokestarufo");
});

test("choosing Giratina-Origin fills in the item its generation has", ({
  store,
}) => {
  store.currentTeam.generation = 4;
  store.selectPokemon(0, "giratinaorigin");
  expect(store.team[0].item).toBe("griseousorb");
  store.currentTeam.generation = 9;
  store.selectPokemon(1, "giratinaorigin");
  expect(store.team[1].item).toBe("griseouscore");
});
