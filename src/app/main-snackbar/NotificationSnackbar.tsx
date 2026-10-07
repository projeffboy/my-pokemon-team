import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { blue } from "@mui/material/colors";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { SnackbarNotification } from "@/types";
import { undoEdit } from "@/app/shared/history-actions";
import { useTranslation } from "@/app/shared/TranslationContext";

import SnackbarIcon from "./notification-snackbar/SnackbarIcon";

const NotificationSnackbar = observer(function NotificationSnackbar({
  notification,
  age,
}: {
  notification: SnackbarNotification;
  age: number;
}) {
  const { t } = useTranslation();
  const messageId = `snackbar-message-${notification.id}`;

  return (
    <Snackbar
      open
      autoHideDuration={4000}
      onClose={(event, reason) => {
        if (reason === "clickaway") return;
        if (reason === "escapeKeyDown") event?.preventDefault();
        store.closeSnackbar(notification.id);
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        position: "static",
        transform: { xxs: "none", sm: "none" },
        maxWidth: "100%",
        pointerEvents: "auto",
      }}
      slotProps={{
        content: {
          role: "alert",
          "aria-describedby": messageId,
          sx: [
            { flexGrow: 0, maxWidth: 600 },
            age > 0 &&
              (theme => ({
                position: "relative",
                isolation: "isolate",
                bgcolor: "transparent",
                backgroundImage: "none",
                boxShadow: "none",
                "&::before": {
                  content: "''",
                  position: "absolute",
                  inset: 0,
                  zIndex: -1,
                  borderRadius: "inherit",
                  bgcolor: theme.palette.grey[age === 1 ? 700 : 600],
                  filter: `blur(${age === 1 ? 1.25 : 2.5}px)`,
                  pointerEvents: "none",
                },
                ...theme.applyStyles("dark", {
                  "&::before": {
                    bgcolor: theme.palette.grey[age === 1 ? 300 : 400],
                  },
                }),
              })),
          ],
        },
      }}
      message={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SnackbarIcon kind={notification.kind} />
          <span id={messageId}>{notification.message}</span>
        </Box>
      }
      action={
        <>
          {store.canUndoSnackbar(notification) && (
            <Button
              size="small"
              onClick={() => {
                store.closeSnackbar(notification.id);
                undoEdit();
              }}
              sx={theme => ({
                color: blue[200],
                ...theme.applyStyles("dark", { color: blue[900] }),
              })}
            >
              {t.undo}
            </Button>
          )}
          <IconButton
            size="small"
            color="inherit"
            aria-label={t.close}
            onClick={() => store.closeSnackbar(notification.id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
});

export default NotificationSnackbar;
