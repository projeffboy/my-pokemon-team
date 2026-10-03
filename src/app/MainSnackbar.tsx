import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { blue } from "@mui/material/colors";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { undoEdit } from "@/app/shared/history-actions";
import { useTranslation } from "@/app/shared/TranslationContext";

// Snackbar is managed by MobX
// Open it with `store.openSnackbar(message)` from `@/store`
const MainSnackbar = observer(function MainSnackbar() {
  const { t } = useTranslation();

  return (
    <Snackbar
      open={store.isSnackbarOpen}
      autoHideDuration={4000}
      onClose={() => (store.isSnackbarOpen = false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      // Above the bottom ad
      sx={{ bottom: { xxs: 116, sm: 116 } }}
      slotProps={{
        content: {
          role: "alert",
          "aria-describedby": "message-id",
          // Only as wide as its message on phones, instead of edge to edge
          sx: { flexGrow: 0 },
        },
      }}
      message={<span id="message-id">{store.snackbarMessage}</span>}
      action={
        store.isSnackbarUndoable && (
          <Button
            size="small"
            onClick={undoEdit}
            // The snackbar is dark in the light scheme and light in the dark one
            sx={theme => ({
              color: blue[200],
              ...theme.applyStyles("dark", { color: blue[900] }),
            })}
          >
            {t.undo}
          </Button>
        )
      }
    />
  );
});

export default MainSnackbar;
