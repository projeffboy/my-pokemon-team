import store from "@/store";

// Undo and redo the current team's edits, each reported in the snackbar
export const undoEdit = () => {
  store.undo();
  store.openSnackbar(store.translation.t.team.undone);
};

export const redoEdit = () => {
  store.redo();
  store.openSnackbar(store.translation.t.team.redone);
};
