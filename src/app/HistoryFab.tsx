import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { observer } from "mobx-react-lite";
import store from "@/store";

// Undo and redo the current team's edits
const HistoryFab = observer(function HistoryFab() {
  const buttons = [
    {
      label: "Undo",
      Icon: UndoIcon,
      enabled: store.canUndo,
      act: () => store.undo(),
    },
    {
      label: "Redo",
      Icon: RedoIcon,
      enabled: store.canRedo,
      act: () => store.redo(),
    },
  ];

  return (
    <Box
      role="group"
      aria-label="History"
      sx={{
        position: "fixed",
        right: { xs: 16, md: 24 },
        bottom: 116,
        display: "flex",
        gap: 1,
        zIndex: "fab",
      }}
    >
      {buttons.map(({ label, Icon, enabled, act }) => (
        <Tooltip key={label} title={label}>
          <span>
            <Fab
              size="small"
              color="primary"
              aria-label={label}
              disabled={!enabled}
              onClick={act}
            >
              <Icon />
            </Fab>
          </span>
        </Tooltip>
      ))}
    </Box>
  );
});

export default HistoryFab;
