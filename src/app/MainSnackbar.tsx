import Snackbar from "@mui/material/Snackbar";
import { observer } from "mobx-react-lite";
import store from "@/store";

// Snackbar is managed by MobX
// Open it with `store.openSnackbar(message)` from `@/store`
const MainSnackbar = observer(function MainSnackbar() {
  return (
    <Snackbar
      open={store.isSnackbarOpen}
      autoHideDuration={2500}
      onClose={() => (store.isSnackbarOpen = false)}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        content: {
          role: "alert",
          "aria-describedby": "message-id",
        },
      }}
      message={<span id="message-id">{store.snackbarMessage}</span>}
    />
  );
});

export default MainSnackbar;
