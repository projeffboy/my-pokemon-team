import Snackbar from "@mui/material/Snackbar";
import { Observer } from "mobx-react";
import store from "store";

const MainSnackbar = () => (
  <Observer>
    {() => (
      <Snackbar
        open={store.isSnackbarOpen}
        autoHideDuration={2500}
        onClose={() => (store.isSnackbarOpen = false)}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={<span id="message-id">{store.snackbarMsg}</span>}
      />
    )}
  </Observer>
);

export default MainSnackbar;
