import { test, expect } from "./fixtures";
import { stableJson } from "@/store/teams-storage";

test("only the three latest notifications remain, even with repeated messages", ({
  store,
}) => {
  for (const message of ["first", "second", "repeat", "repeat"])
    store.openSnackbar(message);
  expect(store.snackbars.map(({ message }) => message)).toEqual([
    "second",
    "repeat",
    "repeat",
  ]);
  expect(new Set(store.snackbars.map(({ id }) => id)).size).toBe(3);
  const middle = store.snackbars[1];
  if (!middle) throw new Error("Missing middle notification");
  store.closeSnackbar(middle.id);
  expect(store.snackbars.map(({ message }) => message)).toEqual([
    "second",
    "repeat",
  ]);
});

test("an older Undo action cannot undo a different edit or another team's history", async ({
  store,
}) => {
  store.team[0].name = "tropius";
  store.openSnackbar("Randomized pokemon", true);
  const notification = store.snackbars[0];
  if (!notification) throw new Error("Missing notification");
  expect(store.canUndoSnackbar(notification)).toBe(true);
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(store.canUndoSnackbar(notification)).toBe(true);
  store.team[0].move1 = "airslash";
  expect(store.canUndoSnackbar(notification)).toBe(false);
  await new Promise(resolve => setTimeout(resolve, 500));
  store.team[0].move1 = "";
  expect(store.canUndoSnackbar(notification)).toBe(false);
  store.addTeam();
  expect(store.canUndoSnackbar(notification)).toBe(false);
});

test("notifications keep their action icon kind independently of message text", ({
  store,
}) => {
  store.openSnackbar("Copied", false, "link");
  store.openSnackbar("Copied", false, "copy");
  store.openSnackbar("Notice");
  expect(store.snackbars.map(({ kind }) => kind)).toEqual([
    "link",
    "copy",
    "info",
  ]);
});

test("undo and redo describe a swap by naming both pokemon", async ({
  store,
}) => {
  store.selectPokemon(0, "porygon");
  store.selectPokemon(1, "exploud");
  await new Promise(resolve => setTimeout(resolve, 500));
  store.swapSlots(0, 1);
  expect(store.undo()).toBe("Undo swap Exploud and Porygon");
  expect(store.redo()).toBe("Redo swap Exploud and Porygon");
});

test("random team history keeps its action between adjacent edits and repeated undo/redo", async ({
  store,
}) => {
  store.selectPokemon(0, "whiscash");
  await new Promise(resolve => setTimeout(resolve, 500));
  store.team[0].move1 = "surf";
  const original = stableJson(store.team);
  store.randomizeTeam();
  const randomized = stableJson(store.team);
  expect(randomized).not.toBe(original);
  expect(store.undo()).toBe("Undo randomize team");
  expect(stableJson(store.team)).toBe(original);
  expect(store.undo()).toBe("Undo add Surf to Whiscash");
  expect(store.redo()).toBe("Redo add Surf to Whiscash");
  expect(store.redo()).toBe("Redo randomize team");
  expect(stableJson(store.team)).toBe(randomized);
  expect(store.undo()).toBe("Undo randomize team");
  expect(store.redo()).toBe("Redo randomize team");
  store.team[0].item = "";
  expect(store.undo()).not.toBe("Undo randomize team");
  expect(stableJson(store.team)).toBe(randomized);
  expect(store.undo()).toBe("Undo randomize team");
  store.addTeam();
  expect(store.undo()).toBeUndefined();
  expect(store.redo()).toBeUndefined();
});
