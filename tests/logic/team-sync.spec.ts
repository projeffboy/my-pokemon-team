import { test, expect } from "@playwright/test";
import { Store } from "@/store";
import { initialStoredState, type StoredState } from "@/store/teams-storage";
import { createSavedTeam } from "@/shared/team";
import { createTeam } from "./shared/team";

const settle = () => new Promise(resolve => setTimeout(resolve, 500));

function storedTeam() {
  let state = JSON.stringify(initialStoredState());
  let canSave = true;
  const storage = {
    getItem: () => state,
    setItem: (_key: string, value: string) => {
      if (!canSave) throw new Error("QuotaExceededError");
      state = value;
    },
  } as unknown as Storage;
  const store = new Store(storage);
  store.selectTeam(store.teams[0]!.id);
  return {
    store,
    reload: () => new Store(storage),
    setCanSave(value: boolean) {
      canSave = value;
    },
    savedState: () => JSON.parse(state) as StoredState,
    saveFromOtherTab(value: StoredState) {
      state = JSON.stringify(value);
    },
    editOtherTab(edit: (state: StoredState) => void) {
      const theirs = JSON.parse(state) as StoredState;
      edit(theirs);
      state = JSON.stringify(theirs);
      store.sort = { ...store.sort, descending: !store.sort.descending };
    },
  };
}

test("selecting a saved team persists even when identical team text cannot identify it on reload", async () => {
  const { store, savedState, reload } = storedTeam();
  const originalId = store.currentTeamId;
  store.selectPokemon(0, "flamigo");
  await settle();
  const copy = store.duplicateTeam(originalId);
  await settle();
  expect(savedState().currentTeamId).toBe(copy?.id);
  store.selectTeam(originalId);
  await settle();
  expect(savedState().currentTeamId).toBe(originalId);

  const reloaded = reload();
  reloaded.openTeamFromLink(createTeam({ name: "flamigo" }));
  expect(reloaded.currentTeamId).toBe(originalId);
});

test("a failed selection save survives another tab's changes until storage recovers", async () => {
  const { store, savedState, setCanSave, editOtherTab } = storedTeam();
  const originalId = store.currentTeamId;
  store.selectPokemon(0, "espurr");
  await settle();
  const copy = store.duplicateTeam(originalId);
  if (!copy) throw new Error("Missing populated team copy");
  await settle();
  setCanSave(false);
  store.selectTeam(originalId);
  await settle();
  expect(savedState().currentTeamId).toBe(copy.id);
  editOtherTab(state => {
    const other = state.teams.find(team => team.id === copy.id);
    if (other) other.name = "Renamed elsewhere";
  });
  await settle();
  expect(store.currentTeamId).toBe(originalId);
  expect(store.findTeam(copy.id)?.name).toBe("Renamed elsewhere");
  setCanSave(true);
  store.nameView = "grid";
  await settle();
  expect(savedState().currentTeamId).toBe(originalId);
  expect(savedState().teams.find(team => team.id === copy.id)?.name).toBe(
    "Renamed elsewhere",
  );
});

test("a failed save keeps unsaved team edits through later changes and retries when storage recovers", async () => {
  const { store, setCanSave, savedState } = storedTeam();
  expect(store.saveFailed).toBe(false);
  store.selectPokemon(0, "mareanie");
  await settle();
  expect(savedState().teams[0]!.team[0]!.name).toBe("mareanie");

  setCanSave(false);
  store.selectPokemon(0, "toxapex");
  await settle();
  expect(store.team[0]!.name).toBe("toxapex");
  expect(savedState().teams[0]!.team[0]!.name).toBe("mareanie");
  expect(store.saveFailed).toBe(true);

  store.nameView = "grid";
  await settle();
  expect(store.team[0]!.name).toBe("toxapex");
  expect(store.saveFailed).toBe(true);
  expect(store.canUndo).toBe(true);
  setCanSave(true);
  store.nameView = "big-grid";
  await settle();
  expect(savedState().teams[0]!.team[0]!.name).toBe("toxapex");
  expect(store.saveFailed).toBe(false);
});

test("blocked storage reports failure only after an attempted save", async () => {
  let writes = 0;
  const storage = {
    getItem: () => null,
    setItem: () => {
      writes++;
      throw new Error("SecurityError");
    },
  } as unknown as Storage;
  const store = new Store(storage);
  store.openUnsavedTeam(createTeam({ name: "minior" }));
  await settle();
  expect(writes).toBe(0);
  expect(store.saveFailed).toBe(false);
  store.team[0]!.move1 = "shellsmash";
  await settle();
  expect(writes).toBeGreaterThan(0);
  expect(store.saveFailed).toBe(true);
});

test("undoing all pending changes clears a save failure without another write", async () => {
  const { store, setCanSave, savedState } = storedTeam();
  setCanSave(false);
  store.selectPokemon(0, "tandemaus");
  await settle();
  expect(store.saveFailed).toBe(true);
  store.undo();
  await settle();
  expect(store.team).toEqual(savedState().teams[0]!.team);
  expect(store.saveFailed).toBe(false);
});

test("a peer saving this tab's pending changes clears failure even while this tab cannot write", async () => {
  const { store, setCanSave, savedState, saveFromOtherTab } = storedTeam();
  setCanSave(false);
  store.selectPokemon(0, "pawmi");
  await settle();
  expect(store.saveFailed).toBe(true);
  const backup = JSON.parse(store.exportTeamBackup());
  expect(store.saveFailed).toBe(true);
  saveFromOtherTab({ ...savedState(), teams: backup.teams });
  store.exportTeamBackup();
  expect(store.saveFailed).toBe(false);
  expect(store.team[0]!.name).toBe("pawmi");
  store.selectPokemon(0, "pawmo");
  await settle();
  expect(store.saveFailed).toBe(true);
  expect(savedState().teams[0]!.team[0]!.name).toBe("pawmi");
});

test("a draft's first failed save keeps the imported team and its settings", async () => {
  const { store, setCanSave, savedState } = storedTeam();
  setCanSave(false);
  store.openUnsavedTeam(createTeam({ name: "stantler", happiness: 0 }), {
    generation: 2,
  });
  const id = store.currentTeamId;
  store.renameTeam(id, "Long-lived import");
  await settle();
  store.filters.region = "Johto";
  await settle();
  expect(store.currentTeamId).toBe(id);
  expect(store.currentTeam).toMatchObject({
    name: "Long-lived import",
    generation: 2,
    format: "",
    filters: { region: "Johto" },
    team: [{ name: "stantler", happiness: 0 }, {}, {}, {}, {}, {}],
  });
  setCanSave(true);
  store.nameView = "grid";
  await settle();
  expect(savedState().teams.find(team => team.id === id)).toMatchObject({
    name: "Long-lived import",
    generation: 2,
    filters: { region: "Johto" },
    team: [{ name: "stantler", happiness: 0 }, {}, {}, {}, {}, {}],
  });
});

test("another tab's accepted slot edit resets history and becomes the next undo baseline", async () => {
  const { store, editOtherTab } = storedTeam();
  store.selectPokemon(0, "bellibolt");
  await settle();
  expect(store.canUndo).toBe(true);
  editOtherTab(state => {
    state.teams[0]!.team[0]!.name = "glimmora";
  });
  await settle();
  expect(store.team[0]!.name).toBe("glimmora");
  expect(store.canUndo).toBe(false);
  expect(store.canRedo).toBe(false);
  store.selectPokemon(0, "revavroom");
  store.undo();
  expect(store.team[0]!.name).toBe("glimmora");
});

test("another tab's accepted profile edit resets history even when slots stay the same", async () => {
  const { store, editOtherTab } = storedTeam();
  store.selectPokemon(0, "wooper");
  await settle();
  editOtherTab(state => {
    state.teams[0]!.generation = 2;
    state.teams[0]!.format = "";
  });
  await settle();
  expect(store.currentTeam.generation).toBe(2);
  expect(store.canUndo).toBe(false);
});

test("another tab's rename preserves this tab's slot history", async () => {
  const { store, editOtherTab } = storedTeam();
  store.selectPokemon(0, "orthworm");
  await settle();
  editOtherTab(state => {
    state.teams[0]!.name = "Updated team name";
  });
  await settle();
  expect(store.currentTeam.name).toBe("Updated team name");
  expect(store.canUndo).toBe(true);
  store.undo();
  expect(store.team[0]!.name).toBe("");
});

function firstVisit(languages?: readonly string[]) {
  let state: string | null = null;
  let writes = 0;
  const storage = {
    getItem: () => state,
    setItem: (_key: string, value: string) => {
      writes++;
      state = value;
    },
  } as unknown as Storage;
  return {
    store: new Store(storage, languages),
    reload: () => new Store(storage, languages),
    writes: () => writes,
    savedState: () => JSON.parse(state ?? "null") as StoredState | null,
    // Another tab saves without this tab having read it yet
    saveFromOtherTab(edit: (state: StoredState) => void) {
      const theirs = JSON.parse(state ?? "null") as StoredState;
      edit(theirs);
      state = JSON.stringify(theirs);
    },
  };
}

test("a first visit's link becomes its only saved team on the first edit", async () => {
  const { store, writes, savedState, reload } = firstVisit(["fr-FR"]);
  await store.translationReady;
  store.openTeamFromLink(createTeam({ name: "tinkatink", move1: "fairywind" }));
  expect(store.currentTeam.name).toBe("Équipe 1");
  await settle();
  expect(writes()).toBe(0);

  store.team[0]!.move2 = "rockslide";
  await settle();
  const saved = savedState();
  expect(saved?.currentTeamId).toBe(store.currentTeamId);
  expect(saved?.teams).toHaveLength(1);
  expect(saved?.teams[0]).toMatchObject({ name: "Équipe 1" });
  expect(saved?.teams[0]?.team[0]).toMatchObject({
    name: "tinkatink",
    move2: "rockslide",
  });
  expect(reload().teams).toHaveLength(1);
});

test("a first visit's link moved to a new generation keeps the link as Team 1", async () => {
  const { store, savedState } = firstVisit();
  await store.translationReady;
  const linked = createTeam({ name: "flittle" });
  store.openTeamFromLink(linked);
  store.transferTeamGeneration(8, "", linked, true);
  await settle();
  expect(
    savedState()?.teams.map(({ name, team }) => [name, team[0]!.name]),
  ).toEqual([
    ["Team 1", "flittle"],
    ["Team 2", "flittle"],
  ]);
});

test("a returning visitor's link still opens beside the saved team", async () => {
  const { store, savedState } = storedTeam();
  store.openTeamFromLink(createTeam({ name: "cetoddle" }));
  expect(store.currentTeam.name).toBe("Team 2");
  store.team[0]!.move1 = "iceshard";
  await settle();
  expect(savedState().teams.map(({ name }) => name)).toEqual([
    "Team 1",
    "Team 2",
  ]);
});

test("a first visit names its team in the browser's language without saving", async () => {
  const { store, writes, savedState } = firstVisit(["fr-FR"]);
  await store.translationReady;
  expect(store.currentTeam.name).toBe("Équipe 1");
  await settle();
  expect(writes()).toBe(0);
  store.team[0]!.name = "bombirdier";
  await settle();
  expect(savedState()?.teams.map(({ name }) => name)).toEqual(["Équipe 1"]);
});

test("a first visit's link keeps a starting team that another tab has filled", async () => {
  const { store, savedState, saveFromOtherTab } = firstVisit();
  await store.translationReady;
  store.nameView = "grid";
  await settle();
  saveFromOtherTab(theirs => {
    theirs.teams[0]!.team[0]!.name = "orthworm";
  });
  store.openTeamFromLink(createTeam({ name: "glimmet" }));
  store.team[0]!.move1 = "powergem";
  await settle();
  expect(savedState()?.teams.map(({ team }) => team[0]!.name)).toEqual([
    "orthworm",
    "glimmet",
  ]);
});

test("a first visit's link saved beside another tab's team takes the next team name", async () => {
  const { store, savedState, saveFromOtherTab } = firstVisit(["fr-FR"]);
  await store.translationReady;
  store.nameView = "grid";
  await settle();
  saveFromOtherTab(theirs => {
    theirs.teams[0]!.team[0]!.name = "wiglett";
  });
  store.openTeamFromLink(createTeam({ name: "toedscool" }));
  expect(store.currentTeam.name).toBe("Équipe 1");
  store.team[0]!.move1 = "gigadrain";
  await settle();
  expect(
    savedState()?.teams.map(({ name, team }) => [name, team[0]!.name]),
  ).toEqual([
    ["Équipe 1", "wiglett"],
    ["Équipe 2", "toedscool"],
  ]);
  expect(store.currentTeam.name).toBe("Équipe 2");
});

// Two tabs sharing one storage, each counting its own writes
function twoTabs() {
  const saved = initialStoredState();
  saved.teams[0]!.team = createTeam({ name: "sinistcha" });
  saved.teams.push(createSavedTeam({ name: "Second" }));
  let state = JSON.stringify(saved);
  const tab = () => {
    let writes = 0;
    const storage = {
      getItem: () => state,
      setItem: (_key: string, value: string) => {
        writes++;
        state = value;
      },
    } as unknown as Storage;
    return { store: new Store(storage), writes: () => writes };
  };
  return {
    a: tab(),
    b: tab(),
    savedState: () => JSON.parse(state) as StoredState,
    ids: saved.teams.map(({ id }) => id),
  };
}

test("a team duplicated in another tab keeps its place, and an idle tab does not write it back", async () => {
  const { a, b, savedState, ids } = twoTabs();
  const copy = b.store.duplicateTeam(ids[0]!);
  await settle();
  const order = [ids[0], copy?.id, ids[1]];
  expect(savedState().teams.map(({ id }) => id)).toEqual(order);
  a.store.exportTeamBackup();
  expect(a.store.teams.map(({ id }) => id)).toEqual(order);
  await settle();
  expect(a.writes()).toBe(0);
  expect(savedState().teams.map(({ id }) => id)).toEqual(order);
});

test("a tab on an unsaved team keeps another tab's team choice when it saves", async () => {
  const { a, b, savedState, ids } = twoTabs();
  b.store.selectTeam(ids[1]!);
  await settle();
  expect(savedState().currentTeamId).toBe(ids[1]);
  a.store.exportTeamBackup();
  a.store.nameView = "grid";
  await settle();
  expect(a.writes()).toBeGreaterThan(0);
  expect(savedState().currentTeamId).toBe(ids[1]);
});
