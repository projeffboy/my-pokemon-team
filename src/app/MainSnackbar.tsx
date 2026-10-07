import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import { observer } from "mobx-react-lite";
import store from "@/store";
import NotificationSnackbar from "./main-snackbar/NotificationSnackbar";

// Open notifications with `store.openSnackbar(message)`.
const MainSnackbar = observer(function MainSnackbar() {
  return (
    <Portal>
      <Stack
        sx={{
          position: "fixed",
          bottom: 116,
          left: 0,
          right: 0,
          zIndex: theme => theme.zIndex.snackbar,
          px: 1,
          gap: 1,
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {store.snackbars.map((notification, index) => (
          <NotificationSnackbar
            key={notification.id}
            notification={notification}
            age={store.snackbars.length - 1 - index}
          />
        ))}
      </Stack>
    </Portal>
  );
});

export default MainSnackbar;
