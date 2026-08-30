import Snackbar from "@mui/material/Snackbar";
import { observer } from "mobx-react";
import store from "../store";

// Snackbar is managed by MobX
// Can be opened by importing store.js then running store.openSnackbar(msg)
const MainSnackbar = observer(function MainSnackbar() {
  return (
    <Snackbar
      open={store.isSnackbarOpen}
      autoHideDuration={2500}
      onClose={() => (store.isSnackbarOpen = false)}
      slotProps={{
        content: {
          role: "alert",
          "aria-describedby": "message-id",
        },
      }}
      message={<span id="message-id">{store.snackbarMsg}</span>}
    />
  );
});

export default MainSnackbar;
