import store from "@/store";

// Undo and redo the current team's edits, each reported in the snackbar
export const undoEdit = () => {
  const change = store.undo();
  if (change) store.openSnackbar(change, false, "undo");
};

export const redoEdit = () => {
  const change = store.redo();
  if (change) store.openSnackbar(change, false, "redo");
};
