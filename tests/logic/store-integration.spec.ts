import { autorun } from "mobx";
import { test, expect } from "./fixtures";

test("defence recomputes after nested species, item, and ability edits", ({ store }) => {
  let groundScore = 0;
  const dispose = autorun(() => { groundScore = store.typeDefence.Ground; });
  try {
    expect(groundScore).toBe(0);
    store.team[0].name = "bronzong";
    expect(groundScore).toBe(-1);
    store.team[0].item = "airballoon";
    expect(groundScore).toBe(0);
    store.team[0].ability = "Levitate";
    expect(groundScore).toBe(1.5);
    store.clearTeamPokemonProperties(0);
    expect(groundScore).toBe(0);
  } finally {
    dispose();
  }
});

test("coverage recomputes after nested move, ability, and species edits", ({ store }) => {
  let dragonScore = 0;
  const dispose = autorun(() => { dragonScore = store.typeCoverage.Dragon; });
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
    store.clearTeamPokemonProperties(0);
    expect(dragonScore).toBe(0);
  } finally {
    dispose();
  }
});

test("learnsets recompute after species and move filter edits", ({ store }) => {
  let learnsets = store.teamLearnsets;
  const dispose = autorun(() => { learnsets = store.teamLearnsets; });
  try {
    expect(learnsets.values[0]).toEqual([]);
    store.team[0].name = "whimsicott";
    expect(learnsets.values[0]).toContain("absorb");
    store.searchFilters.moves = "Viable";
    expect(learnsets.values[0]).not.toContain("absorb");
    expect(learnsets.values[0]).toContain("encore");
    store.team[0].name = "cryogonal";
    expect(learnsets.values[0]).not.toContain("encore");
    expect(learnsets.values[0]).toContain("icebeam");
    expect(learnsets.labels[0][learnsets.values[0].indexOf("icebeam")]).toBe("Ice Beam");
  } finally {
    dispose();
  }
});

test("Pokemon options recompute after each filter and filter replacement", ({ store }) => {
  let names: (string | undefined)[] = [];
  const dispose = autorun(() => { names = store.filteredPokemonNames; });
  try {
    expect(names).toContain("Milotic");
    store.searchFilters.type = "Psychic";
    expect(names).toContain("Medicham");
    expect(names).not.toContain("Milotic");
    expect(names).toContain("Reuniclus");
    store.searchFilters.region = "Hoenn";
    expect(names).toContain("Medicham");
    expect(names).not.toContain("Reuniclus");
    store.searchFilters.format = "Little Cup (LC)";
    expect(names).not.toContain("Medicham");
    expect(names).toContain("Spoink");
    store.searchFilters = { format: "", region: "", type: "", moves: "" };
    expect(names).toContain("Milotic");
  } finally {
    dispose();
  }
});
