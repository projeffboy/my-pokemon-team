import { test, expect } from "@playwright/test";
import { Store } from "@/store";
import { initialStoredState, type StoredState } from "@/store/teams-storage";
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
  store.selectPokemon(0, "mareanie");
  await settle();
  expect(savedState().teams[0]!.team[0]!.name).toBe("mareanie");

  setCanSave(false);
  store.selectPokemon(0, "toxapex");
  await settle();
  expect(store.team[0]!.name).toBe("toxapex");
  expect(savedState().teams[0]!.team[0]!.name).toBe("mareanie");

  store.nameView = "grid";
  await settle();
  expect(store.team[0]!.name).toBe("toxapex");
  expect(store.canUndo).toBe(true);
  setCanSave(true);
  store.nameView = "big-grid";
  await settle();
  expect(savedState().teams[0]!.team[0]!.name).toBe("toxapex");
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
